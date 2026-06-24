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

  const openProject = useCallback((project: Project, categoryProjects: Project[] = [], initialTime: number = 0) => {
    setOverlay({ type: 'project', project, categoryProjects, initialTime });
  }, []);

  const openShowreel = useCallback(() => {
    setOverlay({ type: 'showreel' });
  }, []);

  const closeOverlay = useCallback(() => {
    setOverlay({ type: 'none' });
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
