// Title recommendations — the half of RMI 2.0 the genre mapping exists to
// serve. A librarian doesn't want "try mystery", they want five books they can
// pull off the shelf and hand over.
//
// The chain is the doc's: a reader's top motivation types → the toolkit's three
// genres for each → the catalogue tags those genres cover → the titles carrying
// them. Nothing is recommended that isn't reachable from a motivation type.
//
// The catalogue is the Book Discovery prototype's, so the covers are real
// (Open Library, by ISBN) and the records carry the age ranges the doc's grade
// filter needs. In the product these titles would come from Book Contexts,
// where JRC tags each book with a grade level and an RMI type association.

import { BOOKS } from '../books/data'
import { GENRES_BY_FACTOR, BOOK_TAGS_BY_GENRE } from './genres'

/** '8–12' → [8, 12]. The catalogue writes ranges with an en dash. */
function ages(book) {
  const match = /(\d+)\D+(\d+)/.exec(book.ageRange ?? '')
  return match ? [Number(match[1]), Number(match[2])] : null
}

/** A grade band as ages, the way a classroom teacher would think of it. */
export function bandForGrades([from, to]) {
  return [from + 5, to + 6]
}

/**
 * Every title reachable from one motivation type, each tagged with the genre
 * that reached it — the page shows that, so the recommendation explains itself.
 */
export function titlesForFactor(factor, { band } = {}) {
  const genres = GENRES_BY_FACTOR[factor] ?? []
  const seen = new Set()
  const out = []

  for (const genre of genres) {
    const tags = BOOK_TAGS_BY_GENRE[genre.name] ?? []
    for (const book of BOOKS) {
      if (seen.has(book.id)) continue
      if (!book.genres?.some((g) => tags.includes(g))) continue

      // The doc's other half of the filter: a title only counts when its
      // reading age overlaps the band being recommended for.
      if (band) {
        const range = ages(book)
        if (!range || range[1] < band[0] || range[0] > band[1]) continue
      }

      seen.add(book.id)
      out.push({ book, genre: genre.name, factor })
    }
  }

  return out
}

/**
 * The five titles a report shows, drawn across the top three types so no one
 * type takes the whole list, and cycling on `page` so Refresh hands back a
 * different five rather than reshuffling the same ones.
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
