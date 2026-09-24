// Puts a finished demo on the prototype picker's Demo videos tab, then clears
// its temp folder: the video `build` made — copied as is, not re-encoded — and
// a poster frame into public/demo-videos/ (GitHub Pages serves them with the
// site), and the demo's entry in components/demoVideos.json, which the landing
// page reads. The repo copy is the only one left afterwards.
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const REPO = path.join(__dirname, '..', '..', '..', '..')
const ff = (args) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...args])
const load = (run, f) => JSON.parse(fs.readFileSync(path.join(run, f)))
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

function site(spec, run) {
  const source = path.join(run, `${spec.name}.mp4`)
  if (!fs.existsSync(source)) throw new Error(`build first — no ${source}`)
  const dir = path.join(REPO, 'public', 'demo-videos')
  fs.mkdirSync(dir, { recursive: true })

  const mp4 = path.join(dir, `${spec.name}.mp4`)
  fs.copyFileSync(source, mp4)

  // The poster: most of the way through the spec's `posterLine` (a line id),
  // else a few seconds in.
  const timeline = load(run, 'timeline.json')
  const lines = Object.fromEntries(load(run, 'narration.timed.json').map((l) => [l.id, l]))
  const start = timeline.find((t) => t.id === 'start').epoch - 0.5
  const end = timeline.find((t) => t.id === 'end').epoch + 0.3
  const at = timeline.find((t) => t.id === spec.posterLine)
  const posterAt = at ? at.epoch - start + (lines[at.id].dur / 1000) * 0.85 : 4
  const poster = path.join(dir, `${spec.name}.jpg`)
  ff([
    '-ss',
    posterAt.toFixed(2),
    '-i',
    source,
    '-frames:v',
    '1',
    '-vf',
    'scale=960:-1',
    '-q:v',
    '3',
    poster,
  ])

  // Upsert this demo's entry, newest first.
  const registry = path.join(REPO, 'components', 'demoVideos.json')
  const all = fs.existsSync(registry) ? JSON.parse(fs.readFileSync(registry)) : []
  const entry = {
    id: spec.name,
    title: spec.siteTitle ?? spec.title.replace(/\s*[—-]\s*demo$/i, ''),
    description: spec.description ?? '',
    duration: mmss(end - start),
    recorded: new Date().toISOString().slice(0, 10),
    src: `demo-videos/${spec.name}.mp4`,
    poster: `demo-videos/${spec.name}.jpg`,
    prototypes: spec.prototypes ?? [],
  }
  const rest = all.filter((v) => v.id !== spec.name)
  fs.writeFileSync(registry, JSON.stringify([entry, ...rest], null, 2) + '\n')
  // In the repo's own style — JSON.stringify breaks every array onto lines,
  // Prettier keeps a short one on one, and CI's format:check fails the diff.
  const prettier = path.join(REPO, 'node_modules', '.bin', 'prettier')
  if (fs.existsSync(prettier)) execFileSync(prettier, ['--write', registry], { stdio: 'ignore' })

  fs.rmSync(run, { recursive: true, force: true })
  try {
    fs.rmdirSync(path.dirname(run)) // the shared temp folder, once it's empty
  } catch {
    // another demo's run is still in it
  }
  const mb = (fs.statSync(mp4).size / 1e6).toFixed(1)
  console.log(`${mp4} (${mb} MB) + poster, listed in components/demoVideos.json`)
  console.log(`removed ${run}`)
}

module.exports = { site }
