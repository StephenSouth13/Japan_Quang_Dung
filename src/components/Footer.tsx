import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Youtube, Instagram } from "lucide-react";
import { DemoSetup } from "./DemoSetup";

export function Footer() {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyMjAsMzgsMzgsMC4xKSIvPgogIDwvZz4KPC9zdmc+')] opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                桜
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  日本語センター Quang Dũng
                </h3>
                <p className="text-white/60 text-sm">Academy of Japanese Language</p>
              </div>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed text-lg">
              Trung tâm tiếng Nhật hàng đầu Việt Nam với hơn 15 năm kinh nghiệm. 
              Chúng tôi cam kết mang đến chất lượng giáo dục tốt nhất cho học viên.
            </p>
            <div className="flex gap-4">
              <button className="w-12 h-12 bg-white/10 hover:bg-primary/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <Facebook className="w-5 h-5 group-hover:text-blue-400" />
              </button>
              <button className="w-12 h-12 bg-white/10 hover:bg-primary/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <Youtube className="w-5 h-5 group-hover:text-red-400" />
              </button>
              <button className="w-12 h-12 bg-white/10 hover:bg-primary/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <Instagram className="w-5 h-5 group-hover:text-pink-400" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Liên kết nhanh</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => navigate('/')}
                  className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center"
                >
                  → Trang chủ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/courses')}
                  className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center"
                >
                  → Khóa học
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/about')}
                  className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center"
                >
                  → Giới thiệu
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/contact')}
                  className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center"
                >
                  → Liên hệ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Thông tin liên hệ</h4>
            <div className="space-y-4 text-white/80">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p>2B Hoàng Ngọc Phách - P. Phú Thọ Hòa - Q. Tân Phú - TP.HCM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <p>Mr. Triệu - Giám đốc chương trình: (+84) 901 189 399</p>
                <p>Mr. Hưng - Thư ký chương trình & CSKH: (+84) 939 734 210</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <p>otori.agimi@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4">
            <p className="text-white/60 text-center md:text-left">
              © 2024 Trung tâm tiếng Nhật Quang Dũng. Tất cả quyền được bảo lưu.
            </p>
            <DemoSetup />
          </div>
          <div className="flex gap-8 mt-4 md:mt-0">
            <button 
              onClick={() => navigate('/debug')}
              className="text-white/60 hover:text-white transition-colors text-xs"
            >
              🔧 Debug
            </button>
            <button className="text-white/60 hover:text-white transition-colors">
              Chính sách bảo mật
            </button>
            <button className="text-white/60 hover:text-white transition-colors">
              Điều khoản sử dụng
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
