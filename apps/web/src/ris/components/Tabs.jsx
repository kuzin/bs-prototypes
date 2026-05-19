import './Tabs.css'

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
export function Tabs({ active, onChange, items, variant = 'underline' }) {
  return (
    <div className={`tabs tabs--${variant}`} role="tablist">
      {items.map(item => (
        <button
          key={item.id}
          role="tab"
          type="button"
          aria-selected={active === item.id}
          className={`tab${active === item.id ? ' tab--active' : ''}`}
          onClick={() => onChange?.(item.id)}
        >
          {item.icon && <span className="tab-icon">{item.icon}</span>}
          <span>{item.label}</span>
          {item.count != null && <span className="tab-count">{item.count}</span>}
        </button>
      ))}
    </div>
  )
}
