'use client';

import { createContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Teacher, Question, Lesson, UploadedFile } from '@/lib/types';
import { initialTeachers, initialQuestions, lessonCode, initialUploads } from '@/lib/data';
import { useTranslation } from './language-context';

interface User extends Partial<Teacher> {
    role?: 'teacher' | 'admin';
}

interface UserContextType {
  user: User | null;
  teachers: Teacher[];
  questions: Question[];
  lessons: Lesson[];
  uploads: UploadedFile[];
  login: (userData: User) => void;
  logout: () => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateUser: (userId: string, updates: Partial<Teacher>) => void;
  updateTeacherApproval: (teacherId: string, isApproved: boolean) => void;
  deleteTeacher: (teacherId: string) => void;
  togglePinStatus: (questionId: string) => void;
  addQuestion: (question: Omit<Question, 'id' | 'status' | 'isPinned' | 'studentName'>) => void;
  answerQuestion: (questionId: string, answerText: string) => void;
  addLesson: (lesson: Lesson) => void;
  updateLesson: (lessonId: string, updates: Partial<Lesson>) => void;
  deleteLesson: (lessonId: string) => void;
  addUpload: (upload: Omit<UploadedFile, 'id'>) => void;
  updateUpload: (uploadId: string, updates: Partial<UploadedFile>) => void;
  deleteUpload: (uploadId: string) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  teachers: [],
  questions: [],
  lessons: [],
  uploads: [],
  login: () => {},
  logout: () => {},
  addTeacher: () => {},
  updateUser: () => {},
  updateTeacherApproval: () => {},
  deleteTeacher: () => {},
  togglePinStatus: () => {},
  addQuestion: () => {},
  answerQuestion: () => {},
  addLesson: () => {},
  updateLesson: () => {},
  deleteLesson: () => {},
  addUpload: () => {},
  updateUpload: () => {},
  deleteUpload: () => {},
});

const USER_STORAGE_KEY = 'algo-tutor-user';

const initialLessons: Lesson[] = lessonCode.map(lesson => {
    return {
        id: lesson.id,
        slug: lesson.id,
        grade: lesson.id.includes('recursion') || lesson.id.includes('structs') || lesson.id.includes('pointers') ? 'Advanced' : (lesson.id.includes('loops') || lesson.id.includes('arrays') ? 'Intermediate' : 'Beginner'),
        title: `lessonContents.${lesson.id}.title`,
        description: `lessonContents.${lesson.id}.description`,
        content: `lessonContents.${lesson.id}.content`,
        example: lesson.example,
        exercise: {
          ...lesson.exercise,
          question: `lessonContents.${lesson.id}.exercise.question`,
        },
    }
});


export const UserProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [user, setUser] = useState<User | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [lessonsData, setLessonsData] = useState<Lesson[]>(initialLessons);
  const [uploads, setUploads] = useState<UploadedFile[]>(initialUploads);
  
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
      sessionStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  const lessons = useMemo(() => {
    return lessonsData.map(baseLesson => {
      return {
        ...baseLesson,
        title: t(baseLesson.title),
        description: t(baseLesson.description),
        content: t(baseLesson.content),
        exercise: {
          ...baseLesson.exercise,
          question: t(baseLesson.exercise.question),
        },
      };
    });
  }, [lessonsData, t]);
  
  const login = (userData: User) => {
    try {
        sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
        const redirectUrl = userData.role === 'admin' ? '/admin' : '/teacher';
        router.push(redirectUrl);
    } catch (error) {
        console.error("Failed to save user to sessionStorage", error);
    }
  };

  const logout = () => {
    try {
        sessionStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
        router.push('/');
    } catch (error) {
        console.error("Failed to remove user from sessionStorage", error);
    }
  };
  
  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher = { ...teacher, id: `teacher-${Date.now()}` };
    setTeachers(prev => [...prev, newTeacher]);
  };

  const updateUser = (userId: string, updates: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => t.id === userId ? { ...t, ...updates } : t));
    if (user && user.id === userId) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  const updateTeacherApproval = (teacherId: string, isApproved: boolean) => {
    updateUser(teacherId, { isApproved });
  };
  
  const deleteTeacher = (teacherId: string) => {
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
  };
  
  const togglePinStatus = (questionId: string) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, isPinned: !q.isPinned } : q));
  };
  
  const addQuestion = (question: Omit<Question, 'id' | 'status' | 'isPinned' | 'studentName'>) => {
    const newQuestion: Question = {
      ...question,
      id: `q-${Date.now()}`,
      studentName: question.studentEmail.split('@')[0] || 'Anonymous',
      status: 'pending',
      isPinned: false
    };
    setQuestions(prev => [newQuestion, ...prev]);
  };
  
  const answerQuestion = (questionId: string, answerText: string) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, answerText, status: 'answered' } : q));
  };

  const addLesson = (lesson: Lesson) => {
    setLessonsData(prev => [...prev, lesson]);
  };

  const updateLesson = (lessonId: string, updates: Partial<Lesson>) => {
    setLessonsData(prev => prev.map(l => l.id === lessonId ? { ...l, ...updates } : l));
  };

  const deleteLesson = (lessonId: string) => {
    setLessonsData(prev => prev.filter(l => l.id !== lessonId));
  };

  const addUpload = (upload: Omit<UploadedFile, 'id'>) => {
    const newUpload = { ...upload, id: `file-${Date.now()}` };
    setUploads(prev => [newUpload, ...prev]);
  };

  const updateUpload = (uploadId: string, updates: Partial<UploadedFile>) => {
    setUploads(prev => prev.map(f => f.id === uploadId ? { ...f, ...updates } : f));
  };

  const deleteUpload = (uploadId: string) => {
    setUploads(prev => prev.filter(f => f.id !== uploadId));
  };

  const value = { user, teachers, questions, lessons, uploads, login, logout, addTeacher, updateUser, updateTeacherApproval, deleteTeacher, togglePinStatus, addQuestion, answerQuestion, addLesson, updateLesson, deleteLesson, addUpload, updateUpload, deleteUpload };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
