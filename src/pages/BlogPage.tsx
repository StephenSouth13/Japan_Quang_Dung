import { BlogSection } from "../components/BlogSection"
import { ContactSection } from "../components/ContactSection"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { BookOpen, Star, Users, Eye, MessageCircle, TrendingUp } from "lucide-react"

export function BlogPage() {
  const blogStats = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "200+ Bài viết",
      description: "Nội dung chất lượng cao",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "50,000+ Độc giả",
      description: "Cộng đồng học tập",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "4.9/5 Đánh giá",
      description: "Nội dung hữu ích",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Cập nhật hàng tuần",
      description: "Nội dung mới liên tục",
    },
  ]

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Nội dung chuyên sâu",
      description: "Bài viết được biên soạn bởi các Sensei có kinh nghiệm",
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Dễ hiểu, dễ áp dụng",
      description: "Giải thích rõ ràng với ví dụ thực tế",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Tương tác cộng đồng",
      description: "Thảo luận và chia sẻ kinh nghiệm học tập",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Cập nhật xu hướng",
      description: "Theo kịp những thay đổi mới nhất của tiếng Nhật",
    },
  ]

  const categories = [
    { name: "Ngữ pháp", count: 45, color: "from-blue-500 to-blue-600", icon: "📖" },
    { name: "Từ vựng", count: 38, color: "from-green-500 to-green-600", icon: "📝" },
    { name: "Văn hóa", count: 32, color: "from-purple-500 to-purple-600", icon: "🎭" },
    { name: "JLPT", count: 28, color: "from-red-500 to-red-600", icon: "🎯" },
    { name: "Giao tiếp", count: 35, color: "from-orange-500 to-orange-600", icon: "💬" },
    { name: "Kanji", count: 22, color: "from-pink-500 to-pink-600", icon: "🔤" },
  ]

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="py-20 bg-gradient-to-br from-primary via-pink-600 to-red-600 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+CiAgPC9nPgo8L3N2Zz4=')] opacity-20"></div>

        <div className="relative container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
            Blog học tiếng Nhật
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Kiến Thức Tiếng Nhật</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Khám phá những bài viết chất lượng về ngữ pháp, từ vựng, văn hóa và phương pháp học tiếng Nhật hiệu quả từ
            các Sensei chuyên nghiệp
          </p>

          {/* Blog Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {blogStats.map((stat, index) => (
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

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-red-50/30 dark:from-background dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Ưu điểm nổi bật
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tại Sao Chọn Blog Quang Dũng?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nội dung chất lượng cao được biên soạn bởi đội ngũ Sensei giàu kinh nghiệm, giúp bạn học tiếng Nhật hiệu
              quả hơn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-xl transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm group"
              >
                <CardContent className="p-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-pink-600/20 rounded-3xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Chủ Đề Bài Viết</h3>
            <p className="text-muted-foreground">Khám phá các chủ đề đa dạng về tiếng Nhật và văn hóa Nhật Bản</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    {category.icon}
                  </div>
                  <h4 className="font-bold mb-2 group-hover:text-primary transition-colors">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">{category.count} bài viết</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <BlogSection />

      {/* Learning Tips */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-pink-50/30 dark:from-background dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Mẹo học tập
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cách Tận Dụng Blog Hiệu Quả</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Những gợi ý để bạn học tiếng Nhật hiệu quả thông qua các bài viết
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Đọc theo cấp độ",
                description: "Bắt đầu với các bài viết phù hợp với trình độ hiện tại của bạn",
                tips: ["Chọn bài viết N5 nếu mới bắt đầu", "Đọc từ dễ đến khó", "Không vội vàng nâng cấp độ"],
              },
              {
                step: "02",
                title: "Ghi chú và thực hành",
                description: "Ghi chú những điểm quan trọng và áp dụng vào thực tế",
                tips: ["Tạo sổ ghi chú riêng", "Thực hành ngay sau khi đọc", "Ôn tập định kỳ"],
              },
              {
                step: "03",
                title: "Tham gia thảo luận",
                description: "Chia sẻ ý kiến và học hỏi từ cộng đồng",
                tips: ["Đặt câu hỏi khi chưa hiểu", "Chia sẻ kinh nghiệm", "Kết nối với học viên khác"],
              },
            ].map((tip, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-primary/20 mb-4">{tip.step}</div>
                  <h3 className="text-xl font-bold mb-4">{tip.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{tip.description}</p>
                  <ul className="space-y-2">
                    {tip.tips.map((tipItem, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        {tipItem}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary via-pink-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Bắt Đầu Hành Trình Học Với Blog Quang Dũng</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Tham gia cộng đồng học tiếng Nhật và nhận thông báo về những bài viết mới nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-4">
              Đăng ký nhận thông báo
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 bg-transparent"
            >
              Khám phá tất cả bài viết
            </Button>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  )
}
