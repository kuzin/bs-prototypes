import { useState } from 'react'
import { Img, FilterBar, SelectSheet, StatCard } from '@mobile/components'
import './Highlights.css'

/**
 * `src/screens/Statistics.tsx` — the tab whose route is `statistics` but whose label is
 * "Highlights". That divergence is in the source and is kept rather than tidied.
 *
 * The screen has TWO levels of switching, which is easy to miss:
 *   ToggleTabs            Statistics | Highlights   ← two different screens, not two filters
 *   SegmentedControlTab   Week | Month | YYYY | All Time
 *   SegmentedControlTab   Minutes | Pages | Completed
 *
 * The "Highlights" half is `Peaks` — personal bests, not totals — and it has no controls at all.
 *
 * Both halves render the SAME row: a 24pt icon beside a 12pt UPPERCASE label, then a 41pt bold
 * number with its unit pushed down beside it. Every row is `marginLeft: 32 / marginTop: 48`, so
 * the screen is a long left-aligned column rather than a grid of cards.
 */
const STATISTICS = 'Statistics'
const HIGHLIGHTS = 'Highlights'

/**
 * The two `SegmentedControlTab`s stay segmented controls. They sit either side of the chart and
 * belong to it — you are scrubbing the same data, and a control whose options are all visible at
 * once is what lets you see that Week and Month are peers. The FilterBar above them switches
 * SCREEN, which is a different kind of move and now looks like one.
 */
const TIMEFRAMES = ['Week', 'Month', '2026', 'All Time']
const STAT_TYPES = ['Minutes', 'Pages', 'Completed']
const asItems = (values) => values.map((v) => ({ id: v, label: v }))

/**
 * A pastel per stat, keyed by icon. `MyStats` on Home does the same for its four — the tile colour
 * is what makes a column of stats scannable, because you learn the colour before you read the
 * label. Hardcoded hexes in the source; reproduced as the brand tokens they match.
 */
const TINT = {
  reading_time: 'var(--m-blue-light)',
  titles_completed: 'var(--m-green-light)',
  pages_read: 'var(--m-yellow-light)',
  reading_sessions: 'var(--m-purple-light)',
  days_of_week: 'var(--m-orange-light)',
  time_per_session: 'var(--m-blue-light)',
  pages_per_hour: 'var(--m-yellow-light)',
  pages_per_session: 'var(--m-green-light)',
  current_streak: 'var(--m-red-light)',
  longest_streak: 'var(--m-red-light)',
  longest_title_finished: 'var(--m-denim-light)',
  most_pages_read_in_a_session: 'var(--m-green-light)',
  longest_session: 'var(--m-purple-light)',
}

/** `SegmentedControlTab` — a row of peers, all visible, one active. */
function Segmented({ values, active, onChange, label }) {
  return (
    <div className="m-hl-control-wrap">
      <div className="m-hl-control" role="group" aria-label={label}>
        {values.map((v) => (
          <button
            key={v}
            type="button"
            className={`m-hl-seg${active === v ? ' is-active' : ''}`}
            onClick={() => onChange(v)}
            aria-pressed={active === v}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * The area chart. `svg` sets a 2pt stroke in primaryColor and NO fill, and `start={-7000}` drops
 * the area's baseline far off-screen — so what actually renders is a line, not a filled area.
 * Axes are 10pt grey, and the plot is 200pt tall.
 *
 * `curveMonotoneX` is reproduced rather than approximated: a Catmull-Rom spline would overshoot
 * below zero on the flat stretches this data has, which monotone interpolation exists to prevent.
 */
function monotonePath(points, w, h, maxY) {
  const n = points.length
  if (n === 0) return ''
  const x = (i) => (n === 1 ? w / 2 : (i / (n - 1)) * w)
  const y = (v) => h - (maxY === 0 ? 0 : (v / maxY) * h)
  if (n === 1) return `M ${x(0)} ${y(points[0])}`

  // Fritsch–Carlson tangents, which is what d3's monotoneX computes.
  const dx = [],
    dy = [],
    m = []
  for (let i = 0; i < n - 1; i++) {
    dx.push(x(i + 1) - x(i))
    dy.push(y(points[i + 1]) - y(points[i]))
  }
  const slope = dy.map((d, i) => d / dx[i])
  m.push(slope[0])
  for (let i = 1; i < n - 1; i++) {
    if (slope[i - 1] * slope[i] <= 0) m.push(0)
    else {
      const wa = 2 * dx[i] + dx[i - 1]
      const wb = dx[i] + 2 * dx[i - 1]
      m.push((wa + wb) / (wa / slope[i - 1] + wb / slope[i]))
    }
  }
  m.push(slope[n - 2])

  let d = `M ${x(0)} ${y(points[0])}`
  for (let i = 0; i < n - 1; i++) {
    const x0 = x(i),
      x1 = x(i + 1)
    const y0 = y(points[i]),
      y1 = y(points[i + 1])
    const h3 = (x1 - x0) / 3
    d += ` C ${x0 + h3} ${y0 + m[i] * h3}, ${x1 - h3} ${y1 - m[i + 1] * h3}, ${x1} ${y1}`
  }
  return d
}

function Chart({ graph }) {
  const W = 300
  const H = 160
  const maxY = Math.max(...graph.yLabels)
  return (
    <div className="m-hl-chart" role="img" aria-label="Statistics chart">
      <div className="m-hl-chart-row">
        <div className="m-hl-yaxis">
          {/* Keyed by POSITION, not value: a y-axis repeats values (0, 10, 20, 20…) and an
              x-axis repeats letters — S M T W T F S has two of each of S and T, and the month
              row J F M A M J J A S O N D has three Js. Keying by the label collapses them. */}
          {[...graph.yLabels].reverse().map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
        <svg className="m-hl-plot" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <path
            d={monotonePath(graph.data, W, H, maxY)}
            fill="none"
            stroke="var(--m-accent)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div className="m-hl-xaxis">
        {graph.labels.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </div>
  )
}

export function Highlights({ stats, peaks }) {
  const [tab, setTab] = useState(STATISTICS)
  const [frame, setFrame] = useState('Week')
  const [type, setType] = useState('Minutes')
  const [picker, setPicker] = useState(null)

  const data = stats[frame] ?? stats.Week
  // `section === 2 || section === 3` — TITLES COMPLETED appears only on Year and All Time.
  const showTitles = frame === '2026' || frame === 'All Time'

  return (
    <div className="m-hl">
      {/* DIVERGENCE — the source's ToggleTabs, on the shared FilterBar with the rest of the Log.
          This one switches VIEW rather than picking a value, which is the argument for leaving it
          a toggle; against that, All Titles and Book Talks switch view too, and a reader moving
          between tabs should not have to learn two controls for the same gesture. */}
      <FilterBar label={tab} onPress={() => setPicker('view')} />

      {tab === STATISTICS ? (
        <>
          <Segmented values={TIMEFRAMES} active={frame} onChange={setFrame} label="Timeframe" />
          <Chart graph={data.graph} />
          <Segmented values={STAT_TYPES} active={type} onChange={setType} label="Statistic" />

          <div className="m-hl-rows">
            <StatCard
              icon="reading_time"
              tint={TINT.reading_time}
              title="Reading Time"
              value={data.hours}
              unit="hours"
              value2={data.minutes}
              unit2="minutes"
            />
            {showTitles && (
              <StatCard
                icon="titles_completed"
                tint={TINT.titles_completed}
                title="Titles Completed"
                value={data.titles}
                unit="titles"
              />
            )}
            <StatCard
              icon="pages_read"
              tint={TINT.pages_read}
              title="Pages Read"
              value={data.pages}
              unit="pages"
            />
            <StatCard
              icon="reading_sessions"
              tint={TINT.reading_sessions}
              title="Reading Sessions"
              value={data.sessions}
              unit="sessions"
            />
            <StatCard
              icon="days_of_week"
              tint={TINT.days_of_week}
              title="Days of Reading"
              value={data.days}
              unit="days"
            />
            <StatCard
              icon="time_per_session"
              tint={TINT.time_per_session}
              title="Time / Session"
              value={data.perSession}
              unit="minutes"
            />
            <StatCard
              icon="pages_per_hour"
              tint={TINT.pages_per_hour}
              title="Pages / Hour"
              value={data.pagesPerHour}
              unit="pages"
            />
            <StatCard
              icon="pages_per_session"
              tint={TINT.pages_per_session}
              title="Pages / Session"
              value={data.pagesPerSession}
              unit="pages"
            />
          </div>
        </>
      ) : (
        /* Peaks — personal bests, and no controls of any kind. */
        <div className="m-hl-rows">
          <StatCard
            icon="current_streak"
            tint={TINT.current_streak}
            title="Current Streak"
            value={peaks.currentStreak}
            unit="days"
          />
          <StatCard
            icon="longest_streak"
            tint={TINT.longest_streak}
            title="Longest Streak"
            value={peaks.longestStreak}
            unit="days"
          />
          <StatCard
            icon="longest_title_finished"
            tint={TINT.longest_title_finished}
            title="Longest Title Finished"
            value={peaks.longestTitle}
            unit="pages"
          />
          <StatCard
            icon="most_pages_read_in_a_session"
            tint={TINT.most_pages_read_in_a_session}
            title="Most Pages in a Session"
            value={peaks.mostPages}
            unit="pages"
          />
          <StatCard
            icon="longest_session"
            tint={TINT.longest_session}
            title="Longest Session"
            value={peaks.longestSessionHours}
            unit="hours"
            value2={peaks.longestSessionMinutes}
            unit2="minutes"
          />
        </div>
      )}

      <SelectSheet
        open={picker === 'view'}
        items={asItems([STATISTICS, HIGHLIGHTS])}
        selectedId={tab}
        onSelect={setTab}
        onClose={() => setPicker(null)}
      />
    </div>
  )
}
