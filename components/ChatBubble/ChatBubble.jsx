import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import '@components/ChatBubble/ChatBubble.css'

const BENNY_AVATAR = '/bs-prototypes/benny.png'

// Render light markdown-ish *emphasis* as <em> so book titles in scripted copy
// italicize without pulling in a markdown dep.
function renderText(text) {
  const parts = String(text).split(/(\*[^*]+\*)/g)
  return parts.map((p, i) =>
    p.startsWith('*') && p.endsWith('*') ? <em key={i}>{p.slice(1, -1)}</em> : p,
  )
}

/**
 * One turn of a Book Talk — Benny on the left behind his avatar, the reader on
 * the right. The same row serves the live chat and the teacher's transcript.
 *
 *   <ChatBubble msg={{ role: 'benny', text: 'Did you like *Wonder*?' }} />
 *   <ChatBubble msg={reply} initials="MC" />
 *   <ChatBubble msg={m} avatar={faceFor(m.emotion)} onSpeak={say} speaking={now} />
 *
 * `msg.flagged` outlines a concerning turn; `msg.trigger` marks the message a
 * safety signal fired on. `initials` puts the reader's monogram opposite
 * Benny's avatar — the transcript does this because a teacher is reading
 * someone else's conversation, where the live chat's "you on the right" is
 * enough. `avatar` overrides Benny's face (the live chat swaps it per
 * emotion); `onSpeak` adds the read-aloud button, which is live-chat only.
 *
 * `children` render inside the bubble, under the text — BTWB's transcript hangs
 * each answer's reasoning strip off the bottom of the answer's own bubble.
 */
/**
 * The stack the rows sit in. A `ChatBubble` draws one turn and has never owned
 * the space between turns — every consumer wrapped it in a flex column of its
 * own, which works right up until something renders the rows loose and they
 * come out touching. This is that column, so the rhythm ships with the rows.
 *
 *   <ChatThread>
 *     {msgs.map((m) => <ChatBubble key={m.id} msg={m} />)}
 *   </ChatThread>
 */
export function ChatThread({ children, className = '' }) {
  return <div className={`cht-thread ${className}`.trim()}>{children}</div>
}

export function ChatBubble({
  msg,
  initials,
  avatar,
  onSpeak,
  speaking = false,
  className = '',
  children,
}) {
  const isBenny = msg.role === 'benny'
  const canSpeak = isBenny && !!onSpeak
  const cls = [
    'cht-bubble',
    isBenny ? 'cht-bubble--benny' : 'cht-bubble--student',
    msg.flagged && 'cht-bubble--flagged',
    msg.trigger && 'cht-bubble--trigger',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`cht-row${isBenny ? ' cht-row--benny' : ''}`}>
      {isBenny && <img className="cht-avatar" src={avatar || BENNY_AVATAR} alt="Benny" />}
      <div className={cls}>
        <span className="cht-text">{renderText(msg.text)}</span>
        {canSpeak && (
          <button
            className={`cht-tts${speaking ? ' is-speaking' : ''}`}
            onClick={onSpeak}
            aria-label={speaking ? 'Stop reading aloud' : 'Read aloud'}
            title="Read aloud"
          >
            {speaking ? (
              <span className="cht-eq" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </span>
            ) : (
              <Icon name="volume" size={13} />
            )}
          </button>
        )}
        {children}
      </div>
      {!isBenny && initials && (
        <div className="cht-initials" aria-hidden="true">
          {initials}
        </div>
      )}
    </div>
  )
}

/**
 * Benny's note on the turn above it — a tinted band naming the flag he raised,
 * with his reasoning folded behind **Show reasoning**.
 *
 * The reasoning is the point: "Inaccurate Plot Detail" is an accusation, and a
 * teacher about to act on it is owed what the model actually compared. It's
 * folded because the transcript is the thing you're reading; the band is a
 * marker in it, not a paragraph.
 *
 * `msg.tone === 'safety'` is the wellbeing signal — one line, no disclosure,
 * because a safety note is not something to fold away.
 */
export function AnnotationBlock({ msg }) {
  const [open, setOpen] = useState(false)

  if (msg.tone === 'safety') {
    return (
      <div className="cht-note cht-note--safety">
        <Icon name="shield-heart" size={14} />
        <span>{msg.text}</span>
      </div>
    )
  }

  const tone = msg.sentiment === 'positive' ? 'positive' : 'warning'
  const label = msg.label ?? msg.text

  return (
    <div className={`cht-note cht-note--${tone}`}>
      <div className="cht-note-head">
        <Icon name="flag" size={13} stroke={2.2} className="cht-note-flag" />
        <span className="cht-note-label">{label}</span>
        {msg.why && (
          <button className="cht-note-toggle" onClick={() => setOpen((v) => !v)}>
            {open ? 'Hide reasoning' : 'Show reasoning'}
            <Icon name={open ? 'chevron-up' : 'chevron-down'} size={13} stroke={2.4} />
          </button>
        )}
      </div>
      {msg.why && open && <p className="cht-note-why">{msg.why}</p>}
    </div>
  )
}

/** The "Benny is typing…" indicator — the live chat only. */
export function TypingBubble({ avatar }) {
  return (
    <div className="cht-row cht-row--benny">
      <img className="cht-avatar" src={avatar || BENNY_AVATAR} alt="Benny" />
      <div className="cht-bubble cht-bubble--benny cht-bubble--typing" aria-label="Benny is typing">
        <span className="cht-dot" />
        <span className="cht-dot" />
        <span className="cht-dot" />
      </div>
    </div>
  )
}
