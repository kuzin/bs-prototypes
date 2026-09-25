// The Pick Your Path walkthrough: the teacher sets a vocabulary destination and
// the paths on offer; the student picks a path, logs a title, earns its badge,
// unlocks a word in Benny's three-activity round, and finds the word in their
// Collections.
module.exports = {
  name: 'pick-your-path-demo',
  title: 'Pick Your Path — demo',
  voice: 'am_michael',
  speed: 1.08,
  music: 'lofi-full.mp3',
  viewport: { width: 1440, height: 810 },
  // The picker's Demo videos tab.
  description:
    'The teacher sets a vocabulary destination and the paths on offer; the student picks a path, logs a title, unlocks a word with Benny, and collects it.',
  prototypes: ['pick-your-path'],
  posterLine: 'y06',

  lines: [
    // ── The teacher ──
    {
      id: 'y01',
      chapter: 'The teacher',
      screen: 'Set a destination',
      text: 'Pick Your Path starts with the teacher, who chooses a destination: a cluster of vocabulary words, like Words of Motion.',
    },
    {
      id: 'y02',
      screen: 'The paths students can pick',
      text: 'Then they choose which paths students can pick from. Every path practices the same words; only the subject changes: sports, engineering, or animals.',
    },
    {
      id: 'y03',
      screen: 'The Sports Path → Books · Vocabulary · Activities · Badges',
      text: 'Open a path to see everything it offers: its books, the words and where they show up, the activities students do offline, and every badge.',
    },

    // ── The student picks ──
    {
      id: 'y04',
      chapter: 'The student picks',
      screen: 'Challenges → Words of Motion',
      text: 'Students find the challenge on their Challenges page, waiting for them to pick a path.',
    },
    {
      id: 'y05',
      screen: 'Select a path',
      text: 'They choose the subject they’d most like to read about. They can switch any time, and anything they’ve earned comes with them.',
    },
    {
      id: 'y06',
      screen: 'The Sports Path — Overview',
      text: 'Now it’s their path: the words they’re practicing, with the ones they haven’t found yet still hidden, and their progress toward the capstone badge.',
    },

    // ── Reading ──
    {
      id: 'y07',
      chapter: 'Reading',
      screen: 'Reading List',
      text: 'The reading list has ten titles on the path, and each one can be [read](red) right here, or logged.',
    },
    {
      id: 'y08',
      screen: 'Log → minutes, finished',
      text: 'Logging a title works like any other log: how long they [read](red), and whether they finished it.',
    },
    {
      id: 'y09',
      screen: 'You earned a badge!',
      text: 'Finishing a title earns its badge.',
    },
    {
      id: 'y10',
      screen: 'I found a word in there',
      text: 'And some titles are hiding a word. Benny found one in this book.',
    },

    // ── The word round ──
    {
      id: 'y11',
      chapter: 'The word round',
      screen: 'momentum',
      text: 'Unlock it, and Benny hands it over: the word, how to say it, what it means, and an example.',
    },
    {
      id: 'y12',
      screen: 'What does momentum mean?',
      text: 'Then come three quick activities. The kinds of questions are picked at random, so every word plays a little differently. This one starts with what it means.',
    },
    {
      id: 'y13',
      screen: 'Turn over a card',
      text: 'Next, turn over a card, and decide whether its sentence uses the word the right way.',
    },
    {
      id: 'y14',
      screen: 'Write your own sentence → Show Benny',
      text: 'Last, they write a sentence of their own, and Benny checks it.',
    },
    {
      id: 'y15',
      screen: 'momentum is yours',
      text: 'Collect it, and the word is theirs.',
    },

    // ── Words and badges ──
    {
      id: 'y16',
      chapter: 'Words and badges',
      screen: 'Word List',
      text: 'The Word List shows every word they’ve found, and how many are still hiding.',
    },
    {
      id: 'y17',
      screen: 'Badges',
      text: 'Badges come from the titles they finish and their activities, with a capstone for finishing the whole path.',
    },

    // ── Collections ──
    {
      id: 'y19',
      chapter: 'Collections',
      screen: 'Collections → Words',
      text: 'Every word they collect joins their Collections, with a review deck that keeps practicing the ones they’re still learning.',
    },
    {
      id: 'y20',
      chapter: 'Close',
      screen: 'Collections → Words',
      text: 'That’s Pick Your Path: the teacher sets the destination, students pick the path, and every book builds the same vocabulary.',
    },
  ],

  async script(h) {
    const { page, go, wait, moveTo, click, tap, type, line, mark } = h
    // The preview bar is hidden in recordings (it's the reviewer's chrome), so
    // the cut from the teacher's screen to the student's is made through it off
    // camera, in a line's silent `pre`.
    const view = (label) =>
      page.evaluate(
        (l) =>
          [...document.querySelectorAll('.pvb button')]
            .find((b) => b.innerText.includes(l))
            ?.click(),
        label,
      )
    const offer = (name) => page.locator('.pyp-pathoffer').filter({ hasText: name }).first()
    const book = (title) => page.locator('.pyp-bookcard').filter({ hasText: title }).first()
    const modal = page.locator('.modal').last()
    const round = page.locator('.wb-unlock')
    const roundBtn = (t) => round.locator('button').filter({ hasText: t }).first()

    // A fresh start: the prototype keeps the open view and tab in sessionStorage.
    await go('/pick-your-path/')
    await page.evaluate(() =>
      Object.keys(sessionStorage)
        .filter((k) => k !== '__demo-pos')
        .forEach((k) => sessionStorage.removeItem(k)),
    )
    await go('/pick-your-path/')
    mark('start')

    // ── The teacher ──
    await line('y01', async () => {
      await moveTo(page.getByText('Set a destination', { exact: true }).first())
      await moveTo(page.locator('button').filter({ hasText: 'Words of Motion' }).first())
    })

    await line('y02', async () => {
      await moveTo(offer('The Sports Path'), { dx: -200 })
      await moveTo(offer('The Engineering Path'), { dx: -200 })
      await moveTo(offer('The Animal Path'), { dx: -200 })
      await moveTo(offer('The Sports Path').locator('.tgl'))
    })

    await line('y03', async () => {
      await click(offer('The Sports Path').locator('.pyp-pathoffer-disclose'))
      await wait(700)
      const tab = (re) => offer('The Sports Path').locator('.tab').filter({ hasText: re }).first()
      await tap(tab(/^Vocabulary/))
      await wait(900)
      await tap(tab(/^Activities/))
      await wait(900)
      await tap(tab(/^Badges/))
      await wait(900)
    })

    // ── The student picks ──
    await line(
      'y04',
      async () => {
        await moveTo(page.locator('.wa-chcard--open').first())
      },
      {
        pre: async () => {
          await view('Challenges')
          await wait(900)
        },
      },
    )

    await line('y05', async () => {
      await click(page.locator('.wa-chcard--open button').first())
      await wait(900)
      await moveTo(modal.getByText('You can switch any time', { exact: false }).first())
      await moveTo(
        modal
          .locator('button')
          .filter({ hasText: /^Choose$/ })
          .nth(1),
      )
      await click(
        modal
          .locator('button')
          .filter({ hasText: /^Choose$/ })
          .first(),
      )
      await wait(900)
    })

    await line('y06', async () => {
      await moveTo(page.getByText('Words You’re Practising', { exact: true }).first())
      await moveTo(page.getByText('••••••••', { exact: true }).first())
      await moveTo(page.getByText('Overall Progress', { exact: true }).first())
    })

    // ── Reading ──
    await line(
      'y07',
      async () => {
        await moveTo(book('Football'), { dx: -150 })
        await moveTo(book('Football').getByRole('button', { name: 'Read Now' }))
        await moveTo(book('Football').getByRole('button', { name: 'Log', exact: true }))
      },
      { pre: () => tap(h.tab(/^Reading List/)) },
    )

    await line('y08', async () => {
      await click(book('The Science of Baseball').getByRole('button', { name: 'Log', exact: true }))
      await wait(1000)
      await type(page.getByPlaceholder('Type "1h", "33m", or "1h33m"'), '25m')
      await click(page.getByText('Finished', { exact: true }).first())
    })

    await line('y09', async () => {
      await click(page.getByRole('button', { name: 'Log Reading' }).last())
      await wait(1400)
      await moveTo(page.getByText('Finish a title on your path', { exact: true }).first())
    })

    await line('y10', async () => {
      await click(page.getByRole('button', { name: 'Next', exact: true }))
      await wait(900)
      await moveTo(page.getByText('I found a word in there.', { exact: false }).first())
    })

    // ── The word round ──
    await line('y11', async () => {
      await click(page.getByRole('button', { name: 'Unlock My Word' }))
      await wait(1200)
      await moveTo(round.getByText('moh-MEN-tum', { exact: false }).first())
      await moveTo(round.getByText('The push a moving thing carries', { exact: false }).first())
    })

    await line('y12', async () => {
      await click(roundBtn('Let’s go'))
      await wait(800)
      await moveTo(round.getByText('What does momentum mean?', { exact: false }).first())
      await click(roundBtn('The push a moving thing carries'))
      await wait(600)
    })

    await line('y13', async () => {
      await click(roundBtn(/^Next$/))
      await wait(700)
      await click(round.getByRole('button', { name: 'Card 1' }))
      await wait(900)
      await moveTo(round.getByText('The truck had so much momentum', { exact: false }).first())
      await click(round.getByRole('button', { name: 'It does', exact: true }))
      await wait(600)
    })

    await line('y14', async () => {
      await click(roundBtn(/^Next$/))
      await wait(700)
      await type(
        round.locator('textarea'),
        'The snowboarder built up so much momentum that she flew off the jump.',
      )
      await click(roundBtn('Show Benny'))
      await wait(1400)
      await moveTo(round.getByText('That works.', { exact: false }).first())
    })

    await line('y15', async () => {
      await click(roundBtn('Collect it'))
      await wait(1000)
      await moveTo(round.getByText('momentum is yours', { exact: false }).first())
    })

    // ── Words and badges ──
    await line(
      'y16',
      async () => {
        await moveTo(h.tab(/^Found/))
        await moveTo(page.getByText('momentum', { exact: true }).first())
        await moveTo(h.tab(/^Still hiding/))
      },
      {
        pre: async () => {
          await click(roundBtn('See My Words'))
          await wait(900)
        },
      },
    )

    await line(
      'y17',
      async () => {
        await moveTo(page.getByText('Snowboarding', { exact: true }).first())
        await moveTo(page.getByText('Words of Motion Explorer', { exact: true }).first())
      },
      { pre: () => tap(h.tab(/^Badges/)) },
    )

    // ── Collections ──
    await line(
      'y19',
      async () => {
        await moveTo(page.getByText('momentum', { exact: true }).first())
        await moveTo(
          page
            .locator('button')
            .filter({ hasText: /^Review/ })
            .first(),
        )
      },
      {
        pre: async () => {
          await click(h.tab(/^Collections$/))
          await wait(900)
          await tap(h.tab(/^Words/))
          await wait(600)
        },
      },
    )

    await line(
      'y20',
      async () => {
        await moveTo(h.tab(/^Still learning/))
        await wait(1200)
      },
      { gap: 1500 },
    )
    mark('end')
  },
}
