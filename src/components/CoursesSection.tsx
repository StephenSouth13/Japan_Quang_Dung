
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Clock, Users, BookOpen, Search, Filter, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CourseRegistrationModal } from "./CourseRegistrationModal";

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  price: string;
  students: string;
  image: string;
  features: string[];
  schedule?: string;
  status?: string;
  is_popular?: boolean;
  duration?: string; // Add this line
}

export function CoursesSection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/courses${selectedLevel !== "all" ? `?level=${selectedLevel}` : ""}`,
          { cache: 'no-store' }
        );
        console.log("API Response:", response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Data:", data);
        if (data.success) {
          const formattedCourses = data.data.map((course: any) => ({
         id: Number(course.id), // Change to convert to number
            title: course.title,
            description: course.description || "Chưa có mô tả",
            level: course.level,
            price: Number(course.price).toLocaleString("vi-VN"),
            students: course.enrolled_count.toString(),
            image: course.image || "https://via.placeholder.com/300",
            features: course.features || ["Học trực tuyến", "Hỗ trợ 24/7", "Tài liệu miễn phí"],
            schedule: course.schedule || "Không xác định",
            status: course.status,
            is_popular: course.is_popular,
          }));
          setCourses(formattedCourses);
        } else {
          console.error("Lỗi từ API:", data.error);
          toast.error(data.error || "Có lỗi xảy ra khi tải danh sách khóa học");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        toast.error("Có lỗi xảy ra khi tải danh sách khóa học");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedLevel]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.features.some((feature: string) =>
        feature.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const priceNum = parseInt(course.price.replace(/\./g, ""));
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && priceNum < 3000000) ||
      (priceRange === "medium" && priceNum >= 3000000 && priceNum < 5000000) ||
      (priceRange === "high" && priceNum >= 5000000);

    return matchesSearch && matchesPrice;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseInt(a.price.replace(/\./g, "")) - parseInt(b.price.replace(/\./g, ""));
      case "price-high":
        return parseInt(b.price.replace(/\./g, "")) - parseInt(a.price.replace(/\./g, ""));
      case "popular":
      default:
        return parseInt(b.students) - parseInt(a.students);
    }
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLevel("all");
    setPriceRange("all");
    setSortBy("popular");
  };

  return (
    <section
      id="courses"
      className="py-20 bg-gradient-to-br from-background via-red-50/20 to-pink-50/30 dark:from-background dark:via-background dark:to-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Khóa học
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Chương trình học đa dạng
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Từ cơ bản đến nâng cao, chúng tôi có các khóa học phù hợp với mọi trình độ và mục tiêu học tập
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Lọc:</span>
            </div>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trình độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trình độ</SelectItem>
                <SelectItem value="N5">N5</SelectItem>
                <SelectItem value="N4">N4</SelectItem>
                <SelectItem value="N3">N3</SelectItem>
                <SelectItem value="N2">N2</SelectItem>
                <SelectItem value="N1">N1</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Mức giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả mức giá</SelectItem>
                <SelectItem value="low">Dưới 3 triệu</SelectItem>
                <SelectItem value="medium">3-5 triệu</SelectItem>
                <SelectItem value="high">Trên 5 triệu</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Phổ biến nhất</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={clearFilters}>
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Xóa bộ lọc
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {loading ? "Đang tải..." : `Tìm thấy ${filteredCourses.length} khóa học phù hợp`}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Đang tải danh sách khóa học...</p>
            </div>
          ) : sortedCourses.length > 0 ? (
            sortedCourses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm group"
              >
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <Badge className="absolute top-4 left-4 bg-card/90 text-foreground border-0 shadow-lg">
                    {course.level}
                  </Badge>
                  <div className="absolute top-4 right-4 w-10 h-10 bg-card/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                    {course.title}
                  </CardTitle>
                  <p className="text-muted-foreground line-clamp-2">{course.description}</p>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {course.schedule}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {course.students} học viên
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Nội dung chính:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {course.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-border/50">
                      <div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
                          {course.price}
                        </span>
                        <span className="text-muted-foreground font-medium"> VNĐ</span>
                      </div>
                      <CourseRegistrationModal course ={course}>
                        <Button className="bg-gradient-to-r from-primary to-pink-600 hover:from-primary/90 hover:to-pink-600/90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                          Đăng ký ngay
                        </Button>
                      </CourseRegistrationModal>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Không tìm thấy khóa học</h3>
              <p className="text-muted-foreground mb-4">
                Không có khóa học nào phù hợp với tiêu chí tìm kiếm của bạn
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Xóa bộ lọc và xem tất cả
              </Button>
            </div>
          )}
        </div>

        <div className="text-center mt-16">
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-4 border-2 hover:bg-primary/5 hover:border-primary/50 transform hover:scale-105 transition-all duration-200"
            onClick={() => router.push("/courses")}
          >
            Xem tất cả khóa học
          </Button>
        </div>
      </div>
    </section>
  );
}
