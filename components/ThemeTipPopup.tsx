'use client';

// ============================================================================
// ThemeTipBubble
// ----------------------------------------------------------------------------
// Small, self-dismissing tip shown ONLY to first-time visitors, pointing at
// the header's theme toggle to explain that the site opens in dark mode.
//
// Behavior:
//   • Shows once, on first visit only (gated by a localStorage flag).
//   • Only shows if the site is ACTUALLY in dark mode when the popup fires —
//     if the user already had light mode saved, the popup never appears.
//   • Stays visible for ~5 seconds, then fades out automatically.
//   • Can also be dismissed manually via the close (×) button.
//   • Never shows again after the first visit, even after a refresh.
//   • Popup-seen flag is written to localStorage at the same time the popup
//     becomes visible (or dismissed), so a hard-close or crash won't re-show it.
//   • A module-level guard ensures only one mounted instance ever "claims"
//     and shows the hint, even if more than one copy of this component is
//     rendered at once (e.g. separate desktop/mobile header layouts).
// ============================================================================

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, X } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

const POPUP_SEEN_KEY = 'dio-theme-hint-shown';
const VISIBLE_MS = 5000;

// Header renders both a desktop and a mobile copy of <ThemeTipBubble /> at
// the same time (only one is visible at a given viewport width via CSS).
// Without a guard, both copies would independently read localStorage, both
// see "not seen yet", and both flip themselves visible with their own
// setTimeout — so whichever one's timer fires first hides ITS bubble while
// the other one is still sitting on screen, making the popup look like it
// "never disappears". This in-memory flag makes the very first instance to
// mount the single owner of the hint for this page load; every other
// instance bails out immediately and renders nothing.
let hintClaimedThisPageLoad = false;

export function ThemeTipBubble() {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  const markSeen = () => {
    try {
      localStorage.setItem(POPUP_SEEN_KEY, '1');
    } catch {
      // localStorage unavailable (private browsing, storage quota) — skip.
    }
  };

  const dismiss = () => {
    setVisible(false);
    markSeen();
  };

  useEffect(() => {
    // Only one mounted instance should ever own the hint per page load —
    // see the comment on hintClaimedThisPageLoad above.
    if (hintClaimedThisPageLoad) return;

    let timer: ReturnType<typeof setTimeout>;

    try {
      const alreadySeen = localStorage.getItem(POPUP_SEEN_KEY) === '1';

      // Show only if:
      //   1. This is the first visit (popup not yet seen), AND
      //   2. The site is genuinely in dark mode right now.
      if (!alreadySeen && theme === 'dark') {
        hintClaimedThisPageLoad = true;
        // Mark as seen immediately — prevents re-show on quick refresh.
        markSeen();
        setVisible(true);
        timer = setTimeout(() => setVisible(false), VISIBLE_MS);
      } else if (!alreadySeen && theme === 'light') {
        // First visit but in light mode (user had a saved light preference
        // from another session or the context resolved to light). Mark as
        // seen so we don't bother them later, but don't show the popup.
        hintClaimedThisPageLoad = true;
        markSeen();
      }
    } catch {
      // localStorage unavailable (private browsing, storage quota) — skip.
    }

    return () => clearTimeout(timer);
  // Re-evaluate once the theme value settles on mount. After that, `theme`
  // changes are user-initiated toggles — we don't re-show the popup then.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="pointer-events-none absolute right-0 top-full z-[60] mt-3"
      aria-live="polite"
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            className="pointer-events-auto w-60 max-w-[calc(100vw-2rem)] rounded-2xl border border-sky-400/30 bg-[rgba(8,14,24,0.96)] p-4 text-left shadow-glow backdrop-blur-xl"
          >
            {/* Connector arrow pointing back up at the toggle */}
            <div className="absolute -top-1.5 right-5 h-3 w-3 rotate-45 border-l border-t border-sky-400/30 bg-[rgba(8,14,24,0.96)]" />

            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sky-300">
                <Moon className="h-3.5 w-3.5" />
              </span>
              <p className="text-xs leading-relaxed text-white/85">
                You&rsquo;re viewing Dio in dark mode. You can switch to light
                mode from here.
              </p>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss"
                className="-mr-1 -mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white/85"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
