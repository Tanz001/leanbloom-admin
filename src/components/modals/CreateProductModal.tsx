import React, { useState } from 'react';
import { X, Package, Check, AlertCircle } from 'lucide-react';
import { Product } from '../../types';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (product: Omit<Product, 'id' | 'activeAffiliatesCount' | 'ordersCount'>) => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('Medical Program');
  const [basePrice, setBasePrice] = useState(199);
  const [minimumPrice, setMinimumPrice] = useState(249);
  const [description, setDescription] = useState('');
  const [stockStatus, setStockStatus] = useState<Product['stockStatus']>('In Stock');
  const [status, setStatus] = useState<Product['status']>('Active');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required');
      return;
    }
    if (minimumPrice < basePrice) {
      setError('Minimum allowed price cannot be less than wholesale base price');
      return;
    }

    onCreate({
      name,
      category,
      basePrice: Number(basePrice),
      minimumPrice: Number(minimumPrice),
      description,
      stockStatus,
      status
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-[#E4E7EC] shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F8F9FC]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#EAF4FB] text-[#173B72] rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Add Platform Wholesale Product</h3>
              <p className="text-xs text-[#667085]">Define pricing floors and clinical formulation specifications</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#667085] hover:text-[#172033] rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#344054] mb-1">
              Product / Program Protocol Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tirzepatide Metabolic Titration (4-Week)"
              className="w-full px-3 py-2 text-xs border border-[#D0D5DD] rounded-lg focus:ring-2 focus:ring-[#2D82C4]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#344054] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-[#D0D5DD] rounded-lg bg-white"
              >
                <option value="Medical Program">Medical Program</option>
                <option value="Telehealth Consult">Telehealth Consult</option>
                <option value="Prescription Refill">Prescription Refill</option>
                <option value="Wellness Pack">Wellness Pack</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#344054] mb-1">Fulfillment Status</label>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-[#D0D5DD] rounded-lg bg-white"
              >
                <option value="In Stock">In Stock (503A Ready)</option>
                <option value="Compounding">Compounding Queue</option>
                <option value="Backorder">Backorder</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#344054] mb-1">
                LeanBloom Base Cost ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#667085]">$</span>
                <input
                  type="number"
                  min="1"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-xs border border-[#D0D5DD] rounded-lg font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#344054] mb-1">
                Minimum Retail Floor ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#667085]">$</span>
                <input
                  type="number"
                  min="1"
                  value={minimumPrice}
                  onChange={(e) => setMinimumPrice(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-xs border border-[#D0D5DD] rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#344054] mb-1">
              Clinical Protocol Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Titration schedule, required lab biomarkers, doctor consultation notes..."
              className="w-full px-3 py-2 text-xs border border-[#D0D5DD] rounded-lg focus:ring-2 focus:ring-[#2D82C4]/30"
            />
          </div>

          {error && (
            <div className="p-2 bg-[#FEF3F2] border border-[#FECDCA] rounded-lg text-xs text-[#B42318] flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="pt-3 border-t border-[#E4E7EC] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] rounded-lg hover:bg-[#F2F4F7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#173B72] hover:bg-[#12345F] rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
