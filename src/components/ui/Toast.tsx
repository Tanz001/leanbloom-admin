import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastTone = 'success' | 'error' | 'info';

type ToastItem = {
  id: string;
  message: string;
  tone: ToastTone;
};

type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

const TONE_STYLES: Record<
  ToastTone,
  { iconBg: string; icon: React.ReactNode; border: string }
> = {
  success: {
    iconBg: 'bg-[#4FAF4A]/15 text-[#3A8F36]',
    border: 'border-[#4FAF4A]/25',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  error: {
    iconBg: 'bg-red-50 text-red-600',
    border: 'border-red-200',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  info: {
    iconBg: 'bg-[#2D82C4]/12 text-[#12345F]',
    border: 'border-[#2D82C4]/20',
    icon: <Info className="w-4 h-4" />,
  },
};

function ToastHost({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 w-[min(100vw-2rem,22rem)] pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const style = TONE_STYLES[t.tone];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white px-4 py-3 shadow-lg shadow-[#12345F]/10 ${style.border}`}
            >
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.iconBg}`}
              >
                {style.icon}
              </div>
              <p className="flex-1 pt-1 text-sm font-medium text-[#0F1C2E] leading-snug">
                {t.message}
              </p>
              <button
                type="button"
                onClick={() => onDismiss(t.id)}
                className="shrink-0 rounded-lg p-1 text-[#5B6B7C]/60 hover:text-[#0F1C2E] hover:bg-[#F3F6F9] transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, tone: ToastTone) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev.slice(-4), { id, message, tone }]);
      window.setTimeout(() => dismiss(id), 3800);
    },
    [dismiss]
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => show(message, 'success'),
      error: (message) => show(message, 'error'),
      info: (message) => show(message, 'info'),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastHost toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
