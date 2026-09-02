/**
 * Brand-level config for each reading partner Beanstack integrates with — the
 * half of a partner config that is a *fact about the partner* rather than about
 * a particular prototype's reader: their name, their pitch, the copy and
 * styling of their own sign-in pages, and how their confirmation card is themed.
 *
 * A prototype spreads a preset and adds what only it knows — which schools are
 * searchable, and who the reader is on the partner's side:
 *
 *   export const COMICS_PLUS = {
 *     ...PARTNER_PRESETS.comicsplus,
 *     orgs: ['Lincoln Public Library', …],
 *     defaultOrg: 'Lincoln Public Library',
 *     account: { name: 'carla.r', initials: 'CR', color: '#EC1E79' },
 *   }
 *
 * `chrome` is the partner's own site styling (handoff screens render in their
 * brand, not ours); `modal` themes the confirmation and result cards on top of
 * it. See PartnerConnect.jsx for the full config shape.
 */
export const PARTNER_PRESETS = {
  comicsplus: {
    id: 'comicsplus',
    name: 'Comics Plus',
    pitch: 'Unlimited comics, graphic novels & magazines — no holds, no waitlists.',
    bannerText: 'Link your Comics Plus account today!',
    signInTitle: 'Login to your Library/School',
    orgLabel: 'Search for library/school:',
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
  },

  scholastic: {
    id: 'scholastic',
    name: 'Scholastic',
    pitch: 'Classroom magazines — fresh issues every month, leveled for your grade.',
    bannerText: 'Link your Scholastic account today!',
    signInTitle: 'Sign in to Scholastic Digital Manager',
    orgLabel: 'Find your school:',
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
  },

  // Beeverso (beeverso.org) — Spanish reading-comprehension platform for K-12
  // dual-language and bilingual classrooms. Their real sign-in is a
  // username-or-NID form with Google and Clever alongside it. Colors sampled
  // from the live site: purple #662D91, deep purple #3C0458, yellow #FFCF01.
  beeverso: {
    id: 'beeverso',
    name: 'Beeverso',
    pitch:
      'Authentic Spanish books, short texts y revistas — read in Spanish, count it in Beanstack.',
    bannerText: '¡Conecta tu cuenta de Beeverso! Link your Beeverso account today!',
    signInTitle: '¡Bienvenido! Enter your data:',
    signInSub: 'Sign in with the username or NID you use for Beeverso.',
    userLabel: 'Username or NID',
    ssoOptions: [
      { id: 'google', label: 'Sign in with Google' },
      { id: 'clever', label: 'Log in with Clever' },
    ],
    orgLabel: 'Search for your school or district:',
    footerCopy: '© 2026 Beeverso. A brand of Beeverso Inc. (dba Beeverso)',
    footerLinks: ['Ayuda', 'Terms of Service', 'Privacy Policy'],
    chrome: {
      headerBg: '#3C0458',
      headerText: '#FFFFFF',
      pageBg: '#F8F4FC',
      pageText: '#3A3A3A',
      rule: '#E4DAEE',
      inputBorder: '#D3C4E2',
      link: '#662D91',
      cta: '#FFCF01',
      ctaText: '#3C0458',
    },
    modal: {
      theme: 'dark',
      bg: '#3C0458',
      text: '#FFFFFF',
      muted: '#C4A9D6',
      border: '#5B2079',
      cta: '#FFCF01',
      ctaText: '#3C0458',
    },
  },
}
