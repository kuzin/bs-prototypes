import './BsIcons.css'

/**
 * The product's own illustrated icons, copied verbatim out of the shipped app
 * (bs-product `app/assets/images/icons/`) into `public/bs-icons/`.
 *
 * These are deliberately NOT in the `<Icon>` registry. `<Icon>` is a stroked
 * single-glyph system where `currentColor` does the work; these are multi-path
 * full-colour drawings with gradients — the same category CLAUDE.md keeps as
 * inline/asset SVG (brand marks, drawn graphics). Rendered as `<img>` so the
 * gradient defs can't collide across instances and the source stays readable.
 *
 *   <BsIcon set="flags" name="delayed_response" size={20} alt="Time concern" />
 *   {FLAG_ICON_FILE['time-warning']}   // → 'delayed_response'
 *
 * Three sets:
 *   `flags`        the Book Talks integrity flags, from `icons/`
 *   `rmi-factors`  the ten motivation factors, from `icons/rmi-factors/`
 *   `actions`      the admin's row-action glyphs, from `icons/` and
 *                  `icons/decorative/`
 *
 * @param {'flags'|'rmi-factors'} set
 * @param {string} name  file basename, without `.svg`
 */
/* The two sets are drawn differently in the app and have to render differently
   here. The flags are full-colour illustrations with their own gradients, so
   they go in as an `<img>`. The RMI factors are `fill="black"` silhouettes that
   the app tints from CSS (`.factor-icon--intrinsic svg path { fill: $teal600 }`)
   — as an `<img>` they'd all come out black, so they're masked instead and take
   their colour from `currentColor`, which is the same lever the app pulls.
   The `actions` glyphs are the same category: single-colour drawings the app
   recolours per state. Masking also keeps their internal opacity — the reward
   box's lid is drawn at 0.35, and an alpha mask preserves that as 35% of the
   tint, which is how the app's two-tone reads. */
const MASKED = new Set(['rmi-factors', 'actions'])

export function BsIcon({ set, name, size = 20, alt = '', className = '' }) {
  const src = `/bs-prototypes/bs-icons/${set}/${name}.svg`

  if (MASKED.has(set)) {
    return (
      <span
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={`bsi bsi--mask ${className}`.trim()}
        style={{ width: size, height: size, '--bsi-src': `url(${src})` }}
      />
    )
  }

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={`bsi ${className}`.trim()}
      draggable="false"
    />
  )
}

/**
 * Our flag keys → the app's own file for that flag. The prototypes name flags
 * for what a reviewer sees ("time-warning"); the app names the asset for the
 * signal that raised it ("delayed_response"). Mapping here keeps both honest
 * rather than renaming one to suit the other.
 *
 * `book-swap` has no counterpart in the shipped set — book transfer isn't a
 * BTWB flag there — so it borrows the app's important-book drawing.
 */
export const FLAG_ICON_FILE = {
  // Student / Reader Profile — `SESSION_FLAGS`
  'book-swap': 'book-transfer',
  'time-warning': 'delayed_response',
  'btwb-incomplete': 'conversation_ended_early',
  'missing-details': 'lacking_detail',
  'over-limit': 'exceeded_limit',
  // Benny Book Talks — `FLAG_DESCS` / `POS_FLAG_DESCS`
  'copy-paste': 'pasted_response',
  unintelligible: 'unintelligble_response',
  'no-recall': 'lacking_detail',
  minimal: 'skipped_questions',
  'quit-early': 'conversation_ended_early',
  'off-topic': 'lost_focus',
  inappropriate: 'inappropriate_response',
  'close-to-limit': 'close_to_limit',
  'title-length': 'title_length',
  gibberish: 'gibberish_title',
  // Benny Book Talks — positive flags (`POS_FLAG_DESCS`)
  'positive-sentiment': 'positive',
  'answer-length': 'answer-length',
  'references-details': 'references-details',
  // Sessions for Review / the reading log — a third vocabulary again, since a
  // session flag is named for the rule it broke rather than for what a
  // reviewer sees or what raised it.
  'exceeded-warning': 'close_to_limit',
  'slow-response': 'delayed_response',
  engagement: 'positive',
  'key-idea': 'references-details',
  connection: 'positive',
  clear: 'answer-length',
  // Generic
  positive: 'positive-flag',
  negative: 'negative-flag',
  flagged: 'flagged',
}

/**
 * A Book Talks flag, drawn the way the app draws it.
 *
 * `fallback` is the type to draw when the app has no art for this one — pass
 * `'negative'` or `'positive'` for the generic flag. Without it an unmapped
 * type renders *nothing*, which is how a whole column of empty flag buttons
 * once shipped: the vocabularies differ between surfaces (a reviewer's
 * `time-warning`, the signal's `delayed_response`, a session's
 * `slow-response`), so a miss is a question of which map you're in, not a
 * reason to draw a blank.
 *
 * @param {string} type      a key of FLAG_ICON_FILE
 * @param {string} fallback  a key to fall back to when `type` isn't mapped
 */
export function FlagIcon({ type, fallback, size = 20, label, className = '' }) {
  const file = FLAG_ICON_FILE[type] ?? FLAG_ICON_FILE[fallback]
  if (!file) return null
  return <BsIcon set="flags" name={file} size={size} alt={label ?? ''} className={className} />
}

/**
 * The ten RMI factors, keyed the way `RMI_ICONS` always was so call sites
 * don't change. `mystery` is the app's eleventh drawing — the placeholder for a
 * factor that hasn't been scored yet.
 */
export const RMI_FACTOR_FILES = [
  'enjoyment',
  'curiosity',
  'importance',
  'confidence',
  'challenge',
  'social',
  'recognition',
  'grades',
  'competition',
  'compliance',
  'mystery',
]

/**
 * The app's own row-action glyphs, keyed by what the action is.
 *
 *   `reward`  the earned-rewards table's "Redeem reward" icon
 *             (`icons/reward.svg`, `.redeem-reward-icon` in the app)
 *   `ticket`  the drawing-entry ticket (`icons/decorative/ticket.svg`,
 *             the app's `bs-tickets` mark beside "5 Tickets Entered")
 */
export const ACTION_ICONS = ['reward', 'ticket']

/**
 * The app's `.factor-icon` chip — a 24px rounded square holding the factor's
 * glyph, both tinted by motivation type: `$teal100`/`$teal600` for intrinsic,
 * `$purple100`/`$purple600` for extrinsic
 * (bs-product admin/_rmi_summary.scss).
 *
 * @param {string} factor  an RMI factor key
 * @param {'intrinsic'|'extrinsic'} motivation
 */
export function FactorIcon({ factor, motivation = 'intrinsic', size = 24, label }) {
  return (
    <span
      className={`bsi-factor bsi-factor--${motivation}`}
      style={{ '--factor-box': `${size}px` }}
    >
      <BsIcon set="rmi-factors" name={factor} size={Math.round(size * 0.75)} alt={label ?? ''} />
    </span>
  )
}
