// ============================================================================
// Home page
// ----------------------------------------------------------------------------
// Assembles every section in order:
// Header -> Hero -> MovingFocusBar -> AboutIntro -> Showreel -> Services
// -> SelectedWorks -> CreatorsSection -> ContactSection -> Footer
//
// NOTE: The Showreel section is currently DISABLED (commented out below)
// because the final showreel video isn't ready yet. The component file,
// its import, and the video source config in lib/videos.ts are all left
// intact — nothing was deleted. See the commented-out import/usage below
// for how to re-enable it later.
//
// All cross-section overlay state (project modal, showreel modal) is
// provided by PageShell so any component can trigger either overlay.
// ============================================================================

import { PageShell } from '@/components/PageShell';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { MovingFocusBar } from '@/components/MovingFocusBar';
import { AboutIntro } from '@/components/AboutIntro';
import { Services } from '@/components/Services';
import { SelectedWorks } from '@/components/SelectedWorks';
import { CreatorsSection } from '@/components/CreatorsSection';
// Showreel disabled until final showreel is ready — import kept commented
// out (not deleted) so re-enabling later is a two-line change.
// import { Showreel } from '@/components/Showreel';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <PageShell>
      <Header />
      <main className="relative z-10">
        <Hero />
        <MovingFocusBar />
        <AboutIntro />
        {/* Showreel section disabled until final showreel is ready */}
        {/* <Showreel /> */}
        <Services />
        <SelectedWorks />
        <CreatorsSection />
        <ContactSection />
      </main>
      <Footer />
    </PageShell>
  );
}
