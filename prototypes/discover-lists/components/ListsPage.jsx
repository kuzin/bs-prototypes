import { Icon } from '@components/Icon/Icon'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { SectionCardTitle } from '@components/SectionCard/SectionCard'
import { Button } from '@components/Button/Button'
import { Table } from '@components/Table/Table'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import { FilterBar, FilterItem } from '@components/FilterBar/FilterBar'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { Select } from '@components/Form/Form'
import { Pill } from '@components/Pill/Pill'
import { Toggle } from '@components/Toggle/Toggle'
import { BookCover } from '@components/BookCover/BookCover'
import { PartnerMark } from '@components/PartnerBrand/PartnerBrand'
import { EmptyState, Banner, Tooltip } from '@components/Primitives/Primitives'
import { useStickyState } from '@components/useStickyState/useStickyState'
import '@components/Button/Button.css'
import '@components/SectionCard/SectionCard.css'
import '@components/Table/Table.css'
import '@components/RowAction/RowAction.css'
import '@components/FilterBar/FilterBar.css'
import '@components/SearchInput/SearchInput.css'
import '@components/Form/Form.css'
import '@components/Pill/Pill.css'
import '@components/Toggle/Toggle.css'
import '@components/BookCover/BookCover.css'
import '@components/PartnerBrand/PartnerBrand.css'
import '@components/Primitives/Primitives.css'

import { canEdit, gradeRange, isLocked, isSlot, resolveBooks } from '../data'

/* The real index row leads with the list's own art (`.reading-list-row-image`,
   from the `reading_list_image` the form uploads). A list's art here is the
   list: three of its jackets overlapped, which is what you recognise a shelf
   you built by — and unlike an uploaded banner it is never out of date with
   what is actually on it. */
const STRIP = 3

function ListArt({ list }) {
  const books = resolveBooks(list.books).slice(0, STRIP)
  if (!books.length) return <span className="dl-strip dl-strip--empty" aria-hidden="true" />
  return (
    <span className="dl-strip">
      {books.map((b) => (
        <BookCover key={b.id} book={b} size="sm" />
      ))}
    </span>
  )
}

/**
 * The site's Discover order — a media specialist's screen.
 *
 * The real Book Lists index is a table of names with a Show? column and a row
 * of buttons (`new_admin/reading_lists/_created_by_us.html.haml`: Preview /
 * Edit Book List / Add/Remove Books / Delete). That anatomy is kept; what this
 * adds is the order, because a Discover list is a shelf and a shelf falls
 * somewhere.
 *
 * A classroom list is not managed here. A teacher keeps one per class, on that
 * class's own page — so in this order it is a single row saying *where* the
 * reader's classroom list falls, with nothing to open: which books land there
 * is the teacher's call and differs from reader to reader.
 */
export function ListsPage({ role, lists, onOpen, onCreate, onToggleActive, onMove, onPreview }) {
  const [q, setQ] = useStickyState('dl:q', '')
  const [shown, setShown] = useStickyState('dl:shown', '')

  const matches = (l) =>
    (!q.trim() ||
      `${l.name} ${l.keywords ?? ''} ${l.ownerName ?? ''}`
        .toLowerCase()
        .includes(q.trim().toLowerCase())) &&
    (!shown || (shown === 'on' ? l.active : !l.active))

  // The site's running order, with the classroom slot sitting in it.
  const order = lists
    .filter((l) => isSlot(l) || l.scope === 'site')
    .filter((l) => isSlot(l) || matches(l))

  return (
    <>
      <PageHeader
        title="Book Lists"
        subtitle="The lists readers browse on Discover."
        actions={
          role.ownOnly ? undefined : <Button onClick={() => onCreate(null)}>Create a list</Button>
        }
      />

      {/* The one line that says what this role may do, rather than a set of
          controls that quietly aren't there. */}
      <Banner level="info" className="dl-rolenote">
        {role.note}
      </Banner>

      <FilterBar compact>
        <FilterItem label="Search lists">
          <SearchInput
            value={q}
            onChange={setQ}
            placeholder="Search lists and keywords…"
            ariaLabel="Search lists and keywords"
          />
        </FilterItem>
        <FilterItem label="On Discover">
          <Select value={shown} onChange={(e) => setShown(e.target.value)}>
            <option value="">Shown and hidden</option>
            <option value="on">Shown</option>
            <option value="off">Hidden</option>
          </Select>
        </FilterItem>
      </FilterBar>

      <section className="dl-group">
        <SectionCardTitle>In the order readers meet them</SectionCardTitle>
        <ListTable
          rows={order}
          all={lists}
          role={role}
          onOpen={onOpen}
          onToggleActive={onToggleActive}
          onMove={onMove}
          onPreview={onPreview}
          empty={
            <EmptyState
              icon={<Icon name="clipboard-list" size={26} />}
              title={q || shown ? 'No lists match' : 'No site-wide lists yet'}
              description={
                q || shown
                  ? 'Nothing here fits those filters. Clear one to see more.'
                  : 'A list is a shelf on Discover. Build one and it shows up for the grades you picked.'
              }
            />
          }
        />
      </section>
    </>
  )
}

/* One table, two kinds of row: a real list, and the classroom slot — a row
   whose only property is where it falls. */
function ListTable({ rows, all, role, onOpen, onToggleActive, onMove, onPreview, empty }) {
  const columns = [
    {
      key: 'name',
      label: 'List',
      minWidth: 220,
      render: (_, l) =>
        isSlot(l) ? (
          <div className="dl-namecell dl-namecell--slot">
            <span className="dl-strip dl-strip--slot" aria-hidden="true">
              <Icon name="users" size={18} />
            </span>
            <div className="dl-nametext">
              <span className="dl-name">{l.name}</span>
              <span className="dl-sub">Whichever list their class keeps, if it keeps one</span>
            </div>
          </div>
        ) : (
          <div className="dl-namecell">
            <ListArt list={l} />
            <div className="dl-nametext">
              <span className="dl-name">
                {l.name}
                {l.partner && <PartnerMark id={l.partner} size={16} />}
              </span>
              <span className="dl-sub">
                {l.external
                  ? 'Lives on another site'
                  : `${l.books.length} ${l.books.length === 1 ? 'book' : 'books'}`}
                {' · '}
                {l.ownerName}
              </span>
            </div>
          </div>
        ),
    },
    {
      key: 'grades',
      label: 'Grades',
      minWidth: 118,
      render: (_, l) =>
        isSlot(l) ? (
          <span className="dl-muted">Their own</span>
        ) : (
          <span className="dl-muted">{gradeRange(l.grades)}</span>
        ),
    },
    {
      key: 'active',
      label: 'On Discover',
      width: 96,
      align: 'center',
      render: (_, l) => {
        if (isSlot(l)) return <span className="dl-muted">Per class</span>
        /* A partner's list is part of the subscription — there is no state of
           the site where it is off, so there is no switch for it. */
        if (isLocked(l))
          return (
            <Tooltip content="Included with your subscription — it can’t be turned off">
              <span className="dl-locked">
                <Icon name="lock" size={13} />
                Always on
              </span>
            </Tooltip>
          )
        return canEdit(role, l) ? (
          <Toggle checked={l.active} onChange={() => onToggleActive(l.id)} />
        ) : (
          <span className="dl-muted">{l.active ? 'Shown' : 'Hidden'}</span>
        )
      },
    },
    {
      key: 'actions',
      label: '',
      width: 132,
      align: 'right',
      render: (_, l) => {
        const i = all.indexOf(l)
        const slot = isSlot(l)
        const locked = isLocked(l)
        const mine = canEdit(role, l)
        return (
          <RowActions>
            {role.canOrder && (
              <>
                <RowAction
                  icon="chevron-up"
                  label="Move up"
                  disabled={i <= 0}
                  onClick={() => onMove(l.id, -1)}
                />
                <RowAction
                  icon="chevron-down"
                  label="Move down"
                  disabled={i < 0 || i === all.length - 1}
                  onClick={() => onMove(l.id, 1)}
                />
              </>
            )}
            {/* A slot has nothing behind it to open or preview — it is a
                position, and the row already says so. */}
            {/* A locked list has one thing you can do to it: look at it. The
                preview *is* the list — every book on it, as a reader meets it
                — so a second control that opened a form nobody can fill in was
                the same action twice over. */}
            {!slot && (
              <RowAction icon="eye" label="Preview on Discover" onClick={() => onPreview(l.id)} />
            )}
            {!slot && !locked && (
              <RowAction
                icon={mine ? 'pencil' : 'list-view'}
                label={mine ? 'Edit list' : 'View list'}
                onClick={() => onOpen(l.id)}
              />
            )}
          </RowActions>
        )
      },
    },
  ]

  return (
    <Table
      columns={columns}
      rows={rows}
      scrollX
      getRowKey={(l) => l.id}
      /* The slot has nothing behind it and a locked list has nothing to
         open — for those two the row is a row. */
      onRowClick={(l) => !isSlot(l) && !isLocked(l) && onOpen(l.id)}
      empty={empty}
    />
  )
}
