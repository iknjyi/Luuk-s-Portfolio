'use client';

// ============================================================================
// Hero
// ----------------------------------------------------------------------------
// The opening thesis statement of the site. Large bold headline, supporting
// copy, two CTAs, and a large video-preview "product shot" card. The card
// itself is now a silent, unclickable, autoplaying background-style preview
// (no play button, no text overlay) — it's purely an ambient visual, since
// the dedicated Showreel section further down the page is the actual
// clickable showreel entry point. "Watch Showreel" still opens the showreel
// overlay; "View Selected Work" smooth-scrolls to the Work section.
//
// Two small rotating "app" badges (After Effects / Premiere Pro) float in
// the whitespace beside the card as a premium editing-software cue. They're
// text placeholders ("Ae" / "Pr") by default — see AppBadge below for how
// to swap in real logo image assets later.
// ============================================================================

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
// These imports are kept for when the Watch Showreel button is re-enabled:
// import { Play } from 'lucide-react';
// import { useOverlay } from '@/lib/overlay-context';
import { VIDEO_SOURCES } from '@/lib/videos';

// ----------------------------------------------------------------------------
// AppBadge
// ----------------------------------------------------------------------------
// A small floating "software used" card (After Effects / Premiere Pro).
// Renders a clean placeholder block (gradient + "Ae"/"Pr" text) by default.
//
// TO USE A REAL LOGO LATER: pass an `iconSrc` pointing at an image in
// /public, e.g. <AppBadge iconSrc="/media/logos/ae-logo.png" ... />.
// When `iconSrc` is provided, it's rendered instead of the text placeholder
// automatically — no other changes needed.
// ----------------------------------------------------------------------------
type AppBadgeProps = {
  label: string;
  name: string;
  iconSrc?: string;
  gradient: string;
  positionClassName: string;
  rotateKeyframes: number[];
  floatDelay?: number;
};

function AppBadge({
  label,
  name,
  iconSrc,
  gradient,
  positionClassName,
  rotateKeyframes,
  floatDelay = 0,
}: AppBadgeProps) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ rotate: rotateKeyframes[0], y: 0 }}
      animate={{ rotate: rotateKeyframes, y: [0, -6, 0] }}
      transition={{
        duration: 7,
        delay: floatDelay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`pointer-events-none absolute z-20 flex w-[68px] flex-col items-center gap-1.5 rounded-3xl border border-white/70 bg-white/80 p-2.5 shadow-glow backdrop-blur-md sm:w-[86px] sm:p-3 lg:w-[100px] dark:border-sky-400/20 dark:bg-[rgba(10,18,30,0.85)] ${positionClassName}`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-8px_12px_rgba(0,0,0,0.25)] sm:h-12 sm:w-12 lg:h-14 lg:w-14 ${gradient}`}
      >
        {iconSrc ? (
          // Real logo asset — drop your image into /public/media/logos/
          // and pass its path as `iconSrc` to render it here instead.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={iconSrc} alt={name} className="h-7 w-7 object-contain sm:h-8 sm:w-8" />
        ) : (
          <span className="font-sans text-base font-extrabold text-white sm:text-lg">
            {label}
          </span>
        )}
      </div>
      <span className="text-center text-[8.5px] font-semibold uppercase tracking-wide text-muted sm:text-[9.5px] dark:text-sky-300/70">
        {name}
      </span>
    </motion.div>
  );
}

export function Hero() {
  // openShowreel is kept here for when the Watch Showreel button is
  // re-enabled. To re-enable:
  //   1. Uncomment the line below.
  //   2. Uncomment the <button> block marked "Watch Showreel" further down.
  //   3. Uncomment `import { Play }` at the top of this file.
  // const { openShowreel } = useOverlay();

  const scrollToWork = () => {
    document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-paper/[0.78] pb-20 pt-36 sm:pt-44 dark:bg-[rgba(7,11,18,0.88)]"
    >
      {/* Ambient sky-blue glow behind the headline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-sky-radial" />

      <div className="section-pad mx-auto max-w-6xl">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center justify-center gap-2 sm:justify-start"
        >
          <span className="timecode">00:00 / Luuk — EDITOR</span>
        </motion.div>

        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left: headline + copy + CTAs */}
          <div className="text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-[2.6rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4rem] dark:text-white"
            >
              Footage is the recipe.{' '}
              <span className="bg-gradient-to-r from-sky-500 to-sky-700 bg-clip-text text-transparent">
                 Editing is where the story comes alive.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted lg:mx-0 dark:text-white/60"
            >
              Cinematic editing for reels, shorts, trailers, storytelling
              content, product reviews, gaming videos, football edits,
              creator content, and brand films.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              {/*
                ── WATCH SHOWREEL BUTTON (disabled while Showreel section is hidden) ──
                To re-enable:
                  1. Uncomment this entire <button> block.
                  2. Uncomment `const { openShowreel } = useOverlay();` above.
                  3. Uncomment `import { Play }` at the top of this file.
                  4. Re-enable the <Showreel /> section in app/page.tsx.
              */}
              {/* <button
                onClick={openShowreel}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white shadow-card transition-all duration-300 hover:bg-sky-600 hover:shadow-glow sm:w-auto dark:bg-sky-500 dark:hover:bg-sky-400"
              >
                <Play className="h-4 w-4 fill-current" />
                Watch Showreel
              </button> */}
              <button
                onClick={scrollToWork}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white shadow-card transition-all duration-300 hover:bg-sky-600 hover:shadow-glow sm:w-auto dark:bg-sky-500 dark:hover:bg-sky-400"
              >
                View Selected Work
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>

          {/* Right: silent looping preview visual + app badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/*
              This card is intentionally NOT a button and has no onClick.
              It's a silent, looping, autoplaying background-style preview —
              not a clickable showreel entry point. The dedicated Showreel
              section further down the page (and the "Watch Showreel" CTA
              above) is where visitors actually play the reel.
            */}
            <div
              className="relative block w-full select-none overflow-hidden rounded-4xl border border-line bg-cine shadow-glow-lg"
              style={{ aspectRatio: '4 / 5' }}
              aria-hidden="true"
            >
              {/* Gradient fallback — shows underneath/behind the video at
                  all times, and is all that's visible if no video file has
                  been added yet below. */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-900 via-cine to-cine" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(63,176,255,0.35),transparent_55%)]" />

              {/*
                Silent looping preview video.
                ------------------------------------------------------------
                autoPlay + muted + loop + playsInline + no controls = a
                premium, ambient, "always playing" background visual.
                `muted` is required by every browser for autoplay to work
                at all, and there is no auLuuk track expected here anyway.

                VIDEO PATH is set centrally in lib/videos.ts:
                  VIDEO_SOURCES.heroPreview → '/media/videos/hero-preview.mp4'

                TO REPLACE: drop your .mp4 into public/media/videos/ and
                update the `heroPreview` value in lib/videos.ts.
                Until a real file exists, the gradient background above is
                shown — nothing breaks.
              */}
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                disablePictureInPicture
                preload="auto"
              >
                <source src={VIDEO_SOURCES.heroPreview} type="video/mp4" />
              </video>

              {/* Faux waveform / timeline strip — purely decorative graphic
                  (not text), kept to sell the "editor" theme. Sits above
                  the video as a subtle premium framing detail. */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end gap-[3px] px-6 pb-6 opacity-70">
                {Array.from({ length: 40 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-full rounded-full bg-sky-300/70"
                    style={{
                      height: `${10 + Math.abs(Math.sin(i * 0.7)) * 38}px`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Adobe After Effects / Premiere Pro badges — float in the
                whitespace beside the card and slowly rotate, anchored
                around -10deg. See AppBadge above to swap in real logos. */}
            <AppBadge
              label="Ae"
              name="After Effects"
              gradient="from-sky-700 via-sky-800 to-ink"
              rotateKeyframes={[-12, -8, -12]}
              positionClassName="-left-3 -top-5 sm:-left-7 sm:-top-7 lg:-left-12 lg:-top-9"
            />
            <AppBadge
              label="Pr"
              name="Premiere Pro"
              gradient="from-sky-400 via-sky-600 to-sky-800"
              rotateKeyframes={[-8, -12, -8]}
              positionClassName="-right-3 -bottom-5 sm:-right-7 sm:-bottom-7 lg:-right-12 lg:-bottom-9"
              floatDelay={1.1}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
