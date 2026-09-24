import { useMemo, useState } from 'react'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { StatCard, CardNote } from '@components/Cards/Cards'
import { Tabs } from '@components/Tabs/Tabs'
import { Table } from '@components/Table/Table'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import { Pill } from '@components/Pill/Pill'
import { EmptyState } from '@components/Primitives/Primitives'
import { FilterBar, FilterItem } from '@components/FilterBar/FilterBar'
import { Select } from '@components/Form/Form'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { useStickyState } from '@components/useStickyState/useStickyState'
import { useTitleRequests } from '@components/useTitleRequests/useTitleRequests'
import '@components/Primitives/Primitives.css'
import '@components/FilterBar/FilterBar.css'
import '@components/Form/Form.css'
import '@components/SearchInput/SearchInput.css'
import '@components/Tabs/Tabs.css'
import '@components/Table/Table.css'
import '@components/RowAction/RowAction.css'
import '@components/Pill/Pill.css'

import { SOURCES, SOURCE_ORDER, FORMATS, FORMAT_ORDER, ALL_GENRES } from '../data'
import {
  schoolTitles,
  bennyQueries,
  genreHealth,
  titleActions,
  titleStatus,
  reach,
  REQUEST_GAP_BELOW,
  TITLE_ACTION,
} from '../derive'
import { TitleCell, HoldingPills, openClassroom } from './Bits'
import { GenreTable } from './Health'
import { SchoolBookPanels } from './SchoolBookPanels'

const TAB_IDS = ['all', 'gaps', 'requests', 'hidden']

/* Where a title stands against the engine. `recommended` is the two middle
   states together — the first tile's figure — so every tile has a filter that
   means exactly what it counts. */
export const STATUS = {
  '': 'Every title',
  recommended: 'Recommended',
  read: 'Recommended, then read',
  unread: 'Recommended, not read',
  never: 'Never recommended',
}
export const matchStatus = (status, s) =>
  !status || (status === 'recommended' ? s.suggested > 0 : titleStatus(s) === status)

/** A request's coverage, the one scale the Requests tab and the gap count share. */
export function RequestCoverage({ hits }) {
  if (hits === 0) return <Pill color="#DC2626">Nothing to offer</Pill>
  if (hits < REQUEST_GAP_BELOW) return <Pill color="#DC2626">Gap</Pill>
  if (hits < 12) return <Pill color="#D97706">Thin</Pill>
  return <Pill color="#0BA85F">Covered</Pill>
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
  const [stickyTab, setTab] = useStickyState('ce:collection-tab', 'all')
  // A value left in sessionStorage from an older set of tabs would otherwise
  // render an empty panel.
  const tab = TAB_IDS.includes(stickyTab) ? stickyTab : 'all'
  // Filters belong to the browsing, not to where you were — they reset when
  // the school changes under you, which a sticky value wouldn't.
  const [q, setQ] = useState('')
  const [genre, setGenre] = useState('')
  const [source, setSource] = useState('')
  const [format, setFormat] = useState('')
  // A signal on the Overview can open this page already narrowed to a status;
  // it leaves one in sessionStorage, read once and cleared.
  const [status, setStatus] = useState(() => {
    try {
      const handed = sessionStorage.getItem('bsp:ce:collection-status')
      sessionStorage.removeItem('bsp:ce:collection-status')
      return handed ?? ''
    } catch {
      return ''
    }
  })
  const [action, setAction] = useState('')

  const actions = useMemo(() => titleActions(school), [school])
  const allTitles = useMemo(
    () =>
      schoolTitles(school).sort(
        (a, b) =>
          b.logged - a.logged ||
          b.suggested - a.suggested ||
          a.title.title.localeCompare(b.title.title),
      ),
    [school],
  )

  // Every filter but status. The tiles count this, so they describe whatever
  // the list is narrowed to — pick a genre and the four figures are that
  // genre's — and the status filter is the tiles themselves.
  const narrowed = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return allTitles.filter((r) => {
      const t = r.title
      if (genre && t.genre !== genre) return false
      if (source && !t.holdings.some((h) => h.source === source)) return false
      if (format && !t.holdings.some((h) => h.format === format)) return false
      if (action && actions.get(t.id)?.kind !== action) return false
      if (needle && !`${t.title} ${t.author}`.toLowerCase().includes(needle)) return false
      return true
    })
  }, [allTitles, q, genre, source, format, action, actions])
  const counts = reach(narrowed)
  const rows = narrowed.filter((r) => matchStatus(status, r))
  const hiddenRows = rows.filter((r) => hidden.has(r.title.id))
  const queries = bennyQueries(school)
  /* Titles this school's readers asked for from a book in Discover that none
     of the school's sources carries (`books`). Nothing in the collection
     answers them yet, so each is a gap until someone buys it — newest first,
     above what readers ask Benny. */
  const titleRequests = useTitleRequests(school.id)
  const requestRows = [
    ...titleRequests.requests.map((r) => ({
      q: r.q,
      author: r.author,
      asks: r.asks,
      hits: 0,
      fresh: true,
    })),
    ...[...queries].sort((a, b) => a.hits / a.asks - b.hits / b.asks),
  ]
  const genres = genreHealth(school)
  const filtered = q || genre || source || format || status || action

  // A tile is a toggle: pressing the one that is on clears it.
  const toggleStatus = (id) => setStatus((cur) => (cur === id ? '' : id))

  return (
    <>
      <PageHeader title="Collection" />

      <div className="ce-stats">
        <StatCard
          icon="books"
          value={counts.recommended}
          unit={`/${counts.total}`}
          label="Titles recommended"
          color="#196DD5"
          active={status === 'recommended'}
          onClick={() => toggleStatus('recommended')}
        />
        <StatCard
          icon="circle-check"
          value={counts.read}
          label="Recommended, then read"
          color="#0BA85F"
          active={status === 'read'}
          onClick={() => toggleStatus('read')}
        />
        <StatCard
          icon="clock"
          value={counts.unread}
          label="Recommended, not read"
          color="#D97706"
          active={status === 'unread'}
          onClick={() => toggleStatus('unread')}
        />
        <StatCard
          icon="cancel"
          value={counts.never}
          label="Never recommended"
          color="#767676"
          active={status === 'never'}
          onClick={() => toggleStatus('never')}
        />
      </div>

      {/* The tab bar and the filter bar are controls *for* the panel below
          them, not siblings of it — one block, one rhythm. */}
      <div className="ce-panel">
        <Tabs
          active={tab}
          onChange={setTab}
          variant="pill"
          ariaLabel="Collection views"
          items={[
            { id: 'all', label: 'All Titles', count: allTitles.length },
            {
              id: 'gaps',
              label: 'Gaps & Strengths',
              count: genres.filter((g) => g.verdict === 'gap').length,
            },
            { id: 'requests', label: 'Requests' },
            { id: 'hidden', label: 'Hidden', count: hidden.size },
          ]}
        />

        {(tab === 'all' || tab === 'hidden') && (
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
            <FilterItem label="Collection">
              <Select value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="">All collections</option>
                {SOURCE_ORDER.map((id) => (
                  <option key={id} value={id}>
                    {SOURCES[id].name}
                  </option>
                ))}
              </Select>
            </FilterItem>
            <FilterItem label="Format">
              <Select value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="">All formats</option>
                {FORMAT_ORDER.map((id) => (
                  <option key={id} value={id}>
                    {FORMATS[id].label}
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
            <FilterItem label="Suggested action">
              <Select value={action} onChange={(e) => setAction(e.target.value)}>
                <option value="">Any action</option>
                {Object.entries(TITLE_ACTION).map(([id, a]) => (
                  <option key={id} value={id}>
                    {a.label}
                  </option>
                ))}
              </Select>
            </FilterItem>
          </FilterBar>
        )}

        {tab === 'all' && (
          <Table
            scrollX
            columns={titleColumns(setOpenTitle, hidden)}
            rows={rows}
            onRowClick={(s) => setOpenTitle(s.title.id)}
            getRowKey={(s) => s.title.id}
            pageSize={10}
            empty={
              filtered ? (
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

        {/* Supply against demand, a genre to a row. Picking one narrows All
            Titles to it, which is the list you'd buy against. */}
        {tab === 'gaps' && (
          <>
            <GenreTable
              rows={genres}
              onPick={(g) => {
                setGenre(g)
                setTab('all')
              }}
            />
            <CardNote tone="info">
              A <strong>gap</strong> is a genre with more than three readers into it for every title
              on the shelf — readers who have wish listed or read one — so the engine keeps handing
              the same few books round. A <strong>strength</strong> is well stocked, nearly all of
              it recommended, and read more often than the school&rsquo;s average. Pick a genre to
              see its titles.
            </CardNote>
          </>
        )}

        {tab === 'requests' && (
          <Table
            columns={[
              {
                key: 'q',
                label: 'Asked for',
                render: (_, r) => (
                  <span className="ce-asked">
                    <em>&ldquo;{r.q}&rdquo;</em>
                    {r.author && <span className="ce-dim">by {r.author}</span>}
                    {r.fresh && (
                      <Pill color="#196DD5" size="sm">
                        New request
                      </Pill>
                    )}
                  </span>
                ),
              },
              { key: 'asks', label: 'Times asked', align: 'right', render: (_, r) => r.asks },
              {
                key: 'hits',
                label: 'Titles we could offer',
                align: 'right',
                render: (_, r) => (
                  <span className={r.hits < REQUEST_GAP_BELOW ? 'ce-bad' : undefined}>
                    {r.hits}
                  </span>
                ),
              },
              {
                key: 'verdict',
                label: 'Coverage',
                render: (_, r) => <RequestCoverage hits={r.hits} />,
              },
            ]}
            rows={requestRows}
            getRowKey={(r) => `${r.fresh ? 'request' : 'benny'}:${r.q}`}
          />
        )}
        {tab === 'requests' && titleRequests.requests.length > 0 && (
          <CardNote>
            A <strong>new request</strong> is a title a reader asked for from its page in Discover,
            because none of the school&rsquo;s sources carries it.{' '}
            <button type="button" className="ce-proto-link" onClick={titleRequests.clear}>
              Clear readers&rsquo; requests — prototype only
            </button>
          </CardNote>
        )}

        {/* Titles pulled out of the recommendations. A tab rather than another
            status, because what you do here is put them back. */}
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
      </div>

      <SchoolBookPanels
        school={school}
        openTitle={openTitle}
        onOpenTitle={setOpenTitle}
        actions={actions}
        hidden={hidden}
        onToggleHidden={toggleHidden}
      />
    </>
  )
}

/* The row's own actions, at its trailing edge. The second one only appears on a
   title a teacher has scanned in — that copy lives in a room, and the room has
   its own screen. */
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

/* `Shown` says Never rather than 0 on a title the engine has genuinely never
   surfaced — the difference between a book readers passed on and a book they
   were never offered is the whole point of the Never recommended tile. */
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
    label: 'Collection',
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
