/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { initHeroMotion } from '../motion/hero';

export function Hero() {
  const containerRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cleanup = initHeroMotion(
      containerRef.current,
      imageRef.current,
      textRef.current
    );
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full h-[100dvh] bg-[#000000] flex items-center justify-center px-6 lg:px-16 pt-12 pb-12 overflow-hidden"
    >
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center h-full">
        {/* Left column: Hero Image */}
        <div className="lg:col-span-5 flex items-center justify-center z-10 w-full">
          <div className="w-full max-w-[94vw] lg:max-w-none aspect-[4/5] rounded-[24px] border border-[rgba(196,195,182,0.25)] shadow-[0_24px_60px_rgba(0,0,0,0.5)] overflow-hidden max-h-[56dvh] lg:max-h-[80dvh] flex items-center justify-center mx-auto">
            <img
              ref={imageRef}
              src="/hero-1400.webp"
              srcSet="/hero-800.webp 800w, /hero-1400.webp 1400w"
              sizes="(max-width: 767px) 94vw, 44vw"
              width={1400}
              height={1738}
              fetchPriority="high"
              decoding="async"
              alt="An oil painting of a young girl walking along a dirt path, carrying her sleeping baby brother on her back in a patterned cloth."
              className="w-full h-full object-cover object-[50%_30%]"
            />
          </div>
        </div>

        {/* Right column: Typography (headline and subline, buttons removed) */}
        <div ref={textRef} className="lg:col-span-7 flex flex-col justify-center space-y-6 lg:space-y-8 z-10">
          <h1 className="font-serif text-[clamp(2.75rem,5.5vw,5.25rem)] leading-[1.02] font-normal tracking-tight text-[#E7E5E4] text-balance">
            He&apos;s Not Heavy, <br />
            <span className="italic font-medium text-[#C4C3B6]">He&apos;s My Brother</span>
          </h1>

          <p className="font-serif text-lg lg:text-xl text-[#C4C3B6] max-w-xl leading-relaxed font-light">
            A little love can make a heavy load feel lighter.
          </p>
        </div>
      </div>
    </section>
  );
}
