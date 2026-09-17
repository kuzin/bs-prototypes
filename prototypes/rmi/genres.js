// Genre recommendations per motivation type, from the RMI toolkit's "Genre
// Recommendations" sheet — three genres for each of the ten personas, each with
// the reason it suits them. Keyed by factor, since that's what the engine
// scores and what `topThreeFactors` returns.
//
// `mystery` has none: it isn't a persona with a reading taste, it's the absence
// of a clear one, so there is nothing to recommend against.

export const GENRES_BY_FACTOR = {
  confidence: [
    {
      name: 'Epic Fantasy',
      why: 'Appeals to their love for grand leadership, quests, and classic "good vs. evil" struggles (e.g., Chronicles of Narnia, Percy Jackson).',
    },
    {
      name: 'Historical Fiction',
      why: 'Offers a look at powerful historical figures, young leaders, and legacies of the past.',
    },
    {
      name: 'Biographies of Leaders',
      why: 'Provides real-life examples of strength, leadership, and influential lives they can look up to.',
    },
  ],
  challenge: [
    {
      name: 'Dystopian/Sci-Fi',
      why: 'Provides high-stakes, fast-paced environments that keep them engaged and moving forward (e.g., The Hunger Games).',
    },
    {
      name: 'Survival/Adventure',
      why: 'Satisfies their desire to see characters overcome immense odds and complex challenges.',
    },
    {
      name: 'Realistic Fiction (Complex Themes)',
      why: 'Offers intellectual depth and sophisticated character growth without being dry.',
    },
  ],
  curiosity: [
    {
      name: 'Mystery/Whodunit',
      why: 'Directly engages their desire to solve puzzles, find clues, and uncover hidden truths.',
    },
    {
      name: 'Puzzle/Interactive Books',
      why: 'Books like "Choose Your Own Adventure" or escape-room style books that let them participate in the logic.',
    },
    {
      name: 'Narrative Non-Fiction',
      why: 'Appeals to their need for factual information, especially books about historical mysteries, forensics, or how things work.',
    },
  ],
  enjoyment: [
    {
      name: 'Graphic Novels & Manga',
      why: 'Combines visual storytelling with dynamic narratives, perfect for high engagement and fandom culture.',
    },
    {
      name: 'Series/Franchise Books',
      why: 'Allows for complete immersion in expansive worlds with dedicated fanbases (e.g., Harry Potter, Wings of Fire).',
    },
    {
      name: 'Media Tie-ins',
      why: 'Books based on their favorite video games, movies, or shows.',
    },
  ],
  importance: [
    {
      name: 'Social Issues/Realistic Fiction',
      why: 'Aligns with their desire to protect others, understand empathy, and advocate for a better world.',
    },
    {
      name: 'Animal Rescue/Nature Books',
      why: 'Appeals to their nurturing side and desire to care for the vulnerable.',
    },
    {
      name: 'Historical Fiction (Civil Rights)',
      why: 'Focuses on individuals who stood up for their values and helped others.',
    },
  ],
  compliance: [
    {
      name: 'Short Story Collections',
      why: 'Provides a complete and satisfying narrative arc in a shorter, more efficient format.',
    },
    {
      name: 'Hi-Lo Books (High Interest, Low Readability)',
      why: 'Fast-paced, engaging books that are quick to finish, giving them a sense of accomplishment.',
    },
    {
      name: 'Graphic Novels',
      why: 'Offers a visual, fast-moving format that is highly rewarding to complete.',
    },
  ],
  recognition: [
    {
      name: 'Trending/New Releases',
      why: 'Keeps them in the loop with what is currently popular and highly discussed among their peers.',
    },
    {
      name: 'Books with Movie/TV Adaptations',
      why: 'Connects their reading to broader pop culture conversations.',
    },
    {
      name: 'School/Social Dynamics Fiction',
      why: 'Reflects their interest in modern trends, friendships, and social relevance.',
    },
  ],
  grades: [
    {
      name: 'Informational Texts/Encyclopedias',
      why: 'Satisfies a rigorous need for learning, collecting facts, and deep-diving into specific topics (e.g., DK Eyewitness books).',
    },
    {
      name: 'STEM Deep-Dives',
      why: 'Highly detailed books about space, dinosaurs, technology, or history.',
    },
    {
      name: 'Highly Accurate Historical Fiction',
      why: 'Provides a narrative context for understanding specific eras and events with factual precision.',
    },
  ],
  social: [
    {
      name: 'Friendship/School Stories',
      why: 'Focuses on emotional connections, peer relationships, and the beauty of human interaction.',
    },
    {
      name: 'Humor/Diary-Format Books',
      why: 'Offers light, energetic, and highly relatable stories (e.g., Diary of a Wimpy Kid).',
    },
    {
      name: 'Lighthearted Contemporary Fiction',
      why: 'Reflects modern life and relatable, everyday experiences without heavy stakes.',
    },
  ],
  competition: [
    {
      name: 'Sports Fiction',
      why: 'Mirrors the thrill of competition, teamwork, and the drive for victory.',
    },
    {
      name: 'Tournament/Competition Books',
      why: 'Provides high-energy quests where characters must train and compete to win.',
    },
    {
      name: 'Biographies of Athletes/Innovators',
      why: 'Offers inspiration through the stories of high-achievers who worked hard to reach the top of their fields.',
    },
  ],
}

/**
 * What each toolkit genre means in the book catalogue's own vocabulary.
 *
 * The toolkit names shelves the way a librarian talks — "Epic Fantasy",
 * "Hi-Lo Books (High Interest, Low Readability)" — while a catalogue record
 * carries flatter tags. This is the join between them, and it's what makes the
 * genre recommendations *drive* the title recommendations rather than sit
 * beside them: a motivation type has three genres, each genre covers some tags,
 * and a title that carries one of those tags is a candidate for that type.
 *
 * In the product this is the "RMI Type association" the doc asks JRC to add to
 * Book Contexts. Deriving it from genre here means a catalogue of 55 books
 * needs no new metadata to demonstrate the mechanism.
 */
export const BOOK_TAGS_BY_GENRE = {
  'Epic Fantasy': ['Fantasy', 'Adventure'],
  'Historical Fiction': ['Historical'],
  'Biographies of Leaders': ['Memoir', 'Nonfiction'],
  'Dystopian/Sci-Fi': ['Dystopian', 'Sci-Fi'],
  'Survival/Adventure': ['Survival', 'Adventure'],
  'Realistic Fiction (Complex Themes)': ['Realistic Fiction'],
  'Mystery/Whodunit': ['Mystery'],
  'Puzzle/Interactive Books': ['Mystery', 'Adventure'],
  'Narrative Non-Fiction': ['Nonfiction', 'Science'],
  'Graphic Novels & Manga': ['Graphic Novel'],
  'Series/Franchise Books': ['Fantasy', 'Adventure'],
  'Media Tie-ins': ['Graphic Novel', 'Fantasy'],
  'Social Issues/Realistic Fiction': ['Realistic Fiction', 'Current Events'],
  'Animal Rescue/Nature Books': ['Animals'],
  'Historical Fiction (Civil Rights)': ['Historical'],
  'Short Story Collections': ['Humor', 'Realistic Fiction'],
  'Hi-Lo Books (High Interest, Low Readability)': ['Graphic Novel', 'Humor'],
  'Graphic Novels': ['Graphic Novel'],
  'Trending/New Releases': ['Fantasy', 'Realistic Fiction'],
  'Books with Movie/TV Adaptations': ['Fantasy', 'Sci-Fi'],
  'School/Social Dynamics Fiction': ['Realistic Fiction', 'Humor'],
  'Informational Texts/Encyclopedias': ['Nonfiction', 'Science'],
  'STEM Deep-Dives': ['Science', 'Sci-Fi'],
  'Highly Accurate Historical Fiction': ['Historical'],
  'Friendship/School Stories': ['Realistic Fiction'],
  'Humor/Diary-Format Books': ['Humor'],
  'Lighthearted Contemporary Fiction': ['Realistic Fiction', 'Humor'],
  'Sports Fiction': ['Sports'],
  'Tournament/Competition Books': ['Sports', 'Adventure'],
  'Biographies of Athletes/Innovators': ['Memoir', 'Nonfiction', 'Sports'],
}

/**
 * A glyph per genre, from the shared `<Icon>` registry.
 *
 * Thirty shelf names is a wall of text, and the three a reader is pointed at
 * have to be told apart at a glance — the icon is what makes a genre card read
 * as a shelf rather than as a paragraph with a bold first line. Literal where a
 * genre has an obvious object (a sword, a trophy, a gamepad), and the nearest
 * honest stand-in where it doesn't.
 */
export const GENRE_ICONS = {
  'Epic Fantasy': 'sword',
  'Historical Fiction': 'building-castle',
  'Biographies of Leaders': 'crown',
  'Dystopian/Sci-Fi': 'rocket',
  'Survival/Adventure': 'mountain',
  'Realistic Fiction (Complex Themes)': 'heart-handshake',
  'Mystery/Whodunit': 'fingerprint',
  'Puzzle/Interactive Books': 'puzzle',
  'Narrative Non-Fiction': 'news',
  'Graphic Novels & Manga': 'messages',
  'Series/Franchise Books': 'books',
  'Media Tie-ins': 'device-gamepad',
  'Social Issues/Realistic Fiction': 'users',
  'Animal Rescue/Nature Books': 'paw',
  'Historical Fiction (Civil Rights)': 'flag',
  'Short Story Collections': 'file-text',
  'Hi-Lo Books (High Interest, Low Readability)': 'bolt',
  'Graphic Novels': 'layout-grid',
  'Trending/New Releases': 'trending-up',
  'Books with Movie/TV Adaptations': 'movie',
  'School/Social Dynamics Fiction': 'school',
  'Informational Texts/Encyclopedias': 'book-2',
  'STEM Deep-Dives': 'flask',
  'Highly Accurate Historical Fiction': 'hourglass',
  'Friendship/School Stories': 'friends',
  'Humor/Diary-Format Books': 'mood-happy',
  'Lighthearted Contemporary Fiction': 'sun',
  'Sports Fiction': 'ball-basketball',
  'Tournament/Competition Books': 'trophy',
  'Biographies of Athletes/Innovators': 'medal',
}
