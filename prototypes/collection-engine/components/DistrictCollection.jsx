import { PageHeader } from '@components/PageHeader/PageHeader'
import { StatCard, ChartCard } from '@components/Cards/Cards'
import { Table } from '@components/Table/Table'
import { Pill } from '@components/Pill/Pill'
import '@components/Table/Table.css'
import '@components/Pill/Pill.css'

import { DISTRICT } from '../data'
import { districtTotals, districtBennyQueries } from '../derive'

export function DistrictCollection() {
  const totals = districtTotals()
  const queries = districtBennyQueries()
  const starved = queries.filter((q) => q.hits < 12)

  return (
    <>
      <PageHeader title="Collection intelligence" />

      <div className="ce-stats">
        <StatCard
          icon="plug-connected"
          value={totals.connected}
          unit={`/${totals.schools}`}
          label="Schools fully connected"
          color="#0BA85F"
        />
        <StatCard
          icon="books"
          value={totals.catalog.toLocaleString()}
          label="Titles switched on"
          color="#196DD5"
        />
        <StatCard
          icon="message-chatbot"
          value={starved.length}
          label="Requests you can't answer"
          color="#B43DD0"
        />
        <StatCard
          icon="circle-check"
          value={totals.activated.toLocaleString()}
          label="Titles put back to work"
          color="#0BA85F"
        />
      </div>

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
      </ChartCard>
    </>
  )
}
