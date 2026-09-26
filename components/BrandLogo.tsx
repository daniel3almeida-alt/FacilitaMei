'use client';

import React from 'react';

interface BrandLogoProps {
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export function BrandLogo({
  theme = 'light',
  size = 'md',
  showSubtitle = true,
  className = '',
}: BrandLogoProps) {
  const iconSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const titleSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const subtitleSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-[12px]' : 'text-[10px]';

  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon Squircle with dual directional arrows representing PJ & PF sync */}
      <div
        className={`relative ${iconSize} rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-600 flex items-center justify-center shadow-sm shrink-0 overflow-hidden ${
          isDark ? 'ring-1 ring-emerald-400/40 shadow-emerald-950/40' : 'ring-1 ring-black/5'
        }`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="w-5/6 h-5/6 text-white drop-shadow-xs"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Left Arrow Up (PJ -> PF) */}
          <line x1="10" y1="23" x2="10" y2="9" />
          <polyline points="5.5 13.5 10 9 14.5 13.5" />

          {/* Right Arrow Down (PF <- PJ) */}
          <line x1="22" y1="9" x2="22" y2="23" />
          <polyline points="17.5 18.5 22 23 26.5 18.5" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <div className={`font-extrabold tracking-tight ${titleSize} ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Facilita<span className="text-emerald-500">Mei</span>
        </div>
        {showSubtitle && (
          <span
            className={`font-semibold tracking-[0.22em] uppercase mt-0.5 ${subtitleSize} ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            GESTÃO PJ & PF
          </span>
        )}
      </div>
    </div>
  );
}
