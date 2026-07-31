import { useEffect, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Avatar } from '@components/Avatar/Avatar'
import { PartnerMark } from '@components/PartnerBrand/PartnerBrand'

import { CONNECTIONS, TAKEN_USERNAMES } from '../connections'
import { PartnerSite } from './PartnerSite'
import './ConnectFlow.css'

import '@components/Avatar/Avatar.css'

// The handoff, end to end:
//   library → login   partner-hosted, rendered in the partner's own chrome
//   confirm           "are these the same person?" over the partner's site
//   linked | error    the result the reader returns to Beanstack with
//
// Everything past `login` is a card on a scrim over the partner site, which is
// how the real integration reads: you never leave the partner's tab until you
// choose to come back.

export function ConnectFlow({ partnerId, reader, onCancel, onLinked }) {
  const p = CONNECTIONS[partnerId]
  const [step, setStep] = useState('library')
  const [orgQuery, setOrgQuery] = useState('')
  const [org, setOrg] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Start over whenever a different partner's handoff opens (React reuses this
  // component when only `partnerId` changes).
  useEffect(() => {
    setStep('library')
    setOrgQuery('')
    setOrg(null)
    setUsername('')
    setPassword('')
  }, [partnerId])

  // Escape backs out of the whole handoff (nothing has been linked yet).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && step !== 'linked') onCancel?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step, onCancel])

  if (!p) return null

  const c = p.chrome
  const matches = orgQuery.trim()
    ? p.orgs.filter((o) => o.toLowerCase().includes(orgQuery.trim().toLowerCase()))
    : []

  function submitLogin(e) {
    e.preventDefault()
    if (!username.trim()) return
    setStep(TAKEN_USERNAMES.includes(username.trim().toLowerCase()) ? 'error' : 'confirm')
  }

  const partnerAccountName = username.trim() || p.account.name
  const finish = () =>
    onLinked?.({ partnerId, account: partnerAccountName, org: org || p.defaultOrg })

  const resultCard =
    step === 'confirm' ? (
      <ConfirmCard
        partner={p}
        partnerId={partnerId}
        reader={reader}
        partnerAccountName={partnerAccountName}
        onClose={onCancel}
        onConfirm={() => setStep('linked')}
      />
    ) : step === 'linked' ? (
      <ResultCard
        partner={p}
        title="Accounts Linked!"
        body={`Starting now, we'll automatically log all of your ${p.name} reading in Beanstack. Swap between the two at any time using the logo in the top right.`}
        benny="/bs-prototypes/benny-excited.svg"
        cta="Return to Beanstack"
        onClose={finish}
        onCta={finish}
      />
    ) : step === 'error' ? (
      <ResultCard
        partner={p}
        title="We had a problem linking your accounts"
        body={`This ${p.name} account has already been connected.`}
        benny="/bs-prototypes/benny-sad.svg"
        tone="error"
        cta="Return to Beanstack"
        onClose={onCancel}
        onCta={onCancel}
        secondary={{ label: 'Try a different account', onClick: () => setStep('login') }}
      />
    ) : null

  return (
    <PartnerSite
      partnerId={partnerId}
      onBack={onCancel}
      overlay={resultCard}
      hint={
        <>
          Prototype — this is {p.name}&apos;s own sign-in. Any password works; sign in as{' '}
          <code>taken</code> to see the already-linked error.
        </>
      }
    >
      <div className="cf-panel">
        <div className="cf-panel-head">
          <h1 className="cf-panel-h1">{p.signInTitle}</h1>
          <p className="cf-panel-sub">
            {step === 'library'
              ? `Find your library or school to continue to ${p.name}.`
              : `Sign in with the credentials you use for ${p.name}.`}
          </p>
        </div>

        {step === 'library' ? (
          <div className="cf-panel-body">
            <label className="cf-label" htmlFor="cf-org">
              {p.orgLabel}
            </label>
            <input
              id="cf-org"
              className="cf-input"
              style={{ borderColor: c.inputBorder }}
              placeholder="Start typing a name…"
              value={orgQuery}
              onChange={(e) => setOrgQuery(e.target.value)}
              autoFocus
            />
            {matches.length > 0 && (
              <ul className="cf-orglist" style={{ borderColor: c.inputBorder }}>
                {matches.map((o) => (
                  <li key={o}>
                    <button
                      type="button"
                      className="cf-org"
                      onClick={() => {
                        setOrg(o)
                        setOrgQuery('')
                        setStep('login')
                      }}
                    >
                      <span className="cf-org-name">{o}</span>
                      <Icon name="chevron-right" size={16} className="cf-org-chev" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {orgQuery.trim() && matches.length === 0 && (
              <p className="cf-none">No libraries or schools match “{orgQuery}”.</p>
            )}
          </div>
        ) : (
          <form className="cf-panel-body" onSubmit={submitLogin}>
            <div className="cf-orgchip">
              <Icon name="building-community" size={17} className="cf-orgchip-icon" />
              <span className="cf-orgchip-name">{org || p.defaultOrg}</span>
              <button
                type="button"
                className="cf-link"
                onClick={() => {
                  setStep('library')
                  setUsername('')
                  setPassword('')
                }}
              >
                Change
              </button>
            </div>

            <label className="cf-label" htmlFor="cf-user">
              Username
            </label>
            <input
              id="cf-user"
              className="cf-input"
              style={{ borderColor: c.inputBorder }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />

            <label className="cf-label" htmlFor="cf-pass">
              Password
            </label>
            <input
              id="cf-pass"
              className="cf-input"
              style={{ borderColor: c.inputBorder }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="cf-cta"
              style={{ background: c.cta, color: c.ctaText }}
              disabled={!username.trim()}
            >
              Log In
            </button>
            <button type="button" className="cf-link cf-link--center">
              Forgot your password?
            </button>
          </form>
        )}
      </div>
    </PartnerSite>
  )
}

// ─── "Please confirm these are the correct accounts" ─────────────────────────

function ConfirmCard({ partner, partnerId, reader, partnerAccountName, onClose, onConfirm }) {
  const m = partner.modal
  return (
    <div className="cf-scrim">
      <div className={`cf-cardwrap cf-cardwrap--${m.theme}`}>
        <button className="cf-card-x" onClick={onClose} aria-label="Cancel">
          <Icon name="x" size={16} stroke={2.4} />
        </button>
        <div
          className={`cf-card cf-card--${m.theme}`}
          style={{ background: m.bg, color: m.text, borderColor: m.border }}
        >
          <div className="cf-confirm-head">
            <h2 className="cf-card-title">
              Connect to {reader.name.split(' ')[0]}&apos;s Beanstack Account
            </h2>
            <p className="cf-card-sub" style={{ color: m.muted }}>
              Please confirm these are the correct accounts.
            </p>
          </div>

          <div className="cf-pair">
            <AccountCard
              modal={m}
              initials={reader.initials}
              color={reader.color}
              name={reader.name}
              service="Beanstack"
              badge={<img src="/bs-prototypes/bs.svg" alt="" className="cf-badge-img" />}
            />
            <span className="cf-pair-link" style={{ background: m.border, color: m.text }}>
              <Icon name="link" size={16} stroke={2} />
            </span>
            <AccountCard
              modal={m}
              initials={partner.account.initials}
              color={partner.account.color}
              name={partnerAccountName}
              service={partner.name}
              badge={<PartnerMark id={partnerId} size={20} />}
            />
          </div>

          <div className="cf-card-foot" style={{ borderColor: m.border }}>
            <button
              className="cf-card-cta"
              style={{ background: m.cta, color: m.ctaText }}
              onClick={onConfirm}
            >
              Connect Accounts
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AccountCard({ modal, initials, color, name, service, badge }) {
  return (
    <div className="cf-acct" style={{ borderColor: modal.border }}>
      <span className="cf-acct-avatar">
        <Avatar initials={initials} color={color} size="xl" shape="circle" />
        <span className="cf-acct-badge">{badge}</span>
      </span>
      <span className="cf-acct-name">{name}</span>
      <span className="cf-acct-service" style={{ color: modal.muted }}>
        {service}
      </span>
    </div>
  )
}

// ─── Linked / error result ───────────────────────────────────────────────────

function ResultCard({ partner, title, body, benny, tone, cta, onClose, onCta, secondary }) {
  const m = partner.modal
  return (
    <div className="cf-scrim">
      <div className={`cf-cardwrap cf-cardwrap--${m.theme}`}>
        <button className="cf-card-x" onClick={onClose} aria-label="Close">
          <Icon name="x" size={16} stroke={2.4} />
        </button>
        <div
          className={`cf-card cf-card--${m.theme}`}
          style={{ background: m.bg, color: m.text, borderColor: m.border }}
        >
          {/* The band matches the cream disc baked into the Benny artwork, so the
            two read as one illustration. */}
          <div className="cf-hero">
            <span className="cf-hero-figure">
              <img src={benny} alt="" className="cf-hero-benny" />
              {tone === 'error' && (
                <span className="cf-hero-alert" aria-hidden="true">
                  <Icon name="x" size={16} stroke={3} />
                </span>
              )}
            </span>
          </div>

          <div className="cf-result-body">
            <h2 className="cf-card-title">{title}</h2>
            <p className="cf-card-sub" style={{ color: m.muted }}>
              {body}
            </p>
          </div>

          <div className="cf-card-foot" style={{ borderColor: m.border }}>
            {secondary && (
              <button
                className="cf-card-ghost"
                style={{ color: m.muted, borderColor: m.border }}
                onClick={secondary.onClick}
              >
                {secondary.label}
              </button>
            )}
            <button
              className="cf-card-cta"
              style={{ background: m.cta, color: m.ctaText }}
              onClick={onCta}
            >
              {cta}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
