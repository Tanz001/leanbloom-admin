import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  ShoppingBag,
  Percent,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { AffiliateSalesDataPoint, AffiliateOrderItem } from '../../../types';
import { MOCK_PRODUCT_PERFORMANCE, ProductPerformanceItem } from '../../../data/affiliateMockData';

interface AffiliateSalesViewProps {
  affiliateId: string;
  salesData: AffiliateSalesDataPoint[];
  orders: AffiliateOrderItem[];
}

export const AffiliateSalesView: React.FC<AffiliateSalesViewProps> = ({
  affiliateId,
  salesData,
  orders
}) => {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('90D');
  const [chartType, setChartType] = useState<'revenue' | 'orders'>('revenue');

  // Filter sales points
  const points = useMemo(() => {
    const count = timeRange === '7D' ? 7 : timeRange === '30D' ? 30 : 90;
    return salesData.slice(-count);
  }, [salesData, timeRange]);

  // Aggregate metrics
  const grossSales = useMemo(() => {
    return points.reduce((acc, p) => acc + p.revenue, 0);
  }, [points]);

  const totalOrdersCount = useMemo(() => {
    return points.reduce((acc, p) => acc + p.orders, 0);
  }, [points]);

  const totalCommission = useMemo(() => {
    return points.reduce((acc, p) => acc + p.commission, 0);
  }, [points]);

  const aov = totalOrdersCount > 0 ? grossSales / totalOrdersCount : 0;
  const conversionRate = 3.84; // Typical high-converting white-label medical funnel

  // Product performance items
  const productPerformance: ProductPerformanceItem[] =
    MOCK_PRODUCT_PERFORMANCE[affiliateId] || MOCK_PRODUCT_PERFORMANCE['affiliate_001'];

  // Data for Category breakdown pie chart
  const categoryData = useMemo(() => {
    const catMap: Record<string, number> = {};
    productPerformance.forEach((p) => {
      catMap[p.category] = (catMap[p.category] || 0) + p.revenue;
    });
    return Object.entries(catMap).map(([name, value]) => ({ name, value }));
  }, [productPerformance]);

  const PIE_COLORS = ['#174A87', '#4A9B52', '#38BDF8', '#F59E0B', '#8B5CF6'];

  // CSV Export for Sales
  const handleExportSalesCSV = () => {
    const headers = ['Date', 'Gross Sales ($)', 'Orders', 'Referred Patients', 'Affiliate Commission ($)'];
    const rows = points.map((p) => [
      p.date,
      p.revenue.toFixed(2),
      p.orders,
      p.patients,
      p.commission.toFixed(2)
    ]);
    const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LeanBloom-SalesAnalytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">Sales Analytics</h1>
          <p className="text-xs text-[#667085] mt-1">
            Track revenue performance, order volume, and product breakdown over time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range switcher */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#E5E7EB] shadow-2xs">
            {(['7D', '30D', '90D'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  timeRange === r
                    ? 'bg-[#174A87] text-white shadow-xs'
                    : 'text-[#667085] hover:text-[#172033]'
                }`}
              >
                {r === '7D' ? '7 Days' : r === '30D' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportSalesCSV}
            className="px-3.5 py-2 text-xs font-semibold text-[#172033] bg-white hover:bg-[#F7F9FC] border border-[#E5E7EB] rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#667085]" />
            <span>Export Sales</span>
          </button>
        </div>
      </div>

      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-xs font-semibold text-[#667085] block mb-1">
            Period Gross Sales
          </span>
          <div className="text-2xl font-black text-[#172033]">
            ${grossSales.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] font-semibold text-[#4A9B52]">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2%</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-xs font-semibold text-[#667085] block mb-1">Total Orders</span>
          <div className="text-2xl font-black text-[#172033]">{totalOrdersCount}</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] font-semibold text-[#4A9B52]">
            <TrendingUp className="w-3 h-3" />
            <span>+9.8%</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-xs font-semibold text-[#667085] block mb-1">Commission Earned</span>
          <div className="text-2xl font-black text-[#4A9B52]">
            ${totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-[#667085]">
            <span>15% avg markup</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-xs font-semibold text-[#667085] block mb-1">Average Order Value</span>
          <div className="text-2xl font-black text-[#174A87]">${aov.toFixed(2)}</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-[#667085]">
            <span>Across all plans</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <span className="text-xs font-semibold text-[#667085] block mb-1">Funnel Conversion</span>
          <div className="text-2xl font-black text-[#172033]">{conversionRate}%</div>
          <div className="flex items-center gap-1 mt-2 text-[11px] font-semibold text-[#4A9B52]">
            <TrendingUp className="w-3 h-3" />
            <span>+0.6%</span>
          </div>
        </div>
      </div>

      {/* Main Charts: Daily Curve & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Sales/Orders Area Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Daily Sales Velocity</h3>
              <p className="text-xs text-[#667085]">
                {timeRange === '7D' ? 'Last 7 days' : timeRange === '30D' ? 'Last 30 days' : '90-day trajectory'}
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-[#F7F9FC] rounded-xl border border-[#E5E7EB]">
              <button
                onClick={() => setChartType('revenue')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  chartType === 'revenue'
                    ? 'bg-white text-[#174A87] shadow-xs'
                    : 'text-[#667085] hover:text-[#172033]'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setChartType('orders')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  chartType === 'orders'
                    ? 'bg-white text-[#174A87] shadow-xs'
                    : 'text-[#667085] hover:text-[#172033]'
                }`}
              >
                Orders
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesVelocityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#174A87" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#174A87" stopOpacity={0.0} />
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
                  tickFormatter={(v) => (chartType === 'revenue' ? `$${v}` : `${v}`)}
                />
                <Tooltip
                  content={({ active, payload }) => {
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
                            Commission: ${data.commission.toFixed(2)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={chartType}
                  stroke={chartType === 'orders' ? '#4A9B52' : '#174A87'}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#salesVelocityGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut / Bar Chart (1 col) */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#172033]">Sales by Treatment Program</h3>
            <p className="text-xs text-[#667085]">Revenue contribution by clinical protocol</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`$${Number(val || 0).toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    borderColor: '#E5E7EB',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 text-xs">
            {categoryData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-[#172033]">
                <span className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  <span className="truncate">{item.name}</span>
                </span>
                <span className="font-semibold ml-2">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Performance Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#172033]">Product Performance Breakdown</h3>
            <p className="text-xs text-[#667085]">
              Detailed metrics per treatment SKU offered through your affiliate clinic
            </p>
          </div>
          <span className="text-xs font-semibold text-[#174A87] bg-[#174A87]/10 px-2.5 py-1 rounded-lg">
            {productPerformance.length} Active SKUs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F9FC] text-[#667085] font-semibold border-b border-[#E5E7EB]">
              <tr>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3 text-center">Orders</th>
                <th className="px-3 py-3 text-center">Units Sold</th>
                <th className="px-4 py-3 text-right">Gross Revenue</th>
                <th className="px-4 py-3 text-right">Commission Earned</th>
                <th className="px-3 py-3 text-right">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {productPerformance.map((item) => (
                <tr key={item.id} className="hover:bg-[#F7F9FC] transition-colors">
                  <td className="px-4 py-3.5 font-bold text-[#172033]">{item.product}</td>
                  <td className="px-3 py-3.5">
                    <span className="bg-[#F7F9FC] border border-[#E5E7EB] px-2 py-0.5 rounded-md text-[11px] font-medium text-[#667085]">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-center font-medium text-[#172033]">
                    {item.orders}
                  </td>
                  <td className="px-3 py-3.5 text-center font-medium text-[#172033]">
                    {item.unitsSold}
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-[#172033]">
                    ${item.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-[#4A9B52]">
                    ${item.commission.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3.5 text-right font-semibold text-[#4A9B52]">
                    {item.growth}
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
