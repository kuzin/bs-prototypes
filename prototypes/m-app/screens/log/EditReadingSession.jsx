import { useState } from 'react'
import { Header, Img, Alert, PressableButton } from '@mobile/components'
import { pagesRead } from './ReadingSession'
import './EditReadingSession.css'

/**
 * `screens/EditReadingSession.tsx` — the pencil on the session screen.
 *
 * Its fields are built by `getSections` and the list is conditional in the same way the read-only
 * screen is: a session logged with a page RANGE gets Start Page and End Page, one logged with a
 * count gets Pages Read. Date and minutes are always there.
 *
 * These are `FormFieldItem` rows, not the floating-label boxes the book editor uses — a title
 * over an input on white, ruled full width. Two form shapes in one app is the app's own doing,
 * and the rule seems to be that a LIST of fields stacks and a short form boxes.
 *
 * The maxima are the microsite's (`logTypesMaxValues`), defaulting to 600 minutes and 1000 pages,
 * and they appear in the placeholder rather than as validation text. The app clamps a value that
 * exceeds them on change rather than complaining after the fact.
 */
const MAX_MINUTES = 600
const MAX_PAGES = 1000

export function EditReadingSession({ session, onBack, onSave, onDelete }) {
  const hasRange = session.startPage != null && session.endPage != null

  const [happenedOn, setHappenedOn] = useState(session.happenedOn)
  const [minutes, setMinutes] = useState(String(session.minutes ?? ''))
  const [startPage, setStartPage] = useState(hasRange ? String(session.startPage) : '')
  const [endPage, setEndPage] = useState(hasRange ? String(session.endPage) : '')
  const [pages, setPages] = useState(hasRange ? '' : String(pagesRead(session) ?? ''))
  const [confirming, setConfirming] = useState(false)

  /* `validate` — a date is required, and a page value has to be a number above zero. Minutes and
     pages are both optional, which is why their placeholders say so. */
  const numberOk = (v) => v === '' || (!Number.isNaN(Number(v)) && Number(v) > 0)
  const canSave =
    happenedOn !== '' &&
    numberOk(minutes) &&
    numberOk(startPage) &&
    numberOk(endPage) &&
    numberOk(pages)

  const clamp = (value, max) => {
    const n = Number(value)
    return !Number.isNaN(n) && n > max ? String(max) : value
  }

  const rows = [
    {
      key: 'happened_on',
      title: 'Date',
      input: (
        <input
          type="date"
          className="m-ers-input"
          value={happenedOn}
          onChange={(e) => setHappenedOn(e.target.value)}
        />
      ),
    },
    {
      key: 'minutes',
      title: 'How many minutes did you read?',
      input: (
        <input
          type="text"
          inputMode="numeric"
          className="m-ers-input"
          placeholder={`Optional (max ${MAX_MINUTES})`}
          value={minutes}
          onChange={(e) => setMinutes(clamp(e.target.value, MAX_MINUTES))}
        />
      ),
    },
  ]

  if (hasRange) {
    rows.push(
      {
        key: 'startPage',
        title: 'Start Page',
        input: (
          <input
            type="text"
            inputMode="numeric"
            className="m-ers-input"
            value={startPage}
            onChange={(e) => setStartPage(clamp(e.target.value, MAX_PAGES))}
          />
        ),
      },
      {
        key: 'endPage',
        title: 'End Page',
        input: (
          <input
            type="text"
            inputMode="numeric"
            className="m-ers-input"
            value={endPage}
            onChange={(e) => setEndPage(clamp(e.target.value, MAX_PAGES))}
          />
        ),
      },
    )
  } else {
    rows.push({
      key: 'pages',
      title: 'Pages Read',
      input: (
        <input
          type="text"
          inputMode="numeric"
          className="m-ers-input"
          placeholder={`Optional (max ${MAX_PAGES})`}
          value={pages}
          onChange={(e) => setPages(clamp(e.target.value, MAX_PAGES))}
        />
      ),
    })
  }

  function save() {
    onSave?.({
      ...session,
      happenedOn,
      minutes: Number(minutes) || 0,
      ...(hasRange
        ? { startPage: Number(startPage), endPage: Number(endPage) }
        : { pages: Number(pages) || 0 }),
    })
  }

  return (
    <div className="m-ers">
      <Header
        variant="stack"
        title="Edit Reading Session"
        onBack={onBack}
        right={
          <button
            type="button"
            className="m-ers-trash"
            aria-label="Delete reading session"
            onClick={() => setConfirming(true)}
          >
            <Img name="modal_delete_icon" className="m-ers-trash-icon" />
          </button>
        }
      />

      <div className="m-ers-scroll">
        <div className="m-ers-band" />
        <div className="m-ers-list">
          {rows.map((r) => (
            <label key={r.key} className="m-ers-row">
              <span className="m-ers-label">{r.title}</span>
              {r.input}
            </label>
          ))}
        </div>
      </div>

      {/* `buttonWrapper` — pinned to the bottom, and it rides the keyboard up on device. */}
      <div className="m-ers-foot">
        <PressableButton fullWidth buttonText="Save" disabled={!canSave} onButtonPress={save} />
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
