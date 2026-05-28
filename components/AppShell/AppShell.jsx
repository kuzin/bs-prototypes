import { Sidebar } from '@components/Sidebar/Sidebar'
import { BackBar } from '@components/BackBar/BackBar'
import './AppShell.css'

/**
 * Generic admin shell: MainRail + sidebar chrome on the left, a content column
 * on the right. The sidebar is fully prop-driven (see Sidebar); this just wires
 * it to a content slot with an optional back bar and overlay layer.
 *
 * <AppShell
 *   sidebar={{ title: 'Insights', nav: NAV, active: page, onNavigate: setPage }}
 *   className="my-prototype"          // extra class on the outer shell
 *   contentClassName="my-content"     // extra class on the content column
 *   backBar={{ label: 'Back', onClick: goBack }}
 *   after={<StudentPanel ... />}       // fixed overlays, siblings of content
 * >
 *   <div className="app-shell-page">…page…</div>
 * </AppShell>
 */
export function AppShell({
  sidebar,
  className = '',
  contentClassName = '',
  backBar,
  after,
  children,
}) {
  return (
    <div className={['app-shell', className].filter(Boolean).join(' ')}>
      <Sidebar {...sidebar} />

      <div className={['app-shell-content', contentClassName].filter(Boolean).join(' ')}>
        {backBar && <BackBar label={backBar.label} onClick={backBar.onClick} />}
        {children}
      </div>

      {after}
    </div>
  )
}
