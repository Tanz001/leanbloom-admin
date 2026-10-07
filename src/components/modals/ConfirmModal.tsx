import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ModalShell, modalBtnSecondary } from './ModalShell';

export type ConfirmIntent = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Extra warning lines shown in a callout box */
  consequences?: string[];
  /** Entity name highlighted in the body */
  entityName?: string;
  onConfirm: () => void | Promise<void>;
};

interface ConfirmModalProps {
  intent: ConfirmIntent | null;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  intent,
  onClose,
}) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!intent) return null;

  const handleConfirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await intent.onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const handleClose = () => {
    if (busy) return;
    setError(null);
    onClose();
  };

  return (
    <ModalShell
      isOpen
      onClose={handleClose}
      title={intent.title}
      description={intent.description}
      icon={<AlertTriangle className="w-5 h-5" />}
      headerTone="warning"
      maxWidth="md"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={busy}
            className={modalBtnSecondary}
          >
            {intent.cancelLabel || 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-[#B42318] hover:bg-[#912018] rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {busy ? 'Deleting…' : intent.confirmLabel || 'Delete'}
          </button>
        </>
      }
    >
      <div className="px-6 py-5 space-y-4">
        {intent.entityName && (
          <div className="rounded-xl border border-[#FEE4E2] bg-[#FEF3F2] px-4 py-3">
            <p className="text-xs font-medium text-[#912018] uppercase tracking-wide">
              You are about to delete
            </p>
            <p className="mt-1 text-sm font-semibold text-[#12345F] break-words">
              {intent.entityName}
            </p>
          </div>
        )}

        {intent.consequences && intent.consequences.length > 0 && (
          <div className="rounded-xl border border-[#E4EAF0] bg-[#F7F9FC] px-4 py-3">
            <p className="text-xs font-semibold text-[#12345F] mb-2">
              This will permanently remove:
            </p>
            <ul className="space-y-1.5">
              {intent.consequences.map((line) => (
                <li
                  key={line}
                  className="text-sm text-[#5B6B7C] flex items-start gap-2"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#B42318] shrink-0" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-[#7A8796]">
          This action cannot be undone.
        </p>

        {error && (
          <div className="rounded-xl border border-[#FECDCA] bg-[#FEF3F2] px-3.5 py-2.5 text-sm text-[#B42318]">
            {error}
          </div>
        )}
      </div>
    </ModalShell>
  );
};
