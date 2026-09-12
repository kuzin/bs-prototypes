import { useState } from 'react'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import {
  ChallengeCard,
  ChallengeScope,
  GoalCard,
  LeaderboardCard,
  ReaderPill,
  ReaderTopBar,
  StreakBanner,
} from '@components/ReaderApp/ReaderApp'
import { PartnerSwitcher } from '@components/PartnerConnect/PartnerConnect'
import { CONNECTIONS } from '../../logging-flow/connections'
import { Variant } from './_shared'

const noop = () => {}

const READER = { initials: 'OM', name: 'Olivia' }

const OTHER_READERS = [
  { id: 'noah', name: 'Noah Martinez', initials: 'NM', color: '#7C5CFA' },
  { id: 'mia', name: 'Mia Chen', initials: 'MC', color: '#0DA7BC' },
  { id: 'liam', name: 'Liam Park', initials: 'LP', color: '#16A97A' },
]

const CHALLENGES = [
  {
    id: 'spring',
    title: 'Spring Into Reading',
    dates: 'Apr 1 — Apr 30',
    badge: 'Minutes',
    art: 'spring',
  },
  { id: 'love-hurts', title: 'Love Hurts', dates: 'Ongoing', badge: 'Minutes', art: 'love-hurts' },
  {
    id: 'arresting',
    title: 'Arresting Strangeness',
    dates: 'Jun 1 — Jun 30',
    badge: 'Books',
    art: 'arresting',
  },
]

const TOP_SCHOOLS = [
  { rank: 1, name: 'Magnolia Middle', value: 198, color: '#F59E0B' },
  { rank: 2, name: 'Oak Elementary', value: 157, color: '#94A3B8' },
  { rank: 3, name: 'Hickory Middle School', value: 104, color: '#C2884F' },
]

const TOP_GRADES = [
  { rank: 1, name: '6th grade', value: 412, color: '#F59E0B' },
  { rank: 2, name: '5th grade', value: 388, color: '#94A3B8' },
  { rank: 3, name: '7th grade', value: 271, color: '#C2884F' },
]

// The bar is sticky and full-bleed; inside a showcase card it wants a plain
// block to sit in so it doesn't try to pin itself to the page.
function BarFrame({ children }) {
  return (
    <div style={{ position: 'relative', background: '#fff', overflowX: 'auto' }}>
      <div style={{ minWidth: 880 }}>{children}</div>
    </div>
  )
}

function TopBarDemo() {
  const [tab, setTab] = useState('challenges')
  return (
    <BarFrame>
      <ReaderTopBar
        reader={READER}
        otherReaders={OTHER_READERS}
        active={tab}
        onTabChange={setTab}
        onHome={() => setTab('challenges')}
        beforeUser={
          <PartnerSwitcher
            partners={[CONNECTIONS.comicsplus, CONNECTIONS.scholastic]}
            connections={{ comicsplus: { username: 'olivia.m' } }}
            onManage={noop}
            onVisit={noop}
          />
        }
      />
    </BarFrame>
  )
}

function ScopeDemo() {
  const [scope, setScope] = useState('current')
  return <ChallengeScope value={scope} onChange={setScope} />
}

export const readerAppSections = [
  {
    group: 'navigation',
    id: 'reader-top-bar',
    name: 'ReaderTopBar',
    usage: `import { ReaderTopBar } from '@components/ReaderApp/ReaderApp'

<ReaderTopBar
  reader={reader}
  otherReaders={others}
  onLog={openLogFlow}
  onHome={goHome}
  onAccount={openSettings}
  active={view}
  onTabChange={setView}
/>`,
    desc: (
      <>
        The reader app&apos;s chrome: logo, the logging actions, the reader pill and account gear,
        with the site tabs underneath. Every prototype that renders the reader-facing Beanstack uses
        this one bar. Defaults to the full-strength version and each option takes something away:{' '}
        <code>onHome</code> omitted leaves the logo static, an empty <code>otherReaders</code> makes
        the pill a label rather than a switcher, <code>accountMenu={'{false}'}</code> turns the gear
        into a plain button, <code>secondaryActions={'{false}'}</code> leaves only &ldquo;Log
        Reading&rdquo;, and <code>actions</code> replaces the action row outright. Below 1120px the
        secondary actions fold into a &ldquo;···&rdquo; flyout on their own. <code>beforeUser</code>{' '}
        is a slot ahead of the pill — the partner app switcher lives there.
      </>
    ),
    render: () => (
      <>
        <Variant label="the full bar — reader switcher, account menu, linked-app switcher" full>
          <TopBarDemo />
        </Variant>
        <Variant label="secondaryActions={false} + accountMenu={false} — beeverso's bar" full>
          <BarFrame>
            <ReaderTopBar
              reader={{ initials: 'CR', name: 'Carla' }}
              secondaryActions={false}
              accountMenu={false}
              onAccount={noop}
              hideTabs={['reviews']}
              active="challenges"
            />
          </BarFrame>
        </Variant>
        <Variant label="actions + tabs — a page whose buttons and nav are its own" full>
          <BarFrame>
            <ReaderTopBar
              reader={READER}
              accountMenu={false}
              accent="#0DA7BC"
              active="challenges"
              tabs={[
                { id: 'challenges', label: 'Challenges' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'all-badges', label: 'All Badges' },
                { id: 'wish-list', label: 'Wish List' },
              ]}
              actions={
                <>
                  <Button variant="primary" size="sm">
                    Log Reading and Activities
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Icon name="chevron-down" size={13} />}
                  >
                    Add Review
                  </Button>
                </>
              }
            />
          </BarFrame>
        </Variant>
      </>
    ),
  },
  {
    group: 'navigation',
    id: 'reader-pill',
    name: 'ReaderPill',
    usage: `import { ReaderPill } from '@components/ReaderApp/ReaderApp'

<ReaderPill reader={{ initials: 'OM', name: 'Olivia' }} otherReaders={others} />`,
    desc: (
      <>
        The reader&apos;s avatar and name in the top bar. With <code>otherReaders</code> it opens
        the household switcher — the current reader with an Edit button, everyone else on the
        account, and &ldquo;Add a Reader&rdquo;. Without them it renders as a label: a one-reader
        prototype shouldn&apos;t offer a menu that can&apos;t go anywhere.
      </>
    ),
    render: () => (
      <>
        <Variant label="with other readers — a switcher">
          <ReaderPill reader={READER} otherReaders={OTHER_READERS} />
        </Variant>
        <Variant label="on its own — a label">
          <ReaderPill reader={READER} />
        </Variant>
      </>
    ),
  },
  {
    group: 'feedback',
    id: 'reader-streak-banner',
    name: 'StreakBanner',
    usage: `import { StreakBanner } from '@components/ReaderApp/ReaderApp'

<StreakBanner streak={{ current: 4 }} onLog={openLogFlow} />`,
    desc: (
      <>
        The reading-streak banner across the top of the reader dashboard. Reads its own copy and its
        button off <code>streak.current</code> — a live streak says how long it is and offers
        &ldquo;Log Today&rdquo;, a cold one explains how to start one and offers &ldquo;View
        Streaks&rdquo;. The button is <code>variant=&quot;accent&quot;</code> in the banner&apos;s
        red rather than <code>danger</code>: it wants the colour, but nothing here is destructive.
        Pass <code>message</code> to say something more specific about where the streak comes from.
      </>
    ),
    render: () => (
      <>
        <Variant label="no streak yet" full>
          <StreakBanner streak={{ current: 0 }} onLog={noop} />
        </Variant>
        <Variant label="a live streak" full>
          <StreakBanner streak={{ current: 12 }} onLog={noop} />
        </Variant>
        <Variant label="message — beeverso names where the reading came from" full>
          <StreakBanner
            streak={{ current: 4 }}
            onLog={noop}
            message={
              <>
                <strong>4-day streak!</strong> Reading in your linked apps counts toward it too.
              </>
            }
          />
        </Variant>
      </>
    ),
  },
  {
    group: 'domain',
    id: 'reader-challenge-card',
    name: 'ChallengeCard',
    usage: `import { ChallengeCard, CHALLENGE_ART } from '@components/ReaderApp/ReaderApp'

<ChallengeCard challenge={{ title, dates, badge, art: 'spring' }} />`,
    desc: (
      <>
        One challenge in the reader&apos;s challenge grid — cover art over the name, the dates, and
        what the challenge measures. <code>art</code> keys into <code>CHALLENGE_ART</code>, the
        illustrated covers; an unknown key falls back to the first. What the challenge measures sits
        beside the name rather than floated over the artwork: the art is the challenge&apos;s
        identity, and the pill used to cover whatever part of it landed in that corner.
      </>
    ),
    render: () => (
      <Variant label="the three covers, in a grid" full>
        <div className="wa-chgrid" style={{ padding: 16 }}>
          {CHALLENGES.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      </Variant>
    ),
  },
  {
    group: 'domain',
    id: 'reader-challenge-scope',
    name: 'ChallengeScope',
    usage: `import { ChallengeScope } from '@components/ReaderApp/ReaderApp'

<ChallengeScope value={scope} onChange={setScope} />`,
    desc: (
      <>
        Current / Past / Ignored, beside the &ldquo;Challenges&rdquo; heading — which of a
        reader&apos;s challenges the grid below is showing. Pass <code>scopes</code> to change the
        three options.
      </>
    ),
    render: () => (
      <Variant label="pick a scope">
        <ScopeDemo />
      </Variant>
    ),
  },
  {
    group: 'domain',
    id: 'reader-goal-card',
    name: 'GoalCard',
    usage: `import { GoalCard } from '@components/ReaderApp/ReaderApp'

<GoalCard dailyGoal={{ minutes: 14, goal: 20 }} />`,
    desc: (
      <>
        Today&apos;s reading against the reader&apos;s daily goal, in the dashboard rail. Three
        states off one pair of numbers: nothing logged yet is &ldquo;Today&apos;s Goal&rdquo;,
        part-way is &ldquo;Almost there!&rdquo;, and hitting it turns the meter green and says
        &ldquo;Well done!&rdquo;. The remaining-minutes line pluralises itself.
      </>
    ),
    render: () => (
      <>
        <Variant label="nothing logged yet">
          <div style={{ width: 320 }}>
            <GoalCard dailyGoal={{ minutes: 0, goal: 20 }} />
          </div>
        </Variant>
        <Variant label="part-way — one minute to go">
          <div style={{ width: 320 }}>
            <GoalCard dailyGoal={{ minutes: 19, goal: 20 }} />
          </div>
        </Variant>
        <Variant label="goal met">
          <div style={{ width: 320 }}>
            <GoalCard dailyGoal={{ minutes: 42, goal: 20 }} />
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'domain',
    id: 'reader-leaderboard-card',
    name: 'LeaderboardCard',
    usage: `import { LeaderboardCard } from '@components/ReaderApp/ReaderApp'

<LeaderboardCard schools={TOP_SCHOOLS} grades={TOP_GRADES} />`,
    desc: (
      <>
        The dashboard rail&apos;s leaderboard, ported from the shipped widget (
        <code>_leaderboard_widget.html.haml</code>): folder tabs on top of a bordered panel, the two
        range pickers on a grey band across the panel&apos;s head, the rows with no dividers between
        them, then &ldquo;View all&rdquo; behind a rule of its own. Rows are{' '}
        <code>{'{ rank, name, value, color }'}</code> — the colour is the rank disc&apos;s, so gold
        / silver / bronze are the data&apos;s business, not the component&apos;s.
      </>
    ),
    render: () => (
      <Variant label="switch between schools and grades">
        <div style={{ width: 320 }}>
          <LeaderboardCard schools={TOP_SCHOOLS} grades={TOP_GRADES} />
        </div>
      </Variant>
    ),
  },
]
