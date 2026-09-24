"""Narration for a demo: every line in narration.json spoken by Kokoro (an
open-source neural voice that runs locally), one WAV per line, plus
narration.timed.json with each line's length — the recorder paces to it.

    python tts.py <run dir> <voice> <speed>

A line's `say` (if present) is what's spoken, `text` what the script shows — for
words the voice gets wrong ("MARC" → "mark"). Unchanged lines are reused.
"""
import hashlib
import json
import os
import sys

import soundfile as sf
from kokoro_onnx import EspeakConfig, Kokoro

run, voice, speed = sys.argv[1], sys.argv[2], float(sys.argv[3])
kdir = os.environ["KOKORO_DIR"]

# Homebrew's espeak-ng, not the wheel's: the bundled library has the data path
# of the machine it was built on baked in and can't find its phoneme tables.
espeak = EspeakConfig(
    lib_path=os.environ.get("ESPEAK_LIB", "/opt/homebrew/lib/libespeak-ng.dylib"),
    data_path=os.environ.get("ESPEAK_DATA", "/opt/homebrew/share/espeak-ng-data"),
)
kokoro = Kokoro(
    os.path.join(kdir, "kokoro-v1.0.onnx"),
    os.path.join(kdir, "voices-v1.0.bin"),
    espeak_config=espeak,
)

with open(os.path.join(run, "narration.json")) as f:
    lines = json.load(f)
audio = os.path.join(run, "audio")
os.makedirs(audio, exist_ok=True)

made = reused = 0
for line in lines:
    spoken = line.get("say") or line["text"]
    key = hashlib.sha1(f"{voice}|{speed}|{spoken}".encode()).hexdigest()
    wav = os.path.join(audio, f"{line['id']}.wav")
    keyfile = wav + ".key"
    if os.path.exists(wav) and os.path.exists(keyfile) and open(keyfile).read() == key:
        info = sf.info(wav)
        line["dur"] = round(info.frames / info.samplerate * 1000)
        reused += 1
        continue
    samples, sr = kokoro.create(spoken, voice=voice, speed=speed, lang="en-us")
    sf.write(wav, samples, sr)
    with open(keyfile, "w") as f:
        f.write(key)
    line["dur"] = round(len(samples) / sr * 1000)
    made += 1

with open(os.path.join(run, "narration.timed.json"), "w") as f:
    json.dump(lines, f, indent=2)
total = sum(l["dur"] for l in lines) / 1000
print(f"{len(lines)} lines ({made} spoken, {reused} reused), {total:.1f}s of speech")
