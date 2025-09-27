import { useState } from "react";
import { useRouter } from "./SimpleRouter";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Clock, Users, BookOpen } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const courses = [
  {
    id: 1,
    title: "Tiếng Nhật cơ bản (N5)",
    description: "Khóa học dành cho người mới bắt đầu, tập trung vào Hiragana, Katakana và từ vựng cơ bản.",
    level: "Sơ cấp",
    duration: "3 tháng",
    students: "120",
    price: "2.500.000",
    image: "https://images.unsplash.com/photo-1555111359-851254288029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGNsYXNzcm9vbSUyMGxlYXJuaW5nfGVufDF8fHx8MTc1Nzc1Mzk3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    features: ["Alphabet Nhật Bản", "Ngữ pháp cơ bản", "Từ vựng hàng ngày", "Giao tiếp đơn giản"]
  },
  {
    id: 2,
    title: "Tiếng Nhật trung cấp (N4-N3)",
    description: "Phát triển kỹ năng nghe, nói, đọc, viết và chuẩn bị cho kỳ thi JLPT N4-N3.",
    level: "Trung cấp",
    duration: "6 tháng",
    students: "85",
    price: "4.200.000",
    image: "https://images.unsplash.com/photo-1695562322876-31c63ccf2049?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGNhbGxpZ3JhcGh5JTIwd3JpdGluZ3xlbnwxfHx8fDE3NTc3NTM5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    features: ["Kanji nâng cao", "Ngữ pháp phức tạp", "Kỹ năng nghe", "Luyện thi JLPT"]
  },
  {
    id: 3,
    title: "Giao tiếp kinh doanh",
    description: "Tiếng Nhật chuyên ngành kinh doanh, phù hợp cho người đi làm tại các công ty Nhật.",
    level: "Cao cấp",
    duration: "4 tháng",
    students: "45",
    price: "5.800.000",
    image: "https://images.unsplash.com/photo-1708773651811-14e0b08c3b29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHRlYWNoZXIlMjBlZHVjYXRpb258ZW58MXx8fHwxNzU3NzUzOTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    features: ["Ngôn ngữ văn phòng", "Email & báo cáo", "Thuyết trình", "Văn hóa công sở"]
  }
];

export function SimpleCoursesSection() {
  const { navigate } = useRouter();

  return (
    <section id="courses" className="py-20 bg-gradient-to-br from-background via-red-50/20 to-pink-50/30 dark:from-background dark:via-background dark:to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Khóa học</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Chương trình học đa dạng
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Từ cơ bản đến nâng cao, chúng tôi có các khóa học phù hợp với mọi trình độ và mục tiêu học tập
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm group">
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <Badge className="absolute top-4 left-4 bg-card/90 text-foreground border-0 shadow-lg">
                  {course.level}
                </Badge>
                <div className="absolute top-4 right-4 w-10 h-10 bg-card/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
              </div>
              
              <CardHeader className="pb-4">
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                  {course.title}
                </CardTitle>
                <p className="text-muted-foreground leading-relaxed">{course.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {course.students} học viên
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Nội dung chính:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {course.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
                        {course.price.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground font-medium"> VNĐ</span>
                    </div>
                    <Button className="bg-gradient-to-r from-primary to-pink-600 hover:from-primary/90 hover:to-pink-600/90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                      Đăng ký ngay
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-4 border-2 hover:bg-primary/5 hover:border-primary/50 transform hover:scale-105 transition-all duration-200"
            onClick={() => navigate('courses')}
          >
            Xem tất cả khóa học
          </Button>
        </div>
      </div>
    </section>
  );
}
