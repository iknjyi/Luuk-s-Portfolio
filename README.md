# Luuk — Video Editor & Content Creator Portfolio

A premium, cinematic portfolio site built with Next.js, Tailwind CSS, and
Framer Motion.

## Getting started

This project's dependencies could not be installed in the sandbox that
built it (no network access), so before running it locally:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To build for production:

```bash
npm run build
npm start
```

## Project structure

```
app/
  layout.tsx        Root layout — loads Inter + JetBrains Mono fonts
  page.tsx           Assembles every section in order
  globals.css        Base styles, focus rings, scrollbar, reduced-motion support
components/
  Header.tsx          Sticky sky-blue glass nav, mobile menu, smooth in-page scroll
  Hero.tsx            Headline, CTAs, cinematic video preview card
  MovingFocusBar.tsx  Endless looping marquee of focus areas
  AboutIntro.tsx      "Who I Am" section with highlighted key phrases
  ServiceCard.tsx     Reusable service card (icon, title, description)
  Services.tsx        "What I edit best" grid using ServiceCard
  ProjectCard.tsx     Reusable project card (large/small variants)
  SelectedWorks.tsx   "Selected works" grid using ProjectCard
  ProjectModal.tsx    Full-screen project detail overlay
  CreatorIconPopup.tsx Clickable creator/team icon with connected popover
  CreatorsSection.tsx  "Who have I worked with?" grid
  Showreel.tsx         Dark cinematic showreel section
  ShowreelModal.tsx    Shared video player overlay (Hero + Showreel both open this)
  ContactSection.tsx   Headline, social buttons, contact form with budget-range logic
  Toast.tsx            Small premium auto-dismissing notification (used for budget rules)
  Footer.tsx           Brand, tagline, social links, copyright
  PageShell.tsx        Wires up the shared overlay system used by every section
  FadeIn.tsx           Shared scroll-reveal wrapper used throughout
lib/
  data.ts              ALL editable content — services, projects, collaborators, links
  overlay-context.tsx  Shared state for project modal / showreel modal
```

## Customizing content

Almost everything you'll want to change lives in **`lib/data.ts`**:

- `services` — the 8 "What I edit best" cards
- `focusAreas` — the looping marquee text
- `projects` — the Selected Works grid (title, category, description, tools,
  thumbnail path, and whether it's a "large" or "small" card)
- `collaborators` — the creator/team popup data
- `contactLinks` — Instagram, X, YouTube, email
- `projectTypes`, `budgetRanges`, `LOW_BUDGET_ELIGIBLE_TYPES` — the Contact
  form's dropdown/pill options. The lowest budget tier ("$15 to $30") is
  only selectable for the project types listed in
  `LOW_BUDGET_ELIGIBLE_TYPES` — add or remove entries there to change which
  project types qualify.

### Connecting the contact form to receive real submissions

Right now submitting the form just shows a "Message sent." confirmation —
nothing is actually emailed anywhere yet. Open `components/ContactSection.tsx`
and look for the `CONNECT YOUR EMAIL SERVICE HERE` comment block inside
`handleSubmit` — it has copy-pasteable code for two options (Formspree, or
a Next.js API route with Resend).

Editing this file does not require touching any component or styling code.

## How to replace videos

All video paths are controlled from **two places** — no hunting through
component code:

| Video | Edit this file | Field |
|---|---|---|
| Hero preview card (silent loop) | `lib/videos.ts` | `heroPreview` |
| Showreel modal player | `lib/videos.ts` | `showreel` |
| Micro-Transitions clips | `lib/data.ts` | `videoSrc` on each project |

### Step 1 — Put your MP4 file in the right folder

```
public/
└── media/
    ├── videos/       ← hero preview + showreel (longer clips)
    │   ├── hero-preview.mp4
    │   └── showreel.mp4
    ├── clips/        ← short looping Micro-Transitions clips
    │   ├── spin-wheel-bridge.mp4
    │   ├── zoom-whip-bridge.mp4
    │   ├── glitch-cut-bridge.mp4
    │   └── card-flip-bridge.mp4
    └── thumbs/       ← static thumbnail images for project cards
        └── *.jpg
```

> ⚠️ **Important path rule**: In the code the path starts with `/media/...`,
> NOT `/public/media/...`. The `public/` folder is the webserver root —
> Next.js strips it automatically.
>
> ✅ Correct: `/media/videos/showreel.mp4`  
> ❌ Wrong:   `/public/media/videos/showreel.mp4`

### Step 2 — Update the path

**Hero preview** (silent looping card in the Hero section):

Open `lib/videos.ts` and change `heroPreview`:

```ts
export const VIDEO_SOURCES = {
  heroPreview: '/media/videos/hero-preview.mp4',  // ← change this
  showreel: '/media/videos/showreel.mp4',
};
```

**Showreel** (plays when visitor clicks "Watch Showreel"):

Open `lib/videos.ts` and change `showreel`:

```ts
export const VIDEO_SOURCES = {
  heroPreview: '/media/videos/hero-preview.mp4',
  showreel: '/media/videos/showreel.mp4',    // ← change this
};
```

**Micro-Transitions clip** (e.g. the "Spin Select" card):

Open `lib/data.ts`, find the project by its `id` or `title`, and update
`videoSrc`:

```ts
{
  id: 'spin-wheel-bridge',
  title: 'Spin Select',
  category: 'Micro-Transitions / Visual Bridges',
  videoSrc: '/media/clips/spin-wheel-bridge.mp4',  // ← change this
  ...
}
```

### Fallback behaviour

If a video file doesn't exist yet, **nothing breaks**. Every video element
has a sky-blue gradient rendered underneath it — that gradient is shown
instead until you add the real file.

### Video quality tips

- **Format**: H.264 MP4 for maximum browser compatibility.
- **Hero / Showreel**: aim for 1080p, ≤ 8 MB for the hero; ≤ 80 MB for
  the showreel (or use a YouTube embed in `ShowreelModal.tsx`).
- **Micro-Transitions clips**: aim for ≤ 2 MB each — they loop constantly.
- **Quick encode command**:
  ```bash
  ffmpeg -i input.mov -vcodec libx264 -crf 28 -preset slow -movflags +faststart output.mp4
  ```
  The `-movflags +faststart` flag moves metadata to the front of the file
  so playback starts before the entire file has downloaded.

## Design system

Colors, fonts, shadows, and animation timing are all defined centrally in
`tailwind.config.js` (see the `theme.extend` block) and `app/globals.css`.
Changing the `sky` color scale or `paper`/`canvas`/`ink` tokens there will
update the whole site consistently.

The small monospace "timecode" labels (e.g. `EDIT/01`, `00:00 / Luuk —
EDITOR`) are the site's signature visual motif, styled once via the
`.timecode` utility class in `globals.css`.

## Notes

- Every overlay (project details, showreel) is driven by one shared context
  in `lib/overlay-context.tsx` — opening any project card, the hero preview,
  or the showreel card all route through the same modal system, so behavior
  stays consistent if you add more triggers later.
- Animations respect `prefers-reduced-motion`.
- The contact form currently shows a client-side "Message sent" confirmation
  on submit but isn't wired to a real backend — connect it to an email
  service (e.g. Resend, Formspree) or your own API route when ready.
