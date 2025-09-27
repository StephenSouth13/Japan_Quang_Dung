import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";
import { setupCMSEndpoints } from "./cms_endpoints.tsx";

const app = new Hono();

// Initialize Supabase client for server operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

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

// Auto-setup demo accounts on server start
async function setupDemoAccounts() {
  console.log('🔧 Setting up demo accounts...');
  
  for (const account of demoAccounts) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        user_metadata: {
          name: account.name,
          fullName: account.name,
          role: account.role
        },
        email_confirm: true
      });
      
      if (error) {
        if (error.message?.includes('User already registered') || 
            error.message?.includes('already exists')) {
          console.log(`✓ Demo account already exists: ${account.email} (${account.role})`);
        } else {
          console.error(`✗ Failed to create ${account.email}:`, error.message);
        }
      } else {
        console.log(`✓ Created demo account: ${account.email} (${account.role})`);
        
        // Store in KV store
        if (data.user) {
          await kv.set(`user:${data.user.id}`, JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name: account.name,
            fullName: account.name,
            role: account.role,
            createdAt: new Date().toISOString()
          }));
        }
      }
    } catch (error) {
      console.error(`✗ Error setting up ${account.email}:`, error);
    }
  }
  
  console.log('🎉 Demo account setup completed!');
}

// Enable CORS for all routes and methods (must be first)
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Enable logger
app.use('*', logger(console.log));

// Global error handler - ensure all errors return JSON
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({
    success: false,
    error: err.message || 'Internal server error'
  }, 500);
});

// Catch-all handler for 404s
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Endpoint not found'
  }, 404);
});

// Run setup on server start
setupDemoAccounts();

// Setup CMS endpoints
setupCMSEndpoints(app);

// Health check endpoint
app.get("/make-server-2c1a01cc/health", (c) => {
  return c.json({ status: "ok" });
});

// Setup demo accounts endpoint
app.post("/make-server-2c1a01cc/setup-demo", async (c) => {
  try {
    console.log('Manual demo account setup requested');
    
    const results = [];
    for (const account of demoAccounts) {
      try {
        const { data, error } = await supabase.auth.admin.createUser({
          email: account.email,
          password: account.password,
          user_metadata: {
            name: account.name,
            fullName: account.name,
            role: account.role
          },
          email_confirm: true
        });
        
        if (error) {
          if (error.message?.includes('User already registered') || 
              error.message?.includes('already exists')) {
            results.push({ 
              email: account.email, 
              role: account.role, 
              status: 'exists',
              message: 'Already exists'
            });
          } else {
            results.push({ 
              email: account.email, 
              role: account.role, 
              status: 'error',
              message: error.message
            });
          }
        } else {
          results.push({ 
            email: account.email, 
            role: account.role, 
            status: 'created',
            message: 'Successfully created'
          });
          
          // Store in KV store
          if (data.user) {
            await kv.set(`user:${data.user.id}`, JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              name: account.name,
              fullName: account.name,
              role: account.role,
              createdAt: new Date().toISOString()
            }));
          }
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
    
    return c.json({ 
      success: true, 
      message: "Demo setup completed",
      results 
    });
    
  } catch (error) {
    console.error("Setup demo accounts error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi setup demo accounts" 
    }, 500);
  }
});

// User signup endpoint
app.post("/make-server-2c1a01cc/signup", async (c) => {
  try {
    const { email, password, userData } = await c.req.json();
    
    // Add default role if not specified
    const userMetadata = {
      ...userData,
      role: userData.role || 'student' // Default to student role
    };
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: userMetadata,
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.error("Signup error:", error);
      // Check if user already exists
      if (error.message?.includes('User already registered') || error.message?.includes('already exists')) {
        return c.json({ 
          success: false, 
          error: "Email đã được sử dụng" 
        }, 400);
      }
      return c.json({ 
        success: false, 
        error: error.message || "Có lỗi xảy ra khi đăng ký" 
      }, 400);
    }
    
    // Store additional user data in KV store
    if (data.user) {
      await kv.set(`user:${data.user.id}`, JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        ...userMetadata,
        createdAt: new Date().toISOString()
      }));
      
      console.log(`New user registered: ${email} with role: ${userMetadata.role}`);
    }
    
    return c.json({ 
      success: true, 
      message: "Đăng ký thành công!",
      user: data.user 
    });
    
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi đăng ký" 
    }, 500);
  }
});

// Get user profile endpoint
app.get("/make-server-2c1a01cc/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ 
        success: false, 
        error: "Unauthorized" 
      }, 401);
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ 
        success: false, 
        error: "Unauthorized" 
      }, 401);
    }
    
    // Get additional user data from KV store
    const userData = await kv.get(`user:${user.id}`);
    const profile = userData ? JSON.parse(userData) : null;
    
    return c.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        ...profile
      }
    });
    
  } catch (error) {
    console.error("Get profile error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi lấy thông tin profile" 
    }, 500);
  }
});

// Course registration endpoint
app.post("/make-server-2c1a01cc/register-course", async (c) => {
  try {
    const body = await c.req.json();
    
    // Generate registration ID
    const registrationId = `REG${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Store registration data
    const registrationData = {
      ...body,
      registrationId,
      createdAt: new Date().toISOString(),
      status: "pending_payment"
    };
    
    await kv.set(`registration:${registrationId}`, JSON.stringify(registrationData));
    
    // Also store in a list for admin purposes
    const existingRegistrations = await kv.get("all_registrations");
    const registrations = existingRegistrations ? JSON.parse(existingRegistrations) : [];
    registrations.push(registrationId);
    await kv.set("all_registrations", JSON.stringify(registrations));
    
    console.log(`New course registration: ${registrationId} for course ${body.courseTitle}`);
    
    return c.json({ 
      success: true, 
      registrationId,
      message: "Đăng ký thành công!" 
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi đăng ký" 
    }, 500);
  }
});

// Get registration details endpoint
app.get("/make-server-2c1a01cc/registration/:id", async (c) => {
  try {
    const registrationId = c.req.param("id");
    const registrationData = await kv.get(`registration:${registrationId}`);
    
    if (!registrationData) {
      return c.json({ 
        success: false, 
        error: "Không tìm thấy thông tin đăng ký" 
      }, 404);
    }
    
    return c.json({ 
      success: true, 
      data: JSON.parse(registrationData) 
    });
    
  } catch (error) {
    console.error("Get registration error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi lấy thông tin đăng ký" 
    }, 500);
  }
});

// Update payment status endpoint (for admin use)
app.put("/make-server-2c1a01cc/registration/:id/payment", async (c) => {
  try {
    const registrationId = c.req.param("id");
    const { status } = await c.req.json();
    
    const registrationData = await kv.get(`registration:${registrationId}`);
    if (!registrationData) {
      return c.json({ 
        success: false, 
        error: "Không tìm thấy thông tin đăng ký" 
      }, 404);
    }
    
    const data = JSON.parse(registrationData);
    data.status = status;
    data.paymentConfirmedAt = new Date().toISOString();
    
    await kv.set(`registration:${registrationId}`, JSON.stringify(data));
    
    console.log(`Payment status updated for ${registrationId}: ${status}`);
    
    return c.json({ 
      success: true, 
      message: "Cập nhật trạng thái thanh toán thành công" 
    });
    
  } catch (error) {
    console.error("Update payment status error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi cập nhật trạng thái thanh toán" 
    }, 500);
  }
});

// Get all registrations endpoint (for admin use)
app.get("/make-server-2c1a01cc/registrations", async (c) => {
  try {
    const allRegistrationsData = await kv.get("all_registrations");
    const registrationIds = allRegistrationsData ? JSON.parse(allRegistrationsData) : [];
    
    const registrations = [];
    for (const id of registrationIds) {
      const regData = await kv.get(`registration:${id}`);
      if (regData) {
        registrations.push(JSON.parse(regData));
      }
    }
    
    return c.json({ 
      success: true, 
      data: registrations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    });
    
  } catch (error) {
    console.error("Get all registrations error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi lấy danh sách đăng ký" 
    }, 500);
  }
});

// Notifications endpoints
app.get("/make-server-2c1a01cc/notifications", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ 
        success: false, 
        error: "Unauthorized" 
      }, 401);
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ 
        success: false, 
        error: "Unauthorized" 
      }, 401);
    }
    
    const notificationsData = await kv.get(`notifications:${user.id}`);
    const notifications = notificationsData ? JSON.parse(notificationsData) : [];
    
    return c.json({ 
      success: true, 
      data: notifications 
    });
    
  } catch (error) {
    console.error("Get notifications error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi lấy thông báo" 
    }, 500);
  }
});

app.post("/make-server-2c1a01cc/notifications", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ 
        success: false, 
        error: "Unauthorized" 
      }, 401);
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ 
        success: false, 
        error: "Unauthorized" 
      }, 401);
    }
    
    const { notifications } = await c.req.json();
    
    await kv.set(`notifications:${user.id}`, JSON.stringify(notifications));
    
    return c.json({ 
      success: true, 
      message: "Notifications saved successfully" 
    });
    
  } catch (error) {
    console.error("Save notifications error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi lưu thông báo" 
    }, 500);
  }
});

// Send notification to user (for admin use)
app.post("/make-server-2c1a01cc/send-notification", async (c) => {
  try {
    const { userId, title, message, type } = await c.req.json();
    
    const notificationsData = await kv.get(`notifications:${userId}`);
    const notifications = notificationsData ? JSON.parse(notificationsData) : [];
    
    const newNotification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    notifications.unshift(newNotification);
    await kv.set(`notifications:${userId}`, JSON.stringify(notifications));
    
    console.log(`Notification sent to user ${userId}: ${title}`);
    
    return c.json({ 
      success: true, 
      message: "Notification sent successfully" 
    });
    
  } catch (error) {
    console.error("Send notification error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi gửi thông báo" 
    }, 500);
  }
});

// Send email notification (mock implementation)
app.post("/make-server-2c1a01cc/send-email", async (c) => {
  try {
    const { to, subject, body, type } = await c.req.json();
    
    // In a real application, you would integrate with an email service like:
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP
    // - Resend
    
    // Mock email sending
    console.log(`Email sent to ${to}:`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log(`Type: ${type}`);
    
    // Save email to logs for tracking
    const emailLog = {
      to,
      subject,
      body,
      type,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };
    
    const existingLogs = await kv.get("email_logs");
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push(emailLog);
    await kv.set("email_logs", JSON.stringify(logs));
    
    return c.json({ 
      success: true, 
      message: "Email sent successfully" 
    });
    
  } catch (error) {
    console.error("Send email error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi gửi email" 
    }, 500);
  }
});

// Quiz Management Endpoints

// Get all quizzes
app.get("/make-server-2c1a01cc/quizzes", async (c) => {
  try {
    const allQuizzesData = await kv.get("all_quizzes");
    const quizIds = allQuizzesData ? JSON.parse(allQuizzesData) : [];
    
    const quizzes = [];
    for (const id of quizIds) {
      const quizData = await kv.get(`quiz:${id}`);
      if (quizData) {
        quizzes.push(JSON.parse(quizData));
      }
    }
    
    return c.json({ 
      success: true, 
      data: quizzes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    });
    
  } catch (error) {
    console.error("Get quizzes error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi lấy danh sách quiz" 
    }, 500);
  }
});

// Create new quiz
app.post("/make-server-2c1a01cc/quiz", async (c) => {
  try {
    const quiz = await c.req.json();
    const quizId = quiz.id;
    
    // Save quiz
    await kv.set(`quiz:${quizId}`, JSON.stringify(quiz));
    
    // Update quiz list
    const allQuizzesData = await kv.get("all_quizzes");
    const quizIds = allQuizzesData ? JSON.parse(allQuizzesData) : [];
    if (!quizIds.includes(quizId)) {
      quizIds.push(quizId);
      await kv.set("all_quizzes", JSON.stringify(quizIds));
    }
    
    console.log(`Quiz created: ${quiz.title} (ID: ${quizId})`);
    
    return c.json({ 
      success: true, 
      data: quiz
    });
    
  } catch (error) {
    console.error("Create quiz error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi tạo quiz" 
    }, 500);
  }
});

// Update quiz
app.put("/make-server-2c1a01cc/quiz/:id", async (c) => {
  try {
    const quizId = c.req.param('id');
    const updates = await c.req.json();
    
    const existingQuizData = await kv.get(`quiz:${quizId}`);
    if (!existingQuizData) {
      return c.json({ 
        success: false, 
        error: "Quiz không tồn tại" 
      }, 404);
    }
    
    const existingQuiz = JSON.parse(existingQuizData);
    const updatedQuiz = { ...existingQuiz, ...updates };
    
    await kv.set(`quiz:${quizId}`, JSON.stringify(updatedQuiz));
    
    console.log(`Quiz updated: ${updatedQuiz.title} (ID: ${quizId})`);
    
    return c.json({ 
      success: true, 
      data: updatedQuiz 
    });
    
  } catch (error) {
    console.error("Update quiz error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi cập nhật quiz" 
    }, 500);
  }
});

// Delete quiz
app.delete("/make-server-2c1a01cc/quiz/:id", async (c) => {
  try {
    const quizId = c.req.param('id');
    
    // Remove quiz data
    await kv.del(`quiz:${quizId}`);
    
    // Update quiz list
    const allQuizzesData = await kv.get("all_quizzes");
    const quizIds = allQuizzesData ? JSON.parse(allQuizzesData) : [];
    const updatedQuizIds = quizIds.filter(id => id !== quizId);
    await kv.set("all_quizzes", JSON.stringify(updatedQuizIds));
    
    // Clean up quiz attempts
    const attemptKeys = await kv.mget(await kv.getByPrefix(`quiz_attempt:${quizId}:`));
    for (const key of Object.keys(attemptKeys)) {
      await kv.del(key);
    }
    
    console.log(`Quiz deleted: ${quizId}`);
    
    return c.json({ 
      success: true, 
      message: "Quiz đã được xóa thành công" 
    });
    
  } catch (error) {
    console.error("Delete quiz error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi xóa quiz" 
    }, 500);
  }
});

// Save quiz attempt
app.post("/make-server-2c1a01cc/quiz-attempt", async (c) => {
  try {
    const attempt = await c.req.json();
    const attemptId = attempt.id;
    const quizId = attempt.quizId;
    const userId = attempt.userId;
    
    // Save attempt
    await kv.set(`quiz_attempt:${quizId}:${attemptId}`, JSON.stringify(attempt));
    
    // Update user attempts list
    const userAttemptsKey = `user_quiz_attempts:${userId}`;
    const userAttemptsData = await kv.get(userAttemptsKey);
    const userAttempts = userAttemptsData ? JSON.parse(userAttemptsData) : [];
    userAttempts.push(attemptId);
    await kv.set(userAttemptsKey, JSON.stringify(userAttempts));
    
    // Update quiz attempts list
    const quizAttemptsKey = `quiz_attempts:${quizId}`;
    const quizAttemptsData = await kv.get(quizAttemptsKey);
    const quizAttempts = quizAttemptsData ? JSON.parse(quizAttemptsData) : [];
    quizAttempts.push(attemptId);
    await kv.set(quizAttemptsKey, JSON.stringify(quizAttempts));
    
    console.log(`Quiz attempt saved: ${attemptId} for quiz ${quizId} by user ${userId}`);
    
    return c.json({ 
      success: true, 
      data: attempt 
    });
    
  } catch (error) {
    console.error("Save quiz attempt error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi lưu kết quả quiz" 
    }, 500);
  }
});

// Get quiz attempts (all or by quiz ID)
app.get("/make-server-2c1a01cc/quiz-attempts/:quizId?", async (c) => {
  try {
    const quizId = c.req.param('quizId');
    
    if (quizId) {
      // Get attempts for specific quiz
      const quizAttemptsData = await kv.get(`quiz_attempts:${quizId}`);
      const attemptIds = quizAttemptsData ? JSON.parse(quizAttemptsData) : [];
      
      const attempts = [];
      for (const attemptId of attemptIds) {
        const attemptData = await kv.get(`quiz_attempt:${quizId}:${attemptId}`);
        if (attemptData) {
          attempts.push(JSON.parse(attemptData));
        }
      }
      
      return c.json({ 
        success: true, 
        data: attempts.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      });
      
    } else {
      // Get all attempts (for admin)
      const allQuizzesData = await kv.get("all_quizzes");
      const quizIds = allQuizzesData ? JSON.parse(allQuizzesData) : [];
      
      const allAttempts = [];
      for (const qId of quizIds) {
        const quizAttemptsData = await kv.get(`quiz_attempts:${qId}`);
        const attemptIds = quizAttemptsData ? JSON.parse(quizAttemptsData) : [];
        
        for (const attemptId of attemptIds) {
          const attemptData = await kv.get(`quiz_attempt:${qId}:${attemptId}`);
          if (attemptData) {
            allAttempts.push(JSON.parse(attemptData));
          }
        }
      }
      
      return c.json({ 
        success: true, 
        data: allAttempts.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      });
    }
    
  } catch (error) {
    console.error("Get quiz attempts error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi lấy kết quả quiz" 
    }, 500);
  }
});

// Get all users (admin only)
app.get("/make-server-2c1a01cc/users", async (c) => {
  try {
    // Get all users from Supabase Auth
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error("Get users error:", error);
      return c.json({ success: false, error: error.message }, 400);
    }
    
    // Transform user data to include role from metadata
    const usersWithRoles = data.users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.fullName || user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown',
      role: user.user_metadata?.role || 'student',
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at
    }));
    
    return c.json({ 
      success: true, 
      data: usersWithRoles 
    });
    
  } catch (error) {
    console.error("Get users error:", error);
    return c.json({ 
      success: false, 
      error: "Internal server error" 
    }, 500);
  }
});

// Update user role (admin only)
app.put("/make-server-2c1a01cc/user/:id/role", async (c) => {
  try {
    const userId = c.req.param('id');
    const { role } = await c.req.json();
    
    if (!['student', 'teacher', 'admin'].includes(role)) {
      return c.json({ 
        success: false, 
        error: "Invalid role. Must be 'student', 'teacher', or 'admin'" 
      }, 400);
    }
    
    // Get current user data first
    const { data: currentUser, error: getUserError } = await supabase.auth.admin.getUserById(userId);
    
    if (getUserError || !currentUser.user) {
      return c.json({ 
        success: false, 
        error: "User not found" 
      }, 404);
    }
    
    // Update user metadata with new role
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...currentUser.user.user_metadata,
        role: role
      }
    });
    
    if (error) {
      console.error("Update user role error:", error);
      return c.json({ success: false, error: error.message }, 400);
    }
    
    // Also update KV store if exists
    const kvUserData = await kv.get(`user:${userId}`);
    if (kvUserData) {
      const userData = JSON.parse(kvUserData);
      userData.role = role;
      await kv.set(`user:${userId}`, JSON.stringify(userData));
    }
    
    console.log(`User role updated: ${userId} -> ${role}`);
    
    return c.json({ 
      success: true, 
      message: "User role updated successfully",
      user: data.user 
    });
    
  } catch (error) {
    console.error("Update user role error:", error);
    return c.json({ 
      success: false, 
      error: "Internal server error" 
    }, 500);
  }
});

// Email Template Management

// Get all email templates
app.get("/make-server-2c1a01cc/email-templates", async (c) => {
  try {
    const templatesData = await kv.get("email_templates");
    const templates = templatesData ? JSON.parse(templatesData) : [];
    
    return c.json({ 
      success: true, 
      data: templates 
    });
    
  } catch (error) {
    console.error("Get email templates error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi lấy danh sách template" 
    }, 500);
  }
});

// Create email template
app.post("/make-server-2c1a01cc/email-template", async (c) => {
  try {
    const template = await c.req.json();
    const templateId = template.id || Date.now().toString();
    
    // Get existing templates
    const templatesData = await kv.get("email_templates");
    const templates = templatesData ? JSON.parse(templatesData) : [];
    
    // Add new template
    const newTemplate = {
      ...template,
      id: templateId,
      createdAt: template.createdAt || new Date().toISOString()
    };
    
    templates.push(newTemplate);
    await kv.set("email_templates", JSON.stringify(templates));
    
    console.log(`Email template created: ${newTemplate.name}`);
    
    return c.json({ 
      success: true, 
      data: newTemplate 
    });
    
  } catch (error) {
    console.error("Create email template error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi tạo template" 
    }, 500);
  }
});

// Update email template
app.put("/make-server-2c1a01cc/email-template/:id", async (c) => {
  try {
    const templateId = c.req.param('id');
    const updates = await c.req.json();
    
    const templatesData = await kv.get("email_templates");
    const templates = templatesData ? JSON.parse(templatesData) : [];
    
    const templateIndex = templates.findIndex(t => t.id === templateId);
    if (templateIndex === -1) {
      return c.json({ 
        success: false, 
        error: "Template không tồn tại" 
      }, 404);
    }
    
    templates[templateIndex] = { ...templates[templateIndex], ...updates };
    await kv.set("email_templates", JSON.stringify(templates));
    
    console.log(`Email template updated: ${templateId}`);
    
    return c.json({ 
      success: true, 
      data: templates[templateIndex] 
    });
    
  } catch (error) {
    console.error("Update email template error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi cập nhật template" 
    }, 500);
  }
});

// Delete email template
app.delete("/make-server-2c1a01cc/email-template/:id", async (c) => {
  try {
    const templateId = c.req.param('id');
    
    const templatesData = await kv.get("email_templates");
    const templates = templatesData ? JSON.parse(templatesData) : [];
    
    const filteredTemplates = templates.filter(t => t.id !== templateId);
    await kv.set("email_templates", JSON.stringify(filteredTemplates));
    
    console.log(`Email template deleted: ${templateId}`);
    
    return c.json({ 
      success: true, 
      message: "Template đã được xóa thành công" 
    });
    
  } catch (error) {
    console.error("Delete email template error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi xóa template" 
    }, 500);
  }
});

// Send bulk email using template
app.post("/make-server-2c1a01cc/send-bulk-email", async (c) => {
  try {
    const { templateId, recipients, variables } = await c.req.json();
    
    // Get template
    const templatesData = await kv.get("email_templates");
    const templates = templatesData ? JSON.parse(templatesData) : [];
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      return c.json({ 
        success: false, 
        error: "Template không tồn tại" 
      }, 404);
    }
    
    // Send emails to all recipients
    const emailResults = [];
    for (const recipient of recipients) {
      // Replace variables in template
      let subject = template.subject;
      let body = template.body;
      
      if (variables) {
        Object.keys(variables).forEach(key => {
          const value = variables[key];
          subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
          body = body.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });
      }
      
      // Log email sending
      const emailLog = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        to: recipient,
        subject,
        body,
        template: template.name,
        templateId,
        sentAt: new Date().toISOString(),
        status: 'sent'
      };
      
      emailResults.push(emailLog);
      
      // Save to email logs
      const existingLogs = await kv.get("email_logs");
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(emailLog);
      await kv.set("email_logs", JSON.stringify(logs));
    }
    
    console.log(`Bulk email sent: ${recipients.length} recipients using template ${template.name}`);
    
    return c.json({ 
      success: true, 
      message: `Đã gửi email đến ${recipients.length} người dùng`,
      data: emailResults
    });
    
  } catch (error) {
    console.error("Send bulk email error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi gửi email hàng loạt" 
    }, 500);
  }
});

// Get email logs
app.get("/make-server-2c1a01cc/email-logs", async (c) => {
  try {
    const logsData = await kv.get("email_logs");
    const logs = logsData ? JSON.parse(logsData) : [];
    
    // Sort by sentAt descending
    logs.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    
    return c.json({ 
      success: true, 
      data: logs 
    });
    
  } catch (error) {
    console.error("Get email logs error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi lấy email logs" 
    }, 500);
  }
});

// System Analytics endpoint
app.get("/make-server-2c1a01cc/analytics", async (c) => {
  try {
    // Get various data for analytics
    const [registrationsData, usersData, quizzesData] = await Promise.all([
      kv.get("all_registrations"),
      supabase.auth.admin.listUsers(),
      kv.get("all_quizzes")
    ]);
    
    const registrationIds = registrationsData ? JSON.parse(registrationsData) : [];
    const users = usersData.data?.users || [];
    const quizIds = quizzesData ? JSON.parse(quizzesData) : [];
    
    // Calculate analytics
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    // Get registration details
    const registrations = [];
    for (const id of registrationIds) {
      const regData = await kv.get(`registration:${id}`);
      if (regData) {
        registrations.push(JSON.parse(regData));
      }
    }
    
    const thisMonthRegistrations = registrations.filter(r => 
      new Date(r.createdAt) >= thisMonth
    );
    
    const lastMonthRegistrations = registrations.filter(r => 
      new Date(r.createdAt) >= lastMonth && new Date(r.createdAt) < thisMonth
    );
    
    const analytics = {
      registrations: {
        total: registrations.length,
        thisMonth: thisMonthRegistrations.length,
        lastMonth: lastMonthRegistrations.length,
        growth: lastMonthRegistrations.length > 0 
          ? ((thisMonthRegistrations.length - lastMonthRegistrations.length) / lastMonthRegistrations.length) * 100
          : 0
      },
      revenue: {
        total: registrations
          .filter(r => r.status === 'confirmed')
          .reduce((sum, r) => sum + parseInt(r.coursePrice.replace(/\./g, '')), 0),
        thisMonth: thisMonthRegistrations
          .filter(r => r.status === 'confirmed')
          .reduce((sum, r) => sum + parseInt(r.coursePrice.replace(/\./g, '')), 0),
        lastMonth: lastMonthRegistrations
          .filter(r => r.status === 'confirmed')
          .reduce((sum, r) => sum + parseInt(r.coursePrice.replace(/\./g, '')), 0)
      },
      users: {
        total: users.length,
        students: users.filter(u => u.user_metadata?.role === 'student' || !u.user_metadata?.role).length,
        teachers: users.filter(u => u.user_metadata?.role === 'teacher').length,
        admins: users.filter(u => u.user_metadata?.role === 'admin').length,
        newThisMonth: users.filter(u => new Date(u.created_at) >= thisMonth).length
      },
      courses: {
        total: quizIds.length,
        active: quizIds.length, // Mock - in real app you'd check status
        completion: 85 // Mock completion rate
      }
    };
    
    analytics.revenue.growth = analytics.revenue.lastMonth > 0
      ? ((analytics.revenue.thisMonth - analytics.revenue.lastMonth) / analytics.revenue.lastMonth) * 100
      : 0;
    
    return c.json({ 
      success: true, 
      data: analytics 
    });
    
  } catch (error) {
    console.error("Get analytics error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi lấy dữ liệu analytics" 
    }, 500);
  }
});

Deno.serve(app.fetch);
