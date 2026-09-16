import { useState } from 'react'
import { Img, SheetHeader } from '@mobile/components'
import './BookListDashboard.css'

/**
 * `src/bookLists/components/BookListDashboard.tsx` — the pane behind a book list.
 *
 * DEVIATION: the app PUSHES this (`headerShown: false`, no `presentation`), so on device it
 * slides in from the right and is dismissed with a back arrow. Here it is presented as a SHEET
 * instead, matching the title panel — a design call, on the grounds that a list you opened from a
 * tab reads better as something you drop back out of than as a place you navigated to. The
 * affordance follows the presentation: a chevron DOWN rather than a back arrow.
 * `PhoneFrame`'s `overlayVariant="card"` still models the app's own push, if it is wanted back.
 *
 * The header is the third variant of the band idiom in this app, and the most elaborate: a 120pt
 * band tinted from the FIRST BOOK's cover (`getImageColor`), carrying TWO curve assets stacked at
 * its base — `headerCurves` rotated 180° and tinted 10% black, then `headerCurveWhite` over it —
 * so the band ends in a soft double wave rather than a straight edge.
 *
 * The banner is a three-cover fan: a 100×150 front cover with two 70×105 covers behind it, each
 * inset 30 and dropped 20. With fewer than three it degrades, and with none it falls back to the
 * `chooseRandomBeanstackColor` block and the Beanstack heart.
 *
 * Rows below use `BookListItem` at `origin="dashboard"` — the SMALL variant: a 56×84 cover, the
 * AUTHOR rather than a book count, and a right chevron the Book Lists origin never shows.
 */
export function BookListDashboard({ list, onClose, onOpenBook }) {
  const [expanded, setExpanded] = useState(false)
  const covers = list.books.filter((b) => b.cover).slice(0, 3)

  return (
    <div className="m-bld">
      <div className="m-bld-scroll">
        <div className="m-bld-head-wrap" style={{ '--m-bld-tint': list.headerColor }}>
          <SheetHeader onClose={onClose} background={list.headerColor} />

          <div className="m-bld-head">
            <div className="m-bld-band" aria-hidden="true">
              <Img name="headerCurves" className="m-bld-curve-dark" fit="fill" />
              <Img name="headerCurveWhite" className="m-bld-curve-white" fit="fill" />
            </div>

            <div className="m-bld-banner">
              {covers.length >= 2 && (
                <div className="m-bld-banner-back" aria-hidden="true">
                  <span className="m-bld-back-cover" style={{ background: covers[1].cover }} />
                  {covers[2] && (
                    <span className="m-bld-back-cover" style={{ background: covers[2].cover }} />
                  )}
                </div>
              )}
              {covers[0] ? (
                <span className="m-bld-front-cover" style={{ background: covers[0].cover }} />
              ) : (
                <span className="m-bld-front-cover" style={{ background: list.tint }}>
                  <Img name="beanstack_heart_white" width={24} />
                </span>
              )}
            </div>

            <h2 className="m-t-detail-page-title m-bld-title">{list.name}</h2>
            <div className="m-bld-tag-wrap">
              <span className="m-bld-tag">{list.bookCount} Books</span>
            </div>
          </div>

          {list.description && (
            <div className="m-bld-desc">
              <p className="m-bld-desc-title">Description</p>
              <p className={`m-bld-desc-text${expanded ? ' is-open' : ''}`}>{list.description}</p>
              {/* ShowMoreText clamps to 4 lines and toggles. */}
              <button type="button" className="m-bld-more" onClick={() => setExpanded((v) => !v)}>
                {expanded ? 'Show Less' : 'Show More'}
              </button>
            </div>
          )}
        </div>

        <div className="m-bld-books">
          {list.books.map((b) => (
            <button key={b.id} type="button" className="m-bld-row" onClick={() => onOpenBook?.(b)}>
              <span className="m-bld-item">
                <span className="m-bld-cover-wrap">
                  <span className="m-bld-cover-shadow" aria-hidden="true" />
                  <span className="m-bld-cover" style={{ background: b.cover ?? b.tint }}>
                    {!b.cover && <span className="m-bld-abbr">{b.abbreviation}</span>}
                  </span>
                </span>
                <span className="m-bld-info">
                  <span className="m-t-title-small m-bld-name">{b.title}</span>
                  <span className="m-bld-author">{b.author}</span>
                </span>
                <Img name="grey_right_arrow" size={24} className="m-bld-arrow" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
