// Date and number formatting, matching the strftime patterns the app's views
// use so a screenshot of this reads like a screenshot of that.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parse(iso) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return { y, m, d }
}

/** `%-m/%-d/%y` — the index list's compact form, e.g. 9/8/25. */
export function formatShort(iso) {
  const { y, m, d } = parse(iso)
  return `${m}/${d}/${String(y).slice(2)}`
}

/** `%m/%d/%Y` — the index header's form, e.g. 09/08/2025. */
export function formatLong(iso) {
  const { y, m, d } = parse(iso)
  return `${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}/${y}`
}

export function formatRange(startIso, endIso) {
  return `${formatShort(startIso)} – ${formatShort(endIso)}`
}

export function formatLongRange(startIso, endIso) {
  return `${formatLong(startIso)} - ${formatLong(endIso)}`
}

/** `%b %e at %l:%M %P` — "Sep 26 at 4:42 pm", under the Benny bubble. */
export function formatAnalysedAt(iso) {
  const { m, d } = parse(iso)
  const time = iso.slice(11, 16)
  let [h, min] = time.split(':').map(Number)
  const meridiem = h >= 12 ? 'pm' : 'am'
  h = h % 12 || 12
  return `${MONTHS[m - 1]} ${d} at ${h}:${String(min).padStart(2, '0')} ${meridiem}`
}

export function percentComplete(index) {
  return Math.round((index.responses.length / index.totalStudents) * 100)
}

/** "21 of 24" — the "Results collected" tag in the index header. */
export function fractionCollected(index) {
  return `${index.responses.length} of ${index.totalStudents}`
}
