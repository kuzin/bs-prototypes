import { useEffect, useState, useRef } from 'react'

// Simulates a network query for a single tile. Returns
//   { data, loading, error, refetch() }
// `delay` controls how long the "query" takes to resolve.
// `armed` (default true) lets a parent gate the start of the query —
// concepts use this to defer firing until the user opts in.
export function useFakeQuery(value, { delay = 800, armed = true } = {}) {
  const [loading, setLoading]   = useState(armed)
  const [data, setData]         = useState(armed ? undefined : undefined)
  const [version, setVersion]   = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!armed) {
      setLoading(false)
      return
    }
    setLoading(true)
    setData(undefined)
    timerRef.current = setTimeout(() => {
      setData(value)
      setLoading(false)
    }, delay)
    return () => clearTimeout(timerRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed, version])

  return {
    data,
    loading,
    refetch: () => setVersion(v => v + 1),
  }
}

// Run all queries in `tiles` with optional stagger. Reports the count of
// queries currently "in flight" so concepts can show progress and the
// "queries fired on load" meter.
export function useFakeBatch(tiles, { delayMin = 400, delayMax = 1200, stagger = 0, armed = true } = {}) {
  const [results, setResults] = useState({}) // id -> value
  const [loading, setLoading] = useState({}) // id -> bool
  const [fired,   setFired]   = useState(0)
  const timers = useRef([])

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (!armed) return

    setResults({})
    setFired(0)
    const init = {}
    tiles.forEach(t => { init[t.id] = true })
    setLoading(init)

    tiles.forEach((t, i) => {
      const fireDelay = stagger * i
      const respond   = delayMin + Math.random() * (delayMax - delayMin)
      const t1 = setTimeout(() => {
        setFired(f => f + 1)
        const t2 = setTimeout(() => {
          setResults(r => ({ ...r, [t.id]: t.value }))
          setLoading(l => ({ ...l, [t.id]: false }))
        }, respond)
        timers.current.push(t2)
      }, fireDelay)
      timers.current.push(t1)
    })

    return () => { timers.current.forEach(clearTimeout) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed])

  const total       = tiles.length
  const fullyLoaded = Object.values(loading).every(v => v === false) && Object.keys(loading).length === total

  return { results, loading, fired, total, fullyLoaded }
}
