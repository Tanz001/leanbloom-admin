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
  id,
  onClick
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-xl border border-[#E4E7EC] p-5 shadow-[0_1px_3px_rgba(16,24,40,0.05)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(23,59,114,0.06)] hover:border-[#D0D5DD] ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#667085] uppercase tracking-wider">{label}</p>
          <p className="text-2xl lg:text-[26px] font-bold text-[#172033] tracking-tight">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${iconBgColor} ${iconColor} flex-shrink-0`}>
          {icon}
        </div>
      </div>

      {change && (
        <div className="mt-3.5 flex items-center gap-1.5 text-xs">
          <span
            className={`inline-flex items-center font-semibold px-1.5 py-0.5 rounded ${
              isPositive
                ? 'bg-[#EAF6E7] text-[#2E9B4B]'
                : 'bg-[#FEE4E2] text-[#D64545]'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 inline" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 inline" />
            )}
            {change}
          </span>
          <span className="text-[#667085] text-xs">{period}</span>
        </div>
      )}
    </div>
  );
};
