import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Globe,
  Users
} from 'lucide-react';
import { LeanBloomLogo } from '../brand/LeanBloomLogo';

interface SignUpViewProps {
  onSignUpSuccess: (userData: {
    name: string;
    email: string;
    organization: string;
    role?: string;
    affiliateId?: string;
  }) => void;
  onGoToSignIn: () => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({
  onSignUpSuccess,
  onGoToSignIn
}) => {
  const [accountType, setAccountType] = useState<'affiliate' | 'admin'>('affiliate');

  const [formData, setFormData] = useState({
    clinicName: 'PureVitality Wellness Clinic',
    ownerName: 'Dr. Michael Chen',
    email: 'contact@purevitality.health',
    phone: '+1 (555) 782-9011',
    customDomain: 'rx.purevitality.health',
    password: 'SecurePartnerPass2026!'
  });

  const [agreed, setAgreed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignUpSuccess({
        name: formData.clinicName,
        email: formData.email,
        organization: formData.clinicName,
        role: accountType === 'affiliate' ? 'Affiliate' : 'Admin',
        affiliateId: accountType === 'affiliate' ? 'affiliate_001' : undefined
      });
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#174A87]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#4A9B52]/10 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <LeanBloomLogo size="lg" showSubtitle={false} className="mb-2" />
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-bold tracking-widest uppercase bg-[#4A9B52] text-white px-3 py-0.5 rounded-full">
              Partner Enrollment
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#172033]">
            Launch Your Telehealth Clinic
          </h2>
          <p className="mt-1 text-xs text-[#667085]">
            Instant white-label storefront, compounding pharmacy fulfillment & commission tracking
          </p>
        </div>

        {/* Account Type Selector */}
        <div className="mt-5 grid grid-cols-2 p-1 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <button
            type="button"
            onClick={() => setAccountType('affiliate')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              accountType === 'affiliate'
                ? 'bg-[#174A87] text-white shadow-xs'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Affiliate Clinic Account</span>
          </button>
          <button
            type="button"
            onClick={() => setAccountType('admin')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              accountType === 'admin'
                ? 'bg-[#174A87] text-white shadow-xs'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        <div className="mt-3 bg-white py-6 px-6 sm:px-8 shadow-xl rounded-2xl border border-[#E5E7EB]">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Clinic / Partner Name
                </label>
                <div className="relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.clinicName}
                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    className="block w-full pl-9 pr-3 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Authorized Contact Name
                </label>
                <div className="relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="block w-full pl-9 pr-3 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Business Email
                </label>
                <div className="relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full pl-9 pr-3 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Phone Number
                </label>
                <div className="relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="block w-full pl-9 pr-3 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Custom Domain (Optional)
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
                  <Globe className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={formData.customDomain}
                  onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                  placeholder="clinic.yourbrand.com"
                  className="block w-full pl-9 pr-3 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Password
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-9 pr-3 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                id="terms"
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 rounded text-[#174A87] border-gray-300 focus:ring-[#174A87]"
              />
              <label htmlFor="terms" className="text-[11px] text-[#667085] leading-normal">
                I agree to the LeanBloom Partner Agreement, BAA Business Associate Addendum, and HIPAA
                compliance terms.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !agreed}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-xs text-xs font-bold text-white bg-[#174A87] hover:bg-[#123B70] focus:outline-hidden transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <span>Provisioning affiliate workspace...</span>
              ) : (
                <>
                  <span>Create Account & Open Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#E5E7EB] text-center">
            <p className="text-xs text-[#667085]">
              Already registered with LeanBloom?{' '}
              <button
                type="button"
                onClick={onGoToSignIn}
                className="font-bold text-[#174A87] hover:underline ml-1"
              >
                Sign in to your dashboard
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
