import { useMemo, useState } from 'react'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { StatCard, ChartCard, CardNote } from '@components/Cards/Cards'
import { Tabs } from '@components/Tabs/Tabs'
import { Table } from '@components/Table/Table'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
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

import { SOURCES, SOURCE_ORDER, FORMATS, FORMAT_ORDER, ALL_GENRES } from '../data'
import {
  districtTitles,
  districtBennyQueries,
  districtGenreGaps,
  districtTitleActions,
  districtBookDetail,
  districtHoldings,
  reach,
  REQUEST_GAP_BELOW,
  TITLE_ACTION,
} from '../derive'
import { TitleCell, HoldingPills } from './Bits'
import { GenreTable } from './Health'
import { BookModal } from './BookModal'
import { STATUS, matchStatus, RequestCoverage } from './SchoolCollection'

const TAB_IDS = ['all', 'gaps', 'requests']

/**
 * The school's title reporting, pooled across the district. One row per
 * title, whichever buildings carry it; the figures are the sum of theirs. It
 * drills one level less far than the school's — a title opens onto its
 * schools, not onto their readers.
 */
export function DistrictCollection() {
  const [openTitle, setOpenTitle] = useState(null)
  const [stickyTab, setTab] = useStickyState('ce:district-collection-tab', 'all')
  const tab = TAB_IDS.includes(stickyTab) ? stickyTab : 'all'
  const [q, setQ] = useState('')
  const [genre, setGenre] = useState('')
  const [source, setSource] = useState('')
  const [format, setFormat] = useState('')
  // The Overview's health signals can open this page already narrowed to a
  // status; they leave one in sessionStorage, read once and cleared.
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

  const actions = useMemo(() => districtTitleActions(), [])
  const allTitles = useMemo(
    () =>
      districtTitles().sort(
        (a, b) =>
          b.logged - a.logged ||
          b.suggested - a.suggested ||
          a.title.title.localeCompare(b.title.title),
      ),
    [],
  )
  // Every holding any school has for a title — the district can reach a reader
  // through any of them.
  const holdingsOf = useMemo(() => districtHoldings(), [])

  const narrowed = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return allTitles.filter((r) => {
      const t = r.title
      const holdings = holdingsOf.get(t.id)
      if (genre && t.genre !== genre) return false
      if (source && !holdings.some((h) => h.source === source)) return false
      if (format && !holdings.some((h) => h.format === format)) return false
      if (action && actions.get(t.id)?.kind !== action) return false
      if (needle && !`${t.title} ${t.author}`.toLowerCase().includes(needle)) return false
      return true
    })
  }, [allTitles, holdingsOf, q, genre, source, format, action, actions])
  const counts = reach(narrowed)
  const rows = narrowed.filter((r) => matchStatus(status, r))
  const genres = districtGenreGaps()
  const queries = districtBennyQueries()
  const filtered = q || genre || source || format || status || action
  const toggleStatus = (id) => setStatus((cur) => (cur === id ? '' : id))

  return (
    <>
      <PageHeader title="Collection intelligence" />

      {/* Distinct titles across the district, so a title four schools carry is
          one row here and one count in these tiles. */}
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
          ]}
        />

        {tab === 'all' && (
          <>
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

            <Table
              scrollX
              columns={[
                {
                  key: 'title',
                  label: 'Title',
                  render: (_, s) => <TitleCell title={s.title} />,
                },
                {
                  key: 'where',
                  label: 'Collection',
                  render: (_, s) => <HoldingPills holdings={holdingsOf.get(s.title.id)} />,
                },
                { key: 'schools', label: 'Schools', align: 'right', render: (_, s) => s.schools },
                {
                  key: 'suggested',
                  label: 'Shown',
                  align: 'right',
                  render: (_, s) =>
                    s.suggested ? (
                      s.suggested.toLocaleString()
                    ) : (
                      <span className="ce-dim">Never</span>
                    ),
                },
                { key: 'logged', label: 'Read', align: 'right', render: (_, s) => s.logged },
                {
                  key: 'open',
                  label: '',
                  align: 'right',
                  width: 56,
                  render: (_, s) => (
                    <RowActions>
                      <RowAction
                        icon="eye"
                        label={`View ${s.title.title}`}
                        onClick={() => setOpenTitle(s.title.id)}
                      />
                    </RowActions>
                  ),
                },
              ]}
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
                  <EmptyState title="No titles yet" description="No school has a catalog on." />
                )
              }
            />
          </>
        )}

        {tab === 'gaps' && (
          <>
            <GenreTable
              rows={genres}
              scope="district"
              onPick={(g) => {
                setGenre(g)
                setTab('all')
              }}
            />
            <CardNote tone="info">
              A genre is a district <strong>gap</strong> when two or more schools are short of it —
              one school short of something is that school&rsquo;s problem; the same shortfall in a
              third of the district is a purchase. Pick a genre to see its titles.
            </CardNote>
          </>
        )}

        {tab === 'requests' && (
          <ChartCard title="What readers asked Benny for" accent="#0F766E" bodyPad="flush">
            <Table
              flush
              columns={[
                { key: 'q', label: 'Asked for', render: (_, r) => <em>&ldquo;{r.q}&rdquo;</em> },
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
              rows={[...queries].sort((a, b) => a.hits / a.asks - b.hits / b.asks)}
              getRowKey={(r) => r.q}
            />
          </ChartCard>
        )}
      </div>

      <BookModal
        detail={openTitle ? districtBookDetail(openTitle) : null}
        action={openTitle ? actions.get(openTitle) : null}
        onClose={() => setOpenTitle(null)}
        onOpenTitle={setOpenTitle}
      />
    </>
  )
}
