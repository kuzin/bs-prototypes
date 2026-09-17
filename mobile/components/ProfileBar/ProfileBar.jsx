import { Img } from '../Img/Img'
import { ProfileRow } from '../ProfileRow/ProfileRow'
import './ProfileBar.css'

/**
 * `src/components/ProfileBar.tsx` — everything on the right of a root header.
 *
 * Not an avatar. The app puts up to four controls here and gates each one:
 *
 *   switch account — `isConnectedMicrosite && connectedProfileId != null`, so only a reader whose
 *                    account is linked to a second site ever sees it
 *   search         — `logSearch || friendLogSearch`. `LogStackTabNavigator` passes `logSearch`,
 *                    which is why the Log tab has a magnifier and Home, Discover and Community
 *                    don't
 *   settings       — `!isSettings && !friendLogSearch`, i.e. every root
 *   avatar         — opens the Profiles modal, `showModal('Profiles')`. It is a reader SWITCHER,
 *                    not a link to a profile page
 *
 * DIVERGENCE — a control renders only when it is given a handler. The app's gates are conditions
 * on state we don't model; here the condition is whether the prototype has somewhere for the
 * control to go, which keeps a dead icon out of a header whose whole job is to be pressed. Pass
 * the handler and the control appears in the app's own order.
 *
 * Metrics are the source's: a 60pt row, 22pt icons with 20pt to the right of each.
 */
export function ProfileBar({ name, imgURL, onSwitchAccount, onSearch, onSettings, onProfile }) {
  return (
    <div className="m-pbar" data-testid="profile-bar">
      {onSwitchAccount && (
        <button
          type="button"
          className="m-pbar-icon"
          aria-label="Switch account"
          onClick={onSwitchAccount}
        >
          <Img name="switchIcon" size={22} />
        </button>
      )}

      {onSearch && (
        <button type="button" className="m-pbar-icon" aria-label="Search" onClick={onSearch}>
          <Img name="new_search_icon" size={22} />
        </button>
      )}

      {onSettings && (
        <button type="button" className="m-pbar-icon" aria-label="Settings" onClick={onSettings}>
          <Img name="settings_gear_icon" size={22} />
        </button>
      )}

      <ProfileRow
        name={name}
        imgURL={imgURL}
        size="small"
        onPress={onProfile}
        className="m-pbar-avatar"
      />
    </div>
  )
}
