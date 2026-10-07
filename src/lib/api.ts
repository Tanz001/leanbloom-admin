const API_BASE =
  (import.meta as ImportMeta & { env: Record<string, string> }).env
    ?.VITE_API_URL || 'http://localhost:4000';

export type ApiAuthUser = {
  id: string;
  name: string;
  email: string;
  portal: 'admin' | 'affiliate';
  role: string;
  status: string;
  affiliateId?: string;
  affiliateName?: string;
  affiliateStatus?: string;
  avatarUrl?: string | null;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: ApiAuthUser;
};

export type AppUser = {
  name: string;
  email: string;
  role: string;
  affiliateId?: string;
};

const TOKEN_KEY = 'leanbloom_auth_token';
const USER_KEY = 'leanbloom_auth_user';

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };

  // Let the browser set multipart boundary for FormData
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      `Cannot reach API at ${API_BASE}. Is the backend running (npm run dev in /backend)?`
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message || `Request failed (${res.status})`
    );
  }
  return data as T;
}

/** Resolve stored image paths (e.g. /uploads/...) to absolute URLs */
export function mediaUrl(path?: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

export const authApi = {
  login(email: string, password: string) {
    return request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  me() {
    return request<{ user: ApiAuthUser }>('/api/auth/me', { method: 'GET' }, true);
  },

  updateProfile(name: string) {
    return request<LoginResponse>('/api/auth/me', {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    }, true);
  },

  changePassword(currentPassword: string, newPassword: string) {
    return request<{ message: string }>(
      '/api/auth/change-password',
      {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      },
      true
    );
  },
};

export type ApiAffiliate = {
  id: string;
  name: string;
  slug: string;
  domain: string;
  subdomain: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  status: 'Active' | 'Pending' | 'Inactive' | 'Suspended';
  defaultMarkup: number;
  commissionRate: number;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  tagline?: string;
  portalTitle?: string;
  welcomeMessage?: string;
  supportEmail?: string;
  supportPhone?: string;
  businessHours?: string;
  hidePoweredBy?: boolean;
  trustBadgeText?: string;
  clinicalPartnerNote?: string;
  fontFamily?: string;
  borderRadius?: string;
  headerTheme?: string;
  patientsCount: number;
  ordersCount: number;
  revenue: number;
  commission: number;
  growth: string;
  createdAt: string;
};

export type ApiProduct = {
  id: string;
  name: string;
  category:
    | 'Medical Program'
    | 'Telehealth Consult'
    | 'Prescription Refill'
    | 'Wellness Pack';
  description: string;
  imageUrl?: string | null;
  buyUrl?: string | null;
  basePrice: number;
  minimumPrice: number;
  status: 'Active' | 'Draft' | 'Archived';
  stockStatus: 'In Stock' | 'Compounding' | 'Backorder';
  activeAffiliatesCount: number;
  ordersCount: number;
};

export type DomainItemDto = {
  id: string;
  affiliateId: string;
  affiliateName: string;
  domain: string;
  type: 'Custom Domain' | 'Platform Subdomain';
  target: string;
  status: 'Active' | 'Pending DNS' | 'SSL Generating' | 'Configuration Error';
  sslStatus: 'Valid' | 'Issuing' | 'Expiring Soon' | 'Failed';
  sslExpiry: string;
  dnsRecords: {
    type: 'CNAME' | 'A' | 'TXT';
    host: string;
    value: string;
    status: 'Verified' | 'Pending' | 'Error';
    ttl: string;
  }[];
  primary: boolean;
  hstsEnabled: boolean;
  createdAt: string;
  lastVerified: string;
  edgeLatencyMs?: number;
};

export type CreateAffiliatePayload = {
  name: string;
  slug?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  status?: 'Active' | 'Pending' | 'Inactive' | 'Suspended';
  defaultMarkup?: number;
  commissionRate?: number;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string | null;
  portalTitle?: string;
  tagline?: string;
  welcomeMessage?: string;
  supportEmail?: string;
  supportPhone?: string;
  businessHours?: string;
  hidePoweredBy?: boolean;
  trustBadgeText?: string;
  clinicalPartnerNote?: string;
  customDomain?: string;
  fontFamily?: string;
  borderRadius?: string;
  headerTheme?: string;
  ownerPassword: string;
};

export type CreateProductPayload = {
  name: string;
  category: ApiProduct['category'];
  description?: string;
  buyUrl?: string | null;
  basePrice: number;
  minimumPrice: number;
  status?: ApiProduct['status'];
  stockStatus?: ApiProduct['stockStatus'];
};

export const adminApi = {
  listAffiliates(status?: string) {
    const q = status ? `?status=${encodeURIComponent(status)}` : '';
    return request<{ affiliates: ApiAffiliate[] }>(
      `/api/admin/affiliates${q}`,
      { method: 'GET' },
      true
    );
  },

  createAffiliate(payload: CreateAffiliatePayload, logoFile?: File | null) {
    const form = new FormData();
    form.append('name', payload.name);
    if (payload.slug) form.append('slug', payload.slug);
    form.append('contactName', payload.contactName);
    form.append('contactEmail', payload.contactEmail);
    if (payload.contactPhone != null) {
      form.append('contactPhone', payload.contactPhone);
    }
    if (payload.address != null) form.append('address', payload.address);
    if (payload.status) form.append('status', payload.status);
    if (payload.defaultMarkup != null) {
      form.append('defaultMarkup', String(payload.defaultMarkup));
    }
    if (payload.commissionRate != null) {
      form.append('commissionRate', String(payload.commissionRate));
    }
    if (payload.primaryColor) form.append('primaryColor', payload.primaryColor);
    if (payload.secondaryColor) {
      form.append('secondaryColor', payload.secondaryColor);
    }
    if (payload.portalTitle) form.append('portalTitle', payload.portalTitle);
    if (payload.tagline) form.append('tagline', payload.tagline);
    if (payload.welcomeMessage) {
      form.append('welcomeMessage', payload.welcomeMessage);
    }
    if (payload.supportEmail) form.append('supportEmail', payload.supportEmail);
    if (payload.supportPhone) form.append('supportPhone', payload.supportPhone);
    if (payload.businessHours) {
      form.append('businessHours', payload.businessHours);
    }
    if (payload.hidePoweredBy != null) {
      form.append('hidePoweredBy', String(payload.hidePoweredBy));
    }
    if (payload.trustBadgeText) {
      form.append('trustBadgeText', payload.trustBadgeText);
    }
    if (payload.clinicalPartnerNote) {
      form.append('clinicalPartnerNote', payload.clinicalPartnerNote);
    }
    if (payload.customDomain) form.append('customDomain', payload.customDomain);
    form.append('ownerPassword', payload.ownerPassword);
    if (logoFile) form.append('logo', logoFile);

    return request<{
      message: string;
      affiliate: ApiAffiliate;
    }>('/api/admin/affiliates', { method: 'POST', body: form }, true);
  },

  updateAffiliate(
    id: string,
    payload: Partial<CreateAffiliatePayload>,
    logoFile?: File | null
  ) {
    if (logoFile || payload.ownerPassword) {
      const form = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.append(key, String(value));
        }
      });
      if (logoFile) form.append('logo', logoFile);
      return request<{ message: string; affiliate: ApiAffiliate }>(
        `/api/admin/affiliates/${id}`,
        { method: 'PATCH', body: form },
        true
      );
    }

    return request<{ message: string; affiliate: ApiAffiliate }>(
      `/api/admin/affiliates/${id}`,
      { method: 'PATCH', body: JSON.stringify(payload) },
      true
    );
  },

  deleteAffiliate(id: string) {
    return request<{ message: string }>(
      `/api/admin/affiliates/${id}`,
      { method: 'DELETE' },
      true
    );
  },

  listDomains() {
    return request<{ domains: DomainItemDto[] }>(
      '/api/admin/domains',
      { method: 'GET' },
      true
    );
  },

  createDomain(payload: {
    affiliateId: string;
    domain: string;
    type?: 'Custom Domain' | 'Platform Subdomain';
    target?: string;
    isPrimary?: boolean;
  }) {
    return request<{ message: string; domain: DomainItemDto }>(
      '/api/admin/domains',
      { method: 'POST', body: JSON.stringify(payload) },
      true
    );
  },

  updateDomain(
    id: string,
    payload: { isPrimary?: boolean; status?: string; hstsEnabled?: boolean }
  ) {
    return request<{ message: string; domain: DomainItemDto }>(
      `/api/admin/domains/${id}`,
      { method: 'PATCH', body: JSON.stringify(payload) },
      true
    );
  },

  verifyDomain(id: string) {
    return request<{ message: string; domain: DomainItemDto }>(
      `/api/admin/domains/${id}/verify`,
      { method: 'POST' },
      true
    );
  },

  deleteDomain(id: string) {
    return request<{ message: string }>(
      `/api/admin/domains/${id}`,
      { method: 'DELETE' },
      true
    );
  },

  listProducts(status?: string) {
    const q = status ? `?status=${encodeURIComponent(status)}` : '';
    return request<{ products: ApiProduct[] }>(
      `/api/admin/products${q}`,
      { method: 'GET' },
      true
    );
  },

  listPricing() {
    return request<{
      pricing: {
        productId: string;
        productName: string;
        basePrice: number;
        minimumPrice: number;
        activeAffiliates: number;
        affiliatePrices: {
          affiliateId: string;
          affiliateName: string;
          sellingPrice: number;
        }[];
      }[];
    }>('/api/admin/pricing', { method: 'GET' }, true);
  },

  createProduct(payload: CreateProductPayload, imageFile?: File | null) {
    const form = new FormData();
    form.append('name', payload.name);
    form.append('category', payload.category);
    if (payload.description != null) {
      form.append('description', payload.description);
    }
    if (payload.buyUrl != null) {
      form.append('buyUrl', payload.buyUrl);
    }
    form.append('basePrice', String(payload.basePrice));
    form.append('minimumPrice', String(payload.minimumPrice));
    if (payload.status) form.append('status', payload.status);
    if (payload.stockStatus) form.append('stockStatus', payload.stockStatus);
    if (imageFile) form.append('image', imageFile);

    return request<{ message: string; product: ApiProduct }>(
      '/api/admin/products',
      { method: 'POST', body: form },
      true
    );
  },

  updateProduct(
    id: string,
    payload: Partial<CreateProductPayload>,
    imageFile?: File | null
  ) {
    if (imageFile) {
      const form = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.append(key, String(value));
        }
      });
      form.append('image', imageFile);
      return request<{ message: string; product: ApiProduct }>(
        `/api/admin/products/${id}`,
        { method: 'PATCH', body: form },
        true
      );
    }

    return request<{ message: string; product: ApiProduct }>(
      `/api/admin/products/${id}`,
      { method: 'PATCH', body: JSON.stringify(payload) },
      true
    );
  },

  deleteProduct(id: string) {
    return request<{ message: string }>(
      `/api/admin/products/${id}`,
      { method: 'DELETE' },
      true
    );
  },
};

export type AffiliatePortalProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl?: string | null;
  basePrice: number;
  minimumPrice: number;
  stockStatus: string;
  status: string;
  sellingPrice: number | null;
  isPriced: boolean;
};

export type AffiliatePortalProfile = {
  id: string;
  name: string;
  tradingName?: string;
  email: string;
  phone: string;
  website: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  country: string;
  commissionRate: number;
  defaultMarkup: number;
  status: 'Active' | 'Pending' | 'Suspended';
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string | null;
  subdomain?: string;
  domain?: string;
  payoutMethod: 'Bank Transfer' | 'PayPal';
  bankName: string;
  routingNumberMasked: string;
  accountNumberMasked: string;
  accountHolderName: string;
  paypalEmailMasked: string;
  notificationPreferences: {
    newOrders: boolean;
    commissions: boolean;
    payments: boolean;
    weeklySummary: boolean;
    marketing: boolean;
  };
  twoFactorEnabled: boolean;
  lastLoginIp: string;
  lastLoginTime: string;
};

export const affiliateApi = {
  me() {
    return request<{ profile: AffiliatePortalProfile; user: ApiAuthUser }>(
      '/api/affiliate/me',
      { method: 'GET' },
      true
    );
  },

  dashboard() {
    return request<{
      stats: {
        patientsCount: number;
        ordersCount: number;
        revenue: number;
        pendingCommission: number;
      };
      salesData: {
        date: string;
        label: string;
        revenue: number;
        orders: number;
        patients: number;
      }[];
      recentOrders: unknown[];
      recentPatients: unknown[];
    }>('/api/affiliate/dashboard', { method: 'GET' }, true);
  },

  listProducts() {
    return request<{ products: AffiliatePortalProduct[] }>(
      '/api/affiliate/products',
      { method: 'GET' },
      true
    );
  },

  setProductPrice(productId: string, sellingPrice: number) {
    return request<{ message: string; product: AffiliatePortalProduct }>(
      `/api/affiliate/products/${productId}/price`,
      {
        method: 'PATCH',
        body: JSON.stringify({ sellingPrice }),
      },
      true
    );
  },

  listPatients() {
    return request<{ patients: unknown[] }>(
      '/api/affiliate/patients',
      { method: 'GET' },
      true
    );
  },

  createPatient(payload: {
    name: string;
    email: string;
    phone?: string;
    plan?: string;
  }) {
    return request<{ message: string; patient: unknown }>(
      '/api/affiliate/patients',
      { method: 'POST', body: JSON.stringify(payload) },
      true
    );
  },

  listOrders() {
    return request<{ orders: unknown[] }>(
      '/api/affiliate/orders',
      { method: 'GET' },
      true
    );
  },

  listCommissions() {
    return request<{ commissions: unknown[] }>(
      '/api/affiliate/commissions',
      { method: 'GET' },
      true
    );
  },

  listPayments() {
    return request<{ payments: unknown[] }>(
      '/api/affiliate/payments',
      { method: 'GET' },
      true
    );
  },
};

export function mapApiUserToAppRole(user: ApiAuthUser): AppUser {
  if (user.portal === 'affiliate') {
    return {
      name: user.name,
      email: user.email,
      role: 'Affiliate',
      affiliateId: user.affiliateId,
    };
  }
  return {
    name: user.name,
    email: user.email,
    role: 'Admin',
  };
}

export function saveAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function saveAuthSession(token: string, user: AppUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem('leanbloom_session_only');
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppUser;
  } catch {
    return null;
  }
}

/** Restore session from localStorage; optionally re-validate with /me */
export async function restoreSession(): Promise<{
  token: string;
  user: AppUser;
} | null> {
  const token = getAuthToken();
  const stored = getStoredUser();
  if (!token || !stored) {
    clearAuthToken();
    return null;
  }

  try {
    const { user } = await authApi.me();
    const mapped = mapApiUserToAppRole(user);
    saveAuthSession(token, mapped);
    return { token, user: mapped };
  } catch {
    // Token invalid/expired
    clearAuthToken();
    return null;
  }
}
