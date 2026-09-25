"""Narration for a demo: every line in narration.json spoken by Kokoro (an
open-source neural voice that runs locally), one WAV per line, plus
narration.timed.json with each line's length — the recorder paces to it.

    python tts.py <run dir> <voice> <speed>

A line's `say` (if present) is what's spoken, `text` what the script shows — for
words the voice gets wrong ("MARC" → "mark"). For one word, mark it in place
instead: `[word](respelling)` keeps the word in the script and has the voice say
the respelling — "the days [read](red)", "reviews [live](liv) here",
"the [RMI](R M I)". Unchanged lines are reused.

After speaking, it prints how every homograph (read, live, lead, close…) and
every acronym came out, so a wrong guess is caught before it is recorded: espeak
only reads past-tense "read" as "red" after a word like "have" or "they've", so
"the days read" or "gets read" come out "reed".
"""
import hashlib
import json
import os
import re
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

MARK = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")

# Words with two readings, and what each reading's phonemes sound like — the
# report names the one espeak picked. Keyed by phonemes without stress marks.
HOMOGRAPHS = {
    "read": {"ɹiːd": "reed", "ɹɛd": "red"},
    "reads": {"ɹiːdz": "reeds", "ɹɛdz": "reds"},
    "reread": {"ɹiːɹiːd": "re-reed", "ɹiːɹɛd": "re-red"},
    "live": {"lɪv": "liv", "laɪv": "lyve"},
    "lives": {"lɪvz": "livs", "laɪvz": "lyves"},
    "lead": {"liːd": "leed", "lɛd": "led"},
    "leads": {"liːdz": "leeds", "lɛdz": "leds"},
    "close": {"kloʊs": "close (near)", "kloʊz": "cloze (shut)"},
    "closes": {"kloʊzᵻz": "clozes", "kloʊsᵻz": "closes"},
    "use": {"juːs": "yoos (noun)", "juːz": "yooz (verb)"},
    "record": {"ɹɛkɚd": "REC-ord (noun)", "ɹᵻkɔːɹd": "re-CORD (verb)"},
    "records": {"ɹɛkɚdz": "REC-ords (noun)", "ɹᵻkɔːɹdz": "re-CORDS (verb)"},
    "present": {"pɹɛzənt": "PREZ-ent", "pɹᵻzɛnt": "pre-ZENT"},
    "minute": {"mɪnɪt": "MIN-it", "maɪnuːt": "my-NOOT"},
    "content": {"kɑːntɛnt": "CON-tent", "kəntɛnt": "con-TENT"},
    "object": {"ɑːbdʒɛkt": "OB-ject", "əbdʒɛkt": "ob-JECT"},
    "wind": {"wɪnd": "wind (air)", "waɪnd": "wynd (turn)"},
    "tear": {"tɪɹ": "teer (cry)", "tɛɹ": "tair (rip)"},
    "row": {"ɹoʊ": "roh (line)", "ɹaʊ": "rau (fight)"},
}


def report(tok, spoken):
    """(word, what it came out as, a little context) for each homograph and
    acronym in the line. Each word is phonemized with everything before it —
    espeak's choice turns on the words ahead of it — and read off the end."""
    notes = []
    for m in re.finditer(r"[A-Za-z’']+", spoken):
        w = m.group(0)
        acronym = len(w) >= 2 and w.isupper()
        if w.lower() not in HOMOGRAPHS and not acronym:
            continue
        ph = tok.phonemize(spoken[: m.end()], lang="en-us").strip()
        last = re.split(r"\s+", ph)[-1].strip(".,:;!?…—“”\"")
        bare = last.replace("ˈ", "").replace("ˌ", "")
        said = HOMOGRAPHS.get(w.lower(), {}).get(bare, last)
        ctx = spoken[max(0, m.start() - 22) : m.end() + 14].replace("\n", " ")
        notes.append((w, said, ctx))
    return notes


with open(os.path.join(run, "narration.json")) as f:
    lines = json.load(f)
audio = os.path.join(run, "audio")
os.makedirs(audio, exist_ok=True)

made = reused = 0
for line in lines:
    spoken = MARK.sub(r"\2", line.get("say") or line["text"])
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

# How the homographs and acronyms came out. A wrong one gets a mark in the spec
# — `[read](red)`, `[RMI](R M I)` — and a fresh `narration`.
notes = [(l["id"], n) for l in lines for n in report(kokoro.tokenizer, MARK.sub(r"\2", l.get("say") or l["text"]))]
if notes:
    print("\nhomographs and acronyms — check each reads right in context; mark a wrong one [word](respelling):")
    for lid, (w, said, ctx) in notes:
        print(f"  {lid:5} {w:10} → {said:14} …{ctx}…")

with open(os.path.join(run, "narration.timed.json"), "w") as f:
    json.dump(lines, f, indent=2)
total = sum(l["dur"] for l in lines) / 1000
print(f"{len(lines)} lines ({made} spoken, {reused} reused), {total:.1f}s of speech")
