import { Img, TextPill, SheetHeader } from '@mobile/components'
import './BadgeDetail.css'

/**
 * `src/components/badges/BadgeDetail.tsx` — a `presentation: 'modal'` screen, so it arrives as a
 * sheet over whatever opened it.
 *
 * The header is a tinted band the medallion punches up out of on `marginTop: -80`, the same idiom
 * as the fundraiser card. One colour paints THREE surfaces — `modalHeaderSafeAreaStyle`, the
 * iOS-only `topColorSpacer`, and `topColorFullHeight` — all fed the same
 * `Color('white').mix(Color(primaryColor), 0.2)`, which is 80% white. It is a wash, not the
 * accent: the header and the band are one continuous surface, and on a saturated tenant colour it
 * still reads as an off-white. See `--m-accent-wash`.
 *
 * Note the two nested circles: a 160pt WHITE disc that separates the medallion from the band, and
 * inside it a 145pt ring whose 5pt border is green once earned. The 120pt artwork sits in that.
 */

/** `Award` — one reward, ticket batch or certificate. The icon tint is per award type. */
function Award({ type, title, image, color, description }) {
  return (
    <div className="m-bd-award">
      <span className={`m-bd-award-icon m-bd-award-${color}`}>
        <Img name={image} size={24} />
      </span>
      <span className="m-bd-award-text">
        <span className="m-bd-award-type">{type}</span>
        <span className="m-bd-award-title">{title}</span>
        {description && <span className="m-bd-award-desc">{description}</span>}
      </span>
    </div>
  )
}

export function BadgeDetail({ badge, onClose }) {
  const earned = badge.earnedOn != null
  const awards = [
    ...(badge.rewards ?? []).map((r) => ({
      type: 'Reward',
      title: r.title,
      description: r.description,
      image: 'challengeStatsRewards',
      color: 'purple',
    })),
    ...(badge.tickets
      ? [
          {
            type: 'Tickets',
            title: `${badge.tickets} Ticket${badge.tickets !== 1 ? 's' : ''}`,
            image: 'challengeStatsTickets',
            color: 'yellow',
          },
        ]
      : []),
    ...(badge.certificates ?? []).map((c) => ({
      type: 'Certificate',
      title: c.title,
      image: 'challengeStatsCertificates',
      color: 'blue',
    })),
  ]

  return (
    <div className="m-bd">
      <div className="m-bd-scroll">
        <SheetHeader onClose={onClose} background="var(--m-accent-wash)" />

        <div className="m-bd-detail">
          <div className="m-bd-band" />

          <div className="m-bd-medallion">
            <div className={`m-bd-ring${earned ? ' is-earned' : ''}`}>
              <div
                className="m-bd-art"
                style={{ background: badge.art ?? 'var(--m-grey-light-1)' }}
              />
              {earned && (
                <span className="m-bd-check">
                  <Img name="badgeCheckmark" size={16} />
                </span>
              )}
            </div>
          </div>

          <div className="m-bd-text">
            <div className={awards.length ? 'm-bd-summary has-extras' : 'm-bd-summary'}>
              <p className="m-bd-title">{badge.title}</p>
              <h2 className="m-t-detail-page-title m-bd-name">{badge.name}</h2>
              {badge.challengeName && <p className="m-bd-challenge">{badge.challengeName}</p>}
              {badge.dateRange && <p className="m-bd-range">{badge.dateRange}</p>}
              {earned && <p className="m-bd-earned">Completed on {badge.completedOn}</p>}

              {badge.progressText && (
                <div className="m-bd-pills">
                  <TextPill
                    size="large"
                    tone={earned ? 'green' : 'grey'}
                    text={badge.progressText}
                  />
                  {badge.required && (
                    <div className="m-bd-required">
                      <TextPill size="large" tone="red" text="Required" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* awardsBlock — rules on BOTH edges, and it bleeds past the 20pt text gutter. */}
            {awards.length > 0 && (
              <div className="m-bd-awards">
                {awards.map((a) => (
                  <Award key={`${a.type}-${a.title}`} {...a} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
