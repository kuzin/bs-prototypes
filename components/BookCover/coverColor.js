import { useEffect, useState } from 'react'
import { coverIdUrl, coverUrl } from '@components/BookCover/covers'

/* The colour of a cover, read off the cover.
 *
 * Every book in the catalog carries a hand-picked `color`, but that value
 * exists to tint the *placeholder* — the flat tile a title gets when there is
 * no jacket. On a title whose real jacket is on screen it is somebody's guess,
 * and it shows: Dog Man's is orange over a jacket that is mostly night sky,
 * Amari's is violet over a cover of blue water. So where there is an image the
 * image decides, and `color` stays the fallback for when there isn't one.
 *
 * Open Library's cover CDN sends `access-control-allow-origin: *`, which is
 * what makes reading the pixels back possible at all — without it the canvas
 * is tainted and `getImageData` throws. That throw is caught rather than
 * guarded against, because the header is theirs to change. */

// Sampling the same jacket on every visit to a book is work already done.
const CACHE = new Map()

const hex = (r, g, b) =>
  '#' +
  [r, g, b]
    .map((v) =>
      Math.round(Math.min(255, Math.max(0, v)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')

/* Hue buckets rather than an average of everything: averaging a jacket mixes
   its red into its green and returns mud, which is how every "dominant colour"
   that comes out grey-brown gets made. The heaviest bucket is the colour the
   cover actually reads as. */
const BUCKETS = 24

function dominant(img) {
  const w = 40
  const h = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * w) || 60)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, w, h)

  let data
  try {
    data = ctx.getImageData(0, 0, w, h).data
  } catch {
    return null
  }

  const bins = Array.from({ length: BUCKETS }, () => ({ w: 0, r: 0, g: 0, b: 0 }))
  const grey = { n: 0, r: 0, g: 0, b: 0 }

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    grey.r += r
    grey.g += g
    grey.b += b
    grey.n++

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const light = (max + min) / 510
    /* Paper and ink are not the book's colour — nearly every jacket is mostly
       one or the other, and either would win on volume alone. */
    if (light > 0.93 || light < 0.07) continue

    const chroma = max - min
    if (!chroma) continue
    const sat = chroma / (255 - Math.abs(max + min - 255))
    if (sat < 0.15) continue

    let hue
    if (max === r) hue = ((g - b) / chroma) % 6
    else if (max === g) hue = (b - r) / chroma + 2
    else hue = (r - g) / chroma + 4
    hue = (hue * 60 + 360) % 360

    /* A vivid pixel in the middle of the range says more about the jacket than
       a washed-out one near either end, so it counts for more. */
    const weight = sat * (1 - Math.abs(light - 0.5))
    const bin = bins[Math.floor(hue / (360 / BUCKETS)) % BUCKETS]
    bin.w += weight
    bin.r += r * weight
    bin.g += g * weight
    bin.b += b * weight
  }

  const best = bins.reduce((a, b) => (b.w > a.w ? b : a), bins[0])
  if (best.w > 0) return hex(best.r / best.w, best.g / best.w, best.b / best.w)
  // A genuinely greyscale jacket has no hue to find, so it gets its own grey.
  if (grey.n) return hex(grey.r / grey.n, grey.g / grey.n, grey.b / grey.n)
  return null
}

/**
 * The colour to theme a page with, given a book.
 *
 *   const theme = useCoverColor(book)   // '#1b3a5c' | null
 *
 * `null` while the image is in flight and when the sample fails, so the page
 * can start on its own ground and fade the colour in. Only a book with no
 * image falls back to the catalog's `color`. Pass `null` for no book.
 */
export function useCoverColor(book) {
  const src = book ? (coverIdUrl(book.coverId) ?? coverUrl(book.isbn)) : null
  const [sampled, setSampled] = useState(() => (src ? (CACHE.get(src) ?? null) : null))

  useEffect(() => {
    if (!src) {
      setSampled(null)
      return
    }
    if (CACHE.has(src)) {
      setSampled(CACHE.get(src))
      return
    }
    /* Nothing is known about this jacket yet, so the page says nothing — it
       starts from its own ground and takes the colour on when there is one,
       rather than carrying the last book's colour into this one. */
    setSampled(null)
    let live = true
    const img = new Image()
    // Without this the pixels come back tainted and unreadable.
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const color = dominant(img)
      CACHE.set(src, color)
      if (live) setSampled(color)
    }
    img.onerror = () => {
      CACHE.set(src, null)
      if (live) setSampled(null)
    }
    img.src = src
    return () => {
      live = false
    }
  }, [src])

  /* While a sample is in flight this is `null` on purpose: the page stays on
     its own ground and fades into the colour when it arrives. Only a book with
     no image at all falls back to the catalog's `color`, because for that one
     there is nothing coming. */
  if (sampled) return sampled
  return src ? null : (book?.color ?? null)
}
