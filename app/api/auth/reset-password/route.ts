import { NextRequest, NextResponse } from 'next/server';
import { tokenStore } from '../../shared/token-store';

// Mock user storage - in production, use a database or Supabase
let users: { [email: string]: { id: string; email: string; password: string; name: string } } = {
  'admin@example.com': {
    id: '1',
    email: 'admin@example.com',
    password: 'hashedpassword123',
    name: 'Admin User'
  }
};

function hashPassword(password: string): string {
  // In production, use proper password hashing like bcrypt
  return 'hashed_' + password;
}

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword, confirmPassword } = await request.json();

    if (!token || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'Token và mật khẩu mới là bắt buộc' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Mật khẩu xác nhận không khớp' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    // Verify token
    const tokenVerification = tokenStore.verifyToken(token);
    
    if (!tokenVerification.isValid || !tokenVerification.email) {
      return NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    const userEmail = tokenVerification.email;

    // Update user password
    if (users[userEmail]) {
      users[userEmail].password = hashPassword(newPassword);
    }

    // Mark token as used
    if (!tokenStore.useToken(token)) {
      return NextResponse.json(
        { error: 'Token đã được sử dụng' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Mật khẩu đã được đặt lại thành công',
      success: true
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi đặt lại mật khẩu' },
      { status: 500 }
    );
  }
}

// Endpoint to verify if a reset token is valid
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token là bắt buộc' },
        { status: 400 }
      );
    }

    // Verify token
    const tokenVerification = tokenStore.verifyToken(token);
    const isValid = tokenVerification.isValid;

    return NextResponse.json({
      valid: isValid,
      message: isValid ? 'Token hợp lệ' : 'Token không hợp lệ hoặc đã hết hạn'
    });

  } catch (error) {
    console.error('Verify token error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xác minh token' },
      { status: 500 }
    );
  }
}