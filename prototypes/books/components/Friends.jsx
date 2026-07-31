import { useState, useEffect, useRef } from 'react'
import { Tabs } from '@components/Tabs/Tabs'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Table } from '@components/Table/Table'
import { CustomSelect } from '@components/CustomSelect/CustomSelect'
import { Modal } from '@components/Modal/Modal'
import {
  FRIENDS,
  PENDING_INVITES,
  LEADERBOARD_BOARDS,
  LEADERBOARD_PERIODS,
  leaderboardRows,
} from '../data'

// Friends & Leaderboards, modelled on the live Beanstack reader screens: an
// avatar-tile grid with a per-card kebab menu, and a ranked leaderboard table
// with medal coins for the podium.

// ── Friend tile ───────────────────────────────────────────────────────────────

function FriendTile({ person, onOpen, onRemove }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef(null)

  // Dismiss the kebab menu on any outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setMenuOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const pending = person.pending

  return (
    <div
      className={`bk-ftile${pending ? ' is-pending' : ''}`}
      ref={ref}
      style={pending ? undefined : { '--tint': person.color }}
    >
      {/* The whole card is the hit target; the kebab sits above it. */}
      <button
        className="bk-ftile-hit"
        onClick={() => !pending && onOpen(person.id)}
        disabled={pending}
        aria-label={pending ? `${person.name} — pending invite` : `View ${person.name}`}
      >
        <span className="bk-ftile-banner" />
        <span
          className="bk-ftile-avatar"
          style={pending ? undefined : { background: person.color }}
        >
          {person.avatar ? (
            <img src={person.avatar} alt="" />
          ) : (
            <span className="bk-ftile-initials">{person.initials}</span>
          )}
        </span>
        <span className="bk-ftile-foot">
          <span className="bk-ftile-name">{person.name}</span>
          {pending ? (
            <span className="bk-ftile-pending">Pending Invite</span>
          ) : (
            <span className="bk-ftile-meta">{person.grade}</span>
          )}
        </span>
      </button>

      <button
        className="bk-ftile-kebab"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label={`Options for ${person.name}`}
        aria-expanded={menuOpen}
      >
        <Icon name="dots-vertical" size={17} />
      </button>
      {menuOpen && (
        <div className="bk-ftile-menu" role="menu">
          {!pending && (
            <button
              role="menuitem"
              onClick={() => {
                setMenuOpen(false)
                onOpen(person.id)
              }}
            >
              View Friend
            </button>
          )}
          <button
            role="menuitem"
            className="bk-ftile-menu-danger"
            onClick={() => {
              setMenuOpen(false)
              onRemove(person.id)
            }}
          >
            {pending ? 'Cancel Invite' : 'Remove Friend'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Leaderboards ──────────────────────────────────────────────────────────────

function MedalRank({ rank }) {
  if (rank > 3) return <span className="bk-lbrank">{rank}</span>
  return <span className={`bk-lbmedal bk-lbmedal--${rank}`}>{rank}</span>
}

function Leaderboards({ onOpen }) {
  const [boardId, setBoardId] = useState('minutes')
  const [period, setPeriod] = useState('week')
  const board = LEADERBOARD_BOARDS.find((b) => b.id === boardId)
  const rows = leaderboardRows(boardId, period)

  const columns = [
    {
      key: 'rank',
      label: 'Rank',
      width: 78, // just the medal — keep Reader right beside it
      render: (v) => <MedalRank rank={v} />,
    },
    {
      key: 'name',
      label: 'Reader',
      render: (_v, row) => (
        <span className="bk-lbreader">
          <span className="bk-lbavatar" style={{ background: row.color }}>
            {row.avatar ? <img src={row.avatar} alt="" /> : row.initials}
          </span>
          {row.isMe ? (
            <span className="bk-lbname">{`${row.name} (You)`}</span>
          ) : (
            <button className="bk-lbname bk-lbname--link" onClick={() => onOpen(row.id)}>
              {row.name}
            </button>
          )}
        </span>
      ),
    },
    {
      key: 'value',
      label: board.column,
      align: 'right',
      render: (v) => <strong className="bk-lbvalue">{v.toLocaleString()}</strong>,
    },
  ]

  return (
    <>
      <header className="bk-shelfpage-head bk-lb-head">
        <div className="bk-shelfpage-title">
          <h1>Leaderboards</h1>
        </div>
        <div className="bk-lb-period">
          <CustomSelect options={LEADERBOARD_PERIODS} value={period} onChange={setPeriod} />
        </div>
      </header>

      <div className="bk-lb-boardtabs">
        <Tabs
          variant="underline"
          size="md"
          active={boardId}
          accent="#0D9488"
          onChange={setBoardId}
          items={LEADERBOARD_BOARDS.map((b) => ({ id: b.id, label: b.label }))}
        />
      </div>

      <Table
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        highlightRow={(r) => r.isMe}
        className="bk-lbtable"
      />
    </>
  )
}

// ── Add a friend ──────────────────────────────────────────────────────────────

function InviteModal({ open, onClose }) {
  const [name, setName] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (open) {
      setName('')
      setSent(false)
    }
  }, [open])

  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel="Invite a friend">
      <div className="bk-invite">
        <button className="bk-invite-close" onClick={onClose} aria-label="Close">
          <Icon name="x" size={17} />
        </button>
        {sent ? (
          <>
            <span className="bk-invite-sentmark">
              <Icon name="check" size={26} stroke={2.6} />
            </span>
            <h2>Invite sent!</h2>
            <p>
              We let <strong>{name}</strong> know you want to read together.
            </p>
            <Button variant="primary" size="md" onClick={onClose}>
              Done
            </Button>
          </>
        ) : (
          <>
            <h2>Invite a Friend</h2>
            <p>Enter your friend&apos;s name below to send them an invite!</p>
            <label className="bk-invite-field">
              <span>Student Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amy"
                autoFocus
              />
            </label>
            <Button
              variant="primary"
              size="md"
              disabled={!name.trim()}
              onClick={() => setSent(true)}
            >
              Send Invite
            </Button>
          </>
        )}
      </div>
    </Modal>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function Friends({ onOpenProfile }) {
  const [pane, setPane] = useState('friends')
  const [removed, setRemoved] = useState([])
  const [inviteOpen, setInviteOpen] = useState(false)

  const friends = FRIENDS.filter((f) => !removed.includes(f.id))
  const pending = PENDING_INVITES.filter((p) => !removed.includes(p.id))
  const remove = (id) => setRemoved((r) => [...r, id])

  return (
    <>
      {/* full-bleed band, so the switcher reads as chrome rather than page content */}
      <div className="bk-friends-band">
        <Tabs
          variant="pill"
          size="md"
          active={pane}
          accent="#0D9488"
          onChange={setPane}
          items={[
            { id: 'friends', label: 'Friends' },
            { id: 'leaderboards', label: 'Leaderboards' },
          ]}
        />
      </div>

      <div className="bk-shelfpage">
        {pane === 'friends' ? (
          <>
            <header className="bk-shelfpage-head">
              <div className="bk-shelfpage-title">
                <h1>Friends</h1>
                <p>
                  {friends.length} {friends.length === 1 ? 'Friend' : 'Friends'}
                </p>
              </div>
              <Button
                variant="secondary"
                size="md"
                icon={<Icon name="plus" size={15} />}
                onClick={() => setInviteOpen(true)}
              >
                Invite Friends
              </Button>
            </header>

            <div className="bk-ftile-grid">
              {friends.map((f) => (
                <FriendTile key={f.id} person={f} onOpen={onOpenProfile} onRemove={remove} />
              ))}
              {pending.map((p) => (
                <FriendTile key={p.id} person={p} onOpen={onOpenProfile} onRemove={remove} />
              ))}
            </div>
          </>
        ) : (
          <Leaderboards onOpen={onOpenProfile} />
        )}

        <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
      </div>
    </>
  )
}
