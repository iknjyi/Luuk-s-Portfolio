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

const PREVIEW_VIDEO_SELECTOR = '[data-preview-video="true"]';

/**
 * Pause and re-mute every ambient preview video currently in the DOM.
 *
 * Call this synchronously, BEFORE opening any detail/modal video (project
 * modal or showreel modal), so the about-to-open video is guaranteed to be
 * the only audible/playing video on the page.
 *
 * Safe to call even if no preview videos are mounted (no-op), and safe to
 * call repeatedly (idempotent).
 */
export function pauseAllPreviewVideos(): void {
  if (typeof document === 'undefined') return; // SSR guard

  const videos = document.querySelectorAll<HTMLVideoElement>(PREVIEW_VIDEO_SELECTOR);
  videos.forEach((video) => {
    // Mute first so there is no audible blip even if pause() is briefly
    // delayed by the browser.
    video.muted = true;
    video.defaultMuted = true;
    if (!video.paused) {
      video.pause();
    }
    // We deliberately do NOT reset currentTime to 0 here — rewinding every
    // ambient preview every time any single card is opened would restart
    // clips the visitor wasn't even looking at, which is a worse UX than
    // leaving them paused mid-loop. Each preview resumes from where it left
    // off once nothing is hovered / once the modal closes.
  });
}

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
