import { Icon } from '@components/Icon/Icon'
import { faceFor } from '../data'

// Render light markdown-ish *emphasis* as <em> so book titles in the scripted
// copy italicize without pulling in a markdown dep.
function renderText(text) {
  const parts = String(text).split(/(\*[^*]+\*)/g)
  return parts.map((p, i) =>
    p.startsWith('*') && p.endsWith('*') ? <em key={i}>{p.slice(1, -1)}</em> : p,
  )
}

// One chat row. Benny sits left with his avatar; the student sits right.
// When `onSpeak` is provided (live chat only — not the teacher transcript),
// Benny's messages get a text-to-speech button that animates while speaking.
export function ChatBubble({ msg, onSpeak, speaking = false }) {
  const isBenny = msg.role === 'benny'
  const canSpeak = isBenny && !!onSpeak
  return (
    <div className={`bt-bubble-wrap${isBenny ? ' bt-bubble-wrap--benny' : ''}`}>
      {isBenny && <img className="bt-bubble-avatar" src={faceFor(msg.emotion)} alt="Benny" />}
      <div
        className={`bt-bubble${isBenny ? ' bt-bubble--benny' : ' bt-bubble--student'}${
          msg.flagged ? ' bt-bubble--flagged' : ''
        }`}
      >
        <span className="bt-bubble-body">{renderText(msg.text)}</span>
        {canSpeak && (
          <button
            className={`bt-tts-btn${speaking ? ' is-speaking' : ''}`}
            onClick={onSpeak}
            aria-label={speaking ? 'Stop reading aloud' : 'Read aloud'}
            title="Read aloud"
          >
            {speaking ? (
              <span className="bt-eq" aria-hidden="true">
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
      </div>
    </div>
  )
}

// An inline annotation Benny leaves on a turn — green for a positive signal,
// amber for a concern. Used in the teacher review transcript.
export function AnnotationBlock({ msg }) {
  const positive = msg.sentiment === 'positive'
  return (
    <div
      className={`bt-annotation${positive ? ' bt-annotation--positive' : ' bt-annotation--warning'}`}
    >
      <Icon name={positive ? 'circle-check' : 'alert-circle'} size={13} />
      <span>{msg.text}</span>
    </div>
  )
}

// The "Benny is typing…" indicator shown in the live chat — Benny is thinking.
export function TypingBubble() {
  return (
    <div className="bt-bubble-wrap bt-bubble-wrap--benny">
      <img className="bt-bubble-avatar" src={faceFor('thinking')} alt="Benny" />
      <div className="bt-bubble bt-bubble--benny bt-bubble--typing" aria-label="Benny is typing">
        <span className="bt-typing-dot" />
        <span className="bt-typing-dot" />
        <span className="bt-typing-dot" />
      </div>
    </div>
  )
}
