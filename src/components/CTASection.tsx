import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { BookOpen, Phone, Mail, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-r from-primary via-pink-600 to-red-600 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+CiAgPC9nPgo8L3N2Zz4=')] opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
            Bắt đầu ngay hôm nay
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Hành trình tiếng Nhật
            <span className="block">của bạn bắt đầu tại đây</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Đăng ký tư vấn miễn phí hoặc tham gia lớp học thử để trải nghiệm 
            phương pháp giảng dạy độc đáo của Quang Dũng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* CTA Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Lớp học thử miễn phí</h3>
                  <p className="text-white/80">Trải nghiệm 1 buổi học hoàn toàn miễn phí</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Tư vấn 1-1</h3>
                  <p className="text-white/80">Đội ngũ tư vấn giàu kinh nghiệm sẽ hỗ trợ bạn</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Linh hoạt thời gian</h3>
                  <p className="text-white/80">Lịch học đa dạng phù hợp mọi đối tượng</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => navigate('/courses')}
              >
                Đăng ký học thử miễn phí
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4 transform hover:scale-105 transition-all duration-200"
                onClick={() => navigate('/contact')}
              >
                Tư vấn miễn phí
              </Button>
            </div>
          </div>

          {/* Contact Info Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Thông tin liên hệ</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-white/80" />
                  <div>
                    <p className="font-medium">123 Nguyễn Huệ, Quận 1</p>
                    <p className="text-white/80">TP. Hồ Chí Minh</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-white/80" />
                  <div>
                    <p className="font-medium">(028) 3825 1234</p>
                    <p className="text-white/80">Hotline tư vấn</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-white/80" />
                  <div>
                    <p className="font-medium">info@Quang Dũng-center.vn</p>
                    <p className="text-white/80">Email hỗ trợ</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-white/80" />
                  <div>
                    <p className="font-medium">T2 - T6: 8:00 - 20:00</p>
                    <p className="text-white/80">T7 - CN: 8:00 - 17:00</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-center text-white/80 text-sm">
                  🌸 Đăng ký ngay để nhận ưu đãi đặc biệt! 🌸
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
