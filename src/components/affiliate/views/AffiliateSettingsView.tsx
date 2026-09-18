import React, { useState } from 'react';
import {
  User,
  Building2,
  CreditCard,
  Bell,
  Shield,
  Save,
  CheckCircle2,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { AffiliateProfile } from '../../../types';

interface AffiliateSettingsViewProps {
  affiliateProfile: AffiliateProfile;
  onUpdateProfile: (updated: Partial<AffiliateProfile>) => void;
}

export const AffiliateSettingsView: React.FC<AffiliateSettingsViewProps> = ({
  affiliateProfile,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'business' | 'payout' | 'notifications' | 'security'
  >('profile');

  // Profile form state
  const [name, setName] = useState(affiliateProfile.name);
  const [email, setEmail] = useState(affiliateProfile.email);
  const [phone, setPhone] = useState(affiliateProfile.phone);
  const [website, setWebsite] = useState(affiliateProfile.website);

  // Business form state
  const [businessName, setBusinessName] = useState(affiliateProfile.businessName);
  const [businessEmail, setBusinessEmail] = useState(affiliateProfile.businessEmail);
  const [businessPhone, setBusinessPhone] = useState(affiliateProfile.businessPhone);
  const [businessAddress, setBusinessAddress] = useState(affiliateProfile.businessAddress);

  // Notifications state
  const [notifications, setNotifications] = useState({
    ...affiliateProfile.notificationPreferences
  });

  // Security state
  const [twoFactor, setTwoFactor] = useState(affiliateProfile.twoFactorEnabled);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Save banner
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      email,
      phone,
      website,
      businessName,
      businessEmail,
      businessPhone,
      businessAddress,
      notificationPreferences: notifications,
      twoFactorEnabled: twoFactor
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#172033] tracking-tight">Affiliate Settings</h1>
        <p className="text-xs text-[#667085] mt-1">
          Manage your account profile, white-label clinic details, banking payouts, and security.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-[#EAF5EA] text-[#4A9B52] border border-[#4A9B52]/30 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings successfully saved and synchronized.</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-[#174A87] text-white shadow-xs'
              : 'text-[#667085] hover:text-[#172033] hover:bg-[#F7F9FC]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile</span>
        </button>
        <button
          onClick={() => setActiveTab('business')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'business'
              ? 'bg-[#174A87] text-white shadow-xs'
              : 'text-[#667085] hover:text-[#172033] hover:bg-[#F7F9FC]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Business Information</span>
        </button>
        <button
          onClick={() => setActiveTab('payout')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'payout'
              ? 'bg-[#174A87] text-white shadow-xs'
              : 'text-[#667085] hover:text-[#172033] hover:bg-[#F7F9FC]'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payout Information</span>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-[#174A87] text-white shadow-xs'
              : 'text-[#667085] hover:text-[#172033] hover:bg-[#F7F9FC]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notifications</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-[#174A87] text-white shadow-xs'
              : 'text-[#667085] hover:text-[#172033] hover:bg-[#F7F9FC]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security & 2FA</span>
        </button>
      </div>

      {/* Settings Forms Card */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="p-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-4">
              <h3 className="text-sm font-bold text-[#172033]">Partner Account Profile</h3>
              <p className="text-xs text-[#667085]">
                Primary contact details for affiliate communications and statements
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Affiliate Entity / Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Account Contact Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Telephone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Storefront Domain / Custom Host
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
              </div>
            </div>

            <div className="p-4 bg-[#F7F9FC] rounded-xl border border-[#E5E7EB] text-xs text-[#667085] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#172033] block">Contracted Commission Rate</span>
                <span>Calculated on every patient checkout via LeanBloom white-label system</span>
              </div>
              <span className="text-base font-black text-[#174A87] bg-white px-3 py-1.5 rounded-lg border border-[#E5E7EB]">
                {affiliateProfile.commissionRate}% Gross Sales
              </span>
            </div>
          </div>
        )}

        {/* Business Tab */}
        {activeTab === 'business' && (
          <div className="p-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-4">
              <h3 className="text-sm font-bold text-[#172033]">Legal Business Entity</h3>
              <p className="text-xs text-[#667085]">
                Corporate identity for IRS 1099 tax compliance and legal agreements
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Registered Corporate Entity Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Business Billing Email
                </label>
                <input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Corporate Phone
                </label>
                <input
                  type="tel"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Jurisdiction / Country
                </label>
                <input
                  type="text"
                  disabled
                  value={affiliateProfile.country}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl bg-[#F7F9FC] text-[#667085]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Headquarters Physical Street Address
                </label>
                <input
                  type="text"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Payout Tab */}
        {activeTab === 'payout' && (
          <div className="p-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-4">
              <h3 className="text-sm font-bold text-[#172033]">Payout & Banking Information</h3>
              <p className="text-xs text-[#667085]">
                Masked banking coordinates used for bi-monthly automated ACH commission disbursements
              </p>
            </div>

            <div className="p-4 bg-[#EAF5EA]/50 rounded-2xl border border-[#4A9B52]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#4A9B52] flex items-center justify-center border border-[#4A9B52]/20">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#172033]">
                    Active Method: {affiliateProfile.payoutMethod}
                  </h4>
                  <p className="text-[11px] text-[#667085]">
                    {affiliateProfile.bankName} • Account ending in {affiliateProfile.accountNumberMasked}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-bold text-[#4A9B52] bg-white rounded-lg border border-[#4A9B52]/20">
                Verified Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Depository Bank Institution
                </label>
                <input
                  type="text"
                  disabled
                  value={affiliateProfile.bankName}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl bg-[#F7F9FC] text-[#667085]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Account Beneficiary Name
                </label>
                <input
                  type="text"
                  disabled
                  value={affiliateProfile.accountHolderName}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl bg-[#F7F9FC] text-[#667085]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  ACH Routing Number
                </label>
                <input
                  type="text"
                  disabled
                  value={affiliateProfile.routingNumberMasked}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl bg-[#F7F9FC] text-[#667085] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Checking Account Number
                </label>
                <input
                  type="text"
                  disabled
                  value={affiliateProfile.accountNumberMasked}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl bg-[#F7F9FC] text-[#667085] font-mono"
                />
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                To modify banking coordinates or swap to international wire/PayPal, contact your
                LeanBloom Partner Support Manager for identity verification and anti-fraud approval.
              </span>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="p-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-4">
              <h3 className="text-sm font-bold text-[#172033]">Notification Preferences</h3>
              <p className="text-xs text-[#667085]">
                Configure real-time alerts and automated weekly reporting emails
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: 'newOrders',
                  title: 'New Patient Order Alerts',
                  desc: 'Instant email alert whenever a referred patient purchases a prescription or wellness pack'
                },
                {
                  key: 'commissions',
                  title: 'Commission Ledger Updates',
                  desc: 'Notification when commissions are approved following clinical provider intake clearance'
                },
                {
                  key: 'payments',
                  title: 'Disbursement & Payout Receipts',
                  desc: 'Email confirmation when bi-monthly ACH funds are transmitted to your depository account'
                },
                {
                  key: 'weeklySummary',
                  title: 'Weekly Performance Digest',
                  desc: 'Summary report of referral traffic, top converting products, and weekly gross revenue'
                },
                {
                  key: 'marketing',
                  title: 'LeanBloom Platform Updates & SKUs',
                  desc: 'Announcements regarding new compounding formulas, peptides, and wholesale price drops'
                }
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3.5 bg-[#F7F9FC] rounded-xl border border-[#E5E7EB]"
                >
                  <div className="pr-4">
                    <h4 className="text-xs font-bold text-[#172033]">{item.title}</h4>
                    <p className="text-[11px] text-[#667085]">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={
                        notifications[item.key as keyof typeof affiliateProfile.notificationPreferences]
                      }
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          [item.key]: e.target.checked
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B52]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="p-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-4">
              <h3 className="text-sm font-bold text-[#172033]">Security & Multi-Factor Auth</h3>
              <p className="text-xs text-[#667085]">
                Protect your partner dashboard credentials and monitor login sessions
              </p>
            </div>

            {/* 2FA Toggle */}
            <div className="p-4 bg-[#F7F9FC] rounded-2xl border border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#174A87] flex items-center justify-center border border-[#E5E7EB]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#172033]">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-[#667085]">
                    Require a 6-digit TOTP code (Google Authenticator / 1Password) on sign-in
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={(e) => setTwoFactor(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B52]"></div>
              </label>
            </div>

            {/* Change Password */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                Change Dashboard Password
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                  />
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div className="p-4 bg-[#F7F9FC] rounded-xl border border-[#E5E7EB] text-xs space-y-1">
              <span className="font-bold text-[#172033] block">Active Session Telemetry</span>
              <p className="text-[#667085]">
                Current Session IP: <strong>{affiliateProfile.lastLoginIp}</strong>
              </p>
              <p className="text-[#667085]">
                Last Login: <strong>{affiliateProfile.lastLoginTime}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Footer with Save Button */}
        <div className="px-6 py-4 bg-[#F7F9FC] border-t border-[#E5E7EB] flex items-center justify-between">
          <span className="text-xs text-[#667085]">
            Changes are isolated to your affiliate account: {affiliateProfile.id}
          </span>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-[#174A87] hover:bg-[#123B70] rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
