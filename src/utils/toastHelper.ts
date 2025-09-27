import { toast } from 'sonner';

// Export wrapped toast functions using sonner (async for compatibility)
export const showSuccess = async (message: string) => {
  toast.success(message);
};

export const showError = async (message: string) => {
  toast.error(message);
};

export const showInfo = async (message: string) => {
  toast.info(message);
};

export const showWarning = async (message: string) => {
  toast.warning(message);
};

// Default export for convenience
export default {
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning
};
