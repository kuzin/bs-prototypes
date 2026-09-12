import { useState } from 'react'

import { Button } from '@components/Button/Button'

import { WordUnlock } from '../../words-with-benny/components/WordUnlock'
import { Activity } from '../../words-with-benny/components/Activities'
import { Flashcards, ReviewStrip } from '../../words-with-benny/components/Flashcards'
import { MyWords, WordTile } from '../../words-with-benny/components/MyWords'
import { Collections } from '../../words-with-benny/components/Collections'
import { EducatorWords } from '../../words-with-benny/components/EducatorWords'
import { StudentVocabulary } from '../../words-with-benny/components/StudentVocabulary'
import { ClassroomView } from '../../student-profile/BeanstackProfile'
import { EducatorWords as EducatorWordsTab } from '../../words-with-benny/components/EducatorWords'
import {
  ACTIVITY_TYPES,
  SEED_COLLECTION,
  WORDS_BY_BOOK,
  seedReviews,
} from '../../words-with-benny/data'
import { Variant } from './_shared'

// The rail card borrows `.wa-card` from the reader dashboard it's injected
// into, so pull that stylesheet in the way the other groups do.
import '@components/ReaderApp/ReaderApp.css'

const noop = () => {}

// Beat 1 → 2 → 3 of the unlock, driven for real rather than mocked per stage.
function WordUnlockDemo() {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(SEED_COLLECTION.length)
  return (
    <div>
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

// Each activity type, driven for real. Passing a one-type `round` is the same
// override the prototype's preview bar uses to demo one on its own.
function ActivityDemo({ type }) {
  const [done, setDone] = useState(false)
  return (
    <div style={{ padding: 20, background: '#f3f4f6' }}>
      <div style={{ padding: '20px 22px', background: '#fff', borderRadius: 20 }}>
        <Activity
          type={type}
          word={WORDS_BY_BOOK.matilda[1]}
          bookId="matilda"
          onPass={() => setDone(true)}
        />
        {done && (
          <p style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: '#047857' }}>
            Passed — the round would move on here.
          </p>
        )}
      </div>
    </div>
  )
}

const DECK_CARDS = seedReviews(SEED_COLLECTION)

function FlashcardsDemo() {
  const [open, setOpen] = useState(false)
  const [cards, setCards] = useState(DECK_CARDS)
  return (
    <div style={{ padding: 20, background: '#f3f4f6' }}>
      <ReviewStrip cards={cards} onStart={() => setOpen(true)} />
      <Flashcards
        open={open}
        cards={cards}
        collection={SEED_COLLECTION}
        onGrade={(word, knewIt) =>
          setCards((m) => ({
            ...m,
            [word]: { ...m[word], box: knewIt ? Math.min(m[word].box + 1, 5) : 1 },
          }))
        }
        onClose={() => setOpen(false)}
      />
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
        The post-log moment, in three beats. <strong>card</strong> — Benny hands the word over on
        the dark ground, in the big type: what it is, how to say it, what it means, and the line
        tying it back to the book. It was two screens with a sealed card between them; the seal was
        a tap that bought nothing, since the reader had just pressed a button saying a word was
        coming. <strong>round</strong> — three <code>Activity</code> rungs on that one word, with
        the word pinned above them, because this is a collection and not an exam.{' '}
        <strong>done</strong> — banked, with the running count and when the word comes back in the
        deck.
        <br />
        <br />
        Neither the plan nor a progress rail is drawn. Three short goes don&apos;t need a step
        counter, and announcing them up front turned the moment a reader is given something into a
        briefing about what they now have to do.
        <br />
        <br />
        The round replaced a single multiple-choice question: one touch banks a word the reader has
        already forgotten by the next log. A wrong answer is marked and nudged rather than
        penalised, and the reader stays on the rung until they get it — whether they needed a second
        go is the signal the educator roll-up reports as first-try accuracy.
        <br />
        <br />
        Props: <code>open</code>, <code>word</code>, <code>bookId</code>,{' '}
        <code>collectedCount</code>, <code>round</code> (override the word&apos;s own three),{' '}
        <code>onCollect</code>, <code>onClose</code>, <code>onSeeAll</code>. With no{' '}
        <code>bookId</code> (a manual or untitled log) the copy falls back to &ldquo;what you just
        read&rdquo;.
      </>
    ),
    render: () => (
      <Variant label="word → round → collected">
        <WordUnlockDemo />
      </Variant>
    ),
  },
  {
    group: 'words-with-benny',
    id: 'wb-activities',
    name: 'Activity',
    desc: (
      <>
        The nine ways Benny asks about a word, behind one dispatcher. All take <code>type</code> /{' '}
        <code>word</code> / <code>bookId</code> / <code>onPass</code> and report the same{' '}
        <code>{'{ firstTry }'}</code>, so <code>WordUnlock</code> can string any three together
        without knowing which is which.
        <br />
        <br />
        They climb a ladder — <strong>recognise it</strong> (match the meaning, fill in the blank,
        find the near-match, match the pairs), <strong>use it</strong> (pick the right sentence,
        finish the passage, pick a card, spot the odd one), <strong>produce it</strong> (write your
        own) — and a round never repeats a rung. Four of them are the same choose-from-a-list shape,
        so the newer ones deliberately aren&apos;t: <em>pick a card</em> deals one sentence face
        down and asks for a yes/no on that one alone, <em>spot the odd one</em> is elimination
        rather than selection, and <em>match the pairs</em> is the only rung that puts several words
        in play at once — the new one shuffled in with two collected earlier, which is the
        repetition the whole round exists for.
        <br />
        <br />
        Only the passage, the writing check and the near-match need authored content — and the
        near-match only one everyday word per entry, kept in its own <code>SYNONYMS</code> map.
        Everything else is derived from the word itself, so adding a word still costs one entry.
        <br />
        <br />
        The passage is <strong>tap-then-tap first</strong>, with native drag as an enhancement —
        that&apos;s what a student on a trackpad or a tablet will actually do, and it&apos;s the
        path a keyboard can follow. The writing check is deliberately shallow (a prototype
        can&apos;t run the model) but the same shape a real one would take: did they use the word,
        is it a sentence, is it theirs — and anything it can&apos;t confidently accept goes to the
        teacher&apos;s queue rather than being marked wrong at a child.
      </>
    ),
    render: () => (
      <>
        {ACTIVITY_TYPES.map((t) => (
          <Variant key={t.id} label={`${t.rung} — ${t.label}`} full>
            <ActivityDemo type={t.id} />
          </Variant>
        ))}
      </>
    ),
  },
  {
    group: 'words-with-benny',
    id: 'wb-flashcards',
    name: 'Flashcards',
    desc: (
      <>
        The collection, turned round. Everything else pushes words <em>into</em> the collection;
        this is the one surface that hands them back — a deck built from the words the reader
        already owns, led by the ones going stale.
        <br />
        <br />
        Scheduling is Leitner: five boxes at widening intervals, a word the reader knows moves up a
        box and isn&apos;t asked again for twice as long, a word they miss drops to box one and
        comes round tomorrow. That&apos;s what lets the collection keep growing without the early
        words quietly falling out of it — and why each grade button says when the word comes back
        rather than just being right or wrong.
        <br />
        <br />
        <code>ReviewStrip</code> is the entry point, sitting above the collection; it states the
        caught-up case rather than disappearing. The deck itself takes <code>open</code>,{' '}
        <code>cards</code>, <code>collection</code>, <code>onGrade</code>, <code>onClose</code>, is
        fixed at the moment it opens (grading must not reshuffle the pile mid-session), and is
        driveable from the keyboard: space flips, ← and → grade.
      </>
    ),
    render: () => (
      <Variant label="the strip, and the deck behind it" full>
        <FlashcardsDemo />
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
        <div style={{ padding: '24px 20px 20px', background: '#f3f4f6' }}>
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
        analogous to a reading log&rdquo;. A stat strip over a tile grid, newest word first; each
        tile names the book the word came from. It&apos;s the Words pane of <code>Collections</code>
        , so it owns no header of its own and starts at the stat strip.
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
    id: 'wb-student-vocabulary',
    name: 'StudentVocabulary',
    desc: (
      <>
        The per-student half of the educator reporting, as a{' '}
        <strong>section of the real Student Profile</strong> rather than a bespoke panel — a teacher
        who clicks a name in the roster lands where they already go for everything else about that
        student. <code>StudentProfileView</code> grew <code>initialSection</code>,{' '}
        <code>extraNav</code>, <code>renderExtra</code> and <code>overrides</code> to allow it, all
        additive, so Student Profile, RIS and SfR are untouched.
        <br />
        <br />
        Shows the numbers a teacher actually asks about — words, this week, first-try accuracy,
        reading logs, and where they sit against the class median — over the same collection the
        student sees. Words that took more than one try are tagged <code>retried</code>. Props:{' '}
        <code>studentId</code>.
      </>
    ),
    render: () => (
      <Variant label="a strong collector" full>
        <div style={{ background: '#fff' }}>
          <StudentVocabulary studentId="marcus" />
        </div>
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
        <br />
        <br />
        It isn&apos;t a destination: Vocabulary is{' '}
        <strong>a fourth tab on the real classroom page</strong>, where a teacher already goes to
        look at this class. The page is the Student Profile prototype&apos;s own{' '}
        <code>ClassroomView</code>, which grew additive <code>extraTabs</code> /{' '}
        <code>renderExtra</code> slots so another prototype can hang a tab off it instead of cloning
        it.
      </>
    ),
    render: () => (
      <Variant label="the tab's content on its own" full>
        <div style={{ padding: 24 }}>
          <EducatorWords onOpenStudent={noop} />
        </div>
      </Variant>
    ),
  },
]
