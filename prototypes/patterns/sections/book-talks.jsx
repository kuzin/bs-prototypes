import { useState } from 'react'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { ChatBubble, AnnotationBlock } from '../../book-talks/components/ChatBubble'
import { BennyChat } from '../../book-talks/components/BennyChat'
import { ConversationReview } from '../../book-talks/components/ConversationReview'
import { BadgeEditor } from '../../book-talks/components/BadgeEditor'
import { DEFAULT_BADGE, STUDENTS } from '../../book-talks/data'
import { Variant } from './_shared'

function BennyChatDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        Open BennyChat →
      </Button>
      <span style={{ fontSize: 13, color: '#64748B' }}>
        Tap the suggested replies to reach the badge award.
      </span>
      <BennyChat
        badge={DEFAULT_BADGE}
        open={open}
        onClose={() => setOpen(false)}
        onComplete={() => {}}
      />
    </div>
  )
}

function BadgeEditorDemo() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const openAs = (edit) => {
    setEditing(edit)
    setOpen(true)
  }
  return (
    <div style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button variant="primary" size="sm" onClick={() => openAs(false)}>
        Create (blank) →
      </Button>
      <Button variant="secondary" size="sm" onClick={() => openAs(true)}>
        Edit (pre-filled) →
      </Button>
      <BadgeEditor
        open={open}
        initial={editing ? DEFAULT_BADGE : null}
        onSave={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </div>
  )
}

function ConversationReviewDemo() {
  const [active, setActive] = useState(null)
  // s2 = Tyler, a flagged/disengaged conversation with annotations.
  const flagged = STUDENTS.find((s) => s.id === 's2')
  return (
    <div style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button variant="primary" size="sm" onClick={() => setActive(flagged)}>
        Open ConversationReview →
      </Button>
      <ConversationReview
        student={active}
        badge={DEFAULT_BADGE}
        open={!!active}
        onClose={() => setActive(null)}
      />
    </div>
  )
}

export const bookTalksSections = [
  {
    group: 'book-talks',
    id: 'bt-chat-bubble',
    name: 'ChatBubble',
    desc: (
      <>
        One chat row, used by both the live student chat and the teacher review transcript.{' '}
        <code>msg.role</code> is <code>benny</code> (left, with avatar) or <code>student</code>{' '}
        (right). <code>msg.flagged</code> outlines a concerning student turn.{' '}
        <code>AnnotationBlock</code> renders Benny's inline signal — green positive or amber
        warning. Light <code>*emphasis*</code> in the text renders as italics.
      </>
    ),
    render: () => (
      <div className="bt-root">
        <Variant label="conversation with annotations">
          <div style={{ padding: 16, maxWidth: 460 }}>
            <ChatBubble msg={{ role: 'benny', text: 'Did you like reading *Wonder*?' }} />
            <ChatBubble msg={{ role: 'student', text: "Yes! I couldn't put it down." }} />
            <AnnotationBlock
              msg={{ sentiment: 'positive', text: 'Benny noted positive sentiment.' }}
            />
            <ChatBubble msg={{ role: 'student', text: 'idk he did stuff', flagged: true }} />
            <AnnotationBlock
              msg={{ sentiment: 'warning', text: 'Benny flagged a minimal response.' }}
            />
          </div>
        </Variant>
      </div>
    ),
  },
  {
    group: 'book-talks',
    id: 'bt-benny-chat',
    name: 'BennyChat',
    desc: (
      <>
        The live conversation modal. Benny greets, then asks questions from{' '}
        <strong>the chosen prompt's script</strong> (<code>deriveScript(badge.promptId)</code>),
        with tap-to-send suggestions; the badge auto-awards at <code>badge.minExchanges</code>. Pass{' '}
        <code>preview</code> for the teacher test-drive — a "you're playing the student" banner and
        an award <em>marker</em> instead of a real award. Props: <code>badge</code>,{' '}
        <code>open</code>, <code>onClose</code>, <code>onComplete</code>, <code>preview</code>.
      </>
    ),
    render: () => (
      <Variant label="open / award flow" bare>
        <BennyChatDemo />
      </Variant>
    ),
  },
  {
    group: 'book-talks',
    id: 'bt-badge-editor',
    name: 'BadgeEditor',
    desc: (
      <>
        The full "AI Chat Activity" badge editor in a modal — the Book Talks twin of the Challenge
        Creator's badge editor (same chrome, disc-opens-gallery flow). Holds everything that defines
        the badge: art, name, a chosen Benny prompt, and the completion bar. Props:{' '}
        <code>open</code>, <code>initial</code> (null = create mode), <code>onSave</code>,{' '}
        <code>onCancel</code>.
      </>
    ),
    render: () => (
      <Variant label="create / edit modes" bare>
        <BadgeEditorDemo />
      </Variant>
    ),
  },
  {
    group: 'book-talks',
    id: 'bt-conversation-review',
    name: 'ConversationReview',
    desc: (
      <>
        Teacher's read of one Book Talk — transcript on the right, Benny's breakdown (status,
        engagement rating, positive signals, and flags) on the left. Read-only. Props:{' '}
        <code>student</code>, <code>badge</code>, <code>open</code>, <code>onClose</code>.
      </>
    ),
    render: () => (
      <Variant label="open (flagged conversation)" bare>
        <ConversationReviewDemo />
      </Variant>
    ),
  },
]
