import { useState, useEffect, useRef, useMemo } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  Field,
  Input,
  Textarea,
  NumberInput,
  ColorInput,
  DateInput,
  RangeSlider,
} from '@components/Form/Form'
import { Toggle } from '@components/Toggle/Toggle'
import { Button } from '@components/Button/Button'
import { CustomSelect } from '@components/CustomSelect/CustomSelect'
import { Tabs } from '@components/Tabs/Tabs'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { RichText } from '@components/RichText/RichText'
import { ImageDropzone } from '@components/ImageDropzone/ImageDropzone'
import { Banner, EmptyState } from '@components/Primitives/Primitives'
import { Modal } from '@components/Modal/Modal'
import { Ic } from '@components/ui'
import { Icon } from '@components/Icon/Icon'
import {
  QUICK_FONTS,
  PICKER_BADGE_GROUPS,
  LOG_TYPES,
  TEMPLATE_PRESETS,
  getBannerTheme,
  fontStack,
  loadFont,
  badgeImage,
  FAKE_UPLOAD_IMG,
  BADGE_SUBJECTS,
  subjectsOf,
  SET_SUBJECTS,
  COLOR_BUCKETS,
  badgeColor,
  ensureBadgeColors,
  themeBgImages,
} from '../data'
import {
  STEP_ICONS,
  StepHead,
  ColorPicker,
  GalleryCheck,
  TrashIcon,
  SEARCH_EMPTY_ICON,
  BadgeAvatars,
  BadgeSelect,
  badgePoolOf,
  BadgeMultiSelect,
} from './shared'

// ─── Badge builder bits (create-a-badge) ────────────────────────────────────
const BUILDER_BGS = [
  '#0DA7BC',
  '#3B82F6',
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#FB7185',
  '#EF4444',
  '#F97316',
  '#F59E0B',
  '#84CC16',
  '#16A97A',
  '#0F172A',
]
// Clean 24×24 icon paths (Lucide/Feather geometry). Stroke icons draw as
// outlines; fill icons as solids — both centered in the 24-unit box.
// Badge-icon picker entries. `name` drives the on-screen <Icon> render; `path`
// + `mode` are kept for the canvas badge compositor (composeBadge), which draws
// the glyph onto a <canvas> and so can't use the React <Icon> component.
const BUILDER_ICONS = [
  {
    id: 'star',
    name: 'star',
    mode: 'stroke',
    path: 'M12 2.5l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.55 6.09 20.66l1.13-6.57L2.45 9.44l6.6-.96z',
  },
  {
    id: 'heart',
    name: 'heart',
    mode: 'stroke',
    path: 'M19.5 5.3a4.6 4.6 0 0 0-6.5 0L12 6.3l-1-1a4.6 4.6 0 1 0-6.5 6.5l1 1L12 20.3l6.5-6.5 1-1a4.6 4.6 0 0 0 0-6.5z',
  },
  {
    id: 'flame',
    name: 'flame',
    mode: 'stroke',
    path: 'M12 2.5c2.5 3 4.5 5 4.5 8.5a4.5 4.5 0 0 1-9 0c0-1.3.4-2.3 1.1-3.3.2 1.6 1 2.4 2 2.4 1.2 0 1.6-1 1.4-2.6-.2-1.9-.5-3.5-1-5z',
  },
  { id: 'check', name: 'check', mode: 'stroke', path: 'M20 6.5L9.2 17.3 4 12.1' },
  {
    id: 'trophy',
    name: 'trophy',
    mode: 'stroke',
    path: 'M7 4.5h10v4a5 5 0 0 1-10 0zM7 6H4.5v1.5A2.5 2.5 0 0 0 7 10M17 6h2.5v1.5A2.5 2.5 0 0 1 17 10M10 14.5h4M9.5 20h5M12 14.5V18M9.5 20h5',
  },
  { id: 'bolt', name: 'bolt', mode: 'stroke', path: 'M13.5 2.5L5 13.5h5.5L10 21.5 19 10h-5.5z' },
  {
    id: 'book',
    name: 'book',
    mode: 'stroke',
    path: 'M4 4.5h11a2.5 2.5 0 0 1 2.5 2.5v12.5a2 2 0 0 0-2-2H4zM4 4.5v13',
  },
  {
    id: 'medal',
    name: 'medal',
    mode: 'stroke',
    path: 'M8 2.5l2.5 4M16 2.5l-2.5 4M12 21.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z',
  },
  {
    id: 'crown',
    name: 'crown',
    mode: 'stroke',
    path: 'M3 7.5l3.5 3L12 4l5.5 6.5L21 7.5l-1.5 11h-15zM4.5 18.5h15',
  },
  {
    id: 'rocket',
    name: 'rocket',
    mode: 'stroke',
    path: 'M12 2.5c3 1.5 5 4.5 5 8.5 0 2-.7 3.6-1.5 4.5h-7C7.7 14.6 7 13 7 11c0-4 2-7 5-8.5zM12 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM9.5 15.5L8 19l2.5-1.5M14.5 15.5L16 19l-2.5-1.5',
  },
  {
    id: 'target',
    name: 'target',
    mode: 'stroke',
    path: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  },
  {
    id: 'sun',
    name: 'sun',
    mode: 'stroke',
    path: 'M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8L6 18M18 6l1.8-1.8',
  },
  {
    id: 'leaf',
    name: 'leaf',
    mode: 'stroke',
    path: 'M5 19c-1-7 3.5-13.5 14-13.5C19 15.5 13 20 6.5 19zM5 19c2.5-4 5-6.5 9-8.5',
  },
  {
    id: 'smile',
    name: 'smile',
    mode: 'stroke',
    path: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8.5 14c.8 1.2 2 2 3.5 2s2.7-.8 3.5-2M9 9.5h.01M15 9.5h.01',
  },
]

function builderText(hex) {
  const h = String(hex || '').replace('#', '')
  const n =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h
  if (n.length !== 6) return '#ffffff'
  const int = parseInt(n, 16)
  const [r, g, b] = [(int >> 16) & 255, (int >> 8) & 255, int & 255]
  const f = (c) => {
    c /= 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) > 0.6 ? '#0f172a' : '#ffffff'
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

// ── SVG recolor helpers ──
// An SVG's markup → a renderable data URL.
function svgDataUrl(text) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(text)}`
}
// Distinct hex colors used as fills/strokes/stops (so each can be remapped).
function extractSvgColors(text) {
  const out = []
  const re = /(?:fill|stroke|stop-color)\s*[=:]\s*["']?\s*(#[0-9a-fA-F]{3,8})/gi
  for (const m of String(text || '').matchAll(re)) {
    const c = m[1].toLowerCase()
    if (!out.includes(c)) out.push(c)
  }
  return out.slice(0, 8)
}
// Replace each mapped original color with its new value (case-insensitive).
function applyColorMap(text, map) {
  let out = text || ''
  Object.entries(map || {}).forEach(([orig, next]) => {
    if (!next || next.toLowerCase() === orig.toLowerCase()) return
    const esc = orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    out = out.split(new RegExp(esc, 'gi')).join(next)
  })
  return out
}
const colorMapChanged = (map) =>
  Object.entries(map || {}).some(([k, v]) => v && v.toLowerCase() !== k.toLowerCase())

// Flatten a built badge (background + number/icon) into a PNG data-URL so every
// badge render site can treat it like any other image. Async because it may
// load a background image and/or a web font before drawing.
async function composeBadge(bg, content, font) {
  const size = 220
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')
  ctx.save()
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  if (bg.image) {
    const im = await loadImage(bg.image)
    if (im) {
      const scale = Math.max(size / im.width, size / im.height)
      const w = im.width * scale
      const h = im.height * scale
      ctx.drawImage(im, (size - w) / 2, (size - h) / 2, w, h)
      ctx.fillStyle = 'rgba(15,23,42,0.18)' // light scrim for legibility (kept subtle)
      ctx.fillRect(0, 0, size, size)
    } else {
      ctx.fillStyle = bg.color || '#0DA7BC'
      ctx.fillRect(0, 0, size, size)
    }
  } else {
    ctx.fillStyle = bg.color || '#0DA7BC'
    ctx.fillRect(0, 0, size, size)
  }
  ctx.restore()
  const fg = bg.image ? '#ffffff' : builderText(bg.color)
  if (content.type !== 'icon') {
    // Number or letter(s) — shrink the type as the string gets longer so it
    // always fits inside the medallion.
    const text = String(content.value ?? '')
    const fam = font || 'Poppins'
    const factor = text.length >= 3 ? 0.27 : text.length === 2 ? 0.34 : 0.42
    const px = size * factor
    try {
      await document.fonts.load(`800 ${Math.round(px)}px "${fam}"`)
    } catch {
      /* fall back to system font */
    }
    ctx.fillStyle = fg
    ctx.textAlign = 'center'
    ctx.font = `800 ${px}px "${fam}", system-ui, sans-serif`
    // Center on the glyph's actual ink box so it's optically centered for any
    // font (serifs, display faces) regardless of their baseline metrics.
    ctx.textBaseline = 'alphabetic'
    const m = ctx.measureText(text)
    const asc = m.actualBoundingBoxAscent || px * 0.7
    const desc = m.actualBoundingBoxDescent || px * 0.05
    ctx.fillText(text, size / 2, size / 2 + (asc - desc) / 2)
  } else {
    const ic = BUILDER_ICONS.find((i) => i.id === content.value)
    if (ic) {
      // Rasterize the same Tabler glyph the picker renders, so the saved badge
      // matches what was chosen.
      const svg = renderToStaticMarkup(<Icon name={ic.name} size={24} stroke={2} color={fg} />)
      const im = await loadImage(`data:image/svg+xml,${encodeURIComponent(svg)}`)
      if (im) {
        const s = size * 0.5
        ctx.drawImage(im, (size - s) / 2, (size - s) / 2, s, s)
      }
    }
  }
  return c.toDataURL('image/png')
}

// Flatten an uploaded image (with optional bg color, scale, and offset) into a
// circular PNG data-URL. offset x/y are in canvas pixels; scale multiplies the
// "contain" fit.
async function composeUpload({ src, bg, bgImage, tint, scale, x, y }) {
  const size = 220
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')
  ctx.save()
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  if (bgImage) {
    const bim = await loadImage(bgImage)
    if (bim) {
      const bs = Math.max(size / bim.width, size / bim.height)
      const bw = bim.width * bs
      const bh = bim.height * bs
      ctx.drawImage(bim, (size - bw) / 2, (size - bh) / 2, bw, bh)
    }
  } else if (bg && bg !== 'transparent') {
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, size, size)
  }
  const im = await loadImage(src)
  if (im) {
    const fit = Math.min(size / im.width, size / im.height) * (scale || 1)
    const w = im.width * fit
    const h = im.height * fit
    const dx = (size - w) / 2 + (x || 0)
    const dy = (size - h) / 2 + (y || 0)
    if (tint) {
      // Recolor the art to a single tint by masking a solid fill with its alpha.
      const off = document.createElement('canvas')
      off.width = size
      off.height = size
      const octx = off.getContext('2d')
      octx.drawImage(im, dx, dy, w, h)
      octx.globalCompositeOperation = 'source-in'
      if (tint.g) {
        const grad = octx.createLinearGradient(0, 0, size, size)
        grad.addColorStop(0, tint.g[0])
        grad.addColorStop(1, tint.g[1])
        octx.fillStyle = grad
      } else {
        octx.fillStyle = tint
      }
      octx.fillRect(0, 0, size, size)
      ctx.drawImage(off, 0, 0)
    } else {
      ctx.drawImage(im, dx, dy, w, h)
    }
  }
  ctx.restore()
  return c.toDataURL('image/png')
}

function BuilderIcon({ icon, color, size = 22 }) {
  return <Icon name={icon.name} color={color} size={size} />
}

// Generic background images for the Upload + Create tabs — gradients + a few
// patterns, drawn on a canvas so we don't ship asset files. Kept dark/saturated
// so white badge art stays legible. Generated once, then cached.
function makeBgImage(draw) {
  const size = 220
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  draw(c.getContext('2d'), size)
  return c.toDataURL('image/png')
}
const bgGrad = (a, b, angle = 135) =>
  makeBgImage((ctx, s) => {
    const r = (angle * Math.PI) / 180
    const dx = (Math.cos(r) * s) / 2
    const dy = (Math.sin(r) * s) / 2
    const g = ctx.createLinearGradient(s / 2 - dx, s / 2 - dy, s / 2 + dx, s / 2 + dy)
    g.addColorStop(0, a)
    g.addColorStop(1, b)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, s, s)
  })
const bgRadial = (inner, outer) =>
  makeBgImage((ctx, s) => {
    ctx.fillStyle = outer
    ctx.fillRect(0, 0, s, s)
    const g = ctx.createRadialGradient(s * 0.4, s * 0.34, s * 0.05, s * 0.5, s * 0.5, s * 0.66)
    g.addColorStop(0, inner)
    g.addColorStop(1, outer)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, s, s)
  })
const bgConfetti = (cols, base = ['#1E293B', '#0F172A']) =>
  makeBgImage((ctx, s) => {
    const g = ctx.createLinearGradient(0, 0, s, s)
    g.addColorStop(0, base[0])
    g.addColorStop(1, base[1])
    ctx.fillStyle = g
    ctx.fillRect(0, 0, s, s)
    const pts = [
      [38, 48],
      [152, 30],
      [92, 92],
      [182, 112],
      [30, 140],
      [120, 152],
      [68, 182],
      [172, 178],
      [58, 104],
      [110, 38],
    ]
    pts.forEach((p, i) => {
      ctx.fillStyle = cols[i % cols.length]
      ctx.beginPath()
      ctx.arc(p[0], p[1], 7, 0, Math.PI * 2)
      ctx.fill()
    })
  })
const bgStripes = (a, b) =>
  makeBgImage((ctx, s) => {
    ctx.fillStyle = b
    ctx.fillRect(0, 0, s, s)
    ctx.save()
    ctx.translate(s / 2, s / 2)
    ctx.rotate(Math.PI / 4)
    ctx.translate(-s / 2, -s / 2)
    ctx.fillStyle = a
    for (let x = -s; x < s * 2; x += 52) ctx.fillRect(x, -s, 26, s * 3)
    ctx.restore()
  })
let _defaultBgImages = null
function getDefaultBgImages() {
  if (_defaultBgImages) return _defaultBgImages
  _defaultBgImages = [
    bgGrad('#22D3EE', '#0E7490'),
    bgGrad('#818CF8', '#3730A3'),
    bgGrad('#FB7185', '#9F1239'),
    bgGrad('#34D399', '#065F46'),
    bgGrad('#FBBF24', '#C2410C'),
    bgGrad('#C084FC', '#6D28D9'),
    bgRadial('#0EA5C4', '#0C4A6E'),
    bgConfetti(['#F472B6', '#FBBF24', '#34D399', '#60A5FA', '#C084FC']),
    bgStripes('#334155', '#1E293B'),
  ]
  return _defaultBgImages
}

// Grouped grid of background images — "Default" set plus (when present) the
// challenge theme's banners. Shared by the Upload + Create tabs.
function BgImageGrid({ themeImages = [], themeLabel = 'From this theme', value, onChange }) {
  const groups = [
    { label: 'Default', images: [...themeBgImages('default'), ...getDefaultBgImages()] },
    ...(themeImages.length ? [{ label: themeLabel, images: themeImages }] : []),
  ]
  return (
    <div className="cc-bggrid">
      {groups.map((g) => (
        <div key={g.label} className="cc-bggroup">
          <span className="cc-bglabel">{g.label}</span>
          <div className="cc-builder-bgimgs">
            {g.images.map((src) => (
              <button
                key={src}
                type="button"
                className={`cc-builder-bgimg${value === src ? ' is-on' : ''}`}
                style={{ backgroundImage: `url("${src}")` }}
                onClick={() => onChange(src)}
                aria-label="Background image"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Step 3 · Badges & activities ─────────────────────────────────────────────
// The four earnable badge types (mirrors the live Beanstack badge editor).
// Human labels for each earnable method. The badge types shown in a challenge
// are derived from its type (primary method + add-ons), not a fixed list — e.g.
// a Reading List challenge requires "Logging Specific Titles" and only offers
// "Completing Activities" as an add-on (no reviews / generic logging).
const METHOD_LABELS = {
  log: 'Logging Reading',
  readingList: 'Logging Specific Titles',
  activities: 'Completing Activities',
  reviews: 'Writing Reviews',
  points: 'Earning Points',
  repeatable: 'Repeatable Activities',
  bingo: 'Bingo',
}

// Gallery: a left nav (Recommended · Favorites · Recently used · Subjects ·
// Themes), a color-swatch refine bar, and a searchable grid. Tiles can be
// favorited (star) and remember recently-used badges; color is auto-derived
// from each badge image.
export function BadgeGallery({ onPick, extraGroups = [], defaultGroupId, selectedImg }) {
  const themeGroups = PICKER_BADGE_GROUPS
  // Stable key so the memo/effect only re-run when the template set changes.
  const extraKey = extraGroups.map((g) => g.id).join(',')
  const catalog = useMemo(() => {
    const seen = new Set()
    const out = []
    for (const g of [...extraGroups, ...themeGroups]) {
      for (const b of g.badges)
        if (!seen.has(b.img)) {
          seen.add(b.img)
          out.push({ ...b, _setId: g.id, _group: g.name })
        }
    }
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraKey])
  // A badge's subjects = name-keyword matches ∪ its set's subjects.
  const badgeSubjects = (b) => [
    ...new Set([...subjectsOf(b.name), ...(SET_SUBJECTS[b._setId] || [])]),
  ]
  const subjectGroups = useMemo(
    () => BADGE_SUBJECTS.filter((s) => catalog.some((b) => badgeSubjects(b).includes(s.id))),
    [catalog],
  )

  const [q, setQ] = useState('')
  const [view, setView] = useState(defaultGroupId || extraKey.split(',')[0] || themeGroups[0]?.id)
  const [color, setColor] = useState(null)
  const [, setColorTick] = useState(0)

  // Derive each badge's dominant color once (async, cached), then re-render.
  useEffect(() => {
    let live = true
    ensureBadgeColors(catalog.map((b) => b.img)).then(() => live && setColorTick((t) => t + 1))
    return () => {
      live = false
    }
  }, [catalog])

  const query = q.trim().toLowerCase()
  const searching = query.length > 0
  // Color works like search — a global filter across every badge, so when either
  // is active the grid shows cross-catalog results and the sidebar steps aside.
  const filtering = searching || !!color

  const list = filtering
    ? catalog.filter(
        (b) =>
          (!searching || b.name.toLowerCase().includes(query)) &&
          (!color || badgeColor(b.img) === color),
      )
    : view.startsWith('subj:')
      ? catalog.filter((b) => badgeSubjects(b).includes(view.slice(5)))
      : [...extraGroups, ...themeGroups].find((g) => g.id === view)?.badges || []

  // Color chips reflect every hue in the catalog (a global filter, not view-scoped).
  const presentColors = COLOR_BUCKETS.filter((c) => catalog.some((b) => badgeColor(b.img) === c.id))

  const isSelected = (b) => !!selectedImg && b.img === selectedImg
  const pick = (b) => onPick({ ...b, source: 'gallery' })
  // Single-select: click a swatch to filter, click it again to clear.
  const toggleColor = (id) => setColor((c) => (c === id ? null : id))

  const navBtn = (key, label, count) => (
    <button
      key={key}
      type="button"
      className={`cc-badgepick-group${view === key && !searching ? ' is-on' : ''}`}
      onClick={() => setView(key)}
      title={label}
    >
      <span className="cc-badgepick-group-name">{label}</span>
      <span className="cc-badgepick-group-count">{count}</span>
    </button>
  )

  return (
    <>
      <div className="cc-badgepick-topbar">
        <SearchInput value={q} onChange={setQ} placeholder="Search all badges" />
        {presentColors.length > 1 && (
          <div className="cc-badgepick-colorbar" role="radiogroup" aria-label="Filter by color">
            {presentColors.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                className={`cc-colorchip${color === c.id ? ' is-on' : ''}`}
                style={{ '--chip': c.hex }}
                onClick={() => toggleColor(c.id)}
                title={`${c.name}${color === c.id ? ' (selected — click to clear)' : ''}`}
                aria-checked={color === c.id}
              >
                <span className="cc-colorchip-dot" />
              </button>
            ))}
          </div>
        )}
      </div>

      {filtering && (
        <p className="cc-badgepick-count">
          {list.length} badge{list.length === 1 ? '' : 's'}
          {searching ? ` matching “${q.trim()}”` : ''}
        </p>
      )}

      <div className={`cc-badgepick-cols${filtering ? ' is-searching' : ''}`}>
        {!filtering && (
          <div className="cc-badgepick-groups">
            {extraGroups.length > 0 && <p className="cc-badgepick-grouphead">Recommended</p>}
            {extraGroups.map((g) => navBtn(g.id, g.name, g.badges.length))}
            {subjectGroups.length > 0 && <p className="cc-badgepick-grouphead">By subject</p>}
            {subjectGroups.map((s) =>
              navBtn(
                `subj:${s.id}`,
                s.name,
                catalog.filter((b) => badgeSubjects(b).includes(s.id)).length,
              ),
            )}
            <p className="cc-badgepick-grouphead">By theme</p>
            {themeGroups.map((g) => navBtn(g.id, g.name, g.badges.length))}
          </div>
        )}
        <div className="cc-badgepick-grid">
          {list.length ? (
            list.map((b) => (
              <div
                key={(b._group || '') + b.id + b.img}
                className={`cc-badgepick-item${isSelected(b) ? ' is-selected' : ''}`}
              >
                <button
                  type="button"
                  className="cc-badgepick-pick"
                  onClick={() => pick(b)}
                  aria-label={`Use ${b.name}`}
                >
                  <span className="cc-badgepick-item-art">
                    <img src={b.img} alt="" />
                    {isSelected(b) && (
                      <span className="cc-badgepick-check">
                        <GalleryCheck />
                      </span>
                    )}
                  </span>
                  <span className="cc-badgepick-item-name">{b.name}</span>
                  {filtering && b._group && (
                    <span className="cc-badgepick-item-set">{b._group}</span>
                  )}
                </button>
              </div>
            ))
          ) : (
            <EmptyState
              className="cc-badgepick-empty"
              icon={SEARCH_EMPTY_ICON}
              title={searching ? 'No matches' : 'Nothing here yet'}
              description={searching ? `No badges match “${q.trim()}”.` : undefined}
            />
          )}
        </div>
      </div>
    </>
  )
}

// Upload: load a file, pick a background (for transparency), then scale and
// drag-reposition the graphic inside the badge circle before flattening.
const UPLOAD_BGS = [
  'transparent',
  '#FFFFFF',
  '#0DA7BC',
  '#3B82F6',
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#FB7185',
  '#EF4444',
  '#F97316',
  '#F59E0B',
  '#84CC16',
  '#16A97A',
  '#06B6D4',
  '#0F172A',
]
// Recolor tints offered for uploaded SVGs.
const TINT_COLORS = [
  '#0F172A',
  '#FFFFFF',
  '#0DA7BC',
  '#3B82F6',
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#FB7185',
  '#EF4444',
  '#F97316',
  '#F59E0B',
  '#84CC16',
  '#16A97A',
  '#06B6D4',
]
// Multicolor (gradient) recolor options for SVGs — [from, to] stops.
const GRADIENT_TINTS = [
  ['#F59E0B', '#EC4899'],
  ['#06B6D4', '#3B82F6'],
  ['#8B5CF6', '#EC4899'],
  ['#22C55E', '#06B6D4'],
]
function BadgeUpload({ onPick, bgImages = [], bgLabel, initial }) {
  const [src, setSrc] = useState(initial?.src ?? null)
  const [bgMode, setBgMode] = useState(initial?.bgMode || 'color') // color | image
  const [panel, setPanel] = useState(initial?.bgMode || 'color') // color | image | recolor (tab)
  const [bg, setBg] = useState(initial?.bg || '#FFFFFF')
  const [bgImage, setBgImage] = useState(initial?.bgImage || bgImages[0] || getDefaultBgImages()[0])
  const [scale, setScale] = useState(initial?.scale ?? 1)
  const [pos, setPos] = useState(initial?.pos ?? { x: 0, y: 0 })
  // SVG uploads can be recolored — null = original, hex = solid, {g:[a,b]} = gradient.
  const [isSvg, setIsSvg] = useState(initial?.isSvg ?? false)
  const [tint, setTint] = useState(initial?.tint ?? null)
  // For multicolor recolor: the SVG markup, its distinct colors, and a remap.
  const [svgText, setSvgText] = useState(initial?.svgText ?? null)
  const [svgColors, setSvgColors] = useState(initial?.svgColors ?? [])
  const [colorMap, setColorMap] = useState(initial?.colorMap ?? {})
  const drag = useRef(null)
  const usingImage = bgMode === 'image' && bgImage
  const PREVIEW = 150
  const ratio = 220 / PREVIEW // canvas px per preview px
  const artTransform = `translate(${pos.x / ratio}px, ${pos.y / ratio}px) scale(${scale})`
  // CSS background for a tint (solid hex or {g:[from,to]} gradient).
  const tintCss = tint && tint.g ? `linear-gradient(135deg, ${tint.g[0]}, ${tint.g[1]})` : tint
  // The art to render/compose: per-color remap applied to the SVG (or the raw src).
  const remapped = svgText && colorMapChanged(colorMap)
  const artSrc = remapped ? svgDataUrl(applyColorMap(svgText, colorMap)) : src
  // Switching to Color/Image also sets the background source; Recolor doesn't.
  const selectPanel = (p) => {
    setPanel(p)
    if (p === 'color' || p === 'image') setBgMode(p)
  }
  const setSwatch = (t) => {
    setTint(t)
    setColorMap({}) // a flatten swatch overrides any per-color remap
  }
  const remapColor = (orig, next) => {
    setTint(null) // editing a single color exits flatten mode
    setColorMap((m) => ({ ...m, [orig]: next }))
  }

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const svg = file.type === 'image/svg+xml' || /\.svg$/i.test(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      if (svg) {
        const text = String(reader.result)
        setSvgText(text)
        setSvgColors(extractSvgColors(text))
        setSrc(svgDataUrl(text))
      } else {
        setSvgText(null)
        setSvgColors([])
        setSrc(reader.result)
      }
      setIsSvg(svg)
      setTint(null)
      setColorMap({})
      setScale(1)
      setPos({ x: 0, y: 0 })
      setPanel('color')
      setBgMode('color')
    }
    if (svg) reader.readAsText(file)
    else reader.readAsDataURL(file)
  }
  const onDown = (e) => {
    drag.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onMove = (e) => {
    if (!drag.current) return
    setPos({
      x: drag.current.ox + (e.clientX - drag.current.sx) * ratio,
      y: drag.current.oy + (e.clientY - drag.current.sy) * ratio,
    })
  }
  const onUp = () => {
    drag.current = null
  }

  if (!src) {
    return (
      <div className="cc-badge-upload">
        <label className="cc-badge-uploadzone">
          <span className="cc-badge-uploadhint">
            <span className="cc-badge-uploadicon" aria-hidden="true">
              <Icon name="upload" size={26} />
            </span>
            <strong>Upload a badge image</strong>
            <span>PNG or SVG, square works best</span>
          </span>
          <input type="file" accept="image/*" onChange={onFile} />
        </label>
      </div>
    )
  }
  return (
    <div className="cc-badge-uploadedit">
      <div className="cc-upload-stage">
        <div
          className="cc-upload-circle"
          style={
            usingImage
              ? {
                  backgroundImage: `url("${bgImage}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : { background: bg === 'transparent' ? undefined : bg }
          }
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        >
          {!usingImage && bg === 'transparent' && <span className="cc-upload-checker" />}
          {tint ? (
            <span
              className="cc-upload-tint"
              style={{
                WebkitMaskImage: `url("${src}")`,
                maskImage: `url("${src}")`,
                background: tintCss,
                transform: artTransform,
              }}
            />
          ) : (
            <img src={artSrc} alt="" draggable={false} style={{ transform: artTransform }} />
          )}
        </div>
        <p className="cc-upload-hint">Drag to reposition</p>
        <div className="cc-upload-scale">
          <Icon name="zoom-out" size={15} className="cc-upload-scale-ic" />
          <RangeSlider
            min={0.5}
            max={2.5}
            step={0.05}
            value={scale}
            showValue={false}
            onChange={setScale}
          />
          <Icon name="zoom-in" size={15} className="cc-upload-scale-ic" />
        </div>
        <button type="button" className="cc-upload-replace" onClick={() => setSrc(null)}>
          <Icon name="refresh" size={14} />
          Replace image
        </button>
      </div>
      <div className="cc-upload-controls">
        <Field>
          <Tabs
            className="cc-builder-seg"
            accent="#0DA7BC"
            active={panel}
            onChange={selectPanel}
            items={[
              { id: 'color', label: 'Color' },
              { id: 'image', label: 'Image' },
              ...(isSvg ? [{ id: 'recolor', label: 'Recolor' }] : []),
            ]}
          />
          {panel === 'color' && (
            <div className="cc-accent-ctrl" style={{ marginTop: 10 }}>
              <div className="cc-accent-dots">
                {UPLOAD_BGS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`cc-accent-dot${(bg || '').toLowerCase() === c.toLowerCase() ? ' is-on' : ''}${
                      c === 'transparent' ? ' cc-accent-dot--none' : ''
                    }`}
                    style={c === 'transparent' ? undefined : { background: c }}
                    aria-label={c === 'transparent' ? 'Transparent' : `Use ${c}`}
                    onClick={() => setBg(c)}
                  />
                ))}{' '}
              </div>
              <ColorInput
                size="sm"
                value={bg === 'transparent' ? '#FFFFFF' : bg}
                onChange={setBg}
              />
            </div>
          )}
          {panel === 'image' && (
            <BgImageGrid
              themeImages={bgImages}
              themeLabel={bgLabel}
              value={bgImage}
              onChange={setBgImage}
            />
          )}
          {panel === 'recolor' && (
            <div className="cc-recolor">
              {/* Quick flatten swatches only make sense for a 1-color SVG; a
                  multicolor SVG uses the per-color editors instead. */}
              {svgColors.length <= 1 && (
                <div className="cc-accent-dots">
                  <button
                    type="button"
                    className={`cc-accent-dot cc-tint-orig${tint === null && !remapped ? ' is-on' : ''}`}
                    aria-label="Keep original colors"
                    title="Original colors"
                    onClick={() => setSwatch(null)}
                  />
                  {TINT_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`cc-accent-dot${typeof tint === 'string' && tint.toLowerCase() === c.toLowerCase() ? ' is-on' : ''}`}
                      style={{ background: c }}
                      aria-label={`Recolor all to ${c}`}
                      onClick={() => setSwatch(c)}
                    />
                  ))}
                  {GRADIENT_TINTS.map((g) => (
                    <button
                      key={g.join()}
                      type="button"
                      className={`cc-accent-dot${tint && tint.g && tint.g.join() === g.join() ? ' is-on' : ''}`}
                      style={{ background: `linear-gradient(135deg, ${g[0]}, ${g[1]})` }}
                      aria-label={`Recolor with a ${g[0]} to ${g[1]} gradient`}
                      onClick={() => setSwatch({ g })}
                    />
                  ))}
                </div>
              )}
              {svgColors.length > 0 && (
                <div className="cc-recolor-each">
                  <span className="cc-recolor-label">
                    {svgColors.length > 1 ? 'Edit each color' : 'Custom color'}
                  </span>
                  <div className="cc-recolor-list">
                    {svgColors.map((orig) => (
                      <ColorInput
                        key={orig}
                        size="sm"
                        value={colorMap[orig] || orig}
                        onChange={(c) => remapColor(orig, c)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Field>
        <div className="cc-upload-actions">
          <Button
            variant="primary"
            size="lg"
            accent="#0DA7BC"
            onClick={async () =>
              onPick({
                img: await composeUpload({
                  src: tint ? src : artSrc,
                  bg: usingImage ? 'transparent' : bg,
                  bgImage: usingImage ? bgImage : null,
                  tint,
                  scale,
                  x: pos.x,
                  y: pos.y,
                }),
                source: 'upload',
                edit: {
                  src,
                  bgMode,
                  bg,
                  bgImage,
                  tint,
                  scale,
                  pos,
                  isSvg,
                  svgText,
                  svgColors,
                  colorMap,
                },
              })
            }
          >
            Use this image
          </Button>
        </div>
      </div>
    </div>
  )
}

// Create: pick a background (color or theme/template image) + an icon or
// number (with a font choice); flatten to an image on save.
function BadgeBuilder({ onPick, bgImages = [], bgLabel, initial }) {
  const [bgMode, setBgMode] = useState(initial?.bgMode || 'color') // color | image
  const [color, setColor] = useState(initial?.color || BUILDER_BGS[0])
  const [image, setImage] = useState(initial?.image || bgImages[0] || getDefaultBgImages()[0])
  const [mode, setMode] = useState(initial?.mode || 'number') // number | letter | icon
  const [num, setNum] = useState(initial?.num ?? 1)
  const [letter, setLetter] = useState(initial?.letter ?? 'A')
  const [iconId, setIconId] = useState(initial?.iconId || BUILDER_ICONS[0].id)
  const [font, setFont] = useState(initial?.font || QUICK_FONTS[0].name)
  const usingImage = bgMode === 'image' && image
  const fg = usingImage ? '#ffffff' : builderText(color)
  const activeIcon = BUILDER_ICONS.find((i) => i.id === iconId)
  const valueText = mode === 'number' ? String(num) : letter
  const numSvgFs = valueText.length >= 3 ? 27 : valueText.length === 2 ? 34 : 42
  const previewStyle = usingImage
    ? {
        backgroundImage: `linear-gradient(rgba(15,23,42,0.34), rgba(15,23,42,0.34)), url("${image}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { background: color }
  const save = async () => {
    onPick({
      img: await composeBadge(
        usingImage ? { image } : { color },
        { type: mode, value: mode === 'icon' ? iconId : valueText },
        font,
      ),
      source: 'create',
      edit: { bgMode, color, image, mode, num, letter, iconId, font },
    })
  }
  return (
    <div className="cc-badge-builder">
      <div className="cc-builder-preview">
        <span className="cc-badgeart cc-badgeart--built" style={previewStyle}>
          {mode === 'icon' ? (
            <BuilderIcon icon={activeIcon} color={fg} size={46} />
          ) : (
            <svg
              className="cc-builder-numsvg"
              viewBox="0 0 100 100"
              width="92"
              height="92"
              aria-hidden="true"
            >
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dominantBaseline="central"
                fill={fg}
                fontFamily={fontStack(font)}
                fontWeight="800"
                fontSize={numSvgFs}
              >
                {valueText}
              </text>
            </svg>
          )}
        </span>
        <p className="cc-upload-hint">Live preview</p>
      </div>
      <div className="cc-builder-controls">
        <Field>
          <Tabs
            className="cc-builder-seg"
            accent="#0DA7BC"
            active={bgMode}
            onChange={setBgMode}
            items={[
              { id: 'color', label: 'Color' },
              { id: 'image', label: 'Image' },
            ]}
          />
          {bgMode === 'color' ? (
            <div style={{ marginTop: 10 }}>
              <ColorPicker
                value={color}
                presets={BUILDER_BGS}
                fallback={color}
                onColor={setColor}
              />
            </div>
          ) : (
            <BgImageGrid
              themeImages={bgImages}
              themeLabel={bgLabel}
              value={image}
              onChange={setImage}
            />
          )}
        </Field>
        <Field>
          <Tabs
            className="cc-builder-seg"
            accent="#0DA7BC"
            active={mode}
            onChange={setMode}
            items={[
              { id: 'number', label: 'Number' },
              { id: 'letter', label: 'Letter' },
              { id: 'icon', label: 'Icon' },
            ]}
          />
        </Field>
        {mode === 'icon' ? (
          <Field>
            <div className="cc-builder-icons">
              {BUILDER_ICONS.map((ic) => (
                <button
                  key={ic.id}
                  type="button"
                  className={`cc-builder-iconbtn${iconId === ic.id ? ' is-on' : ''}`}
                  onClick={() => setIconId(ic.id)}
                  aria-label={ic.id}
                >
                  <BuilderIcon icon={ic} color="#475569" size={20} />
                </button>
              ))}
            </div>
          </Field>
        ) : (
          <div className="cc-builder-valuerow">
            <Field className="cc-builder-valuefield">
              {mode === 'number' ? (
                <NumberInput value={num} min={0} max={999} onChange={(n) => setNum(n)} />
              ) : (
                <Input
                  value={letter}
                  maxLength={3}
                  placeholder="A"
                  onChange={(e) => setLetter(e.target.value.toUpperCase())}
                />
              )}
            </Field>
            <Field>
              <CustomSelect
                value={font}
                onChange={(name) => {
                  loadFont(name)
                  setFont(name)
                }}
                options={QUICK_FONTS.map((f) => ({ value: f.name, label: f.name }))}
              />
            </Field>
          </div>
        )}
        <Button variant="primary" size="lg" accent="#0DA7BC" onClick={save}>
          Use this badge
        </Button>
      </div>
    </div>
  )
}

// Badge picker: Gallery (grouped, promoted) / Upload / Create.
function BadgePicker({
  onPick,
  extraGroups,
  defaultGroupId,
  bgImages,
  bgLabel,
  selectedImg,
  editSource,
  editInit,
}) {
  // Editing a custom badge opens straight to the tab it was made on.
  const [tab, setTab] = useState(
    editSource === 'upload' || editSource === 'create' ? editSource : 'gallery',
  )
  return (
    <div className="cc-badgepick">
      <Tabs
        className="cc-badgepick-tabs"
        accent="#0DA7BC"
        active={tab}
        onChange={setTab}
        items={[
          { id: 'gallery', label: 'Gallery' },
          { id: 'upload', label: 'Upload' },
          { id: 'create', label: 'Create' },
        ]}
      />
      {tab === 'gallery' && (
        <BadgeGallery
          onPick={onPick}
          extraGroups={extraGroups}
          defaultGroupId={defaultGroupId}
          selectedImg={selectedImg}
        />
      )}
      {tab === 'upload' && (
        <BadgeUpload
          onPick={onPick}
          bgImages={bgImages}
          bgLabel={bgLabel}
          initial={editSource === 'upload' ? editInit : undefined}
        />
      )}
      {tab === 'create' && (
        <BadgeBuilder
          onPick={onPick}
          bgImages={bgImages}
          bgLabel={bgLabel}
          initial={editSource === 'create' ? editInit : undefined}
        />
      )}
    </div>
  )
}

// Badge editor: choose a badge medallion, name it, and (for logging badges)
// set the log type + goal value.
function BadgeEditor({
  title,
  initial,
  goalMode,
  editing,
  extraGroups,
  defaultGroupId,
  bgImages,
  bgLabel,
  onSave,
  onCancel,
}) {
  const [badge, setBadge] = useState(initial || null)
  const [name, setName] = useState(initial?.name || '')
  const [logType, setLogType] = useState(initial?.logType || '')
  const [goal, setGoal] = useState(initial?.goal ?? 1)
  const [picking, setPicking] = useState(false)
  // 'log' badges need a log type + goal; 'reviews'/'points' badges need a count.
  const needsGoal = goalMode === 'log' || goalMode === 'reviews' || goalMode === 'points'
  const valid =
    !!(badge?.img && name.trim()) &&
    (!needsGoal || (Number(goal) >= 1 && (goalMode !== 'log' || logType)))
  const save = () =>
    onSave({
      name: name.trim(),
      img: badge.img,
      ...(badge.source ? { source: badge.source } : {}),
      ...(badge.edit ? { edit: badge.edit } : {}),
      ...(goalMode === 'log' ? { logType, goal: Number(goal) } : {}),
      ...(goalMode === 'reviews' ? { goal: Number(goal) } : {}),
      ...(goalMode === 'points' ? { goal: Number(goal) } : {}),
    })
  return (
    <div className="cc-badge-editor">
      <header className="cc-badge-editor-head">
        {picking ? (
          <button type="button" className="cc-badge-editor-back" onClick={() => setPicking(false)}>
            <Icon name="chevron-left" size={16} />
            Back to badge details
          </button>
        ) : (
          <h3>{title}</h3>
        )}
        <button
          type="button"
          className="cc-badge-editor-close"
          onClick={onCancel}
          aria-label="Close"
        >
          <Icon name="x" size={18} />
        </button>
      </header>
      <div className="cc-badge-editor-body">
        {picking ? (
          <div className="cc-badgepick-wrap">
            <BadgePicker
              extraGroups={extraGroups}
              defaultGroupId={defaultGroupId}
              bgImages={bgImages}
              bgLabel={bgLabel}
              selectedImg={badge?.img}
              editSource={badge?.source}
              editInit={badge?.edit}
              onPick={(b) => {
                setBadge(b)
                if (!name && b.name) setName(b.name)
                setPicking(false)
              }}
            />
          </div>
        ) : (
          <div className="cc-badge-form">
            <div className="cc-badge-preview">
              <button
                type="button"
                className={`cc-badge-disc${badge?.img ? '' : ' is-empty'}`}
                onClick={() => setPicking(true)}
                aria-label={badge?.img ? 'Change badge' : 'Choose a badge'}
              >
                {badge?.img ? <img src={badge.img} alt="" /> : <Icon name="photo" size={34} />}
                {/* Edit affordance overlaid on the badge (replaces the separate button). */}
                <span className="cc-badge-disc-edit" aria-hidden="true">
                  <Icon name="pencil" size={15} />
                </span>
              </button>
            </div>
            <div className="cc-badge-fields">
              <Field
                label={
                  <>
                    Badge name <span className="cc-req">*</span>
                  </>
                }
                hint={name ? `${name.length}/60` : undefined}
              >
                <Input
                  value={name}
                  maxLength={60}
                  placeholder="e.g. 5 Books Read"
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              {goalMode === 'log' && (
                <div className="cc-badge-goal-row">
                  <Field
                    label={
                      <>
                        Goal <span className="cc-req">*</span>
                      </>
                    }
                  >
                    <NumberInput value={goal} min={1} max={10000} onChange={(n) => setGoal(n)} />
                  </Field>
                  <Field
                    label={
                      <>
                        Log type <span className="cc-req">*</span>
                      </>
                    }
                  >
                    <CustomSelect
                      value={logType}
                      onChange={setLogType}
                      placeholder="Select a log type"
                      options={LOG_TYPES}
                    />
                  </Field>
                </div>
              )}
              {goalMode === 'reviews' && (
                <Field
                  label={
                    <>
                      Reviews to earn <span className="cc-req">*</span>
                    </>
                  }
                >
                  <NumberInput value={goal} min={1} max={10000} onChange={(n) => setGoal(n)} />
                </Field>
              )}
              {goalMode === 'points' && (
                <Field
                  label={
                    <>
                      Points to earn <span className="cc-req">*</span>
                    </>
                  }
                >
                  <NumberInput
                    value={goal}
                    min={1}
                    max={100000}
                    step={10}
                    onChange={(n) => setGoal(n)}
                  />
                </Field>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Footer only in the form view — while picking, each tab has its own
          confirm (tile click / "Use this image" / "Use this badge"). */}
      {!picking && (
        <footer className="cc-badge-editor-foot">
          <Button variant="secondary" size="md" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="md" accent="#0DA7BC" disabled={!valid} onClick={save}>
            {editing ? 'Save badge' : 'Save & add'}
          </Button>
        </footer>
      )}
    </div>
  )
}

// A mock "badge library" so Use-existing / Duplicate always have options (in
// production this would come from the org's previously-created badges). Made
// large enough to exercise search + paging.
const glowImg = (f) => new URL(`../assets/templates/glow/${f}`, import.meta.url).href
const LIB_ART = [
  'stars.webp',
  'fireworks.webp',
  'music-notes.webp',
  'cake.webp',
  'cupcake.webp',
  'party-hats.webp',
  'magic-wand.webp',
  'microphone.webp',
  'open-book.webp',
  'standing-books.webp',
  'apple-stack.webp',
  'grad-stack.webp',
].map(glowImg)
const LIB_ENTRIES = [
  ['Share a Shelfie', 'social', 'Post a photo of your bookshelf'],
  ['Library Scavenger Hunt', 'activity', 'Find the hidden bookmarks'],
  ['Story Time', 'event', 'Attend a story time session'],
  ['Pop Quiz', 'quiz', 'Take the weekly reading quiz'],
  ['Author Visit', 'event', 'Attend the guest author talk'],
  ['Book Trailer', 'video', 'Watch the featured book trailer'],
  ['Poetry Slam', 'event', 'Perform or attend a poetry slam'],
  ['Reading Bingo', 'activity', 'Complete a row on the bingo card'],
  ['Genre Explorer', 'activity', 'Try a genre you’ve never read'],
  ['Cover Designer', 'upload', 'Design and upload a new book cover'],
  ['Read Aloud', 'video', 'Record yourself reading a page'],
  ['Book Swap', 'checkin', 'Check in at the book-swap table'],
  ['Make a Bookmark', 'upload', 'Craft a bookmark and upload a photo'],
  ['Listen & Learn', 'listen', 'Listen to a featured podcast episode'],
  ['Survey Says', 'survey', 'Tell us what you want to read next'],
  ['Maker Space', 'checkin', 'Visit the maker space and scan in'],
  ['Trivia Night', 'event', 'Join the weekly book trivia night'],
  ['Write a Review', 'review', 'Review a book you finished'],
]
const EXISTING_ACTIVITY_BADGES = LIB_ENTRIES.map(([name, type, description], i) => ({
  id: `lib-${i}`,
  name,
  badge: { img: LIB_ART[i % LIB_ART.length] },
  activities: [{ type, description, linkTitle: '', linkUrl: '', codes: [] }],
}))

const ACTIVITY_TYPES = [
  { value: 'activity', label: 'Activity (link)' },
  { value: 'video', label: 'Watch a video' },
  { value: 'listen', label: 'Listen (audio / podcast)' },
  { value: 'quiz', label: 'Take a quiz' },
  { value: 'survey', label: 'Complete a survey / poll' },
  { value: 'event', label: 'Attend an event' },
  { value: 'social', label: 'Share on social' },
  { value: 'review', label: 'Write a review' },
  { value: 'checkin', label: 'Check in / Scan a QR code' },
  { value: 'code', label: 'Activity code' },
  { value: 'photo', label: 'Photo upload' },
  { value: 'upload', label: 'Upload a file' },
  { value: 'textbox', label: 'Text box challenge' },
]
const ACTIVITY_TYPE_LABEL = (v) => ACTIVITY_TYPES.find((t) => t.value === v)?.label || 'Activity'
// One-line example shown under the type select so admins know what each does.
const ACTIVITY_TYPE_HINT = {
  activity: 'Send readers to an external page to do or explore something.',
  video: 'Readers watch a video, then mark it complete — e.g. a booktalk on YouTube.',
  listen: 'Readers listen to an episode or audio clip — e.g. a story podcast.',
  quiz: 'Readers take a quiz on an outside tool — e.g. a Google Form or Kahoot.',
  survey: 'Gather responses with a survey or poll — e.g. “What should we read next?”',
  event: 'Credit readers for attending an event — e.g. an author visit or story time.',
  social: 'Readers post about the challenge on social — e.g. a #SummerReading photo.',
  review: 'Readers write a short review or reflection in a text box.',
  checkin: 'Readers check in on site by scanning a QR code — e.g. at the front desk.',
  code: 'Readers enter a secret code you share at an event or inside a book.',
  photo: 'Readers upload a photo as proof — e.g. a craft they made.',
  upload: 'Readers upload a file — e.g. a worksheet or drawing (PDF or image).',
  textbox: 'Readers answer a prompt in a free-text box — e.g. “What was your favorite part?”',
}
// Text/URL fields per type (code uses a chip input, handled separately; the
// remaining types are description-only).
const ACTIVITY_FIELDS = {
  activity: [
    { k: 'linkTitle', label: 'Link title', ph: 'e.g. Cupid Inspired Crafts' },
    { k: 'linkUrl', label: 'Link URL', ph: 'https://…' },
  ],
  video: [{ k: 'linkUrl', label: 'Video URL', ph: 'https://youtube.com/watch?v=…' }],
  listen: [
    { k: 'linkUrl', label: 'Audio / podcast URL', ph: 'https://open.spotify.com/episode/…' },
  ],
  quiz: [{ k: 'linkUrl', label: 'Quiz link', ph: 'https://forms.gle/… or kahoot.it/…' }],
  survey: [{ k: 'linkUrl', label: 'Survey / poll link', ph: 'https://forms.gle/…' }],
  event: [
    { k: 'linkTitle', label: 'Event name', ph: 'e.g. Author Visit & Story Time' },
    { k: 'linkUrl', label: 'Event details link', ph: 'https://… (optional)' },
  ],
  social: [
    { k: 'linkTitle', label: 'Suggested hashtag', ph: '#SummerReading' },
    { k: 'linkUrl', label: 'Link to share', ph: 'https://… (optional)' },
  ],
}
// Point-earning types (points challenges only).
const POINT_TYPES = [
  { key: 'minutes', label: 'Minutes' },
  { key: 'pages', label: 'Pages' },
  { key: 'books', label: 'Books' },
  { key: 'activities', label: 'Activities' },
  { key: 'reviews', label: 'Reviews' },
]
const DEFAULT_POINT_TYPES = {
  minutes: true,
  pages: true,
  books: true,
  activities: true,
  reviews: false,
}
// Shared icon for badge-list empty states (a simple award medal).
const BADGE_EMPTY_ICON = <Icon name="award" size={26} />
const stripHtml = (html) =>
  String(html || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()
// A short secondary line for an activity row (no type label — keep it clean).
const activityMeta = (a) => {
  if (a.type === 'code')
    return a.codes?.length
      ? `${a.codes.length} code${a.codes.length === 1 ? '' : 's'}`
      : ACTIVITY_TYPE_LABEL(a.type)
  return a.linkTitle || a.linkUrl || ACTIVITY_TYPE_LABEL(a.type)
}

// An activity badge = badge art + settings + a list of activities readers do to
// earn it. Streamlined into one modal with Details / Activities tabs.
function ActivityBadgeEditor({
  initial,
  editing,
  repeatable,
  extraGroups,
  defaultGroupId,
  bgImages,
  bgLabel,
  prereqOptions = [],
  onSave,
  onCancel,
}) {
  const [tab, setTab] = useState('details') // details | activities
  const [badge, setBadge] = useState(initial?.badge || null)
  const [title, setTitle] = useState(initial?.title || initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [active] = useState(initial?.active ?? true)
  const [earn, setEarn] = useState(
    initial?.earn != null && initial?.earn !== '' ? String(initial.earn) : '',
  )
  const [prereqId, setPrereqId] = useState(initial?.prereqId || '')
  const [dateRestrict, setDateRestrict] = useState(initial?.dateRestrict ?? false)
  const [dateWindow, setDateWindow] = useState(initial?.dateWindow || { start: '', end: '' })
  const [activities, setActivities] = useState(initial?.activities || [])
  const [picking, setPicking] = useState(false)
  const [actForm, setActForm] = useState(null) // {index|null, description, linkTitle, linkUrl, type}

  const valid = !!(title.trim() && badge?.img)
  const save = () =>
    onSave({
      id: initial?.id,
      name: title.trim(),
      title: title.trim(),
      description,
      badge,
      active,
      earn: earn === '' ? '' : Number(earn),
      prereqId,
      dateRestrict,
      dateWindow: dateRestrict ? dateWindow : { start: '', end: '' },
      activities,
    })

  const blankAct = {
    index: null,
    type: 'activity',
    description: '',
    linkTitle: '',
    linkUrl: '',
    codes: [],
    codeDraft: '',
  }
  const openActForm = (i) =>
    setActForm(i == null ? blankAct : { ...blankAct, index: i, ...activities[i], codeDraft: '' })
  const saveActForm = () => {
    const f = actForm
    const a = {
      type: f.type,
      description: f.description,
      linkTitle: f.linkTitle,
      linkUrl: f.linkUrl,
      codes: f.codes || [],
    }
    setActivities(
      f.index == null ? [...activities, a] : activities.map((x, idx) => (idx === f.index ? a : x)),
    )
    setActForm(null)
  }
  const addCode = () => {
    const c = (actForm.codeDraft || '').trim()
    if (!c) return
    setActForm({ ...actForm, codes: [...(actForm.codes || []), c], codeDraft: '' })
  }
  const removeCode = (i) =>
    setActForm({ ...actForm, codes: (actForm.codes || []).filter((_, idx) => idx !== i) })
  const removeAct = (i) => setActivities(activities.filter((_, idx) => idx !== i))
  const reorderAct = (from, to) => {
    const next = activities.slice()
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    setActivities(next)
  }
  const actDrag = useDragReorder(reorderAct)

  return (
    <div className="cc-badge-editor cc-ab-editor">
      <header className="cc-badge-editor-head">
        {picking ? (
          <button type="button" className="cc-badge-editor-back" onClick={() => setPicking(false)}>
            <Icon name="chevron-left" size={16} />
            Back to badge details
          </button>
        ) : (
          <h3>
            {repeatable
              ? editing
                ? 'Edit repeatable activity'
                : 'Create repeatable activity'
              : editing
                ? 'Edit activity badge'
                : 'Create activity badge'}
          </h3>
        )}
        <button
          type="button"
          className="cc-badge-editor-close"
          onClick={onCancel}
          aria-label="Close"
        >
          <Icon name="x" size={18} />
        </button>
      </header>
      <div className="cc-badge-editor-body">
        {picking ? (
          <div className="cc-badgepick-wrap">
            <BadgePicker
              extraGroups={extraGroups}
              defaultGroupId={defaultGroupId}
              bgImages={bgImages}
              bgLabel={bgLabel}
              selectedImg={badge?.img}
              editSource={badge?.source}
              editInit={badge?.edit}
              onPick={(b) => {
                setBadge(b)
                if (!title && b.name) setTitle(b.name)
                setPicking(false)
              }}
            />
          </div>
        ) : (
          <>
            <Tabs
              className="cc-ab-tabs"
              accent="#0DA7BC"
              active={tab}
              onChange={setTab}
              items={[
                { id: 'details', label: 'Details' },
                { id: 'activities', label: 'Activities', count: activities.length || undefined },
              ]}
            />
            {tab === 'details' ? (
              <div className="cc-ab-details">
                <div className="cc-ab-artcol">
                  <button
                    type="button"
                    className={`cc-badge-disc${badge?.img ? '' : ' is-empty'}`}
                    onClick={() => setPicking(true)}
                    aria-label={badge?.img ? 'Change badge' : 'Choose a badge'}
                  >
                    {badge?.img ? <img src={badge.img} alt="" /> : <Icon name="photo" size={34} />}
                    <span className="cc-badge-disc-edit" aria-hidden="true">
                      <Icon name="pencil" size={15} />
                    </span>
                  </button>
                </div>
                <div className="cc-ab-fieldscol">
                  <Field
                    label={
                      <>
                        Title <span className="cc-req">*</span>
                      </>
                    }
                    hint="Shown to readers"
                  >
                    <Input
                      value={title}
                      maxLength={80}
                      placeholder="e.g. Cupid's Arrows"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Field>
                  <Field label="Description" hint="Optional · shown to readers">
                    <RichText
                      value={description}
                      onChange={(html) => setDescription(html)}
                      minHeight={92}
                      placeholder="An overarching description (recommended when using multiple activities)."
                    />
                  </Field>
                  {repeatable ? (
                    <div className="cc-warn-note">
                      Completing repeatable activities can earn points for readers (and thus points
                      badges), but the repeatable activity badge itself can never be earned or
                      completed.
                    </div>
                  ) : (
                    <div className="cc-ab-settings">
                      <Field label="Earn after">
                        <div className="cc-ab-earn">
                          <Input
                            value={earn}
                            inputMode="numeric"
                            placeholder="All"
                            onChange={(e) => setEarn(e.target.value.replace(/[^0-9]/g, ''))}
                          />
                          <span className="cc-ab-earn-suffix">
                            {earn === '1' ? 'activity' : 'activities'}
                          </span>
                        </div>
                      </Field>
                      <Field label="Prerequisite badge">
                        <CustomSelect
                          value={prereqId || 'none'}
                          onChange={(v) => setPrereqId(v === 'none' ? '' : v)}
                          options={[{ value: 'none', label: 'No prerequisite' }, ...prereqOptions]}
                        />
                      </Field>
                    </div>
                  )}
                  <div className="cc-ab-toggle-row">
                    <div>
                      <strong>Restrict to certain dates</strong>
                      <span className="cc-ab-toggle-sub">
                        Readers can only complete activities within these dates.
                      </span>
                    </div>
                    <Toggle checked={dateRestrict} onChange={setDateRestrict} size="md">
                      {dateRestrict ? 'On' : 'Off'}
                    </Toggle>
                  </div>
                  {dateRestrict && (
                    <div className="cc-ab-dates">
                      <Field label="Start">
                        <input
                          type="date"
                          className="inp inp--md"
                          value={dateWindow.start}
                          onChange={(e) => setDateWindow({ ...dateWindow, start: e.target.value })}
                        />
                      </Field>
                      <Field label="End">
                        <input
                          type="date"
                          className="inp inp--md"
                          value={dateWindow.end}
                          onChange={(e) => setDateWindow({ ...dateWindow, end: e.target.value })}
                        />
                      </Field>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="cc-ab-activities">
                {activities.length > 0 && (
                  <div className="cc-badge-rows">
                    {activities.map((a, i) => (
                      <BadgeRow
                        key={i}
                        num={i + 1}
                        title={stripHtml(a.description) || 'Untitled activity'}
                        meta={activityMeta(a)}
                        onEdit={() => openActForm(i)}
                        onRemove={() => removeAct(i)}
                        drag={actDrag(i)}
                      />
                    ))}
                  </div>
                )}
                {actForm ? (
                  <div className="cc-ab-actform">
                    <div className="cc-ab-actform-type">
                      <Field label="Activity type">
                        <CustomSelect
                          value={actForm.type}
                          onChange={(v) => setActForm({ ...actForm, type: v })}
                          options={ACTIVITY_TYPES}
                        />
                      </Field>
                      {ACTIVITY_TYPE_HINT[actForm.type] && (
                        <p className="cc-ab-typehint">{ACTIVITY_TYPE_HINT[actForm.type]}</p>
                      )}
                    </div>
                    <Field label="Description" hint="Optional">
                      <RichText
                        value={actForm.description}
                        onChange={(html) => setActForm({ ...actForm, description: html })}
                        minHeight={80}
                        placeholder="What should the reader do?"
                      />
                    </Field>
                    {actForm.type === 'code' ? (
                      <Field label="Activity codes" hint='Press "Enter" after each code'>
                        <div className="cc-ab-codes">
                          {(actForm.codes || []).map((c, i) => (
                            <span key={i} className="cc-ab-code-chip">
                              {c}
                              <button
                                type="button"
                                onClick={() => removeCode(i)}
                                aria-label={`Remove ${c}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                          <input
                            className="cc-ab-code-input"
                            value={actForm.codeDraft}
                            placeholder="Add a code"
                            onChange={(e) => setActForm({ ...actForm, codeDraft: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addCode()
                              }
                            }}
                          />
                        </div>
                      </Field>
                    ) : ACTIVITY_FIELDS[actForm.type]?.length ? (
                      <div
                        className={
                          ACTIVITY_FIELDS[actForm.type].length > 1 ? 'cc-ab-actform-row' : ''
                        }
                      >
                        {ACTIVITY_FIELDS[actForm.type].map((f) => (
                          <Field key={f.k} label={f.label}>
                            <Input
                              value={actForm[f.k] || ''}
                              maxLength={255}
                              placeholder={f.ph}
                              onChange={(e) => setActForm({ ...actForm, [f.k]: e.target.value })}
                            />
                          </Field>
                        ))}
                      </div>
                    ) : null}
                    <div className="cc-ab-actform-foot">
                      <Button variant="secondary" size="sm" onClick={() => setActForm(null)}>
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" accent="#0DA7BC" onClick={saveActForm}>
                        {actForm.index == null ? 'Add activity' : 'Save activity'}
                      </Button>
                    </div>
                  </div>
                ) : activities.length > 0 ? (
                  <button type="button" className="cc-ab-add" onClick={() => openActForm(null)}>
                    <span className="cc-ab-add-plus">+</span> Add an activity
                  </button>
                ) : (
                  <EmptyState
                    icon={BADGE_EMPTY_ICON}
                    title="No activities yet"
                    description="Add the things readers do to earn this badge."
                    action={
                      <Button variant="secondary" size="sm" onClick={() => openActForm(null)}>
                        + Add an activity
                      </Button>
                    }
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
      {!picking && (
        <footer className="cc-badge-editor-foot">
          <Button variant="secondary" size="md" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="md" accent="#0DA7BC" disabled={!valid} onClick={save}>
            {editing ? 'Save badge' : 'Create badge'}
          </Button>
        </footer>
      )}
    </div>
  )
}

// ── Shared badge row (logging / review / activity badges) ──
function DragDots() {
  return <Icon name="grip" size={16} />
}
function EyeIcon({ off }) {
  return <Icon name={off ? 'eye-off' : 'eye'} size={17} />
}
function PencilIcon() {
  return <Icon name="pencil" size={15} />
}
// Drag-to-reorder for a list; getProps(index) spreads onto the draggable row.
function useDragReorder(onMove) {
  const from = useRef(null)
  const [dragging, setDragging] = useState(null)
  const [over, setOver] = useState(null)
  const reset = () => {
    from.current = null
    setDragging(null)
    setOver(null)
  }
  return (index) => ({
    dragging: dragging === index,
    // Show a drop indicator on the hovered row (not on the row being dragged).
    isOver: over === index && dragging != null && dragging !== index,
    // Drop below when dragging down the list, above when dragging up.
    dropBelow: dragging != null && dragging < index,
    onDragStart: (e) => {
      from.current = index
      setDragging(index)
      try {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', String(index))
      } catch {
        /* some browsers restrict dataTransfer */
      }
    },
    onDragOver: (e) => {
      e.preventDefault()
      if (over !== index) setOver(index)
    },
    onDrop: (e) => {
      e.preventDefault()
      if (from.current != null && from.current !== index) onMove(from.current, index)
      reset()
    },
    onDragEnd: reset,
  })
}
export function BadgeRow({
  num,
  img,
  icon,
  color,
  title,
  meta,
  metaMissing,
  active,
  square,
  onToggleActive,
  onEdit,
  onRemove,
  drag,
}) {
  const rowRef = useRef(null)
  const dropCls = drag?.isOver ? (drag.dropBelow ? ' is-drop-after' : ' is-drop-before') : ''
  const handleDragStart = (e) => {
    // Use the whole row as the drag image (not just the little handle).
    if (rowRef.current) {
      const r = rowRef.current.getBoundingClientRect()
      try {
        e.dataTransfer.setDragImage(rowRef.current, e.clientX - r.left, e.clientY - r.top)
      } catch {
        /* setDragImage unsupported */
      }
    }
    drag.onDragStart(e)
  }
  return (
    <div
      ref={rowRef}
      className={`cc-badgerow${active === false ? ' is-inactive' : ''}${drag?.dragging ? ' is-dragging' : ''}${dropCls}`}
      onDragOver={drag?.onDragOver}
      onDrop={drag?.onDrop}
    >
      {drag && (
        <span
          className="cc-badgerow-drag"
          draggable
          onDragStart={handleDragStart}
          onDragEnd={drag.onDragEnd}
          aria-label="Drag to reorder"
        >
          <DragDots />
        </span>
      )}
      <span className={`cc-badgerow-art${square ? ' cc-badgerow-art--square' : ''}`}>
        {num != null ? (
          <span className="cc-badgerow-num">{num}</span>
        ) : img ? (
          <img src={img} alt="" draggable={false} />
        ) : (
          <span
            className="cc-badgerow-art-ic"
            style={color ? { background: color, color: '#fff' } : undefined}
          >
            <Icon name={icon} size={20} />
          </span>
        )}
      </span>
      <div className="cc-badgerow-info">
        <strong>{title || 'Untitled badge'}</strong>
        {meta && (
          <span className={`cc-badgerow-meta${metaMissing ? ' is-missing' : ''}`}>{meta}</span>
        )}
      </div>
      <div className="cc-badgerow-actions">
        {onToggleActive && (
          <button
            type="button"
            className={`cc-badgerow-eye${active === false ? ' is-off' : ''}`}
            onClick={onToggleActive}
            aria-label={
              active === false ? 'Inactive — click to activate' : 'Active — click to deactivate'
            }
            title={active === false ? 'Inactive' : 'Active'}
          >
            <EyeIcon off={active === false} />
          </button>
        )}
        {onEdit && (
          <button type="button" className="cc-badge-edit" onClick={onEdit} aria-label="Edit badge">
            <PencilIcon />
          </button>
        )}
        {onRemove && (
          <button
            type="button"
            className="cc-row-remove"
            onClick={onRemove}
            aria-label="Remove badge"
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </div>
  )
}

const QUICK_COLORS = ['#0DA7BC', '#7C5CFA', '#E8866A', '#16A97A', '#F0C050', '#E8456B']
// Build one numbered badge from a background ({ image } or { color }) + a number.
const composeQuickBadge = (bg, num) =>
  composeBadge(bg, { type: 'number', value: String(num) }, 'Poppins')

// Quick-create a ladder of logging badges from ONE sentence: "a badge every N
// <unit>, up to M". Milestones auto-derive (N, 2N, 3N, … ≤ M); each badge shows
// its logged amount. Background = one row of swatches (images + colors).
function QuickBadgeCreator({ bgImages = [], onCreate, onCancel }) {
  const [logType, setLogType] = useState('books')
  const [increment, setIncrement] = useState(5)
  const [count, setCount] = useState(5)
  const imageOpts = (bgImages.length ? bgImages : getDefaultBgImages()).slice(0, 6)
  // Unified background: { image } or { color }.
  const [bg, setBg] = useState(imageOpts[0] ? { image: imageOpts[0] } : { color: QUICK_COLORS[0] })
  const [arts, setArts] = useState([])
  const label = LOG_TYPES.find((t) => t.value === logType)?.label || 'Books'
  const single = label.replace(/s$/, '')
  const inc = Math.max(1, increment || 1)
  // One badge per increment: inc, 2·inc, … (count of them), capped at 20.
  const n = Math.max(1, Math.min(count || 1, 20))
  const items = Array.from({ length: n }, (_, i) => {
    const goal = (i + 1) * inc
    return { goal, name: `${goal} ${goal === 1 ? single : label}` }
  })
  const numsKey = items.map((it) => it.goal).join(',')
  const bgKey = bg.image ? `i:${bg.image}` : `c:${bg.color}`
  useEffect(() => {
    let alive = true
    ;(async () => {
      const out = []
      for (const it of items) out.push(await composeQuickBadge(bg, it.goal))
      if (alive) setArts(out)
    })()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numsKey, bgKey])
  const valid = inc >= 1 && n >= 1
  const make = async () => {
    const imgs = await Promise.all(items.map((it) => composeQuickBadge(bg, it.goal)))
    onCreate(
      items.map((it, i) => ({
        name: it.name,
        goal: it.goal,
        logType,
        img: imgs[i],
        source: 'create',
        edit: {
          bgMode: bg.image ? 'image' : 'color',
          image: bg.image,
          color: bg.color || QUICK_COLORS[0],
          mode: 'number',
          num: it.goal,
          font: 'Poppins',
        },
      })),
    )
  }
  return (
    <div className="cc-badge-editor cc-quickbadge">
      <header className="cc-badge-editor-head">
        <h3>Quick-create logging badges</h3>
        <button
          type="button"
          className="cc-badge-editor-close"
          onClick={onCancel}
          aria-label="Close"
        >
          <Icon name="x" size={18} />
        </button>
      </header>
      <div className="cc-badge-editor-body cc-quick-body">
        <div className="cc-quick-rows">
          <div className="cc-quick-row">
            <span className="cc-quick-row-label">Set your badge increment</span>
            <NumberInput value={increment} min={1} max={10000} onChange={setIncrement} />
            <span className="cc-quick-unit-sel">
              <CustomSelect
                value={logType}
                onChange={setLogType}
                options={LOG_TYPES.map((t) => ({ value: t.value, label: t.label.toLowerCase() }))}
              />
            </span>
          </div>
          <div className="cc-quick-row">
            <span className="cc-quick-row-label">How many badges?</span>
            <NumberInput value={count} min={1} max={20} onChange={setCount} />
          </div>
        </div>

        <div className="cc-quick-bgrow">
          <span className="cc-quick-bglabel">Background</span>
          <div className="cc-quick-swatches">
            {imageOpts.map((src) => (
              <button
                key={src}
                type="button"
                className={`cc-quick-swatch${bg.image === src ? ' is-on' : ''}`}
                onClick={() => setBg({ image: src })}
                aria-label="Image background"
                aria-pressed={bg.image === src}
              >
                <img src={src} alt="" />
              </button>
            ))}
            <span className="cc-quick-swatch-sep" aria-hidden="true" />
            {QUICK_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`cc-quick-swatch${bg.color === c ? ' is-on' : ''}`}
                style={{ background: c }}
                onClick={() => setBg({ color: c })}
                aria-label={`Color background ${c}`}
                aria-pressed={bg.color === c}
              />
            ))}
          </div>
        </div>

        <div className="cc-quick-result">
          <div className="cc-quick-strip">
            {items.map((it, i) => (
              <span key={i} className="cc-quick-badge" title={it.name}>
                {arts[i] ? (
                  <img src={arts[i]} alt={it.name} draggable={false} />
                ) : (
                  <span className="cc-quick-badge-ph">{it.goal}</span>
                )}
              </span>
            ))}
          </div>
          <p className="cc-quick-result-note">
            {items.length > 1
              ? `${items[0].goal}–${items[items.length - 1].goal} ${label.toLowerCase()}`
              : items[0].name}
          </p>
        </div>
      </div>
      <footer className="cc-badge-editor-foot">
        <Button variant="secondary" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="md" accent="#0DA7BC" disabled={!valid} onClick={make}>
          Create {items.length} {items.length === 1 ? 'badge' : 'badges'}
        </Button>
      </footer>
    </div>
  )
}

// Searchable, paged picker of existing activity badges (Use existing / Duplicate).
function ActivityBadgePicker({ source, mode, onPick, onCancel }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const pageSize = 8
  const q = query.trim().toLowerCase()
  const filtered = q
    ? source.filter((b) => (b.title || b.name || '').toLowerCase().includes(q))
    : source
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const cur = Math.min(page, pages - 1)
  const start = cur * pageSize
  const shown = filtered.slice(start, start + pageSize)
  const setQ = (v) => {
    setQuery(v)
    setPage(0)
  }
  return (
    <div className="cc-badge-editor cc-actpicker">
      <header className="cc-badge-editor-head">
        <h3>
          {mode === 'duplicate' ? 'Duplicate an activity badge' : 'Use an existing activity badge'}
        </h3>
        <button
          type="button"
          className="cc-badge-editor-close"
          onClick={onCancel}
          aria-label="Close"
        >
          <Icon name="x" size={18} />
        </button>
      </header>
      <div className="cc-badge-editor-body">
        <SearchInput value={query} onChange={setQ} placeholder="Search badges…" />
        {shown.length ? (
          <div className="cc-actpicker-list">
            {shown.map((b) => {
              const nA = b.activities?.length || 0
              return (
                <button
                  key={b.id || b.name}
                  type="button"
                  className="cc-actpicker-item"
                  onClick={() => onPick(b)}
                >
                  <span className="cc-badgerow-art">
                    {b.badge?.img ? (
                      <img src={b.badge.img} alt="" draggable={false} />
                    ) : (
                      <span className="cc-badgerow-num">?</span>
                    )}
                  </span>
                  <span className="cc-actpicker-item-info">
                    <strong>{b.title || b.name}</strong>
                    <span>
                      {nA} {nA === 1 ? 'activity' : 'activities'}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          <EmptyState
            className="cc-actpicker-empty"
            icon={SEARCH_EMPTY_ICON}
            title="No matches"
            description={`No badges match “${query}”.`}
          />
        )}
      </div>
      <footer className="cc-badge-editor-foot cc-actpicker-foot">
        <span className="cc-actpicker-page-count">
          {filtered.length
            ? `${start + 1}–${Math.min(start + pageSize, filtered.length)} of ${filtered.length}`
            : '0 results'}
        </span>
        <div className="cc-actpicker-page-btns">
          <button
            type="button"
            disabled={cur <= 0}
            onClick={() => setPage(cur - 1)}
            aria-label="Previous page"
          >
            <Icon name="chevron-left" size={16} />
          </button>
          <button
            type="button"
            disabled={cur >= pages - 1}
            onClick={() => setPage(cur + 1)}
            aria-label="Next page"
          >
            <Icon name="chevron-right" size={16} />
          </button>
        </div>
      </footer>
    </div>
  )
}

// Three add-actions shared by the Activity-badges and Repeatable-activities panels.
function ActBadgeActions({ onUse, onDuplicate, onCreate, allowUse = true }) {
  return (
    <div className="cc-panel-actions cc-actbadge-actions">
      {allowUse && (
        <Button variant="ghost" size="sm" onClick={onUse}>
          Use existing
        </Button>
      )}
      <Button variant="ghost" size="sm" onClick={onDuplicate}>
        Duplicate
      </Button>
      <Button variant="secondary" size="sm" onClick={onCreate}>
        + Create a badge
      </Button>
    </div>
  )
}

export function BadgesStep({ challenge, role, type, update, errors = {} }) {
  const methods = challenge.methods || {}
  const badges = challenge.badges || []
  const reviewBadges = challenge.reviewBadges || []
  const activityBadges = challenge.activityBadges || []
  const repeatableActivities = challenge.repeatableActivities || []
  const pointsBadges = challenge.pointsBadges || []
  // "Logging" badges cover both generic logging and Reading List (specific titles).
  // Bingo cards are filled with both logging and activity tiles, so both badge
  // panels show regardless of the per-method toggles.
  const loggingOn =
    !!methods.log ||
    !!methods.readingList ||
    ['log', 'readingList'].includes(type?.primaryMethod) ||
    type?.id === 'bingo'
  const activitiesOn =
    !!methods.activities || type?.primaryMethod === 'activities' || type?.id === 'bingo'
  const reviewsOn = !!methods.reviews || type?.primaryMethod === 'reviews'
  const isPoints = type?.id === 'points'
  // Earnable badge types come from the challenge type: its primary method
  // (required) plus its add-ons. Points challenges also offer repeatable activities.
  // Bingo cards are filled with logging + activity badges, so those are its
  // earnable types (Logging stays the locked primary).
  const isBingo = type?.id === 'bingo'
  const primaryKey = isBingo ? 'log' : type?.primaryMethod
  const earnableTypes = [
    ...new Set(
      (isBingo
        ? ['log', 'activities']
        : [type?.primaryMethod, ...(type?.addOns || []), ...(isPoints ? ['repeatable'] : [])]
      ).filter(Boolean),
    ),
  ].map((key) => ({ key, label: METHOD_LABELS[key] || key }))
  const pointTypes = challenge.pointTypes || DEFAULT_POINT_TYPES
  const setPointType = (k, v) => update({ pointTypes: { ...pointTypes, [k]: v } })
  // Migrate older points drafts (template badges seeded as logging) into Points
  // badges once, so they stop showing "Needs a log value" under a hidden panel.
  useEffect(() => {
    if (isPoints && !loggingOn && challenge.pointsBadges == null && challenge.badges?.length) {
      update({
        pointsBadges: challenge.badges.map((b, i) => ({
          name: b.name,
          img: b.img,
          goal: (i + 1) * 50,
        })),
        badges: [],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const badgeTime = challenge.badgeTime || 'any'
  const bw = challenge.badgeWindow || { start: '', end: '' }
  const setWindow = (patch) => update({ badgeWindow: { ...bw, ...patch } })
  // Teacher/MS (simple) get a stripped-down creator: no badge-time restrictions,
  // and activity badges can only be created/duplicated (not "used from existing").
  const isSimple = role?.tier === 'simple'

  // Promote the template's badge set (or the chosen theme set) in the picker.
  const preset =
    challenge.templateId && challenge.templateId !== 'scratch'
      ? TEMPLATE_PRESETS[challenge.templateId]
      : null
  // Templates carry a fixed banner (no banner-variant id), so fall back to the
  // template's declared theme; scratch challenges resolve it from the picker.
  const badgeThemeId = preset?.theme || getBannerTheme(challenge.details?.background?.id)
  const badgeExtraGroups = preset?.badges?.length
    ? [
        {
          id: 'tpl',
          name: preset.name,
          badges: [
            ...preset.badges.map((b, i) => ({
              id: `tpl-${i}`,
              name: b.name || `${preset.name} ${i + 1}`,
              img: b.img,
            })),
            // The theme's registration + completion art is selectable too.
            ...(challenge.registrationBadge?.img
              ? [
                  {
                    id: 'tpl-reg',
                    name: challenge.registrationBadge.name || 'Registration badge',
                    img: challenge.registrationBadge.img,
                  },
                ]
              : []),
            ...(challenge.completionBadge?.img
              ? [
                  {
                    id: 'tpl-comp',
                    name: challenge.completionBadge.name || 'Completion badge',
                    img: challenge.completionBadge.img,
                  },
                ]
              : []),
          ],
        },
      ]
    : []
  const badgeDefaultGroup = badgeExtraGroups.length
    ? 'tpl'
    : badgeThemeId
      ? `theme-${badgeThemeId}`
      : undefined
  // Badge builder/upload backgrounds. A template and a theme are mutually
  // exclusive: when a template is applied, offer ITS images ("From this
  // template"); otherwise the theme's illustrative art ("From this theme").
  const badgeBgImages = preset
    ? preset.badges.map((b) => b.img).filter(Boolean)
    : themeBgImages(badgeThemeId)
  const badgeBgLabel = preset ? 'From this template' : 'From this theme'
  const [editor, setEditor] = useState(null)
  const [abEditor, setAbEditor] = useState(null) // activity badge editor: {index|null, initial}
  const [actPicker, setActPicker] = useState(null) // {repeatable, mode:'use'|'duplicate'}
  const [quickBadge, setQuickBadge] = useState(false)
  const [confirmType, setConfirmType] = useState(null)
  const setMethod = (m, val) => update({ methods: { ...methods, [m]: val } })
  const removeBadge = (i) => update({ badges: badges.filter((_, idx) => idx !== i) })
  const quickCreateBadges = (newBadges) => {
    update({ badges: [...badges, ...newBadges] })
    setQuickBadge(false)
  }
  const removeReviewBadge = (i) =>
    update({ reviewBadges: reviewBadges.filter((_, idx) => idx !== i) })
  const removePointsBadge = (i) =>
    update({ pointsBadges: pointsBadges.filter((_, idx) => idx !== i) })
  // ── Activity badges (and repeatable activities — same editor, separate list) ──
  const saveActivityBadge = (ab) => {
    const key = abEditor?.repeatable ? 'repeatableActivities' : 'activityBadges'
    const list = abEditor?.repeatable ? repeatableActivities : activityBadges
    const withId = ab.id ? ab : { ...ab, id: `ab-${Date.now()}` }
    if (abEditor?.index != null)
      update({ [key]: list.map((x, idx) => (idx === abEditor.index ? withId : x)) })
    else update({ [key]: [...list, withId] })
    setAbEditor(null)
  }
  const removeActivityBadge = (i) =>
    update({ activityBadges: activityBadges.filter((_, idx) => idx !== i) })
  const toggleActivityBadgeActive = (i) =>
    update({
      activityBadges: activityBadges.map((ab, idx) =>
        idx === i ? { ...ab, active: ab.active === false ? true : false } : ab,
      ),
    })
  const reorderActivityBadge = (from, to) => {
    const next = activityBadges.slice()
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    update({ activityBadges: next })
  }
  const abDrag = useDragReorder(reorderActivityBadge)
  const removeRepeatable = (i) =>
    update({ repeatableActivities: repeatableActivities.filter((_, idx) => idx !== i) })
  const toggleRepeatableActive = (i) =>
    update({
      repeatableActivities: repeatableActivities.map((ab, idx) =>
        idx === i ? { ...ab, active: ab.active === false ? true : false } : ab,
      ),
    })
  const reorderRepeatable = (from, to) => {
    const next = repeatableActivities.slice()
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    update({ repeatableActivities: next })
  }
  const rptDrag = useDragReorder(reorderRepeatable)
  // Existing activity badges to Use/Duplicate — this challenge's own badges plus
  // a small mock library, de-duped by id/name.
  const existingActivityBadges = useMemo(() => {
    const seen = new Set()
    const out = []
    for (const b of [...activityBadges, ...repeatableActivities, ...EXISTING_ACTIVITY_BADGES]) {
      const key = b.id || b.name
      if (!key || seen.has(key)) continue
      seen.add(key)
      out.push(b)
    }
    return out
  }, [activityBadges, repeatableActivities])
  const pickExisting = (src) => {
    const { repeatable, mode } = actPicker || {}
    const name = src.title || src.name || 'Untitled badge'
    const activities = (src.activities || []).map((a) => ({ ...a }))
    if (mode === 'duplicate') {
      setActPicker(null)
      setAbEditor({
        index: null,
        repeatable,
        initial: {
          ...src,
          id: undefined,
          name: `${name} (copy)`,
          title: `${name} (copy)`,
          activities,
        },
      })
    } else {
      const copy = { ...src, id: `ab-${Date.now()}`, activities }
      const key = repeatable ? 'repeatableActivities' : 'activityBadges'
      const list = repeatable ? repeatableActivities : activityBadges
      update({ [key]: [...list, copy] })
      setActPicker(null)
    }
  }
  // Save a badge from the editor into the right slot (or update one in place).
  const saveBadge = (badge) => {
    if (editor?.target === 'registration') update({ registrationBadge: badge })
    else if (editor?.target === 'completion') update({ completionBadge: badge })
    else if (editor?.target === 'bingo') update({ bingoBadge: badge })
    else if (editor?.target === 'fullCard') update({ fullCardBadge: badge })
    else if (editor?.target === 'review') {
      if (editor.index != null)
        update({ reviewBadges: reviewBadges.map((b, idx) => (idx === editor.index ? badge : b)) })
      else update({ reviewBadges: [...reviewBadges, badge] })
    } else if (editor?.target === 'points') {
      if (editor.index != null)
        update({ pointsBadges: pointsBadges.map((b, idx) => (idx === editor.index ? badge : b)) })
      else update({ pointsBadges: [...pointsBadges, badge] })
    } else if (editor?.index != null)
      update({ badges: badges.map((b, idx) => (idx === editor.index ? badge : b)) })
    else update({ badges: [...badges, badge] })
    setEditor(null)
  }

  const pinnedBadge = (slot) =>
    ({
      registration: challenge.registrationBadge,
      completion: challenge.completionBadge,
      bingo: challenge.bingoBadge,
      fullCard: challenge.fullCardBadge,
    })[slot]
  const PinSlot = ({ slot, label }) => {
    const b = pinnedBadge(slot)
    const open = () =>
      setEditor({ title: `Select ${label.toLowerCase()}`, target: slot, initial: b })
    if (!b?.img) {
      return (
        <button type="button" className="cc-badge-pin" onClick={open}>
          <span className="cc-badge-pin-add">+</span>
          <span className="cc-badge-pin-name">Select a badge</span>
        </button>
      )
    }
    return <BadgeRow img={b.img} title={b.name} onEdit={open} />
  }

  return (
    <section className="cc-step">
      <StepHead
        title="Badges & activities"
        sub="Choose how readers earn, then add the badges they'll collect."
        icon={STEP_ICONS.badges}
      />

      <div className="cc-panel">
        <h3 className="cc-panel-title">Earnable badge types</h3>
        <div className="cc-settings">
          {earnableTypes.map((t) => {
            const isPrimary = t.key === primaryKey
            const on = isPrimary || !!methods[t.key]
            return (
              <div key={t.key} className={`cc-setting-row${isPrimary ? ' is-disabled' : ''}`}>
                <span className="cc-setting-label">{t.label}</span>
                <div className="cc-type-state">
                  {isPrimary && <span className="cc-reg-state">Required</span>}
                  <Toggle
                    checked={on}
                    size="md"
                    disabled={isPrimary}
                    onChange={(v) => (v ? setMethod(t.key, true) : setConfirmType(t))}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {isPoints && (
        <div className="cc-panel">
          <h3 className="cc-panel-title">Earnable point types</h3>
          <div className="cc-warn-note">
            If you turn off one of the types below, points will no longer be awarded for it.
          </div>
          <div className="cc-settings">
            {POINT_TYPES.map((pt) => {
              const on = pointTypes[pt.key] !== false
              return (
                <div key={pt.key} className="cc-setting-row">
                  <span className="cc-setting-label">{pt.label}</span>
                  <div className="cc-type-state">
                    <Toggle checked={on} size="md" onChange={(v) => setPointType(pt.key, v)} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!isBingo && !isSimple && (
        <div className="cc-panel">
          <h3 className="cc-panel-title">Badge time restrictions</h3>
          <div className="cc-settings">
            <div className="cc-setting-row">
              <div className="cc-setting-text">
                <span className="cc-setting-label">Restrict when badges can be earned</span>
                <span className="cc-setting-sub">
                  By default badges can be earned any time within the challenge dates.
                </span>
              </div>
              <Toggle
                checked={badgeTime === 'restricted'}
                size="md"
                onChange={(v) =>
                  update(
                    v
                      ? {
                          badgeTime: 'restricted',
                          // Default the window to the challenge dates so it never
                          // opens in an empty/error state.
                          badgeWindow: {
                            start: bw.start || challenge.details?.start || '',
                            end: bw.end || challenge.details?.end || '',
                          },
                        }
                      : { badgeTime: 'any' },
                  )
                }
              />
            </div>
            {badgeTime === 'restricted' && (
              <div className="cc-badge-window-wrap">
                <div
                  className={`cc-date-row cc-badge-window${errors.badgeWindow ? ' has-error' : ''}`}
                >
                  <Field label="Badges can be earned from…">
                    <DateInput
                      value={bw.start}
                      onChange={(e) => setWindow({ start: e.target.value })}
                    />
                  </Field>
                  <Field label="Until…">
                    <DateInput
                      value={bw.end}
                      onChange={(e) => setWindow({ end: e.target.value })}
                    />
                  </Field>
                </div>
                {errors.badgeWindow && <p className="cc-badge-reqnote">{errors.badgeWindow}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="cc-panel">
        <h3 className="cc-panel-title">Registration badge</h3>
        <PinSlot slot="registration" label="Registration badge" />
      </div>

      {isBingo ? (
        <>
          <div className="cc-panel">
            <h3 className="cc-panel-title">Bingo badge</h3>
            <PinSlot slot="bingo" label="Bingo badge" />
          </div>
          <div className="cc-panel">
            <h3 className="cc-panel-title">Full-card badge</h3>
            <PinSlot slot="fullCard" label="Full-card badge" />
          </div>
        </>
      ) : (
        <div className="cc-panel">
          <h3 className="cc-panel-title">Completion badge</h3>
          <PinSlot slot="completion" label="Completion badge" />
        </div>
      )}

      {isPoints && (
        <div className="cc-panel">
          <div className="cc-panel-head">
            <h3 className="cc-panel-title">Points badges</h3>
            <div className="cc-panel-actions">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditor({ title: 'Add a points badge', target: 'points' })}
              >
                + Add badge
              </Button>
            </div>
          </div>
          {pointsBadges.length > 0 ? (
            <div className="cc-badge-rows">
              {pointsBadges
                .map((b, i) => ({ b, i }))
                .sort((a, z) => (a.b.goal ?? Infinity) - (z.b.goal ?? Infinity))
                .map(({ b, i }) => (
                  <BadgeRow
                    key={i}
                    img={b.img || badgeImage(b.icon)}
                    icon={b.icon}
                    color={b.color}
                    title={b.name}
                    meta={b.goal ? `Earn ${b.goal} points` : 'Needs a points value'}
                    metaMissing={!b.goal}
                    onEdit={() =>
                      setEditor({
                        title: 'Edit points badge',
                        target: 'points',
                        index: i,
                        initial: b,
                      })
                    }
                    onRemove={() => removePointsBadge(i)}
                  />
                ))}
            </div>
          ) : (
            <EmptyState
              icon={BADGE_EMPTY_ICON}
              title="No points badges yet"
              description="Add badges readers earn as they rack up points."
            />
          )}
        </div>
      )}

      {loggingOn && (
        <div className="cc-panel">
          <div className="cc-panel-head">
            <h3 className="cc-panel-title">Logging badges</h3>
            <div className="cc-panel-actions">
              <Button variant="ghost" size="sm" onClick={() => setQuickBadge(true)}>
                ⚡ Quick-create
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditor({ title: 'Add a badge', target: 'milestone' })}
              >
                + Add badge
              </Button>
            </div>
          </div>
          {type?.primaryMethod === 'readingList' && (
            <Banner level="info" className="cc-panel-banner">
              Readers enrolled in a Reading List challenge will earn logging badges only for reading
              the specific titles added to your Reading List.
            </Banner>
          )}
          {errors.badges && <p className="cc-badge-reqnote">{errors.badges}</p>}
          {badges.length > 0 ? (
            <div className="cc-badge-rows">
              {badges
                // Show in increasing order of the logging requirement (goal);
                // badges without a goal sort to the end. Keep the original index
                // so edit/remove still target the right badge.
                .map((b, i) => ({ b, i }))
                .sort((a, z) => (a.b.goal ?? Infinity) - (z.b.goal ?? Infinity))
                .map(({ b, i }) => (
                  <BadgeRow
                    key={i}
                    img={b.img || badgeImage(b.icon)}
                    icon={b.icon}
                    color={b.color}
                    title={b.name}
                    meta={
                      b.goal && b.logType
                        ? `Log ${b.goal} ${b.goal === 1 ? b.logType.replace(/s$/, '') : b.logType}`
                        : 'Needs a log value'
                    }
                    metaMissing={!(b.goal && b.logType)}
                    onEdit={() =>
                      setEditor({ title: 'Edit badge', target: 'milestone', index: i, initial: b })
                    }
                    onRemove={() => removeBadge(i)}
                  />
                ))}
            </div>
          ) : (
            <EmptyState
              icon={BADGE_EMPTY_ICON}
              title="No badges yet"
              description="Add the badges readers will earn as they read."
            />
          )}
        </div>
      )}

      {activitiesOn && (
        <div className="cc-panel">
          <div className="cc-panel-head">
            <h3 className="cc-panel-title">Activity badges</h3>
            <ActBadgeActions
              allowUse={!isSimple}
              onUse={() => setActPicker({ repeatable: false, mode: 'use' })}
              onDuplicate={() => setActPicker({ repeatable: false, mode: 'duplicate' })}
              onCreate={() => setAbEditor({ index: null })}
            />
          </div>
          {activityBadges.length ? (
            <div className="cc-badge-rows">
              {activityBadges.map((ab, i) => {
                const count = ab.earn || ab.activities?.length || 0
                return (
                  <BadgeRow
                    key={ab.id || i}
                    img={ab.badge?.img}
                    title={ab.title || ab.name}
                    meta={`Complete ${count} ${count === 1 ? 'activity' : 'activities'}`}
                    active={ab.active}
                    onToggleActive={() => toggleActivityBadgeActive(i)}
                    onEdit={() => setAbEditor({ index: i, initial: ab })}
                    onRemove={() => removeActivityBadge(i)}
                    drag={abDrag(i)}
                  />
                )
              })}
            </div>
          ) : (
            <EmptyState
              icon={BADGE_EMPTY_ICON}
              title="No activity badges yet"
              description="Create one to add activities readers complete to earn it."
            />
          )}
        </div>
      )}

      {isPoints && !!methods.repeatable && (
        <div className="cc-panel">
          <div className="cc-panel-head">
            <h3 className="cc-panel-title">Repeatable activities</h3>
            <ActBadgeActions
              allowUse={!isSimple}
              onUse={() => setActPicker({ repeatable: true, mode: 'use' })}
              onDuplicate={() => setActPicker({ repeatable: true, mode: 'duplicate' })}
              onCreate={() => setAbEditor({ index: null, repeatable: true })}
            />
          </div>
          <div className="cc-warn-note">
            Completing repeatable activities earns points (and thus points badges), but the
            repeatable activity badges themselves can never be earned or completed.
          </div>
          {repeatableActivities.length ? (
            <div className="cc-badge-rows">
              {repeatableActivities.map((ab, i) => {
                const n = ab.activities?.length || 0
                return (
                  <BadgeRow
                    key={ab.id || i}
                    img={ab.badge?.img}
                    title={ab.title || ab.name}
                    meta={`${n} repeatable ${n === 1 ? 'activity' : 'activities'}`}
                    active={ab.active}
                    onToggleActive={() => toggleRepeatableActive(i)}
                    onEdit={() => setAbEditor({ index: i, initial: ab, repeatable: true })}
                    onRemove={() => removeRepeatable(i)}
                    drag={rptDrag(i)}
                  />
                )
              })}
            </div>
          ) : (
            <EmptyState
              icon={BADGE_EMPTY_ICON}
              title="No repeatable activities yet"
              description="Create one readers can complete again and again for points."
            />
          )}
        </div>
      )}

      {reviewsOn && (
        <div className="cc-panel">
          <div className="cc-panel-head">
            <h3 className="cc-panel-title">Review badges</h3>
            <div className="cc-panel-actions">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditor({ title: 'Add a review badge', target: 'review' })}
              >
                + Add review badge
              </Button>
            </div>
          </div>
          {reviewBadges.length > 0 ? (
            <div className="cc-badge-rows">
              {reviewBadges
                .map((b, i) => ({ b, i }))
                .sort((a, z) => (a.b.goal ?? Infinity) - (z.b.goal ?? Infinity))
                .map(({ b, i }) => (
                  <BadgeRow
                    key={i}
                    img={b.img || badgeImage(b.icon)}
                    icon={b.icon}
                    color={b.color}
                    title={b.name}
                    meta={
                      b.goal
                        ? `Write ${b.goal} ${b.goal === 1 ? 'review' : 'reviews'}`
                        : 'Needs a review goal'
                    }
                    metaMissing={!b.goal}
                    onEdit={() =>
                      setEditor({
                        title: 'Edit review badge',
                        target: 'review',
                        index: i,
                        initial: b,
                      })
                    }
                    onRemove={() => removeReviewBadge(i)}
                  />
                ))}
            </div>
          ) : (
            <EmptyState
              icon={BADGE_EMPTY_ICON}
              title="No review badges yet"
              description="Add badges readers earn for writing reviews."
            />
          )}
        </div>
      )}

      <Modal
        open={quickBadge}
        onClose={() => setQuickBadge(false)}
        variant="center"
        ariaLabel="Quick badge creator"
      >
        {quickBadge && (
          <QuickBadgeCreator
            bgImages={badgeBgImages}
            onCreate={quickCreateBadges}
            onCancel={() => setQuickBadge(false)}
          />
        )}
      </Modal>

      <Modal
        open={!!actPicker}
        onClose={() => setActPicker(null)}
        variant="center"
        ariaLabel="Choose an activity badge"
      >
        {actPicker && (
          <ActivityBadgePicker
            source={existingActivityBadges}
            mode={actPicker.mode}
            onPick={pickExisting}
            onCancel={() => setActPicker(null)}
          />
        )}
      </Modal>

      <Modal
        open={!!abEditor}
        onClose={() => setAbEditor(null)}
        variant="center"
        ariaLabel="Activity badge editor"
      >
        {abEditor && (
          <ActivityBadgeEditor
            initial={abEditor.initial}
            editing={abEditor.index != null}
            repeatable={abEditor.repeatable}
            extraGroups={badgeExtraGroups}
            defaultGroupId={badgeDefaultGroup}
            bgImages={badgeBgImages}
            bgLabel={badgeBgLabel}
            prereqOptions={activityBadges
              .filter((_, idx) => abEditor.repeatable || idx !== abEditor.index)
              .map((ab) => ({ value: ab.id, label: ab.title || ab.name || 'Untitled badge' }))}
            onSave={saveActivityBadge}
            onCancel={() => setAbEditor(null)}
          />
        )}
      </Modal>

      <Modal
        open={!!editor}
        onClose={() => setEditor(null)}
        variant="center"
        ariaLabel="Badge editor"
      >
        {editor && (
          <BadgeEditor
            title={editor.title}
            initial={editor.initial}
            goalMode={
              editor.target === 'milestone'
                ? 'log'
                : editor.target === 'review'
                  ? 'reviews'
                  : editor.target === 'points'
                    ? 'points'
                    : undefined
            }
            editing={
              editor.index != null ||
              ['registration', 'completion', 'bingo', 'fullCard'].includes(editor.target)
            }
            extraGroups={badgeExtraGroups}
            defaultGroupId={badgeDefaultGroup}
            bgImages={badgeBgImages}
            bgLabel={badgeBgLabel}
            onSave={saveBadge}
            onCancel={() => setEditor(null)}
          />
        )}
      </Modal>

      <Modal
        open={!!confirmType}
        onClose={() => setConfirmType(null)}
        variant="center"
        ariaLabel="Remove badge type"
      >
        {confirmType && (
          <div className="cc-confirm">
            <h3>Remove “{confirmType.label}”?</h3>
            <p>
              All badges associated with {confirmType.label.toLowerCase()} will be removed from this
              challenge. This can’t be undone.
            </p>
            <div className="cc-confirm-actions">
              <Button variant="secondary" onClick={() => setConfirmType(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setMethod(confirmType.key, false)
                  setConfirmType(null)
                }}
              >
                Remove type
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}

// ─── Step 5 · Rewards (rewards / ticket rewards / certificates / drawings) ────
let _rid = 0
const newRewardId = (p) => `${p}-${Date.now()}-${_rid++}`
// Mock "saved rewards" library for the Use-existing picker.
const SAVED_REWARDS = [
  { id: 'sr-1', title: 'Free Book', description: 'Pick any book from the prize cart to keep.' },
  {
    id: 'sr-2',
    title: 'Bookstore Gift Card',
    description: 'A $10 gift card to the local bookstore.',
  },
  { id: 'sr-3', title: 'Extra Recess', description: '15 minutes of extra recess or free time.' },
  {
    id: 'sr-4',
    title: 'Lunch with the Librarian',
    description: 'A special lunch with the school librarian.',
  },
  {
    id: 'sr-5',
    title: 'Collectible Bookmark Set',
    description: 'A set of collectible reading bookmarks.',
  },
  { id: 'sr-6', title: 'Homework Pass', description: 'Skip one homework assignment.' },
]
const CERT_TAGS = [
  '{{first_name}}',
  '{{last_name}}',
  '{{earned_badge_title}}',
  '{{microsite_name}}',
  '{{challenge_name}}',
  '{{date}}',
]
const CERT_EXAMPLE =
  'This certificate is proudly presented to {{first_name}} for earning the {{earned_badge_title}} during {{microsite_name}} Summer Reading challenge.'

const REWARD_EMPTY_ICON = <Icon name="gift" size={26} />
const TICKET_EMPTY_ICON = <Icon name="ticket" size={26} />
const CERT_EMPTY_ICON = <Icon name="certificate" size={26} />

// Reward — a simple title + description prize, assigned to the badge(s) that grant it.
function RewardEditor({ initial, badges = [], usedBadgeIds = [], onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [badgeIds, setBadgeIds] = useState(initial?.badgeIds || [])
  return (
    <div className="cc-badge-editor cc-reward-editor">
      <header className="cc-badge-editor-head">
        <h3>{initial ? 'Edit reward' : 'Create reward'}</h3>
        <button
          type="button"
          className="cc-badge-editor-close"
          onClick={onCancel}
          aria-label="Close"
        >
          <Icon name="x" size={18} />
        </button>
      </header>
      <div className="cc-badge-editor-body cc-reward-form">
        <Field
          label={
            <>
              Title <span className="cc-req">*</span>
            </>
          }
        >
          <Input
            value={title}
            maxLength={80}
            placeholder="e.g. Free Book"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <Field label="Description" hint="Optional · shown to readers">
          <RichText
            value={description}
            onChange={(html) => setDescription(html)}
            minHeight={90}
            placeholder="What the reader gets…"
          />
        </Field>
        <Field label="Earned by badge">
          <BadgeMultiSelect
            badges={badges}
            value={badgeIds}
            onChange={setBadgeIds}
            disabledIds={usedBadgeIds}
            emptyHint="Add badges on the Badges step, then assign this reward to them."
          />
        </Field>
      </div>
      <footer className="cc-badge-editor-foot">
        <Button variant="secondary" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          accent="#0DA7BC"
          disabled={!title.trim()}
          onClick={() => onSave({ id: initial?.id, title: title.trim(), description, badgeIds })}
        >
          {initial ? 'Save reward' : 'Add reward'}
        </Button>
      </footer>
    </div>
  )
}
// Pick from the saved-rewards library.
// Mock saved certificates for the certificate Use-existing picker.
const SAVED_CERTIFICATES = [
  {
    id: 'sc-1',
    title: 'Completion Certificate',
    bannerTitle: 'Certificate of Completion',
    description: 'Awarded for finishing the challenge.',
    body: 'This certificate is proudly presented to {{first_name}} for completing the {{challenge_name}} at {{microsite_name}}.',
  },
  {
    id: 'sc-2',
    title: 'Participation Certificate',
    bannerTitle: 'Certificate of Participation',
    description: 'For taking part in the challenge.',
    body: 'This certificate recognizes {{first_name}} for participating in {{microsite_name}}’s reading challenge.',
  },
  {
    id: 'sc-3',
    title: 'Reading Star Award',
    bannerTitle: 'Reading Star',
    description: 'For outstanding reading effort.',
    body: 'Awarded to {{first_name}} for outstanding reading during {{challenge_name}}.',
  },
]
// Mock saved ticket rewards for the ticket Use-existing picker.
const SAVED_TICKET_REWARDS = [
  { id: 'stk-1', name: 'Pizza Party', description: 'A class pizza party.', cost: 50 },
  { id: 'stk-2', name: 'Movie Afternoon', description: 'A movie & popcorn afternoon.', cost: 40 },
  { id: 'stk-3', name: 'Book Bundle', description: 'A bundle of three new books.', cost: 30 },
  {
    id: 'stk-4',
    name: 'Reading Gift Basket',
    description: 'A cozy reading gift basket.',
    cost: 60,
  },
]
// How tickets are earned — single-select option cards.
const TICKET_SOURCES = [
  {
    value: 'all',
    icon: 'medal',
    label: 'All badges',
    sub: 'Every badge awards the same number of tickets.',
  },
  {
    value: 'specific',
    icon: 'list',
    label: 'Specific badges',
    sub: 'Pick which badges award tickets, and how many.',
  },
  {
    value: 'none',
    icon: 'pencil',
    label: 'Awarded manually',
    sub: 'Badges don’t award tickets — you grant them yourself.',
  },
]
// Shared "use a saved …" picker — multi-select list of saved items.
// items: [{ id, key, image?, icon?, title, subtitle }].
function SavedItemPicker({
  title,
  noun = 'item',
  items,
  existingKeys,
  onAdd,
  onCancel,
  badges,
  disabledBadgeIds = [],
  disabledBadgeHint = 'Already used',
}) {
  const [picked, setPicked] = useState([])
  const [badgeIds, setBadgeIds] = useState([])
  const [step, setStep] = useState('pick')
  const wantsBadges = !!(badges && badges.length)
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const toggleBadge = (id) =>
    setBadgeIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const nounLabel = picked.length === 1 ? noun : `${noun}s`
  const finish = () => {
    onAdd(
      items.filter((i) => picked.includes(i.id)),
      badgeIds,
    )
    onCancel()
  }
  return (
    <div className="cc-badge-editor cc-reward-picker">
      <header className="cc-badge-editor-head">
        <h3>{step === 'badges' ? 'Earned by badge' : title}</h3>
        <button
          type="button"
          className="cc-badge-editor-close"
          onClick={onCancel}
          aria-label="Close"
        >
          <Icon name="x" size={18} />
        </button>
      </header>
      <div className="cc-badge-editor-body">
        {step === 'pick' ? (
          <ul className="cc-savedreward-list">
            {items.map((it) => {
              const added = existingKeys.has(it.key)
              const sel = picked.includes(it.id)
              return (
                <li key={it.id}>
                  <button
                    type="button"
                    className={`cc-savedreward${sel ? ' is-selected' : ''}`}
                    disabled={added}
                    onClick={() => toggle(it.id)}
                    aria-pressed={sel}
                  >
                    <span className="cc-tm-check" aria-hidden="true" />
                    {it.image !== undefined && (
                      <span className="cc-savedreward-art">
                        {it.image ? (
                          <img src={it.image} alt="" />
                        ) : (
                          <Ic name={it.icon || 'ti-gift'} size={20} />
                        )}
                      </span>
                    )}
                    <span className="cc-savedreward-info">
                      <strong>{it.title}</strong>
                      <span>{it.subtitle}</span>
                    </span>
                    {added && <span className="cc-tm-addedtag">Added</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <>
            <p className="cc-method-note cc-method-note--sm">
              Choose which badge(s) earn the {picked.length} selected {nounLabel}.
            </p>
            <BadgeSelect
              badges={badges}
              selectedIds={badgeIds}
              onToggle={toggleBadge}
              disabledIds={disabledBadgeIds}
              disabledHint={disabledBadgeHint}
            />
          </>
        )}
      </div>
      <footer className="cc-badge-editor-foot">
        {step === 'badges' && (
          <Button variant="secondary" size="md" onClick={() => setStep('pick')}>
            Back
          </Button>
        )}
        {step === 'pick' && wantsBadges ? (
          <Button
            variant="primary"
            size="md"
            accent="#0DA7BC"
            disabled={!picked.length}
            onClick={() => setStep('badges')}
          >
            Continue
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            accent="#0DA7BC"
            disabled={!picked.length}
            onClick={finish}
          >
            Add {picked.length || ''} {nounLabel}
          </Button>
        )}
      </footer>
    </div>
  )
}
// Ticket reward — image + name + description + tickets-to-enter.
function TicketRewardEditor({ initial, onSave, onCancel }) {
  const [image, setImage] = useState(initial?.image || null)
  const [imageName, setImageName] = useState(initial?.imageName || '')
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [cost, setCost] = useState(initial?.cost ?? 10)
  const onFile = (fn) => {
    setImageName(fn)
    setLoading(true)
    setTimeout(() => {
      setImage(FAKE_UPLOAD_IMG)
      setLoading(false)
    }, 900)
  }
  return (
    <div className="cc-badge-editor cc-ticket-editor">
      <header className="cc-badge-editor-head">
        <h3>{initial ? 'Edit ticket reward' : 'Add ticket reward'}</h3>
        <button
          type="button"
          className="cc-badge-editor-close"
          onClick={onCancel}
          aria-label="Close"
        >
          <Icon name="x" size={18} />
        </button>
      </header>
      <div className="cc-badge-editor-body cc-reward-form">
        <Field
          label="Image"
          hint="Optional"
          help="If left blank, a gift icon is shown. Recommended square · png, jpg."
        >
          <ImageDropzone
            fileName={imageName}
            previewSrc={loading ? undefined : image}
            onFile={onFile}
          />
        </Field>
        <Field
          label={
            <>
              Name <span className="cc-req">*</span>
            </>
          }
        >
          <Input
            value={name}
            maxLength={80}
            placeholder="e.g. Pizza Party"
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="Description" hint="Optional">
          <Textarea
            value={description}
            rows={3}
            placeholder="Describe the prize…"
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Field
          label={
            <>
              Tickets to enter <span className="cc-req">*</span>
            </>
          }
          className="cc-narrow-field"
        >
          <NumberInput value={cost} min={1} max={1000} onChange={setCost} />
        </Field>
      </div>
      <footer className="cc-badge-editor-foot">
        <Button variant="secondary" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          accent="#0DA7BC"
          disabled={!name.trim() || !(cost >= 1)}
          onClick={() =>
            onSave({
              id: initial?.id,
              image,
              imageName,
              name: name.trim(),
              description,
              cost: Number(cost),
            })
          }
        >
          {initial ? 'Save ticket reward' : 'Add ticket reward'}
        </Button>
      </footer>
    </div>
  )
}
// Certificate — printable, with merge tags.
function CertificateEditor({ initial, badges = [], onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [bannerTitle, setBannerTitle] = useState(
    initial?.bannerTitle || 'Certificate of Achievement',
  )
  const [description, setDescription] = useState(initial?.description || '')
  const [body, setBody] = useState(initial?.body || CERT_EXAMPLE)
  const [badgeIds, setBadgeIds] = useState(initial?.badgeIds || [])
  return (
    <div className="cc-badge-editor cc-cert-editor">
      <header className="cc-badge-editor-head">
        <h3>{initial ? 'Edit certificate' : 'Create certificate'}</h3>
        <button
          type="button"
          className="cc-badge-editor-close"
          onClick={onCancel}
          aria-label="Close"
        >
          <Icon name="x" size={18} />
        </button>
      </header>
      <div className="cc-badge-editor-body cc-reward-form">
        <Field
          label={
            <>
              Title <span className="cc-req">*</span>
            </>
          }
          hint="Internal name"
        >
          <Input
            value={title}
            maxLength={80}
            placeholder="e.g. Summer Reading Certificate"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <Field label="Title in banner" hint="Shown across the top of the certificate">
          <Input
            value={bannerTitle}
            maxLength={80}
            placeholder="e.g. Certificate of Achievement"
            onChange={(e) => setBannerTitle(e.target.value)}
          />
        </Field>
        <Field label="Description" hint="Optional">
          <Textarea
            value={description}
            rows={2}
            placeholder="Optional summary…"
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Field label="Earned by badge">
          <BadgeMultiSelect
            badges={badges}
            value={badgeIds}
            onChange={setBadgeIds}
            emptyHint="Add badges on the Badges step, then assign this certificate to them."
          />
        </Field>
        <Field label="Certificate body">
          <RichText
            value={body}
            onChange={setBody}
            tokens={CERT_TAGS}
            minHeight={120}
            placeholder="Write the certificate text…"
          />
        </Field>
      </div>
      <footer className="cc-badge-editor-foot">
        <Button variant="secondary" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          accent="#0DA7BC"
          disabled={!title.trim()}
          onClick={() =>
            onSave({
              id: initial?.id,
              title: title.trim(),
              bannerTitle,
              description,
              body,
              badgeIds,
            })
          }
        >
          {initial ? 'Save certificate' : 'Add certificate'}
        </Button>
      </footer>
    </div>
  )
}

export function RewardsStep({ challenge, update }) {
  const r = challenge.rewards || {}
  const items = r.items || []
  const ticketsEnabled = !!r.ticketsEnabled
  const certsEnabled = !!r.certsEnabled
  const ticketSource = r.ticketSource || 'all'
  const ticketsPerBadge = r.ticketsPerBadge ?? 1
  const ticketBadges = r.ticketBadges || {}
  const ticketRewards = r.ticketRewards || []
  const certificates = r.certificates || []
  const setR = (patch) => update({ rewards: { ...r, ...patch } })

  const [rewardEditor, setRewardEditor] = useState(null)
  const [rewardPicker, setRewardPicker] = useState(false)
  const [ticketPicker, setTicketPicker] = useState(false)
  const [certPicker, setCertPicker] = useState(false)
  const [ticketEditor, setTicketEditor] = useState(null)
  const [certEditor, setCertEditor] = useState(null)

  // Every badge in the challenge, for the "specific badges earn tickets" picker.
  const badgePool = badgePoolOf(challenge, { includeRegComp: true })
  const badgeById = Object.fromEntries(badgePool.map((b) => [b.id, b]))
  const assignedBadges = (ids) => (ids || []).map((id) => badgeById[id]).filter(Boolean)

  const saveReward = (rw) => {
    setR({
      items: rw.id
        ? items.map((x) => (x.id === rw.id ? { ...x, ...rw } : x))
        : [...items, { ...rw, id: newRewardId('rw'), source: 'custom' }],
    })
    setRewardEditor(null)
  }
  const addSavedRewards = (rws, badgeIds = []) =>
    setR({
      items: [
        ...items,
        ...rws.map((x) => ({
          id: newRewardId('rw'),
          title: x.title,
          description: x.description,
          badgeIds,
          source: 'saved',
        })),
      ],
    })
  const removeReward = (id) => setR({ items: items.filter((x) => x.id !== id) })

  const saveTicket = (t) => {
    setR({
      ticketRewards: t.id
        ? ticketRewards.map((x) => (x.id === t.id ? { ...x, ...t } : x))
        : [...ticketRewards, { ...t, id: newRewardId('tr') }],
    })
    setTicketEditor(null)
  }
  const removeTicket = (id) => setR({ ticketRewards: ticketRewards.filter((x) => x.id !== id) })
  const addSavedTickets = (ts) =>
    setR({
      ticketRewards: [
        ...ticketRewards,
        ...ts.map((t) => ({
          id: newRewardId('tr'),
          name: t.title,
          description: t.description,
          cost: t.cost,
          image: null,
        })),
      ],
    })
  const toggleTicketBadge = (id) => {
    const next = { ...ticketBadges }
    if (id in next) delete next[id]
    else next[id] = 1
    setR({ ticketBadges: next })
  }
  const setTicketBadgeValue = (id, v) => setR({ ticketBadges: { ...ticketBadges, [id]: v } })

  const saveCert = (c) => {
    setR({
      certificates: c.id
        ? certificates.map((x) => (x.id === c.id ? { ...x, ...c } : x))
        : [...certificates, { ...c, id: newRewardId('ct') }],
    })
    setCertEditor(null)
  }
  const removeCert = (id) => setR({ certificates: certificates.filter((x) => x.id !== id) })
  const addSavedCerts = (cs, badgeIds = []) =>
    setR({
      certificates: [
        ...certificates,
        ...cs.map((c) => ({
          id: newRewardId('ct'),
          title: c.title,
          bannerTitle: c.bannerTitle,
          description: c.description,
          body: c.body,
          badgeIds,
        })),
      ],
    })

  return (
    <section className="cc-step">
      <StepHead
        title="Rewards"
        sub="Set up the prizes, tickets, and certificates readers can earn."
        icon={STEP_ICONS.prizes}
      />

      {/* 1 · Rewards */}
      <div className="cc-panel">
        <div className="cc-panel-head">
          <h3 className="cc-panel-title">Rewards</h3>
          <div className="cc-panel-actions">
            <Button variant="ghost" size="sm" onClick={() => setRewardPicker(true)}>
              Use existing
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setRewardEditor({ new: true })}>
              + Create reward
            </Button>
          </div>
        </div>
        {items.length ? (
          <div className="cc-badge-rows">
            {items.map((it) => {
              const b = assignedBadges(it.badgeIds)
              return (
                <BadgeRow
                  key={it.id}
                  icon="gift"
                  square
                  title={it.title}
                  meta={b.length ? <BadgeAvatars badges={b} /> : 'Not assigned to a badge'}
                  metaMissing={!b.length}
                  onEdit={() => setRewardEditor(it)}
                  onRemove={() => removeReward(it.id)}
                />
              )
            })}
          </div>
        ) : (
          <EmptyState
            icon={REWARD_EMPTY_ICON}
            title="No rewards yet"
            description="Add a reward readers can earn — pick a saved one or write your own."
            action={
              <Button variant="secondary" size="sm" onClick={() => setRewardEditor({ new: true })}>
                + Create reward
              </Button>
            }
          />
        )}
      </div>

      {/* 2 · Ticket rewards (opt-in) */}
      <div className={`cc-panel${ticketsEnabled ? '' : ' cc-panel--collapsed'}`}>
        <div className="cc-panel-head">
          <h3 className="cc-panel-title">Ticket rewards</h3>
          <div className="cc-panel-actions">
            {ticketsEnabled && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setTicketPicker(true)}>
                  Use existing
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setTicketEditor({ new: true })}
                >
                  + Add ticket reward
                </Button>
              </>
            )}
            <Toggle
              checked={ticketsEnabled}
              size="md"
              onChange={(v) => setR({ ticketsEnabled: v })}
            />
          </div>
        </div>
        {ticketsEnabled && (
          <>
            <div className="cc-ticket-source">
              <span className="cc-ticket-source-label">How do readers earn tickets?</span>
              <div
                className="cc-optcards cc-optcards--stack"
                role="radiogroup"
                aria-label="How do readers earn tickets?"
              >
                {TICKET_SOURCES.map((o) => {
                  const on = ticketSource === o.value
                  return (
                    <div key={o.value} className={`cc-optrow${on ? ' is-on' : ''}`}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={on}
                        className={`cc-optcard${on ? ' is-on' : ''}`}
                        onClick={() => setR({ ticketSource: o.value })}
                      >
                        <span className="cc-optcard-ic" aria-hidden="true">
                          <Icon name={o.icon} size={19} color={on ? '#ffffff' : '#64748b'} />
                        </span>
                        <span className="cc-optcard-text">
                          <strong>{o.label}</strong>
                          <span>{o.sub}</span>
                        </span>
                        <span className="cc-optcard-dot" aria-hidden="true" />
                      </button>
                      {on && o.value === 'all' && (
                        <div className="cc-optcard-sub">
                          <div className="cc-ticket-allcount">
                            <span>Each badge awards</span>
                            <NumberInput
                              value={ticketsPerBadge}
                              min={1}
                              max={100}
                              onChange={(v) => setR({ ticketsPerBadge: v })}
                            />
                            <span>ticket{ticketsPerBadge === 1 ? '' : 's'}</span>
                          </div>
                        </div>
                      )}
                      {on && o.value === 'specific' && (
                        <div className="cc-optcard-sub">
                          <BadgeSelect
                            badges={badgePool}
                            selectedIds={Object.keys(ticketBadges)}
                            onToggle={toggleTicketBadge}
                            valueMode
                            values={ticketBadges}
                            onValue={setTicketBadgeValue}
                            valueLabel="tickets"
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            {ticketRewards.length ? (
              <div className="cc-badge-rows">
                {ticketRewards.map((t) => (
                  <BadgeRow
                    key={t.id}
                    img={t.image || null}
                    icon="gift"
                    square
                    title={t.name}
                    meta={`${t.cost} ticket${t.cost === 1 ? '' : 's'} to enter`}
                    onEdit={() => setTicketEditor(t)}
                    onRemove={() => removeTicket(t.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={TICKET_EMPTY_ICON}
                title="No ticket rewards yet"
                description="Add a prize readers enter to win with the tickets they collect."
                action={
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setTicketEditor({ new: true })}
                  >
                    + Add ticket reward
                  </Button>
                }
              />
            )}
          </>
        )}
      </div>

      {/* 3 · Certificates (opt-in) */}
      <div className={`cc-panel${certsEnabled ? '' : ' cc-panel--collapsed'}`}>
        <div className="cc-panel-head">
          <h3 className="cc-panel-title">Certificates</h3>
          <div className="cc-panel-actions">
            {certsEnabled && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setCertPicker(true)}>
                  Use existing
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setCertEditor({ new: true })}>
                  + Add certificate
                </Button>
              </>
            )}
            <Toggle checked={certsEnabled} size="md" onChange={(v) => setR({ certsEnabled: v })} />
          </div>
        </div>
        {certsEnabled &&
          (certificates.length ? (
            <div className="cc-badge-rows">
              {certificates.map((c) => {
                const cb = assignedBadges(c.badgeIds)
                return (
                  <BadgeRow
                    key={c.id}
                    icon="certificate"
                    square
                    title={c.title}
                    meta={cb.length ? <BadgeAvatars badges={cb} /> : 'Not assigned to a badge'}
                    metaMissing={!cb.length}
                    onEdit={() => setCertEditor(c)}
                    onRemove={() => removeCert(c.id)}
                  />
                )
              })}
            </div>
          ) : (
            <EmptyState
              icon={CERT_EMPTY_ICON}
              title="No certificates yet"
              description="Create a printable certificate readers earn when they finish."
              action={
                <Button variant="secondary" size="sm" onClick={() => setCertEditor({ new: true })}>
                  + Add certificate
                </Button>
              }
            />
          ))}
      </div>

      <Banner
        level="info"
        className="cc-rewards-drawings-note"
        action={
          <Button variant="secondary" size="sm">
            Go to Drawings →
          </Button>
        }
      >
        Drawings are run from this challenge’s data in the <strong>Drawings</strong> tool — pick
        winners from badge earners or ticket holders there.
      </Banner>

      <Modal
        open={!!rewardEditor}
        onClose={() => setRewardEditor(null)}
        variant="center"
        ariaLabel="Reward"
      >
        {rewardEditor && (
          <RewardEditor
            initial={rewardEditor.new ? null : rewardEditor}
            badges={badgePool}
            usedBadgeIds={items
              .filter((x) => x.id !== (rewardEditor.new ? null : rewardEditor.id))
              .flatMap((x) => x.badgeIds || [])}
            onSave={saveReward}
            onCancel={() => setRewardEditor(null)}
          />
        )}
      </Modal>
      <Modal
        open={rewardPicker}
        onClose={() => setRewardPicker(false)}
        variant="center"
        ariaLabel="Use a saved reward"
      >
        {rewardPicker && (
          <SavedItemPicker
            title="Use a saved reward"
            noun="reward"
            items={SAVED_REWARDS.map((rw) => ({
              id: rw.id,
              key: rw.title,
              title: rw.title,
              subtitle: rw.description,
            }))}
            existingKeys={new Set(items.map((x) => x.title))}
            badges={badgePool}
            disabledBadgeIds={items.flatMap((x) => x.badgeIds || [])}
            disabledBadgeHint="Already rewarded"
            onAdd={(picked, badgeIds) =>
              addSavedRewards(
                picked.map((p) => ({ title: p.title, description: p.subtitle })),
                badgeIds,
              )
            }
            onCancel={() => setRewardPicker(false)}
          />
        )}
      </Modal>
      <Modal
        open={ticketPicker}
        onClose={() => setTicketPicker(false)}
        variant="center"
        ariaLabel="Use a saved ticket reward"
      >
        {ticketPicker && (
          <SavedItemPicker
            title="Use a saved ticket reward"
            noun="ticket reward"
            items={SAVED_TICKET_REWARDS.map((t) => ({
              id: t.id,
              key: t.name,
              image: null,
              icon: 'ti-gift',
              title: t.name,
              subtitle: `${t.description} · ${t.cost} tickets`,
              description: t.description,
              cost: t.cost,
            }))}
            existingKeys={new Set(ticketRewards.map((x) => x.name))}
            onAdd={(picked) => addSavedTickets(picked)}
            onCancel={() => setTicketPicker(false)}
          />
        )}
      </Modal>
      <Modal
        open={!!ticketEditor}
        onClose={() => setTicketEditor(null)}
        variant="center"
        ariaLabel="Ticket reward"
      >
        {ticketEditor && (
          <TicketRewardEditor
            initial={ticketEditor.new ? null : ticketEditor}
            onSave={saveTicket}
            onCancel={() => setTicketEditor(null)}
          />
        )}
      </Modal>
      <Modal
        open={!!certEditor}
        onClose={() => setCertEditor(null)}
        variant="center"
        ariaLabel="Certificate"
      >
        {certEditor && (
          <CertificateEditor
            initial={certEditor.new ? null : certEditor}
            badges={badgePool}
            onSave={saveCert}
            onCancel={() => setCertEditor(null)}
          />
        )}
      </Modal>
      <Modal
        open={certPicker}
        onClose={() => setCertPicker(false)}
        variant="center"
        ariaLabel="Use a saved certificate"
      >
        {certPicker && (
          <SavedItemPicker
            title="Use a saved certificate"
            noun="certificate"
            items={SAVED_CERTIFICATES.map((c) => ({
              id: c.id,
              key: c.title,
              title: c.title,
              subtitle: c.bannerTitle,
              bannerTitle: c.bannerTitle,
              description: c.description,
              body: c.body,
            }))}
            existingKeys={new Set(certificates.map((x) => x.title))}
            badges={badgePool}
            onAdd={(picked, badgeIds) => addSavedCerts(picked, badgeIds)}
            onCancel={() => setCertPicker(false)}
          />
        )}
      </Modal>
    </section>
  )
}

// ─── Barrel re-exports ────────────────────────────────────────────────────────
// The leaf steps and shared helpers live in their own files now; re-export them
// here so the external import surface (App.jsx, patterns, book-talks) is unchanged.
export { BookTalksStep } from './BookTalksStep'
export { DetailsStep } from './DetailsStep'
export { SetupStep } from './SetupStep'
export { CompletionStep } from './CompletionStep'
export { ColorPicker, BadgeMultiSelect, badgePoolOf, rewardedBadgeIds } from './shared'
