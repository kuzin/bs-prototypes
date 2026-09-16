import { Img, PressableButton } from '@mobile/components'
import './MotivatorSurveyCard.css'

/**
 * `src/components/MotivatorSurveyCard.tsx` — the RMI (Reading Motivation Index) prompt.
 *
 * Gated on `rmi_enabled` for the microsite, and hidden once the survey is done. The button reads
 * "Continue" when a survey is part-finished and "Let's Go" otherwise.
 *
 * Its gutter is 16, not the page's 20 — one of several places the app's spacing is inconsistent,
 * and kept because it is visible against the cards above and below it.
 */
export function MotivatorSurveyCard({ isInProgress = false, onPress }) {
  return (
    <section className="m-msc">
      <div className="m-msc-character">
        {/* `fit="cover"`, set HERE rather than in CSS: Img writes `objectFit` as an inline style
            from this prop, so a stylesheet rule for it never wins. At the default `contain` the
            artwork letterboxes and the card's white shows above it. */}
        <Img name="motivatorCharacterImage" alt="Motivator character illustration" fit="cover" />
      </div>
      <div className="m-msc-text">
        <p className="m-card-title m-msc-title">What&apos;s your motivation type?</p>
        <p className="m-card-sub m-msc-subtitle">Find out what keeps you reading.</p>
      </div>
      {/* On the shared PressableButton, with the other three card CTAs on Home — the hand-rolled
          one was the same height but a 16pt label against their 14. */}
      <PressableButton
        size="medium"
        fullWidth
        buttonText={isInProgress ? 'Continue' : 'Let’s Go'}
        onButtonPress={onPress}
      />
    </section>
  )
}
