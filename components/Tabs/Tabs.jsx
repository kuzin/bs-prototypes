import { useEffect, useRef, useState } from 'react'
import { Select } from '@components/Form/Form'
import '@components/Form/Form.css'
import '@components/Tabs/Tabs.css'

/**
 * `plain` drops the pill variant's track, for a sub-tab bar that already sits on
 * a band of its own (the reader's Reading Log and Collections bars).
 *
 * `center` centres the strip in its container — for a short tab bar inside a
 * card, where left-aligning two tabs against a wide panel leaves the rest of
 * the rule looking empty. Page-level bars stay left-aligned.
 *
 * <Tabs
 *   active="daily"
 *   onChange={k => setTab(k)}
 *   items={[
 *     { id: 'daily',   label: 'Daily Reading' },
 *     { id: 'roster',  label: 'Students', count: 24 },
 *     { id: 'safety',  label: 'Safety Signals', count: 6, danger: true },
 *     { id: 'rewards', label: 'Earned Rewards' },
 *   ]}
 * />
 */
export function Tabs({
  active,
  onChange,
  items,
  variant = 'underline',
  size = 'md',
  block = false,
  plain = false,
  center = false,
  accent,
  ariaLabel,
  collapse,
  className = '',
}) {
  // A page-level tab bar (the underline variant) becomes a select on a phone:
  // three or four labels don't fit a 375px row, and a strip that scrolls
  // sideways hides the tabs you haven't found yet. Pill groups are segmented
  // controls, not navigation, so they keep their buttons — two or three short
  // options read better as a control than as a dropdown. `collapse` overrides
  // either way. The select is a child of `.tabs` rather than a sibling so no
  // consumer's markup or selectors change; CSS swaps which one shows.
  const collapses = collapse ?? variant === 'underline'
  const style = accent ? { '--tab-accent': accent } : undefined

  // Edge-fade hint for when the strip overflows and scrolls horizontally
  // (narrow screens, many items) — re-measured on scroll and on resize of
  // the strip itself, since collapsing the sidebar or rotating the device
  // changes how much of it fits without `items` changing.
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  function updateScrollFade() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 1)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }

  useEffect(() => {
    updateScrollFade()
    const el = scrollRef.current
    if (!el) return
    const observer = new ResizeObserver(updateScrollFade)
    observer.observe(el)
    window.addEventListener('resize', updateScrollFade)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateScrollFade)
    }
  }, [items])

  return (
    <div
      ref={scrollRef}
      onScroll={updateScrollFade}
      className={`tabs tabs--${variant} tabs--${size}${plain ? ' tabs--plain' : ''}${center ? ' tabs--center' : ''}${block ? ' tabs--block' : ''}${canScrollLeft ? ' tabs--scroll-left' : ''}${canScrollRight ? ' tabs--scroll-right' : ''} ${className}`.trim()}
      role={collapses ? undefined : 'tablist'}
      aria-label={collapses ? undefined : ariaLabel}
      style={style}
    >
      {collapses && (
        <Select
          className="tabs-select"
          value={active}
          onChange={(e) => onChange?.(e.target.value)}
          aria-label={ariaLabel}
        >
          {items.map((item) => (
            <option key={item.id} value={item.id} disabled={item.disabled}>
              {item.label}
              {item.count != null ? ` (${item.count})` : ''}
            </option>
          ))}
        </Select>
      )}
      {items.map((item) => (
        <button
          key={item.id}
          role="tab"
          type="button"
          aria-selected={active === item.id}
          disabled={item.disabled}
          title={item.title}
          className={`tab${active === item.id ? ' tab--active' : ''}${item.disabled ? ' tab--disabled' : ''}`}
          onClick={() => !item.disabled && onChange?.(item.id)}
        >
          {item.icon && <span className="tab-icon">{item.icon}</span>}
          <span>{item.label}</span>
          {item.count != null && (
            <span className={`tab-count${item.danger ? ' tab-count--danger' : ''}`}>
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
