import { Icon } from '@components/Icon/Icon'
import '@components/PartnerBrand/PartnerBrand.css'

/**
 * Reading-partner brand identity — the registry plus the two ways a partner
 * shows up inside Beanstack UI:
 *
 *   <PartnerBrand id="comicsplus" />          // full lockup (mark + wordmark)
 *   <PartnerMark id="comicsplus" size={26} /> // square app mark
 *
 * Comics Plus, Scholastic, and Beeverso render their real brand assets from
 * `/public/<partner>`; the rest are tasteful wordmark approximations (partner
 * logos are often delivered inline, so approximating keeps this self-contained).
 */
export const PARTNER_BRANDS = {
  comicsplus: {
    id: 'comicsplus',
    dark: '#1B0C26',
    name: 'Comics Plus',
    accent: '#0CA7BC',
    soft: '#E6F7FA',
    mark: '/bs-prototypes/comicsplus/Mark.svg',
    wordmark: '/bs-prototypes/comicsplus/Wordmark.svg',
    // The bubble is an organic silhouette: its widest points touch the box but
    // its corners pull well in, so beside Scholastic's full-bleed square it read
    // a size smaller. Scaled to match, the tile clips the little that overruns —
    // which is why the tile takes the blob's own teal: without it those clipped
    // corners showed as white slivers against the rounded edge.
    markScale: 1.12,
    markBg: '#0DA7BC',
    // On dark chrome the blob and the bubble trade places: a white blob with a
    // teal bubble on the soft tint, so the mark isn't a teal block on a dark one.
    markInvert: '/bs-prototypes/comicsplus/Mark-invert.svg',
    markBgInvert: '#E6F7FA',
    // An all-white version of the wordmark for dark chrome. A white *plate*
    // behind the dark lockup is the fallback for partners with no inverse —
    // Comics Plus has one, so it doesn't need the plate.
    wordmarkInvert: '/bs-prototypes/comicsplus/Wordmark-white.svg',
    // Comics Plus set their wordmark on its own — pairing it with the bubble
    // mark reads as the mark twice, since the bubble is the wordmark's own
    // counter. The mark is still the app mark; it just isn't part of the lockup.
    wordmarkAlone: true,
  },
  scholastic: {
    id: 'scholastic',
    dark: '#2B0406',
    name: 'Scholastic',
    accent: '#E6000D',
    soft: '#FDECEC',
    // Real wordmark (Wikimedia Commons); Mark.svg crops its "S" to a square.
    mark: '/bs-prototypes/scholastic/Mark.svg',
    wordmark: '/bs-prototypes/scholastic/Wordmark.svg',
    // The wordmark is white-on-red, so it needs no plate on dark chrome.
    solidWordmark: true,
  },
  beeverso: {
    id: 'beeverso',
    dark: '#3C0458',
    name: 'Beeverso',
    accent: '#662D91',
    soft: '#F4EDFA',
    // Real lockup from beeverso.org. The shipped asset sets "verso" in white for
    // their purple chrome, so `Wordmark.png` is the same file with those letters
    // recolored to ink for light backgrounds, and `Mark.png` is the "bee" script.
    mark: '/bs-prototypes/beeverso/Mark.png',
    wordmark: '/bs-prototypes/beeverso/Wordmark.png',
    wordmarkInvert: '/bs-prototypes/beeverso/Wordmark-white.png',
    lockupWordmark: true,
    // The mark is transparent script, not a solid tile — it needs a plate. The
    // plate is the brand purple, and flips to the soft tint on dark chrome.
    markPlate: true,
    markBg: '#662D91',
    markBgInvert: '#F4EDFA',
  },
  epic: {
    id: 'epic',
    dark: '#062F4C',
    name: 'Epic!',
    accent: '#0A96E6',
    soft: '#E6F4FD',
    // Official wordmark from getepic.com (`epic-logo-solid-blue.svg`), cropped
    // to its ink. The mark is their real "e!" app icon, pulled at 512px from
    // the App Store artwork API — a solid tile, so it needs no plate.
    mark: '/bs-prototypes/epic/Mark.png',
    wordmark: '/bs-prototypes/epic/Wordmark.svg',
    // White ink for dark chrome, rather than the white-plate fallback.
    wordmarkInvert: '/bs-prototypes/epic/Wordmark-white.svg',
    wordmarkAlone: true,
    // "epic!" is squat — twice as wide as it is tall, where "OverDrive" is nearly
    // seven times. Height-matched it reads a size smaller, so it takes a taller box.
    wordmarkScale: 1.4,
  },
  libby: {
    id: 'libby',
    dark: '#3D0A1E',
    name: 'Libby',
    // Libby's own rose, and the tint it takes on light chrome. No official
    // asset is vendored for it — every other partner here renders a real file
    // out of `/public/<partner>`, so rather than draw a lookalike this one
    // takes the registry's glyph badge in Libby's colours. Drop `Mark.svg` and
    // `Wordmark.svg` into `public/libby/` and it renders like the rest.
    accent: '#C8256A',
    soft: '#FBE9F1',
    // Libby is the borrowing app: ebooks and audiobooks from your own library.
    glyph: 'headphones',
  },
  follett: {
    id: 'follett',
    dark: '#0A2B3D',
    name: 'Follett Destiny',
    // Follett's own blue and the tint it takes on light chrome. No official
    // asset is vendored — same position as Libby, so rather than draw a
    // lookalike this takes the registry's glyph badge in Follett's colours.
    // Drop `Mark.svg` and `Wordmark.svg` into `public/follett/` and it renders
    // like the rest.
    accent: '#00629B',
    soft: '#E3EEF5',
    // Destiny is the library catalog: the shelf a school's print stock lives on.
    glyph: 'building-community',
  },
  overdrive: {
    id: 'overdrive',
    dark: '#00293C',
    name: 'OverDrive',
    accent: '#006595',
    soft: '#E6F0F5',
    // Official wordmark from overdrive.com (`OverDrive_Logo 2020.svg`), plus
    // their own white variant for dark chrome. The logo is a pure wordmark, so
    // `Mark.svg` is its leading "o" — the device they use as a square mark.
    mark: '/bs-prototypes/overdrive/Mark-white.svg',
    markInvert: '/bs-prototypes/overdrive/Mark.svg',
    markBg: '#006595',
    markBgInvert: '#E6F0F5',
    wordmark: '/bs-prototypes/overdrive/Wordmark.svg',
    wordmarkInvert: '/bs-prototypes/overdrive/Wordmark-white.svg',
    wordmarkAlone: true,
    markPlate: true,
  },
  sora: {
    id: 'sora',
    dark: '#241F3B',
    name: 'Sora',
    accent: '#3A3361',
    soft: '#EDECF3',
    // Real lockup from discoversora.com (`soralogo_notagline.svg`). The asset
    // draws the creature *and* the "sora" text, so it's a lockup; `Mark.svg` is
    // the creature alone, its viewBox cropped square to the art's own bounds.
    mark: '/bs-prototypes/sora/Mark.svg',
    wordmark: '/bs-prototypes/sora/Wordmark.svg',
    // "sora" set in white for dark chrome; the creature keeps its own colours.
    wordmarkInvert: '/bs-prototypes/sora/Wordmark-white.svg',
    lockupWordmark: true,
    // The creature is transparent line art, not a solid tile — it needs the
    // plate to read on avatars and colored chrome, same as Beeverso's bee. The
    // plate takes the brand's deep purple: on the soft tint the pale-blue
    // creature had nothing to sit against and the mark read as a grey square.
    markPlate: true,
    // A step lighter than the wordmark's ink: at #3A3361 the tile was nearly
    // black and the pale creature read as a cut-out rather than a logo.
    markBg: '#4E457F',
    markBgInvert: '#EDECF3',
  },
}

/**
 * Full brand lockup. `size`: sm | md | lg. `invert` for dark backgrounds.
 * `wordmarkOnly` drops the leading app mark (how partner logos appear in
 * Beanstack's own App Integrations list).
 */
export function PartnerBrand({ id, size = 'md', invert = false, wordmarkOnly = false }) {
  const p = PARTNER_BRANDS[id]
  if (!p) return null

  // A wordmark that carries its own solid plate (Scholastic's white-on-red bar)
  // needs no backing plate on dark chrome, and neither does one that ships a
  // purpose-made light-on-dark asset (Beeverso's `wordmarkInvert`). A dark-ink
  // wordmark with no inverse (Comics Plus) gets a white plate instead of being
  // recolored — which is how Comics Plus present it themselves.
  const word = (invert && p.wordmarkInvert) || p.wordmark
  const plate = invert && !p.solidWordmark && !p.wordmarkInvert
  // `lockupWordmark` means the wordmark asset already draws the mark (Beeverso's
  // "bee" is the b in "beeverso"), so pairing it with one would double it up.
  const showMark =
    Boolean(p.mark) &&
    !wordmarkOnly &&
    !p.wordmarkAlone &&
    !p.solidWordmark &&
    !p.lockupWordmark &&
    !invert
  const cls = `pb-brand pb-brand--${size}${plate ? ' pb-brand--plate' : ''}${
    p.lockupWordmark ? ' pb-brand--lockup' : ''
  }`

  if (word) {
    return (
      <span
        className={`${cls} pb-brand--asset`}
        aria-label={p.name}
        style={p.wordmarkScale ? { '--pb-word-scale': p.wordmarkScale } : undefined}
      >
        {showMark && <img src={p.mark} alt="" className="pb-brand-mark" />}
        <img src={word} alt={p.name} className="pb-brand-word" />
      </span>
    )
  }
  return (
    <span className={cls} aria-label={p.name}>
      <span className="pb-brand-glyph" style={{ color: p.accent }} aria-hidden="true">
        <Icon name={p.glyph || 'book'} />
      </span>
      <span className="pb-brand-text" style={{ color: invert ? '#fff' : p.accent }}>
        {p.name}
      </span>
    </span>
  )
}

/** Square app mark — real asset where we have one, else a colored glyph badge. */
export function PartnerMark({ id, size = 22, invert = false }) {
  const p = PARTNER_BRANDS[id]
  if (!p) return null
  // A mark that fills its tile with the brand colour has to flip on dark
  // chrome, or it's a solid block of the same hue the chrome already is.
  const art = (invert && p.markInvert) || p.mark
  const bg = invert ? (p.markBgInvert ?? p.soft) : (p.markBg ?? (p.markPlate ? p.soft : undefined))
  if (p.mark) {
    // The tile is its own element so the art can be scaled inside it. Source
    // art varies: a hard-edged square covers its box, an organic silhouette
    // covers ~84% of the same box and reads a size smaller beside it, which
    // `markScale` corrects. The tile clips whatever that pushes past the corner.
    return (
      <span
        className={`pb-mark${p.markPlate ? ' pb-mark--plate' : ''}`}
        title={p.name}
        style={{
          width: size,
          height: size,
          // Tinted with the partner's own soft color rather than white — a white
          // tile disappears into light UI and reads as a hole, not a logo.
          background: bg,
        }}
      >
        <img
          src={art}
          alt={p.name}
          className="pb-mark-art"
          style={{
            // The plate's inset has to be computed here: a percentage padding
            // would resolve against the *container's* width, not the mark's.
            padding: p.markPlate ? Math.round(size * 0.1) : 0,
            transform: p.markScale ? `scale(${p.markScale})` : undefined,
          }}
        />
      </span>
    )
  }
  return (
    <span
      className="pb-mark pb-mark--glyph"
      title={p.name}
      style={{ width: size, height: size, background: p.accent }}
    >
      <Icon name={p.glyph || 'book'} size={Math.round(size * 0.52)} color="#fff" />
    </span>
  )
}
