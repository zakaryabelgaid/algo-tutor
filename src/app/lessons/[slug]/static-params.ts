import { lessonCode } from '@/lib/data';

export async function generateStaticParams() {
  return lessonCode.map((lesson) => ({
    slug: lesson.id,
  }));
}
