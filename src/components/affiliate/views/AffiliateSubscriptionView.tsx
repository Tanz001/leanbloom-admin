import React, { useEffect, useRef, useState } from 'react';
import { CreditCard, ShieldCheck, RefreshCw, Ban } from 'lucide-react';
import {
  affiliateApi,
  type AffiliateSubscriptionRow,
} from '../../../lib/api';
import { useToast } from '../../ui/Toast';
import { PageHeader } from '../../common/PageHeader';
import { ModalShell, modalBtnSecondary } from '../../modals/ModalShell';

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
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const onAccessGrantedRef = useRef(onAccessGranted);
  const captureStartedRef = useRef(false);

  useEffect(() => {
    onAccessGrantedRef.current = onAccessGranted;
  }, [onAccessGranted]);

  // Load once on mount — do not call onAccessGranted here (avoids re-render loops)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await affiliateApi.getSubscription();
        if (cancelled) return;
        setSub(res.subscription);
        setMock(Boolean(res.paypal?.mock));
      } catch (err) {
        if (!cancelled) {
          toast.error(
            err instanceof Error ? err.message : 'Failed to load subscription'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only fetch
  }, []);

  useEffect(() => {
    // PayPal return: #/subscription/complete?token=ORDER_ID
    const hash = window.location.hash || '';
    if (!hash.includes('subscription/complete')) return;
    const q = hash.split('?')[1] || '';
    const params = new URLSearchParams(q);
    const token = params.get('token');
    if (!token || captureStartedRef.current) return;
    captureStartedRef.current = true;

    let cancelled = false;
    (async () => {
      setPaying(true);
      try {
        const res = await affiliateApi.captureSubscription(token);
        if (cancelled) return;
        setSub(res.subscription);
        toast.success('Payment received — subscription active');
        onAccessGrantedRef.current?.();
        window.location.hash = '#/subscription';
      } catch (err) {
        captureStartedRef.current = false;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when returning from PayPal
  }, []);

  const payNow = async () => {
    setPaying(true);
    try {
      const order = await affiliateApi.createSubscriptionOrder();
      if (order.mock) {
        const res = await affiliateApi.captureSubscription(order.orderId);
        setSub(res.subscription);
        toast.success('Mock payment complete — subscription active');
        onAccessGrantedRef.current?.();
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

  const confirmCancel = async () => {
    setCancelling(true);
    try {
      const res = await affiliateApi.cancelSubscription();
      setSub(res.subscription);
      setCancelOpen(false);
      toast.success('Subscription cancelled');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Cancel failed');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 max-w-2xl mx-auto">
      <PageHeader
        title="Subscription"
        description={
          sub?.billing?.kind === 'monthly'
            ? 'Renew one month at the full plan price. The 10% discount applied only to the first payment.'
            : 'Your first payment is 3 months upfront with 10% off. After that, renew one month at a time.'
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
                {sub?.billing?.kind === 'initial' ? (
                  <p className="mt-2 flex items-baseline gap-2 tabular-nums">
                    <span className="text-sm text-[#98A2B3] line-through">
                      ${Number(sub.billing.listAmount).toFixed(2)}
                    </span>
                    <span className="text-lg font-semibold text-[#0B2440]">
                      ${Number(sub.billing.amountDue).toFixed(2)}
                    </span>
                    <span className="text-xs font-medium text-[#5B6B7C]">
                      10% off · 3 months
                    </span>
                  </p>
                ) : sub?.billing ? (
                  <p className="text-sm font-semibold text-[#0B2440] mt-2 tabular-nums">
                    Next charge ${Number(sub.billing.amountDue).toFixed(2)}
                    <span className="font-medium text-[#5B6B7C]"> · 1 month</span>
                  </p>
                ) : null}
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
            <p className="text-xs font-semibold text-[#B54708]">
              Payments are non-refundable.
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
                  {paying
                    ? 'Processing…'
                    : sub?.billing?.kind === 'initial'
                      ? `Pay $${Number(sub.billing.amountDue).toFixed(2)} for 3 months`
                      : sub?.billing
                        ? `Pay $${Number(sub.billing.amountDue).toFixed(2)} for 1 month`
                        : 'Pay with PayPal'}
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
                  {sub?.billing
                    ? `Add 1 month · $${Number(sub.billing.amountDue).toFixed(2)}`
                    : 'Renew early'}
                </button>
              )}
              {sub?.hasAccess &&
                sub.status !== 'cancelled' &&
                !sub.cancelledAt && (
                <button
                  type="button"
                  onClick={() => setCancelOpen(true)}
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

      <ModalShell
        isOpen={cancelOpen}
        onClose={() => {
          if (!cancelling) setCancelOpen(false);
        }}
        title="Cancel subscription?"
        description="You keep access until the current period ends. After that, the portal locks until you renew."
        icon={<Ban className="w-5 h-5" />}
        headerTone="warning"
        maxWidth="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setCancelOpen(false)}
              disabled={cancelling}
              className={modalBtnSecondary}
            >
              Keep subscription
            </button>
            <button
              type="button"
              onClick={confirmCancel}
              disabled={cancelling}
              className="px-4 py-2.5 text-sm font-semibold text-white bg-[#B42318] hover:bg-[#912018] rounded-xl disabled:opacity-60"
            >
              {cancelling ? 'Cancelling…' : 'Yes, cancel'}
            </button>
          </>
        }
      >
        <div className="px-6 py-5">
          <p className="text-sm text-[#5B6B7C]">
            Access through{' '}
            <span className="font-semibold text-[#12345F]">
              {formatDate(sub?.endsAt)}
            </span>
            . No further monthly charges are started from here.
          </p>
        </div>
      </ModalShell>
    </div>
  );
};
