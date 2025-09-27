// CMS Management Endpoints
import * as kv from "./kv_store.tsx";

export function setupCMSEndpoints(app: any) {
  // ===== CMS PAGES MANAGEMENT =====

  // Get all pages
  app.get("/make-server-2c1a01cc/cms/pages", async (c: any) => {
    try {
      const allPagesData = await kv.get("cms_pages");
      const pages = allPagesData ? JSON.parse(allPagesData) : [];
      
      return c.json({ 
        success: true, 
        data: pages.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
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
  app.post("/make-server-2c1a01cc/cms/pages", async (c: any) => {
    try {
      const page = await c.req.json();
      const pageId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      const newPage = {
        ...page,
        id: pageId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Get existing pages
      const allPagesData = await kv.get("cms_pages");
      const pages = allPagesData ? JSON.parse(allPagesData) : [];
      
      // Add new page
      pages.push(newPage);
      await kv.set("cms_pages", JSON.stringify(pages));
      
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

  // Update page
  app.put("/make-server-2c1a01cc/cms/pages/:id", async (c: any) => {
    try {
      const pageId = c.req.param('id');
      const updates = await c.req.json();
      
      const allPagesData = await kv.get("cms_pages");
      const pages = allPagesData ? JSON.parse(allPagesData) : [];
      
      const pageIndex = pages.findIndex((p: any) => p.id === pageId);
      if (pageIndex === -1) {
        return c.json({ 
          success: false, 
          error: "Trang không tồn tại" 
        }, 404);
      }
      
      pages[pageIndex] = { 
        ...pages[pageIndex], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      await kv.set("cms_pages", JSON.stringify(pages));
      
      console.log(`CMS page updated: ${pageId}`);
      
      return c.json({ 
        success: true, 
        data: pages[pageIndex] 
      });
      
    } catch (error) {
      console.error("Update CMS page error:", error);
      return c.json({ 
        success: false, 
        error: "Có lỗi xảy ra khi cập nhật trang" 
      }, 500);
    }
  });

  // Delete page
  app.delete("/make-server-2c1a01cc/cms/pages/:id", async (c: any) => {
    try {
      const pageId = c.req.param('id');
      
      const allPagesData = await kv.get("cms_pages");
      const pages = allPagesData ? JSON.parse(allPagesData) : [];
      
      const filteredPages = pages.filter((p: any) => p.id !== pageId);
      await kv.set("cms_pages", JSON.stringify(filteredPages));
      
      console.log(`CMS page deleted: ${pageId}`);
      
      return c.json({ 
        success: true, 
        message: "Trang đã được xóa thành công" 
      });
      
    } catch (error) {
      console.error("Delete CMS page error:", error);
      return c.json({ 
        success: false, 
        error: "Có lỗi xảy ra khi xóa trang" 
      }, 500);
    }
  });

  // ===== CMS MEDIA MANAGEMENT =====

  // Get all media
  app.get("/make-server-2c1a01cc/cms/media", async (c: any) => {
    try {
      const allMediaData = await kv.get("cms_media");
      const media = allMediaData ? JSON.parse(allMediaData) : [];
      
      return c.json({ 
        success: true, 
        data: media.sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
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
  app.post("/make-server-2c1a01cc/cms/media/upload", async (c: any) => {
    try {
      // In a real implementation, you would:
      // 1. Extract the file from FormData
      // 2. Upload to cloud storage (S3, Cloudinary, etc.)
      // 3. Get the URL and metadata
      
      // Mock implementation
      const mediaId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const mockMedia = {
        id: mediaId,
        filename: `file_${mediaId}`,
        originalName: "uploaded_file.jpg",
        url: `https://picsum.photos/800/600?random=${mediaId}`,
        type: "image",
        size: Math.floor(Math.random() * 1000000) + 100000, // Random size
        uploadedBy: "admin@japancenter.demo",
        uploadedAt: new Date().toISOString(),
        alt: "",
        caption: ""
      };
      
      // Get existing media
      const allMediaData = await kv.get("cms_media");
      const media = allMediaData ? JSON.parse(allMediaData) : [];
      
      // Add new media
      media.push(mockMedia);
      await kv.set("cms_media", JSON.stringify(media));
      
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

  // Delete media
  app.delete("/make-server-2c1a01cc/cms/media/:id", async (c: any) => {
    try {
      const mediaId = c.req.param('id');
      
      const allMediaData = await kv.get("cms_media");
      const media = allMediaData ? JSON.parse(allMediaData) : [];
      
      const filteredMedia = media.filter((m: any) => m.id !== mediaId);
      await kv.set("cms_media", JSON.stringify(filteredMedia));
      
      console.log(`CMS media deleted: ${mediaId}`);
      
      return c.json({ 
        success: true, 
        message: "Media đã được xóa thành công" 
      });
      
    } catch (error) {
      console.error("Delete CMS media error:", error);
      return c.json({ 
        success: false, 
        error: "Có lỗi xảy ra khi xóa media" 
      }, 500);
    }
  });

  // ===== CMS MENU MANAGEMENT =====

  // Get all menus
  app.get("/make-server-2c1a01cc/cms/menus", async (c: any) => {
    try {
      const allMenusData = await kv.get("cms_menus");
      const menus = allMenusData ? JSON.parse(allMenusData) : [];
      
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

  // Create menu
  app.post("/make-server-2c1a01cc/cms/menus", async (c: any) => {
    try {
      const menu = await c.req.json();
      const menuId = Date.now().toString();
      
      const newMenu = {
        ...menu,
        id: menuId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const allMenusData = await kv.get("cms_menus");
      const menus = allMenusData ? JSON.parse(allMenusData) : [];
      
      menus.push(newMenu);
      await kv.set("cms_menus", JSON.stringify(menus));
      
      console.log(`CMS menu created: ${newMenu.name}`);
      
      return c.json({ 
        success: true, 
        data: newMenu 
      });
      
    } catch (error) {
      console.error("Create CMS menu error:", error);
      return c.json({ 
        success: false, 
        error: "Có lỗi xảy ra khi tạo menu" 
      }, 500);
    }
  });

  // Update menu
  app.put("/make-server-2c1a01cc/cms/menus/:id", async (c: any) => {
    try {
      const menuId = c.req.param('id');
      const updates = await c.req.json();
      
      const allMenusData = await kv.get("cms_menus");
      const menus = allMenusData ? JSON.parse(allMenusData) : [];
      
      const menuIndex = menus.findIndex((m: any) => m.id === menuId);
      if (menuIndex === -1) {
        return c.json({ 
          success: false, 
          error: "Menu không tồn tại" 
        }, 404);
      }
      
      menus[menuIndex] = { 
        ...menus[menuIndex], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      await kv.set("cms_menus", JSON.stringify(menus));
      
      console.log(`CMS menu updated: ${menuId}`);
      
      return c.json({ 
        success: true, 
        data: menus[menuIndex] 
      });
      
    } catch (error) {
      console.error("Update CMS menu error:", error);
      return c.json({ 
        success: false, 
        error: "Có lỗi xảy ra khi cập nhật menu" 
      }, 500);
    }
  });

  // Delete menu
  app.delete("/make-server-2c1a01cc/cms/menus/:id", async (c: any) => {
    try {
      const menuId = c.req.param('id');
      
      const allMenusData = await kv.get("cms_menus");
      const menus = allMenusData ? JSON.parse(allMenusData) : [];
      
      const filteredMenus = menus.filter((m: any) => m.id !== menuId);
      await kv.set("cms_menus", JSON.stringify(filteredMenus));
      
      console.log(`CMS menu deleted: ${menuId}`);
      
      return c.json({ 
        success: true, 
        message: "Menu đã được xóa thành công" 
      });
      
    } catch (error) {
      console.error("Delete CMS menu error:", error);
      return c.json({ 
        success: false, 
        error: "Có lỗi xảy ra khi xóa menu" 
      }, 500);
    }
  });

  // ===== CMS SETTINGS MANAGEMENT =====

  // Get site settings
  app.get("/make-server-2c1a01cc/cms/settings", async (c: any) => {
    try {
      const settingsData = await kv.get("cms_settings");
      const settings = settingsData ? JSON.parse(settingsData) : {
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
  app.put("/make-server-2c1a01cc/cms/settings", async (c: any) => {
    try {
      const updates = await c.req.json();
      
      const settingsData = await kv.get("cms_settings");
      const currentSettings = settingsData ? JSON.parse(settingsData) : {};
      
      const updatedSettings = { ...currentSettings, ...updates };
      await kv.set("cms_settings", JSON.stringify(updatedSettings));
      
      console.log("CMS settings updated");
      
      return c.json({ 
        success: true, 
        data: updatedSettings 
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
  app.get("/make-server-2c1a01cc/cms/analytics", async (c: any) => {
    try {
      const analyticsData = await kv.get("cms_analytics");
      const analytics = analyticsData ? JSON.parse(analyticsData) : {
        pageViews: {},
        popularPages: [],
        recentActivity: [],
        totalPages: 0,
        totalPosts: 0,
        totalMedia: 0
      };
      
      // Update stats from current data
      const pagesData = await kv.get("cms_pages");
      const pages = pagesData ? JSON.parse(pagesData) : [];
      const mediaData = await kv.get("cms_media");
      const media = mediaData ? JSON.parse(mediaData) : [];
      
      analytics.totalPages = pages.filter((p: any) => p.pageType === 'page').length;
      analytics.totalPosts = pages.filter((p: any) => p.pageType === 'post').length;
      analytics.totalMedia = media.length;
      
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

  console.log('🎨 CMS endpoints initialized');
}
