import { useEffect, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Modal } from '@components/Modal/Modal'

// The extension-activity flow: read the offline prompt, then enter the short
// "badge requirement" response to earn the activity badge.
export function ActivityModal({ activity, path, open, done, response, onClose, onComplete }) {
  const [text, setText] = useState(response || '')

  // Reset the draft whenever a different activity is opened.
  useEffect(() => {
    if (open) setText(response || '')
  }, [open, activity?.id, response])

  if (!activity) return null
  const canSubmit = text.trim().length > 0

  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel={activity.name}>
      <div className="pyp-activity" style={{ '--path-color': path.color }}>
        <button className="pyp-activity-close" onClick={onClose} aria-label="Close">
          <Icon name="x" size={16} stroke={2.2} />
        </button>

        <div className="pyp-activity-head">
          <span className="pyp-activity-icon">
            <Icon name={activity.icon} size={24} stroke={1.8} />
          </span>
          <div>
            <div className="pyp-activity-kicker">
              {path.name.replace(/^The /, '')} · Extension activity
            </div>
            <h3 className="pyp-activity-name">{activity.name}</h3>
          </div>
        </div>

        <div className="pyp-activity-prompt">
          <div className="pyp-activity-sec-label">
            <Icon name="clipboard-list" size={15} /> Do this offline
          </div>
          <p>{activity.prompt}</p>
        </div>

        <div className="pyp-activity-req">
          <div className="pyp-activity-sec-label">
            <Icon name="award" size={15} color={path.color} /> To earn your badge
          </div>
          <label className="pyp-activity-question" htmlFor="pyp-activity-input">
            {activity.requirement}
          </label>

          {done ? (
            <div className="pyp-activity-answer">
              <Icon name="quote" size={14} />
              <p>{response}</p>
            </div>
          ) : (
            <textarea
              id="pyp-activity-input"
              className="pyp-activity-input"
              rows={4}
              value={text}
              placeholder={activity.placeholder}
              onChange={(e) => setText(e.target.value)}
            />
          )}
        </div>

        <div className="pyp-activity-foot">
          {done ? (
            <div className="pyp-activity-earned">
              <Icon name="circle-check-filled" size={18} color="#16A97A" />
              <span>
                Badge earned — <strong>{activity.name}</strong>
              </span>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="md" onClick={onClose}>
                Not yet
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={!canSubmit}
                icon={<Icon name="award" size={16} />}
                onClick={() => onComplete(text.trim())}
              >
                Complete &amp; earn badge
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}
