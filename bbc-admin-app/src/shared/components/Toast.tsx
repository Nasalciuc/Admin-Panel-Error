/**
 * Simple auto-dismiss toast notification.
 * Used by Settings page on save, Leads on export, etc.
 *
 * Usage:
 * const [toast, setToast] = useState<string | null>(null);
 * <Toast message={toast} onDismiss={() => setToast(null)} />
 * // trigger: setToast('Settings saved!')
 */
import React, { useEffect, useRef } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface Props {
  message: string | null;
  variant?: 'success' | 'error';
  duration?: number; // ms, default 3000
  onDismiss: () => void;
}

export const Toast: React.FC<Props> = ({ message, variant = 'success', duration = 3000, onDismiss }) => {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onDismissRef.current(), duration);
    return () => clearTimeout(timer);
  }, [message, duration]);

  if (!message) return null;

  const styles = variant === 'success'
    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
    : 'bg-red-50 border-red-200 text-red-800';

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${styles} animate-in fade-in slide-in-from-top-2`}>
      <CheckCircle2 className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onDismiss} className="ml-2 opacity-60 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
