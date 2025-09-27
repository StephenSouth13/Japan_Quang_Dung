import { useState } from 'react';
import { CoursesSection } from '../components/CoursesSection';
import { ContactSection } from '../components/ContactSection';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Filter, BookOpen, Clock, Users, Star } from 'lucide-react';

export function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const courseStats = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "20+ Khóa học",
      description: "Đa dạng các cấp độ"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "2000+ Học viên",
      description: "Đã tham gia học tập"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "4.9/5 Đánh giá",
      description: "Từ học viên"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Linh hoạt",
      description: "Thời gian học tập"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="py-20 bg-gradient-to-br from-primary via-pink-600 to-red-600 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+CiAgPC9nPgo8L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
            Khóa học chất lượng cao
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Khóa Học Tiếng Nhật
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Khám phá các khóa học tiếng Nhật phù hợp với mọi trình độ, 
            từ cơ bán đến nâng cao với phương pháp giảng dạy hiện đại
          </p>
          
          {/* Course Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {courseStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-2xl flex items-center justify-center">
                  {stat.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{stat.title}</h3>
                <p className="text-white/80 text-sm">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-gradient-to-br from-slate-50 to-red-50/30 dark:from-background dark:to-background">
        <div className="container mx-auto px-4">
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Tìm kiếm khóa học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-full md:w-48 h-12">
                    <SelectValue placeholder="Chọn cấp độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả cấp độ</SelectItem>
                    <SelectItem value="N5">N5 - Cơ bản</SelectItem>
                    <SelectItem value="N4">N4 - Sơ cấp</SelectItem>
                    <SelectItem value="N3">N3 - Trung cấp</SelectItem>
                    <SelectItem value="N2">N2 - Trung cao cấp</SelectItem>
                    <SelectItem value="N1">N1 - Cao cấp</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-48 h-12">
                    <SelectValue placeholder="Loại khóa học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="regular">Thường quy</SelectItem>
                    <SelectItem value="intensive">Cấp tốc</SelectItem>
                    <SelectItem value="conversation">Giao tiếp</SelectItem>
                    <SelectItem value="business">Thương mại</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="lg" className="w-full md:w-auto h-12 px-8">
                  <Filter className="w-5 h-5 mr-2" />
                  Lọc
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Courses Content */}
      <CoursesSection />
      
      {/* Learning Path */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-pink-50/30 dark:from-background dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Lộ trình học tập</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Chọn Lộ Trình Phù Hợp
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Các lộ trình được thiết kế khoa học giúp bạn đạt mục tiêu nhanh chóng
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Lộ trình Cơ bản</h3>
                <p className="text-muted-foreground mb-6">
                  Dành cho người mới bắt đầu, từ N5 đến N4 trong 12 tháng
                </p>
                <Button variant="outline" className="w-full">
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm ring-2 ring-primary">
              <CardContent className="p-8">
                <Badge className="mb-4 bg-primary">Phổ biến nhất</Badge>
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-pink-600/20 rounded-3xl flex items-center justify-center">
                  <Star className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Lộ trình Toàn diện</h3>
                <p className="text-muted-foreground mb-6">
                  Từ N5 đến N2, bao gồm kỹ năng giao tiếp thực tế trong 24 tháng
                </p>
                <Button className="w-full">
                  Đăng ký ngay
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-3xl flex items-center justify-center">
                  <Users className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Lộ trình Chuyên sâu</h3>
                <p className="text-muted-foreground mb-6">
                  Đạt N1, chuẩn bị du học và làm việc tại Nhật trong 36 tháng
                </p>
                <Button variant="outline" className="w-full">
                  Tư vấn riêng
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary via-pink-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bắt Đầu Hành Trình Học Tiếng Nhật
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Không biết chọn khóa học nào phù hợp? Liên hệ với chúng tôi để được tư vấn miễn phí!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-4">
              Đăng ký học thử miễn phí
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 px-8 py-4">
              Nhận tư vấn miễn phí
            </Button>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
