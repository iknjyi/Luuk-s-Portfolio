'use client';

// ============================================================================
// CreatorIconPopup
// ----------------------------------------------------------------------------
// A single circular creator/team icon. Sits at 50% opacity by default and
// smoothly reaches full opacity on hover or while its popup is open.
//
// IMAGE SUPPORT
// If the collaborator has an `image` field set, a real profile photo is
// shown inside the circle. Otherwise the default placeholder icon renders.
//
// HOW TO ADD A REAL PROFILE IMAGE:
//   1. Place the image in:  public/media/creators/creator-name.jpg
//   2. In lib/data.ts, set:  image: '/media/creators/creator-name.jpg'
//   3. Supported formats: .jpg .jpeg .png .webp .avif
//   4. Recommended: 200×200 px minimum, square or cropped to circle.
//   5. To revert to placeholder: remove the `image` field or set it to ''.
// ============================================================================

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { User2 } from 'lucide-react';
import type { Collaborator } from '@/lib/data';
import { MarqueeText } from './MarqueeText';

export function CreatorIconPopup({ collaborator }: { collaborator: Collaborator }) {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // How far (in px) the popup has been nudged left/right from its default
  // icon-centered position to keep it inside the viewport, and the inverse
  // offset applied to the connector arrow so it keeps pointing at the icon
  // center even while the popup itself is shifted. Both default to 0 —
  // i.e. "no shift needed" — which is the common case for icons that
  // aren't near a screen edge. Recalculated for every icon/open event,
  // never hardcoded to a specific creator.
  const [shift, setShift] = useState(0);

  const hasImage = !!collaborator.image && !imgError;

  // ---------------------------------------------------------------------------
  // Viewport-edge collision avoidance.
  // The popup defaults to perfectly centered under its icon. If that would
  // push it past the left or right edge of the viewport (common for icons
  // near the start/end of a row), shift the whole popup back inside the
  // viewport by the minimum distance needed, and shift the connector arrow
  // by the same amount in the opposite direction so it keeps pointing
  // exactly at the icon's center regardless of where the box landed.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!open) {
      setShift(0);
      return;
    }

    const computeShift = () => {
      const popup = popupRef.current;
      if (!popup) return;
      const rect = popup.getBoundingClientRect();
      const margin = 12; // breathing room from the viewport edge
      let nextShift = 0;
      if (rect.left < margin) {
        nextShift = margin - rect.left;
      } else if (rect.right > window.innerWidth - margin) {
        nextShift = window.innerWidth - margin - rect.right;
      }
      setShift(nextShift);
    };

    // Measure on open and keep it correct across resizes (e.g. rotating a
    // device, or resizing a desktop window with the popup still open).
    computeShift();
    window.addEventListener('resize', computeShift);
    return () => window.removeEventListener('resize', computeShift);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`View details for ${collaborator.name}`}
        className={`relative flex h-20 w-20 items-center justify-center rounded-full border-2 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:opacity-100 hover:shadow-card-hover sm:h-24 sm:w-24 dark:bg-[rgba(12,20,35,0.9)] ${
          open
            ? 'border-sky-400 opacity-100 ring-4 ring-sky-100 dark:ring-sky-400/20'
            : 'border-line opacity-50 dark:border-sky-500/20'
        }`}
      >
        {hasImage ? (
          /* Real creator profile image — cropped to fill the circle */
          <img
            src={collaborator.image}
            alt={collaborator.name}
            onError={() => setImgError(true)}
            className="h-full w-full rounded-full object-cover"
            draggable={false}
          />
        ) : (
          /* Fallback placeholder icon */
          <User2 className="h-8 w-8 text-sky-600" strokeWidth={1.5} />
        )}
      </button>

      {/* Creator name label below the icon */}
      <span className="mt-3 max-w-[7rem] text-center text-xs font-medium text-muted dark:text-white/50">
        {collaborator.name}
      </span>

      {/* Click popup — anchored below the icon */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={popupRef}
            // ----------------------------------------------------------------
            // POSITIONING FIX
            // The horizontal centering (-50%) used to live in a Tailwind
            // `-translate-x-1/2` class. Framer Motion writes its OWN inline
            // `transform` style for animated properties (scale, y, x) — and
            // an inline style always wins over a CSS class. That silently
            // wiped out the `-translate-x-1/2` translation as soon as the
            // entrance animation ran, leaving the popup's left EDGE sitting
            // at the icon's horizontal center instead of the popup being
            // centered there — a rightward shift of half the popup's width.
            // The connector arrow below is a plain (non-animated) div, so
            // its `-translate-x-1/2` class was never touched, which is why
            // it stayed correctly centered while the box drifted right.
            //
            // Fix: centering now goes through Framer Motion's own `x`
            // value (it supports percentage + px and adds them together —
            // `calc(-50% + Npx)`), composed with `shift` (the viewport-edge
            // correction computed above). Framer Motion composes scale/y/x
            // into ONE transform instead of two systems fighting over the
            // same CSS property. Nothing here is keyed to a specific
            // creator — `shift` is 0 for any icon that isn't near an edge.
            initial={{ opacity: 0, scale: 0.92, y: 8, x: `calc(-50% + ${shift}px)` }}
            animate={{ opacity: 1, scale: 1, y: 0, x: `calc(-50% + ${shift}px)` }}
            exit={{ opacity: 0, scale: 0.94, y: 6, x: `calc(-50% + ${shift}px)` }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-[88px] z-30 w-[88vw] max-w-[360px] rounded-3xl border border-line bg-white p-5 text-left shadow-glow sm:top-[104px] sm:w-[360px] dark:border-sky-400/15 dark:bg-[rgba(10,16,28,0.97)]"
          >
            {/* Connector arrow pointing back to the icon. Counter-shifted by
                -shift so that, even when the popup box itself has been
                nudged to stay inside the viewport, the arrow still lands
                exactly at the icon's horizontal center. */}
            <div
              className="absolute -top-2 h-4 w-4 rotate-45 border-l border-t border-line bg-white dark:border-sky-400/15 dark:bg-[rgba(10,16,28,0.97)]"
              style={{ left: '50%', transform: `translateX(calc(-50% + ${-shift}px)) rotate(45deg)` }}
            />

            {/* Popup header: avatar + name. The type pill ("Team", "Brand",
                etc.) now sits BELOW the name on its own line instead of
                sharing the name's row — that was stealing horizontal space
                and is exactly why long names were getting cut off. */}
            <div className="flex items-start gap-3">
              {hasImage && (
                <img
                  src={collaborator.image}
                  alt={collaborator.name}
                  className="h-10 w-10 flex-shrink-0 rounded-full object-cover border border-line"
                  draggable={false}
                />
              )}
              <div className="min-w-0 flex-1">
                {/* Name: no truncate, no whitespace-nowrap on the element
                    itself — MarqueeText decides per-render whether the name
                    fits (static, wraps if needed) or needs to loop. */}
                <MarqueeText
                  text={collaborator.name}
                  textClassName="font-sans text-base font-bold text-ink dark:text-white"
                />
                <span className="mt-1.5 inline-flex flex-shrink-0 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
                  {collaborator.type}
                </span>
              </div>
            </div>

            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted dark:text-white/45">
              Work done
            </p>
            {/* Work done: same marquee-or-wrap behavior as the name above —
                long lists of services loop smoothly instead of being cut
                off or forced onto one cramped unreadable line. */}
            <MarqueeText
              text={collaborator.workDone}
              textClassName="text-sm text-ink/80 dark:text-white/70"
              className="mt-1"
            />
            {/* Description stays fully static — never animated, per spec.
                It simply wraps and reads normally. */}
            <p className="mt-3 text-sm leading-relaxed text-muted dark:text-white/55">
              {collaborator.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
