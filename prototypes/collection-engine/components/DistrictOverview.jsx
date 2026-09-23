import { Icon } from '@components/Icon/Icon'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { useStickyState } from '@components/useStickyState/useStickyState'
import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import { StatCard, ChartCard } from '@components/Cards/Cards'
import { TrendChart } from '@components/TrendChart/TrendChart'
import { ChartLegend } from '@components/charts/charts'
import { BarList } from '@components/BarList/BarList'
import { Table } from '@components/Table/Table'
import '@components/BarList/BarList.css'
import '@components/Table/Table.css'

import { DISTRICT, TODAY } from '../data'
import { districtTotals, schoolRows, monthly, ALL_EVENTS, bennyDistrict } from '../derive'
import { AsOf, FeedState, openSchool } from './Bits'
import { BennySummary } from './BennySummary'

export function DistrictOverview({ onNavigate }) {
  const [tab, setTab] = useStickyState('ce:district-overview-tab', 'performance')
  const totals = districtTotals()
  const rows = schoolRows()
  const months = monthly(ALL_EVENTS)

  return (
    <>
      <PageHeader
        title="Collection Engine"
        actions={
          <span className="ce-asof">
            <Icon name="circle-check" size={14} />
            {totals.connected} of {rows.length} schools fully connected
          </span>
        }
      />

      <div className="ce-stats">
        <StatCard
          icon="books"
          value={totals.activated.toLocaleString()}
          label="Titles put back to work"
          color="#0BA85F"
        />
        <StatCard
          icon="building-community"
          value={totals.catalog.toLocaleString()}
          label="Titles switched on"
          color="#196DD5"
          onClick={() => onNavigate('collection')}
        />
        <StatCard
          icon="trending-up"
          value={totals.funnel.loggedPct}
          unit="%"
          label="Suggested, then read"
          color="#0F766E"
        />
        <StatCard
          icon="users"
          value={totals.readers.toLocaleString()}
          label="Readers"
          color="#B43DD0"
        />
      </div>

      {/* Two readings of the same year, one at a time. The tiles stay above
          the tabs: they are the summary, not one of the readings. */}
      <div className="ce-panel">
        <Tabs
          active={tab}
          onChange={setTab}
          variant="pill"
          ariaLabel="Overview views"
          items={[
            { id: 'performance', label: 'Performance' },
            { id: 'schools', label: 'Schools', count: rows.length },
          ]}
        />

        {tab === 'performance' && (
          <>
            {/* Same block the school Overview leads with, reading the district.
                It opens Performance rather than the page, because what it is
                summarising is the charts under it — on Schools it would be
                talking about a table it isn't looking at. */}
            <BennySummary summary={bennyDistrict()} asOf={TODAY} />

            {/* One card, full width: the funnel that used to sit beside this
                said the same three numbers the tiles above already carry. */}
            <div className="ce-stack">
              <ChartCard title="Reads per suggestion, by school" accent="#196DD5" bodyPad="padded">
                <BarList
                  header={{ label: 'School', valueLabel: 'Read' }}
                  labelWidth={210}
                  items={rows.map((r) => ({
                    label: r.name,
                    sublabel: r.fresh.asOf ? `Catalog ${r.fresh.staleDays}d old` : 'Never synced',
                    value: r.funnel.loggedPct,
                    max: Math.max(...rows.map((x) => x.funnel.loggedPct)),
                    color:
                      r.fresh.problems === 0 ? '#0BA85F' : r.fresh.asOf ? '#D97706' : '#DC2626',
                    valueLabel: `${r.funnel.loggedPct}%`,
                    subValue: `${r.activated} titles`,
                  }))}
                />
              </ChartCard>
            </div>

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
          </>
        )}

        {tab === 'schools' && (
          <ChartCard title="Every school" accent="#0F766E" bodyPad="flush">
            <Table
              flush
              scrollX
              columns={[
                {
                  key: 'name',
                  label: 'School',
                  render: (_, r) => (
                    <div className="ce-title-text">
                      <span className="ce-title-name">{r.name}</span>
                      <span className="ce-title-sub">{r.readers} readers</span>
                    </div>
                  ),
                },
                {
                  key: 'titles',
                  label: 'Titles',
                  align: 'right',
                  render: (_, r) => r.titles.toLocaleString(),
                },
                {
                  key: 'fresh',
                  label: 'Catalog',
                  render: (_, r) => <AsOf fresh={r.fresh} prefix="" />,
                },
                {
                  key: 'suggested',
                  label: 'Suggested',
                  align: 'right',
                  render: (_, r) => r.funnel.suggested.toLocaleString(),
                },
                {
                  key: 'saved',
                  label: 'Saved',
                  align: 'right',
                  render: (_, r) => `${r.funnel.savedPct}%`,
                },
                {
                  key: 'read',
                  label: 'Read',
                  align: 'right',
                  render: (_, r) => <strong>{r.funnel.loggedPct}%</strong>,
                },
                {
                  key: 'state',
                  label: 'Status',
                  render: (_, r) => (
                    <FeedState
                      state={r.fresh.problems === 0 ? 'ok' : r.fresh.asOf ? 'stale' : 'off'}
                    />
                  ),
                },
                {
                  key: 'open',
                  label: '',
                  align: 'right',
                  width: 132,
                  /* Opening a school leaves this prototype for its sibling —
                     a real navigation, not a panel. That is too far to travel
                     on a stray click anywhere in a row you were reading, so it
                     asks to be pressed. */
                  render: (_, r) => (
                    <Button variant="secondary" size="sm" onClick={() => openSchool(r.id)}>
                      Open school
                    </Button>
                  ),
                },
              ]}
              rows={rows}
              getRowKey={(r) => r.id}
            />
          </ChartCard>
        )}
      </div>
    </>
  )
}
