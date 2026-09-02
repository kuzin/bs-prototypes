// Reading-partner account connections — Comics Plus and Scholastic, each
// linked (and unlinked) independently.
//
// Modelled on the live "Comics Plus ↔ Beanstack Integration" flow: a reader
// starts from a banner on their Beanstack dashboard, is handed off to the
// partner's own site to pick their library/school and sign in, confirms the two
// accounts belong to the same person, and lands back in Beanstack with the
// partner's reading logging itself from then on.
//
// The partner's own branding and sign-in copy live in the shared
// `PARTNER_PRESETS`; what's added here is what only this prototype knows —
// which orgs are searchable, and who Olivia is on each partner's side.

import { PARTNER_PRESETS } from '@components/PartnerConnect/partners'

export const CONNECTION_IDS = ['comicsplus', 'scholastic']

export const CONNECTIONS = {
  comicsplus: {
    ...PARTNER_PRESETS.comicsplus,
    orgs: [
      'LibraryPass - Full Collection Demo',
      'Lincoln Public Library',
      'Magnolia Middle School',
      'Oak Elementary School',
    ],
    defaultOrg: 'LibraryPass - Full Collection Demo',
    account: { name: 'Olivia M', initials: 'OM', color: '#F09A77' },
  },

  scholastic: {
    ...PARTNER_PRESETS.scholastic,
    orgs: [
      'Magnolia Middle School',
      'Oak Elementary School',
      'Hickory Middle School',
      'Lincoln Elementary School',
    ],
    defaultOrg: 'Magnolia Middle School',
    account: { name: 'olivia.mcgrane', initials: 'OM', color: '#F09A77' },
  },
}

// Usernames that already belong to somebody else's Beanstack account — signing
// in as one of these lands on the "already connected" error state.
export const TAKEN_USERNAMES = ['taken', 'omcgrane', 'demo']

// Reading the partner logs on the reader's behalf once connected. These are the
// sessions waiting in Beanstack the next time the reader opens the log flow.
export const PARTNER_SESSIONS = {
  comicsplus: [
    { id: 'cp-1', book: 'dog-man', minutes: 24, when: 'Today', finished: true },
    { id: 'cp-2', book: 'amulet', minutes: 18, when: 'Today' },
  ],
  scholastic: [{ id: 'sc-1', book: 'scholastic-news', minutes: 12, when: 'Today' }],
}

export const partnerMinutes = (id) =>
  (PARTNER_SESSIONS[id] || []).reduce((sum, s) => sum + s.minutes, 0)

// Every partner as a list, for the switcher and the settings page.
export const CONNECTION_LIST = CONNECTION_IDS.map((id) => CONNECTIONS[id])

// The auto-logged rail card takes display-ready rows, since only this prototype
// knows how to turn a book key into a title.
export const autoLoggedRows = (connections, books) =>
  CONNECTION_IDS.filter((id) => connections[id]).flatMap((id) =>
    (PARTNER_SESSIONS[id] || []).map((s) => ({
      id: s.id,
      partnerId: id,
      title: books[s.book]?.title ?? s.book,
      meta: `${CONNECTIONS[id].name} · ${s.when}${s.finished ? ' · Finished' : ''}`,
      minutes: s.minutes,
    })),
  )
