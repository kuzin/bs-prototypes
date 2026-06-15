import {
  FlagIconBadge,
  FLAG_TYPE_CONFIG,
  POS_FLAG_CONFIG,
  SafetySeverityTag,
} from './SessionsTable'
import { Icon } from '@components/Icon/Icon'
import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import '@components/BennyBubble/BennyBubble.css'
import './Overview.css'

export function HighlightCard({
  variant,
  icon,
  title,
  description,
  sessions = [],
  viewAllLabel,
  onViewAll,
  onSelectSession,
}) {
  const VARIANTS = {
    danger: {
      bg: '#FEF2F2',
      border: '#FECACA',
      iconBg: '#FEE2E2',
      iconColor: '#DC2626',
      tagBg: '#FEE2E2',
      tagColor: '#991B1B',
    },
    success: {
      bg: '#F0FDF4',
      border: '#BBF7D0',
      iconBg: '#DCFCE7',
      iconColor: '#16A97A',
      tagBg: '#DCFCE7',
      tagColor: '#14532D',
    },
    warning: {
      bg: '#FFFBEB',
      border: '#FDE68A',
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      tagBg: '#FEF3C7',
      tagColor: '#78350F',
    },
    neutral: {
      bg: '#F0F9FF',
      border: '#BAE6FD',
      iconBg: '#E0F2FE',
      iconColor: '#0369A1',
      tagBg: '#E0F2FE',
      tagColor: '#0C4A6E',
    },
    intercede: {
      bg: '#FFF1F2',
      border: '#FECDD3',
      iconBg: '#FFE4E6',
      iconColor: '#E11D48',
      tagBg: '#FFE4E6',
      tagColor: '#9F1239',
    },
  }
  const v = VARIANTS[variant] ?? VARIANTS.neutral

  return (
    <div className="ov-card" style={{ background: v.bg, borderColor: v.border }}>
      <div className="ov-card-header">
        <div className="ov-card-icon" style={{ background: v.iconBg, color: v.iconColor }}>
          {icon}
        </div>
        <div className="ov-card-titles">
          <div className="ov-card-title">{title}</div>
          <div className="ov-card-desc">{description}</div>
        </div>
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
            <Icon name="chevron-right" size={12} className="ov-row-chevron" />
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
  const SEV_ORDER = { critical: 0, warning: 1, possible: 2 }
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
            icon={<Icon name="shield-heart" size={18} />}
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
          icon={<Icon name="flag" size={18} />}
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
          icon={<Icon name="flame" size={18} />}
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
          icon={<Icon name="star" size={18} />}
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
          icon={<Icon name="flame" size={18} />}
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
          icon={<Icon name="clock" size={18} />}
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
