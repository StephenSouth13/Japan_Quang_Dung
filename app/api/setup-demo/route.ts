import { NextRequest, NextResponse } from 'next/server';

// Demo accounts data
const demoAccounts = [
  {
    email: 'admin@japancenter.demo',
    password: 'Admin123!@#',
    role: 'admin',
    name: 'Nguyễn Văn Admin'
  },
  {
    email: 'teacher@japancenter.demo',
    password: 'Teacher123!@#',
    role: 'teacher',
    name: 'Trần Thị Giáo Viên'
  }
];

// Mock user storage - in production, use a database
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

export async function POST(request: NextRequest) {
  try {
    console.log('Manual demo account setup requested');
    
    const results = [];
    
    for (const account of demoAccounts) {
      try {
        // Check if user already exists
        const existingUser = users.find(u => u.email === account.email);
        
        if (existingUser) {
          results.push({ 
            email: account.email, 
            role: account.role, 
            status: 'exists',
            message: 'Already exists'
          });
        } else {
          // Create new user
          const newUser = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            email: account.email,
            name: account.name,
            role: account.role,
            created_at: new Date().toISOString(),
            last_sign_in_at: null
          };
          
          users.push(newUser);
          
          results.push({ 
            email: account.email, 
            role: account.role, 
            status: 'created',
            message: 'Successfully created'
          });
          
          console.log(`✓ Created demo account: ${account.email} (${account.role})`);
        }
      } catch (error) {
        results.push({ 
          email: account.email, 
          role: account.role, 
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Demo setup completed",
      results 
    });
    
  } catch (error) {
    console.error("Setup demo accounts error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi setup demo accounts" 
    }, { status: 500 });
  }
}