import React from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShoppingBag,
  DollarSign,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { AffiliatePatientItem, AffiliateOrderItem } from '../../types';

interface AffiliatePatientDetailModalProps {
  patient: AffiliatePatientItem | null;
  orders: AffiliateOrderItem[];
  onClose: () => void;
  onSelectOrder: (order: AffiliateOrderItem) => void;
}

export const AffiliatePatientDetailModal: React.FC<AffiliatePatientDetailModalProps> = ({
  patient,
  orders,
  onClose,
  onSelectOrder
}) => {
  if (!patient) return null;

  const patientOrders = orders.filter((o) => o.patientId === patient.id || o.patientName === patient.name);
  const totalPatientCommission = patientOrders.reduce((acc, curr) => acc + curr.commissionAmount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#123B70]/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F7F9FC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EAF5EA] text-[#4A9B52] font-bold text-sm flex items-center justify-center border border-[#4A9B52]/20">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#172033]">{patient.name}</h3>
                <span
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                    patient.status === 'Active'
                      ? 'bg-[#EAF5EA] text-[#4A9B52]'
                      : patient.status === 'Pending'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {patient.status}
                </span>
              </div>
              <p className="text-xs text-[#667085]">ID: {patient.id} • Assigned to your affiliate account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#667085] hover:text-[#172033] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Patient KPI stats generated */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-[#F7F9FC] rounded-xl border border-[#E5E7EB]">
              <span className="text-[11px] font-medium text-[#667085] uppercase tracking-wider block mb-1">
                Total Orders
              </span>
              <span className="text-lg font-bold text-[#172033]">{patientOrders.length || patient.ordersCount}</span>
            </div>
            <div className="p-3.5 bg-[#F7F9FC] rounded-xl border border-[#E5E7EB]">
              <span className="text-[11px] font-medium text-[#667085] uppercase tracking-wider block mb-1">
                Total Patient Spend
              </span>
              <span className="text-lg font-bold text-[#174A87]">
                ${patient.totalSpent.toLocaleString()}
              </span>
            </div>
            <div className="p-3.5 bg-[#EAF5EA] rounded-xl border border-[#4A9B52]/20">
              <span className="text-[11px] font-medium text-[#4A9B52] uppercase tracking-wider block mb-1">
                Your Commission
              </span>
              <span className="text-lg font-bold text-[#4A9B52]">
                ${(totalPatientCommission || patient.totalSpent * 0.15).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Patient Profile Info */}
          <div className="p-4 bg-white rounded-xl border border-[#E5E7EB] space-y-3">
            <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
              Contact & Clinical Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-[#667085]">
                <Mail className="w-4 h-4 text-[#174A87]" />
                <span className="text-[#172033] font-medium">{patient.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#667085]">
                <Phone className="w-4 h-4 text-[#174A87]" />
                <span className="text-[#172033] font-medium">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#667085]">
                <Calendar className="w-4 h-4 text-[#174A87]" />
                <span>Joined {patient.joinedDate}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#667085]">
                <MapPin className="w-4 h-4 text-[#174A87]" />
                <span className="truncate">{patient.address}</span>
              </div>
            </div>

            {patient.notes && (
              <div className="pt-2 border-t border-[#E5E7EB]">
                <p className="text-[11px] text-[#667085] italic">
                  Clinical Intake Note: "{patient.notes}"
                </p>
              </div>
            )}
          </div>

          {/* Order History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#4A9B52]" />
                Order History ({patientOrders.length})
              </h4>
            </div>

            {patientOrders.length === 0 ? (
              <div className="p-4 bg-[#F7F9FC] rounded-xl border border-[#E5E7EB] text-center text-xs text-[#667085]">
                No orders logged yet for this patient.
              </div>
            ) : (
              <div className="space-y-2">
                {patientOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => {
                      onSelectOrder(order);
                    }}
                    className="p-3 bg-[#F7F9FC] hover:bg-[#EAF5EA]/50 rounded-xl border border-[#E5E7EB] hover:border-[#4A9B52] transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-[#174A87]">
                          {order.id}
                        </span>
                        <span className="text-xs text-[#667085]">• {order.date}</span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                            order.orderStatus === 'Completed'
                              ? 'bg-[#EAF5EA] text-[#4A9B52]'
                              : order.orderStatus === 'Processing'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#172033]">{order.productName}</p>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <div className="text-xs font-bold text-[#172033]">${order.total}</div>
                        <div className="text-[11px] font-semibold text-[#4A9B52]">
                          +${order.commissionAmount.toFixed(2)} comm
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#174A87] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#F7F9FC] border-t border-[#E5E7EB] flex items-center justify-between">
          <span className="text-xs text-[#667085]">
            Protected Health Data • Multi-tenant affiliate view
          </span>
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
