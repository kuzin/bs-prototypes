import { Img } from '../Img/Img'
import './StreakPill.css'

/**
 * `WeekdayStyles.streakContainer` — the flame and its count in an orange pill.
 *
 * The app has TWO streak treatments and they do not agree. The Reading Log's day column uses
 * this pill: `orangeLight` ground, `orangeDark` ink, the flame at 16. The friends list uses bare
 * `StreakFire` art beside a red bold number with no ground at all. Same fact, twice, in two
 * colours — and the bare one loses against a row that already has an avatar and a name competing
 * for attention.
 *
 * So the pill is the one, promoted here because two screens draw it. A streak is a badge you
 * have earned rather than a statistic, and a ground is what says so.
 *
 * Renders nothing when there is no streak. The source distinguishes null from 0 and draws
 * neither — a reader with no streak has no pill, not a pill saying zero.
 */
export function StreakPill({ streak, className = '' }) {
  if (streak == null || streak <= 0) return null

  return (
    <span className={`m-streakpill ${className}`.trim()}>
      <Img name="flame" size={16} />
      <span className="m-streakpill-num">{streak}</span>
    </span>
  )
}
