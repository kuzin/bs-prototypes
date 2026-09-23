import { useState } from 'react'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { Pill } from '@components/Pill/Pill'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { EarnedCard } from '@components/EarnedCard/EarnedCard'
import {
  BannerStack,
  CommunityGoalBanner,
  ReaderBanner,
  ReaderBannerAction,
  ReaderPageHead,
  ReaderBack,
  FundraiserCard,
  ChallengeCard,
  ChallengeScope,
  GoalCard,
  GoalMeter,
  LeaderboardCard,
  MotivationCard,
  ReaderPill,
  ReaderTopBar,
  StreakBanner,
  bannerSrc,
  badgeSrc,
} from '@components/ReaderApp/ReaderApp'
import { PartnerSwitcher } from '@components/PartnerConnect/PartnerConnect'
import { AllBadges } from '../../web-app/components/AllBadges'
import { Friends } from '../../web-app/components/Friends'
import { Leaderboards } from '../../web-app/components/Leaderboards'
import { Reviews } from '../../web-app/components/Reviews'
import { PeerReviews } from '../../web-app/components/PeerReviews'
import { WishList } from '../../web-app/components/WishList'
import { BookLists, BookListPage } from '../../web-app/components/BookLists'
import { FindBooks } from '../../web-app/components/FindBooks'
import { BookPage } from '../../web-app/components/BookPage'
import { ACTIVITY_BADGES, BOOK_LISTS, CATALOG_BY_ID, WISH_LIST } from '../../web-app/data'
import { READING_LOG, LOG_FIXTURES } from '../../logging-flow/data'
import { CONNECTION_LIST } from '../../logging-flow/connections'
import { LogFlow, LogSuccess } from '@components/LogFlow/LogFlow'
import { LogCalendar } from '@components/LogCalendar/LogCalendar'
import { BookCover } from '@components/BookCover/BookCover'
import { EpicImport } from '@components/EpicImport/EpicImport'
import { AchievementArt } from '../../books/components/AchievementArt'
import { FriendRequests } from '@components/FriendRequests/FriendRequests'
import { FriendProfile } from '../../web-app/components/FriendProfile'
import { ChallengePage } from '../../web-app/components/ChallengePage'
import { ProgramHeader } from '@components/ProgramHeader/ProgramHeader'
import { CompleteActivity } from '@components/CompleteActivity/CompleteActivity'
import { ActivityList } from '@components/ActivityList/ActivityList'
import { FundraiserPage, FundraiserWelcome } from '../../web-app/components/FundraiserPage'
import { FUNDRAISER } from '../../web-app/data'
import { MORE_CHALLENGES, REGISTRATION_QUESTIONS } from '../../logging-flow/data'
import { CONNECTIONS } from '../../logging-flow/connections'
import { JoinChallenge, ConfirmUnenroll } from '../../logging-flow/components/Dashboard'
import { Variant } from './_shared'

const noop = () => {}

const READER = { initials: 'OM', name: 'Olivia' }

/* A title with no cover on the CDN and a magazine, so the two placeholders both
   get shown rather than only the happy path. */
const DEMO_BOOK = {
  id: 'demo',
  title: 'The Wild Robot Escapes',
  author: 'Peter Brown',
  cover: ['#2E7D6F', '#14463F'],
}
const DEMO_MAG = {
  id: 'demo-mag',
  kind: 'magazine',
  title: 'Scholastic News',
  masthead: 'Scholastic News',
  issue: 'May 2026 · Save the Bees!',
  cover: ['#D8342B', '#8E1A14'],
}

const OTHER_READERS = [
  { id: 'noah', name: 'Noah Martinez', initials: 'NM', color: '#7C5CFA' },
  { id: 'mia', name: 'Mia Chen', initials: 'MC', color: '#0DA7BC' },
  { id: 'liam', name: 'Liam Park', initials: 'LP', color: '#16A97A' },
]

// Two with a real banner, one on a drawn cover — the card does both.
const CHALLENGES = [
  {
    id: 'spring',
    title: 'Spring Into Reading',
    dates: 'Apr 1 — Apr 30',
    badge: 'Minutes',
    logTypes: ['minutes', 'books'],
    types: ['activities'],
    banner: 'spring-into-reading',
  },
  {
    id: 'love-hurts',
    title: 'For the Love of Reading',
    dates: 'Ongoing',
    badge: 'Minutes',
    logTypes: ['minutes'],
    types: ['reviews'],
    canSelfUnenroll: true,
    banner: 'for-the-love-of-reading',
  },
  {
    id: 'arresting',
    title: 'Lectores del Mundo',
    dates: 'Jun 1 — Jun 30',
    badge: 'Books',
    logTypes: ['books'],
    types: ['bingo'],
    bookTalks: true,
    art: 'lectores',
  },
]

const TOP_SCHOOLS = [
  {
    rank: 1,
    name: 'Magnolia Middle',
    value: 198,
    color: '#F59E0B',
    stats: { week: { minutes: 198, books: 24 }, month: { minutes: 812, books: 97 } },
  },
  {
    rank: 2,
    name: 'Oak Elementary',
    value: 157,
    color: '#94A3B8',
    stats: { week: { minutes: 157, books: 19 }, month: { minutes: 690, books: 81 } },
  },
  {
    rank: 3,
    name: 'Hickory Middle School',
    value: 104,
    color: '#C2884F',
    stats: { week: { minutes: 104, books: 12 }, month: { minutes: 455, books: 58 } },
  },
]

const TOP_GRADES = [
  {
    rank: 1,
    name: '6th grade',
    value: 412,
    color: '#F59E0B',
    stats: { week: { minutes: 412, books: 47 }, month: { minutes: 1680, books: 193 } },
  },
  {
    rank: 2,
    name: '5th grade',
    value: 388,
    color: '#94A3B8',
    stats: { week: { minutes: 388, books: 51 }, month: { minutes: 1544, books: 205 } },
  },
  {
    rank: 3,
    name: '7th grade',
    value: 271,
    color: '#C2884F',
    stats: { week: { minutes: 271, books: 33 }, month: { minutes: 1120, books: 141 } },
  },
]

// The bar is sticky and full-bleed; inside a showcase card it wants a plain
// block to sit in so it doesn't try to pin itself to the page.
/* The logging flow takes the whole screen, so the demo opens it from a button
   the way the reader's top bar does rather than trying to inline it. */
function LogFlowDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Log Reading</Button>
      <LogFlow
        open={open}
        onClose={() => setOpen(false)}
        {...LOG_FIXTURES}
        partners={CONNECTION_LIST}
        site={{ multiDate: true, backlogDays: 14 }}
        dailyGoal={{ minutes: 8, goal: 20 }}
      />
    </>
  )
}

function LogCalendarDemo() {
  const [open, setOpen] = useState(false)
  const [dates, setDates] = useState([])
  const back = (n) => {
    const d = new Date()
    d.setDate(d.getDate() - n)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Select Date
      </Button>
      <LogCalendar
        open={open}
        value={dates}
        logged={[1, 2, 3, 5, 8, 9, 12].map(back)}
        multi
        backlogDays={14}
        onSave={(d) => {
          setDates(d)
          setOpen(false)
        }}
        onClose={() => setOpen(false)}
      />
    </>
  )
}

/* The three kinds of thing a log can win, which is what the earned cards are
   for: a badge with its payout, a challenge completed, and an achievement —
   the app's `completed_summary_earnables` is an `EarnedBadge`, a
   `BadgeRequirement` or an `EarnedAchievement`. An achievement's art is a drawn
   medallion rather than a file, which is why it comes in as a node. */
const BADGE_CARD = {
  id: 'page-turner',
  label: 'Badge Earned',
  eyebrow: 'Page Turner',
  title: 'Finish a Title',
  description: 'For the Love of Reading',
  art: '/bs-prototypes/challenge-badges/for-the-love-of-reading/heart-balloon.webp',
  reward: 'Sticker Pack',
  tickets: 2,
}
const CHALLENGE_CARD = {
  id: 'completed',
  label: 'Challenge Complete',
  eyebrow: 'For the Love of Reading',
  title: 'Completed!',
  description: 'Every badge in the challenge',
  art: '/bs-prototypes/challenge-badges/for-the-love-of-reading/completed.webp',
  reward: 'Bookmark',
}
const STREAK_CARD = {
  id: 'streak',
  label: 'Achievement Earned',
  title: '30 Day Streak',
  description: 'A month without missing a day',
  art: <AchievementArt art="streak" />,
  viewLabel: 'View Achievement',
}

/* The success screen on its own. Its mood is random in the flow, so the demo
   fixes one per variant rather than reloading until you've seen all three. */
function logResult(mood, extra = {}) {
  return {
    logType: 'minute',
    measure: 'minutes',
    minutes: 45,
    logValue: 45,
    unit: 'minute',
    days: 1,
    dates: [],
    fields: {},
    mood,
    finished: false,
    earned: [],
    reader: READER,
    ...extra,
  }
}

function EpicImportDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Import from Epic
      </Button>
      <EpicImport
        open={open}
        profiles={[
          { id: 'p1', name: 'Olivia Martinez' },
          { id: 'p2', name: 'Noah Martinez' },
        ]}
        epicReaders={[
          { id: 'e1', name: 'Olivia Martinez', books: 12, minutes: 340 },
          { id: 'e2', name: 'Noah Martinez', books: 5, minutes: 120 },
        ]}
        onClose={() => setOpen(false)}
      />
    </>
  )
}

function BarFrame({ children }) {
  return (
    <div style={{ position: 'relative', background: '#fff', overflowX: 'auto' }}>
      <div style={{ minWidth: 880 }}>{children}</div>
    </div>
  )
}

// The banner is not a full-bleed component — in the reader app it sits in
// `.wa-main-inner`'s gutters, and it has no margin of its own (the stack owns
// the gaps). `full` is `padding: 0`, so the example has to stand in for the
// page's sides *and* its own breathing room, top and bottom.
function BannerFrame({ children }) {
  return <div style={{ padding: 20, background: '#fff' }}>{children}</div>
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

// Both modals open from something, so the examples give them the button they
// open from rather than showing them already up.
function JoinDemo({ challenge, ignored, label, questions = [] }) {
  const [open, setOpen] = useState(null)
  const [answers, setAnswers] = useState({})
  return (
    <>
      <Button onClick={() => setOpen(challenge)}>{label}</Button>
      <JoinChallenge
        challenge={open}
        ignored={ignored}
        onClose={() => setOpen(null)}
        onJoin={() => setOpen(null)}
        onDismiss={() => setOpen(null)}
        questions={questions}
        answers={answers}
        onAnswer={setAnswers}
      />
    </>
  )
}

function UnenrollDemo() {
  const [open, setOpen] = useState(null)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(CHALLENGES[0])}>
        Un-enroll from a challenge
      </Button>
      <ConfirmUnenroll
        challenge={open}
        onClose={() => setOpen(null)}
        onConfirm={() => setOpen(null)}
      />
    </>
  )
}

function ScopeDemo() {
  const [scope, setScope] = useState('current')
  return <ChallengeScope value={scope} onChange={setScope} />
}

// It's a modal, so it opens from something — here a button, in the app a card
// in the Friends grid or a leaderboard row. Showing it already open would both
// cover the page on load and leave nothing to close it with.
function FriendProfileDemo({ id = 'jayden', label = "Open a friend's profile" }) {
  const [friendId, setFriendId] = useState(null)
  return (
    <>
      <Button onClick={() => setFriendId(id)}>{label}</Button>
      <FriendProfile friendId={friendId} onClose={() => setFriendId(null)} />
    </>
  )
}

function FundraiserWelcomeDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Land on a site running a fundraiser</Button>
      <FundraiserWelcome open={open} onClose={() => setOpen(false)} />
    </>
  )
}

/* The flow with its own state, so a reviewer can walk both steps and watch the
   counts move. */
function CompleteActivityDemo() {
  const badges = ACTIVITY_BADGES()
  const [done, setDone] = useState(
    () => new Set(badges.flatMap((b) => b.activities.filter((a) => a.done).map((a) => a.id))),
  )
  const [open, setOpen] = useState(false)
  const toggle = (a) =>
    setDone((d) => {
      const next = new Set(d)
      if (next.has(a.id)) next.delete(a.id)
      else next.add(a.id)
      return next
    })
  return (
    <>
      <Button onClick={() => setOpen(true)}>Complete Activity</Button>
      <CompleteActivity
        open={open}
        badges={badges}
        src={(b) => badgeSrc(b.set, b.art)}
        completed={done}
        onToggle={(badge, a) => toggle(a)}
        onClose={() => setOpen(false)}
      />
    </>
  )
}

/* The badge whose four activities are one of each kind. */
function ActivityListDemo() {
  const badge = ACTIVITY_BADGES().find((b) => b.activities.length === 4)
  const [done, setDone] = useState(
    () => new Set(badge.activities.filter((a) => a.done).map((a) => a.id)),
  )
  return (
    <ActivityList
      activities={badge.activities}
      done={done}
      onToggle={(a) =>
        setDone((d) => {
          const next = new Set(d)
          if (next.has(a.id)) next.delete(a.id)
          else next.add(a.id)
          return next
        })
      }
    />
  )
}

export const readerAppSections = [
  {
    group: 'web-app',
    sub: 'chrome',
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
                    iconRight={<Icon name="chevron-down" size={13} />}
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
    group: 'web-app',
    sub: 'chrome',
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
    group: 'web-app',
    sub: 'chrome',
    id: 'reader-banner',
    name: 'ReaderBanner',
    usage: `import { ReaderBanner, ReaderBannerAction, BannerStack } from '@components/ReaderApp/ReaderApp'

<BannerStack max={2}>
  <ReaderBanner
    tone="red"                       /* blue | amber | green | red | purple — or \`tint\`/\`ink\` */
    mark={<Icon name="flame-filled" size={22} />}
    title={<><strong>No current streak.</strong> Log reading every day…</>}
    sub="optional second line"
    action={<ReaderBannerAction solid onClick={open}>View Streaks</ReaderBannerAction>}
    onDismiss={dismiss}
  />
</BannerStack>`,
    desc: (
      <>
        The bars the Challenges page opens with — link an app, friend requests waiting, the
        community goal, your streak. They had drifted into four different bars:{' '}
        <strong>
          three disc sizes, three radii, three hand-rolled action chips and three margins
        </strong>
        . One anatomy now — a mark on a white disc, what it says, what you can do about it, and a
        way to make it go away — with the tone supplying the ground and the ink, and nothing else
        changing between them.
        <br />
        <br />
        <code>ReaderBannerAction</code> is a real <code>Button</code>, not a chip: it was its own
        hover, its own focus ring and its own press state, none of which matched the buttons
        everywhere else. The banner only supplies the white ground it sits on and the ink it takes —
        or, with <code>solid</code>, the other way round: the bar&apos;s ink as the ground and white
        type on it, for a bar whose action is the point rather than an offer. <code>tint</code>/
        <code>ink</code> override the tone for the case where the colour isn&apos;t ours — a partner
        banner takes the partner&apos;s.
        <br />
        <br />
        <code>BannerStack</code> is why they don&apos;t pile up: a reader with a lot going on could
        land on five or six before reaching the page, so it shows two and folds the rest behind
        &ldquo;View 3 more&rdquo;.
      </>
    ),
    render: () => (
      <>
        <Variant label="the tones, one anatomy — and `solid` on the last two" full>
          <div style={{ padding: 20, background: '#fff' }}>
            <ReaderBanner
              tone="blue"
              mark={<Icon name="link" size={20} />}
              title={<strong>Link your Comics Plus account today!</strong>}
              action={<ReaderBannerAction>Link Accounts</ReaderBannerAction>}
              onDismiss={noop}
            />
            <div style={{ height: 10 }} />
            <ReaderBanner
              tone="amber"
              mark={<Icon name="users" size={20} />}
              title={<strong>You have 2 new friend requests!</strong>}
              action={<ReaderBannerAction>View Requests</ReaderBannerAction>}
            />
            <div style={{ height: 10 }} />
            <ReaderBanner
              tone="purple"
              mark={<Icon name="layers" size={20} />}
              title={<strong>7 words are ready for another look</strong>}
              sub="Flip through them and I’ll space the ones you know further apart."
              action={<ReaderBannerAction solid>Review 7</ReaderBannerAction>}
            />
            <div style={{ height: 10 }} />
            <CommunityGoalBanner total={128400} goal={250000} onDismiss={noop} />
            <div style={{ height: 10 }} />
            <StreakBanner streak={{ current: 0 }} onLog={noop} />
          </div>
        </Variant>
        <Variant label="BannerStack — two shown, the rest folded away" full>
          <div style={{ padding: 20, background: '#fff' }}>
            <BannerStack>
              <ReaderBanner
                tone="blue"
                mark={<Icon name="link" size={20} />}
                title={<strong>Link your Comics Plus account today!</strong>}
                action={<ReaderBannerAction>Link Accounts</ReaderBannerAction>}
                onDismiss={noop}
              />
              <ReaderBanner
                tone="amber"
                mark={<Icon name="users" size={20} />}
                title={<strong>You have 2 new friend requests!</strong>}
                action={<ReaderBannerAction>View Requests</ReaderBannerAction>}
              />
              <CommunityGoalBanner total={128400} goal={250000} onDismiss={noop} />
              <StreakBanner streak={{ current: 12 }} onLog={noop} />
            </BannerStack>
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'chrome',
    id: 'reader-streak-banner',
    name: 'StreakBanner',
    usage: `import { StreakBanner } from '@components/ReaderApp/ReaderApp'

<StreakBanner streak={{ current: 4 }} onLog={openLogFlow} onViewStreaks={goToCalendar} />`,
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
          <BannerFrame>
            <StreakBanner streak={{ current: 0 }} onLog={noop} />
          </BannerFrame>
        </Variant>
        <Variant label="a live streak" full>
          <BannerFrame>
            <StreakBanner streak={{ current: 12 }} onLog={noop} />
          </BannerFrame>
        </Variant>
        <Variant label="message — beeverso names where the reading came from" full>
          <BannerFrame>
            <StreakBanner
              streak={{ current: 4 }}
              onLog={noop}
              message={
                <>
                  <strong>4-day streak!</strong> Reading in your linked apps counts toward it too.
                </>
              }
            />
          </BannerFrame>
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'chrome',
    id: 'reader-back',
    name: 'ReaderBack',
    usage: `import { ReaderBack } from '@components/ReaderApp/ReaderApp'

<ReaderBack onClick={close}>Back to Book Lists</ReaderBack>`,
    desc: (
      <>
        The way back off a reader page the nav can&apos;t reach — a book, or one book list.{' '}
        <code>.back-button</code> in the app (<code>reading_lists/show.html.haml</code>): a chevron
        and where it goes, sitting <em>above</em> the page&apos;s own header rather than inside it.
        <br />
        <br />
        It names its destination rather than saying just &ldquo;Back&rdquo;, because these pages are
        reached from more than one place — the same <code>BookPage</code> is opened from the Reading
        Log, a wish list, a book list and the browse page, and each says which.
      </>
    ),
    render: () => (
      <>
        <Variant label="a destination, not just “back”">
          <div style={{ padding: '12px 20px' }}>
            <ReaderBack>Back to Book Lists</ReaderBack>
          </div>
        </Variant>
        <Variant label="over the page header it belongs to">
          <div style={{ padding: '20px 20px 0' }}>
            <ReaderBack>Back to Find Books</ReaderBack>
            <ReaderPageHead as="h2" title="The Wild Robot" count="288 pages" />
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'chrome',
    id: 'reader-page-head',
    name: 'ReaderPageHead',
    usage: `import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'

<ReaderPageHead title="Friends" count="7 Friends" actions={<Button>Invite Friends</Button>} />

/* a pane under a sub-tab strip owns an h2, not the page's h1 */
<ReaderPageHead as="h2" title="Badges" count="7 of 14 earned" />`,
    desc: (
      <>
        The row every page under the reader nav opens with: a title, an optional count or one-line
        description under it, and optional actions opposite.
        <br />
        <br />
        It exists because <strong>five pages had five copies of the same block</strong> and they had
        drifted — different type sizes, different margins, and a couple bottom-aligned, which left a
        heading with no sub-line hugging the floor of an otherwise empty box. One height (
        <code>--wa-pagehead-h</code>) and one set of margins (<code>--wa-pagehead-margin</code>)
        means the body doesn&apos;t jump as you move between tabs. On a phone the actions take their
        own full-width row and share it evenly.
        <br />
        <br />
        Not <code>@components/PageHeader</code> — that is the <em>admin</em> page header (28px over
        a 22px subtitle, ported from <code>_page_header.scss</code>), and every one of its consumers
        is an admin surface.
        <br />
        <br />
        Used by the Reading Log, All Titles, Friends, Leaderboards, Reviews, the challenge log, and{' '}
        <code>CollectionShelf</code>&apos;s <code>ShelfHead</code> — which is how Words with Benny
        gets it too.
      </>
    ),
    render: () => (
      <>
        <Variant label="title, count and an action">
          <div style={{ padding: '0 20px' }}>
            <ReaderPageHead
              title="Friends"
              count="7 Friends"
              actions={
                <Button variant="secondary" size="md" icon={<Icon name="plus" size={15} />}>
                  Invite Friends
                </Button>
              }
            />
          </div>
        </Variant>
        <Variant label="title only — same height, so nothing jumps">
          <div style={{ padding: '0 20px' }}>
            <ReaderPageHead
              title="Reviews"
              actions={
                <Button variant="primary" size="md">
                  Write a Review
                </Button>
              }
            />
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'challenges',
    id: 'complete-activity',
    name: 'Complete Activity',
    usage: `import { CompleteActivity } from '@components/CompleteActivity/CompleteActivity'

<CompleteActivity
  open={open}
  badges={activityBadges}                /* learning tracks with activities under them */
  src={(b) => badgeSrc(b.set, b.art)}
  completed={doneIds}                    /* a Set of activity ids */
  onToggle={(badge, activity) => tick(badge, activity)}
  onClose={close}
  label="Activity Badge"                 /* display_singular_learning_track_label */
/>

/* the reader shell wires it to the top bar's own button */
<Dashboard activities={{ badges, src, completed, onToggle }} />`,
    desc: (
      <>
        <strong>Complete Activity</strong> — <code>logged_books#activities</code>, the second thing
        the reader&apos;s top bar offers after Log Reading. An activity badge is a{' '}
        <code>LearningTrack</code>, and you earn it by doing the activities under it; this is where
        you say you have.
        <br />
        <br />
        Two steps on the logger&apos;s full-screen surface. <strong>Choose one</strong> —{' '}
        <code>logged_books/_learning_track</code>: the badge&apos;s art ringed with how far along it
        is, its name, what it takes, and how many of its activities are done. Then{' '}
        <strong>its activities</strong>, which is the same list the badge&apos;s own modal shows.
        The app skips the first step where the reader has only one, because a list of one is a
        question with one answer.
        <br />
        <br />
        The button is gated the way the app gates it —{' '}
        <code>profile_has_current_learning_tracks?</code>: no activity badges, no button. A{' '}
        <strong>repeatable</strong> track counts rather than ticks, so its badge&apos;s own figure
        is the number.
      </>
    ),
    render: () => (
      <Variant label="the button the reader's top bar offers, and what it opens">
        <CompleteActivityDemo />
      </Variant>
    ),
  },
  {
    group: 'web-app',
    sub: 'challenges',
    id: 'activity-list',
    name: 'ActivityList',
    usage: `import { ActivityList } from '@components/ActivityList/ActivityList'

<ActivityList activities={badge.activities} done={doneIds} onToggle={(a) => tick(a)} />`,
    desc: (
      <>
        The activities under an activity badge — <code>activities/_activity.html.haml</code> — in
        the four kinds one comes in: tick it off, follow a <strong>link</strong> and come back,
        write an answer (<code>is_text_box_challenge?</code>), or enter a <strong>code</strong> the
        library handed out (<code>is_an_activity_code?</code>). The tick is its own button, because
        the last two complete by being answered rather than by being ticked. A{' '}
        <strong>repeatable</strong> one keeps a count instead.
        <br />
        <br />
        The same list wherever it appears: inside the badge&apos;s own modal, and on the Complete
        Activity screen, which is this list with nothing else around it.
      </>
    ),
    render: () => (
      <Variant label="the four kinds, one of them already ticked">
        <ActivityListDemo />
      </Variant>
    ),
  },
  {
    group: 'web-app',
    sub: 'challenges',
    id: 'reader-challenge-card',
    name: 'ChallengeCard',
    usage: `import { ChallengeCard } from '@components/ReaderApp/ReaderApp'

<ChallengeCard
  challenge={{
    title, dates,
    banner: 'spring-into-reading',   // public/challenge-banners/, or \`art\` for a drawn cover
    logTypes: ['minutes', 'books'],  // minutes | books | pages
    types: ['bingo'],                // bingo | book_list | activities | reviews
    bookTalks: true,
    upcoming: false,
    connectedSite: 'Oak Elementary',
    canSelfUnenroll: true,
    // bannerImg: myArt,            // art the prototype supplies itself
  }}
  onOpen={open}
  onUnenroll={leave}
/>`,
    desc: (
      <>
        One challenge in the reader&apos;s grid —{' '}
        <code>programs/_programs_list_item.html.haml</code>. Cover art, the name and the dates, with
        the <strong>type chips straddling the seam</strong> between the two: what format the
        challenge is (Reading List, Bingo, Book Talks) and what you log for it (Minutes, Books,
        Pages), plus Activities and Reviews where it takes them, and Upcoming before it opens.
        <br />
        <br />
        The app shows <strong>only the first two</strong> and cuts the rest — the row can&apos;t
        wrap without covering the art — so that order is doing real work, and how many log types are
        listed shrinks when Activities or Reviews are also on the card. A challenge joined from a
        connected site names that site under the dates, and one you&apos;re allowed to leave carries
        a kebab with &ldquo;Un-enroll&rdquo;.
        <br />
        <br />
        <code>banner</code> names a file in <code>public/challenge-banners/</code> —
        Beanstack&apos;s own art for that challenge, out of <code>Design/Projects/Challenges</code>{' '}
        at 920×351, which is the ratio the art slot holds. <code>art</code> is the fallback for a
        challenge with no banner: a drawn cover from <code>CHALLENGE_ART</code> (the app&apos;s own
        fallback is a grey <code>no-challenge-image.png</code>, which a prototype can do better
        than). Hovering grows the art inside the card rather than lifting the card.
        <br />
        <br />
        The chips are <code>Pill</code>s, pinned to the app&apos;s own <code>$pastelGreen</code>/
        <code>$darkGreen</code> pair; the kebab is a <code>Flyout</code>. The card&apos;s click
        target is its own layer rather than a wrapping <code>&lt;button&gt;</code>, because the
        kebab is a button too and one can&apos;t nest inside the other.
      </>
    ),
    render: () => (
      <>
        <Variant label="two real banners and a drawn cover — every chip combination" full>
          <div className="wa-chgrid" style={{ padding: '26px 16px 16px' }}>
            {CHALLENGES.map((c) => (
              <ChallengeCard key={c.id} challenge={c} onOpen={noop} onUnenroll={noop} />
            ))}
          </div>
        </Variant>
        <Variant label="upcoming, and joined from a connected site" full>
          <div className="wa-chgrid" style={{ padding: '26px 16px 16px' }}>
            <ChallengeCard
              challenge={{
                ...CHALLENGES[0],
                upcoming: true,
                dates: 'Starts Apr 1',
              }}
              onOpen={noop}
            />
            <ChallengeCard
              challenge={{
                ...CHALLENGES[1],
                connectedSite: 'Oak Elementary',
              }}
              onOpen={noop}
              onUnenroll={noop}
            />
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'challenges',
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
    group: 'web-app',
    sub: 'challenges',
    id: 'reader-join-challenge',
    name: 'JoinChallenge',
    usage: `import { JoinChallenge, ConfirmUnenroll } from '../logging-flow/components/Dashboard'

<JoinChallenge
  challenge={joining}          /* null closes it */
  ignored={isIgnored}          /* already ignored — drops "Not Interested" */
  onClose={close} onJoin={join} onDismiss={ignore}
  questions={siteQuestions}    /* asked once, before the first enrolment */
  answers={answered} onAnswer={setAnswered}
/>

<ConfirmUnenroll challenge={leaving} onClose={close} onConfirm={leave} />`,
    desc: (
      <>
        What opens when you press a challenge you are <em>not</em> in —{' '}
        <code>programs/_join_challenge.html.haml</code> and the JavaScript in{' '}
        <code>_programs_list</code> that fills it. You can&apos;t read a challenge you haven&apos;t
        joined, so the card opens this rather than the challenge page.
        <br />
        <br />
        <strong>What it shows is conditional, and each condition is the app&apos;s.</strong> The
        ground behind the art is taken from the artwork&apos;s own colour (ColorThief at 70% in the
        app, the challenge&apos;s <code>tint</code> here), falling back to one of five pastels. The
        range pill reads &ldquo;Ages: 5–12&rdquo; or &ldquo;Grades K–8&rdquo; depending on how the
        challenge is scoped. A challenge offered as one of a set lists the{' '}
        <strong>alternatives</strong>. A challenge that hasn&apos;t started and doesn&apos;t take
        pre-registration shows <strong>no buttons at all</strong> — you may read about it, that is
        all. And one you have already ignored loses &ldquo;Not Interested&rdquo;, because
        you&apos;re only there to come back the other way.
        <br />
        <br />
        <strong>Registration questions</strong> come between pressing Join and being enrolled. They
        are the site&apos;s, not the challenge&apos;s (<code>RegistrationQuestion</code>), multiple
        choice with one answer — the admin screen says outright that there is no free-text question
        in the product — and only the required ones block the button. The answers belong to the{' '}
        <em>profile</em> (<code>registration_answers_profiles</code>), so a reader is asked once and
        never again, whatever they join next; a question they were shown and skipped counts as
        asked. The app renders them into this same overlay, which is why they are a body swap here
        rather than a second modal.
        <br />
        <br />
        <code>ConfirmUnenroll</code> is its counterpart —{' '}
        <code>programs/_confirm_unenroll.html.haml</code>. Leaving a challenge throws away the
        progress in it, so the app asks first rather than acting on the kebab.
      </>
    ),
    render: () => (
      <>
        <Variant label="open to join">
          <JoinDemo challenge={MORE_CHALLENGES[0]} label="Join a challenge" />
        </Variant>
        <Variant label="a site that asks questions first — two required, one not">
          <JoinDemo
            challenge={MORE_CHALLENGES[0]}
            questions={REGISTRATION_QUESTIONS}
            label="Join, and answer the site's questions"
          />
        </Variant>
        <Variant label="upcoming, no pre-registration — nothing to press, and it has alternatives">
          <JoinDemo challenge={MORE_CHALLENGES[1]} label="Open an upcoming challenge" />
        </Variant>
        <Variant label="already ignored — no way to ignore it twice">
          <JoinDemo challenge={MORE_CHALLENGES[2]} ignored label="Open an ignored challenge" />
        </Variant>
        <Variant label="leaving one you're in">
          <UnenrollDemo />
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'rail',
    id: 'reader-motivation-card',
    name: 'MotivationCard',
    usage: `import { MotivationCard } from '@components/ReaderApp/ReaderApp'

<MotivationCard state="available" onOpen={startSurvey} />   /* available | in_progress | scored */`,
    desc: (
      <>
        The RMI nudge at the top of the dashboard rail — the app&apos;s{' '}
        <code>programs/_motivation_widget.html.erb</code>. Three states off where the reader is with
        the survey, and only the last one changes the copy: before there is a result the widget is
        selling the idea (&ldquo;What&apos;s your motivation type?&rdquo;), and after it there is
        one to go and read.
        <br />
        <br />
        The art is Beanstack&apos;s own <code>motivation_type.png</code>. The page renders this only
        where RMI is switched on for the site, so the component has no empty state of its own —{' '}
        <code>Dashboard</code> takes a <code>motivation</code> prop and leaves the rail alone
        without it.
      </>
    ),
    render: () => (
      <>
        <Variant label="not started — Let's Go">
          <MotivationCard state="available" onOpen={noop} />
        </Variant>
        <Variant label="part-way — Continue">
          <MotivationCard state="in_progress" onOpen={noop} />
        </Variant>
        <Variant label="scored — the only state whose copy changes">
          <MotivationCard state="scored" onOpen={noop} />
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'rail',
    id: 'reader-goal-card',
    name: 'GoalCard',
    usage: `import { GoalCard } from '@components/ReaderApp/ReaderApp'

<GoalCard dailyGoal={{ minutes: 14, goal: 20 }} />`,
    desc: (
      <>
        Today&apos;s reading against the reader&apos;s daily goal, in the dashboard rail — the
        app&apos;s <code>reading_goal_banner</code>. A chunky amber bar that{' '}
        <strong>ends in a star</strong>, with a 12px curve pinching bar and star together; the star
        is the goal, so it stays grey until you reach it and then the fill, the curve and its disc
        go amber as one run with the star reversed out in white.
        <br />
        <br />
        Three states off one pair of numbers, on the helper&apos;s own thresholds: under half is
        &ldquo;Reach Your Goal!&rdquo;, from half it&apos;s &ldquo;Keep going!&rdquo;, and at the
        goal &ldquo;Well done!&rdquo;. The count floors and caps at 100%, so an overshot goal shows
        a full bar rather than an overrun one, and the fill keeps a 32px minimum so an untouched
        goal still shows a dot. <code>ProgressBar</code> draws the track and fill; only the curve
        and the star are the card&apos;s own.
      </>
    ),
    render: () => (
      <>
        <Variant label="nothing logged yet">
          <GoalCard dailyGoal={{ minutes: 0, goal: 20 }} />
        </Variant>
        <Variant label="part-way — one minute to go">
          <GoalCard dailyGoal={{ minutes: 19, goal: 20 }} />
        </Variant>
        <Variant label="goal met — and overshot">
          <GoalCard dailyGoal={{ minutes: 42, goal: 20 }} />
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'rail',
    id: 'reader-goal-meter',
    name: 'GoalMeter',
    usage: `import { GoalMeter } from '@components/ReaderApp/ReaderApp'

<GoalMeter minutes={14} goal={20} />`,
    desc: (
      <>
        <code>GoalCard</code>&apos;s meter on its own: the count over the amber bar that ends in a
        star, without the card or its encouragement copy. For a surface that frames the goal in its
        own words. The student profile&apos;s Daily goal card uses it so staff see the goal the way
        the student does. It carries its own met state, so the star goes amber without the card.
      </>
    ),
    render: () => (
      <>
        <Variant label="part-way">
          <GoalMeter minutes={14} goal={20} />
        </Variant>
        <Variant label="goal met">
          <GoalMeter minutes={35} goal={30} />
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'rail',
    id: 'reader-leaderboard-card',
    name: 'LeaderboardCard',
    usage: `import { LeaderboardCard } from '@components/ReaderApp/ReaderApp'

<LeaderboardCard
  schools={TOP_SCHOOLS}
  grades={TOP_GRADES}
  labels={{ schools: 'Readers', grades: 'Classes' }}  // what this site's two lists are called
/>`,
    desc: (
      <>
        The dashboard rail&apos;s leaderboard, ported from the shipped widget (
        <code>_leaderboard_widget.html.haml</code>): folder tabs on top of a bordered panel, the two
        range pickers on a grey band across the panel&apos;s head, the rows with no dividers between
        them, then &ldquo;View all&rdquo; behind a rule of its own. Rows are{' '}
        <code>{'{ rank, name, value, color }'}</code> — the colour is the rank disc&apos;s, so gold
        / silver / bronze are the data&apos;s business, not the component&apos;s. <code>isMe</code>{' '}
        marks the reader&apos;s own row, and <code>labels</code> renames the two lists for a site
        that ranks something other than schools and grades.
      </>
    ),
    render: () => (
      <>
        <Variant label="switch between schools and grades">
          <LeaderboardCard schools={TOP_SCHOOLS} grades={TOP_GRADES} />
        </Variant>
        <Variant label="a classroom's own two lists, with the reader's row marked">
          <LeaderboardCard
            schools={TOP_SCHOOLS.map((r, i) => (i === 1 ? { ...r, isMe: true } : r))}
            grades={TOP_GRADES}
            labels={{ schools: 'Readers', grades: 'Classes' }}
          />
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'challenges',
    id: 'wa-all-badges',
    name: 'AllBadges',
    usage: `import { AllBadges } from './components/AllBadges'

/* claimed off the shared Dashboard by tab id */
<Dashboard ownTabs={['badges']} renderExtra={(id) => id === 'badges' && <AllBadges />} />`,
    desc: (
      <>
        The All Badges page. Two shelves, the way the profile splits them (
        <code>_badges_and_achievements_tabs</code>: &ldquo;Earned Badges&rdquo; |
        &ldquo;Achievements&rdquo;) — but the Badges shelf carries the unearned half too, which the
        product shows on a challenge&apos;s own Badges tab: gray art, a progress ring, and the
        requirement in the footer where an earned badge has its date. Built on the shared{' '}
        <code>CollectionShelf</code>; the achievement medallions are Book Discovery&apos;s{' '}
        <code>AchievementArt</code>.
      </>
    ),
    render: () => (
      <Variant label="earned and not-yet-earned, plus achievements" full>
        <div style={{ padding: '24px 20px 20px', background: '#fff' }}>
          <AllBadges />
        </div>
      </Variant>
    ),
  },
  {
    group: 'web-app',
    sub: 'people',
    id: 'wa-friends',
    name: 'Friends',
    usage: `import { Friends } from './components/Friends'

<Friends />`,
    desc: (
      <>
        The Friends page — <code>profiles/friends.html.haml</code>. A card per friend: a band in
        their own colour with their avatar hanging over it, their name and grade, and their current
        streak. A pending invite is the same card gone gray with a &ldquo;Pending Invite&rdquo; tag
        where the streak sits, and its kebab offers &ldquo;Cancel this Invitation&rdquo; rather than
        &ldquo;Remove Friend&rdquo;. Waiting requests get a banner above the grid, because they need
        a decision rather than a card. Grid steps 4 → 3 → 2 → 1, the app&apos;s own breakpoints.
        <br />
        <br />
        Leaderboards is a sub-tab of this page rather than its own nav entry — the profile pairs
        them (<code>_friends_and_leaderboard_tabs</code>), and they are two views of the same
        people. Waiting requests sit in <code>FriendRequests</code> above the grid.
      </>
    ),
    render: () => (
      <Variant label="friends, a pending invite, and a waiting request" full>
        <div style={{ padding: '0 20px 20px', background: '#fff' }}>
          <Friends />
        </div>
      </Variant>
    ),
  },
  {
    group: 'web-app',
    sub: 'people',
    id: 'wa-friend-requests',
    name: 'FriendRequests',
    usage: `import { FriendRequests } from './components/FriendRequests'

<FriendRequests
  requests={FRIEND_REQUESTS}
  onAccept={(person) => …}
  onDecline={(person) => …}
/>`,
    desc: (
      <>
        Waiting friend requests — <code>profiles/_friend_requests.html.haml</code>, ported closely
        because the shape is unusual. The bar only <em>announces</em>: the beaming-face emoji in a
        white disc, &ldquo;You have N new friend request(s)!&rdquo;, and a{' '}
        <strong>View Requests</strong> dropdown at the far right. The requests themselves live in
        the menu that opens under it — a 44px avatar, the name, then Accept and Decline as hollow
        buttons.
        <br />
        <br />
        Declining asks first (&ldquo;Are you sure you want to decline the friend request from Maya
        C.?&rdquo; → Decline / Cancel); accepting doesn&apos;t. Either way the app answers with a{' '}
        <code>Toast</code> rather than changing the page underneath, and the menu stays open so a
        reader can work through a queue.
        <br />
        <br />
        The amber ground (<code>#FFEDC8</code>), the swashes behind it and the emoji are the
        app&apos;s own, out of its <code>symbol-defs.svg</code> — this is the one cheerful bar in
        the reader app, and it is cheerful on purpose.
      </>
    ),
    // Not a `full` variant: `full` clips the card to its corners, and a Flyout
    // is anchored inline rather than portaled, so the open menu was cut off at
    // the card's edge. The fix for that had been 200px of reserved padding,
    // sitting empty under a closed one.
    //
    // The negative margin takes back the bar's own 24px — that is its gap to
    // the Friends grid underneath it, and there is no grid here.
    render: () => (
      <Variant label="two waiting — open the menu">
        <div style={{ background: '#fff', marginBottom: -24 }}>
          <FriendRequests
            requests={[
              { id: 'maya', name: 'Maya C.', initials: 'MC', color: '#F0966F' },
              { id: 'theo', name: 'Theo N.', initials: 'TN', color: '#0F766E' },
            ]}
            onAccept={noop}
            onDecline={noop}
          />
        </div>
      </Variant>
    ),
  },
  {
    group: 'web-app',
    sub: 'people',
    id: 'wa-friend-profile',
    name: 'FriendProfile',
    usage: `import { FriendProfile } from './components/FriendProfile'

<FriendProfile friendId={id} onClose={() => setId(null)} />`,
    desc: (
      <>
        A friend&apos;s profile, opened from the Friends grid or a leaderboard row. Read-only, and
        structured the way <code>friendships/_friend_modal.html.haml</code> is: a band in the
        friend&apos;s colour running the modal&apos;s full width, the app&apos;s own scalloped curve
        under it, the avatar hung over both, and the tabs — <strong>Overview</strong>,{' '}
        <strong>Challenges</strong>, <strong>Reading Log</strong> — inside that header rather than
        under it. The counters are part of Overview, under <em>Statistics</em>, the way the real
        modal orders it: latest badges, latest achievements, then the numbers.
        <br />
        <br />
        Only the anatomy is the app&apos;s; the parts are ours. Badges and achievements are a
        horizontal strip of <code>BadgeArt</code> with the detail on a <code>Tooltip</code> — the
        app&apos;s <code>.badges-container</code> is a row of thumbnails, not a wall of cards —{' '}
        <code>StatCard</code> stacked into the Statistics list, <code>ChallengeCard</code> (the same
        card the reader sees on their own Challenges page) for the challenges,{' '}
        <code>BookCover</code> for the log, and <code>EmptyState</code> where a section has nothing
        in it. Only the curve is drawn here, because it&apos;s artwork rather than a glyph.
        <br />
        <br />
        The modal has a <strong>defined height</strong>: Overview is a long tab and Challenges a
        short one, and sizing to content moved the whole modal — and the tab you were aiming at — on
        every switch.
      </>
    ),
    render: () => (
      <>
        <Variant label="a friend with badges, challenges and a log">
          <FriendProfileDemo />
        </Variant>
        <Variant label="a friend who has only just joined — every section empty">
          <FriendProfileDemo id="liam" label="Open a quieter profile" />
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'people',
    id: 'wa-leaderboards',
    name: 'Leaderboards',
    usage: `import { Leaderboards } from './components/Leaderboards'

<Leaderboards />`,
    desc: (
      <>
        The Leaderboards page — <code>leaderboards/index.html.haml</code>. Three boards over one
        table, and they rank three different things: Friends ranks readers, Grade and School rank
        those against each other, which is why the second column&apos;s header changes with the
        board. Which board and which log type are the same kind of choice, so both are segmented
        controls on one row. The podium gets a coin instead of a number and the reader&apos;s own
        row is highlighted and suffixed &ldquo;(You)&rdquo;, both from the app. Reached through the
        Friends page&apos;s own sub-tabs.
      </>
    ),
    render: () => (
      <Variant label="friends / grade / school over minutes or books" full>
        <div style={{ padding: '0 20px 20px', background: '#fff' }}>
          <Leaderboards />
        </div>
      </Variant>
    ),
  },
  {
    group: 'web-app',
    sub: 'reading',
    id: 'wa-wish-list',
    name: 'WishList',
    usage: `import { WishList } from './components/WishList'
import { BookLists } from './components/BookLists'

<WishList items={wish} onRemove={remove} onFindBooks={browse} onOpenBook={openBook} />
<BookLists onOpenList={openList} onFindBooks={browse} />`,
    desc: (
      <>
        Books the reader means to get to — <code>profiles/wish_list.html.haml</code> — and{' '}
        <code>BookLists</code>, the curated shelves its &ldquo;Find Books&rdquo; sends you to (
        <code>reading_lists#index</code>).
        <br />
        <br />
        The list is the reader&apos;s, not the page&apos;s — a book page can put a title on it and
        take it off again — so <code>items</code> and <code>onRemove</code> come from whoever owns
        the reader.
        <br />
        <br />A wish-list row says <strong>who put the book there</strong>: a parent or a teacher
        can add to a reader&apos;s list, so the app names whose idea it was rather than assuming the
        reader&apos;s own. Three things you can do with a row — log it, get it from the library,
        take it off — and the middle one only appears where the title actually has a library URL.
        Empty, the page is the app&apos;s blank slate and its one way out.
        <br />
        <br />A book list carries its cover, its name and <strong>how many books are on it</strong>,
        what it&apos;s for, who made it, and its genres. The app filters by grade level and genre
        from an off-canvas drawer; the filters are chips on the page here, since there is no room to
        hide a drawer in a prototype and the choice is small enough to show.
      </>
    ),
    render: () => (
      <>
        <Variant label="a reader's wish list" full>
          <div style={{ padding: '0 20px 20px', background: '#fff' }}>
            <WishList items={WISH_LIST} onFindBooks={noop} onLog={noop} />
          </div>
        </Variant>
        <Variant label="the lists its “Find Books” goes to" full>
          <div style={{ padding: '0 20px 20px', background: '#fff' }}>
            <BookLists onOpenList={noop} onFindBooks={noop} />
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'challenges',
    id: 'wa-fundraiser',
    name: 'FundraiserPage',
    usage: `import { FundraiserPage, FundraiserWelcome } from './components/FundraiserPage'
import { FundraiserCard } from '@components/ReaderApp/ReaderApp'

<FundraiserCard raised={3180} goal={5000} onLearnMore={open} />

/* a nav destination, so no back link: a site running one gets its
   own tab, ahead of Challenges */
<FundraiserPage fundraiser={fundraiser} entries={log} />

<FundraiserWelcome open={!seen} onClose={markSeen} />`,
    desc: (
      <>
        A read-a-thon from the reader&apos;s side — <code>fundraisers#show</code>. It is a challenge
        with money attached: the reader logs as they always do, and the people who sponsor them turn
        that reading into funds for the site. So the page is the challenge page&apos;s furniture — a
        nav, an Overall Progress strip, badges, prizes, a log — plus the two things a challenge
        hasn&apos;t got.
        <br />
        <br />
        The first is <strong>the two numbers</strong>: raised against the goal, for the site on the
        banner and for this reader in the rail (<code>_total_donations</code>). The second is{' '}
        <strong>the share card</strong> — &ldquo;Get Donations, Get Rewarded&rdquo; over the
        reader&apos;s own donation page and a Copy. A read-a-thon nobody shares raises nothing,
        which is why the app gives that card the whole of the right rail rather than a line in a
        menu.
        <br />
        <br />
        The donor list is <code>_donations</code>: what each person gave and what they wrote. A{' '}
        <code>donation_sponsor</code> is a business the site lined up rather than somebody who knows
        the reader, so it carries no message — it sponsored the fundraiser, not them.
        <br />
        <br />A site running one gets <strong>its own nav tab, ahead of Challenges</strong> (
        <code>display_fundraisers_nav_link</code>, shown only where there is an active fundraiser),
        so the page is a destination rather than something you reach from a banner you have already
        dismissed. The tab is singular where the app&apos;s own link says &ldquo;Fundraisers&rdquo;:
        a site has one running at a time (<code>active_fundraiser_id</code>) and the link goes
        straight to its page, so a plural promises a list that doesn&apos;t exist.{' '}
        <code>FundraiserCard</code> is <code>_fundraiser_main_banner</code>, which that site shows
        on every page — a rail block here rather than the app&apos;s dismissible bar, since a
        fundraiser runs for weeks and waving the bar off took the running total with it. Without a
        goal it reads &ldquo;$3,180 total raised&rdquo; and drops the bar, since a bar with nothing
        to fill to can only ever look wrong. <code>FundraiserWelcome</code> is the modal a reader
        gets once, the first time they land on such a site — remembered in localStorage by the app,
        a flag here.
      </>
    ),
    render: () => (
      <>
        <Variant label="the page a reader shares" full>
          <div style={{ padding: '0 20px 20px', background: '#fff' }}>
            <FundraiserPage fundraiser={FUNDRAISER} entries={READING_LOG} />
          </div>
        </Variant>
        <Variant label="the rail block every page carries while one is running">
          <div style={{ maxWidth: 300 }}>
            <FundraiserCard raised={3180} goal={5000} onLearnMore={noop} />
          </div>
        </Variant>
        <Variant label="no goal — the figure, and no bar to misread">
          <div style={{ maxWidth: 300 }}>
            <FundraiserCard raised={3180} onLearnMore={noop} />
          </div>
        </Variant>
        <Variant label="the welcome, once per reader">
          <FundraiserWelcomeDemo />
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'reading',
    id: 'wa-find-books',
    name: 'FindBooks',
    usage: `import { FindBooks } from './components/FindBooks'

<FindBooks onOpenBook={openBook} onBack={pop} backLabel="Back to Wish List" />

/* opened from a book's own tag rail, filtered by the tag that was clicked */
<FindBooks initial={{ genres: ['Humor'] }} onOpenBook={openBook} />`,
    desc: (
      <>
        The site&apos;s catalog — <code>books#index</code> — and the five facets it filters on:
        Recommended Age, Favorite Genres, Languages, Main Characters and Topics. (Interests and
        Reading Levels are admin-only in the app, so they aren&apos;t here.)
        <br />
        <br />
        The app keeps the facets in an off-canvas drawer behind &ldquo;Choose Filters&rdquo;, with
        &ldquo;Clear Filters&rdquo; and &ldquo;Hide Filters&rdquo; floating over the page. A
        prototype has nowhere to hide a drawer, so the same three controls sit in the page header
        and the panel opens in place — and{' '}
        <strong>what is set shows as chips above the grid</strong>, on the shared{' '}
        <code>ActiveFilters</code>. The drawer&apos;s own problem is that a filtered page
        doesn&apos;t look filtered.
        <br />
        <br />
        The app&apos;s h1 is &ldquo;Children&apos;s Books&rdquo;; this is headed by the thing the
        reader pressed to get here, which is &ldquo;Find Books&rdquo; in both the Wish List and the
        Book Lists.
      </>
    ),
    render: () => (
      <Variant label="the catalog, and the facets behind “Choose Filters”" full>
        <div style={{ padding: '0 20px 20px', background: '#fff' }}>
          <FindBooks onOpenBook={noop} />
        </div>
      </Variant>
    ),
  },
  {
    group: 'web-app',
    sub: 'reading',
    id: 'wa-book-page',
    name: 'BookPage',
    usage: `import { BookPage } from './components/BookPage'

<BookPage
  book={book}
  sessions={log.filter((e) => e.kind === 'log' && e.title === book.title)}
  backLabel="Back to Find Books"
  onBack={pop}
  onLog={openLogFlow}
  onFilter={(initial) => browse(initial)}
  onOpenBook={openBook}
  wished={onWishList}
  onWish={toggleWish}
  onEditSession={(entry, value) => correct(entry, value)}
  onRemoveSession={(entry) => drop(entry)}
/>`,
    desc: (
      <>
        One book — <code>books#show</code>, the record every other page&apos;s titles point at. The
        cover and the tag rail on the right, the title, credits and the three buttons on the left,
        and under them what the reader has logged, the Learning Tip, the Description, the moods
        readers gave it, and Related Picks.
        <br />
        <br />
        The three buttons are the app&apos;s three (<code>books/_buttons.html.haml</code>) and are
        gated the same way. The wish-list one <strong>acts in place and goes both ways</strong> —
        the app&apos;s <code>ajax:success</code> handler turns it into a dead &ldquo;Added!&rdquo;
        and leaves the Wish List page as the only way to undo it, which is a long way to go to
        correct a mis-tap on the button you are still looking at.
        <br />
        <br />
        The prose is behind tabs — Overview / Reading Log / More Like This, which are Book
        Discovery&apos;s own names, so a book detail reads the same whichever prototype you opened
        it in. What identifies the book (the cover, the title, the credits, the buttons and the tag
        rail) stays out of them, because it is true on every tab.
        <br />
        <br />
        The <strong>Reading Log</strong> tab is this title&apos;s slice of the reader&apos;s own
        log, and a session there can be <strong>corrected or taken back</strong> —
        <code>reading_log/_sessions.html.haml</code>: a pencil and a remove per row, the amount
        becoming a field in place with Save and Cancel where those two were, and the app&apos;s own
        confirm (&ldquo;Don&apos;t Delete&rdquo; included) for the delete. A session that came in
        from a reading app offers only the remove — <code>logged_book_can_be_edited</code>, since
        the number came from the app and there is nothing here to correct.
        <br />
        <br />
        The rail is <code>books/_product_aside.html.haml</code> in full. Every tag is a link into a
        catalog filtered by it — that is how a reader gets from one book to the next. The two the
        browse page has no facet for (a Lexile measure, the Misc. categories) state rather than
        navigate, since a link that filters by nothing is worse than a label.
      </>
    ),
    render: () => (
      <>
        <Variant label="a title the reader has logged" full>
          <div style={{ padding: '0 20px 20px', background: '#fff' }}>
            <BookPage
              book={CATALOG_BY_ID.rump}
              sessions={READING_LOG.filter((e) => e.kind === 'log' && e.title === 'Rump')}
              onLog={noop}
              onOpenBook={noop}
            />
          </div>
        </Variant>
        <Variant label="one they haven’t" full>
          <div style={{ padding: '0 20px 20px', background: '#fff' }}>
            <BookPage book={CATALOG_BY_ID['market-street']} onLog={noop} onOpenBook={noop} />
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'reading',
    id: 'wa-book-list-page',
    name: 'BookListPage',
    usage: `import { BookListPage } from './components/BookLists'

<BookListPage list={list} onBack={pop} onOpenBook={openBook} onLog={openLogFlow} />`,
    desc: (
      <>
        One curated shelf — <code>reading_lists#show</code>. The way back, the list&apos;s name over
        a Print button, what it&apos;s for, the grade bands and genres it covers, and the books on
        it.
        <br />
        <br />
        The tags are the app&apos;s own two colours (<code>tag--purple</code> for a grade band,{' '}
        <code>tag--teal</code> for a genre, from <code>lib/_tag.scss</code>) on our{' '}
        <code>Pill</code> rather than a local copy of that class.{' '}
        <strong>&ldquo;Wish List&rdquo; turns into &ldquo;Added!&rdquo; in place</strong> — the
        app&apos;s own handler does exactly that rather than navigating away from a list you are
        still reading.
      </>
    ),
    render: () => (
      <Variant label="a list and what's on it" full>
        <div style={{ padding: '0 20px 20px', background: '#fff' }}>
          <BookListPage list={BOOK_LISTS[0]} onBack={noop} onOpenBook={noop} onLog={noop} />
        </div>
      </Variant>
    ),
  },
  {
    group: 'web-app',
    sub: 'reviews',
    id: 'wa-peer-reviews',
    name: 'PeerReviews',
    usage: `import { PeerReviews } from './components/PeerReviews'

<PeerReviews allLibraries />   /* include_picture_review_from_other_microsites */`,
    desc: (
      <>
        Other readers&apos; reviews — <code>microsite#peer_reviews</code>, rendered through{' '}
        <code>profiles/reviews.html.haml</code>. Not the reader&apos;s own, and everything here is
        approved: the page filters to <code>with_approved_review</code> before it shows one, so a
        reader never sees somebody else&apos;s review waiting on staff.
        <br />
        <br />
        <strong>Two levels of choice, and the second is picture-only.</strong> The type comes first
        — Written or Picture, whichever the site permits. A picture review can then be scoped:{' '}
        <em>My Library</em> is this site&apos;s, <em>All Libraries</em> is every Beanstack site (a
        setting — <code>include_picture_review_from_other_microsites</code> — so{' '}
        <code>allLibraries={'{false}'}</code> takes the strip away), and{' '}
        <em>Community Favorites</em> is the most hearted across all of them. A written review is
        only ever your own library&apos;s, which is why the strip isn&apos;t there for it.
        <br />
        <br />
        The cards are the reader&apos;s own review cards plus the two things that make them somebody
        else&apos;s: who wrote it and at which library, and the <strong>heart</strong> — the only
        thing you can do to another reader&apos;s review, and picture-only in the app too.
      </>
    ),
    render: () => (
      <Variant label="written, picture, and the three scopes" full>
        <div style={{ padding: '0 20px 20px', background: '#fff' }}>
          <PeerReviews />
        </div>
      </Variant>
    ),
  },
  {
    group: 'web-app',
    sub: 'reviews',
    id: 'wa-reviews',
    name: 'Reviews',
    usage: `import { Reviews } from './components/Reviews'

/* hung off the Reading Log's own sub-tab strip */
<Dashboard logTabs={[{ id: 'reviews', label: 'Reviews' }]} renderLogTab={() => <Reviews />} />`,
    desc: (
      <>
        The reader&apos;s own reviews — <code>profiles/reviews.html.haml</code>, which titles itself
        &ldquo;{'{First}'}&apos;s Reviews&rdquo; and tabs by the review types the site permits. A
        Beanstack review carries <strong>no star rating</strong>: the app asks for words, and cuts a
        long one at 200 characters behind a &ldquo;Read more...&rdquo;.
        <br />
        <br />
        Picture reviews are a second type entirely — an image of the book rather than a paragraph
        about it — and they sit behind a &ldquo;Waiting for approval&rdquo; tag until staff clear
        them, after which they carry a heart count instead.
        <br />
        <br />
        It lives under <strong>Reading</strong> beside the log and All Titles rather than in the
        main nav, since it is another record of what this reader has read.
      </>
    ),
    render: () => (
      <Variant label="written reviews, with one expanded past the cutoff" full>
        <div style={{ padding: '0 20px 20px', background: '#fff' }}>
          <Reviews />
        </div>
      </Variant>
    ),
  },
  {
    group: 'web-app',
    sub: 'chrome',
    id: 'program-header',
    name: 'ProgramHeader',
    usage: `import { ProgramHeader } from '@components/ProgramHeader/ProgramHeader'

<ProgramHeader
  banner={bannerSrc(challenge.banner)}
  title={challenge.title}
  subtitle={challenge.series}        // optional — what this program is part of
  dates={challenge.dates}
  tint={challenge.tint}
  tags={types.map((t) => <Pill key={t} color="#1A6DD5" variant="soft" size="sm">{t}</Pill>)}
/>`,
    desc: (
      <>
        <code>programs/_program_header.html.haml</code>, the way a reader arrives at a program. Two
        tinted bands, the taller one ending in a downward curve; the banner floats over them on a
        rounded card, pulled up into the bands; and the page ground curves back up behind the title.
        <br />
        <br />
        The bands are <strong>the banner&apos;s own dominant colour blended with white</strong> —
        40% on the tall one, 20% behind it. The app reads that off the image with ColorThief; we
        carry it on the program as <code>tint</code>.
        <br />
        <br />A challenge wears it and so does a fundraiser, which is what took it out of{' '}
        <code>ChallengePage</code>: a read-a-thon is a challenge with money attached, and arriving
        at one should not feel like arriving somewhere else. <code>tags</code> is the slot under the
        dates — what the program asks of you, which reads as part of the title block rather than as
        the first line of the body.
        <br />
        <br />
        It bleeds to the window, but <strong>only inside the reader shell</strong>: the negative
        margins cancel <code>.wa-main</code>&apos;s padding, and anywhere else they would tear the
        header out of whatever is holding it — which is why it is framed here.
        <br />
        <br />
        <code>subtitle</code> is optional and names what the program is part of, for the case where
        it is part of something — a reading path belongs to the destination it travels, and the
        title is the path.
      </>
    ),
    render: () => (
      <>
        <Variant label="a challenge's own banner, and the colour it gives the page" full>
          <ProgramHeader
            banner={bannerSrc('spring-into-reading')}
            title="Spring Into Reading"
            dates="Apr 1 — Apr 30"
            tint="#B4E0CC"
            tags={
              <>
                <Pill color="#1A6DD5" variant="soft" size="sm">
                  Minutes
                </Pill>
                <Pill color="#1A6DD5" variant="soft" size="sm">
                  Activities
                </Pill>
              </>
            }
          />
        </Variant>
        <Variant label="one that belongs to something — the subtitle names it" full>
          <ProgramHeader
            banner={bannerSrc('minutes-march')}
            title="The Sports Path"
            subtitle="Words of Motion"
            dates="Apr 14 — May 30"
            tint="#6FE0D6"
            tags={
              <Pill color="#1A6DD5" variant="soft" size="sm">
                Reading List
              </Pill>
            }
          />
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'challenges',
    id: 'wa-challenge-page',
    name: 'ChallengePage',
    usage: `import { ChallengePage } from './components/ChallengePage'

/* the dashboard's \`page\` slot replaces the main column, nav intact */
<Dashboard
  onOpenChallenge={setChallenge}
  view={view}
  onView={(v) => { setView(v); setChallenge(null) }}
  page={challenge && <ChallengePage challenge={challenge} entries={LOG} />}
/>`,
    desc: (
      <>
        One challenge, from the reader&apos;s side — <code>programs/_show.html.haml</code> and{' '}
        <code>_program_header.html.haml</code>. The hero, the name, the date span (or the literal
        &ldquo;Ongoing Challenge&rdquo;), then the app&apos;s tab strip.
        <br />
        <br />
        <strong>Overview</strong> is what the challenge measures, its description, and
        &ldquo;Overall Progress&rdquo; — a ring tile per requirement, in the app&apos;s render order
        — over &ldquo;Recently Earned Badges&rdquo;. <strong>Badges</strong> is the whole set,{' '}
        <code>N/M Badges Earned</code>, on the shared <code>CollectionShelf</code> with its locked
        state. <strong>Rewards</strong> is <code>N/M Earned Rewards</code> and what each one takes.{' '}
        <strong>Challenge Log</strong> is the reader&apos;s own <code>ReadingLog</code> retitled
        &ldquo;Challenge Log&rdquo; with its sub-tabs and summary row dropped, since this page has
        both already.
        <br />
        <br />
        There is no back link and no Print button in the header — the app has neither. Leaving is
        the nav&apos;s Challenges tab, which is why the dashboard&apos;s view is driven from the
        parent here: <code>page</code> replaces the main column, so without that the challenge
        stayed up under a nav tab that had moved on.
        <br />
        <br />
        <strong>The nav is built from what the challenge has</strong> (
        <code>_single_program_nav</code>): a Reading List only on a <code>book_list</code>{' '}
        challenge, Ticket Drawings only where <code>@ticket_rewards_exist</code>, Certificates only
        where <code>@certificates_exist</code>. Nothing is greyed out — a challenge without them
        hasn&apos;t got those tabs, which is truer than a row of controls that don&apos;t work.
        Bingo Card is the one holdout: a bingo board is the Gameboard Reader prototype&apos;s whole
        subject, and a second one here would be a copy that drifts.
        <br />
        <br />
        <strong>Ticket Drawings</strong> is <code>programs/_ticket_reward</code> — a prize drawn
        from the tickets readers earn, and the reader decides which drawings to spend theirs on,
        since the same ticket can&apos;t go into two. The closing date leads each one, above its
        name: a drawing you have missed is the thing to know before you read what it was for. One
        that has closed says &ldquo;Drawing has ended. Winners will be notified.&rdquo; and offers
        nothing. The hero is the challenge&apos;s own banner from{' '}
        <code>public/challenge-banners/</code> — all three challenges here are real Beanstack ones,
        so each carries the art its design team ships, and the badges are that challenge&apos;s own
        illustrations rather than glyphs on coloured discs.
      </>
    ),
    render: () => (
      <Variant label="eight tabs' worth — Overview, and the four the challenge earns" full>
        <div style={{ padding: '0 20px 20px', background: '#fff' }}>
          <ChallengePage challenge={CHALLENGES[0]} entries={READING_LOG} />
        </div>
      </Variant>
    ),
  },
  {
    group: 'web-app',
    sub: 'reading',
    id: 'log-flow',
    name: 'LogFlow',
    usage: `import { LogFlow } from '@components/LogFlow/LogFlow'

<LogFlow
  open={open}
  onClose={close}
  onLogged={(entry) => record(entry)}
  logType="minute"                       /* LogType short_name — the type this site logs in */
  books={catalog}                        /* the shelf it searches */
  recentlyLogged={ids}
  readingList={list}                     /* the reader's Reading List Challenges band */
  reader={reader}
  readers={otherReaders}                 /* "Select a different reader" */
  partners={partnerList}
  connections={linked}
  dailyGoal={{ minutes, goal }}          /* drives the goal bar on the way out */
  earnedCards={cards}                    /* what finishing a title wins on this site */
  site={{ rostered, verified, backlogDays: 14, multiDate: true, timer: true }}
  onViewBadge={(card) => openBadge(card)}
  onTickets={(card) => goToRewards(card.challenge)}
/>`,
    desc: (
      <>
        <strong>Log Reading</strong> — <code>logged_books#new</code> through <code>#create</code>,
        the whole full-screen flow: pick a title, say how much, and land on what it earned you.
        <br />
        <br />
        The <strong>title step</strong> is <code>Select a Title</code> — a search over the site
        catalog, with Scan ISBN, Manually Enter Title and Reading List Challenges as equal
        alternatives, and <em>Log without a title</em> for a site that doesn&apos;t insist on one.
        <br />
        <br />
        The <strong>form</strong> asks for whatever this site&apos;s <code>LogType</code> measures —
        minutes with a timer, a count of pages or hours or books, or the questions the four
        title-less types ask instead (a moment&apos;s description, an event&apos;s name and kind, a
        video or magazine title). <code>Select Date</code> opens the calendar below. On a rostered
        site an unverified reader&apos;s number is policed: over the warning threshold they are
        asked whether they&apos;re sure and made to promise, and at the limit it is refused.
        <br />
        <br />
        The <strong>success step</strong> is the app&apos;s own — Benny in one of three moods under
        a burst of confetti, the daily-goal bar, and a card per thing the log earned with{' '}
        <em>View Badge</em> and <em>Go to Tickets</em> on it.
        <br />
        <br />
        It ships no fixtures: every catalog, reader and list comes in as a prop, so each prototype
        hands it its own shelf.
      </>
    ),
    render: () => (
      <Variant label="the whole flow, opened the way the top bar opens it">
        <LogFlowDemo />
      </Variant>
    ),
  },
  {
    group: 'web-app',
    sub: 'reading',
    id: 'earned-card',
    name: 'EarnedCard',
    usage: `import { EarnedCard } from '@components/EarnedCard/EarnedCard'

<EarnedCard
  card={{
    label: 'Badge Earned',
    eyebrow: 'Page Turner',                /* the badge's own name */
    title: 'Finish a Title',               /* what it took */
    description: 'For the Love of Reading',/* the challenge it belongs to */
    art: badgeSrc(set, name),              /* a src, or a node for a drawn medallion */
    viewLabel: 'View Achievement',         /* renames the button */
    reward: 'Sticker Pack',
    tickets: 2,
  }}
  onViewBadge={openBadge}
  onReward={goToRewards}
  onTickets={goToTickets}
>
  {/* optional: one more ruled-off row of the surface's own */}
</EarnedCard>`,
    desc: (
      <>
        <code>logged_books/_completed_earned_card</code> — <strong>one thing a log won</strong>. The
        badge&apos;s art beside its name, what it took, and the challenge it belongs to; then
        whatever came with it, one row each, under a rule.
        <br />
        <br />
        The card leads with <strong>what you did</strong> and puts the badge&apos;s own name above
        it: you know you finished a title before you know the badge is called Page Turner. A reward
        or a ticket payout is a different kind of fact from the badge that won it, so each gets its
        own row with its own way on — a reward is claimed on the challenge&apos;s Rewards tab, and
        knowing you won one with no way to it is the half of the news that doesn&apos;t help.
        <br />
        <br />
        <code>art</code> is a badge&apos;s image src, or a node for an achievement&apos;s drawn
        medallion — the same 72px slot either way — and <code>viewLabel</code> renames the button,
        because an achievement is not a badge and the button shouldn&apos;t say it is.{' '}
        <code>children</code> is a last ruled-off row for whatever else the surface has to say about
        this badge: the gameboard puts the reader&apos;s place on the board there, because{' '}
        <em>where</em> a badge sits is the news on a board and nowhere else.
        <br />
        <br />
        It is shared because an Epic import earns things too — a batch of logs is still logs, and
        the screen at the end of one should say so the same way.
      </>
    ),
    render: () => (
      <>
        <Variant label="a badge, with the reward and tickets that came with it">
          <EarnedCard card={BADGE_CARD} onViewBadge={noop} onReward={noop} onTickets={noop} />
        </Variant>
        <Variant label="an achievement — a drawn medallion, and the button renamed">
          <EarnedCard card={STREAK_CARD} onViewBadge={noop} />
        </Variant>
        <Variant label="no extras, and nowhere to send the reader">
          <EarnedCard card={{ ...CHALLENGE_CARD, reward: undefined }} />
        </Variant>
        <Variant label="children — a last row of the surface's own">
          <EarnedCard card={{ ...BADGE_CARD, reward: undefined, tickets: undefined }}>
            <div className="pt-earned-foot">
              <span>Your place on the board</span>
              <ProgressBar value={4} max={10} color="#1A6DD5" size="sm" />
            </div>
          </EarnedCard>
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'reading',
    id: 'log-success',
    name: 'LogSuccess',
    usage: `import { LogSuccess } from '@components/LogFlow/LogFlow'

<LogSuccess
  result={entry}                         /* what LogFlow hands onLogged */
  bookTitle="She Gets the Girl"
  dailyGoal={{ minutes, goal }}          /* school sites with individual goals */
  onDone={close}
  onAnother={startAnother}
  onViewBadge={(card) => openBadge(card)}
  onTickets={(card) => goToRewards(card.challenge)}
/>`,
    desc: (
      <>
        <strong>You did it!</strong> — <code>logged_books#completed</code>, the screen a finished
        log lands on. Normally the last step of <code>LogFlow</code>; exported on its own because
        it&apos;s the one screen in that flow worth looking at without driving through the rest.
        <br />
        <br />
        Benny in one of <strong>three moods</strong> — <code>happy</code>, <code>cool</code>,{' '}
        <code>party</code> — the app&apos;s own three files, picked at random per log. Which mood
        you get is the only random thing here, and it&apos;s what stops the fiftieth log of the
        summer feeling like the first forty-nine. In the flow he lands under a burst of confetti,
        which rides the whole surface rather than this block.
        <br />
        <br />
        Under it: what was logged, the <strong>daily goal</strong> it moved — a 32px yellow pill, a
        pinch, then the goal itself as its own disc, which goes yellow when you reach it — and a
        card per thing the log <strong>earned</strong>, with <em>View Badge</em> and{' '}
        <em>Go to Tickets</em> on it.
      </>
    ),
    render: () => (
      <>
        <Variant
          label="party — everything at once: two badges, an achievement, and the goal passed"
          full
        >
          <div className="pt-logsuccess">
            <LogSuccess
              result={logResult('party', {
                finished: true,
                earnedBadge: true,
                earned: [BADGE_CARD, CHALLENGE_CARD, STREAK_CARD],
              })}
              bookTitle="She Gets the Girl"
              dailyGoal={{ minutes: 45, goal: 20 }}
              onDone={noop}
              onAnother={noop}
              onViewBadge={noop}
              onReward={noop}
              onTickets={noop}
            />
          </div>
        </Variant>
        <Variant label="happy — one achievement, and the goal still short" full>
          <div className="pt-logsuccess">
            <LogSuccess
              result={logResult('happy', { earned: [STREAK_CARD] })}
              bookTitle="Rump"
              dailyGoal={{ minutes: 12, goal: 20 }}
              onDone={noop}
              onAnother={noop}
              onViewBadge={noop}
            />
          </div>
        </Variant>
        <Variant label="cool — nothing but the log" full>
          <div className="pt-logsuccess">
            <LogSuccess result={logResult('cool')} bookTitle="Snapdragon" onDone={noop} />
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'web-app',
    sub: 'reading',
    id: 'epic-import',
    name: 'EpicImport',
    usage: `import { EpicImport } from '@components/EpicImport/EpicImport'

<EpicImport
  open={open}
  profiles={beanstackProfiles}            /* who the logs can land on */
  epicReaders={readersFromEpic}           /* [{ id, name, books, minutes }] */
  onClose={close}
  onImported={(rows) => record(rows)}
/>

/* offered by the logging flow when the site has it on */
<LogFlow site={{ epic: true }} … />`,
    desc: (
      <>
        <strong>Import from Epic</strong> — <code>epic_integration#login</code> →{' '}
        <code>#sync_readers</code> → <code>#loading_epic_import</code>, offered from the logging
        flow when <code>microsite_settings.epic_integration?</code> is on.
        <br />
        <br />A <strong>one-shot import</strong>, not an account link — which is why it isn&apos;t{' '}
        <code>ConnectFlow</code>. Nothing stays connected: Epic hands over what the reader has
        already read there, Beanstack logs it, and that&apos;s the end of it.
        <br />
        <br />
        Three steps. <strong>Sign in</strong> as a student with a class code or as a parent with a
        username — Epic&apos;s own two doors, which is why the first screen is a choice rather than
        a form. <strong>Select Readers to Import</strong>, because an Epic account can hold several
        readers and a Beanstack account several profiles; the app pre-matches on name and warns
        where two Epic readers share one. Then <strong>what came across</strong>, per reader.
        <br />
        <br />
        It renders in Epic&apos;s own blue — the reader is handing over Epic credentials, so the
        screen should look like Epic&apos;s — but the back and close are Beanstack&apos;s shared{' '}
        <code>ModalFullBack</code> / <code>ModalFullClose</code>, since the way out of a screen
        shouldn&apos;t change shape halfway through a flow.
      </>
    ),
    render: () => (
      <Variant label="sign in · map the readers · what came across">
        <EpicImportDemo />
      </Variant>
    ),
  },
  {
    group: 'web-app',
    sub: 'reading',
    id: 'log-calendar',
    name: 'LogCalendar',
    usage: `import { LogCalendar, readableDates } from '@components/LogCalendar/LogCalendar'

<LogCalendar
  open={open}
  value={dates}                          /* ISO strings — logged_book[date_read] is a list */
  logged={alreadyLoggedISODates}         /* these get a dot */
  multi={site.multiDate}                 /* @multiclick_enabled — a site with a Days log type */
  backlogDays={14}                       /* microsite_settings.back_logging_days */
  onSave={setDates}
  onClose={close}
/>

readableDates(dates)  /* "Today" · "September 12, 2026, September 15, 2026" */`,
    desc: (
      <>
        <strong>Change Date</strong> — <code>logged_books/_logging_calendar</code>, behind the
        logging form&apos;s <code>Select Date</code>.
        <br />
        <br />A real calendar rather than a list of the last few days, because the app lets you log
        backwards: a reader who forgot all week opens this and ticks five days at once. Days already
        logged carry a dot so you can see the gap you&apos;re filling; future days aren&apos;t
        selectable; days past the site&apos;s backlogging window are refused with the app&apos;s own
        line about how far back you may go; and so is more than 31. Where a site has a Days log
        type, <em>Select Entire Month</em> ticks the whole page.
      </>
    ),
    render: () => (
      <Variant label="multi-select, a 14-day window, dots on the days already logged">
        <LogCalendarDemo />
      </Variant>
    ),
  },
  {
    group: 'cards',
    id: 'book-cover',
    name: 'BookCover',
    usage: `import { BookCover } from '@components/BookCover/BookCover'

<BookCover book={book} size="md" />      /* sm | md | lg | fill */
<BookCover book={book} size="fill" square /> /* audiobook art */

/* book: { title, author, isbn, coverId, cover: [from, to], kind, masthead, issue } */`,
    desc: (
      <>
        A book&apos;s cover, with somewhere to fall back to. The real image comes from Open Library
        — by <code>coverId</code> where there is one, since an ISBN can resolve to a foreign or
        coverless edition — and the CDN is asked to 404 rather than serve a blank, so a missing
        cover lands on the gradient placeholder with the title and author set into it instead of an
        empty grey rectangle.
        <br />
        <br />A magazine (<code>kind: &apos;magazine&apos;</code>) gets a masthead placeholder —
        name over issue — so a rack of them reads like a magazine rack rather than a shelf of books
        with missing covers. <code>square</code> is audiobook art, which is square the way a record
        sleeve is.
      </>
    ),
    render: () => (
      <Variant label="the four sizes, and the two placeholders">
        <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <BookCover book={CATALOG_BY_ID['she-gets-the-girl'] ?? DEMO_BOOK} size="sm" />
          <BookCover book={CATALOG_BY_ID['she-gets-the-girl'] ?? DEMO_BOOK} size="md" />
          <BookCover book={DEMO_BOOK} size="lg" />
          <BookCover book={DEMO_MAG} size="md" />
        </div>
      </Variant>
    ),
  },
]
