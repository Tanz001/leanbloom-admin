import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, LogOut, Settings, Menu } from 'lucide-react';
import { PageView, NotificationItem } from '../../types';

interface HeaderProps {
  currentView: PageView;
  currentUser: { name: string; email: string; role: string };
  onNavigate: (view: PageView) => void;
  onToggleMobileSidebar: () => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onLogout: () => void;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'A';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onNavigate,
  onToggleMobileSidebar,
  notifications,
  onOpenNotifications,
  onLogout,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/75 backdrop-blur-xl border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 -ml-1 text-[#5B6B7C] hover:text-[#0B2440] hover:bg-[#EEF3F8] rounded-xl transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <p className="hidden sm:block text-[13px] font-medium text-[#6B7C8F] ml-1">
          Master Admin
        </p>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2.5 text-[#5B6B7C] hover:text-[#2D82C4] hover:bg-[#EAF4FB] rounded-xl transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" strokeWidth={1.75} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#4FAF4A] ring-2 ring-white" />
          )}
        </button>

        <div className="w-px h-6 bg-[#E2E8F0] mx-1" />

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 sm:pl-1 sm:pr-2.5 rounded-xl hover:bg-[#EEF3F8] transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-lb-gradient text-white flex items-center justify-center text-[12px] font-semibold font-display shadow-sm">
              {initials(currentUser.name || 'Admin')}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-semibold text-[#0B2440] leading-tight max-w-[140px] truncate font-display">
                {currentUser.name || 'Admin'}
              </p>
              <p className="text-[11px] text-[#3A8F36] font-semibold leading-tight mt-0.5">
                Super Admin
              </p>
            </div>
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-[#8A96A6]" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_16px_48px_rgba(15,28,46,0.12)] py-1.5 z-40 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#F0F3F7]">
                <p className="text-sm font-semibold text-[#0B2440] truncate font-display">
                  {currentUser.name}
                </p>
                <p className="text-[13px] text-[#6B7C8F] truncate mt-0.5">
                  {currentUser.email}
                </p>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('settings');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-[13.5px] font-medium text-[#4A5A6A] hover:bg-[#F5F8FB] flex items-center gap-2.5"
                >
                  <Settings className="w-4 h-4 text-[#8A96A6]" />
                  Settings
                </button>
              </div>
              <div className="border-t border-[#F0F3F7] pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2.5 text-[13.5px] font-medium text-[#B91C1C] hover:bg-[#FEF2F2] flex items-center gap-2.5"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
