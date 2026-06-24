'use client';

// ============================================================================
// ContactSection
// ----------------------------------------------------------------------------
// Final contact section. Only Instagram, X, YouTube, and Email per the
// brief (explicitly no TikTok/Behance/Vimeo/LinkedIn/phone). Includes a
// contact form with name, email, project type, budget range, an optional
// WhatsApp number, message, and an optional file attachment — submitted
// directly to Formspree.
//
// Budget range logic:
// - "$15 to $30" is only selectable when project type is "Reels & Shorts"
//   or "Review Video" (see LOW_BUDGET_ELIGIBLE_TYPES in lib/data.ts).
// - The budget field is built as a custom pill-button group rather than a
//   native <select> specifically so a disabled option can still intercept
//   a click and explain itself via a toast — native <select> options can't
//   do that; the browser simply ignores clicks on disabled <option>s.
// - Because it's a button group (not a real form field), its value is
//   mirrored into a hidden <input name="budgetRange"> below so Formspree
//   still receives it.
// - If the project type changes away from an eligible type while "$15 to
//   $30" is still selected, the budget auto-resets to "$40 to $70" and a
//   toast explains why.
//
// WhatsApp field:
// - Optional, two parts: a custom searchable country selector (with flag +
//   name + dialCode) and a plain number input. Neither is `required`.
// - AUTO-DETECT: on mount, the component calls ipapi.co/json/ to get the
//   visitor's country ISO code and pre-selects the matching entry from
//   lib/countries.ts. If that API fails (offline, blocked, rate-limited)
//   it silently falls back to Algeria (+213). The user can always change
//   the selection manually.
// - Formspree receives four WhatsApp fields:
//     whatsappCountry   — country name (e.g. "Algeria")
//     whatsappDialCode  — dial code (e.g. "+213")
//     whatsappNumber    — raw number the user typed (e.g. "555123456")
//     whatsappFullNumber — combined (e.g. "+213 555123456")
// ============================================================================

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { Instagram, Youtube, Mail, Send, CheckCircle2, Paperclip, ChevronDown, Search, X as XClose } from 'lucide-react';
import {
  contactLinks,
  isValidContactLink,
  projectTypes,
  budgetRanges,
  LOW_BUDGET_ELIGIBLE_TYPES,
  type ProjectType,
  type BudgetRange,
} from '@/lib/data';
import { COUNTRIES, DEFAULT_COUNTRY, findCountryByIso, type Country } from '@/lib/countries';
import { FadeIn } from './FadeIn';
import { Toast, type ToastState } from './Toast';

// ----------------------------------------------------------------------------
// FORMSPREE SETUP
// ----------------------------------------------------------------------------
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdaronqa';

// X (formerly Twitter) icon
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const CONTACT_BUTTONS = [
  { label: 'Instagram', href: contactLinks.instagram, icon: Instagram },
  { label: 'X', href: contactLinks.x, icon: XIcon },
  { label: 'YouTube', href: contactLinks.youtube, icon: Youtube },
  // Email uses clipboard copy — no href/mailto needed
  { label: 'Email', href: '', icon: Mail },
].filter(({ label, href }) =>
  // Email is always shown (it's not gated by isValidContactLink — it's
  // built from contactLinks.email, not a raw URL field). Every other
  // button only renders when its underlying link is real, so a button
  // like YouTube with no channel yet (contactLinks.youtube === '') stays
  // hidden without needing special-casing per platform.
  label === 'Email' ? true : isValidContactLink(href)
);

const FALLBACK_BUDGET: BudgetRange = '$40 to $70';
const LOW_BUDGET: BudgetRange = '$15 to $30';
const CUSTOM_BUDGET: BudgetRange = 'Custom budget';
const CUSTOM_BUDGET_MIN = 15;

const TOAST_MESSAGES = {
  resetByProjectType:
    "The price you have selected isn't available for this project type.",
  blockedByProjectType:
    "The budget range you have selected isn't available for the selected project type.",
  customBudgetTooLow: `Custom budget must be at least $${CUSTOM_BUDGET_MIN}.`,
  success: "Project request sent. I'll get back to you soon.",
  error: 'Something went wrong. Please try again or email me directly.',
};

function isLowBudgetEligible(projectType: string): boolean {
  return LOW_BUDGET_ELIGIBLE_TYPES.includes(projectType as ProjectType);
}

// ============================================================================
// ProjectTypeSelector — custom premium dropdown (replaces native <select>)
// ============================================================================
interface ProjectTypeSelectorProps {
  value: ProjectType | '';
  onChange: (value: ProjectType) => void;
}

function ProjectTypeSelector({ value, onChange }: ProjectTypeSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (type: ProjectType) => {
    onChange(type);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={value || 'Select a project type'}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-canvas px-4 py-3 text-sm outline-none transition-colors focus:border-sky-400 hover:border-sky-300 dark:bg-white/5 ${
          open
            ? 'border-sky-400 dark:border-sky-400/60'
            : 'border-line dark:border-sky-500/20'
        } ${
          value
            ? 'text-ink dark:text-white'
            : 'text-muted dark:text-white/35'
        }`}
      >
        <span className="truncate text-left">
          {value || 'Select a project type'}
        </span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-muted dark:text-white/40 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-full rounded-2xl border border-line bg-white shadow-xl ring-1 ring-black/5 dark:border-sky-400/15 dark:bg-[rgba(10,16,28,0.98)] dark:ring-0">
          <ul
            role="listbox"
            className="max-h-60 overflow-y-auto py-1.5 overscroll-contain"
          >
            {(projectTypes as readonly string[]).map((type) => (
              <li
                key={type}
                role="option"
                aria-selected={type === value}
                onClick={() => handleSelect(type as ProjectType)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-sky-50 dark:hover:bg-sky-500/10 ${
                  type === value
                    ? 'bg-sky-50 text-sky-700 font-semibold dark:bg-sky-500/20 dark:text-sky-300'
                    : 'text-ink dark:text-white/80'
                }`}
              >
                {type}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CountrySelector — custom searchable dropdown
// ============================================================================
interface CountrySelectorProps {
  selected: Country;
  onChange: (country: Country) => void;
}

function CountrySelector({ selected, onChange }: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = query.trim()
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.dialCode.includes(query) ||
          c.iso.toLowerCase().includes(query.toLowerCase())
      )
    : COUNTRIES;

  const handleSelect = (country: Country) => {
    onChange(country);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative flex-shrink-0 w-52 sm:w-56">
      {/* Trigger button — closed state shows: 🇩🇿 Algeria +213 */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${selected.name} ${selected.dialCode}`}
        className="flex w-full items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-3 text-sm text-ink outline-none transition-colors focus:border-sky-400 hover:border-sky-300 dark:border-sky-500/20 dark:bg-white/5 dark:text-white"
      >
        {/* Flag image from flagcdn.com — falls back to ISO text if image fails */}
        <img
          src={`https://flagcdn.com/w20/${selected.iso.toLowerCase()}.png`}
          srcSet={`https://flagcdn.com/w40/${selected.iso.toLowerCase()}.png 2x`}
          width={20}
          height={15}
          alt={selected.name}
          aria-hidden="true"
          onError={(e) => {
            // If CDN image fails, swap to a small ISO-code text badge
            const target = e.currentTarget;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement | null;
            if (fallback) fallback.style.display = 'inline';
          }}
          className="flex-shrink-0 rounded-[2px] object-cover"
          style={{ width: 20, height: 15 }}
        />
        {/* Hidden ISO fallback — shown only when the flag image fails to load */}
        <span
          className="flex-shrink-0 rounded bg-sky-100 px-1 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-700 dark:bg-sky-500/20 dark:text-sky-300"
          style={{ display: 'none' }}
          aria-hidden="true"
        >
          {selected.iso}
        </span>
        {/* Country name */}
        <span className="flex-1 truncate text-left font-medium">{selected.name}</span>
        {/* Dial code */}
        <span className="flex-shrink-0 text-xs text-muted font-mono dark:text-white/45">{selected.dialCode}</span>
        <ChevronDown
          className={`h-3 w-3 flex-shrink-0 text-muted dark:text-white/40 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-72 rounded-2xl border border-line bg-white shadow-xl ring-1 ring-black/5 dark:border-sky-400/15 dark:bg-[rgba(10,16,28,0.98)] dark:ring-0">
          {/* Search bar */}
          <div className="flex items-center gap-2 border-b border-line px-3 py-2.5 dark:border-sky-500/15">
            <Search className="h-3.5 w-3.5 flex-shrink-0 text-muted dark:text-white/40" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code…"
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted dark:text-white dark:placeholder:text-white/35"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-muted hover:text-ink dark:text-white/40 dark:hover:text-white"
                aria-label="Clear search"
              >
                <XClose className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Country list */}
          <ul
            role="listbox"
            className="max-h-56 overflow-y-auto py-1.5 overscroll-contain"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-muted text-center dark:text-white/45">No results</li>
            ) : (
              filtered.map((country) => (
                <li
                  key={country.iso}
                  role="option"
                  aria-selected={country.iso === selected.iso}
                  onClick={() => handleSelect(country)}
                  className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-sky-50 dark:hover:bg-sky-500/10 ${
                    country.iso === selected.iso
                      ? 'bg-sky-50 text-sky-700 font-semibold dark:bg-sky-500/20 dark:text-sky-300'
                      : 'text-ink dark:text-white/80'
                  }`}
                >
                  {/* Flag image — ISO badge shown as fallback if CDN image fails */}
                  <span className="flex-shrink-0 w-6 flex items-center justify-center">
                    <img
                      src={`https://flagcdn.com/w20/${country.iso.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w40/${country.iso.toLowerCase()}.png 2x`}
                      width={20}
                      height={15}
                      alt={country.name}
                      aria-hidden="true"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.style.display = 'inline';
                      }}
                      className="rounded-[2px] object-cover"
                      style={{ width: 20, height: 15 }}
                    />
                    <span
                      className="rounded bg-sky-100 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide text-sky-700 dark:bg-sky-500/20 dark:text-sky-300"
                      style={{ display: 'none' }}
                      aria-hidden="true"
                    >
                      {country.iso}
                    </span>
                  </span>
                  <span className="flex-1 truncate">{country.name}</span>
                  <span className="flex-shrink-0 text-xs text-muted font-mono dark:text-white/40">{country.dialCode}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ContactSection
// ============================================================================
export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const [budgetError, setBudgetError] = useState(false);
  const [customBudget, setCustomBudget] = useState('');
  const [customBudgetError, setCustomBudgetError] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  // WhatsApp country — starts as Algeria (default), then overridden by IP
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);

  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: '' as ProjectType | '',
    budget: '' as BudgetRange | '',
    whatsappNumber: '',
    message: '',
  });

  // ---------------------------------------------------------------------------
  // AUTO-DETECT user country via IP geolocation
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) return;
        return res.json();
      })
      .then((data) => {
        if (data?.country_code) {
          setSelectedCountry(findCountryByIso(data.country_code));
        }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeout));

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const showToast = (text: string) => setToast({ text, key: Date.now() });

  const eligibleForLowBudget = isLowBudgetEligible(form.projectType);

  useEffect(() => {
    if (form.budget === LOW_BUDGET && !eligibleForLowBudget && form.projectType !== '') {
      setForm((prev) => ({ ...prev, budget: FALLBACK_BUDGET }));
      showToast(TOAST_MESSAGES.resetByProjectType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.projectType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProjectTypeChange = (value: ProjectType) => {
    setForm((prev) => ({ ...prev, projectType: value }));
  };

  const handleAttachmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setAttachmentName(file ? file.name : null);
  };

  const handleBudgetSelect = (budget: BudgetRange) => {
    if (budget === LOW_BUDGET && !eligibleForLowBudget) {
      showToast(TOAST_MESSAGES.blockedByProjectType);
      return;
    }
    setForm((prev) => ({ ...prev, budget }));
    setBudgetError(false);
    if (budget !== CUSTOM_BUDGET) {
      setCustomBudgetError(false);
    }
  };

  const handleCustomBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomBudget(val);
    if (val === '' || Number(val) >= CUSTOM_BUDGET_MIN) {
      setCustomBudgetError(false);
    }
  };

  const handleCustomBudgetBlur = () => {
    if (customBudget !== '' && Number(customBudget) < CUSTOM_BUDGET_MIN) {
      setCustomBudgetError(true);
      showToast(TOAST_MESSAGES.customBudgetTooLow);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.budget) {
      setBudgetError(true);
      return;
    }

    if (form.budget === CUSTOM_BUDGET) {
      const val = Number(customBudget);
      if (!customBudget || isNaN(val) || val < CUSTOM_BUDGET_MIN) {
        setCustomBudgetError(true);
        showToast(TOAST_MESSAGES.customBudgetTooLow);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Inject projectType from controlled state (not a native select anymore)
      formData.set('projectType', form.projectType);

      formData.set('whatsappCountry', selectedCountry.name);
      formData.set('whatsappDialCode', selectedCountry.dialCode);
      const rawNumber = form.whatsappNumber.trim();
      formData.set('whatsappNumber', rawNumber);
      formData.set(
        'whatsappFullNumber',
        rawNumber ? `${selectedCountry.dialCode} ${rawNumber}` : ''
      );

      formData.set('customBudget', form.budget === CUSTOM_BUDGET ? `$${customBudget}` : '');

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Formspree responded with an error');
      }

      setSubmitted(true);
      showToast(TOAST_MESSAGES.success);
    } catch {
      showToast(TOAST_MESSAGES.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-pad relative overflow-hidden bg-paper/[0.78] py-24 sm:py-32 dark:bg-[rgba(7,11,18,0.88)]">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[480px] bg-sky-radial" />

      <div className="mx-auto max-w-3xl text-center">
        <FadeIn>
          <span className="timecode">05 / CONTACT</span>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h2 className="mt-5 font-sans text-4xl font-bold tracking-tight text-ink sm:text-5xl dark:text-white">
            Have footage? Let&rsquo;s turn it into something unforgettable.
          </h2>
        </FadeIn>

        <FadeIn delay={0.16}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {CONTACT_BUTTONS.map(({ label, href, icon: Icon }) =>
              label === 'Email' ? (
                // Copy email to clipboard instead of opening mailto
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(contactLinks.email).then(() => {
                      setEmailCopied(true);
                      setTimeout(() => setEmailCopied(false), 2000);
                    });
                  }}
                  className="group relative flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700 hover:shadow-card-hover dark:border-sky-500/20 dark:bg-white/5 dark:text-white dark:hover:border-sky-400/40 dark:hover:text-sky-300"
                >
                  <Icon className="h-4 w-4" />
                  {emailCopied ? 'Email copied' : label}
                </button>
              ) : (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700 hover:shadow-card-hover dark:border-sky-500/20 dark:bg-white/5 dark:text-white dark:hover:border-sky-400/40 dark:hover:text-sky-300"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              )
            )}
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.22}>
        <div className="mx-auto mt-14 max-w-xl rounded-4xl border border-line bg-white p-8 shadow-card sm:p-10 dark:border-sky-400/15 dark:bg-[rgba(10,16,28,0.97)]">
          {submitted ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-sky-500" />
              <h3 className="mt-4 font-sans text-xl font-bold text-ink dark:text-white">
                Project request sent.
              </h3>
              <p className="mt-2 text-sm text-muted dark:text-white/55">
                I&rsquo;ll get back to you soon.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              method="POST"
              action={FORMSPREE_ENDPOINT}
              encType="multipart/form-data"
              className="flex flex-col gap-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-medium text-ink dark:text-white/85">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-sky-400 dark:border-sky-500/20 dark:bg-white/5 dark:text-white placeholder:dark:text-white/30"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-ink dark:text-white/85">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    className="rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-sky-400 dark:border-sky-500/20 dark:bg-white/5 dark:text-white placeholder:dark:text-white/30"
                  />
                </div>
              </div>

              {/* Project type — custom premium dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink dark:text-white/85">
                  Project type
                </label>
                {/* Hidden input so Formspree still receives projectType as a named field */}
                <input type="hidden" name="projectType" value={form.projectType} />
                <ProjectTypeSelector
                  value={form.projectType}
                  onChange={handleProjectTypeChange}
                />
              </div>

              {/* Budget range — custom pill group */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink dark:text-white/85">Budget range</span>
                <div className="flex flex-wrap gap-2">
                  {budgetRanges.map((budget) => {
                    const isLowTier = budget === LOW_BUDGET;
                    const isCustom = budget === CUSTOM_BUDGET;
                    const isDisabled = isLowTier && !eligibleForLowBudget;
                    const isSelected = form.budget === budget;

                    return (
                      <button
                        key={budget}
                        type="button"
                        onClick={() => handleBudgetSelect(budget)}
                        aria-pressed={isSelected}
                        aria-disabled={isDisabled}
                        title={
                          isDisabled
                            ? 'Only available for Reels & Shorts or Review Video'
                            : undefined
                        }
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                          isSelected
                            ? // Active / selected — sky-blue gradient, white text
                              'border-sky-500 bg-gradient-to-r from-sky-500 to-sky-700 text-white shadow-sm'
                            : isDisabled
                              ? // Disabled — muted but readable in both themes
                                'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-sky-500/15 dark:bg-white/[0.06] dark:text-white/35'
                              : isCustom
                                ? // Custom budget pill — dashed border, sky accent
                                  'border-dashed border-sky-300 bg-canvas text-sky-700 hover:border-sky-500 hover:bg-sky-50 dark:border-sky-400/60 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:border-sky-400 dark:hover:bg-sky-500/15'
                                : // Normal unselected pill
                                  'border-line bg-canvas text-ink/80 hover:border-sky-300 hover:text-ink dark:border-sky-500/20 dark:bg-white/5 dark:text-white/65 dark:hover:border-sky-400/40 dark:hover:text-white'
                        }`}
                      >
                        {budget}
                      </button>
                    );
                  })}
                </div>

                {/* Custom budget input — shown only when "Custom budget" is selected */}
                {form.budget === CUSTOM_BUDGET && (
                  <div className="mt-2 flex flex-col gap-1">
                    <div className="relative">
                      {/* Dollar prefix */}
                      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-medium text-muted dark:text-white/40">
                        $
                      </span>
                      <input
                        type="number"
                        min={CUSTOM_BUDGET_MIN}
                        step="1"
                        value={customBudget}
                        onChange={handleCustomBudgetChange}
                        onBlur={handleCustomBudgetBlur}
                        placeholder={`Enter amount (min $${CUSTOM_BUDGET_MIN})`}
                        aria-label="Custom budget amount in dollars"
                        className={`w-full rounded-xl border bg-canvas py-3 pl-8 pr-4 text-sm text-ink outline-none transition-colors focus:border-sky-400 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 ${
                          customBudgetError ? 'border-red-400' : 'border-line dark:border-sky-500/20'
                        }`}
                      />
                    </div>
                    {customBudgetError && (
                      <p className="text-xs font-medium text-red-500">
                        Custom budget must be at least ${CUSTOM_BUDGET_MIN}.
                      </p>
                    )}
                  </div>
                )}

                {budgetError && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    Please select a budget range.
                  </p>
                )}
                {/* Hidden field mirrors the selected pill value for Formspree */}
                <input type="hidden" name="budgetRange" value={form.budget} />
              </div>

              {/* WhatsApp — fully optional. */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="whatsappNumber" className="text-sm font-medium text-ink dark:text-white/85">
                  WhatsApp <span className="text-muted dark:text-white/40">(optional)</span>
                </label>
                <div className="flex items-start gap-2">
                  {/* Custom searchable country selector */}
                  <CountrySelector
                    selected={selectedCountry}
                    onChange={setSelectedCountry}
                  />
                  {/* Number field */}
                  <input
                    id="whatsappNumber"
                    name="whatsappNumber"
                    type="tel"
                    value={form.whatsappNumber}
                    onChange={handleChange}
                    placeholder="e.g. 555 123 456"
                    className="flex-1 min-w-0 rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-sky-400 dark:border-sky-500/20 dark:bg-white/5 dark:text-white placeholder:dark:text-white/30"
                  />
                </div>
                {/* Preview of the combined number — only shown when user has typed */}
                {form.whatsappNumber.trim() && (
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted dark:text-white/40">
                    <img
                      src={`https://flagcdn.com/w20/${selectedCountry.iso.toLowerCase()}.png`}
                      width={16}
                      height={12}
                      alt={selectedCountry.name}
                      aria-hidden="true"
                      className="rounded-[2px] object-cover"
                      style={{ width: 16, height: 12 }}
                    />
                    {selectedCountry.dialCode} {form.whatsappNumber.trim()}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-sm font-medium text-ink dark:text-white/85">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your footage and what you need."
                  className="resize-none rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-sky-400 dark:border-sky-500/20 dark:bg-white/5 dark:text-white placeholder:dark:text-white/30"
                />
              </div>

              {/* Attachment */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="attachment" className="text-sm font-medium text-ink dark:text-white/85">
                  Attachment <span className="text-muted dark:text-white/40">(optional)</span>
                </label>
                <label
                  htmlFor="attachment"
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-line bg-canvas px-4 py-3 text-sm text-muted transition-colors hover:border-sky-300 hover:bg-sky-50 dark:border-sky-500/20 dark:bg-white/5 dark:text-white/45 dark:hover:border-sky-400/40"
                >
                  <span className="flex items-center gap-2 overflow-hidden">
                    <Paperclip className="h-4 w-4 flex-shrink-0 text-sky-600" />
                    <span className="truncate">
                      {attachmentName ?? 'Send an attachment — brief, screenshot, reference…'}
                    </span>
                  </span>
                  <span className="flex-shrink-0 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink dark:border-sky-500/20 dark:bg-white/10 dark:text-white">
                    Choose file
                  </span>
                </label>
                <input
                  id="attachment"
                  name="attachment"
                  type="file"
                  onChange={handleAttachmentChange}
                  accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.mp4,.mov,.zip"
                  className="sr-only"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-2 flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-ink dark:bg-sky-500 dark:hover:bg-sky-400 dark:disabled:hover:bg-sky-500"
              >
                {isSubmitting ? 'Sending…' : 'Send message'}
                <Send
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isSubmitting ? 'animate-pulse' : 'group-hover:translate-x-1'
                  }`}
                />
              </button>
            </form>
          )}
        </div>
      </FadeIn>

      <Toast toast={toast} onDone={() => setToast(null)} />
    </section>
  );
}
