import { useState } from 'react'
import { Button } from '@components/Button/Button'

import {
  ConnectBanner,
  PartnerSwitcher,
  AutoLoggedCard,
} from '../../logging-flow/components/ConnectionBits'
import { SettingsPage } from '../../logging-flow/components/SettingsPage'
import { ConnectFlow } from '../../logging-flow/components/ConnectFlow'
import { READER } from '../../logging-flow/data'
import { Variant } from './_shared'

// The rail card borrows the consumer dashboard's card chrome.
import '../../web-app/index.css'

const noop = () => {}

const LINKED = {
  comicsplus: { account: 'olivia.m', org: 'LibraryPass - Full Collection Demo' },
  scholastic: { account: 'olivia.mcgrane', org: 'Magnolia Middle School' },
}

function ConnectFlowDemo() {
  const [partnerId, setPartnerId] = useState(null)
  return (
    <div style={{ display: 'flex', gap: 10, padding: 16, flexWrap: 'wrap' }}>
      <Button variant="secondary" size="sm" onClick={() => setPartnerId('comicsplus')}>
        Link Comics Plus
      </Button>
      <Button variant="secondary" size="sm" onClick={() => setPartnerId('scholastic')}>
        Link Scholastic
      </Button>
      {partnerId && (
        <ConnectFlow
          partnerId={partnerId}
          reader={READER}
          onCancel={() => setPartnerId(null)}
          onLinked={() => setPartnerId(null)}
        />
      )}
    </div>
  )
}

function SettingsPageDemo() {
  const [connections, setConnections] = useState({ comicsplus: LINKED.comicsplus })
  return (
    <SettingsPage
      reader={READER}
      connections={connections}
      onLink={(id) => setConnections((c) => ({ ...c, [id]: { ...LINKED[id] } }))}
      onDisconnect={(id) =>
        setConnections((c) => {
          const next = { ...c }
          delete next[id]
          return next
        })
      }
    />
  )
}

export const loggingFlowSections = [
  {
    group: 'logging-flow',
    id: 'lf-connect-banner',
    name: 'Connect Banner',
    desc: (
      <>
        The dashboard prompt to link a reading-partner account — one banner per unlinked partner, so
        Comics Plus and Scholastic are offered (and dismissed) separately. Tinted with the
        partner&apos;s own accent from <code>PARTNER_BRANDS</code>.
      </>
    ),
    render: () => (
      <Variant label="one per unlinked partner" full>
        <div style={{ padding: 16 }}>
          <ConnectBanner partnerId="comicsplus" onLink={noop} onDismiss={noop} />
          <ConnectBanner partnerId="scholastic" onLink={noop} onDismiss={noop} />
        </div>
      </Variant>
    ),
  },
  {
    group: 'logging-flow',
    id: 'lf-connect-flow',
    name: 'Connect Flow',
    desc: (
      <>
        The full account handoff, rendered in the partner&apos;s own chrome: pick your
        library/school → sign in → confirm both accounts belong to you → linked. Signing in as{' '}
        <code>taken</code> lands on the &ldquo;already connected&rdquo; error instead. Escape or
        &ldquo;Back to Beanstack&rdquo; backs out.
      </>
    ),
    render: () => (
      <Variant label="launch the handoff (full-screen overlay)" full>
        <ConnectFlowDemo />
      </Variant>
    ),
  },
  {
    group: 'logging-flow',
    id: 'lf-partner-switcher',
    name: 'Partner Switcher',
    desc: (
      <>
        The top-bar affordance the linked-accounts modal promises — &ldquo;swap between the two at
        any time using the logo in the top right.&rdquo; Shows a mark per linked app and opens a
        menu to jump over to that app&apos;s catalog or manage the connections. Renders nothing when
        nothing is linked.
      </>
    ),
    render: () => (
      <>
        <Variant label="both linked">
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16 }}>
            <PartnerSwitcher connections={LINKED} onManage={noop} onVisit={noop} />
          </div>
        </Variant>
        <Variant label="one linked">
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16 }}>
            <PartnerSwitcher
              connections={{ comicsplus: LINKED.comicsplus }}
              onManage={noop}
              onVisit={noop}
            />
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'logging-flow',
    id: 'lf-settings-page',
    name: 'Personalize Reader',
    desc: (
      <>
        The reader&apos;s settings page, and the home of <strong>App Integrations</strong> — where a
        partner account is actually connected or disconnected. Each partner is its own row, so
        linking one never touches the other. The dashboard banner and the top-bar switcher are
        shortcuts into this section.
      </>
    ),
    render: () => (
      <Variant label="Comics Plus connected, Scholastic not" full>
        <div style={{ padding: '0 24px' }}>
          <SettingsPageDemo />
        </div>
      </Variant>
    ),
  },
  {
    group: 'logging-flow',
    id: 'lf-auto-logged',
    name: 'Auto-Logged Card',
    desc: (
      <>
        The payoff of a linked account: reading that arrived from a partner without the reader
        logging anything. Lists a row per session across every linked app.
      </>
    ),
    render: () => (
      <Variant label="both partners contributing">
        <div style={{ maxWidth: 320, padding: 16 }}>
          <AutoLoggedCard connections={LINKED} />
        </div>
      </Variant>
    ),
  },
]
