import { useState, useEffect, useRef } from 'react'
import { Modal } from '@components/Modal/Modal'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Table } from '@components/Table/Table'
import { IconButton } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import { FLAG_TYPE_CONFIG, POS_FLAG_CONFIG } from './SessionsTable'
import '@components/Modal/Modal.css'
import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Table/Table.css'
import '@components/Primitives/Primitives.css'
import './SessionModal.css'

const FLAG_DESCS = {
  'copy-paste': {
    label: 'Copied Response',
    desc: 'Response appears to be copied from an external source.',
  },
  unintelligible: {
    label: 'Unintelligible Response',
    desc: 'We were unable to understand one or more responses.',
  },
  'no-recall': {
    label: 'Unable to Recall Details',
    desc: 'Student could not describe specific events or characters.',
  },
  minimal: { label: 'Minimal Engagement', desc: 'Student gave very brief, low-effort responses.' },
  'quit-early': {
    label: 'Did Not Complete',
    desc: 'Student exited the conversation before finishing.',
  },
}

const POS_FLAG_DESCS = {
  'positive-sentiment': {
    label: 'Positive Sentiment',
    desc: 'Student expressed positive feeling about the text.',
  },
  'answer-length': { label: 'Long Answer', desc: 'Student gave a longer, engaged answer.' },
  'references-details': {
    label: 'References Details',
    desc: 'Student included specific details in their response.',
  },
  'makes-connection': {
    label: 'Made a Connection',
    desc: 'Student connected the text to their own life or experiences.',
  },
}

// Generate deterministic fake reading log entries leading up to the BTWB session
function fakeReadingLog(session) {
  const base = new Date(session.date)
  const hash = session.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const count = 3 + (hash % 3)
  const entries = []
  for (let i = count - 1; i >= 0; i--) {
    const daysBack = i === 0 ? 0 : i * 3 + (hash % 4)
    const d = new Date(base)
    d.setDate(d.getDate() - daysBack)
    entries.push({
      date: d,
      minutes: 15 + ((hash * (i + 2)) % 38),
      hasBTWB: i === 0,
    })
  }
  return entries
}

function FlagIconBadge({ typeCfg }) {
  return (
    <span className="sm2-flag-icon-badge" style={{ background: typeCfg.bg, color: typeCfg.color }}>
      {typeCfg.icon}
    </span>
  )
}

function FlagRow({ flag, onRequestRemove }) {
  const desc = FLAG_DESCS[flag.type] ?? { label: flag.label, desc: flag.description }
  const typeCfg = FLAG_TYPE_CONFIG[flag.type] ?? { icon: null, bg: '#FEF2F2', color: '#DC2626' }
  return (
    <div className="sm2-flag-row">
      <FlagIconBadge typeCfg={typeCfg} />
      <div className="sm2-flag-text">
        <div className="sm2-flag-label">{desc.label}</div>
        <div className="sm2-flag-desc">{flag.description || desc.desc}</div>
      </div>
      {onRequestRemove && (
        <button className="sm2-flag-remove" onClick={onRequestRemove} title="Remove flag">
          <Icon name="x" size={10} />
        </button>
      )}
    </div>
  )
}

function PosFlagRow({ flag, onRequestRemove }) {
  const desc = POS_FLAG_DESCS[flag.type] ?? { label: flag.type, desc: '' }
  const typeCfg = POS_FLAG_CONFIG[flag.type] ?? { icon: null, bg: '#F0FDF4', color: '#16A97A' }
  return (
    <div className="sm2-flag-row">
      <FlagIconBadge typeCfg={typeCfg} />
      <div className="sm2-flag-text">
        <div className="sm2-flag-label">{desc.label}</div>
        <div className="sm2-flag-desc">{desc.desc}</div>
      </div>
      {onRequestRemove && (
        <button className="sm2-flag-remove" onClick={onRequestRemove} title="Remove flag">
          <Icon name="x" size={10} />
        </button>
      )}
    </div>
  )
}

function ChatBubble({ msg }) {
  const isBenny = msg.role === 'benny'
  return (
    <div className={`sm2-bubble-wrap${isBenny ? ' sm2-bubble-wrap--benny' : ''}`}>
      {isBenny && <img className="sm2-bubble-avatar" src="/bs-prototypes/benny.png" alt="Benny" />}
      <div
        className={`sm2-bubble${isBenny ? ' sm2-bubble--benny' : ' sm2-bubble--student'}${msg.flagged ? ' sm2-bubble--flagged' : ''}`}
      >
        {msg.text}
      </div>
      {!isBenny && <div className="sm2-student-dot" />}
    </div>
  )
}

function AnnotationBlock({ msg }) {
  const isPositive = msg.sentiment === 'positive'
  return (
    <div
      className={`sm2-annotation${isPositive ? ' sm2-annotation--positive' : ' sm2-annotation--warning'}`}
    >
      {isPositive ? <Icon name="check" size={13} /> : <Icon name="alert-circle" size={13} />}
      <span>{msg.text}</span>
    </div>
  )
}

const RATING_LABELS = { green: 'Positive', yellow: 'Mixed', red: 'Disengaged' }
const CURRENT_USER = 'Mr. Garcia'

function newLogEntry(extra) {
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    by: CURRENT_USER,
    at: new Date().toISOString(),
    ...extra,
  }
}

export function SessionModal({
  session,
  allSessions = [],
  onClose,
  onUpdateSession,
  onSelectSession,
  onApproveRequest,
  onViewProfile,
  onPrev,
  onNext,
  sessionIdx,
  sessionCount,
}) {
  const [local, setLocal] = useState(null)
  const [sidebarTab, setSidebarTab] = useState('details')
  const [confirmingRating, setConfirmingRating] = useState(null)
  const [showChangeLog, setShowChangeLog] = useState(false)
  const [confirmingFlagRemoval, setConfirmingFlagRemoval] = useState(null)
  useEffect(() => {
    if (session) {
      setLocal(session)
      setSidebarTab('details')
      setConfirmingRating(null)
      setShowChangeLog(false)
      setConfirmingFlagRemoval(null)
    }
  }, [session])

  useEffect(() => {
    if (!session) return
    function handleKey(e) {
      if (e.target.matches('input, textarea, select, [contenteditable]')) return
      if (e.key === 'ArrowLeft' && onPrev) {
        e.preventDefault()
        onPrev()
      }
      if (e.key === 'ArrowRight' && onNext) {
        e.preventDefault()
        onNext()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [session, onPrev, onNext])

  const d = local || session
  if (!session || !d) return null

  function confirmRatingChange() {
    if (!confirmingRating) return
    const entry = newLogEntry({
      kind: 'rating',
      from: d.engagementRating,
      to: confirmingRating,
    })
    onUpdateSession?.({
      ...d,
      engagementRating: confirmingRating,
      changeLog: [...(d.changeLog || []), entry],
    })
    setConfirmingRating(null)
  }

  function removeFlag(flag, polarity) {
    const flagsKey = polarity === 'positive' ? 'positiveFlags' : 'flags'
    const descs = polarity === 'positive' ? POS_FLAG_DESCS : FLAG_DESCS
    const label = descs[flag.type]?.label ?? flag.type
    const entry = newLogEntry({
      kind: 'flag-removed',
      polarity,
      flagType: flag.type,
      flagLabel: label,
      flag,
    })
    onUpdateSession?.({
      ...d,
      [flagsKey]: d[flagsKey].filter((x) => x.id !== flag.id),
      changeLog: [...(d.changeLog || []), entry],
    })
  }

  function undoChange(entry) {
    const remaining = (d.changeLog || []).filter((e) => e.id !== entry.id)
    const base = { ...d, changeLog: remaining }
    if (entry.kind === 'rating') {
      onUpdateSession?.({ ...base, engagementRating: entry.from })
    } else if (entry.kind === 'flag-removed') {
      const key = entry.polarity === 'positive' ? 'positiveFlags' : 'flags'
      onUpdateSession?.({ ...base, [key]: [...(d[key] || []), entry.flag] })
    } else if (entry.kind === 'approved') {
      onUpdateSession?.({
        ...base,
        flags: [...(d.flags || []), ...(entry.clearedFlags || [])],
        type: entry.previousType ?? d.type,
      })
    }
  }

  const dateStr = new Date(d.date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  })
  const createdStr = new Date(d.date).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  })
  const hasFlags = d.flags && d.flags.length > 0
  const isApproved = d.changeLog?.some((e) => e.kind === 'approved')
  const canApprove = (d.type === 'flagged' || d.type === 'both') && !isApproved
  const hasPosFlags = d.positiveFlags && d.positiveFlags.length > 0
  const readingLog = fakeReadingLog(d)
  const studentBookTalks = allSessions
    .filter((s) => s.student.id === d.student.id && s.book.title === d.book.title)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <Modal open={!!session} onClose={onClose} variant="center" ariaLabel="Session detail">
      <div className="sm2-shell">
        {/* Top bar */}
        <div className="sm2-topbar">
          <div className="sm2-topbar-left">
            <span className="sm2-student-name">{d.student.name}</span>
            {onViewProfile && (
              <button className="sm2-view-profile" onClick={() => onViewProfile(d.student)}>
                <Icon name="user" size={13} />
                View profile
              </button>
            )}
          </div>
          <div className="sm2-topbar-right">
            {sessionCount > 0 && (
              <div className="sm2-nav">
                <button
                  className="sm2-nav-btn"
                  disabled={!onPrev}
                  onClick={onPrev}
                  title="Previous session (←)"
                >
                  <Icon name="chevron-left" size={14} stroke={2.2} />
                  <span className="sm2-nav-label">Prev</span>
                </button>
                <span className="sm2-nav-count">
                  <strong>{sessionIdx + 1}</strong>
                  <span className="sm2-nav-count-sep">of</span>
                  {sessionCount}
                </span>
                <button
                  className="sm2-nav-btn"
                  disabled={!onNext}
                  onClick={onNext}
                  title="Next session (→)"
                >
                  <span className="sm2-nav-label">Next</span>
                  <Icon name="chevron-right" size={14} stroke={2.2} />
                </button>
              </div>
            )}
            <IconButton variant="ghost" onClick={onClose} aria-label="Close" className="sm2-close">
              <Icon name="x" size={15} stroke={2.2} />
            </IconButton>
          </div>
        </div>

        {/* Two-column body */}
        <div className="sm2-columns">
          {/* Left: book info + reading log */}
          <div className="sm2-sidebar">
            <div className="sm2-cover" style={{ background: d.book.color }}>
              <Icon name="book" size={36} color="rgba(255,255,255,0.65)" />
            </div>
            <div className="sm2-cover-title">{d.book.title}</div>
            <div className="sm2-cover-author">{d.book.author}</div>
            {d.book.lexile && <div className="sm2-lexile">{d.book.lexile}</div>}

            <div className="sm2-sidebar-tabs">
              <button
                className={`sm2-sidebar-tab${sidebarTab === 'details' ? ' sm2-sidebar-tab--active' : ''}`}
                onClick={() => setSidebarTab('details')}
              >
                Details
              </button>
              <button
                className={`sm2-sidebar-tab${sidebarTab === 'sessions' ? ' sm2-sidebar-tab--active' : ''}`}
                onClick={() => setSidebarTab('sessions')}
              >
                Sessions
                <span className="sm2-sidebar-tab-count">{studentBookTalks.length}</span>
              </button>
            </div>

            {sidebarTab === 'details' && (
              <div className="sm2-meta-rows">
                {d.book.isbn && (
                  <div className="sm2-meta-row">
                    <span>ISBN</span>
                    <span>{d.book.isbn}</span>
                  </div>
                )}
                {d.book.published && (
                  <div className="sm2-meta-row">
                    <span>Published</span>
                    <span>{d.book.published}</span>
                  </div>
                )}
                {d.book.publisher && (
                  <div className="sm2-meta-row">
                    <span>Publisher</span>
                    <span>{d.book.publisher}</span>
                  </div>
                )}
                {d.book.format && (
                  <div className="sm2-meta-row">
                    <span>Format</span>
                    <span>{d.book.format}</span>
                  </div>
                )}
                {d.book.language && (
                  <div className="sm2-meta-row">
                    <span>Language</span>
                    <span>{d.book.language}</span>
                  </div>
                )}
                {d.book.pageCount && (
                  <div className="sm2-meta-row">
                    <span>Page count</span>
                    <span>{d.book.pageCount}</span>
                  </div>
                )}
              </div>
            )}

            {sidebarTab === 'sessions' && (
              <div className="sm2-sessions-tab">
                <div className="sm2-sessions-subhead">Book Talks</div>
                <div className="sm2-btwb-list">
                  {studentBookTalks.map((s) => {
                    const isCurrent = s.id === d.id
                    const sDate = new Date(s.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                    const types =
                      s.type === 'both'
                        ? [
                            { key: 'engagement', label: 'Engagement' },
                            { key: 'flagged', label: 'Integrity' },
                          ]
                        : s.type === 'engagement'
                          ? [{ key: 'engagement', label: 'Engagement' }]
                          : [{ key: 'flagged', label: 'Integrity' }]
                    return (
                      <button
                        key={s.id}
                        className={`sm2-btwb-row${isCurrent ? ' sm2-btwb-row--current' : ''}`}
                        onClick={() => {
                          if (!isCurrent) onSelectSession?.(s)
                        }}
                        disabled={isCurrent}
                      >
                        <span className="sm2-btwb-date">{sDate}</span>
                        <div className="sm2-btwb-tags">
                          {types.map((t) => (
                            <span key={t.key} className={`sm2-btwb-tag sm2-btwb-tag--${t.key}`}>
                              {t.label}
                            </span>
                          ))}
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="sm2-sessions-subhead sm2-sessions-subhead--logs">Reading Logs</div>
                <ul className="sm2-readlog-list">
                  {readingLog
                    .filter((e) => !e.hasBTWB)
                    .map((entry, i) => (
                      <li key={i} className="sm2-readlog-row">
                        <span className="sm2-readlog-date">
                          {entry.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="sm2-readlog-mins">{entry.minutes} min</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: session content */}
          <div className="sm2-main">
            <div className="sm2-section">
              <div className="sm2-section-head">
                <span className="sm2-section-title">Session Details</span>
              </div>
              <Table
                className="sm2-details-table"
                columns={[
                  { key: 'dateRead', label: 'Date Read' },
                  { key: 'unit', label: 'Unit' },
                ]}
                rows={[
                  {
                    id: 'details',
                    dateRead: dateStr,
                    unit: `${d.minutesLogged.toLocaleString()} Minutes`,
                  },
                ]}
              />
            </div>

            {d.engagementRating && (
              <div className="sm2-section">
                <div className="sm2-section-head">
                  <span className="sm2-section-title">Engagement Rating</span>
                  {d.changeLog?.some((e) => e.kind === 'rating') && (
                    <span className="sm2-rating-overridden-pill">
                      <Icon name="point-filled" size={10} />
                      Overridden
                    </span>
                  )}
                </div>
                <div className={`sm2-rating-segment sm2-rating-segment--${d.engagementRating}`}>
                  {['green', 'yellow', 'red'].map((val) => (
                    <button
                      key={val}
                      className={`sm2-rating-seg sm2-rating-seg--${val}${d.engagementRating === val ? ' sm2-rating-seg--active' : ''}`}
                      onClick={() => {
                        if (d.engagementRating !== val) setConfirmingRating(val)
                      }}
                      disabled={!!confirmingRating}
                    >
                      <span className={`sm2-rating-seg-dot sm2-rating-seg-dot--${val}`} />
                      {RATING_LABELS[val]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasPosFlags && (
              <div className="sm2-section">
                <div className="sm2-section-head">
                  <span className="sm2-section-title sm2-section-title--pos">
                    <Icon
                      name="flag"
                      size={13}
                      color="#16A97A"
                      style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }}
                    />
                    Flags
                  </span>
                </div>
                <div className="sm2-flags-list sm2-flags-list--pos">
                  {d.positiveFlags.map((f) => (
                    <PosFlagRow
                      key={f.id}
                      flag={f}
                      onRequestRemove={
                        onUpdateSession
                          ? () => setConfirmingFlagRemoval({ flag: f, polarity: 'positive' })
                          : null
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {hasFlags && (
              <div className="sm2-section">
                <div className="sm2-section-head">
                  <span className="sm2-section-title sm2-section-title--neg">
                    <Icon
                      name="flag"
                      size={13}
                      color="#DC2626"
                      style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }}
                    />
                    Flags
                  </span>
                </div>
                <div className="sm2-flags-list sm2-flags-list--neg">
                  {d.flags.map((f) => (
                    <FlagRow
                      key={f.id}
                      flag={f}
                      onRequestRemove={
                        onUpdateSession
                          ? () => setConfirmingFlagRemoval({ flag: f, polarity: 'negative' })
                          : null
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {d.changeLog?.length > 0 && (
              <ChangeLogSection
                log={d.changeLog}
                expanded={showChangeLog}
                onToggle={() => setShowChangeLog((v) => !v)}
                onUndo={undoChange}
              />
            )}

            <div className="sm2-section">
              <div className="sm2-section-head">
                <span className="sm2-section-title">Book Talks Conversation</span>
              </div>
              {d.status === 'unfinished' && (
                <div className="sm2-unfinished-banner">
                  <Icon name="clock" size={14} />
                  The student didn't finish this conversation — Benny is still waiting for a
                  response.
                </div>
              )}
              <div className="sm2-conversation">
                {d.conversation.map((msg, i) =>
                  msg.role === 'annotation' ? (
                    <AnnotationBlock key={i} msg={msg} />
                  ) : (
                    <ChatBubble key={i} msg={msg} />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sm2-footer">
          <Button variant="secondary">Edit Session</Button>
          <div className="sm2-footer-actions">
            <button className="sm2-btn sm2-btn--danger">Delete Session</button>
            {canApprove && (
              <Button
                variant="primary"
                onClick={() => onApproveRequest?.(d)}
                icon={<Icon name="check" size={13} stroke={2.2} />}
              >
                Approve Session
              </Button>
            )}
          </div>
        </div>
      </div>

      <RatingConfirmModal
        open={!!confirmingRating}
        from={d.engagementRating}
        to={confirmingRating}
        onCancel={() => setConfirmingRating(null)}
        onConfirm={confirmRatingChange}
      />

      <RemoveFlagConfirmModal
        pending={confirmingFlagRemoval}
        onCancel={() => setConfirmingFlagRemoval(null)}
        onConfirm={() => {
          if (confirmingFlagRemoval)
            removeFlag(confirmingFlagRemoval.flag, confirmingFlagRemoval.polarity)
          setConfirmingFlagRemoval(null)
        }}
      />
    </Modal>
  )
}

function ChangeLogSection({ log, expanded, onToggle, onUndo }) {
  return (
    <div className="sm2-section sm2-changelog-section">
      <div className="sm2-section-head">
        <span className="sm2-section-title">
          Change Log
          <span className="sm2-changelog-count">{log.length}</span>
        </span>
        <button className="sm2-changelog-toggle" onClick={onToggle}>
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      {expanded && (
        <div className="sm2-changelog-list">
          {[...log].reverse().map((e, i) => (
            <ChangeLogRow key={e.id} entry={e} onUndo={i === 0 ? () => onUndo(e) : null} />
          ))}
        </div>
      )}
    </div>
  )
}

function ChangeLogRow({ entry, onUndo }) {
  const when = new Date(entry.at).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
  return (
    <div className="sm2-changelog-row">
      <div className="sm2-changelog-row-main">
        {entry.kind === 'rating' && (
          <span className="sm2-changelog-pills">
            <span className={`sm2-rating-pill sm2-rating-pill--${entry.from}`}>
              {RATING_LABELS[entry.from]}
            </span>
            <Icon name="arrow-right" size={10} color="#94A3B8" />
            <span className={`sm2-rating-pill sm2-rating-pill--${entry.to}`}>
              {RATING_LABELS[entry.to]}
            </span>
          </span>
        )}
        {entry.kind === 'flag-removed' && (
          <span className={`sm2-changelog-flag sm2-changelog-flag--${entry.polarity}`}>
            {entry.polarity === 'positive' ? 'Positive flag removed' : 'Flag removed'}:{' '}
            {entry.flagLabel}
          </span>
        )}
        {entry.kind === 'approved' && (
          <span className="sm2-changelog-flag sm2-changelog-flag--approved">
            Session approved · {entry.removedCount} flag{entry.removedCount === 1 ? '' : 's'}{' '}
            cleared
          </span>
        )}
      </div>
      <div className="sm2-changelog-row-right">
        <div className="sm2-changelog-row-meta">
          {entry.by} · {when}
        </div>
        {onUndo && (
          <button className="sm2-changelog-undo" onClick={onUndo} title="Undo this change">
            <Icon name="undo" size={11} />
            Undo
          </button>
        )}
      </div>
    </div>
  )
}

export function ApproveConfirmModal({ open, flagCount, studentName, onCancel, onConfirm }) {
  if (!open) return null
  return (
    <Modal open={open} onClose={onCancel} variant="center" ariaLabel="Approve session">
      <div className="sm2-approve-shell">
        <div className="sm2-approve-icon">
          <Icon name="check" size={28} />
        </div>
        <div className="sm2-approve-title">Approve this session?</div>
        <div className="sm2-approve-body">
          {flagCount > 0 ? (
            <>
              This will clear{' '}
              <strong>
                {flagCount} flag{flagCount === 1 ? '' : 's'}
              </strong>{' '}
              from {studentName}'s Book Talk.{' '}
            </>
          ) : (
            <>This will mark {studentName}'s Book Talk as approved. </>
          )}
          The session will no longer appear in Flagged Sessions and the action will be logged.
        </div>
        <div className="sm2-approve-actions">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            icon={<Icon name="check" size={13} stroke={2.2} />}
          >
            Approve Session
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function RatingConfirmModal({ open, from, to, onCancel, onConfirm }) {
  if (!open || !from || !to) return null
  const ICON_BG = { green: '#DCFCE7', yellow: '#FEF3C7', red: '#FEE2E2' }
  const ICON_COLOR = { green: '#16A97A', yellow: '#D97706', red: '#DC2626' }
  return (
    <Modal open={open} onClose={onCancel} variant="center" ariaLabel="Change engagement rating">
      <div className="sm2-approve-shell">
        <div
          className="sm2-approve-icon"
          style={{ background: ICON_BG[to], color: ICON_COLOR[to] }}
        >
          <Icon name="arrow-right" size={26} />
        </div>
        <div className="sm2-approve-title">Change engagement rating?</div>
        <div className="sm2-approve-body">
          Change rating from{' '}
          <span className={`sm2-rating-pill sm2-rating-pill--${from}`}>{RATING_LABELS[from]}</span>{' '}
          to <span className={`sm2-rating-pill sm2-rating-pill--${to}`}>{RATING_LABELS[to]}</span>.{' '}
          This override will be recorded in the change log.
        </div>
        <div className="sm2-approve-actions">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Change rating
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function RemoveFlagConfirmModal({ pending, onCancel, onConfirm }) {
  if (!pending) return null
  const { flag, polarity } = pending
  const isPositive = polarity === 'positive'
  const descs = isPositive ? POS_FLAG_DESCS : FLAG_DESCS
  const label = descs[flag.type]?.label ?? flag.type
  return (
    <Modal open={true} onClose={onCancel} variant="center" ariaLabel="Remove flag">
      <div className="sm2-approve-shell">
        <div className="sm2-approve-icon sm2-approve-icon--danger">
          <Icon name="x" size={26} />
        </div>
        <div className="sm2-approve-title">Remove this {isPositive ? 'positive ' : ''}flag?</div>
        <div className="sm2-approve-body">
          The flag <strong>{label}</strong> will be removed from this Book Talk. This action will be
          recorded in the change log.
        </div>
        <div className="sm2-approve-actions">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Remove flag
          </Button>
        </div>
      </div>
    </Modal>
  )
}
