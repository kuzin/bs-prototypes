// ─── Book Discovery — mock data ──────────────────────────────────────────────
// A reader-facing book experience: rich metadata, reviews & comments, partner
// shelves (Comics Plus, Scholastic, Sora), and Benny's AI recommendations.
//
// Covers come from the Open Library cover CDN by ISBN; `?default=false` makes a
// missing cover 404 so the <Cover> component can fall back to a color gradient.

export const coverFor = (isbn) =>
  isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false` : null

// ─── The reader (drives personalization) ─────────────────────────────────────

export const READER = {
  name: 'Maya Chen',
  first: 'Maya',
  initials: 'MC',
  grade: 'Grade 4',
  color: '#F0966F',
  school: 'Lincoln Elementary',
  streak: 12,
  booksThisYear: 27,
  justFinished: 'The Wild Robot',
  loves: ['Animals', 'Adventure', 'Graphic Novels'],
}

// ─── Partners ─────────────────────────────────────────────────────────────────

export const PARTNERS = {
  comicsplus: {
    id: 'comicsplus',
    name: 'Comics Plus',
    accent: '#0DA7BC',
    soft: '#E6F7FA',
    kind: 'Read now',
    blurb: 'Unlimited comics, graphic novels & magazines — no holds, no waitlists.',
    mark: '/bs-prototypes/comicsplus/Mark.svg',
    wordmark: '/bs-prototypes/comicsplus/Wordmark.svg',
  },
  scholastic: {
    id: 'scholastic',
    name: 'Scholastic',
    accent: '#E1141C',
    soft: '#FDECEC',
    kind: 'Magazines',
    blurb: 'Classroom magazines — fresh issues every month, leveled for your grade.',
  },
  sora: {
    id: 'sora',
    name: 'Sora',
    accent: '#2C6BED',
    soft: '#EAF0FE',
    kind: 'Borrow',
    blurb: 'Borrow ebooks & audiobooks free from Lincoln Public Library.',
  },
  libby: {
    id: 'libby',
    name: 'Libby',
    accent: '#A21CAF',
    soft: '#F8E8FB',
    kind: 'Borrow',
    blurb: 'Borrow ebooks & audiobooks free from your public library, via Libby.',
  },
  library: {
    id: 'library',
    name: 'School Library',
    accent: '#16A97A',
    soft: '#E6F8EF',
    kind: 'On the shelf',
    blurb: 'Find it on the shelf at the Lincoln Elementary library.',
  },
}

// ─── Genre palette (chips) ────────────────────────────────────────────────────

export const GENRES = {
  Adventure: { bg: '#D1FAE5', color: '#065F46' },
  Fantasy: { bg: '#FCE7F3', color: '#9D174D' },
  'Sci-Fi': { bg: '#E0F2FE', color: '#0369A1' },
  Mystery: { bg: '#F1F5F9', color: '#334155' },
  Humor: { bg: '#FEF9C3', color: '#854D0E' },
  Survival: { bg: '#FEF3C7', color: '#92400E' },
  Historical: { bg: '#DBEAFE', color: '#1E40AF' },
  Dystopian: { bg: '#EDE9FE', color: '#5B21B6' },
  'Realistic Fiction': { bg: '#FFE4E6', color: '#9F1239' },
  Animals: { bg: '#DCFCE7', color: '#166534' },
  'Graphic Novel': { bg: '#CFFAFE', color: '#155E75' },
  Memoir: { bg: '#F3E8FF', color: '#6B21A8' },
  Sports: { bg: '#FFEDD5', color: '#9A3412' },
  'Novel in Verse': { bg: '#FAE8FF', color: '#86198F' },
  Nonfiction: { bg: '#ECFCCB', color: '#3F6212' },
  Magazine: { bg: '#FEE2E2', color: '#B91C1C' },
  Science: { bg: '#CFFAFE', color: '#0E7490' },
  'Current Events': { bg: '#FEF3C7', color: '#92400E' },
}

// ─── Format metadata (icon + label) ───────────────────────────────────────────

export const FORMATS = {
  print: { label: 'Print', icon: 'book-2' },
  ebook: { label: 'Ebook', icon: 'device-tablet' },
  audiobook: { label: 'Audiobook', icon: 'headphones' },
  magazine: { label: 'Magazine', icon: 'news' },
}

// ─── Reviewer personas ────────────────────────────────────────────────────────

const P = {
  maya: { name: 'Maya C.', initials: 'MC', grade: 'Grade 4', color: '#F0966F' },
  jayden: { name: 'Jayden P.', initials: 'JP', grade: 'Grade 5', color: '#1D4ED8' },
  sofia: { name: 'Sofia R.', initials: 'SR', grade: 'Grade 4', color: '#DB2777' },
  noah: { name: 'Noah K.', initials: 'NK', grade: 'Grade 5', color: '#0DA7BC' },
  emma: { name: 'Emma L.', initials: 'EL', grade: 'Grade 4', color: '#16A97A' },
  liam: { name: 'Liam T.', initials: 'LT', grade: 'Grade 6', color: '#7C3AED' },
  ava: { name: 'Ava M.', initials: 'AM', grade: 'Grade 3', color: '#EA580C' },
  diego: { name: 'Diego H.', initials: 'DH', grade: 'Grade 5', color: '#0891B2' },
  priya: { name: 'Priya S.', initials: 'PS', grade: 'Grade 4', color: '#9333EA' },
  zoe: { name: 'Zoe B.', initials: 'ZB', grade: 'Grade 3', color: '#E11D48' },
  reyes: {
    name: 'Mr. Reyes',
    initials: 'MR',
    grade: 'Teacher · Grade 4',
    color: '#475569',
    educator: true,
  },
  patel: {
    name: 'Ms. Patel',
    initials: 'MP',
    grade: 'Librarian',
    color: '#0F766E',
    educator: true,
  },
}

let _rid = 0
const review = (who, stars, date, body, opts = {}) => ({
  id: `rv-${_rid++}`,
  ...P[who],
  stars,
  date,
  body,
  helpful: opts.helpful ?? Math.round(stars * 7 + body.length / 20),
  verified: opts.verified ?? false, // logged the book + completed a Benny Book Talk
  replies: opts.replies || [],
})

const reply = (who, date, body) => ({ ...P[who], date, body })

// ─── Books ──────────────────────────────────────────────────────────────────
// availability: where a reader can get it. partner ∈ PARTNERS; the first entry
// drives the primary "get it" call-to-action.

const RAW = [
  {
    id: 'wild-robot-escapes',
    isbn: '9780316382045',
    title: 'The Wild Robot Escapes',
    author: 'Peter Brown',
    series: { name: 'The Wild Robot', number: 2 },
    color: '#0E9F6E',
    genres: ['Adventure', 'Sci-Fi', 'Animals'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'audiobook', action: 'Borrow' },
      { partner: 'libby', format: 'audiobook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '740L',
    ageRange: '8–12',
    pageCount: 288,
    audioLength: '4h 20m',
    published: 2018,
    publisher: 'Little, Brown',
    language: 'English',
    rating: 4.8,
    ratingCount: 1247,
    ratingDist: [960, 220, 47, 12, 8],
    description:
      "Roz the robot is back — but this time she's far from her island, living on a farm and desperate to return to her son Brightbill. To get home, she'll have to outwit the people who built her, survive a world that wasn't made for her, and decide what it truly means to be alive. Along the way she befriends a family of farm animals, dodges the company that owns her, and holds tight to the memory of the wild place she calls home. A heart-tugging adventure about family, freedom, and the courage it takes to choose your own path.",
    bennyTake:
      'If The Wild Robot made you cry happy tears, book two hits even harder. Roz is braver, the stakes are bigger, and Brightbill will have your whole heart.',
    bennyReason: 'You just finished The Wild Robot — Roz’s story isn’t over yet.',
    themes: ['Family', 'Courage', 'Belonging', 'Nature'],
    contentNote: 'Gentle peril; great for sensitive readers.',
    readersAtSchool: 38,
    awards: ['Goodreads Choice Nominee'],
    similar: ['wild-robot', 'one-ivan', 'amari', 'hatchet'],
    reviews: [
      review(
        'maya',
        5,
        'Apr 28, 2026',
        'I finished The Wild Robot last night and started this ONE MINUTE later. Roz on a farm trying to get back to Brightbill?? I was not okay 😭 In the best way.',
        {
          verified: true,
          helpful: 64,
          replies: [reply('emma', 'Apr 29, 2026', 'same!! the ending of book 1 destroyed me')],
        },
      ),
      review(
        'reyes',
        5,
        'Apr 12, 2026',
        "We read book one as a class read-aloud and half my students checked this out the same week. Beautiful for talking about family and what makes us 'us.'",
        { verified: true, helpful: 51 },
      ),
      review(
        'jayden',
        4,
        'Mar 30, 2026',
        'Not quite as good as the first one but still really really good. The truck part is so tense.',
        { helpful: 22 },
      ),
      review('ava', 5, 'Mar 18, 2026', 'I love Roz so much. She is the best robot mom.', {
        helpful: 18,
      }),
    ],
  },
  {
    id: 'wild-robot',
    isbn: '9780316381994',
    title: 'The Wild Robot',
    author: 'Peter Brown',
    series: { name: 'The Wild Robot', number: 1 },
    color: '#16A97A',
    genres: ['Adventure', 'Sci-Fi', 'Animals'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'audiobook', action: 'Borrow' },
      { partner: 'libby', format: 'audiobook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '710L',
    ageRange: '8–12',
    pageCount: 279,
    audioLength: '3h 42m',
    published: 2016,
    publisher: 'Little, Brown',
    language: 'English',
    rating: 4.9,
    ratingCount: 3104,
    ratingDist: [2680, 320, 70, 20, 14],
    description:
      'When robot Roz opens her eyes for the first time, she discovers that she is alone on a remote, wild island. As she learns to survive, she slowly befriends the animals — and becomes a mother to an orphaned gosling.',
    bennyTake:
      'A modern classic. Funny, gentle, and surprisingly deep — the kind of book that makes you look at the world a little differently.',
    themes: ['Family', 'Kindness', 'Survival', 'Nature'],
    contentNote: 'Mild peril; deeply kind-hearted.',
    readersAtSchool: 64,
    awards: ['#1 Lincoln favorite'],
    similar: ['wild-robot-escapes', 'one-ivan', 'hatchet', 'winn-dixie'],
    reviews: [
      review(
        'maya',
        5,
        'Apr 10, 2026',
        'My favorite book of the whole year. I read it twice. Roz and Brightbill forever 💚',
        { verified: true, helpful: 88 },
      ),
      review(
        'noah',
        5,
        'Mar 22, 2026',
        'I usually only like graphic novels but this one got me. Read it as an audiobook on Sora and the voice is perfect.',
        { helpful: 41 },
      ),
      review(
        'patel',
        5,
        'Feb 14, 2026',
        'A perfect read-aloud and a perfect independent read. It belongs in every classroom.',
        { verified: true, helpful: 73 },
      ),
    ],
  },
  {
    id: 'amari',
    isbn: '9780062975171',
    title: 'Amari and the Night Brothers',
    author: 'B. B. Alston',
    series: { name: 'Supernatural Investigations', number: 1 },
    color: '#6D28D9',
    genres: ['Fantasy', 'Adventure', 'Mystery'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'scholastic', format: 'print', action: 'On the list' },
      { partner: 'sora', format: 'audiobook', action: 'Borrow' },
      { partner: 'libby', format: 'audiobook', action: 'Borrow' },
    ],
    lexile: '700L',
    ageRange: '8–12',
    pageCount: 407,
    audioLength: '11h 1m',
    published: 2021,
    publisher: 'Balzer + Bray',
    language: 'English',
    rating: 4.7,
    ratingCount: 982,
    ratingDist: [710, 190, 55, 17, 10],
    description:
      'Amari’s brother has gone missing, and the only clue is a ticking briefcase that invites her to a secret Bureau of Supernatural Affairs. To find him, she’ll have to compete against kids from the wealthiest, most magical families — and confront a power everyone fears. As a Black girl from the projects in a world that doubts she belongs, Amari has to trust her own magic even when it marks her as dangerous. Fast, funny, and full of heart, it’s a magical adventure about courage, family, and proving the doubters wrong.',
    bennyTake:
      'If you love a brave hero who refuses to give up — like Roz — Amari is your next obsession. Magic school meets mystery meets heart.',
    bennyReason: 'A fearless hero who never gives up, like Roz in The Wild Robot.',
    themes: ['Courage', 'Family', 'Belonging', 'Prejudice'],
    contentNote: 'Some fantasy danger; themes of unfairness handled thoughtfully.',
    readersAtSchool: 29,
    awards: ['NYT Bestseller'],
    similar: ['lightning-thief', 'harry-potter', 'wrinkle'],
    reviews: [
      review(
        'priya',
        5,
        'Apr 2, 2026',
        'Amari is SO brave. I want to be a Junior Agent now. The cliffhanger made me beg my mom for book 2.',
        { helpful: 37 },
      ),
      review(
        'liam',
        4,
        'Mar 15, 2026',
        "It's long but it flies by. The magic tryouts are my favorite part.",
        { helpful: 19 },
      ),
      review(
        'reyes',
        5,
        'Feb 28, 2026',
        'Great pick for readers who finished Percy Jackson and want something fresh. Strong, kind main character.',
        { verified: true, helpful: 28 },
      ),
    ],
  },
  {
    id: 'new-kid',
    isbn: '9780062691200',
    title: 'New Kid',
    author: 'Jerry Craft',
    color: '#0DA7BC',
    genres: ['Graphic Novel', 'Realistic Fiction'],
    formats: ['print', 'ebook'],
    availability: [
      { partner: 'comicsplus', format: 'ebook', action: 'Read now' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: 'GN320L',
    ageRange: '8–12',
    pageCount: 256,
    published: 2019,
    publisher: 'Quill Tree Books',
    language: 'English',
    rating: 4.7,
    ratingCount: 1543,
    ratingDist: [1140, 280, 80, 28, 15],
    description:
      'Seventh-grader Jordan Banks loves drawing cartoons. But instead of art school, his parents send him to a posh private school where he’s one of the few kids of color. Caught between two worlds, Jordan navigates the everyday awkwardness — and unfairness — of fitting in.',
    bennyTake:
      'The first graphic novel to win the Newbery Medal, and you can feel why. Funny, honest, and the art is so expressive.',
    bennyReason: 'A graphic novel — one of your favorites — that everyone’s talking about.',
    themes: ['Identity', 'Friendship', 'Belonging', 'Race'],
    contentNote: 'Thoughtful look at fitting in; great discussion book.',
    readersAtSchool: 41,
    awards: ['Newbery Medal'],
    similar: ['smile', 'el-deafo', 'front-desk'],
    reviews: [
      review(
        'diego',
        5,
        'Apr 5, 2026',
        'I felt like Jordan was a real kid at my school. The little drawings between chapters are so funny and true.',
        { verified: true, helpful: 44 },
      ),
      review(
        'emma',
        5,
        'Mar 11, 2026',
        'Read it in one sitting on Comics Plus. Then read it again.',
        { helpful: 31 },
      ),
      review(
        'reyes',
        5,
        'Jan 30, 2026',
        'My most-recommended graphic novel. Kids who "don’t like reading" finish it and ask for more.',
        { verified: true, helpful: 52 },
      ),
    ],
  },
  {
    id: 'dog-man',
    isbn: '9780545581608',
    title: 'Dog Man',
    author: 'Dav Pilkey',
    series: { name: 'Dog Man', number: 1 },
    color: '#F0A024',
    genres: ['Graphic Novel', 'Humor'],
    formats: ['print', 'ebook'],
    availability: [
      { partner: 'comicsplus', format: 'ebook', action: 'Read now' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: 'GN390L',
    ageRange: '7–10',
    pageCount: 240,
    published: 2016,
    publisher: 'Graphix',
    language: 'English',
    rating: 4.6,
    ratingCount: 2890,
    ratingDist: [2010, 540, 220, 80, 40],
    description:
      'Part dog, part man, all hero! When a police officer and his dog are injured on the job, a surgery combines them into the crime-fighting sensation Dog Man. He’s fast, he’s furry, and he can’t resist chasing a ball. With his supercharged sniffer and unstoppable loyalty, Dog Man races to foil the schemes of the world’s most evil cat, Petey — and Petey’s adorable clone, Li’l Petey, who just might melt everyone’s hearts. Between the chaos, Dog Man wrestles with what it really means to be a good boy: at work, with his friends, and deep down inside. Told in comics with hilarious Flip-O-Rama action and a joke on nearly every page, it’s the wildly funny series that turned millions of reluctant readers into kids who can’t put a book down.',
    bennyTake:
      'Pure silly fun with a huge heart. The "Flip-O-Rama" pages are a blast — perfect for a reading laugh.',
    bennyReason: 'Hilarious, fast, and impossible to put down — a Comics Plus crowd-pleaser.',
    themes: ['Friendship', 'Good vs. evil', 'Being yourself'],
    contentNote: 'Cartoon mischief; squeaky-clean humor.',
    readersAtSchool: 57,
    awards: ['Lincoln Top 5 this month'],
    similar: ['smile', 'new-kid', 'el-deafo'],
    reviews: [
      review(
        'ava',
        5,
        'Apr 8, 2026',
        'SO FUNNY. I laughed so loud my brother told me to be quiet. Flip-O-Rama is the best invention ever.',
        { helpful: 39 },
      ),
      review(
        'zoe',
        5,
        'Mar 25, 2026',
        'I read 4 Dog Man books this week on Comics Plus. Petey is my favorite.',
        { verified: true, helpful: 26 },
      ),
      review(
        'jayden',
        4,
        'Feb 19, 2026',
        "It's really silly but that's why it's good. Good for a quick read after a hard book.",
        { helpful: 14 },
      ),
    ],
  },
  {
    id: 'lightning-thief',
    isbn: '9780786838653',
    title: 'The Lightning Thief',
    author: 'Rick Riordan',
    series: { name: 'Percy Jackson & the Olympians', number: 1 },
    color: '#1D4ED8',
    genres: ['Fantasy', 'Adventure'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'audiobook', action: 'Borrow' },
      { partner: 'libby', format: 'audiobook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '680L',
    ageRange: '9–12',
    pageCount: 377,
    audioLength: '10h 2m',
    published: 2005,
    publisher: 'Disney-Hyperion',
    language: 'English',
    rating: 4.7,
    ratingCount: 4210,
    ratingDist: [3100, 760, 230, 80, 40],
    description:
      'Percy Jackson is about to be kicked out of boarding school… again. But that’s the least of his troubles. He learns he’s a demigod, the son of Poseidon, and someone has stolen Zeus’s master lightning bolt — and Percy is the prime suspect. To clear his name and stop a war among the gods, he sets off across America with his friends Annabeth and Grover, battling monsters straight out of Greek myth. Hilarious, action-packed, and impossible to put down, it’s the series that made mythology cool.',
    bennyTake:
      'The book that turned a million kids into mythology nerds. Funny, fast, and the perfect gateway to a huge series.',
    bennyReason: 'Big quest energy and a hero learning he’s braver than he thought.',
    themes: ['Identity', 'Friendship', 'Heroism', 'Mythology'],
    contentNote: 'Fantasy monster battles; lots of humor.',
    readersAtSchool: 35,
    awards: ['Modern classic'],
    similar: ['amari', 'harry-potter', 'wrinkle'],
    reviews: [
      review(
        'liam',
        5,
        'Apr 1, 2026',
        'I have now read this series 3 times. Percy is hilarious and the Greek mythology stuff is actually real which is so cool.',
        { verified: true, helpful: 47 },
      ),
      review(
        'noah',
        5,
        'Mar 5, 2026',
        'The audiobook on Sora is amazing for car rides. We almost missed our exit.',
        { helpful: 33 },
      ),
      review(
        'sofia',
        4,
        'Jan 22, 2026',
        'A little scary in some parts but mostly just super exciting.',
        { helpful: 12 },
      ),
    ],
  },
  {
    id: 'front-desk',
    isbn: '9781338157796',
    title: 'Front Desk',
    author: 'Kelly Yang',
    series: { name: 'Front Desk', number: 1 },
    color: '#D97706',
    genres: ['Realistic Fiction', 'Historical'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'scholastic', format: 'print', action: 'On the list' },
      { partner: 'sora', format: 'ebook', action: 'Borrow' },
    ],
    lexile: '640L',
    ageRange: '8–12',
    pageCount: 286,
    audioLength: '6h 45m',
    published: 2018,
    publisher: 'Scholastic Press',
    language: 'English',
    rating: 4.7,
    ratingCount: 1190,
    ratingDist: [870, 220, 60, 25, 15],
    description:
      'Mia Tang lives in a motel. Her parents manage it, and Mia works the front desk while they clean rooms — and secretly hide immigrants in empty rooms. Between mean Mr. Yao and the daily struggles of her family, Mia dreams of becoming a writer.',
    bennyTake:
      'Based on the author’s real childhood. Big-hearted, funny, and quietly powerful about kindness and standing up for people.',
    bennyReason: 'A brave, kind main character you’ll root for from page one.',
    themes: ['Family', 'Immigration', 'Courage', 'Kindness'],
    contentNote: 'Touches on unfairness and prejudice; hopeful throughout.',
    readersAtSchool: 22,
    awards: ['Asian/Pacific American Award'],
    similar: ['out-of-my-mind', 'esperanza', 'new-kid'],
    reviews: [
      review(
        'priya',
        5,
        'Mar 28, 2026',
        'Mia is so smart and brave. I loved her letters. I cried twice.',
        { verified: true, helpful: 35 },
      ),
      review(
        'emma',
        5,
        'Feb 8, 2026',
        'It made me think about how I treat people. Also I want to run a motel now.',
        { helpful: 21 },
      ),
    ],
  },
  {
    id: 'crossover',
    isbn: '9780544107717',
    title: 'The Crossover',
    author: 'Kwame Alexander',
    color: '#E8866A',
    genres: ['Sports', 'Novel in Verse', 'Realistic Fiction'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'scholastic', format: 'print', action: 'On the list' },
      { partner: 'sora', format: 'audiobook', action: 'Borrow' },
      { partner: 'libby', format: 'audiobook', action: 'Borrow' },
    ],
    lexile: '750L',
    ageRange: '9–12',
    pageCount: 237,
    audioLength: '2h 19m',
    published: 2014,
    publisher: 'HMH Books',
    language: 'English',
    rating: 4.6,
    ratingCount: 870,
    ratingDist: [600, 180, 55, 22, 13],
    description:
      'Josh and Jordan are twin basketball stars, and the court is their kingdom. But as their dad’s health falters and a girl comes between the brothers, Josh learns that the toughest games are the ones off the court. Told in electric, rhythmic verse.',
    bennyTake:
      'Even if you think you don’t like poetry, this reads like a fast break. The audiobook, read by the author, is unreal.',
    bennyReason: 'Fast, rhythmic, and full of heart — try it as an audiobook.',
    themes: ['Family', 'Brotherhood', 'Grief', 'Growing up'],
    contentNote: 'Deals with a family illness; deeply moving.',
    readersAtSchool: 18,
    awards: ['Newbery Medal'],
    similar: ['ghost', 'brown-girl', 'out-of-my-mind'],
    reviews: [
      review(
        'diego',
        5,
        'Apr 3, 2026',
        'I play basketball so I thought it would be about basketball but it made me cry. The verse makes it go SO fast.',
        { verified: true, helpful: 29 },
      ),
      review(
        'reyes',
        5,
        'Feb 1, 2026',
        'My go-to for readers who say poetry is boring. The author’s audiobook performance seals the deal.',
        { verified: true, helpful: 26 },
      ),
    ],
  },
  {
    id: 'one-ivan',
    isbn: '9780061992278',
    title: 'The One and Only Ivan',
    author: 'Katherine Applegate',
    color: '#0F766E',
    genres: ['Animals', 'Realistic Fiction'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'ebook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '570L',
    ageRange: '8–11',
    pageCount: 320,
    audioLength: '3h 45m',
    published: 2012,
    publisher: 'HarperCollins',
    language: 'English',
    rating: 4.6,
    ratingCount: 1340,
    description:
      'Ivan is a gorilla who has lived for years in a shopping-mall enclosure. He rarely thinks about his old life — until a baby elephant named Ruby arrives, and Ivan makes a promise to give her a better one. With the help of a stray dog and a kind girl, Ivan rediscovers his love of art and finds a way to change everything. Told in Ivan’s own spare, funny, and deeply moving voice and inspired by a true story, it’s a Newbery-winning tale about friendship, freedom, and hope.',
    bennyTake: 'Quiet, gentle, and unforgettable. Ivan’s voice will stay with you.',
    bennyReason: 'Another tender animal story, like The Wild Robot.',
    themes: ['Friendship', 'Freedom', 'Hope', 'Promises'],
    readersAtSchool: 31,
    awards: ['Newbery Medal'],
    similar: ['wild-robot', 'winn-dixie', 'wild-robot-escapes'],
    reviews: [
      review(
        'sofia',
        5,
        'Mar 12, 2026',
        'Ivan is the best. I didn’t know a gorilla could make me feel so much.',
        { verified: true, helpful: 24 },
      ),
      review('zoe', 5, 'Feb 20, 2026', 'I love Bob the dog. Read this if you like animals.', {
        helpful: 11,
      }),
    ],
  },
  {
    id: 'smile',
    isbn: '9780545132060',
    title: 'Smile',
    author: 'Raina Telgemeier',
    color: '#EC4899',
    genres: ['Graphic Novel', 'Memoir'],
    formats: ['print', 'ebook'],
    availability: [
      { partner: 'comicsplus', format: 'ebook', action: 'Read now' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: 'GN410L',
    ageRange: '8–12',
    pageCount: 224,
    published: 2010,
    publisher: 'Graphix',
    language: 'English',
    rating: 4.6,
    ratingCount: 2010,
    description:
      'A true story! Raina just wants to be a normal sixth grader. But one night she trips and injures her two front teeth, beginning an ordeal of braces, surgery, and embarrassing headgear — all while navigating middle-school friendships.',
    bennyTake:
      'The graphic novel that launched a thousand readers. So real it almost hurts (in a good way).',
    bennyReason: 'A true-story graphic novel — funny, real, and read in an afternoon.',
    themes: ['Growing up', 'Friendship', 'Confidence'],
    readersAtSchool: 48,
    awards: ['Eisner Award'],
    similar: ['new-kid', 'el-deafo', 'dog-man'],
    reviews: [
      review(
        'emma',
        5,
        'Apr 6, 2026',
        'I have braces too so I FELT this book. Raina is so relatable.',
        { verified: true, helpful: 33 },
      ),
      review('ava', 4, 'Mar 1, 2026', 'I read it on Comics Plus twice. The art is so good.', {
        helpful: 15,
      }),
    ],
  },
  {
    id: 'el-deafo',
    isbn: '9781419712173',
    title: 'El Deafo',
    author: 'Cece Bell',
    color: '#0891B2',
    genres: ['Graphic Novel', 'Memoir'],
    formats: ['print', 'ebook'],
    availability: [
      { partner: 'comicsplus', format: 'ebook', action: 'Read now' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: 'GN420L',
    ageRange: '8–12',
    pageCount: 248,
    published: 2014,
    publisher: 'Abrams',
    language: 'English',
    rating: 4.6,
    ratingCount: 760,
    description:
      'Going to school and making new friends can be tough. But going to school and making new friends while wearing a bulky hearing aid? Cece turns her differences into superpowers in this funny, true graphic-novel memoir.',
    bennyTake:
      'Warm, hilarious, and a real eye-opener. El Deafo is a superhero we can all cheer for.',
    bennyReason: 'A true-story graphic novel about turning differences into superpowers.',
    themes: ['Friendship', 'Disability', 'Confidence', 'Identity'],
    readersAtSchool: 19,
    awards: ['Newbery Honor'],
    similar: ['smile', 'new-kid', 'out-of-my-mind'],
    reviews: [
      review(
        'priya',
        5,
        'Mar 20, 2026',
        'I learned so much and laughed so much at the same time. The superhero parts are awesome.',
        { helpful: 18 },
      ),
      review(
        'patel',
        5,
        'Jan 18, 2026',
        'A wonderful window-and-mirror book. Readers love it on Comics Plus.',
        { verified: true, helpful: 22 },
      ),
    ],
  },
  {
    id: 'hatchet',
    isbn: '9781416936473',
    title: 'Hatchet',
    author: 'Gary Paulsen',
    color: '#15803D',
    genres: ['Survival', 'Adventure'],
    formats: ['print', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'audiobook', action: 'Borrow' },
      { partner: 'libby', format: 'audiobook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '1020L',
    ageRange: '10–13',
    pageCount: 208,
    audioLength: '3h 40m',
    published: 1987,
    publisher: 'Simon & Schuster',
    language: 'English',
    rating: 4.4,
    ratingCount: 1620,
    description:
      'After a plane crash, thirteen-year-old Brian is alone in the Canadian wilderness with nothing but the hatchet his mother gave him. Day by day he learns to make fire, find food, and survive the cold, the hunger, and his own fear. As the seasons test him, Brian discovers a toughness and patience he never knew he had. A gripping classic about survival, resilience, and growing up — you’ll never look at a hatchet the same way again.',
    bennyTake: 'The original survival story. You will never look at a hatchet the same way again.',
    bennyReason: 'Pure survival tension — for readers who love a brave hero against the odds.',
    themes: ['Survival', 'Resilience', 'Nature', 'Growing up'],
    readersAtSchool: 14,
    awards: ['Newbery Honor'],
    similar: ['wild-robot', 'refugee', 'holes'],
    reviews: [
      review(
        'jayden',
        5,
        'Mar 8, 2026',
        'I could not stop reading. The part with the moose!! So intense.',
        { verified: true, helpful: 27 },
      ),
      review(
        'liam',
        4,
        'Jan 29, 2026',
        'A little older-feeling but if you like survival it’s a must.',
        { helpful: 13 },
      ),
    ],
  },
  {
    id: 'harry-potter',
    isbn: '9780590353427',
    title: 'Harry Potter and the Sorcerer’s Stone',
    author: 'J. K. Rowling',
    series: { name: 'Harry Potter', number: 1 },
    color: '#6D28D9',
    genres: ['Fantasy', 'Adventure'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'scholastic', format: 'print', action: 'On the list' },
      { partner: 'sora', format: 'audiobook', action: 'Borrow' },
      { partner: 'libby', format: 'audiobook', action: 'Borrow' },
    ],
    lexile: '880L',
    ageRange: '9–12',
    pageCount: 309,
    audioLength: '8h 18m',
    published: 1997,
    publisher: 'Scholastic',
    language: 'English',
    rating: 4.8,
    ratingCount: 5600,
    description:
      'On his eleventh birthday, Harry Potter learns he is a wizard. Whisked away to Hogwarts School of Witchcraft and Wizardry, he discovers friendship, magic, and a world he never knew existed. With Ron and Hermione at his side, Harry braves a three-headed dog, a deadly chess match, and the dark secret hidden beneath the castle. The beginning of a beloved series, it’s a spellbinding adventure about belonging, bravery, and the magic of finding where you’re meant to be.',
    bennyTake:
      'The one that started it all. Cozy, magical, and the start of a journey you won’t want to end.',
    bennyReason: 'Magic school adventure if Amari left you wanting more.',
    themes: ['Friendship', 'Courage', 'Belonging', 'Good vs. evil'],
    readersAtSchool: 44,
    awards: ['Modern classic'],
    similar: ['amari', 'lightning-thief', 'wrinkle'],
    reviews: [
      review(
        'liam',
        5,
        'Feb 12, 2026',
        'My whole family has read these. Reading it for the first time felt like getting my own Hogwarts letter.',
        { helpful: 42 },
      ),
      review(
        'noah',
        4,
        'Jan 9, 2026',
        'Longer than I usually read but I’m so glad I did. On to book 2.',
        { verified: true, helpful: 19 },
      ),
    ],
  },
  {
    id: 'refugee',
    isbn: '9780545880831',
    title: 'Refugee',
    author: 'Alan Gratz',
    color: '#1E40AF',
    genres: ['Historical', 'Survival'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'scholastic', format: 'print', action: 'On the list' },
      { partner: 'sora', format: 'ebook', action: 'Borrow' },
    ],
    lexile: '800L',
    ageRange: '9–12',
    pageCount: 352,
    audioLength: '8h 32m',
    published: 2017,
    publisher: 'Scholastic Press',
    language: 'English',
    rating: 4.8,
    ratingCount: 1430,
    description:
      'Three children. Three different journeys. Josef flees Nazi Germany in 1938. Isabel escapes Cuba in 1994. Mahmoud leaves Syria in 2015. Their separate stories — across time — weave together in a breathless, powerful novel.',
    bennyTake:
      'Important, fast, and impossible to forget. The way the three stories connect at the end is masterful.',
    bennyReason: 'Three brave kids, three escapes — gripping from the first page.',
    themes: ['Courage', 'Family', 'Hope', 'History'],
    contentNote: 'Wartime danger and loss; powerful for thoughtful readers.',
    readersAtSchool: 16,
    awards: ['Best-seller'],
    similar: ['front-desk', 'esperanza', 'hatchet'],
    reviews: [
      review(
        'diego',
        5,
        'Mar 19, 2026',
        'The three stories all connect at the end and I gasped out loud. So good.',
        { verified: true, helpful: 31 },
      ),
      review(
        'reyes',
        5,
        'Jan 14, 2026',
        'A staple of our class library. Sparks the best conversations about history and empathy.',
        { verified: true, helpful: 24 },
      ),
    ],
  },
  {
    id: 'out-of-my-mind',
    isbn: '9781416971719',
    title: 'Out of My Mind',
    author: 'Sharon M. Draper',
    color: '#BE185D',
    genres: ['Realistic Fiction'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'audiobook', action: 'Borrow' },
      { partner: 'libby', format: 'audiobook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '700L',
    ageRange: '9–12',
    pageCount: 295,
    audioLength: '6h 11m',
    published: 2010,
    publisher: 'Atheneum',
    language: 'English',
    rating: 4.7,
    ratingCount: 1280,
    description:
      'Melody is the smartest kid in her whole school — but no one knows it. She has cerebral palsy, can’t walk or talk, and has never spoken a word. Until she finds a way to be heard, and nothing will ever be the same.',
    bennyTake: 'A book that changes how you see people. Melody’s voice is unforgettable.',
    bennyReason: 'An unforgettable narrator who proves everyone has a story.',
    themes: ['Disability', 'Determination', 'Friendship', 'Being heard'],
    readersAtSchool: 20,
    awards: ['Best-seller'],
    similar: ['el-deafo', 'front-desk', 'wonder'],
    reviews: [
      review(
        'sofia',
        5,
        'Mar 30, 2026',
        'Melody is a genius and the ending made me so mad and so happy. Everyone should read this.',
        { verified: true, helpful: 28 },
      ),
      review(
        'emma',
        5,
        'Feb 3, 2026',
        'It changed how I think about kids who are different from me.',
        { helpful: 20 },
      ),
    ],
  },
  {
    id: 'wonder',
    isbn: '9780375869020',
    title: 'Wonder',
    author: 'R. J. Palacio',
    color: '#7C3AED',
    genres: ['Realistic Fiction'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'ebook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '790L',
    ageRange: '8–12',
    pageCount: 315,
    audioLength: '8h 6m',
    published: 2012,
    publisher: 'Knopf',
    language: 'English',
    rating: 4.8,
    ratingCount: 4120,
    description:
      'August Pullman was born with a facial difference that kept him out of mainstream school — until now. Starting fifth grade at Beecher Prep, Auggie just wants to be treated like an ordinary kid. But his new classmates can’t see past his face, and the year becomes a test of courage, friendship, and what it really means to belong. Told from Auggie’s perspective and the people around him, the story shows how one small act of kindness can ripple outward and change everyone it touches. A story about kindness that became a movement — and a gentle reminder to always choose kind.',
    bennyTake: 'Choose kind. This one will make you a better friend — promise.',
    bennyReason: 'A kindness classic everyone at your school has read.',
    themes: ['Kindness', 'Friendship', 'Acceptance', 'Family'],
    readersAtSchool: 52,
    awards: ['#1 NYT Bestseller'],
    similar: ['out-of-my-mind', 'new-kid', 'front-desk'],
    reviews: [
      review(
        'priya',
        5,
        'Apr 1, 2026',
        '#choosekind. I think about Auggie all the time. Read the parts from everyone’s view.',
        { verified: true, helpful: 38 },
      ),
      review('zoe', 5, 'Feb 25, 2026', 'It made me want to be nicer to new kids.', { helpful: 16 }),
    ],
  },
  {
    id: 'ghost',
    isbn: '9781481450157',
    title: 'Ghost',
    author: 'Jason Reynolds',
    series: { name: 'Track', number: 1 },
    color: '#0E7490',
    genres: ['Sports', 'Realistic Fiction'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'scholastic', format: 'print', action: 'On the list' },
      { partner: 'sora', format: 'audiobook', action: 'Borrow' },
      { partner: 'libby', format: 'audiobook', action: 'Borrow' },
    ],
    lexile: '730L',
    ageRange: '10–13',
    pageCount: 192,
    audioLength: '4h 8m',
    published: 2016,
    publisher: 'Atheneum',
    language: 'English',
    rating: 4.6,
    ratingCount: 940,
    description:
      'Ghost has been running — from a lot of things — ever since the night his dad changed everything. When a track coach sees him race, Ghost gets a shot at a junior elite team. But to stay on it, he’ll have to outrun his past.',
    bennyTake: 'Fast, funny, and real. Ghost feels like a kid you actually know.',
    bennyReason: 'A sports story with a hero learning to trust the right people.',
    themes: ['Resilience', 'Family', 'Mentorship', 'Second chances'],
    readersAtSchool: 15,
    awards: ['National Book Award Finalist'],
    similar: ['crossover', 'brown-girl', 'new-kid'],
    reviews: [
      review(
        'diego',
        5,
        'Mar 16, 2026',
        'I run track so this was perfect. Ghost is funny and you really want him to make it.',
        { verified: true, helpful: 22 },
      ),
      review('jayden', 4, 'Jan 28, 2026', 'Short and powerful. Read it in two days.', {
        helpful: 12,
      }),
    ],
  },
  {
    id: 'holes',
    isbn: '9780440414803',
    title: 'Holes',
    author: 'Louis Sachar',
    color: '#B45309',
    genres: ['Adventure', 'Mystery'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'ebook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '660L',
    ageRange: '9–12',
    pageCount: 233,
    audioLength: '4h 39m',
    published: 1998,
    publisher: 'Yearling',
    language: 'English',
    rating: 4.6,
    ratingCount: 2240,
    description:
      'Stanley Yelnats is sent to Camp Green Lake, where boys dig holes all day in the blazing sun. There is no lake — but there is a mystery. As Stanley digs, he uncovers a secret that ties his cursed family to the camp’s buried past.',
    bennyTake: 'Everything connects. Stick with it and the ending will blow your mind.',
    bennyReason: 'A clever mystery where every detail pays off.',
    themes: ['Fate', 'Friendship', 'Justice', 'Family'],
    readersAtSchool: 26,
    awards: ['Newbery Medal'],
    similar: ['hatchet', 'lightning-thief', 'refugee'],
    reviews: [
      review(
        'liam',
        5,
        'Feb 18, 2026',
        'The way the past and present connect is so smart. Best ending of any book I’ve read.',
        { verified: true, helpful: 30 },
      ),
      review(
        'sofia',
        4,
        'Jan 11, 2026',
        'Confusing at first but then everything makes sense and it’s amazing.',
        { helpful: 14 },
      ),
    ],
  },
  {
    id: 'giver',
    isbn: '9780544336261',
    title: 'The Giver',
    author: 'Lois Lowry',
    color: '#475569',
    genres: ['Dystopian', 'Sci-Fi'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'ebook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '760L',
    ageRange: '11–13',
    pageCount: 208,
    audioLength: '4h 48m',
    published: 1993,
    publisher: 'HMH Books',
    language: 'English',
    rating: 4.5,
    ratingCount: 3010,
    description:
      'Jonas’s world is perfect. There is no war, no pain, no choices. At twelve, he is chosen for a special role and begins to learn the truth about his community — and the price of a world without color or memory.',
    bennyTake: 'The book that invented the dystopia you love. Quiet, then it knocks you flat.',
    bennyReason: 'A mind-bending what-if for readers ready for a deeper story.',
    themes: ['Freedom', 'Memory', 'Individuality', 'Choice'],
    contentNote: 'Mature themes; best for older middle-grade readers.',
    readersAtSchool: 12,
    awards: ['Newbery Medal'],
    similar: ['wrinkle', 'refugee', 'hatchet'],
    reviews: [
      review(
        'liam',
        5,
        'Mar 2, 2026',
        'When the colors start appearing… whoa. Made me think for days.',
        { verified: true, helpful: 25 },
      ),
      review('jayden', 4, 'Jan 20, 2026', 'A bit slow at first but the ideas are huge.', {
        helpful: 10,
      }),
    ],
  },
  {
    id: 'wrinkle',
    isbn: '9780312367541',
    title: 'A Wrinkle in Time',
    author: 'Madeleine L’Engle',
    color: '#4338CA',
    genres: ['Sci-Fi', 'Fantasy'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'ebook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '740L',
    ageRange: '10–12',
    pageCount: 256,
    audioLength: '6h 27m',
    published: 1962,
    publisher: 'Square Fish',
    language: 'English',
    rating: 4.3,
    ratingCount: 2680,
    description:
      'Meg Murry’s father has vanished while doing secret work. With her brilliant little brother and a friend, she travels through a wrinkle in time — a tesseract — to a dark planet to find him, guided by three mysterious beings.',
    bennyTake:
      'Strange, beautiful, and brave. Meg is a hero for anyone who’s ever felt like a misfit.',
    bennyReason: 'A classic space adventure with a fierce, misfit heroine.',
    themes: ['Family', 'Love', 'Individuality', 'Good vs. evil'],
    readersAtSchool: 13,
    awards: ['Newbery Medal'],
    similar: ['giver', 'lightning-thief', 'amari'],
    reviews: [
      review(
        'priya',
        4,
        'Feb 22, 2026',
        'Weird in a cool way. The tesseract idea is awesome. Meg is great.',
        { helpful: 13 },
      ),
      review('noah', 4, 'Jan 6, 2026', 'Older book so the words are harder but worth it.', {
        verified: true,
        helpful: 9,
      }),
    ],
  },
  {
    id: 'esperanza',
    isbn: '9780439120425',
    title: 'Esperanza Rising',
    author: 'Pam Muñoz Ryan',
    color: '#B91C1C',
    genres: ['Historical', 'Realistic Fiction'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'scholastic', format: 'print', action: 'On the list' },
      { partner: 'sora', format: 'ebook', action: 'Borrow' },
    ],
    lexile: '750L',
    ageRange: '9–12',
    pageCount: 304,
    audioLength: '5h 5m',
    published: 2000,
    publisher: 'Scholastic Press',
    language: 'English',
    rating: 4.5,
    ratingCount: 980,
    description:
      'Esperanza lived a life of privilege on her family’s ranch in Mexico — until tragedy forces her and her mother to flee to a farm-labor camp in California during the Great Depression. There, Esperanza must learn to work, to hope, and to rise.',
    bennyTake: 'A sweeping, emotional story of starting over. Esperanza’s strength is inspiring.',
    bennyReason: 'A moving story of courage and starting over.',
    themes: ['Resilience', 'Family', 'Class', 'Hope'],
    readersAtSchool: 11,
    awards: ['Pura Belpré Award'],
    similar: ['front-desk', 'refugee', 'one-ivan'],
    reviews: [
      review(
        'sofia',
        5,
        'Mar 9, 2026',
        'I learned so much about history and I cried a lot. Esperanza is so strong.',
        { verified: true, helpful: 18 },
      ),
      review('emma', 4, 'Jan 24, 2026', 'Sad but beautiful. The roses part is my favorite.', {
        helpful: 11,
      }),
    ],
  },
  {
    id: 'brown-girl',
    isbn: '9780147515827',
    title: 'Brown Girl Dreaming',
    author: 'Jacqueline Woodson',
    color: '#9333EA',
    genres: ['Memoir', 'Novel in Verse', 'Historical'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'audiobook', action: 'Borrow' },
      { partner: 'libby', format: 'audiobook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '990L',
    ageRange: '10–13',
    pageCount: 337,
    audioLength: '4h 11m',
    published: 2014,
    publisher: 'Nancy Paulsen Books',
    language: 'English',
    rating: 4.5,
    ratingCount: 690,
    description:
      'In vivid poems, Jacqueline Woodson shares what it was like to grow up as an African American in the 1960s and 1970s, living with the remnants of Jim Crow and her growing awareness of the Civil Rights movement — and discovering her own voice as a writer.',
    bennyTake: 'Poetry that feels like memory. Gentle, powerful, and beautifully read on audio.',
    bennyReason: 'A memoir in verse — try it on audiobook for the full magic.',
    themes: ['Family', 'Identity', 'Writing', 'History'],
    readersAtSchool: 9,
    awards: ['National Book Award'],
    similar: ['crossover', 'ghost', 'esperanza'],
    reviews: [
      review(
        'patel',
        5,
        'Feb 16, 2026',
        'A treasure. The audiobook, read by the author, is the perfect way to experience it.',
        { verified: true, helpful: 21 },
      ),
      review(
        'liam',
        4,
        'Jan 5, 2026',
        'I don’t usually like poems but these tell a real story. Really good.',
        { helpful: 8 },
      ),
    ],
  },
  {
    id: 'winn-dixie',
    isbn: '9780763680862',
    title: 'Because of Winn-Dixie',
    author: 'Kate DiCamillo',
    color: '#CA8A04',
    genres: ['Realistic Fiction', 'Animals'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'ebook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '610L',
    ageRange: '8–11',
    pageCount: 182,
    audioLength: '2h 24m',
    published: 2000,
    publisher: 'Candlewick',
    language: 'English',
    rating: 4.4,
    ratingCount: 1110,
    description:
      'One summer, ten-year-old Opal adopts a scruffy stray dog she names Winn-Dixie. Because of Winn-Dixie, Opal makes friends all over her sleepy new town — a librarian, a pet-shop worker, and a woman folks call a witch. Little by little, the dog helps her gather a family of misfits and find the courage to ask her father about the mother who left. Warm as a summer evening, it’s a gentle, big-hearted story about friendship, belonging, and letting go of old sorrows.',
    bennyTake: 'Warm as a summer evening. A gentle hug of a book about friendship and belonging.',
    bennyReason: 'A gentle, heartwarming dog story.',
    themes: ['Friendship', 'Belonging', 'Loss', 'Community'],
    readersAtSchool: 17,
    awards: ['Newbery Honor'],
    similar: ['one-ivan', 'wild-robot', 'wonder'],
    reviews: [
      review(
        'zoe',
        5,
        'Mar 4, 2026',
        'I love Winn-Dixie the dog SO much. This book made me happy.',
        { verified: true, helpful: 15 },
      ),
      review('ava', 4, 'Jan 17, 2026', 'A nice cozy book. Good for animal lovers.', { helpful: 7 }),
    ],
  },
  {
    id: 'matilda',
    isbn: '9780142410370',
    title: 'Matilda',
    author: 'Roald Dahl',
    color: '#7C3AED',
    genres: ['Humor', 'Fantasy'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'ebook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '840L',
    ageRange: '8–12',
    pageCount: 240,
    audioLength: '4h 18m',
    published: 1988,
    publisher: 'Puffin',
    language: 'English',
    rating: 4.8,
    ratingCount: 2104,
    description:
      'Matilda Wormwood is a genius — reading novels at four and quietly outsmarting the grown-ups who underestimate her. When the monstrous headmistress Miss Trunchbull turns school into a nightmare, Matilda discovers a remarkable power of her own and decides enough is enough. With her kind teacher Miss Honey in her corner, Matilda hatches a plan to set things right — for herself and for everyone the Trunchbull has ever bullied. Sharp, funny, and deeply satisfying, it’s a celebration of clever kids, well-loved books, and standing up to grown-ups who should know better.',
    bennyTake:
      "If you love a clever underdog, Matilda is the queen of them. Funny, a little bit magical, and SO satisfying when the bullies finally get what's coming.",
    themes: ['Cleverness', 'Courage', 'Books & reading', 'Justice'],
    readersAtSchool: 33,
    similar: ['harry-potter', 'wonder', 'one-ivan'],
    reviews: [
      review(
        'priya',
        5,
        'Feb 20, 2026',
        'Matilda is the smartest kid ever and I want to be just like her. The Trunchbull is SO scary!',
        { verified: true, helpful: 14 },
      ),
      review('liam', 5, 'Jan 9, 2026', 'Roald Dahl is hilarious. Read it in two nights.', {
        helpful: 6,
      }),
    ],
  },
  {
    id: 'charlottes-web',
    isbn: '9780064410939',
    title: "Charlotte's Web",
    author: 'E. B. White',
    color: '#DC2626',
    genres: ['Animals', 'Fantasy'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'audiobook', action: 'Borrow' },
      { partner: 'libby', format: 'audiobook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '680L',
    ageRange: '8–11',
    pageCount: 184,
    audioLength: '3h 34m',
    published: 1952,
    publisher: 'HarperCollins',
    language: 'English',
    rating: 4.7,
    ratingCount: 1876,
    description:
      'When a runt piglet named Wilbur is saved from the axe, he finds an unlikely friend in Charlotte, a wise grey barn spider. As the seasons turn, Charlotte spins a daring plan to save Wilbur from the smokehouse — weaving words into her web that leave the whole town amazed. Their friendship blossoms among the geese, the sheep, and a scheming rat named Templeton, in the warm and busy world of the Zuckerman barn. Tender, funny, and wise, it’s one of the most beloved stories about friendship, loyalty, and the bittersweet turning of the seasons ever written.',
    bennyTake:
      'Grab a tissue. This one is gentle, funny, and one of the most beautiful books about friendship ever written. Some pig, indeed.',
    themes: ['Friendship', 'Loyalty', 'Life & loss', 'Farm life'],
    readersAtSchool: 41,
    similar: ['winn-dixie', 'one-ivan', 'wild-robot'],
    reviews: [
      review(
        'emma',
        5,
        'Feb 2, 2026',
        'I cried at the end but in a good way. Charlotte is the best friend ever.',
        {
          verified: true,
          helpful: 18,
        },
      ),
      review(
        'diego',
        4,
        'Dec 12, 2025',
        'A classic for a reason. The words Charlotte spins are so clever.',
        {
          helpful: 5,
        },
      ),
    ],
  },
  {
    id: 'fish-in-a-tree',
    isbn: '9780399162596',
    title: 'Fish in a Tree',
    author: 'Lynda Mullaly Hunt',
    color: '#0284C7',
    genres: ['Realistic Fiction'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'ebook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '550L',
    ageRange: '10–13',
    pageCount: 288,
    audioLength: '5h 52m',
    published: 2015,
    publisher: 'Nancy Paulsen Books',
    language: 'English',
    rating: 4.7,
    ratingCount: 1320,
    description:
      "Ally has spent years hiding the fact that she can't read, covering with clever distractions and trouble. But when a new teacher sees the bright, creative kid behind the act, Ally starts to believe that the way her brain works might just be her greatest strength. With the help of two unlikely friends, she begins to trust herself, stand up to a bully, and discover talents she never knew she had. A warm, hopeful story about dyslexia, friendship, and learning that everyone is smart in their own way — because a fish isn't dumb for not being able to climb a tree.",
    bennyTake:
      "Ally's story is for anyone who's ever felt like the odd one out. Warm, real, and a big reminder that everybody's brain works in its own brilliant way.",
    themes: ['Dyslexia', 'Friendship', 'Self-belief', 'Kindness'],
    readersAtSchool: 27,
    similar: ['wonder', 'out-of-my-mind', 'front-desk'],
    reviews: [
      review(
        'reyes',
        5,
        'Jan 28, 2026',
        'I read this aloud to my class and we had the best conversations about it. Highly recommend.',
        {
          verified: true,
          helpful: 21,
        },
      ),
      review(
        'sofia',
        5,
        'Jan 5, 2026',
        'Ally is so smart even though school is hard for her. Made me feel seen.',
        {
          helpful: 9,
        },
      ),
    ],
  },
  {
    id: 'keeper-lost-cities',
    isbn: '9781442445932',
    title: 'Keeper of the Lost Cities',
    author: 'Shannon Messenger',
    color: '#2563EB',
    genres: ['Fantasy', 'Adventure', 'Mystery'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'ebook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '730L',
    ageRange: '10–14',
    pageCount: 512,
    audioLength: '12h 48m',
    published: 2012,
    publisher: 'Aladdin',
    language: 'English',
    rating: 4.8,
    ratingCount: 2510,
    description:
      'Twelve-year-old Sophie has hidden a secret her whole life: she can hear the thoughts of everyone around her. When a mysterious boy reveals that she belongs in a hidden world of elves, Sophie must leave everything behind to learn who she truly is — and why someone wants her gone. At a dazzling academy for elven magic she makes fiercely loyal friends, uncovers buried memories, and discovers she may hold the key to a danger no one saw coming. Packed with secrets, powers, and cliff-hangers, it’s the first book in a sprawling series that readers fall headfirst into.',
    bennyTake:
      'If you blew through Harry Potter and Percy Jackson, this is your next obsession. Hidden worlds, secret powers, and a series long enough to live inside.',
    themes: ['Belonging', 'Friendship', 'Identity', 'Mystery'],
    readersAtSchool: 36,
    similar: ['harry-potter', 'lightning-thief', 'amari'],
    reviews: [
      review(
        'jayden',
        5,
        'Feb 14, 2026',
        'Book one and I am already on book four. SO good. Sophie is awesome.',
        {
          verified: true,
          helpful: 17,
        },
      ),
      review(
        'zoe',
        5,
        'Jan 22, 2026',
        'I love the elf world and all the powers. Cannot stop reading.',
        {
          helpful: 8,
        },
      ),
    ],
  },
  {
    id: 'despereaux',
    isbn: '9780763625290',
    title: 'The Tale of Despereaux',
    author: 'Kate DiCamillo',
    color: '#CA8A04',
    genres: ['Fantasy', 'Adventure', 'Animals'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'audiobook', action: 'Borrow' },
      { partner: 'libby', format: 'audiobook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '670L',
    ageRange: '8–12',
    pageCount: 272,
    audioLength: '3h 45m',
    published: 2003,
    publisher: 'Candlewick',
    language: 'English',
    rating: 4.6,
    ratingCount: 1487,
    description:
      'Despereaux is a tiny mouse with enormous ears and an even bigger heart, who dares to love a human princess and to be brave. Banished to the dungeon for breaking the ancient rules of mouse-kind, he must find the courage to rescue the princess he adores. With a vengeful rat, a half-deaf servant girl, and a spool of red thread, this is a fairy tale about light, forgiveness, and the power of a good story. Told by a narrator who speaks straight to you, it’s a Newbery-winning tale about how the smallest, most unlikely hero can change everything.',
    bennyTake:
      'A storybook in the very best way — a brave little hero, a touch of darkness, and a narrator who talks right to you. Newbery gold for a reason.',
    themes: ['Courage', 'Forgiveness', 'Love', 'Hope'],
    readersAtSchool: 24,
    awards: ['Newbery Medal'],
    similar: ['winn-dixie', 'one-ivan', 'wild-robot'],
    reviews: [
      review(
        'ava',
        5,
        'Feb 8, 2026',
        'Despereaux is the bravest little mouse. I loved how the narrator talks to you.',
        {
          helpful: 10,
        },
      ),
      review(
        'noah',
        4,
        'Dec 30, 2025',
        'A little sad in the middle but a great ending. Beautiful writing.',
        {
          helpful: 4,
        },
      ),
    ],
  },
  {
    id: 'last-kids-earth',
    isbn: '9780670016617',
    title: 'The Last Kids on Earth',
    author: 'Max Brallier',
    series: { name: 'The Last Kids on Earth', number: 1 },
    color: '#15803D',
    genres: ['Humor', 'Adventure', 'Survival'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'ebook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '730L',
    ageRange: '8–12',
    pageCount: 240,
    audioLength: '3h 20m',
    published: 2015,
    publisher: 'Viking',
    language: 'English',
    rating: 4.7,
    ratingCount: 1654,
    description:
      "Jack Sullivan is living every kid's wildest dream: the zombie apocalypse has hit his town, and he's set up base in a tricked-out treehouse with his friends. Armed with a katana and a monster-fighting to-do list, Jack is determined to be the hero of his own video-game-worthy adventure. But when bigger, weirder monsters start crawling out of a glowing portal, Jack and his crew have to team up to survive. Stuffed with comic-style artwork, nonstop jokes, and gross-out monster battles, it's the perfect pick for readers who swear they don't like to read.",
    bennyTake:
      "Zombies, monsters, gadgets, and nonstop jokes — plus pictures on almost every page. If you think you don't like reading, this one will change your mind.",
    themes: ['Friendship', 'Bravery', 'Survival', 'Humor'],
    readersAtSchool: 39,
    similar: ['dog-man', 'hatchet', 'amulet'],
    reviews: [
      review(
        'diego',
        5,
        'Feb 16, 2026',
        'Zombies AND monsters AND jokes?? Best book. The pictures are awesome.',
        {
          verified: true,
          helpful: 13,
        },
      ),
      review(
        'liam',
        4,
        'Jan 2, 2026',
        'Super funny and fast. My whole friend group is reading the series now.',
        {
          helpful: 6,
        },
      ),
    ],
  },
  {
    id: 'pax',
    isbn: '9780062377012',
    title: 'Pax',
    author: 'Sara Pennypacker',
    color: '#EA580C',
    genres: ['Animals', 'Adventure', 'Realistic Fiction'],
    formats: ['print', 'ebook', 'audiobook'],
    availability: [
      { partner: 'sora', format: 'audiobook', action: 'Borrow' },
      { partner: 'libby', format: 'audiobook', action: 'Borrow' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: '760L',
    ageRange: '10–13',
    pageCount: 304,
    audioLength: '4h 58m',
    published: 2016,
    publisher: 'Balzer + Bray',
    language: 'English',
    rating: 4.6,
    ratingCount: 1398,
    description:
      "When Peter is forced to give up his pet fox, Pax, he can't shake the feeling that he has made a terrible mistake. As war creeps closer, boy and fox each set out on a dangerous journey to find their way back to each other — told in two unforgettable voices. Peter runs away from his grandfather's house to find his friend, while Pax learns to survive in the wild and waits for the boy he loves. Beautiful and heartbreaking, it's a modern classic about loyalty, the cost of war, and the bonds that refuse to break.",
    bennyTake:
      'A boy and his fox, and a story that will wreck you in the best way. Beautiful, brave, and impossible to put down. Have the tissues ready.',
    themes: ['Friendship', 'Loyalty', 'War & peace', 'Growing up'],
    readersAtSchool: 22,
    similar: ['wild-robot', 'one-ivan', 'hatchet'],
    reviews: [
      review(
        'sofia',
        5,
        'Feb 11, 2026',
        'I did not stop crying. Pax and Peter belong together. So so good.',
        {
          verified: true,
          helpful: 16,
        },
      ),
      review(
        'maya',
        5,
        'Jan 19, 2026',
        'The chapters from the fox’s point of view are my favorite. Loved it.',
        {
          helpful: 7,
        },
      ),
    ],
  },
  {
    id: 'natgeo-kids',
    isbn: null,
    title: 'Nat Geo Kids',
    author: 'National Geographic',
    color: '#FFC72C',
    genres: ['Nonfiction', 'Animals'],
    formats: ['magazine', 'ebook'],
    availability: [{ partner: 'comicsplus', format: 'magazine', action: 'Read now' }],
    lexile: '—',
    ageRange: '7–12',
    pageCount: 36,
    issue: 'May 2026 · Sharks!',
    published: 2026,
    publisher: 'National Geographic',
    language: 'English',
    rating: 4.7,
    ratingCount: 410,
    description:
      'Wild animals, cool science, jaw-dropping photos, and laugh-out-loud jokes. This month: everything you ever wanted to know about sharks — plus weird-but-true facts and a pull-out poster.',
    bennyTake:
      'Perfect for fact-lovers and anyone who reads in short bursts. New issues drop monthly on Comics Plus!',
    bennyReason: 'Yes — magazines count! Bite-size reading you can finish in one sitting.',
    themes: ['Animals', 'Science', 'Nature'],
    readersAtSchool: 33,
    awards: ['New this month'],
    similar: ['one-ivan', 'wild-robot', 'dog-man'],
    reviews: [
      review(
        'ava',
        5,
        'May 2, 2026',
        'The shark facts are SO cool. I read the whole thing at recess. Magazines count for my streak!',
        { verified: true, helpful: 19 },
      ),
      review(
        'noah',
        4,
        'Apr 20, 2026',
        'I read a new issue every month on Comics Plus. Great for quick reading.',
        { helpful: 11 },
      ),
    ],
  },

  // ── More comics & graphic novels (Comics Plus) ──────────────────────────────
  {
    id: 'amulet',
    isbn: '9780439846806',
    title: 'Amulet: The Stonekeeper',
    author: 'Kazu Kibuishi',
    series: { name: 'Amulet', number: 1 },
    color: '#5B21B6',
    genres: ['Graphic Novel', 'Fantasy', 'Adventure'],
    formats: ['print', 'ebook'],
    availability: [
      { partner: 'comicsplus', format: 'ebook', action: 'Read now' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: 'GN390L',
    ageRange: '8–12',
    pageCount: 192,
    published: 2008,
    publisher: 'Graphix',
    language: 'English',
    rating: 4.7,
    ratingCount: 1320,
    description:
      'After a family tragedy, Emily and Navin move to their great-grandfather’s old house — and discover a glowing amulet that pulls them into a strange world of robots, talking animals, and a looming elf king. The first book in a sweeping graphic-novel epic.',
    bennyTake:
      'Cinematic, fast, and a little spooky in the best way. Once you start the series it’s very hard to stop.',
    bennyReason: 'Epic graphic-novel fantasy — perfect after Dog Man, with a bigger adventure.',
    themes: ['Family', 'Courage', 'Adventure'],
    contentNote: 'Some fantasy peril and a sad opening; great for graphic-novel fans.',
    readersAtSchool: 36,
    awards: ['Series favorite'],
    similar: ['dog-man', 'new-kid', 'cat-kid'],
    reviews: [
      review(
        'diego',
        5,
        'May 1, 2026',
        'I read the first 4 in a weekend on Comics Plus. The art is unreal. Miskit is the best.',
        { verified: true, helpful: 34 },
      ),
      review(
        'liam',
        5,
        'Apr 12, 2026',
        'Way more epic than I expected from a graphic novel. The world is so cool.',
        {
          helpful: 17,
        },
      ),
    ],
  },
  {
    id: 'cat-kid',
    isbn: '9781338712766',
    title: 'Cat Kid Comic Club',
    author: 'Dav Pilkey',
    series: { name: 'Cat Kid Comic Club', number: 1 },
    color: '#16A97A',
    genres: ['Graphic Novel', 'Humor'],
    formats: ['print', 'ebook'],
    availability: [
      { partner: 'comicsplus', format: 'ebook', action: 'Read now' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: 'GN360L',
    ageRange: '7–10',
    pageCount: 176,
    published: 2020,
    publisher: 'Graphix',
    language: 'English',
    rating: 4.6,
    ratingCount: 1480,
    description:
      'From the creator of Dog Man! Li’l Petey, Flippy, and Molly teach 21 rambunctious baby frogs how to make their own comics — with hilarious results and a real how-to-make-comics spirit you can try yourself.',
    bennyTake:
      'Silly and secretly inspiring — kids finish this one and immediately want to draw their own comic. Grab some paper!',
    bennyReason: 'From the Dog Man creator — and it might just turn you into a comic-maker.',
    themes: ['Creativity', 'Friendship', 'Making comics'],
    contentNote: 'Goofy, gentle humor; encourages drawing and writing.',
    readersAtSchool: 44,
    awards: ['Lincoln Top 5 this month'],
    similar: ['dog-man', 'investigators', 'smile'],
    reviews: [
      review(
        'ava',
        5,
        'May 4, 2026',
        'After this I made my OWN comic about my cat. The frogs are so funny.',
        {
          verified: true,
          helpful: 28,
        },
      ),
      review(
        'zoe',
        5,
        'Apr 9, 2026',
        'I love Dog Man so I loved this too. Read it on Comics Plus.',
        { helpful: 12 },
      ),
    ],
  },
  {
    id: 'investigators',
    isbn: '9781250219954',
    title: 'InvestiGators',
    author: 'John Patrick Green',
    series: { name: 'InvestiGators', number: 1 },
    color: '#2563EB',
    genres: ['Graphic Novel', 'Humor', 'Mystery'],
    formats: ['print', 'ebook'],
    availability: [
      { partner: 'comicsplus', format: 'ebook', action: 'Read now' },
      { partner: 'library', format: 'print', action: 'Find it' },
    ],
    lexile: 'GN310L',
    ageRange: '7–10',
    pageCount: 208,
    published: 2020,
    publisher: 'First Second',
    language: 'English',
    rating: 4.6,
    ratingCount: 1105,
    description:
      'Mango and Brash are two crime-fighting alligators who travel through the sewers to investigate the biggest mysteries around. Packed with puns, gadgets, and goofy action — a giggle on every page.',
    bennyTake:
      'If you like your mysteries with a side of terrible (wonderful) puns, this is your series.',
    bennyReason: 'A pun-packed comic mystery — pure giggles, very hard to put down.',
    themes: ['Friendship', 'Mystery', 'Teamwork'],
    contentNote: 'Cartoon action and nonstop puns.',
    readersAtSchool: 30,
    awards: ['Reader favorite'],
    similar: ['dog-man', 'cat-kid', 'amulet'],
    reviews: [
      review(
        'jayden',
        5,
        'Apr 28, 2026',
        'The puns are SO bad and that’s why it’s the best. I read three in a row.',
        {
          verified: true,
          helpful: 21,
        },
      ),
      review('ava', 4, 'Apr 2, 2026', 'Funny and a little mystery too. Mango is my favorite.', {
        helpful: 9,
      }),
    ],
  },

  // ── Scholastic classroom magazines ──────────────────────────────────────────
  {
    id: 'scholastic-news',
    isbn: null,
    title: 'Scholastic News',
    author: 'Scholastic',
    color: '#E1141C',
    genres: ['Magazine', 'Current Events'],
    formats: ['magazine', 'ebook'],
    availability: [{ partner: 'scholastic', format: 'magazine', action: 'Read issue' }],
    lexile: 'Grade 4',
    ageRange: '8–10',
    pageCount: 8,
    issue: 'May 2026 · Save the Bees!',
    cadence: 'Weekly',
    published: 2026,
    publisher: 'Scholastic',
    language: 'English',
    rating: 4.6,
    ratingCount: 214,
    description:
      'The news, made for your grade. This issue: why bees matter, a kid reporter on a real beekeeping farm, an infographic on the pollination cycle, and a debate — should cities plant more wildflowers?',
    bennyTake:
      'Short, true, and right at your reading level. A new issue every week — perfect for building a reading streak in 10 minutes.',
    bennyReason: 'Real-world news at your level — a quick win for your streak.',
    themes: ['Science', 'Current Events', 'Nature'],
    readersAtSchool: 47,
    awards: ['New issue this week'],
    similar: ['superscience', 'storyworks', 'natgeo-kids'],
    reviews: [
      review(
        'priya',
        5,
        'May 4, 2026',
        'I read this every Friday in class. The bee issue was so good and I did the debate page with my group.',
        { verified: true, helpful: 16 },
      ),
      review(
        'reyes',
        5,
        'May 1, 2026',
        'A weekly staple for us. Leveled, current, and the skills sheets are gold for close reading.',
        { verified: true, helpful: 23 },
      ),
    ],
  },
  {
    id: 'storyworks',
    isbn: null,
    title: 'Storyworks',
    author: 'Scholastic',
    color: '#7C3AED',
    genres: ['Magazine', 'Realistic Fiction'],
    formats: ['magazine', 'ebook'],
    availability: [{ partner: 'scholastic', format: 'magazine', action: 'Read issue' }],
    lexile: 'Grades 3–5',
    ageRange: '8–11',
    pageCount: 24,
    issue: 'May 2026 · The Mystery at Cabin 9',
    cadence: 'Monthly',
    published: 2026,
    publisher: 'Scholastic',
    language: 'English',
    rating: 4.7,
    ratingCount: 188,
    description:
      'Stories that pull you in. This issue: a spooky summer-camp mystery, a paired nonfiction article about real survival, a play you can read with friends, and a poem about thunderstorms.',
    bennyTake:
      'My favorite for story-lovers — fiction, nonfiction, a play, and a poem in one issue. Try reading the play out loud with a friend!',
    bennyReason: 'A whole mix of stories in one issue — fiction, a play, and a poem.',
    themes: ['Mystery', 'Writing', 'Friendship'],
    readersAtSchool: 31,
    awards: ['Reader favorite'],
    similar: ['scholastic-news', 'scope', 'natgeo-kids'],
    reviews: [
      review(
        'emma',
        5,
        'May 6, 2026',
        'The camp mystery was SO good. We read the play out loud and I got to be the detective.',
        { verified: true, helpful: 14 },
      ),
      review(
        'zoe',
        4,
        'Apr 22, 2026',
        'I like that there are different kinds of stories. The poem part is short and nice.',
        { helpful: 8 },
      ),
    ],
  },
  {
    id: 'superscience',
    isbn: null,
    title: 'SuperScience',
    author: 'Scholastic',
    color: '#2563EB',
    genres: ['Magazine', 'Science'],
    formats: ['magazine', 'ebook'],
    availability: [{ partner: 'scholastic', format: 'magazine', action: 'Read issue' }],
    lexile: 'Grades 3–6',
    ageRange: '8–12',
    pageCount: 16,
    issue: 'May 2026 · Inside a Volcano',
    cadence: 'Monthly',
    published: 2026,
    publisher: 'Scholastic',
    language: 'English',
    rating: 4.7,
    ratingCount: 165,
    description:
      'Science you can see. This issue goes inside a real volcano with a hands-on eruption experiment you can do at home, jaw-dropping lava photos, and the story of scientists who predict eruptions.',
    bennyTake:
      'For the kid who asks "but HOW?" about everything. The try-it-yourself experiments are the best part.',
    bennyReason: 'Hands-on science with experiments you can actually try.',
    themes: ['Science', 'Nature', 'Discovery'],
    readersAtSchool: 28,
    awards: ['Hands-on pick'],
    similar: ['scholastic-news', 'natgeo-kids', 'dynamath'],
    reviews: [
      review(
        'diego',
        5,
        'May 3, 2026',
        'I did the volcano experiment with baking soda and it ERUPTED everywhere. Best magazine.',
        { verified: true, helpful: 19 },
      ),
      review('noah', 5, 'Apr 18, 2026', 'The lava photos are insane. I read it twice.', {
        helpful: 10,
      }),
    ],
  },
  {
    id: 'dynamath',
    isbn: null,
    title: 'DynaMath',
    author: 'Scholastic',
    color: '#F0A024',
    genres: ['Magazine', 'Nonfiction'],
    formats: ['magazine', 'ebook'],
    availability: [{ partner: 'scholastic', format: 'magazine', action: 'Read issue' }],
    lexile: 'Grades 3–5',
    ageRange: '8–11',
    pageCount: 16,
    issue: 'May 2026 · The Math of Sports',
    cadence: 'Monthly',
    published: 2026,
    publisher: 'Scholastic',
    language: 'English',
    rating: 4.4,
    ratingCount: 96,
    description:
      'Math that actually matters. This issue uses real sports stats to explore averages, angles in a basketball shot, and how to read a stadium-sized infographic — plus a number puzzle to crack.',
    bennyTake:
      'Proof that math is everywhere — even in your favorite sport. The puzzles are sneaky-fun.',
    bennyReason: 'Real sports stats turned into math you’ll actually want to do.',
    themes: ['Math', 'Sports', 'Puzzles'],
    readersAtSchool: 22,
    awards: ['Puzzle pick'],
    similar: ['superscience', 'scholastic-news', 'crossover'],
    reviews: [
      review(
        'jayden',
        4,
        'May 5, 2026',
        'I don’t love math but the basketball angles part was actually cool.',
        { helpful: 7 },
      ),
      review('ava', 5, 'Apr 15, 2026', 'The number puzzle took me forever but I got it!! ', {
        verified: true,
        helpful: 9,
      }),
    ],
  },
  {
    id: 'scope',
    isbn: null,
    title: 'Scholastic Scope',
    author: 'Scholastic',
    color: '#0E7490',
    genres: ['Magazine', 'Realistic Fiction'],
    formats: ['magazine', 'ebook'],
    availability: [{ partner: 'scholastic', format: 'magazine', action: 'Read issue' }],
    lexile: 'Grades 6–8',
    ageRange: '11–14',
    pageCount: 24,
    issue: 'May 2026 · Survival Stories',
    cadence: 'Monthly',
    published: 2026,
    publisher: 'Scholastic',
    language: 'English',
    rating: 4.6,
    ratingCount: 132,
    description:
      'Language arts for older readers. This issue pairs a gripping true survival story with a short story, a debate on screen time, and a grammar challenge — built for grades 6–8.',
    bennyTake:
      'A step up for confident readers — real debates and true stories that spark big conversations.',
    bennyReason: 'A step up for older readers — true survival stories and real debates.',
    themes: ['Survival', 'Debate', 'Writing'],
    readersAtSchool: 12,
    awards: ['For older readers'],
    similar: ['storyworks', 'scholastic-news', 'refugee'],
    reviews: [
      review(
        'liam',
        5,
        'May 2, 2026',
        'The survival story gave me chills. The screen-time debate was a great topic for our class.',
        { verified: true, helpful: 13 },
      ),
    ],
  },
]

// ─── Derive a believable rating distribution when one isn’t hand-authored ──────

function deriveDist(rating, count) {
  const weights = [5, 4, 3, 2, 1].map((s) => 1 / (1 + Math.abs(s - rating) * 1.9) ** 2.4)
  const sum = weights.reduce((a, b) => a + b, 0)
  const dist = weights.map((w) => Math.round((w / sum) * count))
  dist[0] += count - dist.reduce((a, b) => a + b, 0) // reconcile rounding into 5★
  return dist
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const BOOKS = RAW.map((b) => ({
  ...b,
  cover: coverFor(b.isbn),
  ratingDist: b.ratingDist || deriveDist(b.rating, b.ratingCount),
  reviews: b.reviews || [],
}))

const BY_ID = Object.fromEntries(BOOKS.map((b) => [b.id, b]))
export const getBook = (id) => BY_ID[id]
export const getBooks = (ids) => ids.map((id) => BY_ID[id]).filter(Boolean)

// ─── Discover shelves ─────────────────────────────────────────────────────────
// `kind: 'reason'` rows show Benny's per-book "why"; `kind: 'rank'` rows show a
// trending rank + reader count; `partner` rows render a branded header.

export const BENNY_PICKS = [
  'amari',
  'lightning-thief',
  'one-ivan',
  'hatchet',
  'winn-dixie',
  'harry-potter',
]

export const SHELVES = [
  {
    id: 'reyes-picks',
    curator: { name: 'Mr. Reyes', role: 'Grade 4 Teacher', initials: 'MR', color: '#475569' },
    accent: '#7C3AED',
    title: 'Mr. Reyes’s Class Picks',
    books: [
      'wonder',
      'one-ivan',
      'fish-in-a-tree',
      'out-of-my-mind',
      'refugee',
      'winn-dixie',
      'charlottes-web',
    ],
  },
  {
    id: 'comicsplus',
    partner: 'comicsplus',
    title: 'Read now on Comics Plus',
    subtitle: 'Unlimited comics & graphic novels — no holds, no waitlists',
    books: ['dog-man', 'amulet', 'cat-kid', 'new-kid', 'investigators', 'smile', 'el-deafo'],
  },
  {
    id: 'scholastic',
    partner: 'scholastic',
    magazine: true,
    title: 'Scholastic Classroom Magazines',
    subtitle: 'Fresh issues every month — news, science, math & stories, leveled for your grade',
    books: ['scholastic-news', 'storyworks', 'superscience', 'dynamath', 'scope'],
  },
  {
    id: 'trending',
    kind: 'rank',
    icon: 'flame',
    accent: '#E8553A',
    title: 'Trending at Lincoln Elementary',
    subtitle: 'What your school is reading this week',
    books: [
      'wild-robot',
      'keeper-lost-cities',
      'dog-man',
      'last-kids-earth',
      'wonder',
      'smile',
      'new-kid',
      'lightning-thief',
    ],
  },
  {
    id: 'sora',
    partner: 'sora',
    title: 'Borrow free from your library',
    subtitle: 'Ebooks & audiobooks from Lincoln Public Library, via Sora',
    books: [
      'wild-robot',
      'matilda',
      'pax',
      'lightning-thief',
      'charlottes-web',
      'harry-potter',
      'despereaux',
      'hatchet',
      'fish-in-a-tree',
      'giver',
      'wrinkle',
      'one-ivan',
      'holes',
    ],
  },
  {
    id: 'audio',
    kind: 'audio',
    icon: 'headphones',
    accent: '#2C6BED',
    title: 'Great on audio',
    subtitle: 'Listen on the bus, in the car, or while you draw',
    books: ['crossover', 'brown-girl', 'lightning-thief', 'wild-robot', 'ghost', 'hatchet'],
  },
]

// Browse-by tiles → each opens the Browse page with one filter pre-applied.
export const BROWSE = [
  { label: 'Graphic Novels', icon: 'book', color: '#0DA7BC', filter: { genre: 'Graphic Novel' } },
  { label: 'Adventure', icon: 'rocket', color: '#16A97A', filter: { genre: 'Adventure' } },
  { label: 'Fantasy', icon: 'sparkles', color: '#9D174D', filter: { genre: 'Fantasy' } },
  { label: 'Animals', icon: 'leaf', color: '#166534', filter: { genre: 'Animals' } },
  { label: 'Audiobooks', icon: 'headphones', color: '#2C6BED', filter: { format: 'audiobook' } },
  { label: 'Funny', icon: 'mood-happy', color: '#854D0E', filter: { genre: 'Humor' } },
  { label: 'Mystery', icon: 'search', color: '#334155', filter: { genre: 'Mystery' } },
  { label: 'Magazines', icon: 'news', color: '#C2410C', filter: { format: 'magazine' } },
]

// ─── Browse / search filter model ──────────────────────────────────────────────
// Reading-level bands (parsed from each book's Lexile measure) + age bands.
export const LEVEL_BANDS = [
  { id: 'u500', label: 'Under 500L', min: 0, max: 499 },
  { id: '500', label: '500–700L', min: 500, max: 699 },
  { id: '700', label: '700–900L', min: 700, max: 899 },
  { id: '900', label: '900L+', min: 900, max: 9999 },
]
export const AGE_BANDS = [
  { id: '6-8', label: 'Ages 6–8', min: 6, max: 8 },
  { id: '8-10', label: 'Ages 8–10', min: 8, max: 10 },
  { id: '10-12', label: 'Ages 10–12', min: 10, max: 12 },
  { id: '12+', label: 'Ages 12+', min: 12, max: 99 },
]
// Availability facets (partner id, or 'readnow' for the in-app e-reader).
export const AVAIL_FACETS = [
  { id: 'readnow', label: 'Read now in app' },
  { id: 'comicsplus', label: 'Comics Plus' },
  { id: 'sora', label: 'Sora (library)' },
  { id: 'libby', label: 'Libby (library)' },
  { id: 'library', label: 'School library' },
  { id: 'scholastic', label: 'Scholastic' },
]

export const lexileValue = (lexile) => {
  const s = String(lexile || '')
  if (/grade/i.test(s)) return null // grade-level measures aren't Lexile bands
  const m = s.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : null
}
export const ageBounds = (range) => {
  const nums = String(range || '')
    .match(/\d+/g)
    ?.map(Number)
  if (!nums || !nums.length) return null
  return [nums[0], nums[1] ?? 99]
}
// "Read now in app" = a digital edition (ebook/magazine) on an in-app reader partner.
export const isReadNow = (book) =>
  (book.availability || []).some(
    (a) =>
      (a.partner === 'comicsplus' || a.partner === 'scholastic') &&
      (a.format === 'ebook' || a.format === 'magazine'),
  )

// ─── My Shelf — the reader's saved books ───────────────────────────────────────
// id → status. Seeds App state; the bookmark + the detail "Your shelf" chips edit it.
export const SHELF_SEED = {
  'wild-robot': 'finished',
  wonder: 'finished',
  smile: 'finished',
  crossover: 'finished',
  'dog-man': 'reading',
  'scholastic-news': 'reading',
  'wild-robot-escapes': 'want',
  'front-desk': 'want',
  amari: 'want',
}

export const SHELF_STATUS = {
  reading: { label: 'Currently reading', icon: 'book-2', color: '#0D9488' },
  want: { label: 'Want to read', icon: 'bookmark', color: '#2C6BED' },
  finished: { label: 'Finished', icon: 'circle-check-filled', color: '#16A97A' },
}
export const SHELF_ORDER = ['reading', 'want', 'finished']

// ─── Your reading sessions (the reader's log, per book; newest first) ──────────
export const READING_LOG = {
  'wild-robot': [
    {
      date: 'Apr 10, 2026',
      minutes: 35,
      format: 'print',
      fromPage: 214,
      toPage: 279,
      note: 'Finished it!! Roz + Brightbill forever 😭💚',
    },
    { date: 'Apr 9, 2026', minutes: 45, format: 'print', fromPage: 120, toPage: 214 },
    {
      date: 'Apr 7, 2026',
      minutes: 30,
      format: 'audiobook',
      note: 'Listened on the bus ride home',
    },
    { date: 'Apr 5, 2026', minutes: 25, format: 'print', fromPage: 1, toPage: 64 },
  ],
  wonder: [
    {
      date: 'Mar 30, 2026',
      minutes: 40,
      format: 'print',
      fromPage: 220,
      toPage: 315,
      note: '#choosekind 💙',
    },
    { date: 'Mar 28, 2026', minutes: 35, format: 'print', fromPage: 120, toPage: 220 },
    { date: 'Mar 26, 2026', minutes: 30, format: 'ebook', fromPage: 1, toPage: 120 },
  ],
  smile: [
    {
      date: 'Apr 6, 2026',
      minutes: 50,
      format: 'ebook',
      fromPage: 1,
      toPage: 224,
      note: 'Read it all in one go on Comics Plus!',
    },
  ],
  crossover: [
    {
      date: 'Apr 3, 2026',
      minutes: 70,
      format: 'audiobook',
      note: 'The author reads it like a poem — so good',
    },
    { date: 'Apr 2, 2026', minutes: 65, format: 'audiobook' },
  ],
  'dog-man': [
    {
      date: 'May 8, 2026',
      minutes: 20,
      format: 'ebook',
      fromPage: 96,
      toPage: 150,
      note: 'Petey is up to something…',
    },
    { date: 'May 7, 2026', minutes: 25, format: 'ebook', fromPage: 1, toPage: 96 },
  ],
  'scholastic-news': [
    {
      date: 'May 9, 2026',
      minutes: 8,
      format: 'magazine',
      fromPage: 1,
      toPage: 4,
      note: 'Bee debate page next!',
    },
  ],
}
export const getSessions = (id) => READING_LOG[id] || []

// ─── Ask Benny — a (simulated) recommendation engine ──────────────────────────
// Matches a free-text request against the catalog by intent, so the Ask Benny
// block genuinely "works" without a real model behind it.

const ASK_INTENTS = [
  {
    re: /comic|graphic/,
    msg: 'Love comics? These graphic novels are some of the best 💥',
    pick: (b) => b.genres.includes('Graphic Novel'),
  },
  {
    re: /funny|humor|laugh|silly|hilarious/,
    msg: 'Ha — these’ll make you laugh out loud 😄',
    pick: (b) => b.genres.includes('Humor'),
  },
  {
    re: /magazine/,
    msg: 'Magazines count too! Here’s what’s fresh this month:',
    pick: (b) => b.formats.includes('magazine'),
  },
  {
    re: /audio|listen|headphone/,
    msg: 'Perfect for listening — grab your headphones 🎧',
    pick: (b) => b.formats.includes('audiobook'),
  },
  {
    re: /scary|spooky|creepy|ghost|horror|thrill/,
    msg: 'Ooh, a little spooky? These have just enough chills:',
    ids: ['amari', 'holes', 'giver', 'wrinkle', 'lightning-thief'],
  },
  {
    re: /myster|detective|clue|solve|secret/,
    msg: 'On the case! These mysteries will keep you guessing 🔍',
    pick: (b) => b.genres.includes('Mystery'),
  },
  {
    re: /animal|dog|cat|pet|creature/,
    msg: 'For animal lovers — these have so much heart 🐾',
    pick: (b) => b.genres.includes('Animals'),
  },
  {
    re: /sad|cry|emotional|feeling|tear|moving/,
    msg: 'Grab some tissues 💙 these ones really get you:',
    ids: ['crossover', 'out-of-my-mind', 'one-ivan', 'wonder', 'winn-dixie', 'esperanza'],
  },
  {
    re: /sport|basketball|soccer|track|baseball|football/,
    msg: 'Game on! These sports stories are winners 🏀',
    pick: (b) => b.genres.includes('Sports'),
  },
  {
    re: /space|sci-?fi|science fiction|robot|alien|future|dystop/,
    msg: 'Blast off 🚀 — sci-fi picks coming up:',
    pick: (b) => b.genres.some((g) => ['Sci-Fi', 'Dystopian'].includes(g)),
  },
  {
    re: /magic|fantasy|wizard|dragon|spell|quest|myth/,
    msg: 'A little magic? You’ll fall right into these ✨',
    pick: (b) => b.genres.includes('Fantasy'),
  },
  {
    re: /history|historical|\bwar\b|refugee|past/,
    msg: 'Step back in time with these:',
    pick: (b) => b.genres.includes('Historical'),
  },
  {
    re: /quick|short|fast|small|thin|easy/,
    msg: 'Short but mighty — you’ll finish these fast:',
    pick: (b) => !b.formats.includes('magazine') && b.pageCount <= 240,
  },
  {
    re: /science|facts|nonfiction|learn|real|true|cool/,
    msg: 'For the curious mind — true stuff that’s actually cool 🔬',
    pick: (b) => b.genres.some((g) => ['Nonfiction', 'Science', 'Current Events'].includes(g)),
  },
  {
    re: /kind|friend|nice|belong/,
    msg: 'Big-hearted reads about friendship and kindness:',
    pick: (b) => b.themes.some((t) => ['Kindness', 'Friendship', 'Belonging'].includes(t)),
  },
]

export function recommend(query) {
  const q = (query || '').toLowerCase().trim()
  if (!q)
    return {
      message: 'Not sure where to start? Here are some all-time favorites:',
      books: getBooks(BENNY_PICKS),
    }

  // "something like <title>" → that book's similar list
  let liked = null
  for (const b of BOOKS) {
    const t = b.title.toLowerCase().replace(/^the /, '')
    if (t.length >= 5 && q.includes(t) && (!liked || t.length > liked.t.length))
      liked = { book: b, t }
  }
  if (liked) {
    const books = getBooks(liked.book.similar)
    if (books.length)
      return { message: `If you loved ${liked.book.title}, you’ll click with these:`, books }
  }

  for (const intent of ASK_INTENTS) {
    if (intent.re.test(q)) {
      const books = intent.ids
        ? getBooks(intent.ids)
        : BOOKS.filter(intent.pick)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 8)
      if (books.length >= 2) return { message: intent.msg, books }
    }
  }

  return {
    message: 'I don’t have an exact match for that — but I think you’ll love these:',
    books: getBooks(BENNY_PICKS),
  }
}
