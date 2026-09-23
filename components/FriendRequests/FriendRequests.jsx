import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Avatar } from '@components/Avatar/Avatar'
import { Button } from '@components/Button/Button'
import { Flyout } from '@components/Flyout/Flyout'
import { Modal } from '@components/Modal/Modal'
import { ReaderBanner, ReaderBannerAction } from '@components/ReaderApp/ReaderApp'

import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'
import '@components/FriendRequests/FriendRequests.css'

import '@components/Avatar/Avatar.css'
import '@components/Button/Button.css'
import '@components/Flyout/Flyout.css'
import '@components/Modal/Modal.css'
import '@components/ReaderApp/ReaderApp.css'

/**
 * Waiting friend requests — `profiles/_friend_requests.html.haml`.
 *
 * The bar itself only announces: the beaming-face emoji in a white disc, "You
 * have N new friend request(s)!", and a **View Requests** dropdown at the far
 * right. The requests live in the menu that opens under it, one row each — a
 * 44px avatar, the name, then Accept and Decline as hollow buttons.
 *
 * Declining asks first ("Are you sure you want to decline the friend request
 * from Maya C.?" → Decline / Cancel); accepting doesn't. Either way the menu
 * stays open so a reader can work through a queue of them.
 *
 * The amber ground (#FFEDC8) is the app's own — this is the one cheerful bar in
 * the reader app, and it is cheerful on purpose. (The app draws swashes across
 * its right end too; they went when the bars were unified, because none of the
 * others carry artwork and the stack reads better without the one that did.)
 *
 * Shared rather than web-app's own: the app shows this bar on the Challenges
 * page as well as over the Friends grid, because Challenges is the page a
 * reader lands on.
 */
export function FriendRequests({ requests, onAccept, onDecline }) {
  const [confirming, setConfirming] = useState(null)

  if (requests.length === 0) return null

  const plural = requests.length === 1 ? '' : 's'

  return (
    <div className="fq">
      {/* The bar is the reader app's own — only the mark is this one's, and it
          is the same Plumpy pack every other icon here comes from rather than
          a one-off emoji. The queue behind "View Requests" is a `Flyout` on
          its row style: each request is a subject with two answers, not an item
          you pick. */}
      <Flyout
        placement="bottom-end"
        trigger={({ toggle, open }) => (
          <ReaderBanner
            tone="amber"
            className="fq-bar"
            mark={<PlumpyIcon name="happy" size={24} className="fq-face" />}
            title={
              <strong>
                You have {requests.length} new friend request{plural}!
              </strong>
            }
            action={
              <ReaderBannerAction
                onClick={toggle}
                aria-expanded={open}
                aria-haspopup="menu"
                iconRight={<Icon name="chevron-down" size={16} stroke={2.4} />}
              >
                View Request{plural}
              </ReaderBannerAction>
            }
          />
        )}
      >
        {() => (
          <div className="flyout-rows" role="menu">
            {requests.map((r) => (
              <div className="flyout-row" key={r.id} role="menuitem">
                <Avatar initials={r.initials} color={r.color} size="lg" shape="circle" />
                <div className="flyout-row-body">
                  <span className="flyout-row-title">{r.name}</span>
                </div>
                {/* Accept is the answer the bar is asking for, so it leads; the
                    app keeps the menu open between them, so a reader can work
                    through a queue. */}
                <div className="flyout-row-actions">
                  <Button size="sm" onClick={() => onAccept(r)}>
                    Accept
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setConfirming(r)}>
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Flyout>

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
