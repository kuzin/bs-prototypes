// Safety Signals — data for Maplewood Elementary
//
// Models the Asana ticket "live notifications if a student uses a trigger word
// with Benny". Safety review lives INSIDE Sessions for Review: these are real
// SFR-shaped Book Talk sessions (so they flow through the same SessionsTable /
// SessionModal / Overview), each carrying an additive `safety` object —
// severity tier (Critical · Warning · Possible), concern category, who was
// notified, and the crisis resources Benny surfaced.

export const SITE = {
  school: 'Maplewood Elementary',
  admin: 'Ms. Reyes', // principal / reviewer (current user)
  counselor: 'Mr. Ellis',
}

// Fixed "now" so relative timestamps are deterministic.
export const NOW = new Date('2026-06-15T10:32:00')

const STUDENTS = {
  tyler: {
    id: 'stu-1',
    name: 'Tyler Williams',
    grade: '4th',
    class: 'Mrs. Johnson',
    initials: 'TW',
    color: '#E8866A',
  },
  maya: {
    id: 'stu-2',
    name: 'Maya Chen',
    grade: '5th',
    class: 'Mr. Okafor',
    initials: 'MC',
    color: '#0DA7BC',
  },
  marcus: {
    id: 'stu-3',
    name: 'Marcus Davis',
    grade: '3rd',
    class: 'Mrs. Johnson',
    initials: 'MD',
    color: '#7C3AED',
  },
  sofia: {
    id: 'stu-4',
    name: 'Sofia Rodriguez',
    grade: '3rd',
    class: 'Mr. Kim',
    initials: 'SR',
    color: '#16A97A',
  },
  jaylen: {
    id: 'stu-5',
    name: 'Jaylen Brown',
    grade: '5th',
    class: 'Mr. Okafor',
    initials: 'JB',
    color: '#F59E0B',
  },
  emma: {
    id: 'stu-6',
    name: 'Emma Petersen',
    grade: '4th',
    class: 'Mrs. Johnson',
    initials: 'EP',
    color: '#EC4899',
  },
  lily: {
    id: 'stu-7',
    name: 'Lily Thompson',
    grade: '5th',
    class: 'Mr. Kim',
    initials: 'LT',
    color: '#64748B',
  },
  noah: {
    id: 'stu-8',
    name: 'Noah Kim',
    grade: '4th',
    class: 'Mrs. Johnson',
    initials: 'NK',
    color: '#1D4ED8',
  },
  zara: {
    id: 'stu-9',
    name: 'Zara Ahmed',
    grade: '3rd',
    class: 'Mr. Okafor',
    initials: 'ZA',
    color: '#D97706',
  },
  caleb: {
    id: 'stu-10',
    name: 'Caleb Foster',
    grade: '5th',
    class: 'Mr. Kim',
    initials: 'CF',
    color: '#059669',
  },
}

const BOOKS = {
  giver: {
    title: 'The Giver',
    author: 'Lois Lowry',
    color: '#1D4ED8',
    lexile: '760L',
    published: 1993,
    publisher: 'HMH Books',
    format: 'Paperback',
    pageCount: 240,
  },
  hatchet: {
    title: 'Hatchet',
    author: 'Gary Paulsen',
    color: '#16A97A',
    lexile: '1020L',
    published: 1987,
    publisher: 'Aladdin',
    format: 'Paperback',
    pageCount: 208,
  },
  wonder: {
    title: 'Wonder',
    author: 'R.J. Palacio',
    color: '#7C3AED',
    lexile: '790L',
    published: 2012,
    publisher: 'Knopf',
    format: 'Hardcover',
    pageCount: 315,
  },
  holes: {
    title: 'Holes',
    author: 'Louis Sachar',
    color: '#D97706',
    lexile: '660L',
    published: 1998,
    publisher: 'Yearling',
    format: 'Paperback',
    pageCount: 233,
  },
  charlotte: {
    title: "Charlotte's Web",
    author: 'E.B. White',
    color: '#E8866A',
    lexile: '680L',
    published: 1952,
    publisher: 'HarperCollins',
    format: 'Paperback',
    pageCount: 184,
  },
  ivan: {
    title: 'The One and Only Ivan',
    author: 'Katherine Applegate',
    color: '#0DA7BC',
    lexile: '570L',
    published: 2012,
    publisher: 'HarperCollins',
    format: 'Paperback',
    pageCount: 320,
  },
  wimpy: {
    title: 'Diary of a Wimpy Kid',
    author: 'Jeff Kinney',
    color: '#F59E0B',
    lexile: '950L',
    published: 2007,
    publisher: 'Amulet',
    format: 'Hardcover',
    pageCount: 217,
  },
  potter: {
    title: "Harry Potter and the Sorcerer's Stone",
    author: 'J.K. Rowling',
    color: '#EC4899',
    lexile: '880L',
    published: 1997,
    publisher: 'Scholastic',
    format: 'Paperback',
    pageCount: 309,
  },
}

// ── Crisis resources Benny can surface (from the ticket) ──────────────────
const RES = {
  988: {
    name: '988 Suicide & Crisis Lifeline',
    contact: 'Call or text 988',
    url: 'https://988lifeline.org',
    blurb: '24/7 free, confidential support for people in distress.',
  },
  text: {
    name: 'Crisis Text Line',
    contact: 'Text HOME to 741741',
    url: 'https://www.crisistextline.org',
    blurb: 'Text-based crisis support, any time.',
  },
  trevor: {
    name: 'The Trevor Project',
    contact: '1-866-488-7386',
    url: 'https://www.thetrevorproject.org/get-help',
    blurb: 'Crisis support for LGBTQ+ young people.',
  },
  childhelp: {
    name: 'Childhelp National Child Abuse Hotline',
    contact: '1-800-422-4453',
    url: 'https://childhelphotline.org',
    blurb: 'Help and reporting for child abuse and neglect.',
  },
}
const res = (...keys) => keys.map((k) => RES[k])

// ── Captured conversations ────────────────────────────────────────────────
// SFR transcript shape + safety extras: student.trigger highlights the message
// that raised the signal; annotation.tone:'safety'; role:'resources' carries
// the crisis resources Benny showed the student inline.

const CONV_MAYA = [
  {
    role: 'benny',
    text: "Hi Maya! I see you've been reading The Giver. How far into the book are you?",
  },
  { role: 'student', text: 'im really sad' },
  {
    role: 'benny',
    text: "I'm sorry to hear that. Would you like to share what's making you feel sad? Sometimes talking about it can help.",
  },
  { role: 'student', text: 'i want to hurt myself', trigger: true },
  {
    role: 'annotation',
    tone: 'safety',
    text: 'Safety signal — possible self-harm. Benny paused the Book Talk and shared support resources.',
  },
  {
    role: 'benny',
    text: "It's really important to talk to someone who can help you. You're not alone, Maya — please reach out to a trusted adult right now, like a parent, teacher, or school counselor.",
  },
  { role: 'resources', items: res('988', 'text', 'trevor') },
]

const CONV_JAYLEN = [
  {
    role: 'benny',
    text: "Hey Jaylen! You've been reading Hatchet. What's the most intense moment Brian has faced so far?",
  },
  {
    role: 'student',
    text: "i don't care about the book. some kids at school keep messing with me and i want to make them pay",
  },
  {
    role: 'benny',
    text: "That sounds really frustrating, and I can tell you're hurting. Can you tell me more about what's been happening?",
  },
  { role: 'student', text: 'i want to bring something and hurt them so they stop', trigger: true },
  {
    role: 'annotation',
    tone: 'safety',
    text: 'Safety signal — possible threat to harm others. Benny shared resources and ended the activity for review.',
  },
  {
    role: 'benny',
    text: "I'm really glad you told me. When things feel this big, the safest thing is to talk to a trusted adult today — a teacher, your counselor, or a parent. They can help make this stop. You don't have to handle it on your own.",
  },
  { role: 'resources', items: res('988', 'text') },
]

const CONV_MARCUS = [
  {
    role: 'benny',
    text: 'Hi Marcus! I see you finished Wonder. What did you think about how Auggie was treated at school?',
  },
  {
    role: 'student',
    text: "it made me think about home. when my mom's boyfriend gets mad he hits me and i don't want to go back",
    trigger: true,
  },
  {
    role: 'annotation',
    tone: 'safety',
    text: 'Safety signal — possible abuse disclosure. Benny responded supportively and surfaced resources.',
  },
  {
    role: 'benny',
    text: "Thank you for trusting me with that, Marcus. No one should be hurt at home, and it's not your fault. It's really important to tell a trusted adult at school today, like your teacher or counselor, so they can help keep you safe.",
  },
  { role: 'resources', items: res('childhelp') },
]

const CONV_TYLER = [
  {
    role: 'benny',
    text: 'Hi Tyler! You logged some time on Holes today. What did you think of Stanley so far?',
  },
  {
    role: 'student',
    text: 'idk. i hate myself honestly. everyone would be better off without me',
    trigger: true,
  },
  {
    role: 'annotation',
    tone: 'safety',
    text: 'Safety signal — hopelessness / possible self-harm.',
  },
  {
    role: 'benny',
    text: "I'm really sorry you're feeling that way, Tyler. Those feelings are heavy and you deserve support. Please talk to a trusted adult — a parent, teacher, or counselor — about how you're feeling. You matter.",
  },
  { role: 'resources', items: res('988', 'text') },
]

const CONV_EMMA = [
  {
    role: 'benny',
    text: "Hi Emma! How's Charlotte's Web going? Do you have a favorite character yet?",
  },
  {
    role: 'student',
    text: "i guess. some kids keep saying mean stuff about me every day and i don't want to come to school anymore",
    trigger: true,
  },
  {
    role: 'annotation',
    tone: 'safety',
    text: 'Safety signal — possible bullying / school avoidance.',
  },
  {
    role: 'benny',
    text: "I'm sorry that's happening — no one deserves to be treated that way. Telling a trusted adult like your teacher or counselor can really help, and they can make it stop. Would you like help thinking of who to talk to?",
  },
  { role: 'resources', items: res('text') },
]

const CONV_SOFIA = [
  {
    role: 'benny',
    text: 'Hi Sofia! You finished The One and Only Ivan — what did you think of Ivan?',
  },
  {
    role: 'student',
    text: "he was kind of sad and lonely. i've been feeling really sad lately too and i don't know why",
    trigger: true,
  },
  { role: 'annotation', tone: 'safety', text: 'Safety signal — emotional distress.' },
  {
    role: 'benny',
    text: "Thanks for sharing that with me, Sofia. It's okay to feel sad sometimes, and talking about it helps. A trusted adult — like your teacher, counselor, or a parent — would want to know so they can support you.",
  },
  { role: 'resources', items: res('988') },
]

const CONV_NOAH = [
  {
    role: 'benny',
    text: "Hi Noah! You've been reading The Giver. What's been the most surprising part?",
  },
  {
    role: 'student',
    text: 'the part where they release people. i was like whoa they basically kill the baby, that was crazy',
    trigger: true,
  },
  {
    role: 'annotation',
    tone: 'info',
    text: 'Keyword match ("kill") while describing a plot point in the book. Low-confidence signal, logged for awareness.',
  },
  {
    role: 'benny',
    text: "That part surprises a lot of readers! It's one of the big turning points. What did it make you think about Jonas's community?",
  },
  {
    role: 'student',
    text: "that it's not as perfect as everyone thinks. it's actually kind of scary",
  },
]

const CONV_LILY = [
  { role: 'benny', text: "Hey Lily! How's Diary of a Wimpy Kid? Are you enjoying it?" },
  {
    role: 'student',
    text: 'omg this book is killing me 😂 in a good way, so funny',
    trigger: true,
  },
  {
    role: 'annotation',
    tone: 'info',
    text: 'Keyword match ("killing me") in casual, positive context. Low-confidence signal.',
  },
  {
    role: 'benny',
    text: "Haha, I love that it's making you laugh! What's the funniest thing that's happened to Greg so far?",
  },
  { role: 'student', text: 'the cheese touch part 😭 everyone runs away from him' },
]

const CONV_ZARA = [
  {
    role: 'benny',
    text: "Hi Zara! You've been reading Wonder. What do you think of the story so far?",
  },
  {
    role: 'student',
    text: 'i feel bad for auggie. in my old school a kid got picked on like that and it was really mean',
    trigger: true,
  },
  {
    role: 'annotation',
    tone: 'info',
    text: 'Keyword match ("picked on") referring to a character / past event, not the student. Low-confidence signal.',
  },
  {
    role: 'benny',
    text: "That's a really kind thing to notice. Why do you think people sometimes treat others that way in the story?",
  },
  { role: 'student', text: "because they don't take time to know them first" },
]

// Non-safety Book Talks (so the Flagged / Engagement tabs reflect the real SFR
// system around the safety signals).
const CONV_COPY = [
  { role: 'benny', text: 'Hi Caleb! I see you just finished Wonder. What was your favorite part?' },
  {
    role: 'student',
    text: 'Wonder is a 2012 middle grade novel by R. J. Palacio about a boy named August Pullman who has a facial difference.',
    flagged: true,
  },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a copied response.' },
  { role: 'benny', text: 'Can you tell me in your own words what YOU thought of the story?' },
  {
    role: 'student',
    text: 'He attends a mainstream school for the first time in fifth grade after being homeschooled.',
    flagged: true,
  },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a copied response.' },
]

const CONV_MINIMAL = [
  {
    role: 'benny',
    text: 'Hey Lily! I see you finished Holes. What did you think about Camp Green Lake?',
  },
  { role: 'student', text: 'It was bad.', flagged: true },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
  { role: 'benny', text: 'Can you say a bit more? What made it feel bad?' },
  { role: 'student', text: 'They dug holes.', flagged: true },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
]

const CONV_GREEN = [
  {
    role: 'benny',
    text: 'Hi Caleb! You just finished Hatchet — what was the most intense moment Brian faced?',
  },
  {
    role: 'student',
    text: "Probably the moose attack. I couldn't put it down. The porcupine scene early on was scary too because he was still so helpless.",
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted a long answer!' },
  { role: 'benny', text: 'What did those early struggles show you about Brian?' },
  {
    role: 'student',
    text: "He's stubborn in a good way — he keeps trying even when he fails, like with the fire.",
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted positive sentiment!' },
]

// ── Sessions ────────────────────────────────────────────────────────────
// SFR-shaped; safety sessions carry an additive `safety` object.
let _id = 1
function session(student, book, o) {
  const { safety, conversation, ...rest } = o
  return {
    id: `sess-${_id++}`,
    student,
    book,
    type: 'engagement',
    status: 'completed',
    challenge: 'Summer Reading',
    engagementRating: null,
    minutesLogged: 46,
    flags: [],
    positiveFlags: [],
    conversation,
    changeLog: o.changeLog || [],
    ...(safety ? { safety } : {}),
    ...rest,
  }
}

function notif(role, name, channel, at, status) {
  return { role, name, channel, at, status }
}

export const SESSIONS = [
  // ── Critical ──
  session(STUDENTS.maya, BOOKS.giver, {
    date: '2026-06-15',
    conversation: CONV_MAYA,
    changeLog: [
      {
        id: 'cl-my1',
        kind: 'note',
        by: 'Mr. Ellis',
        at: '2026-06-15T10:20:00',
        note: "Reached Maya's guardian by phone; in-person check-in scheduled for this afternoon.",
      },
      {
        id: 'cl-my2',
        kind: 'note',
        by: 'Ms. Reyes',
        at: '2026-06-15T10:38:00',
        note: 'Counselor and I will meet with Maya together. Documenting every step per protocol.',
      },
    ],
    safety: {
      severity: 'critical',
      category: 'self-harm',
      at: '2026-06-15T10:14:00',
      excerpt: 'i want to hurt myself',
      summary: 'Maya stated she wants to hurt herself during a Book Talk about The Giver.',
      status: 'new',
      resources: res('988', 'text', 'trevor'),
      notified: [
        notif('Teacher', 'Mr. Okafor', 'email', '2026-06-15T10:14:00', 'opened'),
        notif('Counselor', 'Mr. Ellis', 'email', '2026-06-15T10:14:00', 'opened'),
        notif('Principal', 'Ms. Reyes', 'in-app', '2026-06-15T10:14:00', 'sent'),
      ],
    },
  }),
  session(STUDENTS.jaylen, BOOKS.hatchet, {
    date: '2026-06-15',
    conversation: CONV_JAYLEN,
    changeLog: [
      {
        id: 'cl-j1',
        kind: 'note',
        by: 'Mr. Ellis',
        at: '2026-06-15T09:05:00',
        note: 'Looped in family and met with student. Safety plan in progress.',
      },
      {
        id: 'cl-j2',
        kind: 'note',
        by: 'Ms. Reyes',
        at: '2026-06-15T09:40:00',
        note: 'Notified the district safety lead and documented the incident report.',
      },
      {
        id: 'cl-j3',
        kind: 'note',
        by: 'Mr. Okafor',
        at: '2026-06-15T12:10:00',
        note: 'Jaylen returned to class calmly after the counselor meeting. Monitoring through the week.',
      },
    ],
    safety: {
      severity: 'critical',
      category: 'harm-others',
      at: '2026-06-15T08:47:00',
      excerpt: 'i want to bring something and hurt them so they stop',
      summary: 'Jaylen described wanting to harm other students.',
      status: 'new',
      resources: res('988', 'text'),
      notified: [
        notif('Teacher', 'Mr. Okafor', 'email', '2026-06-15T08:47:00', 'opened'),
        notif('Counselor', 'Mr. Ellis', 'email', '2026-06-15T08:47:00', 'opened'),
        notif('Principal', 'Ms. Reyes', 'in-app', '2026-06-15T08:47:00', 'opened'),
      ],
    },
  }),
  session(STUDENTS.marcus, BOOKS.wonder, {
    date: '2026-06-14',
    conversation: CONV_MARCUS,
    changeLog: [
      {
        id: 'cl-m1',
        kind: 'note',
        by: 'Mr. Ellis',
        at: '2026-06-14T14:31:00',
        note: 'Mandated report filed. Counselor following up.',
      },
    ],
    safety: {
      severity: 'critical',
      category: 'abuse',
      at: '2026-06-14T14:20:00',
      excerpt: "when my mom's boyfriend gets mad he hits me",
      summary: 'Marcus disclosed possible physical abuse at home.',
      status: 'new',
      resources: res('childhelp'),
      notified: [
        notif('Teacher', 'Mrs. Johnson', 'email', '2026-06-14T14:20:00', 'opened'),
        notif('Counselor', 'Mr. Ellis', 'email', '2026-06-14T14:20:00', 'opened'),
        notif('Principal', 'Ms. Reyes', 'in-app', '2026-06-14T14:20:00', 'opened'),
      ],
    },
  }),

  // ── Warning ──
  session(STUDENTS.tyler, BOOKS.holes, {
    date: '2026-06-15',
    type: 'both',
    engagementRating: 'red',
    flags: [
      {
        id: 'tf1',
        type: 'minimal',
        label: 'Minimal engagement',
        description: 'Very brief, low-effort answers about the book.',
      },
    ],
    conversation: CONV_TYLER,
    changeLog: [
      {
        id: 'cl-t1',
        kind: 'note',
        by: 'Mrs. Johnson',
        at: '2026-06-15T09:42:00',
        note: 'Tyler seemed withdrawn in class this morning — flagging for the counselor to follow up.',
      },
      {
        id: 'cl-t2',
        kind: 'rating',
        from: 'yellow',
        to: 'red',
        by: 'Mr. Garcia',
        at: '2026-06-15T10:06:00',
        note: 'Re-rated to Disengaged after re-reading — answers were minimal throughout.',
      },
      {
        id: 'cl-t3',
        kind: 'note',
        by: 'Mr. Ellis',
        at: '2026-06-15T11:25:00',
        note: 'Met with Tyler 1:1. He opened up a little; scheduled a follow-up for Thursday.',
      },
    ],
    safety: {
      severity: 'warning',
      category: 'self-harm',
      at: '2026-06-15T09:38:00',
      excerpt: 'everyone would be better off without me',
      summary: 'Tyler expressed hopelessness and self-directed negative talk.',
      status: 'new',
      resources: res('988', 'text'),
      notified: [
        notif('Teacher', 'Mrs. Johnson', 'email', '2026-06-15T09:38:00', 'opened'),
        notif('Counselor', 'Mr. Ellis', 'email', '2026-06-15T09:38:00', 'sent'),
      ],
    },
  }),
  session(STUDENTS.emma, BOOKS.charlotte, {
    date: '2026-06-14',
    engagementRating: 'yellow',
    conversation: CONV_EMMA,
    changeLog: [
      {
        id: 'cl-e1',
        kind: 'note',
        by: 'Mrs. Johnson',
        at: '2026-06-14T11:40:00',
        note: 'Talked with Emma at recess. Watching the friend group.',
      },
    ],
    safety: {
      severity: 'warning',
      category: 'bullying',
      at: '2026-06-14T11:02:00',
      excerpt: "i don't want to come to school anymore",
      summary: 'Emma reported ongoing bullying and school avoidance.',
      status: 'new',
      resources: res('text'),
      notified: [
        notif('Teacher', 'Mrs. Johnson', 'email', '2026-06-14T11:02:00', 'opened'),
        notif('Counselor', 'Mr. Ellis', 'email', '2026-06-14T11:02:00', 'opened'),
      ],
    },
  }),
  session(STUDENTS.sofia, BOOKS.ivan, {
    date: '2026-06-13',
    engagementRating: 'yellow',
    conversation: CONV_SOFIA,
    changeLog: [
      {
        id: 'cl-s1',
        kind: 'safety-resolved',
        resolution: 'supported',
        by: 'Mr. Ellis',
        at: '2026-06-13T15:10:00',
        note: 'Met with Sofia and set up weekly counselor check-ins. Family notified.',
      },
    ],
    safety: {
      severity: 'warning',
      category: 'distress',
      at: '2026-06-13T13:15:00',
      excerpt: "i've been feeling really sad lately and i don't know why",
      summary: 'Sofia described persistent sadness.',
      status: 'resolved',
      resolution: 'supported',
      resources: res('988'),
      notified: [
        notif('Teacher', 'Mr. Kim', 'email', '2026-06-13T13:15:00', 'opened'),
        notif('Counselor', 'Mr. Ellis', 'email', '2026-06-13T13:15:00', 'opened'),
      ],
    },
  }),

  // ── Possible ──
  session(STUDENTS.noah, BOOKS.giver, {
    date: '2026-06-15',
    engagementRating: 'green',
    conversation: CONV_NOAH,
    safety: {
      severity: 'possible',
      category: 'self-harm',
      at: '2026-06-15T10:05:00',
      excerpt: 'they basically kill the baby',
      summary: 'Keyword "kill" matched while describing a plot point in the book.',
      status: 'new',
      resources: [],
      notified: [notif('Teacher', 'Mrs. Johnson', 'digest', '2026-06-15T10:05:00', 'queued')],
    },
  }),
  session(STUDENTS.lily, BOOKS.wimpy, {
    date: '2026-06-14',
    type: 'both',
    flags: [
      {
        id: 'lf1',
        type: 'copy-paste',
        label: 'Copied response detected',
        description: 'One answer appears pasted from a summary.',
      },
    ],
    conversation: CONV_LILY,
    changeLog: [
      {
        id: 'cl-l1',
        kind: 'safety-resolved',
        resolution: 'dismissed',
        by: 'Mr. Kim',
        at: '2026-06-14T16:00:00',
        note: 'Figure of speech — not a concern.',
      },
    ],
    safety: {
      severity: 'possible',
      category: 'distress',
      at: '2026-06-14T09:50:00',
      excerpt: 'this book is killing me 😂',
      summary: 'Keyword "killing me" matched in casual, positive context.',
      status: 'resolved',
      resolution: 'dismissed',
      resources: [],
      notified: [notif('Teacher', 'Mr. Kim', 'digest', '2026-06-14T09:50:00', 'sent')],
    },
  }),
  session(STUDENTS.zara, BOOKS.wonder, {
    date: '2026-06-13',
    status: 'unfinished',
    conversation: CONV_ZARA,
    changeLog: [
      {
        id: 'cl-z1',
        kind: 'safety-resolved',
        resolution: 'dismissed',
        by: 'Mr. Okafor',
        at: '2026-06-13T14:45:00',
        note: 'About a book character and her old school — no current concern.',
      },
    ],
    safety: {
      severity: 'possible',
      category: 'bullying',
      at: '2026-06-13T10:25:00',
      excerpt: 'a kid got picked on like that',
      summary: 'Keyword "picked on" referred to a character / past event, not the student.',
      status: 'resolved',
      resolution: 'dismissed',
      resources: [],
      notified: [notif('Teacher', 'Mr. Okafor', 'digest', '2026-06-13T10:25:00', 'sent')],
    },
  }),

  // ── Non-safety Book Talks (the rest of the SFR system) ──
  session(STUDENTS.caleb, BOOKS.wonder, {
    date: '2026-06-15',
    type: 'flagged',
    minutesLogged: 79,
    flags: [
      {
        id: 'f1',
        type: 'copy-paste',
        label: 'Copied response detected',
        description: 'Responses appear copied from an external source.',
      },
    ],
    conversation: CONV_COPY,
  }),
  session(STUDENTS.lily, BOOKS.holes, {
    date: '2026-06-14',
    type: 'flagged',
    minutesLogged: 64,
    flags: [
      {
        id: 'f2',
        type: 'minimal',
        label: 'Minimal engagement',
        description: 'Very brief, low-effort responses throughout.',
      },
    ],
    conversation: CONV_MINIMAL,
  }),
  session(STUDENTS.caleb, BOOKS.hatchet, {
    date: '2026-06-13',
    engagementRating: 'green',
    minutesLogged: 58,
    positiveFlags: [
      { id: 'pf1', type: 'positive-sentiment' },
      { id: 'pf2', type: 'answer-length' },
    ],
    conversation: CONV_GREEN,
  }),
]

// ── Helpers ────────────────────────────────────────────────────────────
export const isSafety = (s) => !!s.safety
export const isSafetyOpen = (s) => s.safety && s.safety.status !== 'resolved'

export function relTime(iso) {
  const mins = Math.round((NOW - new Date(iso)) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`
  const days = Math.round(hrs / 24)
  return days === 1 ? 'yesterday' : `${days} days ago`
}
