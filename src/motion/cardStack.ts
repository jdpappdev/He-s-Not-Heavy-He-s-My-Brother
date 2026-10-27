/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export interface CardStackMotionResult {
  lenis: Lenis;
  cleanup: () => void;
}

export const CHAPTER_1_ENTRY_START_SVH = 14;

let activeScrollTrigger: ScrollTrigger | null = null;
let activeTimeline: gsap.core.Timeline | null = null;
let activeEntryTimes: number[] = [40, 120, 200, 280, 360];

export function getChapterScrollY(index: number): number {
  const st =
    activeScrollTrigger ||
    ScrollTrigger.getAll().find(
      (s) =>
        (s.trigger as HTMLElement)?.id === 'card-stack' ||
        s.vars.trigger === '#card-stack'
    );
  if (!st) {
    const el = document.getElementById('card-stack');
    return el ? el.offsetTop : 0;
  }
  const totalDuration = activeTimeline ? activeTimeline.duration() : 400;
  const time = activeEntryTimes[index] ?? activeEntryTimes[0];
  const progressWhenEntered = time / totalDuration;
  return st.start + progressWhenEntered * (st.end - st.start);
}

export function initCardStackMotion(
  containerRef: HTMLElement | null,
  cardRefs: HTMLElement[],
  stackWrapperRef?: HTMLElement | null
): CardStackMotionResult | null {
  if (!containerRef || cardRefs.length === 0) {
    return null;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  if (prefersReducedMotion) {
    cardRefs.forEach((card) => {
      gsap.set(card, { autoAlpha: 1, y: 0, scale: 1, filter: 'brightness(1)' });
      const inner = card.querySelector<HTMLElement>('.card-inner-text');
      if (inner) {
        gsap.set(inner, { y: 0 });
      }
    });
    return {
      lenis,
      cleanup: () => {
        lenis.destroy();
        gsap.ticker.remove((time) => lenis.raf(time * 1000));
      },
    };
  }

  // Create timeline attached to ScrollTrigger
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef,
      start: 'top top',
      end: () => `+=${(timeline.duration() / 100) * (containerRef.clientHeight || window.innerHeight)}`,
      pin: true,
      scrub: true,
      anticipatePin: 1,
    },
  });

  function buildTimeline() {
    if (!containerRef) return;
    const stageH = containerRef.clientHeight || window.innerHeight;

    // Chapter I entry start y and duration scaling
    const card0EntryStartY = (CHAPTER_1_ENTRY_START_SVH / 100) * stageH;
    const ratio = CHAPTER_1_ENTRY_START_SVH / 100;
    const card0EntryDuration = 40 * ratio; // 5.6

    const entryStartY = stageH; // for cards 1..4
    const maxDepth = 3;
    const buriedOffset = Math.min(14, Math.max(8, stageH * 0.016));
    const maxShift = (maxDepth * buriedOffset) / 2;

    const depthScale = (d: number) => {
      const capped = Math.min(d, maxDepth);
      return 1 - 0.04 * capped;
    };
    const depthY = (d: number) => {
      const capped = Math.min(d, maxDepth);
      return -buriedOffset * capped;
    };

    // Measure overflows for the 4 chapter cards
    const overflows: number[] = [];
    const innerWrappers: (HTMLElement | null)[] = [];

    for (let i = 0; i < 4; i++) {
      const card = cardRefs[i];
      if (!card) {
        overflows.push(0);
        innerWrappers.push(null);
        continue;
      }
      const bodyEl = card.querySelector<HTMLElement>('.card-body');
      const innerEl = card.querySelector<HTMLElement>('.card-inner-text');
      innerWrappers.push(innerEl);

      if (bodyEl && innerEl) {
        // Temporarily reset y to 0 to measure exact natural scrollHeight & clientHeight
        gsap.set(innerEl, { y: 0 });
        const innerH = innerEl.scrollHeight;
        const bodyH = bodyEl.clientHeight;
        let ov = Math.round(innerH - bodyH);
        if (ov <= 1) {
          ov = 0;
          bodyEl.classList.remove('has-overflow');
        } else {
          bodyEl.classList.add('has-overflow');
        }
        overflows.push(ov);
      } else {
        overflows.push(0);
      }
    }

    timeline.clear();

    // Initial states:
    // Chapter I must be visible (opacity 1) before it enters the viewport
    gsap.set(cardRefs[0], { autoAlpha: 1, y: card0EntryStartY, scale: 1, filter: 'brightness(1)' });
    for (let i = 1; i < cardRefs.length; i++) {
      gsap.set(cardRefs[i], { autoAlpha: 0, y: entryStartY, scale: 1, filter: 'brightness(1)' });
    }
    if (stackWrapperRef) {
      gsap.set(stackWrapperRef, { y: 0 });
    }

    const entryTimes: number[] = [];
    let currentTime = 0;
    const HOLD_DURATION = 40;

    // --- Card 0: Entry [0, card0EntryDuration] ---
    timeline.set(cardRefs[0], { autoAlpha: 1 }, 0);
    timeline.fromTo(
      cardRefs[0],
      { y: card0EntryStartY, scale: 1, filter: 'brightness(1)' },
      { y: 0, scale: 1, filter: 'brightness(1)', duration: card0EntryDuration, ease: 'none' },
      0
    );

    const card0EnteredTime = card0EntryDuration;
    entryTimes.push(card0EnteredTime);
    currentTime = card0EnteredTime;

    // Card 0 Overflow Tween (if overflow > 1)
    if (overflows[0] > 1 && innerWrappers[0]) {
      const ovUnits0 = (overflows[0] / stageH) * 100;
      timeline.fromTo(
        innerWrappers[0],
        { y: 0 },
        { y: -overflows[0], duration: ovUnits0, ease: 'none' },
        currentTime
      );
      currentTime += ovUnits0;
    }

    currentTime += HOLD_DURATION;
    const card1StartTime = currentTime;

    // --- Card 1: Entry [card1StartTime, card1StartTime + 40] ---
    const card1EnteredTime = card1StartTime + 40;
    entryTimes.push(card1EnteredTime);

    timeline.set(cardRefs[1], { autoAlpha: 1 }, card1StartTime);
    timeline.fromTo(
      cardRefs[1],
      { y: entryStartY, scale: 1, filter: 'brightness(1)' },
      { y: 0, scale: 1, filter: 'brightness(1)', duration: 40, ease: 'none' },
      card1StartTime
    );
    timeline.to(
      cardRefs[0],
      { scale: depthScale(1), y: depthY(1), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
      card1StartTime
    );

    currentTime = card1EnteredTime;

    // Card 1 Overflow Tween
    if (overflows[1] > 1 && innerWrappers[1]) {
      const ovUnits1 = (overflows[1] / stageH) * 100;
      timeline.fromTo(
        innerWrappers[1],
        { y: 0 },
        { y: -overflows[1], duration: ovUnits1, ease: 'none' },
        currentTime
      );
      currentTime += ovUnits1;
    }

    currentTime += HOLD_DURATION;
    const card2StartTime = currentTime;

    // --- Card 2: Entry [card2StartTime, card2StartTime + 40] ---
    const card2EnteredTime = card2StartTime + 40;
    entryTimes.push(card2EnteredTime);

    timeline.set(cardRefs[2], { autoAlpha: 1 }, card2StartTime);
    timeline.fromTo(
      cardRefs[2],
      { y: entryStartY, scale: 1, filter: 'brightness(1)' },
      { y: 0, scale: 1, filter: 'brightness(1)', duration: 40, ease: 'none' },
      card2StartTime
    );
    timeline.to(
      cardRefs[1],
      { scale: depthScale(1), y: depthY(1), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
      card2StartTime
    );
    timeline.to(
      cardRefs[0],
      { scale: depthScale(2), y: depthY(2), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
      card2StartTime
    );

    currentTime = card2EnteredTime;

    // Card 2 Overflow Tween
    if (overflows[2] > 1 && innerWrappers[2]) {
      const ovUnits2 = (overflows[2] / stageH) * 100;
      timeline.fromTo(
        innerWrappers[2],
        { y: 0 },
        { y: -overflows[2], duration: ovUnits2, ease: 'none' },
        currentTime
      );
      currentTime += ovUnits2;
    }

    currentTime += HOLD_DURATION;
    const card3StartTime = currentTime;

    // --- Card 3: Entry [card3StartTime, card3StartTime + 40] ---
    const card3EnteredTime = card3StartTime + 40;
    entryTimes.push(card3EnteredTime);

    timeline.set(cardRefs[3], { autoAlpha: 1 }, card3StartTime);
    timeline.fromTo(
      cardRefs[3],
      { y: entryStartY, scale: 1, filter: 'brightness(1)' },
      { y: 0, scale: 1, filter: 'brightness(1)', duration: 40, ease: 'none' },
      card3StartTime
    );
    timeline.to(
      cardRefs[2],
      { scale: depthScale(1), y: depthY(1), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
      card3StartTime
    );
    timeline.to(
      cardRefs[1],
      { scale: depthScale(2), y: depthY(2), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
      card3StartTime
    );
    timeline.to(
      cardRefs[0],
      { scale: depthScale(3), y: depthY(3), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
      card3StartTime
    );

    currentTime = card3EnteredTime;

    // Card 3 Overflow Tween
    if (overflows[3] > 1 && innerWrappers[3]) {
      const ovUnits3 = (overflows[3] / stageH) * 100;
      timeline.fromTo(
        innerWrappers[3],
        { y: 0 },
        { y: -overflows[3], duration: ovUnits3, ease: 'none' },
        currentTime
      );
      currentTime += ovUnits3;
    }

    currentTime += HOLD_DURATION;
    const closingStartTime = currentTime;

    // --- Closing Layer: Entry [closingStartTime, closingStartTime + 40] ---
    if (cardRefs[4]) {
      const closingEnteredTime = closingStartTime + 40;
      entryTimes.push(closingEnteredTime);

      timeline.set(cardRefs[4], { autoAlpha: 1 }, closingStartTime);
      timeline.fromTo(
        cardRefs[4],
        { y: entryStartY, scale: 1, filter: 'brightness(1)' },
        { y: 0, scale: 1, filter: 'brightness(1)', duration: 40, ease: 'none' },
        closingStartTime
      );
      timeline.to(
        cardRefs[3],
        { scale: depthScale(1), y: depthY(1), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
        closingStartTime
      );
      timeline.to(
        cardRefs[2],
        { scale: depthScale(2), y: depthY(2), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
        closingStartTime
      );
      timeline.to(
        cardRefs[1],
        { scale: depthScale(3), y: depthY(3), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
        closingStartTime
      );
      timeline.to(
        cardRefs[0],
        { scale: depthScale(4), y: depthY(4), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
        closingStartTime
      );

      currentTime = closingEnteredTime + HOLD_DURATION;
    }

    // stackWrapperRef shifts synchronized with card entries
    if (stackWrapperRef) {
      timeline.fromTo(
        stackWrapperRef,
        { y: 0 },
        { y: buriedOffset * 0.5, duration: card2StartTime - card1StartTime, ease: 'none' },
        card1StartTime
      );
      timeline.to(
        stackWrapperRef,
        { y: buriedOffset, duration: card3StartTime - card2StartTime, ease: 'none' },
        card2StartTime
      );
      timeline.to(
        stackWrapperRef,
        { y: maxShift, duration: closingStartTime - card3StartTime, ease: 'none' },
        card3StartTime
      );
    }

    activeEntryTimes = entryTimes;
  }

  const onRefreshInit = () => {
    buildTimeline();
  };

  ScrollTrigger.addEventListener('refreshInit', onRefreshInit);

  // Initial build
  buildTimeline();

  activeTimeline = timeline;
  activeScrollTrigger = timeline.scrollTrigger ?? null;
  ScrollTrigger.refresh();

  return {
    lenis,
    cleanup: () => {
      ScrollTrigger.removeEventListener('refreshInit', onRefreshInit);
      activeTimeline = null;
      activeScrollTrigger = null;
      timeline.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    },
  };
}
