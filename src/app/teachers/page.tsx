'use client';

import { useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserContext } from '@/context/user-context';
import Link from 'next/link';
import { useTranslation } from '@/context/language-context';

export default function TeachersPage() {
  const { teachers } = useContext(UserContext);
  const { t } = useTranslation();
  const approvedTeachers = teachers.filter(t => t.isApproved);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">{t('teachersPage.title')}</h1>
        <p className="text-xl text-muted-foreground mt-2">
          {t('teachersPage.subtitle')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {approvedTeachers.map((teacher) => (
          <Link
            key={teacher.id}
            href={`/?teacher=${teacher.id}#q-and-a`}
            className="block group"
          >
            <Card className="text-center h-full hover:shadow-lg transition-shadow">
              <CardHeader className="items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
                  <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="group-hover:text-primary">{teacher.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{teacher.bio}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
