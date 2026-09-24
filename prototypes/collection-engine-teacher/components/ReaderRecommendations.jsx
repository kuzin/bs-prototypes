// The Recommendations section of a reader's profile — what the engine has put
// in front of this reader, and what came of it.
//
// It rides in on the Student Profile's own `extraNav` / `renderExtra` slots, so
// it is a section of the real profile rather than a second window onto the same
// reader. Three states, in the order a teacher acts on them: what they saved
// and haven't read yet, what they read, and what is currently being suggested.
import { Tabs } from '@components/Tabs/Tabs'
import { useStickyState } from '@components/useStickyState/useStickyState'
import '@components/Tabs/Tabs.css'
import { BookCover } from '@components/BookCover/BookCover'
import { Pill } from '@components/Pill/Pill'
import { Button } from '@components/Button/Button'
import { Hero } from '@components/Hero/Hero'
import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'
import { EmptyState, Tooltip } from '@components/Primitives/Primitives'
import '@components/BookCover/BookCover.css'
import '@components/Pill/Pill.css'
import '@components/Button/Button.css'
import '@components/Hero/Hero.css'
import '@components/Primitives/Primitives.css'

// The profile's own section chrome — `bp-content` for the page padding, Card
// and SectionHeading for the blocks — rather than a second card style inside
// the same panel.
import { Card, SectionHeading } from '../../student-profile/components/kit'
import { TitleCard, TitleGrid } from '../../collection-engine/components/TitleCard'

import { READER_BY_KEY, counts, reasonFor, recommendedGenres } from '../data'
import { SIGNALS } from '../../collection-engine/data'
import './ReaderRecommendations.css'

// The profile files every section's colour in one place as { bg, text }; this
// is the entry this section would have, in the engine's own teal. `variant="page"`
// and no subtitle is what every other section head in the profile does — a
// default Hero with a subtitle under it was the odd one out.
const REC_ACCENT = { bg: '#E6F7F4', text: '#0F766E' }

// The Wish List is one feature area with three states, not a want-to-read list
// beside a saved list. How a title got there is a property of the row, not a reason for
// a second list.
const SHELF_GROUPS = [
  { id: 'want', title: 'Want to read' },
  { id: 'reading', title: 'Reading now' },
  { id: 'finished', title: 'Finished' },
]

/**
 * One title on the Wish List. The row says how it got there — the reader put it
 * there, or the engine suggested it and they kept it — and whether the school
 * can actually supply it, which is the thing a teacher can act on today.
 */
function ShelfRow({ entry, reader }) {
  const t = entry.title
  const sig = entry.via === 'engine' ? SIGNALS[entry.signal] : null
  return (
    <li className="crr-title">
      <BookCover book={{ coverId: t.coverId, title: t.title }} size="sm" />
      <div className="crr-title-text">
        <span className="crr-title-name">{t.title}</span>
        <span className="crr-title-sub">{t.author}</span>
      </div>
      {/* The why rides on the signal pill rather than under the title: it
          explains this one book, and a list of twelve reasons stacked under
          twelve titles is a wall nobody reads. */}
      <Tooltip content={reasonFor(entry, reader)} placement="auto">
        {entry.via === 'wishlist' ? (
          <Pill color="#DC2626" size="sm">
            Their own pick
          </Pill>
        ) : (
          sig && (
            <Pill color={sig.color} size="sm">
              {sig.label}
            </Pill>
          )
        )}
      </Tooltip>
      {!entry.inCatalog && (
        <Pill color="#B43DD0" size="sm">
          You can’t supply it
        </Pill>
      )}
    </li>
  )
}

/** A suggestion that never reached the Wish List. */
function PassedRow({ entry, reader }) {
  const t = entry.title
  const sig = SIGNALS[entry.signal]
  return (
    <li className="crr-title">
      <BookCover book={{ coverId: t.coverId, title: t.title }} size="sm" />
      <div className="crr-title-text">
        <span className="crr-title-name">{t.title}</span>
        <span className="crr-title-sub">{t.author}</span>
      </div>
      <Tooltip content={reasonFor(entry, reader)} placement="auto">
        {sig && (
          <Pill color={sig.color} size="sm">
            {sig.label}
          </Pill>
        )}
      </Tooltip>
    </li>
  )
}

/**
 * A genre we would point this reader at, and the one reason why — the engine's
 * own signal pill, the same one a recommended title carries, with the specific
 * case for this reader in its tooltip.
 */
function GenreRow({ g }) {
  const sig = SIGNALS[g.reason.id]
  return (
    <li className="crr-title">
      <div className="crr-title-text">
        <span className="crr-title-name">{g.label}</span>
      </div>
      <Tooltip content={g.reason.detail} placement="auto">
        <Pill color={sig.color} size="sm">
          {sig.label}
        </Pill>
      </Tooltip>
    </li>
  )
}

/* Covers or rows, the same switch the classroom list has — browsing a shelf and
   working through a list are two jobs, and a reader's own shelf is mostly the
   first. The tile is the shared TitleCard, so a book looks the same wherever it
   is shown; its hover caption carries the title, the author and why it is here,
   which is what the row spells out. */
function ShelfGroup({ entries, reader, view, Row = ShelfRow }) {
  if (view === 'cards') {
    return (
      <TitleGrid>
        {entries.map((e) => (
          <TitleCard key={e.title.id} title={e.title} meta={reasonFor(e, reader)} />
        ))}
      </TitleGrid>
    )
  }
  return (
    <ul className="crr-list">
      {entries.map((e) => (
        <Row key={e.title.id} entry={e} reader={reader} />
      ))}
    </ul>
  )
}

export function ReaderRecommendations({ studentKey }) {
  const [tab, setTab] = useStickyState('cet:rec-tab', 'why')
  const [view, setView] = useStickyState('cet:rec-view', 'cards')
  const reader = READER_BY_KEY[studentKey]
  if (!reader) {
    return (
      <div className="bp-content">
        <Hero
          variant="page"
          icon={<PlumpyIcon name="book" size={22} />}
          title="Recommendations"
          accent={REC_ACCENT.text}
          accentBg={REC_ACCENT.bg}
        />
        <Card>
          <EmptyState
            title="No recommendations yet"
            description="This reader hasn’t been suggested to yet."
          />
        </Card>
      </div>
    )
  }
  const c = counts(reader)
  const kept = reader.shelf.filter((t) => t.via === 'engine')
  const genres = recommendedGenres(reader)

  return (
    /* `bp-content` is the profile's own section padding — without it a section
       sits flush against the panel edge, which no other section does. */
    <div className="bp-content crr">
      {/* A page action, so it sits in the header's top right — the same slot
          Reading Log's "Print log" uses, and inert the same way it is. Label
          only: a full-size button takes a word or a glyph, not both. */}
      <Hero
        variant="page"
        icon={<PlumpyIcon name="book" size={22} />}
        title="Recommendations"
        accent={REC_ACCENT.text}
        accentBg={REC_ACCENT.bg}
        action={
          <Button variant="secondary" size="msm">
            Print list
          </Button>
        }
      />

      {/* Two different questions, so two tabs: what the engine did, and what
          the reader is holding. They overlap — a suggestion they kept is on
          both — and that is correct, because "did the engine work" and "what
          has this reader got" are not the same thing. */}
      <div className="crr-viewbar">
        <Tabs
          variant="pill"
          size="sm"
          block
          active={tab}
          onChange={setTab}
          ariaLabel="Recommendations views"
          items={[
            { id: 'why', label: 'Recommendations', count: c.suggested },
            { id: 'shelf', label: 'Wish List', count: reader.shelf.length },
            { id: 'genres', label: 'Genres', count: genres.length },
          ]}
        />
        {/* Covers or rows means nothing for a list of genres, but the switch
            stays put rather than vanishing and shifting the bar — it is
            disabled there instead. */}
        <Tabs
          variant="pill"
          size="sm"
          iconOnly
          active={view}
          onChange={setView}
          ariaLabel="How to show the list"
          items={[
            {
              id: 'cards',
              label: 'Covers',
              icon: <PlumpyIcon name="grid-view" size={20} />,
              disabled: tab === 'genres',
            },
            {
              id: 'list',
              label: 'List',
              icon: <PlumpyIcon name="list-view" size={20} />,
              disabled: tab === 'genres',
            },
          ]}
        />
      </div>

      {/* The genres to point this reader at, strongest case first, each with
          the reasons it is on the list. */}
      {tab === 'genres' && (
        <Card>
          <SectionHeading>
            Genres we recommend <span className="crr-group-count">{genres.length}</span>
          </SectionHeading>
          <ul className="crr-list">
            {genres.map((g) => (
              <GenreRow key={g.genre} g={g} />
            ))}
          </ul>
        </Card>
      )}

      {tab === 'why' && (
        <>
          {kept.length > 0 && (
            <Card>
              <SectionHeading>
                Added to their Wish List <span className="crr-group-count">{kept.length}</span>
              </SectionHeading>
              <ShelfGroup entries={kept} reader={reader} view={view} />
            </Card>
          )}

          {reader.passed.length > 0 && (
            <Card>
              <SectionHeading>
                Not added to their Wish List{' '}
                <span className="crr-group-count">{reader.passed.length}</span>
              </SectionHeading>
              <ShelfGroup entries={reader.passed} reader={reader} view={view} Row={PassedRow} />
            </Card>
          )}
        </>
      )}

      {/* A card per state, the same as the Recommendations tab — three runs
          inside one card read as one list with headings in it, and the states
          are the point. */}
      {tab === 'shelf' &&
        SHELF_GROUPS.map((g) => {
          const entries = reader.shelf
            .filter((t) => t.state === g.id)
            .sort((a, b) => Number(a.inCatalog) - Number(b.inCatalog) || b.addedDays - a.addedDays)
          if (!entries.length) return null
          return (
            <Card key={g.id}>
              <SectionHeading>
                {g.title} <span className="crr-group-count">{entries.length}</span>
              </SectionHeading>
              <ShelfGroup entries={entries} reader={reader} view={view} />
            </Card>
          )
        })}
    </div>
  )
}
