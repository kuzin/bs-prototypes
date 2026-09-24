// Where the demo tooling keeps what doesn't live in the repo — two places:
//
//   CACHE   ~/.cache/bs-demo-video (or DEMO_CACHE): the tools, kept between
//           runs — the recorder's Node deps and the Kokoro voice model (~350 MB).
//   runDir  the system temp folder (or DEMO_TMP): one demo's working files —
//           browser profile, captured frames, narration audio, the built video
//           and its contact sheet. Throwaway: `site` deletes it once the video
//           is in the repo, and `clean` deletes it without keeping anything.
//
// The finished video's only home is the repo (public/demo-videos/).
const os = require('os')
const path = require('path')

const CACHE = process.env.DEMO_CACHE || path.join(os.homedir(), '.cache', 'bs-demo-video')
const TMP = process.env.DEMO_TMP || path.join(os.tmpdir(), 'bs-demo-video')

module.exports = {
  CACHE,
  NODE_DIR: path.join(CACHE, 'node'),
  KOKORO_DIR: path.join(CACHE, 'kokoro'),
  // Music a spec names by file: the skill's own music/ folder first (licensed
  // tracks the team can use), then the cache's, for anything kept local.
  MUSIC_DIRS: [path.join(__dirname, '..', 'music'), path.join(CACHE, 'music')],
  runDir: (name) => path.join(TMP, name),
}
