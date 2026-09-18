import { Img, ProgressBar, Carousel, Card } from '@mobile/components'
import { EventCard } from '../discover/Events'
import { SPONSOR_MARKS } from './sponsors'
import './Microsite.css'

/**
 * `microsite/MicrositeScreen.tsx` — the first Community tab, labelled `My ${clientServiceType}`.
 *
 * It is the SITE's page, not a social one: a logo, the programme banner, the community's shared
 * goal, what is coming up, and who paid for it. There is no activity feed anywhere in this app,
 * and a feed here would be the most believable invention on the whole tab. Every section below
 * the name is conditional in the source — a site that has configured none shows a logo and a
 * title and nothing else.
 *
 * DIVERGENCE — laid out like Home, on a design call. The app renders this as one white scroll
 * with a hairline under the title and nothing else separating the sections, so the goal, the
 * events and the sponsors run together as a single column of unrelated things. Home already
 * solved that for a screen with the same problem: a grey ground, each section in its own card,
 * and the PAGE owning the 16pt rhythm rather than each card carrying its own margin. Everything
 * inside the cards is still the app's.
 *
 * The sponsors are also a vertical stack rather than a carousel. A carousel hides most of a set
 * behind a gesture, which is the wrong trade for the people funding the programme — there are
 * four of them and they fit. Each gets its own card, centred, because a sponsor is a separate
 * claim and a ruled list of four reads as one.
 *
 * Every section labels itself the SAME way: the title outside its card, on the gutter, with
 * anything qualifying it on the right of that line. The app puts "Our Goal" inside the goal
 * block and "Upcoming Events" outside the events, which is invisible on a white page and obvious
 * on a grey one — a label inside a card belongs to the card, and a label above it names the
 * section.
 *
 * "Our Sponsors" is ours. The source has only the tenant's sentence, which is copy rather than a
 * heading and cannot carry the label role — so it stays, demoted to the line under it.
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
    <section className="m-ms-section">
      <header className="m-ms-label">
        <h2 className="m-ms-label-text">Our Goal</h2>
        {showDays && (
          <span className="m-ms-days">
            <Img name="clock" className="m-ms-clock" />
            <span className="m-ms-days-text">{days} days to go</span>
          </span>
        )}
      </header>

      <Card className="m-ms-goal">
        {/* Mixed type, so what you HAVE reads louder than what you need. The app runs it on one
          line as `tally / goal units` and only just fits; a card is narrower, so it stacks — and
          a slash stranded at the head of the second line reads as debris, where "of" reads as a
          sentence. */}
        <p className="m-ms-tally">
          <span>{tally.toLocaleString()}</span>
          <span className="m-ms-goal-rest">
            of {target.toLocaleString()} {goalType}s
          </span>
        </p>

        <div className="m-ms-bar-row">
          <div className="m-ms-bar">
            <ProgressBar progress={Number(percentage.replace('%', ''))} />
          </div>
          <span className="m-ms-percent">{percentage}</span>
        </div>
      </Card>
    </section>
  )
}

export function Microsite({ name, funnel, goal, events = [], sponsors, onOpenEvent }) {
  const ordered = sponsors
    ? [...sponsors.sponsors].sort((a, b) => a.sponsor_position - b.sponsor_position)
    : []

  return (
    <div className="m-ms">
      {/* The site's own card: its mark and its name, which is the only thing on this screen that
          is not a section. */}
      <Card className="m-ms-head">
        <Img name="beanstack_navigation_bar_logo" className="m-ms-logo" />
        <h1 className="m-ms-name">{name}</h1>
      </Card>

      {/* `MicrositeFunnelImage` — the programme's own banner, and the one panel of the seven in
          `useMicrositeScreenData` that nothing else on the tab shows. The source measures the
          image and sizes its holder to the real aspect ratio rather than cropping to a band. */}
      {funnel && (
        <div className="m-ms-funnel">
          <span className="m-ms-funnel-art">
            <span className="m-ms-funnel-title">{funnel.title}</span>
            <span className="m-ms-funnel-sub">{funnel.subtitle}</span>
          </span>
        </div>
      )}

      {goal && <Goal goal={goal} />}

      {events.length > 0 && (
        <section className="m-ms-section">
          <header className="m-ms-label">
            <h2 className="m-ms-label-text">Upcoming Events</h2>
          </header>
          {/* The carousel stays here: events are a set you browse, and the peeking next card is
              what says there are more. Sponsors are a set you read. */}
          <Carousel
            items={events}
            keyFor={(e) => e.id}
            peek={40}
            label="Upcoming events"
            renderItem={(event) => (
              <EventCard event={event} showAge={false} onPress={onOpenEvent} />
            )}
          />
        </section>
      )}

      {ordered.length > 0 && (
        <section className="m-ms-section">
          <header className="m-ms-label">
            <h2 className="m-ms-label-text">Our Sponsors</h2>
          </header>
          <p className="m-ms-sponsor-head">{sponsors.sponsor_header}</p>

          <ul className="m-ms-sponsor-list">
            {ordered.map((s) => {
              const sponsor = SPONSOR_MARKS[s.mark]
              if (!sponsor) return null
              return (
                <li key={s.id}>
                  <Card className="m-ms-sponsor">
                    <img
                      className="m-ms-sponsor-mark"
                      src={sponsor.src}
                      alt={sponsor.name}
                      style={{ height: sponsor.height }}
                    />
                  </Card>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}
