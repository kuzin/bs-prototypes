import { useState } from 'react'
import { Img, PressableButton, SheetHeader, EmptyStateView } from '@mobile/components'
import './BookDetail.css'

/**
 * `src/bookDetail/components/BookDetail.tsx` — the title panel, reached by tapping a book on
 * Reading Log or All Titles (`goToSelectedBook` → `navigate('bookDetail')`). It is registered
 * `presentation: 'modal'`, so it arrives in the same sheet slot as the badge and achievement
 * panels.
 *
 * The header is the same punch-up idiom those two use, but built differently: a 60pt header bar
 * and a 130pt band BOTH tinted from the COVER's own dominant colour (`getImageColor`), with
 * `headerCurveGrey` stretched 44pt across the band's base, and then `infoContainer` pulled up
 * `marginTop: -122` so the 120×180 cover straddles the curve.
 *
 * The header bar takes its 60pt in flow rather than floating over the band — `headerWrapper` has
 * a height and a background and no position. Floating it put the cover 8pt from the top of the
 * panel instead of 68, which read as the cover poking out of the band.
 *
 * Tabs start as ['Overview', 'Reading Sessions'] and only become three when `getQuestionsForTab`
 * says the reading-integrity questions exist — so a two-tab panel is the normal case, not a
 * loading state.
 */
const BASE_TABS = ['Overview', 'Reading Sessions']

/**
 * `getImageColor(cover_image_url)` — the band and the header bar take the COVER's own colour, not
 * the tenant accent, which is why a green book gets a green header and a red one a red.
 *
 * The app SAMPLES the jacket, so what it gets back is something like the image's average — which
 * is why it can tint the chevron and the dots `doveGray` and still have them read. Our covers are
 * two-stop gradients, so the equivalent is the midpoint of the two stops. Taking the first stop
 * instead picked the dark end of every jacket and put dark grey icons on a near-black band.
 *
 * Deriving it at all beats carrying a `headerColor` on the fixture: that field went stale the
 * moment a book arrived from somewhere with its own cover, and the panel showed a teal band over
 * a green book.
 */
function coverColor(cover) {
  const stops = [...(cover ?? '').matchAll(/#([0-9a-f]{6})/gi)].map((m) => m[1])
  if (stops.length === 0) return 'var(--m-grey-light-4)'
  if (stops.length === 1) return `#${stops[0]}`

  const channels = [0, 2, 4].map((i) =>
    Math.round(
      stops.reduce((sum, hex) => sum + parseInt(hex.slice(i, i + 2), 16), 0) / stops.length,
    ),
  )
  return `#${channels.map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

/**
 * DIVERGENCE — the header glyphs follow the band's lightness instead of always being `doveGray`.
 *
 * The app tints the chevron and the dots `doveGray` whatever the jacket is, which works while
 * `getImageColor` keeps returning something pale. It does not work on a dark jacket, and dark
 * jackets are common: Amari's band is a deep indigo and two dark-grey glyphs sat on it invisibly.
 *
 * sRGB relative luminance, the WCAG one, against the 0.5 midpoint — enough to pick a side, and
 * the only question being asked is which of two colours to use.
 */
function isDark(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!m) return false
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255)
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) < 0.5
}

/** `M/D/YYYY`, which is what `OverviewDataItems.getDate` builds by hand. */
function shortDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${m}/${d}/${y}`
}

/**
 * The Overview cards, derived the way `OverviewDataItems` derives them — including the two that
 * only exist sometimes and where each one inserts itself.
 *
 * The formats are the app's, oddities included: reading time is `3h, 20m` with the comma, while
 * minutes and pages per session are BARE NUMBERS under their labels rather than carrying a unit.
 */
function overviewCards(book) {
  const sessions = book.sessions?.length ?? 0

  const perSession = (total) => {
    if (!sessions) return '0 m'
    const time = total / sessions
    const h = Math.trunc(time / 60)
    const m = Math.trunc(time % 60)
    return h ? `${h} h ${m} m` : `${m}`
  }

  const cards = [
    {
      key: 'readingTime',
      source: 'challengeStatsMinutes',
      description: 'Reading Time',
      detail: `${book.totalHours}h, ${book.totalMinutes % 60}m`,
    },
    {
      key: 'timeRead',
      source: 'bookDetailMinutes',
      description: 'Minutes Per Session',
      detail: perSession(book.totalMinutes),
    },
    {
      key: 'pagesSession',
      source: 'challengeStatsPages',
      description: 'Pages Per Session',
      detail: sessions && book.totalPages > 0 ? `${Math.trunc(book.totalPages / sessions)}` : '0',
    },
  ]

  // `unshift` — a title you have read goes first.
  if (book.lastReadOn) {
    cards.unshift({
      key: 'lastReadOn',
      source: 'challengeStatsDays',
      description: 'Date Last Read',
      detail: shortDate(book.lastReadOn),
    })
  }
  // `splice(1, 0, …)` — completed lands SECOND, under the date you last read it.
  if (book.archivedOn) {
    cards.splice(1, 0, {
      key: 'dateCompleted',
      source: 'challengeStatsActivities',
      description: 'Date Completed',
      detail: shortDate(book.archivedOn),
    })
  }

  return cards
}

export function BookDetail({
  book,
  readerName,
  reviewsEnabled = true,
  showQuestions = false,
  onClose,
  onOptions,
}) {
  const tabs = showQuestions ? [...BASE_TABS, 'Questions'] : BASE_TABS
  const [tab, setTab] = useState('Overview')
  const headerColor = coverColor(book.cover)
  const glyphTint = isDark(headerColor) ? 'var(--m-white)' : 'var(--m-c-dove-gray)'

  return (
    <div className="m-bd2">
      {/* The only sheet with a trailing action — the options dots go in SheetHeader's `right`
          slot. Tinted like the band and sitting above it, so the two read as one field of colour
          with the cover hung off the bottom of it. */}
      <SheetHeader
        onClose={onClose}
        className="m-bd2-header"
        onOptions={onOptions}
        background={headerColor}
        tint={glyphTint}
      />

      <div className="m-bd2-scroll">
        {/* The band takes the cover's own colour — see `coverColor`. */}
        <div className="m-bd2-band">
          <div className="m-bd2-band-fill" style={{ background: headerColor }} />
          <Img name="headerCurveGrey" className="m-bd2-curve" fit="fill" />
        </div>

        <div className="m-bd2-info">
          <div className="m-bd2-cover-wrap">
            <span className="m-bd2-cover" style={{ background: book.cover }}>
              <span className="m-bd2-cover-title">{book.title}</span>
            </span>
            {/* The faked sibling shadow: a black block at 7%, inset 10 and hung 6 below. */}
            <span className="m-bd2-cover-shadow" aria-hidden="true">
              <span className="m-bd2-cover-shadow-fill" />
            </span>
          </div>

          <div>
            <h2 className="m-t-detail-page-title m-bd2-title">{book.title}</h2>
            {book.author && <p className="m-t-body-regular m-bd2-author">{book.author}</p>}
            {book.pageCount != null && (
              <p className="m-t-body-small m-bd2-pages">{book.pageCount} pages</p>
            )}
          </div>

          <div className="m-bd2-buttons">
            <PressableButton
              size="medium"
              type="primary"
              buttonText="Log Reading"
              className="m-bd2-log"
            />
            {reviewsEnabled && (
              <PressableButton
                size="medium"
                type="grey"
                buttonText="Add Review"
                className="m-bd2-review"
              />
            )}
          </div>

          {/* TopTabList with `center` — a rule underneath and a cloudWhite ground. */}
          <div className="m-bd2-tabs">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                className={`m-bd2-tab${tab === t ? ' is-active' : ''}`}
                onClick={() => setTab(t)}
                aria-pressed={tab === t}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="m-bd2-body">
          {tab === 'Overview' && (
            <div className="m-bd2-overview">
              {/* `OverviewReader` — the cards are this reader's, and on a shared device that
                  needs saying. The possessive is the app's own rule: a name ending in s takes
                  the apostrophe alone. */}
              {readerName && (
                <h3 className="m-t-title-small m-bd2-ov-head">
                  {readerName}
                  {readerName.endsWith('s') ? '’' : '’s'} Stats
                </h3>
              )}
              {overviewCards(book).map((o) => (
                <div key={o.key} className="m-bd2-ov-card">
                  <Img name={o.source} className="m-bd2-ov-img" />
                  <span className="m-bd2-ov-text">
                    <span className="m-t-title-heavy">{o.detail}</span>
                    <span className="m-t-body-small m-bd2-ov-desc">{o.description}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
          {tab === 'Reading Sessions' &&
            (book.sessions.length === 0 ? (
              /* `SessionsEmpty` — the challenges artwork, and copy that names the button above
                 rather than leaving the reader to find it. */
              <EmptyStateView
                source="my_challenges_empty_state"
                boldText="No Reading Sessions to Show"
                middleText="Record a reading session by tapping the Log Reading button above."
              />
            ) : (
              <div className="m-bd2-sessions">
                {book.sessions.map((s) => (
                  /* `SessionsItem` — three lines and a trailing arrow. The arrow is the app's:
                     a row opens `readingSession`, a screen this prototype doesn't carry, and the
                     arrow is what says there is one. */
                  <div key={s.id} className="m-bd2-session">
                    <span className="m-bd2-session-text">
                      <span className="m-t-body-regular m-bd2-session-date">{s.date}</span>
                      <span className="m-t-body-small m-bd2-session-time">{s.minutes} minutes</span>
                      {s.pages && (
                        <span className="m-t-body-small m-bd2-session-sub">pages {s.pages}</span>
                      )}
                    </span>
                    <Img name="new_arrow_right" className="m-bd2-session-arrow" />
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
