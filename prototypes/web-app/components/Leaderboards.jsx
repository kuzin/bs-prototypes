import { useState } from 'react'
import { Tabs } from '@components/Tabs/Tabs'
import { Table } from '@components/Table/Table'
import { Avatar } from '@components/Avatar/Avatar'
import { CustomSelect } from '@components/CustomSelect/CustomSelect'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'

import {
  LEADERBOARD_BOARDS,
  LEADERBOARD_PERIODS,
  LEADERBOARD_TYPES,
  leaderboardRows,
} from '../data'
import './Friends.css'

import '@components/Tabs/Tabs.css'
import '@components/Table/Table.css'
import '@components/Avatar/Avatar.css'
import '@components/CustomSelect/CustomSelect.css'

/**
 * Leaderboards — `leaderboards/index.html.haml`.
 *
 * Three boards over one table. The app's own tabs are Friends / Grade /
 * School, and they rank three different things: the friends board ranks
 * readers, the other two rank the grades and schools against each other, which
 * is why the second column's header changes with the board.
 *
 * The podium rows get a coin rather than a number, and the reader's own row is
 * highlighted and suffixed "(You)" — both straight from the app.
 */

function Rank({ rank }) {
  if (rank > 3) return <span className="lb-rank">{rank}</span>
  return <span className={`lb-medal lb-medal--${rank}`}>{rank}</span>
}

export function Leaderboards() {
  const [board, setBoard] = useState('friends')
  const [type, setType] = useState('minutes')
  const [period, setPeriod] = useState('week')

  const boardLabel = LEADERBOARD_BOARDS.find((b) => b.id === board).label
  const typeDef = LEADERBOARD_TYPES.find((t) => t.id === type)
  const rows = leaderboardRows(board, type, period)

  const columns = [
    {
      key: 'rank',
      label: 'Rank',
      // Just wide enough for the coin, so the name sits right beside it.
      width: 78,
      render: (v) => <Rank rank={v} />,
    },
    {
      key: 'name',
      // The app relabels this column per board — it is not always a reader.
      label: board === 'friends' ? 'Reader' : boardLabel,
      render: (_v, row) => (
        <span className="lb-who">
          {board === 'friends' && (
            <Avatar
              initials={row.initials}
              src={row.avatar ?? undefined}
              color={row.color}
              size="md"
              shape="circle"
            />
          )}
          <span className="lb-name">{row.isMe ? `${row.name} (You)` : row.name}</span>
        </span>
      ),
    },
    {
      key: 'value',
      label: typeDef.column,
      align: 'right',
      render: (v) => <strong className="lb-value">{v.toLocaleString()}</strong>,
    },
  ]

  return (
    <div className="lb-page">
      {/* The title stays put while the board changes — the segmented control
          below already says which board you're on, and a heading that grows and
          shrinks pushes the whole page around. */}
      <ReaderPageHead
        title="Leaderboards"
        count="See how you stack up against your friends, grade and school."
        actions={
          <div className="lb-period">
            <CustomSelect options={LEADERBOARD_PERIODS} value={period} onChange={setPeriod} />
          </div>
        }
      />

      {/* Which board and which log type are the same kind of choice — two
          segmented controls on one row, not a nav above a filter. */}
      <div className="lb-controls">
        <Tabs
          variant="pill"
          size="md"
          active={board}
          accent="#1A6DD5"
          onChange={setBoard}
          ariaLabel="Which leaderboard"
          items={LEADERBOARD_BOARDS}
        />
        <Tabs
          variant="pill"
          size="md"
          active={type}
          accent="#1A6DD5"
          onChange={setType}
          ariaLabel="Which log type"
          items={LEADERBOARD_TYPES.map((t) => ({ id: t.id, label: t.label }))}
        />
      </div>

      <Table
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        highlightRow={(r) => r.isMe}
        className="lb-table"
      />
    </div>
  )
}
