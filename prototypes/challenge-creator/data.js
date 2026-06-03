// ─── Challenge Creator V2 — mock data + capability model ──────────────────────
// All data is fake. The "capability resolver" (getSteps / getTypes) is what makes
// the creator adapt to (mode, role, challenge type).

// AI-generated illustration assets (flat-vector). Vite resolves these to URLs.
import reading1 from './assets/banners/reading-1.webp'
import reading2 from './assets/banners/reading-2.webp'
import reading3 from './assets/banners/reading-3.webp'
import summer1 from './assets/banners/summer-1.webp'
import summer2 from './assets/banners/summer-2.webp'
import summer3 from './assets/banners/summer-3.webp'
import autumn1 from './assets/banners/autumn-1.webp'
import autumn2 from './assets/banners/autumn-2.webp'
import autumn3 from './assets/banners/autumn-3.webp'
import space1 from './assets/banners/space-1.webp'
import space2 from './assets/banners/space-2.webp'
import space3 from './assets/banners/space-3.webp'
import forest1 from './assets/banners/forest-1.webp'
import forest2 from './assets/banners/forest-2.webp'
import forest3 from './assets/banners/forest-3.webp'
import celebration1 from './assets/banners/celebration-1.webp'
import celebration2 from './assets/banners/celebration-2.webp'
import celebration3 from './assets/banners/celebration-3.webp'
import winter1 from './assets/banners/winter-1.webp'
import winter2 from './assets/banners/winter-2.webp'
import winter3 from './assets/banners/winter-3.webp'
import ocean1 from './assets/banners/ocean-1.webp'
import ocean2 from './assets/banners/ocean-2.webp'
import ocean3 from './assets/banners/ocean-3.webp'
import animals1 from './assets/banners/animals-1.webp'
import animals2 from './assets/banners/animals-2.webp'
import animals3 from './assets/banners/animals-3.webp'
import fantasy1 from './assets/banners/fantasy-1.webp'
import fantasy2 from './assets/banners/fantasy-2.webp'
import fantasy3 from './assets/banners/fantasy-3.webp'
import badgeBook from './assets/badges/book.webp'
import badgeFlame from './assets/badges/flame.webp'
import badgeStar from './assets/badges/star.webp'
import badgeMedal from './assets/badges/medal.webp'
import badgeTrophy from './assets/badges/trophy.webp'
import badgeGift from './assets/badges/gift.webp'

export const THEME = {
  teal: '#0DA7BC', // Beanstack primary
  ink: '#0F172A',
}

// ─── Modes (dev toolbar — level 1) ────────────────────────────────────────────
export const MODES = [
  { id: 'challenge', name: 'Challenge Creator' },
  { id: 'template', name: 'Template Creator' },
]

// ─── Roles, scoped to mode (dev toolbar — level 2) ────────────────────────────
// tier 'simple' = the stripped-down teacher/MS creator; 'full' = everything.
// site drives school (classrooms/grade) vs library (branches/age + points).
export const ROLES_BY_MODE = {
  challenge: [
    { id: 'teacher', name: 'Teacher / Media Specialist', site: 'school', tier: 'simple' },
    { id: 'msplus', name: 'MS+ · School Admin', site: 'school', tier: 'full' },
    { id: 'librarian', name: 'Public Librarian', site: 'library', tier: 'full' },
  ],
  template: [
    { id: 'district', name: 'District Admin', site: 'school', tier: 'full', isTemplate: true },
  ],
}

export const getRoles = (mode) => ROLES_BY_MODE[mode] ?? ROLES_BY_MODE.challenge
export const getRole = (mode, roleId) =>
  getRoles(mode).find((r) => r.id === roleId) ?? getRoles(mode)[0]

// ─── Earning methods (toggled atop the Badges step) ───────────────────────────
export const METHODS = {
  log: { id: 'log', name: 'Log reading', badgeKind: 'logging' },
  activities: { id: 'activities', name: 'Complete activities', badgeKind: 'activity' },
  reviews: { id: 'reviews', name: 'Write reviews', badgeKind: 'review' },
  points: { id: 'points', name: 'Earn points', badgeKind: 'points' },
  readingList: { id: 'readingList', name: 'Log specific titles', badgeKind: 'logging' },
  bingo: { id: 'bingo', name: 'Fill a bingo card', badgeKind: 'bingo' },
}

// ─── Challenge types (Step 1 cards) ───────────────────────────────────────────
// setup: needs a type-specific Step 4. autoComplete: completion is implicit (bingo).
// sites: which site-types can use it (points = library only).
export const CHALLENGE_TYPES = [
  {
    id: 'logging',
    name: 'Logging Challenge',
    tagline: 'Earn badges for logging minutes, books, days, or pages.',
    accent: '#0DA7BC',
    primaryMethod: 'log',
    addOns: ['activities', 'reviews'],
    setup: false,
    sites: ['school', 'library'],
  },
  {
    id: 'activity',
    name: 'Activity Challenge',
    tagline: 'Earn badges by completing activities and tasks.',
    accent: '#7C5CFA',
    primaryMethod: 'activities',
    addOns: ['log', 'reviews'],
    setup: false,
    sites: ['school', 'library'],
  },
  {
    id: 'bingo',
    name: 'Bingo Challenge',
    tagline: 'Arrange badges on a card; earn a row, column, or diagonal.',
    accent: '#E8456B',
    primaryMethod: 'bingo',
    addOns: [],
    setup: true,
    setupName: 'Bingo Card',
    autoComplete: true,
    sites: ['school', 'library'],
  },
  {
    id: 'points',
    name: 'Points Challenge',
    tagline: 'Accumulate points from reading and activities to hit goals.',
    accent: '#F0A024',
    primaryMethod: 'points',
    addOns: ['activities'],
    setup: false,
    sites: ['library'],
    badge: 'Library',
  },
  {
    id: 'reading-list',
    name: 'Reading List Challenge',
    tagline: 'Read specific titles from a curated list.',
    accent: '#1D4ED8',
    primaryMethod: 'readingList',
    addOns: ['activities'],
    setup: true,
    setupName: 'Titles',
    sites: ['school', 'library'],
  },
  {
    id: 'reviews',
    name: 'Reviews Challenge',
    tagline: 'Earn badges by writing book reviews.',
    accent: '#16A97A',
    primaryMethod: 'reviews',
    addOns: ['log'],
    setup: false,
    sites: ['school', 'library'],
  },
  {
    id: 'gameboard',
    name: 'Gameboard Challenge',
    tagline: 'Move along a themed board by reading and completing activities.',
    accent: '#5FA052',
    primaryMethod: 'log',
    addOns: ['activities', 'reviews'],
    setup: true,
    setupName: 'Gameboard',
    autoComplete: true,
    sites: ['school', 'library'],
  },
]

export const getType = (id) => CHALLENGE_TYPES.find((t) => t.id === id) ?? null

// Types available to a given role (filtered by the role's site-type).
export const getTypesForRole = (role) =>
  CHALLENGE_TYPES.filter((t) => t.sites.includes(role?.site ?? 'school'))

// ─── Templates (Step 2 chooser — pick one to pre-fill, or start from scratch) ──
// A template's art is theme — the same theme can seed different mechanics — so
// each lists every challenge type it suits (so every type has options to pick).
export const TEMPLATES = [
  {
    id: 'benny',
    name: 'Have You Seen Benny?',
    typeIds: ['logging', 'activity'],
    blurb: 'A reading hunt with Beanstack’s mascot.',
  },
  {
    id: 'era',
    name: 'In My Reading Era',
    typeIds: ['logging', 'reviews', 'gameboard'],
    blurb: 'Journey through your reading eras.',
  },
  {
    id: 'glow',
    name: 'Glow Party',
    typeIds: ['logging', 'points', 'activity', 'gameboard'],
    blurb: 'A bright, neon reading celebration.',
  },
  {
    id: 'comics',
    name: 'Comics Choice',
    typeIds: ['bingo', 'reading-list', 'reviews'],
    blurb: 'Celebrate comics and graphic novels.',
  },
  {
    id: 'hhm',
    name: 'Hispanic Heritage Month',
    typeIds: ['logging', 'reading-list', 'activity', 'points'],
    blurb: 'Celebrate Hispanic & Latino voices.',
  },
  {
    id: 'botb',
    name: 'Battle of the Books',
    typeIds: ['logging', 'bingo', 'reading-list', 'reviews'],
    blurb: 'Competitive reading from a title list.',
  },
]
// Cap the gallery at 5 templates per type (plus the "Start from scratch" card).
export const getTemplatesForType = (typeId) =>
  TEMPLATES.filter((t) => t.typeIds.includes(typeId)).slice(0, 5)

// ─── Header fonts (Google Fonts) ──────────────────────────────────────────────
// `headerFont` stores the family NAME (e.g. 'Poppins'). The first six are quick-
// pick chips (preloaded via @import in index.css); the rest power the dropdown
// and load on demand via loadFont(). fontStack() builds a family + fallback.
const FONT_FALLBACK = {
  sans: 'system-ui, sans-serif',
  serif: 'Georgia, serif',
  display: 'system-ui, sans-serif',
  handwriting: 'cursive',
}
export const GOOGLE_FONTS = [
  { name: 'Poppins', cat: 'sans' },
  { name: 'Fredoka', cat: 'sans' },
  { name: 'Baloo 2', cat: 'sans' },
  { name: 'Lora', cat: 'serif' },
  { name: 'Playfair Display', cat: 'serif' },
  { name: 'Bebas Neue', cat: 'display' },
  { name: 'Montserrat', cat: 'sans' },
  { name: 'Nunito', cat: 'sans' },
  { name: 'Quicksand', cat: 'sans' },
  { name: 'Comfortaa', cat: 'sans' },
  { name: 'Raleway', cat: 'sans' },
  { name: 'Work Sans', cat: 'sans' },
  { name: 'Oswald', cat: 'display' },
  { name: 'Archivo Black', cat: 'display' },
  { name: 'Lobster', cat: 'display' },
  { name: 'Righteous', cat: 'display' },
  { name: 'Pacifico', cat: 'handwriting' },
  { name: 'Caveat', cat: 'handwriting' },
  { name: 'Merriweather', cat: 'serif' },
  { name: 'Bitter', cat: 'serif' },
  { name: 'DM Serif Display', cat: 'serif' },
  { name: 'Fraunces', cat: 'serif' },
]
// Stand-in image used to fake a user upload in the preview (prototype only).
export const FAKE_UPLOAD_IMG = forest1

export const QUICK_FONTS = GOOGLE_FONTS.slice(0, 5)
export const fontStack = (name) => {
  const f = GOOGLE_FONTS.find((x) => x.name === name)
  return `'${name || 'Poppins'}', ${FONT_FALLBACK[f?.cat] || 'sans-serif'}`
}
// Inject a Google Fonts <link> for a family on demand (idempotent).
export function loadFont(name) {
  if (!name || typeof document === 'undefined') return
  const id = 'gf-' + name.replace(/\s+/g, '-').toLowerCase()
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/\s+/g, '+')}:wght@600;700&display=swap`
  document.head.appendChild(link)
}

// ─── Illustrated theme banners ────────────────────────────────────────────────
// Each theme has a few generated color variations (flat-vector illustrations
// with open space in the center for the title). The variant id is stored as the
// challenge's background id; `color` is the representative hue (drives the
// derived accent + the load-fallback background).
const BANNER_VARIANT_IMG = {
  'reading-1': reading1,
  'reading-2': reading2,
  'reading-3': reading3,
  'summer-1': summer1,
  'summer-2': summer2,
  'summer-3': summer3,
  'autumn-1': autumn1,
  'autumn-2': autumn2,
  'autumn-3': autumn3,
  'space-1': space1,
  'space-2': space2,
  'space-3': space3,
  'forest-1': forest1,
  'forest-2': forest2,
  'forest-3': forest3,
  'celebration-1': celebration1,
  'celebration-2': celebration2,
  'celebration-3': celebration3,
  'winter-1': winter1,
  'winter-2': winter2,
  'winter-3': winter3,
  'ocean-1': ocean1,
  'ocean-2': ocean2,
  'ocean-3': ocean3,
  'animals-1': animals1,
  'animals-2': animals2,
  'animals-3': animals3,
  'fantasy-1': fantasy1,
  'fantasy-2': fantasy2,
  'fantasy-3': fantasy3,
}

export const BANNER_THEMES = [
  {
    id: 'reading',
    name: 'Reading',
    variants: [
      { id: 'reading-1', color: '#0EA5B7' },
      { id: 'reading-2', color: '#6366F1' },
      { id: 'reading-3', color: '#FB7185' },
    ],
  },
  {
    id: 'summer',
    name: 'Summer',
    variants: [
      { id: 'summer-1', color: '#2563EB' },
      { id: 'summer-2', color: '#FB923C' },
      { id: 'summer-3', color: '#0D9488' },
    ],
  },
  {
    id: 'autumn',
    name: 'Autumn',
    variants: [
      { id: 'autumn-1', color: '#D97706' },
      { id: 'autumn-2', color: '#EA580C' },
      { id: 'autumn-3', color: '#CA8A04' },
    ],
  },
  {
    id: 'space',
    name: 'Space',
    variants: [
      { id: 'space-1', color: '#1E293B' },
      { id: 'space-2', color: '#6D28D9' },
      { id: 'space-3', color: '#0C4A6E' },
    ],
  },
  {
    id: 'forest',
    name: 'Forest',
    variants: [
      { id: 'forest-1', color: '#059669' },
      { id: 'forest-2', color: '#047857' },
      { id: 'forest-3', color: '#0D9488' },
    ],
  },
  {
    id: 'celebration',
    name: 'Celebration',
    variants: [
      { id: 'celebration-1', color: '#E11D48' },
      { id: 'celebration-2', color: '#7C3AED' },
      { id: 'celebration-3', color: '#D97706' },
    ],
  },
  {
    id: 'winter',
    name: 'Winter',
    variants: [
      { id: 'winter-1', color: '#3B82F6' },
      { id: 'winter-2', color: '#60A5FA' },
      { id: 'winter-3', color: '#38BDF8' },
    ],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    variants: [
      { id: 'ocean-1', color: '#0891B2' },
      { id: 'ocean-2', color: '#06B6D4' },
      { id: 'ocean-3', color: '#0E7490' },
    ],
  },
  {
    id: 'animals',
    name: 'Animals',
    variants: [
      { id: 'animals-1', color: '#65A30D' },
      { id: 'animals-2', color: '#16A34A' },
      { id: 'animals-3', color: '#CA8A04' },
    ],
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    variants: [
      { id: 'fantasy-1', color: '#7C3AED' },
      { id: 'fantasy-2', color: '#8B5CF6' },
      { id: 'fantasy-3', color: '#6366F1' },
    ],
  },
]

// Flat list (id → variant) with the parent theme + generated image attached.
export const BANNERS = BANNER_THEMES.flatMap((t) =>
  t.variants.map((v) => ({ ...v, themeId: t.id, label: t.name, img: BANNER_VARIANT_IMG[v.id] })),
)
export const getBannerTheme = (id) =>
  BANNERS.find((b) => b.id === id)?.themeId ?? BANNER_THEMES[0].id

export function bannerImage(id) {
  const b = BANNERS.find((x) => x.id === id) ?? BANNERS[0]
  return `url("${b.img}")`
}
// Full CSS style for a banner swatch / thumbnail.
export function bannerStyle(id) {
  const b = BANNERS.find((x) => x.id === id) ?? BANNERS[0]
  return {
    backgroundColor: b.color,
    backgroundImage: bannerImage(id),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

// ─── Mock site context ────────────────────────────────────────────────────────
export const SITE = {
  school: { name: 'Maplewood Elementary' },
  library: { name: 'Riverside Public Library' },
}
export const CLASSROOMS = ['Ms. Rivera · Grade 3', 'Mr. Okafor · Grade 4', 'Ms. Lin · Grade 5']
export const BRANCHES = ['Main Branch', 'Eastside Branch', 'Riverside Bookmobile']
export const GRADES = ['Pre-K', 'K', '1', '2', '3', '4', '5', '6', '7', '8']

// Icon keys (from @components/ui I8_IDS) usable as badge glyphs.
export const BADGE_ICONS = [
  'ti-book-2',
  'ti-flame',
  'ti-star',
  'ti-medal',
  'ti-trophy',
  'ti-puzzle',
  'ti-gift',
  'ti-certificate',
  'ti-reading-log',
  'ti-rating',
]
export const BADGE_COLORS = ['#0DA7BC', '#E8866A', '#7C5CFA', '#16A97A', '#F0C050', '#E8456B']

// AI-generated badge medallions, keyed by icon name. Badges whose icon maps
// here render the illustration; others fall back to the Ic glyph.
const BADGE_IMG = {
  'ti-book-2': badgeBook,
  'ti-flame': badgeFlame,
  'ti-star': badgeStar,
  'ti-medal': badgeMedal,
  'ti-trophy': badgeTrophy,
  'ti-gift': badgeGift,
}
export const badgeImage = (icon) => BADGE_IMG[icon]

// Per-theme generated badge sets (assets/theme-badges/<theme>-<n>.webp). Used as
// a theme's default badges in the preview when the user hasn't added their own.
const THEME_BADGE_ASSETS = import.meta.glob('./assets/theme-badges/*.webp', {
  eager: true,
  import: 'default',
})
// Up to 8 badges per theme; missing files are filtered out.
const THEME_BADGE_SLOTS = [1, 2, 3, 4, 5, 6, 7, 8]
export const themeBadges = (themeId) =>
  THEME_BADGE_SLOTS.map((n) => THEME_BADGE_ASSETS[`./assets/theme-badges/${themeId}-${n}.webp`])
    .filter(Boolean)
    .map((img) => ({ img }))

// Real flat-vector background art per theme, for the badge builder/upload
// "From this theme" picker. Only the themes with assets on disk return images.
const BADGE_BG_ASSETS = import.meta.glob('./assets/badge-bgs/*.webp', {
  eager: true,
  import: 'default',
})
const BADGE_BG_SLOTS = [1, 2, 3, 4, 5, 6]
export const themeBgImages = (themeId) =>
  BADGE_BG_SLOTS.map((n) => BADGE_BG_ASSETS[`./assets/badge-bgs/${themeId}-${n}.webp`]).filter(
    Boolean,
  )

// Logging badge "values": what readers count toward, and how much.
export const LOG_TYPES = [
  { value: 'books', label: 'Books' },
  { value: 'minutes', label: 'Minutes' },
  { value: 'days', label: 'Days' },
  { value: 'pages', label: 'Pages' },
]

// Selectable badge medallions for the "Select a badge" picker, organized into
// groups (badge sets) — mirrors Beanstack's grouped badge browser.
const MEDALLION_BADGES = [
  { id: 'book', name: 'Bookworm', img: badgeBook },
  { id: 'flame', name: 'Reading Streak', img: badgeFlame },
  { id: 'star', name: 'Rising Star', img: badgeStar },
  { id: 'medal', name: 'Medalist', img: badgeMedal },
  { id: 'trophy', name: 'Champion', img: badgeTrophy },
  { id: 'gift', name: 'Surprise Reward', img: badgeGift },
]
// Descriptive name per theme badge (slot 1–8) — what each medallion depicts.
// Drives the gallery labels AND keyword subject-tagging.
const THEME_BADGE_NAMES = {
  reading: [
    'Open Book',
    'Reading Glasses',
    'Storybook',
    'Book Stack',
    'Bookmark',
    'Reading Specs',
    'Quill Pen',
    'Library Books',
  ],
  summer: [
    'Sunshine',
    'Popsicle',
    'Beach Ball',
    'Sunglasses',
    'Ice Cream',
    'Beach Day',
    'Cool Shades',
    'Ice Pop',
  ],
  autumn: [
    'Maple Leaf',
    'Acorn',
    'Pumpkin',
    'Apple',
    'Acorn Cap',
    'Harvest Pumpkin',
    'Crisp Apple',
    'Oak Leaf',
  ],
  space: [
    'Rocket',
    'Planet',
    'Shooting Star',
    'Astronaut',
    'Ringed Planet',
    'Crescent Moon',
    'Comet',
    'Space Helmet',
  ],
  forest: ['Pine Tree', 'Fox', 'Mushroom', 'Campfire', 'Evergreen', 'Toadstool', 'Deer', 'Bonfire'],
  celebration: [
    'Balloon',
    'Party Popper',
    'Party Decor',
    'Cupcake',
    'Party Hat',
    'Gift Box',
    'Confetti',
    'Sweet Treat',
  ],
  winter: [
    'Snowflake',
    'Mitten',
    'Hot Cocoa',
    'Snowman',
    'Scarf',
    'Snowy Pine',
    'Ice Skate',
    'Penguin',
  ],
  ocean: ['Wave', 'Fish', 'Whale', 'Seashell', 'Anchor', 'Starfish', 'Octopus', 'Sailboat'],
  animals: ['Fox', 'Owl', 'Rabbit', 'Elephant', 'Lion', 'Bird', 'Turtle', 'Paw Print'],
  fantasy: ['Dragon', 'Castle', 'Wizard Hat', 'Magic Wand', 'Crown', 'Potion', 'Unicorn', 'Shield'],
}
export const PICKER_BADGE_GROUPS = [
  { id: 'milestones', name: 'Milestone medallions', badges: MEDALLION_BADGES },
  ...BANNER_THEMES.map((t) => ({
    id: `theme-${t.id}`,
    name: `${t.name} set`,
    badges: THEME_BADGE_SLOTS.map(
      (n) => THEME_BADGE_ASSETS[`./assets/theme-badges/${t.id}-${n}.webp`],
    )
      .filter(Boolean)
      .map((img, i) => ({
        id: `${t.id}-${i + 1}`,
        name: THEME_BADGE_NAMES[t.id]?.[i] ?? `${t.name} ${i + 1}`,
        img,
      })),
  })).filter((g) => g.badges.length),
]
// Flat catalog (kept for any lookups by id).
export const PICKER_BADGES = PICKER_BADGE_GROUPS.flatMap((g) => g.badges)

// ─── Gallery filters: subjects · color · favorites · recently used ────────────

// Cross-cutting subject tags, matched loosely against a badge's name (so a
// "Subject" view pulls e.g. every animal badge across all sets).
export const BADGE_SUBJECTS = [
  {
    id: 'symbols',
    name: 'Symbols',
    re: /book|star|rising|medal|trophy|champion|flame|streak|gift|reward|bookmark|glasses|quill|crown|shield/i,
  },
  {
    id: 'animals',
    name: 'Animals',
    re: /fox|owl|rabbit|elephant|lion|bird|turtle|paw|deer|penguin|whale|fish|octopus|dragon|unicorn/i,
  },
  {
    id: 'nature',
    name: 'Nature',
    re: /tree|leaf|leaves|mushroom|wave|shell|flower|flores|sun|snow|mitten|scarf|pine|acorn|apple|pumpkin/i,
  },
  {
    id: 'food',
    name: 'Food',
    re: /taco|flan|empanada|arepa|plantain|guac|corn|lime|ice cream|popsicle|cupcake|cake|cocoa/i,
  },
  {
    id: 'celebration',
    name: 'Celebration',
    re: /balloon|confetti|party|firework|music|microphone|hooray|bingo|maraca|pinata|piñata|flamenco|salsa|sombrero|stars|celebration/i,
  },
  { id: 'space', name: 'Space', re: /planet|rocket|moon|comet|astronaut|space/i },
  {
    id: 'comics',
    name: 'Comics',
    re: /bam|bang|pow|zap|crash|boom|flash|poof|whoa|blah|quiz|crossroad|bright|all.?star/i,
  },
  {
    id: 'magic',
    name: 'Magic',
    re: /dragon|castle|wizard|wand|potion|unicorn|magic|crown|shield/i,
  },
]
export const subjectsOf = (name = '') =>
  BADGE_SUBJECTS.filter((s) => s.re.test(name)).map((s) => s.id)
// Theme badges have generic names ("Winter 5"), so a set also lends its subjects
// to its badges (combined with name-keyword matching for descriptively-named ones).
export const SET_SUBJECTS = {
  milestones: ['symbols'],
  'theme-reading': ['symbols'],
  'theme-summer': ['nature'],
  'theme-autumn': ['nature'],
  'theme-space': ['space'],
  'theme-forest': ['nature'],
  'theme-celebration': ['celebration'],
  'theme-winter': ['nature'],
  'theme-ocean': ['nature'],
  'theme-animals': ['animals'],
  'theme-fantasy': ['magic'],
}

// Color buckets + lazy dominant-color derivation from each badge image (sampled
// on a canvas, cached). Same-origin assets, so pixel reads are allowed.
export const COLOR_BUCKETS = [
  { id: 'red', name: 'Red', hex: '#ef4444' },
  { id: 'orange', name: 'Orange', hex: '#f97316' },
  { id: 'yellow', name: 'Yellow', hex: '#eab308' },
  { id: 'green', name: 'Green', hex: '#22c55e' },
  { id: 'teal', name: 'Teal', hex: '#14b8a6' },
  { id: 'blue', name: 'Blue', hex: '#3b82f6' },
  { id: 'purple', name: 'Purple', hex: '#8b5cf6' },
  { id: 'pink', name: 'Pink', hex: '#ec4899' },
  { id: 'neutral', name: 'Neutral', hex: '#94a3b8' },
]
function _hueBucket(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min
  const l = (max + min) / 2
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  if (s < 0.16 || l < 0.12 || l > 0.94) return 'neutral'
  let h = 0
  if (max === r) h = ((g - b) / d) % 6
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  h *= 60
  if (h < 0) h += 360
  if (h < 15 || h >= 345) return 'red'
  if (h < 40) return 'orange'
  if (h < 66) return 'yellow'
  if (h < 160) return 'green'
  if (h < 195) return 'teal'
  if (h < 250) return 'blue'
  if (h < 290) return 'purple'
  return 'pink'
}
const _colorCache = new Map()
export const badgeColor = (url) => _colorCache.get(url) || null
export async function ensureBadgeColors(urls = []) {
  await Promise.all(
    urls
      .filter((u) => u && !_colorCache.has(u))
      .map(async (u) => {
        try {
          const img = new Image()
          img.src = u
          await img.decode()
          const S = 24
          const c = document.createElement('canvas')
          c.width = S
          c.height = S
          const ctx = c.getContext('2d', { willReadFrequently: true })
          ctx.drawImage(img, 0, 0, S, S)
          const { data } = ctx.getImageData(0, 0, S, S)
          let r = 0,
            g = 0,
            b = 0,
            n = 0
          for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] < 128) continue
            const rr = data[i],
              gg = data[i + 1],
              bb = data[i + 2]
            if (rr > 235 && gg > 235 && bb > 235) continue // skip near-white background
            r += rr
            g += gg
            b += bb
            n++
          }
          _colorCache.set(u, n ? _hueBucket(r / n, g / n, b / n) : 'neutral')
        } catch {
          _colorCache.set(u, 'neutral')
        }
      }),
  )
}

// Favorites + recently-used badges, keyed by image URL (the stable art identity).
const FAV_KEY = 'cc-fav-badges'
const RECENT_KEY = 'cc-recent-badges'
const _readKeys = (k) => {
  try {
    return JSON.parse(localStorage.getItem(k)) || []
  } catch {
    return []
  }
}
export const getFavoriteBadges = () => _readKeys(FAV_KEY)
export const toggleFavoriteBadge = (img) => {
  const f = getFavoriteBadges()
  const next = f.includes(img) ? f.filter((x) => x !== img) : [img, ...f]
  localStorage.setItem(FAV_KEY, JSON.stringify(next))
  return next
}
export const getRecentBadges = () => _readKeys(RECENT_KEY)
export const pushRecentBadge = (img) => {
  if (!img) return getRecentBadges()
  const next = [img, ...getRecentBadges().filter((x) => x !== img)].slice(0, 18)
  localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  return next
}

// Other live challenges available to pair as an Alternative Challenge.
export const EXISTING_CHALLENGES = [
  { id: 'summer-2026', name: 'Summer Reading 2026' },
  { id: 'winter-pages', name: 'Winter Page Turners' },
  { id: 'graphic-bingo', name: 'Graphic Novel Bingo' },
]

// Real book catalog for the Reading List "Add a title" search. Covers come from
// the Open Library cover CDN by ISBN (with an onError fallback in the UI).
const BOOKS = [
  ['The One and Only Ivan', 'Katherine Applegate', '9780061992278'],
  ['Wonder', 'R. J. Palacio', '9780375869020'],
  ['Front Desk', 'Kelly Yang', '9781338157796'],
  ['New Kid', 'Jerry Craft', '9780062691200'],
  ['Amari and the Night Brothers', 'B. B. Alston', '9780062975171'],
  ['Charlotte’s Web', 'E. B. White', '9780064410939'],
  ['Holes', 'Louis Sachar', '9780440414803'],
  ['The Giver', 'Lois Lowry', '9780544336261'],
  ['Hatchet', 'Gary Paulsen', '9781416936473'],
  ['Bridge to Terabithia', 'Katherine Paterson', '9780064401845'],
  ['The Lightning Thief', 'Rick Riordan', '9780786838653'],
  ['Harry Potter and the Sorcerer’s Stone', 'J. K. Rowling', '9780590353427'],
  ['Matilda', 'Roald Dahl', '9780142410370'],
  ['The Crossover', 'Kwame Alexander', '9780544107717'],
  ['Brown Girl Dreaming', 'Jacqueline Woodson', '9780147515827'],
  ['Refugee', 'Alan Gratz', '9780545880831'],
  ['Out of My Mind', 'Sharon M. Draper', '9781416971719'],
  ['Smile', 'Raina Telgemeier', '9780545132060'],
  ['A Wrinkle in Time', 'Madeleine L’Engle', '9780312367541'],
  ['El Deafo', 'Cece Bell', '9781419712173'],
  ['Because of Winn-Dixie', 'Kate DiCamillo', '9780763680862'],
  ['Esperanza Rising', 'Pam Muñoz Ryan', '9780439120425'],
  ['The War That Saved My Life', 'Kimberly Brubaker Bradley', '9780803740815'],
  ['Ghost', 'Jason Reynolds', '9781481450157'],
]
export const BOOK_CATALOG = BOOKS.map(([title, author, isbn], i) => ({
  id: `bk-${i}`,
  title,
  author,
  isbn,
  cover: `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
}))

export const SAMPLE_TITLES = BOOK_CATALOG.slice(0, 5)

// Activities readers complete. repeatable = can be done multiple times (each
// counts again); non-repeatable = counts once. In a points challenge, repeatable
// activities earn points every time and non-repeatable ones earn a single badge.
export const SAMPLE_ACTIVITIES = [
  { name: 'Visit the library', repeatable: false },
  { name: 'Attend a book club meeting', repeatable: true },
  { name: 'Write a book recommendation', repeatable: true },
  { name: 'Complete the summer kickoff event', repeatable: false },
]

// ─── Capability resolver: which steps are visible for (mode, role, type) ──────
const BASE_STEP_NAMES = {
  type: 'Type',
  details: 'Details',
  badges: 'Badges',
  setup: 'Setup',
  rewards: 'Rewards',
  completion: 'Completion',
}

export function getSteps({ mode, role, type }) {
  // Reading lists pick their titles up front (before badges); bingo/gameboard
  // build the board later (after rewards), once badges + prizes are decided.
  const isReadingList = type?.primaryMethod === 'readingList'
  const setupStep = { id: 'setup', name: type?.setupName || BASE_STEP_NAMES.setup }
  const steps = [
    { id: 'type', name: BASE_STEP_NAMES.type },
    { id: 'details', name: BASE_STEP_NAMES.details },
  ]
  if (type?.setup && isReadingList) steps.push(setupStep)
  steps.push({ id: 'badges', name: BASE_STEP_NAMES.badges })
  // Rewards/tickets/certificates: full creators only (MS+, public librarian).
  // Teacher/MS (simple) can't access rewards in the creator, per Beanstack's
  // classroom-challenge permissions.
  const showRewards = mode === 'challenge' && role?.tier === 'full'
  if (showRewards) steps.push({ id: 'rewards', name: BASE_STEP_NAMES.rewards })
  if (type?.setup && !isReadingList) steps.push(setupStep)
  // Book Talks (AI reading conversations) — logging-style challenges at schools only.
  if (type?.primaryMethod === 'log' && role?.site === 'school') {
    steps.push({ id: 'bookTalks', name: 'Book Talks' })
  }
  // Completion, unless it's implicit (bingo).
  if (!type?.autoComplete) steps.push({ id: 'completion', name: BASE_STEP_NAMES.completion })
  return steps
}

// Default challenge window: today → one week out, as yyyy-mm-dd for <input type=date>.
const toISODate = (d) => {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}
export const DEFAULT_START = toISODate(new Date())
export const DEFAULT_END = (() => {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return toISODate(d)
})()

// A truly-blank challenge for "start from scratch".
export function blankChallenge(typeId) {
  const type = getType(typeId)
  return {
    typeId,
    templateId: 'scratch',
    methods: type ? { [type.primaryMethod]: true } : {},
    details: {
      name: '',
      description: '',
      previewDescription: '',
      position: 1,
      accent: type?.accent || '#0DA7BC',
      accentOverride: false, // accent follows the banner variation unless overridden
      background: { kind: 'preset', id: 'reading-1' },
      templateBanner: null,
      headerFont: 'Poppins',
      headerFontSize: 0.85, // multiplier; auto-fit shrinks below this if needed
      fontColor: '#FFFFFF', // title color; only applied when fontColorOverride is on
      fontColorOverride: false,
      subheader: { enabled: false, text: 'Reading Challenge' },
      basis: 'grade', // 'age' | 'grade' — which audience filter applies
      ageMin: 0,
      ageMax: 109,
      start: DEFAULT_START,
      end: DEFAULT_END,
      grades: [],
      classrooms: [],
      branches: [],
      staffOnly: false,
      requireCode: false,
      code: '',
      preregister: true,
      featured: false,
      alternative: 'no', // 'no' | 'yes' — Alternative Challenge during registration
      registration: { gender: false, gradeLevel: false, branch: false },
    },
    badges: [],
    reviewBadges: [], // badges earned by writing N reviews (when Reviews is on)
    badgeTime: 'any', // 'any' | 'restricted' — badge time restrictions
    badgeWindow: { start: '', end: '' }, // required when badgeTime === 'restricted'
    registrationBadge: null,
    completionBadge: null,
    activities: SAMPLE_ACTIVITIES.map((a) => ({ ...a })),
    setup: {
      bingoSize: '4x4',
      titles: [],
      boardSpaces: 12,
      // Gameboard
      gameboardCells: [], // logging-badge ids placed along the board (in order)
      gameboardTheme: null, // null → defaults to the applied template's theme, else 'meadow'
      gameboardColor: '#16A97A', // custom-theme color scheme
      gbShowRewards: true, // show reward/gift markers on the board
      gbShowHalfway: true, // show a halfway marker
      gbBadges: 8, // number of badge spaces on the board
    },
    rewards: { perBadge: {}, library: [], tickets: [] },
    completion: { mode: 'all', required: [] },
    bookTalks: { onTitleCompletions: false },
  }
}

export const getBackground = (id) => BANNERS.find((b) => b.id === id) ?? BANNERS[0]

// ─── Template presets — real Beanstack challenges (banner with baked-in text +
// the challenge's own badge set). Assets loaded from assets/templates/<id>/. ──
const TPL_ASSETS = import.meta.glob('./assets/templates/*/*.webp', {
  eager: true,
  import: 'default',
})
const tplAsset = (id, file) => TPL_ASSETS[`./assets/templates/${id}/${file}`]

// Curated badge set per template — [file, name]. Each template keeps a single,
// consistent art style (character illustrations, neon icons, or comic bursts) and
// drops the redundant "COMPLETED / BOOK LOVER" text-overlay variants so a set is
// never a mix of with-text and without-text art.
const TEMPLATE_BADGES = {
  // Benny — the full no-text ("- Blank") character set, named from the real library.
  benny: [
    ['book-lover.webp', 'Book Lover'],
    ['hit-the-books.webp', 'Hit the Books'],
    ['reading-explorer.webp', 'Reading Explorer'],
    ['speed-reader.webp', 'Speed Reader'],
    ['reading-star.webp', 'Reading Star'],
    ['reading-champion.webp', 'Reading Champion'],
    ['reading-royalty.webp', 'Reading Royalty'],
    ['rock-star.webp', 'Rock Star'],
    ['top-reader.webp', 'Top Reader'],
    ['out-of-this-world.webp', 'Out of This World'],
  ],
  // In My Reading Era — kid character portraits, named for reading "eras".
  era: [
    ['kid-1.webp', 'Cozy Reading Era'],
    ['kid-2.webp', 'Daydreamer Era'],
    ['kid-3.webp', 'Imagination Era'],
    ['kid-4.webp', 'Sunny Stories Era'],
    ['kid-5.webp', 'Adventure Era'],
    ['kid-6.webp', 'Page-Turner Era'],
    ['kid-7.webp', 'Curious Reader Era'],
    ['kid-8.webp', 'Storytime Era'],
  ],
  // Glow Party — neon icon set.
  glow: [
    ['open-book.webp', 'Open Book'],
    ['standing-books.webp', 'Book Stack'],
    ['grad-stack.webp', 'Top of the Class'],
    ['apple-stack.webp', "Teacher's Pet"],
    ['cake.webp', 'Celebration Cake'],
    ['cupcake.webp', 'Sweet Treat'],
    ['fireworks.webp', 'Fireworks'],
    ['music-notes.webp', 'Music Notes'],
    ['microphone.webp', 'On the Mic'],
    ['stars.webp', 'Star Power'],
    ['magic-wand.webp', 'Magic Touch'],
    ['party-hats.webp', 'Party Time'],
  ],
  // Comics Choice — comic-burst onomatopoeia set.
  comics: [
    ['bam.webp', 'BAM!'],
    ['bang.webp', 'BANG!'],
    ['boom.webp', 'BOOM!'],
    ['pow.webp', 'POW!'],
    ['zap.webp', 'ZAP!'],
    ['flash.webp', 'FLASH!'],
    ['pop.webp', 'POP!'],
    ['poof.webp', 'POOF!'],
    ['whoa.webp', 'Whoa!'],
    ['hooray.webp', 'Hooray!'],
    ['bingo.webp', 'Bingo!'],
    ['blah.webp', 'Blah Blah Blah'],
  ],
  // Hispanic Heritage Month — cultural icon set.
  hhm: [
    ['chichen-itza.webp', 'Chichén Itzá'],
    ['taco.webp', 'Tacos'],
    ['empanada-lime.webp', 'Empanadas & Lime'],
    ['arepa-corn.webp', 'Arepas & Corn'],
    ['plantains-guac.webp', 'Plátanos & Guac'],
    ['flan.webp', 'Flan'],
    ['maracas.webp', 'Maracas'],
    ['flamenco.webp', 'Flamenco'],
    ['salsa-dancing.webp', 'Salsa Dancing'],
    ['sombrero.webp', 'Sombrero'],
    ['pinata.webp', 'Piñata'],
    ['flowers.webp', 'Flores'],
  ],
  // Battle of the Books — comic pop-art set.
  botb: [
    ['bam.webp', 'BAM!'],
    ['bang.webp', 'BANG!'],
    ['pow.webp', 'POW!'],
    ['zap.webp', 'ZAP!'],
    ['crash.webp', 'CRASH!'],
    ['direction.webp', 'Crossroads'],
    ['questions.webp', 'Quiz Master'],
    ['lightbulb.webp', 'Bright Idea'],
    ['star.webp', 'All-Star'],
    ['open-book.webp', 'Open Book'],
  ],
}
const tplBadges = (id) =>
  (TEMPLATE_BADGES[id] || [])
    .map(([file, name]) => {
      const img = tplAsset(id, file)
      return img ? { img, name } : null
    })
    .filter(Boolean)

// A single named badge from a template folder (e.g. registration/completion art),
// or null when that art doesn't exist for the template.
const tplBadge = (id, file, name) => {
  const img = tplAsset(id, file)
  return img ? { name, img } : null
}

// Build a template's default rewards. Ids are prefixed by the template id so
// they're stable across edits (and never collide with `newRewardId`'s timestamp
// format). Each template seeds a completion certificate plus a prize or two;
// some add a ticket-raffle prize where it fits the theme. badgeIds start empty —
// the creator assigns rewards to specific badges. Shapes match RewardsStep's
// saveReward / saveTicket / saveCert.
const tplRewards = (id, { prizes = [], certificate, tickets = [] }) => ({
  // Default rewards are earned on challenge completion (the `comp` badge), so
  // they arrive pre-assigned rather than "Not assigned to a badge".
  items: prizes.map((p, i) => ({
    id: `${id}-rw-${i + 1}`,
    title: p.title,
    description: p.description || '',
    badgeIds: p.badgeIds || ['comp'],
    source: 'template',
  })),
  certsEnabled: !!certificate,
  certificates: certificate
    ? [
        {
          id: `${id}-ct-1`,
          title: certificate.title,
          bannerTitle: certificate.bannerTitle || 'Certificate of Achievement',
          description: certificate.description || '',
          body: certificate.body || '',
          badgeIds: certificate.badgeIds || ['comp'],
        },
      ]
    : [],
  ticketsEnabled: tickets.length > 0,
  ticketSource: 'all',
  ticketsPerBadge: 1,
  ticketBadges: {},
  ticketRewards: tickets.map((t, i) => ({
    id: `${id}-tr-${i + 1}`,
    name: t.name,
    description: t.description || '',
    cost: t.cost || 5,
    image: null,
  })),
})

export const TEMPLATE_PRESETS = {
  benny: {
    name: 'Have You Seen Benny?',
    accent: '#16A97A',
    theme: 'forest',
    banner: tplAsset('benny', 'banner.webp'),
    badges: tplBadges('benny'),
    description:
      '<p>Help readers spot <strong>Benny the Bean</strong> all around your library or school as they log their reading and complete activities.</p>',
    previewDescription: 'A Benny-themed reading hunt — log reading to find Benny around town.',
    rewards: tplRewards('benny', {
      prizes: [
        { title: 'Benny Sticker Pack', description: 'A sheet of Benny the Bean stickers.' },
        { title: 'Beanstack Bookmark', description: 'A collectible Benny bookmark.' },
      ],
      certificate: {
        title: 'Benny Reader Certificate',
        bannerTitle: 'Certificate of Reading',
        description: 'Awarded for spotting Benny all season long.',
      },
    }),
  },
  era: {
    name: 'In My Reading Era',
    accent: '#0EA5B7',
    theme: 'reading',
    banner: tplAsset('era', 'banner.webp'),
    badges: tplBadges('era'),
    description:
      '<p>Move through your <strong>reading eras</strong> — log books and unlock a badge for every era you enter.</p>',
    previewDescription: 'Journey through your reading eras and collect a badge for each one.',
    rewards: tplRewards('era', {
      prizes: [
        {
          title: 'Free Book of Your Choice',
          description: 'Pick any book to keep from the prize cart.',
        },
      ],
      certificate: {
        title: 'Reading Era Certificate',
        bannerTitle: 'Certificate of Achievement',
        description: 'Awarded for journeying through every reading era.',
      },
    }),
  },
  glow: {
    name: 'Glow Party',
    accent: '#7C3AED',
    theme: 'celebration',
    banner: tplAsset('glow', 'banner.webp'),
    badges: tplBadges('glow'),
    description:
      '<p>Lights down, books up! A glowing, neon reading celebration with badges to collect all night long.</p>',
    previewDescription: 'A bright, neon reading party — log reading and light up your badges.',
    rewards: tplRewards('glow', {
      prizes: [{ title: 'Glow Wristband', description: 'A light-up wristband for the party.' }],
      certificate: {
        title: 'Glow Reader Certificate',
        bannerTitle: 'Certificate of Achievement',
      },
      tickets: [
        {
          name: 'Glow Party Invite',
          description: 'An invite to the end-of-challenge glow party.',
          cost: 5,
        },
        {
          name: 'Front-Row Glow Seat',
          description: 'A reserved front-row seat at the glow party.',
          cost: 10,
        },
        {
          name: 'Light-Up Gift Bag',
          description: 'A goodie bag of glow-in-the-dark prizes.',
          cost: 20,
        },
      ],
    }),
  },
  comics: {
    name: 'Comics Choice',
    accent: '#DB2777',
    theme: 'fantasy',
    banner: tplAsset('comics', 'banner.webp'),
    badges: tplBadges('comics'),
    description:
      '<p>POW! BAM! Celebrate graphic novels and comics — log your reading to earn comic-book badges.</p>',
    previewDescription: 'A comic-book themed challenge celebrating graphic novels and comics.',
    rewards: tplRewards('comics', {
      prizes: [
        { title: 'Graphic Novel of Your Choice', description: 'Pick a graphic novel to keep.' },
        {
          title: 'Comic Creator Kit',
          description: 'Pens, panels, and paper to make your own comic.',
        },
      ],
      certificate: {
        title: 'Comics Champion Certificate',
        bannerTitle: 'Certificate of Achievement',
      },
    }),
  },
  hhm: {
    name: 'Hispanic Heritage Month',
    accent: '#0F766E',
    theme: 'celebration',
    banner: tplAsset('hhm', 'banner.webp'),
    badges: tplBadges('hhm'),
    description:
      '<p>Celebrate <strong>Hispanic Heritage Month</strong> with books by and about Hispanic and Latino authors, artists, and changemakers.</p>',
    previewDescription:
      'Celebrate Hispanic Heritage Month with books by and about Hispanic voices.',
    rewards: tplRewards('hhm', {
      prizes: [
        {
          title: 'Featured Author Book',
          description: 'A book by a celebrated Hispanic or Latino author.',
        },
      ],
      certificate: {
        title: 'Hispanic Heritage Reader Certificate',
        bannerTitle: 'Certificate of Achievement',
      },
    }),
  },
  botb: {
    name: 'Battle of the Books',
    accent: '#E8453A',
    theme: 'reading',
    banner: tplAsset('botb', 'banner.webp'),
    badges: tplBadges('botb'),
    description:
      '<p>Get <strong>battle ready!</strong> Read from the official Battle of the Books list and test your knowledge against other teams.</p>',
    previewDescription: 'Read the official Battle of the Books list and compete with other teams.',
    rewards: tplRewards('botb', {
      prizes: [{ title: 'Team Trophy', description: 'For the winning Battle of the Books team.' }],
      certificate: {
        title: 'Battle of the Books Certificate',
        bannerTitle: 'Certificate of Achievement',
      },
      tickets: [
        {
          name: 'Pizza Party',
          description: 'A class pizza party for the top-reading team.',
          cost: 10,
        },
        {
          name: 'Author Video Call',
          description: 'A live video call with a featured author.',
          cost: 25,
        },
        {
          name: 'Champion Medal Set',
          description: 'Medals for every member of the winning team.',
          cost: 15,
        },
      ],
    }),
  },
}

// Applying a template = a fixed banner image (text baked in, like an upload) +
// the template's badge set. `templateBanner` is kept so it can be restored.
// A logging badge must carry a log value (log type + goal). Seed an increasing
// "books" milestone ladder (1, 2, 3, …) the creator can adjust, and backfill any
// badge that's missing a value so no logging badge is ever left without one.
export const withLogMilestones = (badges = []) =>
  badges.map((b, i) => ({
    ...b,
    logType: b.logType || 'books',
    goal: Number(b.goal) >= 1 ? b.goal : i + 1,
  }))

// Points badges are earned at point thresholds. Seed an increasing ladder
// (50, 100, 150, …) so a points template never lacks a target.
export const withPointMilestones = (badges = []) =>
  badges.map((b, i) => ({
    name: b.name,
    img: b.img,
    goal: Number(b.goal) >= 1 ? b.goal : (i + 1) * 50,
  }))

// Review badges are earned by writing N reviews. Seed an increasing ladder
// (1, 2, 3, …) so a reviews template's badges always have a goal.
export const withReviewMilestones = (badges = []) =>
  badges.map((b, i) => ({
    name: b.name,
    img: b.img,
    goal: Number(b.goal) >= 1 ? b.goal : i + 1,
  }))

// Starter activity badges seeded into bingo templates so the card has a mix of
// logging + activity tiles to drag on. Art borrows the template's own badge set
// (falls back to a generic star) so it stays on-theme.
const BINGO_ACTIVITY_SEED = [
  ['Library Scavenger Hunt', 'activity', 'Find the hidden bookmarks around the library'],
  ['Story Time', 'event', 'Attend a story time session'],
  ['Read Aloud', 'video', 'Record yourself reading a favorite page'],
  ['Write a Review', 'review', 'Review a book you finished'],
]
const bingoActivityBadges = (preset) =>
  BINGO_ACTIVITY_SEED.map(([title, type, description], i) => ({
    id: `tpl-act-${i}`,
    title,
    badge: { img: preset.badges?.[i % (preset.badges.length || 1)]?.img || badgeStar },
    activities: [{ type, description, linkTitle: '', linkUrl: '', codes: [] }],
  }))

// Turn a template's plain badge set into activity badges, so a (multi-type)
// template applied to an Activity challenge still seeds something to earn.
const badgesToActivityBadges = (badges = []) =>
  badges.map((b, i) => ({
    id: `tpl-act-${i}`,
    title: b.name || `Activity ${i + 1}`,
    badge: { img: b.img },
    activities: [{ type: 'activity', description: '', linkTitle: '', linkUrl: '', codes: [] }],
  }))

export function applyTemplate(challenge, templateId) {
  if (!templateId || templateId === 'scratch') {
    // Start from scratch = a fresh blank challenge of the same type (also clears
    // any uploaded/template banner back to the default theme).
    return { ...blankChallenge(challenge.typeId), mode: challenge.mode }
  }
  const preset = TEMPLATE_PRESETS[templateId]
  if (!preset) return { ...challenge, templateId }
  return {
    ...challenge,
    templateId,
    // Seed the template's default rewards (cloned so edits never touch the preset).
    rewards: preset.rewards ? JSON.parse(JSON.stringify(preset.rewards)) : challenge.rewards,
    // Reading-list templates ship a curated title list → seed it into setup.
    ...(preset.titles
      ? { setup: { ...challenge.setup, titles: preset.titles.map((t) => ({ ...t })) } }
      : {}),
    details: {
      ...challenge.details,
      name: preset.name,
      description: preset.description ?? challenge.details.description,
      previewDescription: preset.previewDescription ?? challenge.details.previewDescription,
      accent: preset.accent,
      background: { kind: 'upload', name: `${preset.name} banner`, src: preset.banner },
      templateBanner: preset.banner,
    },
    // Scaffolded starter badges, seeded into the array that matches the type's
    // primary method: points → Points badges, reviews → Review badges (logging
    // stays off), everything else → logging badges (always run withLogMilestones
    // so each carries a log value, never "Needs a log value").
    badges: ['points', 'reviews', 'activities'].includes(getType(challenge.typeId)?.primaryMethod)
      ? []
      : withLogMilestones(preset.badges),
    pointsBadges:
      getType(challenge.typeId)?.primaryMethod === 'points'
        ? withPointMilestones(preset.badges)
        : challenge.pointsBadges || [],
    reviewBadges:
      getType(challenge.typeId)?.primaryMethod === 'reviews'
        ? withReviewMilestones(preset.badges)
        : challenge.reviewBadges || [],
    // The template also seeds the registration + completion badges: its own
    // dedicated art when the folder has it, else borrow from the template's own
    // badge set so they stay on-theme (the first badge for registration, the
    // last for completion) — generic star/trophy only as a final fallback.
    registrationBadge: preset.registrationBadge ||
      tplBadge(templateId, 'registration.webp', 'Welcome badge') || {
        name: 'Welcome badge',
        img: preset.badges?.[0]?.img || badgeStar,
      },
    completionBadge: preset.completionBadge ||
      tplBadge(templateId, 'completion.webp', 'Challenge complete') || {
        name: 'Challenge complete',
        img: preset.badges?.[preset.badges.length - 1]?.img || badgeTrophy,
      },
    // Activity-primary templates ship their own activity badges (each earned by
    // completing a task) — seed them directly.
    ...(getType(challenge.typeId)?.primaryMethod === 'activities'
      ? {
          activityBadges: preset.activityBadges
            ? preset.activityBadges.map((a) => ({ ...a }))
            : badgesToActivityBadges(preset.badges),
        }
      : {}),
    // Bingo cards don't use a completion badge — they earn a bingo badge (a row,
    // column, or diagonal) and a full-card badge — and the card is filled with
    // logging + activity tiles, so seed a starter set of activity badges too.
    ...(getType(challenge.typeId)?.id === 'bingo'
      ? {
          activityBadges: bingoActivityBadges(preset),
          bingoBadge: preset.bingoBadge ||
            tplBadge(templateId, 'bingo.webp', 'Bingo!') || { name: 'Bingo!', img: badgeMedal },
          fullCardBadge: preset.fullCardBadge ||
            tplBadge(templateId, 'completion.webp', 'Full card!') || {
              name: 'Full card!',
              img: badgeTrophy,
            },
        }
      : {}),
  }
}
