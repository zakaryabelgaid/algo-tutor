'use client';

import { createContext, ReactNode, useState, useMemo } from 'react';
import { NewsArticle } from '@/lib/types';
import { initialNews } from '@/lib/data';

interface NewsContextType {
  news: NewsArticle[];
  addArticle: (article: Omit<NewsArticle, 'id' | 'slug'>) => void;
  updateArticle: (articleId: string, updates: Partial<NewsArticle>) => void;
  deleteArticle: (articleId: string) => void;
}

export const NewsContext = createContext<NewsContextType>({
  news: [],
  addArticle: () => {},
  updateArticle: () => {},
  deleteArticle: () => {},
});

export const NewsProvider = ({ children }: { children: ReactNode }) => {
  const [news, setNews] = useState<NewsArticle[]>(initialNews);
  
  const addArticle = (article: Omit<NewsArticle, 'id' | 'slug'>) => {
    const newArticle: NewsArticle = {
      ...article,
      id: `news-${Date.now()}`,
      slug: article.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    };
    setNews(prevNews => [newArticle, ...prevNews]);
  };

  const updateArticle = (articleId: string, updates: Partial<NewsArticle>) => {
    setNews(prevNews => 
      prevNews.map(article => 
        article.id === articleId ? { ...article, ...updates } : article
      )
    );
  };

  const deleteArticle = (articleId: string) => {
    setNews(prevNews => prevNews.filter(article => article.id !== articleId));
  };
  
  const sortedNews = useMemo(() => {
    return [...news].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [news]);

  return (
    <NewsContext.Provider value={{ news: sortedNews, addArticle, updateArticle, deleteArticle }}>
      {children}
    </NewsContext.Provider>
  );
};
