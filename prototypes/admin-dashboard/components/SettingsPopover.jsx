import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { RangeSlider } from '@components/Form/Form'
import { Button } from '@components/Button/Button'
import { Toggle } from '@components/Toggle/Toggle'
import '@components/Form/Form.css'
import '@components/Button/Button.css'

/**
 * Anchored popover that renders a widget's settings form from a schema.
 * Rendered via portal to document.body so it isn't clipped by the widget cell's
 * overflow: hidden. Positions itself below + right-aligned to the anchor rect
 * passed in (typically the gear button's getBoundingClientRect()).
 *
 * Field schema:
 *   { key, label, type, options?: [{value,label}], help?: string, min?, max?, step? }
 *   types: 'select' | 'toggle' | 'multi' | 'range'
 */
export function SettingsPopover({
  anchorRect,
  fields,
  value,
  defaults,
  onChange,
  onReset,
  onClose,
}) {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: 280, height: 0 })

  // Click outside / Escape to close
  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose?.()
    }
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  // Measure for edge-aware positioning
  useEffect(() => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect()
      setSize({ width: r.width, height: r.height })
    }
  }, [fields])

  const v = { ...defaults, ...value }

  // Compute position: below the anchor, right-aligned. Flip to above if it
  // would clip below; clamp to viewport horizontally.
  const margin = 6
  let top, left
  if (anchorRect) {
    const spaceBelow = window.innerHeight - anchorRect.bottom
    const flipUp = size.height && spaceBelow < size.height + margin + 12
    top = flipUp ? Math.max(8, anchorRect.top - size.height - margin) : anchorRect.bottom + margin
    left = Math.max(8, Math.min(window.innerWidth - size.width - 8, anchorRect.right - size.width))
  } else {
    // Fallback if no anchor — center near top
    top = 80
    left = (window.innerWidth - size.width) / 2
  }

  return createPortal(
    <div
      className="adm-set"
      ref={ref}
      style={{ top, left, right: 'auto' }}
      /* Popover is portaled to <body>, but events still bubble through
         the React tree to the parent card. Stop them here so the dnd-kit
         drag sensor on the card doesn't activate when the user drags the
         slider thumb / clicks inside the popover. */
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="adm-set-head">
        <div className="adm-set-title">Widget settings</div>
        <button type="button" className="adm-set-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <div className="adm-set-body">
        {fields.map((f) => (
          <div key={f.key} className="adm-set-field">
            <label className="adm-set-label">{f.label}</label>
            {f.type === 'select' && (
              <select
                className="adm-set-input"
                value={v[f.key] ?? ''}
                onChange={(e) => onChange({ [f.key]: e.target.value })}
              >
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}
            {f.type === 'toggle' && (
              <Toggle checked={!!v[f.key]} onChange={(checked) => onChange({ [f.key]: checked })}>
                {v[f.key] ? 'On' : 'Off'}
              </Toggle>
            )}
            {f.type === 'range' && (
              <RangeSlider
                min={f.min ?? 0}
                max={f.max ?? 100}
                step={f.step ?? 1}
                value={Number(v[f.key] ?? f.min ?? 0)}
                onChange={(n) => onChange({ [f.key]: n })}
              />
            )}
            {f.type === 'multi' && (
              <div className="adm-set-multi">
                {f.options.map((o) => {
                  const arr = Array.isArray(v[f.key]) ? v[f.key] : []
                  const checked = arr.includes(o.value)
                  return (
                    <label key={o.value} className="adm-set-multi-row">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...arr, o.value]
                            : arr.filter((x) => x !== o.value)
                          onChange({ [f.key]: next })
                        }}
                      />
                      <span>{o.label}</span>
                    </label>
                  )
                })}
              </div>
            )}
            {f.help && <div className="adm-set-help">{f.help}</div>}
          </div>
        ))}
      </div>

      <div className="adm-set-foot">
        <Button type="button" variant="secondary" size="sm" onClick={onReset}>
          Reset to defaults
        </Button>
        <Button type="button" variant="primary" size="sm" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>,
    document.body,
  )
}
