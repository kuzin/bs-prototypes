import { useState } from 'react'
import { Banner } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import { Pill } from '@components/Pill/Pill'
import { SettingRow, SettingList } from '@components/SettingRow/SettingRow'
import { FocusPicker } from '../components/FocusPicker'
import { TALK_KINDS, COMPLETION_KINDS } from '../data'

// The challenge-level Book Talks step.
//
// The Challenge Creator's existing "Book Talks" step, extended with the two
// settings a comprehension talk needs: the talk type, and — once it's
// comprehension — the Conversation Focus. Today the step only offers engagement
// talks on title completions, which is why comprehension needs a home here as
// well as in Site Settings: a 5th-grade novel study wants a different focus than
// the site-wide default.
//
// Laid out to match Site Settings exactly — same page width, header, panel, and
// nested-under-the-row treatment — so the two places a book talk is configured
// read the same way.
export function ChallengeView({ siteSettings }) {
  const [bt, setBt] = useState({
    onTitleCompletions: true,
    kind: 'comprehension',
    focus: 'character',
  })
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
                <h3 className="bw-subsetting-title">
                  What kind of conversation should Benny have?
                </h3>
                <div className="bw-kind-cards" role="radiogroup" aria-label="Conversation type">
                  {COMPLETION_KINDS.map((k) => {
                    const active = bt.kind === k.id
                    return (
                      <button
                        key={k.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        className={`bw-kind-card${active ? ' is-active' : ''}`}
                        style={{ '--kind': k.color }}
                        onClick={() => update({ kind: k.id })}
                      >
                        <span className="bw-kind-head">
                          <span className="bw-kind-label">{k.label}</span>
                          {k.isNew && (
                            <Pill color={k.color} variant="filled" size="sm">
                              New
                            </Pill>
                          )}
                          {active && (
                            <Icon name="check" size={14} stroke={2.6} className="bw-kind-check" />
                          )}
                        </span>
                        <span className="bw-kind-blurb">{k.blurb}</span>
                      </button>
                    )
                  })}
                </div>

                {/* A comprehension talk needs a focus; an engagement talk doesn't. */}
                {bt.kind === 'comprehension' && (
                  <div className="bw-focus-block">
                    <h3 className="bw-subsetting-title">
                      What should Benny focus the conversation on?
                    </h3>
                    <FocusPicker value={bt.focus} onChange={(id) => update({ focus: id })} />
                  </div>
                )}
              </div>
            )}
          </SettingList>

          {/* How this challenge interacts with the new site-wide default. */}
          {siteSettings?.onCompletion && (
            <Banner level="info" className="bw-panel-banner">
              Your site already starts {siteSettings.completionKind === 'engagement' ? 'an' : 'a'}{' '}
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
