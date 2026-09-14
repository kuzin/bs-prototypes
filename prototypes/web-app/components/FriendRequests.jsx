import { useEffect, useRef, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Avatar } from '@components/Avatar/Avatar'
import { Modal } from '@components/Modal/Modal'

import { BeamingFace, RequestSwashes } from './FriendRequestArt'
import './FriendRequests.css'

import '@components/Avatar/Avatar.css'
import '@components/Modal/Modal.css'

/**
 * Waiting friend requests — `profiles/_friend_requests.html.haml`.
 *
 * The bar itself only announces: the beaming-face emoji in a white disc, "You
 * have N new friend request(s)!", and a **View Requests** dropdown at the far
 * right. The requests live in the menu that opens under it, one row each — a
 * 44px avatar, the name, then Accept and Decline as hollow buttons.
 *
 * Declining asks first ("Are you sure you want to decline the friend request
 * from Maya C.?" → Decline / Cancel); accepting doesn't. Either way the app
 * answers with a toast rather than changing the page under you, and the menu
 * stays open so a reader can work through a queue of them.
 *
 * The amber ground (#FFEDC8) and the swashes behind it are the app's own — this
 * is the one cheerful bar in the reader app, and it is cheerful on purpose.
 */
export function FriendRequests({ requests, onAccept, onDecline }) {
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(null)
  const wrapRef = useRef(null)

  // The app closes the menu on any click outside it, but deliberately not on a
  // click inside a row — the buttons there are what the menu is for.
  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (requests.length === 0) return null

  const plural = requests.length === 1 ? '' : 's'

  return (
    <div className="fq" ref={wrapRef}>
      <div className="fq-bar">
        <span className="fq-swash-wrap" aria-hidden="true">
          <RequestSwashes />
        </span>
        <div className="fq-bar-content">
          <div className="fq-title">
            <span className="fq-face-disc" aria-hidden="true">
              <BeamingFace />
            </span>
            You have {requests.length} new friend request{plural}!
          </div>
          <button
            type="button"
            className="fq-trigger"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-haspopup="listbox"
          >
            <span className="fq-trigger-text">View Request{plural}</span>
            <Icon name="chevron-down" size={18} stroke={2.4} />
          </button>
        </div>
      </div>

      <div className={`fq-menu${open ? ' is-open' : ''}`} role="listbox">
        {requests.map((r) => (
          <div className="fq-item" key={r.id} role="option" aria-selected="false">
            <Avatar initials={r.initials} color={r.color} size="lg" shape="circle" />
            <div className="fq-item-friend">
              <span className="fq-item-name">{r.name}</span>
              <div className="fq-item-buttons">
                <button type="button" className="fq-btn fq-btn--accept" onClick={() => onAccept(r)}>
                  Accept
                </button>
                <button
                  type="button"
                  className="fq-btn fq-btn--decline"
                  onClick={() => setConfirming(r)}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Declining asks first — the app opens this over the page. */}
      <Modal
        open={Boolean(confirming)}
        onClose={() => setConfirming(null)}
        variant="center"
        ariaLabel="Decline friend request"
      >
        {confirming && (
          <div className="fq-deny">
            <p className="fq-deny-head">
              Are you sure you want to decline the friend request from {confirming.name}?
            </p>
            <div className="fq-deny-buttons">
              <button
                type="button"
                className="fq-btn fq-btn--accept"
                onClick={() => {
                  onDecline(confirming)
                  setConfirming(null)
                }}
              >
                Decline
              </button>
              <button
                type="button"
                className="fq-btn fq-btn--cancel"
                onClick={() => setConfirming(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
