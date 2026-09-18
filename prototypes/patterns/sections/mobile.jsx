/**
 * The mobile design system's showcases.
 *
 * Every entry renders inside `.m-app`, because nothing in the mobile system resolves outside that
 * scope — its tokens are declared there rather than on `:root`, precisely so the two design
 * systems can share this page without either one leaking into the other.
 *
 * `usage:` strings name the real RN component where one exists, so the Pattern Library reads as a
 * handoff glossary: an engineer seeing `TextPill` here can find `src/components/shared/TextPill.tsx`.
 */
import {
  ProfileBar,
  TextField,
  ToggleSwitch,
  PhoneFrame,
  Header,
  TabBar,
  TopTabs,
  Keyboard,
  SectionHeader,
  DailyGoalBanner,
  PlusMenu,
  Text,
  PressableButton,
  TextPill,
  Card,
  EmptyState,
  ProfileRow,
  ProgressBar,
  FormField,
  SheetHeader,
  ActionsModal,
  Alert,
  SelectSheet,
  MonthHeader,
  FilterBar,
  StatCard,
  Carousel,
  EmptyStateView,
  LoadingIndicator,
  LogLoader,
  CompletedLoader,
  ListFooter,
  Img,
} from '@mobile/components'
import { ACCENT_PRESETS, accentVars } from '@mobile/accent'
import { Variant } from './_shared'
import { useState } from 'react'

/**
 * The `.m-app` scope on a plain ground — for a component that needs no device chrome.
 *
 * Deliberately NOT capped at the 393pt device width. That cap belongs to `PhoneFrame`, which is
 * what you use when the point IS the device; here the point is the component, and a card pinned to
 * 353pt in a 677pt pane just reads as a component that cannot fill its container. Anything whose
 * layout genuinely depends on the screen width is shown in the frame instead.
 */
function MScope({ pad = 20, background = 'var(--m-c-background-home-gray)', children, style }) {
  return (
    <div
      className="m-app"
      style={{ padding: pad, background, borderRadius: 12, width: '100%', ...style }}
    >
      {children}
    </div>
  )
}

/**
 * One example, one card — `Variant` from the shared helpers with the `.m-app` scope as its body.
 *
 * The mobile section originally stacked every example of a component inside a single card, which
 * read as one specimen sheet rather than a set of cases. The rest of the library had already
 * settled the question: a labelled `Variant` card per example, so each one can say what it is
 * showing. This is that, scoped.
 *
 * The inner radius goes to 0 because the card already draws the corners — two radii nested gives
 * the visible double-rounding that `full` exists to avoid.
 */
function MVariant({ label, pad = 20, background = '#fff', children }) {
  return (
    <Variant label={label} full>
      <MScope pad={pad} background={background} style={{ borderRadius: 0 }}>
        {children}
      </MScope>
    </Variant>
  )
}

const TYPE_ROLES = [
  'title',
  'detailPageTitle',
  'sectionTitle',
  'headerBarTitleStyle',
  'itemTitle',
  'titleRegular',
  'titleSmall',
  'bodyRegular',
  'description',
  'bodySmall',
  'bodySmaller',
  'subHeading',
]

const DEMO_TABS = [
  { id: 'home', label: 'Home', icon: <Dot /> },
  { id: 'log', label: 'Log', icon: <Dot /> },
  { id: 'discover', label: 'Discover', dot: true, icon: <Dot /> },
  { id: 'community', label: 'Community', badge: 3, icon: <Dot /> },
]

const DEMO_TOP_TABS = [
  { id: 'readingLog', label: 'Reading Log' },
  { id: 'allTitles', label: 'All Titles' },
  { id: 'badges', label: 'Badges' },
  { id: 'streaks', label: 'Streaks' },
  { id: 'statistics', label: 'Highlights' },
]

const DEMO_PLUS_ACTIONS = ['Reading', 'Activity', 'Review', 'Import'].map((title) => ({
  id: title.toLowerCase(),
  title,
  icon: <Dot />,
}))

function Dot() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  )
}

function FormFieldDemo() {
  const [values, setValues] = useState({
    first_name: 'Maya',
    grade_level_id: '4',
    birthdate: '2016-04-12',
    send_recommendations: true,
    email: 'not-an-email',
  })
  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }))
  return (
    <>
      <MVariant label="text — TextField's box, with the label notching the border">
        <FormField
          name="first_name"
          label="First Name"
          placeholder="Jessie"
          value={values.first_name}
          onChange={set}
        />
      </MVariant>
      <MVariant label="select — in the same box, with the app's own dropdown_arrow">
        <FormField
          name="grade_level_id"
          label="Grade"
          type="select"
          placeholder="Select One"
          value={values.grade_level_id}
          onChange={set}
          options={[
            { value: '4', name: '4th Grade' },
            { value: '5', name: '5th Grade' },
          ]}
        />
      </MVariant>
      <MVariant label="date-picker — a button, not an input; unset it reads YYYY-MM-DD">
        <FormField
          name="birthdate"
          label="Birthdate"
          type="date-picker"
          value={values.birthdate}
          onChange={set}
        />
      </MVariant>
      <MVariant label="bool — a ruled row and the platform switch, not a box">
        <FormField
          name="send_recommendations"
          label="Send a book recommendation each week"
          type="bool"
          value={values.send_recommendations}
          onChange={set}
        />
      </MVariant>
      <MVariant label="error — the stroke holds the error colour whether or not it is focused">
        <FormField
          name="email"
          label="Email"
          type="email"
          placeholder="reader@email.com"
          value={values.email}
          onChange={set}
          error="Email is not a valid address."
        />
      </MVariant>
    </>
  )
}

function TextFieldDemo() {
  const [title, setTitle] = useState('The Wild Robot')
  const [author, setAuthor] = useState('')
  return (
    <>
      <MVariant label="raised — a value keeps the label up">
        <div style={{ padding: '12px 0' }}>
          <TextField label="Title" value={title} onChange={setTitle} />
        </div>
      </MVariant>
      <MVariant label="at rest — the label sits in the box until it is needed">
        <div style={{ padding: '12px 0' }}>
          <TextField label="Author (Optional)" value={author} onChange={setAuthor} />
        </div>
      </MVariant>
    </>
  )
}

function ToggleSwitchDemo() {
  const [on, setOn] = useState(true)
  return (
    <>
      <MVariant label="the three sizes">
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <ToggleSwitch
            size="small"
            isOn={on}
            announcementLabel="Small"
            onToggle={() => setOn(!on)}
          />
          <ToggleSwitch isOn={on} announcementLabel="Track progress" onToggle={() => setOn(!on)} />
          <ToggleSwitch
            size="large"
            isOn={on}
            announcementLabel="Large"
            onToggle={() => setOn(!on)}
          />
        </div>
      </MVariant>
      <MVariant label="off">
        <ToggleSwitch isOn={false} announcementLabel="Track progress" onToggle={() => {}} />
      </MVariant>
    </>
  )
}

export const mobileSections = [
  // ── Foundations ────────────────────────────────────────────────────────
  {
    group: 'm-foundations',
    id: 'm-palette',
    name: 'Palette',
    desc: (
      <>
        Generated from the app’s <code>brandColors.js</code>. Each hue is a{' '}
        <code>Dark / base / Light</code> ramp, and the standard pairing is <code>Dark</code> ink on
        a <code>Light</code> ground. Run <code>pnpm mobile:tokens</code> to re-sync.
      </>
    ),
    usage: `/* tokens are CSS custom properties, scoped to .m-app */
background: var(--m-green-light);
color: var(--m-green-dark);`,
    render: () => (
      <MScope background="#fff">
        <div style={{ display: 'grid', gap: 10 }}>
          {['blue', 'denim', 'green', 'orange', 'yellow', 'red', 'purple', 'pink'].map((hue) => (
            <div key={hue} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 62, fontSize: 12, fontWeight: 700 }}>{hue}</span>
              {['-dark', '', '-light'].map((suffix) => (
                <span
                  key={suffix}
                  title={`--m-${hue}${suffix}`}
                  style={{
                    flex: 1,
                    height: 30,
                    borderRadius: 8,
                    background: `var(--m-${hue}${suffix})`,
                  }}
                />
              ))}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 3, marginTop: 6 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                title={`--m-grey-dark-${n}`}
                style={{
                  flex: 1,
                  height: 26,
                  borderRadius: 6,
                  background: `var(--m-grey-dark-${n})`,
                }}
              />
            ))}
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <span
                key={`l${n}`}
                title={`--m-grey-light-${n}`}
                style={{
                  flex: 1,
                  height: 26,
                  borderRadius: 6,
                  background: `var(--m-grey-light-${n})`,
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)',
                }}
              />
            ))}
          </div>
        </div>
      </MScope>
    ),
  },
  {
    group: 'm-foundations',
    id: 'm-type',
    name: 'Type ladder',
    desc: (
      <>
        Generated from <code>fontStyles.tsx</code>, with every <code>Platform.OS</code> fork
        resolved to iOS. The app ships <strong>no custom font</strong> — this is the platform system
        face, not Museo Sans Rounded.
      </>
    ),
    usage: `import { Text } from '@mobile/components'

<Text role="sectionTitle" as="h2">Your challenges</Text>`,
    render: () => (
      <MScope background="#fff">
        <div style={{ display: 'grid', gap: 12 }}>
          {TYPE_ROLES.map((role) => (
            <div key={role}>
              <div style={{ fontSize: 10.5, color: '#8a8a8a', fontWeight: 700, marginBottom: 2 }}>
                {role}
              </div>
              <Text role={role} as="div">
                Reading is a superpower
              </Text>
            </div>
          ))}
        </div>
      </MScope>
    ),
  },
  {
    group: 'm-foundations',
    id: 'm-accent',
    name: 'Tenant accent',
    desc: (
      <>
        The accent is <strong>runtime</strong>, not static: it arrives per-microsite as{' '}
        <code>primaryColor</code>. Pressed and active states are derived with the same HSL
        operations the app uses — <code>color-mix()</code> would give different answers.
      </>
    ),
    usage: `import { accentVars } from '@mobile/accent'

<div className="m-app" style={accentVars('#19bfd5')}>…</div>`,
    render: () => (
      <MScope background="#fff">
        <div style={{ display: 'grid', gap: 12 }}>
          {ACCENT_PRESETS.slice(0, 4).map((p) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 96, fontSize: 12, fontWeight: 700 }}>{p.name}</span>
              {/* Each row must carry its OWN accent — without accentVars every row inherits the
                  scope's default and the whole point of the showcase is lost. */}
              <div
                className="m-app"
                style={{ display: 'flex', gap: 6, flex: 1, ...accentVars(p.value) }}
              >
                <PressableButton size="small" buttonText="Primary" />
                <PressableButton size="small" type="activeTab" buttonText="Active tab" />
              </div>
            </div>
          ))}
        </div>
      </MScope>
    ),
  },

  // ── Controls ───────────────────────────────────────────────────────────
  {
    group: 'm-controls',
    id: 'm-pressable-button',
    name: 'PressableButton',
    desc: (
      <>
        <code>src/components/shared/PressableButton.tsx</code>. Three sizes (56 / 40 / 36) and five
        types. The app also has two older button components; this is the one to design against.
      </>
    ),
    usage: `import { PressableButton } from '@mobile/components'

<PressableButton size="large" type="primary" buttonText="Log reading" fullWidth />`,
    render: () => (
      <>
        <MVariant label="primary and grey, in the three sizes">
          <div style={{ display: 'grid', gap: 10 }}>
            {['large', 'medium', 'small'].map((size) => (
              <div key={size} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <PressableButton size={size} buttonText={`Primary ${size}`} />
                <PressableButton size={size} type="grey" buttonText="Grey" />
              </div>
            ))}
          </div>
        </MVariant>
        <MVariant label="the tab and text types — accent-derived, not palette colours">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <PressableButton size="medium" type="activeTab" buttonText="Active tab" />
            <PressableButton size="medium" type="inactiveTab" buttonText="Inactive" />
            <PressableButton type="text" buttonText="Text link" />
          </div>
        </MVariant>
        <MVariant label="disabled + fullWidth">
          <PressableButton buttonText="Disabled" disabled fullWidth />
        </MVariant>
      </>
    ),
  },
  {
    group: 'm-controls',
    id: 'm-text-pill',
    name: 'TextPill',
    desc: (
      <>
        <code>src/components/shared/TextPill.tsx</code>. Fixed tone pairs — a <code>Dark</code>{' '}
        foreground on its <code>Light</code> ground — in three sizes.
      </>
    ),
    usage: `import { TextPill } from '@mobile/components'

<TextPill tone="green" size="small" text="62% complete" />`,
    render: () => (
      <>
        {['small', 'medium', 'large'].map((size) => (
          <MVariant key={size} label={`size="${size}" — every tone`}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['green', 'red', 'orange', 'grey'].map((tone) => (
                <TextPill key={tone} size={size} tone={tone} text={`${tone} ${size}`} />
              ))}
            </div>
          </MVariant>
        ))}
      </>
    ),
  },

  // ── Content ────────────────────────────────────────────────────────────
  {
    group: 'm-content',
    id: 'm-section-header',
    name: 'SectionHeader',
    desc: (
      <>
        <code>components/home/shared/Header</code> — the title + “View All” row above every Home
        section. Its gutter is <strong>21 left / 18 right</strong>, not the page’s 20/20; that
        asymmetry is in the source and shows against a full-bleed carousel, so it is kept.
      </>
    ),
    usage: `import { SectionHeader } from '@mobile/components'

<SectionHeader title="Current Challenges" onViewAll={goToChallenges} />`,
    render: () => (
      <>
        <MVariant label="with a View All" pad={0} background="var(--m-white)">
          <div style={{ padding: '16px 0', display: 'grid', gap: 20 }}>
            <SectionHeader title="Current Challenges" onViewAll={() => {}} />
            <SectionHeader title="My Badges" onViewAll={() => {}} />
          </div>
        </MVariant>
        <MVariant
          label="title only — no onViewAll, no affordance"
          pad={0}
          background="var(--m-white)"
        >
          <div style={{ padding: '16px 0' }}>
            <SectionHeader title="Recent Titles" />
          </div>
        </MVariant>
      </>
    ),
  },
  {
    group: 'm-content',
    id: 'm-daily-goal-banner',
    name: 'DailyGoalBanner',
    desc: (
      <>
        <code>components/shared/DailyGoalBanner.tsx</code>. The headline and subheader are fixed
        strings that switch at <strong>50%</strong> and <strong>100%</strong>. The bar is a 32pt
        track with a notched connector and a star bubble — and its fill has a 32pt <em>minimum</em>,
        so the rounded cap stays a full circle even at zero.
        <br />
        <br />
        <code>variant</code> is a DESIGN AXIS, not a port — the app ships only the card.{' '}
        <code>flush</code> drops the card chrome for a page that is already white;{' '}
        <code>compact</code> puts it on one row, 109pt down to about 62, which matters where it sits
        above a calendar.
        <br />
        <br />
        The star <strong>stays on the bar</strong>, with its notched connector. Leading with it was
        tried and is worse: as the end cap it is what the fill travels <em>toward</em>, which is
        most of what makes the bar read as a goal rather than a gauge — and the notch is what makes
        the two one object instead of a disc sitting after a bar. That fixes the track at 32pt,
        since the cap is a 32pt disc, which is why a one-row variant lands near 62 rather than the
        40 a thin bar would allow.
        <br />
        <br />
        NO label on the one-row variant, after trying three. A stacked <code>Daily Goal</code>
        caption with a <code>7 min to go</code> counter cost 28pt of height; brought inline at the
        head of the row it cost width instead, squeezing the track to 113pt of a 353pt row — about a
        third, where the bar is the only part that has to be read at a glance. The tab says Reading
        Log, <code>/ 20 Min</code> says it is a target, and the star says what happens when you
        reach it. The unit abbreviates there: it has to be present, but the full word takes the
        width the bar needs.
        <br />
        <br />
        The star and its connector stay GREY until the goal is met — a yellowLight ground was tried
        and reverted, because a star that is already coloured has spent the moment it exists for.
      </>
    ),
    usage: `import { DailyGoalBanner } from '@mobile/components'

<DailyGoalBanner goalMinutes={20} totalMinutes={13} />`,
    render: () => (
      <>
        {[
          { total: 3, label: 'card · under 50% — “Log Some Reading!”, and the 32pt minimum fill' },
          { total: 13, label: 'card · past 50% — “Keep going!”' },
          { total: 20, label: 'card · at 100% — “Well done!”' },
        ].map((c) => (
          <MVariant key={c.total} label={c.label} pad={0}>
            <div style={{ padding: '16px 0' }}>
              <DailyGoalBanner goalMinutes={20} totalMinutes={c.total} />
            </div>
          </MVariant>
        ))}
        <MVariant label='variant="flush" — the card chrome removed, 109pt' pad={0}>
          <DailyGoalBanner variant="flush" goalMinutes={20} totalMinutes={13} />
        </MVariant>
        <MVariant label='variant="compact" — one row, ~62pt, star still capping the bar' pad={0}>
          <DailyGoalBanner variant="compact" goalMinutes={20} totalMinutes={13} />
        </MVariant>
        <MVariant label='variant="compact" at 100% — the star and its connector fill' pad={0}>
          <DailyGoalBanner variant="compact" goalMinutes={20} totalMinutes={20} />
        </MVariant>
      </>
    ),
  },
  {
    group: 'm-content',
    id: 'm-card',
    name: 'Card',
    desc: (
      <>
        The app’s two card recipes, which do not blend: <strong>shadow</strong> (white, radius 16,
        padding 24) and <strong>border</strong> (a 2px grey outline, no shadow).{' '}
        <code>ChallengeOverviewCard</code> nests one inside the other.
      </>
    ),
    usage: `import { Card } from '@mobile/components'

<Card variant="shadow">…</Card>
<Card variant="border">…</Card>`,
    render: () => (
      <>
        <MVariant label='variant="shadow" — white, radius 16, padding 24' pad={0}>
          <div style={{ padding: '20px 0' }}>
            <Card variant="shadow">
              <Text role="titleSmall" as="p">
                Shadow card
              </Text>
              <Text role="bodySmall" as="p">
                DailyGoalBanner, MyStats.
              </Text>
            </Card>
          </div>
        </MVariant>
        <MVariant label='variant="border" — a 2px grey outline, no shadow' pad={0}>
          <div style={{ padding: '20px 0' }}>
            <Card variant="border">
              <Text role="titleSmall" as="p">
                Border card
              </Text>
              <Text role="bodySmall" as="p">
                WrapUpCard, ChallengeCard.
              </Text>
            </Card>
          </div>
        </MVariant>
      </>
    ),
  },
  {
    group: 'm-content',
    id: 'm-text-field',
    name: 'TextField',
    desc: (
      <>
        <code>src/components/FloatingTextField.tsx</code> &mdash; the app&rsquo;s one text input,
        and the reason every form in it looks the same. The label starts inside the box at
        placeholder weight and rises to sit <em>on</em> the border once there is focus or a value:
        16/500 grey at rest, 12/bold black raised, with a white ground and 4pt of side padding so it{' '}
        <strong>notches</strong> the stroke rather than crossing it. That notch is the whole idiom
        &mdash; a label floating in clear air over a 2pt border reads as a mistake.
        <br />
        <br />
        56 tall (48 <code>small</code>) at radius 10, the stroke `gainsboroWhite` at rest and the
        tenant&rsquo;s colour while focused.
      </>
    ),
    usage: `import { TextField } from '@mobile/components'

<TextField label="Title" value={title} onChange={setTitle} />
<TextField label="Pages" value={pages} onChange={setPages} inputMode="numeric" small />`,
    render: () => <TextFieldDemo />,
  },
  {
    group: 'm-content',
    id: 'm-form-field',
    name: 'FormField',
    desc: (
      <>
        A field in a server-driven form &mdash;{' '}
        <code>components/listItems/MaterialFormFieldItem.tsx</code>. The behaviour is the
        app&rsquo;s and is the reason it exists: registration and settings forms are{' '}
        <strong>not authored</strong>. The server sends <code>registration_fields.sections</code>{' '}
        and the screen renders whatever arrives, so this is a switch over <code>field_type</code>,
        not a layout.
        <br />
        <br />
        The chrome is deliberately <strong>not</strong> the app&rsquo;s. MaterialFormFieldItem is
        the oldest input in the codebase &mdash; a label above a bare line of text, over a 3pt
        underline set to the literal string <code>white</code> that never changes, because both
        editors pass <code>renderActiveState={'{false}'}</code>. It reserves 3pt, draws nothing, and
        leaves a hairline to do the separating. Beside the book editor&rsquo;s boxes it reads as a
        different product, so the box here is <a href="#/m-content/m-text-field">TextField</a>
        &rsquo;s &mdash; a select and a date sit in that same box rather than redrawing one.
        <br />
        <br />
        <code>bool</code> keeps its own shape: a ruled row with the platform UISwitch, which is what
        the book editor&rsquo;s Track Progress is one screen over.
      </>
    ),
    usage: `import { FormField } from '@mobile/components'

<FormField name="first_name" label="First Name" placeholder="Jessie" value={value} onChange={set} />
<FormField name="grade_level_id" label="Grade" type="select" options={options} value={value} onChange={set} />`,
    render: () => <FormFieldDemo />,
  },
  {
    group: 'm-content',
    id: 'm-toggle-switch',
    name: 'ToggleSwitch',
    desc: (
      <>
        <code>readingLogging/components/CustomToggleSwitch.tsx</code>. Three sizes; medium is what
        every caller uses &mdash; a 60pt track at radius 16 carrying a 24pt knob that travels 32. On
        is <code>jadeGreen</code>, off is <code>lightGray</code>: the app&rsquo;s own green rather
        than the tenant accent, so a switch reads the same on every microsite.
        <br />
        <br />
        <code>announcementLabel</code> is the app&rsquo;s, and it appends the state &mdash; a switch
        that only says its name tells a screen reader nothing about which way it is set.
      </>
    ),
    usage: `import { ToggleSwitch } from '@mobile/components'

<ToggleSwitch isOn={on} announcementLabel="Track progress" onToggle={() => setOn(!on)} />`,
    render: () => <ToggleSwitchDemo />,
  },
  {
    group: 'm-content',
    id: 'm-profile-bar',
    name: 'ProfileBar',
    desc: (
      <>
        <code>src/components/ProfileBar.tsx</code> &mdash; everything on the right of a root header,
        and not just an avatar. The app puts up to four controls here and gates each one: a{' '}
        <strong>switch-account</strong> icon for a reader linked to a second site, a{' '}
        <strong>search</strong> icon the Log tab alone passes <code>logSearch</code> for,{' '}
        <strong>settings</strong> on every root, and the <strong>avatar</strong>, which opens the
        Profiles modal &mdash; a reader switcher, not a link to a profile page.
        <br />
        <br />A control renders only when it is handed a handler. The app&rsquo;s gates are
        conditions on state we don&rsquo;t model; here the condition is whether there is anywhere
        for the control to go, which keeps a dead icon out of a header whose whole job is to be
        pressed.
      </>
    ),
    usage: `import { ProfileBar } from '@mobile/components'

<ProfileBar name="Maya Chen" onProfile={open} />
<ProfileBar name="Maya Chen" onSearch={search} onSettings={settings} onProfile={open} />`,
    render: () => (
      <>
        <MVariant label="a root header — avatar only, which is all this prototype can reach">
          <div
            style={{ background: '#fff', padding: 12, display: 'flex', justifyContent: 'flex-end' }}
          >
            <ProfileBar name="Maya Chen" onProfile={() => {}} />
          </div>
        </MVariant>
        <MVariant label="the Log tab, with everywhere to go">
          <div
            style={{ background: '#fff', padding: 12, display: 'flex', justifyContent: 'flex-end' }}
          >
            <ProfileBar
              name="Maya Chen"
              onSwitchAccount={() => {}}
              onSearch={() => {}}
              onSettings={() => {}}
              onProfile={() => {}}
            />
          </div>
        </MVariant>
      </>
    ),
  },
  {
    group: 'm-content',
    id: 'm-progress-bar',
    name: 'ProgressBar',
    desc: (
      <>
        <code>components/shared/ProgressBar</code> &mdash; the community goal&rsquo;s bar, and not
        the same thing as the daily goal&rsquo;s.{' '}
        <a href="#/m-app-chrome/m-daily-goal-banner">DailyGoalBanner</a> caps its track with a 32pt
        star that fills when the goal is met; this one caps it with a 30pt disc of the tenant
        colour, ringed in 5pt of white around a 10pt white dot. Two bars, two statements: one is a
        reward, this one is a position.
        <br />
        <br />
        The knob pulls back 15 &mdash; half its width &mdash; so it <strong>centres</strong> on the
        bar&rsquo;s end rather than starting there, which is what keeps it on the line at 0% and at
        100%. The fill also carries a flat band of its own colour lightened to 91%, 4 down with no
        blur.
      </>
    ),
    usage: `import { ProgressBar } from '@mobile/components'

<ProgressBar progress={60} />`,
    render: () => (
      <>
        <MVariant label="the knob centres on the end, at either extreme">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: 300 }}>
            <ProgressBar progress={0} />
            <ProgressBar progress={60} />
            <ProgressBar progress={100} />
          </div>
        </MVariant>
      </>
    ),
  },
  {
    group: 'm-content',
    id: 'm-profile-row',
    name: 'ProfileRow',
    desc: (
      <>
        <code>src/components/ProfileRow.tsx</code>. The initials fallback is not a grey circle — the
        app paints it <code>redLight</code> with <code>orangeDark</code> text. The link badge marks
        a tandem reader.
        <br />
        <br />
        <code>layout</code> is the source&rsquo;s <code>showProfileName</code> fork, which is really
        two components under one name. <code>chip</code> stacks a clamped name under the avatar —
        the grid form. <code>list</code> is <code>barContent</code>: a 45pt avatar with 15 to its
        right and the name beside it at 16, taking the rest of the row. Every reader LIST in the app
        is the second one, so <code>size</code> does not apply to it.
      </>
    ),
    usage: `import { ProfileRow } from '@mobile/components'

<ProfileRow name="Theo Chen" size="medium" showName linked />
<ProfileRow name="Theo Chen" layout="list" showName />`,
    render: () => (
      <>
        <MVariant label="the three sizes">
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <ProfileRow name="Maya Chen" size="small" showName />
            <ProfileRow name="Theo Chen" size="medium" showName />
            <ProfileRow name="Ada Chen" size="large" showName />
          </div>
        </MVariant>
        <MVariant label="linked — the badge marks a tandem reader">
          <ProfileRow name="Theo Chen" size="medium" showName linked />
        </MVariant>
        <MVariant label="layout=list — the 70pt row every reader list is built from">
          <div style={{ width: 320, background: 'var(--m-white)' }}>
            <div style={{ display: 'flex', alignItems: 'center', height: 70, paddingLeft: 20 }}>
              <ProfileRow layout="list" name="Maya Chen" showName />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', height: 70, paddingLeft: 20 }}>
              <ProfileRow layout="list" name="Leo Chen" showName />
            </div>
          </div>
        </MVariant>
      </>
    ),
  },
  {
    group: 'm-content',
    id: 'm-empty-state',
    name: 'EmptyState',
    desc: (
      <>
        <code>src/components/home/EmptyState.tsx</code>. The app carries a second empty-state
        component plus eight feature-local copies; this mirrors the newer shape.
      </>
    ),
    usage: `import { EmptyState } from '@mobile/components'

<EmptyState title="No badges yet" description="…" buttonTitle="Find a challenge" />`,
    render: () => (
      <MScope background="#fff">
        <EmptyState
          title="No badges yet"
          description="Join a challenge and start logging to earn your first badge."
          buttonTitle="Find a challenge"
          onPressButton={() => {}}
        />
      </MScope>
    ),
  },

  {
    group: 'm-content',
    id: 'm-stat-card',
    name: 'StatCard',
    desc: (
      <>
        One statistic, carded. <code>Statistics.tsx</code> draws these as bare rows —{' '}
        <code>marginLeft: 32</code>, <code>marginTop: 48</code>, a 24pt icon beside a 12pt uppercase
        label, then a 41pt number — so six stats run about 500pt down the page with nothing to say
        where one ends and the next begins.
        <br />
        <br />
        The treatment comes from the WEB prototype&rsquo;s <code>StatCard</code>: the tile takes a
        light tint of the stat&rsquo;s own colour and the icon sits in a white circle on top of it
        at full strength. You learn the colour before you read the label, which is what makes a set
        of them scannable.
        <br />
        <br />
        <code>value2</code>/<code>unit2</code> are the two-part figures — Reading Time is “4 hours
        35 minutes”. Each value and its unit is one unbreakable pair, so a wrap falls BETWEEN them
        rather than stranding a unit on its own line.
      </>
    ),
    usage: `import { StatCard } from '@mobile/components'

<StatCard icon="pages_read" tint="var(--m-yellow-light)"
          title="Pages Read" value={212} unit="pages" />`,
    render: () => (
      <>
        <MVariant label="one figure" pad={0}>
          <StatCard
            icon="pages_read"
            tint="var(--m-yellow-light)"
            title="Pages Read"
            value={212}
            unit="pages"
          />
        </MVariant>
        <MVariant label="two parts — the pair never breaks across a wrap" pad={0}>
          <StatCard
            icon="reading_time"
            tint="var(--m-blue-light)"
            title="Reading Time"
            value={4}
            unit="hours"
            value2={35}
            unit2="minutes"
          />
        </MVariant>
      </>
    ),
  },
  {
    group: 'm-content',
    id: 'm-carousel',
    name: 'Carousel',
    desc: (
      <>
        One swipeable, LOOPING carousel for Streaks and Reading Motivation. The app has two, on
        different libraries — Streaks is <code>react-native-snap-carousel</code> at{' '}
        <code>windowWidth - 64</code> with the library&rsquo;s default{' '}
        <code>inactiveSlideScale: 0.9</code> / <code>inactiveSlideOpacity: 0.7</code>, and Reading
        Motivation is <code>react-native-reanimated-carousel</code> at full width with no neighbour
        treatment at all.
        <br />
        <br />
        <strong>The peek is not a gap.</strong> A 0.9-scaled card leaves ~16pt either side of
        itself, so neighbours read as set BACK rather than butted against the active one. Remove the
        scale and the cards touch.
        <br />
        <br />
        It LOOPS: the strip renders three times and the carousel starts in the middle copy, so there
        is always a real slide either side and no clone is ever at an edge. Once a transition lands
        outside the middle copy it snaps back by one copy&rsquo;s width with the transition off,
        which is invisible because the slide under the viewport is identical.
      </>
    ),
    usage: `import { Carousel } from '@mobile/components'

<Carousel items={cards} keyFor={(c) => c.key} label="Your streaks"
          renderItem={(c) => <StreakCard {...c} />} />`,
    render: () => (
      <MVariant
        label="drag it, or use the dots — the last card is to the left of the first"
        pad={0}
      >
        <div style={{ padding: '16px 0' }}>
          <Carousel
            items={['Minutes Read', 'Pages Read', 'Sessions', 'Days']}
            keyFor={(c) => c}
            label="Demo carousel"
            renderItem={(c) => (
              <StatCard icon="pages_read" tint="var(--m-green-light)" title={c} value={42} />
            )}
          />
        </div>
      </MVariant>
    ),
  },

  // ── Feedback & states ──────────────────────────────────────────────────
  {
    group: 'm-feedback',
    id: 'm-empty-state-view',
    name: 'EmptyStateView',
    desc: (
      <>
        <code>components/EmptyStateView.jsx</code> — the OLDER of the app&rsquo;s two empty states,
        and the one nearly every list actually uses: All Titles (twice), Book Talks (twice), Badges,
        Reviews, Book Lists, Events, Discover.
        <br />
        <br />
        NOT the same component as <code>EmptyState</code>, which is newer, takes a button and lives
        under <code>components/home/</code>. Both ship, and which one a screen uses is a fact about
        that screen rather than a choice — <strong>the tell is the button.</strong> A list that
        cannot be filled from where you are standing gets this one, with no call to action.
        <br />
        <br />
        Three stacked strings, all <code>blackFont</code> — which is <code>#424242</code>, not
        black. The line heights are set per string (26 / 24 / default) rather than inherited, so the
        three do not read as one paragraph.
      </>
    ),
    usage: `import { EmptyStateView } from '@mobile/components'

<EmptyStateView source="my_activities_empty_state"
                boldText="No Recent Titles to Show"
                middleText="You haven't logged any reading yet." />`,
    render: () => (
      <MVariant label="artwork, a headline, and a line under it" pad={0}>
        <div style={{ padding: '24px 0' }}>
          <EmptyStateView
            source="my_activities_empty_state"
            boldText="No Recent Titles to Show"
            middleText="You haven’t logged any reading yet."
          />
        </div>
      </MVariant>
    ),
  },
  {
    group: 'm-feedback',
    id: 'm-loading',
    name: 'LoadingIndicator',
    desc: (
      <>
        The app&rsquo;s three loading states, which are NOT interchangeable — every Log tab picks
        one, and which one says what the screen is about to become.
        <br />
        <br />
        <code>LoadingIndicator</code> is iOS&rsquo;s twelve-spoke spinner in <code>dustyGray</code>.
        It covers its area absolutely at <code>zIndex: 2</code>, so on Statistics it sits OVER the
        chart and dims it rather than replacing it. <code>LogLoader</code> is five rows of a 32pt
        circle; <code>CompletedLoader</code> nine 100pt squares in three columns. Both are{' '}
        <code>rn-placeholder</code> with a <code>Fade</code> — 300ms, fading to white, not the
        shimmer sweep most design systems use. A shimmer reads as a different product.
        <br />
        <br />
        Neither skeleton draws text lines: <code>LogLoader</code>&rsquo;s <code>Placeholder</code>{' '}
        children is an EMPTY View, so a loading row is a bare circle with nothing beside it. That
        looks unfinished and is what ships.
      </>
    ),
    usage: `import { LoadingIndicator, LogLoader, CompletedLoader } from '@mobile/components'

{isFetching ? <LogLoader /> : <List />}`,
    render: () => (
      <>
        <MVariant label="LoadingIndicator — the system spinner">
          <div style={{ position: 'relative', height: 80 }}>
            <LoadingIndicator />
          </div>
        </MVariant>
        <MVariant label="LogLoader — five bare circles, no text lines" pad={0}>
          <div style={{ height: 200, overflow: 'hidden' }}>
            <LogLoader />
          </div>
        </MVariant>
        <MVariant label="CompletedLoader — nine squares, three columns" pad={0}>
          <div style={{ height: 240, overflow: 'hidden' }}>
            <CompletedLoader />
          </div>
        </MVariant>
        <MVariant label="ListFooter — the next-page spinner on the five paginating tabs" pad={0}>
          <ListFooter loading />
        </MVariant>
      </>
    ),
  },

  // ── Overlays ───────────────────────────────────────────────────────────
  {
    group: 'm-overlays',
    id: 'm-actions-modal',
    name: 'ActionsModal',
    desc: (
      <>
        <code>components/ActionsModal.jsx</code>. <strong>Every “…” in the app opens this</strong> —
        it is the one options menu, with eight-plus consumers (<code>TitleOptionsModal</code>,{' '}
        <code>ReviewOptionsModal</code>, the challenge <code>OptionsModal</code>,{' '}
        <code>AdditionalLoggingOptionsModal</code>, <code>CoverImageModal</code>,{' '}
        <code>EditReaderModal</code>, <code>RemoveFriendModal</code>, <code>AddFriendsModal</code>,{' '}
        <code>DateRangeModal</code>). A screen that needs a menu supplies options; it never draws a
        sheet of its own.
        <br />
        <br />
        17pt top corners, a 60pt head with a hairline under it, and 56pt rows inset 22 with a 20pt
        icon. Cancel is <em>absolutely placed</em> at <code>left: 20</code> so the title centres on
        the sheet rather than on the space beside it. The bottom padding is{' '}
        <code>Math.max(insets.bottom, 16)</code> — a floor, not an addition, so a device with a home
        indicator pays its inset instead of both.
        <br />
        <br />A row&rsquo;s pressed state is a <code>TouchableHighlight</code> underlay rather than
        a fade: <code>formGrayBackground</code> normally, <code>mistyRose</code> under a destructive
        row, which also takes <code>mediumCarmine</code> text.
      </>
    ),
    usage: `import { ActionsModal } from '@mobile/components'

<ActionsModal
  open={open}
  title="Options"
  onClose={close}
  options={[
    { title: 'Edit Title', source: 'modal_edit_icon', onPress: edit },
    { title: 'Delete Title', source: 'modal_delete_icon', destructive: true, onPress: remove },
  ]}
/>`,
    render: function ActionsModalDemo() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <MVariant label="the sheet — a destructive row takes red text and a red underlay" pad={0}>
            <div style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
              <ActionsModal
                open
                title="Options"
                onClose={() => {}}
                options={[
                  { title: 'Edit Title', source: 'modal_edit_icon', onPress: () => {} },
                  {
                    title: 'Delete Title',
                    source: 'modal_delete_icon',
                    destructive: true,
                    onPress: () => {},
                  },
                ]}
              />
            </div>
          </MVariant>
          <MVariant label="open it — the backdrop and the slide are part of the pattern">
            <PressableButton
              size="medium"
              buttonText="Show options"
              onButtonPress={() => setOpen(true)}
            />
            <div style={{ position: 'relative' }}>
              <ActionsModal
                open={open}
                title="Options"
                onClose={() => setOpen(false)}
                options={[
                  { title: 'Edit Review', source: 'modal_edit_icon', onPress: () => {} },
                  { title: 'Re-Submit Review', source: 'resubmit_icon', onPress: () => {} },
                  {
                    title: 'Delete Review',
                    source: 'modal_delete_icon',
                    destructive: true,
                    onPress: () => {},
                  },
                ]}
              />
            </div>
          </MVariant>
        </>
      )
    },
  },
  {
    group: 'm-overlays',
    id: 'm-alert',
    name: 'Alert',
    desc: (
      <>
        <code>Alert.alert(...)</code> — what every destructive action confirms through. DEVICE
        chrome rather than app chrome, like <code>Keyboard</code>: the 270pt width, the 14pt radius,
        the hairline splits and the 17/13 type pair are UIAlertController&rsquo;s, so it is drawn to
        the platform spec and not to our tokens. A delete flow that looks plausible in a prototype
        but wrong on a phone is worse than no flow at all.
        <br />
        <br />
        Every call in this app passes <code>{'{ cancelable: false }'}</code>, so the scrim takes no
        press — the buttons are the only way out. Two buttons sit side by side; three or more stack.
      </>
    ),
    usage: `import { Alert } from '@mobile/components'

<Alert
  open={open}
  title="Delete Review"
  message="Are you sure you want to delete this Review?"
  onDismiss={close}
  buttons={[
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: remove },
  ]}
/>`,
    render: () => (
      <>
        <MVariant label="two buttons — side by side, cancel semibold and destructive red" pad={0}>
          <div style={{ position: 'relative', height: 220 }}>
            <Alert
              open
              title="Delete Review"
              message="Are you sure you want to delete this Review?"
              onDismiss={() => {}}
              buttons={[
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive' },
              ]}
            />
          </div>
        </MVariant>
        <MVariant label="a long message — the title still reads at a glance" pad={0}>
          <div style={{ position: 'relative', height: 260 }}>
            <Alert
              open
              title="Delete Title"
              message="Are you sure you would like to delete The Wild Robot? This will delete all 7 session(s) you have logged for The Wild Robot and cannot be undone."
              onDismiss={() => {}}
              buttons={[
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive' },
              ]}
            />
          </div>
        </MVariant>
      </>
    ),
  },

  {
    group: 'm-overlays',
    id: 'm-select-sheet',
    name: 'SelectSheet',
    desc: (
      <>
        <code>components/shared/selectSheet/SelectSheet.tsx</code> — the app&rsquo;s SECOND bottom
        sheet, and not a variant of the first.
        <br />
        <br />
        <code>ActionsModal</code> is a MENU: react-native-modal, a titled 60pt head with Cancel,
        icon rows, dismissed by Cancel or the backdrop. This is a PICKER:{' '}
        <code>@gorhom/bottom-sheet</code>, snap points at 25% and 50%,{' '}
        <code>enablePanDownToClose</code>, a drag handle instead of a head, and plain text rows with
        no icons. Worth keeping apart — a picker that grows a Cancel button starts to read like a
        menu, and a menu you can drag starts to read like a picker.
        <br />
        <br />
        Rows are 14pt top and bottom with a hairline under every one, the last included. The sheet
        is sized by the SCREEN, not by how many items there are: a reader with two surveys gets the
        same sheet as one with nine.
      </>
    ),
    usage: `import { SelectSheet } from '@mobile/components'

<SelectSheet open={open} items={surveys} selectedId={id}
             onSelect={setId} onClose={close} />`,
    render: function SelectSheetDemo() {
      const [open, setOpen] = useState(false)
      const [id, setId] = useState('all')
      return (
        <MVariant label="open it — drag-to-close, and the current value is marked">
          <PressableButton
            size="medium"
            buttonText="Choose a filter"
            onButtonPress={() => setOpen(true)}
          />
          <div style={{ position: 'relative', minHeight: open ? 300 : 0 }}>
            <SelectSheet
              open={open}
              items={[
                { id: 'all', label: 'All Reviews' },
                { id: 'approved', label: 'Approved' },
                { id: 'pending', label: 'Pending' },
                { id: 'rejected', label: 'Rejected' },
              ]}
              selectedId={id}
              onSelect={setId}
              onClose={() => setOpen(false)}
            />
          </div>
        </MVariant>
      )
    },
  },
  {
    group: 'm-controls',
    id: 'm-filter-bar',
    name: 'FilterBar',
    desc: (
      <>
        <code>ReadingMotivationFilter.tsx</code> — a full-bleed bar naming the current selection,
        which opens a <code>SelectSheet</code> to change it.
        <br />
        <br />
        Generalised out of Reading Motivation because{' '}
        <strong>six Log tabs want the same thing</strong>: one value chosen from a short list — the
        survey, a review status, a badge type, All Titles/Completed, In Progress/Completed,
        Statistics/Highlights. A <code>ToggleTabs</code>
        was tried and four options do not fit it: the pill is built for two, and at four each label
        gets about 80pt.
        <br />
        <br />
        Two divergences: <code>justify-content: space-between</code> so the chevron goes to the far
        edge (the source leaves ~200pt of dead bar beside a left-huddled label), and{' '}
        <code>down_chevron</code> in place of <code>filterArrow</code> — that asset is a solid
        triangle from <code>challengesIcons</code>, where it means FILTER, and this picks a value.
      </>
    ),
    usage: `import { FilterBar } from '@mobile/components'

<FilterBar label="September 2026 Index" onPress={openPicker} />`,
    render: () => (
      <MVariant label="the current value, and a chevron at the far edge" pad={0}>
        <FilterBar label="September 2026 Index" onPress={() => {}} />
      </MVariant>
    ),
  },
  {
    group: 'm-chrome',
    id: 'm-month-header',
    name: 'MonthHeader',
    desc: (
      <>
        The month row with an arrow either side — Reading Log&rsquo;s and the Streaks
        calendar&rsquo;s, which the app builds separately and sizes differently:{' '}
        <code>ReadingLogHeaderStyles</code> pads 32 with a 22pt month,{' '}
        <code>StreaksCalendarsStyles</code> 15/10 with a 16pt one.
        <br />
        <br />
        One size, the Streaks one. The two sit a tab apart doing the same job, and 22pt over 32pt of
        padding spends 88pt of an 852pt screen on the word “September” — above the list you came to
        read. Nothing about the Reading Log earns the larger of the two, so it took the smaller.
        <br />
        <br />
        Both arrows are <code>shared/ArrowButton</code>: a 24pt{' '}
        <code>swipe_&#123;dir&#125;_arrow</code>, greyDark2, and greyLight1 when disabled — a TINT
        swap, never an opacity change. Pressed drops to 0.5. <code>disableNext</code> is the shared
        rule (you cannot page into the future); <code>disablePrev</code> is the calendar&rsquo;s
        own, bounded by the earliest month with data.
      </>
    ),
    usage: `import { MonthHeader } from '@mobile/components'

<MonthHeader month="September 2026" onPrev={back} onNext={fwd}
             disableNext={isCurrentMonth} />`,
    render: () => (
      <>
        <MVariant label="both arrows live" pad={0}>
          <MonthHeader month="August 2026" onPrev={() => {}} onNext={() => {}} />
        </MVariant>
        <MVariant label="on the current month — next is tinted out, not faded" pad={0}>
          <MonthHeader month="September 2026" onPrev={() => {}} onNext={() => {}} disableNext />
        </MVariant>
      </>
    ),
  },

  // ── Chrome ─────────────────────────────────────────────────────────────
  {
    group: 'm-chrome',
    id: 'm-sheet-header',
    name: 'SheetHeader',
    desc: (
      <>
        The bar at the top of every modal sheet — three slots: dismiss, centre, actions. The app
        builds it inline in five places and the numbers agree every time —{' '}
        <code>MODAL_HEADER_HEIGHT 60</code> with <code>MODAL_HEADER_OVERLAP -1</code> — so it is a
        pattern rather than a coincidence. The 1pt overlap is what stops a seam showing where the
        header meets the band below it, which share a colour. The chevron&rsquo;s 15pt inset comes
        from the glyph&rsquo;s own margin inside <code>ImageHeaderButton</code>, not from padding on
        the row.
        <br />
        <br />
        The two end slots are equal-width, so <code>center</code> lands on the true centre whatever
        sits either side of it — a string renders as a title, a node as artwork (Book Talks puts
        Benny&rsquo;s face there). <code>onOptions</code> is the optional <code>&hellip;</code>, and{' '}
        <code>right</code> overrides the whole trailing slot.
        <br />
        <br />
        Two divergences, both surfaced rather than flattened: three sheets use{' '}
        <code>dropdown_arrow</code> and the title panel uses <code>down_chevron</code> — this
        standardises on the majority and <code>glyph</code> puts the difference back. Book Talks had
        its dismiss on the RIGHT as a <code>close_modal</code>, with its action on the left;
        migrating it moved dismiss left and made &ldquo;Finish Later&rdquo; the trailing action.
      </>
    ),
    usage: `import { SheetHeader } from '@mobile/components'

<SheetHeader onClose={close} background="var(--m-accent-wash)" />
<SheetHeader onClose={close} center="Reading Log" onOptions={openMenu} />`,
    render: () => (
      <>
        <MVariant label="dismiss only, over the band it shares a colour with" pad={0}>
          <SheetHeader onClose={() => {}} background="var(--m-accent-wash)" />
          <div style={{ height: 40, background: 'var(--m-accent-wash)' }} />
        </MVariant>
        <MVariant label="center as a title, with the optional …" pad={0}>
          <SheetHeader onClose={() => {}} center="Reading Log" onOptions={() => {}} />
        </MVariant>
        <MVariant label="center as artwork — Book Talks puts Benny’s face here" pad={0}>
          <SheetHeader onClose={() => {}} center={<Img name="happy" size={48} />} />
        </MVariant>
      </>
    ),
  },
  {
    group: 'm-chrome',
    id: 'm-phone-frame',
    name: 'PhoneFrame',
    desc: (
      <>
        The device shell every mobile prototype renders inside. Sizes are logical points — the same
        unit RN styles are written in. It owns the safe-area insets, the status bar, and the scroll
        region, so the <em>frame</em> scrolls rather than the page.
      </>
    ),
    usage: `import { PhoneFrame } from '@mobile/components'

<PhoneFrame device="iphone-16-pro" accent="#19bfd5" header={…} tabBar={…}>
  <YourScreen />
</PhoneFrame>`,
    render: () => (
      <div style={{ transform: 'scale(.62)', transformOrigin: 'top left', height: 540 }}>
        <PhoneFrame
          device="iphone-16-pro"
          header={
            <Header
              variant="root"
              title="Home"
              right={<ProfileRow name="Maya Chen" size="small" />}
            />
          }
          tabBar={<TabBar tabs={DEMO_TABS} active="home" onChange={() => {}} />}
        >
          <div style={{ padding: 20 }}>
            <Text role="bodyRegular" as="p">
              Screen content scrolls here.
            </Text>
          </div>
        </PhoneFrame>
      </div>
    ),
  },
  {
    group: 'm-chrome',
    id: 'm-header',
    name: 'Header',
    desc: (
      <>
        Two shapes: <code>root</code> for the four tab roots (a large left title plus the account
        avatar), and the default centred title with a back affordance. Height is{' '}
        <code>60 + safe-top</code> everywhere.
      </>
    ),
    usage: `import { Header } from '@mobile/components'

<Header variant="root" title="Home" right={<ProfileRow name="Maya" size="small" />} />
<Header title="Badge Detail" onBack={() => {}} />`,
    render: () => (
      <>
        <MVariant
          label='variant="root" — a large left title plus the account avatar'
          pad={0}
          background="transparent"
        >
          <Header
            variant="root"
            title="Home"
            right={<ProfileRow name="Maya Chen" size="small" />}
          />
        </MVariant>
        <MVariant
          label="the default — a centred title with a back affordance"
          pad={0}
          background="transparent"
        >
          <Header title="Badge Detail" onBack={() => {}} />
        </MVariant>
      </>
    ),
  },
  {
    group: 'm-chrome',
    id: 'm-keyboard',
    name: 'Keyboard',
    desc: (
      <>
        The iOS software keyboard, opened by PhoneFrame whenever a field inside it takes focus. It
        is device chrome rather than app chrome, and it matters because it takes roughly a third of
        the screen — a layout that only works with it down does not work. In the app this is
        <code> KeyboardStickyView</code>, which rides the input above it.
      </>
    ),
    usage: `// automatic — PhoneFrame raises it on focus and shrinks the content
<PhoneFrame keyboard>...</PhoneFrame>

// opt out for a screen that should never show it
<PhoneFrame keyboard={false}>...</PhoneFrame>`,
    render: () => (
      <MScope pad={0} background="transparent">
        <div style={{ position: 'relative', height: 291 }}>
          <Keyboard />
        </div>
      </MScope>
    ),
  },
  {
    group: 'm-chrome',
    id: 'm-top-tabs',
    name: 'TopTabs',
    desc: (
      <>
        The scrollable 56pt row under Log, Discover and Community. The underline uses{' '}
        <code>ctaColor</code> — a microsite’s <em>second</em> colour, which <code>Tab.tsx</code>{' '}
        reads specifically and which can differ from the <code>primaryColor</code> that fills
        buttons.
      </>
    ),
    usage: `import { TopTabs } from '@mobile/components'

<TopTabs tabs={LOG_TABS} active={tab} onChange={setTab} />`,
    render: function TopTabsDemo() {
      const [tab, setTab] = useState('readingLog')
      return (
        <MScope pad={0} background="transparent">
          <TopTabs tabs={DEMO_TOP_TABS} active={tab} onChange={setTab} />
        </MScope>
      )
    },
  },
  {
    group: 'm-chrome',
    id: 'm-plus-menu',
    name: 'PlusMenu',
    desc: (
      <>
        The FAB and its radial menu. The fan is <strong>computed, not laid out</strong> — the
        angles, the per-count X nudges and the four-item vertical shift all come from{' '}
        <code>PlusMenuUtils.ts</code>, which is why a four-item menu drops its last item below the
        arc instead of widening it. Actions are gated by <code>has_activities</code>,{' '}
        <code>reviewsEnabled</code> and <code>epicIntegration</code>.
      </>
    ),
    usage: `import { PlusMenu } from '@mobile/components'

<PlusMenu open={open} onToggle={setOpen} onSelect={handleSelect}
          actions={PLUS_ACTIONS} screenHeight={852} />`,
    render: function PlusMenuDemo() {
      const [open, setOpen] = useState(false)
      return (
        <div style={{ transform: 'scale(.62)', transformOrigin: 'top left', height: 540 }}>
          <PhoneFrame
            device="iphone-16-pro"
            header={<Header variant="root" title="Home" />}
            tabBar={
              <>
                <TabBar tabs={DEMO_TABS} active="home" onChange={() => {}} />
                <PlusMenu
                  open={open}
                  onToggle={setOpen}
                  actions={DEMO_PLUS_ACTIONS}
                  screenHeight={852}
                />
              </>
            }
          >
            <div style={{ padding: 20 }}>
              <Text role="bodyRegular" as="p">
                Tap the + to fan the menu out.
              </Text>
            </div>
          </PhoneFrame>
        </div>
      )
    },
  },
  {
    group: 'm-chrome',
    id: 'm-tab-bar',
    name: 'TabBar',
    desc: (
      <>
        Five slots — Home, Log, <strong>[+]</strong>, Discover, Community. The middle slot is{' '}
        <em>not a tab</em>: in the app its <code>tabPress</code> calls <code>preventDefault()</code>{' '}
        and opens a radial menu, so it never takes the active state.
      </>
    ),
    usage: `import { TabBar } from '@mobile/components'

<TabBar tabs={TABS} active="home" onChange={setTab} onPlus={openPlusMenu} />`,
    render: () => (
      <MScope pad={0} background="transparent">
        <TabBar tabs={DEMO_TABS} active="home" onChange={() => {}} />
      </MScope>
    ),
  },
]
