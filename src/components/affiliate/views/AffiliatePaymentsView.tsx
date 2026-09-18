import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Calendar,
  Building2,
  DollarSign,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { AffiliatePaymentPayout } from '../../../types';

interface AffiliatePaymentsViewProps {
  payments: AffiliatePaymentPayout[];
  onSelectPayment: (payment: AffiliatePaymentPayout) => void;
}

export const AffiliatePaymentsView: React.FC<AffiliatePaymentsViewProps> = ({
  payments,
  onSelectPayment
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const totalPaid = useMemo(() => {
    return payments
      .filter((p) => p.status === 'Paid')
      .reduce((acc, p) => acc + p.amount, 0);
  }, [payments]);

  const lastPayment = payments.length > 0 ? payments[0] : null;

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      return (
        searchTerm === '' ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.accountDestination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [payments, searchTerm]);

  // CSV Export for Payments
  const handleExportCSV = () => {
    const headers = ['Disbursement Ref', 'Payment ID', 'Date', 'Amount ($)', 'Method', 'Destination', 'Status'];
    const rows = filteredPayments.map((p) => [
      p.reference,
      p.id,
      p.date,
      p.amount.toFixed(2),
      p.method,
      `"${p.accountDestination}"`,
      p.status
    ]);
    const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LeanBloom-Disbursements-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">Payments & Payouts</h1>
          <p className="text-xs text-[#667085] mt-1">
            Track bi-monthly affiliate commission payouts and banking settlement receipts.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 text-xs font-semibold text-[#172033] bg-white hover:bg-[#F7F9FC] border border-[#E5E7EB] rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#667085]" />
          <span>Export Payout History</span>
        </button>
      </div>

      {/* 4 Cards: Total Paid, Pending Payment, Last Payment, Next Payment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-xs font-semibold text-[#667085] block mb-1">Total Payouts</span>
          <div className="text-2xl font-black text-[#4A9B52]">
            ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#4A9B52] font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Successfully deposited</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-xs font-semibold text-[#667085] block mb-1">Pending Next Cycle</span>
          <div className="text-2xl font-black text-[#174A87]">$1,894.20</div>
          <div className="text-[11px] text-[#667085] mt-1">Accruing from Sep 16–30 orders</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-xs font-semibold text-[#667085] block mb-1">Last Payment</span>
          <div className="text-2xl font-black text-[#172033]">
            {lastPayment
              ? `$${lastPayment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : '$0.00'}
          </div>
          <div className="text-[11px] text-[#667085] mt-1">
            {lastPayment ? `Cleared on ${lastPayment.date}` : 'No payouts yet'}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-xs font-semibold text-[#667085] block mb-1">Next Settlement Date</span>
          <div className="text-2xl font-black text-[#172033]">Sep 30, 2026</div>
          <div className="text-[11px] text-[#667085] mt-1">Bi-monthly ACH automatic deposit</div>
        </div>
      </div>

      {/* Payout Method Card */}
      <div className="p-4 bg-gradient-to-r from-[#174A87]/5 to-[#4A9B52]/5 rounded-2xl border border-[#174A87]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-[#174A87] flex items-center justify-center border border-[#E5E7EB] shadow-2xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#172033]">
              Default Disbursement Destination: Automated Clearing House (ACH)
            </h4>
            <p className="text-[11px] text-[#667085]">
              Settlement deposits are transferred directly to your verified commercial operating account.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#4A9B52] font-semibold bg-white px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
          <ShieldCheck className="w-4 h-4" />
          <span>ACH Direct Deposit Verified</span>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#172033]">Payout History & Disbursements</h3>
            <p className="text-xs text-[#667085]">Completed ledger settlements transferred to your bank</p>
          </div>
          <span className="text-xs font-semibold text-[#667085]">
            {filteredPayments.length} Disbursements
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F9FC] text-[#667085] font-semibold border-b border-[#E5E7EB]">
              <tr>
                <th className="px-4 py-3">Disbursement Ref</th>
                <th className="px-3 py-3">Settlement Date</th>
                <th className="px-4 py-3 text-right">Amount Disbursed</th>
                <th className="px-3 py-3">Payment Method</th>
                <th className="px-4 py-3">Account Destination</th>
                <th className="px-3 py-3 text-center">Orders Covered</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredPayments.map((payout) => (
                <tr
                  key={payout.id}
                  onClick={() => onSelectPayment(payout)}
                  className="hover:bg-[#EAF5EA]/30 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3.5 font-mono font-bold text-[#174A87] group-hover:underline">
                    {payout.reference}
                  </td>
                  <td className="px-3 py-3.5 text-[#172033] font-medium">{payout.date}</td>
                  <td className="px-4 py-3.5 text-right font-black text-[#174A87]">
                    ${payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3.5 text-[#667085]">{payout.method}</td>
                  <td className="px-4 py-3.5 text-[#667085]">{payout.accountDestination}</td>
                  <td className="px-3 py-3.5 text-center font-semibold text-[#172033]">
                    {payout.coveredOrdersCount}
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#EAF5EA] text-[#4A9B52]">
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectPayment(payout)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#174A87] hover:bg-[#174A87]/10 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
