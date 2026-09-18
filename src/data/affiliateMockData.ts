import {
  AffiliateProfile,
  AffiliatePatientItem,
  AffiliateOrderItem,
  AffiliateCommissionRecord,
  AffiliatePaymentPayout,
  AffiliateSalesDataPoint
} from '../types';

export const MOCK_AFFILIATE_PROFILES: Record<string, AffiliateProfile> = {
  affiliate_001: {
    id: 'affiliate_001',
    name: 'Wellness Partner LLC',
    tradingName: 'Wellness Partner Clinic',
    email: 'contact@wellnesspartner.com',
    phone: '+1 (555) 234-5678',
    website: 'https://wellnesspartner.leanbloom.com',
    businessName: 'Wellness Partner Healthcare LLC',
    businessEmail: 'billing@wellnesspartner.com',
    businessPhone: '+1 (555) 234-5679',
    businessAddress: '1400 Broadway Blvd, Suite 400, Austin, TX 78701',
    country: 'United States',
    commissionRate: 15,
    status: 'Active',
    payoutMethod: 'Bank Transfer',
    bankName: 'JPMorgan Chase Healthcare Treasury',
    routingNumberMasked: '••••3291',
    accountNumberMasked: '••••••••6712',
    accountHolderName: 'Wellness Partner LLC Operating',
    paypalEmailMasked: 'payouts@wellnesspartner.com',
    notificationPreferences: {
      newOrders: true,
      commissions: true,
      payments: true,
      weeklySummary: true,
      marketing: false
    },
    twoFactorEnabled: true,
    lastLoginIp: '198.51.100.42 (Austin, TX)',
    lastLoginTime: 'Today at 07:14 AM'
  },
  affiliate_002: {
    id: 'affiliate_002',
    name: 'Apex Health Telehealth',
    tradingName: 'Apex Health Longevity',
    email: 'hello@apexhealth.org',
    phone: '+1 (555) 789-0123',
    website: 'https://apexhealth.leanbloom.com',
    businessName: 'Apex Health Telehealth Inc.',
    businessEmail: 'finance@apexhealth.org',
    businessPhone: '+1 (555) 789-0124',
    businessAddress: '880 Ocean Ave, Suite 210, Santa Monica, CA 90403',
    country: 'United States',
    commissionRate: 18,
    status: 'Active',
    payoutMethod: 'Bank Transfer',
    bankName: 'Silicon Valley Bank (First Citizens)',
    routingNumberMasked: '••••1210',
    accountNumberMasked: '••••••••4489',
    accountHolderName: 'Apex Health Telehealth Inc',
    paypalEmailMasked: 'treasury@apexhealth.org',
    notificationPreferences: {
      newOrders: true,
      commissions: true,
      payments: true,
      weeklySummary: false,
      marketing: true
    },
    twoFactorEnabled: true,
    lastLoginIp: '203.0.113.19 (Los Angeles, CA)',
    lastLoginTime: 'Yesterday at 04:30 PM'
  },
  affiliate_003: {
    id: 'affiliate_003',
    name: 'BioVitality Longevity Hub',
    tradingName: 'BioVitality Clinic',
    email: 'admin@biovitality.health',
    phone: '+1 (555) 432-8811',
    website: 'https://biovitality.leanbloom.com',
    businessName: 'BioVitality Medical Corp',
    businessEmail: 'accounts@biovitality.health',
    businessPhone: '+1 (555) 432-8812',
    businessAddress: '2200 Market St, Denver, CO 80205',
    country: 'United States',
    commissionRate: 14,
    status: 'Active',
    payoutMethod: 'PayPal',
    bankName: 'Wells Fargo Commercial',
    routingNumberMasked: '••••7740',
    accountNumberMasked: '••••••••9031',
    accountHolderName: 'BioVitality Medical Corp',
    paypalEmailMasked: 'pay@biovitality.health',
    notificationPreferences: {
      newOrders: true,
      commissions: true,
      payments: true,
      weeklySummary: true,
      marketing: true
    },
    twoFactorEnabled: false,
    lastLoginIp: '198.51.100.89 (Denver, CO)',
    lastLoginTime: 'Sep 16, 2026 at 09:12 AM'
  }
};

// ----------------------------------------------------
// PATIENTS (Scoped by affiliateId)
// ----------------------------------------------------
export const MOCK_AFFILIATE_PATIENTS: AffiliatePatientItem[] = [
  // Affiliate 001 (Wellness Partner LLC)
  {
    id: 'pat-001',
    affiliateId: 'affiliate_001',
    name: 'Sarah Johnson',
    email: 'sarah.j@gmail.com',
    phone: '+1 (555) 234-9812',
    joinedDate: 'Jan 20, 2026',
    ordersCount: 6,
    totalSpent: 1894,
    status: 'Active',
    plan: 'GLP-1 Weight Management',
    address: '742 Evergreen Terrace, Austin, TX 78704',
    notes: 'Responsive patient, stable titration protocol. No adverse GI symptoms.'
  },
  {
    id: 'pat-002',
    affiliateId: 'affiliate_001',
    name: 'David Miller',
    email: 'davidm78@gmail.com',
    phone: '+1 (555) 439-0021',
    joinedDate: 'Feb 12, 2026',
    ordersCount: 4,
    totalSpent: 1196,
    status: 'Active',
    plan: 'Metabolic Baseline & Labs',
    address: '1204 Oak Crest Way, Round Rock, TX 78681',
    notes: 'Completed comprehensive lipid & HbA1c panel. Fasting insulin in optimal range.'
  },
  {
    id: 'pat-003',
    affiliateId: 'affiliate_001',
    name: 'Emily Davis',
    email: 'emily.davis@yahoo.com',
    phone: '+1 (555) 651-8890',
    joinedDate: 'Mar 05, 2026',
    ordersCount: 5,
    totalSpent: 1495,
    status: 'Active',
    plan: 'GLP-1 Weight Management',
    address: '3819 Barton Springs Rd, Austin, TX 78746',
    notes: 'Down 14 lbs in 8 weeks. Requested automatic monthly refills.'
  },
  {
    id: 'pat-004',
    affiliateId: 'affiliate_001',
    name: 'Jonathan Hayes',
    email: 'jhayes@consulting.com',
    phone: '+1 (555) 991-4432',
    joinedDate: 'Mar 28, 2026',
    ordersCount: 3,
    totalSpent: 673,
    status: 'Active',
    plan: 'Longevity NAD+ Cellular',
    address: '910 West 5th Street, Austin, TX 78703',
    notes: 'Subcutaneous NAD+ protocol started. Follow-up consult scheduled.'
  },
  {
    id: 'pat-005',
    affiliateId: 'affiliate_001',
    name: 'Rebecca Thorne',
    email: 'rebecca.thorne@icloud.com',
    phone: '+1 (555) 330-9114',
    joinedDate: 'Apr 14, 2026',
    ordersCount: 2,
    totalSpent: 598,
    status: 'Active',
    plan: 'GLP-1 Weight Management',
    address: '450 North Lamar Blvd, Austin, TX 78701'
  },
  {
    id: 'pat-006',
    affiliateId: 'affiliate_001',
    name: 'Brian Kowalski',
    email: 'briank@gmail.com',
    phone: '+1 (555) 782-9011',
    joinedDate: 'May 02, 2026',
    ordersCount: 4,
    totalSpent: 476,
    status: 'Active',
    plan: 'Hair Follicle Restoration',
    address: '1502 South Congress Ave, Austin, TX 78704'
  },
  {
    id: 'pat-007',
    affiliateId: 'affiliate_001',
    name: 'Sophia Martinez',
    email: 'smartinez@gmail.com',
    phone: '+1 (555) 124-7789',
    joinedDate: 'Jun 11, 2026',
    ordersCount: 3,
    totalSpent: 897,
    status: 'Active',
    plan: 'GLP-1 Weight Management',
    address: '2201 Lake Austin Blvd, Austin, TX 78703'
  },
  {
    id: 'pat-008',
    affiliateId: 'affiliate_001',
    name: 'Alexander Ross',
    email: 'aross@fintech.io',
    phone: '+1 (555) 604-3321',
    joinedDate: 'Jul 04, 2026',
    ordersCount: 2,
    totalSpent: 598,
    status: 'Active',
    plan: 'Hormone Optimization',
    address: '810 Rio Grande St, Austin, TX 78701'
  },
  {
    id: 'pat-009',
    affiliateId: 'affiliate_001',
    name: 'Jessica Taylor',
    email: 'jess.taylor@me.com',
    phone: '+1 (555) 890-4422',
    joinedDate: 'Aug 19, 2026',
    ordersCount: 1,
    totalSpent: 299,
    status: 'Pending',
    plan: 'GLP-1 Weight Management',
    address: '504 West 14th St, Austin, TX 78701',
    notes: 'Awaiting lab blood draw verification from Quest Diagnostics.'
  },
  {
    id: 'pat-010',
    affiliateId: 'affiliate_001',
    name: 'Marcus Sterling',
    email: 'msterling@venture.org',
    phone: '+1 (555) 302-8819',
    joinedDate: 'Sep 02, 2026',
    ordersCount: 1,
    totalSpent: 299,
    status: 'Active',
    plan: 'GLP-1 Weight Management',
    address: '1100 Colorado St, Austin, TX 78701'
  },
  {
    id: 'pat-011',
    affiliateId: 'affiliate_001',
    name: 'Olivia Vance',
    email: 'ovance@designstudio.co',
    phone: '+1 (555) 491-0022',
    joinedDate: 'Sep 10, 2026',
    ordersCount: 1,
    totalSpent: 189,
    status: 'Active',
    plan: 'Metabolic Baseline & Labs',
    address: '300 San Antonio St, Austin, TX 78701'
  },
  {
    id: 'pat-012',
    affiliateId: 'affiliate_001',
    name: 'Daniel Kim',
    email: 'dkim@healthventures.com',
    phone: '+1 (555) 712-4490',
    joinedDate: 'Jun 22, 2026',
    ordersCount: 1,
    totalSpent: 120,
    status: 'Inactive',
    plan: 'Telehealth Clinical Consult',
    address: '600 Congress Ave, Austin, TX 78701',
    notes: 'Completed initial consult, requested paused subscription.'
  },

  // Affiliate 002 (Apex Health Telehealth)
  {
    id: 'pat-021',
    affiliateId: 'affiliate_002',
    name: 'Michael Chang',
    email: 'mchang@techcorp.io',
    phone: '+1 (555) 872-1049',
    joinedDate: 'Feb 14, 2026',
    ordersCount: 7,
    totalSpent: 2093,
    status: 'Active',
    plan: 'Hormone Optimization (TRT)',
    address: '120 Wilshire Blvd, Santa Monica, CA 90401'
  },
  {
    id: 'pat-022',
    affiliateId: 'affiliate_002',
    name: 'Claire Bennett',
    email: 'cbennett@outlook.com',
    phone: '+1 (555) 431-7720',
    joinedDate: 'Mar 19, 2026',
    ordersCount: 4,
    totalSpent: 1196,
    status: 'Active',
    plan: 'GLP-1 Weight Management',
    address: '840 Ocean Front Walk, Venice, CA 90291'
  },
  {
    id: 'pat-023',
    affiliateId: 'affiliate_002',
    name: 'Nicholas Ward',
    email: 'nward@creativegroup.la',
    phone: '+1 (555) 902-1144',
    joinedDate: 'Apr 08, 2026',
    ordersCount: 5,
    totalSpent: 1125,
    status: 'Active',
    plan: 'Longevity NAD+ Cellular',
    address: '220 Montana Ave, Santa Monica, CA 90403'
  },
  {
    id: 'pat-024',
    affiliateId: 'affiliate_002',
    name: 'Rachel Cooper',
    email: 'rachel.cooper@gmail.com',
    phone: '+1 (555) 674-8899',
    joinedDate: 'May 17, 2026',
    ordersCount: 3,
    totalSpent: 897,
    status: 'Active',
    plan: 'GLP-1 Weight Management',
    address: '1040 4th Street, Santa Monica, CA 90403'
  },
  {
    id: 'pat-025',
    affiliateId: 'affiliate_002',
    name: 'Brandon Cole',
    email: 'bcole@siliconbeach.io',
    phone: '+1 (555) 349-2210',
    joinedDate: 'Jun 25, 2026',
    ordersCount: 2,
    totalSpent: 598,
    status: 'Active',
    plan: 'Hormone Optimization',
    address: '700 Main St, Venice, CA 90291'
  },
  {
    id: 'pat-026',
    affiliateId: 'affiliate_002',
    name: 'Hannah Brooks',
    email: 'hbrooks@arts.ucla.edu',
    phone: '+1 (555) 819-4400',
    joinedDate: 'Aug 04, 2026',
    ordersCount: 1,
    totalSpent: 299,
    status: 'Pending',
    plan: 'GLP-1 Weight Management',
    address: '1420 Westwood Blvd, Los Angeles, CA 90024'
  }
];

// ----------------------------------------------------
// ORDERS (Scoped by affiliateId)
// ----------------------------------------------------
export const MOCK_AFFILIATE_ORDERS: AffiliateOrderItem[] = [
  // Affiliate 001 (Wellness Partner LLC)
  {
    id: '#LB-10482',
    affiliateId: 'affiliate_001',
    patientId: 'pat-001',
    patientName: 'Sarah Johnson',
    patientEmail: 'sarah.j@gmail.com',
    patientPhone: '+1 (555) 234-9812',
    date: 'Sep 18, 2026',
    productName: 'Weight Management Plan (GLP-1)',
    productCategory: 'Medical Program',
    quantity: 1,
    subtotal: 299.0,
    discount: 0.0,
    tax: 0.0,
    total: 299.0,
    commissionRate: 15,
    commissionAmount: 44.85,
    commissionStatus: 'Approved',
    orderStatus: 'Completed',
    paymentMethod: 'Visa ending in 4242',
    timeline: [
      { step: 'Order Created', date: 'Sep 18, 2026 08:30 AM', completed: true, description: 'Asynchronous patient checkout submitted' },
      { step: 'Payment Received', date: 'Sep 18, 2026 08:31 AM', completed: true, description: 'Stripe charge authorized and cleared' },
      { step: 'Order Processing', date: 'Sep 18, 2026 09:15 AM', completed: true, description: 'Prescription verified by clinical partner' },
      { step: 'Order Completed', date: 'Sep 18, 2026 11:45 AM', completed: true, description: 'Medication dispatched via cold-chain courier' },
      { step: 'Commission Approved', date: 'Sep 18, 2026 12:00 PM', completed: true, description: 'Commission logged to affiliate ledger' }
    ]
  },
  {
    id: '#LB-10481',
    affiliateId: 'affiliate_001',
    patientId: 'pat-003',
    patientName: 'Emily Davis',
    patientEmail: 'emily.davis@yahoo.com',
    patientPhone: '+1 (555) 651-8890',
    date: 'Sep 17, 2026',
    productName: 'Weight Management Plan (GLP-1)',
    productCategory: 'Medical Program',
    quantity: 1,
    subtotal: 299.0,
    discount: 25.0,
    tax: 0.0,
    total: 274.0,
    commissionRate: 15,
    commissionAmount: 41.1,
    commissionStatus: 'Approved',
    orderStatus: 'Completed',
    paymentMethod: 'Mastercard ending in 8912',
    timeline: [
      { step: 'Order Created', date: 'Sep 17, 2026 01:10 PM', completed: true },
      { step: 'Payment Received', date: 'Sep 17, 2026 01:11 PM', completed: true },
      { step: 'Order Processing', date: 'Sep 17, 2026 02:30 PM', completed: true },
      { step: 'Order Completed', date: 'Sep 17, 2026 04:50 PM', completed: true },
      { step: 'Commission Approved', date: 'Sep 17, 2026 05:00 PM', completed: true }
    ]
  },
  {
    id: '#LB-10480',
    affiliateId: 'affiliate_001',
    patientId: 'pat-002',
    patientName: 'David Miller',
    patientEmail: 'davidm78@gmail.com',
    patientPhone: '+1 (555) 439-0021',
    date: 'Sep 17, 2026',
    productName: 'Metabolic Health Baseline & Labs',
    productCategory: 'Diagnostic Lab',
    quantity: 1,
    subtotal: 189.0,
    discount: 0.0,
    tax: 0.0,
    total: 189.0,
    commissionRate: 15,
    commissionAmount: 28.35,
    commissionStatus: 'Approved',
    orderStatus: 'Processing',
    paymentMethod: 'Amex ending in 1004',
    timeline: [
      { step: 'Order Created', date: 'Sep 17, 2026 03:22 PM', completed: true },
      { step: 'Payment Received', date: 'Sep 17, 2026 03:23 PM', completed: true },
      { step: 'Order Processing', date: 'Sep 17, 2026 04:00 PM', completed: true, current: true, description: 'Lab order requisition sent to Quest' },
      { step: 'Order Completed', date: 'Estimated Sep 19', completed: false },
      { step: 'Commission Approved', date: 'Pending completion', completed: false }
    ]
  },
  {
    id: '#LB-10479',
    affiliateId: 'affiliate_001',
    patientId: 'pat-010',
    patientName: 'Marcus Sterling',
    patientEmail: 'msterling@venture.org',
    patientPhone: '+1 (555) 302-8819',
    date: 'Sep 16, 2026',
    productName: 'Weight Management Plan (GLP-1)',
    productCategory: 'Medical Program',
    quantity: 1,
    subtotal: 299.0,
    discount: 0.0,
    tax: 0.0,
    total: 299.0,
    commissionRate: 15,
    commissionAmount: 44.85,
    commissionStatus: 'Approved',
    orderStatus: 'Completed',
    paymentMethod: 'Apple Pay (Visa)',
    timeline: [
      { step: 'Order Created', date: 'Sep 16, 2026 10:15 AM', completed: true },
      { step: 'Payment Received', date: 'Sep 16, 2026 10:16 AM', completed: true },
      { step: 'Order Processing', date: 'Sep 16, 2026 11:00 AM', completed: true },
      { step: 'Order Completed', date: 'Sep 16, 2026 02:40 PM', completed: true },
      { step: 'Commission Approved', date: 'Sep 16, 2026 03:00 PM', completed: true }
    ]
  },
  {
    id: '#LB-10478',
    affiliateId: 'affiliate_001',
    patientId: 'pat-004',
    patientName: 'Jonathan Hayes',
    patientEmail: 'jhayes@consulting.com',
    patientPhone: '+1 (555) 991-4432',
    date: 'Sep 15, 2026',
    productName: 'Longevity NAD+ Cellular Protocol',
    productCategory: 'Wellness Pack',
    quantity: 1,
    subtotal: 225.0,
    discount: 0.0,
    tax: 0.0,
    total: 225.0,
    commissionRate: 15,
    commissionAmount: 33.75,
    commissionStatus: 'Approved',
    orderStatus: 'Completed',
    paymentMethod: 'Visa ending in 9031',
    timeline: [
      { step: 'Order Created', date: 'Sep 15, 2026 09:00 AM', completed: true },
      { step: 'Payment Received', date: 'Sep 15, 2026 09:01 AM', completed: true },
      { step: 'Order Processing', date: 'Sep 15, 2026 10:30 AM', completed: true },
      { step: 'Order Completed', date: 'Sep 15, 2026 01:15 PM', completed: true },
      { step: 'Commission Approved', date: 'Sep 15, 2026 01:30 PM', completed: true }
    ]
  },
  {
    id: '#LB-10477',
    affiliateId: 'affiliate_001',
    patientId: 'pat-009',
    patientName: 'Jessica Taylor',
    patientEmail: 'jess.taylor@me.com',
    patientPhone: '+1 (555) 890-4422',
    date: 'Sep 15, 2026',
    productName: 'Weight Management Plan (GLP-1)',
    productCategory: 'Medical Program',
    quantity: 1,
    subtotal: 299.0,
    discount: 0.0,
    tax: 0.0,
    total: 299.0,
    commissionRate: 15,
    commissionAmount: 44.85,
    commissionStatus: 'Pending',
    orderStatus: 'Pending',
    paymentMethod: 'Mastercard ending in 5519',
    timeline: [
      { step: 'Order Created', date: 'Sep 15, 2026 04:45 PM', completed: true },
      { step: 'Payment Received', date: 'Sep 15, 2026 04:46 PM', completed: true },
      { step: 'Order Processing', date: 'Awaiting lab draw', completed: false, current: true },
      { step: 'Order Completed', date: 'Pending', completed: false },
      { step: 'Commission Approved', date: 'Pending', completed: false }
    ]
  },
  {
    id: '#LB-10476',
    affiliateId: 'affiliate_001',
    patientId: 'pat-006',
    patientName: 'Brian Kowalski',
    patientEmail: 'briank@gmail.com',
    patientPhone: '+1 (555) 782-9011',
    date: 'Sep 14, 2026',
    productName: 'Hair Follicle Restoration Pack',
    productCategory: 'Prescription Refill',
    quantity: 1,
    subtotal: 119.0,
    discount: 0.0,
    tax: 0.0,
    total: 119.0,
    commissionRate: 15,
    commissionAmount: 17.85,
    commissionStatus: 'Approved',
    orderStatus: 'Completed',
    paymentMethod: 'Visa ending in 3311',
    timeline: [
      { step: 'Order Created', date: 'Sep 14, 2026 11:20 AM', completed: true },
      { step: 'Payment Received', date: 'Sep 14, 2026 11:21 AM', completed: true },
      { step: 'Order Processing', date: 'Sep 14, 2026 12:45 PM', completed: true },
      { step: 'Order Completed', date: 'Sep 14, 2026 03:10 PM', completed: true },
      { step: 'Commission Approved', date: 'Sep 14, 2026 03:30 PM', completed: true }
    ]
  },
  {
    id: '#LB-10475',
    affiliateId: 'affiliate_001',
    patientId: 'pat-008',
    patientName: 'Alexander Ross',
    patientEmail: 'aross@fintech.io',
    patientPhone: '+1 (555) 604-3321',
    date: 'Sep 13, 2026',
    productName: 'Hormone Optimization Therapy (TRT)',
    productCategory: 'Medical Program',
    quantity: 1,
    subtotal: 299.0,
    discount: 0.0,
    tax: 0.0,
    total: 299.0,
    commissionRate: 15,
    commissionAmount: 44.85,
    commissionStatus: 'Approved',
    orderStatus: 'Completed',
    paymentMethod: 'Amex ending in 9002',
    timeline: [
      { step: 'Order Created', date: 'Sep 13, 2026 08:10 AM', completed: true },
      { step: 'Payment Received', date: 'Sep 13, 2026 08:11 AM', completed: true },
      { step: 'Order Processing', date: 'Sep 13, 2026 09:30 AM', completed: true },
      { step: 'Order Completed', date: 'Sep 13, 2026 01:20 PM', completed: true },
      { step: 'Commission Approved', date: 'Sep 13, 2026 01:45 PM', completed: true }
    ]
  },
  {
    id: '#LB-10474',
    affiliateId: 'affiliate_001',
    patientId: 'pat-007',
    patientName: 'Sophia Martinez',
    patientEmail: 'smartinez@gmail.com',
    patientPhone: '+1 (555) 124-7789',
    date: 'Sep 12, 2026',
    productName: 'Weight Management Plan (GLP-1)',
    productCategory: 'Medical Program',
    quantity: 1,
    subtotal: 299.0,
    discount: 0.0,
    tax: 0.0,
    total: 299.0,
    commissionRate: 15,
    commissionAmount: 44.85,
    commissionStatus: 'Approved',
    orderStatus: 'Completed',
    paymentMethod: 'Visa ending in 7102',
    timeline: [
      { step: 'Order Created', date: 'Sep 12, 2026 10:00 AM', completed: true },
      { step: 'Payment Received', date: 'Sep 12, 2026 10:01 AM', completed: true },
      { step: 'Order Processing', date: 'Sep 12, 2026 11:15 AM', completed: true },
      { step: 'Order Completed', date: 'Sep 12, 2026 02:30 PM', completed: true },
      { step: 'Commission Approved', date: 'Sep 12, 2026 03:00 PM', completed: true }
    ]
  },
  {
    id: '#LB-10473',
    affiliateId: 'affiliate_001',
    patientId: 'pat-011',
    patientName: 'Olivia Vance',
    patientEmail: 'ovance@designstudio.co',
    patientPhone: '+1 (555) 491-0022',
    date: 'Sep 10, 2026',
    productName: 'Metabolic Baseline & Labs',
    productCategory: 'Diagnostic Lab',
    quantity: 1,
    subtotal: 189.0,
    discount: 0.0,
    tax: 0.0,
    total: 189.0,
    commissionRate: 15,
    commissionAmount: 28.35,
    commissionStatus: 'Approved',
    orderStatus: 'Completed',
    paymentMethod: 'Apple Pay (Mastercard)',
    timeline: [
      { step: 'Order Created', date: 'Sep 10, 2026 02:15 PM', completed: true },
      { step: 'Payment Received', date: 'Sep 10, 2026 02:16 PM', completed: true },
      { step: 'Order Processing', date: 'Sep 10, 2026 03:30 PM', completed: true },
      { step: 'Order Completed', date: 'Sep 10, 2026 05:45 PM', completed: true },
      { step: 'Commission Approved', date: 'Sep 10, 2026 06:00 PM', completed: true }
    ]
  },
  {
    id: '#LB-10472',
    affiliateId: 'affiliate_001',
    patientId: 'pat-005',
    patientName: 'Rebecca Thorne',
    patientEmail: 'rebecca.thorne@icloud.com',
    patientPhone: '+1 (555) 330-9114',
    date: 'Sep 09, 2026',
    productName: 'Weight Management Plan (GLP-1)',
    productCategory: 'Medical Program',
    quantity: 1,
    subtotal: 299.0,
    discount: 0.0,
    tax: 0.0,
    total: 299.0,
    commissionRate: 15,
    commissionAmount: 44.85,
    commissionStatus: 'Approved',
    orderStatus: 'Completed',
    paymentMethod: 'Visa ending in 4242',
    timeline: [
      { step: 'Order Created', date: 'Sep 09, 2026 09:40 AM', completed: true },
      { step: 'Payment Received', date: 'Sep 09, 2026 09:41 AM', completed: true },
      { step: 'Order Processing', date: 'Sep 09, 2026 11:00 AM', completed: true },
      { step: 'Order Completed', date: 'Sep 09, 2026 03:15 PM', completed: true },
      { step: 'Commission Approved', date: 'Sep 09, 2026 03:30 PM', completed: true }
    ]
  },
  {
    id: '#LB-10471',
    affiliateId: 'affiliate_001',
    patientId: 'pat-001',
    patientName: 'Sarah Johnson',
    patientEmail: 'sarah.j@gmail.com',
    patientPhone: '+1 (555) 234-9812',
    date: 'Aug 20, 2026',
    productName: 'Weight Management Plan (GLP-1)',
    productCategory: 'Medical Program',
    quantity: 1,
    subtotal: 299.0,
    discount: 0.0,
    tax: 0.0,
    total: 299.0,
    commissionRate: 15,
    commissionAmount: 44.85,
    commissionStatus: 'Paid',
    orderStatus: 'Completed',
    paymentMethod: 'Visa ending in 4242',
    timeline: [
      { step: 'Order Created', date: 'Aug 20, 2026 08:30 AM', completed: true },
      { step: 'Payment Received', date: 'Aug 20, 2026 08:31 AM', completed: true },
      { step: 'Order Processing', date: 'Aug 20, 2026 09:00 AM', completed: true },
      { step: 'Order Completed', date: 'Aug 20, 2026 01:20 PM', completed: true },
      { step: 'Commission Approved', date: 'Aug 20, 2026 02:00 PM', completed: true }
    ]
  },
  {
    id: '#LB-10470',
    affiliateId: 'affiliate_001',
    patientId: 'pat-003',
    patientName: 'Emily Davis',
    patientEmail: 'emily.davis@yahoo.com',
    patientPhone: '+1 (555) 651-8890',
    date: 'Aug 17, 2026',
    productName: 'Weight Management Plan (GLP-1)',
    productCategory: 'Medical Program',
    quantity: 1,
    subtotal: 299.0,
    discount: 0.0,
    tax: 0.0,
    total: 299.0,
    commissionRate: 15,
    commissionAmount: 44.85,
    commissionStatus: 'Paid',
    orderStatus: 'Completed',
    paymentMethod: 'Mastercard ending in 8912',
    timeline: [
      { step: 'Order Created', date: 'Aug 17, 2026 01:10 PM', completed: true },
      { step: 'Payment Received', date: 'Aug 17, 2026 01:11 PM', completed: true },
      { step: 'Order Processing', date: 'Aug 17, 2026 02:00 PM', completed: true },
      { step: 'Order Completed', date: 'Aug 17, 2026 04:30 PM', completed: true },
      { step: 'Commission Approved', date: 'Aug 17, 2026 05:00 PM', completed: true }
    ]
  },
  {
    id: '#LB-10469',
    affiliateId: 'affiliate_001',
    patientId: 'pat-012',
    patientName: 'Daniel Kim',
    patientEmail: 'dkim@healthventures.com',
    patientPhone: '+1 (555) 712-4490',
    date: 'Jun 22, 2026',
    productName: 'Telehealth Physician Clinical Consult',
    productCategory: 'Telehealth Consult',
    quantity: 1,
    subtotal: 120.0,
    discount: 0.0,
    tax: 0.0,
    total: 120.0,
    commissionRate: 15,
    commissionAmount: 18.0,
    commissionStatus: 'Paid',
    orderStatus: 'Completed',
    paymentMethod: 'Visa ending in 8831',
    timeline: [
      { step: 'Order Created', date: 'Jun 22, 2026 10:00 AM', completed: true },
      { step: 'Payment Received', date: 'Jun 22, 2026 10:01 AM', completed: true },
      { step: 'Order Processing', date: 'Jun 22, 2026 10:30 AM', completed: true },
      { step: 'Order Completed', date: 'Jun 22, 2026 11:15 AM', completed: true },
      { step: 'Commission Approved', date: 'Jun 22, 2026 11:30 AM', completed: true }
    ]
  },
  {
    id: '#LB-10468',
    affiliateId: 'affiliate_001',
    patientId: 'pat-001',
    patientName: 'Sarah Johnson',
    patientEmail: 'sarah.j@gmail.com',
    patientPhone: '+1 (555) 234-9812',
    date: 'May 10, 2026',
    productName: 'Weight Management Plan (GLP-1)',
    productCategory: 'Medical Program',
    quantity: 1,
    subtotal: 299.0,
    discount: 0.0,
    tax: 0.0,
    total: 299.0,
    commissionRate: 15,
    commissionAmount: 44.85,
    commissionStatus: 'Paid',
    orderStatus: 'Completed',
    paymentMethod: 'Visa ending in 4242',
    timeline: [
      { step: 'Order Created', date: 'May 10, 2026 09:00 AM', completed: true },
      { step: 'Payment Received', date: 'May 10, 2026 09:01 AM', completed: true },
      { step: 'Order Processing', date: 'May 10, 2026 10:00 AM', completed: true },
      { step: 'Order Completed', date: 'May 10, 2026 02:00 PM', completed: true },
      { step: 'Commission Approved', date: 'May 10, 2026 02:30 PM', completed: true }
    ]
  },
  {
    id: '#LB-10467',
    affiliateId: 'affiliate_001',
    patientId: 'pat-002',
    patientName: 'David Miller',
    patientEmail: 'davidm78@gmail.com',
    patientPhone: '+1 (555) 439-0021',
    date: 'Apr 18, 2026',
    productName: 'Metabolic Baseline & Labs',
    productCategory: 'Diagnostic Lab',
    quantity: 1,
    subtotal: 189.0,
    discount: 0.0,
    tax: 0.0,
    total: 189.0,
    commissionRate: 15,
    commissionAmount: 28.35,
    commissionStatus: 'Paid',
    orderStatus: 'Completed',
    paymentMethod: 'Amex ending in 1004',
    timeline: [
      { step: 'Order Created', date: 'Apr 18, 2026 03:00 PM', completed: true },
      { step: 'Payment Received', date: 'Apr 18, 2026 03:01 PM', completed: true },
      { step: 'Order Processing', date: 'Apr 18, 2026 04:00 PM', completed: true },
      { step: 'Order Completed', date: 'Apr 18, 2026 05:30 PM', completed: true },
      { step: 'Commission Approved', date: 'Apr 18, 2026 06:00 PM', completed: true }
    ]
  },
  {
    id: '#LB-10466',
    affiliateId: 'affiliate_001',
    patientId: 'pat-006',
    patientName: 'Brian Kowalski',
    patientEmail: 'briank@gmail.com',
    patientPhone: '+1 (555) 782-9011',
    date: 'Mar 15, 2026',
    productName: 'Hair Follicle Restoration Pack',
    productCategory: 'Prescription Refill',
    quantity: 1,
    subtotal: 119.0,
    discount: 0.0,
    tax: 0.0,
    total: 119.0,
    commissionRate: 15,
    commissionAmount: 17.85,
    commissionStatus: 'Paid',
    orderStatus: 'Completed',
    paymentMethod: 'Visa ending in 3311',
    timeline: [
      { step: 'Order Created', date: 'Mar 15, 2026 11:00 AM', completed: true },
      { step: 'Payment Received', date: 'Mar 15, 2026 11:01 AM', completed: true },
      { step: 'Order Processing', date: 'Mar 15, 2026 12:00 PM', completed: true },
      { step: 'Order Completed', date: 'Mar 15, 2026 03:00 PM', completed: true },
      { step: 'Commission Approved', date: 'Mar 15, 2026 03:30 PM', completed: true }
    ]
  },
  {
    id: '#LB-10465',
    affiliateId: 'affiliate_001',
    patientId: 'pat-004',
    patientName: 'Jonathan Hayes',
    patientEmail: 'jhayes@consulting.com',
    patientPhone: '+1 (555) 991-4432',
    date: 'Sep 01, 2026',
    productName: 'Longevity NAD+ Cellular Protocol',
    productCategory: 'Wellness Pack',
    quantity: 1,
    subtotal: 225.0,
    discount: 0.0,
    tax: 0.0,
    total: 225.0,
    commissionRate: 15,
    commissionAmount: 33.75,
    commissionStatus: 'Approved',
    orderStatus: 'Cancelled',
    paymentMethod: 'Visa ending in 9031',
    timeline: [
      { step: 'Order Created', date: 'Sep 01, 2026 08:00 AM', completed: true },
      { step: 'Payment Received', date: 'Sep 01, 2026 08:01 AM', completed: true },
      { step: 'Order Processing', date: 'Cancelled by patient', completed: false, current: true },
      { step: 'Order Completed', date: 'N/A', completed: false },
      { step: 'Commission Approved', date: 'Cancelled', completed: false }
    ]
  },

  // Affiliate 002 (Apex Health Telehealth)
  {
    id: '#LB-10510',
    affiliateId: 'affiliate_002',
    patientId: 'pat-021',
    patientName: 'Michael Chang',
    patientEmail: 'mchang@techcorp.io',
    patientPhone: '+1 (555) 872-1049',
    date: 'Sep 18, 2026',
    productName: 'Hormone Optimization (TRT)',
    productCategory: 'Medical Program',
    quantity: 1,
    subtotal: 299.0,
    discount: 0.0,
    tax: 0.0,
    total: 299.0,
    commissionRate: 18,
    commissionAmount: 53.82,
    commissionStatus: 'Approved',
    orderStatus: 'Completed',
    paymentMethod: 'Credit Card (Visa)',
    timeline: [
      { step: 'Order Created', date: 'Sep 18, 2026 10:00 AM', completed: true },
      { step: 'Payment Received', date: 'Sep 18, 2026 10:01 AM', completed: true },
      { step: 'Order Processing', date: 'Sep 18, 2026 11:30 AM', completed: true },
      { step: 'Order Completed', date: 'Sep 18, 2026 02:00 PM', completed: true },
      { step: 'Commission Approved', date: 'Sep 18, 2026 02:15 PM', completed: true }
    ]
  },
  {
    id: '#LB-10509',
    affiliateId: 'affiliate_002',
    patientId: 'pat-022',
    patientName: 'Claire Bennett',
    patientEmail: 'cbennett@outlook.com',
    patientPhone: '+1 (555) 431-7720',
    date: 'Sep 17, 2026',
    productName: 'Weight Management Plan (GLP-1)',
    productCategory: 'Medical Program',
    quantity: 1,
    subtotal: 299.0,
    discount: 0.0,
    tax: 0.0,
    total: 299.0,
    commissionRate: 18,
    commissionAmount: 53.82,
    commissionStatus: 'Approved',
    orderStatus: 'Completed',
    paymentMethod: 'Mastercard ending in 1188',
    timeline: [
      { step: 'Order Created', date: 'Sep 17, 2026 11:00 AM', completed: true },
      { step: 'Payment Received', date: 'Sep 17, 2026 11:01 AM', completed: true },
      { step: 'Order Processing', date: 'Sep 17, 2026 12:30 PM', completed: true },
      { step: 'Order Completed', date: 'Sep 17, 2026 03:00 PM', completed: true },
      { step: 'Commission Approved', date: 'Sep 17, 2026 03:15 PM', completed: true }
    ]
  },
  {
    id: '#LB-10508',
    affiliateId: 'affiliate_002',
    patientId: 'pat-023',
    patientName: 'Nicholas Ward',
    patientEmail: 'nward@creativegroup.la',
    patientPhone: '+1 (555) 902-1144',
    date: 'Sep 16, 2026',
    productName: 'Longevity NAD+ Cellular Protocol',
    productCategory: 'Wellness Pack',
    quantity: 1,
    subtotal: 225.0,
    discount: 0.0,
    tax: 0.0,
    total: 225.0,
    commissionRate: 18,
    commissionAmount: 40.5,
    commissionStatus: 'Approved',
    orderStatus: 'Completed',
    paymentMethod: 'Amex ending in 4490',
    timeline: [
      { step: 'Order Created', date: 'Sep 16, 2026 02:00 PM', completed: true },
      { step: 'Payment Received', date: 'Sep 16, 2026 02:01 PM', completed: true },
      { step: 'Order Processing', date: 'Sep 16, 2026 03:15 PM', completed: true },
      { step: 'Order Completed', date: 'Sep 16, 2026 05:00 PM', completed: true },
      { step: 'Commission Approved', date: 'Sep 16, 2026 05:15 PM', completed: true }
    ]
  },
  {
    id: '#LB-10507',
    affiliateId: 'affiliate_002',
    patientId: 'pat-024',
    patientName: 'Rachel Cooper',
    patientEmail: 'rachel.cooper@gmail.com',
    patientPhone: '+1 (555) 674-8899',
    date: 'Sep 15, 2026',
    productName: 'Weight Management Plan (GLP-1)',
    productCategory: 'Medical Program',
    quantity: 1,
    subtotal: 299.0,
    discount: 0.0,
    tax: 0.0,
    total: 299.0,
    commissionRate: 18,
    commissionAmount: 53.82,
    commissionStatus: 'Approved',
    orderStatus: 'Processing',
    paymentMethod: 'Visa ending in 6601',
    timeline: [
      { step: 'Order Created', date: 'Sep 15, 2026 09:30 AM', completed: true },
      { step: 'Payment Received', date: 'Sep 15, 2026 09:31 AM', completed: true },
      { step: 'Order Processing', date: 'Sep 15, 2026 10:45 AM', completed: true, current: true },
      { step: 'Order Completed', date: 'Pending', completed: false },
      { step: 'Commission Approved', date: 'Pending', completed: false }
    ]
  }
];

// ----------------------------------------------------
// COMMISSIONS (Scoped by affiliateId)
// ----------------------------------------------------
export const MOCK_AFFILIATE_COMMISSIONS: AffiliateCommissionRecord[] = [
  // Affiliate 001 (Wellness Partner LLC)
  {
    id: 'COM-901',
    orderId: '#LB-10482',
    affiliateId: 'affiliate_001',
    patientName: 'Sarah Johnson',
    orderDate: 'Sep 18, 2026',
    orderAmount: 299.0,
    commissionRate: 15,
    commission: 44.85,
    status: 'Approved',
    date: 'Sep 18, 2026'
  },
  {
    id: 'COM-902',
    orderId: '#LB-10481',
    affiliateId: 'affiliate_001',
    patientName: 'Emily Davis',
    orderDate: 'Sep 17, 2026',
    orderAmount: 274.0,
    commissionRate: 15,
    commission: 41.1,
    status: 'Approved',
    date: 'Sep 17, 2026'
  },
  {
    id: 'COM-903',
    orderId: '#LB-10480',
    affiliateId: 'affiliate_001',
    patientName: 'David Miller',
    orderDate: 'Sep 17, 2026',
    orderAmount: 189.0,
    commissionRate: 15,
    commission: 28.35,
    status: 'Pending',
    date: 'Sep 17, 2026'
  },
  {
    id: 'COM-904',
    orderId: '#LB-10479',
    affiliateId: 'affiliate_001',
    patientName: 'Marcus Sterling',
    orderDate: 'Sep 16, 2026',
    orderAmount: 299.0,
    commissionRate: 15,
    commission: 44.85,
    status: 'Approved',
    date: 'Sep 16, 2026'
  },
  {
    id: 'COM-905',
    orderId: '#LB-10478',
    affiliateId: 'affiliate_001',
    patientName: 'Jonathan Hayes',
    orderDate: 'Sep 15, 2026',
    orderAmount: 225.0,
    commissionRate: 15,
    commission: 33.75,
    status: 'Approved',
    date: 'Sep 15, 2026'
  },
  {
    id: 'COM-906',
    orderId: '#LB-10477',
    affiliateId: 'affiliate_001',
    patientName: 'Jessica Taylor',
    orderDate: 'Sep 15, 2026',
    orderAmount: 299.0,
    commissionRate: 15,
    commission: 44.85,
    status: 'Pending',
    date: 'Sep 15, 2026'
  },
  {
    id: 'COM-907',
    orderId: '#LB-10476',
    affiliateId: 'affiliate_001',
    patientName: 'Brian Kowalski',
    orderDate: 'Sep 14, 2026',
    orderAmount: 119.0,
    commissionRate: 15,
    commission: 17.85,
    status: 'Approved',
    date: 'Sep 14, 2026'
  },
  {
    id: 'COM-908',
    orderId: '#LB-10475',
    affiliateId: 'affiliate_001',
    patientName: 'Alexander Ross',
    orderDate: 'Sep 13, 2026',
    orderAmount: 299.0,
    commissionRate: 15,
    commission: 44.85,
    status: 'Approved',
    date: 'Sep 13, 2026'
  },
  {
    id: 'COM-909',
    orderId: '#LB-10474',
    affiliateId: 'affiliate_001',
    patientName: 'Sophia Martinez',
    orderDate: 'Sep 12, 2026',
    orderAmount: 299.0,
    commissionRate: 15,
    commission: 44.85,
    status: 'Approved',
    date: 'Sep 12, 2026'
  },
  {
    id: 'COM-910',
    orderId: '#LB-10473',
    affiliateId: 'affiliate_001',
    patientName: 'Olivia Vance',
    orderDate: 'Sep 10, 2026',
    orderAmount: 189.0,
    commissionRate: 15,
    commission: 28.35,
    status: 'Approved',
    date: 'Sep 10, 2026'
  },
  {
    id: 'COM-911',
    orderId: '#LB-10471',
    affiliateId: 'affiliate_001',
    patientName: 'Sarah Johnson',
    orderDate: 'Aug 20, 2026',
    orderAmount: 299.0,
    commissionRate: 15,
    commission: 44.85,
    status: 'Paid',
    date: 'Aug 20, 2026'
  },
  {
    id: 'COM-912',
    orderId: '#LB-10470',
    affiliateId: 'affiliate_001',
    patientName: 'Emily Davis',
    orderDate: 'Aug 17, 2026',
    orderAmount: 299.0,
    commissionRate: 15,
    commission: 44.85,
    status: 'Paid',
    date: 'Aug 17, 2026'
  },

  // Affiliate 002 (Apex Health Telehealth)
  {
    id: 'COM-951',
    orderId: '#LB-10510',
    affiliateId: 'affiliate_002',
    patientName: 'Michael Chang',
    orderDate: 'Sep 18, 2026',
    orderAmount: 299.0,
    commissionRate: 18,
    commission: 53.82,
    status: 'Approved',
    date: 'Sep 18, 2026'
  },
  {
    id: 'COM-952',
    orderId: '#LB-10509',
    affiliateId: 'affiliate_002',
    patientName: 'Claire Bennett',
    orderDate: 'Sep 17, 2026',
    orderAmount: 299.0,
    commissionRate: 18,
    commission: 53.82,
    status: 'Approved',
    date: 'Sep 17, 2026'
  },
  {
    id: 'COM-953',
    orderId: '#LB-10508',
    affiliateId: 'affiliate_002',
    patientName: 'Nicholas Ward',
    orderDate: 'Sep 16, 2026',
    orderAmount: 225.0,
    commissionRate: 18,
    commission: 40.5,
    status: 'Approved',
    date: 'Sep 16, 2026'
  },
  {
    id: 'COM-954',
    orderId: '#LB-10507',
    affiliateId: 'affiliate_002',
    patientName: 'Rachel Cooper',
    orderDate: 'Sep 15, 2026',
    orderAmount: 299.0,
    commissionRate: 18,
    commission: 53.82,
    status: 'Pending',
    date: 'Sep 15, 2026'
  }
];

// ----------------------------------------------------
// PAYMENTS / PAYOUTS (Scoped by affiliateId)
// ----------------------------------------------------
export const MOCK_AFFILIATE_PAYMENTS: AffiliatePaymentPayout[] = [
  // Affiliate 001 (Wellness Partner LLC)
  {
    id: '#PAY-1038',
    affiliateId: 'affiliate_001',
    date: 'Sep 15, 2026',
    amount: 2480.0,
    method: 'Bank Transfer',
    reference: 'LB-PAYOUT-1038',
    status: 'Paid',
    coveredOrdersCount: 56,
    accountDestination: 'JPMorgan Chase (••••6712)',
    notes: 'Bi-monthly clinical revenue settlement automatically routed via ACH direct deposit.'
  },
  {
    id: '#PAY-1037',
    affiliateId: 'affiliate_001',
    date: 'Aug 31, 2026',
    amount: 2890.0,
    method: 'Bank Transfer',
    reference: 'LB-PAYOUT-1037',
    status: 'Paid',
    coveredOrdersCount: 64,
    accountDestination: 'JPMorgan Chase (••••6712)'
  },
  {
    id: '#PAY-1036',
    affiliateId: 'affiliate_001',
    date: 'Aug 15, 2026',
    amount: 2310.0,
    method: 'Bank Transfer',
    reference: 'LB-PAYOUT-1036',
    status: 'Paid',
    coveredOrdersCount: 52,
    accountDestination: 'JPMorgan Chase (••••6712)'
  },
  {
    id: '#PAY-1035',
    affiliateId: 'affiliate_001',
    date: 'Jul 31, 2026',
    amount: 2640.0,
    method: 'Bank Transfer',
    reference: 'LB-PAYOUT-1035',
    status: 'Paid',
    coveredOrdersCount: 59,
    accountDestination: 'JPMorgan Chase (••••6712)'
  },
  {
    id: '#PAY-1034',
    affiliateId: 'affiliate_001',
    date: 'Jul 15, 2026',
    amount: 2210.0,
    method: 'Bank Transfer',
    reference: 'LB-PAYOUT-1034',
    status: 'Paid',
    coveredOrdersCount: 48,
    accountDestination: 'JPMorgan Chase (••••6712)'
  },
  {
    id: '#PAY-1033',
    affiliateId: 'affiliate_001',
    date: 'Jun 30, 2026',
    amount: 2510.0,
    method: 'Bank Transfer',
    reference: 'LB-PAYOUT-1033',
    status: 'Paid',
    coveredOrdersCount: 55,
    accountDestination: 'JPMorgan Chase (••••6712)'
  },
  {
    id: '#PAY-1032',
    affiliateId: 'affiliate_001',
    date: 'Jun 15, 2026',
    amount: 2180.0,
    method: 'Bank Transfer',
    reference: 'LB-PAYOUT-1032',
    status: 'Paid',
    coveredOrdersCount: 49,
    accountDestination: 'JPMorgan Chase (••••6712)'
  },
  {
    id: '#PAY-1031',
    affiliateId: 'affiliate_001',
    date: 'May 31, 2026',
    amount: 2390.0,
    method: 'Bank Transfer',
    reference: 'LB-PAYOUT-1031',
    status: 'Paid',
    coveredOrdersCount: 53,
    accountDestination: 'JPMorgan Chase (••••6712)'
  },
  {
    id: '#PAY-1030',
    affiliateId: 'affiliate_001',
    date: 'May 15, 2026',
    amount: 2230.0,
    method: 'Bank Transfer',
    reference: 'LB-PAYOUT-1030',
    status: 'Paid',
    coveredOrdersCount: 50,
    accountDestination: 'JPMorgan Chase (••••6712)'
  },

  // Affiliate 002 (Apex Health Telehealth)
  {
    id: '#PAY-2041',
    affiliateId: 'affiliate_002',
    date: 'Sep 15, 2026',
    amount: 3420.0,
    method: 'Bank Transfer',
    reference: 'LB-PAYOUT-2041',
    status: 'Paid',
    coveredOrdersCount: 68,
    accountDestination: 'First Citizens SVB (••••4489)'
  },
  {
    id: '#PAY-2040',
    affiliateId: 'affiliate_002',
    date: 'Aug 31, 2026',
    amount: 3180.0,
    method: 'Bank Transfer',
    reference: 'LB-PAYOUT-2040',
    status: 'Paid',
    coveredOrdersCount: 62,
    accountDestination: 'First Citizens SVB (••••4489)'
  },
  {
    id: '#PAY-2039',
    affiliateId: 'affiliate_002',
    date: 'Aug 15, 2026',
    amount: 2950.0,
    method: 'Bank Transfer',
    reference: 'LB-PAYOUT-2039',
    status: 'Paid',
    coveredOrdersCount: 57,
    accountDestination: 'First Citizens SVB (••••4489)'
  }
];

// ----------------------------------------------------
// 90 DAYS OF SALES DATA GENERATOR (Realistic daily curve)
// ----------------------------------------------------
export function generateAffiliate90DaysSales(affiliateId: string): AffiliateSalesDataPoint[] {
  const result: AffiliateSalesDataPoint[] = [];
  const baseSales = affiliateId === 'affiliate_001' ? 1400 : affiliateId === 'affiliate_002' ? 1850 : 1100;
  const baseOrders = affiliateId === 'affiliate_001' ? 5 : 7;
  const commRate = affiliateId === 'affiliate_001' ? 0.15 : 0.18;

  // Let's generate 90 daily points backwards from Sep 18, 2026
  const startDate = new Date(2026, 5, 20); // June 20, 2026

  for (let i = 0; i < 90; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);

    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendFactor = isWeekend ? 0.65 : 1.15;
    const trendFactor = 1 + (i / 90) * 0.35; // gentle 35% growth over 90 days

    // Pseudo-random daily oscillation based on day index
    const wave = Math.sin(i * 0.45) * 0.25;
    const noise = ((i * 17 + 7) % 23) / 100 - 0.1;

    const dailyRev = Math.round(baseSales * weekendFactor * trendFactor * (1 + wave + noise));
    const dailyOrders = Math.max(1, Math.round(baseOrders * weekendFactor * trendFactor * (1 + wave * 0.5)));
    const dailyPatients = Math.max(1, Math.round(dailyOrders * 0.6));
    const dailyComm = Math.round(dailyRev * commRate * 100) / 100;

    const monthStr = d.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = d.getDate();

    result.push({
      date: d.toISOString().split('T')[0],
      label: `${monthStr} ${dayNum}`,
      revenue: dailyRev,
      orders: dailyOrders,
      patients: dailyPatients,
      commission: dailyComm
    });
  }

  return result;
}

export const MOCK_AFFILIATE_SALES_DATA: Record<string, AffiliateSalesDataPoint[]> = {
  affiliate_001: generateAffiliate90DaysSales('affiliate_001'),
  affiliate_002: generateAffiliate90DaysSales('affiliate_002'),
  affiliate_003: generateAffiliate90DaysSales('affiliate_003')
};

// ----------------------------------------------------
// PRODUCT PERFORMANCE SUMMARY FOR SALES TAB
// ----------------------------------------------------
export interface ProductPerformanceItem {
  id: string;
  product: string;
  category: string;
  orders: number;
  unitsSold: number;
  revenue: number;
  commission: number;
  growth: string;
}

export const MOCK_PRODUCT_PERFORMANCE: Record<string, ProductPerformanceItem[]> = {
  affiliate_001: [
    {
      id: 'perf-1',
      product: 'Weight Management (GLP-1 Semaglutide/Tirzepatide)',
      category: 'Medical Program',
      orders: 428,
      unitsSold: 428,
      revenue: 127972,
      commission: 19195.8,
      growth: '+18.4%'
    },
    {
      id: 'perf-2',
      product: 'Metabolic Baseline Diagnostic Lab Panel',
      category: 'Diagnostic Lab',
      orders: 194,
      unitsSold: 194,
      revenue: 36666,
      commission: 5499.9,
      growth: '+12.1%'
    },
    {
      id: 'perf-3',
      product: 'Longevity NAD+ Cellular Protocol',
      category: 'Wellness Pack',
      orders: 112,
      unitsSold: 112,
      revenue: 25200,
      commission: 3780.0,
      growth: '+9.8%'
    },
    {
      id: 'perf-4',
      product: 'Hormone Optimization Therapy (TRT/HRT)',
      category: 'Medical Program',
      orders: 78,
      unitsSold: 78,
      revenue: 23322,
      commission: 3498.3,
      growth: '+14.5%'
    },
    {
      id: 'perf-5',
      product: 'Advanced Hair Follicle Restoration Pack',
      category: 'Prescription Refill',
      orders: 44,
      unitsSold: 44,
      revenue: 5236,
      commission: 785.4,
      growth: '+6.2%'
    }
  ],
  affiliate_002: [
    {
      id: 'perf-21',
      product: 'Hormone Optimization Therapy (TRT/HRT)',
      category: 'Medical Program',
      orders: 390,
      unitsSold: 390,
      revenue: 116610,
      commission: 20989.8,
      growth: '+22.1%'
    },
    {
      id: 'perf-22',
      product: 'Weight Management (GLP-1)',
      category: 'Medical Program',
      orders: 280,
      unitsSold: 280,
      revenue: 83720,
      commission: 15069.6,
      growth: '+15.3%'
    },
    {
      id: 'perf-23',
      product: 'Longevity NAD+ Cellular Protocol',
      category: 'Wellness Pack',
      orders: 165,
      unitsSold: 165,
      revenue: 37125,
      commission: 6682.5,
      growth: '+18.0%'
    }
  ]
};

// ----------------------------------------------------
// HELP & SUPPORT ARTICLES & FAQS
// ----------------------------------------------------
export interface SupportFaq {
  question: string;
  category: string;
  answer: string;
}

export const SUPPORT_FAQS: SupportFaq[] = [
  {
    category: 'Commissions & Payouts',
    question: 'How and when are affiliate commissions calculated and paid?',
    answer:
      'Commissions are calculated automatically on every completed patient purchase according to your contracted rate (typically 15% to 20%). Payouts are reconciled bi-monthly on the 15th and last day of each month, deposited directly into your designated bank account via ACH transfer or PayPal.'
  },
  {
    category: 'Patient Referrals',
    question: 'How does referral link tracking and attribution work?',
    answer:
      'Each affiliate has a unique hostname or tracking subdomain (e.g. wellnesspartner.leanbloom.com). When a prospective patient lands via your custom URL or embedded consultation widget, a persistent 90-day tracking cookie binds all asynchronous consults, prescriptions, and reoccurring refills to your affiliate ID.'
  },
  {
    category: 'Clinical Fulfillment',
    question: 'Who handles the medical consultations and pharmacy compounding?',
    answer:
      'LeanBloom handles 100% of licensed telehealth consultations, state doctor network coverage, electronic prescription writing, and 503A/503B compounding pharmacy fulfillment with temperature-controlled next-day shipping.'
  },
  {
    category: 'Patient Privacy & HIPAA',
    question: 'What patient health information is accessible to affiliates?',
    answer:
      'Affiliates have access to operational referral metrics, order status, and non-sensitive communication channels. Strict HIPAA boundaries protect clinical consultation transcripts, medical intake history, and physician private notes.'
  },
  {
    category: 'Customization & Branding',
    question: 'Can we use our own custom domain and branding palette?',
    answer:
      'Yes! Through LeanBloom White-Label services, your patient storefront can operate under your own root domain (e.g. care.yourbrand.com) with custom logos, tailored color schemes, and seamless patient intake styling.'
  }
];
