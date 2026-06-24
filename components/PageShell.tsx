'use client';

// ============================================================================
// PageShell
// ----------------------------------------------------------------------------
// Wraps the page in OverlayProvider and renders the two overlays that can be
// triggered from anywhere on the site (ProjectModal, ShowreelModal) exactly
// once, at the root — so opening a project from any card always produces
// the same single, consistent modal instance.
// ============================================================================

import { ReactNode } from 'react';
import { OverlayProvider, useOverlay } from '@/lib/overlay-context';
import { ProjectModal } from './ProjectModal';
import { ShowreelModal } from './ShowreelModal';

function Overlays() {
  const { overlay, closeOverlay } = useOverlay(); // still needed for ShowreelModal

  return (
    <>
      {/* ProjectModal now reads its own state via useOverlay() */}
      <ProjectModal />
      <ShowreelModal
        open={overlay.type === 'showreel'}
        onClose={closeOverlay}
      />
    </>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <OverlayProvider>
      {children}
      <Overlays />
    </OverlayProvider>
  );
}
