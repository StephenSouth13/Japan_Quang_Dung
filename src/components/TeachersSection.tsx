import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Quote, Star, Award } from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

const teachers = [
  {
    id: 1,
    name: "Thầy Nguyễn Quang Triệu",
    position: "Giám đốc chương trình, giáo viên",
    speciality: "Luyện thi JLPT, Văn hóa Nhật",
    experience: "6 năm",
    image:
      "https://images.unsplash.com/photo-1599305445671-ac291c9a834f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHByb2Zlc3NvciUyMHBvcnRyYWl0fGVufDF8fHx8MTcyMjIzNDQ2NHww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Với kinh nghiệm 6 năm, thầy Triệu đã giúp hàng trăm học viên chinh phục tiếng Nhật. Thầy còn là nhà sáng lập TNQDO.",
    achievements: [
      "JLPT N2",
      "Cử nhân Đại học Hoa Sen, chuyên ngành PR",
      "Thực tập Biên tập viên tại Báo Tuổi Trẻ",
      "Biên dịch viên manga, anime (Evangelion)",
    ],
  },
  {
    id: 2,
    name: "Thầy Lê Đình Tân",
    position: "Giáo viên",
    speciality: "Giao tiếp, tiếng Nhật thương mại",
    experience: "2 năm",
    image:
      "https://images.unsplash.com/photo-1520330138959-1e43e915f3e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHByb2Zlc3NvciUyMHJlbGF4ZWQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3MjIyMzQ0NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Thầy Tân được đào tạo nghiệp vụ chuyên nghiệp, có kinh nghiệm làm việc tại các công ty Nhật Bản, mang đến những bài học thực tế.",
    achievements: [
      "JLPT N2",
      "Được đào tạo Nghiệp vụ dạy tiếng Nhật chuyên nghiệp",
      "Làm việc tại Công ty TNHH Hyogo Shoes",
    ],
  },
  {
    id: 3,
    name: "Cô Phạm Thùy Tường Vy",
    position: "Trợ giảng",
    speciality: "Tiếng Nhật sơ cấp, giao tiếp",
    experience: "1 năm",
    image:
      "https://images.unsplash.com/photo-1544717297-fa95b606d0a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdGVhY2hlciUyMHBvcnRyYWl0fGVufDF8fHx8MTcyMjIzNDQ2NHww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Cô Vy có kinh nghiệm giao tiếp với nhiều khách hàng quốc tế, giúp học viên rèn luyện khả năng nói và nghe tự tin hơn.",
    achievements: [
      "JLPT N5",
      "Được đào tạo Nghiệp vụ dạy tiếng Nhật chuyên nghiệp",
      "Kinh nghiệm phục vụ khách hàng người Nhật, Hàn, Trung",
    ],
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
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxzdHVkZW50JTIwd29tYW58ZW58MXx8fHwxNzU3NzUzOTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Lê Minh Tuấn",
    course: "Business Japanese",
    content: "Khóa học kinh doanh giúp em tự tin giao tiếp với đối tác Nhật và thăng tiến trong công việc.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxzdHVkZW50JTIwYXNpYW58ZW58MXx8fHwxNzU3NzUzOTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
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
                  <Badge className="bg-primary text-primary-foreground">{teacher.experience} kinh nghiệm</Badge>
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