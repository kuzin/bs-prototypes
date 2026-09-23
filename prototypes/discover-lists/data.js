// The staff side of the reader's Discover page.
//
// A "Discover list" is the app's own `ReadingList` — what the admin nav calls
// **Book Lists** (`navigation/sidebar/_recommendation_nav`: "Book Lists" →
// `lists_profile_path`). This prototype is that feature moved onto Discover, so
// the record is the real one and the fields are the ones the real form asks
// for (`new_admin/reading_lists/_form_fields.html.haml`):
//
//   state              active / inactive        the Active toggle
//   name               1–100 chars, required    "Title"
//   description        free text
//   reading_list_image ≥625px wide              the shelf's art
//   external_list      on this site / another   a list that lives elsewhere
//   external_list_url  http(s)://, ≤255 chars
//   grade_levels       many, REQUIRED           "Suggested grade levels"
//   genres             many
//   keywords           comma-separated          "Searchable Keywords"
//
// Reading List Challenges are a different thing and are not touched here: a
// challenge carries a list as its *requirement* (`ChallengeBookList` —
// `program_books_requirement_type`, `minimum_required_program_books`), where
// this is a shelf to browse.
//
// The titles come from the Book Discovery prototype's catalog, because the list
// a teacher builds here is the shelf a reader sees there — one catalog, or the
// preview would be showing books that don't exist.
import { BOOKS, getBooks, SHELVES } from '../books/data'
import { TITLES_BY_GENRE } from '../rmi/library.js'

export { BOOKS, getBooks }

/* Two catalogs meet on a class list. The Book Discovery prototype's is what the
   picker searches and what the Discover preview draws from; the Collection
   Engine's recommendation shelf — the other way a teacher adds a book — runs on
   the RMI library, which is a different set with its own ids. A book added from
   Recommendations has to survive the trip, so a list resolves an id against
   whichever catalog holds it and normalises what comes back to the fields a row
   and a cover need. */
const CE_TITLES = Object.fromEntries(
  Object.values(TITLES_BY_GENRE)
    .flat()
    .map((t) => [t.id, t]),
)

export function resolveBooks(ids = []) {
  return ids
    .map((id) => {
      const book = BOOKS.find((b) => b.id === id)
      if (book) return book
      const t = CE_TITLES[id]
      return t ? { id: t.id, title: t.title, author: t.author, coverId: t.coverId } : null
    })
    .filter(Boolean)
}

// ─── Who is looking ──────────────────────────────────────────────────────────
/* Today only Media Specialist and Media Specialist Plus can touch a reading
   list at all — `admin_abilities/media_specialist.rb` and its Plus twin carry
   an identical `media_specialist_reading_lists` block, and
   `admin_abilities/teacher.rb` has no reading-list rule of any kind. Giving
   teachers their own lists is the new thing this prototype proposes, so the
   role switcher is the point of it rather than decoration.

   The one permission that already differs in the real ability is scope, not
   verb: create/read/preview/duplicate/show-hide apply to `:all`, while
   update/destroy are fenced to `microsite_id:` — a site's own lists. That is
   the same shape as `ownOnly` below, one level down. */
export const ROLES = {
  teacher: {
    id: 'teacher',
    label: 'Teacher',
    name: 'Mr. Reyes',
    who: 'Grade 4 Teacher',
    ownOnly: true,
    canOrder: false,
    note: 'A class list is kept on that class’s own page, beside its roster.',
  },
  media_specialist: {
    id: 'media_specialist',
    label: 'Media Specialist',
    name: 'Ms. Rivera',
    who: 'Media Specialist',
    ownOnly: false,
    canOrder: true,
    note: 'You can build, order and hide every list on Discover.',
  },
  media_specialist_plus: {
    id: 'media_specialist_plus',
    label: 'Media Specialist Plus',
    name: 'Ms. Okonkwo',
    who: 'Media Specialist Plus',
    ownOnly: false,
    canOrder: true,
    note: 'You can build, order and hide every list on Discover.',
  },
}
/* Two views, not three: `media_specialist_plus` is still a real role and still
   owns lists here, but its reading-list abilities are byte-identical to
   `media_specialist`'s — the two `media_specialist_reading_lists` blocks match
   line for line — so a third tab showed the same screen twice. */
export const ROLE_ORDER = ['teacher', 'media_specialist']

// ─── The options the real form offers ────────────────────────────────────────
/* `GradeLevel.exclude_not_applicable` for a school site, and the genres the
   Book Discovery catalog actually uses — the form reads genres off
   `@current_microsite.genres`, so a site only ever offers its own. */
export const GRADE_LEVELS = [
  'Pre-K',
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
  '7th Grade',
  '8th Grade',
]

export const GENRE_OPTIONS = [...new Set(BOOKS.flatMap((b) => b.genres ?? []))].sort()

// ─── Classrooms ──────────────────────────────────────────────────────────────
/* A teacher's list belongs to a classroom, not to the teacher — they can keep
   one per class, and a reader only ever sees the one for the class they're in.
   The app's own record is a `Group`: a named set of profiles belonging to a
   user inside a microsite, which is what the admin nav's Classes and Groups
   rows both lead to.

   Mr. Reyes has three; two carry a list and one doesn't, which is the case the
   page has to read correctly. */
export const CLASSROOMS = [
  { id: 'class-a', name: 'Class A', grade: '4th Grade', teacher: 'teacher' },
  { id: 'class-b', name: 'Class B', grade: '4th Grade', teacher: 'teacher' },
  { id: 'class-c', name: 'Class C', grade: '4th Grade', teacher: 'teacher' },
]
export const CLASSROOM_BY_ID = Object.fromEntries(CLASSROOMS.map((c) => [c.id, c]))

/* Which classrooms a role is responsible for. A teacher has their own; a media
   specialist can see every classroom's list but owns none of them. */
export const classroomsFor = (role) =>
  role.ownOnly ? CLASSROOMS.filter((c) => c.teacher === role.id) : CLASSROOMS

// ─── The site's lists ────────────────────────────────────────────────────────
/* Seeded from the Discover page itself: `reyes-picks` is the curated shelf the
   reader already sees, so editing it here changes something that exists rather
   than a list invented for this screen. The rest are the lists a school of this
   size would have alongside it.

   `owner` is the role that made it — a teacher's list belongs to them, a media
   specialist's belongs to the site. The order of this array is the order the
   lists fall in on Discover; the system rows (Benny's Picks, Trending) and the
   partner racks are not in here, because staff don't curate those. */
const readerPicks = SHELVES.find((s) => s.id === 'reyes-picks')

export const SEED_LISTS = [
  {
    id: 'reyes-picks',
    name: 'Mr. Reyes’s Class Picks',
    description:
      'Seven books I hand to my fourth graders when they tell me they don’t know what to read next. Start anywhere.',
    owner: 'teacher',
    ownerName: 'Mr. Reyes',
    ownerWho: 'Grade 4 Teacher',
    scope: 'class',
    classroomId: 'class-a',
    active: true,
    external: false,
    externalUrl: '',
    grades: ['4th Grade'],
    genres: ['Realistic Fiction'],
    keywords: 'class picks, read next, fourth grade',
    books: readerPicks?.books ?? [],
    accent: '#B43DD0',
    updated: 'Sep 18, 2026',
  },
  /* A list the partner supplies, not the school. Comics Plus curates it, ships
     it with the integration and keeps it current — so a site can show it or
     look at it, and nothing else: there is no version of it that belongs to
     this school to edit, and turning it off would be turning off part of what
     the subscription is.

     The app already has the shape one step weaker — `_created_by_us.html.haml`
     lists Beanstack-curated lists with Preview but no Edit unless
     `can?(:edit, list)`, and only a Show/Hide toggle. `locked` is that, with
     the toggle taken away too. */
  {
    id: 'comicsplus-staff-picks',
    name: 'Comics Plus Staff Picks',
    description:
      'Curated by the Comics Plus librarians and refreshed every month. Everything on it is included with your subscription.',
    owner: 'partner',
    ownerName: 'Comics Plus',
    ownerWho: 'Partner',
    partner: 'comicsplus',
    locked: true,
    scope: 'site',
    active: true,
    external: false,
    externalUrl: '',
    grades: ['3rd Grade', '4th Grade', '5th Grade', '6th Grade'],
    genres: ['Graphic Novel', 'Humor', 'Adventure'],
    keywords: 'comics plus, graphic novels, included',
    books: ['dog-man', 'amulet', 'investigators', 'cat-kid', 'new-kid'],
    accent: '#0CA7BC',
    updated: 'Sep 20, 2026',
  },
  {
    id: 'graphic-novels',
    name: 'Graphic Novels We Love',
    description: 'Every graphic novel in the building, and a few you can read on Comics Plus.',
    owner: 'media_specialist',
    ownerName: 'Ms. Rivera',
    ownerWho: 'Media Specialist',
    scope: 'site',
    active: true,
    external: false,
    externalUrl: '',
    grades: ['3rd Grade', '4th Grade', '5th Grade'],
    genres: ['Graphic Novel', 'Humor'],
    keywords: 'graphic novels, comics, dog man',
    books: ['dog-man', 'amulet', 'cat-kid', 'new-kid', 'investigators', 'smile', 'el-deafo'],
    accent: '#0CA7BC',
    updated: 'Sep 9, 2026',
  },
  {
    id: 'nonfiction-story',
    name: 'Nonfiction That Reads Like a Story',
    description: 'True, and impossible to put down. For readers who say they only like real stuff.',
    owner: 'media_specialist',
    ownerName: 'Ms. Rivera',
    ownerWho: 'Media Specialist',
    scope: 'site',
    active: true,
    external: false,
    externalUrl: '',
    grades: ['4th Grade', '5th Grade', '6th Grade'],
    genres: ['Nonfiction'],
    keywords: 'nonfiction, true stories, biography',
    books: ['crossover', 'brown-girl', 'refugee'],
    accent: '#0BA85F',
    updated: 'Aug 28, 2026',
  },
  {
    id: 'summer-2026',
    name: 'Summer Reading 2026',
    description: 'The summer list. Ten books, any order, all available on Sora.',
    owner: 'media_specialist_plus',
    ownerName: 'Ms. Okonkwo',
    ownerWho: 'Media Specialist Plus',
    scope: 'site',
    active: false,
    external: false,
    externalUrl: '',
    grades: ['3rd Grade', '4th Grade', '5th Grade'],
    genres: ['Adventure', 'Fantasy'],
    keywords: 'summer, summer reading, sora',
    books: ['wild-robot', 'matilda', 'pax', 'lightning-thief', 'holes', 'hatchet'],
    accent: '#E8553A',
    updated: 'Jun 2, 2026',
  },
  {
    id: 'newbery',
    name: 'Newbery Medal Winners',
    description: 'The ALA’s full list of medal winners, kept up to date on their site.',
    owner: 'media_specialist',
    ownerName: 'Ms. Rivera',
    ownerWho: 'Media Specialist',
    scope: 'site',
    active: true,
    // The real form's second question: a list can live somewhere else entirely.
    external: true,
    externalUrl: 'https://www.ala.org/alsc/awardsgrants/bookmedia/newbery',
    grades: ['4th Grade', '5th Grade', '6th Grade'],
    genres: ['Realistic Fiction', 'Historical'],
    keywords: 'newbery, award winners, medal',
    books: [],
    accent: '#B45309',
    updated: 'Sep 1, 2026',
  },
  {
    id: 'reyes-poetry',
    name: 'Poems Worth Saying Out Loud',
    description: 'A short list for our Friday read-aloud. Novels in verse, mostly.',
    owner: 'teacher',
    ownerName: 'Mr. Reyes',
    ownerWho: 'Grade 4 Teacher',
    scope: 'class',
    classroomId: 'class-b',
    active: false,
    external: false,
    externalUrl: '',
    grades: ['4th Grade'],
    genres: ['Novel in Verse'],
    keywords: 'poetry, read aloud, novels in verse',
    books: ['crossover', 'brown-girl'],
    accent: '#9D174D',
    updated: 'Sep 15, 2026',
  },
]

/** A blank list, with the defaults the real form opens on.

    A classroom's list is not configured, only curated: a teacher adds books to
    it and that is all they do, so its name, its grade and its place on Discover
    come from the class rather than from a form nobody fills in. */
export const blankList = (role, classroom = null) => ({
  id: `list-${Date.now()}`,
  name: classroom ? `${classroom.name}’s Book List` : '',
  description: classroom ? `Books ${role.name} picked for ${classroom.name}.` : '',
  owner: role.id,
  ownerName: role.name,
  ownerWho: role.who,
  scope: classroom ? 'class' : 'site',
  classroomId: classroom?.id ?? null,
  // `HasState`'s INITIAL_STATE is active, so a new list starts on.
  active: true,
  external: false,
  externalUrl: '',
  grades: classroom ? [classroom.grade] : [],
  genres: [],
  keywords: '',
  books: [],
  accent: '#0CA7BC',
  updated: 'Just now',
})

// ─── How long a list can be ──────────────────────────────────────────────────
/* Twenty books. A Discover shelf is something a reader browses, not a catalog
   they search — past about twenty it stops being a recommendation and starts
   being a backlog, and the shelf itself only ever shows the first few with a
   way into the rest. The cap is stated once here and read by every surface
   that can add a book, so the picker, the editor and the recommendation
   bookmark all stop at the same place. */
export const MAX_BOOKS = 20
export const isFull = (list) => (list?.books?.length ?? 0) >= MAX_BOOKS

// ─── The classroom slot ──────────────────────────────────────────────────────
/* Discover shows a reader one classroom list — whichever their class keeps —
   so in the site's running order that is a single position, not a list. It
   sits in the order as a row you can move but not open: which books land there
   is the teacher's call and differs per reader, so there is nothing here to
   edit, hide or preview. A media specialist decides *where* it falls; the
   teacher decides *what* it is.

   Modelled as a member of the order array so moving it is the same operation
   as moving any other row, rather than a separate index to keep in step. */
export const CLASSROOM_SLOT = {
  id: '__classroom-slot',
  slot: true,
  name: 'The reader’s classroom list',
  scope: 'class',
}
export const isSlot = (l) => l?.slot === true

// ─── What a role may do to a list ────────────────────────────────────────────
/* One place, so the table, the editor and the preview can't disagree about it.
   A teacher's own list is theirs; everything else they can look at. */
/* A locked list belongs to whoever supplies it — no role here can change it,
   which is a different thing from a role not having the permission. */
export const canEdit = (role, list) =>
  !isSlot(list) && !list?.locked && (!role.ownOnly || list.owner === role.id)

/** Shown on Discover whether the site likes it or not. */
export const isLocked = (list) => Boolean(list?.locked)

/* `name` is the only required text on the real form, and `grade_levels` is the
   only required collection (`validates_presence_of [:name, :grade_levels,
   :microsite]`). An external list needs its URL on top of that. */
export function listErrors(list) {
  const errors = {}
  if (!list.name.trim()) errors.name = 'Give the list a title.'
  else if (list.name.length > 100) errors.name = 'A title runs to 100 characters.'
  if (!list.grades.length) errors.grades = 'Pick at least one grade level.'
  if (list.external) {
    if (!list.externalUrl.trim()) errors.externalUrl = 'A list on another site needs its address.'
    else if (!/^https?:\/\//i.test(list.externalUrl))
      errors.externalUrl = 'Start the address with http:// or https://'
    else if (list.externalUrl.length > 255)
      errors.externalUrl = 'An address runs to 255 characters.'
  }
  return errors
}

// ─── The catalog search behind "Add a Book" ──────────────────────────────────
/* The real modal has two tabs (`reading_list_editor.html.haml`): **Curated
   Books**, which is "all the books that you have added or that have been
   curated by Beanstack", and **Web Search**, "an external search of other
   databases… by title and author, or by ISBN". They are two different sources,
   so they stay two tabs rather than one box with a scope toggle.

   Here the curated tab searches the catalog the Discovery prototype ships, and
   the web tab is the same records searched by ISBN as well — a stand-in for the
   external database, which is a real service this prototype can't reach. */
export const SEARCH_TABS = [
  {
    id: 'curated',
    label: 'Curated Books',
    blurb:
      'Every book your site has added, plus the ones Beanstack curates. If a book isn’t here, try a web search.',
  },
  {
    id: 'web',
    label: 'Web Search',
    blurb: 'Searches outside Beanstack. Look up a title and author, or paste an ISBN.',
  },
]

export function searchCatalog({ tab, title = '', author = '', isbn = '' }) {
  const t = title.trim().toLowerCase()
  const a = author.trim().toLowerCase()
  const i = isbn.replace(/[^0-9Xx]/g, '')
  if (!t && !a && !i) return []
  return BOOKS.filter((b) => {
    // ISBN is the web tab's own field — the curated side searches the books
    // your site named, and a librarian names a book by its title.
    if (i) return tab === 'web' && (b.isbn || '').includes(i)
    const okTitle = !t || b.title.toLowerCase().includes(t)
    const okAuthor = !a || b.author.toLowerCase().includes(a)
    return okTitle && okAuthor
  }).slice(0, 12)
}

/* The real `GradeLevel` names are what the form offers and what gets saved —
   "3rd Grade", "4th Grade". Three of them spelled out is a cell of its own, so
   a run of consecutive grades reads as a range in a table. Same values, said
   shorter; nothing is dropped, because a gap breaks the run. */
export function gradeRange(grades) {
  if (!grades.length) return '—'
  const idx = grades.map((g) => GRADE_LEVELS.indexOf(g)).sort((a, b) => a - b)
  const runs = []
  for (const i of idx) {
    const last = runs[runs.length - 1]
    if (last && i === last[1] + 1) last[1] = i
    else runs.push([i, i])
  }
  const short = (i) => GRADE_LEVELS[i].replace(' Grade', '')
  return runs
    .map(([a, b]) => (a === b ? short(a) : `${short(a)}–${short(b)}`))
    .join(', ')
    .concat(idx.some((i) => i > 1) ? ' Grade' : '')
}
