import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Copy, Users, Shield, GraduationCap, Eye, EyeOff } from 'lucide-react';
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
    description: 'Tài khoản quản trị viên - có quyền truy cập đầy đủ tất cả chức năng'
  },
  {
    email: 'teacher@japancenter.demo',
    password: 'Teacher123!@#',
    role: 'teacher',
    name: 'Trần Thị Giáo Viên',
    description: 'Tài khoản giáo viên - có quyền tạo và quản lý quiz, xem kết quả học viên'
  }
];

export function DemoAccountSetup() {
  const [creating, setCreating] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);
  const { signUp } = useAuth();

  const createDemoAccount = async (account: DemoAccount) => {
    setCreating(account.email);
    try {
      console.log('Creating demo account:', account.email, 'with role:', account.role);
      
      const result = await signUp(account.email, account.password, {
        fullName: account.name,
        name: account.name,
        role: account.role
      });

      console.log('Signup result:', result);

      if (result.error) {
        // Nếu lỗi là email đã tồn tại, không coi là lỗi nghiêm trọng
        if (result.error.message?.includes('already registered') || 
            result.error.message?.includes('already exists') ||
            result.error.message?.includes('User already registered')) {
          toast.success(`Tài khoản ${account.role} đã tồn tại`, {
            description: `Email: ${account.email}`
          });
        } else {
          console.error('Signup error details:', result.error);
          throw new Error(result.error.message || result.error);
        }
      } else {
        toast.success(`Tạo tài khoản ${account.role} thành công!`, {
          description: `Email: ${account.email}`
        });
      }
    } catch (error) {
      console.error('Create demo account error:', error);
      toast.error(`Lỗi tạo tài khoản ${account.role}`, {
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra'
      });
    } finally {
      setCreating(null);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Đã copy ${type}`, {
        description: text
      });
    });
  };

  const createAllAccounts = async () => {
    for (const account of demoAccounts) {
      await createDemoAccount(account);
      // Thêm delay nhỏ giữa các lần tạo
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'teacher':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Thiết Lập Tài Khoản Demo
          </CardTitle>
          <CardDescription>
            Tạo tài khoản demo để test hệ thống phân quyền. Sau khi tạo, bạn có thể đăng xuất và đăng nhập bằng các tài khoản này.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
            <Button 
              onClick={createAllAccounts}
              disabled={creating !== null}
              className="bg-primary text-primary-foreground"
            >
              Tạo Tất Cả Tài Khoản Demo
            </Button>
          </div>

          <Separator />

          <div className="grid gap-4">
            {demoAccounts.map((account) => (
              <Card key={account.email} className="border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={getRoleColor(account.role)} className="flex items-center gap-1">
                        {getRoleIcon(account.role)}
                        {account.role.toUpperCase()}
                      </Badge>
                      <h4 className="font-medium">{account.name}</h4>
                    </div>
                    <Button
                      onClick={() => createDemoAccount(account)}
                      disabled={creating === account.email}
                      size="sm"
                      variant="outline"
                    >
                      {creating === account.email ? 'Đang tạo...' : 'Tạo Tài Khoản'}
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {account.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <span className="text-sm font-medium">Email:</span>
                        <span className="ml-2 text-sm">{account.email}</span>
                      </div>
                      <Button
                        onClick={() => copyToClipboard(account.email, 'email')}
                        size="sm"
                        variant="ghost"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <span className="text-sm font-medium">Mật khẩu:</span>
                        <span className="ml-2 text-sm font-mono">
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          <div className="text-sm text-muted-foreground space-y-2">
            <h5 className="font-medium text-foreground">Hướng dẫn sử dụng:</h5>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Nhấn "Tạo Tất Cả Tài Khoản Demo" để tạo tất cả tài khoản cùng lúc</li>
              <li>Hoặc tạo từng tài khoản riêng lẻ bằng nút "Tạo Tài Khoản"</li>
              <li>Sau khi tạo, đăng xuất khỏi tài khoản hiện tại</li>
              <li>Đăng nhập bằng email và mật khẩu của tài khoản demo</li>
              <li>Kiểm tra quyền truy cập dashboard tương ứng với vai trò</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
