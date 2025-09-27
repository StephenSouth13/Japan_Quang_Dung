# Trung Tâm Tiếng Nhật Quang Dũng - Hướng Dẫn Sử Dụng Website

## 🌸 Giới Thiệu

Website Trung tâm Tiếng Nhật Quang Dũng là nền tảng học tập toàn diện với hệ thống quản lý khóa học, bài kiểm tra online, blog học tập và dashboard theo vai trò người dùng.

## 🎯 Tính Năng Chính

### 1. **Multi-page Navigation System**
- **Trang chủ** (`/`): Giới thiệu tổng quan, tính năng nổi bật, blog nổi bật
- **Khóa học** (`/courses`): Danh sách khóa học với tìm kiếm và lọc
- **Blog** (`/blog`): Blog học tiếng Nhật với các bài viết hữu ích theo chủ đề
- **Giới thiệu** (`/about`): Câu chuyện, giá trị cốt lõi, timeline phát triển
- **Liên hệ** (`/contact`): Form liên hệ, bản đồ, thông tin chi nhánh

### 2. **Theme System & UI Enhancement**
- **Dark/Light Mode Toggle**: Chuyển đổi giao diện sáng/tối mượt mà
- **Auto Theme Detection**: Tự động phát hiện theme hệ thống
- **Persistent Theme**: Lưu preference theme của người dùng
- **Back to Top Button**: Nút cuộn về đầu trang với animation
- **Smooth Transitions**: Hiệu ứng chuyển đổi mượt mà cho tất cả elements

### 3. **Hệ Thống Xác Thực & Phân Quyền**

#### **4 Vai Trò Người Dùng:**

**🔴 Admin** (`/admin`)
- Quản lý tất cả đăng ký khóa học
- Xác nhận thanh toán
- **Quản lý blog**: Thêm/sửa/xóa bài viết, phân loại theo chủ đề, theo dõi lượt xem
- Tạo và quản lý quiz/bài kiểm tra
- Quản lý phân quyền người dùng
- Thống kê toàn diện hệ thống

**🟡 Teacher** (`/teacher`)
- Tạo và quản lý quiz cho học viên
- Xem kết quả bài kiểm tra của tất cả học viên
- Thống kê hiệu suất học tập
- Dashboard giáo viên chuyên biệt

**🟢 Student** (`/student`)
- Làm bài kiểm tra và quiz online
- Xem kết quả cá nhân và lịch sử học tập
- Dashboard học viên cá nhân
- Đăng ký khóa học

**🔵 Guest**
- Xem thông tin khóa học và trang chủ
- Đăng ký tài khoản mới (tự động là Student)
- Không thể truy cập dashboard hoặc làm quiz

### 4. **Hệ Thống Quiz & Kiểm Tra**

#### **Loại Câu Hỏi Hỗ Trợ:**
- **Trắc nghiệm**: Multiple choice với 4 lựa chọn
- **Điền từ**: Fill in the blank
- **Tự luận**: Câu hỏi mở cần viết đoạn văn
- **Nghe**: Audio-based questions
- **Nối từ**: Matching exercises

#### **Tính Năng Quiz:**
- Timer đếm ngược
- Tự động nộp bài khi hết giờ
- Scoring system thông minh
- Lưu kết quả vào database
- Review đáp án sau khi hoàn thành

### 5. **Hệ Thống Blog Học Tập**

#### **Nội Dung Blog Phong Phú:**
- **Ngữ pháp**: Giải thích chi tiết các điểm ngữ pháp từ cơ bản đến nâng cao
- **Từ vựng**: Học từ vựng theo chủ đề, từ vựng thông dụng
- **Văn hóa**: Tìm hiểu văn hóa, phong tục Nhật Bản
- **JLPT**: Tips và chiến lược luyện thi JLPT các cấp độ
- **Hội thoại**: Mẫu câu giao tiếp hàng ngày
- **Kanji**: Cách học và ghi nhớ chữ Kanji hiệu quả

#### **Tính Năng Blog:**
- **Phân loại theo chủ đề**: Dễ dàng tìm kiếm bài viết theo nhu cầu
- **Tìm kiếm nâng cao**: Filter theo cấp độ, chủ đề, độ khó
- **Đánh giá bài viết**: Hệ thống like và comment
- **Chia sẻ xã hội**: Chia sẻ bài viết lên mạng xã hội

#### **Quản Lý Admin:**
- **Thêm/sửa/xóa bài viết** với editor WYSIWYG
- **Phân loại và tag**: Quản lý chủ đề và từ khóa
- **Theo dõi thống kê**: Lượt xem, lượt thích, bình luận
- **Lên lịch đăng bài**: Schedule posts cho tương lai

### 6. **Hệ Thống Đăng Ký Khóa Học**
- Form đăng ký chi tiết
- Tích hợp thanh toán chuyển khoản ngân hàng
- Tạo mã đăng ký unique
- Email xác nhận (sẽ được tích hợp)
- Quản lý trạng thái đăng ký

## 🚀 Hướng Dẫn Sử Dụng

### **Cho Học Viên (Student):**

1. **Đăng ký tài khoản:**
   - Nhấn "Đăng nhập" → "Đăng ký"
   - Điền thông tin: email, mật khẩu, họ tên
   - Tự động được gán vai trò Student

2. **Làm bài kiểm tra:**
   - Đăng nhập → Student Dashboard
   - Chọn quiz có sẵn từ danh sách
   - Đọc hướng dẫn và nhấn "Bắt đầu"
   - Hoàn thành trong thời gian cho phép
   - Xem kết quả ngay sau khi nộp

3. **Đăng ký khóa học:**
   - Vào trang Khóa học
   - Chọn khóa học phù hợp
   - Điền form đăng ký đầy đủ
   - Chuyển khoản theo hướng dẫn
   - Chờ admin xác nhận

### **Cho Giáo Viên (Teacher):**

1. **Tạo quiz:**
   - Teacher Dashboard → Tab "Quản lý Quiz"
   - "Tạo Quiz Mới"
   - Nhập thông tin: tiêu đề, mô tả, thời gian
   - Thêm câu hỏi từng loại
   - Lưu và kích hoạt

2. **Xem kết quả:**
   - Tab "Kết quả Quiz"
   - Xem thống kê chi tiết
   - Phân tích hiệu suất học viên

### **Cho Admin:**

1. **Quản lý đăng ký:**
   - Admin Dashboard → Tab "Đăng ký"
   - Xem danh sách đăng ký
   - Xác nhận thanh toán
   - Cập nhật trạng thái

2. **Quản lý phân quyền:**
   - Tab "Phân quyền"
   - Thay đổi role của user
   - Tạo tài khoản cho staff

## 🎨 Design System

### **Color Palette:**
- **Primary**: #dc2626 (Red) - Màu chủ đạo Nhật Bản
- **Secondary**: #fef2f2 (Light Red) - Background nhẹ
- **Accent**: #fee2e2 (Pink) - Highlights
- **Quang Dũng**: #ffb7c5 - Theme hoa anh đào

### **Typography:**
- **Headings**: Font weight 500-700
- **Body**: Font weight 400
- **Base size**: 16px
- Smooth scrolling và transitions

### **Components:**
- Glass morphism effects
- Gradient backgrounds
- Hover animations
- Backdrop blur
- Shadow elevations

## 🔧 Technical Stack

### **Frontend:**
- **React** with TypeScript
- **Tailwind CSS v4.0** for styling
- **Shadcn/ui** component library
- **Lucide React** for icons
- **Motion/React** for animations

### **Backend:**
- **Supabase** Database & Auth
- **Supabase Edge Functions** với Hono
- **Key-Value Store** cho data persistence

### **Architecture:**
\`\`\`
Frontend (React) → Server (Hono) → Database (Supabase)
\`\`\`

## 📱 Responsive Design

Website được tối ưu cho tất cả thiết bị:
- **Desktop**: Full features, multi-column layouts
- **Tablet**: Adaptive grid systems
- **Mobile**: Stack layouts, touch-friendly

## 🔐 Security & Privacy

- **Authentication**: Supabase Auth với JWT
- **Authorization**: Role-based access control
- **Data Protection**: Encrypted storage
- **CORS**: Configured for security

## 🚧 Roadmap Tương Lai

### **Phase 2 Features:**
- [ ] Real-time chat với giáo viên
- [ ] Video lessons streaming
- [ ] AI-powered pronunciation check
- [ ] Mobile app native
- [ ] Payment gateway integration
- [ ] Email automation system

### **Phase 3 Features:**
- [ ] VR/AR learning experiences
- [ ] Gamification system
- [ ] Social learning community
- [ ] Advanced analytics dashboard

## 📞 Hỗ Trợ Kỹ Thuật

Nếu gặp vấn đề kỹ thuật:

1. **Kiểm tra Console**: F12 → Console tab
2. **Clear Cache**: Ctrl+F5 để refresh
3. **Thử trình duyệt khác**: Chrome, Firefox, Safari
4. **Kiểm tra kết nối**: Đảm bảo Internet ổn định

### **Lỗi Thường Gặp:**

**"Authentication Error"**
- Đăng xuất và đăng nhập lại
- Kiểm tra email/password chính xác

**"Quiz không load"**
- Refresh trang
- Kiểm tra kết nối Internet

**"Form không submit được"**
- Điền đầy đủ thông tin bắt buộc
- Kiểm tra format email hợp lệ

## 🎓 Best Practices

### **Cho Học Viên:**
- Làm quiz trong môi trường yên tĩnh
- Kiểm tra kết nối Internet trước khi bắt đầu
- Đọc kỹ hướng dẫn trước khi làm bài
- Lưu kết quả quan trọng

### **Cho Giáo Viên:**
- Test quiz trước khi assign cho học viên
- Đặt thời gian hợp lý cho từng câu hỏi
- Viết câu hỏi rõ ràng, dễ hiểu
- Review kết quả thường xuyên

### **Cho Admin:**
- Backup dữ liệu định kỳ
- Monitor system performance
- Review user feedback thường xuyên
- Keep user data secure

---

**© 2024 Trung tâm Tiếng Nhật Quang Dũng. All rights reserved.**
