import { Icon } from '@components/Icon/Icon'
import './CompleteToggle.css'

/**
 * The admin's row-completion toggle — the one control that runs down the
 * "Completed?" / "Redeemed?" / "Claimed?" column of every reader-profile table.
 *
 * Ported from the shipped app, where a single rule covers all of them
 * (`.complete-learning-track-toggle, .redeem-incentive-toggle,
 * .redeem-raffle-toggle, .redeem-reward-toggle` in
 * bs-product admin/_admin.scss): a 32px filled checkbox glyph, green
 * `#0BA85F` when it's done and grey when it isn't, clickable either way.
 * `repeatable` swaps it for the app's "add" glyph, which is what a row that
 * can be completed more than once shows instead.
 *
 * It is deliberately not a `Checkbox`: it reads as a state you set, not a form
 * field you fill in, and the app draws it as a glyph rather than an input.
 *
 *   <CompleteToggle done={track.completed} onChange={setDone} label="Space" />
 *   <CompleteToggle repeatable count={7} />
 *   <CompleteToggle done={c.enrolled} onChange={…} label={c.name}
 *                   wording={{ set: 'Enroll', unset: 'Unenroll',
 *                              on: 'Enrolled', off: 'Not enrolled' }} />
 *
 * The same glyph runs several different columns, and "Mark complete" is the
 * wrong sentence in some of them — an enrolment column enrolls. `wording`
 * renames the four states without changing the control.
 *
 * @param {boolean}  done        the completed state
 * @param {function} onChange    (next) => void; omit for a read-only cell
 * @param {boolean}  repeatable  show the add glyph instead of a checkbox
 * @param {number}   count       completions, shown beside a repeatable glyph
 * @param {string}   label       what this row is, for the accessible name
 * @param {object}   wording     { set, unset, on, off } — what the action and
 *                               the state are called in this column
 */
const WORDING = {
  set: 'Mark complete',
  unset: 'Mark not complete',
  on: 'Complete',
  off: 'Not complete',
}

export function CompleteToggle({
  done = false,
  onChange,
  repeatable = false,
  count,
  label = '',
  disabled = false,
  wording,
  className = '',
}) {
  const w = wording ? { ...WORDING, ...wording } : WORDING
  const cls = [
    'ctog',
    repeatable ? 'ctog--repeatable' : done ? 'ctog--done' : 'ctog--todo',
    disabled && 'ctog--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  // A repeatable row has nothing to set — the count is the record — so it
  // renders as a mark rather than a control.
  if (repeatable) {
    return (
      <span className={cls} title={`${count ?? 0} completions`}>
        <Icon name="plus" size={22} stroke={2.4} />
        {count != null && <span className="ctog-count">{count}</span>}
      </span>
    )
  }

  if (!onChange) {
    return (
      <span className={cls} title={done ? w.on : w.off}>
        <Icon name={done ? 'square-check-filled' : 'square'} size={32} stroke={2} />
      </span>
    )
  }

  return (
    <button
      type="button"
      className={cls}
      onClick={() => onChange(!done)}
      aria-pressed={done}
      aria-label={label ? `${done ? w.unset : w.set}: ${label}` : undefined}
      title={done ? w.unset : w.set}
      disabled={disabled}
    >
      {/* The app draws a *filled* checkbox glyph, not a stroked outline, and
          draws it at a full 32px — this column is the row's one control, so it
          is deliberately the biggest hit target in the row. */}
      <Icon name={done ? 'square-check-filled' : 'square'} size={32} stroke={2} />
    </button>
  )
}
