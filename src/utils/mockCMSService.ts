// Mock CMS Service - Fallback when Edge Function is not available
import type { CMSPage, CMSMedia, CMSMenu, CMSSettings, CMSAnalytics } from '../contexts/CMSContext';

// Default data factories
const createDefaultSettings = (): CMSSettings => ({
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
});

const createDefaultPages = (): CMSPage[] => [
  {
    id: "home-page",
    title: "Trang Chủ",
    slug: "trang-chu",
    content: `<h1>Chào mừng đến với Trung tâm Tiếng Nhật Quang Dũng</h1>
<p>Học tiếng Nhật với đội ngũ giáo viên chuyên nghiệp, phương pháp giảng dạy hiện đại.</p>
<h2>Tại sao chọn Quang Dũng?</h2>
<ul>
<li>Giáo viên người Nhật bản ngữ</li>
<li>Chương trình học tập chuẩn quốc tế</li>
<li>Lớp học nhỏ, tương tác cao</li>
<li>Hỗ trợ thi cấp chứng chỉ JLPT</li>
</ul>`,
    excerpt: "Trung tâm tiếng Nhật hàng đầu với phương pháp giảng dạy hiện đại",
    status: "published",
    seoTitle: "Trung tâm Tiếng Nhật Quang Dũng - Học Tiếng Nhật Online",
    seoDescription: "Học tiếng Nhật với giáo viên chuyên nghiệp. Khóa học online, offline và luyện thi JLPT.",
    author: "admin@japancenter.demo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pageType: "page",
    categories: ["home"],
    tags: ["japanese", "language", "learning"]
  },
  {
    id: "about-page",
    title: "Giới Thiệu",
    slug: "gioi-thieu",
    content: `<h1>Về Trung tâm Tiếng Nhật Quang Dũng</h1>
<p>Với hơn 10 năm kinh nghiệm trong lĩnh vực giảng dạy tiếng Nhật, Quang Dũng Japanese Center đã đào tạo hàng nghìn học viên thành công.</p>
<h2>Sứ mệnh</h2>
<p>Mang đến chương trình học tiếng Nhật chất lượng cao, giúp học viên đạt được mục tiêu học tập và nghề nghiệp.</p>`,
    excerpt: "Tìm hiểu về lịch sử và sứ mệnh của Trung tâm Quang Dũng",
    status: "published",
    seoTitle: "Giới thiệu về Trung tâm Tiếng Nhật Quang Dũng",
    seoDescription: "Tìm hiểu về lịch sử, sứ mệnh và đội ngũ giảng viên của Trung tâm Tiếng Nhật Quang Dũng.",
    author: "admin@japancenter.demo",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    pageType: "page",
    categories: ["about"],
    tags: ["about", "history"]
  }
];

const createDefaultMedia = (): CMSMedia[] => [
  {
    id: "media-1",
    filename: "Quang Dũng-logo.jpg",
    originalName: "Quang Dũng-logo.jpg",
    url: "https://picsum.photos/800/400?random=1",
    type: "image",
    size: 245000,
    uploadedBy: "admin@japancenter.demo",
    uploadedAt: new Date().toISOString(),
    alt: "Logo Trung tâm Quang Dũng",
    caption: "Logo chính thức của Trung tâm Tiếng Nhật Quang Dũng"
  },
  {
    id: "media-2",
    filename: "classroom.jpg",
    originalName: "classroom.jpg",
    url: "https://picsum.photos/800/600?random=2",
    type: "image",
    size: 567000,
    uploadedBy: "admin@japancenter.demo",
    uploadedAt: new Date(Date.now() - 3600000).toISOString(),
    alt: "Phòng học hiện đại",
    caption: "Phòng học với trang thiết bị hiện đại"
  }
];

const createDefaultMenus = (): CMSMenu[] => [
  {
    id: "header-menu",
    name: "Menu Chính",
    location: "header",
    items: [
      {
        id: "1",
        label: "Trang Chủ",
        url: "/",
        type: "page",
        order: 1
      },
      {
        id: "2",
        label: "Khóa Học",
        url: "/courses",
        type: "page",
        order: 2
      },
      {
        id: "3",
        label: "Giới Thiệu",
        url: "/about",
        type: "page",
        order: 3
      },
      {
        id: "4",
        label: "Liên Hệ",
        url: "/contact",
        type: "page",
        order: 4
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const createDefaultAnalytics = (): CMSAnalytics => ({
  pageViews: {
    "home-page": 1250,
    "about-page": 867
  },
  popularPages: [
    {
      pageId: "home-page",
      title: "Trang Chủ",
      views: 1250
    },
    {
      pageId: "about-page",
      title: "Giới Thiệu",
      views: 867
    }
  ],
  recentActivity: [
    {
      id: "1",
      action: "Tạo trang mới",
      target: "Trang Chủ",
      user: "admin@japancenter.demo",
      timestamp: new Date().toISOString()
    },
    {
      id: "2",
      action: "Cập nhật nội dung",
      target: "Giới Thiệu",
      user: "admin@japancenter.demo",
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  totalPages: 2,
  totalPosts: 0,
  totalMedia: 2
});

// Storage helpers
const STORAGE_KEYS = {
  pages: 'cms_pages',
  media: 'cms_media',
  menus: 'cms_menus',
  settings: 'cms_settings',
  analytics: 'cms_analytics'
};

const getFromStorage = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setToStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silent fail
  }
};

const initializeStorage = () => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(STORAGE_KEYS.settings)) {
    setToStorage(STORAGE_KEYS.settings, createDefaultSettings());
  }
  if (!localStorage.getItem(STORAGE_KEYS.pages)) {
    setToStorage(STORAGE_KEYS.pages, createDefaultPages());
  }
  if (!localStorage.getItem(STORAGE_KEYS.media)) {
    setToStorage(STORAGE_KEYS.media, createDefaultMedia());
  }
  if (!localStorage.getItem(STORAGE_KEYS.menus)) {
    setToStorage(STORAGE_KEYS.menus, createDefaultMenus());
  }
  if (!localStorage.getItem(STORAGE_KEYS.analytics)) {
    setToStorage(STORAGE_KEYS.analytics, createDefaultAnalytics());
  }
};

export const mockCMSService = {
  // Pages
  async getPages(): Promise<{ success: boolean; data: CMSPage[] }> {
    initializeStorage();
    await new Promise(resolve => setTimeout(resolve, 300));
    const pages = getFromStorage(STORAGE_KEYS.pages, createDefaultPages());
    return { success: true, data: pages };
  },

  async createPage(page: Omit<CMSPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; data: CMSPage }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const pages = getFromStorage(STORAGE_KEYS.pages, []);
    const newPage: CMSPage = {
      ...page,
      id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    pages.push(newPage);
    setToStorage(STORAGE_KEYS.pages, pages);
    return { success: true, data: newPage };
  },

  async updatePage(id: string, updates: Partial<CMSPage>): Promise<{ success: boolean; data: CMSPage }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const pages = getFromStorage(STORAGE_KEYS.pages, []);
    const pageIndex = pages.findIndex((p: CMSPage) => p.id === id);
    
    if (pageIndex === -1) {
      throw new Error('Page not found');
    }
    
    pages[pageIndex] = {
      ...pages[pageIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    setToStorage(STORAGE_KEYS.pages, pages);
    return { success: true, data: pages[pageIndex] };
  },

  async deletePage(id: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const pages = getFromStorage(STORAGE_KEYS.pages, []);
    const filteredPages = pages.filter((p: CMSPage) => p.id !== id);
    setToStorage(STORAGE_KEYS.pages, filteredPages);
    return { success: true, message: 'Page deleted successfully' };
  },

  // Media
  async getMedia(): Promise<{ success: boolean; data: CMSMedia[] }> {
    initializeStorage();
    await new Promise(resolve => setTimeout(resolve, 200));
    const media = getFromStorage(STORAGE_KEYS.media, createDefaultMedia());
    return { success: true, data: media };
  },

  async uploadMedia(file: File): Promise<{ success: boolean; data: CMSMedia }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const media = getFromStorage(STORAGE_KEYS.media, []);
    const newMedia: CMSMedia = {
      id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      filename: `${Date.now()}-${file.name}`,
      originalName: file.name,
      url: `https://picsum.photos/800/600?random=${Date.now()}`,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      size: file.size,
      uploadedBy: "admin@japancenter.demo",
      uploadedAt: new Date().toISOString(),
      alt: "",
      caption: ""
    };
    media.push(newMedia);
    setToStorage(STORAGE_KEYS.media, media);
    return { success: true, data: newMedia };
  },

  async deleteMedia(id: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const media = getFromStorage(STORAGE_KEYS.media, []);
    const filteredMedia = media.filter((m: CMSMedia) => m.id !== id);
    setToStorage(STORAGE_KEYS.media, filteredMedia);
    return { success: true, message: 'Media deleted successfully' };
  },

  // Menus
  async getMenus(): Promise<{ success: boolean; data: CMSMenu[] }> {
    initializeStorage();
    await new Promise(resolve => setTimeout(resolve, 150));
    const menus = getFromStorage(STORAGE_KEYS.menus, createDefaultMenus());
    return { success: true, data: menus };
  },

  async createMenu(menu: Omit<CMSMenu, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; data: CMSMenu }> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const menus = getFromStorage(STORAGE_KEYS.menus, []);
    const newMenu: CMSMenu = {
      ...menu,
      id: `menu-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    menus.push(newMenu);
    setToStorage(STORAGE_KEYS.menus, menus);
    return { success: true, data: newMenu };
  },

  async updateMenu(id: string, updates: Partial<CMSMenu>): Promise<{ success: boolean; data: CMSMenu }> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const menus = getFromStorage(STORAGE_KEYS.menus, []);
    const menuIndex = menus.findIndex((m: CMSMenu) => m.id === id);
    
    if (menuIndex === -1) {
      throw new Error('Menu not found');
    }
    
    menus[menuIndex] = {
      ...menus[menuIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    setToStorage(STORAGE_KEYS.menus, menus);
    return { success: true, data: menus[menuIndex] };
  },

  async deleteMenu(id: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const menus = getFromStorage(STORAGE_KEYS.menus, []);
    const filteredMenus = menus.filter((m: CMSMenu) => m.id !== id);
    setToStorage(STORAGE_KEYS.menus, filteredMenus);
    return { success: true, message: 'Menu deleted successfully' };
  },

  // Settings
  async getSettings(): Promise<{ success: boolean; data: CMSSettings }> {
    initializeStorage();
    await new Promise(resolve => setTimeout(resolve, 100));
    const settings = getFromStorage(STORAGE_KEYS.settings, createDefaultSettings());
    return { success: true, data: settings };
  },

  async updateSettings(updates: Partial<CMSSettings>): Promise<{ success: boolean; data: CMSSettings }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const currentSettings = getFromStorage(STORAGE_KEYS.settings, createDefaultSettings());
    const updatedSettings = { ...currentSettings, ...updates };
    setToStorage(STORAGE_KEYS.settings, updatedSettings);
    return { success: true, data: updatedSettings };
  },

  // Analytics
  async getAnalytics(): Promise<{ success: boolean; data: CMSAnalytics }> {
    initializeStorage();
    await new Promise(resolve => setTimeout(resolve, 100));
    const analytics = getFromStorage(STORAGE_KEYS.analytics, createDefaultAnalytics());
    return { success: true, data: analytics };
  }
};

export default mockCMSService;
