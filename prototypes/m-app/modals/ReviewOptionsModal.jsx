import { useState } from 'react'
import { ActionsModal, Alert } from '@mobile/components'

/**
 * `components/ReviewOptionsModal.jsx` — the “…” on a review row.
 *
 * `getReviewsOptions` builds all three options then removes one, and which one it removes depends
 * on the review's status:
 *
 *   rejected  → `slice(1)`      drops Edit Review, leaving Re-Submit + Delete
 *   otherwise → `splice(1, 1)`  drops Re-Submit, leaving Edit + Delete
 *
 * DIVERGENCE — a rejected review keeps Edit here, so it offers all three.
 *
 * The app's two survivors already route to the SAME handler (`reviewEditor`), so dropping Edit
 * was never a capability difference, only a labelling one. But the labels are what a reader reads:
 * offered nothing but “Re-Submit”, the honest reading is that the same rejected text goes back
 * unchanged, which is the one thing that cannot work. Showing Edit beside it says the review can
 * be fixed first — a design call, and the reason to keep both rather than rename one.
 */
export function ReviewOptionsModal({ open, review, onClose, onEdit, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const rejected = review?.status === 'rejected'

  const options = [
    { title: 'Edit Review', source: 'modal_edit_icon', onPress: () => onEdit?.(review) },
    ...(rejected
      ? [{ title: 'Re-Submit Review', source: 'resubmit_icon', onPress: () => onEdit?.(review) }]
      : []),
    {
      title: 'Delete Review',
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
        title="Delete Review"
        message="Are you sure you want to delete this Review?"
        buttons={[
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => onDelete?.(review) },
        ]}
        onDismiss={() => setConfirmOpen(false)}
      />
    </>
  )
}
