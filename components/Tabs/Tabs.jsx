import '@components/Tabs/Tabs.css'

/**
 * <Tabs
 *   active="daily"
 *   onChange={k => setTab(k)}
 *   items={[
 *     { id: 'daily',   label: 'Daily Reading' },
 *     { id: 'roster',  label: 'Students', count: 24 },
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
  accent,
  className = '',
}) {
  const style = accent ? { '--tab-accent': accent } : undefined
  return (
    <div
      className={`tabs tabs--${variant} tabs--${size} ${className}`.trim()}
      role="tablist"
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
          {item.count != null && <span className="tab-count">{item.count}</span>}
        </button>
      ))}
    </div>
  )
}
