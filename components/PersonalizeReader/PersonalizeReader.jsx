import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Modal, ModalClose, ModalFullClose } from '@components/Modal/Modal'
import { Checkbox, Input, Radio, RadioGroup, Select } from '@components/Form/Form'
import { PartnerBrand } from '@components/PartnerBrand/PartnerBrand'

import '@components/PersonalizeReader/PersonalizeReader.css'

import '@components/Button/Button.css'
import '@components/Modal/Modal.css'
import '@components/Form/Form.css'

/**
 * Beanstack's "Personalize Reader" — `profiles#edit_options`, the page behind
 * the gear. Everything a reader (or the grown-up holding their account) can
 * change about themselves lives here: what they like, who can see them, which
 * reading apps are linked, and how to delete them.
 *
 * **Preferences** is the app's own link-list, and each row carries whether it
 * has been set — `@profile_presenter.is_personalized?`, which is the
 * `finished` / `not-finished` class on those links. Which rows there are
 * depends on the profile: a child gets the six filters the recommendation
 * engine reads (`recommendations/_edit_options`), an adult or teen gets Reading
 * Doorways instead (`profiles/_edit_adult_preferences`), and Grade Level and
 * Basic Information are gated by site settings.
 *
 * A row opens that filter's own form. In the app each is a page in a funnel
 * with Back and "Next: …"; here they are panes of one full-screen flow, which
 * is the same shape without inventing six routes. The headings, the limits and
 * the "No Preference" option are the app's own
 * (`profiles/personalization_forms/*`).
 *
 * Left without `preferences`, the page is what it was before any of this: a
 * single Basic Information row with nothing behind it. Every prototype that
 * renders this for the sake of its App Integrations section still gets exactly
 * that.
 *
 * `partners` is the prototype's own list of partner configs (see PartnerConnect).
 */

const EMPTY_VOCAB = {
  interests: [],
  genres: [],
  backgroundGroups: {},
  readingLevels: [],
  languages: [],
  gradeLevels: [],
  doorways: [],
  limits: {},
}

export function PersonalizeReader({
  reader,
  kind = 'child',
  partners = [],
  connections = {},
  onLink,
  onDisconnect,
  preferences,
  onSavePreferences,
  vocab = EMPTY_VOCAB,
  sharedAccess = [],
  sharedInvites = [],
  features = {},
}) {
  const {
    avatars = true,
    gradeLevels = true,
    rostered = false,
    recommendations = true,
    doorways = true,
  } = features

  const [emails, setEmails] = useState('yes')
  const [recs, setRecs] = useState('yes')
  const [editing, setEditing] = useState(null) // preference id whose form is open
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirms, setConfirms] = useState({ irreversible: false, irretrievable: false })
  const [access, setAccess] = useState(sharedAccess)
  const [invites, setInvites] = useState(sharedInvites)

  const first = reader.name.split(' ')[0]
  const prefs = preferences ?? {}
  const set = (id) =>
    id === 'gradeLevel' ? Boolean(prefs.gradeLevel) : (prefs[id]?.length ?? 0) > 0

  // The app's two lists, in its own order. `basic` has no finished state — it
  // is a form, not a filter — and a rostered site drops it because the roster
  // owns those fields.
  const rows =
    kind === 'child'
      ? [
          !rostered && { id: 'basic', label: 'Basic Information' },
          { id: 'backgrounds', label: 'Character Backgrounds' },
          { id: 'languages', label: 'Languages' },
          !rostered && gradeLevels && { id: 'gradeLevel', label: 'Grade Level' },
          { id: 'readingLevels', label: 'Reading Level' },
          { id: 'interests', label: 'Interests' },
          { id: 'genres', label: 'Genres' },
        ].filter(Boolean)
      : [
          !rostered && { id: 'basic', label: 'Basic Information' },
          doorways && { id: 'doorways', label: 'Reading Doorways' },
        ].filter(Boolean)

  return (
    <div className="st-page">
      <h1 className="st-title">Personalize Reader</h1>

      <div className="st-layout">
        <div className="st-avatar-col">
          <span className="st-avatar" style={{ background: '#FBDDD0' }}>
            <span className="st-avatar-initials">{reader.initials}</span>
            {avatars && (
              <button
                type="button"
                className="st-avatar-edit"
                onClick={() => setAvatarOpen(true)}
                aria-label="Edit avatar"
              >
                <Icon name="pencil" size={13} />
              </button>
            )}
          </span>
          <span className="st-avatar-name">{reader.name}</span>
        </div>

        <div className="st-main">
          <section className="st-section">
            <h2 className="st-h2">Preferences</h2>
            {preferences && (
              <p className="st-hint">
                What Beanstack knows about {first}&apos;s reading, and what its recommendations are
                built from. Nothing here is required — an unanswered filter just means the whole
                catalog is on the table.
              </p>
            )}
            <ul className="st-linklist">
              {rows.map((row) => (
                <li key={row.id}>
                  <button
                    type="button"
                    className="st-linkrow"
                    onClick={() => preferences && setEditing(row.id)}
                  >
                    {/* `finished` / `not-finished` — the app marks the rows a
                        reader has actually answered. */}
                    {preferences && row.id !== 'basic' && (
                      <span className={`st-linkrow-state${set(row.id) ? ' is-done' : ''}`}>
                        <Icon name={set(row.id) ? 'circle-check' : 'circle'} size={17} />
                      </span>
                    )}
                    <span className="st-linkrow-label">{row.label}</span>
                    {preferences && row.id !== 'basic' && (
                      <span className="st-linkrow-value">{summarize(row.id, prefs, vocab)}</span>
                    )}
                    <Icon name="chevron-right" size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* `send_recommendations` — a child profile always, an adult or teen
              only on a site that curates for them. */}
          {recommendations && (
            <section className="st-section">
              <h2 className="st-h2">Personalized Recommendations</h2>
              <div className="st-rule">
                <div className="st-row">
                  <span className="st-row-label">
                    Would you like to receive weekly personalized recommendations for this reader?
                  </span>
                  <RadioGroup name="recs" value={recs} onChange={setRecs}>
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                  </RadioGroup>
                </div>
              </div>
              <Button variant="secondary" size="md">
                Save
              </Button>
            </section>
          )}

          <section className="st-section">
            <h2 className="st-h2">Email Notifications</h2>
            <div className="st-rule">
              <div className="st-row">
                <span className="st-row-label">
                  Would you like to receive email notifications for this reader?
                </span>
                <RadioGroup name="emails" value={emails} onChange={setEmails}>
                  <Radio value="yes">Yes</Radio>
                  <Radio value="no">No</Radio>
                </RadioGroup>
              </div>
            </div>
            <Button variant="secondary" size="md">
              Save
            </Button>
          </section>

          {/* ── The integration surface ───────────────────────────────────
              Skipped entirely when there are no partners to offer — an empty
              heading + hint is worse than no section. */}
          {partners.length > 0 && (
            <section className="st-section" id="app-integrations">
              <h2 className="st-h2">App Integrations</h2>
              <p className="st-hint">
                Link a reading app and Beanstack logs what {first} reads there automatically. Each
                app connects separately.
              </p>
              <div className="st-integrations">
                {partners.map(({ id }) => {
                  const conn = connections[id]
                  return (
                    <div key={id} className="st-integration">
                      <div className="st-integration-brand">
                        <PartnerBrand id={id} size="md" wordmarkOnly />
                        {conn && (
                          <span className="st-integration-acct">
                            {conn.account} · {conn.org}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => (conn ? onDisconnect?.(id) : onLink?.(id))}
                      >
                        {conn ? 'Disconnect' : 'Connect Account'}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          <section className="st-section">
            <h2 className="st-h2">Share This Reader</h2>
            <p className="st-body">
              Sharing gives family, teachers, and friends access to this profile&apos;s
              recommendations, reading log, and badges. This can be useful for keeping them
              up-to-date or giving them the opportunity to collaborate.
            </p>
            <div className="st-field">
              <div className="st-label">Invitee Email</div>
              <Input placeholder="Enter one email address at a time" />
            </div>
            <Button variant="secondary" size="md">
              Send
            </Button>

            {/* Who already has it, and who hasn't answered — the app lists both
                under the form, because "send" with no record of what you have
                already sent is how you invite the same person four times. */}
            {access.length > 0 && (
              <div className="st-viewers">
                <h3 className="st-h3">These folks have access to {first}&apos;s profile.</h3>
                {access.map((v) => (
                  <div className="st-invite" key={v.id}>
                    <span className="st-invite-who">{v.name}</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setAccess((a) => a.filter((x) => x.id !== v.id))}
                    >
                      Revoke
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {invites.length > 0 && (
              <div className="st-viewers">
                <h3 className="st-h3">These folks haven&apos;t accepted your invitation yet.</h3>
                {invites.map((v) => (
                  <div className="st-invite" key={v.id}>
                    <span className="st-invite-who">{v.email}</span>
                    <span className="st-invite-actions">
                      <Button variant="secondary" size="sm">
                        Resend
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setInvites((a) => a.filter((x) => x.id !== v.id))}
                      >
                        Remove
                      </Button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="st-section">
            <h2 className="st-h2">Delete Reader</h2>
            <p className="st-body">
              All data associated with this reader, and only this reader, will be permanently
              deleted.
            </p>
            <p className="st-warn">
              Warning: This cannot be undone, even by the Beanstack support team. This action is
              final!
            </p>
            {/* Both boxes arm the button, and the button still asks — the app
                wants three deliberate acts before a reader goes. */}
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
                I understand that deleting this reader will delete all data and history associated
                with them.
              </Checkbox>
            </div>
            <button
              className="st-delete"
              type="button"
              disabled={!confirms.irreversible || !confirms.irretrievable}
              onClick={() => setDeleting(true)}
            >
              Permanently Delete Reader
            </button>
          </section>
        </div>
      </div>

      <PreferenceFlow
        open={Boolean(editing)}
        id={editing}
        reader={reader}
        prefs={prefs}
        vocab={vocab}
        onClose={() => setEditing(null)}
        onSave={(id, value) => {
          onSavePreferences?.(id, value)
          setEditing(null)
        }}
      />

      <AvatarModal open={avatarOpen} reader={reader} onClose={() => setAvatarOpen(false)} />

      <Modal
        open={deleting}
        onClose={() => setDeleting(false)}
        variant="center"
        closeBadge
        ariaLabel="Delete this reader"
      >
        <ModalClose onClick={() => setDeleting(false)} />
        <div className="modal-header modal-header--flush">
          <h2 className="modal-title">Are you sure you want to delete {first}?</h2>
        </div>
        <div className="modal-body">
          <p>
            Every badge, every logged session and every review will go with them, and nobody —
            Beanstack support included — can get them back.
          </p>
        </div>
        <div className="modal-footer">
          <Button variant="ghost" onClick={() => setDeleting(false)}>
            Keep {first}
          </Button>
          <Button onClick={() => setDeleting(false)}>Permanently Delete</Button>
        </div>
      </Modal>
    </div>
  )
}

/** What a preference row shows for an answer it already has. */
function summarize(id, prefs, vocab) {
  if (id === 'gradeLevel') return prefs.gradeLevel ?? 'No preference'
  const chosen = prefs[id] ?? []
  if (chosen.length === 0) return 'No preference'
  const named = {
    interests: vocab.interests,
    readingLevels: vocab.readingLevels,
    doorways: vocab.doorways,
  }[id]
  const label = (v) => named?.find((o) => o.id === v)?.name ?? v
  if (chosen.length === 1) return label(chosen[0])
  return `${label(chosen[0])} +${chosen.length - 1}`
}

// ─── The preference forms ───────────────────────────────────────────────────
// `profiles/personalization_forms/*`. In the app each is a page in the sign-up
// funnel, with Back and "Next: Choose Favorite Genres" across the bottom; here
// they are panes of one full-screen flow, which is the same shape without six
// routes to invent. The headings and the "Pick up to N" lines are the app's.

const PANES = {
  basic: { title: 'Basic Information' },
  interests: {
    title: (n) => `What is ${n} interested in?`,
    limit: 'interests',
    none: 'No Preference',
    shape: 'tiles',
    from: 'interests',
  },
  genres: {
    title: (n) => `What are some of ${n}'s favorite genres?`,
    limit: 'genres',
    none: "I don't have a preference.",
    shape: 'tiles',
    from: 'genres',
  },
  backgrounds: {
    title: (n) => `What kind of characters most interest ${n}?`,
    limit: 'backgrounds',
    none: 'No Preference',
    shape: 'groups',
    from: 'backgroundGroups',
  },
  readingLevels: {
    title: (n) => `What is ${n}'s reading level?`,
    limit: 'readingLevels',
    none: 'I’m not sure.',
    shape: 'levels',
    from: 'readingLevels',
  },
  languages: {
    title: (n) => `What languages does ${n} read in?`,
    none: "I don't have a preference.",
    shape: 'list',
    from: 'languages',
  },
  gradeLevel: { title: (n) => `What grade is ${n} in?`, shape: 'one', from: 'gradeLevels' },
  doorways: { title: () => 'What kind of books do you love to read?', limit: 'doorways', shape: 'doorways', from: 'doorways' }, // prettier-ignore
}

function PreferenceFlow({ open, id, reader, prefs, vocab, onClose, onSave }) {
  const pane = id ? PANES[id] : null
  const first = reader.name.split(' ')[0]

  // The draft is seeded when the flow opens and thrown away on close, so a
  // cancelled form leaves nothing behind. `key` does the seeding: a new pane is
  // a new component.
  return (
    <Modal open={open} onClose={onClose} variant="full" ariaLabel={id ?? 'Preference'}>
      <ModalFullClose onClick={onClose} />
      <div className="modal-full-panel">
        {pane && (
          <PreferencePane
            key={id}
            id={id}
            pane={pane}
            first={first}
            prefs={prefs}
            vocab={vocab}
            onCancel={onClose}
            onSave={onSave}
          />
        )}
      </div>
    </Modal>
  )
}

function PreferencePane({ id, pane, first, prefs, vocab, onCancel, onSave }) {
  const single = pane.shape === 'one'
  const [value, setValue] = useState(() => (single ? (prefs.gradeLevel ?? '') : (prefs[id] ?? [])))
  const [info, setInfo] = useState(null) // a doorway whose "More Info" is open

  const limit = pane.limit ? vocab.limits?.[pane.limit] : null
  const options = vocab[pane.from] ?? (pane.shape === 'groups' ? {} : [])
  const over = Boolean(limit) && value.length > limit
  const title = typeof pane.title === 'function' ? pane.title(first) : pane.title

  const toggle = (v) => setValue((set) => (set.includes(v) ? set.filter((x) => x !== v) : [...set, v])) // prettier-ignore

  return (
    <div className="pf">
      <header className="pf-head">
        <h1 className="pf-title">{title}</h1>
        {limit && <p className="pf-limit">Pick up to {limit}.</p>}
      </header>

      {/* `filter-limit-notice.over-selected` — the app says so rather than
          refusing the click, and the save is what's blocked. */}
      {over && (
        <p className="pf-over" role="alert">
          Please pick up to {limit} {id === 'readingLevels' ? 'reading levels' : id}.
        </p>
      )}

      <div className="pf-body">
        {pane.shape === 'tiles' && (
          <ul className="pf-tiles">
            <li>
              <NoPreference
                label={pane.none}
                on={value.length === 0}
                onClick={() => setValue([])}
              />
            </li>
            {options.map((o) => {
              const key = o.id ?? o
              const name = o.name ?? o
              return (
                <li key={key}>
                  <button
                    type="button"
                    className={`pf-tile${value.includes(key) ? ' is-on' : ''}`}
                    aria-pressed={value.includes(key)}
                    onClick={() => toggle(key)}
                  >
                    <span className="pf-tile-art" aria-hidden="true">
                      {o.emoji ?? '📚'}
                    </span>
                    <span className="pf-tile-name">{name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {pane.shape === 'groups' && (
          <>
            <NoPreference label={pane.none} on={value.length === 0} onClick={() => setValue([])} />
            {Object.entries(options).map(([group, tags]) => (
              <div className="pf-group" key={group}>
                <h2 className="pf-group-title">{group}</h2>
                <div className="pf-checks">
                  {tags.map((t) => (
                    <Checkbox key={t} checked={value.includes(t)} onChange={() => toggle(t)}>
                      {t}
                    </Checkbox>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {pane.shape === 'list' && (
          <div className="pf-checks pf-checks--stack">
            <NoPreference label={pane.none} on={value.length === 0} onClick={() => setValue([])} />
            {options.map((o) => (
              <Checkbox key={o} checked={value.includes(o)} onChange={() => toggle(o)}>
                {o}
              </Checkbox>
            ))}
          </div>
        )}

        {/* A level carries the description the site wrote for it, and the app
            greys out one the reader's age rules out. */}
        {pane.shape === 'levels' && (
          <div className="pf-levels">
            <NoPreference label={pane.none} on={value.length === 0} onClick={() => setValue([])} />
            {options.map((l) => (
              <label className={`pf-level${value.includes(l.id) ? ' is-on' : ''}`} key={l.id}>
                <Checkbox checked={value.includes(l.id)} onChange={() => toggle(l.id)}>
                  {l.name}
                </Checkbox>
                <span className="pf-level-hint">{l.description}</span>
              </label>
            ))}
          </div>
        )}

        {pane.shape === 'doorways' && (
          <ul className="pf-doorways">
            {options.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  className={`pf-doorway${value.includes(d.id) ? ' is-on' : ''}`}
                  aria-pressed={value.includes(d.id)}
                  onClick={() => toggle(d.id)}
                  style={{ '--dw': d.tint }}
                >
                  <span className="pf-doorway-art" aria-hidden="true">
                    {d.emoji}
                  </span>
                  <span className="pf-doorway-name">{d.name}</span>
                </button>
                <button type="button" className="pf-doorway-more" onClick={() => setInfo(d)}>
                  More Info
                </button>
              </li>
            ))}
          </ul>
        )}

        {pane.shape === 'one' && (
          <div className="pf-one">
            <Select value={value} onChange={(e) => setValue(e.target.value)} label="Grade level">
              <option value="">No preference</option>
              {options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Basic Information is a form, not a filter — the app's own fields for
            it live in the sign-up funnel and are the reader's name and
            birthday. */}
        {id === 'basic' && (
          <div className="pf-basic">
            <Input label="First name" defaultValue={first} />
            <Input label="Birthday" defaultValue={prefs.birthday ?? ''} />
          </div>
        )}
      </div>

      <footer className="pf-foot">
        <Button variant="secondary" onClick={onCancel}>
          Back
        </Button>
        <Button
          disabled={over}
          onClick={() => onSave(id === 'basic' ? 'basic' : id, single ? value || null : value)}
        >
          Save
        </Button>
      </footer>

      <Modal
        open={Boolean(info)}
        onClose={() => setInfo(null)}
        variant="center"
        closeBadge
        ariaLabel="About this doorway"
      >
        <ModalClose onClick={() => setInfo(null)} />
        {info && (
          <>
            <div className="modal-header modal-header--flush">
              <h2 className="modal-title">
                <span aria-hidden="true">{info.emoji}</span> {info.name}
              </h2>
            </div>
            <div className="modal-body">
              <p>{info.description}</p>
              <h3 className="pf-phrases-head">People often describe these kinds of books as…</h3>
              <ul className="pf-phrases">
                {info.phrases.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

/**
 * The app's own first option on every one of these forms. It is a real answer —
 * picking it clears the rest — and not the same as leaving the form alone.
 */
function NoPreference({ label, on, onClick }) {
  return (
    <button
      type="button"
      className={`pf-none${on ? ' is-on' : ''}`}
      aria-pressed={on}
      onClick={onClick}
    >
      <Icon name={on ? 'circle-check' : 'circle'} size={18} />
      {label}
    </button>
  )
}

/**
 * "Edit Avatar" — `profiles/modals/_profile_avatar_modal.html.haml`, including
 * the checkbox that arms the Save. A picture on a child's profile is seen by
 * other readers, so the app makes you say you have thought about that before it
 * will take one.
 */
function AvatarModal({ open, reader, onClose }) {
  const [picked, setPicked] = useState(false)
  const [ok, setOk] = useState(false)

  return (
    <Modal open={open} onClose={onClose} variant="center" closeBadge ariaLabel="Edit avatar">
      <ModalClose onClick={onClose} />
      <div className="modal-header modal-header--flush">
        {/* The header is a row, so a title with a sub-line under it needs the
            pair wrapped — `.modal-header-text` is what that wrapper is. */}
        <div className="modal-header-text">
          <h2 className="modal-title">Edit Avatar</h2>
          <p className="modal-sub">We recommend: 200 x 200px — png, jpg, gif. Max filesize: 5MB.</p>
        </div>
      </div>
      <div className="modal-body">
        <div className="av-preview">
          <span className="av-disc" style={{ background: '#FBDDD0' }}>
            {picked ? (
              <span className="av-picked" aria-hidden="true">
                <Icon name="photo" size={30} />
              </span>
            ) : (
              <span className="st-avatar-initials">{reader.initials}</span>
            )}
          </span>
        </div>
        <div className="av-actions">
          <Button onClick={() => setPicked(true)}>
            {picked ? 'Change Photo' : 'Select Photo'}
          </Button>
          {picked && (
            <Button
              variant="secondary"
              onClick={() => {
                setPicked(false)
                setOk(false)
              }}
            >
              Remove Photo
            </Button>
          )}
        </div>
        {picked && (
          <div className="av-notice">
            <Checkbox size="sm" checked={ok} onChange={setOk}>
              I understand that this picture will be displayed publicly and confirm that it would be
              acceptable to people like teachers and other grownups.
            </Checkbox>
          </div>
        )}
      </div>
      <div className="modal-footer">
        <Button disabled={!picked || !ok} onClick={onClose}>
          Save
        </Button>
      </div>
    </Modal>
  )
}
