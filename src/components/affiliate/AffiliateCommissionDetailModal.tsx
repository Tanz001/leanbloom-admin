import React from 'react';
import {
  X,
  Percent,
  Calendar,
  ShoppingBag,
  User,
  DollarSign,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { AffiliateCommissionRecord } from '../../types';

interface AffiliateCommissionDetailModalProps {
  commission: AffiliateCommissionRecord | null;
  onClose: () => void;
  onViewOrder?: (orderId: string) => void;
}

export const AffiliateCommissionDetailModal: React.FC<AffiliateCommissionDetailModalProps> = ({
  commission,
  onClose,
  onViewOrder
}) => {
  if (!commission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#123B70]/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F7F9FC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF5EA] text-[#4A9B52] flex items-center justify-center font-bold">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#172033] font-mono">{commission.id}</h3>
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    commission.status === 'Paid'
                      ? 'bg-[#EAF5EA] text-[#4A9B52]'
                      : commission.status === 'Approved'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {commission.status}
                </span>
              </div>
              <p className="text-xs text-[#667085]">Generated on {commission.date}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#667085] hover:text-[#172033] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-[#EAF5EA]/50 rounded-xl border border-[#4A9B52]/20 text-center">
            <span className="text-xs text-[#667085] block mb-1">Commission Earned</span>
            <div className="text-2xl font-black text-[#4A9B52]">
              ${commission.commission.toFixed(2)}
            </div>
            <span className="text-xs text-[#667085]">
              Rate: {commission.commissionRate}% of gross sales
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#E5E7EB]">
              <span className="text-[#667085]">Referred Patient</span>
              <span className="font-semibold text-[#172033]">{commission.patientName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5E7EB] items-center">
              <span className="text-[#667085]">Associated Order</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#174A87]">{commission.orderId}</span>
                {onViewOrder && (
                  <button
                    onClick={() => onViewOrder(commission.orderId)}
                    className="text-[11px] text-[#174A87] hover:underline font-semibold"
                  >
                    View
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5E7EB]">
              <span className="text-[#667085]">Order Total</span>
              <span className="font-semibold text-[#172033]">${commission.orderAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5E7EB]">
              <span className="text-[#667085]">Settlement Status</span>
              <span className="font-semibold text-[#172033]">{commission.status}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
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
