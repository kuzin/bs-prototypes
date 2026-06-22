import React from 'react'
import { Flyout, Icon, Button } from 'bs-prototypes'

// The Flyout opens from its trigger's internal state. To show the open popover
// statically, auto-toggle it once on mount.
function useAutoOpen() {
  const toggleRef = React.useRef<(() => void) | null>(null)
  const opened = React.useRef(false)
  React.useEffect(() => {
    if (!opened.current) {
      opened.current = true
      toggleRef.current?.()
    }
  }, [])
  return toggleRef
}

export const Menu = () => {
  const toggleRef = useAutoOpen()
  return (
    <div style={{ minHeight: 220, paddingBottom: 120 }}>
      <Flyout
        placement="bottom-start"
        trigger={({ open, toggle }) => {
          toggleRef.current = toggle
          return (
            <Button variant="secondary" iconRight={<Icon name="chevron-down" size={14} />} onClick={toggle}>
              {open ? 'Lincoln Elementary' : 'Lincoln Elementary'}
            </Button>
          )
        }}
      >
        {({ close }) => (
          <div className="flyout-menu">
            <button className="flyout-menu-item flyout-menu-item--active" onClick={close}>
              <span className="flyout-menu-icon">
                <Icon name="check" size={14} />
              </span>
              Lincoln Elementary
            </button>
            <button className="flyout-menu-item" onClick={close}>
              <span className="flyout-menu-icon">
                <Icon name="school" size={14} />
              </span>
              Roosevelt Middle
            </button>
            <button className="flyout-menu-item" onClick={close}>
              <span className="flyout-menu-icon">
                <Icon name="school" size={14} />
              </span>
              Washington High
            </button>
            <div className="flyout-menu-sep" />
            <button className="flyout-menu-item" onClick={close}>
              <span className="flyout-menu-icon">
                <Icon name="plus" size={14} />
              </span>
              Add a school
            </button>
          </div>
        )}
      </Flyout>
    </div>
  )
}

export const Actions = () => {
  const toggleRef = useAutoOpen()
  return (
    <div style={{ minHeight: 200, paddingBottom: 110 }}>
      <Flyout
        placement="bottom-start"
        trigger={({ toggle }) => {
          toggleRef.current = toggle
          return (
            <Button variant="ghost" onClick={toggle}>
              <Icon name="dots-vertical" size={16} />
            </Button>
          )
        }}
      >
        {({ close }) => (
          <div className="flyout-menu">
            <button className="flyout-menu-item" onClick={close}>
              <span className="flyout-menu-icon">
                <Icon name="edit" size={14} />
              </span>
              Edit challenge
            </button>
            <button className="flyout-menu-item" onClick={close}>
              <span className="flyout-menu-icon">
                <Icon name="copy" size={14} />
              </span>
              Duplicate
            </button>
            <div className="flyout-menu-sep" />
            <button className="flyout-menu-item flyout-menu-item--danger" onClick={close}>
              <span className="flyout-menu-icon">
                <Icon name="trash" size={14} />
              </span>
              End challenge
            </button>
          </div>
        )}
      </Flyout>
    </div>
  )
}
