import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Affiliate, Patient, Product } from '../../types';
import {
  ModalShell,
  ModalSelect,
  modalBtnPrimary,
  modalBtnSecondary,
  modalHintClass,
  modalInputClass,
  modalLabelClass,
} from './ModalShell';

export type AddOrderPayload = {
  affiliateId: string;
  patientId: string;
  productId?: string;
  productName?: string;
  amount?: number;
  status: 'Completed' | 'Processing' | 'Pending' | 'Cancelled' | 'Refunded';
  paymentMethod?: string;
  shippingStatus?:
    | 'Delivered'
    | 'In Transit'
    | 'Fulfillment Queue'
    | 'Pending Lab';
};

interface AdminAddOrderModalProps {
  isOpen: boolean;
  affiliates: Affiliate[];
  patients: Patient[];
  products: Product[];
  onClose: () => void;
  onCreate: (payload: AddOrderPayload) => Promise<void>;
}

export const AdminAddOrderModal: React.FC<AdminAddOrderModalProps> = ({
  isOpen,
  affiliates,
  patients,
  products,
  onClose,
  onCreate,
}) => {
  const [affiliateId, setAffiliateId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [productId, setProductId] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] =
    useState<AddOrderPayload['status']>('Pending');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingStatus, setShippingStatus] = useState<string>('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const affiliatePatients = useMemo(
    () => patients.filter((p) => p.affiliateId === affiliateId),
    [patients, affiliateId]
  );

  const activeProducts = useMemo(
    () => products.filter((p) => p.status === 'Active'),
    [products]
  );

  useEffect(() => {
    if (!isOpen) return;
    setAffiliateId(affiliates[0]?.id || '');
    setPatientId('');
    setProductId('');
    setAmount('');
    setStatus('Pending');
    setPaymentMethod('');
    setShippingStatus('');
    setError('');
    setBusy(false);
  }, [isOpen, affiliates]);

  useEffect(() => {
    setPatientId('');
  }, [affiliateId]);

  useEffect(() => {
    const prod = activeProducts.find((p) => p.id === productId);
    if (prod) setAmount(String(prod.basePrice));
  }, [productId, activeProducts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateId) {
      setError('Select an affiliate');
      return;
    }
    if (!patientId) {
      setError('Select a patient');
      return;
    }
    if (!productId) {
      setError('Select a product');
      return;
    }
    const amountNum = Number(amount);
    if (Number.isNaN(amountNum) || amountNum < 0) {
      setError('Enter a valid amount');
      return;
    }

    setBusy(true);
    setError('');
    try {
      const prod = activeProducts.find((p) => p.id === productId);
      await onCreate({
        affiliateId,
        patientId,
        productId,
        productName: prod?.name,
        amount: amountNum,
        status,
        paymentMethod: paymentMethod.trim() || undefined,
        shippingStatus: shippingStatus
          ? (shippingStatus as AddOrderPayload['shippingStatus'])
          : undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={() => !busy && onClose()}
      title="Add order"
      description="Create an order for a patient under an affiliate."
      icon={<ShoppingBag className="w-5 h-5" />}
      footer={
        <>
          <button
            type="button"
            className={modalBtnSecondary}
            disabled={busy}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-order-form"
            className={modalBtnPrimary}
            disabled={busy}
          >
            {busy ? 'Saving…' : 'Add order'}
          </button>
        </>
      }
    >
      <form id="add-order-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={modalLabelClass} htmlFor="add-order-affiliate">
            Affiliate
          </label>
          <ModalSelect
            id="add-order-affiliate"
            required
            value={affiliateId}
            onChange={(e) => setAffiliateId(e.target.value)}
          >
            <option value="" disabled>
              Select affiliate…
            </option>
            {affiliates.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </ModalSelect>
        </div>

        <div>
          <label className={modalLabelClass} htmlFor="add-order-patient">
            Patient
          </label>
          <ModalSelect
            id="add-order-patient"
            required
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            disabled={!affiliateId}
          >
            <option value="" disabled>
              {affiliateId
                ? affiliatePatients.length
                  ? 'Select patient…'
                  : 'No patients for this affiliate'
                : 'Select affiliate first'}
            </option>
            {affiliatePatients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.email})
              </option>
            ))}
          </ModalSelect>
          <p className={modalHintClass}>
            Only patients belonging to the selected affiliate are listed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={modalLabelClass} htmlFor="add-order-product">
              Product / medication
            </label>
            <ModalSelect
              id="add-order-product"
              required
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="" disabled>
                Select product…
              </option>
              {activeProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (${p.basePrice.toFixed(2)})
                </option>
              ))}
            </ModalSelect>
          </div>
          <div>
            <label className={modalLabelClass} htmlFor="add-order-amount">
              Amount
            </label>
            <input
              id="add-order-amount"
              type="number"
              min="0"
              step="0.01"
              className={modalInputClass}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={modalLabelClass} htmlFor="add-order-status">
              Status
            </label>
            <ModalSelect
              id="add-order-status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as AddOrderPayload['status'])
              }
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
            </ModalSelect>
          </div>
          <div>
            <label className={modalLabelClass} htmlFor="add-order-pay">
              Payment method
            </label>
            <input
              id="add-order-pay"
              className={modalInputClass}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              placeholder="Card, ACH…"
            />
          </div>
          <div>
            <label className={modalLabelClass} htmlFor="add-order-ship">
              Shipping status
            </label>
            <ModalSelect
              id="add-order-ship"
              value={shippingStatus}
              onChange={(e) => setShippingStatus(e.target.value)}
            >
              <option value="">—</option>
              <option value="Pending Lab">Pending Lab</option>
              <option value="Fulfillment Queue">Fulfillment Queue</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </ModalSelect>
          </div>
        </div>

        {error && (
          <p className="text-sm text-[#B42318] bg-[#FEF3F2] border border-[#FECDCA] rounded-xl px-3 py-2">
            {error}
          </p>
        )}
      </form>
    </ModalShell>
  );
};
