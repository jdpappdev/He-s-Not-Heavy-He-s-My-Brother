/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface PainterlyPanelProps {
  variant?: 'hero' | 'card-1' | 'card-2' | 'card-3';
  className?: string;
  imageProp?: string;
}

export function PainterlyPanel({ variant = 'hero', className = '', imageProp }: PainterlyPanelProps) {
  const variantClass = {
    hero: 'painterly-panel',
    'card-1': 'painterly-card-1',
    'card-2': 'painterly-card-2',
    'card-3': 'painterly-card-3',
  }[variant];

  return (
    <div className={`relative overflow-hidden rounded-[20px] ${variantClass} ${className} shadow-2xl border border-black/10 flex items-center justify-center group`}>
      {/* If user provides a single image prop later, render it with fallback */}
      {imageProp ? (
        <img
          src={imageProp}
          alt="Oil painting placeholder"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <filter id={`turbulence-${variant}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#turbulence-${variant})`} />
          </svg>
        </div>
      )}

      {/* Painterly vignette and brushstroke atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

      {/* Subtle label indicating oil painting ready slot */}
      {!imageProp && (
        <div className="z-10 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-[#E7E5E4] text-xs font-serif tracking-wide italic shadow-lg">
          Oil painting placeholder panel
        </div>
      )}
    </div>
  );
}
