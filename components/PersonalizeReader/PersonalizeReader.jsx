import { useEffect, useRef, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Avatar } from '@components/Avatar/Avatar'
import { Button } from '@components/Button/Button'
import { Modal, ModalClose } from '@components/Modal/Modal'
import { Checkbox, Input, Select } from '@components/Form/Form'
import { PartnerBrand } from '@components/PartnerBrand/PartnerBrand'
import { SectionCard } from '@components/SectionCard/SectionCard'
import { SettingList, SettingRow } from '@components/SettingRow/SettingRow'

import '@components/PersonalizeReader/PersonalizeReader.css'

import '@components/Button/Button.css'
import '@components/Modal/Modal.css'
import '@components/Form/Form.css'
import '@components/Avatar/Avatar.css'
import '@components/SectionCard/SectionCard.css'
import '@components/SettingRow/SettingRow.css'
import '@components/Toggle/Toggle.css'

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
 * Left without `preferences`, the Preferences card goes entirely — rows that
 * look tappable with nothing behind them are worse than no section. Every
 * prototype that renders this page for the sake of its App Integrations gets
 * the rest of it.
 *
 * `features.rostered` is the app's `@rostered_app_integrations_only`, which is
 * simply `roster_service_enabled?` — a school site, in practice. The roster owns
 * the reader there: their name, their grade, their picture, whether they exist
 * at all. So the page keeps **only App Integrations**, the one thing the roster
 * has no opinion about.
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

  // `send_recommendations` and the reader's email notifications. The app asks
  // each as a Yes/No radio pair with a Save button under it — four
  // interactions to change a yes to a no, and two more buttons on a page that
  // already has plenty. A switch *is* the save.
  const [emails, setEmails] = useState(true)
  const [recs, setRecs] = useState(true)
  const [editing, setEditing] = useState(null) // preference id whose form is open
  // 'none' | 'picked' (chosen, not yet confirmed) | 'saved'
  const [photo, setPhoto] = useState(reader.photo ? 'saved' : 'none')
  const [photoOk, setPhotoOk] = useState(false)
  // What the reader actually chose off their disk. An object URL, so the
  // picture shows rather than the file's name — picking a photo you can't see
  // is not picking a photo.
  const [photoSrc, setPhotoSrc] = useState(reader.photo ?? null)
  const fileRef = useRef(null)
  useEffect(
    () => () => {
      if (photoSrc?.startsWith('blob:')) URL.revokeObjectURL(photoSrc)
    },
    [photoSrc],
  )
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirms, setConfirms] = useState({ irreversible: false, irretrievable: false })
  const [access, setAccess] = useState(sharedAccess)
  const [invites, setInvites] = useState(sharedInvites)
  const [invitee, setInvitee] = useState('')

  const first = reader.name.split(' ')[0]
  const prefs = preferences ?? {}
  const set = (id) =>
    id === 'gradeLevel' ? Boolean(prefs.gradeLevel) : (prefs[id]?.length ?? 0) > 0

  // The app's two lists, in its own order. `kind` decides which: a child gets
  // the six filters the recommendation engine reads, an adult or teen gets
  // Reading Doorways instead.
  //
  // `basic` is in this list in the app and isn't here. It is the reader's name
  // and birthday — not a thing recommendations are built from — so a row for it
  // under a heading that says they are is the one row on the page that isn't
  // what the heading promises. It goes with the avatar and the name at the top,
  // which is where you would look for it.
  const rows =
    kind === 'child'
      ? [
          { id: 'backgrounds', label: 'Character Backgrounds' },
          { id: 'languages', label: 'Languages' },
          gradeLevels && { id: 'gradeLevel', label: 'Grade Level' },
          { id: 'readingLevels', label: 'Reading Level' },
          { id: 'interests', label: 'Interests' },
          { id: 'genres', label: 'Genres' },
        ].filter(Boolean)
      : [doorways && { id: 'doorways', label: 'Reading Doorways' }].filter(Boolean)

  function invite(e) {
    e.preventDefault()
    const email = invitee.trim()
    if (!email) return
    setInvites((v) => [...v, { id: `inv-${Date.now()}`, email }])
    setInvitee('')
  }

  return (
    <div className="st-page">
      {/* Who you are editing, then what you can change about them. The app gives
          the avatar a 260px column of its own beside the sections; at 140px for
          a circle and a name that is mostly air, and it pushed every section
          right and left the page lopsided. It leads the page instead. */}
      <header className="st-head">
        <h1 className="st-title">Personalize Reader</h1>
      </header>

      {/* Each section is a card. Flat on the page they were six headings down a
          2,300px scroll with nothing to tell one from the next, and the one that
          deletes a reader carried the same weight as the one about email. */}
      <div className="st-main">
        {/* `@rostered_app_integrations_only` — on a rostered site the roster
            owns the reader: their name, their grade, their picture, whether
            they exist at all. So the app leaves exactly one thing on this page,
            which is the one thing the roster has no opinion about. */}
        {rostered && partners.length === 0 && (
          <SectionCard header="bar" title="Nothing to change here">
            <p className="st-body">
              This site syncs its readers from its roster, so {first}&apos;s details are managed
              there rather than here.
            </p>
          </SectionCard>
        )}

        {/* Who this is, and the two things about them that aren't preferences:
            the picture and the name. The picture used to be a pencil on a
            140px circle in a column of its own, which opened a modal to do one
            thing — it is a block on the page now, and it saves in place. */}
        {!rostered && (
          <SectionCard header="bar" title="Profile">
            <div className="st-profile">
              <span className="st-profile-face">
                <Avatar
                  initials={reader.initials}
                  color={reader.color ?? '#FBDDD0'}
                  src={photo === 'none' ? undefined : photoSrc}
                  size="xl"
                />
              </span>
              <div className="st-profile-text">
                <p className="st-profile-name">{reader.name}</p>
                {reader.grade && <p className="st-profile-grade">{reader.grade}</p>}
              </div>
              {avatars && (
                <div className="st-profile-actions">
                  {/* A real picker: the button opens it, and what comes back is
                    shown in the circle above rather than reported as a
                    filename. */}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="st-profile-file"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setPhotoSrc(URL.createObjectURL(file))
                      setPhoto('picked')
                      setPhotoOk(false)
                      e.target.value = ''
                    }}
                  />
                  <Button variant="secondary" size="md" onClick={() => fileRef.current?.click()}>
                    {photo === 'none' ? 'Add Photo' : 'Change Photo'}
                  </Button>
                  {photo !== 'none' && (
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() => {
                        setPhoto('none')
                        setPhotoSrc(null)
                        setPhotoOk(false)
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* `profiles/modals/_profile_avatar_modal` — a picture on a child's
              profile is seen by other readers, so the app makes you say you
              have thought about that before it will take one. */}
            {photo === 'picked' && (
              <div className="st-photo-ok">
                <Checkbox size="sm" checked={photoOk} onChange={setPhotoOk}>
                  I understand that this picture will be displayed publicly and confirm that it
                  would be acceptable to people like teachers and other grownups.
                </Checkbox>
                <Button size="md" disabled={!photoOk} onClick={() => setPhoto('saved')}>
                  Save Photo
                </Button>
              </div>
            )}

            {/* `Basic Information` — the name and the birthday, beside the name
              and the face they belong to rather than filed under Preferences,
              which is not what they are. */}
            {preferences && (
              <SettingList className="st-profile-rows">
                <SettingRow
                  label="Name and birthday"
                  sub={prefs.birthday ? `${first} · ${prefs.birthday}` : first}
                  control={
                    <Button variant="secondary" size="sm" onClick={() => setEditing('basic')}>
                      Edit
                    </Button>
                  }
                />
              </SettingList>
            )}
          </SectionCard>
        )}

        {/* Skipped where the caller hasn't got the filters — the rows would be a
            list of things that look tappable and aren't, which is worse than no
            section. The prototypes that render this page for its App
            Integrations get the rest of it and not this. */}
        {preferences && !rostered && (
          <SectionCard header="bar" title="Preferences">
            <p className="st-hint">
              What {first}&apos;s recommendations are built from. Nothing here is required — an
              unanswered filter just leaves the whole catalog on the table.
            </p>
            <ul className="st-linklist">
              {rows.map((row) => (
                <li key={row.id}>
                  <button type="button" className="st-linkrow" onClick={() => setEditing(row.id)}>
                    {/* `finished` / `not-finished` — the app marks the rows a
                        reader has actually answered. */}
                    <span
                      className={`st-linkrow-state${set(row.id) ? ' is-done' : ''}`}
                      aria-hidden="true"
                    >
                      <Icon name={set(row.id) ? 'circle-check' : 'circle'} size={17} />
                    </span>
                    <span className="st-linkrow-label">{row.label}</span>
                    <span className="st-linkrow-value">{summarize(row.id, prefs, vocab)}</span>
                    <Icon name="chevron-right" size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </SectionCard>
        )}

        {/* Two questions the app asks in two sections with two Save buttons.
            They are the same question — what may we send you about this reader —
            so they are one card, and each is a switch that takes effect when you
            flip it. `send_recommendations` is a child profile always, an adult
            or teen only on a site that curates for them. */}
        {!rostered && (
          <SectionCard header="bar" title="Notifications">
            <SettingList>
              {recommendations && (
                <SettingRow
                  label="Personalized recommendations"
                  sub={`A weekly email of books picked for ${first}`}
                  checked={recs}
                  onChange={setRecs}
                />
              )}
              <SettingRow
                label="Email notifications"
                sub="Badges earned, challenges ending, and reminders to log"
                checked={emails}
                onChange={setEmails}
              />
            </SettingList>
          </SectionCard>
        )}

        {/* Skipped entirely when there are no partners to offer — an empty
            heading + hint is worse than no section. */}
        {partners.length > 0 && (
          <SectionCard header="bar" title="App Integrations" id="app-integrations">
            <p className="st-hint">
              Link a reading app and Beanstack logs what {first} reads there automatically.
            </p>
            <SettingList>
              {partners.map(({ id }) => {
                const conn = connections[id]
                return (
                  <SettingRow
                    key={id}
                    label={<PartnerBrand id={id} size="md" wordmarkOnly />}
                    /* Only where there is an account to name — "Not connected"
                       beside a Connect Account button says it twice. */
                    sub={conn ? `${conn.account} · ${conn.org}` : undefined}
                    control={
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => (conn ? onDisconnect?.(id) : onLink?.(id))}
                      >
                        {conn ? 'Disconnect' : 'Connect Account'}
                      </Button>
                    }
                  />
                )
              })}
            </SettingList>
          </SectionCard>
        )}

        {!rostered && (
          <SectionCard header="bar" title="Share This Reader">
            <p className="st-hint">
              Family, teachers and friends you share with can see {first}&apos;s reading log, badges
              and recommendations.
            </p>
            {/* One row: the address and the thing you do with it. Stacked, Send sat
              on its own line under a full-width field looking like the page's
              save button. */}
            <form className="st-invitefield" onSubmit={invite}>
              <Input
                value={invitee}
                onChange={(e) => setInvitee(e.target.value)}
                type="email"
                placeholder="Enter one email address at a time"
                aria-label="Invitee email"
              />
              <Button type="submit" variant="secondary" size="md" disabled={!invitee.trim()}>
                Send
              </Button>
            </form>

            {/* Who already has it, and who hasn't answered — the app lists both
              under the form, because "send" with no record of what you have
              already sent is how you invite the same person four times. */}
            {access.length > 0 && (
              <div className="st-viewers">
                <h3 className="st-h3">Has access</h3>
                <SettingList>
                  {access.map((v) => (
                    <SettingRow
                      key={v.id}
                      label={v.name}
                      control={
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setAccess((a) => a.filter((x) => x.id !== v.id))}
                        >
                          Revoke
                        </Button>
                      }
                    />
                  ))}
                </SettingList>
              </div>
            )}

            {invites.length > 0 && (
              <div className="st-viewers">
                <h3 className="st-h3">Invited, not yet accepted</h3>
                <SettingList>
                  {invites.map((v) => (
                    <SettingRow
                      key={v.id}
                      label={v.email}
                      control={
                        <>
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
                        </>
                      }
                    />
                  ))}
                </SettingList>
              </div>
            )}
          </SectionCard>
        )}

        {/* Last, and behind a word — the same shape Edit Account uses. Open on
            the page it put two unticked checkboxes and a red button under every
            reader's settings, which is a strange thing to scroll past. */}
        {!rostered && (
          <SectionCard header="bar" title="Delete Reader">
            <p className="st-body">
              All data associated with {first}, and only {first}, will be permanently deleted.
            </p>
            {deleteOpen ? (
              <>
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
                    I understand that deleting this reader will delete all data and history
                    associated with them.
                  </Checkbox>
                </div>
                <div className="st-dangeractions">
                  <button
                    className="st-delete"
                    type="button"
                    disabled={!confirms.irreversible || !confirms.irretrievable}
                    onClick={() => setDeleting(true)}
                  >
                    Permanently Delete Reader
                  </button>
                  <button
                    type="button"
                    className="st-cancel"
                    onClick={() => {
                      setDeleteOpen(false)
                      setConfirms({ irreversible: false, irretrievable: false })
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <Button variant="secondary" size="md" onClick={() => setDeleteOpen(true)}>
                Delete {first}
              </Button>
            )}
          </SectionCard>
        )}
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
          <Button variant="danger" onClick={() => setDeleting(false)}>
            Permanently Delete
          </Button>
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
    shape: 'tiles',
    from: 'interests',
  },
  genres: {
    title: (n) => `What are some of ${n}'s favorite genres?`,
    limit: 'genres',
    shape: 'tiles',
    from: 'genres',
  },
  backgrounds: {
    title: (n) => `What kind of characters most interest ${n}?`,
    limit: 'backgrounds',
    shape: 'groups',
    from: 'backgroundGroups',
  },
  readingLevels: {
    title: (n) => `What is ${n}'s reading level?`,
    limit: 'readingLevels',
    shape: 'levels',
    from: 'readingLevels',
  },
  languages: {
    title: (n) => `What languages does ${n} read in?`,
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
    <Modal
      open={open}
      onClose={onClose}
      variant="center"
      closeBadge
      className="pf-modal"
      ariaLabel={id ?? 'Preference'}
    >
      <ModalClose onClick={onClose} />
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
    <>
      {/* The question is the modal's header, on the bar with a rule under it —
          the shape every other modal in the system uses — rather than the first
          thing in a body that scrolls away underneath it. */}
      <div className="modal-header">
        <div className="modal-header-text">
          <h2 className="modal-title">{title}</h2>
          {limit && <p className="modal-sub">Pick up to {limit}.</p>}
        </div>
      </div>

      <div className="modal-body pf">
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
                      {/* No shared fallback: a grid where every tile carries
                          the same glyph is a grid of noise. A vocabulary
                          without art of its own gets none. */}
                      {o.emoji && (
                        <span className="pf-tile-art" aria-hidden="true">
                          {o.emoji}
                        </span>
                      )}
                      <span className="pf-tile-name" title={name}>
                        {name}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          {pane.shape === 'groups' && (
            <>
              {Object.entries(options).map(([group, tags]) => (
                <div className="pf-group" key={group}>
                  <h2 className="pf-group-title">{group}</h2>
                  <div className="pf-checks">
                    {tags.map((t) => (
                      <Checkbox key={t} checked={value.includes(t)} onChange={() => toggle(t)}>
                        <span title={t}>{t}</span>
                      </Checkbox>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {pane.shape === 'list' && (
            <div className="pf-checks pf-checks--stack">
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
              {/* No label: the pane's own question is the label, and "Grade
                  level" under "What grade is Olivia in?" says it twice. */}
              <Select value={value} onChange={(e) => setValue(e.target.value)} aria-label={title}>
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
      </div>

      {/* The app says Back because each of these is a page in the sign-up
          funnel. Here it is a modal over the settings page, and what the button
          actually does is throw the draft away. */}
      <div className="modal-footer">
        {/* The app's first option on each of these forms is a tile reading "No
            Preference", which lights up when nothing else is picked and clears
            the rest when you press it — which is to say, it is the empty state
            wearing a costume. This is the same answer, said once. */}
        {!single && id !== 'basic' && (
          <Button
            variant="ghost"
            className="pf-clear"
            disabled={value.length === 0}
            onClick={() => setValue([])}
          >
            Clear
          </Button>
        )}
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          disabled={over}
          onClick={() => onSave(id === 'basic' ? 'basic' : id, single ? value || null : value)}
        >
          Save
        </Button>
      </div>

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
    </>
  )
}
