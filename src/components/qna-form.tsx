'use client';

import { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserContext } from '@/context/user-context';
import { useTranslation } from '@/context/language-context';

export function QnaForm() {
  const { teachers, addQuestion } = useContext(UserContext);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [questionEmail, setQuestionEmail] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  
  const approvedTeachers = teachers.filter(t => t.isApproved);

  useEffect(() => {
    const teacherId = searchParams.get('teacher');
    if (teacherId) {
      setSelectedTeacher(teacherId);
    }
  }, [searchParams]);

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionEmail || !selectedTeacher || !questionText) {
      toast({
        variant: 'destructive',
        title: t('landing.qna.toast.missing.title'),
        description: t('landing.qna.toast.missing.description'),
      });
      return;
    }
    
    addQuestion({
      teacherId: selectedTeacher,
      studentEmail: questionEmail,
      questionText,
    });
    
    toast({
      title: t('landing.qna.toast.success.title'),
      description: t('landing.qna.toast.success.description'),
    });
    
    setQuestionEmail('');
    setQuestionText('');
    setSelectedTeacher('');
  };

  return (
    <Card id="q-and-a" className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle /> {t('landing.qna.title')}
        </CardTitle>
        <CardDescription>
          {t('landing.qna.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleQuestionSubmit}>
          <Input 
            type="email" 
            placeholder={t('landing.qna.emailPlaceholder')} 
            required 
            value={questionEmail}
            onChange={(e) => setQuestionEmail(e.target.value)}
          />
          <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger>
                  <SelectValue placeholder={t('landing.qna.teacherPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                  {approvedTeachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                      </SelectItem>
                  ))}
              </SelectContent>
          </Select>
          <Textarea 
            placeholder={t('landing.qna.questionPlaceholder')} 
            required
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          <Button className="w-full" type="submit">{t('landing.qna.submit')}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
