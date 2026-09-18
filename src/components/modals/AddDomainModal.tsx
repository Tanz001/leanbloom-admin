import React, { useState } from 'react';
import {
  X,
  Globe,
  Building2,
  ShieldCheck,
  Server,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Affiliate, DomainItem, DNSRecord } from '../../types';

interface AddDomainModalProps {
  isOpen: boolean;
  affiliates: Affiliate[];
  onClose: () => void;
  onAddDomain: (newDomain: DomainItem) => void;
}

export const AddDomainModal: React.FC<AddDomainModalProps> = ({
  isOpen,
  affiliates,
  onClose,
  onAddDomain
}) => {
  const [selectedAffiliateId, setSelectedAffiliateId] = useState<string>(
    affiliates[0]?.id || ''
  );
  const [domainInput, setDomainInput] = useState('');
  const [isPrimary, setIsPrimary] = useState(true);
  const [routingTarget, setRoutingTarget] = useState('cname.leanbloom-network.com');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanDomain = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');

    if (!cleanDomain) {
      setError('Please enter a valid domain name.');
      return;
    }

    if (!cleanDomain.includes('.') || cleanDomain.length < 4) {
      setError('Please provide a fully qualified domain name (e.g., care.myclinic.com).');
      return;
    }

    const affiliate = affiliates.find((a) => a.id === selectedAffiliateId);
    if (!affiliate) {
      setError('Please select an affiliate clinic.');
      return;
    }

    // Extract subdomain / host prefix
    const parts = cleanDomain.split('.');
    const host = parts.length > 2 ? parts[0] : '@';
    const challengeToken = `lb-auth-${affiliate.slug.substring(0, 4)}-${Math.floor(10000000 + Math.random() * 90000000)}-verify`;

    const dnsRecords: DNSRecord[] = [
      {
        type: 'CNAME',
        host: host,
        value: routingTarget,
        status: 'Pending',
        ttl: 'Auto / 300s'
      },
      {
        type: 'TXT',
        host: host === '@' ? '_leanbloom-challenge' : `_leanbloom-challenge.${host}`,
        value: challengeToken,
        status: 'Pending',
        ttl: '3600s'
      }
    ];

    const newDomainItem: DomainItem = {
      id: `dom-${Date.now()}`,
      affiliateId: affiliate.id,
      affiliateName: affiliate.name,
      domain: cleanDomain,
      type: cleanDomain.includes('leanbloom.com') ? 'Platform Subdomain' : 'Custom Domain',
      target: routingTarget,
      status: 'Pending DNS',
      sslStatus: 'Issuing',
      sslExpiry: 'Pending Verification',
      dnsRecords,
      primary: isPrimary,
      hstsEnabled: true,
      createdAt: 'Just now',
      lastVerified: 'Awaiting DNS setup',
      edgeLatencyMs: 45
    };

    onAddDomain(newDomainItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#E4E7EC] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F8F9FC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF4FB] text-[#173B72] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172033]">Add Custom Domain</h3>
              <p className="text-xs text-[#667085]">
                Route clinic traffic through LeanBloom's edge proxy
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#667085] hover:text-[#172033] hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-[#FEECEC] border border-[#FECDCA] rounded-xl flex items-center gap-2 text-xs text-[#D64545]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Select Affiliate */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#344054]">
              Affiliate Clinic <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedAffiliateId}
                onChange={(e) => setSelectedAffiliateId(e.target.value)}
                className="w-full pl-3.5 pr-8 py-2.5 text-xs bg-white border border-[#D0D5DD] rounded-xl text-[#172033] focus:outline-hidden focus:border-[#173B72] focus:ring-1 focus:ring-[#173B72]"
              >
                {affiliates.map((aff) => (
                  <option key={aff.id} value={aff.id}>
                    {aff.name} ({aff.domain})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Domain Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#344054]">
              Domain / Subdomain FQDN <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. rx.apexclinic.com or care.wellness.org"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#D0D5DD] rounded-xl text-[#172033] placeholder:text-[#98A2B3] focus:outline-hidden focus:border-[#173B72] focus:ring-1 focus:ring-[#173B72]"
              />
            </div>
            <p className="text-[11px] text-[#667085]">
              Do not include https://. Subdomains (e.g. <span className="font-mono">rx.example.com</span>) are recommended.
            </p>
          </div>

          {/* Edge Target */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#344054]">
              Edge Routing Proxy
            </label>
            <select
              value={routingTarget}
              onChange={(e) => setRoutingTarget(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#F8F9FC] border border-[#D0D5DD] rounded-xl text-[#172033] font-mono"
            >
              <option value="cname.leanbloom-network.com">
                cname.leanbloom-network.com (Global Anycast Edge CDN)
              </option>
              <option value="edge-us-east.leanbloom-network.com">
                edge-us-east.leanbloom-network.com (US East Dedicated Cluster)
              </option>
            </select>
          </div>

          {/* Primary Domain Toggle */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="mt-0.5 rounded border-[#D0D5DD] text-[#173B72] focus:ring-[#173B72]"
              />
              <div className="text-xs">
                <span className="font-semibold text-[#172033]">
                  Set as Primary Public Domain
                </span>
                <p className="text-[#667085] text-[11px] mt-0.5">
                  All default links and patient intake emails for this clinic will use this domain.
                </p>
              </div>
            </label>
          </div>

          {/* Info note */}
          <div className="p-3 bg-[#F0F7FD] rounded-xl border border-[#2D82C4]/20 flex items-start gap-2 text-xs text-[#173B72]">
            <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#2D82C4]" />
            <p className="text-[11px] leading-relaxed">
              Upon adding, DNS records and an ownership challenge token will be generated. The SSL certificate will automatically be provisioned within 15 minutes of DNS propagation.
            </p>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#E4E7EC] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] hover:bg-[#F2F4F7] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-xl shadow-xs transition-colors"
            >
              Add Domain
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
