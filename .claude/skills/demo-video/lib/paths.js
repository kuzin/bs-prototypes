// Where the demo tooling keeps what shouldn't live in the repo: the recorder's
// Node deps, the Kokoro voice model (~350 MB), and each demo's working files
// (browser profile, captured frames, narration audio). Override with DEMO_CACHE.
const os = require('os')
const path = require('path')

const CACHE = process.env.DEMO_CACHE || path.join(os.homedir(), '.cache', 'bs-demo-video')

module.exports = {
  CACHE,
  NODE_DIR: path.join(CACHE, 'node'),
  KOKORO_DIR: path.join(CACHE, 'kokoro'),
  // Licensed tracks stay here, never in the repo — a spec names one by file.
  MUSIC_DIR: path.join(CACHE, 'music'),
  runDir: (name) => path.join(CACHE, 'runs', name),
  // Finished videos land somewhere a person will find them.
  outDir: (name) => path.join(os.homedir(), 'Desktop', name),
}
