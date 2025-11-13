'use client';

import { notFound, useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Code, BookText, BrainCircuit, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState, useContext, useMemo } from 'react';
import { useTranslation } from '@/context/language-context';
import { UserContext } from '@/context/user-context';
import { Lesson } from '@/lib/types';

function Exercise({ lessonId }: { lessonId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { lessons } = useContext(UserContext);
  const lesson = lessons.find(l => l.id === lessonId);

  if (!lesson) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span>{t('lesson.exercise.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg">{lesson.exercise.question}</p>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              {isOpen ? t('lesson.exercise.hideAnswer') : t('lesson.exercise.showAnswer')}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto mt-4">
              <code className="font-code">{lesson.exercise.solution}</code>
            </pre>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

export default function LessonPage() {
  const { t } = useTranslation();
  const { lessons } = useContext(UserContext);
  const params = useParams();

  const slug = params.slug as string;
  const lesson = lessons.find(t => t.slug === slug);
  
  const currentIndex = useMemo(() => {
    if (!lesson) return -1;
    // We need to find the index in the original, untranslated list to keep it stable
    return lessons.findIndex(t => t.id === lesson.id);
  }, [lessons, lesson]);

  const nextLesson = useMemo(() => {
    if (currentIndex === -1 || currentIndex >= lessons.length - 1) return null;
    return lessons[currentIndex + 1];
  }, [lessons, currentIndex]);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="space-y-4 mb-8">
        <Badge variant={lesson.grade === 'Beginner' ? 'secondary' : 'default'} className="text-sm">
          {t(`grades.${lesson.grade.toLowerCase()}`)}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">{lesson.title}</h1>
        <p className="text-lg md:text-xl text-muted-foreground">{lesson.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookText className="h-6 w-6 text-primary" />
                <span>{t('lesson.concept')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert">
              <p>{lesson.content}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-6 w-6 text-primary" />
                <span>{t('lesson.example')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                <code className="font-code">{lesson.example}</code>
              </pre>
            </CardContent>
          </Card>
          
          <Exercise lessonId={lesson.id} />

        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>{t('lessons')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {lessons.map((t_item) => (
                  <li key={t_item.id}>
                    <Link
                      href={`/lessons/${t_item.slug}`}
                      className={`block p-2 rounded-md ${
                        t_item.id === lesson.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                    >
                      {t_item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {nextLesson && (
        <div className="mt-12 text-center">
            <Separator className="my-8" />
            <h2 className="text-2xl font-bold mb-4">{t('lesson.next.prompt')}</h2>
            <Button asChild size="lg">
                <Link href={`/lessons/${nextLesson.slug}`}>{nextLesson.title}</Link>
            </Button>
        </div>
      )}
    </div>
  );
}
