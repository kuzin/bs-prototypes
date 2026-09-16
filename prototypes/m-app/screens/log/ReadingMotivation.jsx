import { Img, PressableButton, StarIcon, Carousel, FilterBar } from '@mobile/components'
import './ReadingMotivation.css'

/**
 * `src/screens/logScreens/readingMotivation/ReadingMotivation.tsx` — the RMI tab.
 *
 * It has TWO states, decided by the selected survey's response:
 *   no response, or `status === 'in_progress'`  → the filter bar + `AnswerSurvey`
 *   `status === 'scored'`                        → filter bar + MotivationTypes + ReadingGoals
 *                                                  + Recommendations
 *
 * The scroll content carries `gap: 32` and `paddingBottom: 32`, which is the only spacing between
 * those sections — none of them has a top margin of its own.
 *
 * The three gutters differ per section and that is not a mistake: the filter bar is full-bleed,
 * MotivationTypes pads only its TITLE by 20 (its carousel is full-bleed so pages can be
 * screen-wide), ReadingGoals uses `marginHorizontal: 20` and Recommendations `paddingHorizontal`.
 */

/** PersonaCard — one of the reader's top three motivation types. */
function PersonaCard({ persona }) {
  return (
    <div className="m-rmi-persona" style={{ background: persona.backgroundColor }}>
      <Img name={persona.imageKey} width={127} height={127} />
      <div className="m-rmi-persona-text">
        <p className="m-t-title-regular">{persona.title}</p>
        <p className="m-t-body-description m-rmi-persona-desc">{persona.description}</p>
      </div>
    </div>
  )
}

/**
 * `AutoHeightCarousel` in the source — full-screen-width pages on
 * `react-native-reanimated-carousel`, with no treatment on the neighbours at all.
 *
 * DIVERGENCE — on the shared `Carousel`, which is the Streaks one: the card peeks its neighbours
 * and scales them back. Two carousels a tab apart paging differently was a consequence of picking
 * two libraries, not a decision, and the peeking version is the one that says there is another
 * card to see.
 *
 * (The RN version also measures every page offscreen and locks the carousel to the TALLEST so the
 * height never jumps. The shared component gets that for free — the slides sit side by side rather
 * than stacked, so the track is already as tall as the tallest one.)
 */
function PersonaCarousel({ personas }) {
  return (
    <Carousel
      items={personas}
      keyFor={(p) => p.title}
      label="Your top motivation types"
      renderItem={(p) => <PersonaCard persona={p} />}
    />
  )
}

export function ReadingMotivation({ survey, onOpenSurveyPicker }) {
  const scored = survey.response?.status === 'scored'

  return (
    <div className="m-rmi">
      <div className="m-rmi-scroll">
        <FilterBar label={survey.name} onPress={onOpenSurveyPicker} />

        {!scored ? (
          /* AnswerSurvey — `flex: 1` so it centres in whatever height is left. */
          <div className="m-rmi-answer">
            <div className="m-rmi-answer-text">
              <p className="m-t-item-title">What motivates you?</p>
              <p className="m-t-sub-heading m-rmi-answer-desc">
                Answer questions to discover your reading motivators.
              </p>
            </div>
            <PressableButton
              fullWidth
              buttonText={
                survey.response?.status === 'in_progress' ? 'Continue' : 'Answer Questions'
              }
              onButtonPress={() => {}}
            />
          </div>
        ) : (
          <>
            <div className="m-rmi-types">
              <h2 className="m-section-head m-rmi-types-title">Your Top 3 Motivation Types</h2>
              <PersonaCarousel personas={survey.response.personas} />
            </div>

            <div className="m-rmi-goals">
              <h2 className="m-section-head">Reading Goals</h2>
              <div className="m-rmi-goals-card">
                <div className="m-rmi-goals-avatar">
                  <Img name="bennySuperReader" className="m-rmi-goals-benny" />
                </div>
                <p className="m-rmi-goals-number">{survey.response.recommendedReadingGoal}</p>
                <p className="m-t-item-title m-rmi-goals-unit">Minutes Daily</p>
              </div>
            </div>

            <div className="m-rmi-recs">
              <h2 className="m-section-head">Recommendations</h2>
              <div className="m-rmi-recs-list">
                {survey.response.recommendations.map((r) => (
                  <div key={r.id} className="m-rmi-rec">
                    <StarIcon />
                    <p className="m-t-body-description m-rmi-rec-text">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
