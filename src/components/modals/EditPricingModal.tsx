import React, { useState } from 'react';
import { X, DollarSign, AlertTriangle, Check, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';

interface EditPricingModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (productId: string, newBasePrice: number, newMinimumPrice: number) => void;
}

export const EditPricingModal: React.FC<EditPricingModalProps> = ({
  isOpen,
  product,
  onClose,
  onSave
}) => {
  if (!isOpen || !product) return null;

  const [basePrice, setBasePrice] = useState<number>(product.basePrice);
  const [minPrice, setMinPrice] = useState<number>(product.minimumPrice);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  const handleValidation = () => {
    if (minPrice < basePrice) {
      setValidationError(
        `Minimum allowed retail price ($${minPrice}) cannot be lower than LeanBloom wholesale base cost ($${basePrice}).`
      );
      return;
    }
    setValidationError('');
    setShowConfirm(true);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(product.id, Number(basePrice), Number(minPrice));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-[#E4E7EC] shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F8F9FC]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#EAF4FB] text-[#173B72] rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Adjust Wholesale & Minimum Price</h3>
              <p className="text-xs text-[#667085] truncate max-w-xs">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#667085] hover:text-[#172033] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!showConfirm ? (
          <div className="p-5 space-y-4">
            <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg text-xs text-[#166534] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#2E9B4B]" />
              <div>
                <strong>Platform Price Integrity Rule:</strong>
                <p className="text-[11px] text-[#166534] mt-0.5">
                  Changes to the wholesale base price and minimum permitted price floor apply immediately across all {product.activeAffiliatesCount} active affiliates.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#344054] mb-1">
                  LeanBloom Base Wholesale ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#667085] font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-xs border border-[#D0D5DD] rounded-lg font-mono focus:ring-2 focus:ring-[#2D82C4]/30"
                  />
                </div>
                <span className="text-[11px] text-[#667085] block mt-1">
                  Wholesale cost paid to compounding pharmacy & lab.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#344054] mb-1">
                  Minimum Permitted Price Floor ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#667085] font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-xs border border-[#D0D5DD] rounded-lg font-mono focus:ring-2 focus:ring-[#2D82C4]/30"
                  />
                </div>
                <span className="text-[11px] text-[#667085] block mt-1">
                  Affiliates cannot sell below this amount.
                </span>
              </div>
            </div>

            {validationError && (
              <div className="p-2.5 bg-[#FEF3F2] border border-[#FECDCA] rounded-lg text-xs text-[#B42318] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {validationError}
              </div>
            )}

            <div className="pt-2 border-t border-[#E4E7EC] flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] rounded-lg hover:bg-[#F2F4F7]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleValidation}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-lg transition-colors shadow-xs"
              >
                Review Price Update
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFinalSubmit} className="p-5 space-y-4">
            <div className="p-3.5 bg-[#FFFAEB] border border-[#FEDF89] rounded-xl text-xs text-[#B54708] flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#D99A18] mt-0.5" />
              <div>
                <strong className="text-sm font-bold text-[#7A2E0E]">
                  Confirm Mandatory Price Modification
                </strong>
                <p className="mt-1 text-[11px] leading-relaxed">
                  You are about to set LeanBloom Base to <strong>${basePrice}</strong> and Minimum Allowed Price to <strong>${minPrice}</strong> for <strong>{product.name}</strong>.
                </p>
                <p className="mt-1 text-[11px] text-[#93370D]">
                  Any affiliate catalog item currently set below ${minPrice} will automatically be elevated to ${minPrice} to maintain price floor integrity.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] rounded-lg hover:bg-[#F2F4F7]"
              >
                Back to Edit
              </button>
              <button
                type="submit"
                id="confirm-price-change-btn"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#2E9B4B] hover:bg-[#237839] rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Confirm & Enforce Rule
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
