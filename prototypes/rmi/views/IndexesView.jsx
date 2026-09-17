import { PageHeader } from '@components/PageHeader/PageHeader'
import { Button } from '@components/Button/Button'
import { Banner, EmptyState } from '@components/Primitives/Primitives'
import { Table } from '@components/Table/Table'
import { Icon } from '@components/Icon/Icon'
import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'
import { useState } from 'react'
import { ConfirmModal } from '../components/ConfirmModal'
import { formatRange, percentComplete } from '../format'
import './IndexesView.css'

/**
 * `classroom/survey_requests/index` — the app's home. A list of the index
 * periods this educator has run, above a count of how many of the school
 * year's four they've used.
 */

// `.index-count` — the allowance card. The ring is a conic gradient with a
// hole punched by an ::after, exactly as `index_progress_controller.ts` drives
// it: one custom property carrying the swept angle.
function IndexCount({ used, limit }) {
  return (
    <div className="rmi-index-count">
      <div
        className="rmi-index-count-donut"
        style={{ '--progress': `${(used / limit) * 360}deg` }}
        aria-hidden="true"
      />
      <div className="rmi-index-count-content">
        <h3 className="rmi-index-count-heading">
          {used}/{limit} Indexes
        </h3>
        <span className="rmi-index-count-text">Created this school year</span>
      </div>
    </div>
  )
}

export function IndexesView({
  indexes,
  limit,
  onOpenIndex,
  onNewIndex,
  onEditIndex,
  onDeleteIndex,
}) {
  const [confirm, setConfirm] = useState(null)

  const rows = indexes.map((ix) => ({
    id: ix.id,
    name: ix.name,
    dates: formatRange(ix.startDate, ix.endDate),
    completion: percentComplete(ix),
    index: ix,
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
      render: (id, row) => (
        <div className="rmi-row-actions">
          <button
            type="button"
            title="Edit"
            aria-label={`Edit ${row.name}`}
            onClick={() => onEditIndex(row.index)}
          >
            <PlumpyIcon name="pencil" size={20} />
          </button>
          <button
            type="button"
            title="Delete"
            aria-label={`Delete ${row.name}`}
            onClick={() => setConfirm(row.index)}
          >
            <PlumpyIcon name="trash" size={20} />
          </button>
          <button
            type="button"
            title="View"
            aria-label={`View ${row.name}`}
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
        <IndexCount used={indexes.length} limit={limit} />

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
          description={`Click New Index to get started. Create up to ${limit} indexes each school year.`}
          action={
            <Button variant="primary" size="md" onClick={onNewIndex}>
              New Index
            </Button>
          }
        />
      )}

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={`Delete ${confirm?.name ?? ''}`}
        confirmLabel="Delete"
        onConfirm={() => onDeleteIndex(confirm.id)}
      >
        Are you sure you want to delete this index? This will delete every response collected during
        it.
      </ConfirmModal>
    </>
  )
}
