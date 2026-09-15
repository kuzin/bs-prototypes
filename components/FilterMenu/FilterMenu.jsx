import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Flyout, FlyoutSelect } from '@components/Flyout/Flyout'
import { Checkbox } from '@components/Form/Form'
import './FilterMenu.css'

import '@components/Button/Button.css'
import '@components/Flyout/Flyout.css'
import '@components/Form/Form.css'

/**
 * One facet, behind one button — the shape a catalog filter takes when there
 * are five of them and forty values between them.
 *
 * It is the app's own accordion (`books/_filters.html.haml`: Recommended Age,
 * Favorite Genres, Languages, Main Characters, Topics, each a `fieldset` of
 * checkboxes behind a heading) with the drawer replaced by a row of buttons.
 * The accordion's point is that one section is open at a time; a Flyout is
 * that, and it costs one row instead of a column down the side of the page.
 *
 * Laying every value out as chips was the first try and it is the thing this
 * replaces: five facets, forty-one values, eleven hundred pixels of filter
 * over a grid of twenty books.
 *
 * `groups` is the app's grouped facet — `background_groups` and `topic_groups`,
 * where "Main Characters" is one filter made of four sets with subheads of
 * their own. Pass either `options` or `groups`.
 *
 * `multi` is the difference between the two kinds. A catalog filter takes
 * several genres at once (`with_genres[]`); a filter that narrows to one thing
 * — a grade band — takes `multi={false}`, where `value` is a single value and
 * picking the active one clears it.
 *
 * Either way the **button reports what it is set to** rather than carrying a
 * count beside an unchanged label: "Humor" for one value, "Genres: 3" past
 * that. What the 3 actually are is on the chips under the bar.
 *
 *   <FilterMenu label="Genres" options={GENRES} value={genres} onChange={setGenres} multi />
 *   <FilterMenu label="Main Characters" groups={BACKGROUND_GROUPS} value={tags} onChange={setTags} multi />
 *   <FilterMenu label="Grade" options={GRADES} value={grade} onChange={setGrade} />
 */
export function FilterMenu({
  label,
  options,
  groups,
  value,
  onChange,
  multi = false,
  placement = 'bottom-start',
}) {
  const sets = groups ? Object.entries(groups) : [[null, options ?? []]]
  const chosen = multi ? (value ?? []) : value == null ? [] : [value]
  const on = (o) => chosen.includes(o)

  // The button says what it is set to, not how many things it is set to. A
  // count beside an unchanged label makes you open the menu to find out what
  // the 2 was; the one value you picked is usually the answer, and past one
  // there is no reading it off a button anyway.
  const summary =
    chosen.length === 0 ? label : chosen.length === 1 ? chosen[0] : `${label}: ${chosen.length}`

  const toggle = (o) => {
    if (!multi) return onChange(value === o ? null : o)
    const set = value ?? []
    onChange(set.includes(o) ? set.filter((v) => v !== o) : [...set, o])
  }

  return (
    <Flyout
      placement={placement}
      trigger={({ toggle: open, open: isOpen }) => (
        <Button
          variant="secondary"
          className={`fmenu-trigger${chosen.length ? ' is-set' : ''}`}
          onClick={open}
          aria-haspopup="true"
          aria-expanded={isOpen}
          /* The label alone is what a screen reader would otherwise lose once
             the button starts reporting the value instead. */
          aria-label={chosen.length ? `${label}: ${chosen.join(', ')}` : label}
          title={chosen.length > 1 ? chosen.join(', ') : undefined}
          iconRight={<Icon name="chevron-down" size={15} stroke={2.2} />}
        >
          <span className="fmenu-label">{summary}</span>
        </Button>
      )}
    >
      {({ close }) =>
        /* One value: that's a select, and the shared one already draws it —
           every option listed, the current one ticked. */
        !multi ? (
          <FlyoutSelect
            ariaLabel={label}
            options={(options ?? []).map((o) => ({ id: o, label: o }))}
            value={value ?? null}
            onChange={(o) => onChange(value === o ? null : o)}
            close={close}
          />
        ) : (
          <div className="fmenu-pop">
            <div className="fmenu-list">
              {sets.map(([group, values]) => (
                <div className="fmenu-set" key={group ?? '_'}>
                  {group && <p className="fmenu-set-title">{group}</p>}
                  {values.map((o) => (
                    <Checkbox key={o} size="sm" checked={on(o)} onChange={() => toggle(o)}>
                      {o}
                    </Checkbox>
                  ))}
                </div>
              ))}
            </div>
            {chosen.length > 0 && (
              <div className="fmenu-foot">
                <button type="button" onClick={() => onChange([])}>
                  Clear {label}
                </button>
              </div>
            )}
          </div>
        )
      }
    </Flyout>
  )
}

/** The row they sit in — one button per facet, wrapping on a narrow column. */
export function FilterMenuBar({ children, className = '' }) {
  return <div className={`fmenu-bar ${className}`.trim()}>{children}</div>
}
