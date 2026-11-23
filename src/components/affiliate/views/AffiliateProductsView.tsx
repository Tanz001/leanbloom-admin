import React, { useMemo, useState } from 'react';
import {
  Package,
  AlertCircle,
  ImagePlus,
  RefreshCw,
  Copy,
  Check,
  Link2,
  ExternalLink,
} from 'lucide-react';
import { AffiliatePortalProduct, mediaUrl } from '../../../lib/api';
import {
  MYDOSE_GENERAL_SERVICES_URL,
  serviceCategoryOf,
} from '../../../lib/serviceCategory';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';
import { useToast } from '../../ui/Toast';

interface AffiliateProductsViewProps {
  products: AffiliatePortalProduct[];
  /** @deprecated unused — storefront uses admin base price */
  defaultMarkup?: number;
  /** Affiliate storefront origin, e.g. https://slug.leanbloom.com */
  storefrontBaseUrl?: string;
  /** @deprecated Affiliate price editing disabled — admin base price is used */
  onSetPrice?: (productId: string, sellingPrice: number) => Promise<void>;
  onRefresh?: () => Promise<void>;
}

function buildProductShareLink(baseUrl: string, productId: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, '');
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    url.searchParams.set('product', productId);
    return url.toString();
  } catch {
    return `${withProtocol}?product=${encodeURIComponent(productId)}`;
  }
}

function serviceCopyLink(
  product: AffiliatePortalProduct,
  storefrontBaseUrl: string
): string {
  if (product.buyUrl?.trim()) return product.buyUrl.trim();
  if (storefrontBaseUrl) {
    return buildProductShareLink(storefrontBaseUrl, product.id);
  }
  return '';
}

export const AffiliateProductsView: React.FC<AffiliateProductsViewProps> = ({
  products,
  storefrontBaseUrl = '',
  onRefresh,
}) => {
  const toast = useToast();
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedGeneral, setCopiedGeneral] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) set.add(serviceCategoryOf(p));
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filtered = useMemo(() => {
    if (categoryFilter === 'All') return products;
    return products.filter((p) => serviceCategoryOf(p) === categoryFilter);
  }, [products, categoryFilter]);

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

  const copyText = async (text: string, label: string, id: string | 'general') => {
    if (!text) {
      toast.error('No link available for this service');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      if (id === 'general') {
        setCopiedGeneral(true);
        window.setTimeout(() => setCopiedGeneral(false), 2000);
      } else {
        setCopiedId(id);
        window.setTimeout(
          () => setCopiedId((cur) => (cur === id ? null : cur)),
          2000
        );
      }
      toast.success(`Link copied for “${label}”`);
    } catch {
      toast.error('Could not copy link — select and copy it manually');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Services"
        description="MyDose care services by category. Copy a service link or the general catalog link for customers."
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

      <div className="p-4 bg-[#EAF4FB] border border-[#BFDBFE] rounded-xl flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-[#1E3A5F]">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Link2 className="w-5 h-5 flex-shrink-0 text-[#2D82C4] mt-0.5" />
          <div className="min-w-0">
            <p className="font-semibold text-[#12345F]">General services link</p>
            <p className="mt-0.5 text-xs leading-relaxed text-[#334155]">
              Share this LeanBloom MyDose catalog with customers for all
              services.
            </p>
            <p className="mt-1.5 text-[11px] font-mono text-[#475569] truncate">
              {MYDOSE_GENERAL_SERVICES_URL}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={MYDOSE_GENERAL_SERVICES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 text-xs font-semibold text-[#2D82C4] hover:bg-white rounded-lg inline-flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open
          </a>
          <button
            type="button"
            onClick={() =>
              copyText(MYDOSE_GENERAL_SERVICES_URL, 'General services', 'general')
            }
            className="px-2.5 py-1.5 text-xs font-semibold text-[#173B72] bg-white border border-[#BFDBFE] hover:bg-[#F7F9FC] rounded-lg inline-flex items-center gap-1"
          >
            {copiedGeneral ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#2E9B4B]" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy link
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
              categoryFilter === cat
                ? 'bg-[#174A87] text-white border-[#174A87]'
                : 'bg-white text-[#5B6B7C] border-[#E4E7EC] hover:border-[#174A87]/40 hover:text-[#174A87]'
            }`}
          >
            {cat}
          </button>
        ))}
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
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 min-w-[16rem]">Copy link</th>
                <th className="py-3 px-4 text-center">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7] text-sm text-[#344054]">
              {filtered.map((p) => {
                const shareLink = serviceCopyLink(p, storefrontBaseUrl);
                const care = serviceCategoryOf(p);
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
                            {p.medication || '—'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-medium bg-[#EAF4FB] text-[#174A87] px-2 py-0.5 rounded-full">
                        {care}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#5B6B7C]">
                      {p.duration || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#12345F]">
                      ${p.basePrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.stockStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      {shareLink ? (
                        <div className="flex items-center gap-2 max-w-md">
                          <input
                            readOnly
                            value={shareLink}
                            onFocus={(e) => e.currentTarget.select()}
                            className="flex-1 min-w-0 px-2.5 py-1.5 text-[11px] font-mono text-[#334155] bg-[#F8F9FC] border border-[#E4E7EC] rounded-lg"
                          />
                          <a
                            href={shareLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-[#2D82C4] hover:bg-[#EAF4FB]"
                            title="Open link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs text-[#98A2B3]">
                          No link saved
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => copyText(shareLink, p.name, p.id)}
                        disabled={!shareLink}
                        className="px-2.5 py-1.5 text-xs font-semibold text-[#173B72] bg-[#EAF4FB] hover:bg-[#d8ecf9] rounded-lg inline-flex items-center gap-1 disabled:opacity-50"
                      >
                        {copiedId === p.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#2E9B4B]" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#667085]">
                    <ImagePlus className="w-8 h-8 mx-auto mb-2 text-[#98A2B3]" />
                    <p className="font-semibold text-[#12345F]">
                      No active services yet
                    </p>
                    <p className="text-xs mt-1 max-w-sm mx-auto">
                      When master admin adds services and sets status to{' '}
                      <strong>Active</strong>, they appear here with copyable
                      MyDose links.
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
