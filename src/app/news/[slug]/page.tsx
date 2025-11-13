'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Calendar, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useContext } from 'react';
import { NewsContext } from '@/context/news-context';
import { useTranslation } from '@/context/language-context';

export default function NewsArticlePage() {
  const { news } = useContext(NewsContext);
  const { language, t } = useTranslation();
  const params = useParams();
  
  const slug = params.slug as string;
  const article = news.find(n => n.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <article className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-headline tracking-tight">{article.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.publishedAt).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
          </div>
        </div>
        
        <div className="relative aspect-video w-full">
            <Image 
                src={article.imageUrl}
                alt={article.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
            />
        </div>

        <Card>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert pt-6">
                <p>{article.content}</p>
            </CardContent>
        </Card>

      </article>
    </div>
  );
}
