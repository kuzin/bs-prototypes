import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A catalog sync, as the Setup page plays it.
 *
 * One run per source, each stepping through the phases a real import has:
 * reading the records, matching them against what is already in the
 * collection, then done with a count of what changed. The numbers are made up
 * from the feed's own title count rather than invented free-hand, so a small
 * catalog reports a small import.
 *
 *   const { runs, start, dismiss } = useSyncRuns()
 *   start(feed)                       // → runs[feed.source]
 *
 * A run is `{ phase, pct, step, result }`. `phase` is 'running' while it moves
 * and 'done' after; `result` is `{ records, added, updated, removed }`.
 */
const STEPS = [
  { at: 0, label: 'Connecting…' },
  { at: 18, label: 'Reading records…' },
  { at: 58, label: 'Matching against the collection…' },
  { at: 86, label: 'Updating holdings…' },
]

const TICK_MS = 90

export function useSyncRuns() {
  const [runs, setRuns] = useState({})
  // Every interval this hook owns, so a page left mid-sync doesn't keep ticking.
  const timers = useRef({})

  useEffect(
    () => () => {
      Object.values(timers.current).forEach(clearInterval)
    },
    [],
  )

  const start = useCallback((feed) => {
    const source = feed.source
    clearInterval(timers.current[source])

    // What the import will say it did. Drawn off the catalog's size: a drop
    // mostly re-states records it already had, changes a few, and drops the
    // handful that left the shelves.
    const records = feed.titles || 240
    const result = {
      records,
      added: Math.max(1, Math.round(records * 0.012)),
      updated: Math.round(records * 0.07),
      removed: Math.round(records * 0.004),
    }

    setRuns((r) => ({ ...r, [source]: { phase: 'running', pct: 0, step: STEPS[0].label, result } }))

    timers.current[source] = setInterval(() => {
      setRuns((r) => {
        const run = r[source]
        if (!run || run.phase !== 'running') return r
        // Not linear: reading is quick, matching is the slow part, and a bar
        // that crawls evenly to 100 reads as a spinner with extra steps.
        const step = run.pct < 58 ? 7 : run.pct < 86 ? 3 : 6
        const pct = Math.min(100, run.pct + step)
        if (pct >= 100) {
          clearInterval(timers.current[source])
          return { ...r, [source]: { ...run, phase: 'done', pct: 100, step: null } }
        }
        const label = [...STEPS].reverse().find((s) => pct >= s.at)?.label ?? run.step
        return { ...r, [source]: { ...run, pct, step: label } }
      })
    }, TICK_MS)
  }, [])

  const dismiss = useCallback((source) => {
    clearInterval(timers.current[source])
    setRuns((r) => {
      const next = { ...r }
      delete next[source]
      return next
    })
  }, [])

  return { runs, start, dismiss }
}
