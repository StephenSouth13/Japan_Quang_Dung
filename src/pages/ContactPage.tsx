import { ContactSection } from '../components/ContactSection';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Sẵn sàng hỗ trợ bạn trên hành trình học tiếng Nhật. 
            Liên hệ ngay để được tư vấn miễn phí!
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Địa Chỉ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  123 Nguyễn Huệ, Quận 1<br />
                  TP. Hồ Chí Minh
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Phone className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Điện Thoại</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  +84 123 456 789<br />
                  +84 987 654 321
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Mail className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  info@japancenter.edu.vn<br />
                  support@japancenter.edu.vn
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Giờ Làm Việc</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  T2 - T6: 8:00 - 20:00<br />
                  T7 - CN: 8:00 - 17:00
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactSection />

      {/* Map Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-red-50/30 dark:from-background dark:to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Vị Trí Trung Tâm</h2>
          <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.456967240736!2d106.69971731533519!3d10.77708229232894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1c06f4e1dd%3A0x43900f1d4539a3d!2zTmd1eeG7hW4gSHXhur8sIEJlbiBOZ2hpLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaWV0bmFt!5e0!3m2!1svi!2s!4v1640995200000!5m2!1svi!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vị trí Trung tâm Quang Dũng"
            />
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <Card className="text-center bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <MapPin className="w-8 h-8 mx-auto text-primary mb-3" />
                <h3 className="font-bold mb-2">Cơ sở chính</h3>
                <p className="text-muted-foreground text-sm">
                  123 Nguyễn Huệ, Quận 1<br />
                  TP. Hồ Chí Minh
                </p>
              </CardContent>
            </Card>
            <Card className="text-center bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <MapPin className="w-8 h-8 mx-auto text-primary mb-3" />
                <h3 className="font-bold mb-2">Chi nhánh 1</h3>
                <p className="text-muted-foreground text-sm">
                  456 Lê Lợi, Quận 3<br />
                  TP. Hồ Chí Minh
                </p>
              </CardContent>
            </Card>
            <Card className="text-center bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <MapPin className="w-8 h-8 mx-auto text-primary mb-3" />
                <h3 className="font-bold mb-2">Chi nhánh 2</h3>
                <p className="text-muted-foreground text-sm">
                  789 Hai Bà Trưng, Quận 1<br />
                  TP. Hồ Chí Minh
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
