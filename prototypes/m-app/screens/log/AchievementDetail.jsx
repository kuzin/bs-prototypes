import { Img, TextPill, SheetHeader } from '@mobile/components'
import './AchievementDetail.css'

/**
 * `src/achievements/screens/AchievementDetail` + `components/AchievementDetailFullHeight` — the
 * `achievementDetail` modal, a sibling of `homeStack` in HomeModalNavigator, so it arrives as a
 * sheet over the whole navigator.
 *
 * It shares the badge sheet's header idiom — 60pt tall, `marginBottom: -1`, a `dropdown_arrow`
 * dismiss, and the same `Color('white').mix(Color(color), 0.2)` wash on both the header and the
 * band. Two things differ, and both are easy to miss:
 *
 *   1. The header sits OUTSIDE the ScrollView here (a sibling of it), so it is fixed — it does not
 *      scroll away the way the badge sheet's does.
 *   2. There is NO ring and NO earned check. An achievement is a plain white disc holding the
 *      artwork: 136pt at `marginTop: -68` over a 76pt band, against the badge sheet's 160/-80 over
 *      84 with a 145pt ring inside it. Different numbers, same idiom.
 *
 * Body is name · an optional badge-name pill · a squiggle rule · description. The pill takes
 * `TextPill`'s DEFAULT colour, which in the app is green, not grey.
 */
export function AchievementDetail({ achievement, onClose }) {
  return (
    <div className="m-ad">
      {/* A sibling of the scroll view, not a child — this header is fixed. */}
      <SheetHeader onClose={onClose} background="var(--m-accent-wash)" className="m-ad-header" />

      <div className="m-ad-scroll">
        <div className="m-ad-detail">
          <div className="m-ad-band" />

          <div className="m-ad-medallion">
            <div
              className="m-ad-art"
              style={{ background: achievement.art ?? 'var(--m-grey-light-1)' }}
            />
          </div>

          <div className="m-ad-content">
            <h2 className="m-t-detail-page-title m-ad-name">{achievement.name}</h2>
            {achievement.badgeName && <TextPill size="large" text={achievement.badgeName} />}
            <Img name="squiggle" className="m-ad-squiggle" />
            <p className="m-t-body-regular m-ad-desc">{achievement.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
