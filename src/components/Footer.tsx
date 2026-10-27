/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface FooterProps {
  onOpenAbout: (opener: HTMLElement) => void;
}

export function Footer({ onOpenAbout }: FooterProps) {
  return (
    <footer
      className="relative w-full z-10 flex flex-col items-center justify-center text-center px-4 pb-[clamp(32px,6vh,64px)]"
      style={{ paddingTop: '12svh' }}
    >
      <button
        type="button"
        onClick={(e) => onOpenAbout(e.currentTarget)}
        aria-haspopup="dialog"
        className="min-h-[44px] px-4 py-2 inline-flex items-center justify-center font-serif text-[#C4C3B6] hover:text-[#E7E5E4] transition-colors duration-150 text-[clamp(14px,1vw,16px)] tracking-wider underline-offset-8 hover:underline cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E7E5E4]"
      >
        About this story
      </button>
      <p className="mt-3 font-serif text-[clamp(11px,0.85vw,13px)] text-[#595855] tracking-widest uppercase">
        He’s Not Heavy, He’s My Brother · Crafted with care by Jade
      </p>
    </footer>
  );
}
