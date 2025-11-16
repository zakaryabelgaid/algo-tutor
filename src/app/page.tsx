'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  HelpCircle,
  Rss,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import Image from 'next/image';
import { useContext, useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/header';
import { NewsContext } from '@/context/news-context';
import { UserContext } from '@/context/user-context';
import { useTranslation } from '@/context/language-context';
import { QnaFormWrapper } from '@/components/qna-form-wrapper';
import dynamic from 'next/dynamic';

const ParticlesBackground = dynamic(
  () => import('@/components/particles-background').then((m) => m.ParticlesBackground),
  { ssr: false }
);


export default function LandingPage() {
  const { news } = useContext(NewsContext);
  const { lessons } = useContext(UserContext);
  const { t, language } = useTranslation();

  const beginnerLessons = lessons.filter(l => l.grade === 'Beginner');
  const intermediateLessons = lessons.filter(l => l.grade === 'Intermediate');
  const advancedLessons = lessons.filter(l => l.grade === 'Advanced');

  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        <section className="relative py-16 md:py-20 text-center overflow-hidden">
          
          <ParticlesBackground className="absolute inset-0 -z-0" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
              {t('landing.hero.title')}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('landing.hero.subtitle')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/lessons">{t('landing.hero.cta.start')}</Link>
              </Button>
               <Button size="lg" variant="outline" asChild>
                <Link href="#q-and-a">{t('landing.hero.cta.ask')}</Link>
              </Button>
            </div>
          </div>
        </section>


        {/* News Carousel Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <Rss /> {t('landing.news.title')}
              </h2>
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              plugins={[autoplayPlugin.current]}
              onMouseEnter={autoplayPlugin.current.stop}
              onMouseLeave={autoplayPlugin.current.reset}
              className="w-full"
            >
              <CarouselContent>
                {news.map(article => (
                  <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                    <Link href={`/news/${article.slug}`} className="block group">
                      <Card className="h-full overflow-hidden bg-card/80 dark:bg-card/50 border-border/50 hover:border-primary/50 transition-all dark:glowing-border">
                        <CardHeader className="p-0">
                          <div className="aspect-video relative w-full">
                            <Image src={article.imageUrl} alt={article.title} layout="fill" objectFit="cover" />
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                          <CardTitle className="text-lg leading-tight group-hover:text-primary">{article.title}</CardTitle>
                          <CardDescription>{new Date(article.publishedAt).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })} by {article.author}</CardDescription>
                          <p className="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
                        </CardContent>
                      </Card>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Lessons by Grade */}
              <Card className="dark:glowing-border bg-card/80 dark:bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen /> {t('landing.lessons.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('landing.lessons.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="beginner" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="beginner">{t('grades.beginner')}</TabsTrigger>
                      <TabsTrigger value="intermediate">{t('grades.intermediate')}</TabsTrigger>
                      <TabsTrigger value="advanced">{t('grades.advanced')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="beginner">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {beginnerLessons.map(lesson => (
                           <Link href={`/lessons/${lesson.slug}`} key={lesson.id} className="block group">
                            <Card className="h-full bg-card/50 border-border/50 hover:border-primary/50 transition-all">
                              <CardHeader>
                                <CardTitle className="text-base group-hover:text-primary">{lesson.title}</CardTitle>
                                <CardDescription className="text-sm line-clamp-2">{lesson.description}</CardDescription>
                              </CardHeader>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="intermediate">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {intermediateLessons.map(lesson => (
                           <Link href={`/lessons/${lesson.slug}`} key={lesson.id} className="block group">
                            <Card className="h-full bg-card/50 border-border/50 hover:border-primary/50 transition-all">
                              <CardHeader>
                                <CardTitle className="text-base group-hover:text-primary">{lesson.title}</CardTitle>
                                <CardDescription className="text-sm line-clamp-2">{lesson.description}</CardDescription>
                              </CardHeader>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="advanced">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {advancedLessons.map(lesson => (
                           <Link href={`/lessons/${lesson.slug}`} key={lesson.id} className="block group">
                            <Card className="h-full bg-card/50 border-border/50 hover:border-primary/50 transition-all">
                              <CardHeader>
                                <CardTitle className="text-base group-hover:text-primary">{lesson.title}</CardTitle>
                                <CardDescription className="text-sm line-clamp-2">{lesson.description}</CardDescription>
                              </CardHeader>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                   <div className="mt-4 text-right">
                    <Button variant="link" asChild>
                      <Link href="/lessons">
                        {t('landing.lessons.viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <QnaFormWrapper />
            </div>
          </div>
        </div>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">{t('aboutProject.title')}</h2>
            <p className="max-w-3xl mx-auto text-muted-foreground">
              {t('aboutProject.content', { name: 'Zakarya BELGAID' })} how did you made this
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
