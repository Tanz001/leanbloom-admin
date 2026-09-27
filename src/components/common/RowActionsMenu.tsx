import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';

export type RowActionItem = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  tone?: 'default' | 'danger';
  disabled?: boolean;
};

interface RowActionsMenuProps {
  items: RowActionItem[];
  align?: 'left' | 'right';
}

export const RowActionsMenu: React.FC<RowActionsMenuProps> = ({
  items,
  align = 'right',
}) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 188;
    const left =
      align === 'right'
        ? Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8)
        : Math.max(8, rect.left);
    setCoords({
      top: rect.bottom + 4,
      left: Math.max(8, left),
    });
  }, [open, align]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        !buttonRef.current?.contains(t) &&
        !menuRef.current?.contains(t)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onScroll = () => setOpen(false);

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={`p-2 rounded-lg transition-colors ${
          open
            ? 'bg-[#EAF4FB] text-[#12345F]'
            : 'text-[#667085] hover:text-[#12345F] hover:bg-[#F2F4F7]'
        }`}
        aria-label="Open actions"
        aria-expanded={open}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open &&
        coords &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-[80] min-w-[188px] bg-white border border-[#E4EAF0] rounded-xl shadow-[0_12px_32px_rgba(11,36,64,0.14)] py-1.5 overflow-hidden"
            style={{ top: coords.top, left: coords.left }}
            role="menu"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  item.onClick();
                }}
                className={`w-full px-3.5 py-2.5 text-left text-sm font-medium flex items-center gap-2.5 transition-colors disabled:opacity-50 ${
                  item.tone === 'danger'
                    ? 'text-[#B42318] hover:bg-[#FEF3F2]'
                    : 'text-[#12345F] hover:bg-[#F7F9FC]'
                }`}
              >
                {item.icon && (
                  <span className="flex-shrink-0 opacity-80">{item.icon}</span>
                )}
                {item.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};
