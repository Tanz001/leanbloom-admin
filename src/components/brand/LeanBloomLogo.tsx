import React from 'react';

interface LeanBloomLogoProps {
  collapsed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
}

export const LeanBloomLogo: React.FC<LeanBloomLogoProps> = ({
  collapsed = false,
  size = 'md',
  showSubtitle = true,
  className = '',
  theme = 'light'
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  }[size];

  const titleSize = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`} id="leanbloom-brand-logo">
      {/* Precision Vector Emblem: Cross + Bloom Leaf Petals */}
      <div className={`relative ${iconDimensions} flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#12345F] to-[#173B72] p-1.5 shadow-sm ring-1 ring-white/20`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Healthcare Cross base stem in healthcare blue */}
          <rect x="42" y="16" width="16" height="68" rx="8" fill="#2D82C4" />
          <rect x="16" y="42" width="68" height="16" rx="8" fill="#3A91D8" opacity="0.9" />

          {/* Flourishing natural green bloom leaf (top-right) */}
          <path
            d="M50 46 C50 24 72 20 84 20 C84 32 80 54 58 54 Z"
            fill="#4FAF4A"
          />

          {/* Organic vitality leaf (bottom-left) */}
          <path
            d="M50 54 C50 76 28 80 16 80 C16 68 20 46 42 46 Z"
            fill="#6DBE45"
          />

          {/* Central core node */}
          <circle cx="50" cy="50" r="7" fill="#FFFFFF" />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-extrabold tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-[#173B72]'
              } ${titleSize} leading-none font-sans`}
            >
              LEAN<span className="text-[#4FAF4A]">BLOOM</span>
            </span>
          </div>
          {showSubtitle && (
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#2D82C4] bg-[#EAF4FB] px-1.5 py-0.5 rounded leading-none">
                Master Admin
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
