// ─── The classroom's side of the engine ──────────────────────────────────────
//
// Nothing new is invented here. The readers are the Student Profile's own
// classroom roster — the same thirteen the Engagement Signals prototype uses —
// and the titles are the Collection Engine's catalog for Lincoln Elementary.
// What this module adds is the join: which reader has been suggested what, and
// what came of it.
//
// Keeping both ends borrowed matters. A teacher looking at Marcus here and at
// Marcus on his profile has to be looking at the same reader, and a title
// recommended in this classroom has to be one the school actually switched on.

import { ROSTER, STUDENT_SIGNALS } from '../engagement-signals/data.js'
import { bookDetail } from '../collection-engine/derive.js'
import { TITLES_BY_GENRE as ALL_TITLES } from '../rmi/library.js'
import {
  SCHOOL_BY_ID,
  FACTOR_KEYS,
  SIGNALS,
  factorGenres,
  factorLabel,
} from '../collection-engine/data.js'

const SCHOOL = SCHOOL_BY_ID.lincoln

// ─── Deterministic randomness ────────────────────────────────────────────────
// Same classroom on every load — see collection-engine/data.js for why.

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function rng(seed) {
  let a = hash(seed)
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = (r, list) => list[Math.floor(r() * list.length)]

// ─── What each reader was suggested, and what came of it ─────────────────────

/**
 * One reader's year with the engine. `state` is per title, because that is the
 * thing a teacher acts on: a title sitting saved-and-unread for weeks is a
 * different conversation from one that was suggested and never picked up.
 */
/* Titles the wider pool has that Lincoln's switched-on catalogs do not — what
   a reader can wish for and the school cannot hand them. */
const OFF_CATALOG = (() => {
  const have = new Set(SCHOOL.catalog.map((t) => t.id))
  // The pool is keyed by genre, and the records inside it don't repeat the key
  // — so the genre has to come off the key or every off-catalog title reads as
  // "Other", which looks like missing data rather than a book the school lacks.
  return Object.entries(ALL_TITLES).flatMap(([genre, titles]) =>
    titles.filter((t) => !have.has(t.id)).map((t) => ({ ...t, genre })),
  )
})()

const SIGNAL_REACH = { increasing: 1, consistent: 0.9, pending: 0.42, declining: 0.3 }

/* How often each signal is the one that produced a suggestion. Not a guess at
   an algorithm — a stand-in for the mix, so the admin screens can show which
   signals are actually doing the work. Wish list is rare and nearly always
   converts; RMI is the broad one that fills the rest of the list. */
const SIGNAL_MIX = {
  rmi: 0.3,
  history: 0.22,
  peers: 0.16,
  lexile: 0.12,
  ratings: 0.1,
  patterns: 0.06,
  wishlist: 0.04,
}

/* How much likelier a reader is to save a suggestion, by what drove it. A book
   they wish-listed themselves is not really a recommendation — it is news that
   the book is now gettable — so it converts far above everything else. */
const SIGNAL_LIFT = {
  wishlist: 3.2,
  history: 1.5,
  ratings: 1.3,
  peers: 1.15,
  rmi: 1,
  lexile: 0.85,
  patterns: 0.8,
}

function drawSignal(r) {
  const roll = r()
  let acc = 0
  for (const [id, share] of Object.entries(SIGNAL_MIX)) {
    acc += share
    if (roll < acc) return id
  }
  return 'rmi'
}

const capital = (w) => w.charAt(0).toUpperCase() + w.slice(1)

/** The sentence a teacher reads under a title. Names the one signal that made it. */
export function reasonFor(entry, reader) {
  const first = reader.name.split(' ')[0]
  if (entry.via === 'wishlist') {
    return entry.inCatalog
      ? `${first} added this to their own shelf, and it is in a catalog you have`
      : `${first} added this to their own shelf. None of your switched-on catalogs carry it`
  }
  const t = entry.title
  switch (entry.signal) {
    case 'history':
      return `${first} finishes books like this — same shelf, same kind of story`
    case 'rmi':
      return `${capital(reader.factor)} is ${first}'s top motivation factor, and ${t.genre} is one of the three genres the RMI names for it`
    case 'ratings':
      return `Close to the books ${first} rates highest — ${reader.avgRating} average over ${reader.rated} ratings`
    case 'peers':
      return `Going round ${first}'s grade right now`
    case 'lexile':
      return `Sits at ${first}'s reading level — ${reader.lexile}L, within reach`
    case 'patterns':
      return `The right size for how ${first} reads — about ${reader.sessionMins} minutes a sitting`
    default:
      return 'Suggested by the engine'
  }
}

/**
 * One reader's year with the engine.
 *
 * The shelf is one list, not two. A title a reader wish-listed and a title they
 * saved off a suggestion are the same object in the same place — the only
 * difference is how it got there, which the row says. Keeping a separate "wish
 * list" beside a "saved" list was modelling the same feature twice.
 *
 * A suggestion that never reached the shelf isn't on it, which is the whole
 * point: `passed` is what the engine offered and the reader declined.
 */
/* The keys the Student Profile prototype has actually built out. */
const PROFILE_KEYS = ['marcus', 'anne', 'tyler']
const standInProfile = (key) => pick(rng(`profile:${key}`), PROFILE_KEYS)

/* The top motivation factor the Student Profile's own fixtures give the two
   readers it has one for (its Overview's "Top motivation factor"), so the
   reason a genre is recommended agrees with the profile it is shown in. The
   rest keep a seeded draw. */
const PROFILE_FACTOR = { marcus: 'enjoyment', anne: 'recognition' }

function buildReader(row) {
  const r = rng(`teacher:${row.key}`)
  // Drawn either way, so the stream after it is the same for every reader.
  const drawn = pick(r, FACTOR_KEYS)
  const factor = PROFILE_FACTOR[row.key] ?? drawn
  const genres = new Set(factorGenres(factor))
  const fit = SCHOOL.catalog.filter((t) => genres.has(t.genre))
  const pool = fit.length ? fit : SCHOOL.catalog

  // A reader who logs more gets suggested to more often — the engine's main
  // surface is the moment right after a log.
  const appetite = 0.3 + (row.days30 ?? 12) / 30
  // And a reader whose logging is falling away is harder to *reach*, for the
  // same reason: those moments are getting rarer, and the suggestions that do
  // land arrive when they are least in the habit. So the engagement signal the
  // classroom already tracks feeds this rather than a coin flip of its own —
  // the two readings of a reader should agree.
  const reach = SIGNAL_REACH[row.signal] ?? 0.9

  const seen = new Set()
  const shelf = []
  const passed = []

  // What the engine put in front of them, and what came of it.
  const n = Math.round(6 + appetite * 9)
  for (let i = 0; i < n; i++) {
    const t = pick(r, pool)
    if (seen.has(t.id)) continue
    seen.add(t.id)
    const signal = drawSignal(r)
    if (r() < 0.46 * reach * SIGNAL_LIFT[signal]) {
      const roll = r()
      shelf.push({
        title: t,
        via: 'engine',
        signal,
        state: roll < 0.34 ? 'finished' : roll < 0.55 ? 'reading' : 'want',
        addedDays: 2 + Math.floor(r() * 40),
        inCatalog: true,
      })
    } else {
      passed.push({ title: t, signal })
    }
  }

  // And what they put there themselves. Some of it the school can get them and
  // some of it it can't — the second group is the useful one: demand stated
  // outright, by name, that the collection cannot answer.
  const wishN = 2 + Math.floor(r() * 4)
  for (let i = 0; i < wishN; i++) {
    const inCatalog = r() < 0.6
    const t = pick(r, inCatalog ? SCHOOL.catalog : OFF_CATALOG)
    if (!t || seen.has(t.id)) continue
    seen.add(t.id)
    shelf.push({
      title: t,
      via: 'wishlist',
      // A book the school can't get them is one they can't start, which is the
      // point of showing it.
      state: inCatalog && r() < 0.3 ? 'reading' : 'want',
      addedDays: 3 + Math.floor(r() * 90),
      inCatalog,
    })
  }

  // What the fit signals have to work with for this reader. Drawn off the
  // roster's own logging numbers so the engine's reading of them agrees with
  // the rest of the profile.
  const lexile = 420 + Math.floor(r() * 500)
  const mins30 = row.mins30 ?? 400
  const days = Math.max(1, row.days30 ?? 12)
  const sessionMins = Math.max(6, Math.round(mins30 / days))
  const rated = Math.floor(r() * 7)

  return {
    ...row,
    lexile,
    sessionMins,
    rated,
    avgRating: rated ? Math.round((3.4 + r() * 1.5) * 10) / 10 : null,
    factor,
    factorLabel: factorLabel(factor),
    genres: [...genres],
    shelf,
    passed,
    // Three of the thirteen have a profile genuinely their own; the other ten
    // are assigned one of those three so every name in the class stays a link.
    // Seeded off the reader's key, so a child always opens the same profile.
    profileKey: STUDENT_SIGNALS[row.key] ? row.key : standInProfile(row.key),
  }
}

export const READERS = ROSTER.map(buildReader)
export const READER_BY_KEY = Object.fromEntries(READERS.map((x) => [x.key, x]))

// ─── Readings of that ────────────────────────────────────────────────────────

export const SHELF_STATES = {
  want: { id: 'want', label: 'Want to read' },
  reading: { id: 'reading', label: 'Reading now' },
  finished: { id: 'finished', label: 'Finished' },
}

export const counts = (reader) => ({
  suggested: reader.shelf.filter((t) => t.via === 'engine').length + reader.passed.length,
  shelved: reader.shelf.length,
  finished: reader.shelf.filter((t) => t.state === 'finished').length,
  // What they asked for and the school can't hand over — the number a teacher
  // can do something about today.
  ungettable: reader.shelf.filter((t) => !t.inCatalog).length,
})

/**
 * What to do about a reader, or nothing. The two cases are different problems
 * with different answers, which is why they aren't one "needs attention" flag:
 * nothing saved means the suggestions are wrong for them, saved-and-stalled
 * means they found something and couldn't get hold of it.
 */
export function attention(reader) {
  const c = counts(reader)
  const fromEngine = reader.shelf.filter((t) => t.via === 'engine')
  if (c.suggested >= 8 && fromEngine.length === 0) return 'nothing-landed'
  // A shelf they can't read off is the sharpest case: they asked for books the
  // school has no way to hand them.
  if (c.ungettable >= 2) return 'cant-get'
  // Shelved things and finished none of them is the same problem as two sitting
  // for a month — they wanted the book and never got hold of it.
  if (c.shelved >= 2 && c.finished === 0) return 'stalled'
  const waiting = reader.shelf.filter((t) => t.state === 'want' && t.addedDays > 21)
  if (waiting.length >= 3) return 'stalled'
  return null
}

export const ATTENTION = {
  'nothing-landed': {
    label: 'Nothing has landed',
    hint: 'Suggestions are missing — worth asking what they actually like.',
    color: '#DC2626',
  },
  'cant-get': {
    label: 'Asked for what you lack',
    hint: 'Books on their Wish List that none of your catalogs can supply.',
    color: '#B43DD0',
  },
  stalled: {
    label: 'Shelved, not read',
    hint: 'They found books they wanted and never got hold of one.',
    color: '#D97706',
  },
}

/** The class, worst first — the reason to open the tab sorts to the top. */
export function classRows() {
  const rank = { 'nothing-landed': 0, 'cant-get': 1, stalled: 2 }
  return [...READERS]
    .map((reader) => ({ reader, ...counts(reader), attention: attention(reader) }))
    .sort(
      (a, b) =>
        (rank[a.attention] ?? 3) - (rank[b.attention] ?? 3) ||
        a.finished - b.finished ||
        a.reader.name.localeCompare(b.reader.name),
    )
}

/**
 * Which signals are actually doing the work, and how well each converts.
 * The admin question behind the Setup panel: a signal that produces a lot of
 * suggestions nobody saves is one to turn down.
 */
export function signalCounts() {
  const by = {}
  for (const reader of READERS) {
    for (const e of reader.shelf.filter((t) => t.via === 'engine')) {
      const row = (by[e.signal] ??= { id: e.signal, suggested: 0, shelved: 0, finished: 0 })
      row.suggested++
      row.shelved++
      if (e.state === 'finished') row.finished++
    }
    for (const e of reader.passed) {
      const row = (by[e.signal] ??= { id: e.signal, suggested: 0, shelved: 0, finished: 0 })
      row.suggested++
    }
  }
  return Object.values(by)
    .map((r) => ({
      ...r,
      shelvedPct: r.suggested ? Math.round((r.shelved / r.suggested) * 100) : 0,
    }))
    .sort((a, b) => b.suggested - a.suggested)
}

/**
 * The book panel, opened from a classroom.
 *
 * Same shape as the school's `bookDetail`, so the panel doesn't care which it
 * was handed — and mostly the same *content*, because a book's rating, reviews
 * and book talks are facts about the book at this school, not about one class.
 * What the classroom changes is whose children lead the reader list.
 */
export function classBookDetail(titleId) {
  const title = SCHOOL.catalog.find((t) => t.id === titleId)
  if (!title) return null

  /* The book's whole picture is the school's, because that is what it is: a
     class of thirteen is not a separate library, and a panel scoped to it
     opened on nothing — no readers, no talks, no reviews, no rating — for
     almost every title, which read as the product having no data rather than
     as the class being small. Ratings, reviews, book talks and similar titles
     are all school-wide facts about the book.

     What the classroom adds is *whose* children these are: the roster's own
     readers go in first, carrying the keys that open their profiles. The three
     of them who are also in the school's reader list (the profiled three) are
     deduplicated by name, so nobody appears twice. */
  const wide = bookDetail(SCHOOL, titleId)

  const mine = []
  for (const reader of READERS) {
    const onShelf = reader.shelf.find((e) => e.title.id === titleId)
    const passedIt = reader.passed.find((e) => e.title.id === titleId)
    if (!onShelf && !passedIt) continue
    mine.push({
      reader,
      signal: onShelf?.signal ?? passedIt?.signal,
      via: onShelf?.via,
      // A title the reader wish listed themselves wasn't the engine's doing —
      // the same distinction the school panel's fourth filter draws.
      viaEngine: onShelf?.via !== 'wishlist',
      outcome: onShelf ? (onShelf.state === 'finished' ? 'read' : 'saved') : 'shown',
      times: 1,
      // One classroom, so a grade says nothing. What a teacher wants beside a
      // name here is how the book got there and how long it has sat.
      note: onShelf
        ? `${onShelf.via === 'wishlist' ? 'They asked for it' : 'Suggested to them'} \u00b7 ${onShelf.addedDays} days ago`
        : 'Suggested to them',
    })
  }

  const ORDER = { read: 0, saved: 1, shown: 2 }
  mine.sort(
    (a, b) => ORDER[a.outcome] - ORDER[b.outcome] || a.reader.name.localeCompare(b.reader.name),
  )

  const inClass = new Set(mine.map((x) => x.reader.name))
  const recommended = [...mine, ...wide.recommended.filter((x) => !inClass.has(x.reader.name))]

  return {
    ...wide,
    recommended,
    stats: {
      suggested: recommended.filter((x) => x.viaEngine).length,
      saved: recommended.filter((x) => x.outcome === 'saved').length,
      read: recommended.filter((x) => x.outcome === 'read').length,
    },
  }
}

const CLASS_REVIEWS = [
  'I read this twice. The ending got me both times.',
  'Way better than I thought from the cover.',
  'Kind of slow at the start but then I could not stop.',
  'The best one I have read this year, honestly.',
  'Funny in a way that made me read bits out loud.',
]

export const PICK_REASONS = {
  asked: {
    id: 'asked',
    label: 'A reader here wants it',
    color: '#DC2626',
    blurb: 'Someone in this class wish listed it and the school already has a copy.',
  },
  popular: {
    id: 'popular',
    label: 'Going round the class',
    color: '#E8553A',
    blurb: 'Enough of the room is reading it that a copy of your own would stop the queue.',
  },
  fit: {
    id: 'fit',
    label: 'Fits this class',
    color: '#B43DD0',
    blurb: 'Matches what a good number of these readers read for, and nobody here has it yet.',
  },
}

/**
 * What this classroom should have on its own shelf.
 *
 * Not a report on what the engine did — a list to act on. A teacher plans in
 * books: what to pull for Monday, what to scan into the Classroom Library
 * Connector, what to put on an order. So the ranking is by how much a copy in
 * *this room* would change, and every row says why it is there.
 */
export function classroomPicks(caps = { asked: 6, popular: 4, fit: 4 }) {
  const onShelves = new Map()
  for (const reader of READERS) {
    for (const e of reader.shelf) {
      const row = onShelves.get(e.title.id) ?? { title: e.title, inCatalog: e.inCatalog, n: 0 }
      row.n++
      onShelves.set(e.title.id, row)
    }
  }

  const picks = []

  // Everything on this list is a title the school can actually reach. The
  // engine never suggests from outside a switched-on catalog, so a row saying
  // "you would need to order it" could only ever be noise here — what a reader
  // wants and the school doesn't hold is demand, and it belongs on their
  // profile and in the district's buying view, not in a list of what to put on
  // the classroom shelf this week.

  // 1. Asked for by name, and the school has it — it just isn't in this room.
  for (const row of onShelves.values()) {
    if (row.inCatalog) {
      picks.push({ title: row.title, reason: 'asked', readers: row.n, inCatalog: true })
    }
  }

  // 2. Going round the room. The school may well own one copy; the point is
  //    that this class is queueing for it.
  const askedIds = new Set(picks.map((p) => p.title.id))
  for (const row of onShelves.values()) {
    if (row.inCatalog && row.n >= 3 && !askedIds.has(row.title.id)) {
      picks.push({ title: row.title, reason: 'popular', readers: row.n, inCatalog: true })
    }
  }

  // 3. Fits the room and nobody here has it. The class's motivation mix says
  //    these would land — this is the part a teacher could not work out alone.
  const wantBy = {}
  for (const reader of READERS) for (const g of reader.genres) wantBy[g] = (wantBy[g] ?? 0) + 1
  const held = new Set(onShelves.keys())
  const fits = SCHOOL.catalog
    .filter((t) => !held.has(t.id) && wantBy[t.genre])
    .map((t) => ({ title: t, reason: 'fit', readers: wantBy[t.genre], inCatalog: true }))
    .sort((a, b) => b.readers - a.readers)

  // Capped per reason rather than taken off one ranked list. Most wish-listed
  // titles the school lacks are wanted by a single reader, so a straight sort
  // filled the whole page with them and the other two reasons never appeared —
  // and a teacher who can't see "going round the class" has lost the easiest
  // win on the list.
  const rank = { asked: 0, popular: 1, fit: 2 }
  const all = [...picks, ...fits]
  return Object.keys(rank)
    .flatMap((reason) =>
      all
        .filter((p) => p.reason === reason)
        .sort((a, b) => b.readers - a.readers)
        .slice(0, caps[reason] ?? 4),
    )
    .sort((a, b) => rank[a.reason] - rank[b.reason] || b.readers - a.readers)
}

/** Class totals, summed from the readers rather than stated. */
export function classTotals() {
  const rows = classRows()
  return {
    readers: rows.length,
    suggested: rows.reduce((n, r) => n + r.suggested, 0),
    shelved: rows.reduce((n, r) => n + r.shelved, 0),
    finished: rows.reduce((n, r) => n + r.finished, 0),
    ungettable: rows.reduce((n, r) => n + r.ungettable, 0),
    needing: rows.filter((r) => r.attention).length,
  }
}

export { SCHOOL }

// ─── The genres to point a reader at ─────────────────────────────────────────

/* The reasons a genre can be on a reader's list — each one of the engine's own
   signals, so a reason reads the same here as on a recommended title. Listed
   strongest first: what a reader has actually finished, then what their
   motivation profile points at, then what they have saved, then what their
   classmates are reading. A genre shows the first that applies. */
export const GENRE_REASON_ORDER = ['history', 'rmi', 'wishlist', 'peers']
const REASON_WEIGHT = { history: 4, rmi: 3, wishlist: 2, peers: 1 }

/**
 * The genres we would point this reader at, and the one reason for each —
 * strongest case first.
 *
 * Every applicable reason still counts toward where a genre ranks, so a genre
 * that fits the reader three ways sorts above one that fits them once; the row
 * just names the best of them.
 */
export function recommendedGenres(reader, limit = 6) {
  const first = reader.name.split(' ')[0]
  const classmates = READERS.filter((x) => x.key !== reader.key)
  const names = new Set([
    ...reader.genres,
    ...reader.shelf.map((e) => e.title.genre).filter(Boolean),
    ...classmates.flatMap((x) => x.shelf.map((e) => e.title.genre)).filter(Boolean),
  ])
  const rows = []
  for (const genre of names) {
    const mine = reader.shelf.filter((e) => e.title.genre === genre)
    const finished = mine.filter((e) => e.state === 'finished').length
    const wanted = mine.length - finished
    const peers = classmates.filter((x) => x.shelf.some((e) => e.title.genre === genre)).length
    const found = {}
    if (finished) {
      found.history = `${first} has finished ${finished} ${finished === 1 ? 'book' : 'books'} like this`
    }
    if (wanted) {
      found.wishlist = `${wanted} ${wanted === 1 ? 'book' : 'books'} like this on ${first}'s Wish List`
    }
    if (reader.genres.includes(genre)) {
      found.rmi = `${capital(reader.factor)} is ${first}'s top motivation factor, and the RMI names this genre for it`
    }
    if (peers >= 3) found.peers = `${peers} classmates have a book like this on their shelf`
    const id = GENRE_REASON_ORDER.find((k) => found[k])
    if (!id) continue
    rows.push({
      genre,
      label: genre.replace(/\s*\([^)]*\)/g, '').trim(),
      reason: { id, detail: found[id] },
      score: Object.keys(found).reduce((n, k) => n + REASON_WEIGHT[k], 0) + finished,
    })
  }
  return rows.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label)).slice(0, limit)
}
