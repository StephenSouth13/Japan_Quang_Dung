import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, email, name, role, created_at, last_sign_in_at FROM users ORDER BY created_at DESC'
    );
    console.log('Fetched users:', result.rows);
    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi lấy danh sách người dùng' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const result = await pool.query(
      'INSERT INTO users (email, name, role) VALUES ($1, $2, $3) RETURNING *',
      [userData.email, userData.name, userData.role || 'student']
    );
    const newUser = result.rows[0];
    console.log(`✅ Created user: ${newUser.name} (${newUser.email})`);
    return NextResponse.json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { success: false, error: 'Tạo người dùng thất bại' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, role } = await request.json();
    if (!id || !role) {
      return NextResponse.json(
        { success: false, error: 'ID và role là bắt buộc' },
        { status: 400 }
      );
    }
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
      [role, id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Người dùng không tồn tại' },
        { status: 404 }
      );
    }
    console.log(`✅ Updated user ${id} role to ${role}`);
    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Cập nhật quyền thành công!',
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, error: 'Cập nhật quyền thất bại' },
      { status: 400 }
    );
  }
}