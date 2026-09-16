import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import { InfoBox } from '@components/InfoBox/InfoBox'
import { EmptyState, Skeleton } from '@components/Primitives/Primitives'
import { GoalStat, GoalStats } from '@components/GoalStat/GoalStat'
import { ProgramHeader } from '@components/ProgramHeader/ProgramHeader'
import { ReaderBack, ReaderPageHead } from '@components/ReaderApp/ReaderApp'
import { BadgeArt, CollectionCard, ShelfGrid } from '@components/CollectionShelf/CollectionShelf'
import { Table } from '@components/Table/Table'
import { StatCard } from '@components/Cards/Cards'
import { SectionCard } from '@components/SectionCard/SectionCard'
import { FilterMenuBar } from '@components/FilterMenu/FilterMenu'
import { EarnedFilter } from '@components/EarnedFilter/EarnedFilter'
import { byEarnedState } from '@components/EarnedFilter/earned'

import { ReaderShell } from './ReaderChrome'
import { CoverTile, WordChips } from './common'
import {
  badgesForPath,
  wordsForPath,
  rewardsForPath,
  rewardUnlockLine,
  REQUIRED_READS,
  WORD_LIST,
  DESTINATION,
  CHALLENGES,
} from '../data'
import '../../web-app/components/ChallengePage.css'

/* This page is `web-app`'s `ChallengePage` — the reader's challenge page —
   with the two tabs this proposal adds. Every tab opens with the same page
   head, the reward rows are the app's own, and the title list is the shape the
   site's Book Lists page uses for the identical job. */

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'reading-list', label: 'Reading List' },
  { id: 'word-list', label: 'Word List' },
  { id: 'badges', label: 'Badges' },
  { id: 'rewards', label: 'Rewards' },
  { id: 'log', label: 'Challenge Log' },
]

// The challenge this path belongs to — its dates and what it asks of a reader
// are the challenge's, not the path's.
const CHALLENGE = CHALLENGES.find((c) => c.live)

/**
 * One title on the path — `logged_books/_book_list_grid__list_item`, which the
 * app draws as a **cover grid**: the art is the card, and the title, author and
 * actions sit under it. A finished title carries the app's completed
 * checkmarker on the cover itself.
 *
 * The one thing a path's shelf carries that an ordinary book list doesn't is
 * which of the destination's words the title puts to work.
 */
function BookCard({ title, path, read, onToggle, onReadInApp }) {
  return (
    <li className={`pyp-bookcard${read ? ' is-read' : ''}`}>
      <button
        type="button"
        className="pyp-bookcard-cover"
        onClick={onReadInApp}
        aria-label={title.title}
      >
        <CoverTile cover={title.cover} label={title.title} path={path} read={read} />
      </button>

      <div className="pyp-bookcard-body">
        <button type="button" className="pyp-bookcard-title" onClick={onReadInApp}>
          {title.title}
        </button>
        <span className="pyp-bookcard-author">{title.author}</span>
        <span className="pyp-bookcard-facts">
          {title.level}
          <span className="pyp-dot">·</span>
          {title.pages} pages
        </span>
        {/* No word chips here on purpose: finding the words is the point, and a
            shelf that labels every title with the ones inside it does the
            finding for you. */}
      </div>

      <div className="pyp-bookcard-actions">
        {read ? (
          <button className="pyp-read-toggle is-read" onClick={onToggle} type="button">
            <Icon name="check" size={16} stroke={3} /> Read
          </button>
        ) : (
          <>
            {/* In the path's own colour, through the Button's `accent` variant
                rather than a stylesheet repainting a primary. */}
            <Button variant="accent" accent={path.color} size="sm" onClick={onReadInApp}>
              Read Now
            </Button>
            <Button variant="secondary" size="sm" onClick={onToggle}>
              Log
            </Button>
          </>
        )}
      </div>
    </li>
  )
}

// One extension-activity card.
function ActivityCard({ activity, path, done, response, onOpen }) {
  return (
    <button
      type="button"
      className={`pyp-actcard${done ? ' is-done' : ''}`}
      style={{ '--path-color': path.color }}
      onClick={onOpen}
    >
      <span className="pyp-actcard-icon">
        <Icon name={activity.icon} size={22} stroke={1.8} />
      </span>
      <span className="pyp-actcard-text">
        <span className="pyp-actcard-name">{activity.name}</span>
        <span className="pyp-actcard-prompt">{done ? `“${response}”` : activity.short}</span>
      </span>
      <WordChips words={activity.words} className="pyp-actcard-words" />
      <span className={`pyp-actcard-foot${done ? ' is-done' : ''}`}>
        {done ? (
          <>
            <Icon name="circle-check-filled" size={15} color="#0BA85F" /> Completed
          </>
        ) : (
          <>
            Start activity <Icon name="arrow-right" size={14} stroke={2.3} />
          </>
        )}
      </span>
    </button>
  )
}

/**
 * Screen 3 — one destination, from the student's side: the reader's challenge
 * page, with the path the student chose carried in the header band.
 */
export function Destination({
  path,
  readIds,
  loggedOn,
  collected,
  doneIds,
  responses,
  streak,
  onToggleRead,
  onReadTitle,
  onOpenActivity,
  onOpenBadge,
  tab: tabProp,
  onTab,
  onChangePath,
  onNav,
}) {
  /* Which tab is showing. The page owns it unless a parent wants to deep-link
     — "See my words" after a log lands on the Word List. */
  const [ownTab, setOwnTab] = useState('overview')
  const tab = tabProp ?? ownTab
  const setTab = (id) => {
    setOwnTab(id)
    onTab?.(id)
  }
  const [titleState, setTitleState] = useState('all')
  const [wordState, setWordState] = useState('all')
  const [badgeState, setBadgeState] = useState('all')
  const [rewardState, setRewardState] = useState('all')

  const read = new Set(readIds)
  const done = new Set(doneIds)
  const readCount = path.titles.filter((t) => read.has(t.id)).length
  // Only REQUIRED_READS of the shelf are required, so progress tracks that —
  // the other titles are choice, not backlog.
  const readGoal = Math.min(REQUIRED_READS, path.titles.length)
  const readToward = Math.min(readCount, readGoal)
  const doneCount = path.activities.filter((a) => done.has(a.id)).length
  const words = wordsForPath(path, readIds, collected)
  const foundWords = words.filter((w) => w.found)
  const badges = badgesForPath(path, readIds, doneIds)
  const earnedBadges = badges.filter((b) => b.earned)
  const pathComplete = badges.find((b) => b.kind === 'destination')?.earned

  // `_overview_list_goals` — every requirement as a tile, each one a link to the
  // tab that explains its number.
  const goals = [
    { label: 'Titles Read', have: readToward, need: readGoal, tab: 'reading-list' },
    {
      label: 'Words Found',
      have: foundWords.length,
      need: words.length,
      tab: 'word-list',
    },
    {
      label: 'Activities Done',
      have: doneCount,
      need: path.activities.length,
      tab: 'badges',
    },
    {
      label: 'Badges Earned',
      value: earnedBadges.length,
      icon: 'award',
      accent: '#B45309',
      tab: 'badges',
    },
    { label: 'Day Streak', value: streak, icon: 'flame-filled', accent: '#EA580C' },
  ]

  const rewards = rewardsForPath(path, readIds, doneIds, pathComplete)

  /* `programs#full_reading_log` — the challenge's own log: one row a session,
     with what it was, when it went on, and what it was worth. This challenge
     logs in pages, which is what its titles are counted in. */
  const log = path.titles
    .filter((t) => read.has(t.id))
    .map((t) => ({
      id: t.id,
      title: t.title,
      author: t.author,
      date: loggedOn?.[t.id],
      pages: t.pages,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
  const pagesLogged = log.reduce((n, r) => n + r.pages, 0)

  const logColumns = [
    {
      key: 'title',
      label: 'Title & Author',
      render: (_v, row) => (
        <span className="pyp-logtitle">
          <strong>{row.title}</strong>
          <span>{row.author}</span>
        </span>
      ),
    },
    { key: 'date', label: 'Added On' },
    { key: 'type', label: 'Log Type', render: () => 'Pages' },
    {
      key: 'pages',
      label: 'Log Value',
      align: 'right',
      render: (v) => `${v} pages`,
    },
  ]

  const isRead = (t) => read.has(t.id)

  return (
    <ReaderShell active="challenges" onNav={onNav} onLog={() => onReadTitle(path.titles[0])}>
      <div className="cp" style={{ '--path-color': path.color }}>
        <ProgramHeader
          back={<ReaderBack onClick={onNav}>Back to Challenges</ReaderBack>}
          /* The one thing this page can do to the challenge it is showing:
             travel it a different way. */
          action={
            <button type="button" className="pyp-changepath" onClick={onChangePath}>
              <Icon name="switch-horizontal" size={14} /> Change path
            </button>
          }
          /* The banner is the reader's own path, not the challenge's cover art:
             everyone in Room 14 is in Words of Motion, and this is the one they
             chose. The bands take its colour with it. */
          banner={path.banner}
          /* The path is the page — it is what this reader is actually in — and
             the destination it travels is what it belongs to. */
          title={path.name}
          subtitle={DESTINATION.title}
          dates={CHALLENGE.dates}
          tint={path.color}
          tags={
            <>
              {['Reading List', 'Activities', 'Books'].map((t) => (
                <Pill key={t} color="#1A6DD5" variant="soft" size="sm">
                  {t}
                </Pill>
              ))}
            </>
          }
        />

        <div className="cp-head">
          <div className="cp-tabs">
            <Tabs
              variant="pill"
              plain
              size="md"
              active={tab}
              onChange={setTab}
              ariaLabel="Challenge sections"
              items={TABS}
            />
          </div>
        </div>

        <div className="cp-body">
          {/* ── Overview — `_show.html.haml`: the description, Overall
              Progress, and Recently Earned Badges, in that order. ── */}
          {tab === 'overview' && (
            <>
              <section className="cp-section">
                <ReaderPageHead as="h2" title="Overview" />
                <h2 className="cp-h2">Challenge Description</h2>
                <p className="cp-description">
                  Everyone in Room 14 is learning the same four motion words — you just get to pick
                  the subject you learn them through. Read any {readGoal} of the{' '}
                  {path.titles.length} titles on {path.name}, finish both extension activities, and
                  the capstone badge is yours.
                </p>
              </section>

              {/* The four words themselves — the thing the whole challenge is
                  for, and the one fact the header can't fit. */}
              <section className="cp-section">
                <h2 className="cp-h2">Words You’re Practising</h2>
                {/* A word you have banked reads; one still out there is a blank
                    of the right length — finding them is the challenge. */}
                <WordChips words={WORD_LIST} size="lg" collected={collected} />
              </section>

              <section className="cp-section">
                <h2 className="cp-h2">Overall Progress</h2>
                <GoalStats>
                  {goals.map((g) => (
                    <GoalStat
                      key={g.label}
                      goal={g}
                      onClick={g.tab ? () => setTab(g.tab) : undefined}
                    />
                  ))}
                </GoalStats>
              </section>

              <section className="cp-section">
                <div className="cp-sectionhead">
                  <h2 className="cp-h2">Recently Earned Badges</h2>
                  {earnedBadges.length > 4 && (
                    <Button variant="secondary" size="sm" onClick={() => setTab('badges')}>
                      View All Badges
                    </Button>
                  )}
                </div>
                {earnedBadges.length === 0 ? (
                  <EmptyState
                    icon={<Icon name="award" size={26} />}
                    title="Maya hasn’t earned any badges yet."
                    description="Participate in the challenge to earn badges."
                  />
                ) : (
                  <ShelfGrid>
                    {earnedBadges.slice(0, 4).map((b) => (
                      <CollectionCard
                        key={b.id}
                        art={<BadgeArt src={b.art} />}
                        name={b.name}
                        blurb={b.sub}
                        date="Earned"
                        onOpen={() => onOpenBadge(b)}
                      />
                    ))}
                  </ShelfGrid>
                )}
              </section>
            </>
          )}

          {/* ── Reading List — the path's shelf, on the app's own list row. ── */}
          {tab === 'reading-list' && (
            <section className="cp-section">
              <ReaderPageHead as="h2" title={path.name} />
              {/* The list's rule — "read any three of these and it counts" —
                  takes the app's `.infobox` rather than sitting in the prose. */}
              <InfoBox icon={<Icon name="bulb" size={26} />} className="cp-listnote">
                Read any {readGoal} of these {path.titles.length} titles — pick the ones that look
                best. Each one puts two of your words to work.
              </InfoBox>

              <FilterMenuBar className="cp-listfilters">
                <EarnedFilter
                  items={path.titles}
                  isEarned={isRead}
                  value={titleState}
                  onChange={setTitleState}
                  ariaLabel="Which titles"
                  labels={{ earned: 'Read', unearned: 'To Read' }}
                />
              </FilterMenuBar>

              <ul className="pyp-bookgrid">
                {byEarnedState(path.titles, titleState, isRead).map((t) => (
                  <BookCard
                    key={t.id}
                    title={t}
                    path={path}
                    read={read.has(t.id)}
                    onToggle={() => onToggleRead(t.id)}
                    onReadInApp={() => onReadTitle(t)}
                  />
                ))}
              </ul>
            </section>
          )}

          {/* ── Word List — the vocabulary half of the challenge. A word is
              met in a book and banked by logging it, so this tab is the
              reading list read the other way round. ── */}
          {tab === 'word-list' && (
            <section className="cp-section">
              <ReaderPageHead as="h2" title="Word List" />
              <InfoBox icon={<Icon name="bulb" size={26} />} className="cp-listnote">
                Every title on your path uses two of these words. Find a word in a book, log the
                book, and the word unlocks — meanings and all.
              </InfoBox>

              <div className="pyp-logsummary">
                <StatCard
                  label="Words Found"
                  value={foundWords.length}
                  color={path.color}
                  icon={<Icon name="quote" size={22} />}
                />
                <StatCard
                  label="Still Hiding"
                  value={words.length - foundWords.length}
                  color="#656565"
                  icon={<Icon name="lock" size={22} />}
                />
                <StatCard
                  label="Titles Read"
                  value={readCount}
                  color="#1A6DD5"
                  icon={<Icon name="book" size={22} />}
                />
              </div>

              <FilterMenuBar className="cp-listfilters">
                <EarnedFilter
                  items={words}
                  isEarned={(w) => w.found}
                  value={wordState}
                  onChange={setWordState}
                  ariaLabel="Which words"
                  labels={{ earned: 'Found', unearned: 'Still hiding' }}
                />
              </FilterMenuBar>

              <ul className="pyp-wordgrid">
                {byEarnedState(words, wordState, (w) => w.found).map((w) => (
                  <li key={w.word} className={`pyp-wordcard${w.found ? ' is-found' : ''}`}>
                    <header className="pyp-wordcard-head">
                      {/* A word you haven't found is a blank of the right
                          length — the whole challenge is going and finding
                          them, so the list can't just print them. */}
                      <h3 className="pyp-wordcard-word">
                        {w.found ? w.word : '•'.repeat(Math.min(w.word.length, 10))}
                      </h3>
                      <span className="pyp-wordcard-state">
                        {w.found ? (
                          <Icon name="circle-check-filled" size={17} color="#0BA85F" />
                        ) : (
                          <Icon name="lock" size={15} />
                        )}
                      </span>
                    </header>

                    {/* Locked, a word is its name and where to look — the
                        meaning is the thing you unlock. */}
                    {w.found ? (
                      <>
                        <p className="pyp-wordcard-meaning">{w.definition}</p>
                        <p className="pyp-wordcard-foot">Found in {w.foundIn[0].title}</p>
                      </>
                    ) : (
                      /* Where the meaning will be — the card keeps its shape,
                         so unlocking one fills a space rather than growing the
                         grid. Nothing else: how many titles it is hiding in is
                         a clue the reader is better off without. */
                      <Skeleton lines={2} className="pyp-wordcard-blank" />
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── Badges — `earnables/grid/_earnable`, the shelf every badge
              surface in the system uses. ── */}
          {tab === 'badges' && (
            <section className="cp-section">
              <ReaderPageHead as="h2" title="Badges" />
              <FilterMenuBar className="cp-listfilters">
                <EarnedFilter
                  items={badges}
                  isEarned={(b) => b.earned}
                  value={badgeState}
                  onChange={setBadgeState}
                  ariaLabel="Which badges"
                />
              </FilterMenuBar>
              <ShelfGrid>
                {byEarnedState(badges, badgeState, (b) => b.earned).map((b) => (
                  <CollectionCard
                    key={b.id}
                    art={<BadgeArt src={b.art} />}
                    name={b.name}
                    blurb={b.sub}
                    locked={!b.earned}
                    /* No ring: every badge on a path is all-or-nothing — one
                       title read, one activity finished, the whole path done —
                       so there is no share to draw. */
                    date={b.earned ? 'Earned' : 'Not yet earned'}
                    onOpen={() => onOpenBadge(b)}
                  />
                ))}
              </ShelfGrid>

              {/* An activity badge *is* its activities (`LearningTrack`), so
                  they belong on the badges page rather than a tab of their own —
                  the app lists them under the badge they earn. These ask for a
                  written answer, which a tick can't collect, so each one opens
                  its own card. */}
              <div className="cp-listhead">
                <h3 className="cp-h2">Extension Activities</h3>
                <p className="cp-subhead">
                  {doneCount} of {path.activities.length} done — each one earns the badge above it.
                </p>
              </div>
              <div className="pyp-actgrid">
                {path.activities.map((a) => (
                  <ActivityCard
                    key={a.id}
                    activity={a}
                    path={path}
                    done={done.has(a.id)}
                    response={responses[a.id]}
                    onOpen={() => onOpenActivity(a)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── Rewards — `programs/_reward.html.haml`, row for row: the
              status mark, the title, the sentence that says how it was
              unlocked (or what will), and the instructions once it's yours. ── */}
          {tab === 'rewards' && (
            <section className="cp-section">
              <ReaderPageHead as="h2" title="Rewards" />
              <FilterMenuBar className="cp-listfilters">
                <EarnedFilter
                  items={rewards}
                  isEarned={(r) => Boolean(r.earned)}
                  value={rewardState}
                  onChange={setRewardState}
                  ariaLabel="Which rewards"
                />
              </FilterMenuBar>
              <ul className="cp-rewards">
                {byEarnedState(rewards, rewardState, (r) => Boolean(r.earned)).map((r) => (
                  <li key={r.id} className={`cp-reward is-${r.earned ? 'earned' : 'unearned'}`}>
                    <span className="cp-reward-mark">
                      <Icon name={r.earned ? 'circle-check-filled' : 'gift'} size={26} />
                    </span>
                    <div className="cp-reward-copy">
                      <h3 className="cp-reward-name">{r.name}</h3>
                      <span className="cp-reward-detail">{rewardUnlockLine(r)}</span>
                    </div>
                    <span className="cp-reward-at">
                      <Pill color={r.earned ? '#0F7A55' : '#656565'} variant="soft" size="sm">
                        {r.redeemed ? 'Redeemed' : r.earned ? 'Earned' : 'Locked'}
                      </Pill>
                    </span>
                    {/* Only ever on an earned reward — an unearned one has
                        nothing to claim yet, and a redeemed one has nothing
                        left to do. */}
                    {r.earned && (
                      <div className="cp-reward-inst">
                        <h4>Instructions</h4>
                        <p>{r.redeemed ? 'Reward has been redeemed.' : r.instructions}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── Challenge Log — `programs#full_reading_log`: a Summary of what
              has been logged against this challenge, then the Log Items
              themselves. ── */}
          {tab === 'log' && (
            <>
              <section className="cp-section">
                <ReaderPageHead as="h2" title="Challenge Log" />
                <div className="pyp-logsummary">
                  <StatCard
                    label="Titles Logged"
                    value={log.length}
                    color={path.color}
                    icon={<Icon name="book" size={22} />}
                  />
                  <StatCard
                    label="Pages"
                    value={pagesLogged.toLocaleString()}
                    color="#1A6DD5"
                    icon={<Icon name="file-text" size={22} />}
                  />
                  <StatCard
                    label="Words Found"
                    value={foundWords.length}
                    color="#B43DD0"
                    icon={<Icon name="quote" size={22} />}
                  />
                  <StatCard
                    label="Badges Earned"
                    value={earnedBadges.length}
                    color="#B45309"
                    icon={<Icon name="award" size={22} />}
                  />
                </div>
              </section>

              <SectionCard header="bar" title="Log Items" flush className="pyp-logcard">
                <Table
                  columns={logColumns}
                  rows={log}
                  getRowKey={(r) => r.id}
                  flush
                  scrollX
                  empty={`Nothing logged against ${path.name} yet.`}
                />
              </SectionCard>
            </>
          )}
        </div>
      </div>
    </ReaderShell>
  )
}
