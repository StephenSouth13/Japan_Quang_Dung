import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Award, Target, Users, Globe } from "lucide-react";

const features = [
  {
    icon: <Award className="w-8 h-8 text-primary" />,
    title: "Chất lượng hàng đầu",
    description: "Được công nhận bởi Hiệp hội Giáo dục Nhật Bản với chương trình chuẩn quốc tế"
  },
  {
    icon: <Target className="w-8 h-8 text-primary" />,
    title: "Phương pháp hiệu quả",
    description: "Kết hợp lý thuyết và thực hành, tập trung vào giao tiếp thực tế hàng ngày"
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Giáo viên bản ngữ",
    description: "Đội ngũ giáo viên người Nhật có kinh nghiệm và được đào tạo chuyên nghiệp"
  },
  {
    icon: <Globe className="w-8 h-8 text-primary" />,
    title: "Cơ hội du học",
    description: "Hỗ trợ tư vấn và kết nối với các trường đại học, công ty tại Nhật Bản"
  }
];

const stats = [
  { number: "15+", label: "Năm kinh nghiệm" },
  { number: "2000+", label: "Học viên đã tốt nghiệp" },
  { number: "95%", label: "Tỷ lệ đậu JLPT N3" },
  { number: "500+", label: "Học viên đi làm tại Nhật" }
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-background via-slate-50 to-red-50/20 dark:from-background dark:via-background dark:to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <Badge variant="secondary" className="mb-4">Giới thiệu</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Trung tâm tiếng Nhật hàng đầu Việt Nam
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Với hơn 15 năm kinh nghiệm trong lĩnh vực giáo dục tiếng Nhật, trung tâm Quang Dũng tự hào là 
              cầu nối đưa hàng ngàn học viên Việt Nam đến với ước mơ học tập và làm việc tại Nhật Bản.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border/20">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <Button size="lg">Tìm hiểu thêm</Button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-6 p-8 bg-card/70 backdrop-blur-sm rounded-2xl border-0 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-pink-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mission Statement */}
        <div className="mt-20 text-center bg-gradient-to-r from-primary/10 via-pink-600/5 to-orange-500/10 rounded-3xl p-16 shadow-2xl border border-border/20 backdrop-blur-sm relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyMjAsMzgsMzgsMC4xKSIvPgogIDwvZz4KPC9zdmc+')] opacity-20"></div>
          
          <div className="relative">
            <h3 className="text-3xl font-bold text-foreground mb-6">Sứ mệnh của chúng tôi</h3>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              "Mang đến cho học viên những kiến thức tiếng Nhật chất lượng cao, 
              không chỉ để giao tiếp mà còn để hiểu sâu về văn hóa Nhật Bản, 
              từ đó mở ra những cơ hội mới trong cuộc sống và sự nghiệp."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-card/50 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌸</span>
              </div>
              <cite className="text-primary font-bold text-lg">
                - Sensei Tanaka, Giám đốc học thuật
              </cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
