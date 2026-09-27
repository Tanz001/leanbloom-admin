import React from 'react';
import { X, ChevronDown } from 'lucide-react';

export const modalInputClass =
  'w-full px-3.5 py-2.5 text-sm border border-[#E4EAF0] rounded-xl bg-white text-[#12345F] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2D82C4]/25 focus:border-[#2D82C4] transition-shadow';

export const modalSelectClass =
  'w-full appearance-none pl-3.5 pr-10 py-2.5 text-sm border border-[#E4EAF0] rounded-xl bg-white text-[#12345F] focus:outline-none focus:ring-2 focus:ring-[#2D82C4]/25 focus:border-[#2D82C4] transition-shadow cursor-pointer';

export const modalLabelClass =
  'block text-sm font-medium text-[#12345F] mb-1.5';

export const modalHintClass = 'mt-1.5 text-xs text-[#7A8796] leading-relaxed';

export const modalBtnSecondary =
  'px-4 py-2.5 text-sm font-medium text-[#475467] bg-white border border-[#E4EAF0] rounded-xl hover:bg-[#F7F9FC] transition-colors';

export const modalBtnPrimary =
  'px-4 py-2.5 text-sm font-semibold text-white bg-[#12345F] hover:bg-[#0B2440] rounded-xl transition-colors inline-flex items-center justify-center gap-1.5';

export const modalBtnAccent =
  'px-4 py-2.5 text-sm font-semibold text-white bg-lb-gradient hover:opacity-95 rounded-xl transition-opacity inline-flex items-center justify-center gap-1.5';

type ModalSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const ModalSelect: React.FC<ModalSelectProps> = ({
  className = '',
  children,
  ...props
}) => (
  <div className="relative">
    <select className={`${modalSelectClass} ${className}`.trim()} {...props}>
      {children}
    </select>
    <ChevronDown
      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8796]"
      aria-hidden
    />
  </div>
);

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerTone?: 'default' | 'warning';
}

const maxWidthClass = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export const ModalShell: React.FC<ModalShellProps> = ({
  isOpen,
  onClose,
  title,
  description,
  icon,
  maxWidth = 'lg',
  children,
  footer,
  headerTone = 'default',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2440]/45 backdrop-blur-[2px]">
      <div
        className={`bg-white rounded-2xl border border-[#E4EAF0] shadow-[0_24px_64px_rgba(11,36,64,0.18)] w-full ${maxWidthClass[maxWidth]} overflow-hidden flex flex-col max-h-[90vh]`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className={`px-6 py-5 border-b border-[#E4EAF0] flex items-start justify-between gap-4 ${
            headerTone === 'warning' ? 'bg-[#FFF8F6]' : 'bg-white'
          }`}
        >
          <div className="flex items-start gap-3 min-w-0">
            {icon && (
              <div
                className={`p-2.5 rounded-xl flex-shrink-0 ${
                  headerTone === 'warning'
                    ? 'bg-[#FEE4E2] text-[#B42318]'
                    : 'bg-[#EAF4FB] text-[#2D82C4]'
                }`}
              >
                {icon}
              </div>
            )}
            <div className="min-w-0 pt-0.5">
              <h3
                id="modal-title"
                className="font-display text-lg font-semibold text-[#12345F] tracking-tight leading-snug"
              >
                {title}
              </h3>
              {description && (
                <p className="mt-1 text-sm text-[#5B6B7C] leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-1 text-[#9CA3AF] hover:text-[#12345F] hover:bg-[#F3F4F6] rounded-xl transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-[#E4EAF0] bg-white flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
