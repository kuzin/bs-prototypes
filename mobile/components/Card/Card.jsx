import './Card.css'

/**
 * The app has exactly two card recipes and they do not blend:
 *
 *  - `shadow` — white, radius 16, padding 24, a soft drop shadow. DailyGoalBanner, MyStats.
 *  - `border` — radius 12–18, a 1–2px greyLight border, no shadow. WrapUpCard, ChallengeCard.
 *
 * ChallengeOverviewCard nests one inside the other, which is why both need to exist as variants
 * rather than one card with a `hasShadow` flag.
 */
export function Card({ variant = 'shadow', gutter = true, className = '', children, ...rest }) {
  return (
    <section
      className={`m-card m-card-${variant}${gutter ? ' has-gutter' : ''} ${className}`}
      {...rest}
    >
      {children}
    </section>
  )
}
