'use client';

import { useState, useContext } from 'react';
import { Question, UploadedFile } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { UserContext } from '@/context/user-context';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/language-context';
import { Pin, PinOff, PlusCircle, FileText, Download, Eye } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { grades, fileCategories } from '@/lib/data';
import { FileUploadForm } from '@/components/file-upload-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';


function TeacherManagement() {
  const { teachers, updateTeacherApproval, deleteTeacher } = useContext(UserContext);
  const { t } = useTranslation();

  const handleApproval = (teacherId: string, isApproved: boolean) => {
    updateTeacherApproval(teacherId, isApproved);
  };
  
  const handleDelete = (teacherId: string) => {
    // Admins cannot be deleted
    if (teacherId === 'admin') return;
    deleteTeacher(teacherId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.management.title')}</CardTitle>
        <CardDescription>{t('admin.management.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teachers.map(teacher => (
            <div key={teacher.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
                  <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{teacher.name}</p>
                  <p className="text-sm text-muted-foreground">{teacher.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {teacher.role !== 'admin' && (
                  <Badge variant={teacher.isApproved ? 'secondary' : 'destructive'}>
                    {teacher.isApproved ? t('admin.management.status.approved') : t('admin.management.status.pending')}
                  </Badge>
                )}
                <div className="flex flex-wrap gap-2 justify-end">
                   {teacher.role !== 'admin' && !teacher.isApproved && (
                    <Button size="sm" onClick={() => handleApproval(teacher.id, true)}>
                      {t('admin.management.actions.approve')}
                    </Button>
                  )}
                  {teacher.role !== 'admin' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApproval(teacher.id, false)}
                    >
                      {teacher.isApproved ? t('admin.management.actions.revoke') : t('admin.management.actions.reject')}
                    </Button>
                  )}
                  {teacher.role !== 'admin' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="destructive" size="sm">{t('actions.delete')}</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('admin.management.deleteDialog.title')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('admin.management.deleteDialog.description', { name: teacher.name })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(teacher.id)}>
                            {t('actions.delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuestionItem({ question }: { question: Question }) {
  const [answer, setAnswer] = useState('');
  const { t } = useTranslation();
  const { user, answerQuestion } = useContext(UserContext);

  const handleAnswerSubmit = () => {
    if(!answer.trim()) {
        alert("Please enter an answer.");
        return;
    }
    answerQuestion(question.id, answer);

    if (user) {
        const subject = encodeURIComponent(question.questionText);
        const body = encodeURIComponent(answer);
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${question.studentEmail}&su=${subject}&body=${body}`;
        window.open(gmailUrl, '_blank');
    }

    setAnswer('');
  }

  return (
    <div className="p-4 border rounded-lg">
      <p className="text-sm text-muted-foreground">{t('admin.questions.from')}: {question.studentName} ({question.studentEmail})</p>
      <p className="font-semibold my-2">{question.questionText}</p>
      <div className="space-y-2">
        <Textarea 
          placeholder={t('admin.questions.answerPlaceholder')} 
          className="min-h-[100px]" 
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <Button size="sm" onClick={handleAnswerSubmit}>
          {t('admin.questions.submitButton')}
        </Button>
      </div>
    </div>
  );
}

function StudentQuestions() {
    const { user, questions, togglePinStatus } = useContext(UserContext);
    const { t } = useTranslation();
    // In a real app, you would fetch questions for this specific teacher.
    // For now, we show all questions to the admin.
    const teacherId = user?.role === 'admin' ? undefined : user?.id;

    const pendingQuestions = teacherId 
        ? questions.filter(q => q.teacherId === teacherId && q.status === 'pending')
        : questions.filter(q => q.status === 'pending');
        
    const answeredQuestions = teacherId
        ? questions.filter(q => q.teacherId === teacherId && q.status === 'answered')
        : questions.filter(q => q.status === 'answered');

    return (
        <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
                <TabsTrigger value="pending">{t('admin.questions.tabs.pending', { count: pendingQuestions.length })}</TabsTrigger>
                <TabsTrigger value="answered">{t('admin.questions.tabs.answered', { count: answeredQuestions.length })}</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
                 <Card>
                    <CardHeader>
                        <CardTitle>{t('admin.questions.pending.title')}</CardTitle>
                        <CardDescription>{t('admin.questions.pending.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {pendingQuestions.length > 0 ? (
                            pendingQuestions.map(q => <QuestionItem key={q.id} question={q} />)
                        ) : (
                            <p className="text-muted-foreground text-center py-8">{t('admin.questions.pending.none')}</p>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="answered">
                 <Card>
                    <CardHeader>
                        <CardTitle>{t('admin.questions.answered.title')}</CardTitle>
                        <CardDescription>{t('admin.questions.answered.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {answeredQuestions.length > 0 ? (
                            answeredQuestions.map(q => (
                                <div key={q.id} className="p-4 border rounded-lg">
                                     <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{q.questionText}</p>
                                            <Badge variant="secondary" className="my-2">{t('admin.questions.answered.badge')}</Badge>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => togglePinStatus(q.id)}
                                            aria-label={q.isPinned ? 'Unpin question' : 'Pin question'}
                                        >
                                            {q.isPinned ? <PinOff className="h-5 w-5 text-primary" /> : <Pin className="h-5 w-5" />}
                                        </Button>
                                    </div>
                                     <p className="p-3 bg-primary/10 rounded-md text-sm">{q.answerText}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-center py-8">{t('admin.questions.answered.none')}</p>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}

function AddTeacherForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { addTeacher } = useContext(UserContext);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleAddTeacher = () => {
    if (!firstName || !lastName || !email || !password) {
      toast({
        variant: 'destructive',
        title: t('admin.addTeacher.toast.missing.title'),
        description: t('admin.addTeacher.toast.missing.description'),
      });
      return;
    }
    
    addTeacher({
      name: `${firstName} ${lastName}`,
      email,
      password,
      bio: t('admin.addTeacher.defaultBio'),
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200`, 
      isApproved: true, // Teachers added by admin are pre-approved
      role: 'teacher'
    });

    toast({
      title: t('admin.addTeacher.toast.success.title'),
      description: t('admin.addTeacher.toast.success.description', { name: `${firstName} ${lastName}` }),
    });

    // Reset form
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.addTeacher.title')}</CardTitle>
        <CardDescription>
          {t('admin.addTeacher.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">{t('admin.addTeacher.labels.firstName')}</Label>
                <Input id="first-name" placeholder="Jane" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">{t('admin.addTeacher.labels.lastName')}</Label>
                <Input id="last-name" placeholder="Doe" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t('admin.addTeacher.labels.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="password">{t('login.password')}</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddTeacher}>{t('admin.addTeacher.addButton')}</Button>
      </CardFooter>
    </Card>
  );
}

function FileManager() {
  const { t } = useTranslation();
  const { user, uploads, addUpload, updateUpload } = useContext(UserContext);
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUpload, setEditingUpload] = useState<UploadedFile | undefined>(undefined);

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
      addUpload(upload);
      toast({ title: t('uploads.toast.success.title'), description: `"${upload.fileName}" has been uploaded.` });
    }
    handleCloseForm();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                  <CardTitle>{t('admin.fileManagement.title')}</CardTitle>
                  <CardDescription>{t('admin.fileManagement.description')}</CardDescription>
              </div>
              <Button onClick={() => handleOpenForm()}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('actions.upload')}
              </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {grades.map(grade => (
              <AccordionItem value={grade.id} key={grade.id}>
                <AccordionTrigger className="text-xl font-semibold">{t(`grades.${grade.id}`)}</AccordionTrigger>
                <AccordionContent>
                  <Accordion type="multiple" className="w-full pl-4">
                    {[1, 2].map(semester => (
                      <AccordionItem value={`${grade.id}-s${semester}`} key={semester}>
                        <AccordionTrigger>{t('admin.fileManagement.semester')} {semester}</AccordionTrigger>
                        <AccordionContent>
                          <Accordion type="multiple" className="w-full pl-4">
                            {fileCategories.map(category => {
                              const files = uploads.filter(
                                file => file.gradeId === grade.id && file.semester === semester && file.categoryId === category.id
                              );
                              return (
                                <AccordionItem value={`${grade.id}-s${semester}-${category.id}`} key={category.id}>
                                  <AccordionTrigger>{t(`fileCategories.${category.id}.name`)}</AccordionTrigger>
                                  <AccordionContent>
                                      <div className="flex flex-col gap-2">
                                        {files.length > 0 ? files.map(file => (
                                           <div key={file.id} className="flex items-center justify-between p-2 border rounded-md text-sm">
                                              <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-primary" />
                                                <span className="font-medium truncate">{file.fileName}</span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Button asChild variant="ghost" size="icon" title="View File">
                                                    <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                                                    <Eye className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                                <Button asChild variant="ghost" size="icon" title="Download File">
                                                    <a href={file.fileUrl} download={file.fileName}>
                                                    <Download className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                              </div>
                                            </div>
                                        )) : (
                                          <p className="text-xs text-muted-foreground">{t('admin.fileManagement.noFiles')}</p>
                                        )}
                                      </div>
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            })}
                          </Accordion>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
    </>
  );
}


export default function AdminDashboardPage() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-2">{t('admin.title')}</h1>
      <p className="text-muted-foreground mb-6">{t('admin.description')}</p>

      <Tabs defaultValue="management" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 h-auto sm:h-10">
          <TabsTrigger value="management">{t('admin.tabs.management')}</TabsTrigger>
          <TabsTrigger value="questions">{t('admin.tabs.questions')}</TabsTrigger>
          <TabsTrigger value="add-teacher">{t('admin.tabs.addTeacher')}</TabsTrigger>
          <TabsTrigger value="file-management">{t('admin.tabs.fileManagement')}</TabsTrigger>
        </TabsList>
        <TabsContent value="management">
         <TeacherManagement />
        </TabsContent>
        <TabsContent value="questions">
          <StudentQuestions />
        </TabsContent>
        <TabsContent value="add-teacher">
          <AddTeacherForm />
        </TabsContent>
        <TabsContent value="file-management">
          <FileManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
