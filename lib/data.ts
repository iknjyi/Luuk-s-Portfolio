// ============================================================================
// SITE CONTENT — edit everything here to update the live site.
// Nothing in this file affects layout or styling, only the words, links,
// and placeholder media. Swap placeholder image/video paths for your own
// assets in /public when ready.
// ============================================================================

export type ServiceItem = {
  id: string;
  code: string; // timecode-style tag, e.g. "EDIT/01"
  title: string;
  description: string;
  icon: string; // lucide-react icon name, resolved in ServiceCard
};

export const services: ServiceItem[] = [
  {
    id: 'reels-shorts',
    code: 'EDIT/01',
    title: 'Reels & Shorts',
    description:
      'Short-form edits designed for retention, speed, rhythm, and strong visual impact.',
    icon: 'Zap',
  },
  {
    id: 'trailers-teasers',
    code: 'EDIT/02',
    title: 'Trailers & Teasers',
    description:
      'Cinematic previews that build hype, emotion, and curiosity in a short amount of time.',
    icon: 'Clapperboard',
  },
  {
    id: 'storytelling',
    code: 'EDIT/03',
    title: 'Storytelling Edits',
    description:
      'Edits focused on structure, pacing, emotion, and keeping the viewer invested from start to finish.',
    icon: 'BookOpen',
  },
  {
    id: 'review-analysis',
    code: 'EDIT/04',
    title: 'Review & Analysis Videos',
    description:
      'Clean and engaging edits for product reviews, game reviews, football match reviews, reactions, breakdowns, and commentary content.',
    icon: 'MessageSquareText',
  },
  {
    id: 'hook-intros',
    code: 'EDIT/05',
    title: 'YouTube Hook Intros',
    description:
      'High-retention first 30 seconds designed to grab attention immediately and stop viewers from clicking away.',
    icon: 'Magnet',
  },
  {
    id: 'motion-graphics',
    code: 'EDIT/06',
    title: 'Motion Graphics',
    description:
      'Clean animated titles, callouts, transitions, captions, visual effects, and modern graphic elements.',
    icon: 'Sparkles',
  },
  {
    id: 'comedy-personality',
    code: 'EDIT/07',
    title: 'Comedy & Personality Reels',
    description:
      'Funny, non-serious, personality-driven edits with unique pacing, timing, storytelling, memes, and creative visual rhythm.',
    icon: 'Smile',
  },
  {
    id: 'creator-brand',
    code: 'EDIT/08',
    title: 'Creator & Brand Content',
    description:
      "Professional social media and branded videos designed to match a creator's or brand's identity.",
    icon: 'Hexagon',
  },
];

export const focusAreas: string[] = [
  'Reels & Shorts',
  'Trailers & Teasers',
  'Storytelling Edits',
  'Product Review Videos',
  'Gaming Review Videos',
  'Football Match Edits',
  'YouTube Hook Intros',
  'First 30 Seconds Retention',
  'Motion Graphics',
  'Comedy & Personality Reels',
  'Funny Story-Driven Edits',
  'Creator Content',
  'Brand Content',
  'Social Media Edits',
];

// ----------------------------------------------------------------------------
// Selected Works — category taxonomy
// ----------------------------------------------------------------------------
// The Selected Works section is organized into tabs instead of one long
// grid. Each project belongs to exactly one of these categories via its
// `category` field below. Add/rename categories here and update the
// `category` value on the relevant projects — the tab list renders from
// this array automatically.
export type WorkCategory =
  | 'Brand ADS'
  | 'YouTube Hook Intros'
  | 'Micro-Transitions / Visual Bridges'
  | 'Comedy & Personality Edits'
  | 'Product Review'
  | 'Cinematic Videos'
  | 'Storytelling'
  | 'Energetic Edits'
  | 'Trailers / Teasers';

export const workCategories: WorkCategory[] = [
  'Brand ADS',
  'YouTube Hook Intros',
  'Micro-Transitions / Visual Bridges',
  'Comedy & Personality Edits',
  'Product Review',
  'Cinematic Videos',
  'Storytelling',
  'Energetic Edits',
  'Trailers / Teasers',
];

// "Micro-Transitions / Visual Bridges" is the only category that shows 4
// looping video previews instead of 2 static cards — everything else uses
// this default.
export const EXAMPLES_PER_CATEGORY: Record<WorkCategory, number> = {
  'Brand ADS': 2,
  'YouTube Hook Intros': 2,
  'Micro-Transitions / Visual Bridges': 4,
  'Comedy & Personality Edits': 2,
  'Product Review': 2,
  'Cinematic Videos': 2,
  Storytelling: 2,
  'Energetic Edits': 3,
  'Trailers / Teasers': 2,
};

export type Project = {
  id: string;
  code: string; // e.g. "REEL_07"
  title: string;
  category: WorkCategory; // must match one of `workCategories` above
  description: string;
  longDescription: string;
  tools: string[];
  focus: string;
  size: 'large' | 'small'; // controls grid sizing in SelectedWorks
  /**
   * Thumbnail image shown on the project card and in the modal header.
   * Drop files into:  public/media/thumbs/
   * Path format:      '/media/thumbs/filename.jpg'   (no /public prefix)
   * Supported formats: .jpg .jpeg .webp .png
   * Recommended size: 800×600 px or larger.
   */
  thumbnail: string;
  /**
   * Short looping video clip — only used for "Micro-Transitions / Visual
   * Bridges" projects. Plays autoPlay/muted/loop/playsInline with no
   * browser controls on the card and in the project modal.
   *
   * Drop files into:  public/media/clips/
   * Path format:      '/media/clips/filename.mp4'    (no /public prefix)
   * Recommended: H.264 MP4, ≤ 2 MB each (these loop constantly).
   * Use: ffmpeg -i input.mov -vcodec libx264 -crf 28 -preset slow out.mp4
   *
   * If this field is omitted, the gradient placeholder is shown instead.
   *
   * Hero and Showreel video paths live in lib/videos.ts, not here.
   */
  videoSrc?: string;
  /**
   * Controls the aspect ratio used in the project modal video area.
   *   'wide'     — 16:9 cinematic (Brand ADS, YouTube Hook Intros,
   *                Micro-Transitions, Cinematic Videos, Trailers/Teasers)
   *   'vertical' — 9:16 reel-style (Comedy & Personality, Product Review,
   *                Storytelling)
   *   'square'   — 1:1 reel-style (Energetic Edits square clips). Uses the
   *                same left-video / right-details modal layout as
   *                'vertical', just with a 1:1 frame instead of 9:16.
   * Defaults to 'wide' when absent (backwards-compatible).
   */
  format?: 'wide' | 'vertical' | 'square';
};

// ─── VIDEO PATHS — QUICK REFERENCE ─────────────────────────────────────────
// Hero preview video:   lib/videos.ts → VIDEO_SOURCES.heroPreview
// Showreel video:       lib/videos.ts → VIDEO_SOURCES.showreel
// Project clip videos:  `videoSrc` field on each project below
//                       Drop clips in public/media/clips/
// ─────────────────────────────────────────────────────────────────────────────
export const projects: Project[] = [
  // ---- Brand ADS ---------------------------------------------------------
  // Place video files in: public/media/clips/brand-ads/
  // Both Brand ADS examples are 16:9 and stacked one on top of the other
  // (see SelectedWorks.tsx) — no vertical/reel cards in this category.
  {
  id: 'falcons-barns-brand-ad',
  code: 'Falcons X Barns ',
  title: "Team Falcons x Barn's Coffee",
  category: 'Brand ADS',
  description:
    "A partnership launch ad for Team Falcons and Barn's Coffee, built around a playful prize-journey concept with branded motion, 3D objects, and high-energy reveal pacing.",
  longDescription:
    "A fast-paced promotional brand ad created for the Team Falcons x Barn's Coffee collaboration. The concept is built around a stylized 3D roadmap/journey that guides the viewer through the campaign, mixing 3D coins, prize counters, product shots, and branded reward items with clean 2D and 3D motion elements. The edit combines smooth transitions, animated typography, layered object reveals, and campaign-driven pacing to make the promotion feel clear, energetic, and visually memorable while keeping both brands strongly present throughout the ad.",
  tools: ['Premiere Pro', 'After Effects'],
  focus:
    'Brand integration, 2D/3D motion design, campaign storytelling, animated typography, object reveals, promo pacing',
  size: 'large',
  thumbnail: '/media/thumbs/falcons-barns-brand-ad.jpg',
  videoSrc: '/media/clips/brand-ads/falconsxbarns.mp4',
  format: 'wide',
},
  {
  id: 'falcons-macqueen-ewc-ad',
  code: 'MACQUEEN X FALCONS',
  title: 'Team Falcons x MacQueen Flights',
  category: 'Brand ADS',
  description:
    'A cinematic partnership ad for Team Falcons and MacQueen Flights, built around a custom 3D airplane, branded sky-world visuals, and a smooth transition into the EWC destination.',
  longDescription:
    'A promotional brand ad created for the collaboration between Team Falcons and MacQueen Flights Agency. The concept centers around a custom 3D airplane flying through a fully designed sky background, creating a travel-focused visual journey that transitions seamlessly into the EWC location. The edit combines 3D motion, clean branded composition, smooth transitions, and destination-reveal storytelling to make the campaign feel premium, dynamic, and visually memorable while connecting travel, esports, and event excitement in one sequence.',
  tools: ['After Effects', 'Premiere Pro'],
  focus:
    '3D motion design, brand storytelling, custom environment design, smooth transitions, destination reveal, campaign pacing',
  size: 'large',
  format: 'wide',
  thumbnail: '/media/thumbs/falcons-macqueen-ewc-ad.jpg',
  videoSrc: '/media/clips/brand-ads/macqueen-ad.mp4',
},

  // ---- YouTube Hook Intros ------------------------------------------------
  {
  id: 'youtube-hook',
  code: 'STORY GAME HOOK',
  title: '3D Penacony Hook',
  category: 'YouTube Hook Intros',
  description:
    'A 3D-heavy hook intro built to open the video with movement, depth, and a strong visual identity before the main story begins.',
  longDescription:
    'A custom 3D intro created for a {Honkai:Star Rail} video project, designed to make the first seconds feel like a complete visual experience instead of a normal opening. The sequence uses a stylized 3D room, animated 3D text, a custom TV setup, floating planets, smooth camera movement, and clean transitions to introduce the video’s concept with energy and personality. It focuses on grabbing attention early, building curiosity, and giving the video a unique identity before the gameplay/story starts.',
  tools: ['Premiere Pro', 'Photoshop', 'After Effects'],
  focus: '3D scene design, animated typography, smooth camera movement, hook pacing, visual identity',
  size: 'large',
  thumbnail: '/media/thumbs/youtube-hook.jpg',
  videoSrc: '/media/clips/hook-intros/penacony-intro.mp4',
  format: 'wide',
},
  {
  id: 'solo-leveling-arise-hook',
  code: 'GAME HOOK',
  title: 'Solo Leveling Arise Hook',
  category: 'YouTube Hook Intros',
  description:
    'A high-energy gaming hook intro built with glowing 3D text, particle motion, and fast visual reveals to pull the viewer into the video immediately.',
  longDescription:
    'A cinematic hook intro created for a Solo Leveling: Arise video, designed to make the opening feel dramatic, fast, and visually memorable. The sequence combines dark particle-space visuals, glowing Arabic and English 3D typography, bold neon highlights, character/gameplay moments, and smooth transitions to build curiosity before the main video begins. The edit turns the first seconds into a strong visual statement, helping the viewer understand the video’s energy, theme, and payoff quickly.',
  tools: ['Premiere Pro', 'After Effects'],
  focus:
    '3D typography, particle atmosphere, gaming hook structure, neon highlights, smooth transition flow',
  size: 'large',
  thumbnail: '/media/thumbs/solo-leveling-arise-hook.jpg',
  videoSrc: '/media/clips/hook-intros/SLarise-intro.mp4',
  format: 'wide',
},

  // ---- Micro-Transitions / Visual Bridges (4 examples, looping video) ---
  {
id: 'spin-wheel-bridge',
code: 'MICRO TRANSITION',
title: '10 Games Challenge Selector',
category: 'Micro-Transitions / Visual Bridges',
description:
'A fast game-selector transition used to reveal the next challenge in a “win 10 games in 1 hour” video.',
longDescription:
'A short, high-energy visual bridge designed for a fast-paced gaming challenge format. In this edit, the selector reveals the next game in a “winning 10 games in 1 hour” video, turning a simple scene change into a moment of suspense, movement, and viewer anticipation. Instead of cutting directly to the next game, the transition makes each new segment feel intentional, fun, and easier to follow.',
tools: ['Photoshop', 'After Effects'],
focus: 'Game reveal, challenge pacing, visual suspense, segment transition',
size: 'small',
thumbnail: '/media/thumbs/spin-wheel.jpg',
videoSrc: '/media/clips/micro-transitions/fc.mp4',
format: 'wide',
}
,
  {
  id: 'hsr-day-transition',
  code: 'MICRO TRANSITION',
  title: '7-Day HSR Transition',
  category: 'Micro-Transitions / Visual Bridges',
  description:
    'A cinematic text reveal used as a visual bridge for a “playing HSR for 7 days” video, blending the title directly into the game’s atmosphere.',
  longDescription:
    'A short visual bridge created for a “playing Honkai: Star Rail for 7 days” format. The transition merges bold Arabic typography with the game’s background, lighting, and color palette, making the text feel like part of the scene instead of a simple overlay. It helps introduce a new day or chapter with a cinematic feel while keeping the viewer inside the game’s world.',
  tools: ['After Effects'],
  focus: 'Text integration, cinematic atmosphere, game-inspired color matching, chapter transition',
  size: 'small',
  thumbnail: '/media/thumbs/hsr-day-transition.jpg',
  videoSrc: '/media/clips/micro-transitions/penacony-transition.mp4',
  format: 'wide',
},
  {
  id: 'hsr-compass-day-reveal',
  code: 'MICRO TRANSITION',
  title: 'Compass Day Reveal',
  category: 'Micro-Transitions / Visual Bridges',
  description:
    'A rotating compass transition used to reveal and highlight the selected day in a “playing HSR for 7 days” video.',
  longDescription:
    'A short visual bridge created for a “playing Honkai: Star Rail for 7 days” format. The compass rotates through the numbered days before stopping on the selected one, then highlights it to clearly introduce the next chapter. The motion gives the transition a sense of direction, progression, and anticipation while keeping the viewer inside the video’s adventure-style theme.',
  tools: ['After Effects'],
  focus: 'Day reveal, rotating motion, chapter transition, visual anticipation',
  size: 'small',
  thumbnail: '/media/thumbs/hsr-compass-day-reveal.jpg',
  videoSrc: '/media/clips/micro-transitions/jarilo-transition.mp4',
  format: 'wide',
},
  {
  id: 'peaks-alaseel-mini-games',
  code: 'MICRO TRANSITION',
  title: 'Mini Games Transition Pack',
  category: 'Micro-Transitions / Visual Bridges',
  description:
    'A set of four quick visual transitions created for a Team Peaks x Alaseel collaboration video built around Saudi thobe-themed mini games.',
  longDescription:
    'A compact transition pack made for a collaboration between Team Peaks and Alaseel, a Saudi thobe brand, where the creators played multiple mini games. The clip combines four different micro-transitions in one sequence, using playful Arabic typography, branded pattern backgrounds, animated cards, colored shape movement, pixel-style thobe visuals, and fast object reveals to move between game moments clearly and creatively. Each transition keeps the video energetic while matching the cultural theme and visual identity of the Saudi thobe concept.',
  tools: ['After Effects', 'Premiere Pro'],
  focus:
    'Arabic typography, branded motion design, mini-game pacing, cultural visual theme, playful transition variety',
  size: 'small',
  thumbnail: '/media/thumbs/peaks-alaseel-mini-games.jpg',
  videoSrc: '/media/clips/micro-transitions/peaksxalaseel.mp4',
},

  // ---- Comedy & Personality Edits ----------------------------------------
  // Place video files in: public/media/clips/comedy-edits/
  {
  id: 'bald-raed-comedy-edit',
  code: 'COMEDY EDIT',
  title: 'Bald Raed & BanderitaX',
  category: 'Comedy & Personality Edits',
  description:
    'A funny personality-driven edit built around Raed and BanderitaX’s unexpected background appearances after shaving their heads bald.',
  longDescription:
    'A comedy-focused creator edit featuring Raed and BanderitaX from Team Falcons, where their bald look becomes a recurring visual joke throughout the video. Instead of treating their background appearances as normal moments, the edit turns them into comedic highlights with timing, reactions, zooms, and a playful shine effect on their heads. The goal was to make every appearance feel intentional, memorable, and funny without interrupting the main video flow.',
  tools: ['Premiere Pro', 'After Effects'],
  focus:
    'Comedy timing, personality moments, reaction pacing, visual gag enhancement, shine effects',
  size: 'small',
  format: 'vertical',
  thumbnail: '/media/thumbs/bald-raed-comedy-edit.jpg',
  videoSrc: '/media/clips/comedy-edits/bald-raed.mp4',
},
  {
id: 'abu-abeer-chinese-snacks',
code: 'COMEDY REVIEW',
title: 'Abu Abeer Chinese Snacks',
category: 'Comedy & Personality Edits',
description:
'A funny snack-tasting edit where Abu Abeer tries Chinese snacks, enhanced with themed styling, comedic timing, zooms, SFX, and playful reactions.',
longDescription:
'A personality-driven comedy edit featuring Abu Abeer from Team Falcons trying Chinese snacks. The edit leans into the moment with a playful China-inspired visual theme, matching music, funny sound effects, reaction zooms, and quick comedic cuts that make each bite feel more expressive. Instead of treating it like a simple food reaction, the edit turns his facial expressions and reactions into the main entertainment, keeping the pace light, funny, and highly watchable.',
tools: ['Premiere Pro', 'After Effects'],
focus:
'Comedy timing, reaction zooms, themed visual styling, funny SFX, personality-driven pacing',
size: 'small',
format: 'vertical',
thumbnail: '/media/thumbs/abu-abeer-chinese-snacks.jpg',
videoSrc: '/media/clips/comedy-edits/chinese-abuabeer.mp4',
},

  // ---- Product Review ------------------------------------------------------
  // Place video files in: public/media/clips/product-reviews/
  {
  id: 'killerq8y-razer-phantom-green',
  code: 'RAZER',
  title: 'Razer Phantom Green Review',
  category: 'Product Review',
  description:
    'A vertical product review edit for KillerQ8Y, showcasing the Razer Phantom Green bundle with clean b-roll, green lighting, and smooth feature-focused pacing.',
  longDescription:
    'A product review edit created for KillerQ8Y reviewing the Razer Phantom Green bundle. The video combines talking-head moments with detailed b-roll of the setup, headset, keyboard, mouse, packaging, and RGB-style green visuals. The edit uses clean cuts, close-up product shots, Arabic captions, smooth movement, and a consistent green visual identity to make the bundle feel premium, organized, and easy to understand for viewers comparing gaming gear.',
  tools: ['Premiere Pro', 'After Effects'],
  focus:
    'Product b-roll, clean review pacing, Arabic captions, green brand styling, close-up detail shots, gaming setup presentation',
  size: 'small',
  format: 'vertical',
  thumbnail: '/media/thumbs/killerq8y-razer-phantom-green.jpg',
  videoSrc: '/media/clips/product-reviews/killerq8y-razer.mp4',
},
  {
  id: 'killerq8y-doom-figure',
  code: 'DOOM',
  title: 'DOOM Figure Review',
  category: 'Product Review',
  description:
    'A vertical product review edit for KillerQ8Y, built around a funny story setup before revealing the Bethesda DOOM figure with clean product shots and reaction-driven pacing.',
  longDescription:
    'A product review edit created for KillerQ8Y reviewing a Bethesda DOOM figure. The video starts with a comedic story-style build-up, using talking-head moments, phone-call acting, Arabic captions, message overlays, and reaction timing to create curiosity before the product reveal. The second half shifts into focused figure presentation with close-up shots, clean framing, scale comparison, and detail-focused visuals, making the review feel entertaining first and informative after.',
  tools: ['Premiere Pro', 'After Effects'],
  focus:
    'Funny story build-up, Arabic captions, product reveal pacing, reaction timing, close-up figure shots, vertical review editing',
  size: 'small',
  format: 'vertical',
  thumbnail: '/media/thumbs/killerq8y-doom-figure.jpg',
  videoSrc: '/media/clips/product-reviews/killerq8y-doom-figure.mp4',
},

  // ---- Cinematic Videos -----------------------------------------------------
  // Place video files in: public/media/clips/cinematic-videos/
  {
  id: 'farewell-magisk',
  code: 'FAREWELL',
  title: 'Farewell Magisk',
  category: 'Cinematic Videos',
  description:
    'A cinematic farewell video for Magisk after leaving Team Falcons, blending emotional team moments, match highlights, interviews, and monochrome visual storytelling.',
  longDescription:
    'A farewell film created for esports player Magisk after his time with Team Falcons. The edit combines emotional behind-the-scenes moments, player close-ups, match footage, interview lines, team walkouts, and black-and-white cinematic grading to give the video a reflective and respectful tone. The pacing moves between quiet personal moments and intense gameplay highlights, building a tribute that feels emotional, professional, and worthy of a major esports departure.',
  tools: ['Premiere Pro', 'After Effects'],
  focus:
    'Emotional pacing, esports storytelling, match highlight selection, cinematic grading, tribute editing, farewell atmosphere',
  size: 'large',
  format: 'wide',
  thumbnail: '/media/thumbs/farewell-magisk.jpg',
  videoSrc: '/media/clips/cinematic-videos/thank-you-magisk.mp4',
},
  {
  id: 'peterbot-pollo-fncs-finals',
  code: 'ESPORT',
  title: 'FNCS Final Stages',
  category: 'Cinematic Videos',
  description:
    'A cinematic esports video for Peterbot and Pollo during the FNCS final stages, combining player walk-ins, crowd energy, intense Fortnite gameplay, and emotional event atmosphere.',
  longDescription:
    'A cinematic esports edit built around Peterbot and Pollo competing in the FNCS final stages. The video blends Team Falcons arrival moments, stage walk-ins, broadcast graphics, high-pressure Fortnite endgame highlights, player reactions, and black-and-white arena shots to create a dramatic final-stage atmosphere. The pacing moves between calm cinematic build-up and intense competitive gameplay, giving the edit a sense of pressure, focus, and tournament-level importance.',
  tools: ['Premiere Pro', 'After Effects'],
  focus:
    'Esports storytelling, final-stage atmosphere, Fortnite highlight selection, cinematic pacing, player introduction, emotional event build-up',
  size: 'large',
  format: 'wide',
  thumbnail: '/media/thumbs/peterbot-pollo-fncs-finals.jpg',
  videoSrc: '/media/clips/cinematic-videos/fncs-cinematic-teaser.mp4',
},

  // ---- Storytelling ----------------------------------------------------------
  // Place video files in: public/media/clips/storytelling/
  {
  id: 'oda-face-theory-story',
  code: 'THEORY',
  title: 'Why Oda Hides His Face',
  category: 'Storytelling',
  description:
    'A fast-paced storytelling edit exploring why Eiichiro Oda rarely shows his face, using Arabic narration, 3D scenes, visual references, and theory-style pacing.',
  longDescription:
    'A vertical storytelling edit built around the question of why Eiichiro Oda, the creator of One Piece, rarely shows his face publicly. The video uses fast-paced cuts, Arabic captions, reference images, 3D animated scenes, spotlight-style reveals, visual callouts, and theory-style structure to keep the explanation engaging. Instead of presenting the topic as a simple fact video, the edit builds curiosity through layered visuals, quick transitions, and dramatic pacing, making the story feel like a mini investigation designed for short-form retention.',
  tools: ['Premiere Pro', 'After Effects'],
  focus:
    'Storytelling structure, Arabic captions, fast-paced cuts, 3D animation, theory pacing, visual callouts, viewer retention',
  size: 'small',
  format: 'vertical',
  thumbnail: '/media/thumbs/oda-face-theory-story.jpg',
  videoSrc: '/media/clips/story-telling/oda-theory.mp4',
},
  {
  id: 'neymar-alhilal-clap-clause',
  code: 'FOOTBALL',
  title: 'Neymar Weird Clause',
  category: 'Storytelling',
  description:
    'A fast-paced storytelling edit about the viral Neymar x Al Hilal contract clause, explaining how he was reportedly paid for applauding fans after matches.',
  longDescription:
    'A vertical storytelling edit built around the viral story of Neymar’s Al Hilal contract clause, where he was reportedly earning money whenever he applauded fans after a match. The video uses Arabic narration, fast-paced cuts, football references, on-screen captions, money-focused visuals, and quick comedic pacing to turn a strange contract detail into an engaging short-form story. The edit is structured to hook viewers quickly, explain the clause clearly, and keep the topic entertaining through movement, visual emphasis, and retention-focused pacing.',
  tools: ['Premiere Pro', 'After Effects'],
  focus:
    'Football storytelling, Arabic captions, viral sports topic, fast-paced cuts, money visuals, retention editing',
  size: 'small',
  format: 'vertical',
  thumbnail: '/media/thumbs/neymar-alhilal-clap-clause.jpg',
  videoSrc: '/media/clips/story-telling/neymar-money.mp4',
},

  // ---- Energetic Edits ----------------------------------------------------
  // Fast TikTok-style edits: shakes, impact cuts, fast zooms, beat-sync
  // movement, energetic pacing, flashy transitions, high-intensity
  // social-media style.
  //
  // Layout (see SelectedWorks.tsx): 1 wide 16:9 video on top, then 2 square
  // 1:1 videos side by side underneath.
  //
  // PLACE VIDEO FILES IN: public/media/clips/energetic-edits/
  // Drop your real MP4s in that folder using the filenames referenced below
  // (or update the `videoSrc` path here to match your own filenames) —
  // nothing else needs to change.
  {
  id: 'hisoka-national-treasure-edit',
  code: 'EDIT',
  title: 'Hisoka National Treasure',
  category: 'Energetic Edits',
  description:
    'A high-energy personality edit for Hisoka from Team Falcons, built around comedic build-up, dramatic captions, and a hype final section synced to National Treasure by Drake.',
  longDescription:
    'An energetic esports personality edit featuring Hisoka from Team Falcons. The first part builds around a funny fortune-cookie moment with documentary-style pacing, close-up reactions, subtitles, and dramatic visual treatment. The edit then shifts into a stronger hype sequence near the end, using crowd shots, Falcons jersey moments, beat-driven cuts, glow, contrast, and music-sync energy to make the final section feel like a payoff. The pacing moves from comedy and personality into a more intense montage-style finish, giving the clip both humor and impact.',
  tools: ['Premiere Pro', 'After Effects'],
  focus:
    'Beat-sync pacing, hype build-up, comedy-to-montage transition, dramatic captions, crowd energy, personality storytelling',
  size: 'large',
  format: 'wide',
  thumbnail: '/media/thumbs/hisoka-national-treasure-edit.jpg',
  videoSrc: '/media/clips/energetic-edits/hisoka-national-treasure-edit.mp4',
},
  {
  id: 'falcons-dota-trophy-edit',
  code: 'EDIT',
  title: 'Dota Trophy',
  category: 'Energetic Edits',
  description:
    'A square-format hype edit for Team Falcons’ Dota roster after winning a trophy, built around celebration shots, trophy lifts, fast shakes, and beat-driven energy.',
  longDescription:
    'An energetic esports edit celebrating Team Falcons’ Dota roster after their trophy win. The video uses victory-stage footage, trophy lift moments, confetti, arena lighting, player walkouts, logo hits, motion blur, shakes, and fast cutaways to turn the win into a short high-impact social edit. The pacing focuses on building momentum from the celebration into a hype montage feel, making the roster look dominant, proud, and championship-ready.',
  tools: ['Premiere Pro', 'After Effects'],
  focus:
    'Trophy celebration, shake edits, beat-sync pacing, motion blur, esports hype, social media impact',
  size: 'small',
  format: 'square',
  thumbnail: '/media/thumbs/falcons-dota-trophy-edit.jpg',
  videoSrc: '/media/clips/energetic-edits/falcon-dota.mp4',
},
  {
  id: 'falcons-valorant-women-threepeat',
  code: 'EDIT',
  title: 'Valorant Three-Peat',
  category: 'Energetic Edits',
  description:
    'A square-format hype edit for Team Falcons’ women’s Valorant roster after winning three trophies in a row, built around victory energy, fast cuts, and championship momentum.',
  longDescription:
    'An energetic esports edit celebrating Team Falcons’ women’s Valorant roster after securing three trophies in a row. The video uses trophy moments, player celebration shots, bold visual pacing, fast cuts, shakes, glow, impact transitions, and beat-driven movement to turn the achievement into a short high-energy social edit. The pacing is designed to feel powerful and victorious, highlighting the roster’s dominance, consistency, and championship streak in a format built for quick attention and replay value.',
  tools: ['Premiere Pro', 'After Effects'],
  focus:
    'Championship hype, beat-sync pacing, shake edits, trophy celebration, impact cuts, women’s esports storytelling',
  size: 'small',
  format: 'square',
  thumbnail: '/media/thumbs/falcons-valorant-women-threepeat.jpg',
  videoSrc: '/media/clips/energetic-edits/female-valo.mp4',
},

  // ---- Trailers / Teasers --------------------------------------------------
  // Layout (see SelectedWorks.tsx): two 16:9 videos side by side on desktop,
  // stacked on tablet/mobile.
  //
  // PLACE VIDEO FILES IN: public/media/clips/trailers-teasers/
  // Drop your real MP4s in that folder using the filenames referenced below
  // (or update the `videoSrc` path here to match your own filenames) —
  // nothing else needs to change.
  {
  id: 'falcons-apex-japanese-snacks-teaser',
  code: 'VIBE TEASER',
  title: 'Japanese Snacks Teaser',
  category: 'Trailers / Teasers',
  description:
    'A playful teaser for Team Falcons’ Apex Legends roster trying Japanese snacks, mixing convenience-store shots, team reactions, and quick food-tasting moments.',
  longDescription:
    'A light, personality-driven teaser created for a Team Falcons Apex Legends roster video where the players try Japanese snacks. The edit opens with branded Japan-inspired visuals and convenience-store footage, then cuts into snack selections, player reactions, tasting moments, and quick multi-person highlights. The pacing is designed to feel fun and casual while still keeping a polished teaser structure, giving viewers a clear preview of the video’s humor, team chemistry, and Japanese snack theme.',
  tools: ['Premiere Pro', 'After Effects'],
  focus:
    'Teaser pacing, team personality, reaction highlights, branded intro visuals, food-tasting moments, smooth transitions',
  size: 'large',
  format: 'wide',
  thumbnail: '/media/thumbs/falcons-apex-japanese-snacks-teaser.jpg',
  videoSrc: '/media/clips/trailers-teasers/japan-snacks.mp4',
},
  {
  id: 'peterbot-pollo-fncs-teaser',
  code: 'HYPE TEASER',
  title: 'FNCS Duo Teaser',
  category: 'Trailers / Teasers',
  description:
    'A high-energy teaser for Peterbot and Pollo playing FNCS, mixing player walk-ins, stage visuals, and intense Fortnite gameplay highlights.',
  longDescription:
    'A competitive esports teaser built around Peterbot and Pollo’s FNCS performance. The edit blends cinematic player shots, Team Falcons stage moments, crowd/event atmosphere, and fast Fortnite gameplay sequences to create a strong build-up before the main video. It uses sharp pacing, match highlights, reaction moments, and branded Falcons visuals to make the duo feel intense, focused, and ready for competition.',
  tools: ['Premiere Pro', 'After Effects'],
  focus:
    'Esports teaser pacing, Fortnite highlight selection, player introduction, event atmosphere, branded storytelling, competitive energy',
  size: 'large',
  format: 'wide',
  thumbnail: '/media/thumbs/peterbot-pollo-fncs-teaser.jpg',
  videoSrc: '/media/clips/trailers-teasers/fncs-trailer.mp4',
},
];

export type Collaborator = {
  id: string;
  name: string;
  type: 'Creator' | 'Team' | 'Brand' | 'Agency';
  workDone: string;
  description: string;
  /**
   * Profile/logo image for this collaborator.
   *
   * Put creator images inside `public/media/creators/` and update the
   * image path here, e.g.: image: '/media/creators/creator-01.jpg'
   *
   * Supported formats: .jpg, .jpeg, .png, .webp, .avif
   * Recommended size: 200×200 px or larger (displayed as a cropped circle).
   *
   * Every collaborator below already has an `image` path set, pointing at
   * a placeholder filename — none of those files exist yet, which is fine.
   * If the file at this path is missing (or fails to load for any reason),
   * the component automatically and gracefully falls back to the existing
   * text/initial placeholder icon — nothing breaks either way.
   */
  image?: string;
};

// ----------------------------------------------------------------------------
// Collaborators — 18 creators, teams, brands & agencies
// ----------------------------------------------------------------------------
// Desktop layout renders as two rows of 9. Tablet/mobile wraps automatically.
//
// Every collaborator below has an `image` field pointing at a placeholder
// path under public/media/creators/ — those files don't exist yet, and
// that's expected. CreatorIconPopup tries to load each image and falls
// back gracefully to the existing text/initial placeholder if the file is
// missing, so nothing breaks until real photos are added.
//
// TO ADD A REAL PROFILE IMAGE:
//   1. Put the creator image inside  public/media/creators/
//      e.g.  public/media/creators/creator-01.jpg
//   2. Update the `image` path below to match that filename:
//      image: '/media/creators/creator-01.jpg'
//   3. Supported formats: .jpg, .jpeg, .png, .webp, .avif
//
// TO EDIT A COLLABORATOR: update any field below — changes are reflected
// instantly in both the icon grid and the click popup.
// ----------------------------------------------------------------------------
export const collaborators = [
{
id: 'team-falcons',
name: 'Team Falcons',
type: 'Team',
workDone: 'Reels, Shorts, YouTube videos, Documentaries,ADS,Motion Graphics,3D Graphics,Promotional Videos,Teasers',
description:
'Edited high-energy gaming, creator, and branded content for Team Falcons, including social edits, comedy moments, product reviews, campaign videos, and motion-focused storytelling.',
// Put creator images inside `public/media/creators/` and update the image path here.
image: '/media/creators/falcons.jpg',
},
{
id: 'abdullahs2lem',
name: 'Abdullah salem',
type: 'Creator',
workDone: 'Reels, Shorts,Story telling,Comedy edits,Collaborations,Quizes,ADS ',
description:
'Edited creator-focused fotball content for Abdullah salem, with fast pacing, clean cuts, reaction timing, and short-form storytelling designed to keep viewers engaged.',
image: '/media/creators/abdullahs2lem.jpg',
},
{
id: 'abu-abeer',
name: 'Abu Abeer',
type: 'Creator',
workDone: 'Comedy reels, food reactions, personality edits, social videos',
description:
'Created personality-driven comedy edits for Abu Abeer, using reaction zooms, funny SFX, themed styling, and fast timing to turn simple moments into highly watchable entertainment.',
image: '/media/creators/abuabeer.jpg',
},
{
id: 'deraah',
name: 'Deraah',
type: 'Brand',
workDone: 'Brand content, campaign edits, motion graphics, promotional videos',
description:
'Worked on clean branded content for Deraah, focusing on polished pacing, elegant visuals, product/campaign presentation, and motion design that supports a premium brand feel.',
image: '/media/creators/deraa.jpg',
},
{
id: 'ewc',
name: 'Esports World Cup',
type: 'Brand',
workDone: 'Esports content, event edits, gaming visuals, promotional videos',
description:
'Edited esports-focused content connected to Esport World Cup, combining high-energy pacing, gaming atmosphere, sharp transitions, and competitive visual storytelling for event-style content.',
image: '/media/creators/ewc.jpg',
},
{
id: 'eyewa',
name: 'Eyewa',
type: 'Brand',
workDone: 'Brand AD, product visuals, promotional video',
description:
'Delivered clean brand-focused edits for Eyewa, built around polished product presentation, smooth pacing, and social-first visuals that keep the content modern and easy to watch.',
image: '/media/creators/eyewa.jpg',
},
{
id: 'hikaru',
name: 'Hikaru',
type: 'Creator',
workDone: 'Games higlights,Event Promotion, social videos, creator clips',
description:
'Edited content for Hikaru with a focus on strong pacing, clear moments, engaging reactions, and short-form structure that makes the content feel sharp and entertaining.',
image: '/media/creators/hikaru.jpg',
},
{
id: 'killerq8y',
name: 'KillerQ8Y',
type: 'Creator',
workDone: 'Product reviews, gaming content, reels, review videos',
description:
'Created product review and gaming-focused edits for KillerQ8Y, combining talking-head moments, clean b-roll, unique captions, and smooth pacing to make reviews feel premium and clear.',
image: '/media/creators/killerq8y.jpg',
},
{
id: 'knjy',
name: 'KNJY',
type: 'Creator',
workDone: 'Gaming videos,Reels/shorts,Micro-transitions , storytelling edits, hooks, social clips',
description:
'Edited gaming and creator-led content for KNJY, focusing on strong hooks, clean transitions, retention pacing, and visual storytelling that keeps viewers moving through the video.',
image: '/media/creators/knjy.jpg',
},
{
id: 'team-peaks',
name: 'Team Peaks',
type: 'Team',
workDone: 'Gaming content, mini-game edits, branded collaborations, motion graphics',
description:
'Edited energetic gaming and collaboration content for Team Peaks, including mini-game formats, branded visual themes, playful transitions, and fast-paced social edits.',
image: '/media/creators/peaks.jpg',
},
{
id: 'neo',
name: 'NEO',
type: 'Brand',
workDone: 'Brand content, motion graphics, promotional videos',
description:
'Delivered branded motion-focused edits for NEO, with an emphasis on clean visual rhythm, modern transitions, polished layouts, and content built for digital platforms.',
image: '/media/creators/neo.jpg',
},
{
id: 'kudu',
name: 'KUDU',
type: 'Brand',
workDone: 'Brand campaigns, food content, promotional edits, social videos',
description:
'Worked on promotional brand content for KUDU, using clean editing, energetic pacing, and campaign-focused visuals to make the content feel clear, modern, and social-media ready.',
image: '/media/creators/kudu.jpg',
},
{
id: 'razer',
name: 'Razer',
type: 'Brand',
workDone: 'Product reviews, promotional visuals',
description:
'Created gaming product-focused edits connected to Razer, combining close-up b-roll, clean review pacing, RGB-inspired visuals, and premium tech presentation.',
image: '/media/creators/razer.jpg',
},
{
id: 'saudi-eleague',
name: 'Saudi eLeague',
type: 'Brand',
workDone: 'Esports edits, tournament content, gaming visuals, social clips,motion graphics',
description:
'Edited esports-style content for Saudi eLeague, focusing on competitive pacing, gaming energy, clean visual structure, and social-first edits for esports audiences.',
image: '/media/creators/saudi eleague.jpg',
},
{
id: 'team-saudi',
name: 'Team Saudi',
type: 'Team',
workDone: 'Team content, promotional clips,ADs',
description:
'Worked on team-focused gaming and esports content for Team Saudi, using strong pacing, clean transitions, and polished visuals to support a professional competitive identity.',
image: '/media/creators/team saudi.jpg',
},
{
id: 'tecno',
name: 'TECNO',
type: 'Brand',
workDone: 'Product reviews, smartphone content, gaming lifestyle edits, promo videos',
description:
'Created product-focused edits for TECNO, combining smartphone beauty shots, gaming lifestyle visuals, Arabic captions, and smooth feature reveals for a modern review style.',
image: '/media/creators/tecno.jpg',
},
{
id: 'vamos',
name: 'Vamos',
type: 'Brand',
workDone: 'Football content, social edits, sports visuals, promotional videos',
description:
'Edited football and sports-focused content for Vamos, using energetic pacing, clean cuts, and social-media-ready visuals built around match moments and fan engagement.',
image: '/media/creators/vamos.jpg',
},
{
  id: 'more',
  name: 'More Clients',
  type: 'MORE',
  workDone: 'Additional client work, private projects, social edits, branded content',
  description:
    'I have also worked with many other clients and private projects that are not listed here.',
  image: '/media/creators/and.jpg',
},
];


export const contactLinks = {
  instagram: 'https://www.instagram.com/luuk.ae/',
  x: 'https://x.com/aeLuuk',
  // No dedicated YouTube channel yet — left as an empty placeholder on
  // purpose. Drop the real channel URL in here (e.g.
  // 'https://www.youtube.com/@yourchannel') whenever it's ready and the
  // YouTube button will start showing automatically wherever contact/social
  // links are rendered (ContactSection, Footer). No other code changes
  // needed.
  youtube: '',
  email: 'luukeditor@gmail.com',
};

// ----------------------------------------------------------------------------
// isValidContactLink
// ----------------------------------------------------------------------------
// Shared guard used by every place that renders contact/social buttons
// (ContactSection, Footer, …) to decide whether a given contactLinks value
// is a real, usable link or just an empty/placeholder slot that should stay
// hidden. Centralized here so all renderers agree on what counts as "real".
// ----------------------------------------------------------------------------
export function isValidContactLink(value: string | undefined | null): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (trimmed === '') return false;

  // Common placeholder / "not set yet" values that should never render.
  const placeholders = new Set([
    '#',
    '/',
    'https://youtube.com/',
    'https://www.youtube.com/',
    'https://youtube.com',
    'https://www.youtube.com',
  ]);
  if (placeholders.has(trimmed)) return false;

  return true;
}

// ----------------------------------------------------------------------------
// About / Who I Am — bilingual content (English / Arabic toggle)
// ----------------------------------------------------------------------------
// Each language has the same sentence broken into plain segments and
// "highlight" segments. Highlighted segments render with the bold sky-blue
// / soft-background treatment; plain segments render as normal muted body
// text. Keeping both languages structured the same way means AboutIntro
// doesn't need any language-specific styling logic — it just maps over
// whichever array is active.
export type AboutSegment = {
  text: string;
  highlight?: 'bold' | 'mark'; // 'bold' = sky-blue bold text, 'mark' = soft highlight background
};

export const aboutContent: Record<'en' | 'ar', { heading: AboutSegment[]; body: AboutSegment[]; dir: 'ltr' | 'rtl' }> = {
  en: {
    dir: 'ltr',
    heading: [
      { text: 'Luuk', highlight: 'bold' },
      { text: ' | ' },
      { text: 'Video Editor & Content Creator', highlight: 'bold' },
    ],
    body: [
      { text: 'As both an editor and content creator with ' },
      { text: '8+ years of experience', highlight: 'mark' },
      { text: ' and a ' },
      { text: 'lifelong passion for editing', highlight: 'bold' },
      { text: ', I understand what ' },
      { text: 'creators, brands, and audiences', highlight: 'bold' },
      { text: ' want — ' },
      { text: 'strong pacing', highlight: 'mark' },
      { text: ', ' },
      { text: 'clean visuals', highlight: 'mark' },
      { text: ', ' },
      { text: 'engaging storytelling', highlight: 'bold' },
      { text: ', and content that ' },
      { text: 'keeps people watching', highlight: 'mark' },
      { text: ". I've worked with " },
      { text: 'major creators, teams, and brands', highlight: 'bold' },
      { text: ' to turn ideas and raw footage into ' },
      { text: 'polished, cinematic videos', highlight: 'mark' },
      { text: '.' },
    ],
  },
  ar: {
    dir: 'rtl',
    heading: [
      { text: 'Luuk', highlight: 'bold' },
      { text: ' | ' },
      { text: 'مونتير فيديو وصانع محتوى', highlight: 'bold' },
    ],
    body: [
      { text: 'بصفتي مونتير فيديو وصانع محتوى بخبرة تزيد عن ' },
      { text: '8 سنوات', highlight: 'mark' },
      { text: ' وشغف طويل بالمونتاج منذ الطفولة، أفهم ما يبحث عنه ' },
      { text: 'صناع المحتوى، والعلامات التجارية، والجمهور', highlight: 'bold' },
      { text: ' — ' },
      { text: 'إيقاع قوي', highlight: 'mark' },
      { text: '، ' },
      { text: 'صورة نظيفة', highlight: 'mark' },
      { text: '، ' },
      { text: 'سرد جذاب', highlight: 'bold' },
      { text: '، ومحتوى ' },
      { text: 'يحافظ على انتباه المشاهد', highlight: 'mark' },
      { text: '. عملت مع ' },
      { text: 'صناع محتوى كبار، وفرق، وعلامات تجارية', highlight: 'bold' },
      { text: ' لتحويل الأفكار واللقطات الخام إلى ' },
      { text: 'فيديوهات مصقولة وسينمائية', highlight: 'mark' },
      { text: '.' },
    ],
  },
};

// ----------------------------------------------------------------------------
// Contact form — project types and budget ranges
// ----------------------------------------------------------------------------
export const projectTypes = [
  'Reels & Shorts',
  'Trailer / Teaser',
  'Storytelling Edit',
  'Review Video',
  'YouTube Hook Intro',
  'Motion Graphics',
  'Comedy / Personality Reel',
  'Creator / Brand Content',
  'Other',
] as const;

export type ProjectType = (typeof projectTypes)[number];

export type BudgetRange = '$15 to $30' | '$40 to $70' | '$70 to $100' | '$100 to $250' | '$250+' | 'Custom budget';

export const budgetRanges: BudgetRange[] = [
  '$15 to $30',
  '$40 to $70',
  '$70 to $100',
  '$100 to $250',
  '$250+',
  'Custom budget',
];

// Only these project types are allowed to pick the lowest "$15 to $30"
// budget tier. Used by ContactSection to disable that option (with an
// explanatory toast on click) and to auto-reset the budget field — with
// its own toast — if the project type changes away from one of these
// values while "$15 to $30" is still selected.
export const LOW_BUDGET_ELIGIBLE_TYPES: ProjectType[] = ['Reels & Shorts', 'Review Video'];

// ----------------------------------------------------------------------------
// Contact form — WhatsApp country codes
// ----------------------------------------------------------------------------
// The country list has moved to lib/countries.ts (COUNTRIES array).
// The old whatsappCountryCodes export has been removed — ContactSection.tsx
// now imports directly from lib/countries.ts.
