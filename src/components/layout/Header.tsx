import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, LogOut, User, Settings, Menu } from 'lucide-react';
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
    <header className="sticky top-0 z-30 h-14 bg-white/80 backdrop-blur-xl border-b border-[#ECEEF2] px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 -ml-1 text-[#6B7280] hover:text-[#0F1C2E] hover:bg-[#F3F4F6] rounded-xl transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
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
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#4FAF4A] ring-2 ring-white" />
          )}
        </button>

        <div className="w-px h-5 bg-[#E5E7EB] mx-0.5" />

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 sm:pl-1 sm:pr-2.5 rounded-xl hover:bg-[#F3F4F6] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-lb-gradient text-white flex items-center justify-center text-[11px] font-semibold font-display shadow-sm">
              {initials(currentUser.name || 'Admin')}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-[#12345F] leading-tight max-w-[120px] truncate font-display">
                {currentUser.name || 'Admin'}
              </p>
              <p className="text-[10px] text-[#4FAF4A] font-medium leading-tight">Admin</p>
            </div>
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-[#9CA3AF]" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#ECEEF2] rounded-2xl shadow-[0_12px_40px_rgba(15,28,46,0.12)] py-1.5 z-40 overflow-hidden">
              <div className="px-3.5 py-3 border-b border-[#F3F4F6]">
                <p className="text-sm font-medium text-[#0F1C2E] truncate font-display">
                  {currentUser.name}
                </p>
                <p className="text-xs text-[#9CA3AF] truncate mt-0.5">
                  {currentUser.email}
                </p>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('profile');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-sm text-[#4B5563] hover:bg-[#F9FAFB] flex items-center gap-2.5"
                >
                  <User className="w-4 h-4 text-[#9CA3AF]" />
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('settings');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-sm text-[#4B5563] hover:bg-[#F9FAFB] flex items-center gap-2.5"
                >
                  <Settings className="w-4 h-4 text-[#9CA3AF]" />
                  Settings
                </button>
              </div>
              <div className="border-t border-[#F3F4F6] pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-sm text-[#B91C1C] hover:bg-[#FEF2F2] flex items-center gap-2.5"
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
