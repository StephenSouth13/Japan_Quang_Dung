"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Search, Eye, Edit, Mail, Users, GraduationCap, UserCheck, Calendar, Filter, Download, MoreVertical 
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  created_at: string;
  last_sign_in_at?: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [emailData, setEmailData] = useState({
    subject: "",
    body: "",
    recipients: [] as string[]
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', { cache: "no-store" });
      console.log("API Response (users):", response.status, response.statusText);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: HTTP ${response.status}`);
      }
      const result = await response.json();
      console.log("API Data (users):", result);
      if (result.success) {
        setUsers(result.data);
      } else {
        console.error("Lỗi từ API:", result.error);
        toast.error(result.error || "Có lỗi xảy ra khi tải danh sách người dùng");
        setUsers([
          {
            id: "1",
            email: "user1@example.com",
            name: "Nguyen Van A",
            role: "student",
            created_at: "2025-09-24T13:00:00Z",
           
          },
          {
            id: "2",
            email: "user2@example.com",
            name: "Tran Thi B",
            role: "teacher",
            created_at: "2025-09-24T13:00:00Z",
            last_sign_in_at: "2025-09-24T13:00:00Z",
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Có lỗi xảy ra khi tải danh sách người dùng");
      setUsers([
        {
          id: "1",
          email: "user1@example.com",
          name: "Nguyen Van A",
          role: "student",
          created_at: "2025-09-24T13:00:00Z",
          last_sign_in_at: "2025-09-24T13:00:00Z",
        },
        {
          id: "2",
          email: "user2@example.com",
          name: "Tran Thi B",
          role: "teacher",
          created_at: "2025-09-24T13:00:00Z",
          last_sign_in_at: "2025-09-24T13:00:00Z",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      console.log("Update role response:", response.status, response.statusText);
      if (!response.ok) {
        throw new Error('Failed to update user role');
      }
      const result = await response.json();
      if (result.success) {
        toast.success("Cập nhật quyền thành công!");
        fetchUsers();
      } else {
        throw new Error(result.error || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error("Có lỗi xảy ra khi cập nhật quyền");
    }
  };

  const sendBulkEmail = async () => {
    try {
      // Placeholder: Gửi email qua API nội bộ
      toast.success(`Gửi email đến ${emailData.recipients.length} người dùng!`);
      setEmailData({ subject: "", body: "", recipients: [] });
    } catch (error) {
      console.error('Error sending bulk email:', error);
      toast.error("Có lỗi xảy ra khi gửi email");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500 text-white">Admin</Badge>;
      case 'teacher':
        return <Badge className="bg-blue-500 text-white">Giáo viên</Badge>;
      case 'student':
        return <Badge variant="secondary">Học viên</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <UserCheck className="w-4 h-4" />;
      case 'teacher':
        return <GraduationCap className="w-4 h-4" />;
      case 'student':
        return <Users className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'student').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    admins: users.filter(u => u.role === 'admin').length
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Đang tải dữ liệu người dùng...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
        <div className="flex space-x-2">
          <Button onClick={fetchUsers} variant="outline">
            Làm mới
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Mail className="w-4 h-4 mr-2" />
                Gửi email
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Gửi email hàng loạt</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Chủ đề</Label>
                  <Input
                    value={emailData.subject}
                    onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                    placeholder="Nhập chủ đề email..."
                  />
                </div>
                <div>
                  <Label>Nội dung</Label>
                  <Textarea
                    value={emailData.body}
                    onChange={(e) => setEmailData({...emailData, body: e.target.value})}
                    placeholder="Nhập nội dung email..."
                    rows={6}
                  />
                </div>
                <div>
                  <Label>Người nhận</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {users.map(user => (
                      <label key={user.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={emailData.recipients.includes(user.email)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEmailData({
                                ...emailData,
                                recipients: [...emailData.recipients, user.email]
                              });
                            } else {
                              setEmailData({
                                ...emailData,
                                recipients: emailData.recipients.filter(email => email !== user.email)
                              });
                            }
                          }}
                        />
                        <span className="text-sm">{user.name} ({user.email})</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Button 
                  onClick={sendBulkEmail} 
                  disabled={!emailData.subject || !emailData.body || emailData.recipients.length === 0}
                  className="w-full"
                >
                  Gửi email ({emailData.recipients.length} người)
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Học viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.students}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giáo viên</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.teachers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Lọc theo quyền" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="student">Học viên</SelectItem>
            <SelectItem value="teacher">Giáo viên</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Quyền</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Lần đăng nhập cuối</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        {getRoleIcon(user.role)}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.last_sign_in_at ? (
                      <span className="text-sm">
                        {new Date(user.last_sign_in_at).toLocaleDateString('vi-VN')}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Chưa đăng nhập</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Xem
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Chi tiết người dùng</DialogTitle>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-4">
                              <div className="text-center">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-3">
                                  {getRoleIcon(selectedUser.role)}
                                </div>
                                <h3 className="font-semibold">{selectedUser.name}</h3>
                                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                                {getRoleBadge(selectedUser.role)}
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">ID</label>
                                  <p className="text-sm font-mono">{selectedUser.id}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Ngày tạo</label>
                                  <p className="text-sm">{new Date(selectedUser.created_at).toLocaleString('vi-VN')}</p>
                                </div>
                                {selectedUser.last_sign_in_at && (
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Lần đăng nhập cuối</label>
                                    <p className="text-sm">{new Date(selectedUser.last_sign_in_at).toLocaleString('vi-VN')}</p>
                                  </div>
                                )}
                              </div>
                              <div className="pt-4 border-t">
                                <Label className="text-sm font-medium">Thay đổi quyền</Label>
                                <Select 
                                  value={selectedUser.role} 
                                  onValueChange={(newRole) => updateUserRole(selectedUser.id, newRole)}
                                >
                                  <SelectTrigger className="w-full mt-2">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="student">Học viên</SelectItem>
                                    <SelectItem value="teacher">Giáo viên</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => updateUserRole(user.id, user.role === 'student' ? 'teacher' : 'student')}
                          >
                            <Edit className="h-3 w-3 mr-2" />
                            Thay đổi quyền
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEmailData({
                                ...emailData,
                                recipients: [user.email]
                              });
                            }}
                          >
                            <Mail className="h-3 w-3 mr-2" />
                            Gửi email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Không tìm thấy người dùng nào
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}