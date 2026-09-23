import { Icon } from '@components/Icon/Icon'
import { PlumpyIcon, hasPlumpy } from '@components/PlumpyIcon/PlumpyIcon'
import { Tooltip } from '@components/Primitives/Primitives'
import '@components/Primitives/Primitives.css'
import './RowAction.css'

/**
 * RowAction — the one control that sits at the end of a table row.
 *
 * The app has exactly two shapes for this, and no others:
 *
 *   **An icon**, for something you do to this row and every row — redeem,
 *   open, re-run. `.redeem-reward-icon` in the earned-rewards table is the
 *   reference: a bare 32px box holding a 20px drawing, no border and no fill
 *   until you're over it, with the label in a tooltip because there's no room
 *   to write it 40 times down a column.
 *
 *   **A text button**, for "open the thing this row is about" — the app's
 *   `View Activity` (`.view-activity-button-container button { width:
 *   max-content }`). That's a plain `<Button>`; this component doesn't wrap it.
 *
 * Before this, the profiles had four: a ghost `IconButton`, a bespoke 28px
 * `.rl-dots`, a bespoke 32px `.row-action`, and a bare text link — which is
 * four different targets and three different hover treatments down the same
 * page.
 *
 * The glyph is **Plumpy** wherever the pack has it, which is what the app
 * does: `.refresh-icon { @include icon('refresh', '#000000', 20, 'plumpy') }`
 * on its own row action. Anything Plumpy doesn't carry falls back to the
 * stroked `<Icon>` — same size, same cell — so a name never renders nothing.
 * Two fall back on purpose rather than for want of a glyph: the month-stepper
 * chevrons, because a directional arrow is chrome and not one of Plumpy's
 * drawn objects, and `user-plus`, because every "add user" in the pack is a
 * gendered figure and a K-12 product shouldn't pick one to mean "a friend".
 *
 *   <RowAction icon="dots" label="Actions for The Hobbit" onClick={…} />
 *   <RowAction label="Redeem reward" onClick={…}>
 *     <BsIcon set="actions" name="reward" size={20} />
 *   </RowAction>
 *
 * Pass `children` to draw something that isn't an `<Icon>` — a product
 * drawing, a partner mark. Pass `as="span"` for a mark that reports rather than
 * acts (a flag, a partner logo): same 32px cell, no button semantics.
 *
 * `done` is the switched-on state of an action that toggles — the title is on
 * the list, the row is starred. It fills: a green disc with a white mark in it,
 * and pressing it switches back off the way a bookmark does. Don't reach for
 * `disabled` to say this; grey reads as "you can't", which on a book already
 * added said the title had been refused when in fact it had worked.
 *
 * `tooltip={false}` keeps the accessible name and drops the bubble — for a
 * dots menu, where the label says nothing the glyph doesn't, and a bubble that
 * fires on every row follows the cursor down the table.
 *
 * @param {string}   icon      an `<Icon>` name; ignored when `children` is set
 * @param {string}   label     what this does — the tooltip and accessible name
 * @param {function} onClick
 * @param {'button'|'span'} as
 * @param {boolean}  disabled
 * @param {boolean}  done      switched on for this row — a filled green disc
 * @param {boolean}  tooltip   set false for a self-evident control
 */
export function RowAction({
  icon,
  label,
  onClick,
  as = 'button',
  disabled = false,
  done = false,
  tooltip = true,
  className = '',
  children,
}) {
  const body =
    children ??
    (hasPlumpy(icon) ? (
      <PlumpyIcon name={icon} size={20} />
    ) : (
      <Icon name={icon} size={20} stroke={1.9} />
    ))
  const cls = `row-action${done ? ' row-action--done' : ''} ${className}`.trim()

  // A mark, not a control: it says what's on the row, so it takes the same cell
  // but no button role and no pointer.
  if (as === 'span') {
    return (
      <Tooltip content={label}>
        <span className={`${cls} row-action--static`} role="img" aria-label={label}>
          {body}
        </span>
      </Tooltip>
    )
  }

  const button = (
    <button type="button" className={cls} onClick={onClick} disabled={disabled} aria-label={label}>
      {body}
    </button>
  )

  return tooltip ? <Tooltip content={label}>{button}</Tooltip> : button
}

/**
 * The cell they live in. `.row-actions { text-align: right }` in the app's
 * table Sass — actions hug the row's trailing edge, and several of them line
 * up on one grid however many a given row has.
 */
export function RowActions({ children, className = '' }) {
  return <span className={`row-actions ${className}`.trim()}>{children}</span>
}
