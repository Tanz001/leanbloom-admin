import React, { useState } from 'react';
import { X, Send, HelpCircle, CheckCircle2 } from 'lucide-react';

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  affiliateName: string;
}

export const SupportTicketModal: React.FC<SupportTicketModalProps> = ({
  isOpen,
  onClose,
  affiliateName
}) => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Commissions & Payouts');
  const [priority, setPriority] = useState('Normal');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        onClose();
        setSubject('');
        setMessage('');
      }, 1200);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#123B70]/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F7F9FC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EAF5EA] text-[#4A9B52] flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Contact LeanBloom Partner Support</h3>
              <p className="text-xs text-[#667085]">Direct line for {affiliateName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#667085] hover:text-[#172033] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {isSent ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EAF5EA] text-[#4A9B52] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 animate-bounce" />
            </div>
            <h4 className="text-base font-bold text-[#172033]">Support Ticket Dispatched!</h4>
            <p className="text-xs text-[#667085]">
              Ticket #TK-{Math.floor(10000 + Math.random() * 90000)} created. Our affiliate partner
              manager will respond within 4 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Bank ACH routing update for next payout cycle"
                className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Topic Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87] bg-white"
                >
                  <option value="Commissions & Payouts">Commissions & Payouts</option>
                  <option value="Patient Intake / Telehealth">Patient Intake / Telehealth</option>
                  <option value="Prescription Fulfillment">Prescription Fulfillment</option>
                  <option value="Custom Domain & Branding">Custom Domain & Branding</option>
                  <option value="General Partner Question">General Partner Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87] bg-white"
                >
                  <option value="Normal">Normal (24h)</option>
                  <option value="High">High (4h)</option>
                  <option value="Urgent">Urgent Patient Care (1h)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Message Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide detailed description of your request or issue..."
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
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Ticket</span>
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
