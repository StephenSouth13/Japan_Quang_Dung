import { AboutSection } from '../components/AboutSection';
import { TeachersSection } from '../components/TeachersSection';
import { ContactSection } from '../components/ContactSection';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Award, Users, Target, Globe, Heart, Lightbulb, Shield, Smile } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function AboutPage() {
  const coreValues = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Tận tâm",
      description: "Chúng tôi quan tâm đến từng học viên như người thân trong gia đình"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Sáng tạo", 
      description: "Luôn đổi mới phương pháp giảng dạy để học tập trở nên thú vị"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Uy tín",
      description: "Cam kết chất lượng và minh bạch trong mọi hoạt động giáo dục"
    },
    {
      icon: <Smile className="w-8 h-8" />,
      title: "Vui vẻ",
      description: "Tạo môi trường học tập tích cực, vui vẻ và đầy cảm hứng"
    }
  ];

  const timeline = [
    {
      year: "2008",
      title: "Thành lập trung tâm",
      description: "Bắt đầu với lớp học đầu tiên tại TP.HCM"
    },
    {
      year: "2012", 
      title: "Mở rộng quy mô",
      description: "Khai trương chi nhánh thứ 2 và đạt 500 học viên"
    },
    {
      year: "2016",
      title: "Công nghệ giáo dục",
      description: "Ra mắt nền tảng học online đầu tiên"
    },
    {
      year: "2020",
      title: "Thời kỳ phát triển",
      description: "Vượt mốc 2000 học viên và tỷ lệ đậu N3 đạt 95%"
    },
    {
      year: "2024",
      title: "Hiện tại",
      description: "Trung tâm hàng đầu với 3 cơ sở và đa dạng khóa học"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="py-20 bg-gradient-to-br from-primary via-pink-600 to-red-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+CiAgPC9nPgo8L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
            Câu chuyện của chúng tôi
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Về Trung Tâm Quang Dũng
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            15+ năm kinh nghiệm đào tạo tiếng Nhật, nơi kết nối ước mơ Nhật Bản 
            của hàng ngàn học viên Việt Nam
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-br from-background via-slate-50 to-red-50/20 dark:from-background dark:via-background dark:to-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Câu chuyện khởi đầu</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Từ Ước Mơ Đến Hiện Thực
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Trung tâm Quang Dũng được thành lập từ ước mơ mang văn hóa và ngôn ngữ Nhật Bản 
                đến gần hơn với người Việt. Bắt đầu từ một lớp học nhỏ với 15 học viên, 
                chúng tôi đã không ngừng phát triển và hoàn thiện.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Ngày hôm nay, Quang Dũng tự hào là cầu nối đưa hơn 2000 học viên đến với 
                ước mơ du học, làm việc và sinh sống tại đất nước mặt trời mọc.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary to-pink-600">
                Tìm hiểu thêm
              </Button>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGNsYXNzcm9vbXxlbnwxfHx8fDE3NTc3NTM5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Học viên tại Quang Dũng"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">2000+</div>
                  <div className="text-sm text-muted-foreground">Học viên thành công</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <AboutSection />

      {/* Core Values */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-pink-50/30 dark:from-background dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Giá trị cốt lõi</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Những Giá Trị Chúng Tôi Theo Đuổi
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Các giá trị cốt lõi định hình văn hóa và phương pháp giảng dạy của Quang Dũng
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm group">
                <CardContent className="p-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-pink-600/20 rounded-3xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-br from-background via-slate-50 to-red-50/20 dark:from-background dark:via-background dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Hành trình phát triển</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dấu Mốc Quan Trọng
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Những khoảnh khắc đáng nhớ trong hành trình 15 năm phát triển của Quang Dũng
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-pink-600 rounded-full"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-gradient-to-r from-primary to-pink-600">
                          {item.year}
                        </Badge>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="w-6 h-6 bg-card border-4 border-primary rounded-full z-10 shadow-lg"></div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Teachers Section */}
      <TeachersSection />
      
      {/* Mission & Vision Enhanced */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-pink-600/5 to-orange-500/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16">
            <Card className="text-center hover:shadow-2xl transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center">
                  <Target className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Sứ Mệnh</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Mang đến cơ hội học tiếng Nhật chất lượng cao cho mọi người, 
                  giúp học viên đạt được mục tiêu du học, làm việc và sinh sống tại Nhật Bản 
                  thông qua phương pháp giảng dạy hiện đại và tận tâm.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-2xl transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-3xl flex items-center justify-center">
                  <Globe className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Tầm Nhìn</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Trở thành trung tâm tiếng Nhật uy tín nhất Việt Nam, 
                  nơi kết nối văn hóa và tạo cầu nối cho sự phát triển bền vững 
                  giữa Việt Nam và Nhật Bản.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
