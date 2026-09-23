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
 * balanced; the ends are the only fixed points a long message has. The message
 * wraps — the app's own `.infobox` does, and a bar that ellipsised its second
 * line lost the half of the sentence that said what to do about it.
 *
 * `icon` takes a Plumpy name or your own node; left out, the level's own mark
 * is drawn, so every notice on a page carries the same glyph.
 * `action` / `readMore` are `{ label, href, onClick }` — `readMore` renders
 * second and quieter, for the case where the bar can only summarise.
 */
export function InfoBox({
  title,
  /* No default glyph: an InfoBox is the shared <Banner> at a level, so with
     nothing passed it draws that level's own mark — the same circle every
     other notice on the page carries. It used to default to the `announcement`
     megaphone, which made an announcement and an inline notice sitting inches
     apart read as two different systems. A caller that wants a subject glyph
     still passes one. */
  icon,
  action,
  readMore,
  level = 'info',
  onDismiss,
  children,
  className = '',
}) {
  const glyph = typeof icon === 'string' ? <PlumpyIcon name={icon} size={20} /> : icon
  const btn = (cfg, variant) => (
    <Button
      as={cfg.href ? 'a' : undefined}
      href={cfg.href}
      onClick={cfg.onClick}
      variant={variant}
      size="sm"
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
            {/* The app draws one shape here — an outline button on the box's
                own ground — whichever of the two it is. */}
            {action && btn(action, 'secondary')}
            {readMore && btn(readMore, 'secondary')}
          </div>
        )
      }
    >
      {children}
    </Banner>
  )
}
