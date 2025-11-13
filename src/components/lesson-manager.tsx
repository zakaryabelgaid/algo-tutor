'use client';

import { useState, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { UserContext } from '@/context/user-context';
import { useToast } from '@/hooks/use-toast';
import { Lesson } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useTranslation } from '@/context/language-context';

const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  grade: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  description: z.string().min(1, 'Description is required'),
  content: z.string().min(1, 'Content is required'),
  example: z.string().min(1, 'Example code is required'),
  exercise: z.object({
    question: z.string().min(1, 'Exercise question is required'),
    solution: z.string().min(1, 'Exercise solution is required'),
  }),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface LessonFormProps {
  lesson?: Lesson;
  onSave: (data: Partial<Lesson> | Lesson) => void;
  onClose: () => void;
}

function LessonForm({ lesson, onSave, onClose }: LessonFormProps) {
  const { t } = useTranslation();
  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: lesson ? {
        ...lesson,
        grade: lesson.grade as 'Beginner' | 'Intermediate' | 'Advanced',
    } : {
      title: '',
      slug: '',
      grade: 'Beginner',
      description: '',
      content: '',
      example: '',
      exercise: {
        question: '',
        solution: '',
      },
    },
  });

  const onSubmit: SubmitHandler<LessonFormData> = data => {
    if (lesson) {
      // Only 'grade' and 'slug' can be edited.
       const updates: Partial<Lesson> = {
          grade: data.grade,
          slug: data.slug
      }
      onSave(updates);
    } else {
        const newLesson: Omit<Lesson, 'id'> = {
            ...data,
            title: `lessonContents.${data.slug}.title`,
            description: `lessonContents.${data.slug}.description`,
            content: `lessonContents.${data.slug}.content`,
            exercise: {
              ...data.exercise,
              question: `lessonContents.${data.slug}.exercise.question`,
            },
        };
        onSave(newLesson as Lesson);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>{lesson ? t('actions.edit') + ' ' + t('lessons') : 'Add New Lesson'}</DialogTitle>
          <DialogDescription>
            {lesson ? 'Update the details for this lesson.' : 'Fill out the form to create a new lesson.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-1">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., C Pointers" {...field} disabled={!!lesson} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., c-pointers" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a grade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A short summary of the lesson." {...field} disabled={!!lesson}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="The main conceptual content of the lesson." {...field} rows={6} disabled={!!lesson} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="example"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Example Code</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A full code example." {...field} rows={6} className="font-code" disabled={!!lesson}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="exercise.question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Question</FormLabel>
                  <FormControl>
                    <Textarea placeholder="The question for the exercise." {...field} disabled={!!lesson}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="exercise.solution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Solution</FormLabel>
                  <FormControl>
                    <Textarea placeholder="The solution code for the exercise." {...field} rows={6} className="font-code" disabled={!!lesson}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('actions.cancel')}
            </Button>
          </DialogClose>
          <Button type="submit">Save Lesson</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}


export function LessonManager() {
  const { lessons, addLesson, updateLesson, deleteLesson } = useContext(UserContext);
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | undefined>(undefined);

  const handleOpenForm = (lesson?: Lesson) => {
    setEditingLesson(lesson);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingLesson(undefined);
    setIsFormOpen(false);
  };

  const handleSaveLesson = (data: Partial<Lesson> | Lesson) => {
    if (editingLesson) {
      updateLesson(editingLesson.id, data);
      toast({ title: 'Lesson Updated', description: `Your changes to the lesson have been saved.` });
    } else {
      addLesson(data as Lesson);
      toast({ title: 'Lesson Added', description: `The new lesson has been added.` });
    }
    handleCloseForm();
  };

  const handleDeleteLesson = (lessonId: string) => {
    deleteLesson(lessonId);
    toast({ title: 'Lesson Deleted', description: 'The lesson has been removed.' });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Lessons</h1>
        <Button onClick={() => handleOpenForm()}>Add New Lesson</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Lessons</CardTitle>
          <CardDescription>Here you can edit or remove lessons from the curriculum.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.map(lesson => (
                <TableRow key={lesson.id}>
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell>{lesson.grade}</TableCell>
                  <TableCell>{lesson.slug}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenForm(lesson)}>
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="ml-2">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the lesson "{lesson.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteLesson(lesson.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-4xl">
          <LessonForm lesson={editingLesson} onSave={handleSaveLesson} onClose={handleCloseForm} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
