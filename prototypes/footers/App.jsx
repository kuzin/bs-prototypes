import { useEffect, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { APPS, JoyfulFooter } from './JoyfulFooter'
import './App.css'

// Exported so a prototype can render the real footer rather than a stale
// hand-rolled one — logging-flow's dashboard uses the `beanstack` entry.
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

function SunIcon() {
  return <Icon name="sun" size={13} aria-hidden="true" />
}

function MoonIcon() {
  return <Icon name="moon" size={13} aria-hidden="true" />
}
