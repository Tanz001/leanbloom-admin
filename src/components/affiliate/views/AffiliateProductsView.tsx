import React, { useState } from 'react';
import {
  Package,
  AlertCircle,
  ImagePlus,
  RefreshCw,
  ShieldCheck,
  Copy,
  Check,
  Link2,
  ExternalLink,
} from 'lucide-react';
import { AffiliatePortalProduct, mediaUrl } from '../../../lib/api';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';
import { useToast } from '../../ui/Toast';

interface AffiliateProductsViewProps {
  products: AffiliatePortalProduct[];
  defaultMarkup: number;
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

export const AffiliateProductsView: React.FC<AffiliateProductsViewProps> = ({
  products,
  storefrontBaseUrl = '',
  onRefresh,
}) => {
  const toast = useToast();
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const copyLink = async (productId: string, productName: string) => {
    if (!storefrontBaseUrl) {
      toast.error('Storefront link is not configured for your clinic yet');
      return;
    }
    const link = buildProductShareLink(storefrontBaseUrl, productId);
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(productId);
      toast.success(`Link copied for “${productName}”`);
      window.setTimeout(() => setCopiedId((id) => (id === productId ? null : id)), 2000);
    } catch {
      toast.error('Could not copy link — select and copy it manually');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Products"
        description="Shared LeanBloom catalog. Copy your product link to send to customers."
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

      <div className="p-4 bg-[#EAF4FB] border border-[#BFDBFE] rounded-xl flex items-start gap-3 text-sm text-[#1E3A5F]">
        <Link2 className="w-5 h-5 flex-shrink-0 text-[#2D82C4] mt-0.5" />
        <div>
          <p className="font-semibold text-[#12345F]">Your product links</p>
          <p className="mt-0.5 text-xs leading-relaxed text-[#334155]">
            Each product has a unique link for your storefront. Send it to
            customers — they land on that product on{' '}
            <strong className="font-semibold">your</strong> clinic site. Prices
            are set by LeanBloom admin.
          </p>
          {storefrontBaseUrl && (
            <p className="mt-1.5 text-[11px] font-mono text-[#475569] truncate">
              Storefront: {storefrontBaseUrl.replace(/\/+$/, '')}
            </p>
          )}
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
                <th className="py-3 px-4 text-right">Base price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 min-w-[16rem]">Share link</th>
                <th className="py-3 px-4 text-center">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7] text-sm text-[#344054]">
              {products.map((p) => {
                const shareLink = storefrontBaseUrl
                  ? buildProductShareLink(storefrontBaseUrl, p.id)
                  : '';
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
                          Storefront URL unavailable
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => copyLink(p.id, p.name)}
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
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#667085]">
                    <ImagePlus className="w-8 h-8 mx-auto mb-2 text-[#98A2B3]" />
                    <p className="font-semibold text-[#12345F]">
                      No active products yet
                    </p>
                    <p className="text-xs mt-1 max-w-sm mx-auto">
                      When master admin adds products and sets status to{' '}
                      <strong>Active</strong>, they appear here with shareable
                      links for your customers.
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
