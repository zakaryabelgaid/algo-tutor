'use client';

import { useState, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { NewsArticle } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NewsContext } from '@/context/news-context';
import { UserContext } from '@/context/user-context';
import { useTranslation } from '@/context/language-context';

export default function TeacherNewsPage() {
  const { news, addArticle, deleteArticle, updateArticle } = useContext(NewsContext);
  const { user } = useContext(UserContext);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const { toast } = useToast();
  const { t, language } = useTranslation();

  const handleEditClick = (article: NewsArticle) => {
    setEditingArticle(article);
    setTitle(article.title);
    setSummary(article.summary);
    setContent(article.content);
    setImageUrl(article.imageUrl);
    setImagePreview(article.imageUrl);
  };

  const handleCancelEdit = () => {
    setEditingArticle(null);
    setTitle('');
    setSummary('');
    setContent('');
    setImagePreview(null);
    setImageUrl('');
    const input = document.getElementById('image-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!title || !summary || !content) {
      toast({
        variant: 'destructive',
        title: t('teacher.news.toast.missing.title'),
        description: t('teacher.news.toast.missing.description'),
      });
      return;
    }

    if (editingArticle) {
      const updates: Partial<NewsArticle> = {
        title,
        summary,
        content,
        imageUrl: imageUrl || 'https://picsum.photos/seed/news/1080/600',
      };
      updateArticle(editingArticle.id, updates);
      toast({
        title: "Article Updated",
        description: `Your article "${title}" has been saved.`,
      });
    } else {
      const newArticle: Omit<NewsArticle, 'id' | 'slug'> = {
        title,
        summary,
        content,
        author: user?.name || 'Algo Tutor Team',
        publishedAt: new Date().toISOString(),
        imageUrl: imageUrl || 'https://picsum.photos/seed/news/1080/600',
      };
      addArticle(newArticle);
      toast({
        title: t('teacher.news.toast.published.title'),
        description: t('teacher.news.toast.published.description', { title }),
      });
    }

    // Reset form
    handleCancelEdit();
  };

  const handleDelete = (id: string) => {
    deleteArticle(id);
    toast({
      title: t('teacher.news.toast.deleted.title'),
      description: t('teacher.news.toast.deleted.description'),
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">{t('teacher.news.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{editingArticle ? "Edit Article" : t('teacher.news.create.title')}</CardTitle>
              <CardDescription>{editingArticle ? "Update the details for your article." : t('teacher.news.create.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t('teacher.news.create.labels.title')}</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder={t('teacher.news.create.placeholders.title')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">{t('teacher.news.create.labels.summary')}</Label>
                <Textarea id="summary" value={summary} onChange={e => setSummary(e.target.value)} placeholder={t('teacher.news.create.placeholders.summary')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">{t('teacher.news.create.labels.content')}</Label>
                <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} placeholder={t('teacher.news.create.placeholders.content')} rows={6} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-upload">{t('teacher.news.create.labels.image')}</Label>
                {imagePreview && (
                  <div className="relative aspect-video w-full my-2">
                    <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="cover" className="rounded-md" />
                  </div>
                )}
                <Input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              {editingArticle && (
                <Button variant="outline" className="w-full" onClick={handleCancelEdit}>
                  {t('actions.cancel')}
                </Button>
              )}
              <Button className="w-full" onClick={handleSubmit}>{editingArticle ? "Save Changes" : t('teacher.news.create.publishButton')}</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('teacher.news.published.title')}</CardTitle>
              <CardDescription>{t('teacher.news.published.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('teacher.news.published.table.title')}</TableHead>
                    <TableHead>{t('teacher.news.published.table.date')}</TableHead>
                    <TableHead className="text-right">{t('teacher.news.published.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news.length > 0 ? (
                    news.map(article => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell>{new Date(article.publishedAt).toLocaleDateString(language)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleEditClick(article)}>
                                <Edit className="mr-2 h-4 w-4" /> {t('actions.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(article.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> {t('actions.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center h-24">{t('teacher.news.published.noArticles')}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
