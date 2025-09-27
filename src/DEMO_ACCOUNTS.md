# Tài Khoản Demo - Trung Tâm Tiếng Nhật Quang Dũng

Dưới đây là thông tin các tài khoản demo để test hệ thống với các vai trò khác nhau:

## 🔴 Admin (Quản trị viên)

- **Email:** `admin@japancenter.demo`
- **Mật khẩu:** `Admin123!@#`
- **Họ tên:** Nguyễn Văn Admin
- **Quyền truy cập:**
  - ✅ Tất cả chức năng của hệ thống
  - ✅ Admin Dashboard với đầy đủ thống kê
  - ✅ Quản lý đăng ký khóa học và thanh toán
  - ✅ Tạo, sửa, xóa quiz và câu hỏi
  - ✅ Quản lý phân quyền người dùng
  - ✅ Tạo tài khoản demo mới
  - ✅ Xem tất cả kết quả quiz

## 🟡 Teacher (Giáo viên)

- **Email:** `teacher@japancenter.demo`
- **Mật khẩu:** `Teacher123!@#`
- **Họ tên:** Trần Thị Giáo Viên
- **Quyền truy cập:**
  - ✅ Teacher Dashboard với đầy đủ thống kê
  - ✅ Tạo, sửa, xóa quiz với QuizEngine
  - ✅ Xem kết quả quiz của tất cả học viên
  - ✅ Quản lý câu hỏi và nội dung bài thi
  - ✅ Thống kê hiệu suất theo cấp độ và quiz
  - ✅ Theo dõi hoạt động học viên
  - ❌ Không thể quản lý đăng ký khóa học
  - ❌ Không thể thay đổi quyền người dùng
  - ❌ Không thể truy cập Admin Dashboard

## 🟢 Student (Học viên)

Bất kỳ tài khoản nào đăng ký mới sẽ tự động có vai trò Student với quyền:

- ✅ Làm quiz và bài kiểm tra
- ✅ Xem kết quả cá nhân
- ✅ Truy cập Student Dashboard
- ✅ Đăng ký khóa học
- ❌ Không thể tạo quiz
- ❌ Không thể xem kết quả của người khác

## 🔵 Guest (Khách)

Người dùng chưa đăng nhập:

- ✅ Xem thông tin trang chủ
- ✅ Xem danh sách khóa học
- ❌ Không thể truy cập dashboard
- ❌ Không thể làm quiz

## Hướng dẫn sử dụng

### Cách đăng nhập:

1. Nhấn nút "Đăng nhập" ở góc trên bên phải
2. Nhập email và mật khẩu từ danh sách trên
3. Hệ thống sẽ tự động chuyển hướng theo vai trò

### Cách tạo tài khoản demo mới (chỉ Admin):

1. Đăng nhập bằng tài khoản Admin
2. Vào Admin Dashboard → Tab "Cài đặt"
3. Sử dụng component "Thiết Lập Tài Khoản Demo"
4. Nhấn "Tạo Tất Cả Tài Khoản Demo" hoặc tạo từng tài khoản riêng lẻ

### Test các chức năng:

1. **Test phân quyền:** Đăng nhập với các vai trò khác nhau và kiểm tra quyền truy cập
2. **Test quiz system:** Sử dụng tài khoản Teacher để tạo quiz, Student để làm bài
3. **Test teacher registration:** Sử dụng form đăng ký giáo viên khi chưa đăng nhập
4. **Test teacher dashboard:** Kiểm tra các chức năng quản lý quiz và xem kết quả
5. **Test đăng ký khóa học:** Đăng ký khóa học và test quy trình thanh toán
6. **Test quản lý:** Sử dụng Admin để quản lý đăng ký và người dùng

## Ghi chú quan trọng

- ⚠️ Đây là môi trường demo, dữ liệu có thể bị xóa bất cứ lúc nào
- 🔐 Mật khẩu demo được thiết kế phức tạp để bảo mật, trong thực tế nên sử dụng quy tắc mật khẩu riêng
- 🎯 Hệ thống tự động phân quyền dựa trên role trong user metadata
- 📧 Email confirmation được tự động xác nhận trong môi trường demo

## Liên hệ hỗ trợ

Nếu gặp vấn đề với tài khoản demo hoặc cần hỗ trợ:

- Kiểm tra console trong Developer Tools để xem lỗi
- Đảm bảo đã nhập đúng email và mật khẩu
- Thử làm mới trang và đăng nhập lại
