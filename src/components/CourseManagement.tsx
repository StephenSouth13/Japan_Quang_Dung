"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, Plus, Edit, Trash2, Eye, Calendar, Clock, Users, BookOpen, Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  price: number;
  original_price?: number;
  category: string;
  schedule: string;
  start_date: string;
  end_date: string;
  capacity: number;
  enrolled_count: number;
  teacher: string;
  status: "active" | "inactive" | "upcoming" | "completed";
  is_popular: boolean;
  image: string;
  created_at: Date;
}

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Course>>({
    title: "",
    description: "",
    level: "N5",
    duration: "",
    price: 0,
    original_price: undefined,
    category: "Khóa học cơ bản",
    schedule: "",
    start_date: "",
    end_date: "",
    capacity: 20,
    teacher: "",
    status: "upcoming",
    is_popular: false,
    image: "",
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/courses");
      const result = await response.json();
      console.log("API response:", result);
      if (result.success) {
        setCourses(result.data);
      } else {
        toast.error(result.error || "Có lỗi xảy ra khi tải danh sách khóa học");
      }
    } catch (error) {
      console.error("Fetch courses error:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách khóa học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price) || 0,
          original_price: formData.original_price ? Number(formData.original_price) : undefined,
          capacity: Number(formData.capacity) || 20,
          enrolled_count: 0,
          is_active: true,
        }),
      });
      const result = await response.json();
      if (result.success) {
        await fetchCourses();
        setIsCreateModalOpen(false);
        setFormData({
          title: "",
          description: "",
          level: "N5",
          duration: "",
          price: 0,
          original_price: undefined,
          category: "Khóa học cơ bản",
          schedule: "",
          start_date: "",
          end_date: "",
          capacity: 20,
          teacher: "",
          status: "upcoming",
          is_popular: false,
          image: "",
        });
        toast.success(result.message || "Tạo khóa học thành công!");
      } else {
        toast.error(result.error || "Có lỗi xảy ra khi tạo khóa học");
      }
    } catch (error) {
      console.error("Create course error:", error);
      toast.error("Có lỗi xảy ra khi tạo khóa học");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (updatedCourse: Course) => {
    try {
      setLoading(true);
      const response = await fetch("/api/courses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: updatedCourse.id,
          title: updatedCourse.title,
          description: updatedCourse.description,
          level: updatedCourse.level,
          price: Number(updatedCourse.price) || 0,
          original_price: Number(updatedCourse.original_price) || undefined,
          category: updatedCourse.category,
          schedule: updatedCourse.schedule,
          start_date: updatedCourse.start_date,
          end_date: updatedCourse.end_date,
          capacity: Number(updatedCourse.capacity) || 20,
          enrolled_count: Number(updatedCourse.enrolled_count) || 0,
          teacher: updatedCourse.teacher,
          status: updatedCourse.status,
          is_popular: updatedCourse.is_popular,
          image: updatedCourse.image,
          is_active: updatedCourse.status === "active" || updatedCourse.status === "upcoming",
        }),
      });
      const result = await response.json();
      if (result.success) {
        await fetchCourses();
        setSelectedCourse(null);
        toast.success(result.message || "Cập nhật khóa học thành công!");
      } else {
        toast.error(result.error || "Có lỗi xảy ra khi cập nhật khóa học");
      }
    } catch (error) {
      console.error("Update course error:", error);
      toast.error("Có lỗi xảy ra khi cập nhật khóa học");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses?id=${courseId}`, {
        method: "DELETE",
      });
      if (response.status === 204) {
        await fetchCourses();
        toast.success("Xóa khóa học thành công!");
        return;
      }
      const result = await response.json();
      if (result.success) {
        await fetchCourses();
        toast.success(result.message || "Xóa khóa học thành công!");
      } else {
        toast.error(result.error || "Có lỗi xảy ra khi xóa khóa học");
      }
    } catch (error) {
      console.error("Delete course error:", error);
      toast.error("Có lỗi xảy ra khi xóa khóa học");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.level.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-white">Đang diễn ra</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-500 text-white">Sắp diễn ra</Badge>;
      case "completed":
        return <Badge variant="secondary">Đã hoàn thành</Badge>;
      case "inactive":
        return <Badge variant="outline">Tạm dừng</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "N5":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "N4":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "N3":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "N2":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "N1":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const stats = {
    total: courses.length,
    active: courses.filter((c) => c.status === "active").length,
    upcoming: courses.filter((c) => c.status === "upcoming").length,
    totalStudents: courses.reduce((sum, c) => sum + c.enrolled_count, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý khóa học</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tạo khóa học mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tạo khóa học mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tên khóa học</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nhập tên khóa học..."
                  />
                </div>
                <div>
                  <Label>Cấp độ</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="N5">N5</SelectItem>
                      <SelectItem value="N4">N4</SelectItem>
                      <SelectItem value="N3">N3</SelectItem>
                      <SelectItem value="N2">N2</SelectItem>
                      <SelectItem value="N1">N1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Mô tả</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập mô tả khóa học..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Thời lượng</Label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="VD: 3 tháng"
                  />
                </div>
                <div>
                  <Label>Học phí (VNĐ)</Label>
                  <Input
                    type="number"
                    value={formData.price ?? 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
                    placeholder="VD: 2500000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Học phí gốc (VNĐ)</Label>
                  <Input
                    type="number"
                    value={formData.original_price ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, original_price: Number(e.target.value) || undefined })
                    }
                    placeholder="VD: 3000000"
                  />
                </div>
                <div>
                  <Label>Danh mục</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Khóa học cơ bản">Khóa học cơ bản</SelectItem>
                      <SelectItem value="Khóa học trung cấp">Khóa học trung cấp</SelectItem>
                      <SelectItem value="Khóa học cao cấp">Khóa học cao cấp</SelectItem>
                      <SelectItem value="Luyện thi">Luyện thi</SelectItem>
                      <SelectItem value="Giao tiếp">Giao tiếp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Lịch học</Label>
                <Input
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  placeholder="VD: Thứ 2, 4, 6 - 19:00-21:00"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ngày bắt đầu</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Ngày kết thúc</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Số học viên tối đa</Label>
                  <Input
                    type="number"
                    value={formData.capacity ?? 20}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) || 20 })}
                  />
                </div>
                <div>
                  <Label>Giáo viên</Label>
                  <Input
                    value={formData.teacher}
                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                    placeholder="VD: Sensei Yamada"
                  />
                </div>
              </div>
              <div>
                <Label>Hình ảnh (URL)</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Nhập URL hình ảnh..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_popular}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_popular: checked })}
                />
                <Label>Khóa học nổi bật</Label>
              </div>
              <Button onClick={handleCreateCourse} disabled={loading} className="w-full">
                {loading ? "Đang tạo..." : "Tạo khóa học"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng khóa học</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang diễn ra</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sắp diễn ra</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng học viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalStudents}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Đang diễn ra</SelectItem>
            <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
            <SelectItem value="completed">Đã hoàn thành</SelectItem>
            <SelectItem value="inactive">Tạm dừng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách khóa học ({filteredCourses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khóa học</TableHead>
                <TableHead>Cấp độ</TableHead>
                <TableHead>Giáo viên</TableHead>
                <TableHead>Học viên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium flex items-center space-x-2">
                          {course.title}
                          {course.is_popular && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                        </div>
                        <div className="text-sm text-muted-foreground">{course.duration}</div>
                        <div className="text-sm font-medium text-primary">
                          {typeof course.price === "number" && !isNaN(course.price)
                            ? course.price.toLocaleString()
                            : "0"}{" "}
                          VNĐ
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                  </TableCell>
                  <TableCell>{course.teacher}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">{course.enrolled_count}/{course.capacity}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(course.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedCourse(course)}>
                            <Eye className="h-3 w-3 mr-1" />
                            Xem
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Chi tiết khóa học</DialogTitle>
                          </DialogHeader>
                          {selectedCourse && (
                            <div className="space-y-4">
                              <div className="flex items-start space-x-4">
                                <img
                                  src={selectedCourse.image}
                                  alt={selectedCourse.title}
                                  className="w-24 h-24 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{selectedCourse.title}</h3>
                                  <p className="text-muted-foreground">{selectedCourse.description}</p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Badge className={getLevelColor(selectedCourse.level)}>
                                      {selectedCourse.level}
                                    </Badge>
                                    {selectedCourse.is_popular && (
                                      <Badge className="bg-yellow-500 text-white">
                                        <Star className="w-3 h-3 mr-1" />
                                        Nổi bật
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Danh mục</label>
                                  <p>{selectedCourse.category}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Thời lượng</label>
                                  <p>{selectedCourse.duration}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Học phí</label>
                                  <p className="font-semibold text-primary">
                                    {typeof selectedCourse.price === "number" && !isNaN(selectedCourse.price)
                                      ? selectedCourse.price.toLocaleString()
                                      : "0"}{" "}
                                    VNĐ
                                    {typeof selectedCourse.original_price === "number" &&
                                      !isNaN(selectedCourse.original_price) && (
                                        <span className="text-sm text-muted-foreground line-through ml-2">
                                          {selectedCourse.original_price.toLocaleString()} VNĐ
                                        </span>
                                      )}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Giáo viên</label>
                                  <p>{selectedCourse.teacher}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Lịch học</label>
                                  <p>{selectedCourse.schedule}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Học viên</label>
                                  <p>{selectedCourse.enrolled_count}/{selectedCourse.capacity}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Ngày bắt đầu</label>
                                  <p>
                                    {selectedCourse.start_date
                                      ? new Date(selectedCourse.start_date).toLocaleDateString("vi-VN")
                                      : "Chưa xác định"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Ngày kết thúc</label>
                                  <p>
                                    {selectedCourse.end_date
                                      ? new Date(selectedCourse.end_date).toLocaleDateString("vi-VN")
                                      : "Chưa xác định"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Dialog open={selectedCourse !== null} onOpenChange={() => setSelectedCourse(null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedCourse(course)}>
                            <Edit className="h-3 w-3 mr-1" />
                            Sửa
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chỉnh sửa khóa học: {selectedCourse?.title}</DialogTitle>
                          </DialogHeader>
                          {selectedCourse && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Tên khóa học</Label>
                                  <Input
                                    value={selectedCourse.title}
                                    onChange={(e) =>
                                      setSelectedCourse({ ...selectedCourse, title: e.target.value })
                                    }
                                    placeholder="Nhập tên khóa học..."
                                  />
                                </div>
                                <div>
                                  <Label>Cấp độ</Label>
                                  <Select
                                    value={selectedCourse.level}
                                    onValueChange={(value) => setSelectedCourse({ ...selectedCourse, level: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="N5">N5</SelectItem>
                                      <SelectItem value="N4">N4</SelectItem>
                                      <SelectItem value="N3">N3</SelectItem>
                                      <SelectItem value="N2">N2</SelectItem>
                                      <SelectItem value="N1">N1</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div>
                                <Label>Mô tả</Label>
                                <Textarea
                                  value={selectedCourse.description}
                                  onChange={(e) =>
                                    setSelectedCourse({ ...selectedCourse, description: e.target.value })
                                  }
                                  placeholder="Nhập mô tả khóa học..."
                                  rows={3}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Thời lượng</Label>
                                  <Input
                                    value={selectedCourse.duration}
                                    onChange={(e) =>
                                      setSelectedCourse({ ...selectedCourse, duration: e.target.value })
                                    }
                                    placeholder="VD: 3 tháng"
                                  />
                                </div>
                                <div>
                                  <Label>Học phí (VNĐ)</Label>
                                  <Input
                                    type="number"
                                    value={selectedCourse.price ?? 0}
                                    onChange={(e) =>
                                      setSelectedCourse({ ...selectedCourse, price: Number(e.target.value) || 0 })
                                    }
                                    placeholder="VD: 2500000"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Học phí gốc (VNĐ)</Label>
                                  <Input
                                    type="number"
                                    value={selectedCourse.original_price ?? ""}
                                    onChange={(e) =>
                                      setSelectedCourse({
                                        ...selectedCourse,
                                        original_price: Number(e.target.value) || undefined,
                                      })
                                    }
                                    placeholder="VD: 3000000"
                                  />
                                </div>
                                <div>
                                  <Label>Danh mục</Label>
                                  <Select
                                    value={selectedCourse.category}
                                    onValueChange={(value) => setSelectedCourse({ ...selectedCourse, category: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Khóa học cơ bản">Khóa học cơ bản</SelectItem>
                                      <SelectItem value="Khóa học trung cấp">Khóa học trung cấp</SelectItem>
                                      <SelectItem value="Khóa học cao cấp">Khóa học cao cấp</SelectItem>
                                      <SelectItem value="Luyện thi">Luyện thi</SelectItem>
                                      <SelectItem value="Giao tiếp">Giao tiếp</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div>
                                <Label>Lịch học</Label>
                                <Input
                                  value={selectedCourse.schedule}
                                  onChange={(e) =>
                                    setSelectedCourse({ ...selectedCourse, schedule: e.target.value })
                                  }
                                  placeholder="VD: Thứ 2, 4, 6 - 19:00-21:00"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Ngày bắt đầu</Label>
                                  <Input
                                    type="date"
                                    value={selectedCourse.start_date}
                                    onChange={(e) =>
                                      setSelectedCourse({ ...selectedCourse, start_date: e.target.value })
                                    }
                                  />
                                </div>
                                <div>
                                  <Label>Ngày kết thúc</Label>
                                  <Input
                                    type="date"
                                    value={selectedCourse.end_date}
                                    onChange={(e) =>
                                      setSelectedCourse({ ...selectedCourse, end_date: e.target.value })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Số học viên tối đa</Label>
                                  <Input
                                    type="number"
                                    value={selectedCourse.capacity ?? 20}
                                    onChange={(e) =>
                                      setSelectedCourse({ ...selectedCourse, capacity: Number(e.target.value) || 20 })
                                    }
                                  />
                                </div>
                                <div>
                                  <Label>Giáo viên</Label>
                                  <Input
                                    value={selectedCourse.teacher}
                                    onChange={(e) =>
                                      setSelectedCourse({ ...selectedCourse, teacher: e.target.value })
                                    }
                                    placeholder="VD: Sensei Yamada"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label>Hình ảnh (URL)</Label>
                                <Input
                                  value={selectedCourse.image}
                                  onChange={(e) =>
                                    setSelectedCourse({ ...selectedCourse, image: e.target.value })
                                  }
                                  placeholder="Nhập URL hình ảnh..."
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={selectedCourse.is_popular}
                                  onCheckedChange={(checked) =>
                                    setSelectedCourse({ ...selectedCourse, is_popular: checked })
                                  }
                                />
                                <Label>Khóa học nổi bật</Label>
                              </div>
                              <Button
                                onClick={() => handleUpdateCourse(selectedCourse)}
                                disabled={loading}
                                className="w-full"
                              >
                                {loading ? "Đang cập nhật..." : "Cập nhật khóa học"}
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCourse(course.id)}
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
          {filteredCourses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">Không tìm thấy khóa học nào</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}