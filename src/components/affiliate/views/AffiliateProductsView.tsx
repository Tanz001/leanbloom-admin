import React, { useState } from 'react';
import {
  Package,
  DollarSign,
  Check,
  AlertCircle,
  ImagePlus,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { AffiliatePortalProduct, mediaUrl } from '../../../lib/api';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

interface AffiliateProductsViewProps {
  products: AffiliatePortalProduct[];
  defaultMarkup: number;
  onSetPrice: (productId: string, sellingPrice: number) => Promise<void>;
  onRefresh?: () => Promise<void>;
}

export const AffiliateProductsView: React.FC<AffiliateProductsViewProps> = ({
  products,
  defaultMarkup,
  onSetPrice,
  onRefresh,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const startEdit = (p: AffiliatePortalProduct) => {
    const suggested =
      p.sellingPrice ??
      Math.ceil(p.minimumPrice * (1 + defaultMarkup / 100) * 100) / 100;
    setEditingId(p.id);
    setPriceDraft(String(suggested));
    setError('');
  };

  const save = async (p: AffiliatePortalProduct) => {
    const value = Number(priceDraft);
    if (Number.isNaN(value) || value < p.minimumPrice) {
      setError(`Price must be at least $${p.minimumPrice.toFixed(2)}`);
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSetPrice(p.id, value);
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save price');
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    setError('');
    try {
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  };

  const pricedCount = products.filter((p) => p.sellingPrice != null).length;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Products"
        description="Shared LeanBloom catalog. Set your clinic selling price for each product."
        actions={
          onRefresh ? (
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3.5 py-2 text-xs font-semibold text-[#12345F] bg-white border border-[#E4EAF0] hover:bg-[#F7F9FC] rounded-xl inline-flex items-center gap-1.5 disabled:opacity-70"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </button>
          ) : undefined
        }
      />

      <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex items-start gap-3 text-sm text-[#166534]">
        <ShieldCheck className="w-5 h-5 flex-shrink-0 text-[#2E9B4B] mt-0.5" />
        <div>
          <p className="font-semibold text-[#14532D]">
            How selling prices work
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-[#166534]">
            Master admin publishes products. You set the patient-facing price —
            it cannot go below the minimum floor. Suggested markup:{' '}
            <strong>{defaultMarkup}%</strong> above floor.
            {products.length > 0 && (
              <>
                {' '}
                · {pricedCount}/{products.length} priced
              </>
            )}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-[#FEF3F2] border border-[#FECDCA] rounded-xl text-sm text-[#B42318] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E4E7EC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4E7EC] text-[11px] font-bold text-[#667085] uppercase tracking-wider bg-[#F8F9FC]">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Wholesale</th>
                <th className="py-3 px-4 text-right">Min floor</th>
                <th className="py-3 px-4 text-right">Your selling price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7] text-sm text-[#344054]">
              {products.map((p) => {
                const margin =
                  p.sellingPrice != null
                    ? p.sellingPrice - p.minimumPrice
                    : null;
                return (
                  <tr key={p.id} className="hover:bg-[#F8F9FC]">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                          <img
                            src={mediaUrl(p.imageUrl) || undefined}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-[#E4E7EC]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#EAF4FB] text-[#173B72] flex items-center justify-center">
                            <Package className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-[#12345F]">{p.name}</p>
                          <p className="text-xs text-[#7A8796] line-clamp-1 max-w-xs">
                            {p.description || '—'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">{p.category}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#667085]">
                      ${p.basePrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#D64545]">
                      ${p.minimumPrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {editingId === p.id ? (
                        <div className="inline-flex flex-col items-end gap-1">
                          <div className="inline-flex items-center gap-1">
                            <span className="text-[#7A8796]">$</span>
                            <input
                              type="number"
                              min={p.minimumPrice}
                              step="0.01"
                              value={priceDraft}
                              onChange={(e) => setPriceDraft(e.target.value)}
                              className="w-28 px-2.5 py-1.5 text-sm border border-[#2D82C4] ring-2 ring-[#2D82C4]/20 rounded-lg font-mono"
                              autoFocus
                            />
                          </div>
                          <span className="text-[10px] text-[#7A8796]">
                            Min ${p.minimumPrice.toFixed(2)}
                          </span>
                        </div>
                      ) : p.sellingPrice != null ? (
                        <div>
                          <span className="font-mono font-bold text-[#12345F]">
                            ${p.sellingPrice.toFixed(2)}
                          </span>
                          {margin != null && margin >= 0 && (
                            <p className="text-[10px] text-[#2E9B4B] font-medium">
                              +${margin.toFixed(2)} above floor
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-[#D99A18] bg-[#FEF7EC] px-2 py-0.5 rounded-full">
                          Not priced
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.stockStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {editingId === p.id ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => save(p)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#12345F] rounded-lg inline-flex items-center gap-1 disabled:opacity-70"
                          >
                            <Check className="w-3.5 h-3.5" />
                            {saving ? 'Saving…' : 'Save'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1.5 text-xs font-medium text-[#667085] border border-[#E4EAF0] rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-[#173B72] bg-[#EAF4FB] hover:bg-[#d8ecf9] rounded-lg inline-flex items-center gap-1"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          {p.sellingPrice != null ? 'Edit price' : 'Set price'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#667085]">
                    <ImagePlus className="w-8 h-8 mx-auto mb-2 text-[#98A2B3]" />
                    <p className="font-semibold text-[#12345F]">
                      No active products yet
                    </p>
                    <p className="text-xs mt-1 max-w-sm mx-auto">
                      When master admin adds products and sets status to{' '}
                      <strong>Active</strong>, they appear here for you to
                      price and sell.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
