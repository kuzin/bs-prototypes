import { useEffect, useState } from 'react'
import { MainRail } from '@components/MainRail/MainRail'
import { Flyout, FlyoutMenu, FlyoutMenuItem } from '@components/Flyout/Flyout'
import '@components/Flyout/Flyout.css'
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

/**
 * The index glyph is the product's own logo with the blob dropped — just the
 * three bars, in `currentColor` so the rail's active state tints it. Paths are
 * the logo's own (`rmi-logo.svg`), which is why it reads as the same mark at
 * 24px as the one in the box above it.
 */
function IndexBars() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.0663 10.1004C15.2708 10.1004 14.6263 10.7606 14.6263 11.5754L14.6263 15.214C14.6263 16.0288 15.2708 16.6891 16.0663 16.6891C16.8617 16.6891 17.5063 16.0288 17.5063 15.214L17.5063 11.5754C17.5063 10.7606 16.8617 10.1004 16.0663 10.1004ZM7.93376 7.41551C7.13831 7.41551 6.49377 8.07574 6.49377 8.89054L6.49378 15.214C6.49378 16.0288 7.13832 16.6891 7.93377 16.6891C8.72922 16.6891 9.37375 16.0288 9.37375 15.214L9.37374 8.89054C9.37374 8.07574 8.72921 7.41551 7.93376 7.41551ZM12.0462 11.969C11.2508 11.969 10.6063 12.6292 10.6063 13.444V15.214C10.6063 16.0288 11.2508 16.6891 12.0462 16.6891C12.8417 16.6891 13.4862 16.0288 13.4862 15.214V13.444C13.4862 12.6292 12.8417 11.969 12.0462 11.969Z" />
    </svg>
  )
}

const NAV = [
  { id: 'indexes', label: 'Motivation Index', icon: <IndexBars /> },
  {
    // `icons/two-tone/people.svg` — carries its own fill, so it's a node rather
    // than a PlumpyIcon name.
    id: 'readers',
    label: 'Readers',
    icon: <img src={asset('nav/people.svg')} alt="" width={24} height={24} />,
  },
]

const ACCOUNT_ITEMS = ['Billing & Invoices', 'Edit Account', 'Sign Out']

/**
 * The account menu, anchored to whichever avatar opened it. `right-end` puts it
 * beside the rail and bottom-aligned, which is where the app's opens; Flyout
 * flips it if the side runs out of room, and keeps it clear of any clipping
 * ancestor on its own.
 */
function AccountMenu({ educator, placement }) {
  return (
    <Flyout
      placement={placement}
      trigger={({ toggle, open }) => (
        <button
          type="button"
          className="main-rail-avatar"
          title="Account"
          aria-label="Open account menu"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={toggle}
        >
          {educator.initials}
        </button>
      )}
    >
      {({ close }) => (
        <FlyoutMenu>
          <div className="rmi-account-head">
            <strong>{educator.name}</strong>
            <span>{educator.email}</span>
          </div>
          {ACCOUNT_ITEMS.map((label) => (
            <FlyoutMenuItem key={label} onClick={close}>
              {label}
            </FlyoutMenuItem>
          ))}
        </FlyoutMenu>
      )}
    </Flyout>
  )
}

const PHONE = '(max-width: 700px)'

export function RmiShell({ section, onNavigate, educator, children }) {
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
        <button
          type="button"
          className="rmi-rail-logo"
          aria-label="Reading Motivation Index"
          onClick={() => onNavigate('indexes')}
        >
          <img src={asset('rmi-logo.svg')} alt="" width={30} height={30} />
        </button>
        <AccountMenu educator={educator} placement="bottom-end" />
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
        avatar={<AccountMenu educator={educator} placement="right-end" />}
        logo={
          <button
            type="button"
            className="rmi-rail-logo"
            aria-label="Reading Motivation Index"
            title="Reading Motivation Index"
            onClick={() => onNavigate('indexes')}
          >
            <img src={asset('rmi-logo.svg')} alt="" width={36} height={36} />
          </button>
        }
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

      <main className="rmi-content">
        <div className="rmi-page">{children}</div>
        <footer className="rmi-footer">© {new Date().getFullYear()}, Beanstack, Inc.</footer>
      </main>
    </div>
  )
}
