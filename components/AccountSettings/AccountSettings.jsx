import { useState } from 'react'
import { Button } from '@components/Button/Button'
import { Modal, ModalClose } from '@components/Modal/Modal'
import { Checkbox, Field, Input, Select } from '@components/Form/Form'
import { Icon } from '@components/Icon/Icon'
import { SectionCard } from '@components/SectionCard/SectionCard'

import './AccountSettings.css'
/* The two pages behind the gear are the same page: a title, a stack of
   sections, and a delete block at the foot. This wears Personalize Reader's
   furniture rather than keeping a second copy of it. */
import '@components/PersonalizeReader/PersonalizeReader.css'
import '@components/Button/Button.css'
import '@components/Form/Form.css'
import '@components/Modal/Modal.css'
import '@components/SectionCard/SectionCard.css'

/**
 * Beanstack's **Edit Account** — `user#edit`, the page behind the gear.
 *
 * This is the *account*, not a reader: the sign-in that holds the profiles. So
 * it is where the email and the password live, along with whatever contact
 * details the site collects, and it is the only place an account can be deleted
 * — which takes every reader under it with it.
 *
 * Its sibling is `PersonalizeReader` (`profiles#edit_options`), which is one
 * reader's own settings. A school site has no account above the reader, so
 * there the gear goes to that page and this one never appears.
 *
 * Most of the form is gated by what the site collects
 * (`display_zipcode_at_registration?`, `collect_library_card?`,
 * `display_military_branches_at_registration?` …) — `features` is those gates.
 *
 * The password half has two shapes, and which one you get is the
 * `block_default_passwords` flipper: a plain pair of fields, or the strong-
 * password block with a meter, a requirements checklist and a match check.
 *
 *   <AccountSettings account={ACCOUNT} branches={BRANCHES} features={{ libraryCard: true }} />
 *
 * `authWord` is the site's lexicon — `word_for_auth_type`, which can make every
 * label on the page say Passcode or PIN instead of Password.
 */

/* `MilitaryBranch::BRANCHES` and `MilitarySponsor::STATUSES`, verbatim. */
const MILITARY_BRANCHES = ['Dept of the Air Force', 'Army', 'Navy', 'Marine Corps', 'Coast Guard']
const MILITARY_STATUSES = [
  'Active',
  'Guard',
  'Reserve',
  'Retiree',
  'Dependent',
  'Civil Service',
  'NAF Employee',
  'Contractor',
]

/* The five buckets the app's meter has, in its own colours and words. */
const STRENGTH = [
  { label: 'Very Weak', color: '#ff4d4d' },
  { label: 'Weak', color: '#ff884d' },
  { label: 'Fair', color: '#ffcc00' },
  { label: 'Good', color: '#99cc00' },
  { label: 'Strong', color: '#4caf50' },
]

/* The app scores with zxcvbn, which is 800KB of dictionaries. This is a stand-in
   over the same 0–4 range with the same instincts: length and variety earn it,
   and one word, one run of digits or one repeated character earns nothing
   however long it runs. */
const COMMON = new Set([
  'password',
  'password1',
  'password123',
  'qwertyuiop',
  'qwerty123',
  'letmein',
  'iloveyou',
  'welcome1',
  'beanstack',
  'reading1',
])

function scorePassword(pw) {
  if (!pw) return 0
  if (/^(.)\1+$/.test(pw) || /^\d+$/.test(pw) || COMMON.has(pw.toLowerCase())) return 0
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) => re.test(pw)).length
  let n = 0
  if (pw.length >= 8) n += 1
  if (pw.length >= 12) n += 1
  if (classes >= 2) n += 1
  if (classes >= 3) n += 1
  return Math.min(4, n)
}

/**
 * One password field with the app's own Show/Hide beside its label. Somebody
 * setting a password they can't see types it wrong twice, so the app lets them
 * look at it.
 */
function PasswordField({ id, label, value, onChange, placeholder }) {
  const [shown, setShown] = useState(false)
  return (
    <div className="acct-pw">
      <div className="acct-pw-head">
        <label className="acct-pw-label" htmlFor={id}>
          {label}
        </label>
        <button type="button" className="acct-pw-toggle" onClick={() => setShown((s) => !s)}>
          {shown ? 'Hide' : 'Show'}
        </button>
      </div>
      <Input
        id={id}
        type={shown ? 'text' : 'password'}
        value={value}
        autoComplete="off"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

/** One line of the checklist: a cross until it passes, then a tick. */
function Requirement({ met, children }) {
  return (
    <li className={met ? 'is-met' : undefined}>
      <Icon name={met ? 'check' : 'x'} size={15} stroke={2.6} />
      {children}
    </li>
  )
}

/** The mark a card shows for a moment after it saves. */
function Saved() {
  return (
    <span className="acct-saved">
      <Icon name="circle-check" size={16} /> Saved
    </span>
  )
}

export function AccountSettings({
  account,
  title = 'Edit Account',
  branches = [],
  authWord = 'Password',
  minLength = 8,
  features = {},
  onSave,
  onDelete,
}) {
  const {
    zipcode = false,
    libraryCard = false,
    militaryBranch = false,
    militarySponsor = false,
    // `block_default_passwords` — on, the password gets a meter, a checklist
    // and a match check, and nothing saves until it passes all three.
    strongPassword = true,
  } = features

  const [form, setForm] = useState(() => ({
    firstName: account.firstName ?? account.name.split(' ')[0],
    lastName: account.lastName ?? account.name.split(' ').slice(1).join(' '),
    email: account.email ?? '',
    emailConfirmation: account.email ?? '',
    phone: account.phone ?? '',
    zip: account.zip ?? '',
    libraryCard: account.libraryCard ?? '',
    branch: account.branch ?? branches[0]?.id ?? '',
    militaryBranch: account.militaryBranch ?? MILITARY_BRANCHES[0],
    militarySponsor: account.militarySponsor ?? MILITARY_STATUSES[0],
  }))
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  // Which half was last saved — `'details'`, `'password'`, or nothing.
  const [saved, setSaved] = useState(null)

  // "Delete Account" is a word beside Save that opens the section under it —
  // the app keeps the whole thing hidden until somebody asks for it.
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirms, setConfirms] = useState({
    irreversible: false,
    irretrievable: false,
    readers: false,
  })
  const [confirming, setConfirming] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setSaved(null)
  }

  const strength = scorePassword(password)
  const longEnough = password.length >= minLength
  const matches = Boolean(password) && password === confirmation
  const emailsMatch = form.email === form.emailConfirmation
  // The app has one Save for both halves, which means its own strong-password
  // rule — nothing saves until a *new* password has been set and confirmed —
  // also blocks changing an email. Split, the rule applies to the half it is
  // about.
  const canSavePassword = strongPassword
    ? strength >= 3 && longEnough && matches
    : Boolean(password) && matches
  const armed = confirms.irreversible && confirms.irretrievable && confirms.readers

  function saveDetails() {
    onSave?.({ ...form })
    setSaved('details')
  }
  function savePassword() {
    onSave?.({ password })
    setSaved('password')
    setPassword('')
    setConfirmation('')
  }

  return (
    <div className="st-page">
      <header className="st-head">
        <h1 className="st-title">{title}</h1>
      </header>

      <div className="st-main">
        {/* Two cards where the app has one form. Changing an email and changing
            a password are different errands, and the app's single Save means
            you cannot do the first without also doing the second — with the
            strong-password block on, nothing saves until a *new* password has
            been set. Split, each half saves on its own. */}
        <SectionCard header="bar" title="Details">
          <div className="acct-grid">
            <Field label="First Name">
              <Input value={form.firstName} onChange={set('firstName')} placeholder="First Name" />
            </Field>
            <Field label="Last Name" required>
              <Input value={form.lastName} onChange={set('lastName')} placeholder="Last Name" />
            </Field>

            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="Email"
                autoComplete="email"
              />
            </Field>
            <Field
              label="Email Confirmation"
              error={emailsMatch ? undefined : 'Email addresses do not match'}
            >
              <Input
                type="email"
                value={form.emailConfirmation}
                onChange={set('emailConfirmation')}
                placeholder="Confirm Email"
                autoComplete="email"
              />
            </Field>

            <Field label="Phone Number">
              <Input
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="Phone Number"
                autoComplete="tel"
              />
            </Field>

            {/* `display_zipcode_at_registration?` */}
            {zipcode && (
              <Field label="ZIP Code">
                <Input value={form.zip} onChange={set('zip')} placeholder="ZIP Code" />
              </Field>
            )}

            {/* `collect_library_card?` / `enable_readers_library_card_number?`
                — a library only, and the app checks the format as you type. */}
            {libraryCard && (
              <Field label="Library Card Number">
                <Input
                  value={form.libraryCard}
                  onChange={set('libraryCard')}
                  placeholder="Library Card Number"
                  inputMode="numeric"
                />
              </Field>
            )}

            {/* The site's own branches, where it has any. */}
            {branches.length > 0 && (
              <Field label="Preferred Branch">
                <Select value={form.branch} onChange={set('branch')}>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </Select>
              </Field>
            )}

            {militaryBranch && (
              <Field label="Military Branch">
                <Select value={form.militaryBranch} onChange={set('militaryBranch')}>
                  {MILITARY_BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </Select>
              </Field>
            )}
            {militarySponsor && (
              <Field label="Sponsor's Military Status">
                <Select value={form.militarySponsor} onChange={set('militarySponsor')}>
                  {MILITARY_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </Field>
            )}
          </div>

          <div className="acct-save">
            <Button disabled={!emailsMatch} onClick={saveDetails}>
              Save Details
            </Button>
            {saved === 'details' && <Saved />}
          </div>
        </SectionCard>

        {/* Each field keeps what it has to say under it: the meter and the rules
            under the password, whether they match under the confirmation. */}
        <SectionCard header="bar" title={authWord}>
          <div className="acct-pwgrid">
            <div className="acct-pwcol">
              <PasswordField
                id="acct-password"
                label={authWord}
                value={password}
                onChange={(v) => {
                  setPassword(v)
                  setSaved(null)
                }}
                placeholder={
                  strongPassword
                    ? `New ${authWord} must be at least ${minLength} characters`
                    : `New ${authWord}`
                }
              />

              {strongPassword && (
                <>
                  {/* The meter: a fifth of the bar per point, in the app's own
                      five colours, with the word under it. */}
                  <div className="acct-meter">
                    <div className="acct-meter-track">
                      <div
                        className="acct-meter-bar"
                        style={{
                          width: password ? `${(strength + 1) * 20}%` : 0,
                          background: STRENGTH[strength].color,
                        }}
                      />
                    </div>
                    <p className="acct-meter-text">
                      {authWord} Strength:{' '}
                      <span>{password ? STRENGTH[strength].label : '\u2014'}</span>
                    </p>
                  </div>

                  <div className="acct-reqs">
                    <h4>{authWord} Requirements</h4>
                    <ul>
                      <Requirement met={longEnough}>At least {minLength} characters</Requirement>
                    </ul>
                  </div>
                </>
              )}
            </div>

            <div className="acct-pwcol">
              <PasswordField
                id="acct-password-confirmation"
                label={`${authWord} Confirmation`}
                value={confirmation}
                onChange={(v) => {
                  setConfirmation(v)
                  setSaved(null)
                }}
                placeholder={`Confirm new ${authWord}`}
              />

              {/* `.infobox.errorbox` / `.infobox.successbox` — the app says
                  nothing until there is something in the second field. */}
              {strongPassword && confirmation && (
                <p className={`acct-match${matches ? ' is-ok' : ''}`}>
                  <Icon name={matches ? 'circle-check' : 'alert-circle'} size={17} />
                  {matches ? `${authWord}s match` : `${authWord}s do not match`}
                </p>
              )}
            </div>
          </div>

          <div className="acct-save">
            <Button disabled={!canSavePassword} onClick={savePassword}>
              Update {authWord}
            </Button>
            {saved === 'password' && <Saved />}
          </div>
        </SectionCard>

        <SectionCard header="bar" title="Delete Account">
          <p className="st-body">
            All data associated with this account and all attached readers will be permanently
            deleted.
          </p>
          {deleteOpen ? (
            <>
              <p className="st-warn">
                Warning: This cannot be undone, even by the Beanstack support team. This action is
                final!
              </p>
              {/* Three ticks, then a red button, then the password — the app asks
                four separate times before an account goes. */}
              <div className="st-checks">
                <Checkbox
                  size="sm"
                  checked={confirms.irreversible}
                  onChange={(v) => setConfirms((c) => ({ ...c, irreversible: v }))}
                >
                  I understand that this action is absolutely irreversible.
                </Checkbox>
                <Checkbox
                  size="sm"
                  checked={confirms.irretrievable}
                  onChange={(v) => setConfirms((c) => ({ ...c, irretrievable: v }))}
                >
                  I understand that deleting this account will delete all data and history.
                </Checkbox>
                <Checkbox
                  size="sm"
                  checked={confirms.readers}
                  onChange={(v) => setConfirms((c) => ({ ...c, readers: v }))}
                >
                  I understand that deleting this account will also delete all of my readers.
                </Checkbox>
              </div>
              <div className="st-dangeractions">
                <button
                  type="button"
                  className="st-delete"
                  disabled={!armed}
                  onClick={() => setConfirming(true)}
                >
                  Permanently Delete My Account
                </button>
                <button
                  type="button"
                  className="st-cancel"
                  onClick={() => {
                    setDeleteOpen(false)
                    setConfirms({ irreversible: false, irretrievable: false, readers: false })
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <Button variant="secondary" size="md" onClick={() => setDeleteOpen(true)}>
              Delete Account
            </Button>
          )}
        </SectionCard>
      </div>

      {/* `#delete-user-modal` — the last gate, and the only one that asks for
          something only the account holder has. */}
      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        variant="center"
        closeBadge
        ariaLabel="Delete this account"
      >
        <ModalClose onClick={() => setConfirming(false)} />
        <div className="modal-header modal-header--flush">
          <h2 className="modal-title">
            To delete your account, you will need to enter your {authWord.toLowerCase()}.
          </h2>
        </div>
        <div className="modal-body">
          <Field error={deleteError || undefined}>
            <Input
              type="password"
              value={deletePassword}
              autoComplete="off"
              placeholder={authWord}
              onChange={(e) => {
                setDeletePassword(e.target.value)
                setDeleteError('')
              }}
            />
          </Field>
        </div>
        <div className="modal-footer">
          <Button variant="ghost" onClick={() => setConfirming(false)}>
            Cancel
          </Button>
          {/* `.button.reject` — the app's delete buttons are red, and this one
              ends an account. */}
          <Button
            variant="danger"
            onClick={() => {
              if (!deletePassword) {
                setDeleteError(`Please enter your ${authWord.toLowerCase()}.`)
                return
              }
              onDelete?.()
              setConfirming(false)
            }}
          >
            Delete Account
          </Button>
        </div>
      </Modal>
    </div>
  )
}
