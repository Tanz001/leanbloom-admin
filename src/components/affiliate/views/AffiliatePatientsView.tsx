import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  ShoppingBag,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  Mail,
  Phone,
  UserCheck
} from 'lucide-react';
import { AffiliatePatientItem, AffiliateOrderItem } from '../../../types';

interface AffiliatePatientsViewProps {
  patients: AffiliatePatientItem[];
  orders: AffiliateOrderItem[];
  onSelectPatient: (patient: AffiliatePatientItem) => void;
  onOpenAddPatient: () => void;
}

export const AffiliatePatientsView: React.FC<AffiliatePatientsViewProps> = ({
  patients,
  orders,
  onSelectPatient,
  onOpenAddPatient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Available unique plans for filtering
  const uniquePlans = useMemo(() => {
    const plans = new Set(patients.map((p) => p.plan));
    return Array.from(plans);
  }, [patients]);

  // Filtering
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchSearch =
        searchTerm === '' ||
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'All' || patient.status === statusFilter;
      const matchPlan = planFilter === 'All' || patient.plan === planFilter;

      return matchSearch && matchStatus && matchPlan;
    });
  }, [patients, searchTerm, statusFilter, planFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPatients.length / pageSize) || 1;
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPatients.slice(start, start + pageSize);
  }, [filteredPatients, currentPage, pageSize]);

  // CSV Export for Patients
  const handleExportCSV = () => {
    const headers = ['Patient ID', 'Name', 'Email', 'Phone', 'Joined Date', 'Plan', 'Orders', 'Total Spent', 'Status'];
    const rows = filteredPatients.map((p) => [
      p.id,
      `"${p.name}"`,
      p.email,
      `"${p.phone}"`,
      p.joinedDate,
      `"${p.plan}"`,
      p.ordersCount,
      p.totalSpent,
      p.status
    ]);
    const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LeanBloom-Patients-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight">Patients</h1>
          <p className="text-xs text-[#667085] mt-1">
            Manage and monitor referred patients linked to your affiliate account.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-[#172033] bg-white hover:bg-[#F7F9FC] border border-[#E5E7EB] rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#667085]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenAddPatient}
            className="px-4 py-2 text-xs font-bold text-white bg-[#174A87] hover:bg-[#123B70] rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search patients by name, email, phone..."
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#174A87]/20 focus:border-[#174A87]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-medium text-[#667085]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs border border-[#E5E7EB] rounded-xl px-3 py-2 bg-[#F7F9FC] focus:outline-hidden focus:border-[#174A87]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending Intake</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Plan Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-medium text-[#667085]">Treatment:</span>
            <select
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs border border-[#E5E7EB] rounded-xl px-3 py-2 bg-[#F7F9FC] focus:outline-hidden focus:border-[#174A87]"
            >
              <option value="All">All Programs</option>
              {uniquePlans.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(searchTerm || statusFilter !== 'All' || planFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setPlanFilter('All');
                setCurrentPage(1);
              }}
              className="text-xs text-[#174A87] font-semibold hover:underline self-start md:self-auto"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Patients Table Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F9FC] text-[#667085] font-semibold border-b border-[#E5E7EB]">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3">Joined</th>
                <th className="px-3 py-3">Active Program</th>
                <th className="px-3 py-3 text-center">Orders</th>
                <th className="px-4 py-3 text-right">Total Spent</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {paginatedPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#667085]">
                    No patients found matching your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => onSelectPatient(patient)}
                    className="hover:bg-[#EAF5EA]/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#EAF5EA] text-[#4A9B52] font-bold text-xs flex items-center justify-center">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#172033] group-hover:text-[#174A87]">
                            {patient.name}
                          </div>
                          <div className="text-[11px] text-[#667085] font-mono">{patient.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-[#667085]">
                      <div>{patient.email}</div>
                      <div className="text-[11px]">{patient.phone}</div>
                    </td>
                    <td className="px-3 py-3.5 text-[#667085] whitespace-nowrap">
                      {patient.joinedDate}
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="font-medium text-[#172033] bg-[#F7F9FC] px-2 py-1 rounded-md border border-[#E5E7EB] text-[11px]">
                        {patient.plan}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-center font-semibold text-[#172033]">
                      {patient.ordersCount}
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-[#174A87]">
                      ${patient.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                          patient.status === 'Active'
                            ? 'bg-[#EAF5EA] text-[#4A9B52]'
                            : patient.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectPatient(patient)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#174A87] hover:bg-[#174A87]/10 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-[#F7F9FC] border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#667085]">
          <div>
            Showing{' '}
            <span className="font-semibold text-[#172033]">
              {filteredPatients.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-[#172033]">
              {Math.min(currentPage * pageSize, filteredPatients.length)}
            </span>{' '}
            of <span className="font-semibold text-[#172033]">{filteredPatients.length}</span>{' '}
            patients
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-[#E5E7EB] rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page <strong className="text-[#172033]">{currentPage}</strong> of{' '}
              <strong className="text-[#172033]">{totalPages}</strong>
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-[#E5E7EB] rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
