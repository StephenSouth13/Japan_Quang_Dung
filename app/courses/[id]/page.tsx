import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, BookOpen, DollarSign, Calendar, User } from "lucide-react";
import { CourseRegistrationModal } from "@/components/CourseRegistrationModal";

async function getCourse(id: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/courses?id=${id}`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch course");
    }
    const data = await res.json();
    if (!data.success || !data.data) {
      return null;
    }
    return data.data;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);
  if (!course) {
    return {
      title: "Khóa học không tìm thấy",
      description: "Không tìm thấy thông tin khóa học.",
    };
  }
  return {
    title: course.title,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);

  if (!course) {
    notFound();
  }

  // Giả lập lộ trình học từ description
  const curriculum = course.description.split('.').map((item: string) => item.trim()).filter(Boolean);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-red-50/30 dark:from-background dark:to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Thông tin chính */}
          <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl">{course.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {course.level}
                </Badge>
                <Badge>{course.category}</Badge>
                {course.is_popular && <Badge className="bg-yellow-500">Phổ biến</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                <img
                  src={course.image || "https://via.placeholder.com/800x400"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/800x400")}
                />
              </div>
              <p className="text-muted-foreground leading-relaxed">{course.description}</p>
            </CardContent>
          </Card>

          {/* Lộ trình học */}
          <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle>Lộ trình học</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {curriculum.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-1">
                      {index + 1}
                    </Badge>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Thời gian và giảng viên */}
          <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle>Thời gian và giảng viên</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Lịch học: {course.schedule || "Chưa xác định"}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Bắt đầu: {course.start_date || "Chưa xác định"}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Kết thúc: {course.end_date || "Chưa xác định"}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Giảng viên: {course.teacher || "Chưa xác định"}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Sĩ số: {course.enrolled_count}/{course.capacity}
              </div>
            </CardContent>
          </Card>

          {/* Học phí */}
          <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle>Học phí</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <span className="text-3xl font-bold text-primary">
                  {Number(course.price).toLocaleString("vi-VN")} VNĐ
                </span>
                {course.original_price && (
                  <p className="text-muted-foreground line-through">
                    {Number(course.original_price).toLocaleString("vi-VN")} VNĐ
                  </p>
                )}
              </div>
              <CourseRegistrationModal course={course}>
                <Button className="w-full bg-gradient-to-r from-primary via-pink-600 to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white">
                  Đăng ký ngay
                </Button>
              </CourseRegistrationModal>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}