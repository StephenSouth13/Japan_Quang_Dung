import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, userData } = await request.json();

    // Mock implementation for now - you would replace this with actual authentication logic
    const user = {
      id: Date.now().toString(),
      email,
      user_metadata: {
        name: userData.name || email.split('@')[0],
        role: userData.role || 'student',
        ...userData
      },
      created_at: new Date().toISOString()
    };

    return NextResponse.json({
      data: {
        user,
        session: {
          access_token: 'mock_token',
          user
        }
      },
      error: null
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Đăng ký thất bại' },
      { status: 400 }
    );
  }
}