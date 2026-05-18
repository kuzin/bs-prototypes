import { useState } from 'react'
import './AlertStrip.css'
import { ALERTS } from '../data'

const LEVEL_META = {
  critical: { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: '⚠' },
  warning:  { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: '↓' },
  positive: { color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', icon: '↑' },
}

export function AlertStrip({ onNavigate }) {
  const [dismissed, setDismissed] = useState([])
  const visible = ALERTS.filter(a => !dismissed.includes(a.id))
  if (!visible.length) return null

  return (
    <div className="alert-strip">
      {visible.map(alert => {
        const m = LEVEL_META[alert.level]
        return (
          <div key={alert.id} className="alert-item" style={{ '--alert-color': m.color, '--alert-bg': m.bg, '--alert-border': m.border }}>
            <span className="alert-icon">{m.icon}</span>
            <div className="alert-body">
              <span className="alert-school">{alert.school}</span>
              <span className="alert-title">{alert.title}</span>
              <span className="alert-detail">{alert.detail}</span>
            </div>
            <button className="alert-action" onClick={() => onNavigate(alert.tab)}>
              {alert.action} →
            </button>
            <button className="alert-dismiss" onClick={() => setDismissed(d => [...d, alert.id])}>✕</button>
          </div>
        )
      })}
    </div>
  )
}
