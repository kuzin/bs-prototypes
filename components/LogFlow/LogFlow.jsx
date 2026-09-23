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
import { PARTNER_PRESETS } from '@components/PartnerConnect/partners'
import { Flyout, FlyoutMenu, FlyoutMenuItem } from '@components/Flyout/Flyout'
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

/* What finishing a title wins when the prototype doesn't say. The app builds
   these from the earnables the log actually triggered
   (`completed_earned_cards`); ours is a fixture, but the shape is the app's —
   and a prototype with its own challenges passes its own, so the success screen
   doesn't credit a challenge that site has never run. */
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
  /* "Read in Comics Plus" — where a tile's menu goes when the title lives in a
     partner the reader has linked. The flow can't open someone else's app, so
     the surface that owns the partner handles it. Left off, the menu's two
     choices both led here, to this flow's own form, which made the choice a
     lie: offered and unavailable is worse than not offered. */
  onReadInPartner,
  /* Saving the title Benny recommends on the way out of a finished log. The
     flow has no shelf of its own, so the surface that keeps one handles it;
     left off, the recommendation isn't offered at all. */
  onAddToWishlist,
  /* The catalog this flow searches and the shelves it offers. All demo data,
     so all of it comes in — a shared component doesn't get to know about any
     one prototype's fixtures. */
  partners = [],
  books = {},
  recentlyLogged = [],
  /* A title the surface already knows it is logging — pressed **Log** on a
     book rather than **Log Reading** in the bar. Given, the flow opens on that
     title's form instead of the search; left off, it opens where it always
     did. */
  book: bookProp,
  /* Opened on a title the reader has just finished elsewhere — the partner's
     reader hands them here to confirm it — so the form arrives with **Finished**
     already answered. They can still say otherwise. */
  startFinished = false,
  readingList,
  /* `reading_list_challenges#index` — the book-list challenges this reader is
     enrolled in. Given any, the search screen offers them. */
  readingListChallenges = [],
  /* Benny's own recommendations, as a shelf like the rest. Additive and
     defaulted: a prototype that doesn't hand them any renders exactly as it
     did. */
  bennyPicks = [],
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
  /* `completed_summary_earnables` — what finishing a title wins on this site.
     Left off, the flow's own fixture stands in. */
  earnedCards = EARNED_CARDS,
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

  // search | lists | details | timer | review | success | reader
  const [step, setStep] = useState(firstStep)
  const [returnStep, setReturnStep] = useState('search')
  const [logType, setLogType] = useState(siteType)
  // The extra questions a type asks instead of an amount — a moment's
  // description, an event's name and kind, a video's title.
  const [fields, setFields] = useState({})
  const [reader, setReader] = useState(readerProp ?? DEMO_READER)
  const [query, setQuery] = useState('')
  const [scanOpen, setScanOpen] = useState(false)
  // The list page's contents — a challenge's titles, or a partner's shelf.
  const [listView, setListView] = useState(null)
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
    // Opened on a title the surface already picked, the search has nothing left
    // to ask — the flow starts on that title's own form.
    setStep(bookProp ? 'details' : firstStep)
    setLogType(bookProp ? typeForBook(bookProp) : siteType)
    setFields({})
    setReader(readerProp ?? DEMO_READER)
    setQuery('')
    setScanOpen(false)
    setEpicOpen(false)
    // A title-less type opens straight on its form, so it needs its stand-in
    // book in place before the step renders.
    setBook(bookProp ?? (siteType.withoutTitle ? untitledFor(siteType) : null))
    setMinutesInput('')
    setCountInput('')
    setDates([])
    setDateOpen(false)
    setFinished(Boolean(startFinished))
    setReviewChoice('no')
    setAttested(false)
    setReview({ title: '', author: '', text: '' })
    setTimerSeconds(0)
    setTimerRunning(false)
    setResult(null)
    // Only on open (and on the title it was opened with). `types` is rebuilt
    // every render, so listing it here would reset the flow under the reader's
    // hands.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, bookProp, startFinished])

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

  /* Reading it in the partner's app leaves this flow entirely, so the flow
     closes behind it. Without a host to hand it to, the menu doesn't offer
     the choice at all. */
  const readInPartner = onReadInPartner
    ? (b) => {
        onClose?.()
        onReadInPartner(b)
      }
    : undefined

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

  /* `available_profiles_count > 1` — the app offers "Select a different
     reader" only where there *is* one. A library account holds several
     profiles; a school student is one profile with nothing above them, so the
     link is hidden rather than opening an empty picker. */
  const canSwitchReader = readers.length > 0

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
      earned: finished ? earnedCards : [],
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
              bennyPicks={bennyPicks}
              cfg={cfg}
              onEpic={() => setEpicOpen(true)}
              onOpenList={(list) => {
                setListView(list)
                setStep('lists')
              }}
              query={query}
              setQuery={setQuery}
              scanOpen={scanOpen}
              setScanOpen={setScanOpen}
              onPick={pickBook}
              onRead={readInPartner}
              onManual={startManual}
              onWithoutTitle={startWithoutTitle}
              onChangeReader={canSwitchReader ? openReaderPicker : undefined}
            />
          )}

          {step === 'lists' && (
            <TitleListStep
              list={listView}
              connections={connections}
              books={books}
              /* Logging from a list is `source=reading_list_challenge`: the
                 title is already chosen, so it goes straight to the form. */
              onLog={(b) => logBook(b)}
              onRead={readInPartner}
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
              onChangeReader={canSwitchReader ? openReaderPicker : undefined}
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
              /* Only a finished book has a "what next" — a log that left the
                 reader mid-book already has its answer. */
              nextUp={
                result?.finished && books[result.book?.id]?.nextUp
                  ? {
                      book: books[books[result.book.id].nextUp.id],
                      reason: books[result.book.id].nextUp.reason,
                    }
                  : null
              }
              onAddToWishlist={onAddToWishlist}
              onTalkToBenny={onTalkToBenny}
              /* A word waiting is one more screen, not a second offer crammed
                 onto this one — the success screen ends in Next. */
              onNext={onOpenWord ? () => setStep('word') : undefined}
            />
          )}

          {/* The word the log turned up, offered on its own. Benny says what he
              found; the button hands it over. */}
          {step === 'word' && (
            <div className="lf-step lf-success">
              <div className="lf-benny">
                <BennyBubble variant="hero">
                  <strong>I found a word in there.</strong> One word from {bookTitle} — it’s yours
                  to keep.
                </BennyBubble>
              </div>
              <Button variant="primary" size="lg" onClick={() => onOpenWord(result)}>
                Unlock My Word
              </Button>
              <button className="lf-benny-skip" onClick={onClose}>
                Not right now
              </button>
            </div>
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
 * `reading_list_challenges` — the book-list challenges this reader is in, and
 * their titles, on one screen.
 *
 * The app makes this two: a grid of challenges, then one challenge's titles.
 * A reader is rarely in more than two or three, and the second screen asked
 * them to choose a challenge before they could look for the book they had
 * already picked up — so the challenges are sections here and every title is
 * one click away.
 *
 * Each section says what its challenge asks for, since that is the thing you
 * can't tell from the covers: every title, a count, or a count that has to
 * include particular ones (`all_program_books_required?`,
 * `minimum_required_program_books`, `specific_program_books_required?`). Where
 * it names specific ones the grid splits — those first, the rest under "More
 * Titles".
 */
/**
 * A page of titles — `reading_list_challenges#show`, and the same page for a
 * partner's own shelf. Both are a name, a line under it, and one or more runs
 * of covers, so both are this: a challenge's page used to be its own component
 * and a partner's shelf had nowhere to go at all.
 *
 * `list` is `{ title, sub, sections: [{ title, count, rows }] }`; the two
 * builders below turn a challenge or a partner shelf into one.
 */
function TitleListStep({ list, books, connections, onLog, onRead }) {
  if (!list) return null

  return (
    <div className="lf-rlc">
      <header className="lf-rlc-head">
        <h1 className="lf-rlc-name">{list.title}</h1>
        {list.sub && <p className="lf-rlc-dates">{list.sub}</p>}
      </header>

      {list.sections.map((sec) => (
        <section className="lf-rlc-section" key={sec.title}>
          <div className="lf-rlc-sechead">
            <h2 className="lf-rlc-sectitle">{sec.title}</h2>
            {sec.count && <span className="lf-rlc-seccount">{sec.count}</span>}
          </div>
          <BookGrid
            rows={sec.rows}
            books={books}
            connections={connections}
            onLog={onLog}
            onRead={onRead}
          />
        </section>
      ))}
    </div>
  )
}

/* A reading-list challenge: what it requires first, anything else after. */
function challengeList(c) {
  const req = c.required ?? {}
  const split = req.kind === 'specific'
  const rest = split ? c.books.filter((b) => !b.required) : []
  const read = c.books.filter((b) => b.done).length

  return {
    title: c.title,
    sub: c.dates ?? 'Ongoing Challenge',
    sections: [
      {
        title: split ? 'Required Titles' : 'Titles',
        count: `${read} of ${req.count ?? c.books.length} read`,
        rows: split ? c.books.filter((b) => b.required) : c.books,
      },
      ...(rest.length > 0
        ? [{ title: 'More Titles', count: 'These count toward the total too', rows: rest }]
        : []),
    ],
  }
}

/* A partner's own shelf — the titles it put in front of this reader. */
function partnerList(rl) {
  const rows = rl.titles.map((id) => ({ id, done: rl.completed.includes(id) }))
  return {
    title: rl.title,
    sub: `From your ${PARTNER_NAMES[rl.partner] ?? 'linked'} account`,
    sections: [
      {
        title: `All ${rl.unit ?? 'titles'}`,
        count: `${rows.filter((r) => r.done).length} of ${rows.length} read`,
        rows,
      },
    ],
  }
}

/* "Read in Comics Plus" — the partner names itself in its own menu item. */
const PARTNER_NAMES = Object.fromEntries(Object.values(PARTNER_PRESETS).map((p) => [p.id, p.name]))

/**
 * One book, wherever a book appears — a shelf on the search screen, a challenge
 * grid, the recently-logged row.
 *
 * A finished title says so in the same place every time: a green tick on the
 * bottom-right corner, and the cover itself steps back.
 *
 * Pressing one opens the same menu everywhere, offering the same choice: **read
 * it in the partner's app**, where the title lives in one you've linked, or
 * **log it here**. That choice used to be per-fixture flags (`readNow`,
 * `goNow`) on a challenge's rows only, so the same Scholastic issue offered to
 * be read on one screen and only logged on another.
 */
function CoverTile({
  book,
  size = 'fill',
  done = false,
  connections = {},
  onLog,
  onRead,
  className = '',
}) {
  // Readable in the app only once that account is linked — otherwise the only
  // thing this title can do here is be logged.
  const partner = book.partner && connections[book.partner] ? book.partner : null

  return (
    /* Beside the cover, not under it: a shelf is a row of these, and a panel
       below the one you pressed covers the titles next to it. It flips to the
       other side on its own where there's no room. */
    <Flyout
      placement="right"
      arrow
      trigger={({ toggle }) => (
        <button
          type="button"
          className={`lf-tile ${className}`.trim()}
          onClick={toggle}
          aria-label={book.title}
        >
          <BookCover book={book} size={size} />
          {/* A title a linked app can open says so on the jacket, the way the
              shelves in Book Discovery do — the menu behind the cover is the
              only other place it is said, and you have to press it to find
              out. One mark, not the app's logo: the reader is being told the
              title opens, and *which* app opens it is what the menu is for.
              Gated on `onRead` for the same reason the menu item is: without
              somewhere to go it would be a promise the tile can't keep. */}
          {partner && onRead && <span className="lf-tile-now" title="Read it now" />}
          {/* `.completed-checkmarker-wrapper` */}
          {done && (
            <span className="lf-tile-mark lf-tile-mark--done">
              <Icon name="check" size={15} stroke={3} />
            </span>
          )}
        </button>
      )}
    >
      {({ close }) => (
        <>
          {/* Which title this is — a shelf is a dozen covers, and a menu that
              opens over one of them still has to say which. */}
          <div className="lf-tile-menuhead">
            <span className="lf-tile-menutitle">{book.title}</span>
            {book.author && <span className="lf-tile-menuauthor">{book.author}</span>}
          </div>
          <FlyoutMenu>
            {/* Only where there is somewhere to go: the host has to own the
                partner's app, so without a handler the choice isn't offered. */}
            {partner && onRead && (
              <FlyoutMenuItem
                onClick={() => {
                  close()
                  onRead?.(book)
                }}
              >
                Read in {PARTNER_NAMES[partner] ?? 'the app'}
              </FlyoutMenuItem>
            )}
            <FlyoutMenuItem
              onClick={() => {
                close()
                onLog?.(book)
              }}
            >
              Log Reading
            </FlyoutMenuItem>
          </FlyoutMenu>
        </>
      )}
    </Flyout>
  )
}

/** `.book-list-grid` — the covers, each with its own menu. */
function BookGrid({ rows, books, connections, onLog, onRead }) {
  return (
    <ul className="lf-rld-grid">
      {rows.map((row) => {
        const book = books[row.id]
        if (!book) return null
        return (
          <li key={row.id} className="lf-rld-item">
            <CoverTile
              book={book}
              done={row.done}
              connections={connections}
              onLog={onLog}
              onRead={onRead}
            />
          </li>
        )
      })}
    </ul>
  )
}

// ─── Step 1: search ──────────────────────────────────────────────────────────

/* How many shelves the title step opens with. Two is the most that fits above
   the fold beside the search box on a 640px panel — past that the reader is
   scrolling through offers to reach the field that answers faster. */
const SHELVES_SHOWN = 2

function SearchStep({
  reader,
  connections,
  partners,
  books,
  recentlyLogged,
  readingList,
  readingListChallenges,
  bennyPicks = [],
  cfg,
  onEpic,
  onOpenList,
  query,
  setQuery,
  scanOpen,
  setScanOpen,
  onPick,
  onRead,
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

  /* Two shelves, then the rest on request. `shelfCount` is what the reader
     actually has, not what the component can draw — a partner list only counts
     once that account is connected, and a challenge whose titles this catalog
     doesn't carry draws nothing. */
  const [shelvesOpen, setShelvesOpen] = useState(false)
  const shelfCount =
    (bennyPicks.some((id) => books[id]) ? 1 : 0) +
    (readingList && (!readingList.partner || connections[readingList.partner]) ? 1 : 0) +
    readingListChallenges.filter((rlc) => rlc.books.some((b) => books[b.id])).length +
    1 // Recently Logged Titles, which is always there

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

          {/* `.logged-books--logging-selection-section` — the app puts the
              search and the other ways in on one grey panel, not loose on the
              page. */}
          <section className="lf-sect">
            <div className="lf-searchrow">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Search for title or author"
              />
            </div>

            {/* `.logged-books--logging-actions` — each an icon over its name,
                in thirds. Each is a site setting: `display_scan_by_isbn?`,
                manual entry always, `epic_integration?`. */}
            <div className="lf-actions">
              {cfg.scanIsbn && (
                <button type="button" className="lf-action" onClick={() => setScanOpen(true)}>
                  <Icon name="barcode" size={40} stroke={1.6} />
                  <span>Scan ISBN</span>
                </button>
              )}
              <button type="button" className="lf-action" onClick={onManual}>
                <Icon name="pencil" size={40} stroke={1.6} />
                <span>Manually Enter Title</span>
              </button>
              {/* Not another way to find a title but another way to log: Epic
                  hands over what the reader has already read there. */}
              {cfg.epic && (
                <button type="button" className="lf-action" onClick={onEpic}>
                  <img src="/bs-prototypes/epic/Mark.png" alt="" className="lf-action-mark" />
                  <span>Import from Epic</span>
                </button>
              )}
            </div>
          </section>
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
              {/* Every shelf here makes the same offer — some titles, pick one —
                  so a reader with a partner list, two challenges and a recents
                  row scrolls past four of them to reach the search box that
                  answers the question faster. Two, and the rest behind a press.
                  Collapsed by CSS rather than by slicing the list: the shelves
                  are three different shapes (one optional, one a map, one
                  always there) and counting them in JSX made each of them
                  harder to read than the thing it draws. */}
              <div className={`lf-shelves${shelvesOpen ? ' is-open' : ''}`}>
                {/* Benny's picks — the one shelf that isn't a list someone made,
                    so it leads: the reader came to log a book, and this is the
                    app's best guess at which one. */}
                {bennyPicks.filter((id) => books[id]).length > 0 && (
                  <section className="lf-panel lf-rlband">
                    <div className="lf-rlhead">
                      <span className="lf-rlmark" style={{ '--rl-tint': '#0D9488' }}>
                        <Icon name="sparkles" size={13} stroke={2.4} />
                      </span>
                      <h2 className="lf-panel-title lf-rlhead-title">Benny’s Picks</h2>
                    </div>

                    <div className="lf-coverrow lf-coverrow--rl">
                      {bennyPicks
                        .filter((id) => books[id])
                        .slice(0, 5)
                        .map((id) => (
                          <CoverTile
                            key={id}
                            book={books[id]}
                            size="md"
                            connections={connections}
                            onLog={onPick}
                            onRead={onRead}
                          />
                        ))}
                    </div>
                  </section>
                )}

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
                        .slice(0, 4)
                        .map((id) => (
                          <CoverTile
                            key={id}
                            book={books[id]}
                            size="md"
                            done={readingList.completed.includes(id)}
                            connections={connections}
                            onLog={onPick}
                            onRead={onRead}
                          />
                        ))}

                      <button
                        className="lf-morecard"
                        onClick={() => onOpenList(partnerList(readingList))}
                      >
                        <span className="lf-morecard-label">
                          <span>View</span>
                          <span>More</span>
                        </span>
                      </button>
                    </div>
                  </section>
                )}

                {/* `reading_list_challenges` — one shelf per challenge the reader
                  is enrolled in, the same anatomy as a partner's: what it's
                  called, a few of its titles with the ones they've read ticked
                  off, and the way into the whole list. A single "Reading List
                  Challenges" button stood here before, which made the reader
                  open a screen to find out whether there was anything on it. */}
                {readingListChallenges.map((rlc) => {
                  const shelf = rlc.books.filter((b) => books[b.id])
                  if (shelf.length === 0) return null
                  /* Four titles and the way into the rest, which is the fifth
                   card on the shelf rather than a link under it — a shelf that
                   ends in a card reads as continuing, where a link under it
                   read as a footnote. Five is what fits a 640px panel. */
                  const shown = shelf.slice(0, 4)
                  return (
                    <section key={rlc.id} className="lf-panel lf-rlband">
                      <div className="lf-rlhead">
                        <span className="lf-rlmark" style={{ '--rl-tint': rlc.tint }}>
                          <Icon name="book" size={13} stroke={2.4} />
                        </span>
                        <h2 className="lf-panel-title lf-rlhead-title">{rlc.title}</h2>
                        {rlc.dates && <span className="lf-rldates">{rlc.dates}</span>}
                      </div>

                      <div className="lf-coverrow lf-coverrow--rl">
                        {shown.map((b) => (
                          <CoverTile
                            key={b.id}
                            book={books[b.id]}
                            size="md"
                            done={b.done}
                            connections={connections}
                            onLog={onPick}
                            onRead={onRead}
                          />
                        ))}

                        <button
                          className="lf-morecard"
                          onClick={() => onOpenList(challengeList(rlc))}
                        >
                          <span className="lf-morecard-label">
                            <span>View</span>
                            <span>More</span>
                          </span>
                        </button>
                      </div>
                    </section>
                  )
                })}

                {/* `.logged-books--recently-read-books` — what they logged lately,
                  a shelf of its own now that the reading lists have theirs, and
                  named like them so three shelves read as three shelves. */}
                <section className="lf-sect lf-recentsect">
                  <div className="lf-rlhead">
                    <h2 className="lf-panel-title lf-rlhead-title">Recently Logged Titles</h2>
                  </div>
                  <div className="lf-recent">
                    {recentlyLogged
                      .filter((id) => books[id])
                      .slice(0, 5)
                      .map((id) => (
                        <CoverTile
                          key={id}
                          book={books[id]}
                          size="md"
                          connections={connections}
                          onLog={onPick}
                          onRead={onRead}
                        />
                      ))}
                  </div>
                </section>
              </div>

              {/* A disc with a chevron in it rather than a line of text: it
                  opens *and* closes, and the arrow turning over is what says
                  which way the next press goes. */}
              {shelfCount > SHELVES_SHOWN && (
                <div className="lf-moreshelves">
                  <button
                    type="button"
                    className={`lf-moreshelves-btn${shelvesOpen ? ' is-open' : ''}`}
                    onClick={() => setShelvesOpen((v) => !v)}
                    aria-expanded={shelvesOpen}
                    aria-label={shelvesOpen ? 'Show fewer shelves' : 'View more to see the rest'}
                  >
                    <Icon name="chevron-down" size={20} stroke={2.4} />
                  </button>
                </div>
              )}

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
            /* The card is picked out in the reader's own colour, the same one
               their avatar wears — which is what tells four of these apart. */
            style={{ '--reader': r.color }}
            onClick={() => onSelect(r)}
          >
            <Avatar initials={r.initials} color={r.color} size="lg" />
            <span className="lf-readercard-name">{r.name}</span>
            {r.id === current.id && (
              <Icon name="check" size={14} stroke={3} className="lf-readercard-check" />
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
  /* `{ book, reason }` — what to read next and why, in Benny's words. Shown
     only for a finished title. */
  nextUp,
  onAddToWishlist,
  onDone,
  onAnother,
  onViewBadge,
  onReward,
  onTickets,
  onTalkToBenny,
  onNext,
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

      {/* Finishing a book is the one moment the reader is certainly between
          books, so it's the one moment a recommendation helps rather than
          interrupts. Benny makes it himself, the way he says everything else. */}
      {nextUp?.book && onAddToWishlist && (
        <NextUp
          book={nextUp.book}
          reason={nextUp.reason}
          onAdd={() => onAddToWishlist(nextUp.book)}
        />
      )}

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
      ) : (
        /* `logged-books--actions` — logging one thing usually means logging
           another, so the app keeps that door open beside the way out. A site
           with a word waiting has one more screen to go, so the way out reads
           **Next** instead of Finish. */
        <div className="lf-success-actions">
          {onAnother && (
            <Button variant="secondary" size="lg" onClick={onAnother}>
              Log Another Title
            </Button>
          )}
          <Button variant="primary" size="lg" onClick={onNext ?? onDone}>
            {onNext ? 'Next' : 'Finish'}
          </Button>
        </div>
      )}
    </div>
  )
}

/**
 * What to read next, after a finished log. Benny's own bubble rather than a
 * headed card, because it is him talking — and the one thing it asks for is a
 * yes: the title goes on the reader's Wish List and the screen carries on to
 * wherever it was going.
 */
function NextUp({ book, reason, onAdd }) {
  const [added, setAdded] = useState(false)

  return (
    <section className="lf-nextup">
      {/* The excited face, not the neutral one: which portrait he is wearing is
          part of what he is saying. */}
      <BennyBubble avatar="/bs-prototypes/benny-excited.svg">
        <strong>You finished it! Here’s what I’d read next.</strong> {reason}
      </BennyBubble>

      <div className="lf-nextup-book">
        <BookCover book={book} size="sm" />
        <div className="lf-nextup-meta">
          <span className="lf-nextup-title">{book.title}</span>
          {book.author && <span className="lf-nextup-author">{book.author}</span>}
        </div>
        <Button
          variant="secondary"
          size="sm"
          disabled={added}
          onClick={() => {
            setAdded(true)
            onAdd?.()
          }}
        >
          {added ? 'On your Wish List' : 'Add to Wish List'}
        </Button>
      </div>
    </section>
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
