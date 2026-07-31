import { Icon } from '@components/Icon/Icon'
import { Toggle } from '@components/Toggle/Toggle'
import { SectionCard } from '@components/SectionCard/SectionCard'
import { Stepper } from '@components/Stepper/Stepper'
import { Tooltip } from '@components/Primitives/Primitives'
import { CoverTile, BadgeDisc } from './common'
import { badgesForPath } from '../data'
import { DESTINATION, DESTINATION_CATALOG, PATHS } from '../data'

const SETUP_STEPS = [
  { id: 'destination', name: 'Destination' },
  { id: 'paths', name: 'Paths' },
]

// One offerable path — a bold illustrated card. The Offered switch lives in the
// header, next to the path name. The teacher is vetting what they're assigning,
// so this shows the FULL shelf (every title, captioned) and every badge with its
// name and requirement — no previews or "+N more" folds.
function PathOffer({ path, on, disabled, onToggle }) {
  // Shown fully earned — this is what the path offers, not a student's progress.
  const badges = badgesForPath(
    path,
    path.titles.map((t) => t.id),
    path.activities.map((a) => a.id),
  )
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
        <section className="pyp-pathoffer-sec">
          <span className="pyp-pathoffer-seclabel">
            Books <em>{path.titles.length} titles</em>
          </span>
          <div className="pyp-pathoffer-books">
            {path.titles.map((t) => (
              <div key={t.id} className="pyp-pathoffer-book">
                <CoverTile cover={t.cover} label={t.title} path={path} />
                <span className="pyp-pathoffer-book-title">{t.title}</span>
                <span className="pyp-pathoffer-book-meta">{t.level}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="pyp-pathoffer-split">
          <section className="pyp-pathoffer-sec">
            <span className="pyp-pathoffer-seclabel">
              Activities <em>{path.activities.length}</em>
            </span>
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
          </section>

          <section className="pyp-pathoffer-sec">
            <span className="pyp-pathoffer-seclabel">
              Badges <em>{badges.length} earnable</em>
            </span>
            <div className="pyp-pathoffer-badges">
              {badges.map((b) => (
                <div key={b.id} className="pyp-pathoffer-badge">
                  <BadgeDisc badge={b} size={40} showLabel={false} showStatus={false} />
                  <span className="pyp-pathoffer-badge-text">
                    <span className="pyp-pathoffer-badge-name">{b.name}</span>
                    <span className="pyp-pathoffer-badge-sub">{b.sub}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
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
