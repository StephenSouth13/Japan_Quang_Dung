
"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Search, BookOpen, Users, Brain } from "lucide-react"
import { toast } from "sonner"
import { BlogSection } from "./BlogSection"
import { UserManagement } from "./UserManagement"
import { CourseManagement } from "./CourseManagement"
import { AnalyticsDashboard } from "./AnalyticsDashboard"
import { RoleManager } from "./RoleManager"
import { EmailManagement } from "./EmailManagement"
import { SystemLogsManagement } from "./SystemLogsManagement"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Edit, Trash2 } from "lucide-react"

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

export function AdminDashboard() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [blogSearchTerm, setBlogSearchTerm] = useState("")
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: "",
    content: "",
    category: "grammar",
    level: "N5",
    readTime: 5,
    image: "",
    tags: [],
    author: "Admin",
    isFeatured: false,
    isNew: false,
  })

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/posts', { cache: 'no-store' })
      const result = await response.json()
      if (result.success) {
        const formattedPosts = result.data.map((post: any) => ({
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
        toast.error(result.error || "Không thể tải bài viết")
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      toast.error("Có lỗi xảy ra khi tải bài viết")
    } finally {
      setLoading(false)
    }
  }

  // Create new post
  const createPost = async () => {
    try {
      const response = await fetch('/api/posts', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPost,
          tags: newPost.tags?.length ? newPost.tags : [],
          publishDate: new Date().toISOString().split('T')[0],
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to create post")
      }
      toast.success("Tạo bài viết thành công!")
      setNewPost({ title: "", content: "", category: "grammar", level: "N5", readTime: 5, image: "", tags: [], author: "Admin", isFeatured: false, isNew: false })
      fetchBlogPosts()
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error("Có lỗi xảy ra khi tạo bài viết")
    }
  }

  // Update post
  const updatePost = async () => {
    if (!selectedPost) return
    try {
      const response = await fetch('/api/posts', {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedPost.id, ...selectedPost }),
      })
      if (!response.ok) {
        throw new Error("Failed to update post")
      }
      toast.success("Cập nhật bài viết thành công!")
      setSelectedPost(null)
      fetchBlogPosts()
    } catch (error) {
      console.error("Error updating post:", error)
      toast.error("Có lỗi xảy ra khi cập nhật bài viết")
    }
  }

  // Delete post
  const deletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete post")
      }
      toast.success("Xóa bài viết thành công!")
      fetchBlogPosts()
    } catch (error) {
      console.error("Error deleting post:", error)
      toast.error("Có lỗi xảy ra khi xóa bài viết")
    }
  }

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const filteredBlogPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(blogSearchTerm.toLowerCase())),
  )

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Đang tải dữ liệu...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => fetchBlogPosts()}>Làm mới</Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="courses">Khóa học</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 text-center hover:bg-accent/50 transition-colors cursor-pointer">
              <Users className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Quản lý người dùng</h3>
              <p className="text-sm text-muted-foreground">Xem và quản lý học viên, giáo viên</p>
            </Card>
            <Card className="p-6 text-center hover:bg-accent/50 transition-colors cursor-pointer">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Quản lý khóa học</h3>
              <p className="text-sm text-muted-foreground">Tạo và chỉnh sửa khóa học</p>
            </Card>
            <Card className="p-6 text-center hover:bg-accent/50 transition-colors cursor-pointer">
              <Brain className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Quản lý nội dung</h3>
              <p className="text-sm text-muted-foreground">Tạo và quản lý bài viết</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <CourseManagement />
        </TabsContent>

        <TabsContent value="blog" className="space-y-6 mt-6">
          {/* Blog Management */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề, tác giả, hoặc tags..."
                value={blogSearchTerm}
                onChange={(e) => setBlogSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Tạo bài viết mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Tạo bài viết mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tiêu đề</label>
                    <Input
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="Nhập tiêu đề bài viết"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nội dung</label>
                    <Textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="Nhập nội dung bài viết"
                      rows={6}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Chủ đề</label>
                      <Select
                        value={newPost.category}
                        onValueChange={(value) => setNewPost({ ...newPost, category: value as BlogPost['category'] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chủ đề" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grammar">Ngữ pháp</SelectItem>
                          <SelectItem value="vocabulary">Từ vựng</SelectItem>
                          <SelectItem value="culture">Văn hóa</SelectItem>
                          <SelectItem value="jlpt">JLPT</SelectItem>
                          <SelectItem value="conversation">Giao tiếp</SelectItem>
                          <SelectItem value="kanji">Kanji</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Cấp độ</label>
                      <Select
                        value={newPost.level}
                        onValueChange={(value) => setNewPost({ ...newPost, level: value as BlogPost['level'] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn cấp độ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N5">N5</SelectItem>
                          <SelectItem value="N4">N4</SelectItem>
                          <SelectItem value="N3">N3</SelectItem>
                          <SelectItem value="N2">N2</SelectItem>
                          <SelectItem value="N1">N1</SelectItem>
                          <SelectItem value="All">Tất cả</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">URL hình ảnh</label>
                    <Input
                      value={newPost.image}
                      onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                      placeholder="Nhập URL hình ảnh"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tags (cách nhau bằng dấu phẩy)</label>
                    <Input
                      value={newPost.tags?.join(',')}
                      onChange={(e) => setNewPost({ ...newPost, tags: e.target.value.split(',').map(t => t.trim()) })}
                      placeholder="Nhập tags, ví dụ: ngữ pháp, N5"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Thời gian đọc (phút)</label>
                    <Input
                      type="number"
                      value={newPost.readTime}
                      onChange={(e) => setNewPost({ ...newPost, readTime: Number(e.target.value) })}
                      placeholder="Nhập thời gian đọc"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tác giả</label>
                    <Input
                      value={newPost.author}
                      onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                      placeholder="Nhập tên tác giả"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-muted-foreground">Nổi bật</label>
                    <input
                      type="checkbox"
                      checked={newPost.isFeatured}
                      onChange={(e) => setNewPost({ ...newPost, isFeatured: e.target.checked })}
                    />
                    <label className="text-sm font-medium text-muted-foreground">Bài mới</label>
                    <input
                      type="checkbox"
                      checked={newPost.isNew}
                      onChange={(e) => setNewPost({ ...newPost, isNew: e.target.checked })}
                    />
                  </div>
                  <Button onClick={createPost} className="w-full">Tạo bài viết</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách bài viết ({filteredBlogPosts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Tác giả</TableHead>
                    <TableHead>Chủ đề</TableHead>
                    <TableHead>Cấp độ</TableHead>
                    <TableHead>Lượt xem</TableHead>
                    <TableHead>Ngày đăng</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlogPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>{post.category}</TableCell>
                      <TableCell>{post.level}</TableCell>
                      <TableCell>{post.views.toLocaleString()}</TableCell>
                      <TableCell>{new Date(post.publishDate).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedPost(post)}>
                                <Edit className="h-3 w-3 mr-1" />
                                Sửa
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Chỉnh sửa bài viết {post.title}</DialogTitle>
                              </DialogHeader>
                              {selectedPost && (
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tiêu đề</label>
                                    <Input
                                      value={selectedPost.title}
                                      onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
                                      placeholder="Nhập tiêu đề bài viết"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Nội dung</label>
                                    <Textarea
                                      value={selectedPost.content}
                                      onChange={(e) => setSelectedPost({ ...selectedPost, content: e.target.value })}
                                      placeholder="Nhập nội dung bài viết"
                                      rows={6}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Chủ đề</label>
                                      <Select
                                        value={selectedPost.category}
                                        onValueChange={(value) => setSelectedPost({ ...selectedPost, category: value as BlogPost['category'] })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Chọn chủ đề" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="grammar">Ngữ pháp</SelectItem>
                                          <SelectItem value="vocabulary">Từ vựng</SelectItem>
                                          <SelectItem value="culture">Văn hóa</SelectItem>
                                          <SelectItem value="jlpt">JLPT</SelectItem>
                                          <SelectItem value="conversation">Giao tiếp</SelectItem>
                                          <SelectItem value="kanji">Kanji</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Cấp độ</label>
                                      <Select
                                        value={selectedPost.level}
                                        onValueChange={(value) => setSelectedPost({ ...selectedPost, level: value as BlogPost['level'] })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Chọn cấp độ" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="N5">N5</SelectItem>
                                          <SelectItem value="N4">N4</SelectItem>
                                          <SelectItem value="N3">N3</SelectItem>
                                          <SelectItem value="N2">N2</SelectItem>
                                          <SelectItem value="N1">N1</SelectItem>
                                          <SelectItem value="All">Tất cả</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">URL hình ảnh</label>
                                    <Input
                                      value={selectedPost.image}
                                      onChange={(e) => setSelectedPost({ ...selectedPost, image: e.target.value })}
                                      placeholder="Nhập URL hình ảnh"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tags (cách nhau bằng dấu phẩy)</label>
                                    <Input
                                      value={selectedPost.tags.join(',')}
                                      onChange={(e) => setSelectedPost({ ...selectedPost, tags: e.target.value.split(',').map(t => t.trim()) })}
                                      placeholder="Nhập tags, ví dụ: ngữ pháp, N5"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Thời gian đọc (phút)</label>
                                    <Input
                                      type="number"
                                      value={selectedPost.readTime}
                                      onChange={(e) => setSelectedPost({ ...selectedPost, readTime: Number(e.target.value) })}
                                      placeholder="Nhập thời gian đọc"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tác giả</label>
                                    <Input
                                      value={selectedPost.author}
                                      onChange={(e) => setSelectedPost({ ...selectedPost, author: e.target.value })}
                                      placeholder="Nhập tên tác giả"
                                    />
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    <label className="text-sm font-medium text-muted-foreground">Nổi bật</label>
                                    <input
                                      type="checkbox"
                                      checked={selectedPost.isFeatured}
                                      onChange={(e) => setSelectedPost({ ...selectedPost, isFeatured: e.target.checked })}
                                    />
                                    <label className="text-sm font-medium text-muted-foreground">Bài mới</label>
                                    <input
                                      type="checkbox"
                                      checked={selectedPost.isNew}
                                      onChange={(e) => setSelectedPost({ ...selectedPost, isNew: e.target.checked })}
                                    />
                                  </div>
                                  <Button onClick={updatePost} className="w-full">Cập nhật bài viết</Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deletePost(post.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredBlogPosts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">Không có bài viết nào được tìm thấy</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">Cài đặt chung</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="roles">Phân quyền</TabsTrigger>
              <TabsTrigger value="logs">System Logs</TabsTrigger>
              <TabsTrigger value="backup">Backup & Bảo mật</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt hệ thống</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Cấu hình chung</h3>
                    <p className="text-muted-foreground mb-4">
                      Quản lý các thiết lập chung của hệ thống học tiếng Nhật.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                        <h4 className="font-medium mb-2">📧 Thông báo Email</h4>
                        <p className="text-sm text-muted-foreground">Cấu hình email tự động gửi cho học viên</p>
                        <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                          Cấu hình
                        </Button>
                      </Card>
                      <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                        <h4 className="font-medium mb-2">🔔 Notifications</h4>
                        <p className="text-sm text-muted-foreground">Quản lý thông báo trong hệ thống</p>
                        <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                          Cài đặt
                        </Button>
                      </Card>
                      <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                        <h4 className="font-medium mb-2">🎨 Giao diện</h4>
                        <p className="text-sm text-muted-foreground">Tùy chỉnh màu sắc và layout</p>
                        <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                          Tùy chỉnh
                        </Button>
                      </Card>
                      <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                        <h4 className="font-medium mb-2">⚙️ API Settings</h4>
                        <p className="text-sm text-muted-foreground">Cấu hình API keys và endpoints</p>
                        <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                          Quản lý
                        </Button>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="email" className="mt-6">
              <EmailManagement />
            </TabsContent>
            <TabsContent value="roles" className="mt-6">
              <RoleManager />
            </TabsContent>
            <TabsContent value="logs" className="mt-6">
              <SystemLogsManagement />
            </TabsContent>
            <TabsContent value="backup" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>🔐 Bảo mật</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Xác thực 2 lớp (2FA)</span>
                        <Badge className="bg-green-500 text-white">Đã bật</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Session timeout</span>
                        <span className="text-sm">30 phút</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Mã hóa dữ liệu</span>
                        <Badge className="bg-green-500 text-white">AES-256</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>SSL Certificate</span>
                        <Badge className="bg-green-500 text-white">Valid</Badge>
                      </div>
                    </div>
                    <Button className="w-full">Cập nhật cài đặt bảo mật</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>💾 Backup & Khôi phục</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Backup cuối</span>
                        <span className="text-sm">Hôm nay, 02:00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Tần suất backup</span>
                        <span className="text-sm text-muted-foreground">Hàng ngày</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Dung lượng backup</span>
                        <span className="text-sm text-muted-foreground">1.2 GB</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Số bản backup</span>
                        <span className="text-sm text-muted-foreground">30 bản</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button className="w-full">Tạo backup ngay</Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        Khôi phục từ backup
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>📊 Monitoring & Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">99.9%</div>
                        <div className="text-sm text-muted-foreground">Uptime</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">127ms</div>
                        <div className="text-sm text-muted-foreground">Response time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">2.1GB</div>
                        <div className="text-sm text-muted-foreground">Storage used</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">45</div>
                        <div className="text-sm text-muted-foreground">Active users</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}