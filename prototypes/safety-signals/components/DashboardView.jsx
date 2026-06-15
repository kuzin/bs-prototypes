import { AppShell } from '@components/AppShell/AppShell'
import { Skeleton } from '@components/Primitives/Primitives'
import { AlertsBanner } from '@components/AlertsBanner/AlertsBanner'
import { SITE, isSafety, isSafetyOpen } from '../data'
import '@components/Primitives/Primitives.css'
import '../../sfr/components/DashboardView.css'

export function DashboardView({ sessions, onGoToReview }) {
  const open = sessions.filter(isSafetyOpen)
  const critical = open.filter((s) => s.safety.severity === 'critical').length
  const otherSafety = open.length - critical
  const flagged = sessions.filter(
    (s) => !isSafety(s) && (s.type === 'flagged' || s.type === 'both') && s.flags?.length,
  ).length

  const alerts = [
    critical > 0 && {
      id: 'critical',
      level: 'critical',
      title: `${critical} critical safety ${critical === 1 ? 'signal' : 'signals'}`,
      description: 'Self-harm, threats, or abuse flagged in Book Talks — review and escalate.',
      action: 'Review',
      tab: 'safety',
    },
    otherSafety > 0 && {
      id: 'other',
      level: 'warning',
      title: `${otherSafety} safety ${otherSafety === 1 ? 'signal' : 'signals'} to review`,
      description: 'Distress, bullying, or low-confidence keyword matches flagged this week.',
      action: 'Review',
      tab: 'safety',
    },
    flagged > 0 && {
      id: 'integrity',
      level: 'info',
      title: `${flagged} flagged for reading integrity`,
      description: 'Possible copied or low-effort responses in Book Talk conversations.',
      action: 'Review',
      tab: 'flagged',
    },
  ].filter(Boolean)

  return (
    <AppShell mainRailIndex={3}>
      <div className="app-shell-header">
        <div className="app-shell-header-identity">
          <div
            className="app-shell-header-avatar"
            style={{ background: 'linear-gradient(135deg, #DC2626 0%, #F87171 100%)' }}
          >
            MR
          </div>
          <div className="app-shell-header-text">
            <div className="app-shell-header-name-row">
              <span className="app-shell-header-name">Good morning, {SITE.admin}</span>
            </div>
            <div className="app-shell-header-meta">{SITE.school} · Monday, June 15, 2026</div>
          </div>
        </div>
      </div>

      <div className="app-shell-page">
        {/* Alerts block (shared AlertsBanner) */}
        {alerts.length > 0 && (
          <>
            <div className="dh-alerts-head">
              <span className="dh-alerts-title">Alerts</span>
              <span className="dh-alerts-count">{alerts.length}</span>
            </div>
            <AlertsBanner alerts={alerts} onNavigate={(tab) => onGoToReview(tab)} />
          </>
        )}

        {/* Recent activity — skeleton placeholder */}
        <div className="dh-card">
          <div className="dh-card-head">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Skeleton width={160} height={16} />
              <Skeleton width={210} height={12} />
            </div>
            <Skeleton width={64} height={14} />
          </div>
          <div className="dash-activity-list">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="dash-activity-row">
                <Skeleton shape="circle" width={34} height={34} style={{ flexShrink: 0 }} />
                <div className="dash-activity-info">
                  <Skeleton width={130} height={13} style={{ marginBottom: 5 }} />
                  <Skeleton width={90} height={11} />
                </div>
                <div className="dash-activity-right">
                  <Skeleton width={48} height={13} style={{ marginBottom: 5 }} />
                  <Skeleton width={48} height={11} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
