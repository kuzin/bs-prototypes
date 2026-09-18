import { Header, Img } from '@mobile/components'
import { EditForm } from './EditForm'
import './EditForm.css'
import './EditReader.css'

/**
 * `screens/settings/EditReader.tsx` — a reader row on the Readers screen.
 *
 * Unlike Edit Account this opens on the reader's face, and the fields come after — a reader is a
 * person, and the rest is detail about them.
 *
 * The image is NOT the round avatar this system uses everywhere else. `getReaderImageButton` draws
 * a 96pt square at `borderRadius: 4` with 32 above it, and hangs a 16×13 `camera_icon` INSIDE it
 * at 5% from the top and left — no badge on the corner, no circle. Reaching for `ProfileRow`
 * because every other reader row uses it produces a believable screen that is not this one.
 *
 * With no photo the source falls back to `avatar_placeholder_large`, a real asset, rather than to
 * initials — so a reader who has never set one gets a picture, not their letters.
 *
 * DIVERGENCE — the image is not editable. It opens `editProfileAvatar`: a camera and a photo
 * library, neither of which a prototype can honestly stand in for. The camera glyph stays, because
 * it is true that tapping there changes the picture.
 *
 * Also left out: Tandems. `renderTandems` adds Link Readers / Remove Link above the fields, tying
 * this reader to an account at another site. It is a real feature with its own modals and its own
 * API, and it is a screen's worth of work rather than a detail of this one.
 */
export function EditReader({ reader, sections, onBack }) {
  return (
    <div className="m-edf">
      <Header variant="stack" title={reader?.name ?? 'Reader'} onBack={onBack} />

      <div className="m-edr-avatar">
        <button type="button" className="m-edr-image" aria-label="Profile Image">
          {reader?.imgURL ? (
            <img src={reader.imgURL} alt="" className="m-edr-photo" />
          ) : (
            <Img name="avatar_placeholder_large" className="m-edr-photo" />
          )}
          <Img name="camera_icon" className="m-edr-camera" />
        </button>
      </div>

      <EditForm sections={sections} onSave={onBack} />
    </div>
  )
}
