import React, { useState } from 'react';
import { Globe, AlertCircle } from 'lucide-react';
import { Affiliate } from '../../types';
import {
  ModalShell,
  ModalSelect,
  modalBtnPrimary,
  modalBtnSecondary,
  modalHintClass,
  modalInputClass,
  modalLabelClass,
} from './ModalShell';

interface AddDomainModalProps {
  isOpen: boolean;
  affiliates: Affiliate[];
  onClose: () => void;
  onAddDomain: (payload: {
    affiliateId: string;
    domain: string;
    type?: 'Custom Domain' | 'Platform Subdomain';
    target?: string;
    isPrimary?: boolean;
  }) => Promise<void> | void;
}

export const AddDomainModal: React.FC<AddDomainModalProps> = ({
  isOpen,
  affiliates,
  onClose,
  onAddDomain,
}) => {
  const [selectedAffiliateId, setSelectedAffiliateId] = useState(
    affiliates[0]?.id || ''
  );
  const [domainInput, setDomainInput] = useState('');
  const [isPrimary, setIsPrimary] = useState(true);
  const [routingTarget, setRoutingTarget] = useState(
    'cname.leanbloom-network.com'
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanDomain = domainInput
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '');

    if (!cleanDomain) {
      setError('Enter a valid domain name.');
      return;
    }
    if (!cleanDomain.includes('.') || cleanDomain.length < 4) {
      setError('Use a full domain (e.g. care.myclinic.com).');
      return;
    }

    const affiliate = affiliates.find((a) => a.id === selectedAffiliateId);
    if (!affiliate) {
      setError('Select an affiliate.');
      return;
    }

    setSaving(true);
    try {
      await onAddDomain({
        affiliateId: affiliate.id,
        domain: cleanDomain,
        type:
          cleanDomain.includes('leanbloom.com') ||
          cleanDomain.includes('leanbloom.health')
            ? 'Platform Subdomain'
            : 'Custom Domain',
        target: routingTarget,
        isPrimary,
      });
      setDomainInput('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add domain');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Add domain"
      description="Connect a custom domain for an affiliate storefront."
      icon={<Globe className="w-5 h-5" />}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {error && (
          <div className="p-3 bg-[#FEF3F2] border border-[#FECDCA] rounded-xl flex items-center gap-2 text-sm text-[#B42318]">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className={modalLabelClass}>Affiliate *</label>
          <ModalSelect
            value={selectedAffiliateId}
            onChange={(e) => setSelectedAffiliateId(e.target.value)}
          >
            {affiliates.map((aff) => (
              <option key={aff.id} value={aff.id}>
                {aff.name}
              </option>
            ))}
          </ModalSelect>
        </div>

        <div>
          <label className={modalLabelClass}>Domain *</label>
          <input
            type="text"
            placeholder="care.myclinic.com"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            className={`${modalInputClass} font-mono`}
          />
          <p className={modalHintClass}>No https:// — subdomain recommended</p>
        </div>

        <div>
          <label className={modalLabelClass}>Edge target</label>
          <ModalSelect
            value={routingTarget}
            onChange={(e) => setRoutingTarget(e.target.value)}
            className="font-mono text-sm"
          >
            <option value="cname.leanbloom-network.com">
              cname.leanbloom-network.com
            </option>
            <option value="edge-us-east.leanbloom-network.com">
              edge-us-east.leanbloom-network.com
            </option>
          </ModalSelect>
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
            className="mt-1 rounded border-[#D0D5DD] text-[#2D82C4] focus:ring-[#2D82C4]"
          />
          <span>
            <span className="block text-sm font-medium text-[#12345F]">
              Set as primary domain
            </span>
            <span className="block text-xs text-[#7A8796] mt-0.5">
              Used for patient links and emails
            </span>
          </span>
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={modalBtnSecondary}>
            Cancel
          </button>
          <button type="submit" disabled={saving} className={modalBtnPrimary}>
            {saving ? 'Adding…' : 'Add domain'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};
