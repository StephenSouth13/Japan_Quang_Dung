import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Quote, Star, Award } from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

const teachers = [
  {
    id: 1,
    name: "Sensei Tanaka Hiroshi",
    position: "Giám đốc học thuật",
    speciality: "JLPT N5-N1, Văn hóa Nhật",
    experience: "15 năm",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMG1hbiUyMHRlYWNoZXJ8ZW58MXx8fHwxNzU3NzUzOTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Với hơn 15 năm kinh nghiệm giảng dạy, Sensei Tanaka đã đào tạo hàng nghìn học viên Việt Nam đạt chứng chỉ JLPT và thành công trong công việc tại Nhật Bản.",
    achievements: ["Thạc sĩ Ngôn ngữ học Nhật Bản", "Chứng chỉ giảng dạy quốc tế", "Tác giả 3 cuốn sách tiếng Nhật"],
  },
  {
    id: 2,
    name: "Sensei Yamamoto Yuki",
    position: "Giáo viên chính",
    speciality: "Giao tiếp kinh doanh, Keigo",
    experience: "10 năm",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHdvbWFuJTIwdGVhY2hlcnxlbnwxfHx8fDE3NTc3NTM5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Chuyên gia về tiếng Nhật kinh doanh và văn hóa công sở Nhật Bản. Sensei Yuki từng làm việc tại nhiều tập đoàn lớn trước khi chuyển sang giảng dạy.",
    achievements: ["MBA tại Nhật Bản", "10 năm kinh nghiệm doanh nghiệp", "Chuyên gia văn hóa công sở"],
  },
  {
    id: 3,
    name: "Sensei Nakamura Akiko",
    position: "Giáo viên JLPT",
    speciality: "Luyện thi JLPT N3-N1",
    experience: "8 năm",
    image:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1Nzc1Mzk3MXww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Chuyên gia luyện thi JLPT với tỷ lệ học viên đậu cao nhất tại trung tâm. Sensei Akiko có phương pháp độc đáo giúp học viên nhanh chóng nâng cao trình độ.",
    achievements: ["Thống kê 98% học viên đậu JLPT", "Chuyên gia phương pháp học", "Nghiên cứu sư ngôn ngữ học"],
  },
]

const testimonials = [
  {
    name: "Nguyễn Văn An",
    course: "N3 Business",
    content:
      "Nhờ các Sensei tại Quang Dũng mà em đã có thể làm việc tại Tokyo. Phương pháp giảng dạy rất thực tế và gần gũi.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbWFufGVufDF8fHx8MTc1Nzc1Mzk3MXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Trần Thị Mai",
    course: "N2 JLPT",
    content: "Các thầy cô rất tận tình và kiên nhẫn. Em đã đậu N2 chỉ sau 6 tháng học tại đây.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwd29tYW58ZW58MXx8fHwxNzU3NzUzOTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Lê Minh Tuấn",
    course: "Business Japanese",
    content: "Khóa học kinh doanh giúp em tự tin giao tiếp với đối tác Nhật và thăng tiến trong công việc.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXNpYW58ZW58MXx8fHwxNzU3NzUzOTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
]

export function TeachersSection() {
  return (
    <section id="teachers" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Đội ngũ giáo viên
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Học cùng các Sensei hàng đầu</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Đội ngũ giáo viên bản ngữ giàu kinh nghiệm, tận tâm và luôn đồng hành cùng học viên trên con đường chinh
            phục tiếng Nhật
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <ImageWithFallback
                  src={teacher.image || "/placeholder.svg"}
                  alt={teacher.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-primary-foreground">{teacher.experience}</Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{teacher.name}</h3>
                    <p className="text-primary font-medium">{teacher.position}</p>
                    <p className="text-sm text-muted-foreground">{teacher.speciality}</p>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">{teacher.description}</p>

                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      Thành tựu:
                    </h4>
                    <ul className="space-y-1">
                      {teacher.achievements.map((achievement, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="bg-muted/30 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">Học viên nói gì về các Sensei?</h3>
            <p className="text-muted-foreground">Những chia sẻ chân thực từ các học viên đã thành công</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-background">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <Quote className="w-8 h-8 text-primary/20" />

                    <p className="text-muted-foreground italic leading-relaxed">"{testimonial.content}"</p>

                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <ImageWithFallback
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.course}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <h3 className="text-xl font-bold text-foreground mb-4">Bạn muốn học trực tiếp với các Sensei?</h3>
          <p className="text-muted-foreground mb-6">
            Đăng ký tư vấn miễn phí để được Sensei phù hợp nhất tư vấn khóa học cho bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Đăng ký tư vấn miễn phí
            </a>
            <a
              href="#courses"
              className="inline-flex items-center justify-center px-6 py-3 border border-border bg-background text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              Xem các khóa học
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
