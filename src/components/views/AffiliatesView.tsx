import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  Filter,
  ExternalLink,
  Eye,
  Edit2,
  Trash2,
  Power,
  Globe,
  Mail,
  Phone,
  ArrowLeft,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Palette
} from 'lucide-react';
import { Affiliate, Order, Patient, Product } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { StatCard } from '../common/StatCard';

interface AffiliatesViewProps {
  affiliates: Affiliate[];
  orders: Order[];
  patients: Patient[];
  products: Product[];
  selectedAffiliate: Affiliate | null;
  onSelectAffiliate: (aff: Affiliate | null) => void;
  onOpenCreateAffiliate: () => void;
  onOpenLoginAsAffiliate: (aff: Affiliate) => void;
  onToggleAffiliateStatus: (affId: string) => void;
  onNavigateToBranding?: (affiliateId: string) => void;
  onNavigateToDomains?: (affiliateId: string) => void;
}

export const AffiliatesView: React.FC<AffiliatesViewProps> = ({
  affiliates,
  orders,
  patients,
  products,
  selectedAffiliate,
  onSelectAffiliate,
  onOpenCreateAffiliate,
  onOpenLoginAsAffiliate,
  onToggleAffiliateStatus,
  onNavigateToBranding,
  onNavigateToDomains
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Inactive' | 'Suspended'>('All');
  const [detailTab, setDetailTab] = useState<
    'Overview' | 'Patients' | 'Orders' | 'Products' | 'Commissions' | 'Branding' | 'Settings'
  >('Overview');

  // Filter affiliates
  const filteredAffiliates = affiliates.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.subdomain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: DETAIL VIEW (When an affiliate is chosen)
  // ─────────────────────────────────────────────────────────────────────────────
  if (selectedAffiliate) {
    const affiliateOrders = orders.filter((o) => o.affiliateId === selectedAffiliate.id);
    const affiliatePatients = patients.filter((p) => p.affiliateId === selectedAffiliate.id);
    const avgOrderValue =
      selectedAffiliate.ordersCount > 0
        ? Math.round(selectedAffiliate.revenue / selectedAffiliate.ordersCount)
        : 0;

    return (
      <div className="space-y-6 pb-12" id="affiliate-detail-container">
        {/* Back navigation & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-[#E4E7EC] shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectAffiliate(null)}
              className="p-2 text-[#667085] hover:text-[#173B72] hover:bg-[#F2F4F7] rounded-lg transition-colors border border-[#E4E7EC]"
              title="Back to Affiliates List"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs"
              style={{ backgroundColor: selectedAffiliate.primaryColor || '#173B72' }}
            >
              {selectedAffiliate.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#172033]">{selectedAffiliate.name}</h2>
                <StatusBadge status={selectedAffiliate.status} size="sm" />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#667085] mt-0.5">
                <span className="flex items-center gap-1 font-mono text-[#2D82C4]">
                  <Globe className="w-3.5 h-3.5" />
                  {selectedAffiliate.domain}
                </span>
                <span>•</span>
                <span className="text-[#344054]">Contact: {selectedAffiliate.contactName}</span>
                <span>•</span>
                <span>Since: {selectedAffiliate.createdAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleAffiliateStatus(selectedAffiliate.id)}
              className="px-3 py-1.5 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] hover:bg-[#F8F9FC] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Power className="w-3.5 h-3.5 text-[#D99A18]" />
              {selectedAffiliate.status === 'Active' ? 'Suspend Tenant' : 'Activate Tenant'}
            </button>
            <button
              type="button"
              onClick={() => onOpenLoginAsAffiliate(selectedAffiliate)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Login as Affiliate
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E4E7EC] bg-white px-4 rounded-xl shadow-xs overflow-x-auto gap-2">
          {(
            ['Overview', 'Patients', 'Orders', 'Products', 'Commissions', 'Branding', 'Settings'] as const
          ).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setDetailTab(tab)}
              className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                detailTab === tab
                  ? 'border-[#173B72] text-[#173B72]'
                  : 'border-transparent text-[#667085] hover:text-[#172033]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {detailTab === 'Overview' && (
          <div className="space-y-6">
            {/* Overview KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
              <StatCard
                label="Total Patients"
                value={selectedAffiliate.patientsCount.toLocaleString()}
                change="+14.2%"
                icon={<Users className="w-4 h-4" />}
              />
              <StatCard
                label="Total Orders"
                value={selectedAffiliate.ordersCount.toLocaleString()}
                change="+11.0%"
                icon={<ShoppingCart className="w-4 h-4" />}
                iconBgColor="bg-[#F0FDF4]"
                iconColor="text-[#2E9B4B]"
              />
              <StatCard
                label="Total Revenue"
                value={`$${selectedAffiliate.revenue.toLocaleString()}`}
                change={selectedAffiliate.growth}
                icon={<DollarSign className="w-4 h-4" />}
              />
              <StatCard
                label="Affiliate Commission"
                value={`$${selectedAffiliate.commission.toLocaleString()}`}
                change="Paid Bi-weekly"
                icon={<DollarSign className="w-4 h-4" />}
                iconBgColor="bg-[#EAF4FB]"
                iconColor="text-[#2D82C4]"
              />
              <StatCard
                label="Avg Order Value"
                value={`$${avgOrderValue}`}
                change="Healthy AOV"
                icon={<TrendingUp className="w-4 h-4" />}
              />
              <StatCard
                label="Conversion Rate"
                value="4.8%"
                change="+0.6%"
                icon={<CheckCircle className="w-4 h-4" />}
                iconBgColor="bg-[#EAF6E7]"
                iconColor="text-[#4FAF4A]"
              />
            </div>

            {/* Tenant Overview Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tenant Profile & Domain info */}
              <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 space-y-4">
                <h3 className="text-sm font-bold text-[#172033] border-b border-[#F2F4F7] pb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#173B72]" />
                  Tenant Infrastructure & Domain
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Production Subdomain:</span>
                    <span className="font-mono text-[#173B72] font-semibold">{selectedAffiliate.subdomain}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Custom Brand Domain:</span>
                    <span className="font-mono text-[#2D82C4] font-semibold">{selectedAffiliate.domain}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">SSL Certificate Status:</span>
                    <span className="text-[#2E9B4B] font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Valid & Active
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Default Catalog Markup:</span>
                    <span className="font-mono font-bold text-[#172033]">{selectedAffiliate.defaultMarkup}%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#667085]">Tenant Billing Address:</span>
                    <span className="text-[#344054] text-right max-w-xs">{selectedAffiliate.address || 'Standard Telehealth USA'}</span>
                  </div>
                </div>
              </div>

              {/* Prescriber & Operations info */}
              <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 space-y-4">
                <h3 className="text-sm font-bold text-[#172033] border-b border-[#F2F4F7] pb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#4FAF4A]" />
                  Operations & Clinical Routing
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Clinical Prescriber Director:</span>
                    <span className="font-semibold text-[#172033]">Dr. Marcus Vance (NPI #1982736450)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Pharmacy Fulfillment Hub:</span>
                    <span className="text-[#344054]">Precision Compounding 503A / Tailor Made</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Stripe Connect Account:</span>
                    <span className="text-[#2E9B4B] font-mono font-semibold">acct_1NZ0x9812499 (Connected)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#667085]">HIPAA BAA Executed:</span>
                    <span className="text-[#173B72] font-semibold">Yes — Signed on onboarding</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Patients in this affiliate */}
        {detailTab === 'Patients' && (
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs">
            <h3 className="text-sm font-bold text-[#172033] mb-3">
              Patients enrolled under {selectedAffiliate.name} ({affiliatePatients.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F9FC] text-[11px] font-bold text-[#667085] uppercase">
                    <th className="py-2.5 px-3">Patient Name</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Program</th>
                    <th className="py-2.5 px-3 text-right">Orders</th>
                    <th className="py-2.5 px-3 text-right">Total Spent</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F4F7]">
                  {affiliatePatients.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F8F9FC]">
                      <td className="py-3 px-3 font-semibold text-[#172033]">{p.name}</td>
                      <td className="py-3 px-3 text-[#667085]">{p.email}</td>
                      <td className="py-3 px-3">{p.activeProgram}</td>
                      <td className="py-3 px-3 text-right font-mono">{p.ordersCount}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold">${p.totalSpent}</td>
                      <td className="py-3 px-3"><StatusBadge status={p.status} size="sm" /></td>
                    </tr>
                  ))}
                  {affiliatePatients.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-[#667085]">
                        No patients enrolled yet under this affiliate.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Orders in this affiliate */}
        {detailTab === 'Orders' && (
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs">
            <h3 className="text-sm font-bold text-[#172033] mb-3">
              Orders Processed for {selectedAffiliate.name} ({affiliateOrders.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F9FC] text-[11px] font-bold text-[#667085] uppercase">
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Patient</th>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F4F7]">
                  {affiliateOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#F8F9FC]">
                      <td className="py-3 px-3 font-mono font-bold text-[#173B72]">{o.id}</td>
                      <td className="py-3 px-3">{o.patientName}</td>
                      <td className="py-3 px-3">{o.productName}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold">${o.amount}</td>
                      <td className="py-3 px-3"><StatusBadge status={o.status} size="sm" /></td>
                      <td className="py-3 px-3 text-[#667085]">{o.date}</td>
                    </tr>
                  ))}
                  {affiliateOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-[#667085]">
                        No orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Products Assigned to this affiliate */}
        {detailTab === 'Products' && (
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#172033]">
              Active Catalog & Retail Pricing Rules
            </h3>
            <p className="text-xs text-[#667085]">
              Affiliate prices are automatically constrained to never fall below LeanBloom wholesale minimums.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F9FC] text-[11px] font-bold text-[#667085] uppercase">
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">LeanBloom Wholesale</th>
                    <th className="py-2.5 px-3 text-right">Floor Minimum</th>
                    <th className="py-2.5 px-3 text-right">Affiliate Retail</th>
                    <th className="py-2.5 px-3 text-right">Affiliate Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F4F7]">
                  {products.map((prod) => {
                    const retailPrice = Math.round(prod.basePrice * (1 + selectedAffiliate.defaultMarkup / 100));
                    const margin = retailPrice - prod.basePrice;
                    return (
                      <tr key={prod.id} className="hover:bg-[#F8F9FC]">
                        <td className="py-3 px-3 font-semibold text-[#172033]">{prod.name}</td>
                        <td className="py-3 px-3 text-[#667085]">{prod.category}</td>
                        <td className="py-3 px-3 text-right font-mono text-[#667085]">${prod.basePrice}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#D64545]">${prod.minimumPrice}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#173B72]">${retailPrice}</td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-[#2E9B4B]">+${margin}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Commissions / Payouts */}
        {detailTab === 'Commissions' && (
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#172033]">
              Bi-Weekly Payout History & Commission Statements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#F8F9FC] rounded-lg border border-[#E4E7EC]">
                <span className="text-xs text-[#667085]">Gross Platform Sales</span>
                <p className="text-xl font-bold text-[#172033] font-mono mt-1">
                  ${selectedAffiliate.revenue.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-[#EAF4FB] rounded-lg border border-[#2D82C4]/20">
                <span className="text-xs text-[#173B72]">Total Earned Commission</span>
                <p className="text-xl font-bold text-[#173B72] font-mono mt-1">
                  ${selectedAffiliate.commission.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-[#EAF6E7] rounded-lg border border-[#4FAF4A]/20">
                <span className="text-xs text-[#2E9B4B]">Current Payable Balance</span>
                <p className="text-xl font-bold text-[#2E9B4B] font-mono mt-1">
                  $0.00 (Settled)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Branding */}
        {detailTab === 'Branding' && (
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2F4F7] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#172033] flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#173B72]" />
                  <span>White-Label & Branding Specification</span>
                </h3>
                <p className="text-xs text-[#667085] mt-0.5">
                  Visual theme, typography, storefront styles, and patient portal configuration for {selectedAffiliate.name}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {onNavigateToDomains && (
                  <button
                    type="button"
                    onClick={() => onNavigateToDomains(selectedAffiliate.id)}
                    className="px-3 py-2 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] hover:bg-[#F8F9FC] rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#173B72]" />
                    <span>Manage Domains</span>
                  </button>
                )}

                {onNavigateToBranding && (
                  <button
                    type="button"
                    onClick={() => onNavigateToBranding(selectedAffiliate.id)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Open in Branding Studio</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Palette Card */}
              <div className="p-4 bg-[#F8F9FC] rounded-xl border border-[#E4E7EC] space-y-3">
                <span className="text-xs font-bold text-[#344054] uppercase tracking-wider block">
                  Color Tokens
                </span>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl shadow-xs border border-white flex items-center justify-center text-white text-xs font-bold font-mono"
                    style={{ backgroundColor: selectedAffiliate.primaryColor }}
                  >
                    P
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#172033] block">Primary Color</span>
                    <span className="text-xs font-mono text-[#667085]">{selectedAffiliate.primaryColor}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div
                    className="w-10 h-10 rounded-xl shadow-xs border border-white flex items-center justify-center text-white text-xs font-bold font-mono"
                    style={{ backgroundColor: selectedAffiliate.secondaryColor }}
                  >
                    S
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#172033] block">Accent Color</span>
                    <span className="text-xs font-mono text-[#667085]">{selectedAffiliate.secondaryColor}</span>
                  </div>
                </div>
              </div>

              {/* Typography & Geometry */}
              <div className="p-4 bg-[#F8F9FC] rounded-xl border border-[#E4E7EC] space-y-3">
                <span className="text-xs font-bold text-[#344054] uppercase tracking-wider block">
                  Design Tokens
                </span>
                <div>
                  <span className="text-[11px] text-[#667085] block">Font Family</span>
                  <span className="text-xs font-semibold text-[#172033]">
                    {selectedAffiliate.fontFamily || 'Plus Jakarta Sans'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#667085] block">Border Radius</span>
                  <span className="text-xs font-mono font-semibold text-[#172033]">
                    {selectedAffiliate.borderRadius || 'rounded-xl'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#667085] block">Header Theme</span>
                  <span className="text-xs font-semibold capitalize text-[#172033]">
                    {selectedAffiliate.headerTheme || 'navy'}
                  </span>
                </div>
              </div>

              {/* Domain & Hosting */}
              <div className="p-4 bg-[#F8F9FC] rounded-xl border border-[#E4E7EC] space-y-3">
                <span className="text-xs font-bold text-[#344054] uppercase tracking-wider block">
                  Assigned Hostnames
                </span>
                <div>
                  <span className="text-[11px] text-[#667085] block">Production FQDN</span>
                  <a
                    href={`https://${selectedAffiliate.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono font-semibold text-[#2D82C4] hover:underline flex items-center gap-1"
                  >
                    <span>{selectedAffiliate.domain}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div>
                  <span className="text-[11px] text-[#667085] block">Platform Subdomain</span>
                  <span className="text-xs font-mono text-[#173B72]">
                    {selectedAffiliate.subdomain}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#667085] block">Whitelabel Powered By</span>
                  <span className={`text-[11px] font-semibold ${selectedAffiliate.hidePoweredBy ? 'text-[#2E9B4B]' : 'text-[#667085]'}`}>
                    {selectedAffiliate.hidePoweredBy ? 'Hidden (100% Unbranded)' : 'Visible (LeanBloom Badge)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tagline & Clinic Contact */}
            <div className="p-4 bg-[#F8F9FC] rounded-xl border border-[#E4E7EC] space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#344054]">Tagline:</span>
                <span className="text-[#172033]">{selectedAffiliate.tagline || 'Doctor-Supervised Weight Loss & Longevity'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#344054]">Support Email:</span>
                <span className="font-mono text-[#173B72]">{selectedAffiliate.supportEmail || selectedAffiliate.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#344054]">Support Phone:</span>
                <span className="font-mono text-[#173B72]">{selectedAffiliate.supportPhone || selectedAffiliate.contactPhone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Settings */}
        {detailTab === 'Settings' && (
          <div className="bg-white rounded-xl border border-[#E4E7EC] p-6 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-[#172033]">
              Tenant Operational Settings: {selectedAffiliate.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#F8F9FC] rounded-xl border border-[#E4E7EC] space-y-2">
                <span className="font-bold text-[#344054]">Business Address:</span>
                <p className="text-[#667085]">{selectedAffiliate.address || '1400 Broadway Blvd, Suite 400, Austin, TX'}</p>
              </div>
              <div className="p-4 bg-[#F8F9FC] rounded-xl border border-[#E4E7EC] space-y-2">
                <span className="font-bold text-[#344054]">Default Markup Policy:</span>
                <p className="text-[#173B72] font-semibold">{selectedAffiliate.defaultMarkup}% over LeanBloom wholesale base</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: AFFILIATES DIRECTORY LIST
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 pb-12" id="affiliates-list-container">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-[#E4E7EC] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">Affiliates</h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Manage all white-label clinics & partners operating on the LeanBloom platform.
          </p>
        </div>
        <button
          type="button"
          id="create-affiliate-top-btn"
          onClick={onOpenCreateAffiliate}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Affiliate
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E4E7EC] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search affiliates, contacts, domains..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F7F9FC] border border-[#E4E7EC] rounded-lg text-[#172033] placeholder-[#98A2B3] focus:ring-2 focus:ring-[#2D82C4]/30"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['All', 'Active', 'Pending', 'Inactive', 'Suspended'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#173B72] text-white font-semibold'
                  : 'bg-[#F2F4F7] text-[#667085] hover:text-[#172033]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Affiliates Table */}
      <div className="bg-white rounded-xl border border-[#E4E7EC] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4E7EC] text-[11px] font-bold text-[#667085] uppercase tracking-wider bg-[#F8F9FC]">
                <th className="py-3 px-4">Business Name & Logo</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">Domain / URL</th>
                <th className="py-3 px-4 text-right">Patients</th>
                <th className="py-3 px-4 text-right">Orders</th>
                <th className="py-3 px-4 text-right">Revenue</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7] text-xs text-[#344054]">
              {filteredAffiliates.map((aff) => (
                <tr key={aff.id} className="hover:bg-[#F8F9FC] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#172033]">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs flex-shrink-0"
                        style={{ backgroundColor: aff.primaryColor || '#173B72' }}
                      >
                        {aff.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-[#172033] hover:text-[#2D82C4] cursor-pointer" onClick={() => onSelectAffiliate(aff)}>
                          {aff.name}
                        </p>
                        <p className="text-[11px] text-[#667085]">Markup: {aff.defaultMarkup}%</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-[#172033] font-medium">{aff.contactName}</p>
                    <p className="text-[11px] text-[#667085]">{aff.contactEmail}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-mono text-[#2D82C4]">{aff.domain}</p>
                    <p className="font-mono text-[10px] text-[#98A2B3]">{aff.subdomain}</p>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">{aff.patientsCount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-mono">{aff.ordersCount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#172033]">
                    ${aff.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={aff.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-[#667085] whitespace-nowrap">{aff.createdAt}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onSelectAffiliate(aff)}
                        className="px-2 py-1 text-[11px] font-semibold text-[#173B72] bg-[#EAF4FB] hover:bg-[#d8ecf9] rounded transition-colors flex items-center gap-1"
                        title="View Affiliate Detail"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenLoginAsAffiliate(aff)}
                        className="px-2 py-1 text-[11px] font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded transition-colors flex items-center gap-1"
                        title="Login as Affiliate"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Login
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAffiliates.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#667085]">
                    <Building2 className="w-8 h-8 text-[#98A2B3] mx-auto mb-2" />
                    <p className="font-semibold text-[#172033]">No affiliates found</p>
                    <p className="text-xs text-[#667085] mt-0.5">
                      Try adjusting your search criteria or create your first affiliate.
                    </p>
                    <button
                      type="button"
                      onClick={onOpenCreateAffiliate}
                      className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#173B72] rounded-lg"
                    >
                      Create Affiliate
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
