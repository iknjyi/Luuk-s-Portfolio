'use client';

// ============================================================================
// ProjectCard
// ----------------------------------------------------------------------------
// Card used in the Selected Works grid.
//
// ALL CARDS now support the premium auLuuk ON/OFF toggle when a videoSrc is
// present. AuLuuk state is controlled by SelectedWorks (only one clip across
// the whole grid can ever be unmuted at a time).
//
// HOVER BEHAVIOR
// When a video card is hovered:
//   1. The ENTIRE card (video preview, title, category, description, "View
//      details", the whole container) scales up together as one unit via
//      transform: scale() on the outer motion.div — width/height never
//      change, so the grid layout never reflows. The video itself stays
//      clipped inside its own overflow-hidden frame so it never spills past
//      the card's rounded corners.
//   2. The hovered card's z-index is raised so it visually lifts above
//      neighboring cards instead of being clipped/overlapped by them.
//   3. Sibling videos in the same category are paused and stay muted (via
//      the hoveredId prop from SelectedWorks — a card whose id !== hoveredId
//      will imperatively pause itself).
//   4. AuLuuk turns on INSTANTLY on hover (no delay/timer) — UNLESS the user
//      already has manual auLuuk control active for any clip (we don't fight
//      with manual state).
//   5. On mouse-leave: hover auLuuk is turned off immediately (manual auLuuk
//      is left untouched), and sibling videos resume their muted preview.
//
// Props:
//   auLuukEnabled   — true when THIS clip should play with auLuuk
//   onAuLuukToggle  — called when the user clicks the auLuuk button
//   categoryProjects — the full ordered list of projects in the same tab,
//                      forwarded to the modal so it can navigate L/R within
//                      the active category only
//   orientation    — 'horizontal' (16:9), 'vertical' (9:16), or 'square'
//                     (1:1) preview frame. Decided per-category by
//                     SelectedWorks — see that file.
//   hoveredId      — id of the currently-hovered card in the category (from
//                    SelectedWorks). null = nothing hovered.
//   onHoverChange  — callback to set hoveredId in SelectedWorks.
// ============================================================================

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
import type { Project } from '@/lib/data';
import { useOverlay } from '@/lib/overlay-context';

interface ProjectCardProps {
  project: Project;
  /** True when this specific clip should play with auLuuk. Default: false. */
  auLuukEnabled?: boolean;
  /** Called when the user clicks the auLuuk toggle. */
  onAuLuukToggle?: () => void;
  /**
   * Called immediately before the project modal is opened.
   * SelectedWorks uses this to mute all card previews so modal auLuuk
   * doesn't overlap with any playing card auLuuk.
   */
  onBeforeOpen?: () => void;
  /** All projects in the same category tab (for modal arrow navigation). */
  categoryProjects?: Project[];
  /**
   * Controls the preview's aspect ratio.
   *   'horizontal' (default) — 16:9 cinematic card, for Cinematic Videos,
   *     YouTube Hook Intros, Micro-Transitions / Visual Bridges, Brand ADS,
   *     Trailers / Teasers, and the wide card in Energetic Edits.
   *   'vertical' — tall 9:16 reel-style card, for short-form vertical
   *     content (Comedy & Personality Edits, Product Review, Storytelling).
   *   'square' — 1:1 reel-style card, for the square clips in Energetic
   *     Edits.
   * This only changes the preview frame's shape — object-fit, overflow,
   * border-radius, and the rest of the card stay identical between all
   * three.
   */
  orientation?: 'horizontal' | 'vertical' | 'square';
  /**
   * ID of the card currently being hovered within the same category grid.
   * Provided by SelectedWorks so sibling cards can pause when another is
   * hovered. null = nothing is hovered.
   */
  hoveredId?: string | null;
  /**
   * Called when this card's hover state changes.
   * Pass the project id on mouse-enter, null on mouse-leave.
   */
  onHoverChange?: (id: string | null) => void;
}

export function ProjectCard({
  project,
  auLuukEnabled = false,
  onAuLuukToggle,
  onBeforeOpen,
  categoryProjects = [],
  orientation = 'horizontal',
  hoveredId = null,
  onHoverChange,
}: ProjectCardProps) {
  const { openProject } = useOverlay();
  const isVideoPreview = Boolean(project.videoSrc);
  const videoRef = useRef<HTMLVideoElement>(null);
  const aspectClass =
    orientation === 'vertical' ? 'aspect-[9/16]' : orientation === 'square' ? 'aspect-square' : 'aspect-[16/9]';

  // Whether THIS card is the currently-hovered card.
  const isHovered = hoveredId === project.id;

  // Whether hover has auto-unmuted this card's auLuuk (distinct from the
  // manual auLuuk button so they don't fight each other).
  const [hoverAuLuukActive, setHoverAuLuukActive] = useState(false);

  // ---------------------------------------------------------------------------
  // Sync muted attribute imperatively.
  // AuLuuk is on when EITHER the user manually toggled it OR hover auto-auLuuk
  // turned it on. React doesn't reactively control `muted` via JSX props.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !(auLuukEnabled || hoverAuLuukActive);
  }, [auLuukEnabled, hoverAuLuukActive]);

  // ---------------------------------------------------------------------------
  // Pause/resume sibling videos based on hover state.
  // When another card is hovered (hoveredId !== null && !== this id) pause
  // this video. When nothing is hovered or this card IS the hovered one,
  // resume it.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideoPreview) return;

    const anotherCardIsHovered = hoveredId !== null && hoveredId !== project.id;

    if (anotherCardIsHovered) {
      video.pause();
    } else {
      // Resume only if the video is paused (avoid interrupting a playing video).
      if (video.paused) {
        video.play().catch(() => {
          // Autoplay policy may block — silently ignore.
        });
      }
    }
  }, [hoveredId, project.id, isVideoPreview]);

  // ---------------------------------------------------------------------------
  // Mouse enter: signal hover to parent, turn auLuuk on INSTANTLY (no delay).
  // We only auto-unmute if the user hasn't already manually enabled auLuuk on
  // this card (avoids double-toggling / fighting the manual button state).
  // ---------------------------------------------------------------------------
  const handleMouseEnter = useCallback(() => {
    if (!isVideoPreview) return;
    onHoverChange?.(project.id);

    if (!auLuukEnabled) {
      setHoverAuLuukActive(true);
    }
  }, [isVideoPreview, project.id, onHoverChange, auLuukEnabled]);

  // ---------------------------------------------------------------------------
  // Mouse leave: turn hover auLuuk off instantly, restore sibling videos.
  // ---------------------------------------------------------------------------
  const handleMouseLeave = useCallback(() => {
    if (!isVideoPreview) return;

    // Turn off hover-auto auLuuk immediately (manual auLuuk untouched).
    setHoverAuLuukActive(false);

    // Signal parent that nothing is hovered → siblings resume.
    onHoverChange?.(null);
  }, [isVideoPreview, onHoverChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: 1,
        y: 0,
        // Whole-card hover zoom: scale the ENTIRE container (video, title,
        // category, description, "View details") together as one unit.
        // transform: scale() never touches width/height, so neighboring
        // grid cells never reflow — only this card visually grows in place.
        scale: isHovered ? 1.06 : 1,
      }}
      exit={{ opacity: 0, y: -12 }}
      transition={{
        opacity: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        y: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        scale: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // z-30 on hover lifts this card above its neighbors so the scaled-up
      // edges/shadow sit cleanly on top instead of being clipped or fighting
      // with the cards next to it. z-10 keeps a stable base layer for
      // non-hovered cards.
      style={{ transformOrigin: 'center center' }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-4xl border border-line bg-cine shadow-card transition-shadow duration-300 hover:shadow-card-hover dark:border-sky-500/15 dark:bg-[rgba(10,16,28,0.90)] ${
        isHovered ? 'z-30 shadow-card-hover' : 'z-10'
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          // Silence THIS card's own preview video synchronously, in the same
          // click handler, before opening the modal. The global
          // pauseAllPreviewVideos() call inside openProject() also covers
          // this card, but pausing it here too removes any dependency on
          // call order and guarantees there is no audio gap on first open.
          const video = videoRef.current;
          if (video) {
            video.muted = true;
            video.pause();
          }
          onBeforeOpen?.();
          openProject(project, categoryProjects, video?.currentTime ?? 0);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const video = videoRef.current;
            if (video) {
              video.muted = true;
              video.pause();
            }
            onBeforeOpen?.();
            openProject(project, categoryProjects, video?.currentTime ?? 0);
          }
        }}
        className="flex h-full w-full flex-col text-left cursor-pointer"
        aria-label={`View details for ${project.title}`}
      >
        <div
          className={`relative shrink-0 overflow-hidden ${aspectClass}`}
        >
          {isVideoPreview ? (
            <>
              {/* Looping ambient preview clip.
                  `muted` is true on the JSX element so autoPlay works on
                  initial render. We toggle it imperatively via the useEffect
                  above when the auLuuk button is tapped.

                  No independent zoom here anymore — the hover zoom now
                  happens once, on the outer card container (see the
                  motion.div above), so the video scales up in lockstep with
                  the title/description/etc. as a single unit. This wrapper's
                  overflow-hidden still keeps the video cleanly clipped to
                  its rounded frame. */}
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src={project.videoSrc}
                autoPlay
                muted
                defaultMuted
                loop
                playsInline
                preload="metadata"
                controls={false}
                data-preview-video="true"
                aria-label={`${project.title} looping preview clip`}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(63,176,255,0.18),transparent_55%)]" />
            </>
          ) : (
            <>
              {/* Placeholder thumbnail gradient — no independent zoom here;
                  the whole card (including this gradient) scales together
                  via the outer motion.div's hover scale. */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-800 via-cine-soft to-cine" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(63,176,255,0.3),transparent_55%)]" />

              {/* Play affordance — only on static thumbnails */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-glow">
                  <Play className="h-5 w-5 fill-ink text-ink" />
                </span>
              </div>
            </>
          )}

          {/* Category code chip — top-left */}
          <div className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 backdrop-blur-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-sky-100">
              {project.code}
            </span>
          </div>

          {/* Top-right: auLuuk toggle button on all video cards.
              Shows sky-blue "On" state when auLuuk is on via EITHER manual
              toggle or hover auto-auLuuk. */}
          {isVideoPreview && onAuLuukToggle && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // prevent card click from opening overlay
                // Clicking the manual button clears hover-auto auLuuk first
                // so there's no double-state conflict, then delegates to parent.
                setHoverAuLuukActive(false);
                onAuLuukToggle();
              }}
              aria-label={auLuukEnabled || hoverAuLuukActive ? 'Mute clip' : 'Unmute clip'}
              className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 backdrop-blur-sm transition-all duration-200 ${
                auLuukEnabled || hoverAuLuukActive
                  ? 'bg-sky-500/90 text-white shadow-glow hover:bg-sky-400/90'
                  : 'bg-black/40 text-sky-100 hover:bg-black/60'
              }`}
            >
              {auLuukEnabled || hoverAuLuukActive ? (
                <Volume2 className="h-3.5 w-3.5" />
              ) : (
                <VolumeX className="h-3.5 w-3.5" />
              )}
              <span className="font-mono text-[10px] uppercase tracking-wider">
                {auLuukEnabled || hoverAuLuukActive ? 'On' : 'Off'}
              </span>
            </button>
          )}
        </div>

        <div className="flex flex-1 flex-col bg-white p-6 dark:bg-[rgba(12,20,35,0.95)]">
          <span className="timecode">{project.category}</span>
          <h3 className="mt-2 font-sans text-xl font-bold tracking-tight text-ink dark:text-white">
            {project.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted dark:text-white/55">
            {project.description}
          </p>

          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-sky-600 transition-colors group-hover:text-sky-700 dark:text-sky-400 dark:group-hover:text-sky-300">
            View details
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
