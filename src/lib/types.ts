export interface Lesson {
  id: string;
  slug: string;
  grade: string;
  title: string;
  description: string;
  content: string;
  example: string;
  exercise: {
    question: string;
    solution: string;
  };
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  password?: string;
  bio: string;
  avatarUrl: string;
  isApproved: boolean;
  role?: 'teacher' | 'admin';
}

export interface Question {
  id:string;
  teacherId: string;
  studentName: string;
  studentEmail: string;
  questionText: string;
  answerText?: string;
  status: 'pending' | 'answered';
  isPinned?: boolean;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string; // ISO 8601 date string
  imageUrl: string;
}

export interface Grade {
  id: string;
  name: string;
}

export interface FileCategory {
  id: string;
  name: string;
  description: string;
}

export interface UploadedFile {
    id: string;
    fileName: string;
    fileUrl: string;
    gradeId: string;
    categoryId: string;
    teacherId: string;
    semester: number;
}
