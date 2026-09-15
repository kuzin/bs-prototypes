import { useState } from 'react'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import {
  BannerStack,
  CommunityGoalBanner,
  ReaderBanner,
  ReaderBannerAction,
  ReaderPageHead,
  ReaderBack,
  FundraiserBanner,
  ChallengeCard,
  ChallengeScope,
  GoalCard,
  LeaderboardCard,
  MotivationCard,
  ReaderPill,
  ReaderTopBar,
  StreakBanner,
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
import { BOOK_LISTS, CATALOG_BY_ID, WISH_LIST } from '../../web-app/data'
import { READING_LOG } from '../../logging-flow/data'
import { FriendRequests } from '@components/FriendRequests/FriendRequests'
import { FriendProfile } from '../../web-app/components/FriendProfile'
import { ChallengePage } from '../../web-app/components/ChallengePage'
import { FundraiserPage, FundraiserWelcome } from '../../web-app/components/FundraiserPage'
import { FUNDRAISER } from '../../web-app/data'
import { MORE_CHALLENGES, REGISTRATION_QUESTIONS } from '../../logging-flow/data'
import { CONNECTIONS } from '../../logging-flow/connections'
import { JoinChallenge, ConfirmUnenroll } from '../../logging-flow/components/Dashboard'
import { Variant } from './_shared'

const noop = () => {}

const READER = { initials: 'OM', name: 'Olivia' }

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
    tone="red"                       /* blue | amber | green | red — or \`tint\`/\`ink\` to override */
    mark={<Icon name="flame-filled" size={22} />}
    title={<><strong>No current streak.</strong> Log reading every day…</>}
    sub="optional second line"
    action={<ReaderBannerAction onClick={open}>View Streaks</ReaderBannerAction>}
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
        everywhere else. The banner only supplies the white ground it sits on and the ink it takes.{' '}
        <code>tint</code>/<code>ink</code> override the tone for the case where the colour
        isn&apos;t ours — a partner banner takes the partner&apos;s.
        <br />
        <br />
        <code>BannerStack</code> is why they don&apos;t pile up: a reader with a lot going on could
        land on five or six before reaching the page, so it shows two and folds the rest behind
        &ldquo;View 3 more&rdquo;.
      </>
    ),
    render: () => (
      <>
        <Variant label="the four tones, one anatomy" full>
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
        <LeaderboardCard schools={TOP_SCHOOLS} grades={TOP_GRADES} />
      </Variant>
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
import { FundraiserBanner } from '@components/ReaderApp/ReaderApp'

<FundraiserBanner raised={3180} goal={5000} onLearnMore={open} onDismiss={hide} />

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
        <code>FundraiserBanner</code> is <code>_fundraiser_main_banner</code>, which that site shows
        on every page; without a goal it reads &ldquo;$3,180 total raised&rdquo; and drops the bar,
        since a bar with nothing to fill to can only ever look wrong. <code>FundraiserWelcome</code>{' '}
        is the modal a reader gets once, the first time they land on such a site — remembered in
        localStorage by the app, a flag here.
      </>
    ),
    render: () => (
      <>
        <Variant label="the page a reader shares" full>
          <div style={{ padding: '0 20px 20px', background: '#fff' }}>
            <FundraiserPage fundraiser={FUNDRAISER} entries={READING_LOG} />
          </div>
        </Variant>
        <Variant label="the bar every page carries while one is running" full>
          <BannerFrame>
            <FundraiserBanner raised={3180} goal={5000} onLearnMore={noop} onDismiss={noop} />
          </BannerFrame>
        </Variant>
        <Variant label="no goal — the figure, and no bar to misread">
          <BannerFrame>
            <FundraiserBanner raised={3180} onLearnMore={noop} />
          </BannerFrame>
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
]
