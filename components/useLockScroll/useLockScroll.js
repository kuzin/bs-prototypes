import { useEffect } from 'react'

/* How many surfaces currently want the page still. A full-screen flow can open
   another over itself — the logging flow opens the Epic import — and each one
   locks on the way in and unlocks on the way out. Without the count the inner
   one's unlock would hand the page back while the outer one is still up. */
let locks = 0
let restore = null

/**
 * Hold the page still while a full-screen surface is open.
 *
 * A surface that covers the window is usually `position: fixed`, which takes it
 * out of the page's flow but leaves the page itself scrollable underneath. You
 * then get two scrollbars — the surface's own and the page's — and a wheel over
 * the wrong part scrolls a screen nobody can see.
 *
 * Locking `<html>` rather than `<body>` is what actually stops iOS and Safari,
 * and the page's own scroll position is put back on release. The gutter the
 * scrollbar leaves behind is replaced with padding so the page doesn't jump
 * sideways as it locks.
 *
 *   useLockScroll(open)
 *
 * Safe to nest: the page comes back when the last caller releases it.
 */
export function useLockScroll(active = true) {
  useEffect(() => {
    if (!active) return
    const root = document.documentElement

    if (locks === 0) {
      const y = window.scrollY
      // An overlay-style scrollbar takes no width, so this is 0 on most Macs
      // and the padding is a no-op there.
      const gutter = window.innerWidth - root.clientWidth
      const prev = { overflow: root.style.overflow, paddingRight: root.style.paddingRight }
      root.style.overflow = 'hidden'
      if (gutter > 0) root.style.paddingRight = `${gutter}px`
      restore = () => {
        root.style.overflow = prev.overflow
        root.style.paddingRight = prev.paddingRight
        window.scrollTo(0, y)
      }
    }
    locks += 1

    return () => {
      locks -= 1
      if (locks === 0 && restore) {
        restore()
        restore = null
      }
    }
  }, [active])
}
