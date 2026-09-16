import { useEffect, useState } from 'react'

/**
 * `useState`, except the value outlives a hot reload.
 *
 * Editing a prototype re-mounts whatever React couldn't hot-swap, and the first
 * thing to go is where you were: the preview bar snaps back to its first view
 * and the page you were looking at is three clicks away again. That is the
 * whole cost of iterating on a screen that isn't the landing one.
 *
 * So the switchers keep their value in `sessionStorage` — per tab, so a fresh
 * tab still opens where a first-time reader would, and gone when the tab is.
 * Storage can throw (a private window, blocked site data), so every read and
 * write is guarded and the hook falls back to plain `useState`.
 *
 *   const [view, setView] = useStickyState('pick-your-path:view', 'teacher')
 *
 * `key` is namespaced by the prototype so two of them can both keep a `view`.
 * Use it for *where you are* — a view, a tab, a filter. Not for what you have
 * done: a prototype's own demo state should still start where its fixtures say,
 * or a Reset button stops meaning anything.
 */
export function useStickyState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = sessionStorage.getItem(`bsp:${key}`)
      return saved === null ? initial : JSON.parse(saved)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(`bsp:${key}`, JSON.stringify(value))
    } catch {
      /* no storage — the value just doesn't outlive the reload */
    }
  }, [key, value])

  return [value, setValue]
}
