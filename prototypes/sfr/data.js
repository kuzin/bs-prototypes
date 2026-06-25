// Sessions for Review — mock data for Classic and Readers library site

export const SITE = {
  name: 'Classic and Readers',
  admin: 'Ms. Reyes',
  warningThreshold: 50,
}

export const STUDENTS = [
  {
    id: 'stu-1',
    name: 'Tyler Williams',
    grade: '4th',
    class: 'Mrs. Johnson',
    initials: 'TW',
    color: '#E8866A',
  },
  {
    id: 'stu-2',
    name: 'Maya Chen',
    grade: '5th',
    class: 'Mr. Okafor',
    initials: 'MC',
    color: '#0DA7BC',
  },
  {
    id: 'stu-3',
    name: 'Marcus Davis',
    grade: '3rd',
    class: 'Mrs. Johnson',
    initials: 'MD',
    color: '#7C3AED',
  },
  {
    id: 'stu-4',
    name: 'Sofia Rodriguez',
    grade: '3rd',
    class: 'Mr. Kim',
    initials: 'SR',
    color: '#16A97A',
  },
  {
    id: 'stu-5',
    name: 'Jaylen Brown',
    grade: '5th',
    class: 'Mr. Okafor',
    initials: 'JB',
    color: '#F59E0B',
  },
  {
    id: 'stu-6',
    name: 'Emma Petersen',
    grade: '4th',
    class: 'Mrs. Johnson',
    initials: 'EP',
    color: '#EC4899',
  },
  {
    id: 'stu-7',
    name: 'Lily Thompson',
    grade: '5th',
    class: 'Mr. Kim',
    initials: 'LT',
    color: '#64748B',
  },
  {
    id: 'stu-8',
    name: 'Noah Kim',
    grade: '4th',
    class: 'Mrs. Johnson',
    initials: 'NK',
    color: '#1D4ED8',
  },
  {
    id: 'stu-9',
    name: 'Zara Ahmed',
    grade: '3rd',
    class: 'Mr. Okafor',
    initials: 'ZA',
    color: '#D97706',
  },
  {
    id: 'stu-10',
    name: 'Caleb Foster',
    grade: '5th',
    class: 'Mr. Kim',
    initials: 'CF',
    color: '#059669',
  },
]

const BOOKS = {
  charlottes_web: {
    title: "Charlotte's Web",
    author: 'E.B. White',
    color: '#E8866A',
    lexile: '680L',
    isbn: '978-0-06-440055-3',
    published: 1952,
    publisher: 'HarperCollins',
    format: 'Paperback',
    language: 'English',
    pageCount: 184,
  },
  wonder: {
    title: 'Wonder',
    author: 'R.J. Palacio',
    color: '#7C3AED',
    lexile: '790L',
    isbn: '978-0-375-86902-0',
    published: 2012,
    publisher: 'Knopf Books',
    format: 'Hardcover',
    language: 'English',
    pageCount: 315,
  },
  holes: {
    title: 'Holes',
    author: 'Louis Sachar',
    color: '#D97706',
    lexile: '660L',
    isbn: '978-0-440-41480-5',
    published: 1998,
    publisher: 'Yearling',
    format: 'Paperback',
    language: 'English',
    pageCount: 233,
  },
  the_giver: {
    title: 'The Giver',
    author: 'Lois Lowry',
    color: '#1D4ED8',
    lexile: '760L',
    isbn: '978-0-544-33649-5',
    published: 1993,
    publisher: 'HMH Books',
    format: 'Paperback',
    language: 'English',
    pageCount: 240,
  },
  hatchet: {
    title: 'Hatchet',
    author: 'Gary Paulsen',
    color: '#16A97A',
    lexile: '1020L',
    isbn: '978-1-4169-3647-7',
    published: 1987,
    publisher: 'Aladdin',
    format: 'Paperback',
    language: 'English',
    pageCount: 208,
  },
  harry_potter: {
    title: "Harry Potter and the Sorcerer's Stone",
    author: 'J.K. Rowling',
    color: '#EC4899',
    lexile: '880L',
    isbn: '978-0-439-70818-8',
    published: 1997,
    publisher: 'Scholastic',
    format: 'Paperback',
    language: 'English',
    pageCount: 309,
  },
  ivan: {
    title: 'The One and Only Ivan',
    author: 'Katherine Applegate',
    color: '#0DA7BC',
    lexile: '570L',
    isbn: '978-0-06-199255-6',
    published: 2012,
    publisher: 'HarperCollins',
    format: 'Paperback',
    language: 'English',
    pageCount: 320,
  },
  wimpy_kid: {
    title: 'Diary of a Wimpy Kid',
    author: 'Jeff Kinney',
    color: '#F59E0B',
    lexile: '950L',
    isbn: '978-0-8109-9313-6',
    published: 2007,
    publisher: 'Amulet Books',
    format: 'Hardcover',
    language: 'English',
    pageCount: 217,
  },
  island: {
    title: 'Island of the Blue Dolphins',
    author: "Scott O'Dell",
    color: '#059669',
    lexile: '1000L',
    isbn: '978-0-547-32879-1',
    published: 1960,
    publisher: 'HMH Books',
    format: 'Paperback',
    language: 'English',
    pageCount: 192,
  },
}

function student(id) {
  return STUDENTS.find((s) => s.id === id)
}

// ── Conversations ─────────────────────────────────────────────────────────────

const CONV_COPY_PASTE = [
  {
    role: 'benny',
    text: "Hi Tyler! I see you just finished Charlotte's Web. What was your favorite part of the story?",
  },
  {
    role: 'student',
    text: "Charlotte's Web is a classic children's novel written by E. B. White, published in 1952. It tells the story of a young girl named Fern Arable who befriends a pig named Wilbur.",
    flagged: true,
  },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a copied response.' },
  {
    role: 'benny',
    text: 'Hmm, that sounds like something you may have looked up. Can you tell me in your own words what YOU thought of the story?',
  },
  {
    role: 'student',
    text: 'The novel was first published on October 15, 1952, by Harper & Brothers. It has sold more than 45 million copies worldwide.',
    flagged: true,
  },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a copied response.' },
  {
    role: 'benny',
    text: "Tyler, I'm noticing your answers look like they came from a website. What did you personally think about how the story ended?",
  },
  {
    role: 'student',
    text: "Wilbur is saved from slaughter by Charlotte who writes words in her web. When Charlotte dies, Wilbur is devastated but Charlotte's children keep him company.",
    flagged: true,
  },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a copied response.' },
  {
    role: 'benny',
    text: 'Can you share something that surprised you or made you feel something while reading?',
  },
  {
    role: 'student',
    text: 'The book explores themes of friendship, love, and mortality as themes common in literature.',
    flagged: true,
  },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a copied response.' },
]

const CONV_GREEN_WONDER = [
  {
    role: 'benny',
    text: "Hi Caleb! I see you just finished Wonder. What moment surprised you most about Auggie's first year at school?",
  },
  {
    role: 'student',
    text: "I didn't expect Julian to be so mean right from the start. I thought kids would be curious first. But the part that really got me was when Jack punched Julian at Halloween — I definitely didn't see that coming!",
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted a long answer!' },
  {
    role: 'benny',
    text: 'That was a big moment! Why do you think Jack finally stood up for Auggie?',
  },
  {
    role: 'student',
    text: "I think he felt really guilty about what he'd said about Auggie behind his back. He realized Auggie was a real friend who deserved loyalty, not just pity.",
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted positive sentiment!' },
  {
    role: 'benny',
    text: "That's really thoughtful. What did the story make you think about how people treat others who are different?",
  },
  {
    role: 'student',
    text: 'It made me think about how we judge people before we know them. Auggie looked different on the outside but he was funny and smart and loyal. Julian never bothered to find that out.',
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted a long answer!' },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted a detailed response!' },
  { role: 'benny', text: 'Is there a character other than Auggie you connected with?' },
  {
    role: 'student',
    text: "Yeah, Via. She's always overshadowed because everyone focuses on Auggie and she never complains, but you can tell it's really hard for her. I think she's actually one of the bravest people in the book.",
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted positive sentiment!' },
]

const CONV_RED_WIMPY = [
  {
    role: 'benny',
    text: "Hey Lily! I see you've been reading Diary of a Wimpy Kid. What was Greg's big goal at the start of middle school?",
  },
  { role: 'student', text: 'To be popular I think.' },
  { role: 'annotation', sentiment: 'positive', text: 'Benny found no problems.' },
  {
    role: 'benny',
    text: 'Right! Can you tell me something specific he tried to do to become popular?',
  },
  { role: 'student', text: "I don't know, like, he did stuff at school.", flagged: true },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
  {
    role: 'benny',
    text: 'Do you remember anything that happened with Rowley or the Cheese Touch?',
  },
  { role: 'student', text: 'I remember the cheese thing.' },
  { role: 'annotation', sentiment: 'positive', text: 'Benny found no problems.' },
  { role: 'benny', text: 'What was the Cheese Touch about — why was everyone so afraid of it?' },
  { role: 'student', text: "If you touched the cheese you'd get it. It was bad.", flagged: true },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
  { role: 'benny', text: "What happened with Greg and Rowley's friendship during the book?" },
  {
    role: 'student',
    text: 'They fought. And then they were friends again I think.',
    flagged: true,
  },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
]

const CONV_YELLOW_GIVER = [
  {
    role: 'benny',
    text: "Hi Emma! You've been reading The Giver — a really interesting book. What's Jonas's community like at the start of the story?",
  },
  {
    role: 'student',
    text: "It's super controlled. Everyone has rules and their jobs assigned to them. It seems nice on the surface but it's kind of creepy.",
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny found no problems.' },
  { role: 'benny', text: 'What made it feel creepy to you?' },
  {
    role: 'student',
    text: "Like, they don't have real feelings? Or they can't see colors? I got a little confused about what exactly they could and couldn't feel.",
  },
  {
    role: 'annotation',
    sentiment: 'warning',
    text: 'The student took over one minute to respond.',
  },
  {
    role: 'benny',
    text: "That's understandable — it's a complex idea. What's Jonas's special role in the story?",
  },
  {
    role: 'student',
    text: "He's the... Receiver? I forget the exact title. He's the one who gets all the memories from the old man.",
    flagged: true,
  },
  {
    role: 'annotation',
    sentiment: 'warning',
    text: 'Did not reference specific facts from the book.',
  },
  { role: 'benny', text: 'The Receiver of Memory. What kinds of memories does he receive?' },
  {
    role: 'student',
    text: "Good and bad ones. Like snow and Christmas, and also war and pain. He's the only one who knows about them.",
  },
  {
    role: 'benny',
    text: 'What do you think the author is saying about memories and feelings through this story?',
  },
  {
    role: 'student',
    text: "I think it's saying that even sad things are important? Like you can't take away the bad without also losing the good.",
  },
]

const CONV_UNFINISHED_IVAN = [
  {
    role: 'benny',
    text: "Hi Zara! I see you've been reading The One and Only Ivan. What do you think about Ivan so far?",
  },
  {
    role: 'student',
    text: "He's really sad. He lives in the mall and he makes art but nobody really understands him.",
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny found no problems.' },
  { role: 'benny', text: "That's a great observation. What does Ivan want most in the story?" },
  {
    role: 'student',
    text: 'He wants to protect Ruby the baby elephant. And maybe get back somewhere that feels like home.',
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted a long answer!' },
  { role: 'benny', text: 'Why do you think Ivan feels so responsible for Ruby?' },
  {
    role: 'student',
    text: "Because he made a promise to her? I think he promised her mom. And because he knows what it's like to be trapped.",
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted a detailed response!' },
]

const CONV_MINIMAL_HOLES = [
  {
    role: 'benny',
    text: 'Hey Noah! I see you just finished Holes. What did you think about Camp Green Lake?',
  },
  { role: 'student', text: 'It was bad.', flagged: true },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
  { role: 'benny', text: 'Can you say a bit more? What made it feel bad?' },
  { role: 'student', text: 'They had to dig holes every day.', flagged: true },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
  {
    role: 'benny',
    text: 'What do you think the Warden was really looking for when she had the boys digging?',
  },
  { role: 'student', text: 'Treasure I think.', flagged: true },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
  { role: 'benny', text: 'What was Stanley like as a character? Did he change by the end?' },
  { role: 'student', text: 'Yeah. He was different at the end.', flagged: true },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
  { role: 'benny', text: 'How do you think his friendship with Zero affected him?' },
  { role: 'student', text: 'Made him brave or whatever.', flagged: true },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
]

const CONV_GREEN_HATCHET = [
  {
    role: 'benny',
    text: 'Hi Maya! You just finished Hatchet — quite an adventure! What was the most intense moment Brian faced in the wilderness?',
  },
  {
    role: 'student',
    text: "Probably when the moose attacked him. I was reading that part at recess and I couldn't put it down. But honestly the porcupine scene early on was also really scary because he was still so helpless.",
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted a long answer!' },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted a detailed response!' },
  { role: 'benny', text: 'What did those early struggles show you about Brian as a person?' },
  {
    role: 'student',
    text: "He's stubborn in a good way. He doesn't give up even when he fails over and over — like with the fire. He could have just sat there but instead he kept thinking and trying things.",
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted positive sentiment!' },
  {
    role: 'benny',
    text: "How did Brian's relationship with nature change from the beginning to the end?",
  },
  {
    role: 'student',
    text: "At first he's scared and confused by everything. By the end he can read the forest like a language — he knows what sounds mean danger, where to look for food, how the weather is changing. He sort of becomes part of it.",
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted a detailed response!' },
  {
    role: 'benny',
    text: "What do you think Brian learned about himself that he couldn't have learned any other way?",
  },
  {
    role: 'student',
    text: 'That he could actually survive on his own. I think before this he thought he needed other people to handle hard things. The wilderness proved he had more in him than he knew.',
  },
]

const CONV_RED_HARRY_POTTER = [
  {
    role: 'benny',
    text: "Hi Marcus! I see you've been reading Harry Potter and the Sorcerer's Stone. What house do you think you'd be sorted into?",
  },
  { role: 'student', text: 'Gryffindor I guess.' },
  { role: 'annotation', sentiment: 'positive', text: 'Benny found no problems.' },
  { role: 'benny', text: 'What made Gryffindor stand out to you in the book?' },
  { role: 'student', text: "Harry's in it.", flagged: true },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
  {
    role: 'benny',
    text: 'Can you tell me about a part of the story that you found really exciting?',
  },
  { role: 'student', text: 'The Quidditch part.', flagged: true },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
  { role: 'benny', text: 'What was happening in that Quidditch game that made it memorable?' },
  { role: 'student', text: 'Harry was flying and stuff.', flagged: true },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
  {
    role: 'benny',
    text: 'Who do you think was the most interesting villain in the story and why?',
  },
  { role: 'student', text: "Voldemort because he's the bad guy.", flagged: true },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
]

const CONV_YELLOW_CHARLOTTES = [
  {
    role: 'benny',
    text: "Hi Sofia! I see you've been reading Charlotte's Web. What do you think of the friendship between Wilbur and Charlotte?",
  },
  {
    role: 'student',
    text: "It's really nice. Charlotte really cares about Wilbur even though they're so different.",
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny found no problems.' },
  { role: 'benny', text: 'What did Charlotte do to try to save Wilbur?' },
  {
    role: 'student',
    text: "She wrote words in her web. Like 'Some Pig' and things like that. It made people think Wilbur was special.",
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny found no problems.' },
  { role: 'benny', text: 'Why do you think writing words in a web was so powerful?' },
  {
    role: 'student',
    text: "Because people believe what they read? I'm not totally sure. It worked though.",
  },
  {
    role: 'annotation',
    sentiment: 'warning',
    text: 'Did not reference specific facts from the book.',
  },
  { role: 'benny', text: 'What did you think about the ending of the book?' },
  {
    role: 'student',
    text: 'It was sad. I knew Charlotte was going to die but it still felt sad. I liked that her babies stayed with Wilbur though.',
  },
]

const CONV_FLAGGED_ISLAND = [
  {
    role: 'benny',
    text: "Hi Marcus! You've been reading Island of the Blue Dolphins. What was the hardest challenge Karana faced on the island?",
  },
  {
    role: 'student',
    text: "Island of the Blue Dolphins is a historical fiction novel by American author Scott O'Dell, published in 1960.",
    flagged: true,
  },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a copied response.' },
  {
    role: 'benny',
    text: 'Can you tell me that in your own words? What do YOU think was the hardest challenge for Karana?',
  },
  {
    role: 'student',
    text: 'She had to survive alone for many years after being left behind on a remote island in the Pacific Ocean.',
    flagged: true,
  },
  { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a copied response.' },
  {
    role: 'benny',
    text: 'I think you may be reading from a summary. What was a specific moment that stood out to you personally?',
  },
  { role: 'student', text: "I don't remember exactly.", flagged: true },
  {
    role: 'annotation',
    sentiment: 'warning',
    text: 'Benny flagged an inability to recall details.',
  },
  { role: 'benny', text: 'Did you finish reading the book?' },
  { role: 'student', text: 'Most of it.' },
  { role: 'annotation', sentiment: 'positive', text: 'Benny found no problems.' },
]

const CONV_GREEN_IVAN = [
  {
    role: 'benny',
    text: 'Hi Sofia! You finished The One and Only Ivan — what did you think about Ivan as a narrator?',
  },
  {
    role: 'student',
    text: "I liked that he was really honest. He notices things that people around him don't see, like how Julia draws from her heart and how Stella is slowly getting sicker.",
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted a detailed response!' },
  { role: 'benny', text: "What do you think Ivan's paintings mean to him?" },
  {
    role: 'student',
    text: "I think they're how he remembers his life before the mall. Like his family and the jungle. Even if he can't fully say those things, the paintings hold them.",
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted a long answer!' },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted positive sentiment!' },
  {
    role: 'benny',
    text: 'Why do you think Ivan kept his promise to Stella even after she was gone?',
  },
  {
    role: 'student',
    text: "Because that's what love is? He didn't make the promise to get something in return. He made it because it mattered to Stella, and Stella mattered to him. Keeping it was a way of still caring for her.",
  },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted a long answer!' },
  { role: 'annotation', sentiment: 'positive', text: 'Benny noted a detailed response!' },
]

// ── Crisis resources Benny can surface (safety signals) ───────────────────────
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

// ── Safety-signal conversations ───────────────────────────────────────────────
// SFR transcript shape + safety extras: student.trigger highlights the message
// that raised the signal; annotation.tone:'safety'; role:'resources' carries the
// crisis resources Benny showed the student inline.
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

// ── Sessions ──────────────────────────────────────────────────────────────────

let _id = 1
function sess(studentId, bookKey, overrides) {
  return { id: `sess-${_id++}`, student: student(studentId), book: BOOKS[bookKey], ...overrides }
}

function notif(role, name, channel, at, status) {
  return { role, name, channel, at, status }
}

// Safety-signal Book Talks — SFR-shaped, carrying an additive `safety` object.
function safetySess(studentId, bookKey, o) {
  const { safety, conversation, ...rest } = o
  return {
    id: `sess-${_id++}`,
    student: student(studentId),
    book: BOOKS[bookKey],
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

export const SESSIONS = [
  // Flagged sessions
  sess('stu-1', 'charlottes_web', {
    date: '2026-05-20',
    type: 'flagged',
    status: 'completed',
    challenge: 'Chapter Book Challenge',
    engagementRating: null,
    minutesLogged: 87,
    flags: [
      {
        id: 'f1',
        type: 'copy-paste',
        label: 'Copied response detected',
        description:
          "Student's responses appear to be copied from an external source rather than original writing.",
      },
      {
        id: 'f2',
        type: 'no-recall',
        label: 'Unable to recall plot details',
        description: "Student couldn't describe specific events or characters in their own words.",
      },
    ],
    positiveFlags: [],
    conversation: CONV_COPY_PASTE,
  }),
  sess('stu-8', 'holes', {
    date: '2026-05-19',
    type: 'flagged',
    status: 'completed',
    challenge: 'Chapter Book Challenge',
    engagementRating: null,
    minutesLogged: 92,
    flags: [
      {
        id: 'f3',
        type: 'minimal',
        label: 'Minimal engagement',
        description: 'Student gave very brief, low-effort responses throughout the conversation.',
      },
      {
        id: 'f4',
        type: 'no-recall',
        label: 'Unable to recall plot details',
        description: "Student couldn't describe specific characters or events from the book.",
      },
    ],
    positiveFlags: [],
    conversation: CONV_MINIMAL_HOLES,
  }),
  sess('stu-3', 'island', {
    date: '2026-05-18',
    type: 'flagged',
    status: 'completed',
    challenge: 'Summer Reading',
    engagementRating: null,
    minutesLogged: 74,
    flags: [
      {
        id: 'f5',
        type: 'copy-paste',
        label: 'Copied response detected',
        description: "Student's responses appear to be copied from a summary or external source.",
      },
    ],
    positiveFlags: [],
    conversation: CONV_FLAGGED_ISLAND,
  }),
  sess('stu-5', 'the_giver', {
    date: '2026-05-17',
    type: 'flagged',
    status: 'completed',
    challenge: 'Genre Explorer',
    engagementRating: null,
    minutesLogged: 68,
    flags: [
      {
        id: 'f6',
        type: 'unintelligible',
        label: 'Unintelligible responses',
        description: "Student's answers were unclear or unrelated to the book content.",
      },
      {
        id: 'f7',
        type: 'minimal',
        label: 'Minimal engagement',
        description: 'Student gave very brief, low-effort responses throughout the conversation.',
      },
    ],
    positiveFlags: [],
    conversation: [
      {
        role: 'benny',
        text: "Hi Jaylen! You've been reading The Giver. What was the Ceremony of Twelve like for Jonas?",
      },
      { role: 'student', text: 'It was a big deal.', flagged: true },
      { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
      { role: 'benny', text: 'What made it a big deal? What happened that was surprising?' },
      {
        role: 'student',
        text: 'He got skipped and then they called him at the end.',
        flagged: true,
      },
      { role: 'annotation', sentiment: 'warning', text: 'Benny flagged an unclear response.' },
      {
        role: 'benny',
        text: "What assignment did Jonas receive, and why was it different from everyone else's?",
      },
      { role: 'student', text: 'The memory keeper one.', flagged: true },
      { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
      { role: 'benny', text: 'What kind of memories has he received so far?' },
      { role: 'student', text: 'Happy ones and sad ones.', flagged: true },
      { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
    ],
  }),
  sess('stu-1', 'wonder', {
    date: '2026-05-15',
    type: 'flagged',
    status: 'completed',
    challenge: 'Chapter Book Challenge',
    engagementRating: null,
    minutesLogged: 79,
    flags: [
      {
        id: 'f8',
        type: 'copy-paste',
        label: 'Copied response detected',
        description: "Student's responses appear to be copied from an external source.",
      },
      {
        id: 'f9',
        type: 'unintelligible',
        label: 'Unintelligible responses',
        description: "Student's answers were unclear or unrelated to the book content.",
      },
    ],
    positiveFlags: [],
    conversation: [
      {
        role: 'benny',
        text: "Hi Tyler! I see you've been reading Wonder. What do you think makes Auggie such a memorable character?",
      },
      {
        role: 'student',
        text: 'Wonder is a 2012 middle grade novel by R. J. Palacio about a boy named August Pullman who has a facial difference.',
        flagged: true,
      },
      { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a copied response.' },
      {
        role: 'benny',
        text: 'Can you tell me that in your own words? What did YOU think about Auggie?',
      },
      {
        role: 'student',
        text: 'He attends a mainstream elementary school for the first time in fifth grade after being homeschooled.',
        flagged: true,
      },
      { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a copied response.' },
      {
        role: 'benny',
        text: 'Tyler, those answers look like they came from somewhere online. What did you personally think about the story?',
      },
      {
        role: 'student',
        text: 'The book won the Schneider Family Book Award and was adapted into a film in 2017.',
        flagged: true,
      },
      { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a copied response.' },
    ],
  }),

  // Engagement sessions
  sess('stu-10', 'wonder', {
    date: '2026-05-21',
    type: 'engagement',
    status: 'completed',
    challenge: 'Genre Explorer',
    engagementRating: 'green',
    minutesLogged: 55,
    flags: [],
    positiveFlags: [
      { id: 'pf1', type: 'positive-sentiment' },
      { id: 'pf2', type: 'answer-length' },
      { id: 'pf3', type: 'references-details' },
    ],
    conversation: CONV_GREEN_WONDER,
  }),
  sess('stu-2', 'hatchet', {
    date: '2026-05-20',
    type: 'engagement',
    status: 'completed',
    challenge: 'Genre Explorer',
    engagementRating: 'green',
    minutesLogged: 62,
    flags: [],
    positiveFlags: [
      { id: 'pf4', type: 'positive-sentiment' },
      { id: 'pf5', type: 'answer-length' },
      { id: 'pf6', type: 'makes-connection' },
    ],
    conversation: CONV_GREEN_HATCHET,
  }),
  sess('stu-4', 'ivan', {
    date: '2026-05-19',
    type: 'engagement',
    status: 'completed',
    challenge: 'Summer Reading',
    engagementRating: 'green',
    minutesLogged: 58,
    flags: [],
    positiveFlags: [
      { id: 'pf7', type: 'positive-sentiment' },
      { id: 'pf8', type: 'references-details' },
    ],
    conversation: CONV_GREEN_IVAN,
  }),
  sess('stu-6', 'the_giver', {
    date: '2026-05-20',
    type: 'engagement',
    status: 'completed',
    challenge: 'Chapter Book Challenge',
    engagementRating: 'yellow',
    minutesLogged: 48,
    flags: [
      {
        id: 'ef7',
        type: 'no-recall',
        label: 'Unable to recall plot details',
        description: "Student couldn't recall the title of Jonas's role in the community.",
      },
    ],
    positiveFlags: [{ id: 'pf9', type: 'references-details' }],
    conversation: CONV_YELLOW_GIVER,
  }),
  sess('stu-4', 'charlottes_web', {
    date: '2026-05-17',
    type: 'engagement',
    status: 'completed',
    challenge: 'Summer Reading',
    engagementRating: 'yellow',
    minutesLogged: 44,
    flags: [
      {
        id: 'ef8',
        type: 'no-recall',
        label: 'Unable to recall plot details',
        description: "Student was unsure why Charlotte's web words were effective.",
      },
      {
        id: 'ef9',
        type: 'unintelligible',
        label: 'Unintelligible response',
        description: 'One response was unclear and lacked specific book references.',
      },
    ],
    positiveFlags: [{ id: 'pf10', type: 'positive-sentiment' }],
    conversation: CONV_YELLOW_CHARLOTTES,
  }),
  sess('stu-6', 'harry_potter', {
    date: '2026-05-16',
    type: 'engagement',
    status: 'completed',
    challenge: 'Chapter Book Challenge',
    engagementRating: 'yellow',
    minutesLogged: 51,
    flags: [
      {
        id: 'ef6',
        type: 'no-recall',
        label: 'Unable to recall plot details',
        description:
          "Student's final response was unclear and didn't reference specific book content.",
      },
    ],
    positiveFlags: [
      { id: 'pf11', type: 'positive-sentiment' },
      { id: 'pf12', type: 'makes-connection' },
    ],
    conversation: [
      {
        role: 'benny',
        text: "Hi Emma! You've been reading Harry Potter and the Sorcerer's Stone. What did you think about the moment Harry found out he was a wizard?",
      },
      {
        role: 'student',
        text: "It was exciting. He's been treated so badly by the Dursleys and suddenly he has this whole other life he didn't know about.",
      },
      {
        role: 'benny',
        text: 'What do you think Hogwarts represents for Harry compared to his life on Privet Drive?',
      },
      {
        role: 'student',
        text: "It's like he finally belongs somewhere. He finally has friends and people who are glad he exists.",
      },
      { role: 'benny', text: 'What did you think about Hermione in the beginning of the book?' },
      {
        role: 'student',
        text: 'She was kind of annoying at first but then she became one of my favorites. I could relate to her trying too hard.',
      },
      { role: 'annotation', sentiment: 'positive', text: 'Benny noted positive sentiment!' },
      {
        role: 'benny',
        text: 'What do you think was the biggest lesson Harry learned in his first year?',
      },
      {
        role: 'student',
        text: "Maybe that love is a kind of magic? Like his mom's love protected him. I'd have to think more about that one.",
        flagged: true,
      },
      {
        role: 'annotation',
        sentiment: 'warning',
        text: 'Benny flagged an inability to recall details.',
      },
    ],
  }),
  sess('stu-7', 'wimpy_kid', {
    date: '2026-05-21',
    type: 'engagement',
    status: 'completed',
    challenge: 'Genre Explorer',
    engagementRating: 'red',
    minutesLogged: 38,
    flags: [
      {
        id: 'ef1',
        type: 'minimal',
        label: 'Minimal engagement',
        description: 'Student gave very brief, low-effort responses throughout the conversation.',
      },
      {
        id: 'ef2',
        type: 'no-recall',
        label: 'Unable to recall plot details',
        description: "Student couldn't describe specific events or characters from the book.",
      },
    ],
    positiveFlags: [],
    conversation: CONV_RED_WIMPY,
  }),
  sess('stu-3', 'harry_potter', {
    date: '2026-05-18',
    type: 'engagement',
    status: 'completed',
    challenge: 'Summer Reading',
    engagementRating: 'red',
    minutesLogged: 41,
    flags: [
      {
        id: 'ef3',
        type: 'minimal',
        label: 'Minimal engagement',
        description: 'Student gave very brief, low-effort responses throughout the conversation.',
      },
    ],
    positiveFlags: [],
    conversation: CONV_RED_HARRY_POTTER,
  }),
  sess('stu-5', 'hatchet', {
    date: '2026-05-16',
    type: 'engagement',
    status: 'completed',
    challenge: 'Genre Explorer',
    engagementRating: 'red',
    minutesLogged: 35,
    flags: [
      {
        id: 'ef4',
        type: 'minimal',
        label: 'Minimal engagement',
        description: 'Student gave very brief, low-effort responses throughout the conversation.',
      },
      {
        id: 'ef5',
        type: 'quit-early',
        label: 'Did not complete',
        description: 'Student appeared to stop engaging before the conversation was finished.',
      },
    ],
    positiveFlags: [],
    conversation: [
      {
        role: 'benny',
        text: "Hey Jaylen! You've been reading Hatchet. What happened when Brian's plane went down?",
      },
      { role: 'student', text: 'The pilot died and he crashed in a lake.' },
      { role: 'annotation', sentiment: 'positive', text: 'Benny found no problems.' },
      { role: 'benny', text: 'How did Brian feel in the first days after the crash?' },
      { role: 'student', text: 'Scared I guess.', flagged: true },
      { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
      {
        role: 'benny',
        text: "What was Brian's most important survival tool, other than his hatchet?",
      },
      { role: 'student', text: "I don't know.", flagged: true },
      {
        role: 'annotation',
        sentiment: 'warning',
        text: 'Benny flagged an inability to recall details.',
      },
      { role: 'benny', text: 'Did you finish reading the book?' },
      { role: 'student', text: 'Most of it.', flagged: true },
      { role: 'annotation', sentiment: 'warning', text: 'Benny flagged a minimal response.' },
    ],
  }),

  // Unfinished
  sess('stu-9', 'ivan', {
    date: '2026-05-19',
    type: 'engagement',
    status: 'unfinished',
    challenge: 'Summer Reading',
    engagementRating: null,
    minutesLogged: 66,
    flags: [],
    positiveFlags: [],
    conversation: CONV_UNFINISHED_IVAN,
  }),
  sess('stu-2', 'charlottes_web', {
    date: '2026-05-15',
    type: 'engagement',
    status: 'unfinished',
    challenge: 'Genre Explorer',
    engagementRating: null,
    minutesLogged: 61,
    flags: [],
    positiveFlags: [],
    conversation: [
      {
        role: 'benny',
        text: "Hi Maya! You've been reading Charlotte's Web. What do you think of Charlotte as a character?",
      },
      {
        role: 'student',
        text: "She's incredibly smart and she uses her skills to help someone she loves. I really like that she doesn't make a big deal about it.",
      },
      { role: 'benny', text: 'What do you think drives Charlotte to help Wilbur so much?' },
      {
        role: 'student',
        text: "Genuine friendship. She's not getting anything from it. It's just what you do for someone you care about.",
      },
    ],
  }),

  // ── Safety signals — Book Talks carrying an additive `safety` object ──
  // Critical
  safetySess('stu-2', 'the_giver', {
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
  safetySess('stu-5', 'hatchet', {
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
  safetySess('stu-3', 'wonder', {
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
  // Warning
  safetySess('stu-1', 'holes', {
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
        by: 'Ms. Reyes',
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
  safetySess('stu-6', 'charlottes_web', {
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
  safetySess('stu-4', 'ivan', {
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
  // Possible
  safetySess('stu-8', 'the_giver', {
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
  safetySess('stu-7', 'wimpy_kid', {
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
  safetySess('stu-9', 'wonder', {
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
]

// ── Helpers ───────────────────────────────────────────────────────────────────
export const isSafety = (s) => !!s.safety
export const isSafetyOpen = (s) => s.safety && s.safety.status !== 'resolved'
