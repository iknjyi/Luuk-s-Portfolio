'use client';

// ============================================================================
// SelectedWorks
// ----------------------------------------------------------------------------
// Category-tabbed portfolio section.
//
// CARD ORIENTATION (per category)
// Comedy & Personality Edits, Product Review, and Storytelling show
// short-form vertical reels (9:16). Brand ADS and Trailers / Teasers show
// 16:9 cards. Cinematic Videos, YouTube Hook Intros, and Micro-Transitions /
// Visual Bridges stay 16:9 across the board. Energetic Edits mixes one 16:9
// "wide" card with two square "1:1" cards — see the dedicated branch in the
// grid below. See `getOrientation` below — this is presentation-only and
// doesn't touch the project data in lib/data.ts.
//
// AULuuk STATE (all video categories)
// Every ProjectCard with a videoSrc gets a premium auLuuk ON/OFF toggle.
// `activeAuLuukId` tracks which single clip (by project id) currently has
// auLuuk unmuted — null means all clips are muted (the default).
//
// Switching categories resets auLuuk so returning always starts muted.
// Only one clip across the entire grid can play with auLuuk at a time.
//
// HOVER STATE
// `hoveredId` tracks which card is currently being hovered. Cards use this
// to pause sibling video previews while the hovered card continues playing.
// ============================================================================

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { workCategories, projects, EXAMPLES_PER_CATEGORY, type WorkCategory, type Project } from '@/lib/data';
import { ProjectCard } from './ProjectCard';
import { FadeIn } from './FadeIn';

// Categories that default to the tall, reel-style 9:16 card.
const VERTICAL_CATEGORIES: WorkCategory[] = [
  'Comedy & Personality Edits',
  'Product Review',
  'Storytelling',
];

// Decide a single card's orientation for categories that don't have their
// own dedicated layout branch below (Brand ADS, Product Review, and
// Energetic Edits are each handled explicitly in the grid markup).
function getOrientation(project: Project): 'horizontal' | 'vertical' | 'square' {
  if (project.format === 'square') return 'square';
  return VERTICAL_CATEGORIES.includes(project.category) ? 'vertical' : 'horizontal';
}

export function SelectedWorks() {
  const [activeCategory, setActiveCategory] = useState<WorkCategory>(workCategories[0]);

  // ID of the clip currently playing with auLuuk. null = all muted (default).
  const [activeAuLuukId, setActiveAuLuukId] = useState<string | null>(null);

  // ID of the card currently being hovered. null = no hover. Used so sibling
  // cards can pause their video while another card is hovered.
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const visibleProjects = projects
    .filter((p) => p.category === activeCategory)
    .slice(0, EXAMPLES_PER_CATEGORY[activeCategory]);

  // When switching categories, reset auLuuk and hover state.
  const handleCategoryChange = (category: WorkCategory) => {
    setActiveCategory(category);
    setActiveAuLuukId(null);
    setHoveredId(null);
  };

  // Toggle auLuuk on a specific clip. Same clip clicked again → mute it.
  // Different clip clicked → switch auLuuk to it (previous clip silenced).
  const handleAuLuukToggle = (id: string) => {
    setActiveAuLuukId((prev) => (prev === id ? null : id));
  };

  // Shared card props to avoid repetition in the grid branches.
  const cardProps = (project: Project) => ({
    project,
    auLuukEnabled: activeAuLuukId === project.id,
    onAuLuukToggle: () => handleAuLuukToggle(project.id),
    onBeforeOpen: () => setActiveAuLuukId(null),
    categoryProjects: visibleProjects,
    hoveredId,
    onHoverChange: setHoveredId,
  });

  return (
    <section id="work" className="section-pad bg-paper/[0.78] py-24 sm:py-32 dark:bg-[rgba(7,11,18,0.88)]">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn>
            <span className="timecode">03 / SELECTED WORK</span>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2 className="mt-5 font-sans text-4xl font-bold tracking-tight text-ink sm:text-5xl dark:text-white">
              Selected works.
            </h2>
          </FadeIn>
          <FadeIn delay={0.14}>
            <p className="mt-4 text-lg text-muted dark:text-white/55">
              A curated look at some of my strongest edits.
            </p>
          </FadeIn>
        </div>

        {/* Category tabs */}
        <FadeIn delay={0.2}>
          <div className="mt-12 flex flex-wrap justify-center gap-2 sm:gap-3">
            {workCategories.map((category) => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  aria-pressed={isActive}
                  className={`relative rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-300 sm:px-5 ${
                    isActive
                      ? 'text-white'
                      : 'border border-line bg-white text-ink/70 hover:border-sky-300 hover:text-ink dark:border-sky-500/20 dark:bg-white/5 dark:text-white/55 dark:hover:border-sky-400/40 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-category-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-sky-700"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>
        </FadeIn>

        {/* Helper note — shown for all categories since all are now video-enabled */}
        <motion.p
          key={activeCategory}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto mt-6 max-w-xl text-center text-sm text-muted dark:text-white/45"
        >
          Short looping previews — playing automatically and quietly.
          Tap the auLuuk button on any clip to hear it.
        </motion.p>

        {/* Examples grid.
            - Default: 2-column grid for most categories.
            - Brand ADS: both 16:9 examples stacked one on top of the other.
            - Product Review: both vertical reel cards side by side.
            - Energetic Edits: 1 wide 16:9 card on top, 2 square 1:1 cards
              side by side below it.
            - Trailers / Teasers: two 16:9 cards side by side on desktop,
              stacked on tablet/mobile. */}
        <div className="mt-10 min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeCategory === 'Brand ADS' ? (
                /* Brand ADS: both 16:9 examples, stacked one on top of the other */
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                  {visibleProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      {...cardProps(project)}
                      orientation="horizontal"
                    />
                  ))}
                </div>
              ) : activeCategory === 'Product Review' ? (
                /* Product Review: both vertical reels side by side on desktop */
                <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-6 sm:grid-cols-2">
                  {visibleProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      {...cardProps(project)}
                      orientation="vertical"
                    />
                  ))}
                </div>
              ) : activeCategory === 'Energetic Edits' ? (
                /* Energetic Edits: 1 wide 16:9 card on top, 2 square 1:1
                   cards side by side below it. */
                <div className="flex flex-col gap-6">
                  {visibleProjects[0] && (
                    <div className="mx-auto w-full max-w-3xl">
                      <ProjectCard
                        {...cardProps(visibleProjects[0])}
                        orientation="horizontal"
                      />
                    </div>
                  )}
                  <div className="mx-auto grid w-full max-w-3xl grid-cols-1 items-start gap-6 sm:grid-cols-2">
                    {visibleProjects.slice(1).map((project) => (
                      <ProjectCard
                        key={project.id}
                        {...cardProps(project)}
                        orientation="square"
                      />
                    ))}
                  </div>
                </div>
              ) : activeCategory === 'Trailers / Teasers' ? (
                /* Trailers / Teasers: two 16:9 cards side by side on desktop,
                   stacked on tablet/mobile. */
                <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
                  {visibleProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      {...cardProps(project)}
                      orientation="horizontal"
                    />
                  ))}
                </div>
              ) : (
                /* All other categories: standard 2-column grid */
                <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
                  {visibleProjects.map((project) => {
                    const orientation = getOrientation(project);
                    return (
                      <ProjectCard
                        key={project.id}
                        {...cardProps(project)}
                        orientation={orientation}
                      />
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
