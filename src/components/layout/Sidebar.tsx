import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  Percent,
  CreditCard,
  BarChart3,
  Bell,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Globe,
  Palette
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
  unreadNotificationsCount,
  affiliateCount = 0
}) => {
  const sections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
        }
      ]
    },
    {
      title: 'AFFILIATES',
      items: [
        {
          id: 'affiliates',
          label: 'Affiliates',
          icon: <Building2 className="w-4 h-4 flex-shrink-0" />,
          badge: affiliateCount || undefined
        },
        {
          id: 'domains',
          label: 'Domains',
          icon: <Globe className="w-4 h-4 flex-shrink-0" />
        },
        {
          id: 'branding',
          label: 'Branding',
          icon: <Palette className="w-4 h-4 flex-shrink-0" />
        }
      ]
    },
    {
      title: 'COMMERCE',
      items: [
        {
          id: 'patients',
          label: 'Customers',
          icon: <Users className="w-4 h-4 flex-shrink-0" />
        },
        {
          id: 'orders',
          label: 'Orders',
          icon: <ShoppingCart className="w-4 h-4 flex-shrink-0" />
        },
        {
          id: 'products',
          label: 'Products',
          icon: <Package className="w-4 h-4 flex-shrink-0" />
        },
        {
          id: 'pricing',
          label: 'Pricing',
          icon: <DollarSign className="w-4 h-4 flex-shrink-0" />
        },
        {
          id: 'commissions',
          label: 'Commissions',
          icon: <Percent className="w-4 h-4 flex-shrink-0" />
        },
        {
          id: 'payments',
          label: 'Payments',
          icon: <CreditCard className="w-4 h-4 flex-shrink-0" />
        }
      ]
    },
    {
      title: 'INSIGHTS',
      items: [
        {
          id: 'reports',
          label: 'Reports & Sales',
          icon: <BarChart3 className="w-4 h-4 flex-shrink-0" />
        }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        {
          id: 'notifications',
          label: 'Notifications',
          icon: <Bell className="w-4 h-4 flex-shrink-0" />,
          badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined
        },
        {
          id: 'users-roles',
          label: 'Admin Users',
          icon: <ShieldCheck className="w-4 h-4 flex-shrink-0" />
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <Settings className="w-4 h-4 flex-shrink-0" />
        }
      ]
    }
  ];

  const handleNavClick = (viewId: PageView) => {
    onNavigate(viewId);
    if (mobileOpen) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-[#172033]">
      {/* Brand */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#E4E7EC] flex-shrink-0">
        <LeanBloomLogo
          collapsed={collapsed}
          size="md"
          theme="light"
          showSubtitle={!collapsed}
          subtitle="Admin"
        />
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-[#667085] hover:text-[#173B72] rounded-lg hover:bg-[#F2F4F7]"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            type="button"
            id="sidebar-collapse-toggle-btn"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 text-[#667085] hover:text-[#173B72] rounded-lg hover:bg-[#F2F4F7] transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Nav — scrolls independently if needed */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2.5 space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <h2 className="px-2.5 mb-1.5 text-[10px] font-semibold tracking-[0.08em] text-[#98A2B3] uppercase select-none">
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
                    id={`nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full group relative flex items-center gap-2.5 px-2.5 py-2 text-[13px] font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#EAF4FB] text-[#173B72] font-semibold'
                        : 'text-[#475467] hover:text-[#173B72] hover:bg-[#F7F9FC]'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#4FAF4A] rounded-r-full" />
                    )}

                    <span className={isActive ? 'text-[#2D82C4]' : 'text-[#98A2B3] group-hover:text-[#2D82C4]'}>
                      {item.icon}
                    </span>

                    {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}

                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-semibold min-w-[1.25rem] text-center px-1.5 py-0.5 rounded-md ${
                          typeof item.badge === 'number' && item.id === 'notifications'
                            ? 'bg-[#4FAF4A] text-white'
                            : 'bg-[#F2F4F7] text-[#667085]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {collapsed && (
                      <div className="fixed left-[4.5rem] ml-2 hidden group-hover:block bg-[#173B72] text-white text-xs font-medium px-2.5 py-1.5 rounded-md shadow-xl whitespace-nowrap z-50 pointer-events-none">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="mx-2.5 mb-2 px-3 py-2.5 rounded-lg bg-gradient-to-br from-[#EAF4FB] to-[#F0FDF4] border border-[#E4E7EC]">
          <p className="text-[11px] font-semibold text-[#173B72]">Affiliate platform</p>
          <p className="text-[10px] text-[#667085] mt-0.5 leading-relaxed">
            Partners, branding & sales in one place.
          </p>
        </div>
      )}

      <div className="p-3 border-t border-[#E4E7EC] flex-shrink-0 bg-[#F9FAFB]">
        <div className={`flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#12345F] to-[#2D82C4] text-white font-semibold text-xs flex items-center justify-center flex-shrink-0">
            JA
          </div>
          {!collapsed && (
            <div className="truncate text-left">
              <p className="text-xs font-semibold text-[#172033] leading-tight truncate">John Admin</p>
              <p className="text-[10px] text-[#2D82C4] font-medium leading-tight truncate">Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Fixed desktop sidebar — never scrolls with page */}
      <aside
        id="master-sidebar-desktop"
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen border-r border-[#E4E7EC] bg-white z-40 transition-all duration-200 ${
          collapsed ? 'w-20' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Spacer so main content doesn't sit under fixed sidebar */}
      <div
        className={`hidden lg:block flex-shrink-0 transition-all duration-200 ${
          collapsed ? 'w-20' : 'w-60'
        }`}
        aria-hidden
      />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full shadow-2xl z-10 bg-white animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
