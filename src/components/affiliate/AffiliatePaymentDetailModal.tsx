import React from 'react';
import {
  X,
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { AffiliatePaymentPayout } from '../../types';

interface AffiliatePaymentDetailModalProps {
  payment: AffiliatePaymentPayout | null;
  onClose: () => void;
}

export const AffiliatePaymentDetailModal: React.FC<AffiliatePaymentDetailModalProps> = ({
  payment,
  onClose
}) => {
  if (!payment) return null;

  const handleDownloadReceipt = () => {
    // Generate a downloadable text receipt for the payment
    const receiptContent = `
LEANBLOOM AFFILIATE PAYOUT RECEIPT
====================================
Disbursement Ref: ${payment.reference}
Payment ID: ${payment.id}
Affiliate Tenant: ${payment.affiliateId}
Date Processed: ${payment.date}
Disbursement Method: ${payment.method}
Destination Account: ${payment.accountDestination}
Orders Reconciled: ${payment.coveredOrdersCount}
Net Disbursed Amount: $${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
Status: ${payment.status}
====================================
Issued by LeanBloom Health Inc.
Thank you for your ongoing partnership.
`;
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LeanBloom-Receipt-${payment.reference}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#123B70]/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-10">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F7F9FC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF5EA] text-[#4A9B52] flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#172033] font-mono">{payment.reference}</h3>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#EAF5EA] text-[#4A9B52]">
                  {payment.status}
                </span>
              </div>
              <p className="text-xs text-[#667085]">Disbursement on {payment.date}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#667085] hover:text-[#172033] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Big Amount Card */}
          <div className="p-5 bg-gradient-to-br from-[#174A87]/5 to-[#4A9B52]/5 rounded-xl border border-[#174A87]/15 text-center">
            <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block mb-1">
              Net Commission Payout
            </span>
            <div className="text-3xl font-black text-[#174A87]">
              ${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#4A9B52] mt-1 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Deposited via {payment.method}</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
              <span className="text-[#667085]">Internal Payment ID</span>
              <span className="font-mono font-semibold text-[#172033]">{payment.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
              <span className="text-[#667085]">Bank Destination</span>
              <span className="font-medium text-[#172033]">{payment.accountDestination}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
              <span className="text-[#667085]">Associated Orders</span>
              <span className="font-semibold text-[#172033]">
                {payment.coveredOrdersCount} patient orders reconciled
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
              <span className="text-[#667085]">Disbursement Date</span>
              <span className="font-medium text-[#172033]">{payment.date}</span>
            </div>
          </div>

          {payment.notes && (
            <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E5E7EB] text-[11px] text-[#667085] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4A9B52] shrink-0 mt-0.5" />
              <span>{payment.notes}</span>
            </div>
          )}

          {/* Download Receipt Button */}
          <button
            onClick={handleDownloadReceipt}
            className="w-full py-2.5 px-4 bg-[#174A87] hover:bg-[#123B70] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Settlement Receipt (.txt)</span>
          </button>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#F7F9FC] border-t border-[#E5E7EB] text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#172033] bg-white hover:bg-gray-50 border border-[#E5E7EB] rounded-xl transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
