import { useEffect, useRef, useState } from 'react'
import { Button } from '@components/Button/Button'
import { Toggle } from '@components/Toggle/Toggle'
import { CustomSelect } from '@components/CustomSelect/CustomSelect'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { EmptyState, Spinner } from '@components/Primitives/Primitives'
import { Avatar } from '@components/Avatar/Avatar'
import { Icon } from '@components/Icon/Icon'

import { BennyBubble } from '@components/BennyBubble/BennyBubble'
import { PartnerMark } from '@components/PartnerBrand/PartnerBrand'
import { Flyout, FlyoutMenu, FlyoutMenuItem } from '@components/Flyout/Flyout'
import { bannerSrc } from '@components/ReaderApp/ReaderApp'
import { Modal, ModalClose } from '@components/Modal/Modal'
import { Confetti } from '@components/Confetti/Confetti'
import { EpicImport } from '@components/EpicImport/EpicImport'
import { EarnedCard } from '@components/EarnedCard/EarnedCard'
import { useLockScroll } from '@components/useLockScroll/useLockScroll'

import { BookCover } from '@components/BookCover/BookCover'
import { LogCalendar, readableDates } from '@components/LogCalendar/LogCalendar'
import { LOG_TYPES, EVENT_TYPES, LOG_LIMITS, LOGGED_DATES } from '@components/LogFlow/logTypes'
import '@components/LogFlow/LogFlow.css'

import '@components/Button/Button.css'
import '@components/Toggle/Toggle.css'
import '@components/CustomSelect/CustomSelect.css'
import '@components/SearchInput/SearchInput.css'
import '@components/Primitives/Primitives.css'
import '@components/Avatar/Avatar.css'
import '@components/Modal/Modal.css'
import '@components/Confetti/Confetti.css'
import '@components/EpicImport/EpicImport.css'
import '@components/BookCover/BookCover.css'
import '@components/LogCalendar/LogCalendar.css'
import '@components/EarnedCard/EarnedCard.css'
import '@components/Flyout/Flyout.css'

/**
 * `microsite_settings` — the handful of site switches this flow reads. A site
 * turns these on in Setup, and each one changes what the reader is asked.
 */
const SITE_DEFAULTS = {
  // `back_logging_days` — how far into the past a reader may log.
  backlogDays: 14,
  // `@multiclick_enabled` — true where the site has a Days log type, and the
  // calendar then takes several dates at once.
  multiDate: false,
  // `roster_service_enabled?` — a school site. Only there are log values
  // policed, and then only for a reader staff haven't verified.
  rostered: false,
  verified: false,
  // `display_timer?`
  timer: true,
  // `display_scan_by_isbn?`
  scanIsbn: true,
  // `epic_integration?` — Epic hands over what the reader has already read
  // there, as a one-shot import rather than a standing link.
  epic: false,
  // `require_title_for_logs` — on, and "Log without a title" isn't offered.
  requireTitle: false,
  // `book_reviews?`
  bookReviews: true,
}

// `LogTypeMicrosite#default_max_value` — the fallback when a site has set no
// threshold of its own for a type.
const DEFAULT_LIMITS = { warn: 0, limit: 0 }

/* `@type = ["happy", "cool", "party"].sample` — the app keeps three Bennys for
   the finished-log screen and picks one each time. The app's own files
   (`completed_logged_books/`), so the screen looks the way it looks rather than
   the way we'd have drawn it. */
const ART = '/bs-prototypes/completed-logs'
const MOODS = {
  happy: `${ART}/happy.svg`,
  cool: `${ART}/cool.svg`,
  party: `${ART}/party.svg`,
}
const MOOD_IDS = Object.keys(MOODS)

/* What Epic hands back once the reader signs in. A real import asks Epic's API
   for the account's readers and their logs; this is a stand-in for that answer,
   which is all the screen in the middle needs to have something to map. */
const EPIC_READERS = [
  { id: 'e1', name: 'Olivia Martinez', books: 12, minutes: 340 },
  { id: 'e2', name: 'Noah Martinez', books: 5, minutes: 120 },
]

/* Who the flow logs for when nobody says. Every prototype passes its own. */
const DEMO_READER = { id: 'demo', name: 'Olivia Martinez', initials: 'OM', color: '#F09A77' }

/* What finishing a title wins here. The app builds these from the earnables the
   log actually triggered (`completed_earned_cards`); ours is a fixture, but the
   shape is the app's. */
const EARNED_CARDS = [
  {
    id: 'page-turner',
    label: 'Badge Earned',
    eyebrow: 'Page Turner',
    title: 'Finish a Title',
    description: 'For the Love of Reading',
    art: '/bs-prototypes/challenge-badges/for-the-love-of-reading/heart-balloon.webp',
    reward: 'Sticker Pack',
    tickets: 2,
    challenge: 'love-hurts',
  },
]

// Parse "1h", "33m", "1h33m", "90", "1:30" → whole minutes.
function parseMinutes(raw) {
  if (!raw) return 0
  const s = String(raw).trim().toLowerCase()
  const hm = s.match(/(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?/)
  if (hm && (hm[1] || hm[2])) return parseInt(hm[1] || 0, 10) * 60 + parseInt(hm[2] || 0, 10)
  const colon = s.match(/^(\d+):(\d{1,2})$/)
  if (colon) return parseInt(colon[1], 10) * 60 + parseInt(colon[2], 10)
  const n = parseInt(s, 10)
  return Number.isFinite(n) ? n : 0
}

function fmtClock(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const sec = totalSeconds % 60
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(sec)}`
}

function fmtMinutes(min) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h && m) return `${h} hr ${m} min`
  if (h) return `${h} hr`
  return `${m} min`
}

const coverLabel = (b) => b.title

const EMOTICONS = ['😍', '😂', '🤩', '😢', '🤔', '👏', '🔥', '💜']
const REVIEW_OPTIONS = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' },
]

// `onTalkToBenny` and `onOpenWord` are optional and additive: pass either and
// the success step offers a next beat on what was just logged — a Book Talk
// about it, or the vocabulary word it unlocked (Words with Benny). Left off,
// the flow is exactly as it was.
//
// `partners` is the list of reading apps this prototype offers to link; pass
// `[]` and a partner-catalog title stops advertising which app it came from
// (it's then just a book you can log).
//
// `books` / `recentlyLogged` let a reusing prototype bring its own catalog —
// Words with Benny swaps in a shelf of ordinary books, since partner titles are
// beside its point.
export function LogFlow({
  open,
  onClose,
  onLogged,
  connections = {},
  onTalkToBenny,
  onOpenWord,
  /* The catalog this flow searches and the shelves it offers. All demo data,
     so all of it comes in — a shared component doesn't get to know about any
     one prototype's fixtures. */
  partners = [],
  books = {},
  recentlyLogged = [],
  readingList,
  /* `reading_list_challenges#index` — the book-list challenges this reader is
     enrolled in. Given any, the search screen offers them. */
  readingListChallenges = [],
  reader: readerProp,
  readers = [],
  loggedDates = LOGGED_DATES,
  /* The `LogType` this site logs in — one of the nine `LOG_TYPES` by
     `short_name`. A site has combined logging on, so the reader is never asked
     which: `single_logging_destination` takes them straight to the title, and
     the form asks for whatever that type measures. */
  logType: logTypeId = 'minute',
  site,
  dailyGoal,
  /* What the success screen's buttons do. Each gets the earned card it was
     pressed on; left off, that button isn't offered. */
  onViewBadge,
  onReward,
  onTickets,
}) {
  const cfg = { ...SITE_DEFAULTS, ...site }
  const siteType = LOG_TYPES[logTypeId] ?? LOG_TYPES.minute
  /* The four types that are never about a book have nothing to search for, so
     the flow opens on the form — `source=without_title`. */
  const firstStep = siteType.withoutTitle ? 'details' : 'search'

  // search | lists | list | details | timer | review | success | reader
  const [step, setStep] = useState(firstStep)
  // Which reading-list challenge is open, on the `list` step.
  const [list, setList] = useState(null)
  const [returnStep, setReturnStep] = useState('search')
  const [logType, setLogType] = useState(siteType)
  // The extra questions a type asks instead of an amount — a moment's
  // description, an event's name and kind, a video's title.
  const [fields, setFields] = useState({})
  const [reader, setReader] = useState(readerProp ?? DEMO_READER)
  const [query, setQuery] = useState('')
  const [scanOpen, setScanOpen] = useState(false)
  const [epicOpen, setEpicOpen] = useState(false)

  const [book, setBook] = useState(null) // a BOOKS entry, or a synthetic manual/untitled book
  const [minutesInput, setMinutesInput] = useState('')
  const [countInput, setCountInput] = useState('')
  // `logged_book[date_read]` is a comma-separated list, so this is a list too —
  // empty means today, which is what the form defaults to.
  const [dates, setDates] = useState([])
  const [dateOpen, setDateOpen] = useState(false)
  const [finished, setFinished] = useState(false)
  const [reviewChoice, setReviewChoice] = useState('no')
  const [attested, setAttested] = useState(false)

  const [review, setReview] = useState({ title: '', author: '', text: '' })

  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const timerRef = useRef(null)

  const [result, setResult] = useState(null)

  // Reset everything each time the flow is opened.
  useEffect(() => {
    if (!open) return
    setStep(firstStep)
    setLogType(siteType)
    setFields({})
    // A title-less type opens straight on its form, so it needs its stand-in
    // book in place before the step renders.
    setBook(siteType.withoutTitle ? untitledFor(siteType) : null)
    setReader(readerProp ?? DEMO_READER)
    setQuery('')
    setScanOpen(false)
    setEpicOpen(false)
    setList(null)
    setBook(null)
    setMinutesInput('')
    setCountInput('')
    setDates([])
    setDateOpen(false)
    setFinished(false)
    setReviewChoice('no')
    setAttested(false)
    setReview({ title: '', author: '', text: '' })
    setTimerSeconds(0)
    setTimerRunning(false)
    setResult(null)
    // Only on open. `types` is rebuilt every render, so listing it here would
    // reset the flow under the reader's hands.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // The flow covers the window, so the page behind it holds still.
  useLockScroll(open)

  // Count-up timer.
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setTimerSeconds((s) => s + 1), 1000)
      return () => clearInterval(timerRef.current)
    }
  }, [timerRunning])

  // Escape dismisses the top-most layer first (reader → callout), else the flow.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const parsedMinutes = parseMinutes(minutesInput)
  const count = parseInt(countInput || 0, 10)
  // What this log is worth, in the type's own unit.
  const logValue = logType.input === 'time' ? parsedMinutes : logType.input === 'count' ? count : 1

  /* `LogLimitWarning` — a site sets two thresholds per log type. Over the first
     the reader is asked whether they're sure and made to promise; at the second
     the log is refused outright. Both only bite on a rostered site, for a
     reader staff haven't verified — a public library never questions a number,
     and neither does a school once a teacher has vouched for the reader. */
  const policed = cfg.rostered && !cfg.verified
  const { warn, limit } = LOG_LIMITS[logType.id] ?? DEFAULT_LIMITS
  const overWarn = policed && warn > 0 && logValue > warn && !(limit > 0 && logValue >= limit)
  const overLimit = policed && limit > 0 && logValue >= limit

  // Every extra question this type asks, answered.
  const fieldsDone = (logType.fields ?? []).every(
    (f) => !f.required || (fields[f.name] ?? '').trim(),
  )
  const hasAmount = logType.input === 'none' ? true : logValue > 0
  const canLog = hasAmount && fieldsDone && !overLimit && (!overWarn || attested)

  /* Which type a title logs under. The site's, except that a title counted in
     pages — a magazine — still logs in pages, which is how this flow has always
     behaved. */
  function typeForBook(b) {
    return b?.measure === 'pages' ? LOG_TYPES.page : siteType
  }

  // Picking a title takes you straight to the log details.
  function pickBook(b) {
    setScanOpen(false)
    logBook(b)
  }

  // Go to the log-details step for a book.
  function logBook(b) {
    setBook(b)
    setLogType(typeForBook(b))
    setReview((r) => ({
      ...r,
      title: b.manual || b.untitled ? r.title : b.title,
      author: b.manual || b.untitled ? r.author : b.author,
    }))
    setScanOpen(false)
    setStep('details')
  }

  function startManual() {
    pickBook({
      id: 'manual',
      title: '',
      author: '',
      cover: ['#707070', '#424242'],
      measure: 'minutes',
      manual: true,
    })
  }
  function startWithoutTitle() {
    pickBook({
      id: 'untitled',
      title: 'Reading (no title)',
      author: '',
      cover: ['#ACACAC', '#707070'],
      measure: 'minutes',
      untitled: true,
    })
  }

  function openReaderPicker() {
    setReturnStep(step)
    setStep('reader')
  }

  function finishTimer() {
    const mins = Math.max(1, Math.round(timerSeconds / 60))
    setMinutesInput(String(mins))
    setLogType(LOG_TYPES.minute)
    setTimerRunning(false)
    setStep('details')
  }

  function submitLog() {
    if (!canLog) return
    if (reviewChoice === 'yes') {
      setStep('review')
      return
    }
    completeLog(null)
  }

  function completeLog(reviewPayload) {
    const minutes = logType.id === 'minute' ? parsedMinutes : 0
    const pages = logType.id === 'page' ? count : 0
    /* One log per date: ticking five days in the calendar logs the amount on
       each of them, which is what `save_multiple_days_for_single_profile`
       does. */
    const days = Math.max(1, dates.length)
    const payload = {
      reader,
      book,
      logType: logType.id,
      // Kept for the prototypes built on this flow, which read the old two.
      measure: logType.id === 'page' ? 'pages' : 'minutes',
      minutes,
      pages,
      logValue,
      unit: logType.unit,
      days,
      fields,
      finished,
      date: readableDates(dates),
      dates,
      review: reviewPayload,
      earnedBadge: finished,
      mood: MOOD_IDS[Math.floor(Math.random() * MOOD_IDS.length)],
      /* `completed_summary_earnables` — what came out of this log, one card
         each. The eyebrow is the badge's name, the title is what it took, and
         the line under both is the challenge it belongs to. */
      earned: finished ? EARNED_CARDS : [],
    }
    setResult(payload)
    onLogged?.(payload)
    setStep('success')
  }

  const bookTitle = book?.untitled ? 'an untitled book' : book?.title || 'this book'
  /* `LoggingCalendarPresenter#log_item_dates` — the days already logged, which
     the calendar marks with a dot. Given as day offsets from today so a fixture
     doesn't go stale, and turned into real dates here. */
  const markedDates = loggedDates.map((offset) => {
    const d = new Date()
    d.setDate(d.getDate() + offset)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })

  return (
    <>
      <div className="lf-overlay" role="dialog" aria-modal="true" aria-label="Log reading">
        {/* Finishing a log is the one moment in this flow worth celebrating, so
            it gets the same burst a badge does. Over the whole surface rather
            than the content block — the pieces should fall past Benny, not
            inside a box around him. */}
        {step === 'success' && <Confetti count={24} distance={760} />}

        {/* top-right close (hidden on success — uses its own Done button) */}
        {step !== 'success' && (
          <button className="lf-iconbtn lf-close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={16} stroke={2.2} />
          </button>
        )}
        {/* back button on the secondary steps */}
        {step !== firstStep && step !== 'success' && step !== 'review' && (
          <button
            className="lf-iconbtn lf-back"
            onClick={() => {
              if (step === 'reader') return setStep(returnStep)
              if (step === 'timer') return setStep('details')
              if (step === 'list') return setStep('lists')
              setStep('search')
            }}
            aria-label="Back"
          >
            <Icon name="chevron-left" size={18} stroke={2.2} />
          </button>
        )}

        <div className="lf-scroll">
          {step === 'search' && (
            <SearchStep
              reader={reader}
              connections={connections}
              partners={partners}
              books={books}
              recentlyLogged={recentlyLogged}
              readingList={readingList}
              readingListChallenges={readingListChallenges}
              cfg={cfg}
              onEpic={() => setEpicOpen(true)}
              onLists={() => setStep('lists')}
              query={query}
              setQuery={setQuery}
              scanOpen={scanOpen}
              setScanOpen={setScanOpen}
              onPick={pickBook}
              onManual={startManual}
              onWithoutTitle={startWithoutTitle}
              onChangeReader={openReaderPicker}
            />
          )}

          {step === 'lists' && (
            <ReadingListStep
              challenges={readingListChallenges}
              onPick={(c) => {
                setList(c)
                setStep('list')
              }}
            />
          )}

          {step === 'list' && list && (
            <ReadingListDetail
              challenge={list}
              books={books}
              /* Logging from a list is `source=reading_list_challenge`: the
                 title is already chosen, so it goes straight to the form. */
              onLog={(b) => logBook(b)}
              onRead={(b) => logBook(b)}
            />
          )}

          {step === 'details' && book && (
            <DetailsStep
              reader={reader}
              book={book}
              logType={logType}
              cfg={cfg}
              fields={fields}
              setFields={setFields}
              minutesInput={minutesInput}
              setMinutesInput={setMinutesInput}
              countInput={countInput}
              setCountInput={setCountInput}
              dates={dates}
              onOpenDates={() => setDateOpen(true)}
              finished={finished}
              setFinished={setFinished}
              reviewChoice={reviewChoice}
              setReviewChoice={setReviewChoice}
              attested={attested}
              setAttested={setAttested}
              overWarn={overWarn}
              overLimit={overLimit}
              canLog={canLog}
              onChangeReader={openReaderPicker}
              onStartTimer={() => {
                setTimerSeconds(0)
                setTimerRunning(true)
                setStep('timer')
              }}
              onUpdateBook={(patch) => {
                setBook((b) => ({ ...b, ...patch }))
                setReview((r) => ({ ...r, ...patch }))
              }}
              onSubmit={submitLog}
            />
          )}

          {step === 'timer' && (
            <TimerStep
              seconds={timerSeconds}
              running={timerRunning}
              onToggle={() => setTimerRunning((r) => !r)}
              onReset={() => {
                setTimerSeconds(0)
                setTimerRunning(true)
              }}
              onDone={finishTimer}
            />
          )}

          {step === 'review' && (
            <ReviewStep review={review} setReview={setReview} onSave={() => completeLog(review)} />
          )}

          {step === 'reader' && (
            <ReaderStep
              current={reader}
              readers={readers}
              onSelect={(r) => {
                setReader(r)
                setStep(returnStep)
              }}
            />
          )}

          {step === 'success' && (
            <LogSuccess
              result={result}
              bookTitle={bookTitle}
              dailyGoal={dailyGoal}
              onViewBadge={onViewBadge}
              onReward={onReward}
              onTickets={onTickets}
              onDone={onClose}
              onAnother={() => {
                // Back to the top of the flow with the reader kept — the app
                // reopens `logged_books#new` for the same profile.
                setResult(null)
                setBook(null)
                setMinutesInput('')
                setCountInput('')
                setFields({})
                setDates([])
                setFinished(false)
                setReviewChoice('no')
                setAttested(false)
                setStep(firstStep)
              }}
              onTalkToBenny={onTalkToBenny}
              onOpenWord={onOpenWord}
            />
          )}
        </div>
      </div>

      {/* `epic_integration#login` — a one-shot import of what the reader has
          already read on Epic, over the flow that offered it. */}
      <EpicImport
        open={epicOpen}
        profiles={readers.length > 0 ? readers : [reader]}
        epicReaders={EPIC_READERS}
        /* An import is a batch of logs, so it earns things like any other log
           would — and the screen at the end of it says so on the same card. */
        earned={EARNED_CARDS}
        onViewBadge={onViewBadge}
        onReward={onReward}
        onTickets={onTickets}
        /* Record what came across, but leave the surface alone: Epic's own
           "Your Reading Has Been Imported!" is the next screen, and closing
           here skipped straight past it. Its Finish button is what closes. */
        onImported={(rows) => {
          rows.forEach((r) =>
            onLogged?.({
              reader: r.profile,
              source: 'epic',
              logType: 'minute',
              measure: 'minutes',
              minutes: r.minutes,
              books: r.books,
            }),
          )
        }}
        onClose={() => {
          setEpicOpen(false)
          onClose?.()
        }}
      />

      {/* The form's "Select Date" — a real calendar, because the app logs
          backwards and a reader filling in a missed week needs to see it. */}
      <LogCalendar
        open={dateOpen}
        value={dates}
        logged={markedDates}
        multi={cfg.multiDate}
        backlogDays={cfg.backlogDays}
        onSave={(picked) => {
          setDates(picked)
          setDateOpen(false)
        }}
        onClose={() => setDateOpen(false)}
      />
    </>
  )
}

/* A site that logs moments, events, videos or magazines never asks for a
   title, so the flow carries a stand-in in the book's place. */
function untitledFor(type) {
  return {
    id: `untitled-${type.id}`,
    title: '',
    author: '',
    cover: ['#ACACAC', '#707070'],
    untitled: true,
    withoutTitle: true,
  }
}

// ─── Reader header ("Logging for … · Select a different reader") ──────────────

function ReaderLine({ reader, onChange }) {
  return (
    <div className="lf-readerline">
      <span className="lf-readerlabel">Logging for</span>
      <span className="lf-readerpill" style={{ '--lf-reader': reader.color }}>
        <Avatar initials={reader.initials} color={reader.color} size="sm" />
        <span>{reader.name.split(' ')[0]}</span>
      </span>
      {onChange && (
        <button className="lf-link" onClick={onChange}>
          Select a different reader
        </button>
      )}
    </div>
  )
}

// ─── Reading List Challenges ─────────────────────────────────────────────────

/**
 * `reading_list_challenges#index` — the book-list challenges this reader is in.
 * A `Program` of type `book_list` is a set of titles somebody picked for them,
 * so the way into one is its banner and its name.
 */
function ReadingListStep({ challenges, onPick }) {
  return (
    <div className="lf-rlc">
      <h1 className="lf-h1">Reading List Challenges</h1>
      <ul className="lf-rlc-grid">
        {challenges.map((c) => (
          <li key={c.id}>
            <button type="button" className="lf-rlc-card" onClick={() => onPick(c)}>
              <img src={bannerSrc(c.banner)} alt="" className="lf-rlc-banner" />
              {/* `.gray-bar--bottom` — the app names the challenge on a bar
                  under its art rather than over it. */}
              <span className="lf-rlc-name">{c.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * `reading_list_challenges#show` — one challenge's titles. The app's own shape:
 * the banner in a tinted curved header, then **Select a Title** over a grid of
 * covers. A cover carries a tick once it's done and a mark where the title has
 * comprehension questions, and opens a menu of what you can do with it.
 *
 * Where the challenge requires specific titles the grid splits — the required
 * ones first under their own heading, everything else under "More Titles".
 */
function ReadingListDetail({ challenge, books, onLog, onRead }) {
  const req = challenge.required ?? {}
  const split = req.kind === 'specific'
  const required = split ? challenge.books.filter((b) => b.required) : challenge.books
  const rest = split ? challenge.books.filter((b) => !b.required) : []

  return (
    <div className="lf-rld">
      {/* `.book-list-header-background` — a band in the challenge's own colour
          with the banner sitting over it. */}
      <div className="lf-rld-head" style={{ '--rld-tint': challenge.tint }}>
        <img src={bannerSrc(challenge.banner)} alt="" className="lf-rld-banner" />
      </div>
      <h1 className="lf-rld-title">{challenge.title}</h1>
      <p className="lf-rld-dates">{challenge.dates ?? 'Ongoing Challenge'}</p>

      <h2 className="lf-rld-h2">Select a Title</h2>

      {split && (
        <div className="lf-rld-group">
          <h3 className="lf-rld-grouphead">Required Titles</h3>
          <p className="lf-rld-groupsub">
            {req.count} titles required, including these specific titles
          </p>
        </div>
      )}
      {!split && req.kind === 'count' && (
        <div className="lf-rld-group">
          <h3 className="lf-rld-grouphead">{req.count} titles required</h3>
        </div>
      )}

      <BookGrid rows={required} books={books} onLog={onLog} onRead={onRead} />

      {rest.length > 0 && (
        <>
          <div className="lf-rld-group">
            <h3 className="lf-rld-grouphead">More Titles</h3>
          </div>
          <BookGrid rows={rest} books={books} onLog={onLog} onRead={onRead} />
        </>
      )}
    </div>
  )
}

/** `.book-list-grid` — the covers, each with its own menu. */
function BookGrid({ rows, books, onLog, onRead }) {
  return (
    <ul className="lf-rld-grid">
      {rows.map((row) => {
        const book = books[row.id]
        if (!book) return null
        return (
          <li key={row.id} className="lf-rld-item">
            <Flyout
              placement="bottom"
              trigger={({ toggle }) => (
                <button
                  type="button"
                  className="lf-rld-cover"
                  onClick={toggle}
                  aria-label={book.title}
                >
                  <BookCover book={book} size="fill" />
                  {/* `.reading-integrity-wrapper` — this title asks questions. */}
                  {row.questions && (
                    <span className="lf-rld-mark lf-rld-mark--q">
                      <Icon name="help" size={13} stroke={2.4} />
                    </span>
                  )}
                  {/* `.completed-checkmarker-wrapper` */}
                  {row.done && (
                    <span className="lf-rld-mark lf-rld-mark--done">
                      <Icon name="check" size={13} stroke={3} />
                    </span>
                  )}
                </button>
              )}
            >
              {({ close }) => (
                <div className="lf-rld-menu">
                  <div className="lf-rld-menu-head">
                    <span className="lf-rld-menu-title">{book.title}</span>
                    {book.author && <span className="lf-rld-menu-author">{book.author}</span>}
                    {row.questions && <span className="lf-rld-pill">Questions</span>}
                  </div>
                  <FlyoutMenu>
                    {row.readNow && (
                      <FlyoutMenuItem
                        onClick={() => {
                          close()
                          onRead?.(book)
                        }}
                      >
                        <Icon name="book-2" size={16} /> Read Now
                      </FlyoutMenuItem>
                    )}
                    {row.goNow && (
                      <FlyoutMenuItem onClick={close}>
                        <Icon name="external-link" size={16} /> Go Now
                      </FlyoutMenuItem>
                    )}
                    <FlyoutMenuItem
                      onClick={() => {
                        close()
                        onLog?.(book)
                      }}
                    >
                      <Icon name="book" size={16} /> Log Reading
                    </FlyoutMenuItem>
                  </FlyoutMenu>
                </div>
              )}
            </Flyout>
          </li>
        )
      })}
    </ul>
  )
}

// ─── Step 1: search ──────────────────────────────────────────────────────────

function SearchStep({
  reader,
  connections,
  partners,
  books,
  recentlyLogged,
  readingList,
  readingListChallenges,
  cfg,
  onEpic,
  onLists,
  query,
  setQuery,
  scanOpen,
  setScanOpen,
  onPick,
  onManual,
  onWithoutTitle,
  onChangeReader,
}) {
  // Searching is debounced and given a visible wait. A real catalog lookup is a
  // network call, and matching on every keystroke both lied about that and made
  // the panel rebuild itself five times per word.
  const typed = query.trim().toLowerCase()
  const [q, setQ] = useState(typed)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (!typed) {
      // Clearing the field goes straight back to the shelves — nobody expects
      // to wait for the absence of a search.
      setQ('')
      setSearching(false)
      return
    }
    if (typed === q) return
    setSearching(true)
    const t = setTimeout(() => {
      setQ(typed)
      setSearching(false)
    }, 420)
    return () => clearTimeout(t)
  }, [typed, q])

  const results = q
    ? Object.values(books).filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q),
      )
    : []

  // What the step looks like at rest, measured. Everything the search can put
  // below the field — spinner, results, no-matches — then gets at least that
  // much room, so none of them can shrink the panel and pull the field up
  // while someone is typing into it. A long list is still free to grow down
  // the page. Reserving a hard-coded number instead would be wrong in
  // whichever prototype has a different set of shelves.
  const bodyRef = useRef(null)
  const [restHeight, setRestHeight] = useState(null)
  const atRest = !q && !searching && !scanOpen

  useEffect(() => {
    if (!atRest || !bodyRef.current) return
    const h = bodyRef.current.offsetHeight
    if (h) setRestHeight((prev) => (prev === h ? prev : h))
  }, [atRest, books, recentlyLogged])

  const bodyStyle = !atRest && !scanOpen && restHeight ? { minHeight: restHeight } : undefined

  // The barcode demo picks a real title out of whatever catalog is in play.
  const scanTarget = books['lucky-cap'] ?? Object.values(books)[0]

  return (
    <div className="lf-search">
      {/* Scanning takes the whole step — no reader line, no heading, no
          instruction. Pointing a camera at a book is a physical, two-handed
          thing, and a viewfinder with a live scan line needs no caption to
          explain itself. Cancel puts the step back. */}
      {!scanOpen && (
        <>
          <ReaderLine reader={reader} onChange={onChangeReader} />
          <h1 className="lf-h1">Select a Title</h1>

          <div className="lf-searchrow">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search for title or author"
            />
          </div>

          {/* `.logged-books--logging-actions` — the other ways in, each an icon
              over its name. They are the app's own set and each is a site
              setting: `display_scan_by_isbn?`, manual entry always, and the
              reader's book lists where they have any. Ours were a button
              wedged beside the search and two links at the foot of the page,
              which is three different weights for three equal choices. */}
          <div className="lf-actions">
            {cfg.scanIsbn && (
              <button type="button" className="lf-action" onClick={() => setScanOpen(true)}>
                <Icon name="barcode" size={26} stroke={1.7} />
                <span>Scan ISBN</span>
              </button>
            )}
            <button type="button" className="lf-action" onClick={onManual}>
              <Icon name="pencil" size={26} stroke={1.7} />
              <span>Manually Enter Title</span>
            </button>
            {/* `epic_integration?` — not another way to find a title but another
                way to log: Epic hands over what the reader has already read
                there. It sits with these because it answers the same question
                the screen is asking. */}
            {cfg.epic && (
              <button type="button" className="lf-action lf-action--epic" onClick={onEpic}>
                <img src="/bs-prototypes/epic/Mark.png" alt="" className="lf-action-mark" />
                <span>Import from Epic</span>
              </button>
            )}
            {/* `reading_list_challenges_path` — its own screen, and only where
                the reader is actually in one. */}
            {readingListChallenges.length > 0 && (
              <button type="button" className="lf-action" onClick={onLists}>
                <Icon name="book" size={26} stroke={1.7} />
                <span>Reading List Challenges</span>
              </button>
            )}
          </div>
        </>
      )}

      {scanOpen && (
        <div className="lf-scanner">
          <div className="lf-scanner-frame">
            <Icon name="barcode" size={104} stroke={1.3} />
            <span className="lf-scanner-line" />
          </div>
          <div className="lf-scanner-actions">
            <Button variant="primary" size="md" onClick={() => onPick(scanTarget)}>
              Simulate scan
            </Button>
            <Button variant="ghost" size="md" onClick={() => setScanOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* One region for everything the field can put on screen — shelves,
          spinner, results, no-matches — pinned to the resting height so
          swapping between them doesn't move the field the reader is typing
          into. */}
      {!scanOpen && (
        <div className="lf-searchbody" ref={bodyRef} style={bodyStyle}>
          {searching && (
            <div className="lf-searching">
              <Spinner size="md" color="#1a6dd5" />
              <p className="lf-searching-text">Searching the catalog…</p>
            </div>
          )}

          {!searching && q && results.length === 0 && (
            <EmptyState
              className="lf-empty"
              icon={<Icon name="search" size={26} stroke={1.7} />}
              title={`No titles match “${query}”`}
              description="Check the spelling, try the author instead, or put it in by hand — a title Beanstack doesn't know still counts."
              action={
                <div className="lf-empty-actions">
                  <Button variant="secondary" size="md" onClick={onManual}>
                    Log manually
                  </Button>
                  <Button variant="ghost" size="md" onClick={onWithoutTitle}>
                    Without a Title
                  </Button>
                </div>
              }
            />
          )}

          {!searching && q && results.length > 0 && (
            <div className="lf-results">
              {results.map((b) => (
                <button key={b.id} className="lf-resultrow" onClick={() => onPick(b)}>
                  <BookCover book={b} size="sm" />
                  <span className="lf-resultmeta">
                    <span className="lf-resulttitle">{b.title}</span>
                    <span className="lf-resultauthor">{b.author}</span>
                  </span>
                  {b.partner && partners.some((p) => p.id === b.partner) && (
                    <PartnerResultBadge
                      partnerId={b.partner}
                      partners={partners}
                      connections={connections}
                    />
                  )}
                  <Icon name="chevron-right" size={18} className="lf-resultchev" />
                </button>
              ))}
            </div>
          )}

          {!searching && !q && (
            <>
              {/* A shelf from a linked partner's catalog, so it only appears once
              that account is connected. */}
              {readingList && (!readingList.partner || connections[readingList.partner]) && (
                <section className="lf-panel lf-rlband">
                  <div className="lf-rlhead">
                    <PartnerMark id={readingList.partner} size={20} />
                    <h2 className="lf-panel-title lf-rlhead-title">{readingList.title}</h2>
                  </div>

                  <div className="lf-coverrow lf-coverrow--rl">
                    {readingList.titles
                      .filter((id) => books[id])
                      .map((id) => {
                        const logged = readingList.completed.includes(id)
                        return (
                          <button
                            key={id}
                            className={`lf-coverbtn lf-rltitle${logged ? ' is-logged' : ''}`}
                            onClick={() => onPick(books[id])}
                            title={coverLabel(books[id])}
                          >
                            <BookCover book={books[id]} size="md" />
                            {logged && (
                              <span className="lf-rlcheck" aria-label="Logged">
                                <Icon name="check" size={12} stroke={3} />
                              </span>
                            )}
                          </button>
                        )
                      })}
                  </div>
                  <button className="lf-link lf-viewall">
                    View all {readingList.total} {readingList.unit || 'titles'} ›
                  </button>
                </section>
              )}

              {/* Recently logged */}
              <section className="lf-panel">
                <h2 className="lf-panel-title">Recently Logged Titles</h2>
                <div className="lf-coverrow lf-coverrow--center">
                  {recentlyLogged
                    .filter((id) => books[id])
                    .map((id) => (
                      <button
                        key={id}
                        className="lf-coverbtn"
                        onClick={() => onPick(books[id])}
                        title={coverLabel(books[id])}
                      >
                        <BookCover book={books[id]} size="md" />
                      </button>
                    ))}
                </div>
              </section>

              {/* `.logged-books--log-without-title` — the app's own last line,
                  and a plain link because it is the way out of the question
                  rather than another answer to it. A site that insists on a
                  title (`require_title_for_logs`) doesn't offer it. */}
              {!cfg.requireTitle && (
                <p className="lf-escape">
                  <button className="lf-link" onClick={onWithoutTitle}>
                    Log without a title
                  </button>
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

// Search-result badge for a title that lives in a partner's catalog.
function PartnerResultBadge({ partnerId, partners = [], connections = {} }) {
  const linked = Boolean(connections[partnerId]?.autoLog)
  const name = partners.find((p) => p.id === partnerId)?.name
  return (
    <span className={`lf-resultbadge lf-resultbadge--partner${linked ? ' is-linked' : ''}`}>
      <PartnerMark id={partnerId} size={14} />
      {linked ? 'Logs itself' : name}
    </span>
  )
}

// ─── Step 2: details ───────────────────────────────────────────────────────

function DetailsStep({
  reader,
  book,
  logType,
  cfg,
  fields,
  setFields,
  minutesInput,
  setMinutesInput,
  countInput,
  setCountInput,
  dates,
  onOpenDates,
  finished,
  setFinished,
  reviewChoice,
  setReviewChoice,
  attested,
  setAttested,
  overWarn,
  overLimit,
  canLog,
  onChangeReader,
  onStartTimer,
  onUpdateBook,
  onSubmit,
}) {
  const setField = (name, v) => setFields((f) => ({ ...f, [name]: v }))
  return (
    <div className="lf-details">
      {/* The four types that are never about a book don't show one. */}
      {!book.withoutTitle && (
        <div className="lf-details-cover">
          <BookCover book={book} size="lg" />
          {!book.manual && (
            <>
              <div className="lf-coverttl">{book.untitled ? 'No title' : book.title}</div>
              {book.author && <div className="lf-coverauth">{book.author}</div>}
            </>
          )}
        </div>
      )}

      <div className="lf-details-form">
        <ReaderLine reader={reader} onChange={onChangeReader} />
        <hr className="lf-rule" />

        {book.manual && (
          <div className="lf-manualfields">
            <div className="lf-field">
              <div className="lf-label">Book Title</div>
              <input
                className="lf-input"
                placeholder="Book title"
                value={book.title}
                onChange={(e) => onUpdateBook({ title: e.target.value })}
              />
            </div>
            <div className="lf-field">
              <div className="lf-label">Author</div>
              <input
                className="lf-input"
                placeholder="Author"
                value={book.author}
                onChange={(e) => onUpdateBook({ author: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* `date-read-section` — the form says which day (or days) this log
            lands on, and "Select Date" opens the calendar. */}
        <div className="lf-daterow">
          <div className="lf-datetext">
            <div className="lf-label">Logging Reading for</div>
            <div className="lf-datevalue">{readableDates(dates)}</div>
          </div>
          <Button variant="secondary" size="sm" onClick={onOpenDates}>
            Select Date
          </Button>
        </div>

        {/* The amount, in whichever shape this type takes it. */}
        {logType.input === 'time' && (
          <div className="lf-field">
            <div className="lf-label">{logType.valueLabel}</div>
            <div className="lf-inputrow">
              <input
                className={`lf-input${overLimit ? ' lf-input--stop' : overWarn ? ' lf-input--warn' : ''}`}
                placeholder={'Type "1h", "33m", or "1h33m"'}
                value={minutesInput}
                onChange={(e) => setMinutesInput(e.target.value)}
              />
              {cfg.timer && (
                <Button variant="secondary" size="md" onClick={onStartTimer}>
                  Start Timer
                </Button>
              )}
            </div>
            <LogValueWarning unit={logType.unit} overWarn={overWarn} overLimit={overLimit} />
          </div>
        )}

        {logType.input === 'count' && (
          <div className="lf-field">
            <div className="lf-label">{logType.valueLabel}</div>
            <input
              className={`lf-input${overLimit ? ' lf-input--stop' : overWarn ? ' lf-input--warn' : ''}`}
              type="number"
              min="1"
              value={countInput}
              onChange={(e) => setCountInput(e.target.value)}
              placeholder="1"
            />
            <LogValueWarning unit={logType.unit} overWarn={overWarn} overLimit={overLimit} />
          </div>
        )}

        {/* What this type asks for instead of an amount — a moment's
            description, an event's name and kind, a video's title. */}
        {(logType.fields ?? []).map((f) => (
          <div className="lf-field" key={f.name}>
            <div className="lf-label">
              {f.label}
              {f.required && <span className="lf-req"> *</span>}
            </div>
            {f.type === 'textarea' ? (
              <textarea
                className="lf-input lf-textarea"
                rows={f.rows ?? 4}
                value={fields[f.name] ?? ''}
                onChange={(e) => setField(f.name, e.target.value)}
              />
            ) : f.type === 'select' ? (
              <CustomSelect
                options={[
                  { value: '', label: 'Not specified' },
                  ...EVENT_TYPES.map((t) => ({ value: t, label: t })),
                ]}
                value={fields[f.name] ?? ''}
                onChange={(v) => setField(f.name, v)}
              />
            ) : (
              <input
                className="lf-input"
                value={fields[f.name] ?? ''}
                onChange={(e) => setField(f.name, e.target.value)}
              />
            )}
          </div>
        ))}

        {/* "Did you finish the book?" is only a question where there is a book
            and the site cares — `show_include_book`. */}
        {!book.withoutTitle && (
          <div className="lf-field">
            <div className="lf-label">Did you finish the book?</div>
            <Toggle checked={finished} onChange={setFinished}>
              Finished
            </Toggle>
          </div>
        )}

        {/* `show_include_review` — a site with reviews off never asks. */}
        {!book.withoutTitle && cfg.bookReviews && (
          <div className="lf-field">
            <div className="lf-label">Would you like to include a review?</div>
            <CustomSelect
              options={REVIEW_OPTIONS}
              value={reviewChoice}
              onChange={setReviewChoice}
            />
          </div>
        )}

        {/* `#verify-log-value` — over the warning threshold you may still log,
            but you have to say the number is true first. */}
        {overWarn && (
          <label className="lf-attest">
            <input
              type="checkbox"
              checked={attested}
              onChange={(e) => setAttested(e.target.checked)}
            />
            <span>
              I promise that the amount of {logType.unit}s that I am logging is true and accurate.
            </span>
            <span className="lf-attest-emoji" aria-hidden>
              🤞
            </span>
          </label>
        )}

        {/* `md`, not `lg`: this button closes a form whose own controls are
            44px, and a 56px one next to them read as a different scale. The
            hero CTAs on the success step stay large — nothing sits beside
            them to be measured against. */}
        <Button
          variant="primary"
          size="md"
          disabled={!canLog}
          onClick={onSubmit}
          className="lf-logbtn"
        >
          Log Reading
        </Button>
      </div>
    </div>
  )
}

/**
 * `.counterfeit-block` — the line under the amount when a school site thinks the
 * number is too big. Two strengths: over the warning it asks, at the limit it
 * refuses. A public library never shows either.
 */
function LogValueWarning({ unit, overWarn, overLimit }) {
  if (!overWarn && !overLimit) return null
  return (
    <p className={`lf-warn${overLimit ? ' lf-warn--stop' : ''}`}>
      <Icon name={overLimit ? 'alert-circle' : 'bell-ringing'} size={15} />
      {overLimit
        ? `You cannot log that many ${unit}s.`
        : `This seems like a lot of ${unit}s. Are you sure?`}
    </p>
  )
}

// ─── Step 3: timer ───────────────────────────────────────────────────────────

function TimerStep({ seconds, running, onToggle, onReset, onDone }) {
  const R = 130
  const C = 2 * Math.PI * R
  // ring fills once per minute (purely decorative cadence)
  const frac = (seconds % 60) / 60
  const dash = C * frac
  const clock = fmtClock(seconds)
  const [hh, mm, ss] = clock.split(':')

  return (
    <div className="lf-timer">
      <div className="lf-ring-wrap">
        <svg viewBox="0 0 300 300" className="lf-ring">
          <circle cx="150" cy="150" r={R} className="lf-ring-track" />
          <circle
            cx="150"
            cy="150"
            r={R}
            className="lf-ring-fill"
            strokeDasharray={`${dash} ${C}`}
            transform="rotate(-90 150 150)"
          />
        </svg>
        <div className="lf-ring-time">
          <span className="lf-ring-hh">{hh}:</span>
          <span className="lf-ring-mm">{mm}:</span>
          <span className="lf-ring-mm">{ss}</span>
        </div>
      </div>

      <div className="lf-timer-controls">
        <button
          className="lf-circlebtn"
          onClick={onToggle}
          aria-label={running ? 'Pause' : 'Resume'}
        >
          <Icon name={running ? 'pause-filled' : 'play-filled'} size={22} />
        </button>
        <button className="lf-circlebtn" onClick={onReset} aria-label="Reset">
          <Icon name="refresh" size={20} stroke={2} />
        </button>
      </div>

      <Button variant="primary" size="lg" onClick={onDone}>
        I&apos;m Done Reading
      </Button>
    </div>
  )
}

// ─── Step 4: write a review ──────────────────────────────────────────────────

function ReviewStep({ review, setReview, onSave }) {
  return (
    <div className="lf-review">
      <h1 className="lf-h1 lf-h1--left">Write a Review</h1>

      <div className="lf-field">
        <div className="lf-label">Book Title</div>
        <input
          className="lf-input"
          value={review.title}
          onChange={(e) => setReview({ ...review, title: e.target.value })}
        />
      </div>
      <div className="lf-field">
        <div className="lf-label">Author</div>
        <input
          className="lf-input"
          value={review.author}
          onChange={(e) => setReview({ ...review, author: e.target.value })}
        />
      </div>
      <div className="lf-field">
        <div className="lf-label">Review</div>
        <textarea
          className="lf-input lf-textarea"
          rows={5}
          value={review.text}
          onChange={(e) => setReview({ ...review, text: e.target.value })}
        />
        <div className="lf-emojis">
          {EMOTICONS.map((e) => (
            <button
              key={e}
              className="lf-emoji"
              onClick={() => setReview((r) => ({ ...r, text: r.text + e }))}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="lf-review-actions">
        <Button variant="primary" size="md" onClick={onSave}>
          Save
        </Button>
        <Button variant="secondary" size="md">
          Add Emoticon
        </Button>
      </div>
    </div>
  )
}

// ─── Reader picker ────────────────────────────────────────────────────────────

function ReaderStep({ current, readers = [], onSelect }) {
  return (
    <div className="lf-readerpicker">
      <h1 className="lf-h1">Who are you logging for?</h1>
      <div className="lf-readerlist">
        {readers.map((r) => (
          <button
            key={r.id}
            className={`lf-readercard${r.id === current.id ? ' is-active' : ''}`}
            onClick={() => onSelect(r)}
          >
            <Avatar initials={r.initials} color={r.color} size="lg" />
            <span className="lf-readercard-name">{r.name}</span>
            <span className="lf-readercard-grade">{r.grade}</span>
            {r.id === current.id && (
              <Icon name="circle-check-filled" size={18} className="lf-readercard-check" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Success / badge earned ───────────────────────────────────────────────────

/**
 * `logged_books#completed` — the screen a finished log lands on, exported so it
 * can be shown on its own. Benny in one of three moods over his matching
 * background art, what was logged, the daily goal it moved, and a card per
 * thing it earned.
 *
 *   <LogSuccess
 *     result={{ logType: 'minute', minutes: 45, mood: 'party', unit: 'minute',
 *               logValue: 45, days: 1, dates: [], finished: true, earned: [] }}
 *     bookTitle="She Gets the Girl"
 *     dailyGoal={{ minutes: 45, goal: 20 }}
 *     onDone={close}
 *   />
 */
export function LogSuccess({
  result,
  bookTitle,
  dailyGoal,
  onDone,
  onAnother,
  onViewBadge,
  onReward,
  onTickets,
  onTalkToBenny,
  onOpenWord,
}) {
  const amount =
    result.logType === 'minute'
      ? fmtMinutes(result.minutes)
      : result.logType === 'day' || result.logType === 'moment' || result.logType === 'event'
        ? null
        : `${result.logValue} ${result.logValue === 1 ? result.unit : `${result.unit}s`}`
  /* `completed_goal_summary` — a school site with individual reading goals says
     what this log did to today's, which is the one number the reader came to
     move. Only minutes count toward it, and only logs dated today. */
  const goal =
    dailyGoal && result.logType === 'minute' && result.minutes > 0 && result.dates.length === 0
      ? {
          added: result.minutes,
          /* `DailyReading#total_minutes` — the day's running total, which the
             parent has already moved by the time this renders. Adding the log
             again here counted it twice. */
          total: dailyGoal.minutes ?? 0,
          target: dailyGoal.goal ?? 0,
        }
      : null
  return (
    <div className="lf-success">
      {/* `logged_books/completed` — the app celebrates with Benny in one of
          three moods, picked at random. Which mood you get is the only random
          thing here, and it's what stops the fiftieth log of the summer feeling
          like the first forty-nine. The confetti over the surface is the rest
          of the celebration; the app's own background scatter went with it
          rather than competing with it. */}
      <img src={MOODS[result.mood]} alt="" className="lf-benny-art" />
      <h1 className="lf-h1">{result.earnedBadge ? 'You earned a badge!' : 'You did it!'}</h1>
      <p className="lf-success-sub">
        {amount ? (
          <>
            You logged <strong>{amount}</strong>
            {result.book?.withoutTitle ? (
              '.'
            ) : (
              <>
                {' '}
                for <strong>{bookTitle}</strong>
              </>
            )}
            {result.finished ? ' and finished it.' : '.'}
          </>
        ) : (
          <>
            Logged{' '}
            <strong>
              {result.days} {result.days === 1 ? result.unit : `${result.unit}s`}
            </strong>
            .
          </>
        )}
        {/* The streak takes its own line: it's a different fact from what was
            just logged, and a long title pushed it into an awkward wrap. */}
        {/* The app's own line, and the one thing it asks of the reader on the
            way out — come back tomorrow. */}
        <span className="lf-success-streak">
          Your streak is now <strong>1 day</strong>. Come back and log tomorrow to keep it alive.
        </span>
      </p>

      {/* No figure block here: the sentence above already says how much was
          logged, and repeating it as a big number said nothing new. What is
          worth confirming is the review, which nothing else mentions. */}
      {result.review?.text && (
        <div className="lf-success-review">
          <Icon name="writing" size={15} /> Review saved
        </div>
      )}

      {/* `completed_earned_cards` — what this log actually won, laid out one
          card per thing: the badge, and whatever came with it. */}
      {result.earned?.length > 0 && (
        <div className="lf-earned">
          {result.earned.map((card) => (
            <EarnedCard
              key={card.id}
              card={card}
              onViewBadge={onViewBadge}
              onReward={onReward}
              onTickets={onTickets}
            />
          ))}
        </div>
      )}

      {/* `logged_books-goal` — the daily goal, moved. */}
      {goal && <GoalSummary {...goal} />}

      {/* Benny catches the reader here, while the book is still in mind. */}
      {onTalkToBenny ? (
        <>
          <div className="lf-benny">
            <BennyBubble variant="centered">
              <strong>Want to tell me about it?</strong> A quick chat about what you just read —
              I’ll hand you any Book Talk badge you earn along the way.
            </BennyBubble>
          </div>
          <Button variant="primary" size="lg" onClick={() => onTalkToBenny(result)}>
            Talk to Benny
          </Button>
          <button className="lf-benny-skip" onClick={onDone}>
            Not right now
          </button>
        </>
      ) : onOpenWord ? (
        <>
          {/* Same catch-them-here moment, spent on a word from the book. */}
          <div className="lf-benny">
            <BennyBubble variant="centered">
              <strong>I found a word in there.</strong> One word from {bookTitle}, a short round
              with me, and it’s yours to keep.
            </BennyBubble>
          </div>
          <Button variant="primary" size="lg" onClick={() => onOpenWord(result)}>
            Unlock My Word
          </Button>
          <button className="lf-benny-skip" onClick={onDone}>
            Not right now
          </button>
        </>
      ) : (
        /* `logged-books--actions` — logging one thing usually means logging
           another, so the app keeps that door open beside the way out. */
        <div className="lf-success-actions">
          {onAnother && (
            <Button variant="secondary" size="lg" onClick={onAnother}>
              Log Another Title
            </Button>
          )}
          <Button variant="primary" size="lg" onClick={onDone}>
            Finish
          </Button>
        </div>
      )}
    </div>
  )
}

/**
 * `logged_books/_completed_goal_summary` — what this log did to today's goal.
 *
 * The bar is the app's own shape and it is worth describing: a 32px pill, then
 * a small pinch, then the goal itself as its own 32px disc with a star in it.
 * The goal is a separate object from the track rather than a mark on it, so
 * reaching it is arriving somewhere rather than filling something up — and the
 * disc goes yellow when you do.
 */
function GoalSummary({ added, total, target }) {
  const pct = target > 0 ? Math.min(Math.floor((total / target) * 100), 100) : 0
  const met = total >= target
  return (
    <article className={`lf-goal${met ? ' is-met' : ''}`} aria-label="Daily reading goal progress">
      {/* The same anatomy as the earned cards beside it — a label naming what
          the card is, then the card's own business under a rule. It was the
          only one of the four leading with a sentence. */}
      <h3 className="lf-goal-label">Daily Goal</h3>
      <div className="lf-goal-progress">
        <p className="lf-goal-copy">
          You earned {added} {added === 1 ? 'minute' : 'minutes'} toward your daily goal
        </p>
        <p className="lf-goal-count">
          <span className="lf-goal-added">{total}</span> / {target}{' '}
          {target === 1 ? 'minute' : 'minutes'}
        </p>
        <div className="lf-goal-bar">
          <div className="lf-goal-track">
            <div className="lf-goal-fill" style={{ width: `${pct}%` }} />
          </div>
          {/* The pinch between the track and the goal — it is what makes the
              two read as one object rather than a bar and a loose dot. */}
          <span className="lf-goal-curve" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12V0C12 0 8.5 3 6 3C3.5 3 0 0 0 0V12C0 12 3.5 9 6 9C8.5 9 12 12 12 12Z" />
            </svg>
          </span>
          <div className="lf-goal-marker">
            <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.35646 1.71898C10.4277 -0.572995 13.5723 -0.572995 14.6435 1.71898L16.044 4.71538C16.4722 5.63172 17.3126 6.26573 18.2843 6.4055L21.4615 6.86253C23.8918 7.21213 24.8636 10.3176 23.0953 12.0837L20.7836 14.3926C20.0766 15.0987 19.7556 16.1246 19.9279 17.1273L20.4911 20.4061C20.9219 22.9142 18.3778 24.8335 16.2137 23.633L13.3846 22.0636C12.5194 21.5837 11.4806 21.5837 10.6154 22.0636L7.78626 23.633C5.6222 24.8335 3.07811 22.9142 3.50892 20.4061L4.07212 17.1273C4.24436 16.1246 3.92336 15.0987 3.2164 14.3926L0.904679 12.0837C-0.863584 10.3176 0.108172 7.21213 2.53848 6.86253L5.71571 6.4055C6.68736 6.26573 7.52776 5.63172 7.95603 4.71538L9.35646 1.71898Z" />
            </svg>
          </div>
        </div>
      </div>
    </article>
  )
}
