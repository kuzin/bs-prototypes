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
  /* The book the confirm is ABOUT, held here rather than read from the prop.
     `ActionsModal` closes before it runs a row's action, and closing clears the book — so by the
     time the alert rendered it had neither the title nor the session count and fell back to
     "this title" and the shorter of the two messages. Both strings ship; the reader should see
     the one that names what they are about to lose. */
  const [pending, setPending] = useState(null)
  const confirmOpen = pending != null

  /* `relationships.log_item_sessions.meta.count` — the sessions this title would take with it.
     Reading it off the list the panel already holds is the same number, and it moves when one is
     deleted rather than going stale. */
  const sessions = pending?.sessions?.length ?? pending?.sessionCount ?? null
  const title = pending?.title ?? 'this title'

  const options = isRlcBook
    ? [
        {
          title: 'Delete Title',
          source: 'modal_delete_icon',
          destructive: true,
          onPress: () => setPending(book),
        },
      ]
    : [
        { title: 'Edit Title', source: 'modal_edit_icon', onPress: () => onEdit?.(book) },
        {
          title: 'Delete Title',
          source: 'modal_delete_icon',
          destructive: true,
          onPress: () => setPending(book),
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
          { text: 'Cancel', style: 'cancel', onPress: () => setPending(null) },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              const target = pending
              setPending(null)
              onDelete?.(target)
            },
          },
        ]}
        onDismiss={() => setPending(null)}
      />
    </>
  )
}
