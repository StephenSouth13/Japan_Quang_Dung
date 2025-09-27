import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Search, 
  Download, 
  Trash2, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Activity,
  Calendar,
  Filter,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  category: string;
  message: string;
  details?: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
}

export function SystemLogsManagement() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("today");

  // Mock log data
  useEffect(() => {
    const mockLogs: LogEntry[] = [
      {
        id: "1",
        timestamp: new Date().toISOString(),
        level: "info",
        category: "user_auth",
        message: "Người dùng đăng nhập thành công",
        details: "Đăng nhập từ IP 192.168.1.100",
        userId: "user123",
        userEmail: "student@example.com",
        ipAddress: "192.168.1.100"
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        level: "success",
        category: "course_registration",
        message: "Đăng ký khóa học thành công",
        details: "Khóa học: Tiếng Nhật N5 - Học phí: 2.500.000 VNĐ",
        userId: "user456",
        userEmail: "newstudent@example.com",
        ipAddress: "192.168.1.101"
      },
      {
        id: "3",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        level: "warning",
        category: "payment",
        message: "Thanh toán chậm trễ",
        details: "Đăng ký REG1234567890 chưa được thanh toán sau 24h",
        userId: "user789",
        userEmail: "pending@example.com",
        ipAddress: "192.168.1.102"
      },
      {
        id: "4",
        timestamp: new Date(Date.now() - 900000).toISOString(),
        level: "error",
        category: "system",
        message: "Lỗi kết nối database",
        details: "Connection timeout after 30 seconds",
        ipAddress: "server"
      },
      {
        id: "5",
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        level: "info",
        category: "quiz",
        message: "Quiz được hoàn thành",
        details: "Quiz N5 - Điểm: 85/100",
        userId: "user123",
        userEmail: "student@example.com",
        ipAddress: "192.168.1.100"
      },
      {
        id: "6",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        level: "info",
        category: "admin",
        message: "Admin tạo khóa học mới",
        details: "Khóa học: Tiếng Nhật N4 Nâng cao",
        userId: "admin123",
        userEmail: "admin@example.com",
        ipAddress: "192.168.1.1"
      }
    ];
    setLogs(mockLogs);
  }, []);

  const clearLogs = () => {
    setLogs([]);
    toast.success("Đã xóa tất cả logs!");
  };

  const exportLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,Level,Category,Message,Details,User Email,IP Address\n"
      + logs.map(log => 
          `"${log.timestamp}","${log.level}","${log.category}","${log.message}","${log.details || ''}","${log.userEmail || ''}","${log.ipAddress || ''}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `system_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Đã xuất logs thành công!");
  };

  const refreshLogs = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
      toast.success("Đã làm mới logs!");
    }, 1000);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.userEmail && log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      
      switch (dateFilter) {
        case "today":
          matchesDate = logDate.toDateString() === now.toDateString();
          break;
        case "yesterday":
          const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          matchesDate = logDate.toDateString() === yesterday.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesLevel && matchesCategory && matchesDate;
  });

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error':
        return (
          <Badge variant="destructive" className="text-xs">
            <XCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-yellow-500 text-white text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Warning
          </Badge>
        );
      case 'success':
        return (
          <Badge className="bg-green-500 text-white text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Success
          </Badge>
        );
      case 'info':
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            <Info className="w-3 h-3 mr-1" />
            Info
          </Badge>
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user_auth':
        return '🔐';
      case 'course_registration':
        return '📚';
      case 'payment':
        return '💳';
      case 'quiz':
        return '🧠';
      case 'admin':
        return '⚙️';
      case 'system':
        return '🖥️';
      default:
        return '📝';
    }
  };

  const stats = {
    total: logs.length,
    errors: logs.filter(l => l.level === 'error').length,
    warnings: logs.filter(l => l.level === 'warning').length,
    today: logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Logs</h2>
        <div className="flex space-x-2">
          <Button onClick={refreshLogs} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button onClick={exportLogs} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất CSV
          </Button>
          <Button onClick={clearLogs} variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa logs
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng logs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hôm nay</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[140px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả level</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="user_auth">Đăng nhập</SelectItem>
            <SelectItem value="course_registration">Đăng ký</SelectItem>
            <SelectItem value="payment">Thanh toán</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[140px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hôm nay</SelectItem>
            <SelectItem value="yesterday">Hôm qua</SelectItem>
            <SelectItem value="week">7 ngày qua</SelectItem>
            <SelectItem value="month">30 ngày qua</SelectItem>
            <SelectItem value="all">Tất cả</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Logs ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời gian</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(log.timestamp).toLocaleString('vi-VN')}
                    </div>
                  </TableCell>
                  <TableCell>{getLevelBadge(log.level)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{getCategoryIcon(log.category)}</span>
                      <span className="text-sm">{log.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{log.message}</div>
                      {log.details && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {log.details}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.userEmail ? (
                      <div className="text-sm">
                        <div className="font-mono text-xs text-muted-foreground">{log.userId}</div>
                        <div>{log.userEmail}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      {log.ipAddress}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Không tìm thấy log nào phù hợp với bộ lọc
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
