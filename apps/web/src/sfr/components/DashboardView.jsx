import { Sidebar } from '../../ris/components/Sidebar'
import { Button } from '../../ris/components/Button'
import { Skeleton } from '../../ris/components/Primitives'
import '../../ris/components/RisLayout.css'
import '../../ris/components/Sidebar.css'
import '../../ris/components/Primitives.css'
import '../../MainRail.css'
import './DashboardView.css'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'overview' },
]

export function DashboardView({ sessions, onGoToSfr }) {
  const flaggedCount = sessions.filter(s => s.type === 'flagged' || s.type === 'both').length

  return (
    <div className="ris-layout">
      <Sidebar
        title="Admin Dashboard"
        subtitle="As a Media Specialist"
        nav={NAV}
        active="dashboard"
        badges={{ 'sessions-review': flaggedCount }}
        mainRailIndex={3}
      />

      <div className="rl-content">
        <div className="rl-header">
          <div className="rl-header-identity">
            <div className="rl-header-avatar" style={{ background: 'linear-gradient(135deg, #059669 0%, #16A97A 100%)' }}>
              CR
            </div>
            <div className="rl-header-text">
              <div className="rl-header-name-row">
                <span className="rl-header-name">Good morning, Ms. Reyes</span>
              </div>
              <div className="rl-header-meta">Classic and Readers · Thursday, May 21, 2026</div>
            </div>
          </div>
        </div>

        <div className="rl-page">
          {/* SfR CTA — prominent widget */}
          <div className="dash-sfr-cta" onClick={onGoToSfr}>
            <div className="dash-sfr-cta-body">
              <div className="dash-sfr-cta-title">Reading Sessions Need Review</div>
              <div className="dash-sfr-cta-desc">
                {flaggedCount} flagged {flaggedCount === 1 ? 'session' : 'sessions'} from the past 7 days are waiting for your attention. Review Book Talk conversations and take action on potential integrity concerns.
              </div>
              <div className="dash-sfr-cta-meta">
                <span className="dash-sfr-badge">{flaggedCount} flagged</span>
                <span className="dash-sfr-badge dash-sfr-badge--yellow">3 yellow engagement</span>
                <span className="dash-sfr-badge dash-sfr-badge--neutral">2 unfinished</span>
              </div>
            </div>
            <Button variant="primary" accent="#DC2626" className="dash-sfr-cta-btn" onClick={e => { e.stopPropagation(); onGoToSfr() }}>
              Review Sessions →
            </Button>
          </div>

          {/* Recent activity — skeleton placeholder */}
          <div className="sv-card" style={{ marginTop: 16 }}>
            <div className="sv-card-header">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Skeleton width={180} height={16} />
                <Skeleton width={200} height={12} />
              </div>
              <Skeleton width={64} height={14} />
            </div>
            <div className="dash-activity-list">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="dash-activity-row">
                  <Skeleton shape="circle" width={34} height={34} style={{ flexShrink: 0 }} />
                  <div className="dash-activity-info">
                    <Skeleton width={120} height={13} style={{ marginBottom: 5 }} />
                    <Skeleton width={90} height={11} />
                  </div>
                  <div className="dash-activity-right">
                    <Skeleton width={44} height={13} style={{ marginBottom: 5 }} />
                    <Skeleton width={44} height={11} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
