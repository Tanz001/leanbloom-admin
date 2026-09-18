import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  TrendingUp,
  Percent,
  CreditCard,
  Settings,
  HelpCircle,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Building2,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  User,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { AffiliateRoute, AffiliateProfile, AffiliateUserSession } from '../../types';
import { LeanBloomLogo } from '../brand/LeanBloomLogo';
import { AffiliateNotificationsPopover } from './AffiliateNotificationsPopover';

interface AffiliateLayoutProps {
  currentRoute: AffiliateRoute;
  onNavigate: (route: AffiliateRoute) => void;
  affiliateProfile: AffiliateProfile;
  currentSession: AffiliateUserSession;
  onLogout: () => void;
  onSwitchTenant: (affiliateId: string) => void;
  onSwitchToMasterAdmin: () => void;
  onOpenSearch: () => void;
  children: React.ReactNode;
}

export const AffiliateLayout: React.FC<AffiliateLayoutProps> = ({
  currentRoute,
  onNavigate,
  affiliateProfile,
  currentSession,
  onLogout,
  onSwitchTenant,
  onSwitchToMasterAdmin,
  onOpenSearch,
  children
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [tenantSwitcherOpen, setTenantSwitcherOpen] = useState(false);

  // Navigation Items according to strict spec
  const NAV_ITEMS = [
    { route: 'dashboard' as AffiliateRoute, label: 'Dashboard', icon: LayoutDashboard },
    { route: 'patients' as AffiliateRoute, label: 'Patients', icon: Users },
    { route: 'orders' as AffiliateRoute, label: 'Orders', icon: ShoppingBag },
    { route: 'sales' as AffiliateRoute, label: 'Sales', icon: TrendingUp },
    { route: 'commissions' as AffiliateRoute, label: 'Commissions', icon: Percent },
    { route: 'payments' as AffiliateRoute, label: 'Payments', icon: CreditCard }
  ];

  const SECONDARY_NAV_ITEMS = [
    { route: 'settings' as AffiliateRoute, label: 'Settings', icon: Settings },
    { route: 'support' as AffiliateRoute, label: 'Help & Support', icon: HelpCircle }
  ];

  // Route title formatting
  const getRouteTitle = () => {
    switch (currentRoute) {
      case 'dashboard':
        return 'Affiliate Dashboard';
      case 'patients':
        return 'Patient Directory';
      case 'orders':
        return 'Affiliate Orders';
      case 'sales':
        return 'Sales Analytics';
      case 'commissions':
        return 'Commission Records';
      case 'payments':
        return 'Disbursements & Payouts';
      case 'settings':
        return 'Account & Clinic Settings';
      case 'support':
        return 'Help & Partner Support';
      default:
        return 'Affiliate Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col font-sans">
      {/* Mobile Drawer Backdrop */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#123B70]/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Top Banner indicating Tenant Isolation */}
      <div className="bg-[#174A87] text-white px-4 py-1.5 text-[11px] font-medium flex items-center justify-between z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4A9B52] animate-pulse" />
          <span>
            Multi-Tenant Partner Portal: <strong>{affiliateProfile.name}</strong> ({affiliateProfile.id})
          </span>
          <span className="hidden md:inline text-blue-200">
            • Data strictly isolated to your registered patients & orders
          </span>
        </div>

        {/* Demo Fast Switcher (For verification of tenant isolation) */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setTenantSwitcherOpen(!tenantSwitcherOpen)}
              className="px-2 py-0.5 bg-white/15 hover:bg-white/25 rounded text-[11px] font-semibold text-white flex items-center gap-1 transition-colors"
            >
              <span>Demo Switch Tenant</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {tenantSwitcherOpen && (
              <div className="absolute right-0 top-6 w-64 bg-white text-[#172033] rounded-xl shadow-xl border border-[#E5E7EB] py-1 z-50 animate-in fade-in">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-[#667085] tracking-wider border-b border-[#E5E7EB]">
                  Switch Active Affiliate
                </div>
                <button
                  onClick={() => {
                    onSwitchTenant('affiliate_001');
                    setTenantSwitcherOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F7F9FC] ${
                    affiliateProfile.id === 'affiliate_001'
                      ? 'font-bold text-[#174A87] bg-[#EAF5EA]/40'
                      : ''
                  }`}
                >
                  <div>
                    <div>Wellness Partner LLC</div>
                    <div className="text-[10px] text-[#667085] font-mono">affiliate_001 (Affiliate A)</div>
                  </div>
                  {affiliateProfile.id === 'affiliate_001' && (
                    <span className="w-2 h-2 rounded-full bg-[#4A9B52]" />
                  )}
                </button>
                <button
                  onClick={() => {
                    onSwitchTenant('affiliate_002');
                    setTenantSwitcherOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F7F9FC] ${
                    affiliateProfile.id === 'affiliate_002'
                      ? 'font-bold text-[#174A87] bg-[#EAF5EA]/40'
                      : ''
                  }`}
                >
                  <div>
                    <div>Apex Health Telehealth</div>
                    <div className="text-[10px] text-[#667085] font-mono">affiliate_002 (Affiliate B)</div>
                  </div>
                  {affiliateProfile.id === 'affiliate_002' && (
                    <span className="w-2 h-2 rounded-full bg-[#4A9B52]" />
                  )}
                </button>
                <div className="border-t border-[#E5E7EB] my-1" />
                <button
                  onClick={() => {
                    onSwitchToMasterAdmin();
                    setTenantSwitcherOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#174A87] font-semibold hover:bg-blue-50 flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Switch to Master Admin Console</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* ============================================================ */}
        {/* LEFT SIDEBAR (Desktop & Mobile Drawer) */}
        {/* ============================================================ */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-[#E5E7EB] flex flex-col justify-between transition-all duration-200 lg:static ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          } ${mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          {/* Sidebar Top: Logo + Subtitle + Collapse button */}
          <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <LeanBloomLogo collapsed={sidebarCollapsed} size={sidebarCollapsed ? 'sm' : 'md'} />
              {!sidebarCollapsed && (
                <div className="leading-none">
                  <span className="text-[10px] font-bold text-[#4A9B52] uppercase tracking-wider block">
                    Partner Portal
                  </span>
                </div>
              )}
            </div>

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1.5 text-[#667085] hover:text-[#172033] hover:bg-[#F7F9FC] rounded-lg transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>

            {/* Mobile close drawer button */}
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="lg:hidden p-1.5 text-[#667085] hover:text-[#172033]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Nav Items */}
          <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
            {/* Main items */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#667085] block mb-2">
                  Main Navigation
                </span>
              )}
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;

                return (
                  <button
                    key={item.route}
                    onClick={() => {
                      onNavigate(item.route);
                      setMobileDrawerOpen(false);
                    }}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                      isActive
                        ? 'bg-[#EAF5EA] text-[#174A87]'
                        : 'text-[#667085] hover:text-[#172033] hover:bg-[#F7F9FC]'
                    } ${sidebarCollapsed ? 'justify-center' : ''}`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#174A87] rounded-r-full" />
                    )}
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#174A87]' : 'text-[#667085]'
                      }`}
                    />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>

            {/* Secondary items */}
            <div className="space-y-1 pt-4 border-t border-[#E5E7EB]">
              {!sidebarCollapsed && (
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#667085] block mb-2">
                  Support & Config
                </span>
              )}
              {SECONDARY_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;

                return (
                  <button
                    key={item.route}
                    onClick={() => {
                      onNavigate(item.route);
                      setMobileDrawerOpen(false);
                    }}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                      isActive
                        ? 'bg-[#EAF5EA] text-[#174A87]'
                        : 'text-[#667085] hover:text-[#172033] hover:bg-[#F7F9FC]'
                    } ${sidebarCollapsed ? 'justify-center' : ''}`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#174A87] rounded-r-full" />
                    )}
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#174A87]' : 'text-[#667085]'
                      }`}
                    />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Bottom: Affiliate Profile Card */}
          <div className="p-3 border-t border-[#E5E7EB] bg-white">
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#F7F9FC] transition-all text-left ${
                  sidebarCollapsed ? 'justify-center' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#EAF5EA] text-[#4A9B52] font-bold text-xs flex items-center justify-center shrink-0 border border-[#4A9B52]/20">
                  {affiliateProfile.name.charAt(0)}
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#172033] truncate">
                      {affiliateProfile.name}
                    </h4>
                    <p className="text-[10px] text-[#667085] truncate font-mono">
                      {affiliateProfile.id}
                    </p>
                  </div>
                )}
                {!sidebarCollapsed && (
                  <ChevronDown className="w-3.5 h-3.5 text-[#667085] shrink-0" />
                )}
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute bottom-12 left-0 w-56 bg-white rounded-xl shadow-xl border border-[#E5E7EB] py-1 z-50 text-xs animate-in fade-in">
                  <div className="px-3 py-2 border-b border-[#E5E7EB]">
                    <div className="font-bold text-[#172033]">{affiliateProfile.name}</div>
                    <div className="text-[11px] text-[#667085] truncate">{affiliateProfile.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#F7F9FC] flex items-center gap-2 text-[#172033]"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#667085]" />
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('support');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#F7F9FC] flex items-center gap-2 text-[#172033]"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[#667085]" />
                    <span>Partner Support</span>
                  </button>
                  <div className="border-t border-[#E5E7EB] my-1" />
                  <button
                    onClick={() => {
                      onLogout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* MAIN BODY AREA */}
        {/* ============================================================ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Navbar */}
          <header className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB] px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
            {/* Left: Mobile hamburger + Breadcrumbs */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden p-1.5 text-[#667085] hover:text-[#172033] rounded-lg border border-[#E5E7EB]"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5 text-xs text-[#667085]">
                <span className="hidden sm:inline">Partner</span>
                <ChevronRight className="w-3.5 h-3.5 hidden sm:inline" />
                <span className="font-semibold text-[#172033]">{getRouteTitle()}</span>
              </div>
            </div>

            {/* Right: Search, Notifications, Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Global search trigger */}
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#F7F9FC] hover:bg-gray-100 text-xs text-[#667085] border border-[#E5E7EB] rounded-xl transition-all shadow-2xs"
              >
                <Search className="w-3.5 h-3.5 text-[#667085]" />
                <span className="hidden sm:inline">Search patients, orders...</span>
                <kbd className="hidden sm:inline px-1.5 py-0.5 bg-white border border-[#E5E7EB] rounded-md font-mono text-[10px] text-[#667085]">
                  ⌘K
                </kbd>
              </button>

              {/* Notifications Button & Popover */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-[#667085] hover:text-[#172033] hover:bg-[#F7F9FC] rounded-xl border border-[#E5E7EB] transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#174A87]" />
                </button>

                <AffiliateNotificationsPopover
                  isOpen={notificationsOpen}
                  onClose={() => setNotificationsOpen(false)}
                />
              </div>

              {/* Sign out button */}
              <button
                onClick={onLogout}
                title="Sign out"
                className="p-2 text-[#667085] hover:text-red-600 hover:bg-red-50 rounded-xl border border-[#E5E7EB] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Page Content Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>

          {/* Footer */}
          <footer className="px-6 py-4 border-t border-[#E5E7EB] bg-white text-xs text-[#667085] flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              © 2026 LeanBloom Health Inc. • Multi-tenant Telehealth Affiliate Architecture
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-[#4A9B52] font-semibold">
                Tenant Verified: {affiliateProfile.name}
              </span>
              <span>•</span>
              <button onClick={() => onNavigate('support')} className="hover:underline">
                Partner Support
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
