import { PageHeader } from '@components/PageHeader/PageHeader'
import { Button } from '@components/Button/Button'
import { Banner, EmptyState } from '@components/Primitives/Primitives'
import { Table } from '@components/Table/Table'
import { Icon } from '@components/Icon/Icon'
import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'
import { EDUCATOR, INDEXES } from '../data'
import { formatRange, percentComplete } from '../format'
import './IndexesView.css'

/**
 * `classroom/survey_requests/index` — the app's home. A list of the index
 * periods this educator has run, above a count of how many of the school
 * year's four they've used.
 */

// The allowance donut: four segments, one per index the plan permits.
function IndexCount({ used, limit }) {
  const R = 26
  const CIRC = 2 * Math.PI * R
  const dash = (used / limit) * CIRC

  return (
    <div className="rmi-index-count">
      <svg className="rmi-index-count-donut" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r={R} fill="none" strokeWidth="9" stroke="var(--c-gray-250)" />
        <circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          strokeWidth="9"
          stroke="var(--c-teal)"
          strokeDasharray={`${dash} ${CIRC - dash}`}
          transform="rotate(-90 32 32)"
          strokeLinecap="round"
        />
      </svg>
      <div className="rmi-index-count-content">
        <h3 className="rmi-index-count-heading">
          {used}/{limit} Indexes
        </h3>
        <span className="rmi-index-count-text">Created this school year</span>
      </div>
    </div>
  )
}

export function IndexesView({ onOpenIndex, onNewIndex }) {
  const rows = INDEXES.map((ix) => ({
    id: ix.id,
    name: ix.name,
    dates: formatRange(ix.startDate, ix.endDate),
    completion: percentComplete(ix),
  }))

  const columns = [
    {
      key: 'name',
      label: 'Index Period Name',
      render: (v, row) => (
        <button type="button" className="rmi-link" onClick={() => onOpenIndex(row.id)}>
          {v}
        </button>
      ),
    },
    { key: 'dates', label: 'Dates' },
    { key: 'completion', label: '% Completion', render: (v) => `${v}%` },
    {
      key: 'id',
      label: '',
      align: 'right',
      render: (id) => (
        <div className="rmi-row-actions">
          <button type="button" title="Edit" aria-label="Edit index">
            <PlumpyIcon name="pencil" size={20} />
          </button>
          <button type="button" title="Delete" aria-label="Delete index">
            <PlumpyIcon name="trash" size={20} />
          </button>
          <button
            type="button"
            title="View"
            aria-label="View index"
            onClick={() => onOpenIndex(id)}
          >
            <PlumpyIcon name="view" size={20} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Reading Motivation Index"
        actions={
          <>
            <Button variant="secondary" size="md">
              Download Print Materials
            </Button>
            <Button variant="primary" size="md">
              Print Access Codes
            </Button>
            <Button variant="primary" size="md" onClick={onNewIndex}>
              New Index
            </Button>
          </>
        }
      />

      <div className="rmi-banners">
        <IndexCount used={INDEXES.length} limit={EDUCATOR.indexesLimit} />

        <Banner level="info" icon={<Icon name="info" size={22} />}>
          Beanstack&rsquo;s Reading Motivation Index&trade; (RMI) builds on work conducted by the
          National Reading Research Center to measure reading motivation factors and make
          individualized recommendations. Learn more at{' '}
          <a href="https://www.beanstack.com/blog/reading-motivation-index">our blog</a>.
        </Banner>
      </div>

      {rows.length > 0 ? (
        <div className="rmi-card-table">
          <Table columns={columns} rows={rows} getRowKey={(r) => r.id} scrollX />
        </div>
      ) : (
        <EmptyState
          variant="dashed"
          title="No Indexes Created"
          description="Click New Index to get started. Create up to four indexes each school year."
          action={
            <Button variant="primary" size="md" onClick={onNewIndex}>
              New Index
            </Button>
          }
        />
      )}
    </>
  )
}
