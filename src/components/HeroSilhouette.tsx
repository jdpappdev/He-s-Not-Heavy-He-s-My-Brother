/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface HeroSilhouetteProps {
  src?: string;
}

export function HeroSilhouette({ src }: HeroSilhouetteProps) {
  if (!src) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
      <div
        className="w-full h-[90dvh] max-w-5xl bg-[#595855]/10 bg-contain bg-center bg-no-repeat"
        style={{
          maskImage: `url(${src})`,
          WebkitMaskImage: `url(${src})`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
        }}
      />
    </div>
  );
}
