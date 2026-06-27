import { toast } from 'sonner';

/**
 * useNotify – A custom hook that wraps the Sonner toast functions to enforce
 * a consistent notification strategy across the BettaPay application.
 *
 * - success: 3 seconds
 * - error:   5 seconds
 * - info:    4 seconds
 * - silent:  No visual toast (placeholder for background tasks)
 */
export const useNotify = () => {
  const success = (message: string) => {
    toast.success(message, { duration: 3000 });
  };

  const error = (message: string) => {
    toast.error(message, { duration: 5000 });
  };

  const info = (message: string) => {
    toast.info(message, { duration: 4000 });
  };

  // Silent handler – can be used for background tasks that should not show UI.
  const silent = () => {};

  return { success, error, info, silent };
};
