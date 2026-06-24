// ============================================================================
// lib/videos.ts  —  Central video source registry
// ============================================================================
// Every video used on the website is defined here.
// To swap a video, change its path in this file — no need to touch any
// component code.
//
// ─── FILE PLACEMENT ────────────────────────────────────────────────────────
//
//   Put your MP4 files inside the `public/` folder so Next.js can serve them.
//   In code, paths start with `/media/...` — NOT `/public/media/...`.
//
//   Folder layout:
//
//   public/
//   ├── media/
//   │   ├── videos/          ← hero preview + showreel (longer clips)
//   │   │   ├── hero-preview.mp4
//   │   │   └── showreel-2026.mp4
//   │   ├── clips/           ← short looping per-project clips, organized
//   │   │   │                  into one subfolder per category, e.g.:
//   │   │   ├── brand-ads/
//   │   │   ├── product-reviews/
//   │   │   ├── energetic-edits/    ← NEW: fast TikTok-style edits
//   │   │   │                          (1 wide 16:9 + 2 square 1:1 clips)
//   │   │   └── trailers-teasers/   ← NEW: 2 wide 16:9 trailer/teaser clips
//   │   └── thumbs/          ← static thumbnail images for project cards
//   │       └── *.jpg / *.webp
//
// ─── HOW PATHS WORK ────────────────────────────────────────────────────────
//
//   The `public/` folder is the webserver root. A file saved at:
//     public/media/videos/showreel-2026.mp4
//   is served at:
//     /media/videos/showreel-2026.mp4
//   That `/media/videos/showreel-2026.mp4` is the value you put here.
//
// ─── FALLBACK BEHAVIOUR ────────────────────────────────────────────────────
//
//   If a video file doesn't exist yet:
//   • Hero   → the sky-blue gradient background is shown (safe fallback).
//   • Showreel modal → the gradient placeholder surface is shown.
//   • Project clips  → the gradient placeholder is shown on the card/modal.
//   Nothing breaks — the gradients are always rendered underneath.
//
// ─── VIDEO QUALITY TIPS ────────────────────────────────────────────────────
//
//   • Encode as H.264 MP4 for maximum browser compatibility.
//   • Hero / Showreel: aim for 1080p, ≤ 8 MB (use HandBrake or ffmpeg).
//   • Micro-Transitions clips: aim for ≤ 2 MB each (they loop constantly).
//   • Use `ffmpeg -i input.mov -vcodec libx264 -crf 28 -preset slow output.mp4`
//     for a good quality/size balance.
// ============================================================================

export const VIDEO_SOURCES = {
  // --------------------------------------------------------------------------
  // Hero section — silent, looping, autoplay background preview card.
  // File location: public/media/videos/hero-preview.mp4
  // Recommended: portrait/square crop, muted, ≤ 6 MB.
  // --------------------------------------------------------------------------
  heroPreview: '/media/videos/hero-preview.mp4',

  // --------------------------------------------------------------------------
  // Showreel — plays automatically (muted) on the card in the "Showreel"
  // section, and again (auLuuk ON) in the full-screen ShowreelModal when the
  // visitor clicks "Watch Showreel" or the showreel card.
  //
  // NOTE: The dedicated "Showreel" section (components/Showreel.tsx) is
  // currently DISABLED / not rendered on the page (commented out in
  // app/page.tsx) until the final showreel video is ready. This source
  // value is left in place because the Hero's "Watch Showreel" button still
  // opens ShowreelModal, which uses this same path — changing or removing
  // it would affect that unrelated flow. Update this path whenever the
  // real showreel file is ready, regardless of when the section itself is
  // re-enabled.
  //
  // File location: public/media/videos/showreel-2026.mp4
  // Recommended: 16:9, with auLuuk, ≤ 80 MB (or use a YouTube embed instead).
  // TO REPLACE: drop your .mp4 into public/media/videos/ (keeping the same
  // filename) or update the path below to point at a new filename.
  // --------------------------------------------------------------------------
  showreel: '/media/videos/showreel-2026.mp4',
} as const;

export type VideoSourceKey = keyof typeof VIDEO_SOURCES;

// ─── PER-PROJECT VIDEO CLIPS ────────────────────────────────────────────────
// Every project's clip is stored on its project object as `videoSrc` in
// lib/data.ts — not here. This keeps each clip co-located with its title,
// description, and tools.
//
// To change a clip, open lib/data.ts and update the `videoSrc` field on the
// relevant project, e.g.:
//
//   {
//     id: 'spin-wheel-bridge',
//     title: 'Spin Select',
//     category: 'Micro-Transitions / Visual Bridges',
//     videoSrc: '/media/clips/micro-transitions/fc.mp4',  // ← change this
//     ...
//   }
//
// Drop the new .mp4 into the matching public/media/clips/<category>/
// subfolder and update the path above.
//
// Each project also has an optional `format` field controlling the modal's
// aspect ratio: 'wide' (16:9), 'vertical' (9:16), or 'square' (1:1).
// Energetic Edits is the only category that mixes 'wide' and 'square' —
// see the comments above its entries in lib/data.ts.
// ─────────────────────────────────────────────────────────────────────────────
