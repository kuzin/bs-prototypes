import { PageHeader } from '@components/PageHeader/PageHeader'
import { StatCard, ChartCard } from '@components/Cards/Cards'
import { TrendChart } from '@components/TrendChart/TrendChart'
import { ChartLegend } from '@components/charts/charts'
import { BarList } from '@components/BarList/BarList'
import { BookCover } from '@components/BookCover/BookCover'
import { CoverShelf, CoverShelfItem } from '@components/CoverShelf/CoverShelf'
import { Tabs } from '@components/Tabs/Tabs'
import { useStickyState } from '@components/useStickyState/useStickyState'
import { InfoBox } from '@components/InfoBox/InfoBox'
import { BennySummary } from './BennySummary'
import '@components/BarList/BarList.css'
import '@components/Tabs/Tabs.css'
import '@components/BookCover/BookCover.css'
import '@components/InfoBox/InfoBox.css'

import { TODAY } from '../data'
import {
  funnel,
  funnelBySurface,
  discovered,
  deadShelf,
  freshness,
  monthly,
  mostSuggested,
  pushedNotTaken,
  bennySchool,
} from '../derive'

/**
 * A shelf of covers, the way the profile's "Latest titles" reads: the art is
 * the row, the one number the card is about rides on each cover, and the rail
 * pages rather than stacking ten table rows in a half-width card. A librarian
 * scanning what the engine is pushing recognises books by their jackets long
 * before they read a title.
 */
function TitleShelf({ title, accent, info, rows, badge, onOpen }) {
  return (
    <ChartCard title={title} accent={accent} info={info} bodyPad="padded">
      <CoverShelf>
        {rows.map((s) => (
          <CoverShelfItem
            key={s.title.id}
            title={`${s.title.title} — ${s.title.author}`}
            badge={badge(s)}
            onClick={() => onOpen(s.title.id)}
          >
            <BookCover book={{ coverId: s.title.coverId, title: s.title.title }} size="fill" />
          </CoverShelfItem>
        ))}
      </CoverShelf>
    </ChartCard>
  )
}

export function SchoolOverview({ school, onNavigate }) {
  const f = funnel(school.events)
  const bySurface = funnelBySurface(school.events)
  const found = discovered(school).filter((s) => s.logged > 0)
  const dead = deadShelf(school)
  const fresh = freshness(school)
  const months = monthly(school.events)
  const pushed = mostSuggested(school)
  const missed = pushedNotTaken(school)
  const [tab, setTab] = useStickyState('ce:overview-tab', 'titles')

  // A rounded ceiling rather than the leader: scaling to the top bar makes it
  // full-width and the rest near-full, which reads as four identical rows. The
  // four surfaces really are close, and the chart should say that.
  const maxSurface = Math.ceil(Math.max(...bySurface.map((s) => s.savedPct)) / 10) * 10

  return (
    <>
      <PageHeader title="Collection Engine" />

      {fresh.problems > 0 && (
        <InfoBox
          level={fresh.staleDays > 30 || !fresh.asOf ? 'warning' : 'info'}
          title={
            fresh.asOf
              ? `The library catalog is ${fresh.staleDays} days old`
              : 'The library catalog has never synced'
          }
          action={{ label: 'Go to Setup', onClick: () => onNavigate('setup') }}
        >
          Anything weeded, lost or added since then is still being recommended — or still invisible.
        </InfoBox>
      )}

      {/* The read of the collection leads the page — the tiles under it are
          the figures it is quoting. */}
      <BennySummary summary={bennySchool(school)} asOf={TODAY} />

      <div className="ce-stats">
        <StatCard
          icon="books"
          value={school.catalog.length}
          label="Titles in your catalogs"
          color="#0BA85F"
        />
        <StatCard
          icon="trending-up"
          value={f.loggedPct}
          unit="%"
          label="Suggested, then read"
          color="#0F766E"
        />
        <StatCard
          icon="clock"
          value={dead.length}
          label="Titles not found"
          color="#D97706"
          onClick={() => onNavigate('collection')}
        />
        <StatCard
          icon="circle-check"
          value={found.length}
          label="Titles put back to work"
          color="#0BA85F"
        />
      </div>

      {/* Six cards down one column was a page you scroll rather than read. Two
          tabs, split by the question each half answers: which titles the engine
          is pushing, and how the pushing is going. The tiles stay above both,
          because they describe the collection whichever half you are on. */}
      <div className="ce-panel">
        <Tabs
          active={tab}
          onChange={setTab}
          variant="pill"
          ariaLabel="Overview views"
          items={[
            { id: 'titles', label: 'Titles' },
            { id: 'trends', label: 'How it is landing' },
          ]}
        />
      </div>

      {tab === 'trends' && (
        <ChartCard title="Where suggestions land" accent="#196DD5" bodyPad="padded">
          {/* The bar is the saved rate, not the volume — the card is asking
            which surface works, and volume only says which one the reader
            passes most often. The count rides along underneath. */}
          <BarList
            header={{ label: 'Surface', valueLabel: 'Saved' }}
            labelWidth={190}
            items={bySurface.map((s) => ({
              label: s.label,
              sublabel: `${s.suggested.toLocaleString()} suggestions`,
              value: s.savedPct,
              max: maxSurface,
              color: s.color,
              valueLabel: `${s.savedPct}%`,
            }))}
          />
        </ChartCard>
      )}

      {/* The two ends of the engine's own output: what it pushed hardest, and
          what it pushed hardest *at nobody*. The first is the picture of what
          the collection is doing; the second is the only list on this page
          about the recommender being wrong rather than the shelves. */}
      {/* One shelf per row, not two across: a cover rail is a row you page
          through, and at half width each one showed four jackets and a sliver.
          Full width, the ten are two swipes rather than three. */}
      {tab === 'titles' && (
        <div className="ce-stack">
          <TitleShelf
            title="Top 10 titles suggested"
            accent="#196DD5"
            rows={pushed}
            badge={(s) => `${s.suggested} shown`}
            onOpen={() => onNavigate('collection')}
          />

          <TitleShelf
            title="Suggested most, taken least"
            accent="#D97706"
            info="Titles shown at least eight times. Ranked by how rarely a reader did anything with one — the engine's own misses, not the shelves'."
            rows={missed}
            badge={(s) => `${Math.round(s.rate * 100)}% taken`}
            onOpen={() => onNavigate('collection')}
          />
        </div>
      )}

      {tab === 'trends' && (
        <ChartCard
          title="The year, month by month"
          accent="#0F766E"
          bodyPad="padded"
          footer={
            <ChartLegend
              items={[
                { color: '#0F766E', label: 'Wish listed' },
                { color: '#0BA85F', label: 'Logged as read' },
                { color: '#B43DD0', label: 'Read per suggestion', dashed: true },
              ]}
            />
          }
        >
          <TrendChart
            type="area"
            data={months}
            xKey="month"
            height="md"
            yDomain={[0, Math.ceil(Math.max(...months.map((m) => m.saved)) / 50) * 50 + 50]}
            yRight={{
              domain: [0, Math.ceil(Math.max(...months.map((m) => m.rate)) / 5) * 5 + 5],
              unit: '%',
            }}
            series={[
              { key: 'saved', name: 'Wish listed', color: '#0F766E', yAxisId: 'left' },
              { key: 'logged', name: 'Logged as read', color: '#0BA85F', yAxisId: 'left' },
              {
                key: 'rate',
                name: 'Read per suggestion',
                color: '#B43DD0',
                yAxisId: 'right',
                dashed: true,
                fillOpacity: 0,
              },
            ]}
          />
        </ChartCard>
      )}
    </>
  )
}
