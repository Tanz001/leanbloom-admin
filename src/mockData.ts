import {
  Affiliate,
  Patient,
  Order,
  Product,
  AffiliatePriceRule,
  CommissionRecord,
  PaymentTransaction,
  AuditLog,
  NotificationItem,
  AdminUser,
  Provider,
  DomainItem
} from './types';

export const INITIAL_AFFILIATES: Affiliate[] = [
  {
    id: 'aff-01',
    name: 'ABC Wellness',
    slug: 'abc-wellness',
    domain: 'wellness.abcclinic.com',
    subdomain: 'abcwellness.leanbloom.com',
    contactName: 'Dr. Marcus Vance',
    contactEmail: 'mvance@abcwellness.com',
    contactPhone: '+1 (555) 342-9180',
    status: 'Active',
    patientsCount: 1240,
    ordersCount: 823,
    revenue: 82450,
    commission: 12300,
    growth: '+14.5%',
    createdAt: 'Jan 12, 2025',
    primaryColor: '#173B72',
    secondaryColor: '#4FAF4A',
    defaultMarkup: 25,
    address: '1400 Broadway Blvd, Suite 400, Austin, TX 78701',
    tagline: 'Integrative Weight Loss & Physician-Supervised Protocols',
    fontFamily: 'Plus Jakarta Sans',
    borderRadius: 'rounded-xl',
    headerTheme: 'navy',
    portalTitle: 'ABC Wellness Patient Clinic',
    welcomeMessage: 'Welcome to your tailored metabolic health journey. Complete your asynchronous intake to begin.',
    supportEmail: 'support@abcclinic.com',
    supportPhone: '+1 (800) 412-2291',
    hidePoweredBy: false,
    termsUrl: 'https://wellness.abcclinic.com/terms',
    privacyUrl: 'https://wellness.abcclinic.com/privacy'
  },
  {
    id: 'aff-02',
    name: 'XYZ Health',
    slug: 'xyz-health',
    domain: 'rx.xyzhealth.org',
    subdomain: 'xyzhealth.leanbloom.com',
    contactName: 'Elena Rostova, NP',
    contactEmail: 'elena@xyzhealth.org',
    contactPhone: '+1 (555) 891-2344',
    status: 'Active',
    patientsCount: 980,
    ordersCount: 641,
    revenue: 64230,
    commission: 9820,
    growth: '+11.2%',
    createdAt: 'Feb 03, 2025',
    primaryColor: '#2D82C4',
    secondaryColor: '#6DBE45',
    defaultMarkup: 30,
    address: '880 Ocean Ave, Santa Monica, CA 90403',
    tagline: 'Modern Telehealth for Longevity & Vitality',
    fontFamily: 'Inter',
    borderRadius: 'rounded-lg',
    headerTheme: 'white',
    portalTitle: 'XYZ Health Prescription Portal',
    welcomeMessage: 'Access direct compounded therapies delivered straight to your home.',
    supportEmail: 'care@xyzhealth.org',
    supportPhone: '+1 (888) 992-1020',
    hidePoweredBy: true,
    termsUrl: 'https://rx.xyzhealth.org/terms',
    privacyUrl: 'https://rx.xyzhealth.org/privacy'
  },
  {
    id: 'aff-03',
    name: 'HealthPlus Direct',
    slug: 'healthplus',
    domain: 'portal.healthplus.co',
    subdomain: 'healthplus.leanbloom.com',
    contactName: 'David Sterling',
    contactEmail: 'admin@healthplus.co',
    contactPhone: '+1 (555) 431-7720',
    status: 'Pending',
    patientsCount: 430,
    ordersCount: 210,
    revenue: 21800,
    commission: 3100,
    growth: '+7.8%',
    createdAt: 'Aug 14, 2026',
    primaryColor: '#12345F',
    secondaryColor: '#3A91D8',
    defaultMarkup: 20,
    address: '500 Brickell Key Dr, Miami, FL 33131',
    tagline: 'Direct-to-Consumer Clinical Pharmacy Care',
    fontFamily: 'Outfit',
    borderRadius: 'rounded-xl',
    headerTheme: 'navy',
    portalTitle: 'HealthPlus Direct Intake',
    welcomeMessage: 'Clinical wellness consultations and prescription refilling made simple.',
    supportEmail: 'help@healthplus.co',
    supportPhone: '+1 (800) 555-0199',
    hidePoweredBy: false
  },
  {
    id: 'aff-04',
    name: 'Peak Vitality Telehealth',
    slug: 'peak-vitality',
    domain: 'care.peakvitality.com',
    subdomain: 'peakvitality.leanbloom.com',
    contactName: 'Dr. Sarah Jenkins',
    contactEmail: 'sjenkins@peakvitality.com',
    contactPhone: '+1 (555) 723-9901',
    status: 'Active',
    patientsCount: 1650,
    ordersCount: 1120,
    revenue: 118400,
    commission: 18200,
    growth: '+19.4%',
    createdAt: 'Nov 09, 2024',
    primaryColor: '#173B72',
    secondaryColor: '#4FAF4A',
    defaultMarkup: 32,
    address: '2200 Market St, Denver, CO 80205',
    tagline: 'Hormone Optimization & Peptide Therapies',
    fontFamily: 'Plus Jakarta Sans',
    borderRadius: 'rounded-full',
    headerTheme: 'navy',
    portalTitle: 'Peak Vitality Patient Cloud',
    welcomeMessage: 'Welcome! Complete your confidential medical health evaluation in under 3 minutes.',
    supportEmail: 'prescriptions@peakvitality.com',
    supportPhone: '+1 (877) 833-7325',
    hidePoweredBy: true,
    termsUrl: 'https://care.peakvitality.com/legal/terms',
    privacyUrl: 'https://care.peakvitality.com/legal/privacy'
  },
  {
    id: 'aff-05',
    name: 'NuLife Regenerative',
    slug: 'nulife',
    domain: 'telemed.nulife.io',
    subdomain: 'nulife.leanbloom.com',
    contactName: 'Robert Vance, COO',
    contactEmail: 'robert@nulife.io',
    contactPhone: '+1 (555) 604-1188',
    status: 'Active',
    patientsCount: 780,
    ordersCount: 512,
    revenue: 52900,
    commission: 7600,
    growth: '+9.1%',
    createdAt: 'Mar 22, 2025',
    primaryColor: '#2D82C4',
    secondaryColor: '#4FAF4A',
    defaultMarkup: 28,
    address: '450 North Michigan Ave, Chicago, IL 60611',
    tagline: 'Next-Gen Regenerative Medicine & Cellular Health',
    fontFamily: 'DM Sans',
    borderRadius: 'rounded-lg',
    headerTheme: 'white',
    portalTitle: 'NuLife Regenerative Health Hub',
    welcomeMessage: 'Empowering your longevity with doctor-approved cellular formulations.',
    supportEmail: 'concierge@nulife.io',
    supportPhone: '+1 (800) 714-3320',
    hidePoweredBy: false
  },
  {
    id: 'aff-06',
    name: 'Elevate Health Systems',
    slug: 'elevate-health',
    domain: 'clinic.elevatehealth.us',
    subdomain: 'elevate.leanbloom.com',
    contactName: 'Amanda Croft',
    contactEmail: 'acroft@elevatehealth.us',
    contactPhone: '+1 (555) 231-6677',
    status: 'Inactive',
    patientsCount: 190,
    ordersCount: 88,
    revenue: 8900,
    commission: 1240,
    growth: '-2.4%',
    createdAt: 'May 04, 2025',
    primaryColor: '#667085',
    secondaryColor: '#98A2B3',
    defaultMarkup: 15,
    address: '100 Main St, Seattle, WA 98101',
    tagline: 'Community Wellness & Preventative Tele-Clinics',
    fontFamily: 'Inter',
    borderRadius: 'rounded-md',
    headerTheme: 'white',
    portalTitle: 'Elevate Health Clinic Intake',
    welcomeMessage: 'Please consult your primary care provider before starting.',
    supportEmail: 'contact@elevatehealth.us',
    supportPhone: '+1 (800) 902-1144',
    hidePoweredBy: false
  },
  {
    id: 'aff-07',
    name: 'BioBloom Metabolic',
    slug: 'biobloom',
    domain: 'rx.biobloom.health',
    subdomain: 'biobloom.leanbloom.com',
    contactName: 'Dr. Arthur Pendelton',
    contactEmail: 'art@biobloom.health',
    contactPhone: '+1 (555) 902-3344',
    status: 'Suspended',
    patientsCount: 310,
    ordersCount: 140,
    revenue: 14200,
    commission: 1950,
    growth: '-8.1%',
    createdAt: 'Jun 19, 2025',
    primaryColor: '#D64545',
    secondaryColor: '#173B72',
    defaultMarkup: 20,
    address: '77 West Paces Ferry Rd, Atlanta, GA 30305',
    tagline: 'Targeted Metabolic Weight Management',
    fontFamily: 'Plus Jakarta Sans',
    borderRadius: 'rounded-xl',
    headerTheme: 'dark',
    portalTitle: 'BioBloom Metabolic Portal',
    welcomeMessage: 'Service temporarily undergoing compliance review.',
    supportEmail: 'support@biobloom.health',
    supportPhone: '+1 (800) 441-9922',
    hidePoweredBy: false
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Weight Management (GLP-1 Dual Agonist)',
    category: 'Medical Program',
    basePrice: 299,
    minimumPrice: 299,
    activeAffiliatesCount: 84,
    ordersCount: 4821,
    status: 'Active',
    description: 'Weekly clinical compounded titration protocol with doctor check-ins and lab review.',
    stockStatus: 'In Stock'
  },
  {
    id: 'prod-02',
    name: 'Metabolic Health Baseline & Labs',
    category: 'Medical Program',
    basePrice: 189,
    minimumPrice: 199,
    activeAffiliatesCount: 62,
    ordersCount: 2940,
    status: 'Active',
    description: 'Comprehensive biomarker assessment including HbA1c, fasting insulin, and lipid panel.',
    stockStatus: 'In Stock'
  },
  {
    id: 'prod-03',
    name: 'Hormone Optimization Therapy (TRT/HRT)',
    category: 'Medical Program',
    basePrice: 220,
    minimumPrice: 249,
    activeAffiliatesCount: 51,
    ordersCount: 3110,
    status: 'Active',
    description: 'Physician-supervised bioidentical hormone therapy with mandatory quarterly lab checks.',
    stockStatus: 'Compounding'
  },
  {
    id: 'prod-04',
    name: 'Longevity NAD+ Cellular Protocol',
    category: 'Wellness Pack',
    basePrice: 165,
    minimumPrice: 185,
    activeAffiliatesCount: 44,
    ordersCount: 1890,
    status: 'Active',
    description: 'High-purity subcutaneous NAD+ vial kit with reconstitution sterile supply pack.',
    stockStatus: 'In Stock'
  },
  {
    id: 'prod-05',
    name: 'Telehealth Physician Clinical Consult',
    category: 'Telehealth Consult',
    basePrice: 75,
    minimumPrice: 85,
    activeAffiliatesCount: 114,
    ordersCount: 6240,
    status: 'Active',
    description: 'Synchronous or asynchronous video/clinical chart evaluation with licensed state prescriber.',
    stockStatus: 'In Stock'
  },
  {
    id: 'prod-06',
    name: 'Advanced Hair Follicle Restoration Pack',
    category: 'Prescription Refill',
    basePrice: 89,
    minimumPrice: 109,
    activeAffiliatesCount: 38,
    ordersCount: 1420,
    status: 'Active',
    description: 'Custom topical compound of Minoxidil, Finasteride, and Tretinoin foam delivery.',
    stockStatus: 'In Stock'
  }
];

export const INITIAL_PRICING_RULES: AffiliatePriceRule[] = [
  {
    productId: 'prod-01',
    productName: 'Weight Management (GLP-1 Dual Agonist)',
    basePrice: 299,
    minimumPrice: 299,
    activeAffiliates: 84,
    affiliatePriceExamples: [
      { affiliateName: 'ABC Wellness', sellingPrice: 349 },
      { affiliateName: 'XYZ Health', sellingPrice: 399 },
      { affiliateName: 'HealthPlus Direct', sellingPrice: 329 },
      { affiliateName: 'Peak Vitality', sellingPrice: 369 }
    ]
  },
  {
    productId: 'prod-02',
    productName: 'Metabolic Health Baseline & Labs',
    basePrice: 189,
    minimumPrice: 199,
    activeAffiliates: 62,
    affiliatePriceExamples: [
      { affiliateName: 'ABC Wellness', sellingPrice: 229 },
      { affiliateName: 'XYZ Health', sellingPrice: 249 },
      { affiliateName: 'NuLife Regenerative', sellingPrice: 219 }
    ]
  },
  {
    productId: 'prod-03',
    productName: 'Hormone Optimization Therapy (TRT/HRT)',
    basePrice: 220,
    minimumPrice: 249,
    activeAffiliates: 51,
    affiliatePriceExamples: [
      { affiliateName: 'Peak Vitality', sellingPrice: 289 },
      { affiliateName: 'ABC Wellness', sellingPrice: 279 },
      { affiliateName: 'XYZ Health', sellingPrice: 299 }
    ]
  },
  {
    productId: 'prod-04',
    productName: 'Longevity NAD+ Cellular Protocol',
    basePrice: 165,
    minimumPrice: 185,
    activeAffiliates: 44,
    affiliatePriceExamples: [
      { affiliateName: 'NuLife Regenerative', sellingPrice: 210 },
      { affiliateName: 'Peak Vitality', sellingPrice: 225 }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: '#LB-10248',
    patientName: 'Sarah Johnson',
    patientEmail: 'sarah.j@gmail.com',
    affiliateId: 'aff-01',
    affiliateName: 'ABC Wellness',
    productName: 'Weight Management (GLP-1)',
    amount: 349,
    status: 'Completed',
    date: 'Sep 18, 2026',
    paymentMethod: 'Stripe Direct',
    shippingStatus: 'Delivered'
  },
  {
    id: '#LB-10247',
    patientName: 'Michael Chang',
    patientEmail: 'mchang@techcorp.io',
    affiliateId: 'aff-02',
    affiliateName: 'XYZ Health',
    productName: 'Hormone Optimization Therapy',
    amount: 299,
    status: 'Processing',
    date: 'Sep 18, 2026',
    paymentMethod: 'Credit Card',
    shippingStatus: 'Fulfillment Queue'
  },
  {
    id: '#LB-10246',
    patientName: 'Emily Davis',
    patientEmail: 'emily.davis@yahoo.com',
    affiliateId: 'aff-04',
    affiliateName: 'Peak Vitality Telehealth',
    productName: 'Longevity NAD+ Protocol',
    amount: 225,
    status: 'Completed',
    date: 'Sep 17, 2026',
    paymentMethod: 'Credit Card',
    shippingStatus: 'In Transit'
  },
  {
    id: '#LB-10245',
    patientName: 'David Miller',
    patientEmail: 'davidm78@gmail.com',
    affiliateId: 'aff-01',
    affiliateName: 'ABC Wellness',
    productName: 'Metabolic Baseline & Labs',
    amount: 229,
    status: 'Pending',
    date: 'Sep 17, 2026',
    paymentMethod: 'ACH Transfer',
    shippingStatus: 'Pending Lab'
  },
  {
    id: '#LB-10244',
    patientName: 'Rebecca Thorne',
    patientEmail: 'rebecca.thorne@icloud.com',
    affiliateId: 'aff-05',
    affiliateName: 'NuLife Regenerative',
    productName: 'Weight Management (GLP-1)',
    amount: 359,
    status: 'Processing',
    date: 'Sep 16, 2026',
    paymentMethod: 'Stripe Direct',
    shippingStatus: 'Fulfillment Queue'
  },
  {
    id: '#LB-10243',
    patientName: 'Jonathan Hayes',
    patientEmail: 'jhayes@consulting.com',
    affiliateId: 'aff-02',
    affiliateName: 'XYZ Health',
    productName: 'Telehealth Clinical Consult',
    amount: 85,
    status: 'Completed',
    date: 'Sep 16, 2026',
    paymentMethod: 'Credit Card',
    shippingStatus: 'Delivered'
  },
  {
    id: '#LB-10242',
    patientName: 'Claire Bennett',
    patientEmail: 'cbennett@outlook.com',
    affiliateId: 'aff-03',
    affiliateName: 'HealthPlus Direct',
    productName: 'Weight Management (GLP-1)',
    amount: 329,
    status: 'Refunded',
    date: 'Sep 15, 2026',
    paymentMethod: 'Stripe Direct',
    shippingStatus: 'Pending Lab'
  },
  {
    id: '#LB-10241',
    patientName: 'Brian Kowalski',
    patientEmail: 'briank@gmail.com',
    affiliateId: 'aff-04',
    affiliateName: 'Peak Vitality Telehealth',
    productName: 'Hair Restoration Pack',
    amount: 119,
    status: 'Completed',
    date: 'Sep 15, 2026',
    paymentMethod: 'Credit Card',
    shippingStatus: 'Delivered'
  },
  {
    id: '#LB-10240',
    patientName: 'Sophia Martinez',
    patientEmail: 'smartinez@gmail.com',
    affiliateId: 'aff-01',
    affiliateName: 'ABC Wellness',
    productName: 'Weight Management (GLP-1)',
    amount: 349,
    status: 'Cancelled',
    date: 'Sep 14, 2026',
    paymentMethod: 'Credit Card'
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-901',
    name: 'Sarah Johnson',
    email: 'sarah.j@gmail.com',
    phone: '+1 (555) 234-9812',
    affiliateId: 'aff-01',
    affiliateName: 'ABC Wellness',
    ordersCount: 5,
    totalSpent: 1745,
    status: 'Active',
    lastActivity: '2 hours ago',
    joinedDate: 'Jan 20, 2025',
    activeProgram: 'Weight Management (GLP-1)',
    prescriptionsCount: 3
  },
  {
    id: 'pat-902',
    name: 'Michael Chang',
    email: 'mchang@techcorp.io',
    phone: '+1 (555) 872-1049',
    affiliateId: 'aff-02',
    affiliateName: 'XYZ Health',
    ordersCount: 4,
    totalSpent: 1196,
    status: 'Active',
    lastActivity: '4 hours ago',
    joinedDate: 'Feb 14, 2025',
    activeProgram: 'Hormone Optimization (TRT)',
    prescriptionsCount: 2
  },
  {
    id: 'pat-903',
    name: 'Emily Davis',
    email: 'emily.davis@yahoo.com',
    phone: '+1 (555) 651-8890',
    affiliateId: 'aff-04',
    affiliateName: 'Peak Vitality Telehealth',
    ordersCount: 8,
    totalSpent: 1980,
    status: 'Active',
    lastActivity: 'Yesterday',
    joinedDate: 'Nov 18, 2024',
    activeProgram: 'Longevity NAD+ Protocol',
    prescriptionsCount: 4
  },
  {
    id: 'pat-904',
    name: 'David Miller',
    email: 'davidm78@gmail.com',
    phone: '+1 (555) 439-0021',
    affiliateId: 'aff-01',
    affiliateName: 'ABC Wellness',
    ordersCount: 1,
    totalSpent: 229,
    status: 'Pending Intake',
    lastActivity: '1 day ago',
    joinedDate: 'Sep 16, 2026',
    activeProgram: 'Metabolic Baseline & Labs',
    prescriptionsCount: 0
  },
  {
    id: 'pat-905',
    name: 'Rebecca Thorne',
    email: 'rebecca.thorne@icloud.com',
    phone: '+1 (555) 330-9114',
    affiliateId: 'aff-05',
    affiliateName: 'NuLife Regenerative',
    ordersCount: 3,
    totalSpent: 1077,
    status: 'Active',
    lastActivity: '2 days ago',
    joinedDate: 'Apr 02, 2025',
    activeProgram: 'Weight Management (GLP-1)',
    prescriptionsCount: 2
  },
  {
    id: 'pat-906',
    name: 'Jonathan Hayes',
    email: 'jhayes@consulting.com',
    phone: '+1 (555) 991-4432',
    affiliateId: 'aff-02',
    affiliateName: 'XYZ Health',
    ordersCount: 2,
    totalSpent: 170,
    status: 'Inactive',
    lastActivity: '3 weeks ago',
    joinedDate: 'May 10, 2025',
    activeProgram: 'Telehealth Consult',
    prescriptionsCount: 1
  }
];

export const INITIAL_COMMISSIONS: CommissionRecord[] = [
  {
    id: 'com-101',
    affiliateId: 'aff-01',
    affiliateName: 'ABC Wellness',
    ordersCount: 823,
    grossSales: 82450,
    baseRevenue: 58900,
    markup: 23550,
    commissionEarned: 12300,
    amountPayable: 12300,
    paymentStatus: 'Paid',
    payoutDate: 'Sep 15, 2026'
  },
  {
    id: 'com-102',
    affiliateId: 'aff-04',
    affiliateName: 'Peak Vitality Telehealth',
    ordersCount: 1120,
    grossSales: 118400,
    baseRevenue: 84200,
    markup: 34200,
    commissionEarned: 18200,
    amountPayable: 18200,
    paymentStatus: 'Paid',
    payoutDate: 'Sep 15, 2026'
  },
  {
    id: 'com-103',
    affiliateId: 'aff-02',
    affiliateName: 'XYZ Health',
    ordersCount: 641,
    grossSales: 64230,
    baseRevenue: 46100,
    markup: 18130,
    commissionEarned: 9820,
    amountPayable: 9820,
    paymentStatus: 'Processing',
    payoutDate: 'Sep 22, 2026'
  },
  {
    id: 'com-104',
    affiliateId: 'aff-05',
    affiliateName: 'NuLife Regenerative',
    ordersCount: 512,
    grossSales: 52900,
    baseRevenue: 38200,
    markup: 14700,
    commissionEarned: 7600,
    amountPayable: 7600,
    paymentStatus: 'Pending',
    payoutDate: 'Sep 30, 2026'
  },
  {
    id: 'com-105',
    affiliateId: 'aff-03',
    affiliateName: 'HealthPlus Direct',
    ordersCount: 210,
    grossSales: 21800,
    baseRevenue: 16100,
    markup: 5700,
    commissionEarned: 3100,
    amountPayable: 3100,
    paymentStatus: 'Pending',
    payoutDate: 'Sep 30, 2026'
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'PAY-88201',
    orderId: '#LB-10248',
    affiliateId: 'aff-01',
    affiliateName: 'ABC Wellness',
    grossAmount: 349,
    commission: 50,
    netLeanBloom: 299,
    status: 'Paid',
    date: 'Sep 18, 2026',
    method: 'Stripe Direct'
  },
  {
    id: 'PAY-88200',
    orderId: '#LB-10247',
    affiliateId: 'aff-02',
    affiliateName: 'XYZ Health',
    grossAmount: 299,
    commission: 45,
    netLeanBloom: 254,
    status: 'Processing',
    date: 'Sep 18, 2026',
    method: 'Credit Card'
  },
  {
    id: 'PAY-88199',
    orderId: '#LB-10246',
    affiliateId: 'aff-04',
    affiliateName: 'Peak Vitality Telehealth',
    grossAmount: 225,
    commission: 40,
    netLeanBloom: 185,
    status: 'Paid',
    date: 'Sep 17, 2026',
    method: 'Credit Card'
  },
  {
    id: 'PAY-88198',
    orderId: '#LB-10245',
    affiliateId: 'aff-01',
    affiliateName: 'ABC Wellness',
    grossAmount: 229,
    commission: 30,
    netLeanBloom: 199,
    status: 'Pending',
    date: 'Sep 17, 2026',
    method: 'ACH Transfer'
  },
  {
    id: 'PAY-88197',
    orderId: '#LB-10242',
    affiliateId: 'aff-03',
    affiliateName: 'HealthPlus Direct',
    grossAmount: 329,
    commission: 0,
    netLeanBloom: 0,
    status: 'Refunded',
    date: 'Sep 15, 2026',
    method: 'Stripe Direct'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-501',
    adminName: 'John Admin',
    adminEmail: 'john.admin@leanbloom.com',
    action: 'Updated product minimum price',
    target: 'Weight Management (GLP-1)',
    oldValue: '$289.00',
    newValue: '$299.00',
    timestamp: 'Sep 18, 2026, 4:32 PM',
    category: 'Pricing',
    ipAddress: '198.51.100.44'
  },
  {
    id: 'log-502',
    adminName: 'Sarah MasterStaff',
    adminEmail: 'sarah.m@leanbloom.com',
    action: 'Approved new affiliate onboarding',
    target: 'HealthPlus Direct (aff-03)',
    timestamp: 'Sep 17, 2026, 2:15 PM',
    category: 'Affiliate',
    ipAddress: '198.51.100.12'
  },
  {
    id: 'log-503',
    adminName: 'John Admin',
    adminEmail: 'john.admin@leanbloom.com',
    action: 'Initiated bi-weekly commission batch',
    target: '$30,500 across 2 affiliates',
    newValue: 'Dispatched via Stripe Connect',
    timestamp: 'Sep 15, 2026, 9:00 AM',
    category: 'Payment',
    ipAddress: '198.51.100.44'
  },
  {
    id: 'log-504',
    adminName: 'Finance Admin Alex',
    adminEmail: 'alex.k@leanbloom.com',
    action: 'Modified markup model threshold',
    target: 'Tier-1 High Volume Affiliates',
    oldValue: '30% markup cap',
    newValue: '35% markup cap',
    timestamp: 'Sep 14, 2026, 11:20 AM',
    category: 'Pricing',
    ipAddress: '198.51.100.89'
  },
  {
    id: 'log-505',
    adminName: 'System Security',
    adminEmail: 'system@leanbloom.com',
    action: 'Enforced mandatory 2FA on affiliate owners',
    target: 'Global Tenant Policy',
    newValue: 'Active',
    timestamp: 'Sep 12, 2026, 12:00 AM',
    category: 'Security',
    ipAddress: '127.0.0.1'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Affiliate Onboarding Application',
    description: 'VitalHealth Partners submitted credentials and clinical director NPI for review.',
    timestamp: '10m ago',
    severity: 'Information',
    read: false,
    category: 'Affiliate'
  },
  {
    id: 'notif-2',
    title: 'Semaglutide Compounding Buffer Alert',
    description: 'Compounding partner fulfillment inventory reached 18% reserve for Midwest region.',
    timestamp: '45m ago',
    severity: 'Warning',
    read: false,
    category: 'Inventory'
  },
  {
    id: 'notif-3',
    title: 'Bi-Weekly Affiliate Payout Cleared',
    description: 'Successfully routed $30,500.00 via ACH Stripe Connect to ABC Wellness and Peak Vitality.',
    timestamp: '3h ago',
    severity: 'Success',
    read: true,
    category: 'Payment'
  },
  {
    id: 'notif-4',
    title: 'Domain SSL Verification Required',
    description: 'Custom domain rx.biobloom.health CNAME propagation timeout occurred.',
    timestamp: '1d ago',
    severity: 'Critical',
    read: false,
    category: 'System'
  }
];

export const INITIAL_USERS: AdminUser[] = [
  {
    id: 'usr-1',
    name: 'John Admin',
    email: 'john.admin@leanbloom.com',
    role: 'Master Admin',
    status: 'Active',
    lastLogin: 'Just now',
    createdAt: 'Oct 01, 2024'
  },
  {
    id: 'usr-2',
    name: 'Elena Rostova',
    email: 'elena.clinical@leanbloom.com',
    role: 'Operations Admin',
    status: 'Active',
    lastLogin: '2 hours ago',
    createdAt: 'Jan 15, 2025'
  },
  {
    id: 'usr-3',
    name: 'Alex Sterling',
    email: 'alex.finance@leanbloom.com',
    role: 'Finance Admin',
    status: 'Active',
    lastLogin: 'Yesterday',
    createdAt: 'Mar 10, 2025'
  },
  {
    id: 'usr-4',
    name: 'Sarah Mitchell',
    email: 'sarah.staff@leanbloom.com',
    role: 'Master Staff',
    status: 'Active',
    lastLogin: '3 days ago',
    createdAt: 'Jun 22, 2025'
  }
];

export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 'prv-01',
    name: 'Dr. Evelyn Reed, MD',
    specialty: 'Endocrinology & Metabolic Health',
    npi: '1982736450',
    licenseStates: ['CA', 'TX', 'NY', 'FL', 'IL'],
    activePatients: 412,
    consultsCompleted: 1840,
    status: 'Active',
    rating: 4.9
  },
  {
    id: 'prv-02',
    name: 'Dr. Thomas Gallagher, DO',
    specialty: 'Family Medicine & Anti-Aging',
    npi: '1209384756',
    licenseStates: ['CO', 'WA', 'AZ', 'UT', 'NV'],
    activePatients: 360,
    consultsCompleted: 1520,
    status: 'Active',
    rating: 4.8
  },
  {
    id: 'prv-03',
    name: 'Maya Lin, FNP-BC',
    specialty: 'Telehealth Clinical Nurse Specialist',
    npi: '1548293011',
    licenseStates: ['TX', 'GA', 'NC', 'TN'],
    activePatients: 290,
    consultsCompleted: 1190,
    status: 'Active',
    rating: 4.9
  }
];

export const REVENUE_TIMELINE = {
  '7 Days': [
    { label: 'Sep 12', total: 38400, affiliate: 28200, leanbloom: 10200, orders: 152, patients: 98 },
    { label: 'Sep 13', total: 41200, affiliate: 30100, leanbloom: 11100, orders: 168, patients: 110 },
    { label: 'Sep 14', total: 39500, affiliate: 28900, leanbloom: 10600, orders: 159, patients: 102 },
    { label: 'Sep 15', total: 46800, affiliate: 34100, leanbloom: 12700, orders: 189, patients: 128 },
    { label: 'Sep 16', total: 44300, affiliate: 32400, leanbloom: 11900, orders: 174, patients: 114 },
    { label: 'Sep 17', total: 48900, affiliate: 35800, leanbloom: 13100, orders: 196, patients: 135 },
    { label: 'Sep 18', total: 52100, affiliate: 38200, leanbloom: 13900, orders: 212, patients: 146 }
  ],
  '30 Days': [
    { label: 'Week 1', total: 285000, affiliate: 208000, leanbloom: 77000, orders: 1140, patients: 780 },
    { label: 'Week 2', total: 312000, affiliate: 228000, leanbloom: 84000, orders: 1260, patients: 840 },
    { label: 'Week 3', total: 334000, affiliate: 244000, leanbloom: 90000, orders: 1340, patients: 920 },
    { label: 'Week 4', total: 353920, affiliate: 258000, leanbloom: 95920, orders: 1410, patients: 980 }
  ],
  '3 Months': [
    { label: 'July 2026', total: 1090000, affiliate: 795000, leanbloom: 295000, orders: 4350, patients: 2980 },
    { label: 'August 2026', total: 1180000, affiliate: 860000, leanbloom: 320000, orders: 4720, patients: 3240 },
    { label: 'Sep 2026', total: 1284920, affiliate: 938000, leanbloom: 346920, orders: 5120, patients: 3510 }
  ],
  '6 Months': [
    { label: 'Apr', total: 890000, affiliate: 650000, leanbloom: 240000, orders: 3600, patients: 2400 },
    { label: 'May', total: 950000, affiliate: 690000, leanbloom: 260000, orders: 3820, patients: 2610 },
    { label: 'Jun', total: 1020000, affiliate: 745000, leanbloom: 275000, orders: 4100, patients: 2800 },
    { label: 'Jul', total: 1090000, affiliate: 795000, leanbloom: 295000, orders: 4350, patients: 2980 },
    { label: 'Aug', total: 1180000, affiliate: 860000, leanbloom: 320000, orders: 4720, patients: 3240 },
    { label: 'Sep', total: 1284920, affiliate: 938000, leanbloom: 346920, orders: 5120, patients: 3510 }
  ],
  '12 Months': [
    { label: 'Q4 2025', total: 2200000, affiliate: 1600000, leanbloom: 600000, orders: 8900, patients: 6100 },
    { label: 'Q1 2026', total: 2750000, affiliate: 2010000, leanbloom: 740000, orders: 11100, patients: 7600 },
    { label: 'Q2 2026', total: 3200000, affiliate: 2340000, leanbloom: 860000, orders: 12900, patients: 8850 },
    { label: 'Q3 2026', total: 3840000, affiliate: 2800000, leanbloom: 1040000, orders: 15400, patients: 10500 }
  ]
};

export const INITIAL_DOMAINS: DomainItem[] = [
  {
    id: 'dom-01',
    affiliateId: 'aff-01',
    affiliateName: 'ABC Wellness',
    domain: 'wellness.abcclinic.com',
    type: 'Custom Domain',
    target: 'cname.leanbloom-network.com',
    status: 'Active',
    sslStatus: 'Valid',
    sslExpiry: 'Dec 14, 2026',
    primary: true,
    hstsEnabled: true,
    createdAt: 'Jan 12, 2025',
    lastVerified: '12 mins ago',
    edgeLatencyMs: 32,
    dnsRecords: [
      { type: 'CNAME', host: 'wellness', value: 'cname.leanbloom-network.com', status: 'Verified', ttl: 'Auto / 300s' },
      { type: 'TXT', host: '_leanbloom-challenge.wellness', value: 'lb-auth-abc-98124971-verify', status: 'Verified', ttl: '3600s' }
    ]
  },
  {
    id: 'dom-02',
    affiliateId: 'aff-01',
    affiliateName: 'ABC Wellness',
    domain: 'abcwellness.leanbloom.com',
    type: 'Platform Subdomain',
    target: 'edge-cluster.leanbloom.internal',
    status: 'Active',
    sslStatus: 'Valid',
    sslExpiry: 'Auto-renewed (Wildcard)',
    primary: false,
    hstsEnabled: true,
    createdAt: 'Jan 12, 2025',
    lastVerified: 'Just now',
    edgeLatencyMs: 24,
    dnsRecords: [
      { type: 'CNAME', host: 'abcwellness', value: 'edge-cluster.leanbloom.internal', status: 'Verified', ttl: 'Managed' }
    ]
  },
  {
    id: 'dom-03',
    affiliateId: 'aff-02',
    affiliateName: 'XYZ Health',
    domain: 'rx.xyzhealth.org',
    type: 'Custom Domain',
    target: 'cname.leanbloom-network.com',
    status: 'Active',
    sslStatus: 'Valid',
    sslExpiry: 'Jan 28, 2027',
    primary: true,
    hstsEnabled: true,
    createdAt: 'Feb 03, 2025',
    lastVerified: '4 hours ago',
    edgeLatencyMs: 29,
    dnsRecords: [
      { type: 'CNAME', host: 'rx', value: 'cname.leanbloom-network.com', status: 'Verified', ttl: 'Auto / 300s' },
      { type: 'TXT', host: '_leanbloom-challenge.rx', value: 'lb-auth-xyz-10492812-verify', status: 'Verified', ttl: '3600s' }
    ]
  },
  {
    id: 'dom-04',
    affiliateId: 'aff-03',
    affiliateName: 'HealthPlus Direct',
    domain: 'portal.healthplus.co',
    type: 'Custom Domain',
    target: 'cname.leanbloom-network.com',
    status: 'Pending DNS',
    sslStatus: 'Issuing',
    sslExpiry: 'Pending Verification',
    primary: true,
    hstsEnabled: false,
    createdAt: 'Aug 14, 2026',
    lastVerified: '18 mins ago',
    edgeLatencyMs: 64,
    dnsRecords: [
      { type: 'CNAME', host: 'portal', value: 'cname.leanbloom-network.com', status: 'Pending', ttl: 'Auto / 300s' },
      { type: 'TXT', host: '_leanbloom-challenge.portal', value: 'lb-auth-hp-44910283-verify', status: 'Verified', ttl: '3600s' }
    ]
  },
  {
    id: 'dom-05',
    affiliateId: 'aff-04',
    affiliateName: 'Peak Vitality Telehealth',
    domain: 'care.peakvitality.com',
    type: 'Custom Domain',
    target: 'cname.leanbloom-network.com',
    status: 'Active',
    sslStatus: 'Valid',
    sslExpiry: 'Nov 02, 2026',
    primary: true,
    hstsEnabled: true,
    createdAt: 'Nov 09, 2024',
    lastVerified: '1 hour ago',
    edgeLatencyMs: 22,
    dnsRecords: [
      { type: 'CNAME', host: 'care', value: 'cname.leanbloom-network.com', status: 'Verified', ttl: 'Auto / 300s' },
      { type: 'TXT', host: '_leanbloom-challenge.care', value: 'lb-auth-pv-88192301-verify', status: 'Verified', ttl: '3600s' }
    ]
  },
  {
    id: 'dom-06',
    affiliateId: 'aff-05',
    affiliateName: 'NuLife Regenerative',
    domain: 'telemed.nulife.io',
    type: 'Custom Domain',
    target: 'cname.leanbloom-network.com',
    status: 'Active',
    sslStatus: 'Valid',
    sslExpiry: 'Oct 19, 2026',
    primary: true,
    hstsEnabled: true,
    createdAt: 'Mar 22, 2025',
    lastVerified: '2 hours ago',
    edgeLatencyMs: 38,
    dnsRecords: [
      { type: 'CNAME', host: 'telemed', value: 'cname.leanbloom-network.com', status: 'Verified', ttl: 'Auto / 300s' },
      { type: 'TXT', host: '_leanbloom-challenge.telemed', value: 'lb-auth-nl-77291039-verify', status: 'Verified', ttl: '3600s' }
    ]
  },
  {
    id: 'dom-07',
    affiliateId: 'aff-06',
    affiliateName: 'Elevate Health Systems',
    domain: 'clinic.elevatehealth.us',
    type: 'Custom Domain',
    target: 'cname.leanbloom-network.com',
    status: 'Configuration Error',
    sslStatus: 'Failed',
    sslExpiry: 'Expired / Unresolved',
    primary: true,
    hstsEnabled: false,
    createdAt: 'May 04, 2025',
    lastVerified: '3 days ago',
    edgeLatencyMs: 140,
    dnsRecords: [
      { type: 'CNAME', host: 'clinic', value: 'cname.leanbloom-network.com', status: 'Error', ttl: 'Auto / 300s' },
      { type: 'TXT', host: '_leanbloom-challenge.clinic', value: 'lb-auth-eh-11029384-verify', status: 'Pending', ttl: '3600s' }
    ]
  },
  {
    id: 'dom-08',
    affiliateId: 'aff-07',
    affiliateName: 'BioBloom Metabolic',
    domain: 'rx.biobloom.health',
    type: 'Custom Domain',
    target: 'cname.leanbloom-network.com',
    status: 'Active',
    sslStatus: 'Valid',
    sslExpiry: 'Jun 19, 2026',
    primary: true,
    hstsEnabled: true,
    createdAt: 'Jun 19, 2025',
    lastVerified: '5 hours ago',
    edgeLatencyMs: 41,
    dnsRecords: [
      { type: 'CNAME', host: 'rx', value: 'cname.leanbloom-network.com', status: 'Verified', ttl: 'Auto / 300s' },
      { type: 'TXT', host: '_leanbloom-challenge.rx', value: 'lb-auth-bb-33918204-verify', status: 'Verified', ttl: '3600s' }
    ]
  }
];
