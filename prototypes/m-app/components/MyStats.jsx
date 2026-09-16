import { Img, PressableButton } from '@mobile/components'
import './MyStats.css'

/**
 * `src/components/home/MyStats.tsx`.
 *
 * A fixed 489pt card holding four rows — not a three-up strip. Each row is a 48pt rounded icon
 * tile in its own pastel, the stat name, and the value right-aligned. The pastels are hardcoded
 * hexes in the source rather than token references, so they are reproduced as the brand tokens
 * they match.
 */
const STATS = [
  {
    title: 'Minutes Read',
    key: 'totalMinutes',
    tint: 'var(--m-blue-light)',
    img: 'minutes_read_v3',
  },
  { title: 'Pages Read', key: 'totalPages', tint: 'var(--m-yellow-light)', img: 'pages_read_v3' },
  {
    title: 'Titles Logged',
    key: 'totalBooks',
    tint: 'var(--m-purple-light)',
    img: 'books_read_v3',
  },
  {
    title: 'Reading Sessions',
    key: 'totalSessions',
    tint: 'var(--m-red-light)',
    img: 'reading_sessions_v3',
  },
]

export function MyStats({ stats, onViewDetailed }) {
  return (
    <section className="m-mystats">
      <h2 className="m-section-head">My Stats</h2>
      <p className="m-t-sub-heading m-mystats-alltime">All Time</p>

      <div className="m-mystats-list">
        {STATS.map((s) => (
          <div key={s.key} className="m-mystats-row">
            <span className="m-mystats-left">
              <span className="m-mystats-tile" style={{ background: s.tint }}>
                <Img name={s.img} size={24} />
              </span>
              <span className="m-t-button m-mystats-title">{s.title}</span>
            </span>
            <span className="m-t-section-title">{stats[s.key]}</span>
          </div>
        ))}
      </div>

      {/* On the shared PressableButton at the medium size, with the other three card CTAs on
          Home. The source gives this one a 56pt height and a 15pt radius of its own — a taller,
          rounder button than the fundraiser's and the motivator card's, for the same kind of
          action. */}
      <PressableButton
        size="medium"
        type="grey"
        fullWidth
        buttonText="View Detailed Statistics"
        onButtonPress={onViewDetailed}
      />
    </section>
  )
}
