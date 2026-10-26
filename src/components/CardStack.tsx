/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { initCardStackMotion } from '../motion/cardStack';
import { HeroSilhouette } from './HeroSilhouette';
import { CARDS_CONTENT } from '../content/cards';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function CardStack() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef1 = useRef<HTMLDivElement | null>(null);
  const cardRef2 = useRef<HTMLDivElement | null>(null);
  const cardRef3 = useRef<HTMLDivElement | null>(null);
  const cardRef4 = useRef<HTMLDivElement | null>(null);

  const [bodyFontSize, setBodyFontSize] = useState<number>(18);
  const [layoutStep, setLayoutStep] = useState<number>(1);
  const [cardHeight, setCardHeight] = useState<number>(650);

  useEffect(() => {
    const updateStageHeight = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--stage-h', `${h}px`);
      calculateCardDimensions();
      ScrollTrigger.refresh();
    };

    const calculateCardDimensions = () => {
      const stageH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--stage-h')) || window.innerHeight;
      const maxH = Math.min(0.88 * stageH, stageH - 112);
      const cardOuterWidth = Math.min(window.innerWidth * 0.92, 920);

      let chosenFs = 15;
      let chosenStep = 4;
      let chosenH = maxH;
      let found = false;

      const measureDiv = document.createElement('div');
      measureDiv.style.position = 'absolute';
      measureDiv.style.visibility = 'hidden';
      measureDiv.style.pointerEvents = 'none';
      measureDiv.style.width = `${cardOuterWidth}px`;
      document.body.appendChild(measureDiv);

      for (let fs = 24; fs >= 15; fs -= 0.5) {
        for (let step = 1; step <= 4; step++) {
          let maxNaturalH = 0;
          const padding = step <= 3 ? 80 : 56;
          const innerW = cardOuterWidth - padding;
          const textMaxWidth = step === 1 ? Math.min(innerW, fs * 0.6 * 68) : step === 2 ? Math.min(innerW, fs * 0.6 * 84) : innerW;
          const pGap = step === 4 ? fs * 0.5 : fs * 0.7;
          const lineHeight = step === 4 ? 1.5 : 1.55;

          CARDS_CONTENT.forEach((card) => {
            const paragraphsHtml = card.paragraphs.map(p => {
              if (p.type === 'pull') {
                return `<blockquote style="font-size: ${fs * 1.35}px; font-style: italic; font-weight: 300; border-left: 2px solid currentColor; padding-left: 1rem; margin: ${pGap}px 0;">${p.text}</blockquote>`;
              }
              if (p.type === 'ref') {
                return `<p style="font-size: ${fs * 0.85}px; text-transform: uppercase; letter-spacing: 0.1em; padding-top: 0.5rem; margin-bottom: ${pGap}px;">${p.text}</p>`;
              }
              if (p.type === 'final') {
                return `<p style="font-size: ${Math.max(fs * 1.1, 20)}px; font-weight: 500; margin: ${pGap}px 0;">${p.text}</p>`;
              }
              return `<p style="font-size: ${fs}px; font-weight: 300; margin-bottom: ${pGap}px; line-height: ${lineHeight};">${p.text}</p>`;
            }).join('');

            measureDiv.innerHTML = `
              <div style="width: ${cardOuterWidth}px; padding: ${step <= 3 ? '40px' : '28px'}; box-sizing: border-box; display: flex; flex-direction: column; overflow: visible;">
                <div style="display: flex; justify-content: space-between; padding-bottom: 0.75rem;"><span>tag</span><span>01/04</span></div>
                <div style="padding-top: 0.25rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.15);">
                  <h2 style="font-size: 2.5rem; line-height: 1.05;">Title</h2>
                </div>
                <div style="margin-block: auto; width: 100%; display: flex; justify-content: flex-start; overflow: visible;">
                  <div style="width: 100%; max-width: ${step <= 2 ? `${textMaxWidth}px` : 'none'}; text-align: left; overflow: visible;">
                    ${paragraphsHtml}
                  </div>
                </div>
              </div>
            `;
            const totalCardH = measureDiv.firstElementChild?.scrollHeight || 500;
            if (totalCardH > maxNaturalH) {
              maxNaturalH = totalCardH;
            }
          });

          if (maxNaturalH <= maxH) {
            chosenFs = fs;
            chosenStep = step;
            chosenH = Math.min(maxNaturalH, maxH);
            found = true;
            break;
          }
        }
        if (found) break;
      }

      if (!found) {
        chosenFs = 15;
        chosenStep = 4;
        let maxNaturalH = 0;
        CARDS_CONTENT.forEach((card) => {
          const pGap = 15 * 0.5;
          const paragraphsHtml = card.paragraphs.map(p => `<p style="margin-bottom: ${pGap}px;">${p.text}</p>`).join('');
          measureDiv.innerHTML = `<div style="padding: 28px; overflow: visible;">${paragraphsHtml}</div>`;
          const h = measureDiv.firstElementChild?.scrollHeight || 500;
          if (h > maxNaturalH) maxNaturalH = h;
        });
        chosenH = Math.min(maxNaturalH, 0.94 * stageH);
      }

      document.body.removeChild(measureDiv);
      setBodyFontSize(chosenFs);
      setLayoutStep(chosenStep);
      setCardHeight(chosenH);
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
    ].filter((el): el is HTMLDivElement => el !== null);

    const motionResult = initCardStackMotion(containerRef.current, cardRefs);

    return () => {
      window.removeEventListener('resize', updateStageHeight);
      window.removeEventListener('orientationchange', updateStageHeight);
      window.visualViewport?.removeEventListener('resize', updateStageHeight);
      if (motionResult) {
        motionResult.cleanup();
      }
    };
  }, []);

  return (
    <section
      id="card-stack"
      ref={containerRef}
      className="relative w-full min-h-[400vh] bg-black py-0 flex flex-col items-center overflow-hidden"
    >
      <HeroSilhouette />

      {/* Pinned stage: grid centering wrapper using --stage-h */}
      <div 
        className="sticky top-0 w-full grid place-items-center z-10 px-4 md:px-8 overflow-hidden"
        style={{ height: 'var(--stage-h, 100vh)' }}
      >
        <div 
          className="relative w-full grid place-items-center my-auto overflow-visible"
          style={{ maxWidth: 'min(92vw, 920px)', height: `${cardHeight}px` }}
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

            const paddingClass = layoutStep <= 3 ? 'p-8 md:p-10' : 'p-7';
            const titleSizeClass = layoutStep === 4 
              ? 'text-[clamp(1.5rem,min(4vw,0.045*var(--stage-h)),2.5rem)]' 
              : 'text-[clamp(1.75rem,min(5vw,0.055*var(--stage-h)),3.25rem)]';
            const maxWidthClass = layoutStep === 1 
              ? 'max-w-[68ch]' 
              : layoutStep === 2 
              ? 'max-w-[84ch]' 
              : 'max-w-none w-full';
            const pGapClass = layoutStep === 4 ? 'mb-[0.5em]' : 'mb-[0.7em]';
            const lineHeightClass = layoutStep === 4 ? 'leading-[1.5]' : 'leading-[1.55]';

            return (
              <div
                key={card.id}
                ref={cardRef}
                style={{
                  gridArea: '1 / 1',
                  zIndex: index + 1,
                  transformOrigin: 'top center',
                  width: 'min(92vw, 920px)',
                  height: `${cardHeight}px`,
                }}
                data-card-id={card.id}
                className={`rounded-[24px] ${card.bgClass} ${card.textClass} ${paddingClass} flex flex-col overflow-visible shadow-[0_24px_60px_rgba(0,0,0,0.45)] border border-black/10 transition-shadow duration-300 card-content-box`}
              >
                {/* Top header row: tag left, counter right */}
                <div className="flex items-center justify-between shrink-0 pb-3 overflow-visible">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs uppercase tracking-widest font-serif ${card.tagBgClass}`}>
                    {card.subtitle}
                  </div>
                  <span className={`text-xs uppercase tracking-widest font-serif ${card.mutedTextClass}`}>
                    0{card.id}/04
                  </span>
                </div>

                {/* Title spanning full width, max two lines */}
                <div className="shrink-0 pt-1 pb-4 border-b border-current/15 overflow-visible">
                  <h2
                    className={`font-serif font-normal tracking-tight ${titleSizeClass} leading-[1.05] text-balance line-clamp-2`}
                  >
                    {card.title}
                  </h2>
                </div>

                {/* Body wrapper using margin-block: auto for vertical centering without inner scroll */}
                <div 
                  className="my-auto w-full flex flex-col justify-start overflow-visible"
                >
                  <div className={`${maxWidthClass} w-full text-left overflow-visible`}>
                    {card.paragraphs.map((p, pIndex) => {
                      if (p.type === 'pull') {
                        return (
                          <blockquote
                            key={pIndex}
                            className={`font-serif italic font-light ${card.textClass} border-l-2 border-current pl-4 my-[0.9em] opacity-95 overflow-visible`}
                            style={{ fontSize: `${bodyFontSize * 1.35}px` }}
                            dangerouslySetInnerHTML={{ __html: p.text }}
                          />
                        );
                      }
                      if (p.type === 'ref') {
                        return (
                          <p
                            key={pIndex}
                            className={`font-sans text-xs uppercase tracking-widest ${card.mutedTextClass} pt-1 pb-2 opacity-85 overflow-visible`}
                            style={{ fontSize: `${bodyFontSize * 0.85}px` }}
                          >
                            {p.text}
                          </p>
                        );
                      }
                      if (p.type === 'final') {
                        return (
                          <p
                            key={pIndex}
                            className={`font-serif font-medium ${card.textClass} my-[0.7em] overflow-visible`}
                            style={{ fontSize: 'clamp(1.25rem, 2.2vw, 1.75rem)' }}
                            dangerouslySetInnerHTML={{ __html: p.text }}
                          />
                        );
                      }
                      return (
                        <p
                          key={pIndex}
                          className={`font-serif font-light ${pGapClass} ${lineHeightClass} overflow-visible`}
                          style={{ fontSize: `${bodyFontSize}px` }}
                          dangerouslySetInnerHTML={{ __html: p.text }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
