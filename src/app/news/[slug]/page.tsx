import { initialNews } from '@/lib/data';
import NewsArticleClient from './news-client';

// Generate static params for all news slugs
export async function generateStaticParams() {
  return initialNews.map((article) => ({
    slug: article.slug,
  }));
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default function NewsArticlePage({ params }: PageProps) {
  return <NewsArticleClient slug={params.slug} />;
}
