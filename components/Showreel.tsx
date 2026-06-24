'use client';

// ============================================================================
// Showreel
// ----------------------------------------------------------------------------
// STATUS: Currently DISABLED — not rendered on the page (see app/page.tsx,
// where the import and <Showreel /> usage are commented out). This file and
// its video source config (lib/videos.ts → VIDEO_SOURCES.showreel) are kept
// fully intact and untouched so the section can be re-enabled later by
// simply uncommenting the import and usage in app/page.tsx. Nothing in this
// component was changed as part of disabling it.
// ----------------------------------------------------------------------------
// "Showreel" — the one deliberately dark, cinematic section on the site,
// used carefully for contrast as the brief allows. The card itself now
// plays the real showreel clip — autoplay, muted, looping, no browser
// chrome — exactly like the ambient previews used elsewhere on the site
// (Hero / ProjectCard), with its own premium auLuuk ON/OFF switch.
//
// Clicking the card (anywhere other than the auLuuk switch) opens the
// full-screen ShowreelModal, which always starts with auLuuk ON.
//
// VIDEO PATH is set centrally in lib/videos.ts:
//   VIDEO_SOURCES.showreel → '/media/videos/showreel-2026.mp4'
//
// TO REPLACE: drop your .mp4 into public/media/videos/ and update the
// `showreel` value in lib/videos.ts. Until the file exists, the gradient +
// waveform placeholder below is shown — nothing breaks.
// ============================================================================

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { useOverlay } from '@/lib/overlay-context';
import { VIDEO_SOURCES } from '@/lib/videos';
import { stopAllPreviewVideos } from '@/lib/preview-video';
import { FadeIn } from './FadeIn';

export function Showreel() {
  const { openShowreel } = useOverlay();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Card preview auLuuk — starts OFF (muted), independent of the modal's
  // own auLuuk state. Mirrors the same toggle pattern used on ProjectCard.
  const [previewAuLuukOn, setPreviewAuLuukOn] = useState(false);

  // Same mobile "ghost hover"-adjacent race guard used in ProjectCard: once
  // a tap starts opening the modal, this ref blocks the muted-sync effect
  // below from re-applying a stale (pre-click) previewAuLuukOn value before
  // React's state update has actually settled.
  const isOpeningRef = useRef(false);

  useEffect(() => {
    if (isOpeningRef.current) return;
    const video = videoRef.current;
    if (!video) return;
    video.muted = !previewAuLuukOn;
  }, [previewAuLuukOn]);

  // Fallback reset: once previewAuLuukOn has settled back to false (its
  // natural idle/muted state), the open gesture has fully resolved, so it's
  // safe to let the muted-sync effect above respond normally again.
  useEffect(() => {
    if (!previewAuLuukOn) {
      isOpeningRef.current = false;
    }
  }, [previewAuLuukOn]);

  return (
    <section className="relative overflow-hidden bg-cine/[0.78] py-24 sm:py-32 dark:bg-[rgba(4,7,13,0.92)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(63,176,255,0.18),transparent_60%)]" />

      <div className="section-pad relative mx-auto max-w-4xl text-center">
        <FadeIn>
          <span className="timecode text-sky-300">02 / SHOWREEL</span>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h2 className="mt-5 font-sans text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Showreel.
          </h2>
        </FadeIn>
        <FadeIn delay={0.14}>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
            A fast-paced selection of my favorite edits, transitions, sound
            design, pacing, motion graphics, and storytelling work.
          </p>
        </FadeIn>

        <FadeIn delay={0.22} y={36}>
          <motion.div
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="group relative mx-auto mt-12 block w-full max-w-2xl overflow-hidden rounded-4xl border border-white/10 shadow-glow-lg"
            style={{ aspectRatio: '16 / 9' }}
          >
            {/* Gradient fallback — always rendered underneath the video.
                Visible while the file loads, or if no file exists yet. */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-800 via-cine-soft to-cine" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,rgba(63,176,255,0.4),transparent_55%)]" />

            {/* Ambient looping preview — autoplay, muted by default, loops,
                no native controls. Same premium "always playing" treatment
                as the Hero and ProjectCard previews. */}
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              defaultMuted
              loop
              playsInline
              controls={false}
              disablePictureInPicture
              preload="metadata"
              data-preview-video="true"
              aria-label="Showreel looping preview"
            >
              <source src={VIDEO_SOURCES.showreel} type="video/mp4" />
            </video>

            {/* Clickable surface — opens the full-screen modal (auLuuk ON).
                Sits above the video but below the auLuuk switch so the
                switch can stop propagation independently.
                onPointerDown/onTouchStart fire before any synthetic hover
                or click on mobile — earliest possible moment to silence
                every preview video globally, closing the same first-tap
                audio race fixed in ProjectCard. */}
            <button
              type="button"
              onPointerDown={() => {
                isOpeningRef.current = true;
                stopAllPreviewVideos();
              }}
              onTouchStart={() => {
                isOpeningRef.current = true;
                stopAllPreviewVideos();
              }}
              onClick={() => {
                // Belt-and-suspenders (idempotent): stop everything again,
                // reset this card's own auLuuk state, then open.
                isOpeningRef.current = true;
                stopAllPreviewVideos();
                setPreviewAuLuukOn(false);
                openShowreel();
              }}
              aria-label="Play showreel"
              className="absolute inset-0 z-10"
            />

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end gap-[2px] px-8 pb-8 opacity-60">
              {Array.from({ length: 60 }).map((_, i) => (
                <span
                  key={i}
                  className="w-full rounded-full bg-sky-300/70"
                  style={{ height: `${6 + Math.abs(Math.sin(i * 0.5)) * 30}px` }}
                />
              ))}
            </div>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-glow transition-transform duration-300 group-hover:scale-110">
                <Play className="h-7 w-7 fill-ink text-ink" />
              </span>
            </div>

            {/* Premium auLuuk ON/OFF switch for the card preview only.
                Stops propagation so it never triggers the modal open. */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewAuLuukOn((v) => !v);
              }}
              aria-label={previewAuLuukOn ? 'Mute showreel preview' : 'Unmute showreel preview'}
              className={`absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-sm transition-all duration-200 ${
                previewAuLuukOn
                  ? 'bg-sky-500/90 text-white shadow-glow hover:bg-sky-400/90'
                  : 'bg-black/40 text-sky-100 hover:bg-black/60'
              }`}
            >
              {previewAuLuukOn ? (
                <Volume2 className="h-3.5 w-3.5" />
              ) : (
                <VolumeX className="h-3.5 w-3.5" />
              )}
              <span className="font-mono text-[10px] uppercase tracking-wider">
                {previewAuLuukOn ? 'Sound On' : 'Sound Off'}
              </span>
            </button>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
