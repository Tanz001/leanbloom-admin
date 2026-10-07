import React, { useEffect, useState } from 'react';
import { Package, Check, AlertCircle, ImagePlus, X } from 'lucide-react';
import { Product } from '../../types';
import {
  ModalShell,
  ModalSelect,
  modalBtnAccent,
  modalBtnSecondary,
  modalHintClass,
  modalInputClass,
  modalLabelClass,
} from './ModalShell';

export type CreateProductInput = Omit<
  Product,
  'id' | 'activeAffiliatesCount' | 'ordersCount' | 'imageUrl'
>;

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    product: CreateProductInput,
    imageFile?: File | null
  ) => void | Promise<void>;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] =
    useState<Product['category']>('Medical Program');
  const [basePrice, setBasePrice] = useState(199);
  const [minimumPrice, setMinimumPrice] = useState(249);
  const [description, setDescription] = useState('');
  const [buyUrl, setBuyUrl] = useState('');
  const [stockStatus, setStockStatus] =
    useState<Product['stockStatus']>('In Stock');
  const [status, setStatus] = useState<Product['status']>('Active');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const resetForm = () => {
    setName('');
    setCategory('Medical Program');
    setBasePrice(199);
    setMinimumPrice(249);
    setDescription('');
    setBuyUrl('');
    setStockStatus('In Stock');
    setStatus('Active');
    setImageFile(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required');
      return;
    }
    if (minimumPrice < basePrice) {
      setError('Minimum price cannot be less than base price');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await onCreate(
        {
          name,
          category,
          basePrice: Number(basePrice),
          minimumPrice: Number(minimumPrice),
          description,
          buyUrl: buyUrl.trim() || null,
          stockStatus,
          status,
        },
        imageFile
      );
      resetForm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Add product"
      description="Set wholesale base and minimum retail for the catalog."
      icon={<Package className="w-5 h-5" />}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className={modalLabelClass}>Product image</label>
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-xl border border-[#E4EAF0] bg-[#F7F9FC] overflow-hidden flex items-center justify-center flex-shrink-0">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImagePlus className="w-7 h-7 text-[#9CA3AF]" />
              )}
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file && file.size > 5 * 1024 * 1024) {
                    setError('Image must be 5 MB or smaller');
                    setImageFile(null);
                    return;
                  }
                  setError('');
                  setImageFile(file);
                }}
                className="block w-full text-sm text-[#5B6B7C] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#EAF4FB] file:text-[#12345F] hover:file:bg-[#d8ecf9]"
              />
              <p className={modalHintClass}>
                PNG, JPG, WebP or GIF · max 5 MB
              </p>
              {imageFile && (
                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#B42318] hover:underline"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove image
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className={modalLabelClass}>Product name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Tirzepatide Metabolic Program"
            className={modalInputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={modalLabelClass}>Category</label>
            <ModalSelect
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as Product['category'])
              }
            >
              <option value="Medical Program">Medical Program</option>
              <option value="Telehealth Consult">Telehealth Consult</option>
              <option value="Prescription Refill">Prescription Refill</option>
              <option value="Wellness Pack">Wellness Pack</option>
            </ModalSelect>
          </div>
          <div>
            <label className={modalLabelClass}>Stock status</label>
            <ModalSelect
              value={stockStatus}
              onChange={(e) =>
                setStockStatus(e.target.value as Product['stockStatus'])
              }
            >
              <option value="In Stock">In Stock</option>
              <option value="Compounding">Compounding</option>
              <option value="Backorder">Backorder</option>
            </ModalSelect>
          </div>
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
            <p className={modalHintClass}>LeanBloom wholesale cost</p>
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
                value={minimumPrice}
                onChange={(e) => setMinimumPrice(Number(e.target.value))}
                className={`${modalInputClass} pl-8`}
              />
            </div>
            <p className={modalHintClass}>Affiliate retail floor</p>
          </div>
        </div>

        <div>
          <label className={modalLabelClass}>Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short clinical or catalog description…"
            className={`${modalInputClass} resize-none`}
          />
        </div>

        <div>
          <label className={modalLabelClass}>Buy / checkout link</label>
          <input
            type="url"
            value={buyUrl}
            onChange={(e) => setBuyUrl(e.target.value)}
            placeholder="https://… (opens from storefront Get started)"
            className={modalInputClass}
          />
          <p className={modalHintClass}>
            When patients click Buy on the storefront product page, this URL opens.
          </p>
        </div>

        <div>
          <label className={modalLabelClass}>Status</label>
          <ModalSelect
            value={status}
            onChange={(e) => setStatus(e.target.value as Product['status'])}
          >
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </ModalSelect>
        </div>

        {error && (
          <div className="p-3 bg-[#FEF3F2] border border-[#FECDCA] rounded-xl text-sm text-[#B42318] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="pt-2 border-t border-[#E4EAF0] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className={modalBtnSecondary}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${modalBtnAccent} disabled:opacity-70`}
            disabled={saving}
          >
            <Check className="w-4 h-4" />
            {saving ? 'Saving…' : 'Add product'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};
