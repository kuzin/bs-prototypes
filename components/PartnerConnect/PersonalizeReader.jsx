import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { PartnerBrand } from '@components/PartnerBrand/PartnerBrand'

import '@components/PartnerConnect/PersonalizeReader.css'

import '@components/Button/Button.css'

/**
 * Beanstack's "Personalize Reader" page — where a reader's App Integrations
 * live. Connecting or disconnecting a reading partner happens here; the
 * dashboard banner and the top-bar switcher are just shortcuts into it.
 *
 * Everything outside App Integrations is a faithful but inert replica of the
 * real page, so the integration section reads in its actual context.
 *
 * `partners` is the prototype's own list of partner configs (see PartnerConnect).
 */
export function PersonalizeReader({
  reader,
  partners = [],
  connections = {},
  onLink,
  onDisconnect,
}) {
  const [emails, setEmails] = useState('yes')

  return (
    <div className="st-page">
      <h1 className="st-title">Personalize Reader</h1>

      <div className="st-layout">
        <div className="st-avatar-col">
          <span className="st-avatar" style={{ background: '#FBDDD0' }}>
            <span className="st-avatar-initials">{reader.initials}</span>
            <span className="st-avatar-edit" aria-hidden="true">
              <Icon name="pencil" size={13} />
            </span>
          </span>
        </div>

        <div className="st-main">
          <section className="st-section">
            <h2 className="st-h2">Preferences</h2>
            <button className="st-linkrow" type="button">
              <span className="st-linkrow-label">Basic Information</span>
              <Icon name="chevron-right" size={18} />
            </button>
          </section>

          <section className="st-section">
            <h2 className="st-h2">Email Notifications</h2>
            <div className="st-rule">
              <div className="st-row">
                <span className="st-row-label">
                  Would you like to receive email notifications for this reader?
                </span>
                <div className="st-yesno">
                  {['yes', 'no'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={`st-yesno-btn${emails === v ? ' is-active' : ''}`}
                      onClick={() => setEmails(v)}
                    >
                      {v === 'yes' ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Button variant="secondary" size="md">
              Save
            </Button>
          </section>

          {/* ── The integration surface ───────────────────────────────────
              Skipped entirely when there are no partners to offer — an empty
              heading + hint is worse than no section. */}
          {partners.length > 0 && (
            <section className="st-section" id="app-integrations">
              <h2 className="st-h2">App Integrations</h2>
              <p className="st-hint">
                Link a reading app and Beanstack logs what {reader.name.split(' ')[0]} reads there
                automatically. Each app connects separately.
              </p>
              <div className="st-integrations">
                {partners.map(({ id }) => {
                  const conn = connections[id]
                  return (
                    <div key={id} className="st-integration">
                      <div className="st-integration-brand">
                        <PartnerBrand id={id} size="md" wordmarkOnly />
                        {conn && (
                          <span className="st-integration-acct">
                            {conn.account} · {conn.org}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => (conn ? onDisconnect?.(id) : onLink?.(id))}
                      >
                        {conn ? 'Disconnect' : 'Connect Account'}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          <section className="st-section">
            <h2 className="st-h2">Share This Reader</h2>
            <p className="st-body">
              Sharing gives family, teachers, and friends access to this profile&apos;s
              recommendations, reading log, and badges. This can be useful for keeping them
              up-to-date or giving them the opportunity to collaborate.
            </p>
            <div className="st-field">
              <div className="st-label">Invitee Email</div>
              <input className="st-input" placeholder="Enter one email address at a time" />
            </div>
            <Button variant="secondary" size="md">
              Send
            </Button>
          </section>

          <section className="st-section">
            <h2 className="st-h2">Delete Reader</h2>
            <p className="st-body">
              All data associated with this reader, and only this reader, will be permanently
              deleted.
            </p>
            <p className="st-warn">
              Warning: This cannot be undone, even by the Beanstack support team. This action is
              final!
            </p>
            <label className="st-check">
              <input type="checkbox" disabled />
              <span>I understand that this action is absolutely irreversible.</span>
            </label>
            <label className="st-check">
              <input type="checkbox" disabled />
              <span>
                I understand that deleting this reader will delete all data and history associated
                with them.
              </span>
            </label>
            <button className="st-delete" type="button" disabled>
              Permanently Delete Reader
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
