import { useState } from 'react'
import { Img, PressableButton, SheetHeader } from '@mobile/components'
import './BookDetail.css'

/**
 * `src/bookDetail/components/BookDetail.tsx` — the title panel, reached by tapping a book on
 * Reading Log or All Titles (`goToSelectedBook` → `navigate('bookDetail')`). It is registered
 * `presentation: 'modal'`, so it arrives in the same sheet slot as the badge and achievement
 * panels.
 *
 * The header is the same punch-up idiom those two use, but built differently: a 130pt band tinted
 * from the COVER's own dominant colour (`getImageColor`), with `headerCurveGrey` stretched 44pt
 * across its base, and then `infoContainer` pulled up `marginTop: -122` so the 120×180 cover
 * straddles the curve.
 *
 * Tabs start as ['Overview', 'Reading Sessions'] and only become three when `getQuestionsForTab`
 * says the reading-integrity questions exist — so a two-tab panel is the normal case, not a
 * loading state.
 */
const BASE_TABS = ['Overview', 'Reading Sessions']

export function BookDetail({
  book,
  reviewsEnabled = true,
  showQuestions = false,
  onClose,
  onOptions,
}) {
  const tabs = showQuestions ? [...BASE_TABS, 'Questions'] : BASE_TABS
  const [tab, setTab] = useState('Overview')

  return (
    <div className="m-bd2">
      {/* The only sheet with a trailing action — the options dots go in SheetHeader's `right`
          slot. It floats over the band rather than sitting above it, so the class positions it. */}
      <SheetHeader onClose={onClose} className="m-bd2-header" onOptions={onOptions} />

      <div className="m-bd2-scroll">
        {/* The band takes the cover's dominant colour, not the tenant accent. */}
        <div className="m-bd2-band">
          <div className="m-bd2-band-fill" style={{ background: book.headerColor }} />
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
              {book.overview.map((o) => (
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
          {tab === 'Reading Sessions' && (
            <div className="m-bd2-sessions">
              {book.sessions.map((s) => (
                <div key={s.id} className="m-bd2-session">
                  <span className="m-t-item-title">{s.date}</span>
                  <span className="m-t-body-small m-bd2-session-meta">{s.detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
