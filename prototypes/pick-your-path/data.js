// ─── Pick Your Path — sample data ────────────────────────────────────────────
// Models the "Background Knowledge Engine" proposal: a teacher sets an academic
// Destination (a Tier-1 standard), and students pick a high-interest Path to
// build the background knowledge for it, then read titles + do offline
// extension activities to earn badges.
//
// The Forces & Motion destination, the three path taglines, and the three
// extension activities use the EXACT copy from the proposal's step-by-step flow.

import badgeReading from './assets/badges/reading.png'
import badgeCapstone from './assets/badges/capstone.png'
import badgeSports1 from './assets/badges/a-sports-1.png'
import badgeSports2 from './assets/badges/a-sports-2.png'
import badgeEng1 from './assets/badges/a-eng-1.png'
import badgeEng2 from './assets/badges/a-eng-2.png'
import badgeAnimals1 from './assets/badges/a-animals-1.png'
import badgeAnimals2 from './assets/badges/a-animals-2.png'
import bannerSports from './assets/paths/sports.webp'
import bannerEngineering from './assets/paths/engineering.webp'
import bannerAnimals from './assets/paths/animals.webp'
import bannerDestination from './assets/paths/destination.webp'

// Real book covers, via Open Library's cover CDN by numeric cover id (found by
// looking up each ISBN below; note the id-based endpoint — /b/id/{id}-L.jpg —
// not the /b/isbn/ redirect endpoint, which frequently 404s even for editions
// that do have art). Titles without a verified id fall back to CoverTile's
// designed gradient placeholder.
function olCover(id) {
  return id ? `https://covers.openlibrary.org/b/id/${id}-L.jpg` : undefined
}

// Generated flat-vector art (see assets/). Badge art keyed by activity id,
// plus the shared reading + capstone medallions.
export const BADGE_ART = {
  reading: badgeReading,
  capstone: badgeCapstone,
  'a-sports-1': badgeSports1,
  'a-sports-2': badgeSports2,
  'a-eng-1': badgeEng1,
  'a-eng-2': badgeEng2,
  'a-animals-1': badgeAnimals1,
  'a-animals-2': badgeAnimals2,
}
const PATH_BANNERS = {
  sports: bannerSports,
  engineering: bannerEngineering,
  animals: bannerAnimals,
}

export const SITE = {
  school: 'Lincoln Elementary',
  teacher: { name: 'Mr. Reyes', role: 'Grade 4 Teacher', initials: 'JR' },
  classroom: 'Room 14 · Grade 4',
  student: { name: 'Maya Chen', firstName: 'Maya', grade: 'Grade 4', initials: 'MC' },
}

// The academic destination the teacher assigns (a Tier-1 science standard).
export const DESTINATION = {
  id: 'forces-and-motion',
  subject: 'Science',
  standard: 'Core Science Standard',
  title: 'Forces & Motion',
  color: '#0F766E',
  banner: bannerDestination,
  blurb:
    'Every path below builds the same background knowledge for Forces & Motion — students just get to pick the subject that excites them.',
}

// Other destinations shown in the teacher picker (only Forces & Motion is wired
// up for this prototype — the rest illustrate the Tier-1 catalog).
export const DESTINATION_CATALOG = [
  {
    id: 'forces-and-motion',
    subject: 'Science',
    title: 'Forces & Motion',
    icon: 'atom',
    ready: true,
  },
  {
    id: 'ecosystems',
    subject: 'Science',
    title: 'Ecosystems & Habitats',
    icon: 'leaf',
    ready: false,
  },
  { id: 'matter', subject: 'Science', title: 'States of Matter', icon: 'bolt', ready: false },
  {
    id: 'branches-of-gov',
    subject: 'Social Studies',
    title: 'Branches of Government',
    icon: 'building',
    ready: false,
  },
  { id: 'weather', subject: 'Science', title: 'Weather & Climate', icon: 'sun', ready: false },
  {
    id: 'ancient-civ',
    subject: 'Social Studies',
    title: 'Ancient Civilizations',
    icon: 'building-community',
    ready: false,
  },
]

// The three interest paths. Taglines are verbatim from the proposal.
export const PATHS = [
  {
    id: 'sports',
    name: 'The Sports Path',
    tagline: 'The physics of snowboarding and curveballs.',
    icon: 'run',
    color: '#EA580C',
    titles: [
      {
        id: 's1',
        title: 'Snowboarding',
        author: 'Matt Doeden',
        isbn: '9780736827317',
        cover: olCover(4307487),
        level: 'Grade 3–6',
        pages: 31,
        blurb:
          'The moves, gear, and history behind one of the world’s most thrilling winter sports.',
      },
      {
        id: 's2',
        title: 'The Science of Baseball with Max Axiom, Super Scientist',
        author: 'David L. Dreier',
        isbn: '9781491460870',
        cover: olCover(12677009),
        level: 'Grade 3–6',
        pages: 32,
        blurb:
          'Super scientist Max Axiom breaks down the physics behind pitching, hitting, and fielding.',
      },
      {
        id: 's3',
        title: 'Skateboarding Vert',
        author: 'Patrick G. Cain',
        isbn: '9781467710855',
        cover: olCover(10349858),
        level: 'Grade 2–5',
        pages: 32,
        blurb: 'The tricks, gear, and physics behind skating ramps and halfpipes.',
      },
    ],
    activities: [
      {
        id: 'a-sports-1',
        name: 'Equipment Designer',
        short: 'Design a piece of sports gear that uses physics to help an athlete.',
        icon: 'pencil',
        prompt:
          'Choose your favorite sport. Design a piece of gear (like a helmet, a sneaker, or a paddle) that uses physics to make an athlete faster or safer. Draw your design on a piece of paper and label the special features.',
        requirement: 'Write down the name of your invention and one way it helps an athlete.',
        placeholder:
          'e.g. The GripMax sneaker — the deep treads add friction so sprinters don’t slip on the turn.',
      },
      {
        id: 'a-sports-2',
        name: 'Bounce Lab',
        short: 'Drop a ball onto three surfaces and compare how high it bounces.',
        icon: 'ball-basketball',
        prompt:
          'Grab a ball that bounces. Drop it from the same height onto three different surfaces (like tile, carpet, and grass). Watch closely to see how high it bounces back each time.',
        requirement:
          'Which surface gave the biggest bounce, and what does that tell you about the force pushing the ball back up?',
        placeholder: 'e.g. Tile gave the biggest bounce because…',
      },
    ],
  },
  {
    id: 'engineering',
    name: 'The Engineering Path',
    tagline: 'The mechanics of monster trucks and roller coasters.',
    icon: 'tools',
    color: '#2563EB',
    titles: [
      {
        id: 'e1',
        title: 'Forces and Motion Investigations',
        author: 'Karen Latchana Kenney',
        isbn: '9781512449570',
        // No verified cover art on Open Library for this edition — falls back
        // to CoverTile's designed placeholder.
        level: 'Grade 4–8',
        pages: 32,
        blurb:
          'Hands-on investigations into how forces make things speed up, slow down, and change direction.',
      },
      {
        id: 'e2',
        title: 'Monster Trucks',
        author: 'Kristin L. Nelson',
        isbn: '9780822506911',
        cover: olCover(1559234),
        level: 'Grade 2–5',
        pages: 32,
        blurb: 'How these oversized trucks are built to crush cars and fly through the air.',
      },
      {
        id: 'e3',
        title: 'Building a Roller Coaster',
        author: 'Karen Latchana Kenney',
        isbn: '9781681523507',
        cover: olCover(9210529),
        level: 'Grade K–3',
        pages: 24,
        blurb: 'Step-by-step, how a roller coaster goes from blueprint to a real thrill ride.',
      },
    ],
    activities: [
      {
        id: 'a-eng-1',
        name: 'The Friction Test',
        short: 'Roll a toy across three surfaces to see which stops it fastest.',
        icon: 'ruler',
        prompt:
          'Find a small ball or toy car. Roll it across three different surfaces (like a hardwood floor, a carpet, and outside on grass or concrete). Use a tape measure or count your footsteps to see which surface made the toy stop the fastest.',
        requirement:
          'Enter the surface that had the most friction and explain why you think it slowed the toy down.',
        placeholder: 'e.g. The carpet had the most friction because…',
      },
      {
        id: 'a-eng-2',
        name: 'Ramp Racer',
        short: 'Build a ramp and test how its height changes how far a car rolls.',
        icon: 'gauge',
        prompt:
          'Prop up a book or board to build a ramp. Roll a toy car down from a low height, then raise the ramp higher and try again. Mark how far the car travels each time.',
        requirement:
          'Which ramp height sent the car the farthest, and why do you think a higher ramp changed the car’s speed?',
        placeholder: 'e.g. The tall ramp sent it farthest because…',
      },
    ],
  },
  {
    id: 'animals',
    name: 'The Animal Path',
    tagline: 'How cheetahs and peregrine falcons achieve extreme speeds.',
    icon: 'paw',
    color: '#16A34A',
    titles: [
      {
        id: 'n1',
        title: 'Cheetahs',
        author: 'Jody Sullivan Rake',
        isbn: '9780736813938',
        cover: olCover(1365889),
        level: 'Grade 1–3',
        pages: 24,
        blurb: 'How the fastest land animal is built for a full-speed sprint.',
      },
      {
        id: 'n2',
        title: 'Peregrine Falcon',
        author: 'Josh Plattner',
        isbn: '9781629696720',
        cover: olCover(12515574),
        level: 'Grade 1–4',
        pages: 24,
        blurb: 'Meet the bird that dives faster than any other animal on Earth.',
      },
      {
        id: 'n3',
        title: "World's Fastest Animals",
        author: 'Melissa Stewart',
        isbn: '9781454906339',
        cover: olCover(10277532),
        level: 'Grade 2–5',
        pages: 32,
        blurb: 'A tour of the fastest sprinters, flyers, and swimmers in the animal kingdom.',
      },
    ],
    activities: [
      {
        id: 'a-animals-1',
        name: 'Dash & Freeze',
        short: 'Sprint to a line, then freeze — and feel your momentum keep pulling you.',
        icon: 'bolt',
        prompt:
          'Test your predator agility with a real-life freeze-frame challenge. Pick a finish line about 15 steps away. Sprint as fast as you can toward it, but the exact split-second your foot crosses the line, you must completely freeze like a statue. Notice how your momentum tries to pull you forward.',
        requirement:
          'Did you manage to freeze perfectly on the line, or did your momentum make you take a few extra stumble-steps forward?',
        placeholder: 'e.g. My momentum pulled me two steps past the line because…',
      },
      {
        id: 'a-animals-2',
        name: 'Reaction Race',
        short: 'Catch a dropped ruler to test how fast your reflexes are.',
        icon: 'run',
        prompt:
          'Have a partner hold a ruler straight up and drop it without warning between your open fingers. Catch it as fast as you can and see which number you grabbed. Try it five times.',
        requirement:
          'Did your catches get quicker with practice? How do fast animals like cheetahs use quick reactions to catch their prey?',
        placeholder: 'e.g. I caught it lower each time, which means…',
      },
    ],
  },
]

// Attach each path's generated theme banner (titles already carry their own
// real cover art above).
PATHS.forEach((p) => {
  p.banner = PATH_BANNERS[p.id]
})

export const PATH_BY_ID = Object.fromEntries(PATHS.map((p) => [p.id, p]))

// Seed the student demo so the destination page opens with real progress
// (matches the proposal example: "read 2 of 3", activities still to do).
export const SEED = {
  chosenPathId: 'sports',
  readTitleIds: ['s1', 's2'], // 2 of 3 read
  doneActivityIds: [], // 0 of 2 done — the student completes these live
  streak: 5,
}

// ─── Badge model ──────────────────────────────────────────────────────────────
// Badges are derived from progress so there's one source of truth. A path shows:
//   • one reading badge     — per title, earned as soon as that title is read
//   • one activity badge    — per extension activity by default, but an
//     activity can name another activity's id as its `badgeId` to join that
//     badge instead; the badge is earned once every activity in its group is
//     done (typically a group of one)
//   • one destination badge — the capstone, earned when everything is done

export function badgesForPath(path, readTitleIds, doneActivityIds) {
  const read = new Set(readTitleIds)
  const done = new Set(doneActivityIds)
  const allRead = path.titles.every((t) => read.has(t.id))
  const allDone = path.activities.every((a) => done.has(a.id))

  const reading = path.titles.map((t) => ({
    id: `badge-read-${t.id}`,
    kind: 'reading',
    name: t.title,
    sub: 'Nonfiction title',
    icon: 'book',
    art: BADGE_ART.reading,
    color: path.color,
    earned: read.has(t.id),
  }))

  const activityGroups = new Map()
  for (const a of path.activities) {
    const badgeId = a.badgeId ?? a.id
    if (!activityGroups.has(badgeId)) activityGroups.set(badgeId, [])
    activityGroups.get(badgeId).push(a)
  }

  const activity = [...activityGroups].map(([badgeId, group]) => {
    const lead = group[0] // a shared badge takes its name/icon from the first activity in its group
    return {
      id: `badge-${badgeId}`,
      kind: 'activity',
      name: lead.name,
      sub: group.length > 1 ? `Complete ${group.length} activities` : 'Extension activity',
      icon: lead.icon,
      art: BADGE_ART[badgeId],
      color: path.color,
      earned: group.every((a) => done.has(a.id)),
    }
  })

  const capstone = {
    id: `badge-dest-${path.id}`,
    kind: 'destination',
    name: 'Forces & Motion Explorer',
    sub: 'Finish reading + all activities',
    icon: 'atom',
    art: BADGE_ART.capstone,
    color: DESTINATION.color,
    earned: allRead && allDone,
  }

  return [...reading, ...activity, capstone]
}
