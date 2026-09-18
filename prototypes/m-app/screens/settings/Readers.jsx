import { Header, Img, ProfileRow } from '@mobile/components'
import './Readers.css'

/**
 * `screens/settings/Readers.tsx`, reached from Settings > Readers.
 *
 * Every reader on the account as a `ProfileListItem` with a disclosure indicator, then a second
 * section holding one row: Add A Reader. The two sections are what the grey banding is for — a
 * `SectionList` draws a 15pt band of `formGrayBackground` above each section and a hairline below
 * it, so the screen reads as white cards floating on grey rather than as one long list.
 *
 * `clientServiceType === 'school'` returns the first section ALONE: a school account is one login
 * to one reader, so there is nobody to add. This prototype is a library account — the shape
 * `PROFILES` already models, and the reason the header avatar opens a switcher — so it gets both.
 *
 * DIVERGENCE — a reader row goes nowhere. `editReader` is the same server-driven registration
 * form as `editAccount`, built from fields the API sends; the indicators stay because the rows do
 * lead somewhere.
 */
export function Readers({ profiles, onBack }) {
  return (
    <div className="m-rdr">
      <Header variant="stack" title="Readers" onBack={onBack} />

      <div className="m-rdr-scroll">
        <div className="m-rdr-section">
          {profiles.map((profile, i) => (
            <div key={profile.id}>
              {/* `ItemSeparatorComponent` — between rows only, and inset 15 from the left. */}
              {i > 0 && <span className="m-rdr-sep" />}
              <button type="button" className="m-rdr-row">
                <ProfileRow layout="list" name={profile.name} imgURL={profile.imgURL} showName />
                <Img name="disclosure_indicator" className="m-rdr-chevron" />
              </button>
            </div>
          ))}
        </div>

        {/* The second section. Its own 44pt row — shorter than the 70 a reader takes, because it
            carries no avatar — with the label and the indicator pushed to opposite edges. */}
        <div className="m-rdr-section">
          <button type="button" className="m-rdr-add">
            <span className="m-t-paragraph-medium m-rdr-add-text">Add A Reader</span>
            <Img name="disclosure_indicator" className="m-rdr-chevron" />
          </button>
        </div>
      </div>
    </div>
  )
}
