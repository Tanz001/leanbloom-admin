import React, { useState } from 'react';
import {
  X,
  Globe,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Server
} from 'lucide-react';
import { DomainItem } from '../../types';

interface DnsConfigModalProps {
  isOpen: boolean;
  domain: DomainItem | null;
  onClose: () => void;
  onReverify: (domainId: string) => void;
}

export const DnsConfigModal: React.FC<DnsConfigModalProps> = ({
  isOpen,
  domain,
  onClose,
  onReverify
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checkSuccess, setCheckSuccess] = useState(false);

  if (!isOpen || !domain) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunCheck = () => {
    setIsChecking(true);
    setCheckSuccess(false);
    setTimeout(() => {
      setIsChecking(false);
      setCheckSuccess(true);
      onReverify(domain.id);
      setTimeout(() => setCheckSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E4E7EC] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F8F9FC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF4FB] text-[#173B72] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#172033]">DNS Configuration & Records</h3>
                <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                  domain.status === 'Active'
                    ? 'bg-[#EAF6E7] text-[#2E9B4B]'
                    : domain.status === 'Pending DNS'
                    ? 'bg-[#FEF7EC] text-[#D99A18]'
                    : 'bg-[#FEECEC] text-[#D64545]'
                }`}>
                  {domain.status}
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-0.5">
                Host routing for <span className="font-mono font-semibold text-[#173B72]">{domain.domain}</span> ({domain.affiliateName})
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status summary banner */}
          <div className="p-4 rounded-xl border border-[#E4E7EC] bg-[#F8F9FC] flex items-start gap-3">
            <Server className="w-5 h-5 text-[#2D82C4] flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-[#172033]">
                LeanBloom Global Anycast Edge Network
              </p>
              <p className="text-[#667085] leading-relaxed">
                Add the DNS records below at your domain registrar (Cloudflare, GoDaddy, AWS Route 53, etc.).
                Once configured, traffic will automatically route through LeanBloom's HIPAA-compliant reverse proxy with automatic SSL renewal.
              </p>
            </div>
          </div>

          {/* DNS Records Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                Required DNS Records
              </h4>
              <span className="text-[11px] text-[#667085]">
                TTL: Automatic or 300s
              </span>
            </div>

            <div className="border border-[#E4E7EC] rounded-xl overflow-hidden divide-y divide-[#E4E7EC]">
              {domain.dnsRecords.map((rec, idx) => {
                const isVerified = rec.status === 'Verified';
                return (
                  <div key={idx} className="p-3.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#173B72] text-white font-mono font-bold text-[10px] rounded">
                          {rec.type}
                        </span>
                        <span className="font-mono font-semibold text-[#172033] truncate">
                          {rec.host}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(`host-${idx}`, rec.host)}
                          className="p-1 text-[#667085] hover:text-[#173B72] hover:bg-[#F2F4F7] rounded"
                          title="Copy Host"
                        >
                          {copiedKey === `host-${idx}` ? <Check className="w-3.5 h-3.5 text-[#2E9B4B]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-[#667085]">
                        <span className="text-[11px]">Value:</span>
                        <span className="font-mono text-[#344054] bg-[#F2F4F7] px-2 py-0.5 rounded text-[11px] truncate max-w-[280px]">
                          {rec.value}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(`val-${idx}`, rec.value)}
                          className="p-1 text-[#667085] hover:text-[#173B72] hover:bg-[#F2F4F7] rounded"
                          title="Copy Value"
                        >
                          {copiedKey === `val-${idx}` ? <Check className="w-3.5 h-3.5 text-[#2E9B4B]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
                      {isVerified ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2E9B4B] bg-[#EAF6E7] px-2 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#D99A18] bg-[#FEF7EC] px-2 py-1 rounded-full">
                          <Clock className="w-3.5 h-3.5" /> Pending Propagation
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SSL Certificate Details */}
          <div className="p-4 rounded-xl border border-[#E4E7EC] bg-white space-y-3 text-xs">
            <h4 className="font-bold text-[#172033] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2E9B4B]" />
              SSL/TLS Edge Certificate
            </h4>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-[#667085]">Status:</span>
                <p className="font-semibold text-[#172033]">{domain.sslStatus} (Automated Let's Encrypt / DigiCert)</p>
              </div>
              <div>
                <span className="text-[#667085]">Expiration:</span>
                <p className="font-semibold text-[#172033]">{domain.sslExpiry}</p>
              </div>
              <div>
                <span className="text-[#667085]">HTTP/2 & TLS 1.3:</span>
                <p className="font-semibold text-[#2E9B4B]">Enabled by Default</p>
              </div>
              <div>
                <span className="text-[#667085]">HSTS Strict Transport:</span>
                <p className="font-semibold text-[#172033]">{domain.hstsEnabled ? 'Enforced (31536000s)' : 'Disabled'}</p>
              </div>
            </div>
          </div>

          {/* Registrar Instructions snippet */}
          <div className="text-xs text-[#667085] space-y-1.5">
            <p className="font-bold text-[#344054]">Registrar Quick Tips:</p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#667085]">
              <li><strong>Cloudflare:</strong> Set Proxy status to "DNS only" (Grey Cloud) during verification.</li>
              <li><strong>GoDaddy / Namecheap:</strong> Enter only the subdomain host without your root domain.</li>
              <li>DNS propagation typically completes within 5 to 30 minutes, but can take up to 24 hours.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-[#E4E7EC] bg-[#F8F9FC] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#667085]">
            <span>Last verified: {domain.lastVerified}</span>
            {checkSuccess && (
              <span className="text-[#2E9B4B] font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> DNS checked successfully!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] hover:bg-[#F2F4F7] rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleRunCheck}
              disabled={isChecking}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-70"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Verifying Records...' : 'Re-check DNS Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
