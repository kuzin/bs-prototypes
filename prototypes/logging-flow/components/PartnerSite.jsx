import { Icon } from '@components/Icon/Icon'
import { PartnerBrand } from '@components/PartnerBrand/PartnerBrand'

import { CONNECTIONS } from '../connections'
import { BOOKS } from '../data'
import { BookCover } from './BookCover'
import './ConnectFlow.css'

/**
 * The shell for anything rendered on a partner's own site — their header bar,
 * page tint, and footer. Used by the account handoff and by the catalog the
 * top-bar switcher jumps to.
 *
 * `overlay` renders after the site (the handoff's cards sit on a scrim above it).
 */
export function PartnerSite({ partnerId, headRight = 'Log In', onBack, hint, children, overlay }) {
  const p = CONNECTIONS[partnerId]
  if (!p) return null
  const c = p.chrome

  return (
    <div className="cf-overlay" role="dialog" aria-modal="true" aria-label={p.name}>
      <div
        className="cf-site"
        style={{ background: c.pageBg, color: c.pageText, '--cf-link': c.link }}
      >
        <header className="cf-site-head" style={{ background: c.headerBg, color: c.headerText }}>
          <PartnerBrand id={partnerId} size="md" invert={p.modal.theme === 'dark'} />
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
 */
export function PartnerCatalog({ partnerId, account, onBack }) {
  const p = CONNECTIONS[partnerId]
  if (!p) return null
  const titles = Object.values(BOOKS).filter((b) => b.partner === partnerId)

  return (
    <PartnerSite
      partnerId={partnerId}
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
            Linked to Beanstack — your reading logs itself
          </span>
        </div>

        <div className="cf-catalog-grid">
          {titles.map((b) => (
            <button key={b.id} className="cf-catalog-item" type="button">
              <BookCover book={b} size="lg" />
              <span className="cf-catalog-title">{b.title}</span>
              <span className="cf-catalog-author">{b.author}</span>
            </button>
          ))}
        </div>
      </div>
    </PartnerSite>
  )
}
