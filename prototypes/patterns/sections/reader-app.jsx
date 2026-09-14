import { useState } from 'react'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import {
  ReaderPageHead,
  ChallengeCard,
  ChallengeScope,
  GoalCard,
  LeaderboardCard,
  ReaderPill,
  ReaderTopBar,
  StreakBanner,
} from '@components/ReaderApp/ReaderApp'
import { PartnerSwitcher } from '@components/PartnerConnect/PartnerConnect'
import { AllBadges } from '../../web-app/components/AllBadges'
import { Friends } from '../../web-app/components/Friends'
import { Leaderboards } from '../../web-app/components/Leaderboards'
import { Reviews } from '../../web-app/components/Reviews'
import { FriendRequests } from '../../web-app/components/FriendRequests'
import { ChallengePage } from '../../web-app/components/ChallengePage'
import { CONNECTIONS } from '../../logging-flow/connections'
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
    banner: 'spring-into-reading',
  },
  {
    id: 'love-hurts',
    title: 'For the Love of Reading',
    dates: 'Ongoing',
    badge: 'Minutes',
    banner: 'for-the-love-of-reading',
  },
  {
    id: 'arresting',
    title: 'Lectores del Mundo',
    dates: 'Jun 1 — Jun 30',
    badge: 'Books',
    art: 'lectores',
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
    group: 'web-app',
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
    group: 'web-app',
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
    group: 'web-app',
    id: 'reader-page-head',
    name: 'ReaderPageHead',
    usage: `import { ReaderPageHead } from '@components/ReaderApp/ReaderApp'

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
                <Button variant="primary" size="md" icon={<Icon name="writing" size={15} />}>
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
    id: 'reader-challenge-card',
    name: 'ChallengeCard',
    usage: `import { ChallengeCard } from '@components/ReaderApp/ReaderApp'

/* a real challenge — its banner is in public/challenge-banners/ */
<ChallengeCard challenge={{ title, dates, badge, banner: 'spring-into-reading' }} onOpen={open} />

/* no banner — falls back to a drawn cover from CHALLENGE_ART */
<ChallengeCard challenge={{ title, dates, badge, art: 'lectores' }} />`,
    desc: (
      <>
        One challenge in the reader&apos;s challenge grid — cover art over the name, the dates, and
        what the challenge measures.
        <br />
        <br />
        <code>banner</code> names a file in <code>public/challenge-banners/</code> —
        Beanstack&apos;s own art for that challenge, out of <code>Design/Projects/Challenges</code>{' '}
        at 920×351 — and renders as <code>img.challenge-image</code> does in the app&apos;s own
        card. <code>art</code> is the fallback for a challenge with no banner: a drawn cover from{' '}
        <code>CHALLENGE_ART</code> (the app&apos;s own fallback is a grey{' '}
        <code>no-challenge-image.png</code>, which a prototype can do better than).
        <br />
        <br />
        What the challenge measures sits beside the name rather than floated over the artwork: the
        art is the challenge&apos;s identity, and the pill used to cover whatever part of it landed
        in that corner. <code>onOpen</code> makes the card go somewhere — it has always been a{' '}
        <code>&lt;button&gt;</code>, it just had no handler.
      </>
    ),
    render: () => (
      <Variant label="two real banners and a drawn cover" full>
        <div className="wa-chgrid" style={{ padding: 16 }}>
          {CHALLENGES.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      </Variant>
    ),
  },
  {
    group: 'web-app',
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
    group: 'web-app',
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
  {
    group: 'web-app',
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
    render: () => (
      <Variant label="two waiting — open the menu" full>
        <div style={{ padding: '20px 20px 200px', background: '#fff' }}>
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
        Reading List, Ticket Drawings and Certificates stay as furniture, the way the repo treats
        unbuilt tabs. The hero is the challenge&apos;s own banner from{' '}
        <code>public/challenge-banners/</code> — all three challenges here are real Beanstack ones,
        so each carries the art its design team ships, and the badges are that challenge&apos;s own
        illustrations rather than glyphs on coloured discs.
      </>
    ),
    render: () => (
      <Variant label="the Overview tab" full>
        <div style={{ padding: '0 20px 20px', background: '#fff' }}>
          <ChallengePage challenge={CHALLENGES[0]} />
        </div>
      </Variant>
    ),
  },
]
