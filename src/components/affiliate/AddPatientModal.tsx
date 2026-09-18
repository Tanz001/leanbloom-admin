import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2 } from 'lucide-react';
import { AffiliatePatientItem } from '../../types';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  affiliateId: string;
  onAddPatient: (patient: AffiliatePatientItem) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  affiliateId,
  onAddPatient
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState('GLP-1 Weight Management');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newPatient: AffiliatePatientItem = {
        id: `pat-${Date.now().toString().slice(-4)}`,
        affiliateId,
        name,
        email,
        phone: phone || '+1 (555) 000-0000',
        joinedDate: 'Today',
        ordersCount: 0,
        totalSpent: 0,
        status: 'Pending',
        plan,
        address: address || '100 Medical Blvd, Austin, TX',
        notes: notes || 'Direct referral intake initiated via affiliate dashboard.'
      };

      onAddPatient(newPatient);
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setNotes('');
      }, 1000);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#123B70]/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#E5E7EB] overflow-hidden z-10">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F7F9FC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EAF5EA] text-[#4A9B52] flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Add Referred Patient</h3>
              <p className="text-xs text-[#667085]">Register a patient directly to your affiliate clinic</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#667085] hover:text-[#172033] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {showSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EAF5EA] text-[#4A9B52] mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#172033]">Patient Successfully Registered!</h4>
            <p className="text-xs text-[#667085]">
              Invitation and secure asynchronous medical intake link sent to {email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Full Legal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
                className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@example.com"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Assigned Treatment Plan
                </label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87] bg-white"
                >
                  <option value="GLP-1 Weight Management">GLP-1 Weight Management</option>
                  <option value="Metabolic Baseline & Labs">Metabolic Baseline & Labs</option>
                  <option value="Hormone Optimization (TRT)">Hormone Optimization (TRT)</option>
                  <option value="Longevity NAD+ Cellular">Longevity NAD+ Cellular</option>
                  <option value="Hair Follicle Restoration">Hair Follicle Restoration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Delivery Address / State
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Austin, TX"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Clinical Referral Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specific clinical protocol requests or provider instructions..."
                className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#667085] hover:text-[#172033] hover:bg-[#F7F9FC] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-bold text-white bg-[#174A87] hover:bg-[#123B70] rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Registering Patient...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Send Intake Link</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
