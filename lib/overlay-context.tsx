'use client';

// ============================================================================
// OverlayProvider
// ----------------------------------------------------------------------------
// Centralizes every "soft navigation" surface on the site: the project detail
// modal, the showreel player modal, and the contact panel.
//
// The project overlay now also carries a `categoryProjects` list — the
// ordered set of projects in the same category tab that was active when the
// user clicked a card. ProjectModal uses this list for left/right arrow
// navigation that stays within the current category.
// ============================================================================

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Project } from './data';
import { pauseAllPreviewVideos, resumeAllPreviewVideos } from './preview-video';

type OverlayState =
  | { type: 'none' }
  | { type: 'project'; project: Project; categoryProjects: Project[]; initialTime: number }
  | { type: 'showreel' };

type OverlayContextValue = {
  overlay: OverlayState;
  openProject: (project: Project, categoryProjects?: Project[], initialTime?: number) => void;
  openShowreel: () => void;
  closeOverlay: () => void;
};

const OverlayContext = createContext<OverlayContextValue | null>(null);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<OverlayState>({ type: 'none' });

  // Opening ANY detail/modal video (project or showreel) first silences
  // every ambient preview video in the DOM, synchronously, in the same
  // tick — before the new overlay state is even set. This guarantees the
  // about-to-open video is the only audible one, fixing the "duplicated
  // audio on first open" bug globally for every card/category, since this
  // is the single chokepoint every "open a video" action goes through.
  const openProject = useCallback((project: Project, categoryProjects: Project[] = [], initialTime: number = 0) => {
    pauseAllPreviewVideos();
    setOverlay({ type: 'project', project, categoryProjects, initialTime });
  }, []);

  const openShowreel = useCallback(() => {
    pauseAllPreviewVideos();
    setOverlay({ type: 'showreel' });
  }, []);

  // Closing the overlay resumes ambient previews. Each preview video stays
  // muted (it was already re-muted on open, and its own JSX/imperative
  // muted logic re-applies on the next render), so closing the modal can
  // never result in more than one audible video at a time.
  const closeOverlay = useCallback(() => {
    setOverlay({ type: 'none' });
    resumeAllPreviewVideos();
  }, []);

  return (
    <OverlayContext.Provider
      value={{ overlay, openProject, openShowreel, closeOverlay }}
    >
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return ctx;
}
