import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Mail, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Users,
  Calendar,
  Filter,
  RefreshCw,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'welcome' | 'course_reminder' | 'payment_reminder' | 'completion' | 'custom';
  isActive: boolean;
  createdAt: string;
}

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  template: string;
  status: 'sent' | 'pending' | 'failed';
  sentAt: string;
  openedAt?: string;
  clickedAt?: string;
}

export function EmailManagement() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<EmailTemplate>>({
    name: "",
    subject: "",
    body: "",
    type: "custom",
    isActive: true
  });

  // Mock data
  useEffect(() => {
    const mockTemplates: EmailTemplate[] = [
      {
        id: "1",
        name: "Email chào mừng",
        subject: "Chào mừng bạn đến với trung tâm tiếng Nhật!",
        body: "Xin chào {{name}},\n\nChúng tôi rất vui mừng chào đón bạn đến với trung tâm tiếng Nhật. Hành trình học tập thú vị của bạn sẽ bắt đầu từ đây!\n\nTrân trọng,\nĐội ngũ giáo viên",
        type: "welcome",
        isActive: true,
        createdAt: "2024-01-01T10:00:00Z"
      },
      {
        id: "2",
        name: "Nhắc nhở thanh toán",
        subject: "Nhắc nhở thanh toán học phí - Mã đăng ký {{registrationId}}",
        body: "Xin chào {{name}},\n\nChúng tôi nhận thấy bạn chưa hoàn tất thanh toán cho khóa học {{courseName}}.\n\nVui lòng hoàn tất thanh toán trong vòng 24h để giữ chỗ học.\n\nTrân trọng!",
        type: "payment_reminder",
        isActive: true,
        createdAt: "2024-01-02T10:00:00Z"
      },
      {
        id: "3",
        name: "Hoàn thành khóa học",
        subject: "🎉 Chúc mừng bạn hoàn thành khóa học {{courseName}}!",
        body: "Xin chào {{name}},\n\nChúc mừng bạn đã hoàn thành khóa học {{courseName}} với kết quả xuất sắc!\n\nKết quả của bạn: {{score}}/100\nChứng chỉ sẽ được gửi trong 3-5 ngày làm việc.\n\nCảm ơn bạn đã tin tưởng chọn chúng tôi!",
        type: "completion",
        isActive: true,
        createdAt: "2024-01-03T10:00:00Z"
      }
    ];

    const mockEmailLogs: EmailLog[] = [
      {
        id: "1",
        to: "student@example.com",
        subject: "Chào mừng bạn đến với trung tâm tiếng Nhật!",
        template: "Email chào mừng",
        status: "sent",
        sentAt: "2024-01-15T09:30:00Z",
        openedAt: "2024-01-15T10:15:00Z"
      },
      {
        id: "2",
        to: "learner@example.com",
        subject: "Nhắc nhở thanh toán học phí - Mã đăng ký REG123456",
        template: "Nhắc nhở thanh toán",
        status: "sent",
        sentAt: "2024-01-14T14:20:00Z",
        openedAt: "2024-01-14T15:30:00Z",
        clickedAt: "2024-01-14T15:35:00Z"
      },
      {
        id: "3",
        to: "newbie@example.com",
        subject: "Chào mừng bạn đến với trung tâm tiếng Nhật!",
        template: "Email chào mừng",
        status: "pending",
        sentAt: "2024-01-15T16:00:00Z"
      },
      {
        id: "4",
        to: "graduate@example.com",
        subject: "🎉 Chúc mừng bạn hoàn thành khóa học N5!",
        template: "Hoàn thành khóa học",
        status: "sent",
        sentAt: "2024-01-13T11:00:00Z",
        openedAt: "2024-01-13T11:45:00Z"
      }
    ];

    setTemplates(mockTemplates);
    setEmailLogs(mockEmailLogs);
  }, []);

  const handleCreateTemplate = () => {
    const newTemplate: EmailTemplate = {
      ...formData as EmailTemplate,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setTemplates([...templates, newTemplate]);
    setIsCreateModalOpen(false);
    setFormData({
      name: "",
      subject: "",
      body: "",
      type: "custom",
      isActive: true
    });
    toast.success("Tạo template email thành công!");
  };

  const handleToggleTemplate = (templateId: string) => {
    setTemplates(templates.map(template => 
      template.id === templateId 
        ? { ...template, isActive: !template.isActive }
        : template
    ));
    toast.success("Cập nhật trạng thái template thành công!");
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(template => template.id !== templateId));
    toast.success("Xóa template thành công!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Đã gửi</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white"><Clock className="w-3 h-3 mr-1" />Đang gửi</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Thất bại</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'welcome':
        return '👋';
      case 'course_reminder':
        return '📚';
      case 'payment_reminder':
        return '💳';
      case 'completion':
        return '🎉';
      case 'custom':
      default:
        return '📧';
    }
  };

  const stats = {
    totalTemplates: templates.length,
    activeTemplates: templates.filter(t => t.isActive).length,
    totalSent: emailLogs.filter(e => e.status === 'sent').length,
    openRate: Math.round((emailLogs.filter(e => e.openedAt).length / emailLogs.filter(e => e.status === 'sent').length) * 100) || 0
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý Email</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tạo template mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo Email Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tên template</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="VD: Email chào mừng"
                  />
                </div>
                <div>
                  <Label>Loại email</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Chào mừng</SelectItem>
                      <SelectItem value="course_reminder">Nhắc nhở khóa học</SelectItem>
                      <SelectItem value="payment_reminder">Nhắc nhở thanh toán</SelectItem>
                      <SelectItem value="completion">Hoàn thành khóa học</SelectItem>
                      <SelectItem value="custom">Tùy chỉnh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Chủ đề email</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="VD: Chào mừng bạn đến với trung tâm!"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Sử dụng các biến: {"{{name}}"}, {"{{courseName}}"}, {"{{registrationId}}"}, {"{{score}}"}
                </p>
              </div>

              <div>
                <Label>Nội dung email</Label>
                <Textarea
                  value={formData.body}
                  onChange={(e) => setFormData({...formData, body: e.target.value})}
                  placeholder="Nhập nội dung email..."
                  rows={8}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Hỗ trợ các biến động như trên và HTML cơ bản
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label>Kích hoạt template</Label>
              </div>

              <Button onClick={handleCreateTemplate} className="w-full">
                Tạo Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTemplates}</div>
            <div className="text-xs text-muted-foreground">
              {stats.activeTemplates} đang hoạt động
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email đã gửi</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalSent}</div>
            <div className="text-xs text-muted-foreground">
              Trong tháng này
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ mở email</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.openRate}%</div>
            <div className="text-xs text-muted-foreground">
              Trung bình
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email hôm nay</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {emailLogs.filter(e => new Date(e.sentAt).toDateString() === new Date().toDateString()).length}
            </div>
            <div className="text-xs text-muted-foreground">
              Đã gửi hôm nay
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="logs">Email Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates ({templates.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <Card key={template.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="text-2xl">{getTypeIcon(template.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{template.name}</h3>
                            {template.isActive ? (
                              <Badge className="bg-green-500 text-white">Hoạt động</Badge>
                            ) : (
                              <Badge variant="outline">Tạm dừng</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{template.subject}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{template.body}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Tạo: {new Date(template.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedTemplate(template)}>
                              <Eye className="h-3 w-3 mr-1" />
                              Xem
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Chi tiết Template: {template.name}</DialogTitle>
                            </DialogHeader>
                            {selectedTemplate && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Tên</Label>
                                    <p>{selectedTemplate.name}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Loại</Label>
                                    <p>{getTypeIcon(selectedTemplate.type)} {selectedTemplate.type}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Chủ đề</Label>
                                  <p className="font-medium">{selectedTemplate.subject}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Nội dung</Label>
                                  <div className="bg-muted p-3 rounded-lg whitespace-pre-wrap text-sm">
                                    {selectedTemplate.body}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleTemplate(template.id)}
                        >
                          {template.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Logs ({emailLogs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người nhận</TableHead>
                    <TableHead>Chủ đề</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thời gian gửi</TableHead>
                    <TableHead>Hoạt động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.to}</TableCell>
                      <TableCell className="max-w-xs truncate">{log.subject}</TableCell>
                      <TableCell>{log.template}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>
                        {new Date(log.sentAt).toLocaleString('vi-VN')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-xs">
                          {log.openedAt && (
                            <Badge variant="secondary" className="text-xs">
                              <Eye className="w-2 h-2 mr-1" />
                              Đã mở
                            </Badge>
                          )}
                          {log.clickedAt && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              Đã click
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
