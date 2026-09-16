import { Img } from '@mobile/components'
import './BennyChatParts.css'

/**
 * The four states the message list can hold besides a bubble. In the app these are string
 * sentinels pushed into the same `messages` array — `'run_loader'`, `'run_rate_conversation'`,
 * `'error'`, `'run_expired'`, `'connection_error'` — and `renderItem` switches on them.
 */

/** BennyLoader — three dots that hand a dark tone along the row and back, 500ms each way. */
export function BennyLoader() {
  return (
    <div className="m-bl" role="status" aria-label="Benny is thinking">
      {[0, 1, 2].map((i) => (
        <span key={i} className="m-bl-dot" style={{ animationDelay: `${i * 500}ms` }} />
      ))}
    </div>
  )
}

/** ConversationError — centred, for "Conversation expired" and "Connection error". */
export function ConversationError({ text }) {
  return (
    <div className="m-ce">
      <Img name="alert" size={16} />
      <span className="m-ce-text">{text}</span>
    </div>
  )
}

/** RetryButton — right-aligned under the message that failed, so it reads as the reader's own. */
export function RetryButton({ onRetry }) {
  return (
    <div className="m-rb">
      <Img name="alert" size={16} />
      <span className="m-rb-text">Failed to send</span>
      <span className="m-rb-line" />
      <button type="button" className="m-rb-retry" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

/** RateBennyConversation — the thumbs pair once a conversation finishes. */
export function RateBennyConversation({ rating, onRate }) {
  return (
    <div className="m-rc">
      <p className="m-rc-title">How was your conversation with Benny?</p>
      <div className="m-rc-row">
        <button
          type="button"
          className={`m-rc-btn m-rc-bad${rating === 'bad' ? ' is-picked' : ''}`}
          onClick={() => onRate?.('bad')}
        >
          <Img name="thumbs_down" size={16} />
          <span className="m-rc-label">Bad</span>
        </button>
        <button
          type="button"
          className={`m-rc-btn m-rc-good${rating === 'good' ? ' is-picked' : ''}`}
          onClick={() => onRate?.('good')}
        >
          <Img name="thumbs_up" size={16} />
          <span className="m-rc-label">Good</span>
        </button>
      </div>
    </div>
  )
}

/**
 * The end-conversation confirmation — a NotificationBasicModal. Its copy is deliberately about
 * reading integrity rather than convenience, which is the whole reason the flow exists.
 */
export function EndConversationModal({ open, onEnd, onCancel }) {
  if (!open) return null
  return (
    <div className="m-ecm">
      <div className="m-ecm-backdrop" onClick={onCancel} />
      <div className="m-ecm-card" role="dialog" aria-modal="true">
        <p className="m-ecm-title">End Conversation?</p>
        <p className="m-ecm-sub">
          If we end the conversation now, I can’t report back with confidence that you have logged
          your reading honestly. Are you sure you want to end the conversation?
        </p>
        <button type="button" className="m-ecm-end" onClick={onEnd}>
          End Conversation
        </button>
        <button type="button" className="m-ecm-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}
