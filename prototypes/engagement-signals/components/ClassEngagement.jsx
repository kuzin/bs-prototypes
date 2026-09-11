// The Engagement tab of a classroom page — the scan a teacher does before they
// open anybody's profile: who moved, and which way.
//
// It's a tab on Beanstack's real class page, added through the additive
// `extraTabs`/`renderExtra` slots the Student Profile prototype already
// exposes, rather than a second roster of its own. The reasoning behind a
// reader's signal lives on their profile; this page is the list.
import { useMemo } from 'react'
import { Table } from '@components/Table/Table'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import { TrendChip } from '@components/TrendChip/TrendChip'
import { Banner } from '@components/Primitives/Primitives'
import '@components/RowAction/RowAction.css'
import '@components/TrendChip/TrendChip.css'
import '@components/Primitives/Primitives.css'

import { ROSTER, STUDENT_SIGNALS } from '../data'
import { SignalPill } from './Signal'
import './ClassEngagement.css'

// Triage order — the reason to open the tab sorts to the top. `pending` sits
// second because "we can't tell yet" is also something to act on (usually by
// getting the reader logging), not filler at the bottom of the list.
const RANK = { declining: 0, pending: 1, consistent: 2, increasing: 3 }

export function ClassEngagement({ onOpenStudent }) {
  const rows = useMemo(
    () =>
      ROSTER.map((r) => ({
        ...r,
        rank: RANK[r.signal],
        // Only the three built-out readers have a profile behind them, exactly
        // as the class page's daily-reading table has it.
        openable: Boolean(STUDENT_SIGNALS[r.key]),
      })),
    [],
  )

  const columns = [
    {
      key: 'name',
      label: 'Student',
      sortable: true,
      minWidth: 180,
      render: (v, row) => (
        <span className={`ce-student-name${row.openable ? ' ce-student-name--link' : ''}`}>
          {v}
        </span>
      ),
    },
    {
      // Sorted on the triage rank, not the label — alphabetical would put
      // Consistent above Declining, which is the opposite of the point.
      key: 'rank',
      label: 'Signal',
      sortable: true,
      minWidth: 150,
      render: (_, row) => <SignalPill signal={row.signal} />,
    },
    {
      key: 'days30',
      label: 'Days read (30d)',
      align: 'center',
      sortable: true,
      minWidth: 130,
      render: (v, row) => (
        <span className="ce-num">
          {v}
          <TrendChip delta={row.days30Delta} format={(n) => `${n} days`} />
        </span>
      ),
    },
    {
      key: 'minsWeek',
      label: 'Minutes / week',
      align: 'center',
      sortable: true,
      minWidth: 130,
      render: (v, row) => (
        <span className="ce-num">
          {v}
          <TrendChip delta={row.minsDelta} format={(n) => `${n}%`} />
        </span>
      ),
    },
    { key: 'lastLogged', label: 'Last logged', minWidth: 110 },
    {
      // The app's row actions: an icon apiece, the label in a tooltip because
      // there's no room to write it thirteen times down a column. Both open the
      // real profile — one on the signal, one on what it was read from.
      key: 'actions',
      label: '',
      align: 'right',
      minWidth: 84,
      render: (_, row) => (
        <RowActions>
          <RowAction
            icon="user"
            label={`View ${row.name}'s profile`}
            disabled={!row.openable}
            onClick={(e) => {
              e.stopPropagation()
              onOpenStudent?.(row.key)
            }}
          />
          <RowAction
            icon="reading"
            label={`View ${row.name}'s reading log`}
            disabled={!row.openable}
            onClick={(e) => {
              e.stopPropagation()
              onOpenStudent?.(row.key, 'readinglog')
            }}
          />
        </RowActions>
      ),
    },
  ]

  return (
    <div className="ce">
      {/* The same nightly-calculation caveat the Daily Reading tab carries, for
          the same reason: today's logs aren't in these numbers yet. */}
      <Banner level="info">
        Signals are recalculated nightly. Reading logged today will be reflected tomorrow.
      </Banner>

      <Table
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.key}
        defaultSortKey="rank"
        defaultSortDir="asc"
        onRowClick={(r) => r.openable && onOpenStudent?.(r.key)}
        highlightRow={(r) => r.signal === 'declining'}
        zebra
        scrollX
      />
    </div>
  )
}
