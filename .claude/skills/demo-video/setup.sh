#!/usr/bin/env bash
# One-time setup for demo videos. Everything lands in ~/.cache/bs-demo-video
# (override with DEMO_CACHE), nothing in the repo. Safe to re-run — each step
# skips what's already there.
set -euo pipefail

CACHE="${DEMO_CACHE:-$HOME/.cache/bs-demo-video}"
mkdir -p "$CACHE/node" "$CACHE/kokoro"

# ffmpeg builds the video; espeak-ng is Kokoro's pronunciation engine (the copy
# bundled with its Python wheel can't find its own data on Apple Silicon).
command -v ffmpeg >/dev/null || brew install ffmpeg
[ -f /opt/homebrew/lib/libespeak-ng.dylib ] || brew install espeak-ng

# The recorder: playwright-core plus a Chromium to drive.
cd "$CACHE/node"
[ -f package.json ] || npm init -y >/dev/null
[ -d node_modules/playwright-core ] || npm install --silent playwright-core@1.49.1
node node_modules/playwright-core/cli.js install chromium

# The voice: Kokoro (open source, runs locally) and its model files (~350 MB).
cd "$CACHE/kokoro"
[ -x venv/bin/python ] || python3 -m venv venv
venv/bin/python -c "import kokoro_onnx, soundfile" 2>/dev/null || venv/bin/pip install -q kokoro-onnx soundfile
REL=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
[ -s kokoro-v1.0.onnx ] || curl -fL -o kokoro-v1.0.onnx "$REL/kokoro-v1.0.onnx"
[ -s voices-v1.0.bin ] || curl -fL -o voices-v1.0.bin "$REL/voices-v1.0.bin"

echo "demo-video: ready in $CACHE"
