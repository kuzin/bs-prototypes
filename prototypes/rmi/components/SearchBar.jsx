import { Button } from '@components/Button/Button'
import { Input } from '@components/Form/Form'
import '@components/Form/Form.css'
import './SearchBar.css'

/**
 * `.search-bar` — the app's search, which is not an always-on filter box but a
 * panel: a white card holding the field, a Search button, and a Clear button
 * once there's something to clear. It stays hidden (`.search-bar--hidden`)
 * until the toggle in the page header reveals it, which is why every index and
 * roster page carries that magnifier in its actions.
 *
 * `label` is the placeholder rather than a rendered label — the panel only ever
 * holds one field, so a heading over it says the same thing twice.
 *
 * It searches as you type here rather than on submit — Search stays because the
 * app has it and it's where the eye goes, but a prototype that only filtered on
 * click would feel broken.
 */
export function SearchBar({ open, label, value, onChange, onClose }) {
  if (!open) return null

  return (
    <div className="rmi-search-bar">
      <form className="rmi-field-group" onSubmit={(e) => e.preventDefault()}>
        <Input
          className="rmi-search-field"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          aria-label={label}
          autoFocus
        />

        <Button type="submit" variant="primary" size="md">
          Search
        </Button>

        {value && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => {
              onChange('')
              onClose?.()
            }}
          >
            Clear
          </Button>
        )}
      </form>
    </div>
  )
}
