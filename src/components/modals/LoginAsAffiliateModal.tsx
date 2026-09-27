import React from 'react';
import { ShieldAlert, ExternalLink, Building2 } from 'lucide-react';
import { Affiliate } from '../../types';
import {
  ModalShell,
  modalBtnPrimary,
  modalBtnSecondary,
} from './ModalShell';

interface LoginAsAffiliateModalProps {
  isOpen: boolean;
  affiliate: Affiliate | null;
  onClose: () => void;
  onConfirm: (affiliate: Affiliate) => void;
}

export const LoginAsAffiliateModal: React.FC<LoginAsAffiliateModalProps> = ({
  isOpen,
  affiliate,
  onClose,
  onConfirm,
}) => {
  if (!affiliate) return null;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Login as affiliate"
      description="Open this partner’s portal with an audited admin session."
      icon={<ShieldAlert className="w-5 h-5" />}
      headerTone="warning"
      maxWidth="md"
      footer={
        <>
          <button type="button" onClick={onClose} className={modalBtnSecondary}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(affiliate)}
            className={modalBtnPrimary}
          >
            <ExternalLink className="w-4 h-4" />
            Continue
          </button>
        </>
      }
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E4EAF0]">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: affiliate.primaryColor || '#12345F' }}
          >
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-base font-semibold text-[#12345F] truncate">
              {affiliate.name}
            </p>
            <p className="text-sm text-[#2D82C4] font-mono truncate">
              {affiliate.subdomain}
            </p>
          </div>
        </div>

        <p className="text-sm text-[#5B6B7C] leading-relaxed">
          You will enter the white-label portal for{' '}
          <span className="font-semibold text-[#12345F]">{affiliate.name}</span>.
          This action is recorded in the audit log.
        </p>

        <ul className="text-sm text-[#92400E] bg-[#FFFAEB] border border-[#FEDF89]/70 rounded-xl px-4 py-3 space-y-1.5 list-disc pl-8">
          <li>Admin identity is logged for compliance</li>
          <li>Actions are flagged as impersonation</li>
          <li>Session expires after inactivity</li>
        </ul>
      </div>
    </ModalShell>
  );
};
