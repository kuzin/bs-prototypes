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
 * can be completed more than once shows instead — and since that glyph is an
 * add, it adds: given `onChange` the cell is a small secondary button carrying
 * the running count, and calls back with `count + 1`.
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
 * @param {boolean}  repeatable  show the add glyph instead of a checkbox;
 *                               `onChange` then receives `count + 1`
 * @param {number}   count       completions, shown beside a repeatable glyph
 * @param {string}   label       what this row is, for the accessible name
 * @param {object}   wording     { set, unset, on, off } — what the action and
 *                               the state are called in this column
 */
/**
 * The box itself — the design system's own checkbox face (`.chk-box`), not a
 * glyph that resembles one. It was two Tabler squares before, which meant this
 * column's box carried a different radius, a different border weight and a
 * different tick from every other checkbox on the page. Same construction as
 * the real control, in this column's own green.
 */
function CheckBox() {
  return (
    <span className="ctog-box" aria-hidden="true">
      <Icon name="check" size={15} stroke={3} />
    </span>
  )
}

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

  // A repeatable row is never "complete" — the count is the record, and the
  // glyph the app puts here is an *add*. So it adds: the cell takes the
  // secondary button's chrome and hands back the next count. Without
  // `onChange` it keeps the same shape as a read-only mark, so a column of
  // them still lines up.
  if (repeatable) {
    const n = count ?? 0
    const title = `${n} ${n === 1 ? 'completion' : 'completions'}`
    if (!onChange) {
      return (
        <span className={cls} title={title}>
          <Icon name="plus" size={18} stroke={2.4} />
          {count != null && <span className="ctog-count">{count}</span>}
        </span>
      )
    }
    return (
      <button
        type="button"
        className={cls}
        onClick={() => onChange(n + 1)}
        disabled={disabled}
        title={`Add a completion — ${title}`}
        aria-label={label ? `Add a completion: ${label}` : 'Add a completion'}
      >
        <Icon name="plus" size={18} stroke={2.4} />
        {count != null && <span className="ctog-count">{count}</span>}
      </button>
    )
  }

  if (!onChange) {
    return (
      <span className={cls} title={done ? w.on : w.off}>
        <CheckBox />
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
      <CheckBox />
    </button>
  )
}
