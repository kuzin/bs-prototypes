import { useMemo, useState } from 'react'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { StatCard } from '@components/Cards/Cards'
import { Tabs } from '@components/Tabs/Tabs'
import { Table } from '@components/Table/Table'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import { Pill } from '@components/Pill/Pill'
import { EmptyState } from '@components/Primitives/Primitives'
import { FilterBar, FilterItem } from '@components/FilterBar/FilterBar'
import { Select } from '@components/Form/Form'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { useStickyState } from '@components/useStickyState/useStickyState'
import '@components/Primitives/Primitives.css'
import '@components/FilterBar/FilterBar.css'
import '@components/Form/Form.css'
import '@components/SearchInput/SearchInput.css'
import '@components/Tabs/Tabs.css'
import '@components/Table/Table.css'
import '@components/RowAction/RowAction.css'
import '@components/Pill/Pill.css'

import { SOURCES, SOURCE_ORDER, ALL_GENRES } from '../data'
import { discovered, deadShelf, bennyQueries, bookDetail, readerTalks } from '../derive'
import { TitleCell, HoldingPills, openClassroom } from './Bits'
import { BookModal } from './BookModal'
import { ReaderPanel } from './ReaderPanel'
import { TalkPanel } from './TalkPanel'

const TAB_IDS = ['all', 'hidden', 'requests']

/* Found and untouched are two ends of one list, not two lists: the same
   columns, the same filters, and a librarian moving between them is narrowing
   a view rather than changing subject. So they are a filter over All Titles,
   and the tabs are the three things that really are separate — the collection,
   what has been pulled out of it, and what readers asked for that it can't
   answer. */
const STATUS = {
  '': 'Every title',
  found: 'Readers have found it',
  untouched: 'Sitting untouched',
}

export function SchoolCollection({ school }) {
  // Which title's panel is open. A row opens the book rather than navigating —
  // you are working down a list, and the list should still be there after.
  const [openTitle, setOpenTitle] = useState(null)
  // Titles the engine has been told to leave out. Local to the session — this
  // is a prototype of the control, not of the setting behind it.
  const [hidden, setHidden] = useState(() => new Set())
  const toggleHidden = (id) =>
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  // A reader opened out of the book panel. The book panel closes behind it, the
  // way the classroom's does — two stacked overlays is one too many.
  const [openReader, setOpenReader] = useState(null)
  // A book talk opened out of the book panel — SfR's own session panel, so a
  // talk reads the same wherever you reach it from.
  const [openTalk, setOpenTalk] = useState(null)
  const [stickyTab, setTab] = useStickyState('ce:collection-tab', 'all')
  // A value left in sessionStorage from before the Gaps tab was removed would
  // otherwise render an empty panel.
  const tab = TAB_IDS.includes(stickyTab) ? stickyTab : 'all'
  // Filters belong to the browsing, not to where you were — they reset when
  // the school changes under you, which a sticky value wouldn't.
  const [q, setQ] = useState('')
  const [genre, setGenre] = useState('')
  const [source, setSource] = useState('')
  const [status, setStatus] = useState('')

  const filter = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return (rows) =>
      rows.filter((r) => {
        const t = r.title
        if (status === 'found' && !r.saved) return false
        if (status === 'untouched' && r.saved) return false
        if (genre && t.genre !== genre) return false
        if (source && !t.holdings.some((h) => h.source === source)) return false
        if (needle && !`${t.title} ${t.author}`.toLowerCase().includes(needle)) return false
        return true
      })
  }, [q, genre, source, status])

  const allFound = discovered(school)
  const allDead = deadShelf(school)
  // One list, ordered the way the two used to be: what readers found first, the
  // untouched tail after it.
  const allTitles = useMemo(() => [...allFound, ...allDead], [allFound, allDead])
  const rows = filter(allTitles)
  const hiddenRows = filter(allTitles.filter((r) => hidden.has(r.title.id)))
  const queries = bennyQueries(school)

  return (
    <>
      <PageHeader title="Collection" />

      <div className="ce-stats">
        <StatCard
          icon="books"
          value={school.catalog.length}
          label="Titles in the catalog"
          color="#196DD5"
        />
        {/* The tiles describe the collection, not whatever the filters are
            currently narrowing it to — the same reason the tab counts don't
            move either. */}
        <StatCard
          icon="circle-check"
          value={allFound.length}
          label="Readers have found"
          color="#0F766E"
        />
        <StatCard icon="clock" value={allDead.length} label="Sitting untouched" color="#D97706" />
      </div>

      {/* The tab bar and the filter bar are controls *for* the panel below
          them, not siblings of it. Wrapping the three means the page rhythm
          applies once, at the top, and they read as one block instead of
          three strips floating 20px apart. */}
      <div className="ce-panel">
        <Tabs
          active={tab}
          onChange={setTab}
          variant="pill"
          ariaLabel="Collection views"
          items={[
            { id: 'all', label: 'All Titles', count: allTitles.length },
            { id: 'hidden', label: 'Hidden', count: hidden.size },
            { id: 'requests', label: 'Requests' },
          ]}
        />

        {tab !== 'requests' && (
          <FilterBar compact>
            <FilterItem label="Search titles and authors">
              <SearchInput
                value={q}
                onChange={setQ}
                placeholder="Search titles and authors…"
                ariaLabel="Search titles and authors"
              />
            </FilterItem>
            <FilterItem label="Genre">
              <Select value={genre} onChange={(e) => setGenre(e.target.value)}>
                <option value="">All genres</option>
                {ALL_GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
            </FilterItem>
            <FilterItem label="Source">
              <Select value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="">All sources</option>
                {SOURCE_ORDER.map((id) => (
                  <option key={id} value={id}>
                    {SOURCES[id].name}
                  </option>
                ))}
              </Select>
            </FilterItem>
            <FilterItem label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                {Object.entries(STATUS).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </Select>
            </FilterItem>
          </FilterBar>
        )}

        {/* No cards around these lists. The tab above already names each one,
            so a card title only said it a second time. */}
        {tab === 'all' && (
          <Table
            scrollX
            columns={titleColumns(setOpenTitle, hidden)}
            rows={rows}
            onRowClick={(s) => setOpenTitle(s.title.id)}
            getRowKey={(s) => s.title.id}
            pageSize={10}
            empty={
              q || genre || source || status ? (
                <EmptyState
                  title="Nothing matches those filters"
                  description="Clear one of them to widen the list."
                />
              ) : (
                <EmptyState
                  title="Nothing in your catalogs yet"
                  description="Switch a catalog on under Setup and the titles it carries land here."
                />
              )
            }
          />
        )}

        {/* Titles pulled out of the recommendations. It is a tab rather than
            another status, because what you do here is put them back — you are
            reviewing your own decisions, not browsing the collection. */}
        {tab === 'hidden' && (
          <Table
            scrollX
            columns={titleColumns(setOpenTitle, hidden)}
            rows={hiddenRows}
            onRowClick={(s) => setOpenTitle(s.title.id)}
            getRowKey={(s) => s.title.id}
            pageSize={10}
            empty={
              hidden.size ? (
                <EmptyState
                  title="Nothing matches those filters"
                  description="Clear one of them to widen the list."
                />
              ) : (
                <EmptyState
                  title="Nothing has been pulled out"
                  description="The engine is free to suggest anything in your catalogs. Open a title and use Stop suggesting it to leave one out."
                />
              )
            }
          />
        )}

        {tab === 'requests' && (
          <Table
            columns={[
              { key: 'q', label: 'Asked for', render: (_, r) => <em>&ldquo;{r.q}&rdquo;</em> },
              { key: 'asks', label: 'Times asked', align: 'right', render: (_, r) => r.asks },
              {
                key: 'hits',
                label: 'Titles we could offer',
                align: 'right',
                render: (_, r) => (
                  <span className={r.hits < 12 ? 'ce-bad' : undefined}>{r.hits}</span>
                ),
              },
              {
                key: 'verdict',
                label: 'Coverage',
                render: (_, r) =>
                  r.hits === 0 ? (
                    <Pill color="#DC2626">Nothing to offer</Pill>
                  ) : r.hits < 12 ? (
                    <Pill color="#D97706">Thin</Pill>
                  ) : (
                    <Pill color="#0BA85F">Covered</Pill>
                  ),
              },
            ]}
            rows={[...queries].sort((a, b) => a.hits / a.asks - b.hits / b.asks)}
            getRowKey={(r) => r.q}
          />
        )}
      </div>

      <BookModal
        detail={openTitle ? bookDetail(school, openTitle) : null}
        onClose={() => setOpenTitle(null)}
        hidden={hidden.has(openTitle)}
        onToggleHidden={toggleHidden}
        onOpenTitle={setOpenTitle}
        onOpenTalk={setOpenTalk}
        onOpenReader={(key, section = null) => setOpenReader({ key, section })}
      />

      <ReaderPanel
        studentKey={openReader?.key}
        section={openReader?.section}
        onClose={() => setOpenReader(null)}
      />

      {/* The rail beside a talk is that reader's other conversations, so you can
          step through them the way the review queue does. */}
      <TalkPanel
        talk={openTalk}
        siblings={openTalk ? readerTalks(school, openTalk.reader.id) : []}
        onSelect={(sess) =>
          setOpenTalk(
            readerTalks(school, openTalk.reader.id).find(
              (t) => `ce-talk-${t.reader.id}-${t.title.id}` === sess.id,
            ) ?? openTalk,
          )
        }
        onClose={() => setOpenTalk(null)}
      />
    </>
  )
}

/* The row's own actions, at its trailing edge. The row already opens the book
   panel; the eye says so, because a table of books gives no other sign that a
   row is a thing you can look inside. The second one only appears on a title a
   teacher has scanned in — that copy lives in a room, and the room has its own
   screen. */
const actionsColumn = (onOpen) => ({
  key: 'open',
  label: '',
  align: 'right',
  width: 92,
  render: (_, s) => (
    <RowActions>
      {s.title.holdings.some((h) => h.source === 'clc') && (
        <RowAction
          icon="classroom"
          label="View the classroom library"
          onClick={(e) => {
            e.stopPropagation()
            openClassroom()
          }}
        />
      )}
      <RowAction icon="eye" label={`View ${s.title.title}`} onClick={() => onOpen(s.title.id)} />
    </RowActions>
  ),
})

/* One column set for the whole collection, because Found and Untouched are now
   a filter over it rather than two lists. `Shown` says Never rather than 0 on a
   title the engine has genuinely never surfaced — the difference between a book
   readers passed on and a book they were never offered is the whole point of
   the untouched filter. */
const titleColumns = (onOpen, hidden) => [
  {
    key: 'title',
    label: 'Title',
    render: (_, s) => (
      <div className="ce-titlecell">
        <TitleCell title={s.title} sub={s.title.author} />
        {hidden.has(s.title.id) && (
          <Pill color="#767676" size="sm">
            Hidden
          </Pill>
        )}
      </div>
    ),
  },
  {
    key: 'where',
    label: 'Get it from',
    render: (_, s) => <HoldingPills holdings={s.title.holdings} />,
  },
  {
    key: 'suggested',
    label: 'Shown',
    align: 'right',
    render: (_, s) => s.suggested || <span className="ce-dim">Never</span>,
  },
  { key: 'saved', label: 'Wish listed', align: 'right', render: (_, s) => s.saved },
  { key: 'logged', label: 'Read', align: 'right', render: (_, s) => s.logged },
  actionsColumn(onOpen),
]
