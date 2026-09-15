import { useState } from 'react'
import { Tabs } from '@components/Tabs/Tabs'
import { Flyout, FlyoutSelect } from '@components/Flyout/Flyout'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { Table } from '@components/Table/Table'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
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
import '@components/Flyout/Flyout.css'
import '@components/Button/Button.css'
import '@components/ReaderApp/ReaderApp.css'
import '@components/Table/Table.css'
import '@components/RowAction/RowAction.css'
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
 *
 * What the app doesn't do: the Friends board here also ranks the readers at the
 * site you haven't added, so the board has someone on it to be a ranking
 * against. That makes the last column an action rather than decoration — a
 * friend's row opens their profile, a stranger's row offers to ask them, and
 * one you have already asked says so and waits.
 */

function Rank({ rank }) {
  if (rank > 3) return <span className="lb-rank">{rank}</span>
  return <span className={`lb-medal lb-medal--${rank}`}>{rank}</span>
}

export function Leaderboards({ onOpenFriend, onAddFriend }) {
  const [board, setBoard] = useState('friends')
  const [type, setType] = useState('minutes')
  const [period, setPeriod] = useState('week')
  // Who you've asked from this page, so the button reports back in place
  // rather than the row simply going quiet.
  const [asked, setAsked] = useState([])

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
          {/* Only a friend's name goes anywhere: a profile is something a
              reader lets you see, so a stranger's is a name and a number. */}
          {row.isFriend && onOpenFriend ? (
            <button
              type="button"
              className="lb-name lb-name--link"
              onClick={() => onOpenFriend(row.id)}
            >
              {row.name}
            </button>
          ) : (
            <span className="lb-name">{row.isMe ? `${row.name} (You)` : row.name}</span>
          )}
        </span>
      ),
    },
    {
      key: 'value',
      label: typeDef.column,
      align: 'right',
      render: (v) => <strong className="lb-value">{v.toLocaleString()}</strong>,
    },
    // Only the friends board ranks people, so only it has anything to do with
    // a row.
    ...(board === 'friends'
      ? [
          {
            key: 'id',
            label: '',
            align: 'right',
            width: 64,
            render: (_v, row) => {
              if (row.isMe) return null
              return (
                <RowActions>
                  {row.isFriend ? (
                    <RowAction
                      icon="user"
                      label={`View ${row.name}'s profile`}
                      onClick={() => onOpenFriend?.(row.id)}
                    />
                  ) : row.pending || asked.includes(row.id) ? (
                    /* Already asked — the app's own in-between state, where an
                       invitation is out and nothing more can be done from here.
                       A mark, not a control: `as="span"` keeps the cell and
                       drops the button. */
                    <RowAction
                      as="span"
                      icon="hourglass"
                      label={`Friend request sent to ${row.name}`}
                    />
                  ) : (
                    <RowAction
                      icon="user-plus"
                      label={`Add ${row.name} as a friend`}
                      onClick={() => {
                        setAsked((a) => [...a, row.id])
                        onAddFriend?.(row)
                      }}
                    />
                  )}
                </RowActions>
              )
            },
          },
        ]
      : []),
  ]

  return (
    <div className="lb-page">
      {/* The title stays put while the board changes — the segmented control
          below already says which board you're on, and a heading that grows and
          shrinks pushes the whole page around. */}
      <ReaderPageHead
        title="Leaderboards"
        actions={
          /* A menu of two, the way the rail's leaderboard widget picks its
             range — not a form control. */
          <Flyout
            placement="bottom-end"
            trigger={({ toggle, open }) => (
              <Button
                variant="secondary"
                onClick={toggle}
                aria-haspopup="menu"
                aria-expanded={open}
                iconRight={<Icon name="chevron-down" size={15} stroke={2.2} />}
              >
                {LEADERBOARD_PERIODS.find((p) => p.value === period)?.label}
              </Button>
            )}
          >
            {({ close }) => (
              <FlyoutSelect
                ariaLabel="Which period"
                options={LEADERBOARD_PERIODS.map((p) => ({ id: p.value, label: p.label }))}
                value={period}
                onChange={setPeriod}
                close={close}
              />
            )}
          </Flyout>
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
