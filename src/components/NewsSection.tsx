import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, ArrowRight, Users, Trophy, BookOpen } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const news = [
  {
    id: 1,
    title: "Khai giảng khóa học N5 tháng 12/2024",
    category: "Khóa học",
    date: "2024-11-15",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc3Jvb20lMjBqYXBhbmVzZXxlbnwxfHx8fDE3NTc3NTM5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    summary: "Đăng ký sớm để được ưu đãi 20% học phí và nhận bộ giáo trình miễn phí. Lớp học nhỏ, chỉ 15 học viên.",
    isHighlight: true
  },
  {
    id: 2,
    title: "Chúc mừng 50 học viên đậu JLPT N3 kỳ thi 12/2024",
    category: "Thành tích",
    date: "2024-11-10",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3VjY2Vzc3xlbnwxfHx8fDE3NTc3NTM5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    summary: "Tỷ lệ đậu JLPT N3 của trung tâm đạt 96%, cao nhất từ trước đến nay. Chúc mừng các em học viên!",
    isHighlight: false
  },
  {
    id: 3,
    title: "Workshop văn hóa Nhật Bản: Lễ hội mùa đông",
    category: "Sự kiện",
    date: "2024-12-20",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGZlc3RpdmFsfGVufDF8fHx8MTc1Nzc1Mzk3MXww&ixlib=rb-4.1.0&q=80&w=1080",
    summary: "Cùng tìm hiểu về các lễ hội truyền thống mùa đông của Nhật Bản và thực hành làm Origami.",
    isHighlight: false
  },
  {
    id: 4,
    title: "Hội thảo định hướng du học Nhật Bản 2025",
    category: "Du học",
    date: "2024-12-15",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkeSUyMGFicm9hZHxlbnwxfHx8fDE3NTc3NTM5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    summary: "Gặp gỡ đại diện các trường đại học Nhật Bản và được tư vấn miễn phí về hồ sơ du học.",
    isHighlight: false
  }
];

const upcomingEvents = [
  {
    title: "Lớp học thử miễn phí N5",
    date: "2024-11-25",
    time: "19:00 - 20:30",
    type: "Miễn phí"
  },
  {
    title: "Thi thử JLPT N3",
    date: "2024-11-30", 
    time: "14:00 - 17:00",
    type: "Có phí"
  },
  {
    title: "Giao lưu với du học sinh Nhật Bản",
    date: "2024-12-05",
    time: "18:00 - 20:00", 
    type: "Miễn phí"
  }
];

export function NewsSection() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Khóa học":
        return <BookOpen className="w-4 h-4" />;
      case "Thành tích":
        return <Trophy className="w-4 h-4" />;
      case "Sự kiện":
        return <Users className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Khóa học":
        return "bg-blue-500";
      case "Thành tích":
        return "bg-green-500";
      case "Sự kiện":
        return "bg-purple-500";
      case "Du học":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <section id="news" className="py-20 bg-gradient-to-br from-slate-50 via-background to-pink-50/30 dark:from-background dark:via-background dark:to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Tin tức & Sự kiện</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Cập nhật mới nhất từ Quang Dũng
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Theo dõi các tin tức, sự kiện và thành tích mới nhất của trung tâm và học viên
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main News */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map((item) => (
                <Card key={item.id} className={`overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm group ${item.isHighlight ? 'ring-2 ring-primary shadow-lg' : ''}`}>
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <Badge 
                      className={`absolute top-3 left-3 ${getCategoryColor(item.category)} text-white`}
                    >
                      <span className="flex items-center gap-1">
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </span>
                    </Badge>
                    {item.isHighlight && (
                      <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                        Nổi bật
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(item.date)}
                      </div>
                      
                      <h3 className="text-lg font-bold text-foreground line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {item.summary}
                      </p>
                      
                      <Button variant="ghost" size="sm" className="p-0 h-auto font-medium text-primary hover:text-primary/80">
                        Đọc thêm
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Sự kiện sắp tới
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                      <div className="space-y-2">
                        <h4 className="font-medium text-foreground">{event.title}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(event.date)} • {event.time}
                        </div>
                        <Badge 
                          variant={event.type === "Miễn phí" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" size="sm">
                    Xem tất cả sự kiện
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Thành tích tháng này</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Học viên mới</span>
                    <span className="font-bold text-primary">45</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Đậu JLPT</span>
                    <span className="font-bold text-green-600">50</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tỷ lệ hài lòng</span>
                    <span className="font-bold text-blue-600">98%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Lớp học đang mở</span>
                    <span className="font-bold text-purple-600">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-bold">Đăng ký nhận tin</h3>
                  <p className="text-sm text-primary-foreground/80">
                    Nhận thông tin khóa học mới và ưu đãi đặc biệt qua email
                  </p>
                  <div className="space-y-2">
                    <input 
                      type="email" 
                      placeholder="Nhập email của bạn"
                      className="w-full px-3 py-2 rounded bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60 border border-primary-foreground/20"
                    />
                    <Button 
                      className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      size="sm"
                    >
                      Đăng ký
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
