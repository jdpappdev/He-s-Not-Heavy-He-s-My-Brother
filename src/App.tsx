/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CardStack } from './components/CardStack';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#E7E5E4] font-serif selection:bg-[#C4C3B6] selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <CardStack />
      </main>
      <Footer />
    </div>
  );
}
