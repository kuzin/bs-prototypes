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
  w: 948,
  h: 586,
  radius: 32,
  green: '#C1D35D', // board fill
  cream: '#F6DDB4', // the road, and the ring each badge sits in
  ink: '#CB9E5B', // START / HALFWAY / FINISH lettering, and the locked-badge tint
  road: 31, // road stroke width
  corner: 25, // road corner radius
  ring: 100, // cream disc behind a plain badge
  ringLabelled: 140, // …and behind one carrying a curved word
  art: 80, // the badge art itself
  reward: 28.887, // the reward mark below a badge
  rewardDrop: 37.96, // …how far below the badge center it sits
}

// Three tree clusters, positioned (and clipped) exactly as the Figma places
// them — each as a percentage box over the board.
export const TREES = [
  { art: treesLarge, left: 86.92, top: -21.97, width: 45.52, height: 49.05 },
  { art: treesSmall, left: -20.68, top: 44.12, width: 31.65, height: 34.13 },
  { art: treesSmall, left: 71.1, top: 62.97, width: 31.64, height: 34.13 },
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
    x: 182.1,
    y: 149.5,
  },
  {
    id: 's1',
    num: 1,
    name: '1 Book',
    requirement: 'Read 1 Book',
    at: 1,
    art: art1,
    x: 332.1,
    y: 149.5,
  },
  {
    id: 's2',
    num: 2,
    name: '2 Books',
    requirement: 'Read 2 Books',
    at: 2,
    art: art2,
    reward: true,
    x: 482.1,
    y: 149.5,
  },
  {
    id: 's3',
    num: 3,
    name: '3 Books',
    requirement: 'Read 3 Books',
    at: 3,
    art: art3,
    x: 632.1,
    y: 149.5,
  },
  {
    id: 's4',
    num: 4,
    name: '4 Books',
    requirement: 'Read 4 Books',
    at: 4,
    art: art4,
    x: 782.1,
    y: 224,
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
    x: 632.1,
    y: 299.5,
  },
  {
    id: 's6',
    num: 6,
    name: '6 Books',
    requirement: 'Read 6 Books',
    at: 6,
    art: art6,
    x: 481.7,
    y: 299.5,
  },
  {
    id: 's7',
    num: 7,
    name: '7 Books',
    requirement: 'Read 7 Books',
    at: 7,
    art: art7,
    x: 331.3,
    y: 299.5,
  },
  {
    id: 's8',
    num: 8,
    name: '8 Books',
    requirement: 'Read 8 Books',
    at: 8,
    art: art8,
    x: 179.9,
    y: 372.1,
  },
  {
    id: 's9',
    num: 9,
    name: '9 Books',
    requirement: 'Read 9 Books',
    at: 9,
    art: art9,
    x: 332.1,
    y: 449.5,
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
    x: 482.1,
    y: 449.5,
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
 * The road, as the Figma draws it: an orthogonal run through every space with
 * rounded corners, not a straight line between centers. Consecutive spaces
 * share a row or a column except at the two turns, where the path keeps its
 * current heading to the corner and then breaks — which is what puts spaces 4
 * and 8 on the vertical legs.
 */
export function roadPath(spaces = SPACES, r = BOARD.corner) {
  const pts = spaces.map((s) => ({ x: s.x, y: s.y }))
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
