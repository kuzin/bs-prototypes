import { useEffect, useRef, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { PartnerMark, PARTNER_BRANDS } from '@components/PartnerBrand/PartnerBrand'

import { CONNECTIONS, CONNECTION_IDS, PARTNER_SESSIONS } from '../connections'
import { BOOKS } from '../data'
import './ConnectionBits.css'

// ─── Dashboard banner — one per partner that isn't linked yet ────────────────

export function ConnectBanner({ partnerId, onLink, onDismiss }) {
  const p = CONNECTIONS[partnerId]
  const brand = PARTNER_BRANDS[partnerId]
  if (!p) return null
  return (
    <div className="cn-banner" style={{ background: brand.soft, borderColor: brand.accent }}>
      <PartnerMark id={partnerId} size={30} />
      <div className="cn-banner-msg">
        <strong>{p.bannerText}</strong>
        <span className="cn-banner-pitch">{p.pitch}</span>
      </div>
      <button
        className="cn-banner-cta"
        style={{ color: brand.accent, borderColor: brand.accent }}
        onClick={onLink}
      >
        Link Accounts
      </button>
      <button className="cn-banner-x" onClick={onDismiss} aria-label="Dismiss">
        <Icon name="x" size={14} stroke={2.2} />
      </button>
    </div>
  )
}

// ─── Top-bar switcher — the "logo in the top right" the linked modal promises ─

export function PartnerSwitcher({ connections, onManage, onVisit }) {
  const linked = CONNECTION_IDS.filter((id) => connections[id])
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (linked.length === 0) return null

  return (
    <div className="cn-switch" ref={ref}>
      <button
        className="cn-switch-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Switch to a linked reading app"
        aria-expanded={open}
      >
        {linked.map((id) => (
          <PartnerMark key={id} id={id} size={26} />
        ))}
      </button>

      {open && (
        <div className="cn-switch-menu" role="menu">
          <div className="cn-switch-head">Your linked apps</div>
          {linked.map((id) => (
            <button
              key={id}
              className="cn-switch-item"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                onVisit?.(id)
              }}
            >
              <PartnerMark id={id} size={24} />
              <span className="cn-switch-item-main">
                <span className="cn-switch-item-name">{CONNECTIONS[id].name}</span>
                <span className="cn-switch-item-acct">{connections[id].account}</span>
              </span>
              <Icon name="external-link" size={15} className="cn-switch-item-go" />
            </button>
          ))}
          <button
            className="cn-switch-manage"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onManage?.()
            }}
          >
            <Icon name="settings" size={15} /> Manage connections
          </button>
        </div>
      )}
    </div>
  )
}

// ─── "We logged this for you" — the payoff on the dashboard ──────────────────

export function AutoLoggedCard({ connections }) {
  const linked = CONNECTION_IDS.filter((id) => connections[id])
  const rows = linked.flatMap((id) =>
    (PARTNER_SESSIONS[id] || []).map((s) => ({ ...s, partnerId: id })),
  )
  if (rows.length === 0) return null
  const total = rows.reduce((sum, r) => sum + r.minutes, 0)

  return (
    <aside className="wa-card cn-auto-card">
      <div className="cn-auto-head">
        <Icon name="bolt" size={16} className="cn-auto-bolt" />
        <span className="cn-auto-title">Logged for you</span>
        <span className="cn-auto-total">{total} min</span>
      </div>
      <ul className="cn-auto-list">
        {rows.map((r) => (
          <li key={r.id} className="cn-auto-row">
            <PartnerMark id={r.partnerId} size={22} />
            <span className="cn-auto-row-main">
              <span className="cn-auto-row-title">{BOOKS[r.book]?.title ?? r.book}</span>
              <span className="cn-auto-row-meta">
                {CONNECTIONS[r.partnerId].name} · {r.when}
                {r.finished ? ' · Finished' : ''}
              </span>
            </span>
            <span className="cn-auto-row-min">{r.minutes}m</span>
          </li>
        ))}
      </ul>
      <p className="cn-auto-foot">
        No need to log these — they came straight from your linked apps.
      </p>
    </aside>
  )
}
