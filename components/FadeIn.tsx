'use client';

// ============================================================================
// FadeIn
// ----------------------------------------------------------------------------
// Wraps any block of content and reveals it with a soft upward fade the
// first time it scrolls into view. Used throughout the site instead of
// repeating the same Framer Motion config in every component.
// ============================================================================

import { motion, type Variants } from 'framer-motion';
import { ReactNode } from 'react';

const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export function FadeIn({
  children,
  delay = 0,
  className,
  y = 28,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export const fadeVariants = variants;
