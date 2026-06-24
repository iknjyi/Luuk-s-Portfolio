'use client';

// ============================================================================
// ThemeToggle
// ----------------------------------------------------------------------------
// A minimal pill-style sun / moon toggle that sits in the header.
// Switches between light and dark mode and persists the choice.
// ============================================================================

import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`
        relative flex h-8 w-[58px] items-center rounded-full border p-0.5 transition-all duration-500
        ${isDark
          ? 'border-sky-500/40 bg-sky-950/60 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
          : 'border-sky-200 bg-white/80 shadow-card'
        }
      `}
    >
      {/* Sliding knob */}
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 36 }}
        className={`
          flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-300
          ${isDark
            ? 'ml-[26px] bg-sky-400 text-sky-950'
            : 'ml-0 bg-ink text-white'
          }
        `}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Moon className="h-3.5 w-3.5" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: 30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -30, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Sun className="h-3.5 w-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  );
}
