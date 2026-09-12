import { useState } from 'react'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { ChatBubble, AnnotationBlock, TypingBubble } from '@components/ChatBubble/ChatBubble'
import { BennyChat } from '../../book-talks/components/BennyChat'
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
      <span style={{ fontSize: 13, color: '#707070' }}>
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

export const bookTalksSections = [
  {
    // Three prototypes render this conversation — the live reader chat, SFR's
    // session modal and BTWB's transcript — so it lives in @components and is
    // catalogued with the rest of the shared feedback surfaces.
    group: 'feedback',
    id: 'bt-chat-bubble',
    name: 'ChatBubble',
    usage: `import { ChatBubble, AnnotationBlock, TypingBubble } from '@components/ChatBubble/ChatBubble'

<ChatBubble msg={{ role: 'benny', text: 'Did you like *Wonder*?' }} />
<ChatBubble msg={reply} initials="MC" />
<AnnotationBlock msg={{ sentiment: 'warning', label: 'Minimal Response', why: '…' }} />
<TypingBubble />`,
    desc: (
      <>
        One turn of a Book Talk — Benny on the left behind his avatar, the reader on the right. The
        same row serves the live chat and the teacher&apos;s transcript. <code>msg.flagged</code>{' '}
        tints a concerning turn and <code>msg.trigger</code> marks the message a safety signal fired
        on; <code>initials</code> adds the reader&apos;s monogram (the transcript does this because
        a teacher is reading someone else&apos;s conversation), <code>avatar</code> overrides
        Benny&apos;s face per emotion, and <code>onSpeak</code> adds read-aloud. Light{' '}
        <code>*emphasis*</code> renders as italics.
        <br />
        <br />
        <code>AnnotationBlock</code> is Benny&apos;s note on the turn above it — a tinted band
        naming the flag, with the reasoning folded behind <strong>Show reasoning</strong>, because
        &ldquo;Inaccurate Plot Detail&rdquo; is an accusation and a teacher about to act on it is
        owed what the model compared. Consecutive notes stack into one band. A{' '}
        <code>tone: &apos;safety&apos;</code> note is one line with no disclosure — a wellbeing
        signal is not something to fold away. The reader bubble&apos;s colour is a token (
        <code>--cht-student-bg</code>): teal in the live chat, the app&apos;s quiet blue in the
        transcript.
      </>
    ),
    render: () => (
      <>
        <Variant label="transcript — annotated, with reasoning">
          <ChatBubble msg={{ role: 'benny', text: 'What did you like about *Wonder*?' }} />
          <ChatBubble
            msg={{ role: 'student', text: "Auggie's helmet stuff was my favorite part." }}
            initials="MC"
          />
          <AnnotationBlock
            msg={{
              sentiment: 'positive',
              label: 'Specific Detail',
              why: 'The answer names an object and a scene from the book rather than restating the question, which is the signal we treat as evidence the reader finished it.',
            }}
          />
          <ChatBubble
            msg={{ role: 'student', text: 'idk he did stuff', flagged: true }}
            initials="MC"
          />
          <AnnotationBlock
            msg={{
              sentiment: 'warning',
              label: 'Minimal Response',
              why: 'Four words, no detail from the text, and no answer to what was asked — below the length and specificity thresholds for a scored answer.',
            }}
          />
          <AnnotationBlock
            msg={{
              sentiment: 'warning',
              label: 'Inaccurate Plot Detail',
              why: 'No character in Wonder does what this answer describes.',
            }}
          />
        </Variant>
        <Variant label="safety signal — the turn it fired on">
          <ChatBubble
            msg={{
              role: 'student',
              text: 'sometimes i wish i could just disappear',
              trigger: true,
            }}
            initials="TW"
          />
          <AnnotationBlock
            msg={{ tone: 'safety', text: 'Benny flagged this for wellbeing review.' }}
          />
        </Variant>
        <div className="bt-root">
          <Variant label="live chat — teal reader bubble, read-aloud, typing">
            <div className="bt-chat-scroll">
              <ChatBubble
                msg={{ role: 'benny', text: 'Did you like reading *Wonder*?' }}
                onSpeak={() => {}}
              />
              <ChatBubble msg={{ role: 'student', text: "Yes! I couldn't put it down." }} />
              <TypingBubble />
            </div>
          </Variant>
        </div>
      </>
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
      <Variant label="open / award flow">
        <BennyChatDemo />
      </Variant>
    ),
  },
  {
    // The Challenge Creator's group: this is that editor's twin (same chrome,
    // same disc-opens-gallery flow) and it belongs beside it, not off in the
    // prototype whose folder happens to hold the file.
    group: 'challenge-creator',
    id: 'bt-badge-editor',
    name: 'BadgeEditor',
    desc: (
      <>
        The badge editor in a modal — same chrome and the same disc-opens-gallery flow as the
        Challenge Creator's, which is why it's catalogued here; the file itself lives in Book Talks,
        where the "AI Chat Activity" badge type it edits belongs. Holds everything that defines the
        badge: art, name, a chosen Benny prompt, and the completion bar. Props: <code>open</code>,{' '}
        <code>initial</code> (null = create mode), <code>onSave</code>, <code>onCancel</code>.
      </>
    ),
    render: () => (
      <Variant label="create / edit modes">
        <BadgeEditorDemo />
      </Variant>
    ),
  },
]
