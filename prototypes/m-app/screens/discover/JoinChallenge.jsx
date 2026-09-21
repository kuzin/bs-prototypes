import { Img, TextPill, PressableButton } from '@mobile/components'
import './JoinChallenge.css'

/**
 * `JoinChallengeModal` + `JoinChallengeHeader` + `JoinChallengeDetails` — what a challenge you
 * have NOT registered for opens.
 *
 * The fork is the whole point of this screen existing: tapping a card runs `if (isRegistered)
 * navigate('challengePage') else showModal('JoinChallenge')`. A challenge you are in opens its
 * detail with its tabs and progress; one you are not shows you what it is and asks. Finding a
 * challenge is not joining it, which is also why the code search lands here rather than inside.
 *
 * Three answers in the header, not two. Cancel leaves it where it was; Ignore moves it out of
 * the list entirely and into the Ignored filter, which is why it is a real action rather than a
 * dismissal. Ignore is hidden in two cases — when you are already looking AT the Ignored filter
 * (there is nowhere further to put it) and when you arrived from the code search (you went
 * looking for this one, so offering to hide it is absurd).
 *
 * `challengeColorSpacer` is the trick that gives the sheet its coloured top: a 550pt block with
 * `marginTop: -500`, so 50pt of colour shows and the rest is pulled up out of view. It scrolls
 * with the content, so pulling down reveals more colour instead of a white gap — the iOS
 * rubber-band behaviour, built out of one box rather than a bounce handler.
 */

/** `getChallengeDate` — an ongoing challenge says so; everything else leads with its END. */
function challengeDate(dates = '', past = false) {
  if (dates === 'Ongoing challenge') return dates
  const endIndex = dates.indexOf('-')
  const endDate = endIndex === -1 ? dates : dates.slice(endIndex + 2)
  return `${past ? 'Ended' : 'Ends'} ${endDate}`
}

export function JoinChallenge({
  challenge,
  filter = 'Current',
  fromCodeSearch = false,
  onJoin,
  onIgnore,
  onClose,
}) {
  if (!challenge) return null

  const past = challenge.state === 'past'
  const ongoing = challenge.dates === 'Ongoing challenge'
  const types = [
    ...(challenge.logTypes ?? []).map((t) => `${t[0].toUpperCase() + t.slice(1)}s`),
    ...(challenge.challengeTypes ?? []).filter((t) => t !== 'Logging'),
  ]

  return (
    <div className="m-jc">
      {/* `joinChallengeHeaderRow` — 60pt, and the three cells are 1 / 2 / 1 so the title lands
          on the true centre whether or not Ignore is there. */}
      <div className="m-jc-head">
        <div className="m-jc-head-cell m-jc-head-left">
          <button type="button" className="m-jc-text-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
        <div className="m-jc-head-cell m-jc-head-center">
          <span className="m-t-title-heavy m-jc-title">Join Challenge</span>
        </div>
        <div className="m-jc-head-cell m-jc-head-right">
          {filter !== 'Ignored' && !fromCodeSearch && (
            <button
              type="button"
              className="m-jc-text-btn"
              onClick={() => {
                onIgnore?.(challenge)
                onClose?.()
              }}
            >
              Ignore
            </button>
          )}
        </div>
      </div>

      <div className="m-jc-scroll">
        {/* 550 tall, pulled up 500 — 50pt of colour, and an overscroll reveals more of it. */}
        <div className="m-jc-spacer" style={{ background: challenge.bandColor }} />
        <Img
          name="headerCurveWhite"
          className="m-jc-curve"
          fit="fill"
          style={{ background: challenge.bandColor }}
        />

        <div className="m-jc-head-image">
          <div className="m-jc-banner">
            <span className="m-jc-banner-wrap">
              {challenge.banner ? (
                <span className="m-jc-banner-img" style={{ background: challenge.banner }} />
              ) : (
                <Img name="emptyChallengeImage" className="m-jc-banner-img" fit="cover" />
              )}
            </span>
          </div>

          <div className="m-jc-meta">
            <h1 className="m-jc-name">{challenge.name}</h1>
            <p className="m-jc-date">{challengeDate(challenge.dates, past)}</p>
            {types.length > 0 && (
              <div className="m-jc-types">
                {types.map((t) => (
                  <span key={t} className="m-jc-type">
                    <TextPill size="medium" text={t} />
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* A ruled section rather than another heading in the flow — the rule is what separates
            "what this is" from "what it says". */}
        <div className="m-jc-description">
          <h2 className="m-t-title-regular">Description</h2>
          <div
            className="m-jc-description-body"
            /* `RenderHtml` in the app. Local fixture HTML only — see ChallengeDetail. */
            dangerouslySetInnerHTML={{ __html: challenge.description ?? '' }}
          />
        </div>
      </div>

      {/* A past challenge has no Join button at all — the footer keeps its rule and its padding
          so the sheet does not change shape, it simply has nothing to offer. */}
      <div className="m-jc-foot">
        {(!past || ongoing) && (
          <PressableButton
            fullWidth
            buttonText="Join Challenge"
            onButtonPress={() => onJoin?.(challenge)}
          />
        )}
      </div>
    </div>
  )
}
