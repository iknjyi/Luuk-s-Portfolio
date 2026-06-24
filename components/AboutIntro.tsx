'use client';

// ============================================================================
// AboutIntro
// ----------------------------------------------------------------------------
// The "Who I Am" section. Renders from `aboutContent` in lib/data.ts so the
// English and Arabic copy (and which words are highlighted) live in one
// editable place rather than being hard-coded per language in this file.
//
// A pill-style language toggle (ARABIC | ENGLISH) switches the active
// language. English is the default. Switching languages crossfades the
// heading + body text with Framer Motion and flips text direction
// (ltr for English, rtl for Arabic) so Arabic reads correctly aligned
// right-to-left rather than just being translated text stuck in an
// English layout.
// ============================================================================

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { aboutContent, type AboutSegment } from '@/lib/data';

type Lang = 'en' | 'ar';

// Renders one language's segment array, applying the shared highlight
// styles (bold sky-blue vs. soft sky-blue background) consistently
// regardless of which language is active.
function Segments({ segments }: { segments: AboutSegment[] }) {
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.highlight === 'bold') {
          return (
            <span key={i} className="font-semibold text-sky-700 dark:text-sky-400">
              {seg.text}
            </span>
          );
        }
        if (seg.highlight === 'mark') {
          return (
            <span
              key={i}
              className="rounded-md bg-sky-100 px-1.5 py-0.5 font-semibold text-ink dark:bg-sky-500/20 dark:text-sky-200"
            >
              {seg.text}
            </span>
          );
        }
        return <span key={i}>{seg.text}</span>;
      })}
    </>
  );
}

export function AboutIntro() {
  const [lang, setLang] = useState<Lang>('en');
  const content = aboutContent[lang];
  const isArabic = lang === 'ar';

  return (
    <section id="about" className="section-pad bg-paper/[0.78] py-24 sm:py-32 dark:bg-[rgba(7,11,18,0.88)]">
      <div className="mx-auto max-w-3xl text-center">
        <FadeIn>
          <span className="timecode">01 / WHO I AM</span>
        </FadeIn>

        {/* Language toggle — premium pill switch, ARABIC | ENGLISH */}
        <FadeIn delay={0.05}>
          <div className="mt-6 flex justify-center">
            <div
              role="group"
              aria-label="Choose language for the About Me text"
              className="relative inline-flex rounded-full border border-line bg-canvas p-1 shadow-card dark:border-sky-500/20 dark:bg-[rgba(10,18,30,0.8)]"
            >
              {/* Sliding active-state background */}
              <motion.span
                animate={{ left: isArabic ? '2px' : 'calc(50% + 0px)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                className="absolute inset-y-1 w-[calc(50%-2px)] rounded-full bg-gradient-to-r from-sky-500 to-sky-700 shadow-sm"
              />

              <button
                type="button"
                onClick={() => setLang('ar')}
                aria-pressed={isArabic}
                className={`relative z-10 rounded-full px-5 py-2 text-sm font-semibold tracking-wide transition-colors duration-300 ${
                  isArabic ? 'text-white' : 'text-ink/60 hover:text-ink dark:text-white/40 dark:hover:text-white'
                }`}
              >
                ARABIC
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                aria-pressed={!isArabic}
                className={`relative z-10 rounded-full px-5 py-2 text-sm font-semibold tracking-wide transition-colors duration-300 ${
                  !isArabic ? 'text-white' : 'text-ink/60 hover:text-ink dark:text-white/40 dark:hover:text-white'
                }`}
              >
                ENGLISH
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Crossfading, direction-aware content */}
        <div className="mt-8 min-h-[220px] sm:min-h-[180px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={lang}
              dir={content.dir}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={isArabic ? 'font-arabic' : 'font-sans'}
            >
              <h2
                className={`text-3xl font-bold tracking-tight text-ink sm:text-4xl dark:text-white ${
                  isArabic ? 'leading-[1.5]' : ''
                }`}
              >
                <Segments segments={content.heading} />
              </h2>

              <p
                className={`mt-8 text-lg leading-relaxed text-muted dark:text-white/60 ${
                  isArabic
                    ? 'text-right leading-[1.9] sm:text-center'
                    : 'text-left sm:text-center'
                }`}
              >
                <Segments segments={content.body} />
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
