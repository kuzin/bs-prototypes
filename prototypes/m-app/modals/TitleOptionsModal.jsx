import { useState } from 'react'
import { ActionsModal, Alert } from '@mobile/components'

/**
 * `components/TitleOptionsModal.jsx` — what the “…” on a book sheet opens.
 * `BookDetail.tsx` dispatches `showModal('TitleOptions')`; the modal itself is mounted at the
 * navigator root, which is why it lives beside the screens here rather than inside BookDetail.
 *
 * `getTitleOptions` has two branches, and the short one is the interesting one: an RLC book
 * (Reading Log Challenge — a title the challenge put there, not the reader) offers ONLY Delete.
 * There is nothing to edit because the reader did not enter it.
 *
 * The delete alert's message is assembled from the session count, and it reads differently when
 * the count is null — “the title” instead of “all N session(s) … for {title}”. Both strings ship.
 */
export function TitleOptionsModal({ open, book, isRlcBook = false, onClose, onEdit, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const sessions = book?.sessionCount ?? null
  const title = book?.title ?? 'this title'

  const options = isRlcBook
    ? [
        {
          title: 'Delete Title',
          source: 'modal_delete_icon',
          destructive: true,
          onPress: () => setConfirmOpen(true),
        },
      ]
    : [
        { title: 'Edit Title', source: 'modal_edit_icon', onPress: () => onEdit?.(book) },
        {
          title: 'Delete Title',
          source: 'modal_delete_icon',
          destructive: true,
          onPress: () => setConfirmOpen(true),
        },
      ]

  return (
    <>
      <ActionsModal open={open} title="Options" options={options} onClose={onClose} />
      <Alert
        open={confirmOpen}
        title="Delete Title"
        message={
          sessions !== null
            ? `Are you sure you would like to delete ${title}? This will delete all ${sessions} session(s) you have logged for ${title} and cannot be undone.`
            : `Are you sure you would like to delete ${title}? This will delete the title and cannot be undone.`
        }
        buttons={[
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => onDelete?.(book) },
        ]}
        onDismiss={() => setConfirmOpen(false)}
      />
    </>
  )
}
