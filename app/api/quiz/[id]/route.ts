import { NextRequest, NextResponse } from 'next/server';

// Mock quiz storage - in production, you'd use a database
let quizzes: any[] = [];

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    const quizIndex = quizzes.findIndex(quiz => quiz.id === id);
    if (quizIndex === -1) {
      return NextResponse.json(
        { error: 'Quiz không tồn tại' },
        { status: 404 }
      );
    }
    
    quizzes[quizIndex] = { ...quizzes[quizIndex], ...updates };
    
    return NextResponse.json({
      data: quizzes[quizIndex],
      error: null
    });

  } catch (error) {
    console.error('Update quiz error:', error);
    return NextResponse.json(
      { error: 'Cập nhật quiz thất bại' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const quizIndex = quizzes.findIndex(quiz => quiz.id === id);
    if (quizIndex === -1) {
      return NextResponse.json(
        { error: 'Quiz không tồn tại' },
        { status: 404 }
      );
    }
    
    quizzes.splice(quizIndex, 1);
    
    return NextResponse.json({
      data: { success: true },
      error: null
    });

  } catch (error) {
    console.error('Delete quiz error:', error);
    return NextResponse.json(
      { error: 'Xóa quiz thất bại' },
      { status: 400 }
    );
  }
}