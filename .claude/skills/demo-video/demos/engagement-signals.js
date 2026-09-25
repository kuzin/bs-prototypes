// The Reading Engagement Signals walkthrough: the class page's Engagement tab,
// a declining reader's signal and what's driving it, Benny's questions and
// actions, stepping back through earlier windows, two more readers, and the
// card that leads the profile's Overview.
module.exports = {
  name: 'engagement-signals-demo',
  title: 'Reading Engagement Signals — demo',
  voice: 'am_michael',
  speed: 1.08,
  music: 'lofi-full.mp3',
  viewport: { width: 1440, height: 810 },
  // The picker's Demo videos tab.
  description:
    'A direction for every reader: the class page’s Engagement tab, a declining reader’s signal and what’s driving it, Benny’s questions and actions, earlier windows, and two more readers.',
  prototypes: ['engagement-signals'],
  posterLine: 's03',

  lines: [
    // ── The class page ──
    {
      id: 's01',
      chapter: 'The class page',
      screen: 'Class A → Engagement',
      text: 'Reading Engagement Signals gives every reader one simple signal: increasing, consistent, or declining. It lives on the class page teachers already use, as a new Engagement tab.',
    },
    {
      id: 's02',
      screen: 'The 30-day banner',
      text: 'Each signal compares a reader’s last thirty days with the thirty before, and it’s recalculated every night.',
    },
    {
      id: 's03',
      screen: 'Declining first',
      text: 'The list is sorted for triage. Readers who are declining come first, highlighted, so the students who need a conversation are right at the top.',
    },
    {
      id: 's04',
      screen: 'Days read and minutes',
      text: 'Beside each signal are the days [read](red) and the minutes over the same thirty days, with the change from the month before.',
    },
    {
      id: 's05',
      screen: 'Not enough data',
      text: 'A reader who has only just started logging shows not enough data. The signal waits for about three weeks of reading, instead of guessing.',
    },

    // ── A reader's signal ──
    {
      id: 's06',
      chapter: 'A reader’s signal',
      screen: 'Tyler → Engagement',
      text: 'Click a reader, and their profile opens right on the signal. Tyler is declining.',
    },
    {
      id: 's07',
      screen: 'Current signal',
      text: 'The reading comes first: three bands, from declining to increasing, with Tyler’s lit. It’s a direction, not a score, so there’s no new number competing with the [RMI](R M I).',
    },
    {
      id: 's08',
      screen: 'Benny says…',
      text: 'Benny explains what’s behind it. Tyler hasn’t logged anything in thirty days, and his minutes, Lexile, and motivation are all down.',
    },
    {
      id: 's09',
      screen: 'What’s driving it',
      text: 'Then the evidence. Six inputs feed the signal: how often and how much they read, how they log, Book Talks with Benny, the [RMI](R M I), and Words with Benny. For Tyler, every one of them is holding it back.',
    },
    {
      id: 's10',
      screen: 'Ask Tyler',
      text: 'Benny suggests questions to ask Tyler,',
    },
    {
      id: 's11',
      screen: 'Recommended actions',
      text: 'and actions to take, starting with a one-on-one this week.',
    },

    // ── Looking back ──
    {
      id: 's12',
      chapter: 'Looking back',
      screen: 'Period → Dec 17 – Jan 15',
      text: 'Step back through earlier thirty-day windows to see how the signal got here. In mid-January, Tyler was still consistent.',
    },
    {
      id: 's13',
      screen: 'A closed window',
      text: 'Questions and actions only appear for the current window, because they’re about what to do now.',
    },

    // ── Other readers ──
    {
      id: 's14',
      chapter: 'Other readers',
      screen: 'Anne → Increasing',
      text: 'Step to another reader. Anne is increasing: she’s reading on more days, and her flagged sessions are down. Even Benny’s face follows the signal.',
    },
    {
      id: 's15',
      screen: 'Lifting / holding back',
      text: 'Her inputs split into what’s lifting the signal, and what’s holding it back: two unfinished Book Talks.',
    },
    {
      id: 's16',
      screen: 'Marcus → Consistent',
      text: 'Marcus, the strongest reader in the class, is consistent. The signal measures change, not standing, and Benny still notices that his sittings are getting shorter.',
    },

    // ── The Overview ──
    {
      id: 's17',
      chapter: 'The Overview',
      screen: 'Reading Engagement card',
      text: 'On the profile’s Overview, the signal leads with a one-line headline, and a link straight to what’s driving it.',
    },
    {
      id: 's18',
      chapter: 'Close',
      screen: 'Class A → Engagement',
      text: 'That’s Reading Engagement Signals: a direction for every reader, the reasons behind it, and what to do next, on the pages teachers already use.',
    },
  ],

  async script(h) {
    const { page, go, wait, reveal, moveTo, click, line, mark } = h
    const row = (name) => page.locator('.ce tbody tr').filter({ hasText: name }).first()
    const head = (name) => page.locator('.ce thead th').filter({ hasText: name }).first()
    const modal = page.locator('.modal')
    const text = (t) => modal.getByText(t, { exact: true }).first()
    const period = modal
      .locator('select')
      .filter({ has: page.locator('option', { hasText: '(current)' }) })
    const prevStudent = modal.locator('button[aria-label^="Previous student"]')

    await go('/engagement-signals/')
    mark('start')

    // ── The class page ──
    await line('s01', async () => {
      await moveTo(h.tab(/^Engagement$/))
      await moveTo(head('Signal'))
    })

    await line('s02', async () => {
      await moveTo(page.locator('.ce > *').first(), { dx: -180 })
    })

    await line('s03', async () => {
      await moveTo(row('Tyler Voss'), { dx: -120 })
      await moveTo(row('Zara Mahmood'), { dx: -120 })
    })

    await line('s04', async () => {
      await moveTo(head('Days read'))
      await moveTo(row('Omar Haddad').locator('td').nth(2))
      await moveTo(row('Omar Haddad').locator('td').nth(3))
    })

    await line('s05', async () => {
      await moveTo(row('Jonah Whitfield').locator('.es-pill'))
    })

    // ── A reader's signal ──
    await line('s06', async () => {
      await click(row('Tyler Voss').locator('td').first())
      await wait(900)
      await moveTo(text('Engagement'))
    })

    await line('s07', async () => {
      await moveTo(modal.locator('.es-heat-seg--on'))
      await moveTo(modal.locator('.es-heat-seg').last())
    })

    await line('s08', async () => {
      await moveTo(modal.getByText('nothing in 30 days').first())
      await moveTo(modal.getByText('down 20 points').first())
    })

    await line('s09', async () => {
      await moveTo(text('What’s driving it'))
      await moveTo(modal.locator('.es-group').first())
      await moveTo(text('Reading frequency and consistency'))
      await moveTo(text('Book Talks with Benny'))
      await moveTo(text('Words with Benny'))
    })

    await line('s10', async () => {
      await moveTo(text('Ask Tyler'))
      await moveTo(modal.locator('.es-ask li').first())
    })

    await line('s11', async () => {
      await moveTo(text('Recommended actions'))
      await moveTo(text('One-on-one this week'))
    })

    // ── Looking back ──
    await line('s12', async () => {
      await moveTo(period)
      await period.selectOption('1') // Dec 17 – Jan 15
      await wait(700)
      await moveTo(modal.locator('.es-heat-seg--on'))
    })

    await line('s13', async () => {
      await moveTo(text('What’s driving it'))
      await moveTo(modal.locator('.bp-statlist .bp-statrow').last(), { dy: 40 })
    })

    // ── Other readers ──
    await line(
      's14',
      async () => {
        await moveTo(modal.locator('.es-heat-seg--on'))
        await moveTo(modal.getByText('down from 7 to 4').first())
      },
      { pre: () => click(prevStudent) },
    )

    await line('s15', async () => {
      await moveTo(modal.locator('.es-group').filter({ hasText: 'Lifting the signal' }))
      await moveTo(modal.locator('.es-group').filter({ hasText: 'Holding it back' }))
      await moveTo(text('Book Talks with Benny'))
    })

    await line(
      's16',
      async () => {
        await moveTo(modal.locator('.es-heat-seg--on'))
        await moveTo(modal.getByText('down 9%').first())
      },
      { pre: () => click(prevStudent) },
    )

    // ── The Overview ──
    await line(
      's17',
      async () => {
        await moveTo(text('Reading Engagement'))
        await moveTo(modal.locator('.bp-latest-link').filter({ hasText: 'driving it' }))
      },
      {
        pre: async () => {
          await click(modal.locator('.bp-nav-item').filter({ hasText: /^Overview$/ }))
          await wait(700)
        },
      },
    )

    await line(
      's18',
      async () => {
        await moveTo(head('Signal'))
        await wait(1200)
      },
      {
        pre: async () => {
          await click(page.locator('button[aria-label="Close profile"]').first())
          await wait(600)
        },
        gap: 1500,
      },
    )
    mark('end')
  },
}
