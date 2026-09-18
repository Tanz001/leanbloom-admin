import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AffiliateOrderItem } from '../../../types';

interface AffiliateOrdersViewProps {
  orders: AffiliateOrderItem[];
  onSelectOrder: (order: AffiliateOrderItem) => void;
}

export const AffiliateOrdersView: React.FC<AffiliateOrdersViewProps> = ({
  orders,
  onSelectOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Quick stats
  const completedCount = orders.filter((o) => o.orderStatus === 'Completed').length;
  const processingCount = orders.filter((o) => o.orderStatus === 'Processing').length;
  const cancelledCount = orders.filter((o) => o.orderStatus === 'Cancelled').length;
  const totalValue = orders
    .filter((o) => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Refunded')
    .reduce((acc, o) => acc + o.total, 0);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        searchTerm === '' ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.productName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'All' || o.orderStatus === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Order ID',
      'Patient Name',
      'Patient Email',
      'Date',
      'Product',
      'Total',
      'Commission Rate',
      'Commission Amount',
      'Order Status',
      'Commission Status'
    ];
    const rows = filteredOrders.map((o) => [
      o.id,
      `"${o.patientName}"`,
      o.patientEmail,
      o.date,
      `"${o.productName}"`,
      o.total,
      `${o.commissionRate}%`,
      o.commissionAmount.toFixed(2),
      o.orderStatus,
      o.commissionStatus
    ]);
    const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LeanBloom-Orders-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">Orders</h1>
          <p className="text-xs text-[#667085] mt-1">
            View orders generated through your white-label affiliate clinic storefront.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 text-xs font-semibold text-[#172033] bg-white hover:bg-[#F7F9FC] border border-[#E5E7EB] rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#667085]" />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* 4 Summary Mini-Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-xs font-semibold text-[#667085] block mb-1">Total Orders</span>
          <div className="text-xl font-bold text-[#172033]">{orders.length}</div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-xs font-semibold text-[#667085] block mb-1">Completed</span>
          <div className="text-xl font-bold text-[#4A9B52] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{completedCount}</span>
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-xs font-semibold text-[#667085] block mb-1">Processing</span>
          <div className="text-xl font-bold text-blue-600 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{processingCount}</span>
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-xs font-semibold text-[#667085] block mb-1">Total Order Value</span>
          <div className="text-xl font-bold text-[#174A87]">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by order ID #LB-..., patient, product..."
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-medium text-[#667085]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs border border-[#E5E7EB] rounded-xl px-3 py-2 bg-[#F7F9FC] focus:outline-hidden focus:border-[#174A87]"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Clear filters */}
          {(searchTerm || statusFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setCurrentPage(1);
              }}
              className="text-xs text-[#174A87] font-semibold hover:underline self-start md:self-auto"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F9FC] text-[#667085] font-semibold border-b border-[#E5E7EB]">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-3 py-3">Patient</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-4 py-3">Product Description</th>
                <th className="px-3 py-3 text-right">Subtotal</th>
                <th className="px-3 py-3 text-right">Total</th>
                <th className="px-3 py-3 text-right">Your Commission</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[#667085]">
                    No orders found matching your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className="hover:bg-[#EAF5EA]/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3.5 font-mono font-bold text-[#174A87] group-hover:underline">
                      {order.id}
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="font-semibold text-[#172033]">{order.patientName}</div>
                      <div className="text-[11px] text-[#667085]">{order.patientEmail}</div>
                    </td>
                    <td className="px-3 py-3.5 text-[#667085] whitespace-nowrap">{order.date}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-[#172033]">{order.productName}</div>
                      <div className="text-[11px] text-[#667085]">{order.productCategory}</div>
                    </td>
                    <td className="px-3 py-3.5 text-right text-[#667085]">
                      ${order.subtotal.toFixed(2)}
                    </td>
                    <td className="px-3 py-3.5 text-right font-bold text-[#172033]">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-3 py-3.5 text-right font-bold text-[#4A9B52]">
                      +${order.commissionAmount.toFixed(2)}
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
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
                    </td>
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectOrder(order)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#174A87] hover:bg-[#174A87]/10 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-[#F7F9FC] border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#667085]">
          <div>
            Showing{' '}
            <span className="font-semibold text-[#172033]">
              {filteredOrders.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-[#172033]">
              {Math.min(currentPage * pageSize, filteredOrders.length)}
            </span>{' '}
            of <span className="font-semibold text-[#172033]">{filteredOrders.length}</span> orders
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-[#E5E7EB] rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page <strong className="text-[#172033]">{currentPage}</strong> of{' '}
              <strong className="text-[#172033]">{totalPages}</strong>
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-[#E5E7EB] rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
