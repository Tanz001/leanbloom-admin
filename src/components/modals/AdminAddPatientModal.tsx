import React, { useEffect, useState } from 'react';
import { Building2, Mail, Phone, Stethoscope, UserPlus, UserRound } from 'lucide-react';
import { Affiliate, Patient } from '../../types';
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
  patient?: Patient | null;
  onClose: () => void;
  onCreate: (payload: AddPatientPayload) => Promise<void>;
  onUpdate?: (id: string, payload: AddPatientPayload) => Promise<void>;
}

export const AdminAddPatientModal: React.FC<AdminAddPatientModalProps> = ({
  isOpen,
  affiliates,
  patient = null,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const isEdit = Boolean(patient);
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
    if (patient) {
      setAffiliateId(patient.affiliateId);
      setName(patient.name);
      setEmail(patient.email);
      setPhone(patient.phone || '');
      setActiveProgram(patient.activeProgram || '');
      setStatus(patient.status);
    } else {
      setAffiliateId(affiliates[0]?.id || '');
      setName('');
      setEmail('');
      setPhone('');
      setActiveProgram('');
      setStatus('Pending Intake');
    }
    setError('');
    setBusy(false);
  }, [isOpen, affiliates, patient]);

  const selectedAffiliate = affiliates.find((a) => a.id === affiliateId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateId) {
      setError('Select an affiliate clinic');
      return;
    }
    if (name.trim().length < 2) {
      setError('Full name is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address');
      return;
    }
    setBusy(true);
    setError('');
    const payload: AddPatientPayload = {
      affiliateId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      activeProgram: activeProgram.trim() || undefined,
      status,
    };
    try {
      if (isEdit && patient && onUpdate) {
        await onUpdate(patient.id, payload);
      } else {
        await onCreate(payload);
      }
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isEdit
            ? 'Failed to update patient'
            : 'Failed to add patient'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={() => !busy && onClose()}
      title={isEdit ? 'Edit patient' : 'Add patient'}
      description={
        isEdit
          ? 'Update patient details and clinic assignment.'
          : 'Create a patient record under an affiliate clinic.'
      }
      icon={
        isEdit ? (
          <UserRound className="w-5 h-5" />
        ) : (
          <UserPlus className="w-5 h-5" />
        )
      }
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
            form="admin-patient-form"
            className={modalBtnPrimary}
            disabled={busy}
          >
            {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Add patient'}
          </button>
        </>
      }
    >
      <form id="admin-patient-form" onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="rounded-2xl border border-[#E4EAF0] bg-[#F8FAFC] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-[#2D82C4]" />
            <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              Clinic assignment
            </p>
          </div>
          <label className={modalLabelClass} htmlFor="admin-patient-affiliate">
            Affiliate clinic
          </label>
          <ModalSelect
            id="admin-patient-affiliate"
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
            {selectedAffiliate
              ? `This patient will appear only for ${selectedAffiliate.name}.`
              : 'Required — affiliates only see their own patients.'}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E4EAF0] p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#2D82C4]" />
            <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              Contact details
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={modalLabelClass} htmlFor="admin-patient-name">
                Full name
              </label>
              <input
                id="admin-patient-name"
                className={modalInputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Emilie Limjoco"
                required
              />
            </div>
            <div>
              <label className={modalLabelClass} htmlFor="admin-patient-email">
                Email
              </label>
              <input
                id="admin-patient-email"
                type="email"
                className={modalInputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@email.com"
                required
              />
            </div>
            <div>
              <label className={modalLabelClass} htmlFor="admin-patient-phone">
                Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#98A2B3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-patient-phone"
                  className={`${modalInputClass} pl-10`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E4EAF0] p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-[#2D82C4]" />
            <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              Care status
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={modalLabelClass} htmlFor="admin-patient-program">
                Active treatment
              </label>
              <input
                id="admin-patient-program"
                className={modalInputClass}
                value={activeProgram}
                onChange={(e) => setActiveProgram(e.target.value)}
                placeholder="e.g. Tirzepatide + B12"
              />
            </div>
            <div>
              <label className={modalLabelClass} htmlFor="admin-patient-status">
                Status
              </label>
              <ModalSelect
                id="admin-patient-status"
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
