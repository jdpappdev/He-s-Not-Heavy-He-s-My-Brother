/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { initHeroMotion } from '../motion/hero';
import Lenis from 'lenis';
import { getChapterScrollY } from '../motion/cardStack';
import { getLenis } from '../lib/lenis';

export function Hero() {
  const containerRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  const sublineRef = useRef<HTMLParagraphElement | null>(null);
  const buttonWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const lines = [line1Ref.current, line2Ref.current].filter(
      (el): el is HTMLSpanElement => el !== null
    );
    const cleanup = initHeroMotion(
      containerRef.current,
      imageRef.current,
      lines,
      sublineRef.current,
      buttonWrapperRef.current
    );
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const scrollToStack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const win = typeof window !== 'undefined' ? (window as unknown as { __lenis?: Lenis }) : undefined;
    const lenis = win?.__lenis || getLenis();

    if (prefersReducedMotion) {
      const firstCard =
        document.querySelector<HTMLElement>('#card-stack [data-card-id="1"]') ||
        document.querySelector<HTMLElement>('#card-stack > div > div');
      const header = document.querySelector<HTMLElement>('header');
      const headerHeight = header ? header.getBoundingClientRect().height : 52;
      const cardTop = firstCard ? firstCard.getBoundingClientRect().top + window.scrollY : 0;
      const targetY = Math.max(0, cardTop - headerHeight - 16);

      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(targetY, { immediate: true });
      } else {
        window.scrollTo({ top: targetY, behavior: 'instant' });
      }
      return;
    }

    const y = getChapterScrollY(0);
    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(y, { duration: 1.6, easing: easeInOutCubic, lock: true });
    } else {
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full min-h-[100dvh] bg-[#000000] flex items-center justify-center px-[clamp(1rem,3vw,3rem)] py-[clamp(2rem,5vh,4rem)] overflow-hidden"
    >
      <div className="max-w-7xl w-full mx-auto hero-layout items-center h-full">
        {/* Left column: Hero Image */}
        <div className="flex items-center justify-center z-10 w-full mb-8 landscape:md:mb-0">
          <div className="w-full max-w-[min(92vw,480px)] landscape:md:max-w-none aspect-[4/5] rounded-[24px] border border-[rgba(196,195,182,0.25)] shadow-[0_24px_60px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center mx-auto">
            <img
              ref={imageRef}
              src="/hero-1400.webp"
              srcSet="/hero-800.webp 800w, /hero-1400.webp 1400w"
              sizes="(max-width: 767px) 92vw, 44vw"
              width={1400}
              height={1738}
              fetchPriority="high"
              decoding="async"
              alt="An oil painting of a young girl walking along a dirt path, carrying her sleeping baby brother on her back in a patterned cloth."
              className="w-full h-full object-cover object-[50%_30%]"
            />
          </div>
        </div>

        {/* Right column: Typography with Read the story button */}
        <div className="flex flex-col justify-center space-y-[clamp(1rem,2vw,2rem)] z-10">
          <h1 className="font-serif text-[clamp(2.25rem,4.5vw,5.25rem)] leading-[1.02] font-normal tracking-tight text-[#E7E5E4] text-balance">
            <span ref={line1Ref} className="block will-change-[transform,opacity]">
              He&apos;s Not Heavy,
            </span>
            <span ref={line2Ref} className="block italic font-medium text-[#C4C3B6] will-change-[transform,opacity]">
              He&apos;s My Brother
            </span>
          </h1>

          <p
            ref={sublineRef}
            className="font-serif text-[clamp(1.05rem,1.4vw,1.4rem)] text-[#C4C3B6] max-w-xl leading-relaxed font-light will-change-[transform,opacity]"
          >
            A little love can make a heavy load feel lighter.
          </p>

          <div ref={buttonWrapperRef} className="pt-2 will-change-[transform,opacity]">
            <a
              href="#card-stack"
              onClick={scrollToStack}
              className="hero-cta-btn"
            >
              Read the story
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
