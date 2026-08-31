import { useState } from 'react'
import { AppShell } from '@components/AppShell/AppShell'
import { Banner } from '@components/Primitives/Primitives'
import { SettingRow, SettingList } from '@components/SettingRow/SettingRow'
import { NumberInput } from '@components/Form/Form'
import { Icon } from '@components/Icon/Icon'
import { Pill } from '@components/Pill/Pill'
import { TalkKindPicker } from '../components/TalkKindPicker'
import { TALK_KINDS } from '../data'

import '@components/MainRail/MainRail.css'
import '@components/Pill/Pill.css'
import '@components/Primitives/Primitives.css'
import '@components/BennyBubble/BennyBubble.css'
import '@components/SettingRow/SettingRow.css'
import '@components/Form/Form.css'

// Sidebar = the production "Setup" section, the same nav the Roster Sync
// Settings prototype renders. Book Talks with Benny gets its own item here
// rather than living inside Reading Integrity Settings: the ticket makes it a
// site-wide engagement setting, not only an integrity one.
const SETUP_NAV = [
  { id: 'reading-integrity', label: 'Reading Integrity Settings', icon: 'shield' },
  { id: 'book-talks', label: 'Book Talks with Benny', icon: 'book' },
  { id: 'school-contact', label: 'School Contact Details', icon: 'person' },
  { id: 'sync', label: 'Roster Sync Settings', icon: 'analytics' },
  { id: 'community-goal', label: 'Community Goal', icon: 'flag' },
  { id: 'achievements', label: 'Achievement Settings', icon: 'habits' },
  { id: 'classroom-naming', label: 'Classroom Naming', icon: 'book' },
  { id: 'other', label: 'Other Settings', icon: 'overview' },
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
// `planPreview` shows the demo swap between a site that has BTWB and one that
// doesn't. That's this prototype's own story; a consumer borrowing the page for
// a different feature hides it.
export function SettingsView({
  settings,
  onChange,
  newTags = ['completion', 'kind', 'selfStart'],
  planPreview = true,
}) {
  const set = (patch) => onChange({ ...settings, ...patch })
  const off = !settings.btwbOn
  // Whether BTWB is on this site's plan at all. Swappable from the page header so
  // the sales state is one click away without its own demo view.
  const [entitled, setEntitled] = useState(true)

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
          {/* Demo affordance, not a real control — swaps between a site that has
            BTWB and one that doesn't. */}
          {planPreview && (
            <button
              type="button"
              className="bw-state-swap"
              onClick={() => setEntitled((e) => !e)}
              aria-pressed={!entitled}
            >
              <Icon name={entitled ? 'lock' : 'settings'} size={14} />
              {entitled ? 'Preview: not on plan' : 'Preview: enabled site'}
            </button>
          )}
        </header>

        {/* A site without BTWB gets the pitch instead of the switches. */}
        {!entitled ? (
          <UpsellPanel />
        ) : (
          <SettingsBody settings={settings} set={set} off={off} newTags={newTags} />
        )}
      </div>
    </AppShell>
  )
}

// The sales state: BTWB isn't part of this site's plan, so there's nothing to
// configure yet. Lead with what Benny would actually do for them — one line per
// talk type — rather than a bare "not enabled, contact sales".
function UpsellPanel() {
  return (
    <section className="bw-upsell">
      <div className="bw-upsell-body">
        <h2 className="bw-upsell-title">Let Benny do the talking</h2>
        <p className="bw-upsell-lead">
          Book Talks with Benny turn a finished book into a short, friendly conversation — so you
          hear what your readers actually thought, without handing them a quiz.
        </p>

        <ul className="bw-upsell-list">
          {Object.values(TALK_KINDS).map((k) => (
            <li key={k.id} style={{ '--kind': k.color }}>
              <span className="bw-upsell-kind">
                <Icon name={k.icon} size={16} />
                {k.label}
              </span>
              <span className="bw-upsell-kind-blurb">{k.blurb}</span>
            </li>
          ))}
        </ul>

        <div className="bw-upsell-actions">
          <a className="bw-upsell-cta" href="#contact-account-team">
            Talk to your account team
            <Icon name="arrow-right" size={16} />
          </a>
          <a className="bw-upsell-link" href="#book-talks-learn-more">
            See how Book Talks work
          </a>
        </div>
      </div>
    </section>
  )
}

// The configurable state — the settings this ticket is actually about.
function SettingsBody({ settings, set, off, newTags }) {
  const isNew = (key) => newTags.includes(key)
  return (
    <>
      {/* ── Master switch ─────────────────────────────────────────────────── */}
      <section className="bw-panel bw-panel--rows">
        <SettingList>
          <SettingRow
            label="Book Talks with Benny"
            sub="Benny holds short, friendly conversations with readers about the books they log. Grade 3 and up."
            state={settings.btwbOn ? 'On' : 'Off'}
            checked={settings.btwbOn}
            onChange={(v) => set({ btwbOn: v })}
            size="lg"
          />
        </SettingList>
        {off && (
          <Banner level="warning" className="bw-panel-banner">
            Benny is switched off for this site — no book talks start, from any trigger. Turning him
            back on re-enables completion talks by default.
          </Banner>
        )}
      </section>

      {/* ── The site-wide triggers ───────────────────────────────────────── */}
      {/* Only the two switches this page actually owns. A challenge can turn
          Book Talks on for itself, but that's the Challenge Creator's setting —
          a read-only row for it just read as a broken control, so it's a line in
          the footer note instead. */}
      <section className={`bw-panel${off ? ' is-dimmed' : ''}`}>
        <h2 className="bw-panel-title">When should Benny start a book talk?</h2>

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
            sub="Benny starts a talk every time a reader logs a book as complete, anywhere on the site — challenge or not."
            state={settings.onCompletion ? 'On' : 'Off'}
            checked={settings.onCompletion}
            onChange={(v) => set({ onCompletion: v })}
            disabled={off}
          />

          {/* The ticket's open question, made an explicit admin choice. */}
          {settings.onCompletion && !off && (
            <div className="bw-subsetting bw-subsetting--nested">
              <TalkKindPicker
                showNew={isNew('kind')}
                label="What kind of conversation should a completion talk be?"
                value={settings.completionKind}
                onChange={(id) => set({ completionKind: id })}
              />
            </div>
          )}

          {/* NEW — the reader-initiated trigger. The other two are scoped to the
              thing that fires them (a completion, a suspicious log, a challenge);
              a reader starting a talk on their own isn't inside any of those, so
              Benny has to be reachable site-wide. It's also the master switch for
              Book Talk badges: a challenge can only offer them when this is on. */}
          <SettingRow
            label={
              <span className="bw-row-label-new">
                Whenever a student wants
                {isNew('selfStart') && (
                  <Pill color="#0E7490" variant="filled" size="sm">
                    New
                  </Pill>
                )}
              </span>
            }
            sub="Readers can start a book talk with Benny on their own, any time — they don’t have to log a book first. Turning this on also enables Book Talk badges in challenges, which Benny awards for the conversations a reader has."
            state={settings.selfStart ? 'On' : 'Off'}
            checked={settings.selfStart}
            onChange={(v) => set({ selfStart: v })}
            disabled={off}
          />

          {/* A talk readers can start at will needs a bound. */}
          {settings.selfStart && !off && (
            <div className="bw-subsetting bw-subsetting--nested bw-subsetting--inline">
              <div className="bw-subsetting-title">How many can a reader start in a day?</div>
              <NumberInput
                min={1}
                max={10}
                value={settings.selfStartLimit ?? 3}
                onChange={(v) => set({ selfStartLimit: v })}
              />
            </div>
          )}

          {/* Today's behavior, part of the Integrity Suite. No type
              choice at all: this trigger fires *because* a log looks off, and the
              integrity talk is the only one that flags concerning patterns back.
              It's a switch, not a configuration. */}
          <SettingRow
            label="Above the warning threshold"
            sub="Benny runs an integrity check-in when a reader logs more than the site’s warning level allows. Unverified readers only."
            state={settings.onWarning ? 'On' : 'Off'}
            checked={settings.onWarning}
            onChange={(v) => set({ onWarning: v })}
            disabled={off}
          />
        </SettingList>

        <Banner level="info" className="bw-panel-banner">
          Book Talks can also be switched on for an individual challenge, in the Challenge Creator’s{' '}
          <span className="bw-inline-strong">Book Talks</span> step — that challenge takes priority
          over these site-wide triggers. Every completed talk lands on your{' '}
          <span className="bw-inline-strong">Sessions for Review</span> page with Benny’s summary of
          the talk.
        </Banner>
      </section>
    </>
  )
}
