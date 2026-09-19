import { useState } from 'react'
import {
  Header,
  FriendAvatar,
  PressableButton,
  ConfirmDialog,
  EmptyStateView,
  Img,
} from '@mobile/components'
import './FriendSearch.css'

/**
 * `friendsAndLeaderboards/components/search/FriendSearchScreen.jsx` — the SCHOOL half of adding a
 * friend, and the other side of the fork from the friend-code screens.
 *
 * A school roster is a closed list both readers are already on, so you search it by name and send
 * an invite. A library has no such list, which is why a library reader exchanges a code instead.
 * `showFriendSearchScreen` picks between them on `clientServiceType`, and the button that opens
 * either one is labelled differently for the same reason: "Add Friend" at a library, "Invite
 * Friend" everywhere else.
 *
 * Three states rather than two, and the empty one is a prompt: before you have searched it says
 * "Invite a Friend / Enter your friend's name above to send them an invite!", which is the screen
 * explaining itself. Only after a search that found nobody does it show the sad-cat artwork and
 * quote the term back.
 *
 * Results are a SINGLE selection — `selectedFriend` is one id and Send Invite is disabled until
 * there is one. You invite one person at a time.
 *
 * The privacy notice is a different string here than on the code screen: "Anyone you ADD as a
 * friend" rather than "Anyone you SHARE your Friend Code with", because the act being consented
 * to is different. It also appears only ONCE — `totalConfirmedFriends === 0` gates it, so it is
 * shown before your first friend and never again.
 */
const PRIVACY_NOTICE =
  "Anyone you add as a friend can see parts of your reading log. Depending on your site's settings, these may include: books read, your challenges, and/or recent badges. When activated for your site, friends can also compete with you in leaderboards. You can remove a friend at any time."

export function FriendSearch({ roster = [], confirmedFriends = 0, onInvite, onBack }) {
  const [term, setTerm] = useState('')
  const [submitted, setSubmitted] = useState(null)
  const [selected, setSelected] = useState(null)
  const [notice, setNotice] = useState(false)
  const [sent, setSent] = useState(false)

  const results =
    submitted == null
      ? []
      : roster.filter((r) =>
          `${r.firstName} ${r.lastName}`.toLowerCase().includes(submitted.toLowerCase()),
        )

  const search = () => {
    setSelected(null)
    setSubmitted(term.trim())
  }

  /* `if (totalConfirmedFriends === 0) setPrivacyNoticeVisible(true) else inviteFriend(...)` — the
     notice is shown ONCE, before your first friend, and never again. It is consent to the whole
     arrangement rather than to this particular person, so re-asking on every invite would make it
     a dialog to dismiss instead of something to read. */
  const invite = () => {
    if (confirmedFriends === 0) {
      setNotice(true)
      return
    }
    onInvite?.(roster.find((r) => r.id === selected))
    setSent(true)
  }

  return (
    <div className="m-fs">
      <Header variant="stack" title="Invite a Friend" onBack={onBack} />

      {/* `SearchInput` — no magnifier. A field, a clear glyph that FADES rather than
          disappearing, and a Cancel; the clear stays in place at low opacity so the row does not
          reflow the moment you type. */}
      <div className="m-fs-search">
        <div className="m-fs-field">
          <input
            className="m-fs-input"
            value={term}
            placeholder="Enter your friend's name..."
            autoCorrect="off"
            onChange={(e) => {
              setTerm(e.target.value)
              if (e.target.value === '') setSubmitted(null)
            }}
            onKeyDown={(e) => e.key === 'Enter' && search()}
          />
        </div>
        <div className="m-fs-actions">
          <button
            type="button"
            className="m-fs-clear"
            aria-label="Clear search"
            onClick={() => {
              setTerm('')
              setSubmitted(null)
              setSelected(null)
            }}
          >
            <Img name="close" className={`m-fs-clear-icon${term ? ' is-on' : ''}`} />
          </button>
          <button type="button" className="m-fs-cancel" onClick={onBack}>
            Cancel
          </button>
        </div>
      </div>

      <div className="m-fs-body">
        {submitted == null && (
          <div className="m-fs-initial">
            <p className="m-fs-title">Invite a Friend</p>
            <p className="m-fs-sub">Enter your friend&rsquo;s name above to send them an invite!</p>
          </div>
        )}

        {submitted != null && results.length === 0 && (
          <EmptyStateView
            source="recent_titles_empty_state"
            boldText={`No Readers Matching "${submitted}"`}
          />
        )}

        {/* `FoundFriend` — name over `grade_level_name`. The grade is not decoration: a roster
            of 600 has more than one Maya, and the only thing separating two rows with the same
            name is which grade they are in.

            Tapping a selected row CLEARS it —
            `selected ? setSelectedFriend(null) : setSelectedFriend(friend)`. With a single
            selection and no other way to undo one, a radio you cannot turn off leaves Send
            Invite armed at whoever you last touched. */}
        {results.map((r) => (
          <button
            key={r.id}
            type="button"
            className={`m-fs-row${selected === r.id ? ' is-selected' : ''}`}
            onClick={() => setSelected((cur) => (cur === r.id ? null : r.id))}
          >
            <FriendAvatar id={r.id} firstName={r.firstName} lastName={r.lastName} />
            <span className="m-fs-text">
              <span className="m-fs-name">
                {r.firstName} {r.lastName}
              </span>
              {r.grade && <span className="m-fs-grade">{r.grade}</span>}
            </span>
            <span className="m-fs-radio" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="m-fs-foot">
        <PressableButton
          fullWidth
          buttonText="Send Invite"
          disabled={selected === null}
          onButtonPress={invite}
        />
      </div>

      <ConfirmDialog
        open={notice}
        title="Privacy Notice"
        text={PRIVACY_NOTICE}
        confirmText="Accept"
        onConfirm={() => {
          setNotice(false)
          onInvite?.(roster.find((r) => r.id === selected))
          setSent(true)
        }}
        onClose={() => setNotice(false)}
      />

      {/* `WorkflowDialog` — the app confirms the send and offers to do it again. */}
      <ConfirmDialog
        open={sent}
        title="Your Invite Has Been Sent"
        text="Would you like to invite another friend?"
        confirmText="Invite Another"
        cancelText="Done"
        onConfirm={() => {
          setSent(false)
          setTerm('')
          setSubmitted(null)
          setSelected(null)
        }}
        onClose={() => {
          setSent(false)
          onBack?.()
        }}
      />
    </div>
  )
}
