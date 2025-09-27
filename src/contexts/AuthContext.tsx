"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase/client';
import { UserRole, hasPermission, canAccessDashboard, ROLE_CONFIGS } from '../types/roles';

interface ExtendedUser extends User {
  role?: UserRole;
  user_metadata: {
    name?: string;
    role?: UserRole;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  loading: boolean;
  userRole: UserRole;
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ data?: any; error?: any }>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  canAccessDashboard: (dashboardType: 'student' | 'teacher' | 'admin') => boolean;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Get user role with fallback
  const userRole: UserRole = user?.user_metadata?.role || 'guest';

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // Add default role if not specified
      const userDataWithRole = {
        ...userData,
        role: userData.role || 'student' // Default to student role
      };

      // Create user via our Next.js API endpoint
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          userData: userDataWithRole
        })
      });

      const result = await response.json();
      if (!response.ok) {
        return { error: result.error || 'Đăng ký thất bại' };
      }

      // Then sign in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      return { data, error };
    } catch (error) {
      console.error('Signup error:', error);
      return { error: 'Có lỗi xảy ra khi đăng ký' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Starting sign in process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('🔐 Supabase signIn response:', { 
        hasData: !!data, 
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        error: error ? { message: error.message, status: error.status } : null 
      });
      
      if (data?.user) {
        console.log('🔐 User data:', {
          id: data.user.id,
          email: data.user.email,
          role: data.user.user_metadata?.role,
          metadata: data.user.user_metadata
        });
      }
      
      return { data, error };
    } catch (error) {
      console.error('🔐 Sign in error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const hasUserPermission = (permission: string): boolean => {
    return hasPermission(userRole, permission);
  };

  const canUserAccessDashboard = (dashboardType: 'student' | 'teacher' | 'admin'): boolean => {
    return canAccessDashboard(userRole, dashboardType);
  };

  const updateUserRole = async (userId: string, newRole: UserRole): Promise<{ success: boolean; error?: string }> => {
    try {
      // Only admin can update roles
      if (userRole !== 'admin') {
        return { success: false, error: 'Bạn không có quyền thay đổi vai trò người dùng' };
      }

      const response = await fetch(`/api/user/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      const result = await response.json();
      if (!response.ok) {
        return { success: false, error: result.error || 'Cập nhật vai trò thất bại' };
      }

      return { success: true };
    } catch (error) {
      console.error('Update role error:', error);
      return { success: false, error: 'Có lỗi xảy ra khi cập nhật vai trò' };
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Gửi email thất bại' };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: 'Có lỗi xảy ra khi gửi email đặt lại mật khẩu' };
    }
  };

  const resetPassword = async (token: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword, confirmPassword })
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Đặt lại mật khẩu thất bại' };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Có lỗi xảy ra khi đặt lại mật khẩu' };
    }
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    signIn,
    signUp,
    signOut,
    hasPermission: hasUserPermission,
    canAccessDashboard: canUserAccessDashboard,
    updateUserRole,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
