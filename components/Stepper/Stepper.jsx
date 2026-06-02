import '@components/Stepper/Stepper.css'

/**
 * Horizontal, clickable step indicator.
 *
 * <Stepper steps={[{id,name}]} current="type" onStep={setStep} />
 *
 * - steps:   ordered [{ id, name }]
 * - current: id of the active step
 * - onStep:  (id) => void  — fired when a step is clicked
 * - accent:  optional CSS color for the active/done dots (defaults to Beanstack teal)
 *
 * Steps before the current one render as "done" (✓); the rest as "todo".
 */
export function Stepper({
  steps = [],
  current,
  onStep,
  accent,
  orientation = 'horizontal',
  className = '',
}) {
  const idx = steps.findIndex((s) => s.id === current)
  const style = accent ? { '--stepper-accent': accent } : undefined
  return (
    <nav
      className={`stepper stepper--${orientation} ${className}`.trim()}
      style={style}
      aria-label="Progress"
    >
      <ol className="stepper-list">
        {steps.map((s, i) => {
          const state = i < idx ? 'done' : i === idx ? 'current' : 'todo'
          return (
            <li key={s.id} className={`stepper-item is-${state}`}>
              <button
                type="button"
                className="stepper-btn"
                aria-current={state === 'current' ? 'step' : undefined}
                onClick={() => onStep?.(s.id)}
              >
                <span className="stepper-dot">{state === 'done' ? '✓' : i + 1}</span>
                <span className="stepper-name">{s.name}</span>
              </button>
              {i < steps.length - 1 && <span className="stepper-line" aria-hidden="true" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
