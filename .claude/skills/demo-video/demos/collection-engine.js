// The Collection Engine walkthrough: the reader app (Discover, Ask Benny, the
// Wish List, logging with Read now and what Benny suggests next, a book's page
// tab by tab, requesting a title, the Book Quiz), then the school, district and
// teacher views — the engine's signals and a student's recommendations — and
// Book Lists.
//
// Each line is narration; `script` plays the clicks under it, one `line()` per
// narration line, in order. `screen` and `chapter` only feed the written script.
module.exports = {
  name: 'collection-engine-demo',
  title: 'Collection Engine — demo',
  voice: 'am_michael',
  speed: 1.08,
  // Licensed (Envato Elements) — in the skill's music/ folder.
  music: 'lofi-full.mp3',
  viewport: { width: 1440, height: 810 },
  // The picker's Demo videos tab.
  description:
    "The reader side — where every book is, Ask Benny, the Wish List, logging with Read now and what's next, a book's page tab by tab, the Book Quiz — then the school, district and teacher views, how the engine decides, and Book Lists.",
  prototypes: [
    'books',
    'collection-engine',
    'collection-engine-district',
    'collection-engine-teacher',
    'discover-lists',
  ],
  posterLine: 'r01',

  lines: [
    // ── Reader: Discover ──
    {
      id: 'r01',
      chapter: 'Reader — Discover',
      screen: 'Discover',
      text: "Here's a tour of the Collection Engine prototypes, starting where readers see it: Discover, in the student app.",
    },
    {
      id: 'r02',
      screen: 'Where tags and read-now marks',
      text: "Every title shows where a reader can actually get it: Comics Plus, Epic, Sora, their classroom shelf, or the school library. A play button in the app's own colour means they can open it right now.",
    },
    {
      id: 'r03',
      screen: 'Mr. Reyes’s Class Picks',
      text: "That classroom shelf is their teacher's Book List, the same Book Lists teachers already keep, and it shows up right here on Discover, as a shelf of its own.",
    },
    {
      id: 'r04',
      screen: 'Ask Benny',
      text: "Readers can also ask Benny for whatever they're in the mood for, in their own words.",
    },
    {
      id: 'r05',
      screen: 'Benny’s answer',
      text: 'Benny answers with a row of books, and every one still shows where the reader can get it.',
    },
    {
      id: 'r06',
      screen: 'Bookmark a book → Wish List',
      text: 'Anything that looks good goes on their Wish List with one tap.',
    },
    {
      id: 'r07',
      screen: 'The Wish List',
      text: "The Wish List keeps it all in one place: what they're reading now, what they want to read next, and what they've finished.",
    },

    // ── Reader: logging ──
    {
      id: 'l01',
      chapter: 'Reader — Logging reading',
      screen: 'Log Reading → Benny’s Picks in the log',
      text: "Logging starts by picking the book, and Benny's picks are right there in the log, too.",
    },
    {
      id: 'l02',
      screen: 'The One and Only Ivan → Read in Epic',
      text: 'A book with a play button opens right inside Beanstack, here in Epic.',
    },
    {
      id: 'l03',
      screen: 'Finish reading → the log, filled in',
      text: "When they're done, the log is already filled in: how long they read, and that they finished the book.",
    },
    {
      id: 'l04',
      screen: 'Log it → badge, reward, tickets',
      text: 'One tap to log it, and the celebration follows: a new badge, a reward, and tickets for prize drawings.',
    },
    {
      id: 'l05',
      screen: 'What Benny would read next',
      text: "And because they just finished a book, Benny's right there with what to read next, each with a reason, and one tap to save it to their Wish List.",
    },

    // ── Reader: a book's page ──
    {
      id: 'p01',
      chapter: 'Reader — A book’s page',
      screen: 'The One and Only Ivan — Where to read',
      text: 'Every title has its own page, and Where to read comes first: here, Epic, Sora, their classroom shelf, and the school library, with Read now in the colour of the app it opens in.',
    },
    {
      id: 'p02',
      screen: 'Overview',
      text: 'The Overview has Benny’s take, a quick synopsis, what the book is about, its themes, and which friends have read it.',
    },
    {
      id: 'p03',
      screen: 'Reading Log tab + Your stats',
      text: 'The Reading Log tab shows every session they’ve logged for this book, including the one they just logged, with their stats alongside.',
    },
    {
      id: 'p04',
      screen: 'Reviews tab — ratings, the review form, Add a photo',
      text: "Reviews for each title live here now, too: the book's ratings, and a place to write a review, or add a photo of a drawing.",
    },
    {
      id: 'p05',
      screen: 'A picture review',
      text: 'That makes it a picture review, and picture reviews show up right alongside the written ones, on the page of the book they’re about.',
    },
    {
      id: 'p06',
      screen: 'Details → More Like This',
      text: 'Details has the reading level, the age range, the length, and any awards. And More Like This is what readers of this book liked next.',
    },
    {
      id: 'p07',
      screen: 'The Crossover — Request this title → Requested!',
      text: "If none of the school's sources carry a book, the reader sees that honestly, and can request it. That request goes straight to the school library.",
    },

    // ── Reader: the Book Quiz ──
    {
      id: 'q01',
      chapter: 'Reader — Book Quiz',
      screen: 'Quiz banner → the quiz',
      text: "Benny's Book Quiz is new, too: a quick, playful mix of questions.",
    },
    {
      id: 'q02',
      screen: 'Quiz steps',
      text: 'Kinds of stories, this or that, story openings, covers to tap, how they like to read, and how long. And every answer is matched against the real catalog.',
    },
    {
      id: 'q03',
      screen: 'Six picks → Add to Wish List → Benny’s Picks updated',
      text: "At the end, Benny picks six books the reader can save to their Wish List, and their answers update Benny's Picks on Discover.",
    },

    // ── School ──
    {
      id: 'a01',
      chapter: 'School — Collection Engine',
      screen: 'Collection Health',
      text: "Now, the librarian's side. The school view leads with collection health: is the collection keeping up with what readers want? Green, yellow, or red, with the reasons right underneath.",
    },
    {
      id: 'a02',
      screen: 'Health signals',
      text: "Genres readers have outgrown, requests the collection can't answer, and titles that never get recommended.",
    },
    {
      id: 'a03',
      screen: 'Collections & Formats',
      text: 'Collections and Formats compares every source side by side: the library catalog, classroom libraries, Sora, Comics Plus, and Epic, then print, ebook, and audiobook.',
    },
    {
      id: 'a04',
      screen: 'Classroom Libraries',
      text: "Classroom libraries are the Book Lists teachers already keep, so there's nothing new to set up, and this ranks each one by how much of it gets read off a recommendation.",
    },
    {
      id: 'a05',
      screen: 'Top Titles',
      text: 'And Top Titles shows the books the engine suggests most, and where each one lives.',
    },
    {
      id: 'a06',
      screen: 'Collection → All Titles',
      text: 'The Collection page lists every title the engine can recommend, filterable by genre, source, and format.',
    },
    {
      id: 'a07',
      screen: 'Requests — The Crossover, New request',
      text: "And here's that reader's request, at the top of Requests, right alongside everything students have asked Benny for that the collection can't answer yet.",
    },
    {
      id: 'a08',
      screen: 'Gaps & Strengths',
      text: 'Gaps and Strengths shows where readers have outgrown the shelf, and where the collection is strong.',
    },

    // ── School: how the engine decides ──
    {
      id: 'e01',
      chapter: 'How the engine decides',
      screen: 'Setup — catalogs',
      text: "Here's how the engine decides. It only ever recommends books from the catalogs switched on in Setup, so every suggestion is one the school can actually give the reader. Each catalog stays fresh: sync Sora or Epic, or upload a new MARC file.",
      say: "Here's how the engine decides. It only ever recommends books from the catalogs switched on in Setup, so every suggestion is one the school can actually give the reader. Each catalog stays fresh: sync Sora or Epic, or upload a new mark file.",
    },
    {
      id: 'e02',
      screen: 'Would they want it — the signals',
      text: "Then the AI works out what each reader would actually want, from five signals: their Wish List, what they've read, including the next book in a series they're partway through, the genres their reading motivation points to, their ratings and reviews, and what their class is reading.",
    },
    {
      id: 'e03',
      screen: 'How much each signal counts',
      text: 'The school sets how much each signal counts, from not used to counts a lot, and the engine turns all of it into a shelf for every reader, with the reason each book is on it.',
    },

    // ── District ──
    {
      id: 'd01',
      chapter: 'District',
      screen: 'District health roll-up',
      text: 'At the district level, it all rolls up: which schools are healthy, which need attention, and which are at risk, with Benny pointing to the one to look at first.',
    },
    {
      id: 'd02',
      screen: 'Schools → Collection intelligence',
      text: 'You can compare every school side by side, and see what readers across the district are asking the catalogs for.',
    },
    {
      id: 'd03',
      screen: 'District Setup — catalog connections',
      text: "District setup shows every school's catalog connections at a glance, because a school is only as good as its feed.",
    },

    // ── Teacher ──
    {
      id: 't01',
      chapter: 'Teacher',
      screen: 'Class A — Recommendations',
      text: 'Teachers get the classroom view: every book the engine has recommended to their class, all of it already in a catalog the school owns, and filterable by where it lives.',
    },
    {
      id: 't02',
      screen: 'Add to the class Book List → Book List',
      text: "One tap adds a recommendation to the class Book List, the same Book List teachers already keep, and it shows up on every student's Discover page.",
    },
    {
      id: 't03',
      screen: 'Marcus Chen → Recommendations',
      text: "On a student's profile, the Recommendations tab shows every book the engine has suggested for them, split into the ones they've added to their Wish List, and the ones they haven't yet.",
    },
    {
      id: 't04',
      screen: 'List view — the signal behind each title',
      text: 'In the list view, each title shows the signal that put it there: their reading motivation, their ratings and reviews, what their class is reading, what they have read, their reading patterns, or their reading level.',
    },
    {
      id: 't05',
      screen: 'Wish List tab',
      text: "The Wish List tab is the student's own list: what they want to read, what they're reading, and what they've finished, with the books they picked themselves marked apart from the engine's.",
    },
    {
      id: 't06',
      screen: 'Genres tab → Print list',
      text: 'And Genres suggests the kinds of books to try next, each with one clear reason why. The whole list prints, too.',
    },

    // ── Book Lists ──
    {
      id: 'b01',
      chapter: 'Book Lists',
      screen: 'Book Lists (media specialist)',
      text: "Finally, Book Lists. Media specialists curate the lists readers see on Discover, in the order readers meet them, including each class's own list, set by its teacher, and can show, hide, or reorder any of them.",
    },
    {
      id: 'b02',
      screen: 'Create a list → Add a book → Web Search',
      text: 'Creating a list uses the real Book List form, with books from your curated catalog, or a web search.',
    },

    // ── Close ──
    {
      id: 'o01',
      chapter: 'Close',
      screen: 'Back to Discover',
      text: "That's the Collection Engine: helping every reader find a book they can actually get, and showing schools exactly where their collection can grow.",
    },
  ],

  async script(h) {
    const { page, go, wait, settle, reveal, moveTo, click, tap, type, tab, scrollTop, line, mark } =
      h
    const nav = (re) => page.locator('a, button').filter({ hasText: re }).first()
    const discover = async () => {
      await click(tab(/^Discover/))
      await settle()
    }
    const bookTab = (re) =>
      page.locator('.bkp-tabs .tab, .bkp-tabs [role=tab]').filter({ hasText: re }).first()

    // A clean slate: no title requests left over from an earlier run.
    await go('/books/')
    await page.evaluate(() => localStorage.removeItem('bsp:title-requests'))
    await go('/books/')
    await discover()
    mark('start')

    // ── Reader: Discover ──
    await line('r01', () => moveTo(page.locator('.bk-quiz-banner'), { dx: -300 }))

    await line('r02', async () => {
      const tags = page.locator('.bk-card-where')
      await reveal(tags.first())
      await moveTo(tags.first())
      await moveTo(tags.nth(2))
      await moveTo(
        page
          .locator('.bk-card')
          .filter({ has: page.locator('.rnm') })
          .first()
          .locator('.rnm'),
      )
    })

    await line('r03', async () => {
      const shelf = page.getByText('Mr. Reyes’s Class Picks').first()
      await reveal(shelf)
      await moveTo(shelf)
      await moveTo(page.locator('.bk-card-where').filter({ hasText: 'Mr. Reyes’s Class' }).first())
    })

    await line('r04', async () => {
      await scrollTop()
      await type(page.locator('.bk-ask input'), 'funny graphic novels')
      await click(page.locator('.bk-ask-form button[type=submit]'))
    })

    await line('r05', async () => {
      await page.locator('.bk-ask-shelf .bk-card').first().waitFor()
      await wait(300)
      await moveTo(page.locator('.bk-ask-answer-text'))
      await moveTo(page.locator('.bk-ask-shelf .bk-card-where').nth(1))
    })

    await line('r06', async () => {
      await click(page.locator('.bk-ask-shelf .bk-card-wish:not(.is-on)').first())
      await wait(900)
    })

    await line(
      'r07',
      async () => {
        await moveTo(tab(/^Currently reading/))
        await click(tab(/^Want to read/))
        await wait(600)
        await moveTo(page.locator('.bk-shelftile-where').first(), { scroll: false })
        await click(tab(/^All/))
      },
      {
        pre: async () => {
          await click(tab(/^Wish List/))
          await settle()
        },
      },
    )

    // ── Reader: logging ──
    await line(
      'l01',
      async () => {
        await moveTo(page.locator('.lf-tile').first())
        await moveTo(page.locator('.lf-tile[aria-label="The One and Only Ivan"]'))
      },
      {
        pre: async () => {
          await click(nav(/^Log Reading$/))
          await wait(900)
        },
      },
    )

    await line('l02', async () => {
      await click(page.locator('.lf-tile[aria-label="The One and Only Ivan"]'))
      await click(page.getByText('Read in Epic').first())
      await wait(1200)
      for (let i = 0; i < 3; i++)
        await click(page.getByRole('button', { name: 'Next page' }), { after: 700 })
    })

    await line(
      'l03',
      async () => {
        await moveTo(page.getByText('Time Spent Reading').first())
        await moveTo(page.getByText('Finished', { exact: true }).first())
      },
      {
        pre: async () => {
          await click(page.getByRole('button', { name: 'Finish reading' }))
          await wait(900)
        },
      },
    )

    await line('l04', async () => {
      await click(page.getByRole('button', { name: 'Log Reading' }).last())
      await wait(1400)
      await moveTo(page.getByText('Badge Earned').first())
      await moveTo(page.getByText('Sticker Pack').first())
    })

    await line('l05', async () => {
      await reveal(page.locator('.lf-nextup'))
      await moveTo(page.locator('.lf-nextup-reason').first())
      await click(
        page.locator('.lf-nextup-book .btn').filter({ hasText: 'Add to Wish List' }).first(),
      )
      await wait(700)
    })

    // ── Reader: a book's page ──
    await line(
      'p01',
      async () => {
        await moveTo(page.getByText('Where to read', { exact: true }).first())
        await moveTo(page.locator('.bk-where-row').filter({ hasText: 'Epic' }).first())
        await moveTo(page.locator('.bk-where-row').last())
        await moveTo(page.locator('.bkp-buttons .btn').filter({ hasText: 'Read now' }).first())
      },
      {
        pre: async () => {
          await click(page.locator('.lf-success-actions .btn').filter({ hasText: 'Finish' }))
          await wait(700)
          await discover()
          await click(
            page
              .locator('.bk-card')
              .filter({ has: page.locator('img[alt="The One and Only Ivan"]') })
              .first()
              .locator('.bk-card-coverwrap'),
          )
          await settle()
          await scrollTop()
        },
      },
    )

    await line('p02', async () => {
      await moveTo(page.getByText('Benny’s take').first())
      await moveTo(page.getByText('Quick Synopsis').first())
      await moveTo(page.getByText('Themes', { exact: true }).first())
      await moveTo(page.getByText('Friends who read this').first())
    })

    await line('p03', async () => {
      await click(bookTab(/^Reading Log/))
      await wait(700)
      await moveTo(page.locator('.bkp-sessions tbody tr').first())
      await moveTo(page.getByText('Your stats', { exact: true }).first())
    })

    await line('p04', async () => {
      await click(bookTab(/^Reviews/))
      await wait(700)
      await moveTo(page.getByText('Ratings and reviews').first())
      await moveTo(page.getByText('What did you think?').first())
      await moveTo(page.getByText('Add a photo').first())
    })

    await line('p05', async () => {
      await reveal(page.locator('.bk-review-pic').first())
      await moveTo(page.locator('.bk-review-pic').first())
    })

    await line('p06', async () => {
      await click(bookTab(/^Details/))
      await wait(900)
      await moveTo(page.getByText('Reading level').first())
      await click(bookTab(/^More Like This/))
      await wait(900)
      await moveTo(page.locator('.bkp-panel .bk-card').first())
    })

    await line(
      'p07',
      async () => {
        await moveTo(page.locator('.bkp-aside .emp').first())
        await click(
          page.locator('.bkp-aside .emp button').filter({ hasText: 'Request this title' }),
        )
        await wait(900)
      },
      {
        pre: async () => {
          await click(tab(/^Wish List/))
          await settle()
          await click(
            page.locator('button:has(img[alt*="Crossover"]), [aria-label*="Crossover"]').first(),
          )
          await settle()
          await scrollTop()
        },
      },
    )

    // ── Reader: the Book Quiz ──
    const cta = () => page.locator('.bkq .btn--lg').first()
    const pick = (i) => page.locator('.bkq .rmi-survey-answer').nth(i)
    await line(
      'q01',
      async () => {
        await click(page.locator('.bk-quiz-banner .wa-banner-actions .btn'))
        await wait(1500)
      },
      { pre: discover, gap: 150 },
    )

    await line('q02', async () => {
      await tap(cta()) // Let's Go
      await tap(pick(0))
      await tap(pick(2))
      await tap(cta())
      await tap(pick(0))
      await tap(cta())
      await tap(pick(1))
      await tap(cta())
      await tap(pick(2))
      await tap(cta())
      await tap(pick(1))
      await tap(pick(4))
      await tap(cta())
      await tap(pick(0))
      await tap(cta())
      await tap(pick(1))
      await tap(cta()) // Finish
      await wait(900)
      await tap(cta()) // See My Books
    })

    await line('q03', async () => {
      // A pick that isn't on the Wish List already — the first one may be.
      const add = page.locator('.bkq-pick .btn').filter({ hasText: 'Add to Wish List' }).first()
      await moveTo(page.locator('.bkq-pick').nth(2))
      await click(add)
      await wait(500)
      await click(page.locator('.bkq .btn--lg').filter({ hasText: 'Close' }))
      await wait(600)
      await moveTo(page.locator('.bk-quiz-banner'), { dx: -250 })
      await moveTo(page.getByText('Updated from your Book Quiz', { exact: false }).first())
    })

    // ── School ──
    await line(
      'a01',
      async () => {
        await wait(1200)
        await moveTo(page.getByText('Collection Health', { exact: true }).nth(1))
        await reveal(page.getByText('Genre outgrown').first())
      },
      { pre: () => go('/collection-engine/') },
    )

    await line('a02', async () => {
      await moveTo(page.getByText('Genre outgrown').first())
      await moveTo(page.getByText('Requests unanswered').first())
      await moveTo(page.getByText('Never recommended').last())
    })

    await line('a03', async () => {
      await click(tab(/^Collections & Formats/))
      await wait(700)
      await moveTo(page.getByText('By collection', { exact: true }).first())
      await moveTo(page.getByText('By format', { exact: true }).first())
    })

    await line('a04', async () => {
      await click(tab(/^Classroom Libraries/))
      await wait(700)
      await moveTo(page.locator('.tbl tbody tr').first())
      await moveTo(page.locator('.tbl tbody tr').nth(2))
    })

    await line('a05', async () => {
      await click(tab(/^Top Titles/))
      await wait(700)
      await moveTo(page.locator('.tbl tbody tr').first())
    })

    await line(
      'a06',
      async () => {
        await moveTo(page.locator('.search-input').first())
        await moveTo(page.locator('.tbl tbody tr').first())
        await moveTo(page.locator('.tbl tbody tr').nth(3))
      },
      {
        pre: async () => {
          await scrollTop()
          await click(nav(/^CollectionWhat readers/))
          await settle()
        },
      },
    )

    await line('a07', async () => {
      await click(tab(/^Requests/))
      await wait(700)
      await moveTo(page.locator('.ce-asked').first())
      await moveTo(page.locator('.ce-asked .pill').first())
    })

    await line('a08', async () => {
      await click(tab(/^Gaps & Strengths/))
      await wait(700)
      await moveTo(page.locator('.tbl tbody tr').first())
    })

    // ── School: how the engine decides ──
    await line(
      'e01',
      async () => {
        await moveTo(page.getByText('Catalogs the engine recommends from').first())
        await moveTo(page.locator('button').filter({ hasText: 'Sync now' }).first())
        await moveTo(page.locator('button').filter({ hasText: 'Upload a MARC file' }).first())
      },
      {
        pre: async () => {
          await click(nav(/^SetupWhich catalogs/))
          await settle()
        },
      },
    )

    await line('e02', async () => {
      await reveal(page.getByText('Would they want it').first())
      await moveTo(
        page.getByText('Titles the reader saved for themselves', { exact: false }).first(),
      )
      await moveTo(page.getByText('Finished books, their authors', { exact: false }).first())
      await moveTo(page.getByText('The three genres the RMI names', { exact: false }).first())
      await moveTo(page.getByText('What they liked, not only', { exact: false }).first())
      await moveTo(page.getByText('Trending in their grade', { exact: false }).first())
    })

    await line('e03', async () => {
      // The weights are selects — point at them, and turn one up on camera.
      const weights = page.locator('select')
      await moveTo(weights.first())
      await moveTo(weights.nth(4))
      await weights.nth(4).selectOption({ label: 'Counts a lot' })
      await wait(900)
    })

    // ── District ──
    await line(
      'd01',
      async () => {
        await wait(900)
        await moveTo(page.getByText('Hillcrest Elementary').first(), { scroll: false })
        await reveal(page.getByText('District Collection Health').first())
        await moveTo(page.getByText('At risk', { exact: true }).first())
        await moveTo(page.getByText('Healthy', { exact: true }).first())
      },
      { pre: () => go('/collection-engine-district/') },
    )

    await line('d02', async () => {
      await scrollTop()
      await click(tab(/^Schools/))
      await wait(900)
      await click(nav(/^Collection intelligence/))
      await wait(900)
    })

    await line(
      'd03',
      async () => {
        await moveTo(page.getByText('A school is only as good as its feed').first())
        await moveTo(page.getByText('Hillcrest Elementary').first())
      },
      {
        pre: async () => {
          await click(nav(/^SetupRollout/))
          await settle()
        },
      },
    )

    // ── Teacher ──
    await line(
      't01',
      async () => {
        await moveTo(page.getByText('Books the engine has recommended to this class').first())
        await moveTo(
          page
            .locator('select, .sel, [class*=select]')
            .filter({ hasText: /All sources/ })
            .first(),
        )
        await moveTo(page.locator('.bkcov, img').nth(3), { scroll: false })
      },
      {
        pre: async () => {
          await go('/collection-engine-teacher/')
          await wait(1200)
        },
      },
    )

    await line('t02', async () => {
      await click(page.locator('button[aria-label="Add to the class Book List"]').first())
      await wait(500)
      await click(tab(/^Book List$/))
      await wait(700)
      await moveTo(page.getByText('Books on this list').first())
    })

    const modal = page.locator('.modal--side')
    await line(
      't03',
      async () => {
        await moveTo(modal.getByText('Added to their Wish List', { exact: false }).first())
        await moveTo(modal.getByText('Not added to their Wish List', { exact: false }).first())
      },
      {
        pre: async () => {
          await click(tab(/^Daily Reading$/))
          await wait(600)
          await click(page.getByText('Marcus Chen').first())
          await wait(900)
          await click(modal.getByText('Recommendations', { exact: true }).first())
          await wait(800)
        },
      },
    )

    await line('t04', async () => {
      await click(
        modal
          .locator('button, [role=tab], .tab')
          .filter({ hasText: /^List$/ })
          .first(),
      )
      await wait(700)
      await moveTo(modal.getByText('Reading motivation', { exact: true }).first())
      await moveTo(modal.getByText('What their class is reading', { exact: true }).first())
      await moveTo(modal.getByText('Reading level', { exact: true }).first())
    })

    await line('t05', async () => {
      await click(
        modal
          .locator('.tab, [role=tab]')
          .filter({ hasText: /^Wish List/ })
          .first(),
      )
      await wait(700)
      await moveTo(modal.getByText('Their own pick', { exact: true }).first())
      await moveTo(modal.getByText('Reading now', { exact: false }).first())
    })

    await line('t06', async () => {
      await click(
        modal
          .locator('.tab, [role=tab]')
          .filter({ hasText: /^Genres/ })
          .first(),
      )
      await wait(700)
      await moveTo(modal.getByText('Genres we recommend', { exact: false }).first())
      await moveTo(modal.getByText('Print list', { exact: true }).first())
    })

    // ── Book Lists ──
    await line(
      'b01',
      async () => {
        await moveTo(page.getByText('Graphic Novels We Love').first())
        await moveTo(page.getByText('The reader’s classroom list').first())
        const summer = page.locator('tr').filter({ hasText: 'Summer Reading 2026' })
        await click(summer.locator('.tgl').first())
        await moveTo(summer.locator('button[aria-label="Move up"]').first(), { scroll: false })
      },
      { pre: () => go('/discover-lists/') },
    )

    await line('b02', async () => {
      await click(nav(/^Create a list$/))
      await wait(700)
      await moveTo(page.getByText('Suggested grade levels', { exact: false }).first())
      await click(
        page
          .locator('button')
          .filter({ hasText: /^Add a book$/ })
          .first(),
      )
      await wait(700)
      await click(
        page.locator('[role=dialog], .modal').getByText('Web Search', { exact: true }).first(),
      )
      await wait(900)
    })

    // ── Close ──
    await line(
      'o01',
      async () => {
        await moveTo(page.locator('.bk-quiz-banner'), { dx: -300 })
        await wait(1500)
      },
      {
        pre: async () => {
          await go('/books/')
          await discover()
        },
        gap: 1500,
      },
    )
    mark('end')
  },
}
