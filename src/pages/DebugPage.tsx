import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Database, 
  Server, 
  User,
  Eye,
  EyeOff,
  Copy,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export function DebugPage() {
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [testResults, setTestResults] = useState<any>({});
  const [email, setEmail] = useState('admin@japancenter.demo');
  const [password, setPassword] = useState('Admin123!@#');
  
  const { signIn, signUp, user, session } = useAuth();

  const demoAccounts = [
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

  // Test 1: Check Supabase Connection
  const testSupabaseConnection = async () => {
    try {
      setTestResults(prev => ({ ...prev, supabase: { status: 'testing', message: 'Testing...' } }));
      
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2c1a01cc/health`;
      
      console.log('Testing health endpoint:', healthUrl);
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      const result = await response.json();
      console.log('Health check result:', result);
      
      if (response.ok && result.status === 'ok') {
        setTestResults(prev => ({ 
          ...prev, 
          supabase: { 
            status: 'success', 
            message: 'Connection OK',
            data: { projectId, result }
          } 
        }));
        return true;
      } else {
        throw new Error(`Health check failed: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      setTestResults(prev => ({ 
        ...prev, 
        supabase: { 
          status: 'error', 
          message: error instanceof Error ? error.message : 'Connection failed' 
        } 
      }));
      return false;
    }
  };

  // Test 2: Setup Demo Accounts
  const testSetupDemo = async () => {
    try {
      setTestResults(prev => ({ ...prev, setup: { status: 'testing', message: 'Setting up...' } }));
      
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2c1a01cc/setup-demo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      const result = await response.json();
      console.log('Setup demo result:', result);
      
      if (result.success) {
        setTestResults(prev => ({ 
          ...prev, 
          setup: { 
            status: 'success', 
            message: 'Demo accounts ready',
            data: result.results
          } 
        }));
        return true;
      } else {
        throw new Error(result.error || 'Setup failed');
      }
    } catch (error) {
      console.error('Setup demo failed:', error);
      setTestResults(prev => ({ 
        ...prev, 
        setup: { 
          status: 'error', 
          message: error instanceof Error ? error.message : 'Setup failed' 
        } 
      }));
      return false;
    }
  };

  // Test 3: Test Login
  const testLogin = async () => {
    try {
      setTestResults(prev => ({ ...prev, login: { status: 'testing', message: 'Logging in...' } }));
      
      console.log('Testing login with:', { email, password: '***' });
      
      const result = await signIn(email, password);
      console.log('Login result:', result);
      
      if (result.error) {
        throw new Error(result.error.message || 'Login failed');
      }
      
      setTestResults(prev => ({ 
        ...prev, 
        login: { 
          status: 'success', 
          message: 'Login successful',
          data: result.data
        } 
      }));
      return true;
    } catch (error) {
      console.error('Login test failed:', error);
      setTestResults(prev => ({ 
        ...prev, 
        login: { 
          status: 'error', 
          message: error instanceof Error ? error.message : 'Login failed' 
        } 
      }));
      return false;
    }
  };

  // Test 4: Check Current User
  const testCurrentUser = async () => {
    try {
      setTestResults(prev => ({ ...prev, user: { status: 'testing', message: 'Checking user...' } }));
      
      if (user && session) {
        setTestResults(prev => ({ 
          ...prev, 
          user: { 
            status: 'success', 
            message: 'User authenticated',
            data: {
              id: user.id,
              email: user.email,
              role: user.user_metadata?.role,
              session: !!session
            }
          } 
        }));
        return true;
      } else {
        setTestResults(prev => ({ 
          ...prev, 
          user: { 
            status: 'error', 
            message: 'No authenticated user' 
          } 
        }));
        return false;
      }
    } catch (error) {
      console.error('User check failed:', error);
      setTestResults(prev => ({ 
        ...prev, 
        user: { 
          status: 'error', 
          message: error instanceof Error ? error.message : 'User check failed' 
        } 
      }));
      return false;
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setLoading(true);
    setTestResults({});
    
    try {
      console.log('🧪 Starting diagnostic tests...');
      
      // Test 1: Supabase Connection
      await testSupabaseConnection();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test 2: Setup Demo
      await testSetupDemo();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test 3: Login
      await testLogin();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test 4: Current User
      await testCurrentUser();
      
      console.log('🎉 All tests completed');
    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manual account creation
  const createAccount = async (account: any) => {
    try {
      const result = await signUp(account.email, account.password, {
        fullName: account.name,
        name: account.name,
        role: account.role
      });

      if (result.error) {
        if (result.error.message?.includes('already registered')) {
          toast.success(`${account.role} account already exists`);
        } else {
          throw new Error(result.error.message);
        }
      } else {
        toast.success(`Created ${account.role} account successfully`);
      }
    } catch (error) {
      toast.error(`Failed to create ${account.role} account: ${error}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'testing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'testing':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Login Debug & Diagnostic
          </CardTitle>
          <CardDescription>
            Complete diagnostic tool for troubleshooting login issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Status */}
            {user && (
              <Alert>
                <User className="h-4 w-4" />
                <AlertDescription>
                  <strong>Currently logged in:</strong> {user.email} - Role: 
                  <Badge className="ml-2">{user.user_metadata?.role || 'student'}</Badge>
                </AlertDescription>
              </Alert>
            )}

            {/* Quick Actions */}
            <div className="flex gap-4">
              <Button 
                onClick={runAllTests}
                disabled={loading}
                className="flex-1"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <RefreshCw className="mr-2 h-4 w-4" />
                Run Full Diagnostic
              </Button>
            </div>

            <Separator />

            <Tabs defaultValue="tests" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tests">Test Results</TabsTrigger>
                <TabsTrigger value="login">Manual Login</TabsTrigger>
                <TabsTrigger value="accounts">Demo Accounts</TabsTrigger>
              </TabsList>

              <TabsContent value="tests" className="space-y-4">
                <h3 className="text-lg font-medium">Diagnostic Results</h3>
                
                {/* Test Results */}
                <div className="grid gap-4">
                  {[
                    { key: 'supabase', title: 'Supabase Connection', icon: Server },
                    { key: 'setup', title: 'Demo Account Setup', icon: Database },
                    { key: 'login', title: 'Login Test', icon: User },
                    { key: 'user', title: 'User Status', icon: CheckCircle }
                  ].map(({ key, title, icon: Icon }) => {
                    const result = testResults[key];
                    return (
                      <Card key={key} className={getStatusColor(result?.status)}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5" />
                              <div>
                                <h4 className="font-medium">{title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {result?.message || 'Not tested'}
                                </p>
                              </div>
                            </div>
                            {getStatusIcon(result?.status)}
                          </div>
                          {result?.data && (
                            <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
                              <pre>{JSON.stringify(result.data, null, 2)}</pre>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="login" className="space-y-4">
                <h3 className="text-lg font-medium">Manual Login Test</h3>
                
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-email">Email</Label>
                    <Input
                      id="test-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="test-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="test-password"
                        type={showPasswords ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                  <Button onClick={testLogin} disabled={loading}>
                    Test Login
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="accounts" className="space-y-4">
                <h3 className="text-lg font-medium">Demo Accounts Management</h3>
                
                <div className="grid gap-4">
                  {demoAccounts.map((account) => (
                    <Card key={account.email}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{account.name}</h4>
                            <Badge variant={account.role === 'admin' ? 'destructive' : 'default'}>
                              {account.role.toUpperCase()}
                            </Badge>
                          </div>
                          <Button
                            onClick={() => createAccount(account)}
                            size="sm"
                            variant="outline"
                          >
                            Create Account
                          </Button>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between p-2 bg-muted rounded">
                            <span>Email: {account.email}</span>
                            <Button
                              onClick={() => {
                                navigator.clipboard.writeText(account.email);
                                toast.success('Email copied');
                              }}
                              size="sm"
                              variant="ghost"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-2 bg-muted rounded">
                            <span>Password: {showPasswords ? account.password : '••••••••••'}</span>
                            <Button
                              onClick={() => {
                                navigator.clipboard.writeText(account.password);
                                toast.success('Password copied');
                              }}
                              size="sm"
                              variant="ghost"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            onClick={() => {
                              setEmail(account.email);
                              setPassword(account.password);
                              toast.success('Credentials loaded for testing');
                            }}
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            Load for Testing
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
