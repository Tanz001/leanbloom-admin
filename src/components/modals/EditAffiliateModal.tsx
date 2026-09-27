import React, { useEffect, useState } from 'react';
import {
  Building2,
  Check,
  ImagePlus,
  Eye,
  EyeOff,
  X,
  AlertCircle,
} from 'lucide-react';
import { Affiliate } from '../../types';
import { mediaUrl } from '../../lib/api';
import {
  ModalShell,
  ModalSelect,
  modalBtnAccent,
  modalBtnSecondary,
  modalHintClass,
  modalInputClass,
  modalLabelClass,
} from './ModalShell';

export type EditAffiliatePayload = {
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  status: Affiliate['status'];
  defaultMarkup: number;
  primaryColor: string;
  secondaryColor: string;
  portalTitle?: string;
  tagline?: string;
  welcomeMessage?: string;
  supportEmail?: string;
  supportPhone?: string;
  businessHours?: string;
  hidePoweredBy?: boolean;
  trustBadgeText?: string;
  clinicalPartnerNote?: string;
  ownerPassword?: string;
};

interface EditAffiliateModalProps {
  isOpen: boolean;
  affiliate: Affiliate | null;
  onClose: () => void;
  onSave: (
    id: string,
    data: EditAffiliatePayload,
    logoFile?: File | null
  ) => void | Promise<void>;
}

export const EditAffiliateModal: React.FC<EditAffiliateModalProps> = ({
  isOpen,
  affiliate,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    status: 'Active' as Affiliate['status'],
    defaultMarkup: 25,
    primaryColor: '#173B72',
    secondaryColor: '#4FAF4A',
    portalTitle: '',
    tagline: '',
    welcomeMessage: '',
    supportEmail: '',
    supportPhone: '',
    businessHours: '',
    trustBadgeText: '',
    clinicalPartnerNote: '',
    hidePoweredBy: false,
    ownerPassword: '',
    confirmPassword: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!affiliate || !isOpen) return;
    setFormData({
      name: affiliate.name,
      contactName: affiliate.contactName,
      contactEmail: affiliate.contactEmail,
      contactPhone: affiliate.contactPhone || '',
      address: affiliate.address || '',
      status: affiliate.status,
      defaultMarkup: affiliate.defaultMarkup,
      primaryColor: affiliate.primaryColor || '#173B72',
      secondaryColor: affiliate.secondaryColor || '#4FAF4A',
      portalTitle: affiliate.portalTitle || '',
      tagline: affiliate.tagline || '',
      welcomeMessage: affiliate.welcomeMessage || '',
      supportEmail: affiliate.supportEmail || '',
      supportPhone: affiliate.supportPhone || '',
      businessHours: affiliate.businessHours || '',
      trustBadgeText: affiliate.trustBadgeText || '',
      clinicalPartnerNote: affiliate.clinicalPartnerNote || '',
      hidePoweredBy: Boolean(affiliate.hidePoweredBy),
      ownerPassword: '',
      confirmPassword: '',
    });
    setLogoFile(null);
    setPreviewUrl(mediaUrl(affiliate.logoUrl) || null);
    setError('');
  }, [affiliate, isOpen]);

  useEffect(() => {
    if (!logoFile) return;
    const url = URL.createObjectURL(logoFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  if (!affiliate) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contactEmail.trim()) {
      setError('Name and email are required');
      return;
    }
    if (formData.ownerPassword) {
      if (formData.ownerPassword.length < 8) {
        setError('New password must be at least 8 characters');
        return;
      }
      if (formData.ownerPassword !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setSaving(true);
    setError('');
    try {
      await onSave(
        affiliate.id,
        {
          name: formData.name,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          address: formData.address,
          status: formData.status,
          defaultMarkup: Number(formData.defaultMarkup),
          primaryColor: formData.primaryColor,
          secondaryColor: formData.secondaryColor,
          portalTitle: formData.portalTitle,
          tagline: formData.tagline,
          welcomeMessage: formData.welcomeMessage,
          supportEmail: formData.supportEmail,
          supportPhone: formData.supportPhone,
          businessHours: formData.businessHours,
          hidePoweredBy: formData.hidePoweredBy,
          trustBadgeText: formData.trustBadgeText,
          clinicalPartnerNote: formData.clinicalPartnerNote,
          ownerPassword: formData.ownerPassword || undefined,
        },
        logoFile
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update affiliate');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Edit affiliate"
      description="Update clinic details, storefront branding, logo, or reset password."
      icon={<Building2 className="w-5 h-5" />}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
        <div>
          <label className={modalLabelClass}>Logo</label>
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-xl border border-[#E4EAF0] bg-[#F7F9FC] overflow-hidden flex items-center justify-center flex-shrink-0">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt=""
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <ImagePlus className="w-7 h-7 text-[#9CA3AF]" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file && file.size > 5 * 1024 * 1024) {
                    setError('Logo must be 5 MB or smaller');
                    return;
                  }
                  setError('');
                  setLogoFile(file);
                }}
                className="block w-full text-sm text-[#5B6B7C] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#EAF4FB] file:text-[#12345F] hover:file:bg-[#d8ecf9]"
              />
              <p className={modalHintClass}>Leave empty to keep current logo</p>
              {logoFile && (
                <button
                  type="button"
                  onClick={() => {
                    setLogoFile(null);
                    setPreviewUrl(mediaUrl(affiliate.logoUrl) || null);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#B42318] hover:underline"
                >
                  <X className="w-3.5 h-3.5" />
                  Discard new logo
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={modalLabelClass}>Business name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={modalInputClass}
            />
          </div>
          <div>
            <label className={modalLabelClass}>Status</label>
            <ModalSelect
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as Affiliate['status'],
                })
              }
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </ModalSelect>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={modalLabelClass}>Contact name *</label>
            <input
              type="text"
              required
              value={formData.contactName}
              onChange={(e) =>
                setFormData({ ...formData, contactName: e.target.value })
              }
              className={modalInputClass}
            />
          </div>
          <div>
            <label className={modalLabelClass}>Contact email *</label>
            <input
              type="email"
              required
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData({ ...formData, contactEmail: e.target.value })
              }
              className={modalInputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={modalLabelClass}>Phone</label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) =>
                setFormData({ ...formData, contactPhone: e.target.value })
              }
              className={modalInputClass}
            />
          </div>
          <div>
            <label className={modalLabelClass}>Default markup (%)</label>
            <input
              type="number"
              min={0}
              max={500}
              value={formData.defaultMarkup}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  defaultMarkup: Number(e.target.value),
                })
              }
              className={modalInputClass}
            />
          </div>
        </div>

        <div>
          <label className={modalLabelClass}>Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className={modalInputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={modalLabelClass}>Primary color</label>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, primaryColor: e.target.value })
                }
                className="w-11 h-11 p-0.5 border border-[#E4EAF0] rounded-xl cursor-pointer bg-white"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, primaryColor: e.target.value })
                }
                className={`${modalInputClass} font-mono`}
              />
            </div>
          </div>
          <div>
            <label className={modalLabelClass}>Accent color</label>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, secondaryColor: e.target.value })
                }
                className="w-11 h-11 p-0.5 border border-[#E4EAF0] rounded-xl cursor-pointer bg-white"
              />
              <input
                type="text"
                value={formData.secondaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, secondaryColor: e.target.value })
                }
                className={`${modalInputClass} font-mono`}
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E4EAF0] space-y-4">
          <p className="text-sm font-medium text-[#12345F]">Storefront</p>
          <div>
            <label className={modalLabelClass}>Portal title</label>
            <input
              type="text"
              value={formData.portalTitle}
              onChange={(e) =>
                setFormData({ ...formData, portalTitle: e.target.value })
              }
              className={modalInputClass}
            />
          </div>
          <div>
            <label className={modalLabelClass}>Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) =>
                setFormData({ ...formData, tagline: e.target.value })
              }
              className={modalInputClass}
            />
          </div>
          <div>
            <label className={modalLabelClass}>Welcome message</label>
            <textarea
              rows={2}
              value={formData.welcomeMessage}
              onChange={(e) =>
                setFormData({ ...formData, welcomeMessage: e.target.value })
              }
              className={modalInputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={modalLabelClass}>Support email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) =>
                  setFormData({ ...formData, supportEmail: e.target.value })
                }
                className={modalInputClass}
              />
            </div>
            <div>
              <label className={modalLabelClass}>Support phone</label>
              <input
                type="tel"
                value={formData.supportPhone}
                onChange={(e) =>
                  setFormData({ ...formData, supportPhone: e.target.value })
                }
                className={modalInputClass}
              />
            </div>
          </div>
          <div>
            <label className={modalLabelClass}>Business hours</label>
            <input
              type="text"
              value={formData.businessHours}
              onChange={(e) =>
                setFormData({ ...formData, businessHours: e.target.value })
              }
              className={modalInputClass}
            />
          </div>
          <div>
            <label className={modalLabelClass}>Trust badge text</label>
            <input
              type="text"
              value={formData.trustBadgeText}
              onChange={(e) =>
                setFormData({ ...formData, trustBadgeText: e.target.value })
              }
              className={modalInputClass}
            />
          </div>
          <div>
            <label className={modalLabelClass}>Clinical partner note</label>
            <textarea
              rows={2}
              value={formData.clinicalPartnerNote}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  clinicalPartnerNote: e.target.value,
                })
              }
              className={modalInputClass}
            />
          </div>
          <label className="flex items-center gap-2.5 text-sm text-[#344054] cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hidePoweredBy}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hidePoweredBy: e.target.checked,
                })
              }
              className="rounded border-[#D0D5DD]"
            />
            Hide “Powered by LeanBloom”
          </label>
        </div>

        <div className="pt-2 border-t border-[#E4EAF0] space-y-4">
          <p className="text-sm font-medium text-[#12345F]">
            Reset owner password{' '}
            <span className="font-normal text-[#7A8796]">(optional)</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={modalLabelClass}>New password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.ownerPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerPassword: e.target.value })
                  }
                  placeholder="Leave blank to keep"
                  className={`${modalInputClass} pr-11`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#7A8796]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className={modalLabelClass}>Confirm password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className={modalInputClass}
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-[#FEF3F2] border border-[#FECDCA] rounded-xl text-sm text-[#B42318] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="pt-2 border-t border-[#E4EAF0] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className={modalBtnSecondary}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${modalBtnAccent} disabled:opacity-70`}
            disabled={saving}
          >
            <Check className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};
