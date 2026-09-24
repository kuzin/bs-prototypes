// Drives a demo spec's script in a headless Chromium, paced to its narration.
//
// Capture is Chrome's own screencast (CDP `Page.startScreencast`): every frame
// carries the time it was painted, and the timeline is written on the same
// clock, so the build can put each narration line exactly where its moment
// happened. Playwright's built-in `recordVideo` was tried first and drifts —
// a 205-second run came out 224 seconds long — which walks the voice ahead of
// the picture by the end.
const fs = require('fs')
const path = require('path')
const { createRequire } = require('module')
const { NODE_DIR } = require('./paths')

const { chromium } = createRequire(path.join(NODE_DIR, 'package.json'))('playwright-core')

/**
 * @param spec     a demo spec (see demos/*.js)
 * @param opts.run the demo's working directory
 * @param opts.base the dev server's URL up to and including `/bs-prototypes`
 * @param opts.mode 'check' (fast, no pacing, no capture) | 'record'
 */
async function record(spec, { run, base, mode }) {
  const FAST = mode === 'check'
  const RECORD = mode === 'record'
  const W = spec.viewport?.width ?? 1440
  const H = spec.viewport?.height ?? 810
  const timed = RECORD ? JSON.parse(fs.readFileSync(path.join(run, 'narration.timed.json'))) : []
  const durOf = Object.fromEntries(timed.map((l) => [l.id, l.dur]))

  // One persistent profile per demo: a check run warms the cache (covers come
  // from Open Library), so the recorded run isn't waiting on images.
  const ctx = await chromium.launchPersistentContext(path.join(run, 'profile'), {
    headless: true,
    viewport: { width: W, height: H },
    deviceScaleFactor: 1,
  })
  await ctx.addInitScript({ path: path.join(__dirname, 'cursor.js') })
  const page = ctx.pages()[0] ?? (await ctx.newPage())
  const T0 = Date.now()
  const now = () => Date.now() - T0
  const timeline = []

  // ── capture ──
  const framesDir = path.join(run, 'frames')
  const frames = []
  const cdp = await ctx.newCDPSession(page)
  let n = 0
  cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
    const file = path.join(framesDir, String(++n).padStart(6, '0') + '.jpg')
    fs.writeFileSync(file, Buffer.from(data, 'base64'))
    frames.push({ file, ts: metadata.timestamp ?? Date.now() / 1000 })
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {})
  })
  // Re-issued after every navigation — a new document can end the cast.
  const cast = async () => {
    if (!RECORD) return
    await cdp
      .send('Page.startScreencast', {
        format: 'jpeg',
        quality: 90,
        maxWidth: W,
        maxHeight: H,
        everyNthFrame: 1,
      })
      .catch(() => {})
  }
  if (RECORD) {
    fs.rmSync(framesDir, { recursive: true, force: true })
    fs.mkdirSync(framesDir, { recursive: true })
  }

  // ── helpers the spec's script gets ──
  const wait = (ms) => page.waitForTimeout(FAST ? Math.min(ms, 60) : ms)
  const settle = async () => {
    await page.waitForLoadState('networkidle').catch(() => {})
    await wait(600)
  }
  const go = async (p) => {
    await page.goto(base + p, { waitUntil: 'domcontentloaded' })
    await cast()
    await settle()
  }
  const reveal = async (loc) => {
    await loc.evaluate((el) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }))
    await wait(700)
  }
  const moveTo = async (loc, { ms = 750, dx = 0, dy = 0, scroll = true } = {}) => {
    await loc.waitFor({ state: 'visible', timeout: 10000 }).catch((e) => {
      throw new Error(`never visible: ${loc} (${e.message.split('\n')[0]})`)
    })
    if (scroll) {
      const box0 = await loc.boundingBox()
      if (!box0 || box0.y < 70 || box0.y + box0.height > H - 30) await reveal(loc)
    }
    const box = await loc.boundingBox()
    const x = Math.round(box.x + box.width / 2 + dx)
    const y = Math.round(box.y + box.height / 2 + dy)
    await page.evaluate(([x, y, ms]) => window.__demo?.move(x, y, ms), [x, y, FAST ? 0 : ms])
    // The real pointer follows, so hover states show.
    await page.mouse.move(x, y, { steps: FAST ? 1 : 8 })
    await wait(ms + 60)
  }
  const click = async (loc, opts = {}) => {
    await moveTo(loc, opts)
    await page.evaluate(() => window.__demo?.ripple())
    await wait(opts.quick ? 110 : 180)
    await loc.click()
    await wait(opts.after ?? 450)
  }
  // Quicker hands, for a run of clicks the narration only summarises.
  const tap = (loc) => click(loc, { ms: 430, after: 260, quick: true })
  const type = async (loc, text) => {
    await click(loc, { after: 200 })
    await loc.pressSequentially(text, { delay: FAST ? 0 : 55 })
    await wait(300)
  }
  const tab = (re) => page.locator('.tab, [role=tab]').filter({ hasText: re }).first()
  const scrollTop = async () => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
    await wait(700)
  }

  // A line of narration: `pre` gets the screen ready (said over nothing), then
  // the line starts and `run` plays under it. The line lasts as long as the
  // longer of the two, plus a breath.
  const line = async (id, run, { pre, gap = 450 } = {}) => {
    if (!spec.lines.some((l) => l.id === id)) throw new Error(`no narration line "${id}"`)
    if (pre)
      await pre().catch((e) => {
        throw new Error(`line ${id} (pre): ${e.message}`)
      })
    const at = now()
    timeline.push({ id, at, epoch: Date.now() / 1000 })
    const until = at + (durOf[id] ?? 0) + gap
    if (run)
      await run().catch((e) => {
        throw new Error(`line ${id}: ${e.message}`)
      })
    const rest = until - now()
    if (rest > 0 && RECORD) await page.waitForTimeout(rest)
    console.log(`${id.padEnd(5)} ${(at / 1000).toFixed(1)}s`)
  }
  const mark = (id) => timeline.push({ id, at: now(), epoch: Date.now() / 1000 })

  const h = { page, go, wait, settle, reveal, moveTo, click, tap, type, tab, scrollTop, line, mark }

  try {
    await spec.script(h)
  } finally {
    if (RECORD) {
      await cdp.send('Page.stopScreencast').catch(() => {})
      fs.writeFileSync(path.join(run, 'frames.json'), JSON.stringify(frames))
    }
    if (!FAST) fs.writeFileSync(path.join(run, 'timeline.json'), JSON.stringify(timeline, null, 2))
    await ctx.close()
  }
  console.log(`total ${(now() / 1000).toFixed(1)}s${RECORD ? `, ${frames.length} frames` : ''}`)
}

module.exports = { record }
