/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHeroMotion(
  containerRef: HTMLElement | null,
  imageRef: HTMLElement | null,
  textRef: HTMLElement | null
) {
  if (!containerRef || !imageRef || !textRef) {
    return () => {};
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    gsap.set([imageRef, textRef], { opacity: 1, y: 0, scale: 1 });
    return () => {};
  }

  // Initial load animation: image fades in over 0.9s with 16px upward drift; text fades in 0.2s later.
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  tl.fromTo(
    imageRef,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.9 }
  ).fromTo(
    textRef,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.8 },
    '-=0.7'
  );

  // Scroll out animation: while scrolling out of the hero, image scales 1.00 to 1.04 and moves up 24px (scrubbed, ScrollTrigger)
  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  scrollTl.fromTo(
    imageRef,
    { scale: 1, y: 0 },
    { scale: 1.04, y: -24, ease: 'none' },
    0
  );

  return () => {
    tl.kill();
    scrollTl.kill();
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger === containerRef) {
        st.kill();
      }
    });
  };
}
