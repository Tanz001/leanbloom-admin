import React, { useEffect, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, Lock, Save, User } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import {
  authApi,
  mapApiUserToAppRole,
  saveAuthSession,
  type AppUser,
} from '../../lib/api';

interface AdminProfileViewProps {
  currentUser: AppUser;
  onUserUpdated: (user: AppUser) => void;
}

export const AdminProfileView: React.FC<AdminProfileViewProps> = ({
  currentUser,
  onUserUpdated,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    setName(currentUser.name);
  }, [currentUser.name]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileMsg(null);
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setProfileError('Name must be at least 2 characters');
      return;
    }
    setProfileSaving(true);
    try {
      const result = await authApi.updateProfile(trimmed);
      const mapped = mapApiUserToAppRole(result.user);
      saveAuthSession(result.token, mapped);
      onUserUpdated(mapped);
      setProfileMsg('Profile updated');
      setTimeout(() => setProfileMsg(null), 2500);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMsg(null);

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }

    setPasswordSaving(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMsg('Password updated successfully');
      setTimeout(() => setPasswordMsg(null), 2500);
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : 'Failed to change password'
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="My Profile"
        description="Update your display name and password. Email changes are not available yet."
      />

      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-2xl border border-[#ECEEF2] shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#F3F4F6] flex items-center gap-2">
          <User className="w-4 h-4 text-[#2D82C4]" />
          <h2 className="text-sm font-semibold text-[#0F1C2E]">Account details</h2>
        </div>
        <div className="p-6 space-y-4">
          {profileMsg && (
            <div className="p-3 bg-[#EAF5EA] text-[#4A9B52] border border-[#4A9B52]/30 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {profileMsg}
            </div>
          )}
          {profileError && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold">
              {profileError}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Display name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                autoComplete="name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Email
              </label>
              <input
                type="email"
                value={currentUser.email}
                readOnly
                disabled
                className="w-full px-3.5 py-2 text-sm border border-[#E5E7EB] rounded-xl bg-[#F7F9FC] text-[#667085] cursor-not-allowed"
              />
              <p className="mt-1 text-[11px] text-[#9CA3AF]">
                Email cannot be changed here yet.
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-[#F9FAFB] border-t border-[#F3F4F6] flex justify-end">
          <button
            type="submit"
            disabled={profileSaving}
            className="px-5 py-2 text-xs font-bold text-white bg-[#174A87] hover:bg-[#123B70] rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            {profileSaving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </form>

      <form
        onSubmit={handleChangePassword}
        className="bg-white rounded-2xl border border-[#ECEEF2] shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#F3F4F6] flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#2D82C4]" />
          <h2 className="text-sm font-semibold text-[#0F1C2E]">Change password</h2>
        </div>
        <div className="p-6 space-y-4">
          {passwordMsg && (
            <div className="p-3 bg-[#EAF5EA] text-[#4A9B52] border border-[#4A9B52]/30 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {passwordMsg}
            </div>
          )}
          {passwordError && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold">
              {passwordError}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Current password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2 pr-10 text-sm border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#667085]"
                  aria-label={showCurrent ? 'Hide password' : 'Show password'}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                New password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 pr-10 text-sm border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#667085]"
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                autoComplete="new-password"
                required
              />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-[#F9FAFB] border-t border-[#F3F4F6] flex justify-end">
          <button
            type="submit"
            disabled={passwordSaving}
            className="px-5 py-2 text-xs font-bold text-white bg-[#174A87] hover:bg-[#123B70] rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-60"
          >
            <Lock className="w-3.5 h-3.5" />
            {passwordSaving ? 'Updating…' : 'Update password'}
          </button>
        </div>
      </form>
    </div>
  );
};
