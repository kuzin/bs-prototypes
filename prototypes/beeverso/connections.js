// Carla's two reading apps, each linked (and unlinked) on its own.
//
// Beeverso is the one this prototype is about — a Spanish reading-comprehension
// platform for K-12 dual-language classrooms. Comics Plus rides along to show
// what the surface looks like once a reader has *more than one* app connected:
// two banners, two marks in the switcher, and one reading log that both feed.
//
// Branding and sign-in copy come from the shared `PARTNER_PRESETS`; what's here
// is what only this prototype knows — Carla's districts and her accounts.

import { PARTNER_PRESETS } from '@components/PartnerConnect/partners'

const DISTRICTS = [
  'Arlington ISD',
  'Cedar Hill ISD',
  'Del Valle ISD',
  'Harris Bilingual School',
  'McNutt Elementary',
  'Union Hill Elementary School',
]

export const BEEVERSO = {
  ...PARTNER_PRESETS.beeverso,
  // District selection comes first because that's what routes a Clever or
  // ClassLink reader to the right library.
  orgs: DISTRICTS,
  defaultOrg: 'Arlington ISD',
  account: { name: 'carlamos', initials: 'CM', color: '#EC1E79' },
}

export const COMICS_PLUS = {
  ...PARTNER_PRESETS.comicsplus,
  // Comics Plus is sold to libraries as well as schools, so Carla's public
  // library sits alongside her district.
  orgs: ['Arlington Public Library', ...DISTRICTS],
  defaultOrg: 'Arlington Public Library',
  account: { name: 'carla.ramos', initials: 'CR', color: '#F09A77' },
}

// Order matters: it drives the banners, the switcher, and the settings rows.
export const PARTNERS = [BEEVERSO, COMICS_PLUS]

export const PARTNER_BY_ID = Object.fromEntries(PARTNERS.map((p) => [p.id, p]))

// Usernames that already belong to somebody else's Beanstack account — signing
// in as one of these lands on the "already connected" error state.
export const TAKEN_USERNAMES = ['taken', 'carlam', 'demo']
