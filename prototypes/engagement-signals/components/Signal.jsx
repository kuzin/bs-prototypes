// The signal's vocabulary — the pieces every surface draws it with, so the
// class table and the profile page can't drift apart. One pill, one trajectory
// strip, one driver row.
import { Icon } from '@components/Icon/Icon'
import { TrendChip } from '@components/TrendChip/TrendChip'
import { Tooltip } from '@components/Primitives/Primitives'
import '@components/TrendChip/TrendChip.css'
import '@components/Primitives/Primitives.css'

import { SIGNALS, DRIVERS, SITE } from '../data'
import './Signal.css'

// Benny's prose carries `**…**` around the figures a teacher is scanning for.
// Same helper the Student Profile uses on its own summaries, kept in step so
// the two paragraphs on the page emphasise identically.
export function emphasize(text) {
  if (typeof text !== 'string' || !text.includes('**')) return text
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))
}

/**
 * The signal itself. `size="lg"` is the profile page's headline; the default is
 * the table cell and the Overview card.
 *
 *   <SignalPill signal="declining" />
 *   <SignalPill signal="increasing" size="lg" />
 */
export function SignalPill({ signal, size = 'md', className = '' }) {
  const s = SIGNALS[signal]
  if (!s) return null
  return (
    <span
      className={`es-pill es-pill--${size} ${className}`.trim()}
      style={{ '--es-c': s.color, '--es-bg': s.bg }}
    >
      <Icon name={s.icon} size={size === 'lg' ? 18 : 14} stroke={2.6} />
      {s.label}
    </span>
  )
}

/**
 * The signal, month by month. Categorical rather than a line: there is no
 * score underneath to draw, and the question it answers is "is this new?" —
 * which a run of six labelled cells answers better than a trend line would.
 */
export function SignalTrajectory({ trajectory }) {
  return (
    <div className="es-traj" role="img" aria-label="Signal by month, oldest first">
      {trajectory.map((p) => {
        const s = SIGNALS[p.signal]
        return (
          <Tooltip key={p.label} content={`${p.label} — ${s.label}`} className="es-traj-tip">
            <div className={`es-traj-cell${p.current ? ' es-traj-cell--now' : ''}`}>
              <span
                className="es-traj-bar"
                style={{ '--es-c': s.color, '--es-bg': s.bg }}
                aria-hidden="true"
              >
                <Icon name={s.icon} size={13} stroke={2.8} />
              </span>
              <span className="es-traj-label">{p.label}</span>
            </div>
          </Tooltip>
        )
      })}
    </div>
  )
}

// What the driver did to this reading. `lead` is the ticket's "what is driving
// the signal"; `counter` is the part that argues the other way, which a
// teacher needs more than a tidy story does.
const WEIGHTS = {
  lead: { label: 'Driving the signal', cls: 'es-weight--lead' },
  counter: { label: 'Points the other way', cls: 'es-weight--counter' },
}

/** One input, and what it contributed. */
export function DriverRow({ driver, data }) {
  const weight = data ? WEIGHTS[data.weight] : null
  // A driver with nothing behind it is still shown — greyed, and saying why.
  // Dropping the row would leave a teacher guessing whether it was considered.
  const off = !data

  return (
    <div className={`es-driver${off ? ' es-driver--off' : ''}`}>
      <span className="es-driver-icon" style={{ '--es-c': driver.color }} aria-hidden="true">
        <Icon name={driver.icon} size={17} />
      </span>

      <div className="es-driver-main">
        <div className="es-driver-head">
          <span className="es-driver-label">{driver.label}</span>
          {weight && <span className={`es-weight ${weight.cls}`}>{weight.label}</span>}
        </div>

        {off ? (
          <div className="es-driver-stat">
            Not live at this site yet — vocabulary a reader collects by logging will feed the signal
            once it is.
          </div>
        ) : (
          <>
            <div className="es-driver-stat">
              <strong>{data.stat}</strong>
              {data.prev && <span className="es-driver-prev"> · {data.prev}</span>}
            </div>
            <div className="es-driver-note">{data.note}</div>
          </>
        )}
      </div>

      <div className="es-driver-trend">
        {/* The arrow says which way the number moved; the colour says whether
            that is good news. So a falling flag count is a green down arrow —
            hence `inverse` on the rows where fewer is better. */}
        {data?.delta != null ? (
          <TrendChip delta={data.delta} format={data.deltaFormat} inverse={data.inverse} />
        ) : data ? (
          <span className="es-driver-steady">Steady</span>
        ) : null}
      </div>
    </div>
  )
}

/** The six drivers, in the order the ticket lists them. */
export function DriverList({ drivers }) {
  return (
    <div className="es-drivers">
      {DRIVERS.map((d) => {
        // Words with Benny is site-level, so it is off for the whole class
        // until the site has it — never on for one reader and not another.
        const data = d.key === 'words' && !SITE.wordsWithBenny ? null : drivers[d.key]
        return <DriverRow key={d.key} driver={d} data={data} />
      })}
    </div>
  )
}

/**
 * How the signal is worked out, in the words a teacher would use. Every
 * surface that shows the signal can open this, because "where does this come
 * from" is the first question the column gets asked.
 */
export function HowItWorks() {
  return (
    <div className="es-how">
      <p>
        The signal compares a reader’s <strong>last 30 days</strong> with the 30 before, across the
        six inputs below. It reads <strong>change, not standing</strong> — a strong reader holding
        steady is <em>Consistent</em>, and a striving reader logging more than last month is{' '}
        <em>Increasing</em>.
      </p>
      <p>
        It needs about <strong>three weeks of logging</strong> before it will say anything, and it
        won’t move on a single quiet week. Frequency and volume carry the most weight; the other
        inputs confirm or complicate what those two say.
      </p>
    </div>
  )
}
