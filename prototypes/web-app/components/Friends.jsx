import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Tabs } from '@components/Tabs/Tabs'
import { ReaderPageHead } from '@components/ReaderApp/ReaderApp'
import { Avatar } from '@components/Avatar/Avatar'
import { Button } from '@components/Button/Button'
import { Pill } from '@components/Pill/Pill'
import { Modal } from '@components/Modal/Modal'
import { Flyout } from '@components/Flyout/Flyout'
import { Input } from '@components/Form/Form'
import { ToastStack, useToasts } from '@components/Toast/Toast'

import { FriendRequests } from './FriendRequests'

import { Leaderboards } from './Leaderboards'
import { FRIENDS, FRIEND_REQUESTS, PENDING_INVITES } from '../data'
import './Friends.css'

import '@components/Avatar/Avatar.css'
import '@components/Button/Button.css'
import '@components/Pill/Pill.css'
import '@components/Modal/Modal.css'
import '@components/Flyout/Flyout.css'
import '@components/Form/Form.css'
import '@components/Toast/Toast.css'
import '@components/Tabs/Tabs.css'

/**
 * Friends — `profiles/friends.html.haml`.
 *
 * One card per friend: a band in their own color, their avatar or initials
 * hanging over it, their name, and their current streak. A pending invite is
 * the same card gone gray with a "Pending Invite" tag where the streak sits.
 * The kebab carries the two things the app offers — view, and remove (or
 * cancel, on an invite that hasn't been accepted).
 *
 * This is a school site, so the action reads "Invite Friends"; a library site
 * gets "Add Friends" over a friend-code dropdown instead.
 *
 * Leaderboards live under here rather than beside it in the main nav — the
 * profile pairs them on one page (`_friends_and_leaderboard_tabs.html.haml`:
 * "Friends" | "Leaderboard"), and they are two views of the same people.
 */

function FriendCard({ person, onRemove }) {
  const pending = Boolean(person.pending)

  return (
    <div className={`fr-card${pending ? ' is-pending' : ''}`}>
      <span className="fr-card-band" style={pending ? undefined : { '--tint': person.color }} />

      {/* The Flyout's own wrapper is in normal flow, so the corner placement
          goes on a slot around it rather than on the trigger itself. */}
      <span className="fr-card-menuslot">
        <Flyout
          placement="bottom-end"
          trigger={({ toggle }) => (
            <button
              type="button"
              className="fr-card-kebab"
              onClick={toggle}
              aria-label={`Options for ${person.name}`}
            >
              <Icon name="dots" size={17} />
            </button>
          )}
        >
          {({ close }) => (
            <div className="fr-menu">
              {!pending && (
                <button type="button" onClick={close}>
                  View Friend
                </button>
              )}
              <button
                type="button"
                className="fr-menu-danger"
                onClick={() => {
                  close()
                  onRemove(person.id)
                }}
              >
                {pending ? 'Cancel this Invitation' : 'Remove Friend'}
              </button>
            </div>
          )}
        </Flyout>
      </span>

      <Avatar
        initials={person.initials}
        src={person.avatar ?? undefined}
        color={pending ? '#DFE3E8' : person.color}
        size="xl"
        className="fr-card-avatar"
      />

      <div className="fr-card-foot">
        <span className="fr-card-name">{person.name}</span>
        <span className="fr-card-grade">{person.grade}</span>
        {pending ? (
          <Pill color="#656565" variant="soft" size="sm">
            Pending Invite
          </Pill>
        ) : (
          <span className={`fr-card-streak${person.streak ? '' : ' is-none'}`}>
            <Icon name="flame-filled" size={15} />
            {person.streak}
          </span>
        )}
      </div>
    </div>
  )
}

function InviteModal({ open, onClose }) {
  const [name, setName] = useState('')
  const [sent, setSent] = useState(false)

  const close = () => {
    onClose()
    // Reset once the panel is out of sight rather than under the reader.
    setTimeout(() => {
      setName('')
      setSent(false)
    }, 200)
  }

  return (
    <Modal open={open} onClose={close} variant="center" ariaLabel="Invite a friend">
      <div className="fr-invite">
        <button type="button" className="fr-invite-close" onClick={close} aria-label="Close">
          <Icon name="x" size={17} />
        </button>
        {sent ? (
          <>
            <span className="fr-invite-sent">
              <Icon name="check" size={26} stroke={2.6} />
            </span>
            <h2>Invite sent!</h2>
            <p>
              We let <strong>{name}</strong> know you want to read together.
            </p>
            <Button variant="primary" size="md" onClick={close}>
              Done
            </Button>
          </>
        ) : (
          <>
            <h2>Invite Friends</h2>
            <p>Enter your friend&apos;s name below to send them an invite!</p>
            <Input
              label="Student Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Amy"
            />
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

export function Friends() {
  const [pane, setPane] = useState('friends')
  const [removed, setRemoved] = useState([])
  const [inviteOpen, setInviteOpen] = useState(false)
  const [requests, setRequests] = useState(FRIEND_REQUESTS)
  const { toasts, push, dismiss } = useToasts()

  // The app answers either way with a toast rather than reloading the page —
  // "Accepted friend request from Maya C." / "Declined …". The app appends the
  // full stop unconditionally; these readers are "Maya C.", so it only goes on
  // when the name hasn't already ended the sentence.
  const answer = (person, accepted) => {
    setRequests((q) => q.filter((x) => x.id !== person.id))
    push({
      tone: accepted ? 'success' : 'info',
      title:
        `${accepted ? 'Accepted' : 'Declined'} friend request from ${person.name}` +
        (person.name.endsWith('.') ? '' : '.'),
    })
  }

  const friends = FRIENDS.filter((f) => !removed.includes(f.id))
  const pending = PENDING_INVITES.filter((p) => !removed.includes(p.id))
  const remove = (id) => setRemoved((r) => [...r, id])

  return (
    <>
      {/* The same full-bleed band the Reading Log and Collections use for
          their own sub-tabs, so all three sit in the same place. */}
      <div className="co-subtabs">
        <Tabs
          variant="pill"
          plain
          size="md"
          active={pane}
          onChange={setPane}
          accent="#1A6DD5"
          ariaLabel="Friends or leaderboards"
          items={[
            { id: 'friends', label: 'Friends', count: friends.length },
            { id: 'leaderboards', label: 'Leaderboards' },
          ]}
        />
      </div>

      {pane === 'leaderboards' ? (
        <Leaderboards />
      ) : (
        <div className="fr-page">
          <ReaderPageHead
            title="Friends"
            count={`${friends.length} ${friends.length === 1 ? 'Friend' : 'Friends'}`}
            actions={
              <Button
                variant="secondary"
                size="md"
                icon={<Icon name="plus" size={15} />}
                onClick={() => setInviteOpen(true)}
              >
                Invite Friends
              </Button>
            }
          />

          <FriendRequests
            requests={requests}
            onAccept={(p) => answer(p, true)}
            onDecline={(p) => answer(p, false)}
          />

          <div className="fr-grid">
            {friends.map((f) => (
              <FriendCard key={f.id} person={f} onRemove={remove} />
            ))}
            {pending.map((p) => (
              <FriendCard key={p.id} person={p} onRemove={remove} />
            ))}
          </div>

          <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
          <ToastStack toasts={toasts} onDismiss={dismiss} />
        </div>
      )}
    </>
  )
}
