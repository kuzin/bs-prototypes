import { Modal } from '@components/Modal/Modal'
import { Avatar } from '@components/Avatar/Avatar'
import { Icon } from '@components/Icon/Icon'
import { ChatBubble, AnnotationBlock } from './ChatBubble'
import { FLAG_DESCS, POS_FLAG_DESCS, RATING_LABELS } from '../data'

function FlagRow({ type, positive }) {
  const desc = (positive ? POS_FLAG_DESCS : FLAG_DESCS)[type] ?? { label: type, desc: '' }
  return (
    <div className={`bt-flag-row${positive ? ' bt-flag-row--pos' : ' bt-flag-row--neg'}`}>
      <span className="bt-flag-icon">
        <Icon name={positive ? 'circle-check' : 'flag'} size={13} />
      </span>
      <div>
        <div className="bt-flag-label">{desc.label}</div>
        <div className="bt-flag-desc">{desc.desc}</div>
      </div>
    </div>
  )
}

// Teacher's read of a single Book Talk: the conversation transcript on the
// right, Benny's breakdown (engagement rating + flags) on the left. Read-only
// reflection of the Sessions for Review pattern, scoped to one activity badge.
export function ConversationReview({ student, badge, open, onClose }) {
  if (!student) return null
  const hasConvo = student.conversation.length > 0
  const unfinished = student.status === 'in-progress'

  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel="Book Talk conversation">
      <div className="bt-review">
        <div className="bt-review-head">
          <div className="bt-review-head-left">
            <Avatar initials={student.initials} color={student.color} size="md" />
            <div>
              <div className="bt-review-name">{student.name}</div>
              <div className="bt-review-sub">{badge.name}</div>
            </div>
          </div>
          <button className="bt-chat-close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={16} stroke={2.2} />
          </button>
        </div>

        <div className="bt-review-cols">
          {/* Breakdown */}
          <aside className="bt-review-side">
            <div className="bt-side-block">
              <div className="bt-side-label">Status</div>
              <div className={`bt-status bt-status--${student.status}`}>
                <span className="bt-status-dot" />
                {student.status === 'completed'
                  ? 'Completed'
                  : student.status === 'in-progress'
                    ? 'In progress'
                    : 'Not started'}
              </div>
              <div className="bt-side-meta">
                {student.exchanges} exchange{student.exchanges === 1 ? '' : 's'}
                {student.completedAt && ` · ${student.completedAt}`}
              </div>
            </div>

            {student.rating && (
              <div className="bt-side-block">
                <div className="bt-side-label">Engagement</div>
                <div className={`bt-rating bt-rating--${student.rating}`}>
                  <span className="bt-rating-dot" />
                  {RATING_LABELS[student.rating]}
                </div>
                <div className="bt-side-note">
                  Benny rates engagement — never correctness. You can override this.
                </div>
              </div>
            )}

            {student.positiveFlags.length > 0 && (
              <div className="bt-side-block">
                <div className="bt-side-label bt-side-label--pos">Positive signals</div>
                {student.positiveFlags.map((f) => (
                  <FlagRow key={f} type={f} positive />
                ))}
              </div>
            )}

            {student.flags.length > 0 && (
              <div className="bt-side-block">
                <div className="bt-side-label bt-side-label--neg">Flags</div>
                {student.flags.map((f) => (
                  <FlagRow key={f} type={f} />
                ))}
              </div>
            )}
          </aside>

          {/* Transcript */}
          <div className="bt-review-main">
            {!hasConvo && (
              <div className="bt-review-empty">
                <Icon name="message-circle" size={28} />
                <p>{student.name} hasn’t started this Book Talk yet.</p>
              </div>
            )}
            {hasConvo && (
              <div className="bt-review-transcript">
                {student.conversation.map((msg, i) =>
                  msg.role === 'annotation' ? (
                    <AnnotationBlock key={i} msg={msg} />
                  ) : (
                    <ChatBubble key={i} msg={msg} />
                  ),
                )}
                {unfinished && (
                  <div className="bt-review-unfinished">
                    <Icon name="clock" size={14} />
                    Benny is still waiting for a response — this conversation isn’t finished.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
