import { Img } from '@mobile/components'
import './Achievements.css'

/**
 * `src/achievements/components/Achievements` on the Log tab — a three-column `FlatList` of
 * `Achievement`, which is EARNED-ONLY (`useEarnedAchievements(profileId)`), the same shape as
 * Badges on this tab.
 *
 * An achievement tile is a Pressable wrapping ONE `<Image>` and nothing else. No name, no earned
 * date, no caption — the name only ever appears in the `achievementDetail` modal and in the
 * accessibility label. This is the same anatomy as the Home badge strip, and the same place an
 * invented caption would go unnoticed.
 *
 * The disc is sized off the SCREEN, not its container: `(width - 72) / 3`, where the source
 * accounts for the 72 as "40 for side margins + 32 total in-between columns" — in practice it is
 * the column wrapper's 12pt each side plus each image's own 8pt each side. At 393 that is 107pt.
 *
 * Fill follows `earnedOn`: the tenant `primaryColor` when earned, greyLight1 when not. Since this
 * route only ever holds earned achievements, that is the accent in practice — but the fallback is
 * real and is why `Achievement` takes both.
 */
export function Achievements({ achievements, onOpenAchievement }) {
  if (achievements.length === 0) {
    return (
      <div className="m-ach-empty">
        <Img name="streaksCat" className="m-ach-empty-cat" />
        <p className="m-ach-empty-title">No Achievements Earned</p>
        <p className="m-ach-empty-sub">You haven’t earned any achievements yet.</p>
      </div>
    )
  }

  return (
    <div className="m-ach-list">
      {achievements.map((a) => (
        <button
          key={a.id}
          type="button"
          className="m-ach"
          onClick={() => onOpenAchievement?.(a)}
          aria-label={`View details for ${a.name}`}
        >
          <span
            className="m-ach-art"
            style={{
              background: a.earnedOn ? (a.art ?? 'var(--m-accent)') : 'var(--m-grey-light-1)',
            }}
          />
        </button>
      ))}
    </div>
  )
}
