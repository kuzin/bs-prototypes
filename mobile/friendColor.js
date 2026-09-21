/**
 * `utils/helpers/updateFriendColor.js` — the per-friend colour.
 *
 * A friend has no stored colour. Their name is hashed to a 32-bit integer, three bytes of it are
 * read as RGB, and only the HUE of that is kept; saturation and lightness are then fixed. So the
 * colour is derived, stable for a given name, and always in the same family — you cannot get a
 * muddy one, and the same person is the same colour on every device and every screen they appear
 * on.
 *
 * Three values come out at that one hue:
 *   header      80% / 90%  — the wash behind their profile header
 *   background  80% / 85%  — their avatar disc
 *   text        80% / 30%  — their initials, dark enough to sit on the disc
 *
 * The hash is the one in the source, quirks included: `charCodeAt + (hash << 5) - hash`, then
 * three bytes taken low-first, which is why the colour is not the obvious one for a name.
 */
const HUE_MAX = 360
const SATURATION = 80

function stringToBytes(str) {
  let hash = 0
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const bytes = []
  for (let i = 0; i < 3; i += 1) bytes.push((hash >> (i * 8)) & 0xff)
  return bytes
}

/** The hue of an RGB triple, in degrees. Saturation and lightness are discarded. */
function hueOf(r, g, b) {
  const rd = r / 255
  const gd = g / 255
  const bd = b / 255
  const max = Math.max(rd, gd, bd)
  const min = Math.min(rd, gd, bd)
  if (max === min) return 0
  const d = max - min
  let h
  if (max === rd) h = (gd - bd) / d + (gd < bd ? 6 : 0)
  else if (max === gd) h = (bd - rd) / d + 2
  else h = (rd - gd) / d + 4
  return (h / 6) * HUE_MAX
}

export function friendColor(name = '') {
  const [r, g, b] = stringToBytes(name)
  const hue = hueOf(r, g, b)
  return {
    header: `hsl(${hue} ${SATURATION}% 90%)`,
    background: `hsl(${hue} ${SATURATION}% 85%)`,
    text: `hsl(${hue} ${SATURATION}% 30%)`,
  }
}

/** The app keys the hash on `id-first-last ` — the trailing space included, and it matters. */
export const friendColorKey = ({ id, firstName = '', lastName = '' }) =>
  `${id}-${firstName}-${lastName} `
