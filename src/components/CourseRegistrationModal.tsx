"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Course } from "@/interfaces/course"; // Import interface Course từ file đã chia sẻ

interface CourseRegistrationModalProps {
  course: Course;
  children: React.ReactNode;
}

export function CourseRegistrationModal({
  course,
  children,
}: CourseRegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const { name, phone, email } = formData;
    if (!name || !phone || !email) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Vui lòng nhập email hợp lệ.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Gửi dữ liệu đăng ký
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          courseId: course.id,
          courseTitle: course.title,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
        setOpen(false); // Đóng modal sau khi gửi thành công
        setFormData({ name: "", phone: "", email: "", message: "" }); // Reset form
      } else {
        throw new Error(data.error || "Gửi đăng ký không thành công.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Đăng ký khóa học</DialogTitle>
          <DialogDescription>
            Điền thông tin của bạn để được tư vấn chi tiết về khóa học{" "}
            <span className="font-bold text-primary">{course.title}</span>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Họ tên *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Điện thoại *
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-3"
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Ghi chú
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Ví dụ: Tôi muốn học vào buổi tối..."
                className="col-span-3"
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter className="flex-row sm:justify-between justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={loading}>
                Hủy
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="w-auto min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Gửi đăng ký
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}