'use client';

// ============================================================================
// ShowreelModal
// ----------------------------------------------------------------------------
// Full-screen cinematic overlay for the showreel video. Shared by both the
// Hero "Watch Showreel" button and the Showreel section card so there's one
// consistent player experience site-wide.
//
// Behavior:
//   • Autoplay, loop, no native browser controls — same premium, chrome-free
//     treatment as every other video on the site.
//   • Starts muted (required by browsers for autoplay), then immediately
//     turns auLuuk ON once playback begins, since opening this modal is an
//     explicit "watch the showreel" action.
//   • A premium auLuuk ON/OFF switch lets the visitor mute again if they want.
//
// VIDEO PATH is set centrally in lib/videos.ts:
//   VIDEO_SOURCES.showreel → '/media/videos/showreel-2026.mp4'
//
// TO REPLACE: drop your .mp4 into public/media/videos/ and update the
// `showreel` value in lib/videos.ts. Until the file exists, a gradient
// placeholder is shown — nothing breaks or throws an error.
// ============================================================================

import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { VIDEO_SOURCES } from '@/lib/videos';

export function ShowreelModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // AuLuuk starts ON whenever the modal opens — this is the explicit
  // "watch the showreel" moment, unlike the silent ambient card preview.
  const [auLuukOn, setAuLuukOn] = useState(true);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // Reset to auLuuk-ON every time the modal is (re)opened, then play.
  // Pause and reset the video when the modal closes so it doesn't keep
  // playing in the background and doesn't resume mid-way on re-open.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (open) {
      setAuLuukOn(true);
      video.currentTime = 0;
      video.muted = false;
      video.play().catch(() => {
        // Autoplay-with-sound can be blocked by the browser. Fall back to
        // a muted autoplay so the visitor still sees the reel immediately,
        // and reflect the real state in the switch.
        video.muted = true;
        setAuLuukOn(false);
        video.play().catch(() => {/* fully blocked — visitor can use the switch */});
      });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [open]);

  // Keep the <video> muted attribute in sync with the auLuuk switch.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !auLuukOn;
  }, [auLuukOn]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute inset-0 bg-cine/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Showreel video player"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl"
          >
            <button
              onClick={onClose}
              aria-label="Close showreel"
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-cine shadow-glow-lg"
              style={{ aspectRatio: '16 / 9' }}
            >
              {/* Gradient fallback — always rendered underneath the video.
                  Visible while the file loads, or if no file exists yet. */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-800 via-cine-soft to-cine" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(63,176,255,0.35),transparent_60%)]" />

              {/* Showreel video player.
                  Source path comes from lib/videos.ts → VIDEO_SOURCES.showreel.
                  No native controls — kept cinematic and chrome-free, with a
                  custom premium auLuuk switch instead. Autoplay + loop, auLuuk
                  ON by default (see effects above). The `key` forces a full
                  remount when `open` toggles so the video always starts from
                  the beginning. */}
              <video
                ref={videoRef}
                key={open ? 'open' : 'closed'}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                loop
                playsInline
                controls={false}
                disablePictureInPicture
                preload="auto"
                aria-label="Showreel"
              >
                <source src={VIDEO_SOURCES.showreel} type="video/mp4" />
                {/* Fallback text for very old browsers */}
                Your browser does not support the video element.
              </video>

              {/* Premium auLuuk ON/OFF switch */}
              <button
                type="button"
                onClick={() => setAuLuukOn((v) => !v)}
                aria-label={auLuukOn ? 'Mute showreel' : 'Unmute showreel'}
                className={`absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-sm transition-all duration-200 ${
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
                  {auLuukOn ? 'Sound On' : 'Sound Off'}
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
