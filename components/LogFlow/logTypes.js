/* ─── The nine log types ──────────────────────────────────────────────────────
   `LogType` in the app. Product model rather than fixture data — the ids are
   the app's own `short_name`s — so it travels with the component that reads
   it rather than with any one prototype's demo data. */

/**
 * The nine kinds of reading a site can log — `LogType` in the app, where the
 * ids below are its `short_name`s. A site turns on the ones its challenges are
 * built from, and the reader is asked to choose between them only when there is
 * more than one (`single_logging_destination`).
 *
 *   valueLabel   the label over the amount field (`form_inputs/_*_input`)
 *   unit         what the counterfeit warner calls it — "a lot of minutes"
 *   withoutTitle the four that are never about a book, so the flow skips the
 *                title search for them (`source=without_title`)
 *   fields       the extra questions this type asks instead of an amount
 */
export const LOG_TYPES = {
  minute: {
    id: 'minute',
    name: 'Minutes',
    unit: 'minute',
    icon: 'clock',
    valueLabel: 'Time Spent Reading',
    input: 'time',
    timer: true,
  },
  book: {
    id: 'book',
    name: 'Books',
    unit: 'book',
    icon: 'book',
    // `batch_logging_label` — a site logging titles read asks the first, one
    // logging re-reads asks the second.
    valueLabel: 'How many times did you complete this book?',
    input: 'count',
  },
  page: {
    id: 'page',
    name: 'Pages',
    unit: 'page',
    icon: 'file-text',
    valueLabel: 'How many pages were read?',
    input: 'count',
  },
  hour: {
    id: 'hour',
    name: 'Hours',
    unit: 'hour',
    icon: 'hourglass',
    valueLabel: 'How many hours were read?',
    input: 'count',
  },
  day: {
    id: 'day',
    name: 'Days',
    unit: 'day',
    icon: 'calendar',
    // A day is one day; what it asks for instead is what you did with it.
    input: 'none',
    fields: [{ name: 'description', label: 'What did you read or do?' }],
  },
  moment: {
    id: 'moment',
    name: 'Moments',
    unit: 'moment',
    icon: 'bulb',
    withoutTitle: true,
    input: 'none',
    fields: [
      { name: 'description', label: 'Describe the learning moment', type: 'textarea', rows: 4 },
    ],
  },
  event: {
    id: 'event',
    name: 'Events',
    unit: 'event',
    icon: 'building-community',
    withoutTitle: true,
    input: 'none',
    fields: [
      { name: 'event', label: 'Event Name' },
      { name: 'eventType', label: 'Event Type', type: 'select', options: 'eventTypes' },
    ],
  },
  video: {
    id: 'video',
    name: 'Videos',
    unit: 'video',
    icon: 'movie',
    withoutTitle: true,
    input: 'none',
    fields: [{ name: 'title', label: 'Video or Film title', required: true }],
  },
  magazine: {
    id: 'magazine',
    name: 'Magazines',
    unit: 'magazine',
    icon: 'news',
    withoutTitle: true,
    input: 'none',
    fields: [{ name: 'title', label: 'News or Magazines title', required: true }],
  },
}

// `EventType` is per-site and the staff name them, so these are one library's.
export const EVENT_TYPES = [
  'Story Time',
  'Author Visit',
  'Book Club',
  'Craft Program',
  'Summer Kickoff',
  'Teen Night',
]

/**
 * `LogTypeMicrosite#warning_value` / `#limit_value` — the two thresholds a site
 * sets per log type. Over the warning you are asked whether you're sure and
 * made to promise; at the limit you can't log it at all. Only enforced for an
 * unverified student on a rostered site (`LogLimitWarning`).
 */
export const LOG_LIMITS = {
  minute: { warn: 90, limit: 360 },
  page: { warn: 150, limit: 600 },
  hour: { warn: 3, limit: 8 },
  book: { warn: 5, limit: 20 },
}

// The days this reader has already logged, so the picker can mark them. The
// calendar only ever shows the current month and the ones behind it.
export const LOGGED_DATES = [-1, -2, -3, -5, -8, -9, -12, -15, -16, -20]
