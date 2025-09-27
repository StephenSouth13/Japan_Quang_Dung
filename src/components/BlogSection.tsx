
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { BookOpen, Search, Eye, MessageCircle, Calendar, User } from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  category: "grammar" | "vocabulary" | "culture" | "jlpt" | "conversation" | "kanji"
  level: "N5" | "N4" | "N3" | "N2" | "N1" | "All"
  readTime: number
  views: number
  comments: number
  image: string
  tags: string[]
  isFeatured?: boolean
  isNew?: boolean
}

const categories = {
  grammar: { name: "Ngữ pháp", icon: "📖", color: "bg-blue-500" },
  vocabulary: { name: "Từ vựng", icon: "📝", color: "bg-green-500" },
  culture: { name: "Văn hóa", icon: "🎭", color: "bg-purple-500" },
  jlpt: { name: "JLPT", icon: "🎯", color: "bg-red-500" },
  conversation: { name: "Giao tiếp", icon: "💬", color: "bg-orange-500" },
  kanji: { name: "Kanji", icon: "🔤", color: "bg-pink-500" },
}

const levels = {
  N5: { name: "N5 - Cơ bản", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  N4: { name: "N4 - Sơ cấp", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  N3: { name: "N3 - Trung cấp", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
  N2: { name: "N2 - Trung cao cấp", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
  N1: { name: "N1 - Cao cấp", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
  All: { name: "Tất cả cấp độ", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300" },
}

export function BlogSection() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        const params = new URLSearchParams()
        if (categoryFilter !== "all") params.append("category", categoryFilter)
        if (levelFilter !== "all") params.append("level", levelFilter)
        params.append("sortBy", sortBy)

        const response = await fetch(`/api/posts?${params.toString()}`, { cache: 'no-store' })
        const data = await response.json()

        if (data.success) {
          const formattedPosts = data.data.map((post: any) => ({
            id: post.id.toString(),
            title: post.title,
            excerpt: post.excerpt || post.content.substring(0, 150) + '...',
            content: post.content,
            author: post.author,
            publishDate: post.publishDate,
            category: post.category as BlogPost['category'],
            level: post.level as BlogPost['level'],
            readTime: post.readTime,
            views: post.views,
            comments: post.comments,
            image: post.image,
            tags: post.tags || [],
            isFeatured: post.isFeatured,
            isNew: post.isNew,
          }))
          setBlogPosts(formattedPosts)
        } else {
          setError(data.error || 'Không thể tải bài viết')
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err)
        setError('Có lỗi xảy ra khi tải bài viết')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [categoryFilter, levelFilter, sortBy])

  // Client-side search
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesLevel = levelFilter === "all" || post.level === levelFilter
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter
    return matchesSearch && matchesLevel && matchesCategory
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <section className="py-20 bg-gradient-to-br from-background via-slate-50 to-red-50/20 dark:from-background dark:via-background dark:to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Blog tiếng Nhật
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Kiến Thức Tiếng Nhật Hữu Ích</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá những bài viết chất lượng về ngữ pháp, từ vựng, văn hóa và phương pháp học tiếng Nhật hiệu quả
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-12 border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Cấp độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả cấp độ</SelectItem>
                  <SelectItem value="N5">N5 - Cơ bản</SelectItem>
                  <SelectItem value="N4">N4 - Sơ cấp</SelectItem>
                  <SelectItem value="N3">N3 - Trung cấp</SelectItem>
                  <SelectItem value="N2">N2 - Trung cao cấp</SelectItem>
                  <SelectItem value="N1">N1 - Cao cấp</SelectItem>
                  <SelectItem value="All">Tất cả cấp độ</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chủ đề" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả chủ đề</SelectItem>
                  <SelectItem value="grammar">📖 Ngữ pháp</SelectItem>
                  <SelectItem value="vocabulary">📝 Từ vựng</SelectItem>
                  <SelectItem value="culture">🎭 Văn hóa</SelectItem>
                  <SelectItem value="jlpt">🎯 JLPT</SelectItem>
                  <SelectItem value="conversation">💬 Giao tiếp</SelectItem>
                  <SelectItem value="kanji">🔤 Kanji</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                  <SelectItem value="popular">Phổ biến nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Đang tải bài viết...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Không tìm thấy bài viết phù hợp</h3>
            <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm group"
              >
                <div className="relative">
                  <ImageWithFallback
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 space-y-2">
                    <Badge className={levels[post.level].color}>{post.level}</Badge>
                    {post.isFeatured && <Badge className="bg-yellow-500 text-white">Nổi bật</Badge>}
                    {post.isNew && <Badge className="bg-green-500 text-white">Mới</Badge>}
                  </div>

                  <div className="absolute top-3 right-3">
                    <Badge className={categories[post.category].color + " text-white"}>
                      {categories[post.category].icon} {categories[post.category].name}
                    </Badge>
                  </div>

                  {/* Read time */}
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-card/90">
                      📖 {post.readTime} phút đọc
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mt-2">{post.excerpt}</p>
                    </div>

                    {/* Author and Date */}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.publishDate)}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full"
                      onClick={() => router.push(`/blog/${post.id}`)}
                    >
                      Đọc bài viết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-primary/10 via-pink-600/5 to-orange-500/10 rounded-3xl p-12">
          <h3 className="text-2xl font-bold text-foreground mb-4">Muốn Nhận Thêm Bài Viết Mới?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Đăng ký nhận thông báo để không bỏ lỡ những bài viết hữu ích về tiếng Nhật và văn hóa Nhật Bản
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-pink-600">
              Đăng ký nhận thông báo
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push('/blog')}>
              Xem tất cả bài viết
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
