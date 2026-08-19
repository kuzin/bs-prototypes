import { useState } from 'react'
import { Field, NumberInput } from '@components/Form/Form'
import { ImageDropzone } from '@components/ImageDropzone/ImageDropzone'
import { SettingRow } from '@components/SettingRow/SettingRow'
import { Icon } from '@components/Icon/Icon'
import { GameBoard } from '../components/GameBoard'
import {
  GAMEBOARD_THEMES,
  THEME_COLOR_PRESETS,
  resolveGameboardTheme,
  MIN_SPACES,
  MAX_SPACES,
  badgeImage,
  FAKE_UPLOAD_IMG,
} from '../data'
import { STEP_ICONS, StepHead, ColorPicker, rewardedBadgeIds } from './shared'

// ─── The Gameboard step ───────────────────────────────────────────────────────
// Theme the board, size it, then lay the challenge's badges along the path.
//
// The board is paved with the challenge's own badges, so this step reads the
// Badges step's output rather than owning any badge data: logging badges take
// the spaces, activity badges ride along in the tray, and the Rewards step
// decides which spaces fly a gift marker.
export function GameboardStep({ challenge, update }) {
  const s = challenge.setup
  const n = s.gbBadges || 8
  const setSetup = (patch) => update({ setup: { ...s, ...patch } })

  // Which badges currently earn a reward (a reward/certificate assignment, or a
  // raffle ticket) — so the board can flag those spaces.
  const rewardedIds = rewardedBadgeIds(challenge)

  // Logging badges line the board.
  const loggingPool = (challenge.badges || []).map((b, i) => {
    const unit = b.logType || 'books'
    const goal = Number(b.goal) >= 1 ? b.goal : i + 1
    return {
      id: `log-${i}`,
      name: b.name || 'Logging badge',
      img: b.img || badgeImage(b.icon),
      logType: unit,
      goal,
      kind: 'Logging badge',
      meta: `Log ${goal} ${goal === 1 ? unit.replace(/s$/, '') : unit}`,
      reward: rewardedIds.has(`log-${i}`),
    }
  })
  // Activity badges are earned by completing a task, not by logging — so they
  // sit in the tray as context and can't be dropped onto a space.
  const activityPool = (challenge.activityBadges || []).map((b, i) => {
    const nA = b.activities?.length || 0
    return {
      id: `act-${i}`,
      name: b.title || b.name || 'Activity badge',
      img: b.badge?.img,
      kind: 'Activity badge',
      meta: nA ? `Complete ${nA} ${nA === 1 ? 'activity' : 'activities'}` : 'Complete an activity',
    }
  })

  // Preset the board with the logging badges (in order); pad/clamp to n spaces.
  const saved = s.gameboardCells
  const base = saved && saved.length ? saved : loggingPool.slice(0, n).map((b) => b.id)
  const cells = Array.from({ length: n }, (_, i) => base[i] ?? null)

  const theme = s.gameboardTheme || 'meadow'
  // A custom theme takes the whole panel over: its color + background controls
  // replace the theme grid, and you go Back to reach the presets again. Back is
  // pure navigation — the custom look stays applied until another theme is
  // picked, so the grid still shows Custom as the selected one.
  const [picking, setPicking] = useState(theme !== 'custom')
  const themeObj = resolveGameboardTheme(theme, {
    custom: s.gameboardColor || '#16A97A',
    uploadedBg: s.gameboardBg,
  })

  return (
    <section className="gb-step">
      <StepHead
        title="Gameboard"
        sub="Theme the board, then drag badges onto the path readers travel as they read."
        icon={STEP_ICONS.gameboard}
      />

      <div className="gb-panel">
        {picking ? (
          <>
            <h3 className="gb-panel-title">Gameboard theme</h3>
            <div className="gb-themes">
              {GAMEBOARD_THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`gb-theme${theme === t.id ? ' is-on' : ''}`}
                  style={{ backgroundImage: `url(${t.bgImg})` }}
                  aria-pressed={theme === t.id}
                  onClick={() => setSetup({ gameboardTheme: t.id })}
                >
                  {theme === t.id && (
                    <span className="gb-theme-check">
                      <Icon name="check" size={13} stroke={3} color="#fff" />
                    </span>
                  )}
                  <span className="gb-theme-name">{t.name}</span>
                </button>
              ))}
              <button
                type="button"
                className={`gb-theme gb-theme--custom${theme === 'custom' ? ' is-on' : ''}`}
                aria-pressed={theme === 'custom'}
                onClick={() => {
                  setSetup({ gameboardTheme: 'custom' })
                  setPicking(false)
                }}
              >
                {theme === 'custom' && (
                  <span className="gb-theme-check gb-theme-check--dark">
                    <Icon name="check" size={13} stroke={3} color="#fff" />
                  </span>
                )}
                <Icon name="photo" size={20} />
                <span className="gb-theme-name">Custom</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="gb-panel-head">
              <button
                type="button"
                className="gb-badge-editor-back"
                onClick={() => setPicking(true)}
              >
                <Icon name="chevron-left" size={16} />
                Back to themes
              </button>
            </div>
            <h3 className="gb-panel-title">Custom theme</h3>
            <div className="gb-custom">
              <Field label="Color scheme">
                <ColorPicker
                  value={s.gameboardColor}
                  presets={THEME_COLOR_PRESETS}
                  maxPresets={12}
                  fallback="#16A97A"
                  onColor={(c) => setSetup({ gameboardColor: c })}
                />
              </Field>
              <Field
                label="Background image"
                help="Recommended 1200 × 1200px · JPG, PNG, or GIF · under 10MB."
              >
                <ImageDropzone
                  fileName={s.gameboardBgName}
                  previewSrc={s.gameboardBg}
                  onFile={(name) =>
                    setSetup({ gameboardBgName: name, gameboardBg: FAKE_UPLOAD_IMG })
                  }
                  onClear={() => setSetup({ gameboardBgName: '', gameboardBg: null })}
                />
              </Field>
            </div>
          </>
        )}
      </div>

      <div className="gb-panel">
        <h3 className="gb-panel-title">Gameboard settings</h3>
        <div className="gb-settings">
          <SettingRow
            label="Show reward types"
            sub="Mark spaces that award a prize with a gift icon."
            checked={s.gbShowRewards !== false}
            onChange={(v) => setSetup({ gbShowRewards: v })}
          />
          <SettingRow
            label="Show a halfway marker"
            sub="Call out the midpoint of the board."
            checked={s.gbShowHalfway !== false}
            onChange={(v) => setSetup({ gbShowHalfway: v })}
          />
        </div>
        <Field label="Number of badges" className="gb-w-sm">
          <NumberInput
            value={n}
            min={MIN_SPACES}
            max={MAX_SPACES}
            onChange={(v) => {
              const next = Array.from({ length: v }, (_, i) => cells[i] ?? null)
              setSetup({ gbBadges: v, gameboardCells: next })
            }}
          />
        </Field>
      </div>

      <div className="gb-panel">
        <h3 className="gb-panel-title">Gameboard setup</h3>
        <GameBoard
          cells={cells}
          pool={loggingPool}
          activityPool={activityPool}
          themeObj={themeObj}
          showRewards={s.gbShowRewards !== false}
          showHalfway={s.gbShowHalfway !== false}
          regBadge={challenge.registrationBadge}
          compBadge={challenge.completionBadge}
          onChange={(next) => setSetup({ gameboardCells: next })}
        />
      </div>
    </section>
  )
}
