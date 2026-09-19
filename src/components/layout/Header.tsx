import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Calendar,
  LogOut,
  User,
  Shield,
  Settings,
  HelpCircle,
  Menu,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { PageView, DateRangeOption, NotificationItem } from '../../types';

interface HeaderProps {
  currentView: PageView;
  dateRange: DateRangeOption;
  onDateRangeChange: (range: DateRangeOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigate: (view: PageView) => void;
  onToggleMobileSidebar: () => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  dateRange,
  onDateRangeChange,
  searchQuery,
  onSearchChange,
  onNavigate,
  onToggleMobileSidebar,
  notifications,
  onOpenNotifications,
  onLogout
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setDateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Title and subtitle mapping
  const titles: Partial<Record<PageView, { title: string; subtitle: string }>> = {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of affiliates, orders, and platform sales.'
    },
    affiliates: {
      title: 'Affiliates',
      subtitle: 'Create, activate, and manage partner accounts.'
    },
    'affiliate-detail': {
      title: 'Affiliate Detail',
      subtitle: 'Branding, customers, orders, and sales for this partner.'
    },
    domains: {
      title: 'Domains',
      subtitle: 'Subdomains and custom domains for affiliate storefronts.'
    },
    branding: {
      title: 'White-Label Branding',
      subtitle: 'Logo, colors, and storefront identity per affiliate.'
    },
    patients: {
      title: 'Customers',
      subtitle: 'Customers across all affiliate storefronts.'
    },
    orders: {
      title: 'Orders',
      subtitle: 'Orders attributed to each affiliate.'
    },
    products: {
      title: 'Products',
      subtitle: 'LeanBloom catalog available to affiliates.'
    },
    pricing: {
      title: 'Pricing',
      subtitle: 'Wholesale floors and affiliate markup rules.'
    },
    commissions: {
      title: 'Commissions',
      subtitle: 'Affiliate earnings from markup and sales.'
    },
    payments: {
      title: 'Payments',
      subtitle: 'Payouts and transaction history.'
    },
    reports: {
      title: 'Reports & Sales',
      subtitle: 'Sales performance across the affiliate network.'
    },
    notifications: {
      title: 'Notifications',
      subtitle: 'Platform alerts and important updates.'
    },
    'users-roles': {
      title: 'Admin Users',
      subtitle: 'Admin accounts with full platform access.'
    },
    settings: {
      title: 'Settings',
      subtitle: 'Global platform preferences.'
    },
    signin: {
      title: 'Sign In',
      subtitle: 'LeanBloom Admin Portal'
    },
    signup: {
      title: 'Sign Up',
      subtitle: 'Create an account'
    }
  };

  const headerInfo = titles[currentView] || {
    title: 'LeanBloom Admin',
    subtitle: 'Master Telehealth Platform'
  };

  const dateOptions: DateRangeOption[] = [
    'Today',
    'This Week',
    'This Month',
    'This Year',
    'Custom Range'
  ];

  return (
    <header
      id="master-top-header"
      className="sticky top-0 z-30 bg-white border-b border-[#E4E7EC] h-18 px-4 sm:px-6 flex items-center justify-between shadow-[0_1px_2px_rgba(16,24,40,0.03)]"
    >
      {/* Left side: Hamburger (Mobile) + Breadcrumb/Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-[#667085] hover:text-[#173B72] hover:bg-[#F2F4F7] rounded-lg transition-colors"
          aria-label="Open sidebar"
          id="mobile-sidebar-toggle-btn"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="truncate">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-[#172033] tracking-tight truncate">
              {headerInfo.title}
            </h1>
            {currentView !== 'dashboard' && (
              <span className="hidden sm:inline-flex text-[11px] font-medium bg-[#EAF4FB] text-[#173B72] px-2 py-0.5 rounded-md border border-[#2D82C4]/20">
                Admin
              </span>
            )}
          </div>
          <p className="hidden md:block text-xs text-[#667085] font-normal truncate mt-0.5">
            {headerInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right side: Search, Date Filter, Notifications, Auth/Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            id="global-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search patients, orders, affiliates..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F7F9FC] border border-[#E4E7EC] rounded-lg text-[#172033] placeholder-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2D82C4]/30 focus:border-[#2D82C4] transition-all"
          />
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative" ref={dateRef}>
          <button
            type="button"
            id="date-filter-dropdown-btn"
            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#344054] bg-white border border-[#E4E7EC] hover:bg-[#F8F9FC] rounded-lg transition-colors shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-[#2D82C4]" />
            <span className="hidden sm:inline">{dateRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
          </button>

          {dateDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-40 bg-white border border-[#E4E7EC] rounded-xl shadow-lg py-1.5 z-40">
              <div className="px-3 py-1 text-[11px] font-semibold text-[#98A2B3] uppercase tracking-wider">
                Filter Period
              </div>
              {dateOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onDateRangeChange(opt);
                    setDateDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#EAF4FB] hover:text-[#173B72] transition-colors ${
                    dateRange === opt ? 'bg-[#EAF4FB] text-[#173B72] font-semibold' : 'text-[#344054]'
                  }`}
                >
                  {opt}
                  {dateRange === opt && <span className="w-1.5 h-1.5 rounded-full bg-[#4FAF4A]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Button */}
        <button
          type="button"
          id="header-notifications-btn"
          onClick={onOpenNotifications}
          className="relative p-2 text-[#667085] hover:text-[#173B72] hover:bg-[#F2F4F7] rounded-lg transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4FAF4A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E9B4B]"></span>
            </span>
          )}
        </button>

        {/* Quick Auth Switcher / Test Button */}
        <div className="hidden xl:flex items-center gap-1 border-l border-[#E4E7EC] pl-2.5">
          <button
            type="button"
            id="quick-switch-signin-btn"
            onClick={() => onNavigate('signin')}
            className="text-[11px] font-medium text-[#667085] hover:text-[#173B72] hover:bg-[#F2F4F7] px-2 py-1 rounded transition-colors"
            title="View Sign In Screen"
          >
            Sign In UI
          </button>
          <button
            type="button"
            id="quick-switch-signup-btn"
            onClick={() => onNavigate('signup')}
            className="text-[11px] font-medium text-[#667085] hover:text-[#173B72] hover:bg-[#F2F4F7] px-2 py-1 rounded transition-colors"
            title="View Sign Up Screen"
          >
            Sign Up UI
          </button>
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            id="admin-profile-menu-btn"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-lg border border-[#E4E7EC] hover:bg-[#F8F9FC] transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#12345F] to-[#173B72] text-white flex items-center justify-center font-bold text-xs ring-1 ring-white/50">
              JA
            </div>
            <div className="hidden sm:block text-left pr-1">
              <p className="text-xs font-semibold text-[#172033] leading-none">John Admin</p>
              <p className="text-[10px] text-[#2D82C4] font-medium leading-none mt-0.5">Admin</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E4E7EC] rounded-xl shadow-xl py-1.5 z-40">
              <div className="px-3.5 py-2 border-b border-[#F2F4F7]">
                <p className="text-xs font-bold text-[#172033]">John Admin</p>
                <p className="text-[11px] text-[#667085] truncate">john.admin@leanbloom.com</p>
                <span className="inline-block mt-1 text-[10px] font-semibold bg-[#EAF6E7] text-[#2E9B4B] px-1.5 py-0.5 rounded">
                  Admin
                </span>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('users-roles');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-[#344054] hover:bg-[#F8F9FC] flex items-center gap-2.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#2D82C4]" />
                  My Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('settings');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-[#344054] hover:bg-[#F8F9FC] flex items-center gap-2.5 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-[#667085]" />
                  Account Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('settings');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-[#344054] hover:bg-[#F8F9FC] flex items-center gap-2.5 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-[#4FAF4A]" />
                  Security & 2FA
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('signin');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-[#344054] hover:bg-[#F8F9FC] flex items-center gap-2.5 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#D99A18]" />
                  View Sign In Screen
                </button>
              </div>

              <div className="border-t border-[#F2F4F7] pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-[#D64545] hover:bg-[#FEE4E2]/40 flex items-center gap-2.5 transition-colors font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
