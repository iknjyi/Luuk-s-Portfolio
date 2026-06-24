'use client';

// ============================================================================
// ProjectModal
// ----------------------------------------------------------------------------
// Full-screen cinematic overlay for project details.
//
// Features:
//  • AuLuuk ON automatically when modal opens (video projects)
//  • Custom sky-blue progress bar — click or drag to scrub
//  • Left/right arrow buttons + keyboard arrows to navigate within the
//    same category (stays in the active category only)
//  • No default browser controls
//  • Close button + Esc key + backdrop click to close
//  • Vertical (9:16) and square (1:1) projects: premium two-column layout —
//    video left, info panel right on desktop; stacked on mobile.
//  • Wide (16:9) projects: original cinematic full-width header layout.
// ============================================================================

import { AnimatePresence, motion } from 'framer-motion';
import { X, Play, Wrench, Target, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import type { Project } from '@/lib/data';
import { useOverlay } from '@/lib/overlay-context';

// ─── Progress Bar ───────────────────────────────────────────────────────────

function ProgressBar({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
}) {
  const [progress, setProgress] = useState(0); // 0–1
  const [isDragging, setIsDragging] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // Update progress from video timeupdate
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => {
      if (!isDragging && video.duration) {
        setProgress(video.currentTime / video.duration);
      }
    };
    video.addEventListener('timeupdate', onTime);
    return () => video.removeEventListener('timeupdate', onTime);
  }, [videoRef, isDragging]);

  const seek = useCallback(
    (clientX: number) => {
      const bar = barRef.current;
      const video = videoRef.current;
      if (!bar || !video || !video.duration) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      setProgress(ratio);
      video.currentTime = ratio * video.duration;
    },
    [videoRef],
  );

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    seek(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => seek(e.clientX);
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, seek]);

  // Touch support
  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    seek(e.touches[0].clientX);
  };
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: TouchEvent) => seek(e.touches[0].clientX);
    const onEnd = () => setIsDragging(false);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging, seek]);

  return (
    <div
      ref={barRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className="group/bar relative h-1.5 w-full cursor-pointer rounded-full bg-white/20 transition-all duration-150 hover:h-2.5"
      role="slider"
      aria-label="Video progress"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Filled track */}
      <div
        className="pointer-events-none h-full rounded-full bg-sky-400 transition-none"
        style={{ width: `${progress * 100}%` }}
      />
      {/* Scrubber thumb */}
      <div
        className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-sky-300 shadow-[0_0_6px_rgba(125,211,252,0.8)] opacity-0 transition-opacity group-hover/bar:opacity-100"
        style={{ left: `${progress * 100}%` }}
      />
    </div>
  );
}

// ─── Shared video controls bar (progress + auLuuk + counter) ─────────────────

function VideoControls({
  videoRef,
  auLuukOn,
  setAuLuukOn,
  categoryProjects,
  currentIndex,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
  auLuukOn: boolean;
  setAuLuukOn: React.Dispatch<React.SetStateAction<boolean>>;
  categoryProjects: Project[];
  currentIndex: number;
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[2] flex flex-col gap-2 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8">
      <ProgressBar videoRef={videoRef} />
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setAuLuukOn((v) => !v)}
          aria-label={auLuukOn ? 'Mute' : 'Unmute'}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm transition-all duration-200 ${
            auLuukOn
              ? 'bg-sky-500/90 text-white shadow-glow hover:bg-sky-400/90'
              : 'bg-black/40 text-sky-100 hover:bg-black/60'
          }`}
        >
          {auLuukOn ? (
            <Volume2 className="h-3.5 w-3.5" />
          ) : (
            <VolumeX className="h-3.5 w-3.5" />
          )}
          <span className="font-mono text-[10px] uppercase tracking-wider">
            {auLuukOn ? 'On' : 'Off'}
          </span>
        </button>

        {categoryProjects.length > 1 && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/60">
            {currentIndex + 1} / {categoryProjects.length}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────

export function ProjectModal() {
  const { overlay, openProject, closeOverlay } = useOverlay();

  const project = overlay.type === 'project' ? overlay.project : null;
  const categoryProjects = overlay.type === 'project' ? overlay.categoryProjects : [];
  const initialTime = overlay.type === 'project' ? overlay.initialTime : 0;

  // Micro-Transitions are short loops — always restart from 0 in the modal.
  const isMicroTransition = project?.category === 'Micro-Transitions / Visual Bridges';
  // Use the project's format field to decide the modal layout.
  // Both 'vertical' (9:16) and 'square' (1:1) use the same left-video /
  // right-details two-column layout — only the aspect ratio differs.
  const sideBySideFormat = project?.format === 'vertical' || project?.format === 'square';
  const modalAspectRatio = project?.format === 'square' ? '1/1' : '9/16';
  // Square clips are capped on width too, so a 1:1 video doesn't grow as
  // tall (and wide) as a 680px-tall 9:16 reel would.
  // Mobile-safe sizing: `svh` (small viewport height) is used instead of
  // `vh` so the box never overflows behind mobile browser chrome (the
  // address bar). On mobile the box height is capped to ~65–68svh and width
  // is constrained to the available screen width so a 9:16 video's
  // *rendered box* always matches its true aspect ratio — that's what lets
  // `object-contain` show the whole frame with no cropping. Desktop sizing
  // is unchanged from the original design (the vh/px caps still apply on
  // larger screens via the `min()`).
  const videoBoxStyle: React.CSSProperties =
    project?.format === 'square'
      ? {
          aspectRatio: modalAspectRatio,
          height: 'min(65svh, 60vh, 520px)',
          width: 'auto',
          maxWidth: 'min(90vw, 65svh, 60vh, 520px)',
        }
      : {
          aspectRatio: modalAspectRatio,
          height: 'min(68svh, 76vh, 680px)',
          width: 'auto',
          maxWidth: '90vw',
        };

  const [auLuukOn, setAuLuukOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Current index within the category list
  const currentIndex = project
    ? categoryProjects.findIndex((p) => p.id === project.id)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < categoryProjects.length - 1;

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= categoryProjects.length) return;
      openProject(categoryProjects[index], categoryProjects);
    },
    [categoryProjects, openProject],
  );

  // Auto-enable auLuuk when a project opens
  useEffect(() => {
    if (project) {
      setAuLuukOn(Boolean(project.videoSrc));
      setIsPlaying(true);
    }
  }, [project?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Seek to the card's playback position when the modal video is ready.
  // Micro-Transitions are short loops — always restart them from 0.
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const seekTo = isMicroTransition ? 0 : (initialTime ?? 0);
    if (seekTo > 0 && video.duration && seekTo < video.duration) {
      video.currentTime = seekTo;
    }
  }, [initialTime, isMicroTransition]);

  // Sync muted property
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !auLuukOn;
  }, [auLuukOn]);

  // Lock body scroll + keyboard navigation
  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeOverlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (hasPrev) goTo(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (hasNext) goTo(currentIndex + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [project, closeOverlay, hasPrev, hasNext, currentIndex, goTo]);

  // Play/pause toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // ─── Nav buttons (shared between both layouts) ──────────────────────────
  const navButtons = (
    <>
      {hasPrev && (
        <button
          onClick={() => goTo(currentIndex - 1)}
          aria-label="Previous project"
          className="absolute left-2 sm:left-4 z-[110] flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-sky-600/80"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {hasNext && (
        <button
          onClick={() => goTo(currentIndex + 1)}
          aria-label="Next project"
          className="absolute right-2 sm:right-4 z-[110] flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-sky-600/80"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </>
  );

  // ─── Category nav row (inside info panel) ───────────────────────────────
  const categoryNav = categoryProjects.length > 1 && (
    <div className="mt-6 flex items-center justify-center gap-3">
      <button
        onClick={() => goTo(currentIndex - 1)}
        disabled={!hasPrev}
        aria-label="Previous project"
        className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted transition-colors hover:border-sky-400 hover:text-sky-600 disabled:opacity-30 disabled:pointer-events-none dark:border-sky-500/20 dark:text-white/50 dark:hover:border-sky-400 dark:hover:text-sky-400"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Prev
      </button>
      <span className="font-mono text-[11px] text-muted/60 dark:text-white/30">
        {currentIndex + 1} / {categoryProjects.length}
      </span>
      <button
        onClick={() => goTo(currentIndex + 1)}
        disabled={!hasNext}
        aria-label="Next project"
        className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted transition-colors hover:border-sky-400 hover:text-sky-600 disabled:opacity-30 disabled:pointer-events-none dark:border-sky-500/20 dark:text-white/50 dark:hover:border-sky-400 dark:hover:text-sky-400"
      >
        Next
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  // ─── Shared info panel content ───────────────────────────────────────────
  const infoContent = project && (
    <>
      <span className="timecode">{project.category}</span>
      <h3 className="mt-2 font-sans text-2xl font-bold tracking-tight text-ink dark:text-white">
        {project.title}
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-muted dark:text-white/60">
        {project.longDescription}
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <div className="rounded-2xl border border-line bg-canvas p-5 dark:border-sky-500/15 dark:bg-white/5">
          <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
            <Wrench className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Tools used</span>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <li
                key={tool}
                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-ink shadow-sm dark:bg-white/10 dark:text-white/80"
              >
                {tool}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-canvas p-5 dark:border-sky-500/15 dark:bg-white/5">
          <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
            <Target className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Editing focus</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink/80 dark:text-white/65">
            {project.focus}
          </p>
        </div>
      </div>

      {categoryNav}
    </>
  );

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-3 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-cine/70 backdrop-blur-md"
            onClick={closeOverlay}
            aria-hidden="true"
          />

          {/* Floating nav arrows (outside modal panel) */}
          {navButtons}

          {/* ══════════════════════════════════════════════
              VERTICAL (9:16) or SQUARE (1:1) — premium two-column layout
              Left: video  |  Right: info panel
              On mobile: stacked (video top, info bottom)
              ══════════════════════════════════════════════ */}
          {sideBySideFormat ? (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`${project.title} project details`}
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex max-h-[92svh] w-full max-w-[1000px] flex-col overflow-y-auto rounded-4xl border border-white/10 bg-white shadow-glow-lg dark:border-sky-400/15 dark:bg-[rgba(10,16,28,0.97)] md:flex-row md:max-h-[90vh] md:overflow-hidden"
            >
              {/* Close button — fixed near the top with a high z-index so it
                  always stays reachable even while the panel scrolls on
                  mobile (sticky would scroll out of view inside this
                  overflow-y-auto container, so we anchor it to the viewport
                  instead via fixed positioning at this breakpoint). */}
              <button
                onClick={closeOverlay}
                aria-label="Close project details"
                className="fixed right-4 top-4 z-[120] flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 sm:absolute sm:right-5 sm:top-5 sm:z-10 sm:bg-black/30 sm:hover:bg-black/50"
              >
                <X className="h-5 w-5" />
              </button>

              {/* LEFT — vertical or square video */}
              <div className="relative flex shrink-0 items-center justify-center bg-cine p-4 md:rounded-l-4xl md:p-5">
                {project.videoSrc ? (
                  <div
                    className="relative overflow-hidden rounded-2xl"
                    style={videoBoxStyle}
                  >
                    <video
                      key={project.id}
                      ref={videoRef}
                      className="absolute inset-0 h-full w-full object-contain md:object-cover"
                      src={project.videoSrc}
                      autoPlay
                      muted={!auLuukOn}
                      loop
                      playsInline
                      controls={false}
                      onLoadedMetadata={handleLoadedMetadata}
                      aria-label={`${project.title} video preview`}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(63,176,255,0.18),transparent_55%)]" />

                    {/* Category code chip */}
                    <div className="absolute left-3 top-3 z-[3] rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-sky-100">
                        {project.code}
                      </span>
                    </div>

                    {/* Click to play/pause */}
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                      className="absolute inset-0 z-[1] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                    >
                      {!isPlaying && (
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-glow">
                          <Play className="h-6 w-6 fill-ink text-ink" />
                        </span>
                      )}
                    </button>

                    <VideoControls
                      videoRef={videoRef}
                      auLuukOn={auLuukOn}
                      setAuLuukOn={setAuLuukOn}
                      categoryProjects={categoryProjects}
                      currentIndex={currentIndex}
                    />
                  </div>
                ) : (
                  <div
                    className="relative overflow-hidden rounded-2xl"
                    style={videoBoxStyle}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-800 via-cine-soft to-cine" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(63,176,255,0.35),transparent_55%)]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-glow">
                        <Play className="h-6 w-6 fill-ink text-ink" />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT — info panel */}
              <div className="flex min-w-0 flex-1 flex-col justify-center overflow-y-auto p-7 sm:p-8">
                {infoContent}
              </div>
            </motion.div>
          ) : (
            /* ══════════════════════════════════════════════
               WIDE (16:9) — original cinematic layout
               Full-width video header, details below
               ══════════════════════════════════════════════ */
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`${project.title} project details`}
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-4xl border border-white/10 bg-white shadow-glow-lg dark:border-sky-400/15 dark:bg-[rgba(10,16,28,0.97)] sm:max-h-[88vh]"
            >
              {/* Close button — fixed on mobile so it stays reachable while
                  this panel scrolls; absolute (original behavior) on desktop
                  since the panel rarely needs to scroll there. */}
              <button
                onClick={closeOverlay}
                aria-label="Close project details"
                className="fixed right-4 top-4 z-[120] flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 sm:absolute sm:right-5 sm:top-5 sm:z-10 sm:bg-black/30 sm:hover:bg-black/50"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Video */}
              <div className="relative aspect-[16/9] overflow-hidden rounded-t-4xl bg-cine">
                {project.videoSrc ? (
                  <div className="absolute inset-0">
                    <video
                      key={project.id}
                      ref={videoRef}
                      className="absolute inset-0 h-full w-full object-cover"
                      src={project.videoSrc}
                      autoPlay
                      muted={!auLuukOn}
                      loop
                      playsInline
                      controls={false}
                      onLoadedMetadata={handleLoadedMetadata}
                      aria-label={`${project.title} video preview`}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(63,176,255,0.18),transparent_55%)]" />

                    {/* Click to play/pause */}
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                      className="absolute inset-0 z-[1] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                    >
                      {!isPlaying && (
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-glow">
                          <Play className="h-6 w-6 fill-ink text-ink" />
                        </span>
                      )}
                    </button>

                    <VideoControls
                      videoRef={videoRef}
                      auLuukOn={auLuukOn}
                      setAuLuukOn={setAuLuukOn}
                      categoryProjects={categoryProjects}
                      currentIndex={currentIndex}
                    />
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-800 via-cine-soft to-cine" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(63,176,255,0.35),transparent_55%)]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-glow">
                        <Play className="h-6 w-6 fill-ink text-ink" />
                      </span>
                    </div>
                  </>
                )}

                {/* Category code chip */}
                <div className="absolute left-5 top-5 z-[3] rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-sky-100">
                    {project.code}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-7 sm:p-9">
                {infoContent}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
