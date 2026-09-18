import { Header, Img } from '@mobile/components'
import './Accounts.css'

/**
 * `screens/settings/Accounts.jsx`, reached from Settings > Account — which navigates to
 * `libraryStack`, not to an "account" screen. That indirection is the feature: Beanstack is many
 * separate sites, a reader can belong to a school's and a public library's at once, and the app
 * holds a signed-in account for each. So the row called Account opens a LIST, and the green dot
 * is the only thing saying which of them you are currently reading under.
 *
 * The two titles disagree in the source and both are kept: the navigator names the screen
 * "Accounts" and the body heads itself "Account".
 *
 * Geometry is `AccountsStyles`: 20 either side, a 48pt CIRCLE (`borderRadius: 50`, unlike the
 * rounded squares on Settings itself) holding a 22pt glyph, 16 of air above and below it, the
 * library name over the holder's at 16 from the tile, a 24pt arrow, and a hairline under every
 * row including the last.
 *
 * DIVERGENCE — tapping an account goes nowhere. `editAccount` is a form built at runtime from
 * `registration_fields.sections` off the API, so its fields are not in the source to copy; an
 * invented one would be a guess wearing a spec's clothes. The arrow stays, because there is
 * somewhere to go.
 */
export function Accounts({ accounts, onBack }) {
  return (
    <div className="m-acc">
      <Header variant="stack" title="Accounts" onBack={onBack} />

      <div className="m-acc-scroll">
        <h2 className="m-t-primary-title m-acc-heading">Account</h2>
        <span className="m-acc-rule" />

        {accounts.map((account) => (
          <div key={account.id}>
            <button type="button" className="m-acc-row">
              <span className="m-acc-tile">
                <Img name="account_icon" size={22} />
                {/* `dot` — 15pt of greenHaze ringed in 2pt of white, hung off the tile's
                    bottom-right. The ring is what keeps it legible against the peach. */}
                {account.current && (
                  <span className="m-acc-dot" aria-label="Current account" role="img" />
                )}
              </span>
              <span className="m-acc-info">
                <span className="m-t-secondary-title m-acc-library">{account.libraryName}</span>
                <span className="m-t-sub-heading m-acc-holder">{account.holder}</span>
              </span>
              <Img name="new_arrow_right" className="m-acc-arrow" />
            </button>
            <span className="m-acc-rule" />
          </div>
        ))}

        {/* `AddAccountButton` — the same row without the arrow, on a neutral tile. It navigates to
            `introStart`, which is signing in to another site: a real authentication flow, and the
            one thing on this screen a prototype cannot honestly stand in for. */}
        <button type="button" className="m-acc-row">
          <span className="m-acc-tile is-add">
            <Img name="add_icon" size={22} />
          </span>
          <span className="m-t-secondary-title m-acc-library">Add Account</span>
        </button>
        <span className="m-acc-rule" />
      </div>
    </div>
  )
}
