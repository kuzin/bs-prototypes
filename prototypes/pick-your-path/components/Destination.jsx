import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { ReaderTopBar } from './ReaderChrome'
import { CoverTile, BadgeDisc, StatChip } from './common'
import { badgesForPath } from '../data'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'badges', label: 'Badges' },
  { id: 'rewards', label: 'Rewards' },
  { id: 'log', label: 'Challenge Log' },
]

// One reading title row — designed cover + meta + read state.
function TitleRow({ title, path, read, onToggle }) {
  return (
    <div className={`pyp-title${read ? ' is-read' : ''}`}>
      <div className="pyp-title-cover">
        <CoverTile cover={title.cover} label={title.title} path={path} read={read} />
      </div>
      <div className="pyp-title-info">
        <h4 className="pyp-title-name">{title.title}</h4>
        <div className="pyp-title-author">by {title.author}</div>
        <p className="pyp-title-blurb">{title.blurb}</p>
        <div className="pyp-title-meta">
          <span>{title.level}</span>
          <span className="pyp-dot">·</span>
          <span>{title.pages} pages</span>
        </div>
      </div>
      <div className="pyp-title-action">
        {read ? (
          <button className="pyp-read-toggle is-read" onClick={onToggle} type="button">
            <Icon name="circle-check-filled" size={17} color="#16A97A" /> Read
          </button>
        ) : (
          <Button variant="secondary" size="sm" onClick={onToggle}>
            Mark as read
          </Button>
        )}
      </div>
    </div>
  )
}

// One extension-activity card.
function ActivityCard({ activity, path, done, response, onOpen }) {
  return (
    <button
      type="button"
      className={`pyp-actcard${done ? ' is-done' : ''}`}
      style={{ '--path-color': path.color }}
      onClick={onOpen}
    >
      <span className="pyp-actcard-icon">
        <Icon name={activity.icon} size={22} stroke={1.8} />
      </span>
      <span className="pyp-actcard-text">
        <span className="pyp-actcard-name">{activity.name}</span>
        <span className="pyp-actcard-prompt">{done ? `“${response}”` : activity.short}</span>
      </span>
      <span className={`pyp-actcard-foot${done ? ' is-done' : ''}`}>
        {done ? (
          <>
            <Icon name="circle-check-filled" size={15} color="#16A97A" /> Completed
          </>
        ) : (
          <>
            Start activity <Icon name="arrow-right" size={14} stroke={2.3} />
          </>
        )}
      </span>
    </button>
  )
}

// Screen 3 — the student's page for one destination + chosen path.
export function Destination({
  path,
  readIds,
  doneIds,
  responses,
  streak,
  onToggleRead,
  onOpenActivity,
  onChangePath,
}) {
  const [tab, setTab] = useState('overview')
  const read = new Set(readIds)
  const done = new Set(doneIds)
  const readCount = path.titles.filter((t) => read.has(t.id)).length
  const doneCount = path.activities.filter((a) => done.has(a.id)).length
  const badges = badgesForPath(path, readIds, doneIds)
  const earnedBadges = badges.filter((b) => b.earned).length
  const pathComplete = badges.find((b) => b.kind === 'destination')?.earned

  // Rewards unlock when the whole path is complete (reading + activities).
  const rewards = [
    {
      id: 'certificate',
      name: 'Forces & Motion Certificate',
      desc: 'A printable certificate for finishing your whole path.',
      icon: 'certificate',
      earned: pathComplete,
    },
    {
      id: 'readaloud',
      name: 'Pick the class read-aloud',
      desc: 'Choose the next book your whole class reads together.',
      icon: 'gift',
      earned: pathComplete,
    },
  ]

  // Challenge log — everything the student has completed so far.
  const log = [
    ...path.titles
      .filter((t) => read.has(t.id))
      .map((t) => ({
        id: `r-${t.id}`,
        icon: 'book',
        text: `Read “${t.title}”`,
        color: path.color,
      })),
    ...path.activities
      .filter((a) => done.has(a.id))
      .map((a) => ({
        id: `a-${a.id}`,
        icon: a.icon,
        text: `Completed ${a.name}`,
        note: responses[a.id],
        color: '#7C3AED',
      })),
  ]

  return (
    <div className="pyp-reader" style={{ '--path-color': path.color }}>
      <ReaderTopBar />

      {/* Destination + chosen path banner */}
      <div
        className="pyp-dest-band"
        style={{
          backgroundImage: `linear-gradient(to right, color-mix(in srgb, ${path.color} 92%, #04211e) 0%, color-mix(in srgb, ${path.color} 68%, #0b3b39) 42%, color-mix(in srgb, ${path.color} 30%, transparent) 80%, color-mix(in srgb, ${path.color} 14%, transparent) 100%), url(${path.banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="pyp-dest-band-inner">
          <h1 className="pyp-dest-band-title">{path.name}</h1>
          <p className="pyp-dest-band-tag">{path.tagline}</p>
          <button className="pyp-changepath" onClick={onChangePath} type="button">
            <Icon name="switch-horizontal" size={14} /> Change path
          </button>
        </div>
      </div>

      <main className="pyp-reader-body">
        <div className="pyp-reader-inner">
          {/* Gamified progress strip — persists across tabs */}
          <div className="pyp-statstrip">
            <StatChip
              icon="flame-filled"
              value={streak}
              label="day streak"
              color="#EA580C"
              tint="#FFF1E8"
            />
            <StatChip
              icon="book"
              value={`${readCount}/${path.titles.length}`}
              label="titles read"
              color={path.color}
              tint={`color-mix(in srgb, ${path.color} 12%, #fff)`}
            />
            <StatChip
              icon="sparkles"
              value={`${doneCount}/${path.activities.length}`}
              label="activities"
              color="#7C3AED"
              tint="#F3EEFE"
            />
            <StatChip
              icon="trophy"
              value={earnedBadges}
              label="badges earned"
              color="#F0A024"
              tint="#FEF5E4"
            />
          </div>

          {/* Challenge sub-tabs */}
          <div className="pyp-dest-subtabs">
            <Tabs
              variant="underline"
              size="md"
              active={tab}
              accent={path.color}
              onChange={setTab}
              items={TABS}
            />
          </div>

          {tab === 'overview' && (
            <div className="pyp-tabpanel">
              {/* Reading */}
              <section className="pyp-section">
                <div className="pyp-section-head">
                  <h2 className="pyp-h2">Read your path</h2>
                  <span className="pyp-section-count">
                    {readCount} of {path.titles.length} read
                  </span>
                </div>
                <ProgressBar
                  value={readCount}
                  max={path.titles.length}
                  color={path.color}
                  size="md"
                />
                <div className="pyp-titles">
                  {path.titles.map((t) => (
                    <TitleRow
                      key={t.id}
                      title={t}
                      path={path}
                      read={read.has(t.id)}
                      onToggle={() => onToggleRead(t.id)}
                    />
                  ))}
                </div>
              </section>

              {/* Activities */}
              <section className="pyp-section">
                <div className="pyp-section-head">
                  <h2 className="pyp-h2">Extension activities</h2>
                  <span className="pyp-section-count">
                    {doneCount} of {path.activities.length} done
                  </span>
                </div>
                <ProgressBar
                  value={doneCount}
                  max={path.activities.length}
                  color="#7C3AED"
                  size="md"
                />
                <div className="pyp-actgrid">
                  {path.activities.map((a) => (
                    <ActivityCard
                      key={a.id}
                      activity={a}
                      path={path}
                      done={done.has(a.id)}
                      response={responses[a.id]}
                      onOpen={() => onOpenActivity(a)}
                    />
                  ))}
                </div>
              </section>
            </div>
          )}

          {tab === 'badges' && (
            <section className="pyp-section">
              <div className="pyp-section-head">
                <h2 className="pyp-h2">Your badges</h2>
                <span className="pyp-section-count">
                  {earnedBadges} of {badges.length} earned
                </span>
              </div>
              <div className="pyp-badgegallery">
                {badges.map((b) => (
                  <BadgeDisc key={b.id} badge={b} size={92} />
                ))}
              </div>
            </section>
          )}

          {tab === 'rewards' && (
            <section className="pyp-section">
              <div className="pyp-section-head">
                <h2 className="pyp-h2">Rewards</h2>
              </div>
              <p className="pyp-section-sub">Finish your whole path to unlock these.</p>
              <div className="pyp-rewardgrid">
                {rewards.map((r) => (
                  <div key={r.id} className={`pyp-reward${r.earned ? ' is-earned' : ''}`}>
                    <span className="pyp-reward-icon">
                      <Icon name={r.icon} size={22} stroke={1.8} />
                    </span>
                    <div className="pyp-reward-text">
                      <div className="pyp-reward-name">{r.name}</div>
                      <div className="pyp-reward-desc">{r.desc}</div>
                    </div>
                    <span className={`pyp-reward-status${r.earned ? ' is-earned' : ''}`}>
                      {r.earned ? (
                        <>
                          <Icon name="circle-check-filled" size={14} color="#16A97A" /> Unlocked
                        </>
                      ) : (
                        <>
                          <Icon name="lock" size={13} /> Locked
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'log' && (
            <section className="pyp-section">
              <div className="pyp-section-head">
                <h2 className="pyp-h2">Challenge Log</h2>
                <span className="pyp-section-count">
                  {log.length} {log.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>
              {log.length === 0 ? (
                <div className="pyp-log-empty">
                  Nothing logged yet — read a title or finish an activity and it’ll show up here.
                </div>
              ) : (
                <ul className="pyp-log">
                  {log.map((e) => (
                    <li key={e.id} className="pyp-log-item">
                      <span
                        className="pyp-log-icon"
                        style={{
                          background: `color-mix(in srgb, ${e.color} 12%, #fff)`,
                          color: e.color,
                        }}
                      >
                        <Icon name={e.icon} size={16} stroke={1.9} />
                      </span>
                      <div className="pyp-log-body">
                        <div className="pyp-log-text">{e.text}</div>
                        {e.note && <div className="pyp-log-note">“{e.note}”</div>}
                      </div>
                      <Icon name="circle-check-filled" size={16} color="#16A97A" />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
