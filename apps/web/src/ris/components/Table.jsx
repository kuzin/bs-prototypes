import { useState, useMemo, useEffect } from 'react'
import './Table.css'

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
export function Table({
  columns,
  rows,
  getRowKey = (r, i) => r.id ?? i,
  onRowClick,
  zebra = false,
  compact = false,
  bordered = false,
  flush = false,         // remove outer border + radius — use inside ChartCard bodyPad="flush"
  collapse = false,      // on narrow viewports, collapse each row to a stacked card (label : value)
  scrollX = false,       // wrap the table in a horizontal scroller; pagination stays pinned outside it
  stickyHeader = false,
  loading = false,
  empty,                 // string | node — shown when rows is empty
  highlightRow,          // (row) => bool — gives a row the highlight style
  pageSize,              // number — enables pagination; omit to show all rows
  defaultSortKey,        // initial sort column key
  defaultSortDir = 'asc',
  className = '',
}) {
  const [sortKey, setSortKey] = useState(defaultSortKey ?? null)
  const [sortDir, setSortDir] = useState(defaultSortDir)
  const [page, setPage]       = useState(0)

  // Reset to page 0 when the rows data changes externally
  useEffect(() => { setPage(0) }, [rows])

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
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
      const cmp = (typeof va === 'number' && typeof vb === 'number')
        ? va - vb
        : String(va ?? '').localeCompare(String(vb ?? ''))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [rows, sortKey, sortDir])

  const totalPages  = pageSize ? Math.ceil(sortedRows.length / pageSize) : 1
  const visibleRows = pageSize
    ? sortedRows.slice(page * pageSize, (page + 1) * pageSize)
    : sortedRows

  const cls = [
    'tbl',
    zebra && 'tbl--zebra',
    compact && 'tbl--compact',
    bordered && 'tbl--bordered',
    flush && 'tbl--flush',
    collapse && 'tbl--collapse',
    stickyHeader && 'tbl--sticky',
    className,
  ].filter(Boolean).join(' ')

  function SortIcon({ colKey }) {
    if (sortKey !== colKey) return <span className="tbl-sort-icon tbl-sort-icon--idle">⇅</span>
    return <span className="tbl-sort-icon tbl-sort-icon--active">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const hasPagination = pageSize && totalPages > 1
  const paginationControls = hasPagination ? (
    <>
      <button
        className="tbl-pg-btn"
        onClick={() => setPage(p => p - 1)}
        disabled={page === 0}
        aria-label="Previous page"
      >‹</button>
      <span className="tbl-pg-info">
        {page + 1} <span className="tbl-pg-sep">/</span> {totalPages}
      </span>
      <button
        className="tbl-pg-btn"
        onClick={() => setPage(p => p + 1)}
        disabled={page >= totalPages - 1}
        aria-label="Next page"
      >›</button>
    </>
  ) : null

  const tableEl = (
    <table className={cls}>
      <thead>
        <tr>
          {columns.map(c => (
            <th
              key={c.key}
              className={[
                'tbl-th',
                c.sortable && 'tbl-th--sortable',
                c.sortable && sortKey === c.key && 'tbl-th--sorted',
                c.align && `tbl-cell--${c.align}`,
              ].filter(Boolean).join(' ')}
              style={c.width ? { width: c.width } : undefined}
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
          <tr><td className="tbl-state" colSpan={columns.length}>Loading…</td></tr>
        )}
        {!loading && sortedRows.length === 0 && (
          <tr><td className="tbl-state" colSpan={columns.length}>{empty ?? 'No rows'}</td></tr>
        )}
        {!loading && visibleRows.map((row, i) => {
          const isHighlight = highlightRow?.(row)
          return (
            <tr
              key={getRowKey(row, i)}
              className={[
                'tbl-row',
                onRowClick && 'tbl-row--clickable',
                isHighlight && 'tbl-row--highlight',
              ].filter(Boolean).join(' ')}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map(c => {
                const value = row[c.key]
                const content = c.render ? c.render(value, row) : value
                return (
                  <td
                    key={c.key}
                    className={`tbl-td${c.align ? ` tbl-cell--${c.align}` : ''}`}
                    data-label={typeof c.label === 'string' ? c.label : undefined}
                  >
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

  if (!scrollX) return tableEl

  return (
    <div className="tbl-scroll-wrap">
      <div className="tbl-scroll">{tableEl}</div>
      {hasPagination && <div className="tbl-pagination">{paginationControls}</div>}
    </div>
  )
}
