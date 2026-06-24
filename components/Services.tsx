// ============================================================================
// Services
// ----------------------------------------------------------------------------
// "What I edit best" — renders the services grid using ServiceCard. Section
// background is the faint blue "canvas" tone to separate it from the pure
// white sections above and below.
// ============================================================================

import { services } from '@/lib/data';
import { ServiceCard } from './ServiceCard';
import { FadeIn } from './FadeIn';

export function Services() {
  return (
    <section id="services" className="section-pad bg-canvas/[0.78] py-24 sm:py-32 dark:bg-[rgba(10,15,25,0.88)]">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn>
            <span className="timecode">02 / FOCUS</span>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2 className="mt-5 font-sans text-4xl font-bold tracking-tight text-ink sm:text-5xl dark:text-white">
              What I edit best.
            </h2>
          </FadeIn>
          <FadeIn delay={0.14}>
            <p className="mt-4 text-lg text-muted dark:text-white/55">
              Eight focus areas, one consistent standard of pacing,
              storytelling, and polish.
            </p>
          </FadeIn>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
