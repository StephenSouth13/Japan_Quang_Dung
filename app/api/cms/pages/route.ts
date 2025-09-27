import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../../server/storage';
import type { InsertCmsPage } from '../../../../shared/schema';

export async function GET() {
  try {
    const allPages = await storage.getAllCmsPages();
    return NextResponse.json({
      data: allPages,
      error: null
    });
  } catch (error) {
    console.error('Get CMS pages error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách trang' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const pageData = await request.json();
    
    const insertPage: InsertCmsPage = {
      pageId: Date.now().toString(),
      title: pageData.title,
      slug: pageData.slug || pageData.title.toLowerCase().replace(/\s+/g, '-'),
      content: pageData.content,
      status: pageData.status || 'draft'
    };
    
    const newPage = await storage.createCmsPage(insertPage);
    
    console.log(`✅ Created CMS page: ${newPage.title} (ID: ${newPage.pageId})`);
    
    return NextResponse.json({
      data: newPage,
      error: null
    });

  } catch (error) {
    console.error('Create page error:', error);
    return NextResponse.json(
      { error: 'Tạo trang thất bại' },
      { status: 400 }
    );
  }
}