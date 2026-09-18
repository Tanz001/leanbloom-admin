import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  CheckCircle2
} from 'lucide-react';
import { LeanBloomLogo } from '../brand/LeanBloomLogo';

interface SignInViewProps {
  onSignInSuccess: (userData: {
    name: string;
    email: string;
    role: string;
    affiliateId?: string;
  }) => void;
  onGoToSignUp: () => void;
}

export const SignInView: React.FC<SignInViewProps> = ({
  onSignInSuccess,
  onGoToSignUp
}) => {
  // Portal mode: 'affiliate' | 'admin'
  const [portalMode, setPortalMode] = useState<'affiliate' | 'admin'>('affiliate');

  // Form fields
  const [email, setEmail] = useState('contact@wellnesspartner.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Selected affiliate demo ID
  const [selectedAffiliateId, setSelectedAffiliateId] = useState<string>('affiliate_001');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (portalMode === 'affiliate') {
        const isAffB = selectedAffiliateId === 'affiliate_002' || email.includes('apex');
        onSignInSuccess({
          name: isAffB ? 'Apex Health Partner' : 'Wellness Partner LLC',
          email: email || (isAffB ? 'partners@apexhealth.io' : 'contact@wellnesspartner.com'),
          role: 'Affiliate',
          affiliateId: isAffB ? 'affiliate_002' : 'affiliate_001'
        });
      } else {
        onSignInSuccess({
          name: 'John Admin',
          email: email || 'admin@leanbloom.com',
          role: 'Master Admin'
        });
      }
    }, 450);
  };

  const handleSelectAffiliateDemo = (affId: string, affEmail: string) => {
    setPortalMode('affiliate');
    setSelectedAffiliateId(affId);
    setEmail(affEmail);
    setPassword('PartnerSecure2026!');
  };

  const handleSelectAdminDemo = () => {
    setPortalMode('admin');
    setEmail('john.admin@leanbloom.com');
    setPassword('MasterAdmin2026!');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Subtle brand gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#174A87]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#4A9B52]/10 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center text-center">
          <LeanBloomLogo size="lg" showSubtitle={false} className="mb-2" />
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-[11px] font-bold tracking-widest uppercase px-3 py-0.5 rounded-full transition-colors ${
                portalMode === 'affiliate'
                  ? 'bg-[#4A9B52] text-white'
                  : 'bg-[#174A87] text-white'
              }`}
            >
              {portalMode === 'affiliate' ? 'Affiliate Partner Portal' : 'Master Admin Gateway'}
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#172033]">
            {portalMode === 'affiliate' ? 'Sign in to Affiliate Portal' : 'Sign in to Master Admin'}
          </h2>
          <p className="mt-1 text-xs text-[#667085]">
            {portalMode === 'affiliate'
              ? 'Access your white-label clinic, orders, and commission payouts'
              : 'Enterprise control center for platform administration'}
          </p>
        </div>

        {/* Portal Mode Switcher Tabs */}
        <div className="mt-5 grid grid-cols-2 p-1 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <button
            type="button"
            onClick={() => {
              setPortalMode('affiliate');
              handleSelectAffiliateDemo('affiliate_001', 'contact@wellnesspartner.com');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              portalMode === 'affiliate'
                ? 'bg-[#174A87] text-white shadow-xs'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Affiliate Login</span>
          </button>
          <button
            type="button"
            onClick={handleSelectAdminDemo}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              portalMode === 'admin'
                ? 'bg-[#174A87] text-white shadow-xs'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Master Admin</span>
          </button>
        </div>

        {/* Demo Fast Account Selector */}
        <div className="mt-3 bg-white border border-[#E5E7EB] rounded-2xl p-3 shadow-2xs text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#172033] flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-[#4A9B52]" />
              <span>1-Click Evaluation Accounts:</span>
            </span>
            <span className="text-[10px] text-[#667085]">Auto-populates</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                handleSelectAffiliateDemo('affiliate_001', 'contact@wellnesspartner.com')
              }
              className={`p-2 text-left rounded-xl border text-[11px] transition-all ${
                portalMode === 'affiliate' && selectedAffiliateId === 'affiliate_001'
                  ? 'border-[#174A87] bg-[#EAF5EA]/40 ring-1 ring-[#174A87]'
                  : 'border-[#E5E7EB] hover:bg-[#F7F9FC]'
              }`}
            >
              <div className="font-bold text-[#172033] truncate">Affiliate A</div>
              <div className="text-[10px] text-[#4A9B52] font-semibold">Wellness Partner</div>
              <div className="text-[9px] text-[#667085] font-mono truncate">affiliate_001</div>
            </button>

            <button
              type="button"
              onClick={() =>
                handleSelectAffiliateDemo('affiliate_002', 'partners@apexhealth.io')
              }
              className={`p-2 text-left rounded-xl border text-[11px] transition-all ${
                portalMode === 'affiliate' && selectedAffiliateId === 'affiliate_002'
                  ? 'border-[#174A87] bg-[#EAF5EA]/40 ring-1 ring-[#174A87]'
                  : 'border-[#E5E7EB] hover:bg-[#F7F9FC]'
              }`}
            >
              <div className="font-bold text-[#172033] truncate">Affiliate B</div>
              <div className="text-[10px] text-[#4A9B52] font-semibold">Apex Health</div>
              <div className="text-[9px] text-[#667085] font-mono truncate">affiliate_002</div>
            </button>
          </div>
        </div>

        {/* Auth Form Card */}
        <div className="mt-3 bg-white py-6 px-6 sm:px-8 shadow-xl rounded-2xl border border-[#E5E7EB]">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#172033]">
                {portalMode === 'affiliate' ? 'Partner Account Email' : 'Enterprise Admin Email'}
              </label>
              <div className="mt-1 relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#667085]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@wellnesspartner.com"
                  className="block w-full pl-9 pr-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl text-[#172033] placeholder-[#98A2B3] focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-[#172033]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your registered partner email.')}
                  className="text-[11px] font-semibold text-[#174A87] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="mt-1 relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#667085]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-10 py-2 text-xs border border-[#E5E7EB] rounded-xl text-[#172033] placeholder-[#98A2B3] focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#667085] hover:text-[#172033]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded text-[#174A87] border-gray-300 focus:ring-[#174A87]"
                />
                <span className="text-xs text-[#667085]">Remember session</span>
              </label>

              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4A9B52] bg-[#EAF5EA] px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3 h-3" />
                HIPAA Protected
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              id="submit-signin-btn"
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-xs text-xs font-bold text-white bg-[#174A87] hover:bg-[#123B70] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#174A87] transition-all disabled:opacity-75"
            >
              {isLoading ? (
                <span>Authenticating with LeanBloom...</span>
              ) : (
                <>
                  <span>
                    Sign In to {portalMode === 'affiliate' ? 'Affiliate Portal' : 'Master Admin'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Sign Up */}
          <div className="mt-5 pt-4 border-t border-[#E5E7EB] text-center">
            <p className="text-xs text-[#667085]">
              Want to launch your own white-label telehealth clinic?{' '}
              <button
                type="button"
                onClick={onGoToSignUp}
                className="font-bold text-[#174A87] hover:underline ml-1 inline-flex items-center gap-0.5"
              >
                Register as an Affiliate
              </button>
            </p>
          </div>
        </div>

        {/* Security badges */}
        <div className="mt-5 text-center text-[11px] text-[#667085] flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4A9B52]" />
            SOC-2 Type II Certified
          </span>
          <span>•</span>
          <span>Multi-Tenant Isolated</span>
          <span>•</span>
          <span>HIPAA BAA Protected</span>
        </div>
      </div>
    </div>
  );
};
