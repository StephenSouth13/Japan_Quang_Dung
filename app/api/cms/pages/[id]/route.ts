import { NextRequest, NextResponse } from 'next/server';

// Mock CMS pages storage - in production, you'd use a database
let pages: any[] = [];

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    const pageIndex = pages.findIndex(page => page.id === id);
    if (pageIndex === -1) {
      return NextResponse.json(
        { error: 'Trang không tồn tại' },
        { status: 404 }
      );
    }
    
    pages[pageIndex] = { 
      ...pages[pageIndex], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      data: pages[pageIndex],
      error: null
    });

  } catch (error) {
    console.error('Update page error:', error);
    return NextResponse.json(
      { error: 'Cập nhật trang thất bại' },
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
    
    const pageIndex = pages.findIndex(page => page.id === id);
    if (pageIndex === -1) {
      return NextResponse.json(
        { error: 'Trang không tồn tại' },
        { status: 404 }
      );
    }
    
    pages.splice(pageIndex, 1);
    
    return NextResponse.json({
      data: { success: true },
      error: null
    });

  } catch (error) {
    console.error('Delete page error:', error);
    return NextResponse.json(
      { error: 'Xóa trang thất bại' },
      { status: 400 }
    );
  }
}