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
  FORMATS,
  FORMAT_ORDER,
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

export function bennySchool(school, readerRequests = []) {
  // The same read the health card makes, readers' own requests included, so
  // Benny never calls a collection healthy that the card beside him doesn't.
  const h = collectionHealth(school, readerRequests)
  const fresh = freshness(school)
  const actions = [...titleActions(school).values()]
  const buy = actions.filter((a) => a.kind === 'buy').length
  const weed = actions.filter((a) => a.kind === 'weed').length
  const out = []

  // A catalog nobody has synced is the fact that outranks the rest: every
  // number below it is being computed against a shelf that has moved.
  if (!fresh.asOf) {
    out.push(
      `Read this with care — **${school.name}**'s library catalog has never synced, so I can only see what the other sources carry.`,
    )
  } else if (fresh.staleDays > 30) {
    out.push(
      `Read this with one eye open: the library catalog last synced **${fresh.staleDays} days ago**, so anything bought since isn't counted yet.`,
    )
  }

  out.push(
    h.level === 'green'
      ? `Your collection is keeping up with your readers: **${h.reach.read}** of your **${h.reach.total}** titles have been read off one of my recommendations, and nearly everyone still has plenty left to be handed.`
      : h.level === 'yellow'
        ? `Your collection is mostly keeping up, but **${h.gapCount}** gaps are starting to show${h.underserved ? `, and **${h.underserved}** ${h.underserved === 1 ? 'reader is' : 'readers are'} running low on books in the genres they read` : ''}.`
        : `Your collection is falling behind its readers: **${h.gapCount}** collection gaps${h.underserved ? `, and **${h.underserved}** ${h.underserved === 1 ? 'reader is' : 'readers are'} running out of books in the genres they read` : ''}.`,
  )

  // The biggest gap, stated as the thing it looks like from a reader's side.
  const gap = [...h.genreGaps].sort((a, b) => b.into - a.into)[0]
  if (gap) {
    out.push(
      `The biggest is **${gap.label}**: **${gap.into}** readers are into it and there ${gap.titles === 1 ? 'is' : 'are'} **${gap.titles}** ${gap.titles === 1 ? 'title' : 'titles'}, so I keep handing the same ones round — the top three take **${gap.topShare}%** of what I suggest there.`,
    )
  }
  const strong = h.strengths[0]
  if (strong) {
    out.push(
      `**${strong.label}** is the other end — **${strong.titles}** titles, nearly all of them recommended, and read **${strong.readPct}%** of the time.`,
    )
  }

  if (buy || weed) {
    out.push(
      `On the Collection page, **${buy}** ${buy === 1 ? 'title is' : 'titles are'} flagged as worth buying more like, and **${weed}** as weeding candidates.`,
    )
  }

  return out.join(' ')
}

export function bennyDistrict() {
  const d = districtHealth()
  const rows = d.rows
  const worst = rows[0]
  const stale = rows.filter((r) => r.fresh.problems > 0)
  const out = []

  out.push(
    `Across **${rows.length}** schools, **${d.counts.red}** ${d.counts.red === 1 ? 'collection is' : 'collections are'} at risk, **${d.counts.yellow}** ${d.counts.yellow === 1 ? 'needs' : 'need'} attention and **${d.counts.green}** ${d.counts.green === 1 ? 'is' : 'are'} healthy.`,
  )

  if (worst && worst.health.level !== 'green') {
    out.push(
      `**${worst.name}** is the one to look at first: **${worst.health.gapCount}** collection gaps, and **${worst.health.underserved}** readers running out of books in the genres they read.`,
    )
  }

  // What more than one building is short of is a purchase, not a school's
  // problem — so that is the gap this names.
  const [g1, g2] = d.genreGaps
  if (g1) {
    out.push(
      `**${g1.label}** is short in **${g1.gapAt.length}** schools${
        g2 ? `, and **${g2.label}** in **${g2.gapAt.length}**` : ''
      } — the district's clearest purchases.`,
    )
  }

  out.push(
    `Of the **${d.reach.total.toLocaleString()}** titles switched on across the district, **${d.reach.read.toLocaleString()}** have been read off a recommendation and **${d.reach.never.toLocaleString()}** have never been recommended at all.`,
  )

  if (stale.length) {
    out.push(
      `**${stale.length}** ${stale.length === 1 ? 'school is' : 'schools are'} working from a catalog that hasn't synced lately, so ${stale.length === 1 ? 'its' : 'their'} gaps may be overstated.`,
    )
  }

  return out.join(' ')
}

// ─── Collection health ───────────────────────────────────────────────────────
/* The collection's side of every number above. The funnel asks how well the
   engine is doing with the shelves it has; this asks whether the shelves are
   enough — whether the readers here have something left to be handed.
 *
 * The unit is the RMI toolkit's genre, because it is the only subject filing
 * every title in the catalog carries. A gap is a genre readers are into and
 * the collection is thin on: the engine keeps handing the same few titles to
 * the same readers, which is what "Benny recommends the same ten books over and
 * over" looks like from the inside. */

/** A reader is "into" a genre once they have wish listed or logged a title in it. */
const INTO = (e) => e.saved
/** Readers into a genre per title that genre has. Past this, the shelf is thin. */
const GAP_PER_TITLE = 3.5
/** A small shelf is a gap sooner — five titles can't serve a dozen readers. */
const SMALL_SHELF = 5
const SMALL_SHELF_DEMAND = 12
/** A reader with fewer unread titles than this in their genres is running out. */
const UNDERSERVED_BELOW = 20
/** A Benny request with fewer titles to offer than this can't really be answered. */
export const REQUEST_GAP_BELOW = 6

const shortGenre = (g) => g.replace(/\s*\([^)]*\)/g, '').trim()
export { shortGenre }

/** Where a title stands against the engine: recommended and read, recommended and not, or never. */
export const titleStatus = (s) => (!s.suggested ? 'never' : s.logged ? 'read' : 'unread')

export const TITLE_STATUS = {
  read: { label: 'Recommended, then read', short: 'Read', color: '#0BA85F' },
  unread: { label: 'Recommended, not read', short: 'Not read', color: '#D97706' },
  never: { label: 'Never recommended', short: 'Never', color: '#767676' },
}
export const TITLE_STATUS_ORDER = ['read', 'unread', 'never']

/**
 * The catalog, cut three ways: read off a recommendation, recommended and left,
 * never recommended at all. Takes the rows rather than a school so the same
 * count describes whatever the filters have narrowed a list to.
 */
export function reach(rows) {
  const out = { total: rows.length, recommended: 0, read: 0, unread: 0, never: 0 }
  for (const s of rows) {
    const st = titleStatus(s)
    out[st]++
    if (st !== 'never') out.recommended++
  }
  return out
}

/** Every title in the school with its stats, in one array. */
export const schoolTitles = (school) => [...titleStats(school).values()]

/**
 * Supply against demand, one row per genre.
 *
 * `into` is the demand: readers who wish listed or logged a title in it — what
 * their own reading says they want, not a survey. `titles` is the supply.
 * `topShare` is the tell: how much of the genre's suggestions went to its three
 * most-suggested titles. A thin shelf and a high share is the same handful of
 * books going round.
 */
export function genreHealth(school) {
  const byId = new Map(school.catalog.map((t) => [t.id, t]))
  const stats = titleStats(school)
  const rows = new Map()
  for (const t of school.catalog) {
    const row = rows.get(t.genre) ?? {
      genre: t.genre,
      label: shortGenre(t.genre),
      titles: 0,
      recommended: 0,
      suggested: 0,
      logged: 0,
      readers: new Set(),
      perTitle: new Map(),
    }
    row.titles++
    const s = stats.get(t.id)
    if (s?.suggested) row.recommended++
    rows.set(t.genre, row)
  }
  for (const e of school.events) {
    const t = byId.get(e.titleId)
    const row = t && rows.get(t.genre)
    if (!row) continue
    row.suggested++
    if (e.logged) row.logged++
    if (INTO(e)) row.readers.add(e.readerId)
    row.perTitle.set(e.titleId, (row.perTitle.get(e.titleId) ?? 0) + 1)
  }
  const schoolRate = pct(school.events.filter((e) => e.logged).length, school.events.length)
  return [...rows.values()]
    .map((row) => {
      const into = row.readers.size
      const top3 = [...row.perTitle.values()]
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((n, v) => n + v, 0)
      const perTitle = row.titles ? Math.round((into / row.titles) * 10) / 10 : 0
      const readPct = pct(row.logged, row.suggested)
      const gap =
        perTitle >= GAP_PER_TITLE || (row.titles <= SMALL_SHELF && into >= SMALL_SHELF_DEMAND)
      // A strength is the opposite shape: plenty on the shelf, most of it put in
      // front of readers, and it lands better than the school's own average.
      const strength =
        !gap &&
        row.titles >= 10 &&
        row.recommended >= row.titles * 0.8 &&
        readPct >= schoolRate * 1.25
      return {
        genre: row.genre,
        label: row.label,
        titles: row.titles,
        recommended: row.recommended,
        suggested: row.suggested,
        logged: row.logged,
        into,
        perTitle,
        readPct,
        topShare: pct(top3, row.suggested),
        verdict: gap ? 'gap' : strength ? 'strength' : 'ok',
      }
    })
    .sort((a, b) => b.perTitle - a.perTitle)
}

export const GENRE_VERDICT = {
  gap: { label: 'Gap', color: '#DC2626' },
  strength: { label: 'Strength', color: '#0BA85F' },
  ok: { label: 'Covered', color: '#767676' },
}

/** Benny requests the collection can't answer — a gap in a student's own words. */
export function requestGaps(school) {
  return bennyQueries(school).filter((q) => q.hits < REQUEST_GAP_BELOW)
}

/**
 * Readers who are running out of books. A reader's genres are the ones their
 * own reading has touched plus the three their motivation type points at; what
 * is left for them is every title in those genres they haven't already read.
 * Below twenty, the engine is about to start repeating itself to them.
 */
export function underserved(school) {
  const byId = new Map(school.catalog.map((t) => [t.id, t]))
  const touched = new Map()
  const read = new Map()
  for (const e of school.events) {
    if (!INTO(e)) continue
    const g = byId.get(e.titleId)?.genre
    if (!g) continue
    if (!touched.has(e.readerId)) touched.set(e.readerId, new Set())
    touched.get(e.readerId).add(g)
    if (e.logged) {
      if (!read.has(e.readerId)) read.set(e.readerId, new Set())
      read.get(e.readerId).add(e.titleId)
    }
  }
  return school.readers
    .map((r) => {
      const genres = new Set([...(touched.get(r.id) ?? []), ...factorGenres(r.factor)])
      const done = read.get(r.id) ?? new Set()
      const left = school.catalog.filter((t) => genres.has(t.genre) && !done.has(t.id)).length
      return { reader: r, left }
    })
    .filter((x) => x.left < UNDERSERVED_BELOW)
}

/* Where yellow and red start, on each of the two measures that set the colour.
   Exported so the health card can draw a reading against the same lines the
   verdict is taken from. */
export const HEALTH_BANDS = {
  gaps: { yellow: 5, red: 12 },
  underPct: { yellow: 5, red: 12 },
}

export const HEALTH = {
  green: {
    label: 'Healthy',
    color: '#0BA85F',
    icon: 'circle-check',
    line: 'Your collection is keeping up with your readers.',
  },
  yellow: {
    label: 'Needs attention',
    color: '#D97706',
    icon: 'alert-triangle',
    line: 'Mostly keeping up — a few gaps are starting to show.',
  },
  red: {
    label: 'At risk',
    color: '#DC2626',
    icon: 'alert-hexagon',
    line: 'Falling behind — readers are running out of books.',
  },
}

/**
 * The one read of a collection: red, yellow or green, and the reasons behind
 * it. Two things decide the colour — how many gaps the collection has, and how
 * many readers are running out of books — because those are the two ways a
 * collection fails a reader. Everything else is a reason, not a score.
 *
 * `readerRequests` are titles this school's readers asked for from a book in
 * Discover that none of the school's sources carries (`useTitleRequests`) —
 * each one a request the collection can't answer yet, so they count with
 * Benny's unanswered ones.
 */
export function collectionHealth(school, readerRequests = []) {
  const genres = genreHealth(school)
  const genreGaps = genres.filter((g) => g.verdict === 'gap')
  const strengths = genres.filter((g) => g.verdict === 'strength')
  const reqGaps = [
    ...readerRequests.map((r) => ({ q: r.q, asks: r.asks, hits: 0 })),
    ...requestGaps(school),
  ]
  const under = underserved(school)
  const underPct = pct(under.length, school.readers.length)
  const gapCount = genreGaps.length + reqGaps.length
  const fresh = freshness(school)
  const r = reach(schoolTitles(school))

  const level =
    gapCount >= HEALTH_BANDS.gaps.red || underPct >= HEALTH_BANDS.underPct.red
      ? 'red'
      : gapCount >= HEALTH_BANDS.gaps.yellow || underPct >= HEALTH_BANDS.underPct.yellow
        ? 'yellow'
        : 'green'

  // The reasons, worst first. Each is a sentence a librarian could repeat.
  const reasons = []
  if (genreGaps.length) {
    const g = [...genreGaps].sort((a, b) => b.into - a.into)[0]
    reasons.push({
      tone: 'bad',
      text: `**${genreGaps.length}** ${genreGaps.length === 1 ? 'genre' : 'genres'} where readers have outgrown the shelf${genreGaps.length === 1 ? '' : ' — the biggest'}: **${g.into}** readers are into ${g.label}, and there ${g.titles === 1 ? 'is' : 'are'} **${g.titles}** ${g.titles === 1 ? 'title' : 'titles'} to hand them.`,
    })
  }
  if (reqGaps.length) {
    reasons.push({
      tone: 'bad',
      text: `**${reqGaps.length}** reader ${reqGaps.length === 1 ? 'request' : 'requests'} the collection can't answer, like “${reqGaps[0].q}”.`,
    })
  }
  if (under.length) {
    reasons.push({
      tone: underPct >= 5 ? 'bad' : 'neutral',
      text: `**${under.length}** ${under.length === 1 ? 'reader has' : 'readers have'} fewer than ${UNDERSERVED_BELOW} unread titles left in the genres they read.`,
    })
  }
  if (r.never) {
    reasons.push({
      tone: 'neutral',
      text: `**${r.never}** titles have never been recommended — nothing any reader here has asked for points at them.`,
    })
  }
  if (strengths.length) {
    reasons.push({
      tone: 'good',
      text: `Strong in ${strengths
        .slice(0, 2)
        .map((s) => `**${s.label}**`)
        .join(' and ')} — well stocked, and it lands.`,
    })
  }
  if (!fresh.asOf || fresh.staleDays > 30) {
    reasons.push({
      tone: 'neutral',
      text: fresh.asOf
        ? `The library catalog is **${fresh.staleDays} days** old, so some of these gaps may already be filled.`
        : `The library catalog has never synced, so print holdings aren't counted — the gaps are overstated.`,
    })
  }

  // The four signals the card is built from, each judged on its own. The
  // overall colour is still set by gaps and readers running low; these say
  // where, in one figure and one concrete example each.
  const biggest = [...genreGaps].sort((a, b) => b.into - a.into)[0]
  const neverPct = pct(r.never, r.total)
  const signals = [
    {
      id: 'genres',
      label: genreGaps.length === 1 ? 'Genre outgrown' : 'Genres outgrown',
      value: genreGaps.length,
      level: genreGaps.length === 0 ? 'green' : genreGaps.length <= 3 ? 'yellow' : 'red',
      detail: biggest
        ? `**${biggest.label}** — ${biggest.into} readers, ${biggest.titles} titles`
        : 'Every genre has room for the readers into it.',
      target: 'gaps',
      cta: 'See the genres',
    },
    {
      id: 'requests',
      label: reqGaps.length === 1 ? 'Request unanswered' : 'Requests unanswered',
      value: reqGaps.length,
      level: reqGaps.length <= 2 ? 'green' : reqGaps.length <= 5 ? 'yellow' : 'red',
      detail: reqGaps.length
        ? `“${reqGaps[0].q}”${reqGaps.length > 1 ? ` and ${reqGaps.length - 1} more` : ''}`
        : 'Benny has something for every request.',
      target: 'requests',
      cta: 'See the requests',
    },
    {
      id: 'never',
      label: 'Never recommended',
      value: r.never,
      level: neverPct < 15 ? 'green' : neverPct < 30 ? 'yellow' : 'red',
      detail: `${Math.round(neverPct)}% of the collection — no reader's reading points at them`,
      target: 'never',
      cta: 'See the titles',
    },
  ]
  const caveat = !fresh.asOf
    ? "The library catalog has never synced, so print holdings aren't counted — the gaps are overstated."
    : fresh.staleDays > 30
      ? `The library catalog is ${fresh.staleDays} days old, so some of these gaps may already be filled.`
      : null

  return {
    level,
    ...HEALTH[level],
    signals,
    caveat,
    gapCount,
    genreGaps,
    strengths,
    reqGaps,
    underserved: under.length,
    underPct,
    reach: r,
    reasons,
  }
}

// ─── Comparing collections and formats ──────────────────────────────────────
/* How each catalog is pulling its weight. A title carried by two catalogs
   counts in both — the question is "how are Sora's titles doing", and a title
   Sora carries is one of them whoever else has it too. */

function compareBy(school, keyOf) {
  const stats = titleStats(school)
  const rows = new Map()
  for (const t of school.catalog) {
    const s = stats.get(t.id)
    for (const key of new Set(keyOf(t))) {
      const row = rows.get(key) ?? { key, titles: [], suggested: 0, logged: 0 }
      row.titles.push(s)
      row.suggested += s.suggested
      row.logged += s.logged
      rows.set(key, row)
    }
  }
  return rows
}

const compareRow = (row) => {
  const r = reach(row.titles)
  return {
    key: row.key,
    ...r,
    recommendedPct: pct(r.recommended, r.total),
    readPct: pct(row.logged, row.suggested),
    suggested: row.suggested,
    logged: row.logged,
  }
}

/** One row per catalog the school carries. */
export function bySourceHealth(school) {
  const rows = compareBy(school, (t) => t.holdings.map((h) => h.source))
  return Object.keys(SOURCES)
    .filter((id) => rows.has(id))
    .map((id) => ({ ...compareRow(rows.get(id)), source: SOURCES[id] }))
}

/** One row per format — print, ebook, audiobook. */
export function byFormatHealth(school) {
  const rows = compareBy(school, (t) => t.holdings.map((h) => h.format))
  return FORMAT_ORDER.filter((id) => rows.has(id)).map((id) => ({
    ...compareRow(rows.get(id)),
    format: FORMATS[id],
  }))
}

/** The same comparison pooled across the district. */
function pooledCompare(perSchool, idOf) {
  const out = new Map()
  for (const rows of perSchool) {
    for (const row of rows) {
      const id = idOf(row)
      const cur = out.get(id) ?? {
        ...row,
        total: 0,
        recommended: 0,
        read: 0,
        unread: 0,
        never: 0,
        suggested: 0,
        logged: 0,
      }
      for (const k of ['total', 'recommended', 'read', 'unread', 'never', 'suggested', 'logged'])
        cur[k] += row[k]
      out.set(id, cur)
    }
  }
  return [...out.values()].map((r) => ({
    ...r,
    recommendedPct: pct(r.recommended, r.total),
    readPct: pct(r.logged, r.suggested),
  }))
}

export const districtBySource = () => pooledCompare(SCHOOLS.map(bySourceHealth), (r) => r.source.id)
export const districtByFormat = () => pooledCompare(SCHOOLS.map(byFormatHealth), (r) => r.format.id)

// ─── Classroom libraries ─────────────────────────────────────────────────────

/**
 * Every connected classroom shelf, ranked on how much of it is being read off a
 * recommendation. The rate is per title on the shelf rather than per
 * suggestion: a teacher's question is "is my shelf being used", and a shelf of
 * forty with two books doing all the work is not.
 */
export function classroomBoard(school) {
  const stats = titleStats(school)
  return school.classrooms
    .map((room) => {
      const titles = school.catalog
        .filter((t) => t.holdings.some((h) => h.classroomId === room.id))
        .map((t) => stats.get(t.id))
      const r = reach(titles)
      const suggested = titles.reduce((n, s) => n + s.suggested, 0)
      const logged = titles.reduce((n, s) => n + s.logged, 0)
      const workingPct = pct(r.read, r.total)
      const readPct = pct(logged, suggested)
      const level = workingPct >= 50 ? 'green' : workingPct >= 30 ? 'yellow' : 'red'
      return { room, ...r, suggested, logged, workingPct, readPct, level }
    })
    .sort((a, b) => b.workingPct - a.workingPct || b.logged - a.logged)
}

// ─── What to do about a title ────────────────────────────────────────────────

export const TITLE_ACTION = {
  buy: {
    label: 'Buy more like this',
    short: 'Buy more like',
    color: '#0BA85F',
    icon: 'shopping-cart',
  },
  weed: { label: 'Consider weeding', short: 'Consider weeding', color: '#D97706', icon: 'archive' },
}

/**
 * The one thing a librarian might do about a title, or nothing. Buy more like
 * it: it is being read, in a genre readers here have outgrown the shelf on.
 * Weed it: old, and nothing has come of it — never recommended, or recommended
 * and never picked up. Both are suggestions; the reason rides with them.
 */
export function titleActions(school) {
  const gaps = new Map(
    genreHealth(school)
      .filter((g) => g.verdict === 'gap')
      .map((g) => [g.genre, g]),
  )
  const out = new Map()
  for (const s of titleStats(school).values()) {
    const g = gaps.get(s.title.genre)
    if (g && s.logged >= 2) {
      out.set(s.title.id, {
        kind: 'buy',
        ...TITLE_ACTION.buy,
        reason: `Read ${s.logged} times off a recommendation, and ${g.into} readers here are into ${g.label} with only ${g.titles} titles to hand them.`,
      })
    } else if (
      !s.logged &&
      !s.saved &&
      s.title.published <= 2008 &&
      (s.suggested === 0 || s.suggested >= 5)
    ) {
      out.set(s.title.id, {
        kind: 'weed',
        ...TITLE_ACTION.weed,
        reason: s.suggested
          ? `Published ${s.title.published}, recommended ${s.suggested} times this year and never wish listed or read.`
          : `Published ${s.title.published}, and no reader's reading has pointed the engine at it all year.`,
      })
    }
  }
  return out
}

// ─── The district, school by school ─────────────────────────────────────────

/** Every school's health, worst first — the district's worklist. */
export function schoolHealthRows() {
  const order = { red: 0, yellow: 1, green: 2 }
  return SCHOOLS.map((school) => ({
    school,
    id: school.id,
    name: school.name,
    readers: school.readers.length,
    fresh: freshness(school),
    funnel: funnel(school.events),
    health: collectionHealth(school),
  })).sort(
    (a, b) =>
      order[a.health.level] - order[b.health.level] || b.health.gapCount - a.health.gapCount,
  )
}

/**
 * The district's gaps: a genre that is a gap in two or more buildings. One
 * school short of something is that school's problem; the same shortfall in a
 * third of the district is a purchase order.
 */
export function districtGenreGaps() {
  const per = SCHOOLS.map((s) => ({ school: s, rows: genreHealth(s) }))
  const by = new Map()
  for (const { school, rows } of per) {
    for (const g of rows) {
      const cur = by.get(g.genre) ?? {
        genre: g.genre,
        label: g.label,
        titles: 0,
        into: 0,
        suggested: 0,
        logged: 0,
        gapAt: [],
        strongAt: [],
      }
      cur.titles += g.titles
      cur.into += g.into
      cur.suggested += g.suggested
      cur.logged += g.logged
      if (g.verdict === 'gap') cur.gapAt.push(school.name)
      if (g.verdict === 'strength') cur.strongAt.push(school.name)
      by.set(g.genre, cur)
    }
  }
  return [...by.values()]
    .map((g) => ({
      ...g,
      readPct: pct(g.logged, g.suggested),
      perTitle: g.titles ? Math.round((g.into / g.titles) * 10) / 10 : 0,
      verdict: g.gapAt.length >= 2 ? 'gap' : g.strongAt.length >= 2 ? 'strength' : 'ok',
    }))
    .sort((a, b) => b.gapAt.length - a.gapAt.length || b.perTitle - a.perTitle)
}

/** District totals for the health view. */
export function districtHealth() {
  const rows = schoolHealthRows()
  const genres = districtGenreGaps()
  const requests = districtBennyQueries().filter((q) => q.hits < REQUEST_GAP_BELOW)
  const titles = districtTitles()
  return {
    rows,
    counts: {
      red: rows.filter((r) => r.health.level === 'red').length,
      yellow: rows.filter((r) => r.health.level === 'yellow').length,
      green: rows.filter((r) => r.health.level === 'green').length,
    },
    genreGaps: genres.filter((g) => g.verdict === 'gap'),
    strengths: genres.filter((g) => g.verdict === 'strength'),
    requestGaps: requests,
    gapCount: genres.filter((g) => g.verdict === 'gap').length + requests.length,
    // The district's collection is its six collections added up — the same way
    // "titles switched on" counts it — so a title four schools carry is four
    // chances to be read. Pooled to distinct titles, nearly everything has been
    // recommended *somewhere*, which says nothing about any one building.
    reach: SCHOOLS.map((s) => reach(schoolTitles(s))).reduce(
      (a, b) => ({
        total: a.total + b.total,
        recommended: a.recommended + b.recommended,
        read: a.read + b.read,
        unread: a.unread + b.unread,
        never: a.never + b.never,
      }),
      { total: 0, recommended: 0, read: 0, unread: 0, never: 0 },
    ),
    titles,
    underserved: rows.reduce((n, r) => n + r.health.underserved, 0),
  }
}

// ─── One title, across the district ─────────────────────────────────────────

/**
 * The district's view of a title: the same rail the school panel has, and one
 * row per school in place of one row per reader. Less to drill into on
 * purpose — a district office compares buildings, it doesn't read a child's
 * log.
 */
export function districtBookDetail(titleId) {
  const perSchool = SCHOOLS.map((school) => ({ school, detail: bookDetail(school, titleId) }))
  const held = perSchool.filter((x) => x.detail)
  if (!held.length) return null
  // One title record, with every holding any school has for it — the district
  // can get a reader to it through any of them.
  const title = { ...held[0].detail.title, holdings: districtHoldings().get(titleId) }
  const reviews = held.flatMap((x) => x.detail.reviews)
  const rated = reviews.length
  const schools = held.map(({ school, detail }) => ({
    school,
    suggested: detail.stats.suggested,
    saved: detail.stats.saved,
    read: detail.stats.read,
    talks: detail.bookTalks.length,
  }))
  const pooled = districtTitles().find((t) => t.title.id === titleId)
  const similar = []
  const simSeen = new Set([titleId])
  for (const { detail } of held) {
    for (const t of detail.similar) {
      if (simSeen.has(t.id) || similar.length >= 6) continue
      simSeen.add(t.id)
      similar.push(t)
    }
  }
  return {
    scope: 'district',
    title,
    stats: {
      suggested: schools.reduce((n, s) => n + s.suggested, 0),
      saved: schools.reduce((n, s) => n + s.saved, 0),
      read: schools.reduce((n, s) => n + s.read, 0),
    },
    schools: schools.sort((a, b) => b.read - a.read || b.suggested - a.suggested),
    missingAt: SCHOOLS.filter((s) => !held.some((x) => x.school.id === s.id)),
    readPct: pooled?.readPct ?? 0,
    bookTalks: held.flatMap((x) => x.detail.bookTalks),
    reviews,
    rating: {
      avg: rated ? Math.round((reviews.reduce((n, x) => n + x.stars, 0) / rated) * 10) / 10 : null,
      count: rated,
    },
    similar,
    recommended: [],
    lists: [],
  }
}

/** Every holding any school has for each title, one per source and format. */
let holdingsCache = null
export function districtHoldings() {
  if (holdingsCache) return holdingsCache
  const out = new Map()
  for (const school of SCHOOLS) {
    for (const t of school.catalog) {
      const list = out.get(t.id) ?? []
      for (const h of t.holdings) {
        if (!list.some((x) => x.source === h.source && x.format === h.format)) list.push(h)
      }
      out.set(t.id, list)
    }
  }
  holdingsCache = out
  return out
}

/**
 * The district's version of a title's suggested action. Buy more like it: read
 * widely, in a genre two or more buildings are short of. Weed it: old, and not
 * read anywhere it is held.
 */
export function districtTitleActions() {
  const gaps = new Map(
    districtGenreGaps()
      .filter((g) => g.verdict === 'gap')
      .map((g) => [g.genre, g]),
  )
  const out = new Map()
  for (const t of districtTitles()) {
    const g = gaps.get(t.title.genre)
    if (g && t.logged >= 10) {
      out.set(t.title.id, {
        kind: 'buy',
        ...TITLE_ACTION.buy,
        reason: `Read ${t.logged} times across ${t.schools} schools, in a genre ${g.gapAt.length} schools are short of.`,
      })
    } else if (!t.logged && t.title.published <= 2010) {
      out.set(t.title.id, {
        kind: 'weed',
        ...TITLE_ACTION.weed,
        reason: `Published ${t.title.published}, held at ${t.schools} ${t.schools === 1 ? 'school' : 'schools'} and not read off a recommendation at any of them.`,
      })
    }
  }
  return out
}

/**
 * The district's health as a roll-up of its schools, in the shape the
 * Collection Health card takes. Every figure is the schools' own added up —
 * genres outgrown, requests unanswered, titles never recommended — and the
 * colour is theirs too: at risk once a third of the schools are, healthy only
 * when none is and at most one needs attention.
 */
export function districtCollectionHealth() {
  const d = districtHealth()
  const n = d.rows.length
  const sum = (f) => d.rows.reduce((t, r) => t + f(r.health), 0)
  const genres = sum((h) => h.genreGaps.length)
  const requests = sum((h) => h.reqGaps.length)
  const level =
    d.counts.red >= n / 3 ? 'red' : d.counts.red === 0 && d.counts.yellow <= 1 ? 'green' : 'yellow'
  const LINE = {
    green: 'Collections across the district are keeping up with their readers.',
    yellow: 'Most schools are keeping up — a few are starting to fall behind.',
    red: `${d.counts.red} of ${n} schools are falling behind their readers.`,
  }
  // A school's own signal colour, rolled up: the worst any one school has.
  const worst = (id) => {
    const order = { green: 0, yellow: 1, red: 2 }
    return d.rows
      .map((r) => r.health.signals.find((sig) => sig.id === id)?.level ?? 'green')
      .reduce((a, b) => (order[b] > order[a] ? b : a), 'green')
  }
  return {
    level,
    ...HEALTH[level],
    line: LINE[level],
    reach: d.reach,
    caveat: null,
    signals: [
      {
        id: 'genres',
        label: 'Genres outgrown, across schools',
        value: genres,
        level: worst('genres'),
        target: 'gaps',
      },
      {
        id: 'requests',
        label: 'Requests unanswered, across schools',
        value: requests,
        level: worst('requests'),
        target: 'requests',
      },
      {
        id: 'never',
        label: 'Never recommended, across schools',
        value: d.reach.never.toLocaleString(),
        level: worst('never'),
        target: 'never',
      },
    ],
  }
}

/**
 * Genre health rolled up across the schools: a genre outgrown in any school is
 * listed as outgrown, with how many; one strong somewhere and outgrown nowhere
 * is listed as strong. `schools` is the count the pill states.
 */
export function districtGenreRollup() {
  return districtGenreGaps().map((g) => ({
    ...g,
    verdict: g.gapAt.length ? 'gap' : g.strongAt.length ? 'strength' : 'ok',
    schools: g.gapAt.length || g.strongAt.length,
  }))
}
