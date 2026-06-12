// Benny Book Talks — mock data for a self-contained "AI Chat Activity" badge.
//
// The big idea (from the ticket): a new Activity badge type whose requirement
// IS a direct conversation with Benny. No reading log, no pages/minutes — the
// chat itself fulfills the badge. Teachers write the prompt Benny works from
// and a completion bar (minimum exchanges); students click the badge, talk to
// Benny, and the badge awards the moment the bar is met. Teachers can then read
// every conversation and its breakdown.

import { PICKER_BADGES } from '../challenge-creator/data'

export const SITE = {
  school: 'Maplewood Elementary',
  teacher: 'Mrs. Johnson',
  classroom: "Mrs. Johnson's Class · Grade 4",
}

// Seed the badge with real art from the Challenge Creator's badge catalog.
const DEFAULT_ART = PICKER_BADGES.find((b) => b.name === 'Open Book') ?? PICKER_BADGES[0]

// The challenge this activity badge lives inside (entry point = a challenge
// badge, matching today's mechanic). Real Beanstack challenge — "Benny the
// Bean" — with its banner + badge art under assets/challenge/.
export const CHALLENGE = {
  title: 'Benny the Bean Reading Challenge',
  dates: 'June 1 – August 31, 2026',
  accent: '#F08A6B',
}

// Conversation starters the teacher picks from — about reading in general
// (these badges are activities, not book logs). Each carries the question
// script Benny follows when a student takes it. The prompt is chosen, not
// typed — selecting one shows it read-only in the editor.
export const EXAMPLE_PROMPTS = [
  {
    id: 'reading-life',
    label: 'Reading life',
    text: "Have a relaxed chat about the student's reading life — what they like to read and what they've been into lately.",
    questions: [
      {
        q: 'What have you been reading lately?',
        suggestions: [
          'A graphic novel series',
          'Some fantasy books',
          'Mostly nonfiction',
          'Not much, honestly',
        ],
      },
      {
        q: 'What kinds of books do you enjoy most?',
        suggestions: [
          'Adventure & fantasy',
          'Funny stories',
          'Real-life & nonfiction',
          'Mysteries',
        ],
      },
      {
        q: 'What got you into reading those?',
        suggestions: [
          'A friend recommended them',
          'I saw the movie first',
          'I love the characters',
          'My teacher suggested one',
        ],
      },
    ],
  },
  {
    id: 'favorites',
    label: 'Favorite books',
    text: 'Ask about a favorite book or author and what makes it special to the student.',
    questions: [
      {
        q: "What's one of your favorite books or authors?",
        suggestions: ['Dog Man', 'The Wild Robot', 'Harry Potter', 'Raina Telgemeier'],
      },
      {
        q: 'What makes it so special to you?',
        suggestions: [
          'The characters feel real',
          'It makes me laugh',
          'The adventure',
          'It stuck with me',
        ],
      },
      {
        q: 'Would you read it again?',
        suggestions: ['Definitely!', 'Maybe someday', 'I already have — twice!'],
      },
    ],
  },
  {
    id: 'recommend',
    label: 'Recommend a read',
    text: 'Ask the student to recommend a book to a friend and share a couple of reasons why.',
    questions: [
      {
        q: 'If you could recommend one book to a friend, what would it be?',
        suggestions: ['Dog Man', 'Percy Jackson', 'Wonder', 'Smile'],
      },
      {
        q: 'Why would you recommend it?',
        suggestions: [
          "It's so much fun",
          'It teaches you something',
          'The art is amazing',
          "I couldn't put it down",
        ],
      },
      {
        q: 'Who do you think would love it most?',
        suggestions: ['My best friend', 'Someone who likes adventure', 'Anyone, really!'],
      },
    ],
  },
  {
    id: 'why-reading',
    label: 'Why reading matters',
    text: 'Ask how reading makes the student feel and what they enjoy most about it.',
    questions: [
      {
        q: 'How does reading make you feel?',
        suggestions: [
          'Relaxed and happy',
          "Like I'm in another world",
          'Sometimes bored, honestly',
          'Excited!',
        ],
      },
      {
        q: 'What do you enjoy most about reading?',
        suggestions: [
          'Getting lost in a story',
          'Learning new things',
          'The pictures and art',
          'Reading with friends',
        ],
      },
      {
        q: "When's your favorite time to read?",
        suggestions: ['Before bed', 'At school', 'On weekends', 'Anytime!'],
      },
    ],
  },
]

// The configured AI Chat Activity badge. CreateView edits a copy of this. `img`
// is badge art from the shared Challenge Creator gallery; `color` is the accent
// used by chat controls (send button etc.). The prompt is one of EXAMPLE_PROMPTS
// (chosen, not typed) — stored as `promptId` (+ `prompt` text for display).
export const DEFAULT_BADGE = {
  name: 'Talk About Your Reading',
  img: DEFAULT_ART.img,
  color: '#14B8A6',
  promptId: EXAMPLE_PROMPTS[0].id,
  prompt: EXAMPLE_PROMPTS[0].text,
  minExchanges: 3,
  requireEngagement: true,
}

// ─── Live student chat ───────────────────────────────────────────────────────
// A lightweight scripted flow so the prototype's chat feels real. Benny opens
// generally (these are reading activities, not tied to a logged title), then
// walks the chosen prompt's question script padded with general questions.

export const BENNY_OPENER = () =>
  "Hi! I'm Benny. 🌱 Your teacher asked me to chat with you about your reading. No wrong answers here — I just want to hear your thoughts! Ready?"

const GENERAL_QUESTIONS = [
  {
    q: "Is there a book you'd like to read next?",
    suggestions: ['Yeah, a few!', 'Not sure yet', 'My friend recommended one'],
  },
  {
    q: 'Has a book ever changed how you think about something?',
    suggestions: ['Yes, definitely', 'A little', "Not really, but they're fun"],
  },
  {
    q: 'Do you like reading on your own or with someone?',
    suggestions: ['On my own', 'With a friend or family', 'Both!'],
  },
]

// promptId → the chosen prompt's question script, padded with general questions.
export function deriveScript(promptId) {
  const preset = EXAMPLE_PROMPTS.find((p) => p.id === promptId)
  return [...(preset?.questions || []), ...GENERAL_QUESTIONS]
}

export const BENNY_CLOSER =
  'Thanks for sharing all that with me — I loved hearing about your reading. 🎉 Keep it up!'

// ─── The "off-track" path ────────────────────────────────────────────────────
// If a student gives a few low-effort answers, Benny isn't getting enough to
// award the badge. Those turns get flagged (and don't count toward the bar);
// once a couple pile up he gently says it's not on track yet AND keeps the chat
// going so the student can still earn it. Reaching this path is easy in the
// prototype — the suggestion row always offers a dimmed low-effort chip.

// Low-effort chips appended to every question's suggestions, so the off-track
// path is reachable from anywhere. Tapping one is treated as a minimal reply.
export const LOW_EFFORT_SUGGESTIONS = ['I dunno', 'Not really', 'Nothing comes to mind']

// A minimal / non-substantive reply Benny flags — curt one-word-ish answers, or
// one of the low-effort chips above.
const WEAK_RE =
  /^(idk|i\s*d(o|')?n'?t\s*know|dunno|no+|nope|nothing|none|not really|nah|meh|i guess|maybe|ok(ay)?|k|yes|yeah|yep|sure)[.!\s]*$/i
export function isWeakAnswer(text) {
  const t = String(text || '').trim()
  if (!t) return false
  if (LOW_EFFORT_SUGGESTIONS.includes(t)) return true
  return WEAK_RE.test(t)
}

// How many low-effort answers before Benny steps in with a heads-up, and how
// many before he gently ends the conversation. (Flagging is internal — the
// student never sees it; these just drive Benny's responses.)
export const INTERVENE_AFTER = 2
export const FAIL_AFTER = 4

// Benny's gentle ask for more after a single low-effort answer (cycled).
export const BENNY_NUDGES = [
  'Ooh, can you tell me a little more? Even one sentence helps! 😊',
  "I'd love a bit more — what's something you actually remember or liked?",
]

// Benny's heads-up once a few answers have been too short to count: he names
// that it's not on track yet, then encourages the student to keep going.
export const BENNY_INTERVENTION =
  "I really want you to earn this badge! 🌱 A few of those answers were a little too short for me to count, so we're not quite on track yet. No worries — let's keep chatting! Tell me a bit more and you'll get there. 💪"

// When the chat just isn't getting there, Benny kindly wraps it up — no badge
// this time, but the student can start over and try again.
export const BENNY_FAIL =
  "I don't think I'm getting quite enough from our chat to give you this badge today. 🌱 That's totally okay — it happens! Take a breath, and whenever you're ready, you can start over and give it another try."

// ─── Benny's expressions ─────────────────────────────────────────────────────
// Five face SVGs (in /public) that swap with Benny's mood as he talks: happy
// while chatting, excited on hello, thinking while he composes a reply, sad on
// an off-track heads-up, laughing on the celebration.
export const BENNY_FACE = {
  happy: '/bs-prototypes/benny-happy.svg',
  excited: '/bs-prototypes/benny-excited.svg',
  laughing: '/bs-prototypes/benny-laughing.svg',
  sad: '/bs-prototypes/benny-sad.svg',
  thinking: '/bs-prototypes/benny-thinking.svg',
}
export const faceFor = (emotion) => BENNY_FACE[emotion] || BENNY_FACE.happy

// ─── Teacher review: roster + conversations ──────────────────────────────────
// Status: 'completed' | 'in-progress' | 'not-started'

const C = (role, text, extra = {}) => ({ role, text, ...extra })
const NOTE = (sentiment, text) => ({ role: 'annotation', sentiment, text })

// Each Book Talk is about reading in general, so students bring up different
// books — giving the teacher a varied roster. Each student's conversation is
// about their own book.
const BOOKS = {
  wonder: { title: 'Wonder', author: 'R. J. Palacio', color: '#7C3AED', lexile: '790L' },
  dogMan: {
    title: 'Dog Man: Lord of the Fleas',
    author: 'Dav Pilkey',
    color: '#0DA7BC',
    lexile: '390L',
  },
  wildRobot: { title: 'The Wild Robot', author: 'Peter Brown', color: '#16A97A', lexile: '740L' },
  percyJackson: {
    title: 'Percy Jackson & the Lightning Thief',
    author: 'Rick Riordan',
    color: '#1D4ED8',
    lexile: '680L',
  },
  smile: { title: 'Smile', author: 'Raina Telgemeier', color: '#EC4899', lexile: 'GN410L' },
  frontDesk: { title: 'Front Desk', author: 'Kelly Yang', color: '#D97706', lexile: '640L' },
}

// Maya — strong, engaged (Wonder).
const CONVO_MAYA = [
  C('benny', "Hi! What have you been reading lately? I'd love to hear about it."),
  C('student', "I just finished Wonder! I read it in like three days, I couldn't stop."),
  NOTE('positive', 'Benny noted positive sentiment.'),
  C('benny', 'Three days — amazing! What part stuck with you the most?'),
  C(
    'student',
    'When Auggie went to school for the first time even though he was scared everyone would stare. He still walked in.',
  ),
  NOTE('positive', 'Benny noted a long, detailed answer.'),
  C('benny', 'How did that part make you feel?'),
  C(
    'student',
    'Kind of sad because kids were mean, but proud of him for being brave. It made me want to be nicer to new kids at my school.',
  ),
  NOTE('positive', 'Benny noted a personal connection.'),
  C('benny', 'Would you recommend it to a friend?'),
  C('student', 'Definitely. It teaches you about kindness.'),
  NOTE('positive', 'Benny found no problems.'),
]

// Tyler — minimal, low-effort (Dog Man).
const CONVO_TYLER = [
  C('benny', 'Hi! What have you been reading lately?'),
  C('student', 'dog man'),
  NOTE('warning', 'Benny flagged a minimal response.'),
  C('benny', "Fun series! What's something that happens in it that you liked?"),
  C('student', 'idk stuff happens', { flagged: true }),
  NOTE('warning', 'Benny flagged a minimal response.'),
  C('benny', 'Is there a character you remember?'),
  C('student', 'no', { flagged: true }),
  NOTE('warning', "Benny couldn't confirm specific details."),
]

// Sofia — positive start, then walked away (The Wild Robot).
const CONVO_SOFIA = [
  C('benny', "Hi! I'm Benny. What have you been reading lately?"),
  C(
    'student',
    'The Wild Robot — I love how Roz the robot learns to survive on the island and take care of the animals.',
  ),
  NOTE('positive', 'Benny noted positive sentiment.'),
  C('benny', 'Roz is wonderful! What surprised you most about how she changed?'),
]

// Jaylen — engaged, specific details (Percy Jackson).
const CONVO_JAYLEN = [
  C('benny', 'Hey! What have you been reading?'),
  C(
    'student',
    "Percy Jackson and the Lightning Thief. It's about a kid who finds out he's a demigod — the son of Poseidon!",
  ),
  NOTE('positive', 'Benny noted positive sentiment.'),
  C('benny', 'So cool! What was a part with a lot of action?'),
  C(
    'student',
    'When Percy fights the Minotaur on the hill by camp, and later he gets Riptide — this pen that turns into a sword.',
  ),
  NOTE('positive', 'Benny noted specific details from the book.'),
  C('benny', 'Would you keep reading the series?'),
  C('student', 'Yeah, I already started the second one, Sea of Monsters.'),
  NOTE('positive', 'Benny found no problems.'),
]

// Noah — long answers, but only mildly engaged (Smile).
const CONVO_NOAH = [
  C('benny', 'Hi! What have you been reading lately?'),
  C(
    'student',
    "Smile by Raina Telgemeier. It's a graphic novel about her knocking out her two front teeth and all the dentist and braces stuff she deals with for years.",
  ),
  NOTE('positive', 'Benny noted a long answer.'),
  C('benny', 'How did reading about that make you feel?'),
  C('student', 'I dunno, it was kinda funny but mostly I just like the drawings.'),
  C('benny', 'Was there a part that really stood out to you?'),
  C('student', 'Not really, I kind of skimmed some of the middle honestly.'),
  NOTE('warning', 'Benny noted the reader seemed only mildly engaged with the story.'),
]

// Emma — positive start, then walked away (Front Desk).
const CONVO_EMMA = [
  C('benny', "Hi! I'm Benny. What have you been reading lately?"),
  C(
    'student',
    'Front Desk! Mia and her parents run a motel, and she helps the families who stay there.',
  ),
  C('benny', "That's a great one. What's something Mia does that you really admire?"),
]

export const STUDENTS = [
  {
    id: 's1',
    name: 'Maya Chen',
    initials: 'MC',
    color: '#0DA7BC',
    status: 'completed',
    rating: 'green',
    exchanges: 4,
    completedAt: 'Apr 12, 10:24 AM',
    flags: [],
    positiveFlags: ['positive-sentiment', 'answer-length', 'makes-connection'],
    book: BOOKS.wonder,
    conversation: CONVO_MAYA,
  },
  {
    id: 's2',
    name: 'Tyler Williams',
    initials: 'TW',
    color: '#E8866A',
    status: 'completed',
    rating: 'red',
    exchanges: 3,
    completedAt: 'Apr 12, 1:05 PM',
    flags: ['minimal', 'no-recall'],
    positiveFlags: [],
    book: BOOKS.dogMan,
    conversation: CONVO_TYLER,
  },
  {
    id: 's3',
    name: 'Sofia Rodriguez',
    initials: 'SR',
    color: '#16A97A',
    status: 'in-progress',
    rating: null,
    exchanges: 1,
    completedAt: null,
    flags: [],
    positiveFlags: ['positive-sentiment'],
    book: BOOKS.wildRobot,
    conversation: CONVO_SOFIA,
  },
  {
    id: 's4',
    name: 'Jaylen Brooks',
    initials: 'JB',
    color: '#F59E0B',
    status: 'completed',
    rating: 'green',
    exchanges: 5,
    completedAt: 'Apr 13, 9:14 AM',
    flags: [],
    positiveFlags: ['positive-sentiment', 'references-details'],
    book: BOOKS.percyJackson,
    conversation: CONVO_JAYLEN,
  },
  {
    id: 's5',
    name: 'Noah Kim',
    initials: 'NK',
    color: '#1D4ED8',
    status: 'completed',
    rating: 'yellow',
    exchanges: 3,
    completedAt: 'Apr 13, 11:42 AM',
    flags: [],
    positiveFlags: ['answer-length'],
    book: BOOKS.smile,
    conversation: CONVO_NOAH,
  },
  {
    id: 's6',
    name: 'Emma Petersen',
    initials: 'EP',
    color: '#EC4899',
    status: 'in-progress',
    rating: null,
    exchanges: 2,
    completedAt: null,
    flags: [],
    positiveFlags: [],
    book: BOOKS.frontDesk,
    conversation: CONVO_EMMA,
  },
  {
    id: 's7',
    name: 'Marcus Davis',
    initials: 'MD',
    color: '#7C3AED',
    status: 'not-started',
    rating: null,
    exchanges: 0,
    completedAt: null,
    flags: [],
    positiveFlags: [],
    conversation: [],
  },
  {
    id: 's8',
    name: 'Lily Thompson',
    initials: 'LT',
    color: '#64748B',
    status: 'not-started',
    rating: null,
    exchanges: 0,
    completedAt: null,
    flags: [],
    positiveFlags: [],
    conversation: [],
  },
]

// Flag dictionaries (mirror Sessions for Review).
export const FLAG_DESCS = {
  minimal: { label: 'Minimal Engagement', desc: 'Student gave very brief, low-effort responses.' },
  'no-recall': {
    label: 'Unable to Recall Details',
    desc: 'Student could not describe specific events or characters.',
  },
  'copy-paste': {
    label: 'Copied Response',
    desc: 'Response appears to be copied from an external source.',
  },
  unintelligible: {
    label: 'Unintelligible Response',
    desc: 'We were unable to understand one or more responses.',
  },
}

export const POS_FLAG_DESCS = {
  'positive-sentiment': {
    label: 'Positive Sentiment',
    desc: 'Student expressed positive feeling about the book.',
  },
  'answer-length': { label: 'Long Answer', desc: 'Student gave a longer, engaged answer.' },
  'references-details': {
    label: 'References Details',
    desc: 'Student included specific details from the book.',
  },
  'makes-connection': {
    label: 'Made a Connection',
    desc: 'Student connected the book to their own life.',
  },
}

export const RATING_LABELS = { green: 'Engaged', yellow: 'Mixed', red: 'Disengaged' }
export const STATUS_LABELS = {
  completed: 'Completed',
  'in-progress': 'In progress',
  'not-started': 'Not started',
}

// ─── Sessions for Review integration ─────────────────────────────────────────
// Reshape the Book Talk students into the Sessions-for-Review session shape so
// the teacher review reuses the SFR table + modal. These carry `source:
// 'activity'` — a NEW Benny-conversation type (the self-contained Book Talk
// badge) alongside SFR's default post-logging check-ins.

const SESSION_GRADES = { s1: '5th', s2: '4th', s3: '3rd', s4: '5th', s5: '4th', s6: '3rd' }
const SESSION_DATES = {
  s1: '2026-06-12',
  s2: '2026-06-12',
  s3: '2026-06-11',
  s4: '2026-06-13',
  s5: '2026-06-13',
  s6: '2026-06-10',
}
// Where each Benny conversation came from: the new self-contained Book Talk
// "activity" badge, or a post-logging "title" completion (the existing trigger).
const SESSION_SOURCE = {
  s1: 'title',
  s2: 'activity',
  s3: 'activity',
  s4: 'title',
  s5: 'activity',
  s6: 'activity',
}

// SFR session.type = engagement | flagged | both (engagement/integrity lens).
const sessionType = (s) => {
  const hasFlags = s.flags.length > 0
  const hasPos = s.positiveFlags.length > 0
  if (hasFlags && hasPos) return 'both'
  if (hasFlags) return 'flagged'
  return 'engagement'
}

// Build SFR-shaped sessions only for students who actually had a conversation.
// Activity-badge sessions carry the badge's prompt (name + text) so the teacher
// can see exactly what conversation starter Benny worked from.
export const buildReviewSessions = (badge = DEFAULT_BADGE) => {
  const activityName = badge.name
  const preset = EXAMPLE_PROMPTS.find((p) => p.id === badge.promptId)
  const promptText = badge.prompt || preset?.text
  return STUDENTS.filter((s) => s.conversation.length > 0).map((s) => {
    const source = SESSION_SOURCE[s.id] || 'activity'
    return {
      id: s.id,
      source,
      activityName,
      // Only the self-contained activity badge runs from a Benny prompt.
      promptText: source === 'activity' ? promptText : undefined,
      student: {
        id: s.id,
        name: s.name,
        grade: SESSION_GRADES[s.id] || '4th',
        initials: s.initials,
        color: s.color,
      },
      book: s.book,
      date: SESSION_DATES[s.id] || '2026-06-12',
      type: sessionType(s),
      status: s.status === 'in-progress' ? 'unfinished' : 'completed',
      engagementRating: s.rating,
      minutesLogged: source === 'title' ? 58 : 0,
      flags: s.flags.map((type, i) => ({
        id: `${s.id}-f${i}`,
        type,
        label: FLAG_DESCS[type]?.label || type,
        description: FLAG_DESCS[type]?.desc || '',
      })),
      positiveFlags: s.positiveFlags.map((type, i) => ({ id: `${s.id}-p${i}`, type })),
      conversation: s.conversation,
    }
  })
}
