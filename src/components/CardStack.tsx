/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { initCardStackMotion } from '../motion/cardStack';
import { initClosingReveal } from '../motion/closingReveal';
import { HeroSilhouette } from './HeroSilhouette';
import { CARDS_CONTENT } from '../content/cards';
import { HEADER_TITLE } from '../content/site';
import { COLORS } from '../tokens';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function CardStack() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stackWrapperRef = useRef<HTMLDivElement | null>(null);
  const cardRef1 = useRef<HTMLDivElement | null>(null);
  const cardRef2 = useRef<HTMLDivElement | null>(null);
  const cardRef3 = useRef<HTMLDivElement | null>(null);
  const cardRef4 = useRef<HTMLDivElement | null>(null);
  const cardRef5 = useRef<HTMLDivElement | null>(null);
  const lineRef1 = useRef<HTMLSpanElement | null>(null);
  const lineRef2 = useRef<HTMLSpanElement | null>(null);
  const lineRef3 = useRef<HTMLSpanElement | null>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [overflowState, setOverflowState] = useState<{ [id: number]: boolean }>({});
  const scrollContainerRefs = useRef<{ [id: number]: HTMLDivElement | null }>({});

  const checkOverflow = (id: number) => {
    const el = scrollContainerRefs.current[id];
    if (!el) return;
    const { scrollHeight, clientHeight, scrollTop } = el;
    const hasOverflow = scrollHeight > clientHeight + 2;
    const isNotAtEnd = scrollTop + clientHeight < scrollHeight - 4;
    setOverflowState(prev => ({ ...prev, [id]: hasOverflow && isNotAtEnd }));
  };

  useEffect(() => {
    CARDS_CONTENT.forEach(card => {
      checkOverflow(card.id);
    });
    const handleResize = () => {
      CARDS_CONTENT.forEach(card => checkOverflow(card.id));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(reducedMotionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    const updateStageHeight = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--stage-h', `${h}px`);
      ScrollTrigger.refresh();
      CARDS_CONTENT.forEach(card => checkOverflow(card.id));
    };

    updateStageHeight();
    window.addEventListener('resize', updateStageHeight);
    window.addEventListener('orientationchange', updateStageHeight);
    window.visualViewport?.addEventListener('resize', updateStageHeight);
    document.fonts?.ready.then(updateStageHeight);

    const cardRefs = [
      cardRef1.current,
      cardRef2.current,
      cardRef3.current,
      cardRef4.current,
      cardRef5.current,
    ].filter((el): el is HTMLDivElement => el !== null);

    const motionResult = initCardStackMotion(containerRef.current, cardRefs, stackWrapperRef.current);
    const closingRevealResult = initClosingReveal(cardRef5.current, [
      lineRef1.current,
      lineRef2.current,
      lineRef3.current,
    ]);

    return () => {
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', updateStageHeight);
      window.removeEventListener('orientationchange', updateStageHeight);
      window.visualViewport?.removeEventListener('resize', updateStageHeight);
      if (motionResult) {
        motionResult.cleanup();
      }
      if (closingRevealResult) {
        closingRevealResult.cleanup();
      }
    };
  }, []);

  if (prefersReducedMotion) {
    return (
      <section id="card-stack" className="relative w-full bg-black py-12 flex flex-col items-center">
        <div className="w-[min(92vw,1040px)] md:w-[min(72vw,1040px)] px-4 flex flex-col space-y-8">
          {CARDS_CONTENT.map((card) => {
            return (
              <div
                key={card.id}
                data-card-id={card.id}
                className={`w-[min(92vw,1040px)] md:w-[min(72vw,1040px)] h-full max-h-[calc(100svh-2*clamp(16px,4svh,48px))] rounded-[24px] ${card.bgClass} ${card.textClass} p-[clamp(24px,4vw,60px)] flex flex-col shadow-[0_24px_60px_rgba(0,0,0,0.45)] border border-black/10 mx-auto`}
              >
                <div className="card-grid h-full">
                  <div className="flex flex-col shrink-0 md:justify-start md:pr-4">
                    <div className="flex flex-col md:flex-row-reverse md:justify-between items-start md:items-center gap-[clamp(12px,1.5vw,24px)] pb-3">
                      <span className={`text-xs uppercase tracking-widest font-serif ${card.mutedTextClass} whitespace-nowrap shrink-0`}>
                        0{card.id}/04
                      </span>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs uppercase tracking-widest font-serif ${card.tagBgClass} whitespace-nowrap shrink-0`}>
                        {card.subtitle}
                      </div>
                    </div>
                    <div className="pt-1 pb-4 border-b border-current/15">
                      <h2 className="font-serif font-normal tracking-tight text-[clamp(1.5rem,2.5vw,2.75rem)] leading-[1.05] text-balance">
                        {card.title}
                      </h2>
                    </div>
                  </div>

                  <div 
                    ref={(el) => { scrollContainerRefs.current[card.id] = el; }}
                    onScroll={() => checkOverflow(card.id)}
                    className="overflow-y-auto overscroll-behavior-contain h-full flex flex-col justify-start pt-4 md:pt-0 md:pl-2 pr-4 text-left relative"
                  >
                    <div className="w-full pb-4 landscape-body-text">
                      {card.paragraphs.map((p, pIndex) => {
                        const isDividerAfter = card.id === 3 && pIndex === 1;
                        return (
                          <React.Fragment key={pIndex}>
                            {p.type === 'pull' ? (
                              <blockquote
                                className={`font-serif italic font-light ${card.textClass} border-l-2 border-current pl-4 my-[0.9em] opacity-95 text-[clamp(1.125rem,1.8vw,1.5rem)]`}
                                dangerouslySetInnerHTML={{ __html: p.text }}
                              />
                            ) : p.type === 'ref' ? (
                              <p
                                className={`font-sans text-[clamp(0.75rem,0.9vw,0.875rem)] uppercase tracking-widest ${card.mutedTextClass} pt-1 pb-2 opacity-85`}
                              >
                                {p.text}
                              </p>
                            ) : p.type === 'final' ? (
                              <p
                                className={`font-serif font-medium ${card.textClass} my-[0.7em] text-[clamp(1.125rem,1.8vw,1.5rem)]`}
                                dangerouslySetInnerHTML={{ __html: p.text }}
                              />
                            ) : (
                              <p
                                className={`font-serif font-light mb-[0.7em]`}
                                dangerouslySetInnerHTML={{ __html: p.text }}
                              />
                            )}
                            {isDividerAfter && (
                              <div className="w-full h-[1px] bg-[#E7E5E4]/25 my-[clamp(12px,2svh,24px)]" />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                    {overflowState[card.id] && (
                      <div className="pointer-events-none sticky bottom-0 h-8 bg-gradient-to-t from-current/15 to-transparent mt-auto" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Closing panel as a normal block */}
          <div 
            className="closing-card-container relative overflow-clip rounded-[24px] text-[#E7E5E4] p-0 flex flex-col items-start justify-start text-left border border-[rgba(196,195,182,0.2)] shadow-[0_24px_60px_rgba(0,0,0,0.45)] w-[min(92vw,1040px)] md:w-[min(72vw,1040px)] h-full max-h-[calc(100svh-2*clamp(16px,4svh,48px))] mx-auto"
          >
            <img 
              src="/closing-texture.webp" 
              alt="" 
              aria-hidden 
              decoding="async" 
              className="absolute inset-0 w-full h-full object-cover z-0 object-[15%_20%]" 
            />
            <div 
              className="closing-text-block absolute z-20 flex flex-col items-start justify-start text-left"
              style={{
                textShadow: 'none',
              }}
            >
              <h2 
                className="closing-card-statement font-serif italic font-normal tracking-[-0.01em] leading-[1.05] text-[clamp(2.25rem,calc(4.2vw+1.2svh),6rem)] m-0 p-0"
                style={{ textShadow: 'none' }}
              >
                <span className="block text-raw-umber" style={{ color: COLORS.rawUmber }}>
                  A little love
                </span>
                <span className="block closing-line-2">
                  <span className="inline-block text-raw-umber whitespace-nowrap" style={{ color: COLORS.rawUmber }}>
                    makes the load
                  </span>
                  {' '}
                  <span className="inline-block text-lamp-black" style={{ color: COLORS.lampBlack }}>
                    lighter.
                  </span>
                </span>
              </h2>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="card-stack"
      ref={containerRef}
      style={{ height: 'var(--stage-h, 100vh)' }}
      className="relative w-full bg-black py-0 flex flex-col items-center overflow-hidden"
    >
      <HeroSilhouette />

      {/* Pinned stage: grid centering wrapper using --stage-h */}
      <div 
        className="w-full grid place-items-center z-10 px-4 md:px-8 overflow-hidden"
        style={{ height: 'var(--stage-h, 100vh)' }}
      >
        <div 
          ref={stackWrapperRef}
          className="relative grid place-items-center my-auto overflow-visible w-[min(92vw,1040px)] md:w-[min(72vw,1040px)] max-h-[calc(100svh-2*clamp(16px,4svh,48px))]"
        >
          {CARDS_CONTENT.map((card, index) => {
            const cardRef =
              index === 0
                ? cardRef1
                : index === 1
                ? cardRef2
                : index === 2
                ? cardRef3
                : cardRef4;

            return (
              <div
                key={card.id}
                ref={cardRef}
                style={{
                  gridArea: '1 / 1',
                  zIndex: index + 1,
                  transformOrigin: 'top center',
                }}
                data-card-id={card.id}
                className={`w-full h-full max-h-[calc(100svh-2*clamp(16px,4svh,48px))] rounded-[24px] ${card.bgClass} ${card.textClass} p-[clamp(24px,4vw,60px)] flex flex-col shadow-[0_24px_60px_rgba(0,0,0,0.45)] border border-black/10 transition-shadow duration-300 card-content-box`}
              >
                <div className="card-grid h-full">
                  {/* Left column / Top header area */}
                  <div className="flex flex-col shrink-0 md:justify-start md:pr-4">
                    <div className="flex flex-col md:flex-row-reverse md:justify-between items-start md:items-center gap-[clamp(12px,1.5vw,24px)] pb-3">
                      <span className={`text-xs uppercase tracking-widest font-serif ${card.mutedTextClass} whitespace-nowrap shrink-0`}>
                        0{card.id}/04
                      </span>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs uppercase tracking-widest font-serif ${card.tagBgClass} whitespace-nowrap shrink-0`}>
                        {card.subtitle}
                      </div>
                    </div>

                    <div className="pt-1 pb-4 border-b border-current/15">
                      <h2 className="font-serif font-normal tracking-tight text-[clamp(1.5rem,2.5vw,2.75rem)] leading-[1.05] text-balance">
                        {card.title}
                      </h2>
                    </div>
                  </div>

                  {/* Right column / Scrollable content area */}
                  <div 
                    ref={(el) => { scrollContainerRefs.current[card.id] = el; }}
                    onScroll={() => checkOverflow(card.id)}
                    className="overflow-y-auto overscroll-behavior-contain h-full flex flex-col justify-start pt-4 md:pt-0 md:pl-2 pr-4 text-left relative"
                  >
                    <div className="w-full pb-4 landscape-body-text">
                      {card.paragraphs.map((p, pIndex) => {
                        const isDividerAfter = card.id === 3 && pIndex === 1;
                        return (
                          <React.Fragment key={pIndex}>
                            {p.type === 'pull' ? (
                              <blockquote
                                className={`font-serif italic font-light ${card.textClass} border-l-2 border-current pl-4 my-[0.9em] opacity-95 text-[clamp(1.125rem,1.8vw,1.5rem)]`}
                                dangerouslySetInnerHTML={{ __html: p.text }}
                              />
                            ) : p.type === 'ref' ? (
                              <p
                                className={`font-sans text-[clamp(0.75rem,0.9vw,0.875rem)] uppercase tracking-widest ${card.mutedTextClass} pt-1 pb-2 opacity-85`}
                              >
                                {p.text}
                              </p>
                            ) : p.type === 'final' ? (
                              <p
                                className={`font-serif font-medium ${card.textClass} my-[0.7em] text-[clamp(1.125rem,1.8vw,1.5rem)]`}
                                dangerouslySetInnerHTML={{ __html: p.text }}
                              />
                            ) : (
                              <p
                                className={`font-serif font-light mb-[0.7em]`}
                                dangerouslySetInnerHTML={{ __html: p.text }}
                              />
                            )}
                            {isDividerAfter && (
                              <div className="w-full h-[1px] bg-[#E7E5E4]/25 my-[clamp(12px,2svh,24px)]" />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                    {overflowState[card.id] && (
                      <div className="pointer-events-none sticky bottom-0 h-8 bg-gradient-to-t from-current/15 to-transparent mt-auto" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* 5th Layer: Closing Layer */}
          <div
            ref={cardRef5}
            style={{
              gridArea: '1 / 1',
              zIndex: 5,
              transformOrigin: 'top center',
            }}
            data-card-id="closing"
            className="closing-card-container relative overflow-clip rounded-[24px] text-[#E7E5E4] p-0 flex flex-col items-start justify-start text-left shadow-[0_24px_60px_rgba(0,0,0,0.45)] border border-[rgba(196,195,182,0.2)] transition-shadow duration-300 card-content-box w-full h-full max-h-[calc(100svh-2*clamp(16px,4svh,48px))]"
          >
            {/* Layer a: img */}
            <img 
              src="/closing-texture.webp" 
              alt="" 
              aria-hidden 
              decoding="async" 
              className="absolute inset-0 w-full h-full object-cover z-0 object-[15%_20%]" 
            />
            {/* Layer b & c: top-left positioned text */}
            <div 
              className="closing-text-block absolute z-20 flex flex-col items-start justify-start text-left"
              style={{
                textShadow: 'none',
              }}
            >
              <h2 
                className="closing-card-statement font-serif italic font-normal tracking-[-0.01em] leading-[1.05] text-[clamp(2.25rem,calc(4.2vw+1.2svh),6rem)] m-0 p-0"
                style={{ textShadow: 'none' }}
              >
                <span 
                  ref={lineRef1} 
                  className="block text-raw-umber will-change-[transform,opacity]" 
                  style={{ color: COLORS.rawUmber }}
                >
                  A little love
                </span>
                <span className="block closing-line-2">
                  <span 
                    ref={lineRef2} 
                    className="inline-block text-raw-umber whitespace-nowrap will-change-[transform,opacity]" 
                    style={{ color: COLORS.rawUmber }}
                  >
                    makes the load
                  </span>
                  {' '}
                  <span 
                    ref={lineRef3} 
                    className="inline-block text-lamp-black will-change-[transform,opacity]" 
                    style={{ color: COLORS.lampBlack }}
                  >
                    lighter.
                  </span>
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
