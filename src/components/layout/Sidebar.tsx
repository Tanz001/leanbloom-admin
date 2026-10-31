import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  ShoppingCart,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  Globe,
  Palette,
  Settings,
  CreditCard,
  Layers,
} from 'lucide-react';
import { PageView } from '../../types';
import { LeanBloomLogo } from '../brand/LeanBloomLogo';

interface SidebarProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  unreadNotificationsCount: number;
  affiliateCount?: number;
}

interface NavItem {
  id: PageView;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  affiliateCount = 0,
}) => {
  const sections: NavSection[] = [
    {
      title: 'Main',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-[18px] h-[18px]" strokeWidth={1.75} />,
        },
        {
          id: 'affiliates',
          label: 'Affiliates',
          icon: <Building2 className="w-[18px] h-[18px]" strokeWidth={1.75} />,
          badge: affiliateCount || undefined,
        },
        {
          id: 'domains',
          label: 'Domains',
          icon: <Globe className="w-[18px] h-[18px]" strokeWidth={1.75} />,
        },
        {
          id: 'branding',
          label: 'Branding',
          icon: <Palette className="w-[18px] h-[18px]" strokeWidth={1.75} />,
        },
      ],
    },
    {
      title: 'Commerce',
      items: [
        {
          id: 'patients',
          label: 'Customers',
          icon: <Users className="w-[18px] h-[18px]" strokeWidth={1.75} />,
        },
        {
          id: 'orders',
          label: 'Orders',
          icon: <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={1.75} />,
        },
        {
          id: 'products',
          label: 'Products',
          icon: <Package className="w-[18px] h-[18px]" strokeWidth={1.75} />,
        },
      ],
    },
    {
      title: 'Billing',
      items: [
        {
          id: 'plans',
          label: 'Plans',
          icon: <Layers className="w-[18px] h-[18px]" strokeWidth={1.75} />,
        },
        {
          id: 'subscriptions',
          label: 'Subscriptions',
          icon: <CreditCard className="w-[18px] h-[18px]" strokeWidth={1.75} />,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'settings',
          label: 'Settings',
          icon: <Settings className="w-[18px] h-[18px]" strokeWidth={1.75} />,
        },
      ],
    },
  ];

  const handleNavClick = (viewId: PageView) => {
    onNavigate(viewId);
    if (mobileOpen) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white/95 text-[#0F1C2E] backdrop-blur-sm">
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#E8EEF4] flex-shrink-0">
        <LeanBloomLogo
          collapsed={collapsed}
          size="sm"
          theme="light"
          showSubtitle={false}
        />
        <div className="flex items-center">
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-[#6B7C8F] hover:text-[#0B2440] rounded-lg hover:bg-[#F0F4F8]"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 text-[#6B7C8F] hover:text-[#0B2440] rounded-lg hover:bg-[#F0F4F8] transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-5 px-3 space-y-7">
        {sections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <h2 className="px-3 mb-2.5 text-[11px] font-semibold tracking-[0.14em] text-[#8A96A6] uppercase">
                {section.title}
              </h2>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  currentView === item.id ||
                  (item.id === 'affiliates' && currentView === 'affiliate-detail') ||
                  (item.id === 'settings' && currentView === 'profile');

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full group relative flex items-center gap-3 px-3 py-2.5 text-[13.5px] rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-[#EAF4FB] text-[#0B2440] font-semibold border border-[#C9DFF0] shadow-[0_1px_2px_rgba(18,52,95,0.04)]'
                        : 'text-[#4A5A6A] hover:text-[#0B2440] hover:bg-[#F5F8FB] border border-transparent font-medium'
                    } ${collapsed ? 'justify-center px-2' : ''}`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-lb-gradient" />
                    )}
                    <span
                      className={
                        isActive
                          ? 'text-[#2D82C4]'
                          : 'text-[#8A96A6] group-hover:text-[#2D82C4]'
                      }
                    >
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}
                    {!collapsed && item.badge !== undefined && (
                      <span className="text-[11px] font-semibold min-w-[1.35rem] text-center px-1.5 py-0.5 rounded-md bg-[#E8EEF5] text-[#12345F]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen border-r border-[#E2E8F0] bg-white z-40 transition-all duration-200 shadow-[1px_0_0_rgba(15,28,46,0.02)] ${
          collapsed ? 'w-[76px]' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      <div
        className={`hidden lg:block flex-shrink-0 transition-all duration-200 ${
          collapsed ? 'w-[76px]' : 'w-60'
        }`}
        aria-hidden
      />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#0B2440]/35 backdrop-blur-[2px]"
            onClick={onCloseMobile}
          />
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full shadow-2xl z-10 bg-white">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
