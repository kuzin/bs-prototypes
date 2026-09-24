// The Challenge Creator walkthrough: how the wizard adapts to who is building,
// then one challenge built end to end as a school admin — type, a template,
// details, badges, rewards, what counts as finished, the reader preview, the
// review — and published.
module.exports = {
  name: 'challenge-creator-demo',
  title: 'Challenge Creator — demo',
  voice: 'am_michael',
  speed: 1.08,
  music: 'lofi-full.mp3',
  viewport: { width: 1440, height: 810 },
  // The picker's Demo videos tab.
  description:
    'Building a reading challenge end to end: how the wizard adapts to each role, the six types, a template, badges, rewards, what counts as finished, the reader preview, and publishing.',
  prototypes: ['challenge-creator'],
  posterLine: 'c04',

  lines: [
    // ── Who's building ──
    {
      id: 'c01',
      chapter: 'The Challenge Creator',
      screen: 'Choose a challenge type',
      text: "Here's the Challenge Creator: a full-screen wizard for building a reading challenge, one step at a time.",
    },
    {
      id: 'c02',
      screen: 'Teacher → School admin → Public librarian',
      text: 'It adapts to who is building. A teacher gets a shorter flow, focused on their own classrooms. A school admin gets every step, including rewards. And a public librarian can run a points challenge, too.',
    },
    {
      id: 'c03',
      screen: 'The six types; Bingo adds its own step',
      text: 'First, the type: logging, activities, bingo, a reading list, reviews, or a gameboard. Each one shapes the steps. Pick bingo, and a step for building the bingo card appears.',
    },

    // ── Details ──
    {
      id: 'c04',
      chapter: 'Details',
      screen: 'Start from a template',
      text: 'Next, a starting point. Build from scratch, or begin with a ready-made template, like In My Reading Era.',
    },
    {
      id: 'c05',
      screen: 'Name & description, filled in',
      text: 'A template fills in everything: the name, the description, the banner, and the badges. And you can change any of it.',
    },
    {
      id: 'c06',
      screen: 'Dates → Look & feel → Who it’s for',
      text: 'Set when it runs, give it a look with a theme, or your own banner and accent colour, and choose who can join.',
    },

    // ── Badges ──
    {
      id: 'c07',
      chapter: 'Badges',
      screen: 'How do readers earn badges?',
      text: 'Badges are how readers make progress. The type turns on one way to earn them, and you can layer on others: activities, reviews, or Book Talks with Benny.',
    },
    {
      id: 'c08',
      screen: 'Logging badges',
      text: 'Each badge is a milestone: log one book, then two, then three, each with its own art.',
    },
    {
      id: 'c09',
      screen: 'Edit badge',
      text: "Edit any badge's name and goal,",
    },
    {
      id: 'c10',
      screen: 'Quick-create',
      text: 'or quick-create a whole ladder of them at once.',
    },
    {
      id: 'c11',
      screen: 'Milestone badges',
      text: "There's a badge for signing up, and one for finishing.",
    },

    // ── Rewards & completion ──
    {
      id: 'c12',
      chapter: 'Rewards & completion',
      screen: 'What do readers earn?',
      text: 'Then rewards: prizes, raffle tickets for prize drawings, or a certificate.',
    },
    {
      id: 'c13',
      screen: 'Certificates',
      text: 'This template comes with a certificate readers get for finishing.',
    },
    {
      id: 'c14',
      screen: 'What counts as finished?',
      text: 'And you decide what counts as finished: every badge, specific badges, or just some of them.',
    },

    // ── Preview, review, publish ──
    {
      id: 'c15',
      chapter: 'Preview & publish',
      screen: 'Challenge preview',
      text: 'At any point, the preview shows exactly what readers will see: the banner, the dates, and every badge they can earn.',
    },
    {
      id: 'c16',
      screen: 'Review & publish',
      text: 'The review lays out the whole challenge in one place, with a quick way to edit any part of it.',
    },
    {
      id: 'c17',
      screen: 'Publish → It’s live!',
      text: "Publish it, and it's live: readers can find it and join right away.",
    },

    // ── Close ──
    {
      id: 'c18',
      chapter: 'Close',
      screen: 'It’s live!',
      text: "That's the Challenge Creator: a guided way to build a challenge, from a template or from scratch, shaped to whoever is building it.",
    },
  ],

  async script(h) {
    const { page, go, wait, reveal, moveTo, click, line, mark } = h
    const next = () => page.locator('button').filter({ hasText: /^Next/ }).last()
    const role = (name) => page.getByRole('button', { name: `View as ${name}` })
    const type = (name) =>
      page.locator('button').filter({ hasText: new RegExp(`^${name} Challenge`) })
    const step = (name) => page.getByText(name, { exact: true }).first()

    // The creator autosaves its draft to localStorage (`cc-v2`), and the demo's
    // browser profile keeps localStorage between runs — start from a fresh one.
    await go('/challenge-creator/')
    await page.evaluate(() => localStorage.removeItem('cc-v2'))
    await go('/challenge-creator/')
    mark('start')

    // ── Who's building ──
    await line('c01', async () => {
      await moveTo(page.getByText('Choose a challenge type').first())
      await moveTo(type('Logging'))
    })

    await line('c02', async () => {
      await click(role('Teacher / Media Specialist'))
      await moveTo(step('Completion'))
      await click(role('MS+ · School Admin'))
      await moveTo(step('Rewards'))
      await click(role('Public Librarian'))
      await moveTo(type('Points'))
      await click(role('MS+ · School Admin'))
    })

    await line('c03', async () => {
      await moveTo(type('Activity'))
      await moveTo(type('Reading List'))
      await click(type('Bingo'))
      await moveTo(step('Bingo Card'))
      await click(type('Logging'))
    })

    // ── Details ──
    await line(
      'c04',
      async () => {
        await moveTo(page.getByText('Start from scratch').first())
        await click(page.getByText('In My Reading Era').first())
      },
      { pre: () => click(next()) },
    )

    await line(
      'c05',
      async () => {
        await moveTo(page.locator('input[type=text], input:not([type])').first())
        await moveTo(page.getByText('Move through your reading eras', { exact: false }).first())
      },
      { pre: () => click(next()) },
    )

    await line('c06', async () => {
      await click(next()) // Dates
      await moveTo(page.getByText('When does it start?').first())
      await click(next()) // Look & feel
      await moveTo(page.getByText('Header image').first(), { dy: 60 })
      await moveTo(page.getByText('Accent color').first())
      await click(next()) // Who it's for
      await moveTo(page.getByText('Who can join?').first())
    })

    // ── Badges ──
    await line(
      'c07',
      async () => {
        await moveTo(page.getByText('Logging Reading').first())
        await moveTo(page.getByText('Completing Activities').first())
        await moveTo(page.getByText('Writing Reviews').first())
        await moveTo(page.getByText('Book Talks with Benny').first())
      },
      { pre: () => click(next()) },
    )

    await line(
      'c08',
      async () => {
        await moveTo(page.getByText('Cozy Reading Era').first())
        await moveTo(page.getByText('Daydreamer Era').first())
        await moveTo(page.getByText('Imagination Era').first())
      },
      { pre: () => click(next()) },
    )

    await line('c09', async () => {
      await click(page.locator('button[aria-label="Edit badge"]').first())
      await wait(900)
      await moveTo(page.getByText('Goal', { exact: false }).first())
    })

    await line(
      'c10',
      async () => {
        await click(page.getByText('Quick-create', { exact: false }).first())
        await wait(1000)
      },
      { pre: () => click(page.getByRole('button', { name: 'Cancel' }).first()), gap: 700 },
    )

    await line(
      'c11',
      async () => {
        await moveTo(page.getByText('Registration badge').first())
        await moveTo(page.getByText('Completion badge').first())
      },
      {
        pre: async () => {
          await click(page.getByRole('button', { name: 'Cancel' }).first())
          await click(next())
        },
      },
    )

    // ── Rewards & completion ──
    await line(
      'c12',
      async () => {
        await moveTo(page.getByText('Prizes', { exact: true }).first())
        await moveTo(page.getByText('Raffle Tickets', { exact: true }).first())
        await moveTo(page.getByText('Certificates', { exact: true }).first())
      },
      { pre: () => click(next()) },
    )

    await line(
      'c13',
      async () => {
        await moveTo(page.getByText('Reading Era Certificate').first())
      },
      { pre: () => click(next()) },
    )

    await line(
      'c14',
      async () => {
        await moveTo(page.getByText('Require all badges').first())
        await moveTo(page.getByText('Require specific badges').first())
        await moveTo(page.getByText('Require some badges').first())
      },
      { pre: () => click(next()) },
    )

    // ── Preview, review, publish ──
    await line('c15', async () => {
      await click(page.locator('button[aria-label="Preview"]').first())
      await wait(1200)
      const badges = page.locator('.modal').getByText('Badges', { exact: false }).first()
      await reveal(badges)
      await moveTo(badges)
      await wait(600)
    })

    await line(
      'c16',
      async () => {
        await moveTo(page.getByText('Review & publish').first())
        await moveTo(page.getByText('Edit', { exact: true }).nth(2))
      },
      {
        pre: async () => {
          await click(page.locator('button[aria-label="Close preview"]').first())
          await click(next())
        },
      },
    )

    await line('c17', async () => {
      await click(
        page
          .locator('button')
          .filter({ hasText: /^Publish challenge/ })
          .last(),
      )
      await wait(700)
      await click(page.getByRole('button', { name: 'Yes, publish' }))
      await wait(1600)
    })

    await line(
      'c18',
      async () => {
        await moveTo(page.getByText('It’s live!').first())
        await wait(1200)
      },
      { gap: 1500 },
    )
    mark('end')
  },
}
