import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM registrations ORDER BY created_at DESC');
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi lấy danh sách đăng ký' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const registrationData = await request.json();
    
    // Generate unique registration ID
    const registrationId = 'REG' + Date.now().toString() + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    const result = await pool.query(
      'INSERT INTO registrations (registration_id, full_name, email, phone, course_id, course_title, course_price, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [
        registrationId,
        registrationData.fullName,
        registrationData.email,
        registrationData.phone,
        registrationData.courseId || null,
        registrationData.courseTitle,
        registrationData.coursePrice,
        'pending_payment'
      ]
    );
    
    const newRegistration = result.rows[0];
    console.log(`✅ Created registration: ${newRegistration.full_name} (${newRegistration.registration_id})`);
    
    return NextResponse.json({
      success: true,
      data: newRegistration,
      message: 'Tạo đăng ký thành công!'
    });

  } catch (error) {
    console.error('Create registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Tạo đăng ký thất bại' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { registrationId, status } = await request.json();
    
    if (!registrationId) {
      return NextResponse.json(
        { success: false, error: 'ID đăng ký là bắt buộc' },
        { status: 400 }
      );
    }
    
    // Update registration with payment confirmation timestamp if confirmed
    let query, params;
    if (status === 'confirmed') {
      query = 'UPDATE registrations SET status = $1, payment_confirmed_at = NOW() WHERE registration_id = $2 RETURNING *';
      params = [status, registrationId];
    } else {
      query = 'UPDATE registrations SET status = $1 WHERE registration_id = $2 RETURNING *';
      params = [status, registrationId];
    }
    
    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Đăng ký không tồn tại' },
        { status: 404 }
      );
    }
    
    const updatedRegistration = result.rows[0];
    console.log(`✅ Updated registration: ${updatedRegistration.full_name} status to ${status}`);
    
    return NextResponse.json({
      success: true,
      data: updatedRegistration,
      message: 'Cập nhật trạng thái thành công!'
    });

  } catch (error) {
    console.error('Update registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Cập nhật đăng ký thất bại' },
      { status: 400 }
    );
  }
}