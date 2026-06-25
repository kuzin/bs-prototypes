import { AppShell } from '@components/AppShell/AppShell'
import { Skeleton } from '@components/Primitives/Primitives'
import { AlertsBanner } from '@components/AlertsBanner/AlertsBanner'
import { isSafety, isSafetyOpen } from '../data'
import '@components/Primitives/Primitives.css'
import './DashboardView.css'

export function DashboardView({ sessions, onGoToSfr }) {
  const openSafety = sessions.filter(isSafetyOpen)
  const critical = openSafety.filter((s) => s.safety.severity === 'critical').length
  const otherSafety = openSafety.length - critical
  const flagged = sessions.filter(
    (s) =>
      !isSafety(s) && (s.type === 'flagged' || s.type === 'both') && (s.flags?.length ?? 0) > 0,
  ).length
  const positive = sessions.filter((s) => s.engagementRating === 'green').length

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
      id: 'other-safety',
      level: 'warning',
      title: `${otherSafety} safety ${otherSafety === 1 ? 'signal' : 'signals'} to review`,
      description: 'Distress, bullying, or low-confidence keyword matches flagged this week.',
      action: 'Review',
      tab: 'safety',
    },
    flagged > 0 && {
      id: 'flagged',
      level: 'info',
      title: `${flagged} flagged for reading integrity`,
      description: 'Possible copied or low-effort responses in Book Talk conversations.',
      action: 'Review',
      tab: 'flagged',
    },
    positive > 0 && {
      id: 'positive',
      level: 'positive',
      title: `${positive} students positively engaged`,
      description: 'Strong Book Talk conversations worth celebrating.',
      action: 'Review',
      tab: 'engagement',
    },
  ].filter(Boolean)

  return (
    <AppShell mainRailIndex={3}>
      <div className="app-shell-header">
        <div className="app-shell-header-identity">
          <div
            className="app-shell-header-avatar"
            style={{ background: 'linear-gradient(135deg, #059669 0%, #16A97A 100%)' }}
          >
            CR
          </div>
          <div className="app-shell-header-text">
            <div className="app-shell-header-name-row">
              <span className="app-shell-header-name">Good morning, Ms. Reyes</span>
            </div>
            <div className="app-shell-header-meta">
              Classic and Readers · Thursday, May 21, 2026
            </div>
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
            <AlertsBanner alerts={alerts} onNavigate={(tab) => onGoToSfr(tab)} />
          </>
        )}

        {/* Recent activity — skeleton placeholder */}
        <div className="dh-card">
          <div className="dh-card-head">
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
    </AppShell>
  )
}
