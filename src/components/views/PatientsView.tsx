import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  Building2,
  Calendar,
  X,
  FileText,
  Clock,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { Patient, Affiliate } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface PatientsViewProps {
  patients: Patient[];
  affiliates: Affiliate[];
}

export const PatientsView: React.FC<PatientsViewProps> = ({ patients, affiliates }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAffiliateFilter, setSelectedAffiliateFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [activePatientDrawer, setActivePatientDrawer] = useState<Patient | null>(null);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm);
    const matchesAffiliate =
      selectedAffiliateFilter === 'All' || p.affiliateId === selectedAffiliateFilter;
    const matchesStatus =
      selectedStatusFilter === 'All' || p.status === selectedStatusFilter;
    return matchesSearch && matchesAffiliate && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12" id="patients-view-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-[#E4E7EC] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">Customers</h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Customers from every affiliate storefront, in one place.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#173B72] bg-[#EAF4FB] px-3 py-1.5 rounded-lg border border-[#2D82C4]/20 self-start sm:self-auto">
          <UserCheck className="w-4 h-4 text-[#2D82C4]" />
          <span>{patients.length.toLocaleString()} customers loaded</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E4E7EC] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient name, email, phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F7F9FC] border border-[#E4E7EC] rounded-lg text-[#172033] placeholder-[#98A2B3] focus:ring-2 focus:ring-[#2D82C4]/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Affiliate Selector */}
          <select
            value={selectedAffiliateFilter}
            onChange={(e) => setSelectedAffiliateFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium bg-[#F7F9FC] border border-[#E4E7EC] rounded-lg text-[#344054]"
          >
            <option value="All">All Affiliates</option>
            {affiliates.map((aff) => (
              <option key={aff.id} value={aff.id}>
                {aff.name}
              </option>
            ))}
          </select>

          {/* Status Selector */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium bg-[#F7F9FC] border border-[#E4E7EC] rounded-lg text-[#344054]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending Intake">Pending Intake</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl border border-[#E4E7EC] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4E7EC] text-[11px] font-bold text-[#667085] uppercase tracking-wider bg-[#F8F9FC]">
                <th className="py-3 px-4">Patient Name & Contact</th>
                <th className="py-3 px-4">Owning Affiliate</th>
                <th className="py-3 px-4">Active Protocol</th>
                <th className="py-3 px-4 text-right">Orders</th>
                <th className="py-3 px-4 text-right">Total Spent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7] text-xs text-[#344054]">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-[#F8F9FC] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#172033]">
                    <div>
                      <p className="text-sm font-bold text-[#172033]">{p.name}</p>
                      <p className="text-[11px] text-[#667085]">{p.email} • {p.phone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#EAF4FB] text-[#173B72] px-2 py-0.5 rounded-full border border-[#2D82C4]/20">
                      <Building2 className="w-3 h-3" />
                      {p.affiliateName}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#344054] font-medium">{p.activeProgram}</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold">{p.ordersCount}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#172033]">
                    ${p.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={p.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-[#667085]">{p.lastActivity}</td>
                  <td className="py-3 px-4 text-[#667085] whitespace-nowrap">{p.joinedDate}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => setActivePatientDrawer(p)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#173B72] bg-[#EAF4FB] hover:bg-[#d8ecf9] rounded-md transition-colors"
                    >
                      View Chart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Drawer / Slide-Over */}
      {activePatientDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F8F9FC]">
                <div>
                  <h3 className="text-base font-bold text-[#172033]">Master Patient Chart</h3>
                  <p className="text-xs text-[#667085]">HIPAA EHR Record ID: {activePatientDrawer.id}</p>
                </div>
                <button
                  onClick={() => setActivePatientDrawer(null)}
                  className="p-1.5 text-[#667085] hover:text-[#172033] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-[#EAF4FB] rounded-xl border border-[#2D82C4]/20">
                  <div className="w-12 h-12 rounded-xl bg-[#173B72] text-white flex items-center justify-center font-bold text-base">
                    {activePatientDrawer.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#172033]">{activePatientDrawer.name}</h4>
                    <p className="text-xs text-[#667085]">{activePatientDrawer.email}</p>
                    <p className="text-xs font-mono text-[#2D82C4]">{activePatientDrawer.phone}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Affiliate Provider:</span>
                    <strong className="text-[#173B72]">{activePatientDrawer.affiliateName}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Clinical Status:</span>
                    <StatusBadge status={activePatientDrawer.status} size="sm" />
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Active Prescription Protocol:</span>
                    <span className="font-semibold text-[#172033]">{activePatientDrawer.activeProgram}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Lifetime Orders Processed:</span>
                    <span className="font-mono font-bold">{activePatientDrawer.ordersCount}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Total Patient Spend:</span>
                    <span className="font-mono font-bold text-[#2E9B4B]">${activePatientDrawer.totalSpent}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Joined Date:</span>
                    <span>{activePatientDrawer.joinedDate}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <h5 className="text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                    Recent Prescriber Notes
                  </h5>
                  <div className="p-3 bg-[#F8F9FC] rounded-lg border border-[#E4E7EC] text-xs text-[#344054] space-y-1">
                    <p className="text-[11px] text-[#667085] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Sep 17, 2026 by Dr. Marcus Vance
                    </p>
                    <p>
                      Patient tolerated 0.5mg dose smoothly with -8.4 lbs weight reduction across 4 weeks. Refill approved for 1.0mg titration.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#E4E7EC] bg-[#F8F9FC]">
              <button
                type="button"
                onClick={() => setActivePatientDrawer(null)}
                className="w-full py-2 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] rounded-lg hover:bg-[#F2F4F7]"
              >
                Close Patient Chart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
