---
name: demo-video
description: Make a narrated click-through demo video of the prototypes — a headless browser clicks through them while a natural local AI voice (Kokoro) narrates over a soft music bed — and publish it to the prototype picker's Demo videos tab. Use when the user asks for a demo video, a walkthrough video, a screen recording with voiceover, or to update/re-render an existing demo.
---

# Demo video

A demo is one spec file in `demos/`: the narration lines, and a script of clicks that
plays under them. The tooling speaks every line, drives the prototypes in a headless
Chromium paced to that speech, captures the screen with real timestamps, and puts each
line exactly where its moment happened.

**Where things go.** Everything a run makes — browser profile, captured frames (a
gigabyte for an eight-minute demo), narration audio, the video, its contact sheet — lives
in a temp folder, `$TMPDIR/bs-demo-video/<spec name>/` (override with `DEMO_TMP`). The
finished video's one home is the repo: `site` copies it to `public/demo-videos/`, lists it
on the landing page's **Demo videos** tab, and deletes the temp folder. Nothing is written
anywhere else — not the Desktop, not the cache.

Existing demos: `collection-engine` (reader → school → district → teacher → Book Lists),
`challenge-creator` (roles → a template → badges → rewards → publish).

## 0. One-time setup

```bash
bash .claude/skills/demo-video/setup.sh
```

Installs into `~/.cache/bs-demo-video` (never the repo): `playwright-core` and a Chromium,
the Kokoro voice model (~350 MB), and Homebrew's `espeak-ng` and `ffmpeg`. Re-running is
safe — it skips what's there. Say what it will download before running it the first time.

## 1. The dev server

The recorder drives the running dev server. Start it (`preview_start` "web", or
`pnpm dev`) and read the port Vite printed — it lands on 5174 when another checkout's
server holds 5173. Pass it as `--base http://localhost:<port>/bs-prototypes`.

## 2. Write or edit the spec

`demos/<name>.js` exports:

```js
module.exports = {
  name: 'my-demo', // the temp folder and the published file names
  title: 'My demo — demo', // the picker's title, minus a trailing "— demo"
  voice: 'am_michael', // any Kokoro voice (see below)
  speed: 1.08,
  music: 'lofi-full.mp3', // see Music
  viewport: { width: 1440, height: 810 },
  // For the picker's Demo videos tab:
  description: 'What the video walks through, in a sentence.',
  prototypes: ['books'], // registry ids it covers — each becomes a link
  posterLine: 'r01', // the line whose moment becomes the poster
  lines: [
    { id: 'r01', chapter: 'Reader', screen: 'Discover', text: 'What the voice says.' },
    { id: 'r02', text: 'Upload a MARC file.', say: 'Upload a mark file.' }, // `say` fixes pronunciation
  ],
  async script(h) {
    await h.go('/books/')
    h.mark('start') // the video starts here
    await h.line('r01', async () => {
      await h.moveTo(h.page.locator('.bk-quiz-banner'))
    })
    await h.line('r02', () => h.click(h.tab(/^Wish List/)), { pre: () => h.go('/books/') })
    h.mark('end') // …and ends here
  },
}
```

`line(id, run, { pre, gap })` — `pre` sets the screen up in silence, then the line starts
and `run` plays under it; the line lasts as long as the longer of the two. Every line in
`lines` needs exactly one `line()` call, in order.

Helpers on `h`: `page` (Playwright), `go(path)`, `moveTo(loc, { dx, dy, ms, scroll })`
(glides the drawn cursor there, and hovers), `click(loc)`, `tap(loc)` (quicker, for a run
of clicks the narration only summarises), `type(loc, text)`, `tab(regex)` (a `.tab` by its
text), `reveal(loc)` (smooth-scrolls it to the middle), `scrollTop()`, `settle()`, `wait(ms)`.

Find selectors by probing the real page first (a short playwright-core script, or the
in-app browser) — don't guess them.

## 3. Run it

```bash
node .claude/skills/demo-video/demo.js <demo> [stage…] --base http://localhost:5174/bs-prototypes
```

Stages, in order: `narration` (speak the lines; unchanged lines are reused) · `check` (the
whole script, fast, no pacing — a selector check, ~40s) · `record` (the real paced run) ·
`build` (the MP4, encoded once at the size it's published at) · `sheet` (a contact sheet).
No stage = all of them, all inside the temp folder.

Iterating: fix a selector → `check`; change wording → `narration record build sheet`
(the pacing follows the speech, so a new line length needs a new recording); change the
music or its level → `build sheet` (the frames are still there).

## 4. Verify, then publish

A clean run can still click the wrong thing. Read the contact sheet the run printed
(`$TMPDIR/bs-demo-video/<name>/sheet.png`) — one frame per line, most of the way through
it, left to right, top to bottom (`sheet.txt` lists the order) — and check each frame shows
what its line says. Fix and re-run until it does.

Then:

```bash
node .claude/skills/demo-video/demo.js <demo> site
```

`site` copies the video as is to `public/demo-videos/<name>.mp4`, grabs a poster frame from
`posterLine`, upserts the demo's entry in `components/demoVideos.json` (the landing page's
Demo videos tab reads it: title, length, description, recorded date, links to the
prototypes it covers) — and deletes the temp folder. Send the repo copy with
`SendUserFile`; it ships with the next `/publish`. To throw a run away instead, `clean`.

After `site` there's nothing left to rebuild from, so a later change means a fresh run.

## Music

`music: 'lofi-full.mp3'` in the spec (or `--music <file | path | none>`) lays a track under
the voice: looped with 4-second crossfades, soft, and ducked further whenever the voice
speaks, so the gaps between lines aren't dead air. Tracks live in the skill's `music/`
folder — licensed ones only (`lofi-full.mp3` is licensed through Envato Elements); anything
that can't be committed goes in `~/.cache/bs-demo-video/music`. Envato's MCP can search for
tracks but not download them.

## Voices

Kokoro runs locally and free. American male: `am_michael` (the default — steady narrator),
`am_fenrir` (deeper), `am_puck` (lighter). Female: `af_heart`, `af_bella`. British:
`bm_george`, `bm_fable`, `bf_emma`. Override with `--voice` / `--speed`. To audition, speak
one line to a WAV with the Kokoro venv and send it.

## Gotchas

- **Don't use Playwright's `recordVideo`.** It drifts (a 205 s run came out 224 s), so the
  voice walks ahead of the picture. The recorder uses Chrome's screencast frames, each
  stamped with its paint time, on the same clock as the narration timeline.
- **Headless draws no cursor.** `lib/cursor.js` draws one, plus a click ripple, and hides
  the preview bar at the top (`.pvb`). It keeps the prototype bar at the bottom
  (`.proto-nav`) — without it the pages lose their frame and the video looks off.
- **Prototype state is sticky.** Tabs live in `sessionStorage` (logging leaves the books app
  on the Reading Log, so go back to Discover explicitly), and some state is shared through
  `localStorage` (title requests) — clear it at the start of the script for a clean run.
- **The browser profile keeps `localStorage` for the life of the temp folder** — `check`
  then `record` run in the same one. A prototype that autosaves there — the Challenge
  Creator's draft is `cc-v2` — resumes wherever `check` left it; remove its key at the
  start of the script.
- **Toggles cut both ways.** A "wish" or "add" button on something already added removes
  it — pick the element by its current label (`filter({ hasText: 'Add to Wish List' })`).
- **Kokoro's own espeak can't find its data on Apple Silicon** — `tts.py` uses Homebrew's.
- **A background tab reports an animation's first frame** if read right after mount;
  check `el.getAnimations()` before calling it broken.
