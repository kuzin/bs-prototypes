import { useEffect, useRef, useState } from 'react'
import { Img, SheetHeader } from '@mobile/components'
import {
  BennyLoader,
  ConversationError,
  RetryButton,
  RateBennyConversation,
  EndConversationModal,
} from './BennyChatParts'
import './BennyChat.css'

/**
 * The Benny chat — `components/bookTalks/components/bennyChat/BennyChat.tsx`.
 *
 * A `presentation: 'modal'` screen with `gestureEnabled: false`, so it covers the whole navigator
 * and renders through PhoneFrame's `overlay` slot.
 *
 * Layout: header · a full-width 3pt progress bar · the message list · the input (dropped entirely
 * on a completed chat). Nothing else — no book-title row.
 *
 * `messages` mixes chat objects with STRING SENTINELS, which is how the app models transient
 * states in the same list: `run_loader`, `run_rate_conversation`, `error`, `run_expired`,
 * `connection_error`. `renderItem` switches on them.
 */
const MAX_CHARS = 255
const PROGRESS_MAX = 100
const ONE_SECOND = 1000

function Bubble({ role, headline, text }) {
  return (
    <div className={`m-bc-bubble m-bc-${role}`}>
      {headline && <p className="m-bc-headline">{headline}</p>}
      <p className="m-bc-text">{text}</p>
    </div>
  )
}

export function BennyChat({ chat, isCompleted = false, onClose, onFinishLater }) {
  const [messages, setMessages] = useState(chat.messages)
  const [draft, setDraft] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [reaction, setReaction] = useState(chat.reaction ?? 'happy')
  const [rating, setRating] = useState(null)
  const [endOpen, setEndOpen] = useState(false)

  // The bar is message UPLOAD progress, not question count: it fills 0→100 as the message posts,
  // then resets to 0 a second later. It is empty most of the time.
  const [progress, setProgress] = useState(0)
  const listRef = useRef(null)

  useEffect(() => {
    if (progress !== PROGRESS_MAX) return
    const t = setTimeout(() => setProgress(0), ONE_SECOND)
    return () => clearTimeout(t)
  }, [progress])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages, isThinking])

  const send = () => {
    const text = draft.replace(/(\r\n|\n|\r)+$/, '')
    if (!text) return

    setMessages((prev) => [...prev, { id: String(Date.now()), role: 'user', text }])
    setDraft('')

    // Upload, then Benny composes — handleRunStarted sets the Thinking face.
    setProgress(PROGRESS_MAX)
    setIsThinking(true)
    setReaction('thinking')

    setTimeout(() => {
      setIsThinking(false)
      setReaction('happy')
      const next = chat.replies?.[messages.filter((m) => m.role === 'user').length]
      setMessages((prev) => [
        ...prev,
        next ?? { id: `r${Date.now()}`, role: 'assistant', text: 'Thanks — that helps.' },
      ])
    }, 1600)
  }

  const isConversationFinished = messages.includes('run_rate_conversation')
  const showFinishLater = !isCompleted && !isConversationFinished

  return (
    <div className="m-bc">
      {/* On the shared SheetHeader now, which moves two things from where the app has them:
          dismiss goes LEFT (it was a right-hand `close_modal`) and "Finish Later" becomes the
          right-hand action. The centre slot is what makes that possible — Benny stays on the true
          centre whether or not "Finish Later" is showing, which is what the old three-div header
          was hand-balancing with a spacer. */}
      <SheetHeader
        className="m-bc-header"
        onClose={onClose}
        center={
          /* BennyHeaderReaction — from the separate bennyReactions registry; it swaps to
             `thinking` while Benny composes. The source draws it at 56, which had room in the
             old 74pt header but leaves 2pt either side in the shared 60pt bar. 48 is a
             deliberate divergence: the face needs air around it more than it needs the
             original number. */
          <Img name={reaction} size={48} />
        }
        right={
          showFinishLater ? (
            <button type="button" className="m-bc-later" onClick={() => setEndOpen(true)}>
              Finish Later
            </button>
          ) : null
        }
      />

      <div className="m-bc-progress">
        <div className="m-bc-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="m-bc-messages" ref={listRef}>
        {messages.map((m, i) =>
          typeof m === 'string' ? (
            m === 'run_loader' ? (
              <BennyLoader key={i} />
            ) : m === 'run_rate_conversation' ? (
              <RateBennyConversation key={i} rating={rating} onRate={setRating} />
            ) : m === 'error' ? (
              <RetryButton key={i} onRetry={() => {}} />
            ) : m === 'run_expired' ? (
              <ConversationError key={i} text="Conversation expired" />
            ) : m === 'connection_error' ? (
              <ConversationError key={i} text="Connection error" />
            ) : null
          ) : (
            <Bubble key={m.id} role={m.role} headline={m.headline} text={m.text} />
          ),
        )}
        {isThinking && <BennyLoader />}
      </div>

      {!isCompleted && (
        <div className="m-bc-input">
          <span className="m-bc-count">
            {draft.length} / {MAX_CHARS}
          </span>
          <div className={`m-bc-field${isThinking ? ' is-disabled' : ''}`}>
            <textarea
              rows={1}
              maxLength={MAX_CHARS}
              value={draft}
              readOnly={isThinking}
              placeholder="Your response..."
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              aria-label="Your response"
            />
            {/* The send button only EXISTS once there is a response — it is not a disabled
                button waiting to be enabled. */}
            {draft.trim().length > 0 && (
              <button
                type="button"
                className={`m-bc-send${isThinking ? ' is-thinking' : ''}`}
                // Keep the field focused: on device the keyboard stays up through a send, and the
                // caret stays in the box ready for the next answer.
                onMouseDown={(e) => e.preventDefault()}
                onClick={send}
                aria-label="Send"
              >
                <Img name="new_arrow_right" size={24} tint="var(--m-white)" />
              </button>
            )}
          </div>
        </div>
      )}

      <EndConversationModal
        open={endOpen}
        onEnd={() => {
          setEndOpen(false)
          onFinishLater?.()
        }}
        onCancel={() => setEndOpen(false)}
      />
    </div>
  )
}
