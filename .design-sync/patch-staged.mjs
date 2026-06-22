// Durable patch applied to the staged converter after setup.sh copies it.
// `cp -r` from the skill bundle overwrites .ds-sync/ on every (re-)stage, so any
// fix to a staged lib file must be re-applied here to stay reproducible.
//
// Patch: add `import.meta.glob` to lib/common.mjs's IIFE_IMPORT_META_DEFINE.
// bs-prototypes is a Vite app; ComponentUsage.jsx calls `import.meta.glob(...)`
// at module top-level and is reachable from PrototypeNav, so it lands in the
// IIFE bundle. Under iife esbuild leaves `import.meta` empty, so glob() throws
// at eval and kills window.Joyful for EVERY preview. The converter already
// defines import.meta.url/.env for the same reason; this adds .glob mapped to
// the global `Object` — esbuild defines must be a literal or entity name (an
// arrow fn is rejected), and `Object(...)` is callable and returns an object
// instead of throwing, so glob() is a harmless no-op at module eval.
// bundle.mjs (forbidden to fork) statically imports this constant, so the
// override mechanism can't reach it — patching the staged file is the only way.
import { readFileSync, writeFileSync } from 'node:fs'

const TARGET = new URL('../.ds-sync/lib/common.mjs', import.meta.url)
const KEY = "'import.meta.glob': 'Object',"
const ANCHOR = 'export const IIFE_IMPORT_META_DEFINE = {'

let src = readFileSync(TARGET, 'utf8')
if (src.includes('import.meta.glob')) {
  console.log('patch-staged: import.meta.glob define already present — ok')
  process.exit(0)
}
if (!src.includes(ANCHOR)) {
  console.error(`patch-staged: FAILED — anchor "${ANCHOR}" not found in common.mjs (upstream changed?). The IIFE bundle will crash on import.meta.glob. Fix this patch.`)
  process.exit(1)
}
src = src.replace(ANCHOR, `${ANCHOR}\n  ${KEY}`)
writeFileSync(TARGET, src)
console.log('patch-staged: added import.meta.glob define to common.mjs')
