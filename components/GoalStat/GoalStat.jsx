import { Icon } from '@components/Icon/Icon'
import { ProgressRing, StatCard } from '@components/Cards/Cards'

import './GoalStat.css'
import '@components/Cards/Cards.css'

/**
 * One tile of an **Overall Progress** strip — the row a challenge and a
 * fundraiser both open with (`programs/_overview_list_goals`,
 * `fundraisers/overview/_overall_progress`).
 *
 * The app has two shapes and this is both, on the design system's own
 * `StatCard` rather than a second stat tile beside it.
 *
 * A **progress** tile (`_progress_card`) has a denominator, so it wears a
 * `ProgressRing` in the icon slot and reads "620 / 1,000". A **total** tile
 * (`_total_card`) has only a count — badges earned, dollars raised — so it
 * takes its own glyph and colour, because a ring around a figure with nothing
 * to reach is a decoration pretending to be data. A finished requirement goes
 * green, ring and figure together.
 *
 * `goal` is `{ label, have, need, value, icon, accent, tab }` — `have`/`need`
 * make it a progress tile, `value` a total. `onClick` sends the reader
 * somewhere, which is what every one of these is in the app: a link to the tab
 * that explains its number.
 *
 *   <GoalStats>
 *     {goals.map((g) => <GoalStat key={g.label} goal={g} onClick={() => setTab(g.tab)} />)}
 *   </GoalStats>
 */
export function GoalStat({ goal: g, onClick }) {
  const ring = g.need != null
  const pct = ring ? Math.min(100, Math.round((g.have / g.need) * 100)) : null
  const done = ring && g.have >= g.need

  return (
    <StatCard
      label={g.label}
      value={ring ? g.have.toLocaleString() : g.value}
      unit={ring ? `/${g.need.toLocaleString()}` : undefined}
      color={done ? '#0F7A55' : ring ? '#1A6DD5' : g.accent}
      icon={ring ? <ProgressRing pct={pct} done={done} /> : <Icon name={g.icon} size={22} />}
      onClick={onClick}
    />
  )
}

/** The strip they sit in — `ul` in the app, and one tile per requirement. */
export function GoalStats({ children, className = '' }) {
  return <div className={`goal-stats ${className}`.trim()}>{children}</div>
}
