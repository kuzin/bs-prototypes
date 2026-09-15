// Sample data for the Beeverso Integration prototype — a Beanstack reader in a
// dual-language classroom whose reading is split across two apps: Spanish books
// and short texts in Beeverso, comics in Comics Plus.

export const READER = {
  id: 'carla',
  name: 'Carla Ramos',
  initials: 'CR',
  color: '#EC1E79',
  grade: '4th Grade',
}

// ─── What each partner has in its library ────────────────────────────────────
// Beeverso's catalog is roughly half licensed titles and half content they make
// or revive from the public domain, split three ways: books, short nonfiction
// texts, and magazines licensed from third parties. Comics Plus is comics and
// graphic novels — including Spanish editions, which is why a bilingual reader
// ends up with both apps. `kind` drives the cover treatment; `level` is the
// band Beeverso's placement test puts a reader in.

export const TITLES = [
  // ── Beeverso ──
  {
    id: 'platero',
    partner: 'beeverso',
    title: 'Platero y yo',
    author: 'Juan Ramón Jiménez',
    kind: 'book',
    cover: ['#7C4DA8', '#EC7C3C'],
    level: 'Nivel 22',
  },
  {
    id: 'cucarachita',
    partner: 'beeverso',
    title: 'La cucarachita Martina',
    author: 'Rosario Ferré',
    kind: 'book',
    cover: ['#E0457B', '#F5A623'],
    level: 'Nivel 19',
  },
  {
    id: 'selva',
    partner: 'beeverso',
    title: 'Cuentos de la selva',
    author: 'Horacio Quiroga',
    kind: 'book',
    cover: ['#1E7A5A', '#8DC63F'],
    level: 'Nivel 24',
  },
  {
    id: 'volcanes',
    partner: 'beeverso',
    title: '¿Por qué erupcionan los volcanes?',
    author: 'Texto corto · Ciencias',
    kind: 'short',
    cover: ['#C1272D', '#F7941E'],
    level: 'Nivel 21',
  },
  {
    id: 'monarca',
    partner: 'beeverso',
    title: 'El viaje de la mariposa monarca',
    author: 'Texto corto · Ciencias',
    kind: 'short',
    cover: ['#00AEEF', '#662D91'],
    level: 'Nivel 20',
  },
  {
    id: 'independencia',
    partner: 'beeverso',
    title: 'Las independencias de América',
    author: 'Texto corto · Estudios sociales',
    kind: 'short',
    cover: ['#3C0458', '#00AEEF'],
    level: 'Nivel 23',
  },
  {
    id: 'algarabia',
    partner: 'beeverso',
    title: 'Algarabía',
    author: 'Revista licenciada',
    kind: 'magazine',
    masthead: 'Algarabía',
    issue: 'Núm. 214 · Abril',
    cover: ['#FFCF01', '#EE212E'],
  },
  {
    id: 'muy-interesante',
    partner: 'beeverso',
    title: 'Muy Interesante Junior',
    author: 'Revista licenciada',
    kind: 'magazine',
    masthead: 'Muy Interesante',
    issue: 'Núm. 88 · Marzo',
    cover: ['#00AEEF', '#3C0458'],
  },

  // ── Comics Plus ──
  {
    id: 'dog-man',
    partner: 'comicsplus',
    title: 'Dog Man',
    author: 'Dav Pilkey',
    kind: 'comic',
    cover: ['#3FA9E0', '#1B5E8C'],
  },
  {
    id: 'sonrisa',
    partner: 'comicsplus',
    title: 'Sonrisa',
    author: 'Raina Telgemeier',
    kind: 'comic',
    cover: ['#F2B705', '#E0457B'],
  },
  {
    id: 'amulet',
    partner: 'comicsplus',
    title: 'Amulet: The Stonekeeper',
    author: 'Kazu Kibuishi',
    kind: 'comic',
    cover: ['#1A2433', '#6B4FA8'],
  },
  {
    id: 'narwhal',
    partner: 'comicsplus',
    title: 'Narwhal: Unicornio del mar',
    author: 'Ben Clanton',
    kind: 'comic',
    cover: ['#2BB3C0', '#7C5CFA'],
  },
]

export const TITLE_BY_ID = Object.fromEntries(TITLES.map((t) => [t.id, t]))

export const titlesFor = (partnerId) => TITLES.filter((t) => t.partner === partnerId)

// ─── What the partners log on the reader's behalf ────────────────────────────
// Minutes and titles only — nothing else crosses. (Everything else Beeverso
// tracks — comprehension scores, the reader's level band, Bee coins — stays on
// their side for now.)

export const PARTNER_SESSIONS = {
  beeverso: [
    { id: 'bv-1', title: 'platero', minutes: 22, when: 'Today', finished: false },
    { id: 'bv-2', title: 'volcanes', minutes: 9, when: 'Today', finished: true },
    { id: 'bv-3', title: 'algarabia', minutes: 14, when: 'Yesterday', finished: false },
    { id: 'bv-4', title: 'cucarachita', minutes: 26, when: 'Monday', finished: true },
    { id: 'bv-5', title: 'monarca', minutes: 8, when: 'Monday', finished: true },
  ],
  comicsplus: [
    { id: 'cp-1', title: 'dog-man', minutes: 18, when: 'Today', finished: true },
    { id: 'cp-2', title: 'sonrisa', minutes: 21, when: 'Yesterday', finished: false },
    { id: 'cp-3', title: 'amulet', minutes: 15, when: 'Monday', finished: false },
  ],
}

const sessionsFor = (partnerId) => PARTNER_SESSIONS[partnerId] || []

// Only today's reading lands on the daily goal; the rest is history the log
// backfills the moment the accounts link.
export const todayMinutes = (partnerId) =>
  sessionsFor(partnerId)
    .filter((s) => s.when === 'Today')
    .reduce((sum, s) => sum + s.minutes, 0)

/** Every linked partner's sessions, newest first, with its title resolved. */
export const importedSessions = (connections) =>
  Object.keys(PARTNER_SESSIONS)
    .filter((id) => connections[id])
    .flatMap((id) => sessionsFor(id).map((s) => ({ ...s, partnerId: id })))

// ─── Reading the reader logged herself, in Beanstack ─────────────────────────

/**
 * What Carla reads off a shelf rather than in an app — the catalog the logger
 * searches. A linked app logs itself; this is the half she still types in, and
 * having both is the point of the prototype.
 *
 * `LogFlow`'s own shape: a `cover` gradient pair, and `measure` saying what the
 * form asks her for.
 */
export const OWN_BOOKS = {
  'front-desk': {
    id: 'front-desk',
    title: 'Front Desk',
    author: 'Kelly Yang',
    cover: ['#E0457B', '#F5A623'],
    measure: 'minutes',
    pages: 286,
  },
  esperanza: {
    id: 'esperanza',
    title: 'Esperanza Rising',
    author: 'Pam Muñoz Ryan',
    cover: ['#C1272D', '#F7941E'],
    measure: 'minutes',
    pages: 262,
  },
  'mango-abuela': {
    id: 'mango-abuela',
    title: 'Mango, Abuela, and Me',
    author: 'Meg Medina',
    cover: ['#1E7A5A', '#F2B705'],
    measure: 'minutes',
    pages: 32,
  },
  'merci-suarez': {
    id: 'merci-suarez',
    title: 'Merci Suárez Changes Gears',
    author: 'Meg Medina',
    cover: ['#00AEEF', '#7C4DA8'],
    measure: 'minutes',
    pages: 368,
  },
  sonadores: {
    id: 'sonadores',
    title: 'Soñadores',
    author: 'Yuyi Morales',
    cover: ['#3C0458', '#EC7C3C'],
    measure: 'minutes',
    pages: 40,
  },
}

/**
 * Everything the logger can find: her own shelf, plus every partner title. A
 * partner's books are searchable whether or not the account is linked — she can
 * always log a Beeverso book by hand, and linking is what stops her having to.
 */
export const LOG_BOOKS = {
  ...OWN_BOOKS,
  ...Object.fromEntries(
    TITLES.map((t) => [
      t.id,
      {
        id: t.id,
        title: t.title,
        author: t.author,
        cover: t.cover,
        partner: t.partner,
        measure: 'minutes',
      },
    ]),
  ),
}

// The covers on the logger's own "recently logged" shelf — her own reading,
// since a partner's is logged for her and never goes through this flow.
export const RECENTLY_LOGGED = ['front-desk', 'esperanza', 'mango-abuela']

export const OWN_SESSIONS = [
  { id: 'own-1', book: 'front-desk', minutes: 20, when: 'Yesterday' },
  { id: 'own-2', book: 'esperanza', minutes: 15, when: 'Sunday' },
]

// ─── The reading log, as the calendar draws it ───────────────────────────────
// The log page is logging-flow's real calendar, so the sessions above have to
// land on actual days rather than "Today"/"Monday". Counted back from today
// rather than pinned to a month: a fixed week goes stale, and anything the
// reader logs here and now has to land in the same month as the history it is
// being added to.

/** `n` days ago, as the `YYYY-MM-DD` the calendar keys on. */
export const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const DAY_OFFSET = { Today: 0, Yesterday: 1, Monday: 3, Sunday: 4 }
const dayDate = (when) => daysAgo(DAY_OFFSET[when] ?? 0)

/* Beeverso violet, Comics Plus green — one colour per app, so a glance at the
   month says which of them logged what. (`tone` is the shared log's own set:
   blue, pink, green, amber, violet, red. It had been carrying `purple` and
   `teal`, which aren't in it, so every imported row drew with no ground at
   all.) */
const PARTNER_TONE = { beeverso: 'violet', comicsplus: 'green' }

/**
 * Every session — the reader's own, anything she has logged in this session,
 * and each linked app's — as calendar entries. An imported one carries its app
 * in `source`, which is what puts the partner's mark on the row and turns on
 * the "imported" key.
 */
export const readingLogEntries = (connections, logged = []) => [
  ...OWN_SESSIONS.map((s) => {
    const b = OWN_BOOKS[s.book]
    return {
      id: s.id,
      date: dayDate(s.when),
      kind: 'log',
      title: b?.title ?? s.book,
      author: b?.author,
      minutes: s.minutes,
      tone: 'blue',
    }
  }),
  ...logged,
  ...importedSessions(connections).map((s) => {
    const t = TITLE_BY_ID[s.title]
    return {
      id: s.id,
      date: dayDate(s.when),
      kind: 'log',
      title: t?.title ?? s.title,
      author: t?.author,
      minutes: s.minutes,
      completed: s.finished,
      source: s.partnerId,
      tone: PARTNER_TONE[s.partnerId] ?? 'blue',
    }
  }),
]

/**
 * `completed_summary_earnables` — what finishing a title wins her here. One
 * card, from the challenge she's actually in: the logger ships a fixture of its
 * own, and left to it the success screen credited a challenge this site has
 * never run.
 */
export const EARNED_CARDS = [
  {
    id: 'lectora-del-mundo',
    label: 'Badge Earned',
    eyebrow: 'Lectora del Mundo',
    title: 'Finish a Title',
    description: 'Lectores del Mundo',
    art: '/bs-prototypes/challenge-badges/spring-into-reading/butterfly.webp',
    reward: 'Sticker Pack',
    tickets: 2,
    challenge: 'lectores',
  },
]

// ─── Dashboard furniture ─────────────────────────────────────────────────────

export const STREAK = { current: 0, longest: 11 }

// Set so that one linked app gets Carla close and the second one carries her
// over — the whole point of showing two connections at once.
export const DAILY_GOAL = { minutes: 0, goal: 40 }

/**
 * The shared reader `ChallengeCard`'s shape: a drawn cover keyed by `art`, the
 * name and dates, and the type chips — `logTypes` for what you log toward it,
 * `types` for what kind of challenge it is. (`badge`, the single pill these
 * carried before, is the card's legacy fallback: it renders one filled accent
 * pill instead of the green chip row every other challenge in the app wears.)
 */
export const CHALLENGES = [
  {
    id: 'lectores',
    art: 'lectores',
    tint: '#7B3FA8',
    title: 'Lectores del Mundo',
    dates: 'Arlington ISD · Spring Challenge',
    logTypes: ['books', 'minutes'],
    badges: 'spring-into-reading',
  },
  {
    id: 'minutes-march',
    art: 'minutes-march',
    tint: '#0C7E8E',
    title: 'March Minute Madness',
    dates: 'Whole school · Ends Mar 31',
    logTypes: ['minutes'],
  },
]
