import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  Crown, 
  Shield, 
  GraduationCap, 
  UserCheck, 
  Search,
  Settings,
  Eye,
  Edit,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, ROLE_CONFIGS, PERMISSIONS } from '../types/roles';
import { toast } from 'sonner';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  last_sign_in_at?: string;
}

export function RoleManager() {
  const { userRole, updateUserRole } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const result = await response.json();
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        toast.success('Cập nhật vai trò thành công!');
        loadUsers(); // Reload users list
      } else {
        toast.error(result.error || 'Cập nhật vai trò thất bại');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Có lỗi xảy ra khi cập nhật vai trò');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4" />;
      case 'teacher':
        return <GraduationCap className="w-4 h-4" />;
      case 'student':
        return <UserCheck className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'teacher':
        return 'default';
      case 'student':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const roleStats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    teacher: users.filter(u => u.role === 'teacher').length,
    student: users.filter(u => u.role === 'student').length,
    guest: users.filter(u => u.role === 'guest').length
  };

  if (userRole !== 'admin') {
    return (
      <div className="text-center p-8">
        <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Không có quyền truy cập</h3>
        <p className="text-muted-foreground">Chỉ quản trị viên mới có thể quản lý vai trò người dùng.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý vai trò người dùng</h2>
          <p className="text-muted-foreground">Phân quyền và quản lý vai trò cho người dùng hệ thống</p>
        </div>
        <Button onClick={loadUsers} variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Quản lý người dùng</TabsTrigger>
          <TabsTrigger value="roles">Cấu hình vai trò</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6 mt-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng</p>
                    <p className="text-2xl font-bold">{roleStats.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Admin</p>
                    <p className="text-2xl font-bold text-red-600">{roleStats.admin}</p>
                  </div>
                  <Crown className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Giáo viên</p>
                    <p className="text-2xl font-bold text-blue-600">{roleStats.teacher}</p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Học viên</p>
                    <p className="text-2xl font-bold text-green-600">{roleStats.student}</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Khách</p>
                    <p className="text-2xl font-bold text-gray-600">{roleStats.guest}</p>
                  </div>
                  <Users className="w-8 h-8 text-gray-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole | 'all')}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="admin">Quản trị viên</SelectItem>
                <SelectItem value="teacher">Giáo viên</SelectItem>
                <SelectItem value="student">Học viên</SelectItem>
                <SelectItem value="guest">Khách</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách người dùng ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Đăng nhập cuối</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {ROLE_CONFIGS[user.role].displayName}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Chưa đăng nhập'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Chi tiết người dùng</DialogTitle>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Tên</label>
                                      <p>{selectedUser.name}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                                      <p>{selectedUser.email}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Vai trò hiện tại</label>
                                      <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                                        {ROLE_CONFIGS[selectedUser.role].displayName}
                                      </Badge>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">ID</label>
                                      <p className="font-mono text-xs">{selectedUser.id}</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Mô tả vai trò</label>
                                    <p className="text-sm text-muted-foreground">
                                      {ROLE_CONFIGS[selectedUser.role].description}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Quyền của vai trò</label>
                                    <div className="mt-2 space-y-1">
                                      {ROLE_CONFIGS[selectedUser.role].permissions.map((perm, index) => (
                                        <div key={index} className="text-xs bg-muted p-2 rounded">
                                          <strong>{perm.resource}:</strong> {perm.actions.join(', ')}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Select
                            value={user.role}
                            onValueChange={(newRole: UserRole) => {
                              if (newRole !== user.role) {
                                handleRoleChange(user.id, newRole);
                              }
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Học viên</SelectItem>
                              <SelectItem value="teacher">Giáo viên</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Không tìm thấy người dùng nào phù hợp
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6 mt-6">
          {/* Role Configurations */}
          <div className="grid gap-6">
            {Object.values(ROLE_CONFIGS).map((roleConfig) => (
              <Card key={roleConfig.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getRoleIcon(roleConfig.name)}
                      <div>
                        <CardTitle>{roleConfig.displayName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{roleConfig.description}</p>
                      </div>
                    </div>
                    <Badge variant={getRoleBadgeVariant(roleConfig.name)}>
                      {roleStats[roleConfig.name]} người dùng
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium">Quyền hạn:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {roleConfig.permissions.map((permission, index) => (
                        <div key={index} className="bg-muted/50 p-3 rounded-lg">
                          <h5 className="font-medium text-sm capitalize mb-1">
                            {permission.resource}
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {permission.actions.map((action, actionIndex) => (
                              <Badge key={actionIndex} variant="outline" className="text-xs">
                                {action.split(':')[1]}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
