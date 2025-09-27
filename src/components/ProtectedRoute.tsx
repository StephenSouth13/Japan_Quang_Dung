import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, PERMISSIONS } from '../types/roles';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Shield, Lock, AlertTriangle, UserX, Crown } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
  requiredPermissions?: string[];
  dashboardType?: 'student' | 'teacher' | 'admin';
  fallback?: ReactNode;
  showFallback?: boolean;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  requiredPermissions,
  dashboardType,
  fallback,
  showFallback = true
}: ProtectedRouteProps) {
  const { user, userRole, hasPermission, canAccessDashboard } = useAuth();

  // Check if user is authenticated (if specific role is required)
  if (requiredRole && requiredRole !== 'guest' && !user) {
    if (!showFallback) return null;
    
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserX className="w-8 h-8 text-amber-600" />
            </div>
            <CardTitle>Yêu cầu đăng nhập</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Bạn cần đăng nhập để truy cập tính năng này.
            </p>
            <Button onClick={() => window.location.reload()}>
              Đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role requirement
  if (requiredRole && userRole !== requiredRole) {
    // Allow higher roles to access lower role content
    const roleHierarchy: UserRole[] = ['guest', 'student', 'teacher', 'admin'];
    const currentRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
    
    if (currentRoleIndex < requiredRoleIndex) {
      if (!showFallback) return null;
      
      return fallback || (
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle>Không có quyền truy cập</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Tính năng này yêu cầu vai trò:
                </p>
                <Badge variant="destructive" className="text-sm">
                  <Crown className="w-3 h-3 mr-1" />
                  {requiredRole === 'admin' ? 'Quản trị viên' : 
                   requiredRole === 'teacher' ? 'Giáo viên' : 
                   requiredRole === 'student' ? 'Học viên' : requiredRole}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Vai trò hiện tại của bạn: 
                  <Badge variant="outline" className="ml-2">
                    {userRole === 'admin' ? 'Quản trị viên' : 
                     userRole === 'teacher' ? 'Giáo viên' : 
                     userRole === 'student' ? 'Học viên' : 'Khách'}
                  </Badge>
                </p>
              </div>
              <Button variant="outline" onClick={() => window.history.back()}>
                Quay lại
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Check single permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (!showFallback) return null;
    
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle>Quyền truy cập bị hạn chế</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Bạn không có quyền thực hiện hành động này.
            </p>
            <p className="text-xs text-muted-foreground">
              Quyền yêu cầu: <code className="bg-muted px-1 rounded">{requiredPermission}</code>
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check multiple permissions requirement
  if (requiredPermissions && !requiredPermissions.every(permission => hasPermission(permission))) {
    if (!showFallback) return null;
    
    const missingPermissions = requiredPermissions.filter(permission => !hasPermission(permission));
    
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle>Thiếu quyền truy cập</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Bạn không có đủ quyền để thực hiện hành động này.
            </p>
            <div className="text-xs text-muted-foreground">
              <p className="mb-2">Quyền bị thiếu:</p>
              <div className="space-y-1">
                {missingPermissions.map(permission => (
                  <code key={permission} className="block bg-muted px-2 py-1 rounded">
                    {permission}
                  </code>
                ))}
              </div>
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check dashboard access requirement
  if (dashboardType && !canAccessDashboard(dashboardType)) {
    if (!showFallback) return null;
    
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle>Không thể truy cập Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Bạn không có quyền truy cập {dashboardType === 'admin' ? 'dashboard quản trị' : 
                                        dashboardType === 'teacher' ? 'dashboard giáo viên' : 
                                        'dashboard học viên'}.
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
}

// Higher-order component for easier usage
export function withProtection<P extends object>(
  Component: React.ComponentType<P>,
  protectionOptions: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...protectionOptions}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Specific protection components for common use cases
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function TeacherOrAdmin({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="teacher" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function StudentOrHigher({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="student" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function DashboardProtection({ 
  children, 
  type,
  fallback 
}: { 
  children: ReactNode; 
  type: 'student' | 'teacher' | 'admin';
  fallback?: ReactNode;
}) {
  return (
    <ProtectedRoute dashboardType={type} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}
