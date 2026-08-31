import { useState } from 'react'
import { Button } from '@components/Button/Button'
import { Stepper } from '@components/Stepper/Stepper'
import { Toggle } from '@components/Toggle/Toggle'
import { Pill } from '@components/Pill/Pill'
import { Banner, EmptyState } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import { BadgeRow } from '../../challenge-creator/steps/StepStubs'
import { StepHead } from '../../challenge-creator/steps/shared'
import { PICKER_BADGES } from '../../challenge-creator/data'
import { BadgeEditor } from '../components/BadgeEditor'

import '@components/Form/Form.css'
import '@components/Button/Button.css'
import '@components/Toggle/Toggle.css'
import '@components/Pill/Pill.css'
import '@components/Primitives/Primitives.css'
// The real Challenge Creator chrome — topbar, step rail, form column, footer.
// `.cc-root` also scopes CC's design tokens, so the reused `cc-*` markup below
// picks them up instead of needing them re-declared.
import '../../challenge-creator/index.css'

// The creator's steps. No Book Talks step any more — when Benny talks is a
// site-wide setting now, so the only challenge-level decision left is a badge,
// which belongs on this step.
const WIZARD_STEPS = [
  { id: 'type', name: 'Type' },
  { id: 'details', name: 'Details' },
  { id: 'badges', name: 'Badges' },
  { id: 'rewards', name: 'Rewards' },
  { id: 'completion', name: 'Completion' },
]

// Badges the challenge already has, so this reads like the real Badges step
// rather than an empty screen with one new panel on it.
const art = (name) => PICKER_BADGES.find((b) => b.name === name)?.img
const LOGGING_BADGES = [
  { name: 'First Book', img: art('Open Book') ?? PICKER_BADGES[0]?.img, meta: 'Log 1 book' },
  { name: 'Five Books', img: art('Trophy') ?? PICKER_BADGES[1]?.img, meta: 'Log 5 books' },
  { name: '500 Minutes', img: art('Star') ?? PICKER_BADGES[2]?.img, meta: 'Log 500 minutes' },
]

const metaOf = (b) => `${b.talks} Book ${b.talks === 1 ? 'Talk' : 'Talks'} with Benny`

// Teacher side — the Challenge Creator's Badges step, in the creator's own
// chrome, with Book Talk badges as a new earnable badge type.
//
// The type depends on the site-wide "whenever a student wants" switch: these
// badges are earned by the conversations readers start themselves, so with that
// switch off there's nothing for a badge to count. `siteSelfStart` carries it
// here and locks the row.
export function CreateView({ badges, onChange, bookTalkOn, onBookTalkOn, siteSelfStart = true }) {
  // editor: null = closed · { index } where index is null when adding new.
  const [editor, setEditor] = useState(null)
  const [activitiesOn, setActivitiesOn] = useState(false)
  const on = siteSelfStart && bookTalkOn

  const save = (badge) => {
    if (editor?.index != null) {
      onChange(badges.map((b, i) => (i === editor.index ? badge : b)))
    } else {
      onChange([...badges, badge])
    }
    setEditor(null)
  }

  return (
    <div className="cc-root bt-create">
      <header className="cc-topbar">
        <div className="cc-topbar-left">
          <span className="cc-exit" title="Back">
            ←
          </span>
          <span className="cc-title">Summer Reading Challenge</span>
          <span className="cc-status">Draft</span>
        </div>
        <div className="cc-topbar-right">
          <Button variant="ghost" size="sm">
            Save &amp; exit
          </Button>
          <Button variant="primary" size="sm" accent="#0DA7BC">
            Publish
          </Button>
        </div>
      </header>

      <div className="cc-stepbar">
        <Stepper steps={WIZARD_STEPS} current="badges" accent="#0DA7BC" />
      </div>

      <div className="cc-main">
        <main className="cc-form">
          <div className="cc-form-inner">
            {/* `.cc-step` is what caps a creator step at its 760px column. */}
            <section className="cc-step">
              <StepHead
                title="Badges & activities"
                sub="Choose how readers earn, then add the badges they’ll collect."
              />

              <div className="cc-panel">
                <h3 className="cc-panel-title">Earnable badge types</h3>
                <div className="cc-settings">
                  <div className="cc-setting-row is-disabled">
                    <span className="cc-setting-label">Logging badges</span>
                    <div className="cc-type-state">
                      <span className="cc-reg-state">Required</span>
                      <Toggle checked size="md" disabled />
                    </div>
                  </div>
                  <div className="cc-setting-row">
                    <span className="cc-setting-label">Activity badges</span>
                    <div className="cc-type-state">
                      <Toggle checked={activitiesOn} size="md" onChange={setActivitiesOn} />
                    </div>
                  </div>
                  {/* NEW — badges earned by talking to Benny. */}
                  <div className="cc-setting-row">
                    <span className="cc-setting-label">
                      Book Talk badges
                      <Pill color="#0E7490" variant="filled" size="sm">
                        New
                      </Pill>
                    </span>
                    <div className="cc-type-state">
                      <Toggle
                        checked={on}
                        size="md"
                        disabled={!siteSelfStart}
                        onChange={onBookTalkOn}
                      />
                    </div>
                  </div>
                </div>
                {!siteSelfStart && (
                  <Banner level="warning" className="cc-panel-banner">
                    Book Talk badges need students to be able to start a talk themselves. Switch on{' '}
                    <strong>Whenever a student wants</strong> under{' '}
                    <a href="#setup-book-talks" className="cc-link">
                      Setup › Book Talks with Benny
                    </a>{' '}
                    to use them here.
                  </Banner>
                )}
              </div>

              <div className="cc-panel">
                <div className="cc-panel-head">
                  <h3 className="cc-panel-title">Logging badges</h3>
                  <div className="cc-panel-actions">
                    <Button variant="secondary" size="sm">
                      + Add badge
                    </Button>
                  </div>
                </div>
                <div className="cc-badge-rows">
                  {LOGGING_BADGES.map((b) => (
                    <BadgeRow key={b.name} img={b.img} title={b.name} meta={b.meta} />
                  ))}
                </div>
              </div>

              {on && (
                <div className="cc-panel">
                  <div className="cc-panel-head">
                    <h3 className="cc-panel-title">Book Talk badges</h3>
                    <div className="cc-panel-actions">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditor({ index: null })}
                      >
                        + Add badge
                      </Button>
                    </div>
                  </div>
                  {badges.length > 0 ? (
                    <div className="cc-badge-rows">
                      {badges.map((b, i) => (
                        <BadgeRow
                          key={i}
                          img={b.img}
                          title={b.name}
                          meta={metaOf(b)}
                          onEdit={() => setEditor({ index: i })}
                          onRemove={() => onChange(badges.filter((_, idx) => idx !== i))}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<Icon name="message-chatbot" size={26} />}
                      title="No Book Talk badges yet"
                      description="Add a badge readers earn by having Book Talks with Benny about their reading."
                    />
                  )}
                  <Banner level="info" className="cc-panel-banner">
                    Readers earn these by starting a Book Talk themselves — from anywhere on the
                    site. Every completed talk lands on your{' '}
                    <a href="#sessions-for-review" className="cc-link">
                      Sessions for Review
                    </a>{' '}
                    page with Benny’s breakdown.
                  </Banner>
                </div>
              )}
            </section>
          </div>

          {/* The creator's own footer — inert here; this prototype is one step. */}
          <div className="cc-form-footer">
            <Button variant="secondary">Back</Button>
            <div className="cc-footer-right">
              <Button variant="primary" accent="#0DA7BC">
                Next: Rewards
              </Button>
            </div>
          </div>
        </main>
      </div>

      <BadgeEditor
        open={!!editor}
        initial={editor?.index != null ? badges[editor.index] : null}
        onCancel={() => setEditor(null)}
        onSave={save}
      />
    </div>
  )
}
