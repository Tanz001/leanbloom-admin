import React, { useMemo, useState } from 'react';
import {
  Building2,
  Users,
  ShoppingCart,
  DollarSign,
  Clock,
  TrendingUp,
  Plus,
  FileText,
  Eye,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Percent
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
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

const COLORS = {
  navy: '#12345F',
  blue: '#2D82C4',
  green: '#4FAF4A',
  lightBlue: '#3A91D8',
  muted: '#98A2B3'
};

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

  const activeAffiliatesCount = affiliates.filter((a) => a.status === 'Active').length;
  const totalRevenue = affiliates.reduce((sum, a) => sum + a.revenue, 0);
  const totalCommission = affiliates.reduce((sum, a) => sum + a.commission, 0);

  const timelineData = REVENUE_TIMELINE[timelineKey] || REVENUE_TIMELINE['30 Days'];

  const chartData = useMemo(
    () =>
      timelineData.map((d) => ({
        label: d.label,
        total: d.total,
        affiliate: d.affiliate,
        leanbloom: d.leanbloom,
        orders: d.orders,
        customers: d.patients
      })),
    [timelineData]
  );

  const orderStatusData = useMemo(() => {
    const counts = {
      Completed: orders.filter((o) => o.status === 'Completed').length,
      Processing: orders.filter((o) => o.status === 'Processing').length,
      Pending: orders.filter((o) => o.status === 'Pending').length,
      Cancelled: orders.filter((o) => o.status === 'Cancelled').length,
      Refunded: orders.filter((o) => o.status === 'Refunded').length
    };
    const total = Math.max(orders.length, 1);
    return [
      { status: 'Completed', count: counts.Completed || 42, fill: COLORS.green },
      { status: 'Processing', count: counts.Processing || 18, fill: COLORS.blue },
      { status: 'Pending', count: counts.Pending || 9, fill: '#D99A18' },
      { status: 'Cancelled', count: counts.Cancelled || 3, fill: COLORS.muted },
      { status: 'Refunded', count: counts.Refunded || 2, fill: '#D64545' }
    ].map((row) => ({
      ...row,
      pct: Math.round((row.count / (orders.length || total)) * 100) || row.count
    }));
  }, [orders]);

  const topAffiliatesChart = useMemo(
    () =>
      [...affiliates]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map((a) => ({
          name: a.name.length > 14 ? `${a.name.slice(0, 12)}…` : a.name,
          revenue: a.revenue,
          commission: a.commission
        })),
    [affiliates]
  );

  return (
    <div className="space-y-6 pb-8" id="master-dashboard-container">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#12345F] tracking-tight">Dashboard</h2>
          <p className="text-sm text-[#667085] mt-1">
            Affiliates, storefronts, and sales across your LeanBloom network.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E4E7EC] self-start sm:self-auto shadow-sm overflow-x-auto">
          {(['Today', 'This Week', 'This Month', 'This Year'] as DateRangeOption[]).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onDateRangeChange(opt)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                dateRange === opt
                  ? 'bg-[#12345F] text-white shadow-sm'
                  : 'text-[#667085] hover:text-[#12345F] hover:bg-[#F7F9FC]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        <StatCard
          label="Total Affiliates"
          value={affiliates.length}
          change="+12.5%"
          isPositive
          icon={<Building2 className="w-5 h-5" />}
          iconBgColor="bg-[#EAF4FB]"
          iconColor="text-[#12345F]"
          accentColor={COLORS.navy}
          onClick={() => onNavigate('affiliates')}
        />
        <StatCard
          label="Active Affiliates"
          value={activeAffiliatesCount}
          change="+8.2%"
          isPositive
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBgColor="bg-[#EAF6E7]"
          iconColor="text-[#4FAF4A]"
          accentColor={COLORS.green}
          onClick={() => onNavigate('affiliates')}
        />
        <StatCard
          label="Customers"
          value={patients.length.toLocaleString()}
          change="+14.6%"
          isPositive
          icon={<Users className="w-5 h-5" />}
          iconBgColor="bg-[#EAF4FB]"
          iconColor="text-[#2D82C4]"
          accentColor={COLORS.blue}
          onClick={() => onNavigate('patients')}
        />
        <StatCard
          label="Orders"
          value={orders.length.toLocaleString()}
          change="+11.3%"
          isPositive
          icon={<ShoppingCart className="w-5 h-5" />}
          iconBgColor="bg-[#F0FDF4]"
          iconColor="text-[#4FAF4A]"
          accentColor={COLORS.green}
          onClick={() => onNavigate('orders')}
        />
        <StatCard
          label="Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change="+16.8%"
          isPositive
          icon={<DollarSign className="w-5 h-5" />}
          iconBgColor="bg-[#EAF4FB]"
          iconColor="text-[#12345F]"
          accentColor={COLORS.navy}
          onClick={() => onNavigate('reports')}
        />
        <StatCard
          label="Commissions"
          value={`$${totalCommission.toLocaleString()}`}
          change="+9.4%"
          isPositive
          period="owed to affiliates"
          icon={<Percent className="w-5 h-5" />}
          iconBgColor="bg-[#FEF6EE]"
          iconColor="text-[#D99A18]"
          accentColor="#D99A18"
          onClick={() => onNavigate('commissions')}
        />
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-4 border-b border-[#F2F4F7]">
          <div>
            <h3 className="text-base font-bold text-[#12345F] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2D82C4]" />
              Revenue overview
            </h3>
            <p className="text-xs text-[#667085] mt-0.5">
              Total sales, affiliate share, and LeanBloom margin
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#475467]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS.navy }} /> Total
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS.blue }} /> Affiliate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS.green }} /> LeanBloom
              </span>
            </div>
            <div className="flex items-center bg-[#F7F9FC] border border-[#E4E7EC] rounded-lg p-0.5">
              {(['7 Days', '30 Days', '3 Months', '6 Months'] as TimelineKey[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimelineKey(t)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                    timelineKey === t
                      ? 'bg-[#12345F] text-white shadow-sm'
                      : 'text-[#667085] hover:text-[#12345F]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-72 sm:h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.navy} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={COLORS.navy} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gAffiliate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gLean" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F4" />
              <XAxis
                dataKey="label"
                stroke={COLORS.muted}
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E4E7EC' }}
              />
              <YAxis
                stroke={COLORS.muted}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`)}
                width={48}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #E4E7EC',
                  boxShadow: '0 8px 24px rgba(18,52,95,0.1)',
                  fontSize: 12
                }}
                formatter={(value, name) => [
                  `$${Number(value ?? 0).toLocaleString()}`,
                  name === 'total' ? 'Total' : name === 'affiliate' ? 'Affiliate' : 'LeanBloom'
                ]}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke={COLORS.navy}
                strokeWidth={2.5}
                fill="url(#gTotal)"
                name="total"
              />
              <Area
                type="monotone"
                dataKey="affiliate"
                stroke={COLORS.blue}
                strokeWidth={2}
                fill="url(#gAffiliate)"
                name="affiliate"
              />
              <Area
                type="monotone"
                dataKey="leanbloom"
                stroke={COLORS.green}
                strokeWidth={2}
                fill="url(#gLean)"
                name="leanbloom"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Affiliate bars + order status */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
            <div>
              <h3 className="text-base font-bold text-[#12345F]">Top affiliates</h3>
              <p className="text-xs text-[#667085]">Revenue vs commission</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('affiliates')}
              className="text-xs font-semibold text-[#2D82C4] hover:text-[#12345F] flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topAffiliatesChart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F4" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={{ stroke: '#E4E7EC' }} />
                <YAxis
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  width={44}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #E4E7EC',
                    fontSize: 12
                  }}
                  formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="revenue" name="Revenue" fill={COLORS.navy} radius={[6, 6, 0, 0]} />
                <Bar dataKey="commission" name="Commission" fill={COLORS.green} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-sm">
          <div className="pb-3 border-b border-[#F2F4F7]">
            <h3 className="text-base font-bold text-[#12345F]">Order status</h3>
            <p className="text-xs text-[#667085]">Pipeline across storefronts</p>
          </div>
          <div className="h-52 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatusData} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EEF0F4" />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="status"
                  width={78}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E4E7EC', fontSize: 12 }}
                  formatter={(value) => [value ?? 0, 'Orders']}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                  {orderStatusData.map((entry) => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-2">
            {orderStatusData.map((row) => (
              <div key={row.status} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-[#475467]">
                  <span className="w-2 h-2 rounded-full" style={{ background: row.fill }} />
                  {row.status}
                </span>
                <span className="font-mono font-semibold text-[#12345F]">{row.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
            <div>
              <h3 className="text-base font-bold text-[#12345F] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#2D82C4]" />
                Affiliate performance
              </h3>
              <p className="text-xs text-[#667085]">Top partners by revenue</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('affiliates')}
              className="text-xs font-semibold text-[#2D82C4] hover:text-[#12345F] flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] font-bold text-[#98A2B3] uppercase tracking-wider">
                  <th className="py-2.5 px-2">Affiliate</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2 text-right">Revenue</th>
                  <th className="py-2.5 px-2 text-right">Growth</th>
                  <th className="py-2.5 px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F4F7]">
                {affiliates.slice(0, 5).map((aff) => (
                  <tr key={aff.id} className="hover:bg-[#F7F9FC]">
                    <td className="py-3 px-2 font-semibold text-[#12345F]">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ backgroundColor: aff.primaryColor || COLORS.navy }}
                        >
                          {aff.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[120px]">{aff.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <StatusBadge status={aff.status} size="sm" />
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-bold">
                      ${aff.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-[#4FAF4A]">{aff.growth}</td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectAffiliateDetail(aff)}
                          className="p-1.5 text-[#667085] hover:text-[#12345F] hover:bg-[#EAF4FB] rounded-lg"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenLoginAsAffiliate(aff)}
                          className="p-1.5 text-[#2D82C4] hover:text-[#12345F] hover:bg-[#EAF4FB] rounded-lg"
                          title="Login as affiliate"
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

        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
            <div>
              <h3 className="text-base font-bold text-[#12345F] flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#4FAF4A]" />
                Recent orders
              </h3>
              <p className="text-xs text-[#667085]">Latest across all storefronts</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className="text-xs font-semibold text-[#2D82C4] hover:text-[#12345F] flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] font-bold text-[#98A2B3] uppercase tracking-wider">
                  <th className="py-2.5 px-2">Order</th>
                  <th className="py-2.5 px-2">Customer</th>
                  <th className="py-2.5 px-2 text-right">Amount</th>
                  <th className="py-2.5 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F4F7]">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-[#F7F9FC]">
                    <td className="py-3 px-2 font-mono font-bold text-[#2D82C4]">{order.id}</td>
                    <td className="py-3 px-2">
                      <div className="font-medium text-[#12345F]">{order.patientName}</div>
                      <div className="text-[10px] text-[#98A2B3]">{order.affiliateName}</div>
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-bold">${order.amount}</td>
                    <td className="py-3 px-2">
                      <StatusBadge status={order.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-sm">
        <h3 className="text-xs font-bold text-[#98A2B3] uppercase tracking-wider mb-3">Quick actions</h3>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onOpenCreateAffiliate}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#12345F] hover:bg-[#173B72] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Affiliate
          </button>
          <button
            type="button"
            onClick={onOpenAddProduct}
            className="px-3.5 py-2 text-xs font-semibold text-[#12345F] bg-[#EAF4FB] hover:bg-[#d8ecf9] rounded-lg transition-colors flex items-center gap-1.5 border border-[#2D82C4]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </button>
          <button
            type="button"
            onClick={() => onNavigate('pricing')}
            className="px-3.5 py-2 text-xs font-semibold text-[#475467] bg-white border border-[#E4E7EC] hover:bg-[#F7F9FC] rounded-lg flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5 text-[#2D82C4]" />
            Pricing
          </button>
          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="px-3.5 py-2 text-xs font-semibold text-[#475467] bg-white border border-[#E4E7EC] hover:bg-[#F7F9FC] rounded-lg flex items-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-[#4FAF4A]" />
            Orders
          </button>
          <button
            type="button"
            onClick={() => onNavigate('reports')}
            className="px-3.5 py-2 text-xs font-semibold text-[#475467] bg-white border border-[#E4E7EC] hover:bg-[#F7F9FC] rounded-lg flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-[#667085]" />
            Reports
          </button>
          <button
            type="button"
            onClick={() => onNavigate('payments')}
            className="px-3.5 py-2 text-xs font-semibold text-[#475467] bg-white border border-[#E4E7EC] hover:bg-[#F7F9FC] rounded-lg flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-[#D99A18]" />
            Payments
          </button>
        </div>
      </div>
    </div>
  );
};
