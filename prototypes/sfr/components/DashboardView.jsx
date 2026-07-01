import { MainRail } from '@components/MainRail/MainRail'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { Skeleton } from '@components/Primitives/Primitives'
import { SessionsToReview } from './SessionsToReview'
import '@components/MainRail/MainRail.css'
import '@components/Button/Button.css'
import '@components/Primitives/Primitives.css'
import '../../admin-dashboard/index.css'
import './DashboardView.css'

// SFR dashboard, mocked as the new Admin-Dashboard-V2 teacher home. Every card
// is a greyed-out skeleton placeholder EXCEPT the hero "Sessions to Review"
// card (SessionsToReview) — fed by live SFR sessions, with the dashboard's four
// alerts worked into it — so all attention lands on the sessions card. View-only.

const Caret = () => <Icon name="chevron-down" size={11} />

// One grid cell, mirroring admin-dashboard CardGrid's static markup
// (.adm-grid-card → .adm-cell[--scroll]) without the drag machinery.
function Cell({ scroll, children }) {
  return (
    <div className="adm-grid-card">
      <div className={`adm-cell${scroll ? ' adm-cell--scroll' : ''}`}>{children}</div>
    </div>
  )
}

// ── Skeleton placeholders for the de-emphasized cards ──────────────────────
function SkelRows({ n = 5 }) {
  return Array.from({ length: n }).map((_, i) => (
    <div key={i} className="sfr-skel-row">
      <Skeleton shape="circle" width={32} height={32} style={{ flexShrink: 0 }} />
      <div className="sfr-skel-lines">
        <Skeleton width="58%" height={11} />
        <Skeleton width="36%" height={9} />
      </div>
      <Skeleton width={40} height={11} />
    </div>
  ))
}

function SkelCard({ rows = 5, action = true }) {
  return (
    <div className="adm-w">
      <div className="adm-w-head">
        <Skeleton width={150} height={14} />
        {action && <Skeleton width={84} height={26} style={{ borderRadius: 8 }} />}
      </div>
      <div className="adm-w-body sfr-skel-body">
        <SkelRows n={rows} />
      </div>
    </div>
  )
}

function SkelStatsCard() {
  return (
    <div className="adm-w">
      <div className="adm-w-head">
        <Skeleton width={150} height={14} />
        <Skeleton width={84} height={26} style={{ borderRadius: 8 }} />
      </div>
      <div className="adm-w-body sfr-skel-stats">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="sfr-skel-stat">
            <Skeleton width={64} height={24} />
            <Skeleton width={88} height={10} />
          </div>
        ))}
      </div>
    </div>
  )
}

function SkelRailCard({ rows = 4 }) {
  return (
    <div className="adm-rail-card">
      <div className="adm-rail-head">
        <Skeleton width={120} height={14} />
      </div>
      <div className="sfr-skel-railbody">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} width="100%" height={12} />
        ))}
      </div>
    </div>
  )
}

export function DashboardView({ sessions, onGoToSfr }) {
  return (
    <div className="adm-shell">
      <MainRail activeIndex={3} />
      <div className="adm sfr-dash">
        <header className="adm-topbar">
          <div className="sfr-greet">
            <h1 className="adm-h1">Good morning, Ms. Reyes 👋</h1>
            <div className="sfr-greet-sub">Classic and Readers · Thursday, May 21, 2026</div>
          </div>
          <div className="adm-topbar-r">
            <Button variant="primary" iconRight={<Caret />}>
              Log Reading
            </Button>
          </div>
        </header>

        {/* Feature announcement bar — skeletoned along with the other chrome. */}
        <div className="sfr-skel-feature">
          <Skeleton shape="circle" width={38} height={38} style={{ flexShrink: 0 }} />
          <div className="sfr-skel-lines" style={{ flex: 1 }}>
            <Skeleton width={220} height={13} />
            <Skeleton width="60%" height={10} />
          </div>
          <Skeleton width={110} height={36} style={{ borderRadius: 10 }} />
        </div>

        <div className="adm-main">
          <div className="adm-grid-wrap">
            <div className="adm-rows">
              <div className="adm-row">
                <Cell>
                  <SkelCard rows={6} />
                </Cell>
                <Cell scroll>
                  <SessionsToReview sessions={sessions} onGoToSfr={onGoToSfr} />
                </Cell>
              </div>
              <div className="adm-row">
                <Cell>
                  <SkelStatsCard />
                </Cell>
                <Cell>
                  <SkelCard rows={4} />
                </Cell>
              </div>
            </div>
          </div>

          <aside className="adm-rail">
            <SkelRailCard rows={4} />
            <SkelRailCard rows={3} />
            <SkelRailCard rows={3} />
          </aside>
        </div>
      </div>
    </div>
  )
}
