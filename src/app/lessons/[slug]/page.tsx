import { lessonCode } from '@/lib/data';
import LessonPageClient from './lesson-client';

// Generate static params for all lesson slugs
export async function generateStaticParams() {
  return lessonCode.map((lesson) => ({
    slug: lesson.id,
  }));
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default function LessonPage({ params }: PageProps) {
  return <LessonPageClient slug={params.slug} />;
}
