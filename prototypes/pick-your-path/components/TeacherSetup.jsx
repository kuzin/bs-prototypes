import { Icon } from '@components/Icon/Icon'
import { Toggle } from '@components/Toggle/Toggle'
import { SectionCard } from '@components/SectionCard/SectionCard'
import { Stepper } from '@components/Stepper/Stepper'
import { Tooltip } from '@components/Primitives/Primitives'
import { CoverPreviewRow, BadgePreviewRow } from './common'
import { DESTINATION, DESTINATION_CATALOG, PATHS } from '../data'

const SETUP_STEPS = [
  { id: 'destination', name: 'Destination' },
  { id: 'paths', name: 'Paths' },
]

// One offerable path — a bold illustrated card. The Offered switch lives in
// the header, next to the path name. Cover previews hint at the titles (name
// on hover, not a caption); activities show name + a short description
// (there's no cover art to carry their identity); badges preview what a
// student can earn on this path, in their default locked state.
function PathOffer({ path, on, disabled, onToggle }) {
  return (
    <div
      className={`pyp-pathoffer${on ? ' is-on' : ' is-off'}`}
      style={{ '--path-color': path.color }}
    >
      <div
        className="pyp-pathoffer-band"
        style={{
          backgroundImage: `linear-gradient(to top, color-mix(in srgb, ${path.color} 88%, #04211e) 0%, color-mix(in srgb, ${path.color} 66%, #0b3b39) 30%, color-mix(in srgb, ${path.color} 26%, transparent) 64%, transparent 100%), url(${path.banner})`,
        }}
      >
        <h3 className="pyp-pathoffer-name">{path.name}</h3>
        <Tooltip content={on ? 'Offered to students' : 'Not offered'} placement="bottom">
          <span className="pyp-pathoffer-toggle">
            <Toggle checked={on} onChange={onToggle} disabled={disabled} />
          </span>
        </Tooltip>
      </div>
      <div className="pyp-pathoffer-body">
        <div className="pyp-pathoffer-sec">
          <span className="pyp-pathoffer-seclabel">Books</span>
          <CoverPreviewRow path={path} className="pyp-pathoffer-covers" />
        </div>
        <div className="pyp-pathoffer-sec">
          <span className="pyp-pathoffer-seclabel">Activities</span>
          <div className="pyp-pathoffer-activities">
            {path.activities.map((a) => (
              <div key={a.id} className="pyp-pathoffer-activity">
                <span className="pyp-pathoffer-activity-icon">
                  <Icon name={a.icon} size={14} />
                </span>
                <span className="pyp-pathoffer-activity-text">
                  <span className="pyp-pathoffer-activity-name">{a.name}</span>
                  <span className="pyp-pathoffer-activity-desc">{a.short}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="pyp-pathoffer-sec">
          <span className="pyp-pathoffer-seclabel">Badges</span>
          <BadgePreviewRow path={path} />
        </div>
      </div>
    </div>
  )
}

// Screen 1 — the teacher sets the academic Destination and chooses which
// interest Paths students may pick from.
export function TeacherSetup({ offered, onTogglePath }) {
  const offeredCount = offered.length

  return (
    <div className="pyp-teacher">
      <div className="pyp-stepbar">
        <div className="pyp-stepbar-inner">
          <Stepper steps={SETUP_STEPS} current="paths" accent="#0F766E" />
        </div>
      </div>

      <div className="pyp-teacher-body">
        <header className="pyp-page-head">
          <h1 className="pyp-page-title">Set a destination</h1>
          <p className="pyp-page-sub">
            Choose a standard, then pick the interest paths your students can explore it through.
          </p>
        </header>

        {/* Step 1 — the destination */}
        <SectionCard title="Choose the destination" className="pyp-panel">
          <p className="pyp-panel-sub">The academic standard every path will build toward.</p>
          <div className="pyp-dest-grid">
            {DESTINATION_CATALOG.map((d) => {
              const selected = d.id === DESTINATION.id
              return (
                <button
                  key={d.id}
                  type="button"
                  className={`pyp-dest-card${selected ? ' is-selected' : ''}${d.ready ? '' : ' is-disabled'}`}
                  disabled={!d.ready}
                  aria-pressed={selected}
                >
                  <span className="pyp-dest-icon">
                    <Icon name={d.icon} size={22} stroke={1.8} />
                  </span>
                  <span className="pyp-dest-text">
                    <span className="pyp-dest-subject">{d.subject}</span>
                    <span className="pyp-dest-title">{d.title}</span>
                  </span>
                  {selected && (
                    <span className="pyp-dest-check">
                      <Icon name="circle-check-filled" size={20} color={DESTINATION.color} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </SectionCard>

        {/* Step 2 — the paths */}
        <SectionCard title="Choose the paths students can pick" className="pyp-panel">
          <p className="pyp-panel-sub">
            Same destination, different vehicle — students pick the subject that excites them.
          </p>
          <div className="pyp-pathset">
            {PATHS.map((path) => {
              const on = offered.includes(path.id)
              return (
                <PathOffer
                  key={path.id}
                  path={path}
                  on={on}
                  disabled={on && offeredCount === 1}
                  onToggle={() => onTogglePath(path.id)}
                />
              )
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
