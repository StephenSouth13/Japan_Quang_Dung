import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get("level");

    let query = "SELECT * FROM courses ORDER BY created_at DESC";
    let params: any[] = [];

    if (level && level !== "all") {
      query = "SELECT * FROM courses WHERE level = $1 ORDER BY created_at DESC";
      params = [level];
    }

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json(
      { success: false, error: "Có lỗi xảy ra khi tải danh sách khóa học" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const courseData = await request.json();

    const requiredFields = ["title", "description", "level", "price"];
    for (const field of requiredFields) {
      if (!courseData[field]) {
        return NextResponse.json(
          { success: false, error: `Trường ${field} là bắt buộc` },
          { status: 400 }
        );
      }
    }

    const result = await pool.query(
      `INSERT INTO courses (
        title, description, level, price, original_price, category, schedule,
        start_date, end_date, capacity, enrolled_count, teacher, status, is_popular, image, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
      [
        courseData.title,
        courseData.description,
        courseData.level,
        courseData.price,
        courseData.original_price || null,
        courseData.category || "Khóa học cơ bản",
        courseData.schedule || null,
        courseData.start_date || null,
        courseData.end_date || null,
        courseData.capacity || 20,
        0,
        courseData.teacher || null,
        courseData.status || "upcoming",
        courseData.is_popular || false,
        courseData.image || null,
        true,
      ]
    );

    const newCourse = result.rows[0];
    console.log(`✅ Created new course: ${newCourse.title} (ID: ${newCourse.id})`);

    return NextResponse.json({
      success: true,
      data: newCourse,
      message: "Tạo khóa học thành công!",
    });
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json(
      { success: false, error: "Có lỗi xảy ra khi tạo khóa học" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const courseData = await request.json();
    const { id, ...updates } = courseData;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID khóa học là bắt buộc" },
        { status: 400 }
      );
    }

    const fields = Object.keys(updates);
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(", ");

    const result = await pool.query(
      `UPDATE courses SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [parseInt(id), ...Object.values(updates)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy khóa học" },
        { status: 404 }
      );
    }

    const updatedCourse = result.rows[0];
    console.log(`✅ Updated course: ${updatedCourse.title} (ID: ${id})`);

    return NextResponse.json({
      success: true,
      data: updatedCourse,
      message: "Cập nhật khóa học thành công!",
    });
  } catch (error) {
    console.error("Update course error:", error);
    return NextResponse.json(
      { success: false, error: "Có lỗi xảy ra khi cập nhật khóa học" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID khóa học là bắt buộc" },
        { status: 400 }
      );
    }

    const result = await pool.query("DELETE FROM courses WHERE id = $1 RETURNING *", [parseInt(id)]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy khóa học" },
        { status: 404 }
      );
    }

    console.log(`✅ Deleted course: ID ${id}`);
    return NextResponse.json({
      success: true,
      message: "Xóa khóa học thành công!",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json(
      { success: false, error: "Có lỗi xảy ra khi xóa khóa học" },
      { status: 500 }
    );
  }
}