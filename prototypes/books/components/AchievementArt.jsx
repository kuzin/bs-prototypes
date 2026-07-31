// Illustrated circular achievement medallions. These are drawn graphics, not
// glyph icons, so they're inline SVG per the repo's icon rules — each is a small
// scene inside a 64×64 disc, in the Beanstack badge-art idiom.

// The disc is clipped by CSS `border-radius` on .bk-ach-art, so no SVG clipPath
// (and no generated ids to collide) is needed.
function Disc({ from, to, children }) {
  return (
    <svg viewBox="0 0 64 64" className="bk-ach-art" aria-hidden="true">
      <rect width="64" height="64" fill={from} />
      <path d="M0 40 Q32 24 64 40 L64 64 L0 64 Z" fill={to} />
      {children}
    </svg>
  )
}

// A stack of books on a shelf.
function BooksArt() {
  return (
    <Disc from="#3B2A6B" to="#241a45">
      <circle cx="47" cy="16" r="7" fill="#FDE68A" opacity="0.9" />
      <rect x="15" y="40" width="34" height="5" rx="1.5" fill="#F59E0B" />
      <rect x="17" y="32" width="30" height="8" rx="1.5" fill="#34D399" />
      <rect x="20" y="24" width="24" height="8" rx="1.5" fill="#60A5FA" />
      <rect x="23" y="18" width="18" height="6" rx="1.5" fill="#F87171" />
    </Disc>
  )
}

// A flame on a calendar-ish base — logging day after day.
function StreakArt() {
  return (
    <Disc from="#7C2D12" to="#431407">
      <path
        d="M32 14c5 6 9 9 9 16a9 9 0 0 1-18 0c0-4 2-6 4-9 1 3 3 4 4 2 1-3-1-6 1-9z"
        fill="#FB923C"
      />
      <path d="M32 26c2 3 4 5 4 8a4 4 0 0 1-8 0c0-3 2-5 4-8z" fill="#FDE68A" />
      <rect x="18" y="46" width="28" height="8" rx="2" fill="#FED7AA" opacity="0.85" />
      <rect x="22" y="49" width="4" height="2" rx="1" fill="#9A3412" />
      <rect x="30" y="49" width="4" height="2" rx="1" fill="#9A3412" />
      <rect x="38" y="49" width="4" height="2" rx="1" fill="#9A3412" />
    </Disc>
  )
}

// Stars + a speech bubble — writing reviews.
function ReviewsArt() {
  return (
    <Disc from="#0E7490" to="#083344">
      <path
        d="M16 20h32a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H30l-8 7v-7h-6a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4z"
        fill="#E0F2FE"
      />
      <g fill="#F59E0B">
        <path d="M23 28l1.4 3 3.2.4-2.3 2.2.6 3.1-2.9-1.6-2.9 1.6.6-3.1-2.3-2.2 3.2-.4z" />
        <path d="M32 28l1.4 3 3.2.4-2.3 2.2.6 3.1-2.9-1.6-2.9 1.6.6-3.1-2.3-2.2 3.2-.4z" />
        <path d="M41 28l1.4 3 3.2.4-2.3 2.2.6 3.1-2.9-1.6-2.9 1.6.6-3.1-2.3-2.2 3.2-.4z" />
      </g>
    </Disc>
  )
}

// Three linked rings — finishing a whole series.
function SeriesArt() {
  return (
    <Disc from="#4C1D95" to="#2E1065">
      <circle cx="22" cy="32" r="9" fill="none" stroke="#C4B5FD" strokeWidth="4" />
      <circle cx="32" cy="32" r="9" fill="none" stroke="#A78BFA" strokeWidth="4" />
      <circle cx="42" cy="32" r="9" fill="none" stroke="#DDD6FE" strokeWidth="4" />
      <circle cx="52" cy="14" r="3" fill="#FDE68A" />
    </Disc>
  )
}

// A trophy — top of the board.
function TopArt() {
  return (
    <Disc from="#78350F" to="#451a03">
      <path d="M22 16h20v8a10 10 0 0 1-20 0z" fill="#FBBF24" />
      <path d="M22 18h-5a6 6 0 0 0 6 6zM42 18h5a6 6 0 0 1-6 6z" fill="#F59E0B" />
      <rect x="29" y="34" width="6" height="8" fill="#F59E0B" />
      <rect x="23" y="42" width="18" height="5" rx="1.5" fill="#FBBF24" />
      <circle cx="32" cy="24" r="3" fill="#FEF3C7" opacity="0.8" />
    </Disc>
  )
}

// A bubbling flask — hands-on experiments.
function ScienceArt() {
  return (
    <Disc from="#1E3A8A" to="#172554">
      <path d="M28 16h8v12l8 16a4 4 0 0 1-3.6 5.6H23.6A4 4 0 0 1 20 44l8-16z" fill="#BFDBFE" />
      <path d="M24.5 38h15l3 6a2 2 0 0 1-1.8 2.8H23.3A2 2 0 0 1 21.5 44z" fill="#22D3EE" />
      <circle cx="30" cy="43" r="1.6" fill="#ECFEFF" />
      <circle cx="35" cy="41" r="1.2" fill="#ECFEFF" />
      <circle cx="44" cy="18" r="2.5" fill="#FDE68A" />
      <circle cx="49" cy="25" r="1.6" fill="#FDE68A" opacity="0.8" />
    </Disc>
  )
}

// A rolled magazine / newspaper — every issue read.
function MagazineArt() {
  return (
    <Disc from="#7F1D1D" to="#450a0a">
      <rect x="16" y="18" width="30" height="30" rx="2" fill="#FEE2E2" />
      <rect x="44" y="20" width="6" height="28" rx="3" fill="#FCA5A5" />
      <rect x="20" y="23" width="22" height="5" rx="1" fill="#DC2626" />
      <g fill="#B91C1C" opacity="0.65">
        <rect x="20" y="32" width="22" height="2" rx="1" />
        <rect x="20" y="37" width="22" height="2" rx="1" />
        <rect x="20" y="42" width="14" height="2" rx="1" />
      </g>
    </Disc>
  )
}

const ART = {
  books: BooksArt,
  streak: StreakArt,
  reviews: ReviewsArt,
  series: SeriesArt,
  top: TopArt,
  science: ScienceArt,
  magazine: MagazineArt,
}

export function AchievementArt({ art = 'books' }) {
  const Art = ART[art] || BooksArt
  return <Art />
}
