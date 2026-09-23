// A Book Talk, in the shape SfR's SessionModal renders.
//
// The engine's fixtures know a talk happened — who, which title, which month,
// whether it was flagged — but not what was said. This builds the rest, and it
// only builds the one kind of talk that can honestly be generated.
//
// SfR names three kinds and this builds all three, but only ever asks the
// questions each kind can ask about a book it doesn't know the plot of:
//
//   engagement    "a warm chat about how the book landed" — how it felt to
//                 read. Nothing here depends on what happens in it.
//   integrity     a check on the *log*: this many minutes, on this day. The
//                 subject is the reading session, not the story.
//   comprehension the one that probes what the reader took from the book. A
//                 real transcript cites events by name, and the annotations on
//                 it are integrity evidence — so this asks for a spoiler-free
//                 summing-up rather than inventing plot the fixtures don't
//                 have. It is the one place here that is a stand-in.
import { rng, pick, between } from './data'

// Benny's opening move on an engagement talk, by how it went. Each names the
// title and asks about the experience of reading it — never about what happens
// in it.
const OPENERS = {
  green: [
    'Hi {name}! You just finished {title}. What did you think of it?',
    'Hi {name}! You logged {title} as finished — how was it?',
  ],
  yellow: [
    'Hi {name}! You finished {title}. How did that one go for you?',
    'Hi {name}! Tell me about {title} — did it hold you?',
  ],
  red: [
    'Hi {name}! You marked {title} as finished. How did you get on with it?',
    'Hi {name}! What did you make of {title}?',
  ],
}

const FOLLOW_UPS = [
  'Would you hand this one to a friend?',
  'What kept you turning the pages?',
  'Was it an easy read, or did you have to work at it?',
  'Did it remind you of anything else you have read?',
  'What are you going to pick up next?',
]

// The reader's side. Warm, thin, or grudging — a reading experience, told
// without claiming anything about the book's contents.
const ANSWERS = {
  green: [
    'I really liked it. I kept wanting to find out what happened, so I read way past when I meant to stop.',
    'It was so good. I finished it in about four days, which is fast for me.',
    'I loved it. I was telling my sister about it at dinner and she wants to read it now.',
    'Honestly one of my favourites this year. I did not expect to like it as much as I did.',
  ],
  yellow: [
    'It was okay. The start was slow but it got better once I was properly into it.',
    'I liked parts of it. Some bits dragged and I had to make myself keep going.',
    'It was fine. Not my favourite, but I am glad I finished it.',
  ],
  red: [
    'It was not really for me. I finished it but I was ready for it to be over.',
    'I did not love it. I kept picking other things up instead.',
    'It was hard to get into. I only finished because I had started it.',
  ],
}

const FOLLOW_ANSWERS = {
  green: [
    'Yes, definitely. I already know who I would give it to.',
    'I would. It is the kind you can hand to someone who says they do not like reading.',
    'Yes — I think a lot of people in my class would like it.',
  ],
  yellow: [
    'Maybe. It depends who. Some people would like it more than I did.',
    'Probably not to everyone, but to the right person, yes.',
  ],
  red: ['Probably not. I would give them something else first.', 'Not really, no.'],
}

// The annotations Benny leaves on an engagement talk — about the answer itself
// (its length, its warmth), never about whether it was right. `sentiment` and
// `text` are the shape SessionModal draws.
const NOTES = {
  green: ['Benny noted a long answer!', 'Benny noted positive sentiment!'],
  yellow: ['Benny noted a short answer.'],
  red: ['Benny noted a short answer.', 'Benny noted a hesitant response.'],
}

/* An integrity talk is about the log. Benny asks where and when, because that
   is what a log can be wrong about. */
const INTEGRITY_OPENERS = [
  'Hi {name}! You logged {mins} minutes on {title}. Tell me about that reading session.',
  'Hi {name}! {mins} minutes on {title} — where were you reading?',
]
const INTEGRITY_ANSWERS = [
  'I read at my nan’s while I was waiting for my mum. It was a long wait.',
  'On the bus there and back, and then a bit more before bed.',
  'In the library at lunch. It was raining so we were all inside anyway.',
  'At home after my homework. I lost track of the time, honestly.',
]
const INTEGRITY_FOLLOW = [
  'Did you read it all in one go, or in bits?',
  'Was that a normal amount for you, or more than usual?',
]
const INTEGRITY_FOLLOW_ANSWERS = [
  'In bits. I kept stopping and starting.',
  'All in one go. I did not want to put it down.',
  'More than usual. I had nothing else to do.',
]

/* A comprehension talk asks the reader to sum the book up. The real thing
   probes for specifics; these fixtures have no plot to probe, so the questions
   stay at the level a reader can answer about any book. */
const COMP_OPENERS = [
  'Hi {name}! You finished {title}. How would you describe it to someone who has not read it?',
  'Hi {name}! Sum {title} up for me, without giving the ending away.',
]
const COMP_ANSWERS = {
  green: [
    'It starts off feeling like one kind of story and then turns into something completely different. I did not see the ending coming at all.',
    'It is about someone who has to work something out on their own, and the whole book is them getting there. The ending made me go back and reread the start.',
  ],
  yellow: [
    'It is about a person who has a problem and then they sort it out. That is kind of it.',
    'Hard to say without spoiling it. Stuff happens and then it ends.',
  ],
  red: ['I do not really remember the middle part.', 'It was about a kid. I forget their name.'],
}
const COMP_FOLLOW = [
  'What part stayed with you after you finished?',
  'Was there a moment where you changed your mind about someone in it?',
]
const COMP_FOLLOW_ANSWERS = {
  green: [
    'The last chapter. I read it twice.',
    'Yes — I was sure I knew how it would go and I was wrong.',
  ],
  yellow: ['I liked the ending.', 'Not really, no.'],
  red: ['I am not sure.', 'I do not know.'],
}

const CONFIDENCE_BY_RATING = { green: 'high', yellow: 'moderate', red: 'low' }

const RATING_BY_ROLL = (r) => (r < 0.55 ? 'green' : r < 0.85 ? 'yellow' : 'red')

const MONTH_NO = {
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
}

const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)

/**
 * bookTalkSession({ reader, title, month, flagged }) → an SfR-shaped session.
 *
 * Seeded off the reader and the title, so the same talk reads the same way
 * every time the panel is opened — the rest of this prototype's numbers work
 * the same way.
 */
export function bookTalkSession({
  reader,
  title,
  month = 'Mar',
  flagged = false,
  kindId = 'engagement',
}) {
  const r = rng(`talk:${reader.id ?? reader.key}:${title.id}`)
  const rating = flagged ? 'yellow' : RATING_BY_ROLL(r())
  const minutes = between(r, 18, 55)
  const fill = (s) =>
    s
      .replace('{name}', reader.name.split(' ')[0])
      .replace('{title}', title.title)
      .replace('{mins}', minutes)
  const year = ['Sep', 'Oct', 'Nov', 'Dec'].includes(month) ? 2025 : 2026

  const turns =
    kindId === 'integrity'
      ? [
          { role: 'benny', text: fill(pick(r, INTEGRITY_OPENERS)) },
          { role: 'student', text: pick(r, INTEGRITY_ANSWERS) },
          { role: 'benny', text: pick(r, INTEGRITY_FOLLOW) },
          { role: 'student', text: pick(r, INTEGRITY_FOLLOW_ANSWERS) },
        ]
      : kindId === 'comprehension'
        ? [
            { role: 'benny', text: fill(pick(r, COMP_OPENERS)) },
            { role: 'student', text: pick(r, COMP_ANSWERS[rating]) },
            ...NOTES[rating].map((text) => ({
              role: 'annotation',
              sentiment: rating === 'green' ? 'positive' : 'neutral',
              text,
            })),
            { role: 'benny', text: pick(r, COMP_FOLLOW) },
            { role: 'student', text: pick(r, COMP_FOLLOW_ANSWERS[rating]) },
          ]
        : [
            { role: 'benny', text: fill(pick(r, OPENERS[rating])) },
            { role: 'student', text: pick(r, ANSWERS[rating]) },
            ...NOTES[rating].map((text) => ({
              role: 'annotation',
              sentiment: rating === 'green' ? 'positive' : 'neutral',
              text,
            })),
            { role: 'benny', text: pick(r, FOLLOW_UPS) },
            { role: 'student', text: pick(r, FOLLOW_ANSWERS[rating]) },
          ]
  const conversation = turns

  return {
    id: `ce-talk-${reader.id ?? reader.key}-${title.id}`,
    student: {
      id: reader.id ?? reader.key,
      name: reader.name,
      grade: reader.grade ? `${reader.grade}th` : '4th',
      class: 'Class A',
      initials: initials(reader.name),
      color: '#0F766E',
    },
    book: {
      title: title.title,
      author: title.author,
      color: '#0F766E',
      lexile: `${title.lexile}L`,
      published: title.addedYear,
      openlibrary: title.coverId,
    },
    date: `${year}-${MONTH_NO[month] ?? '03'}-${String(between(r, 3, 27)).padStart(2, '0')}`,
    kindId,
    type: flagged ? 'flagged' : 'engagement',
    status: 'completed',
    challenge: 'Winter Reading',
    // Only a comprehension talk reports a Reading Confidence — SfR's rule, and
    // `sessionConfidence` reads it off the kind.
    engagementRating: kindId === 'comprehension' ? null : rating,
    confidence: kindId === 'comprehension' ? CONFIDENCE_BY_RATING[rating] : undefined,
    minutesLogged: minutes,
    conversation,
    flags: [],
    positiveFlags: [],
  }
}
