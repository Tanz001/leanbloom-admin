import React, { useState } from 'react';
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  Building2,
  Filter,
  CheckCircle2,
  PieChart,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { Affiliate, Product } from '../../types';

interface ReportsViewProps {
  affiliates: Affiliate[];
  products: Product[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ affiliates, products }) => {
  const [selectedReportType, setSelectedReportType] = useState('Revenue Report');
  const [selectedAffiliate, setSelectedAffiliate] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('Last 30 Days');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    title: string;
    generatedAt: string;
    recordsCount: number;
    totalAmount: string;
  } | null>({
    title: 'Revenue Report (All Affiliates)',
    generatedAt: 'Sep 18, 2026, 4:15 PM',
    recordsCount: 18421,
    totalAmount: '$1,284,920.00'
  });

  const reportTypes = [
    'Revenue Report',
    'Affiliate Sales Report',
    'Patient Growth Report',
    'Orders Report',
    'Commission Report',
    'Payment Report',
    'Product Performance',
    'Affiliate Performance'
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedResult({
        title: `${selectedReportType} (${selectedAffiliate === 'All' ? 'Consolidated Network' : 'Filtered Tenant'})`,
        generatedAt: 'Just now',
        recordsCount: Math.floor(Math.random() * 5000) + 1200,
        totalAmount: `$${(Math.floor(Math.random() * 800000) + 200000).toLocaleString()}.00`
      });
    }, 600);
  };

  const handleExport = (format: 'CSV' | 'PDF') => {
    alert(`Downloading ${selectedReportType} in ${format} format...`);
  };

  return (
    <div className="space-y-6 pb-12" id="reports-view-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-[#E4E7EC] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Financial & Operational Reports
          </h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Generate compliant accounting statements, patient velocity audits, and child tenant metrics.
          </p>
        </div>
      </div>

      {/* Generator Control Card */}
      <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#173B72]" />
          Configure Report Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#344054] mb-1">
              Report Category *
            </label>
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#D0D5DD] rounded-lg bg-white"
            >
              {reportTypes.map((rt) => (
                <option key={rt} value={rt}>
                  {rt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#344054] mb-1">
              Affiliate Scope
            </label>
            <select
              value={selectedAffiliate}
              onChange={(e) => setSelectedAffiliate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#D0D5DD] rounded-lg bg-white"
            >
              <option value="All">All Affiliates (Master Consolidated)</option>
              {affiliates.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#344054] mb-1">
              Time Horizon
            </label>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#D0D5DD] rounded-lg bg-white"
            >
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Quarter (Q3 2026)">This Quarter (Q3 2026)</option>
              <option value="Year to Date (YTD 2026)">Year to Date (YTD 2026)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-[#F2F4F7]">
          <span className="text-xs text-[#667085]">
            Reports are generated with GAAP compliant revenue recognition.
          </span>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-lg shadow-xs transition-colors disabled:opacity-50"
          >
            {isGenerating ? 'Compiling Statement...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Generated Report Preview */}
      {generatedResult && (
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#F2F4F7]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#EAF4FB] text-[#173B72] rounded-xl">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#172033]">{generatedResult.title}</h3>
                <p className="text-xs text-[#667085]">
                  Generated: {generatedResult.generatedAt} • {generatedResult.recordsCount.toLocaleString()} entries compiled
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleExport('CSV')}
                className="px-3 py-1.5 text-xs font-semibold text-[#173B72] bg-[#EAF4FB] hover:bg-[#d8ecf9] rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => handleExport('PDF')}
                className="px-3 py-1.5 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] hover:bg-[#F8F9FC] rounded-lg transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#D64545]" />
                Export PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-[#F8F9FC] rounded-lg border border-[#E4E7EC]">
              <span className="text-[#667085]">Total Consolidated Value</span>
              <p className="text-lg font-bold text-[#172033] font-mono mt-0.5">
                {generatedResult.totalAmount}
              </p>
            </div>
            <div className="p-3 bg-[#F8F9FC] rounded-lg border border-[#E4E7EC]">
              <span className="text-[#667085]">Audited Entities</span>
              <p className="text-lg font-bold text-[#173B72] mt-0.5">
                {affiliates.length} Affiliates Included
              </p>
            </div>
            <div className="p-3 bg-[#F8F9FC] rounded-lg border border-[#E4E7EC]">
              <span className="text-[#667085]">Compliance Hash</span>
              <p className="font-mono text-xs text-[#2D82C4] mt-1 truncate">
                SHA256: 9e88b2a1c00f8923
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
