import { useState, useMemo, useEffect } from 'react'
import '@components/Table/Table.css'

/**
 * <Table
 *   columns={[
 *     { key: 'name',  label: 'School', sortable: true },
 *     { key: 'score', label: 'RMI', align: 'right', sortable: true },
 *     { key: 'delta', label: 'Δ',   align: 'right', render: v => <DeltaPill v={v} /> },
 *   ]}
 *   rows={[{ name: 'Lincoln', score: 71, delta: 7 }, …]}
 *   getRowKey={r => r.id}
 *   onRowClick={r => openSchool(r.id)}
 *   zebra
 *   pageSize={5}
 * />
 */
const GAP = Symbol('gap')

/**
 * The page numbers to show, as pagy's `series` builds them: the first page, the
 * last page, and a window around the current one, with a gap standing in for
 * each run that's elided. Short tables list every page instead.
 *
 *   page 0 of 9   → 1 2 3 … 9
 *   page 4 of 9   → 1 … 4 5 6 … 9
 */
function pageSeries(page, totalPages, window = 1) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i)

  const wanted = new Set([0, totalPages - 1])
  for (let p = page - window; p <= page + window; p++) {
    if (p >= 0 && p < totalPages) wanted.add(p)
  }

  const out = []
  let prev = null
  for (const p of [...wanted].sort((a, b) => a - b)) {
    if (prev !== null && p - prev > 1) out.push(GAP)
    out.push(p)
    prev = p
  }
  return out
}

/* A click that landed on a control in the row belongs to that control, not to
   the row. Without this, a toggle in a cell fires its own `onChange` *and*
   opens whatever the row opens — which is how "shown on Discover" also became
   "edit this list". A row action was the same bug being invisible, because it
   usually opened the same thing the row did. */
const CONTROLS = 'button, a, input, select, textarea, label, [role="button"], [role="switch"]'
const fromControl = (e) => Boolean(e.target.closest?.(CONTROLS))

export function Table({
  columns,
  rows,
  getRowKey = (r, i) => r.id ?? i,
  onRowClick,
  zebra = false,
  compact = false,
  bordered = false,
  flush = false, // remove outer border + radius — use inside ChartCard bodyPad="flush"
  scrollX = false, // wrap the table in a horizontal scroller; pagination stays pinned outside it
  stickyHeader = false,
  hideHeader = false, // drop the header row — for a two-column key/value table
  loading = false,
  empty, // string | node — shown when rows is empty
  highlightRow, // (row) => bool — gives a row the highlight style
  rowClassName, // (row) => string — a class of the caller's own on a row, e.g. a status tint
  pageSize, // number — enables pagination; omit to show all rows
  defaultSortKey, // initial sort column key
  defaultSortDir = 'asc',
  className = '',
}) {
  const [sortKey, setSortKey] = useState(defaultSortKey ?? null)
  const [sortDir, setSortDir] = useState(defaultSortDir)
  const [page, setPage] = useState(0)

  // Reset to page 0 when the rows data changes externally
  useEffect(() => {
    setPage(0)
  }, [rows])

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(0)
  }

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows
    return [...rows].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      const cmp =
        typeof va === 'number' && typeof vb === 'number'
          ? va - vb
          : String(va ?? '').localeCompare(String(vb ?? ''))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [rows, sortKey, sortDir])

  const totalPages = pageSize ? Math.ceil(sortedRows.length / pageSize) : 1
  const visibleRows = pageSize
    ? sortedRows.slice(page * pageSize, (page + 1) * pageSize)
    : sortedRows

  const cls = [
    'tbl',
    zebra && 'tbl--zebra',
    compact && 'tbl--compact',
    bordered && 'tbl--bordered',
    flush && 'tbl--flush',
    stickyHeader && 'tbl--sticky',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  function SortIcon({ colKey }) {
    if (sortKey !== colKey) return <span className="tbl-sort-icon tbl-sort-icon--idle">⇅</span>
    return (
      <span className="tbl-sort-icon tbl-sort-icon--active">{sortDir === 'asc' ? '↑' : '↓'}</span>
    )
  }

  const hasPagination = pageSize && totalPages > 1
  const paginationControls = hasPagination ? (
    <nav className="tbl-pagy" aria-label="Pagination">
      <button
        className="tbl-pg-btn"
        onClick={() => setPage((p) => p - 1)}
        disabled={page === 0}
        aria-label="Previous page"
      >
        ‹
      </button>
      {pageSeries(page, totalPages).map((p, i) =>
        p === GAP ? (
          <span key={`gap-${i}`} className="tbl-pg-gap" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            className="tbl-pg-num"
            onClick={() => setPage(p)}
            aria-current={p === page ? 'page' : undefined}
            aria-label={`Page ${p + 1}`}
          >
            {p + 1}
          </button>
        ),
      )}
      <button
        className="tbl-pg-btn"
        onClick={() => setPage((p) => p + 1)}
        disabled={page >= totalPages - 1}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  ) : null

  const tableEl = (
    <table className={cls}>
      {/* A `hideHeader` table still declares its columns — `minWidth` and
          `align` come off them — it just doesn't draw the row. Kept in the DOM
          as `aria-hidden` so the layout the widths produce is unchanged. */}
      <thead aria-hidden={hideHeader || undefined} className={hideHeader ? 'tbl-head--off' : ''}>
        <tr>
          {columns.map((c) => (
            <th
              key={c.key}
              className={[
                'tbl-th',
                c.sortable && 'tbl-th--sortable',
                c.sortable && sortKey === c.key && 'tbl-th--sorted',
                c.align && `tbl-cell--${c.align}`,
              ]
                .filter(Boolean)
                .join(' ')}
              // `width` is only a hint under `table-layout: auto` — a column of
              // long text loses it to siblings that declared theirs. `minWidth`
              // is a floor the layout has to honour.
              style={c.width || c.minWidth ? { width: c.width, minWidth: c.minWidth } : undefined}
              onClick={c.sortable ? () => handleSort(c.key) : undefined}
            >
              {c.label}
              {c.sortable && <SortIcon colKey={c.key} />}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading && (
          <tr>
            <td className="tbl-state" colSpan={columns.length}>
              Loading…
            </td>
          </tr>
        )}
        {!loading &&
          visibleRows.map((row, i) => {
            const isHighlight = highlightRow?.(row)
            return (
              <tr
                key={getRowKey(row, i)}
                className={[
                  'tbl-row',
                  onRowClick && 'tbl-row--clickable',
                  isHighlight && 'tbl-row--highlight',
                  rowClassName?.(row),
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={onRowClick ? (e) => !fromControl(e) && onRowClick(row) : undefined}
              >
                {columns.map((c) => {
                  const value = row[c.key]
                  const content = c.render ? c.render(value, row) : value
                  return (
                    <td key={c.key} className={`tbl-td${c.align ? ` tbl-cell--${c.align}` : ''}`}>
                      {content}
                    </td>
                  )
                })}
              </tr>
            )
          })}
      </tbody>
      {/* Default: pagination rides in the table footer. In scrollX mode it's
          lifted out (below) so it never moves with the horizontal scroll. */}
      {!scrollX && hasPagination && (
        <tfoot>
          <tr>
            <td colSpan={columns.length} className="tbl-pagination">
              {paginationControls}
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  )

  /* A table with nothing in it is not a table — it is a message. Drawn inside
     the grid it used to be a column of headers over one merged cell, which
     reads as a table that failed to load rather than as one with nothing to
     show; there is also nothing for those headers to label. So the empty state
     replaces the table outright, and the header comes back with the first row.
     (`loading` keeps its skeleton rows: there, the columns are about to be
     real.) */
  if (!loading && sortedRows.length === 0) return empty ?? null

  if (!scrollX) return tableEl

  return (
    <div className="tbl-scroll-wrap">
      <div className="tbl-scroll">{tableEl}</div>
      {hasPagination && <div className="tbl-pagination">{paginationControls}</div>}
    </div>
  )
}
