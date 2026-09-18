import React, { useState, useMemo } from 'react';
import {
  Users,
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Calendar,
  Filter,
  Eye,
  CreditCard,
  Percent,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  AffiliateProfile,
  AffiliatePatientItem,
  AffiliateOrderItem,
  AffiliateCommissionRecord,
  AffiliatePaymentPayout,
  AffiliateSalesDataPoint,
  AffiliateRoute
} from '../../../types';

interface AffiliateDashboardViewProps {
  affiliateProfile: AffiliateProfile;
  patients: AffiliatePatientItem[];
  orders: AffiliateOrderItem[];
  commissions: AffiliateCommissionRecord[];
  payments: AffiliatePaymentPayout[];
  salesData: AffiliateSalesDataPoint[];
  onNavigate: (route: AffiliateRoute) => void;
  onSelectPatient: (patient: AffiliatePatientItem) => void;
  onSelectOrder: (order: AffiliateOrderItem) => void;
}

export const AffiliateDashboardView: React.FC<AffiliateDashboardViewProps> = ({
  affiliateProfile,
  patients,
  orders,
  commissions,
  payments,
  salesData,
  onNavigate,
  onSelectPatient,
  onSelectOrder
}) => {
  const [dateRange, setDateRange] = useState<'Today' | '7 Days' | '30 Days' | '90 Days'>('30 Days');
  const [activeChartMetric, setActiveChartMetric] = useState<'revenue' | 'orders' | 'patients'>('revenue');

  // Filter sales data points by selected date range
  const chartPoints = useMemo(() => {
    const sliceCount =
      dateRange === 'Today' ? 2 : dateRange === '7 Days' ? 7 : dateRange === '30 Days' ? 30 : 90;
    return salesData.slice(-sliceCount);
  }, [salesData, dateRange]);

  // Aggregate KPI metrics based on orders and commissions
  const totalSales = useMemo(() => {
    return orders
      .filter((o) => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Refunded')
      .reduce((acc, o) => acc + o.total, 0);
  }, [orders]);

  const pendingCommissions = useMemo(() => {
    return commissions
      .filter((c) => c.status === 'Pending')
      .reduce((acc, c) => acc + c.commission, 0);
  }, [commissions]);

  const paidCommissions = useMemo(() => {
    return payments
      .filter((p) => p.status === 'Paid')
      .reduce((acc, p) => acc + p.amount, 0);
  }, [payments]);

  const approvedCommissions = useMemo(() => {
    return commissions
      .filter((c) => c.status === 'Approved')
      .reduce((acc, c) => acc + c.commission, 0);
  }, [commissions]);

  const totalCommissionsEarned = paidCommissions + approvedCommissions + pendingCommissions;

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);
  const recentPatients = useMemo(() => patients.slice(0, 5), [patients]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">
            Good morning, {affiliateProfile.name}
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Here's what's happening with your LeanBloom white-label business.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#E5E7EB] shadow-2xs self-start sm:self-auto">
          {(['Today', '7 Days', '30 Days', '90 Days'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                dateRange === range
                  ? 'bg-[#174A87] text-white shadow-xs'
                  : 'text-[#667085] hover:text-[#172033] hover:bg-[#F7F9FC]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Patients */}
        <div
          onClick={() => onNavigate('patients')}
          className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-[#174A87]/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#667085]">Total Patients</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF5EA] text-[#4A9B52] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#172033] tracking-tight">{patients.length}</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] font-semibold text-[#4A9B52]">
            <TrendingUp className="w-3 h-3" />
            <span>+12.5%</span>
            <span className="text-[#667085] font-normal ml-1">vs last month</span>
          </div>
        </div>

        {/* Total Orders */}
        <div
          onClick={() => onNavigate('orders')}
          className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-[#174A87]/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#667085]">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-[#174A87]/10 text-[#174A87] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#172033] tracking-tight">{orders.length}</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] font-semibold text-[#4A9B52]">
            <TrendingUp className="w-3 h-3" />
            <span>+8.2%</span>
            <span className="text-[#667085] font-normal ml-1">vs last month</span>
          </div>
        </div>

        {/* Total Sales */}
        <div
          onClick={() => onNavigate('sales')}
          className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-[#174A87]/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#667085]">Gross Sales</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF5EA] text-[#4A9B52] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#172033] tracking-tight">
            ${totalSales.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] font-semibold text-[#4A9B52]">
            <TrendingUp className="w-3 h-3" />
            <span>+14.7%</span>
            <span className="text-[#667085] font-normal ml-1">growth</span>
          </div>
        </div>

        {/* Pending Commissions */}
        <div
          onClick={() => onNavigate('commissions')}
          className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-[#174A87]/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#667085]">Pending Comm.</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 tracking-tight">
            ${pendingCommissions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-[#667085]">
            <span>Reconciling next cycle</span>
          </div>
        </div>

        {/* Paid Commissions */}
        <div
          onClick={() => onNavigate('payments')}
          className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-[#174A87]/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#667085]">Paid Commissions</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF5EA] text-[#4A9B52] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#4A9B52] tracking-tight">
            ${paidCommissions.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] font-semibold text-[#4A9B52]">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% disbursed</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Sales Overview Chart & Commission Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Sales & Referral Performance</h3>
              <p className="text-xs text-[#667085]">
                Aggregated daily trends for your active patients
              </p>
            </div>

            {/* Metric Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#F7F9FC] rounded-xl border border-[#E5E7EB] self-start sm:self-auto">
              <button
                onClick={() => setActiveChartMetric('revenue')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeChartMetric === 'revenue'
                    ? 'bg-white text-[#174A87] shadow-xs'
                    : 'text-[#667085] hover:text-[#172033]'
                }`}
              >
                Revenue ($)
              </button>
              <button
                onClick={() => setActiveChartMetric('orders')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeChartMetric === 'orders'
                    ? 'bg-white text-[#174A87] shadow-xs'
                    : 'text-[#667085] hover:text-[#172033]'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveChartMetric('patients')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeChartMetric === 'patients'
                    ? 'bg-white text-[#174A87] shadow-xs'
                    : 'text-[#667085] hover:text-[#172033]'
                }`}
              >
                Patients
              </button>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="affiliateSalesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#174A87" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#174A87" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="affiliateOrdersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A9B52" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4A9B52" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="label"
                  stroke="#667085"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                  stroke="#667085"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => (activeChartMetric === 'revenue' ? `$${val}` : `${val}`)}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as AffiliateSalesDataPoint;
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-lg border border-[#E5E7EB] text-xs space-y-1">
                          <p className="font-bold text-[#172033]">{data.date}</p>
                          <p className="text-[#174A87] font-semibold">
                            Sales: ${data.revenue.toLocaleString()}
                          </p>
                          <p className="text-[#4A9B52] font-semibold">Orders: {data.orders}</p>
                          <p className="text-[#667085]">
                            Est. Commission: ${data.commission.toFixed(2)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={activeChartMetric}
                  stroke={activeChartMetric === 'orders' ? '#4A9B52' : '#174A87'}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={
                    activeChartMetric === 'orders'
                      ? 'url(#affiliateOrdersGrad)'
                      : 'url(#affiliateSalesGrad)'
                  }
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commission Distribution Card (1 col) */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#172033]">Commission Overview</h3>
              <span className="px-2 py-0.5 text-[11px] font-bold text-[#174A87] bg-[#174A87]/10 rounded-full">
                {affiliateProfile.commissionRate}% Rate
              </span>
            </div>
            <p className="text-xs text-[#667085]">
              Lifetime earnings generated from referred patient checkouts
            </p>

            {/* Total Earned Headline */}
            <div className="mt-4 p-4 bg-[#F7F9FC] rounded-xl border border-[#E5E7EB] text-center">
              <span className="text-xs text-[#667085] block mb-0.5">Total Commission Earned</span>
              <div className="text-3xl font-black text-[#174A87]">
                ${totalCommissionsEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="mt-5 space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[#172033] mb-1 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4A9B52]" />
                    Paid Out via ACH
                  </span>
                  <span>${paidCommissions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4A9B52] rounded-full transition-all"
                    style={{
                      width: `${(paidCommissions / (totalCommissionsEarned || 1)) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#172033] mb-1 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#174A87]" />
                    Approved (Pending Payout)
                  </span>
                  <span>${approvedCommissions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#174A87] rounded-full transition-all"
                    style={{
                      width: `${(approvedCommissions / (totalCommissionsEarned || 1)) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#172033] mb-1 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Pending Intake Clearance
                  </span>
                  <span>${pendingCommissions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{
                      width: `${(pendingCommissions / (totalCommissionsEarned || 1)) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('commissions')}
            className="w-full py-2 px-3 text-xs font-bold text-[#174A87] hover:bg-[#174A87]/5 border border-[#174A87]/20 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Commission Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Columns: Recent Orders and Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Recent Patient Orders</h3>
              <p className="text-xs text-[#667085]">Latest transactions under your affiliate tag</p>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs font-bold text-[#174A87] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F7F9FC] text-[#667085] font-semibold border-y border-[#E5E7EB]">
                <tr>
                  <th className="px-3 py-2.5">Order ID</th>
                  <th className="px-3 py-2.5">Patient</th>
                  <th className="px-3 py-2.5 text-right">Amount</th>
                  <th className="px-3 py-2.5 text-right">Commission</th>
                  <th className="px-3 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className="hover:bg-[#EAF5EA]/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-3 py-3 font-mono font-bold text-[#174A87] group-hover:underline">
                      {order.id}
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-semibold text-[#172033]">{order.patientName}</div>
                      <div className="text-[11px] text-[#667085] truncate max-w-[140px]">
                        {order.productName}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-[#172033]">
                      ${order.total}
                    </td>
                    <td className="px-3 py-3 text-right font-bold text-[#4A9B52]">
                      +${order.commissionAmount.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          order.orderStatus === 'Completed'
                            ? 'bg-[#EAF5EA] text-[#4A9B52]'
                            : order.orderStatus === 'Processing'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Patients Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Referred Patients</h3>
              <p className="text-xs text-[#667085]">Recently active registered patients</p>
            </div>
            <button
              onClick={() => onNavigate('patients')}
              className="text-xs font-bold text-[#174A87] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#E5E7EB]">
            {recentPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => onSelectPatient(patient)}
                className="py-3 flex items-center justify-between hover:bg-[#F7F9FC] px-2 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EAF5EA] text-[#4A9B52] font-bold text-xs flex items-center justify-center">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#172033] group-hover:text-[#174A87]">
                      {patient.name}
                    </h4>
                    <p className="text-[11px] text-[#667085]">{patient.plan}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-[#172033]">
                    ${patient.totalSpent.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#667085]">
                    {patient.ordersCount} orders • {patient.joinedDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
