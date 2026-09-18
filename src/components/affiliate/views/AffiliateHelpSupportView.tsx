import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageSquare,
  FileText,
  Mail,
  Phone,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { SUPPORT_FAQS, SupportFaq } from '../../../data/affiliateMockData';

interface AffiliateHelpSupportViewProps {
  affiliateName: string;
  onOpenTicket: () => void;
}

export const AffiliateHelpSupportView: React.FC<AffiliateHelpSupportViewProps> = ({
  affiliateName,
  onOpenTicket
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const categories = ['All', 'Commissions & Payouts', 'Patient Referrals', 'Clinical Fulfillment', 'Patient Privacy & HIPAA', 'Customization & Branding'];

  const filteredFaqs = useMemo(() => {
    return SUPPORT_FAQS.filter((faq) => {
      const matchSearch =
        searchTerm === '' ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCat = selectedCategory === 'All' || faq.category === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">Help & Partner Support</h1>
          <p className="text-xs text-[#667085] mt-1">
            Access documentation, clinical guidelines, FAQs, and reach dedicated partner support.
          </p>
        </div>

        <button
          onClick={onOpenTicket}
          className="px-4 py-2 text-xs font-bold text-white bg-[#174A87] hover:bg-[#123B70] rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Contact Partner Support</span>
        </button>
      </div>

      {/* Support Search Hero Banner */}
      <div className="p-6 bg-gradient-to-r from-[#174A87] to-[#123B70] rounded-2xl text-white shadow-md space-y-4">
        <div className="max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
            LeanBloom Knowledge Base
          </span>
          <h2 className="text-lg font-bold mt-1">How can our team help your clinic today?</h2>
          <p className="text-xs text-blue-100 mt-1">
            Find answers on clinical protocols, commission reconciliation, and tracking links.
          </p>
        </div>

        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions (e.g. payout schedule, GLP-1 compounding, tracking cookie)..."
            className="w-full pl-9 pr-3.5 py-2.5 text-xs text-[#172033] bg-white rounded-xl shadow-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-400 placeholder-[#667085]"
          />
        </div>
      </div>

      {/* 3 Quick Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#EAF5EA] text-[#4A9B52] flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#172033]">Affiliate Playbook</h3>
          <p className="text-xs text-[#667085]">
            Best practices for driving qualified patient consults and maximizing subscription retention.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#174A87]/10 text-[#174A87] flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#172033]">Clinical Protocol Guides</h3>
          <p className="text-xs text-[#667085]">
            Overview of GLP-1 titration steps, lab panels, TRT bloodwork, and compounding purity.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#172033]">Dedicated Account Rep</h3>
          <p className="text-xs text-[#667085]">
            Direct email: <strong>partners@leanbloom.com</strong> (Mon–Fri 8am–6pm CT).
          </p>
        </div>
      </div>

      {/* FAQ Category Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#174A87] text-white shadow-xs'
                : 'text-[#667085] hover:text-[#172033] hover:bg-[#F7F9FC]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs divide-y divide-[#E5E7EB] overflow-hidden">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#667085]">
            No answers matched your search term "{searchTerm}".
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#F7F9FC] transition-colors"
                >
                  <div className="pr-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A9B52] block mb-1">
                      {faq.category}
                    </span>
                    <h4 className="text-xs font-bold text-[#172033]">{faq.question}</h4>
                  </div>
                  <div className="text-[#667085]">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 pt-1 text-xs text-[#667085] leading-relaxed bg-[#F7F9FC]/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
