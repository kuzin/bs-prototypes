import { useState, useEffect, useRef, useSyncExternalStore, Fragment } from 'react'
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
import { PrototypeNav } from '../PrototypeNav'
import { Sidebar, SchoolPicker } from '../ris/components/Sidebar'
import { Button } from '../ris/components/Button'
import { Tabs } from '../ris/components/Tabs'
import { Flyout } from '../ris/components/Flyout'
import { Modal } from '../ris/components/Modal'
import { Table } from '../ris/components/Table'
import { Avatar } from '../ris/components/Avatar'
import { Pill } from '../ris/components/Pill'
import { ProgressBar } from '../ris/components/ProgressBar'
import { BarList } from '../ris/components/BarList'
import { Funnel } from '../ris/components/Funnel'
import { BackBar } from '../BackBar'
import { Toggle } from '../ris/components/Toggle'
import {
  Field, Input, Select, Textarea, Checkbox, RadioGroup, Radio,
  CheckboxGroup, CheckboxGroupItem,
  MultiSelect, NumberInput, RangeSlider,
  DateInput, TimeInput, ColorInput, FileInput,
} from '../ris/components/Form'
import { CustomSelect } from '../ris/components/CustomSelect'
import { FilterBar, FilterItem } from '../ris/components/FilterBar'
import { DatePicker } from '../ris/components/DatePicker'
import { TimePicker } from '../ris/components/TimePicker'
import {
  Divider, Spinner, IconButton, Tooltip, Banner,
  Breadcrumb, Accordion, EmptyState, Skeleton, SectionHeading,
} from '../ris/components/Primitives'
import { RMI_ICONS } from '../ris/components/RmiIcons'
import { RMI_FACTORS } from '../ris/data'

// Global resets + Nunito font on body (needed for Radix portals outside .pt-shell)
import '../ris/index.css'

// Bring in CSS for the components so they render properly here
import '../ris/components/Cards.css'
import '../ris/components/SchoolDashboard.css'
import '../ris/components/ReadingHealth.css'
import '../ris/components/AlertsBanner.css'
import '../ris/components/Hero.css'
import '../BackBar.css'
import '../ris/components/Sidebar.css'
import '../ris/components/Toggle.css'
import '../ris/components/Form.css'
import '../ris/components/FilterBar.css'
import '../ris/components/Primitives.css'
import '../ris/components/BarList.css'
import '../ris/components/Funnel.css'

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
  { group: 'Forms',     id: 'radio',          name: 'RadioGroup' },
  { group: 'Forms',     id: 'checkbox-group', name: 'CheckboxGroup' },
  { group: 'Forms',     id: 'multi-select',   name: 'MultiSelect' },
  { group: 'Forms',     id: 'number-input',   name: 'NumberInput' },
  { group: 'Forms',     id: 'range-slider',   name: 'RangeSlider' },
  { group: 'Forms',     id: 'date-input',     name: 'Date' },
  { group: 'Forms',     id: 'time-input',     name: 'Time' },
  { group: 'Forms',     id: 'color-input',    name: 'ColorInput' },
  { group: 'Forms',     id: 'file-input',     name: 'FileInput' },
  { group: 'Forms',     id: 'custom-select',  name: 'CustomSelect' },
  { group: 'Forms',     id: 'filter-bar',     name: 'FilterBar' },
  { group: 'Forms',     id: 'field-form',     name: 'Field / Form' },
  { group: 'Charts',    id: 'stat-card',    name: 'StatCard' },
  { group: 'Charts',    id: 'chart-card',   name: 'ChartCard' },
  { group: 'Charts',    id: 'card-note',    name: 'CardNote' },
  { group: 'Charts',    id: 'chart-line',   name: 'Line chart' },
  { group: 'Charts',    id: 'chart-bar-grouped', name: 'Grouped bar' },
  { group: 'Charts',    id: 'chart-bar-h',  name: 'Horizontal bar' },
  { group: 'Charts',    id: 'chart-scatter', name: 'Scatter' },
  { group: 'Charts',    id: 'chart-legend', name: 'ChartLegend' },
  { group: 'Charts',    id: 'bar-list',     name: 'BarList' },
  { group: 'Charts',    id: 'funnel',       name: 'Funnel' },
  { group: 'Charts',    id: 'tooltips',     name: 'Tooltips' },
  { group: 'Domain',    id: 'health-stat',  name: 'HealthStat' },
  { group: 'Domain',    id: 'reading-health', name: 'ReadingHealth' },
  { group: 'Domain',    id: 'alert-row',    name: 'AlertRow' },
  { group: 'Domain',    id: 'alerts-banner', name: 'AlertsBanner' },
  { group: 'Layout',    id: 'hero',         name: 'Hero' },
  { group: 'Layout',    id: 'back-bar',     name: 'BackBar' },
  { group: 'Layout',    id: 'sidebar',      name: 'Sidebar' },
  { group: 'Layout',    id: 'prototype-nav', name: 'PrototypeNav' },
  { group: 'Layout',    id: 'rmi-icons',    name: 'RMI Icons' },
  { group: 'Layout',    id: 'health-icons', name: 'Health Icons' },
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
  { id: '1', level: 'critical', title: 'Lincoln Elementary', description: 'Stuck Lexile plateau — 6 weeks, no growth', action: 'Review', tab: 'skills' },
  { id: '2', level: 'warning',  title: 'Washington Middle',  description: 'Student engagement down 39% vs. last month', action: 'View habits', tab: 'habits' },
  { id: '3', level: 'positive', title: 'Adams High',         description: '+65% increase in avg session length',        action: 'View details', tab: 'habits' },
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

// Tiny icons for menu items
const EditIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.5 2.5l2 2L6 12l-3 1 1-3 7.5-7.5z" />
  </svg>
)
const DuplicateIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="9" height="9" rx="1.5" />
    <path d="M3 11V4a1 1 0 0 1 1-1h7" />
  </svg>
)
const ArchiveIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="12" height="3" rx="0.5" />
    <path d="M3 6v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6" />
    <line x1="6.5" y1="9" x2="9.5" y2="9" />
  </svg>
)
const TrashIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h10" />
    <path d="M5.5 4V3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1" />
    <path d="M4.5 4l.6 9a1 1 0 0 0 1 1h3.8a1 1 0 0 0 1-1l.6-9" />
  </svg>
)
const MoreIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <circle cx="3.5" cy="8" r="1.4" />
    <circle cx="8" cy="8" r="1.4" />
    <circle cx="12.5" cy="8" r="1.4" />
  </svg>
)

function FlyoutKnobs() {
  const [size, setSize]   = useState('md')
  const [withIcons, setIcons] = useState(true)
  const [placement, setPlacement] = useState('bottom-start')
  return (
    <>
      <Knobs>
        <Field label="button size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        <Field label="placement">
          <Select value={placement} onChange={e => setPlacement(e.target.value)}>
            <option>auto</option><option>bottom-start</option><option>bottom-end</option><option>top-start</option><option>top-end</option>
          </Select>
        </Field>
        <Field label="icons in menu"><Toggle checked={withIcons} onChange={setIcons} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Flyout
          placement={placement}
          trigger={({ open, toggle }) => (
            <Button variant="secondary" size={size} iconRight={<CaretIcon />} onClick={toggle} aria-expanded={open}>
              Actions
            </Button>
          )}
        >
          {({ close }) => (
            <div className="flyout-menu" style={{ minWidth: 180 }}>
              <button className="flyout-menu-item" onClick={close}>
                {withIcons && <span className="flyout-menu-icon"><EditIcon /></span>}
                Edit
              </button>
              <button className="flyout-menu-item" onClick={close}>
                {withIcons && <span className="flyout-menu-icon"><DuplicateIcon /></span>}
                Duplicate
              </button>
              <button className="flyout-menu-item" onClick={close}>
                {withIcons && <span className="flyout-menu-icon"><ArchiveIcon /></span>}
                Archive
              </button>
              <div className="flyout-menu-sep" />
              <button className="flyout-menu-item flyout-menu-item--danger" onClick={close}>
                {withIcons && <span className="flyout-menu-icon"><TrashIcon /></span>}
                Delete
              </button>
            </div>
          )}
        </Flyout>
      </div>
    </>
  )
}

function FlyoutShowcase() {
  return (
    <div className="pt-variants pt-variants--2">

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

      <Variant label="overflow menu (3+ actions collapse into More)">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button variant="primary" size="sm">Review</Button>
          <Button variant="secondary" size="sm">Snooze</Button>
          <Flyout
            placement="bottom-end"
            trigger={({ open, toggle }) => (
              <IconButton
                variant="secondary"
                size="sm"
                aria-label="More actions"
                aria-expanded={open}
                onClick={toggle}
              >
                <MoreIcon />
              </IconButton>
            )}
          >
            {({ close }) => (
              <div className="flyout-menu" style={{ minWidth: 180 }}>
                <button className="flyout-menu-item" onClick={close}>
                  <span className="flyout-menu-icon"><EditIcon /></span>
                  Edit
                </button>
                <button className="flyout-menu-item" onClick={close}>
                  <span className="flyout-menu-icon"><DuplicateIcon /></span>
                  Duplicate
                </button>
                <button className="flyout-menu-item" onClick={close}>
                  <span className="flyout-menu-icon"><ArchiveIcon /></span>
                  Archive
                </button>
                <div className="flyout-menu-sep" />
                <button className="flyout-menu-item flyout-menu-item--danger" onClick={close}>
                  <span className="flyout-menu-icon"><TrashIcon /></span>
                  Delete
                </button>
              </div>
            )}
          </Flyout>
        </div>
      </Variant>
    </div>
  )
}

const DEFAULT_MODAL_BODY = `Once deleted, this challenge and its logged minutes won't appear in any reports or student dashboards. You can still see it in the audit log for 30 days.

If you only want to pause logging without losing data, archive the challenge instead.`

function CloseIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="3" x2="11" y2="11" />
      <line x1="11" y1="3" x2="3" y2="11" />
    </svg>
  )
}

function CenteredModalKnobs() {
  const [open, setOpen]         = useState(false)
  const [withClose, setClose]   = useState(true)
  const [withImage, setImage]   = useState(false)
  const [withFooter, setFooter] = useState(true)
  const [destructive, setDest]  = useState(false)
  const [title, setTitle]       = useState('Delete this challenge?')
  const [body, setBody]         = useState(DEFAULT_MODAL_BODY)

  return (
    <>
      <Knobs>
        <Field label="title"><Input value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <Field label="close btn"><Toggle checked={withClose} onChange={setClose} /></Field>
        <Field label="banner image"><Toggle checked={withImage} onChange={setImage} /></Field>
        <Field label="footer"><Toggle checked={withFooter} onChange={setFooter} /></Field>
        <Field label="destructive"><Toggle checked={destructive} onChange={setDest} /></Field>
        <Field label="body" className="pt-knob-full">
          <Textarea rows={3} value={body} onChange={e => setBody(e.target.value)} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Button onClick={() => setOpen(true)}>Open centered modal</Button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} variant="center" ariaLabel={title}>
        {({ close }) => (
          <>
            {withImage && (
              <img
                className="modal-image"
                alt=""
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1040&q=70"
              />
            )}
            {withImage && withClose && (
              <IconButton
                variant="secondary"
                size="sm"
                onClick={close}
                aria-label="Close"
                className="modal-close modal-close--floating"
              >
                <CloseIcon />
              </IconButton>
            )}
            <div className={`modal-header${withImage ? ' modal-header--flush' : ''}`}>
              <div className="modal-header-text">
                <h3 className="modal-title">{title}</h3>
              </div>
              {!withImage && withClose && (
                <IconButton variant="ghost" size="sm" onClick={close} aria-label="Close" className="modal-close">
                  <CloseIcon />
                </IconButton>
              )}
            </div>
            <div className="modal-body">
              {body.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
            </div>
            {withFooter && (
              <div className="modal-footer">
                <Button variant="ghost" onClick={close}>Cancel</Button>
                <Button variant={destructive ? 'danger' : 'primary'} onClick={close}>
                  {destructive ? 'Delete challenge' : 'Confirm'}
                </Button>
              </div>
            )}
          </>
        )}
      </Modal>
    </>
  )
}

const SP_SECTIONS = [
  { id: 'overview',   label: 'Overview',   icon: 'overview',     color: '#475569' },
  { id: 'motivation', label: 'Motivation', icon: 'flame',        color: '#E8866A' },
  { id: 'integrity',  label: 'Integrity',  icon: 'shield',       color: '#1D4ED8' },
  { id: 'habits',     label: 'Habits',     icon: 'habits',       color: '#16A97A' },
  { id: 'skills',     label: 'Skills',     icon: 'book',         color: '#7C3AED' },
]

const SP_EMPTY = {
  overview:   { title: 'No data yet',           description: 'Once this student logs reading sessions, their overview will appear here.' },
  motivation: { title: 'No motivation data',    description: 'Complete the RMI survey to see this student\'s intrinsic and extrinsic scores.' },
  integrity:  { title: 'No Book Talks logged',  description: 'Verification activity for this student will show up after their first Book Talk.' },
  habits:     { title: 'No reading sessions',   description: 'Session length, streaks, and frequency populate after this student starts logging.' },
  skills:     { title: 'No Lexile scores yet',  description: 'Lexile growth requires at least two assessment data points.' },
}

function EmptyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="16" y1="16" x2="21" y2="21" />
    </svg>
  )
}

function SpNavIcon({ name }) {
  const props = { viewBox: '0 0 20 20', fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinecap: 'round', strokeLinejoin: 'round', width: 20, height: 20 }
  switch (name) {
    case 'overview': return (<svg {...props}><circle cx="10" cy="7" r="3"/><path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6"/></svg>)
    case 'flame':    return (<svg {...props}><path d="M10 2c.2 2.2-1.1 3.2-2.3 4.4C6.5 7.6 5 9.1 5 11.5 5 14.5 7.2 17 10 17s5-2.5 5-5.5c0-1.7-.6-2.7-1.4-3.4"/></svg>)
    case 'shield':   return (<svg {...props}><path d="M10 2.5 16 4.5v5.7c0 3.7-2.7 6.7-6 7.6-3.3-.9-6-3.9-6-7.6V4.5z"/><polyline points="7,10 9.2,12.2 13.2,8"/></svg>)
    case 'habits':   return (<svg {...props}><rect x="3" y="4.5" width="14" height="13" rx="1.6"/><line x1="3" y1="8.5" x2="17" y2="8.5"/><line x1="7" y1="2.5" x2="7" y2="5.5"/><line x1="13" y1="2.5" x2="13" y2="5.5"/></svg>)
    case 'book':     return (<svg {...props}><path d="M3 4c0-.6.4-1 1-1h5.5v14H4c-.6 0-1-.4-1-1V4z"/><path d="M17 4c0-.6-.4-1-1-1h-5.5v14H16c.6 0 1-.4 1-1V4z"/><line x1="9.5" y1="3" x2="9.5" y2="17"/></svg>)
    default: return null
  }
}

function SideModalShowcase() {
  const [open, setOpen]   = useState(false)
  const [section, setSection] = useState('overview')
  const empty = SP_EMPTY[section]
  return (
    <div className="pt-variant-frame">
      <Button onClick={() => setOpen(true)}>Open student panel</Button>
      <Modal open={open} onClose={() => setOpen(false)} variant="side" ariaLabel="Marcus Chen — student profile">
        {({ close }) => (
          <div className="sp-shell">
            {/* Left vertical nav (BeanstackProfile-style) */}
            <nav className="sp-nav">
              {SP_SECTIONS.map((s, i) => {
                const active = section === s.id
                return (
                  <Fragment key={s.id}>
                    <button
                      type="button"
                      className={`sp-nav-item${active ? ' sp-nav-item--active' : ''}`}
                      style={active ? { '--nav-active-color': s.color, '--nav-active-bg': `color-mix(in srgb, ${s.color} 12%, white)` } : undefined}
                      onClick={() => setSection(s.id)}
                      title={s.label}
                    >
                      <span className="sp-nav-icon"><SpNavIcon name={s.icon} /></span>
                      <span className="sp-nav-label">{s.label}</span>
                    </button>
                    {i === 0 && <div className="sp-nav-divider" />}
                  </Fragment>
                )
              })}
            </nav>

            {/* Main pane */}
            <div className="sp-pane">
              <div className="sp-pane-header">
                <div className="sp-pane-identity">
                  <Avatar initials="MC" color="#7C3AED" size="md" />
                  <div className="sp-pane-identity-text">
                    <div className="sp-pane-name">Marcus Chen</div>
                    <div className="sp-pane-meta">Grade 5 · Lincoln Elementary</div>
                  </div>
                </div>
                <div className="sp-pane-actions">
                  <Button variant="secondary" size="sm">Log reading</Button>
                  <IconButton variant="ghost" size="sm" onClick={close} aria-label="Close">
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>

              <div className="sp-pane-body">
                <EmptyState
                  icon={<EmptyIcon />}
                  title={empty.title}
                  description={empty.description}
                  action={<Button variant="secondary" size="sm">Get started</Button>}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

const TABLE_ROWS = [
  { id: 'jefferson',  name: 'Jefferson',  rmi: 80, delta:  8, students: 1820 },
  { id: 'lincoln',    name: 'Lincoln',    rmi: 71, delta:  7, students: 1650 },
  { id: 'kennedy',    name: 'Kennedy',    rmi: 77, delta:  7, students: 2340 },
  { id: 'washington', name: 'Washington', rmi: 62, delta:  1, students: 1980 },
  { id: 'adams',      name: 'Adams',      rmi: 83, delta:  9, students: 2510 },
]

function TableKnobs() {
  const [zebra, setZebra]       = useState(false)
  const [compact, setCompact]   = useState(false)
  const [bordered, setBordered] = useState(false)
  const [flush, setFlush]       = useState(false)
  const [sortable, setSortable] = useState(false)
  const [paginate, setPaginate] = useState(false)
  const [clickable, setClick]   = useState(true)
  const [highlight, setHL]      = useState(false)
  const [state, setState]       = useState('data') // data | empty | loading

  const renderDelta = v => (
    <span style={{ color: v >= 0 ? '#16A34A' : '#DC2626', fontWeight: 700 }}>
      {v >= 0 ? '↑' : '↓'} {Math.abs(v)} pts
    </span>
  )

  const columns = [
    { key: 'name',     label: 'School',   sortable },
    { key: 'students', label: 'Students', align: 'right', sortable, render: v => v.toLocaleString() },
    { key: 'rmi',      label: 'RMI',      align: 'right', sortable },
    { key: 'delta',    label: 'YoY',      align: 'right', render: renderDelta },
  ]

  return (
    <>
      <Knobs>
        <Field label="state">
          <Select value={state} onChange={e => setState(e.target.value)}>
            <option value="data">with data</option>
            <option value="empty">empty</option>
            <option value="loading">loading</option>
          </Select>
        </Field>
        <Field label="zebra"><Toggle checked={zebra} onChange={setZebra} /></Field>
        <Field label="compact"><Toggle checked={compact} onChange={setCompact} /></Field>
        <Field label="bordered"><Toggle checked={bordered} onChange={setBordered} /></Field>
        <Field label="flush"><Toggle checked={flush} onChange={setFlush} /></Field>
        <Field label="sortable cols"><Toggle checked={sortable} onChange={setSortable} /></Field>
        <Field label="pagination"><Toggle checked={paginate} onChange={setPaginate} /></Field>
        <Field label="clickable"><Toggle checked={clickable} onChange={setClick} /></Field>
        <Field label="highlight Lincoln"><Toggle checked={highlight} onChange={setHL} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Table
          columns={columns}
          rows={state === 'empty' ? [] : TABLE_ROWS}
          zebra={zebra}
          compact={compact}
          bordered={bordered}
          flush={flush}
          loading={state === 'loading'}
          empty="No schools match the current filter."
          onRowClick={clickable ? () => {} : undefined}
          highlightRow={highlight ? r => r.id === 'lincoln' : undefined}
          pageSize={paginate ? 3 : undefined}
        />
      </div>
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

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,8 7,12 13,4" />
  </svg>
)
const StarIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1.5l1.9 4 4.4.6-3.2 3.1.8 4.3L8 11.4l-4 2.1.8-4.3L1.7 6.1 6.1 5.5z" />
  </svg>
)

function PillKnobs() {
  const [text, setText]       = useState('Skills')
  const [variant, setVariant] = useState('soft')
  const [size, setSize]       = useState('md')
  const [color, setColor]     = useState('#7C3AED')
  const [iconKey, setIconKey] = useState('none')
  const ICONS = { none: null, plus: <PlusIcon />, check: <CheckIcon />, star: <StarIcon /> }
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
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        <Field label="icon">
          <Select value={iconKey} onChange={e => setIconKey(e.target.value)}>
            <option value="none">none</option>
            <option value="plus">plus</option>
            <option value="check">check</option>
            <option value="star">star</option>
          </Select>
        </Field>
        <Field label="color">
          <input className="pt-color" type="color" value={color} onChange={e => setColor(e.target.value)} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--row">
        <Pill color={color} variant={variant} size={size} icon={ICONS[iconKey]}>{text}</Pill>
      </div>
    </>
  )
}

const BL_DIET_DATA = [
  { label: 'Sci-Fi & Fantasy',   value: 28, color: '#7C3AED' },
  { label: 'Sports & Adventure', value: 19, color: '#0DA7BC' },
  { label: 'Realistic Fiction',  value: 17, color: '#16A97A' },
  { label: 'Graphic & Manga',    value: 14, color: '#E8866A' },
  { label: 'Mystery & Thriller', value: 11, color: '#F0C050' },
  { label: 'Other',              value: 11, color: '#CBD5E1' },
]
const BL_GRADE_BANDS = ['K–2', '3–5', '6–8', '9–12']

function BarListKnobs() {
  const [variant, setVariant]               = useState('grouped')
  const [showBar, setShowBar]               = useState(true)
  const [layout, setLayout]                 = useState('columns')
  const [showIcon, setShowIcon]             = useState(true)
  const [showSublabel, setShowSublabel]     = useState(true)
  const [showDelta, setShowDelta]           = useState(true)
  const [showValueLabel, setShowValueLabel] = useState(true)
  const [showPrefix, setShowPrefix]         = useState(true)
  const [labelWidth, setLabelWidth]         = useState(0)
  const [barAlign, setBarAlign]             = useState('start')
  const [barHeight, setBarHeight]           = useState(0)

  const intrinsic = RMI_FACTORS.filter(f => f.kind === 'intrinsic')
  const extrinsic = RMI_FACTORS.filter(f => f.kind === 'extrinsic')
  const dietMax   = Math.max(...BL_DIET_DATA.map(d => d.value))

  const factorItem = f => ({
    icon:       showIcon       ? RMI_ICONS[f.iconKey]   : undefined,
    iconColor:  f.color,
    label:      f.name,
    sublabel:   showSublabel   ? f.desc                 : undefined,
    value:      f.score,
    max:        f.max,
    color:      f.color,
    valueLabel: showValueLabel ? String(f.score)        : undefined,
    delta:      showDelta      ? f.delta                : undefined,
  })

  const sharedBarProps = {
    showBar,
    labelWidth: labelWidth || undefined,
    barAlign:   barAlign  === 'center' ? 'center' : undefined,
    barHeight:  barHeight || undefined,
  }

  let body
  if (variant === 'simple') {
    body = (
      <BarList
        {...sharedBarProps}
        items={BL_DIET_DATA.map(d => ({
          label: d.label,
          value: d.value,
          max:   dietMax,
          color: d.color,
          valueLabel: showValueLabel ? `${d.value}%` : undefined,
        }))}
      />
    )
  } else if (variant === 'grouped') {
    body = (
      <BarList
        {...sharedBarProps}
        layout={layout}
        groups={[
          { label: 'Intrinsic', labelColor: '#E8866A', items: intrinsic.map(factorItem) },
          { label: 'Extrinsic', labelColor: '#7CB5F5', items: extrinsic.map(factorItem) },
        ]}
      />
    )
  } else {
    body = (
      <BarList
        {...sharedBarProps}
        items={intrinsic.slice(0, 4).map((f, i) => ({
          prefix: showPrefix ? BL_GRADE_BANDS[i] : undefined,
          ...factorItem(f),
        }))}
      />
    )
  }

  return (
    <>
      <Knobs>
        <Field label="variant">
          <Select value={variant} onChange={e => setVariant(e.target.value)}>
            <option value="simple">simple</option>
            <option value="grouped">grouped</option>
            <option value="iconList">iconList</option>
          </Select>
        </Field>
        <Field label="showBar"><Toggle checked={showBar} onChange={setShowBar} /></Field>
        {variant === 'grouped' && (
          <Field label="layout">
            <Select value={layout} onChange={e => setLayout(e.target.value)}>
              <option value="stack">stack</option>
              <option value="columns">columns</option>
            </Select>
          </Field>
        )}
        {variant !== 'simple' && <Field label="showIcon"><Toggle checked={showIcon} onChange={setShowIcon} /></Field>}
        {variant !== 'simple' && <Field label="showSublabel"><Toggle checked={showSublabel} onChange={setShowSublabel} /></Field>}
        {variant !== 'simple' && <Field label="showDelta"><Toggle checked={showDelta} onChange={setShowDelta} /></Field>}
        {variant === 'iconList' && <Field label="showPrefix"><Toggle checked={showPrefix} onChange={setShowPrefix} /></Field>}
        <Field label="showValueLabel"><Toggle checked={showValueLabel} onChange={setShowValueLabel} /></Field>
        <Field label="labelWidth (0 = auto)">
          <Input type="number" min="0" max="240" value={labelWidth} onChange={e => setLabelWidth(Number(e.target.value))} />
        </Field>
        <Field label="barAlign">
          <Select value={barAlign} onChange={e => setBarAlign(e.target.value)}>
            <option value="start">start</option>
            <option value="center">center (funnel)</option>
          </Select>
        </Field>
        <Field label="barHeight (0 = default 6px)">
          <Input type="number" min="0" max="48" value={barHeight} onChange={e => setBarHeight(Number(e.target.value))} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <ChartCard
          title={variant === 'simple' ? 'Reading Diet Breakdown' : variant === 'grouped' ? 'RMI Factor Breakdown' : 'Top Factor by Grade Band'}
          subtitle={variant === 'simple' ? 'Genre distribution' : variant === 'grouped' ? 'All 10 factors · scored 1–4' : 'What drives readers most'}
          accent={variant === 'simple' ? '#7C3AED' : '#E8866A'}
          bodyPad="padded"
          span={variant === 'iconList' ? 1 : 2}
        >
          {body}
        </ChartCard>
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
  const [size, setSize]       = useState('md')
  const [active, setActive]   = useState('daily')
  const [accent, setAccent]   = useState('#1D4ED8')
  const [showCount, setCount] = useState(true)
  const [showIcon,  setIcon]  = useState(false)
  const [withDisabled, setDis] = useState(false)
  const items = [
    { id: 'daily',   label: 'Daily Reading',  icon: showIcon ? <PlusIcon /> : undefined },
    { id: 'roster',  label: 'Students', count: showCount ? 24 : undefined },
    { id: 'rewards', label: 'Earned Rewards' },
    ...(withDisabled ? [{ id: 'locked', label: 'Locked tab', disabled: true }] : []),
  ]
  return (
    <>
      <Knobs>
        <Field label="variant">
          <Select value={variant} onChange={e => setVariant(e.target.value)}>
            <option>underline</option><option>pill</option>
          </Select>
        </Field>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        <Field label="accent"><input className="pt-color" type="color" value={accent} onChange={e => setAccent(e.target.value)} /></Field>
        <Field label="active">
          <Select value={active} onChange={e => setActive(e.target.value)}>
            {items.filter(i => !i.disabled).map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
          </Select>
        </Field>
        <Field label="count"><Toggle checked={showCount} onChange={setCount} /></Field>
        <Field label="icon"><Toggle checked={showIcon} onChange={setIcon} /></Field>
        <Field label="disabled"><Toggle checked={withDisabled} onChange={setDis} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Tabs
          variant={variant}
          size={size}
          accent={accent}
          active={active}
          onChange={setActive}
          items={items}
        />
      </div>
    </>
  )
}

function IconButtonKnobs() {
  const [variant, setVariant]   = useState('secondary')
  const [size, setSize]         = useState('md')
  const [iconKey, setIconKey]   = useState('plus')
  const [disabled, setDisabled] = useState(false)
  const ICONS = {
    plus:      { node: <PlusIcon />,      label: 'Add' },
    caret:     { node: <CaretIcon />,     label: 'Open menu' },
    edit:      { node: <EditIcon />,      label: 'Edit' },
    trash:     { node: <TrashIcon />,     label: 'Delete' },
    archive:   { node: <ArchiveIcon />,   label: 'Archive' },
    duplicate: { node: <DuplicateIcon />, label: 'Duplicate' },
    more:      { node: <MoreIcon />,      label: 'More actions' },
    check:     { node: <CheckIcon />,     label: 'Confirm' },
  }
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
        <Field label="icon">
          <Select value={iconKey} onChange={e => setIconKey(e.target.value)}>
            {Object.keys(ICONS).map(k => <option key={k} value={k}>{k}</option>)}
          </Select>
        </Field>
        <Field label="disabled"><Toggle checked={disabled} onChange={setDisabled} /></Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--row">
        <IconButton variant={variant} size={size} disabled={disabled} aria-label={ICONS[iconKey].label}>
          {ICONS[iconKey].node}
        </IconButton>
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
  const isCircle = shape === 'circle'
  return (
    <>
      <Knobs>
        <Field label="shape">
          <RadioGroup name="skel-shape" value={shape} onChange={v => { setShape(v); if (v === 'circle') { setWidth('44'); setHeight('44') } }}>
            <Radio value="rect">rect</Radio>
            <Radio value="circle">circle</Radio>
          </RadioGroup>
        </Field>
        <Field label="width"><Input value={width} onChange={e => setWidth(e.target.value)} /></Field>
        <Field label="height"><Input value={height} onChange={e => setHeight(e.target.value)} /></Field>
        {!isCircle && (
          <Field label="lines"><Input type="number" value={lines} onChange={e => setLines(e.target.value)} /></Field>
        )}
      </Knobs>
      <div className="pt-variant-frame">
        <Skeleton
          shape={shape}
          width={Number(width) || width}
          height={Number(height) || height}
          lines={!isCircle && Number(lines) > 1 ? Number(lines) : undefined}
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
            <option>auto</option><option>top</option><option>bottom</option><option>left</option><option>right</option>
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

function EmptyStateKnobs() {
  const [title, setTitle]   = useState('No students to watch')
  const [desc, setDesc]     = useState('Students appear here when they trip a habit, integrity, or skill alert. Adjust your thresholds to see more.')
  const [iconKey, setIcon]  = useState('search')
  const [actionText, setActionText] = useState('Set thresholds')
  const [hasAction, setHas] = useState(true)
  const ICONS = {
    search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="16" y1="16" x2="21" y2="21"/></svg>,
    inbox:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13l3-9h12l3 9"/><path d="M3 13v6a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6"/><path d="M3 13h6l1 2h4l1-2h6"/></svg>,
    book:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v15a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2z"/><path d="M4 18a2 2 0 0 1 2-2h13"/></svg>,
    chart:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><rect x="6" y="13" width="3" height="6"/><rect x="11" y="9" width="3" height="10"/><rect x="16" y="5" width="3" height="14"/></svg>,
  }
  return (
    <>
      <Knobs>
        <Field label="title"><Input value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <Field label="icon">
          <Select value={iconKey} onChange={e => setIcon(e.target.value)}>
            <option value="search">search</option>
            <option value="inbox">inbox</option>
            <option value="book">book</option>
            <option value="chart">chart</option>
          </Select>
        </Field>
        <Field label="action"><Toggle checked={hasAction} onChange={setHas} /></Field>
        {hasAction && <Field label="action text"><Input value={actionText} onChange={e => setActionText(e.target.value)} /></Field>}
        <Field label="description" className="pt-knob-full">
          <Textarea rows={2} value={desc} onChange={e => setDesc(e.target.value)} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <EmptyState
          icon={ICONS[iconKey]}
          title={title}
          description={desc}
          action={hasAction ? <Button variant="secondary">{actionText}</Button> : undefined}
        />
      </div>
    </>
  )
}

function AccordionKnobs() {
  const [accent, setAccent]   = useState('#1D4ED8')
  const [multi, setMulti]     = useState(false)
  const [count, setCount]     = useState('3')
  const ITEMS = [
    { id: 'a', title: 'What is the Reading Motivation Index?', content: 'The RMI is a composite score 0–100 derived from ten survey factors (five intrinsic, five extrinsic) collected three times a year.' },
    { id: 'b', title: 'How is the Lexile plateau alert triggered?', content: 'When a school\'s average Lexile growth is below 5% of the expected annual gain across 6 consecutive weeks despite engagement above 85%.' },
    { id: 'c', title: 'Can I export this dashboard?', content: 'Yes — use the kebab menu in the top-right of any chart to export a PNG or CSV.' },
    { id: 'd', title: 'How often is data refreshed?', content: 'Reading logs sync every 15 minutes. Lexile assessments sync nightly. RMI surveys update on the next page load after submission.' },
    { id: 'e', title: 'Who can see flagged students?', content: 'Only users with the District Admin or School Lead role. Teachers see only the students in their own roster.' },
  ]
  const items = ITEMS.slice(0, Number(count) || 3)
  return (
    <>
      <Knobs>
        <Field label="accent"><input className="pt-color" type="color" value={accent} onChange={e => setAccent(e.target.value)} /></Field>
        <Field label="allow multiple"><Toggle checked={multi} onChange={setMulti} /></Field>
        <Field label="items">
          <Select value={count} onChange={e => setCount(e.target.value)}>
            <option>2</option><option>3</option><option>4</option><option>5</option>
          </Select>
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Accordion accent={accent} allowMultiple={multi} defaultOpen={['a']} items={items} />
      </div>
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
  const [level, setLevel]       = useState('critical')
  const [title, setTitle]       = useState('Lincoln Elementary')
  const [description, setDesc]  = useState('Stuck Lexile plateau — 6 weeks, no growth')
  const [action, setActionText] = useState('Review')
  const [hasAction, setHasAction] = useState(true)
  return (
    <>
      <Knobs>
        <Field label="level">
          <Select value={level} onChange={e => setLevel(e.target.value)}>
            <option>critical</option><option>warning</option><option>positive</option><option>info</option>
          </Select>
        </Field>
        <Field label="title"><Input value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <Field label="description"><Input value={description} onChange={e => setDesc(e.target.value)} /></Field>
        <Field label="action"><Toggle checked={hasAction} onChange={setHasAction} /></Field>
        {hasAction && <Field label="action text"><Input value={action} onChange={e => setActionText(e.target.value)} /></Field>}
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

const SIDEBAR_NAV_SETS = {
  ris: {
    label: 'RIS district (7 items + subgroup)',
    subtitle: 'District View',
    items: [
      { id: 'dashboard',    label: 'Overview',     icon: 'overview' },
      { id: 'motivation',   label: 'Motivation',   icon: 'flame',        subgroup: true, section: 'Reading Health' },
      { id: 'integrity',    label: 'Integrity',    icon: 'shield',       subgroup: true, section: 'Reading Health' },
      { id: 'habits',       label: 'Habits',       icon: 'habits',       subgroup: true, section: 'Reading Health' },
      { id: 'skills',       label: 'Skills',       icon: 'book',         subgroup: true, section: 'Reading Health' },
      { id: 'analytics',    label: 'Analytics',    icon: 'analytics',    section: 'Data' },
      { id: 'demographics', label: 'Demographics', icon: 'demographics', section: 'Data' },
    ],
  },
  school: {
    label: 'School view (4 items)',
    subtitle: 'School View',
    items: [
      { id: 'dashboard', label: 'Overview',       icon: 'overview' },
      { id: 'habits',    label: 'Reading Habits', icon: 'habits',   section: 'Reports' },
      { id: 'lexile',    label: 'Lexile Growth',  icon: 'lexile',   section: 'Reports' },
      { id: 'future',    label: 'Future State',   icon: 'future',   section: 'Reports' },
    ],
  },
  minimal: {
    label: 'Minimal (3 items, no subgroup)',
    subtitle: undefined,
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'overview' },
      { id: 'habits',    label: 'Habits',    icon: 'habits',   section: 'Main' },
      { id: 'skills',    label: 'Skills',    icon: 'book',     section: 'Main' },
    ],
  },
}

function SidebarKnobs() {
  const [navSet, setNavSet]     = useState('ris')
  const [active, setActive]     = useState('dashboard')
  const [withPicker, setPicker] = useState(true)
  const [withBadge, setBadge]   = useState(true)
  const [title, setTitle]       = useState('Reading Information System')
  const [subtitle, setSubtitle] = useState('District View')
  const [schoolId, setSchoolId] = useState('lincoln')

  const set = SIDEBAR_NAV_SETS[navSet]
  return (
    <>
      <Knobs>
        <Field label="nav set">
          <Select value={navSet} onChange={e => {
            const next = e.target.value
            setNavSet(next)
            setActive(SIDEBAR_NAV_SETS[next].items[0].id)
            setSubtitle(SIDEBAR_NAV_SETS[next].subtitle || '')
          }}>
            {Object.entries(SIDEBAR_NAV_SETS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </Select>
        </Field>
        <Field label="title"><Input value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <Field label="subtitle"><Input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="(none)" /></Field>
        <Field label="alert badge"><Toggle checked={withBadge} onChange={setBadge} /></Field>
        <Field label="picker"><Toggle checked={withPicker} onChange={setPicker} /></Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--full pt-sidebar-demo">
        <Sidebar
          nav={set.items}
          active={active}
          onNavigate={setActive}
          title={title || undefined}
          subtitle={subtitle || undefined}
          badges={withBadge && set.items.some(i => i.id === 'dashboard') ? { dashboard: 3 } : {}}
          picker={withPicker && <SchoolPicker schoolId={schoolId} onSchoolId={setSchoolId} />}
        />
        <div className="pt-sidebar-demo-content">
          <span>active = "{active}"</span>
        </div>
      </div>
    </>
  )
}

function HeroKnobs() {
  const [mode, setMode]         = useState('bucket')
  const [bucket, setBucket]     = useState('motivation')
  const [title, setTitle]       = useState('Lincoln Elementary')
  const [subtitle, setSubtitle] = useState('K–5 · 1,650 students')
  const [initials, setInitials] = useState('LE')
  const [accent, setAccent]     = useState('#E8866A')
  const [withAction, setAction] = useState(true)

  const modeSelect = (
    <Field label="mode">
      <Select value={mode} onChange={e => setMode(e.target.value)}>
        <option value="bucket">bucket (auto)</option>
        <option value="avatar">avatar (overview)</option>
        <option value="icon">icon (page)</option>
      </Select>
    </Field>
  )
  const actionToggle = <Field label="action"><Toggle checked={withAction} onChange={setAction} /></Field>
  const actionNode = withAction ? (
    <>
      <Button variant="ghost" size="lg">Export</Button>
      <Button variant="primary" size="lg">Log reading</Button>
    </>
  ) : undefined

  if (mode === 'bucket') {
    return (
      <>
        <Knobs>
          {modeSelect}
          <Field label="bucket">
            <Select value={bucket} onChange={e => setBucket(e.target.value)}>
              <option>motivation</option><option>integrity</option><option>habits</option><option>skills</option>
            </Select>
          </Field>
          {actionToggle}
        </Knobs>
        <Hero bucket={bucket} action={actionNode} />
      </>
    )
  }
  if (mode === 'avatar') {
    return (
      <>
        <Knobs>
          {modeSelect}
          <Field label="initials"><Input value={initials} onChange={e => setInitials(e.target.value.slice(0, 2))} /></Field>
          <Field label="title"><Input value={title} onChange={e => setTitle(e.target.value)} /></Field>
          <Field label="subtitle"><Input value={subtitle} onChange={e => setSubtitle(e.target.value)} /></Field>
          <Field label="accent"><input className="pt-color" type="color" value={accent} onChange={e => setAccent(e.target.value)} /></Field>
          {actionToggle}
        </Knobs>
        <Hero initials={initials} title={title} subtitle={subtitle} accent={accent} action={actionNode} />
      </>
    )
  }
  // icon mode
  const motIcon = SECTIONS.find(s => s.key === 'motivation')?.icon
  return (
    <>
      <Knobs>
        {modeSelect}
        <Field label="title"><Input value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <Field label="subtitle"><Input value={subtitle} onChange={e => setSubtitle(e.target.value)} /></Field>
        <Field label="accent"><input className="pt-color" type="color" value={accent} onChange={e => setAccent(e.target.value)} /></Field>
        {actionToggle}
      </Knobs>
      <Hero icon={motIcon} title={title} subtitle={subtitle} accent={accent} action={actionNode} />
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
function SectionHeadingKnobs() {
  const [title, setTitle]       = useState('Students to Watch')
  const [subtitle, setSubtitle] = useState('Last 30 days · 4 students flagged')
  const [level, setLevel]       = useState('h3')
  const [withAction, setAction] = useState(true)
  const [withSub, setSub]       = useState(true)
  return (
    <>
      <Knobs>
        <Field label="title"><Input value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <Field label="subtitle"><Input value={subtitle} onChange={e => setSubtitle(e.target.value)} /></Field>
        <Field label="level">
          <Select value={level} onChange={e => setLevel(e.target.value)}>
            <option>h2</option><option>h3</option><option>h4</option>
          </Select>
        </Field>
        <Field label="show subtitle"><Toggle checked={withSub} onChange={setSub} /></Field>
        <Field label="show action"><Toggle checked={withAction} onChange={setAction} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <SectionHeading
          title={title}
          subtitle={withSub ? subtitle : undefined}
          level={level}
          action={withAction ? <Button variant="ghost" size="sm">View all →</Button> : undefined}
        />
      </div>
    </>
  )
}

function ToggleKnobs() {
  const [checked, setChecked] = useState(true)
  const [size, setSize]       = useState('md')
  const [disabled, setDisabled] = useState(false)
  const [label, setLabel]     = useState('Notifications')
  return (
    <>
      <Knobs>
        <Field label="checked"><Toggle checked={checked} onChange={setChecked} /></Field>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        <Field label="disabled"><Toggle checked={disabled} onChange={setDisabled} /></Field>
        <Field label="label"><Input value={label} onChange={e => setLabel(e.target.value)} placeholder="(no label)" /></Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--row">
        <Toggle checked={checked} onChange={setChecked} size={size} disabled={disabled}>
          {label || undefined}
        </Toggle>
      </div>
    </>
  )
}

function InputKnobs() {
  const [value, setValue]       = useState('Lincoln Elementary')
  const [placeholder, setPh]    = useState('Type here…')
  const [size, setSize]         = useState('md')
  const [disabled, setDisabled] = useState(false)
  const [withIcon, setIcon]     = useState(false)
  const [withLabel, setLabel]   = useState(true)
  const [error, setError]       = useState('')
  const [help, setHelp]         = useState('')
  const searchIcon = <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="7.5" r="4.5"/><path d="M10.8 10.8 14.5 14.5"/></svg>
  return (
    <>
      <Knobs>
        <Field label="value"><Input value={value} onChange={e => setValue(e.target.value)} /></Field>
        <Field label="placeholder"><Input value={placeholder} onChange={e => setPh(e.target.value)} /></Field>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        <Field label="show label"><Toggle checked={withLabel} onChange={setLabel} /></Field>
        <Field label="left icon"><Toggle checked={withIcon} onChange={setIcon} /></Field>
        <Field label="disabled"><Toggle checked={disabled} onChange={setDisabled} /></Field>
        <Field label="help"><Input value={help} onChange={e => setHelp(e.target.value)} placeholder="(none)" /></Field>
        <Field label="error"><Input value={error} onChange={e => setError(e.target.value)} placeholder="(none)" /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        {error || help ? (
          <Field
            label={withLabel ? 'School name' : undefined}
            help={help || undefined}
            error={error || undefined}
          >
            <Input
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={placeholder}
              size={size}
              disabled={disabled}
              icon={withIcon ? searchIcon : undefined}
            />
          </Field>
        ) : (
          <Input
            label={withLabel ? 'School name' : undefined}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={placeholder}
            size={size}
            disabled={disabled}
            icon={withIcon ? searchIcon : undefined}
          />
        )}
      </div>
    </>
  )
}

function SelectKnobs() {
  const [value, setValue]       = useState('5')
  const [size, setSize]         = useState('md')
  const [disabled, setDisabled] = useState(false)
  const [labelText, setLabel]   = useState('Grade level')
  const [withLabel, setWith]    = useState(true)
  return (
    <>
      <Knobs>
        <Field label="value">
          <Select value={value} onChange={e => setValue(e.target.value)}>
            {['K','1','2','3','4','5','6','7','8'].map(g => <option key={g} value={g}>{g}</option>)}
          </Select>
        </Field>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        <Field label="show label"><Toggle checked={withLabel} onChange={setWith} /></Field>
        <Field label="label text"><Input value={labelText} onChange={e => setLabel(e.target.value)} /></Field>
        <Field label="disabled"><Toggle checked={disabled} onChange={setDisabled} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Select
          label={withLabel ? labelText : undefined}
          value={value}
          onChange={e => setValue(e.target.value)}
          size={size}
          disabled={disabled}
        >
          {['K','1','2','3','4','5','6','7','8'].map(g => <option key={g} value={g}>Grade {g}</option>)}
        </Select>
      </div>
    </>
  )
}

function TextareaKnobs() {
  const [value, setValue] = useState('Lincoln Elementary saw a 6-week Lexile plateau despite strong engagement scores.')
  const [rows, setRows]   = useState('4')
  const [disabled, setDisabled] = useState(false)
  const [help, setHelp]   = useState('Visible to district leadership.')
  return (
    <>
      <Knobs>
        <Field label="rows"><Input type="number" value={rows} onChange={e => setRows(e.target.value)} /></Field>
        <Field label="disabled"><Toggle checked={disabled} onChange={setDisabled} /></Field>
        <Field label="help"><Input value={help} onChange={e => setHelp(e.target.value)} placeholder="(none)" /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Field label="Notes" help={help || undefined}>
          <Textarea
            rows={Number(rows) || 3}
            value={value}
            onChange={e => setValue(e.target.value)}
            disabled={disabled}
          />
        </Field>
      </div>
    </>
  )
}

function CheckboxKnobs() {
  const [checked, setChecked]   = useState(true)
  const [disabled, setDisabled] = useState(false)
  const [label, setLabel]       = useState('Include FRL data')
  return (
    <>
      <Knobs>
        <Field label="checked"><Toggle checked={checked} onChange={setChecked} /></Field>
        <Field label="disabled"><Toggle checked={disabled} onChange={setDisabled} /></Field>
        <Field label="label"><Input value={label} onChange={e => setLabel(e.target.value)} placeholder="(none)" /></Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--row">
        <Checkbox checked={checked} onChange={setChecked} disabled={disabled}>
          {label || undefined}
        </Checkbox>
      </div>
    </>
  )
}

function RadioKnobs() {
  const [value, setValue]   = useState('md')
  const [layout, setLayout] = useState('row')
  return (
    <>
      <Knobs>
        <Field label="layout">
          <Select value={layout} onChange={e => setLayout(e.target.value)}>
            <option>row</option><option>column</option>
          </Select>
        </Field>
        <Field label="value"><Input value={value} onChange={e => setValue(e.target.value)} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <RadioGroup name="rs-knob" layout={layout} value={value} onChange={setValue}>
          <Radio value="sm">Small</Radio>
          <Radio value="md">Medium</Radio>
          <Radio value="lg">Large</Radio>
        </RadioGroup>
      </div>
    </>
  )
}

function CheckboxGroupKnobs() {
  const [value, setValue]   = useState(['motivation', 'habits'])
  const [layout, setLayout] = useState('column')
  return (
    <>
      <Knobs>
        <Field label="layout">
          <Select value={layout} onChange={e => setLayout(e.target.value)}>
            <option>column</option><option>row</option>
          </Select>
        </Field>
        <Field label="selection"><Input value={value.join(', ')} readOnly /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <CheckboxGroup value={value} onChange={setValue} layout={layout}>
          <CheckboxGroupItem value="motivation">Motivation</CheckboxGroupItem>
          <CheckboxGroupItem value="habits">Habits</CheckboxGroupItem>
          <CheckboxGroupItem value="skills">Skills</CheckboxGroupItem>
          <CheckboxGroupItem value="integrity">Integrity</CheckboxGroupItem>
        </CheckboxGroup>
      </div>
    </>
  )
}

const GRADE_OPTIONS = [
  { value: 'k',  label: 'Kindergarten' },
  { value: '1',  label: 'Grade 1' },
  { value: '2',  label: 'Grade 2' },
  { value: '3',  label: 'Grade 3' },
  { value: '4',  label: 'Grade 4' },
  { value: '5',  label: 'Grade 5' },
  { value: '6',  label: 'Grade 6' },
  { value: '7',  label: 'Grade 7' },
  { value: '8',  label: 'Grade 8' },
]

function MultiSelectKnobs() {
  const [value, setValue]     = useState(['4', '5'])
  const [size, setSize]       = useState('md')
  const [disabled, setDisabled] = useState(false)
  return (
    <>
      <Knobs>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        <Field label="disabled"><Toggle checked={disabled} onChange={setDisabled} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <MultiSelect
          options={GRADE_OPTIONS}
          value={value}
          onChange={setValue}
          size={size}
          disabled={disabled}
          placeholder="Select grades…"
        />
      </div>
    </>
  )
}

function NumberInputKnobs() {
  const [value, setValue] = useState(5)
  const [min, setMin]     = useState(1)
  const [max, setMax]     = useState(10)
  const [size, setSize]   = useState('md')
  return (
    <>
      <Knobs>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        <Field label="min"><Input type="number" value={min} onChange={e => setMin(Number(e.target.value))} /></Field>
        <Field label="max"><Input type="number" value={max} onChange={e => setMax(Number(e.target.value))} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <NumberInput value={value} onChange={setValue} min={min} max={max} size={size} />
      </div>
    </>
  )
}

function RangeSliderKnobs() {
  const [value, setValue]       = useState(45)
  const [min, setMin]           = useState(0)
  const [max, setMax]           = useState(100)
  const [showValue, setShow]    = useState(true)
  return (
    <>
      <Knobs>
        <Field label="show value"><Toggle checked={showValue} onChange={setShow} /></Field>
        <Field label="min"><Input type="number" value={min} onChange={e => setMin(Number(e.target.value))} /></Field>
        <Field label="max"><Input type="number" value={max} onChange={e => setMax(Number(e.target.value))} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <RangeSlider value={value} onChange={setValue} min={min} max={max} showValue={showValue} />
      </div>
    </>
  )
}

function DateInputKnobs() {
  const [value, setValue] = useState(null)
  const [size, setSize]   = useState('md')
  const [showLabel, setShowLabel] = useState(true)
  return (
    <>
      <Knobs>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        <Field label="label"><Toggle checked={showLabel} onChange={setShowLabel} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <DatePicker
          value={value}
          onChange={setValue}
          size={size}
          label={showLabel ? 'Deadline' : undefined}
          placeholder="Pick a date"
        />
      </div>
    </>
  )
}

function TimeInputKnobs() {
  const [value, setValue] = useState(null)
  const [size, setSize]   = useState('md')
  const [step, setStep]   = useState(30)
  const [showLabel, setShowLabel] = useState(true)
  return (
    <>
      <Knobs>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        <Field label="step">
          <Select value={step} onChange={e => setStep(Number(e.target.value))}>
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={60}>60 min</option>
          </Select>
        </Field>
        <Field label="label"><Toggle checked={showLabel} onChange={setShowLabel} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <TimePicker
          value={value}
          onChange={setValue}
          size={size}
          step={step}
          label={showLabel ? 'Start time' : undefined}
          placeholder="Pick a time"
        />
      </div>
    </>
  )
}

function ColorInputKnobs() {
  const [value, setValue] = useState('#1D4ED8')
  const [size, setSize]   = useState('md')
  const [label, setLabel] = useState('Accent color')
  const [showLabel, setShowLabel] = useState(true)
  return (
    <>
      <Knobs>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        <Field label="show label"><Toggle checked={showLabel} onChange={setShowLabel} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <ColorInput value={value} onChange={setValue} size={size} label={showLabel ? label : undefined} />
      </div>
    </>
  )
}

function FileInputKnobs() {
  const [size, setSize]         = useState('md')
  const [multiple, setMultiple] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [showLabel, setShowLabel] = useState(true)
  return (
    <>
      <Knobs>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        <Field label="multiple"><Toggle checked={multiple} onChange={setMultiple} /></Field>
        <Field label="disabled"><Toggle checked={disabled} onChange={setDisabled} /></Field>
        <Field label="show label"><Toggle checked={showLabel} onChange={setShowLabel} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <FileInput
          size={size}
          multiple={multiple}
          disabled={disabled}
          label={showLabel ? 'Upload CSV' : undefined}
          accept=".csv,.xlsx,.pdf"
        />
      </div>
    </>
  )
}

const CSEL_OPTS_SIMPLE = [
  { value: 'k',   label: 'Kindergarten' },
  { value: '1',   label: 'Grade 1' },
  { value: '2',   label: 'Grade 2' },
  { value: '3',   label: 'Grade 3' },
  { value: '4',   label: 'Grade 4' },
  { value: '5',   label: 'Grade 5' },
]

const CSEL_OPTS_GROUPED = [
  { value: 'motivation', label: 'Motivation' },
  { value: 'habits',     label: 'Habits' },
  { value: 'skills',     label: 'Skills' },
  {
    group: 'Integrity',
    options: [
      { value: 'btwb',  label: 'BTWB flag' },
      { value: 'rapid', label: 'Rapid entry' },
      { value: 'dupe',  label: 'Duplicate session' },
    ],
  },
]

const CSEL_OPTS_LONG = [
  { value: 'al', label: 'Alabama' },
  { value: 'ak', label: 'Alaska' },
  { value: 'az', label: 'Arizona' },
  { value: 'ar', label: 'Arkansas' },
  { value: 'ca', label: 'California' },
  { value: 'co', label: 'Colorado' },
  { value: 'ct', label: 'Connecticut' },
  { value: 'de', label: 'Delaware' },
  { value: 'fl', label: 'Florida' },
  { value: 'ga', label: 'Georgia' },
  { value: 'hi', label: 'Hawaii' },
  { value: 'id', label: 'Idaho' },
  { value: 'il', label: 'Illinois' },
  { value: 'in', label: 'Indiana' },
  { value: 'ia', label: 'Iowa' },
]

const CSEL_OPTS_WITH_DISABLED = [
  { value: 'active',   label: 'Active' },
  { value: 'inactive', label: 'Inactive', disabled: true },
  { value: 'pending',  label: 'Pending' },
  { value: 'archived', label: 'Archived', disabled: true },
  { value: 'draft',    label: 'Draft' },
]

const CSEL_OPTS_MAP = {
  simple:        CSEL_OPTS_SIMPLE,
  grouped:       CSEL_OPTS_GROUPED,
  long:          CSEL_OPTS_LONG,
  'w/ disabled': CSEL_OPTS_WITH_DISABLED,
}

function CustomSelectKnobs() {
  const [value, setValue]     = useState('motivation')
  const [size, setSize]       = useState('md')
  const [disabled, setDis]    = useState(false)
  const [showLabel, setLbl]   = useState(true)
  const [hasError, setErr]    = useState(false)
  const [optSet, setOptSet]   = useState('grouped')

  const opts = CSEL_OPTS_MAP[optSet]
  const handleOptSet = v => { setOptSet(v); setValue('') }

  return (
    <>
      <Knobs>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        <Field label="options">
          <Select value={optSet} onChange={e => handleOptSet(e.target.value)}>
            {Object.keys(CSEL_OPTS_MAP).map(k => <option key={k}>{k}</option>)}
          </Select>
        </Field>
        <Field label="label"><Toggle checked={showLabel} onChange={setLbl} /></Field>
        <Field label="error"><Toggle checked={hasError} onChange={setErr} /></Field>
        <Field label="disabled"><Toggle checked={disabled} onChange={setDis} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Field error={hasError ? 'This field is required' : undefined}>
          <CustomSelect
            options={opts}
            value={value}
            onChange={setValue}
            size={size}
            disabled={disabled}
            label={showLabel ? 'Category' : undefined}
            placeholder="Select an option…"
          />
        </Field>
      </div>
    </>
  )
}

function DatePickerKnobs() {
  const [date, setDate]       = useState(null)
  const [size, setSize]       = useState('md')
  const [disabled, setDis]    = useState(false)
  const [showLabel, setLbl]   = useState(true)
  const [hasError, setErr]    = useState(false)
  const [clearable, setClear] = useState(true)
  return (
    <>
      <Knobs>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        <Field label="clearable"><Toggle checked={clearable} onChange={setClear} /></Field>
        <Field label="error"><Toggle checked={hasError} onChange={setErr} /></Field>
        <Field label="disabled"><Toggle checked={disabled} onChange={setDis} /></Field>
        <Field label="label"><Toggle checked={showLabel} onChange={setLbl} /></Field>
      </Knobs>
      <div className="pt-variant-frame" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Default</span>
          <div style={{ marginTop: 8 }}>
            <Field error={hasError ? 'Please select a date' : undefined}>
              <DatePicker value={date} onChange={setDate} size={size} disabled={disabled} clearable={clearable} />
            </Field>
          </div>
        </div>
        <div>
          <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>With label</span>
          <div style={{ marginTop: 8 }}>
            <DatePicker value={date} onChange={setDate} size={size} disabled={disabled} clearable={clearable}
              label={showLabel ? 'Due date' : undefined} />
          </div>
        </div>
        <div>
          <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>In a field row</span>
          <div className="pt-form-row" style={{ marginTop: 8 }}>
            <Field label="Start date" error={hasError ? 'Required' : undefined}>
              <DatePicker value={date} onChange={setDate} size={size} disabled={disabled} clearable={clearable} />
            </Field>
            <Field label="End date">
              <DatePicker value={null} onChange={() => {}} size={size} disabled={disabled} clearable={clearable} placeholder="Pick an end date" />
            </Field>
          </div>
        </div>
      </div>
    </>
  )
}

function TimePickerKnobs() {
  const [time, setTime]       = useState(null)
  const [size, setSize]       = useState('md')
  const [step, setStep]       = useState(30)
  const [disabled, setDis]    = useState(false)
  const [showLabel, setLbl]   = useState(true)
  const [hasError, setErr]    = useState(false)
  return (
    <>
      <Knobs>
        <Field label="size">
          <Select value={size} onChange={e => setSize(e.target.value)}>
            <option>sm</option><option>md</option><option>lg</option>
          </Select>
        </Field>
        <Field label="step (min)">
          <Select value={step} onChange={e => setStep(Number(e.target.value))}>
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={60}>60</option>
          </Select>
        </Field>
        <Field label="error"><Toggle checked={hasError} onChange={setErr} /></Field>
        <Field label="disabled"><Toggle checked={disabled} onChange={setDis} /></Field>
        <Field label="label"><Toggle checked={showLabel} onChange={setLbl} /></Field>
      </Knobs>
      <div className="pt-variant-frame" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Default</span>
          <div style={{ marginTop: 8 }}>
            <Field error={hasError ? 'Please select a time' : undefined}>
              <TimePicker value={time} onChange={setTime} size={size} step={step} disabled={disabled} />
            </Field>
          </div>
        </div>
        <div>
          <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>With label</span>
          <div style={{ marginTop: 8 }}>
            <TimePicker value={time} onChange={setTime} size={size} step={step} disabled={disabled}
              label={showLabel ? 'Start time' : undefined} />
          </div>
        </div>
        <div>
          <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Date + time together</span>
          <div className="pt-form-row" style={{ marginTop: 8 }}>
            <Field label="Date">
              <DatePicker value={null} onChange={() => {}} size={size} disabled={disabled} placeholder="Pick a date" />
            </Field>
            <Field label="Time" error={hasError ? 'Required' : undefined}>
              <TimePicker value={time} onChange={setTime} size={size} step={step} disabled={disabled} />
            </Field>
          </div>
        </div>
      </div>
    </>
  )
}

function FilterBarKnobs() {
  const [showAction, setShowAction] = useState(true)
  const [view,    setView]    = useState('goal')
  const [logType, setLogType] = useState('minutes')
  const [showAs,  setShowAs]  = useState('pct')

  return (
    <>
      <Knobs>
        <Field label="action button"><Toggle checked={showAction} onChange={setShowAction} /></Field>
      </Knobs>
      <div className="pt-variant-frame">
        <FilterBar action={showAction ? <Button variant="primary" size="sm">Save &amp; Update</Button> : undefined}>
          <FilterItem label="View as">
            <Select value={view} onChange={e => setView(e.target.value)} size="sm">
              <option value="goal">Goal %</option>
              <option value="actual">Actual mins</option>
              <option value="rank">Rank</option>
            </Select>
          </FilterItem>
          <FilterItem label="Log type">
            <Select value={logType} onChange={e => setLogType(e.target.value)} size="sm">
              <option value="minutes">Minutes</option>
              <option value="books">Books</option>
              <option value="pages">Pages</option>
            </Select>
          </FilterItem>
          <FilterItem label="Show as">
            <Select value={showAs} onChange={e => setShowAs(e.target.value)} size="sm">
              <option value="pct">Percentage</option>
              <option value="abs">Absolute</option>
            </Select>
          </FilterItem>
        </FilterBar>
      </div>
    </>
  )
}

function FullFormExample() {
  const [name, setName]     = useState('')
  const [grade, setGrade]   = useState('5')
  const [bucket, setBucket] = useState('motivation')
  const [notes, setNotes]   = useState('')
  const [optIn, setOptIn]   = useState(true)
  return (
    <form className="pt-form" onSubmit={e => e.preventDefault()}>
      <Field label="Student name" help="As it appears in your SIS.">
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Marcus Chen" />
      </Field>
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
      <Field label="Notes" help="Visible to district leadership.">
        <Textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Why are we watching this student?" />
      </Field>
      <Toggle checked={optIn} onChange={setOptIn}>Notify teacher when this student is logged for the next reading session</Toggle>
      <div className="pt-form-actions">
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Add to watchlist</Button>
      </div>
    </form>
  )
}

function CompactFormExample() {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const error = touched && !email.includes('@') ? 'Please enter a valid email.' : ''
  return (
    <form className="pt-form" onSubmit={e => { e.preventDefault(); setTouched(true) }}>
      <Field label="Email" help="We'll send weekly summaries here." error={error || undefined}>
        <Input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="you@school.org"
        />
      </Field>
      <div className="pt-form-actions">
        <Button variant="primary">Subscribe</Button>
      </div>
    </form>
  )
}

function FilterFormExample() {
  const [grades, setGrades]     = useState(['4', '5'])
  const [bucket, setBucket]     = useState('all')
  const [minScore, setMinScore] = useState(40)
  const [flagged, setFlagged]   = useState(false)
  return (
    <form className="pt-form" onSubmit={e => e.preventDefault()}>
      <Field label="Grade levels">
        <CheckboxGroup value={grades} onChange={setGrades} layout="row">
          {['3','4','5','6','7','8'].map(g => (
            <CheckboxGroupItem key={g} value={g}>Grade {g}</CheckboxGroupItem>
          ))}
        </CheckboxGroup>
      </Field>
      <Field label="Reading health area">
        <RadioGroup name="filter-bucket" value={bucket} onChange={setBucket} layout="column">
          <Radio value="all">All areas</Radio>
          <Radio value="motivation">Motivation</Radio>
          <Radio value="habits">Habits</Radio>
          <Radio value="skills">Skills</Radio>
          <Radio value="integrity">Integrity</Radio>
        </RadioGroup>
      </Field>
      <RangeSlider label="Minimum RMI score" min={0} max={100} value={minScore} onChange={setMinScore} />
      <Checkbox checked={flagged} onChange={setFlagged}>Flagged students only</Checkbox>
      <div className="pt-form-actions">
        <Button variant="ghost">Reset</Button>
        <Button variant="primary">Apply filters</Button>
      </div>
    </form>
  )
}

function SettingsFormExample() {
  const [orgName, setOrgName]   = useState('Lincoln Elementary')
  const [tz, setTz]             = useState('America/Chicago')
  const [sessGoal, setSessGoal] = useState(3)
  const [dataTypes, setTypes]   = useState(['logins', 'sessions'])
  const [exportFmt, setExport]  = useState('csv')
  return (
    <form className="pt-form" onSubmit={e => e.preventDefault()}>
      <Input label="Organization name" value={orgName} onChange={e => setOrgName(e.target.value)} />
      <Select label="Timezone" value={tz} onChange={e => setTz(e.target.value)}>
        <option value="America/New_York">Eastern (ET)</option>
        <option value="America/Chicago">Central (CT)</option>
        <option value="America/Denver">Mountain (MT)</option>
        <option value="America/Los_Angeles">Pacific (PT)</option>
      </Select>
      <NumberInput label="Sessions per week goal" min={1} max={7} value={sessGoal} onChange={setSessGoal} />
      <Field label="Include in reports">
        <CheckboxGroup value={dataTypes} onChange={setTypes} layout="column">
          <CheckboxGroupItem value="logins">Login activity</CheckboxGroupItem>
          <CheckboxGroupItem value="sessions">Reading sessions</CheckboxGroupItem>
          <CheckboxGroupItem value="lexile">Lexile changes</CheckboxGroupItem>
          <CheckboxGroupItem value="flags">Flagged events</CheckboxGroupItem>
        </CheckboxGroup>
      </Field>
      <Field label="Default export format">
        <RadioGroup name="export-format" value={exportFmt} onChange={setExport} layout="row">
          <Radio value="csv">CSV</Radio>
          <Radio value="xlsx">Excel</Radio>
          <Radio value="pdf">PDF</Radio>
        </RadioGroup>
      </Field>
      <div className="pt-form-actions">
        <Button variant="ghost">Discard</Button>
        <Button variant="primary">Save settings</Button>
      </div>
    </form>
  )
}

function FieldFormKnobs() {
  const [example, setExample] = useState('full')
  return (
    <>
      <Knobs>
        <Field label="example">
          <Select value={example} onChange={e => setExample(e.target.value)}>
            <option value="full">full (add to watchlist)</option>
            <option value="compact">compact (email subscribe)</option>
            <option value="filter">filter panel</option>
            <option value="settings">settings form</option>
          </Select>
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        {example === 'full'     && <FullFormExample />}
        {example === 'compact'  && <CompactFormExample />}
        {example === 'filter'   && <FilterFormExample />}
        {example === 'settings' && <SettingsFormExample />}
      </div>
    </>
  )
}

// ── Chart knobs ──────────────────────────────────────────────────────────
function LineChartKnobs() {
  const [curve, setCurve]       = useState('monotoneX')
  const [showArea, setArea]     = useState(false)
  const [showPoints, setPoints] = useState(false)
  const [showLegend, setLegend] = useState(true)
  const [showAxes, setAxes]     = useState(false)
  const [accent, setAccent]     = useState('#E8866A')

  const xLegend = showAxes ? 'Month' : undefined
  const yLegend = showAxes ? 'RMI score' : undefined
  return (
    <>
      <Knobs>
        <Field label="curve">
          <Select value={curve} onChange={e => setCurve(e.target.value)}>
            <option>monotoneX</option><option>linear</option><option>step</option><option>natural</option>
          </Select>
        </Field>
        <Field label="accent"><input className="pt-color" type="color" value={accent} onChange={e => setAccent(e.target.value)} /></Field>
        <Field label="area fill"><Toggle checked={showArea} onChange={setArea} /></Field>
        <Field label="points"><Toggle checked={showPoints} onChange={setPoints} /></Field>
        <Field label="axis legends"><Toggle checked={showAxes} onChange={setAxes} /></Field>
        <Field label="legend"><Toggle checked={showLegend} onChange={setLegend} /></Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--bare">
        <ChartCard
          title="RMI Trend — Lincoln vs. District"
          subtitle="Sep 2024 – May 2025"
          icon={SECTIONS.find(s => s.key === 'motivation')?.icon}
          accent={accent}
          footer={showLegend ? <ChartLegend items={[
            { color: accent,    label: 'Lincoln' },
            { color: '#CBD5E1', label: 'District avg', dashed: true },
          ]} /> : undefined}
        >
          <div style={{ height: 220 }}>
            <ResponsiveLine
              data={[
                { id: 'Lincoln',      color: accent,    data: CHART_TREND.map(d => ({ x: d.month, y: d.school })) },
                { id: 'District avg', color: '#CBD5E1', data: CHART_TREND.map(d => ({ x: d.month, y: d.district })) },
              ]}
              theme={NIVO_THEME}
              margin={{ top: 12, right: 24, bottom: showAxes ? 48 : 32, left: showAxes ? 64 : 36 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 55, max: 90 }}
              curve={curve}
              colors={d => d.color}
              lineWidth={2.5}
              enablePoints={showPoints}
              pointSize={6}
              enableArea={showArea}
              areaBaselineValue={55}
              areaOpacity={0.08}
              enableGridX={false}
              axisBottom={{ ...AXIS_BOTTOM, legend: xLegend, legendOffset: 36, legendPosition: 'middle' }}
              axisLeft={{ ...AXIS_LEFT, tickValues: [60, 70, 80, 90], legend: yLegend, legendOffset: -48, legendPosition: 'middle' }}
              enableSlices="x"
              sliceTooltip={({ slice }) => (
                <SliceTooltip
                  slice={slice}
                  accent={accent}
                  allData={CHART_TREND}
                  seriesMap={{ Lincoln: 'school', 'District avg': 'district' }}
                  formatDelta={d => `${d > 0 ? '+' : ''}${d} pts`}
                />
              )}
            />
          </div>
        </ChartCard>
      </div>
    </>
  )
}

const GROUPED_BAR_DATA = [
  { month: 'Sep', intrinsic: 12.1, extrinsic: 11.4 },
  { month: 'Oct', intrinsic: 12.4, extrinsic: 11.5 },
  { month: 'Nov', intrinsic: 12.8, extrinsic: 11.6 },
  { month: 'Dec', intrinsic: 12.6, extrinsic: 11.5 },
  { month: 'Jan', intrinsic: 13.1, extrinsic: 11.6 },
  { month: 'Feb', intrinsic: 13.5, extrinsic: 11.7 },
  { month: 'Mar', intrinsic: 13.7, extrinsic: 11.6 },
  { month: 'Apr', intrinsic: 14.0, extrinsic: 11.7 },
  { month: 'May', intrinsic: 14.2, extrinsic: 11.8 },
]

function GroupedBarKnobs() {
  const [mode, setMode]         = useState('grouped')
  const [showLegend, setLegend] = useState(true)
  const [decimals, setDecimals] = useState('1')
  const [showAxes, setAxes]     = useState(false)
  const [accent, setAccent]     = useState('#E8866A')

  const dec = Number(decimals) || 0
  const formatVal = v => v.toFixed(dec)
  // Widest possible y-tick label width: "##." + dec digits @ ~7px char width
  const sampleTick = formatVal(mode === 'stacked' ? 30 : 16)
  const tickPx = sampleTick.length * 8 + 14
  const leftMargin = (showAxes ? 32 : 0) + tickPx

  const xLegend = showAxes ? 'Month' : undefined
  const yLegend = showAxes ? 'Score / 20' : undefined
  return (
    <>
      <Knobs>
        <Field label="groupMode">
          <Select value={mode} onChange={e => setMode(e.target.value)}>
            <option>grouped</option><option>stacked</option>
          </Select>
        </Field>
        <Field label="decimals">
          <Select value={decimals} onChange={e => setDecimals(e.target.value)}>
            <option>0</option><option>1</option><option>2</option>
          </Select>
        </Field>
        <Field label="accent"><input className="pt-color" type="color" value={accent} onChange={e => setAccent(e.target.value)} /></Field>
        <Field label="axis legends"><Toggle checked={showAxes} onChange={setAxes} /></Field>
        <Field label="legend"><Toggle checked={showLegend} onChange={setLegend} /></Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--bare">
        <ChartCard
          title="Intrinsic vs. Extrinsic Motivation"
          subtitle="RMI subscores out of 20"
          icon={SECTIONS.find(s => s.key === 'motivation')?.icon}
          accent={accent}
          footer={showLegend ? <ChartLegend items={[
            { color: accent,    label: 'Intrinsic' },
            { color: '#CBD5E1', label: 'Extrinsic' },
          ]} /> : undefined}
        >
          <div style={{ height: 200 }}>
            <ResponsiveBar
              data={GROUPED_BAR_DATA}
              keys={['intrinsic', 'extrinsic']}
              indexBy="month"
              groupMode={mode}
              theme={NIVO_THEME}
              margin={{ top: 12, right: 20, bottom: showAxes ? 48 : 32, left: leftMargin }}
              padding={0.3}
              innerPadding={2}
              colors={({ id }) => id === 'intrinsic' ? accent : '#CBD5E1'}
              borderRadius={3}
              axisBottom={{ ...AXIS_BOTTOM, legend: xLegend, legendOffset: 36, legendPosition: 'middle' }}
              axisLeft={{ ...AXIS_LEFT, format: formatVal, tickValues: 5, legend: yLegend, legendOffset: -(leftMargin - 16), legendPosition: 'middle' }}
              enableGridY
              enableLabel={false}
              minValue={mode === 'stacked' ? 0 : 9}
              maxValue={mode === 'stacked' ? 30 : 16}
              tooltip={({ indexValue, data }) => (
                <BarTooltip
                  data={data}
                  indexValue={indexValue}
                  accent={accent}
                  format={v => `${formatVal(v)} /20`}
                  keys={['intrinsic', 'extrinsic']}
                  labels={{
                    intrinsic: { label: 'Intrinsic', color: accent },
                    extrinsic: { label: 'Extrinsic', color: '#CBD5E1' },
                  }}
                />
              )}
            />
          </div>
        </ChartCard>
      </div>
    </>
  )
}

const H_BAR_DATA = [
  { id: 'adams',      name: 'Adams High',      completionRate: 96, isThis: false },
  { id: 'jefferson',  name: 'Jefferson El.',   completionRate: 88, isThis: false },
  { id: 'kennedy',    name: 'Kennedy K-8',     completionRate: 80, isThis: false },
  { id: 'roosevelt',  name: 'Roosevelt Mid.',  completionRate: 73, isThis: false },
  { id: 'lincoln',    name: 'Lincoln El.',     completionRate: 64, isThis: true },
  { id: 'washington', name: 'Washington Mid.', completionRate: 51, isThis: false },
]

function HorizontalBarKnobs() {
  const [showValueLabel, setVL] = useState(false)
  const [showAxes, setAxes]     = useState(false)
  const [showLegend, setLegend] = useState(true)
  const [accent, setAccent]     = useState('#E8866A')

  // Derive left margin from the widest y-axis label (school name)
  const widestLabel = H_BAR_DATA.reduce((m, d) => Math.max(m, d.name.length), 0)
  const leftMargin = widestLabel * 7 + 24 + (showAxes ? 32 : 0)
  // Right margin: room for the last x-axis tick "100%" (centered on its position,
  // so half spills past the chart area) plus optional inline value labels on the bars.
  const rightMargin = (showValueLabel ? 72 : 56)

  const xLegend = showAxes ? 'Completion rate' : undefined
  const yLegend = showAxes ? 'School' : undefined

  return (
    <>
      <Knobs>
        <Field label="accent"><input className="pt-color" type="color" value={accent} onChange={e => setAccent(e.target.value)} /></Field>
        <Field label="value labels"><Toggle checked={showValueLabel} onChange={setVL} /></Field>
        <Field label="axis legends"><Toggle checked={showAxes} onChange={setAxes} /></Field>
        <Field label="legend"><Toggle checked={showLegend} onChange={setLegend} /></Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--bare">
        <ChartCard
          title="District integrity ranking"
          subtitle="Book Talk completion rate · May 2025"
          icon={SECTIONS.find(s => s.key === 'integrity')?.icon}
          accent="#1D4ED8"
          footer={showLegend ? <ChartLegend items={[
            { color: accent,    label: 'This school' },
            { color: '#CBD5E1', label: 'Other schools' },
          ]} /> : undefined}
        >
          <div style={{ height: 240 }}>
            <ResponsiveBar
              data={H_BAR_DATA}
              keys={['completionRate']}
              indexBy="name"
              layout="horizontal"
              theme={NIVO_THEME}
              margin={{ top: 12, right: rightMargin, bottom: showAxes ? 48 : 32, left: leftMargin }}
              colors={({ data }) => data.isThis ? accent : '#CBD5E1'}
              borderRadius={4}
              axisBottom={{ ...AXIS_BOTTOM, format: v => `${v}%`, tickValues: [0, 25, 50, 75, 100], legend: xLegend, legendOffset: 36, legendPosition: 'middle' }}
              axisLeft={{ tickSize: 0, tickPadding: 10, legend: yLegend, legendOffset: -(leftMargin - 16), legendPosition: 'middle' }}
              enableGridY={false}
              enableLabel={showValueLabel}
              label={d => `${d.value}%`}
              labelTextColor="#1E293B"
              maxValue={100}
              tooltip={({ data }) => (
                <div className="sdb-tooltip" style={{ '--tip-accent': data.isThis ? accent : '#1D4ED8' }}>
                  <div className="sdb-tooltip-header">{data.name}</div>
                  <div className="sdb-tooltip-series" style={{ '--series-color': data.isThis ? accent : '#94A3B8' }}>
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
      </div>
    </>
  )
}

function ScatterKnobs() {
  const [accent, setAccent] = useState('#E8866A')
  const [yTicks, setYTicks] = useState('5')
  const [showRef, setRef]   = useState(true)
  const [showAxes, setAxes] = useState(true)
  const [showLegend, setLegend] = useState(true)

  const xLabel = showAxes ? 'Avg books / month' : undefined
  const yLabel = showAxes ? 'Lexile growth' : undefined
  return (
    <>
      <Knobs>
        <Field label="accent"><input className="pt-color" type="color" value={accent} onChange={e => setAccent(e.target.value)} /></Field>
        <Field label="y ticks">
          <Select value={yTicks} onChange={e => setYTicks(e.target.value)}>
            <option>3</option><option>4</option><option>5</option><option>6</option>
          </Select>
        </Field>
        <Field label="ref line"><Toggle checked={showRef} onChange={setRef} /></Field>
        <Field label="axis legends"><Toggle checked={showAxes} onChange={setAxes} /></Field>
        <Field label="legend"><Toggle checked={showLegend} onChange={setLegend} /></Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--bare">
        <ChartCard
          title="Lexile Growth vs. Reading Volume"
          subtitle="Lincoln highlighted against district peers"
          icon={SECTIONS.find(s => s.key === 'skills')?.icon}
          accent="#7C3AED"
          footer={showLegend ? <ChartLegend items={[
            { color: accent,    label: 'This school' },
            { color: '#CBD5E1', label: 'Other schools' },
            ...(showRef ? [{ color: '#D97706', label: 'Expected (+65L)', dashed: true }] : []),
          ]} /> : undefined}
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
              margin={{ top: 16, right: 28, bottom: showAxes ? 52 : 32, left: showAxes ? 76 : 44 }}
              xScale={{ type: 'linear', min: 15, max: 50 }}
              yScale={{ type: 'linear', min: 0, max: 130 }}
              colors={({ serieId }) => serieId === 'This school' ? accent : '#CBD5E1'}
              nodeSize={d => Math.sqrt(d.data.students / 5)}
              axisBottom={{ ...AXIS_BOTTOM, legend: xLabel, legendOffset: 40, legendPosition: 'middle', tickValues: 5 }}
              axisLeft={{ ...AXIS_LEFT, format: v => `${v}L`, legend: yLabel, legendOffset: -60, legendPosition: 'middle', tickValues: Number(yTicks) || 5 }}
              enableGridX={false}
              markers={showRef ? [{
                axis: 'y', value: 65,
                lineStyle: { stroke: '#D97706', strokeDasharray: '4 3', strokeWidth: 1.5 },
              }] : []}
              tooltip={({ node }) => (
                <div className="sdb-tooltip" style={{ '--tip-accent': node.data.sid === 'lincoln' ? accent : '#475569' }}>
                  <div className="sdb-tooltip-header">{node.data.school}</div>
                  <div className="sdb-tooltip-series" style={{ '--series-color': node.data.sid === 'lincoln' ? accent : '#94A3B8' }}>
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
      </div>
    </>
  )
}

function ChartLegendKnobs() {
  const [layout, setLayout] = useState('row')
  const [items, setItems]   = useState('3')
  const palette = [
    { color: '#E8866A', label: 'Lincoln' },
    { color: '#CBD5E1', label: 'District avg', dashed: true },
    { color: '#16A97A', label: 'Target' },
    { color: '#7C3AED', label: 'Top quartile' },
    { color: '#0DA7BC', label: 'Elementary' },
  ]
  const visible = palette.slice(0, Number(items) || 2)
  return (
    <>
      <Knobs>
        <Field label="orientation">
          <Select value={layout} onChange={e => setLayout(e.target.value)}>
            <option>row</option><option>column</option>
          </Select>
        </Field>
        <Field label="items">
          <Select value={items} onChange={e => setItems(e.target.value)}>
            <option>2</option><option>3</option><option>4</option><option>5</option>
          </Select>
        </Field>
      </Knobs>
      <div className="pt-variant-frame" style={layout === 'column' ? { } : undefined}>
        <div style={{ display: 'flex', flexDirection: layout === 'column' ? 'column' : 'row', gap: layout === 'column' ? 6 : 16, flexWrap: 'wrap' }}>
          <ChartLegend items={visible} />
        </div>
      </div>
    </>
  )
}

// ── Breakpoint indicator (fixed corner pill) ─────────────────────────────
function subscribeViewport(cb) {
  window.addEventListener('resize', cb)
  return () => window.removeEventListener('resize', cb)
}
function BreakpointIndicator() {
  const width = useSyncExternalStore(
    subscribeViewport,
    () => window.innerWidth,
    () => 1280,
  )
  const tier =
    width <= 699  ? { label: 'mobile',  color: '#DC2626' } :
    width <= 1099 ? { label: 'tablet',  color: '#D97706' } :
                    { label: 'desktop', color: '#16A34A' }
  return (
    <div className="pt-breakpoint" style={{ '--bp-color': tier.color }}>
      <span className="pt-breakpoint-dot" />
      <span className="pt-breakpoint-tier">{tier.label}</span>
      <span className="pt-breakpoint-px">{width}px</span>
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

// Derive which group a section ID belongs to
const SECTION_GROUP = Object.fromEntries(SECTIONS_LIST.map(s => [s.id, s.group]))

export function App() {
  const [active, setActive]   = useState('stat-card')
  const [navOpen, setNavOpen] = useState(false)

  // Start with the active section's group open
  const [openGroups, setOpenGroups] = useState(() => {
    const initial = SECTION_GROUP['stat-card']
    return new Set([initial])
  })

  // Suppress scroll-based updates while anchor navigation is animating
  const suppressScroll  = useRef(false)
  const suppressTimer   = useRef(null)

  const toggleGroup = group =>
    setOpenGroups(prev => {
      const next = new Set(prev)
      next.has(group) ? next.delete(group) : next.add(group)
      return next
    })

  // Called when a sidebar link is clicked — snap state immediately and
  // freeze the scroll handler until smooth-scroll finishes (~600 ms).
  const handleNavClick = (s) => {
    setActive(s.id)
    setOpenGroups(new Set([SECTION_GROUP[s.id]]))
    setNavOpen(false)
    suppressScroll.current = true
    clearTimeout(suppressTimer.current)
    suppressTimer.current = setTimeout(() => { suppressScroll.current = false }, 600)
  }

  useEffect(() => {
    function onScroll() {
      if (suppressScroll.current) return   // nav click in progress — skip
      const content = document.querySelector('.pt-content')
      const contentTop = content.getBoundingClientRect().top
      const sections = SECTIONS_LIST.map(s => document.getElementById(s.id))
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i]) {
          const sectionTop = sections[i].getBoundingClientRect().top - contentTop
          if (sectionTop <= 1) {
            const id = SECTIONS_LIST[i].id
            setActive(id)
            // Accordion: only the active group stays open while scrolling
            setOpenGroups(prev => {
              const g = SECTION_GROUP[id]
              if (prev.size === 1 && prev.has(g)) return prev
              return new Set([g])
            })
            return
          }
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
      <div className={`pt-shell${navOpen ? ' pt-shell--nav-open' : ''}`}>
        {/* Mobile topbar — opens the sidebar as a drawer */}
        <div className="pt-topbar">
          <button
            type="button"
            className="pt-topbar-toggle"
            onClick={() => setNavOpen(true)}
            aria-label="Open pattern library navigation"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="16" y2="6" /><line x1="4" y1="10" x2="16" y2="10" /><line x1="4" y1="14" x2="16" y2="14" />
            </svg>
          </button>
          <div className="pt-topbar-title">Pattern Library</div>
        </div>

        {navOpen && <div className="pt-sidebar-backdrop" onClick={() => setNavOpen(false)} />}

        <aside className={`pt-sidebar${navOpen ? ' pt-sidebar--open' : ''}`}>
          <div className="pt-sidebar-head">
            <div>
              <div className="pt-sidebar-title">Pattern Library</div>
              <div className="pt-sidebar-sub">Shared components used across every prototype</div>
            </div>
            <button
              type="button"
              className="pt-sidebar-close"
              onClick={() => setNavOpen(false)}
              aria-label="Close navigation"
            >
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 5l10 10M15 5L5 15"/>
              </svg>
            </button>
          </div>
          {Object.entries(groups).map(([group, items]) => {
            const isOpen = openGroups.has(group)
            const hasActive = items.some(s => s.id === active)
            return (
              <div key={group} className={`pt-nav-group${isOpen ? ' pt-nav-group--open' : ''}`}>
                <button
                  type="button"
                  className={`pt-nav-group-label${hasActive ? ' pt-nav-group-label--active' : ''}`}
                  onClick={() => toggleGroup(group)}
                >
                  {group}
                  <svg className="pt-nav-group-caret" viewBox="0 0 12 12" width="10" height="10"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2,4 6,8 10,4" />
                  </svg>
                </button>
                {isOpen && items.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`pt-nav-link${active === s.id ? ' pt-nav-link--active' : ''}`}
                    onClick={() => handleNavClick(s)}
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            )
          })}
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
            desc={<>Anchored popover triggered by a button. Closes on outside click + Escape. Children can be JSX or a render function that receives <code>{'{ close }'}</code>. <strong>Overflow rule:</strong> when a button row has 3+ actions, collapse the secondary ones into a <code>More</code> (kebab) flyout.</>}
          >
            <FlyoutKnobs />
            <FlyoutShowcase />
          </Section>

          <Section
            id="modal"
            title="Modal"
            desc={<>Two variants: <code>side</code> (right-slide panel) and <code>center</code> (overlay). Both close on backdrop click + Escape and animate in/out. The centered modal composes from <code>.modal-image</code>, <code>.modal-header</code>, <code>.modal-body</code>, <code>.modal-footer</code> — toggle each below.</>}
          >
            <div className="pt-variant">
              <div className="pt-variant-label">variant='center' (overlay)</div>
              <CenteredModalKnobs />
            </div>
            <div className="pt-variant">
              <div className="pt-variant-label">variant='side' (slide-in)</div>
              <SideModalShowcase />
            </div>
          </Section>

          <Section
            id="table"
            title="Table"
            desc={<>Pass <code>columns</code> and <code>rows</code>. Each column can have <code>align</code>, <code>render</code>, <code>width</code>, <code>sortable</code>. Props: <code>zebra</code>, <code>compact</code>, <code>flush</code>, <code>pageSize</code> (enables pagination), <code>defaultSortKey</code>.</>}
          >
            <TableKnobs />
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
            desc={<>Expand/collapse list. Pass <code>items</code> as <code>{'[{ id, title, content }]'}</code>. Optional <code>accent</code> color, <code>allowMultiple</code>, <code>defaultOpen</code>.</>}
          >
            <AccordionKnobs />
          </Section>

          <Section
            id="empty-state"
            title="EmptyState"
            desc={<>Empty-list placeholder. Props: <code>icon</code>, <code>title</code>, <code>description</code>, <code>action</code>.</>}
          >
            <EmptyStateKnobs />
          </Section>

          <Section
            id="skeleton"
            title="Skeleton"
            desc={<>Animated loading placeholder. <code>width</code>, <code>height</code>, <code>shape</code> (rect/circle), or <code>lines</code> for a multi-row text placeholder.</>}
          >
            <SkeletonKnobs />
            <div className="pt-variants pt-variants--3">
              <Variant label="avatar row">
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
              <Variant label="stat card">
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Skeleton width="45%" height={12} />
                  <Skeleton width="30%" height={28} />
                  <Skeleton width="55%" height={11} />
                </div>
              </Variant>
              <Variant label="article / card">
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Skeleton width="100%" height={120} />
                  <Skeleton width="70%" height={15} />
                  <Skeleton width="90%" height={12} lines={3} />
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                    <Skeleton shape="circle" width={24} height={24} />
                    <Skeleton width="30%" height={11} />
                  </div>
                </div>
              </Variant>
              <Variant label="table rows">
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
                  {[100, 80, 70, 60].map((w, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: i < 3 ? '1px solid #F1F5F9' : 'none' }}>
                      <Skeleton shape="circle" width={28} height={28} />
                      <Skeleton width={`${w}%`} height={13} style={{ flex: 1 }} />
                      <Skeleton width={40} height={13} />
                    </div>
                  ))}
                </div>
              </Variant>
              <Variant label="form">
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[['40%', 32], ['60%', 32], ['100%', 72]].map(([w, h], i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <Skeleton width="28%" height={11} />
                      <Skeleton width={w} height={h} />
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <Skeleton width={72} height={32} />
                    <Skeleton width={88} height={32} />
                  </div>
                </div>
              </Variant>
            </div>
          </Section>

          <Section
            id="section-heading"
            title="SectionHeading"
            desc={<>Recurring h2/h3 + optional subtitle + optional right-side action. Used as the header inside content sections / cards.</>}
          >
            <SectionHeadingKnobs />
          </Section>

          <Section
            id="toggle"
            title="Toggle"
            desc={<>iOS-style switch. Props: <code>checked</code>, <code>onChange</code>, <code>disabled</code>, <code>size</code> (sm/md), optional label as children.</>}
          >
            <ToggleKnobs />
          </Section>

          <Section
            id="input"
            title="Input"
            desc={<>Text input. Sizes <code>sm</code> / <code>md</code> / <code>lg</code>. Optional <code>icon</code> + <code>iconRight</code>. Picks up id, error state, and ARIA from the parent <code>Field</code>.</>}
          >
            <InputKnobs />
          </Section>

          <Section
            id="select"
            title="Select"
            desc={<>Wrapped native <code>{'<select>'}</code> with a consistent caret + focus ring. Same size scale as Input.</>}
          >
            <SelectKnobs />
          </Section>

          <Section
            id="textarea"
            title="Textarea"
            desc={<>Multi-line text input. Resizes vertically by default.</>}
          >
            <TextareaKnobs />
          </Section>

          <Section
            id="checkbox"
            title="Checkbox"
            desc={<>Boolean control with a colored check icon when on. Use for non-exclusive options.</>}
          >
            <CheckboxKnobs />
          </Section>

          <Section
            id="radio"
            title="RadioGroup"
            desc={<>Mutually exclusive options. <code>RadioGroup</code> takes <code>name</code>, <code>value</code>, <code>onChange</code>, optional <code>layout</code> (row/column). Children are <code>Radio</code> with a <code>value</code>.</>}
          >
            <RadioKnobs />
          </Section>

          <Section
            id="checkbox-group"
            title="CheckboxGroup"
            desc={<>Multi-select group of checkboxes. <code>CheckboxGroup</code> holds <code>value</code> (string[]) + <code>onChange</code>. Children are <code>CheckboxGroupItem</code> with a <code>value</code> key. Supports row/column layout.</>}
          >
            <CheckboxGroupKnobs />
          </Section>

          <Section
            id="multi-select"
            title="MultiSelect"
            desc={<>Dropdown that lets users pick multiple items from an <code>options</code> array. Displays a summary of the selection. Click outside or press Esc to close.</>}
          >
            <MultiSelectKnobs />
          </Section>

          <Section
            id="number-input"
            title="NumberInput"
            desc={<>A number field with decrement/increment buttons. Respects <code>min</code>, <code>max</code>, and <code>step</code>. Buttons disable at the bounds. Spinner arrows are hidden via CSS.</>}
          >
            <NumberInputKnobs />
          </Section>

          <Section
            id="range-slider"
            title="RangeSlider"
            desc={<>Styled <code>{'<input type="range">'}</code> with a filled track that updates via a CSS variable and a value readout. Pass <code>showValue={'{false}'}</code> to hide the label.</>}
          >
            <RangeSliderKnobs />
          </Section>

          <Section
            id="date-input"
            title="Date"
            desc={<><code>DatePicker</code> — calendar popup via Radix Popover with month navigation, today indicator, and clear. <code>DateInput</code> — lightweight wrapper around the native <code>{'<input type="date">'}</code> family for simpler contexts.</>}
          >
            <DateInputKnobs />
          </Section>

          <Section
            id="time-input"
            title="Time"
            desc={<><code>TimePicker</code> — scrollable time-slot list (configurable step) in a Radix Popover. <code>TimeInput</code> — native <code>{'<input type="time">'}</code> wrapper for simpler contexts.</>}
          >
            <TimeInputKnobs />
          </Section>

          <Section
            id="color-input"
            title="ColorInput"
            desc={<>A styled color swatch + hex readout. Clicking anywhere opens the native color picker. The swatch uses <code>{'<input type="color">'}</code> with vendor-prefixed chrome removed.</>}
          >
            <ColorInputKnobs />
          </Section>

          <Section
            id="file-input"
            title="FileInput"
            desc={<>Custom file upload control. A styled button triggers the hidden native input; selected filename is shown alongside. Supports <code>multiple</code>, <code>accept</code>, and <code>disabled</code>.</>}
          >
            <FileInputKnobs />
          </Section>

          <Section
            id="custom-select"
            title="CustomSelect"
            desc={<>Radix UI–powered select with consistent cross-browser styling, keyboard navigation, animated dropdown, and grouped options. Replaces the native <code>{'<select>'}</code> chrome entirely.</>}
          >
            <CustomSelectKnobs />
          </Section>

          <Section
            id="filter-bar"
            title="FilterBar"
            desc={<><code>FilterBar</code> is a horizontal row of labeled controls (<code>FilterItem</code> children) with an optional action button. Collapses to a 2-column grid on mobile. Used in the student profile admin panel.</>}
          >
            <FilterBarKnobs />
          </Section>

          <Section
            id="field-form"
            title="Field / Form example"
            desc={<><code>Field</code> wraps any control with a label, optional <code>help</code> text, or an <code>error</code> message. Four complete examples — switch with the knob.</>}
          >
            <FieldFormKnobs />
          </Section>

          <Section
            id="chart-line"
            title="Line chart"
            desc={<>Nivo <code>ResponsiveLine</code> + <code>SliceTooltip</code> wrapped in a <code>ChartCard</code>. Pattern used for trend charts across the dashboard, motivation, integrity, and habits pages.</>}
          >
            <LineChartKnobs />
          </Section>

          <Section
            id="chart-bar-grouped"
            title="Grouped bar chart"
            desc={<>Nivo <code>ResponsiveBar</code> with <code>groupMode="grouped"</code> + <code>BarTooltip</code>. Used for "this vs district" or "actual vs expected" comparisons.</>}
          >
            <GroupedBarKnobs />
          </Section>

          <Section
            id="chart-bar-h"
            title="Horizontal bar chart"
            desc={<>Nivo <code>ResponsiveBar</code> with <code>layout="horizontal"</code>. Used for school rankings and per-grade growth comparisons.</>}
          >
            <HorizontalBarKnobs />
          </Section>

          <Section
            id="chart-scatter"
            title="Scatter chart"
            desc={<>Nivo <code>ResponsiveScatterPlot</code> with a highlighted "this school" series and a reference marker. Used on the Skills (Lexile) page.</>}
          >
            <ScatterKnobs />
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
            <div style={{ marginTop: 20 }}>
              <div className="pt-variant-label">Table inside ChartCard — <code>bodyPad="flush"</code> + <code>flush</code> on Table</div>
              <ChartCard
                title="Schools by RMI"
                subtitle="Current year average"
                accent="#E8866A"
                bodyPad="flush"
              >
                <Table
                  flush
                  columns={[
                    { key: 'name',     label: 'School' },
                    { key: 'students', label: 'Students', align: 'right', render: v => v.toLocaleString() },
                    { key: 'rmi',      label: 'RMI',      align: 'right' },
                    { key: 'delta',    label: 'YoY',      align: 'right', render: v => (
                      <span style={{ color: v >= 0 ? '#16A34A' : '#DC2626', fontWeight: 700 }}>
                        {v >= 0 ? '↑' : '↓'}{Math.abs(v)} pts
                      </span>
                    )},
                  ]}
                  rows={TABLE_ROWS}
                  zebra
                />
              </ChartCard>
            </div>
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
            <ChartLegendKnobs />
          </Section>

          <Section
            id="bar-list"
            title="BarList"
            desc={<>Horizontal bar-list for ranked breakdowns, factor scores, and icon lists. Three variants: <code>simple</code> (label + bar + value), <code>grouped</code> (icon + sublabel + bar + score/delta, optionally side-by-side via <code>layout="columns"</code>), and <code>iconList</code> (prefix + icon + label, no bar). Set <code>labelWidth</code> to pin the meta column width and align bars across rows.</>}
          >
            <BarListKnobs />
          </Section>

          <Section
            id="funnel"
            title="Funnel"
            desc={<>Stage-card funnel for conversion / habit-depth flows. Each step is a card with the count, % of total, optional <code>↑Δpp</code>, stage label, and note. A drop-off annotation is computed and rendered between consecutive cards. Stacks vertically — mobile-friendly by default.</>}
          >
            <Variant label="Student Engagement Funnel" bare>
              <ChartCard title="Student Engagement Funnel" subtitle="Habit depth across 1,650 students" accent="#0DA7BC" bodyPad="padded" span={2}>
                <Funnel
                  accent="#0DA7BC"
                  dropoffLabel="students not yet forming next habit"
                  items={[
                    { stage: 'Enrolled Students',  note: 'Active roster in Beanstack',   count: 1650, pct: 100 },
                    { stage: 'Logged This Month',  note: 'At least 1 log in May 2025',   count: 1040, pct: 63, delta: 4 },
                    { stage: 'Weekly Habit',       note: '1+ log every week for 4+ weeks', count: 660,  pct: 40, delta: 6 },
                    { stage: 'Daily Habit',        note: '5+ days logged per week',      count: 297,  pct: 18, delta: 3 },
                    { stage: '30-Day Streak',      note: 'Unbroken streak ≥ 30 days',    count: 165,  pct: 10, delta: 2 },
                  ]}
                />
              </ChartCard>
            </Variant>
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
            desc={<>Single alert tile. Props: <code>level</code> (critical | warning | positive | info), <code>title</code> (bold prefix), <code>description</code> (longer text), <code>action</code>, <code>onAction</code>. Collapses to stacked layout on narrow viewports.</>}
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
            desc={<>"‹ Back to X" link styled like a breadcrumb. Renders as a button or anchor. Props: <code>label</code>, <code>onClick</code> or <code>href</code>. Lives at the top of a content area against the page background; the preview wraps it in a grey frame so it's visible.</>}
          >
            <div className="pt-variant-frame pt-variant-frame--full">
              <BackBar label="Back to Overview" onClick={() => {}} />
            </div>
          </Section>


          <Section
            id="sidebar"
            title="Sidebar"
            desc={<>The full navigation chrome used by every admin prototype — narrow Beanstack rail (MainRail) + the blue gradient sidebar. Props: <code>nav</code>, <code>active</code>, <code>onNavigate</code>, <code>title</code>, <code>subtitle</code>, <code>badges</code>, <code>picker</code> slot (typically <code>SchoolPicker</code>), <code>mainRailIndex</code>.</>}
          >
            <SidebarKnobs />
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
            id="tabs"
            title="Tabs"
            desc={<>Underline-style tab bar. Apply <code>bp-adm-tab--active</code> to the selected tab.</>}
          >
            <div className="bp-adm-tabs" style={{ maxWidth: 400 }}>
              {["Daily Reading", "Students", "Earned Rewards"].map((t, i) => (
                <div key={t} className={`bp-adm-tab${i === 0 ? " bp-adm-tab--active" : ""}`}>{t}</div>
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
      <BreakpointIndicator />
    </>
  )
}
