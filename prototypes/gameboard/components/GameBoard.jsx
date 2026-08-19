import { useState, useEffect, useRef, useId } from 'react'
import { EmptyState } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import { GAMEBOARD_THEMES } from '../data'

// Hover tooltip on a badge — its type (logging / activity) and how it's earned.
function BadgeTip({ name, kind, meta, shown }) {
  return (
    <span className={`gb-badge-tip${shown ? ' is-shown' : ''}`} role="tooltip">
      <strong>{name}</strong>
      {kind && <span className="gb-badge-tip-kind">{kind}</span>}
      {meta && <span className="gb-badge-tip-req">{meta}</span>}
    </span>
  )
}

// START / HALFWAY / FINISH labels, curved around the disc via an SVG arc.
// variant 'top' arcs over the top; 'bottom' smiles under the bottom.
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
      className={`gb-arc gb-arc--${variant}`}
      width={box}
      height={box}
      viewBox={`0 0 ${box} ${box}`}
      aria-hidden="true"
    >
      <path id={id} d={d} fill="none" />
      <text className="gb-arc-text" dominantBaseline={bottom ? 'hanging' : 'auto'}>
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  )
}

/**
 * The gameboard editor: logging badges line a winding path from START to FINISH.
 * Badges drag in from the tray; a placed badge can be dragged space-to-space to
 * swap, dropped back on the tray, or cleared with its ×. Activity badges live in
 * the tray but can't be placed on the board.
 */
export function GameBoard({
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
      <Icon name="award" size={22} className="gb-art-fallback" />
    )

  // One consistent round badge ghost for BOTH drag directions (tray→board and
  // board→tray). Building a dedicated element — rather than snapshotting the
  // small chip art one way and the larger placed disc the other — keeps the
  // grab fully round and the same size whichever way you drag.
  const setRoundDragImage = (e, src) => {
    const ghost = document.createElement('div')
    ghost.className = 'gb-drag-ghost'
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
        className="gb-empty"
        icon={<Icon name="route" size={26} />}
        title="No badges to place yet"
        description="Add logging badges to this challenge, then drag them onto the board here."
      />
    )
  }

  // Serpentine grid → pixel centers; the connecting "road" is drawn as ONE SVG
  // stroke with round joins/caps, so the bends come out smoothly rounded. Discs
  // sit on the vertices (including the turns = the edge badges).
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
        <span key="start" className="gb-node gb-end" style={place}>
          <CurvedLabel text="START" variant="top" radius={44} />
          <span className="gb-disc">
            {regBadge?.img ? <img src={regBadge.img} alt="" /> : <Icon name="flag" size={20} />}
          </span>
        </span>
      )
    if (node.kind === 'finish')
      return (
        <span key="finish" className="gb-node gb-end" style={place}>
          <CurvedLabel text="FINISH" variant="top" radius={44} />
          <span className="gb-disc">
            {compBadge?.img ? <img src={compBadge.img} alt="" /> : <Icon name="trophy" size={20} />}
          </span>
        </span>
      )
    const { id, i } = node
    const b = id ? byId[id] : null
    const reward = showRewards && b?.reward
    return (
      <span key={i} className="gb-node" style={place}>
        {i === half && <CurvedLabel text="HALFWAY" variant="top" radius={44} />}
        <span
          className={`gb-disc${b ? ' is-filled' : ''}${over === i ? ' is-over' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            if (over !== i) setOver(i)
          }}
          onDragLeave={() => setOver((o) => (o === i ? null : o))}
          onDrop={(e) => dropOnCell(e, i)}
        >
          {b ? (
            <span
              className="gb-placed"
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
                className="gb-remove"
                onClick={() => clear(i)}
                aria-label={`Remove ${b.name}`}
              >
                <Icon name="x" size={12} stroke={2.5} />
              </button>
            </span>
          ) : (
            <span className="gb-plus" aria-hidden="true">
              <Icon name="plus" size={18} stroke={2.5} />
            </span>
          )}
        </span>
        {reward && (
          <span className="gb-reward" title="Awards a reward">
            <Icon name="gift" size={12} />
          </span>
        )}
      </span>
    )
  }

  return (
    <div className="gb-editor">
      <div
        className={`gb-tray${trayOver ? ' is-over' : ''}`}
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
        <div className="gb-tray-inner">
          <div className="gb-tray-head">
            <span className="gb-tray-title">Drag badges onto the board</span>
            <span className="gb-tray-count">
              {placed.size}/{cells.length} placed
            </span>
          </div>
          <div className="gb-tray-list">
            {pool.map((b) => {
              const used = placed.has(b.id)
              return (
                <div
                  key={b.id}
                  className={`gb-chip${used ? ' is-used' : ''}`}
                  draggable={!used}
                  onDragStart={(e) => {
                    if (used) return
                    setRoundDragImage(e, b.img)
                    setPayload(e, { from: 'tray', id: b.id })
                  }}
                  title={b.name}
                >
                  <span className="gb-chip-art">
                    <Art b={b} />
                  </span>
                  <span className="gb-chip-text">
                    <span className="gb-chip-name">{b.name}</span>
                    {b.meta && <span className="gb-chip-meta">{b.meta}</span>}
                  </span>
                </div>
              )
            })}
          </div>
          {activityPool.length > 0 && (
            <div className="gb-tray-activity">
              <span className="gb-tray-sublabel">Activity badges (not placed on the board)</span>
              <div className="gb-tray-list">
                {activityPool.map((b) => (
                  <div
                    key={b.id}
                    className="gb-chip is-activity"
                    title={`${b.name} — earned by activity, not placed on the board`}
                  >
                    <span className="gb-chip-art">
                      <Art b={b} />
                    </span>
                    <span className="gb-chip-name">{b.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        ref={boardRef}
        className="gb-board"
        style={{ ...boardStyle, '--ink': th.ink, '--track': th.track }}
      >
        <div className="gb-track-wrap" style={{ width: boardW, height: boardH }}>
          <svg
            className="gb-track"
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
