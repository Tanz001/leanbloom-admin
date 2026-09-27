import React, { useState } from 'react';
import { DollarSign, AlertTriangle, Check, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';
import {
  ModalShell,
  modalBtnAccent,
  modalBtnPrimary,
  modalBtnSecondary,
  modalHintClass,
  modalInputClass,
  modalLabelClass,
} from './ModalShell';

interface EditPricingModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (
    productId: string,
    newBasePrice: number,
    newMinimumPrice: number
  ) => void;
}

export const EditPricingModal: React.FC<EditPricingModalProps> = ({
  isOpen,
  product,
  onClose,
  onSave,
}) => {
  if (!isOpen || !product) return null;

  const [basePrice, setBasePrice] = useState<number>(product.basePrice);
  const [minPrice, setMinPrice] = useState<number>(product.minimumPrice);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleValidation = () => {
    if (minPrice < basePrice) {
      setValidationError(
        `Minimum ($${minPrice}) cannot be lower than base ($${basePrice}).`
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
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Edit pricing"
      description={product.name}
      icon={<DollarSign className="w-5 h-5" />}
      maxWidth="lg"
    >
      {!showConfirm ? (
        <div className="p-6 space-y-5">
          <div className="p-3.5 bg-[#F0FDF4] border border-[#BBF7D0]/80 rounded-xl text-sm text-[#166534] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#4FAF4A]" />
            <p className="leading-relaxed">
              Updates apply to all affiliates selling this product. Retail cannot
              go below the minimum floor.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={modalLabelClass}>Base price ($)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7A8796]">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className={`${modalInputClass} pl-8`}
                />
              </div>
              <p className={modalHintClass}>Wholesale cost</p>
            </div>
            <div>
              <label className={modalLabelClass}>Minimum price ($)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7A8796]">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className={`${modalInputClass} pl-8`}
                />
              </div>
              <p className={modalHintClass}>Affiliate retail floor</p>
            </div>
          </div>

          {validationError && (
            <div className="p-3 bg-[#FEF3F2] border border-[#FECDCA] rounded-xl text-sm text-[#B42318] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {validationError}
            </div>
          )}

          <div className="pt-2 border-t border-[#E4EAF0] flex items-center justify-end gap-2.5">
            <button type="button" onClick={onClose} className={modalBtnSecondary}>
              Cancel
            </button>
            <button
              type="button"
              onClick={handleValidation}
              className={modalBtnPrimary}
            >
              Review update
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFinalSubmit} className="p-6 space-y-5">
          <div className="p-4 bg-[#FFFAEB] border border-[#FEDF89]/80 rounded-xl text-sm text-[#92400E] flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#D99A18] mt-0.5" />
            <div className="leading-relaxed space-y-1.5">
              <p className="font-display font-semibold text-[#78350F]">
                Confirm price change
              </p>
              <p>
                Base <strong>${basePrice}</strong> · Minimum{' '}
                <strong>${minPrice}</strong> for {product.name}.
              </p>
              <p className="text-[#A16207]">
                Affiliate prices below ${minPrice} will be raised to the new
                floor.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className={modalBtnSecondary}
            >
              Back
            </button>
            <button type="submit" className={modalBtnAccent}>
              <Check className="w-4 h-4" />
              Confirm
            </button>
          </div>
        </form>
      )}
    </ModalShell>
  );
};
