import { Header, PressableButton, Alert } from '@mobile/components'
import { useState } from 'react'
import { EditForm } from './EditForm'
import './EditForm.css'

/**
 * `screens/settings/EditAccount.jsx` — an account row on the Accounts screen.
 *
 * This edits the LOGIN, not a reader: username, password and the person who holds the account.
 * The readers under it are edited somewhere else entirely, which is the two-level model showing
 * through — one login at one site, several readers beneath it.
 *
 * Delete Account sits INSIDE the scroll under the last field, while Save is pinned outside it.
 * Both are hidden for a `school` client, because a school account is issued by the school and is
 * not the reader's to delete.
 */
export function EditAccount({ account, sections, onBack }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="m-edf">
      <Header variant="stack" title={account?.libraryName ?? 'Account'} onBack={onBack} />

      <EditForm
        sections={sections}
        onSave={onBack}
        footer={
          <div className="m-edf-delete">
            <PressableButton
              fullWidth
              type="danger"
              buttonText="Delete Account"
              onButtonPress={() => setConfirming(true)}
            />
          </div>
        }
      />

      {/* `deleteAccount` is a screen of its own in the app, with its own copy and a typed
          confirmation. Standing an Alert in for it keeps the action reachable without inventing
          that screen's wording. */}
      <Alert
        open={confirming}
        title="Delete Account"
        message={`This will permanently delete this account and every reader under it at ${account?.libraryName ?? 'this site'}.`}
        buttons={[
          { text: 'Cancel', style: 'cancel', onPress: () => setConfirming(false) },
          { text: 'Delete', onPress: () => setConfirming(false) },
        ]}
      />
    </div>
  )
}
