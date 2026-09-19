export type PageView =
  | 'dashboard'
  | 'affiliates'
  | 'affiliate-detail'
  | 'domains'
  | 'branding'
  | 'patients'
  | 'orders'
  | 'products'
  | 'pricing'
  | 'commissions'
  | 'payments'
  | 'reports'
  | 'notifications'
  | 'users-roles'
  | 'settings'
  | 'signin'
  | 'signup';

export type DateRangeOption = 'Today' | 'This Week' | 'This Month' | 'This Year' | 'Custom Range';

export interface Affiliate {
  id: string;
  name: string;
  slug: string;
  domain: string;
  subdomain: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: 'Active' | 'Pending' | 'Inactive' | 'Suspended';
  patientsCount: number;
  ordersCount: number;
  revenue: number;
  commission: number;
  growth: string;
  createdAt: string;
  primaryColor: string;
  secondaryColor: string;
  defaultMarkup: number; // percentage
  logoUrl?: string;
  address?: string;
  tagline?: string;
  fontFamily?: 'Plus Jakarta Sans' | 'Inter' | 'Outfit' | 'DM Sans' | 'Playfair Display';
  borderRadius?: 'rounded-md' | 'rounded-lg' | 'rounded-xl' | 'rounded-full';
  headerTheme?: 'white' | 'navy' | 'dark' | 'cream';
  portalTitle?: string;
  welcomeMessage?: string;
  supportEmail?: string;
  supportPhone?: string;
  hidePoweredBy?: boolean;
  termsUrl?: string;
  privacyUrl?: string;
  customCss?: string;
}

export interface DNSRecord {
  type: 'CNAME' | 'A' | 'TXT';
  host: string;
  value: string;
  status: 'Verified' | 'Pending' | 'Error';
  ttl: string;
}

export interface DomainItem {
  id: string;
  affiliateId: string;
  affiliateName: string;
  domain: string;
  type: 'Custom Domain' | 'Platform Subdomain';
  target: string;
  status: 'Active' | 'Pending DNS' | 'SSL Generating' | 'Configuration Error';
  sslStatus: 'Valid' | 'Issuing' | 'Expiring Soon' | 'Failed';
  sslExpiry: string;
  dnsRecords: DNSRecord[];
  primary: boolean;
  hstsEnabled: boolean;
  createdAt: string;
  lastVerified: string;
  edgeLatencyMs?: number;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  affiliateId: string;
  affiliateName: string;
  ordersCount: number;
  totalSpent: number;
  status: 'Active' | 'Pending Intake' | 'Inactive';
  lastActivity: string;
  joinedDate: string;
  activeProgram: string;
  prescriptionsCount: number;
}

export interface Order {
  id: string;
  patientName: string;
  patientEmail: string;
  affiliateId: string;
  affiliateName: string;
  productName: string;
  amount: number;
  status: 'Completed' | 'Processing' | 'Pending' | 'Cancelled' | 'Refunded';
  date: string;
  paymentMethod: string;
  shippingStatus?: 'Delivered' | 'In Transit' | 'Fulfillment Queue' | 'Pending Lab';
}

export interface Product {
  id: string;
  name: string;
  category: 'Medical Program' | 'Telehealth Consult' | 'Prescription Refill' | 'Wellness Pack';
  basePrice: number; // LeanBloom wholesale cost
  minimumPrice: number; // Minimum allowed retail price across affiliates
  activeAffiliatesCount: number;
  ordersCount: number;
  status: 'Active' | 'Draft' | 'Archived';
  description: string;
  stockStatus: 'In Stock' | 'Compounding' | 'Backorder';
}

export interface AffiliatePriceRule {
  productId: string;
  productName: string;
  basePrice: number;
  minimumPrice: number;
  activeAffiliates: number;
  affiliatePriceExamples: {
    affiliateName: string;
    sellingPrice: number;
  }[];
}

export interface CommissionRecord {
  id: string;
  affiliateId: string;
  affiliateName: string;
  ordersCount: number;
  grossSales: number;
  baseRevenue: number;
  markup: number;
  commissionEarned: number;
  amountPayable: number;
  paymentStatus: 'Paid' | 'Pending' | 'Processing';
  payoutDate: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  affiliateId: string;
  affiliateName: string;
  grossAmount: number;
  commission: number;
  netLeanBloom: number;
  status: 'Paid' | 'Pending' | 'Processing' | 'Failed' | 'Refunded';
  date: string;
  method: 'Stripe Direct' | 'ACH Transfer' | 'Credit Card' | 'Wire';
}

export interface AuditLog {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  target: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  category: 'Pricing' | 'Affiliate' | 'Product' | 'Security' | 'Payment';
  ipAddress: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'Information' | 'Success' | 'Warning' | 'Critical';
  read: boolean;
  category: 'Affiliate' | 'Order' | 'Payment' | 'System' | 'Inventory';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin';
  status: 'Active' | 'Invited' | 'Suspended';
  lastLogin: string;
  createdAt: string;
  avatarUrl?: string;
}

// ==========================================
// AFFILIATE DASHBOARD MULTI-TENANT TYPES
// ==========================================

export type AffiliateRoute =
  | 'dashboard'
  | 'patients'
  | 'orders'
  | 'sales'
  | 'commissions'
  | 'payments'
  | 'settings'
  | 'support';

export interface AffiliateUserSession {
  id: string;
  affiliateId: string;
  name: string;
  email: string;
  role: 'affiliate' | 'master_admin';
  affiliateName: string;
  avatarUrl?: string;
}

export interface AffiliateProfile {
  id: string; // e.g. affiliate_001
  name: string; // e.g. Wellness Partner LLC
  tradingName?: string;
  email: string;
  phone: string;
  website: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  country: string;
  commissionRate: number; // percentage, e.g. 15%
  status: 'Active' | 'Pending' | 'Suspended';
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
}

export interface AffiliatePatientItem {
  id: string;
  affiliateId: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  ordersCount: number;
  totalSpent: number;
  status: 'Active' | 'Inactive' | 'Pending';
  plan: string;
  address: string;
  notes?: string;
}

export interface AffiliateOrderItem {
  id: string;
  affiliateId: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  productName: string;
  productCategory: string;
  quantity: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  commissionRate: number;
  commissionAmount: number;
  commissionStatus: 'Approved' | 'Pending' | 'Paid' | 'Rejected';
  orderStatus: 'Pending' | 'Processing' | 'Completed' | 'Cancelled' | 'Refunded';
  paymentMethod: string;
  timeline: {
    step: string;
    date: string;
    completed: boolean;
    current?: boolean;
    description?: string;
  }[];
}

export interface AffiliateCommissionRecord {
  id: string;
  orderId: string;
  affiliateId: string;
  patientName: string;
  orderDate: string;
  orderAmount: number;
  commissionRate: number;
  commission: number;
  status: 'Pending' | 'Approved' | 'Paid' | 'Rejected';
  date: string;
}

export interface AffiliatePaymentPayout {
  id: string;
  affiliateId: string;
  date: string;
  amount: number;
  method: 'Bank Transfer' | 'PayPal' | 'ACH Direct';
  reference: string;
  status: 'Paid' | 'Pending' | 'Processing' | 'Failed';
  coveredOrdersCount: number;
  accountDestination: string;
  notes?: string;
}

export interface AffiliateSalesDataPoint {
  date: string;
  label: string;
  revenue: number;
  orders: number;
  patients: number;
  commission: number;
}
