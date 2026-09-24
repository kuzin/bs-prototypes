// ─── Benny's Book Quiz ────────────────────────────────────────────────────────
//
// An RMI-shaped survey whose answer is books rather than a motivation type.
// The RMI asks twenty questions to find *why* a reader reads; this asks eight,
// of several kinds, to find *what* they'd pick up next — and every step is read
// against the catalog's own fields (genres, `similar`, formats, page count), so
// what comes back is a ranking of real titles, not a persona.
//
// The steps are deliberately different from each other, because a child answers
// a picture faster than a question and a story faster than a list of genres:
//   kinds   — picture cards, pick as many as you like
//   pair    — this or that, twice
//   story   — which opening would you keep reading?
//   picks   — tap the covers you'd open
//   format  — how do you like to read?
//   length  — how long should a book be?

import { BOOKS, getBook, rowEnabled } from './data'

/* The picture answers are Icons8 "Color" icons — full-colour art, not glyphs —
   saved into `public/icons8-color/` under their Icons8 names (fetched from
   img.icons8.com/color/<size>/<name>.png — 144, or 192 for the this-or-that
   pictures, which show bigger). */
export const colorIcon = (name) => `${import.meta.env.BASE_URL}icons8-color/${name}.png`

/* The quiz's calling card — five of its own pictures, as stickers on the
   Discover banner and on the quiz's first screen (`QuizStickers`). */
export const QUIZ_STICKERS = ['unicorn', 'detective', 'fox', 'wizard', 'treasure-map']

/* What kinds of stories, each with a picture and a bright colour of its own.
   It's a picture question for kids, and the colour is half of what tells
   eight cards apart before a word is read. */
export const KINDS = [
  {
    id: 'funny',
    label: 'Funny',
    art: 'lol',
    color: '#F59E0B',
    genres: ['Humor', 'Graphic Novel'],
  },
  { id: 'mystery', label: 'Mystery', art: 'detective', color: '#8B5CF6', genres: ['Mystery'] },
  {
    id: 'adventure',
    label: 'Adventure',
    art: 'treasure-map',
    color: '#10B981',
    genres: ['Adventure', 'Survival'],
  },
  {
    id: 'magic',
    label: 'Magic & other worlds',
    art: 'wizard',
    color: '#D946EF',
    genres: ['Fantasy', 'Sci-Fi', 'Dystopian'],
  },
  { id: 'animals', label: 'Animals', art: 'fox', color: '#65A30D', genres: ['Animals'] },
  {
    id: 'reallife',
    label: 'Kids like me',
    art: 'children',
    color: '#F43F5E',
    genres: ['Realistic Fiction', 'Novel in Verse'],
  },
  {
    id: 'comics',
    label: 'Comics',
    art: 'comic-book',
    color: '#06B6D4',
    genres: ['Graphic Novel'],
  },
  {
    id: 'true',
    label: 'True stories',
    art: 'globe',
    color: '#F97316',
    genres: ['Memoir', 'Nonfiction', 'Historical', 'Sports', 'Science'],
  },
]

/* This or that. Each side leans the ranking toward a set of genres, and wears
   its own colour and picture the way the kinds of story do. */
export const PAIRS = [
  {
    id: 'feel',
    question: 'Would you rather…',
    options: [
      {
        id: 'laugh',
        label: 'Laugh out loud',
        art: 'smiling',
        color: '#F59E0B',
        genres: ['Humor', 'Graphic Novel'],
        reason: 'Great for laughing out loud',
      },
      {
        id: 'goosebumps',
        label: 'Get goosebumps',
        art: 'surprised',
        color: '#8B5CF6',
        genres: ['Mystery', 'Adventure', 'Survival', 'Dystopian'],
        reason: 'Great for edge-of-your-seat reading',
      },
    ],
  },
  {
    id: 'world',
    question: 'Would you rather…',
    options: [
      {
        id: 'real',
        label: 'Stay in the real world',
        art: 'neighborhood',
        color: '#10B981',
        genres: ['Realistic Fiction', 'Memoir', 'Historical', 'Sports', 'Novel in Verse'],
        reason: 'Set in the real world, the way you like',
      },
      {
        id: 'madeup',
        label: 'Visit a made-up world',
        art: 'unicorn',
        color: '#D946EF',
        genres: ['Fantasy', 'Sci-Fi', 'Dystopian'],
        reason: 'Takes you somewhere made-up',
      },
    ],
  },
]

/* Four openings, each written for the quiz (none is quoted from a book), each
   a doorway into a kind of story — and each in that kind's colour from the
   first step, with a picture of the thing the story starts with. */
export const STORIES = [
  {
    id: 'locker',
    short: 'note-on-the-locker',
    art: 'note',
    color: '#8B5CF6',
    text: 'The note taped to my locker said only: DON’T OPEN THE BLUE DOOR. There is no blue door in our school. At least, there wasn’t yesterday.',
    genres: ['Mystery'],
  },
  {
    id: 'frog',
    short: 'frog-in-the-box',
    art: 'frog',
    color: '#F59E0B',
    text: 'My little brother swapped my science project for his pet frog. The judges are about to open the box. The frog is not a volcano.',
    genres: ['Humor', 'Realistic Fiction'],
  },
  {
    id: 'shadow',
    short: 'talking-shadow',
    art: 'ghost',
    color: '#D946EF',
    text: 'On my eleventh birthday my shadow stood up, stretched, and told me we were late for something very important.',
    genres: ['Fantasy', 'Sci-Fi'],
  },
  {
    id: 'river',
    short: 'rising-river',
    art: 'storm',
    color: '#10B981',
    text: 'The storm took the bridge in the night. By morning the only way home was across the river — and the river was still rising.',
    genres: ['Adventure', 'Survival', 'Animals'],
  },
]

/* How a reader likes to read. `format` is a way in the catalog lists; comics
   is a genre rather than a format, so it reads the genre instead. */
export const READ_WAYS = [
  { id: 'print', label: 'A paper book', art: 'open-book', color: '#F97316', format: 'print' },
  { id: 'ebook', label: 'On a screen', art: 'kindle', color: '#3B82F6', format: 'ebook' },
  {
    id: 'audiobook',
    label: 'Listening along',
    art: 'headphones',
    color: '#8B5CF6',
    format: 'audiobook',
  },
  {
    id: 'comics',
    label: 'Comics & pictures',
    art: 'comic-book',
    color: '#06B6D4',
    genre: 'Graphic Novel',
  },
]

/* How long — one book, two, a shelf of them: the answer drawn. */
export const LENGTHS = [
  {
    id: 'quick',
    label: 'Quick reads',
    sub: 'Done in a few days',
    art: 'book',
    color: '#F59E0B',
    max: 220,
    reason: 'a quick read',
    summary: 'quick reads',
  },
  {
    id: 'middle',
    label: 'Just right',
    sub: 'A week or two',
    art: 'books',
    color: '#10B981',
    min: 221,
    max: 320,
    reason: 'just the right length',
    summary: 'not too long, not too short',
  },
  {
    id: 'long',
    label: 'Big, long books',
    sub: 'Get lost for weeks',
    art: 'book-shelf',
    color: '#8B5CF6',
    min: 321,
    reason: 'a big read',
    summary: 'big, long books',
  },
]

const isMagazine = (b) => b.formats.includes('magazine') && !b.formats.includes('print')
const has = (b, genres) => b.genres.some((g) => genres.includes(g))

/**
 * The covers the "tap the ones you'd open" step shows: one book per kind of
 * story, then more until there are twelve, skipping what the reader has
 * already finished — a quiz that offers a book you've read learns nothing.
 */
export function coverChoices(shelf = {}, count = 12) {
  const pool = BOOKS.filter((b) => !isMagazine(b) && shelf[b.id] !== 'finished')
  const out = []
  for (const k of KINDS) {
    const b = pool.find((x) => has(x, k.genres) && !out.includes(x))
    if (b) out.push(b)
  }
  for (const b of pool) {
    if (out.length >= count) break
    if (!out.includes(b)) out.push(b)
  }
  return out.slice(0, count)
}

/**
 * Every answer, read against every book. A book scores for each thing the
 * reader told us that it matches, and carries the strongest of those as its
 * `reason` — not shown on the results, but there for a surface that wants to
 * say why.
 *
 * `answers` is `{ kinds: id[], feel, world, story, picks: bookId[], ways: id[],
 * length }`; anything left unanswered simply adds nothing.
 */
export function quizRecommendations(answers, { shelf = {}, settings, limit = 10 } = {}) {
  if (!answers) return []
  const kinds = KINDS.filter((k) => answers.kinds?.includes(k.id))
  const tones = PAIRS.map((p) => p.options.find((o) => o.id === answers[p.id])).filter(Boolean)
  const story = STORIES.find((s) => s.id === answers.story)
  const picks = (answers.picks ?? []).map(getBook).filter(Boolean)
  const ways = READ_WAYS.filter((w) => answers.ways?.includes(w.id))
  const length = LENGTHS.find((l) => l.id === answers.length)

  const rows = []
  for (const b of BOOKS) {
    if (isMagazine(b) || shelf[b.id] === 'finished' || answers.picks?.includes(b.id)) continue
    let score = 0
    const why = [] // [weight, sentence]
    for (const p of picks) {
      if (p.similar?.includes(b.id) || b.similar?.includes(p.id)) {
        score += 4
        why.push([4, `Like ${p.title}, which you picked`])
      }
    }
    for (const k of kinds) {
      if (has(b, k.genres)) {
        score += 3
        why.push([3, `Because you like ${k.label.toLowerCase()} books`])
      }
    }
    if (story && has(b, story.genres)) {
      score += 2
      why.push([2, 'Like the story you’d keep reading'])
    }
    for (const t of tones) {
      if (has(b, t.genres)) {
        score += 2
        why.push([2, t.reason])
      }
    }
    // How they read: a way in this site actually offers, not just one the
    // catalog lists — the same switches the shelves obey.
    const offered = new Set(
      (b.availability || []).filter((a) => rowEnabled(a, settings)).map((a) => a.format),
    )
    for (const w of ways) {
      if ((w.format && offered.has(w.format)) || (w.genre && b.genres.includes(w.genre))) {
        score += 1.5
      }
    }
    if (length && b.pageCount >= (length.min ?? 0) && b.pageCount <= (length.max ?? Infinity)) {
      score += 2
      why.push([1, `It’s ${length.reason}`])
    }
    if (score <= 0) continue
    why.sort((x, y) => y[0] - x[0])
    rows.push({ book: b, score, why })
  }
  return rows
    .sort((a, b) => b.score - a.score || b.book.rating - a.book.rating)
    .slice(0, limit)
    .map(({ book, score, why }) => ({ book, score, reason: why[0]?.[1] ?? null }))
}

/** The line a quiz shelf wears on Discover — what the reader told Benny. */
export function quizSummary(answers) {
  if (!answers) return ''
  const kinds = KINDS.filter((k) => answers.kinds?.includes(k.id)).map((k) => k.label.toLowerCase())
  const length = LENGTHS.find((l) => l.id === answers.length)
  const liked =
    kinds.length > 2
      ? `${kinds.slice(0, 2).join(', ')} and more`
      : kinds.length === 2
        ? `${kinds[0]} and ${kinds[1]}`
        : kinds[0]
  return [liked && `You like ${liked} books`, length?.summary].filter(Boolean).join(' · ')
}
