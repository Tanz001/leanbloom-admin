import React, { useCallback, useEffect, useState } from 'react';
import { CreditCard, ShieldCheck, RefreshCw, Ban } from 'lucide-react';
import {
  affiliateApi,
  type AffiliateSubscriptionRow,
} from '../../../lib/api';
import { useToast } from '../../ui/Toast';
import { PageHeader } from '../../common/PageHeader';

interface AffiliateSubscriptionViewProps {
  locked?: boolean;
  onAccessGranted?: () => void;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const AffiliateSubscriptionView: React.FC<
  AffiliateSubscriptionViewProps
> = ({ locked = false, onAccessGranted }) => {
  const toast = useToast();
  const [sub, setSub] = useState<AffiliateSubscriptionRow | null>(null);
  const [mock, setMock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await affiliateApi.getSubscription();
      setSub(res.subscription);
      setMock(Boolean(res.paypal?.mock));
      if (res.subscription?.hasAccess) onAccessGranted?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load subscription');
    } finally {
      setLoading(false);
    }
  }, [toast, onAccessGranted]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    // PayPal return: #/subscription/complete?token=ORDER_ID
    const hash = window.location.hash || '';
    if (!hash.includes('subscription/complete')) return;
    const q = hash.split('?')[1] || '';
    const params = new URLSearchParams(q);
    const token = params.get('token');
    if (!token) return;

    let cancelled = false;
    (async () => {
      setPaying(true);
      try {
        const res = await affiliateApi.captureSubscription(token);
        if (cancelled) return;
        setSub(res.subscription);
        toast.success('Payment received — subscription active');
        onAccessGranted?.();
        window.location.hash = '#/subscription';
      } catch (err) {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : 'Payment capture failed');
        }
      } finally {
        if (!cancelled) setPaying(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [toast, onAccessGranted]);

  const payNow = async () => {
    setPaying(true);
    try {
      const order = await affiliateApi.createSubscriptionOrder();
      if (order.mock) {
        const res = await affiliateApi.captureSubscription(order.orderId);
        setSub(res.subscription);
        toast.success('Mock payment complete — subscription active');
        onAccessGranted?.();
      } else if (order.approveUrl) {
        window.location.href = order.approveUrl;
      } else {
        toast.error('No PayPal approval URL returned');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not start payment');
    } finally {
      setPaying(false);
    }
  };

  const cancel = async () => {
    if (
      !window.confirm(
        'Cancel your subscription? You keep access until the current period ends, then the portal locks until you renew.'
      )
    ) {
      return;
    }
    try {
      const res = await affiliateApi.cancelSubscription();
      setSub(res.subscription);
      toast.success('Subscription cancelled');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Cancel failed');
    }
  };

  return (
    <div className="space-y-6 pb-10 max-w-2xl mx-auto">
      <PageHeader
        title="Subscription"
        description={
          locked
            ? 'Your portal is locked until you pay or renew your monthly plan.'
            : 'Manage your monthly LeanBloom partner plan.'
        }
      />

      {locked && (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-900">
          You can sign in, but only this page works until payment is complete.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-5">
        {loading ? (
          <p className="text-sm text-[#6B7C8F]">Loading…</p>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#2D82C4]">
                  Current plan
                </p>
                <h2 className="text-xl font-semibold text-[#0B2440] font-display mt-1">
                  {sub?.planName || 'Partner plan'}
                </h2>
                <p className="text-sm text-[#5B6B7C] mt-1">
                  ${Number(sub?.planPrice ?? 0).toFixed(2)} / month · PayPal
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                  sub?.hasAccess
                    ? 'bg-[#EAF6E7] text-[#2E9B4B]'
                    : 'bg-[#FEF6EE] text-[#B54708]'
                }`}
              >
                {sub?.hasAccess ? 'Active' : sub?.status?.replace('_', ' ') || 'Unpaid'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-[#F5F8FB] border border-[#E2E8F0]">
                <p className="text-[11px] text-[#8A96A6] font-semibold uppercase">
                  Renews / ends
                </p>
                <p className="font-semibold text-[#0B2440] mt-1">
                  {formatDate(sub?.endsAt)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F8FB] border border-[#E2E8F0]">
                <p className="text-[11px] text-[#8A96A6] font-semibold uppercase">
                  Last payment
                </p>
                <p className="font-semibold text-[#0B2440] mt-1">
                  {formatDate(sub?.lastPaymentAt)}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#5B6B7C] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3A8F36]" />
              Payments are handled securely through PayPal
              {mock ? ' (mock mode for local testing)' : ''}.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {!sub?.hasAccess && (
                <button
                  type="button"
                  onClick={payNow}
                  disabled={paying}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-xl disabled:opacity-60"
                >
                  <CreditCard className="w-4 h-4" />
                  {paying ? 'Processing…' : 'Pay with PayPal'}
                </button>
              )}
              {sub?.hasAccess && (
                <button
                  type="button"
                  onClick={payNow}
                  disabled={paying}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#0B2440] bg-white border border-[#E2E8F0] hover:bg-[#F5F8FB] rounded-xl disabled:opacity-60"
                >
                  <RefreshCw className="w-4 h-4" />
                  Renew early
                </button>
              )}
              {sub?.hasAccess && sub.status !== 'cancelled' && (
                <button
                  type="button"
                  onClick={cancel}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#B91C1C] hover:bg-red-50 rounded-xl"
                >
                  <Ban className="w-4 h-4" />
                  Cancel subscription
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
