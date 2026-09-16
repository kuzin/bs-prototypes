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

/**
 * Forget every sticky value and start the prototype over.
 *
 * Sticky state is the one thing a reload doesn't clear — that's the point of it
 * — so "back to the beginning" has to say so explicitly: drop the `bsp:` keys,
 * then reload, and the prototype opens exactly where a first-time reader would.
 * Everything else a prototype holds is ordinary React state, which the reload
 * takes care of.
 */
export function resetPrototype() {
  try {
    // Only this prototype's keys. They are namespaced by its id, which is the
    // folder in the URL for all but a couple of prototypes — and where the two
    // disagree nothing matches, so fall back to clearing the lot rather than
    // reloading to exactly where you already were.
    const slug = window.location.pathname.split('/').filter(Boolean).pop()
    const keys = Object.keys(sessionStorage).filter((k) => k.startsWith('bsp:'))
    const mine = keys.filter((k) => k.startsWith(`bsp:${slug}:`))
    for (const key of mine.length ? mine : keys) sessionStorage.removeItem(key)
  } catch {
    /* no storage — nothing to forget, and the reload still does its half */
  }
  window.location.reload()
}
