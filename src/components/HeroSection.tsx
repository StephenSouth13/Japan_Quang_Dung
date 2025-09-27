import { Button } from "./ui/button";
import { Play, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  const navigate = useNavigate();
  
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-background dark:via-background dark:to-background py-20 min-h-[85vh] flex items-center">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-primary/20 to-pink-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-orange-300/20 to-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-red-200/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-muted-foreground font-medium">4.9/5 từ 2000+ học viên</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
              Học tiếng Nhật cùng
              <span className="block bg-gradient-to-r from-primary via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Trung tâm Quang Dũng
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Khám phá vẻ đẹp của ngôn ngữ và văn hóa Nhật Bản với phương pháp giảng dạy hiện đại, 
              giáo viên bản ngữ và chương trình học được thiết kế riêng cho người Việt Nam.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-pink-600 hover:from-primary/90 hover:to-pink-600/90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
                onClick={() => navigate('/courses')}
              >
                Khám phá khóa học
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 border-2 hover:bg-primary/5 hover:border-primary/50 transform hover:scale-105 transition-all duration-200" 
                onClick={() => navigate('/about')}
              >
                <Play className="w-5 h-5 mr-2" />
                Tìm hiểu thêm
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/30">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">2000+</div>
                <div className="text-sm text-muted-foreground font-medium">Học viên</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">15+</div>
                <div className="text-sm text-muted-foreground font-medium">Năm kinh nghiệm</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">95%</div>
                <div className="text-sm text-muted-foreground font-medium">Tỷ lệ đậu N3</div>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1599481502671-dc2c675875bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGN1bHR1cmUlMjBjaGVycnklMjBibG9zc29tfGVufDF8fHx8MTc1Nzc1Mzk3MXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Japanese Culture"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/20 transform hover:scale-110 transition-transform duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">あ</div>
                <div className="text-sm text-muted-foreground font-medium">Hiragana</div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/20 transform hover:scale-110 transition-transform duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">漢字</div>
                <div className="text-sm text-muted-foreground font-medium">Kanji</div>
              </div>
            </div>
            
            <div className="absolute top-1/2 -right-4 bg-gradient-to-br from-primary/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-border/20 transform hover:scale-110 transition-transform duration-300">
              <div className="text-center">
                <div className="text-xl font-bold text-primary mb-1">桜</div>
                <div className="text-xs text-muted-foreground font-medium">Quang Dũng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
