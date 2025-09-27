import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    const duration = notification.duration || 3000;
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Listen for custom notification events
  React.useEffect(() => {
    const handleNotification = (event: any) => {
      const { type, message, duration } = event.detail;
      addNotification({ type, message, duration });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('simple-notification', handleNotification);
      return () => {
        window.removeEventListener('simple-notification', handleNotification);
      };
    }
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

function NotificationContainer() {
  const context = useContext(NotificationContext);
  if (!context) return null;
  
  const { notifications, removeNotification } = context;

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

function NotificationItem({ notification, onClose }: { 
  notification: Notification; 
  onClose: () => void; 
}) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  return (
    <div className={`
      p-4 rounded-lg border shadow-lg backdrop-blur-sm
      transform transition-all duration-300 ease-in-out
      animate-in slide-in-from-right-full
      ${getBgColor()}
    `}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {notification.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Hook to use notifications
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

// Simple toast API for compatibility
export const simpleToast = {
  success: (message: string, duration?: number) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('simple-notification', {
        detail: { type: 'success', message, duration }
      });
      window.dispatchEvent(event);
    }
  },
  error: (message: string, duration?: number) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('simple-notification', {
        detail: { type: 'error', message, duration }
      });
      window.dispatchEvent(event);
    }
  },
  info: (message: string, duration?: number) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('simple-notification', {
        detail: { type: 'info', message, duration }
      });
      window.dispatchEvent(event);
    }
  },
  warning: (message: string, duration?: number) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('simple-notification', {
        detail: { type: 'warning', message, duration }
      });
      window.dispatchEvent(event);
    }
  }
};
