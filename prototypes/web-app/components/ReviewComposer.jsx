import { useEffect, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Field, Input, Textarea } from '@components/Form/Form'
import { Modal, ModalFullClose } from '@components/Modal/Modal'
import { InfoBox } from '@components/InfoBox/InfoBox'

import { BOOKS } from '../../logging-flow/data'
import './ReviewComposer.css'

import '@components/Button/Button.css'
import '@components/Form/Form.css'
import '@components/Modal/Modal.css'

/**
 * Writing or editing a review — `reviews/new.html.erb` and the two edit forms.
 *
 * One form, two types. Both ask what you read (title and author, both
 * autocompleted against Beanstack Books); after that they diverge completely:
 * a **written** review is a piece of writing, held to the site's own minimum
 * and maximum, and a **picture** review is a name and a file.
 *
 * A picture review then waits on staff before anyone else sees it, which is
 * why saving one says so and the card comes back "Waiting for approval".
 */

// `microsite_setting.min_review_length` / `max_review_length`.
const MIN = 40
const MAX = 1200

const EMPTY = { title: '', author: '', body: '', name: '', file: '' }

export function ReviewComposer({ open, kind = 'written', review, onClose, onSave }) {
  const editing = Boolean(review)
  const [form, setForm] = useState(EMPTY)
  const [touched, setTouched] = useState(false)

  // Opening on a review fills the form with it; opening on nothing clears
  // whatever the last one left behind.
  useEffect(() => {
    if (!open) return
    setTouched(false)
    setForm(
      review
        ? {
            title: review.title ?? '',
            author: review.author ?? '',
            body: review.body ?? '',
            name: review.kind === 'picture' ? review.title : '',
            file: review.kind === 'picture' ? 'review.jpg' : '',
          }
        : EMPTY,
    )
  }, [open, review])

  const type = review?.kind ?? kind
  const picture = type === 'picture'
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const length = form.body.trim().length
  const tooShort = !picture && length > 0 && length < MIN
  const bookTitle = picture ? form.title : form.title
  const ready = picture
    ? form.name.trim() && bookTitle.trim() && form.file
    : bookTitle.trim() && length >= MIN

  // The app autocompletes the title against Beanstack Books and fills the
  // author from whatever you pick.
  const suggestions = form.title.trim()
    ? Object.values(BOOKS)
        .filter((b) => b.title.toLowerCase().includes(form.title.trim().toLowerCase()))
        .slice(0, 4)
    : []
  const exact = suggestions.some((b) => b.title === form.title)

  function save() {
    setTouched(true)
    if (!ready) return
    onSave?.({
      ...review,
      kind: type,
      title: picture ? form.name : form.title,
      book: picture ? form.title : undefined,
      author: form.author,
      body: picture ? undefined : form.body.trim(),
      // A picture review goes back to staff whenever it changes.
      status: picture ? 'pending' : undefined,
    })
  }

  const heading = editing
    ? picture
      ? 'Edit Picture Review'
      : 'Edit Review'
    : picture
      ? 'Post a Picture Review'
      : 'Write a Review'

  return (
    /* `reviews/new.html.erb` renders into `#logged-books--new` — the same
       full-screen shell the logging flow uses. Writing a review is a task that
       takes the screen, not a dialogue that sits over one. */
    <Modal open={open} onClose={onClose} variant="full" ariaLabel={heading}>
      <ModalFullClose onClick={onClose} />
      <div className="modal-full-panel rc">
        <h1 className="rc-heading">{heading}</h1>

        <div className="rc-body">
          {picture && (
            <Field label="Picture Review name" required>
              <Input
                value={form.name}
                onChange={set('name')}
                placeholder="What you made"
                aria-invalid={touched && !form.name.trim()}
              />
            </Field>
          )}

          <Field label="Book Title" required>
            <Input
              value={form.title}
              onChange={set('title')}
              placeholder="What did you read?"
              aria-invalid={touched && !form.title.trim()}
            />
            {/* `reviews_with_autocomplete` — picking a title fills the author. */}
            {suggestions.length > 0 && !exact && (
              <ul className="rc-suggest">
                {suggestions.map((b) => (
                  <li key={b.title}>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, title: b.title, author: b.author }))}
                    >
                      <span className="rc-suggest-title">{b.title}</span>
                      <span className="rc-suggest-author">{b.author}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Field>

          <Field label="Author">
            <Input value={form.author} onChange={set('author')} placeholder="Who wrote it?" />
          </Field>

          {picture ? (
            <Field label="Picture Review" required>
              {/* The real field takes a photo or a video straight to S3. There
                  is nothing to upload to here, so the zone stands in for it. */}
              <button
                type="button"
                className={`rc-drop${form.file ? ' is-filled' : ''}`}
                onClick={() =>
                  setForm((f) => ({ ...f, file: f.file ? '' : 'my-picture-review.jpg' }))
                }
              >
                <Icon name={form.file ? 'photo' : 'upload'} size={22} />
                {form.file || 'Drag and drop a photo or video file here, or click to upload.'}
                {form.file && <span className="rc-drop-clear">Remove</span>}
              </button>
            </Field>
          ) : (
            <Field label="Review" required>
              {/* `render_review_length_message` — the site's own bounds, said
                  up front rather than after a rejected save. */}
              <InfoBox icon={<Icon name="info" size={22} />} className="rc-bounds">
                Your review must be between {MIN} and {MAX.toLocaleString()} characters.
              </InfoBox>
              <Textarea
                rows={10}
                value={form.body}
                onChange={set('body')}
                maxLength={MAX}
                placeholder="What did you think of it?"
                aria-invalid={touched && tooShort}
              />
              <div className={`rc-count${tooShort ? ' is-short' : ''}`}>
                {length < MIN
                  ? `${MIN - length} more character${MIN - length === 1 ? '' : 's'} to go`
                  : `${length.toLocaleString()} / ${MAX.toLocaleString()}`}
              </div>
            </Field>
          )}

          {picture && (
            <p className="rc-note">
              A picture review is checked by staff before other readers can see it.
            </p>
          )}
        </div>

        <div className="rc-foot">
          <Button size="lg" onClick={save} disabled={touched && !ready}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  )
}
