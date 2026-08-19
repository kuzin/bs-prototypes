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
import { SettingRow } from '@components/SettingRow/SettingRow'
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
    <div className="gb-bggrid">
      {groups.map((g) => (
        <div key={g.label} className="gb-bggroup">
          <span className="gb-bglabel">{g.label}</span>
          <div className="gb-builder-bgimgs">
            {g.images.map((src) => (
              <button
                key={src}
                type="button"
                className={`gb-builder-bgimg${value === src ? ' is-on' : ''}`}
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
      className={`gb-badgepick-group${view === key && !searching ? ' is-on' : ''}`}
      onClick={() => setView(key)}
      title={label}
    >
      <span className="gb-badgepick-group-name">{label}</span>
      <span className="gb-badgepick-group-count">{count}</span>
    </button>
  )

  return (
    <>
      <div className="gb-badgepick-topbar">
        <SearchInput value={q} onChange={setQ} placeholder="Search all badges" />
        {presentColors.length > 1 && (
          <div className="gb-badgepick-colorbar" role="radiogroup" aria-label="Filter by color">
            {presentColors.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                className={`gb-colorchip${color === c.id ? ' is-on' : ''}`}
                style={{ '--chip': c.hex }}
                onClick={() => toggleColor(c.id)}
                title={`${c.name}${color === c.id ? ' (selected — click to clear)' : ''}`}
                aria-checked={color === c.id}
              >
                <span className="gb-colorchip-dot" />
              </button>
            ))}
          </div>
        )}
      </div>

      {filtering && (
        <p className="gb-badgepick-count">
          {list.length} badge{list.length === 1 ? '' : 's'}
          {searching ? ` matching “${q.trim()}”` : ''}
        </p>
      )}

      <div className={`gb-badgepick-cols${filtering ? ' is-searching' : ''}`}>
        {!filtering && (
          <div className="gb-badgepick-groups">
            {extraGroups.length > 0 && <p className="gb-badgepick-grouphead">Recommended</p>}
            {extraGroups.map((g) => navBtn(g.id, g.name, g.badges.length))}
            {subjectGroups.length > 0 && <p className="gb-badgepick-grouphead">By subject</p>}
            {subjectGroups.map((s) =>
              navBtn(
                `subj:${s.id}`,
                s.name,
                catalog.filter((b) => badgeSubjects(b).includes(s.id)).length,
              ),
            )}
            <p className="gb-badgepick-grouphead">By theme</p>
            {themeGroups.map((g) => navBtn(g.id, g.name, g.badges.length))}
          </div>
        )}
        <div className="gb-badgepick-grid">
          {list.length ? (
            list.map((b) => (
              <div
                key={(b._group || '') + b.id + b.img}
                className={`gb-badgepick-item${isSelected(b) ? ' is-selected' : ''}`}
              >
                <button
                  type="button"
                  className="gb-badgepick-pick"
                  onClick={() => pick(b)}
                  aria-label={`Use ${b.name}`}
                >
                  <span className="gb-badgepick-item-art">
                    <img src={b.img} alt="" />
                    {isSelected(b) && (
                      <span className="gb-badgepick-check">
                        <GalleryCheck />
                      </span>
                    )}
                  </span>
                  <span className="gb-badgepick-item-name">{b.name}</span>
                  {filtering && b._group && (
                    <span className="gb-badgepick-item-set">{b._group}</span>
                  )}
                </button>
              </div>
            ))
          ) : (
            <EmptyState
              className="gb-badgepick-empty"
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

// Badge picker: Gallery (grouped, promoted) / Upload / Create.
// A badge's reward. Beanstack attaches rewards at the badge level, so the badge
// editor is where one gets picked — there is no separate Rewards step. Choosing
// a reward here is what makes the gameboard fly a gift marker on that space.
function RewardField({ value, onChange }) {
  return (
    <div className="gb-badge-reward">
      <SettingRow
        label="Earns a reward"
        sub="Give readers a prize when they earn this badge."
        checked={!!value}
        onChange={(on) => onChange(on ? SAVED_REWARDS[0] : null)}
      />
      {value && (
        <Field label="Reward">
          <CustomSelect
            value={value.id}
            onChange={(id) => onChange(SAVED_REWARDS.find((r) => r.id === id) || null)}
            placeholder="Select a reward"
            options={SAVED_REWARDS.map((r) => ({ value: r.id, label: r.title }))}
          />
        </Field>
      )}
      {value?.description && <p className="gb-note gb-note--sm">{value.description}</p>}
    </div>
  )
}

// Badges are chosen from the gallery. Uploading your own art and building a
// badge from scratch are both gone from this fork — a badge here is picked from
// what the badge library already has.
function BadgePicker({ onPick, extraGroups, defaultGroupId, selectedImg }) {
  return (
    <div className="gb-badgepick">
      <BadgeGallery
        onPick={onPick}
        extraGroups={extraGroups}
        defaultGroupId={defaultGroupId}
        selectedImg={selectedImg}
      />
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
  onSave,
  onCancel,
}) {
  const [badge, setBadge] = useState(initial || null)
  const [name, setName] = useState(initial?.name || '')
  const [logType, setLogType] = useState(initial?.logType || '')
  const [goal, setGoal] = useState(initial?.goal ?? 1)
  const [reward, setReward] = useState(initial?.reward || null)
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
      reward,
    })
  return (
    <div className="gb-badge-editor">
      <header className="gb-badge-editor-head">
        {picking ? (
          <button type="button" className="gb-badge-editor-back" onClick={() => setPicking(false)}>
            <Icon name="chevron-left" size={16} />
            Back to badge details
          </button>
        ) : (
          <h3>{title}</h3>
        )}
        <button
          type="button"
          className="gb-badge-editor-close"
          onClick={onCancel}
          aria-label="Close"
        >
          <Icon name="x" size={18} />
        </button>
      </header>
      <div className="gb-badge-editor-body">
        {picking ? (
          <div className="gb-badgepick-wrap">
            <BadgePicker
              extraGroups={extraGroups}
              defaultGroupId={defaultGroupId}
              selectedImg={badge?.img}
              onPick={(b) => {
                setBadge(b)
                if (!name && b.name) setName(b.name)
                setPicking(false)
              }}
            />
          </div>
        ) : (
          <div className="gb-badge-form">
            <div className="gb-badge-preview">
              <button
                type="button"
                className={`gb-badge-disc${badge?.img ? '' : ' is-empty'}`}
                onClick={() => setPicking(true)}
                aria-label={badge?.img ? 'Change badge' : 'Choose a badge'}
              >
                {badge?.img ? <img src={badge.img} alt="" /> : <Icon name="photo" size={34} />}
                {/* Edit affordance overlaid on the badge (replaces the separate button). */}
                <span className="gb-badge-disc-edit" aria-hidden="true">
                  <Icon name="pencil" size={15} />
                </span>
              </button>
            </div>
            <div className="gb-badge-fields">
              <Field
                label={
                  <>
                    Badge name <span className="gb-req">*</span>
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
                <div className="gb-badge-goal-row">
                  <Field
                    label={
                      <>
                        Goal <span className="gb-req">*</span>
                      </>
                    }
                  >
                    <NumberInput value={goal} min={1} max={10000} onChange={(n) => setGoal(n)} />
                  </Field>
                  <Field
                    label={
                      <>
                        Log type <span className="gb-req">*</span>
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
                      Reviews to earn <span className="gb-req">*</span>
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
                      Points to earn <span className="gb-req">*</span>
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
              <RewardField value={reward} onChange={setReward} />
            </div>
          </div>
        )}
      </div>
      {/* Footer only in the form view — while picking, each tab has its own
          confirm (tile click / "Use this image" / "Use this badge"). */}
      {!picking && (
        <footer className="gb-badge-editor-foot">
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
  const [reward, setReward] = useState(initial?.reward || null)
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
      reward,
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
    <div className="gb-badge-editor gb-ab-editor">
      <header className="gb-badge-editor-head">
        {picking ? (
          <button type="button" className="gb-badge-editor-back" onClick={() => setPicking(false)}>
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
          className="gb-badge-editor-close"
          onClick={onCancel}
          aria-label="Close"
        >
          <Icon name="x" size={18} />
        </button>
      </header>
      <div className="gb-badge-editor-body">
        {picking ? (
          <div className="gb-badgepick-wrap">
            <BadgePicker
              extraGroups={extraGroups}
              defaultGroupId={defaultGroupId}
              selectedImg={badge?.img}
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
              className="gb-ab-tabs"
              accent="#0DA7BC"
              active={tab}
              onChange={setTab}
              items={[
                { id: 'details', label: 'Details' },
                { id: 'activities', label: 'Activities', count: activities.length || undefined },
              ]}
            />
            {tab === 'details' ? (
              <div className="gb-ab-details">
                <div className="gb-ab-artcol">
                  <button
                    type="button"
                    className={`gb-badge-disc${badge?.img ? '' : ' is-empty'}`}
                    onClick={() => setPicking(true)}
                    aria-label={badge?.img ? 'Change badge' : 'Choose a badge'}
                  >
                    {badge?.img ? <img src={badge.img} alt="" /> : <Icon name="photo" size={34} />}
                    <span className="gb-badge-disc-edit" aria-hidden="true">
                      <Icon name="pencil" size={15} />
                    </span>
                  </button>
                </div>
                <div className="gb-ab-fieldscol">
                  <Field
                    label={
                      <>
                        Title <span className="gb-req">*</span>
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
                    <div className="gb-warn-note">
                      Completing repeatable activities can earn points for readers (and thus points
                      badges), but the repeatable activity badge itself can never be earned or
                      completed.
                    </div>
                  ) : (
                    <div className="gb-ab-settings">
                      <Field label="Earn after">
                        <div className="gb-ab-earn">
                          <Input
                            value={earn}
                            inputMode="numeric"
                            placeholder="All"
                            onChange={(e) => setEarn(e.target.value.replace(/[^0-9]/g, ''))}
                          />
                          <span className="gb-ab-earn-suffix">
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
                  {!repeatable && <RewardField value={reward} onChange={setReward} />}
                  <div className="gb-ab-toggle-row">
                    <div>
                      <strong>Restrict to certain dates</strong>
                      <span className="gb-ab-toggle-sub">
                        Readers can only complete activities within these dates.
                      </span>
                    </div>
                    <Toggle checked={dateRestrict} onChange={setDateRestrict} size="md">
                      {dateRestrict ? 'On' : 'Off'}
                    </Toggle>
                  </div>
                  {dateRestrict && (
                    <div className="gb-ab-dates">
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
              <div className="gb-ab-activities">
                {activities.length > 0 && (
                  <div className="gb-badge-rows">
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
                  <div className="gb-ab-actform">
                    <div className="gb-ab-actform-type">
                      <Field label="Activity type">
                        <CustomSelect
                          value={actForm.type}
                          onChange={(v) => setActForm({ ...actForm, type: v })}
                          options={ACTIVITY_TYPES}
                        />
                      </Field>
                      {ACTIVITY_TYPE_HINT[actForm.type] && (
                        <p className="gb-ab-typehint">{ACTIVITY_TYPE_HINT[actForm.type]}</p>
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
                        <div className="gb-ab-codes">
                          {(actForm.codes || []).map((c, i) => (
                            <span key={i} className="gb-ab-code-chip">
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
                            className="gb-ab-code-input"
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
                          ACTIVITY_FIELDS[actForm.type].length > 1 ? 'gb-ab-actform-row' : ''
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
                    <div className="gb-ab-actform-foot">
                      <Button variant="secondary" size="sm" onClick={() => setActForm(null)}>
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" accent="#0DA7BC" onClick={saveActForm}>
                        {actForm.index == null ? 'Add activity' : 'Save activity'}
                      </Button>
                    </div>
                  </div>
                ) : activities.length > 0 ? (
                  <button type="button" className="gb-ab-add" onClick={() => openActForm(null)}>
                    <span className="gb-ab-add-plus">+</span> Add an activity
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
        <footer className="gb-badge-editor-foot">
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
      className={`gb-badgerow${active === false ? ' is-inactive' : ''}${drag?.dragging ? ' is-dragging' : ''}${dropCls}`}
      onDragOver={drag?.onDragOver}
      onDrop={drag?.onDrop}
    >
      {drag && (
        <span
          className="gb-badgerow-drag"
          draggable
          onDragStart={handleDragStart}
          onDragEnd={drag.onDragEnd}
          aria-label="Drag to reorder"
        >
          <DragDots />
        </span>
      )}
      <span className={`gb-badgerow-art${square ? ' gb-badgerow-art--square' : ''}`}>
        {num != null ? (
          <span className="gb-badgerow-num">{num}</span>
        ) : img ? (
          <img src={img} alt="" draggable={false} />
        ) : (
          <span
            className="gb-badgerow-art-ic"
            style={color ? { background: color, color: '#fff' } : undefined}
          >
            <Icon name={icon} size={20} />
          </span>
        )}
      </span>
      <div className="gb-badgerow-info">
        <strong>{title || 'Untitled badge'}</strong>
        {meta && (
          <span className={`gb-badgerow-meta${metaMissing ? ' is-missing' : ''}`}>{meta}</span>
        )}
      </div>
      <div className="gb-badgerow-actions">
        {onToggleActive && (
          <button
            type="button"
            className={`gb-badgerow-eye${active === false ? ' is-off' : ''}`}
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
          <button type="button" className="gb-badge-edit" onClick={onEdit} aria-label="Edit badge">
            <PencilIcon />
          </button>
        )}
        {onRemove && (
          <button
            type="button"
            className="gb-row-remove"
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
    <div className="gb-badge-editor gb-quickbadge">
      <header className="gb-badge-editor-head">
        <h3>Quick-create logging badges</h3>
        <button
          type="button"
          className="gb-badge-editor-close"
          onClick={onCancel}
          aria-label="Close"
        >
          <Icon name="x" size={18} />
        </button>
      </header>
      <div className="gb-badge-editor-body gb-quick-body">
        <div className="gb-quick-rows">
          <div className="gb-quick-row">
            <span className="gb-quick-row-label">Set your badge increment</span>
            <NumberInput value={increment} min={1} max={10000} onChange={setIncrement} />
            <span className="gb-quick-unit-sel">
              <CustomSelect
                value={logType}
                onChange={setLogType}
                options={LOG_TYPES.map((t) => ({ value: t.value, label: t.label.toLowerCase() }))}
              />
            </span>
          </div>
          <div className="gb-quick-row">
            <span className="gb-quick-row-label">How many badges?</span>
            <NumberInput value={count} min={1} max={20} onChange={setCount} />
          </div>
        </div>

        <div className="gb-quick-bgrow">
          <span className="gb-quick-bglabel">Background</span>
          <div className="gb-quick-swatches">
            {imageOpts.map((src) => (
              <button
                key={src}
                type="button"
                className={`gb-quick-swatch${bg.image === src ? ' is-on' : ''}`}
                onClick={() => setBg({ image: src })}
                aria-label="Image background"
                aria-pressed={bg.image === src}
              >
                <img src={src} alt="" />
              </button>
            ))}
            <span className="gb-quick-swatch-sep" aria-hidden="true" />
            {QUICK_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`gb-quick-swatch${bg.color === c ? ' is-on' : ''}`}
                style={{ background: c }}
                onClick={() => setBg({ color: c })}
                aria-label={`Color background ${c}`}
                aria-pressed={bg.color === c}
              />
            ))}
          </div>
        </div>

        <div className="gb-quick-result">
          <div className="gb-quick-strip">
            {items.map((it, i) => (
              <span key={i} className="gb-quick-badge" title={it.name}>
                {arts[i] ? (
                  <img src={arts[i]} alt={it.name} draggable={false} />
                ) : (
                  <span className="gb-quick-badge-ph">{it.goal}</span>
                )}
              </span>
            ))}
          </div>
          <p className="gb-quick-result-note">
            {items.length > 1
              ? `${items[0].goal}–${items[items.length - 1].goal} ${label.toLowerCase()}`
              : items[0].name}
          </p>
        </div>
      </div>
      <footer className="gb-badge-editor-foot">
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
    <div className="gb-badge-editor gb-actpicker">
      <header className="gb-badge-editor-head">
        <h3>
          {mode === 'duplicate' ? 'Duplicate an activity badge' : 'Use an existing activity badge'}
        </h3>
        <button
          type="button"
          className="gb-badge-editor-close"
          onClick={onCancel}
          aria-label="Close"
        >
          <Icon name="x" size={18} />
        </button>
      </header>
      <div className="gb-badge-editor-body">
        <SearchInput value={query} onChange={setQ} placeholder="Search badges…" />
        {shown.length ? (
          <div className="gb-actpicker-list">
            {shown.map((b) => {
              const nA = b.activities?.length || 0
              return (
                <button
                  key={b.id || b.name}
                  type="button"
                  className="gb-actpicker-item"
                  onClick={() => onPick(b)}
                >
                  <span className="gb-badgerow-art">
                    {b.badge?.img ? (
                      <img src={b.badge.img} alt="" draggable={false} />
                    ) : (
                      <span className="gb-badgerow-num">?</span>
                    )}
                  </span>
                  <span className="gb-actpicker-item-info">
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
            className="gb-actpicker-empty"
            icon={SEARCH_EMPTY_ICON}
            title="No matches"
            description={`No badges match “${query}”.`}
          />
        )}
      </div>
      <footer className="gb-badge-editor-foot gb-actpicker-foot">
        <span className="gb-actpicker-page-count">
          {filtered.length
            ? `${start + 1}–${Math.min(start + pageSize, filtered.length)} of ${filtered.length}`
            : '0 results'}
        </span>
        <div className="gb-actpicker-page-btns">
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
    <div className="gb-panel-actions gb-actbadge-actions">
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
        <button type="button" className="gb-badge-pin" onClick={open}>
          <span className="gb-badge-pin-add">+</span>
          <span className="gb-badge-pin-name">Select a badge</span>
        </button>
      )
    }
    return <BadgeRow img={b.img} title={b.name} onEdit={open} />
  }

  return (
    <section className="gb-step">
      <StepHead
        title="Badges & activities"
        sub="Choose how readers earn, then add the badges they'll collect."
        icon={STEP_ICONS.badges}
      />

      <div className="gb-panel">
        <h3 className="gb-panel-title">Earnable badge types</h3>
        <div className="gb-settings">
          {earnableTypes.map((t) => {
            const isPrimary = t.key === primaryKey
            const on = isPrimary || !!methods[t.key]
            return (
              <div key={t.key} className={`gb-setting-row${isPrimary ? ' is-disabled' : ''}`}>
                <span className="gb-setting-label">{t.label}</span>
                <div className="gb-type-state">
                  {isPrimary && <span className="gb-reg-state">Required</span>}
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
        <div className="gb-panel">
          <h3 className="gb-panel-title">Earnable point types</h3>
          <div className="gb-warn-note">
            If you turn off one of the types below, points will no longer be awarded for it.
          </div>
          <div className="gb-settings">
            {POINT_TYPES.map((pt) => {
              const on = pointTypes[pt.key] !== false
              return (
                <div key={pt.key} className="gb-setting-row">
                  <span className="gb-setting-label">{pt.label}</span>
                  <div className="gb-type-state">
                    <Toggle checked={on} size="md" onChange={(v) => setPointType(pt.key, v)} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!isBingo && !isSimple && (
        <div className="gb-panel">
          <h3 className="gb-panel-title">Badge time restrictions</h3>
          <div className="gb-settings">
            <div className="gb-setting-row">
              <div className="gb-setting-text">
                <span className="gb-setting-label">Restrict when badges can be earned</span>
                <span className="gb-setting-sub">
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
              <div className="gb-badge-window-wrap">
                <div
                  className={`gb-date-row gb-badge-window${errors.badgeWindow ? ' has-error' : ''}`}
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
                {errors.badgeWindow && <p className="gb-badge-reqnote">{errors.badgeWindow}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="gb-panel">
        <h3 className="gb-panel-title">Registration badge</h3>
        <PinSlot slot="registration" label="Registration badge" />
      </div>

      {isBingo ? (
        <>
          <div className="gb-panel">
            <h3 className="gb-panel-title">Bingo badge</h3>
            <PinSlot slot="bingo" label="Bingo badge" />
          </div>
          <div className="gb-panel">
            <h3 className="gb-panel-title">Full-card badge</h3>
            <PinSlot slot="fullCard" label="Full-card badge" />
          </div>
        </>
      ) : (
        <div className="gb-panel">
          <h3 className="gb-panel-title">Completion badge</h3>
          <PinSlot slot="completion" label="Completion badge" />
        </div>
      )}

      {isPoints && (
        <div className="gb-panel">
          <div className="gb-panel-head">
            <h3 className="gb-panel-title">Points badges</h3>
            <div className="gb-panel-actions">
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
            <div className="gb-badge-rows">
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
        <div className="gb-panel">
          <div className="gb-panel-head">
            <h3 className="gb-panel-title">Logging badges</h3>
            <div className="gb-panel-actions">
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
            <Banner level="info" className="gb-panel-banner">
              Readers enrolled in a Reading List challenge will earn logging badges only for reading
              the specific titles added to your Reading List.
            </Banner>
          )}
          {errors.badges && <p className="gb-badge-reqnote">{errors.badges}</p>}
          {badges.length > 0 ? (
            <div className="gb-badge-rows">
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
        <div className="gb-panel">
          <div className="gb-panel-head">
            <h3 className="gb-panel-title">Activity badges</h3>
            <ActBadgeActions
              allowUse={!isSimple}
              onUse={() => setActPicker({ repeatable: false, mode: 'use' })}
              onDuplicate={() => setActPicker({ repeatable: false, mode: 'duplicate' })}
              onCreate={() => setAbEditor({ index: null })}
            />
          </div>
          {activityBadges.length ? (
            <div className="gb-badge-rows">
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
        <div className="gb-panel">
          <div className="gb-panel-head">
            <h3 className="gb-panel-title">Repeatable activities</h3>
            <ActBadgeActions
              allowUse={!isSimple}
              onUse={() => setActPicker({ repeatable: true, mode: 'use' })}
              onDuplicate={() => setActPicker({ repeatable: true, mode: 'duplicate' })}
              onCreate={() => setAbEditor({ index: null, repeatable: true })}
            />
          </div>
          <div className="gb-warn-note">
            Completing repeatable activities earns points (and thus points badges), but the
            repeatable activity badges themselves can never be earned or completed.
          </div>
          {repeatableActivities.length ? (
            <div className="gb-badge-rows">
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
        <div className="gb-panel">
          <div className="gb-panel-head">
            <h3 className="gb-panel-title">Review badges</h3>
            <div className="gb-panel-actions">
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
            <div className="gb-badge-rows">
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
          <div className="gb-confirm">
            <h3>Remove “{confirmType.label}”?</h3>
            <p>
              All badges associated with {confirmType.label.toLowerCase()} will be removed from this
              challenge. This can’t be undone.
            </p>
            <div className="gb-confirm-actions">
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
const REWARD_EMPTY_ICON = <Icon name="gift" size={26} />
const TICKET_EMPTY_ICON = <Icon name="ticket" size={26} />
const CERT_EMPTY_ICON = <Icon name="certificate" size={26} />

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

// ─── Barrel re-exports ────────────────────────────────────────────────────────
// Shared helpers live in their own file; re-export them here so the badge/reward
// import surface stays in one place.
export { ColorPicker, BadgeMultiSelect, badgePoolOf, rewardedBadgeIds } from './shared'
