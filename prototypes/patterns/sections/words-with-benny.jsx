import { useState } from 'react'

import { Button } from '@components/Button/Button'

import { WordUnlock } from '../../words-with-benny/components/WordUnlock'
import { MyWords, WordTile } from '../../words-with-benny/components/MyWords'
import { Collections } from '../../words-with-benny/components/Collections'
import { WordsRailCard } from '../../words-with-benny/components/WordsRailCard'
import { EducatorWords } from '../../words-with-benny/components/EducatorWords'
import { StudentWords } from '../../words-with-benny/components/StudentWords'
import { SEED_COLLECTION, WORDS_BY_BOOK } from '../../words-with-benny/data'
import { Variant } from './_shared'

// The rail card borrows `.wa-card` from the consumer dashboard it's injected
// into, so pull that page's stylesheet in the way the other groups do.
import '../../web-app/index.css'

const noop = () => {}

// Beat 1 → 2 → 3 of the unlock, driven for real rather than mocked per stage.
function WordUnlockDemo() {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(SEED_COLLECTION.length)
  return (
    <div style={{ padding: 20 }}>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        Open the unlock moment →
      </Button>
      <WordUnlock
        open={open}
        word={WORDS_BY_BOOK.rump[2]}
        bookId="rump"
        collectedCount={count}
        onCollect={() => setCount((n) => n + 1)}
        onClose={() => setOpen(false)}
        onSeeAll={() => setOpen(false)}
      />
    </div>
  )
}

function StudentWordsDemo() {
  const [id, setId] = useState(null)
  return (
    <div style={{ padding: 20, display: 'flex', gap: 10 }}>
      <Button variant="primary" size="sm" onClick={() => setId('zoe')}>
        Open a strong collector →
      </Button>
      <Button variant="secondary" size="sm" onClick={() => setId('devon')}>
        Open a student barely started →
      </Button>
      <StudentWords studentId={id} onClose={() => setId(null)} />
    </div>
  )
}

function RailCardDemo() {
  return (
    <div style={{ padding: 20, background: '#f3f4f6' }}>
      <div style={{ width: 300 }}>
        <WordsRailCard collection={SEED_COLLECTION} logsSinceWord={1} onOpen={noop} />
      </div>
    </div>
  )
}

// Newest (rung as new) · a plain collected word · one from a magazine issue.
const TILE_CASES = [
  { entry: SEED_COLLECTION[SEED_COLLECTION.length - 1], isNew: true },
  { entry: SEED_COLLECTION[10], isNew: false },
  { entry: SEED_COLLECTION[3], isNew: false },
]

export const wordsWithBennySections = [
  {
    group: 'words-with-benny',
    id: 'wb-unlock',
    name: 'WordUnlock',
    desc: (
      <>
        The post-log moment, in three beats. <strong>knock</strong> — Benny turns up with a sealed
        card naming the book that was just logged, and the card is the only target on the screen.{' '}
        <strong>card</strong> — the word, how to say it, what it means, and the line tying it back
        to the book, then one check: which of three sentences uses it correctly. A wrong pick is
        marked and nudged rather than penalised, and the reader stays on the card until they get it.{' '}
        <strong>done</strong> — banked, with the running count. Whether it took one try is the
        signal the educator roll-up reports as first-try accuracy.
        <br />
        <br />
        Props: <code>open</code>, <code>word</code>, <code>bookId</code>,{' '}
        <code>collectedCount</code>, <code>onCollect</code>, <code>onClose</code>,{' '}
        <code>onSeeAll</code>. With no <code>bookId</code> (a manual or untitled log) the copy falls
        back to &ldquo;what you just read&rdquo;.
      </>
    ),
    render: () => (
      <Variant label="knock → card → collected" bare>
        <WordUnlockDemo />
      </Variant>
    ),
  },
  {
    group: 'words-with-benny',
    id: 'wb-word-tile',
    name: 'WordTile',
    desc: (
      <>
        One collected word in the reader&apos;s collection — the word, its pronunciation and part of
        speech, the kid-facing meaning, and the book it came from. The book title ellipsizes rather
        than wrapping, so tiles stay the same height in a grid. <code>isNew</code> rings the word
        banked seconds ago, which is what returning from the unlock lands on.
      </>
    ),
    render: () => (
      <Variant label="new · collected · from a magazine" full>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 12,
            padding: 20,
            background: '#f3f4f6',
          }}
        >
          {TILE_CASES.map((c) => (
            <WordTile key={c.entry.word} entry={c.entry} isNew={c.isNew} />
          ))}
        </div>
      </Variant>
    ),
  },
  {
    group: 'words-with-benny',
    id: 'wb-rail-card',
    name: 'WordsRailCard',
    desc: (
      <>
        The collection&apos;s front door on the challenges page, injected into logging-flow&apos;s
        dashboard rail through its <code>railTop</code> slot — so it borrows that page&apos;s{' '}
        <code>.wa-card</code> shell and styles only its own internals. Carries the three most recent
        words and how many logs stand between the reader and the next one, which is what makes the
        &ldquo;every couple of logs&rdquo; cadence legible before it fires. Leads into the{' '}
        <code>Collections</code> tab.
      </>
    ),
    render: () => (
      <Variant label="16 collected, a word due on the next log" bare>
        <RailCardDemo />
      </Variant>
    ),
  },
  {
    group: 'words-with-benny',
    id: 'wb-collections',
    name: 'Collections',
    desc: (
      <>
        Everything the reader has accumulated, in one tab: the words Benny handed over, the badges
        they earned, and their milestone achievements. It <strong>replaces</strong> the reader
        dashboard&apos;s built-in &ldquo;All Badges&rdquo; tab (via <code>Dashboard</code>&apos;s{' '}
        <code>hideTabs</code>) — three shelves of the same kind of thing shouldn&apos;t be three
        top-level destinations. Owns the page header and a pill sub-tab strip, the same shape{' '}
        <code>ReadingLog</code> uses for its own sub-tabs; each pane is a plain grid on the page
        ground. The achievement medallions are Book Discovery&apos;s <code>AchievementArt</code>,
        not a second set.
      </>
    ),
    render: () => (
      <Variant label="words · badges · achievements" full>
        <div style={{ padding: '0 20px 20px', background: '#f3f4f6' }}>
          <Collections collection={SEED_COLLECTION} newestWord="suspicion" />
        </div>
      </Variant>
    ),
  },
  {
    group: 'words-with-benny',
    id: 'wb-my-words',
    name: 'MyWords',
    desc: (
      <>
        The vocabulary collection itself — the brief&apos;s &ldquo;growing personal record,
        analogous to a reading log&rdquo;. A stat strip over a tile grid, groupable{' '}
        <strong>by book</strong> and searchable across word, meaning and title. It&apos;s the Words
        pane of <code>Collections</code>, so it owns no header of its own and starts at the stat
        strip.
      </>
    ),
    render: () => (
      <Variant label="the Words pane on its own" full>
        <div style={{ padding: '0 20px 20px', background: '#f3f4f6' }}>
          <MyWords collection={SEED_COLLECTION} newestWord="suspicion" />
        </div>
      </Variant>
    ),
  },
  {
    group: 'words-with-benny',
    id: 'wb-student-words',
    name: 'StudentWords',
    desc: (
      <>
        The per-student half of the educator view: the same collection the student sees, plus the
        numbers a teacher actually asks about — words, this week, first-try accuracy, and where they
        sit against the class median. Words that took more than one try are tagged{' '}
        <code>retried</code>. Opens over the roster in a side <code>Modal</code> rather than
        navigating away, so comparing two students stays cheap. Props: <code>studentId</code>,{' '}
        <code>onClose</code>.
      </>
    ),
    render: () => (
      <Variant label="a strong collector · a student barely started" bare>
        <StudentWordsDemo />
      </Variant>
    ),
  },
  {
    group: 'words-with-benny',
    id: 'wb-educator-words',
    name: 'EducatorWords',
    desc: (
      <>
        The classroom roll-up. Built almost entirely from shared parts — <code>StatCard</code>/
        <code>ChartCard</code>, <code>BarList</code>, <code>TrendChart</code>, <code>Table</code>,
        pill <code>Tabs</code> — so the only new thing here is what it chooses to say. It leads with
        the promise (<em>nothing here was assigned</em>) because the problem the feature exists to
        solve is educator effort, then plots words collected against reading logs to show the two
        moving together. <strong>Class summary</strong> is the at-a-glance half;{' '}
        <strong>By student</strong> is the sortable roster that drills into{' '}
        <code>StudentWords</code> — named that way because the classroom page above already has its
        own Readers tab. Props: <code>onOpenStudent</code>.
      </>
    ),
    render: () => (
      <Variant label="the tab's content on its own" full>
        <EducatorWords onOpenStudent={noop} />
      </Variant>
    ),
  },
]
