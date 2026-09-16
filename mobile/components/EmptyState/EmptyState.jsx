import { PressableButton } from '../PressableButton/PressableButton'
import './EmptyState.css'

/**
 * `src/components/home/EmptyState.tsx`.
 *
 * The app has two empty-state components with different prop vocabularies (plus eight feature-local
 * copies). This mirrors the newer `home/EmptyState` shape, which is the one worth standardising on.
 */
export function EmptyState({ header, title, description, art, buttonTitle, onPressButton }) {
  return (
    <div className="m-empty">
      {header && <p className="m-t-sub-heading m-empty-header">{header}</p>}
      {art && <div className="m-empty-art">{art}</div>}
      {title && <p className="m-t-title-small m-empty-title">{title}</p>}
      {description && <p className="m-t-body-small m-empty-desc">{description}</p>}
      {buttonTitle && (
        <PressableButton size="medium" buttonText={buttonTitle} onButtonPress={onPressButton} />
      )}
    </div>
  )
}
