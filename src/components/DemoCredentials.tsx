import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Copy, Eye, EyeOff, Shield, GraduationCap, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface DemoAccount {
  email: string;
  password: string;
  role: 'admin' | 'teacher';
  name: string;
  description: string;
}

const demoAccounts: DemoAccount[] = [
  {
    email: 'admin@japancenter.demo',
    password: 'Admin123!@#',
    role: 'admin',
    name: 'Nguyễn Văn Admin',
    description: 'Quản trị viên - Truy cập tất cả chức năng'
  },
  {
    email: 'teacher@japancenter.demo',
    password: 'Teacher123!@#',
    role: 'teacher',
    name: 'Trần Thị Giáo Viên',
    description: 'Giáo viên - Quản lý quiz và học viên'
  }
];

export function DemoCredentials() {
  const [showPasswords, setShowPasswords] = useState(false);
  const [logging, setLogging] = useState<string | null>(null);
  const { signIn } = useAuth();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Đã copy ${type}`, {
        description: text
      });
    });
  };

  const quickLogin = async (account: DemoAccount) => {
    setLogging(account.email);
    try {
      console.log('Quick login attempt:', account.email);
      const result = await signIn(account.email, account.password);
      console.log('Quick login result:', result);
      
      if (result.error) {
        toast.error('Đăng nhập thất bại', {
          description: result.error.message || 'Có lỗi xảy ra'
        });
      } else {
        toast.success(`Đăng nhập thành công với vai trò ${account.role}!`);
      }
    } catch (error) {
      console.error('Quick login error:', error);
      toast.error('Có lỗi xảy ra khi đăng nhập');
    } finally {
      setLogging(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'teacher':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'teacher':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-dashed border-2 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Tài Khoản Demo
        </CardTitle>
        <CardDescription>
          Sử dụng các tài khoản sau để trải nghiệm hệ thống với các quyền khác nhau
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setShowPasswords(!showPasswords)}
            variant="outline"
            size="sm"
          >
            {showPasswords ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Ẩn mật khẩu
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Hiện mật khẩu
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-4">
          {demoAccounts.map((account) => (
            <div key={account.email} className="p-4 border rounded-lg bg-background/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleColor(account.role)} className="flex items-center gap-1">
                    {getRoleIcon(account.role)}
                    {account.role.toUpperCase()}
                  </Badge>
                  <span className="font-medium">{account.name}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {account.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                  <div>
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{account.email}</span>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(account.email, 'email')}
                    size="sm"
                    variant="ghost"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                  <div>
                    <span className="font-medium">Mật khẩu:</span>
                    <span className="ml-2 font-mono">
                      {showPasswords ? account.password : '••••••••••'}
                    </span>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(account.password, 'mật khẩu')}
                    size="sm"
                    variant="ghost"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <Button
                    onClick={() => quickLogin(account)}
                    disabled={logging === account.email}
                    size="sm"
                    className="w-full"
                  >
                    {logging === account.email ? 'Đang đăng nhập...' : `Đăng nhập ${account.role}`}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-sm text-muted-foreground p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">💡 Hướng dẫn:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
            <li>Nhấn vào nút "Đăng nhập" ở góc trên bên phải</li>
            <li>Sử dụng email và mật khẩu từ danh sách trên</li>
            <li>Trải nghiệm các chức năng dành cho từng vai trò</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
