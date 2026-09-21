/**
 * Sponsor marks — the real brand assets already vendored in `public/<partner>`, the same files
 * `@components/PartnerBrand`'s registry points at.
 *
 * Reusing them rather than drawing lookalikes is the whole point. Hand-drawn marks all come out
 * of one hand: four lockups built from the same recipe read as a template no matter what colours
 * they take, and a sponsor block is convincing precisely because real marks DISAGREE — a solid
 * red plate beside a squat blue wordmark beside an illustrative lockup beside a wordmark seven
 * times wider than it is tall. That is the thing a designer needs to see the block survive.
 *
 * These four are also plausible sponsors rather than arbitrary logos: Scholastic, Epic!, Sora and
 * OverDrive are reading companies that genuinely work with school and library programmes, which
 * is what a school's sponsor list actually looks like.
 *
 * `height` normalises optical weight, not pixels. `epic!` is squat — about twice as wide as it is
 * tall, where `OverDrive` is nearly seven times — so height-matching them makes Epic read a size
 * smaller. The registry solves this with `wordmarkScale: 1.4`; the same correction is applied
 * here.
 */
const BASE = '/bs-prototypes'

export const SPONSOR_MARKS = {
  /* White-on-red, so the asset is its own plate — the only sponsor that arrives as a block. */
  scholastic: {
    name: 'Scholastic',
    src: `${BASE}/scholastic/Wordmark.svg`,
    height: 30,
  },
  /* Squat, hence the taller box — see `wordmarkScale` in the registry. */
  epic: {
    name: 'Epic!',
    src: `${BASE}/epic/Wordmark.svg`,
    height: 40,
  },
  /* A lockup: the creature and the word together, not a wordmark. */
  sora: {
    name: 'Sora',
    src: `${BASE}/sora/Wordmark.svg`,
    height: 40,
  },
  /* A pure wordmark, and the widest of the four. */
  overdrive: {
    name: 'OverDrive',
    src: `${BASE}/overdrive/Wordmark.svg`,
    height: 22,
  },
}
