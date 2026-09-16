import './Header.css'

/**
 * The nav header. Two shapes, both real:
 *
 *  - `variant="root"` — the four tab roots (Home / Log / Discover / Community). A large
 *    left-aligned section title with the account avatar on the right. In the app this is
 *    headerLeft=<RootViewTitle> + headerRight=<ProfileBar>.
 *  - default — every pushed screen: a centred title with a back affordance.
 *
 * Height is `60 + safe-top` everywhere (HEADER_HEIGHT in NavigationStyles.ts). The app bumps it
 * to 80 on iPhone-12-series devices via a DeviceManager check; we do not model that fork.
 */
export function Header({
  variant = 'stack',
  title,
  onBack,
  backLabel = 'Back',
  right,
  shadow = true,
  background = 'var(--m-white)',
}) {
  return (
    <header
      className={`m-header m-header-${variant}${shadow ? ' has-shadow' : ''}`}
      style={{ background }}
    >
      {variant === 'root' ? (
        <>
          <h1 className="m-t-section-title m-header-root-title">{title}</h1>
          <div className="m-header-side m-header-right">{right}</div>
        </>
      ) : (
        <>
          <div className="m-header-side">
            {onBack && (
              <button
                type="button"
                className="m-header-back"
                onClick={onBack}
                aria-label={backLabel}
              >
                <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
                  <path
                    d="M10 2 2 10l8 8"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
          <h1 className="m-t-header-bar-title m-header-title">{title}</h1>
          <div className="m-header-side m-header-right">{right}</div>
        </>
      )}
    </header>
  )
}
