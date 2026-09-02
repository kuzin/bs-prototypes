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

export const OWN_SESSIONS = [
  { id: 'own-1', title: 'Front Desk', author: 'Kelly Yang', minutes: 20, when: 'Yesterday' },
  { id: 'own-2', title: 'Esperanza Rising', author: 'Pam Muñoz Ryan', minutes: 15, when: 'Sunday' },
]

// ─── Dashboard furniture ─────────────────────────────────────────────────────

export const STREAK = { current: 0, longest: 11 }

// Set so that one linked app gets Carla close and the second one carries her
// over — the whole point of showing two connections at once.
export const DAILY_GOAL = { minutes: 0, goal: 40 }

export const CHALLENGES = [
  {
    id: 'lectores',
    name: 'Lectores del Mundo',
    sub: 'Arlington ISD · Spring Challenge',
    progress: 4,
    total: 10,
    unit: 'books',
    color: '#662D91',
  },
  {
    id: 'minutes-march',
    name: 'March Minute Madness',
    sub: 'Whole school · Ends Mar 31',
    progress: 312,
    total: 600,
    unit: 'minutes',
    color: '#0DA7BC',
  },
]
