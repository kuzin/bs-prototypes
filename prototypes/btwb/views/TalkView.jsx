import { useState } from 'react'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { BookTalkModal } from '../components/BookTalkModal'
import { CONVERSATION_FOCUSES, TALK_KINDS, READER, BOOK } from '../data'

import '@components/Button/Button.css'
import '@components/Modal/Modal.css'
import '@components/Primitives/Primitives.css'
// Chat bubbles + the composer/award styling come from the Book Talk Badges
// prototype, so the two chat surfaces look and behave the same.
import '../../book-talks/index.css'

const KINDS = [TALK_KINDS.engagement, TALK_KINDS.comprehension, TALK_KINDS.integrity]

// "an engagement book talk" / "a comprehension book talk"
const article = (word) => (/^[aeiou]/i.test(word) ? 'an' : 'a')

// All three talk types on one book: pick a type (and, for comprehension, a
// Conversation Focus) and have the conversation.
//
// Same reader, same book, three very different conversations — that's the point.
// An engagement talk asks how it landed, a comprehension talk works a reading
// skill in as conversation, and an integrity talk keeps a suspicious log company
// without ever grading it.
//
// Transcripts live here, keyed by type + focus, so closing a talk part-way and
// reopening it resumes rather than restarting.
export function TalkView({ settings }) {
  const [kindId, setKindId] = useState('comprehension')
  // Default the focus to whatever the site is set to, so the views line up.
  const [focusId, setFocusId] = useState(settings.completionFocus)
  const [open, setOpen] = useState(false)
  const [sessions, setSessions] = useState({})

  const kind = TALK_KINDS[kindId]
  const key = kindId === 'comprehension' ? `${kindId}:${focusId}` : kindId
  const session = sessions[key]
  const inProgress = session?.messages?.length > 0 && !session.done

  return (
    <div className="bw-scroll">
      <div className="bw-page">
        <header className="bw-page-head">
          <div>
            <h1 className="bw-h1">Book talk examples</h1>
            <p className="bw-sub">
              {READER.name} · {READER.gradeLabel} · same book, all three talk types
            </p>
          </div>
        </header>

        {/* ── Pick an example ──────────────────────────────────────────────── */}
        {/* Chips rather than descriptive cards: this is a demo switcher, and each
          type is already explained where it's configured. */}
        <section className="bw-panel">
          <div className="bw-pick">
            <h2 className="bw-pick-label">Talk type</h2>
            <div className="bw-focus-chips" role="radiogroup" aria-label="Talk type">
              {KINDS.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  role="radio"
                  aria-checked={k.id === kindId}
                  className={`bw-focus-chip${k.id === kindId ? ' is-active' : ''}`}
                  style={{ '--chip': k.color }}
                  onClick={() => setKindId(k.id)}
                >
                  <Icon name={k.icon} size={14} />
                  {k.short}
                </button>
              ))}
            </div>
          </div>

          {/* Only comprehension talks carry a focus. */}
          {kindId === 'comprehension' && (
            <div className="bw-pick">
              <h2 className="bw-pick-label">Conversation Focus</h2>
              <div className="bw-focus-chips" role="radiogroup" aria-label="Conversation focus">
                {CONVERSATION_FOCUSES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={f.id === focusId}
                    className={`bw-focus-chip${f.id === focusId ? ' is-active' : ''}`}
                    onClick={() => setFocusId(f.id)}
                  >
                    {f.id === focusId && <Icon name="check" size={14} />}
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── The book ──────────────────────────────────────────────────────── */}
        <section className="bw-log">
          <img className="bw-log-cover" src={BOOK.cover} alt="" />
          <div className="bw-log-body">
            <h2 className="bw-log-title">{BOOK.title}</h2>
            <p className="bw-log-author">{BOOK.author}</p>
            <p className="bw-log-meta">
              <Icon name="book-2" size={14} /> {BOOK.pages} pages ·{' '}
              {kindId === 'integrity' ? '320 minutes logged today' : 'logged as complete today'}
            </p>
            <div className="bw-log-state">
              {/* The talk type reads better in the label than as a pill beside it,
                and the button takes that type's color. */}
              <Button
                variant="accent"
                accent={kind.color}
                icon={<Icon name={inProgress ? 'refresh' : kind.icon} size={16} />}
                onClick={() => setOpen(true)}
              >
                {inProgress
                  ? 'Resume the book talk'
                  : `Start ${article(kind.short)} ${kind.short.toLowerCase()} book talk`}
              </Button>
              {inProgress && (
                <span className="bw-log-resume">
                  {session.messages.filter((m) => m.role === 'student').length} answered so far
                </span>
              )}
            </div>
          </div>
        </section>

        <BookTalkModal
          // Remount per talk so switching type/focus starts that talk's own
          // transcript rather than inheriting the previous one.
          key={key}
          open={open}
          kindId={kindId}
          focusId={focusId}
          session={session}
          onSession={(s) => setSessions((prev) => ({ ...prev, [key]: s }))}
          onClose={() => setOpen(false)}
        />
      </div>
    </div>
  )
}
