// The Engagement section of the student profile: the signal, what is driving
// it, Benny's read of it, and what to do about it.
//
// It renders inside the real profile panel through the profile's own
// `extraNav`/`renderExtra` slots, so it uses the profile's page frame — Hero,
// Card, SectionHeading — rather than a second card style inside the same
// panel.
import { useState } from 'react'
import { Hero } from '@components/Hero/Hero'
import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'
import { Icon } from '@components/Icon/Icon'
import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import '@components/Hero/Hero.css'
import '@components/BennyBubble/BennyBubble.css'

import { Card, SectionHeading } from '../../student-profile/components/kit'

import { SIGNALS, signalFor } from '../data'
import { SignalPill, SignalTrajectory, DriverList, HowItWorks, emphasize } from './Signal'
import './StudentSignal.css'

// The section's own accent, in the shape the profile's Hero and left rail take.
export const ENGAGEMENT_ACCENT = { text: '#0F766E', bg: '#E6F7F4' }

/**
 * The compact form, for the top of the profile's Overview. The Overview is
 * where a teacher lands, so the signal has to be legible there — but it is a
 * pointer to the section, not a second copy of it: pill, how long, the one
 * driver behind it, and a way in.
 */
export function SignalOverviewCard({ student, onNavigate }) {
  const sig = signalFor(student)
  if (!sig) return null
  const s = SIGNALS[sig.signal]

  return (
    <Card>
      <div className="es-ov">
        <div className="es-ov-main">
          <div className="es-ov-top">
            <SignalPill signal={sig.signal} size="lg" />
            <span className="es-ov-since">{sig.since}</span>
          </div>
          <div className="es-ov-head">{sig.headline}</div>
          <div className="es-ov-why">{s.short}</div>
        </div>
        <button type="button" className="bp-latest-link es-ov-link" onClick={() => onNavigate?.()}>
          What’s driving it
          <Icon name="arrow-right" size={14} />
        </button>
      </div>
    </Card>
  )
}

/** The full section. */
export function StudentSignal({ student }) {
  const sig = signalFor(student)
  const [howOpen, setHowOpen] = useState(false)
  const firstName = (sig?.name ?? student.name ?? '').split(' ')[0]

  if (!sig) {
    return (
      <div className="bp-content">
        <Hero
          icon={<PlumpyIcon name="insights" size={22} />}
          title="Engagement"
          accent={ENGAGEMENT_ACCENT.text}
          accentBg={ENGAGEMENT_ACCENT.bg}
        />
        <Card>
          <div className="es-ov-why">No signal for this reader yet.</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="bp-content">
      <Hero
        icon={<PlumpyIcon name="insights" size={22} />}
        title="Engagement"
        accent={ENGAGEMENT_ACCENT.text}
        accentBg={ENGAGEMENT_ACCENT.bg}
      />

      {/* The signal, and how long it has read this way. The trajectory sits in
          the same card because "Declining" and "declining since March" are one
          fact, and splitting them invites acting on a bad week. */}
      <Card>
        <div className="es-headline">
          <SignalPill signal={sig.signal} size="lg" />
          <div className="es-headline-text">
            <div className="es-headline-head">{sig.headline}</div>
            <div className="es-headline-since">{sig.since}</div>
          </div>
          <button
            type="button"
            className="es-how-toggle"
            onClick={() => setHowOpen((v) => !v)}
            aria-expanded={howOpen}
          >
            How this works
            <Icon name={howOpen ? 'chevron-up' : 'chevron-down'} size={13} stroke={2.4} />
          </button>
        </div>
        {howOpen && <HowItWorks />}
        <div className="es-traj-wrap">
          <SignalTrajectory trajectory={sig.trajectory} />
        </div>
      </Card>

      {/* Benny explains the signal — the ticket's "Benny would explain what is
          driving the signal". Same bubble the Overview's summary uses. */}
      <Card>
        <SectionHeading>Benny says...</SectionHeading>
        <BennyBubble>{emphasize(sig.explanation)}</BennyBubble>
      </Card>

      <Card>
        <SectionHeading>What’s driving it</SectionHeading>
        <DriverList drivers={sig.drivers} />
      </Card>

      {/* "…and recommend questions or actions for the educator" — two lists,
          because they are two different jobs. The questions are the ones you
          can ask in the two minutes you actually get with this reader. */}
      <Card>
        <SectionHeading>Ask {firstName}</SectionHeading>
        <ul className="es-ask">
          {sig.ask.map((q) => (
            <li key={q}>
              <Icon name="message-circle" size={15} />
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card flush>
        <div className="bp-actions-title">Recommended actions</div>
        {sig.actions.map((a) => (
          <div key={a.title} className="bp-action-item">
            <div className="bp-action-body">
              <div className="bp-action-title">{a.title}</div>
              <div className="bp-action-text">{a.body}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
