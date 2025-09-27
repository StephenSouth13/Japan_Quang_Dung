import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

const app = new Hono();

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

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ===== CMS PAGES MANAGEMENT =====

// Get all pages
app.get("/cms/pages", async (c) => {
  try {
    // Mock data for now
    const pages = [
      {
        id: "1",
        title: "Home Page",
        slug: "home",
        content: "<h1>Welcome to Quang Dũng Japanese Center</h1>",
        status: "published",
        seoTitle: "Quang Dũng Japanese Center - Learn Japanese Online",
        seoDescription: "Learn Japanese with our expert teachers",
        author: "admin@japancenter.demo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pageType: "page"
      }
    ];
    
    return c.json({ 
      success: true, 
      data: pages
    });
    
  } catch (error) {
    console.error("Get CMS pages error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi lấy danh sách trang" 
    }, 500);
  }
});

// Create new page
app.post("/cms/pages", async (c) => {
  try {
    const page = await c.req.json();
    const pageId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const newPage = {
      ...page,
      id: pageId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log(`CMS page created: ${newPage.title} (${pageId})`);
    
    return c.json({ 
      success: true, 
      data: newPage 
    });
    
  } catch (error) {
    console.error("Create CMS page error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi tạo trang" 
    }, 500);
  }
});

// ===== CMS MEDIA MANAGEMENT =====

// Get all media
app.get("/cms/media", async (c) => {
  try {
    // Mock data for now
    const media = [
      {
        id: "media1",
        filename: "sample-image.jpg",
        originalName: "sample-image.jpg",
        url: "https://picsum.photos/800/600?random=1",
        type: "image",
        size: 450000,
        uploadedBy: "admin@japancenter.demo",
        uploadedAt: new Date().toISOString(),
        alt: "Sample image",
        caption: "Sample media file"
      }
    ];
    
    return c.json({ 
      success: true, 
      data: media
    });
    
  } catch (error) {
    console.error("Get CMS media error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi lấy danh sách media" 
    }, 500);
  }
});

// Upload media (mock implementation)
app.post("/cms/media/upload", async (c) => {
  try {
    const mediaId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const mockMedia = {
      id: mediaId,
      filename: `file_${mediaId}`,
      originalName: "uploaded_file.jpg",
      url: `https://picsum.photos/800/600?random=${mediaId}`,
      type: "image",
      size: Math.floor(Math.random() * 1000000) + 100000,
      uploadedBy: "admin@japancenter.demo",
      uploadedAt: new Date().toISOString(),
      alt: "",
      caption: ""
    };
    
    console.log(`CMS media uploaded: ${mockMedia.filename}`);
    
    return c.json({ 
      success: true, 
      data: mockMedia 
    });
    
  } catch (error) {
    console.error("Upload CMS media error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi upload file" 
    }, 500);
  }
});

// ===== CMS MENU MANAGEMENT =====

// Get all menus
app.get("/cms/menus", async (c) => {
  try {
    // Mock data for now
    const menus = [
      {
        id: "header-menu",
        name: "Header Menu",
        location: "header",
        items: [
          {
            id: "1",
            label: "Home",
            url: "/",
            type: "page",
            order: 1
          },
          {
            id: "2", 
            label: "Courses",
            url: "/courses",
            type: "page",
            order: 2
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    return c.json({ 
      success: true, 
      data: menus 
    });
    
  } catch (error) {
    console.error("Get CMS menus error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi lấy danh sách menu" 
    }, 500);
  }
});

// ===== CMS SETTINGS MANAGEMENT =====

// Get site settings
app.get("/cms/settings", async (c) => {
  try {
    const settings = {
      siteName: "Quang Dũng Japanese Center",
      siteDescription: "Learn Japanese with expert teachers",
      siteUrl: "https://Quang Dũng-center.vn",
      contactEmail: "info@Quang Dũng-center.vn",
      contactPhone: "(028) 3825 1234",
      contactAddress: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
      socialLinks: {
        facebook: "",
        youtube: "",
        instagram: "",
        twitter: ""
      },
      seoSettings: {
        defaultTitle: "Quang Dũng Japanese Center - Learn Japanese Online",
        defaultDescription: "Learn Japanese with our expert teachers. Online courses, tests, and more.",
        keywords: ["japanese", "learn", "language", "course"],
        googleAnalytics: "",
        googleTagManager: ""
      },
      emailSettings: {
        fromName: "Quang Dũng Japanese Center",
        fromEmail: "noreply@Quang Dũng-center.vn",
        replyTo: "support@Quang Dũng-center.vn"
      },
      themeSettings: {
        primaryColor: "#dc2626",
        secondaryColor: "#fef2f2",
        accentColor: "#fee2e2",
        fontFamily: "Inter"
      }
    };
    
    return c.json({ 
      success: true, 
      data: settings 
    });
    
  } catch (error) {
    console.error("Get CMS settings error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi lấy cài đặt" 
    }, 500);
  }
});

// Update site settings
app.put("/cms/settings", async (c) => {
  try {
    const updates = await c.req.json();
    
    console.log("CMS settings updated", updates);
    
    return c.json({ 
      success: true, 
      message: "Settings updated successfully"
    });
    
  } catch (error) {
    console.error("Update CMS settings error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi cập nhật cài đặt" 
    }, 500);
  }
});

// ===== CMS ANALYTICS =====

// Get CMS analytics
app.get("/cms/analytics", async (c) => {
  try {
    const analytics = {
      pageViews: {},
      popularPages: [
        {
          pageId: "1",
          title: "Home Page",
          views: 1250
        }
      ],
      recentActivity: [
        {
          id: "1",
          action: "Page Created",
          target: "Home Page",
          user: "admin@japancenter.demo",
          timestamp: new Date().toISOString()
        }
      ],
      totalPages: 1,
      totalPosts: 0,
      totalMedia: 1
    };
    
    return c.json({ 
      success: true, 
      data: analytics 
    });
    
  } catch (error) {
    console.error("Get CMS analytics error:", error);
    return c.json({ 
      success: false, 
      error: "Có lỗi xảy ra khi lấy analytics" 
    }, 500);
  }
});

// Catch-all handler for 404s
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Endpoint not found'
  }, 404);
});

console.log('🎨 CMS server initialized');

Deno.serve(app.fetch);
