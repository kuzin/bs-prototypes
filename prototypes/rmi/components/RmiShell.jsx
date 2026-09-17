import { useEffect, useState } from 'react'
import { MainRail } from '@components/MainRail/MainRail'
import { Icon } from '@components/Icon/Icon'
import '@components/MainRail/MainRail.css'
import { asset } from '../assets'
import './RmiShell.css'

/**
 * The standalone app's chrome — `layouts/classroom.html.erb` in rmi-app.
 *
 * Its rail is the same rail the Beanstack admin wears (both descend from
 * `_admin_navigation.scss`), so this is the shared <MainRail>, given the
 * standalone product's two destinations instead of Beanstack's eight. The
 * active bar, the overflow behaviour and the phone drawer all come with it.
 *
 * What the standalone product adds is the account menu behind the avatar —
 * Billing & Invoices, Edit Account, Sign Out — because this is a self-serve
 * subscription rather than a school's admin login.
 */

// `icons/two-tone/rmi.svg` and `people.svg`, the app's own rail glyphs. They
// carry their own fill, so they're passed as nodes rather than PlumpyIcon names.
const NAV = [
  {
    id: 'indexes',
    label: 'Motivation Index',
    icon: <img src={asset('nav/rmi.svg')} alt="" width={24} height={24} />,
  },
  {
    id: 'readers',
    label: 'Readers',
    icon: <img src={asset('nav/people.svg')} alt="" width={24} height={24} />,
  },
]

const ACCOUNT_ITEMS = ['Billing & Invoices', 'Edit Account', 'Sign Out']

const PHONE = '(max-width: 700px)'

export function RmiShell({ section, onNavigate, educator, children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Below Sidebar's own mobile breakpoint the rail is replaced by a topbar, and
  // the hamburger promotes it to the full labelled menu — the product's phone
  // behaviour, and what <MainRail drawer> is for.
  const [isPhone, setIsPhone] = useState(
    () => typeof matchMedia !== 'undefined' && matchMedia(PHONE).matches,
  )
  useEffect(() => {
    const mq = matchMedia(PHONE)
    const sync = () => {
      setIsPhone(mq.matches)
      if (!mq.matches) setDrawerOpen(false)
    }
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  function select(item) {
    onNavigate(item.id)
    setDrawerOpen(false)
  }

  return (
    <div className="rmi-shell">
      {/* Phone-only topbar — hamburger opens the rail as a drawer. */}
      <div className="rmi-topbar">
        <button
          type="button"
          className="rmi-topbar-toggle"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation"
          aria-expanded={drawerOpen}
        >
          <Icon name="menu" size={18} stroke={2} />
        </button>
        <svg className="rmi-topbar-logo" viewBox="0 0 24 32" aria-hidden="true">
          <path d="M8.626 6.934c0 0-2.765-3.301-6.174-0.407-4.015 3.409-3.504 10.254 8.248 25.171 0.291 0.369 0.852 0.442 0.7-0.313-0.431-2.133-0.614-6.205 3.594-10.001 5.274-4.759 11.544-12.716 7.525-18.394-4.052-5.724-11.834-2.273-13.892 3.944z" />
        </svg>
        <button
          type="button"
          className="main-rail-avatar rmi-topbar-avatar"
          aria-label="Open account menu"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {educator.initials}
        </button>
      </div>

      {/* The rail's own bottom strip carries Support and the avatar. What's New
          is a Beanstack destination, so the standalone rail doesn't show it. */}
      <MainRail
        className="rmi-rail"
        items={NAV}
        active={section}
        onSelect={select}
        initials={educator.initials}
        whatsNew={false}
        onAvatarClick={() => setMenuOpen((o) => !o)}
      />

      {isPhone && drawerOpen && (
        <MainRail
          drawer
          items={NAV}
          active={section}
          onSelect={select}
          onClose={() => setDrawerOpen(false)}
          className="rmi-rail-drawer"
        />
      )}

      {menuOpen && (
        <>
          <div className="rmi-menu-scrim" onClick={() => setMenuOpen(false)} />
          <ul className="rmi-account-menu" role="menu">
            <li className="rmi-account-menu-head">
              <strong>{educator.name}</strong>
              <span>{educator.email}</span>
            </li>
            {ACCOUNT_ITEMS.map((label) => (
              <li key={label}>
                <button type="button" role="menuitem" onClick={() => setMenuOpen(false)}>
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <main className="rmi-content">
        <div className="rmi-page">{children}</div>
        <footer className="rmi-footer">© {new Date().getFullYear()}, Beanstack, Inc.</footer>
      </main>
    </div>
  )
}
