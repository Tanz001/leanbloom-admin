import React, { useState, useEffect } from 'react';
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
  NotificationItem,
  AdminUser,
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
  INITIAL_ORDERS,
  INITIAL_PATIENTS,
  INITIAL_PRICING_RULES,
  INITIAL_COMMISSIONS,
  INITIAL_PAYMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
} from './mockData';
// Affiliate mock data removed — portal loads from /api/affiliate/*

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
import { ReportsView } from './components/views/ReportsView';
import { SystemView } from './components/views/SystemView';
import { AdminProfileView } from './components/views/AdminProfileView';

// Auth Views
import { SignInView } from './components/auth/SignInView';
import { SignUpView } from './components/auth/SignUpView';

// Master Admin Modals
import { CreateAffiliateModal } from './components/modals/CreateAffiliateModal';
import { EditAffiliateModal } from './components/modals/EditAffiliateModal';
import { EditPricingModal } from './components/modals/EditPricingModal';
import { CreateProductModal } from './components/modals/CreateProductModal';
import { EditProductModal } from './components/modals/EditProductModal';

// Affiliate Dashboard Layout & Views
import { AffiliateLayout } from './components/affiliate/AffiliateLayout';
import { AffiliateDashboardView } from './components/affiliate/views/AffiliateDashboardView';
import { AffiliatePatientsView } from './components/affiliate/views/AffiliatePatientsView';
import { AffiliateOrdersView } from './components/affiliate/views/AffiliateOrdersView';
import { AffiliateProductsView } from './components/affiliate/views/AffiliateProductsView';
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

import {
  clearAuthToken,
  restoreSession,
  saveAuthSession,
  getAuthToken,
  getStoredUser,
  adminApi,
  affiliateApi,
  type AppUser,
  type AffiliatePortalProduct,
  type AffiliatePortalProfile,
} from './lib/api';

const EMPTY_AFFILIATE_PROFILE: AffiliateProfile = {
  id: '',
  name: 'Loading…',
  email: '',
  phone: '',
  website: '',
  businessName: '',
  businessEmail: '',
  businessPhone: '',
  businessAddress: '',
  country: 'United States',
  commissionRate: 15,
  status: 'Active',
  payoutMethod: 'Bank Transfer',
  bankName: '',
  routingNumberMasked: '',
  accountNumberMasked: '',
  accountHolderName: '',
  paypalEmailMasked: '',
  notificationPreferences: {
    newOrders: true,
    commissions: true,
    payments: true,
    weeklySummary: true,
    marketing: false,
  },
  twoFactorEnabled: false,
  lastLoginIp: '',
  lastLoginTime: '',
};

function mapPortalProfile(p: AffiliatePortalProfile): AffiliateProfile {
  return {
    id: p.id,
    name: p.name,
    tradingName: p.tradingName,
    email: p.email,
    phone: p.phone,
    website: p.website,
    businessName: p.businessName,
    businessEmail: p.businessEmail,
    businessPhone: p.businessPhone,
    businessAddress: p.businessAddress,
    country: p.country,
    commissionRate: p.commissionRate,
    status: p.status,
    payoutMethod: p.payoutMethod,
    bankName: p.bankName,
    routingNumberMasked: p.routingNumberMasked,
    accountNumberMasked: p.accountNumberMasked,
    accountHolderName: p.accountHolderName,
    paypalEmailMasked: p.paypalEmailMasked,
    notificationPreferences: p.notificationPreferences,
    twoFactorEnabled: p.twoFactorEnabled,
    lastLoginIp: p.lastLoginIp,
    lastLoginTime: p.lastLoginTime,
  };
}

export default function App() {
  const storedUser = getStoredUser();
  const hasToken = Boolean(getAuthToken());

  const [authReady, setAuthReady] = useState(!hasToken);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(hasToken && storedUser)
  );
  const [currentUser, setCurrentUser] = useState<AppUser>(
    storedUser || { name: '', email: '', role: '' }
  );

  // Current view for Master Admin or Auth
  const [currentView, setCurrentView] = useState<PageView>(
    hasToken && storedUser
      ? storedUser.role === 'Affiliate'
        ? 'dashboard'
        : 'dashboard'
      : 'signin'
  );

  // =========================================================================
  // MULTI-TENANT AFFILIATE DASHBOARD STATE
  // =========================================================================
  const [activeAffiliateId, setActiveAffiliateId] = useState<string>('');
  const [currentAffiliateRoute, setCurrentAffiliateRoute] = useState<AffiliateRoute>('dashboard');
  const [affiliatePortalLoading, setAffiliatePortalLoading] = useState(false);
  const [affiliatePortalError, setAffiliatePortalError] = useState<string | null>(null);
  const [defaultMarkup, setDefaultMarkup] = useState(25);

  const [currentAffiliateProfile, setCurrentAffiliateProfile] =
    useState<AffiliateProfile>(EMPTY_AFFILIATE_PROFILE);
  const [currentAffiliatePatients, setCurrentAffiliatePatients] = useState<
    AffiliatePatientItem[]
  >([]);
  const [currentAffiliateOrders, setCurrentAffiliateOrders] = useState<
    AffiliateOrderItem[]
  >([]);
  const [currentAffiliateCommissions, setCurrentAffiliateCommissions] =
    useState<AffiliateCommissionRecord[]>([]);
  const [currentAffiliatePayments, setCurrentAffiliatePayments] = useState<
    AffiliatePaymentPayout[]
  >([]);
  const [currentAffiliateSalesData, setCurrentAffiliateSalesData] = useState<
    AffiliateSalesDataPoint[]
  >([]);
  const [affiliateProducts, setAffiliateProducts] = useState<
    AffiliatePortalProduct[]
  >([]);

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

  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [patients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [products, setProducts] = useState<Product[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [pricingRules] = useState<AffiliatePriceRule[]>(INITIAL_PRICING_RULES);
  const [commissions] = useState<CommissionRecord[]>(INITIAL_COMMISSIONS);
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [brandingSelectedAffiliateId, setBrandingSelectedAffiliateId] = useState<
    string | undefined
  >(undefined);

  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);

  const [isCreateAffiliateOpen, setIsCreateAffiliateOpen] = useState(false);
  const [editAffiliateTarget, setEditAffiliateTarget] = useState<Affiliate | null>(null);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [editProductTarget, setEditProductTarget] = useState<Product | null>(null);
  const [editPricingProduct, setEditPricingProduct] = useState<Product | null>(null);

  // =========================================================================
  // AUTH — restore session from localStorage on refresh
  // =========================================================================
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!getAuthToken()) {
        setAuthReady(true);
        return;
      }

      const session = await restoreSession();
      if (cancelled) return;

      if (session) {
        setCurrentUser(session.user);
        setIsAuthenticated(true);
        if (session.user.role === 'Affiliate') {
          setActiveAffiliateId(session.user.affiliateId || 'affiliate_001');
          setCurrentAffiliateRoute('dashboard');
        } else {
          setCurrentView('dashboard');
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUser({ name: '', email: '', role: '' });
        setCurrentView('signin');
      }
      setAuthReady(true);
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load affiliates + products for master admin once authenticated
  useEffect(() => {
    if (!authReady || !isAuthenticated || currentUser.role === 'Affiliate') {
      return;
    }

    let cancelled = false;

    async function loadCatalog() {
      setCatalogLoading(true);
      setCatalogError(null);
      try {
        const [affRes, prodRes, domainRes] = await Promise.all([
          adminApi.listAffiliates(),
          adminApi.listProducts(),
          adminApi.listDomains(),
        ]);
        if (cancelled) return;
        setAffiliates(affRes.affiliates as Affiliate[]);
        setProducts(prodRes.products as Product[]);
        setDomains(domainRes.domains as DomainItem[]);
      } catch (err) {
        if (!cancelled) {
          setCatalogError(
            err instanceof Error ? err.message : 'Failed to load catalog'
          );
        }
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    }

    loadCatalog();
    return () => {
      cancelled = true;
    };
  }, [authReady, isAuthenticated, currentUser.role]);

  // Load affiliate portal data when logged in as affiliate
  useEffect(() => {
    if (!authReady || !isAuthenticated || currentUser.role !== 'Affiliate') {
      return;
    }

    let cancelled = false;

    async function loadPortal() {
      setAffiliatePortalLoading(true);
      setAffiliatePortalError(null);
      try {
        const [meRes, dashRes, patientsRes, ordersRes, productsRes, commissionsRes, paymentsRes] =
          await Promise.all([
            affiliateApi.me(),
            affiliateApi.dashboard(),
            affiliateApi.listPatients(),
            affiliateApi.listOrders(),
            affiliateApi.listProducts(),
            affiliateApi.listCommissions(),
            affiliateApi.listPayments(),
          ]);
        if (cancelled) return;

        setActiveAffiliateId(meRes.profile.id);
        setCurrentAffiliateProfile(mapPortalProfile(meRes.profile));
        setDefaultMarkup(meRes.profile.defaultMarkup ?? 25);
        setCurrentAffiliatePatients(
          patientsRes.patients as AffiliatePatientItem[]
        );
        setCurrentAffiliateOrders(ordersRes.orders as AffiliateOrderItem[]);
        setAffiliateProducts(productsRes.products);
        setCurrentAffiliateCommissions(
          commissionsRes.commissions as AffiliateCommissionRecord[]
        );
        setCurrentAffiliatePayments(
          paymentsRes.payments as AffiliatePaymentPayout[]
        );
        setCurrentAffiliateSalesData(
          dashRes.salesData.map((d) => ({
            ...d,
            commission: 0,
          }))
        );
      } catch (err) {
        if (!cancelled) {
          setAffiliatePortalError(
            err instanceof Error ? err.message : 'Failed to load portal'
          );
        }
      } finally {
        if (!cancelled) setAffiliatePortalLoading(false);
      }
    }

    loadPortal();
    return () => {
      cancelled = true;
    };
  }, [authReady, isAuthenticated, currentUser.role, currentUser.affiliateId]);

  // =========================================================================
  // AUTH HANDLERS
  // =========================================================================
  const handleSignInSuccess = (userData: AppUser, token?: string) => {
    if (token) {
      saveAuthSession(token, userData);
    } else {
      const existing = getAuthToken();
      if (existing) saveAuthSession(existing, userData);
    }
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
    const mapped: AppUser = {
      name: userData.name,
      email: userData.email,
      role,
      affiliateId: userData.affiliateId || 'affiliate_001',
    };
    const existing = getAuthToken();
    if (existing) saveAuthSession(existing, mapped);
    setCurrentUser(mapped);
    setIsAuthenticated(true);
    if (role === 'Affiliate') {
      setActiveAffiliateId(mapped.affiliateId || 'affiliate_001');
      setCurrentAffiliateRoute('dashboard');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    setIsAuthenticated(false);
    setCurrentUser({ name: '', email: '', role: '' });
    setCurrentView('signin');
  };

  // Switch to Admin Console — removed (affiliates no longer switch into admin)
  // =========================================================================
  // AFFILIATE MUTATION HANDLERS
  // =========================================================================
  const handleAddPatient = async (newPatient: AffiliatePatientItem) => {
    try {
      const { patient } = await affiliateApi.createPatient({
        name: newPatient.name,
        email: newPatient.email,
        phone: newPatient.phone,
        plan: newPatient.plan,
      });
      setCurrentAffiliatePatients((prev) => [
        patient as AffiliatePatientItem,
        ...prev,
      ]);
      setIsAddPatientModalOpen(false);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to add customer');
    }
  };

  const handleUpdateProfile = (updated: Partial<AffiliateProfile>) => {
    setCurrentAffiliateProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleAccountUserUpdated = (user: AppUser) => {
    setCurrentUser(user);
  };

  const handleSetAffiliateProductPrice = async (
    productId: string,
    sellingPrice: number
  ) => {
    const { product } = await affiliateApi.setProductPrice(
      productId,
      sellingPrice
    );
    setAffiliateProducts((prev) =>
      prev.map((p) => (p.id === productId ? product : p))
    );
  };

  const refreshAffiliateProducts = async () => {
    const { products: list } = await affiliateApi.listProducts();
    setAffiliateProducts(list);
  };

  // Reload catalog whenever affiliate opens Products
  useEffect(() => {
    if (
      currentUser.role !== 'Affiliate' ||
      currentAffiliateRoute !== 'products' ||
      !isAuthenticated
    ) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { products: list } = await affiliateApi.listProducts();
        if (!cancelled) setAffiliateProducts(list);
      } catch {
        /* keep existing list */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentAffiliateRoute, currentUser.role, isAuthenticated]);

  // =========================================================================
  // MASTER ADMIN HANDLERS
  // =========================================================================
  const handleCreateAffiliate = async (
    newAffData: Omit<
      Affiliate,
      'id' | 'patientsCount' | 'ordersCount' | 'revenue' | 'commission' | 'growth' | 'createdAt' | 'logoUrl'
    > & { ownerPassword: string },
    logoFile?: File | null
  ) => {
    const customDomain =
      newAffData.domain &&
      !newAffData.domain.endsWith('.leanbloom.com') &&
      newAffData.domain !== newAffData.subdomain
        ? newAffData.domain
        : undefined;

    const result = await adminApi.createAffiliate(
      {
        name: newAffData.name,
        slug: newAffData.slug,
        contactName: newAffData.contactName,
        contactEmail: newAffData.contactEmail,
        contactPhone: newAffData.contactPhone,
        address: newAffData.address,
        status: newAffData.status,
        defaultMarkup: newAffData.defaultMarkup,
        primaryColor: newAffData.primaryColor,
        secondaryColor: newAffData.secondaryColor,
        portalTitle: newAffData.portalTitle,
        tagline: newAffData.tagline,
        welcomeMessage: newAffData.welcomeMessage,
        supportEmail: newAffData.supportEmail,
        supportPhone: newAffData.supportPhone,
        businessHours: newAffData.businessHours,
        hidePoweredBy: newAffData.hidePoweredBy,
        trustBadgeText: newAffData.trustBadgeText,
        clinicalPartnerNote: newAffData.clinicalPartnerNote,
        customDomain,
        ownerPassword: newAffData.ownerPassword,
      },
      logoFile
    );
    setAffiliates((prev) => [result.affiliate as Affiliate, ...prev]);
    setIsCreateAffiliateOpen(false);
  };

  const handleUpdateAffiliate = async (
    id: string,
    data: {
      name: string;
      contactName: string;
      contactEmail: string;
      contactPhone?: string;
      address?: string;
      status: Affiliate['status'];
      defaultMarkup: number;
      primaryColor: string;
      secondaryColor: string;
      portalTitle?: string;
      tagline?: string;
      welcomeMessage?: string;
      supportEmail?: string;
      supportPhone?: string;
      businessHours?: string;
      hidePoweredBy?: boolean;
      trustBadgeText?: string;
      clinicalPartnerNote?: string;
      ownerPassword?: string;
    },
    logoFile?: File | null
  ) => {
    const { affiliate } = await adminApi.updateAffiliate(
      id,
      {
        name: data.name,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        address: data.address,
        status: data.status,
        defaultMarkup: data.defaultMarkup,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        portalTitle: data.portalTitle,
        tagline: data.tagline,
        welcomeMessage: data.welcomeMessage,
        supportEmail: data.supportEmail,
        supportPhone: data.supportPhone,
        businessHours: data.businessHours,
        hidePoweredBy: data.hidePoweredBy,
        trustBadgeText: data.trustBadgeText,
        clinicalPartnerNote: data.clinicalPartnerNote,
        ownerPassword: data.ownerPassword,
      },
      logoFile
    );
    setAffiliates((prev) =>
      prev.map((a) => (a.id === id ? (affiliate as Affiliate) : a))
    );
    if (selectedAffiliate?.id === id) {
      setSelectedAffiliate(affiliate as Affiliate);
    }
    setEditAffiliateTarget(null);
  };

  const handleDeleteAffiliate = async (affId: string) => {
    const current = affiliates.find((a) => a.id === affId);
    if (!current) return;
    const ok = window.confirm(
      `Delete “${current.name}”? This cannot be undone if the affiliate has no patients or orders.`
    );
    if (!ok) return;
    try {
      await adminApi.deleteAffiliate(affId);
      setAffiliates((prev) => prev.filter((a) => a.id !== affId));
      if (selectedAffiliate?.id === affId) {
        setSelectedAffiliate(null);
      }
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to delete affiliate');
    }
  };

  const handleToggleAffiliateStatus = async (affId: string) => {
    const current = affiliates.find((a) => a.id === affId);
    if (!current) return;
    const nextStatus = current.status === 'Active' ? 'Suspended' : 'Active';
    try {
      const { affiliate } = await adminApi.updateAffiliate(affId, {
        status: nextStatus,
      });
      setAffiliates((prev) =>
        prev.map((a) => (a.id === affId ? (affiliate as Affiliate) : a))
      );
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to update affiliate');
    }
  };

  const handleCreateProduct = async (
    newProdData: Omit<Product, 'id' | 'activeAffiliatesCount' | 'ordersCount' | 'imageUrl'>,
    imageFile?: File | null
  ) => {
    const { product } = await adminApi.createProduct(
      {
        name: newProdData.name,
        category: newProdData.category,
        description: newProdData.description,
        basePrice: newProdData.basePrice,
        minimumPrice: newProdData.minimumPrice,
        status: newProdData.status,
        stockStatus: newProdData.stockStatus,
      },
      imageFile
    );
    setProducts((prev) => [product as Product, ...prev]);
    setIsCreateProductOpen(false);
  };

  const handleUpdateProduct = async (
    productId: string,
    data: Omit<Product, 'id' | 'activeAffiliatesCount' | 'ordersCount' | 'imageUrl'>,
    imageFile?: File | null
  ) => {
    const { product } = await adminApi.updateProduct(
      productId,
      {
        name: data.name,
        category: data.category,
        description: data.description,
        basePrice: data.basePrice,
        minimumPrice: data.minimumPrice,
        status: data.status,
        stockStatus: data.stockStatus,
      },
      imageFile
    );
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? (product as Product) : p))
    );
    setEditProductTarget(null);
  };

  const handleDeleteProduct = async (prodId: string) => {
    const current = products.find((p) => p.id === prodId);
    if (!current) return;
    const ok = window.confirm(
      `Delete “${current.name}”? This removes it from the catalog and affiliate price rules.`
    );
    if (!ok) return;
    try {
      await adminApi.deleteProduct(prodId);
      setProducts((prev) => prev.filter((p) => p.id !== prodId));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const handleToggleProductStatus = async (prodId: string) => {
    const current = products.find((p) => p.id === prodId);
    if (!current) return;
    const nextStatus = current.status === 'Active' ? 'Draft' : 'Active';
    try {
      const { product } = await adminApi.updateProduct(prodId, {
        status: nextStatus,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === prodId ? (product as Product) : p))
      );
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  const handleSavePricing = async (
    productId: string,
    newBasePrice: number,
    newMinimumPrice: number
  ) => {
    try {
      const { product } = await adminApi.updateProduct(productId, {
        basePrice: newBasePrice,
        minimumPrice: newMinimumPrice,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? (product as Product) : p))
      );
      setEditPricingProduct(null);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to update pricing');
    }
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

  const handleAddDomain = async (payload: {
    affiliateId: string;
    domain: string;
    type?: 'Custom Domain' | 'Platform Subdomain';
    target?: string;
    isPrimary?: boolean;
  }) => {
    const { domain } = await adminApi.createDomain(payload);
    setDomains((prev) => [domain as DomainItem, ...prev]);
  };

  const handleTogglePrimaryDomain = async (domainId: string) => {
    const { domain } = await adminApi.updateDomain(domainId, {
      isPrimary: true,
    });
    setDomains((prev) =>
      prev.map((d) =>
        d.affiliateId === domain.affiliateId
          ? {
              ...d,
              primary: d.id === domainId,
              ...(d.id === domainId ? (domain as DomainItem) : {}),
            }
          : d
      )
    );
  };

  const handleDeleteDomain = async (domainId: string) => {
    const current = domains.find((d) => d.id === domainId);
    if (!current) return;
    if (current.type === 'Platform Subdomain') {
      window.alert('Platform subdomains cannot be deleted.');
      return;
    }
    const ok = window.confirm(`Delete domain “${current.domain}”?`);
    if (!ok) return;
    try {
      await adminApi.deleteDomain(domainId);
      setDomains((prev) => prev.filter((d) => d.id !== domainId));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to delete domain');
    }
  };

  const handleReverifyDomain = async (domainId: string) => {
    try {
      const { domain } = await adminApi.verifyDomain(domainId);
      setDomains((prev) =>
        prev.map((d) => (d.id === domainId ? (domain as DomainItem) : d))
      );
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to verify domain');
    }
  };

  const handleSaveAffiliateBranding = async (updatedAffiliate: Affiliate) => {
    const { affiliate } = await adminApi.updateAffiliate(updatedAffiliate.id, {
      name: updatedAffiliate.name,
      primaryColor: updatedAffiliate.primaryColor,
      secondaryColor: updatedAffiliate.secondaryColor,
      portalTitle: updatedAffiliate.portalTitle,
      tagline: updatedAffiliate.tagline,
      welcomeMessage: updatedAffiliate.welcomeMessage,
      supportEmail: updatedAffiliate.supportEmail,
      supportPhone: updatedAffiliate.supportPhone,
      hidePoweredBy: updatedAffiliate.hidePoweredBy,
      fontFamily: updatedAffiliate.fontFamily,
      borderRadius: updatedAffiliate.borderRadius,
      headerTheme: updatedAffiliate.headerTheme,
      logoUrl: updatedAffiliate.logoUrl,
    });
    setAffiliates((prev) =>
      prev.map((a) =>
        a.id === updatedAffiliate.id ? (affiliate as Affiliate) : a
      )
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
      clearAuthToken();
      setIsAuthenticated(false);
      setCurrentUser({ name: '', email: '', role: '' });
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

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-lb-gradient animate-pulse" />
          <p className="text-sm text-[#5B6B7C] font-display">Loading LeanBloom…</p>
        </div>
      </div>
    );
  }

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
          id: currentAffiliateProfile.id || currentUser.affiliateId || '',
          name: currentAffiliateProfile.name || currentUser.name,
          email: currentAffiliateProfile.email || currentUser.email,
          role: 'affiliate',
          affiliateId: activeAffiliateId || currentUser.affiliateId || '',
          affiliateName: currentAffiliateProfile.name || currentUser.name,
        }}
        onLogout={handleLogout}
      >
        {affiliatePortalError && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
            {affiliatePortalError}
          </div>
        )}
        {affiliatePortalLoading && (
          <div className="mb-4 text-sm text-[#5B6B7C]">Loading your portal…</div>
        )}

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

        {currentAffiliateRoute === 'products' && (
          <AffiliateProductsView
            products={affiliateProducts}
            defaultMarkup={defaultMarkup}
            onSetPrice={handleSetAffiliateProductPrice}
            onRefresh={refreshAffiliateProducts}
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
            accountUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            onAccountUpdated={handleAccountUserUpdated}
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

  // 3. Authenticated as Admin: Render Admin Console
  return (
    <div className="h-screen overflow-hidden bg-white text-[#1A2332] flex flex-col font-sans">
      <div className="lg:pl-0 flex-1 flex min-h-0 overflow-hidden">
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          unreadNotificationsCount={notifications.filter((n) => !n.read).length}
          affiliateCount={affiliates.length}
        />

        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <Header
            currentView={currentView}
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            notifications={notifications}
            onOpenNotifications={() => setCurrentView('notifications')}
            onLogout={handleLogout}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-white">
            <div className="max-w-7xl w-full mx-auto">
            {catalogError && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
                {catalogError}
              </div>
            )}
            {catalogLoading && (
              <div className="mb-4 text-sm text-[#5B6B7C]">Loading affiliates & products…</div>
            )}
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
                onOpenEditAffiliate={(aff) => setEditAffiliateTarget(aff)}
                onToggleAffiliateStatus={handleToggleAffiliateStatus}
                onDeleteAffiliate={handleDeleteAffiliate}
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
                onOpenEditProduct={(prod) => setEditProductTarget(prod)}
                onOpenEditPricing={(prod) => setEditPricingProduct(prod)}
                onToggleProductStatus={handleToggleProductStatus}
                onDeleteProduct={handleDeleteProduct}
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

            {/* 7. REPORTS */}
            {currentView === 'reports' && (
              <ReportsView affiliates={affiliates} products={products} />
            )}

            {/* 8. SYSTEM */}
            {currentView === 'profile' && (
              <AdminProfileView
                currentUser={currentUser}
                onUserUpdated={handleAccountUserUpdated}
              />
            )}

            {(currentView === 'settings' ||
              currentView === 'notifications' ||
              currentView === 'users-roles') && (
              <SystemView
                initialSub={currentView as 'notifications' | 'users-roles' | 'settings'}
                notifications={notifications}
                users={adminUsers}
                onMarkNotificationRead={handleMarkNotificationRead}
                onAddUser={handleAddAdminUser}
              />
            )}
            </div>
          </main>
        </div>
      </div>

      {/* GLOBAL MASTER ADMIN MODALS */}
      <CreateAffiliateModal
        isOpen={isCreateAffiliateOpen}
        onClose={() => setIsCreateAffiliateOpen(false)}
        onCreate={handleCreateAffiliate}
      />

      <EditAffiliateModal
        isOpen={Boolean(editAffiliateTarget)}
        affiliate={editAffiliateTarget}
        onClose={() => setEditAffiliateTarget(null)}
        onSave={handleUpdateAffiliate}
      />

      <CreateProductModal
        isOpen={isCreateProductOpen}
        onClose={() => setIsCreateProductOpen(false)}
        onCreate={handleCreateProduct}
      />

      <EditProductModal
        isOpen={Boolean(editProductTarget)}
        product={editProductTarget}
        onClose={() => setEditProductTarget(null)}
        onSave={handleUpdateProduct}
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
