/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Auto-fit routine for card text content: picks the largest body font-size between 14px and 22px (0.5px steps)
 * such that content fits without overflow. Calls ScrollTrigger.refresh() after fitting and font load.
 */
export function initCardTextFitting() {
  const fitCards = () => {
    const cardContainers = document.querySelectorAll<HTMLElement>('.card-content-box');

    cardContainers.forEach((container) => {
      const bodyEl = container.querySelector<HTMLElement>('.card-body-text');
      if (!bodyEl) return;

      const minSize = 14;
      const maxSize = 22;
      let bestSize = minSize;

      // Reset styles
      bodyEl.style.fontSize = '';
      bodyEl.style.columnGap = '';
      container.style.padding = '';
      const paragraphs = bodyEl.querySelectorAll<HTMLElement>('p, blockquote');
      paragraphs.forEach((p) => {
        p.style.marginBottom = '';
      });

      for (let size = maxSize; size >= minSize; size -= 0.5) {
        bodyEl.style.fontSize = `${size}px`;
        if (bodyEl.scrollHeight <= bodyEl.clientHeight) {
          bestSize = size;
          break;
        }
      }

      bodyEl.style.fontSize = `${bestSize}px`;

      if (bodyEl.scrollHeight > bodyEl.clientHeight) {
        paragraphs.forEach((p) => {
          p.style.marginBottom = '0.5rem';
        });
      }
      if (bodyEl.scrollHeight > bodyEl.clientHeight) {
        bodyEl.style.columnGap = '1.5rem';
      }
      if (bodyEl.scrollHeight > bodyEl.clientHeight) {
        container.style.padding = '1rem';
      }
      if (bodyEl.scrollHeight > bodyEl.clientHeight) {
        console.warn(
          `Card ${container.dataset.cardId || ''} text overflows container at viewport ${window.innerWidth}x${window.innerHeight}`
        );
      }
    });

    ScrollTrigger.refresh();
  };

  requestAnimationFrame(fitCards);
  window.addEventListener('resize', fitCards);

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', fitCards);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready
      .then(() => {
        fitCards();
      })
      .catch(() => {});
  }

  return () => {
    window.removeEventListener('resize', fitCards);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', fitCards);
    }
  };
}
