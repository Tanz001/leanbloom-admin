import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  period?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  accentColor?: string;
  id?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  isPositive = true,
  period = 'vs last month',
  icon,
  iconBgColor = 'bg-[#EAF4FB]',
  iconColor = 'text-[#173B72]',
  accentColor = '#2D82C4',
  id,
  onClick
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick();
            }
          : undefined
      }
      className={`relative bg-white rounded-2xl border border-[#E4E7EC] p-5 overflow-hidden transition-all duration-200 hover:shadow-[0_8px_24px_rgba(18,52,95,0.08)] hover:border-[#D0D5DD] ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1.5">
          <p className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider truncate">
            {label}
          </p>
          <p className="text-2xl font-bold text-[#12345F] tracking-tight tabular-nums">{value}</p>
        </div>
        <div
          className={`p-2.5 rounded-xl ${iconBgColor} ${iconColor} flex-shrink-0 ring-1 ring-black/[0.03]`}
        >
          {icon}
        </div>
      </div>

      {change && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          <span
            className={`inline-flex items-center font-semibold px-1.5 py-0.5 rounded-md ${
              isPositive ? 'bg-[#EAF6E7] text-[#2E9B4B]' : 'bg-[#FEE4E2] text-[#D64545]'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {change}
          </span>
          <span className="text-[#98A2B3]">{period}</span>
        </div>
      )}
    </div>
  );
};
