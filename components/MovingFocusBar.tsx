// ============================================================================
// MovingFocusBar
// ----------------------------------------------------------------------------
// A continuous, premium marquee that loops the list of focus areas
// endlessly. Built with pure CSS animation (not JS-driven) for smooth,
// glitch-free looping — the array is duplicated once so the loop point is
// invisible. A subtle edge mask fades the bar into the page background.
// ============================================================================

import { focusAreas } from '@/lib/data';

export function MovingFocusBar() {
  const items = [...focusAreas, ...focusAreas]; // duplicate for seamless loop

  return (
    <div className="relative border-y border-line bg-canvas/[0.78] py-6 dark:border-sky-500/10 dark:bg-[rgba(10,15,25,0.85)]">
      <div className="mask-edges overflow-hidden">
        <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-10 whitespace-nowrap">
              <span className="text-base font-medium text-ink/70 sm:text-lg dark:text-white/50">
                {item}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
