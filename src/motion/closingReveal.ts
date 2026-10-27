/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import gsap from 'gsap';

export interface ClosingRevealResult {
  cleanup: () => void;
}

/**
 * Initializes reveal animation for the closing card text lines.
 * Triggers when the closing card element achieves at least 70% visibility.
 * Transforms and animates opacity only.
 * If prefers-reduced-motion is active, displays immediately with no animation.
 */
export function initClosingReveal(
  cardElement: HTMLElement | null,
  lineElements: (HTMLElement | null)[]
): ClosingRevealResult | null {
  const validLines = lineElements.filter((el): el is HTMLElement => el !== null);
  if (!cardElement || validLines.length === 0) {
    return null;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // With prefers-reduced-motion, show the text immediately with no animation
  if (prefersReducedMotion) {
    gsap.set(validLines, { opacity: 1, y: 0 });
    return {
      cleanup: () => {},
    };
  }

  // Pre-position lines hidden and translated down 16px along Y axis
  gsap.set(validLines, { opacity: 0, y: 16 });

  let played = false;

  // Threshold array includes 0.7 so crossing >= 70% visible triggers the callback
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.intersectionRatio >= 0.7 && !played) {
          played = true;
          observer.disconnect();

          const tl = gsap.timeline({ overwrite: 'auto' });
          tl.to(validLines[0], {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power1.out',
          }, 0)
          .to(validLines[1], {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power1.out',
          }, 0.25)
          .to(validLines[2], {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power1.out',
          }, 0.25 + 0.45);
          break;
        }
      }
    },
    {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    }
  );

  observer.observe(cardElement);

  return {
    cleanup: () => {
      observer.disconnect();
    },
  };
}
