import { useState, useRef, useEffect } from 'react'
import { Modal } from '@components/Modal/Modal'
import { Button } from '@components/Button/Button'
import { Select } from '@components/Form/Form'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { IconButton } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import { SettingRow, SettingList } from '@components/SettingRow/SettingRow'
import { SAFETY_CATEGORY } from '../../sfr/components/SessionsTable'
import '@components/Form/Form.css'
import './SafetySettings.css'

// Example phrasings per concern category, so admins understand what's caught.
const CAT_EXAMPLES = {
  'self-harm': '“I want to hurt myself,” “everyone would be better off without me”',
  'harm-others': '“I want to make them pay,” threats of violence',
  abuse: '“Someone at home hurts me”',
  bullying: '“Kids keep picking on me,” “I don’t want to come to school”',
  distress: '“I’ve been really sad lately”',
}

// One global threshold for which signals send emails (simpler than a
// per-recipient control). “Possible” is low-confidence, so it's opt-in.
const THRESHOLD_OPTS = [
  { value: 'all', label: 'All signals' },
  { value: 'warning', label: 'Warning & Critical' },
  { value: 'critical', label: 'Critical only' },
]

// Searchable directory. The `dynamic` entry routes per-student (to whoever the
// flagged student's teacher is) rather than to one fixed inbox.
const DIRECTORY = [
  {
    id: 'auto-teacher',
    kind: 'dynamic',
    name: "Student's teacher",
    sub: "Each flagged student's assigned teacher",
  },
  {
    id: 'okafor',
    kind: 'person',
    name: 'Mr. Okafor',
    role: 'Teacher',
    email: 'okafor@maplewood.edu',
  },
  {
    id: 'johnson',
    kind: 'person',
    name: 'Mrs. Johnson',
    role: 'Teacher',
    email: 'johnson@maplewood.edu',
  },
  {
    id: 'reyes',
    kind: 'person',
    name: 'Ms. Reyes',
    role: 'Principal',
    email: 'reyes@maplewood.edu',
  },
  {
    id: 'kim',
    kind: 'person',
    name: 'Mr. Kim',
    role: 'Vice Principal',
    email: 'kim@maplewood.edu',
  },
  { id: 'patel', kind: 'person', name: 'Nurse Patel', role: 'Nurse', email: 'patel@maplewood.edu' },
  {
    id: 'reed',
    kind: 'person',
    name: 'Dr. Reed',
    role: 'Psychologist',
    email: 'reed@maplewood.edu',
  },
]

const INITIAL_RECIPIENTS = [
  DIRECTORY[0], // Student's teacher
  DIRECTORY.find((d) => d.id === 'reyes'), // Principal
]

export function SafetySettings({ open, onClose }) {
  const [enabled, setEnabled] = useState(() => Object.keys(SAFETY_CATEGORY))
  const setOn = (key, on) =>
    setEnabled((cur) => (on ? [...new Set([...cur, key])] : cur.filter((k) => k !== key)))

  const [emailsOn, setEmailsOn] = useState(true)
  const [threshold, setThreshold] = useState('warning')
  const [recipients, setRecipients] = useState(INITIAL_RECIPIENTS)
  const [query, setQuery] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const pickerRef = useRef(null)

  useEffect(() => {
    if (!pickerOpen) return
    const onDown = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setPickerOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [pickerOpen])

  const removeRecipient = (id) => setRecipients((rs) => rs.filter((r) => r.id !== id))
  const addRecipient = (entry) => {
    setRecipients((rs) => (rs.some((r) => r.id === entry.id) ? rs : [...rs, entry]))
    setQuery('')
    setPickerOpen(false)
  }

  const q = query.trim().toLowerCase()
  const matches = DIRECTORY.filter((o) => !recipients.some((r) => r.id === o.id)).filter(
    (o) =>
      !q ||
      o.name.toLowerCase().includes(q) ||
      (o.role || '').toLowerCase().includes(q) ||
      (o.email || '').toLowerCase().includes(q),
  )
  const looksEmail = /\S+@\S+\.\S+/.test(query.trim())
  const emailKnown = recipients.some((r) => r.email === q) || DIRECTORY.some((d) => d.email === q)
  const addEmail = () => {
    const email = query.trim()
    addRecipient({
      id: `r-${Date.now()}`,
      kind: 'person',
      name: email.split('@')[0],
      role: 'Staff',
      email,
    })
  }

  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel="Safety signal settings">
      <div className="sg-settings">
        <div className="sg-settings-head">
          <div>
            <div className="sg-settings-title">Safety Signal Settings</div>
            <div className="sg-settings-sub">How Benny detects concerns and who gets notified.</div>
          </div>
          <IconButton variant="ghost" onClick={onClose} aria-label="Close">
            <Icon name="x" size={16} stroke={2.2} />
          </IconButton>
        </div>

        <div className="sg-settings-body">
          {/* What Benny watches for */}
          <section className="sg-set-section">
            <div className="sg-set-section-title">What Benny watches for</div>
            <p className="sg-set-note">
              Book Talks are screened by AWS Bedrock safety guardrails plus a keyword watch-list,
              then graded into a tier. Turn a concern off to stop flagging it.
            </p>
            <SettingList>
              {Object.entries(SAFETY_CATEGORY).map(([key, cfg]) => (
                <SettingRow
                  key={key}
                  label={
                    <span className="sg-set-cat-label">
                      <Icon name={cfg.icon} size={15} />
                      {cfg.label}
                    </span>
                  }
                  sub={CAT_EXAMPLES[key]}
                  checked={enabled.includes(key)}
                  onChange={(on) => setOn(key, on)}
                />
              ))}
            </SettingList>
          </section>

          {/* Notification emails */}
          <section className="sg-set-section">
            <div className="sg-set-section-title">Notifications</div>
            <SettingList>
              <SettingRow
                label={
                  <span className="sg-set-cat-label sg-set-cat-label--neutral">
                    <Icon name="mail" size={15} />
                    Notification emails
                  </span>
                }
                sub="Email the recipients below when a safety signal is detected."
                checked={emailsOn}
                onChange={setEmailsOn}
              />
              {emailsOn && (
                <SettingRow
                  label="Send emails for"
                  sub="Low-confidence “Possible” matches stay in-app only unless you include them."
                  control={
                    <Select
                      size="sm"
                      value={threshold}
                      onChange={(e) => setThreshold(e.target.value)}
                      aria-label="Which signals send emails"
                    >
                      {THRESHOLD_OPTS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </Select>
                  }
                />
              )}
            </SettingList>

            {emailsOn && (
              <div className="sg-recip">
                <div className="sg-recip-head">Recipients</div>

                <div className="sg-recip-add" ref={pickerRef} onFocus={() => setPickerOpen(true)}>
                  <SearchInput
                    value={query}
                    onChange={(v) => {
                      setQuery(v)
                      setPickerOpen(true)
                    }}
                    placeholder="Add a recipient — search staff or type an email…"
                    ariaLabel="Search recipients to add"
                  />
                  {pickerOpen && (matches.length > 0 || (looksEmail && !emailKnown)) && (
                    <div className="sg-recip-menu">
                      {matches.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          className="sg-recip-opt"
                          onClick={() => addRecipient(o)}
                        >
                          <span className="sg-recip-opt-ic">
                            <Icon name={o.kind === 'dynamic' ? 'users' : 'user'} size={15} />
                          </span>
                          <span className="sg-recip-opt-text">
                            <span className="sg-recip-opt-name">{o.name}</span>
                            <span className="sg-recip-opt-sub">
                              {o.kind === 'dynamic' ? o.sub : `${o.role} · ${o.email}`}
                            </span>
                          </span>
                          {o.kind === 'dynamic' && <span className="sg-recip-opt-tag">Auto</span>}
                        </button>
                      ))}
                      {looksEmail && !emailKnown && (
                        <button type="button" className="sg-recip-opt" onClick={addEmail}>
                          <span className="sg-recip-opt-ic">
                            <Icon name="plus" size={15} />
                          </span>
                          <span className="sg-recip-opt-text">
                            <span className="sg-recip-opt-name">Add “{query.trim()}”</span>
                            <span className="sg-recip-opt-sub">Email this address directly</span>
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <SettingList>
                  {recipients.map((r) => (
                    <SettingRow
                      key={r.id}
                      label={
                        <span className="sg-recip-label">
                          {r.name}
                          {r.kind === 'dynamic' ? (
                            <span className="sg-recip-role sg-recip-role--auto">Auto</span>
                          ) : (
                            <span className="sg-recip-role">{r.role}</span>
                          )}
                        </span>
                      }
                      sub={r.kind === 'dynamic' ? r.sub : r.email}
                      control={
                        <button
                          className="sg-recip-remove"
                          onClick={() => removeRecipient(r.id)}
                          title="Remove recipient"
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      }
                    />
                  ))}
                </SettingList>
              </div>
            )}
          </section>
        </div>

        <div className="sg-settings-foot">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" accent="#DC2626" onClick={onClose}>
            Save settings
          </Button>
        </div>
      </div>
    </Modal>
  )
}
