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

let activeScrollTrigger: ScrollTrigger | null = null;
let activeTimeline: gsap.core.Timeline | null = null;

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
  const totalDuration = activeTimeline ? activeTimeline.duration() : 360;
  // Card entry completion times in timeline units:
  // Card 0: 40
  // Card 1: 120
  // Card 2: 200
  // Card 3: 280
  // Card 4: 360
  const entryTimes = [40, 120, 200, 280, 360];
  const time = entryTimes[index] ?? 40;
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
    });
    return {
      lenis,
      cleanup: () => {
        lenis.destroy();
        gsap.ticker.remove((time) => lenis.raf(time * 1000));
      },
    };
  }

  const stageH = containerRef.clientHeight || window.innerHeight;
  const entryStartY = stageH;
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

  cardRefs.forEach((card) => {
    gsap.set(card, { autoAlpha: 0, y: entryStartY, scale: 1, filter: 'brightness(1)' });
  });

  if (stackWrapperRef) {
    gsap.set(stackWrapperRef, { y: 0 });
  }

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

  if (stackWrapperRef) {
    timeline.fromTo(
      stackWrapperRef,
      { y: 0 },
      { y: buriedOffset * 0.5, duration: 80, ease: 'none' },
      80
    );
    timeline.to(
      stackWrapperRef,
      { y: buriedOffset, duration: 80, ease: 'none' },
      160
    );
    timeline.to(
      stackWrapperRef,
      { y: maxShift, duration: 80, ease: 'none' },
      240
    );
  }

  // 5 items mapped across 0 to 400 timeline
  // Card 0: Entry [0, 40], Hold [40, 80]
  timeline.set(cardRefs[0], { autoAlpha: 1 }, 0);
  timeline.fromTo(
    cardRefs[0],
    { y: entryStartY, scale: 1, filter: 'brightness(1)' },
    { y: 0, scale: 1, filter: 'brightness(1)', duration: 40, ease: 'none' },
    0
  );

  // Card 1: Entry [80, 120], Hold [120, 160]
  timeline.set(cardRefs[1], { autoAlpha: 1 }, 80);
  timeline.fromTo(
    cardRefs[1],
    { y: entryStartY, scale: 1, filter: 'brightness(1)' },
    { y: 0, scale: 1, filter: 'brightness(1)', duration: 40, ease: 'none' },
    80
  );
  timeline.to(
    cardRefs[0],
    { scale: depthScale(1), y: depthY(1), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
    80
  );

  // Card 2: Entry [160, 200], Hold [200, 240]
  timeline.set(cardRefs[2], { autoAlpha: 1 }, 160);
  timeline.fromTo(
    cardRefs[2],
    { y: entryStartY, scale: 1, filter: 'brightness(1)' },
    { y: 0, scale: 1, filter: 'brightness(1)', duration: 40, ease: 'none' },
    160
  );
  timeline.to(
    cardRefs[1],
    { scale: depthScale(1), y: depthY(1), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
    160
  );
  timeline.to(
    cardRefs[0],
    { scale: depthScale(2), y: depthY(2), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
    160
  );

  // Card 3: Entry [240, 280], Hold [280, 320]
  timeline.set(cardRefs[3], { autoAlpha: 1 }, 240);
  timeline.fromTo(
    cardRefs[3],
    { y: entryStartY, scale: 1, filter: 'brightness(1)' },
    { y: 0, scale: 1, filter: 'brightness(1)', duration: 40, ease: 'none' },
    240
  );
  timeline.to(
    cardRefs[2],
    { scale: depthScale(1), y: depthY(1), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
    240
  );
  timeline.to(
    cardRefs[1],
    { scale: depthScale(2), y: depthY(2), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
    240
  );
  timeline.to(
    cardRefs[0],
    { scale: depthScale(3), y: depthY(3), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
    240
  );

  // Closing Layer: Entry [320, 360], Hold [360, 400]
  if (cardRefs[4]) {
    timeline.set(cardRefs[4], { autoAlpha: 1 }, 320);
    timeline.fromTo(
      cardRefs[4],
      { y: entryStartY, scale: 1, filter: 'brightness(1)' },
      { y: 0, scale: 1, filter: 'brightness(1)', duration: 40, ease: 'none' },
      320
    );
    timeline.to(
      cardRefs[3],
      { scale: depthScale(1), y: depthY(1), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
      320
    );
    timeline.to(
      cardRefs[2],
      { scale: depthScale(2), y: depthY(2), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
      320
    );
    timeline.to(
      cardRefs[1],
      { scale: depthScale(3), y: depthY(3), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
      320
    );
    timeline.to(
      cardRefs[0],
      { scale: depthScale(4), y: depthY(4), filter: 'brightness(0.85)', duration: 40, ease: 'none' },
      320
    );
  }

  activeTimeline = timeline;
  activeScrollTrigger = timeline.scrollTrigger ?? null;
  ScrollTrigger.refresh();

  return {
    lenis,
    cleanup: () => {
      activeTimeline = null;
      activeScrollTrigger = null;
      timeline.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    },
  };
}
