import { useEffect, useState } from 'react'

/**
 * Titles readers have asked their school for, shared across prototypes.
 *
 * A reader looking at a book their school can't give them — nowhere to read
 * it, on any of its sources — can request it (`books`), and the school's
 * Requests view lists what its readers asked for (`collection-engine`). Those are separate pages, so the request travels in
 * `localStorage` — the one store both can see, in any tab — and every hook
 * listening hears it arrive, from this tab or another.
 *
 *   const { requests, request, isRequested, clear } = useTitleRequests('lincoln')
 *   request(book.title, { author: book.author })
 *
 * `schoolId` is the Collection Engine's id for the school. A request is
 * `{ q, author, asks, at }`: the title asked for, who wrote it, how many
 * readers asked, and when it was last asked.
 */
const KEY = 'bsp:title-requests'
const EVENT = 'bsp:title-requests'

const norm = (q) => q.trim().toLowerCase().replace(/\s+/g, ' ')

function read() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    // Storage can throw (a private window, blocked site data); the request
    // simply doesn't outlive the page.
  }
  window.dispatchEvent(new Event(EVENT))
}

export function useTitleRequests(schoolId) {
  const [all, setAll] = useState(read)

  useEffect(() => {
    const sync = () => setAll(read())
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync) // a request made in another tab
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const requests = all.filter((r) => r.schoolId === schoolId).sort((a, b) => b.at - a.at)
  const isRequested = (q) => requests.some((r) => r.key === norm(q))

  // One reader asking twice is still one ask; the page shows it as requested.
  const request = (q, { author } = {}) => {
    const key = norm(q)
    if (!key || isRequested(q)) return
    write([...read(), { schoolId, key, q: q.trim(), author, asks: 1, at: Date.now() }])
  }

  const clear = () => write(read().filter((r) => r.schoolId !== schoolId))

  return { requests, request, isRequested, clear }
}
