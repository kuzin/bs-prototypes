import React from 'react'
import { Pill } from '../../ris/components/Pill'
import { DotsButton, FlagIconBadge, FLAG_TYPE_CONFIG, POS_FLAG_CONFIG } from './SessionsTable'
import '../../ris/components/Table.css'
import '../../ris/components/Pill.css'
import './SessionsTable.css'
import './ReaderGroupedView.css'

function StatusBadge({ status }) {
  if (status === 'unfinished') return <span className="sess-status sess-status--partial">Unfinished</span>
  return null
}

const RATING_CONFIG = {
  green:  { color: '#16A97A', label: 'Positive',  bg: '#F0FDF4' },
  yellow: { color: '#D97706', label: 'Mixed',      bg: '#FFFBEB' },
  red:    { color: '#DC2626', label: 'Disengaged', bg: '#FEF2F2' },
}

function RatingDot({ rating }) {
  if (!rating) return <span className="sess-na">—</span>
  const cfg = RATING_CONFIG[rating]
  return (
    <span className="sess-rating" style={{ background: cfg.bg }}>
      <span className="sess-rating-dot" style={{ background: cfg.color }} />
      <span style={{ color: cfg.color, fontWeight: 700, fontSize: 12 }}>{cfg.label}</span>
    </span>
  )
}

function FlagCount({ flags }) {
  if (!flags || flags.length === 0) return <span className="sess-na">—</span>
  return (
    <span className="sess-flags sess-flags--neg">
      <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v12"/>
        <path d="M3 2h8l-2 4 2 4H3"/>
      </svg>
      {flags.length}
    </span>
  )
}

function PosFlagCount({ flags }) {
  if (!flags || flags.length === 0) return <span className="sess-na">—</span>
  if (flags.length >= 3) {
    return (
      <span className="sess-flags sess-flags--pos">
        <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="#16A97A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 2v12"/><path d="M3 2h8l-2 4 2 4H3"/>
        </svg>
        {flags.length}
      </span>
    )
  }
  return (
    <span className="sess-flag-icons">
      {flags.map((f, i) => {
        const cfg = POS_FLAG_CONFIG[f.type] ?? { label: f.type, color: '#16A97A', bg: '#F0FDF4', icon: null }
        return <FlagIconBadge key={i} type={f.type} cfg={cfg} />
      })}
    </span>
  )
}

function FlagTypeIcons({ flags }) {
  if (!flags || flags.length === 0) return <span className="sess-na">—</span>
  if (flags.length >= 3) return <FlagCount flags={flags} />
  return (
    <span className="sess-flag-icons">
      {flags.map((f, i) => {
        const cfg = FLAG_TYPE_CONFIG[f.type] ?? { label: f.type, color: '#DC2626', bg: '#FEF2F2', icon: null }
        return <FlagIconBadge key={i} type={f.type} cfg={cfg} />
      })}
    </span>
  )
}

function TypePill({ session, type }) {
  if (session?.changeLog?.some(e => e.kind === 'approved')) {
    return <Pill color="#16A97A" variant="soft" size="sm">Approved</Pill>
  }
  if (type === 'flagged')    return <Pill color="#DC2626" variant="soft" size="sm">Flagged</Pill>
  if (type === 'engagement') return <Pill color="#0DA7BC" variant="soft" size="sm">Engagement</Pill>
  return null
}

export function ReaderGroupedView({ sessions, onSelectSession, onApproveRequest, onViewProfile, showTypeColumn = true, showFlagIcons = false, showPosFlags = true, showEngagementColumn = true, onClearFilters }) {
  const groups = []
  const seen = {}
  for (const s of sessions) {
    const id = s.student.id
    if (!seen[id]) { seen[id] = { student: s.student, sessions: [] }; groups.push(seen[id]) }
    seen[id].sessions.push(s)
  }

  if (groups.length === 0) return (
    <div className="rgv-empty-wrap">
      <div className="rgv-empty">
        <span>No sessions match your filters.</span>
        {onClearFilters && <button className="tbl-clear-filters-btn" onClick={onClearFilters}>Clear filters</button>}
      </div>
    </div>
  )

  const colCount = (showTypeColumn ? 1 : 0) + (showEngagementColumn ? 1 : 0) + (showPosFlags ? 1 : 0) + 4  // date, title, [type], [engagement], [pos-flags], int-flags, action

  return (
    <div className="rgv-shell">
      <div style={{ overflowX: 'auto' }}>
        <table className="tbl tbl--compact rgv-table">
          <colgroup>
            <col style={{ width: 90 }} />
            <col />
            {showTypeColumn && <col style={{ width: 120 }} />}
            {showEngagementColumn && <col style={{ width: 130 }} />}
            {showPosFlags && <col style={{ width: showFlagIcons ? 80 : 52 }} />}
            <col style={{ width: showFlagIcons ? 80 : 52 }} />
            <col style={{ width: 52 }} />
          </colgroup>
          <thead>
            <tr>
              <th className="tbl-th">DATE</th>
              <th className="tbl-th">TITLE</th>
              {showTypeColumn && <th className="tbl-th">TYPE</th>}
              {showEngagementColumn && <th className="tbl-th">ENGAGEMENT</th>}
              {showPosFlags && <th className="tbl-th">
                <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="#16A97A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v12"/><path d="M3 2h8l-2 4 2 4H3"/></svg>
              </th>}
              <th className="tbl-th">
                <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v12"/><path d="M3 2h8l-2 4 2 4H3"/></svg>
              </th>
              <th className="tbl-th" />
            </tr>
          </thead>
          <tbody>
            {groups.map(({ student, sessions: gs }) => (
              <React.Fragment key={student.id}>
                <tr className="rgv-group-row">
                  <td colSpan={colCount} className="rgv-group-cell">
                    <div className="rgv-header">
                      {onViewProfile
                        ? <button className="rgv-name rgv-name--link" onClick={() => onViewProfile(student)}>{student.name}</button>
                        : <span className="rgv-name">{student.name}</span>}
                    </div>
                  </td>
                </tr>
                {gs.map(s => {
                  const date = new Date(s.date)
                  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  return (
                    <tr key={s.id} className="tbl-row tbl-row--clickable" onClick={() => onSelectSession(s)}>
                      <td className="tbl-td"><span className="sess-date">{dateStr}</span></td>
                      <td className="tbl-td"><span className="sess-title-cell"><span className="sess-book-title">{s.book.title}</span>{s.status === 'unfinished' && <span className="sess-unfinished-badge">Unfinished</span>}</span></td>
                      {showTypeColumn && <td className="tbl-td"><TypePill session={s} type={s.type} /></td>}
                      {showEngagementColumn && <td className="tbl-td"><RatingDot rating={s.engagementRating} /></td>}
                      {showPosFlags && <td className="tbl-td"><PosFlagCount flags={s.positiveFlags} /></td>}
                      <td className="tbl-td">{showFlagIcons ? <FlagTypeIcons flags={s.flags} /> : <FlagCount flags={s.flags} />}</td>
                      <td className="tbl-td tbl-td--action" onClick={e => e.stopPropagation()}>
                        <DotsButton session={s} onSelectSession={onSelectSession} onApproveRequest={onApproveRequest} onViewProfile={onViewProfile} />
                      </td>
                    </tr>
                  )
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
