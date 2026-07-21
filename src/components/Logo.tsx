import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  light?: boolean; // if true, text/bars are styled for dark bg. if false, for light bg.
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical';
}

export default function Logo({
  className = '',
  showText = true,
  light = false,
  size = 'md',
  layout = 'horizontal',
}: LogoProps) {
  // Determine dimensions based on size
  const iconSizeClass = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }[size];

  const textSizes = {
    sm: { main: 'text-[11px]', sub: 'text-[9px]' },
    md: { main: 'text-[14px]', sub: 'text-[11px]' },
    lg: { main: 'text-[22px]', sub: 'text-[17px]' },
    xl: { main: 'text-[34px]', sub: 'text-[26px]' },
  }[size];

  const barColor = light ? '#ffffff' : '#d95f35';
  const accentColor = light ? '#f08a5d' : '#d95f35';
  const mainTextColor = light ? '#ffffff' : '#171717';
  const subTextColor = light ? '#f2f2f0' : '#171717';

  return (
    <div className={`flex ${layout === 'horizontal' ? 'flex-row items-center gap-3' : 'flex-col items-center gap-3'} ${className}`}>
      {/* Dynamic SVG Logo matching the uploaded diagram */}
      <svg
        className={iconSizeClass}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Four vertical bars kept below the trend line for clear separation. */}
        <rect x="19" y="58" width="10" height="14" rx="1.5" fill={barColor} />
        <rect x="34" y="48" width="10" height="24" rx="1.5" fill={barColor} />
        <rect x="49" y="40" width="10" height="32" rx="1.5" fill={barColor} />
        <rect x="64" y="34" width="10" height="38" rx="1.5" fill={barColor} />

        {/* Trend arrow */}
        <path
          d="M 15 47 L 34 28 L 51 36 L 76 14"
          fill="none"
          stroke={accentColor}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Arrowhead */}
        <path
          d="M 66 10 L 83 8 L 81 25 Z"
          fill={accentColor}
          stroke={accentColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      {/* Two-line Text Label */}
      {showText && (
        <div className={`flex flex-col font-serif font-semibold tracking-[0.16em] uppercase ${layout === 'horizontal' ? 'text-left' : 'text-center'} leading-none`}>
          <span className={`${textSizes.main}`} style={{ color: mainTextColor }}>
            Ultimate
          </span>
          <span className={`${textSizes.sub} mt-1 tracking-[0.18em]`} style={{ color: subTextColor }}>
            Life Advisor
          </span>
        </div>
      )}
    </div>
  );
}
