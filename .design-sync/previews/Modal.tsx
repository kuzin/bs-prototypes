import React from 'react'
import { Modal, Button, IconButton, Icon } from 'bs-prototypes'

// Modal renders a position:fixed overlay. In the capture frame the side panel
// pins top/right/bottom (reliably full-height), so it renders un-clipped; the
// orchestrator can switch to a centered single-card view via the override noted
// in learnings (cardMode:"single", a tall viewport).

// A sized spacer gives the cell real height. The cell sets transform:translateZ(0),
// which makes it the containing block for the modal's position:fixed, so the
// centered modal anchors to this box (not the viewport) and renders un-clipped.
const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: 'relative', height: 460, margin: -12 }}>{children}</div>
)

export const Center = () => {
  const [open, setOpen] = React.useState(true)
  return (
    <Frame>
    <Modal open={open} onClose={() => setOpen(true)} variant="center" ariaLabel="Log a reading session">
      {({ close }) => (
        <>
          <div className="modal-header">
            <div className="modal-header-text">
              <h3 className="modal-title">Log a reading session</h3>
            </div>
            <IconButton variant="ghost" size="sm" aria-label="Close" className="modal-close" onClick={close}>
              <Icon name="x" size={18} />
            </IconButton>
          </div>
          <div className="modal-body">
            <p>
              Maya read <strong>The One and Only Ivan</strong> for 25 minutes today. Logging it adds
              to her reading streak and her class&apos;s challenge goal.
            </p>
            <p>You can verify the session with a quick Book Talk if integrity checks are on.</p>
          </div>
          <div className="modal-footer">
            <Button variant="ghost" onClick={() => setOpen(true)}>
              Cancel
            </Button>
            <Button variant="primary" icon={<Icon name="check" size={16} />} onClick={() => setOpen(true)}>
              Log session
            </Button>
          </div>
        </>
      )}
    </Modal>
    </Frame>
  )
}

export const Destructive = () => {
  const [open, setOpen] = React.useState(true)
  return (
    <Frame>
    <Modal open={open} onClose={() => setOpen(true)} variant="center" ariaLabel="End challenge">
      {({ close }) => (
        <>
          <div className="modal-header">
            <div className="modal-header-text">
              <h3 className="modal-title">End the Summer Reading Challenge?</h3>
            </div>
            <IconButton variant="ghost" size="sm" aria-label="Close" className="modal-close" onClick={close}>
              <Icon name="x" size={18} />
            </IconButton>
          </div>
          <div className="modal-body">
            <p>
              This stops badge progress for all 142 students and locks the leaderboard. Earned badges
              are kept, but no new reading will count.
            </p>
          </div>
          <div className="modal-footer">
            <Button variant="ghost" onClick={() => setOpen(true)}>
              Keep it running
            </Button>
            <Button variant="danger" onClick={() => setOpen(true)}>
              End challenge
            </Button>
          </div>
        </>
      )}
    </Modal>
    </Frame>
  )
}
