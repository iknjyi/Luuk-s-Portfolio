'use client';

// ============================================================================
// Toast
// ----------------------------------------------------------------------------
// A small, premium, self-dismissing notification used by ContactSection to
// explain why a budget option isn't available for the selected project
// type. Intentionally generic so it can be reused anywhere else on the
// site later without changes.
//
// `toast` is { text, key } rather than a plain string: `key` is a number
// the caller bumps every time it wants to (re)show a toast, even if the
// text is identical to what's already showing. Without that, setting
// React state to the exact same string twice in a row is a no-op (React
// bails out before re-rendering), so a repeated warning would never
// restart its own dismiss timer.
//
// Usage:
//   const [toast, setToast] = useState<{ text: string; key: number } | null>(null);
//   setToast({ text: 'Some message', key: Date.now() });
//   <Toast toast={toast} onDone={() => setToast(null)} />
// ============================================================================

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Info } from 'lucide-react';

const AUTO_DISMISS_MS = 3200;

export type ToastState = { text: string; key: number };

export function Toast({
  toast,
  onDone,
}: {
  toast: ToastState | null;
  onDone: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDone, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-arm whenever `toast.key` changes, even on repeated text
  }, [toast?.key]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[200] flex justify-center px-4 sm:bottom-8"
      aria-live="polite"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            className="pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl border border-sky-100 bg-white/95 px-5 py-4 shadow-glow backdrop-blur-xl"
          >
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
              <Info className="h-3.5 w-3.5" />
            </span>
            <p className="text-sm leading-snug text-ink/85">{toast.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
