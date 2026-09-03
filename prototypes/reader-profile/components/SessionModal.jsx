import { useState, useEffect } from 'react'
import { Modal } from '@components/Modal/Modal'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import { IconButton } from '@components/Primitives/Primitives'
import { CoverImage } from './kit'

import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Primitives/Primitives.css'
// Sessions for Review's own modal chrome (`sm2-*`), so a reading-log session
// reads as the production surface rather than a lookalike.
import '../../sfr/components/SessionModal.css'

// One logged session, opened from the reading log. It adapts to what the
// session actually has: a flagged log shows its flags, a log with a book talk
// shows Benny's summary and the transcript, and a plain log shows neither —
// just the details. SFR's two-column shell is deliberately not used: there's no
// reader sidebar here, because you're already inside that reader's profile.
const KIND_COLOR = {
  engagement: '#0D9488',
  comprehension: '#7C3AED',
  integrity: '#B45309',
}
const KIND_LABEL = {
  engagement: 'Engagement',
  comprehension: 'Comprehension',
  integrity: 'Integrity',
}

function FlagCard({ flag, positive }) {
  const color = positive ? '#16A97A' : '#DC2626'
  const bg = positive ? '#E8F8F1' : '#FDECEC'
  return (
    <div className={`sm2-review-card${positive ? ' sm2-review-card--pos' : ''}`}>
      <div className="sm2-review-card-main">
        <span className="sm2-review-badge" style={{ background: bg, color }}>
          <Icon name="flag" size={13} />
        </span>
        <div className="sm2-review-card-text">
          <div className="sm2-review-card-label" style={{ color }}>
            {flag.label}
          </div>
          {flag.desc && <div className="sm2-review-card-desc">{flag.desc}</div>}
        </div>
      </div>
    </div>
  )
}

function Bubble({ msg, initials }) {
  const benny = msg.from === 'benny'
  return (
    <div className={`sm2-bubble-wrap${benny ? ' sm2-bubble-wrap--benny' : ''}`}>
      {benny && <img className="sm2-bubble-avatar" src="/bs-prototypes/benny.png" alt="Benny" />}
      {!benny && <span className="sm2-bubble-initials">{initials}</span>}
      <div className={`sm2-bubble ${benny ? 'sm2-bubble--benny' : 'sm2-bubble--student'}`}>
        {msg.text}
      </div>
    </div>
  )
}

export function SessionModal({ session, reader, onClose }) {
  const [tab, setTab] = useState('conversation')
  const [noteDraft, setNoteDraft] = useState('')
  const [notes, setNotes] = useState([])

  useEffect(() => {
    setTab('conversation')
    setNoteDraft('')
    setNotes([])
  }, [session?.id])

  if (!session) return null

  const talk = session.talk
  const accent = talk ? KIND_COLOR[talk.kind] : '#0284C7'
  const initials = reader
    ? reader.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
    : ''
  const feed = [...(session.changeLog || []), ...notes]

  const addNote = () => {
    const text = noteDraft.trim()
    if (!text) return
    setNotes((n) => [
      ...n,
      {
        id: `n${n.length}`,
        label: text,
        icon: 'message',
        color: '#64748B',
        by: 'You',
        at: 'Just now',
      },
    ])
    setNoteDraft('')
  }

  return (
    <Modal open={!!session} onClose={onClose} variant="center" ariaLabel="Reading session">
      {({ close }) => (
        <div className="sm2-shell rp-sm2">
          <div className="sm2-topbar">
            <div className="sm2-topbar-left">
              <span className="rp-sm2-heading">Reading session</span>
            </div>
            <div className="sm2-topbar-right">
              <IconButton
                variant="ghost"
                size="sm"
                className="sm2-close"
                onClick={close}
                aria-label="Close"
              >
                <Icon name="x" size={18} stroke={2.2} />
              </IconButton>
            </div>
          </div>

          {/* One column: SFR's sidebar lists the reader's other sessions, which
              is redundant when you opened this from that reader's own log. */}
          <div className="sm2-columns">
            <div className="sm2-main">
              <div className="sm2-maintabs">
                <Tabs
                  items={[
                    { id: 'conversation', label: 'Logged Session' },
                    { id: 'activity', label: 'Activity', count: feed.length || undefined },
                  ]}
                  active={tab}
                  onChange={setTab}
                  accent={accent}
                />
              </div>

              {tab === 'conversation' ? (
                <>
                  <div className="sm2-section">
                    <div className="sm2-section-head">
                      <span className="sm2-section-title">Session Details</span>
                    </div>
                    <div className="sm2-details-card">
                      <div className="sm2-book-cover" style={{ background: accent }}>
                        <CoverImage isbn={session.isbn} title={session.title} />
                      </div>
                      <div className="sm2-details-card-body">
                        <div className="sm2-book-title">{session.title}</div>
                        <div className="sm2-book-author">{session.author}</div>
                        <div className="sm2-detail-rows">
                          <div className="sm2-detail-row">
                            <span>Date</span>
                            <span>{session.date}</span>
                          </div>
                          <div className="sm2-detail-row">
                            <span>Logged</span>
                            <span>{session.amount}</span>
                          </div>
                          <div className="sm2-detail-row">
                            <span>Started By</span>
                            <span>{session.trigger}</span>
                          </div>
                          {talk && (
                            <div className="sm2-detail-row">
                              <span>Book Talk</span>
                              <span>
                                {talk.duration} ·{' '}
                                {talk.messages.filter((m) => m.from !== 'benny').length} of{' '}
                                {talk.messages.filter((m) => m.from === 'benny').length} answered
                              </span>
                            </div>
                          )}
                          <div className="sm2-detail-row">
                            <span>Status</span>
                            <span className="rp-sm2-status">
                              <Icon name="circle-check" size={13} />
                              {session.completed ? 'Book completed' : 'Logged'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {talk && (
                    <div className="sm2-section">
                      <div className="sm2-section-head">
                        <span className="sm2-section-title">Benny&rsquo;s Summary</span>
                        <Pill color={accent} size="sm">
                          {KIND_LABEL[talk.kind]}
                        </Pill>
                      </div>
                      <div className="sm2-prompt rp-sm2-summary">
                        <img
                          src="/bs-prototypes/benny.png"
                          alt=""
                          className="rp-sm2-summary-benny"
                        />
                        <p className="sm2-prompt-text">{talk.summary}</p>
                      </div>
                    </div>
                  )}

                  {session.positiveFlags?.length > 0 && (
                    <div className="sm2-section">
                      <div className="sm2-section-head">
                        <span className="sm2-section-title">
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
                          <FlagCard key={f.label} flag={f} positive />
                        ))}
                      </div>
                    </div>
                  )}

                  {session.flags?.length > 0 && (
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
                          <FlagCard key={f.label} flag={f} />
                        ))}
                      </div>
                    </div>
                  )}

                  {talk && (
                    <div className="sm2-section">
                      <div className="sm2-section-head">
                        <span className="sm2-section-title">Conversation</span>
                      </div>
                      <div className="sm2-conversation">
                        {talk.messages.map((m, i) => (
                          <Bubble key={i} msg={m} initials={initials} />
                        ))}
                      </div>
                    </div>
                  )}
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
                  <div className="sm2-tl">
                    {feed.map((e) => (
                      <div key={e.id} className="sm2-tl-item">
                        <span className="sm2-tl-dot" style={{ color: e.color }}>
                          <Icon name={e.icon} size={12} stroke={2.2} />
                        </span>
                        <div className="sm2-tl-body">
                          <div className="sm2-tl-label">{e.label}</div>
                          <div className="sm2-tl-meta">
                            {e.by} · {e.at}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
