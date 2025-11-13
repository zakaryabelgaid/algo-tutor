'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContext } from 'react';
import { NewsContext } from '@/context/news-context';
import { useTranslation } from '@/context/language-context';

export default function NewsPage() {
  const { news } = useContext(NewsContext);
  const { t, language } = useTranslation();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">{t('newsPage.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {news.map((article) => (
          <Link href={`/news/${article.slug}`} key={article.id} className="block group">
            <Card className="h-full hover:shadow-xl transition-shadow flex flex-col">
              <CardHeader>
                <div className="aspect-video relative w-full mb-4">
                  <Image src={article.imageUrl} alt={article.title} layout="fill" objectFit="cover" className="rounded-t-lg" />
                </div>
                <CardTitle className="group-hover:text-primary">{article.title}</CardTitle>
                <CardDescription>{new Date(article.publishedAt).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })} by {article.author}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{article.summary}</p>
              </CardContent>
              <CardFooter>
                  <Button variant="link" className="p-0">{t('newsPage.readMore')} <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
