import { useState } from 'react'
import { Header, TextField, ToggleSwitch, PressableButton } from '@mobile/components'
import './EditTitle.css'

/**
 * `readingLogging/components/EditBook.tsx` — what "Edit Title" on the book panel's options opens
 * (`navigate('editBook', { book, fromScreen: 'titleOptionsModal' })`).
 *
 * Two `FloatingTextField`s, a Track Progress switch, and the page fields the switch reveals. The
 * author is explicitly optional and says so in its own label, which is the app's way of marking
 * an optional field — there is no hint line under it.
 *
 * Track Progress is what decides whether a title has a page range at all: turn it off and the
 * reader is logging minutes against a title, turn it on and they are walking through it. The copy
 * under it is the app's own.
 *
 * DIVERGENCE — no cover picker. `CoverImageModal` hangs off this screen in the app (take a photo,
 * choose an image), which is a camera flow this prototype has no way to stand in for.
 */
export function EditTitle({ book, onBack, onSave }) {
  const [title, setTitle] = useState(book.title ?? '')
  const [author, setAuthor] = useState(book.author ?? '')
  const [track, setTrack] = useState(book.trackProgress ?? true)
  const [first, setFirst] = useState(book.firstPage != null ? String(book.firstPage) : '')
  const [last, setLast] = useState(book.pageCount != null ? String(book.pageCount) : '')

  return (
    <div className="m-et">
      <Header variant="stack" title="Edit Title" onBack={onBack} />

      <div className="m-et-scroll">
        <div className="m-et-fields">
          <TextField label="Title" value={title} onChange={setTitle} />
          <TextField label="Author (Optional)" value={author} onChange={setAuthor} />
        </div>

        <div className="m-et-track">
          <div className="m-et-track-row">
            <span className="m-et-track-title">Track Progress</span>
            <ToggleSwitch
              isOn={track}
              announcementLabel="Track progress"
              onToggle={() => setTrack((t) => !t)}
            />
          </div>
          <p className="m-et-track-note">
            Log first and last pages read and track your progress through the title.
          </p>
        </div>

        {track && (
          <div className="m-et-fields">
            <TextField label="First Page" value={first} onChange={setFirst} inputMode="numeric" />
            <TextField label="Last Page" value={last} onChange={setLast} inputMode="numeric" />
          </div>
        )}
      </div>

      <div className="m-et-foot">
        <PressableButton
          fullWidth
          buttonText="Save"
          disabled={title.trim() === ''}
          onButtonPress={() =>
            onSave?.({
              ...book,
              title: title.trim(),
              author: author.trim(),
              trackProgress: track,
              firstPage: track && first !== '' ? Number(first) : null,
              pageCount: track && last !== '' ? Number(last) : book.pageCount,
            })
          }
        />
      </div>
    </div>
  )
}
