'use client';

// ============================================================================
// ThemeContext
// ----------------------------------------------------------------------------
// Manages light / dark theme state for the whole site.
//
// - First-time visitors (no saved preference yet) default to DARK mode.
//   The no-flash inline script in app/layout.tsx already adds the `dark`
//   class before hydration; this context keeps React state in sync.
// - Once a visitor has explicitly chosen a theme via the header toggle,
//   that choice is saved to localStorage and always respected afterwards.
//   The site never force-switches someone back to dark on a later visit.
// - Adds/removes the `dark` class on <html> so Tailwind `dark:` utilities
//   activate globally.
// ============================================================================

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'Luuk-theme';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
});

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Default to dark — matches the no-flash inline script in app/layout.tsx,
  // which adds the `dark` class before hydration for anyone without a saved
  // preference. Keeps first paint and first client render in agreement.
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Read saved preference on mount.
    let resolved: Theme = 'dark'; // default for first-time visitors
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (saved === 'light' || saved === 'dark') {
        resolved = saved;
      }
      // No saved value → first-time visitor → keep dark default.
      // We intentionally do NOT write to localStorage here — only an
      // explicit toggle should create the saved record, so "no preference"
      // and "explicitly chose dark" stay distinct.
    } catch {
      // localStorage unavailable — fall back to dark.
    }

    setTheme(resolved);
    // Always call applyTheme to make sure the <html> class is in sync with
    // the resolved theme, even if the inline script already ran.
    applyTheme(resolved);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore storage errors.
      }
      applyTheme(next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
