// Sample data for the Gameboard Reader View — the reader-facing other half of
// the `gameboard` creator prototype. Where `gameboard` is an admin building the
// board, this is Olivia travelling it: she opens the challenge, logs reading,
// unlocks the next space, and watches the board light up.
//
// Modelled on the Figma "Reader Experience" page (file cvp7KATrNgec74yZ7BB3Wi).
// The board geometry, palette, badge art, trees, and reward marks below are the
// real exported design — see BOARD and SPACES.
//
// The reader, the sample titles, and the avatar color are deliberately the same
// ones the `logging-flow` prototype uses — both mock the same Beanstack reader.

import banner from './assets/banner.png'
import heroWave from './assets/hero-wave.svg'

import artStart from './assets/badge-start.png'
import art1 from './assets/badge-1.png'
import art2 from './assets/badge-2.png'
import art3 from './assets/badge-3.png'
import art4 from './assets/badge-4.png'
import art5 from './assets/badge-5.png'
import art6 from './assets/badge-6.png'
import art7 from './assets/badge-7.png'
import art8 from './assets/badge-8.png'
import art9 from './assets/badge-9.png'
import artFinish from './assets/badge-finish.png'

import actArtCocoa from '../gameboard/assets/theme-badges/winter-2.webp'
import actArtScarf from '../gameboard/assets/theme-badges/winter-5.webp'
import actArtSnow from '../gameboard/assets/theme-badges/winter-7.webp'

import treesLarge from './assets/trees.svg'
import treesSmall from './assets/trees-sm.svg'
import rewardMark from './assets/reward.svg'
import rewardMarkFinish from './assets/reward-finish.svg'

export { banner, heroWave, treesLarge, treesSmall, rewardMark, rewardMarkFinish }

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
// Every number here is lifted from the Figma board frame (node 173:4460), which
// is 948 × 586. Spaces carry their pixel center in that space and the renderer
// converts to percentages, so the board scales to any width untouched.

export const BOARD = {
  radius: 32,
  cell: 150, // spacing between spaces, along a row and between rows
  padLeft: 182.1, // the first column's center, from the board's left edge
  padRight: 165.9, // …and the gap after the last column
  padTop: 149.5, // the first row's center, from the top
  padBottom: 136.5, // …and the gap under the last row
  minCols: 3, // narrow enough and the board is a near-vertical zigzag
  maxCols: 5, // the Figma's own board
  minScale: 0.62, // how far a layout may shrink before dropping a column
  space: 140, // a space's full ring slot
  green: '#C1D35D', // board fill
  cream: '#F6DDB4', // the road, and the ring each badge sits in
  ink: '#CB9E5B', // START / HALFWAY / FINISH lettering, and the locked-badge tint
  road: 31, // road stroke width
  corner: 25, // road corner radius
}
// The pieces of a space — its ring, its art, its reward mark — are sized in CSS
// as percentages of the 140px ring slot, so their Figma pixel values live in the
// comments next to those rules rather than as constants nothing here reads.

// Three tree clusters, at the Figma's own sizes and offsets — but anchored to a
// corner rather than to a fixed percentage, so they stay in the corners
// whatever shape the board reflows to. `dx`/`dy` are board pixels from that
// corner; a negative dx on a right anchor pulls the cluster back inside.
export const TREES = [
  { art: treesLarge, anchor: 'top-right', dx: -124, dy: -128.7, w: 431.5, h: 287.5 },
  { art: treesSmall, anchor: 'left', dx: -196, dy: 0.441, w: 300, h: 200 },
  { art: treesSmall, anchor: 'bottom-right', dx: -274, dy: -217, w: 300, h: 200 },
]

// `at` = books finished required to unlock. START is earned by registering,
// FINISH by clearing the whole board. `label` gives the space a curved word and
// the wider cream ring that goes with it.
export const SPACES = [
  {
    id: 'start',
    kind: 'start',
    label: 'START',
    labelBelow: true,
    name: 'Registered',
    requirement: 'Join the challenge',
    art: artStart,
  },
  {
    id: 's1',
    num: 1,
    name: '1 Book',
    requirement: 'Read 1 Book',
    at: 1,
    art: art1,
  },
  {
    id: 's2',
    num: 2,
    name: '2 Books',
    requirement: 'Read 2 Books',
    at: 2,
    art: art2,
    reward: true,
  },
  {
    id: 's3',
    num: 3,
    name: '3 Books',
    requirement: 'Read 3 Books',
    at: 3,
    art: art3,
  },
  {
    id: 's4',
    num: 4,
    name: '4 Books',
    requirement: 'Read 4 Books',
    at: 4,
    art: art4,
  },
  {
    id: 's5',
    num: 5,
    label: 'HALFWAY',
    name: '5 Books',
    requirement: 'Read 5 Books',
    at: 5,
    art: art5,
    reward: true,
  },
  {
    id: 's6',
    num: 6,
    name: '6 Books',
    requirement: 'Read 6 Books',
    at: 6,
    art: art6,
  },
  {
    id: 's7',
    num: 7,
    name: '7 Books',
    requirement: 'Read 7 Books',
    at: 7,
    art: art7,
  },
  {
    id: 's8',
    num: 8,
    name: '8 Books',
    requirement: 'Read 8 Books',
    at: 8,
    art: art8,
  },
  {
    id: 's9',
    num: 9,
    name: '9 Books',
    requirement: 'Read 9 Books',
    at: 9,
    art: art9,
  },
  {
    id: 'finish',
    kind: 'finish',
    label: 'FINISH',
    name: 'Completed',
    requirement: 'Finish the whole board',
    at: 10,
    art: artFinish,
    reward: 'finish',
  },
]

// ─── Activity badges ─────────────────────────────────────────────────────────
// The creator (see the `gameboard` prototype) models an activity badge as a
// title, its art, and one or more activities the reader has to complete to earn
// it. Activity badges deliberately never sit on the board — the creator's tray
// says as much — so this is the only place a reader meets them.

// Reader-facing labels + glyphs for the creator's activity types.
export const ACTIVITY_TYPES = {
  activity: { label: 'Activity', icon: 'link' },
  video: { label: 'Watch a video', icon: 'play-filled' },
  listen: { label: 'Listen', icon: 'headphones' },
  quiz: { label: 'Take a quiz', icon: 'clipboard-check' },
  survey: { label: 'Survey', icon: 'clipboard-list' },
  event: { label: 'Attend an event', icon: 'calendar-event' },
  social: { label: 'Share on social', icon: 'share' },
  review: { label: 'Write a review', icon: 'writing' },
  checkin: { label: 'Check in', icon: 'qrcode' },
  code: { label: 'Activity code', icon: 'ticket' },
  photo: { label: 'Photo upload', icon: 'photo' },
  upload: { label: 'Upload a file', icon: 'upload' },
  textbox: { label: 'Text box', icon: 'file-text' },
}

export const activityType = (t) => ACTIVITY_TYPES[t] || ACTIVITY_TYPES.activity

export const ACTIVITY_BADGES = [
  {
    id: 'ab-cozy',
    name: 'Cozy Corner',
    art: actArtCocoa,
    requirement: 'Complete 2 activities',
    activities: [
      {
        id: 'ac-checkin',
        type: 'checkin',
        title: 'Visit the library',
        description: 'Scan the QR code at the front desk next time you stop by.',
      },
      {
        id: 'ac-photo',
        type: 'photo',
        title: 'Show us your reading nook',
        description: 'Upload a photo of the spot where you curl up with a book.',
      },
    ],
  },
  {
    id: 'ab-storytime',
    name: 'Winter Story Time',
    art: actArtScarf,
    requirement: 'Complete 2 activities',
    activities: [
      {
        id: 'ac-event',
        type: 'event',
        title: 'Come to Winter Story Time',
        description: 'Thursdays at 4pm in the community room.',
      },
      {
        id: 'ac-video',
        type: 'video',
        title: 'Watch the booktalk',
        description: 'Two minutes on why Giants Beware is worth your winter break.',
      },
    ],
  },
  {
    id: 'ab-share',
    name: 'Share the Warmth',
    art: actArtSnow,
    requirement: 'Complete 3 activities',
    activities: [
      {
        id: 'ac-review',
        type: 'review',
        title: 'Review a book you finished',
        description: 'A couple of sentences is plenty.',
      },
      {
        id: 'ac-quiz',
        type: 'quiz',
        title: 'Take the winter reading quiz',
        description: 'Ten questions about the titles on this challenge.',
      },
      {
        id: 'ac-social',
        type: 'social',
        title: 'Tell a friend',
        description: 'Share the challenge with #BundleUpWithBooks.',
      },
    ],
  },
]

// An activity badge is earned once every one of its activities is done.
export const activityBadgeEarned = (badge, done) =>
  badge.activities.every((a) => done.includes(a.id))

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

// ─── Board helpers ───────────────────────────────────────────────────────────

// A space is earned once the reader has finished enough books. START is earned
// the moment you join, so it has no threshold.
export const isEarned = (space, booksFinished) =>
  space.kind === 'start' ? true : booksFinished >= space.at

// The space that unlocks next — what the reader is working toward.
export const nextSpace = (booksFinished) =>
  SPACES.find((s) => s.kind !== 'start' && booksFinished < s.at) || null

/**
 * Lay the spaces out over `cols` columns and report the board they need.
 *
 * The route runs the way the Figma draws it: a row of spaces left to right, one
 * space sitting out on the turn at the edge column half a row down, then the
 * next row back the other way, and so on. Rows after the first stop one column
 * short at each end, because those columns belong to the turns.
 *
 * At five columns this reproduces the Figma board almost to the pixel; at fewer
 * it reflows to a narrower, taller board rather than shrinking the same shape
 * past reading. Everything downstream is expressed against the `w` / `h` this
 * returns, so the board scales to its container from there.
 */
export function layoutBoard(spaces = SPACES, cols = BOARD.maxCols) {
  const { cell, padLeft, padRight, padTop, padBottom } = BOARD
  const n = Math.max(BOARD.minCols, cols)
  const colX = (c) => padLeft + c * cell
  const points = []

  let i = 0
  let row = 0
  let dir = 1 // 1 = this row runs left to right
  // The first row gets the full width; later ones start beside the turn above.
  let from = 0
  let to = n - 2

  while (i < spaces.length) {
    for (let c = from; dir > 0 ? c <= to : c >= to; c += dir) {
      if (i >= spaces.length) break
      points.push({ space: spaces[i++], x: colX(c), y: padTop + row * cell })
    }
    if (i >= spaces.length) break

    // The turn: out at the edge column, half a row down.
    points.push({
      space: spaces[i++],
      x: colX(dir > 0 ? n - 1 : 0),
      y: padTop + row * cell + cell / 2,
    })
    if (i >= spaces.length) break

    row += 1
    dir = -dir
    from = dir > 0 ? 1 : n - 2
    to = dir > 0 ? n - 2 : 1
  }

  return {
    points,
    cols: n,
    w: padLeft + (n - 1) * cell + padRight,
    h: Math.max(...points.map((p) => p.y)) + padBottom,
  }
}

// The board a given column count needs, before any scaling.
export const boardWidth = (cols) => BOARD.padLeft + (cols - 1) * BOARD.cell + BOARD.padRight

/**
 * How many columns to lay out in a container of `width`.
 *
 * Not "how many fit at full size" — a board is happy to scale down, and keeping
 * the Figma's five-column shape at 74% beats dropping to three and stretching
 * it. So this takes the most columns that still clear `minScale`, and only
 * sheds one when even that would leave the badges too small.
 */
export function colsForWidth(width) {
  if (!width) return BOARD.maxCols
  for (let c = BOARD.maxCols; c > BOARD.minCols; c--) {
    if (boardWidth(c) * BOARD.minScale <= width) return c
  }
  return BOARD.minCols
}

/**
 * The road, as the Figma draws it: an orthogonal run through every space with
 * rounded corners, not a straight line between centers. Consecutive spaces
 * share a row or a column except at the turns, where the path keeps its current
 * heading to the corner and then breaks.
 */
export function roadPath(points, r = BOARD.corner) {
  const pts = points.map((p) => ({ x: p.x, y: p.y }))
  let d = `M ${pts[0].x} ${pts[0].y}`
  // Track heading so a diagonal step becomes "carry on, then turn".
  let horizontal = true

  for (let i = 1; i < pts.length; i++) {
    const from = pts[i - 1]
    const to = pts[i]
    const dx = to.x - from.x
    const dy = to.y - from.y

    if (Math.abs(dx) < 0.5 || Math.abs(dy) < 0.5) {
      d += ` L ${to.x} ${to.y}`
      if (Math.abs(dx) >= 0.5) horizontal = true
      else if (Math.abs(dy) >= 0.5) horizontal = false
      continue
    }

    // A corner: run to the elbow, round it, then run on.
    const sx = Math.sign(dx)
    const sy = Math.sign(dy)
    const elbow = horizontal ? { x: to.x, y: from.y } : { x: from.x, y: to.y }
    if (horizontal) {
      d += ` L ${elbow.x - sx * r} ${elbow.y}`
      d += ` Q ${elbow.x} ${elbow.y} ${elbow.x} ${elbow.y + sy * r}`
      d += ` L ${to.x} ${to.y}`
    } else {
      d += ` L ${elbow.x} ${elbow.y - sy * r}`
      d += ` Q ${elbow.x} ${elbow.y} ${elbow.x + sx * r} ${elbow.y}`
      d += ` L ${to.x} ${to.y}`
    }
    horizontal = !horizontal
  }
  return d
}
