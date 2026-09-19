/** Fixture data. Shapes follow the app's own vocabulary and field names. */

export const READER = {
  name: 'Maya Chen',
  tandems: [
    { name: 'Maya', imgURL: null, linked: false },
    { name: 'Theo Chen', imgURL: null, linked: true },
    { name: 'Ada Chen', imgURL: null, linked: true },
  ],
}

/**
 * The streak card's copy arrives as one `streak_message` string that the app splits on sentence
 * boundaries — the first sentence becomes the title, the remainder the message.
 */
export const STREAK = {
  goalMinutes: 20,
  totalMinutes: 13,
  streak: 12,
  title: 'You’re on a roll!',
  message: 'You’ve read 12 days in a row. Log today to keep it going.',
  lostStreak: false,
}

/** `challenge_dates` is pre-formatted by the API; the app only shortens the month names. */
export const HOME_CHALLENGES = [
  {
    id: 'c1',
    name: 'Summer Reading 2026',
    dates: 'Jun 1 - Aug 31',
    banner: 'linear-gradient(135deg,#F26430,#FFBC42)',
  },
  {
    id: 'c2',
    name: 'Mystery Month',
    dates: 'Sept 1 - Sept 30',
    banner: 'linear-gradient(135deg,#822C95,#B43DD0)',
  },
  {
    id: 'c3',
    name: 'Ms. Abbott’s Class Challenge',
    dates: 'Ongoing Challenge',
    banner: 'linear-gradient(135deg,#154887,#196DD5)',
  },
]

/* Author and page count travel with a title, because the book panel merges whatever it is handed
   over its own fixture — without them, tapping Amari on Home showed Peter Brown. */
export const RECENT_TITLES = [
  {
    id: 'b1',
    title: 'The Wild Robot',
    author: 'Peter Brown',
    pageCount: 279,
    cover: 'linear-gradient(150deg,#2f6f4f,#7bb98f)',
  },
  {
    id: 'b2',
    title: 'Amari and the Night Brothers',
    author: 'B. B. Alston',
    pageCount: 407,
    cover: 'linear-gradient(150deg,#2b2a6b,#6d6ac4)',
  },
  {
    id: 'b3',
    title: 'New Kid',
    author: 'Jerry Craft',
    pageCount: 256,
    cover: 'linear-gradient(150deg,#1f5f8b,#6fb3d6)',
  },
  {
    id: 'b4',
    title: 'Wings of Fire',
    author: 'Tui T. Sutherland',
    pageCount: 336,
    cover: 'linear-gradient(150deg,#8a3d2e,#d98b6a)',
  },
]

/** `useStatistics('allTime')` → total_minutes / total_pages / total_books / total_sessions. */
export const ALL_TIME_STATS = {
  totalMinutes: '1,240',
  totalPages: '4,318',
  totalBooks: '18',
  totalSessions: '86',
}

/**
 * Badge artwork is API-served per badge (`badge_image_thumb_url`), so there is no bundled asset to
 * mirror. These gradients stand in for it, the same way the challenge banners do.
 *
 * The real circle is filled with the tenant `primaryColor` when earned (greyLight1 when not) with
 * the artwork `contain`ed inside it — see DEVIATIONS in mobile/fidelity.spec.js. Only the
 * circle's geometry is exact here.
 */
export const EARNED_BADGES = [
  { id: 'eb1', name: 'Night Owl', earned: true, art: 'linear-gradient(135deg,#822C95,#B43DD0)' },
  {
    id: 'eb2',
    name: 'Streak Starter',
    earned: true,
    art: 'linear-gradient(135deg,#A34320,#F26430)',
  },
  { id: 'eb3', name: '10 Books', earned: true, art: 'linear-gradient(135deg,#087542,#0BA85F)' },
  {
    id: 'eb4',
    name: 'Summer Finisher',
    earned: true,
    art: 'linear-gradient(135deg,#154887,#196DD5)',
  },
  { id: 'eb5', name: 'Early Bird', earned: true, art: 'linear-gradient(135deg,#826022,#FFBC42)' },
  { id: 'eb6', name: 'Marathon', earned: true, art: 'linear-gradient(135deg,#0F7280,#19BFD5)' },
]

/**
 * The accounts signed in on this device — `authentication.accounts` — and the readers under each.
 *
 * The model is two levels and both are plural: **an account is a login at one Beanstack site, and
 * an account holds several readers.** Every school and every library runs its own site with its
 * own challenges and branding, so a family commonly has a login at their school's and another at
 * their public library's; the app signs in to each and reads under one at a time. Inside whichever
 * account is current, the header avatar swaps between that account's readers.
 *
 * So the same child is two profiles, one per site — Maya is registered at both — and Ada is only
 * at the public library, which is what makes the second level visible rather than theoretical.
 *
 * A school account is the degenerate case: one login to one reader. `readers.length === 1` is what
 * the app's single-reader forks key on, and dropping an account here to one entry renders them.
 */
export const ACCOUNTS = [
  {
    id: 'a1',
    libraryName: 'Lakeside Elementary Library',
    holder: 'Grace Chen',
    current: true,
    readers: [
      { id: 'p1', name: 'Maya Chen' },
      { id: 'p2', name: 'Leo Chen' },
    ],
  },
  {
    id: 'a2',
    libraryName: 'Riverside Public Library',
    holder: 'Grace Chen',
    readers: [
      { id: 'p3', name: 'Maya Chen' },
      { id: 'p4', name: 'Leo Chen' },
      { id: 'p5', name: 'Ada Chen' },
    ],
  },
]

/** The account being read under, and its readers — what the switcher and Settings both work from. */
export const CURRENT_ACCOUNT = ACCOUNTS.find((a) => a.current) ?? ACCOUNTS[0]
export const PROFILES = CURRENT_ACCOUNT.readers

/**
 * `registration_fields.sections` — what Edit Account and Edit Reader render.
 *
 * These forms are not authored. The server builds them per microsite and the screen renders
 * whatever arrives, so every label, type and placeholder below is lifted from the definitions in
 * `MicrositeRegistrationFieldsConcern` rather than written: "Jessie" and "Jones" really are the
 * first/last-name placeholders, a phone really does read 555-867-5309, and a birthdate really is a
 * date-picker whose empty state is the literal string YYYY-MM-DD.
 *
 * Which SECTION a field lands in is a setting, not a constant, and the rule is worth knowing: a
 * field you can log in with lives in `sign_in_info`, and the same field lives in `contact_info`
 * when you cannot. `allow_login_by_email` / `_username` / `_phone_number` / `_library_card_number`
 * each subtract their field from whichever section it does not belong to. This account is modelled
 * on the common library setup — log in by username — so Username sits under sign-in and Email and
 * Phone sit under contact.
 *
 * Section titles are stored raw because the app rewrites one of them at render: `sign_in_info` is
 * "Create An Account" everywhere, and the editors alone swap it for "Your Account" — reasonably,
 * since you are not creating anything.
 */
export const ACCOUNT_FIELD_SECTIONS = [
  {
    name: 'sign_in_info',
    title: 'Create An Account',
    fields: [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        placeholder: 'Pick a Username',
        required: true,
        value: 'gracechen',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Password',
        required: true,
        value: '',
      },
    ],
  },
  {
    name: 'personal_info',
    title: 'Personal Information',
    fields: [
      {
        name: 'first_name',
        label: 'First Name',
        type: 'text',
        placeholder: 'Jessie',
        value: 'Grace',
      },
      {
        name: 'last_name',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Jones',
        required: true,
        value: 'Chen',
      },
    ],
  },
  {
    name: 'contact_info',
    title: 'Contact Information',
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'reader@email.com',
        value: 'grace.chen@example.com',
      },
      {
        name: 'phone_number',
        label: 'Phone Number',
        type: 'phone',
        placeholder: '555-867-5309',
        value: '555-0142',
      },
      { name: 'zipcode', label: 'ZIP Code', type: 'numeric', placeholder: '', value: '97214' },
    ],
  },
]

export const READER_FIELD_SECTIONS = [
  {
    name: 'personal_info',
    title: 'Personal Information',
    fields: [
      {
        name: 'first_name',
        label: 'First Name',
        type: 'text',
        placeholder: 'Jessie',
        required: true,
        value: 'Maya',
      },
      { name: 'last_name', label: 'Last Name', type: 'text', placeholder: 'Jones', value: 'Chen' },
      { name: 'birthdate', label: 'Birthdate', type: 'date-picker', value: '2016-04-12' },
    ],
  },
  {
    name: 'school_info',
    title: 'School Information',
    fields: [
      {
        name: 'grade_level_id',
        label: 'Grade',
        type: 'select',
        placeholder: 'Select One',
        value: '4',
        options: [
          { value: 'K', name: 'Kindergarten' },
          { value: '1', name: '1st Grade' },
          { value: '2', name: '2nd Grade' },
          { value: '3', name: '3rd Grade' },
          { value: '4', name: '4th Grade' },
          { value: '5', name: '5th Grade' },
        ],
      },
      {
        name: 'teacher_id',
        label: 'Teacher',
        type: 'select',
        placeholder: 'Select One',
        value: 't2',
        options: [
          { value: 't1', name: 'Ms. Alvarez' },
          { value: 't2', name: 'Mr. Okafor' },
          { value: 't3', name: 'Mrs. Lindqvist' },
        ],
      },
    ],
  },
  {
    name: 'library_info',
    title: 'Library Information',
    fields: [
      {
        name: 'library_branch_id',
        label: 'Branch',
        type: 'select',
        placeholder: 'Select One',
        value: 'b1',
        options: [
          { value: 'b1', name: 'Lakeside Elementary Library' },
          { value: 'b2', name: 'Riverside Public Library' },
        ],
      },
      {
        name: 'library_card_number',
        label: 'Library Card Number',
        type: 'text',
        placeholder: "Add the reader's library card number",
        value: '',
      },
    ],
  },
  {
    name: 'recommendation_info',
    title: 'Should this reader receive a book recommendation each week?',
    fields: [
      { name: 'send_recommendations', label: 'Send recommendations', type: 'bool', value: true },
    ],
  },
]

// ── Log tab ───────────────────────────────────────────────────────────────
/**
 * The Reading Log is a month of weeks of days. `weeks` are newest-first; days inside a week are
 * stored oldest-first and the view reverses them, mirroring the `inverted` FlatList.
 *
 * A session that finished a book is `completed`, which is what switches its colours from blue to
 * coral.
 */
const SEPTEMBER = {
  month: 'September 2026',
  // The log's own banner uses the staticTitle variant.
  goal: { goalMinutes: 20, totalMinutes: 13 },
  isCurrentMonth: true,
  weeks: [
    {
      range: 'Sept 13 - Sept 19',
      days: [
        {
          day: 14,
          weekday: 'Mon',
          goalMet: false,
          streak: 0,
          sessions: [{ id: 'w1', title: 'New Kid', author: 'Jerry Craft', minutes: 18, pages: 24 }],
        },
        {
          day: 15,
          weekday: 'Tue',
          goalMet: true,
          streak: 10,
          sessions: [
            {
              id: 'w2',
              title: 'Wings of Fire: The Dragonet Prophecy',
              author: 'Tui T. Sutherland',
              minutes: 25,
              pages: 31,
            },
          ],
        },
        {
          day: 16,
          weekday: 'Wed',
          goalMet: true,
          streak: 11,
          sessions: [
            {
              id: 'w3',
              title: 'Amari and the Night Brothers',
              author: 'B. B. Alston',
              minutes: 30,
              pages: 0,
              completed: true,
            },
          ],
        },
        {
          day: 17,
          weekday: 'Thu',
          goalMet: false,
          streak: 12,
          sessions: [
            { id: 'w4', title: 'The Wild Robot', author: 'Peter Brown', minutes: 22, pages: 19 },
            { id: 'w5', title: 'The Wild Robot', author: 'Peter Brown', minutes: 15, pages: 0 },
          ],
        },
      ],
    },
    {
      range: 'Sept 6 - Sept 12',
      days: [
        {
          day: 9,
          weekday: 'Tue',
          goalMet: true,
          streak: 6,
          sessions: [
            {
              id: 'w6',
              title: 'New Kid',
              author: 'Jerry Craft',
              minutes: 40,
              pages: 52,
              completed: true,
            },
          ],
        },
        {
          day: 11,
          weekday: 'Thu',
          goalMet: false,
          streak: 8,
          sessions: [
            { id: 'w7', title: 'The Wild Robot', author: 'Peter Brown', minutes: 20, pages: 26 },
          ],
        },
      ],
    },
  ],
}

/**
 * The month before, so the log's ‹ › actually page. `isCurrentMonth` is what disables the forward
 * arrow, so only the newest month carries it — you cannot log into next week.
 *
 * Thinner than September on purpose: a reader's older months are usually a few sessions rather
 * than a full grid, and a log that looks identical whichever month you are in tells you nothing
 * about the reader.
 */
const AUGUST = {
  month: 'August 2026',
  goal: { goalMinutes: 20, totalMinutes: 20 },
  isCurrentMonth: false,
  weeks: [
    {
      range: 'Aug 23 - Aug 29',
      /* Oldest first, like September's — the view reverses a week so the newest day is on top. */
      days: [
        {
          day: 25,
          weekday: 'Tue',
          goalMet: true,
          streak: 2,
          sessions: [
            {
              id: 'a2',
              title: 'Amulet: The Stonekeeper',
              author: 'Kazu Kibuishi',
              minutes: 21,
              pages: 33,
              completed: true,
            },
          ],
        },
        {
          day: 27,
          weekday: 'Thu',
          goalMet: true,
          streak: 3,
          sessions: [
            { id: 'a1', title: 'Smile', author: 'Raina Telgemeier', minutes: 26, pages: 40 },
          ],
        },
      ],
    },
    {
      range: 'Aug 9 - Aug 15',
      days: [
        {
          day: 11,
          weekday: 'Tue',
          goalMet: false,
          streak: 0,
          sessions: [{ id: 'a3', title: 'Dog Man', author: 'Dav Pilkey', minutes: 12, pages: 22 }],
        },
      ],
    },
  ],
}

/** Newest first, which is the direction ‹ walks. */
export const READING_LOG_MONTHS = [SEPTEMBER, AUGUST]

/** The month the log opens on. */
export const READING_LOG = SEPTEMBER

export const ALL_TITLES = [
  {
    id: 't1',
    title: 'The Wild Robot',
    author: 'Peter Brown',
    times: 2,
    cover: 'linear-gradient(150deg,#2f6f4f,#7bb98f)',
  },
  {
    id: 't2',
    title: 'Amari and the Night Brothers',
    author: 'B. B. Alston',
    times: 1,
    cover: 'linear-gradient(150deg,#2b2a6b,#6d6ac4)',
  },
  {
    id: 't3',
    title: 'New Kid',
    author: 'Jerry Craft',
    times: 1,
    cover: 'linear-gradient(150deg,#1f5f8b,#6fb3d6)',
  },
  {
    id: 't4',
    title: 'Wings of Fire: The Dragonet Prophecy',
    author: 'Tui T. Sutherland',
    times: 3,
    cover: 'linear-gradient(150deg,#8a3d2e,#d98b6a)',
  },
]

export const STREAK_WEEKS = [
  { label: 'This week', days: [true, true, true, true, true, false, false] },
  { label: 'Last week', days: [true, true, false, true, true, true, true] },
  { label: 'Sept 1 – 7', days: [false, true, true, true, false, true, true] },
]

export const HIGHLIGHTS = [
  { label: 'Minutes read', value: '1,240' },
  { label: 'Books finished', value: '18' },
  { label: 'Days read', value: '86' },
  { label: 'Badges earned', value: '11' },
  { label: 'Longest streak', value: '24' },
  { label: 'Challenges', value: '3' },
]

// ── Discover tab ──────────────────────────────────────────────────────────
/**
 * Discover > Challenges. Shaped like the real `challenge.attributes`, because the card reads
 * those directly: name, the preformatted `challenge_dates` string, `challenge_state`,
 * `is_registered`, `log_types` and `challenge_types` (which together build the pill row), and
 * `challenge_code`.
 *
 * There is NO description on the card — it shows the banner, the name, the dates and the pills.
 * `challenge_dates` arrives preformatted from the API, including the literal "Ongoing challenge".
 */
export const DISCOVER_CHALLENGES = [
  {
    id: 'c1',
    name: 'Summer Reading 2026',
    dates: 'Jun 1, 2026 - Aug 31, 2026',
    state: 'current',
    isRegistered: true,
    banner: 'linear-gradient(120deg,#F2A03D,#E8724B)',
    logTypes: ['book'],
    challengeTypes: ['Logging', 'Activities'],
  },
  {
    id: 'c2',
    name: 'Mystery Month',
    dates: 'Sep 1, 2026 - Sep 30, 2026',
    state: 'current',
    isRegistered: true,
    banner: 'linear-gradient(120deg,#822C95,#B43DD0)',
    logTypes: ['book'],
    challengeTypes: ['Logging'],
  },
  {
    id: 'c3',
    name: 'Ms. Abbott’s Class Challenge',
    dates: 'Ongoing challenge',
    state: 'current',
    isRegistered: true,
    banner: 'linear-gradient(120deg,#19BFD5,#0E8CA0)',
    logTypes: ['minute'],
    challengeTypes: ['Logging'],
  },
  {
    id: 'c4',
    name: 'Read Around the World',
    dates: 'Oct 1, 2026 - Dec 15, 2026',
    state: 'upcoming',
    isRegistered: false,
    banner: 'linear-gradient(120deg,#0BA85F,#2FB5A8)',
    /* `getImageColor(headerImageUrl)` again — the Join sheet's coloured top is sampled from the
       banner, so the two travel together on an unregistered challenge the same way
       `bgColorToSet` and the banner do on a registered one. */
    bandColor: '#E4F6EE',
    description:
      '<p>Six continents, six books. Pick a title set somewhere you have never been and log it to fill in that part of the map.</p><p>Finish all six and your name goes on the display case by the front desk.</p>',
    logTypes: ['book'],
    challengeTypes: ['Reading List'],
  },
  {
    id: 'c5',
    name: 'Winter Bingo',
    dates: 'Nov 1, 2026 - Jan 31, 2027',
    state: 'current',
    isRegistered: false,
    banner: 'linear-gradient(120deg,#4C6FE8,#8E6BE8)',
    bandColor: '#E8ECFC',
    description:
      '<p>A five-by-five board of reading dares. Read a book with a <strong>blue cover</strong>, read somewhere you have never read before, read to a pet.</p><p>Any line across, down or diagonally wins a prize.</p>',
    logTypes: ['book'],
    challengeTypes: ['Bingo'],
  },
  {
    // A coded challenge is kept OUT of "More Challenges" and is what turns the Challenge Code
    // button on in the filter bar.
    id: 'c6',
    name: 'District Staff Reads',
    dates: 'Sep 1, 2026 - Jun 1, 2027',
    state: 'current',
    isRegistered: false,
    challengeCode: 'STAFF26',
    banner: 'linear-gradient(120deg,#E85648,#F2A03D)',
    bandColor: '#FDE9E6',
    description:
      '<p>For staff across the district. Log your own reading alongside the students — 20 minutes a day is the ask.</p><p>Ask your building lead for the code if you have not been given one.</p>',
    logTypes: ['minute'],
    challengeTypes: ['Logging'],
  },
  {
    id: 'c7',
    name: 'Spring Into Reading 2026',
    dates: 'Mar 1, 2026 - May 31, 2026',
    state: 'past',
    isRegistered: true,
    banner: 'linear-gradient(120deg,#F2C53D,#0BA85F)',
    logTypes: ['book'],
    challengeTypes: ['Logging', 'Activities'],
  },
]

/**
 * `challengeDetail.data.attributes` — what a tapped challenge opens.
 *
 * Kept in the API's own snake_case names because almost every number here is load-bearing twice
 * over, and renaming them would hide which two things a name is driving:
 *
 *   • `challengeTabs` in `ChallengeDetailScreen` builds the tab row by TESTING THESE TOTALS.
 *     Overview and Description are always there; each of the rest appears only if its total is
 *     above zero, in a fixed order. Badges is the sum of four of them.
 *   • `GetCardOverviewData` turns the same numbers into the Overview grid, pairing a
 *     `challenge_*_total` (what you have done) with a `goals_*_total` (what there is to do).
 *
 * So a challenge is configured by its numbers rather than by a list of features, and a tab
 * exists because there is something in it. `goals_*` of 0 with a `challenge_*` above 0 still
 * shows a card — you logged something the challenge does not have a goal for — which is why the
 * card renders on `(total === 0 && data > 0) || total > 0`.
 *
 * `bgColorToSet` is the band behind the header. It comes from the LIST, not from here: the row
 * you tapped hands it over so the colour is already right as the screen opens.
 */
export const CHALLENGE_DETAILS = {
  c1: {
    challenge_name: 'Summer Reading 2026',
    challenge_dates: 'Jun 1, 2026 - Aug 31, 2026',
    challenge_state: 'current',
    /* The band colour and the banner are a PAIR: `getImageColor(headerImageUrl)` samples the
       banner and lightens it, which is why the field behind a warm banner is warm. Two fixture
       values standing in for one derivation. */
    bgColorToSet: '#FDF0E3',
    banner: 'linear-gradient(120deg,#F2A03D,#E8724B)',
    challenge_description:
      '<p>Read your way through the summer with <strong>Lakeside Elementary</strong>! Log books, earn badges, and collect tickets toward the end-of-summer drawing.</p><p>Every week you log at least three days, you earn a ticket. Finish the whole challenge and pick a prize from the library cart.</p><ul><li>Log any book you read, at home or at camp</li><li>Activities count too — check the Activities tab</li><li>Ask a librarian if you need a reading suggestion</li></ul>',
    activities_only: false,
    is_book_list_challenge: false,
    is_bingo_challenge: false,
    // Tab gates.
    goals_challenges_total: 2,
    goals_logging_total: 3,
    goals_points_total: 0,
    goals_reviews_total: 1,
    goals_activities_total: 4,
    rewards_total: 2,
    drawings_total: 1,
    certificates_total: 1,
    challenge_log_total: 12,
    // Overview grid — `challenge_*` is done, `goals_*` is the goal.
    earned_badges_total: 4,
    goals_book_list_total: 0,
    challenge_book_lists_total: 0,
    goals_minutes_total: 0,
    challenge_minutes_total: 0,
    goals_pages_total: 0,
    challenge_pages_total: 0,
    goals_reviews_goal_total: 1,
    challenge_reviews_total: 1,
    challenge_events_total: 0,
    goals_days_total: 30,
    challenge_days_total: 18,
    challenge_learning_moments_total: 0,
    challenge_hours_total: 0,
    challenge_videos_total: 0,
    challenge_magazines_total: 0,
    goals_books_total: 20,
    challenge_books_total: 14,
    challenge_picture_reviews_total: 0,
    challenge_activites_total: 3,
    challenge_rewards: 1,
    challenge_tickets_total: 6,
    challenge_certificates: 0,
    log_types: ['book'],
    has_activities: true,
  },
  c3: {
    challenge_name: 'Ms. Abbott’s Class Challenge',
    challenge_dates: 'Ongoing challenge',
    challenge_state: 'current',
    bgColorToSet: '#E3F6FA',
    banner: 'linear-gradient(120deg,#19BFD5,#0E8CA0)',
    challenge_description:
      '<p>Our class goal is <strong>10,000 minutes</strong> by the end of the year. Every minute you log at home counts toward it.</p><p>We check the total together every Friday afternoon.</p>',
    activities_only: false,
    is_book_list_challenge: false,
    is_bingo_challenge: false,
    goals_challenges_total: 0,
    goals_logging_total: 2,
    goals_points_total: 0,
    goals_reviews_total: 0,
    goals_activities_total: 0,
    rewards_total: 0,
    drawings_total: 0,
    certificates_total: 0,
    challenge_log_total: 31,
    earned_badges_total: 2,
    goals_book_list_total: 0,
    challenge_book_lists_total: 0,
    goals_minutes_total: 600,
    challenge_minutes_total: 415,
    goals_pages_total: 0,
    challenge_pages_total: 0,
    challenge_reviews_total: 0,
    challenge_events_total: 0,
    goals_days_total: 0,
    challenge_days_total: 0,
    challenge_learning_moments_total: 0,
    challenge_hours_total: 0,
    challenge_videos_total: 0,
    challenge_magazines_total: 0,
    goals_books_total: 0,
    challenge_books_total: 0,
    challenge_picture_reviews_total: 0,
    challenge_activites_total: 0,
    challenge_rewards: 0,
    challenge_tickets_total: 0,
    challenge_certificates: 0,
    log_types: ['minute'],
    has_activities: false,
  },
}

/**
 * Discover > Activities. Same `ActivityItem` shape as HOME_ACTIVITIES — the tab renders the SAME
 * ActivitiesList, just without `horizontal`. There are no points and no emoji on an activity;
 * the third line is the completion count, from `useActivityDisplayData`.
 */
export const ACTIVITIES = [
  {
    id: 'da1',
    track: 'Forces & Motion',
    title: 'Build a ramp and measure it',
    completed: 3,
    total: 3,
    isActive: true,
    hasPrerequisite: false,
    isRepeatable: false,
  },
  {
    id: 'da2',
    track: 'Habitats',
    title: 'Sketch a food web',
    completed: 1,
    total: 4,
    isActive: true,
    hasPrerequisite: false,
    isRepeatable: false,
  },
  {
    id: 'da3',
    track: 'Poetry Month',
    title: 'Write and perform a found poem',
    completed: 2,
    total: 2,
    isActive: true,
    hasPrerequisite: false,
    isRepeatable: false,
  },
  {
    // isRepeatable swaps the count line for a completions tally.
    id: 'da4',
    track: 'Library Skills',
    title: 'Find a book using the catalogue',
    completed: 5,
    total: 0,
    isActive: true,
    hasPrerequisite: false,
    isRepeatable: true,
  },
  {
    // hasPrerequisite outranks the count entirely.
    id: 'da5',
    track: 'Forces & Motion',
    title: 'Design a marble run',
    completed: 0,
    total: 3,
    isActive: true,
    hasPrerequisite: true,
    isRepeatable: false,
  },
  {
    id: 'da6',
    track: 'Winter Reading',
    title: 'Interview a family member about a book',
    completed: 0,
    total: 2,
    isActive: false,
    hasPrerequisite: false,
    isRepeatable: false,
  },
]

/**
 * Discover > Book Lists. `image_url` is API-served; a list without one falls back to
 * `chooseRandomBeanstackColor(name)` — derived from the NAME, so it is stable per list — with the
 * Beanstack heart over it. `tint` stands in for that here.
 */
/**
 * The list pane. The header band is tinted from the FIRST BOOK's cover (`getImageColor`), and the
 * rows use BookListItem at `origin="dashboard"` — the small 56×84 variant showing the AUTHOR.
 */
export const BOOK_LIST_DETAIL = {
  headerColor: '#F2A03D',
  description:
    "Every Newbery Medal winner since 1990, plus the honor books. The Newbery has been awarded each year since 1922 to the most distinguished American children's book of the previous year — so this is a good place to look when you want something that has already proved it lasts.",
  books: [
    {
      id: 'n1',
      title: 'The Crossover',
      author: 'Kwame Alexander',
      cover: 'linear-gradient(150deg,#E8724B,#B5382C)',
    },
    {
      id: 'n2',
      title: 'Last Stop on Market Street',
      author: 'Matt de la Peña',
      cover: 'linear-gradient(150deg,#19BFD5,#0E8CA0)',
    },
    {
      id: 'n3',
      title: 'The Girl Who Drank the Moon',
      author: 'Kelly Barnhill',
      cover: 'linear-gradient(150deg,#4C6FE8,#2B47A8)',
    },
    {
      id: 'n4',
      title: 'Hello, Universe',
      author: 'Erin Entrada Kelly',
      tint: '#0BA85F',
      abbreviation: 'HU',
    },
    {
      id: 'n5',
      title: 'New Kid',
      author: 'Jerry Craft',
      cover: 'linear-gradient(150deg,#822C95,#B43DD0)',
    },
    {
      id: 'n6',
      title: 'When You Trap a Tiger',
      author: 'Tae Keller',
      tint: '#E1511C',
      abbreviation: 'WT',
    },
  ],
}

export const BOOK_LISTS = [
  {
    id: 'bl1',
    name: 'Newbery Medal Winners',
    bookCount: 42,
    cover: 'linear-gradient(150deg,#F2A03D,#E8724B)',
  },
  { id: 'bl2', name: 'Graphic Novels for Grades 4-6', bookCount: 28, tint: '#19BFD5' },
  {
    id: 'bl3',
    name: 'Mystery and Detective Stories',
    bookCount: 35,
    cover: 'linear-gradient(150deg,#822C95,#B43DD0)',
  },
  { id: 'bl4', name: 'Books That Became Films', bookCount: 19, tint: '#0BA85F' },
  {
    id: 'bl5',
    name: 'Ms. Abbott’s Class Favourites',
    bookCount: 24,
    cover: 'linear-gradient(150deg,#4C6FE8,#2B47A8)',
  },
]

/**
 * Discover > Events. `mobile_age_range` is the pair the list filters on before rendering —
 * `inRange(age, lo, hi + 1)` — so an event outside the reader's range is absent, not dimmed.
 * `date` is a preformatted string, and the literal 'This is an ongoing event.' is what swaps the
 * date chip for a refresh glyph and the time line for the word "Ongoing".
 */
export const EVENTS = [
  {
    id: 'e1',
    title: 'Summer Reading Kickoff Party',
    date: 'Jun 5',
    time: '4:00 PM - 6:00 PM',
    branch: 'Lakeside Elementary Library',
    ageRange: '5-12',
    mobileAgeRange: [5, 12],
    description:
      'Kick off the summer challenge with games on the field, a book swap table and free ice cream. Pick up your reading log and your first badge sticker at the door.',
  },
  {
    id: 'e2',
    title: 'Author Visit: Kwame Alexander',
    date: 'Jun 18',
    time: '10:30 AM',
    branch: 'Lakeside Elementary Library',
    ageRange: '8-14',
    mobileAgeRange: [8, 14],
    description:
      'A reading and Q&A with the Newbery-winning author of The Crossover, followed by a signing. Copies will be available, and you are welcome to bring your own.',
  },
  {
    id: 'e3',
    title: 'Drop-In Book Club',
    date: 'This is an ongoing event.',
    time: null,
    branch: 'Room 12',
    ageRange: '9-12',
    mobileAgeRange: [9, 12],
    description:
      'No sign-up and no assigned reading — bring whatever you are in the middle of. Thursdays at lunch, all year.',
  },
]

// ── Community tab ─────────────────────────────────────────────────────────
/**
 * `useMicrositeScreenData` — everything the My School / My Library tab draws. It is the SITE's
 * page, not a social one: a logo, a community goal, what is coming up, and who paid for it.
 *
 * `percent_completed` arrives as a string with the sign on it, and `goal_type` is singular — the
 * screen pluralises it itself, which is why "minute" is stored rather than "minutes".
 */
export const COMMUNITY_GOAL = {
  remaining_days: 24,
  show_remaining_days: true,
  goal: 2000000,
  goal_type: 'minute',
  tally: 1204551,
  percent_completed: '60%',
}

/**
 * `micrositeSponsors`. `sponsor_position` is the sort key — the API does not send them in order.
 *
 * A sponsor logo is tenant-uploaded art served from a URL, so there is no asset to copy. These
 * four are the real brand files already vendored in `public/<partner>` — Scholastic, Epic!, Sora
 * and OverDrive, reading companies that genuinely work with school and library programmes. Real
 * marks are what make the block worth looking at: they disagree with each other in a way four
 * hand-drawn lockups never will.
 */
export const SPONSORS = {
  sponsor_header: 'This year’s reading challenge is made possible by',
  sponsors: [
    { id: 's1', sponsor_position: 2, mark: 'epic' },
    { id: 's2', sponsor_position: 1, mark: 'scholastic' },
    { id: 's3', sponsor_position: 4, mark: 'overdrive' },
    { id: 's4', sponsor_position: 3, mark: 'sora' },
  ],
}

/**
 * `funnel_page_image` — the one panel the microsite screen draws that nothing else does. A
 * site-uploaded banner for the programme currently running, sized to its own aspect ratio over a
 * `blueLight` backdrop.
 *
 * PLACEHOLDER, same as the sponsors: tenant art with no source to copy.
 */
export const FUNNEL_IMAGE = {
  title: 'Summer Reading 2026',
  subtitle: 'Read anything. Log everything.',
}

/**
 * The friends on this reader's list — `useFriendsList`.
 *
 * A row carries a name, a streak and whether the invite is `confirmed`; there is no minutes
 * figure on it, which is worth stating because an unconfirmed friend has no readable activity at
 * all. `current_streak` is null rather than 0 when there is no streak, and null is what hides the
 * flame.
 */
export const FRIENDS = [
  { id: 'fr1', firstName: 'Jordan', lastName: 'Park', streak: 8, confirmed: true },
  { id: 'fr2', firstName: 'Priya', lastName: 'Shah', streak: null, confirmed: true },
  { id: 'fr3', firstName: 'Sam', lastName: 'Okafor', streak: 15, confirmed: true },
  { id: 'fr4', firstName: 'Alex', lastName: 'Rivera', streak: null, confirmed: false },
]

export const FRIEND_REQUESTS = 3

/**
 * The roster `friendSearch` searches — every reader at this site.
 *
 * A school has one of these and a library does not, which is the whole reason the two add-a-friend
 * flows differ: you can look someone up here, but a public library cannot show you its patrons.
 */
/* `grade_level_name` is on every row because `FoundFriend` renders it under the name, and the
   two Novaks are the reason it has to: a roster search returns everyone who matches, and on a
   list of names alone there is no way to tell which Ellie you are inviting. */
export const SITE_ROSTER = [
  { id: 'sr1', firstName: 'Ellie', lastName: 'Novak', grade: '4th Grade' },
  { id: 'sr2', firstName: 'Marcus', lastName: 'Webb', grade: '5th Grade' },
  { id: 'sr3', firstName: 'Nadia', lastName: 'Haddad', grade: '3rd Grade' },
  { id: 'sr4', firstName: 'Owen', lastName: 'Fitzgerald', grade: '5th Grade' },
  { id: 'sr5', firstName: 'Ruby', lastName: 'Nakamura', grade: '2nd Grade' },
  { id: 'sr6', firstName: 'Ellie', lastName: 'Novak', grade: '2nd Grade' },
]

/** The pending requests behind that card — `useFriendRequests`. */
export const FRIEND_REQUEST_LIST = [
  { id: 'rq1', firstName: 'Nina', lastName: 'Okonkwo' },
  { id: 'rq2', firstName: 'Theo', lastName: 'Bergman' },
  { id: 'rq3', firstName: 'Ivy', lastName: 'Ramos' },
]

/**
 * `useFriendsDetails` — a friend's own page.
 *
 * `displayLoggedBooksToFriends` is a privacy setting rather than a feature flag: it decides
 * whether the Reading Log tab exists at all, so a friend can be on your list and still not show
 * you what they read. Priya has it off, which is what makes the third tab conditional visible
 * here rather than theoretical.
 *
 * `stats` omits a key entirely when the site does not count it — the source checks
 * `hasOwnProperty` rather than for a value, so a missing `books` is a block that is not drawn,
 * not a zero.
 */
export const FRIEND_DETAILS = {
  fr1: {
    id: 'fr1',
    firstName: 'Jordan',
    lastName: 'Park',
    displayLoggedBooksToFriends: true,
    badges: [
      { id: 'b1', art: 'linear-gradient(135deg,#0F7280,#19BFD5)' },
      { id: 'b2', art: 'linear-gradient(135deg,#826022,#FFBC42)' },
      { id: 'b3', art: 'linear-gradient(135deg,#7A2E8E,#C158D6)' },
    ],
    achievements: [{ id: 'a1', art: 'linear-gradient(135deg,#1B7F4B,#43C37A)' }],
    stats: { currentStreak: 8, longestStreak: 21, minutes: 1640, books: 14 },
    challenges: [
      { id: 'c1', title: 'Summer Reading 2026', subtitle: '14 of 20 books' },
      { id: 'c2', title: 'Newbery Winners', subtitle: '3 of 10 books' },
    ],
    titles: [
      {
        id: 't1',
        title: 'The Wild Robot',
        author: 'Peter Brown',
        cover: 'linear-gradient(160deg,#2F8F83,#1C5C57)',
      },
      {
        id: 't2',
        title: 'New Kid',
        author: 'Jerry Craft',
        cover: 'linear-gradient(160deg,#C4553E,#8E2F22)',
      },
    ],
  },
  fr2: {
    id: 'fr2',
    firstName: 'Priya',
    lastName: 'Shah',
    /* Off — so her page has two tabs, not three. */
    displayLoggedBooksToFriends: false,
    badges: [],
    achievements: [],
    stats: { currentStreak: null, longestStreak: 12, minutes: 1880 },
    challenges: [],
    titles: [],
  },
  fr3: {
    id: 'fr3',
    firstName: 'Sam',
    lastName: 'Okafor',
    displayLoggedBooksToFriends: true,
    badges: [{ id: 'b4', art: 'linear-gradient(135deg,#B3472F,#F2703F)' }],
    achievements: [],
    stats: { currentStreak: 15, longestStreak: 15, minutes: 1120, books: 6 },
    challenges: [{ id: 'c3', title: 'Summer Reading 2026', subtitle: '6 of 20 books' }],
    titles: [
      {
        id: 't3',
        title: 'Amari and the Night Brothers',
        author: 'B. B. Alston',
        cover: 'linear-gradient(160deg,#5B3FA8,#2E1E63)',
      },
    ],
  },
}

/**
 * `useLeaderboard(profileId, logType, dateRange, leaderboardType)` — four axes, and the screen
 * shows three of them as controls.
 *
 * `leaderboard_types` is the SCOPE you are ranked within (your friends, your grade, your school),
 * and `leaderboard_tabs` is WHAT is being counted. They are different tab rows rendered by the
 * same component, which is easy to read as one thing in the source.
 *
 * `ranking` is the server's, not the row's index: it is what decides a medal, and ties mean it
 * does not always march 1, 2, 3.
 *
 * A friend's row id here is their PROFILE id — the same one the friends list uses. That is not
 * bookkeeping: the avatar colour is hashed from `id-first-last`, so giving the same person a
 * different id on this screen would give them a different colour on it, and the whole point of
 * deriving the colour is that a friend looks like themselves wherever they appear.
 */
export const LEADERBOARD_SCOPES = ['friends', 'grade', 'school']

/**
 * `leaderboard_tabs` — `'minutes' | 'books' | 'participation_rate'`, and it arrives in the meta of
 * each request, so it is per SCOPE rather than global.
 *
 * Participation rate only exists on the school board, and it is the one figure here that is not a
 * total: a school of 200 that reads a little beats a school of 800 that mostly does not, which is
 * the whole reason to rank schools by it. `LeaderboardItem` is where that shows — it is the only
 * value the app suffixes, and only on this pairing.
 */
export const LEADERBOARD_LOG_TYPES = {
  friends: ['minutes', 'books'],
  grade: ['minutes', 'books'],
  school: ['minutes', 'books', 'participation_rate'],
}

export const LEADERBOARDS = {
  friends: {
    minutes: [
      { id: 'fr2', ranking: 1, firstName: 'Priya', lastName: 'Shah', logValue: '1,880' },
      { id: 'fr1', ranking: 2, firstName: 'Jordan', lastName: 'Park', logValue: '1,640' },
      { id: 'p1', ranking: 3, firstName: 'Maya', lastName: 'Chen', logValue: '1,240' },
      { id: 'fr3', ranking: 4, firstName: 'Sam', lastName: 'Okafor', logValue: '1,120' },
      { id: 'fr4', ranking: 5, firstName: 'Alex', lastName: 'Rivera', logValue: '980' },
    ],
    books: [
      { id: 'fr1', ranking: 1, firstName: 'Jordan', lastName: 'Park', logValue: '14' },
      { id: 'p1', ranking: 2, firstName: 'Maya', lastName: 'Chen', logValue: '11' },
      { id: 'fr2', ranking: 3, firstName: 'Priya', lastName: 'Shah', logValue: '9' },
      { id: 'fr3', ranking: 4, firstName: 'Sam', lastName: 'Okafor', logValue: '6' },
    ],
  },
  /* Grade and school rows carry a `name` instead of a first/last pair — they are not people. */
  grade: {
    minutes: [
      { id: 'g5', ranking: 1, name: '5th Grade', logValue: '48,210' },
      { id: 'g4', ranking: 2, name: '4th Grade', logValue: '44,905' },
      { id: 'g3', ranking: 3, name: '3rd Grade', logValue: '39,140' },
      { id: 'g2', ranking: 4, name: '2nd Grade', logValue: '28,660' },
    ],
    books: [
      { id: 'g4', ranking: 1, name: '4th Grade', logValue: '612' },
      { id: 'g5', ranking: 2, name: '5th Grade', logValue: '584' },
      { id: 'g3', ranking: 3, name: '3rd Grade', logValue: '470' },
      { id: 'g2', ranking: 4, name: '2nd Grade', logValue: '331' },
    ],
  },
  school: {
    minutes: [
      { id: 'm2', ranking: 1, name: 'Northside Elementary', logValue: '204,880' },
      { id: 'm1', ranking: 2, name: 'Lakeside Elementary', logValue: '196,410' },
      { id: 'm3', ranking: 3, name: 'Riverbend Elementary', logValue: '158,220' },
    ],
    books: [
      { id: 'm1', ranking: 1, name: 'Lakeside Elementary', logValue: '2,431' },
      { id: 'm2', ranking: 2, name: 'Northside Elementary', logValue: '2,190' },
      { id: 'm3', ranking: 3, name: 'Riverbend Elementary', logValue: '1,604' },
    ],
    /* The order is deliberately not the other two's: Riverbend logs the fewest minutes and the
       fewest books of the three and still leads here, because a higher share of its readers log
       at all. A participation board that ranked the same way as a totals board would not be
       worth having. */
    participation_rate: [
      { id: 'm3', ranking: 1, name: 'Riverbend Elementary', logValue: 74 },
      { id: 'm1', ranking: 2, name: 'Lakeside Elementary', logValue: 61 },
      { id: 'm2', ranking: 3, name: 'Northside Elementary', logValue: 48 },
    ],
  },
}

// ── Feature-gated Home sections ───────────────────────────────────────────

export const FUNDRAISER = {
  fundraiserName: 'Read-a-thon for the Library',
  endDate: 'Oct 12, 2026',
  headerColor: '#0F7280',
  // Deliberately not teal: the band behind it is #0F7280, and a teal banner made the 80pt
  // overlap invisible — it read as a clipped image rather than a layered header.
  banner: 'linear-gradient(135deg,#FFBC42,#F26430)',
  donationsTotal: 3240,
  goalAmount: 5000,
  percentCompleted: '65%',
  buttonText: 'Share & Collect Donations',
}

/** `useActivitiesData` → learning-track activities, each with its parent track. */
export const HOME_ACTIVITIES = [
  {
    id: 'ac1',
    art: 'linear-gradient(140deg,#19BFD5,#0E8CA0)',
    track: 'Forces & Motion',
    title: 'Build a ramp and measure it',
    completed: 3,
    total: 3,
    isActive: true,
    hasPrerequisite: false,
    isRepeatable: false,
  },
  {
    id: 'ac2',
    art: 'linear-gradient(140deg,#F2A03D,#E8724B)',
    track: 'Habitats',
    title: 'Sketch a food web',
    completed: 1,
    total: 4,
    isActive: true,
    hasPrerequisite: false,
    isRepeatable: false,
  },
  {
    id: 'ac3',
    art: 'linear-gradient(140deg,#B43DD0,#822C95)',
    track: 'Poetry Month',
    title: 'Write a found poem',
    completed: 2,
    total: 0,
    isActive: true,
    hasPrerequisite: false,
    isRepeatable: true,
  },
  {
    id: 'ac4',
    art: 'linear-gradient(140deg,#0BA85F,#077A45)',
    track: 'Weather Watch',
    title: 'Log a week of forecasts',
    completed: 0,
    total: 5,
    isActive: true,
    hasPrerequisite: true,
    isRepeatable: false,
  },
]

export const HOME_REVIEWS = [
  {
    id: 'rv1',
    bookTitle: 'The Wild Robot',
    review:
      'I did not expect to care this much about a robot. Roz learning to talk to the animals is the best part, and the ending made me want to read the next one immediately. I would tell anyone in my class to read it.',
  },
  {
    id: 'rv2',
    bookTitle: 'New Kid',
    review:
      'Jordan felt real to me. The drawings in his sketchbook say the things he cannot say out loud, which is how I feel sometimes. Funny and sad in the same chapter.',
  },
  {
    id: 'rv3',
    bookTitle: 'Amari and the Night Brothers',
    review:
      'The magic tryouts are my favourite chapters. I liked that Amari keeps going even when everyone assumes the worst about her.',
  },
]

// ── Log tab screens ───────────────────────────────────────────────────────

/**
 * `BookListItem` props. `percentageCompleted` and `totalCompletions` are mutually exclusive in the
 * source: the bar only renders while `totalCompletions === 0`, so a finished book loses its bar
 * and gains the green tag instead.
 */
export const ALL_TITLES_SECTIONS = [
  {
    month: 'September 2026',
    books: [
      {
        id: 'at1',
        title: 'The Wild Robot',
        author: 'Peter Brown',
        cover: 'linear-gradient(150deg,#2f6f4f,#7bb98f)',
        percentageCompleted: 62,
        totalCompletions: 0,
      },
      {
        id: 'at2',
        title: 'Amari and the Night Brothers',
        author: 'B. B. Alston',
        cover: 'linear-gradient(150deg,#2b2a6b,#6d6ac4)',
        totalCompletions: 1,
      },
      {
        id: 'at3',
        title: 'New Kid',
        author: 'Jerry Craft',
        cover: 'linear-gradient(150deg,#1f5f8b,#6fb3d6)',
        totalCompletions: 2,
      },
    ],
  },
  {
    month: 'August 2026',
    books: [
      {
        id: 'at4',
        title: 'Wings of Fire: The Dragonet Prophecy',
        author: 'Tui T. Sutherland',
        cover: 'linear-gradient(150deg,#8a3d2e,#d98b6a)',
        percentageCompleted: 34,
        totalCompletions: 0,
      },
      {
        // No cover art: BookImage falls back to the abbreviation on the book's own colour.
        id: 'at5',
        title: 'Front Desk',
        author: 'Kelly Yang',
        abbreviation: 'FD',
        coverColor: '8a6a1f',
        totalCompletions: 1,
      },
    ],
  },
]

export const COMPLETED_TITLES = [
  { id: 'ct1', title: 'New Kid', cover: 'linear-gradient(150deg,#1f5f8b,#6fb3d6)' },
  { id: 'ct2', title: 'Amari', cover: 'linear-gradient(150deg,#2b2a6b,#6d6ac4)' },
  { id: 'ct3', title: 'Front Desk', cover: 'linear-gradient(150deg,#8a6a1f,#d8b45f)' },
  { id: 'ct4', title: 'Wings of Fire', cover: 'linear-gradient(150deg,#8a3d2e,#d98b6a)' },
  { id: 'ct5', title: 'Ghost', cover: 'linear-gradient(150deg,#3b3b46,#8b8b9c)' },
]

/**
 * The streak carousel's numbers. `SetCarouselData` turns these into the five cards, choosing the
 * filled or grey variant per value — `current_streak > 1`, `longest_streak > 1`, and `> 0` for the
 * three logging ones. `longestSession` is preformatted `H:MM` by `longestSessionText`.
 */
/**
 * The book panel's inputs, not its output.
 *
 * `OverviewDataItems` DERIVES every card from these — reading time from `total_hours` and
 * `total_minutes`, minutes and pages per session by dividing by the session count, and two dates
 * that only appear when they exist. Holding the derived strings here instead is how the card list
 * drifted into three invented sentences ("Your longest ran 48 minutes"); the numbers are the
 * fixture and the formats belong to the screen.
 */
export const BOOK_DETAIL = {
  id: 'bk1',
  title: 'The Wild Robot',
  author: 'Peter Brown',
  pageCount: 279,
  cover: 'linear-gradient(150deg,#2FB5A8,#0E8CA0)',

  /* `attributes.data.last_read_on` and `archived_on` — the second is set when a title is
     completed, and is what puts a Date Completed card second in the list. */
  lastReadOn: '2026-08-28',
  archivedOn: '2026-08-28',
  /* `attributes` — the totals the app divides. 3h 20m across 7 sessions of 279 pages. */
  totalHours: 3,
  totalMinutes: 200,
  totalPages: 279,

  /* `log_item_sessions`. A session carries what was entered — a date, a duration, and EITHER a
     start and end page or a bare page count — and the session screen derives the rest from that:
     pages read, and time per page. `hours` is its own field in the app, not minutes over 60. */
  sessions: [
    { id: 's1', happenedOn: '2026-08-28', hours: 0, minutes: 32, startPage: 244, endPage: 279 },
    { id: 's2', happenedOn: '2026-08-26', hours: 0, minutes: 48, startPage: 180, endPage: 244 },
    { id: 's3', happenedOn: '2026-08-24', hours: 0, minutes: 25, startPage: 140, endPage: 180 },
    { id: 's4', happenedOn: '2026-08-21', hours: 0, minutes: 30, startPage: 96, endPage: 140 },
    { id: 's5', happenedOn: '2026-08-19', hours: 0, minutes: 22, startPage: 60, endPage: 96 },
    /* No page range on this one — a reader who logged minutes and a count, which is the other
       half of the app's fork: Pages Read instead of Start Page and End Page. */
    { id: 's6', happenedOn: '2026-08-17', hours: 0, minutes: 25, pages: 32 },
    { id: 's7', happenedOn: '2026-08-15', hours: 1, minutes: 78, startPage: 1, endPage: 28 },
  ],
}

export const STREAK_NUMBERS = {
  currentStreak: 6,
  longestStreak: 41,
  longestTitle: 384,
  mostPages: 96,
  longestSession: '2:15',
}

/** Present only when the reader has a reading goal; splices in at carousel index 2. */
export const TIMES_GOAL_MET = 28

/** A September grid: null pads the leading and trailing days of the month. */
/**
 * The streak calendar's source data — LOGS, not a pre-built grid.
 *
 * `StreaksCalendars` builds `markedCalendarDates` from `streaksCalendar.attributes.logs` and hands
 * the month to `react-native-calendars`, so the grid is derived and the reader can page back
 * through it. A hand-authored month cannot page, which is why this is a date list now.
 *
 * `firstMonth` is the bound the left arrow disables on (`isFirstMonth`) — the app derives it from
 * the earliest marked date. `goalStartDate` is when the reading goal began: no star is drawn
 * before it, because there was no goal to meet.
 */
const streakRun = (start, days, goalMetOn = []) =>
  Array.from({ length: days }, (_, i) => {
    const d = new Date(`${start}T00:00:00`)
    d.setDate(d.getDate() + i)
    const date = d.toISOString().slice(0, 10)
    return { date, goalMet: goalMetOn.includes(date) }
  })

export const STREAK_CALENDAR = {
  today: '2026-09-17',
  goalStartDate: '2026-07-01',
  firstMonth: '2026-07',
  logs: [
    ...streakRun('2026-07-06', 4, ['2026-07-07', '2026-07-08']),
    ...streakRun('2026-07-18', 3, ['2026-07-19']),
    ...streakRun('2026-07-27', 5, ['2026-07-28', '2026-07-30', '2026-07-31']),
    ...streakRun('2026-08-03', 6, ['2026-08-04', '2026-08-05', '2026-08-07']),
    ...streakRun('2026-08-14', 2, []),
    ...streakRun('2026-08-22', 8, ['2026-08-23', '2026-08-25', '2026-08-26', '2026-08-28']),
    ...streakRun('2026-09-02', 4, ['2026-09-02', '2026-09-04']),
    ...streakRun('2026-09-07', 5, ['2026-09-07', '2026-09-08', '2026-09-09', '2026-09-11']),
    ...streakRun('2026-09-13', 5, ['2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17']),
  ],
}

/**
 * Statistics > the four timeframes. `graph_data` is `{ data, labels, y_labels }` straight from the
 * API — the chart plots `data` and labels the axes from the other two.
 *
 * TITLES COMPLETED only renders on Year and All Time (`section === 2 || section === 3`).
 */
export const HIGHLIGHT_STATS = {
  Week: {
    hours: 4,
    minutes: 35,
    pages: 212,
    sessions: 9,
    days: 6,
    perSession: 31,
    pagesPerHour: 46,
    pagesPerSession: 24,
    titles: 1,
    graph: {
      data: [25, 40, 0, 55, 30, 70, 45],
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      yLabels: [0, 20, 40, 60, 80],
    },
  },
  Month: {
    hours: 18,
    minutes: 10,
    pages: 884,
    sessions: 34,
    days: 22,
    perSession: 32,
    pagesPerHour: 49,
    pagesPerSession: 26,
    titles: 4,
    graph: {
      data: [120, 95, 140, 110],
      labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
      yLabels: [0, 50, 100, 150],
    },
  },
  2026: {
    hours: 96,
    minutes: 20,
    pages: 4720,
    sessions: 181,
    days: 138,
    perSession: 32,
    pagesPerHour: 49,
    pagesPerSession: 26,
    titles: 23,
    graph: {
      data: [340, 420, 380, 510, 470, 620, 580, 640, 410, 0, 0, 0],
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      yLabels: [0, 200, 400, 600, 800],
    },
  },
  'All Time': {
    hours: 214,
    minutes: 45,
    pages: 10480,
    sessions: 402,
    days: 311,
    perSession: 32,
    pagesPerHour: 49,
    pagesPerSession: 26,
    titles: 57,
    graph: {
      data: [1200, 2840, 3160, 4720],
      labels: ['2023', '2024', '2025', '2026'],
      yLabels: [0, 1500, 3000, 4500],
    },
  },
}

/** Peaks — personal bests, which the Highlights half of the toggle shows. */
export const HIGHLIGHT_PEAKS = {
  currentStreak: 6,
  longestStreak: 41,
  longestTitle: 384,
  mostPages: 96,
  longestSessionHours: 2,
  longestSessionMinutes: 15,
}

// ── Book Talks ────────────────────────────────────────────────────────────

/** Chats grouped by `MMMM yyyy` — the date reads created_at in progress, updated_at completed. */
export const BOOK_TALKS_IN_PROGRESS = [
  {
    title: 'September 2026',
    chats: [
      { id: 'bt1', bookTitle: 'The Wild Robot', date: '09/16/26' },
      { id: 'bt2', bookTitle: 'Wings of Fire: The Dragonet Prophecy', date: '09/11/26' },
    ],
  },
]

export const BOOK_TALKS_COMPLETED = [
  {
    title: 'September 2026',
    chats: [{ id: 'bt3', bookTitle: 'Amari and the Night Brothers', date: '09/09/26' }],
  },
  {
    title: 'August 2026',
    chats: [
      { id: 'bt4', bookTitle: 'New Kid', date: '08/28/26' },
      { id: 'bt5', bookTitle: 'Front Desk', date: '08/14/26' },
    ],
  },
]

/**
 * A chat. Benny's turns can carry a `headline` — the bold question above the body — which is how
 * the prompt is separated from the preamble that sets it up.
 */
export const BENNY_CHAT = {
  totalQuestions: 5,
  // BennyHeaderReaction picks a face from the bennyReactions registry.
  reaction: 'happy',
  // Benny's scripted follow-ups, consumed in order as the reader answers.
  replies: [
    {
      id: 'r1',
      role: 'assistant',
      headline: 'Was the ending fair to Roz?',
      text: 'She has to leave the island she worked so hard to belong to. Did that feel right to you, or unfair?',
    },
    {
      id: 'r2',
      role: 'assistant',
      headline: 'Would you recommend it?',
      text: 'Who in your class would like this one, and what would you tell them about it?',
    },
  ],
  messages: [
    {
      id: 'm1',
      role: 'assistant',
      text: 'Hi Maya! I heard you just read The Wild Robot. I have a few questions for you.',
    },
    {
      id: 'm2',
      role: 'assistant',
      headline: 'What did you think of Roz?',
      text: 'She starts out as a machine, but the animals change her. Did she feel like a person to you by the end?',
    },
    {
      id: 'm3',
      role: 'user',
      text: 'She did! Especially when she adopts Brightbill. She starts choosing things instead of just following her programming.',
    },
  ],
}

// ── Badges (Log tab) ──────────────────────────────────────────────────────

/**
 * The Log tab's Badges screen is a reader's own collection, and it is EARNED-ONLY —
 * `useEarnedBadges(profileId)`. Unearned badges appear inside a challenge, not here, which is why
 * every row below has an `earnedOn`.
 *
 * `Badge` still renders the unearned states (grey ring, progress text) because the same component
 * is used in the challenge view; they just never occur on this screen.
 *
 * `title` is badge_title — the challenge the badge came from — and `name` is badge_name. The
 * earned line is computed: once earned it is always `Completed on M/D/YY`.
 */
/**
 * Earned achievements. `achievement_image_thumb_url` is API-served, so — exactly as with badges —
 * nothing in the image registry can stand in for the artwork; the gradients are placeholders and
 * are logged as a deviation. Eleven so the last row is partial, which is the case that shows
 * whether the grid is really three fixed columns.
 */
/**
 * The RMI tab's selected survey. `top_three_factors_descriptions` drives the persona carousel:
 * each `student_name` is camel-cased into a persona key (`buildPersonaKey`), which is both the
 * image key and the lookup into PERSONA_BACKGROUND_COLORS — so the card's tint comes from the
 * persona, never from the tenant accent.
 */
/**
 * The reader's OWN reviews — `getProfilesReviews(page)`, which is what the Log tab's Reviews
 * renders. Every author is therefore the reader, which matters because `ReviewDetails` draws the
 * reader's own avatar on this branch (`type === 'log' ? profile : review_initials`): a list with
 * other people's names in it looks fine until you open one and the avatar disagrees with the
 * byline. Discover's list is a DIFFERENT fetch — see DISCOVER_REVIEWS.
 *
 * `review_date` is formatted `MMM. D, YYYY` by the row, and the last entry exercises the
 * `rejected` branch — its own warning strip, a yellowLight ground, and the options dots moved up
 * into that strip.
 */
export const PROFILE_REVIEWS = [
  {
    id: 'rv1',
    author: 'Maya Chen',
    bookTitle: 'The Wild Robot',
    bookAuthor: 'Peter Brown',
    cover: 'linear-gradient(150deg,#2f6f4f,#7bb98f)',
    date: 'Aug. 28, 2026',
    status: 'approved',
    text: 'Roz waking up alone on that island is the part I keep thinking about. She has no idea what she is or why she is there, and she works it out by watching the animals — which is basically what I do at a new school. The middle got sad in a way I was not ready for.',
  },
  {
    id: 'rv2',
    author: 'Maya Chen',
    bookTitle: 'Amari and the Night Brothers',
    bookAuthor: 'B. B. Alston',
    cover: 'linear-gradient(150deg,#2b2a6b,#6d6ac4)',
    date: 'Aug. 12, 2026',
    status: 'approved',
    text: 'I picked this up because the cover looked like magic school and it is, but it is also about people assuming things about Amari before she opens her mouth. The tryouts were my favourite bit.',
  },
  {
    id: 'rv3',
    author: 'Maya Chen',
    bookTitle: 'New Kid',
    bookAuthor: 'Jerry Craft',
    cover: 'linear-gradient(150deg,#1f5f8b,#6fb3d6)',
    date: 'July 30, 2026',
    status: 'approved',
    text: 'A graphic novel that is actually about something. Jordan drawing in his sketchbook to say the stuff he cannot say out loud is a great way to show it instead of explaining it.',
  },
  {
    id: 'rv4',
    author: 'Maya Chen',
    bookTitle: 'Hatchet',
    bookAuthor: 'Gary Paulsen',
    cover: 'linear-gradient(150deg,#8a5a1f,#d2a45e)',
    date: 'July 9, 2026',
    status: 'rejected',
    text: 'this book was boring and i didnt read it lol',
  },
  {
    id: 'rv5',
    author: 'Maya Chen',
    bookTitle: 'Wings of Fire: The Dragonet Prophecy',
    bookAuthor: 'Tui T. Sutherland',
    cover: 'linear-gradient(150deg,#6b2f2f,#c47a5a)',
    date: 'June 24, 2026',
    // The third of the three `ReviewStatus` values — waiting on a moderator, so it is neither
    // live on Discover nor sent back. Without one the Pending filter is always empty.
    status: 'pending',
    text: 'Five dragonets raised under a mountain to end a war they never asked to be part of. Clay is the one I kept thinking about — he is the biggest of them and the gentlest, and the book keeps making that matter.',
  },
]

/**
 * `getDiscoverReviews(page)` — the community's reviews, which is a different endpoint and a
 * different list from the reader's own. `<Reviews type="discover" />` is the same component: it
 * adds the author's name above the date and a 40pt initials avatar, and shows the “…” only on
 * rows the reader wrote themselves (`isMyReviewOnDiscover`), which `isMine` stands in for here.
 */
export const DISCOVER_REVIEWS = [
  {
    id: 'dv1',
    author: 'Jordan Park',
    bookTitle: 'The Wild Robot',
    bookAuthor: 'Peter Brown',
    cover: 'linear-gradient(150deg,#2f6f4f,#7bb98f)',
    date: 'Sept. 2, 2026',
    status: 'approved',
    text: 'Roz waking up alone on that island is the part I keep thinking about. She has no idea what she is or why she is there, and she works it out by watching the animals — which is basically what I do at a new school.',
  },
  {
    id: 'dv2',
    author: 'Priya Shah',
    bookTitle: 'Amari and the Night Brothers',
    bookAuthor: 'B. B. Alston',
    cover: 'linear-gradient(150deg,#2b2a6b,#6d6ac4)',
    date: 'Aug. 24, 2026',
    status: 'approved',
    text: 'I picked this up because the cover looked like magic school and it is, but it is also about people assuming things about Amari before she opens her mouth. The tryouts were my favourite bit.',
  },
  {
    id: 'dv3',
    author: 'Maya Chen',
    bookTitle: 'New Kid',
    bookAuthor: 'Jerry Craft',
    cover: 'linear-gradient(150deg,#1f5f8b,#6fb3d6)',
    date: 'Aug. 11, 2026',
    status: 'approved',
    isMine: true,
    text: 'A graphic novel that is actually about something. Jordan drawing in his sketchbook to say the stuff he cannot say out loud is a great way to show it instead of explaining it.',
  },
  {
    id: 'dv4',
    author: 'Sam Okafor',
    bookTitle: 'Wings of Fire: The Dragonet Prophecy',
    bookAuthor: 'Tui T. Sutherland',
    cover: 'linear-gradient(150deg,#6b2f2f,#c47a5a)',
    date: 'Aug. 3, 2026',
    status: 'approved',
    text: 'Five dragonets raised under a mountain to end a war nobody asked them to fight. Clay is the one I liked — he is the biggest and the gentlest and the book keeps making that matter.',
  },
]

export const RMI_SURVEY = {
  id: 1,
  name: 'January 2026 Index',
  response: {
    status: 'scored',
    recommendedReadingGoal: 20,
    // PERSONA_BACKGROUND_COLORS in components/readingMotivation/constants.ts — fixed per persona.
    personas: [
      {
        title: 'The Detective',
        description:
          'You read to find things out. A question you cannot answer is the fastest way to get you into a book.',
        imageKey: 'theDetective',
        backgroundColor: '#F2F8D3',
      },
      {
        title: 'The Fan',
        description:
          'You read for the pleasure of it. Give you a world worth escaping into and you will stay there for hours.',
        imageKey: 'theFan',
        backgroundColor: '#D4F2F7',
      },
      {
        title: 'The Climber',
        description:
          'You like a book that pushes you. If it is hard and it is interesting, the hard part does not put you off.',
        imageKey: 'theClimber',
        backgroundColor: '#F3E3D8',
      },
    ],
    recommendations: [
      {
        id: 'r1',
        text: 'Try a nonfiction title about something you have been curious about lately.',
      },
      {
        id: 'r2',
        text: 'Keep a series going — you finish more when you already know the characters.',
      },
      { id: 'r3', text: 'Pick one book a month that looks a little too hard, and log it anyway.' },
    ],
  },
}

/**
 * `useRmiSurveyRequests` returns a LIST — the filter bar picks which one you are looking at, and
 * `getSelectedSurvey` falls back to the first. Each carries its own response, and a survey with no
 * response (or one still `in_progress`) takes the AnswerSurvey branch instead of the scored one,
 * so switching between these exercises both halves of the screen.
 */
export const RMI_SURVEYS = [
  RMI_SURVEY,
  {
    id: 2,
    name: 'September 2026 Index',
    response: { status: 'in_progress' },
  },
  {
    id: 3,
    name: 'October 2026 Index',
    response: null,
  },
]

export const ACHIEVEMENTS = [
  {
    id: 'a1',
    name: 'First Book',
    earnedOn: 'June 3, 2026',
    art: 'linear-gradient(140deg,#19BFD5,#0E8CA0)',
    badgeName: 'Summer Reading 2026',
    description:
      'You logged your very first reading session. Every reader starts here — keep a session going and the rest of the challenge opens up.',
  },
  {
    id: 'a2',
    name: 'Early Bird',
    earnedOn: 'June 9, 2026',
    art: 'linear-gradient(140deg,#F2A03D,#E8724B)',
    badgeName: 'Summer Reading 2026',
    description: 'You logged reading before 8am on five separate days.',
  },
  {
    id: 'a3',
    name: 'Page Turner',
    earnedOn: 'June 17, 2026',
    art: 'linear-gradient(140deg,#B43DD0,#822C95)',
    description: 'You read 500 pages across the challenge.',
  },
  {
    id: 'a4',
    name: 'Marathon Reader',
    earnedOn: 'June 24, 2026',
    art: 'linear-gradient(140deg,#0BA85F,#077A45)',
    badgeName: 'Summer Reading 2026',
    description: 'You logged more than 1,000 minutes in a single month.',
  },
  {
    id: 'a5',
    name: 'Night Owl',
    earnedOn: 'July 1, 2026',
    art: 'linear-gradient(140deg,#4C6FE8,#2B47A8)',
    description: 'You logged reading after 9pm on ten separate nights.',
  },
  {
    id: 'a6',
    name: 'Streak Starter',
    earnedOn: 'July 8, 2026',
    art: 'linear-gradient(140deg,#E85648,#B5382C)',
    badgeName: 'Mystery Month',
    description: 'You kept a reading streak alive for seven days in a row.',
  },
  {
    id: 'a7',
    name: 'Reviewer',
    earnedOn: 'July 15, 2026',
    art: 'linear-gradient(140deg,#F2C53D,#D99B22)',
    badgeName: 'Mystery Month',
    description: 'You wrote your first book review and shared it with other readers.',
  },
  {
    id: 'a8',
    name: 'Explorer',
    earnedOn: 'July 22, 2026',
    art: 'linear-gradient(140deg,#2FB5A8,#1B7F76)',
    description: 'You read titles from six different genres.',
  },
  {
    id: 'a9',
    name: 'Bookworm',
    earnedOn: 'August 2, 2026',
    art: 'linear-gradient(140deg,#8E6BE8,#5C3FB0)',
    badgeName: 'Ms. Abbott’s Class Challenge',
    description: 'You finished twenty-five books.',
  },
  {
    id: 'a10',
    name: 'Summer Finisher',
    earnedOn: 'August 14, 2026',
    art: 'linear-gradient(140deg,#F26430,#C2431A)',
    badgeName: 'Summer Reading 2026',
    description: 'You completed every requirement in the summer challenge.',
  },
  {
    id: 'a11',
    name: 'Top Logger',
    earnedOn: 'August 28, 2026',
    art: 'linear-gradient(140deg,#19BFD5,#4C6FE8)',
    badgeName: 'Ms. Abbott’s Class Challenge',
    description: 'You logged more minutes than anyone else in your class this month.',
  },
]

/**
 * `badgeType` is `earned_badges.badge_type` — the `BadgeType` enum in `types/api/enums.ts`:
 * `completion | registration | full_card_bingo | BadgeRequirement | LearningTrack |
 * PointRequirement | ReviewRequirement | Program`. The casing is mixed because the list spans two
 * generations of the schema; the raw values are kept as the ids and labelled for display.
 */
export const LOG_BADGES = [
  {
    id: 'b1',
    title: 'Summer Reading 2026',
    name: 'Night Owl',
    badgeType: 'BadgeRequirement',
    earnedOn: 'September 12, 2026',
    earnedText: 'Completed on 9/12/26',
    art: 'linear-gradient(140deg,#822C95,#B43DD0)',
    markers: ['TicketsMarker'],
  },
  {
    id: 'b2',
    title: 'Summer Reading 2026',
    name: 'Streak Starter',
    badgeType: 'BadgeRequirement',
    earnedOn: 'September 8, 2026',
    earnedText: 'Completed on 9/8/26',
    art: 'linear-gradient(140deg,#A34320,#F26430)',
    markers: ['CertificatesMarker', 'RewardsMarker'],
  },
  {
    id: 'b3',
    title: 'Mystery Month',
    name: '10 Books',
    badgeType: 'completion',
    earnedOn: 'August 30, 2026',
    earnedText: 'Completed on 8/30/26',
    art: 'linear-gradient(140deg,#087542,#0BA85F)',
    markers: [],
  },
  {
    id: 'b4',
    title: 'Ms. Abbott’s Class Challenge',
    name: 'Daily Reader',
    badgeType: 'BadgeRequirement',
    earnedOn: 'August 21, 2026',
    earnedText: 'Completed on 8/21/26',
    art: 'linear-gradient(140deg,#154887,#196DD5)',
    markers: ['TicketsMarker'],
  },
  {
    id: 'b5',
    title: 'Read Around the World',
    name: 'Passport Stamp',
    badgeType: 'LearningTrack',
    earnedOn: 'August 9, 2026',
    earnedText: 'Completed on 8/9/26',
    art: 'linear-gradient(140deg,#826022,#FFBC42)',
    markers: ['CertificatesMarker'],
  },
  {
    id: 'b6',
    title: 'Summer Reading 2026',
    name: 'Summer Finisher',
    badgeType: 'completion',
    earnedOn: 'July 30, 2026',
    earnedText: 'Completed on 7/30/26',
    art: 'linear-gradient(140deg,#0F7280,#19BFD5)',
    markers: ['RewardsMarker', 'TicketsMarker'],
  },
]

/**
 * A badge as the detail screen sees it. `tickets` / `rewards` / `certificates` drive the awards
 * block; the markers on the list row are the same three facts in miniature.
 */
export const BADGE_DETAIL = {
  title: 'Summer Reading 2026',
  name: 'Night Owl',
  challengeName: 'Summer Reading 2026',
  dateRange: 'Jun 1 - Aug 31, 2026',
  earnedOn: 'September 12, 2026',
  completedOn: '9/12/26',
  progressText: '5/5 Books Read',
  art: 'linear-gradient(140deg,#822C95,#B43DD0)',
  tickets: 3,
  rewards: [
    {
      id: 'rw1',
      title: 'Bookstore voucher',
      description: 'A $10 voucher for the school book fair, collected from the library desk.',
    },
  ],
  certificates: [{ id: 'ct1', title: 'Summer Reading Certificate' }],
}
