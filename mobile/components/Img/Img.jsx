import { IMAGES } from '../../images.generated'
import './Img.css'

/**
 * An asset from the app's image registry, addressed by the same string key the app uses.
 *
 * The mobile app has no icon font and only 13 SVGs — its icon system is 314 raster PNGs looked up
 * by name, and components there type the prop as `source?: keyof typeof images`. So this mirrors
 * that call shape exactly: `<Img name="settings_gear_icon" />` is the web spelling of
 * `<Image source={images.settings_gear_icon} />`.
 *
 * `tint` is the `tintColor` prop, which CSS has no equivalent for: a tinted <img> is impossible,
 * so a tinted asset is rendered as a `mask-image` over a solid colour instead. That only works on
 * a monochrome-with-alpha asset, which is exactly what the app tints — it is opt-in per call site
 * there too (52 usages out of 314 assets), so requiring the prop is faithful rather than lazy.
 *
 * @param {string} name   registry key
 * @param {number} size   square size in points; or pass width/height
 * @param {string} tint   colour to tint a monochrome asset (maps to tintColor)
 * @param {string} fit    'contain' (the app's usual resizeMode) | 'cover' | 'fill' (RN 'stretch')
 */
export function Img({
  name,
  size,
  width,
  height,
  tint,
  fit = 'contain',
  alt = '',
  className = '',
  style,
  ...rest
}) {
  const url = IMAGES[name]
  const box = {
    width: width ?? size,
    height: height ?? size,
    ...style,
  }

  if (import.meta.env.DEV && !url) {
    // A typo'd key would otherwise render an invisible empty box — and with 314 keys, typos happen.
    console.warn(
      `<Img name="${name}"> is not in the registry. Run \`pnpm mobile:images\` if the app added it.`,
    )
  }

  if (tint) {
    return (
      <span
        className={`m-img m-img-tinted ${className}`}
        style={{
          ...box,
          backgroundColor: tint,
          maskImage: `url(${url})`,
          WebkitMaskImage: `url(${url})`,
          maskSize: fit,
          WebkitMaskSize: fit,
        }}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : 'true'}
        {...rest}
      />
    )
  }

  return (
    <img
      className={`m-img ${className}`}
      src={url}
      alt={alt}
      style={{ ...box, objectFit: fit }}
      {...rest}
    />
  )
}
