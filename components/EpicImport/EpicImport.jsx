import { useEffect, useState } from 'react'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { Avatar } from '@components/Avatar/Avatar'
import { CustomSelect } from '@components/CustomSelect/CustomSelect'
import { Spinner } from '@components/Primitives/Primitives'
import { Confetti } from '@components/Confetti/Confetti'
import { ModalFullBack, ModalFullClose } from '@components/Modal/Modal'
import { EarnedCard } from '@components/EarnedCard/EarnedCard'
import { useLockScroll } from '@components/useLockScroll/useLockScroll'

import '@components/EpicImport/EpicImport.css'
import '@components/Button/Button.css'
import '@components/Avatar/Avatar.css'
import '@components/CustomSelect/CustomSelect.css'
import '@components/Primitives/Primitives.css'
import '@components/Confetti/Confetti.css'
import '@components/Modal/Modal.css'
import '@components/EarnedCard/EarnedCard.css'

const WORDMARK = '/bs-prototypes/epic/Wordmark.svg'
// An Epic reader the import should leave alone.
const SKIP = '__skip'

/**
 * **Import from Epic** — `epic_integration#login` → `#sync_readers` →
 * `#loading_epic_import`, reached from the logging flow's *Import from Epic*
 * button (`microsite_settings.epic_integration?`).
 *
 * This is a **one-shot import**, not an account link — which is why it isn't
 * `ConnectFlow`. Nothing stays connected afterwards: Epic hands over what the
 * reader has already read, Beanstack logs it, and that's the end of it. The
 * reader comes back and does it again when they want their newer reading in.
 *
 * Three steps, the app's own:
 *
 *   1. **Sign in** — as a student with a class code, or as a parent with a
 *      username and password. Epic's own two doors, and the reason the first
 *      screen is a choice rather than a form.
 *   2. **Select Readers to Import** — an Epic account can hold several readers
 *      and a Beanstack account can hold several profiles, so the step in the
 *      middle is saying which is which. The app pre-matches on name and warns
 *      where two Epic readers share one.
 *   3. **Imported** — what came across, per reader, and any badge it earned.
 *
 * Two ways it fails, and the app treats them differently: Epic turning the
 * credentials away is worth another go, so that screen has a **Retry**; Epic
 * being down is not, so that one doesn't. Sign in with `fail` for the first and
 * `broken` for the second.
 *
 *   <EpicImport
 *     open={open}
 *     profiles={[{ id, name, initials, color }]}
 *     epicReaders={[{ id, name, books, minutes }]}
 *     onClose={close}
 *     onImported={(rows) => log(rows)}
 *   />
 */
export function EpicImport({
  open,
  profiles = [],
  epicReaders = [],
  onClose,
  onImported,
  /* `earned_badge_requirements` — what the imported reading won on the way in.
     An import is a batch of logs, so it earns badges like any other log would,
     and the app shows them on the same screen. */
  earned = [],
  onViewBadge,
  onReward,
  onTickets,
  /* Both failures are reachable rather than theoretical: sign in with one of
     these and you get the screen Epic shows when it turns you away. The same
     trick `ConnectFlow` uses for a taken username — a prototype nobody can
     drive into its error states only ever demonstrates the happy path. */
  failCodes = ['fail'],
  breakCodes = ['broken'],
}) {
  // signin | signing-in | readers | importing | done | signin-error | import-error
  const [step, setStep] = useState('signin')
  const [as, setAs] = useState(null) // student | parent
  const [fields, setFields] = useState({ classCode: '', username: '', password: '' })
  const [signingIn, setSigningIn] = useState(false)
  /* Which Beanstack profile each Epic reader's logs land on, keyed by Epic id.
     Pre-matched on name the way the app does — most of the time the two names
     are the same person and the step is a confirmation, not a task. */
  const [mapping, setMapping] = useState({})

  // The surface covers the window, so the page behind it holds still.
  useLockScroll(open)

  useEffect(() => {
    if (!open) return
    setStep('signin')
    setAs(null)
    setFields({ classCode: '', username: '', password: '' })
    setSigningIn(false)
    setMapping(
      Object.fromEntries(
        epicReaders.map((r) => [
          r.id,
          profiles.find((p) => p.name.split(' ')[0] === r.name.split(' ')[0])?.id ?? '',
        ]),
      ),
    )
    // Only on open — re-syncing mid-flow would undo the reader's own mapping.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open) return null

  const canSignIn =
    as === 'student' ? fields.classCode.trim() : fields.username.trim() && fields.password.trim()

  const typed = (as === 'student' ? fields.classCode : fields.username).trim().toLowerCase()

  function signIn() {
    if (!canSignIn) return
    // The real thing is a round trip to Epic, so it takes a moment and says so.
    setSigningIn(true)
    setStep('signing-in')
    setTimeout(() => {
      setSigningIn(false)
      setStep(failCodes.includes(typed) ? 'signin-error' : 'readers')
    }, 1100)
  }

  // What each mapped reader brings across.
  const imported = epicReaders
    .filter((r) => mapping[r.id])
    .map((r) => ({ ...r, profile: profiles.find((p) => p.id === mapping[r.id]) }))

  function runImport() {
    setStep('importing')
    setTimeout(() => {
      /* Epic's end being down is a different failure from being turned away at
         the door, and the app says so differently: there is nothing to retry. */
      if (breakCodes.includes(typed)) return setStep('import-error')
      setStep('done')
      onImported?.(imported)
    }, 1100)
  }

  return (
    <div className="epi" role="dialog" aria-modal="true" aria-label="Import from Epic">
      {/* The shared full-screen pair, the same one the logging flow this opens
          from uses — Epic's screens are Epic's, but the way out of them is
          Beanstack's and shouldn't change shape halfway through. Back on the
          first step is the way out of the import altogether. */}
      <ModalFullBack
        onClick={() => {
          if (step === 'readers' || step === 'signin-error') return setStep('signin')
          if (step === 'import-error') return setStep('readers')
          onClose?.()
        }}
      />
      <ModalFullClose onClick={onClose} />

      {/* Over the whole surface rather than inside the panel — the pieces
          should fall past the screen, and `.cft` fills whichever positioned
          ancestor it lands in. */}
      {step === 'done' && <Confetti count={24} distance={860} />}

      <div className="epi-scroll">
        {step === 'signin' && (
          <SignInStep
            as={as}
            setAs={setAs}
            fields={fields}
            setFields={setFields}
            signingIn={signingIn}
            canSignIn={canSignIn}
            onSignIn={signIn}
          />
        )}

        {step === 'readers' && (
          <ReadersStep
            epicReaders={epicReaders}
            profiles={profiles}
            mapping={mapping}
            setMapping={setMapping}
            onImport={runImport}
          />
        )}

        {/* `#epic-loading-account-details` and `#epic-loading-import` — two
            waits, and the app names each rather than showing one spinner
            twice: signing in and fetching the readers is a different wait from
            pulling their sessions across. */}
        {step === 'signing-in' && <Transition kind="wait" text="Loading Your Account Details" />}
        {step === 'importing' && <Transition kind="wait" text="Importing Reading Sessions" />}

        {step === 'done' && (
          <DoneStep
            imported={imported}
            earned={earned}
            onClose={onClose}
            onViewBadge={onViewBadge}
            onReward={onReward}
            onTickets={onTickets}
          />
        )}

        {/* `_login_error` — Epic turned the credentials away, which is worth
            another go. Both errors ride the same transition frame the waits
            do: they are the same beat in the flow, just one that stopped. */}
        {step === 'signin-error' && (
          <Transition kind="error" text="Sign in failed. Please try again.">
            <Button size="lg" className="epi-btn" onClick={() => setStep('signin')}>
              Retry
            </Button>
          </Transition>
        )}

        {/* `_sync_error` — Epic's end is down. No Retry: there is nothing the
            reader can do about it, and a button that just fails again is worse
            than none. */}
        {step === 'import-error' && (
          <Transition
            kind="broken"
            text="Oh no! Importing is disconnected. We're working on it. Please try again later."
          >
            <Button size="lg" variant="secondary" className="epi-btn" onClick={onClose}>
              Close
            </Button>
          </Transition>
        )}
      </div>
    </div>
  )
}

/** Step one — Epic's two doors. */
function SignInStep({ as, setAs, fields, setFields, signingIn, canSignIn, onSignIn }) {
  const set = (k, v) => setFields((f) => ({ ...f, [k]: v }))
  return (
    <div className="epi-panel">
      <img src={WORDMARK} alt="Epic" className="epi-wordmark" />
      <p className="epi-sub">
        Enter your Epic account credentials to import your reading from Epic to Beanstack.
      </p>

      {/* A student signs in with the class code their teacher gave them; a
          parent with the account they pay for. Asking which first means neither
          is shown a field that isn't theirs. */}
      {!as && (
        <div className="epi-choices">
          <Button size="lg" className="epi-btn" onClick={() => setAs('student')}>
            Sign In As Student
          </Button>
          <Button size="lg" variant="secondary" className="epi-btn" onClick={() => setAs('parent')}>
            Sign In As Parent
          </Button>
        </div>
      )}

      {as === 'student' && (
        <div className="epi-form">
          <label className="epi-label" htmlFor="epi-class">
            Class Code
          </label>
          <input
            id="epi-class"
            className="epi-input"
            value={fields.classCode}
            onChange={(e) => set('classCode', e.target.value)}
            placeholder="abc1234"
          />
        </div>
      )}

      {as === 'parent' && (
        <div className="epi-form">
          <label className="epi-label" htmlFor="epi-user">
            Username
          </label>
          <input
            id="epi-user"
            className="epi-input"
            value={fields.username}
            onChange={(e) => set('username', e.target.value)}
          />
          <label className="epi-label" htmlFor="epi-pw">
            Password
          </label>
          <input
            id="epi-pw"
            type="password"
            className="epi-input"
            value={fields.password}
            onChange={(e) => set('password', e.target.value)}
          />
        </div>
      )}

      {as && (
        <div className="epi-actions">
          <Button
            size="lg"
            className="epi-btn"
            disabled={!canSignIn || signingIn}
            onClick={onSignIn}
          >
            {signingIn ? 'Signing Into Epic…' : 'Sign In'}
          </Button>
          <Button size="lg" variant="ghost" className="epi-btn" onClick={() => setAs(null)}>
            Back
          </Button>
        </div>
      )}

      {/* `.epic-login-footer` — the app says this plainly, because handing one
          service another service's password is a thing people are right to
          hesitate over. */}
      <p className="epi-footnote">
        <Icon name="lock" size={15} />
        Beanstack will not store your account credentials. This is a secure SSL connection.
      </p>
    </div>
  )
}

/** Step two — which Epic reader is which Beanstack reader. */
function ReadersStep({ epicReaders, profiles, mapping, setMapping, onImport }) {
  /* The app warns when two Epic readers share a first name, because its own
     pre-match then had to guess and may well have guessed wrong. */
  const firstNames = epicReaders.map((r) => r.name.split(' ')[0])
  const duplicates = [...new Set(firstNames.filter((n, i) => firstNames.indexOf(n) !== i))]
  /* Radix won't take an empty string as an option value — it reserves it for
     "nothing selected" — so opting out has a value of its own. */
  const options = [
    { value: SKIP, label: "Don't import" },
    ...profiles.map((p) => ({ value: p.id, label: p.name })),
  ]
  const any = epicReaders.some((r) => mapping[r.id])

  return (
    <div className="epi-panel epi-panel--wide">
      <h1 className="epi-h1">Select Readers to Import</h1>
      <p className="epi-sub">Choose a Beanstack reader to import your Epic reading logs.</p>

      {duplicates.length > 0 && (
        <p className="epi-warn">
          <Icon name="alert-circle" size={16} />
          We found duplicate Epic reader names and selected one automatically. Please verify your
          mappings and notify the teacher to update Epic if needed:{' '}
          <strong>{duplicates.join(', ')}</strong>
        </p>
      )}

      <ul className="epi-readers">
        {epicReaders.map((r) => (
          <li className="epi-reader" key={r.id}>
            <span className="epi-reader-who">
              <span className="epi-reader-avatar">
                <Avatar initials={initials(r.name)} color="#0A96E6" size="md" />
                <span className="epi-reader-mark" aria-hidden="true">
                  e
                </span>
              </span>
              <span className="epi-reader-text">
                <strong>{r.name}</strong>
                <span>{summary(r)}</span>
              </span>
            </span>
            <Icon name="arrow-right" size={18} className="epi-reader-arrow" />
            <span className="epi-reader-pick">
              <CustomSelect
                options={options}
                value={mapping[r.id] || SKIP}
                onChange={(v) => setMapping((m) => ({ ...m, [r.id]: v === SKIP ? '' : v }))}
                ariaLabel={`Beanstack reader for ${r.name}`}
              />
            </span>
          </li>
        ))}
      </ul>

      <div className="epi-actions">
        <Button size="lg" disabled={!any} onClick={onImport}>
          Import Reading
        </Button>
      </div>
    </div>
  )
}

/**
 * `.transition-screen-image` over `.transition-screen-text` — the frame Epic
 * puts every wait and every failure on: one drawing, one line under it, and
 * nothing else. The app ships an illustration per state; ours draws them, which
 * keeps the three distinguishable without three more files.
 */
function Transition({ kind, text, children }) {
  return (
    <div className="epi-transition">
      <div className={`epi-trans-art epi-trans-art--${kind}`}>
        {kind === 'wait' && <Spinner size="xl" />}
        {kind === 'error' && <Icon name="alert-circle" size={62} stroke={1.6} />}
        {kind === 'broken' && <Icon name="plug-off" size={62} stroke={1.6} />}
      </div>
      <p className="epi-trans-text">{text}</p>
      {children && <div className="epi-actions epi-actions--tight">{children}</div>}
    </div>
  )
}

/** Step three — what came across. */
function DoneStep({ imported, earned, onClose, onViewBadge, onReward, onTickets }) {
  return (
    <div className="epi-panel epi-panel--wide">
      <div className="epi-trans-art epi-trans-art--done">
        <Icon name="circle-check-filled" size={70} />
      </div>
      <h1 className="epi-h1 epi-h1--imported">Your Reading Has Been Imported!</h1>

      {/* `.beanstack-profile-import` — a card per reader, built like the log
          flow's own earned cards: the reader names the card, and each figure is
          a ruled-off row under it with its own pastel disc. Finishing a log and
          finishing an import are the same beat, so they should look it. */}
      <div className="epi-results">
        {imported.map((r) => (
          <article className="epi-result" key={r.id}>
            <h3 className="epi-result-name">{r.profile.name}</h3>
            <div className="epi-result-rows">
              {r.books > 0 && (
                <div className="epi-stat">
                  <span className="epi-stat-art epi-stat-art--books">
                    <Icon name="book" size={22} />
                  </span>
                  <span className="epi-stat-text">
                    <span className="epi-stat-label">Books Read</span>
                    <span className="epi-stat-value">
                      {r.books.toLocaleString()} {r.books === 1 ? 'Book' : 'Books'}
                    </span>
                  </span>
                </div>
              )}
              {r.minutes > 0 && (
                <div className="epi-stat">
                  <span className="epi-stat-art epi-stat-art--minutes">
                    <Icon name="clock" size={22} />
                  </span>
                  <span className="epi-stat-text">
                    <span className="epi-stat-label">Time Read</span>
                    <span className="epi-stat-value">
                      {r.minutes.toLocaleString()} {r.minutes === 1 ? 'Minute' : 'Minutes'}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* What the import earned, on the very card the logging flow uses — an
          import is a batch of logs, and finishing one should land the same way
          finishing the other does. */}
      {earned?.length > 0 && (
        <div className="epi-earned">
          {earned.map((card) => (
            <EarnedCard
              key={card.id}
              card={card}
              onViewBadge={onViewBadge}
              onReward={onReward}
              onTickets={onTickets}
            />
          ))}
        </div>
      )}

      <div className="epi-actions">
        <Button size="lg" onClick={onClose}>
          Finish
        </Button>
      </div>
    </div>
  )
}

const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()

const summary = (r) =>
  [
    r.books > 0 && `${r.books} ${r.books === 1 ? 'book' : 'books'}`,
    r.minutes > 0 && `${r.minutes} min`,
  ]
    .filter(Boolean)
    .join(' · ')
