import React, { useState, useMemo } from 'react';
import {
  PageView,
  DateRangeOption,
  Affiliate,
  Order,
  Patient,
  Product,
  AffiliatePriceRule,
  CommissionRecord,
  PaymentTransaction,
  Provider,
  NotificationItem,
  AdminUser,
  AuditLog,
  DomainItem,
  AffiliateRoute,
  AffiliateProfile,
  AffiliatePatientItem,
  AffiliateOrderItem,
  AffiliateCommissionRecord,
  AffiliatePaymentPayout,
  AffiliateSalesDataPoint
} from './types';
import {
  INITIAL_AFFILIATES,
  INITIAL_ORDERS,
  INITIAL_PATIENTS,
  INITIAL_PRODUCTS,
  INITIAL_PRICING_RULES,
  INITIAL_COMMISSIONS,
  INITIAL_PAYMENTS,
  INITIAL_PROVIDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_DOMAINS
} from './mockData';
import {
  MOCK_AFFILIATE_PROFILES,
  MOCK_AFFILIATE_PATIENTS,
  MOCK_AFFILIATE_ORDERS,
  MOCK_AFFILIATE_COMMISSIONS,
  MOCK_AFFILIATE_PAYMENTS,
  MOCK_AFFILIATE_SALES_DATA
} from './data/affiliateMockData';

// Master Admin Layout & Views
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { AffiliatesView } from './components/views/AffiliatesView';
import { DomainsView } from './components/views/DomainsView';
import { BrandingView } from './components/views/BrandingView';
import { PatientsView } from './components/views/PatientsView';
import { OrdersView } from './components/views/OrdersView';
import { ProductsPricingView } from './components/views/ProductsPricingView';
import { CommissionsPaymentsView } from './components/views/CommissionsPaymentsView';
import { OperationsView } from './components/views/OperationsView';
import { ReportsView } from './components/views/ReportsView';
import { SystemView } from './components/views/SystemView';

// Auth Views
import { SignInView } from './components/auth/SignInView';
import { SignUpView } from './components/auth/SignUpView';

// Master Admin Modals
import { CreateAffiliateModal } from './components/modals/CreateAffiliateModal';
import { LoginAsAffiliateModal } from './components/modals/LoginAsAffiliateModal';
import { EditPricingModal } from './components/modals/EditPricingModal';
import { CreateProductModal } from './components/modals/CreateProductModal';

// Affiliate Dashboard Layout & Views
import { AffiliateLayout } from './components/affiliate/AffiliateLayout';
import { AffiliateDashboardView } from './components/affiliate/views/AffiliateDashboardView';
import { AffiliatePatientsView } from './components/affiliate/views/AffiliatePatientsView';
import { AffiliateOrdersView } from './components/affiliate/views/AffiliateOrdersView';
import { AffiliateSalesView } from './components/affiliate/views/AffiliateSalesView';
import { AffiliateCommissionsView } from './components/affiliate/views/AffiliateCommissionsView';
import { AffiliatePaymentsView } from './components/affiliate/views/AffiliatePaymentsView';
import { AffiliateSettingsView } from './components/affiliate/views/AffiliateSettingsView';
import { AffiliateHelpSupportView } from './components/affiliate/views/AffiliateHelpSupportView';

// Affiliate Modals
import { AffiliatePatientDetailModal } from './components/affiliate/AffiliatePatientDetailModal';
import { AffiliateOrderDetailModal } from './components/affiliate/AffiliateOrderDetailModal';
import { AffiliatePaymentDetailModal } from './components/affiliate/AffiliatePaymentDetailModal';
import { AffiliateCommissionDetailModal } from './components/affiliate/AffiliateCommissionDetailModal';
import { AddPatientModal } from './components/affiliate/AddPatientModal';
import { SupportTicketModal } from './components/affiliate/SupportTicketModal';
import { AffiliateGlobalSearchModal } from './components/affiliate/AffiliateGlobalSearchModal';

// Icons
import { ArrowLeft } from 'lucide-react';

export default function App() {
  // Navigation & Auth State
  // Default to authenticated as Affiliate A (Wellness Partner LLC) so the Affiliate Dashboard opens immediately
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
    affiliateId?: string;
  }>({
    name: 'Wellness Partner LLC',
    email: 'contact@wellnesspartner.com',
    role: 'Affiliate',
    affiliateId: 'affiliate_001'
  });

  // Current view for Master Admin or Auth
  const [currentView, setCurrentView] = useState<PageView>('dashboard');

  // =========================================================================
  // MULTI-TENANT AFFILIATE DASHBOARD STATE
  // =========================================================================
  const [activeAffiliateId, setActiveAffiliateId] = useState<string>('affiliate_001');
  const [currentAffiliateRoute, setCurrentAffiliateRoute] = useState<AffiliateRoute>('dashboard');

  // Tenant data stores
  const [affiliateProfiles, setAffiliateProfiles] = useState<Record<string, AffiliateProfile>>(
    MOCK_AFFILIATE_PROFILES
  );
  const [affiliatePatients, setAffiliatePatients] = useState<AffiliatePatientItem[]>(
    MOCK_AFFILIATE_PATIENTS
  );
  const [affiliateOrders, setAffiliateOrders] = useState<AffiliateOrderItem[]>(
    MOCK_AFFILIATE_ORDERS
  );
  const [affiliateCommissions, setAffiliateCommissions] = useState<AffiliateCommissionRecord[]>(
    MOCK_AFFILIATE_COMMISSIONS
  );
  const [affiliatePayments, setAffiliatePayments] = useState<AffiliatePaymentPayout[]>(
    MOCK_AFFILIATE_PAYMENTS
  );
  const [affiliateSalesDataMap] = useState<Record<string, AffiliateSalesDataPoint[]>>(
    MOCK_AFFILIATE_SALES_DATA
  );

  // Active Affiliate Data derived by activeAffiliateId (Strict Tenant Isolation)
  const currentAffiliateProfile: AffiliateProfile =
    affiliateProfiles[activeAffiliateId] || affiliateProfiles['affiliate_001'];

  const currentAffiliatePatients: AffiliatePatientItem[] = useMemo(
    () => affiliatePatients.filter((p) => p.affiliateId === activeAffiliateId),
    [affiliatePatients, activeAffiliateId]
  );

  const currentAffiliateOrders: AffiliateOrderItem[] = useMemo(
    () => affiliateOrders.filter((o) => o.affiliateId === activeAffiliateId),
    [affiliateOrders, activeAffiliateId]
  );

  const currentAffiliateCommissions: AffiliateCommissionRecord[] = useMemo(
    () => affiliateCommissions.filter((c) => c.affiliateId === activeAffiliateId),
    [affiliateCommissions, activeAffiliateId]
  );

  const currentAffiliatePayments: AffiliatePaymentPayout[] = useMemo(
    () => affiliatePayments.filter((p) => p.affiliateId === activeAffiliateId),
    [affiliatePayments, activeAffiliateId]
  );

  const currentAffiliateSalesData: AffiliateSalesDataPoint[] =
    affiliateSalesDataMap[activeAffiliateId] || [];

  // Affiliate Modal Triggers
  const [selectedPatientForDetail, setSelectedPatientForDetail] =
    useState<AffiliatePatientItem | null>(null);
  const [selectedOrderForDetail, setSelectedOrderForDetail] =
    useState<AffiliateOrderItem | null>(null);
  const [selectedPaymentForDetail, setSelectedPaymentForDetail] =
    useState<AffiliatePaymentPayout | null>(null);
  const [selectedCommissionForDetail, setSelectedCommissionForDetail] =
    useState<AffiliateCommissionRecord | null>(null);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isSupportTicketModalOpen, setIsSupportTicketModalOpen] = useState(false);
  const [isGlobalSearchModalOpen, setIsGlobalSearchModalOpen] = useState(false);

  // =========================================================================
  // MASTER ADMIN STATE
  // =========================================================================
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeOption>('This Month');
  const [searchQuery, setSearchQuery] = useState('');

  const [affiliates, setAffiliates] = useState<Affiliate[]>(INITIAL_AFFILIATES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [patients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [pricingRules] = useState<AffiliatePriceRule[]>(INITIAL_PRICING_RULES);
  const [commissions] = useState<CommissionRecord[]>(INITIAL_COMMISSIONS);
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [providers] = useState<Provider[]>(INITIAL_PROVIDERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [auditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [domains, setDomains] = useState<DomainItem[]>(INITIAL_DOMAINS);
  const [brandingSelectedAffiliateId, setBrandingSelectedAffiliateId] = useState<
    string | undefined
  >(undefined);

  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);

  const [isCreateAffiliateOpen, setIsCreateAffiliateOpen] = useState(false);
  const [loginAsAffiliateTarget, setLoginAsAffiliateTarget] = useState<Affiliate | null>(null);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [editPricingProduct, setEditPricingProduct] = useState<Product | null>(null);

  // =========================================================================
  // AUTH HANDLERS
  // =========================================================================
  const handleSignInSuccess = (userData: {
    name: string;
    email: string;
    role: string;
    affiliateId?: string;
  }) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    if (userData.role === 'Affiliate') {
      setActiveAffiliateId(userData.affiliateId || 'affiliate_001');
      setCurrentAffiliateRoute('dashboard');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleSignUpSuccess = (userData: {
    name: string;
    email: string;
    organization: string;
    role?: string;
    affiliateId?: string;
  }) => {
    const role = userData.role || 'Affiliate';
    setCurrentUser({
      name: userData.name,
      email: userData.email,
      role: role,
      affiliateId: userData.affiliateId || 'affiliate_001'
    });
    setIsAuthenticated(true);
    if (role === 'Affiliate') {
      setActiveAffiliateId(userData.affiliateId || 'affiliate_001');
      setCurrentAffiliateRoute('dashboard');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('signin');
  };

  // Switch active tenant in Affiliate Portal
  const handleSwitchTenant = (affId: string) => {
    setActiveAffiliateId(affId);
    const prof = affiliateProfiles[affId];
    if (prof) {
      setCurrentUser({
        name: prof.name,
        email: prof.email,
        role: 'Affiliate',
        affiliateId: affId
      });
    }
  };

  // Switch to Master Admin Console
  const handleSwitchToMasterAdmin = () => {
    setCurrentUser({
      name: 'John Admin',
      email: 'john.admin@leanbloom.com',
      role: 'Master Admin'
    });
    setCurrentView('dashboard');
  };

  // Switch from Master Admin into Affiliate Portal (Login as Affiliate)
  const handleConfirmLoginAsAffiliate = (targetAff: Affiliate) => {
    setLoginAsAffiliateTarget(null);
    const mappedAffId =
      targetAff.id === 'aff-1'
        ? 'affiliate_001'
        : targetAff.id === 'aff-2'
        ? 'affiliate_002'
        : 'affiliate_001';

    setActiveAffiliateId(mappedAffId);
    setCurrentUser({
      name: targetAff.name,
      email: targetAff.contactEmail || 'contact@wellnesspartner.com',
      role: 'Affiliate',
      affiliateId: mappedAffId
    });
    setCurrentAffiliateRoute('dashboard');
  };

  // =========================================================================
  // AFFILIATE MUTATION HANDLERS
  // =========================================================================
  const handleAddPatient = (newPatient: AffiliatePatientItem) => {
    setAffiliatePatients((prev) => [newPatient, ...prev]);
    setIsAddPatientModalOpen(false);
  };

  const handleUpdateProfile = (updated: Partial<AffiliateProfile>) => {
    setAffiliateProfiles((prev) => ({
      ...prev,
      [activeAffiliateId]: {
        ...prev[activeAffiliateId],
        ...updated
      }
    }));
  };

  // =========================================================================
  // MASTER ADMIN HANDLERS
  // =========================================================================
  const handleCreateAffiliate = (
    newAffData: Omit<
      Affiliate,
      'id' | 'patientsCount' | 'ordersCount' | 'revenue' | 'commission' | 'growth' | 'createdAt'
    >
  ) => {
    const newId = `aff-${Date.now()}`;
    const newAffiliate: Affiliate = {
      ...newAffData,
      id: newId,
      patientsCount: 0,
      ordersCount: 0,
      revenue: 0,
      commission: 0,
      growth: '+0.0%',
      createdAt: 'Sep 18, 2026'
    };
    setAffiliates((prev) => [newAffiliate, ...prev]);
    setIsCreateAffiliateOpen(false);
  };

  const handleToggleAffiliateStatus = (affId: string) => {
    setAffiliates((prev) =>
      prev.map((a) =>
        a.id === affId ? { ...a, status: a.status === 'Active' ? 'Suspended' : 'Active' } : a
      )
    );
  };

  const handleCreateProduct = (
    newProdData: Omit<Product, 'id' | 'activeAffiliatesCount' | 'ordersCount'>
  ) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...newProdData,
      id: newId,
      activeAffiliatesCount: 0,
      ordersCount: 0
    };
    setProducts((prev) => [newProduct, ...prev]);
    setIsCreateProductOpen(false);
  };

  const handleToggleProductStatus = (prodId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === prodId ? { ...p, status: p.status === 'Active' ? 'Draft' : 'Active' } : p
      )
    );
  };

  const handleSavePricing = (productId: string, newBasePrice: number, newMinimumPrice: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              basePrice: newBasePrice,
              minimumPrice: newMinimumPrice
            }
          : p
      )
    );
    setEditPricingProduct(null);
  };

  const handleRefundOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Refunded' } : o))
    );
  };

  const handleDisbursePayout = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: 'Paid' } : p))
    );
  };

  const handleAddDomain = (newDomain: DomainItem) => {
    setDomains((prev) => [newDomain, ...prev]);
  };

  const handleTogglePrimaryDomain = (domainId: string) => {
    const targetDomain = domains.find((d) => d.id === domainId);
    if (!targetDomain) return;
    setDomains((prev) =>
      prev.map((d) =>
        d.affiliateId === targetDomain.affiliateId
          ? { ...d, primary: d.id === domainId }
          : d
      )
    );
  };

  const handleDeleteDomain = (domainId: string) => {
    setDomains((prev) => prev.filter((d) => d.id !== domainId));
  };

  const handleReverifyDomain = (domainId: string) => {
    setDomains((prev) =>
      prev.map((d) =>
        d.id === domainId
          ? {
              ...d,
              status: 'Active',
              sslStatus: 'Valid',
              sslExpiry: 'Dec 18, 2026',
              lastVerified: 'Just now',
              dnsRecords: d.dnsRecords.map((r) => ({ ...r, status: 'Verified' }))
            }
          : d
      )
    );
  };

  const handleSaveAffiliateBranding = (updatedAffiliate: Affiliate) => {
    setAffiliates((prev) =>
      prev.map((a) => (a.id === updatedAffiliate.id ? updatedAffiliate : a))
    );
  };

  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const handleAddAdminUser = (userData: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newUser: AdminUser = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: 'Just now',
      lastLogin: 'Never'
    };
    setAdminUsers((prev) => [...prev, newUser]);
  };

  // Navigation helper for Master Admin
  const handleNavigate = (view: PageView) => {
    if (view === 'signin') {
      setIsAuthenticated(false);
      setCurrentView('signin');
      return;
    }
    if (view === 'signup') {
      setIsAuthenticated(false);
      setCurrentView('signup');
      return;
    }
    setCurrentView(view);
    setMobileSidebarOpen(false);
  };

  // =========================================================================
  // VIEW ROUTING
  // =========================================================================

  // 1. Unauthenticated: Show Sign In or Sign Up
  if (!isAuthenticated) {
    if (currentView === 'signup') {
      return (
        <SignUpView
          onSignUpSuccess={handleSignUpSuccess}
          onGoToSignIn={() => setCurrentView('signin')}
        />
      );
    }
    return (
      <SignInView
        onSignInSuccess={handleSignInSuccess}
        onGoToSignUp={() => setCurrentView('signup')}
      />
    );
  }

  // 2. Authenticated as Affiliate: Render dedicated Affiliate Dashboard Layout
  if (currentUser.role === 'Affiliate') {
    return (
      <AffiliateLayout
        currentRoute={currentAffiliateRoute}
        onNavigate={(route) => setCurrentAffiliateRoute(route)}
        affiliateProfile={currentAffiliateProfile}
        currentSession={{
          id: currentAffiliateProfile.id,
          name: currentAffiliateProfile.name,
          email: currentAffiliateProfile.email,
          role: 'affiliate',
          affiliateId: activeAffiliateId,
          affiliateName: currentAffiliateProfile.name
        }}
        onLogout={handleLogout}
        onSwitchTenant={handleSwitchTenant}
        onSwitchToMasterAdmin={handleSwitchToMasterAdmin}
        onOpenSearch={() => setIsGlobalSearchModalOpen(true)}
      >
        {/* Affiliate Views */}
        {currentAffiliateRoute === 'dashboard' && (
          <AffiliateDashboardView
            affiliateProfile={currentAffiliateProfile}
            patients={currentAffiliatePatients}
            orders={currentAffiliateOrders}
            commissions={currentAffiliateCommissions}
            payments={currentAffiliatePayments}
            salesData={currentAffiliateSalesData}
            onSelectPatient={(p) => setSelectedPatientForDetail(p)}
            onSelectOrder={(o) => setSelectedOrderForDetail(o)}
            onNavigate={(route) => setCurrentAffiliateRoute(route)}
          />
        )}

        {currentAffiliateRoute === 'patients' && (
          <AffiliatePatientsView
            patients={currentAffiliatePatients}
            orders={currentAffiliateOrders}
            onSelectPatient={(p) => setSelectedPatientForDetail(p)}
            onOpenAddPatient={() => setIsAddPatientModalOpen(true)}
          />
        )}

        {currentAffiliateRoute === 'orders' && (
          <AffiliateOrdersView
            orders={currentAffiliateOrders}
            onSelectOrder={(o) => setSelectedOrderForDetail(o)}
          />
        )}

        {currentAffiliateRoute === 'sales' && (
          <AffiliateSalesView
            affiliateId={activeAffiliateId}
            salesData={currentAffiliateSalesData}
            orders={currentAffiliateOrders}
          />
        )}

        {currentAffiliateRoute === 'commissions' && (
          <AffiliateCommissionsView
            commissions={currentAffiliateCommissions}
            onSelectCommission={(c) => setSelectedCommissionForDetail(c)}
            onViewOrder={(orderId) => {
              const matched = currentAffiliateOrders.find((o) => o.id === orderId);
              if (matched) setSelectedOrderForDetail(matched);
            }}
          />
        )}

        {currentAffiliateRoute === 'payments' && (
          <AffiliatePaymentsView
            payments={currentAffiliatePayments}
            onSelectPayment={(p) => setSelectedPaymentForDetail(p)}
          />
        )}

        {currentAffiliateRoute === 'settings' && (
          <AffiliateSettingsView
            affiliateProfile={currentAffiliateProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {currentAffiliateRoute === 'support' && (
          <AffiliateHelpSupportView
            affiliateName={currentAffiliateProfile.name}
            onOpenTicket={() => setIsSupportTicketModalOpen(true)}
          />
        )}

        {/* Affiliate Global Modals */}
        <AffiliatePatientDetailModal
          patient={selectedPatientForDetail}
          orders={currentAffiliateOrders}
          onClose={() => setSelectedPatientForDetail(null)}
          onSelectOrder={(order) => {
            setSelectedPatientForDetail(null);
            setSelectedOrderForDetail(order);
          }}
        />

        <AffiliateOrderDetailModal
          order={selectedOrderForDetail}
          onClose={() => setSelectedOrderForDetail(null)}
          onViewPatient={(patName) => {
            const matched = currentAffiliatePatients.find((p) => p.name === patName);
            if (matched) {
              setSelectedOrderForDetail(null);
              setSelectedPatientForDetail(matched);
            }
          }}
        />

        <AffiliatePaymentDetailModal
          payment={selectedPaymentForDetail}
          onClose={() => setSelectedPaymentForDetail(null)}
        />

        <AffiliateCommissionDetailModal
          commission={selectedCommissionForDetail}
          onClose={() => setSelectedCommissionForDetail(null)}
          onViewOrder={(orderId) => {
            const ord = currentAffiliateOrders.find((o) => o.id === orderId);
            if (ord) {
              setSelectedCommissionForDetail(null);
              setSelectedOrderForDetail(ord);
            }
          }}
        />

        <AddPatientModal
          isOpen={isAddPatientModalOpen}
          onClose={() => setIsAddPatientModalOpen(false)}
          affiliateId={activeAffiliateId}
          onAddPatient={handleAddPatient}
        />

        <SupportTicketModal
          isOpen={isSupportTicketModalOpen}
          affiliateName={currentAffiliateProfile.name}
          onClose={() => setIsSupportTicketModalOpen(false)}
        />

        <AffiliateGlobalSearchModal
          isOpen={isGlobalSearchModalOpen}
          onClose={() => setIsGlobalSearchModalOpen(false)}
          patients={currentAffiliatePatients}
          orders={currentAffiliateOrders}
          onSelectPatient={(p) => setSelectedPatientForDetail(p)}
          onSelectOrder={(o) => setSelectedOrderForDetail(o)}
        />
      </AffiliateLayout>
    );
  }

  // 3. Authenticated as Master Admin: Render Master Admin Console
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col font-sans">
      {/* Top Bar with Fast Switch to Affiliate Portal */}
      <div className="bg-[#174A87] text-white px-4 py-1.5 text-[11px] font-medium flex items-center justify-between z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <span>
            LeanBloom Enterprise <strong>Master Admin Console</strong> ({currentUser.name})
          </span>
          <span className="hidden md:inline text-blue-200">
            • Platform-wide monitoring of all healthcare affiliates & prescribers
          </span>
        </div>

        <button
          onClick={() => {
            setCurrentUser({
              name: 'Wellness Partner LLC',
              email: 'contact@wellnesspartner.com',
              role: 'Affiliate',
              affiliateId: 'affiliate_001'
            });
            setActiveAffiliateId('affiliate_001');
            setCurrentAffiliateRoute('dashboard');
          }}
          className="px-2.5 py-0.5 bg-white/20 hover:bg-white/30 rounded-md text-[11px] font-bold text-white transition-colors flex items-center gap-1.5"
        >
          <span>Open Affiliate Portal View</span>
          <ArrowLeft className="w-3 h-3 rotate-180" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          unreadNotificationsCount={notifications.filter((n) => !n.read).length}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <Header
            currentView={currentView}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNavigate={handleNavigate}
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            notifications={notifications}
            onOpenNotifications={() => setCurrentView('notifications')}
            onLogout={handleLogout}
          />

          {/* Main Content View */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {/* 1. DASHBOARD VIEW */}
            {currentView === 'dashboard' && (
              <DashboardView
                affiliates={affiliates}
                orders={orders}
                patients={patients}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                onNavigate={(v) => setCurrentView(v)}
                onOpenCreateAffiliate={() => setIsCreateAffiliateOpen(true)}
                onOpenAddProduct={() => setIsCreateProductOpen(true)}
                onOpenLoginAsAffiliate={(aff) => setLoginAsAffiliateTarget(aff)}
                onSelectAffiliateDetail={(aff) => {
                  setSelectedAffiliate(aff);
                  setCurrentView('affiliates');
                }}
              />
            )}

            {/* 2. AFFILIATES VIEW */}
            {(currentView === 'affiliates' || currentView === 'affiliate-detail') && (
              <AffiliatesView
                affiliates={affiliates}
                orders={orders}
                patients={patients}
                products={products}
                selectedAffiliate={selectedAffiliate}
                onSelectAffiliate={setSelectedAffiliate}
                onOpenCreateAffiliate={() => setIsCreateAffiliateOpen(true)}
                onOpenLoginAsAffiliate={(aff) => setLoginAsAffiliateTarget(aff)}
                onToggleAffiliateStatus={handleToggleAffiliateStatus}
                onNavigateToBranding={(affId) => {
                  setBrandingSelectedAffiliateId(affId);
                  setCurrentView('branding');
                }}
                onNavigateToDomains={() => {
                  setCurrentView('domains');
                }}
              />
            )}

            {/* 2.1 DOMAINS & DNS MANAGEMENT VIEW */}
            {currentView === 'domains' && (
              <DomainsView
                domains={domains}
                affiliates={affiliates}
                onAddDomain={handleAddDomain}
                onTogglePrimaryDomain={handleTogglePrimaryDomain}
                onDeleteDomain={handleDeleteDomain}
                onReverifyDomain={handleReverifyDomain}
                onNavigateToAffiliate={(affId) => {
                  const aff = affiliates.find((a) => a.id === affId);
                  if (aff) {
                    setSelectedAffiliate(aff);
                    setCurrentView('affiliates');
                  }
                }}
              />
            )}

            {/* 2.2 WHITE-LABEL BRANDING STUDIO VIEW */}
            {currentView === 'branding' && (
              <BrandingView
                affiliates={affiliates}
                products={products}
                selectedAffiliateId={brandingSelectedAffiliateId}
                onSaveAffiliateBranding={handleSaveAffiliateBranding}
              />
            )}

            {/* 3. PATIENTS VIEW */}
            {currentView === 'patients' && (
              <PatientsView patients={patients} affiliates={affiliates} />
            )}

            {/* 4. ORDERS VIEW */}
            {currentView === 'orders' && (
              <OrdersView
                orders={orders}
                affiliates={affiliates}
                onRefundOrder={handleRefundOrder}
              />
            )}

            {/* 5. PRODUCTS & PRICING VIEWS */}
            {(currentView === 'products' || currentView === 'pricing') && (
              <ProductsPricingView
                mode={currentView}
                products={products}
                pricingRules={pricingRules}
                affiliates={affiliates}
                onOpenAddProduct={() => setIsCreateProductOpen(true)}
                onOpenEditPricing={(prod) => setEditPricingProduct(prod)}
                onToggleProductStatus={handleToggleProductStatus}
              />
            )}

            {/* 6. COMMISSIONS & PAYMENTS VIEWS */}
            {(currentView === 'commissions' || currentView === 'payments') && (
              <CommissionsPaymentsView
                mode={currentView}
                commissions={commissions}
                payments={payments}
                affiliates={affiliates}
                onDisbursePayout={handleDisbursePayout}
              />
            )}

            {/* 7. OPERATIONS VIEWS */}
            {(currentView === 'providers' ||
              currentView === 'pharmacy' ||
              currentView === 'appointments' ||
              currentView === 'prescriptions' ||
              currentView === 'support') && (
              <OperationsView initialSection={currentView} providers={providers} />
            )}

            {/* 8. REPORTS & ANALYTICS VIEWS */}
            {(currentView === 'reports' ||
              currentView === 'sales-analytics' ||
              currentView === 'affiliate-performance' ||
              currentView === 'revenue-analytics') && (
              <ReportsView affiliates={affiliates} products={products} />
            )}

            {/* 9. SYSTEM, NOTIFICATIONS, USERS & ROLES, AUDIT LOGS, SETTINGS */}
            {(currentView === 'settings' ||
              currentView === 'notifications' ||
              currentView === 'users-roles' ||
              currentView === 'audit-logs') && (
              <SystemView
                initialSub={currentView as any}
                notifications={notifications}
                users={adminUsers}
                auditLogs={auditLogs}
                onMarkNotificationRead={handleMarkNotificationRead}
                onAddUser={handleAddAdminUser}
              />
            )}
          </main>
        </div>
      </div>

      {/* GLOBAL MASTER ADMIN MODALS */}
      <CreateAffiliateModal
        isOpen={isCreateAffiliateOpen}
        onClose={() => setIsCreateAffiliateOpen(false)}
        onCreate={handleCreateAffiliate}
      />

      <LoginAsAffiliateModal
        isOpen={Boolean(loginAsAffiliateTarget)}
        affiliate={loginAsAffiliateTarget}
        onClose={() => setLoginAsAffiliateTarget(null)}
        onConfirm={handleConfirmLoginAsAffiliate}
      />

      <CreateProductModal
        isOpen={isCreateProductOpen}
        onClose={() => setIsCreateProductOpen(false)}
        onCreate={handleCreateProduct}
      />

      <EditPricingModal
        isOpen={Boolean(editPricingProduct)}
        product={editPricingProduct}
        onClose={() => setEditPricingProduct(null)}
        onSave={handleSavePricing}
      />
    </div>
  );
}
