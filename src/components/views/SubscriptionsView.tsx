import React, { useCallback, useEffect, useState } from 'react';
import { PageHeader } from '../common/PageHeader';
import { adminApi, type AffiliateSubscriptionRow } from '../../lib/api';
import { useToast } from '../ui/Toast';
import { StatusBadge } from '../common/StatusBadge';

function formatDate(iso: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

export const SubscriptionsView: React.FC = () => {
  const toast = useToast();
  const [rows, setRows] = useState<AffiliateSubscriptionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { subscriptions } = await adminApi.listSubscriptions();
      setRows(subscriptions);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to load subscriptions'
      );
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const statusLabel = (s: AffiliateSubscriptionRow['status']) => {
    if (s === 'pending_payment') return 'Pending payment';
    if (s === 'active') return 'Active';
    if (s === 'expired') return 'Expired';
    return 'Cancelled';
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Subscriptions"
        description="Which affiliate bought which plan, and current payment status."
      />

      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
        {loading ? (
          <p className="p-8 text-sm text-[#6B7C8F]">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-sm text-[#6B7C8F]">
            No subscriptions yet. Affiliates appear here after signup.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13.5px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-[#8A96A6] border-b border-[#EEF2F6] bg-[#FAFBFC]">
                  <th className="px-5 py-3 font-semibold">Affiliate</th>
                  <th className="px-5 py-3 font-semibold">Plan</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Starts</th>
                  <th className="px-5 py-3 font-semibold">Ends</th>
                  <th className="px-5 py-3 font-semibold">Last paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F3F7]">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#0B2440]">
                        {r.affiliateName || r.affiliateId}
                      </p>
                      <p className="text-[12px] text-[#6B7C8F]">
                        {r.contactEmail || '—'}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-[#0F1C2E]">{r.planName}</td>
                    <td className="px-5 py-4 font-semibold tabular-nums">
                      ${r.planPrice.toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge
                        status={
                          r.status === 'pending_payment'
                            ? 'Pending'
                            : r.status === 'active'
                              ? 'Active'
                              : r.status === 'expired'
                                ? 'Inactive'
                                : 'Cancelled'
                        }
                        size="sm"
                      />
                      <span className="sr-only">{statusLabel(r.status)}</span>
                    </td>
                    <td className="px-5 py-4 text-[#5B6B7C]">
                      {formatDate(r.startsAt)}
                    </td>
                    <td className="px-5 py-4 text-[#5B6B7C]">
                      {formatDate(r.endsAt)}
                    </td>
                    <td className="px-5 py-4 text-[#5B6B7C]">
                      {formatDate(r.lastPaymentAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
