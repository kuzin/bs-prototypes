import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import '@components/WordCloud/WordCloud.css'

/**
 * A real word cloud — words sized by weight and packed around a centre, not a
 * grid of pills pretending to be one.
 *
 * The layout is the classic archimedean-spiral placement: words are measured
 * with the canvas text metrics of the font they will actually render in, then
 * placed heaviest-first, each one walking out along a spiral until it finds a
 * spot no earlier word occupies. Everything is drawn as SVG <text> inside a
 * viewBox fitted to the packed result, so the cloud scales into whatever box
 * it is given without re-laying out.
 *
 * It is deterministic: the same words in the same order always pack the same
 * way, so a prototype screenshot doesn't change between reloads.
 *
 *   <WordCloud
 *     words={[{ text: 'mischievous', value: 21 }, …]}
 *     accent="#7C3AED"
 *     height="lg"
 *     valueLabel={(w) => `${w.value} students`}
 *   />
 *
 * Word shape: { text, value, color?, title? }
 *   text   — the word
 *   value  — its weight; drives size and colour
 *   color  — override the ramp for this word
 *   title  — native tooltip text (defaults to `valueLabel`)
 */

const HEIGHTS = { sm: 180, md: 240, lg: 320, xl: 380 }

// ─── Colour ramp ────────────────────────────────────────────────────────────
// Heaviest words get the accent (deepened); the tail fades to slate so the
// cloud reads as one weighted field instead of a wall of brand colour.

const clamp01 = (n) => Math.max(0, Math.min(1, n))

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function mix(a, b, t) {
  const [r1, g1, b1] = hexToRgb(a)
  const [r2, g2, b2] = hexToRgb(b)
  const k = clamp01(t)
  const ch = (x, y) => Math.round(x + (y - x) * k)
  return `rgb(${ch(r1, r2)}, ${ch(g1, g2)}, ${ch(b1, b2)})`
}

const PALE = '#7C8BA1' // slate — still readable at the smallest size

function rampColor(accent, t) {
  // t: 0 = lightest word, 1 = heaviest.
  if (t >= 0.5) return mix(accent, '#0F172A', (t - 0.5) * 0.5)
  return mix(PALE, accent, t * 2)
}

// ─── Layout ─────────────────────────────────────────────────────────────────

let measureCtx = null
function textMetrics(text, font) {
  if (!measureCtx) {
    if (typeof document === 'undefined') return null
    measureCtx = document.createElement('canvas').getContext('2d')
  }
  measureCtx.font = font
  const m = measureCtx.measureText(text)
  const ascent = m.actualBoundingBoxAscent
  const descent = m.actualBoundingBoxDescent
  return {
    width: m.width,
    // Fall back to a rough cap-height ratio where the browser withholds the
    // tight bounding box.
    ascent: Number.isFinite(ascent) ? ascent : undefined,
    descent: Number.isFinite(descent) ? descent : undefined,
  }
}

const hits = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y

/**
 * Pack `words` around (0, 0). Returns placed words with their centre point and
 * the bounding box of the whole cloud, in px at nominal font size.
 */
function packCloud(words, { family, minSize, maxSize, rotate, aspect }) {
  const values = words.map((w) => w.value ?? 0)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min

  const placed = []
  const boxes = []
  let bounds = null

  words.forEach((word, i) => {
    // sqrt keeps the biggest word from swamping everything at wide ranges.
    const t = span === 0 ? 1 : clamp01(((word.value ?? 0) - min) / span)
    const size = Math.round(minSize + (maxSize - minSize) * Math.sqrt(t))
    const weight = 700 + Math.round(t) * 100
    const font = `${weight} ${size}px ${family}`
    const m = textMetrics(word.text, font)
    if (!m) return
    const ascent = m.ascent ?? size * 0.74
    const descent = m.descent ?? size * 0.2
    const pad = Math.max(5, size * 0.2)
    const textW = m.width
    const textH = ascent + descent
    // The rotated words are picked by position, not at random, so the cloud is
    // reproducible.
    const rotated = rotate > 0 && i > 0 && i % Math.max(2, Math.round(1 / rotate)) === 0
    const w = (rotated ? textH : textW) + pad
    const h = (rotated ? textW : textH) + pad

    let cx = 0
    let cy = 0
    for (let step = 0; step < 6000; step += 1) {
      const a = step * 0.16
      const r = a * 2.6
      cx = Math.cos(a) * r * aspect
      cy = Math.sin(a) * r
      const box = { x: cx - w / 2, y: cy - h / 2, w, h }
      if (!boxes.some((b) => hits(box, b))) {
        boxes.push(box)
        bounds = bounds
          ? {
              x0: Math.min(bounds.x0, box.x),
              y0: Math.min(bounds.y0, box.y),
              x1: Math.max(bounds.x1, box.x + box.w),
              y1: Math.max(bounds.y1, box.y + box.h),
            }
          : { x0: box.x, y0: box.y, x1: box.x + box.w, y1: box.y + box.h }
        // Baseline sits below the visual centre of the glyph box.
        placed.push({
          ...word,
          size,
          weight,
          rotated,
          t,
          cx,
          cy: cy + (ascent - textH / 2),
          boxW: textW,
          boxH: textH,
        })
        break
      }
    }
  })

  return { placed, bounds }
}

export function WordCloud({
  words = [],
  accent = '#0DA7BC',
  height = 'md',
  minSize = 13,
  maxSize = 46,
  rotate = 0, // 0–1: roughly what share of words turn 90°. 0 = all horizontal.
  valueLabel = (w) => (w.value != null ? String(w.value) : ''),
  onWordClick,
  selected, // the `text` of a word to highlight
  ariaLabel,
  className = '',
}) {
  const ref = useRef(null)
  const [box, setBox] = useState(null)
  const [family, setFamily] = useState("'museo-sans-rounded', 'Nunito', 'Trebuchet MS', sans-serif")
  const [fontsReady, setFontsReady] = useState(false)

  // The container's real size drives the spiral's aspect, so the cloud comes
  // out roughly the shape of the card it lives in.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setFamily(getComputedStyle(el).fontFamily)
    const ro = new ResizeObserver(([entry]) => {
      const { width, height: h } = entry.contentRect
      setBox((prev) =>
        prev && Math.abs(prev.w - width) < 2 && Math.abs(prev.h - h) < 2 ? prev : { w: width, h },
      )
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // The webfont loads after first paint; metrics measured against the fallback pack
  // wrong, so re-pack once the real face is in.
  useEffect(() => {
    let live = true
    document.fonts?.ready.then(() => live && setFontsReady(true))
    return () => {
      live = false
    }
  }, [])

  const cloud = useMemo(() => {
    if (!box || box.w < 2 || words.length === 0) return null
    const aspect = Math.max(0.6, Math.min(2.6, box.w / Math.max(1, box.h)))
    const sorted = [...words].sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    const { placed, bounds } = packCloud(sorted, {
      family,
      minSize,
      maxSize,
      rotate,
      aspect,
    })
    if (!bounds) return null
    // Never scale the cloud *up* past its nominal type sizes — only down, when
    // it is bigger than the box it has to fit.
    const cw = bounds.x1 - bounds.x0
    const ch = bounds.y1 - bounds.y0
    const vw = Math.max(cw, box.w)
    const vh = Math.max(ch, box.h)
    const mx = (bounds.x0 + bounds.x1) / 2
    const my = (bounds.y0 + bounds.y1) / 2
    return { placed, viewBox: `${mx - vw / 2} ${my - vh / 2} ${vw} ${vh}` }
    // fontsReady is a re-pack trigger, not an input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, box, family, minSize, maxSize, rotate, fontsReady])

  const h = typeof height === 'number' ? height : (HEIGHTS[height] ?? HEIGHTS.md)
  const interactive = typeof onWordClick === 'function'
  const cls = ['wcl', interactive && 'wcl--interactive', className].filter(Boolean).join(' ')

  return (
    <div ref={ref} className={cls} style={{ height: h }}>
      {cloud && (
        <svg
          className="wcl-svg"
          viewBox={cloud.viewBox}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={
            ariaLabel ||
            `Word cloud: ${cloud.placed
              .slice(0, 5)
              .map((w) => w.text)
              .join(', ')}${cloud.placed.length > 5 ? ` and ${cloud.placed.length - 5} more` : ''}`
          }
        >
          {cloud.placed.map((w) => {
            const isSel = selected != null && selected === w.text
            const pad = Math.max(4, w.size * 0.18)
            return (
              <g
                key={w.text}
                className={['wcl-word', isSel && 'wcl-word--selected'].filter(Boolean).join(' ')}
                transform={w.rotated ? `rotate(-90 ${w.cx} ${w.cy})` : undefined}
                onClick={interactive ? () => onWordClick(w) : undefined}
                onKeyDown={
                  interactive
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onWordClick(w)
                        }
                      }
                    : undefined
                }
                tabIndex={interactive ? 0 : undefined}
                role={interactive ? 'button' : undefined}
              >
                {isSel && (
                  <rect
                    className="wcl-halo"
                    x={w.cx - w.boxW / 2 - pad}
                    y={w.cy - w.boxH / 2 - pad * 0.8}
                    width={w.boxW + pad * 2}
                    height={w.boxH + pad * 1.6}
                    rx={(w.boxH + pad * 1.6) / 2}
                    fill={w.color || accent}
                  />
                )}
                <text
                  x={w.cx}
                  y={w.cy}
                  textAnchor="middle"
                  fontSize={w.size}
                  fontWeight={w.weight}
                  fill={w.color || rampColor(accent, w.t)}
                >
                  <title>{w.title || `${w.text} — ${valueLabel(w)}`}</title>
                  {w.text}
                </text>
              </g>
            )
          })}
        </svg>
      )}
    </div>
  )
}
