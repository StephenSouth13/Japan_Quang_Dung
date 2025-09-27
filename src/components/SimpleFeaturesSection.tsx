import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Smartphone, 
  VideoIcon, 
  Users, 
  Clock, 
  Shield, 
  Award,
  BookOpen,
  Globe,
  HeadphonesIcon,
  GraduationCap
} from "lucide-react";

const features = [
  {
    icon: <VideoIcon className="w-8 h-8" />,
    title: "Học online linh hoạt",
    description: "Hệ thống học trực tuyến hiện đại với video bài giảng chất lượng cao, có thể học mọi lúc mọi nơi",
    highlight: "24/7 truy cập"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Lớp học nhỏ",
    description: "Tối đa 15 học viên mỗi lớp đảm bảo chất lượng và sự chú ý từ giáo viên",
    highlight: "Max 15 học viên"
  },
  {
    icon: <HeadphonesIcon className="w-8 h-8" />,
    title: "Hỗ trợ 1-1",
    description: "Giáo viên hỗ trợ cá nhân qua chat, điện thoại và tư vấn riêng khi cần thiết",
    highlight: "Miễn phí"
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Ứng dụng di động",
    description: "App học tiếng Nhật độc quyền với flashcard, mini-game và luyện tập hàng ngày",
    highlight: "Độc quyền"
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Lịch học linh hoạt",
    description: "Nhiều khung giờ học từ sáng đến tối, bao gồm cuối tuần để phù hợp với lịch làm việc",
    highlight: "7 ngày/tuần"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Cam kết chất lượng",
    description: "Hoàn tiền 100% nếu không hài lòng sau 2 tuần đầu tiên",
    highlight: "Đảm bảo 100%"
  }
];

const benefits = [
  {
    title: "Phương pháp riêng biệt",
    description: "Kết hợp truyền thống Nhật Bản và đặc thù người Việt Nam",
    icon: "🎯"
  },
  {
    title: "Công nghệ hiện đại",
    description: "AI hỗ trợ học tập và theo dõi tiến độ cá nhân",
    icon: "🤖"
  },
  {
    title: "Trải nghiệm thực tế",
    description: "Mô phỏng tình huống thực tế tại Nhật Bản",
    icon: "🏮"
  },
  {
    title: "Kết quả đo lường",
    description: "Đánh giá tiến độ thường xuyên và điều chỉnh phương pháp",
    icon: "📊"
  }
];

export function SimpleFeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-red-50/30 dark:from-background dark:to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Tính năng nổi bật</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Tại sao chọn Quang Dũng?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Những ưu điểm vượt trội giúp bạn học tiếng Nhật hiệu quả và đạt mục tiêu nhanh chóng
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group border-0 bg-card/70 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-pink-600/20 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      {feature.icon}
                    </div>
                    <Badge variant="outline" className="text-xs font-medium bg-gradient-to-r from-primary/10 to-pink-600/10 border-primary/20">
                      {feature.highlight}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
              
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg" />
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-primary/10 via-pink-600/5 to-orange-500/10 rounded-3xl p-8 lg:p-16 shadow-2xl border border-border/20 backdrop-blur-sm">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Phương pháp đột phá
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quang Dũng tiên phong áp dụng công nghệ và phương pháp giáo dục tiên tiến nhất
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 mx-auto mb-6 bg-card/50 rounded-3xl flex items-center justify-center text-4xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  {benefit.icon}
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {benefit.title}
                </h4>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-primary via-pink-600 to-red-600 text-primary-foreground rounded-3xl p-8 lg:p-16 shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+CiAgPC9nPgo8L3N2Zz4=')] opacity-20"></div>
            
            <div className="relative">
              <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                Sẵn sàng bắt đầu hành trình tiếng Nhật?
              </h3>
              <p className="text-primary-foreground/90 text-xl mb-10 max-w-3xl mx-auto">
                Đăng ký ngay hôm nay để được học thử miễn phí và nhận ưu đãi đặc biệt
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-background text-primary hover:bg-background/90 text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Học thử miễn phí
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-background text-background hover:bg-background/10 text-lg px-8 py-4 transform hover:scale-105 transition-all duration-200"
                >
                  Tư vấn ngay
                </Button>
              </div>
            
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 text-primary-foreground/80">
                <div className="flex items-center justify-center gap-3">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">2000+ học viên tin tưởng</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">15+ năm uy tín</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Cam kết chất lượng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
