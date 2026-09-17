import { useState } from 'react'
import { Header, Img, Alert, PressableButton } from '@mobile/components'
import './Settings.css'

/**
 * `screens/settings/Settings.tsx` — where the header's gear goes.
 *
 * Four rows, a Log Out, and the version. The rows are `renderBasicListItems`, the app's own list
 * shape: a 48pt rounded-square tile in the row's OWN colour holding a 22pt icon, the title 16 to
 * its right, a disclosure chevron at the end, and a hairline under everything but the last —
 * `middle: false` on About is what stops the list closing with a rule against the button below it.
 *
 * The four colours are declared per row in the source rather than derived, which is why they are
 * literals here too: peach, ice, butter and a green that is `brandColors.greenLight`.
 *
 * Log Out confirms through `Alert.alert` with `{ cancelable: false }` — no backdrop dismissal,
 * the buttons are the only way out — and the copy is the app's.
 *
 * DIVERGENCE — the rows go nowhere. Each is a stack of its own in the app (`libraryStack`,
 * `readersStack`, `help`, `about`), which is four more screens than this prototype has; they keep
 * their chevrons because the chevron is what says there is somewhere to go.
 */
const ROWS = [
  { title: 'Account', icon: 'account_icon', color: '#FCE0D6', middle: true },
  { title: 'Readers', icon: 'readers_icon', color: '#DDF6F9', middle: true },
  { title: 'Help', icon: 'help_icon', color: '#FFECC8', middle: true },
  { title: 'About', icon: 'about_icon_green', color: '#DBF2E7', middle: false },
]

export function Settings({ onBack, onSignOut }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="m-set">
      <Header variant="stack" title="Settings" onBack={onBack} />

      <div className="m-set-scroll">
        <div className="m-set-list">
          {ROWS.map((row) => (
            <div key={row.title} className="m-set-item">
              <button type="button" className="m-set-row">
                <span className="m-set-tile" style={{ background: row.color }}>
                  <Img name={row.icon} size={22} />
                </span>
                <span className="m-t-primary-title m-set-title">{row.title}</span>
                <Img name="disclosure_indicator" className="m-set-chevron" />
              </button>
              {row.middle && <span className="m-set-rule" />}
            </div>
          ))}
        </div>

        <PressableButton
          fullWidth
          type="grey"
          buttonText="Log Out"
          onButtonPress={() => setConfirming(true)}
          className="m-set-signout"
        />

        <div className="m-set-foot">
          <Img name="logo_grey" className="m-set-logo" />
          <span className="m-set-version">v6.4.1</span>
        </div>
      </div>

      <Alert
        open={confirming}
        title="Sign Out"
        message="Are you sure you would like to sign out of Beanstack?"
        buttons={[
          { text: 'Cancel', style: 'cancel', onPress: () => setConfirming(false) },
          {
            text: 'Sign Out',
            onPress: () => {
              setConfirming(false)
              onSignOut?.()
            },
          },
        ]}
      />
    </div>
  )
}
