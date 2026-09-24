import { Icon } from '@components/Icon/Icon'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import { Tabs } from '@components/Tabs/Tabs'
import { useStickyState } from '@components/useStickyState/useStickyState'
import '@components/RowAction/RowAction.css'
import '@components/Tabs/Tabs.css'
import { StatCard, ChartCard } from '@components/Cards/Cards'
import { Table } from '@components/Table/Table'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import '@components/Table/Table.css'
import '@components/ProgressBar/ProgressBar.css'

import { TODAY } from '../data'
import {
  districtTotals,
  districtHealth,
  districtBySource,
  districtByFormat,
  bennyDistrict,
  districtCollectionHealth,
  HEALTH,
} from '../derive'
import { BennySummary } from './BennySummary'
import { HealthPill, DistrictHealthCard, CompareTable } from './Health'

const TAB_IDS = ['health', 'schools', 'collections']

/**
 * The district Overview is a worklist of buildings: which collections are
 * keeping up with their readers and which aren't, worst first, with the count
 * of gaps as the figure each school is judged on. How the engine itself is
 * performing is no longer on this page.
 */
export function DistrictOverview({ onNavigate }) {
  const [stickyTab, setTab] = useStickyState('ce:district-overview-tab', 'health')
  const tab = TAB_IDS.includes(stickyTab) ? stickyTab : 'health'
  const totals = districtTotals()
  const d = districtHealth()

  return (
    <>
      <PageHeader
        title="Collection Engine"
        actions={
          <span className="ce-asof">
            <Icon name="circle-check" size={14} />
            {totals.connected} of {totals.schools} schools fully connected
          </span>
        }
      />

      <div className="ce-stats">
        <StatCard
          icon="school-building"
          value={d.counts.red}
          unit={`/${d.rows.length}`}
          label="Schools at risk"
          color={HEALTH.red.color}
          onClick={() => setTab('schools')}
        />
        <StatCard
          icon="alert"
          value={d.gapCount}
          label="District collection gaps"
          color="#D97706"
          onClick={() => onNavigate('collection')}
        />
        <StatCard
          icon="books"
          value={d.reach.recommended.toLocaleString()}
          unit={`/${d.reach.total.toLocaleString()}`}
          label="Titles recommended"
          color="#196DD5"
        />
        <StatCard
          icon="circle-check"
          value={d.reach.read.toLocaleString()}
          label="Recommended, then read"
          color="#0BA85F"
        />
      </div>

      <div className="ce-panel">
        <Tabs
          active={tab}
          onChange={setTab}
          variant="pill"
          ariaLabel="Overview views"
          items={[
            { id: 'health', label: 'District Health' },
            { id: 'schools', label: 'Schools', count: d.rows.length },
            { id: 'collections', label: 'Collections & Formats' },
          ]}
        />

        {tab === 'health' && (
          <div className="ce-stack">
            <BennySummary summary={bennyDistrict()} asOf={TODAY} />
            <DistrictHealthCard health={districtCollectionHealth()} rows={d.rows} />
          </div>
        )}

        {tab === 'schools' && (
          <ChartCard
            title="Collection health, school by school"
            accent="#0F766E"
            bodyPad="flush"
            info="Gaps: genres outgrown plus requests unanswered. Worst first."
          >
            <SchoolHealthTable rows={d.rows} />
          </ChartCard>
        )}

        {tab === 'collections' && (
          <div className="ce-stack">
            <ChartCard
              title="By collection"
              accent="#196DD5"
              bodyPad="flush"
              info="All schools added up. Titles in two collections count in both."
            >
              <CompareTable rows={districtBySource()} kind="source" />
            </ChartCard>
            <ChartCard title="By format" accent="#B43DD0" bodyPad="flush">
              <CompareTable rows={districtByFormat()} kind="format" />
            </ChartCard>
          </div>
        )}
      </div>
    </>
  )
}

function SchoolHealthTable({ rows }) {
  return (
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
        { key: 'health', label: 'Health', render: (_, r) => <HealthPill level={r.health.level} /> },
        {
          key: 'gaps',
          label: 'Collection gaps',
          align: 'right',
          render: (_, r) => <strong>{r.health.gapCount}</strong>,
        },
        {
          key: 'rec',
          label: 'Titles recommended',
          width: 200,
          render: (_, r) => (
            <ProgressBar
              inline
              size="sm"
              value={r.health.reach.recommended}
              max={r.health.reach.total}
              color="#196DD5"
              valueLabel={`${r.health.reach.recommended} of ${r.health.reach.total}`}
            />
          ),
        },
        {
          key: 'open',
          label: '',
          align: 'right',
          width: 56,
          /* Inert for now: the control says a school's own view exists
             without leaving this prototype for it. */
          render: () => (
            <RowActions>
              <RowAction icon="school-building" label="View school" onClick={() => {}} />
            </RowActions>
          ),
        },
      ]}
      rows={rows}
      getRowKey={(r) => r.id}
    />
  )
}
