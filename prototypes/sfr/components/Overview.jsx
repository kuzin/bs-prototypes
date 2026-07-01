import {
  FlagIconBadge,
  FLAG_TYPE_CONFIG,
  POS_FLAG_CONFIG,
  SafetySeverityTag,
} from './SessionsTable'
import { Icon } from '@components/Icon/Icon'
import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import { SEV_ORDER } from '../data'
import '@components/BennyBubble/BennyBubble.css'
import './Overview.css'

export function HighlightCard({
  variant = 'neutral',
  title,
  description,
  sessions = [],
  viewAllLabel,
  onViewAll,
  onSelectSession,
}) {
  return (
    <div className={`ov-card ov-card--${variant}`}>
      <div className="ov-card-titles">
        <div className="ov-card-title">{title}</div>
        <div className="ov-card-desc">{description}</div>
      </div>
      <div className="ov-student-list">
        {sessions.slice(0, 3).map((s, i) => (
          <button
            key={i}
            className="ov-student-row ov-student-row--clickable"
            onClick={() => onSelectSession?.(s, sessions)}
          >
            <div className="ov-student-info">
              <span className="ov-student-name">{s.student.name}</span>
              <span className="ov-student-book">{s.book.title}</span>
            </div>
            <div className="ov-student-flags">
              {s.safety && <SafetySeverityTag severity={s.safety.severity} />}
              {s.flags?.map((f) => {
                const cfg = FLAG_TYPE_CONFIG[f.type]
                return cfg ? <FlagIconBadge key={f.id} type={f.type} cfg={cfg} /> : null
              })}
              {s.positiveFlags?.map((pf) => {
                const cfg = POS_FLAG_CONFIG[pf.type]
                return cfg ? <FlagIconBadge key={pf.id} type={pf.type} cfg={cfg} /> : null
              })}
            </div>
            <Icon name="chevron-right" size={14} className="ov-row-chevron" />
          </button>
        ))}
      </div>
      <button className={`ov-view-all ov-view-all--${variant}`} onClick={onViewAll}>
        {viewAllLabel} →
      </button>
    </div>
  )
}

export function Overview({ sessions, onGoToTab, onSelectSession }) {
  const flaggedSessions = sessions.filter(
    (s) => (s.type === 'flagged' || s.type === 'both') && (s.flags?.length ?? 0) > 0,
  )
  const greenSessions = sessions.filter((s) => s.engagementRating === 'green')
  const yellowSessions = sessions.filter((s) => s.engagementRating === 'yellow')
  const redSessions = sessions.filter((s) => s.engagementRating === 'red')
  const unfinished = sessions.filter((s) => s.status === 'unfinished')

  const totalBTWB = sessions.length
  const completedBTWB = sessions.filter((s) => s.status === 'completed').length
  const overThreshold = sessions.filter((s) => s.minutesLogged > 50).length

  // Safety signals are additive + orthogonal — only the Safety Signals prototype
  // attaches them, so this card/summary line stays hidden in SFR's own prototype.
  const safetySessions = sessions.filter((s) => s.safety)
  const safetyOpen = safetySessions
    .filter((s) => s.safety.status !== 'resolved')
    .sort((a, b) => SEV_ORDER[a.safety.severity] - SEV_ORDER[b.safety.severity])

  return (
    <div className="ov-shell">
      {/* Benny summary */}
      <div className="ov-summary">
        <BennyBubble>
          {safetyOpen.length > 0 && (
            <>
              <strong>{safetyOpen.length}</strong> Book{' '}
              {safetyOpen.length === 1 ? 'Talk needs' : 'Talks need'} a safety review this week —
              see Safety Signals below.{' '}
            </>
          )}
          Students started <strong>{totalBTWB}</strong> Book Talks with Benny and completed{' '}
          <strong>{completedBTWB}</strong> so far this week. Most students are positively engaged in
          the books they finished, while Beanstack detected <strong>{overThreshold}</strong> logs
          over your site's 50-minute warning. Check out the highlights below to take action.
        </BennyBubble>
      </div>

      {/* Highlights grid */}
      <div className="ov-grid">
        {safetySessions.length > 0 && (
          <HighlightCard
            variant="danger"
            title="Safety Signals"
            description="Students who may be at risk — review and respond"
            sessions={safetyOpen.length ? safetyOpen : safetySessions}
            viewAllLabel="View all safety signals"
            onViewAll={() => onGoToTab('safety', {})}
            onSelectSession={onSelectSession}
          />
        )}
        <HighlightCard
          variant="danger"
          title="Validate / Intercede"
          description="Students with multiple flagged integrity sessions"
          sessions={flaggedSessions}
          totalCount={flaggedSessions.length}
          viewAllLabel="View all flagged sessions"
          onViewAll={() => onGoToTab('flagged', {})}
          onSelectSession={onSelectSession}
        />
        <HighlightCard
          variant="success"
          title="Celebrate"
          description="Students with positive engagement Book Talks"
          sessions={greenSessions}
          totalCount={greenSessions.length}
          viewAllLabel="View all engagement sessions"
          onViewAll={() => onGoToTab('engagement', { rating: 'green' })}
          onSelectSession={onSelectSession}
        />
        <HighlightCard
          variant="warning"
          title="Review / Assess"
          description="Students with mixed engagement Book Talks"
          sessions={yellowSessions}
          totalCount={yellowSessions.length}
          viewAllLabel="View all mixed sessions"
          onViewAll={() => onGoToTab('engagement', { rating: 'yellow' })}
          onSelectSession={onSelectSession}
        />
        <HighlightCard
          variant="intercede"
          title="Intercede"
          description="Students showing disengagement in their Book Talks"
          sessions={redSessions}
          totalCount={redSessions.length}
          viewAllLabel="View all disengaged sessions"
          onViewAll={() => onGoToTab('engagement', { rating: 'red' })}
          onSelectSession={onSelectSession}
        />
        <HighlightCard
          variant="neutral"
          title="Give Students Time"
          description="Students with unfinished Benny conversations"
          sessions={unfinished}
          totalCount={unfinished.length}
          viewAllLabel="View all unfinished conversations"
          onViewAll={() => onGoToTab('all', { status: 'unfinished' })}
          onSelectSession={onSelectSession}
        />
      </div>
    </div>
  )
}
