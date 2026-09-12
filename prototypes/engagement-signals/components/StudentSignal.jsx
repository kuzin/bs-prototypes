// The Engagement section of the student profile: the signal, what is driving
// it, Benny's read of it, and what to do about it.
//
// It renders inside the real profile panel through the profile's own
// `extraNav`/`renderExtra` slots, so it uses the profile's page frame — Hero,
// Card, SectionHeading — rather than a second card style inside the same
// panel.
import { useState, useEffect } from 'react'
import { Hero } from '@components/Hero/Hero'
import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'
import { Icon } from '@components/Icon/Icon'
import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import { Select } from '@components/Form/Form'
import { FilterBar, FilterItem } from '@components/FilterBar/FilterBar'
import '@components/Hero/Hero.css'
import '@components/BennyBubble/BennyBubble.css'
import '@components/Form/Form.css'
import '@components/FilterBar/FilterBar.css'

import { Card, SectionHeading } from '../../student-profile/components/kit'

import { SIGNALS, signalFor, currentPeriod } from '../data'
import { SignalPill, DriverList, emphasize } from './Signal'
import './StudentSignal.css'

// Worst to best, left to right — a scale reads in one direction or it isn't
// one. `pending` is not on it: "not enough data" is the absence of a reading,
// not a band of it, so that reader's bar simply has nothing lit.
const HEAT_ORDER = ['declining', 'consistent', 'increasing']

// The section's own accent, in the shape the profile's Hero and left rail take.
export const ENGAGEMENT_ACCENT = { text: '#0F766E', bg: '#E6F7F4' }

/**
 * The compact form, for the top of the profile's Overview. The Overview is
 * where a teacher lands, so the signal has to be legible there — but it is a
 * pointer to the section, not a second copy of it: the reading, and a way in.
 *
 * It takes the same titled head row as the Daily Goals card below it, rather
 * than a heading of its own invention, so the Overview reads as one page.
 */
export function SignalOverviewCard({ student, onNavigate }) {
  const sig = signalFor(student)
  const now = currentPeriod(sig)
  if (!sig) return null

  return (
    <Card>
      <div className="bp-latest-head">
        <SectionHeading>Reading Engagement</SectionHeading>
        <button type="button" className="bp-latest-link" onClick={() => onNavigate?.()}>
          What’s driving it
          <Icon name="arrow-right" size={14} />
        </button>
      </div>
      {/* The headline is what a teacher reads; the pill is the answer they're
          checking it against, so it sits at the row's trailing edge where the
          other Overview cards put their figure. How long it has read this way
          is on the section itself — repeating it here made the card a
          paragraph. */}
      <div className="es-ov">
        <div className="es-ov-head">{now.headline}</div>
        <SignalPill signal={now.signal} size="lg" />
      </div>
    </Card>
  )
}

/** The full section. */
export function StudentSignal({ student }) {
  const sig = signalFor(student)
  // Which window is being read. Starts on the live one; the strip steps back
  // through the rest. Reset when the panel's pager moves to another reader —
  // "the third cell" means nothing across two people.
  const lastIdx = sig ? sig.trajectory.length - 1 : 0
  const [periodIdx, setPeriodIdx] = useState(lastIdx)
  useEffect(() => setPeriodIdx(lastIdx), [student, lastIdx])

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
          <div className="es-ov-head">No signal for this reader yet.</div>
        </Card>
      </div>
    )
  }

  const period = sig.trajectory[Math.min(periodIdx, lastIdx)]
  const isCurrent = Boolean(period.current)
  const firstName = sig.name.split(' ')[0]

  return (
    <div className="bp-content">
      <Hero
        icon={<PlumpyIcon name="insights" size={22} />}
        title="Engagement"
        accent={ENGAGEMENT_ACCENT.text}
        accentBg={ENGAGEMENT_ACCENT.bg}
      />

      {/* The period picker is a filter over everything below it, so it sits in
          the same bar every other tab filters from rather than inside the card
          it happens to change first — the same call the Motivation tab makes
          for its index period. Newest first, the way that select reads. */}
      <FilterBar compact>
        <FilterItem label="Period">
          <Select
            size="sm"
            value={periodIdx}
            onChange={(e) => setPeriodIdx(Number(e.target.value))}
          >
            {[...sig.trajectory].reverse().map((p) => {
              const i = sig.trajectory.indexOf(p)
              return (
                <option key={p.label} value={i}>
                  {p.range}
                  {p.current ? ' (current)' : ''}
                </option>
              )
            })}
          </Select>
        </FilterItem>
      </FilterBar>

      {/* The page says the reading, then spends the rest of itself on why. So
          the reading gets a block of its own and states it outright, rather
          than a pill tucked into a header. The bar only — the sentence that
          used to sit under it said what Benny says immediately below, and the
          headline still leads the card on the Overview, which is the one place
          it isn't a second telling. */}
      <Card>
        <SectionHeading>
          {isCurrent ? 'Current signal' : `Signal for ${period.range}`}
        </SectionHeading>
        {/* The three readings as a scale, worst to best, with the reader's
              band lit. It says the signal and shows what it is a signal out of
              in the same object — and it stays honest about there being three
              bands rather than a continuum, which a gradient would imply and
              this feature deliberately doesn't have. */}
        <div className="es-heat" role="img" aria-label={`Signal: ${SIGNALS[period.signal].label}`}>
          {HEAT_ORDER.map((key) => {
            const g = SIGNALS[key]
            const on = key === period.signal
            return (
              <span
                key={key}
                className={`es-heat-seg${on ? ' es-heat-seg--on' : ''}`}
                style={{ '--es-c': g.color, '--es-bg': g.bg }}
              >
                {on && <Icon name={g.icon} size={16} stroke={2.9} />}
                {g.label}
              </span>
            )
          })}
        </div>
      </Card>

      {/* Benny explains the signal — the ticket's "Benny would explain what is
          driving the signal". Same bubble the Overview's summary uses. */}
      <Card>
        <SectionHeading>Benny says...</SectionHeading>
        {/* The face follows the signal — he isn't grinning while he tells you a
            reader has stopped reading. */}
        <BennyBubble avatar={SIGNALS[period.signal].avatar}>
          {emphasize(period.explanation)}
        </BennyBubble>
      </Card>

      {/* The Overview's stat-list card, rather than a card of this section's
          own: these are at-a-glance figures with a trend beside them, which is
          the job that card already does. */}
      <div className="section-card bp-card bp-statlist">
        <div className="bp-statlist-head">
          <SectionHeading>What’s driving it</SectionHeading>
          {/* What every figure and arrow below is measured against, said once
              rather than repeated down the column — the same note the profile's
              own stat lists carry. */}
          <span className="bp-statlist-note">
            {isCurrent ? 'Last 30 days vs the 30 before' : `${period.range} vs the 30 before`}
          </span>
        </div>
        <DriverList drivers={period.drivers} />
      </div>

      {/* "…and recommend questions or actions for the educator" — two lists,
          because they are two different jobs. Both are advice for now, so a
          closed period doesn't carry them: what to ask in March isn't a thing
          you can act on. */}
      {isCurrent && (
        <>
          <Card flush>
            <div className="bp-actions-title">Ask {firstName}</div>
            <ul className="es-ask">
              {sig.ask.map((q) => (
                <li key={q}>
                  <Icon name="message-circle" size={18} />
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
        </>
      )}
    </div>
  )
}
