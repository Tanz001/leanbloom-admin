import React from 'react';
import {
  X,
  ShoppingBag,
  User,
  CreditCard,
  Percent,
  CheckCircle2,
  Clock,
  CircleDot,
  FileCheck2,
  Truck,
  ArrowRight
} from 'lucide-react';
import { AffiliateOrderItem } from '../../types';

interface AffiliateOrderDetailModalProps {
  order: AffiliateOrderItem | null;
  onClose: () => void;
  onViewPatient?: (patientName: string) => void;
}

export const AffiliateOrderDetailModal: React.FC<AffiliateOrderDetailModalProps> = ({
  order,
  onClose,
  onViewPatient
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#123B70]/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-10 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F7F9FC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF5EA] text-[#4A9B52] flex items-center justify-center border border-[#4A9B52]/20 font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#172033] font-mono">{order.id}</h3>
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                    order.orderStatus === 'Completed'
                      ? 'bg-[#EAF5EA] text-[#4A9B52]'
                      : order.orderStatus === 'Processing'
                      ? 'bg-blue-50 text-blue-700'
                      : order.orderStatus === 'Cancelled'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>
              <p className="text-xs text-[#667085]">Placed on {order.date}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#667085] hover:text-[#172033] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Order Lifecycle Timeline */}
          <div className="bg-[#F7F9FC] p-4 rounded-xl border border-[#E5E7EB]">
            <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#174A87]" />
              Order Progression & Commission Pipeline
            </h4>
            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E7EB]">
              {order.timeline.map((item, idx) => (
                <div key={idx} className="relative flex items-start gap-3 group">
                  <div
                    className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-white transition-all ${
                      item.completed
                        ? 'border-[#4A9B52] text-[#4A9B52]'
                        : item.current
                        ? 'border-[#174A87] text-[#174A87] animate-pulse'
                        : 'border-[#E5E7EB] text-gray-300'
                    }`}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 fill-[#4A9B52] text-white" />
                    ) : (
                      <CircleDot className="w-3 h-3" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold ${
                          item.completed
                            ? 'text-[#172033]'
                            : item.current
                            ? 'text-[#174A87]'
                            : 'text-[#667085]'
                        }`}
                      >
                        {item.step}
                      </span>
                      <span className="text-[11px] text-[#667085]">{item.date}</span>
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-[#667085] mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Affiliate Commission Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer info */}
            <div className="p-4 bg-white rounded-xl border border-[#E5E7EB] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#172033] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#174A87]" />
                  Referred Patient
                </span>
                {onViewPatient && (
                  <button
                    onClick={() => onViewPatient(order.patientName)}
                    className="text-[11px] font-semibold text-[#174A87] hover:underline"
                  >
                    View Patient
                  </button>
                )}
              </div>
              <div className="text-xs space-y-1">
                <div className="font-semibold text-[#172033]">{order.patientName}</div>
                <div className="text-[#667085]">{order.patientEmail}</div>
                <div className="text-[#667085]">{order.patientPhone}</div>
              </div>
            </div>

            {/* Affiliate Commission summary */}
            <div className="p-4 bg-[#EAF5EA]/50 rounded-xl border border-[#4A9B52]/30 space-y-2">
              <span className="text-xs font-bold text-[#4A9B52] uppercase tracking-wider flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-[#4A9B52]" />
                Affiliate Commission
              </span>
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-2xl font-black text-[#4A9B52]">
                    ${order.commissionAmount.toFixed(2)}
                  </span>
                  <span className="text-xs text-[#667085] ml-1.5 font-medium">
                    ({order.commissionRate}% rate)
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    order.commissionStatus === 'Paid'
                      ? 'bg-[#4A9B52] text-white'
                      : order.commissionStatus === 'Approved'
                      ? 'bg-[#EAF5EA] text-[#4A9B52] border border-[#4A9B52]/30'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {order.commissionStatus}
                </span>
              </div>
              <p className="text-[11px] text-[#667085]">
                {order.commissionStatus === 'Paid'
                  ? 'Disbursed in previous bi-monthly payout.'
                  : 'Eligible for settlement in next scheduled disbursement.'}
              </p>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
              Order Items
            </h4>
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F7F9FC] text-[#667085] font-semibold border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-4 py-2.5">Product</th>
                    <th className="px-3 py-2.5 text-center">Category</th>
                    <th className="px-3 py-2.5 text-center">Qty</th>
                    <th className="px-4 py-2.5 text-right">Price</th>
                    <th className="px-4 py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] bg-white">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-[#172033]">
                      {order.productName}
                    </td>
                    <td className="px-3 py-3 text-center text-[#667085]">
                      {order.productCategory}
                    </td>
                    <td className="px-3 py-3 text-center text-[#172033] font-medium">
                      {order.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-[#667085]">
                      ${order.subtotal.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[#172033]">
                      ${(order.subtotal * order.quantity).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-[#F7F9FC] p-4 rounded-xl border border-[#E5E7EB] space-y-2 text-xs">
            <div className="flex justify-between text-[#667085]">
              <span>Subtotal</span>
              <span className="text-[#172033] font-medium">${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#4A9B52]">
                <span>Promotional Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#667085]">
              <span>Taxes & Compound Surcharge</span>
              <span className="text-[#172033] font-medium">${order.tax.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-[#E5E7EB] flex justify-between text-sm font-bold text-[#172033]">
              <span>Total Paid by Patient</span>
              <span className="text-[#174A87]">${order.total.toFixed(2)}</span>
            </div>
            <div className="text-[11px] text-[#667085] flex items-center gap-1.5 pt-1">
              <CreditCard className="w-3.5 h-3.5 text-[#174A87]" />
              <span>Paid via {order.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#F7F9FC] border-t border-[#E5E7EB] flex items-center justify-between">
          <span className="text-xs text-[#667085]">
            Invoice & clinical fulfillment handled by LeanBloom
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#172033] bg-white hover:bg-gray-50 border border-[#E5E7EB] rounded-xl transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
