import { useEffect, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import './App.css'

const APPS = [
  {
    id: 'comicsplus',
    name: 'Comics Plus',
    accent: '#7BC242',
    logo: <ComicsPlusLogo />,
    hasLanguage: false,
    hasAppStores: true,
    links: ['Reader Support', 'Share Code'],
    legalLinks: ['FAQ'],
  },
  {
    id: 'mydot',
    name: 'Comics Plus · Admin Portal',
    accent: '#1FBABF',
    logo: <ComicsPlusLogo />,
    hasLanguage: false,
    hasAppStores: false,
    links: ['Library Support', 'Status'],
    moreLinks: ['Marc Records', 'Featured List', 'Institutions'],
    legalLinks: ['FAQ'],
  },
  {
    id: 'beanstack',
    name: 'Beanstack',
    accent: '#0DA7BC',
    logo: <BeanstackLogo />,
    hasLanguage: true,
    hasAppStores: true,
    links: ['Share Code'],
    legalLinks: ['FAQ', 'Contact'],
  },
  {
    id: 'rmi',
    name: 'RMI Classroom',
    accent: '#0DA7BC',
    logo: <RmiLogo />,
    hasLanguage: true,
    hasAppStores: false,
    links: ['Research Brief', 'Educator Guide', 'Sample Reports'],
    legalLinks: ['FAQ', 'Contact'],
  },
]

export function App() {
  const [mode, setMode] = useState('light')

  useEffect(() => {
    document.body.dataset.theme = mode
    return () => {
      delete document.body.dataset.theme
    }
  }, [mode])

  return (
    <>
      <div className="ft-shell" data-theme={mode}>
        <header className="ft-header">
          <div className="ft-header-inner">
            <div>
              <h1 className="ft-title">Unified Joyful Footer</h1>
              <p className="ft-subtitle">
                A single footer pattern, used across all four apps with each brand's identity
                intact. Built on a shared <strong>Joyful Reading Co.</strong> attribution row.
              </p>
            </div>
            <ThemeToggle mode={mode} onChange={setMode} />
          </div>
        </header>

        <main className="ft-main">
          <div className="ft-grid">
            {APPS.map((app) => (
              <AppPanel key={app.id} app={app} mode={mode} />
            ))}
          </div>
        </main>
      </div>
      <PrototypeNav currentHref="/bs-prototypes/footers/" />
    </>
  )
}

function ThemeToggle({ mode, onChange }) {
  return (
    <div className="ft-toggle" role="tablist" aria-label="Theme">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'light'}
        className={`ft-toggle-btn${mode === 'light' ? ' is-active' : ''}`}
        onClick={() => onChange('light')}
      >
        <SunIcon />
        Light
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'dark'}
        className={`ft-toggle-btn${mode === 'dark' ? ' is-active' : ''}`}
        onClick={() => onChange('dark')}
      >
        <MoonIcon />
        Dark
      </button>
    </div>
  )
}

function AppPanel({ app, mode }) {
  return (
    <article className="ft-app" style={{ '--accent': app.accent }}>
      <div className="ft-app-label">
        <span className="ft-app-dot" style={{ background: app.accent }} />
        {app.name}
      </div>

      <div className="ft-window">
        <BrowserChrome />
        <div className="ft-window-fade" aria-hidden="true">
          <span>app content</span>
        </div>
        <JoyfulFooter app={app} mode={mode} />
      </div>
    </article>
  )
}

function BrowserChrome() {
  return (
    <div className="ft-chrome">
      <div className="ft-chrome-traffic">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

function JoyfulFooter({ app, mode }) {
  return (
    <footer className="jf-footer" data-theme={mode}>
      <div className="jf-footer-top">
        <div className="jf-footer-identity">
          <div className="jf-footer-logo">{app.logo}</div>
        </div>

        <div className="jf-footer-right">
          <ul className="jf-footer-links">
            {app.links.map((item) => (
              <li key={item}>
                <a href="#" tabIndex={-1}>
                  {item}
                </a>
              </li>
            ))}
            {app.moreLinks?.length > 0 && (
              <li>
                <MoreMenu items={app.moreLinks} />
              </li>
            )}
          </ul>

          {app.hasAppStores && (
            <div className="jf-footer-stores">
              <a
                href="#"
                className="jf-footer-store-btn"
                tabIndex={-1}
                aria-label="Download on the App Store"
              >
                <AppleIcon />
              </a>
              <a
                href="#"
                className="jf-footer-store-btn"
                tabIndex={-1}
                aria-label="Get it on Google Play"
              >
                <GooglePlayIcon />
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="jf-footer-divider" />

      <div className="jf-footer-bottom">
        <a className="jf-footer-attribution" href="#" tabIndex={-1}>
          <JoyfulMark />
          <span>
            <span className="jf-footer-attribution-made">Made by</span>{' '}
            <strong>Joyful Reading Co.</strong>
            <span className="jf-footer-attribution-year"> © 2026</span>
          </span>
        </a>

        <div className="jf-footer-bottom-right">
          {app.hasLanguage && <LanguageButton />}
          {app.legalLinks?.map((item) => (
            <a key={item} href="#" tabIndex={-1}>
              {item}
            </a>
          ))}
          <a href="#" tabIndex={-1}>
            Terms
          </a>
          <a href="#" tabIndex={-1}>
            Privacy
          </a>
        </div>
      </div>
    </footer>
  )
}

function LanguageButton() {
  return (
    <button className="jf-footer-lang" type="button" tabIndex={-1}>
      <GoogleGIcon />
      Select Language
      <CaretIcon />
    </button>
  )
}

function MoreMenu({ items }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="jf-more">
      <button
        type="button"
        className="jf-more-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        More
        <CaretIcon />
      </button>
      {open && (
        <>
          <div className="jf-more-backdrop" onClick={() => setOpen(false)} />
          <div className="jf-more-menu" role="menu">
            {items.map((item) => (
              <a
                key={item}
                href="#"
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault()
                  setOpen(false)
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Logos ─────────────────────────────────────────────────────────────────

function ComicsPlusLogo() {
  return (
    <span className="cp-logo">
      <span className="cp-logo-mark" aria-hidden="true">
        <svg viewBox="0 0 102 102" width="22" height="22">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M98.2227 58.6785C85.7427 105.439 72.7927 103.839 46.5427 100.579C20.2927 97.3185 -1.92733 94.5685 0.132672 46.5085C2.19267 -1.54147 32.8227 -2.10147 58.8827 1.13853C84.9427 4.36853 110.703 11.9185 98.2227 58.6885V58.6785Z"
            fill="#0DA7BC"
          />
          <path
            d="M73.0781 23.6389H28.4181C25.3481 23.6389 22.8281 26.1489 22.8281 29.2289L22.7981 62.7389C22.7981 65.8289 25.2981 68.3289 28.3881 68.3289H32.5781C33.3481 68.3289 33.9781 68.9489 33.9781 69.7289V75.5589C33.9781 78.0489 36.9881 79.2889 38.7481 77.5389L47.1281 69.1589C47.6481 68.6289 48.3581 68.3389 49.0981 68.3389H73.0781C76.1481 68.3389 78.6681 65.8289 78.6681 62.7489V29.2289C78.6681 26.1589 76.1581 23.6389 73.0781 23.6389Z"
            fill="#fff"
          />
        </svg>
      </span>
      <span className="cp-logo-wordmark" aria-hidden="true">
        <svg viewBox="0 0 301 36" height="13" fill="none">
          <path
            d="M9.88 26.66H27.79L26.24 35.17H6.01C2.68 35.17 0 32.49 0 29.1V6.13C0 2.8 2.68 0.120003 6.01 0.120003H27.91L26.18 8.75H9.88V26.66Z"
            fill="currentColor"
          />
          <path
            d="M59.14 6.13V29.1C59.14 32.49 56.4 35.17 53.07 35.17H36.53C33.2 35.17 30.52 32.49 30.52 29.1V6.13C30.52 2.8 33.2 0.120003 36.53 0.120003H53.07C56.4 0.120003 59.14 2.8 59.14 6.13ZM49.27 8.75H40.4V26.66H49.27V8.75Z"
            fill="currentColor"
          />
          <path
            d="M97.05 0.0600052V35.17H87.17V18.63L80.03 32.91H79.91L73.01 18.57V35.17H63.13V8.63H60.63L62.24 0L73.01 0.0600052L79.97 12.73L87.11 0.0600052H97.05Z"
            fill="currentColor"
          />
          <path d="M110.43 35.17H100.61V0.0600052H110.43V35.17Z" fill="currentColor" />
          <path
            d="M123.05 26.66H140.96L139.41 35.17H119.18C115.85 35.17 113.17 32.49 113.17 29.1V6.13C113.17 2.8 115.85 0.120003 119.18 0.120003H141.08L139.35 8.75H123.05V26.66Z"
            fill="currentColor"
          />
          <path
            d="M142.68 6.19C142.68 2.8 145.36 0.120003 148.69 0.120003H169.52L167.97 8.75H152.56V12.56L165.35 14.11C168.21 14.35 171.3 16.55 171.3 19.94V29.16C171.3 32.49 168.56 35.17 165.23 35.17H143.81L145.36 26.66H161.43V22.73L148.46 21.18C147.81 21.12 142.69 20.64 142.69 15.23V6.19H142.68Z"
            fill="currentColor"
          />
          <path
            d="M204.09 6.13V18.15C204.09 21.48 201.41 24.16 198.08 24.16H185.47V35.17H175.65L175.59 8.69H173.03L174.64 0.0600052H198.08C201.41 0.0600052 204.09 2.8 204.09 6.13ZM194.27 8.69H185.4V15.65H194.27V8.69Z"
            fill="#0DA7BC"
          />
          <path
            d="M234.01 26.54L232.46 35.17H206.99V0.0600052H216.81V26.54H234.01Z"
            fill="#0DA7BC"
          />
          <path
            d="M264.84 0.0600052L264.78 35.17H242.29C238.96 35.17 236.22 32.49 236.22 29.16V0.0600052H246.1V26.54H254.97V0.0600052H264.85H264.84Z"
            fill="#0DA7BC"
          />
          <path
            d="M268.11 6.19C268.11 2.8 270.79 0.120003 274.12 0.120003H294.95L293.4 8.75H277.99V12.56L290.78 14.11C293.64 14.35 296.73 16.55 296.73 19.94V29.16C296.73 32.49 293.99 35.17 290.66 35.17H269.24L270.79 26.66H286.86V22.73L273.89 21.18C273.24 21.12 268.12 20.64 268.12 15.23V6.19H268.11Z"
            fill="#0DA7BC"
          />
          <path
            d="M298.17 5.52C296.9 5.52 295.87 4.49 295.87 3.22C295.87 1.95 296.9 0.920006 298.17 0.920006C299.44 0.920006 300.47 1.95 300.47 3.22C300.47 4.49 299.44 5.52 298.17 5.52ZM298.17 1.21C297.06 1.21 296.15 2.11 296.15 3.23C296.15 4.35 297.06 5.25 298.17 5.25C299.28 5.25 300.18 4.35 300.18 3.23C300.18 2.11 299.28 1.21 298.17 1.21Z"
            fill="#0DA7BC"
          />
          <path
            d="M297.19 4.46001V2.03H298.22C298.48 2.03 298.67 2.05001 298.79 2.10001C298.91 2.15001 299 2.22 299.07 2.33C299.14 2.44 299.18 2.57001 299.18 2.71001C299.18 2.89001 299.13 3.04 299.02 3.16C298.91 3.28 298.75 3.35 298.54 3.38C298.65 3.44 298.73 3.51 298.8 3.58C298.87 3.65 298.96 3.79 299.08 3.98L299.38 4.45H298.79L298.43 3.92C298.3 3.73 298.22 3.61 298.17 3.56C298.12 3.51 298.07 3.48001 298.02 3.46001C297.97 3.44001 297.89 3.43001 297.77 3.43001H297.67V4.45H297.18L297.19 4.46001ZM297.69 3.05H298.05C298.29 3.05 298.43 3.05 298.49 3.02C298.55 2.99 298.59 2.97 298.63 2.92C298.67 2.87 298.68 2.81001 298.68 2.74001C298.68 2.66001 298.66 2.59001 298.61 2.54001C298.56 2.49001 298.5 2.46 298.42 2.44C298.38 2.44 298.26 2.44 298.06 2.44H297.68V3.06L297.69 3.05Z"
            fill="#0DA7BC"
          />
        </svg>
      </span>
    </span>
  )
}

function BeanstackLogo() {
  return (
    <span className="bs-logo">
      <span className="bs-logo-mark" aria-hidden="true">
        <svg viewBox="0 0 102 102" width="22" height="22">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M98.2227 58.6785C85.7427 105.439 72.7927 103.839 46.5427 100.579C20.2927 97.3185 -1.92733 94.5685 0.132672 46.5085C2.19267 -1.54147 32.8227 -2.10147 58.8827 1.13853C84.9427 4.36853 110.703 11.9185 98.2227 58.6885V58.6785Z"
            fill="currentColor"
          />
          <path
            d="M30.1529 40.1789C24.5529 48.7989 29.4329 61.2189 60.0529 82.2189C60.8129 82.7389 61.9029 82.5488 61.1929 81.2388L60.9829 80.8589C58.9929 77.0289 56.6829 69.7589 62.2229 60.6189L62.6629 59.8889C69.7029 48.0289 76.4429 30.2489 65.8529 22.1589C54.9629 13.8389 42.3029 24.6888 41.9929 37.4088L41.7729 37.2788C40.5429 36.5888 34.4129 33.6189 30.1529 40.1789Z"
            fill="#fff"
          />
        </svg>
      </span>
      <span className="bs-logo-text">beanstack</span>
    </span>
  )
}

function RmiLogo() {
  return (
    <span className="bs-logo">
      <span className="bs-logo-mark" aria-hidden="true">
        <svg viewBox="0 0 102 102" width="22" height="22">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M98.2227 58.6785C85.7427 105.439 72.7927 103.839 46.5427 100.579C20.2927 97.3185 -1.92733 94.5685 0.132672 46.5085C2.19267 -1.54147 32.8227 -2.10147 58.8827 1.13853C84.9427 4.36853 110.703 11.9185 98.2227 58.6885V58.6785Z"
            fill="currentColor"
          />
          <path
            d="M30.1529 40.1789C24.5529 48.7989 29.4329 61.2189 60.0529 82.2189C60.8129 82.7389 61.9029 82.5488 61.1929 81.2388L60.9829 80.8589C58.9929 77.0289 56.6829 69.7589 62.2229 60.6189L62.6629 59.8889C69.7029 48.0289 76.4429 30.2489 65.8529 22.1589C54.9629 13.8389 42.3029 24.6888 41.9929 37.4088L41.7729 37.2788C40.5429 36.5888 34.4129 33.6189 30.1529 40.1789Z"
            fill="#fff"
          />
        </svg>
      </span>
      <span className="bs-logo-text" style={{ letterSpacing: '0.04em' }}>
        RMI
      </span>
    </span>
  )
}

// Tiny corner-mark used in the bottom attribution. Reads as a stylized leaf/heart.
function JoyfulMark() {
  return (
    <span className="jf-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="14" height="14">
        <path
          d="M12 3.4c1.2-1.6 4.4-2 6.4 0 2 2 1.6 5-.7 7.4l-5.7 5.7-5.7-5.7C3.9 8.4 3.5 5.4 5.6 3.4c2-2 5.1-1.6 6.4 0z"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}

// ─── Icons ─────────────────────────────────────────────────────────────────

function SunIcon() {
  return <Icon name="sun" size={13} aria-hidden="true" />
}

function MoonIcon() {
  return <Icon name="moon" size={13} aria-hidden="true" />
}

function GoogleGIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function CaretIcon() {
  return <Icon name="chevron-down" size={10} aria-hidden="true" />
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true">
      <path d="M11.04 8.45c-.02-1.7 1.39-2.52 1.46-2.56-.79-1.16-2.03-1.32-2.47-1.34-1.05-.11-2.05.62-2.59.62-.54 0-1.36-.6-2.24-.59-1.16.02-2.22.67-2.82 1.71-1.2 2.08-.31 5.16.87 6.85.58.83 1.27 1.76 2.18 1.72.88-.03 1.21-.57 2.27-.57 1.06 0 1.36.57 2.28.55.94-.02 1.54-.84 2.11-1.68.67-.96.94-1.9.96-1.95-.02-.01-1.84-.71-1.86-2.76zM9.36 3.51c.47-.58.79-1.39.7-2.19-.68.03-1.5.45-1.99 1.03-.44.51-.83 1.34-.73 2.13.76.06 1.55-.39 2.02-.97z" />
    </svg>
  )
}

function GooglePlayIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
      <path d="M2.7 1.3c-.3.2-.4.5-.4.9v11.6c0 .4.1.7.4.9l6.5-6.7z" fill="#34A853" />
      <path d="M11.3 5.3 9.2 8l2.1 2.7 3-1.7c.9-.5.9-1.8 0-2.3l-3-1.4z" fill="#FBBC04" />
      <path d="m9.2 8 2.1-2.7L3.6 1.1c-.3-.2-.6-.2-.9 0z" fill="#EA4335" />
      <path d="m9.2 8-6.5 6.7c.3.2.6.2.9.1l7.7-4.1z" fill="#4285F4" />
    </svg>
  )
}
