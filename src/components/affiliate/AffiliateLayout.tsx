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
  ChevronRight,
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
  onSwitchToMasterAdmin,
  onOpenSearch,
  children
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const NAV_ITEMS = [
    { route: 'dashboard' as AffiliateRoute, label: 'Dashboard', icon: LayoutDashboard },
    { route: 'patients' as AffiliateRoute, label: 'Customers', icon: Users },
    { route: 'orders' as AffiliateRoute, label: 'Orders', icon: ShoppingBag },
    { route: 'sales' as AffiliateRoute, label: 'Sales', icon: TrendingUp },
    { route: 'commissions' as AffiliateRoute, label: 'Commissions', icon: Percent },
    { route: 'payments' as AffiliateRoute, label: 'Payments', icon: CreditCard }
  ];

  const SECONDARY_NAV_ITEMS = [
    { route: 'settings' as AffiliateRoute, label: 'Settings', icon: Settings },
    { route: 'support' as AffiliateRoute, label: 'Help & Support', icon: HelpCircle }
  ];

  const getRouteTitle = () => {
    switch (currentRoute) {
      case 'dashboard':
        return 'Dashboard';
      case 'patients':
        return 'Customers';
      case 'orders':
        return 'Orders';
      case 'sales':
        return 'Sales';
      case 'commissions':
        return 'Commissions';
      case 'payments':
        return 'Payments';
      case 'settings':
        return 'Settings';
      case 'support':
        return 'Help & Support';
      default:
        return 'Dashboard';
    }
  };

  const sidebarInner = (
    <div className="flex flex-col h-full bg-white">
      <div className="h-16 px-4 border-b border-[#E5E7EB] flex items-center justify-between flex-shrink-0 gap-2">
        <LeanBloomLogo
          collapsed={sidebarCollapsed}
          size={sidebarCollapsed ? 'sm' : 'md'}
          showSubtitle={!sidebarCollapsed}
          subtitle="Partner"
        />
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex p-1.5 text-[#667085] hover:text-[#172033] hover:bg-[#F7F9FC] rounded-lg transition-colors flex-shrink-0"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(false)}
          className="lg:hidden p-1.5 text-[#667085] hover:text-[#172033]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          {!sidebarCollapsed && (
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#98A2B3] block mb-2">
              Main
            </span>
          )}
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => {
                  onNavigate(item.route);
                  setMobileDrawerOpen(false);
                }}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-[#EAF4FB] text-[#12345F]'
                    : 'text-[#667085] hover:text-[#12345F] hover:bg-[#F7F9FC]'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#4FAF4A] rounded-r-full" />
                )}
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2D82C4]' : 'text-[#98A2B3]'}`} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        <div className="space-y-1 pt-4 border-t border-[#E5E7EB]">
          {!sidebarCollapsed && (
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#98A2B3] block mb-2">
              Account
            </span>
          )}
          {SECONDARY_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => {
                  onNavigate(item.route);
                  setMobileDrawerOpen(false);
                }}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-[#EAF4FB] text-[#12345F]'
                    : 'text-[#667085] hover:text-[#12345F] hover:bg-[#F7F9FC]'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#4FAF4A] rounded-r-full" />
                )}
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2D82C4]' : 'text-[#98A2B3]'}`} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-3 border-t border-[#E5E7EB] bg-[#F9FAFB] flex-shrink-0">
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className={`w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white transition-all text-left ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#EAF6E7] text-[#4FAF4A] font-bold text-xs flex items-center justify-center shrink-0 border border-[#4FAF4A]/20">
              {affiliateProfile.name.charAt(0)}
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#172033] truncate">{affiliateProfile.name}</h4>
                  <p className="text-[10px] text-[#667085] truncate">{currentSession.email}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#667085] shrink-0" />
              </>
            )}
          </button>

          {profileDropdownOpen && (
            <div className="absolute bottom-12 left-0 w-56 bg-white rounded-xl shadow-xl border border-[#E5E7EB] py-1 z-50 text-xs">
              <button
                type="button"
                onClick={() => {
                  onNavigate('settings');
                  setProfileDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#F7F9FC] flex items-center gap-2 text-[#172033]"
              >
                <Settings className="w-3.5 h-3.5 text-[#667085]" />
                Account Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setProfileDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen overflow-hidden bg-[#F7F9FC] text-[#172033] flex font-sans">
      {/* Fixed desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen border-r border-[#E5E7EB] bg-white z-40 transition-all duration-200 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarInner}
      </aside>

      {/* Spacer for fixed sidebar */}
      <div
        className={`hidden lg:block flex-shrink-0 transition-all duration-200 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
        aria-hidden
      />

      {/* Mobile drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full shadow-2xl z-10 bg-white">
            {sidebarInner}
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="bg-[#12345F] text-white px-4 py-1.5 text-[11px] font-medium flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4FAF4A] flex-shrink-0" />
            <span className="truncate">
              Affiliate Portal · <strong>{affiliateProfile.name}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onSwitchToMasterAdmin}
            className="px-2.5 py-0.5 bg-white/10 hover:bg-white/20 rounded-md text-[11px] font-semibold flex items-center gap-1.5 flex-shrink-0"
          >
            <Building2 className="w-3 h-3" />
            Back to Admin
          </button>
        </div>

        <header className="flex-shrink-0 bg-white border-b border-[#E5E7EB] px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
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

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#F7F9FC] hover:bg-gray-100 text-xs text-[#667085] border border-[#E5E7EB] rounded-xl"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search…</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-[#667085] hover:text-[#172033] hover:bg-[#F7F9FC] rounded-xl border border-[#E5E7EB]"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4FAF4A]" />
              </button>
              <AffiliateNotificationsPopover
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
              />
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="Sign out"
              className="p-2 text-[#667085] hover:text-red-600 hover:bg-red-50 rounded-xl border border-[#E5E7EB]"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
