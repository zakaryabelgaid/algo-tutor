'use client';

import { useState, useContext } from 'react';
import { Question } from '@/lib/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge';
import { UserContext } from '@/context/user-context';
import { useTranslation } from '@/context/language-context';
import { Pin, PinOff } from 'lucide-react';


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
  };

  return (
    <div className="p-4 border rounded-lg">
      <p className="text-sm text-muted-foreground">{t('teacher.dashboard.questions.from')}: {question.studentName} ({question.studentEmail})</p>
      <p className="font-semibold my-2">{question.questionText}</p>
      <div className="space-y-2">
        <Textarea 
          placeholder={t('teacher.dashboard.questions.answerPlaceholder')}
          className="min-h-[100px]" 
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <Button size="sm" onClick={handleAnswerSubmit}>
            {t('teacher.dashboard.questions.submitAnswer')}
        </Button>
      </div>
    </div>
  );
}


export default function TeacherDashboardPage() {
    const { user, questions, togglePinStatus } = useContext(UserContext);
    const { t } = useTranslation();
    const teacherId = user?.id;
    
    const pendingQuestions = teacherId ? questions.filter(q => q.teacherId === teacherId && q.status === 'pending') : [];
    const answeredQuestions = teacherId ? questions.filter(q => q.teacherId === teacherId && q.status === 'answered') : [];

    if(!user || !teacherId) {
        return (
            <div className="container mx-auto p-4 md:p-8">
                <p>Please log in to view the teacher dashboard.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-2">{t('teacher.dashboard.title')}</h1>
            <p className="text-muted-foreground mb-6">{t('teacher.dashboard.description')}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Tabs defaultValue="pending" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="pending">{t('teacher.dashboard.questions.pendingTab', { count: pendingQuestions.length })}</TabsTrigger>
                            <TabsTrigger value="answered">{t('teacher.dashboard.questions.answeredTab', { count: answeredQuestions.length })}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="pending">
                             <Card>
                                <CardHeader>
                                    <CardTitle>{t('teacher.dashboard.questions.pendingTitle')}</CardTitle>
                                    <CardDescription>{t('teacher.dashboard.questions.pendingDescription')}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {pendingQuestions.length > 0 ? (
                                        pendingQuestions.map(q => <QuestionItem key={q.id} question={q} />)
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">{t('teacher.dashboard.questions.noPending')}</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="answered">
                             <Card>
                                <CardHeader>
                                    <CardTitle>{t('teacher.dashboard.questions.answeredTitle')}</CardTitle>
                                    <CardDescription>{t('teacher.dashboard.questions.answeredDescription')}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {answeredQuestions.length > 0 ? (
                                        answeredQuestions.map(q => (
                                            <div key={q.id} className="p-4 border rounded-lg">
                                                <div className="flex justify-between items-start">
                                                  <div>
                                                     <p className="font-semibold">{q.questionText}</p>
                                                     <Badge variant="secondary" className="my-2">{t('teacher.dashboard.questions.answeredBadge')}</Badge>
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
                                        <p className="text-muted-foreground text-center py-8">{t('teacher.dashboard.questions.noAnswered')}</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('teacher.dashboard.profile.title')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           {user && (
                                <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                                </div>
                           )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
