import React, { useState, createContext, useContext } from 'react';

type Route = 'home' | 'about' | 'courses' | 'contact' | 'cms';

interface RouterContextType {
  currentRoute: Route;
  navigate: (route: Route) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function SimpleRouter({ children }: { children: React.ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    // Update URL without page reload
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/${route === 'home' ? '' : route}`);
    }
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within SimpleRouter');
  }
  return context;
}

// Simple Navigation Component
export function SimpleNavigation() {
  const { currentRoute, navigate } = useRouter();

  const navItems: { route: Route; label: string }[] = [
    { route: 'home', label: 'Trang chủ' },
    { route: 'about', label: 'Giới thiệu' },
    { route: 'courses', label: 'Khóa học' },
    { route: 'contact', label: 'Liên hệ' },
    { route: 'cms', label: 'CMS' },
  ];

  return (
    <nav className="hidden md:flex gap-2">
      {navItems.map(({ route, label }) => (
        <button
          key={route}
          onClick={() => navigate(route)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
            currentRoute === route
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

// Import simplified components for homepage
import { SimpleHeroSection } from './SimpleHeroSection';
import { SimpleFeaturesSection } from './SimpleFeaturesSection';
import { SimpleCoursesSection } from './SimpleCoursesSection';

// Simple Page Components
export function HomePage() {
  return (
    <div className="space-y-0">
      <SimpleHeroSection />
      <SimpleFeaturesSection />
      <SimpleCoursesSection />
    </div>
  );
}

export function AboutPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
      <div className="prose max-w-none">
        <p className="mb-4">
          Trung tâm Tiếng Nhật Quang Dũng là một trong những trung tâm hàng đầu tại Việt Nam 
          trong việc giảng dạy tiếng Nhật với chất lượng cao.
        </p>
        <p className="mb-4">
          Với đội ngũ giáo viên bản ngữ có kinh nghiệm và phương pháp giảng dạy hiện đại, 
          chúng tôi cam kết mang đến cho học viên trải nghiệm học tập tốt nhất.
        </p>
      </div>
    </div>
  );
}

export function CoursesPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Khóa học</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-card rounded-lg border border-border">
          <h3 className="text-xl font-semibold mb-2">Khóa học N5</h3>
          <p className="text-muted-foreground mb-4">
            Dành cho người mới bắt đầu học tiếng Nhật
          </p>
          <div className="text-sm text-muted-foreground">
            <p>• Thời gian: 3 tháng</p>
            <p>• Buổi/tuần: 3 buổi</p>
            <p>• Học phí: 2.500.000 VNĐ</p>
          </div>
        </div>
        
        <div className="p-6 bg-card rounded-lg border border-border">
          <h3 className="text-xl font-semibold mb-2">Khóa học N4</h3>
          <p className="text-muted-foreground mb-4">
            Nâng cao kỹ năng tiếng Nhật cơ bản
          </p>
          <div className="text-sm text-muted-foreground">
            <p>• Thời gian: 4 tháng</p>
            <p>• Buổi/tuần: 3 buổi</p>
            <p>• Học phí: 3.200.000 VNĐ</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Liên hệ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Thông tin liên hệ</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Địa chỉ:</strong> 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
            <p><strong>Điện thoại:</strong> (028) 3825 1234</p>
            <p><strong>Email:</strong> info@Quang Dũng-center.vn</p>
            <p><strong>Website:</strong> https://Quang Dũng-center.vn</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Giờ làm việc</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Thứ 2 - Thứ 6:</strong> 8:00 - 20:00</p>
            <p><strong>Thứ 7:</strong> 8:00 - 17:00</p>
            <p><strong>Chủ nhật:</strong> 9:00 - 16:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CMSPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Content Management System</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-2">Pages Management</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Quản lý các trang nội dung
          </p>
          <div className="text-sm">
            <p>• Tạo/sửa/xóa trang</p>
            <p>• SEO optimization</p>
            <p>• Preview mode</p>
          </div>
        </div>
        
        <div className="p-6 bg-card rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-2">Media Library</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Quản lý hình ảnh và tài liệu
          </p>
          <div className="text-sm">
            <p>• Upload files</p>
            <p>• Organize media</p>
            <p>• Image optimization</p>
          </div>
        </div>
        
        <div className="p-6 bg-card rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-2">Analytics</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Thống kê và báo cáo
          </p>
          <div className="text-sm">
            <p>• Page views</p>
            <p>• User engagement</p>
            <p>• Content performance</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Trạng thái:</strong> CMS đang hoạt động ở chế độ offline với localStorage. 
          Tất cả dữ liệu được lưu cục bộ và sẽ được đồng bộ khi kết nối server.
        </p>
      </div>
    </div>
  );
}

// Main Content Router
export function RouterContent() {
  const { currentRoute } = useRouter();

  switch (currentRoute) {
    case 'home':
      return <HomePage />;
    case 'about':
      return <AboutPage />;
    case 'courses':
      return <CoursesPage />;
    case 'contact':
      return <ContactPage />;
    case 'cms':
      return <CMSPage />;
    default:
      return <HomePage />;
  }
}
