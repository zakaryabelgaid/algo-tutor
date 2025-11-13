'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState, useContext, useEffect } from 'react';
import type { UploadedFile } from '@/lib/types';
import { useTranslation } from '@/context/language-context';
import { grades, fileCategories } from '@/lib/data';
import { FileUploadForm } from '@/components/file-upload-form';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/user-context';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function UploadsPage() {
  const { user, uploads, addUpload, updateUpload, deleteUpload } = useContext(UserContext);
  const { t } = useTranslation();
  const { toast } = useToast();

  const [myUploads, setMyUploads] = useState<UploadedFile[]>([]);
  const [editingUpload, setEditingUpload] = useState<UploadedFile | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const filteredUploads = user.role === 'admin'
        ? uploads
        : uploads.filter(u => u.teacherId === user.id);
      setMyUploads(filteredUploads);
    }
  }, [uploads, user]);

  const handleOpenForm = (upload?: UploadedFile) => {
    setEditingUpload(upload);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingUpload(undefined);
    setIsFormOpen(false);
  };

  const handleSaveUpload = (upload: Omit<UploadedFile, 'id'> | UploadedFile) => {
    if (!user) return;
    
    if ('id' in upload) {
      updateUpload(upload.id, upload);
      toast({ title: t('uploads.toast.updated.title'), description: `"${upload.fileName}" has been updated.` });
    } else {
      const uploadWithTeacher = { ...upload, teacherId: user.id };
      addUpload(uploadWithTeacher);
      toast({ title: t('uploads.toast.success.title'), description: `"${upload.fileName}" has been uploaded.` });
    }
    handleCloseForm();
  };

  const handleDeleteUpload = (uploadId: string) => {
    deleteUpload(uploadId);
    toast({ title: t('uploads.toast.deleted.title'), description: t('uploads.toast.deleted.description') });
  };
  
  if (!user) {
    return <div>Please log in to manage uploads.</div>
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('uploads.title')}</h1>
        <Button onClick={() => handleOpenForm()}>{t('uploads.new.uploadButton')}</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('uploads.myUploads.title')}</CardTitle>
          <CardDescription>{t('uploads.myUploads.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('uploads.myUploads.table.fileName')}</TableHead>
                <TableHead>{t('uploads.myUploads.table.grade')}</TableHead>
                <TableHead>{t('uploads.myUploads.table.category')}</TableHead>
                <TableHead><span className="sr-only">{t('uploads.myUploads.table.actions')}</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myUploads.length > 0 ? (
                myUploads.map(upload => {
                  const grade = grades.find(g => g.id === upload.gradeId);
                  const category = fileCategories.find(c => c.id === upload.categoryId);
                  return (
                    <TableRow key={upload.id}>
                      <TableCell className="font-medium">{upload.fileName}</TableCell>
                      <TableCell>{grade ? t(`grades.${grade.id}`) : ''}</TableCell>
                      <TableCell>{category ? t(`fileCategories.${category.id}.name`) : ''}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('actions.title')}</DropdownMenuLabel>
                             <DropdownMenuItem asChild>
                                <a href={upload.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                    <Eye className="mr-2 h-4 w-4" /> View
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenForm(upload)}>
                                <Edit className="mr-2 h-4 w-4" />{t('actions.edit')}
                            </DropdownMenuItem>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        {t('actions.delete')}
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the file "{upload.fileName}".
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteUpload(upload.id)}>
                                        {t('actions.delete')}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {t('uploads.myUploads.noFiles')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
           <DialogHeader>
              <DialogTitle>{editingUpload ? t('uploads.edit.title') : t('uploads.new.title')}</DialogTitle>
              <DialogDescription>{editingUpload ? t('uploads.edit.description') : t('uploads.new.description')}</DialogDescription>
            </DialogHeader>
          {user && <FileUploadForm onSave={handleSaveUpload} teacherId={user.id} existingFile={editingUpload} onDone={handleCloseForm} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
