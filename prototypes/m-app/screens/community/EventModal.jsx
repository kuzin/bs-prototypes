import { SheetHeader } from '@mobile/components'
import './EventModal.css'

/**
 * `microsite/components/eventModal/EventModal.tsx` — what an event card opens, on both the
 * microsite tab and the Discover list.
 *
 * The sections come out in a FIXED order that is not the order of the data: title, Where, When,
 * Ages, Event URL, Description. The source builds it by walking `sectionOrder` and picking
 * matching keys out of the event, so a field the site left blank is absent rather than shown
 * empty — and the order never changes with the data.
 *
 * Only the title has no heading above it. `time` is headed "When", and an ongoing event shows the
 * word "Ongoing" in its place, the same swap the card makes.
 *
 * DIVERGENCE — the Event URL is not a live link. The app calls `Linking.openURL` and shows an
 * error under the link when the device cannot open it; sending someone out of the prototype to a
 * real site is not something to do behind a tap.
 */
const SECTIONS = [
  { key: 'branch', title: 'Where' },
  { key: 'time', title: 'When' },
  { key: 'ageRange', title: 'Ages' },
  { key: 'eventUrl', title: 'Event URL' },
  { key: 'description', title: 'Description' },
]

export function EventModal({ event, onClose }) {
  if (!event) return null

  const ongoing = event.date === 'This is an ongoing event.'
  const value = (key) => (key === 'time' ? (ongoing ? 'Ongoing' : event.time) : event[key])

  return (
    <div className="m-evm">
      <SheetHeader onClose={onClose} />
      <div className="m-evm-scroll">
        <h1 className="m-evm-title">{event.title}</h1>
        {SECTIONS.filter((s) => value(s.key)).map((s) => (
          <div key={s.key} className="m-evm-section">
            <p className="m-evm-heading">{s.title}</p>
            <p className={`m-evm-text${s.key === 'eventUrl' ? ' is-url' : ''}`}>{value(s.key)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
