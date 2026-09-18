import React, { useState } from 'react';
import {
  Globe,
  Search,
  Plus,
  Filter,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Server,
  Zap,
  SlidersHorizontal,
  ChevronDown,
  Trash2,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { DomainItem, Affiliate } from '../../types';
import { StatCard } from '../common/StatCard';
import { DnsConfigModal } from '../modals/DnsConfigModal';
import { AddDomainModal } from '../modals/AddDomainModal';

interface DomainsViewProps {
  domains: DomainItem[];
  affiliates: Affiliate[];
  onAddDomain: (newDomain: DomainItem) => void;
  onTogglePrimaryDomain: (domainId: string) => void;
  onDeleteDomain: (domainId: string) => void;
  onReverifyDomain: (domainId: string) => void;
  onNavigateToAffiliate?: (affiliateId: string) => void;
}

export const DomainsView: React.FC<DomainsViewProps> = ({
  domains,
  affiliates,
  onAddDomain,
  onTogglePrimaryDomain,
  onDeleteDomain,
  onReverifyDomain,
  onNavigateToAffiliate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending DNS' | 'Configuration Error'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Custom Domain' | 'Platform Subdomain'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDnsDomain, setSelectedDnsDomain] = useState<DomainItem | null>(null);
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);
  const [isBulkChecking, setIsBulkChecking] = useState(false);
  const [bulkCheckBanner, setBulkCheckBanner] = useState(false);

  // Filter logic
  const filteredDomains = domains.filter((d) => {
    const matchesSearch =
      d.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.affiliateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    const matchesType = typeFilter === 'All' || d.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const activeCount = domains.filter((d) => d.status === 'Active').length;
  const pendingCount = domains.filter((d) => d.status === 'Pending DNS').length;
  const errorCount = domains.filter((d) => d.status === 'Configuration Error').length;
  const sslHealthyCount = domains.filter((d) => d.sslStatus === 'Valid').length;

  const handleCopy = (domainName: string) => {
    navigator.clipboard.writeText(`https://${domainName}`);
    setCopiedDomain(domainName);
    setTimeout(() => setCopiedDomain(null), 2000);
  };

  const handleBulkCheck = () => {
    setIsBulkChecking(true);
    setTimeout(() => {
      setIsBulkChecking(false);
      setBulkCheckBanner(true);
      setTimeout(() => setBulkCheckBanner(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12" id="domains-page-container">
      {/* Top Banner Alert if bulk check completed */}
      {bulkCheckBanner && (
        <div className="p-4 bg-[#EAF6E7] border border-[#2E9B4B]/30 rounded-xl flex items-center justify-between text-xs text-[#2E9B4B] animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#2E9B4B]" />
            <span>
              Global DNS propagation check completed. Verified edge routes for {domains.length} hostnames.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setBulkCheckBanner(false)}
            className="text-xs underline hover:text-[#173B72]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Domains Active"
          value={`${activeCount} of ${domains.length}`}
          change={`${Math.round((activeCount / domains.length) * 100)}% online`}
          icon={<Globe className="w-4 h-4" />}
          iconBgColor="bg-[#EAF4FB]"
          iconColor="text-[#173B72]"
        />
        <StatCard
          label="SSL Certificates Healthy"
          value={`${sslHealthyCount} / ${domains.length}`}
          change="Auto-renewed (TLS 1.3)"
          icon={<ShieldCheck className="w-4 h-4" />}
          iconBgColor="bg-[#EAF6E7]"
          iconColor="text-[#2E9B4B]"
        />
        <StatCard
          label="Pending DNS Propagation"
          value={pendingCount.toString()}
          change={pendingCount > 0 ? 'Awaiting CNAME records' : 'All resolved'}
          icon={<Clock className="w-4 h-4" />}
          iconBgColor={pendingCount > 0 ? 'bg-[#FEF7EC]' : 'bg-[#F2F4F7]'}
          iconColor={pendingCount > 0 ? 'text-[#D99A18]' : 'text-[#667085]'}
        />
        <StatCard
          label="Global Edge Latency"
          value="28 ms"
          change="Anycast CDN Cluster"
          icon={<Zap className="w-4 h-4" />}
          iconBgColor="bg-[#F0FDF4]"
          iconColor="text-[#2E9B4B]"
        />
      </div>

      {/* Controls: Search, Filter, Action Buttons */}
      <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#98A2B3] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by domain, affiliate clinic, or target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8F9FC] border border-[#D0D5DD] rounded-xl text-[#172033] placeholder:text-[#98A2B3] focus:outline-hidden focus:border-[#173B72] focus:bg-white transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#667085] font-medium hidden lg:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs bg-white border border-[#D0D5DD] rounded-xl px-3 py-2 text-[#344054] focus:outline-hidden focus:border-[#173B72]"
            >
              <option value="All">All Statuses ({domains.length})</option>
              <option value="Active">Active ({activeCount})</option>
              <option value="Pending DNS">Pending DNS ({pendingCount})</option>
              <option value="Configuration Error">Configuration Error ({errorCount})</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="text-xs bg-white border border-[#D0D5DD] rounded-xl px-3 py-2 text-[#344054] focus:outline-hidden focus:border-[#173B72]"
            >
              <option value="All">All Domain Types</option>
              <option value="Custom Domain">Custom FQDNs</option>
              <option value="Platform Subdomain">Platform Subdomains</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleBulkCheck}
            disabled={isBulkChecking}
            className="px-3.5 py-2 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] hover:bg-[#F8F9FC] rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-60"
            title="Re-verify all DNS records against public nameservers"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#173B72] ${isBulkChecking ? 'animate-spin' : ''}`} />
            <span>{isBulkChecking ? 'Checking DNS...' : 'Check All DNS'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Domain</span>
          </button>
        </div>
      </div>

      {/* Domains Management Table */}
      <div className="bg-white rounded-xl border border-[#E4E7EC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F9FC] text-[11px] font-bold text-[#667085] uppercase border-b border-[#E4E7EC]">
                <th className="py-3 px-4">Domain & Hostname</th>
                <th className="py-3 px-4">Affiliate Clinic</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Edge Routing Target</th>
                <th className="py-3 px-4">SSL / TLS Certificate</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7]">
              {filteredDomains.map((dom) => {
                const isCustom = dom.type === 'Custom Domain';
                const isResolved = dom.status === 'Active';
                const isPending = dom.status === 'Pending DNS';
                const isError = dom.status === 'Configuration Error';

                return (
                  <tr key={dom.id} className="hover:bg-[#F8F9FC]/80 transition-colors">
                    {/* Domain Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${
                          isResolved ? 'bg-[#EAF6E7] text-[#2E9B4B]' : isPending ? 'bg-[#FEF7EC] text-[#D99A18]' : 'bg-[#FEECEC] text-[#D64545]'
                        }`}>
                          <Globe className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono font-bold text-[#172033] text-xs hover:text-[#173B72]">
                              {dom.domain}
                            </span>
                            {dom.primary && (
                              <span className="px-2 py-0.5 bg-[#EAF4FB] text-[#173B72] text-[10px] font-bold rounded-full border border-[#2D82C4]/30">
                                PRIMARY
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[#667085] mt-0.5">
                            <button
                              type="button"
                              onClick={() => handleCopy(dom.domain)}
                              className="hover:text-[#173B72] flex items-center gap-1"
                              title="Copy full HTTPS URL"
                            >
                              {copiedDomain === dom.domain ? (
                                <span className="text-[#2E9B4B] flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> Copied
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5">
                                  <Copy className="w-3 h-3" /> Copy URL
                                </span>
                              )}
                            </button>
                            <span>•</span>
                            <a
                              href={`https://${dom.domain}`}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:text-[#2D82C4] flex items-center gap-0.5"
                            >
                              Open Live <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Affiliate Clinic */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#173B72] text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                          {dom.affiliateName.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-[#172033]">
                          {dom.affiliateName}
                        </span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-1 text-[11px] font-semibold rounded-lg ${
                        isCustom
                          ? 'bg-[#F2F4F7] text-[#344054] border border-[#D0D5DD]'
                          : 'bg-[#EAF4FB] text-[#173B72]'
                      }`}>
                        {dom.type}
                      </span>
                    </td>

                    {/* Routing Target */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#344054]">
                          <Server className="w-3 h-3 text-[#667085]" />
                          <span className="truncate max-w-[190px]">{dom.target}</span>
                        </div>
                        {dom.edgeLatencyMs && (
                          <div className="flex items-center gap-1 text-[10px] text-[#2E9B4B]">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2E9B4B] animate-pulse" />
                            <span>Anycast Edge ({dom.edgeLatencyMs}ms)</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* SSL Status */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          {dom.sslStatus === 'Valid' ? (
                            <span className="flex items-center gap-1 text-xs font-semibold text-[#2E9B4B]">
                              <Lock className="w-3 h-3 text-[#2E9B4B]" />
                              TLS 1.3 Active
                            </span>
                          ) : dom.sslStatus === 'Issuing' ? (
                            <span className="flex items-center gap-1 text-xs font-semibold text-[#D99A18]">
                              <Clock className="w-3 h-3" />
                              Issuing...
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-semibold text-[#D64545]">
                              <AlertTriangle className="w-3 h-3" />
                              Failed
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#667085] block">
                          {dom.sslExpiry}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {isResolved && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EAF6E7] text-[#2E9B4B]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2E9B4B]" />
                          Active
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FEF7EC] text-[#D99A18]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D99A18] animate-pulse" />
                          Pending DNS
                        </span>
                      )}
                      {isError && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FEECEC] text-[#D64545]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D64545]" />
                          Misconfigured
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedDnsDomain(dom)}
                          className="px-2.5 py-1.5 text-[11px] font-semibold text-[#173B72] bg-[#EAF4FB] hover:bg-[#D5E8F7] rounded-lg transition-colors flex items-center gap-1"
                          title="View required DNS CNAME and TXT records"
                        >
                          <SlidersHorizontal className="w-3 h-3" />
                          <span>DNS Records</span>
                        </button>

                        {!dom.primary && (
                          <button
                            type="button"
                            onClick={() => onTogglePrimaryDomain(dom.id)}
                            className="px-2.5 py-1.5 text-[11px] font-medium text-[#667085] hover:text-[#173B72] hover:bg-[#F2F4F7] rounded-lg transition-colors"
                            title="Set as primary domain for this affiliate"
                          >
                            Set Primary
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onDeleteDomain(dom.id)}
                          className="p-1.5 text-[#98A2B3] hover:text-[#D64545] hover:bg-[#FEECEC] rounded-lg transition-colors"
                          title="Remove domain configuration"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredDomains.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#667085]">
                    <Globe className="w-8 h-8 mx-auto text-[#D0D5DD] mb-2" />
                    <p className="font-semibold text-[#172033]">No domains match your filters</p>
                    <p className="text-xs text-[#98A2B3] mt-1">Try resetting search or status filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DNS Architecture & Setup Guidance Card */}
      <div className="bg-white rounded-xl border border-[#E4E7EC] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-[#F2F4F7] pb-4">
          <div className="w-9 h-9 rounded-xl bg-[#EAF4FB] text-[#173B72] flex items-center justify-center font-bold">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#172033]">
              Multi-Tenant Domain Routing & Edge SSL Architecture
            </h3>
            <p className="text-xs text-[#667085]">
              How LeanBloom securely connects white-label affiliate clinic hostnames to your centralized healthcare engine
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="p-4 bg-[#F8F9FC] rounded-xl border border-[#E4E7EC] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#172033]">
              <span className="w-5 h-5 rounded-full bg-[#173B72] text-white flex items-center justify-center text-[10px]">
                1
              </span>
              <span>CNAME Delegation</span>
            </div>
            <p className="text-[#667085] leading-relaxed">
              Affiliates create a CNAME record pointing their chosen subdomain (e.g. <span className="font-mono text-[#173B72]">rx.clinic.com</span>) to <span className="font-mono text-[#173B72]">cname.leanbloom-network.com</span>.
            </p>
          </div>

          <div className="p-4 bg-[#F8F9FC] rounded-xl border border-[#E4E7EC] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#172033]">
              <span className="w-5 h-5 rounded-full bg-[#173B72] text-white flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Ownership Validation</span>
            </div>
            <p className="text-[#667085] leading-relaxed">
              LeanBloom's automated verification bot checks the corresponding <span className="font-mono text-[#173B72]">_leanbloom-challenge</span> TXT record to prove ownership before issuing SSL.
            </p>
          </div>

          <div className="p-4 bg-[#F8F9FC] rounded-xl border border-[#E4E7EC] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#172033]">
              <span className="w-5 h-5 rounded-full bg-[#173B72] text-white flex items-center justify-center text-[10px]">
                3
              </span>
              <span>Zero-Touch SSL Provisioning</span>
            </div>
            <p className="text-[#667085] leading-relaxed">
              DigiCert and Let's Encrypt certificates are provisioned and auto-renewed with HTTP/2 and TLS 1.3 strict transport security (HSTS) enforced across all 200+ global edge locations.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DnsConfigModal
        isOpen={Boolean(selectedDnsDomain)}
        domain={selectedDnsDomain}
        onClose={() => setSelectedDnsDomain(null)}
        onReverify={(id) => onReverifyDomain(id)}
      />

      <AddDomainModal
        isOpen={isAddModalOpen}
        affiliates={affiliates}
        onClose={() => setIsAddModalOpen(false)}
        onAddDomain={onAddDomain}
      />
    </div>
  );
};
