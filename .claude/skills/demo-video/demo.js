#!/usr/bin/env node
// Narrated click-through videos of the prototypes.
//
//   node .claude/skills/demo-video/demo.js <demo> [stage…] [--base URL] [--voice id] [--speed n] [--out dir]
//
// <demo>   a spec in ./demos (e.g. collection-engine)
// stages   narration · check · record · build · sheet — or `all` (the default),
//          which runs them in that order
// --base   the dev server up to /bs-prototypes (default $DEMO_BASE, else
//          http://localhost:5173/bs-prototypes — check the port Vite printed)
// --voice  a Kokoro voice (default: the spec's, else am_michael)
// --speed  speaking rate (default: the spec's, else 1.0)
// --out    where the videos go (default ~/Desktop/<spec name>)
// --music  a track under the voice: a path, or a file in ~/.cache/bs-demo-video/music
//          (default: the spec's `music`); `none` for none
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')
const { KOKORO_DIR, MUSIC_DIR, runDir, outDir } = require('./lib/paths')

const args = process.argv.slice(2)
const flag = (name) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args.splice(i, 2)[1] : undefined
}
const base = (
  flag('base') ||
  process.env.DEMO_BASE ||
  'http://localhost:5173/bs-prototypes'
).replace(/\/$/, '')
const voiceFlag = flag('voice')
const speedFlag = flag('speed')
const outFlag = flag('out')
const musicFlag = flag('music')
const [demo, ...asked] = args
if (!demo) {
  const demos = fs.readdirSync(path.join(__dirname, 'demos')).map((f) => f.replace(/\.js$/, ''))
  console.error(`usage: demo.js <demo> [stage…]\ndemos: ${demos.join(', ')}`)
  process.exit(1)
}

const spec = require(path.join(__dirname, 'demos', `${demo}.js`))
const run = runDir(spec.name)
const out = outFlag || outDir(spec.name)
const voice = voiceFlag || spec.voice || 'am_michael'
const speed = speedFlag || String(spec.speed ?? 1)
fs.mkdirSync(run, { recursive: true })
// A track by path, or by file name in the cache's music folder; `--music none` for none.
const musicName = musicFlag ?? spec.music
const music =
  musicName && musicName !== 'none'
    ? path.isAbsolute(musicName)
      ? musicName
      : path.join(MUSIC_DIR, musicName)
    : null
if (music && !fs.existsSync(music)) {
  console.error(`no music at ${music}`)
  process.exit(1)
}

const ORDER = ['narration', 'check', 'record', 'build', 'sheet']
const stages =
  !asked.length || asked.includes('all') ? ORDER : ORDER.filter((s) => asked.includes(s))

;(async () => {
  for (const stage of stages) {
    console.log(`\n── ${stage} ──`)
    if (stage === 'narration') {
      const lines = spec.lines.map(({ id, text, say, chapter, screen }) => ({
        id,
        text,
        say,
        chapter,
        screen,
      }))
      fs.writeFileSync(path.join(run, 'narration.json'), JSON.stringify(lines, null, 2))
      execFileSync(
        path.join(KOKORO_DIR, 'venv', 'bin', 'python'),
        [path.join(__dirname, 'lib', 'tts.py'), run, voice, speed],
        { stdio: 'inherit', env: { ...process.env, KOKORO_DIR } },
      )
    }
    if (stage === 'check' || stage === 'record') {
      await require('./lib/recorder').record(spec, { run, base, mode: stage })
    }
    if (stage === 'build') require('./lib/build').build(spec, run, out, music)
    if (stage === 'sheet') require('./lib/build').sheet(run, out, spec.name)
  }
})().catch((e) => {
  console.error(`FAILED: ${e.message.split('\n')[0]}`)
  process.exit(1)
})
