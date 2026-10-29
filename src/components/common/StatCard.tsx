import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  id?: string;
  onClick?: () => void;
  accent?: 'navy' | 'blue' | 'green';
}

const ACCENTS = {
  navy: {
    iconBg: 'bg-[#E8EEF5]',
    iconColor: 'text-[#12345F]',
    bar: 'from-[#12345F] to-[#2D82C4]',
  },
  blue: {
    iconBg: 'bg-[#EAF4FB]',
    iconColor: 'text-[#2D82C4]',
    bar: 'from-[#2D82C4] to-[#5BA3D9]',
  },
  green: {
    iconBg: 'bg-[#EAF6E7]',
    iconColor: 'text-[#3A8F36]',
    bar: 'from-[#4FAF4A] to-[#8BC34A]',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  isPositive = true,
  icon,
  id,
  onClick,
  accent = 'navy',
}) => {
  const a = ACCENTS[accent];

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
      className={`group relative bg-white rounded-2xl border border-[#E2E8F0] p-5 overflow-hidden transition-all duration-200 shadow-[0_1px_2px_rgba(15,28,46,0.04)] ${
        onClick
          ? 'cursor-pointer hover:border-[#2D82C4]/40 hover:shadow-[0_10px_30px_rgba(18,52,95,0.08)] hover:-translate-y-0.5'
          : ''
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${a.bar} opacity-90 group-hover:opacity-100 transition-opacity`}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-[#6B7C8F] tracking-wide uppercase truncate">
            {label}
          </p>
          <p className="mt-2 font-display text-[1.65rem] font-semibold text-[#0B2440] tracking-tight tabular-nums leading-none">
            {value}
          </p>
        </div>
        <div
          className={`p-2.5 rounded-xl ${a.iconBg} ${a.iconColor} flex-shrink-0 transition-transform duration-200 group-hover:scale-105`}
        >
          {icon}
        </div>
      </div>

      {change && (
        <div className="mt-4 flex items-center gap-1.5 text-[13px]">
          <span
            className={`inline-flex items-center gap-0.5 font-semibold ${
              isPositive ? 'text-[#3A8F36]' : 'text-[#B91C1C]'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {change}
          </span>
        </div>
      )}
    </div>
  );
};
