/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  title,
  paragraphs,
  buttonLabel,
  mailtoHref,
} from '../content/about';
import { getLenis } from '../lib/lenis';

export interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opener?: HTMLElement | null;
}

export function AboutDialog({ isOpen, onClose, opener }: AboutDialogProps) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isAnimIn, setIsAnimIn] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // Keep track of opener when opening
  useEffect(() => {
    if (isOpen) {
      openerRef.current = opener ?? (document.activeElement as HTMLElement | null);
    }
  }, [isOpen, opener]);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Handle open/close animations
  useEffect(() => {
    let animTimer: number | undefined;

    if (isOpen) {
      setIsRendered(true);
      if (prefersReducedMotion) {
        setIsAnimIn(true);
      } else {
        // Trigger transition in the next microtask/frame
        animTimer = window.setTimeout(() => {
          setIsAnimIn(true);
        }, 20);
      }
    } else {
      setIsAnimIn(false);
      const exitDuration = prefersReducedMotion ? 0 : 200;
      animTimer = window.setTimeout(() => {
        setIsRendered(false);
        // Return focus to opener
        if (openerRef.current && typeof openerRef.current.focus === 'function') {
          openerRef.current.focus();
        }
      }, exitDuration);
    }

    return () => {
      if (animTimer) clearTimeout(animTimer);
    };
  }, [isOpen, prefersReducedMotion]);

  // Scroll lock and layout-shift prevention
  useEffect(() => {
    if (!isOpen) return;

    const lenis = getLenis();
    if (lenis && typeof lenis.stop === 'function') {
      lenis.stop();
    }

    // Measure scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      const activeLenis = getLenis();
      if (activeLenis && typeof activeLenis.start === 'function') {
        activeLenis.start();
      }
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.paddingRight = prevBodyPaddingRight;
    };
  }, [isOpen]);

  // Focus management on open
  useEffect(() => {
    if (isRendered && isAnimIn) {
      // Focus close button or first focusable element
      closeBtnRef.current?.focus();
    }
  }, [isRendered, isAnimIn]);

  // Esc key closes dialog
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Trap focus within the dialog card
  const handleCardKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Tab') {
        if (!cardRef.current) return;
        const focusable = cardRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    []
  );

  if (!isRendered) {
    return null;
  }

  const italicTarget = 'I hope it reaches your heart the way it reached mine.';

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.60)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        opacity: isAnimIn ? 1 : 0,
        transition: prefersReducedMotion ? 'none' : 'opacity 200ms ease-out',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-dialog-title"
        ref={cardRef}
        tabIndex={-1}
        onKeyDown={handleCardKeyDown}
        className="relative flex flex-col w-[min(92vw,520px)] max-h-[calc(100svh-2*clamp(16px,4svh,48px))] rounded-[24px] bg-[#E7E5E4] text-[#000000] p-[clamp(24px,4vw,40px)] shadow-[0_24px_60px_rgba(0,0,0,0.45)] overflow-y-auto overscroll-contain outline-none"
        style={{
          opacity: isAnimIn ? 1 : 0,
          transform: prefersReducedMotion ? 'none' : isAnimIn ? 'scale(1)' : 'scale(0.96)',
          transition: prefersReducedMotion
            ? 'none'
            : 'opacity 200ms ease-out, transform 200ms ease-out',
          willChange: 'transform, opacity',
        }}
      >
        {/* Close (X) button top-right, 44px target */}
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-[clamp(16px,3vw,24px)] right-[clamp(16px,3vw,24px)] w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-black/75 hover:text-black hover:bg-black/10 active:bg-black/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black z-10 cursor-pointer"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Dialog Title in Newsreader */}
        <h2
          id="about-dialog-title"
          className="font-serif font-normal text-black tracking-tight leading-[1.1] text-[clamp(1.5rem,3vw,2rem)] pr-12 mb-[clamp(16px,2.5vw,24px)]"
        >
          {title}
        </h2>

        {/* Paragraphs */}
        <div className="flex flex-col space-y-[clamp(14px,2vw,18px)] mb-[clamp(24px,3.5vw,32px)]">
          {paragraphs.map((p, idx) => {
            if (p.includes(italicTarget)) {
              const parts = p.split(italicTarget);
              return (
                <p
                  key={idx}
                  className="font-serif font-light text-[clamp(17px,1.2vw,19px)] leading-[1.55] text-black"
                >
                  {parts[0]}
                  <em className="italic">{italicTarget}</em>
                  {parts[1]}
                </p>
              );
            }
            return (
              <p
                key={idx}
                className="font-serif font-light text-[clamp(17px,1.2vw,19px)] leading-[1.55] text-black"
              >
                {p}
              </p>
            );
          })}
        </div>

        {/* Action: Email me CTA */}
        <div className="pt-1">
          <a href={mailtoHref} className="hero-cta-btn">
            {buttonLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
