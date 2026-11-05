import React, { useEffect, useState } from 'react';
import {
  Building2,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { LeanBloomLogo } from '../brand/LeanBloomLogo';
import {
  authApi,
  mapApiUserToAppRole,
  plansApi,
  saveAuthSession,
  type AppUser,
  type SubscriptionPlan,
} from '../../lib/api';

interface SignUpViewProps {
  onSignUpSuccess: (userData: AppUser, token?: string) => void;
  onGoToSignIn: () => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({
  onSignUpSuccess,
  onGoToSignIn,
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [formData, setFormData] = useState({
    clinicName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    planId: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let preferredPlanId = params.get('planId') || '';
    const hash = window.location.hash || '';
    const qIndex = hash.indexOf('?');
    if (!preferredPlanId && qIndex >= 0) {
      preferredPlanId =
        new URLSearchParams(hash.slice(qIndex + 1)).get('planId') || '';
    }

    plansApi
      .listPublic()
      .then(({ plans: rows }) => {
        setPlans(rows);
        const match = rows.find((p) => p.id === preferredPlanId);
        const nextId = match?.id || rows[0]?.id || '';
        if (nextId) {
          setFormData((prev) => ({ ...prev, planId: nextId }));
        }
      })
      .catch(() => setPlans([]));
  }, []);

  const selectedPlan = plans.find((p) => p.id === formData.planId) || plans[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!agreed) {
      setError('Please accept the partner terms to continue');
      return;
    }
    if (!selectedPlan) {
      setError('No subscription plan is available yet. Contact LeanBloom.');
      return;
    }
    setIsLoading(true);
    try {
      await authApi.requestSignupOtp({
        clinicName: formData.clinicName.trim(),
        ownerName: formData.ownerName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        password: formData.password,
        planId: selectedPlan.id,
      });
      setStep('otp');
      setOtp('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await authApi.verifySignupOtp(formData.email.trim(), otp.trim());
      const user = mapApiUserToAppRole(result.user);
      saveAuthSession(result.token, user);
      onSignUpSuccess(user, result.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#174A87]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#4A9B52]/10 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="flex flex-col items-center text-center mb-6">
          <LeanBloomLogo size="lg" showSubtitle={false} className="mb-2" />
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0B2440] font-display">
            Partner signup
          </h2>
          <p className="mt-1 text-sm text-[#5B6B7C]">
            {step === 'otp'
              ? `Enter the 6-digit code sent to ${formData.email.trim()}.`
              : 'We email a code to confirm your address, then you pay 3 months upfront (10% off).'}
          </p>
        </div>

        {step === 'otp' ? (
          <form
            onSubmit={handleVerify}
            className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-4"
          >
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-[#12345F] mb-1">
                Verification code
              </label>
              <input
                required
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-3 py-3 text-center tracking-[0.4em] text-lg font-semibold border border-[#DCE3EC] rounded-xl"
                placeholder="000000"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full py-3 text-sm font-semibold text-white bg-lb-gradient rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? 'Verifying…' : 'Verify and create account'}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('details');
                setError(null);
              }}
              className="w-full text-xs font-semibold text-[#2D82C4]"
            >
              Edit details
            </button>
          </form>
        ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-4"
        >
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          {plans.length > 1 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#12345F]">Choose a plan</p>
              <div className="grid gap-2">
                {plans.map((plan) => {
                  const active = formData.planId === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, planId: plan.id }))
                      }
                      className={`text-left p-3 rounded-xl border transition-colors ${
                        active
                          ? 'border-[#2D82C4] bg-[#EAF4FB] ring-1 ring-[#2D82C4]/30'
                          : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-[#0B2440]">
                          {plan.name}
                        </span>
                        <span className="flex items-baseline gap-1.5 tabular-nums">
                          <span className="text-xs text-[#98A2B3] line-through">
                            ${(plan.price * 3).toFixed(2)}
                          </span>
                          <span className="text-sm font-semibold text-[#0B2440]">
                            ${(plan.price * 3 * 0.9).toFixed(2)}
                          </span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedPlan && (
            <div className="p-4 rounded-xl border border-[#C9DFF0] bg-[#EAF4FB]">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#2D82C4]">
                Plan
              </p>
              <p className="text-base font-semibold text-[#0B2440] font-display mt-0.5">
                {selectedPlan.name}
              </p>
              <p className="text-sm text-[#5B6B7C] mt-1">
                {selectedPlan.description || 'Monthly partner access'}
              </p>
              <p className="mt-3 flex items-baseline gap-2 tabular-nums">
                <span className="text-lg text-[#98A2B3] line-through">
                  ${(selectedPlan.price * 3).toFixed(2)}
                </span>
                <span className="text-2xl font-semibold text-[#0B2440]">
                  ${(selectedPlan.price * 3 * 0.9).toFixed(2)}
                </span>
              </p>
              <p className="mt-1 text-sm text-[#5B6B7C]">
                ${selectedPlan.price.toFixed(2)} / month · 3 months, 10% off
              </p>
              <p className="mt-2 text-[11px] text-[#5B6B7C] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3A8F36]" />
                First payment covers 3 months. After that, renew one month at a time. No auto-charge.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#12345F] mb-1">
              Clinic name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]" />
              <input
                required
                value={formData.clinicName}
                onChange={(e) =>
                  setFormData({ ...formData, clinicName: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-[#DCE3EC] rounded-xl"
                placeholder="Your clinic name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#12345F] mb-1">
              Your name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]" />
              <input
                required
                value={formData.ownerName}
                onChange={(e) =>
                  setFormData({ ...formData, ownerName: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-[#DCE3EC] rounded-xl"
                placeholder="Full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#12345F] mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-[#DCE3EC] rounded-xl"
                placeholder="you@clinic.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#12345F] mb-1">
              Phone (optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]" />
              <input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-[#DCE3EC] rounded-xl"
                placeholder="+1 …"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#12345F] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]" />
              <input
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-[#DCE3EC] rounded-xl"
                placeholder="Minimum 8 characters"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs text-[#5B6B7C]">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5"
            />
            I agree to the partner terms. The first payment is 3 months upfront with 10% off, then one month at a time via PayPal.
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-sm font-semibold text-white bg-lb-gradient rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? 'Sending code…' : 'Email me a verification code'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-xs text-[#6B7C8F]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onGoToSignIn}
              className="font-semibold text-[#2D82C4] hover:text-[#12345F]"
            >
              Sign in
            </button>
          </p>
        </form>
        )}
      </div>
    </div>
  );
};
