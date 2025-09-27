import { storage } from '../server/storage';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create demo users
    console.log('Creating demo users...');
    const demoUsers = [
      {
        email: 'admin@japancenter.demo',
        name: 'Nguyễn Văn Admin',
        role: 'admin'
      },
      {
        email: 'teacher@japancenter.demo',
        name: 'Trần Thị Giáo Viên',
        role: 'teacher'
      },
      {
        email: 'student1@example.com',
        name: 'Nguyễn Văn Học Viên',
        role: 'student'
      }
    ];

    for (const user of demoUsers) {
      const existingUser = await storage.getUserByEmail(user.email);
      if (!existingUser) {
        await storage.createUser(user);
        console.log(`✅ Created user: ${user.name} (${user.email})`);
      } else {
        console.log(`⏭️  User already exists: ${user.email}`);
      }
    }

    // Create demo courses
    console.log('Creating demo courses...');
    const demoCourses = [
      {
        title: 'Tiếng Nhật Sơ cấp N5',
        description: 'Khóa học tiếng Nhật dành cho người mới bắt đầu, học từ cơ bản đến nâng cao.',
        level: 'N5',
        price: '2.500.000',
        duration: '3 tháng',
        capacity: 25,
        enrolledCount: 18,
        isActive: true
      },
      {
        title: 'Tiếng Nhật Trung cấp N4',
        description: 'Khóa học dành cho học viên đã có kiến thức N5, nâng cao kỹ năng giao tiếp.',
        level: 'N4',
        price: '3.200.000',
        duration: '4 tháng',
        capacity: 20,
        enrolledCount: 15,
        isActive: true
      },
      {
        title: 'Luyện thi JLPT N3',
        description: 'Khóa học chuyên sâu chuẩn bị cho kỳ thi JLPT N3.',
        level: 'N3',
        price: '2.800.000',
        duration: '2 tháng',
        capacity: 15,
        enrolledCount: 8,
        isActive: true
      }
    ];

    for (const course of demoCourses) {
      try {
        const result = await storage.createCourse(course);
        console.log(`✅ Created course: ${result.title} (ID: ${result.id})`);
      } catch (error) {
        console.log(`⏭️  Course might already exist: ${course.title}`);
      }
    }

    // Create demo registrations
    console.log('Creating demo registrations...');
    const demoRegistrations = [
      {
        registrationId: '1' + Date.now().toString(),
        fullName: 'Nguyễn Văn A',
        email: 'student1@example.com',
        phone: '0123456789',
        courseId: 1,
        courseTitle: 'Tiếng Nhật Sơ cấp N5',
        coursePrice: '2.500.000',
        status: 'pending_payment'
      },
      {
        registrationId: '2' + Date.now().toString(),
        fullName: 'Trần Thị B',
        email: 'student2@example.com',
        phone: '0987654321',
        courseId: 2,
        courseTitle: 'Tiếng Nhật Trung cấp N4',
        coursePrice: '3.200.000',
        status: 'confirmed'
      }
    ];

    for (const registration of demoRegistrations) {
      try {
        const result = await storage.createRegistration(registration);
        console.log(`✅ Created registration: ${result.fullName} (ID: ${result.registrationId})`);
      } catch (error) {
        console.log(`⏭️  Registration might already exist: ${registration.fullName}`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };