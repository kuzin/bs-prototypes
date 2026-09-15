import { useState } from 'react'
import { Banner } from '@components/Primitives/Primitives'
import { Button } from '@components/Button/Button'
import { SectionCard } from '@components/SectionCard/SectionCard'
import { SettingRow, SettingList } from '@components/SettingRow/SettingRow'
import { Stepper } from '@components/Stepper/Stepper'
import { TalkKindPicker } from '../components/TalkKindPicker'
import { TALK_KINDS, article } from '../data'

import '@components/Button/Button.css'
import '@components/SectionCard/SectionCard.css'
import '@components/Stepper/Stepper.css'
/* The step this setting lives in is a step of the Challenge Creator, so it wears
   the creator's own chrome — the title bar and the step rail — rather than
   standing on a bare page as if it were somewhere else in the admin. */
import '../../challenge-creator/index.css'

/* `getSteps` for a reading challenge a full-tier admin is building. Fixed here:
   this prototype shows one step of that walk-through, not the walk-through. */
const PHASES = [
  { id: 'type', name: 'Type' },
  { id: 'details', name: 'Details' },
  { id: 'badges', name: 'Badges' },
  { id: 'rewards', name: 'Rewards' },
  { id: 'completion', name: 'Completion' },
  { id: 'review', name: 'Review' },
]

// The challenge-level Book Talks step.
//
// The Challenge Creator's existing "Book Talks" step, extended with the setting
// the new talk type needs: which kind of conversation Benny should have. Today
// the step only offers engagement talks on title completions, which is why the
// choice needs a home here as well as in Site Settings — a 5th-grade novel study
// wants a different conversation than the site-wide default. Integrity talks
// aren't on the menu: they're a site-wide trigger, not a per-challenge setting.
//
// Laid out to match Site Settings exactly — same page width, header, panel, and
// nested-under-the-row treatment — so the two places a book talk is configured
// read the same way.
export function ChallengeView({ siteSettings }) {
  const [bt, setBt] = useState({ onTitleCompletions: true, kind: 'comprehension' })
  const update = (patch) => setBt((b) => ({ ...b, ...patch }))
  const on = bt.onTitleCompletions

  return (
    <div className="cc-root bw-ccroot">
      <header className="cc-topbar">
        <div className="cc-topbar-left">
          <span className="cc-title">Spring Into Reading</span>
          <span className="cc-status">Draft</span>
        </div>
        <div className="cc-topbar-right">
          <Button variant="ghost" size="sm">
            Save &amp; exit
          </Button>
          <Button variant="primary" size="sm" accent="#0CA7BC">
            Publish
          </Button>
        </div>
      </header>

      <div className="cc-stepbar">
        <Stepper steps={PHASES} current="badges" accent="#0CA7BC" />
      </div>

      <div className="cc-main">
        <main className="cc-form">
          <div className="cc-form-inner">
            <div className="bw-page bw-page--instep">
              <header className="bw-page-head">
                <div>
                  <h1 className="bw-h1">Book Talks</h1>
                  <p className="bw-sub">
                    Activate Benny, our AI-powered teacher’s assistant, to engage students in a
                    conversation and help you cultivate a culture of reading.
                  </p>
                </div>
              </header>

              <SectionCard
                header="bar"
                title="When should Benny engage students in a Book Talk?"
                className="bw-panel"
              >
                <SettingList>
                  <SettingRow
                    label="On Title Completions"
                    sub="Benny starts a short conversation each time a student finishes a title in this challenge."
                    checked={on}
                    onChange={(v) => update({ onTitleCompletions: v })}
                    size="lg"
                  />

                  {/* Nested under the row it configures, the same as Site Settings. */}
                  {on && (
                    <div className="bw-subsetting">
                      <TalkKindPicker
                        label="What kind of conversation should Benny have?"
                        value={bt.kind}
                        onChange={(id) => update({ kind: id })}
                      />
                    </div>
                  )}
                </SettingList>

                {/* How this challenge interacts with the new site-wide default. */}
                {siteSettings?.onCompletion && (
                  <Banner level="info" className="bw-panel-banner">
                    Your site already starts{' '}
                    {article(TALK_KINDS[siteSettings.completionKind].label)}{' '}
                    <strong>{TALK_KINDS[siteSettings.completionKind].label.toLowerCase()}</strong>{' '}
                    on every completed book. This challenge takes priority over that default, so
                    switch it on here when this challenge needs a different conversation.
                  </Banner>
                )}
              </SectionCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
