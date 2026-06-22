#!/usr/bin/env bash
# One-shot staging for the design-sync converter. Idempotent.
set -euo pipefail
SB="/private/tmp/claude-501/bundled-skills/2.1.185/a6b1a85b086b839b845b8f426a7f6d41/design-sync"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

mkdir -p .ds-sync
cp -r "$SB"/package-build.mjs "$SB"/package-validate.mjs "$SB"/package-capture.mjs "$SB"/resync.mjs "$SB"/lib "$SB"/storybook .ds-sync/
printf '%s\n' '{"name":"ds-sync-deps","private":true}' > .ds-sync/package.json

# Repo acts as its own installed package (PKG_DIR / tokensPkg resolution).
ln -sfn "$ROOT" node_modules/bs-prototypes

# Re-apply the staged-converter patch (cp above overwrote it): adds an
# import.meta.glob no-op define so the Vite-only glob in ComponentUsage.jsx
# doesn't crash the IIFE bundle. See .design-sync/patch-staged.mjs.
node .design-sync/patch-staged.mjs

echo "=== staged into .ds-sync ==="
ls .ds-sync/
echo "=== symlink ==="
ls -ld node_modules/bs-prototypes
echo "=== components visible through symlink ==="
ls node_modules/bs-prototypes/components/ | head -3
echo "SETUP_OK"
