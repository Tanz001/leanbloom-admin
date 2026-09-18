import React, { useState, useMemo } from 'react';
import {
  Percent,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  CircleAlert,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { AffiliateCommissionRecord } from '../../../types';

interface AffiliateCommissionsViewProps {
  commissions: AffiliateCommissionRecord[];
  onSelectCommission: (commission: AffiliateCommissionRecord) => void;
  onViewOrder: (orderId: string) => void;
}

export const AffiliateCommissionsView: React.FC<AffiliateCommissionsViewProps> = ({
  commissions,
  onSelectCommission,
  onViewOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Totals
  const totalCommission = useMemo(() => {
    return commissions.reduce((acc, c) => acc + c.commission, 0);
  }, [commissions]);

  const pendingCommission = useMemo(() => {
    return commissions
      .filter((c) => c.status === 'Pending')
      .reduce((acc, c) => acc + c.commission, 0);
  }, [commissions]);

  const approvedCommission = useMemo(() => {
    return commissions
      .filter((c) => c.status === 'Approved')
      .reduce((acc, c) => acc + c.commission, 0);
  }, [commissions]);

  const paidCommission = useMemo(() => {
    return commissions
      .filter((c) => c.status === 'Paid')
      .reduce((acc, c) => acc + c.commission, 0);
  }, [commissions]);

  // Filtering
  const filteredCommissions = useMemo(() => {
    return commissions.filter((c) => {
      const matchSearch =
        searchTerm === '' ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.patientName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'All' || c.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [commissions, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredCommissions.length / pageSize) || 1;
  const paginatedCommissions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCommissions.slice(start, start + pageSize);
  }, [filteredCommissions, currentPage, pageSize]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Commission ID',
      'Order ID',
      'Patient Name',
      'Order Date',
      'Order Amount',
      'Commission Rate',
      'Commission Earned',
      'Status',
      'Date'
    ];
    const rows = filteredCommissions.map((c) => [
      c.id,
      c.orderId,
      `"${c.patientName}"`,
      c.orderDate,
      c.orderAmount.toFixed(2),
      `${c.commissionRate}%`,
      c.commission.toFixed(2),
      c.status,
      c.date
    ]);
    const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LeanBloom-Commissions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">Commissions</h1>
          <p className="text-xs text-[#667085] mt-1">
            Track real-time commissions accrued from your patient purchases and refills.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 text-xs font-semibold text-[#172033] bg-white hover:bg-[#F7F9FC] border border-[#E5E7EB] rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#667085]" />
          <span>Export Commissions CSV</span>
        </button>
      </div>

      {/* 4 Cards: Total, Pending, Approved, Paid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-xs font-semibold text-[#667085] block mb-1">
            Total Commission Earned
          </span>
          <div className="text-2xl font-black text-[#172033]">
            ${totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#667085] mt-1">Across all order records</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-xs font-semibold text-[#667085] block mb-1">Pending Intake</span>
          <div className="text-2xl font-black text-amber-600 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>${pendingCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="text-[11px] text-[#667085] mt-1">Awaiting provider approval</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-xs font-semibold text-[#667085] block mb-1">
            Approved (Ready for Payout)
          </span>
          <div className="text-2xl font-black text-[#174A87] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>${approvedCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="text-[11px] text-[#667085] mt-1">Settles on next bi-monthly cycle</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-xs font-semibold text-[#667085] block mb-1">Paid Out</span>
          <div className="text-2xl font-black text-[#4A9B52] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>${paidCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="text-[11px] text-[#4A9B52] font-semibold mt-1">
            Deposited into bank account
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
              placeholder="Search by commission ID, order ID, patient..."
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
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

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

      {/* Commission Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F9FC] text-[#667085] font-semibold border-b border-[#E5E7EB]">
              <tr>
                <th className="px-4 py-3">Commission ID</th>
                <th className="px-3 py-3">Order ID</th>
                <th className="px-3 py-3">Referred Patient</th>
                <th className="px-3 py-3">Order Date</th>
                <th className="px-3 py-3 text-right">Order Amount</th>
                <th className="px-3 py-3 text-center">Rate</th>
                <th className="px-4 py-3 text-right">Commission</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {paginatedCommissions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[#667085]">
                    No commission records match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedCommissions.map((record) => (
                  <tr
                    key={record.id}
                    onClick={() => onSelectCommission(record)}
                    className="hover:bg-[#EAF5EA]/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3.5 font-mono font-bold text-[#174A87] group-hover:underline">
                      {record.id}
                    </td>
                    <td className="px-3 py-3.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewOrder(record.orderId);
                        }}
                        className="font-mono text-[#174A87] hover:underline font-semibold"
                      >
                        {record.orderId}
                      </button>
                    </td>
                    <td className="px-3 py-3.5 font-semibold text-[#172033]">
                      {record.patientName}
                    </td>
                    <td className="px-3 py-3.5 text-[#667085]">{record.orderDate}</td>
                    <td className="px-3 py-3.5 text-right font-medium text-[#172033]">
                      ${record.orderAmount.toFixed(2)}
                    </td>
                    <td className="px-3 py-3.5 text-center text-[#667085]">
                      {record.commissionRate}%
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-[#4A9B52]">
                      ${record.commission.toFixed(2)}
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                          record.status === 'Paid'
                            ? 'bg-[#EAF5EA] text-[#4A9B52]'
                            : record.status === 'Approved'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectCommission(record)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#174A87] hover:bg-[#174A87]/10 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
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
              {filteredCommissions.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-[#172033]">
              {Math.min(currentPage * pageSize, filteredCommissions.length)}
            </span>{' '}
            of <span className="font-semibold text-[#172033]">{filteredCommissions.length}</span>{' '}
            commissions
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
