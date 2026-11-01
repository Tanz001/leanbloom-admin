import React, { useEffect, useState } from 'react';
import {
  Eye,
  Save,
  RotateCcw,
  Smartphone,
  Monitor,
  Check,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  Award,
  ExternalLink,
  Type,
  Palette,
  MessageSquare,
  Globe,
  Upload,
} from 'lucide-react';
import {
  affiliateApi,
  mediaUrl,
  type AffiliateBranding,
} from '../../../lib/api';
import { useToast } from '../../ui/Toast';
import { PageHeader } from '../../common/PageHeader';

interface AffiliateBrandingViewProps {
  onBrandingSaved?: (branding: AffiliateBranding) => void;
}

const COLOR_PALETTES = [
  { name: 'Navy Clinical', primary: '#173B72', secondary: '#4FAF4A' },
  { name: 'Ocean Azure', primary: '#2D82C4', secondary: '#6DBE45' },
  { name: 'Emerald Health', primary: '#1E824C', secondary: '#F39C12' },
  { name: 'Slate Modern', primary: '#1E293B', secondary: '#38BDF8' },
  { name: 'Forest Calm', primary: '#14532D', secondary: '#84CC16' },
  { name: 'Crimson Care', primary: '#991B1B', secondary: '#1E3A8A' },
];

const TABS = [
  { id: 'Identity' as const, label: 'Identity', icon: Type },
  { id: 'Theme' as const, label: 'Theme', icon: Palette },
  { id: 'Details' as const, label: 'Details', icon: MessageSquare },
];

const inputClass =
  'w-full px-3.5 py-2.5 text-sm border border-[#E4E7EC] rounded-xl text-[#0F1C2E] bg-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#173B72] focus:ring-2 focus:ring-[#173B72]/10 transition-shadow';

const labelClass =
  'block text-[11px] font-semibold tracking-wide uppercase text-[#6B7280] mb-1.5';

export const AffiliateBrandingView: React.FC<AffiliateBrandingViewProps> = ({
  onBrandingSaved,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'Identity' | 'Theme' | 'Details'>(
    'Identity'
  );
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>(
    'desktop'
  );

  const [baseline, setBaseline] = useState<AffiliateBranding | null>(null);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [portalTitle, setPortalTitle] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#173B72');
  const [secondaryColor, setSecondaryColor] = useState('#4FAF4A');
  const [headerTheme, setHeaderTheme] = useState<
    'white' | 'navy' | 'dark' | 'cream'
  >('navy');
  const [fontFamily, setFontFamily] = useState<
    AffiliateBranding['fontFamily']
  >('Plus Jakarta Sans');
  const [borderRadius, setBorderRadius] = useState<
    AffiliateBranding['borderRadius']
  >('rounded-xl');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [trustBadgeText, setTrustBadgeText] = useState('');
  const [clinicalPartnerNote, setClinicalPartnerNote] = useState('');
  const [hidePoweredBy, setHidePoweredBy] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [domain, setDomain] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [website, setWebsite] = useState('');

  const applyBranding = (b: AffiliateBranding) => {
    setBaseline(b);
    setName(b.name || '');
    setTagline(b.tagline || '');
    setPortalTitle(b.portalTitle || '');
    setWelcomeMessage(
      b.welcomeMessage ||
        'Complete your clinical medical evaluation in under 3 minutes.'
    );
    setPrimaryColor(b.primaryColor || '#173B72');
    setSecondaryColor(b.secondaryColor || '#4FAF4A');
    setHeaderTheme(b.headerTheme || 'navy');
    setFontFamily(b.fontFamily || 'Plus Jakarta Sans');
    setBorderRadius(b.borderRadius || 'rounded-xl');
    setSupportEmail(b.supportEmail || '');
    setSupportPhone(b.supportPhone || '');
    setBusinessHours(b.businessHours || '');
    setTrustBadgeText(b.trustBadgeText || '');
    setClinicalPartnerNote(b.clinicalPartnerNote || '');
    setHidePoweredBy(Boolean(b.hidePoweredBy));
    setLogoUrl(b.logoUrl || '');
    setLogoFile(null);
    setLogoPreview(null);
    setDomain(b.domain || '');
    setSubdomain(b.subdomain || '');
    setWebsite(b.website || '');
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { branding } = await affiliateApi.getBranding();
        if (!cancelled) applyBranding(branding);
      } catch (err) {
        if (!cancelled) {
          toast.error(
            err instanceof Error ? err.message : 'Failed to load branding'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only
  }, []);

  const displayLogo = logoPreview || mediaUrl(logoUrl);
  const logoMark = displayLogo ? null : (name.substring(0, 1).toUpperCase() || '✦');

  const radiusPx =
    borderRadius === 'rounded-full'
      ? '9999px'
      : borderRadius === 'rounded-xl'
        ? '12px'
        : borderRadius === 'rounded-lg'
          ? '8px'
          : '6px';

  const headerBg =
    headerTheme === 'navy'
      ? primaryColor
      : headerTheme === 'dark'
        ? '#121824'
        : '#FFFFFF';
  const headerFg =
    headerTheme === 'white' || headerTheme === 'cream' ? '#0F1C2E' : '#FFFFFF';

  const handleReset = () => {
    if (baseline) applyBranding(baseline);
  };

  const handleLogoPick = (file: File | null) => {
    if (!file) {
      setLogoFile(null);
      setLogoPreview(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Clinic display name is required');
      setActiveTab('Identity');
      return;
    }
    setSaving(true);
    try {
      const { branding } = await affiliateApi.updateBranding(
        {
          name: name.trim(),
          tagline: tagline.trim(),
          portalTitle: portalTitle.trim(),
          welcomeMessage: welcomeMessage.trim(),
          primaryColor,
          secondaryColor,
          headerTheme,
          fontFamily,
          borderRadius,
          supportEmail: supportEmail.trim(),
          supportPhone: supportPhone.trim(),
          businessHours: businessHours.trim(),
          trustBadgeText: trustBadgeText.trim(),
          clinicalPartnerNote: clinicalPartnerNote.trim(),
          hidePoweredBy,
          logoUrl: logoUrl.trim() || null,
        },
        logoFile
      );
      applyBranding(branding);
      onBrandingSaved?.(branding);
      setSavedSuccess(true);
      toast.success('Branding published to your storefront');
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save branding');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 pb-10">
        <PageHeader
          title="Branding"
          description="Customize how your storefront looks to patients."
        />
        <p className="text-sm text-[#6B7C8F]">Loading your branding…</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12">
      <PageHeader
        title="Branding"
        description="Edit your storefront identity, theme, and patient-facing details."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 text-xs font-semibold text-[#344054] bg-white border border-[#E4E7EC] hover:border-[#D0D5DD] rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open storefront
              </a>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0F1C2E] hover:bg-[#1A2F4A] rounded-xl transition-colors inline-flex items-center gap-1.5 disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving…' : 'Save & publish'}
            </button>
          </div>
        }
      />

      <div className="relative overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            background: `linear-gradient(120deg, ${primaryColor} 0%, ${secondaryColor} 55%, transparent 80%)`,
          }}
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-semibold shadow-sm shrink-0 overflow-hidden"
              style={{ backgroundColor: primaryColor }}
            >
              {displayLogo ? (
                <img src={displayLogo} alt="" className="w-full h-full object-cover" />
              ) : (
                logoMark
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-[#0F1C2E] font-display truncate">
                {name || 'Clinic name'}
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5 truncate">
                {tagline || 'Your storefront tagline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#6B7280] font-mono bg-[#F8F9FC] border border-[#E4E7EC] rounded-xl px-3 py-2 max-w-full sm:max-w-[280px] truncate">
            <Globe className="w-3.5 h-3.5 shrink-0 text-[#2D82C4]" />
            <span className="truncate">{domain || subdomain || '—'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-5 bg-white rounded-2xl border border-[#E4E7EC] overflow-hidden flex flex-col shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <div className="flex border-b border-[#E4E7EC] bg-[#FAFBFC] px-2 pt-2 gap-0.5 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold rounded-t-xl border-b-2 transition-colors whitespace-nowrap ${
                    active
                      ? 'border-[#173B72] text-[#173B72] bg-white'
                      : 'border-transparent text-[#6B7280] hover:text-[#0F1C2E] hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-260px)]">
            {activeTab === 'Identity' && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>
                    Clinic display name <span className="text-red-500 normal-case">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Physician-supervised weight loss"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Logo image</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-[#0F1C2E] bg-[#F8F9FC] border border-[#E4E7EC] hover:bg-white rounded-xl cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      Upload logo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleLogoPick(e.target.files?.[0] || null)
                        }
                      />
                    </label>
                    {(displayLogo || logoUrl) && (
                      <button
                        type="button"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview(null);
                          setLogoUrl('');
                        }}
                        className="text-xs font-semibold text-[#B91C1C] hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => {
                      setLogoUrl(e.target.value);
                      setLogoFile(null);
                      setLogoPreview(null);
                    }}
                    placeholder="Or paste a logo URL"
                    className={`${inputClass} font-mono text-xs mt-2`}
                  />
                </div>

                <div className="rounded-xl border border-[#E4E7EC] bg-[#FAFBFC] p-4 space-y-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                    Hostnames (read-only)
                  </p>
                  <div className="flex items-start gap-2 text-xs">
                    <span className="text-[#9CA3AF] w-16 shrink-0">Primary</span>
                    <span className="font-mono font-medium text-[#2D82C4] break-all">
                      {domain || '—'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <span className="text-[#9CA3AF] w-16 shrink-0">Subdomain</span>
                    <span className="font-mono font-medium text-[#173B72] break-all">
                      {subdomain || '—'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Theme' && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Curated palettes</label>
                  <div className="grid grid-cols-2 gap-2">
                    {COLOR_PALETTES.map((pal) => {
                      const selected =
                        primaryColor === pal.primary &&
                        secondaryColor === pal.secondary;
                      return (
                        <button
                          key={pal.name}
                          type="button"
                          onClick={() => {
                            setPrimaryColor(pal.primary);
                            setSecondaryColor(pal.secondary);
                          }}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            selected
                              ? 'border-[#173B72] ring-2 ring-[#173B72]/15 bg-white'
                              : 'border-[#E4E7EC] hover:bg-[#FAFBFC]'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className="w-5 h-5 rounded-md shadow-sm"
                              style={{ backgroundColor: pal.primary }}
                            />
                            <span
                              className="w-5 h-5 rounded-md shadow-sm"
                              style={{ backgroundColor: pal.secondary }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-[#0F1C2E]">
                            {pal.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Primary</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 h-10 rounded-xl border border-[#E4E7EC] cursor-pointer p-1 bg-white shrink-0"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className={`${inputClass} font-mono text-xs`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Accent</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-10 h-10 rounded-xl border border-[#E4E7EC] cursor-pointer p-1 bg-white shrink-0"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className={`${inputClass} font-mono text-xs`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Header style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'navy' as const, label: 'Brand' },
                        { id: 'white' as const, label: 'White' },
                        { id: 'dark' as const, label: 'Dark' },
                      ] as const
                    ).map((thm) => (
                      <button
                        key={thm.id}
                        type="button"
                        onClick={() => setHeaderTheme(thm.id)}
                        className={`py-2.5 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                          headerTheme === thm.id
                            ? 'bg-[#0F1C2E] text-white border-[#0F1C2E]'
                            : 'bg-white text-[#344054] border-[#E4E7EC] hover:bg-[#FAFBFC]'
                        }`}
                      >
                        {thm.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Typography</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        'Plus Jakarta Sans',
                        'Inter',
                        'Outfit',
                        'DM Sans',
                      ] as const
                    ).map((font) => (
                      <button
                        key={font}
                        type="button"
                        onClick={() => setFontFamily(font)}
                        className={`py-2.5 px-3 text-xs rounded-xl border text-left flex items-center justify-between transition-all ${
                          fontFamily === font
                            ? 'bg-[#F0F4FA] text-[#173B72] border-[#2D82C4]/50 font-semibold'
                            : 'bg-white text-[#344054] border-[#E4E7EC]'
                        }`}
                      >
                        <span style={{ fontFamily: font }}>{font.split(' ')[0]}</span>
                        {fontFamily === font && (
                          <Check className="w-3.5 h-3.5 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Corner radius</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(
                      [
                        { id: 'rounded-md' as const, label: '6' },
                        { id: 'rounded-lg' as const, label: '8' },
                        { id: 'rounded-xl' as const, label: '12' },
                        { id: 'rounded-full' as const, label: 'Pill' },
                      ] as const
                    ).map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setBorderRadius(r.id)}
                        className={`py-2.5 text-[11px] font-semibold border text-center transition-all ${
                          borderRadius === r.id
                            ? 'bg-[#0F1C2E] text-white border-[#0F1C2E]'
                            : 'bg-white text-[#344054] border-[#E4E7EC] hover:bg-[#FAFBFC]'
                        }`}
                        style={{
                          borderRadius:
                            r.id === 'rounded-full'
                              ? '9999px'
                              : r.id === 'rounded-xl'
                                ? '12px'
                                : r.id === 'rounded-lg'
                                  ? '8px'
                                  : '6px',
                        }}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Details' && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Portal / storefront title</label>
                  <input
                    type="text"
                    value={portalTitle}
                    onChange={(e) => setPortalTitle(e.target.value)}
                    placeholder={`${name || 'Clinic'} Patient Portal`}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Welcome message</label>
                  <textarea
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-y min-h-[88px]`}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Support email</label>
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Support phone</label>
                    <input
                      type="text"
                      value={supportPhone}
                      onChange={(e) => setSupportPhone(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Business hours</label>
                  <input
                    type="text"
                    value={businessHours}
                    onChange={(e) => setBusinessHours(e.target.value)}
                    placeholder="Mon–Fri 9am–5pm ET"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Trust badge text</label>
                  <input
                    type="text"
                    value={trustBadgeText}
                    onChange={(e) => setTrustBadgeText(e.target.value)}
                    placeholder="Licensed medical providers"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Clinical partner note</label>
                  <textarea
                    value={clinicalPartnerNote}
                    onChange={(e) => setClinicalPartnerNote(e.target.value)}
                    rows={2}
                    className={`${inputClass} resize-y min-h-[72px]`}
                  />
                </div>
                <label className="flex items-center gap-2.5 text-sm text-[#344054] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hidePoweredBy}
                    onChange={(e) => setHidePoweredBy(e.target.checked)}
                    className="w-4 h-4 rounded border-[#D0D5DD] text-[#173B72] focus:ring-[#173B72]"
                  />
                  Hide “Powered by LeanBloom” on the storefront
                </label>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[#E4E7EC] bg-[#FAFBFC] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-xs font-semibold text-[#6B7280] hover:text-[#0F1C2E] hover:bg-white rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <div className="flex items-center gap-3">
              {savedSuccess && (
                <span className="text-xs font-semibold text-[#2E9B4B] inline-flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-xl transition-colors inline-flex items-center gap-1.5 disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-7 space-y-3 xl:sticky xl:top-4">
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1C2E]">
              <Eye className="w-4 h-4 text-[#173B72]" />
              Patient preview
            </div>
            <div className="flex items-center bg-white border border-[#E4E7EC] rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setPreviewViewport('desktop')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors ${
                  previewViewport === 'desktop'
                    ? 'bg-[#0F1C2E] text-white'
                    : 'text-[#6B7280] hover:text-[#0F1C2E]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport('mobile')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors ${
                  previewViewport === 'mobile'
                    ? 'bg-[#0F1C2E] text-white'
                    : 'text-[#6B7280] hover:text-[#0F1C2E]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile
              </button>
            </div>
          </div>

          <div
            className="rounded-2xl p-4 sm:p-6 border border-[#E4E7EC]"
            style={{
              background: `linear-gradient(160deg, ${primaryColor}12 0%, #F4F6F9 40%, ${secondaryColor}10 100%)`,
            }}
          >
            <div
              className={`mx-auto transition-all duration-300 ${
                previewViewport === 'mobile'
                  ? 'max-w-[320px] rounded-[2rem] border-[8px] border-[#1F2937] shadow-2xl overflow-hidden bg-[#1F2937]'
                  : 'w-full rounded-2xl border border-[#D0D5DD]/80 shadow-xl bg-white overflow-hidden'
              }`}
            >
              {previewViewport === 'desktop' && (
                <div className="bg-[#F2F4F7] px-3 py-2 border-b border-[#E4E7EC] flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
                  </div>
                  <div className="flex-1 bg-white rounded-lg px-3 py-1.5 text-[11px] font-mono text-[#6B7280] flex items-center gap-1.5 border border-[#E4E7EC] truncate">
                    <Lock className="w-3 h-3 text-[#2E9B4B] shrink-0" />
                    <span className="text-[#0F1C2E] font-semibold truncate">
                      https://{domain || subdomain}
                    </span>
                  </div>
                </div>
              )}

              <div
                className={`bg-white text-[#0F1C2E] overflow-hidden flex flex-col ${
                  previewViewport === 'mobile' ? 'rounded-[1.35rem]' : ''
                }`}
                style={{ fontFamily }}
              >
                <div
                  className="px-4 py-3 flex items-center justify-between border-b"
                  style={{
                    backgroundColor: headerBg,
                    color: headerFg,
                    borderColor: headerTheme === 'white' ? '#E4E7EC' : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden"
                      style={{
                        backgroundColor:
                          headerTheme === 'navy'
                            ? 'rgba(255,255,255,0.18)'
                            : primaryColor,
                      }}
                    >
                      {displayLogo ? (
                        <img
                          src={displayLogo}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        logoMark
                      )}
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-xs font-bold tracking-tight truncate">
                        {name || 'Clinic'}
                      </h1>
                      <span className="text-[10px] opacity-70 block truncate">
                        {tagline || 'Telehealth Clinic'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`px-2.5 py-1.5 font-semibold text-[11px] shrink-0 ${borderRadius}`}
                    style={{
                      backgroundColor:
                        headerTheme === 'white'
                          ? primaryColor
                          : 'rgba(255,255,255,0.18)',
                      color: '#FFFFFF',
                    }}
                  >
                    Login
                  </button>
                </div>

                <div
                  className="px-5 py-6 text-center space-y-2.5 border-b border-[#F2F4F7]"
                  style={{
                    background: `linear-gradient(180deg, ${primaryColor}08 0%, #FFFFFF 70%)`,
                  }}
                >
                  <div
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border"
                    style={{
                      backgroundColor: `${secondaryColor}18`,
                      color: secondaryColor,
                      borderColor: `${secondaryColor}40`,
                    }}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    {trustBadgeText || 'Licensed medical providers'}
                  </div>
                  <h2 className="text-lg font-bold text-[#0F1C2E] leading-snug font-display">
                    {portalTitle || `${name || 'Clinic'} Patient Care`}
                  </h2>
                  <p className="text-xs text-[#6B7280] max-w-sm mx-auto leading-relaxed">
                    {welcomeMessage}
                  </p>
                </div>

                <div className="p-5 space-y-4">
                  <div
                    className="p-4 border border-[#E4E7EC] bg-white space-y-3"
                    style={{ borderRadius: radiusPx }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: primaryColor }}
                        >
                          Featured program
                        </span>
                        <h3 className="text-sm font-bold text-[#0F1C2E] mt-0.5">
                          Compounded Semaglutide + B12
                        </h3>
                        <p className="text-[11px] text-[#6B7280] mt-0.5">
                          Weekly injection · Provider-guided titration
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className="text-lg font-bold font-mono"
                          style={{ color: primaryColor }}
                        >
                          $149
                        </span>
                        <span className="text-[10px] text-[#9CA3AF] block">
                          / month
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-[11px] text-[#344054]">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: secondaryColor }}
                        />
                        Asynchronous clinician review
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: secondaryColor }}
                        />
                        Ships from 503A compounding pharmacy
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`w-full py-2.5 text-xs font-bold text-white flex items-center justify-center gap-1.5 ${borderRadius}`}
                      style={{ backgroundColor: primaryColor }}
                    >
                      Start consultation
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-[#6B7280]">
                    {[
                      { icon: Stethoscope, title: 'Board certified', sub: 'MD / DO' },
                      { icon: ShieldCheck, title: 'HIPAA', sub: 'Encrypted' },
                      { icon: Award, title: '503A', sub: 'Pharmacy' },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="p-2.5 bg-[#FAFBFC] rounded-xl border border-[#F2F4F7]"
                      >
                        <item.icon
                          className="w-3.5 h-3.5 mx-auto mb-1"
                          style={{ color: primaryColor }}
                        />
                        <span className="block font-semibold text-[#0F1C2E]">
                          {item.title}
                        </span>
                        <span>{item.sub}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-3.5 bg-[#FAFBFC] border-t border-[#E4E7EC] text-center text-[10px] text-[#6B7280] space-y-1.5">
                  <p>
                    Support:{' '}
                    <span className="font-semibold text-[#0F1C2E]">
                      {supportEmail || 'support@clinic.com'}
                    </span>
                    {supportPhone ? ` · ${supportPhone}` : ''}
                  </p>
                  {businessHours && (
                    <p className="text-[#9CA3AF]">{businessHours}</p>
                  )}
                  {!hidePoweredBy && (
                    <p className="pt-1.5 border-t border-[#E4E7EC]/80 text-[#9CA3AF]">
                      Powered by{' '}
                      <span className="font-bold text-[#173B72]">LeanBloom</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
