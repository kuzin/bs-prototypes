import { Icon } from '@components/Icon/Icon'
import { StatCard } from '@components/Cards/Cards'

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
 * A **progress** tile (`_progress_card`) has a denominator, so it reads
 * "620 / 1,000" with StatCard's own progress bar under the label — the same
 * tile Discover's "Pages read" is, at the tile's full width rather than as a
 * ring squeezed into the icon slot. A **total** tile (`_total_card`) has only a
 * count — badges earned, dollars raised — so it takes its own glyph and
 * colour instead. A finished requirement goes green, bar and figure together.
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
  const progress = g.need != null
  const done = progress && g.have >= g.need

  return (
    <StatCard
      label={g.label}
      value={progress ? g.have.toLocaleString() : g.value}
      unit={progress ? `/${g.need.toLocaleString()}` : undefined}
      color={done ? '#0F7A55' : progress ? '#1A6DD5' : g.accent}
      icon={progress ? undefined : <Icon name={g.icon} size={22} />}
      progress={progress ? { value: g.have, max: g.need } : undefined}
      onClick={onClick}
    />
  )
}

/** The strip they sit in — `ul` in the app, and one tile per requirement. */
export function GoalStats({ children, className = '' }) {
  return <div className={`goal-stats ${className}`.trim()}>{children}</div>
}
