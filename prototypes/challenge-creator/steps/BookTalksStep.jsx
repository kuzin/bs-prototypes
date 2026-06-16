import { Banner } from '@components/Primitives/Primitives'
import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import { SettingRow } from '@components/SettingRow/SettingRow'
import { StepHead } from './shared'

// Book Talks step — opt into Benny (AI reading conversations) for logging
// challenges at schools. Uses the same shell as the other steps: a <StepHead>
// page header over <div className="cc-panel"> cards, with Benny's sample
// questions shown in a shared <BennyBubble> (the same way he appears in
// Sessions for Review).
export function BookTalksStep({ challenge, update }) {
  const bt = challenge.bookTalks || {}
  const on = !!bt.onTitleCompletions
  return (
    <section className="cc-step">
      <StepHead
        title="Book Talks"
        sub="Activate Benny, our AI-powered teacher’s assistant, to engage students in a conversation and help you cultivate a culture of reading."
      />

      <div className="cc-panel">
        <h3 className="cc-panel-title">When should Benny engage students in a Book Talk?</h3>
        <div className="cc-settings">
          <SettingRow
            label="On Title Completions"
            sub="Benny starts a short conversation each time a student finishes a title."
            state={on ? 'Enabled' : 'Disabled'}
            checked={on}
            onChange={(v) => update({ bookTalks: { ...bt, onTitleCompletions: v } })}
          />
        </div>
        <Banner level="info" className="cc-panel-banner">
          Once a student completes a Book Talk, you can view the analysis on your Sessions for
          Review page.{' '}
          <a href="#book-talks-learn-more" className="cc-link">
            Learn more.
          </a>
        </Banner>
      </div>

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
    </section>
  )
}
