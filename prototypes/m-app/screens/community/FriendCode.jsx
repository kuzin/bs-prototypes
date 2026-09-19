import { useState } from 'react'
import {
  SheetHeader,
  Img,
  FriendAvatar,
  PressableButton,
  TextField,
  ConfirmDialog,
} from '@mobile/components'
import './FriendCode.css'

/**
 * `shareCode/ShareCodeScreen.tsx` and `shareCode/EnterFriendCodeScreen.jsx` — the two halves of
 * adding a friend at a LIBRARY.
 *
 * Why a code at all: a school roster is a closed list you are both already on, so a school reader
 * searches it. A public library has no such list and no way to know that two patrons know each
 * other, so the pair exchange a code out of band. Both screens say "You can only add friends from
 * your library" for the same reason — a code from another site will not resolve.
 *
 * The code block is one composed shape rather than a card: a 180pt panel of the tenant colour at
 * **0.35 opacity**, the reader's 90pt avatar overlapping it from above inside a 4pt white ring,
 * and the code itself at 45pt absolutely placed over the panel. The opacity is what keeps the
 * panel a wash rather than a slab, on any tenant colour.
 *
 * Refreshing the code is destructive and says so. Entering one shows the privacy notice FIRST and
 * asks you to accept it, because adding a friend is what exposes your log to them.
 *
 * Both present as MODALS rather than pushes. They are a detour, not a destination: you open one,
 * read or type a code, and leave — and the sheet's peeking edge keeps the friends list visible
 * behind it, where a push would imply you had gone somewhere and had to find your way back. So
 * the header is a `SheetHeader` with a dismiss chevron, not a stack header with a back arrow.
 */
const SHARE_TEXT =
  'Share your code to start reading with friends. You can only add friends from your library.'

const ENTER_TEXT =
  'Enter an invite code from a friend to add them to your friends list! You can only add friends from your library.'

const PRIVACY_NOTICE =
  "Anyone you share your Friend Code with can see parts of your reading log. Depending on your site's settings, these may include: books read, your challenges, and/or recent badges. When activated for your site, friends can also compete with you in leaderboards. You can remove a friend at any time."

export function ShareCode({ profile, code, onRefresh, onBack }) {
  const [confirming, setConfirming] = useState(false)
  const [copied, setCopied] = useState(false)

  return (
    <div className="m-fc">
      <SheetHeader
        center="Share Your Friend Code"
        onClose={onBack}
        right={
          /* A glyph, not the source's "Refresh" text. The header's end slot is a glyph slot
             everywhere else in this app — options dots, a search magnifier — and a word there
             both breaks that and competes with the title for a 393pt bar. */
          <button
            type="button"
            className="m-fc-refresh"
            aria-label="Refresh your friend code"
            onClick={() => setConfirming(true)}
          >
            <Img name="refreshIcon" size={20} tint="var(--m-accent)" />
          </button>
        }
      />

      <div className="m-fc-scroll">
        <p className="m-fc-lede">{SHARE_TEXT}</p>

        <div className="m-fc-block">
          <span className="m-fc-panel" />
          <span className="m-fc-avatar">
            <FriendAvatar
              id={profile.id}
              firstName={profile.name?.split(' ')[0] ?? ''}
              lastName={profile.name?.split(' ')[1] ?? ''}
              size={90}
            />
          </span>
          <span className="m-fc-code">{code}</span>
        </div>

        {/* `CopyButton` — a 15pt glyph and 14/bold. The glyph swaps to a tick with the label, so
            the button reports its own result rather than relying on the toast alone. */}
        <button
          type="button"
          className="m-fc-copy"
          onClick={() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1600)
          }}
        >
          <Img name={copied ? 'check_mark_thick' : 'copy'} className="m-fc-copy-icon" />
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="m-fc-foot">
        <PressableButton fullWidth buttonText="Share your Friend Code" />
      </div>

      <ConfirmDialog
        open={confirming}
        title="Are you sure?"
        text="When you refresh your friend code, your previous code will no longer work."
        confirmText="Accept"
        onConfirm={() => {
          setConfirming(false)
          onRefresh?.()
        }}
        onClose={() => setConfirming(false)}
      />
    </div>
  )
}

export function EnterFriendCode({ onAdd, onBack }) {
  const [code, setCode] = useState('')
  const [showNotice, setShowNotice] = useState(false)
  const [error, setError] = useState('')

  const submit = () => {
    setError('')
    setShowNotice(true)
  }

  return (
    <div className="m-fc">
      <SheetHeader center="Enter a Friend Code" onClose={onBack} />

      <div className="m-fc-scroll">
        <p className="m-fc-lede">{ENTER_TEXT}</p>

        {/* `ErrorMessage` — the code you typed is quoted back, because the usual cause is a typo
            and you cannot see the field once the keyboard is up. */}
        {error && <p className="m-fc-error">{error}</p>}

        <div className="m-fc-field">
          <TextField label="Friend Code" value={code} onChange={setCode} />
        </div>
      </div>

      <div className="m-fc-foot">
        <PressableButton
          fullWidth
          buttonText="Add a Friend"
          disabled={code.trim().length < 1}
          onButtonPress={submit}
        />
      </div>

      {/* The notice comes BEFORE the friend is added, not after — accepting it is the consent. */}
      <ConfirmDialog
        open={showNotice}
        title="Privacy Notice"
        text={PRIVACY_NOTICE}
        confirmText="Accept"
        onConfirm={() => {
          setShowNotice(false)
          const added = onAdd?.(code.trim().toUpperCase())
          if (added === false) {
            setError(
              `The friend code ${code.trim().toUpperCase()} was not recognized. Make sure to enter an active friend code from a reader in your library.`,
            )
          }
        }}
        onClose={() => setShowNotice(false)}
      />
    </div>
  )
}
