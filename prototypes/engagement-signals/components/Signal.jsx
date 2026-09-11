// The signal's vocabulary — the pieces every surface draws it with, so the
// class table and the profile page can't drift apart. One pill, one trajectory
// strip, one driver row.
import { Fragment } from 'react'
import { Icon } from '@components/Icon/Icon'
import { TrendChip } from '@components/TrendChip/TrendChip'
import { Tooltip } from '@components/Primitives/Primitives'
import '@components/TrendChip/TrendChip.css'
import '@components/Primitives/Primitives.css'

import { StatRow } from '../../student-profile/BeanstackProfile'

import { SIGNALS, DRIVERS, DRIVER_OFF_ACCENT, SITE } from '../data'
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
 * One input, and what it contributed — the profile's own `StatRow`, which is
 * what every other at-a-glance figure on this panel is drawn with: label left,
 * figure right, trend after it. Building a second row shape for the same job
 * would put two rhythms on one page.
 */
export function DriverRow({ driver, data }) {
  // A driver with nothing behind it is still shown — greyed, and saying why.
  // Dropping the row would leave a teacher guessing whether it was considered.
  const off = !data

  return (
    <StatRow
      icon={driver.icon}
      accent={off ? DRIVER_OFF_ACCENT : driver.accent}
      label={driver.label}
    >
      {off ? (
        <span className="bp-statrow-empty">Not live at this site yet</span>
      ) : (
        <>
          <span className="bp-statrow-value">
            {data.value}
            {data.unit && <span className="bp-statrow-unit"> {data.unit}</span>}
          </span>
          {/* Arrow and colour both follow the figure: up is green, down is red,
              whatever the figure happens to be. Whether the move is good news
              is the group heading's job now — so a falling flag count draws a
              red down arrow under "Lifting the signal", which reads as "this
              went down, and that's helping". */}
          {data.delta != null ? (
            <TrendChip delta={data.delta} format={data.deltaFormat} />
          ) : (
            // The same chip as a trend, in the neutral pair — a row that did
            // not move still gets a mark, so the column reads as a column
            // rather than a scatter of arrows with gaps in it.
            <Tooltip content="No change" className="trend-tip">
              <span className="es-steady" aria-label="No change">
                <Icon name="minus" size={15} stroke={2.6} />
              </span>
            </Tooltip>
          )}
        </>
      )}
    </StatRow>
  )
}

// Which way each input pushed. A teacher reading "why Declining?" wants the
// case for and the case against separated, not a flat list they have to decode
// arrow colours down. The direction is the driver's own reading — "up" means
// good for engagement, which is why a falling flag count is an up.
const GROUPS = [
  // Colours are the app's own tag pairs — a hue's 50 fill under its 500/800
  // text, the same pairs the signal pill and `TrendChip` use.
  { key: 'up', label: 'Lifting the signal', icon: 'arrow-up', color: '#017841', bg: '#CBFCE5' },
  { key: 'down', label: 'Holding it back', icon: 'arrow-down', color: '#DF3F30', bg: '#FDD2CE' },
  { key: 'flat', label: 'No change', icon: 'arrow-right', color: '#656565', bg: '#F1F1F1' },
  { key: 'na', label: 'Not measured yet', icon: 'minus', color: '#656565', bg: '#F1F1F1' },
]

/**
 * The six drivers, in the ticket's order within each group, sorted into what
 * they did to this reading.
 */
export function DriverList({ drivers }) {
  const rows = DRIVERS.map((d) => ({
    driver: d,
    // Words with Benny is site-level, so it is off for the whole class until
    // the site has it — never on for one reader and not another.
    data: d.key === 'words' && !SITE.wordsWithBenny ? null : drivers[d.key],
  }))

  return (
    <>
      {GROUPS.map((g) => {
        const inGroup = rows.filter((r) => (r.data ? (r.data.direction ?? 'flat') : 'na') === g.key)
        if (inGroup.length === 0) return null
        return (
          <Fragment key={g.key}>
            {/* A filled band rather than a line of small caps: the point of the
                grouping is that you can see where one list stops and the next
                starts without reading either. */}
            <div className="es-group" style={{ '--es-c': g.color, '--es-bg': g.bg }}>
              <Icon name={g.icon} size={15} stroke={2.8} />
              <span className="es-group-label">{g.label}</span>
              <span className="es-group-count">{inGroup.length}</span>
            </div>
            {inGroup.map((r) => (
              <DriverRow key={r.driver.key} driver={r.driver} data={r.data} />
            ))}
          </Fragment>
        )
      })}
    </>
  )
}
