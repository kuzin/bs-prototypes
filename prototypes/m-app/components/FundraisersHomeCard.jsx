import { Img, PressableButton } from '@mobile/components'
import './FundraisersHomeCard.css'

/**
 * `src/fundraisers/components/homeCard/` — HomeCardHeader + MoneyRaised inside one card.
 *
 * The header is the app's signature shape: a coloured band with a white curve image stretched
 * across its bottom, and the fundraiser's banner punching up out of it on a `marginTop: -80`.
 * Its gutter is 24, wider than anything else on the screen.
 *
 * With a goal it shows a progress bar and a percentage; with none it collapses to a centred
 * total, which is the `noGoal` branch.
 */
export function FundraisersHomeCard({
  fundraiserName,
  endDate,
  // Accepted and unused — the band no longer paints it (see below).
  headerColor: _headerColor,
  banner,
  donationsTotal,
  goalAmount,
  percentCompleted,
  buttonText = 'Donate',
  onButtonPress,
}) {
  const ratio = goalAmount > 0 ? Math.min(1, donationsTotal / goalAmount) : 0

  return (
    <section className="m-fund">
      <div className="m-fund-header">
        {/* DIVERGENCE — no `headerCurveWhite`.
            The band closes with a white curve stretched across its base, which the banner then
            punches up through — so the card's top is a wave, a gradient rectangle and a colour
            band overlapping in three layers. A straight edge lets the banner be the only thing
            doing anything up there. */}
        {/* No fill. `headerColor` paints this band the microsite's colour, which put a slab of
            tenant teal behind a banner that is already the fundraiser's own artwork — two
            unrelated colour fields stacked in 110pt. The band stays as the spacer the banner's
            -80 margin needs; `headerColor` is still in the API. */}
        <div className="m-fund-band" />
        <div className="m-fund-banner">
          <span style={{ background: banner }} />
        </div>
        <div className="m-fund-desc">
          <h3 className="m-card-title m-fund-title">{fundraiserName}</h3>
          <p className="m-card-sub m-fund-sub">Ends on {endDate}</p>
        </div>
      </div>

      <div className="m-fund-content">
        <div className="m-fund-money">
          {goalAmount ? (
            <>
              <p className="m-fund-amount">
                ${donationsTotal.toLocaleString()}
                <span className="m-fund-goal"> of ${goalAmount.toLocaleString()}</span>
              </p>
              <div className="m-fund-slider">
                {/* ProgressBar.tsx — a bar that ends in a circle with a centre dot. */}
                <div className="m-fund-track">
                  <div className="m-fund-fill" style={{ width: `${ratio * 100}%` }}>
                    <span className="m-fund-knob" />
                  </div>
                </div>
                <div className="m-fund-pct">
                  <span className="m-fund-pct-text">{percentCompleted}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="m-fund-nogoal">
              <p className="m-fund-amount">${donationsTotal.toLocaleString()}</p>
              <p className="m-t-body-regular m-fund-details">Total Raised</p>
            </div>
          )}
        </div>

        <PressableButton
          size="medium"
          buttonText={buttonText}
          onButtonPress={onButtonPress}
          fullWidth
        />
      </div>
    </section>
  )
}
