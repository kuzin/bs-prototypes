// The Gameboards walkthrough: building a gameboard challenge in the Challenge
// Creator (a template, its badge ladder, the board's theme and settings, the
// badges on the path), then the reader's side — their progress on the board,
// logging a finished book, and the space it clears.
module.exports = {
  name: 'gameboards-demo',
  title: 'Gameboards — demo',
  voice: 'am_michael',
  speed: 1.08,
  music: 'lofi-full.mp3',
  viewport: { width: 1440, height: 810 },
  // The picker's Demo videos tab.
  description:
    'Building a gameboard challenge — a template, its badges, the board’s theme and path — then a reader clearing the next space by logging a finished book.',
  prototypes: ['gameboard', 'gameboard-reader'],
  posterLine: 'g10',

  lines: [
    // ── Building the board ──
    {
      id: 'g01',
      chapter: 'Building the board',
      screen: 'Choose a challenge type → Gameboard',
      text: 'A gameboard challenge is built in the Challenge Creator. Readers move along a themed board as they read.',
    },
    {
      id: 'g02',
      screen: 'Start from a template',
      text: 'Start from scratch, or from a template, like In My Reading Era.',
    },
    {
      id: 'g03',
      screen: 'Details → Badges',
      text: 'The template fills in the details and the badges, and every badge can be created and edited, just like in any other challenge.',
    },
    {
      id: 'g03b',
      screen: 'Earnable badge types → Completing Activities',
      text: 'Activity badges can be added too, though they won’t show up on the board.',
    },
    {
      id: 'g04',
      screen: 'Gameboard theme',
      text: 'Then the board itself. A template made for gameboards brings its board image with it. Otherwise, pick one yourself: a meadow, the ocean, a winter forest, or a custom upload.',
    },
    {
      id: 'g05',
      screen: 'Gameboard settings',
      text: 'Spaces that come with a prize can show a gift, and there’s an optional halfway marker.',
    },
    {
      id: 'g06',
      screen: 'Gameboard setup',
      text: 'Badges are dragged onto the path readers travel: from the start, past the halfway mark, to the finish.',
    },
    {
      id: 'g07',
      screen: 'Completion → Publish',
      text: 'Choose what counts as finishing, and publish it.',
    },

    // ── Traveling the board ──
    {
      id: 'g08',
      chapter: 'Traveling the board',
      screen: 'Bundle Up With Books → Gameboard',
      text: 'On the reader’s side, the challenge opens on its board.',
    },
    {
      id: 'g09',
      screen: 'Your progress · Next up',
      text: 'Their progress sits on top: the spaces they’ve cleared, the rewards they’ve unlocked, and the next space to reach.',
    },
    {
      id: 'g10',
      screen: 'The board',
      text: 'Cleared spaces fill in along the path, and the spaces with a reward carry a gift. The board is responsive, too, so it works on any size of device.',
    },
    {
      id: 'g11',
      screen: 'Log Reading → Dog Man',
      text: 'To move forward, they log their reading, the same way as always.',
    },
    {
      id: 'g12',
      screen: '40 minutes · Finished',
      text: 'A finished book is what clears the next space.',
    },
    {
      id: 'g13',
      screen: 'You did it!',
      text: 'Log it, and they’ve done it.',
    },
    {
      id: 'g14',
      screen: 'Badge Unlocked — 4 Books',
      text: 'And the next badge unlocks: four books.',
    },
    {
      id: 'g15',
      screen: '4 of 10 spaces cleared',
      text: 'Back on the board, that space is cleared, and the next one is up.',
    },
    {
      id: 'g16',
      chapter: 'Close',
      screen: 'The board',
      text: 'That’s the gameboard: built in the Challenge Creator, and traveled one book at a time.',
    },
  ],

  async script(h) {
    const { page, go, wait, moveTo, click, tap, type, line, mark } = h
    const next = () => page.locator('button').filter({ hasText: /^Next/ }).last()
    const theme = (name) => page.locator('.gb-theme').filter({ hasText: name }).first()
    const space = (re) => page.locator('button').filter({ hasText: re }).first()

    // The creator autosaves its draft to localStorage (`gameboard`), and the
    // demo's profile keeps localStorage for the life of the run.
    await go('/gameboard/')
    await page.evaluate(() => localStorage.removeItem('gameboard'))
    await go('/gameboard/')
    mark('start')

    // ── Building the board ──
    await line('g01', async () => {
      await moveTo(page.getByText('Choose a challenge type', { exact: true }).first())
      await moveTo(page.locator('button').filter({ hasText: 'Gameboard Challenge' }).first())
    })

    await line(
      'g02',
      async () => {
        await moveTo(page.getByText('Start from scratch').first())
        await click(page.getByText('In My Reading Era').first())
      },
      { pre: () => click(next()) },
    )

    await line('g03', async () => {
      await click(next()) // Details
      await moveTo(page.getByText('Basics', { exact: true }).first())
      await click(next()) // Badges
      await moveTo(page.getByText('Cozy Reading Era').first())
      await moveTo(page.locator('button[aria-label="Edit badge"]').nth(2))
      await moveTo(page.getByText('+ Add badge').first())
    })

    await line('g03b', async () => {
      await moveTo(page.getByText('Completing Activities', { exact: true }).first())
    })

    await line(
      'g04',
      async () => {
        await moveTo(theme('Meadow'))
        await tap(theme('Ocean'))
        await wait(700)
        await tap(theme('Winter'))
        await wait(700)
        await tap(theme('Meadow'))
        await moveTo(page.locator('.gb-theme--custom'))
      },
      { pre: () => click(next()) },
    )

    await line('g05', async () => {
      await moveTo(page.getByText('Show reward types', { exact: true }).first())
      await moveTo(page.getByText('Show a halfway marker', { exact: true }).first())
    })

    await line('g06', async () => {
      await moveTo(page.getByText('Drag badges onto the board', { exact: true }).first())
      await moveTo(page.locator('.gb-board .gb-placed').first())
      await moveTo(page.locator('.gb-board .gb-arc--top').first())
      await moveTo(page.locator('.gb-board .gb-placed').last())
    })

    await line('g07', async () => {
      await click(next()) // Completion
      await moveTo(page.getByText('Require all badges').first())
      await click(
        page
          .locator('button')
          .filter({ hasText: /^Publish challenge/ })
          .last(),
      )
      await wait(600)
      await moveTo(page.getByRole('button', { name: 'Yes, publish' }))
    })

    // ── Traveling the board ──
    await line(
      'g08',
      async () => {
        await moveTo(page.getByText('Bundle Up With Books', { exact: true }).first())
        await moveTo(h.tab(/^Gameboard$/))
      },
      {
        pre: async () => {
          await go('/gameboard-reader/')
          await page.evaluate(() => sessionStorage.removeItem('bsp:gameboard-reader:tab'))
          await go('/gameboard-reader/')
        },
      },
    )

    await line('g09', async () => {
      await moveTo(page.getByText(/spaces cleared/).first())
      await moveTo(
        page
          .locator('button')
          .filter({ hasText: /next up/i })
          .first(),
      )
    })

    await line('g10', async () => {
      await moveTo(space(/^3 Books/))
      await moveTo(space(/^2 Books/))
      await moveTo(space(/^HALFWAY/))
    })

    await line('g11', async () => {
      await click(page.getByRole('button', { name: 'Log Reading' }).first())
      await wait(900)
      await click(page.locator('.lf-tile[aria-label="Dog Man"]').first())
      await click(page.locator('.flyout-menu-item').filter({ hasText: 'Log Reading' }).first())
      await wait(800)
    })

    await line('g12', async () => {
      await type(page.getByPlaceholder('Type "1h", "33m", or "1h33m"'), '40m')
      await click(
        page
          .locator('.tgl-label')
          .filter({ hasText: /^Finished$/ })
          .first(),
      )
    })

    await line('g13', async () => {
      await click(
        page
          .locator('[class*="lf-"] button')
          .filter({ hasText: /^Log Reading$/ })
          .last(),
      )
      await wait(1400)
      await moveTo(page.getByText('You did it!', { exact: true }).first())
      await moveTo(page.getByText('Your place on the board', { exact: true }).first())
    })

    await line('g14', async () => {
      await click(page.getByRole('button', { name: 'Finish', exact: true }))
      await wait(1400)
      await moveTo(page.locator('.modal').getByText('Badge Unlocked', { exact: true }).first())
    })

    await line('g15', async () => {
      await click(page.getByRole('button', { name: 'Check it out!' }))
      await wait(1000)
      await moveTo(space(/^4 Books/))
      await moveTo(
        page
          .locator('button')
          .filter({ hasText: /next up/i })
          .first(),
      )
    })

    await line(
      'g16',
      async () => {
        await moveTo(space(/^HALFWAY/))
        await wait(1200)
      },
      { gap: 1500 },
    )
    mark('end')
  },
}
