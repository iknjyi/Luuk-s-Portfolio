'use client';

// ============================================================================
// Header
// ----------------------------------------------------------------------------
// Sticky navigation bar with glass treatment. Includes theme toggle (sun/moon)
// beside the CTA button. On mobile the toggle appears inside the pill nav bar.
// ============================================================================

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeTipBubble } from './ThemeTipPopup';
import { useTheme } from '@/lib/theme-context';

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:px-6 sm:pt-5">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-5xl rounded-full border backdrop-blur-xl transition-all duration-500 ${
          scrolled ? 'py-2' : 'py-2.5'
        } ${
          isDark
            ? 'border-sky-500/20 bg-[rgba(7,11,18,0.82)] shadow-dark-nav'
            : 'border-white/60 bg-nav-glass shadow-card'
        }`}
      >
        <nav className="flex items-center justify-between px-4 sm:px-6">
          {/* Brand */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#top');
            }}
            className={`font-sans text-lg font-bold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-ink'
            }`}
          >
            Luuk
          </a>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isDark
                    ? 'text-white/70 hover:bg-white/10 hover:text-white'
                    : 'text-ink/80 hover:bg-white/70 hover:text-ink'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA + Theme toggle */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="relative">
              <ThemeToggle />
              <ThemeTipBubble />
            </div>
            <button
              onClick={() => handleNavClick('#contact')}
              className={`group flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                isDark
                  ? 'bg-sky-500 text-white hover:bg-sky-400'
                  : 'bg-ink text-white hover:bg-sky-600'
              }`}
            >
              Start a Project
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Mobile: toggle + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="relative">
              <ThemeToggle />
              <ThemeTipBubble />
            </div>
            <button
              className={`flex items-center justify-center rounded-full p-2 transition-colors ${
                isDark ? 'text-white' : 'text-ink'
              }`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.div>

      {/* Mobile menu panel */}
      <motion.div
        initial={false}
        animate={
          mobileOpen
            ? { opacity: 1, y: 0, pointerEvents: 'auto' }
            : { opacity: 0, y: -10, pointerEvents: 'none' }
        }
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute left-4 right-4 top-[72px] z-40 rounded-3xl border p-3 backdrop-blur-xl md:hidden ${
          isDark
            ? 'border-sky-500/20 bg-[rgba(10,15,25,0.95)] shadow-dark-nav'
            : 'border-white/60 bg-white/95 shadow-nav'
        }`}
      >
        <div className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`rounded-2xl px-4 py-3 text-left text-base font-medium transition-colors ${
                isDark
                  ? 'text-white/80 hover:bg-white/10 hover:text-white'
                  : 'text-ink/80 hover:bg-sky-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('#contact')}
            className={`mt-1 rounded-2xl px-4 py-3 text-center text-base font-semibold transition-colors ${
              isDark
                ? 'bg-sky-500 text-white hover:bg-sky-400'
                : 'bg-ink text-white'
            }`}
          >
            Start a Project
          </button>
        </div>
      </motion.div>
    </header>
  );
}
