import { useState, useEffect } from 'react'
import { Modal } from '@components/Modal/Modal'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { IconButton } from '@components/Primitives/Primitives'
import { Pill } from '@components/Pill/Pill'
import {
  SESSIONS,
  TALK_KINDS,
  CONFIDENCE_META,
  CONFIDENCE_BLURB,
  FLAG_DESCS,
  POS_FLAG_DESCS,
  NEG_FLAG_COLORS,
  POS_FLAG_COLORS,
  scriptFor,
  sessionConfidence,
} from '../data'

import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Primitives/Primitives.css'
// The real Sessions for Review modal chrome: two-column shell, reader sidebar,
// main tabs, section headers, review cards, conversation bubbles and footer.
import '../../sfr/components/SessionModal.css'

// One completed book talk, reviewed — built on Sessions for Review's own modal
// (`sm2-*`) so it reads as the production surface rather than a lookalike. The
// section vocabulary is SFR's too: review cards for Benny's read on the talk,
// flags in a review stack, a Conversation tab and an Activity tab with notes and
// a timeline.
//
// What's new is *what* Benny reports: a written summary of the talk, plus a Reading
// Confidence on comprehension talks. Integrity talks are the only type that flags.
export function SessionModal({ session, onSelectSession, onClose }) {
  const [tab, setTab] = useState('conversation')
  const [noteDraft, setNoteDraft] = useState('')
  // Notes are kept per session, not in one list — otherwise a note added on one
  // reader's talk shows up on the next one you open.
  const [notesById, setNotesById] = useState({})

  // Switching sessions inside the modal is a content swap, so land back on the
  // Conversation tab with an empty composer rather than wherever you just were.
  useEffect(() => {
    setTab('conversation')
    setNoteDraft('')
  }, [session?.id])

  if (!session) return null

  const kind = TALK_KINDS[session.kindId]
  // Reading Confidence is a comprehension-talk concept, so it renders only when
  // the talk actually produced one.
  const confidenceKey = sessionConfidence(session)
  const confidence = confidenceKey ? CONFIDENCE_META[confidenceKey] : null

  const idx = SESSIONS.findIndex((s) => s.id === session.id)
  const prev = SESSIONS[idx - 1]
  const next = SESSIONS[idx + 1]
  const initials = session.student.initials
  const unfinished = session.status === 'unfinished'
  // Questions Benny asked that expected an answer, and how many the reader gave.
  const answers = session.messages.filter((m) => m.role === 'student').length
  const questions = scriptFor(session.kindId).length - 1

  const notes = notesById[session.id] ?? []
  const feed = [...notes, ...(session.changeLog ?? [])]

  function addNote() {
    const text = noteDraft.trim()
    if (!text) return
    setNotesById((prev) => {
      const mine = prev[session.id] ?? []
      return {
        ...prev,
        [session.id]: [
          {
            id: `${session.id}-n${mine.length}`,
            label: 'Note added',
            icon: 'message',
            color: '#0DA7BC',
            by: 'You',
            at: 'Just now',
            note: text,
          },
          ...mine,
        ],
      }
    })
    setNoteDraft('')
  }

  return (
    <Modal open={!!session} onClose={onClose} variant="center" ariaLabel="Book talk session">
      <div className="sm2-shell bw-sm2">
        {/* Top bar — step through the example sessions. */}
        <div className="sm2-topbar">
          <div className="sm2-topbar-left">
            <div className="sm2-nav">
              <button
                className="sm2-nav-btn"
                disabled={!prev}
                onClick={() => prev && onSelectSession?.(prev)}
                title="Previous session"
              >
                <Icon name="chevron-left" size={14} stroke={2.2} />
                <span className="sm2-nav-label">Prev</span>
              </button>
              <span className="sm2-nav-count">
                <strong>{idx + 1}</strong>
                <span className="sm2-nav-count-sep">of</span>
                {SESSIONS.length}
              </span>
              <button
                className="sm2-nav-btn"
                disabled={!next}
                onClick={() => next && onSelectSession?.(next)}
                title="Next session"
              >
                <span className="sm2-nav-label">Next</span>
                <Icon name="chevron-right" size={14} stroke={2.2} />
              </button>
            </div>
          </div>
          <div className="sm2-topbar-right">
            <IconButton variant="ghost" onClick={onClose} aria-label="Close" className="sm2-close">
              <Icon name="x" size={15} stroke={2.2} />
            </IconButton>
          </div>
        </div>

        <div className="sm2-columns">
          {/* Left: the reader, and the other book talks. */}
          <div className="sm2-sidebar">
            <div className="sm2-reader-card">
              <span className="sm2-reader-avatar" style={{ background: session.student.color }}>
                {initials}
              </span>
              <div className="sm2-reader-name">{session.student.name}</div>
              <div className="sm2-reader-meta">{session.student.grade} Grade</div>
              <button className="sm2-view-profile">
                <Icon name="user" size={13} />
                View profile
              </button>
            </div>

            <div className="sm2-reader-sessions-head">
              <span>All Book Talks</span>
              <span className="sm2-sidebar-tab-count">{SESSIONS.length}</span>
            </div>

            <div className="sm2-reader-sessions">
              {SESSIONS.map((s) => {
                const isCurrent = s.id === session.id
                const sKind = TALK_KINDS[s.kindId]
                return (
                  <button
                    key={s.id}
                    className={`sm2-reader-row${isCurrent ? ' sm2-reader-row--current' : ''}`}
                    onClick={() => !isCurrent && onSelectSession?.(s)}
                    disabled={isCurrent}
                    title={`${sKind.label} · ${s.student.name}`}
                  >
                    <span
                      className="sm2-reader-row-icon"
                      style={{ color: sKind.color, background: sKind.tint }}
                    >
                      <Icon name={sKind.icon} size={13} stroke={2.2} />
                    </span>
                    {/* All three examples are the same title, so the row leads
                      with what actually differs: the talk type and the reader. */}
                    <span className="sm2-reader-row-book">{sKind.short}</span>
                    <span className="sm2-reader-row-date">{s.student.initials}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: this session. */}
          <div className="sm2-main">
            <div className="sm2-maintabs">
              <Tabs
                items={[
                  { id: 'conversation', label: 'Conversation' },
                  { id: 'activity', label: 'Activity', count: feed.length || undefined },
                ]}
                active={tab}
                onChange={setTab}
                accent={kind.color}
              />
            </div>

            {tab === 'conversation' ? (
              <>
                {/* ── Session details ─────────────────────────────────────── */}
                <div className="sm2-section">
                  <div className="sm2-section-head">
                    <span className="sm2-section-title">Session Details</span>
                  </div>
                  <div className="sm2-details-card">
                    <div className="sm2-book-cover" style={{ background: kind.color }}>
                      <img src={session.book.cover} alt="" className="bw-sm2-cover-img" />
                    </div>
                    <div className="sm2-details-card-body">
                      <div className="sm2-book-title">{session.book.title}</div>
                      <div className="sm2-book-author">{session.book.author}</div>
                      <div className="sm2-detail-rows">
                        <div className="sm2-detail-row">
                          <span>Date</span>
                          <span>{session.date}</span>
                        </div>
                        <div className="sm2-detail-row">
                          <span>Started By</span>
                          <span>{session.trigger}</span>
                        </div>
                        <div className="sm2-detail-row">
                          <span>Length</span>
                          <span>
                            {session.duration} · {answers} of {questions} answered
                          </span>
                        </div>
                        <div className="sm2-detail-row">
                          <span>Status</span>
                          <span
                            className={
                              unfinished
                                ? 'bw-sm2-status bw-sm2-status--unfinished'
                                : 'bw-sm2-status'
                            }
                          >
                            <Icon name={unfinished ? 'clock' : 'circle-check'} size={13} />
                            {unfinished ? 'Unfinished' : 'Completed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Benny's summary of the talk ─────────────────────────── */}
                <div className="sm2-section">
                  <div className="sm2-section-head">
                    <span className="sm2-section-title">Benny’s Summary</span>
                    <Pill color={kind.color} size="sm">
                      {kind.short}
                    </Pill>
                  </div>
                  <div className="sm2-prompt bw-sm2-summary">
                    <img src="/bs-prototypes/benny.png" alt="" className="bw-sm2-summary-benny" />
                    <p className="sm2-prompt-text">{session.summary}</p>
                  </div>
                </div>

                {/* ── Reading Confidence — comprehension talks only ───────── */}
                {confidence && (
                  <div className="sm2-section">
                    <div className="sm2-section-head">
                      <span className="sm2-section-title">Reading Confidence</span>
                      <div className="sm2-section-actions">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<Icon name="pencil" size={13} />}
                        >
                          Override
                        </Button>
                      </div>
                    </div>
                    <ReviewCard {...confidence} desc={CONFIDENCE_BLURB} />
                  </div>
                )}

                {/* ── Flags — positive first, then negative, as SFR orders them ── */}
                {session.positiveFlags.length > 0 && (
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
                      {session.positiveFlags.map((f) => (
                        <FlagCard key={f.id} flag={f} polarity="positive" />
                      ))}
                    </div>
                  </div>
                )}

                {session.flags.length > 0 && (
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
                      {session.flags.map((f) => (
                        <FlagCard key={f.id} flag={f} polarity="negative" />
                      ))}
                    </div>
                  </div>
                )}

                {/* ── The conversation ───────────────────────────────────── */}
                <div className="sm2-section">
                  <div className="sm2-section-head">
                    <span className="sm2-section-title">Conversation</span>
                  </div>
                  {unfinished && (
                    <div className="sm2-unfinished-banner">
                      <Icon name="clock" size={14} />
                      Student left this conversation unfinished — Benny is still waiting.
                    </div>
                  )}
                  <div className="sm2-conversation">
                    {session.messages.map((m, i) => (
                      <SessionBubble key={i} msg={m} initials={initials} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
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

                {feed.length ? (
                  <div className="sm2-tl">
                    {feed.map((e) => (
                      <div key={e.id} className="sm2-tl-item">
                        <span className="sm2-tl-dot" style={{ color: e.color }}>
                          <Icon name={e.icon} size={12} stroke={2.2} />
                        </span>
                        <div className="sm2-tl-body">
                          <div className="sm2-tl-head">
                            <span className="sm2-tl-label">{e.label}</span>
                            <span className="sm2-tl-right">
                              <span className="sm2-tl-meta">
                                {e.by} · {e.at}
                              </span>
                            </span>
                          </div>
                          {e.note && <div className="sm2-tl-note">{e.note}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="sm2-notes-empty">
                    <Icon name="message" size={20} />
                    <span>No notes or activity yet — add the first note above.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="sm2-footer">
          <Button variant="secondary">Edit Session</Button>
          <div className="sm2-footer-actions">
            <button className="sm2-btn sm2-btn--danger">Delete Session</button>
            <Button
              variant="primary"
              onClick={onClose}
              icon={<Icon name="check" size={13} stroke={2.2} />}
            >
              Approve Session
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// Sessions for Review's unified review card — a colored icon badge, a colored
// bold label, a muted description, and an optional trailing action. Mirrored
// here rather than imported because SFR keeps it private to its own modal.
function ReviewCard({ icon, color, bg, border, label, desc, action, count, className = '' }) {
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
            {/* How many answers raised it — shown only when it's more than one,
                since a bare "×1" on every card is noise. */}
            {count > 1 && (
              <span className="bw-flag-count" style={{ color }}>
                ×{count}
              </span>
            )}
          </div>
          {desc && <div className="sm2-review-card-desc">{desc}</div>}
        </div>
        {action && <div className="sm2-review-card-action">{action}</div>}
      </div>
    </div>
  )
}

// Sessions for Review's flag card: the catalog and palette come from the
// polarity, and positive cards take `--pos` so their remove button greens out.
function FlagCard({ flag, polarity }) {
  const isPos = polarity === 'positive'
  const meta = (isPos ? POS_FLAG_DESCS : FLAG_DESCS)[flag.type] ?? {
    label: flag.type,
    desc: '',
    icon: 'flag',
  }
  const colors = isPos ? POS_FLAG_COLORS : NEG_FLAG_COLORS
  return (
    <ReviewCard
      icon={meta.icon}
      {...colors}
      label={meta.label}
      desc={meta.desc}
      count={flag.count}
      className={isPos ? 'sm2-review-card--pos' : ''}
      action={
        <button className="sm2-review-remove" title="Remove flag">
          <Icon name="trash" size={15} />
        </button>
      }
    />
  )
}

// Render the light *emphasis* the scripts use for book titles as <em>, the same
// way the reader-facing bubble does — SFR's own bubble prints raw text, so
// without this the asterisks show through.
function renderText(text) {
  return String(text)
    .split(/(\*[^*]+\*)/g)
    .map((part, i) =>
      part.startsWith('*') && part.endsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : part,
    )
}

// Sessions for Review's own transcript bubble — Benny left with his avatar, the
// reader right with an initials dot. Reader answers carry the model's rationale
// for how it read the answer, folded into the bubble itself.
function SessionBubble({ msg, initials }) {
  const isBenny = msg.role === 'benny'
  return (
    <div className={`sm2-bubble-wrap${isBenny ? ' sm2-bubble-wrap--benny' : ''}`}>
      {isBenny && <img className="sm2-bubble-avatar" src="/bs-prototypes/benny.png" alt="Benny" />}
      <div
        className={`sm2-bubble${isBenny ? ' sm2-bubble--benny' : ' sm2-bubble--student'}${
          msg.flagged ? ' sm2-bubble--flagged' : ''
        }${msg.praised ? ' bw-bubble--praised' : ''}${
          msg.flags?.length ? ' bw-bubble--reasoned' : ''
        }`}
      >
        <span className="sm2-bubble-text">{renderText(msg.text)}</span>
        {msg.flags?.length > 0 && <Reasoning text={msg.reasoning} flags={msg.flags} />}
      </div>
      {!isBenny && (
        <div className="sm2-student-dot" aria-hidden="true">
          {initials}
        </div>
      )}
    </div>
  )
}

// Why the model read an answer the way it did — a strip along the bottom of the
// answer's own bubble rather than a control parked beneath it, so the transcript
// reads as a conversation with its reasoning attached.
//
// One row per verdict, always all of them: an answer that raises three flags
// shows three rows. Hiding the rest behind a "+2" made the count visible but
// not the flags, which is the thing an educator is scanning for. Only the
// rationale folds away, and each row folds independently.
//
// Reasoning only ever hangs off a flag — it's the evidence behind a verdict, so
// an unflagged answer carries no strip at all.
//
// A row has nothing to open when its flag came from a mechanical detector —
// sentiment, word count, an exit event. Those verdicts have no prose behind
// them, so the row is a label rather than a control.
function Reasoning({ text, flags = [] }) {
  const [open, setOpen] = useState({})
  const toggle = (key) => setOpen((o) => ({ ...o, [key]: !o[key] }))

  const rows = flags.map((f) => ({
    key: f.type,
    icon: f.icon,
    color: f.color,
    label: f.label,
    // A flag brings its own rationale when an answer raised several and each
    // needs its own evidence. A lone flag falls back to the model's read of the
    // whole answer, which is about that flag anyway.
    body: f.why ?? (flags.length === 1 ? text : undefined),
  }))

  return rows.map((r) => {
    const isOpen = Boolean(open[r.key])
    const face = (
      <>
        <Icon name={r.icon} size={12} stroke={2} color={r.color} />
        <span className="bw-reason-label" style={r.color ? { color: r.color } : undefined}>
          {r.label}
        </span>
        {r.body && (
          <>
            {/* Names what opens. The flag is the verdict; this is the offer of
                the evidence behind it, so a row that can't be opened simply
                doesn't carry it. */}
            <span className="bw-reason-cue">{isOpen ? 'Hide' : 'View'} reasoning</span>
            <Icon name="chevron-down" size={12} stroke={2.2} className="bw-reason-caret" />
          </>
        )}
      </>
    )
    return (
      <div className="bw-reason-row" key={r.key}>
        {r.body ? (
          <button
            type="button"
            className="bw-reason-strip"
            aria-expanded={isOpen}
            aria-label={`${r.label} — AI reasoning`}
            onClick={() => toggle(r.key)}
          >
            {face}
          </button>
        ) : (
          <div className="bw-reason-strip bw-reason-strip--static" title="Detected automatically">
            {face}
          </div>
        )}
        {isOpen && r.body && <p className="bw-reason-body">{r.body}</p>}
      </div>
    )
  })
}
