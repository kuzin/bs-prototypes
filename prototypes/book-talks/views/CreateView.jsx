import { useState } from 'react'
import { Button } from '@components/Button/Button'
import { Hero } from '@components/Hero/Hero'
import { Stepper } from '@components/Stepper/Stepper'
import { SettingRow, SettingList } from '@components/SettingRow/SettingRow'
import { Banner, EmptyState } from '@components/Primitives/Primitives'
import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import { Icon } from '@components/Icon/Icon'
import { BadgeRow } from '../../challenge-creator/steps/StepStubs'
import { BadgeEditor } from '../components/BadgeEditor'

import '@components/Form/Form.css'
import '@components/Button/Button.css'
import '@components/Hero/Hero.css'
import '@components/SettingRow/SettingRow.css'
import '@components/BennyBubble/BennyBubble.css'
import '@components/Primitives/Primitives.css'
// Mirrors the Challenge Creator's Book Talks step — reuse its panel/badge/
// measure styles (.cc-panel / .cc-bt-measure / .cc-badgerow / .cc-badge-editor).
import '../../challenge-creator/index.css'

// Faux Challenge Creator wizard rail — this screen is the "Book Talks" step.
const WIZARD_STEPS = [
  { id: 'type', name: 'Type' },
  { id: 'details', name: 'Details' },
  { id: 'badges', name: 'Badges' },
  { id: 'booktalks', name: 'Book Talks' },
  { id: 'rewards', name: 'Rewards' },
  { id: 'completion', name: 'Completion' },
]

const metaOf = (b) => `Talk with Benny · ${b.minExchanges} exchanges`

// Teacher side — the Challenge Creator's Book Talks step, mirrored. Benny is
// turned on per trigger; the NEW "As an Activity Badge" trigger (the self-
// contained Book Talk badge) reveals the badge builder when enabled.
export function CreateView({ badges, onChange }) {
  // editor: null = closed · { index } where index is null when adding new.
  const [editor, setEditor] = useState(null)
  const [asActivityBadge, setAsActivityBadge] = useState(false)
  const [onTitleCompletions, setOnTitleCompletions] = useState(false)

  const save = (badge) => {
    if (editor?.index != null) {
      onChange(badges.map((b, i) => (i === editor.index ? badge : b)))
    } else {
      onChange([...badges, badge])
    }
    setEditor(null)
  }

  return (
    <section className="bt-create">
      <div className="bt-wizard-bar">
        <Stepper steps={WIZARD_STEPS} current="booktalks" accent="#14b8a6" />
      </div>

      <div className="bt-create-body">
        <div className="cc-step-head">
          <Hero
            title="Book Talks"
            subtitle="Activate Benny, our AI-powered teacher’s assistant, to engage students in a conversation and help you cultivate a culture of reading."
            accent="#14b8a6"
          />
        </div>

        <div className="cc-panel">
          <h3 className="cc-panel-title">When should Benny engage students in a Book Talk?</h3>
          <SettingList>
            <SettingRow
              label="As an Activity Badge"
              sub="Students earn a badge by completing a Book Talk with Benny — the chat is the activity, no logging required."
              state={asActivityBadge ? 'Enabled' : 'Disabled'}
              checked={asActivityBadge}
              onChange={setAsActivityBadge}
            />
            <SettingRow
              label="On Title Completions"
              sub="Benny starts a short conversation each time a student finishes a title."
              state={onTitleCompletions ? 'Enabled' : 'Disabled'}
              checked={onTitleCompletions}
              onChange={setOnTitleCompletions}
            />
          </SettingList>
          <Banner level="info" className="cc-panel-banner">
            Once a student completes a Book Talk, you can view the conversation and a breakdown on
            your{' '}
            <a href="#sessions-for-review" className="cc-link">
              Sessions for Review
            </a>{' '}
            page.
          </Banner>
        </div>

        {asActivityBadge && (
          <div className="cc-panel">
            <div className="cc-panel-head">
              <h3 className="cc-panel-title">Book Talk badges</h3>
              <div className="cc-panel-actions">
                <Button variant="secondary" size="sm" onClick={() => setEditor({ index: null })}>
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
                description="Add a badge students earn by chatting with Benny about their reading."
              />
            )}
          </div>
        )}

        <div className="cc-panel">
          <h3 className="cc-panel-title">What Benny helps measure</h3>
          <div className="cc-bt-measure">
            <h4>Engagement</h4>
            <p>
              We define engagement as reading the student likely reported accurately and where the
              student indicated a positive reading experience.
            </p>
            <BennyBubble>
              <p className="cc-bt-bubble-lead">I might ask questions like…</p>
              <ul>
                <li>Did you like or dislike the book? Why?</li>
                <li>Would you recommend this book to a friend? Why or why not?</li>
                <li>How did this story make you feel?</li>
              </ul>
            </BennyBubble>
          </div>
        </div>
      </div>

      <BadgeEditor
        open={!!editor}
        initial={editor?.index != null ? badges[editor.index] : null}
        onCancel={() => setEditor(null)}
        onSave={save}
      />
    </section>
  )
}
