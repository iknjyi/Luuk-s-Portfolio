// ============================================================================
// CreatorsSection
// ----------------------------------------------------------------------------
// "Who have I worked with?" Renders 18 collaborator icons in a
// structured grid:
//
//   Desktop (lg+): two fixed rows of 9 icons each, evenly spaced.
//   Tablet (md):   wraps into rows of ~4–5 icons naturally.
//   Mobile:        wraps into rows of 3 icons.
//
// Hover behaviour: icons sit at 50% opacity by default, rising to 100% on
// hover or while their popup is open — keeps the section visually quiet
// until the visitor is actively exploring it.
// ============================================================================

import { collaborators } from '@/lib/data';
import { CreatorIconPopup } from './CreatorIconPopup';
import { FadeIn } from './FadeIn';

// Split collaborators into two rows of 9 for the desktop layout.
const ROW_SIZE = 9;
const rowOne = collaborators.slice(0, ROW_SIZE);
const rowTwo = collaborators.slice(ROW_SIZE, ROW_SIZE * 2);

export function CreatorsSection() {
  return (
    <section className="section-pad bg-canvas/[0.78] py-24 sm:py-28 dark:bg-[rgba(10,15,25,0.88)]">
      <div className="mx-auto max-w-6xl text-center">
        <FadeIn>
          <span className="timecode">04 / WHO HAVE I WORKED WITH</span>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h2 className="mt-5 font-sans text-3xl font-bold tracking-tight text-ink sm:text-4xl dark:text-white">
            Who have I worked with?
          </h2>
        </FadeIn>
        <FadeIn delay={0.14}>
          <p className="mt-4 text-base text-muted dark:text-white/55">
            Tap an icon for a quick look at the collaboration.
          </p>
        </FadeIn>

        {/*
          DESKTOP  (lg+): two explicit rows of 9, justified evenly.
          MOBILE / TABLET: single flex-wrap grid with 3 columns on mobile,
                           auto on tablet — handled by the responsive classes.
        */}
        <FadeIn delay={0.2}>
          {/* Mobile / tablet: single wrapping row */}
          <div className="mt-14 flex flex-wrap justify-center gap-x-6 gap-y-12 sm:gap-x-8 lg:hidden">
            {collaborators.map((c) => (
              <CreatorIconPopup key={c.id} collaborator={c} />
            ))}
          </div>

          {/* Desktop: two locked rows of 9 */}
          <div className="mt-14 hidden flex-col gap-12 lg:flex">
            {/* Row 1 */}
            <div className="flex items-start justify-center gap-x-8 xl:gap-x-10">
              {rowOne.map((c) => (
                <CreatorIconPopup key={c.id} collaborator={c} />
              ))}
            </div>
            {/* Row 2 */}
            <div className="flex items-start justify-center gap-x-8 xl:gap-x-10">
              {rowTwo.map((c) => (
                <CreatorIconPopup key={c.id} collaborator={c} />
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
