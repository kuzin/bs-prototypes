import { useLayoutEffect, useRef, useState } from 'react'
import { Pill } from '@components/Pill/Pill'
import '@components/Pill/Pill.css'
import '@components/WhereTags/WhereTags.css'

const GAP = 4 // px between tags — keep in step with `.wt { gap }`

/**
 * Where a book is — one small tag per place a reader can get it: a linked app
 * (Comics Plus, Sora, Scholastic), the school library, their own classroom's
 * shelf. It replaced the single coloured dot a jacket used to wear, which could
 * only say "something opens this" and never where.
 *
 * <WhereTags tags={[{ id: 'comicsplus', label: 'Comics Plus', color: '#0CA7BC' }]} />
 *
 * `tags` is the host's to build — each prototype knows its own sources — as
 * `{ id, label, color, title? }`, strongest claim first, so a place that opens
 * the book this minute leads the row. `title` is the longer sentence a tag
 * carries on hover.
 *
 * Always one line. The row shows as many tags as fit the width it is given and
 * folds the rest into a "+N" whose hover names them — under a jacket that is
 * the cover's width, and a second line of pills made a shelf of covers read as
 * a list. `max` caps it further when a surface wants fewer.
 */
export function WhereTags({ tags = [], max = Infinity, className = '' }) {
  const wrapRef = useRef(null)
  const measureRef = useRef(null)
  const cap = Math.min(tags.length, max)
  const [fit, setFit] = useState(cap)
  const key = tags.map((t) => `${t.id}:${t.label}`).join('|')

  // Fit to the line: measure every tag once, off-screen, then keep as many as
  // leave room for the "+N" that stands in for the rest.
  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const measure = measureRef.current
    if (!wrap || !measure) return undefined
    const compute = () => {
      const avail = wrap.clientWidth
      const els = [...measure.children]
      const more = els.pop()?.offsetWidth ?? 0
      let used = 0
      let n = 0
      for (let i = 0; i < cap; i++) {
        const w = els[i].offsetWidth + (i ? GAP : 0)
        const left = tags.length - (i + 1)
        if (used + w + (left > 0 ? GAP + more : 0) > avail) break
        used += w
        n = i + 1
      }
      // One tag at least, even squeezed: an ellipsis still says where.
      setFit(Math.max(1, n))
    }
    compute()
    if (typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(compute)
    ro.observe(wrap)
    return () => ro.disconnect()
    // `key` stands in for `tags`, which is a fresh array every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, cap])

  if (!tags.length) return null
  const shown = tags.slice(0, fit)
  const rest = tags.slice(fit)
  const pill = (t) => (
    <Pill color={t.color} size="sm">
      {t.label}
    </Pill>
  )

  return (
    <span ref={wrapRef} className={`wt ${className}`.trim()}>
      {shown.map((t) => (
        <span key={t.id} className="wt-tag" title={t.title ?? t.label}>
          {pill(t)}
        </span>
      ))}
      {rest.length > 0 && (
        <span className="wt-tag wt-tag--more" title={rest.map((t) => t.label).join(', ')}>
          <Pill color="#767676" size="sm">
            +{rest.length}
          </Pill>
        </span>
      )}
      {/* Every tag at its natural width, plus the widest "+N" it could need —
          the ruler the line is fitted against. Never seen, never read. */}
      <span ref={measureRef} className="wt-measure" aria-hidden="true">
        {tags.map((t) => (
          <span key={t.id} className="wt-tag">
            {pill(t)}
          </span>
        ))}
        <span className="wt-tag">
          <Pill color="#767676" size="sm">
            +{tags.length}
          </Pill>
        </span>
      </span>
    </span>
  )
}
