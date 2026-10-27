/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CardStack } from './components/CardStack';
import { Footer } from './components/Footer';
import { AboutDialog } from './components/AboutDialog';

export default function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [aboutOpener, setAboutOpener] = useState<HTMLElement | null>(null);

  const handleOpenAbout = useCallback((opener: HTMLElement) => {
    setAboutOpener(opener);
    setIsAboutOpen(true);
  }, []);

  const handleCloseAbout = useCallback(() => {
    setIsAboutOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#E7E5E4] font-serif selection:bg-[#C4C3B6] selection:text-black">
      <Navbar onOpenAbout={handleOpenAbout} />
      <main>
        <Hero />
        <CardStack />
        <Footer onOpenAbout={handleOpenAbout} />
      </main>
      <AboutDialog
        isOpen={isAboutOpen}
        onClose={handleCloseAbout}
        opener={aboutOpener}
      />
    </div>
  );
}
