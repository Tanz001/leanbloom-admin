import React, { useState } from 'react';
import {
  Percent,
  CreditCard,
  Download,
  Building2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Send,
  DollarSign
} from 'lucide-react';
import { CommissionRecord, PaymentTransaction, Affiliate } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { StatCard } from '../common/StatCard';

interface CommissionsPaymentsViewProps {
  mode: 'commissions' | 'payments';
  commissions: CommissionRecord[];
  payments: PaymentTransaction[];
  affiliates: Affiliate[];
  onDisbursePayout: (recordId: string) => void;
}

export const CommissionsPaymentsView: React.FC<CommissionsPaymentsViewProps> = ({
  mode,
  commissions,
  payments,
  affiliates,
  onDisbursePayout
}) => {
  const [activeTab, setActiveTab] = useState<'commissions' | 'payments'>(
    mode === 'payments' ? 'payments' : 'commissions'
  );

  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [affiliateFilter, setAffiliateFilter] = useState('All');

  // Summary Metrics
  const totalGrossSales = commissions.reduce((acc, c) => acc + c.grossSales, 0);
  const totalAffiliateCommissions = commissions.reduce((acc, c) => acc + c.commissionEarned, 0);
  const totalLeanBloomBase = commissions.reduce((acc, c) => acc + c.baseRevenue, 0);
  const totalPendingPayout = commissions
    .filter((c) => c.paymentStatus === 'Pending' || c.paymentStatus === 'Processing')
    .reduce((acc, c) => acc + c.amountPayable, 0);

  const filteredPayments = payments.filter((p) => {
    const matchesStatus = paymentStatusFilter === 'All' || p.status === paymentStatusFilter;
    const matchesAffiliate = affiliateFilter === 'All' || p.affiliateId === affiliateFilter;
    return matchesStatus && matchesAffiliate;
  });

  return (
    <div className="space-y-6 pb-12" id="commissions-payments-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-[#E4E7EC] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            {activeTab === 'commissions' ? 'Commission Management & Payouts' : 'Payment Reconciliation & Ledger'}
          </h2>
          <p className="text-xs text-[#667085] mt-0.5">
            {activeTab === 'commissions'
              ? 'Calculate child tenant markups, net wholesale revenues, and bi-weekly disbursement schedules.'
              : 'End-to-end audit of Stripe Connect transactions, credit cards, and customer invoices.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Tab switcher */}
          <div className="flex items-center bg-[#F2F4F7] p-1 rounded-lg border border-[#E4E7EC]">
            <button
              type="button"
              onClick={() => setActiveTab('commissions')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'commissions'
                  ? 'bg-white text-[#173B72] shadow-xs font-bold'
                  : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              Commissions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('payments')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'payments'
                  ? 'bg-white text-[#173B72] shadow-xs font-bold'
                  : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              Payments
            </button>
          </div>

          <button
            type="button"
            onClick={() => alert('Generating financial statement spreadsheet...')}
            className="px-3.5 py-2 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] hover:bg-[#F8F9FC] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#667085]" />
            Export Statement
          </button>
        </div>
      </div>

      {/* KPI Cards for Financial Clarity (Prompt #18 & #19) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Gross Platform GMV"
          value={`$${totalGrossSales.toLocaleString()}`}
          change="+16.8%"
          period="Across all affiliates"
          icon={<DollarSign className="w-5 h-5" />}
          iconBgColor="bg-[#EAF4FB]"
          iconColor="text-[#173B72]"
        />
        <StatCard
          label="LeanBloom Base Revenue"
          value={`$${totalLeanBloomBase.toLocaleString()}`}
          change="Wholesale Margin"
          period="Pharmacy & Platform"
          icon={<ShieldCheck className="w-5 h-5" />}
          iconBgColor="bg-[#EAF6E7]"
          iconColor="text-[#2E9B4B]"
        />
        <StatCard
          label="Affiliate Total Earnings"
          value={`$${totalAffiliateCommissions.toLocaleString()}`}
          change="+14.5%"
          period="Earned by clinics"
          icon={<Percent className="w-5 h-5" />}
          iconBgColor="bg-[#EAF4FB]"
          iconColor="text-[#2D82C4]"
        />
        <StatCard
          label="Pending Batch Payout"
          value={`$${totalPendingPayout.toLocaleString()}`}
          change="Next Batch"
          period="Due in 4 days"
          icon={<Clock className="w-5 h-5" />}
          iconBgColor="bg-[#FEF6EE]"
          iconColor="text-[#D99A18]"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: COMMISSIONS TABLE (Prompt #18)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'commissions' && (
        <div className="bg-white rounded-xl border border-[#E4E7EC] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#E4E7EC] bg-[#F8F9FC] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">
                Affiliate Commission Statements & Payment Schedules
              </h3>
              <p className="text-xs text-[#667085]">
                Automated Stripe Connect split-settlements occur bi-weekly on the 1st and 15th.
              </p>
            </div>
            <div className="text-xs text-[#2E9B4B] font-semibold bg-[#EAF6E7] px-2.5 py-1 rounded-md border border-[#4FAF4A]/20">
              Stripe Connect Webhook: Synchronized
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4E7EC] text-[11px] font-bold text-[#667085] uppercase tracking-wider bg-[#F8F9FC]">
                  <th className="py-3 px-4">Affiliate Clinic</th>
                  <th className="py-3 px-4 text-right">Orders</th>
                  <th className="py-3 px-4 text-right">Gross Sales</th>
                  <th className="py-3 px-4 text-right">LeanBloom Base</th>
                  <th className="py-3 px-4 text-right">Markup Value</th>
                  <th className="py-3 px-4 text-right">Affiliate Commission</th>
                  <th className="py-3 px-4 text-right">Amount Payable</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payout Date</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F4F7] text-xs text-[#344054]">
                {commissions.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#F8F9FC] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#172033]">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#173B72]" />
                        <span>{rec.affiliateName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold">{rec.ordersCount}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#172033]">
                      ${rec.grossSales.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#667085]">
                      ${rec.baseRevenue.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#2E9B4B] font-semibold">
                      +${rec.markup.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#2D82C4]">
                      ${rec.commissionEarned.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-[#172033]">
                      ${rec.amountPayable.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={rec.paymentStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-[#667085] whitespace-nowrap">{rec.payoutDate}</td>
                    <td className="py-3.5 px-4 text-center">
                      {rec.paymentStatus !== 'Paid' ? (
                        <button
                          type="button"
                          onClick={() => onDisbursePayout(rec.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#2E9B4B] hover:bg-[#237839] rounded-md transition-colors shadow-xs flex items-center gap-1 mx-auto"
                        >
                          <Send className="w-3 h-3" />
                          Release
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-[#2E9B4B] flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Disbursed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: PAYMENTS AUDIT TABLE (Prompt #19)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-xl border border-[#E4E7EC] overflow-hidden shadow-xs space-y-4">
          <div className="p-4 border-b border-[#E4E7EC] bg-[#F8F9FC] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-medium bg-white border border-[#E4E7EC] rounded-lg text-[#344054]"
              >
                <option value="All">All Payment Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
              </select>

              <select
                value={affiliateFilter}
                onChange={(e) => setAffiliateFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-medium bg-white border border-[#E4E7EC] rounded-lg text-[#344054]"
              >
                <option value="All">All Affiliates</option>
                {affiliates.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xs text-[#667085]">
              Showing <strong>{filteredPayments.length}</strong> transactions
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4E7EC] text-[11px] font-bold text-[#667085] uppercase tracking-wider bg-[#F8F9FC]">
                  <th className="py-3 px-4">Payment ID</th>
                  <th className="py-3 px-4">Associated Order</th>
                  <th className="py-3 px-4">Affiliate Tenant</th>
                  <th className="py-3 px-4 text-right">Gross Amount</th>
                  <th className="py-3 px-4 text-right">Affiliate Share</th>
                  <th className="py-3 px-4 text-right">Net LeanBloom</th>
                  <th className="py-3 px-4">Payment Rail</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F4F7] text-xs text-[#344054]">
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-[#F8F9FC] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#173B72]">{pay.id}</td>
                    <td className="py-3 px-4 font-mono text-[#667085]">{pay.orderId}</td>
                    <td className="py-3 px-4 font-medium text-[#172033]">{pay.affiliateName}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#172033]">
                      ${pay.grossAmount}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#2D82C4]">
                      ${pay.commission}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#2E9B4B]">
                      ${pay.netLeanBloom}
                    </td>
                    <td className="py-3 px-4 text-[#344054]">{pay.method}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={pay.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-[#667085] whitespace-nowrap">{pay.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
