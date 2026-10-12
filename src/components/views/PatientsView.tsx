import React, { useState } from 'react';
import {
  Search,
  UserCheck,
  Building2,
  X,
  Clock,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Patient, Affiliate } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PageHeader } from '../common/PageHeader';
import { RowActionsMenu } from '../common/RowActionsMenu';

interface PatientsViewProps {
  patients: Patient[];
  affiliates: Affiliate[];
  onOpenAddPatient?: () => void;
  onEditPatient?: (patient: Patient) => void;
  onDeletePatient?: (patient: Patient) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  affiliates,
  onOpenAddPatient,
  onEditPatient,
  onDeletePatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAffiliateFilter, setSelectedAffiliateFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [activePatientDrawer, setActivePatientDrawer] = useState<Patient | null>(
    null
  );

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm);
    const matchesAffiliate =
      selectedAffiliateFilter === 'All' ||
      p.affiliateId === selectedAffiliateFilter;
    const matchesStatus =
      selectedStatusFilter === 'All' || p.status === selectedStatusFilter;
    return matchesSearch && matchesAffiliate && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12" id="patients-view-container">
      <PageHeader
        title="Patients"
        description="Patients across all affiliate clinics. Each patient belongs to one affiliate."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs font-medium text-[#4B5563] bg-white px-3 py-2 rounded-xl border border-[#ECEEF2]">
              <UserCheck className="w-4 h-4 text-[#9CA3AF]" />
              <span>{patients.length.toLocaleString()} loaded</span>
            </div>
            {onOpenAddPatient && (
              <button
                type="button"
                onClick={onOpenAddPatient}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0F1C2E] hover:bg-[#1A2F4A] rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Patient
              </button>
            )}
          </div>
        }
      />

      <div className="bg-white p-4 rounded-xl border border-[#ECEEF2] flex flex-col md:flex-row items-center justify-between gap-3">
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
                <th className="py-3 px-4 text-center w-14"> </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7] text-xs text-[#344054]">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-[#F8F9FC] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#172033]">
                    <button
                      type="button"
                      onClick={() => setActivePatientDrawer(p)}
                      className="text-left"
                    >
                      <p className="text-sm font-bold text-[#172033] hover:text-[#2D82C4]">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-[#667085]">
                        {p.email}
                        {p.phone ? ` • ${p.phone}` : ''}
                      </p>
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#EAF4FB] text-[#173B72] px-2 py-0.5 rounded-full border border-[#2D82C4]/20">
                      <Building2 className="w-3 h-3" />
                      {p.affiliateName}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#344054] font-medium">
                    {p.activeProgram || '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold">
                    {p.ordersCount}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#172033]">
                    ${p.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={p.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-[#667085]">{p.lastActivity}</td>
                  <td className="py-3 px-4 text-[#667085] whitespace-nowrap">
                    {p.joinedDate}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <RowActionsMenu
                      items={[
                        {
                          label: 'View',
                          onClick: () => setActivePatientDrawer(p),
                        },
                        ...(onEditPatient
                          ? [
                              {
                                label: 'Edit',
                                icon: <Edit2 className="w-4 h-4" />,
                                onClick: () => onEditPatient(p),
                              },
                            ]
                          : []),
                        ...(onDeletePatient
                          ? [
                              {
                                label: 'Delete',
                                icon: <Trash2 className="w-4 h-4" />,
                                tone: 'danger' as const,
                                onClick: () => onDeletePatient(p),
                              },
                            ]
                          : []),
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="py-12 text-center text-sm text-[#667085]"
                  >
                    No patients match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activePatientDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F8F9FC]">
                <div>
                  <h3 className="text-base font-bold text-[#172033]">
                    Patient details
                  </h3>
                  <p className="text-xs text-[#667085]">
                    ID: {activePatientDrawer.id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePatientDrawer(null)}
                  className="p-1.5 text-[#667085] hover:text-[#172033] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-[#EAF4FB] rounded-xl border border-[#2D82C4]/20">
                  <div className="w-12 h-12 rounded-xl bg-[#173B72] text-white flex items-center justify-center font-bold text-base">
                    {activePatientDrawer.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#172033]">
                      {activePatientDrawer.name}
                    </h4>
                    <p className="text-xs text-[#667085]">
                      {activePatientDrawer.email}
                    </p>
                    <p className="text-xs font-mono text-[#2D82C4]">
                      {activePatientDrawer.phone || '—'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Affiliate:</span>
                    <strong className="text-[#173B72]">
                      {activePatientDrawer.affiliateName}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Status:</span>
                    <StatusBadge status={activePatientDrawer.status} size="sm" />
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Active treatment:</span>
                    <span className="font-semibold text-[#172033]">
                      {activePatientDrawer.activeProgram || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Orders:</span>
                    <span className="font-mono font-bold">
                      {activePatientDrawer.ordersCount}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Total spent:</span>
                    <span className="font-mono font-bold text-[#2E9B4B]">
                      ${activePatientDrawer.totalSpent}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F2F4F7]">
                    <span className="text-[#667085]">Joined:</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activePatientDrawer.joinedDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E4E7EC] bg-[#F8F9FC] flex gap-2">
              {onEditPatient && (
                <button
                  type="button"
                  onClick={() => {
                    onEditPatient(activePatientDrawer);
                    setActivePatientDrawer(null);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-[#12345F] rounded-lg hover:bg-[#0B2440]"
                >
                  Edit
                </button>
              )}
              <button
                type="button"
                onClick={() => setActivePatientDrawer(null)}
                className="flex-1 py-2 text-xs font-semibold text-[#344054] bg-white border border-[#D0D5DD] rounded-lg hover:bg-[#F2F4F7]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
