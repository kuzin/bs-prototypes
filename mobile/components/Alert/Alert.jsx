import './Alert.css'

/**
 * `Alert.alert(...)` — the iOS system alert, which is what every destructive action in the app
 * confirms through (`TitleOptionsModal.deleteTitle`, `ReviewOptionsModal.showDeleteAlert`).
 *
 * DEVICE chrome, not app chrome — like `Keyboard`. Nothing about it is Beanstack's: the widths,
 * the 14pt radius, the hairline splits and the two type sizes are UIAlertController's, so it is
 * drawn to the platform spec rather than to the design system's tokens. That is the point of
 * having it here — a destructive flow that looks plausible in a prototype but wrong on a phone is
 * worse than no flow at all.
 *
 * Every call in the app passes `{ cancelable: false }`, so there is no backdrop dismissal: the
 * only ways out are the buttons.
 *
 * Two buttons lay out side by side; three or more stack. `style` is the iOS button role —
 * `cancel` renders semibold, `destructive` renders red.
 */
export function Alert({ open, title, message, buttons = [], onDismiss }) {
  if (!open) return null

  const stacked = buttons.length > 2

  return (
    <div className="m-alert" role="alertdialog" aria-label={title} aria-modal="true">
      {/* `cancelable: false` everywhere in this app — the scrim takes no press. */}
      <div className="m-alert-scrim" aria-hidden="true" />

      <div className="m-alert-box">
        <div className="m-alert-copy">
          <p className="m-alert-title">{title}</p>
          {message && <p className="m-alert-message">{message}</p>}
        </div>

        <div className={`m-alert-actions${stacked ? ' is-stacked' : ''}`}>
          {buttons.map((b) => (
            <button
              key={b.text}
              type="button"
              className={`m-alert-btn is-${b.style ?? 'default'}`}
              onClick={() => {
                onDismiss?.()
                b.onPress?.()
              }}
            >
              {b.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
