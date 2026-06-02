import { useRef, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import '@components/ImageDropzone/ImageDropzone.css'

/**
 * Drag-and-drop (or click-to-browse) image upload zone.
 *
 * <ImageDropzone
 *   fileName={name}
 *   onFile={(name) => save(name)}
 *   hint={'920 × 351px · jpg, png, gif · < 10MB'}
 * />
 *
 * Prototype-grade: it reports the chosen file's name (no real upload).
 */
export function ImageDropzone({
  fileName,
  onFile,
  accept = 'image/*',
  hint,
  className = '',
  onClear,
  previewSrc,
}) {
  const inputRef = useRef(null)
  const [over, setOver] = useState(false)

  const pick = (files) => {
    const f = files?.[0]
    if (f) onFile?.(f.name)
  }

  return (
    <div
      className={`idz${over ? ' idz--over' : ''}${fileName ? ' idz--has' : ''} ${className}`.trim()}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        pick(e.dataTransfer.files)
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="idz-native"
        onChange={(e) => pick(e.target.files)}
      />
      {previewSrc ? (
        <img className="idz-preview" src={previewSrc} alt="" />
      ) : (
        <Icon name="photo" size={28} className="idz-icon" />
      )}
      {fileName ? (
        <span className="idz-file">{fileName}</span>
      ) : (
        <span className="idz-prompt">
          <strong>Drag an image here</strong> or click to browse
        </span>
      )}
      {hint && <span className="idz-hint">{hint}</span>}
      {fileName && onClear && (
        <button
          type="button"
          className="idz-clear"
          onClick={(e) => {
            e.stopPropagation()
            onClear()
          }}
        >
          Remove
        </button>
      )}
    </div>
  )
}
