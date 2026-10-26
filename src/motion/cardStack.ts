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

export function initCardStackMotion(
  containerRef: HTMLElement | null,
  cardRefs: HTMLElement[]
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

  const stageH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--stage-h')) || window.innerHeight;
  const entryStartY = stageH + 120;

  // Initialize card opacities and positions
  cardRefs.forEach((card, index) => {
    if (index === 0) {
      gsap.set(card, { autoAlpha: 1, y: 0, scale: 1, filter: 'brightness(1)' });
    } else {
      gsap.set(card, { autoAlpha: 0, y: entryStartY, scale: 1, filter: 'brightness(1)' });
    }
  });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef,
      start: 'top top',
      end: '+=400%',
      pin: true,
      scrub: true,
      anticipatePin: 1,
    },
  });

  // Card 1 (index 1): Entry [100, 135], Hold [135, 200]
  // Card 0 drops to depth 1 during [100, 135]
  timeline.set(cardRefs[1], { autoAlpha: 1 }, 100);
  timeline.fromTo(
    cardRefs[1],
    { y: entryStartY, scale: 1, filter: 'brightness(1)' },
    { y: 0, scale: 1, filter: 'brightness(1)', duration: 35, ease: 'none' },
    100
  );
  timeline.to(
    cardRefs[0],
    { scale: 0.95, y: -14, filter: 'brightness(0.85)', duration: 35, ease: 'none' },
    100
  );

  // Card 2 (index 2): Entry [200, 235], Hold [235, 300]
  // Card 1 drops to depth 1, Card 0 drops to depth 2 during [200, 235]
  timeline.set(cardRefs[2], { autoAlpha: 1 }, 200);
  timeline.fromTo(
    cardRefs[2],
    { y: entryStartY, scale: 1, filter: 'brightness(1)' },
    { y: 0, scale: 1, filter: 'brightness(1)', duration: 35, ease: 'none' },
    200
  );
  timeline.to(
    cardRefs[1],
    { scale: 0.95, y: -14, filter: 'brightness(0.85)', duration: 35, ease: 'none' },
    200
  );
  timeline.to(
    cardRefs[0],
    { scale: 0.90, y: -28, filter: 'brightness(0.85)', duration: 35, ease: 'none' },
    200
  );

  // Card 3 (index 3): Entry [300, 335], Hold [335, 400]
  // Card 2 drops to depth 1, Card 1 drops to depth 2, Card 0 drops to depth 3 during [300, 335]
  timeline.set(cardRefs[3], { autoAlpha: 1 }, 300);
  timeline.fromTo(
    cardRefs[3],
    { y: entryStartY, scale: 1, filter: 'brightness(1)' },
    { y: 0, scale: 1, filter: 'brightness(1)', duration: 35, ease: 'none' },
    300
  );
  timeline.to(
    cardRefs[2],
    { scale: 0.95, y: -14, filter: 'brightness(0.85)', duration: 35, ease: 'none' },
    300
  );
  timeline.to(
    cardRefs[1],
    { scale: 0.90, y: -28, filter: 'brightness(0.85)', duration: 35, ease: 'none' },
    300
  );
  timeline.to(
    cardRefs[0],
    { scale: 0.85, y: -42, filter: 'brightness(0.85)', duration: 35, ease: 'none' },
    300
  );

  return {
    lenis,
    cleanup: () => {
      timeline.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    },
  };
}
