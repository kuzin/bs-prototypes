import { FLAG_TYPE_CONFIG, POS_FLAG_CONFIG } from './SessionsTable'
import { FlagIcon } from '@components/BsIcons/BsIcons'
import { Icon } from '@components/Icon/Icon'
import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import { SEV_ORDER, SITE } from '../data'
import '@components/BennyBubble/BennyBubble.css'
import './Overview.css'

export function HighlightCard({
  variant = 'neutral',
  title,
  description,
  sessions = [],
  viewAllLabel = 'View All',
  onViewAll,
  onSelectSession,
  // Reader roll-up mode: the row stands for a reader rather than a session, and
  // the right-hand slot carries how many Book Talks are behind them. This is
  // the app's `by_reader` shape (Student / Grade / count) read as a card.
  countOf,
  countLabel = 'Book Talks',
}) {
  return (
    <div className={`ov-card ov-card--${variant}`}>
      <div className="ov-card-head">
        <div className="ov-card-titles">
          <div className="ov-card-title">{title}</div>
          <div className="ov-card-desc">{description}</div>
        </div>
        {onViewAll && (
          <button className={`ov-view-all ov-view-all--${variant}`} onClick={onViewAll}>
            {viewAllLabel}
          </button>
        )}
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
              {countOf ? (
                <span className={`ov-count-pill ov-count-pill--${variant}`}>
                  {countOf(s)} {countLabel}
                </span>
              ) : (
                <>
                  {/* The app's own flag drawings, not a tinted glyph: these
                      rows are the same signals the session detail shows, and
                      the reviewer should recognise them by the same art.
                      `fallback` keeps an unmapped type from rendering blank. */}
                  {s.flags?.map((f) => (
                    <FlagIcon
                      key={f.id}
                      type={f.type}
                      fallback="negative"
                      size={24}
                      label={FLAG_TYPE_CONFIG[f.type]?.label ?? f.type}
                    />
                  ))}
                  {s.positiveFlags?.map((pf) => (
                    <FlagIcon
                      key={pf.id}
                      type={pf.type}
                      fallback="positive"
                      size={24}
                      label={POS_FLAG_CONFIG[pf.type]?.label ?? pf.type}
                    />
                  ))}
                </>
              )}
            </div>
            <Icon name="chevron-right" size={18} className="ov-row-chevron" />
          </button>
        ))}
      </div>
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
  const overThreshold = sessions.filter((s) => s.minutesLogged > SITE.warningThreshold).length

  // Safety signals are additive + orthogonal — only the Safety Signals prototype
  // attaches them, so this card/summary line stays hidden in SFR's own prototype.
  const safetySessions = sessions.filter((s) => s.safety)
  const safetyOpen = safetySessions
    .filter((s) => s.safety.status !== 'resolved')
    .sort((a, b) => SEV_ORDER[a.safety.severity] - SEV_ORDER[b.safety.severity])

  // The last two cards count *readers*, not sessions: the question they answer
  // is "who keeps turning up", which is the app's `by_reader` roll-up. One row
  // per reader, their most recent title, and how many are behind them.
  const byReader = (list) => {
    const seen = new Map()
    for (const s of list) {
      const key = s.student.id ?? s.student.name
      const at = seen.get(key)
      if (!at) seen.set(key, { session: s, count: 1 })
      else {
        at.count += 1
        if (s.date > at.session.date) at.session = s
      }
    }
    return [...seen.values()]
      .sort((a, b) => b.count - a.count)
      .map(({ session, count }) => ({ ...session, talkCount: count }))
  }

  const repeatFlags = byReader(flaggedSessions)
  const unfinishedByReader = byReader(unfinished)

  return (
    <div className="ov-shell">
      {/* Benny summary — the headline, then the three things worth acting on as
          a list rather than one long sentence you have to parse. */}
      <div className="ov-summary">
        <BennyBubble>
          Students started <strong>{totalBTWB}</strong> Book Talks with Benny and completed{' '}
          <strong>{completedBTWB}</strong> so far this week. Check out the highlights below to take
          action:
          <ul className="ov-summary-list">
            <li>
              Beanstack detected <strong>{overThreshold}</strong> logs over {SITE.warningThreshold}{' '}
              minutes
            </li>
            <li>Most students were positively engaged in their book talks</li>
            {safetyOpen.length > 0 && (
              <li>
                <strong>{safetyOpen.length}</strong> book{' '}
                {safetyOpen.length === 1 ? 'talk needs' : 'talks need'} a safety review this week
              </li>
            )}
          </ul>
        </BennyBubble>
      </div>

      {/* Highlights grid */}
      <div className="ov-grid">
        {safetySessions.length > 0 && (
          <HighlightCard
            variant="danger"
            title="Safety Risk"
            description="Students who may be at risk"
            sessions={safetyOpen.length ? safetyOpen : safetySessions}
            onViewAll={() => onGoToTab('safety', {})}
            onSelectSession={onSelectSession}
          />
        )}
        <HighlightCard
          variant="success"
          title="Reading Wins"
          description="Students with positive engagement Book Talks"
          sessions={greenSessions}
          onViewAll={() => onGoToTab('engagement', { rating: 'green' })}
          onSelectSession={onSelectSession}
        />
        <HighlightCard
          variant="warning"
          title="Take a Closer Look"
          description="Students with mixed engagement Book Talks"
          sessions={yellowSessions}
          onViewAll={() => onGoToTab('engagement', { rating: 'yellow' })}
          onSelectSession={onSelectSession}
        />
        <HighlightCard
          variant="intercede"
          title="Needs Support"
          description="Students with disengagement in their Book Talks"
          sessions={redSessions}
          onViewAll={() => onGoToTab('engagement', { rating: 'red' })}
          onSelectSession={onSelectSession}
        />
        <HighlightCard
          variant="danger"
          title="Repeat Flags"
          description="Students with the most flagged Book Talks"
          sessions={repeatFlags}
          countOf={(s) => s.talkCount}
          onViewAll={() => onGoToTab('flagged', {})}
          onSelectSession={onSelectSession}
        />
        <HighlightCard
          variant="neutral"
          title="Unfinished Book Talks"
          description="Students with the most in-progress Book Talks"
          sessions={unfinishedByReader}
          countOf={(s) => s.talkCount}
          onViewAll={() => onGoToTab('all', { status: 'unfinished' })}
          onSelectSession={onSelectSession}
        />
      </div>
    </div>
  )
}
