import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Check,
  Copy,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { AuthModal } from "./AuthModal";

interface Course {
  id: number;
  title: string;
  price: string;
  duration: string;
  level: string;
}

interface CourseRegistrationModalProps {
  course: Course;
  children: React.ReactNode;
}

export function CourseRegistrationModal({
  course,
  children,
}: CourseRegistrationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationId, setRegistrationId] =
    useState<string>("");
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    experience: "",
    motivation: "",
    paymentMethod: "bank_transfer",
  });

  // Auto-fill user data if logged in
  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.user_metadata?.fullName || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
        address: user.user_metadata?.address || "",
      }));
    }
  }, [user]);

  const bankInfo = {
    bankName: "Ngân hàng Vietcombank",
    accountNumber: "1234567890",
    accountName: "TRUNG TAM TIENG NHAT Quang Dũng",
    branch: "Chi nhánh Quận 1",
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép vào clipboard!");
  };

  const handleSubmitRegistration = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đăng ký khóa học!");
      return;
    }

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationData = {
        ...formData,
        courseId: course.id,
        courseTitle: course.title,
        coursePrice: course.price,
        userId: user.id,
        registeredAt: new Date().toISOString(),
        status: "pending_payment",
      };

      const response = await fetch(
        `https://${await import("../utils/supabase/info").then((m) => m.projectId)}.supabase.co/functions/v1/make-server-2c1a01cc/register-course`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await import("../utils/supabase/info").then((m) => m.publicAnonKey)}`,
          },
          body: JSON.stringify(registrationData),
        },
      );

      if (!response.ok) {
        throw new Error("Đăng ký thất bại");
      }

      const result = await response.json();
      setRegistrationId(result.registrationId);
      setCurrentStep("payment");
      
      // Add notification
      addNotification({
        title: "Đăng ký khóa học thành công!",
        message: `Bạn đã đăng ký thành công khóa học "${course.title}". Mã đăng ký: ${result.registrationId}. Vui lòng thanh toán để hoàn tất.`,
        type: "success",
        actionUrl: "#payment",
        actionText: "Thanh toán ngay"
      });
      
      toast.success(
        "Đăng ký thành công! Vui lòng thanh toán để hoàn tất.",
      );
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentConfirm = () => {
    // Add notification for payment confirmation
    addNotification({
      title: "Đã ghi nhận thanh toán",
      message: `Chúng tôi đã ghi nhận việc thanh toán cho khóa học "${course.title}". Chúng tôi sẽ xác nhận trong vòng 24h và gửi thông tin lớp học qua email.`,
      type: "info"
    });
    
    toast.success(
      "Cảm ơn bạn đã đăng ký! Chúng tôi sẽ xác nhận thanh toán trong vòng 24h.",
    );
    setIsOpen(false);
    setCurrentStep("info");
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      experience: "",
      motivation: "",
      paymentMethod: "bank_transfer",
    });
  };

  // Show login modal if user is not authenticated
  if (!user) {
    return (
      <AuthModal defaultTab="signin">{children}</AuthModal>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Đăng ký khóa học: {course.title}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={currentStep}
          onValueChange={setCurrentStep}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">
              Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              disabled={!registrationId}
            >
              Thanh toán
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Thông tin khóa học
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Tên khóa học:
                    </span>
                    <p className="font-medium">
                      {course.title}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Trình độ:
                    </span>
                    <Badge variant="secondary">
                      {course.level}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Thời gian:
                    </span>
                    <p className="font-medium">
                      {course.duration}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Học phí:
                    </span>
                    <p className="font-medium text-primary">
                      {course.price}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Họ và tên{" "}
                      <span className="text-destructive">
                        *
                      </span>
                    </label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange(
                          "fullName",
                          e.target.value,
                        )
                      }
                      placeholder="Nhập họ và tên đầy đủ"
                      disabled={!!user?.user_metadata?.fullName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Số điện thoại{" "}
                      <span className="text-destructive">
                        *
                      </span>
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange(
                          "phone",
                          e.target.value,
                        )
                      }
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                    placeholder="Nhập địa chỉ email"
                    disabled={!!user?.email}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Địa chỉ
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange(
                        "address",
                        e.target.value,
                      )
                    }
                    placeholder="Nhập địa chỉ hiện tại"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kinh nghiệm học tiếng Nhật
                  </label>
                  <Textarea
                    value={formData.experience}
                    onChange={(e) =>
                      handleInputChange(
                        "experience",
                        e.target.value,
                      )
                    }
                    placeholder="Mô tả kinh nghiệm học tiếng Nhật của bạn (nếu có)"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mục tiêu học tập
                  </label>
                  <Textarea
                    value={formData.motivation}
                    onChange={(e) =>
                      handleInputChange(
                        "motivation",
                        e.target.value,
                      )
                    }
                    placeholder="Chia sẻ mục tiêu và động lực học tiếng Nhật của bạn"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSubmitRegistration}
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting
                ? "Đang xử lý..."
                : "Tiếp tục thanh toán"}
            </Button>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            {/* Registration Success */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800">
                      Đăng ký thành công!
                    </h3>
                    <p className="text-sm text-green-600">
                      Mã đăng ký: {registrationId}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Thông tin thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3">
                    Thông tin chuyển khoản
                  </h4>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-600">
                        Ngân hàng:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {bankInfo.bankName}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(bankInfo.bankName)
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-600">
                        Số tài khoản:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {bankInfo.accountNumber}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              bankInfo.accountNumber,
                            )
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-600">
                        Tên tài khoản:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {bankInfo.accountName}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              bankInfo.accountName,
                            )
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-600">
                        Chi nhánh:
                      </span>
                      <span className="font-medium">
                        {bankInfo.branch}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                      <span className="text-sm text-blue-600">
                        Số tiền:
                      </span>
                      <span className="font-bold text-lg text-blue-800">
                        {course.price}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-600">
                        Nội dung CK:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          Quang Dũng {registrationId}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              `Quang Dũng ${registrationId}`,
                            )
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Lưu ý quan trọng:
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>
                      • Vui lòng chuyển khoản đúng số tiền và
                      ghi đúng nội dung
                    </li>
                    <li>
                      • Chúng tôi sẽ xác nhận thanh toán trong
                      vòng 24h
                    </li>
                    <li>
                      • Sau khi xác nhận, bạn sẽ nhận được thông
                      tin lớp học qua email
                    </li>
                    <li>
                      • Liên hệ (028) 3825 1234 nếu cần hỗ trợ
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={handlePaymentConfirm}
                  className="w-full"
                  size="lg"
                >
                  Tôi đã chuyển khoản
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
