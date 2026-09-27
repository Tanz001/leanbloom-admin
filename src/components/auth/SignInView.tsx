import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { LeanBloomLogo } from '../brand/LeanBloomLogo';
import {
  authApi,
  mapApiUserToAppRole,
  saveAuthSession,
  type AppUser,
} from '../../lib/api';

interface SignInViewProps {
  onSignInSuccess: (userData: AppUser, token?: string) => void;
  onGoToSignUp: () => void;
}

export const SignInView: React.FC<SignInViewProps> = ({
  onSignInSuccess,
  onGoToSignUp,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await authApi.login(email.trim(), password);
      const user = mapApiUserToAppRole(result.user);
      saveAuthSession(result.token, user);
      if (!rememberMe) {
        sessionStorage.setItem('leanbloom_session_only', '1');
      } else {
        sessionStorage.removeItem('leanbloom_session_only');
      }
      onSignInSuccess(user, result.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex font-sans overflow-hidden">
      {/* Left brand panel — logo colors */}
      <div className="hidden lg:flex lg:w-[46%] relative flex-col justify-between p-12 text-white overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, #0B2440 0%, #12345F 38%, #2D82C4 72%, #4FAF4A 120%)',
          }}
        />
        <div
          className="absolute -right-16 top-24 w-72 h-72 rounded-full opacity-30 blur-3xl"
          style={{ background: '#5BA3D9' }}
        />
        <div
          className="absolute -left-10 bottom-20 w-64 h-64 rounded-full opacity-25 blur-3xl"
          style={{ background: '#4FAF4A' }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        <div className="relative z-10">
          <LeanBloomLogo size="lg" theme="dark" showSubtitle={false} />
        </div>

        <div className="relative z-10 max-w-md">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/55 mb-4 font-display">
            LeanBloom Health
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-white">
            <span className="text-white">Lean</span>
            <span className="text-[#A8D06A]">Bloom</span>
            <span className="block mt-2 text-white/90 text-3xl font-medium">
              Care that grows with every partner.
            </span>
          </h1>
          <p className="mt-5 text-base text-white/70 leading-relaxed">
            Sign in to manage affiliates, storefronts, and the LeanBloom network —
            all in one place.
          </p>
          <div className="mt-8 flex gap-2">
            <span className="h-1.5 w-8 rounded-full bg-[#2D82C4]" />
            <span className="h-1.5 w-8 rounded-full bg-[#4FAF4A]" />
            <span className="h-1.5 w-4 rounded-full bg-white/40" />
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-white/55">
          <ShieldCheck className="w-4 h-4 text-[#A8D06A]" />
          <span>Encrypted sessions · HIPAA-aware access</span>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 bg-white relative">
        <div className="absolute -top-32 -right-24 w-72 h-72 rounded-full bg-[#2D82C4]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -left-20 w-64 h-64 rounded-full bg-[#4FAF4A]/12 blur-3xl pointer-events-none" />

        <div className="w-full max-w-[400px] mx-auto relative z-10">
          <div className="lg:hidden mb-8 flex justify-center">
            <LeanBloomLogo size="lg" showSubtitle={false} />
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1.5 w-7 rounded-full bg-lb-gradient" />
              <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#2D82C4]">
                Welcome
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-[1.85rem] font-semibold tracking-tight text-[#12345F]">
              Sign in to continue
            </h2>
            <p className="mt-2 text-sm text-[#5B6B7C]">
              Enter your credentials to access LeanBloom.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#12345F] mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#98A2B3]">
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
                  placeholder="you@clinic.com"
                  className="block w-full pl-10 pr-3.5 py-3 text-sm border border-[#DCE3EC] rounded-xl bg-white text-[#0F1C2E] placeholder-[#98A2B3] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2D82C4]/30 focus:border-[#2D82C4] transition-shadow"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#12345F]"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#2D82C4] hover:text-[#12345F]"
                  onClick={() =>
                    setError('Password reset will be available soon.')
                  }
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#98A2B3]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-10 pr-11 py-3 text-sm border border-[#DCE3EC] rounded-xl bg-white text-[#0F1C2E] placeholder-[#98A2B3] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2D82C4]/30 focus:border-[#2D82C4] transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#98A2B3] hover:text-[#12345F]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#4FAF4A] focus:ring-[#4FAF4A]"
              />
              <span className="text-sm text-[#5B6B7C]">Keep me signed in</span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-lb-gradient hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D82C4] shadow-sm transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>Signing in…</span>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#5B6B7C]">
            New affiliate partner?{' '}
            <button
              type="button"
              onClick={onGoToSignUp}
              className="font-bold text-[#2D82C4] hover:text-[#12345F]"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
