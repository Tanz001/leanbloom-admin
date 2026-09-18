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
  UserCheck,
  Truck,
  Calendar,
  FileText,
  HelpCircle,
  BarChart3,
  TrendingUp,
  LineChart,
  PieChart,
  Bell,
  ShieldCheck,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
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
  unreadNotificationsCount
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
      title: 'PLATFORM',
      items: [
        {
          id: 'affiliates',
          label: 'Affiliates',
          icon: <Building2 className="w-4 h-4 flex-shrink-0" />,
          badge: '7'
        },
        {
          id: 'domains',
          label: 'Domains & DNS',
          icon: <Globe className="w-4 h-4 flex-shrink-0" />,
          badge: '8'
        },
        {
          id: 'branding',
          label: 'White-Label & Branding',
          icon: <Palette className="w-4 h-4 flex-shrink-0" />
        },
        {
          id: 'patients',
          label: 'Patients',
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
      title: 'OPERATIONS',
      items: [
        {
          id: 'providers',
          label: 'Providers',
          icon: <UserCheck className="w-4 h-4 flex-shrink-0" />
        },
        {
          id: 'pharmacy',
          label: 'Pharmacy / Fulfillment',
          icon: <Truck className="w-4 h-4 flex-shrink-0" />
        },
        {
          id: 'appointments',
          label: 'Appointments',
          icon: <Calendar className="w-4 h-4 flex-shrink-0" />
        },
        {
          id: 'prescriptions',
          label: 'Prescriptions',
          icon: <FileText className="w-4 h-4 flex-shrink-0" />
        },
        {
          id: 'support',
          label: 'Support',
          icon: <HelpCircle className="w-4 h-4 flex-shrink-0" />
        }
      ]
    },
    {
      title: 'ANALYTICS',
      items: [
        {
          id: 'reports',
          label: 'Reports',
          icon: <BarChart3 className="w-4 h-4 flex-shrink-0" />
        },
        {
          id: 'sales-analytics',
          label: 'Sales Analytics',
          icon: <TrendingUp className="w-4 h-4 flex-shrink-0" />
        },
        {
          id: 'affiliate-performance',
          label: 'Affiliate Performance',
          icon: <PieChart className="w-4 h-4 flex-shrink-0" />
        },
        {
          id: 'revenue-analytics',
          label: 'Revenue Analytics',
          icon: <LineChart className="w-4 h-4 flex-shrink-0" />
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
          label: 'Users & Roles',
          icon: <ShieldCheck className="w-4 h-4 flex-shrink-0" />
        },
        {
          id: 'audit-logs',
          label: 'Audit Logs',
          icon: <History className="w-4 h-4 flex-shrink-0" />
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
    if (mobileOpen) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#12345F] text-white">
      {/* Brand Header */}
      <div className="h-18 px-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
        <LeanBloomLogo
          collapsed={collapsed}
          size="md"
          theme="dark"
          showSubtitle={!collapsed}
        />
        {/* Mobile close or desktop collapse */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            type="button"
            id="sidebar-collapse-toggle-btn"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <h2 className="px-2.5 text-[10px] font-bold tracking-wider text-[#3A91D8] uppercase select-none">
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
                    className={`w-full group relative flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#173B72] text-white shadow-xs ring-1 ring-[#2D82C4]/40 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    {/* Active small green indicator dot */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#4FAF4A] rounded-r-full" />
                    )}

                    <span
                      className={`${
                        isActive ? 'text-[#3A91D8]' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {item.icon}
                    </span>

                    {!collapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}

                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          typeof item.badge === 'number'
                            ? 'bg-[#4FAF4A] text-white'
                            : 'bg-white/15 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed Tooltip */}
                    {collapsed && (
                      <div className="fixed left-20 ml-2 hidden group-hover:block bg-[#172033] text-white text-xs font-medium px-2.5 py-1.5 rounded-md shadow-xl whitespace-nowrap z-50 pointer-events-none">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Tenant / White-Label Architecture Banner */}
      {!collapsed && (
        <div className="mx-2.5 my-2 p-2.5 rounded-xl bg-gradient-to-r from-[#173B72] to-[#12345F] border border-[#2D82C4]/30 text-[11px]">
          <div className="flex items-center gap-1.5 text-[#3A91D8] font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#4FAF4A]" />
            Multi-Tenant Hub
          </div>
          <p className="text-slate-300 text-[10px] leading-relaxed">
            Controlling <strong className="text-white">7 active affiliates</strong> across 50 US states.
          </p>
        </div>
      )}

      {/* Admin Profile Footer */}
      <div className="p-3 border-t border-white/10 flex-shrink-0 bg-[#0E2849]">
        <div
          className={`flex items-center gap-2.5 ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2D82C4] to-[#173B72] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 ring-1 ring-[#4FAF4A]/50">
              JA
            </div>
            {!collapsed && (
              <div className="truncate text-left">
                <p className="text-xs font-semibold text-white leading-tight truncate">
                  John Admin
                </p>
                <p className="text-[10px] text-[#3A91D8] font-medium leading-tight truncate">
                  Master Administrator
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        id="master-sidebar-desktop"
        className={`hidden lg:flex flex-col border-r border-[#12345F]/20 flex-shrink-0 transition-all duration-200 z-20 ${
          collapsed ? 'w-20' : 'w-64 xl:w-68'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer panel */}
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
