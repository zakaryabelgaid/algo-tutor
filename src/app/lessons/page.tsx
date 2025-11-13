'use client';

import { useTranslation } from '@/context/language-context';
import { useContext } from 'react';
import { UserContext } from '@/context/user-context';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

export default function LessonsPage() {
  const { t } = useTranslation();
  const { lessons } = useContext(UserContext);

  const beginnerLessons = lessons.filter(l => l.grade === 'Beginner');
  const intermediateLessons = lessons.filter(l => l.grade === 'Intermediate');
  const advancedLessons = lessons.filter(l => l.grade === 'Advanced');

  const lessonGroups = [
    { title: t('grades.beginner'), lessons: beginnerLessons },
    { title: t('grades.intermediate'), lessons: intermediateLessons },
    { title: t('grades.advanced'), lessons: advancedLessons },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            {t('lessonsPage.title')}
        </h1>
        <p className="text-lg text-muted-foreground mt-2">{t('landing.lessons.description')}</p>
      </div>

      <div className="space-y-12">
        {lessonGroups.map(group => (
          <section key={group.title}>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">{group.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.lessons.map(lesson => (
                <Link href={`/lessons/${lesson.slug}`} key={lesson.id} className="block group">
                  <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all">
                    <CardHeader>
                      <div className="flex justify-between items-center mb-2">
                        <CardTitle className="text-lg group-hover:text-primary">{lesson.title}</CardTitle>
                        <Badge variant="secondary">{t(`grades.${lesson.grade.toLowerCase()}`)}</Badge>
                      </div>
                      <CardDescription className="line-clamp-3">{lesson.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
