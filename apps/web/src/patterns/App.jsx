import { useState, useEffect } from 'react'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { StatCard, ChartCard, CardNote } from '../ris/components/Cards'
import {
  ChartLegend, SliceTooltip, GradeTooltip, BarTooltip,
  NIVO_THEME, LINE_MARGIN, AXIS_BOTTOM, AXIS_LEFT,
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
import {
  Divider, Spinner, IconButton, Tooltip, Banner,
  Breadcrumb, Accordion, EmptyState, Skeleton, SectionHeading,
} from '../ris/components/Primitives'
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
import '../ris/components/Primitives.css'

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
  { group: 'Primitives', id: 'icon-button', name: 'IconButton' },
  { group: 'Primitives', id: 'divider',     name: 'Divider' },
  { group: 'Primitives', id: 'spinner',     name: 'Spinner' },
  { group: 'Primitives', id: 'tooltip',     name: 'Tooltip (hover)' },
  { group: 'Primitives', id: 'banner',      name: 'Banner' },
  { group: 'Primitives', id: 'breadcrumb',  name: 'Breadcrumb' },
  { group: 'Primitives', id: 'accordion',   name: 'Accordion' },
  { group: 'Primitives', id: 'empty-state', name: 'EmptyState' },
  { group: 'Primitives', id: 'skeleton',    name: 'Skeleton' },
  { group: 'Primitives', id: 'section-heading', name: 'SectionHeading' },
  { group: 'Forms',     id: 'toggle',       name: 'Toggle' },
  { group: 'Forms',     id: 'input',        name: 'Input' },
  { group: 'Forms',     id: 'select',       name: 'Select' },
  { group: 'Forms',     id: 'textarea',     name: 'Textarea' },
  { group: 'Forms',     id: 'checkbox',     name: 'Checkbox' },
  { group: 'Forms',     id: 'radio',        name: 'RadioGroup' },
  { group: 'Forms',     id: 'field-form',   name: 'Field / Form' },
  { group: 'Charts',    id: 'chart-line',   name: 'Line chart' },
  { group: 'Charts',    id: 'chart-bar-grouped', name: 'Grouped bar chart' },
  { group: 'Charts',    id: 'chart-bar-h',  name: 'Horizontal bar chart' },
  { group: 'Charts',    id: 'chart-scatter', name: 'Scatter chart' },
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
        <Field label="icon"><Toggle checked={showIcon} onChange={setShowIcon} /></Field>
        <Field label="action"><Toggle checked={showAction} onChange={setShowAction} /></Field>
        <Field label="footer"><Toggle checked={showFooter} onChange={setShowFooter} /></Field>
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
        <Field label="left icon"><Toggle checked={withIcon} onChange={setIcon} /></Field>
        <Field label="right caret"><Toggle checked={withCaret} onChange={setCaret} /></Field>
        <Field label="disabled"><Toggle checked={disabled} onChange={setDisabled} /></Field>
        <Field label="loading"><Toggle checked={loading} onChange={setLoading} /></Field>
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
        <Field label="label / value"><Toggle checked={showLabel} onChange={setShowLabel} /></Field>
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

// ── More knob panels ─────────────────────────────────────────────────────
function TabsKnobs() {
  const [variant, setVariant] = useState('underline')
  const [active, setActive]   = useState('daily')
  return (
    <>
      <Knobs>
        <Field label="variant">
          <Select value={variant} onChange={e => setVariant(e.target.value)}>
            <option>underline</option><option>pill</option>
          </Select>
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Tabs
          variant={variant}
          active={active}
          onChange={setActive}
          items={[
            { id: 'daily',   label: 'Daily Reading' },
            { id: 'roster',  label: 'Students', count: 24 },
            { id: 'rewards', label: 'Earned Rewards' },
          ]}
        />
      </div>
    </>
  )
}

function IconButtonKnobs() {
  const [variant, setVariant]   = useState('secondary')
  const [size, setSize]         = useState('md')
  const [disabled, setDisabled] = useState(false)
  return (
    <>
      <Knobs>
        <Field label="variant">
          <Select value={variant} onChange={e => setVariant(e.target.value)}>
            <option>primary</option><option>secondary</option><option>ghost</option><option>danger</option>
          </Select>
        </Field>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        <Field label="disabled"><Toggle checked={disabled} onChange={setDisabled} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <IconButton variant={variant} size={size} disabled={disabled} aria-label="Add"><PlusIcon /></IconButton>
      </div>
    </>
  )
}

function SpinnerKnobs() {
  const [size, setSize]   = useState('md')
  const [color, setColor] = useState('#1D4ED8')
  return (
    <>
      <Knobs>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>xs</option><option>sm</option><option>md</option><option>lg</option><option>xl</option>
          </Select>
        </Field>
        <Field label="color">
          <input className="pt-color" type="color" value={color} onChange={e => setColor(e.target.value)} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Spinner size={size} color={color} />
      </div>
    </>
  )
}

function SkeletonKnobs() {
  const [shape, setShape] = useState('rect')
  const [width, setWidth] = useState('200')
  const [height, setHeight] = useState('14')
  const [lines, setLines] = useState('1')
  return (
    <>
      <Knobs>
        <Field label="shape">
          <RadioGroup name="skel-shape" value={shape} onChange={setShape}>
            <Radio value="rect">rect</Radio>
            <Radio value="circle">circle</Radio>
          </RadioGroup>
        </Field>
        <Field label="width"><Input value={width} onChange={e => setWidth(e.target.value)} /></Field>
        <Field label="height"><Input value={height} onChange={e => setHeight(e.target.value)} /></Field>
        <Field label="lines"><Input type="number" value={lines} onChange={e => setLines(e.target.value)} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Skeleton
          shape={shape}
          width={Number(width) || width}
          height={Number(height) || height}
          lines={Number(lines) > 1 ? Number(lines) : undefined}
        />
      </div>
    </>
  )
}

function TooltipKnobs() {
  const [placement, setPlacement] = useState('top')
  const [content, setContent]     = useState('Mark as read')
  return (
    <>
      <Knobs>
        <Field label="placement">
          <Select value={placement} onChange={e => setPlacement(e.target.value)}>
            <option>top</option><option>bottom</option><option>left</option><option>right</option>
          </Select>
        </Field>
        <Field label="content"><Input value={content} onChange={e => setContent(e.target.value)} /></Field>
      </Knobs>
      <div className="pt-variant-frame" style={{ minHeight: 100, justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
        <Tooltip content={content} placement={placement}>
          <Button variant="secondary">Hover me</Button>
        </Tooltip>
      </div>
    </>
  )
}

function BannerKnobs() {
  const [level, setLevel]       = useState('info')
  const [title, setTitle]       = useState('Heads up')
  const [message, setMessage]   = useState('The Reading Information System rolls out next Monday.')
  const [hasAction, setAction]  = useState(false)
  const [hasDismiss, setDismiss] = useState(true)
  return (
    <>
      <Knobs>
        <Field label="level">
          <Select value={level} onChange={e => setLevel(e.target.value)}>
            <option>info</option><option>success</option><option>warning</option><option>error</option>
          </Select>
        </Field>
        <Field label="title"><Input value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <Field label="message"><Input value={message} onChange={e => setMessage(e.target.value)} /></Field>
        <Field label="action"><Toggle checked={hasAction} onChange={setAction} /></Field>
        <Field label="dismiss"><Toggle checked={hasDismiss} onChange={setDismiss} /></Field>
      </Knobs>
      <Banner
        level={level}
        title={title}
        action={hasAction ? <Button variant="secondary" size="sm">View</Button> : undefined}
        onDismiss={hasDismiss ? () => {} : undefined}
      >
        {message}
      </Banner>
    </>
  )
}

function StatCardKnobs() {
  const [value, setValue]   = useState('71')
  const [unit, setUnit]     = useState('')
  const [label, setLabel]   = useState('Reading Motivation Index')
  const [footer, setFooter] = useState('↑ 7 pts since Sep 2024')
  const [color, setColor]   = useState('#0F172A')
  const [footerColor, setFc] = useState('#94A3B8')
  return (
    <>
      <Knobs>
        <Field label="value"><Input value={value} onChange={e => setValue(e.target.value)} /></Field>
        <Field label="unit"><Input value={unit} onChange={e => setUnit(e.target.value)} placeholder="/40" /></Field>
        <Field label="label"><Input value={label} onChange={e => setLabel(e.target.value)} /></Field>
        <Field label="footer"><Input value={footer} onChange={e => setFooter(e.target.value)} /></Field>
        <Field label="color"><input className="pt-color" type="color" value={color} onChange={e => setColor(e.target.value)} /></Field>
        <Field label="footerColor"><input className="pt-color" type="color" value={footerColor} onChange={e => setFc(e.target.value)} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <StatCard value={value} unit={unit || undefined} label={label} footer={footer} color={color} footerColor={footerColor} />
      </div>
    </>
  )
}

function HealthStatKnobs() {
  const [bucket, setBucket] = useState('motivation')
  const [score, setScore]   = useState('71')
  const [delta, setDelta]   = useState('7')
  const [clickable, setClickable] = useState(true)
  const section = SECTIONS.find(s => s.key === bucket)
  return (
    <>
      <Knobs>
        <Field label="bucket">
          <Select value={bucket} onChange={e => setBucket(e.target.value)}>
            <option>motivation</option><option>integrity</option><option>habits</option><option>skills</option>
          </Select>
        </Field>
        <Field label="score"><Input type="number" value={score} onChange={e => setScore(e.target.value)} /></Field>
        <Field label="delta"><Input type="number" value={delta} onChange={e => setDelta(e.target.value)} /></Field>
        <Field label="clickable"><Toggle checked={clickable} onChange={setClickable} /></Field>
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
  const [level, setLevel]   = useState('critical')
  const [school, setSchool] = useState('Lincoln Elementary')
  const [title, setTitle]   = useState('Stuck Lexile plateau — 6 weeks, no growth')
  const [hasAction, setAction] = useState(true)
  return (
    <>
      <Knobs>
        <Field label="level">
          <Select value={level} onChange={e => setLevel(e.target.value)}>
            <option>critical</option><option>warning</option><option>positive</option><option>info</option>
          </Select>
        </Field>
        <Field label="school"><Input value={school} onChange={e => setSchool(e.target.value)} /></Field>
        <Field label="title"><Input value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <Field label="action"><Toggle checked={hasAction} onChange={setAction} /></Field>
      </Knobs>
      <AlertRow
        level={level}
        school={school}
        title={title}
        action={hasAction ? 'Review' : undefined}
        onAction={hasAction ? () => {} : undefined}
      />
    </>
  )
}

function HeroKnobs() {
  const [mode, setMode]       = useState('bucket')
  const [bucket, setBucket]   = useState('motivation')
  const [title, setTitle]     = useState('Lincoln Elementary')
  const [subtitle, setSubtitle] = useState('K–5 · 1,650 students')
  const [initials, setInitials] = useState('LE')
  const [accent, setAccent]   = useState('#E8866A')
  const [score, setScore]     = useState('71')
  const [delta, setDelta]     = useState('7')

  if (mode === 'bucket') {
    return (
      <>
        <Knobs>
          <Field label="mode">
            <Select value={mode} onChange={e => setMode(e.target.value)}>
              <option value="bucket">bucket (auto)</option>
              <option value="avatar">avatar (overview)</option>
              <option value="icon">icon (page)</option>
            </Select>
          </Field>
          <Field label="bucket">
            <Select value={bucket} onChange={e => setBucket(e.target.value)}>
              <option>motivation</option><option>integrity</option><option>habits</option><option>skills</option>
            </Select>
          </Field>
          <Field label="score"><Input type="number" value={score} onChange={e => setScore(e.target.value)} /></Field>
          <Field label="delta"><Input type="number" value={delta} onChange={e => setDelta(e.target.value)} /></Field>
        </Knobs>
        <Hero bucket={bucket} score={Number(score)} delta={Number(delta)} />
      </>
    )
  }
  if (mode === 'avatar') {
    return (
      <>
        <Knobs>
          <Field label="mode">
            <Select value={mode} onChange={e => setMode(e.target.value)}>
              <option value="bucket">bucket (auto)</option>
              <option value="avatar">avatar (overview)</option>
              <option value="icon">icon (page)</option>
            </Select>
          </Field>
          <Field label="initials"><Input value={initials} onChange={e => setInitials(e.target.value.slice(0, 2))} /></Field>
          <Field label="title"><Input value={title} onChange={e => setTitle(e.target.value)} /></Field>
          <Field label="subtitle"><Input value={subtitle} onChange={e => setSubtitle(e.target.value)} /></Field>
          <Field label="accent"><input className="pt-color" type="color" value={accent} onChange={e => setAccent(e.target.value)} /></Field>
        </Knobs>
        <Hero initials={initials} title={title} subtitle={subtitle} accent={accent} />
      </>
    )
  }
  // icon mode
  const motIcon = SECTIONS.find(s => s.key === 'motivation')?.icon
  return (
    <>
      <Knobs>
        <Field label="mode">
          <Select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="bucket">bucket (auto)</option>
            <option value="avatar">avatar (overview)</option>
            <option value="icon">icon (page)</option>
          </Select>
        </Field>
        <Field label="title"><Input value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <Field label="subtitle"><Input value={subtitle} onChange={e => setSubtitle(e.target.value)} /></Field>
        <Field label="accent"><input className="pt-color" type="color" value={accent} onChange={e => setAccent(e.target.value)} /></Field>
      </Knobs>
      <Hero icon={motIcon} title={title} subtitle={subtitle} accent={accent} />
    </>
  )
}

// ── Chart fixtures + chart-card showcase pieces ──────────────────────────
const CHART_TREND = [
  { month: 'Sep', school: 64, district: 68 },
  { month: 'Oct', school: 65, district: 69 },
  { month: 'Nov', school: 67, district: 71 },
  { month: 'Dec', school: 66, district: 70 },
  { month: 'Jan', school: 68, district: 72 },
  { month: 'Feb', school: 69, district: 74 },
  { month: 'Mar', school: 68, district: 73 },
  { month: 'Apr', school: 70, district: 75 },
  { month: 'May', school: 71, district: 76 },
]

// Imports for the chart components live at top — re-export shortcuts here
// (declared lazily so we don't blow up the import block at the very top)

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
          <div className="pt-sidebar-sub">Shared components used across every prototype</div>
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
            <TabsKnobs />
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
            id="icon-button"
            title="IconButton"
            desc={<>Square button with just an icon. Variants: <code>primary</code>, <code>secondary</code>, <code>ghost</code>, <code>danger</code>. Sizes: <code>sm</code>, <code>md</code>, <code>lg</code>. Always pair with an <code>aria-label</code>.</>}
          >
            <IconButtonKnobs />
          </Section>

          <Section
            id="divider"
            title="Divider"
            desc={<>Horizontal rule. Optional <code>label</code> to render an "OR" style separator. <code>orientation="vertical"</code> for a thin column divider that stretches to its flex parent.</>}
          >
            <div className="pt-variant-frame">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 13, color: '#64748B' }}>Default</span>
                <Divider />
                <span style={{ fontSize: 13, color: '#64748B' }}>With label</span>
                <Divider label="OR" />
                <span style={{ fontSize: 13, color: '#64748B' }}>Vertical (in a flex row)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#475569' }}>
                  <span>Left</span>
                  <Divider orientation="vertical" />
                  <span>Right</span>
                  <Divider orientation="vertical" />
                  <span>Far right</span>
                </div>
              </div>
            </div>
          </Section>

          <Section
            id="spinner"
            title="Spinner"
            desc={<>Animated loading indicator. Sizes <code>xs / sm / md / lg / xl</code>. Inherits current color or set explicitly via <code>color</code>.</>}
          >
            <SpinnerKnobs />
          </Section>

          <Section
            id="tooltip"
            title="Tooltip (hover)"
            desc={<>Lightweight hover tooltip. Different from the chart tooltips above — this is for explaining icon buttons / labels. <code>placement</code>: top / bottom / left / right.</>}
          >
            <TooltipKnobs />
          </Section>

          <Section
            id="banner"
            title="Banner"
            desc={<>Page-level alert / banner. Levels: <code>info</code>, <code>success</code>, <code>warning</code>, <code>error</code>. Optional <code>title</code>, <code>action</code>, <code>onDismiss</code>.</>}
          >
            <BannerKnobs />
          </Section>

          <Section
            id="breadcrumb"
            title="Breadcrumb"
            desc={<>Navigation crumbs. Pass <code>items</code> as <code>{'[{ label, href? }]'}</code> — the last item is treated as the current page and rendered without a link.</>}
          >
            <div className="pt-variant-frame">
              <Breadcrumb items={[
                { label: 'Schools', href: '#' },
                { label: 'Lincoln Elementary', href: '#' },
                { label: 'Motivation' },
              ]} />
            </div>
          </Section>

          <Section
            id="accordion"
            title="Accordion"
            desc={<>Expand/collapse list. Pass <code>items</code> as <code>{'[{ id, title, content }]'}</code>. <code>allowMultiple</code> lets multiple sections open at once; <code>defaultOpen</code> pre-opens by id.</>}
          >
            <Accordion
              defaultOpen={['a']}
              items={[
                { id: 'a', title: 'What is the Reading Motivation Index?', content: <>The RMI is a composite score 0–100 derived from ten survey factors (five intrinsic, five extrinsic) collected three times a year.</> },
                { id: 'b', title: 'How is the Lexile plateau alert triggered?', content: <>When a school's average Lexile growth is below 5% of the expected annual gain across 6 consecutive weeks despite engagement above 85%.</> },
                { id: 'c', title: 'Can I export this dashboard?', content: <>Yes — use the kebab menu in the top-right of any chart to export a PNG or CSV.</> },
              ]}
            />
          </Section>

          <Section
            id="empty-state"
            title="EmptyState"
            desc={<>Empty-list placeholder. Props: <code>icon</code>, <code>title</code>, <code>description</code>, <code>action</code>.</>}
          >
            <div className="pt-variant-frame">
              <EmptyState
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="16" y1="16" x2="21" y2="21" />
                  </svg>
                }
                title="No students to watch"
                description="Students appear here when they trip a habit, integrity, or skill alert. Adjust your thresholds to see more."
                action={<Button variant="secondary">Set thresholds</Button>}
              />
            </div>
          </Section>

          <Section
            id="skeleton"
            title="Skeleton"
            desc={<>Animated loading placeholder. <code>width</code>, <code>height</code>, <code>shape</code> (rect/circle), or <code>lines</code> for a multi-row text placeholder.</>}
          >
            <SkeletonKnobs />
            <Variant label="composed example (avatar + meta + button)">
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: 14, display: 'flex', gap: 16, alignItems: 'center' }}>
                <Skeleton shape="circle" width={44} height={44} />
                <div style={{ flex: 1 }}>
                  <Skeleton width="35%" height={14} />
                  <div style={{ height: 6 }} />
                  <Skeleton width="60%" height={12} />
                </div>
                <Skeleton width={64} height={26} />
              </div>
            </Variant>
          </Section>

          <Section
            id="section-heading"
            title="SectionHeading"
            desc={<>Recurring h3 + optional subtitle + optional right-side action. Used as the header inside content sections / cards.</>}
          >
            <div className="pt-variant-frame">
              <SectionHeading
                title="Students to Watch"
                subtitle="Last 30 days · 4 students flagged"
                action={<Button variant="ghost" size="sm">View all →</Button>}
              />
            </div>
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
            id="chart-line"
            title="Line chart"
            desc={<>Nivo <code>ResponsiveLine</code> + <code>SliceTooltip</code> wrapped in a <code>ChartCard</code>. Pattern used for trend charts across the dashboard, motivation, integrity, and habits pages.</>}
          >
            <ChartCard
              title="RMI Trend — Lincoln vs. District"
              subtitle="Sep 2024 – May 2025"
              icon={SECTIONS.find(s => s.key === 'motivation')?.icon}
              accent="#E8866A"
              footer={<ChartLegend items={[
                { color: '#E8866A', label: 'Lincoln' },
                { color: '#CBD5E1', label: 'District avg', dashed: true },
              ]} />}
            >
              <div style={{ height: 220 }}>
                <ResponsiveLine
                  data={[
                    { id: 'Lincoln',      color: '#E8866A', data: CHART_TREND.map(d => ({ x: d.month, y: d.school })) },
                    { id: 'District avg', color: '#CBD5E1', data: CHART_TREND.map(d => ({ x: d.month, y: d.district })) },
                  ]}
                  theme={NIVO_THEME}
                  margin={LINE_MARGIN}
                  xScale={{ type: 'point' }}
                  yScale={{ type: 'linear', min: 55, max: 90 }}
                  curve="monotoneX"
                  colors={d => d.color}
                  lineWidth={2.5}
                  enablePoints={false}
                  enableArea
                  areaOpacity={0.08}
                  enableGridX={false}
                  axisBottom={AXIS_BOTTOM}
                  axisLeft={{ ...AXIS_LEFT, tickValues: [60, 70, 80, 90] }}
                  enableSlices="x"
                  sliceTooltip={({ slice }) => (
                    <SliceTooltip
                      slice={slice}
                      accent="#E8866A"
                      allData={CHART_TREND}
                      seriesMap={{ Lincoln: 'school', 'District avg': 'district' }}
                      formatDelta={d => `${d > 0 ? '+' : ''}${d} pts`}
                    />
                  )}
                />
              </div>
            </ChartCard>
          </Section>

          <Section
            id="chart-bar-grouped"
            title="Grouped bar chart"
            desc={<>Nivo <code>ResponsiveBar</code> with <code>groupMode="grouped"</code> + <code>BarTooltip</code>. Used for "this vs district" or "actual vs expected" comparisons.</>}
          >
            <ChartCard
              title="Intrinsic vs. Extrinsic Motivation"
              subtitle="RMI subscores out of 20"
              icon={SECTIONS.find(s => s.key === 'motivation')?.icon}
              accent="#E8866A"
              footer={<ChartLegend items={[
                { color: '#E8866A', label: 'Intrinsic' },
                { color: '#CBD5E1', label: 'Extrinsic' },
              ]} />}
            >
              <div style={{ height: 190 }}>
                <ResponsiveBar
                  data={[
                    { month: 'Sep', intrinsic: 12.1, extrinsic: 11.4 },
                    { month: 'Oct', intrinsic: 12.4, extrinsic: 11.5 },
                    { month: 'Nov', intrinsic: 12.8, extrinsic: 11.6 },
                    { month: 'Dec', intrinsic: 12.6, extrinsic: 11.5 },
                    { month: 'Jan', intrinsic: 13.1, extrinsic: 11.6 },
                    { month: 'Feb', intrinsic: 13.5, extrinsic: 11.7 },
                    { month: 'Mar', intrinsic: 13.7, extrinsic: 11.6 },
                    { month: 'Apr', intrinsic: 14.0, extrinsic: 11.7 },
                    { month: 'May', intrinsic: 14.2, extrinsic: 11.8 },
                  ]}
                  keys={['intrinsic', 'extrinsic']}
                  indexBy="month"
                  groupMode="grouped"
                  theme={NIVO_THEME}
                  margin={{ top: 8, right: 16, bottom: 36, left: 36 }}
                  padding={0.3}
                  innerPadding={2}
                  colors={({ id }) => id === 'intrinsic' ? '#E8866A' : '#CBD5E1'}
                  borderRadius={3}
                  axisBottom={AXIS_BOTTOM}
                  axisLeft={{ ...AXIS_LEFT, tickValues: [9, 11, 13, 15] }}
                  enableGridY
                  enableLabel={false}
                  minValue={9}
                  maxValue={16}
                  tooltip={({ indexValue, data }) => (
                    <BarTooltip
                      data={data}
                      indexValue={indexValue}
                      accent="#E8866A"
                      format={v => `${v.toFixed(1)} /20`}
                      keys={['intrinsic', 'extrinsic']}
                      labels={{
                        intrinsic: { label: 'Intrinsic', color: '#E8866A' },
                        extrinsic: { label: 'Extrinsic', color: '#CBD5E1' },
                      }}
                    />
                  )}
                />
              </div>
            </ChartCard>
          </Section>

          <Section
            id="chart-bar-h"
            title="Horizontal bar chart"
            desc={<>Nivo <code>ResponsiveBar</code> with <code>layout="horizontal"</code>. Used for school rankings and per-grade growth comparisons.</>}
          >
            <ChartCard
              title="District integrity ranking"
              subtitle="Book Talk completion rate · May 2025"
              icon={SECTIONS.find(s => s.key === 'integrity')?.icon}
              accent="#1D4ED8"
            >
              <div style={{ height: 220 }}>
                <ResponsiveBar
                  data={[
                    { id: 'adams',      name: 'Adams High',     completionRate: 88, isThis: false },
                    { id: 'jefferson',  name: 'Jefferson El.',  completionRate: 82, isThis: false },
                    { id: 'kennedy',    name: 'Kennedy K-8',    completionRate: 77, isThis: false },
                    { id: 'roosevelt',  name: 'Roosevelt Mid.', completionRate: 75, isThis: false },
                    { id: 'lincoln',    name: 'Lincoln El.',    completionRate: 71, isThis: true },
                    { id: 'washington', name: 'Washington Mid.',completionRate: 62, isThis: false },
                  ]}
                  keys={['completionRate']}
                  indexBy="name"
                  layout="horizontal"
                  theme={NIVO_THEME}
                  margin={{ top: 8, right: 32, bottom: 36, left: 100 }}
                  colors={({ data }) => data.isThis ? '#E8866A' : '#CBD5E1'}
                  borderRadius={4}
                  axisBottom={{ ...AXIS_BOTTOM, format: v => `${v}%`, tickValues: [0, 25, 50, 75, 100] }}
                  axisLeft={{ tickSize: 0, tickPadding: 10 }}
                  enableGridY={false}
                  enableLabel={false}
                  maxValue={100}
                  tooltip={({ data }) => (
                    <div className="sdb-tooltip" style={{ '--tip-accent': data.isThis ? '#E8866A' : '#1D4ED8' }}>
                      <div className="sdb-tooltip-header">{data.name}</div>
                      <div className="sdb-tooltip-series" style={{ '--series-color': data.isThis ? '#E8866A' : '#94A3B8' }}>
                        <div className="sdb-tooltip-row">
                          <span className="sdb-tooltip-dot" />
                          <span className="sdb-tooltip-label">Completion rate</span>
                          <span className="sdb-tooltip-val">{data.completionRate}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
            </ChartCard>
          </Section>

          <Section
            id="chart-scatter"
            title="Scatter chart"
            desc={<>Nivo <code>ResponsiveScatterPlot</code> with a highlighted "this school" series and a reference marker. Used on the Skills (Lexile) page.</>}
          >
            <ChartCard
              title="Lexile Growth vs. Reading Volume"
              subtitle="Lincoln highlighted against district peers"
              icon={SECTIONS.find(s => s.key === 'skills')?.icon}
              accent="#7C3AED"
              footer={<ChartLegend items={[
                { color: '#E8866A', label: 'Lincoln' },
                { color: '#CBD5E1', label: 'Other schools' },
                { color: '#D97706', label: 'Expected (+65L)', dashed: true },
              ]} />}
            >
              <div style={{ height: 260 }}>
                <ResponsiveScatterPlot
                  data={[
                    {
                      id: 'This school',
                      data: [{ x: 41, y: 8, school: 'Lincoln', students: 1650, sid: 'lincoln' }],
                    },
                    {
                      id: 'Other schools',
                      data: [
                        { x: 38, y: 62, school: 'Jefferson', students: 1820, sid: 'jefferson' },
                        { x: 35, y: 74, school: 'Kennedy',   students: 2340, sid: 'kennedy' },
                        { x: 28, y: 88, school: 'Roosevelt', students: 2100, sid: 'roosevelt' },
                        { x: 24, y: 22, school: 'Washington',students: 1980, sid: 'washington' },
                        { x: 22, y: 112,school: 'Adams',     students: 2510, sid: 'adams' },
                      ],
                    },
                  ]}
                  theme={NIVO_THEME}
                  margin={{ top: 16, right: 28, bottom: 50, left: 56 }}
                  xScale={{ type: 'linear', min: 15, max: 50 }}
                  yScale={{ type: 'linear', min: 0, max: 130 }}
                  colors={({ serieId }) => serieId === 'This school' ? '#E8866A' : '#CBD5E1'}
                  nodeSize={d => Math.sqrt(d.data.students / 5)}
                  axisBottom={{ ...AXIS_BOTTOM, legend: 'Avg books/month', legendOffset: 38, legendPosition: 'middle' }}
                  axisLeft={{ ...AXIS_LEFT, format: v => `${v}L`, legend: 'Lexile growth', legendOffset: -44, legendPosition: 'middle' }}
                  enableGridX={false}
                  markers={[{
                    axis: 'y', value: 65,
                    lineStyle: { stroke: '#D97706', strokeDasharray: '4 3', strokeWidth: 1.5 },
                  }]}
                  tooltip={({ node }) => (
                    <div className="sdb-tooltip" style={{ '--tip-accent': node.data.sid === 'lincoln' ? '#E8866A' : '#475569' }}>
                      <div className="sdb-tooltip-header">{node.data.school}</div>
                      <div className="sdb-tooltip-series" style={{ '--series-color': node.data.sid === 'lincoln' ? '#E8866A' : '#94A3B8' }}>
                        <div className="sdb-tooltip-row">
                          <span className="sdb-tooltip-dot" />
                          <span className="sdb-tooltip-label">Lexile growth</span>
                          <span className="sdb-tooltip-val">+{node.data.y}L</span>
                        </div>
                      </div>
                      <div className="sdb-tooltip-context">{node.data.students.toLocaleString()} students</div>
                    </div>
                  )}
                />
              </div>
            </ChartCard>
          </Section>

          <Section
            id="stat-card"
            title="StatCard"
            desc={<>Small metric tile shown in a row at the top of a bucket page. Props: <code>value</code>, <code>unit</code>, <code>label</code>, <code>footer</code>, <code>color</code>, <code>footerColor</code>.</>}
          >
            <StatCardKnobs />
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
            <HealthStatKnobs />
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
            <AlertRowKnobs />
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
            desc={<>One unified page header. <code>mode</code> picks between the three shapes: <code>bucket</code> (auto-derive icon/title/accent from SECTIONS + right-side score), <code>avatar</code> (overview-style), and <code>icon</code> (analytics-style with subtitle).</>}
          >
            <HeroKnobs />
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
