import { AppShell } from '@components/AppShell/AppShell'
import { Banner } from '@components/Primitives/Primitives'
import { SectionCard } from '@components/SectionCard/SectionCard'
import { Button } from '@components/Button/Button'
import { SettingRow, SettingList } from '@components/SettingRow/SettingRow'
import { NumberInput, Select } from '@components/Form/Form'
import { Icon } from '@components/Icon/Icon'
import { Pill } from '@components/Pill/Pill'
import { TalkKindPicker } from '../components/TalkKindPicker'

import '@components/MainRail/MainRail.css'
import '@components/Pill/Pill.css'
import '@components/Primitives/Primitives.css'
import '@components/BennyBubble/BennyBubble.css'
import '@components/SettingRow/SettingRow.css'
import '@components/Form/Form.css'
import '@components/SectionCard/SectionCard.css'
import '@components/Button/Button.css'

/* `@grade_levels` — what `book_talks_lowest_grade_id` picks from. Benny is
   grade 3 and up in practice, but the control offers the site's whole ladder
   the way the app's does. */
const GRADE_LEVELS = [
  { value: 'k', label: 'Kindergarten' },
  ...Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: `Grade ${i + 1}`,
  })),
]

/* `@minute_warning_level` — the site's own warning level, named in the trigger's
   copy the way the app names it. */
const WARNING_LEVEL = 120

/* `@usage` — `BennyBot::Usage`, the conversations this site has spent against
   its allowance. The real page renders it under the form as its own card, plus
   an admin-only form for changing the ceiling. */
const USAGE = { used: 1240, limit: 5000 }

// Sidebar = the production "Setup" section, the same nav the Roster Sync
// Settings prototype renders. Book Talks with Benny gets its own item here
// rather than living inside Reading Integrity Settings: the ticket makes it a
// site-wide engagement setting, not only an integrity one.
const SETUP_NAV = [
  {
    id: 'reading-integrity',
    label: 'Reading Integrity Settings',
    icon: 'shield',
    desc: 'Set flagging rules and review thresholds.',
  },
  {
    id: 'book-talks',
    label: 'Book Talks with Benny',
    icon: 'book',
    desc: 'Configure Book Talks with Benny.',
  },
  {
    id: 'school-contact',
    label: 'School Contact Details',
    icon: 'person',
    desc: 'Update the contact shown to families.',
  },
  {
    id: 'sync',
    label: 'Roster Sync Settings',
    icon: 'analytics',
    desc: 'Connect and schedule your roster provider.',
  },
  {
    id: 'community-goal',
    label: 'Community Goal',
    icon: 'flag',
    desc: 'Set a shared reading goal for the site.',
  },
  {
    id: 'achievements',
    label: 'Achievement Settings',
    icon: 'habits',
    desc: 'Choose which badges and streaks readers earn.',
  },
  {
    id: 'classroom-naming',
    label: 'Classroom Naming',
    icon: 'book',
    desc: 'Choose how classes are labelled.',
  },
  {
    id: 'other',
    label: 'Other Settings',
    icon: 'overview',
    desc: 'Everything else for this site.',
  },
]

// Site Settings — the surface this ticket actually asks for.
//
// The new row is "On book completions": a site-wide trigger that starts a book
// talk every time a student logs a book as complete. Per the ticket it's on by
// default whenever BTWB is on, so flipping the master toggle on here switches it
// on too (see App.jsx's setSettings handler) — that's the "take the friction out
// of the equation" behavior from Don's note, modeled as opt-out, not opt-in.
// `newTags` names which rows wear a "New" pill. Each prototype flags what's new
// to IT — book-talks is about the self-started trigger, so it passes just that
// one rather than re-announcing this page's earlier additions.
// `selfStart` adds the Book Talk badges row and its daily bound. That row is
// the Book Talks: Badges prototype's own proposal — this page is where its
// setting would live, but a prototype about the completion trigger shouldn't
// carry a second prototype's news, so it's off unless the consumer asks.
export function SettingsView({
  settings,
  onChange,
  newTags = ['completion', 'kind'],
  selfStart = false,
}) {
  const set = (patch) => onChange({ ...settings, ...patch })
  const off = !settings.btwbOn

  return (
    <AppShell
      className="bw-shell"
      sidebar={{
        title: 'Setup',
        subtitle: 'Configure and set up your Beanstack site.',
        nav: SETUP_NAV,
        active: 'book-talks',
        onNavigate: () => {
          /* the other Setup pages are inert in this prototype */
        },
        mainRailIndex: 5,
      }}
    >
      <div className="bw-page">
        <header className="bw-page-head">
          <h1 className="bw-h1">Book Talks with Benny</h1>
        </header>

        <SettingsBody
          settings={settings}
          set={set}
          off={off}
          newTags={newTags}
          selfStart={selfStart}
        />
      </div>
    </AppShell>
  )
}

// The configurable state — the settings this ticket is actually about.
function SettingsBody({ settings, set, off, newTags, selfStart }) {
  const isNew = (key) => newTags.includes(key)
  return (
    <>
      {/* ── Master switch — the app's "Enable Book Talks" chunk ───────────── */}
      <SectionCard header="bar" title="Enable Book Talks" className="bw-panel">
        <SettingList>
          <SettingRow
            label="Book Talks with Benny"
            sub="Toggling this on will enable Book Talks for all students in this school in the specified grades."
            checked={settings.btwbOn}
            onChange={(v) => set({ btwbOn: v })}
            size="lg"
          />
        </SettingList>

        {/* `book_talks_lowest_grade_id` — which grades can chat with Benny at
            all. It gates every trigger below, so it belongs with the master
            switch rather than in the triggers chunk. */}
        {!off && (
          <div className="bw-field">
            <label className="bw-field-label" htmlFor="bw-lowest-grade">
              Select the lowest grade that can chat with Benny.
            </label>
            <Select
              id="bw-lowest-grade"
              value={settings.lowestGrade ?? '3'}
              onChange={(e) => set({ lowestGrade: e.target.value })}
            >
              {GRADE_LEVELS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </Select>
          </div>
        )}
        {off && (
          <Banner level="warning" className="bw-panel-banner">
            Benny is switched off for this site — no book talks start, from any trigger. Turning him
            back on re-enables completion talks by default.
          </Banner>
        )}
      </SectionCard>

      {/* ── The site-wide triggers ───────────────────────────────────────── */}
      {/* Hidden rather than dimmed while Benny is off — `masterSection` in the
          app is `hidden` unless enabled, and a page of switches you can see but
          can't touch reads as broken.

          Only the switches this page actually owns. A challenge can turn Book
          Talks on for itself, but that's the Challenge Creator's setting — a
          read-only row for it just read as a broken control, so it's a line in
          the footer note instead. */}
      {!off && (
        <SectionCard header="bar" title="When should Benny start a book talk?" className="bw-panel">
          <SettingList>
            {/* NEW — the ticket's actual ask. */}
            <SettingRow
              label={
                <span className="bw-row-label-new">
                  On book completions
                  {isNew('completion') && (
                    <Pill color="#0E7490" variant="filled" size="sm">
                      New
                    </Pill>
                  )}
                </span>
              }
              sub="Benny starts a book talk every time a reader marks a book as complete."
              checked={settings.onCompletion}
              onChange={(v) => set({ onCompletion: v })}
              disabled={off}
              size="lg"
            />

            {/* The ticket's open question, made an explicit admin choice. It
                appears as the next thing in the list when completions are on,
                rather than inside a tinted block of its own — a panel within a
                panel put a second edge round something that is already inside
                one. */}
            {settings.onCompletion && !off && (
              <div className="bw-subsetting">
                <TalkKindPicker
                  label="What kind of conversation should happen on book completions?"
                  value={settings.completionKind}
                  onChange={(id) => set({ completionKind: id })}
                />
              </div>
            )}

            {/* The Book Talks: Badges proposal — a challenge can only offer a
              Book Talk badge if readers can start talks on their own, which no
              other trigger lets them do. The setting belongs on this page; the
              proposal belongs to that prototype, so it only shows where it is
              being proposed. */}
            {selfStart && (
              <>
                <SettingRow
                  label={
                    <span className="bw-row-label-new">
                      Book Talk badges
                      {isNew('selfStart') && (
                        <Pill color="#0E7490" variant="filled" size="sm">
                          New
                        </Pill>
                      )}
                    </span>
                  }
                  sub="Challenges can award badges for the book talks a reader has with Benny — which means readers start those talks themselves, whenever they want."
                  checked={settings.selfStart}
                  onChange={(v) => set({ selfStart: v })}
                  disabled={off}
                  size="lg"
                />

                {/* A talk readers can start at will needs a bound. */}
                {settings.selfStart && !off && (
                  <div className="bw-subsetting bw-subsetting--inline">
                    <div className="bw-subsetting-title">How many can a reader start in a day?</div>
                    <NumberInput
                      min={1}
                      max={10}
                      value={settings.selfStartLimit ?? 3}
                      onChange={(v) => set({ selfStartLimit: v })}
                    />
                  </div>
                )}
              </>
            )}

            {/* Today's behavior, part of the Integrity Suite. No type
              choice at all: this trigger fires *because* a log looks off, and the
              integrity talk is the only one that flags concerning patterns back.
              It's a switch, not a configuration. */}
            <SettingRow
              label="On logs above the warning level"
              sub={
                <>
                  Benny starts an integrity book talk every time an{' '}
                  <a className="bw-inline-link" href="#verified-readers">
                    unverified reader
                  </a>{' '}
                  logs above the warning level ({WARNING_LEVEL}m).
                </>
              }
              checked={settings.onWarning}
              onChange={(v) => set({ onWarning: v })}
              disabled={off}
              size="lg"
            />
          </SettingList>

          {/* `.infobox.helpbox` — the app's own two paragraphs, the first of which
            changes with the completion toggle. */}
          <Banner level="info" className="bw-panel-banner">
            <p className="bw-help-p">
              {settings.onCompletion ? (
                <>
                  You can also{' '}
                  <a className="bw-inline-link" href="#challenge-book-talks">
                    turn on Book Talks for specific challenges
                  </a>
                  ; those settings take precedence over the ones on this page.
                </>
              ) : (
                'Talks can also be turned on for specific challenges, using the Book Talks tab when you create one; those settings take precedence over the ones on this page.'
              )}{' '}
              Whatever the type, every completed talk appears under your{' '}
              <span className="bw-inline-strong">Book Talks &amp; Flagged Sessions</span> page.
            </p>
          </Banner>
        </SectionCard>
      )}

      {/* `book_talk_settings__usage` — what the site has spent this school year,
          its own card under the form. */}
      <section className="bw-usage">
        <h2 className="bw-usage-title">Current Usage</h2>
        <p className="bw-panel-sub">
          Track the total number of conversations used this school year (since Aug. 1)
        </p>
        <span className="bw-usage-text">
          <strong>Conversations Used:</strong> {USAGE.used.toLocaleString()}/
          {USAGE.limit.toLocaleString()} ({Math.round((USAGE.used / USAGE.limit) * 100)}%)
        </span>
        <div className="bw-usage-bar">
          <div
            className="bw-usage-bar-used"
            style={{ width: `${(USAGE.used / USAGE.limit) * 100}%` }}
          />
        </div>
      </section>

      {/* `.actions-wrap` — the app's own Save / Cancel foot. */}
      <div className="bw-actions">
        <Button variant="primary" size="md">
          Save
        </Button>
        <Button variant="secondary" size="md">
          Cancel
        </Button>
      </div>
    </>
  )
}
