// The Words with Benny walkthrough: a finished book logged, the word Benny
// found in it and the three-activity round that collects it, the reader's
// collection and review deck, a friend's words, and the class's Vocabulary tab.
module.exports = {
  name: 'words-with-benny-demo',
  title: 'Words with Benny — demo',
  voice: 'am_michael',
  speed: 1.08,
  music: 'lofi-full.mp3',
  viewport: { width: 1440, height: 810 },
  // The picker's Demo videos tab.
  description:
    'A word from the book a reader just finished: logging it, the three-activity round that collects it, their collection and review deck, a friend’s words, and the class’s Vocabulary tab.',
  prototypes: ['words-with-benny'],
  posterLine: 'b04',

  lines: [
    // ── A word from the book ──
    {
      id: 'b01',
      chapter: 'A word from the book',
      screen: 'Log Reading',
      text: 'Words with Benny adds vocabulary to reading logs. Every couple of logs, Benny finds a word in the book the reader just finished.',
    },
    {
      id: 'b02',
      screen: 'Wonder → 30 minutes, finished',
      text: 'Olivia logs Wonder: thirty minutes, and she finished it.',
    },
    {
      id: 'b03',
      screen: 'You earned a badge! → I found a word in there',
      text: 'Along with her badge for finishing it, Benny found a word in the book.',
    },
    {
      id: 'b04',
      screen: 'conspicuous',
      text: 'The word comes from the book itself: conspicuous, how to say it, what it means, and a sentence about one of its characters.',
    },
    {
      id: 'b05',
      screen: 'Tap a word, then tap what it means',
      text: 'Collecting it takes three short activities, and the kinds of questions are picked at random, so every word plays a little differently. This one starts by matching words to what they mean.',
    },
    {
      id: 'b06',
      screen: 'Which sentence uses conspicuous the right way?',
      text: 'Then she picks the sentence that uses it the right way,',
    },
    {
      id: 'b07',
      screen: 'Turn over a card → It doesn’t',
      text: 'and turns over a card, to judge whether its sentence gets the word right.',
    },
    {
      id: 'b08',
      screen: 'conspicuous is yours',
      text: 'Collect it, and the word is hers.',
    },

    // ── Her words ──
    {
      id: 'b09',
      chapter: 'Her words',
      screen: 'Collections → Words',
      text: 'Every word she collects lands in her Collections, with the book it came from, and how well she knows it.',
    },
    {
      id: 'b10',
      screen: 'Review',
      text: 'Benny brings her words back for review, at widening intervals, so the ones she knows stay known.',
    },
    {
      id: 'b11',
      screen: 'A flashcard → flip',
      text: 'She says what a word means out loud, then flips the card to check.',
    },
    {
      id: 'b11b',
      screen: 'Still learning · Got it',
      text: 'Got it pushes a word further out each time. Still learning brings it back tomorrow.',
    },
    {
      id: 'b11c',
      screen: 'The rest of the deck',
      text: 'Card by card, she works through the rest of the deck, flipping each one and saying how well she knew it.',
    },
    {
      id: 'b11d',
      screen: 'still with you · Coming back tomorrow',
      text: 'At the end, Benny sums it up: what’s still with her, and what’s coming back tomorrow.',
    },
    {
      id: 'b11e',
      screen: 'Sticking · Known well',
      text: 'Back on her words, each one shows where it stands: still learning, sticking, or known well.',
    },
    {
      id: 'b12',
      screen: 'Friends → Jayden → Words',
      text: 'Words show up on friends’ profiles too, right beside their badges and reading.',
    },

    // ── The educator ──
    {
      id: 'b13',
      chapter: 'The educator',
      screen: 'Class A → Vocabulary',
      text: 'Teachers get a Vocabulary tab on the class page: how many words the class has collected, who’s collecting this week, and how often words are used correctly the first time.',
    },
    {
      id: 'b14',
      screen: 'The class word wall',
      text: 'There’s a word wall of what the class is collecting,',
    },
    {
      id: 'b15',
      screen: 'Where the words stop sticking',
      text: 'which kinds of activities the words stop sticking in,',
    },
    {
      id: 'b16',
      screen: 'Sentences students wrote',
      text: 'and the sentences students wrote, so a teacher can see the words being used.',
    },
    {
      id: 'b17',
      screen: 'By student',
      text: 'And there’s a view by student, for a closer look at anyone.',
    },
    {
      id: 'b18',
      chapter: 'Close',
      screen: 'By student',
      text: 'That’s Words with Benny: a word from the books they’re already reading, practiced, collected, and reported on, without adding work for the teacher.',
    },
  ],

  async script(h) {
    const { page, go, wait, reveal, moveTo, click, tap, type, line, mark } = h
    // The preview bar is hidden in recordings, so the cut to the teacher's side
    // goes through it off camera, in a line's silent `pre`.
    const view = (label) =>
      page.evaluate(
        (l) =>
          [...document.querySelectorAll('.pvb button')]
            .find((b) => b.textContent.includes(l))
            ?.click(),
        label,
      )
    const round = page.locator('.wb-unlock')
    const pick = (name) => round.getByRole('button', { name, exact: true })
    const modal = page.locator('.modal').last()

    // A fresh start: the prototype keeps its view and tabs in sessionStorage.
    await go('/words-with-benny/')
    await page.evaluate(() =>
      Object.keys(sessionStorage)
        .filter((k) => k !== '__demo-pos')
        .forEach((k) => sessionStorage.removeItem(k)),
    )
    await go('/words-with-benny/')
    mark('start')

    // ── A word from the book ──
    await line('b01', async () => {
      await click(page.getByRole('button', { name: 'Log Reading' }).first())
      await wait(900)
      await moveTo(page.locator('.lf-tile').first())
    })

    await line('b02', async () => {
      await click(page.locator('.lf-tile[aria-label="Wonder"]').first())
      await click(page.locator('.flyout-menu-item').filter({ hasText: 'Log Reading' }).first())
      await wait(800)
      await type(page.getByPlaceholder('Type "1h", "33m", or "1h33m"'), '30m')
      await click(
        page
          .locator('.tgl-label')
          .filter({ hasText: /^Finished$/ })
          .first(),
      )
    })

    await line('b03', async () => {
      await click(
        page
          .locator('[class*="lf-"] button')
          .filter({ hasText: /^Log Reading$/ })
          .last(),
      )
      await wait(1300)
      await moveTo(page.getByText('You earned a badge!', { exact: true }).first())
      await click(page.getByRole('button', { name: 'Next', exact: true }))
      await wait(900)
      await moveTo(page.getByText('I found a word in there.', { exact: false }).first())
    })

    await line('b04', async () => {
      await click(page.getByRole('button', { name: 'Unlock My Word' }))
      await wait(1200)
      await moveTo(round.getByText('kun-SPIK-yoo-us', { exact: false }).first())
      await moveTo(round.getByText('Auggie wants an ordinary day', { exact: false }).first())
    })

    await line('b05', async () => {
      await click(round.locator('button').filter({ hasText: 'Let’s go' }).first())
      await wait(800)
      await moveTo(round.getByText('Tap a word, then tap what it means.', { exact: false }).first())
      const pair = (t) => round.locator('.wb-pair').filter({ hasText: t }).first()
      await click(pair('conspicuous'))
      await click(pair('Impossible not to notice.'))
      await tap(pair('empathy'))
      await tap(pair('Feeling what someone else is feeling'))
      await tap(pair('precept'))
      await tap(pair('A short rule for how to live.'))
      await wait(500)
    })

    await line('b06', async () => {
      await click(pick('Next'))
      await wait(800)
      // This activity's choices are radios, not buttons.
      await click(round.getByRole('radio', { name: /His bright orange coat/ }))
      await wait(600)
    })

    // Card 2 is the deck's misuse — the first card repeats the sentence above.
    await line('b07', async () => {
      await click(pick('Next'))
      await wait(800)
      await click(round.getByRole('button', { name: 'Card 2' }))
      await wait(900)
      await moveTo(
        round.getByText('The conspicuous tasted mostly of salt.', { exact: false }).first(),
      )
      await click(round.getByRole('button', { name: 'It doesn’t', exact: true }))
      await wait(600)
    })

    await line('b08', async () => {
      await click(
        round
          .locator('button')
          .filter({ hasText: /^Collect it/ })
          .first(),
      )
      await wait(1000)
      await moveTo(round.getByText('conspicuous is yours', { exact: false }).first())
    })

    // ── Her words ──
    await line(
      'b09',
      async () => {
        await moveTo(page.getByText('conspicuous', { exact: true }).first())
        await moveTo(h.tab(/^Still learning/))
      },
      {
        pre: async () => {
          await click(round.locator('button').filter({ hasText: 'See My Words' }).first())
          await wait(900)
        },
      },
    )

    await line('b10', async () => {
      await moveTo(page.getByText('ready for another look', { exact: false }).first())
      await click(
        page
          .locator('button')
          .filter({ hasText: /^Review/ })
          .first(),
      )
      await wait(900)
    })

    await line('b11', async () => {
      await moveTo(page.getByText('Say what it means out loud', { exact: false }).first())
      await click(page.locator('.fc-card').first())
      await wait(900)
    })

    await line('b11b', async () => {
      await moveTo(page.locator('.fc-grade-btn--miss'))
      await moveTo(page.locator('.fc-grade-btn--knew'))
      await click(page.locator('.fc-grade-btn--knew'))
      await wait(600)
    })

    // The rest of the deck on the keyboard, the way the deck itself invites:
    // space flips, → got it, ← still learning. Two misses, so the summary has
    // something coming back tomorrow.
    await line('b11c', async () => {
      const counter = await page.locator('.fc').innerText()
      const left = Number(/of (\d+)/i.exec(counter)?.[1] ?? 1) - 1
      for (let i = 0; i < left; i++) {
        await page.keyboard.press('Space')
        await wait(260)
        await page.keyboard.press(i === 3 || i === 9 ? 'ArrowLeft' : 'ArrowRight')
        await wait(260)
      }
    })

    await line('b11d', async () => {
      await moveTo(page.locator('.fc-summary-h1'))
      await moveTo(page.getByText('Coming back tomorrow', { exact: true }).first())
    })

    await line('b11e', async () => {
      await click(page.getByRole('button', { name: 'Back to my words' }))
      await wait(800)
      await tap(h.tab(/^Sticking/))
      await wait(700)
      await tap(h.tab(/^Known well/))
      await wait(700)
    })

    await line(
      'b12',
      async () => {
        await click(
          page.locator('.fr-card').filter({ hasText: 'Jayden P.' }).locator('.fr-card-hit'),
        )
        await wait(900)
        await click(
          modal
            .locator('.tab')
            .filter({ hasText: /^Words/ })
            .first(),
        )
        await wait(700)
        await moveTo(modal.getByText('Words collected', { exact: true }).first())
      },
      {
        pre: async () => {
          await page.keyboard.press('Escape')
          await wait(500)
          await click(h.tab(/^Friends$/))
          await wait(900)
        },
      },
    )

    // ── The educator ──
    await line(
      'b13',
      async () => {
        await moveTo(page.getByText('Words collected this school year', { exact: false }).first())
        await moveTo(page.getByText('Students collecting this week', { exact: false }).first())
        await moveTo(page.getByText('Used correctly first try', { exact: false }).first())
      },
      {
        pre: async () => {
          await page.keyboard.press('Escape')
          await wait(400)
          await view('Word Report')
          await wait(1200)
        },
      },
    )

    await line('b14', async () => {
      await moveTo(page.getByText('The class word wall', { exact: true }).first(), { dy: 90 })
    })

    await line('b15', async () => {
      await moveTo(page.getByText('Where the words stop sticking', { exact: true }).first())
      await moveTo(page.getByText('Write your own', { exact: true }).first())
    })

    await line('b16', async () => {
      await reveal(page.getByText('Sentences students wrote', { exact: true }).first())
      await moveTo(page.getByText('Sentences students wrote', { exact: true }).first())
      await moveTo(page.getByText('Ethan Brooks', { exact: true }).first())
    })

    await line('b17', async () => {
      await h.scrollTop()
      await click(h.tab(/^By student/))
      await wait(900)
    })

    await line(
      'b18',
      async () => {
        await moveTo(h.tab(/^By student/))
        await wait(1200)
      },
      { gap: 1500 },
    )
    mark('end')
  },
}
