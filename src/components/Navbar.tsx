/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Lenis from 'lenis';

// Hook into Lenis to automatically track the active Lenis instance created in the app
let globalLenis: Lenis | null = null;
if (typeof window !== 'undefined') {
  const proto = Lenis.prototype as unknown as Record<string, (...args: unknown[]) => unknown>;
  const origOn = proto.on;
  proto.on = function (this: Lenis, ...args: unknown[]) {
    globalLenis = this;
    (window as unknown as { __lenis?: Lenis }).__lenis = this;
    return origOn.apply(this, args);
  };
  const origDestroy = proto.destroy;
  proto.destroy = function (this: Lenis) {
    if (globalLenis === this) {
      globalLenis = null;
    }
    const win = window as unknown as { __lenis?: Lenis };
    if (win.__lenis === this) {
      delete win.__lenis;
    }
    return origDestroy.apply(this);
  };
}

export interface NavbarProps {
  onOpenAbout?: (opener: HTMLElement) => void;
}

export function Navbar({ onOpenAbout }: NavbarProps) {
  const scrollToTop = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    const win = typeof window !== 'undefined' ? (window as unknown as { __lenis?: Lenis }) : undefined;
    const lenis = globalLenis || win?.__lenis;

    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(0, { immediate: false });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      role="banner"
      onClick={scrollToTop}
      className="fixed z-[100] pointer-events-auto h-[52px] rounded-full flex items-center justify-between px-[clamp(16px,2.5vw,28px)] select-none cursor-pointer transition-all duration-200"
      style={{
        top: 'calc(clamp(12px, 2svh, 24px) + env(safe-area-inset-top, 0px))',
        left: 'calc(clamp(12px, 3vw, 40px) + env(safe-area-inset-left, 0px))',
        right: 'calc(clamp(12px, 3vw, 40px) + env(safe-area-inset-right, 0px))',
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(231, 229, 228, 0.12)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
      }}
    >
      <button
        type="button"
        onClick={scrollToTop}
        className="inline-flex items-center gap-[clamp(8px,1vw,12px)] text-[#E7E5E4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E7E5E4] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-full"
        aria-label="Scroll to top: A LITTLE LOVE"
        style={{
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.8), 0 0 1px rgba(0, 0, 0, 0.9)',
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.75))',
        }}
      >
        {/* Inline SVG mark (simple, 20px, Folio Bone) */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="w-5 h-5 shrink-0 text-[#E7E5E4]"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span
          className="font-serif font-medium uppercase text-[#E7E5E4] whitespace-nowrap"
          style={{
            fontSize: 'clamp(12px, 1.1vw, 14px)',
            letterSpacing: '0.22em',
          }}
        >
          A LITTLE LOVE
        </span>
      </button>

      {/* ABOUT pill button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenAbout?.(e.currentTarget);
        }}
        aria-label="About this story"
        aria-haspopup="dialog"
        className="min-h-[44px] min-w-[44px] px-[clamp(10px,1.2vw,16px)] py-1.5 rounded-full inline-flex items-center justify-center font-serif font-medium uppercase text-[#E7E5E4] hover:text-white hover:bg-white/10 active:bg-white/15 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E7E5E4] focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer"
        style={{
          fontSize: 'clamp(12px, 1.1vw, 14px)',
          letterSpacing: '0.22em',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.8), 0 0 1px rgba(0, 0, 0, 0.9)',
        }}
      >
        ABOUT
      </button>
    </header>
  );
}
