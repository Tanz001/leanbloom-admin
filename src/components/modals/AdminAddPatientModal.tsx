import React, { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Affiliate } from '../../types';
import {
  ModalShell,
  ModalSelect,
  modalBtnPrimary,
  modalBtnSecondary,
  modalHintClass,
  modalInputClass,
  modalLabelClass,
} from './ModalShell';

export type AddPatientPayload = {
  affiliateId: string;
  name: string;
  email: string;
  phone?: string;
  activeProgram?: string;
  status: 'Active' | 'Pending Intake' | 'Inactive';
};

interface AdminAddPatientModalProps {
  isOpen: boolean;
  affiliates: Affiliate[];
  onClose: () => void;
  onCreate: (payload: AddPatientPayload) => Promise<void>;
}

export const AdminAddPatientModal: React.FC<AdminAddPatientModalProps> = ({
  isOpen,
  affiliates,
  onClose,
  onCreate,
}) => {
  const [affiliateId, setAffiliateId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [activeProgram, setActiveProgram] = useState('');
  const [status, setStatus] =
    useState<AddPatientPayload['status']>('Pending Intake');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setAffiliateId(affiliates[0]?.id || '');
    setName('');
    setEmail('');
    setPhone('');
    setActiveProgram('');
    setStatus('Pending Intake');
    setError('');
    setBusy(false);
  }, [isOpen, affiliates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateId) {
      setError('Select an affiliate');
      return;
    }
    if (name.trim().length < 2) {
      setError('Name is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onCreate({
        affiliateId,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        activeProgram: activeProgram.trim() || undefined,
        status,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add patient');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={() => !busy && onClose()}
      title="Add patient"
      description="Assign this patient to an affiliate clinic."
      icon={<UserPlus className="w-5 h-5" />}
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
            form="add-patient-form"
            className={modalBtnPrimary}
            disabled={busy}
          >
            {busy ? 'Saving…' : 'Add patient'}
          </button>
        </>
      }
    >
      <form id="add-patient-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={modalLabelClass} htmlFor="add-patient-affiliate">
            Affiliate
          </label>
          <ModalSelect
            id="add-patient-affiliate"
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
          <p className={modalHintClass}>
            The patient will only appear for this affiliate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={modalLabelClass} htmlFor="add-patient-name">
              Full name
            </label>
            <input
              id="add-patient-name"
              className={modalInputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={modalLabelClass} htmlFor="add-patient-email">
              Email
            </label>
            <input
              id="add-patient-email"
              type="email"
              className={modalInputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={modalLabelClass} htmlFor="add-patient-phone">
              Phone
            </label>
            <input
              id="add-patient-phone"
              className={modalInputClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className={modalLabelClass} htmlFor="add-patient-program">
              Active treatment / program
            </label>
            <input
              id="add-patient-program"
              className={modalInputClass}
              value={activeProgram}
              onChange={(e) => setActiveProgram(e.target.value)}
              placeholder="e.g. Tirzepatide + B12"
            />
          </div>
          <div>
            <label className={modalLabelClass} htmlFor="add-patient-status">
              Status
            </label>
            <ModalSelect
              id="add-patient-status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as AddPatientPayload['status'])
              }
            >
              <option value="Pending Intake">Pending Intake</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
