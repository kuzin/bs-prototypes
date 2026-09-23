import '@components/ui/tokens.css'
import { useState } from 'react'
import {
  SECTIONS as HEALTH_SECTIONS,
  HealthStat,
  ReadingHealth,
} from '@components/ReadingHealth/ReadingHealth'
import { AlertRow, AlertsBanner } from '@components/AlertsBanner/AlertsBanner'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Toggle } from '@components/Toggle/Toggle'
import { Field, Input, Select } from '@components/Form/Form'
import { RMI_ICONS } from '@components/RmiIcons/RmiIcons'
import { PartnerBrand, PartnerMark, PARTNER_BRANDS } from '@components/PartnerBrand/PartnerBrand'
import {
  ConnectBanner,
  ConnectFlow,
  PartnerSwitcher,
  AutoLoggedCard,
} from '@components/PartnerConnect/PartnerConnect'
import { ReadNow } from '@components/ReadNow/ReadNow'
import { PersonalizeReader } from '@components/PersonalizeReader/PersonalizeReader'
import { AccountSettings } from '@components/AccountSettings/AccountSettings'
import { BannerStack } from '@components/ReaderApp/ReaderApp'
import { DailyReadingTracker } from '@components/DailyReadingTracker/DailyReadingTracker'
import { RMI_FACTORS } from '../../ris/data'
import { CONNECTIONS, CONNECTION_LIST, TAKEN_USERNAMES } from '../../logging-flow/connections'
import { READER as PARTNER_READER } from '../../logging-flow/data'
import { BEEVERSO } from '../../beeverso/connections'
import {
  INTERESTS,
  GENRES,
  BACKGROUND_GROUPS,
  READING_LEVELS,
  PREFERENCE_LANGUAGES,
  BOOK_LIST_GRADES,
  DOORWAYS,
  PREFERENCE_LIMITS,
  READER_PREFERENCES,
  SHARED_ACCESS,
  SHARED_INVITES,
  ACCOUNT,
  LIBRARY_BRANCHES,
} from '../../web-app/data'
import { Knobs, Variant } from './_shared'

// The auto-logged rail card borrows the reader dashboard's card chrome.
import '@components/ReaderApp/ReaderApp.css'

const SAMPLE_HEALTH = {
  motivation: 71,
  integrity: 86,
  habits: 58,
  skills: 42,
  dM: 7,
  dI: 3,
  dH: 5,
  dS: -3,
}

// A week of the class tracker: a medalled top three, a mid-roster reader whose
// week is patchy, and the Saturday/Sunday nulls the live page shows for days
// that haven't happened yet.
const SAMPLE_TRACKER = [
  {
    key: 'marcus',
    rank: 1,
    name: 'Marcus Chen',
    goal: 30,
    average: 98,
    tone: 'blue',
    days: [true, true, true, true, null, null, true],
  },
  {
    key: 'anne',
    rank: 2,
    name: 'Anne Boonchuy',
    goal: 20,
    average: 73,
    tone: 'blue',
    days: [true, true, null, true, '24%', null, null],
  },
  {
    key: 'tyler',
    rank: 3,
    name: 'Tyler Voss',
    goal: 15,
    average: 31,
    tone: 'red',
    days: ['18%', null, null, null, null, null, null],
  },
  {
    key: 'priya',
    rank: 4,
    name: 'Priya Shah',
    goal: 20,
    average: 91,
    tone: 'blue',
    days: [true, true, true, '82%', true, null, null],
  },
]

const SAMPLE_TRACKER_AVG = {
  average: '73%',
  days: ['75%', '50%', '25%', '75%', '24%', null, null],
}

const SAMPLE_ALERTS = [
  {
    id: '1',
    level: 'critical',
    title: 'Lincoln Elementary',
    description: 'Stuck Lexile plateau — 6 weeks, no growth',
    action: 'Review',
    tab: 'skills',
  },
  {
    id: '2',
    level: 'warning',
    title: 'Washington Middle',
    description: 'Student engagement down 39% vs. last month',
    action: 'View habits',
    tab: 'habits',
  },
  {
    id: '3',
    level: 'positive',
    title: 'Adams High',
    description: '+65% increase in avg session length',
    action: 'View details',
    tab: 'habits',
  },
]

// Sample icons for Button + Tabs showcases

function HealthStatKnobs() {
  const [bucket, setBucket] = useState('motivation')
  const [score, setScore] = useState('71')
  const [delta, setDelta] = useState('7')
  const [clickable, setClickable] = useState(true)
  const section = HEALTH_SECTIONS.find((s) => s.key === bucket)
  return (
    <>
      <Knobs>
        <Field label="bucket">
          <Select value={bucket} onChange={(e) => setBucket(e.target.value)}>
            <option>motivation</option>
            <option>integrity</option>
            <option>habits</option>
            <option>skills</option>
          </Select>
        </Field>
        <Field label="score">
          <Input type="number" value={score} onChange={(e) => setScore(e.target.value)} />
        </Field>
        <Field label="delta">
          <Input type="number" value={delta} onChange={(e) => setDelta(e.target.value)} />
        </Field>
        <Field label="clickable">
          <Toggle checked={clickable} onChange={setClickable} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <HealthStat
          section={section}
          score={Number(score)}
          delta={Number(delta)}
          onClick={clickable ? () => {} : undefined}
        />
      </div>
    </>
  )
}

function AlertRowKnobs() {
  const [level, setLevel] = useState('critical')
  const [title, setTitle] = useState('Lincoln Elementary')
  const [description, setDesc] = useState('Stuck Lexile plateau — 6 weeks, no growth')
  const [action, setActionText] = useState('Review')
  const [hasAction, setHasAction] = useState(true)
  return (
    <>
      <Knobs>
        <Field label="level">
          <Select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option>critical</option>
            <option>warning</option>
            <option>positive</option>
            <option>info</option>
          </Select>
        </Field>
        <Field label="title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="description">
          <Input value={description} onChange={(e) => setDesc(e.target.value)} />
        </Field>
        <Field label="action">
          <Toggle checked={hasAction} onChange={setHasAction} />
        </Field>
        {hasAction && (
          <Field label="action text">
            <Input value={action} onChange={(e) => setActionText(e.target.value)} />
          </Field>
        )}
      </Knobs>
      <div className="pt-variant-frame">
        <AlertRow
          level={level}
          title={title}
          description={description}
          action={hasAction ? action : undefined}
          onAction={hasAction ? () => {} : undefined}
        />
      </div>
    </>
  )
}

function ReadingHealthKnobs() {
  const [showTitle, setShowTitle] = useState(false)
  const [title, setTitle] = useState('Reading Health')
  return (
    <>
      <Knobs>
        <Field label="title">
          <Toggle checked={showTitle} onChange={setShowTitle} />
        </Field>
        {showTitle && (
          <Field label="title text">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
        )}
      </Knobs>
      <div className="pt-variant-frame">
        <ReadingHealth
          title={showTitle ? title : null}
          data={SAMPLE_HEALTH}
          onNavigate={() => {}}
        />
      </div>
    </>
  )
}

const noop = () => {}

const PARTNER_LINKED = {
  comicsplus: { account: 'olivia.m', org: 'LibraryPass - Full Collection Demo' },
  scholastic: { account: 'olivia.mcgrane', org: 'Magnolia Middle School' },
}

const AUTO_LOGGED_ROWS = [
  {
    id: 'a1',
    partnerId: 'comicsplus',
    title: 'Dog Man',
    meta: 'Today \u00b7 Finished',
    minutes: 24,
  },
  {
    id: 'a2',
    partnerId: 'beeverso',
    title: 'Platero y yo',
    meta: 'Today',
    minutes: 22,
  },
  {
    id: 'a3',
    partnerId: 'scholastic',
    title: 'Scholastic News',
    meta: 'Today',
    minutes: 12,
  },
]

/* Two shapes of page, which is the only thing the reader branches on. */
const READNOW_COMIC = {
  id: 'amulet',
  title: 'Amulet: The Stonekeeper',
  author: 'Kazu Kibuishi',
  cover: ['#5B21B6', '#312E81'],
  coverId: 2420582,
  genres: ['Graphic Novel'],
  color: '#5B21B6',
}

const READNOW_MAG = {
  id: 'scope',
  title: 'Scholastic Scope',
  author: 'Scholastic',
  cover: ['#2AA5B8', '#0B5566'],
  kind: 'magazine',
  masthead: 'Scope',
  issue: 'May 2026 · Survival Stories',
}

// One partner per example — the handoff wears each partner's own brand the
// whole way through, so three buttons in one frame hid the thing worth seeing.
function ConnectFlowDemo({ partner: p }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Link {p.name}
      </Button>
      {open && (
        <ConnectFlow
          partner={p}
          reader={PARTNER_READER}
          takenUsernames={TAKEN_USERNAMES}
          onCancel={() => setOpen(false)}
          onLinked={() => setOpen(false)}
        />
      )}
    </>
  )
}

/* The reader is a full-screen takeover, so the showcase opens it from a button
   the way every surface that offers it does. */
function ReadNowDemo({ book, partner }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Read {book.title}
      </Button>
      {open && <ReadNow book={book} partner={partner} onClose={() => setOpen(false)} />}
    </>
  )
}

const PR_VOCAB = {
  interests: INTERESTS,
  genres: GENRES,
  backgroundGroups: BACKGROUND_GROUPS,
  readingLevels: READING_LEVELS,
  languages: PREFERENCE_LANGUAGES,
  gradeLevels: BOOK_LIST_GRADES,
  doorways: DOORWAYS,
  limits: PREFERENCE_LIMITS,
}

function PersonalizeReaderDemo({ kind = 'child', deep = true }) {
  const [connections, setConnections] = useState({ comicsplus: PARTNER_LINKED.comicsplus })
  const [prefs, setPrefs] = useState(READER_PREFERENCES)
  return (
    <PersonalizeReader
      reader={PARTNER_READER}
      kind={kind}
      partners={CONNECTION_LIST}
      connections={connections}
      onLink={(id) => setConnections((c) => ({ ...c, [id]: { ...PARTNER_LINKED[id] } }))}
      onDisconnect={(id) =>
        setConnections((c) => {
          const next = { ...c }
          delete next[id]
          return next
        })
      }
      preferences={deep ? prefs : undefined}
      vocab={PR_VOCAB}
      sharedAccess={deep ? SHARED_ACCESS : []}
      sharedInvites={deep ? SHARED_INVITES : []}
      onSavePreferences={(id, value) =>
        setPrefs((p) => (id === 'basic' ? p : { ...p, [id]: value }))
      }
    />
  )
}

function PartnerBrandKnobs() {
  const ids = Object.keys(PARTNER_BRANDS)
  const [id, setId] = useState(ids[0])
  const [size, setSize] = useState('md')
  const [markSize, setMarkSize] = useState(30)
  const [invert, setInvert] = useState(false)
  const [shape, setShape] = useState('logo')
  const dark = PARTNER_BRANDS[id]?.accent ?? '#1B0C26'
  return (
    <>
      <Knobs>
        <Field label="partner">
          <Select value={id} onChange={(e) => setId(e.target.value)}>
            {ids.map((k) => (
              <option key={k} value={k}>
                {PARTNER_BRANDS[k].name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="shape">
          <Select value={shape} onChange={(e) => setShape(e.target.value)}>
            <option value="logo">logo (wordmark)</option>
            <option value="mark">mark (square)</option>
          </Select>
        </Field>
        {shape === 'logo' ? (
          <Field label="size">
            <Select value={size} onChange={(e) => setSize(e.target.value)}>
              <option>sm</option>
              <option>md</option>
              <option>lg</option>
            </Select>
          </Field>
        ) : (
          <Field label="size">
            <Select value={markSize} onChange={(e) => setMarkSize(Number(e.target.value))}>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={44}>44</option>
            </Select>
          </Field>
        )}
        <Field label="invert">
          <Toggle checked={invert} onChange={setInvert} />
        </Field>
      </Knobs>
      <div
        className="pt-variant-frame"
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          flexWrap: 'wrap',
          background: invert ? dark : undefined,
        }}
      >
        {shape === 'logo' ? (
          <PartnerBrand id={id} size={size} invert={invert} />
        ) : (
          <PartnerMark id={id} size={markSize} invert={invert} />
        )}
      </div>
    </>
  )
}

export const domainSections = [
  {
    group: 'ris',
    id: 'health-stat',
    name: 'HealthStat',
    usage: `import { HealthStat } from '@components/ReadingHealth/ReadingHealth'
import '@components/ReadingHealth/ReadingHealth.css'

<HealthStat section="volume" score={32} delta={4} onClick={open} />`,
    desc: (
      <>
        Single health-area tile (one of Motivation / Integrity / Habits / Skills). Props:{' '}
        <code>section</code>, <code>score</code>, <code>delta</code>, <code>onClick</code>. Renders
        as a button when <code>onClick</code> is provided.
      </>
    ),
    render: () => (
      <>
        <HealthStatKnobs />
      </>
    ),
  },
  {
    group: 'ris',
    id: 'reading-health',
    name: 'ReadingHealth',
    usage: `import { ReadingHealth } from '@components/ReadingHealth/ReadingHealth'
import '@components/ReadingHealth/ReadingHealth.css'

<ReadingHealth title="Reading health" data={data} onNavigate={go} />`,
    desc: (
      <>
        Full 4-tile grid wrapping HealthStat. Props: <code>title</code>, <code>data</code>,{' '}
        <code>onNavigate</code>.
      </>
    ),
    render: () => (
      <>
        <ReadingHealthKnobs />
      </>
    ),
  },
  {
    group: 'ris',
    id: 'alert-row',
    name: 'AlertRow',
    usage: `import { AlertRow } from '@components/AlertsBanner/AlertsBanner'
import '@components/AlertsBanner/AlertsBanner.css'

<AlertRow level="warning" title="12 sessions flagged" description="Review before Friday" action="Review" onAction={go} />`,
    desc: (
      <>
        Single alert tile. Props: <code>level</code> (critical | warning | positive | info),{' '}
        <code>title</code> (bold prefix), <code>description</code> (longer text),{' '}
        <code>action</code>, <code>onAction</code>. Collapses to stacked layout on narrow viewports.
      </>
    ),
    render: () => (
      <>
        <AlertRowKnobs />
      </>
    ),
  },
  {
    group: 'ris',
    id: 'alerts-banner',
    name: 'AlertsBanner',
    usage: `import { AlertsBanner } from '@components/AlertsBanner/AlertsBanner'
import '@components/AlertsBanner/AlertsBanner.css'

<AlertsBanner alerts={alerts} onNavigate={go} />`,
    desc: (
      <>
        List wrapper around AlertRow. Pass <code>alerts</code> array and optional{' '}
        <code>onNavigate</code>. Returns null when no alerts.
      </>
    ),
    render: () => (
      <>
        <Variant label="multiple alerts">
          <AlertsBanner alerts={SAMPLE_ALERTS} onNavigate={() => {}} />
        </Variant>
      </>
    ),
  },
  {
    group: 'iconography',
    id: 'rmi-icons',
    name: 'RMI Icons',
    usage: `import { BsIcon } from '@components/BsIcons/BsIcons'

/* RMI factor art is a tintable silhouette — it must be masked, not <img> */
<BsIcon set="rmiFactors" name="volume" size={24} />`,
    desc: (
      <>
        10 SVG icons keyed by motivation factor. Use via{' '}
        <code>{'<RMI_ICONS[factor.iconKey] />'}</code>. Inherit color from CSS <code>color</code>.
      </>
    ),
    render: () => (
      <>
        <Variant label="The ten motivation factors">
          <div className="pt-icons">
            {RMI_FACTORS.map((f) => (
              <div key={f.name} className="pt-icon-cell">
                <div
                  className="pt-icon-bg"
                  style={{
                    '--c': f.color,
                    '--bg': `color-mix(in srgb, ${f.color} 10%, white)`,
                  }}
                >
                  {RMI_ICONS[f.iconKey]}
                </div>
                <div className="pt-icon-name">{f.name}</div>
                <div className="pt-icon-key">{f.iconKey}</div>
              </div>
            ))}
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'iconography',
    id: 'partner-brand',
    name: 'Partner Brand',
    usage: `import { PartnerBrand, PartnerMark } from '@components/PartnerBrand/PartnerBrand'

<PartnerBrand id="comics-plus" size={28} />
<PartnerMark id="scholastic" size={20} />`,
    desc: (
      <>
        Reading-partner identity. <code>PartnerBrand</code> is the full lockup (sizes{' '}
        <code>sm/md/lg</code>, plus <code>invert</code> for dark partner chrome);{' '}
        <code>PartnerMark</code> is the square app mark used in banners, top-bar switchers and
        alongside covers. Comics Plus renders its real brand assets; the rest are wordmark
        approximations. <code>PARTNER_BRANDS</code> carries each partner&apos;s name and accent, and
        Beeverso adds <code>wordmarkInvert</code> — a purpose-made light-on-dark lockup used instead
        of a white plate.
        <br />
        <br />
        Every mark carries the same hairline ring and the same 28% radius, whatever the source art
        is: a row of app marks reads as a set, and the ring used to be on the plated one alone.
      </>
    ),
    render: () => (
      <>
        <PartnerBrandKnobs />
        <Variant label="every partner, one size — the set as it reads together">
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            {Object.keys(PARTNER_BRANDS).map((id) => (
              <PartnerBrand key={id} id={id} />
            ))}
          </div>
        </Variant>
        <Variant label="PartnerMark — the same square mark at one size">
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            {Object.keys(PARTNER_BRANDS).map((id) => (
              <PartnerMark key={id} id={id} size={30} />
            ))}
          </div>
        </Variant>
        <Variant label="mark sizes — 20 / 30 / 44">
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <PartnerMark id="comicsplus" size={20} />
            <PartnerMark id="comicsplus" size={30} />
            <PartnerMark id="comicsplus" size={44} />
          </div>
        </Variant>
        <Variant label="marks on invert — the tile and the art trade places">
          <div
            style={{
              display: 'flex',
              gap: 14,
              alignItems: 'center',
              flexWrap: 'wrap',
              background: 'var(--c-gray-900)',
              padding: 14,
              borderRadius: 10,
            }}
          >
            {Object.keys(PARTNER_BRANDS).map((id) => (
              <PartnerMark key={id} id={id} size={30} invert />
            ))}
          </div>
        </Variant>
        <Variant label="invert — every lockup on its partner's own dark chrome">
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            {Object.entries(PARTNER_BRANDS).map(([id, p]) => (
              <span
                key={id}
                style={{
                  // One height for every chip: the lockups themselves vary (a
                  // lockup wordmark renders at mark height, a plain one at word
                  // height), and a ragged row of chrome reads as a mistake.
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: 60,
                  background: p.dark,
                  padding: '0 16px',
                  borderRadius: 10,
                }}
              >
                <PartnerBrand id={id} invert />
              </span>
            ))}
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'account',
    id: 'partner-connect-banner',
    name: 'Connect Banner',
    usage: `import { BannerStack } from '@components/ReaderApp/ReaderApp'
import { ConnectBanner } from '@components/PartnerConnect/PartnerConnect'

<ConnectBanner partners={['comics-plus', 'sora']} onLink={link} onDismiss={hide} />`,
    desc: (
      <>
        The dashboard prompt to link reading apps. Takes <strong>every</strong> partner that
        isn&apos;t connected yet, not one at a time — a reader with two apps left to link sees one
        banner, not a stack. With a single partner it wears that partner&apos;s brand and speaks in
        their voice; with more than one it goes neutral and the links collapse into a single
        &ldquo;Link an app&rdquo; flyout — a button per partner turned the banner into a toolbar and
        wrapped on anything narrow. Renders nothing when everything is linked.
        <br />
        <br />
        Built on <code>ReaderBanner</code>, the one bar the reader app&apos;s whole notification
        stack uses — so it can&apos;t drift from the streak, community-goal and friend-request bars
        it sits above and below. The partner supplies the ground and the ink through{' '}
        <code>tint</code>/<code>ink</code>; everything else is the shared bar&apos;s.
      </>
    ),
    render: () => (
      <>
        <Variant label="one partner left — the partner's own brand" full>
          <div style={{ padding: 16 }}>
            {/* `BannerStack` is what spaces these on the page; without it two
                banners sit flush against each other. */}
            <BannerStack max={9}>
              <ConnectBanner partners={[CONNECTIONS.comicsplus]} onLink={noop} onDismiss={noop} />
              <ConnectBanner partners={[BEEVERSO]} onLink={noop} onDismiss={noop} />
            </BannerStack>
          </div>
        </Variant>
        <Variant label="two or three left — neutral, one flyout" full>
          <div style={{ padding: 16 }}>
            <BannerStack max={9}>
              <ConnectBanner
                partners={[BEEVERSO, CONNECTIONS.comicsplus]}
                onLink={noop}
                onDismiss={noop}
              />
              <ConnectBanner
                partners={[BEEVERSO, CONNECTIONS.comicsplus, CONNECTIONS.scholastic]}
                onLink={noop}
                onDismiss={noop}
              />
            </BannerStack>
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'account',
    id: 'read-now',
    name: 'Read Now',
    usage: `import { ReadNow } from '@components/ReadNow/ReadNow'

<ReadNow book={book} partner="comicsplus" onClose={close} onFinish={done} />`,
    desc: (
      <>
        The in-app reader a linked partner&apos;s title opens in — Book Discovery&apos;s{' '}
        <strong>Read now</strong> and the log flow&apos;s <strong>Read in …</strong> both land here.
        Chrome takes the partner&apos;s own colour from <code>PARTNER_BRANDS</code>. A book whose{' '}
        <code>genres</code> include <em>Graphic Novel</em> gets stylised comic panels; everything
        else gets a text page. Arrows, space and Escape all work, and the last page offers{' '}
        <code>onFinish</code>.
      </>
    ),
    render: () => (
      <>
        <Variant label="A graphic novel — comic panels">
          <ReadNowDemo book={READNOW_COMIC} partner="comicsplus" />
        </Variant>
        <Variant label="A magazine on Scholastic — text pages">
          <ReadNowDemo book={READNOW_MAG} partner="scholastic" />
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'account',
    id: 'partner-connect-flow',
    name: 'Connect Flow',
    usage: `import { ConnectFlow } from '@components/PartnerConnect/PartnerConnect'

<ConnectFlow partner="comics-plus" reader={reader} onCancel={close} onLinked={done} />`,
    desc: (
      <>
        The full account handoff, rendered in the partner&apos;s own chrome: pick your school → sign
        in → confirm both accounts belong to you → linked. A partner with no <code>orgs</code> skips
        straight to sign-in, and <code>ssoOptions</code> adds the district SSO buttons under the
        form. Signing in as <code>taken</code> lands on the &ldquo;already connected&rdquo; error
        instead. Escape or &ldquo;Back to Beanstack&rdquo; backs out.
      </>
    ),
    render: () => (
      <>
        <Variant label="Comics Plus — the handoff in their brand">
          <ConnectFlowDemo partner={CONNECTIONS.comicsplus} />
        </Variant>
        <Variant label="Scholastic">
          <ConnectFlowDemo partner={CONNECTIONS.scholastic} />
        </Variant>
        <Variant label="Beeverso">
          <ConnectFlowDemo partner={BEEVERSO} />
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'account',
    id: 'partner-switcher',
    name: 'Partner Switcher',
    usage: `import { PartnerSwitcher } from '@components/PartnerConnect/PartnerConnect'

<PartnerSwitcher partners={partners} connections={connections} />`,
    desc: (
      <>
        The top-bar affordance the linked-accounts modal promises — &ldquo;swap between the two at
        any time using the logo in the top right.&rdquo; Shows a mark per linked app and opens a
        menu to jump over to that app&apos;s catalog or manage the connections. Renders nothing when
        nothing is linked.
      </>
    ),
    render: () => (
      <>
        <Variant label="both linked">
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16 }}>
            <PartnerSwitcher
              partners={CONNECTION_LIST}
              connections={PARTNER_LINKED}
              onManage={noop}
              onVisit={noop}
            />
          </div>
        </Variant>
        <Variant label="one linked">
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16 }}>
            <PartnerSwitcher
              partners={[BEEVERSO]}
              connections={{ beeverso: { account: 'carlamos', org: 'Arlington ISD' } }}
              onManage={noop}
              onVisit={noop}
            />
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'account',
    id: 'partner-auto-logged',
    name: 'Auto-Logged Card',
    usage: `import { AutoLoggedCard } from '@components/PartnerConnect/PartnerConnect'

<AutoLoggedCard
  rows={[{ id, partnerId, title, meta: 'Today · Finished', minutes }]}
/>`,
    desc: (
      <>
        The payoff of a linked account: reading that arrived from a partner without the reader
        logging anything. Takes display-ready <code>rows</code>, since only the consuming prototype
        knows how to name its own titles.
        <br />
        <br />
        <code>meta</code> is <strong>when</strong> it was read and whether it was finished — not the
        partner&apos;s name. Its mark is right beside it and names itself on hover, so putting the
        name in the line too printed &ldquo;Beeverso&rdquo; down a card that already only holds a
        linked app&apos;s reading.
      </>
    ),
    render: () => (
      <Variant label="three partners contributing" full>
        <div style={{ padding: 16 }}>
          <AutoLoggedCard className="wa-card" rows={AUTO_LOGGED_ROWS} />
        </div>
      </Variant>
    ),
  },
  {
    group: 'web-app',
    sub: 'account',
    id: 'account-settings',
    name: 'Edit Account',
    usage: `import { AccountSettings } from '@components/AccountSettings/AccountSettings'

<AccountSettings account={account} />

/* …and with what the site collects, and its own word for a password */
<AccountSettings
  account={account}
  title="Edit Account"
  branches={branches}              /* the library's own, for Preferred Branch */
  authWord="Passcode"              /* word_for_auth_type */
  minLength={8}
  features={{ zipcode: true, libraryCard: true, strongPassword: true }}
  onSave={(fields) => save(fields)}
  onDelete={() => deleteAccount()}
/>`,
    desc: (
      <>
        The page behind the gear on a library site — <code>user#edit</code>. This is the{' '}
        <em>account</em> rather than a reader: the sign-in that holds the profiles, so the email and
        the password live here, and it is the only place the whole account — every reader under it
        included — can be deleted. Its sibling is Personalize Reader below, which is one
        reader&apos;s own settings; a school has no account above the reader and only ever sees that
        one.
        <br />
        <br />
        The app has one form with one Save; here the details and the password are two cards with one
        each, because changing an email and changing a password are different errands — and the
        app&apos;s own rule means its single Save will not take the first without the second.
        <br />
        <br />
        The password half has two shapes, and which one a site gets is the{' '}
        <code>block_default_passwords</code> flipper: a plain pair of fields, or the strong-password
        block — a strength meter in the app&apos;s own five colours, a requirements checklist and a
        match line — where nothing saves until a new password passes all three.
      </>
    ),
    render: () => (
      <>
        <Variant label="a library account — ZIP, library card and a branch" full>
          <div style={{ padding: '0 24px' }}>
            <AccountSettings
              account={ACCOUNT}
              branches={LIBRARY_BRANCHES}
              features={{ zipcode: true, libraryCard: true }}
            />
          </div>
        </Variant>
        <Variant label="the plain password pair, on a site that calls it a Passcode" full>
          <div style={{ padding: '0 24px' }}>
            <AccountSettings
              account={ACCOUNT}
              authWord="Passcode"
              features={{ strongPassword: false }}
            />
          </div>
        </Variant>
        <Variant label="a military site — the two extra lists" full>
          <div style={{ padding: '0 24px' }}>
            <AccountSettings
              account={ACCOUNT}
              features={{ zipcode: true, militaryBranch: true, militarySponsor: true }}
            />
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'account',
    id: 'personalize-reader',
    name: 'Personalize Reader',
    usage: `import { PersonalizeReader } from '@components/PersonalizeReader/PersonalizeReader'
import { BannerStack } from '@components/ReaderApp/ReaderApp'

<PersonalizeReader reader={reader} partners={partners} connections={connections} />

/* …and with the Preferences list and the forms behind it */
<PersonalizeReader
  reader={reader}
  kind="child"                 /* or "adult" — a different list entirely */
  preferences={prefs}
  vocab={{ interests, genres, backgroundGroups, readingLevels, languages, gradeLevels, doorways, limits }}
  onSavePreferences={(id, value) => save(id, value)}
  sharedAccess={viewers}
  sharedInvites={invited}
/>`,
    desc: (
      <>
        The reader&apos;s settings page — <code>profiles#edit_options</code>. Everything a reader
        (or the grown-up holding their account) can change about themselves: who they are, what they
        like, who can see them, which reading apps are linked, and how to delete them. A stack of
        cards, each with a title row, on the same frame as Edit Account beside it.
        <br />
        <br />
        <strong>Profile</strong> is the identity block: the picture, the name, and the way into{' '}
        <code>Basic Information</code>. The app puts the picture behind a pencil on a 140px circle
        in a column of its own and a modal behind that, to do one thing; here it is a block that
        saves in place, consent checkbox and all.
        <br />
        <br />
        <strong>Preferences</strong> is the app&apos;s own link-list, and each row carries whether
        it has been answered — <code>is_personalized?</code>, the <code>finished</code> /{' '}
        <code>not-finished</code> class on those links — plus what the answer was, with the count
        beside the title. <code>kind</code> decides which list: a child gets the six filters the
        recommendation engine reads, an adult or teen gets the <strong>Four Doorways</strong>{' '}
        instead.
        <br />
        <br />A row opens that filter&apos;s form in a modal. In the app each is a page in the
        sign-up funnel with Back and &ldquo;Next: Choose Favorite Genres&rdquo;. The headings, the
        &ldquo;Pick up to N&rdquo; limits, the over-limit notice and the
        <strong> &ldquo;No Preference&rdquo; option</strong> — a real answer, not a blank — are the
        app&apos;s own.
        <br />
        <br />
        <strong>Notifications</strong> is the app&apos;s two Yes/No radio sections — recommendations
        and email — as two switches, because a binary with a Save button under it is four
        interactions to change a yes to a no. It is also the home of{' '}
        <strong>App Integrations</strong>, where a partner account is connected or disconnected; an
        empty <code>partners</code> drops that card rather than leaving a bare heading.{' '}
        <strong>
          Leave <code>preferences</code> off
        </strong>{' '}
        and the Profile and Preferences cards go with it — which is how Words with Benny and
        beeverso reuse the page for the integration surface alone.
      </>
    ),
    render: () => (
      <>
        <Variant label="a child profile — the six recommendation filters" full>
          <div style={{ padding: '0 24px' }}>
            <PersonalizeReaderDemo />
          </div>
        </Variant>
        <Variant label="an adult profile — Reading Doorways instead" full>
          <div style={{ padding: '0 24px' }}>
            <PersonalizeReaderDemo kind="adult" />
          </div>
        </Variant>
        <Variant label="without preferences — the integration surface on its own" full>
          <div style={{ padding: '0 24px' }}>
            <PersonalizeReaderDemo deep={false} />
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'student-profile',
    id: 'daily-reading-tracker',
    name: 'DailyReadingTracker',
    usage: `import { DailyReadingTracker } from '@components/DailyReadingTracker/DailyReadingTracker'

<DailyReadingTracker
  weekLabel="Mar 3 – Mar 9"
  rows={rows}
  average={22}
  showGoal
  onPrevWeek={prev}
  onNextWeek={next}
/>`,
    desc: (
      <>
        The class page&apos;s Daily Reading grid — who hit their daily goal, day by day. The table
        is the shipped one (column striping, the fenced Goal column, 48px rows, the 50&times;22 tone
        lozenge, medals for the top three); <code>rows</code> takes a day as <code>true</code> (a
        check disc), <code>null</code> (a dash) or a percentage. Ten columns don&apos;t fit a phone
        and the app only wraps them in an <code>overflow: auto</code> box, so at{' '}
        <strong>&le;&nbsp;699px</strong> the same rows re-render as one card per reader with the
        week as a seven-day strip — narrow the window to see it. Both trees stay in the DOM and swap
        in CSS, so there&apos;s no resize flash and print always gets the table.
      </>
    ),
    render: () => (
      <Variant label="a week of the class tracker" full>
        <DailyReadingTracker
          weekLabel="5/11 – 5/17 (This Week)"
          rows={SAMPLE_TRACKER}
          average={SAMPLE_TRACKER_AVG}
        />
      </Variant>
    ),
  },
]
