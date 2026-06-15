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
import { RMI_FACTORS } from '../../ris/data'
import { Knobs, Variant } from './_shared'

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
]
