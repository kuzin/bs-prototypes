import { useEffect, useRef, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Avatar } from '@components/Avatar/Avatar'
import { PartnerBrand, PartnerMark, PARTNER_BRANDS } from '@components/PartnerBrand/PartnerBrand'
import '@components/PartnerConnect/PartnerConnect.css'

import '@components/Avatar/Avatar.css'

/**
 * Reading-partner account connections — the whole "link my other reading app to
 * Beanstack" surface, shared by every prototype that models an integration
 * (Comics Plus, Scholastic, Beeverso, …).
 *
 * Modelled on the live "Comics Plus ↔ Beanstack Integration" flow: a reader
 * starts from a banner on their Beanstack dashboard, is handed off to the
 * partner's own site to pick their school and sign in, confirms the two
 * accounts belong to the same person, and lands back in Beanstack with the
 * partner's reading logging itself from then on.
 *
 * Every piece takes a `partner` **config object** rather than looking one up,
 * so a prototype owns its own partner list:
 *
 *   {
 *     id,                  // key into PARTNER_BRANDS — drives the logo
 *     name, pitch, bannerText,
 *     signInTitle, signInSub?,     // partner-hosted sign-in copy
 *     userLabel?,                  // defaults to "Username"
 *     ssoOptions?: [{ id, label }] // "or sign in with…" buttons
 *     orgLabel?, orgs?, defaultOrg,// omit `orgs` to skip the school step
 *     footerCopy, footerLinks,
 *     chrome: { headerBg, headerText, pageBg, pageText, inputBorder, link, cta, ctaText },
 *     modal:  { theme: 'light'|'dark', bg, text, muted, border, cta, ctaText },
 *     account: { name, initials, color },   // who they are on the partner side
 *   }
 */

// ─── The handoff ─────────────────────────────────────────────────────────────
//
//   org → login       partner-hosted, rendered in the partner's own chrome
//   confirm           "are these the same person?" over the partner's site
//   linked | error    the result the reader returns to Beanstack with
//
// Everything past `login` is a card on a scrim over the partner site, which is
// how the real integration reads: you never leave the partner's tab until you
// choose to come back.

export function ConnectFlow({ partner: p, reader, takenUsernames = [], onCancel, onLinked }) {
  // Partners without a school picker (their own sign-in resolves the org) open
  // straight on the login form.
  const firstStep = p?.orgs?.length ? 'org' : 'login'
  const [step, setStep] = useState(firstStep)
  const [orgQuery, setOrgQuery] = useState('')
  const [org, setOrg] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Start over whenever a different partner's handoff opens (React reuses this
  // component when only the partner changes).
  useEffect(() => {
    setStep(firstStep)
    setOrgQuery('')
    setOrg(null)
    setUsername('')
    setPassword('')
  }, [p?.id, firstStep])

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
    setStep(takenUsernames.includes(username.trim().toLowerCase()) ? 'error' : 'confirm')
  }

  const partnerAccountName = username.trim() || p.account.name
  const finish = () =>
    onLinked?.({ partnerId: p.id, account: partnerAccountName, org: org || p.defaultOrg })

  const resultCard =
    step === 'confirm' ? (
      <ConfirmCard
        partner={p}
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
      partner={p}
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
            {step === 'org'
              ? `Find your school to continue to ${p.name}.`
              : (p.signInSub ?? `Sign in with the credentials you use for ${p.name}.`)}
          </p>
        </div>

        {step === 'org' ? (
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
              <p className="cf-none">No schools match “{orgQuery}”.</p>
            )}
          </div>
        ) : (
          <form className="cf-panel-body" onSubmit={submitLogin}>
            {p.orgs?.length > 0 && (
              <div className="cf-orgchip">
                <Icon name="building-community" size={17} className="cf-orgchip-icon" />
                <span className="cf-orgchip-name">{org || p.defaultOrg}</span>
                <button
                  type="button"
                  className="cf-link"
                  onClick={() => {
                    setStep('org')
                    setUsername('')
                    setPassword('')
                  }}
                >
                  Change
                </button>
              </div>
            )}

            <label className="cf-label" htmlFor="cf-user">
              {p.userLabel || 'Username'}
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

            {/* Partners that also accept district SSO show it below the form,
                the way their real sign-in page does. */}
            {p.ssoOptions?.length > 0 && (
              <>
                <div className="cf-or" style={{ '--cf-rule': c.inputBorder }}>
                  or you can
                </div>
                <div className="cf-sso">
                  {p.ssoOptions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="cf-sso-btn"
                      style={{ borderColor: c.inputBorder }}
                      onClick={() => setStep('confirm')}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </PartnerSite>
  )
}

// ─── "Please confirm these are the correct accounts" ─────────────────────────

function ConfirmCard({ partner, reader, partnerAccountName, onClose, onConfirm }) {
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
              badge={<PartnerMark id={partner.id} size={20} />}
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

// ─── The partner's own site ──────────────────────────────────────────────────

/**
 * The shell for anything rendered on a partner's own site — their header bar,
 * page tint, and footer. Used by the account handoff and by the catalog the
 * top-bar switcher jumps to.
 *
 * `overlay` renders after the site (the handoff's cards sit on a scrim above it).
 */
export function PartnerSite({ partner: p, headRight = 'Log In', onBack, hint, children, overlay }) {
  if (!p) return null
  const c = p.chrome

  return (
    <div className="cf-overlay" role="dialog" aria-modal="true" aria-label={p.name}>
      <div
        className="cf-site"
        style={{ background: c.pageBg, color: c.pageText, '--cf-link': c.link }}
      >
        <header className="cf-site-head" style={{ background: c.headerBg, color: c.headerText }}>
          <PartnerBrand id={p.id} size="md" invert={p.modal.theme === 'dark'} />
          <span className="cf-site-head-link">{headRight}</span>
        </header>

        <main className="cf-site-body">{children}</main>

        <footer className="cf-site-foot" style={{ background: c.headerBg, color: c.headerText }}>
          <span className="cf-site-foot-copy">{p.footerCopy}</span>
          <span className="cf-site-foot-links">{p.footerLinks.join(' | ')}</span>
        </footer>
      </div>

      {overlay}

      {/* Prototype-only strip: on the real partner site this is a browser tab, so
          there'd be no in-page way back. */}
      <div className="cf-hint">
        <button className="cf-hint-back" onClick={onBack}>
          <Icon name="chevron-left" size={14} stroke={2.4} /> Back to Beanstack
        </button>
        <span className="cf-hint-text">{hint}</span>
      </div>
    </div>
  )
}

/**
 * Where the top-bar switcher lands once an account is linked — a stand-in for
 * the partner's real catalog, enough to show that reading happens over here and
 * lands back in Beanstack on its own.
 *
 * `titles` are the partner's own items; `renderCover` draws each one, since
 * cover art is the consuming prototype's business.
 */
export function PartnerCatalog({ partner: p, account, titles = [], renderCover, onBack, note }) {
  if (!p) return null

  return (
    <PartnerSite
      partner={p}
      headRight={account}
      onBack={onBack}
      hint={`Prototype — a stand-in for the ${p.name} catalog. Anything read here logs itself in Beanstack.`}
    >
      <div className="cf-catalog">
        <div className="cf-catalog-head">
          <h1 className="cf-catalog-h1">Your {p.name} Catalog</h1>
          <p className="cf-catalog-sub">{p.pitch}</p>
          <span className="cf-catalog-note" style={{ color: p.chrome.cta }}>
            <Icon name="circle-check-filled" size={15} />
            {note || 'Linked to Beanstack — your reading logs itself'}
          </span>
        </div>

        <div className="cf-catalog-grid">
          {titles.map((b) => (
            <button key={b.id} className="cf-catalog-item" type="button">
              {renderCover?.(b)}
              <span className="cf-catalog-title">{b.title}</span>
              <span className="cf-catalog-author">{b.author}</span>
            </button>
          ))}
        </div>
      </div>
    </PartnerSite>
  )
}

// ─── Dashboard banner — one per partner that isn't linked yet ────────────────

/**
 * The dashboard prompt to link reading apps. Takes **every** partner that isn't
 * connected yet, not one at a time: a reader with two apps left to link should
 * see one banner, not a stack of them.
 *
 * With a single partner it wears that partner's brand and speaks in their voice
 * ("Link your Comics Plus account today!"). With more than one it goes neutral
 * — no partner gets to own the tint — and offers a button each.
 */
export function ConnectBanner({ partners = [], onLink, onDismiss }) {
  const list = partners.filter((p) => PARTNER_BRANDS[p?.id])
  if (list.length === 0) return null

  return list.length === 1 ? (
    <SinglePartnerBanner partner={list[0]} onLink={onLink} onDismiss={onDismiss} />
  ) : (
    <MultiPartnerBanner partners={list} onLink={onLink} onDismiss={onDismiss} />
  )
}

function SinglePartnerBanner({ partner: p, onLink, onDismiss }) {
  const brand = PARTNER_BRANDS[p.id]
  return (
    <div className="cn-banner" style={{ background: brand.soft, borderColor: brand.accent }}>
      <PartnerMark id={p.id} size={30} />
      <div className="cn-banner-msg">
        <strong>{p.bannerText}</strong>
        <span className="cn-banner-pitch">{p.pitch}</span>
      </div>
      <div className="cn-banner-actions">
        <button
          className="cn-banner-cta"
          style={{ color: brand.accent, borderColor: brand.accent }}
          onClick={() => onLink?.(p.id)}
        >
          Link Accounts
        </button>
        <BannerDismiss onDismiss={onDismiss} />
      </div>
    </div>
  )
}

function MultiPartnerBanner({ partners, onLink, onDismiss }) {
  // "Beeverso and Comics Plus" / "A, B, and C" — the sentence has to read right
  // however many are left.
  const names = partners.map((p) => p.name)
  const listed =
    names.length === 2
      ? `${names[0]} and ${names[1]}`
      : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`

  return (
    <div className="cn-banner cn-banner--multi">
      <span className="cn-banner-marks">
        {partners.map((p) => (
          <PartnerMark key={p.id} id={p.id} size={30} />
        ))}
      </span>
      <div className="cn-banner-msg">
        <strong>Connect your reading apps</strong>
        <span className="cn-banner-pitch">
          Link {listed}, and Beanstack logs what you read there automatically.
        </span>
      </div>
      <div className="cn-banner-actions">
        <div className="cn-banner-ctas">
          {partners.map((p) => {
            const brand = PARTNER_BRANDS[p.id]
            return (
              <button
                key={p.id}
                className="cn-banner-cta"
                style={{ color: brand.accent, borderColor: brand.accent }}
                onClick={() => onLink?.(p.id)}
              >
                Link {p.name}
              </button>
            )
          })}
        </div>
        <BannerDismiss onDismiss={onDismiss} />
      </div>
    </div>
  )
}

function BannerDismiss({ onDismiss }) {
  return (
    <button className="cn-banner-x" onClick={() => onDismiss?.()} aria-label="Dismiss">
      <Icon name="x" size={14} stroke={2.2} />
    </button>
  )
}

// ─── Top-bar switcher — the "logo in the top right" the linked modal promises ─

export function PartnerSwitcher({ partners = [], connections = {}, onManage, onVisit }) {
  const linked = partners.filter((p) => connections[p.id])
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
        {linked.map((p) => (
          <PartnerMark key={p.id} id={p.id} size={26} />
        ))}
      </button>

      {open && (
        <div className="cn-switch-menu" role="menu">
          <div className="cn-switch-head">Your linked apps</div>
          {linked.map((p) => (
            <button
              key={p.id}
              className="cn-switch-item"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                onVisit?.(p.id)
              }}
            >
              <PartnerMark id={p.id} size={24} />
              <span className="cn-switch-item-main">
                <span className="cn-switch-item-name">{p.name}</span>
                <span className="cn-switch-item-acct">{connections[p.id].account}</span>
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

/**
 * `rows`: `{ id, partnerId, title, meta, minutes }` — already resolved by the
 * caller, since only the prototype knows how to name its own titles.
 */
export function AutoLoggedCard({ rows = [], className = '' }) {
  if (rows.length === 0) return null
  const total = rows.reduce((sum, r) => sum + r.minutes, 0)

  return (
    <aside className={`cn-auto-card ${className}`.trim()}>
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
              <span className="cn-auto-row-title">{r.title}</span>
              <span className="cn-auto-row-meta">{r.meta}</span>
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
