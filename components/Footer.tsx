'use client';

// ============================================================================
// Footer
// ----------------------------------------------------------------------------
// Clean closing footer: brand name, tagline, the same four contact links as
// ContactSection, and a copyright line. Kept visually quiet — this is not
// a place for new visual statements.
// ============================================================================

import { useState } from 'react';
import { Instagram, Youtube, Mail } from 'lucide-react';
import { contactLinks, isValidContactLink } from '@/lib/data';

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const LINKS = [
  { label: 'Instagram', href: contactLinks.instagram, icon: Instagram },
  { label: 'X', href: contactLinks.x, icon: XIcon },
  { label: 'YouTube', href: contactLinks.youtube, icon: Youtube },
  // Email uses clipboard copy — href left empty, handled via onClick
  { label: 'Email', href: '', icon: Mail },
].filter(({ label, href }) =>
  // Same gating as ContactSection: Email always shows, everything else
  // only shows when it has a real (non-empty, non-placeholder) link.
  label === 'Email' ? true : isValidContactLink(href)
);

export function Footer() {
  const year = new Date().getFullYear();
  const [emailCopied, setEmailCopied] = useState(false);

  function handleEmailClick() {
    navigator.clipboard.writeText(contactLinks.email).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  }

  return (
    <footer className="section-pad border-t border-line bg-canvas/[0.78] py-12 dark:border-sky-500/10 dark:bg-[rgba(7,11,18,0.92)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-sans text-lg font-bold tracking-tight text-ink dark:text-white">Luuk</p>
          <p className="mt-1 text-sm text-muted dark:text-white/50">Video Editor &amp; Content Creator</p>
        </div>

        <div className="flex items-center gap-2">
          {LINKS.map(({ label, href, icon: Icon }) =>
            label === 'Email' ? (
              // Copy email to clipboard instead of opening mailto
              <button
                key={label}
                type="button"
                onClick={handleEmailClick}
                aria-label={emailCopied ? 'Email copied' : label}
                title={emailCopied ? 'Email copied!' : contactLinks.email}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink/70 transition-colors hover:border-sky-300 hover:text-sky-600 dark:border-sky-500/20 dark:bg-white/5 dark:text-white/55 dark:hover:border-sky-400/50 dark:hover:text-sky-300"
              >
                <Icon className="h-4 w-4" />
                {emailCopied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-xs font-medium text-white dark:bg-white dark:text-ink">
                    Email copied
                  </span>
                )}
              </button>
            ) : (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink/70 transition-colors hover:border-sky-300 hover:text-sky-600 dark:border-sky-500/20 dark:bg-white/5 dark:text-white/55 dark:hover:border-sky-400/50 dark:hover:text-sky-300"
              >
                <Icon className="h-4 w-4" />
              </a>
            )
          )}
        </div>

        <p className="text-xs text-muted dark:text-white/35">
          © {year} Luuk. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
