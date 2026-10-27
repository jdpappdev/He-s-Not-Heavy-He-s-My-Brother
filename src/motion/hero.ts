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
  headlineLines: HTMLElement[],
  sublineRef: HTMLElement | null,
  buttonRef: HTMLElement | null
) {
  if (!containerRef || !imageRef || headlineLines.length === 0 || !sublineRef || !buttonRef) {
    return () => {};
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    gsap.set([imageRef, ...headlineLines, sublineRef, buttonRef], { opacity: 1, y: 0, scale: 1 });
    return () => {};
  }

  // Entrance on load:
  // image fades in with a slight scale from 1.03 to 1,
  // headline lines rise and fade in with a 0.15s stagger,
  // button last. Opacity and transform only, once. None under reduced motion.
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  tl.fromTo(
    imageRef,
    { opacity: 0, scale: 1.03 },
    { opacity: 1, scale: 1, duration: 1.0 }
  )
    .fromTo(
      headlineLines,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
      '-=0.7'
    )
    .fromTo(
      sublineRef,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.35'
    )
    .fromTo(
      buttonRef,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.3'
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
