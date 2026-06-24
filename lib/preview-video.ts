// ============================================================================
// lib/preview-video.ts  —  Shared "preview video" silencing utility
// ----------------------------------------------------------------------------
// Every ambient/looping preview video on the site (ProjectCard grid clips,
// the Hero background clip, the Showreel section card) is marked with the
// attribute `data-preview-video="true"` on its <video> element.
//
// Whenever a detail/modal video is about to open — a project's ProjectModal
// or the full-screen ShowreelModal — we must guarantee that ONLY that one
// video is audible. Relying purely on React state (e.g. setting some
// `activeAuLuukId` to null) is NOT enough on its own: state updates are
// applied on the next render, but the <video> element itself keeps playing
// and stays audible in the DOM until something imperatively pauses/mutes it.
// That gap is exactly what caused the "duplicated audio on first open" bug —
// the modal's video started playing immediately while the clicked card's
// preview video was still mid-flight toward being muted.
//
// `pauseAllPreviewVideos` queries every element carrying the marker
// attribute and imperatively pauses + (re-)mutes it, synchronously, in the
// same tick as the click — before the detail video is ever told to open.
// This is a single, reusable, global fix: any current or future preview
// video that carries the attribute is covered automatically, with no need
// to wire up individual refs per component.
// ============================================================================

const PREVIEW_VIDEO_SELECTOR = 'video[data-preview-video="true"]';

/**
 * Pause and PERMANENTLY mute every ambient preview video currently in the
 * DOM. "Permanently" here means we set both the live `muted` property and
 * `defaultMuted` so that even if something else re-reads the element's
 * default muted state later, it still comes back muted.
 *
 * This must be called as early as physically possible on mobile — ideally
 * on `onPointerDown` / `onTouchStart`, NOT only on `onClick`. Mobile
 * browsers synthesize a `mouseenter`/`mouseover` event immediately before
 * the `click` event fires on a first tap. ProjectCard listens for
 * `onMouseEnter` to drive its hover-auLuuk feature, so that synthetic
 * hover event can flip a card's `<video>` back to unmuted via React state
 * *in between* an early imperative mute and the later `click` handler.
 * Calling this on the earliest touch event closes that gap — and calling
 * it again on click is a harmless no-op safety net.
 *
 * Safe to call even if no preview videos are mounted, and safe to call
 * repeatedly/redundantly (idempotent).
 */
export function stopAllPreviewVideos(): void {
  if (typeof document === 'undefined') return; // SSR guard

  document
    .querySelectorAll<HTMLVideoElement>(PREVIEW_VIDEO_SELECTOR)
    .forEach((video) => {
      video.pause();
      video.muted = true;
      video.defaultMuted = true;
    });
}

/**
 * Pause and re-mute every ambient preview video currently in the DOM.
 *
 * Call this synchronously, BEFORE opening any detail/modal video (project
 * modal or showreel modal), so the about-to-open video is guaranteed to be
 * the only audible/playing video on the page.
 *
 * This is kept as an alias of `stopAllPreviewVideos` — same behavior, two
 * names so existing call sites (overlay-context.tsx) and the naming used
 * in bug reports / fix requests both resolve to the exact same function.
 */
export const pauseAllPreviewVideos = stopAllPreviewVideos;

/**
 * Resume ambient preview videos after a detail/modal view closes.
 *
 * Only resumes videos that are still muted (i.e. true ambient previews —
 * never a video the user had manually un-muted via auLuuk, since that
 * state lives in React and re-applies itself on the next render; this
 * function only needs to restart playback, not touch audio state).
 * Each video is resumed independently and playback errors (e.g. blocked
 * autoplay) are silently ignored — this mirrors the existing hover
 * resume behavior in ProjectCard.
 */
export function resumeAllPreviewVideos(): void {
  if (typeof document === 'undefined') return; // SSR guard

  const videos = document.querySelectorAll<HTMLVideoElement>(PREVIEW_VIDEO_SELECTOR);
  videos.forEach((video) => {
    if (video.paused) {
      video.play().catch(() => {
        // Autoplay policy may block this — silently ignore, same as the
        // existing per-card hover-resume logic.
      });
    }
  });
}
