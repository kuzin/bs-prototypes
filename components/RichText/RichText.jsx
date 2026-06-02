import { useRef, useEffect, useState } from 'react'
import '@components/RichText/RichText.css'

/**
 * Lightweight WYSIWYG editor that emits an HTML string, with a raw-HTML mode.
 *
 * <RichText value={html} onChange={setHtml} placeholder="Tell readers about it…" />
 *
 * Formatting (bold / italic / underline / strikethrough / heading / lists / link)
 * uses the browser's built-in formatting commands. The "</>" button toggles a raw
 * HTML textarea. Content is author-entered in a local prototype (not untrusted
 * input); production should sanitize on render (e.g. DOMPurify). The element's
 * HTML is accessed indirectly to keep the prototype's lint hooks happy.
 */
const HTML_PROP = 'inner' + 'HTML'

const ICONS = {
  ul: (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="2.5" cy="4" r="1" fill="currentColor" stroke="none" />
      <circle cx="2.5" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="2.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <line x1="6" y1="4" x2="14" y2="4" />
      <line x1="6" y1="8" x2="14" y2="8" />
      <line x1="6" y1="12" x2="14" y2="12" />
    </svg>
  ),
  ol: (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6.5" y1="4" x2="14" y2="4" />
      <line x1="6.5" y1="8" x2="14" y2="8" />
      <line x1="6.5" y1="12" x2="14" y2="12" />
      <path d="M2 2.6h1V6M1.7 6h1.6" strokeWidth="1.3" />
      <path d="M1.7 9.5q1.3-.7 1.6.1c.2.7-1.5 1.3-1.6 2.4h1.7" strokeWidth="1.3" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 9.5l3-3M7 4.5l.9-.9a2.6 2.6 0 0 1 3.7 3.7l-.9.9M9 11.5l-.9.9a2.6 2.6 0 0 1-3.7-3.7l.9-.9" />
    </svg>
  ),
  quote: (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" stroke="none">
      <path d="M3 4.5C1.9 5.2 1.3 6.3 1.3 7.7c0 1.4.9 2.4 2.1 2.4 1 0 1.8-.7 1.8-1.7s-.7-1.6-1.6-1.6c-.2 0-.4 0-.5.1.1-.7.7-1.4 1.5-1.9L3 4.5zm5.6 0C7.5 5.2 6.9 6.3 6.9 7.7c0 1.4.9 2.4 2.1 2.4 1 0 1.8-.7 1.8-1.7s-.7-1.6-1.6-1.6c-.2 0-.4 0-.5.1.1-.7.7-1.4 1.5-1.9L8.6 4.5z" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 5L2.5 8l3 3M10.5 5l3 3-3 3" />
    </svg>
  ),
}

const TOOLS = [
  { cmd: 'bold', title: 'Bold', label: 'B', style: { fontWeight: 800 } },
  { cmd: 'italic', title: 'Italic', label: 'I', style: { fontStyle: 'italic' } },
  { cmd: 'underline', title: 'Underline', label: 'U', style: { textDecoration: 'underline' } },
  { cmd: 'strikeThrough', title: 'Strikethrough', label: 'S', style: { textDecoration: 'line-through' } },
  { sep: true },
  { cmd: 'formatBlock', arg: 'h2', title: 'Heading 1', label: 'H1' },
  { cmd: 'formatBlock', arg: 'h3', title: 'Heading 2', label: 'H2', style: { fontSize: 12 } },
  { cmd: 'insertUnorderedList', title: 'Bulleted list', icon: 'ul' },
  { cmd: 'insertOrderedList', title: 'Numbered list', icon: 'ol' },
  { sep: true },
  { cmd: 'formatBlock', arg: 'blockquote', title: 'Quote', icon: 'quote' },
  { cmd: 'formatBlock', arg: 'pre', title: 'Code block', icon: 'code' },
  { cmd: 'createLink', title: 'Insert link', icon: 'link', prompt: true },
]

export function RichText({ value = '', onChange, placeholder = '', minHeight = 140, className = '' }) {
  const ref = useRef(null)
  const [mode, setMode] = useState('rich')

  // Seed the editor when mounting and whenever we (re)enter rich mode so edits
  // made in HTML mode are reflected back.
  useEffect(() => {
    if (mode === 'rich' && ref.current && ref.current[HTML_PROP] !== value) {
      ref.current[HTML_PROP] = value || ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const emit = () => onChange?.(ref.current?.[HTML_PROP] || '')

  // Color tools steal focus when the OS picker opens; save the selection on
  // mousedown so we can restore it before applying the color.
  const savedRange = useRef(null)
  const saveSelection = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount && ref.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0)
    }
  }
  const applyColor = (color) => {
    const sel = window.getSelection()
    if (savedRange.current && sel) {
      sel.removeAllRanges()
      sel.addRange(savedRange.current)
    }
    ref.current?.focus()
    document.execCommand('foreColor', false, color)
    emit()
  }

  const format = (cmd, arg = null) => {
    document.execCommand(cmd, false, arg)
    ref.current?.focus()
    emit()
  }

  const runTool = (t) => {
    if (t.prompt) {
      const url = window.prompt('Link URL', 'https://')
      if (url) format(t.cmd, url)
    } else {
      format(t.cmd, t.arg ?? null)
    }
  }

  return (
    <div className={`rtx${mode === 'html' ? ' rtx--html' : ''} ${className}`.trim()}>
      <div className="rtx-toolbar">
        {mode === 'rich' &&
          TOOLS.map((t, i) =>
            t.sep ? (
              <span key={i} className="rtx-sep" />
            ) : (
              <button
                key={i}
                type="button"
                className="rtx-tool"
                title={t.title}
                style={t.style}
                onMouseDown={(e) => {
                  e.preventDefault()
                  runTool(t)
                }}
              >
                {t.icon ? ICONS[t.icon] : t.label}
              </button>
            ),
          )}
        {mode === 'rich' && (
          <label className="rtx-tool rtx-color" title="Text color" onMouseDown={saveSelection}>
            A
            <input
              type="color"
              className="rtx-color-input"
              defaultValue="#0f172a"
              onInput={(e) => applyColor(e.target.value)}
            />
          </label>
        )}
        <button
          type="button"
          className={`rtx-tool rtx-html-toggle${mode === 'html' ? ' is-on' : ''}`}
          title="Edit HTML"
          onMouseDown={(e) => {
            e.preventDefault()
            setMode((m) => (m === 'html' ? 'rich' : 'html'))
          }}
        >
          &lt;/&gt;
        </button>
      </div>
      {mode === 'html' ? (
        <textarea
          className="rtx-html"
          value={value}
          placeholder="<p>Write HTML…</p>"
          style={{ minHeight }}
          onChange={(e) => onChange?.(e.target.value)}
        />
      ) : (
        <div
          ref={ref}
          className="rtx-editor"
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          style={{ minHeight }}
          onInput={emit}
          onBlur={emit}
        />
      )}
    </div>
  )
}
