import { useState, useEffect } from 'react'
import { StatCard, ChartCard, CardNote } from '../ris/components/Cards'
import {
  ChartLegend, SliceTooltip, GradeTooltip, BarTooltip,
} from '../ris/components/charts'
import { SECTIONS, HealthStat, ReadingHealth } from '../ris/components/ReadingHealth'
import { AlertRow, AlertsBanner } from '../ris/components/AlertsBanner'
import { Hero } from '../ris/components/Hero'
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
import { Toggle } from '../ris/components/Toggle'
import {
  Field, Input, Select, Textarea, Checkbox, RadioGroup, Radio,
} from '../ris/components/Form'
import { RMI_ICONS } from '../ris/components/RmiIcons'
import { RMI_FACTORS } from '../ris/data'

// Bring in CSS for the components so they render properly here
import '../ris/components/Cards.css'
import '../ris/components/SchoolDashboard.css'
import '../ris/components/ReadingHealth.css'
import '../ris/components/AlertsBanner.css'
import '../ris/components/Hero.css'
import '../MainRail.css'
import '../BackBar.css'
import '../ris/components/Toggle.css'
import '../ris/components/Form.css'

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
  { group: 'Forms',     id: 'toggle',       name: 'Toggle' },
  { group: 'Forms',     id: 'input',        name: 'Input' },
  { group: 'Forms',     id: 'select',       name: 'Select' },
  { group: 'Forms',     id: 'textarea',     name: 'Textarea' },
  { group: 'Forms',     id: 'checkbox',     name: 'Checkbox' },
  { group: 'Forms',     id: 'radio',        name: 'RadioGroup' },
  { group: 'Forms',     id: 'field-form',   name: 'Field / Form' },
  { group: 'Cards',     id: 'stat-card',    name: 'StatCard' },
  { group: 'Cards',     id: 'chart-card',   name: 'ChartCard' },
  { group: 'Cards',     id: 'card-note',    name: 'CardNote' },
  { group: 'Charts',    id: 'chart-legend', name: 'ChartLegend' },
  { group: 'Charts',    id: 'tooltips',     name: 'Tooltips' },
  { group: 'Health',    id: 'health-stat',  name: 'HealthStat' },
  { group: 'Health',    id: 'reading-health', name: 'ReadingHealth' },
  { group: 'Alerts',    id: 'alert-row',    name: 'AlertRow' },
  { group: 'Alerts',    id: 'alerts-banner', name: 'AlertsBanner' },
  { group: 'Heroes',    id: 'hero',         name: 'Hero' },
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

// ── Knobs panel wrapper ──────────────────────────────────────────────────
function Knobs({ children }) {
  return <div className="pt-knobs">{children}</div>
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
      <Knobs>
        <Field label="title"><Input value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <Field label="subtitle"><Input value={subtitle} onChange={e => setSubtitle(e.target.value)} /></Field>
        <Field label="accent" className="pt-knob-color">
          <input className="pt-color" type="color" value={accent} onChange={e => setAccent(e.target.value)} />
        </Field>
        <Field label="bodyPad">
          <Select value={bodyPad} onChange={e => setBodyPad(e.target.value)}>
            <option value="flush">flush</option>
            <option value="padded">padded</option>
          </Select>
        </Field>
        <Toggle checked={showIcon} onChange={setShowIcon}>icon</Toggle>
        <Toggle checked={showAction} onChange={setShowAction}>action</Toggle>
        <Toggle checked={showFooter} onChange={setShowFooter}>footer</Toggle>
      </Knobs>
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

function ButtonKnobs() {
  const [label, setLabel]       = useState('Log for Class')
  const [variant, setVariant]   = useState('primary')
  const [size, setSize]         = useState('md')
  const [accent, setAccent]     = useState('#7C3AED')
  const [withIcon, setIcon]     = useState(false)
  const [withCaret, setCaret]   = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading]   = useState(false)
  return (
    <>
      <Knobs>
        <Field label="label"><Input value={label} onChange={e => setLabel(e.target.value)} /></Field>
        <Field label="variant">
          <Select value={variant} onChange={e => setVariant(e.target.value)}>
            <option>primary</option><option>secondary</option><option>ghost</option><option>danger</option><option>accent</option>
          </Select>
        </Field>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        {variant === 'accent' && (
          <Field label="accent">
            <input className="pt-color" type="color" value={accent} onChange={e => setAccent(e.target.value)} />
          </Field>
        )}
        <Toggle checked={withIcon} onChange={setIcon}>left icon</Toggle>
        <Toggle checked={withCaret} onChange={setCaret}>right caret</Toggle>
        <Toggle checked={disabled} onChange={setDisabled}>disabled</Toggle>
        <Toggle checked={loading} onChange={setLoading}>loading</Toggle>
      </Knobs>
      <div className="pt-variant-frame">
        <Button
          variant={variant}
          size={size}
          accent={accent}
          disabled={disabled}
          loading={loading}
          icon={withIcon ? <PlusIcon /> : undefined}
          iconRight={withCaret ? <CaretIcon /> : undefined}
        >
          {label}
        </Button>
      </div>
    </>
  )
}

function AvatarKnobs() {
  const [initials, setInitials] = useState('MC')
  const [color, setColor]       = useState('#E8866A')
  const [size, setSize]         = useState('md')
  const [shape, setShape]       = useState('circle')
  return (
    <>
      <Knobs>
        <Field label="initials"><Input value={initials} onChange={e => setInitials(e.target.value.slice(0, 2))} /></Field>
        <Field label="color">
          <input className="pt-color" type="color" value={color} onChange={e => setColor(e.target.value)} />
        </Field>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>xs</option><option>sm</option><option>md</option><option>lg</option><option>xl</option>
          </Select>
        </Field>
        <Field label="shape">
          <RadioGroup name="av-shape" value={shape} onChange={setShape}>
            <Radio value="circle">circle</Radio>
            <Radio value="square">square</Radio>
          </RadioGroup>
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Avatar initials={initials} color={color} size={size} shape={shape} />
      </div>
    </>
  )
}

function PillKnobs() {
  const [text, setText]       = useState('Skills')
  const [variant, setVariant] = useState('soft')
  const [size, setSize]       = useState('md')
  const [color, setColor]     = useState('#7C3AED')
  return (
    <>
      <Knobs>
        <Field label="text"><Input value={text} onChange={e => setText(e.target.value)} /></Field>
        <Field label="variant">
          <Select value={variant} onChange={e => setVariant(e.target.value)}>
            <option>soft</option><option>filled</option><option>outline</option>
          </Select>
        </Field>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option>
          </Select>
        </Field>
        <Field label="color">
          <input className="pt-color" type="color" value={color} onChange={e => setColor(e.target.value)} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Pill color={color} variant={variant} size={size}>{text}</Pill>
      </div>
    </>
  )
}

function ProgressBarKnobs() {
  const [value, setValue]   = useState(62)
  const [color, setColor]   = useState('#E8866A')
  const [size, setSize]     = useState('md')
  const [label, setLabel]   = useState('Engagement')
  const [valueLabel, setVl] = useState('62%')
  const [subLabel, setSub]  = useState('')
  const [showLabel, setShowLabel] = useState(true)
  return (
    <>
      <Knobs>
        <Field label="value">
          <Input type="range" min="0" max="100" value={value} onChange={e => setValue(Number(e.target.value))} />
        </Field>
        <Field label="color">
          <input className="pt-color" type="color" value={color} onChange={e => setColor(e.target.value)} />
        </Field>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        <Toggle checked={showLabel} onChange={setShowLabel}>label / value</Toggle>
        {showLabel && <Field label="label"><Input value={label} onChange={e => setLabel(e.target.value)} /></Field>}
        {showLabel && <Field label="subLabel"><Input value={subLabel} onChange={e => setSub(e.target.value)} placeholder="(optional)" /></Field>}
        {showLabel && <Field label="valueLabel"><Input value={valueLabel} onChange={e => setVl(e.target.value)} /></Field>}
      </Knobs>
      <div className="pt-variant-frame">
        <ProgressBar
          value={value}
          color={color}
          size={size}
          label={showLabel ? label : undefined}
          subLabel={showLabel && subLabel ? subLabel : undefined}
          valueLabel={showLabel ? valueLabel : undefined}
        />
      </div>
    </>
  )
}

// ── Form showcase pieces ─────────────────────────────────────────────────
function ToggleShowcase() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  const [c, setC] = useState(true)
  return (
    <div className="pt-variants pt-variants--3">
      <Variant label="default (md)">
        <Toggle checked={a} onChange={setA}>Notifications</Toggle>
      </Variant>
      <Variant label="off">
        <Toggle checked={b} onChange={setB}>Auto-publish</Toggle>
      </Variant>
      <Variant label="size='sm'">
        <Toggle checked={c} onChange={setC} size="sm">Compact mode</Toggle>
      </Variant>
      <Variant label="disabled">
        <Toggle checked disabled>Locked on</Toggle>
      </Variant>
      <Variant label="disabled off">
        <Toggle checked={false} disabled>Locked off</Toggle>
      </Variant>
    </div>
  )
}

function InputShowcase() {
  const [value, setValue] = useState('Lincoln Elementary')
  return (
    <div className="pt-variants pt-variants--2">
      <Variant label="default" bare>
        <Field label="School name">
          <Input value={value} onChange={e => setValue(e.target.value)} placeholder="Type here…" />
        </Field>
      </Variant>
      <Variant label="with help text" bare>
        <Field label="Email" help="We'll send weekly summaries here.">
          <Input type="email" placeholder="you@school.org" />
        </Field>
      </Variant>
      <Variant label="with error" bare>
        <Field label="Slug" error="Slug is required.">
          <Input placeholder="lincoln-elementary" />
        </Field>
      </Variant>
      <Variant label="with left icon" bare>
        <Field label="Search">
          <Input
            placeholder="Find a student…"
            icon={<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="7.5" r="4.5"/><path d="M10.8 10.8 14.5 14.5"/></svg>}
          />
        </Field>
      </Variant>
      <Variant label="disabled" bare>
        <Field label="School ID" help="Auto-generated; cannot be edited.">
          <Input value="sch_lincoln_2024" disabled />
        </Field>
      </Variant>
      <Variant label="sizes (sm/md/lg)" bare>
        <Field label="Small"><Input size="sm" placeholder="sm" /></Field>
        <Field label="Medium"><Input size="md" placeholder="md" /></Field>
        <Field label="Large"><Input size="lg" placeholder="lg" /></Field>
      </Variant>
    </div>
  )
}

function SelectShowcase() {
  const [grade, setGrade] = useState('5')
  return (
    <div className="pt-variants pt-variants--2">
      <Variant label="default" bare>
        <Field label="Grade level">
          <Select value={grade} onChange={e => setGrade(e.target.value)}>
            {['K', '1', '2', '3', '4', '5', '6', '7', '8'].map(g => <option key={g} value={g}>Grade {g}</option>)}
          </Select>
        </Field>
      </Variant>
      <Variant label="sizes" bare>
        <Field label="Small"><Select size="sm"><option>sm</option></Select></Field>
        <Field label="Medium"><Select size="md"><option>md</option></Select></Field>
        <Field label="Large"><Select size="lg"><option>lg</option></Select></Field>
      </Variant>
    </div>
  )
}

function TextareaShowcase() {
  const [value, setValue] = useState('Lincoln Elementary saw a 6-week Lexile plateau despite strong engagement scores.')
  return (
    <div className="pt-variants" style={{ gridTemplateColumns: '1fr' }}>
      <Variant label="default" bare>
        <Field label="Notes" help="Visible to district leadership.">
          <Textarea rows={4} value={value} onChange={e => setValue(e.target.value)} />
        </Field>
      </Variant>
    </div>
  )
}

function CheckboxShowcase() {
  const [a, setA] = useState(false)
  const [b, setB] = useState(true)
  return (
    <div className="pt-variants pt-variants--3">
      <Variant label="unchecked"><Checkbox checked={a} onChange={setA}>Send weekly digest</Checkbox></Variant>
      <Variant label="checked"><Checkbox checked={b} onChange={setB}>Include FRL data</Checkbox></Variant>
      <Variant label="disabled"><Checkbox checked disabled>Locked option</Checkbox></Variant>
    </div>
  )
}

function RadioShowcase() {
  const [a, setA] = useState('md')
  return (
    <div className="pt-variants pt-variants--2">
      <Variant label="row">
        <RadioGroup name="rs-row" value={a} onChange={setA}>
          <Radio value="sm">Small</Radio>
          <Radio value="md">Medium</Radio>
          <Radio value="lg">Large</Radio>
        </RadioGroup>
      </Variant>
      <Variant label="column">
        <RadioGroup name="rs-col" layout="column" value={a} onChange={setA}>
          <Radio value="sm">Small (compact density)</Radio>
          <Radio value="md">Medium (default density)</Radio>
          <Radio value="lg">Large (spacious density)</Radio>
        </RadioGroup>
      </Variant>
    </div>
  )
}

function FullFormShowcase() {
  const [name, setName]   = useState('')
  const [grade, setGrade] = useState('5')
  const [bucket, setBucket] = useState('motivation')
  const [notes, setNotes] = useState('')
  const [optIn, setOptIn] = useState(true)
  return (
    <div className="pt-form" onSubmit={e => e.preventDefault()}>
      <Field label="Student name" help="As it appears in your SIS.">
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Marcus Chen" />
      </Field>
      <div className="pt-form-row">
        <Field label="Grade level">
          <Select value={grade} onChange={e => setGrade(e.target.value)}>
            {['K','1','2','3','4','5','6','7','8','9','10','11','12'].map(g => <option key={g} value={g}>Grade {g}</option>)}
          </Select>
        </Field>
        <Field label="Watch reason">
          <RadioGroup name="watch-reason" value={bucket} onChange={setBucket}>
            <Radio value="motivation">Motivation</Radio>
            <Radio value="habits">Habits</Radio>
            <Radio value="skills">Skills</Radio>
            <Radio value="integrity">Integrity</Radio>
          </RadioGroup>
        </Field>
      </div>
      <Field label="Notes" help="Visible to district leadership.">
        <Textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Why are we watching this student?" />
      </Field>
      <Toggle checked={optIn} onChange={setOptIn}>Notify teacher when this student is logged for the next reading session</Toggle>
      <div className="pt-form-actions">
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Add to watchlist</Button>
      </div>
    </div>
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
            <ButtonKnobs />
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
            <AvatarKnobs />
          </Section>

          <Section
            id="pill"
            title="Pill"
            desc={<>Colored badge / chip. Variants: <code>soft</code> (default, tinted bg + dark text), <code>filled</code> (solid + white text), <code>outline</code>. Sizes: <code>sm</code>, <code>md</code>. Optional left <code>icon</code>.</>}
          >
            <PillKnobs />
          </Section>

          <Section
            id="progress-bar"
            title="ProgressBar"
            desc={<>Track + fill with optional <code>label</code>, <code>subLabel</code>, and <code>valueLabel</code>. Used for cohorts, RMI factors, grade bands, engagement tiers. Sizes: <code>sm</code>, <code>md</code>, <code>lg</code>.</>}
          >
            <ProgressBarKnobs />
          </Section>

          <Section
            id="toggle"
            title="Toggle"
            desc={<>iOS-style switch. Props: <code>checked</code>, <code>onChange</code>, <code>disabled</code>, <code>size</code> (sm/md), optional label as children.</>}
          >
            <ToggleShowcase />
          </Section>

          <Section
            id="input"
            title="Input"
            desc={<>Text input. Sizes <code>sm</code> / <code>md</code> / <code>lg</code>. Optional <code>icon</code> + <code>iconRight</code>. Picks up id, error state, and ARIA from the parent <code>Field</code>.</>}
          >
            <InputShowcase />
          </Section>

          <Section
            id="select"
            title="Select"
            desc={<>Wrapped native <code>{'<select>'}</code> with a consistent caret + focus ring. Same size scale as Input.</>}
          >
            <SelectShowcase />
          </Section>

          <Section
            id="textarea"
            title="Textarea"
            desc={<>Multi-line text input. Resizes vertically by default.</>}
          >
            <TextareaShowcase />
          </Section>

          <Section
            id="checkbox"
            title="Checkbox"
            desc={<>Boolean control with a colored check icon when on. Use for non-exclusive options.</>}
          >
            <CheckboxShowcase />
          </Section>

          <Section
            id="radio"
            title="RadioGroup"
            desc={<>Mutually exclusive options. <code>RadioGroup</code> takes <code>name</code>, <code>value</code>, <code>onChange</code>, optional <code>layout</code> (row/column). Children are <code>Radio</code> with a <code>value</code>.</>}
          >
            <RadioShowcase />
          </Section>

          <Section
            id="field-form"
            title="Field / Full form example"
            desc={<><code>Field</code> wraps any control with a label, optional <code>help</code> text, or an <code>error</code> message. Below is a real form composing every primitive together.</>}
          >
            <FullFormShowcase />
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
            id="hero"
            title="Hero"
            desc={<>One unified page header. Pass either <code>initials</code> (avatar) or <code>icon</code> (icon block); optional <code>subtitle</code> and right-side <code>score</code>+<code>delta</code>. The <code>bucket</code> prop auto-derives icon/title/accent/accentBg from SECTIONS for the four health areas.</>}
          >
            <div className="pt-variants" style={{ gridTemplateColumns: '1fr' }}>
              <Variant label="avatar + title + subtitle (overview)" bare>
                <Hero
                  initials="LE"
                  title="Lincoln Elementary"
                  subtitle="K–5 · 1,650 students"
                  accent="#E8866A"
                />
              </Variant>
              <Variant label="icon + title + subtitle (page)" bare>
                <Hero
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
            </div>
            <div className="pt-variants pt-variants--2">
              <Variant label="bucket='motivation'" bare>
                <Hero bucket="motivation" score={71} delta={7} />
              </Variant>
              <Variant label="bucket='integrity'" bare>
                <Hero bucket="integrity" score={86} delta={3} />
              </Variant>
              <Variant label="bucket='habits'" bare>
                <Hero bucket="habits" score={58} delta={5} />
              </Variant>
              <Variant label="bucket='skills' (negative)" bare>
                <Hero bucket="skills" score={42} delta={-3} />
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
