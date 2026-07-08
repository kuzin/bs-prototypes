import { useEffect, useRef, useState } from 'react'
import '@components/Tabs/Tabs.css'

/**
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
  accent,
  ariaLabel,
  className = '',
}) {
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
      className={`tabs tabs--${variant} tabs--${size}${block ? ' tabs--block' : ''}${canScrollLeft ? ' tabs--scroll-left' : ''}${canScrollRight ? ' tabs--scroll-right' : ''} ${className}`.trim()}
      role="tablist"
      aria-label={ariaLabel}
      style={style}
    >
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
