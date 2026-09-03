import { useState, useEffect } from 'react'
import { Modal } from '@components/Modal/Modal'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Pill } from '@components/Pill/Pill'
import { IconButton, Tooltip } from '@components/Primitives/Primitives'
import { CoverImage } from './kit'

import '@components/Button/Button.css'
import '@components/Primitives/Primitives.css'
// Sessions for Review's own modal chrome (`sm2-*`), so a reading-log session
// reads as the production surface rather than a lookalike.
import '../../sfr/components/SessionModal.css'

// One logged session, opened from the reading log. It adapts to what the
// session actually has: a flagged log shows its flags, a log with a book talk
// shows Benny's read and the transcript, and a plain log shows neither — just
// the details, which is what most logs are.
//
// Two deliberate omissions against SFR's version: no reader sidebar (you opened
// this from that reader's own log, so listing their other sessions is
// redundant) and no tabs — the activity/notes feed is a review workflow, not
// something a librarian needs while looking at a log entry.
const KIND_COLOR = { engagement: '#0D9488', comprehension: '#7C3AED', integrity: '#B45309' }
const KIND_LABEL = {
  engagement: 'Engagement',
  comprehension: 'Comprehension',
  integrity: 'Integrity',
}

function FlagRow({ flag, positive, onRemove }) {
  const tint = positive ? '#16A97A' : '#DC2626'
  return (
    <div className="rp-fl-row">
      <span className="rp-fl-icon" style={{ color: flag.color || tint }}>
        <Icon name={flag.icon || 'flag'} size={18} />
      </span>
      <div className="rp-fl-body">
        <div className="rp-fl-label">{flag.label}</div>
        {flag.desc && <div className="rp-fl-desc">{flag.desc}</div>}
      </div>
      <Tooltip content="Remove inaccurate flag" placement="left">
        <IconButton
          variant="ghost"
          size="sm"
          aria-label="Remove inaccurate flag"
          onClick={onRemove}
        >
          <Icon name="trash" size={15} />
        </IconButton>
      </Tooltip>
    </div>
  )
}

// A flag that fired on one answer, shown against that answer rather than only
// in the summary — that's the whole point of it, you can see what triggered it.
function TurnFlag({ flag }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`rp-tf${flag.positive ? ' rp-tf--pos' : ' rp-tf--neg'}`}>
      <button type="button" className="rp-tf-head" onClick={() => setOpen((v) => !v)}>
        <Icon name="flag" size={13} />
        <span className="rp-tf-label">{flag.label}</span>
        <span className="rp-tf-toggle">
          {open ? 'Hide reasoning' : 'Show reasoning'}
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={12} stroke={2.4} />
        </span>
      </button>
      {open && <div className="rp-tf-reasoning">{flag.reasoning}</div>}
    </div>
  )
}

function Turn({ msg, initials }) {
  const benny = msg.from === 'benny'
  return (
    <>
      <div className={`rp-turn${benny ? ' rp-turn--benny' : ' rp-turn--reader'}`}>
        {benny && <img className="rp-turn-avatar" src="/bs-prototypes/benny.png" alt="Benny" />}
        <div className="rp-turn-bubble">
          {msg.lead && <div className="rp-turn-lead">{msg.lead}</div>}
          <div className="rp-turn-text">{msg.text}</div>
        </div>
        {!benny && <span className="rp-turn-initials">{initials}</span>}
      </div>
      {msg.flags?.map((f) => (
        <TurnFlag key={f.label} flag={f} />
      ))}
    </>
  )
}

export function SessionModal({ session, reader, onClose }) {
  const [removed, setRemoved] = useState([])

  useEffect(() => setRemoved([]), [session?.id])
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
  const live = (list) => (list || []).filter((f) => !removed.includes(f.label))
  const pos = live(session.positiveFlags)
  const neg = live(session.flags)

  return (
    <Modal open={!!session} onClose={onClose} variant="center" ariaLabel="Reading session">
      {({ close }) => (
        <div className="sm2-shell rp-sm2">
          <div className="rp-sm2-top">
            <IconButton variant="ghost" size="sm" onClick={close} aria-label="Close">
              <Icon name="x" size={18} stroke={2.2} />
            </IconButton>
          </div>

          <div className="rp-sm2-body">
            <section className="rp-sm2-sec">
              <h3 className="rp-sm2-sec-title">Session Details</h3>
              <div className="rp-sd-card">
                <div className="rp-sd-cover">
                  <CoverImage isbn={session.isbn} title={session.title} />
                </div>
                <div className="rp-sd-main">
                  <div className="rp-sd-title">{session.title}</div>
                  <div className="rp-sd-author">{session.author}</div>
                  <dl className="rp-sd-rows">
                    <div>
                      <dt>Date Read</dt>
                      <dd>{session.dateRead}</dd>
                    </div>
                    <div>
                      <dt>Unit</dt>
                      <dd>{session.unit}</dd>
                    </div>
                    <div>
                      <dt>Trigger</dt>
                      <dd>{session.trigger}</dd>
                    </div>
                    <div>
                      <dt>Book Talk Status</dt>
                      <dd>{talk ? 'Complete' : 'None'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </section>

            {talk && (
              <section className="rp-sm2-sec">
                <h3 className="rp-sm2-sec-title">Analysis</h3>
                <div className="rp-an-card">
                  <img src="/bs-prototypes/benny.png" alt="" className="rp-an-benny" />
                  <div className="rp-an-bubble">
                    <span className="rp-an-mark" style={{ color: '#16A97A' }}>
                      <Icon name="circle-check" size={16} />
                    </span>
                    <div>
                      <div className="rp-an-head">
                        {reader ? reader.name.split(' ')[0] : 'This reader'} engaged with this book.
                      </div>
                      <p className="rp-an-text">{talk.summary}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {pos.length > 0 && (
              <section className="rp-sm2-sec">
                <h3 className="rp-sm2-sec-title rp-sm2-sec-title--pos">
                  <Icon name="flag" size={14} />
                  Flags
                </h3>
                <div className="rp-fl-stack">
                  {pos.map((f) => (
                    <FlagRow
                      key={f.label}
                      flag={f}
                      positive
                      onRemove={() => setRemoved((r) => [...r, f.label])}
                    />
                  ))}
                </div>
              </section>
            )}

            {neg.length > 0 && (
              <section className="rp-sm2-sec">
                <h3 className="rp-sm2-sec-title rp-sm2-sec-title--neg">
                  <Icon name="flag" size={14} />
                  Flags
                </h3>
                <div className="rp-fl-stack">
                  {neg.map((f) => (
                    <FlagRow
                      key={f.label}
                      flag={f}
                      onRemove={() => setRemoved((r) => [...r, f.label])}
                    />
                  ))}
                </div>
              </section>
            )}

            {talk && (
              <section className="rp-sm2-sec">
                <h3 className="rp-sm2-sec-title">
                  Book Talks Conversation
                  <Pill color={accent} size="sm">
                    {KIND_LABEL[talk.kind]}
                  </Pill>
                </h3>
                <div className="rp-sm2-sec-sub">Conversation on {talk.date}</div>
                <div className="rp-conv">
                  {talk.messages.map((m, i) => (
                    <Turn key={i} msg={m} initials={initials} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="rp-sm2-foot">
            <Button variant="secondary" onClick={close}>
              Edit Session
            </Button>
            <Button variant="secondary" className="rp-sm2-danger">
              Delete Session
            </Button>
            {neg.length > 0 && <Button variant="primary">Unflag Session</Button>}
          </div>
        </div>
      )}
    </Modal>
  )
}
