import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/** In-page title using LeanBloom display type + logo accent bar */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 ${className}`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2.5 mb-2">
          <span
            className="h-1.5 w-8 rounded-full bg-lb-gradient shadow-sm"
            aria-hidden
          />
          <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#2D82C4]">
            LeanBloom
          </span>
        </div>
        <h1 className="font-display text-[1.85rem] sm:text-[2.15rem] font-semibold tracking-tight text-[#12345F] leading-[1.1]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-[#5B6B7C] max-w-xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
