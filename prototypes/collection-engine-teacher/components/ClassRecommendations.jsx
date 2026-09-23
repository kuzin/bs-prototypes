// The Recommendations tab of a classroom page — the books the engine has put in
// front of this class, and why.
//
// A teacher plans in books: what to pull for Monday, what to scan into the
// Classroom Library Connector, what is already going round the room. So every
// row is a title, ranked by how much a copy in *this* room would change.
//
// It's a tab on Beanstack's real class page, added through the additive
// `extraTabs`/`renderExtra` slots the Student Profile prototype already exposes.
import { useMemo, useState } from 'react'
import { Table } from '@components/Table/Table'
import { Tabs } from '@components/Tabs/Tabs'
import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import { BookCover } from '@components/BookCover/BookCover'
import { InfoBox } from '@components/InfoBox/InfoBox'
import { EmptyState } from '@components/Primitives/Primitives'
import { FilterBar, FilterItem } from '@components/FilterBar/FilterBar'
import { Select } from '@components/Form/Form'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { useStickyState } from '@components/useStickyState/useStickyState'
import '@components/Tabs/Tabs.css'
import '@components/RowAction/RowAction.css'
import '@components/Primitives/Primitives.css'
import '@components/BookCover/BookCover.css'
import '@components/InfoBox/InfoBox.css'
import '@components/FilterBar/FilterBar.css'
import '@components/Form/Form.css'
import '@components/SearchInput/SearchInput.css'

import { SOURCES, SOURCE_ORDER } from '../../collection-engine/data'
import { HoldingPills } from '../../collection-engine/components/Bits'
import { TitleCard, TitleGrid } from '../../collection-engine/components/TitleCard'
import { TalkPanel } from '../../collection-engine/components/TalkPanel'
import { BookModal } from '../../collection-engine/components/BookModal'
import { classroomPicks, classBookDetail, PICK_REASONS } from '../data'
import './ClassRecommendations.css'

/** A teacher takes this list to a shelf, an order form, or a colleague. */
function downloadCsv(rows) {
  const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const head = [
    'Title',
    'Author',
    'Shelf',
    'Why it is here',
    'Readers it serves',
    'Where it is now',
  ]
  const body = rows.map((r) =>
    [
      r.title.title,
      r.title.author,
      r.title.genre,
      PICK_REASONS[r.reason].label,
      r.readers,
      r.title.holdings.map((h) => SOURCES[h.source].name).join('; '),
    ].map(cell),
  )
  const csv = [head.map(cell), ...body].map((line) => line.join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'classroom-recommendations.csv'
  a.click()
  URL.revokeObjectURL(url)
}

/* `onAddToList` / `listed` are additive: the Discover Lists prototype hangs a
   class Book List off this same shelf, because the moment a teacher decides a
   book belongs to the class is the moment they are looking at it here. Without
   them this renders exactly as it did. */
export function ClassRecommendations({ onOpenStudent, onAddToList, listed, listFull }) {
  const picks = classroomPicks()
  // The book panel is the school's — the title's whole picture is the same one
  // whichever screen you opened it from.
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
  const [q, setQ] = useState('')
  const [source, setSource] = useState('')
  // Which shape you left it in is where you are, so it survives a reload.
  const [view, setView] = useStickyState('cet:recs-view', 'cards')
  // A talk opened out of the book panel — SfR's own session panel, stacked over
  // the book rather than replacing it.
  const [openTalk, setOpenTalk] = useState(null)

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return picks.filter((p) => {
      if (source && !p.title.holdings.some((h) => h.source === source)) return false
      if (needle && !`${p.title.title} ${p.title.author}`.toLowerCase().includes(needle)) {
        return false
      }
      return true
    })
  }, [picks, q, source])

  const emptyState =
    q || source ? (
      <EmptyState
        title="Nothing matches those filters"
        description="Clear one of them to widen the list."
      />
    ) : (
      <EmptyState
        title="Nothing to suggest yet"
        description="The engine has not put anything in front of this class — check a reader's own Recommendations to see why."
      />
    )

  const columns = [
    {
      key: 'title',
      label: 'Title',
      minWidth: 240,
      render: (_, row) => (
        <div className="cet-book">
          <BookCover book={{ coverId: row.title.coverId, title: row.title.title }} size="sm" />
          <div className="cet-book-text">
            <span className="cet-book-name">{row.title.title}</span>
            <span className="cet-book-sub">
              {row.title.author} · {row.title.genre}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'readers',
      label: 'Readers it serves',
      align: 'right',
      render: (_, row) => row.readers,
    },
    {
      key: 'where',
      label: 'Where it is now',
      render: (_, row) => <HoldingPills holdings={row.title.holdings} />,
    },
    {
      key: 'open',
      label: '',
      align: 'right',
      width: onAddToList ? 92 : 56,
      /* The row already opens the panel; this says so. A table of books gives
         no other sign that a row is a thing you can look inside. */
      render: (_, row) => {
        const on = listed?.includes(row.title.id)
        return (
          <RowActions>
            {onAddToList && (
              <RowAction
                icon={on ? 'check' : 'bookmark'}
                label={
                  on
                    ? 'Take off the class Book List'
                    : listFull
                      ? 'The class list is full'
                      : 'Add to the class Book List'
                }
                disabled={!on && listFull}
                done={on}
                onClick={(e) => {
                  e?.stopPropagation?.()
                  onAddToList(row.title.id)
                }}
              />
            )}
            <RowAction
              icon="eye"
              label={`View ${row.title.title}`}
              onClick={() => setOpenTitle(row.title.id)}
            />
          </RowActions>
        )
      },
    },
  ]

  return (
    <div className="cet-class">
      <InfoBox
        title="Books the engine has recommended to this class"
        action={{ label: 'Download CSV', onClick: () => downloadCsv(rows) }}
      >
        Drawn from what they want and read — all of it already in a catalog you have.
      </InfoBox>

      <FilterBar
        compact
        action={
          <Tabs
            variant="pill"
            iconOnly
            active={view}
            onChange={setView}
            ariaLabel="How to show the list"
            items={[
              { id: 'cards', label: 'Covers', icon: <PlumpyIcon name="grid-view" size={20} /> },
              { id: 'list', label: 'List', icon: <PlumpyIcon name="list-view" size={20} /> },
            ]}
          />
        }
      >
        <FilterItem label="Search titles and authors">
          <SearchInput
            value={q}
            onChange={setQ}
            placeholder="Search titles and authors…"
            ariaLabel="Search titles and authors"
          />
        </FilterItem>
        <FilterItem label="Where it is">
          <Select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">All sources</option>
            {SOURCE_ORDER.map((id) => (
              <option key={id} value={id}>
                {SOURCES[id].name}
              </option>
            ))}
          </Select>
        </FilterItem>
      </FilterBar>

      {view === 'list' ? (
        <Table
          columns={columns}
          rows={rows}
          onRowClick={(row) => setOpenTitle(row.title.id)}
          getRowKey={(row) => row.title.id}
          empty={emptyState}
        />
      ) : rows.length ? (
        <TitleGrid>
          {rows.map((row) => (
            <TitleCard
              key={row.title.id}
              title={row.title}
              meta={`${row.readers} ${row.readers === 1 ? 'reader' : 'readers'}`}
              onOpen={() => setOpenTitle(row.title.id)}
              badge={
                onAddToList && (
                  <RowAction
                    icon={listed?.includes(row.title.id) ? 'check' : 'bookmark'}
                    label={
                      listed?.includes(row.title.id)
                        ? 'Take off the class Book List'
                        : listFull
                          ? 'The class list is full'
                          : 'Add to the class Book List'
                    }
                    disabled={!listed?.includes(row.title.id) && listFull}
                    done={listed?.includes(row.title.id)}
                    onClick={() => onAddToList(row.title.id)}
                  />
                )
              }
            />
          ))}
        </TitleGrid>
      ) : (
        emptyState
      )}

      <BookModal
        detail={openTitle ? classBookDetail(openTitle) : null}
        onClose={() => setOpenTitle(null)}
        hidden={hidden.has(openTitle)}
        onToggleHidden={toggleHidden}
        onOpenTitle={setOpenTitle}
        onOpenTalk={setOpenTalk}
        /* The panels stack — closing the profile puts you back on the book. */
        onOpenReader={(key, section = 'recommendations') => onOpenStudent?.(key, section)}
      />

      <TalkPanel talk={openTalk} onClose={() => setOpenTalk(null)} />
    </div>
  )
}
