// The Challenge Creator walkthrough: how the wizard adapts to who is building,
// then one challenge built end to end as a school admin — a template, its
// details, turning on activities and Book Talks with Benny, creating an
// activity badge, a prize and a ticket reward, changing what counts as
// finished, the reader preview, catching a missed step in the review and going
// back for it — and published.
module.exports = {
  name: 'challenge-creator-demo',
  title: 'Challenge Creator — demo',
  voice: 'am_michael',
  speed: 1.08,
  music: 'lofi-full.mp3',
  viewport: { width: 1440, height: 810 },
  // The picker's Demo videos tab.
  description:
    'Building a reading challenge end to end: roles and types, a template, an activity badge, Book Talks with Benny, a prize and a ticket reward, what counts as finished, the preview, and fixing a missed step from the review.',
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
      screen: 'How do readers earn badges? → Activities, Book Talks',
      text: 'Badges are how readers make progress. The type turns on one way to earn them, and you can add others. Here, turn on activities, and Book Talks with Benny.',
    },
    {
      id: 'c08',
      screen: 'Logging badges',
      text: 'The logging badges came with the template: log one book, then two, then three. Each one can be edited, or a whole ladder quick-created at once.',
    },
    {
      id: 'c09',
      screen: 'Activity badges → Create a badge',
      text: 'Now a new activity badge. Choose its art from the gallery, upload your own, or create one, then give it a name.',
    },
    {
      id: 'c10',
      screen: 'Activities → Text box challenge',
      text: 'Then add what readers do to earn it. There are all kinds of activities, from watching a video to checking in with a QR code. This one is a text box challenge, where readers answer a prompt.',
    },
    {
      id: 'c11',
      screen: 'Era Explorer',
      text: 'Create it, and it joins the challenge.',
    },
    {
      id: 'c12',
      screen: 'Book Talks with Benny → On title completions',
      text: 'Book Talks with Benny can start a conversation each time a reader finishes a title in this challenge. Switch that on here.',
    },
    {
      id: 'c13',
      screen: 'Milestone badges',
      text: "There's a badge for signing up, and one for finishing.",
    },

    // ── Rewards ──
    {
      id: 'c14',
      chapter: 'Rewards',
      screen: 'What do readers earn? → Prizes, Raffle Tickets',
      text: 'Then rewards: prizes, raffle tickets for prize drawings, and a certificate.',
    },
    {
      id: 'c15',
      screen: 'Create reward → earned by Era Explorer',
      text: 'A prize is something readers claim when they earn a badge. This one’s a bookmark, for everyone who earns the new activity badge.',
    },
    {
      id: 'c16',
      screen: 'Add ticket reward',
      text: 'Readers collect tickets as they earn badges, and a ticket reward is a prize they spend them on, to enter the drawing.',
    },
    {
      id: 'c17',
      screen: 'Certificates',
      text: 'And this template comes with a certificate readers get for finishing.',
    },

    // ── Completion ──
    {
      id: 'c18',
      chapter: 'Completion',
      screen: 'What counts as finished? → Require some badges',
      text: 'Then decide what counts as finished. Instead of every badge, readers here only need to earn five of them.',
    },

    // ── Preview, review, publish ──
    {
      id: 'c19',
      chapter: 'Preview & review',
      screen: 'Challenge preview',
      text: 'At any point, the preview shows exactly what readers will see: the banner, the dates, and every badge and reward.',
    },
    {
      id: 'c20',
      screen: 'Review & publish',
      text: 'The review lays out the whole challenge in one place,',
    },
    {
      id: 'c21',
      screen: 'Book Talk badges: Not set → Edit',
      text: 'and it’s where you catch what you missed. There’s no Book Talk badge yet, so Edit jumps straight back to that step.',
    },
    {
      id: 'c22',
      screen: 'Add a Book Talk badge',
      text: 'Add one there: a badge for having Book Talks with Benny. It gets art and a name like any other, plus how many Book Talks it takes to earn: three, for this one.',
    },
    {
      id: 'c22b',
      screen: 'Back to Review → Book Talk badges',
      text: 'Then step right back to the review, and the new badge is there.',
    },
    {
      id: 'c23',
      chapter: 'Publish',
      screen: 'Publish → It’s live!',
      text: "Publish it, and it's [live](lyve): readers can find it and join right away.",
    },
    {
      id: 'c24',
      chapter: 'Close',
      screen: 'It’s live!',
      text: "That's the Challenge Creator: a guided way to build a challenge, from a template or from scratch, shaped to whoever is building it.",
    },
  ],

  async script(h) {
    const { page, go, wait, reveal, moveTo, click, tap, type, line, mark } = h
    const next = () => page.locator('button').filter({ hasText: /^Next/ }).last()
    const role = (name) => page.getByRole('button', { name: `View as ${name}` })
    const type_ = (name) =>
      page.locator('button').filter({ hasText: new RegExp(`^${name} Challenge`) })
    const step = (name) => page.getByText(name, { exact: true }).first()
    const modal = page.locator('.modal').last()
    // The switch on the row a label sits in.
    const toggleFor = (label) =>
      page
        .getByText(label, { exact: true })
        .first()
        .locator('xpath=ancestor::*[.//*[contains(@class,"tgl")]][1]')
        .locator('.tgl')
        .first()
    // A badge's art: a subject in the picker's gallery, then its first badge.
    const pickArt = async (subject) => {
      await click(modal.getByRole('button', { name: 'Choose a badge' }))
      await wait(500)
      await tap(
        modal
          .locator('button')
          .filter({ hasText: new RegExp(`^${subject}`) })
          .first(),
      )
      await wait(400)
      await tap(modal.locator('.cc-badgepick-pick').first())
      await wait(400)
    }

    // The creator autosaves its draft to localStorage (`cc-v2`), and the demo's
    // browser profile keeps localStorage for the life of the run.
    await go('/challenge-creator/')
    await page.evaluate(() => localStorage.removeItem('cc-v2'))
    await go('/challenge-creator/')
    mark('start')

    // ── Who's building ──
    await line('c01', async () => {
      await moveTo(page.getByText('Choose a challenge type').first())
      await moveTo(type_('Logging'))
    })

    await line('c02', async () => {
      await click(role('Teacher / Media Specialist'))
      await moveTo(step('Completion'))
      await click(role('MS+ · School Admin'))
      await moveTo(step('Rewards'))
      await click(role('Public Librarian'))
      await moveTo(type_('Points'))
      await click(role('MS+ · School Admin'))
    })

    await line('c03', async () => {
      await moveTo(type_('Activity'))
      await moveTo(type_('Reading List'))
      await click(type_('Bingo'))
      await moveTo(step('Bingo Card'))
      await click(type_('Logging'))
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
        await click(toggleFor('Completing Activities'))
        await moveTo(page.getByText('Writing Reviews').first())
        await click(toggleFor('Book Talks with Benny'))
      },
      { pre: () => click(next()) },
    )

    await line(
      'c08',
      async () => {
        await moveTo(page.getByText('Cozy Reading Era').first())
        await moveTo(page.getByText('Imagination Era').first())
        await moveTo(page.locator('button[aria-label="Edit badge"]').nth(2))
        await moveTo(page.getByText('Quick-create', { exact: false }).first())
      },
      { pre: () => click(next()) },
    )

    await line(
      'c09',
      async () => {
        await click(page.getByRole('button', { name: '+ Create a badge' }))
        await wait(700)
        await pickArt('Space')
        await type(
          modal
            .getByPlaceholder('e.g. Cupid’s Arrows')
            .or(modal.getByPlaceholder("e.g. Cupid's Arrows")),
          'Era Explorer',
        )
      },
      { pre: () => click(next()) },
    )

    await line('c10', async () => {
      await tap(modal.getByRole('tab', { name: /^Activities/ }))
      await wait(300)
      await click(modal.getByRole('button', { name: '+ Add an activity' }))
      await wait(300)
      await tap(modal.locator('button').filter({ hasText: 'Activity (link)' }).first())
      await wait(300)
      const kind = (t) => page.locator('.csel-item').filter({ hasText: t }).first()
      await moveTo(kind('Watch a video'), { ms: 500 })
      await moveTo(kind('Check in / Scan a QR code'), { ms: 600 })
      await tap(kind('Text box challenge'))
      await wait(300)
      await type(modal.locator('.rtx-editor').last(), 'Which reading era are you in? Tell us why.')
      await click(modal.getByRole('button', { name: 'Add activity', exact: true }))
      await wait(400)
    })

    await line('c11', async () => {
      await click(modal.getByRole('button', { name: 'Create badge' }))
      await wait(800)
      await moveTo(page.getByText('Era Explorer', { exact: true }).first())
    })

    await line(
      'c12',
      async () => {
        await moveTo(page.getByText('When should Benny start a Book Talk?').first())
        await click(toggleFor('On title completions'))
        await wait(400)
      },
      { pre: () => click(next()) },
    )

    await line(
      'c13',
      async () => {
        await moveTo(page.getByText('Registration badge').first())
        await moveTo(page.getByText('Completion badge').first())
      },
      { pre: () => click(next()) },
    )

    // ── Rewards ──
    await line(
      'c14',
      async () => {
        await click(toggleFor('Prizes'))
        await click(toggleFor('Raffle Tickets'))
        await moveTo(page.getByText('Certificates', { exact: true }).first())
      },
      { pre: () => click(next()) },
    )

    await line(
      'c15',
      async () => {
        await click(page.getByRole('button', { name: '+ Create reward' }))
        await wait(500)
        await type(modal.getByPlaceholder('e.g. Free Book'), 'Reading Era Bookmark')
        await tap(modal.locator('.msel-trigger').first())
        await wait(300)
        await tap(page.locator('.msel-opt').filter({ hasText: 'Era Explorer' }).first())
        await wait(300)
        await tap(page.locator('.msel-pop').getByRole('button', { name: 'Done', exact: true }))
        await wait(300)
        await click(modal.getByRole('button', { name: 'Add reward', exact: true }))
        await wait(500)
      },
      { pre: () => click(next()) },
    )

    await line(
      'c16',
      async () => {
        await click(page.getByRole('button', { name: '+ Add ticket reward' }).first())
        await wait(700)
        await type(modal.getByPlaceholder('e.g. Pizza Party'), 'Pizza Party')
        await tap(modal.getByRole('button', { name: 'Increase' }))
        await tap(modal.getByRole('button', { name: 'Increase' }))
        await click(modal.getByRole('button', { name: 'Add ticket reward', exact: true }))
        await wait(700)
      },
      { pre: () => click(next()) },
    )

    await line(
      'c17',
      async () => {
        await moveTo(page.getByText('Reading Era Certificate').first())
      },
      { pre: () => click(next()) },
    )

    // ── Completion ──
    await line(
      'c18',
      async () => {
        await moveTo(page.getByText('Require all badges').first())
        await click(page.getByText('Require some badges').first())
        await wait(500)
        const up = page.locator('.cc-form').getByRole('button', { name: 'Increase' }).first()
        for (let i = 0; i < 4; i++) await tap(up)
      },
      { pre: () => click(next()) },
    )

    // ── Preview, review, publish ──
    await line('c19', async () => {
      await click(page.locator('button[aria-label="Preview"]').first())
      await wait(1200)
      const badges = page.locator('.modal').getByText('Badges', { exact: false }).first()
      await reveal(badges)
      await moveTo(badges)
      await wait(600)
    })

    await line(
      'c20',
      async () => {
        await moveTo(page.getByText('Review & publish').first())
        await moveTo(page.locator('.cc-review-row').filter({ hasText: 'Activity badges' }).first())
      },
      {
        pre: async () => {
          await click(page.locator('button[aria-label="Close preview"]').first())
          await click(next())
        },
      },
    )

    await line('c21', async () => {
      const row = page.locator('.cc-review-row').filter({ hasText: 'Book Talk badges' }).first()
      await moveTo(row, { dx: -120 })
      await click(row.getByRole('button', { name: 'Edit' }))
      await wait(800)
    })

    await line('c22', async () => {
      await click(page.getByRole('button', { name: '+ Add Book Talk badge' }).first())
      await wait(700)
      await pickArt('Animals')
      await type(modal.getByPlaceholder('e.g. 5 Books Read'), 'Talk It Over')
      await tap(modal.getByRole('button', { name: 'Increase' }))
      await tap(modal.getByRole('button', { name: 'Increase' }))
      await click(modal.getByRole('button', { name: 'Save & add' }))
      await wait(700)
    })

    await line('c22b', async () => {
      await click(page.locator('.cc-stepbar button').filter({ hasText: 'Review' }))
      await wait(800)
      await moveTo(page.locator('.cc-review-row').filter({ hasText: 'Book Talk badges' }).first(), {
        dx: -120,
      })
    })

    await line('c23', async () => {
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
      'c24',
      async () => {
        await moveTo(page.getByText('It’s live!').first())
        await wait(1200)
      },
      { gap: 1500 },
    )
    mark('end')
  },
}
