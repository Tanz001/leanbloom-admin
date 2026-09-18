import React, { useState } from 'react';
import {
  Package,
  DollarSign,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Edit2,
  CheckCircle,
  Building2,
  TrendingUp,
  Tag
} from 'lucide-react';
import { Product, AffiliatePriceRule, Affiliate } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface ProductsPricingViewProps {
  mode: 'products' | 'pricing';
  products: Product[];
  pricingRules: AffiliatePriceRule[];
  affiliates: Affiliate[];
  onOpenAddProduct: () => void;
  onOpenEditPricing: (product: Product) => void;
  onToggleProductStatus: (productId: string) => void;
}

export const ProductsPricingView: React.FC<ProductsPricingViewProps> = ({
  mode,
  products,
  pricingRules,
  affiliates,
  onOpenAddProduct,
  onOpenEditPricing,
  onToggleProductStatus
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'pricing'>(
    mode === 'pricing' ? 'pricing' : 'catalog'
  );

  return (
    <div className="space-y-6 pb-12" id="products-pricing-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-[#E4E7EC] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#172033] tracking-tight">
              {activeTab === 'catalog' ? 'Product Catalog Management' : 'Global Pricing Floor Rules'}
            </h2>
          </div>
          <p className="text-xs text-[#667085] mt-0.5">
            {activeTab === 'catalog'
              ? 'Wholesale telehealth compounds, consultations, and lab protocol definitions.'
              : 'Enforce non-negotiable minimum retail floors across all 128 white-label affiliates.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#F2F4F7] p-1 rounded-lg border border-[#E4E7EC]">
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'catalog'
                  ? 'bg-white text-[#173B72] shadow-xs font-bold'
                  : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              Wholesale Catalog
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pricing')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'pricing'
                  ? 'bg-white text-[#173B72] shadow-xs font-bold'
                  : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              Pricing Rules & Floors
            </button>
          </div>

          <button
            type="button"
            id="add-product-btn"
            onClick={onOpenAddProduct}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Mandatory Floor Rule Banner */}
      <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex items-start gap-3 text-xs text-[#166534]">
        <ShieldCheck className="w-5 h-5 flex-shrink-0 text-[#2E9B4B] mt-0.5" />
        <div>
          <strong className="text-sm font-bold text-[#14532D]">
            Strict Multi-Tenant Pricing Architecture Rule (Enforced)
          </strong>
          <p className="mt-0.5 text-xs leading-relaxed text-[#166534]">
            An affiliate storefront selling price can <strong>never fall below</strong> LeanBloom's wholesale base or minimum permitted price. Any affiliate markup is added on top of the wholesale cost. If Master Admin raises the minimum floor, all child tenants are automatically updated to prevent margin compression.
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: WHOLESALE PRODUCTS CATALOG
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-xl border border-[#E4E7EC] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4E7EC] text-[11px] font-bold text-[#667085] uppercase tracking-wider bg-[#F8F9FC]">
                  <th className="py-3 px-4">Product Formulation / Protocol</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Wholesale Base</th>
                  <th className="py-3 px-4 text-right">Minimum Allowed Price</th>
                  <th className="py-3 px-4 text-right">Active Affiliates</th>
                  <th className="py-3 px-4 text-right">Total Orders</th>
                  <th className="py-3 px-4">Fulfillment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F4F7] text-xs text-[#344054]">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#F8F9FC] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#172033]">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 bg-[#EAF4FB] text-[#173B72] rounded-lg mt-0.5">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-[#172033]">{prod.name}</p>
                          <p className="text-[11px] text-[#667085] line-clamp-1 max-w-sm">
                            {prod.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-medium bg-[#F2F4F7] text-[#344054] px-2 py-0.5 rounded-full">
                        {prod.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#172033]">
                      ${prod.basePrice}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#D64545]">
                      ${prod.minimumPrice}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold">
                      {prod.activeAffiliatesCount}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#2D82C4] font-semibold">
                      {prod.ordersCount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={prod.stockStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={prod.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenEditPricing(prod)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-[#173B72] bg-[#EAF4FB] hover:bg-[#d8ecf9] rounded-md transition-colors flex items-center gap-1"
                          title="Set Base & Minimum Floor Price"
                        >
                          <DollarSign className="w-3 h-3 text-[#2D82C4]" />
                          Price Floor
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleProductStatus(prod.id)}
                          className="p-1 text-[#667085] hover:text-[#D64545] hover:bg-[#FEE4E2] rounded transition-colors"
                          title={prod.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: DEDICATED PRICING MANAGEMENT (Prompt #17)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5">
            {pricingRules.map((rule) => {
              const matchedProduct = products.find((p) => p.id === rule.productId);
              return (
                <div
                  key={rule.productId}
                  className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs transition-all hover:border-[#D0D5DD]"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F2F4F7]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-[#EAF4FB] text-[#173B72] rounded-md">
                          <Tag className="w-4 h-4" />
                        </span>
                        <h3 className="text-base font-bold text-[#172033]">{rule.productName}</h3>
                      </div>
                      <p className="text-xs text-[#667085] mt-1">
                        Active in <strong className="text-[#172033]">{rule.activeAffiliates} Affiliates</strong> across nationwide clinical networks.
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[11px] text-[#667085] uppercase tracking-wider block">
                          LeanBloom Base Wholesale
                        </span>
                        <span className="font-mono text-base font-bold text-[#172033]">
                          ${rule.basePrice}
                        </span>
                      </div>

                      <div className="text-right pl-4 border-l border-[#E4E7EC]">
                        <span className="text-[11px] text-[#D64545] font-semibold uppercase tracking-wider block">
                          Minimum Permitted Floor
                        </span>
                        <span className="font-mono text-base font-bold text-[#D64545]">
                          ${rule.minimumPrice}
                        </span>
                      </div>

                      {matchedProduct && (
                        <button
                          type="button"
                          onClick={() => onOpenEditPricing(matchedProduct)}
                          className="ml-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Adjust Price Floor
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Affiliate Price Comparison Grid */}
                  <div className="mt-4">
                    <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block mb-2">
                      Active Child Tenant Selling Prices (Real-Time Enforcement):
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {rule.affiliatePriceExamples.map((ex) => {
                        const markupDollar = ex.sellingPrice - rule.basePrice;
                        const markupPct = Math.round((markupDollar / rule.basePrice) * 100);

                        return (
                          <div
                            key={ex.affiliateName}
                            className="p-3 bg-[#F8F9FC] rounded-lg border border-[#E4E7EC] flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-[#172033] truncate">
                                {ex.affiliateName}
                              </span>
                              <span className="text-[10px] font-bold text-[#2E9B4B] bg-[#EAF6E7] px-1.5 py-0.5 rounded">
                                +{markupPct}%
                              </span>
                            </div>

                            <div className="mt-2 flex items-baseline justify-between">
                              <span className="text-xs text-[#667085]">Selling Price:</span>
                              <span className="font-mono text-base font-bold text-[#173B72]">
                                ${ex.sellingPrice}
                              </span>
                            </div>

                            <div className="mt-1 pt-1.5 border-t border-gray-200 text-[10px] text-[#667085] flex justify-between">
                              <span>Floor Clearance:</span>
                              <span className="text-[#2E9B4B] font-semibold">
                                +${ex.sellingPrice - rule.minimumPrice} above min
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
