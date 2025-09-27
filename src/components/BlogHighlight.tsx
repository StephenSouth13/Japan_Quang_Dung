"use client"

import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { BookOpen, Eye, MessageCircle, ArrowRight, Calendar, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ImageWithFallback } from "./figma/ImageWithFallback"

const featuredPosts = [
  {
    id: "1",
    title: "Cách sử dụng các trợ từ cơ bản trong tiếng Nhật",
    excerpt: "Tìm hiểu về は, が, を, に, で và cách sử dụng chúng một cách chính xác trong câu tiếng Nhật.",
    author: "Sensei Tanaka",
    publishDate: "2024-01-15",
    category: "grammar",
    level: "N5",
    readTime: 8,
    views: 1250,
    comments: 23,
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isFeatured: true,
  },
  {
    id: "2",
    title: "50 từ vựng thiết yếu cho cuộc sống hàng ngày",
    excerpt: "Danh sách từ vựng quan trọng nhất mà bạn cần biết để giao tiếp trong cuộc sống hàng ngày tại Nhật Bản.",
    author: "Sensei Yamamoto",
    publishDate: "2024-01-12",
    category: "vocabulary",
    level: "N4",
    readTime: 12,
    views: 980,
    comments: 18,
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isNew: true,
  },
  {
    id: "3",
    title: "Văn hóa làm việc tại Nhật Bản - Những điều cần biết",
    excerpt: "Khám phá những quy tắc và phong tục trong môi trường làm việc Nhật Bản để thành công trong sự nghiệp.",
    author: "Sensei Nakamura",
    publishDate: "2024-01-10",
    category: "culture",
    level: "All",
    readTime: 15,
    views: 1580,
    comments: 34,
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isFeatured: true,
  },
  {
    id: "4",
    title: "Chiến lược luyện thi JLPT N3 hiệu quả",
    excerpt: "Hướng dẫn chi tiết cách chuẩn bị và luyện thi JLPT N3 với phương pháp khoa học và hiệu quả.",
    author: "Sensei Tanaka",
    publishDate: "2024-01-08",
    category: "jlpt",
    level: "N3",
    readTime: 20,
    views: 2100,
    comments: 45,
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isFeatured: true,
  },
]

const categories = {
  grammar: { name: "Ngữ pháp", icon: "📖", color: "bg-blue-500" },
  vocabulary: { name: "Từ vựng", icon: "📝", color: "bg-green-500" },
  culture: { name: "Văn hóa", icon: "🎭", color: "bg-purple-500" },
  jlpt: { name: "JLPT", icon: "🎯", color: "bg-red-500" },
  conversation: { name: "Giao tiếp", icon: "💬", color: "bg-orange-500" },
  kanji: { name: "Kanji", icon: "🔤", color: "bg-pink-500" },
}

const levels = {
  N5: { name: "N5", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  N4: { name: "N4", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  N3: { name: "N3", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  N2: { name: "N2", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
  N1: { name: "N1", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  All: { name: "All", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" },
}

export function BlogHighlight() {
  const navigate = useNavigate()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <section className="py-20 bg-gradient-to-br from-background via-slate-50 to-red-50/20 dark:from-background dark:via-background dark:to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Blog tiếng Nhật
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Kiến Thức Hữu Ích</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá những bài viết chất lượng về ngữ pháp, từ vựng, văn hóa và phương pháp học tiếng Nhật hiệu quả
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">200+</div>
            <div className="text-muted-foreground">Bài viết</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50K+</div>
            <div className="text-muted-foreground">Độc giả</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">4.9★</div>
            <div className="text-muted-foreground">Đánh giá</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">Hàng tuần</div>
            <div className="text-muted-foreground">Cập nhật</div>
          </div>
        </div>

        {/* Featured Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredPosts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm group"
            >
              <div className="relative">
                <ImageWithFallback
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Badges */}
                <div className="absolute top-3 left-3 space-y-1">
                  <Badge className={levels[post.level as keyof typeof levels].color}>
                    {levels[post.level as keyof typeof levels].name}
                  </Badge>
                  {post.isFeatured && <Badge className="bg-yellow-500 text-white dark:bg-yellow-600">Nổi bật</Badge>}
                  {post.isNew && <Badge className="bg-green-500 text-white dark:bg-green-600">Mới</Badge>}
                </div>

                <div className="absolute top-3 right-3">
                  <Badge className={categories[post.category as keyof typeof categories].color + " text-white"}>
                    {categories[post.category as keyof typeof categories].icon}{" "}
                    {categories[post.category as keyof typeof categories].name}
                  </Badge>
                </div>

                {/* Read time */}
                <div className="absolute bottom-3 left-3">
                  <Badge variant="secondary" className="bg-card/90">
                    📖 {post.readTime} phút
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{post.excerpt}</p>
                  </div>

                  {/* Author and Date */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.publishDate)}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>

                  <Button size="sm" className="w-full">
                    Đọc bài viết
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-primary/10 via-pink-600/5 to-orange-500/10 rounded-2xl p-12">
          <div className="max-w-2xl mx-auto">
            <BookOpen className="w-16 h-16 mx-auto text-primary mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-4">Khám phá thêm nhiều bài viết hay</h3>
            <p className="text-muted-foreground mb-6">
              Hơn 200 bài viết chất lượng về tiếng Nhật và văn hóa Nhật Bản, được cập nhật thường xuyên bởi đội ngũ
              Sensei giàu kinh nghiệm
            </p>
            <Button size="lg" onClick={() => navigate("/blog")} className="bg-gradient-to-r from-primary to-pink-600">
              Xem tất cả bài viết
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
