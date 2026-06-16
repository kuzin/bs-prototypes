import { useState, useEffect, useRef, useMemo, useId } from 'react'
import { Field, NumberInput } from '@components/Form/Form'
import { Button } from '@components/Button/Button'
import { CustomSelect } from '@components/CustomSelect/CustomSelect'
import { Tabs } from '@components/Tabs/Tabs'
import { ImageDropzone } from '@components/ImageDropzone/ImageDropzone'
import { EmptyState } from '@components/Primitives/Primitives'
import { SettingRow } from '@components/SettingRow/SettingRow'
import { Modal } from '@components/Modal/Modal'
import { Icon } from '@components/Icon/Icon'
import gbMeadow from '../assets/gameboard/meadow.webp'
import gbWinter from '../assets/gameboard/winter.webp'
import gbAurora from '../assets/gameboard/aurora.webp'
import gbSpooky from '../assets/gameboard/spooky.webp'
import gbGlow from '../assets/gameboard/glow.webp'
import gbEra from '../assets/gameboard/era.webp'
import gbOcean from '../assets/gameboard/ocean.webp'
import gbJungle from '../assets/gameboard/jungle.webp'
import { SAMPLE_TITLES, BOOK_CATALOG, TEMPLATE_PRESETS, badgeImage, FAKE_UPLOAD_IMG } from '../data'
import {
  STEP_ICONS,
  StepHead,
  Tip,
  ColorPicker,
  rewardedBadgeIds,
  TrashIcon,
  SEARCH_EMPTY_ICON,
  BOOK_EMPTY_ICON,
} from './shared'

// ─── Step 4 · Type-specific setup (Bingo / Points / Reading List) ─────────────
// Book cover with a graceful fallback when the Open Library image 404s.
export function BookCover({ src, className = '' }) {
  const [err, setErr] = useState(false)
  if (!src || err) {
    return (
      <span className={`cc-bookcover cc-bookcover--ph ${className}`.trim()} aria-hidden="true">
        <Icon name="book" size={20} />
      </span>
    )
  }
  return (
    <img
      className={`cc-bookcover ${className}`.trim()}
      src={src}
      alt=""
      draggable={false}
      onError={() => setErr(true)}
    />
  )
}

const BOOK_SEARCH_FIELDS = [
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'isbn', label: 'ISBN' },
]
// "Add a title" book search — Web tab, search by Title/Author/ISBN, multi-select.
function ReadingListTitleModal({ existing = [], onAdd, onClose }) {
  const [field, setField] = useState('title')
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState(null) // { field, q } once searched
  const [picked, setPicked] = useState([]) // book ids
  const have = new Set(existing.map((t) => t.isbn || t.title))
  const results = useMemo(() => {
    if (!submitted) return []
    const q = submitted.q.trim().toLowerCase()
    if (!q) return BOOK_CATALOG
    return BOOK_CATALOG.filter((b) =>
      String(b[submitted.field] || '')
        .toLowerCase()
        .includes(q),
    )
  }, [submitted])
  const runSearch = () => setSubmitted({ field, q: query })
  const clear = () => {
    setQuery('')
    setSubmitted(null)
    setPicked([])
  }
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const add = () => {
    onAdd(BOOK_CATALOG.filter((b) => picked.includes(b.id)))
    onClose()
  }
  return (
    <div className="cc-titlemodal">
      <button type="button" className="cc-titlemodal-close" onClick={onClose} aria-label="Close">
        <Icon name="x" size={20} />
      </button>
      <div className="cc-titlemodal-grid">
        <div className="cc-titlemodal-side">
          <Tabs
            className="cc-titlemodal-tabs"
            accent="#0DA7BC"
            active="web"
            items={[{ id: 'web', label: 'Web' }]}
          />
          <div className="cc-tm-searchby">
            <span>Search By</span>
            <CustomSelect value={field} onChange={setField} options={BOOK_SEARCH_FIELDS} />
          </div>
          <div className="cc-tm-search">
            <span className="cc-tm-search-ic">
              <Icon name="search" size={16} />
            </span>
            <input
              value={query}
              placeholder={`Search by ${BOOK_SEARCH_FIELDS.find((f) => f.value === field)?.label.toLowerCase()}…`}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSearch()}
              aria-label="Search books"
            />
            {query && (
              <button
                type="button"
                className="cc-tm-search-clear"
                onClick={() => setQuery('')}
                aria-label="Clear"
              >
                <Icon name="x" size={14} stroke={2.2} />
              </button>
            )}
          </div>
          <div className="cc-tm-actions">
            <Button variant="primary" size="md" onClick={runSearch}>
              Search
            </Button>
            <Button variant="secondary" size="md" onClick={clear}>
              Clear
            </Button>
          </div>
        </div>
        <div className="cc-titlemodal-main">
          <div className="cc-tm-resultshead">
            <h3>Results</h3>
            <span className="cc-tm-selcount">({picked.length} selected)</span>
          </div>
          <div className="cc-tm-resultsbody">
            {!submitted ? (
              <EmptyState
                icon={BOOK_EMPTY_ICON}
                title="Search for a title"
                description="Search by title, author, or ISBN."
              />
            ) : results.length ? (
              <ul className="cc-tm-results">
                {results.map((b) => {
                  const added = have.has(b.isbn)
                  const sel = picked.includes(b.id)
                  return (
                    <li key={b.id}>
                      <button
                        type="button"
                        className={`cc-tm-result${sel ? ' is-selected' : ''}${added ? ' is-added' : ''}`}
                        onClick={() => !added && toggle(b.id)}
                        aria-pressed={sel}
                        disabled={added}
                      >
                        <span className="cc-tm-check" aria-hidden="true" />
                        <BookCover src={b.cover} className="cc-tm-cover" />
                        <span className="cc-tm-info">
                          <strong>{b.title}</strong>
                          <span>{b.author}</span>
                        </span>
                        {added && <span className="cc-tm-addedtag">Added</span>}
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <EmptyState
                icon={SEARCH_EMPTY_ICON}
                title="No matches"
                description={`No books match “${submitted.q}”.`}
              />
            )}
          </div>
          <div className="cc-tm-foot">
            <Button variant="primary" size="md" disabled={!picked.length} onClick={add}>
              Add {picked.length || ''} {picked.length === 1 ? 'title' : 'titles'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hover tooltip on a placed badge — its type (logging / activity / review) and
// how it's earned. Shared by the bingo card + gameboard.
function BadgeTip({ name, kind, meta, shown }) {
  return (
    <span className={`cc-badge-tip${shown ? ' is-shown' : ''}`} role="tooltip">
      <strong>{name}</strong>
      {kind && <span className="cc-badge-tip-kind">{kind}</span>}
      {meta && <span className="cc-badge-tip-req">{meta}</span>}
    </span>
  )
}

// Drag-and-drop bingo card editor: drag badges from the tray into grid cells,
// drag a placed badge cell-to-cell to swap, or drop it back on the tray (or hit
// ×) to clear it.
function BingoBoard({ challenge, size, cells, onChange }) {
  const n = cells.length
  const [over, setOver] = useState(null)
  const [trayOver, setTrayOver] = useState(false)
  const [tipIdx, setTipIdx] = useState(null)
  const pool = useMemo(
    () => [
      ...(challenge.badges || []).map((b, i) => {
        const unit = b.logType || 'books'
        const goal = Number(b.goal) >= 1 ? b.goal : i + 1
        return {
          id: `log-${i}`,
          name: b.name || 'Logging badge',
          img: b.img || badgeImage(b.icon),
          kind: 'Logging badge',
          meta: `Log ${goal} ${goal === 1 ? unit.replace(/s$/, '') : unit}`,
        }
      }),
      ...(challenge.activityBadges || []).map((b, i) => {
        const nA = b.activities?.length || 0
        return {
          id: `act-${i}`,
          name: b.title || b.name || 'Activity badge',
          img: b.badge?.img,
          kind: 'Activity badge',
          meta: nA
            ? `Complete ${nA} ${nA === 1 ? 'activity' : 'activities'}`
            : 'Complete an activity',
        }
      }),
      ...(challenge.reviewBadges || []).map((b, i) => {
        const goal = Number(b.goal) >= 1 ? b.goal : 1
        return {
          id: `rev-${i}`,
          name: b.name || 'Review badge',
          img: b.img || badgeImage(b.icon),
          kind: 'Review badge',
          meta: `Write ${goal} ${goal === 1 ? 'review' : 'reviews'}`,
        }
      }),
    ],
    [challenge.badges, challenge.activityBadges, challenge.reviewBadges],
  )
  const byId = Object.fromEntries(pool.map((b) => [b.id, b]))
  const placed = new Set(cells.filter(Boolean))

  const setPayload = (e, data) => {
    try {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', JSON.stringify(data))
    } catch {
      /* some browsers restrict dataTransfer */
    }
  }
  const readPayload = (e) => {
    try {
      return JSON.parse(e.dataTransfer.getData('text/plain'))
    } catch {
      return null
    }
  }
  const dropOnCell = (e, target) => {
    e.preventDefault()
    setOver(null)
    const p = readPayload(e)
    if (!p) return
    const next = cells.slice()
    if (p.from === 'tray') {
      next[target] = p.id
    } else if (p.from === 'cell' && p.index !== target) {
      next[target] = cells[p.index]
      next[p.index] = cells[target]
    }
    onChange(next)
  }
  const clear = (i) => {
    const next = cells.slice()
    next[i] = null
    onChange(next)
  }

  const Art = ({ b, size: sz }) =>
    b.img ? (
      <img src={b.img} alt="" draggable={false} />
    ) : (
      <Icon name="award" size={sz} className="cc-bingo-art-fallback" />
    )

  // Nothing to place yet — show an empty state instead of a blank grid + tray.
  if (!pool.length) {
    return (
      <EmptyState
        className="cc-bingo-empty"
        icon={<Icon name="award" size={26} />}
        title="No badges to arrange yet"
        description="Add logging, activity, or review badges on the Badges step, then arrange them on the card here."
      />
    )
  }

  return (
    <div className="cc-bingo-board">
      <div
        className={`cc-bingo-tray${trayOver ? ' is-over' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setTrayOver(true)
        }}
        onDragLeave={() => setTrayOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setTrayOver(false)
          const p = readPayload(e)
          if (p?.from === 'cell') clear(p.index)
        }}
      >
        <div className="cc-bingo-tray-inner">
          <div className="cc-bingo-tray-head">
            <span className="cc-bingo-tray-title">Drag badges onto the card</span>
            <span className="cc-bingo-tray-count">
              {placed.size}/{n} placed
            </span>
          </div>
          {pool.length ? (
            <div className="cc-bingo-tray-list">
              {pool.map((b) => {
                const used = placed.has(b.id)
                return (
                  <div
                    key={b.id}
                    className={`cc-bingo-chip${used ? ' is-used' : ''}`}
                    draggable={!used}
                    onDragStart={(e) => !used && setPayload(e, { from: 'tray', id: b.id })}
                    title={b.name}
                  >
                    <span className="cc-bingo-chip-art">
                      <Art b={b} size={20} />
                    </span>
                    <span className="cc-bingo-chip-text">
                      <span className="cc-bingo-chip-name">{b.name}</span>
                      {b.meta && <span className="cc-bingo-chip-meta">{b.meta}</span>}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="cc-method-note cc-method-note--sm">
              Add logging, activity, or review badges on the Badges step, then drag them here.
            </p>
          )}
        </div>
      </div>

      <div className="cc-bingo-grid" style={{ '--n': size[0] }}>
        {cells.map((id, i) => {
          const b = id ? byId[id] : null
          return (
            <div
              key={i}
              className={`cc-bingo-cell${b ? ' is-filled' : ''}${over === i ? ' is-over' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                if (over !== i) setOver(i)
              }}
              onDragLeave={() => setOver((o) => (o === i ? null : o))}
              onDrop={(e) => dropOnCell(e, i)}
            >
              {b ? (
                <div
                  className="cc-bingo-placed"
                  draggable
                  onDragStart={(e) => setPayload(e, { from: 'cell', index: i, id })}
                  onMouseEnter={() => setTipIdx(i)}
                  onMouseLeave={() => setTipIdx((o) => (o === i ? null : o))}
                >
                  <Art b={b} size={26} />
                  <BadgeTip name={b.name} kind={b.kind} meta={b.meta} shown={tipIdx === i} />
                  <button
                    type="button"
                    className="cc-bingo-cell-x"
                    onClick={() => clear(i)}
                    aria-label={`Remove ${b.name}`}
                  >
                    <Icon name="x" size={12} stroke={2.5} />
                  </button>
                </div>
              ) : (
                <Icon name="plus" size={18} className="cc-bingo-cell-plus" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Gameboard ────────────────────────────────────────────────────────────────
export const GAMEBOARD_THEMES = [
  { id: 'meadow', name: 'Meadow', bgImg: gbMeadow, track: '#ecd6a4', ink: '#6e8a2e' },
  { id: 'ocean', name: 'Ocean', bgImg: gbOcean, track: '#c3e5f0', ink: '#2a6e82' },
  { id: 'jungle', name: 'Jungle', bgImg: gbJungle, track: '#d8ecb2', ink: '#3f6b2e' },
  { id: 'winter', name: 'Winter', bgImg: gbWinter, track: '#d3e7f5', ink: '#3a6b8a' },
  { id: 'aurora', name: 'Aurora', bgImg: gbAurora, track: '#e7c6e0', ink: '#7a2f63' },
  { id: 'spooky', name: 'Spooky', bgImg: gbSpooky, track: '#d9cff0', ink: '#5a4f86' },
]
export const gameboardTheme = (id) =>
  GAMEBOARD_THEMES.find((t) => t.id === id) || GAMEBOARD_THEMES[0]
// Dedicated gameboard background art per template (not the challenge banner).
export const GAMEBOARD_TEMPLATE_BG = { glow: gbGlow, era: gbEra }
// Resolve the selected theme to { bgImg | board, track, ink }. Handles the
// generic themes, a "custom" color, and a "template" theme (uses the applied
// challenge template's banner art as the board background).
export function resolveGameboardTheme(theme, { custom, templateBanner } = {}) {
  if (theme === 'custom')
    return {
      board: `linear-gradient(165deg, ${custom}, ${custom})`,
      track: '#ffffff',
      ink: '#0f172a',
    }
  if (theme === 'template' && templateBanner)
    return { bgImg: templateBanner, track: '#ffffff', ink: '#0f172a' }
  return gameboardTheme(theme)
}

// START / HALFWAY / FINISH labels, curved around the disc via an SVG arc (like
// the mock). variant 'top' arcs over the top; 'bottom' smiles under the bottom.
function CurvedLabel({ text, variant = 'top', radius = 36 }) {
  const id = useId().replace(/:/g, '')
  const r = radius
  const box = (r + 13) * 2
  const c = box / 2
  // Both variants are arcs of the same radius so top + bottom match exactly;
  // 'top' arcs over (text above the path), 'bottom' smiles under it.
  const bottom = variant === 'bottom'
  const d = bottom
    ? `M ${c - r} ${c} A ${r} ${r} 0 0 0 ${c + r} ${c}`
    : `M ${c - r} ${c} A ${r} ${r} 0 0 1 ${c + r} ${c}`
  return (
    <svg
      className={`cc-gb-arc cc-gb-arc--${variant}`}
      width={box}
      height={box}
      viewBox={`0 0 ${box} ${box}`}
      aria-hidden="true"
    >
      <path id={id} d={d} fill="none" />
      <text className="cc-gb-arc-text" dominantBaseline={bottom ? 'hanging' : 'auto'}>
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  )
}

// A functional, drag-and-drop board: logging badges line a winding path from
// START to FINISH. Badges drag in from the tray (preset with the logging
// badges); activity badges live in the tray but can't be placed on the board.
function GameBoard({
  cells,
  pool,
  activityPool = [],
  onChange,
  themeObj,
  showRewards,
  showHalfway,
  regBadge,
  compBadge,
}) {
  const [over, setOver] = useState(null)
  const [trayOver, setTrayOver] = useState(false)
  const [tipId, setTipId] = useState(null)
  // Measure the available width so the board can choose how many columns fit and
  // stay responsive (down to a single vertical column on narrow screens).
  const boardRef = useRef(null)
  const [avail, setAvail] = useState(0)
  useEffect(() => {
    const el = boardRef.current
    if (!el) return
    const measure = () => setAvail(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const byId = Object.fromEntries(pool.map((b) => [b.id, b]))
  const placed = new Set(cells.filter(Boolean))
  const th = themeObj || GAMEBOARD_THEMES[0]
  const boardStyle = th.bgImg
    ? { backgroundImage: `url(${th.bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: th.board }

  const setPayload = (e, data) => {
    try {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', JSON.stringify(data))
    } catch {
      /* some browsers restrict dataTransfer */
    }
  }
  const readPayload = (e) => {
    try {
      return JSON.parse(e.dataTransfer.getData('text/plain'))
    } catch {
      return null
    }
  }
  const dropOnCell = (e, target) => {
    e.preventDefault()
    setOver(null)
    const p = readPayload(e)
    if (!p || p.kind === 'activity') return
    const next = cells.slice()
    if (p.from === 'tray') next[target] = p.id
    else if (p.from === 'cell' && p.index !== target) {
      next[target] = cells[p.index]
      next[p.index] = cells[target]
    }
    onChange(next)
  }
  const clear = (i) => {
    const next = cells.slice()
    next[i] = null
    onChange(next)
  }

  const Art = ({ b }) =>
    b?.img ? (
      <img src={b.img} alt="" draggable={false} />
    ) : (
      <Icon name="award" size={22} className="cc-gb-art-fallback" />
    )

  // One consistent round badge ghost for BOTH drag directions (tray→board and
  // board→tray). Building a dedicated element — rather than snapshotting the
  // small chip art one way and the larger placed disc the other — keeps the
  // grab fully round and the same size whichever way you drag.
  const setRoundDragImage = (e, src) => {
    const ghost = document.createElement('div')
    ghost.className = 'cc-gb-drag-ghost'
    if (src) {
      const img = document.createElement('img')
      img.src = src
      ghost.appendChild(img)
    }
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 30, 30)
    // Remove once the browser has snapshotted it for the drag image.
    setTimeout(() => ghost.remove(), 0)
  }

  const half = showHalfway ? Math.floor(cells.length / 2) : -1

  // Nothing to place yet — show a real empty state instead of an empty board.
  if (!pool.length) {
    return (
      <EmptyState
        className="cc-gb-empty"
        icon={<Icon name="route" size={26} />}
        title="No badges to place yet"
        description="Add logging badges on the Badges step, then drag them onto the board here."
      />
    )
  }

  // Serpentine grid → pixel centers; the connecting "road" is drawn as ONE SVG
  // stroke with round joins/caps, so the bends are smoothly rounded like the
  // mock. Discs sit on the vertices (including the turns = the edge badges).
  const CELL = 108
  const ROAD = 24
  // How many columns fit the measured width (1 → a single vertical column).
  const COLS = Math.max(1, Math.min(6, Math.floor((avail - 36) / CELL) || 1))
  const seq = [
    { kind: 'start' },
    ...cells.map((id, i) => ({ kind: 'cell', id, i })),
    { kind: 'finish' },
  ]
  const layout = seq.map((node, idx) => {
    const row = Math.floor(idx / COLS)
    const within = idx % COLS
    const col = row % 2 === 0 ? within : COLS - 1 - within // boustrophedon
    return { node, cx: col * CELL + CELL / 2, cy: row * CELL + CELL / 2 }
  })
  const boardW = COLS * CELL
  const boardH = (Math.floor((seq.length - 1) / COLS) + 1) * CELL
  const pathD = layout.map((p, i) => `${i ? 'L' : 'M'} ${p.cx} ${p.cy}`).join(' ')

  const renderNode = ({ node, cx, cy }) => {
    const place = { left: cx, top: cy }
    if (node.kind === 'start')
      return (
        <span key="start" className="cc-gb-node cc-gb-end" style={place}>
          <CurvedLabel text="START" variant="top" radius={44} />
          <span className="cc-gb-disc">
            {regBadge?.img ? <img src={regBadge.img} alt="" /> : <Icon name="flag" size={20} />}
          </span>
        </span>
      )
    if (node.kind === 'finish')
      return (
        <span key="finish" className="cc-gb-node cc-gb-end" style={place}>
          <CurvedLabel text="FINISH" variant="top" radius={44} />
          <span className="cc-gb-disc">
            {compBadge?.img ? <img src={compBadge.img} alt="" /> : <Icon name="trophy" size={20} />}
          </span>
        </span>
      )
    const { id, i } = node
    const b = id ? byId[id] : null
    const reward = showRewards && b?.reward
    return (
      <span key={i} className="cc-gb-node" style={place}>
        {i === half && <CurvedLabel text="HALFWAY" variant="top" radius={44} />}
        <span
          className={`cc-gb-disc${b ? ' is-filled' : ''}${over === i ? ' is-over' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            if (over !== i) setOver(i)
          }}
          onDragLeave={() => setOver((o) => (o === i ? null : o))}
          onDrop={(e) => dropOnCell(e, i)}
        >
          {b ? (
            <span
              className="cc-gb-placed"
              draggable
              onDragStart={(e) => {
                setRoundDragImage(e, b.img)
                setPayload(e, { from: 'cell', index: i, id })
              }}
              onMouseEnter={() => setTipId(id)}
              onMouseLeave={() => setTipId((o) => (o === id ? null : o))}
            >
              <Art b={b} />
              <BadgeTip name={b.name} kind={b.kind} meta={b.meta} shown={tipId === id} />
              <button
                type="button"
                className="cc-bingo-cell-x"
                onClick={() => clear(i)}
                aria-label={`Remove ${b.name}`}
              >
                <Icon name="x" size={12} stroke={2.5} />
              </button>
            </span>
          ) : (
            <span className="cc-gb-plus" aria-hidden="true">
              <Icon name="plus" size={18} stroke={2.5} />
            </span>
          )}
        </span>
        {reward && (
          <span className="cc-gb-reward" title="Awards a reward">
            <Icon name="gift" size={12} />
          </span>
        )}
      </span>
    )
  }

  return (
    <div className="cc-gb">
      <div
        className={`cc-bingo-tray${trayOver ? ' is-over' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setTrayOver(true)
        }}
        onDragLeave={() => setTrayOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setTrayOver(false)
          const p = readPayload(e)
          if (p?.from === 'cell') clear(p.index)
        }}
      >
        <div className="cc-bingo-tray-inner">
          <div className="cc-bingo-tray-head">
            <span className="cc-bingo-tray-title">Drag badges onto the board</span>
            <span className="cc-bingo-tray-count">
              {placed.size}/{cells.length} placed
            </span>
          </div>
          {pool.length ? (
            <div className="cc-bingo-tray-list">
              {pool.map((b) => {
                const used = placed.has(b.id)
                return (
                  <div
                    key={b.id}
                    className={`cc-bingo-chip${used ? ' is-used' : ''}`}
                    draggable={!used}
                    onDragStart={(e) => {
                      if (used) return
                      setRoundDragImage(e, b.img)
                      setPayload(e, { from: 'tray', id: b.id })
                    }}
                    title={b.name}
                  >
                    <span className="cc-bingo-chip-art">
                      <Art b={b} />
                    </span>
                    <span className="cc-bingo-chip-text">
                      <span className="cc-bingo-chip-name">{b.name}</span>
                      {b.meta && <span className="cc-bingo-chip-meta">{b.meta}</span>}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="cc-method-note cc-method-note--sm">
              Add logging badges on the Badges step, then drag them onto the board.
            </p>
          )}
          {activityPool.length > 0 && (
            <div className="cc-gb-tray-activity">
              <span className="cc-gb-tray-sublabel">Activity badges (not placed on the board)</span>
              <div className="cc-bingo-tray-list">
                {activityPool.map((b) => (
                  <div
                    key={b.id}
                    className="cc-bingo-chip is-activity"
                    title={`${b.name} — earned by activity, not placed on the board`}
                  >
                    <span className="cc-bingo-chip-art">
                      <Art b={b} />
                    </span>
                    <span className="cc-bingo-chip-name">{b.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        ref={boardRef}
        className="cc-gb-board"
        style={{ ...boardStyle, '--ink': th.ink, '--track': th.track }}
      >
        <div className="cc-gb-track-wrap" style={{ width: boardW, height: boardH }}>
          <svg
            className="cc-gb-track"
            width={boardW}
            height={boardH}
            viewBox={`0 0 ${boardW} ${boardH}`}
            aria-hidden="true"
          >
            <path
              d={pathD}
              fill="none"
              stroke="var(--track)"
              strokeWidth={ROAD}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {layout.map(renderNode)}
        </div>
      </div>
    </div>
  )
}

export function SetupStep({ challenge, type, update }) {
  const s = challenge.setup
  const [titleModal, setTitleModal] = useState(false)
  if (type?.id === 'bingo') {
    const size = s.bingoSize
    const n = { '3x3': 9, '4x4': 16, '5x5': 25 }[size]
    const cells = Array.from({ length: n }, (_, i) => (s.bingoCells || [])[i] ?? null)
    return (
      <section className="cc-step">
        <StepHead
          title="Bingo card"
          sub="Pick a card size, then drag badges onto the grid."
          icon={STEP_ICONS.bingo}
        />
        <div className="cc-panel">
          <h3 className="cc-panel-title">Card size</h3>
          <div className="cc-bingo-sizes">
            {['3x3', '4x4', '5x5'].map((v) => {
              const dim = Number(v[0])
              return (
                <button
                  key={v}
                  type="button"
                  className={`cc-bingo-size${size === v ? ' is-active' : ''}`}
                  aria-pressed={size === v}
                  onClick={() => update({ setup: { ...s, bingoSize: v } })}
                >
                  <span className="cc-bingo-size-grid" style={{ '--n': dim }}>
                    {Array.from({ length: dim * dim }).map((_, i) => (
                      <i key={i} />
                    ))}
                  </span>
                  <span className="cc-bingo-size-label">{v.replace('x', ' × ')}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="cc-panel">
          <h3 className="cc-panel-title">Arrange the card</h3>
          <BingoBoard
            challenge={challenge}
            size={size}
            cells={cells}
            onChange={(next) => update({ setup: { ...s, bingoCells: next } })}
          />
        </div>
      </section>
    )
  }
  if (type?.id === 'gameboard') {
    const n = s.gbBadges || 8
    // Which badges award a reward (reward/cert assignment or tickets) — so the
    // board flags those spaces. Shared with the Badges step + bingo.
    const rewardedIds = rewardedBadgeIds(challenge)
    // Logging badges line the board; activity badges ride along in the tray only.
    const loggingPool = (challenge.badges || []).map((b, i) => {
      const unit = b.logType || 'books'
      const goal = Number(b.goal) >= 1 ? b.goal : i + 1
      return {
        id: `log-${i}`,
        name: b.name || 'Logging badge',
        img: b.img || badgeImage(b.icon),
        logType: unit,
        goal,
        kind: 'Logging badge',
        meta: `Log ${goal} ${goal === 1 ? unit.replace(/s$/, '') : unit}`,
        reward: rewardedIds.has(`log-${i}`),
      }
    })
    const activityPool = (challenge.activityBadges || []).map((b, i) => {
      const nA = b.activities?.length || 0
      return {
        id: `act-${i}`,
        name: b.title || b.name || 'Activity badge',
        img: b.badge?.img,
        kind: 'Activity badge',
        meta: nA
          ? `Complete ${nA} ${nA === 1 ? 'activity' : 'activities'}`
          : 'Complete an activity',
      }
    })
    // Preset the board with the logging badges (in order); pad/clamp to n spaces.
    const saved = s.gameboardCells
    const base = saved && saved.length ? saved : loggingPool.slice(0, n).map((b) => b.id)
    const cells = Array.from({ length: n }, (_, i) => base[i] ?? null)
    const setSetup = (patch) => update({ setup: { ...s, ...patch } })
    // Lay the logging badges onto the board in their natural ladder: grouped by
    // log type, then by ascending goal (Log 1 → Log 2 → …). Fills slots in order.
    const quickOrderBoard = () => {
      const ordered = [...loggingPool].sort((a, b) =>
        a.logType === b.logType
          ? (a.goal || 0) - (b.goal || 0)
          : String(a.logType).localeCompare(String(b.logType)),
      )
      setSetup({ gameboardCells: Array.from({ length: n }, (_, i) => ordered[i]?.id ?? null) })
    }
    // A template-derived theme: a dedicated generated gameboard background for
    // the applied challenge template (falls back to the banner if none exists).
    const hasTemplate = challenge.templateId && challenge.templateId !== 'scratch'
    const templateBg = hasTemplate
      ? GAMEBOARD_TEMPLATE_BG[challenge.templateId] ||
        TEMPLATE_PRESETS[challenge.templateId]?.banner
      : null
    const templateName = templateBg ? TEMPLATE_PRESETS[challenge.templateId]?.name : null
    // Default to the template's own theme when one's applied; else the first generic.
    const theme = s.gameboardTheme || (templateBg ? 'template' : 'meadow')
    let themeObj = resolveGameboardTheme(theme, {
      custom: s.gameboardColor || '#16A97A',
      templateBanner: templateBg,
    })
    if (theme === 'custom' && s.gameboardBg)
      themeObj = { bgImg: s.gameboardBg, track: '#ffffff', ink: '#0f172a' }
    return (
      <section className="cc-step">
        <StepHead
          title="Gameboard"
          sub="Theme the board, then drag badges onto the path readers travel as they read."
          icon={STEP_ICONS.gameboard}
        />

        <div className="cc-panel">
          <h3 className="cc-panel-title">Gameboard theme</h3>
          <div className="cc-gb-themes">
            {templateBg && (
              <button
                type="button"
                className={`cc-gb-theme cc-gb-theme--template${theme === 'template' ? ' is-on' : ''}`}
                style={{ backgroundImage: `url(${templateBg})` }}
                aria-pressed={theme === 'template'}
                onClick={() => setSetup({ gameboardTheme: 'template' })}
                title={`${templateName} theme`}
              >
                {theme === 'template' && (
                  <span className="cc-gb-theme-check">
                    <Icon name="check" size={13} stroke={3} color="#fff" />
                  </span>
                )}
                <span className="cc-gb-theme-name">{templateName}</span>
              </button>
            )}
            {GAMEBOARD_THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`cc-gb-theme${theme === t.id ? ' is-on' : ''}`}
                style={{ backgroundImage: `url(${t.bgImg})` }}
                aria-pressed={theme === t.id}
                onClick={() => setSetup({ gameboardTheme: t.id })}
              >
                {theme === t.id && (
                  <span className="cc-gb-theme-check">
                    <Icon name="check" size={13} stroke={3} color="#fff" />
                  </span>
                )}
                <span className="cc-gb-theme-name">{t.name}</span>
              </button>
            ))}
            <button
              type="button"
              className={`cc-gb-theme cc-gb-theme--custom${theme === 'custom' ? ' is-on' : ''}`}
              aria-pressed={theme === 'custom'}
              onClick={() => setSetup({ gameboardTheme: 'custom' })}
            >
              {theme === 'custom' && (
                <span className="cc-gb-theme-check cc-gb-theme-check--dark">
                  <Icon name="check" size={13} stroke={3} color="#fff" />
                </span>
              )}
              <Icon name="photo" size={20} />
              <span className="cc-gb-theme-name">Custom</span>
            </button>
          </div>
          {theme === 'custom' && (
            <div className="cc-gb-custom">
              <Field label="Color scheme">
                <ColorPicker
                  value={s.gameboardColor}
                  presets={[
                    '#16A97A',
                    '#0DA7BC',
                    '#0E7490',
                    '#2563EB',
                    '#1E3A8A',
                    '#6366F1',
                    '#7C3AED',
                    '#DB2777',
                    '#E8453A',
                    '#EA580C',
                    '#F59E0B',
                    '#65A30D',
                  ]}
                  maxPresets={12}
                  fallback="#16A97A"
                  onColor={(c) => setSetup({ gameboardColor: c })}
                />
              </Field>
              <Field
                label="Background image"
                help="Recommended 1200 × 1200px · JPG, PNG, or GIF · under 10MB."
              >
                <ImageDropzone
                  fileName={s.gameboardBgName}
                  previewSrc={s.gameboardBg}
                  onFile={(name) =>
                    setSetup({ gameboardBgName: name, gameboardBg: FAKE_UPLOAD_IMG })
                  }
                  onClear={() => setSetup({ gameboardBgName: '', gameboardBg: null })}
                />
              </Field>
            </div>
          )}
        </div>

        <div className="cc-panel">
          <h3 className="cc-panel-title">Gameboard settings</h3>
          <div className="cc-settings">
            <SettingRow
              label="Show reward types"
              sub="Mark spaces that award a prize with a gift icon."
              checked={s.gbShowRewards !== false}
              onChange={(v) => setSetup({ gbShowRewards: v })}
            />
            <SettingRow
              label="Show a halfway marker"
              sub="Call out the midpoint of the board."
              checked={s.gbShowHalfway !== false}
              onChange={(v) => setSetup({ gbShowHalfway: v })}
            />
          </div>
          <Field label="Number of badges" className="cc-w-sm">
            <NumberInput
              value={n}
              min={4}
              max={20}
              onChange={(v) => {
                const next = Array.from({ length: v }, (_, i) => cells[i] ?? null)
                setSetup({ gbBadges: v, gameboardCells: next })
              }}
            />
          </Field>
        </div>

        <div className="cc-panel">
          <div className="cc-panel-head">
            <h3 className="cc-panel-title">Gameboard setup</h3>
            <div className="cc-panel-actions">
              <Button
                variant="ghost"
                size="sm"
                onClick={quickOrderBoard}
                disabled={!loggingPool.length}
              >
                ⚡ Quick order
              </Button>
            </div>
          </div>
          <GameBoard
            cells={cells}
            pool={loggingPool}
            activityPool={activityPool}
            themeObj={themeObj}
            showRewards={s.gbShowRewards !== false}
            showHalfway={s.gbShowHalfway !== false}
            regBadge={challenge.registrationBadge}
            compBadge={challenge.completionBadge}
            onChange={(next) => setSetup({ gameboardCells: next })}
          />
        </div>
      </section>
    )
  }
  const titles = s.titles || SAMPLE_TITLES
  const setTitles = (next) => update({ setup: { ...s, titles: next.slice(0, 30) } })
  const addTitles = (books) => {
    const have = new Set(titles.map((t) => t.isbn || t.title))
    setTitles([...titles, ...books.filter((b) => !have.has(b.isbn))])
  }
  const removeTitle = (i) => setTitles(titles.filter((_, idx) => idx !== i))
  return (
    <section className="cc-step">
      <StepHead
        title="Reading list"
        sub="Add the specific titles readers must log (up to 30)."
        icon={STEP_ICONS.readingList}
      />
      <div className="cc-panel">
        <div className="cc-panel-head">
          <h3 className="cc-panel-title">
            Titles <span className="cc-rl-count">{titles.length} / 30</span>
          </h3>
          <div className="cc-panel-actions">
            <Button
              variant="secondary"
              size="sm"
              disabled={titles.length >= 30}
              onClick={() => setTitleModal(true)}
            >
              + Add titles
            </Button>
          </div>
        </div>
        {titles.length ? (
          <ul className="cc-title-list">
            {titles.map((t, i) => (
              <li key={t.isbn || i} className="cc-title-row">
                <BookCover src={t.cover} className="cc-title-cover" />
                <div className="cc-title-info">
                  <strong>{t.title}</strong>
                  <span>{t.author}</span>
                </div>
                <button
                  type="button"
                  className="cc-row-remove"
                  onClick={() => removeTitle(i)}
                  aria-label={`Remove ${t.title}`}
                >
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={BOOK_EMPTY_ICON}
            title="No titles yet"
            description="Add the specific books readers must log to complete this challenge."
            action={
              <Button variant="secondary" size="sm" onClick={() => setTitleModal(true)}>
                + Add titles
              </Button>
            }
          />
        )}
        <Tip>Book completions are always tracked in a reading-list challenge.</Tip>
      </div>
      <Modal
        open={titleModal}
        onClose={() => setTitleModal(false)}
        variant="center"
        ariaLabel="Add a title"
      >
        {titleModal && (
          <ReadingListTitleModal
            existing={titles}
            onAdd={addTitles}
            onClose={() => setTitleModal(false)}
          />
        )}
      </Modal>
    </section>
  )
}
