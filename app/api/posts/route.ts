import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest';  // newest, popular

    let query = `
      SELECT id, title, excerpt, content, author, publish_date as "publishDate", category, level, 
             read_time as "readTime", views, comments, image, tags, is_featured as "isFeatured", 
             is_new as "isNew", created_at, updated_at
      FROM posts 
      WHERE true
      ORDER BY ${sortBy === 'popular' ? 'views DESC' : 'publish_date DESC'}
    `;
    let params: any[] = [];

    // Filter category
    if (category && category !== 'all') {
      query += ` AND category = $${params.length + 1}`;
      params.push(category);
    }

    // Filter level
    if (level && level !== 'all') {
      query += ` AND level = $${params.length + 1}`;
      params.push(level);
    }

    // Search in title, excerpt, author, tags
    if (search) {
      query += ` AND (title ILIKE $${params.length + 1} OR excerpt ILIKE $${params.length + 1} OR author ILIKE $${params.length + 1} OR tags @> $${params.length + 1})`;
      params.push(`%${search}%`);
      params.push(`{"${search}"}`);  // Tìm trong array tags
    }

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi tải danh sách bài viết' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const postData = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'content', 'category'];
    for (const field of requiredFields) {
      if (!postData[field]) {
        return NextResponse.json(
          { success: false, error: `Trường ${field} là bắt buộc` },
          { status: 400 }
        );
      }
    }
    
    // Xử lý tags (nếu là string, convert thành array)
    let tags = postData.tags;
    if (typeof tags === 'string') {
      tags = [tags];
    } else if (!Array.isArray(tags)) {
      tags = [];
    }

    const result = await pool.query(
      `INSERT INTO posts (title, excerpt, content, author, publish_date, category, level, read_time, views, comments, image, tags, is_featured, is_new) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        postData.title,
        postData.excerpt || postData.content.substring(0, 150) + '...',  // Auto-generate excerpt
        postData.content,
        postData.author || 'Admin',
        postData.publishDate || new Date().toISOString().split('T')[0],  // Default today
        postData.category,
        postData.level || 'All',
        postData.readTime || 5,
        postData.views || 0,
        postData.comments || 0,
        postData.image || 'https://via.placeholder.com/400',
        tags,
        postData.isFeatured || false,
        postData.isNew || false
      ]
    );
    
    const newPost = result.rows[0];
    console.log(`✅ Created new post: ${newPost.title} (ID: ${newPost.id})`);
    
    return NextResponse.json({
      success: true,
      data: newPost,
      message: 'Tạo bài viết thành công!'
    });

  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi tạo bài viết' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const postData = await request.json();
    const { id, ...updates } = postData;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID bài viết là bắt buộc' },
        { status: 400 }
      );
    }

    // Xử lý tags nếu có
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = [updates.tags];
    }

    // Build dynamic update query
    const fields = Object.keys(updates);
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    const result = await pool.query(
      `UPDATE posts SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [parseInt(id), ...Object.values(updates)]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bài viết' },
        { status: 404 }
      );
    }
    
    const updatedPost = result.rows[0];
    console.log(`✅ Updated post: ${updatedPost.title} (ID: ${id})`);
    
    return NextResponse.json({
      success: true,
      data: updatedPost,
      message: 'Cập nhật bài viết thành công!'
    });

  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi cập nhật bài viết' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID bài viết là bắt buộc' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 RETURNING *',
      [parseInt(id)]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bài viết' },
        { status: 404 }
      );
    }
    
    console.log(`✅ Deleted post ID: ${id}`);
    
    return NextResponse.json({
      success: true,
      message: 'Xóa bài viết thành công!'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi xóa bài viết' },
      { status: 500 }
    );
  }
}