import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  ShoppingCart,
  Package,
  Percent,
  CreditCard,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Globe,
  Palette,
  ShieldCheck,
  DollarSign,
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
        {
          id: 'pricing',
          label: 'Pricing',
          icon: <DollarSign className="w-[18px] h-[18px]" strokeWidth={1.75} />,
        },
      ],
    },
    {
      title: 'Finance',
      items: [
        {
          id: 'commissions',
          label: 'Commissions',
          icon: <Percent className="w-[18px] h-[18px]" strokeWidth={1.75} />,
        },
        {
          id: 'payments',
          label: 'Payments',
          icon: <CreditCard className="w-[18px] h-[18px]" strokeWidth={1.75} />,
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: <BarChart3 className="w-[18px] h-[18px]" strokeWidth={1.75} />,
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          id: 'users-roles',
          label: 'Admin Users',
          icon: <ShieldCheck className="w-[18px] h-[18px]" strokeWidth={1.75} />,
        },
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
    <div className="flex flex-col h-full bg-white text-[#1A2332]">
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#EAECEF] flex-shrink-0 bg-white">
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
            className="lg:hidden p-1.5 text-[#9CA3AF] hover:text-[#1A2332] rounded-md hover:bg-[#F3F4F6]"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 text-[#9CA3AF] hover:text-[#1A2332] rounded-md hover:bg-[#F3F4F6] transition-colors"
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

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2.5 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <h2 className="px-3 mb-2 text-[10px] font-medium tracking-[0.12em] text-[#A0A8B4] uppercase">
                {section.title}
              </h2>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  currentView === item.id ||
                  (item.id === 'affiliates' && currentView === 'affiliate-detail');

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full group relative flex items-center gap-3 px-3 py-2 text-[13px] rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-[#F0F6FB] text-[#12345F] font-semibold border border-[#D6E6F4]'
                        : 'text-[#5B6B7C] hover:text-[#12345F] hover:bg-[#F7F9FC] border border-transparent'
                    } ${collapsed ? 'justify-center px-2' : ''}`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-lb-gradient" />
                    )}
                    <span
                      className={
                        isActive
                          ? 'text-[#2D82C4]'
                          : 'text-[#9CA3AF] group-hover:text-[#4FAF4A]'
                      }
                    >
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}
                    {!collapsed && item.badge !== undefined && (
                      <span className="text-[10px] font-medium min-w-[1.25rem] text-center px-1.5 py-0.5 rounded-md bg-[#EEF1F5] text-[#6B7280]">
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
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen border-r border-[#EAECEF] bg-white z-40 transition-all duration-200 ${
          collapsed ? 'w-[72px]' : 'w-56'
        }`}
      >
        {sidebarContent}
      </aside>

      <div
        className={`hidden lg:block flex-shrink-0 transition-all duration-200 ${
          collapsed ? 'w-[72px]' : 'w-56'
        }`}
        aria-hidden
      />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={onCloseMobile}
          />
          <div className="relative flex flex-col w-64 max-w-[85vw] h-full shadow-xl z-10 bg-white">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
