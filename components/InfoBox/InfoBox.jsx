import { Button } from '@components/Button/Button'
import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'
import { Banner } from '@components/Primitives/Primitives'
import '@components/Button/Button.css'
import '@components/Primitives/Primitives.css'
import '@components/InfoBox/InfoBox.css'

/**
 * An announcement — a headline, a paragraph about it, and the way to act on it.
 *
 *   <InfoBox title="[Webinar] What's New" action={{ label: 'Learn more', href: '#' }}>
 *     Join us Aug 12 at 2 PM ET.
 *   </InfoBox>
 *
 *   <InfoBox title="…" action={…} readMore={{ label: 'Read more', href: '/blog' }} onDismiss={…}>
 *
 * It is the shared <Banner> at `level="info"` — the app's own `.infobox`
 * ground, `#CFE4FE` with a `#196DD5` icon and no border — so an announcement
 * and an inline notice stay one chrome. What it adds is the announcement
 * shape: a Plumpy glyph instead of the generic info circle, and up to two
 * actions stacked at the end of the bar.
 *
 * The icon and the actions centre against the whole box rather than against
 * the title, so a one-line and a three-line announcement both read as
 * balanced; the ends are the only fixed points a long message has.
 *
 * `icon` takes a Plumpy name (default `announcement`) or your own node.
 * `action` / `readMore` are `{ label, href, onClick }` — `readMore` renders
 * second and quieter, for the case where the bar can only summarise.
 */
export function InfoBox({
  title,
  icon = 'announcement',
  action,
  readMore,
  level = 'info',
  onDismiss,
  children,
  className = '',
}) {
  const glyph = typeof icon === 'string' ? <PlumpyIcon name={icon} size={26} /> : icon
  const btn = (cfg, variant) => (
    <Button
      as={cfg.href ? 'a' : undefined}
      href={cfg.href}
      onClick={cfg.onClick}
      variant={variant}
      size="md"
    >
      {cfg.label}
    </Button>
  )

  return (
    <Banner
      level={level}
      className={`ibx ${className}`.trim()}
      icon={glyph}
      title={title}
      onDismiss={onDismiss}
      action={
        (action || readMore) && (
          <div className="ibx-actions">
            {action && btn(action, 'primary')}
            {readMore && btn(readMore, 'secondary')}
          </div>
        )
      }
    >
      {children}
    </Banner>
  )
}
