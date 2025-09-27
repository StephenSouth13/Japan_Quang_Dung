import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Địa chỉ",
    content: "123 Nguyễn Huệ, Quận 1, TP.HCM"
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: "Điện thoại",
    content: "(028) 3825 1234"
  },
  {
    icon: <Mail className="w-5 h-5" />,
    title: "Email",
    content: "info@Quang Dũng-center.vn"
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Giờ làm việc",
    content: "8:00 - 21:00 (Thứ 2 - CN)"
  }
];

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call - In real app, you would send to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24h.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        course: "",
        message: ""
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Liên hệ</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Bắt đầu hành trình học tiếng Nhật
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Liên hệ với chúng tôi để được tư vấn miễn phí và đăng ký khóa học phù hợp
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Thông tin liên hệ</h3>
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  {info.icon}
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">{info.title}</h4>
                  <p className="text-muted-foreground">{info.content}</p>
                </div>
              </div>
            ))}
            
            <div className="pt-6">
              <h4 className="font-medium text-foreground mb-4">Theo dõi chúng tôi</h4>
              <div className="flex gap-4">
                <Button variant="outline" size="sm">Facebook</Button>
                <Button variant="outline" size="sm">YouTube</Button>
                <Button variant="outline" size="sm">Instagram</Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Gửi tin nhắn cho chúng tôi</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Họ và tên <span className="text-destructive">*</span>
                      </label>
                      <Input 
                        id="name" 
                        placeholder="Nhập họ và tên"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Số điện thoại
                      </label>
                      <Input 
                        id="phone" 
                        placeholder="Nhập số điện thoại"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Nhập địa chỉ email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="course" className="block text-sm font-medium text-foreground mb-2">
                      Khóa học quan tâm
                    </label>
                    <select 
                      id="course"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      value={formData.course}
                      onChange={(e) => handleInputChange("course", e.target.value)}
                    >
                      <option value="">Chọn khóa học</option>
                      <option value="n5">Tiếng Nhật cơ bản (N5)</option>
                      <option value="n4-n3">Tiếng Nhật trung cấp (N4-N3)</option>
                      <option value="business">Giao tiếp kinh doanh</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Tin nhắn <span className="text-destructive">*</span>
                    </label>
                    <Textarea 
                      id="message" 
                      placeholder="Nhập câu hỏi hoặc yêu cầu tư vấn..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-16">
          <Card>
            <CardContent className="p-0">
              <div className="bg-muted/50 h-64 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Bản đồ vị trí trung tâm</p>
                  <p className="text-sm text-muted-foreground">123 Nguyễn Huệ, Quận 1, TP.HCM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
