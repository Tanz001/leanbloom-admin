import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = ''
}) => {
  const normalized = status.toLowerCase();

  let styles = 'bg-[#F2F4F7] text-[#344054] ring-1 ring-[#D0D5DD]';
  let dotColor = 'bg-[#667085]';

  if (
    normalized === 'active' ||
    normalized === 'completed' ||
    normalized === 'paid' ||
    normalized === 'in stock' ||
    normalized === 'delivered'
  ) {
    styles = 'bg-[#EAF6E7] text-[#2E9B4B] ring-1 ring-[#6DBE45]/40';
    dotColor = 'bg-[#2E9B4B]';
  } else if (
    normalized === 'pending' ||
    normalized === 'processing' ||
    normalized === 'pending intake' ||
    normalized === 'pending lab' ||
    normalized === 'compounding' ||
    normalized === 'in transit' ||
    normalized === 'fulfillment queue' ||
    normalized === 'pending verification'
  ) {
    styles = 'bg-[#FEF6EE] text-[#B54708] ring-1 ring-[#F79009]/40';
    dotColor = 'bg-[#D99A18]';
  } else if (
    normalized === 'suspended' ||
    normalized === 'cancelled' ||
    normalized === 'failed' ||
    normalized === 'critical'
  ) {
    styles = 'bg-[#FEF3F2] text-[#B42318] ring-1 ring-[#F04438]/40';
    dotColor = 'bg-[#D64545]';
  } else if (normalized === 'refunded' || normalized === 'archived' || normalized === 'inactive') {
    styles = 'bg-[#F8F9FC] text-[#475467] ring-1 ring-[#D0D5DD]';
    dotColor = 'bg-[#98A2B3]';
  } else if (normalized === 'warning') {
    styles = 'bg-[#FFFAEB] text-[#B54708] ring-1 ring-[#FEDF89]';
    dotColor = 'bg-[#F79009]';
  } else if (normalized === 'information') {
    styles = 'bg-[#EAF4FB] text-[#173B72] ring-1 ring-[#2D82C4]/30';
    dotColor = 'bg-[#2D82C4]';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap select-none ${padding} ${styles} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};
