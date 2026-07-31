// Reading-partner account connections — Comics Plus and Scholastic, each
// linked (and unlinked) independently.
//
// Modelled on the live "Comics Plus ↔ Beanstack Integration" flow: a reader
// starts from a banner on their Beanstack dashboard, is handed off to the
// partner's own site to pick their library/school and sign in, confirms the two
// accounts belong to the same person, and lands back in Beanstack with the
// partner's reading logging itself from then on.
//
// `chrome` is the partner's own site styling (the handoff screens are rendered
// in their brand, not ours) and `modal` themes the account-confirmation and
// result cards that sit on top of it.

export const CONNECTION_IDS = ['comicsplus', 'scholastic']

export const CONNECTIONS = {
  comicsplus: {
    id: 'comicsplus',
    name: 'Comics Plus',
    // What the reader gets out of linking — used on the banner and in Settings.
    pitch: 'Unlimited comics, graphic novels & magazines — no holds, no waitlists.',
    bannerText: 'Link your Comics Plus account today!',
    // Partner-hosted handoff screens.
    signInTitle: 'Login to your Library/School',
    orgLabel: 'Search for library/school:',
    orgs: [
      'LibraryPass - Full Collection Demo',
      'Lincoln Public Library',
      'Magnolia Middle School',
      'Oak Elementary School',
    ],
    defaultOrg: 'LibraryPass - Full Collection Demo',
    footerCopy: '© Copyright LibraryPass 2020-2026 v-e095fcb3',
    footerLinks: ['Support', 'Terms & Conditions', 'Privacy Policy'],
    chrome: {
      headerBg: '#1B0C26',
      headerText: '#FFFFFF',
      pageBg: '#F3FAFC',
      pageText: '#3C3C3C',
      rule: '#DDDDDD',
      inputBorder: '#CCCCCC',
      link: '#1A7BC0',
      cta: '#8BC53F',
      ctaText: '#FFFFFF',
    },
    modal: {
      theme: 'dark',
      bg: '#1B0C26',
      text: '#FFFFFF',
      muted: '#B9A7C6',
      border: '#3A1E4B',
      cta: '#8BC53F',
      ctaText: '#1B0C26',
    },
    // The account the reader signs in as on the partner side.
    account: { name: 'Olivia M', initials: 'OM', color: '#F09A77' },
  },

  scholastic: {
    id: 'scholastic',
    name: 'Scholastic',
    pitch: 'Classroom magazines — fresh issues every month, leveled for your grade.',
    bannerText: 'Link your Scholastic account today!',
    signInTitle: 'Sign in to Scholastic Digital Manager',
    orgLabel: 'Find your school:',
    orgs: [
      'Magnolia Middle School',
      'Oak Elementary School',
      'Hickory Middle School',
      'Lincoln Elementary School',
    ],
    defaultOrg: 'Magnolia Middle School',
    footerCopy: '© Scholastic Inc. All rights reserved.',
    footerLinks: ['Help', 'Terms of Use', 'Privacy Policy'],
    chrome: {
      headerBg: '#E6000D',
      headerText: '#FFFFFF',
      pageBg: '#FDF6F6',
      pageText: '#333333',
      rule: '#E2E2E2',
      inputBorder: '#C9C9C9',
      link: '#0B63C5',
      cta: '#E1141C',
      ctaText: '#FFFFFF',
    },
    modal: {
      theme: 'light',
      bg: '#FFFFFF',
      text: '#18324A',
      muted: '#64748B',
      border: '#E2E8F0',
      cta: '#E1141C',
      ctaText: '#FFFFFF',
    },
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
