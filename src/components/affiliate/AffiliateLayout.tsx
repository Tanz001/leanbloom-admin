import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  TrendingUp,
  Percent,
  CreditCard,
  Settings,
  HelpCircle,
  Menu,
  X,
  LogOut,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import {
  AffiliateRoute,
  AffiliateProfile,
  AffiliateUserSession,
} from '../../types';
import { LeanBloomLogo } from '../brand/LeanBloomLogo';

interface AffiliateLayoutProps {
  currentRoute: AffiliateRoute;
  onNavigate: (route: AffiliateRoute) => void;
  affiliateProfile: AffiliateProfile;
  currentSession: AffiliateUserSession;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AffiliateLayout: React.FC<AffiliateLayoutProps> = ({
  currentRoute,
  onNavigate,
  affiliateProfile,
  currentSession,
  onLogout,
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const NAV_ITEMS = [
    { route: 'dashboard' as AffiliateRoute, label: 'Dashboard', icon: LayoutDashboard },
    { route: 'patients' as AffiliateRoute, label: 'Customers', icon: Users },
    { route: 'orders' as AffiliateRoute, label: 'Orders', icon: ShoppingBag },
    { route: 'products' as AffiliateRoute, label: 'Products', icon: Package },
    { route: 'sales' as AffiliateRoute, label: 'Sales', icon: TrendingUp },
    { route: 'commissions' as AffiliateRoute, label: 'Commissions', icon: Percent },
    { route: 'payments' as AffiliateRoute, label: 'Payments', icon: CreditCard },
  ];

  const SECONDARY_NAV_ITEMS = [
    { route: 'settings' as AffiliateRoute, label: 'Settings', icon: Settings },
    { route: 'support' as AffiliateRoute, label: 'Help & Support', icon: HelpCircle },
  ];

  const navigate = (route: AffiliateRoute) => {
    onNavigate(route);
    setMobileDrawerOpen(false);
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
            <p className="px-2.5 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
              Main
            </p>
          )}
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => navigate(item.route)}
                title={item.label}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  sidebarCollapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-[#EAF4FB] text-[#12345F]'
                    : 'text-[#5B6B7C] hover:bg-[#F7F9FC] hover:text-[#12345F]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#2D82C4]' : 'text-[#98A2B3]'
                  }`}
                />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        <div className="space-y-1">
          {!sidebarCollapsed && (
            <p className="px-2.5 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
              Account
            </p>
          )}
          {SECONDARY_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => navigate(item.route)}
                title={item.label}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  sidebarCollapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-[#EAF4FB] text-[#12345F]'
                    : 'text-[#5B6B7C] hover:bg-[#F7F9FC] hover:text-[#12345F]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#2D82C4]' : 'text-[#98A2B3]'
                  }`}
                />
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
                  <h4 className="text-xs font-bold text-[#172033] truncate">
                    {affiliateProfile.name}
                  </h4>
                  <p className="text-[10px] text-[#667085] truncate">
                    {currentSession.email}
                  </p>
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
                  navigate('settings');
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
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen border-r border-[#E5E7EB] bg-white z-40 transition-all duration-200 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarInner}
      </aside>

      <div
        className={`hidden lg:block flex-shrink-0 transition-all duration-200 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
        aria-hidden
      />

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

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Mobile-only menu strip */}
        <div className="lg:hidden flex-shrink-0 bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="p-1.5 text-[#667085] hover:text-[#172033] rounded-lg border border-[#E5E7EB]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-[#12345F] truncate">
            {affiliateProfile.name}
          </span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
