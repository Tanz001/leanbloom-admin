import React, { useEffect, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, Lock, Save, Shield, User } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import {
  authApi,
  mapApiUserToAppRole,
  saveAuthSession,
  type AppUser,
} from '../../lib/api';
import { useToast } from '../ui/Toast';

interface AdminProfileViewProps {
  currentUser: AppUser;
  onUserUpdated: (user: AppUser) => void;
}

export const AdminProfileView: React.FC<AdminProfileViewProps> = ({
  currentUser,
  onUserUpdated,
}) => {
  const toast = useToast();
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
      toast.success('Profile updated');
      setTimeout(() => setProfileMsg(null), 2500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      setProfileError(msg);
      toast.error(msg);
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
      toast.success('Password updated');
      setTimeout(() => setPasswordMsg(null), 2500);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to change password';
      setPasswordError(msg);
      toast.error(msg);
    } finally {
      setPasswordSaving(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm border border-[#E4E7EC] rounded-xl text-[#0F1C2E] bg-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#173B72] focus:ring-2 focus:ring-[#173B72]/10';

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      <PageHeader
        title="Settings"
        description="Update your account name and password."
      />

      {/* Account summary */}
      <div className="bg-white rounded-2xl border border-[#ECEEF2] p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#12345F] text-white flex items-center justify-center text-sm font-semibold shrink-0">
          {(currentUser.name || 'A')
            .split(' ')
            .map((p) => p[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#0F1C2E] truncate font-display">
            {currentUser.name || 'Admin'}
          </p>
          <p className="text-xs text-[#6B7280] truncate">{currentUser.email}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0F4FA] text-[#173B72] text-[11px] font-semibold shrink-0">
          <Shield className="w-3 h-3" />
          {currentUser.role || 'Master Admin'}
        </span>
      </div>

      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-2xl border border-[#ECEEF2] overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center gap-2">
          <User className="w-4 h-4 text-[#2D82C4]" />
          <h2 className="text-sm font-semibold text-[#0F1C2E]">Profile</h2>
        </div>
        <div className="p-5 space-y-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#6B7280] mb-1.5">
                Display name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                autoComplete="name"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#6B7280] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={currentUser.email}
                readOnly
                disabled
                className={`${inputClass} bg-[#F7F9FC] text-[#6B7280] cursor-not-allowed`}
              />
              <p className="mt-1.5 text-[11px] text-[#9CA3AF]">
                Email is used for sign-in and cannot be changed here.
              </p>
            </div>
          </div>
        </div>
        <div className="px-5 py-3.5 bg-[#FAFBFC] border-t border-[#F3F4F6] flex justify-end">
          <button
            type="submit"
            disabled={profileSaving}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0F1C2E] hover:bg-[#1A2F4A] rounded-xl transition-colors inline-flex items-center gap-1.5 disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            {profileSaving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </form>

      <form
        onSubmit={handleChangePassword}
        className="bg-white rounded-2xl border border-[#ECEEF2] overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#2D82C4]" />
          <h2 className="text-sm font-semibold text-[#0F1C2E]">Password</h2>
        </div>
        <div className="p-5 space-y-4">
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
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#6B7280] mb-1.5">
              Current password
            </label>
            <div className="relative max-w-md">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`${inputClass} pr-10`}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#6B7280] mb-1.5">
                New password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`${inputClass} pr-10`}
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
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#6B7280] mb-1.5">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                autoComplete="new-password"
                required
              />
            </div>
          </div>
        </div>
        <div className="px-5 py-3.5 bg-[#FAFBFC] border-t border-[#F3F4F6] flex justify-end">
          <button
            type="submit"
            disabled={passwordSaving}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-xl transition-colors inline-flex items-center gap-1.5 disabled:opacity-60"
          >
            <Lock className="w-3.5 h-3.5" />
            {passwordSaving ? 'Updating…' : 'Update password'}
          </button>
        </div>
      </form>
    </div>
  );
};
