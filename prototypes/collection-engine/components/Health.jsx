import { Icon } from '@components/Icon/Icon'
import { ChartCard, CardNote } from '@components/Cards/Cards'
import { Table } from '@components/Table/Table'
import { Pill } from '@components/Pill/Pill'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { PartnerMark } from '@components/PartnerBrand/PartnerBrand'
import { Tooltip } from '@components/Primitives/Primitives'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import '@components/RowAction/RowAction.css'
import { BeanstackLogo } from '@components/BeanstackLogo/BeanstackLogo'
import '@components/Primitives/Primitives.css'
import '@components/Table/Table.css'
import '@components/Pill/Pill.css'
import '@components/ProgressBar/ProgressBar.css'
import '@components/PartnerBrand/PartnerBrand.css'
import '@components/BeanstackLogo/BeanstackLogo.css'

import { HEALTH, GENRE_VERDICT, TITLE_STATUS, TITLE_STATUS_ORDER } from '../derive'
import { HoldingPills, TitleCell } from './Bits'
import './Health.css'

/** Red, yellow or green — the one word a health read comes down to. */
export function HealthPill({ level, size = 'sm', showIcon = true }) {
  const h = HEALTH[level]
  return (
    <Pill
      color={h.color}
      size={size}
      icon={showIcon ? <Icon name={h.icon} size={13} stroke={2.2} /> : undefined}
    >
      {h.label}
    </Pill>
  )
}

/* Each level as one of the app's own note tones — the same boxes the
   admin uses for an error, an alert and a success. */
const VERDICT_TONE = { red: 'error', yellow: 'warning', green: 'success' }

/**
 * The verdict at the top of a health card, as the app's own tinted note: the
 * tone and its glyph say the colour, the line says what it means, and the pill
 * at the right edge names it. The note already carries the glyph, so the pill
 * drops its own; it sits on white so it doesn't sink into the tint.
 */
export function HealthVerdict({ level, line }) {
  return (
    <div className="ceh-verdict-note">
      <CardNote tone={VERDICT_TONE[level]}>
        <span className="ceh-verdict-note-row">
          <span>{line}</span>
          <HealthPill level={level} size="md" showIcon={false} />
        </span>
      </CardNote>
    </div>
  )
}

/**
 * The collection's health: the verdict in one line, then the four signals it
 * comes from as a checklist — each a figure in its own colour, pressing
 * through to where you would act on it. What the collection is good
 * at closes the card, as a row of genres rather than a sentence.
 *
 * `onOpen(target)` takes a signal's `target` — `gaps`, `requests`, `never` —
 * and the host decides where that goes.
 */
export function HealthCard({ health, title = 'Collection Health', onOpen }) {
  return (
    <ChartCard
      title={title}
      accent={health.color}
      bodyPad="padded"
      info="Set by collection gaps and readers running low on books."
    >
      <div className="ceh">
        {/* One column: the verdict, the whole collection as one bar, then
            what the verdict is made of — a checklist rather than more tiles,
            since the page above already carries a row of them. */}
        <div className="ceh-verdict">
          <HealthVerdict level={health.level} line={health.line} />

          {/* The whole collection in one bar: what has been read off a
              recommendation, what was recommended and left, and what has
              never come up. The page's tiles quote two of these; this is the
              three together, as parts of one shelf. */}
          <div
            className="ceh-shelf-bar"
            style={{
              gridTemplateColumns: TITLE_STATUS_ORDER.filter((id) => health.reach[id])
                .map((id) => `${health.reach[id]}fr`)
                .join(' '),
            }}
            aria-label={TITLE_STATUS_ORDER.map(
              (id) => `${health.reach[id]} ${TITLE_STATUS[id].label.toLowerCase()}`,
            ).join(', ')}
          >
            {TITLE_STATUS_ORDER.filter((id) => health.reach[id]).map((id) => (
              <Tooltip
                key={id}
                className="ceh-shelf-seg"
                followCursor
                content={`${health.reach[id].toLocaleString()} of ${health.reach.total.toLocaleString()} titles ${TITLE_STATUS[id].label.toLowerCase()}`}
              >
                <span style={{ background: SHELF_COLOR[id] }} />
              </Tooltip>
            ))}
          </div>
        </div>

        <ul className="ceh-checks">
          {health.signals.map((sig) => {
            const h = HEALTH[sig.level]
            const go = sig.target && onOpen ? () => onOpen(sig.target) : null
            const Tag = go ? 'button' : 'div'
            return (
              <li key={sig.id}>
                <Tag
                  type={go ? 'button' : undefined}
                  className={`ceh-check${go ? ' ceh-check--link' : ''}`}
                  onClick={go ?? undefined}
                >
                  <Icon name={h.icon} size={18} stroke={2.2} color={h.color} />
                  <span className="ceh-check-label">{sig.label}</span>
                  <span className="ceh-check-value" style={{ color: h.color }}>
                    {sig.value}
                  </span>
                  <span className="ceh-check-chev">
                    {go && <Icon name="chevron-right" size={16} stroke={2.4} />}
                  </span>
                </Tag>
              </li>
            )
          })}
        </ul>
        {health.caveat && (
          <span className="ceh-caveat">
            <Icon name="info" size={14} stroke={2} />
            {health.caveat}
          </span>
        )}
      </div>
    </ChartCard>
  )
}

/* The bar's own palette: one hue in two strengths for recommended (read, then
   not yet read), and a pale grey for what has never come up — so the bar reads
   as how far the engine has reached into the shelf, not as three verdicts. */
const SHELF_COLOR = { read: '#0BA85F', unread: '#9ED9BB', never: '#DEDEDE' }

const GENRE_ROW = {
  gap: { kind: 'Outgrown', icon: 'alert-triangle', color: HEALTH.yellow.color },
  strength: { kind: 'Strong', icon: 'circle-check', color: HEALTH.green.color },
  ok: { kind: 'Covered', icon: 'point-filled', color: '#ACACAC' },
}
const GENRE_ORDER = { gap: 0, strength: 1, ok: 2 }

/**
 * The genres a collection has outgrown or is strong in, as the same ruled
 * checklist Collection Health uses — outgrown first — each with its status as
 * a pill. Covered genres, and the figures behind all of them, are one link
 * away in the header.
 */
export function GenreHealthCard({
  genres,
  limit = 8,
  onSeeAll,
  title = 'Genre Health',
  // `district`: each genre carries `schools`, and the pill and line say how
  // many buildings it holds in.
  scope = 'school',
}) {
  const rows = genres
    .filter((g) => g.verdict !== 'ok')
    .sort(
      (a, b) =>
        GENRE_ORDER[a.verdict] - GENRE_ORDER[b.verdict] ||
        (b.schools ?? 0) - (a.schools ?? 0) ||
        b.into - a.into,
    )
    .slice(0, limit)
  // The one-line read of the genres, and the same red/yellow/green the
  // Collection Health checklist gives its "Genre outgrown" row.
  const gaps = genres.filter((g) => g.verdict === 'gap').length
  const strong = genres.filter((g) => g.verdict === 'strength').length
  const level = gaps === 0 ? 'green' : gaps <= 3 ? 'yellow' : 'red'
  const where = scope === 'district' ? ' in at least one school' : ''
  const line = `${gaps ? `${gaps} of ${genres.length} genres ${gaps === 1 ? 'has' : 'have'} been outgrown${where}` : `None of ${genres.length} genres has been outgrown${where}`}${strong ? `, and ${strong} ${strong === 1 ? 'is' : 'are'} strong` : ''}.`
  const pillText = (g, kind) =>
    scope === 'district'
      ? `${kind} at ${g.schools} ${g.schools === 1 ? 'school' : 'schools'}`
      : kind
  return (
    <ChartCard
      title={title}
      accent="#0BA85F"
      bodyPad="padded"
      action={onSeeAll ? { label: 'See all genres', onClick: onSeeAll } : undefined}
    >
      <div className="ceh">
        <HealthVerdict level={level} line={line} />
        <ul className="ceh-checks">
          {rows.map((g) => {
            const row = GENRE_ROW[g.verdict]
            return (
              <li key={g.genre}>
                <div className="ceh-check ceh-check--flush">
                  <Icon name={row.icon} size={18} stroke={2.2} color={row.color} />
                  <span className="ceh-check-label">{g.label}</span>
                  <Pill color={row.color === '#ACACAC' ? '#767676' : row.color} size="sm">
                    {pillText(g, row.kind)}
                  </Pill>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </ChartCard>
  )
}

/**
 * The district at a glance: which schools are healthy and which aren't. The
 * status line on top, then every school under its colour — worst group first —
 * each with the one figure it is judged on, its collection gaps.
 */
export function DistrictHealthCard({ health, rows, title = 'District Collection Health' }) {
  const groups = ['red', 'yellow', 'green']
    .map((level) => ({ level, schools: rows.filter((r) => r.health.level === level) }))
    .filter((g) => g.schools.length)
  return (
    <ChartCard title={title} accent={health.color} bodyPad="padded">
      <div className="ceh">
        <HealthVerdict level={health.level} line={health.line} />
        {groups.map((g) => {
          const h = HEALTH[g.level]
          return (
            <div key={g.level} className="ceh-group" style={{ '--ceh-c': h.color }}>
              <div className="ceh-group-head">
                <span className="ceh-group-icon">
                  <Icon name={h.icon} size={16} stroke={2.4} />
                </span>
                <span className="ceh-group-label">{h.label}</span>
                <Pill color={h.color} size="sm">
                  {g.schools.length} {g.schools.length === 1 ? 'school' : 'schools'}
                </Pill>
              </div>
              <ul className="ceh-checks">
                {g.schools.map((r) => (
                  <li key={r.id}>
                    <div className="ceh-check ceh-check--flush">
                      <Icon name={h.icon} size={18} stroke={2.2} color={h.color} />
                      <span className="ceh-check-label">{r.name}</span>
                      <span className="ceh-check-meta">
                        {r.health.gapCount} collection {r.health.gapCount === 1 ? 'gap' : 'gaps'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </ChartCard>
  )
}

/** A catalog's mark, or Beanstack's for the Classroom Library Connector it owns. */
function SourceName({ source }) {
  return (
    <span className="ceh-src">
      <span className="ceh-src-mark">
        {source.brand ? (
          <PartnerMark id={source.brand} size={24} />
        ) : (
          <BeanstackLogo variant="mark" size={24} />
        )}
      </span>
      {source.name}
    </span>
  )
}

/**
 * One catalog — or one format — against the others, on the same four figures:
 * how much of it there is, how much of it the engine has put in front of a
 * reader, how often that ended in a read, and how much of it has never come up.
 * The bar is the share recommended, because "is this collection being reached"
 * is the question the comparison is for.
 */
export function CompareTable({ rows, kind = 'source' }) {
  const name = (r) =>
    kind === 'source' ? (
      <SourceName source={r.source} />
    ) : (
      <span className="ceh-src">
        <span className="ceh-dot" style={{ background: r.format.color }} />
        {r.format.label}
      </span>
    )
  return (
    <Table
      flush
      scrollX
      columns={[
        {
          key: 'name',
          label: kind === 'source' ? 'Collection' : 'Format',
          render: (_, r) => name(r),
        },
        {
          key: 'total',
          label: 'Titles',
          align: 'right',
          render: (_, r) => r.total.toLocaleString(),
        },
        {
          key: 'rec',
          label: 'Recommended',
          width: 160,
          render: (_, r) => (
            <ProgressBar
              inline
              size="sm"
              value={r.recommendedPct}
              color={kind === 'source' ? r.source.color : r.format.color}
              valueLabel={`${Math.round(r.recommendedPct)}%`}
            />
          ),
        },
        {
          key: 'read',
          label: 'Then read',
          align: 'right',
          render: (_, r) => r.read.toLocaleString(),
        },
        {
          key: 'rate',
          label: 'Read per suggestion',
          align: 'right',
          render: (_, r) => <strong>{r.readPct}%</strong>,
        },
        {
          key: 'never',
          label: 'Never recommended',
          align: 'right',
          render: (_, r) => r.never.toLocaleString(),
        },
      ]}
      rows={rows}
      getRowKey={(r) => r.key}
    />
  )
}

/**
 * Every connected classroom shelf, ranked. The ranking figure is the share of
 * the shelf that has been read off a recommendation — a teacher's question is
 * whether their books are being used, not how busy the engine is.
 */
export function ClassroomBoard({ rows }) {
  return (
    <Table
      flush
      scrollX
      columns={[
        {
          key: 'rank',
          label: '#',
          width: 44,
          render: (_, r) => <span className="ceh-rank">{rows.indexOf(r) + 1}</span>,
        },
        {
          key: 'teacher',
          label: 'Classroom',
          render: (_, r) => (
            <div className="ce-title-text">
              <span className="ce-title-name">{r.room.teacher}</span>
              <span className="ce-title-sub">
                {r.room.grade} · {r.room.room}
              </span>
            </div>
          ),
        },
        { key: 'total', label: 'Titles on the shelf', align: 'right', render: (_, r) => r.total },
        {
          key: 'working',
          label: 'Read off a recommendation',
          width: 210,
          render: (_, r) => (
            <ProgressBar
              inline
              size="sm"
              value={r.workingPct}
              color={HEALTH[r.level].color}
              valueLabel={`${r.read} of ${r.total}`}
            />
          ),
        },
        {
          key: 'never',
          label: 'Never recommended',
          align: 'right',
          render: (_, r) => r.never,
        },
        {
          key: 'open',
          label: '',
          align: 'right',
          width: 56,
          /* Inert on purpose: a classroom's own library page exists for one
             room only (the Teacher prototype), so the control says where it
             would go without pretending the other ten are built. */
          render: () => (
            <RowActions>
              <RowAction icon="classroom" label="View classroom library" onClick={() => {}} />
            </RowActions>
          ),
        },
      ]}
      rows={rows}
      getRowKey={(r) => r.room.id}
    />
  )
}

/**
 * Supply against demand, a genre to a row: gaps first, then strengths, then
 * everything that is simply covered. `scope="district"` swaps the one-school
 * columns for how many buildings are short of it.
 */
export function GenreTable({ rows, scope = 'school', onPick }) {
  const order = { gap: 0, strength: 1, ok: 2 }
  const sorted = [...rows].sort(
    (a, b) => order[a.verdict] - order[b.verdict] || b.perTitle - a.perTitle,
  )
  // Short headers on purpose: six figures across a content column, and the
  // verdict rides with the genre's name so it can't scroll out of view.
  const cols = [
    {
      key: 'genre',
      label: 'Genre',
      render: (_, g) => (
        <span className="ceh-genre">
          <span className="ce-title-name">{g.label}</span>
          {g.verdict !== 'ok' && (
            <Pill color={GENRE_VERDICT[g.verdict].color} size="sm">
              {GENRE_VERDICT[g.verdict].label}
            </Pill>
          )}
        </span>
      ),
    },
    {
      key: 'into',
      label: 'Readers into it',
      align: 'right',
      render: (_, g) => g.into.toLocaleString(),
    },
    {
      key: 'titles',
      label: 'Titles',
      align: 'right',
      render: (_, g) => (
        <span className={g.verdict === 'gap' ? 'ce-bad' : undefined}>{g.titles}</span>
      ),
    },
    {
      key: 'per',
      label: 'Readers per title',
      align: 'right',
      render: (_, g) => g.perTitle,
    },
  ]
  if (scope === 'school') {
    cols.push({
      key: 'top',
      label: 'Top 3 take',
      align: 'right',
      render: (_, g) => `${Math.round(g.topShare)}%`,
    })
  } else {
    cols.push({
      key: 'at',
      label: 'Short at',
      align: 'right',
      render: (_, g) =>
        g.gapAt.length ? (
          <span title={g.gapAt.join(', ')}>
            {g.gapAt.length} {g.gapAt.length === 1 ? 'school' : 'schools'}
          </span>
        ) : (
          <span className="ce-dim">None</span>
        ),
    })
  }
  cols.push({
    key: 'rate',
    label: 'Read rate',
    align: 'right',
    render: (_, g) => `${g.readPct}%`,
  })
  return (
    <Table
      scrollX
      columns={cols}
      rows={sorted}
      getRowKey={(g) => g.genre}
      rowClassName={(g) => `ceh-row--${g.verdict}`}
      onRowClick={onPick ? (g) => onPick(g.genre) : undefined}
      pageSize={12}
    />
  )
}

/**
 * The titles the engine put in front of readers most, with the catalogs that
 * carry each — so a librarian can see which collection is doing the lifting.
 */
export function TopTitlesTable({ rows, onOpen }) {
  return (
    <Table
      flush
      scrollX
      columns={[
        {
          key: 'rank',
          label: '#',
          width: 44,
          render: (_, s) => <span className="ceh-rank">{rows.indexOf(s) + 1}</span>,
        },
        { key: 'title', label: 'Title', render: (_, s) => <TitleCell title={s.title} /> },
        {
          key: 'where',
          label: 'Collection',
          render: (_, s) => <HoldingPills holdings={s.title.holdings} />,
        },
        { key: 'suggested', label: 'Shown', align: 'right', render: (_, s) => s.suggested },
        { key: 'logged', label: 'Read', align: 'right', render: (_, s) => s.logged },
        {
          key: 'open',
          label: '',
          align: 'right',
          width: 56,
          render: (_, s) =>
            onOpen ? (
              <RowActions>
                <RowAction icon="eye" label="View title" onClick={() => onOpen(s.title.id)} />
              </RowActions>
            ) : null,
        },
      ]}
      rows={rows}
      getRowKey={(s) => s.title.id}
      onRowClick={onOpen ? (s) => onOpen(s.title.id) : undefined}
    />
  )
}

/** A title's suggested action, as a pill, with its reason on hover. */
export function ActionPill({ action }) {
  if (!action) return null
  return (
    <span title={action.reason}>
      <Pill color={action.color} size="sm">
        {action.short}
      </Pill>
    </span>
  )
}
