import { useEffect, useRef, useState } from 'react'
import './Carousel.css'

/**
 * One swipeable, LOOPING carousel, used by Streaks and Reading Motivation.
 *
 * The app has TWO, on different libraries: Streaks is `react-native-snap-carousel` at
 * `windowWidth - 64` with the library's default `inactiveSlideScale: 0.9` /
 * `inactiveSlideOpacity: 0.7`, and Reading Motivation is `react-native-reanimated-carousel` at the
 * full screen width with no neighbour treatment at all.
 *
 * DIVERGENCE — both use the Streaks treatment here, and both LOOP. Two carousels a tab apart that
 * page differently is a consequence of picking two libraries, not a decision; and the peeking
 * version is the one that tells you there is another card. Looping is the same argument taken one
 * step: a peek that shows blank at either end advertises an edge, and with five or six cards the
 * edge is the least interesting thing about the set.
 *
 * `peek` is where the spacing comes from and it is not a gap: a 0.9-scaled card leaves ~16pt
 * either side of itself, so neighbours read as SET BACK rather than butted against the active one.
 * Remove the scale and the cards touch.
 *
 * HOW THE LOOP WORKS. The strip is rendered THREE times and the carousel starts in the middle
 * copy, so there is always a real slide to either side — no clone appears at an edge, because
 * there is no edge in view. The index moves freely; once a transition finishes outside the middle
 * copy it is snapped back by one copy's width with the transition switched off, which is invisible
 * because the slide under the viewport is identical. Everything user-facing (the dots, the active
 * slide) reads `index % count`, so the extra copies never leak out of here.
 */
const SNAP_FRACTION = 0.25
const COPIES = 3

export function Carousel({ items, renderItem, keyFor, peek = 32, label = 'Carousel' }) {
  const count = items.length
  const loops = count > 1

  // Start in the middle copy, so there is a full strip available in both directions.
  const [index, setIndex] = useState(loops ? count : 0)
  const [drag, setDrag] = useState(0)
  const [snapping, setSnapping] = useState(false)
  const start = useRef(null)
  const frame = useRef(null)
  // Held in a ref as well as state: a flick can land pointermove and pointerup in the same task,
  // and the state value in that closure is then still the previous render's.
  const offset = useRef(0)

  const active = loops ? ((index % count) + count) % count : index

  // Re-centre after the slide settles. Only ever a whole copy, so nothing moves on screen.
  useEffect(() => {
    if (!loops || snapping) return
    if (index >= count && index < count * 2) return
    const t = setTimeout(() => {
      setSnapping(true)
      setIndex((i) => (i < count ? i + count : i - count))
    }, 330)
    return () => clearTimeout(t)
  }, [index, count, loops, snapping])

  // Clear the no-transition flag one frame after the jump, so the next swipe animates again.
  useEffect(() => {
    if (!snapping) return
    const raf = requestAnimationFrame(() => setSnapping(false))
    return () => cancelAnimationFrame(raf)
  }, [snapping])

  const onPointerDown = (e) => {
    start.current = e.clientX
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (start.current == null) return
    const dx = e.clientX - start.current
    // With no ends there is nothing to rubber-band against; a non-looping set still resists.
    const atEdge = !loops && ((index === 0 && dx > 0) || (index === count - 1 && dx < 0))
    offset.current = atEdge ? dx * 0.35 : dx
    setDrag(offset.current)
  }

  const endDrag = () => {
    if (start.current == null) return
    start.current = null
    const width = frame.current?.clientWidth ?? 1
    const moved = offset.current
    offset.current = 0
    const clamp = (i) => (loops ? i : Math.max(0, Math.min(count - 1, i)))
    if (moved <= -width * SNAP_FRACTION) setIndex((i) => clamp(i + 1))
    else if (moved >= width * SNAP_FRACTION) setIndex((i) => clamp(i - 1))
    setDrag(0)
  }

  // Clicking a dot goes to the NEAREST copy of that card, so it never rewinds the whole strip.
  const goTo = (target) => {
    if (!loops) return setIndex(target)
    const base = Math.floor(index / count) * count
    const options = [base + target, base + target - count, base + target + count]
    setIndex(options.reduce((a, b) => (Math.abs(b - index) < Math.abs(a - index) ? b : a)))
  }

  const slides = loops ? Array.from({ length: COPIES }, () => items).flat() : items
  const still = start.current != null || snapping

  return (
    <div className="m-car" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={frame}
        className="m-car-frame"
        style={{ paddingInline: peek }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className={`m-car-track${still ? ' is-still' : ''}`}
          style={{ transform: `translateX(calc(${index * -100}% + ${drag}px))` }}
        >
          {slides.map((item, i) => (
            <div
              key={`${keyFor ? keyFor(item, i % count) : i % count}-${Math.floor(i / count)}`}
              className={`m-car-slide${i === index ? ' is-active' : ''}`}
              aria-hidden={i !== index}
            >
              {renderItem(item, i % count)}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination — one dot per real card, never one per rendered slide. */}
      <div className="m-car-dots">
        {items.map((item, i) => (
          <button
            key={keyFor ? keyFor(item, i) : i}
            type="button"
            className={`m-car-dot${i === active ? ' is-active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Card ${i + 1} of ${count}`}
            aria-current={i === active}
          />
        ))}
      </div>
    </div>
  )
}
