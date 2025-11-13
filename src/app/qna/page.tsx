'use client';

import { useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { UserContext } from '@/context/user-context';
import { useTranslation } from '@/context/language-context';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Pin } from 'lucide-react';
import { QnaForm } from '@/components/qna-form';

export default function QnaPage() {
  const { questions, teachers } = useContext(UserContext);
  const { t } = useTranslation();

  const pinnedQuestions = questions.filter(q => q.isPinned);

  const getTeacher = (teacherId: string) => teachers.find(t => t.id === teacherId);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
            <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold font-headline flex items-center justify-center md:justify-start gap-3">
                    <Pin className="h-8 w-8 text-primary" />
                    {t('qnaPage.title')}
                </h1>
                <p className="text-xl text-muted-foreground mt-2">
                {t('qnaPage.subtitle')}
                </p>
            </div>

            {pinnedQuestions.length > 0 ? (
                <Card>
                    <CardContent className="p-6">
                        <Accordion type="single" collapsible className="w-full">
                            {pinnedQuestions.map((question) => {
                                const teacher = getTeacher(question.teacherId);
                                return (
                                    <AccordionItem key={question.id} value={question.id}>
                                        <AccordionTrigger className="text-lg text-left hover:no-underline">
                                            {question.questionText}
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-4 space-y-4">
                                            <p className="text-base text-muted-foreground">{question.answerText}</p>
                                            {teacher && (
                                                <div className="flex items-center gap-3 pt-2 border-t">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
                                                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold">{t('qnaPage.answeredBy')}</p>
                                                        <p className="text-sm text-muted-foreground">{teacher.name}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    </CardContent>
                </Card>
            ) : (
                <Card className="text-center py-16">
                <CardHeader>
                    <CardTitle>{t('qnaPage.noQuestions.title')}</CardTitle>
                    <CardDescription>{t('qnaPage.noQuestions.description')}</CardDescription>
                </CardHeader>
                </Card>
            )}
        </div>
         <div className="md:col-span-1">
            <QnaForm />
        </div>
      </div>
    </div>
  );
}
