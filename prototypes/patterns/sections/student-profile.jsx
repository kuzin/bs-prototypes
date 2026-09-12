// Pattern Library — Student Profile group.
// Showcases the prototype-specific kit + chart widgets that live in
// prototypes/student-profile/components/ (styles in that prototype's
// BeanstackProfile.css, imported by catalog.jsx).
import { useState } from 'react'
import { Modal } from '@components/Modal/Modal'
import { Button } from '@components/Button/Button'
import { StudentProfileView, STUDENT_ORDER } from '../../student-profile/BeanstackProfile'
// The panel's width lives with the wrapper: `.modal--side:has(.stp-content)`
// widens the 560px side variant to 880px for a profile. Every consumer imports
// this same sheet.
import '../../ris/components/StudentPanel.css'
import { StatusBadge, GoalRing, CoverImage } from '../../student-profile/components/kit'
import {
  DonutChart,
  SplitDonutChart,
  ReadingHeatmap,
  GoalTracker,
} from '../../student-profile/components/widgets'
import { Knobs, Variant } from './_shared'
import { Field, Select } from '@components/Form/Form'

const MOTIVATION = '#F26430'

// Deterministic demo heatmap data for the most-recent window (≈Feb–May 2025).
const DEMO_HEATMAP = (() => {
  const map = {}
  const start = new Date('2025-02-01')
  const end = new Date('2025-05-15')
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10)
    const weekend = d.getDay() === 0 || d.getDay() === 6
    const n = (d.getDate() * 17 + d.getMonth() * 31) % 100
    map[key] = n < (weekend ? 58 : 32) ? 0 : 15 + (n % 30)
  }
  return map
})()

const DEMO_WEEK = {
  label: 'May 11–17',
  current: true,
  days: [
    { day: 'Sun', minutes: 35 },
    { day: 'Mon', minutes: 40 },
    { day: 'Tue', minutes: 0 },
    { day: 'Wed', minutes: 12 },
    { day: 'Thu', minutes: 40 },
    { day: 'Fri', minutes: null },
    { day: 'Sat', minutes: null },
  ],
}

// The side panel as the prototypes actually build it: the shared Modal's `side`
// variant hosting the real `StudentProfileView`. RIS, Engagement Signals and
// Words with Benny each mount exactly this, so the demo is the thing itself
// rather than a mock of it.
function StudentPanelShowcase() {
  const [open, setOpen] = useState(false)
  const [studentKey, setStudentKey] = useState(STUDENT_ORDER[0])
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      <Knobs examples={false}>
        <Field label="student">
          <Select value={studentKey} onChange={(e) => setStudentKey(e.target.value)}>
            {STUDENT_ORDER.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </Select>
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Button onClick={() => setOpen(true)}>Open student panel</Button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} variant="side" ariaLabel="Student profile">
        {({ close }) => (
          <div className={`stp-content${expanded ? ' stp-content--full' : ''}`}>
            <StudentProfileView
              studentKey={studentKey}
              onClose={close}
              expanded={expanded}
              onToggleExpand={() => setExpanded((v) => !v)}
            />
          </div>
        )}
      </Modal>
    </>
  )
}

export const studentProfileSections = [
  {
    group: 'student-profile',
    id: 'sp-panel',
    name: 'Student Panel',
    usage: `import { Modal } from '@components/Modal/Modal'
import { StudentProfileView } from '../student-profile/BeanstackProfile'

<Modal open={!!student} onClose={close} variant="side" ariaLabel="Student profile">
  {({ close }) => (
    <StudentProfileView
      studentKey={profileKey}
      onClose={close}
      expanded={expanded}
      onToggleExpand={() => setExpanded((v) => !v)}
    />
  )}
</Modal>`,
    desc: (
      <>
        The whole profile as a right-slide panel — the shared <code>Modal</code>&apos;s{' '}
        <code>side</code> variant hosting <code>StudentProfileView</code>. It&apos;s how a reader is
        opened from a list without leaving it, and <strong>RIS</strong>,{' '}
        <strong>Engagement Signals</strong> and <strong>Words with Benny</strong> each mount exactly
        this shape.
        <br />
        <br />
        The panel owns its width — <code>.modal--side:has(.stp-content)</code> widens the 560px side
        variant to 880px, and expanding to full width is the host&apos;s call; the profile&apos;s
        control rail only asks, via <code>onToggleExpand</code>. Wrap the view in{' '}
        <code>.stp-content</code> and import <code>ris/components/StudentPanel.css</code>, which is
        what all four consumers do. <code>StudentProfileView</code> also takes{' '}
        <code>initialSection</code>, <code>extraNav</code> / <code>renderExtra</code> (how Words
        with Benny adds its Collections tab), <code>renderAfterSummary</code> and{' '}
        <code>overrides</code>.
        <br />
        <br />
        It lives here rather than on the <code>Modal</code> page because the panel is a composition,
        not a Modal variant — the Modal only supplies the slide-in frame.
      </>
    ),
    render: () => (
      <>
        <StudentPanelShowcase />
      </>
    ),
  },
  {
    group: 'student-profile',
    id: 'sp-status-badge',
    name: 'StatusBadge',
    desc: (
      <>
        Trend pill for a reading-health area. <code>label</code> drives the icon + color:{' '}
        <code>Strong</code>, <code>Improving</code>, <code>Trending up</code>, or <code>Watch</code>
        . Pass <code>accent</code> to override the background.
      </>
    ),
    render: () => (
      <div className="bp-root">
        <Variant label="labels">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <StatusBadge label="Strong" />
            <StatusBadge label="Improving" />
            <StatusBadge label="Trending up" />
            <StatusBadge label="Watch" />
          </div>
        </Variant>
      </div>
    ),
  },
  {
    group: 'student-profile',
    id: 'sp-goal-ring',
    name: 'GoalRing',
    desc: (
      <>
        Daily-minutes progress ring. Fills toward <code>goal</code> and states only what was logged
        — the goal itself belongs in the caller's label. Once <code>minutes ≥ goal</code> the value
        takes the accent color and gains a check. <code>null</code> minutes renders an empty “–”
        ring.
      </>
    ),
    render: () => (
      <div className="bp-root">
        <Variant label="in progress · met · not logged">
          <div
            style={{
              display: 'flex',
              gap: 24,
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            <GoalRing minutes={18} goal={30} color={MOTIVATION} />
            <GoalRing minutes={32} goal={30} color={MOTIVATION} />
            <GoalRing minutes={null} goal={30} color={MOTIVATION} />
          </div>
        </Variant>
      </div>
    ),
  },
  {
    group: 'student-profile',
    id: 'sp-donuts',
    name: 'Donut charts',
    desc: (
      <>
        RMI rings. <code>DonutChart</code> shows one score over <code>max</code>;{' '}
        <code>SplitDonutChart</code> stacks intrinsic (accent) + extrinsic (slate) on one ring for
        an overall total.
      </>
    ),
    render: () => (
      <div className="bp-root">
        <Variant label="intrinsic · overall (split) · extrinsic">
          <div className="bp-rmi-donuts" style={{ display: 'flex', gap: 24 }}>
            <DonutChart value={19.2} max={20} label="Intrinsic" color={MOTIVATION} />
            <SplitDonutChart
              intrinsicVal={19.2}
              extrinsicVal={17.8}
              max={40}
              label="Overall"
              intrinsicColor={MOTIVATION}
            />
            <DonutChart value={17.8} max={20} label="Extrinsic" color="#ACACAC" />
          </div>
        </Variant>
      </div>
    ),
  },
  {
    group: 'student-profile',
    id: 'sp-goal-tracker',
    name: 'GoalTracker',
    desc: (
      <>
        One week of daily goals as connected stars. Met days light up gold and link with a
        connector; a day logged short of goal gets a tinted star with its minutes in grey, so it
        never reads as a zero. <code>minutes: 0</code> is a miss and <code>null</code> is a
        future/today day.
      </>
    ),
    render: () => (
      <div className="bp-root">
        <Variant label="current week (goal 30 min) · met · miss · partial · today">
          <GoalTracker week={DEMO_WEEK} goalMinutes={30} />
        </Variant>
      </div>
    ),
  },
  {
    group: 'student-profile',
    id: 'sp-reading-heatmap',
    name: 'ReadingHeatmap',
    desc: (
      <>
        GitHub-style reading-activity grid over a rolling 3-month window (use the arrows to page
        back). Filled cells scale with the accent <code>color</code>; goal-met and streak days get a
        ring. Hover a cell for the day’s detail.
      </>
    ),
    render: () => (
      <div className="bp-root">
        <Variant label="rolling 3-month window">
          <ReadingHeatmap goalMinutes={30} color="#60A5FA" data={DEMO_HEATMAP} />
        </Variant>
      </div>
    ),
  },
  {
    group: 'student-profile',
    id: 'sp-cover-image',
    name: 'CoverImage',
    desc: (
      <>
        Book cover from Open Library by <code>isbn</code>, with a colored, title-seeded placeholder
        fallback when the cover is missing.
      </>
    ),
    render: () => (
      <div className="bp-root">
        <Variant label="cover · placeholder fallback">
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <CoverImage isbn="9780312367541" title="A Wrinkle in Time" />
            <CoverImage isbn="0000000000000" title="Missing Cover" />
          </div>
        </Variant>
      </div>
    ),
  },
]
