import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AlertCircle, UserCheck, Loader2, Eye, EyeOff, Copy } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface DemoAccount {
  email: string;
  password: string;
  role: 'admin' | 'teacher';
  name: string;
}

const demoAccounts: DemoAccount[] = [
  {
    email: 'admin@japancenter.demo',
    password: 'Admin123!@#',
    role: 'admin',
    name: 'Nguyễn Văn Admin'
  },
  {
    email: 'teacher@japancenter.demo',
    password: 'Teacher123!@#',
    role: 'teacher',
    name: 'Trần Thị Giáo Viên'
  }
];

export function LoginTest() {
  const [email, setEmail] = useState('admin@japancenter.demo');
  const [password, setPassword] = useState('Admin123!@#');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);
  const [loginResult, setLoginResult] = useState<any>(null);
  const { signIn, signUp, user } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setLoginResult(null);
    
    try {
      console.log('Attempting login with:', { email, password: '***' });
      const result = await signIn(email, password);
      console.log('Login result:', result);
      
      setLoginResult(result);
      
      if (result.error) {
        toast.error('Đăng nhập thất bại', {
          description: result.error.message || 'Email hoặc mật khẩu không đúng'
        });
      } else {
        toast.success('Đăng nhập thành công!');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Có lỗi xảy ra khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

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
        if (result.error.message?.includes('already registered') || 
            result.error.message?.includes('already exists') ||
            result.error.message?.includes('User already registered')) {
          toast.success(`Tài khoản ${account.role} đã tồn tại`, {
            description: `Email: ${account.email}`
          });
        } else {
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

  const createAllAccounts = async () => {
    for (const account of demoAccounts) {
      await createDemoAccount(account);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Đã copy ${type}`);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Debug - Kiểm Tra Đăng Nhập
          </CardTitle>
          <CardDescription>
            Tool debug để kiểm tra hệ thống đăng nhập và tạo tài khoản demo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current User Info */}
          {user && (
            <Alert>
              <UserCheck className="h-4 w-4" />
              <AlertDescription>
                Đã đăng nhập: <strong>{user.email}</strong> - Vai trò: <Badge>{user.user_metadata?.role || 'student'}</Badge>
              </AlertDescription>
            </Alert>
          )}

          {/* Login Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Kiểm Tra Đăng Nhập</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@japancenter.demo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPasswords ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Admin123!@#"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleLogin} 
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Kiểm Tra Đăng Nhập
              </Button>
            </div>

            {/* Login Result */}
            {loginResult && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Kết Quả Đăng Nhập:</h4>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(loginResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <Separator />

          {/* Demo Account Creation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Tạo Tài Khoản Demo</h3>
              <Button 
                onClick={createAllAccounts}
                disabled={creating !== null}
                variant="outline"
              >
                {creating ? 'Đang tạo...' : 'Tạo Tất Cả'}
              </Button>
            </div>

            <div className="grid gap-4">
              {demoAccounts.map((account) => (
                <Card key={account.email} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={account.role === 'admin' ? 'destructive' : 'default'}>
                          {account.role.toUpperCase()}
                        </Badge>
                        <span className="font-medium">{account.name}</span>
                      </div>
                      <Button
                        onClick={() => createDemoAccount(account)}
                        disabled={creating === account.email}
                        size="sm"
                        variant="outline"
                      >
                        {creating === account.email ? 'Đang tạo...' : 'Tạo'}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                        <div>
                          <span className="font-medium">Email:</span>
                          <span className="ml-2">{account.email}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => copyToClipboard(account.email, 'email')}
                            size="sm"
                            variant="ghost"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            onClick={() => {
                              setEmail(account.email);
                              setPassword(account.password);
                            }}
                            size="sm"
                            variant="ghost"
                          >
                            Chọn
                          </Button>
                        </div>
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Hướng dẫn:</strong> Nếu đăng nhập thất bại, hãy thử tạo tài khoản demo trước. 
              Sau khi tạo thành công, thử đăng nhập lại. Component này chỉ dành cho debug và sẽ được gỡ bỏ trong production.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
