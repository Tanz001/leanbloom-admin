import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2, Lock } from 'lucide-react';
import { AffiliateProfile } from '../../../types';
import {
  authApi,
  mapApiUserToAppRole,
  saveAuthSession,
  type AppUser,
} from '../../../lib/api';

interface AffiliateSettingsViewProps {
  affiliateProfile: AffiliateProfile;
  accountUser: AppUser;
  onUpdateProfile: (updated: Partial<AffiliateProfile>) => void;
  onAccountUpdated: (user: AppUser) => void;
}

export const AffiliateSettingsView: React.FC<AffiliateSettingsViewProps> = ({
  accountUser,
  onUpdateProfile,
  onAccountUpdated,
}) => {
  const [accountName, setAccountName] = useState(accountUser.name);
  const [phone, setPhone] = useState(affiliateProfile.phone);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Hidden for now: business, payout, notifications, and extra security options.

  useEffect(() => {
    setAccountName(accountUser.name);
  }, [accountUser.name]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    setSaving(true);

    try {
      const trimmed = accountName.trim();
      if (trimmed.length < 2) {
        throw new Error('Display name must be at least 2 characters');
      }
      const result = await authApi.updateProfile(trimmed);
      const mapped = mapApiUserToAppRole(result.user);
      saveAuthSession(result.token, mapped);
      onAccountUpdated(mapped);
      onUpdateProfile({ phone });

      const changingPassword =
        currentPassword || newPassword || confirmPassword;
      if (changingPassword) {
        if (newPassword.length < 8) {
          throw new Error('New password must be at least 8 characters');
        }
        if (newPassword !== confirmPassword) {
          throw new Error('New password and confirmation do not match');
        }
        await authApi.changePassword(currentPassword, newPassword);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-[#172033] tracking-tight">
          Settings
        </h1>
        <p className="text-xs text-[#667085] mt-1">
          Update your name, phone, and password.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-[#EAF5EA] text-[#4A9B52] border border-[#4A9B52]/30 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile saved.</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-xs font-semibold">
          {saveError}
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs overflow-hidden"
      >
        <div className="p-6 space-y-6">
          <div className="border-b border-[#E5E7EB] pb-4">
            <h3 className="text-sm font-bold text-[#172033]">Profile</h3>
            <p className="text-xs text-[#667085]">
              Your login name and contact phone. Email cannot be changed here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Display name
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Account email
              </label>
              <input
                type="email"
                value={accountUser.email}
                readOnly
                disabled
                className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl bg-[#F7F9FC] text-[#667085] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
              />
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Change password
            </h4>
            <p className="text-[11px] text-[#667085]">
              Leave these blank if you only want to update your name or phone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Current password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  New password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#F7F9FC] border-t border-[#E5E7EB] flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-xs font-bold text-white bg-[#174A87] hover:bg-[#123B70] rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving…' : 'Save profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
