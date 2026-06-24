'use client';

// ============================================================================
// MarqueeText
// ----------------------------------------------------------------------------
// A single line of text that:
//   - Renders perfectly normally (static, no animation) if it fits inside
//     its container.
//   - Automatically becomes a smooth, continuous horizontal marquee loop if
//     it's too long to fit — so nothing is ever cut off with "…".
//   - Pauses the loop on hover so the visitor can read at their own pace.
//   - Falls back to static, WRAPPED, fully-readable text (no animation,
//     no clipping) when the user has prefers-reduced-motion enabled.
//
// HOW THE LOOP WORKS
// We measure the text's natural width against the available container
// width on mount and on resize. If it overflows, we render the text TWICE
// back-to-back inside a flex row with a fixed gap, then animate that row
// from translateX(0) to translateX(-50%) — because the row is exactly two
// copies of the same content, sliding it left by exactly half its total
// width makes the second copy land exactly where the first one started,
// so the loop point is invisible and the motion never stutters or jumps.
// ============================================================================

import { useEffect, useRef, useState } from 'react';

interface MarqueeTextProps {
  text: string;
  /** Extra classes for the text itself (font size/weight/color). */
  textClassName?: string;
  /** Extra classes for the outer wrapper (e.g. width constraints). */
  className?: string;
  /** Seconds for one full loop when marquee is active. Default 8s — fast
   *  enough to read alongside short labels without feeling sluggish. */
  durationSeconds?: number;
}

export function MarqueeText({
  text,
  textClassName = '',
  className = '',
  durationSeconds = 8,
}: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [shouldMarquee, setShouldMarquee] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect prefers-reduced-motion. When active, we never marquee — instead
  // we show static, wrapped, fully-readable text (handled in the render
  // below by simply not entering the marquee branch).
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Measure: does the text's natural (unwrapped) width exceed the
  // container's available width? If so, and motion isn't reduced, marquee.
  useEffect(() => {
    if (reducedMotion) {
      setShouldMarquee(false);
      return;
    }

    const measure = () => {
      const container = containerRef.current;
      const probe = measureRef.current;
      if (!container || !probe) return;
      const overflowing = probe.scrollWidth > container.clientWidth;
      setShouldMarquee(overflowing);
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    window.addEventListener('resize', measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [text, reducedMotion]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Hidden probe — same text/font as the real text, used only to
          measure its natural single-line width. Not visible, not in the
          accessibility tree (the real text below is what gets read). */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className={`invisible absolute left-0 top-0 whitespace-nowrap ${textClassName}`}
      >
        {text}
      </span>

      {shouldMarquee ? (
        // Soft fade on both edges so the looping text doesn't have a hard
        // cut as it slides under the container edge.
        <div className="mask-edges">
          <div
            className="flex w-max items-center gap-16 whitespace-nowrap hover:[animation-play-state:paused]"
            style={{
              animation: `marquee ${durationSeconds}s linear infinite`,
            }}
          >
            {/* Render the text twice with a fixed gap between copies —
                this is what makes the -50% translate loop seamless. */}
            <span className={textClassName}>{text}</span>
            <span className={textClassName} aria-hidden="true">
              {text}
            </span>
          </div>
        </div>
      ) : (
        // Fits fine (or reduced-motion is on) — fully static, readable,
        // and allowed to wrap onto a second line if needed. No clipping.
        <span className={`block whitespace-normal break-words ${textClassName}`}>
          {text}
        </span>
      )}
    </div>
  );
}
