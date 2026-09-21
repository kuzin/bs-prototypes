import { Fragment } from 'react'
import { Img, Carousel, TextPill } from '@mobile/components'
import './ChallengeLog.css'

/**
 * `challenges/components/challengeLog/ChallengeLogScreen.tsx` — what you have actually read
 * inside this challenge, as opposed to what it wanted you to.
 *
 * Two halves. A carousel of totals across the top, and below it every logged title grouped by
 * month, newest first.
 *
 * The carousel is built FROM `log_types`, so a challenge that counts minutes shows a reading-time
 * card and one that counts books shows two cards instead of one. That is the same idea as the
 * detail screen's derived tabs, one level down: nothing here is configured, it follows from what
 * the challenge counts. `book` is the only type that contributes a pair, because completions and
 * distinct titles are different questions — reading one book four times is four completions and
 * one title.
 */

/** `getMinutesText` — `2h, 15m`, and a bare `45m` under an hour. Never `0h, 45m`. */
function minutesText(total = 0) {
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  return hours ? `${hours}h, ${minutes}m` : `${minutes}m`
}

/**
 * `typeObject` — the map from a log type to its card or cards, in the source's own order. A
 * challenge's `log_types` is walked in order and each one appends what it maps to, so the
 * carousel's order is the challenge's, not this file's.
 */
function overviewCards(meta = {}) {
  const {
    total_minutes: totalMinutes = 0,
    total_pages: totalPages = 0,
    total_titles: totalTitles = 0,
    total_completions: totalCompletions = 0,
    total_days: totalDays = 0,
    log_types: logTypes = [],
  } = meta

  const byType = {
    book: [
      {
        key: 'completions',
        value: totalCompletions,
        text: totalCompletions === 1 ? 'Total Completion' : 'Total Completions',
        icon: 'challengeLogCompletions',
        background: 'var(--m-green-light)',
      },
      {
        key: 'titles',
        value: totalTitles,
        text: totalTitles === 1 ? 'Title Completed' : 'Titles Completed',
        icon: 'challengeLogTitles',
        background: 'var(--m-denim-light)',
      },
    ],
    minute: [
      {
        key: 'minutes',
        value: minutesText(totalMinutes),
        text: 'Reading Time',
        icon: 'challengeReadingTime',
        background: 'var(--m-orange-light)',
      },
    ],
    page: [
      {
        key: 'pages',
        value: totalPages,
        text: totalPages === 1 ? 'Page Read' : 'Pages Read',
        icon: 'challengePagesRead',
        background: 'var(--m-orange-light)',
      },
    ],
    day: [
      {
        key: 'days',
        value: totalDays,
        text: totalDays === 1 ? 'Day Read' : 'Days Read',
        icon: 'challengeStatsDays',
        background: 'var(--m-denim-light)',
      },
    ],
  }

  return logTypes.flatMap((t) => byType[t] ?? [])
}

/** `OverviewCard` — a tinted panel, a 42pt glyph and two lines. */
function OverviewCard({ card }) {
  return (
    <div className="m-chlog-card" style={{ background: card.background }}>
      <Img name={card.icon} className="m-chlog-card-icon" />
      <div className="m-chlog-card-text">
        <span className="m-chlog-card-value">{card.value}</span>
        <span className="m-chlog-card-label">{card.text}</span>
      </div>
    </div>
  )
}

/**
 * `LogItem` — the cover, the title and author, and a completion pill.
 *
 * The cover's shadow is a separate box behind it rather than a `box-shadow`, inset 8 either side
 * and hanging 5 below at 7% black. A real shadow on a book cover spreads evenly and reads as the
 * cover floating; this one only shows at the bottom edge, which reads as the book SITTING on the
 * page. Worth the extra element.
 */
function LogItem({ item }) {
  return (
    <div className="m-chlog-item">
      <div className="m-chlog-book">
        <div className="m-chlog-cover" style={{ background: item.art }}>
          {!item.art && <span className="m-chlog-cover-text">{item.title}</span>}
        </div>
        <span className="m-chlog-shadow" aria-hidden="true" />
      </div>

      <div className="m-chlog-text">
        <span className="m-t-title-regular m-chlog-title">{item.title}</span>
        <span className="m-chlog-author">{item.author}</span>
        {item.isCompleted && (
          <span className="m-chlog-pill">
            <TextPill
              size="small"
              text={`Completed ${item.totalCompletions} Time${
                item.totalCompletions > 1 ? 's' : ''
              }`}
            />
          </span>
        )}
      </div>
    </div>
  )
}

export function ChallengeLog({ meta = {}, items = [] }) {
  const cards = overviewCards(meta)

  /* `orderBy(last_read_on, 'desc')` THEN `groupBy(month_year)` — the sort is what puts the
     months in order, not the grouping. `month_year` is the server's own formatted label, so the
     heading is never derived here and never disagrees with the row it heads. */
  const ordered = [...items].sort((a, b) => (a.lastReadOn < b.lastReadOn ? 1 : -1))
  const months = []
  for (const item of ordered) {
    const found = months.find((m) => m.month === item.monthYear)
    if (found) found.items.push(item)
    else months.push({ month: item.monthYear, items: [item] })
  }

  return (
    <div className="m-chlog">
      {cards.length > 0 && (
        <Carousel
          items={cards}
          keyFor={(c) => c.key}
          renderItem={(c) => <OverviewCard card={c} />}
          label="Challenge totals"
        />
      )}

      <div className="m-chlog-titles">
        {months.map((m, i) => (
          <Fragment key={m.month}>
            {/* `marginTop: index === 0 ? 0 : 32` — the first month sits flush under the
                carousel; every one after it is spaced off the run above. */}
            <div className={`m-chlog-month${i > 0 ? ' has-gap' : ''}`}>
              <h2 className="m-chlog-month-title">{m.month}</h2>
              {m.items.map((item) => (
                <LogItem key={item.id} item={item} />
              ))}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
