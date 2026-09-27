import React, { useMemo, useState } from 'react';
import {
  Building2,
  Users,
  ShoppingCart,
  DollarSign,
  Plus,
  ChevronRight,
  Eye,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  Affiliate,
  Order,
  Patient,
  DateRangeOption,
  PageView,
} from '../../types';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { PageHeader } from '../common/PageHeader';
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
  onSelectAffiliateDetail: (affiliate: Affiliate) => void;
}

type TimelineKey = '7 Days' | '30 Days' | '3 Months' | '6 Months';

const CHART = {
  line: '#2D82C4',
  fill: '#2D82C4',
  muted: '#A8B2BE',
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  dateRange,
  onDateRangeChange,
  affiliates,
  orders,
  patients,
  onNavigate,
  onOpenCreateAffiliate,
  onSelectAffiliateDetail,
}) => {
  const [timelineKey, setTimelineKey] = useState<TimelineKey>('30 Days');

  const totalRevenue = affiliates.reduce((sum, a) => sum + a.revenue, 0);
  const timelineData = REVENUE_TIMELINE[timelineKey] || REVENUE_TIMELINE['30 Days'];

  const chartData = useMemo(
    () =>
      timelineData.map((d) => ({
        label: d.label,
        total: d.total,
      })),
    [timelineData]
  );

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Dashboard"
        description={`Network overview for ${dateRange.toLowerCase()}`}
        actions={
          <>
            <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-xl border border-[#ECEEF2]">
              {(['Today', 'This Week', 'This Month'] as DateRangeOption[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onDateRangeChange(opt)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    dateRange === opt
                      ? 'bg-[#12345F] text-white'
                      : 'text-[#5B6B7C] hover:text-[#12345F]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onOpenCreateAffiliate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-lb-gradient hover:opacity-95 rounded-xl transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              Affiliate
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          label="Affiliates"
          value={affiliates.length}
          change="+12%"
          isPositive
          accent="navy"
          icon={<Building2 className="w-4 h-4" />}
          onClick={() => onNavigate('affiliates')}
        />
        <StatCard
          label="Customers"
          value={patients.length.toLocaleString()}
          change="+15%"
          isPositive
          accent="blue"
          icon={<Users className="w-4 h-4" />}
          onClick={() => onNavigate('patients')}
        />
        <StatCard
          label="Orders"
          value={orders.length.toLocaleString()}
          change="+11%"
          isPositive
          accent="green"
          icon={<ShoppingCart className="w-4 h-4" />}
          onClick={() => onNavigate('orders')}
        />
        <StatCard
          label="Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change="+17%"
          isPositive
          accent="blue"
          icon={<DollarSign className="w-4 h-4" />}
          onClick={() => onNavigate('reports')}
        />
      </div>

      <div className="bg-white rounded-xl border border-[#EAECEF] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold text-[#1A2332]">Revenue</h3>
          <div className="flex items-center gap-0.5 bg-[#F9FAFB] border border-[#EAECEF] rounded-lg p-0.5 self-start">
            {(['7 Days', '30 Days', '3 Months', '6 Months'] as TimelineKey[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimelineKey(t)}
                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  timelineKey === t
                    ? 'bg-white text-[#1A2332] shadow-sm border border-[#EAECEF]'
                    : 'text-[#9CA3AF] hover:text-[#1A2332] border border-transparent'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.fill} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={CHART.fill} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F1F3" />
              <XAxis
                dataKey="label"
                stroke={CHART.muted}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={CHART.muted}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`)}
                width={44}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: '1px solid #EAECEF',
                  boxShadow: 'none',
                  fontSize: 12,
                }}
                formatter={(value) => [
                  `$${Number(value ?? 0).toLocaleString()}`,
                  'Revenue',
                ]}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke={CHART.line}
                strokeWidth={2}
                fill="url(#gRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#EAECEF] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#1A2332]">Top affiliates</h3>
            <button
              type="button"
              onClick={() => onNavigate('affiliates')}
              className="text-xs font-medium text-[#6B7280] hover:text-[#1B3A5C] flex items-center gap-0.5"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] font-medium text-[#9CA3AF] border-b border-[#F3F4F6]">
                  <th className="pb-2.5 font-medium">Affiliate</th>
                  <th className="pb-2.5 font-medium">Status</th>
                  <th className="pb-2.5 font-medium text-right">Revenue</th>
                  <th className="pb-2.5 font-medium text-right w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {affiliates.slice(0, 5).map((aff) => (
                  <tr key={aff.id} className="hover:bg-[#FAFBFC]">
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#EEF1F5] text-[#4B5563] flex items-center justify-center text-[10px] font-semibold">
                          {aff.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#1A2332] truncate max-w-[140px]">
                          {aff.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <StatusBadge status={aff.status} size="sm" />
                    </td>
                    <td className="py-3 text-right tabular-nums text-[#1A2332] font-medium">
                      ${aff.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectAffiliateDetail(aff)}
                        className="p-1.5 text-[#9CA3AF] hover:text-[#1A2332] hover:bg-[#F3F4F6] rounded-md"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#EAECEF] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#1A2332]">Recent orders</h3>
            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className="text-xs font-medium text-[#6B7280] hover:text-[#1B3A5C] flex items-center gap-0.5"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] font-medium text-[#9CA3AF] border-b border-[#F3F4F6]">
                  <th className="pb-2.5 font-medium">Order</th>
                  <th className="pb-2.5 font-medium">Customer</th>
                  <th className="pb-2.5 font-medium text-right">Amount</th>
                  <th className="pb-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAFBFC]">
                    <td className="py-3 pr-2 font-mono text-xs text-[#6B7280]">
                      {order.id}
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-[#1A2332]">{order.patientName}</div>
                      <div className="text-[11px] text-[#9CA3AF]">{order.affiliateName}</div>
                    </td>
                    <td className="py-3 text-right tabular-nums font-medium text-[#1A2332]">
                      ${order.amount}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={order.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
