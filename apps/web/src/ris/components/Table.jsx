import './Table.css'

/**
 * <Table
 *   columns={[
 *     { key: 'name',  label: 'School' },
 *     { key: 'score', label: 'RMI', align: 'right' },
 *     { key: 'delta', label: 'Δ',   align: 'right', render: v => <DeltaPill v={v} /> },
 *   ]}
 *   rows={[{ name: 'Lincoln', score: 71, delta: 7 }, …]}
 *   getRowKey={r => r.id}
 *   onRowClick={r => openSchool(r.id)}
 *   zebra
 * />
 */
export function Table({
  columns,
  rows,
  getRowKey = (r, i) => r.id ?? i,
  onRowClick,
  zebra = false,
  compact = false,
  className = '',
}) {
  return (
    <table className={`tbl${zebra ? ' tbl--zebra' : ''}${compact ? ' tbl--compact' : ''} ${className}`}>
      <thead>
        <tr>
          {columns.map(c => (
            <th key={c.key} className={`tbl-th${c.align ? ` tbl-cell--${c.align}` : ''}`} style={c.width ? { width: c.width } : undefined}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={getRowKey(row, i)}
            className={onRowClick ? 'tbl-row tbl-row--clickable' : 'tbl-row'}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {columns.map(c => {
              const value = row[c.key]
              const content = c.render ? c.render(value, row) : value
              return (
                <td key={c.key} className={`tbl-td${c.align ? ` tbl-cell--${c.align}` : ''}`}>
                  {content}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
