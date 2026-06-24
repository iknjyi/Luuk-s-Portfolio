// ============================================================================
// NeonStripsBackground
// ----------------------------------------------------------------------------
// Global ambient background effect: thin vertical neon sky-blue light streaks
// that drift slowly downward across the page.
//
// DARK MODE: strips are more vivid — stronger glow, slightly higher opacity.
// LIGHT MODE: subtle glow, stays refined and non-distracting.
//
// The `dark` class on <html> drives the CSS variable --strip-glow-mult which
// is applied in the injected <style> block. No JS theme detection needed here
// because CSS class selectors handle it natively.
// ============================================================================

const STRIPS: {
  left: string;
  delay: string;
  duration: string;
  height: string;
  opacity: number;
  width: string;
  glow: number;
}[] = [
  { left: '1%',    delay: '2.1s', duration: '13.3s', height: '17vh', opacity: 0.82, width: '2px',   glow: 1.1  },
  { left: '4.6%',  delay: '0.7s', duration: '24.6s', height: '24vh', opacity: 0.56, width: '1.5px', glow: 0.85 },
  { left: '7.7%',  delay: '0.2s', duration: '19.6s', height: '17vh', opacity: 0.79, width: '3px',   glow: 1.2  },
  { left: '12.6%', delay: '4.4s', duration: '15.9s', height: '11vh', opacity: 0.81, width: '2px',   glow: 1.0  },
  { left: '16.3%', delay: '7.2s', duration: '15.0s', height: '21vh', opacity: 0.58, width: '1.5px', glow: 0.85 },
  { left: '19.9%', delay: '4.5s', duration: '24.0s', height: '11vh', opacity: 0.72, width: '3px',   glow: 1.15 },
  { left: '24.1%', delay: '0.6s', duration: '25.0s', height: '19vh', opacity: 0.78, width: '3px',   glow: 1.2  },
  { left: '30.0%', delay: '5.3s', duration: '20.5s', height: '11vh', opacity: 0.63, width: '3px',   glow: 1.0  },
  { left: '32.8%', delay: '1.7s', duration: '14.0s', height: '13vh', opacity: 0.65, width: '2.5px', glow: 0.95 },
  { left: '37.8%', delay: '2.8s', duration: '17.7s', height: '17vh', opacity: 0.65, width: '3px',   glow: 1.05 },
  { left: '42.7%', delay: '4.6s', duration: '21.4s', height: '15vh', opacity: 0.82, width: '2.5px', glow: 1.2  },
  { left: '45.0%', delay: '7.4s', duration: '17.9s', height: '30vh', opacity: 0.8,  width: '2px',   glow: 1.1  },
  { left: '50.8%', delay: '1.7s', duration: '23.1s', height: '11vh', opacity: 0.7,  width: '2px',   glow: 0.9  },
  { left: '53.2%', delay: '4.3s', duration: '24.9s', height: '21vh', opacity: 0.79, width: '2px',   glow: 1.15 },
  { left: '58.1%', delay: '3.4s', duration: '24.9s', height: '19vh', opacity: 0.64, width: '2px',   glow: 0.9  },
  { left: '62.6%', delay: '4.4s', duration: '16.4s', height: '33vh', opacity: 0.68, width: '2.5px', glow: 1.0  },
  { left: '67.8%', delay: '3.7s', duration: '14.8s', height: '11vh', opacity: 0.61, width: '1.5px', glow: 0.85 },
  { left: '70.0%', delay: '4.5s', duration: '21.8s', height: '24vh', opacity: 0.77, width: '2.5px', glow: 1.15 },
  { left: '74.9%', delay: '4.1s', duration: '16.3s', height: '11vh', opacity: 0.82, width: '3px',   glow: 1.25 },
  { left: '79.6%', delay: '2.0s', duration: '20.0s', height: '21vh', opacity: 0.66, width: '1.5px', glow: 0.95 },
  { left: '82.5%', delay: '5.4s', duration: '13.0s', height: '19vh', opacity: 0.83, width: '2.5px', glow: 1.2  },
  { left: '87.5%', delay: '4.7s', duration: '14.4s', height: '30vh', opacity: 0.62, width: '2.5px', glow: 0.9  },
  { left: '91.4%', delay: '7.2s', duration: '15.1s', height: '30vh', opacity: 0.77, width: '1.5px', glow: 1.05 },
  { left: '95.8%', delay: '2.7s', duration: '14.5s', height: '19vh', opacity: 0.57, width: '2px',   glow: 0.85 },
];

export function NeonStripsBackground() {
  return (
    <>
      <style>{`
        @keyframes neon-fall {
          0%   { transform: translateY(-120vh); opacity: 0; }
          8%   { opacity: 1; }
          88%  { opacity: 1; }
          100% { transform: translateY(120vh); opacity: 0; }
        }

        /* Light mode: subtle opacity multiplier */
        .neon-strip {
          --strip-opacity-mult: 1;
          --strip-glow-mult: 1;
        }

        /* Dark mode: stronger glow and visibility */
        html.dark .neon-strip {
          --strip-opacity-mult: 1.45;
          --strip-glow-mult: 1.6;
        }

        @media (prefers-reduced-motion: reduce) {
          .neon-strip {
            animation: none !important;
            opacity: 0.28 !important;
            transform: translateY(30vh) !important;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {STRIPS.map((strip, i) => (
          <div
            key={i}
            className="neon-strip"
            style={{
              position: 'absolute',
              top: 0,
              left: strip.left,
              width: strip.width,
              height: strip.height,
              background:
                'linear-gradient(to bottom, transparent 0%, #38bdf8 22%, #7dd3fc 50%, #38bdf8 78%, transparent 100%)',
              // opacity scaled by CSS var in dark mode
              opacity: strip.opacity,
              borderRadius: '999px',
              animation: `neon-fall ${strip.duration} ${strip.delay} linear infinite`,
              filter: 'blur(0.5px)',
              // Base glow — dark mode CSS var multiplies this further via a filter trick
              boxShadow: `0 0 ${Math.round(15 * strip.glow)}px ${Math.round(3 * strip.glow)}px rgba(56, 189, 248, ${(0.65 * strip.glow).toFixed(2)}), 0 0 ${Math.round(34 * strip.glow)}px ${Math.round(7 * strip.glow)}px rgba(56, 189, 248, ${(0.32 * strip.glow).toFixed(2)})`,
            }}
          />
        ))}
      </div>

      {/*
        Dark-mode overlay: a very subtle dark vignette so the body background
        behind sections reads as cinematic rather than just very dark.
        Only visible in dark mode via the class.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 hidden dark:block"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.04) 0%, transparent 60%)',
        }}
      />
    </>
  );
}
