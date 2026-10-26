/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HEADER_TITLE } from '../content/site';

export function Navbar() {
  return (
    <header className="relative w-full h-[48px] z-50 flex items-center px-6 lg:px-12 bg-black border-b border-white/10">
      <span className="font-serif text-sm font-medium tracking-tight text-[#E7E5E4] whitespace-nowrap">
        {HEADER_TITLE}
      </span>
    </header>
  );
}
