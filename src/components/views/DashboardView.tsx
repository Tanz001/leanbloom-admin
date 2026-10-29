import React, { useMemo, useState } from 'react';
import {
  Building2,
  Users,
  ShoppingCart,
  DollarSign,
  Plus,
  ChevronRight,
  Eye,
  Percent,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
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
  bar: '#173B72',
  muted: '#A8B2BE',
};

function parseOrderDate(dateStr: string): Date | null {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
}

function daysForTimeline(key: TimelineKey): number {
  switch (key) {
    case '7 Days':
      return 7;
    case '30 Days':
      return 30;
    case '3 Months':
      return 90;
    case '6 Months':
      return 180;
    default:
      return 30;
  }
}

function filterByDateRange(orders: Order[], range: DateRangeOption): Order[] {
  const now = new Date();
  const start = new Date(now);
  if (range === 'Today') {
    start.setHours(0, 0, 0, 0);
  } else if (range === 'This Week') {
    start.setDate(now.getDate() - 7);
  } else {
    start.setDate(now.getDate() - 30);
  }
  return orders.filter((o) => {
    const d = parseOrderDate(o.date);
    return d ? d >= start : true;
  });
}

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

  const rangedOrders = useMemo(
    () => filterByDateRange(orders, dateRange),
    [orders, dateRange]
  );

  const totalRevenue = useMemo(
    () => rangedOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0),
    [rangedOrders]
  );

  const estCommission = useMemo(() => {
    return rangedOrders.reduce((sum, o) => {
      const aff = affiliates.find((a) => a.id === o.affiliateId);
      const rate = aff?.commissionRate ?? 15;
      return sum + (Number(o.amount) || 0) * (rate / 100);
    }, 0);
  }, [rangedOrders, affiliates]);

  const activeAffiliates = affiliates.filter((a) => a.status === 'Active').length;

  const chartData = useMemo(() => {
    const days = daysForTimeline(timelineKey);
    const now = new Date();
    const buckets: { key: string; label: string; total: number; count: number }[] = [];

    if (days <= 30) {
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        buckets.push({
          key,
          label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          total: 0,
          count: 0,
        });
      }
    } else {
      const weeks = Math.ceil(days / 7);
      for (let i = weeks - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i * 7);
        const key = d.toISOString().slice(0, 10);
        buckets.push({
          key,
          label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          total: 0,
          count: 0,
        });
      }
    }

    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);

    for (const order of orders) {
      const d = parseOrderDate(order.date);
      if (!d || d < cutoff) continue;
      const amount = Number(order.amount) || 0;
      if (days <= 30) {
        const key = new Date(d);
        key.setHours(0, 0, 0, 0);
        const iso = key.toISOString().slice(0, 10);
        const bucket = buckets.find((b) => b.key === iso);
        if (bucket) {
          bucket.total += amount;
          bucket.count += 1;
        }
      } else {
        let best: (typeof buckets)[0] | null = null;
        for (const b of buckets) {
          if (d >= new Date(b.key)) best = b;
        }
        if (best) {
          best.total += amount;
          best.count += 1;
        }
      }
    }

    return buckets.map((b) => ({
      label: b.label,
      total: Math.round(b.total * 100) / 100,
      orders: b.count,
    }));
  }, [orders, timelineKey]);

  const affiliateBarData = useMemo(() => {
    return [...affiliates]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6)
      .map((a) => ({
        name: a.name.length > 14 ? `${a.name.slice(0, 12)}…` : a.name,
        revenue: a.revenue,
        commission: a.commission,
      }));
  }, [affiliates]);

  const topAffiliates = useMemo(
    () => [...affiliates].sort((a, b) => b.revenue - a.revenue).slice(0, 5),
    [affiliates]
  );

  return (
    <div className="space-y-7 pb-10">
      <PageHeader
        title="Dashboard"
        description={`Live network overview for ${dateRange.toLowerCase()}`}
        actions={
          <>
            <div className="flex items-center gap-0.5 bg-white p-1 rounded-xl border border-[#E2E8F0] shadow-[0_1px_2px_rgba(15,28,46,0.04)]">
              {(['Today', 'This Week', 'This Month'] as DateRangeOption[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onDateRangeChange(opt)}
                  className={`px-3 py-1.5 text-[13px] font-semibold rounded-lg transition-colors ${
                    dateRange === opt
                      ? 'bg-[#0B2440] text-white shadow-sm'
                      : 'text-[#5B6B7C] hover:text-[#0B2440]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onOpenCreateAffiliate}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-lb-gradient hover:opacity-95 rounded-xl transition-opacity shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Affiliate
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Active affiliates"
          value={`${activeAffiliates} / ${affiliates.length}`}
          change={`${affiliates.length} total`}
          isPositive
          accent="navy"
          icon={<Building2 className="w-4 h-4" />}
          onClick={() => onNavigate('affiliates')}
        />
        <StatCard
          label="Customers"
          value={patients.length.toLocaleString()}
          change={`${rangedOrders.length} orders in range`}
          isPositive
          accent="blue"
          icon={<Users className="w-4 h-4" />}
          onClick={() => onNavigate('patients')}
        />
        <StatCard
          label="Orders"
          value={rangedOrders.length.toLocaleString()}
          change={`${orders.length} all time`}
          isPositive
          accent="green"
          icon={<ShoppingCart className="w-4 h-4" />}
          onClick={() => onNavigate('orders')}
        />
        <StatCard
          label="Revenue"
          value={`$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          change={`~$${estCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })} commission`}
          isPositive
          accent="blue"
          icon={<DollarSign className="w-4 h-4" />}
          onClick={() => onNavigate('orders')}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3 bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,28,46,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <h3 className="text-[15px] font-semibold text-[#0B2440] font-display">Revenue over time</h3>
            <div className="flex items-center gap-0.5 bg-[#F5F8FB] border border-[#E2E8F0] rounded-xl p-1 self-start">
              {(['7 Days', '30 Days', '3 Months', '6 Months'] as TimelineKey[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimelineKey(t)}
                  className={`px-2.5 py-1.5 text-[12px] font-semibold rounded-lg transition-colors ${
                    timelineKey === t
                      ? 'bg-white text-[#0B2440] shadow-sm border border-[#E2E8F0]'
                      : 'text-[#8A96A6] hover:text-[#0B2440] border border-transparent'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            {chartData.every((d) => d.total === 0) ? (
              <div className="h-full flex items-center justify-center text-[14px] text-[#6B7C8F] font-medium">
                No order revenue in this period yet
              </div>
            ) : (
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
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke={CHART.muted}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) =>
                      v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
                    }
                    width={44}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: '1px solid #EAECEF',
                      boxShadow: 'none',
                      fontSize: 12,
                    }}
                    formatter={(value, name) => [
                      name === 'orders'
                        ? String(value ?? 0)
                        : `$${Number(value ?? 0).toLocaleString()}`,
                      name === 'orders' ? 'Orders' : 'Revenue',
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
            )}
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,28,46,0.04)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[15px] font-semibold text-[#0B2440] font-display">Revenue by affiliate</h3>
            <Percent className="w-4 h-4 text-[#8A96A6]" />
          </div>
          <div className="h-72 w-full">
            {affiliateBarData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[14px] text-[#6B7C8F] font-medium">
                No affiliates yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={affiliateBarData} margin={{ top: 8, right: 4, left: 0, bottom: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F1F3" />
                  <XAxis
                    dataKey="name"
                    stroke={CHART.muted}
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    angle={-20}
                    textAnchor="end"
                    height={48}
                  />
                  <YAxis
                    stroke={CHART.muted}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) =>
                      v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
                    }
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: '1px solid #EAECEF',
                      fontSize: 12,
                    }}
                    formatter={(value) => [
                      `$${Number(value ?? 0).toLocaleString()}`,
                      'Revenue',
                    ]}
                  />
                  <Bar dataKey="revenue" fill={CHART.bar} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,28,46,0.04)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[15px] font-semibold text-[#0B2440] font-display">Top affiliates</h3>
            <button
              type="button"
              onClick={() => onNavigate('affiliates')}
              className="text-[13px] font-semibold text-[#5B6B7C] hover:text-[#2D82C4] flex items-center gap-0.5"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13.5px]">
              <thead>
                <tr className="text-[11px] font-semibold uppercase tracking-wide text-[#8A96A6] border-b border-[#EEF2F6]">
                  <th className="pb-3 font-semibold">Affiliate</th>
                  <th className="pb-3 font-semibold">Rate</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Revenue</th>
                  <th className="pb-3 font-semibold text-right w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F3F7]">
                {topAffiliates.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-[13px] text-[#6B7C8F]">
                      No affiliates yet
                    </td>
                  </tr>
                )}
                {topAffiliates.map((aff) => (
                  <tr key={aff.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-3.5 pr-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#E8EEF5] text-[#12345F] flex items-center justify-center text-[11px] font-bold font-display">
                          {aff.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-[#0B2440] truncate max-w-[140px]">
                          {aff.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 text-[13px] font-semibold tabular-nums text-[#5B6B7C]">
                      {aff.commissionRate ?? 15}%
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={aff.status} size="sm" />
                    </td>
                    <td className="py-3.5 text-right tabular-nums text-[#0B2440] font-semibold">
                      ${aff.revenue.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectAffiliateDetail(aff)}
                        className="p-1.5 text-[#8A96A6] hover:text-[#0B2440] hover:bg-[#EEF3F8] rounded-lg"
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

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,28,46,0.04)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[15px] font-semibold text-[#0B2440] font-display">Recent orders</h3>
            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className="text-[13px] font-semibold text-[#5B6B7C] hover:text-[#2D82C4] flex items-center gap-0.5"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13.5px]">
              <thead>
                <tr className="text-[11px] font-semibold uppercase tracking-wide text-[#8A96A6] border-b border-[#EEF2F6]">
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F3F7]">
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-[13px] text-[#6B7C8F]">
                      No orders yet
                    </td>
                  </tr>
                )}
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-3.5 pr-2 font-mono text-[12px] font-medium text-[#5B6B7C]">
                      {order.id}
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-[#0B2440]">{order.patientName}</div>
                      <div className="text-[12px] text-[#8A96A6] mt-0.5">{order.affiliateName}</div>
                    </td>
                    <td className="py-3.5 text-right tabular-nums font-semibold text-[#0B2440]">
                      ${order.amount}
                    </td>
                    <td className="py-3.5">
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
