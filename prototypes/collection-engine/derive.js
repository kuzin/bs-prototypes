// ─── Every number on every screen ────────────────────────────────────────────
// Nothing here states a figure. Each function is a reduce over the three
// fixtures in data.js, so a tile can always be traced back to the rows under
// it — which is the difference between a prototype that survives being
// questioned in a meeting and one that doesn't.

import {
  BENNY_QUERIES,
  MONTHS,
  SCHOOLS,
  SOURCES,
  SURFACES,
  FACTOR_KEYS,
  factorGenres,
  factorLabel,
  listsFor,
} from './data.js'

const pct = (n, d) => (d ? Math.round((n / d) * 1000) / 10 : 0)

// ─── The funnel ──────────────────────────────────────────────────────────────
// Stage one is *suggested*, not impressions: a card the engine deliberately put
// in front of a reader, not every cover that scrolled past. Impressions would
// make the rate look worse and mean less. The naming matters — this is the
// number a district is being asked to read as "utilization", and it isn't one,
// so it says what it is.

export function funnel(events) {
  const suggested = events.length
  const saved = events.filter((e) => e.saved).length
  const logged = events.filter((e) => e.logged).length
  return {
    suggested,
    saved,
    logged,
    savedPct: pct(saved, suggested),
    loggedPct: pct(logged, suggested),
    savedToLoggedPct: pct(logged, saved),
    steps: [
      { stage: 'Suggested', count: suggested, pct: 100 },
      { stage: 'Wish listed', count: saved, pct: pct(saved, suggested) },
      { stage: 'Logged as read', count: logged, pct: pct(logged, suggested) },
    ],
  }
}

/** The same three stages, cut by where the suggestion was made. */
export function funnelBySurface(events) {
  return Object.values(SURFACES)
    .map((s) => {
      const rows = events.filter((e) => e.surface === s.id)
      const f = funnel(rows)
      return { ...s, ...f }
    })
    .sort((a, b) => b.suggested - a.suggested)
}

/** Does matching a reader's motivation profile actually help? */
export function profileLift(events) {
  const on = funnel(events.filter((e) => e.onProfile))
  const off = funnel(events.filter((e) => !e.onProfile))
  return { on, off, delta: Math.round((on.savedPct - off.savedPct) * 10) / 10 }
}

/**
 * The year month by month. What a librarian looks for here is not the volume —
 * that follows the school calendar — but whether the gap between the three
 * lines is closing. A catalog going stale shows up as the read line drifting
 * away from the saved line while both keep their shape.
 */
export function monthly(events) {
  const by = new Map(MONTHS.map((m) => [m, { month: m, suggested: 0, saved: 0, logged: 0 }]))
  for (const e of events) {
    const row = by.get(e.month)
    if (!row) continue
    row.suggested++
    if (e.saved) row.saved++
    if (e.logged) row.logged++
  }
  return MONTHS.map((m) => {
    const row = by.get(m)
    return { ...row, rate: pct(row.logged, row.suggested) }
  })
}

// ─── Per-title activity ──────────────────────────────────────────────────────

export function titleStats(school) {
  const stats = new Map()
  for (const t of school.catalog) {
    stats.set(t.id, { title: t, suggested: 0, saved: 0, logged: 0 })
  }
  for (const e of school.events) {
    const s = stats.get(e.titleId)
    if (!s) continue
    s.suggested++
    if (e.saved) s.saved++
    if (e.logged) s.logged++
  }
  return stats
}

/** What the engine pushed hardest — the head of its own distribution. */
export function mostSuggested(school, n = 10) {
  return [...titleStats(school).values()]
    .filter((s) => s.suggested)
    .sort((a, b) => b.suggested - a.suggested || b.saved - a.saved)
    .slice(0, n)
}

/**
 * Pushed hard, and nobody bit. The engine's own failures: titles it keeps
 * putting in front of readers that they keep leaving alone.
 *
 * Ranked by conversion rather than by raw misses, so a title shown 40 times and
 * saved twice beats one shown 12 times and saved once — and floored at a
 * showing count, because a title suggested three times and skipped three times
 * is noise, not a pattern. This is the one list on the page that is about the
 * recommender being wrong rather than about the collection.
 */
export function pushedNotTaken(school, n = 10) {
  const floor = 8
  return [...titleStats(school).values()]
    .filter((s) => s.suggested >= floor)
    .map((s) => ({ ...s, rate: s.saved / s.suggested }))
    .sort((a, b) => a.rate - b.rate || b.suggested - a.suggested)
    .slice(0, n)
}

/** Titles readers actually found — owned stock that got moving. */
export function discovered(school) {
  return [...titleStats(school).values()]
    .filter((s) => s.saved > 0)
    .sort((a, b) => b.logged - a.logged || b.saved - a.saved)
}

/**
 * The dead shelf: titles the school owns, the engine can see, and nobody has
 * saved all year. Not a failure list — it's the reading-promotion worklist, and
 * it's the one view a librarian can't get anywhere else.
 */
export function deadShelf(school) {
  return [...titleStats(school).values()]
    .filter((s) => s.saved === 0)
    .sort(
      (a, b) =>
        a.suggested - b.suggested ||
        a.title.addedYear - b.title.addedYear ||
        a.title.title.localeCompare(b.title.title),
    )
}

/**
 * What readers at one school asked Benny for. The queries themselves are the
 * same everywhere — children want the same things — but a school of 139 asks
 * fewer times than one of 248, and a thinner set of switched-on catalogs
 * answers fewer of them. Showing one identical table at every school would be
 * the tell that none of it is real.
 */
export function bennyQueries(school) {
  const readerScale = school.readers.length / 200
  // How much of the 414-title pool this school's switched-on catalogs cover,
  // which is what decides how many of any query it can answer.
  const reachScale = school.catalog.length / 300
  return BENNY_QUERIES.map((q) => ({
    ...q,
    asks: Math.max(3, Math.round(q.asks * readerScale)),
    hits: Math.round(q.hits * reachScale),
  }))
}

/** The same demand across every school, summed. */
export function districtBennyQueries() {
  const rows = SCHOOLS.map(bennyQueries)
  return BENNY_QUERIES.map((q, i) => ({
    ...q,
    asks: rows.reduce((n, r) => n + r[i].asks, 0),
    // District-wide, a title counts once however many schools hold it — what
    // a district buys against is the distinct catalogue, not the sum of six.
    hits: Math.max(...rows.map((r) => r[i].hits)),
  }))
}

/**
 * Titles the engine has never put in front of anyone. A subset of the dead
 * shelf, and the sharper half of it: a book that was suggested and ignored is a
 * taste problem, one that was never suggested is the engine's own blind spot.
 */
export function neverSuggested(school) {
  return [...titleStats(school).values()].filter((s) => s.suggested === 0).length
}

// ─── Supply vs demand ────────────────────────────────────────────────────────

/**
 * The gap analysis, per motivation factor. Demand is how many readers score
 * that factor highest; supply is how many titles sit in the three
 * genres the RMI toolkit names for it. `perReader` is the ratio that actually
 * tells a buyer something — 0.4 titles per reader who wants them is a hole.
 */
export function gaps(school) {
  const stats = titleStats(school)
  const rows = FACTOR_KEYS.map((key) => {
    const genres = new Set(factorGenres(key))
    const supply = school.catalog.filter((t) => genres.has(t.genre))
    const demand = school.readers.filter((r) => r.factor === key).length
    const logged = supply.reduce((n, t) => n + (stats.get(t.id)?.logged ?? 0), 0)
    return {
      key,
      label: factorLabel(key),
      genres: [...genres],
      demand,
      supply: supply.length,
      logged,
      perReader: demand ? Math.round((supply.length / demand) * 100) / 100 : 0,
    }
  })
  // "Short" is the three thinnest shelves relative to what readers here read
  // for — not a national benchmark and not an absolute floor. A small library
  // shouldn't read as one long gap, and a large one still has a thinnest
  // three worth knowing about. It always answers "what next", which is the
  // only question this screen is for.
  const ranked = [...rows].sort((a, b) => a.perReader - b.perReader)
  const shortSet = new Set(ranked.slice(0, 3).map((r) => r.key))
  return ranked.map((r) => ({ ...r, short: shortSet.has(r.key) }))
}

/** How the collection breaks down by where a title comes from. */
export function bySource(school) {
  return Object.values(SOURCES).map((src) => {
    const titles = school.catalog.filter((t) => t.holdings.some((h) => h.source === src.id))
    const copies = titles.reduce(
      (n, t) =>
        n + t.holdings.filter((h) => h.source === src.id).reduce((m, h) => m + (h.copies ?? 0), 0),
      0,
    )
    return { ...src, titles: titles.length, copies }
  })
}

// ─── Readers ─────────────────────────────────────────────────────────────────

/**
 * The short list that makes this a time-saver rather than a dashboard: readers
 * the engine has suggested to and got nothing back from. `reason` is what a
 * librarian would actually do about it, which is not the same for the two cases
 * — nothing saved means the suggestions are wrong, saved but never logged means
 * they couldn't get hold of the book.
 */
export function readersToNudge(school, limit = 8) {
  // Which motivation types this school's switched-on catalogs are thinnest on.
  // A reader nothing has landed for, whose type is one of them, isn't a
  // mystery — there is little in the catalogs for them, which is a different
  // conversation from "we don't know what they like".
  const thin = new Set(
    gaps(school)
      .filter((g) => g.short)
      .map((g) => g.key),
  )
  const byReader = new Map()
  for (const r of school.readers)
    byReader.set(r.id, { reader: r, suggested: 0, saved: 0, logged: 0 })
  for (const e of school.events) {
    const row = byReader.get(e.readerId)
    if (!row) continue
    row.suggested++
    if (e.saved) row.saved++
    if (e.logged) row.logged++
  }
  return [...byReader.values()]
    .filter((row) => row.suggested >= 8 && row.logged === 0)
    .map((row) => ({
      ...row,
      reason: row.saved === 0 ? 'nothing-landed' : 'saved-never-read',
      thinShelf: thin.has(row.reader.factor),
    }))
    .sort((a, b) => b.suggested - a.suggested)
    .slice(0, limit)
}

export const NUDGE_REASON = {
  'nothing-landed': {
    label: 'Nothing has landed',
    hint: 'Suggestions are missing — worth a conversation about what they like.',
    color: '#DC2626',
  },
  'saved-never-read': {
    label: 'Saved, never read',
    hint: 'They found books they wanted and never got hold of one.',
    color: '#D97706',
  },
}

// ─── Catalog freshness ───────────────────────────────────────────────────────

export const FEED_STATE = {
  ok: { label: 'Syncing', color: '#0BA85F' },
  stale: { label: 'Out of date', color: '#D97706' },
  pending: { label: 'Not connected', color: '#656565' },
  off: { label: 'Never synced', color: '#DC2626' },
}

/**
 * The "as of" every recommendation is stamped with. It reports the *library
 * catalog* specifically rather than the freshest feed of any kind: Comics Plus
 * is live every day of the year, and letting that stand in for a MARC drop
 * that never arrived would make the worst-provisioned school in the district
 * look current. The other feeds have their own rows on Setup.
 */
export function freshness(school) {
  const primary = school.feeds.find((f) => f.source === 'destiny')
  return {
    asOf: primary?.asOf ?? null,
    staleDays: primary?.asOf ? primary.staleDays : null,
    connected: school.feeds.filter((f) => f.asOf).length,
    total: school.feeds.length,
    problems: school.feeds.filter((f) => f.state !== 'ok').length,
  }
}

// ─── District ────────────────────────────────────────────────────────────────

export const ALL_EVENTS = SCHOOLS.flatMap((s) => s.events)

/** One row per school, with everything the district view compares them on. */
export function schoolRows() {
  return SCHOOLS.map((school) => {
    const f = funnel(school.events)
    const fresh = freshness(school)
    return {
      school,
      id: school.id,
      name: school.name,
      readers: school.readers.length,
      titles: school.catalog.length,
      funnel: f,
      fresh,
      // Titles the school already owned that got read off a suggestion —
      // the closest honest thing we have to a return on the existing shelf.
      activated: discovered(school).filter((s) => s.logged > 0).length,
    }
  }).sort((a, b) => b.funnel.loggedPct - a.funnel.loggedPct)
}

/**
 * The district gap analysis, and it is deliberately not the district average.
 * Averaging six collections flattens every gap to nothing — each school is
 * short of something different, and the mean is short of none of it. A
 * district doesn't buy one collection either; it buys for six buildings. So
 * what it reports is how many of them are short of each motivation type, which
 * is the shape a purchasing decision actually has.
 */
export function districtGaps() {
  const perSchool = SCHOOLS.map((s) => ({ school: s, rows: gaps(s) }))
  const rows = FACTOR_KEYS.map((key) => {
    const genres = new Set(factorGenres(key))
    let demand = 0
    let supply = 0
    let logged = 0
    const shortAt = []
    for (const { school, rows: sr } of perSchool) {
      demand += school.readers.filter((r) => r.factor === key).length
      const fit = school.catalog.filter((t) => genres.has(t.genre))
      supply += fit.length
      const stats = titleStats(school)
      logged += fit.reduce((n, t) => n + (stats.get(t.id)?.logged ?? 0), 0)
      if (sr.find((g) => g.key === key)?.short) shortAt.push(school.name)
    }
    return {
      key,
      label: factorLabel(key),
      genres: [...genres],
      demand,
      supply,
      logged,
      perReader: demand ? Math.round((supply / demand) * 100) / 100 : 0,
      shortAt,
      // Short somewhere is noise; short in a third of your buildings is a
      // purchase.
      short: shortAt.length >= 2,
    }
  })
  return rows.sort((a, b) => b.shortAt.length - a.shortAt.length || a.perReader - b.perReader)
}

/** District totals, summed from the schools rather than stated. */
export function districtTotals() {
  const rows = schoolRows()
  return {
    schools: rows.length,
    readers: rows.reduce((n, r) => n + r.readers, 0),
    catalog: rows.reduce((n, r) => n + r.titles, 0),
    activated: rows.reduce((n, r) => n + r.activated, 0),
    connected: rows.filter((r) => r.fresh.problems === 0).length,
    funnel: funnel(ALL_EVENTS),
  }
}

// ─── One book, everything the school knows about it ──────────────────────────

/** Same deterministic seed as the fixtures — see data.js. */
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

const REVIEW_LINES = [
  'I read this twice. The ending got me both times.',
  'Way better than I thought it would be from the cover.',
  'My friend said to read it and she was right.',
  'Kind of slow at the start but then I could not stop.',
  'The best one I have read this year, honestly.',
  'I liked it but the middle part dragged a bit.',
  'Funny in a way that made me read bits out loud.',
  'I did a book talk about this one because I had a lot to say.',
]

/**
 * Everything the school holds about one title, gathered in one place.
 *
 * All of it derives from the same three fixtures the rest of the product does —
 * who was suggested it, who logged it, where the school keeps it. The reader's
 * own book page shows a book to someone deciding whether to read it; this shows
 * the same book to someone deciding whether the collection is working.
 */
/* One seeded coin per (reader, title): did they talk about it? Both the book
   panel's list and a reader's own list of talks read this, so neither can say
   a talk happened that the other doesn't know about. */
const hadTalk = (readerId, titleId) => rng(`hadtalk:${readerId}:${titleId}`)() < 0.35

const talkOf = (s, title) => {
  const tr = rng(`talkmeta:${s.reader.id}:${title.id}`)
  return {
    reader: s.reader,
    title,
    month: s.month,
    kindId: tr() < 0.5 ? 'engagement' : tr() < 0.82 ? 'comprehension' : 'integrity',
    flagged: tr() < 0.12,
  }
}

/**
 * Every book talk one reader has had this year, across the whole catalog — the
 * rail beside a talk, so you can step between that reader's conversations the
 * way the review queue does.
 */
export function readerTalks(school, readerId) {
  const byTitle = new Map(school.catalog.map((t) => [t.id, t]))
  const seen = new Set()
  const out = []
  for (const e of school.events) {
    if (e.readerId !== readerId || !e.logged) continue
    if (seen.has(e.titleId) || !hadTalk(readerId, e.titleId)) continue
    seen.add(e.titleId)
    const title = byTitle.get(e.titleId)
    const reader = school.readers.find((x) => x.id === readerId)
    if (title && reader) out.push(talkOf({ reader, month: e.month }, title))
  }
  return out
}

export function bookDetail(school, titleId) {
  const title = school.catalog.find((t) => t.id === titleId)
  if (!title) return null
  const r = rng(`book:${school.id}:${titleId}`)
  const readerById = new Map(school.readers.map((x) => [x.id, x]))
  const events = school.events.filter((e) => e.titleId === titleId)

  // Who the engine put it in front of, and what came of it — one row per
  // reader, not per event. The same title can be suggested to someone more than
  // once across a year (a different surface, a different signal), and a list
  // that repeated them read as a data bug rather than as persistence.
  const byReader = new Map()
  for (const e of events) {
    const reader = readerById.get(e.readerId)
    if (!reader) continue
    const outcome = e.logged ? 'read' : e.saved ? 'saved' : 'shown'
    const row = byReader.get(e.readerId) ?? {
      reader,
      outcome,
      signal: e.signal,
      month: e.month,
      times: 0,
    }
    row.times++
    // Keep the furthest they got, and the signal that got them there.
    if (ORDER[outcome] < ORDER[row.outcome]) {
      row.outcome = outcome
      row.signal = e.signal
      row.month = e.month
    }
    row.viaEngine = true
    byReader.set(e.readerId, row)
  }

  /* Not everything a reader picks up was put there by the engine. A seeded few
     find each title themselves — on the shelf, in a friend's hands, in the
     catalog — and they belong on this list, because the engine's job is to add
     to that number rather than to take credit for it. Without them the panel
     read as though nobody touches a book unless they are told to. */
  const organic = []
  for (const reader of school.readers) {
    if (byReader.has(reader.id)) continue
    const rr = rng(`organic:${reader.id}:${titleId}`)
    if (rr() > 0.035) continue
    organic.push({
      reader,
      viaEngine: false,
      outcome: rr() < 0.45 ? 'read' : 'saved',
      month: MONTHS[Math.floor(rr() * MONTHS.length)],
      times: 0,
      note: `Grade ${reader.grade}`,
    })
  }

  // The line under a name. The host writes it, because what identifies a reader
  // depends on who is looking: a school of 214 needs the grade, a classroom of
  // thirteen already knows it.
  for (const row of byReader.values()) {
    row.note =
      `Grade ${row.reader.grade}` + (row.times > 1 ? ` · suggested ${row.times} times` : '')
  }
  const recommended = [...byReader.values(), ...organic].sort(
    (a, b) => ORDER[a.outcome] - ORDER[b.outcome] || a.reader.name.localeCompare(b.reader.name),
  )

  // Sessions come off the readers who finished it: a logged read is minutes on
  // a date, and that is the only reading this product ever actually sees.
  const sessions = recommended
    .filter((x) => x.outcome === 'read')
    .map((x) => ({
      reader: x.reader,
      minutes: 10 + Math.floor(r() * 45),
      sittings: 2 + Math.floor(r() * 9),
      month: x.month,
    }))

  // A book talk is a conversation about a finished book, so it is drawn from
  // the readers who finished this one rather than invented beside them. Whether
  // one happened is seeded on the *pair* rather than drawn from this title's
  // stream, so a reader's talks are the same set whichever end you ask from —
  // the title's panel and `readerTalks` below have to agree.
  const bookTalks = sessions
    .filter((s) => hadTalk(s.reader.id, titleId))
    .map((s) => talkOf(s, title))

  const reviews = sessions
    .filter(() => r() < 0.4)
    .map((s) => ({
      reader: s.reader,
      stars: 3 + Math.floor(r() * 3),
      month: s.month,
      text: REVIEW_LINES[Math.floor(r() * REVIEW_LINES.length)],
    }))

  const rated = reviews.length
  const avg = rated
    ? Math.round((reviews.reduce((n, x) => n + x.stars, 0) / rated) * 10) / 10
    : null

  // Same shelf, and not this book. What a librarian reaches for next.
  const similar = school.catalog
    .filter((t) => t.genre === title.genre && t.id !== title.id)
    .slice(0, 6)

  return {
    title,
    stats: {
      // Readers, not events — "suggested to 31 readers" is the fact; how many
      // times each of them saw it is a property of the row. `suggested` counts
      // only what the engine did; the other two count everybody, because a book
      // read is a book read however the reader got to it.
      suggested: byReader.size,
      /* Discrete, not a funnel: the panel's own filter treats "wish listed" and
         "read" as two states a reader is in, and the same word meaning two
         different things four inches apart is worse than losing the
         progression. The Overview's funnel keeps the inclusive reading, where
         it is drawn as one and labelled with percentages. */
      saved: recommended.filter((x) => x.outcome === 'saved').length,
      read: recommended.filter((x) => x.outcome === 'read').length,
    },
    recommended,
    sessions,
    bookTalks,
    reviews,
    rating: { avg, count: rated },
    similar,
    // Where the title already sits: the lists staff curated, the challenges
    // that require it, and the Discover shelves it lands on.
    lists: listsFor(school, title),
  }
}

/** Read first, then saved, then merely shown — the useful order for a teacher. */
const ORDER = { read: 0, saved: 1, shown: 2 }

/**
 * Every title, pooled across the district.
 *
 * A title is on six shelves, and how it does is a different number on each —
 * so the district's view of it is the sum, not an average of averages. Keyed by
 * title id, because the same book carries different ids nowhere: the catalogs
 * are built from the one library.
 *
 * `schools` counts how many of them carry it, which is what separates "a book
 * the district loves" from "a book one school loves".
 */
export function districtTitles() {
  const pooled = new Map()
  for (const school of SCHOOLS) {
    for (const s of titleStats(school).values()) {
      const cur = pooled.get(s.title.id) ?? {
        title: s.title,
        suggested: 0,
        saved: 0,
        logged: 0,
        schools: 0,
      }
      cur.suggested += s.suggested
      cur.saved += s.saved
      cur.logged += s.logged
      cur.schools += 1
      pooled.set(s.title.id, cur)
    }
  }
  return [...pooled.values()].map((t) => ({
    ...t,
    readPct: pct(t.logged, t.suggested),
    savedPct: pct(t.saved, t.suggested),
  }))
}

/* What a title has to clear before the district can claim anything about it:
   enough suggestions for a rate to mean something, *and* enough schools for it
   to be the district's result rather than one school's enthusiasm. Half the
   schools is the bar — below that it is a school-level story, and it belongs on
   that school's own Overview. */
const DISTRICT_FLOOR = 30
const districtWide = (t) => t.suggested >= DISTRICT_FLOOR && t.schools >= SCHOOLS.length / 2

/** Suggested widely, and taken — the district's working titles. */
export function districtWinners(n = 5) {
  return districtTitles()
    .filter(districtWide)
    .sort((a, b) => b.readPct - a.readPct || b.logged - a.logged)
    .slice(0, n)
}

/** Suggested just as widely, and left alone. The engine's own misses, pooled. */
export function districtMisses(n = 5) {
  return districtTitles()
    .filter(districtWide)
    .sort((a, b) => a.readPct - b.readPct || b.suggested - a.suggested)
    .slice(0, n)
}

// ─── What Benny makes of it ──────────────────────────────────────────────────
/* A read of the collection in three sentences, the way the Student Profile
   opens with a read of the reader.
 *
 * Every clause is computed. Nothing here is a fixed line with a number dropped
 * into it: which sentences appear, and which way round they run, depends on
 * what the figures say — a school with a stale catalog is told about the
 * catalog first, a school that is converting well is told what is working
 * before what isn't. A summary that says the same thing whatever the data does
 * is decoration, and this page has enough of those.
 *
 * `**bold**` marks the figures; `emphasize` in the view turns them into
 * <strong>, the same convention the profile's summary uses.
 */

/** Rough bands for a suggested→read rate, so the wording can differ by how it's going. */
const RATE_BAND = (p) => (p >= 30 ? 'strong' : p >= 18 ? 'fair' : 'weak')

export function bennySchool(school) {
  const f = funnel(school.events)
  const found = discovered(school).filter((s) => s.logged > 0).length
  const dead = deadShelf(school).length
  const never = neverSuggested(school)
  const fresh = freshness(school)
  const band = RATE_BAND(f.loggedPct)
  const best = [...funnelBySurface(school.events)].sort((a, b) => b.savedPct - a.savedPct)[0]
  const out = []

  // A catalog nobody has synced is the fact that outranks the rest: every
  // number below it is being computed against a shelf that has moved.
  if (!fresh.asOf) {
    out.push(
      `I can't say much yet — **${school.name}**'s library catalog has never synced, so I'm only recommending from what the other sources carry.`,
    )
  } else if (fresh.staleDays > 30) {
    out.push(
      `Read this with one eye open: the library catalog last synced **${fresh.staleDays} days ago**, so anything weeded or added since is still off my books.`,
    )
  }

  out.push(
    band === 'strong'
      ? `Readers are taking **${f.loggedPct}%** of what I suggest — **${f.logged.toLocaleString()}** reads out of **${f.suggested.toLocaleString()}** — which is a collection doing its job.`
      : band === 'fair'
        ? `**${f.loggedPct}%** of my suggestions end in a logged read — **${f.logged.toLocaleString()}** out of **${f.suggested.toLocaleString()}**. Steady, with room in it.`
        : `Only **${f.loggedPct}%** of my suggestions end in a logged read. That is usually the shelf, not the readers: I keep offering what you have, and what you have isn't landing.`,
  )

  out.push(
    `**${found}** titles you already owned have been read off a suggestion this year, and **${dead}** are still sitting untouched — **${never}** of those I have never had a reason to put in front of anyone.`,
  )

  // Close on the thing to do about it, which is a different thing per band.
  out.push(
    band === 'weak'
      ? `**${best.label}** is my best surface at **${best.savedPct}%** saved. If you want one lever, widen what I can reach — the untouched pile is mostly books nobody has been shown.`
      : `**${best.label}** is where they bite hardest, at **${best.savedPct}%** saved. The untouched pile is the place to spend a display table.`,
  )

  return out.join(' ')
}

export function bennyDistrict() {
  const rows = schoolRows()
  const totals = districtTotals()
  const best = rows[0]
  const worst = rows[rows.length - 1]
  const stale = rows.filter((r) => r.fresh.problems > 0)
  const band = RATE_BAND(totals.funnel.loggedPct)
  const win = districtWinners(2)
  const miss = districtMisses(2)
  const out = []

  out.push(
    band === 'strong'
      ? `Across **${rows.length}** schools, readers take **${totals.funnel.loggedPct}%** of what I suggest, and **${totals.activated.toLocaleString()}** titles you already owned have been read off one.`
      : `Across **${rows.length}** schools, **${totals.funnel.loggedPct}%** of my suggestions end in a logged read, and **${totals.activated.toLocaleString()}** already-owned titles have been read off one.`,
  )

  // ── Which books are working ────────────────────────────────────────────────
  // Pooled across every school, and floored, so one school's enthusiasm can't
  // put a book at the top of a district list.
  if (win.length) {
    out.push(
      `**${win[0].title.title}** is the one to keep buying: suggested **${win[0].suggested.toLocaleString()}** times across **${win[0].schools}** schools and read **${win[0].readPct}%** of them${
        win[1] ? `, with **${win[1].title.title}** just behind at **${win[1].readPct}%**` : ''
      }.`,
    )
  }
  if (miss.length) {
    // A tie at the bottom reads as a comparison when it isn't.
    const tied = miss[1] && miss[1].readPct === miss[0].readPct
    out.push(
      `At the other end, **${miss[0].title.title}** has been in front of readers **${miss[0].suggested.toLocaleString()}** times for a **${miss[0].readPct}%** read rate${
        tied
          ? `, and so has **${miss[1].title.title}**`
          : miss[1]
            ? `, with **${miss[1].title.title}** not much better at **${miss[1].readPct}%**`
            : ''
      } — that is me being wrong about them, not the shelf being empty.`,
    )
  }

  // ── Which schools are working ──────────────────────────────────────────────
  // The spread is the district's real story — an average of six collections is
  // short of none of them, which is why this names the ends instead.
  out.push(
    `The spread is wider than the average: **${best.name}** converts at **${best.funnel.loggedPct}%** and has put **${best.activated}** owned titles back to work; **${worst.name}** converts at **${worst.funnel.loggedPct}%**. Same engine, different shelves.`,
  )

  out.push(
    stale.length
      ? `**${stale.length}** of **${rows.length}** ${stale.length === 1 ? 'school is' : 'schools are'} recommending from a catalog that hasn't synced lately${stale.length === 1 ? ` — ${stale[0].name}` : ''}. That is the cheapest thing on this page to fix.`
      : `Every school is syncing cleanly, so what you're seeing is the collections themselves rather than stale data.`,
  )

  return out.join(' ')
}
