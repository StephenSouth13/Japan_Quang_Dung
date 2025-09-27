import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../server/storage';
import type { InsertQuiz } from '../../../shared/schema';

export async function GET() {
  try {
    const allQuizzes = await storage.getAllQuizzes();
    
    // Parse questions JSON for each quiz
    const formattedQuizzes = allQuizzes.map(quiz => ({
      ...quiz,
      questions: quiz.questions ? JSON.parse(quiz.questions) : []
    }));
    
    return NextResponse.json({
      data: formattedQuizzes,
      error: null
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách quiz' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const quizData = await request.json();
    
    const insertQuiz: InsertQuiz = {
      title: quizData.title,
      level: quizData.level,
      description: quizData.description,
      questions: JSON.stringify(quizData.questions || []),
      timeLimit: quizData.timeLimit || 30,
      isActive: true
    };
    
    const newQuiz = await storage.createQuiz(insertQuiz);
    
    // Parse questions for response
    const responseQuiz = {
      ...newQuiz,
      questions: newQuiz.questions ? JSON.parse(newQuiz.questions) : []
    };
    
    console.log(`✅ Created quiz: ${newQuiz.title} (ID: ${newQuiz.id})`);
    
    return NextResponse.json({
      data: responseQuiz,
      error: null
    });

  } catch (error) {
    console.error('Create quiz error:', error);
    return NextResponse.json(
      { error: 'Tạo quiz thất bại' },
      { status: 400 }
    );
  }
}