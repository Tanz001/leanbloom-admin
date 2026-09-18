import React, { useState } from 'react';
import {
  Building2,
  Users,
  ShoppingCart,
  DollarSign,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Plus,
  FileText,
  Eye,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCcw,
  Sparkles
} from 'lucide-react';
import {
  Affiliate,
  Order,
  Patient,
  DateRangeOption,
  PageView
} from '../../types';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { REVENUE_TIMELINE } from '../../mockData';

interface DashboardViewProps {
  dateRange: DateRangeOption;
  onDateRangeChange: (range: DateRangeOption) => void;
  affiliates: Affiliate[];
  orders: Order[];
  patients: Patient[];
  onNavigate: (view: PageView) => void;
  onOpenCreateAffiliate: () => void;
  onOpenAddProduct: () => void;
  onOpenLoginAsAffiliate: (affiliate: Affiliate) => void;
  onSelectAffiliateDetail: (affiliate: Affiliate) => void;
}

type TimelineKey = '7 Days' | '30 Days' | '3 Months' | '6 Months' | '12 Months';

export const DashboardView: React.FC<DashboardViewProps> = ({
  dateRange,
  onDateRangeChange,
  affiliates,
  orders,
  patients,
  onNavigate,
  onOpenCreateAffiliate,
  onOpenAddProduct,
  onOpenLoginAsAffiliate,
  onSelectAffiliateDetail
}) => {
  const [timelineKey, setTimelineKey] = useState<TimelineKey>('30 Days');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const activeAffiliatesCount = affiliates.filter((a) => a.status === 'Active').length;
  const totalAffiliatesCount = affiliates.length + 121; // platform scale: 128
  const activeAffiliatesDisplay = activeAffiliatesCount + 110; // platform scale: 114

  const timelineData = REVENUE_TIMELINE[timelineKey] || REVENUE_TIMELINE['30 Days'];
  const maxRevenue = Math.max(...timelineData.map((d) => d.total));

  // Order status counts
  const orderStatusCounts = {
    Completed: orders.filter((o) => o.status === 'Completed').length,
    Processing: orders.filter((o) => o.status === 'Processing').length,
    Pending: orders.filter((o) => o.status === 'Pending').length,
    Cancelled: orders.filter((o) => o.status === 'Cancelled').length,
    Refunded: orders.filter((o) => o.status === 'Refunded').length
  };
  const totalOrdersCount = orders.length;

  return (
    <div className="space-y-6 pb-12" id="master-dashboard-container">
      {/* 1. Header & Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-[#E4E7EC] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4FAF4A] animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
              Good morning, Admin
            </h2>
          </div>
          <p className="text-xs text-[#667085] mt-1">
            Here's what's happening across your LeanBloom white-label network today.
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#F2F4F7] p-1 rounded-lg border border-[#E4E7EC] self-start sm:self-auto overflow-x-auto max-w-full">
          {(['Today', 'This Week', 'This Month', 'This Year', 'Custom Range'] as DateRangeOption[]).map(
            (opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onDateRangeChange(opt)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  dateRange === opt
                    ? 'bg-white text-[#173B72] shadow-xs font-bold'
                    : 'text-[#667085] hover:text-[#172033]'
                }`}
              >
                {opt}
              </button>
            )
          )}
        </div>
      </div>

      {/* 2. KPI Cards Grid (Exact 6 cards from prompt spec #7) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <StatCard
          label="Total Affiliates"
          value={totalAffiliatesCount}
          change="+12.5%"
          isPositive={true}
          period="vs last month"
          icon={<Building2 className="w-5 h-5" />}
          iconBgColor="bg-[#EAF4FB]"
          iconColor="text-[#173B72]"
          onClick={() => onNavigate('affiliates')}
        />
        <StatCard
          label="Active Affiliates"
          value={activeAffiliatesDisplay}
          change="+8.2%"
          isPositive={true}
          period="vs last month"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBgColor="bg-[#EAF6E7]"
          iconColor="text-[#2E9B4B]"
          onClick={() => onNavigate('affiliates')}
        />
        <StatCard
          label="Total Patients"
          value="24,892"
          change="+14.6%"
          isPositive={true}
          period="vs last month"
          icon={<Users className="w-5 h-5" />}
          iconBgColor="bg-[#EAF4FB]"
          iconColor="text-[#2D82C4]"
          onClick={() => onNavigate('patients')}
        />
        <StatCard
          label="Total Orders"
          value="18,421"
          change="+11.3%"
          isPositive={true}
          period="vs last month"
          icon={<ShoppingCart className="w-5 h-5" />}
          iconBgColor="bg-[#F0FDF4]"
          iconColor="text-[#4FAF4A]"
          onClick={() => onNavigate('orders')}
        />
        <StatCard
          label="Total Revenue"
          value="$1,284,920"
          change="+16.8%"
          isPositive={true}
          period="vs last month"
          icon={<DollarSign className="w-5 h-5" />}
          iconBgColor="bg-[#EAF4FB]"
          iconColor="text-[#173B72]"
          onClick={() => onNavigate('revenue-analytics')}
        />
        <StatCard
          label="Pending Payments"
          value="$42,850"
          change="3 Batches"
          isPositive={true}
          period="due in 4 days"
          icon={<Clock className="w-5 h-5" />}
          iconBgColor="bg-[#FEF6EE]"
          iconColor="text-[#D99A18]"
          onClick={() => onNavigate('payments')}
        />
      </div>

      {/* 3. Revenue Analytics Card (Interactive Chart) */}
      <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#F2F4F7]">
          <div>
            <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2D82C4]" />
              Revenue Overview
            </h3>
            <p className="text-xs text-[#667085]">
              Gross Platform Sales vs. Affiliate Revenue & LeanBloom Platform Margin
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Legend */}
            <div className="hidden md:flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-[#344054]">
                <span className="w-3 h-3 rounded bg-[#173B72]" /> Total GMV
              </span>
              <span className="flex items-center gap-1.5 text-[#344054]">
                <span className="w-3 h-3 rounded bg-[#2D82C4]" /> Affiliate Revenue
              </span>
              <span className="flex items-center gap-1.5 text-[#344054]">
                <span className="w-3 h-3 rounded bg-[#4FAF4A]" /> LeanBloom Margin
              </span>
            </div>

            {/* Time toggles (7D, 30D, 3M, 6M, 12M) */}
            <div className="flex items-center bg-[#F7F9FC] border border-[#E4E7EC] rounded-lg p-0.5">
              {(['7 Days', '30 Days', '3 Months', '6 Months', '12 Months'] as TimelineKey[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimelineKey(t)}
                  className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                    timelineKey === t
                      ? 'bg-[#173B72] text-white shadow-xs'
                      : 'text-[#667085] hover:text-[#172033]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive SVG Chart Stage */}
        <div className="pt-6 relative">
          <div className="h-64 sm:h-72 w-full flex items-end justify-between gap-2 sm:gap-4 px-2">
            {timelineData.map((item, idx) => {
              const totalHeightPercent = Math.round((item.total / maxRevenue) * 90);
              const affiliateHeightPercent = Math.round((item.affiliate / item.total) * 100);
              const isHovered = hoveredPointIndex === idx;

              return (
                <div
                  key={item.label}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                  onMouseEnter={() => setHoveredPointIndex(idx)}
                  onMouseLeave={() => setHoveredPointIndex(null)}
                >
                  {/* Interactive Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-24 bg-[#172033] text-white p-2.5 rounded-lg shadow-xl text-xs z-30 pointer-events-none whitespace-nowrap min-w-[150px] animate-in fade-in zoom-in-95 duration-150">
                      <p className="font-bold text-[#3A91D8] border-b border-white/10 pb-1 mb-1">
                        {item.label}
                      </p>
                      <div className="space-y-0.5 text-[11px]">
                        <p className="flex justify-between">
                          <span className="text-slate-300">Revenue:</span>
                          <strong className="text-white">${item.total.toLocaleString()}</strong>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-slate-300">Affiliate Payout:</span>
                          <strong className="text-[#3A91D8]">${item.affiliate.toLocaleString()}</strong>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-slate-300">LeanBloom Margin:</span>
                          <strong className="text-[#4FAF4A]">${item.leanbloom.toLocaleString()}</strong>
                        </p>
                        <p className="flex justify-between pt-0.5 border-t border-white/10 text-[10px] text-slate-400">
                          <span>Orders: {item.orders}</span>
                          <span>Patients: {item.patients}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Visual Stacked Bar / Column */}
                  <div
                    className={`w-full max-w-[42px] rounded-t-md overflow-hidden transition-all duration-200 flex flex-col justify-end ${
                      isHovered ? 'ring-2 ring-[#2D82C4] scale-y-[1.02]' : 'hover:opacity-90'
                    }`}
                    style={{ height: `${totalHeightPercent}%` }}
                  >
                    {/* LeanBloom Margin part (Green) */}
                    <div
                      className="w-full bg-[#4FAF4A] transition-all"
                      style={{ height: `${100 - affiliateHeightPercent}%` }}
                    />
                    {/* Affiliate Revenue part (Navy/Blue) */}
                    <div
                      className="w-full bg-[#173B72] transition-all"
                      style={{ height: `${affiliateHeightPercent}%` }}
                    />
                  </div>

                  {/* Label */}
                  <span className="text-[11px] font-semibold text-[#667085] mt-2 truncate w-full text-center">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[#F2F4F7] flex flex-wrap items-center justify-between text-xs text-[#667085]">
            <span className="font-mono">
              Aggregated Volume: <strong>${(timelineData.reduce((acc, c) => acc + c.total, 0)).toLocaleString()}</strong>
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#4FAF4A]" />
              <span>Average Margin: <strong>26.8%</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Two Column Section: Affiliate Performance & Patient Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Affiliate Performance (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
            <div>
              <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#173B72]" />
                Affiliate Performance
              </h3>
              <p className="text-xs text-[#667085]">Active businesses operating on LeanBloom infrastructure</p>
            </div>
            <button
              type="button"
              id="view-all-affiliates-btn"
              onClick={() => onNavigate('affiliates')}
              className="text-xs font-semibold text-[#2D82C4] hover:text-[#173B72] flex items-center gap-1 transition-colors"
            >
              View All Affiliates
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4E7EC] text-[11px] font-bold text-[#667085] uppercase tracking-wider bg-[#F8F9FC]">
                  <th className="py-2.5 px-3">Affiliate</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Patients</th>
                  <th className="py-2.5 px-3 text-right">Orders</th>
                  <th className="py-2.5 px-3 text-right">Revenue</th>
                  <th className="py-2.5 px-3 text-right">Commission</th>
                  <th className="py-2.5 px-3 text-right">Growth</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F4F7] text-xs text-[#344054]">
                {affiliates.slice(0, 5).map((aff) => (
                  <tr key={aff.id} className="hover:bg-[#F7F9FC] transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#172033]">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ backgroundColor: aff.primaryColor || '#173B72' }}
                        >
                          {aff.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[130px] sm:max-w-none">{aff.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={aff.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right font-mono">{aff.patientsCount.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono">{aff.ordersCount.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#172033]">
                      ${aff.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[#2D82C4]">
                      ${aff.commission.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-[#2E9B4B]">
                      {aff.growth}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectAffiliateDetail(aff)}
                          className="p-1 text-[#667085] hover:text-[#173B72] hover:bg-[#EAF4FB] rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenLoginAsAffiliate(aff)}
                          className="p-1 text-[#2D82C4] hover:text-[#173B72] hover:bg-[#EAF4FB] rounded transition-colors"
                          title="Login as Affiliate"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient Activity & Intake Status (1 Column) */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-[#F2F4F7]">
              <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2D82C4]" />
                Patient Activity
              </h3>
              <p className="text-xs text-[#667085]">Network clinical intake & program enrollments</p>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#EAF4FB] to-[#F7F9FC] border border-[#2D82C4]/20">
              <span className="text-xs font-semibold text-[#173B72] uppercase tracking-wider">
                New Patients This Month
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#172033]">1,248</span>
                <span className="text-xs font-bold text-[#2E9B4B] bg-[#EAF6E7] px-1.5 py-0.5 rounded">
                  +18.4%
                </span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1">
                Highest onboarding velocity driven by Semaglutide campaigns.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Active Programs</span>
                <strong className="text-[#172033] font-mono">19,420 (78%)</strong>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Pending Clinical Intakes</span>
                <strong className="text-[#D99A18] font-mono">342</strong>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#F2F4F7]">
                <span className="text-[#667085]">Completed Protocols</span>
                <strong className="text-[#2E9B4B] font-mono">5,130</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('patients')}
            className="mt-4 w-full py-2 text-xs font-semibold text-[#173B72] bg-[#EAF4FB] hover:bg-[#d8ecf9] rounded-lg transition-colors text-center"
          >
            Manage Patient Directory
          </button>
        </div>
      </div>

      {/* 5. Two Column Section: Recent Orders & Order Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
            <div>
              <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#173B72]" />
                Recent Orders
              </h3>
              <p className="text-xs text-[#667085]">Live order stream across all white-label storefronts</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className="text-xs font-semibold text-[#2D82C4] hover:text-[#173B72] flex items-center gap-1 transition-colors"
            >
              View All Orders
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4E7EC] text-[11px] font-bold text-[#667085] uppercase tracking-wider bg-[#F8F9FC]">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3">Affiliate</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F4F7] text-xs text-[#344054]">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-[#F7F9FC] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#173B72]">{order.id}</td>
                    <td className="py-3 px-3 font-medium text-[#172033]">{order.patientName}</td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-medium bg-[#EAF4FB] text-[#173B72] px-2 py-0.5 rounded-full">
                        {order.affiliateName}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#475467] truncate max-w-[140px]">{order.productName}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#172033]">
                      ${order.amount}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-[#667085] whitespace-nowrap">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Status Overview (1 Column) */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-[#F2F4F7]">
              <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4FAF4A]" />
                Order Status Overview
              </h3>
              <p className="text-xs text-[#667085]">Fulfillment pipeline conversion health</p>
            </div>

            <div className="mt-4 space-y-3.5">
              {(
                [
                  { status: 'Completed', count: 14280, pct: 77.5, color: 'bg-[#2E9B4B]' },
                  { status: 'Processing', count: 2610, pct: 14.1, color: 'bg-[#2D82C4]' },
                  { status: 'Pending', count: 980, pct: 5.3, color: 'bg-[#D99A18]' },
                  { status: 'Cancelled', count: 320, pct: 1.7, color: 'bg-[#667085]' },
                  { status: 'Refunded', count: 231, pct: 1.4, color: 'bg-[#D64545]' }
                ] as const
              ).map((item) => (
                <div key={item.status} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#344054] flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      {item.status}
                    </span>
                    <span className="font-mono text-[#172033]">
                      {item.count.toLocaleString()} ({item.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F2F4F7] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 bg-[#F8F9FC] rounded-lg border border-[#E4E7EC] text-xs text-[#667085] flex items-center justify-between">
            <span>Fulfillment SLA:</span>
            <span className="font-bold text-[#2E9B4B]">98.8% On-Time 503A Delivery</span>
          </div>
        </div>
      </div>

      {/* 6. Quick Actions Section (Prompt #13) */}
      <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-[#172033] uppercase tracking-wider text-[#667085]">
              Quick Actions
            </h3>
            <p className="text-xs text-[#667085]">Accelerate routine master administrative operations</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            id="quick-action-create-affiliate"
            onClick={onOpenCreateAffiliate}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Affiliate
          </button>
          <button
            type="button"
            id="quick-action-add-product"
            onClick={onOpenAddProduct}
            className="px-3.5 py-2 text-xs font-semibold text-[#173B72] bg-[#EAF4FB] hover:bg-[#d5ebfa] rounded-lg transition-colors flex items-center gap-1.5 border border-[#2D82C4]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </button>
          <button
            type="button"
            onClick={() => onNavigate('pricing')}
            className="px-3.5 py-2 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] hover:bg-[#F8F9FC] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5 text-[#2D82C4]" />
            Manage Pricing Rules
          </button>
          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="px-3.5 py-2 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] hover:bg-[#F8F9FC] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-[#4FAF4A]" />
            View Orders
          </button>
          <button
            type="button"
            onClick={() => onNavigate('reports')}
            className="px-3.5 py-2 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] hover:bg-[#F8F9FC] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-[#667085]" />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};
