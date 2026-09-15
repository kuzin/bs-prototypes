import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Tabs } from '@components/Tabs/Tabs'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'
import { Avatar } from '@components/Avatar/Avatar'
import { Button } from '@components/Button/Button'
import { Pill } from '@components/Pill/Pill'
import { Modal, ModalClose } from '@components/Modal/Modal'
import { Flyout, FlyoutMenu, FlyoutMenuItem } from '@components/Flyout/Flyout'
import { Input } from '@components/Form/Form'
import { ToastStack, useToasts } from '@components/Toast/Toast'

import { FriendRequests } from '@components/FriendRequests/FriendRequests'
import { FriendProfile } from './FriendProfile'

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
 * The one action differs by site (`@is_library_site`): a school invites by
 * email, a **library** hands out **friend codes** — "Add Friends" over a menu
 * of "Share Your Friend Code" and "Enter a Friend Code". A library can't ask a
 * child for somebody else's email address, so the code is the introduction.
 *
 * Leaderboards live under here rather than beside it in the main nav — the
 * profile pairs them on one page (`_friends_and_leaderboard_tabs.html.haml`:
 * "Friends" | "Leaderboard"), and they are two views of the same people.
 */

function FriendCard({ person, onRemove, onOpen }) {
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
                <button
                  type="button"
                  onClick={() => {
                    close()
                    onOpen(person.id)
                  }}
                >
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

      {/* The whole card opens the profile, the way the app's does; a pending
          invite has no profile to open yet. */}
      <button
        type="button"
        className="fr-card-hit"
        onClick={() => !pending && onOpen(person.id)}
        disabled={pending}
        aria-label={pending ? `${person.name} — pending invite` : `View ${person.name}`}
      />

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
        {/* The streak and a pending invite share this slot, so they are the
            same object: a soft pill, the streak in flame red and the invite in
            grey. A bare red number beside a pill read as two different kinds of
            thing in the same place. */}
        {pending ? (
          <Pill color="#656565" variant="soft" size="sm" className="fr-card-tag">
            Pending Invite
          </Pill>
        ) : (
          <Pill
            color={person.streak ? '#dc493a' : '#acacac'}
            variant="soft"
            size="sm"
            className="fr-card-tag"
            icon={<Icon name="flame-filled" size={14} />}
          >
            {person.streak}
          </Pill>
        )}
      </div>
    </div>
  )
}

/**
 * A library's way in — `friend_codes/`. There is no email address to ask a
 * child for, so two readers swap a code instead: one shares theirs, the other
 * types it in. The privacy notice is the app's own, and it is why the feature
 * exists in this shape.
 */
function FriendCodeModal({ mode, onClose }) {
  const [code, setCode] = useState('')
  const share = mode === 'share'

  return (
    <Modal
      open={Boolean(mode)}
      onClose={onClose}
      variant="center"
      closeBadge
      ariaLabel={share ? 'Your friend code' : 'Enter a friend code'}
    >
      <ModalClose onClick={onClose} />
      <div className="modal-header modal-header--flush">
        <h2 className="modal-title">{share ? 'Share Your Friend Code' : 'Enter a Friend Code'}</h2>
      </div>
      <div className="modal-body">
        {share ? (
          <>
            <p className="fr-code-lede">
              Give this to a friend and they can add you. It is the only thing they need — no email
              address, and nothing that says where you go to school.
            </p>
            <p className="fr-code">MAGNOLIA-4F7K</p>
            <p className="fr-code-note">
              Codes can be refreshed from your profile if you ever want to stop one working.
            </p>
          </>
        ) : (
          <>
            <p className="fr-code-lede">
              Type the code a friend gave you and we&apos;ll send them a request.
            </p>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. MAGNOLIA-4F7K"
              aria-label="Friend code"
            />
          </>
        )}
      </div>
      <div className="modal-footer">
        {share ? (
          <Button onClick={onClose}>Copy Code</Button>
        ) : (
          <Button disabled={!code.trim()} onClick={onClose}>
            Send Request
          </Button>
        )}
      </div>
    </Modal>
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

export function Friends({ library = false }) {
  const [pane, setPane] = useState('friends')
  const [removed, setRemoved] = useState([])
  const [inviteOpen, setInviteOpen] = useState(false)
  // 'share' | 'enter' — a library's two halves of the friend-code exchange.
  const [codeOpen, setCodeOpen] = useState(null)
  const [requests, setRequests] = useState(FRIEND_REQUESTS)
  const [profileId, setProfileId] = useState(null)
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
        <Leaderboards onOpenFriend={setProfileId} />
      ) : (
        <div className="fr-page">
          <ReaderPageHead
            title="Friends"
            actions={
              library ? (
                <Flyout
                  placement="bottom-end"
                  trigger={({ toggle, open }) => (
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={toggle}
                      aria-haspopup="menu"
                      aria-expanded={open}
                      iconRight={<Icon name="chevron-down" size={15} stroke={2.2} />}
                    >
                      Add Friends
                    </Button>
                  )}
                >
                  {({ close }) => (
                    <FlyoutMenu>
                      <FlyoutMenuItem
                        onClick={() => {
                          close()
                          setCodeOpen('share')
                        }}
                      >
                        Share Your Friend Code
                      </FlyoutMenuItem>
                      <FlyoutMenuItem
                        onClick={() => {
                          close()
                          setCodeOpen('enter')
                        }}
                      >
                        Enter a Friend Code
                      </FlyoutMenuItem>
                    </FlyoutMenu>
                  )}
                </Flyout>
              ) : (
                <Button
                  variant="secondary"
                  size="md"
                  icon={<Icon name="plus" size={15} />}
                  onClick={() => setInviteOpen(true)}
                >
                  Invite Friends
                </Button>
              )
            }
          />

          <FriendCodeModal mode={codeOpen} onClose={() => setCodeOpen(null)} />

          <FriendRequests
            requests={requests}
            onAccept={(p) => answer(p, true)}
            onDecline={(p) => answer(p, false)}
          />

          <div className="fr-grid">
            {friends.map((f) => (
              <FriendCard key={f.id} person={f} onRemove={remove} onOpen={setProfileId} />
            ))}
            {pending.map((p) => (
              <FriendCard key={p.id} person={p} onRemove={remove} onOpen={setProfileId} />
            ))}
          </div>

          <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
          <FriendProfile friendId={profileId} onClose={() => setProfileId(null)} />
          <ToastStack toasts={toasts} onDismiss={dismiss} />
        </div>
      )}
    </>
  )
}
