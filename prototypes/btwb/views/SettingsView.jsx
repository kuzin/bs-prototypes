import { useState } from 'react'
import { AppShell } from '@components/AppShell/AppShell'
import { Banner } from '@components/Primitives/Primitives'
import { SettingRow, SettingList } from '@components/SettingRow/SettingRow'
import { Icon } from '@components/Icon/Icon'
import { Pill } from '@components/Pill/Pill'
import { FocusPicker } from '../components/FocusPicker'
import { TALK_KINDS, COMPLETION_KINDS } from '../data'

import '@components/MainRail/MainRail.css'
import '@components/Pill/Pill.css'
import '@components/Primitives/Primitives.css'
import '@components/BennyBubble/BennyBubble.css'
import '@components/SettingRow/SettingRow.css'

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
export function SettingsView({ settings, onChange }) {
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
          <button
            type="button"
            className="bw-state-swap"
            onClick={() => setEntitled((e) => !e)}
            aria-pressed={!entitled}
          >
            <Icon name={entitled ? 'lock' : 'settings'} size={14} />
            {entitled ? 'Preview: not on plan' : 'Preview: enabled site'}
          </button>
        </header>

        {/* A site without BTWB gets the pitch instead of the switches. */}
        {!entitled ? <UpsellPanel /> : <SettingsBody settings={settings} set={set} off={off} />}
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
function SettingsBody({ settings, set, off }) {
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

      {/* ── The three triggers ───────────────────────────────────────────── */}
      <section className={`bw-panel${off ? ' is-dimmed' : ''}`}>
        <h2 className="bw-panel-title">When should Benny start a book talk?</h2>

        <SettingList>
          {/* Priority 1 — lives in the Challenge Creator, shown here read-only
              so admins can see the full picture from one page. */}
          <SettingRow
            label="In specific challenges"
            sub="Switched on per challenge, in the Challenge Creator’s Book Talks step."
            disabled
            control={
              <span className="bw-row-note">
                <Icon name="settings" size={14} /> Per challenge
              </span>
            }
          />

          {/* Priority 2 — NEW. The ticket's actual ask. */}
          <SettingRow
            label={
              <span className="bw-row-label-new">
                On book completions
                <Pill color="#0E7490" variant="filled" size="sm">
                  New
                </Pill>
              </span>
            }
            sub="Benny starts a talk every time a reader logs a book as complete, anywhere on the site — challenge or not."
            state={settings.onCompletion ? 'On' : 'Off'}
            checked={settings.onCompletion}
            onChange={(v) => set({ onCompletion: v })}
            disabled={off}
          />

          {/* The ticket's open question, made an explicit admin choice. Integrity
              isn't offered — that type belongs to the warning threshold above. */}
          {settings.onCompletion && !off && (
            <div className="bw-subsetting bw-subsetting--nested">
              <h3 className="bw-subsetting-title">
                What kind of conversation should a completion talk be?
              </h3>
              <div className="bw-kind-cards" role="radiogroup" aria-label="Conversation type">
                {COMPLETION_KINDS.map((k) => {
                  const active = settings.completionKind === k.id
                  return (
                    <button
                      key={k.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={`bw-kind-card${active ? ' is-active' : ''}`}
                      style={{ '--kind': k.color }}
                      onClick={() => set({ completionKind: k.id })}
                    >
                      <span className="bw-kind-head">
                        <span className="bw-kind-label">{k.label}</span>
                        {k.isNew && (
                          <Pill color={k.color} variant="filled" size="sm">
                            New
                          </Pill>
                        )}
                        {active && (
                          <Icon name="check" size={14} stroke={2.6} className="bw-kind-check" />
                        )}
                      </span>
                      <span className="bw-kind-blurb">{k.blurb}</span>
                    </button>
                  )
                })}
              </div>

              {/* A comprehension talk needs a focus; an engagement talk doesn't. */}
              {settings.completionKind === 'comprehension' && (
                <div className="bw-focus-block">
                  <h3 className="bw-subsetting-title">
                    What should Benny focus the conversation on?
                  </h3>
                  <FocusPicker
                    value={settings.completionFocus}
                    onChange={(id) => set({ completionFocus: id })}
                  />
                </div>
              )}
            </div>
          )}

          {/* Priority 3 — today's behavior, part of the Integrity Suite. This
              trigger always runs an integrity talk; there's nothing to choose. */}
          <SettingRow
            label="Above the warning threshold"
            sub="Benny checks in when a reader logs more than the site’s warning level allows. Unverified readers only."
            state={settings.onWarning ? 'On' : 'Off'}
            checked={settings.onWarning}
            onChange={(v) => set({ onWarning: v })}
            disabled={off}
          />
        </SettingList>

        <Banner level="info" className="bw-panel-banner">
          Every completed talk lands on your{' '}
          <span className="bw-inline-strong">Sessions for Review</span> page with Benny’s reading
          confidence and takeaways.
        </Banner>
      </section>
    </>
  )
}
