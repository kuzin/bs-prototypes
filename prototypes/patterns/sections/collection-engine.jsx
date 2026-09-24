import { useState } from 'react'
import {
  HoldingPills,
  ShelfLine,
  TitleCell,
  FeedState,
  AsOf,
  FeedCard,
} from '../../collection-engine/components/Bits'
import { TitleCard, TitleGrid } from '../../collection-engine/components/TitleCard'
import { BookModal } from '../../collection-engine/components/BookModal'
import { Button } from '@components/Button/Button'
import { SCHOOL_BY_ID, CERTAINTY } from '../../collection-engine/data'
import { freshness, discovered, bookDetail } from '../../collection-engine/derive'
import { Variant } from './_shared'

const LINCOLN = SCHOOL_BY_ID.lincoln
const HILLCREST = SCHOOL_BY_ID.hillcrest

// Real rows from the prototype's own fixtures, picked for the shape each
// showcase is about rather than invented for it.
const TOP = discovered(LINCOLN)[0]
const MULTI = discovered(LINCOLN).find((s) => s.title.holdings.length >= 3) ?? TOP
const PRINT_ONLY = discovered(LINCOLN).find(
  (s) => s.title.holdings.length === 1 && s.title.holdings[0].source === 'destiny',
)

export const collectionEngineSections = [
  {
    group: 'collection-engine',
    id: 'ce-holding-pills',
    name: 'HoldingPills',
    desc: (
      <>
        Where a reader can actually get a title, as one row of source pills. The order is fixed and
        it is the order of <em>certainty</em>, not the order the records arrived in:{' '}
        <strong>{CERTAINTY.own.label.toLowerCase()}</strong> (a licence we own — Comics Plus),{' '}
        <strong>{CERTAINTY.hold.label.toLowerCase()}</strong> (a digital holding with a queue we
        can&rsquo;t see — Sora), then <strong>{CERTAINTY.shelf.label.toLowerCase()}</strong> (a
        physical copy the school owns, which is not the same as one that is on the shelf right now).
        <br />
        <br />
        That distinction is the whole reason this isn&rsquo;t a single badge. No catalog tells us
        about a checkout, so the strongest honest claim about print is ownership — and a pill that
        implied availability would be wrong roughly as often as the shelf is empty.
      </>
    ),
    usage: `import { HoldingPills } from './components/Bits'

<HoldingPills holdings={title.holdings} />`,
    render: () => (
      <>
        <Variant label="a title in three places at once">
          <HoldingPills holdings={MULTI.title.holdings} />
        </Variant>
        {PRINT_ONLY && (
          <Variant label="print only — ownership is all we can claim">
            <HoldingPills holdings={PRINT_ONLY.title.holdings} />
          </Variant>
        )}
      </>
    ),
  },
  {
    group: 'collection-engine',
    id: 'ce-shelf-line',
    name: 'ShelfLine',
    desc: (
      <>
        The call number, and the room number when a teacher has scanned a copy into their classroom
        library. This is the payoff of taking MARC records rather than scraping a catalog page:
        &ldquo;your library owns it&rdquo; is a database claim a nine-year-old can&rsquo;t act on,
        and <code>FIC BRO</code> walks them to a shelf. It renders nothing at all when the only
        holdings are digital, because there is no shelf to walk to.
      </>
    ),
    usage: `import { ShelfLine } from './components/Bits'

<ShelfLine holdings={title.holdings} />`,
    render: () => (
      <>
        <Variant label="library call number">
          <ShelfLine holdings={MULTI.title.holdings} />
        </Variant>
        {PRINT_ONLY && (
          <Variant label="print only">
            <ShelfLine holdings={PRINT_ONLY.title.holdings} />
          </Variant>
        )}
      </>
    ),
  },
  {
    group: 'collection-engine',
    id: 'ce-title-cell',
    name: 'TitleCell',
    desc: (
      <>
        A title in a table row — the shared <code>BookCover</code> at <code>sm</code>, the title,
        and one line under it. The text block is capped rather than left to size itself: these
        tables scroll horizontally at <code>max-content</code>, so a cell with{' '}
        <code>white-space: nowrap</code> and no ceiling grows to the longest title in the set and
        pushes every other column off the card.
      </>
    ),
    usage: `import { TitleCell } from './components/Bits'

<TitleCell title={title} sub={\`\${title.author} · \${title.genre}\`} />`,
    render: () => (
      <>
        <Variant label="author underneath (the default)">
          <TitleCell title={TOP.title} />
        </Variant>
        <Variant label="author and shelf, where the genre column was dropped">
          <TitleCell title={TOP.title} sub={`${TOP.title.author} · ${TOP.title.genre}`} />
        </Variant>
      </>
    ),
  },
  {
    group: 'collection-engine',
    id: 'ce-asof',
    name: 'AsOf',
    desc: (
      <>
        The date stamp every recommendation in a school implicitly carries. A MARC drop is a
        snapshot, not a feed, so a catalog is always <em>as of</em> something — and once it is more
        than a month old the stamp stops being a footnote and starts being the reason conversion is
        down, so it turns amber and says how long. A school that has never sent a file gets a
        different sentence rather than a missing date.
        <br />
        <br />
        It reads the library catalog specifically, not the freshest feed of any kind: Comics Plus is
        live every day of the year, and letting that stand in for a MARC drop that never arrived
        would make the worst-provisioned school in the district look current.
      </>
    ),
    usage: `import { AsOf } from './components/Bits'
import { freshness } from './derive'

<AsOf fresh={freshness(school)} />`,
    render: () => (
      <>
        <Variant label="current — nine days old">
          <AsOf fresh={freshness(LINCOLN)} />
        </Variant>
        <Variant label="out of date">
          <AsOf fresh={freshness(SCHOOL_BY_ID.oakmont)} />
        </Variant>
        <Variant label="never synced">
          <AsOf fresh={freshness(HILLCREST)} />
        </Variant>
        <Variant label="no prefix — inside a table cell that already has a column head">
          <AsOf fresh={freshness(SCHOOL_BY_ID.garfield)} prefix="" />
        </Variant>
      </>
    ),
  },
  {
    group: 'collection-engine',
    id: 'ce-feed-state',
    name: 'FeedState',
    desc: (
      <>
        One pill for the four states a catalog source can be in — syncing, out of date, not
        connected, never synced. &ldquo;Not connected&rdquo; is grey rather than red on purpose: a
        source nobody has set up yet isn&rsquo;t broken. &ldquo;Never synced&rdquo; is red, because
        a source that was connected and has never delivered a file is.
      </>
    ),
    usage: `import { FeedState } from './components/Bits'

<FeedState state="stale" />   // 'ok' | 'stale' | 'pending' | 'off'`,
    render: () => (
      <Variant label="every state">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['ok', 'stale', 'pending', 'off'].map((s) => (
            <FeedState key={s} state={s} />
          ))}
        </div>
      </Variant>
    ),
  },
  {
    group: 'collection-engine',
    id: 'ce-feed-card',
    name: 'FeedCard',
    desc: (
      <>
        One catalog source as an operations card: how the records arrive, how often, what they
        cover, how many titles they brought, and how many records we couldn&rsquo;t place. The last
        two facts are the ones nobody draws and the ones that decide whether the product works — an
        unplaced record is a book the school owns and the engine cannot recommend.
        <br />
        <br />
        The actions differ by what the source actually supports. A MARC source offers an upload and
        a schedule; an API source offers a sync; a source that was never finished offers only the
        way to finish it.
      </>
    ),
    usage: `import { FeedCard } from './components/Bits'

<FeedCard feed={school.feeds[0]} />`,
    render: () => (
      <>
        <Variant label="a MARC source, syncing" full>
          <div className="ce-feeds" style={{ padding: 20 }}>
            <FeedCard feed={LINCOLN.feeds[0]} />
          </div>
        </Variant>
        <Variant label="out of date, and one that was never connected" full>
          <div className="ce-feeds" style={{ padding: 20 }}>
            <FeedCard feed={SCHOOL_BY_ID.oakmont.feeds[0]} />
            <FeedCard feed={SCHOOL_BY_ID.oakmont.feeds[2]} />
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'collection-engine',
    id: 'ce-title-card',
    name: 'TitleCard / TitleGrid',
    desc: (
      <>
        A title as a cover rather than a row — the app&rsquo;s own shelf grid (
        <code>books#index</code>&rsquo;s <code>ul.block-grid.large-block-grid-5</code>), not a card
        of its own design. Covers as many across as fit, title and author centred under each, the
        cover lifting on hover.
        <br />
        <br />
        It pairs with a table rather than replacing one: the table is the working view (sort it,
        filter it, export it) and this is the browsing one, because a teacher deciding what to pull
        for Monday is choosing between books and a book you choose between has a cover. The one
        staff fact it carries — who it serves — sits under the author in the same centred column.
        Where a copy <em>is</em> doesn&rsquo;t: three source pills under a cover took more room than
        the book did and turned a shelf into a legend. That belongs on the row in the list view and
        in the book panel&rsquo;s own Details, where somebody is deciding how to get hold of it.
        <br />
        <br />
        <code>meta</code> is a string rather than a count so each host says what its own number
        means: a classroom counts readers it serves, a school counts readers it was suggested to.
      </>
    ),
    usage: `import { TitleCard, TitleGrid } from './components/TitleCard'

<TitleGrid>
  {rows.map((row) => (
    <TitleCard
      key={row.title.id}
      title={row.title}
      meta={\`\${row.readers} readers\`}
      onOpen={() => setOpenTitle(row.title.id)}
    />
  ))}
</TitleGrid>`,
    render: () => (
      <Variant label="four titles off Lincoln's own shelves">
        <TitleGrid>
          {discovered(LINCOLN)
            .slice(0, 4)
            .map((row) => (
              <TitleCard
                key={row.title.id}
                title={row.title}
                meta={`${row.saved} readers`}
                onOpen={() => {}}
              />
            ))}
        </TitleGrid>
      </Variant>
    ),
  },
  {
    group: 'collection-engine',
    id: 'ce-book-modal',
    name: 'BookModal',
    desc: (
      <>
        One title, everything the school knows about it. The reader&rsquo;s own book page shows a
        book to someone deciding whether to read it; this shows the same book to someone deciding
        whether the collection is working — who it reached, who finished it, what they said, and
        where a copy actually is.
        <br />
        <br />
        Three panels, divided by rules. The book holds still down the left — cover, title, and the
        funnel it sits in (suggested to / on shelves / read / book talks). The tab bar holds still
        across the top of the right. Only the panel under it scrolls, so a title with thirty readers
        never pushes the cover off the top, and the dialog keeps one height as you move between a
        tab with thirty rows and one with four lines.
        <br />
        <br />
        It is a pure presenter: the host passes a <code>detail</code> object (
        <code>bookDetail()</code> for a school, <code>classBookDetail()</code> for a classroom) and
        an optional <code>onOpenReader</code>. A reader row is a link only when the host knows how
        to open a profile <em>and</em> that reader has one — a school of 214 generated readers has
        nowhere to go, a classroom of thirteen children does.
      </>
    ),
    usage: `import { BookModal } from './components/BookModal'

<BookModal
  detail={openTitle ? bookDetail(school, openTitle) : null}
  onClose={() => setOpenTitle(null)}
  onOpenReader={(key) => openStudent(key, 'recommendations')}
/>`,
    render: () => <BookModalDemo />,
  },
]

/** The panel only exists open, so the showcase gives it something to open from. */
function BookModalDemo() {
  const [open, setOpen] = useState(false)
  const titleId = discovered(LINCOLN)[0].title.id
  return (
    <Variant label="a title with thirty readers behind it">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open the book panel
      </Button>
      <BookModal
        detail={open ? bookDetail(LINCOLN, titleId) : null}
        onClose={() => setOpen(false)}
      />
    </Variant>
  )
}
