import React, { useState } from 'react';
import {
  Bell,
  ShieldCheck,
  Settings,
  Plus,
  Lock,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Key,
  Shield,
  Palette
} from 'lucide-react';
import { NotificationItem, AdminUser } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface SystemViewProps {
  initialSub?: 'notifications' | 'users-roles' | 'settings';
  notifications: NotificationItem[];
  users: AdminUser[];
  onMarkNotificationRead: (id: string) => void;
  onAddUser: (user: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => void;
}

export const SystemView: React.FC<SystemViewProps> = ({
  initialSub = 'settings',
  notifications,
  users,
  onMarkNotificationRead,
  onAddUser
}) => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'users-roles' | 'settings'>(
    initialSub
  );

  const [settingsSection, setSettingsSection] = useState<'General' | 'Branding' | 'Security' | 'Domains'>('General');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminUser['role']>('Admin');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    onAddUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'Active'
    });
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
  };

  return (
    <div className="space-y-6 pb-12" id="system-view-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-[#E4E7EC] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">System</h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Admin users, notifications, and platform settings.
          </p>
        </div>

        <div className="flex items-center bg-[#F2F4F7] p-1 rounded-lg border border-[#E4E7EC] overflow-x-auto self-start sm:self-auto">
          {(
            [
              { id: 'notifications', label: 'Notifications' },
              { id: 'users-roles', label: 'Admin Users' },
              { id: 'settings', label: 'Platform Settings' }
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-white text-[#173B72] shadow-xs font-bold'
                  : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. NOTIFICATIONS CENTER (Prompt #25)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
            <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#173B72]" />
              Platform Event & Alert Stream
            </h3>
            <span className="text-xs text-[#667085]">
              {notifications.filter((n) => !n.read).length} Unread Notifications
            </span>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  notif.read
                    ? 'bg-white border-[#E4E7EC] opacity-80'
                    : 'bg-[#F8F9FC] border-[#2D82C4]/40 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {notif.severity === 'Critical' && <XCircle className="w-5 h-5 text-[#D64545]" />}
                    {notif.severity === 'Warning' && <AlertTriangle className="w-5 h-5 text-[#D99A18]" />}
                    {notif.severity === 'Success' && <CheckCircle2 className="w-5 h-5 text-[#2E9B4B]" />}
                    {notif.severity === 'Information' && <Info className="w-5 h-5 text-[#2D82C4]" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#172033]">{notif.title}</h4>
                      <StatusBadge status={notif.severity} size="sm" />
                      <span className="text-[11px] text-[#667085]">• {notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#344054] mt-1">{notif.description}</p>
                  </div>
                </div>

                {!notif.read && (
                  <button
                    type="button"
                    onClick={() => onMarkNotificationRead(notif.id)}
                    className="text-xs font-semibold text-[#2D82C4] hover:text-[#173B72] whitespace-nowrap self-center"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. USERS & ROLES (Prompt #23)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'users-roles' && (
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
            <div>
              <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#173B72]" />
                Admin Users
              </h3>
              <p className="text-xs text-[#667085]">
                Platform access is limited to Admin and Affiliate roles. Only Admins appear here.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddUserModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Invite Admin
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F9FC] text-[11px] font-bold text-[#667085] uppercase">
                  <th className="py-2.5 px-3">Administrator</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3">Assigned Role</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Last Active</th>
                  <th className="py-2.5 px-3">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F4F7]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F8F9FC]">
                    <td className="py-3 px-3 font-bold text-[#172033]">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#173B72] text-white flex items-center justify-center font-bold text-xs">
                          {u.name.substring(0, 2).toUpperCase()}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#667085]">{u.email}</td>
                    <td className="py-3 px-3 font-semibold text-[#173B72]">
                      <span className="bg-[#EAF4FB] px-2 py-0.5 rounded border border-[#2D82C4]/20">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={u.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-[#667085]">{u.lastLogin}</td>
                    <td className="py-3 px-3 text-[#667085]">{u.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add User Modal */}
          {showAddUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white rounded-xl p-5 w-full max-w-sm border border-[#E4E7EC] shadow-2xl space-y-4">
                <h4 className="text-sm font-bold text-[#172033]">Invite Admin</h4>
                <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-xs font-semibold text-[#344054] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="e.g. Rachel Adams"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D82C4]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#344054] mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="rachel@leanbloom.com"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D82C4]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#344054] mb-1">Role</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as AdminUser['role'])}
                      className="w-full px-3 py-2 border rounded-lg bg-[#F8F9FC] text-[#667085]"
                      disabled
                    >
                      <option value="Admin">Admin</option>
                    </select>
                    <p className="text-[10px] text-[#667085] mt-1">Affiliates are managed from the Affiliates page.</p>
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddUserModal(false)}
                      className="px-3 py-1.5 border rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-[#173B72] text-white font-semibold rounded-lg"
                    >
                      Send Invite
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs space-y-5">
          <div className="flex border-b border-[#E4E7EC] gap-4">
            {(['General', 'Branding', 'Security', 'Domains'] as const).map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSettingsSection(sec)}
                className={`py-2 text-xs font-semibold border-b-2 transition-colors ${
                  settingsSection === sec
                    ? 'border-[#173B72] text-[#173B72]'
                    : 'border-transparent text-[#667085] hover:text-[#172033]'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {settingsSection === 'General' && (
            <div className="space-y-4 text-xs max-w-lg">
              <div>
                <label className="block font-semibold text-[#344054] mb-1">Platform Master Name</label>
                <input
                  type="text"
                  defaultValue="LeanBloom Master Telehealth Platform"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#344054] mb-1">Corporate Support Email</label>
                <input
                  type="email"
                  defaultValue="support@leanbloom.com"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#344054] mb-1">Default Base Currency</label>
                <input
                  type="text"
                  disabled
                  defaultValue="USD ($) - United States Dollar"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <button
                type="button"
                onClick={() => alert('General settings updated successfully.')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#173B72] rounded-lg"
              >
                Save General Settings
              </button>
            </div>
          )}

          {settingsSection === 'Branding' && (
            <div className="space-y-3 text-xs max-w-lg">
              <p className="text-[#667085]">
                Master brand palette adheres to official LeanBloom design system:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border bg-[#173B72] text-white">
                  <p className="font-bold">Primary Navy</p>
                  <p className="font-mono text-[11px]">#173B72</p>
                </div>
                <div className="p-3 rounded-lg border bg-[#2D82C4] text-white">
                  <p className="font-bold">Healthcare Blue</p>
                  <p className="font-mono text-[11px]">#2D82C4</p>
                </div>
                <div className="p-3 rounded-lg border bg-[#4FAF4A] text-white">
                  <p className="font-bold">Natural Green</p>
                  <p className="font-mono text-[11px]">#4FAF4A</p>
                </div>
                <div className="p-3 rounded-lg border bg-white text-[#172033]">
                  <p className="font-bold">Card Canvas</p>
                  <p className="font-mono text-[11px]">#FFFFFF / #F7F9FC</p>
                </div>
              </div>
            </div>
          )}

          {settingsSection === 'Security' && (
            <div className="space-y-3 text-xs max-w-lg">
              <div className="p-3 bg-[#EAF6E7] rounded-lg border border-[#4FAF4A]/30 text-[#2E9B4B] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span>Mandatory Multi-Factor Authentication (2FA) enforced on all child tenants.</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Inactivity Session Timeout:</span>
                <strong>60 Minutes (HIPAA Compliant)</strong>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Password Complexity Entropy:</span>
                <strong>High (12+ Chars, Symbols, Numbers)</strong>
              </div>
            </div>
          )}

          {settingsSection === 'Domains' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#EAF4FB] rounded-lg border border-[#2D82C4]/30 text-[#173B72]">
                Wildcard SSL Route: <code className="font-mono font-bold">*.leanbloom.com</code> automatically routes child affiliates to the isolated multi-tenant proxy.
              </div>
              <p className="text-[#667085]">
                Custom domains point to <code className="font-mono text-[#173B72]">cname.leanbloom.com</code>. DNS certificate propagation latency: &lt; 90 seconds.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
