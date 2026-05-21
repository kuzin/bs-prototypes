import { useState, useEffect } from 'react'
import { Modal } from '../../ris/components/Modal'
import '../../ris/components/Modal.css'
import './SessionModal.css'

const FLAG_CONFIG = {
  'copy-paste':     { label: 'Copied Response',           desc: 'Response appears to be copied from an external source.',      color: '#7C3AED', bg: '#F5F3FF' },
  'unintelligible': { label: 'Unintelligible Response',   desc: 'We were unable to understand one or more responses.',          color: '#D97706', bg: '#FFFBEB' },
  'no-recall':      { label: 'Unable to Recall Details',  desc: 'Student could not describe specific events or characters.',    color: '#0DA7BC', bg: '#F0F9FF' },
  'minimal':        { label: 'Minimal Engagement',        desc: 'Student gave very brief, low-effort responses.',               color: '#64748B', bg: '#F8FAFC' },
  'quit-early':     { label: 'Did Not Complete',          desc: 'Student exited the conversation before finishing.',            color: '#DC2626', bg: '#FEF2F2' },
}

function FlagRow({ flag }) {
  const cfg = FLAG_CONFIG[flag.type] ?? { label: flag.label, desc: flag.description, color: '#DC2626', bg: '#FEF2F2' }
  return (
    <div className="sm2-flag-row">
      <div className="sm2-flag-dot" style={{ background: cfg.color }} />
      <div>
        <div className="sm2-flag-label">{cfg.label}</div>
        <div className="sm2-flag-desc">{flag.description || cfg.desc}</div>
      </div>
    </div>
  )
}

function ChatBubble({ msg }) {
  const isBenny = msg.role === 'benny'
  return (
    <div className={`sm2-bubble-wrap${isBenny ? ' sm2-bubble-wrap--benny' : ''}`}>
      {isBenny && (
        <img className="sm2-bubble-avatar" src="/bs-prototypes/benny.png" alt="Benny" />
      )}
      <div className={`sm2-bubble${isBenny ? ' sm2-bubble--benny' : ' sm2-bubble--student'}${msg.flagged ? ' sm2-bubble--flagged' : ''}`}>
        {msg.text}
      </div>
      {!isBenny && <div className="sm2-student-dot" />}
    </div>
  )
}

export function SessionModal({ session, onClose }) {
  const [local, setLocal] = useState(null)
  useEffect(() => { if (session) setLocal(session) }, [session])

  const d = local || session
  if (!session || !d) return null

  const dateStr = new Date(d.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
  const createdStr = new Date(d.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
  const hasFlags = d.flags && d.flags.length > 0

  return (
    <Modal open={!!session} onClose={onClose} variant="center" ariaLabel="Session detail">
      <div className="sm2-shell">
        {/* Top bar */}
        <div className="sm2-topbar">
          <button className="sm2-student-link">
            {d.student.name}
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6,4 10,8 6,12"/>
            </svg>
          </button>
          <button className="sm2-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="4" x2="12" y2="12"/>
              <line x1="12" y1="4" x2="4" y2="12"/>
            </svg>
          </button>
        </div>

        {/* Two-column body */}
        <div className="sm2-columns">
          {/* Left: book info */}
          <div className="sm2-sidebar">
            <div className="sm2-cover" style={{ background: d.book.color }}>
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <div className="sm2-cover-title">{d.book.title}</div>
            <div className="sm2-cover-author">{d.book.author}</div>
            {d.book.lexile && (
              <div className="sm2-lexile">{d.book.lexile}</div>
            )}
            <div className="sm2-meta-rows">
              {d.book.isbn      && <div className="sm2-meta-row"><span>ISBN</span><span>{d.book.isbn}</span></div>}
              {d.book.published && <div className="sm2-meta-row"><span>Published</span><span>{d.book.published}</span></div>}
              {d.book.publisher && <div className="sm2-meta-row"><span>Publisher</span><span>{d.book.publisher}</span></div>}
              {d.book.format    && <div className="sm2-meta-row"><span>Format</span><span>{d.book.format}</span></div>}
              {d.book.language  && <div className="sm2-meta-row"><span>Language</span><span>{d.book.language}</span></div>}
              {d.book.pageCount && <div className="sm2-meta-row"><span>Page count</span><span>{d.book.pageCount}</span></div>}
            </div>
          </div>

          {/* Right: session content */}
          <div className="sm2-main">
            {/* Session details */}
            <div className="sm2-section">
              <div className="sm2-section-head">
                <span className="sm2-section-title">Session Details</span>
                <span className="sm2-section-aside">Created on {createdStr}</span>
              </div>
              <table className="sm2-details-table">
                <thead>
                  <tr>
                    <th>Date Read</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{dateStr}</td>
                    <td>{d.minutesLogged.toLocaleString()} Minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Flags */}
            {hasFlags && (
              <div className="sm2-section">
                <div className="sm2-section-head">
                  <span className="sm2-section-title">Flags</span>
                </div>
                <div className="sm2-flags-list">
                  {d.flags.map(f => <FlagRow key={f.id} flag={f} />)}
                </div>
              </div>
            )}

            {/* Conversation */}
            <div className="sm2-section">
              <div className="sm2-section-head">
                <span className="sm2-section-title">Book Talks Conversation</span>
                <span className="sm2-section-aside">Conversation on {createdStr}</span>
              </div>
              <div className="sm2-conversation">
                {d.conversation.map((msg, i) => (
                  <ChatBubble key={i} msg={msg} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sm2-footer">
          <button className="sm2-btn sm2-btn--outline">Edit Session</button>
          <button className="sm2-btn sm2-btn--outline">Delete Session</button>
          {hasFlags && (
            <button className="sm2-btn sm2-btn--primary">Unflag Session</button>
          )}
        </div>
      </div>
    </Modal>
  )
}
