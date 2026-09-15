import { useEffect } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Pill } from '@components/Pill/Pill'
import { Modal, ModalClose } from '@components/Modal/Modal'

import { ReviewArt } from './ReviewArt'
import './PictureReviewViewer.css'

import '@components/Modal/Modal.css'
import '@components/Pill/Pill.css'

/**
 * Looking at a picture review — the lightbox the app opens from a card in the
 * grid (`lightgallery` on `.picture-review-item-media-wrapper`, with
 * `slider_sub_html` supplying what sits beside the media).
 *
 * The app puts four things there and this does the same: the review's own
 * title, the book it is for, who made it and at which library, and the heart —
 * which it only shows once the review is approved, since an unapproved one
 * isn't public yet.
 *
 * Arrow keys step through the grid you opened it from, the way the gallery
 * does; a review with nothing either side of it simply has no arrow.
 */
export function PictureReviewViewer({ review, reviews = [], onClose, onOpen, hearted, onHeart }) {
  const index = review ? reviews.findIndex((r) => r.id === review.id) : -1
  const prev = index > 0 ? reviews[index - 1] : null
  const next = index >= 0 && index < reviews.length - 1 ? reviews[index + 1] : null

  useEffect(() => {
    if (!review) return undefined
    function onKey(e) {
      if (e.key === 'ArrowLeft' && prev) onOpen?.(prev)
      if (e.key === 'ArrowRight' && next) onOpen?.(next)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [review, prev, next, onOpen])

  const approved = review?.status !== 'pending'

  return (
    <Modal
      open={Boolean(review)}
      onClose={onClose}
      variant="center"
      closeBadge
      ariaLabel={review ? review.title : 'Picture review'}
    >
      {review && (
        <>
          <ModalClose onClick={onClose} />
          <div className="prv">
            <div className="prv-stage">
              <ReviewArt review={review} size={48} className="prv-art" />

              {prev && (
                <button
                  type="button"
                  className="prv-step prv-step--prev"
                  onClick={() => onOpen(prev)}
                  aria-label="Previous picture review"
                >
                  <Icon name="chevron-left" size={22} stroke={2.2} />
                </button>
              )}
              {next && (
                <button
                  type="button"
                  className="prv-step prv-step--next"
                  onClick={() => onOpen(next)}
                  aria-label="Next picture review"
                >
                  <Icon name="chevron-right" size={22} stroke={2.2} />
                </button>
              )}
            </div>

            {/* `.lg-review-info` — the title, the book, the creator, the heart. */}
            <div className="prv-info">
              <h2 className="prv-title">{review.title}</h2>

              <div className="prv-block">
                <h4>Picture Review for:</h4>
                <div className="prv-book">{review.book}</div>
                {review.author && <div className="prv-author">by {review.author}</div>}
              </div>

              <div className="prv-block">
                <h4>Created by:</h4>
                <div className="prv-creator">
                  {review.by ?? 'Olivia M.'}
                  {review.library ? `, ${review.library}` : ''}
                </div>
                <div className="prv-date">{review.date}</div>
              </div>

              <div className="prv-foot">
                {approved ? (
                  <button
                    type="button"
                    className={`prv-heart${hearted ? ' is-on' : ''}`}
                    onClick={onHeart}
                    aria-pressed={hearted}
                    aria-label={hearted ? 'Remove heart' : 'Heart this review'}
                  >
                    <Icon name={hearted ? 'heart-filled' : 'heart'} size={18} />
                    {(review.hearts ?? 0) + (hearted ? 1 : 0)}
                  </button>
                ) : (
                  /* Not public yet, so there is nothing to heart. */
                  <Pill color="#B45309" variant="soft" size="sm">
                    Waiting for approval
                  </Pill>
                )}
                {reviews.length > 1 && index >= 0 && (
                  <span className="prv-count">
                    {index + 1} of {reviews.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
