import { useState } from 'react'
import { Banner } from '@components/Primitives/Primitives'
import { SettingRow, SettingList } from '@components/SettingRow/SettingRow'
import { TalkKindPicker } from '../components/TalkKindPicker'
import { TALK_KINDS, article } from '../data'

// The challenge-level Book Talks step.
//
// The Challenge Creator's existing "Book Talks" step, extended with the setting
// the other two talk types need: which kind of conversation Benny should have.
// Today the step only offers engagement talks on title completions, which is why
// the choice needs a home here as well as in Site Settings — a 5th-grade novel
// study wants a different conversation than the site-wide default.
//
// Laid out to match Site Settings exactly — same page width, header, panel, and
// nested-under-the-row treatment — so the two places a book talk is configured
// read the same way.
export function ChallengeView({ siteSettings }) {
  const [bt, setBt] = useState({ onTitleCompletions: true, kind: 'comprehension' })
  const update = (patch) => setBt((b) => ({ ...b, ...patch }))
  const on = bt.onTitleCompletions

  return (
    <div className="bw-scroll">
      <div className="bw-page">
        <header className="bw-page-head">
          <div>
            <h1 className="bw-h1">Book Talks</h1>
            <p className="bw-sub">
              Activate Benny, our AI-powered teacher’s assistant, to engage students in a
              conversation and help you cultivate a culture of reading.
            </p>
          </div>
        </header>

        <section className="bw-panel">
          <h2 className="bw-panel-title">When should Benny engage students in a Book Talk?</h2>

          <SettingList>
            <SettingRow
              label="On Title Completions"
              sub="Benny starts a short conversation each time a student finishes a title in this challenge."
              state={on ? 'Enabled' : 'Disabled'}
              checked={on}
              onChange={(v) => update({ onTitleCompletions: v })}
            />

            {/* Nested under the row it configures, the same as Site Settings. */}
            {on && (
              <div className="bw-subsetting bw-subsetting--nested">
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
              Your site already starts {article(TALK_KINDS[siteSettings.completionKind].label)}{' '}
              <strong>{TALK_KINDS[siteSettings.completionKind].label.toLowerCase()}</strong> on
              every completed book. This challenge takes priority over that default, so switch it on
              here when this challenge needs a different conversation.
            </Banner>
          )}
        </section>
      </div>
    </div>
  )
}
