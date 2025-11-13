'use client';

import { useState, useEffect, useRef, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { grades, fileCategories } from '@/lib/data';
import type { UploadedFile } from '@/lib/types';
import { useTranslation } from '@/context/language-context';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { UserContext } from '@/context/user-context';


const uploadFile = (file: File, path: string, onProgress: (percentage: number) => void): Promise<string> => {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                onProgress(progress);
            },
            (error) => {
                console.error('Upload failed:', error);
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
};


interface FileUploadFormProps {
  onSave: (fileData: Omit<UploadedFile, 'id'> | UploadedFile) => void;
  teacherId: string;
  existingFile?: UploadedFile;
  onDone: () => void;
}

export function FileUploadForm({ onSave, teacherId, existingFile, onDone }: FileUploadFormProps) {
  const { t } = useTranslation();
  
  const [fileName, setFileName] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number | undefined>();
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingFile) {
        setFileName(existingFile.fileName);
        setSelectedGrade(existingFile.gradeId);
        setSelectedCategory(existingFile.categoryId);
        setSelectedSemester(existingFile.semester);
    } else {
        resetForm();
    }
  }, [existingFile]);

  const resetForm = () => {
    setFileName('');
    setSelectedGrade('');
    setSelectedCategory('');
    setSelectedSemester(undefined);
    setFileToUpload(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
    setIsUploading(false);
    setUploadProgress(0);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
        setFileName(selectedFile.name);
        setFileToUpload(selectedFile);
    }
  }

  const handleSave = async () => {
    if (!selectedGrade || !selectedCategory || !selectedSemester) {
        alert(t('uploads.toast.missing.description'));
        return;
    }

    if (fileToUpload) {
        setIsUploading(true);
        setUploadProgress(0);

        const filePath = `uploads/${teacherId}/${Date.now()}_${fileToUpload.name}`;
        const downloadURL = await uploadFile(fileToUpload, filePath, setUploadProgress);
        
        const uploadData = {
            ...(existingFile ? { id: existingFile.id } : {}),
            fileName: fileName || fileToUpload.name,
            fileUrl: downloadURL, 
            gradeId: selectedGrade,
            categoryId: selectedCategory,
            teacherId: teacherId,
            semester: selectedSemester!,
        };
        onSave(uploadData as UploadedFile);
        setIsUploading(false);

    } else if (existingFile) {
        const uploadData = {
            ...existingFile,
            fileName: fileName,
            gradeId: selectedGrade,
            categoryId: selectedCategory,
            semester: selectedSemester,
        };
        onSave(uploadData);
    } else {
         alert("Please select a file to upload.");
    }
  };

  return (
    <div className="space-y-4">
        <Select value={selectedGrade} onValueChange={setSelectedGrade} disabled={isUploading}>
            <SelectTrigger>
            <SelectValue placeholder={t('uploads.new.placeholders.grade')} />
            </SelectTrigger>
            <SelectContent>
            {grades.map(grade => (
                <SelectItem key={grade.id} value={grade.id}>{t(`grades.${grade.id}`)}</SelectItem>
            ))}
            </SelectContent>
        </Select>
        <Select value={selectedSemester?.toString()} onValueChange={(val) => setSelectedSemester(Number(val))} disabled={isUploading}>
            <SelectTrigger>
                <SelectValue placeholder={t('uploads.new.placeholders.semester')} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="1">{t('admin.fileManagement.semester')} 1</SelectItem>
                <SelectItem value="2">{t('admin.fileManagement.semester')} 2</SelectItem>
            </SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isUploading}>
            <SelectTrigger>
            <SelectValue placeholder={t('uploads.new.placeholders.category')} />
            </SelectTrigger>
            <SelectContent>
            {fileCategories.map(category => (
                <SelectItem key={category.id} value={category.id}>{t(`fileCategories.${category.id}.name`)}</SelectItem>
            ))}
            </SelectContent>
        </Select>
        
        <div className="space-y-2">
            <Label htmlFor="file-input-button">File</Label>
             <Input 
                id="file-input" 
                type="file" 
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
                disabled={isUploading}
            />
            <Button 
                id="file-input-button"
                type="button"
                variant="outline" 
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
            >
                {t('uploads.new.chooseFileButton', 'Choose File')}
            </Button>
            {fileName && (
                <p className="text-sm text-muted-foreground pt-2 text-center">Selected: {fileName}</p>
            )}
        </div>
        
        {isUploading && (
            <div className="space-y-2">
                 <Progress value={uploadProgress} />
                 <p className="text-sm text-center text-muted-foreground">{Math.round(uploadProgress)}% uploaded</p>
            </div>
        )}

        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onDone} disabled={isUploading}>{t('actions.cancel')}</Button>
            <Button onClick={handleSave} disabled={isUploading}>
                {isUploading ? t('uploads.new.uploading', 'Uploading...') : (existingFile ? t('actions.edit') : t('uploads.new.uploadButton'))}
            </Button>
        </div>
    </div>
  );
}
