// ─── Collection Engine — the fixtures everything else is a sum of ───────────
//
// Three things are stated here, and nothing else:
//
//   CATALOG   what a school can actually get a reader to — one row per title,
//             with the holdings that back it (print copies from a MARC drop, a
//             classroom shelf, a digital licence).
//   READERS   who is reading, and the RMI motivation factor that scores highest
//             for them.
//   EVENTS    every time the engine suggested a title, and what came of it.
//
// Every number on every screen is a reduce over those three (see derive.js).
// Nothing is a hand-typed total, because a hand-typed total stops surviving the
// first "where does that come from" in a meeting.
//
// The titles are real books: the 414-title grade 3–5 pool in `rmi/library.js`,
// already filed under the RMI toolkit's own genre names. That filing is what
// makes the motivation → genre → title chain *work* here rather than be
// asserted — a reader whose top factor is `curiosity` is suggested titles from
// Mystery/Whodunit, Puzzle/Interactive and Narrative Non-Fiction because those
// are the three genres the toolkit names for curiosity.

import { TITLES_BY_GENRE } from '../rmi/library.js'
import { GENRES_BY_FACTOR } from '../rmi/genres.js'
import { FACTORS } from '../rmi/domain.js'

// ─── Deterministic randomness ────────────────────────────────────────────────
// Same fixtures on every load, every machine — a prototype whose numbers move
// between refreshes can't be pointed at in a demo.

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function rng(seed) {
  let a = typeof seed === 'string' ? hash(seed) : seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = (r, list) => list[Math.floor(r() * list.length)]
const between = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1))

/* The seeded helpers, for the sibling modules that build off these fixtures.
   Everything in this prototype is derived from a seed so no number ever moves
   between loads; anything generating alongside it has to use the same ones. */
export { rng, pick, between }

// ─── Where a title can come from ─────────────────────────────────────────────
// The three certainties the reader UI has to keep apart, named once here.
//
//   own   we own the licence — the reader gets it in one tap.
//   hold  a holding with a queue. The platform knows if it's free; we don't.
//   shelf a physical copy the school owns. We know they own it, not that it's in.

export const SOURCES = {
  destiny: {
    id: 'destiny',
    brand: 'follett',
    name: 'Follett Destiny',
    short: 'Library',
    kind: 'shelf',
    color: '#196DD5',
    feed: 'MARC',
    blurb: 'Print holdings from the school library catalog.',
  },
  clc: {
    id: 'clc',
    brand: null,
    name: 'Classroom Library',
    short: 'Classroom',
    kind: 'shelf',
    color: '#0BA85F',
    feed: 'Scanned',
    blurb: 'Books teachers have scanned into their own classroom shelves.',
  },
  sora: {
    id: 'sora',
    brand: 'sora',
    name: 'Sora',
    short: 'Sora',
    kind: 'hold',
    color: '#2C6BED',
    feed: 'API',
    blurb: 'Ebooks and audiobooks borrowed through OverDrive.',
  },
  comicsplus: {
    id: 'comicsplus',
    brand: 'comicsplus',
    name: 'Comics Plus',
    short: 'Comics Plus',
    kind: 'own',
    color: '#0CA7BC',
    feed: 'Direct',
    blurb: 'Unlimited simultaneous access — no holds, no waitlists.',
  },
}

export const SOURCE_ORDER = ['destiny', 'clc', 'sora', 'comicsplus']

/** What a holding lets us honestly say on a book card. */
export const CERTAINTY = {
  own: { label: 'Read it now', sub: 'we own the licence', color: '#0CA7BC' },
  hold: { label: 'Borrow it', sub: 'may have a hold queue', color: '#2C6BED' },
  shelf: { label: 'Your library owns it', sub: 'not the same as on the shelf', color: '#0BA85F' },
}

// ─── What drives a recommendation ────────────────────────────────────────────
//
// Seven signals, and they sort under two different questions. Keeping them
// apart is what stops the engine feeling arbitrary: a *taste* signal argues a
// reader would want the book, a *fit* signal argues they can actually read it.
// A title that wins on taste and loses on fit is the 400-page novel handed to a
// reader who logs eight minutes a day — right book, wrong reader-right-now.
//
// Each one is data Beanstack already holds. Nothing here needs a new survey.

/* `ai` says what the model does in that half, in a line — a tooltip is a
   sentence you take in at a glance, not a policy page. Both halves are ranking
   problems: nothing here generates text, and nothing is written back to a
   reader's record. */
export const SIGNAL_KINDS = {
  taste: {
    label: 'Would they want it',
    blurb: 'What the reader likes, and who else is reading it.',
    ai: 'AI ranks the titles you own against these signals. It reads them; it writes nothing back.',
  },
  fit: {
    label: 'Can they read it',
    blurb: 'Whether the book is the right level and the right size.',
    ai: 'AI weighs level and session patterns to filter that ranking. It never sets a reading level.',
  },
}

export const SIGNALS = {
  wishlist: {
    id: 'wishlist',
    kind: 'taste',
    label: 'Wish list',
    blurb: 'Titles the reader saved for themselves — the only signal they state outright.',
    // The strongest thing in the product, and it produces the one moment that
    // isn't really a recommendation: the book they asked for is now gettable.
    weight: 'high',
    color: '#DC2626',
  },
  history: {
    id: 'history',
    kind: 'taste',
    label: 'What they have read',
    blurb:
      'Finished books, their authors, and the next title in a series they are partway through.',
    weight: 'high',
    color: '#0F766E',
  },
  rmi: {
    id: 'rmi',
    kind: 'taste',
    label: 'Reading motivation',
    blurb: 'The three genres the RMI names for what this reader reads for.',
    weight: 'high',
    color: '#B43DD0',
  },
  ratings: {
    id: 'ratings',
    kind: 'taste',
    label: 'Ratings and reviews',
    blurb: 'What they liked, not only what they finished. Needs ratings to be asked for.',
    weight: 'normal',
    color: '#F0A024',
  },
  peers: {
    id: 'peers',
    kind: 'taste',
    label: 'What their class is reading',
    blurb: 'Trending in their grade and their school — the recommendation children trust most.',
    weight: 'normal',
    color: '#E8553A',
  },
  lexile: {
    id: 'lexile',
    kind: 'fit',
    label: 'Reading level',
    blurb: 'Their Lexile, against how far past it the engine is allowed to reach.',
    weight: 'normal',
    color: '#196DD5',
  },
  patterns: {
    id: 'patterns',
    kind: 'fit',
    label: 'Reading patterns',
    blurb:
      'Session length, finish rate and abandonment — whether a book is the right size for the way they actually read.',
    weight: 'normal',
    color: '#0BA85F',
  },
}

export const SIGNAL_ORDER = ['wishlist', 'history', 'rmi', 'ratings', 'peers', 'lexile', 'patterns']

export const WEIGHTS = {
  off: { label: 'Not used' },
  low: { label: 'Counts a little' },
  normal: { label: 'Counts normally' },
  high: { label: 'Counts a lot' },
}

// ─── Motivation factors ──────────────────────────────────────────────────────
// `mystery` is in FACTORS but has no genres — it isn't a taste, it's the
// absence of a clear one — so it can't drive a suggestion and is left out.

export const FACTOR_KEYS = Object.keys(GENRES_BY_FACTOR)
export const factorLabel = (key) => FACTORS[key]?.student_name ?? key
export const factorGenres = (key) => (GENRES_BY_FACTOR[key] ?? []).map((g) => g.name)

/** genre → the factors that recommend it. Built once, read everywhere. */
export const FACTORS_BY_GENRE = (() => {
  const out = {}
  for (const key of FACTOR_KEYS) {
    for (const name of factorGenres(key)) (out[name] ??= []).push(key)
  }
  return out
})()

export const ALL_GENRES = Object.keys(TITLES_BY_GENRE)

// ─── Dewey-ish call numbers ──────────────────────────────────────────────────
// The thing MARC gives us for free and the thing that actually walks a kid to a
// shelf. Fiction files under the author's surname; non-fiction takes a class.

const NONFICTION_GENRES = new Set([
  'Biographies of Leaders',
  'Narrative Non-Fiction',
  'Informational Texts/Encyclopedias',
  'STEM Deep-Dives',
  'Biographies of Athletes/Innovators',
])

function callNumber(genre, author) {
  const surname = author
    .split(' ')
    .pop()
    .replace(/[^A-Za-z]/g, '')
    .toUpperCase()
  if (!NONFICTION_GENRES.has(genre)) return `FIC ${surname.slice(0, 3)}`
  if (genre.startsWith('Biograph')) return `B ${surname.slice(0, 3)}`
  if (genre === 'STEM Deep-Dives') return `500 ${surname.slice(0, 3)}`
  if (genre === 'Informational Texts/Encyclopedias') return `030 ${surname.slice(0, 3)}`
  return `973 ${surname.slice(0, 3)}`
}

const GRAPHIC = new Set([
  'Graphic Novels',
  'Graphic Novels & Manga',
  'Media Tie-ins',
  'Hi-Lo Books (High Interest, Low Readability)',
])

// ─── The catalog ─────────────────────────────────────────────────────────────

/**
 * One school's collection. `seed` varies the holdings, the match rate and the
 * activity, so six schools in a district are six genuinely different
 * collections rather than one collection with six labels on it.
 */
/* A school can't have shelved a book before it was printed, so the two years
   are drawn together rather than independently: publication first, then the
   acquisition somewhere between that and now. */
function editionYears(r) {
  const published = 2026 - between(r, 0, 26)
  return { published, addedYear: between(r, published, 2026) }
}

function buildCatalog(seed, { coverage, clcShare }) {
  const rows = []
  for (const genre of ALL_GENRES) {
    for (const book of TITLES_BY_GENRE[genre]) {
      const r = rng(`${seed}:${book.id}`)
      // Not every school owns every book — `coverage` is how much of the pool
      // this school's collection reaches.
      if (r() > coverage) continue

      const holdings = []
      if (r() < 0.82) {
        holdings.push({
          source: 'destiny',
          copies: between(r, 1, 4),
          callNumber: callNumber(genre, book.author),
        })
      }
      if (r() < clcShare) {
        holdings.push({
          source: 'clc',
          copies: 1,
          room: `Rm ${between(r, 101, 214)}`,
        })
      }
      if (r() < 0.46) holdings.push({ source: 'sora' })
      if (GRAPHIC.has(genre) && r() < 0.74) holdings.push({ source: 'comicsplus' })
      if (!holdings.length) continue

      rows.push({
        id: book.id,
        title: book.title,
        author: book.author,
        coverId: book.coverId,
        genre,
        factors: FACTORS_BY_GENRE[genre] ?? [],
        // The reading band the RMI toolkit's own library states for the title —
        // real, not generated.
        ageRange: book.ageRange,
        /* The rest of the catalog record. Generated from the seed the same way
           the lexile and the acquisition year are: a MARC record really does
           carry these, and the panel is about what a school's record says, not
           about any particular edition. */
        lexile: 380 + Math.floor(r() * 620),
        pageCount: between(r, 8, 44) * 8,
        language: r() < 0.06 ? 'English · Spanish' : 'English',
        isbn: `978-${between(r, 0, 1)}-${String(between(r, 200, 999))}-${String(between(r, 10000, 99999))}-${between(r, 0, 9)}`,
        ...editionYears(r),
        // How hard this title pulls in the ranking. Cubed, so the head of the
        // distribution takes most of the draws and a real tail never surfaces
        // at all — which is exactly what a dead shelf is.
        pull: Math.pow(r(), 3),
        holdings,
      })
    }
  }
  return rows
}

// ─── Readers ─────────────────────────────────────────────────────────────────

const FIRST = `Maya Noah Amara Eli Priya Jonah Zoe Mateo Ava Kai Leila Owen Nia Diego Ruby Silas
Hana Theo Imani Luca Freya Amir Sofia Jasper Elena Rowan Yara Felix Nora Andre Talia Milo Sana
Beckett Ines Quinn Layla Ezra Marisol Dashiell Aisha Bodhi Clara Omar Josie Rafael Wren Tobias
Simone Hugo`
  .trim()
  .split(/\s+/)
const LAST = `Chen Okafor Rivera Patel Nguyen Brooks Alvarez Kowalski Haddad Lindqvist Osei Moreau
Tanaka Delgado Whitfield Abara Sorensen Castillo Bhatt Ferreira Novak Ellison Achebe Romano
Kaur Beaumont Mwangi Sato Vasquez Holloway`
  .trim()
  .split(/\s+/)

/* The three children the Student Profile prototype has actually built out. They
   are seeded into every school's reader list under their own names, so those
   three rows open the profile that is genuinely theirs. */
const PROFILED = [
  { name: 'Marcus Chen', profileKey: 'marcus' },
  { name: 'Anne Boonchuy', profileKey: 'anne' },
  { name: 'Tyler Voss', profileKey: 'tyler' },
]

/* Every other reader is generated for the funnel maths and has no record of
   their own, but a name in a table that can't be clicked reads as a dead end —
   so each one is assigned one of the three profiles and keeps the link. The
   assignment runs off the reader's own id rather than the list's stream, so a
   given reader always lands on the same profile and none of the funnel numbers
   downstream of it move. */
const PROFILE_KEYS = PROFILED.map((p) => p.profileKey)
const standInProfile = (id) => pick(rng(`profile:${id}`), PROFILE_KEYS)

function buildReaders(seed, count) {
  const r = rng(`${seed}:readers`)
  const used = new Set(PROFILED.map((p) => p.name))
  const out = PROFILED.map((p, i) => ({
    id: `${seed}-p${i}`,
    name: p.name,
    profileKey: p.profileKey,
    grade: between(r, 3, 5),
    factor: pick(r, FACTOR_KEYS),
    appetite: 0.55 + r() * 0.45,
    picky: 1,
  }))
  for (let i = 0; i < count - PROFILED.length; i++) {
    let name = `${pick(r, FIRST)} ${pick(r, LAST)}`
    let guard = 0
    while (used.has(name) && guard++ < 40) name = `${pick(r, FIRST)} ${pick(r, LAST)}`
    used.add(name)
    out.push({
      id: `${seed}-r${i}`,
      name,
      grade: between(r, 3, 5),
      factor: pick(r, FACTOR_KEYS),
      // How active this reader is — drives how many suggestions they saw and
      // how often anything came of one.
      appetite: 0.25 + r() * 0.75,
      // Roughly one reader in eight is one the recommender simply keeps
      // missing, however deep the collection is. They are the whole reason the
      // nudge list exists: no algorithm finds them, and a librarian who knows
      // their name will.
      picky: r() < 0.13 ? 0.22 : 1,
      // Stands in for a profile of their own — see standInProfile above.
      profileKey: standInProfile(`${seed}-r${i}`),
    })
  }
  return out
}

// ─── Events ──────────────────────────────────────────────────────────────────
// One row per suggestion the engine made. `saved` and `logged` are the only two
// outcomes we can actually observe — there is no checkout to see.

export const SURFACES = {
  postlog: { id: 'postlog', label: 'Right after logging', color: '#0F766E' },
  discover: { id: 'discover', label: 'Discover shelves', color: '#196DD5' },
  benny: { id: 'benny', label: 'Ask Benny', color: '#B43DD0' },
  bookpage: { id: 'bookpage', label: 'Book page', color: '#656565' },
}
/** Roughly how a year's suggestions split across the four surfaces. */
const SURFACE_WEIGHT = { postlog: 0.46, discover: 0.3, benny: 0.14, bookpage: 0.1 }

/* And which of the seven signals produced it. A stand-in for the mix rather
   than a guess at an algorithm — what it buys is that every suggestion in the
   product can say why it was made, here as well as in the classroom view. */
const SIGNAL_WEIGHT = {
  rmi: 0.3,
  history: 0.22,
  peers: 0.16,
  lexile: 0.12,
  ratings: 0.1,
  patterns: 0.06,
  wishlist: 0.04,
}

function weighted(r, weights) {
  const roll = r()
  let acc = 0
  for (const [key, w] of Object.entries(weights)) {
    acc += w
    if (roll < acc) return key
  }
  return Object.keys(weights)[0]
}

export const MONTHS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']

/* A school year has a shape, and a flat line pretending otherwise is the tell
   of a made-up chart. September ramps, December goes away for two weeks,
   March is Reading Month, May trails off into testing. */
const MONTH_WEIGHT = {
  Sep: 0.09,
  Oct: 0.13,
  Nov: 0.12,
  Dec: 0.07,
  Jan: 0.11,
  Feb: 0.12,
  Mar: 0.14,
  Apr: 0.12,
  May: 0.1,
}

function buildEvents(seed, readers, catalog, reach) {
  // Switching a catalog on is what makes its titles recommendable, so the pool
  // is simply everything the school has switched on.
  const pool = catalog
  if (!pool.length) return []

  // Weighted draw by `pull`. Precomputing the cumulative weights once per pool
  // is what lets the tail stay cold across thousands of draws.
  const weigh = (rows) => {
    const cum = []
    let total = 0
    for (const t of rows) {
      total += t.pull
      cum.push(total)
    }
    return { rows, cum, total }
  }
  const drawFrom = (r, w) => {
    const x = r() * w.total
    let lo = 0
    let hi = w.cum.length - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (w.cum[mid] < x) lo = mid + 1
      else hi = mid
    }
    return w.rows[lo]
  }

  const all = weigh(pool)
  const byFactor = {}
  for (const key of FACTOR_KEYS) {
    const genres = new Set(factorGenres(key))
    const fit = pool.filter((t) => genres.has(t.genre))
    byFactor[key] = fit.length ? weigh(fit) : null
  }

  const events = []
  for (const reader of readers) {
    const r = rng(`${seed}:ev:${reader.id}`)
    const fit = byFactor[reader.factor]
    // How well this school's collection serves what this reader reads for. A
    // reader whose motivation type has almost nothing behind it on the shelves
    // is the case the nudge list has to be able to show: the engine keeps
    // suggesting, and none of it fits. It is a collection gap wearing a
    // reader's name, which is why the two screens explain each other.
    const fitShare = fit ? Math.min(1, fit.rows.length / 26) : 0
    // A thinner collection has fewer good suggestions in it to make.
    const n = Math.round((6 + reader.appetite * 26) * (0.6 + 0.4 * reach))
    for (let i = 0; i < n; i++) {
      // Most suggestions come from the reader's own motivation genres — but
      // only as often as there is something there to draw on; the rest are the
      // peer/trending rows, which deliberately reach outside them.
      const onProfile = fit ? r() < 0.34 + 0.44 * fitShare : false
      const title = drawFrom(r, onProfile ? fit : all)
      const surface = weighted(r, SURFACE_WEIGHT)
      // Saving is likelier when the suggestion fits, and likeliest right after
      // logging — the reader is already in the habit at that moment.
      const lift = (onProfile ? 0.14 : 0) + (surface === 'postlog' ? 0.1 : 0)
      const saved = r() < (0.26 + lift * reader.appetite) * (0.5 + 0.5 * fitShare) * reader.picky
      // A save only becomes a log if they could actually get hold of it. Two
      // things decide that: how certain the holding is, and whether the catalog
      // we matched it against still describes the shelf. A school whose MARC
      // drop is five months old recommends books that have since gone.
      const certainty = title.holdings.some((h) => SOURCES[h.source].kind === 'own')
        ? 0.62
        : title.holdings.some((h) => SOURCES[h.source].kind === 'hold')
          ? 0.48
          : 0.36
      events.push({
        readerId: reader.id,
        titleId: title.id,
        surface,
        signal: weighted(r, SIGNAL_WEIGHT),
        month: weighted(r, MONTH_WEIGHT),
        onProfile,
        saved,
        logged: saved && r() < certainty * reach,
      })
    }
  }
  return events
}

// ─── What readers asked Benny for ────────────────────────────────────────────
// The demand side the catalog can't answer. `hits` is how many visible titles
// the query actually matched — a query with a handful of hits and a lot of asks
// is a collection gap stated in a student's own words.

export const BENNY_QUERIES = [
  { q: 'scary books that are not too scary', asks: 214, hits: 11 },
  { q: 'graphic novels like Dog Man', asks: 188, hits: 34 },
  { q: 'books about soccer', asks: 141, hits: 6 },
  { q: 'funny books for kids who hate reading', asks: 132, hits: 19 },
  { q: 'true stories about space', asks: 118, hits: 8 },
  { q: 'books with a girl who solves mysteries', asks: 97, hits: 22 },
  { q: 'manga for 4th graders', asks: 91, hits: 3 },
  { q: 'books about video games', asks: 84, hits: 2 },
  { q: 'something like Wings of Fire', asks: 76, hits: 28 },
  { q: 'books in Spanish', asks: 71, hits: 0 },
  { q: 'books about kids who move to a new school', asks: 63, hits: 17 },
  { q: 'short books I can finish in one day', asks: 58, hits: 24 },
]

// ─── Catalog feeds ───────────────────────────────────────────────────────────
// The supply side as an operational thing: what's connected, how it arrives,
// and how stale it is. `asOf` is the date every recommendation is implicitly
// stamped with.

export const TODAY = 'Sep 21, 2026'

/* `syncable` is whether there is anything to press. A feed that refreshes as it
   goes — a teacher scanning a book onto a classroom shelf, a licence catalog
   that is simply live — has no run to start, and a button offering one would be
   a control that does nothing. Destiny takes a file; Sora pulls nightly and can
   be pulled early. */
function buildFeeds(catalog, { destinyAsOf, destinyDays, soraState }) {
  const count = (source) =>
    catalog.filter((t) => t.holdings.some((h) => h.source === source)).length
  /* The order Setup lists them in, which is the order a librarian meets them:
     the shelves in their own building first (the classrooms, then the digital
     library both they and the district pay for), and the two that arrive from
     somewhere else after. Not the same as `SOURCE_ORDER`, which is the order of
     *certainty* a holding pill states and has its own reason. */
  return [
    {
      source: 'clc',
      state: 'ok',
      method: 'Classroom Library Connector',
      cadence: 'Live as teachers scan',
      syncable: false,
      asOf: 'Sep 19, 2026',
      staleDays: 2,
      titles: count('clc'),
      scope: '11 of 24 classrooms',
    },
    {
      source: 'sora',
      state: soraState,
      method: soraState === 'pending' ? 'OverDrive API — access requested' : 'OverDrive API',
      cadence: 'Nightly',
      asOf: soraState === 'pending' ? null : 'Sep 21, 2026',
      staleDays: 0,
      titles: count('sora'),
      scope: 'District OverDrive account',
    },
    {
      source: 'destiny',
      state: destinyAsOf == null ? 'off' : destinyDays > 30 ? 'stale' : 'ok',
      method: 'MARC file upload',
      cadence: 'Monthly, manual',
      asOf: destinyAsOf,
      staleDays: destinyDays,
      titles: count('destiny'),
      scope: 'This school only',
    },
    {
      source: 'comicsplus',
      state: 'ok',
      method: 'Direct — Joyful Reading',
      cadence: 'Live',
      syncable: false,
      asOf: 'Sep 21, 2026',
      staleDays: 0,
      titles: count('comicsplus'),
      scope: 'Whole school',
    },
  ]
}

// ─── The schools ─────────────────────────────────────────────────────────────

const SCHOOL_SPECS = [
  {
    id: 'lincoln',
    color: '#0F766E',
    grades: 'Grades 3–5',
    name: 'Lincoln Elementary',
    readerCount: 214,
    coverage: 0.82,
    clcShare: 0.22,
    destinyAsOf: 'Sep 12, 2026',
    destinyDays: 9,
    soraState: 'ok',
  },
  {
    id: 'garfield',
    color: '#D97706',
    grades: 'Grades 3–5',
    name: 'Garfield Elementary',
    readerCount: 186,
    coverage: 0.61,
    clcShare: 0.08,
    destinyAsOf: 'Jun 4, 2026',
    destinyDays: 109,
    soraState: 'ok',
  },
  {
    id: 'riverside',
    color: '#196DD5',
    grades: 'Grades 3–5',
    name: 'Riverside Intermediate',
    readerCount: 248,
    coverage: 0.9,
    clcShare: 0.34,
    destinyAsOf: 'Sep 18, 2026',
    destinyDays: 3,
    soraState: 'ok',
  },
  {
    id: 'oakmont',
    color: '#B43DD0',
    grades: 'Grades 3–5',
    name: 'Oakmont Elementary',
    readerCount: 162,
    coverage: 0.55,
    clcShare: 0.05,
    destinyAsOf: 'Apr 22, 2026',
    destinyDays: 152,
    soraState: 'pending',
  },
  {
    id: 'westbrook',
    color: '#0BA85F',
    grades: 'Grades 3–5',
    name: 'Westbrook Academy',
    readerCount: 203,
    coverage: 0.76,
    clcShare: 0.19,
    destinyAsOf: 'Sep 8, 2026',
    destinyDays: 13,
    soraState: 'ok',
  },
  {
    id: 'hillcrest',
    color: '#DC2626',
    grades: 'Grades 3–5',
    name: 'Hillcrest Elementary',
    readerCount: 139,
    coverage: 0.34,
    clcShare: 0.03,
    destinyAsOf: null,
    destinyDays: 999,
    soraState: 'pending',
  },
]

/**
 * How much of what the engine recommends a reader can actually lay hands on.
 * Depth of collection, minus how far the catalog has drifted from the shelf —
 * a five-month-old MARC drop recommends books that have since been weeded,
 * lost, or never re-shelved. This is the number the district view is really
 * comparing schools on, and it is the argument for automating the feed.
 */
function reachOf({ coverage, destinyDays }) {
  const drift = Math.min(0.4, (Math.min(destinyDays, 365) / 365) * 0.45)
  return Math.round((0.62 + 0.38 * coverage - drift) * 100) / 100
}

function buildSchool(spec) {
  const catalog = buildCatalog(spec.id, spec)
  const readers = buildReaders(spec.id, spec.readerCount)
  const reach = reachOf(spec)
  const events = buildEvents(spec.id, readers, catalog, reach)
  return { ...spec, reach, catalog, readers, events, feeds: buildFeeds(catalog, spec) }
}

export const SCHOOLS = SCHOOL_SPECS.map(buildSchool)
export const SCHOOL_BY_ID = Object.fromEntries(SCHOOLS.map((s) => [s.id, s]))
export const DISTRICT = { name: 'Riverbend Unified', schools: SCHOOLS.length }

/** The librarian's own school — who the school scope is for. */
export const LIBRARIAN = { name: 'Ms. Rivera', role: 'Librarian', schoolId: 'lincoln' }

// ─── Lists ───────────────────────────────────────────────────────────────────
/* Three things in the product put a title on a list, and a librarian judging a
   book wants all three in one place: the list they curated, the challenge that
   requires it, and the shelf the engine builds.

   `list` is the app's own `ReadingList` (admin nav: **Book Lists**) — a name, a
   description, grade levels, genres, a creator, and a book count; an external
   list links out instead of opening in Beanstack.
   `challenge` is a Reading List Challenge, which carries the list as its
   requirement (`program_books_requirement_type` /
   `minimum_required_program_books` on ChallengeBookList) and so has dates and a
   "read N of these" rule on top of the list itself.
   `discover` is the Discover shelf — the surface SURFACES already names, not
   yet a thing staff can curate. Shown here because the engine is already
   putting titles on it; what staff will be able to do to one is not settled. */
export const LIST_KINDS = {
  list: {
    id: 'list',
    label: 'Book Lists',
    single: 'Book List',
    blurb: 'Lists your staff curate for readers to browse.',
  },
  challenge: {
    id: 'challenge',
    label: 'Reading List Challenges',
    single: 'Reading List Challenge',
    blurb: 'Challenges that require titles from a list.',
  },
  discover: {
    id: 'discover',
    label: 'Discover Lists',
    single: 'Discover List',
    blurb: 'Shelves the engine builds on the reader’s Discover page.',
  },
}
export const LIST_KIND_ORDER = ['list', 'challenge', 'discover']

/* The lists a school actually has. Genre-shaped, because that is what both a
   curated list and a Discover shelf are organised by — each one claims the
   genres it collects, and a title lands on it by belonging to one of them.
   Nothing here is random: which lists a title appears on is a property of the
   title, so the same book answers the same way from any view. */
const LIST_SPECS = [
  { kind: 'list', name: 'Staff Picks', genres: null, owner: 'Ms. Rivera', share: 0.12 },
  {
    kind: 'list',
    name: 'Graphic Novels We Love',
    genres: ['Graphic Novels', 'Comics', 'Manga'],
    owner: 'Ms. Rivera',
  },
  {
    kind: 'list',
    name: 'Read-Alikes for Wimpy Kid',
    genres: ['Humor', 'Realistic Fiction', 'Graphic Novels'],
    owner: 'Mr. Okafor',
  },
  {
    kind: 'list',
    name: 'Nonfiction That Reads Like a Story',
    genres: null,
    nonfiction: true,
    owner: 'Ms. Rivera',
  },
  {
    kind: 'list',
    name: 'Newbery Winners',
    genres: ['Realistic Fiction', 'Historical Fiction', 'Fantasy'],
    owner: 'Beanstack',
    external: true,
    share: 0.25,
  },
  {
    kind: 'challenge',
    name: 'Fall Reading Challenge 2026',
    genres: null,
    share: 0.18,
    dates: 'Sep 1 – Nov 30, 2026',
    require: 5,
  },
  {
    kind: 'challenge',
    name: 'Battle of the Books',
    genres: ['Realistic Fiction', 'Historical Fiction', 'Mystery'],
    dates: 'Oct 1, 2026 – Feb 28, 2027',
    require: 8,
  },
  {
    kind: 'challenge',
    name: 'Genre Explorer',
    genres: null,
    share: 0.3,
    dates: 'Sep 8, 2026 – May 22, 2027',
    require: 6,
  },
  { kind: 'discover', name: 'Because you liked mysteries', genres: ['Mystery', 'Thriller'] },
  { kind: 'discover', name: 'Popular in Grade 4', genres: null, share: 0.2 },
  { kind: 'discover', name: 'New in your library', genres: null, share: 0.14 },
  {
    kind: 'discover',
    name: 'Quick reads',
    genres: ['Humor', 'Graphic Novels', 'Early Chapter Books'],
  },
]

/* A title is on a list when the list collects its genre — or, for a list with
   no genres of its own (Staff Picks, Popular in Grade 4), when its own seeded
   draw falls inside that list's share. Seeded on the pair, so the answer never
   moves and every view agrees. */
export const listsFor = (school, title) =>
  LIST_SPECS.filter((spec) => {
    if (spec.nonfiction) return NONFICTION_GENRES.has(title.genre)
    if (spec.genres) return spec.genres.includes(title.genre)
    return rng(`list:${spec.name}:${title.id}`)() < (spec.share ?? 0.15)
  }).map((spec) => ({
    ...spec,
    id: `${spec.kind}-${spec.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    // How big the list is — the app's own `N Books` beside a list's name.
    books: 12 + Math.floor(rng(`listsize:${school.id}:${spec.name}`)() * 40),
  }))
