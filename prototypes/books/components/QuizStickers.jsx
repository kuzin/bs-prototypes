import { QUIZ_STICKERS, colorIcon } from '../quiz'
import './QuizStickers.css'

/**
 * A few of the Book Quiz's own pictures, stuck on at angles like stickers on a
 * folder — the quiz's calling card. Discover's quiz banner carries a small row
 * of them, and the quiz opens on the same row at full size, so the screen a
 * reader lands on is plainly the thing they tapped.
 *
 * <QuizStickers />                 // 40px, for a bar
 * <QuizStickers size="lg" pop />   // 76px, each popping in on arrival
 */
export function QuizStickers({ size = 'sm', pop = false, className = '' }) {
  return (
    <span
      className={`bkst bkst--${size}${pop ? ' bkst--pop' : ''} ${className}`.trim()}
      aria-hidden="true"
    >
      {QUIZ_STICKERS.map((name) => (
        <img key={name} src={colorIcon(name)} alt="" />
      ))}
    </span>
  )
}
