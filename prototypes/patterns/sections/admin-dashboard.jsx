import { useState } from 'react'
import { SettingsPopover } from '../../admin-dashboard/components/SettingsPopover'
import { RcaLevelGlyph } from '../../admin-dashboard/components/RcaLevelGlyph'
import { CardGrid } from '../../admin-dashboard/components/CardGrid'
import { FixedRail } from '../../admin-dashboard/components/FixedRegions'
import { InfoBox } from '@components/InfoBox/InfoBox'
import {
  AdmStatTiles,
  AdmDailyTracker,
  AdmFlaggedSessions,
  AdmLeaderboardCombo,
  AdmQuestions,
  AdmQuickLinks,
} from '../../admin-dashboard/components/widgets'
import { Field, Select } from '@components/Form/Form'
import { Knobs, Variant } from './_shared'

// Every widget reads the tone tokens `.adm` declares and sizes itself against
// `.adm-cell`, which is the container its container queries key off — so a
// catalog example needs both, minus the page gutters and scroll container that
// the rest of `.adm` brings. `.adm-catalog` is that token half.
function Cell({ children, width, scroll = false }) {
  return (
    <div className="adm-catalog" style={width ? { maxWidth: width } : undefined}>
      <div className="adm-grid-card">
        <div className={`adm-cell${scroll ? ' adm-cell--scroll' : ''}`}>{children}</div>
      </div>
    </div>
  )
}

function SettingsPopoverDemo({ fields, defaults }) {
  const [value, setValue] = useState({ ...defaults })
  const [open, setOpen] = useState(false)
  const [anchorRect, setAnchorRect] = useState(null)

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 6,
          border: '1px solid #eaeaea',
          background: '#fff',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          color: '#424242',
        }}
        onClick={(e) => {
          setAnchorRect(e.currentTarget.getBoundingClientRect())
          setOpen((v) => !v)
        }}
      >
        ⚙ Widget settings
      </button>
      {open && (
        <SettingsPopover
          anchorRect={anchorRect}
          fields={fields}
          value={value}
          defaults={defaults}
          onChange={(patch) => setValue((v) => ({ ...v, ...patch }))}
          onReset={() => setValue({ ...defaults })}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}

const SELECT_FIELDS = [
  {
    key: 'scope',
    label: 'Show',
    type: 'select',
    options: [
      { value: 'community', label: 'Community Goal' },
      { value: 'district', label: 'District Goal' },
    ],
  },
]

const MULTI_FIELDS = [
  {
    key: 'selected',
    label: 'Show metrics',
    type: 'multi',
    max: 4,
    options: [
      { value: 'readers', label: 'Active Readers' },
      { value: 'minutes', label: 'Minutes Logged' },
      { value: 'books', label: 'Books Finished' },
      { value: 'sessions', label: 'Sessions' },
      { value: 'badges', label: 'Badges Earned' },
      { value: 'streak', label: 'Streak Days' },
    ],
  },
]

const RANGE_FIELDS = [
  {
    key: 'limit',
    label: 'Show top',
    type: 'range',
    min: 5,
    max: 15,
    step: 1,
  },
]

// The grid in edit mode, with two rows to drag between.
function CardGridDemo() {
  const [rows, setRows] = useState([['stat-tiles', 'flagged-sessions'], ['leaderboard-combo']])
  const render = (id) => (
    <div className={`adm-cell${id === 'stat-tiles' ? '' : ' adm-cell--scroll'}`}>
      {id === 'stat-tiles' ? (
        <AdmStatTiles role="teacher" />
      ) : id === 'flagged-sessions' ? (
        <AdmFlaggedSessions role="teacher" />
      ) : (
        <AdmLeaderboardCombo role="library" />
      )}
    </div>
  )
  return (
    <div className="adm-catalog">
      <CardGrid rows={rows} editing renderCard={render} onRowsChange={setRows} />
    </div>
  )
}

function RoleKnob({ value, onChange, roles = ['teacher', 'media', 'library'] }) {
  return (
    <Knobs>
      <Field label="role">
        <Select value={value} onChange={(e) => onChange(e.target.value)}>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </Field>
    </Knobs>
  )
}

function StatTilesDemo() {
  const [role, setRole] = useState('teacher')
  return (
    <>
      <RoleKnob value={role} onChange={setRole} roles={['teacher', 'media', 'library', 'empty']} />
      <Cell>
        <AdmStatTiles key={role} role={role} />
      </Cell>
    </>
  )
}

function TrackerDemo() {
  const [width, setWidth] = useState(0)
  return (
    <>
      <Knobs>
        <Field label="cell width">
          <Select value={String(width)} onChange={(e) => setWidth(Number(e.target.value))}>
            <option value="0">full width — the whole table</option>
            <option value="430">430px — the last four days</option>
          </Select>
        </Field>
      </Knobs>
      <Cell width={width || undefined}>
        <AdmDailyTracker role="teacher" />
      </Cell>
    </>
  )
}

export const adminDashboardSections = [
  {
    group: 'admin-dashboard',
    id: 'admin-dashboard-rca-level-glyph',
    name: 'RcaLevelGlyph',
    usage: `import { RcaLevelGlyph } from './RcaLevelGlyph'

<RcaLevelGlyph level="igniter" />
<RcaLevelGlyph level="trailblazer" size={44} />`,
    desc: (
      <>
        The engagement-level badge on the dashboard&rsquo;s Engagement card — circle, diamond,
        pentagon, hexagon, one per level, on a tile tinted from the shape&rsquo;s own colour. The
        four silhouettes and their fills are the shipped app&rsquo;s, lifted from{' '}
        <code>district_schools_table/Trailblazer-rct.svg</code> (the level-progress pill on the
        district Schools table) and re-centred on a 24&times;24 box. Admin Dashboard–specific —
        lives in <code>prototypes/admin-dashboard/components/</code>.
      </>
    ),
    render: () => (
      <div className="pt-variants pt-variants--4">
        {['spark', 'igniter', 'pathfinder', 'trailblazer'].map((level) => (
          <Variant key={level} label={level}>
            <RcaLevelGlyph level={level} />
          </Variant>
        ))}
      </div>
    ),
  },
  {
    group: 'admin-dashboard',
    id: 'admin-dashboard-settings-popover',
    name: 'SettingsPopover',
    desc: (
      <>
        An anchored popover for per-widget settings. Renders via React portal so it isn't clipped by{' '}
        <code>overflow: hidden</code> widget cells. Positions itself below + right-aligned to its
        anchor button, flipping above when viewport space is tight. Supports four field types:{' '}
        <code>select</code>, <code>multi</code> (checkboxes with optional <code>max</code> cap),{' '}
        <code>range</code> (slider), and <code>toggle</code>. Admin Dashboard–specific — lives in{' '}
        <code>prototypes/admin-dashboard/components/</code>.
      </>
    ),
    render: () => (
      <div className="pt-variants pt-variants--3">
        <Variant label="select">
          <SettingsPopoverDemo fields={SELECT_FIELDS} defaults={{ scope: 'community' }} />
        </Variant>
        <Variant label="multi (max 4)">
          <SettingsPopoverDemo
            fields={MULTI_FIELDS}
            defaults={{ selected: ['readers', 'minutes', 'books', 'sessions'] }}
          />
        </Variant>
        <Variant label="range">
          <SettingsPopoverDemo fields={RANGE_FIELDS} defaults={{ limit: 5 }} />
        </Variant>
      </div>
    ),
  },
  {
    group: 'admin-dashboard',
    id: 'adm-card-grid',
    name: 'CardGrid',
    usage: `import { CardGrid } from './components/CardGrid'

<CardGrid
  rows={rows}
  editing={editing}
  renderCard={renderCard}
  onRowsChange={setRows}
  isFullBleed={(id) => WIDGET_CATALOG[id]?.fixedWidth}
/>`,
    desc: (
      <>
        The dashboard itself — rows of widgets an admin rearranges by dragging. <code>rows</code> is
        an array of arrays, so a row is both the layout unit and the thing that decides width: one
        id in a row is full width, two are halves. Dragging onto a card swaps or pairs; dragging
        into the gap between rows (the insert zones) makes a new row, which is how a widget gets
        promoted to full width without a resize handle anywhere.
        <br />
        <br />
        Drag starts only after 6px of movement, so a click still reaches the settings cog and the
        toggles inside a card. <code>isFullBleed</code> marks the widgets that refuse to share a
        row.
      </>
    ),
    render: () => (
      <Variant label="edit mode — drag a card onto another, or into the gap between rows" ground>
        <CardGridDemo />
      </Variant>
    ),
  },
  {
    group: 'admin-dashboard',
    id: 'adm-stat-tiles',
    name: "What's Happened",
    usage: `import { AdmStatTiles } from './components/widgets'

<AdmStatTiles role={role} settings={{ selected: ['minutes', 'readers'], range: 'week' }} />`,
    desc: (
      <>
        The metric tiles — each one a number, what it counts, and a link to the report that explains
        it. The tiles are coloured by tone rather than by value, and the destination link pins to
        the tile&apos;s floor (<code>margin-top: auto</code>) so four tiles with different value
        lengths still line their links up on one baseline. Two tiles wrap to a 2&times;2 at any cell
        width; a lone odd tile stretches full width instead of leaving a hole.
        <br />
        <br />
        The <code>selected</code> setting is role-aware: the cog only lists tiles the current role
        can see, so a teacher is never offered &ldquo;Staff Minutes&rdquo;.
      </>
    ),
    render: () => <StatTilesDemo />,
  },
  {
    group: 'admin-dashboard',
    id: 'adm-daily-tracker',
    name: 'Daily Reading Tracker',
    usage: `import { AdmDailyTracker } from './components/widgets'

<AdmDailyTracker role="teacher" settings={{ group: 'class-a' }} />`,
    desc: (
      <>
        Who hit their daily goal, day by day. Alternating day columns are banded and the
        reader&apos;s name is fenced off behind a rule, so the eye can run down one day or across
        one reader without losing its place — there are no hairlines between rows, because twenty of
        them across ten columns made it a grid. The top three readers get a medal; everyone else
        gets a plain figure.
        <br />
        <br />
        Below ~620px of cell width it shows <em>less</em>, not smaller: Goal, Average and the first
        three days drop out and the last four days stay at full size. Only the marks shrink — a 26px
        check disc nearly touches its neighbours in a 44px column.
      </>
    ),
    render: () => <TrackerDemo />,
  },
  {
    group: 'admin-dashboard',
    id: 'adm-sessions-for-review',
    name: 'Sessions for Review',
    usage: `import { AdmFlaggedSessions } from './components/widgets'

<AdmFlaggedSessions role="teacher" />`,
    desc: (
      <>
        The dashboard&apos;s window onto the review queue. Two tabs, because Benny reports two
        things about a talk: what is worth celebrating and what is worth a closer look. A row
        carries a <em>count</em> per sentiment rather than one glyph per flag — four glyphs in a
        rail-width row is a puzzle, and the number is what you would have counted anyway. The list
        takes the body&apos;s remaining height and scrolls against the cell&apos;s own floor.
      </>
    ),
    render: () => (
      <Variant label="engagement / flagged">
        <Cell scroll>
          <AdmFlaggedSessions role="teacher" />
        </Cell>
      </Variant>
    ),
  },
  {
    group: 'admin-dashboard',
    id: 'adm-leaderboard',
    name: 'Leaderboard',
    usage: `import { AdmLeaderboardCombo } from './components/widgets'

<AdmLeaderboardCombo role="library" settings={{ entity: 'classes' }} />`,
    desc: (
      <>
        Top five, with the switch between what is being ranked kept inside the widget rather than in
        its settings — a shared <code>Tabs variant=&quot;pill&quot; block</code>, the same segmented
        control every view-switcher here uses. Ranks one to three take their metal; the rest are
        numbered on a plain ground. Which two rosters the toggle offers follows the role: classes
        and students for a school, branches and readers for a library.
      </>
    ),
    render: () => (
      <Variant label="top readers / branches">
        <Cell scroll>
          <AdmLeaderboardCombo role="library" />
        </Cell>
      </Variant>
    ),
  },
  {
    group: 'admin-dashboard',
    id: 'adm-questions',
    name: 'Number Cruncher',
    usage: `import { AdmQuestions } from './components/widgets'

<AdmQuestions role="teacher" settings={{ selected: ['q1', 'q2', 'q3', 'q4'] }} />`,
    desc: (
      <>
        The questions an admin actually asks the data, offered as rows instead of a report builder —
        &ldquo;which students have the most minutes read?&rdquo; is the query, and the row is the
        way to run it. Each row takes one of four hues in rotation with a Plumpy glyph on it, so a
        list of near-identical sentences still has somewhere for the eye to land. Picking which
        questions show is the whole of its settings.
      </>
    ),
    render: () => (
      <Variant label="four questions">
        <Cell scroll>
          <AdmQuestions role="teacher" />
        </Cell>
      </Variant>
    ),
  },
  {
    group: 'admin-dashboard',
    id: 'adm-quick-links',
    name: 'Quick Links',
    usage: `import { AdmQuickLinks } from './components/widgets'

<AdmQuickLinks settings={{ selected: ['classes', 'students'] }} />`,
    desc: (
      <>
        The destinations an admin keeps going back to, each in its own hue with a trailing chevron.
        It is the one widget whose content is entirely the admin&apos;s choice — with nothing picked
        it says so rather than rendering an empty card.
      </>
    ),
    render: () => (
      <Variant label="default set">
        <Cell>
          <AdmQuickLinks />
        </Cell>
      </Variant>
    ),
  },
  {
    group: 'admin-dashboard',
    id: 'adm-fixed-rail',
    name: 'FixedRail',
    usage: `import { FixedRail } from './components/FixedRegions'

<FixedRail role={role} settings={settings} updateSettings={…} resetSettings={…} />`,
    desc: (
      <>
        The right rail — the three cards an admin never rearranges, because they answer &ldquo;what
        should I do now?&rdquo; rather than &ldquo;how are we doing?&rdquo;. Quick Actions is a set
        of hue pills; Community Goal is the site&apos;s shared total against its target; Engagement
        is the school&apos;s level on the four-step ladder, carrying <code>RcaLevelGlyph</code>{' '}
        beside the level&apos;s name.
        <br />
        <br />
        Rail card heads sit at 52px where a grid card&apos;s is 62px — a grid head reserves room for
        a title <em>and</em> a meta line under it, and a rail head has only the title.
      </>
    ),
    render: () => (
      <Variant label="quick actions · community goal · engagement" ground>
        <div className="adm-catalog pt-adm-rail">
          <FixedRail role="teacher" settings={{}} />
        </div>
      </Variant>
    ),
  },
  {
    group: 'feedback',
    id: 'adm-feature-bar',
    name: 'InfoBox',
    usage: `import { InfoBox } from '@components/InfoBox/InfoBox'

<InfoBox title="[Webinar] What's New" action={{ label: 'Learn more', href: '#' }}>
  Join us Aug 12 at 2 PM ET.
</InfoBox>

<InfoBox
  title="…"
  action={{ label: 'Learn more', href: '#' }}
  readMore={{ label: 'Read more', href: '/blog' }}
  onDismiss={dismiss}
/>`,
    desc: (
      <>
        An announcement — a headline, a paragraph about it, and the way to act on it. It is the
        shared <code>Banner</code> at <code>level=&quot;info&quot;</code>, the app&apos;s own{' '}
        <code>.infobox</code> ground, so an announcement and an inline notice stay one chrome. What
        it adds is the announcement shape: a Plumpy glyph in place of the generic info circle, and
        up to two actions at the end of the bar.
        <br />
        <br />
        The icon and the actions centre against the whole box rather than against the title — an
        announcement runs to two or three lines, and the ends are the only fixed points it has.{' '}
        <code>action</code> is the thing to do; <code>readMore</code> is the quieter second, for
        when the bar can only summarise. Below 700px they take their own row rather than squeezing
        the message. The Admin Dashboard&apos;s FeatureBar is this with the dashboard&apos;s copy in
        it.
      </>
    ),
    render: () => (
      <>
        <Variant label="title, message, and one action" ground>
          <InfoBox title="[Webinar] What’s New for Back to School" action={{ label: 'Learn more' }}>
            Discover the latest Beanstack features — Book Talks with Benny, daily reading tracking,
            rewards, editable badges &amp; more! Join us Aug 12 at 2 PM ET.
          </InfoBox>
        </Variant>
        <Variant label="two actions + dismiss" ground>
          <InfoBox
            title="Roster sync finished"
            /* The pack's own name. `attendance` is this glyph's *Icons8* asset
               name, which the gallery prints under it — easy to copy, and it
               is not what `PlumpyIcon` answers to. */
            icon="client-success"
            action={{ label: 'Learn more' }}
            readMore={{ label: 'Read more' }}
            onDismiss={() => {}}
          >
            412 readers were added and 18 were archived.
          </InfoBox>
        </Variant>
        <Variant label="message only — no title" ground>
          <InfoBox action={{ label: 'Learn more' }}>
            Benny now runs an integrity check when a reader logs more than the site&apos;s warning
            level allows.
          </InfoBox>
        </Variant>
      </>
    ),
  },
]
