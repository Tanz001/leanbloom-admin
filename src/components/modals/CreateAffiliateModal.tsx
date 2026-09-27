import React, { useEffect, useState } from 'react';
import {
  Building2,
  Globe,
  Palette,
  DollarSign,
  ShieldAlert,
  Check,
  ImagePlus,
  KeyRound,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  Store,
} from 'lucide-react';
import { Affiliate } from '../../types';
import {
  ModalShell,
  ModalSelect,
  modalBtnAccent,
  modalBtnPrimary,
  modalBtnSecondary,
  modalHintClass,
  modalInputClass,
  modalLabelClass,
} from './ModalShell';

export type AffiliateFormPayload = Omit<
  Affiliate,
  | 'id'
  | 'patientsCount'
  | 'ordersCount'
  | 'revenue'
  | 'commission'
  | 'growth'
  | 'createdAt'
  | 'logoUrl'
> & {
  ownerPassword: string;
};

interface CreateAffiliateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    affiliate: AffiliateFormPayload,
    logoFile?: File | null
  ) => void | Promise<void>;
}

const tabs = [
  { id: 'business' as const, label: 'Business', icon: Building2 },
  { id: 'access' as const, label: 'Access', icon: KeyRound },
  { id: 'branding' as const, label: 'Branding', icon: Palette },
  { id: 'storefront' as const, label: 'Storefront', icon: Store },
  { id: 'domain' as const, label: 'Domain', icon: Globe },
  { id: 'pricing' as const, label: 'Pricing', icon: DollarSign },
];

export const CreateAffiliateModal: React.FC<CreateAffiliateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]['id']>('business');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    subdomain: '',
    domain: '',
    primaryColor: '#173B72',
    secondaryColor: '#4FAF4A',
    defaultMarkup: 25,
    status: 'Active' as Affiliate['status'],
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!logoFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(logoFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  const handleNameChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug,
      subdomain: slug ? `${slug}.leanbloom.com` : '',
    }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!formData.name.trim()) next.name = 'Business name is required';
    if (!formData.contactEmail.trim()) next.contactEmail = 'Email is required';
    if (!formData.contactName.trim()) next.contactName = 'Contact name is required';
    if (formData.ownerPassword.length < 8) {
      next.ownerPassword = 'Password must be at least 8 characters';
    }
    if (formData.ownerPassword !== formData.confirmPassword) {
      next.confirmPassword = 'Passwords do not match';
    }
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      if (next.name || next.contactEmail || next.contactName) {
        setActiveTab('business');
      } else {
        setActiveTab('access');
      }
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      await onCreate(
        {
          name: formData.name,
          slug: formData.slug || 'affiliate-portal',
          domain: formData.domain || `${formData.slug}.leanbloom.com`,
          subdomain: formData.subdomain || `${formData.slug}.leanbloom.com`,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone || '',
          status: formData.status,
          primaryColor: formData.primaryColor,
          secondaryColor: formData.secondaryColor,
          defaultMarkup: Number(formData.defaultMarkup) || 25,
          address: formData.address,
          portalTitle: formData.portalTitle || undefined,
          tagline: formData.tagline || undefined,
          welcomeMessage: formData.welcomeMessage || undefined,
          supportEmail: formData.supportEmail || undefined,
          supportPhone: formData.supportPhone || undefined,
          businessHours: formData.businessHours || undefined,
          trustBadgeText: formData.trustBadgeText || undefined,
          clinicalPartnerNote: formData.clinicalPartnerNote || undefined,
          hidePoweredBy: formData.hidePoweredBy,
          ownerPassword: formData.ownerPassword,
        },
        logoFile
      );
      onClose();
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : 'Failed to create affiliate',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Create affiliate"
      description="Set up the clinic, branding, and owner login password."
      icon={<Building2 className="w-5 h-5" />}
      maxWidth="xl"
    >
      <div className="flex border-b border-[#E4EAF0] px-6 gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 px-3 text-sm font-medium border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                active
                  ? 'border-[#2D82C4] text-[#12345F]'
                  : 'border-transparent text-[#7A8796] hover:text-[#12345F]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {activeTab === 'business' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={modalLabelClass}>Business name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Metro Integrative Health"
                  className={modalInputClass}
                />
                {errors.name && (
                  <p className="text-xs text-[#D64545] mt-1.5">{errors.name}</p>
                )}
              </div>
              <div>
                <label className={modalLabelClass}>Contact name *</label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactName: e.target.value })
                  }
                  placeholder="Dr. Julian Pierce"
                  className={modalInputClass}
                />
                {errors.contactName && (
                  <p className="text-xs text-[#D64545] mt-1.5">
                    {errors.contactName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={modalLabelClass}>Contact email *</label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  placeholder="admin@clinic.com"
                  className={modalInputClass}
                />
                {errors.contactEmail && (
                  <p className="text-xs text-[#D64545] mt-1.5">
                    {errors.contactEmail}
                  </p>
                )}
              </div>
              <div>
                <label className={modalLabelClass}>Phone</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPhone: e.target.value })
                  }
                  placeholder="+1 (555) 123-4567"
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
                placeholder="100 Medical Center Way, Suite 300"
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
        )}

        {activeTab === 'access' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl border border-[#E4EAF0] bg-[#F7F9FC] text-sm text-[#5B6B7C] leading-relaxed">
              Master admin sets the affiliate owner password. The contact email
              is used as their login.
            </div>
            <div>
              <label className={modalLabelClass}>Login email</label>
              <input
                type="email"
                value={formData.contactEmail}
                readOnly
                className={`${modalInputClass} bg-[#F7F9FC] text-[#5B6B7C]`}
              />
              <p className={modalHintClass}>From the Business tab</p>
            </div>
            <div>
              <label className={modalLabelClass}>Owner password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.ownerPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerPassword: e.target.value })
                  }
                  placeholder="Min. 8 characters"
                  className={`${modalInputClass} pr-11`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#7A8796] hover:text-[#12345F]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.ownerPassword && (
                <p className="text-xs text-[#D64545] mt-1.5">
                  {errors.ownerPassword}
                </p>
              )}
            </div>
            <div>
              <label className={modalLabelClass}>Confirm password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Re-enter password"
                className={modalInputClass}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-[#D64545] mt-1.5">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'branding' && (
          <div className="space-y-5">
            <div>
              <label className={modalLabelClass}>Clinic logo</label>
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
                <div className="flex-1 min-w-0 space-y-2">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file && file.size > 5 * 1024 * 1024) {
                        setErrors({ form: 'Logo must be 5 MB or smaller' });
                        setLogoFile(null);
                        return;
                      }
                      setErrors({});
                      setLogoFile(file);
                    }}
                    className="block w-full text-sm text-[#5B6B7C] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#EAF4FB] file:text-[#12345F] hover:file:bg-[#d8ecf9]"
                  />
                  <p className={modalHintClass}>PNG, JPG, WebP, SVG · max 5 MB</p>
                  {logoFile && (
                    <button
                      type="button"
                      onClick={() => setLogoFile(null)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#B42318] hover:underline"
                    >
                      <X className="w-3.5 h-3.5" />
                      Remove logo
                    </button>
                  )}
                </div>
              </div>
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
                      setFormData({
                        ...formData,
                        secondaryColor: e.target.value,
                      })
                    }
                    className="w-11 h-11 p-0.5 border border-[#E4EAF0] rounded-xl cursor-pointer bg-white"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        secondaryColor: e.target.value,
                      })
                    }
                    className={`${modalInputClass} font-mono`}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[#E4EAF0] bg-[#F8FAFC] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt=""
                    className="w-10 h-10 rounded-xl object-contain bg-white border border-[#E4EAF0]"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-semibold font-display flex-shrink-0"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    {formData.name
                      ? formData.name.substring(0, 2).toUpperCase()
                      : 'AF'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#12345F] font-display truncate">
                    {formData.name || 'Sample clinic'}
                  </p>
                  <p className="text-xs text-[#7A8796]">Storefront preview</p>
                </div>
              </div>
              <span
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white flex-shrink-0"
                style={{ backgroundColor: formData.secondaryColor }}
              >
                Start
              </span>
            </div>
          </div>
        )}

        {activeTab === 'storefront' && (
          <div className="space-y-4">
            <p className={modalHintClass}>
              Patient-facing copy shown on the affiliate storefront.
            </p>
            <div>
              <label className={modalLabelClass}>Portal title</label>
              <input
                type="text"
                value={formData.portalTitle}
                onChange={(e) =>
                  setFormData({ ...formData, portalTitle: e.target.value })
                }
                placeholder={
                  formData.name
                    ? `${formData.name} Patient Portal`
                    : 'Clinic Patient Portal'
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
                placeholder="Physician-guided metabolic care"
                className={modalInputClass}
              />
            </div>
            <div>
              <label className={modalLabelClass}>Welcome message</label>
              <textarea
                rows={3}
                value={formData.welcomeMessage}
                onChange={(e) =>
                  setFormData({ ...formData, welcomeMessage: e.target.value })
                }
                placeholder="Short intro shown on the storefront home page"
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
                  placeholder={formData.contactEmail || 'care@clinic.com'}
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
                  placeholder={formData.contactPhone || '(800) 555-0100'}
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
                placeholder="Mon – Fri: 8:00 AM – 6:00 PM"
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
                placeholder="Licensed telehealth · HIPAA compliant"
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
                placeholder="Prescriptions subject to licensed clinician review"
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
              Hide “Powered by LeanBloom” on storefront
            </label>
          </div>
        )}

        {activeTab === 'domain' && (
          <div className="space-y-4">
            <div>
              <label className={modalLabelClass}>Platform subdomain</label>
              <div className="flex items-stretch">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value,
                      subdomain: `${e.target.value}.leanbloom.com`,
                    })
                  }
                  placeholder="myclinic"
                  className={`${modalInputClass} rounded-r-none border-r-0`}
                />
                <span className="px-3.5 flex items-center text-sm bg-[#F3F4F6] border border-[#E4EAF0] text-[#5B6B7C] rounded-r-xl font-mono">
                  .leanbloom.com
                </span>
              </div>
              <p className={modalHintClass}>Active immediately with SSL.</p>
            </div>
            <div>
              <label className={modalLabelClass}>Custom domain (optional)</label>
              <input
                type="text"
                value={formData.domain}
                onChange={(e) =>
                  setFormData({ ...formData, domain: e.target.value })
                }
                placeholder="care.myclinic.com"
                className={modalInputClass}
              />
              <p className={modalHintClass}>
                Point a CNAME to cname.leanbloom.com
              </p>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl border border-[#FEE4E2]/80 bg-[#FFF8F6] flex items-start gap-2.5 text-sm text-[#9A3412]">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#D99A18]" />
              <p className="leading-relaxed">
                Affiliates cannot price below LeanBloom’s wholesale minimum.
              </p>
            </div>
            <div>
              <label className={modalLabelClass}>Default markup (%)</label>
              <div className="relative w-40">
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={formData.defaultMarkup}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultMarkup: Number(e.target.value),
                    })
                  }
                  className={`${modalInputClass} pr-9`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7A8796]">
                  %
                </span>
              </div>
              <p className={modalHintClass}>
                Suggested retail above wholesale base cost.
              </p>
            </div>
          </div>
        )}

        {errors.form && (
          <div className="p-3 bg-[#FEF3F2] border border-[#FECDCA] rounded-xl text-sm text-[#B42318] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errors.form}
          </div>
        )}

        <div className="pt-2 border-t border-[#E4EAF0] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className={modalBtnSecondary}
            disabled={saving}
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            {activeTab !== 'pricing' ? (
              <button
                type="button"
                onClick={() => {
                  const order = tabs.map((t) => t.id);
                  const i = order.indexOf(activeTab);
                  if (i < order.length - 1) setActiveTab(order[i + 1]);
                }}
                className={modalBtnPrimary}
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className={`${modalBtnAccent} disabled:opacity-70`}
                disabled={saving}
              >
                <Check className="w-4 h-4" />
                {saving ? 'Creating…' : 'Create affiliate'}
              </button>
            )}
          </div>
        </div>
      </form>
    </ModalShell>
  );
};
