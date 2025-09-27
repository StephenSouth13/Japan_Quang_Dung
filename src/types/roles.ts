// User roles and permissions system

export type UserRole = 'guest' | 'student' | 'teacher' | 'admin';

export interface Permission {
  resource: string;
  actions: string[];
}

export interface RoleConfig {
  name: UserRole;
  displayName: string;
  permissions: Permission[];
  description: string;
}

// Define all possible permissions
export const PERMISSIONS = {
  // Course management
  COURSES: {
    VIEW: 'courses:view',
    CREATE: 'courses:create', 
    EDIT: 'courses:edit',
    DELETE: 'courses:delete',
    ENROLL: 'courses:enroll'
  },
  
  // Quiz management
  QUIZ: {
    VIEW: 'quiz:view',
    TAKE: 'quiz:take',
    CREATE: 'quiz:create',
    EDIT: 'quiz:edit', 
    DELETE: 'quiz:delete',
    VIEW_RESULTS: 'quiz:view_results',
    VIEW_ALL_RESULTS: 'quiz:view_all_results'
  },
  
  // User management
  USERS: {
    VIEW: 'users:view',
    CREATE: 'users:create',
    EDIT: 'users:edit',
    DELETE: 'users:delete',
    VIEW_PROFILE: 'users:view_profile'
  },
  
  // Registration management
  REGISTRATIONS: {
    VIEW: 'registrations:view',
    APPROVE: 'registrations:approve',
    REJECT: 'registrations:reject',
    CREATE: 'registrations:create'
  },
  
  // Notification management
  NOTIFICATIONS: {
    VIEW: 'notifications:view',
    CREATE: 'notifications:create',
    SEND: 'notifications:send',
    MANAGE: 'notifications:manage'
  },
  
  // Dashboard access
  DASHBOARD: {
    STUDENT: 'dashboard:student',
    TEACHER: 'dashboard:teacher', 
    ADMIN: 'dashboard:admin'
  },

  // Settings management
  SETTINGS: {
    VIEW: 'settings:view',
    EDIT: 'settings:edit'
  }
} as const;

// Role configurations
export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  guest: {
    name: 'guest',
    displayName: 'Khách',
    description: 'Người dùng chưa đăng nhập',
    permissions: [
      {
        resource: 'courses',
        actions: [PERMISSIONS.COURSES.VIEW]
      },
      {
        resource: 'registrations', 
        actions: [PERMISSIONS.REGISTRATIONS.CREATE]
      }
    ]
  },

  student: {
    name: 'student',
    displayName: 'Học viên',
    description: 'Học viên của trung tâm',
    permissions: [
      {
        resource: 'courses',
        actions: [PERMISSIONS.COURSES.VIEW, PERMISSIONS.COURSES.ENROLL]
      },
      {
        resource: 'quiz',
        actions: [PERMISSIONS.QUIZ.VIEW, PERMISSIONS.QUIZ.TAKE, PERMISSIONS.QUIZ.VIEW_RESULTS]
      },
      {
        resource: 'dashboard',
        actions: [PERMISSIONS.DASHBOARD.STUDENT]
      },
      {
        resource: 'users',
        actions: [PERMISSIONS.USERS.VIEW_PROFILE]
      },
      {
        resource: 'notifications',
        actions: [PERMISSIONS.NOTIFICATIONS.VIEW]
      },
      {
        resource: 'registrations',
        actions: [PERMISSIONS.REGISTRATIONS.CREATE]
      }
    ]
  },

  teacher: {
    name: 'teacher', 
    displayName: 'Giáo viên',
    description: 'Giáo viên của trung tâm',
    permissions: [
      {
        resource: 'courses',
        actions: [PERMISSIONS.COURSES.VIEW, PERMISSIONS.COURSES.CREATE, PERMISSIONS.COURSES.EDIT]
      },
      {
        resource: 'quiz',
        actions: [
          PERMISSIONS.QUIZ.VIEW, 
          PERMISSIONS.QUIZ.CREATE, 
          PERMISSIONS.QUIZ.EDIT, 
          PERMISSIONS.QUIZ.DELETE,
          PERMISSIONS.QUIZ.VIEW_ALL_RESULTS
        ]
      },
      {
        resource: 'dashboard',
        actions: [PERMISSIONS.DASHBOARD.TEACHER, PERMISSIONS.DASHBOARD.STUDENT]
      },
      {
        resource: 'users',
        actions: [PERMISSIONS.USERS.VIEW, PERMISSIONS.USERS.VIEW_PROFILE]
      },
      {
        resource: 'notifications',
        actions: [PERMISSIONS.NOTIFICATIONS.VIEW, PERMISSIONS.NOTIFICATIONS.CREATE, PERMISSIONS.NOTIFICATIONS.SEND]
      },
      {
        resource: 'registrations',
        actions: [PERMISSIONS.REGISTRATIONS.VIEW]
      }
    ]
  },

  admin: {
    name: 'admin',
    displayName: 'Quản trị viên', 
    description: 'Quản trị viên hệ thống',
    permissions: [
      {
        resource: 'courses',
        actions: Object.values(PERMISSIONS.COURSES)
      },
      {
        resource: 'quiz', 
        actions: Object.values(PERMISSIONS.QUIZ)
      },
      {
        resource: 'users',
        actions: Object.values(PERMISSIONS.USERS)
      },
      {
        resource: 'registrations',
        actions: Object.values(PERMISSIONS.REGISTRATIONS)
      },
      {
        resource: 'notifications',
        actions: Object.values(PERMISSIONS.NOTIFICATIONS)
      },
      {
        resource: 'dashboard',
        actions: Object.values(PERMISSIONS.DASHBOARD)
      },
      {
        resource: 'settings',
        actions: Object.values(PERMISSIONS.SETTINGS)
      }
    ]
  }
};

// Helper functions for role and permission checking
export function hasPermission(userRole: UserRole, permission: string): boolean {
  const roleConfig = ROLE_CONFIGS[userRole];
  if (!roleConfig) return false;
  
  return roleConfig.permissions.some(perm => 
    perm.actions.includes(permission)
  );
}

export function hasAnyPermission(userRole: UserRole, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

export function hasAllPermissions(userRole: UserRole, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

export function canAccessDashboard(userRole: UserRole, dashboardType: 'student' | 'teacher' | 'admin'): boolean {
  const permissionMap = {
    student: PERMISSIONS.DASHBOARD.STUDENT,
    teacher: PERMISSIONS.DASHBOARD.TEACHER,
    admin: PERMISSIONS.DASHBOARD.ADMIN
  };
  
  return hasPermission(userRole, permissionMap[dashboardType]);
}

export function getRoleHierarchy(): UserRole[] {
  return ['guest', 'student', 'teacher', 'admin'];
}

export function isRoleHigherThan(role1: UserRole, role2: UserRole): boolean {
  const hierarchy = getRoleHierarchy();
  return hierarchy.indexOf(role1) > hierarchy.indexOf(role2);
}
