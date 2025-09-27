import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../server/storage';
import type { InsertQuizAttempt } from '../../../shared/schema';

export async function POST(request: NextRequest) {
  try {
    const attemptData = await request.json();
    
    const insertAttempt: InsertQuizAttempt = {
      quizId: attemptData.quizId,
      userId: attemptData.userId || null,
      userEmail: attemptData.userEmail,
      userName: attemptData.userName,
      answers: JSON.stringify(attemptData.answers),
      score: attemptData.score,
      totalQuestions: attemptData.totalQuestions
    };
    
    const newAttempt = await storage.createQuizAttempt(insertAttempt);
    
    console.log(`✅ Saved quiz attempt: User ${newAttempt.userName} scored ${newAttempt.score}/${newAttempt.totalQuestions}`);
    
    return NextResponse.json({
      data: newAttempt,
      error: null
    });

  } catch (error) {
    console.error('Save quiz attempt error:', error);
    return NextResponse.json(
      { error: 'Lưu kết quả quiz thất bại' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');
    
    const attempts = await storage.getQuizAttempts(quizId ? parseInt(quizId) : undefined);
    
    // Parse answers JSON for each attempt
    const formattedAttempts = attempts.map(attempt => ({
      ...attempt,
      answers: attempt.answers ? JSON.parse(attempt.answers) : []
    }));
    
    return NextResponse.json({
      data: formattedAttempts,
      error: null
    });
  } catch (error) {
    console.error('Get quiz attempts error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy kết quả quiz' },
      { status: 500 }
    );
  }
}