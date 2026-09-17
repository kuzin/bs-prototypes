// Title recommendations — the half of RMI 2.0 the genre mapping exists to
// serve. A librarian doesn't want "try mystery", they want twelve books they
// can pull off the shelf and hand over.
//
// The chain is the doc's, and it is the whole design: a reader's motivation
// type → the toolkit's three genres for that type → the titles filed under
// each. So a reader gets three lists, one per genre, and nothing is
// recommended that isn't reachable from the type they were told they are.
//
// The pool is `library.js` — 405 real books for grades 3–5, filed under the
// toolkit's own genre names, with Open Library covers. In the product these
// would come from Book Contexts, where the doc asks JRC to tag each title with
// a grade level and an RMI type association.

import { GENRES_BY_FACTOR } from './genres'
import { TITLES_BY_GENRE } from './library'

/**
 * How long a list runs. A rail wants enough in it to be worth pushing — a row
 * of five reads as the whole answer, a row of twelve reads as a shelf you are
 * looking along. A list shorter than this is one that ran out of shelf, not one
 * that was meant to be short.
 */
export const PER_LIST = 12

/** '8–12' → [8, 12]. Ranges are written with an en dash. */
function ages(book) {
  const match = /(\d+)\D+(\d+)/.exec(book.ageRange ?? '')
  return match ? [Number(match[1]), Number(match[2])] : null
}

/** A grade band as ages, the way a classroom teacher would think of it. */
export function bandForGrades([from, to]) {
  return [from + 5, to + 6]
}

/**
 * One genre's shelf, narrowed to the grade band being recommended for — the
 * doc's other half of the filter, and the reason a title carries an age range
 * at all.
 */
export function titlesForGenre(genre, { band } = {}) {
  const shelf = TITLES_BY_GENRE[genre] ?? []
  if (!band) return shelf
  return shelf.filter((book) => {
    const range = ages(book)
    return range && range[1] >= band[0] && range[0] <= band[1]
  })
}

/** Everything reachable from one motivation type, across its three genres. */
export function titlesForFactor(factor, { band } = {}) {
  const seen = new Set()
  const out = []
  for (const genre of GENRES_BY_FACTOR[factor] ?? []) {
    for (const book of titlesForGenre(genre.name, { band })) {
      if (seen.has(book.id)) continue
      seen.add(book.id)
      out.push({ book, genre: genre.name, factor })
    }
  }
  return out
}

/**
 * The five titles a report shows, drawn across the reader's top three types so
 * no one type takes the whole list, and cycling on `page` so Refresh hands back
 * a different five rather than reshuffling the same ones.
 */
export function titleRecommendations(topFactors, { band, page = 0, count = 5 } = {}) {
  const pools = topFactors
    .map((f) => titlesForFactor(f.name, { band }))
    .filter((pool) => pool.length > 0)

  if (pools.length === 0) return []

  // Round-robin, so the first five span the types rather than exhausting the
  // strongest one first.
  const ordered = []
  for (let i = 0; ordered.length < pools.reduce((n, p) => n + p.length, 0); i++) {
    for (const pool of pools) if (i < pool.length) ordered.push(pool[i])
  }

  const unique = []
  const seen = new Set()
  for (const pick of ordered) {
    if (seen.has(pick.book.id)) continue
    seen.add(pick.book.id)
    unique.push(pick)
  }

  if (unique.length === 0) return []
  const start = (page * count) % unique.length
  return Array.from(
    { length: Math.min(count, unique.length) },
    (_, i) => unique[(start + i) % unique.length],
  )
}

/** Whether there are more than one page's worth — Refresh is pointless below that. */
export function hasMoreTitles(topFactors, { band, count = 5 } = {}) {
  const total = new Set(
    topFactors.flatMap((f) => titlesForFactor(f.name, { band }).map((t) => t.book.id)),
  ).size
  return total > count
}

/**
 * A reader's three book lists — the three genres of their strongest motivation
 * type.
 *
 * One type, not three. The toolkit gives each type three genres precisely so
 * that a reader has somewhere to go next without leaving what motivates them:
 * a Scholar gets the three Scholar shelves. Spreading the lists across a
 * reader's top three types instead would hand them three unrelated shelves and
 * bury the thing the report just spent a page establishing.
 *
 * A title sits in exactly one of the three. The genres under a type overlap —
 * a graphic novel is both a Graphic Novel and a Hi-Lo book — and a reader
 * working down three lists shouldn't meet the same book twice, so the first
 * list to claim it keeps it.
 */
export function readerBookLists(factor, { band, per = PER_LIST } = {}) {
  const genres = GENRES_BY_FACTOR[factor]
  if (!genres) return []

  const taken = new Set()
  return genres
    .map((genre) => {
      const books = []
      for (const book of titlesForGenre(genre.name, { band })) {
        if (taken.has(book.id)) continue
        taken.add(book.id)
        books.push(book)
        if (books.length >= per) break
      }
      return { genre: genre.name, why: genre.why, books }
    })
    .filter((list) => list.books.length > 0)
}

/**
 * Every book any reader in the class is being recommended, counted — a pull
 * list.
 *
 * Not the class's own three lists: a class doesn't have a motivation type.
 * Averaging twenty-four readers into one and recommending against that
 * describes nobody, so this is the union of what those readers are *actually*
 * shown, with how many of them each title serves. That count is the whole point
 * of the rollup — it's what says whether to pull one copy or four — so it is
 * also what orders it.
 */
export function classRollup(responses, topFactorOf, { band, per = PER_LIST } = {}) {
  const tally = new Map()

  for (const response of responses) {
    for (const list of readerBookLists(topFactorOf(response.scores), { band, per })) {
      for (const book of list.books) {
        const row = tally.get(book.id) ?? { book, readers: 0, genres: new Set() }
        row.readers += 1
        row.genres.add(list.genre)
        tally.set(book.id, row)
      }
    }
  }

  return [...tally.values()]
    .map((row) => ({ ...row, genres: [...row.genres] }))
    .sort((a, b) => b.readers - a.readers || a.book.title.localeCompare(b.book.title))
}
