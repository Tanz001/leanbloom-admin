import React, { useState } from 'react';
import {
  Search,
  Download,
  Building2,
  Truck,
  Eye,
  X,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Order, Affiliate } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PageHeader } from '../common/PageHeader';
import { RowActionsMenu } from '../common/RowActionsMenu';

interface OrdersViewProps {
  orders: Order[];
  affiliates: Affiliate[];
  onRefundOrder: (orderId: string) => void;
  onOpenAddOrder?: () => void;
  onEditOrder?: (order: Order) => void;
  onDeleteOrder?: (order: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  affiliates,
  onRefundOrder,
  onOpenAddOrder,
  onEditOrder,
  onDeleteOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedAffiliate, setSelectedAffiliate] = useState<string>('All');
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.patientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === 'All' || o.status === selectedStatus;
    const matchesAffiliate =
      selectedAffiliate === 'All' || o.affiliateId === selectedAffiliate;
    return matchesSearch && matchesStatus && matchesAffiliate;
  });

  return (
    <div className="space-y-6 pb-12" id="orders-view-container">
      <PageHeader
        title="Orders"
        description="Orders across all affiliate clinics. Affiliates only see their own."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('Exporting orders to CSV...')}
              className="px-3.5 py-2 text-xs font-semibold text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-[#9CA3AF]" />
              Export
            </button>
            {onOpenAddOrder && (
              <button
                type="button"
                onClick={onOpenAddOrder}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0F1C2E] hover:bg-[#1A2F4A] rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Order
              </button>
            )}
          </div>
        }
      />

      <div className="bg-white p-4 rounded-xl border border-[#ECEEF2] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order ID, patient, product..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F7F9FC] border border-[#E4E7EC] rounded-lg text-[#172033] placeholder-[#98A2B3] focus:ring-2 focus:ring-[#2D82C4]/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
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

      <div className="bg-white rounded-xl border border-[#E4E7EC] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4E7EC] text-[11px] font-bold text-[#667085] uppercase tracking-wider bg-[#F8F9FC]">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Affiliate Clinic</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Payment & Shipping</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center w-14"> </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7] text-xs text-[#344054]">
              {filteredOrders.map((order) => (
                <tr
                  key={order.orderId || order.id}
                  className="hover:bg-[#F8F9FC] transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-[#173B72]">
                    {order.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#172033]">
                    <p>{order.patientName}</p>
                    <p className="text-[11px] text-[#667085]">
                      {order.patientEmail}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#EAF4FB] text-[#173B72] px-2 py-0.5 rounded-full border border-[#2D82C4]/20">
                      <Building2 className="w-3 h-3" />
                      {order.affiliateName}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-[#344054]">
                    {order.productName}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#172033]">
                    ${Number(order.amount).toFixed(2)}
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
                  <td className="py-3 px-4 text-[#667085] whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <RowActionsMenu
                      items={[
                        {
                          label: 'View',
                          icon: <Eye className="w-4 h-4" />,
                          onClick: () => setActiveOrderModal(order),
                        },
                        ...(onEditOrder
                          ? [
                              {
                                label: 'Edit',
                                icon: <Edit2 className="w-4 h-4" />,
                                onClick: () => onEditOrder(order),
                              },
                            ]
                          : []),
                        ...(order.status === 'Completed'
                          ? [
                              {
                                label: 'Mark refunded',
                                onClick: () =>
                                  onRefundOrder(order.orderId || order.id),
                              },
                            ]
                          : []),
                        ...(onDeleteOrder
                          ? [
                              {
                                label: 'Delete',
                                icon: <Trash2 className="w-4 h-4" />,
                                tone: 'danger' as const,
                                onClick: () => onDeleteOrder(order),
                              },
                            ]
                          : []),
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="py-12 text-center text-sm text-[#667085]"
                  >
                    No orders match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-[#E4E7EC] shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F8F9FC]">
              <div>
                <h3 className="text-sm font-bold text-[#172033]">
                  Order details
                </h3>
                <p className="text-xs font-mono text-[#173B72]">
                  {activeOrderModal.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveOrderModal(null)}
                className="p-1 text-[#667085] hover:text-[#172033] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Patient:</span>
                <strong className="text-[#172033]">
                  {activeOrderModal.patientName}
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Email:</span>
                <span>{activeOrderModal.patientEmail}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Affiliate:</span>
                <span className="font-semibold text-[#173B72]">
                  {activeOrderModal.affiliateName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Product:</span>
                <span className="font-semibold">
                  {activeOrderModal.productName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Amount:</span>
                <span className="font-mono font-bold text-sm text-[#172033]">
                  ${Number(activeOrderModal.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Status:</span>
                <StatusBadge status={activeOrderModal.status} size="sm" />
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Shipping:</span>
                <span className="text-[#2D82C4] font-medium">
                  {activeOrderModal.shippingStatus || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#667085]">Placed:</span>
                <span>{activeOrderModal.date}</span>
              </div>
            </div>

            <div className="p-4 border-t border-[#E4E7EC] bg-[#F8F9FC] flex gap-2 justify-end">
              {onEditOrder && (
                <button
                  type="button"
                  onClick={() => {
                    onEditOrder(activeOrderModal);
                    setActiveOrderModal(null);
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#12345F] rounded-lg hover:bg-[#0B2440]"
                >
                  Edit
                </button>
              )}
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
