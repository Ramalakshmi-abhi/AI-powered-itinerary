import toast from 'react-hot-toast';

const baseStyle = {
  background: 'var(--bg-surface2)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  fontSize: '0.875rem',
  fontFamily: "'Inter', sans-serif",
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  padding: '12px 16px',
};

export const useToast = () => {
  const success = (message, options = {}) =>
    toast.success(message, {
      style: { ...baseStyle, borderLeft: '3px solid #10B981' },
      iconTheme: { primary: '#10B981', secondary: 'var(--bg-surface2)' },
      duration: 3000,
      ...options,
    });

  const error = (message, options = {}) =>
    toast.error(message, {
      style: { ...baseStyle, borderLeft: '3px solid #EF4444' },
      iconTheme: { primary: '#EF4444', secondary: 'var(--bg-surface2)' },
      duration: 4000,
      ...options,
    });

  const warning = (message, options = {}) =>
    toast(message, {
      icon: '⚠️',
      style: { ...baseStyle, borderLeft: '3px solid #F59E0B' },
      duration: 3500,
      ...options,
    });

  const info = (message, options = {}) =>
    toast(message, {
      icon: 'ℹ️',
      style: { ...baseStyle, borderLeft: '3px solid #06B6D4' },
      duration: 3000,
      ...options,
    });

  const loading = (message, options = {}) =>
    toast.loading(message, {
      style: baseStyle,
      ...options,
    });

  const dismiss = (toastId) => toast.dismiss(toastId);

  const promise = (promise, messages) =>
    toast.promise(promise, messages, {
      style: baseStyle,
      success: { style: { ...baseStyle, borderLeft: '3px solid #10B981' } },
      error: { style: { ...baseStyle, borderLeft: '3px solid #EF4444' } },
    });

  return { success, error, warning, info, loading, dismiss, promise };
};

export default useToast;
