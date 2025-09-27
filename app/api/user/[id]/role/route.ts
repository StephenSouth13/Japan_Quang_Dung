import { NextRequest, NextResponse } from 'next/server';

// Mock users storage - should match the one in /api/users
let users: any[] = [
  {
    id: '1',
    email: 'admin@japancenter.demo',
    name: 'Nguyễn Văn Admin',
    role: 'admin',
    created_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString()
  },
  {
    id: '2',
    email: 'teacher@japancenter.demo',
    name: 'Trần Thị Giáo Viên',
    role: 'teacher',
    created_at: new Date().toISOString(),
    last_sign_in_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    email: 'student1@example.com',
    name: 'Nguyễn Văn Học Viên',
    role: 'student',
    created_at: new Date().toISOString(),
    last_sign_in_at: new Date(Date.now() - 3600000).toISOString()
  }
];

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { role } = await request.json();
    
    if (!['student', 'teacher', 'admin'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role. Must be student, teacher, or admin' },
        { status: 400 }
      );
    }
    
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    users[userIndex].role = role;
    
    return NextResponse.json({
      success: true,
      message: 'User role updated successfully',
      data: users[userIndex]
    });

  } catch (error) {
    console.error('Update user role error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}