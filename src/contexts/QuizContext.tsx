"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'essay' | 'listening' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId?: number;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  duration: number; // in minutes
  totalPoints: number;
  questions: QuizQuestion[];
  passingScore: number;
  attempts: number;
  isPublished: boolean;
  createdAt: string;
  createdBy: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: { [questionId: string]: string | string[] };
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  completedAt: string;
  timeSpent: number; // in seconds
}

interface QuizContextType {
  currentQuiz: Quiz | null;
  currentAttempt: QuizAttempt | null;
  currentQuestionIndex: number;
  userAnswers: { [questionId: string]: string | string[] };
  timeRemaining: number;
  isQuizActive: boolean;
  isQuizCompleted: boolean;
  
  startQuiz: (quiz: Quiz) => void;
  submitAnswer: (questionId: string, answer: string | string[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => Promise<QuizAttempt>;
  resetQuiz: () => void;
  
  // Admin functions
  createQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'createdBy'>) => Promise<Quiz>;
  updateQuiz: (quizId: string, updates: Partial<Quiz>) => Promise<Quiz>;
  deleteQuiz: (quizId: string) => Promise<void>;
  getQuizzes: () => Promise<Quiz[]>;
  getQuizAttempts: (quizId?: string) => Promise<QuizAttempt[]>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [questionId: string]: string | string[] }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isQuizActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            submitQuiz(); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isQuizActive, timeRemaining]);

  const startQuiz = (quiz: Quiz) => {
    if (!user) return;
    
    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      quizId: quiz.id,
      userId: user.id,
      answers: {},
      score: 0,
      totalPoints: quiz.totalPoints,
      percentage: 0,
      passed: false,
      startedAt: new Date().toISOString(),
      completedAt: '',
      timeSpent: 0
    };
    
    setCurrentQuiz(quiz);
    setCurrentAttempt(attempt);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeRemaining(quiz.duration * 60); // Convert minutes to seconds
    setIsQuizActive(true);
    setIsQuizCompleted(false);
    
    addNotification({
      title: 'Quiz đã bắt đầu',
      message: `Bạn đã bắt đầu làm quiz "${quiz.title}". Thời gian: ${quiz.duration} phút.`,
      type: 'info'
    });
  };

  const submitAnswer = (questionId: string, answer: string | string[]) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    if (!currentQuiz) return { score: 0, percentage: 0 };
    
    let score = 0;
    currentQuiz.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (!userAnswer) return;
      
      if (question.type === 'multiple_choice' || question.type === 'fill_blank') {
        if (Array.isArray(question.correctAnswer)) {
          // Multiple correct answers
          if (Array.isArray(userAnswer) && 
              userAnswer.length === question.correctAnswer.length &&
              userAnswer.every(ans => question.correctAnswer.includes(ans))) {
            score += question.points;
          }
        } else {
          // Single correct answer
          if (userAnswer === question.correctAnswer) {
            score += question.points;
          }
        }
      } else if (question.type === 'matching') {
        // For matching, assume partial scoring
        if (Array.isArray(userAnswer) && Array.isArray(question.correctAnswer)) {
          const correctMatches = userAnswer.filter((ans, index) => 
            ans === question.correctAnswer[index]
          ).length;
          score += (correctMatches / question.correctAnswer.length) * question.points;
        }
      }
      // Essay questions would need manual grading
    });
    
    const percentage = Math.round((score / currentQuiz.totalPoints) * 100);
    return { score, percentage };
  };

  const submitQuiz = async (): Promise<QuizAttempt> => {
    if (!currentQuiz || !currentAttempt || !user) {
      throw new Error('No active quiz to submit');
    }
    
    const { score, percentage } = calculateScore();
    const timeSpent = (currentQuiz.duration * 60) - timeRemaining;
    
    const completedAttempt: QuizAttempt = {
      ...currentAttempt,
      answers: userAnswers,
      score,
      percentage,
      passed: percentage >= currentQuiz.passingScore,
      completedAt: new Date().toISOString(),
      timeSpent
    };
    
    setCurrentAttempt(completedAttempt);
    setIsQuizActive(false);
    setIsQuizCompleted(true);
    
    // Save to backend
    try {
      await fetch('/api/quiz-attempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(completedAttempt)
      });
      
      addNotification({
        title: completedAttempt.passed ? 'Quiz hoàn thành thành công!' : 'Quiz đã hoàn thành',
        message: `Điểm số: ${score}/${currentQuiz.totalPoints} (${percentage}%). ${
          completedAttempt.passed ? 'Chúc mừng bạn đã đạt!' : 'Hãy cố gắng thêm lần sau!'
        }`,
        type: completedAttempt.passed ? 'success' : 'warning'
      });
      
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
      addNotification({
        title: 'Lỗi lưu kết quả',
        message: 'Có lỗi xảy ra khi lưu kết quả quiz. Vui lòng liên hệ admin.',
        type: 'error'
      });
    }
    
    return completedAttempt;
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setCurrentAttempt(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeRemaining(0);
    setIsQuizActive(false);
    setIsQuizCompleted(false);
  };

  // Admin functions
  const createQuiz = async (quizData: Omit<Quiz, 'id' | 'createdAt' | 'createdBy'>): Promise<Quiz> => {
    if (!user) throw new Error('User not authenticated');
    
    const quiz: Quiz = {
      ...quizData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };
    
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quiz)
      });
      
      if (!response.ok) throw new Error('Failed to create quiz');
      
      addNotification({
        title: 'Quiz đã được tạo',
        message: `Quiz "${quiz.title}" đã được tạo thành công.`,
        type: 'success'
      });
      
      return quiz;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  };

  const updateQuiz = async (quizId: string, updates: Partial<Quiz>): Promise<Quiz> => {
    try {
      const response = await fetch(`/api/quiz/${quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) throw new Error('Failed to update quiz');
      
      const updatedQuiz = await response.json();
      return updatedQuiz.data;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  };

  const deleteQuiz = async (quizId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/quiz/${quizId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete quiz');
      
      addNotification({
        title: 'Quiz đã được xóa',
        message: 'Quiz đã được xóa thành công.',
        type: 'success'
      });
      
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  };

  const getQuizzes = async (): Promise<Quiz[]> => {
    try {
      const response = await fetch('/api/quiz');
      
      if (!response.ok) throw new Error('Failed to fetch quizzes');
      
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      return [];
    }
  };

  const getQuizAttempts = async (quizId?: string): Promise<QuizAttempt[]> => {
    try {
      const url = quizId 
        ? `/api/quiz-attempts/${quizId}`
        : '/api/quiz-attempt';
      
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Failed to fetch quiz attempts');
      
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching quiz attempts:', error);
      return [];
    }
  };

  return (
    <QuizContext.Provider
      value={{
        currentQuiz,
        currentAttempt,
        currentQuestionIndex,
        userAnswers,
        timeRemaining,
        isQuizActive,
        isQuizCompleted,
        
        startQuiz,
        submitAnswer,
        nextQuestion,
        previousQuestion,
        submitQuiz,
        resetQuiz,
        
        createQuiz,
        updateQuiz,
        deleteQuiz,
        getQuizzes,
        getQuizAttempts
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
