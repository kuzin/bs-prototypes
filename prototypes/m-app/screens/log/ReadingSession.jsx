import { useState } from 'react'
import { Header, Img, Alert } from '@mobile/components'
import './ReadingSession.css'

/**
 * `screens/ReadingSession.tsx` — one logged session, reached by tapping a row on the book panel's
 * Reading Sessions tab (`navigate('readingSession', { readingSessionId })`).
 *
 * A read-only list of what was entered and what follows from it, on `DetailListItem`: a 44pt row
 * with the label left and the value right. The rows are conditional in the app's own way — a
 * session logged with a page RANGE shows Start Page and End Page, one logged with a count shows
 * Pages Read, and Time / Page appears only when there are pages to divide by.
 *
 * `getReadingSessionScreenOptions` puts the title in the centre and an edit pencil on the right;
 * the trash lives on the edit screen, which is where the app hangs
 * `deleteReadingSessionConfirmation`.
 */

/** `moment(happenedOn).format('MMMM D, YYYY')`. */
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
export function longDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

/** `getDuration` — the hour is dropped when there isn't one, and minutes wrap at 60. */
export function duration({ hours = 0, minutes = 0 }) {
  return `${hours > 0 ? `${hours} h ` : ''}${minutes % 60} min`
}

/** Pages read: the range's span when there is one, otherwise what was entered. */
export function pagesRead(session) {
  if (session.startPage != null && session.endPage != null) {
    return session.endPage - session.startPage
  }
  return session.pages ?? null
}

/**
 * `getTimePerPage` — minutes ÷ pages, then written out in whatever units survive. Every zero part
 * is dropped, so a slow page reads "2 m 30 s" and a fast one just "45 s".
 */
export function timePerPage(minutes, pages) {
  if (!pages) return ''
  const total = (minutes / pages) * 60
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = Math.round(total % 60)
  return [h > 0 && `${h} h`, m > 0 && `${m} m`, s > 0 && `${s} s`].filter(Boolean).join(' ')
}

export function ReadingSession({ session, onBack, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  const pages = pagesRead(session)
  const perPage = timePerPage(session.minutes, pages)

  const rows = [
    { title: 'Date', detail: longDate(session.happenedOn) },
    { title: 'Duration', detail: duration(session) },
  ]
  if (session.startPage != null && session.endPage != null) {
    rows.push(
      { title: 'Start Page', detail: `${session.startPage}` },
      { title: 'End Page', detail: `${session.endPage}` },
    )
  } else if (pages != null) {
    rows.push({ title: 'Pages Read', detail: `${pages}` })
  }
  if (perPage) rows.push({ title: 'Time / Page', detail: perPage })

  return (
    <div className="m-rsn">
      <Header
        variant="stack"
        title="Reading Session"
        onBack={onBack}
        right={
          <button
            type="button"
            className="m-rsn-edit"
            aria-label="Edit reading session"
            onClick={() => onEdit?.(session)}
          >
            <Img name="edit_icon" className="m-rsn-edit-icon" />
          </button>
        }
      />

      <div className="m-rsn-scroll">
        {/* `renderSectionHeader` — a 15pt band of the form grey over a hairline, which is what
            separates the list from the header rather than a margin. */}
        <div className="m-rsn-band" />
        <div className="m-rsn-list">
          {rows.map((r) => (
            <div key={r.title} className="m-rsn-row">
              <span className="m-rsn-label">{r.title}</span>
              <span className="m-rsn-value">{r.detail}</span>
            </div>
          ))}
        </div>

        {/* DIVERGENCE — the app deletes from the EDIT screen's header. Ours offers it here too,
            because the edit screen is a form and a reader who opened a session to get rid of it
            should not have to go through one. Same alert, same copy. */}
        <button type="button" className="m-rsn-delete" onClick={() => setConfirming(true)}>
          Delete Reading Session
        </button>
      </div>

      <Alert
        open={confirming}
        title="Delete Reading Session"
        message="Are you sure you would like to delete this reading session?"
        buttons={[
          { text: 'Cancel', style: 'cancel', onPress: () => setConfirming(false) },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              setConfirming(false)
              onDelete?.(session)
            },
          },
        ]}
      />
    </div>
  )
}
