// Pattern Library — Student Profile group.
// Showcases the prototype-specific kit + chart widgets that live in
// prototypes/student-profile/components/ (styles in that prototype's
// BeanstackProfile.css, imported by catalog.jsx).
import { StatusBadge, GoalRing, CoverImage } from '../../student-profile/components/kit'
import {
  DonutChart,
  SplitDonutChart,
  ReadingHeatmap,
  GoalTracker,
} from '../../student-profile/components/widgets'
import { Variant } from './_shared'

const MOTIVATION = '#E8866A'

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
    { day: 'Wed', minutes: 32 },
    { day: 'Thu', minutes: 40 },
    { day: 'Fri', minutes: null },
    { day: 'Sat', minutes: null },
  ],
}

export const studentProfileSections = [
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
        Daily-minutes progress ring. Fills toward <code>goal</code>; once{' '}
        <code>minutes ≥ goal</code> it flips to a green check. <code>null</code> minutes renders an
        empty “–” ring.
      </>
    ),
    render: () => (
      <div className="bp-root">
        <Variant label="in progress · met · not logged">
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
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
            <DonutChart value={17.8} max={20} label="Extrinsic" color="#94A3B8" />
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
        One week of daily goals as connected stars. Met days light up and link with a connector;{' '}
        <code>minutes: 0</code> is a miss and <code>null</code> is a future/today day.
      </>
    ),
    render: () => (
      <div className="bp-root">
        <Variant label="current week (goal 30 min)">
          <div style={{ maxWidth: 360 }}>
            <GoalTracker week={DEMO_WEEK} goalMinutes={30} />
          </div>
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
          <div style={{ maxWidth: 460 }}>
            <ReadingHeatmap goalMinutes={30} color="#60A5FA" data={DEMO_HEATMAP} />
          </div>
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
