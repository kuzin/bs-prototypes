import './GoalTile.css'

/**
 * One tile of an "Overall Progress" strip: how far along one requirement is.
 *
 * The app has two of these and this is both. A **progress** tile
 * (`fundraisers/overview/_progress_card`, `programs/_overview_list_goals`) has
 * a denominator, so it draws a ring around the share completed and reads
 * "180 / 300"; a **total** tile (`_total_card`) has only a number — dollars
 * raised, badges earned — so it shows the number and no ring, because a ring
 * around a figure with nothing to reach is a decoration pretending to be data.
 *
 *   <GoalTile label="Minutes Logged" have={180} need={300} />
 *   <GoalTile label="Total Raised" value="$420" icon={<Icon name="coin" />} />
 *
 * `accent` colours the ring and the icon; done tiles go green on their own.
 */
export function GoalTile({ label, have, need, value, icon, accent, as: Tag = 'li', onClick }) {
  const ring = need != null
  const pct = ring ? Math.min(100, Math.round((have / need) * 100)) : null
  const done = ring && have >= need
  const style = accent ? { '--goal-accent': accent } : undefined

  const body = (
    <>
      {ring ? (
        <div className="goal-ring">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle className="goal-track" cx="50" cy="50" r="44" />
            <circle
              className="goal-fill"
              cx="50"
              cy="50"
              r="44"
              pathLength="100"
              strokeDasharray={`${pct} 100`}
            />
          </svg>
          <span className="goal-pct">{pct}%</span>
        </div>
      ) : (
        icon && (
          <span className="goal-icon" aria-hidden="true">
            {icon}
          </span>
        )
      )}
      <div className="goal-copy">
        <span className="goal-label">{label}</span>
        <span className="goal-num">
          {ring ? (
            <>
              {have.toLocaleString()}
              <em>/{need.toLocaleString()}</em>
            </>
          ) : (
            value
          )}
        </span>
      </div>
    </>
  )

  const cls = `goal-tile${done ? ' is-done' : ''}${ring ? '' : ' goal-tile--total'}`

  return (
    <Tag className={cls} style={style}>
      {onClick ? (
        <button type="button" className="goal-hit" onClick={onClick}>
          {body}
        </button>
      ) : (
        body
      )}
    </Tag>
  )
}

/** The strip they sit in — `ul` in the app, and one per requirement. */
export function GoalTiles({ children, className = '' }) {
  return <ul className={`goal-tiles ${className}`.trim()}>{children}</ul>
}
