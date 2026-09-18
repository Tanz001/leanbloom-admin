import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  User,
  ShoppingBag,
  DollarSign,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AffiliatePatientItem, AffiliateOrderItem } from '../../types';

interface AffiliateGlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: AffiliatePatientItem[];
  orders: AffiliateOrderItem[];
  onSelectPatient: (patient: AffiliatePatientItem) => void;
  onSelectOrder: (order: AffiliateOrderItem) => void;
}

export const AffiliateGlobalSearchModal: React.FC<AffiliateGlobalSearchModalProps> = ({
  isOpen,
  onClose,
  patients,
  orders,
  onSelectPatient,
  onSelectOrder
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // toggle handled by parent or shortcut
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const filteredPatients = trimmed
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.email.toLowerCase().includes(trimmed) ||
          p.plan.toLowerCase().includes(trimmed)
      )
    : patients.slice(0, 3);

  const filteredOrders = trimmed
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(trimmed) ||
          o.patientName.toLowerCase().includes(trimmed) ||
          o.productName.toLowerCase().includes(trimmed)
      )
    : orders.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#123B70]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E5E7EB] bg-white">
          <Search className="w-5 h-5 text-[#667085] mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients, orders, products, or transactions... (Press ESC to exit)"
            className="w-full text-sm text-[#172033] placeholder-[#667085] bg-transparent focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#667085] hover:text-[#172033] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="ml-2 px-2 py-0.5 text-[11px] font-mono text-[#667085] bg-[#F7F9FC] border border-[#E5E7EB] rounded-md">
            ESC
          </span>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-5 bg-[#F7F9FC]">
          {/* Patients Section */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[#667085] uppercase tracking-wider mb-2 px-2">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#174A87]" />
                Patients ({filteredPatients.length})
              </span>
              <span className="text-[10px] text-[#667085] font-normal">Referred accounts</span>
            </div>
            {filteredPatients.length === 0 ? (
              <p className="text-xs text-[#667085] px-3 py-2 bg-white rounded-xl border border-[#E5E7EB]">
                No matching patients found
              </p>
            ) : (
              <div className="space-y-1.5">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => {
                      onSelectPatient(patient);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 bg-white hover:bg-[#EAF5EA]/50 rounded-xl border border-[#E5E7EB] hover:border-[#4A9B52] transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#EAF5EA] text-[#4A9B52] font-semibold text-xs flex items-center justify-center">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#172033] group-hover:text-[#174A87]">
                          {patient.name}
                        </h4>
                        <p className="text-[11px] text-[#667085]">{patient.email} • {patient.plan}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#174A87]">${patient.totalSpent}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#667085] group-hover:text-[#174A87] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Orders Section */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[#667085] uppercase tracking-wider mb-2 px-2">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#4A9B52]" />
                Orders ({filteredOrders.length})
              </span>
              <span className="text-[10px] text-[#667085] font-normal">Recent transactions</span>
            </div>
            {filteredOrders.length === 0 ? (
              <p className="text-xs text-[#667085] px-3 py-2 bg-white rounded-xl border border-[#E5E7EB]">
                No matching orders found
              </p>
            ) : (
              <div className="space-y-1.5">
                {filteredOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => {
                      onSelectOrder(order);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 bg-white hover:bg-[#EAF5EA]/50 rounded-xl border border-[#E5E7EB] hover:border-[#4A9B52] transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F4FAF4] text-[#174A87] font-mono font-bold text-[11px] flex items-center justify-center border border-[#E5E7EB]">
                        #
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#174A87]">
                            {order.id}
                          </span>
                          <span className="text-xs font-medium text-[#172033]">
                            {order.patientName}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#667085]">
                          {order.productName} • {order.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#172033]">${order.total}</div>
                      <div className="text-[11px] font-medium text-[#4A9B52]">
                        +${order.commissionAmount.toFixed(2)} comm
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-white border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#667085]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#4A9B52]" />
            Tenant-isolated search • Showing records for your affiliate account only
          </span>
          <div className="flex items-center gap-2">
            <span>Navigate with</span>
            <kbd className="px-1.5 py-0.5 bg-[#F7F9FC] border border-[#E5E7EB] rounded-sm font-mono text-[10px]">
              ↑
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-[#F7F9FC] border border-[#E5E7EB] rounded-sm font-mono text-[10px]">
              ↓
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
