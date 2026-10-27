/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

let activeLenis: Lenis | null = null;

if (typeof window !== 'undefined') {
  const proto = Lenis.prototype as unknown as Record<string, (...args: unknown[]) => unknown>;
  const origOn = proto.on;
  proto.on = function (this: Lenis, ...args: unknown[]) {
    activeLenis = this;
    window.__lenis = this;
    return origOn.apply(this, args);
  };
  const origDestroy = proto.destroy;
  proto.destroy = function (this: Lenis) {
    if (activeLenis === this) {
      activeLenis = null;
    }
    if (window.__lenis === this) {
      delete window.__lenis;
    }
    return origDestroy.apply(this);
  };
}

export function getLenis(): Lenis | null {
  if (typeof window === 'undefined') return null;
  return activeLenis || window.__lenis || null;
}
