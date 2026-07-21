import { useState, useEffect, useRef } from 'react'
import { Modal } from '@components/Modal/Modal'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { IconButton } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import { SAFETY_SEVERITY } from './SessionsTable'
import '@components/Modal/Modal.css'
import '@components/Button/Button.css'
import '@components/Form/Form.css'
import '@components/Tabs/Tabs.css'
import '@components/Primitives/Primitives.css'
import './SessionModal.css'

// Shared flag palette so flag cards match the Safety / Engagement card language.
const NEG_FLAG_COLORS = { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' }
const POS_FLAG_COLORS = { color: '#16A97A', bg: '#F0FDF4', border: '#BBF7D0' }

const FLAG_DESCS = {
  'copy-paste': {
    label: 'Copied Response',
    desc: 'Response appears to be copied from an external source.',
    icon: 'copy',
  },
  unintelligible: {
    label: 'Unintelligible Response',
    desc: 'We were unable to understand one or more responses.',
    icon: 'wave',
  },
  'no-recall': {
    label: 'Unable to Recall Details',
    desc: 'Student could not describe specific events or characters.',
    icon: 'help',
  },
  minimal: {
    label: 'Minimal Engagement',
    desc: 'Student gave very brief, low-effort responses.',
    icon: 'align-left',
  },
  'quit-early': {
    label: 'Did Not Complete',
    desc: 'Student exited the conversation before finishing.',
    icon: 'circle-x',
  },
}

const POS_FLAG_DESCS = {
  'positive-sentiment': {
    label: 'Positive Sentiment',
    desc: 'Student expressed positive feeling about the text.',
    icon: 'smile',
  },
  'answer-length': {
    label: 'Long Answer',
    desc: 'Student gave a longer, engaged answer.',
    icon: 'list',
  },
  'references-details': {
    label: 'References Details',
    desc: 'Student included specific details in their response.',
    icon: 'search',
  },
  'makes-connection': {
    label: 'Made a Connection',
    desc: 'Student connected the text to their own life or experiences.',
    icon: 'link',
  },
}

// Unified review card — shared by the Safety signal, the Engagement rating, and
// each Flag so all three read with one design language: a colored icon badge, a
// colored bold label, a muted description, and an optional trailing action.
function ReviewCard({ icon, color, bg, border, label, desc, action, className = '' }) {
  return (
    <div
      className={`sm2-review-card${className ? ' ' + className : ''}`}
      style={{ background: bg, borderColor: border }}
    >
      <div className="sm2-review-card-main">
        <span className="sm2-review-badge" style={{ background: bg, color }}>
          <Icon name={icon} size={17} stroke={2} />
        </span>
        <div className="sm2-review-card-text">
          <div className="sm2-review-card-label" style={{ color }}>
            {label}
          </div>
          {desc && <div className="sm2-review-card-desc">{desc}</div>}
        </div>
        {action && <div className="sm2-review-card-action">{action}</div>}
      </div>
    </div>
  )
}

function FlagCard({ flag, polarity, onRequestRemove }) {
  const isPos = polarity === 'positive'
  const descs = isPos ? POS_FLAG_DESCS : FLAG_DESCS
  const meta = descs[flag.type] ?? {
    label: flag.label || flag.type,
    desc: flag.description,
    icon: 'flag',
  }
  const colors = isPos ? POS_FLAG_COLORS : NEG_FLAG_COLORS
  return (
    <ReviewCard
      icon={meta.icon}
      color={colors.color}
      bg={colors.bg}
      border={colors.border}
      label={meta.label}
      desc={flag.description || meta.desc}
      className={isPos ? 'sm2-review-card--pos' : ''}
      action={
        onRequestRemove ? (
          <button className="sm2-review-remove" onClick={onRequestRemove} title="Remove flag">
            <Icon name="trash" size={15} />
          </button>
        ) : null
      }
    />
  )
}

function ChatBubble({ msg, initials }) {
  const isBenny = msg.role === 'benny'
  return (
    <div className={`sm2-bubble-wrap${isBenny ? ' sm2-bubble-wrap--benny' : ''}`}>
      {isBenny && <img className="sm2-bubble-avatar" src="/bs-prototypes/benny.png" alt="Benny" />}
      <div
        className={`sm2-bubble${isBenny ? ' sm2-bubble--benny' : ' sm2-bubble--student'}${msg.flagged ? ' sm2-bubble--flagged' : ''}${msg.trigger ? ' sm2-bubble--trigger' : ''}`}
      >
        <span className="sm2-bubble-text">{msg.text}</span>
      </div>
      {!isBenny && (
        <div className="sm2-student-dot" aria-hidden="true">
          {initials}
        </div>
      )}
    </div>
  )
}

function AnnotationBlock({ msg }) {
  if (msg.tone === 'safety') {
    return (
      <div className="sm2-annotation sm2-annotation--safety">
        <Icon name="shield-heart" size={14} />
        <span>{msg.text}</span>
      </div>
    )
  }
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

// Describe a change-log entry for the Activity-tab timeline (covers every kind,
// since Activity is now shown for all sessions, not just safety signals).
function describeEntry(e) {
  switch (e.kind) {
    case 'note':
      return { icon: 'message', label: 'Note', color: '#64748b' }
    case 'rating':
      return {
        icon: 'arrow-right',
        label: `Rating → ${RATING_LABELS[e.to] ?? e.to}`,
        color: '#0DA7BC',
      }
    case 'flag-removed':
      return {
        icon: 'trash',
        label: `${e.polarity === 'positive' ? 'Positive flag' : 'Flag'} removed: ${e.flagLabel}`,
        color: '#DC2626',
      }
    case 'approved':
      return {
        icon: 'circle-check',
        label: `Session approved${
          e.removedCount
            ? ` · ${e.removedCount} flag${e.removedCount === 1 ? '' : 's'} cleared`
            : ''
        }`,
        color: '#16a97a',
      }
    case 'safety-resolved':
      return e.resolution === 'dismissed'
        ? { icon: 'circle-x', label: 'Resolved · Not a concern', color: '#64748b' }
        : { icon: 'circle-check', label: 'Resolved · Student supported', color: '#16a97a' }
    case 'safety-status':
    case 'status':
      return {
        icon: 'point-filled',
        label: `Status → ${STATUS_WORD[e.to] ?? e.to}`,
        color: '#64748b',
      }
    default:
      return { icon: 'point-filled', label: 'Updated', color: '#64748b' }
  }
}

const RATING_LABELS = { green: 'Positive', yellow: 'Mixed', red: 'Disengaged' }
const RATING_META = {
  green: {
    label: 'Positive',
    color: '#16A97A',
    bg: '#F0FDF4',
    border: '#BBF7D0',
    icon: 'mood-happy',
    desc: 'Strong, engaged responses about the book.',
  },
  yellow: {
    label: 'Mixed',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    icon: 'mood-neutral',
    desc: 'Some engagement, but a few responses fell short.',
  },
  red: {
    label: 'Disengaged',
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
    icon: 'mood-sad',
    desc: 'Brief or low-effort responses throughout.',
  },
}
// Compact type indicator for the sidebar's reader-session list — one icon per
// row standing in for type/rating/safety, in priority order (most notable wins).
const SESSION_TYPE_META = {
  engagement: { icon: 'message-circle', color: '#0DA7BC', bg: '#E0F7FA' },
  flagged: { icon: 'flag', color: '#DC2626', bg: '#FEF2F2' },
  both: { icon: 'flag', color: '#7C3AED', bg: '#F5F3FF' },
}
function sessionRowMeta(s) {
  if (s.changeLog?.some((e) => e.kind === 'approved'))
    return { icon: 'circle-check', color: '#16A97A', bg: '#F0FDF4' }
  if (s.safety) {
    const sevMeta = SAFETY_SEVERITY[s.safety.severity]
    return { icon: sevMeta.icon, color: sevMeta.color, bg: sevMeta.bg }
  }
  return SESSION_TYPE_META[s.type] ?? SESSION_TYPE_META.engagement
}

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
  reviewer = CURRENT_USER,
}) {
  const [local, setLocal] = useState(null)
  const [editingRating, setEditingRating] = useState(false)
  const [confirmingFlagRemoval, setConfirmingFlagRemoval] = useState(null)
  const [confirmingResolve, setConfirmingResolve] = useState(false)
  const [noteDraft, setNoteDraft] = useState('')
  const [mainTab, setMainTab] = useState('conversation') // 'conversation' | 'activity'
  const mainRef = useRef(null)
  // Keep local state in sync on every change (incl. in-place updates from actions).
  useEffect(() => {
    if (session) setLocal(session)
  }, [session])
  // Reset the UI only when a *different* session opens (prev/next nav) — not on
  // in-place updates, so an action (escalate/resolve/note) keeps your tab + scroll.
  useEffect(() => {
    if (!session) return
    setEditingRating(false)
    setConfirmingFlagRemoval(null)
    setConfirmingResolve(false)
    setNoteDraft('')
    setMainTab('conversation')
    if (mainRef.current) mainRef.current.scrollTop = 0
  }, [session?.id])

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

  function applyRatingOverride(to, note) {
    setEditingRating(false)
    if (to === d.engagementRating && !note?.trim()) return
    const entry = newLogEntry({
      kind: 'rating',
      from: d.engagementRating,
      to,
      note: note?.trim() || undefined,
    })
    onUpdateSession?.({
      ...d,
      engagementRating: to,
      changeLog: [...(d.changeLog || []), entry],
    })
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
  const hasFlags = d.flags && d.flags.length > 0
  const isApproved = d.changeLog?.some((e) => e.kind === 'approved')
  const canApprove = (d.type === 'flagged' || d.type === 'both') && !isApproved
  const hasPosFlags = d.positiveFlags && d.positiveFlags.length > 0

  // ── Safety signal (additive; only present in the Safety Signals prototype) ──
  const safety = d.safety
  const sev = safety ? SAFETY_SEVERITY[safety.severity] : null
  const safetyResolved = safety?.status === 'resolved'
  const lastChangeBy = d.changeLog?.length ? d.changeLog[d.changeLog.length - 1].by : reviewer
  // Once resolved, the safety card adopts the outcome's own color (like a flag),
  // rather than a muted card + a separate strip.
  const resolvedMeta =
    safety?.resolution === 'dismissed'
      ? {
          color: '#64748B',
          bg: '#F1F5F9',
          border: '#E2E8F0',
          icon: 'circle-x',
          label: 'Dismissed · Not a concern',
        }
      : {
          color: '#16A97A',
          bg: '#F0FDF4',
          border: '#BBF7D0',
          icon: 'circle-check',
          label: 'Resolved · Student supported',
        }

  function safetyLog(extra) {
    return {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      by: reviewer,
      at: new Date().toISOString(),
      ...extra,
    }
  }
  function setSafetyStatus(to, note) {
    onUpdateSession?.({
      ...d,
      safety: { ...d.safety, status: to, ...(to !== 'resolved' ? { resolution: undefined } : {}) },
      changeLog: [...(d.changeLog || []), safetyLog({ kind: 'safety-status', to, note })],
    })
  }
  function resolveSafety(resolution, note) {
    onUpdateSession?.({
      ...d,
      safety: { ...d.safety, status: 'resolved', resolution },
      changeLog: [...(d.changeLog || []), safetyLog({ kind: 'safety-resolved', resolution, note })],
    })
    setConfirmingResolve(false)
  }
  function addNote() {
    if (!noteDraft.trim()) return
    onUpdateSession?.({
      ...d,
      changeLog: [...(d.changeLog || []), safetyLog({ kind: 'note', note: noteDraft.trim() })],
    })
    setNoteDraft('')
  }

  const readerSessions = allSessions
    .filter((s) => s.student.id === d.student.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  // Shared section reused by both the safety (tabbed) and integrity layouts —
  // the book (cover/title/author/Lexile) is folded in here alongside the
  // date/unit table, since both describe this one session.
  const sessionDetailsSection = (
    <div className="sm2-section">
      <div className="sm2-section-head">
        <span className="sm2-section-title">Session Details</span>
      </div>
      <div className="sm2-details-card">
        <div className="sm2-book-cover" style={{ background: d.book.color }}>
          <Icon name="book" size={28} color="rgba(255,255,255,0.65)" />
        </div>
        <div className="sm2-details-card-body">
          <div className="sm2-book-title">{d.book.title}</div>
          <div className="sm2-book-author">{d.book.author}</div>
          <div className="sm2-detail-rows">
            <div className="sm2-detail-row">
              <span>{d.source === 'activity' ? 'Date' : 'Date Read'}</span>
              <span>{dateStr}</span>
            </div>
            <div className="sm2-detail-row">
              <span>{d.source === 'activity' ? 'Activity' : 'Unit'}</span>
              <span>
                {d.source === 'activity'
                  ? d.activityName || 'Book Talk'
                  : `${d.minutesLogged.toLocaleString()} Minutes`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const studentInitials = d.student.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const conversationSection = (
    <div className="sm2-section">
      <div className="sm2-section-head">
        <span className="sm2-section-title">Conversation</span>
      </div>
      {d.status === 'unfinished' && (
        <div className="sm2-unfinished-banner">
          <Icon name="clock" size={14} />
          Student left this conversation unfinished — Benny is still waiting.
        </div>
      )}
      <div className="sm2-conversation">
        {d.conversation
          .filter((msg) => msg.role !== 'resources')
          .map((msg, i) =>
            msg.role === 'annotation' ? (
              <AnnotationBlock key={i} msg={msg} />
            ) : (
              <ChatBubble key={i} msg={msg} initials={studentInitials} />
            ),
          )}
      </div>
    </div>
  )

  const activityFeed = d.changeLog?.length ? (
    <div className="sm2-tl">
      {[...d.changeLog]
        .sort((a, b) => new Date(b.at) - new Date(a.at))
        .map((e, idx) => {
          const m = describeEntry(e)
          const canUndo = idx === 0 && UNDOABLE_KINDS.has(e.kind) && !!onUpdateSession
          return (
            <div key={e.id} className="sm2-tl-item">
              <span className="sm2-tl-dot" style={{ color: m.color }}>
                <Icon name={m.icon} size={12} stroke={2.2} />
              </span>
              <div className="sm2-tl-body">
                <div className="sm2-tl-head">
                  <span className="sm2-tl-label">{m.label}</span>
                  <span className="sm2-tl-right">
                    <span className="sm2-tl-meta">
                      {e.by} ·{' '}
                      {new Date(e.at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                    {canUndo && (
                      <button
                        className="sm2-tl-undo"
                        onClick={() => undoChange(e)}
                        title="Undo this change"
                      >
                        <Icon name="undo" size={11} />
                        Undo
                      </button>
                    )}
                  </span>
                </div>
                {e.note && <div className="sm2-tl-note">{e.note}</div>}
              </div>
            </div>
          )
        })}
    </div>
  ) : (
    <div className="sm2-notes-empty">
      <Icon name="message" size={20} />
      <span>No notes or activity yet — add the first note above.</span>
    </div>
  )

  return (
    <Modal open={!!session} onClose={onClose} variant="center" ariaLabel="Session detail">
      <div className="sm2-shell">
        {/* Top bar */}
        <div className="sm2-topbar">
          <div className="sm2-topbar-left">
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
          </div>
          <div className="sm2-topbar-right">
            <IconButton variant="ghost" onClick={onClose} aria-label="Close" className="sm2-close">
              <Icon name="x" size={15} stroke={2.2} />
            </IconButton>
          </div>
        </div>

        {/* Two-column body */}
        <div className="sm2-columns">
          {/* Left: reader identity + this reader's other sessions */}
          <div className="sm2-sidebar">
            <div className="sm2-reader-card">
              <span className="sm2-reader-avatar" style={{ background: d.student.color }}>
                {studentInitials}
              </span>
              <div className="sm2-reader-name">{d.student.name}</div>
              {(d.student.grade || d.student.class) && (
                <div className="sm2-reader-meta">
                  {d.student.grade ? `${d.student.grade} Grade` : null}
                  {d.student.grade && d.student.class ? ' · ' : null}
                  {d.student.class}
                </div>
              )}
              {onViewProfile && (
                <button className="sm2-view-profile" onClick={() => onViewProfile(d.student)}>
                  <Icon name="user" size={13} />
                  View profile
                </button>
              )}
            </div>

            <div className="sm2-reader-sessions-head">
              <span>All Sessions</span>
              <span className="sm2-sidebar-tab-count">{readerSessions.length}</span>
            </div>

            <div className="sm2-reader-sessions">
              {readerSessions.map((s) => {
                const isCurrent = s.id === d.id
                const sDate = new Date(s.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
                const meta = sessionRowMeta(s)
                return (
                  <button
                    key={s.id}
                    className={`sm2-reader-row${isCurrent ? ' sm2-reader-row--current' : ''}`}
                    onClick={() => {
                      if (!isCurrent) onSelectSession?.(s)
                    }}
                    disabled={isCurrent}
                    title={s.book.title}
                  >
                    <span
                      className="sm2-reader-row-icon"
                      style={{ color: meta.color, background: meta.bg }}
                    >
                      <Icon name={meta.icon} size={13} stroke={2.2} />
                    </span>
                    <span className="sm2-reader-row-book">{s.book.title}</span>
                    <span className="sm2-reader-row-date">{sDate}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: session content */}
          <div className="sm2-main" ref={mainRef}>
            <div className="sm2-maintabs">
              <Tabs
                items={[
                  { id: 'conversation', label: 'Conversation' },
                  { id: 'activity', label: 'Activity', count: d.changeLog?.length || undefined },
                ]}
                active={mainTab}
                onChange={setMainTab}
                accent={safety ? sev.color : '#0DA7BC'}
              />
            </div>

            {mainTab === 'conversation' && (
              <>
                {sessionDetailsSection}

                {/* Safety signal — flag-style card. Active = severity-colored; once
                    resolved the card adopts the outcome color with the resolver as a caption. */}
                {safety && (
                  <div className="sm2-section">
                    <div className="sm2-section-head">
                      <span className="sm2-section-title">Safety Signal</span>
                      <div className="sm2-section-actions">
                        {safetyResolved ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSafetyStatus('new')}
                          >
                            Reopen
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            accent="#DC2626"
                            onClick={() => setConfirmingResolve(true)}
                            icon={<Icon name="check" size={13} stroke={2.2} />}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                    {safetyResolved ? (
                      <ReviewCard
                        icon={resolvedMeta.icon}
                        color={resolvedMeta.color}
                        bg={resolvedMeta.bg}
                        border={resolvedMeta.border}
                        label={resolvedMeta.label}
                        desc={safety.summary}
                        action={<span className="sm2-review-by">by {lastChangeBy}</span>}
                      />
                    ) : (
                      <ReviewCard
                        icon={sev.icon}
                        color={sev.color}
                        bg={sev.bg}
                        border={sev.border}
                        label={`${sev.label} safety signal`}
                        desc={safety.summary}
                      />
                    )}
                  </div>
                )}

                {/* Activity-badge Book Talks run from a teacher-chosen prompt — show
                it so the teacher knows what Benny was working from. */}
                {d.source === 'activity' && d.promptText && (
                  <div className="sm2-section">
                    <div className="sm2-section-head">
                      <span className="sm2-section-title">Conversation Prompt</span>
                    </div>
                    <div className="sm2-prompt">
                      <p className="sm2-prompt-text">{d.promptText}</p>
                    </div>
                  </div>
                )}

                {d.engagementRating && (
                  <div className="sm2-section">
                    <div className="sm2-section-head">
                      <span className="sm2-section-title">Engagement Rating</span>
                      <div className="sm2-section-actions">
                        {d.changeLog?.some((e) => e.kind === 'rating') && (
                          <span className="sm2-rating-overridden-pill">
                            <Icon name="point-filled" size={10} />
                            Overridden
                          </span>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditingRating(true)}
                          icon={<Icon name="pencil" size={13} />}
                        >
                          Override
                        </Button>
                      </div>
                    </div>
                    <ReviewCard
                      icon={RATING_META[d.engagementRating].icon}
                      color={RATING_META[d.engagementRating].color}
                      bg={RATING_META[d.engagementRating].bg}
                      border={RATING_META[d.engagementRating].border}
                      label={RATING_META[d.engagementRating].label}
                      desc={RATING_META[d.engagementRating].desc}
                    />
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
                    <div className="sm2-review-stack">
                      {d.positiveFlags.map((f) => (
                        <FlagCard
                          key={f.id}
                          flag={f}
                          polarity="positive"
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
                    <div className="sm2-review-stack">
                      {d.flags.map((f) => (
                        <FlagCard
                          key={f.id}
                          flag={f}
                          polarity="negative"
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

                {conversationSection}
              </>
            )}

            {mainTab === 'activity' && (
              <div className="sm2-notes">
                <div className="sm2-note-row">
                  <textarea
                    className="sm2-note-input"
                    placeholder="Add a note for the team…"
                    value={noteDraft}
                    rows={2}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote()
                    }}
                  />
                  <Button variant="primary" disabled={!noteDraft.trim()} onClick={addNote}>
                    Add note
                  </Button>
                </div>
                {activityFeed}
              </div>
            )}
          </div>
        </div>

        {/* Footer — session actions (Edit / Delete / Approve). Safety signal
            actions live in their own section above. Activity-badge Book Talks
            have no footer. */}
        {d.source !== 'activity' ? (
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
        ) : null}
      </div>

      <OverrideRatingModal
        open={editingRating}
        current={d.engagementRating}
        onCancel={() => setEditingRating(false)}
        onSave={applyRatingOverride}
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

      <ResolveConfirmModal
        open={confirmingResolve}
        onCancel={() => setConfirmingResolve(false)}
        onResolve={resolveSafety}
      />
    </Modal>
  )
}

function ResolveConfirmModal({ open, onCancel, onResolve }) {
  const [note, setNote] = useState('')
  useEffect(() => {
    if (open) setNote('')
  }, [open])
  if (!open) return null
  return (
    <Modal open={open} onClose={onCancel} variant="center" ariaLabel="Resolve safety signal">
      <div className="sm2-approve-shell">
        <div className="sm2-approve-icon">
          <Icon name="heart-handshake" size={26} />
        </div>
        <div className="sm2-approve-title">Resolve this safety signal?</div>
        <div className="sm2-approve-body">
          Choose how it was handled. Your choice is recorded in the activity log and the signal
          moves to <strong>Resolved</strong>.
        </div>
        <textarea
          className="sm2-modal-note"
          placeholder="Add an optional note for the team…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />
        <div className="sm2-approve-actions">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={() => onResolve('dismissed', note.trim() || 'Reviewed — not a concern.')}
          >
            Not a concern
          </Button>
          <Button
            variant="primary"
            accent="#16A97A"
            onClick={() =>
              onResolve('supported', note.trim() || 'Student supported and connected to help.')
            }
            icon={<Icon name="heart-handshake" size={13} stroke={2.2} />}
          >
            Student supported
          </Button>
        </div>
      </div>
    </Modal>
  )
}

const UNDOABLE_KINDS = new Set(['rating', 'flag-removed', 'approved'])

const STATUS_WORD = {
  new: 'Unresolved',
  resolved: 'Resolved',
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

function OverrideRatingModal({ open, current, onCancel, onSave }) {
  const [choice, setChoice] = useState(current)
  const [note, setNote] = useState('')
  useEffect(() => {
    if (open) {
      setChoice(current)
      setNote('')
    }
  }, [open, current])
  if (!open) return null
  return (
    <Modal open={open} onClose={onCancel} variant="center" ariaLabel="Override engagement rating">
      <div className="sm2-approve-shell">
        <div className="sm2-approve-icon" style={{ background: '#E0F2FE', color: '#0DA7BC' }}>
          <Icon name="pencil" size={24} />
        </div>
        <div className="sm2-approve-title">Override engagement rating</div>
        <div className="sm2-approve-body">
          Choose the rating that best reflects this Book Talk. Your change is recorded in the
          activity log.
        </div>
        <div
          className={`sm2-rating-segment sm2-rating-segment--${choice}`}
          style={{ marginBottom: 14 }}
        >
          {['green', 'yellow', 'red'].map((val) => (
            <button
              key={val}
              className={`sm2-rating-seg sm2-rating-seg--${val}${choice === val ? ' sm2-rating-seg--active' : ''}`}
              onClick={() => setChoice(val)}
            >
              <span className={`sm2-rating-seg-dot sm2-rating-seg-dot--${val}`} />
              {RATING_LABELS[val]}
            </button>
          ))}
        </div>
        <textarea
          className="sm2-modal-note"
          placeholder="Add an optional note…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />
        <div className="sm2-approve-actions">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onSave(choice, note)}>
            Save rating
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
          <Icon name="trash" size={24} />
        </div>
        <div className="sm2-approve-title">Remove this {isPositive ? 'positive ' : ''}flag?</div>
        <div className="sm2-approve-body">
          The flag <strong>{label}</strong> will be removed from this Book Talk. This action will be
          recorded in the activity log.
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
