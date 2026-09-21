import { useState } from 'react'
import { Header, Img, TextField, PressableButton } from '@mobile/components'
import './ChallengeCodeSearch.css'

/**
 * `challenges/components/ChallengeCodeSearch.jsx` — the way into a challenge that is not listed.
 *
 * A coded challenge is deliberately absent from "More Challenges": the list filters out anything
 * with a `challenge_code`, so the only way to reach one is to be given the code. That is what
 * makes this screen exist rather than being a search box over the list you can already see.
 *
 * The match is exact and case-insensitive, and it does not run until the code is at least FIVE
 * characters — `if (codeToSearch.length >= 5)`. Below that the button does nothing at all rather
 * than reporting a miss, because a three-letter prefix has not failed yet, it is just unfinished.
 *
 * On a hit the fork is the same one a list card takes: a challenge you are already registered
 * for opens its detail, and one you are not opens the Join modal. Finding it is not joining it.
 */
export function ChallengeCodeSearch({ challenges = [], onFound, onBack }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const search = () => {
    const wanted = code.trim().toUpperCase()
    // The source's own floor. Nothing happens below it — not a search, not an error.
    if (wanted.length < 5) return

    const match = challenges
      .filter((c) => c.challengeCode)
      .find((c) => c.challengeCode.toUpperCase() === wanted)

    if (!match) {
      setError('No challenges match your code.')
      return
    }
    setError('')
    onFound?.(match)
  }

  return (
    <div className="m-ccs">
      <Header variant="stack" title="Challenge Code" onBack={onBack} />

      <div className="m-ccs-body">
        <p className="m-ccs-lede">Enter your code to join the challenge.</p>

        {/* `ErrorMessage` — the red glyph and the line, above the field rather than under it,
            because the field is where you are about to look next. */}
        {error && (
          <p className="m-ccs-error">
            <Img name="error_red_icon" className="m-ccs-error-icon" />
            <span>{error}</span>
          </p>
        )}

        <TextField
          label="Challenge Code"
          value={code}
          onChange={(v) => {
            setCode(v)
            if (error) setError('')
          }}
        />
      </div>

      <div className="m-ccs-foot">
        <PressableButton
          fullWidth
          buttonText="Find Challenge"
          disabled={code.trim().length < 5}
          onButtonPress={search}
        />
      </div>
    </div>
  )
}
