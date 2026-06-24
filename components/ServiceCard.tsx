'use client';

// ============================================================================
// ServiceCard
// ----------------------------------------------------------------------------
// Reusable card for the "What I edit best" grid. Resolves an icon name from
// the data file via a lookup map, lifts gently on hover, and shows its
// EDIT/0x code as a timecode-style tag — tying back to the site's signature
// motif. Pure presentational component; takes its content via props.
// ============================================================================

import { motion } from 'framer-motion';
import {
  Zap,
  Clapperboard,
  BookOpen,
  MessageSquareText,
  Magnet,
  Sparkles,
  Smile,
  Hexagon,
  type LucideIcon,
} from 'lucide-react';
import type { ServiceItem } from '@/lib/data';

const ICONS: Record<string, LucideIcon> = {
  Zap,
  Clapperboard,
  BookOpen,
  MessageSquareText,
  Magnet,
  Sparkles,
  Smile,
  Hexagon,
};

export function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const Icon = ICONS[service.icon] ?? Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col rounded-3xl border border-line bg-white p-7 shadow-card transition-shadow duration-300 hover:shadow-card-hover dark:border-sky-500/15 dark:bg-[rgba(12,20,35,0.85)] dark:hover:border-sky-500/30"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition-colors duration-300 group-hover:bg-sky-500 group-hover:text-white dark:bg-sky-500/15 dark:text-sky-400 dark:group-hover:bg-sky-500 dark:group-hover:text-white">
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <span className="timecode text-sky-500/70 dark:text-sky-400/70">{service.code}</span>
      </div>

      <h3 className="mt-6 font-sans text-lg font-bold tracking-tight text-ink dark:text-white">
        {service.title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted dark:text-white/55">
        {service.description}
      </p>

      {/* Subtle bottom accent line that grows on hover */}
      <div className="mt-6 h-px w-full bg-line dark:bg-white/10">
        <div className="h-px w-0 bg-sky-400 transition-all duration-500 group-hover:w-full" />
      </div>
    </motion.div>
  );
}
