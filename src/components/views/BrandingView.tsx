import React, { useState, useEffect } from 'react';
import {
  Palette,
  Eye,
  Save,
  RotateCcw,
  Smartphone,
  Monitor,
  Check,
  Building2,
  Globe,
  Sliders,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Download,
  Copy,
  ExternalLink,
  Layers,
  FileText,
  Type,
  Lock,
  ArrowRight,
  Heart,
  Stethoscope,
  Activity,
  Award
} from 'lucide-react';
import { Affiliate, Product } from '../../types';

interface BrandingViewProps {
  affiliates: Affiliate[];
  products: Product[];
  onSaveAffiliateBranding: (updatedAffiliate: Affiliate) => void;
  selectedAffiliateId?: string;
}

// Preset logo icons for quick white-label testing
const LOGO_PRESETS = [
  { label: 'Clinical Cross', icon: '✚' },
  { label: 'Pulse Wave', icon: '〰' },
  { label: 'Vitality Leaf', icon: '🌿' },
  { label: 'Apex Shield', icon: '🛡' },
  { label: 'Caduceus MD', icon: '⚕' },
  { label: 'Lotus Bloom', icon: '🌸' }
];

// Curated medical & wellness color palettes
const COLOR_PALETTES = [
  { name: 'Navy Clinical', primary: '#173B72', secondary: '#4FAF4A' },
  { name: 'Ocean Azure', primary: '#2D82C4', secondary: '#6DBE45' },
  { name: 'Emerald Health', primary: '#1E824C', secondary: '#F39C12' },
  { name: 'Royal Plum', primary: '#5C2D91', secondary: '#27AE60' },
  { name: 'Slate Modern', primary: '#1E293B', secondary: '#38BDF8' },
  { name: 'Crimson Care', primary: '#991B1B', secondary: '#1E3A8A' }
];

export const BrandingView: React.FC<BrandingViewProps> = ({
  affiliates,
  products,
  onSaveAffiliateBranding,
  selectedAffiliateId
}) => {
  // Current affiliate being customized
  const [currentAffId, setCurrentAffId] = useState<string>(
    selectedAffiliateId || affiliates[0]?.id || ''
  );

  const activeAffiliate = affiliates.find((a) => a.id === currentAffId) || affiliates[0];

  // Form states synced with selected affiliate
  const [name, setName] = useState(activeAffiliate?.name || '');
  const [tagline, setTagline] = useState(activeAffiliate?.tagline || '');
  const [primaryColor, setPrimaryColor] = useState(activeAffiliate?.primaryColor || '#173B72');
  const [secondaryColor, setSecondaryColor] = useState(activeAffiliate?.secondaryColor || '#4FAF4A');
  const [headerTheme, setHeaderTheme] = useState<'white' | 'navy' | 'dark' | 'cream'>(
    activeAffiliate?.headerTheme || 'navy'
  );
  const [fontFamily, setFontFamily] = useState<'Plus Jakarta Sans' | 'Inter' | 'Outfit' | 'DM Sans' | 'Playfair Display'>(
    activeAffiliate?.fontFamily || 'Plus Jakarta Sans'
  );
  const [borderRadius, setBorderRadius] = useState<'rounded-md' | 'rounded-lg' | 'rounded-xl' | 'rounded-full'>(
    activeAffiliate?.borderRadius || 'rounded-xl'
  );
  const [portalTitle, setPortalTitle] = useState(activeAffiliate?.portalTitle || '');
  const [welcomeMessage, setWelcomeMessage] = useState(activeAffiliate?.welcomeMessage || '');
  const [supportEmail, setSupportEmail] = useState(activeAffiliate?.supportEmail || '');
  const [supportPhone, setSupportPhone] = useState(activeAffiliate?.supportPhone || '');
  const [hidePoweredBy, setHidePoweredBy] = useState(Boolean(activeAffiliate?.hidePoweredBy));
  const [selectedLogoPreset, setSelectedLogoPreset] = useState<string>('✚');
  const [customLogoUrl, setCustomLogoUrl] = useState(activeAffiliate?.logoUrl || '');

  // UI state
  const [activeTab, setActiveTab] = useState<'Identity' | 'Theme' | 'Portal' | 'CSS'>('Identity');
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);

  // Sync form when active affiliate changes
  useEffect(() => {
    if (activeAffiliate) {
      setName(activeAffiliate.name);
      setTagline(activeAffiliate.tagline || 'Doctor-Supervised Telehealth Protocols');
      setPrimaryColor(activeAffiliate.primaryColor || '#173B72');
      setSecondaryColor(activeAffiliate.secondaryColor || '#4FAF4A');
      setHeaderTheme(activeAffiliate.headerTheme || 'navy');
      setFontFamily(activeAffiliate.fontFamily || 'Plus Jakarta Sans');
      setBorderRadius(activeAffiliate.borderRadius || 'rounded-xl');
      setPortalTitle(activeAffiliate.portalTitle || `${activeAffiliate.name} Patient Portal`);
      setWelcomeMessage(activeAffiliate.welcomeMessage || 'Complete your clinical medical evaluation in under 3 minutes.');
      setSupportEmail(activeAffiliate.supportEmail || activeAffiliate.contactEmail);
      setSupportPhone(activeAffiliate.supportPhone || activeAffiliate.contactPhone);
      setHidePoweredBy(Boolean(activeAffiliate.hidePoweredBy));
      setCustomLogoUrl(activeAffiliate.logoUrl || '');
    }
  }, [currentAffId, activeAffiliate]);

  if (!activeAffiliate) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-[#E4E7EC]">
        <p className="text-xs text-[#667085]">No affiliate clinics found to customize.</p>
      </div>
    );
  }

  // Handle Save
  const handleSave = () => {
    const updated: Affiliate = {
      ...activeAffiliate,
      name,
      tagline,
      primaryColor,
      secondaryColor,
      headerTheme,
      fontFamily,
      borderRadius,
      portalTitle,
      welcomeMessage,
      supportEmail,
      supportPhone,
      hidePoweredBy,
      logoUrl: customLogoUrl || undefined
    };

    onSaveAffiliateBranding(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Handle Reset to Default
  const handleReset = () => {
    setName(activeAffiliate.name);
    setTagline('Physician-Supervised Weight Loss & Longevity');
    setPrimaryColor('#173B72');
    setSecondaryColor('#4FAF4A');
    setHeaderTheme('navy');
    setFontFamily('Plus Jakarta Sans');
    setBorderRadius('rounded-xl');
    setHidePoweredBy(false);
  };

  // Handle Copy JSON config
  const handleCopyJson = () => {
    const config = {
      affiliateId: activeAffiliate.id,
      name,
      domain: activeAffiliate.domain,
      primaryColor,
      secondaryColor,
      headerTheme,
      fontFamily,
      borderRadius,
      portalTitle,
      hidePoweredBy,
      supportEmail,
      supportPhone
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  // Sample featured GLP-1 product for live preview
  const sampleProduct = products[0] || {
    id: 'prod-01',
    name: 'Compounded Semaglutide + B12',
    basePrice: 149,
    category: 'Medical Program'
  };

  const sampleRetailPrice = Math.round(
    sampleProduct.basePrice * (1 + activeAffiliate.defaultMarkup / 100)
  );

  return (
    <div className="space-y-6 pb-12" id="branding-view-container">
      {/* Top Affiliate Selector Bar */}
      <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs transition-colors"
            style={{ backgroundColor: primaryColor }}
          >
            {selectedLogoPreset || name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#172033]">White-Label Branding Studio</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#EAF6E7] text-[#2E9B4B]">
                Live Preview
              </span>
            </div>
            <p className="text-xs text-[#667085]">
              Customize clinic storefront, intake design, CSS tokens, and patient portal styling
            </p>
          </div>
        </div>

        {/* Affiliate Clinic Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#344054] whitespace-nowrap">
            Selected Clinic:
          </span>
          <select
            value={currentAffId}
            onChange={(e) => setCurrentAffId(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-[#F8F9FC] border border-[#D0D5DD] rounded-xl text-[#173B72] focus:outline-hidden focus:border-[#173B72]"
          >
            {affiliates.map((aff) => (
              <option key={aff.id} value={aff.id}>
                {aff.name} ({aff.domain})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Studio Grid: Left Config Panel, Right Live Storefront Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Controls & Settings (7 Cols on XL) */}
        <div className="xl:col-span-6 bg-white rounded-xl border border-[#E4E7EC] shadow-xs overflow-hidden flex flex-col">
          {/* Subtabs */}
          <div className="flex border-b border-[#E4E7EC] bg-[#F8F9FC] px-4 overflow-x-auto gap-2">
            {(
              [
                { id: 'Identity', label: '1. Brand Identity' },
                { id: 'Theme', label: '2. Colors & Style' },
                { id: 'Portal', label: '3. Patient Intake' },
                { id: 'CSS', label: '4. CSS Tokens & Code' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#173B72] text-[#173B72] bg-white'
                    : 'border-transparent text-[#667085] hover:text-[#172033]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-280px)]">
            {/* TAB 1: BRAND IDENTITY */}
            {activeTab === 'Identity' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#344054]">
                    Clinic Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#D0D5DD] rounded-xl text-[#172033] focus:outline-hidden focus:border-[#173B72]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#344054]">
                    Brand Tagline & Medical Focus
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Physician-Supervised Weight Loss & Longevity"
                    className="w-full px-3.5 py-2.5 text-xs border border-[#D0D5DD] rounded-xl text-[#172033] focus:outline-hidden focus:border-[#173B72]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#344054]">
                    Custom Clinic Logo Icon
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {LOGO_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setSelectedLogoPreset(preset.icon)}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all ${
                          selectedLogoPreset === preset.icon
                            ? 'bg-[#173B72] text-white border-[#173B72] shadow-xs'
                            : 'bg-[#F8F9FC] text-[#344054] border-[#D0D5DD] hover:bg-[#F2F4F7]'
                        }`}
                      >
                        <span className="text-sm">{preset.icon}</span>
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#344054]">
                    Logo Image URL (Optional SVG / PNG)
                  </label>
                  <input
                    type="text"
                    value={customLogoUrl}
                    onChange={(e) => setCustomLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.svg"
                    className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#D0D5DD] rounded-xl text-[#172033] focus:outline-hidden focus:border-[#173B72]"
                  />
                  <p className="text-[11px] text-[#667085]">
                    Leave blank to render the high-resolution vector glyph selected above.
                  </p>
                </div>

                <div className="p-4 bg-[#F8F9FC] rounded-xl border border-[#E4E7EC] space-y-2 text-xs text-[#667085]">
                  <p className="font-semibold text-[#172033]">Assigned Hostnames:</p>
                  <p>
                    <strong>Primary Domain:</strong>{' '}
                    <span className="font-mono text-[#2D82C4] font-semibold">{activeAffiliate.domain}</span>
                  </p>
                  <p>
                    <strong>Internal Subdomain:</strong>{' '}
                    <span className="font-mono text-[#173B72] font-semibold">{activeAffiliate.subdomain}</span>
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: COLORS & STYLE */}
            {activeTab === 'Theme' && (
              <div className="space-y-5">
                {/* Palette Quick-Presets */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#344054]">
                    Curated Medical Color Schemes
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {COLOR_PALETTES.map((pal) => (
                      <button
                        key={pal.name}
                        type="button"
                        onClick={() => {
                          setPrimaryColor(pal.primary);
                          setSecondaryColor(pal.secondary);
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          primaryColor === pal.primary
                            ? 'border-[#173B72] ring-2 ring-[#173B72]/20 bg-white'
                            : 'border-[#E4E7EC] hover:bg-[#F8F9FC]'
                        }`}
                      >
                        <div className="flex -space-x-1">
                          <div
                            className="w-4 h-4 rounded-full border border-white"
                            style={{ backgroundColor: pal.primary }}
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-white"
                            style={{ backgroundColor: pal.secondary }}
                          />
                        </div>
                        <span className="text-xs font-medium text-[#172033] truncate">
                          {pal.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary & Secondary Color Pickers */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#344054]">
                      Primary Brand Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-9 h-9 rounded-lg border border-[#D0D5DD] cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono border border-[#D0D5DD] rounded-xl text-[#172033]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#344054]">
                      Accent / Success Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-9 h-9 rounded-lg border border-[#D0D5DD] cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono border border-[#D0D5DD] rounded-xl text-[#172033]"
                      />
                    </div>
                  </div>
                </div>

                {/* Header Style Theme */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#344054]">
                    Patient Portal Header Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'navy', label: 'Brand Navy' },
                      { id: 'white', label: 'Clean White' },
                      { id: 'dark', label: 'Dark Charcoal' }
                    ].map((thm) => (
                      <button
                        key={thm.id}
                        type="button"
                        onClick={() => setHeaderTheme(thm.id as any)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                          headerTheme === thm.id
                            ? 'bg-[#173B72] text-white border-[#173B72]'
                            : 'bg-white text-[#344054] border-[#D0D5DD] hover:bg-[#F8F9FC]'
                        }`}
                      >
                        {thm.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography Font */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#344054]">
                    Typography Font Family
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        'Plus Jakarta Sans',
                        'Inter',
                        'Outfit',
                        'DM Sans'
                      ] as const
                    ).map((font) => (
                      <button
                        key={font}
                        type="button"
                        onClick={() => setFontFamily(font)}
                        className={`py-2 px-3 text-xs font-medium rounded-xl border text-left flex items-center justify-between ${
                          fontFamily === font
                            ? 'bg-[#EAF4FB] text-[#173B72] border-[#2D82C4] font-semibold'
                            : 'bg-white text-[#344054] border-[#D0D5DD]'
                        }`}
                      >
                        <span style={{ fontFamily: font }}>{font}</span>
                        {fontFamily === font && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Button & Card Border Radius */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#344054]">
                    Button & Container Corner Radius
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'rounded-md', label: 'Crisp (6px)' },
                      { id: 'rounded-lg', label: 'Standard (8px)' },
                      { id: 'rounded-xl', label: 'Modern (12px)' },
                      { id: 'rounded-full', label: 'Pill Shape' }
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setBorderRadius(r.id as any)}
                        className={`py-2 px-2 text-[11px] font-semibold rounded-xl border text-center ${
                          borderRadius === r.id
                            ? 'bg-[#173B72] text-white border-[#173B72]'
                            : 'bg-white text-[#344054] border-[#D0D5DD] hover:bg-[#F8F9FC]'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PATIENT INTAKE & SUPPORT */}
            {activeTab === 'Portal' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#344054]">
                    Intake Page Headline
                  </label>
                  <input
                    type="text"
                    value={portalTitle}
                    onChange={(e) => setPortalTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#D0D5DD] rounded-xl text-[#172033]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#344054]">
                    Intake Description / Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-[#D0D5DD] rounded-xl text-[#172033]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#344054]">
                      Patient Support Email
                    </label>
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-[#D0D5DD] rounded-xl text-[#172033]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#344054]">
                      Patient Support Phone
                    </label>
                    <input
                      type="text"
                      value={supportPhone}
                      onChange={(e) => setSupportPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-[#D0D5DD] rounded-xl text-[#172033]"
                    />
                  </div>
                </div>

                {/* White-Label Badge Toggle */}
                <div className="p-4 bg-[#F8F9FC] rounded-xl border border-[#E4E7EC] space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hidePoweredBy}
                      onChange={(e) => setHidePoweredBy(e.target.checked)}
                      className="mt-1 rounded border-[#D0D5DD] text-[#173B72] focus:ring-[#173B72]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#172033]">
                        Hide "Powered by LeanBloom" Badge (100% Unbranded)
                      </span>
                      <p className="text-[11px] text-[#667085] mt-0.5">
                        Removes all platform watermarks and back-links from patient intake forms and invoices.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 4: CSS TOKENS & EMBED */}
            {activeTab === 'CSS' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#344054]">
                    Generated CSS Variables
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="text-[11px] text-[#173B72] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedConfig ? 'Copied!' : 'Copy Config JSON'}
                  </button>
                </div>

                <pre className="p-4 bg-[#172033] text-[#A6C8E0] rounded-xl text-xs font-mono overflow-x-auto">
{`:root {
  --brand-primary: ${primaryColor};
  --brand-secondary: ${secondaryColor};
  --brand-font: '${fontFamily}', sans-serif;
  --brand-radius: ${
    borderRadius === 'rounded-full' ? '9999px' : borderRadius === 'rounded-xl' ? '12px' : '8px'
  };
  --clinic-name: "${name}";
  --clinic-domain: "${activeAffiliate.domain}";
}`}
                </pre>
                <p className="text-[11px] text-[#667085]">
                  These CSS custom properties are automatically compiled and injected into the affiliate's edge reverse proxy.
                </p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-[#E4E7EC] bg-[#F8F9FC] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 text-xs font-semibold text-[#667085] hover:text-[#172033] hover:bg-white rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {savedSuccess && (
                <span className="text-xs font-semibold text-[#2E9B4B] flex items-center gap-1 animate-in fade-in">
                  <Check className="w-4 h-4" /> Published to Edge!
                </span>
              )}

              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save & Publish Changes</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Interactive Patient Portal Storefront Preview (5 Cols on XL) */}
        <div className="xl:col-span-6 space-y-3">
          {/* Preview Header with Device Viewport Toggle */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#172033]">
              <Eye className="w-4 h-4 text-[#173B72]" />
              <span>Patient Experience Preview (Live)</span>
            </div>

            <div className="flex items-center bg-white border border-[#D0D5DD] rounded-xl p-0.5 shadow-xs">
              <button
                type="button"
                onClick={() => setPreviewViewport('desktop')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  previewViewport === 'desktop'
                    ? 'bg-[#173B72] text-white'
                    : 'text-[#667085] hover:text-[#172033]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport('mobile')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  previewViewport === 'mobile'
                    ? 'bg-[#173B72] text-white'
                    : 'text-[#667085] hover:text-[#172033]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Device Mockup Canvas */}
          <div
            className={`mx-auto transition-all duration-300 ${
              previewViewport === 'mobile'
                ? 'max-w-sm rounded-[36px] border-[10px] border-[#1F2937] shadow-2xl p-2 bg-[#1F2937]'
                : 'w-full rounded-2xl border border-[#D0D5DD] shadow-xl bg-white overflow-hidden'
            }`}
          >
            {/* Desktop Browser Bar (Only on desktop preview) */}
            {previewViewport === 'desktop' && (
              <div className="bg-[#F2F4F7] px-4 py-2 border-b border-[#E4E7EC] flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-[11px] font-mono text-[#667085] flex items-center gap-1.5 border border-[#D0D5DD]/70 truncate shadow-2xs">
                  <Lock className="w-3 h-3 text-[#2E9B4B] flex-shrink-0" />
                  <span className="text-[#172033] font-semibold">https://{activeAffiliate.domain}</span>
                  <span className="text-[#98A2B3]">/intake/consultation</span>
                </div>
              </div>
            )}

            {/* Mobile Status Bar (Only on mobile preview) */}
            {previewViewport === 'mobile' && (
              <div className="px-4 py-1.5 text-[10px] font-semibold text-white flex items-center justify-between">
                <span>9:41 AM</span>
                <div className="w-16 h-3 bg-black rounded-full" />
                <span>5G 100%</span>
              </div>
            )}

            {/* Rendered Patient Storefront Canvas */}
            <div
              className={`bg-white text-[#172033] overflow-hidden flex flex-col ${
                previewViewport === 'mobile' ? 'rounded-[26px]' : ''
              }`}
              style={{ fontFamily }}
            >
              {/* Patient Storefront Header */}
              <div
                className={`px-4 py-3 flex items-center justify-between border-b ${
                  headerTheme === 'navy'
                    ? 'bg-[#173B72] text-white border-transparent'
                    : headerTheme === 'dark'
                    ? 'bg-[#121824] text-white border-transparent'
                    : 'bg-white text-[#172033] border-[#E4E7EC]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {selectedLogoPreset}
                  </div>
                  <div>
                    <h1 className="text-xs font-bold tracking-tight">{name}</h1>
                    <span className="text-[10px] opacity-75 block -mt-0.5">Telehealth Clinic</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-semibold hidden sm:inline opacity-90">Programs</span>
                  <button
                    type="button"
                    className={`px-2.5 py-1 font-semibold text-[11px] ${borderRadius} transition-all`}
                    style={{ backgroundColor: primaryColor, color: '#FFFFFF' }}
                  >
                    Patient Login
                  </button>
                </div>
              </div>

              {/* Patient Intake Hero */}
              <div className="p-5 bg-gradient-to-b from-[#F8F9FC] to-white border-b border-[#F2F4F7] text-center space-y-2">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF6E7] text-[#2E9B4B] border border-[#4FAF4A]/30">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Licensed Medical Prescribers</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#172033] leading-snug">
                  {portalTitle || `${name} Patient Care`}
                </h2>
                <p className="text-xs text-[#667085] max-w-sm mx-auto">
                  {welcomeMessage}
                </p>
              </div>

              {/* Featured Treatment Card (Live affiliate price calculation) */}
              <div className="p-5 space-y-4">
                <div className="p-4 rounded-xl border border-[#E4E7EC] bg-white shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#2D82C4] uppercase tracking-wider">
                        Doctor-Supervised Therapy
                      </span>
                      <h3 className="text-sm font-bold text-[#172033]">
                        {sampleProduct.name}
                      </h3>
                      <p className="text-[11px] text-[#667085] mt-0.5">
                        Weekly subcutaneous injection • Tailored titration
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#667085] block">Affiliate Retail</span>
                      <span
                        className="text-base font-bold font-mono"
                        style={{ color: primaryColor }}
                      >
                        ${sampleRetailPrice}
                      </span>
                      <span className="text-[10px] text-[#667085]"> / month</span>
                    </div>
                  </div>

                  {/* Bullet perks */}
                  <div className="space-y-1 text-[11px] text-[#344054]">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2E9B4B]" />
                      <span>Free medical provider asynchronous review</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2E9B4B]" />
                      <span>Direct shipping from 503A compounding pharmacy</span>
                    </div>
                  </div>

                  {/* CTA Button with live styles */}
                  <button
                    type="button"
                    className={`w-full py-2.5 text-xs font-bold text-white shadow-xs flex items-center justify-center gap-1.5 transition-all ${borderRadius}`}
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span>Start Medical Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Patient Assurance Badges */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-[#667085] pt-1">
                  <div className="p-2 bg-[#F8F9FC] rounded-lg">
                    <Stethoscope className="w-3.5 h-3.5 mx-auto mb-1 text-[#173B72]" />
                    <span className="block font-semibold text-[#172033]">Board Certified</span>
                    <span>MD / DO Providers</span>
                  </div>
                  <div className="p-2 bg-[#F8F9FC] rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5 mx-auto mb-1 text-[#2E9B4B]" />
                    <span className="block font-semibold text-[#172033]">HIPAA Compliant</span>
                    <span>256-bit Encrypted</span>
                  </div>
                  <div className="p-2 bg-[#F8F9FC] rounded-lg">
                    <Award className="w-3.5 h-3.5 mx-auto mb-1 text-[#2D82C4]" />
                    <span className="block font-semibold text-[#172033]">503A Pharmacy</span>
                    <span>Verified Dispensary</span>
                  </div>
                </div>
              </div>

              {/* Patient Storefront Footer */}
              <div className="p-4 bg-[#F8F9FC] border-t border-[#E4E7EC] text-center text-[10px] text-[#667085] space-y-1.5">
                <p>
                  Questions? Reach clinical support at{' '}
                  <span className="font-semibold text-[#172033]">{supportEmail}</span>
                </p>
                <div className="flex items-center justify-center gap-2 text-[#98A2B3]">
                  <span>Privacy Policy</span>
                  <span>•</span>
                  <span>Terms of Telehealth</span>
                  <span>•</span>
                  <span>Consent</span>
                </div>

                {/* Toggleable "Powered by LeanBloom" */}
                {!hidePoweredBy && (
                  <div className="pt-2 border-t border-[#E4E7EC]/60 text-[10px] text-[#98A2B3] flex items-center justify-center gap-1">
                    <span>Powered by</span>
                    <span className="font-bold text-[#173B72]">LeanBloom Health</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
