import React from 'react';
import logoSrc from '../../assets/logo.png';

interface LeanBloomLogoProps {
  collapsed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
  theme?: 'light' | 'dark';
}

export const LeanBloomLogo: React.FC<LeanBloomLogoProps> = ({
  collapsed = false,
  size = 'md',
  showSubtitle = false,
  subtitle = 'Admin',
  className = '',
  theme = 'light'
}) => {
  const heightClass = {
    sm: collapsed ? 'h-8' : 'h-9',
    md: collapsed ? 'h-9' : 'h-11',
    lg: collapsed ? 'h-11' : 'h-14'
  }[size];

  const widthClass = collapsed
    ? {
        sm: 'w-8',
        md: 'w-9',
        lg: 'w-11'
      }[size]
    : {
        sm: 'w-auto max-w-[128px]',
        md: 'w-auto max-w-[156px]',
        lg: 'w-auto max-w-[200px]'
      }[size];

  return (
    <div className={`flex items-center gap-2 min-w-0 ${className}`} id="leanbloom-brand-logo">
      <img
        src={logoSrc}
        alt="LeanBloom"
        className={`${heightClass} ${widthClass} object-contain object-left flex-shrink-0`}
      />
      {!collapsed && showSubtitle && (
        <span
          className={`text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded leading-none flex-shrink-0 ${
            theme === 'dark'
              ? 'text-sky-200 bg-white/10'
              : 'text-[#2D82C4] bg-[#EAF4FB]'
          }`}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
};
