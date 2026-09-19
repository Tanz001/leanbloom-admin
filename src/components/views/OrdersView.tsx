import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Download,
  Building2,
  Calendar,
  CheckCircle,
  Truck,
  Eye,
  RotateCcw,
  X
} from 'lucide-react';
import { Order, Affiliate } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface OrdersViewProps {
  orders: Order[];
  affiliates: Affiliate[];
  onRefundOrder: (orderId: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  affiliates,
  onRefundOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedAffiliate, setSelectedAffiliate] = useState<string>('All');
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || o.status === selectedStatus;
    const matchesAffiliate = selectedAffiliate === 'All' || o.affiliateId === selectedAffiliate;
    return matchesSearch && matchesStatus && matchesAffiliate;
  });

  return (
    <div className="space-y-6 pb-12" id="orders-view-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-[#E4E7EC] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">Master Orders Stream</h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Real-time order status across affiliate storefronts.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => alert('Exporting all 18,421 orders to CSV...')}
            className="px-3.5 py-2 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] hover:bg-[#F8F9FC] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#667085]" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E4E7EC] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Order ID (#LB-...), patient, product..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F7F9FC] border border-[#E4E7EC] rounded-lg text-[#172033] placeholder-[#98A2B3] focus:ring-2 focus:ring-[#2D82C4]/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium bg-[#F7F9FC] border border-[#E4E7EC] rounded-lg text-[#344054]"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Refunded">Refunded</option>
          </select>

          {/* Affiliate Filter */}
          <select
            value={selectedAffiliate}
            onChange={(e) => setSelectedAffiliate(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium bg-[#F7F9FC] border border-[#E4E7EC] rounded-lg text-[#344054]"
          >
            <option value="All">All Affiliates</option>
            {affiliates.map((aff) => (
              <option key={aff.id} value={aff.id}>
                {aff.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#E4E7EC] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4E7EC] text-[11px] font-bold text-[#667085] uppercase tracking-wider bg-[#F8F9FC]">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Affiliate Clinic</th>
                <th className="py-3 px-4">Product Protocol</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Payment & Shipping</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7] text-xs text-[#344054]">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F8F9FC] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#173B72]">{order.id}</td>
                  <td className="py-3 px-4 font-medium text-[#172033]">
                    <p>{order.patientName}</p>
                    <p className="text-[11px] text-[#667085]">{order.patientEmail}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#EAF4FB] text-[#173B72] px-2 py-0.5 rounded-full border border-[#2D82C4]/20">
                      <Building2 className="w-3 h-3" />
                      {order.affiliateName}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-[#344054]">{order.productName}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#172033]">
                    ${order.amount}
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-[#344054]">{order.paymentMethod}</p>
                    {order.shippingStatus && (
                      <span className="text-[10px] text-[#2D82C4] font-medium flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        {order.shippingStatus}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={order.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-[#667085] whitespace-nowrap">{order.date}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveOrderModal(order)}
                        className="p-1 text-[#173B72] hover:bg-[#EAF4FB] rounded transition-colors"
                        title="View Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {order.status === 'Completed' && (
                        <button
                          type="button"
                          onClick={() => onRefundOrder(order.id)}
                          className="p-1 text-[#667085] hover:text-[#D64545] hover:bg-[#FEE4E2] rounded transition-colors"
                          title="Process Master Refund"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-[#E4E7EC] shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F8F9FC]">
              <div>
                <h3 className="text-sm font-bold text-[#172033]">Order Receipt & Audit</h3>
                <p className="text-xs font-mono text-[#173B72]">{activeOrderModal.id}</p>
              </div>
              <button
                onClick={() => setActiveOrderModal(null)}
                className="p-1 text-[#667085] hover:text-[#172033] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Patient:</span>
                <strong className="text-[#172033]">{activeOrderModal.patientName}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Affiliate:</span>
                <span className="font-semibold text-[#173B72]">{activeOrderModal.affiliateName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Product Formulation:</span>
                <span className="font-semibold">{activeOrderModal.productName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Total Billed:</span>
                <span className="font-mono font-bold text-sm text-[#172033]">
                  ${activeOrderModal.amount}.00
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Order Status:</span>
                <StatusBadge status={activeOrderModal.status} size="sm" />
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Fulfillment Logistics:</span>
                <span className="text-[#2D82C4] font-medium">{activeOrderModal.shippingStatus || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#667085]">Processed Timestamp:</span>
                <span>{activeOrderModal.date}</span>
              </div>
            </div>

            <div className="p-4 border-t border-[#E4E7EC] bg-[#F8F9FC] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveOrderModal(null)}
                className="px-4 py-1.5 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] rounded-lg hover:bg-[#F2F4F7]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
