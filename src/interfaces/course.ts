// src/interfaces/course.ts

export interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  price: string;
  students: string;
  image: string;
  features: string[];
  schedule?: string;
  status?: string;
  is_popular?: boolean;
  duration?: string;
}