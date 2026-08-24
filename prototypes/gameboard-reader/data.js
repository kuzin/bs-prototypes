// Sample data for the Gameboard Reader View — the reader-facing other half of
// the `gameboard` creator prototype. Where `gameboard` is an admin building the
// board, this is Olivia travelling it: she opens the challenge, logs reading,
// unlocks the next space, and watches the board light up.
//
// Modelled on the Figma "Reader Experience" page (file cvp7KATrNgec74yZ7BB3Wi).
// The reader, the sample titles, and the avatar color are deliberately the same
// ones the `logging-flow` prototype uses — both mock the same Beanstack reader.

import banner from '../gameboard/assets/banners/winter-1.webp'
import boardBg from '../gameboard/assets/gameboard/meadow.webp'

export { banner, boardBg }

// ─── Reader ──────────────────────────────────────────────────────────────────

export const READER = {
  id: 'olivia',
  name: 'Olivia',
  initials: 'OM',
  color: '#F09A77',
}

// ─── The challenge ───────────────────────────────────────────────────────────

export const CHALLENGE = {
  name: 'Bundle Up With Books',
  dates: 'December 15, 2025 - January 15, 2026',
  // Everything on the board is driven off "books finished", so progress is a
  // simple count — the badge at space N unlocks on the Nth finished book.
  booksFinished: 3,
}

// ─── The board ───────────────────────────────────────────────────────────────
// Coordinates are the Figma disc centers, normalized so the top-left disc sits
// at (0, 0). The board renders them as percentages of BOARD_W × BOARD_H, so the
// whole thing scales to any width without re-measuring.

export const BOARD_W = 602
export const BOARD_H = 300

// `at` = books finished required to unlock. START is earned by registering,
// FINISH by clearing the whole board.
export const SPACES = [
  {
    id: 'start',
    kind: 'start',
    label: 'START',
    name: 'Registered',
    requirement: 'Join the challenge',
    color: '#1F2937',
    x: 2,
    y: 0,
  },
  {
    id: 's1',
    num: 1,
    name: '1 Book',
    requirement: 'Read 1 Book',
    at: 1,
    color: '#4BA3E3',
    x: 152,
    y: 0,
  },
  {
    id: 's2',
    num: 2,
    name: '2 Books',
    requirement: 'Read 2 Books',
    at: 2,
    color: '#E8453A',
    reward: true,
    x: 302,
    y: 0,
  },
  {
    id: 's3',
    num: 3,
    name: '3 Books',
    requirement: 'Read 3 Books',
    at: 3,
    color: '#A855F7',
    x: 452,
    y: 0,
  },
  {
    id: 's4',
    num: 4,
    name: '4 Books',
    requirement: 'Read 4 Books',
    at: 4,
    color: '#16A97A',
    x: 602,
    y: 74,
  },
  {
    id: 's5',
    num: 5,
    label: 'HALFWAY',
    name: '5 Books',
    requirement: 'Read 5 Books',
    at: 5,
    color: '#F0A024',
    reward: true,
    x: 452,
    y: 150,
  },
  {
    id: 's6',
    num: 6,
    name: '6 Books',
    requirement: 'Read 6 Books',
    at: 6,
    color: '#0DA7BC',
    x: 302,
    y: 150,
  },
  {
    id: 's7',
    num: 7,
    name: '7 Books',
    requirement: 'Read 7 Books',
    at: 7,
    color: '#E8456B',
    x: 151,
    y: 150,
  },
  {
    id: 's8',
    num: 8,
    name: '8 Books',
    requirement: 'Read 8 Books',
    at: 8,
    color: '#7C5CFA',
    x: 0,
    y: 223,
  },
  {
    id: 's9',
    num: 9,
    name: '9 Books',
    requirement: 'Read 9 Books',
    at: 9,
    color: '#65A30D',
    x: 152,
    y: 300,
  },
  {
    id: 'finish',
    kind: 'finish',
    label: 'FINISH',
    name: 'Completed',
    requirement: 'Finish the whole board',
    at: 10,
    color: '#B45309',
    reward: true,
    x: 302,
    y: 300,
  },
]

// ─── Titles for the log-reading flow ─────────────────────────────────────────
// Open Library cover CDN — `?default=false` 404s on a missing cover so the
// cover tile can fall back to its color gradient.
export const coverUrl = (isbn) =>
  isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false` : null

export const BOOKS = [
  {
    id: 'giants-beware',
    title: 'Giants Beware',
    author: 'Rafael Rosado and Jorge Aguirre',
    isbn: '9781596435827',
    pages: 208,
    cover: ['#8FBF6A', '#E8A23A'],
  },
  {
    id: 'she-gets-the-girl',
    title: 'She Gets the Girl',
    author: 'Rachel Lippincott and Alyson Derrick',
    isbn: '9781665900928',
    pages: 400,
    cover: ['#9DC7F0', '#F4A98B'],
  },
  {
    id: 'rump',
    title: 'Rump',
    author: 'Liesl Shurtliff',
    isbn: '9780307977939',
    pages: 272,
    cover: ['#3B4A3A', '#6E7A53'],
  },
]

export const bookById = (id) => BOOKS.find((b) => b.id === id)

// ─── Board helpers ───────────────────────────────────────────────────────────

// A space is earned once the reader has finished enough books. START is earned
// the moment you join, so it has no threshold.
export const isEarned = (space, booksFinished) =>
  space.kind === 'start' ? true : booksFinished >= space.at

// The space that unlocks next — what the reader is working toward.
export const nextSpace = (booksFinished) =>
  SPACES.find((s) => s.kind !== 'start' && booksFinished < s.at) || null
