import React, { useState } from 'react';
import {
  UserCheck,
  Truck,
  Calendar,
  FileText,
  HelpCircle,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Provider } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface OperationsViewProps {
  initialSection?: 'providers' | 'pharmacy' | 'appointments' | 'prescriptions' | 'support';
  providers: Provider[];
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  initialSection = 'providers',
  providers
}) => {
  const [activeSub, setActiveSub] = useState<'providers' | 'pharmacy' | 'appointments' | 'prescriptions' | 'support'>(
    initialSection
  );

  return (
    <div className="space-y-6 pb-12" id="operations-view-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-[#E4E7EC] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">Clinical & Fulfillment Operations</h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Supervise licensed prescriber networks, 503A compounding logistics, and telehealth consultations.
          </p>
        </div>

        {/* Section Navigation */}
        <div className="flex items-center bg-[#F2F4F7] p-1 rounded-lg border border-[#E4E7EC] overflow-x-auto">
          {(
            [
              { id: 'providers', label: 'Providers' },
              { id: 'pharmacy', label: 'Pharmacy & 503A' },
              { id: 'appointments', label: 'Appointments' },
              { id: 'prescriptions', label: 'Prescriptions' },
              { id: 'support', label: 'Support' }
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSub(item.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeSub === item.id
                  ? 'bg-white text-[#173B72] shadow-xs font-bold'
                  : 'text-[#667085] hover:text-[#172033]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. PROVIDERS & PRESCRIBERS
         ───────────────────────────────────────────────────────────── */}
      {activeSub === 'providers' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#EAF4FB] rounded-xl border border-[#2D82C4]/20 flex items-center justify-between text-xs text-[#173B72]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2D82C4]" />
              <span>
                <strong>Master Clinical Prescriber Coverage:</strong> 50 States Covered with Independent Medical Practice (PC) BAA agreements.
              </span>
            </div>
            <span className="font-bold bg-white px-2 py-0.5 rounded text-[#173B72] border border-[#2D82C4]/20">
              100% NPI Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {providers.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#173B72] to-[#2D82C4] text-white flex items-center justify-center font-bold text-sm">
                      {doc.name.substring(3, 5).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#172033]">{doc.name}</h4>
                      <p className="text-[11px] text-[#667085]">{doc.specialty}</p>
                    </div>
                  </div>
                  <StatusBadge status={doc.status} size="sm" />
                </div>

                <div className="space-y-1.5 text-xs pt-1 border-t border-[#F2F4F7]">
                  <div className="flex justify-between">
                    <span className="text-[#667085]">NPI Number:</span>
                    <span className="font-mono font-semibold text-[#173B72]">{doc.npi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Active Patient Load:</span>
                    <span className="font-semibold text-[#172033]">{doc.activePatients} patients</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Lifetime Consults:</span>
                    <span className="font-semibold text-[#2D82C4]">{doc.consultsCompleted.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Satisfaction Rating:</span>
                    <span className="font-bold text-[#D99A18] flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#D99A18]" />
                      {doc.rating} / 5.0
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-[#667085] block mb-1">
                    Licensed State Compacts:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {doc.licenseStates.map((st) => (
                      <span
                        key={st}
                        className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#F2F4F7] text-[#344054] rounded"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. PHARMACY / FULFILLMENT
         ───────────────────────────────────────────────────────────── */}
      {activeSub === 'pharmacy' && (
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
            <div>
              <h3 className="text-base font-bold text-[#172033]">
                Compounding Pharmacy Network Status (503A / 503B)
              </h3>
              <p className="text-xs text-[#667085]">
                Real-time EDI dispensing queues, cold-chain courier tracking, and regional inventory.
              </p>
            </div>
            <span className="text-xs font-bold text-[#2E9B4B] bg-[#EAF6E7] px-3 py-1 rounded-full border border-[#4FAF4A]/30">
              ● All 4 Dispensaries Online
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#F8F9FC] rounded-xl border border-[#E4E7EC] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#172033] text-sm">Precision Compounders Hub (Central)</span>
                <span className="text-[#2E9B4B] font-semibold text-[11px]">Normal Capacity</span>
              </div>
              <p className="text-[#667085]">Semaglutide, Tirzepatide, NAD+, B12 Micro-injections</p>
              <div className="pt-2 flex justify-between text-[11px] border-t border-gray-200">
                <span>Current Queue: <strong>142 Orders</strong></span>
                <span>Avg Turnaround: <strong>22 Hours</strong></span>
              </div>
            </div>

            <div className="p-4 bg-[#F8F9FC] rounded-xl border border-[#E4E7EC] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#172033] text-sm">TailorMade Compounding (East Coast)</span>
                <span className="text-[#2E9B4B] font-semibold text-[11px]">Normal Capacity</span>
              </div>
              <p className="text-[#667085]">HRT / TRT Bioidentical Pellets & Topical Solutions</p>
              <div className="pt-2 flex justify-between text-[11px] border-t border-gray-200">
                <span>Current Queue: <strong>98 Orders</strong></span>
                <span>Avg Turnaround: <strong>26 Hours</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. APPOINTMENTS & PRESCRIPTIONS & SUPPORT
         ───────────────────────────────────────────────────────────── */}
      {(activeSub === 'appointments' || activeSub === 'prescriptions' || activeSub === 'support') && (
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-6 shadow-xs text-xs space-y-4">
          <h3 className="text-base font-bold text-[#172033] capitalize">
            {activeSub} Operational Pipeline
          </h3>
          <p className="text-[#667085]">
            Integrated EHR telemetry handles over 1,400 daily asynchronous clinical chart validations and synchronous telehealth sessions for LeanBloom white-label affiliates.
          </p>
          <div className="p-4 bg-[#F8F9FC] rounded-lg border border-[#E4E7EC] flex items-center justify-between">
            <span className="text-[#344054]">
              Connected Telehealth Engine: <strong>Zoom for Healthcare & Twilio Video WebRTC</strong>
            </span>
            <span className="text-[#2E9B4B] font-bold">100% Operational</span>
          </div>
        </div>
      )}
    </div>
  );
};
