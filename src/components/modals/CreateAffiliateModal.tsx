import React, { useState } from 'react';
import { X, Building2, Globe, Palette, DollarSign, ShieldAlert, Check } from 'lucide-react';
import { Affiliate } from '../../types';

interface CreateAffiliateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (affiliate: Omit<Affiliate, 'id' | 'patientsCount' | 'ordersCount' | 'revenue' | 'commission' | 'growth' | 'createdAt'>) => void;
}

export const CreateAffiliateModal: React.FC<CreateAffiliateModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [activeTab, setActiveTab] = useState<'business' | 'branding' | 'domain' | 'pricing'>('business');

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
    status: 'Active' as 'Active' | 'Pending'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug,
      subdomain: slug ? `${slug}.leanbloom.com` : ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Business name is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email is required';
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact person is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setActiveTab('business');
      return;
    }

    onCreate({
      name: formData.name,
      slug: formData.slug || 'affiliate-portal',
      domain: formData.domain || `${formData.slug}.com`,
      subdomain: formData.subdomain || `${formData.slug}.leanbloom.com`,
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone || '+1 (555) 000-0000',
      status: formData.status,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      defaultMarkup: Number(formData.defaultMarkup) || 25,
      address: formData.address
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-[#E4E7EC] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F8F9FC]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#EAF4FB] text-[#173B72] rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172033]">Create New White-Label Affiliate</h3>
              <p className="text-xs text-[#667085]">Provision a new clinic tenant under LeanBloom Master</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#667085] hover:text-[#172033] hover:bg-[#E4E7EC] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E4E7EC] px-6 bg-white gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('business')}
            className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'business'
                ? 'border-[#173B72] text-[#173B72]'
                : 'border-transparent text-[#667085] hover:text-[#172033]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Business Information
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'branding'
                ? 'border-[#173B72] text-[#173B72]'
                : 'border-transparent text-[#667085] hover:text-[#172033]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Branding
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('domain')}
            className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'domain'
                ? 'border-[#173B72] text-[#173B72]'
                : 'border-transparent text-[#667085] hover:text-[#172033]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Domain & Routing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'pricing'
                ? 'border-[#173B72] text-[#173B72]'
                : 'border-transparent text-[#667085] hover:text-[#172033]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Pricing & Rules
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'business' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#344054] mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Metro Integrative Health"
                    className="w-full px-3 py-2 text-xs border border-[#D0D5DD] rounded-lg focus:ring-2 focus:ring-[#2D82C4]/30 focus:border-[#2D82C4]"
                  />
                  {errors.name && <p className="text-[11px] text-[#D64545] mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#344054] mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="e.g. Dr. Julian Pierce"
                    className="w-full px-3 py-2 text-xs border border-[#D0D5DD] rounded-lg focus:ring-2 focus:ring-[#2D82C4]/30 focus:border-[#2D82C4]"
                  />
                  {errors.contactName && <p className="text-[11px] text-[#D64545] mt-1">{errors.contactName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#344054] mb-1">
                    Primary Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="admin@metrohealth.com"
                    className="w-full px-3 py-2 text-xs border border-[#D0D5DD] rounded-lg focus:ring-2 focus:ring-[#2D82C4]/30 focus:border-[#2D82C4]"
                  />
                  {errors.contactEmail && <p className="text-[11px] text-[#D64545] mt-1">{errors.contactEmail}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#344054] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3 py-2 text-xs border border-[#D0D5DD] rounded-lg focus:ring-2 focus:ring-[#2D82C4]/30 focus:border-[#2D82C4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#344054] mb-1">
                  Clinic Office / Billing Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="100 Medical Center Way, Suite 300, Dallas, TX 75201"
                  className="w-full px-3 py-2 text-xs border border-[#D0D5DD] rounded-lg focus:ring-2 focus:ring-[#2D82C4]/30 focus:border-[#2D82C4]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#344054] mb-1">
                  Tenant Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-[#D0D5DD] rounded-lg bg-white"
                >
                  <option value="Active">Active (Immediate Storefront Deployment)</option>
                  <option value="Pending">Pending Compliance / Prescriber Review</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#EAF4FB] rounded-xl border border-[#2D82C4]/20 text-xs text-[#173B72]">
                LeanBloom automatically injects the affiliate’s custom palette into their white-label patient intake portal and e-commerce checkout.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#344054] mb-1">
                    Primary Brand Color (Header / Buttons)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-10 h-10 p-0 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono border border-[#D0D5DD] rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#344054] mb-1">
                    Secondary Accent Color (Badges / Highlights)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-10 h-10 p-0 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono border border-[#D0D5DD] rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#344054] mb-1">
                  Live Palette Preview
                </label>
                <div className="p-4 rounded-xl border border-gray-200 bg-[#F7F9FC] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-xs"
                      style={{ backgroundColor: formData.primaryColor }}
                    >
                      {formData.name ? formData.name.substring(0, 2).toUpperCase() : 'AF'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#172033]">
                        {formData.name || 'Sample Affiliate Clinic'}
                      </p>
                      <p className="text-[11px] text-[#667085]">White-Label Telehealth Portal</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white shadow-xs"
                    style={{ backgroundColor: formData.secondaryColor }}
                  >
                    Start Intake
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'domain' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#344054] mb-1">
                  LeanBloom Managed Subdomain
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        slug: e.target.value,
                        subdomain: `${e.target.value}.leanbloom.com`
                      })
                    }
                    placeholder="myclinic"
                    className="flex-1 px-3 py-2 text-xs border border-r-0 border-[#D0D5DD] rounded-l-lg"
                  />
                  <span className="px-3 py-2 text-xs bg-[#F2F4F7] border border-[#D0D5DD] text-[#667085] rounded-r-lg font-mono">
                    .leanbloom.com
                  </span>
                </div>
                <p className="text-[11px] text-[#667085] mt-1">
                  Instantly active with automated wildcard SSL certification.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#344054] mb-1">
                  Affiliate Custom Domain (Optional)
                </label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="e.g. portal.myclinic.com"
                  className="w-full px-3 py-2 text-xs border border-[#D0D5DD] rounded-lg focus:ring-2 focus:ring-[#2D82C4]/30"
                />
                <p className="text-[11px] text-[#667085] mt-1">
                  Affiliate will point a CNAME DNS record to <code className="text-[#173B72] font-mono">cname.leanbloom.com</code>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#FEF6EE] rounded-xl border border-[#D99A18]/30 flex items-start gap-2 text-xs text-[#B54708]">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#D99A18]" />
                <div>
                  <strong>Mandatory Platform Price Floor Rule:</strong>
                  <p className="mt-0.5 text-[11px] leading-relaxed">
                    LeanBloom enforces that this affiliate can never price products below LeanBloom's wholesale base price floor.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#344054] mb-1">
                  Default Target Markup (% above wholesale base)
                </label>
                <div className="relative w-36">
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={formData.defaultMarkup}
                    onChange={(e) => setFormData({ ...formData, defaultMarkup: Number(e.target.value) })}
                    className="w-full pl-3 pr-8 py-2 text-xs border border-[#D0D5DD] rounded-lg"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#667085] font-bold">
                    %
                  </span>
                </div>
                <p className="text-[11px] text-[#667085] mt-1">
                  e.g. A $299 wholesale program with 25% markup sells at $373.75 retail.
                </p>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#173B72]" />
                  <span className="text-xs text-[#344054]">
                    Send automated onboarding email with API keys & admin portal invitation
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#E4E7EC] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] rounded-lg hover:bg-[#F2F4F7] transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              {activeTab !== 'pricing' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'business') setActiveTab('branding');
                    else if (activeTab === 'branding') setActiveTab('domain');
                    else if (activeTab === 'domain') setActiveTab('pricing');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-lg transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  id="submit-create-affiliate-btn"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#4FAF4A] hover:bg-[#2E9B4B] rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Create & Launch Affiliate
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
