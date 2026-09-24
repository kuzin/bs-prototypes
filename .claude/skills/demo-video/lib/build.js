// Frames + narration → the video, <run>/<name>.mp4, encoded once at the size
// it's published at: `site` copies this exact file into the repo, so there's
// no master to re-encode from and nothing lost to a second pass. Also sheet():
// one frame per line in a contact sheet, to check each moment landed before
// calling it done.
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const ff = (args) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...args])
const load = (run, f) => JSON.parse(fs.readFileSync(path.join(run, f)))

// The video starts half a second before the first line's `start` mark and
// ends just after `end`, so the page loading in front of it is trimmed off.
function span(run) {
  const timeline = load(run, 'timeline.json')
  const start = timeline.find((t) => t.id === 'start').epoch - 0.5
  const end = timeline.find((t) => t.id === 'end').epoch + 0.3
  return { timeline, start, end, length: end - start }
}

/**
 * A music bed under the voice, so the gaps between lines aren't dead air. The
 * track loops with a 4-second crossfade (a finished track's fade-out melts into
 * its own intro), fades in and out with the video, sits low, and ducks further
 * whenever the voice is speaking — keyed off the narration itself.
 */
function withMusic(voice, music, length, run, volume = 0.14) {
  const dur = parseFloat(
    execFileSync('ffprobe', [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'csv=p=0',
      music,
    ]).toString(),
  )
  const xf = 4
  const copies = Math.max(1, Math.ceil((length + 2 - dur) / (dur - xf)) + 1)
  const inputs = ['-i', voice, ...Array.from({ length: copies }, () => ['-i', music]).flat()]
  let bed = '[1:a]'
  const chain = []
  for (let i = 2; i <= copies; i++) {
    chain.push(`${bed}[${i}:a]acrossfade=d=${xf}:c1=tri:c2=tri[x${i}]`)
    bed = `[x${i}]`
  }
  const L = length.toFixed(2)
  chain.push(
    `${bed}atrim=0:${L},asetpts=PTS-STARTPTS,volume=${volume},` +
      `afade=t=in:st=0:d=2,afade=t=out:st=${(length - 4).toFixed(2)}:d=4[bed]`,
    '[0:a]asplit=2[v][key]',
    '[bed][key]sidechaincompress=threshold=0.02:ratio=6:attack=25:release=900[duck]',
    '[v][duck]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95[out]',
  )
  const mixed = path.join(run, 'mix.wav')
  ff([
    ...inputs,
    '-filter_complex',
    chain.join(';'),
    '-map',
    '[out]',
    '-ar',
    '44100',
    '-ac',
    '2',
    mixed,
  ])
  return mixed
}

function build(spec, run, music) {
  const frames = load(run, 'frames.json')
  const lines = load(run, 'narration.timed.json')
  const byId = Object.fromEntries(lines.map((l) => [l.id, l]))
  const { timeline, start, end, length } = span(run)

  // Each frame is held until the next one — the screencast only sends frames
  // when something repaints.
  let i0 = frames.findIndex((f) => f.ts > start)
  i0 = Math.max(0, i0 - 1)
  const shown = frames.slice(i0).filter((f) => f.ts < end)
  // By name, inside this run's own frames/ — so a run folder still builds after
  // it has been moved.
  const frame = (f) => path.join(run, 'frames', path.basename(f.file))
  const list = ['ffconcat version 1.0']
  shown.forEach((f, i) => {
    const from = Math.max(f.ts, start)
    const to = i + 1 < shown.length ? shown[i + 1].ts : end
    list.push(`file '${frame(f)}'`, `duration ${Math.max(to - from, 0.001).toFixed(4)}`)
  })
  list.push(`file '${frame(shown[shown.length - 1])}'`)
  fs.writeFileSync(path.join(run, 'frames.ffconcat'), list.join('\n') + '\n')

  // Every line at its own start, on the clock the frames were stamped with.
  const said = timeline.filter((t) => byId[t.id])
  const inputs = said.flatMap((t) => ['-i', path.join(run, 'audio', `${t.id}.wav`)])
  const delays = said.map(
    (t, i) => `[${i}:a]adelay=${Math.round((t.epoch - start) * 1000)}:all=1[a${i}]`,
  )
  const mix =
    said.map((_, i) => `[a${i}]`).join('') +
    `amix=inputs=${said.length}:normalize=0:dropout_transition=0,` +
    `loudnorm=I=-16:TP=-1.5:LRA=11,apad=whole_dur=${length.toFixed(2)}[m]`
  const voice = path.join(run, 'narration.wav')
  ff([
    ...inputs,
    '-filter_complex',
    [...delays, mix].join(';'),
    '-map',
    '[m]',
    '-ar',
    '44100',
    '-ac',
    '2',
    voice,
  ])
  const narration = music ? withMusic(voice, music, length, run) : voice

  // CRF 23 at 1440×810 keeps small UI type crisp; screen recordings hold
  // still most of the time, so it comes out at 2–3 MB a minute (the Challenge
  // Creator's 2:25 is 4.7 MB, the Collection Engine's 7:49 is 21 MB).
  const mp4 = path.join(run, `${spec.name}.mp4`)
  ff([
    ...['-f', 'concat', '-safe', '0', '-i', path.join(run, 'frames.ffconcat'), '-i', narration],
    ...['-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '23'],
    ...['-movflags', '+faststart', '-c:a', 'aac', '-b:a', '128k', '-t', length.toFixed(2), mp4],
  ])
  const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  const mb = (fs.statSync(mp4).size / 1e6).toFixed(1)
  console.log(`${mp4} — ${mmss(length)}, ${mb} MB, ${shown.length} frames`)
}

function sheet(run, name) {
  const lines = load(run, 'narration.timed.json')
  const byId = Object.fromEntries(lines.map((l) => [l.id, l]))
  const { timeline, start } = span(run)
  const dir = path.join(run, 'sheet')
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir)
  const said = timeline.filter((t) => byId[t.id])
  const mp4 = path.join(run, `${name}.mp4`)
  said.forEach((t, i) => {
    // Most of the way through the line: its moment should be on screen by then.
    const sec = t.epoch - start + (byId[t.id].dur / 1000) * 0.85
    // No labels: Homebrew's ffmpeg is built without drawtext. The sheet reads
    // left to right, top to bottom, in line order — `sheet.txt` lists it.
    ff([
      '-ss',
      sec.toFixed(2),
      '-i',
      mp4,
      '-frames:v',
      '1',
      '-vf',
      'scale=480:-1',
      path.join(dir, `${String(i).padStart(3, '0')}.png`),
    ])
  })
  const cols = 4
  const rows = Math.ceil(said.length / cols)
  fs.writeFileSync(
    path.join(run, 'sheet.txt'),
    said.map((t, i) => `${i + 1}. ${t.id}`).join('\n') + '\n',
  )
  const png = path.join(run, 'sheet.png')
  ff([
    '-i',
    path.join(dir, '%03d.png'),
    '-vf',
    `tile=${cols}x${rows}:padding=4:color=white`,
    '-frames:v',
    '1',
    png,
  ])
  console.log(png)
  return png
}

module.exports = { build, sheet }
