import { Img, ProgressBar, Carousel } from '@mobile/components'
import { EventCard } from '../discover/Events'
import './Microsite.css'

/**
 * `microsite/MicrositeScreen.tsx` — the first Community tab, labelled `My ${clientServiceType}`.
 *
 * It is the SITE's page, not a social one, and that is the thing to get right about it: a logo,
 * the community's shared goal, what is coming up, and who paid for it. There is no activity feed
 * anywhere in this app — no "Jordan earned a badge, 10 minutes ago" — and a feed here would be
 * the most believable invention on the whole tab, which is exactly why it is worth naming.
 *
 * Every section below the name is conditional in the source: the goal, the events and the
 * sponsors each render only when the site has configured them, so a site that has set none shows
 * a logo and a title and nothing else.
 *
 * PLACEHOLDER — the logo is tenant-uploaded art served from a URL. The Beanstack mark stands in.
 */
function Goal({ goal }) {
  const {
    remaining_days: days,
    show_remaining_days: showDays,
    goal: target,
    goal_type: goalType,
    tally,
    percent_completed: percentage,
  } = goal

  return (
    <section className="m-ms-goal">
      <header className="m-ms-goal-head">
        <h2 className="m-ms-goal-heading">Our Goal</h2>
        {showDays && (
          <span className="m-ms-days">
            <Img name="clock" className="m-ms-clock" />
            <span className="m-ms-days-text">{days} days to go</span>
          </span>
        )}
      </header>

      {/* The tally is one line of mixed type: the count at 27/900 and everything after the slash
          at 20/700 in chevronGray, so the number you have reads louder than the one you need. */}
      <p className="m-ms-tally">
        {tally.toLocaleString()}
        <span className="m-ms-goal-rest">
          {' / '}
          {target.toLocaleString()} {goalType}s
        </span>
      </p>

      <div className="m-ms-bar-row">
        <div className="m-ms-bar">
          <ProgressBar progress={Number(percentage.replace('%', ''))} />
        </div>
        <span className="m-ms-percent">{percentage}</span>
      </div>
    </section>
  )
}

export function Microsite({ name, goal, events = [], sponsors, onOpenEvent }) {
  return (
    <div className="m-ms">
      <div className="m-ms-head">
        <Img name="beanstack_navigation_bar_logo" className="m-ms-logo" />
        <h1 className="m-ms-name">{name}</h1>
      </div>
      <span className="m-ms-rule" />

      {goal && <Goal goal={goal} />}

      {events.length > 0 && (
        <>
          <h2 className="m-ms-upcoming">Upcoming Events</h2>
          {/* A snap carousel at `windowWidth - 80`, so the next card's edge shows and the row
              reads as scrollable without a control saying so. `showAge` is off here — it is the
              Discover list that tells you the age range, because that list is FILTERED by it. */}
          <div className="m-ms-events">
            <Carousel
              items={events}
              keyFor={(e) => e.id}
              peek={40}
              label="Upcoming events"
              renderItem={(event) => (
                <EventCard event={event} showAge={false} onPress={onOpenEvent} />
              )}
            />
          </div>
        </>
      )}

      {sponsors && sponsors.sponsors.length > 0 && (
        <section className="m-ms-sponsors">
          <p className="m-ms-sponsor-head">{sponsors.sponsor_header}</p>
          <div className="m-ms-sponsor-row">
            <Carousel
              items={[...sponsors.sponsors].sort((a, b) => a.sponsor_position - b.sponsor_position)}
              keyFor={(s) => s.id}
              peek={50}
              label="Sponsors"
              renderItem={() => (
                <span className="m-ms-sponsor">
                  <Img name="logo_grey" className="m-ms-sponsor-img" />
                </span>
              )}
            />
          </div>
        </section>
      )}

      {/* `scrollViewContent` — 100 of clearance at the foot, for the tab bar and the FAB. */}
      <div className="m-ms-foot" />
    </div>
  )
}
