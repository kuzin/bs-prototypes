import { Header, Img, ProfileRow } from '@mobile/components'
import './Readers.css'

/**
 * `screens/settings/Readers.tsx`, reached from Settings > Readers — every reader under the CURRENT
 * account. The list is per account, not per device: signing in to a second site brings its own
 * readers, and the header avatar only ever swaps between the ones shown here.
 *
 * `clientServiceType === 'school'` returns the reader list ALONE, with no Add A Reader: a school
 * account is one login to one reader, so there is nobody to add. This account is the library
 * shape, so it gets both.
 *
 * DIVERGENCE — laid out like Accounts, on a design call. The app puts this list on the form grey
 * with `SectionList` banding and separates Add A Reader into a section of its own; here it is one
 * white list under a heading, matching the screen one row above it in Settings. The two screens
 * are siblings reached the same way and were reading as unrelated. Everything else is the app's:
 * the rows are still `ProfileListItem` at 70pt, and Add A Reader is still its own row rather than
 * a button.
 */
export function Readers({ profiles, onOpenReader, onBack }) {
  return (
    <div className="m-rdr">
      <Header variant="stack" title="Readers" onBack={onBack} />

      <div className="m-rdr-scroll">
        <h2 className="m-t-primary-title m-rdr-heading">Readers</h2>
        <span className="m-rdr-rule" />

        {profiles.map((profile) => (
          <div key={profile.id}>
            <button type="button" className="m-rdr-row" onClick={() => onOpenReader?.(profile)}>
              <ProfileRow layout="list" name={profile.name} imgURL={profile.imgURL} showName />
              <Img name="new_arrow_right" className="m-rdr-arrow" />
            </button>
            <span className="m-rdr-rule" />
          </div>
        ))}

        {/* `showReaderProfileCreation` — it fetches the registration fields, then pushes
            `addReader`. That is the reader signup form, a flow of its own. */}
        <button type="button" className="m-rdr-row">
          <span className="m-rdr-tile">
            <Img name="add_icon" size={22} />
          </span>
          <span className="m-t-secondary-title m-rdr-add">Add A Reader</span>
        </button>
        <span className="m-rdr-rule" />
      </div>
    </div>
  )
}
