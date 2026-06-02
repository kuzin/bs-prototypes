import { Modal } from '@components/Modal/Modal'
import { Table } from '@components/Table/Table'
import { Button } from '@components/Button/Button'
import { IconButton } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import { METRIC_DETAILS, fmt } from './data'
import '@components/Modal/Modal.css'
import '@components/Table/Table.css'

function CloseIcon() {
  return <Icon name="x" size={18} aria-hidden="true" />
}

export function MetricModal({ metricId, value, open, onClose }) {
  const detail = metricId ? METRIC_DETAILS[metricId] : null
  if (!detail) return null

  const rows = detail.rows || []
  const isEmpty = rows.length === 0
  const count = value ?? rows.length

  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel={detail.title}>
      {({ close }) => (
        <div className="ins-modal-wrap">
          <div className="modal-header">
            <div className="modal-header-text">
              <h3 className="modal-title">
                {fmt(count)} {detail.title}
              </h3>
            </div>
            <IconButton
              variant="ghost"
              size="sm"
              onClick={close}
              aria-label="Close"
              className="modal-close"
            >
              <CloseIcon />
            </IconButton>
          </div>

          <div className="modal-body ins-modal-body">
            {isEmpty ? (
              <div className="ins-modal-empty">{detail.emptyMessage || 'No data to show.'}</div>
            ) : (
              <Table
                columns={detail.columns}
                rows={rows}
                getRowKey={(_, i) => i}
                zebra
                stickyHeader
              />
            )}
          </div>

          <div className="modal-footer modal-footer--between">
            <span className="ins-modal-foot-note">
              {isEmpty ? '0 rows' : `${rows.length} row${rows.length === 1 ? '' : 's'}`}
            </span>
            <Button variant="primary" disabled={isEmpty}>
              Export CSV
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
