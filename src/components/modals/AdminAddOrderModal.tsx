import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Package,
  ShoppingBag,
  Truck,
  UserRound,
} from 'lucide-react';
import { Affiliate, Order, Patient, Product } from '../../types';
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
  order?: Order | null;
  onClose: () => void;
  onCreate: (payload: AddOrderPayload) => Promise<void>;
  onUpdate?: (id: string, payload: AddOrderPayload) => Promise<void>;
}

export const AdminAddOrderModal: React.FC<AdminAddOrderModalProps> = ({
  isOpen,
  affiliates,
  patients,
  products,
  order = null,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const isEdit = Boolean(order);
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
  const [skipAmountAutofill, setSkipAmountAutofill] = useState(false);

  const affiliatePatients = useMemo(
    () => patients.filter((p) => p.affiliateId === affiliateId),
    [patients, affiliateId]
  );

  const activeProducts = useMemo(
    () => products.filter((p) => p.status === 'Active' || p.id === productId),
    [products, productId]
  );

  const selectedPatient = affiliatePatients.find((p) => p.id === patientId);
  const selectedProduct = activeProducts.find((p) => p.id === productId);
  const selectedAffiliate = affiliates.find((a) => a.id === affiliateId);

  useEffect(() => {
    if (!isOpen) return;
    if (order) {
      setAffiliateId(order.affiliateId);
      setPatientId(order.patientId || '');
      setProductId(order.productId || '');
      setAmount(String(order.amount));
      setStatus(order.status);
      setPaymentMethod(
        order.paymentMethod && order.paymentMethod !== '—'
          ? order.paymentMethod
          : ''
      );
      setShippingStatus(order.shippingStatus || '');
      setSkipAmountAutofill(true);
    } else {
      setAffiliateId(affiliates[0]?.id || '');
      setPatientId('');
      setProductId('');
      setAmount('');
      setStatus('Pending');
      setPaymentMethod('');
      setShippingStatus('');
      setSkipAmountAutofill(false);
    }
    setError('');
    setBusy(false);
  }, [isOpen, affiliates, order]);

  useEffect(() => {
    if (order) return;
    setPatientId('');
  }, [affiliateId, order]);

  useEffect(() => {
    if (skipAmountAutofill) return;
    const prod = activeProducts.find((p) => p.id === productId);
    if (prod) setAmount(String(prod.basePrice));
  }, [productId, activeProducts, skipAmountAutofill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateId) {
      setError('Select an affiliate clinic');
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
    const payload: AddOrderPayload = {
      affiliateId,
      patientId,
      productId,
      productName: selectedProduct?.name,
      amount: amountNum,
      status,
      paymentMethod: paymentMethod.trim() || undefined,
      shippingStatus: shippingStatus
        ? (shippingStatus as AddOrderPayload['shippingStatus'])
        : undefined,
    };

    try {
      if (isEdit && order?.orderId && onUpdate) {
        await onUpdate(order.orderId, payload);
      } else {
        await onCreate(payload);
      }
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isEdit
            ? 'Failed to update order'
            : 'Failed to create order'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={() => !busy && onClose()}
      title={isEdit ? 'Edit order' : 'Add order'}
      description={
        isEdit
          ? `Update order ${order?.id || ''}.`
          : 'Place an order for a patient under an affiliate clinic.'
      }
      icon={<ShoppingBag className="w-5 h-5" />}
      maxWidth="xl"
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
            form="admin-order-form"
            className={modalBtnPrimary}
            disabled={busy}
          >
            {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Create order'}
          </button>
        </>
      }
    >
      <form id="admin-order-form" onSubmit={handleSubmit} className="p-6 space-y-5">
        {(selectedAffiliate || selectedPatient || selectedProduct) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-[#E4EAF0] bg-[#F8FAFC] px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
                Clinic
              </p>
              <p className="text-sm font-semibold text-[#12345F] truncate mt-0.5">
                {selectedAffiliate?.name || '—'}
              </p>
            </div>
            <div className="rounded-xl border border-[#E4EAF0] bg-[#F8FAFC] px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
                Patient
              </p>
              <p className="text-sm font-semibold text-[#12345F] truncate mt-0.5">
                {selectedPatient?.name || '—'}
              </p>
            </div>
            <div className="rounded-xl border border-[#E4EAF0] bg-[#F8FAFC] px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
                Amount
              </p>
              <p className="text-sm font-semibold font-mono text-[#12345F] mt-0.5">
                {amount ? `$${Number(amount).toFixed(2)}` : '—'}
              </p>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-[#E4EAF0] p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#2D82C4]" />
            <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              Assignment
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={modalLabelClass} htmlFor="admin-order-affiliate">
                Affiliate clinic
              </label>
              <ModalSelect
                id="admin-order-affiliate"
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
              <label className={modalLabelClass} htmlFor="admin-order-patient">
                Patient
              </label>
              <ModalSelect
                id="admin-order-patient"
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
                    {p.name} · {p.email}
                  </option>
                ))}
              </ModalSelect>
              <p className={modalHintClass}>
                <UserRound className="w-3 h-3 inline mr-1" />
                Only patients of the selected clinic are listed.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E4EAF0] p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#2D82C4]" />
            <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              Product & billing
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={modalLabelClass} htmlFor="admin-order-product">
                Product / medication
              </label>
              <ModalSelect
                id="admin-order-product"
                required
                value={productId}
                onChange={(e) => {
                  setSkipAmountAutofill(false);
                  setProductId(e.target.value);
                }}
              >
                <option value="" disabled>
                  Select product…
                </option>
                {activeProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · ${p.basePrice.toFixed(2)}
                  </option>
                ))}
              </ModalSelect>
            </div>
            <div>
              <label className={modalLabelClass} htmlFor="admin-order-amount">
                Amount (USD)
              </label>
              <input
                id="admin-order-amount"
                type="number"
                min="0"
                step="0.01"
                className={modalInputClass}
                value={amount}
                onChange={(e) => {
                  setSkipAmountAutofill(true);
                  setAmount(e.target.value);
                }}
                required
              />
            </div>
            <div>
              <label className={modalLabelClass} htmlFor="admin-order-status">
                Order status
              </label>
              <ModalSelect
                id="admin-order-status"
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
          </div>
        </div>

        <div className="rounded-2xl border border-[#E4EAF0] p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#2D82C4]" />
            <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              Payment & fulfillment
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={modalLabelClass} htmlFor="admin-order-pay">
                Payment method
              </label>
              <input
                id="admin-order-pay"
                className={modalInputClass}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="Card, ACH, Wire…"
              />
            </div>
            <div>
              <label className={modalLabelClass} htmlFor="admin-order-ship">
                Shipping status
              </label>
              <ModalSelect
                id="admin-order-ship"
                value={shippingStatus}
                onChange={(e) => setShippingStatus(e.target.value)}
              >
                <option value="">Not set</option>
                <option value="Pending Lab">Pending Lab</option>
                <option value="Fulfillment Queue">Fulfillment Queue</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </ModalSelect>
            </div>
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
