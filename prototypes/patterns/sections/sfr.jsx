import { useState } from 'react'
import { Button } from '@components/Button/Button'
import { Modal } from '@components/Modal/Modal'
import { Table } from '@components/Table/Table'
import { Toggle } from '@components/Toggle/Toggle'
import { Field, Input, Textarea } from '@components/Form/Form'
import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import { HighlightCard } from '../../sfr/components/Overview'
import { SessionsTable } from '../../sfr/components/SessionsTable'
import { SessionModal } from '../../sfr/components/SessionModal'
import { Knobs, Variant } from './_shared'

function BennyBubbleKnobs() {
  const [text, setText] = useState(
    "Marcus is an outstanding reader. He's logged reading on 21 of the last 30 days — the highest consistency in the class — and is reading well above grade level at 870L.",
  )
  const [withTimestamp, setWithTimestamp] = useState(false)
  const [timestamp, setTimestamp] = useState('May 15 at 9:55am')
  return (
    <>
      <Knobs>
        <Field label="text" className="pt-knob-full">
          <Textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} />
        </Field>
        <Field label="timestamp">
          <Toggle checked={withTimestamp} onChange={setWithTimestamp} />
        </Field>
        {withTimestamp && (
          <Field label="timestamp text">
            <Input value={timestamp} onChange={(e) => setTimestamp(e.target.value)} />
          </Field>
        )}
      </Knobs>
      <div className="pt-variant-frame">
        <BennyBubble timestamp={withTimestamp ? timestamp : undefined}>{text}</BennyBubble>
      </div>
    </>
  )
}

const DEMO_SESSIONS = [
  {
    id: 'dm-1',
    student: { id: 's1', name: 'Tyler Williams', grade: '5th', initials: 'TW', color: '#7C3AED' },
    book: { title: "Charlotte's Web", author: 'E.B. White', color: '#7C3AED' },
    date: '2025-05-12',
    type: 'both',
    status: 'completed',
    engagementRating: 'yellow',
    minutesLogged: 54,
    flags: [
      {
        id: 'f1',
        type: 'copy-paste',
        label: 'Copy-Paste Detected',
        description: 'Response matched an online book summary verbatim.',
      },
      {
        id: 'f2',
        type: 'no-recall',
        label: 'No Book Recall',
        description: 'Could not name any secondary characters.',
      },
    ],
    conversation: [
      {
        role: 'benny',
        text: "Hi! I'm Benny. Let's talk about Charlotte's Web. What was your favorite part?",
      },
      {
        role: 'student',
        text: "Charlotte's Web is a story about a pig named Wilbur who befriends a spider named Charlotte.",
        flagged: true,
      },
      {
        role: 'benny',
        text: "That's a great summary! But what was your personal favorite moment in the book?",
      },
      { role: 'student', text: 'I liked when Charlotte wrote in the web to save Wilbur.' },
      {
        role: 'benny',
        text: 'Nice! How do you think Wilbur felt when he found out what Charlotte did for him?',
      },
      {
        role: 'student',
        text: 'He felt happy and grateful because Charlotte was his best friend and she saved his life.',
      },
    ],
  },
  {
    id: 'dm-2',
    student: { id: 's2', name: 'Caleb Brown', grade: '4th', initials: 'CB', color: '#16A97A' },
    book: { title: 'Wonder', author: 'R.J. Palacio', color: '#16A97A' },
    date: '2025-05-13',
    type: 'engagement',
    status: 'completed',
    engagementRating: 'green',
    minutesLogged: 38,
    flags: [],
    conversation: [
      { role: 'benny', text: "Hey! Let's talk about Wonder. What did you think of Auggie?" },
      {
        role: 'student',
        text: 'I really liked Auggie. He was super brave going to school even though kids were mean to him.',
      },
      { role: 'benny', text: 'What part of the book stuck with you the most?' },
      {
        role: 'student',
        text: "When Julian apologized at the end. I didn't expect that and it felt really real.",
      },
    ],
  },
]

function SessionModalDemo() {
  const [activeSession, setActiveSession] = useState(null)
  const [sessions, setSessions] = useState(DEMO_SESSIONS)

  function handleUpdate(updated) {
    setActiveSession(updated)
    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
  }

  return (
    <div style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button
        variant="primary"
        size="sm"
        accent="#16A97A"
        onClick={() => setActiveSession(sessions[0])}
      >
        Open SessionModal →
      </Button>
      {activeSession && (
        <span style={{ fontSize: 13, color: '#64748B' }}>
          Modal open — click Done or × to close
        </span>
      )}
      <SessionModal
        session={activeSession}
        sessions={sessions}
        onClose={() => setActiveSession(null)}
        onUpdateSession={handleUpdate}
        onDeleteSession={() => setActiveSession(null)}
      />
    </div>
  )
}

const SESSIONS_TABLE_DEMO = [
  {
    id: 'demo-1',
    student: { id: 's1', name: 'Tyler Williams', grade: '5th', initials: 'TW', color: '#7C3AED' },
    book: { title: "Charlotte's Web", author: 'E.B. White' },
    date: '2025-05-12',
    type: 'flagged',
    status: 'completed',
    engagementRating: null,
    minutesLogged: 42,
    flags: [
      {
        id: 'f1',
        type: 'copy-paste',
        label: 'Copy-Paste Detected',
        description: 'Response matched online summary verbatim.',
      },
    ],
    conversation: [],
  },
  {
    id: 'demo-2',
    student: { id: 's2', name: 'Caleb Brown', grade: '4th', initials: 'CB', color: '#16A97A' },
    book: { title: 'Wonder', author: 'R.J. Palacio' },
    date: '2025-05-13',
    type: 'engagement',
    status: 'completed',
    engagementRating: 'green',
    minutesLogged: 38,
    flags: [],
    conversation: [],
  },
  {
    id: 'demo-3',
    student: { id: 's3', name: 'Emma Parker', grade: '6th', initials: 'EP', color: '#7C3AED' },
    book: { title: 'The Giver', author: 'Lois Lowry' },
    date: '2025-05-14',
    type: 'both',
    status: 'unfinished',
    engagementRating: 'yellow',
    minutesLogged: 55,
    flags: [
      {
        id: 'f2',
        type: 'minimal',
        label: 'Minimal Responses',
        description: 'Most answers were one word.',
      },
    ],
    conversation: [],
  },
  {
    id: 'demo-4',
    student: { id: 's4', name: 'Lily Martinez', grade: '3rd', initials: 'LM', color: '#E8866A' },
    book: { title: 'Diary of a Wimpy Kid', author: 'Jeff Kinney' },
    date: '2025-05-14',
    type: 'engagement',
    status: 'completed',
    engagementRating: 'red',
    minutesLogged: 29,
    flags: [],
    conversation: [],
  },
]

function SessionsTableKnobs() {
  const [showTypeColumn, setShowTypeColumn] = useState(true)
  return (
    <>
      <Knobs>
        <Field label="showTypeColumn">
          <Toggle checked={showTypeColumn} onChange={setShowTypeColumn} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--full">
        <SessionsTable
          showTypeColumn={showTypeColumn}
          onSelectSession={() => {}}
          sessions={SESSIONS_TABLE_DEMO}
        />
      </div>
    </>
  )
}

export const sfrSections = [
  {
    group: 'sfr',
    id: 'sfr-benny-bubble',
    name: 'BennyBubble',
    desc: (
      <>
        Benny's avatar + speech bubble with a left-pointing chat arrow. Pass text or JSX as{' '}
        <code>children</code>. Use <code>{'<strong>'}</code> for bold emphasis. Pass{' '}
        <code>timestamp</code> to show an "Analysis last run on …" line below the bubble.
      </>
    ),
    render: () => (
      <>
        <BennyBubbleKnobs />
      </>
    ),
  },
  {
    group: 'sfr',
    id: 'sfr-highlight-card',
    name: 'HighlightCard',
    desc: (
      <>
        Overview card for a student-action category. Props: <code>variant</code> (danger | success |
        warning | intercede | neutral), <code>icon</code>, <code>title</code>,{' '}
        <code>description</code>, <code>students</code>, <code>totalCount</code>,{' '}
        <code>totalLabel</code>, <code>onViewAll</code>.
      </>
    ),
    render: () => (
      <>
        <Variant label="danger — integrity flags">
          <HighlightCard
            variant="danger"
            icon={
              <svg
                viewBox="0 0 16 16"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 2v12" />
                <path d="M3 2h8l-2 4 2 4H3" />
              </svg>
            }
            title="Validate / Intercede"
            description="Students with multiple flagged integrity sessions"
            students={[
              {
                initials: 'TW',
                color: '#7C3AED',
                name: 'Tyler Williams',
                count: 2,
                countLabel: 'flags',
              },
              {
                initials: 'MJ',
                color: '#0DA7BC',
                name: 'Marcus Johnson',
                count: 1,
                countLabel: 'flags',
              },
            ]}
            totalCount={2}
            totalLabel="students"
            onViewAll={() => {}}
          />
        </Variant>
        <Variant label="success — celebrate green">
          <HighlightCard
            variant="success"
            icon={
              <svg
                viewBox="0 0 16 16"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 2c.2 1.8-.9 2.6-1.9 3.6C5.2 6.5 4 7.7 4 9.5 4 11.9 5.8 14 8 14s4-2 4-4.5c0-1.4-.5-2.2-1.1-2.8" />
              </svg>
            }
            title="Celebrate"
            description="Students with positive engagement Book Talks"
            students={[
              {
                initials: 'CB',
                color: '#16A97A',
                name: 'Caleb Brown',
                count: 3,
                countLabel: 'green talks',
              },
              {
                initials: 'ML',
                color: '#E8866A',
                name: 'Maya Lee',
                count: 2,
                countLabel: 'green talks',
              },
              {
                initials: 'SC',
                color: '#D97706',
                name: 'Sofia Chen',
                count: 1,
                countLabel: 'green talks',
              },
            ]}
            totalCount={5}
            totalLabel="students"
            onViewAll={() => {}}
          />
        </Variant>
        <Variant label="warning — review mixed">
          <HighlightCard
            variant="warning"
            icon={
              <svg
                viewBox="0 0 16 16"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 2l1.5 4h4l-3 2.5 1 4L8 10l-3.5 2.5 1-4L2 6h4z" />
              </svg>
            }
            title="Review / Assess"
            description="Students with mixed engagement Book Talks"
            students={[
              {
                initials: 'EP',
                color: '#7C3AED',
                name: 'Emma Parker',
                count: 2,
                countLabel: 'yellow talks',
              },
            ]}
            totalCount={1}
            totalLabel="students"
            onViewAll={() => {}}
          />
        </Variant>
        <Variant label="neutral — give time (unfinished)">
          <HighlightCard
            variant="neutral"
            icon={
              <svg
                viewBox="0 0 16 16"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="8" r="6" />
                <polyline points="8,4 8,8 11,10" />
              </svg>
            }
            title="Give Students Time"
            description="Students with unfinished Benny conversations"
            students={[
              {
                initials: 'ZA',
                color: '#0DA7BC',
                name: 'Zara Ahmed',
                count: 1,
                countLabel: 'unfinished',
              },
              {
                initials: 'NH',
                color: '#475569',
                name: 'Noah Harris',
                count: 1,
                countLabel: 'unfinished',
              },
            ]}
            totalCount={2}
            totalLabel="students"
            onViewAll={() => {}}
          />
        </Variant>
      </>
    ),
  },
  {
    group: 'sfr',
    id: 'sfr-sessions-table',
    name: 'SessionsTable',
    desc: (
      <>
        Table of BTWB sessions. Props: <code>sessions</code> (array), <code>onSelectSession</code>{' '}
        (row click + Review button), <code>showTypeColumn</code> (bool, default true). Wraps the
        shared <code>Table</code> component with domain-specific columns: student, book, date, type
        pill, status pill, engagement dot, flag count.
      </>
    ),
    render: () => (
      <>
        <SessionsTableKnobs />
      </>
    ),
  },
  {
    group: 'sfr',
    id: 'sfr-session-modal',
    name: 'SessionModal',
    desc: (
      <>
        Right-slide detail panel for a single BTWB session. Props: <code>session</code> (null =
        closed), <code>sessions</code> (full list for Next nav), <code>onClose</code>,{' '}
        <code>onUpdateSession</code>, <code>onDeleteSession</code>. Shows integrity flags (with
        dismiss), engagement rating + override, and full conversation transcript.
      </>
    ),
    render: () => (
      <>
        <Variant label="open / closed toggle" bare>
          <SessionModalDemo />
        </Variant>
      </>
    ),
  },
]
