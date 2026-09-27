import React, { useState } from 'react';
import {
  Globe,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  RefreshCw,
  ShieldCheck,
  Server,
} from 'lucide-react';
import { DomainItem } from '../../types';
import {
  ModalShell,
  modalBtnPrimary,
  modalBtnSecondary,
} from './ModalShell';

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
  onReverify,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checkSuccess, setCheckSuccess] = useState(false);

  if (!domain) return null;

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

  const statusTone =
    domain.status === 'Active'
      ? 'bg-[#EAF6E7] text-[#2E9B4B]'
      : domain.status === 'Pending DNS'
        ? 'bg-[#FEF7EC] text-[#D99A18]'
        : 'bg-[#FEECEC] text-[#D64545]';

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="DNS configuration"
      description={
        <>
          Host routing for{' '}
          <span className="font-mono font-medium text-[#12345F]">
            {domain.domain}
          </span>{' '}
          · {domain.affiliateName}
        </>
      }
      icon={<Globe className="w-5 h-5" />}
      maxWidth="xl"
      footer={
        <>
          <div className="mr-auto text-sm text-[#7A8796] flex items-center gap-2">
            <span>Last verified: {domain.lastVerified}</span>
            {checkSuccess && (
              <span className="text-[#2E9B4B] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Checked
              </span>
            )}
          </div>
          <button type="button" onClick={onClose} className={modalBtnSecondary}>
            Close
          </button>
          <button
            type="button"
            onClick={handleRunCheck}
            disabled={isChecking}
            className={`${modalBtnPrimary} disabled:opacity-70`}
          >
            <RefreshCw
              className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`}
            />
            {isChecking ? 'Checking…' : 'Re-check DNS'}
          </button>
        </>
      }
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusTone}`}
          >
            {domain.status}
          </span>
        </div>

        <div className="p-4 rounded-xl border border-[#E4EAF0] bg-[#F7F9FC] flex items-start gap-3">
          <Server className="w-5 h-5 text-[#2D82C4] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#12345F]">
              LeanBloom edge network
            </p>
            <p className="mt-1 text-sm text-[#5B6B7C] leading-relaxed">
              Add these records at your registrar. Traffic routes through the
              LeanBloom proxy with automatic SSL once DNS propagates.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#12345F]">
              Required DNS records
            </h4>
            <span className="text-xs text-[#7A8796]">TTL: Auto / 300s</span>
          </div>

          <div className="border border-[#E4EAF0] rounded-xl overflow-hidden divide-y divide-[#E4EAF0]">
            {domain.dnsRecords.map((rec, idx) => {
              const isVerified = rec.status === 'Verified';
              return (
                <div
                  key={idx}
                  className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#12345F] text-white font-mono font-semibold text-xs rounded-md">
                        {rec.type}
                      </span>
                      <span className="font-mono text-sm font-medium text-[#12345F] truncate">
                        {rec.host}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(`host-${idx}`, rec.host)}
                        className="p-1.5 text-[#9CA3AF] hover:text-[#2D82C4] hover:bg-[#F3F4F6] rounded-lg"
                        title="Copy host"
                      >
                        {copiedKey === `host-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-[#2E9B4B]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#7A8796]">
                      <span>Value</span>
                      <span className="font-mono text-xs text-[#12345F] bg-[#F3F4F6] px-2 py-1 rounded-md truncate max-w-[280px]">
                        {rec.value}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(`val-${idx}`, rec.value)}
                        className="p-1.5 text-[#9CA3AF] hover:text-[#2D82C4] hover:bg-[#F3F4F6] rounded-lg"
                        title="Copy value"
                      >
                        {copiedKey === `val-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-[#2E9B4B]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex-shrink-0 self-start sm:self-center">
                    {isVerified ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-[#2E9B4B] bg-[#EAF6E7] px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-[#D99A18] bg-[#FEF7EC] px-2.5 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#E4EAF0] space-y-3">
          <h4 className="text-sm font-semibold text-[#12345F] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2E9B4B]" />
            SSL certificate
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-[#7A8796]">Status</span>
              <p className="font-medium text-[#12345F]">{domain.sslStatus}</p>
            </div>
            <div>
              <span className="text-xs text-[#7A8796]">Expiration</span>
              <p className="font-medium text-[#12345F]">{domain.sslExpiry}</p>
            </div>
            <div>
              <span className="text-xs text-[#7A8796]">TLS</span>
              <p className="font-medium text-[#2E9B4B]">HTTP/2 · TLS 1.3</p>
            </div>
            <div>
              <span className="text-xs text-[#7A8796]">HSTS</span>
              <p className="font-medium text-[#12345F]">
                {domain.hstsEnabled ? 'Enforced' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm text-[#5B6B7C] space-y-2">
          <p className="font-medium text-[#12345F]">Registrar tips</p>
          <ul className="list-disc pl-4 space-y-1.5 text-sm leading-relaxed">
            <li>
              <strong className="font-medium text-[#12345F]">Cloudflare:</strong>{' '}
              Use DNS only (grey cloud) during verification.
            </li>
            <li>
              <strong className="font-medium text-[#12345F]">
                GoDaddy / Namecheap:
              </strong>{' '}
              Enter the host without the root domain.
            </li>
            <li>Propagation usually takes 5–30 minutes (up to 24 hours).</li>
          </ul>
        </div>
      </div>
    </ModalShell>
  );
};
