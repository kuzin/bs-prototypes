import { useState, useEffect } from 'react'
import { StatCard, ChartCard, CardNote } from '../ris/components/Cards'
import {
  ChartLegend, SliceTooltip, GradeTooltip, BarTooltip,
} from '../ris/components/charts'
import { SECTIONS, HealthStat, ReadingHealth } from '../ris/components/ReadingHealth'
import { AlertRow, AlertsBanner } from '../ris/components/AlertsBanner'
import { OverviewHero } from '../ris/components/OverviewHero'
import { BucketHero } from '../ris/components/BucketHero'
import { MainRail } from '../MainRail'
import { PrototypeNav } from '../PrototypeNav'
import { Button } from '../ris/components/Button'
import { Tabs } from '../ris/components/Tabs'
import { Flyout } from '../ris/components/Flyout'
import { Modal } from '../ris/components/Modal'
import { Table } from '../ris/components/Table'
import { Avatar } from '../ris/components/Avatar'
import { Pill } from '../ris/components/Pill'
import { ProgressBar } from '../ris/components/ProgressBar'
import { BackBar } from '../BackBar'
import { PageHero } from '../ris/components/PageHero'
import { RMI_ICONS } from '../ris/components/RmiIcons'
import { RMI_FACTORS } from '../ris/data'

// Bring in CSS for the components so they render properly here
import '../ris/components/Cards.css'
import '../ris/components/SchoolDashboard.css'
import '../ris/components/ReadingHealth.css'
import '../ris/components/AlertsBanner.css'
import '../ris/components/OverviewHero.css'
import '../ris/components/BucketHero.css'
import '../ris/components/PageHero.css'
import '../MainRail.css'
import '../BackBar.css'

import './App.css'

const SECTIONS_LIST = [
  { group: 'Primitives', id: 'button',     name: 'Button' },
  { group: 'Primitives', id: 'tabs',       name: 'Tabs' },
  { group: 'Primitives', id: 'flyout',     name: 'Flyout' },
  { group: 'Primitives', id: 'modal',      name: 'Modal' },
  { group: 'Primitives', id: 'table',      name: 'Table' },
  { group: 'Primitives', id: 'avatar',     name: 'Avatar' },
  { group: 'Primitives', id: 'pill',       name: 'Pill' },
  { group: 'Primitives', id: 'progress-bar', name: 'ProgressBar' },
  { group: 'Cards',     id: 'stat-card',    name: 'StatCard' },
  { group: 'Cards',     id: 'chart-card',   name: 'ChartCard' },
  { group: 'Cards',     id: 'card-note',    name: 'CardNote' },
  { group: 'Charts',    id: 'chart-legend', name: 'ChartLegend' },
  { group: 'Charts',    id: 'tooltips',     name: 'Tooltips' },
  { group: 'Health',    id: 'health-stat',  name: 'HealthStat' },
  { group: 'Health',    id: 'reading-health', name: 'ReadingHealth' },
  { group: 'Alerts',    id: 'alert-row',    name: 'AlertRow' },
  { group: 'Alerts',    id: 'alerts-banner', name: 'AlertsBanner' },
  { group: 'Heroes',    id: 'overview-hero', name: 'OverviewHero' },
  { group: 'Heroes',    id: 'bucket-hero',  name: 'BucketHero' },
  { group: 'Heroes',    id: 'page-hero',    name: 'PageHero' },
  { group: 'Layout',    id: 'back-bar',     name: 'BackBar' },
  { group: 'Layout',    id: 'main-rail',    name: 'MainRail' },
  { group: 'Layout',    id: 'prototype-nav', name: 'PrototypeNav' },
  { group: 'Icons',     id: 'rmi-icons',    name: 'RMI Icons' },
  { group: 'Icons',     id: 'health-icons', name: 'Reading Health Icons' },
]

const fakeSlicePoints = (points) => ({
  points: points.map((p, i) => ({
    id:         `${p.serieId}.${i}`,
    serieId:    p.serieId,
    serieColor: p.color,
    data:       { x: p.x, y: p.y },
  })),
})

const RMI_TREND_FIXTURE = [
  { month: 'Sep', school: 64, district: 68 },
  { month: 'Oct', school: 65, district: 69 },
  { month: 'Nov', school: 67, district: 71 },
  { month: 'Dec', school: 66, district: 70 },
  { month: 'Jan', school: 68, district: 72 },
]

const SAMPLE_HEALTH = { motivation: 71, integrity: 86, habits: 58, skills: 42, dM: 7, dI: 3, dH: 5, dS: -3 }

const SAMPLE_ALERTS = [
  { id: '1', level: 'critical', school: 'Lincoln Elementary', title: 'Stuck Lexile plateau — 6 weeks, no growth', action: 'Review', tab: 'skills' },
  { id: '2', level: 'warning', school: 'Washington Middle',   title: 'Student engagement down 39% vs. last month', action: 'View habits', tab: 'habits' },
  { id: '3', level: 'positive', school: 'Adams High',          title: '+65% increase in avg session length', action: 'View details', tab: 'habits' },
]

// Sample icons for Button + Tabs showcases
const PlusIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="3" x2="8" y2="13" /><line x1="3" y1="8" x2="13" y2="8" />
  </svg>
)
const CaretIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4,6 8,10 12,6" />
  </svg>
)

function ButtonShowcase() {
  return (
    <>
      <div className="pt-variants pt-variants--4">
        <Variant label="primary" bare><Button variant="primary">Log for Class</Button></Variant>
        <Variant label="secondary" bare><Button variant="secondary">Set Classroom Goal</Button></Variant>
        <Variant label="ghost" bare><Button variant="ghost">Cancel</Button></Variant>
        <Variant label="danger" bare><Button variant="danger">Delete</Button></Variant>
      </div>
      <div className="pt-variants pt-variants--4" style={{ marginTop: 16 }}>
        <Variant label="accent (custom color)" bare>
          <Button variant="accent" accent="#7C3AED">Open Skills</Button>
        </Variant>
        <Variant label="with icon" bare>
          <Button variant="primary" icon={<PlusIcon />}>Add Student</Button>
        </Variant>
        <Variant label="with right caret" bare>
          <Button variant="secondary" iconRight={<CaretIcon />}>Filter</Button>
        </Variant>
        <Variant label="as link (a)" bare>
          <Button as="a" href="#" variant="ghost">Link button</Button>
        </Variant>
      </div>
      <div className="pt-variants pt-variants--4" style={{ marginTop: 16 }}>
        <Variant label="size='sm'" bare><Button variant="primary" size="sm">Small</Button></Variant>
        <Variant label="size='md'" bare><Button variant="primary" size="md">Medium</Button></Variant>
        <Variant label="size='lg'" bare><Button variant="primary" size="lg">Large</Button></Variant>
        <Variant label="disabled / loading" bare>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
          </div>
        </Variant>
      </div>
    </>
  )
}

function TabsShowcase() {
  const [a, setA] = useState('daily')
  const [b, setB] = useState('overview')
  return (
    <>
      <Variant label="underline (default)">
        <Tabs
          active={a}
          onChange={setA}
          items={[
            { id: 'daily',   label: 'Daily Reading' },
            { id: 'roster',  label: 'Students', count: 24 },
            { id: 'rewards', label: 'Earned Rewards' },
          ]}
        />
      </Variant>
      <Variant label="pill variant">
        <Tabs
          variant="pill"
          active={b}
          onChange={setB}
          items={[
            { id: 'overview', label: 'Overview' },
            { id: 'detail',   label: 'Detail' },
            { id: 'history',  label: 'History' },
          ]}
        />
      </Variant>
    </>
  )
}

function FlyoutShowcase() {
  return (
    <div className="pt-variants pt-variants--2">
      <Variant label="simple menu">
        <Flyout
          trigger={({ open, toggle }) => (
            <Button variant="secondary" iconRight={<CaretIcon />} onClick={toggle} aria-expanded={open}>
              Actions
            </Button>
          )}
        >
          {({ close }) => (
            <div className="flyout-menu">
              <button className="flyout-menu-item" onClick={close}>Edit</button>
              <button className="flyout-menu-item" onClick={close}>Duplicate</button>
              <button className="flyout-menu-item" onClick={close}>Archive</button>
            </div>
          )}
        </Flyout>
      </Variant>
      <Variant label="school picker">
        <Flyout
          placement="bottom-start"
          trigger={({ open, toggle }) => (
            <Button variant="secondary" iconRight={<CaretIcon />} onClick={toggle} aria-expanded={open}>
              Lincoln Elementary
            </Button>
          )}
        >
          {({ close }) => (
            <div className="flyout-menu" style={{ minWidth: 200 }}>
              {['Jefferson', 'Lincoln', 'Kennedy', 'Roosevelt', 'Washington', 'Adams'].map(s => (
                <button
                  key={s}
                  className={`flyout-menu-item${s === 'Lincoln' ? ' flyout-menu-item--active' : ''}`}
                  onClick={close}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </Flyout>
      </Variant>
    </div>
  )
}

function ModalShowcase() {
  const [sideOpen, setSideOpen] = useState(false)
  const [centerOpen, setCenterOpen] = useState(false)
  return (
    <div className="pt-variants pt-variants--2">
      <Variant label="variant='side' (slide-in)">
        <Button onClick={() => setSideOpen(true)}>Open side panel</Button>
        <Modal open={sideOpen} onClose={() => setSideOpen(false)} variant="side" ariaLabel="Sample side panel">
          {({ close }) => (
            <div style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 8 }}>Side Panel</h3>
              <p style={{ color: '#64748B', marginBottom: 16 }}>
                Slides in from the right with backdrop. Press Escape or click the backdrop to close.
              </p>
              <Button variant="primary" onClick={close}>Close</Button>
            </div>
          )}
        </Modal>
      </Variant>
      <Variant label="variant='center' (overlay)">
        <Button onClick={() => setCenterOpen(true)}>Open centered modal</Button>
        <Modal open={centerOpen} onClose={() => setCenterOpen(false)} variant="center" ariaLabel="Sample modal">
          {({ close }) => (
            <div style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 8 }}>Confirm</h3>
              <p style={{ color: '#64748B', marginBottom: 16 }}>
                Delete this challenge? This action can't be undone.
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={close}>Cancel</Button>
                <Button variant="danger" onClick={close}>Delete</Button>
              </div>
            </div>
          )}
        </Modal>
      </Variant>
    </div>
  )
}

function TableShowcase() {
  const rows = [
    { id: 'jefferson',  name: 'Jefferson',  rmi: 80, delta:  8, students: 1820 },
    { id: 'lincoln',    name: 'Lincoln',    rmi: 71, delta:  7, students: 1650 },
    { id: 'kennedy',    name: 'Kennedy',    rmi: 77, delta:  7, students: 2340 },
    { id: 'washington', name: 'Washington', rmi: 62, delta:  1, students: 1980 },
    { id: 'adams',      name: 'Adams',      rmi: 83, delta:  9, students: 2510 },
  ]
  const renderDelta = (v) => (
    <span style={{ color: v >= 0 ? '#16A34A' : '#DC2626', fontWeight: 700 }}>
      {v >= 0 ? '↑' : '↓'} {Math.abs(v)} pts
    </span>
  )
  return (
    <>
      <Variant label="basic + clickable rows">
        <Table
          columns={[
            { key: 'name',     label: 'School' },
            { key: 'students', label: 'Students', align: 'right', render: v => v.toLocaleString() },
            { key: 'rmi',      label: 'RMI',      align: 'right' },
            { key: 'delta',    label: 'YoY',      align: 'right', render: renderDelta },
          ]}
          rows={rows}
          onRowClick={() => {}}
        />
      </Variant>
      <Variant label="zebra + compact">
        <Table
          columns={[
            { key: 'name',     label: 'School' },
            { key: 'rmi',      label: 'RMI',  align: 'right' },
            { key: 'students', label: 'Students', align: 'right', render: v => v.toLocaleString() },
          ]}
          rows={rows}
          zebra
          compact
        />
      </Variant>
    </>
  )
}

function ChartCardKnobs() {
  const [title, setTitle]       = useState('Reading Motivation Index')
  const [subtitle, setSubtitle] = useState('Sep 2024 – May 2025')
  const [accent, setAccent]     = useState('#E8866A')
  const [showIcon, setShowIcon] = useState(true)
  const [showFooter, setShowFooter] = useState(true)
  const [showAction, setShowAction] = useState(true)
  const [bodyPad, setBodyPad]   = useState('padded')

  const icon = SECTIONS.find(s => s.key === 'motivation')?.icon
  return (
    <>
      <div className="pt-knobs">
        <div className="pt-knob">
          <label htmlFor="t">title</label>
          <input id="t" type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="pt-knob">
          <label htmlFor="s">subtitle</label>
          <input id="s" type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} />
        </div>
        <div className="pt-knob">
          <label htmlFor="a">accent</label>
          <input id="a" type="color" value={accent} onChange={e => setAccent(e.target.value)} />
        </div>
        <div className="pt-knob">
          <label htmlFor="b">bodyPad</label>
          <select id="b" value={bodyPad} onChange={e => setBodyPad(e.target.value)}>
            <option value="flush">flush</option>
            <option value="padded">padded</option>
          </select>
        </div>
        <div className="pt-knob">
          <label><input type="checkbox" checked={showIcon} onChange={e => setShowIcon(e.target.checked)} /> icon</label>
        </div>
        <div className="pt-knob">
          <label><input type="checkbox" checked={showAction} onChange={e => setShowAction(e.target.checked)} /> action</label>
        </div>
        <div className="pt-knob">
          <label><input type="checkbox" checked={showFooter} onChange={e => setShowFooter(e.target.checked)} /> footer</label>
        </div>
      </div>
      <div className="pt-variant-frame pt-variant-frame--bare">
        <ChartCard
          title={title}
          subtitle={subtitle}
          accent={accent}
          icon={showIcon ? icon : undefined}
          action={showAction ? <button className="rc-card-drill">View →</button> : undefined}
          bodyPad={bodyPad}
          footer={showFooter ? (
            <ChartLegend items={[
              { color: accent,   label: 'This school' },
              { color: '#CBD5E1', label: 'District avg', dashed: true },
            ]} />
          ) : undefined}
        >
          <div style={{ color: '#94A3B8', textAlign: 'center', padding: '32px 0' }}>
            {bodyPad === 'flush' ? 'Chart goes here (flush)' : 'Padded content goes here'}
          </div>
        </ChartCard>
      </div>
    </>
  )
}

function Section({ id, title, desc, children }) {
  return (
    <section id={id} className="pt-section">
      <div className="pt-section-head">
        <h2>{title}</h2>
        {desc && <div className="pt-section-desc">{desc}</div>}
      </div>
      <div className="pt-section-body">{children}</div>
    </section>
  )
}

function Variant({ label, children, bare, full }) {
  const className = [
    'pt-variant-frame',
    bare && 'pt-variant-frame--bare',
    full && 'pt-variant-frame--full',
  ].filter(Boolean).join(' ')
  return (
    <div className="pt-variant">
      <div className="pt-variant-label">{label}</div>
      <div className={className}>{children}</div>
    </div>
  )
}

export function App() {
  const [active, setActive] = useState('stat-card')

  useEffect(() => {
    function onScroll() {
      const sections = SECTIONS_LIST.map(s => document.getElementById(s.id))
      const top = document.querySelector('.pt-content').scrollTop + 60
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i].offsetTop <= top) {
          setActive(SECTIONS_LIST[i].id)
          return
        }
      }
    }
    const content = document.querySelector('.pt-content')
    content?.addEventListener('scroll', onScroll, { passive: true })
    return () => content?.removeEventListener('scroll', onScroll)
  }, [])

  // Group sections for sidebar
  const groups = SECTIONS_LIST.reduce((acc, s) => {
    if (!acc[s.group]) acc[s.group] = []
    acc[s.group].push(s)
    return acc
  }, {})

  return (
    <>
      <div className="pt-shell">
        <aside className="pt-sidebar">
          <div className="pt-sidebar-title">Pattern Library</div>
          <div className="pt-sidebar-sub">Shared components used across all RIS prototype pages</div>
          {Object.entries(groups).map(([group, items]) => (
            <div key={group} className="pt-nav-group">
              <div className="pt-nav-group-label">{group}</div>
              {items.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`pt-nav-link${active === s.id ? ' pt-nav-link--active' : ''}`}
                  onClick={() => setActive(s.id)}
                >
                  {s.name}
                </a>
              ))}
            </div>
          ))}
        </aside>

        <main className="pt-content">
          <div className="pt-header">
            <h1>Pattern Library</h1>
            <p>Edit the source CSS / JSX and every prototype updates via HMR. Knobs let you preview prop combinations without touching code.</p>
          </div>

          <Section
            id="button"
            title="Button"
            desc={<>Variants: <code>primary</code>, <code>secondary</code>, <code>ghost</code>, <code>danger</code>, <code>accent</code>. Sizes: <code>sm</code>, <code>md</code>, <code>lg</code>. Optional <code>icon</code> / <code>iconRight</code>. Can render as a link via <code>as="a"</code>.</>}
          >
            <ButtonShowcase />
          </Section>

          <Section
            id="tabs"
            title="Tabs"
            desc={<>Horizontal tab strip. <code>items</code> is <code>{'[{ id, label, count?, icon? }]'}</code>. Two variants: <code>underline</code> (default) and <code>pill</code>.</>}
          >
            <TabsShowcase />
          </Section>

          <Section
            id="flyout"
            title="Flyout"
            desc={<>Anchored popover triggered by a button. Closes on outside click + Escape. Children can be JSX or a render function that receives <code>{'{ close }'}</code>.</>}
          >
            <FlyoutShowcase />
          </Section>

          <Section
            id="modal"
            title="Modal"
            desc={<>Two variants: <code>side</code> (right-slide panel) and <code>center</code> (overlay). Both close on backdrop click + Escape and animate in/out.</>}
          >
            <ModalShowcase />
          </Section>

          <Section
            id="table"
            title="Table"
            desc={<>Pass <code>columns</code> and <code>rows</code>. Each column can have <code>align</code>, <code>render</code>, <code>width</code>. Optional <code>onRowClick</code>, <code>zebra</code>, <code>compact</code>.</>}
          >
            <TableShowcase />
          </Section>

          <Section
            id="avatar"
            title="Avatar"
            desc={<>Initials in a colored circle or square. Props: <code>initials</code>, <code>color</code>, <code>size</code> (xs/sm/md/lg/xl), <code>shape</code> (circle/square — square uses the size's border-radius).</>}
          >
            <div className="pt-variants pt-variants--3">
              <Variant label="circle sizes">
                <Avatar initials="MC" color="#E8866A" size="xs" />
                <Avatar initials="MC" color="#E8866A" size="sm" />
                <Avatar initials="MC" color="#E8866A" size="md" />
                <Avatar initials="MC" color="#E8866A" size="lg" />
                <Avatar initials="MC" color="#E8866A" size="xl" />
              </Variant>
              <Variant label="square sizes">
                <Avatar initials="LE" color="#1D4ED8" size="xs" shape="square" />
                <Avatar initials="LE" color="#1D4ED8" size="sm" shape="square" />
                <Avatar initials="LE" color="#1D4ED8" size="md" shape="square" />
                <Avatar initials="LE" color="#1D4ED8" size="lg" shape="square" />
                <Avatar initials="LE" color="#1D4ED8" size="xl" shape="square" />
              </Variant>
              <Variant label="colors">
                <Avatar initials="AB" color="#16A97A" />
                <Avatar initials="JK" color="#C084FC" />
                <Avatar initials="RM" color="#7CB5F5" />
                <Avatar initials="SD" color="#F0C050" />
                <Avatar initials="EG" color="#0DA7BC" />
              </Variant>
            </div>
          </Section>

          <Section
            id="pill"
            title="Pill"
            desc={<>Colored badge / chip. Variants: <code>soft</code> (default, tinted bg + dark text), <code>filled</code> (solid + white text), <code>outline</code>. Sizes: <code>sm</code>, <code>md</code>. Optional left <code>icon</code>.</>}
          >
            <div className="pt-variants pt-variants--3">
              <Variant label="variant='soft'">
                <Pill color="#7C3AED">Skills</Pill>
                <Pill color="#16A97A">Habits</Pill>
                <Pill color="#E8866A">Motivation</Pill>
                <Pill color="#1D4ED8">Integrity</Pill>
              </Variant>
              <Variant label="variant='filled'">
                <Pill color="#DC2626" variant="filled">High Priority</Pill>
                <Pill color="#D97706" variant="filled">Monitor</Pill>
                <Pill color="#16A34A" variant="filled">Active</Pill>
              </Variant>
              <Variant label="variant='outline'">
                <Pill color="#1D4ED8" variant="outline">Title I</Pill>
                <Pill color="#475569" variant="outline">Not eligible</Pill>
              </Variant>
            </div>
          </Section>

          <Section
            id="progress-bar"
            title="ProgressBar"
            desc={<>Track + fill with optional <code>label</code>, <code>subLabel</code>, and <code>valueLabel</code>. Used for cohorts, RMI factors, grade bands, engagement tiers. Sizes: <code>sm</code>, <code>md</code>, <code>lg</code>.</>}
          >
            <div className="pt-variants pt-variants--2">
              <Variant label="bare track">
                <ProgressBar value={62} color="#7C3AED" />
              </Variant>
              <Variant label="with label + value">
                <ProgressBar value={62} color="#7C3AED" label="Free/Reduced Lunch" valueLabel="62%" />
              </Variant>
              <Variant label="label + sub + value">
                <ProgressBar
                  value={3.1}
                  max={4}
                  color="#E8866A"
                  label="Enjoyment"
                  subLabel="Reading for personal pleasure and fun"
                  valueLabel="3.1"
                />
              </Variant>
              <Variant label="sizes (sm / md / lg)">
                <ProgressBar value={62} color="#16A97A" size="sm" />
                <ProgressBar value={62} color="#16A97A" size="md" />
                <ProgressBar value={62} color="#16A97A" size="lg" />
              </Variant>
            </div>
          </Section>

          <Section
            id="stat-card"
            title="StatCard"
            desc={<>Small metric tile shown in a row at the top of a bucket page. Props: <code>value</code>, <code>unit</code>, <code>label</code>, <code>footer</code>, <code>color</code>, <code>footerColor</code>.</>}
          >
            <div className="pt-variants pt-variants--4">
              <Variant label="basic" bare>
                <StatCard value={71} label="Reading Motivation Index" footer="↑ 7 pts since Sep 2024" />
              </Variant>
              <Variant label="with unit + color" bare>
                <StatCard value={26.0} unit="/40" label="School RMI score" footer="↑ 7 pts since Sep" color="#E8866A" />
              </Variant>
              <Variant label="semantic footer (good)" bare>
                <StatCard value="+18" unit="L" label="YTD Lexile growth" footer="Above expected +65L" color="#16A97A" footerColor="#16A34A" />
              </Variant>
              <Variant label="semantic footer (bad)" bare>
                <StatCard value="+8" unit="L" label="YTD Lexile growth" footer="Below expected +65L" color="#DC2626" footerColor="#DC2626" />
              </Variant>
            </div>
          </Section>

          <Section
            id="chart-card"
            title="ChartCard"
            desc={<>Wide rectangle with a consistent header / body / footer used for every chart and panel. Props: <code>title</code>, <code>subtitle</code>, <code>icon</code>, <code>accent</code>, <code>action</code>, <code>footer</code>, <code>bodyPad</code>. Knobs below to preview combinations.</>}
          >
            <ChartCardKnobs />
          </Section>

          <Section
            id="card-note"
            title="CardNote"
            desc={<>Inline note inside a card body. Two tones: <code>neutral</code> (slate) and <code>accent</code> (uses the card's <code>--rc-accent</code>).</>}
          >
            <div className="pt-variants pt-variants--2">
              <Variant label="tone='neutral'" bare>
                <ChartCard title="Neutral" accent="#1D4ED8" bodyPad="padded">
                  <CardNote tone="neutral">
                    Sample neutral note text — used for grayscale callouts that don't need the card's accent color.
                  </CardNote>
                </ChartCard>
              </Variant>
              <Variant label="tone='accent'" bare>
                <ChartCard title="Accent" accent="#E8866A" bodyPad="padded">
                  <CardNote tone="accent">
                    Intrinsic subscore rose from <strong>12.1</strong> to <strong>14.2 /20</strong>, outpacing extrinsic motivation.
                  </CardNote>
                </ChartCard>
              </Variant>
            </div>
          </Section>

          <Section
            id="chart-legend"
            title="ChartLegend"
            desc={<>Footer legend rendered below the chart body. <code>items</code> is an array of <code>{'{ color, label, dashed? }'}</code>.</>}
          >
            <div className="pt-variants pt-variants--2">
              <Variant label="solid + dashed">
                <ChartLegend items={[
                  { color: '#E8866A', label: 'Lincoln' },
                  { color: '#CBD5E1', label: 'District avg', dashed: true },
                ]} />
              </Variant>
              <Variant label="three series">
                <ChartLegend items={[
                  { color: '#0DA7BC', label: 'Elementary' },
                  { color: '#16A97A', label: 'Middle' },
                  { color: '#C084FC', label: 'High' },
                ]} />
              </Variant>
            </div>
          </Section>

          <Section
            id="tooltips"
            title="Tooltips"
            desc={<>The rich Nivo tooltip pattern: colored accent stripe on the left, uppercase header, per-series row with optional MoM delta, optional context footer.</>}
          >
            <div className="pt-variants pt-variants--3">
              <Variant label="SliceTooltip — line chart">
                <SliceTooltip
                  slice={fakeSlicePoints([
                    { serieId: 'Lincoln',      color: '#E8866A', x: 'Jan', y: 68 },
                    { serieId: 'District avg', color: '#CBD5E1', x: 'Jan', y: 72 },
                  ])}
                  accent="#E8866A"
                  allData={RMI_TREND_FIXTURE}
                  seriesMap={{ Lincoln: 'school', 'District avg': 'district' }}
                  formatDelta={d => `${d > 0 ? '+' : ''}${d} pts`}
                  context={() => <><strong>Lincoln</strong> −4 pts below district</>}
                />
              </Variant>
              <Variant label="BarTooltip — grouped bars">
                <BarTooltip
                  data={{ intrinsic: 14.2, extrinsic: 11.8 }}
                  indexValue="May"
                  accent="#E8866A"
                  format={v => `${v.toFixed(1)} /20`}
                  keys={['intrinsic', 'extrinsic']}
                  labels={{
                    intrinsic: { label: 'Intrinsic', color: '#E8866A' },
                    extrinsic: { label: 'Extrinsic', color: '#CBD5E1' },
                  }}
                  context={d => <><strong>Intrinsic</strong> +{(d.intrinsic - d.extrinsic).toFixed(1)} pts above extrinsic</>}
                />
              </Variant>
              <Variant label="GradeTooltip — Lexile bars">
                <GradeTooltip
                  data={{ grade: '4th', growth: 78, expected: 55 }}
                  accent="#7C3AED"
                />
              </Variant>
            </div>
          </Section>

          <Section
            id="health-stat"
            title="HealthStat"
            desc={<>Single health-area tile (one of Motivation / Integrity / Habits / Skills). Props: <code>section</code>, <code>score</code>, <code>delta</code>, <code>onClick</code>. Renders as a button when <code>onClick</code> is provided.</>}
          >
            <div className="pt-variants pt-variants--4">
              {SECTIONS.map((sec, i) => (
                <Variant key={sec.key} label={`clickable · ${sec.label}`} bare>
                  <HealthStat
                    section={sec}
                    score={SAMPLE_HEALTH[sec.key]}
                    delta={SAMPLE_HEALTH[sec.deltaKey]}
                    onClick={() => {}}
                  />
                </Variant>
              ))}
            </div>
            <div className="pt-variants pt-variants--4" style={{ marginTop: 16 }}>
              <Variant label="static (no onClick)" bare>
                <HealthStat
                  section={SECTIONS[0]}
                  score={71}
                  delta={7}
                />
              </Variant>
              <Variant label="no delta" bare>
                <HealthStat
                  section={SECTIONS[1]}
                  score={86}
                />
              </Variant>
            </div>
          </Section>

          <Section
            id="reading-health"
            title="ReadingHealth"
            desc={<>Full 4-tile grid wrapping HealthStat. Props: <code>title</code>, <code>data</code>, <code>onNavigate</code>.</>}
          >
            <Variant label="dashboard usage" bare>
              <ReadingHealth title={null} data={SAMPLE_HEALTH} onNavigate={() => {}} />
            </Variant>
          </Section>

          <Section
            id="alert-row"
            title="AlertRow"
            desc={<>Single alert tile shown by AlertsBanner. Props: <code>level</code> (critical | warning | positive | info), <code>school</code>, <code>title</code>, <code>action</code>, <code>onAction</code>.</>}
          >
            <div className="pt-variants" style={{ gridTemplateColumns: '1fr' }}>
              <Variant label="critical">
                <AlertRow level="critical" school="Lincoln Elementary" title="Stuck Lexile plateau — 6 weeks, no growth" action="Review" onAction={() => {}} />
              </Variant>
              <Variant label="warning">
                <AlertRow level="warning" school="Washington Middle" title="Student engagement down 39% vs. last month" action="View habits" onAction={() => {}} />
              </Variant>
              <Variant label="positive">
                <AlertRow level="positive" school="Adams High" title="+65% increase in avg session length" action="View details" onAction={() => {}} />
              </Variant>
              <Variant label="info (no action)">
                <AlertRow level="info" school="Kennedy K-8" title="3 new Book Talks completed this week" />
              </Variant>
            </div>
          </Section>

          <Section
            id="alerts-banner"
            title="AlertsBanner"
            desc={<>List wrapper around AlertRow. Pass <code>alerts</code> array and optional <code>onNavigate</code>. Returns null when no alerts.</>}
          >
            <Variant label="multiple alerts" bare>
              <AlertsBanner alerts={SAMPLE_ALERTS} onNavigate={() => {}} />
            </Variant>
          </Section>

          <Section
            id="overview-hero"
            title="OverviewHero"
            desc={<>Top-of-dashboard header for a school or entity. Props: <code>title</code>, <code>subtitle</code>, <code>accent</code>, <code>initials</code>.</>}
          >
            <div className="pt-variants" style={{ gridTemplateColumns: '1fr' }}>
              <Variant label="elementary school">
                <OverviewHero
                  title="Lincoln Elementary"
                  subtitle="K–5 · 1,650 students"
                  accent="#E8866A"
                  initials="LE"
                />
              </Variant>
              <Variant label="high school">
                <OverviewHero
                  title="Adams High"
                  subtitle="9–12 · 2,510 students"
                  accent="#C084FC"
                  initials="AH"
                />
              </Variant>
            </div>
          </Section>

          <Section
            id="bucket-hero"
            title="BucketHero"
            desc={<>Header banner used at the top of every bucket detail page. Looks up the section by <code>bucket</code> key. Props: <code>bucket</code>, <code>score</code>, <code>delta</code>.</>}
          >
            <div className="pt-variants pt-variants--2">
              <Variant label="bucket='motivation'">
                <BucketHero bucket="motivation" score={71} delta={7} />
              </Variant>
              <Variant label="bucket='integrity'">
                <BucketHero bucket="integrity" score={86} delta={3} />
              </Variant>
              <Variant label="bucket='habits'">
                <BucketHero bucket="habits" score={58} delta={5} />
              </Variant>
              <Variant label="bucket='skills' (negative)">
                <BucketHero bucket="skills" score={42} delta={-3} />
              </Variant>
            </div>
          </Section>

          <Section
            id="page-hero"
            title="PageHero"
            desc={<>Top-of-page header for analytics / demographics pages with a tinted icon, title, and subtitle. Props: <code>icon</code>, <code>title</code>, <code>subtitle</code>, <code>accent</code>, <code>accentBg</code>.</>}
          >
            <div className="pt-variants" style={{ gridTemplateColumns: '1fr' }}>
              <Variant label="analytics" bare>
                <PageHero
                  icon={
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="3" height="6" rx="1" />
                      <rect x="8.5" y="7" width="3" height="10" rx="1" />
                      <rect x="14" y="3" width="3" height="14" rx="1" />
                    </svg>
                  }
                  title="Analytics"
                  subtitle="Student engagement, reading behavior, and outcome correlations · Lincoln Elementary"
                  accent="#0DA7BC"
                  accentBg="#ECFEFF"
                />
              </Variant>
              <Variant label="demographics" bare>
                <PageHero
                  icon={
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="10" cy="6" r="2.5" />
                      <circle cx="4"  cy="9" r="2" />
                      <circle cx="16" cy="9" r="2" />
                      <path d="M6 17c0-2.2 1.8-4 4-4s4 1.8 4 4" />
                      <path d="M1 17c0-1.7 1.3-3 3-3" />
                      <path d="M19 17c0-1.7-1.3-3-3-3" />
                    </svg>
                  }
                  title="Demographics"
                  subtitle="Student cohorts, equity indicators, and grade-level performance"
                  accent="#7C3AED"
                  accentBg="#F5F3FF"
                />
              </Variant>
            </div>
          </Section>

          <Section
            id="back-bar"
            title="BackBar"
            desc={<>"‹ Back to X" link styled like a breadcrumb. Renders as a button or anchor. Props: <code>label</code>, <code>onClick</code> or <code>href</code>.</>}
          >
            <Variant label="default" bare>
              <BackBar label="Back to Overview" onClick={() => {}} />
            </Variant>
          </Section>

          <Section
            id="main-rail"
            title="MainRail"
            desc={<>Narrow icon strip on the far left of every Beanstack admin page. Shared chrome. Props: <code>activeIndex</code> (0–7).</>}
          >
            <div className="pt-rail-frame">
              <MainRail activeIndex={4} />
              <div className="pt-rail-note">activeIndex = 4 (RIS app)</div>
            </div>
          </Section>

          <Section
            id="prototype-nav"
            title="PrototypeNav"
            desc={<>Floating switcher at the bottom-right of every prototype. Lets people jump between prototypes without going back to the index. Props: <code>currentHref</code>.</>}
          >
            <div className="pt-section-desc">
              The PrototypeNav is rendered at the bottom of this page itself — scroll to see it. It picks up the current prototype from <code>currentHref</code> and shows prev/next arrows for the other prototypes.
            </div>
          </Section>

          <Section
            id="rmi-icons"
            title="RMI Icons"
            desc={<>10 SVG icons keyed by motivation factor. Use via <code>{'<RMI_ICONS[factor.iconKey] />'}</code>. Inherit color from CSS <code>color</code>.</>}
          >
            <div className="pt-icons">
              {RMI_FACTORS.map(f => (
                <div key={f.name} className="pt-icon-cell">
                  <div
                    className="pt-icon-bg"
                    style={{ '--c': f.color, '--bg': `color-mix(in srgb, ${f.color} 10%, white)` }}
                  >
                    {RMI_ICONS[f.iconKey]}
                  </div>
                  <div className="pt-icon-name">{f.name}</div>
                  <div className="pt-icon-key">{f.iconKey}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="health-icons"
            title="Reading Health Icons"
            desc={<>The four health-area icons from <code>SECTIONS</code> (Motivation, Integrity, Habits, Skills). Used in dashboard cards and bucket page heroes.</>}
          >
            <div className="pt-icons">
              {SECTIONS.map(s => (
                <div key={s.key} className="pt-icon-cell">
                  <div
                    className="pt-icon-bg"
                    style={{ '--c': s.color, '--bg': s.bg }}
                  >
                    {s.icon}
                  </div>
                  <div className="pt-icon-name">{s.label}</div>
                  <div className="pt-icon-key">{s.key}</div>
                </div>
              ))}
            </div>
          </Section>
        </main>
      </div>
      <PrototypeNav currentHref="/bs-prototypes/patterns/" />
    </>
  )
}
