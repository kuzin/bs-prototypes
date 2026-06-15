import React from 'react'
import { Icon } from '@components/Icon/Icon'
import {
  DotsButton,
  RatingDot,
  FlagCount,
  PosFlagCount,
  FlagTypeIcons,
  TypePill,
} from './SessionsTable'
import '@components/Table/Table.css'
import '@components/Pill/Pill.css'
import './SessionsTable.css'
import './ReaderGroupedView.css'

// Session-badge helpers (RatingDot, FlagCount, PosFlagCount, FlagTypeIcons,
// TypePill) are shared from ./SessionsTable — imported above.

export function ReaderGroupedView({
  sessions,
  onSelectSession,
  onApproveRequest,
  onViewProfile,
  showTypeColumn = true,
  showFlagIcons = false,
  showPosFlags = true,
  showEngagementColumn = true,
  onClearFilters,
}) {
  const groups = []
  const seen = {}
  for (const s of sessions) {
    const id = s.student.id
    if (!seen[id]) {
      seen[id] = { student: s.student, sessions: [] }
      groups.push(seen[id])
    }
    seen[id].sessions.push(s)
  }

  if (groups.length === 0)
    return (
      <div className="rgv-empty-wrap">
        <div className="rgv-empty">
          <span>No sessions match your filters.</span>
          {onClearFilters && (
            <button className="tbl-clear-filters-btn" onClick={onClearFilters}>
              Clear filters
            </button>
          )}
        </div>
      </div>
    )

  const colCount =
    (showTypeColumn ? 1 : 0) + (showEngagementColumn ? 1 : 0) + (showPosFlags ? 1 : 0) + 4 // date, title, [type], [engagement], [pos-flags], int-flags, action

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
              {showPosFlags && (
                <th className="tbl-th">
                  <Icon name="flag" size={13} color="#16A97A" />
                </th>
              )}
              <th className="tbl-th">
                <Icon name="flag" size={13} color="#DC2626" />
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
                      {onViewProfile ? (
                        <button
                          className="rgv-name rgv-name--link"
                          onClick={() => onViewProfile(student)}
                        >
                          {student.name}
                        </button>
                      ) : (
                        <span className="rgv-name">{student.name}</span>
                      )}
                    </div>
                  </td>
                </tr>
                {gs.map((s) => {
                  const date = new Date(s.date)
                  const dateStr = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                  return (
                    <tr
                      key={s.id}
                      className="tbl-row tbl-row--clickable"
                      onClick={() => onSelectSession(s)}
                    >
                      <td className="tbl-td">
                        <span className="sess-date">{dateStr}</span>
                      </td>
                      <td className="tbl-td">
                        <span className="sess-title-cell">
                          <span className="sess-book-title">{s.book.title}</span>
                          {s.status === 'unfinished' && (
                            <span className="sess-unfinished-badge">Unfinished</span>
                          )}
                        </span>
                      </td>
                      {showTypeColumn && (
                        <td className="tbl-td">
                          <TypePill session={s} type={s.type} />
                        </td>
                      )}
                      {showEngagementColumn && (
                        <td className="tbl-td">
                          <RatingDot rating={s.engagementRating} />
                        </td>
                      )}
                      {showPosFlags && (
                        <td className="tbl-td">
                          <PosFlagCount positiveFlags={s.positiveFlags} />
                        </td>
                      )}
                      <td className="tbl-td">
                        {showFlagIcons ? (
                          <FlagTypeIcons flags={s.flags} />
                        ) : (
                          <FlagCount flags={s.flags} />
                        )}
                      </td>
                      <td className="tbl-td tbl-td--action" onClick={(e) => e.stopPropagation()}>
                        <DotsButton
                          session={s}
                          onSelectSession={onSelectSession}
                          onApproveRequest={onApproveRequest}
                          onViewProfile={onViewProfile}
                        />
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
