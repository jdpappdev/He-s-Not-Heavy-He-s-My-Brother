/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export function Footer() {
  return (
    <footer className="w-full bg-black py-8 px-6 lg:px-12 border-t border-white/10 text-[#C4C3B6] relative z-20 h-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-serif text-lg text-[#E7E5E4]">He&apos;s Not Heavy, He&apos;s My Brother</span>
        <p className="text-xs font-serif text-[#C4C3B6]/80">
          A little love makes the load lighter.
        </p>
      </div>
    </footer>
  );
}
