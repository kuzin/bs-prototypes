import { Img, EmptyStateView } from '@mobile/components'
import './Events.css'

/**
 * `src/components/Events.jsx` → `MicrositeEventCard` — the Events tab.
 *
 * The list is **filtered by the reader's age** before anything renders:
 * `inRange(age, e.mobile_age_range[0], e.mobile_age_range[1] + 1)`. An event outside the range is
 * not dimmed or labelled, it is simply absent — which is why the empty copy says "for your age
 * range" rather than "no events".
 *
 * The date chip is absolutely positioned and STRADDLES the card: the card carries `marginTop: 35`
 * and the chip sits at `top: 15`, so it hangs over the card's top-left corner rather than sitting
 * inside it. An ongoing event swaps the date for a refresh glyph.
 *
 * Note what the blue line under the title actually is: `dateOrOngoing` shows the event's TIME, and
 * only falls back to the word "Ongoing" when the date string is the literal
 * "This is an ongoing event.".
 */
function EventDateChip({ date, ongoing }) {
  if (ongoing) {
    return (
      <span className="m-ev-chip is-ongoing">
        <Img name="refreshIcon" className="m-ev-chip-refresh" />
      </span>
    )
  }
  const [month, day] = date.split(' ')
  return (
    <span className="m-ev-chip">
      <span className="m-ev-chip-month">{month.toUpperCase()}</span>
      <span className="m-ev-chip-day">{day}</span>
    </span>
  )
}

function EventCard({ event, showAge = true }) {
  const ongoing = event.date === 'This is an ongoing event.'
  return (
    /* The Pressable and the panel are two elements, not one: the chip is absolute against the
       PRESSABLE, and the panel's 35pt top margin sits between them — which is what makes the chip
       hang 20pt above the panel's top edge instead of sitting inside it. */
    <button type="button" className="m-ev-card">
      <EventDateChip date={event.date} ongoing={ongoing} />
      <span className="m-ev-panel">
        <span className="m-t-title-regular m-ev-title">{event.title}</span>
        {event.branch && <span className="m-t-description m-ev-branch">{event.branch}</span>}
        {showAge && <span className="m-ev-ages">This event is for ages {event.ageRange}</span>}
        <span className="m-ev-when">{ongoing ? 'Ongoing' : event.time}</span>
        <span className="m-ev-desc">{event.description}</span>
      </span>
    </button>
  )
}

export function Events({ events }) {
  if (events.length === 0) {
    return (
      /* The badges artwork again, as on Reviews. */
      <EmptyStateView
        source="my_badges_empty_state"
        boldText="No Events to Show"
        middleText="Events for your age range have not been added yet."
      />
    )
  }

  return (
    <div className="m-ev">
      {events.map((e) => (
        <EventCard key={e.id} event={e} />
      ))}
      {/* ListFooterComponent — a bare 50pt spacer. */}
      <div className="m-ev-foot" />
    </div>
  )
}
