import { useState } from 'react'
import {
  SECTIONS as HEALTH_SECTIONS,
} from '@components/ReadingHealth/ReadingHealth'
import { Hero } from '@components/Hero/Hero'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { SchoolPicker, Sidebar } from '@components/Sidebar/Sidebar'
import { Button } from '@components/Button/Button'
import { BackBar } from '@components/BackBar/BackBar'
import { Toggle } from '@components/Toggle/Toggle'
import { Field, Input, Select } from '@components/Form/Form'
import { SCHOOLS } from '../../ris/data'
import { Knobs } from './_shared'

const SIDEBAR_NAV_SETS = {
  ris: {
    label: 'RIS district (7 items + subgroup)',
    subtitle: 'District View',
    items: [
      { id: 'dashboard', label: 'Overview', icon: 'overview' },
      {
        id: 'motivation',
        label: 'Motivation',
        icon: 'flame',
        subgroup: true,
        section: 'Reading Health',
      },
      {
        id: 'integrity',
        label: 'Integrity',
        icon: 'shield',
        subgroup: true,
        section: 'Reading Health',
      },
      { id: 'habits', label: 'Habits', icon: 'habits', subgroup: true, section: 'Reading Health' },
      { id: 'skills', label: 'Skills', icon: 'book', subgroup: true, section: 'Reading Health' },
      { id: 'analytics', label: 'Analytics', icon: 'analytics', section: 'Data' },
      { id: 'demographics', label: 'Demographics', icon: 'demographics', section: 'Data' },
    ],
  },
  school: {
    label: 'School view (4 items)',
    subtitle: 'School View',
    items: [
      { id: 'dashboard', label: 'Overview', icon: 'overview' },
      { id: 'habits', label: 'Reading Habits', icon: 'habits', section: 'Reports' },
      { id: 'lexile', label: 'Lexile Growth', icon: 'lexile', section: 'Reports' },
    ],
  },
  minimal: {
    label: 'Minimal (3 items, no subgroup)',
    subtitle: undefined,
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'overview' },
      { id: 'habits', label: 'Habits', icon: 'habits', section: 'Main' },
      { id: 'skills', label: 'Skills', icon: 'book', section: 'Main' },
    ],
  },
}

function SidebarKnobs() {
  const [navSet, setNavSet] = useState('ris')
  const [active, setActive] = useState('dashboard')
  const [withPicker, setPicker] = useState(true)
  const [withBadge, setBadge] = useState(true)
  const [title, setTitle] = useState('Reading Information System')
  const [subtitle, setSubtitle] = useState('District View')
  const [schoolId, setSchoolId] = useState('lincoln')

  const set = SIDEBAR_NAV_SETS[navSet]
  return (
    <>
      <Knobs>
        <Field label="nav set">
          <Select
            value={navSet}
            onChange={(e) => {
              const next = e.target.value
              setNavSet(next)
              setActive(SIDEBAR_NAV_SETS[next].items[0].id)
              setSubtitle(SIDEBAR_NAV_SETS[next].subtitle || '')
            }}
          >
            {Object.entries(SIDEBAR_NAV_SETS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="subtitle">
          <Input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="(none)"
          />
        </Field>
        <Field label="alert badge">
          <Toggle checked={withBadge} onChange={setBadge} />
        </Field>
        <Field label="picker">
          <Toggle checked={withPicker} onChange={setPicker} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--full pt-sidebar-demo">
        <Sidebar
          nav={set.items}
          active={active}
          onNavigate={setActive}
          title={title || undefined}
          subtitle={subtitle || undefined}
          badges={withBadge && set.items.some((i) => i.id === 'dashboard') ? { dashboard: 3 } : {}}
          picker={
            withPicker && (
              <SchoolPicker schools={SCHOOLS} schoolId={schoolId} onSchoolId={setSchoolId} />
            )
          }
        />
        <div className="pt-sidebar-demo-content">
          <span>active = "{active}"</span>
        </div>
      </div>
    </>
  )
}

function HeroKnobs() {
  const [mode, setMode] = useState('bucket')
  const [bucket, setBucket] = useState('motivation')
  const [title, setTitle] = useState('Lincoln Elementary')
  const [subtitle, setSubtitle] = useState('K–5 · 1,650 students')
  const [initials, setInitials] = useState('LE')
  const [accent, setAccent] = useState('#E8866A')
  const [accentBg, setAccentBg] = useState('#FDF1ED')
  const [withAction, setAction] = useState(true)
  const [withScore, setWithScore] = useState(true)
  const [score, setScore] = useState(71)
  const [delta, setDelta] = useState(7)

  const modeSelect = (
    <Field label="mode">
      <Select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="bucket">bucket (auto)</option>
        <option value="avatar">avatar (overview)</option>
        <option value="icon">icon (page)</option>
      </Select>
    </Field>
  )
  const actionToggle = (
    <Field label="action">
      <Toggle checked={withAction} onChange={setAction} />
    </Field>
  )
  const actionNode = withAction ? (
    <>
      <Button variant="ghost" size="lg">
        Export
      </Button>
      <Button variant="primary" size="lg">
        Log reading
      </Button>
    </>
  ) : undefined

  if (mode === 'bucket') {
    return (
      <>
        <Knobs>
          {modeSelect}
          <Field label="bucket">
            <Select value={bucket} onChange={(e) => setBucket(e.target.value)}>
              <option>motivation</option>
              <option>integrity</option>
              <option>habits</option>
              <option>skills</option>
            </Select>
          </Field>
          <Field label="accentBg">
            <input
              className="pt-color"
              type="color"
              value={accentBg}
              onChange={(e) => setAccentBg(e.target.value)}
            />
          </Field>
          <Field label="score card">
            <Toggle checked={withScore} onChange={setWithScore} />
          </Field>
          {withScore && (
            <Field label="score">
              <Input
                type="number"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
              />
            </Field>
          )}
          {withScore && (
            <Field label="delta">
              <Input
                type="number"
                value={delta}
                onChange={(e) => setDelta(Number(e.target.value))}
              />
            </Field>
          )}
          {actionToggle}
        </Knobs>
        <Hero
          bucket={bucket}
          accentBg={accentBg}
          score={withScore ? score : undefined}
          delta={withScore ? delta : undefined}
          action={actionNode}
        />
      </>
    )
  }
  if (mode === 'avatar') {
    return (
      <>
        <Knobs>
          {modeSelect}
          <Field label="initials">
            <Input value={initials} onChange={(e) => setInitials(e.target.value.slice(0, 2))} />
          </Field>
          <Field label="title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="subtitle">
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </Field>
          <Field label="accent">
            <input
              className="pt-color"
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
            />
          </Field>
          {actionToggle}
        </Knobs>
        <Hero
          initials={initials}
          title={title}
          subtitle={subtitle}
          accent={accent}
          action={actionNode}
        />
      </>
    )
  }
  // icon mode
  const motIcon = HEALTH_SECTIONS.find((s) => s.key === 'motivation')?.icon
  return (
    <>
      <Knobs>
        {modeSelect}
        <Field label="title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="subtitle">
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </Field>
        <Field label="accent">
          <input
            className="pt-color"
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
          />
        </Field>
        {actionToggle}
      </Knobs>
      <Hero icon={motIcon} title={title} subtitle={subtitle} accent={accent} action={actionNode} />
    </>
  )
}

// ── Chart fixtures + chart-card showcase pieces ──────────────────────────

function BackBarKnobs() {
  const [label, setLabel] = useState('Back to Overview')
  const [asAnchor, setAsAnchor] = useState(false)
  return (
    <>
      <Knobs>
        <Field label="label">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} />
        </Field>
        <Field label="anchor (href)">
          <Toggle checked={asAnchor} onChange={setAsAnchor} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--full">
        {asAnchor ? (
          <BackBar label={label} href="#" />
        ) : (
          <BackBar label={label} onClick={() => {}} />
        )}
      </div>
    </>
  )
}

export const layoutSections = [
  {
    group: 'layout',
    id: 'hero',
    name: "Hero",
    desc: (
      <>
                  One unified page header. <code>mode</code> picks between the three shapes:{' '}
                  <code>bucket</code> (auto-derive icon/title/accent from SECTIONS + right-side
                  score), <code>avatar</code> (overview-style), and <code>icon</code>{' '}
                  (analytics-style with subtitle).
                </>
    ),
    render: () => (
      <>
              <HeroKnobs />
            </>
    ),
  },
  {
    group: 'layout',
    id: 'back-bar',
    name: "BackBar",
    desc: (
      <>
                  "‹ Back to X" link styled like a breadcrumb. Renders as a button or anchor. Props:{' '}
                  <code>label</code>, <code>onClick</code> or <code>href</code>. Lives at the top of
                  a content area against the page background; the preview wraps it in a grey frame
                  so it's visible.
                </>
    ),
    render: () => (
      <>
              <BackBarKnobs />
            </>
    ),
  },
  {
    group: 'layout',
    id: 'sidebar',
    name: "Sidebar",
    desc: (
      <>
                  The full navigation chrome used by every admin prototype — narrow Beanstack rail
                  (MainRail) + the blue gradient sidebar. Props: <code>nav</code>,{' '}
                  <code>active</code>, <code>onNavigate</code>, <code>title</code>,{' '}
                  <code>subtitle</code>, <code>badges</code>, <code>picker</code> slot (typically{' '}
                  <code>SchoolPicker</code>), <code>mainRailIndex</code>.
                </>
    ),
    render: () => (
      <>
              <SidebarKnobs />
            </>
    ),
  },
  {
    group: 'layout',
    id: 'prototype-nav',
    name: "PrototypeNav",
    desc: (
      <>
                  Fixed bar at the bottom of every prototype page. Shows the current prototype name
                  with prev/next arrows and a dropdown to jump directly to any other prototype.
                  Props: <code>currentHref</code>.
                </>
    ),
    render: () => (
      <>
              <div className="pt-section-desc">
                The PrototypeNav is rendered at the bottom of this page itself — scroll to see it.
                It picks up the current prototype from <code>currentHref</code> and shows prev/next
                arrows for the other prototypes.
              </div>
            </>
    ),
  },
]
