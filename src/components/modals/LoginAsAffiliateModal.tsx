import React from 'react';
import { ShieldAlert, ExternalLink, X, Building2 } from 'lucide-react';
import { Affiliate } from '../../types';

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
  onConfirm
}) => {
  if (!isOpen || !affiliate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-[#E4E7EC] shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E4E7EC] flex items-center justify-between bg-[#FEF3F2]">
          <div className="flex items-center gap-2.5 text-[#B42318]">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <h3 className="text-sm font-bold text-[#172033]">Impersonate Affiliate Tenant</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#667085] hover:text-[#172033] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5">
          <div className="flex items-center gap-3 p-3 bg-[#F8F9FC] rounded-lg border border-[#E4E7EC]">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: affiliate.primaryColor || '#173B72' }}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#172033]">{affiliate.name}</p>
              <p className="text-xs text-[#2D82C4] font-mono">{affiliate.subdomain}</p>
            </div>
          </div>

          <p className="text-xs text-[#344054] leading-relaxed">
            You are about to launch an authenticated session inside the isolated white-label portal for{' '}
            <strong className="text-[#172033]">{affiliate.name}</strong>.
          </p>

          <div className="p-3 bg-[#FFF9F5] border border-[#FEDF89] rounded-lg text-xs text-[#B54708] space-y-1">
            <p className="font-semibold">Security & Audit Compliance Notice:</p>
            <ul className="list-disc pl-4 text-[11px] space-y-0.5">
              <li>Master Admin identity will be logged in permanent HIPAA audit trails.</li>
              <li>Affiliate actions taken during this session will carry an impersonation flag.</li>
              <li>Session automatically expires after 60 minutes of inactivity.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#E4E7EC] bg-[#F8F9FC] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] rounded-lg hover:bg-[#F2F4F7] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-impersonate-btn"
            onClick={() => onConfirm(affiliate)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Launch Affiliate Session
          </button>
        </div>
      </div>
    </div>
  );
};
