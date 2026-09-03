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
import { PersonalizeReader } from '@components/PartnerConnect/PersonalizeReader'
import { RMI_FACTORS } from '../../ris/data'
import { CONNECTIONS, CONNECTION_LIST, TAKEN_USERNAMES } from '../../logging-flow/connections'
import { READER as PARTNER_READER } from '../../logging-flow/data'
import { BEEVERSO } from '../../beeverso/connections'
import { Knobs, Variant } from './_shared'

// The auto-logged rail card borrows the consumer dashboard's card chrome.
import '../../web-app/index.css'

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
      <AlertRow
        level={level}
        title={title}
        description={description}
        action={hasAction ? action : undefined}
        onAction={hasAction ? () => {} : undefined}
      />
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
      <div className="pt-variant-frame pt-variant-frame--bare">
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
    meta: 'Comics Plus \u00b7 Today \u00b7 Finished',
    minutes: 24,
  },
  {
    id: 'a2',
    partnerId: 'beeverso',
    title: 'Platero y yo',
    meta: 'Beeverso \u00b7 Today',
    minutes: 22,
  },
  {
    id: 'a3',
    partnerId: 'scholastic',
    title: 'Scholastic News',
    meta: 'Scholastic \u00b7 Today',
    minutes: 12,
  },
]

function ConnectFlowDemo() {
  const [partner, setPartner] = useState(null)
  return (
    <div style={{ display: 'flex', gap: 10, padding: 16, flexWrap: 'wrap' }}>
      {[CONNECTIONS.comicsplus, CONNECTIONS.scholastic, BEEVERSO].map((p) => (
        <Button key={p.id} variant="secondary" size="sm" onClick={() => setPartner(p)}>
          Link {p.name}
        </Button>
      ))}
      {partner && (
        <ConnectFlow
          partner={partner}
          reader={PARTNER_READER}
          takenUsernames={TAKEN_USERNAMES}
          onCancel={() => setPartner(null)}
          onLinked={() => setPartner(null)}
        />
      )}
    </div>
  )
}

function PersonalizeReaderDemo() {
  const [connections, setConnections] = useState({ comicsplus: PARTNER_LINKED.comicsplus })
  return (
    <PersonalizeReader
      reader={PARTNER_READER}
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
    />
  )
}

export const domainSections = [
  {
    group: 'domain',
    id: 'health-stat',
    name: 'HealthStat',
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
    group: 'domain',
    id: 'reading-health',
    name: 'ReadingHealth',
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
    group: 'domain',
    id: 'alert-row',
    name: 'AlertRow',
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
    group: 'domain',
    id: 'alerts-banner',
    name: 'AlertsBanner',
    desc: (
      <>
        List wrapper around AlertRow. Pass <code>alerts</code> array and optional{' '}
        <code>onNavigate</code>. Returns null when no alerts.
      </>
    ),
    render: () => (
      <>
        <Variant label="multiple alerts" bare>
          <AlertsBanner alerts={SAMPLE_ALERTS} onNavigate={() => {}} />
        </Variant>
      </>
    ),
  },
  {
    group: 'domain',
    id: 'rmi-icons',
    name: 'RMI Icons',
    desc: (
      <>
        10 SVG icons keyed by motivation factor. Use via{' '}
        <code>{'<RMI_ICONS[factor.iconKey] />'}</code>. Inherit color from CSS <code>color</code>.
      </>
    ),
    render: () => (
      <>
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
      </>
    ),
  },
  {
    group: 'domain',
    id: 'health-icons',
    name: 'Reading Health Icons',
    desc: (
      <>
        The four health-area icons from <code>SECTIONS</code> (Motivation, Integrity, Habits,
        Skills). Used in dashboard cards and bucket page heroes.
      </>
    ),
    render: () => (
      <>
        <div className="pt-icons">
          {HEALTH_SECTIONS.map((s) => (
            <div key={s.key} className="pt-icon-cell">
              <div className="pt-icon-bg" style={{ '--c': s.color, '--bg': s.bg }}>
                {s.icon}
              </div>
              <div className="pt-icon-name">{s.label}</div>
              <div className="pt-icon-key">{s.key}</div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    group: 'domain',
    id: 'partner-brand',
    name: 'Partner Brand',
    desc: (
      <>
        Reading-partner identity. <code>PartnerBrand</code> is the full lockup (sizes{' '}
        <code>sm/md/lg</code>, plus <code>invert</code> for dark partner chrome);{' '}
        <code>PartnerMark</code> is the square app mark used in banners, top-bar switchers and
        alongside covers. Comics Plus renders its real brand assets; the rest are wordmark
        approximations. <code>PARTNER_BRANDS</code> carries each partner&apos;s name and accent, and
        Beeverso adds <code>wordmarkInvert</code> — a purpose-made light-on-dark lockup used instead
        of a white plate.
      </>
    ),
    render: () => (
      <>
        <Variant label="PartnerBrand — lockups">
          <div
            style={{
              display: 'flex',
              gap: 24,
              alignItems: 'center',
              padding: 16,
              flexWrap: 'wrap',
            }}
          >
            {Object.keys(PARTNER_BRANDS).map((id) => (
              <PartnerBrand key={id} id={id} />
            ))}
          </div>
        </Variant>
        <Variant label="sizes + invert (on dark partner chrome)">
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: 16 }}>
            <PartnerBrand id="comicsplus" size="sm" />
            <PartnerBrand id="comicsplus" size="lg" />
            <span style={{ background: '#1B0C26', padding: '12px 16px', borderRadius: 10 }}>
              <PartnerBrand id="comicsplus" invert />
            </span>
            {/* Beeverso ships its own light-on-dark lockup, so no plate. */}
            <span style={{ background: '#3C0458', padding: '12px 16px', borderRadius: 10 }}>
              <PartnerBrand id="beeverso" invert />
            </span>
          </div>
        </Variant>
        <Variant label="PartnerMark — square app marks">
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: 16 }}>
            {Object.keys(PARTNER_BRANDS).map((id) => (
              <PartnerMark key={id} id={id} size={30} />
            ))}
            <PartnerMark id="comicsplus" size={20} />
            <PartnerMark id="scholastic" size={44} />
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'domain',
    id: 'partner-connect-banner',
    name: 'Connect Banner',
    desc: (
      <>
        The dashboard prompt to link reading apps. Takes <strong>every</strong> partner that
        isn&apos;t connected yet, not one at a time — a reader with two apps left to link sees one
        banner, not a stack. With a single partner it wears that partner&apos;s brand and speaks in
        their voice; with more than one it goes neutral and offers a button each. Renders nothing
        when everything is linked.
      </>
    ),
    render: () => (
      <>
        <Variant label="one partner left — the partner's own brand" full>
          <div style={{ padding: 16 }}>
            <ConnectBanner partners={[CONNECTIONS.comicsplus]} onLink={noop} onDismiss={noop} />
            <ConnectBanner partners={[BEEVERSO]} onLink={noop} onDismiss={noop} />
          </div>
        </Variant>
        <Variant label="two or three left — neutral, a button each" full>
          <div style={{ padding: 16 }}>
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
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'domain',
    id: 'partner-connect-flow',
    name: 'Connect Flow',
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
      <Variant label="launch the handoff (full-screen overlay)" full>
        <ConnectFlowDemo />
      </Variant>
    ),
  },
  {
    group: 'domain',
    id: 'partner-switcher',
    name: 'Partner Switcher',
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
    group: 'domain',
    id: 'partner-auto-logged',
    name: 'Auto-Logged Card',
    desc: (
      <>
        The payoff of a linked account: reading that arrived from a partner without the reader
        logging anything. Takes display-ready <code>rows</code>, since only the consuming prototype
        knows how to name its own titles.
      </>
    ),
    render: () => (
      <Variant label="three partners contributing">
        <div style={{ maxWidth: 320, padding: 16 }}>
          <AutoLoggedCard className="wa-card" rows={AUTO_LOGGED_ROWS} />
        </div>
      </Variant>
    ),
  },
  {
    group: 'domain',
    id: 'personalize-reader',
    name: 'Personalize Reader',
    desc: (
      <>
        The reader&apos;s settings page, and the home of <strong>App Integrations</strong> — where a
        partner account is actually connected or disconnected. Each partner in <code>partners</code>{' '}
        is its own row, so linking one never touches the other. The dashboard banner and the top-bar
        switcher are shortcuts into this section. An empty <code>partners</code> drops the App
        Integrations section entirely rather than leaving a bare heading — that's how a prototype
        with no reading-app linking (Words with Benny) reuses this page.
      </>
    ),
    render: () => (
      <Variant label="Comics Plus connected, Scholastic not" full>
        <div style={{ padding: '0 24px' }}>
          <PersonalizeReaderDemo />
        </div>
      </Variant>
    ),
  },
]
