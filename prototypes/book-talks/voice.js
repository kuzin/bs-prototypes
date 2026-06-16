// Benny's voice — hosted text-to-speech via ElevenLabs (not the device's local
// OS voices). The API key lives in a gitignored .env.local
// (VITE_ELEVENLABS_API_KEY) and is read at build time; it is never hardcoded or
// committed. ElevenLabs sends `access-control-allow-origin: *`, so the browser
// can call it directly — no backend/proxy. With no key, BennyChat falls back to
// the browser's built-in speech so the prototype still demos.

const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY
const ENDPOINT = 'https://api.elevenlabs.io/v1/text-to-speech'
// Flash is low-latency (~tens of ms) — the right fit for a live back-and-forth
// chat, where responsiveness matters more than the last drop of expressiveness.
const MODEL_ID = 'eleven_flash_v2_5'

export const hasVoiceKey = () => Boolean(API_KEY)

// A curated slice of the ElevenLabs voice library chosen to suit Benny — a
// warm, friendly K-12 reading mascot. "River" (gender-neutral) is the default
// so Benny reads non-binary, matching how he's been voiced before; the rest
// give a spread of personalities to audition from the toolbar picker.
export const VOICES = [
  { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River', blurb: 'Neutral & relaxed' },
  { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', blurb: 'Playful, bright, warm' },
  { id: 'bIHbv24MWmeRgasZH58o', name: 'Will', blurb: 'Relaxed optimist' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', blurb: 'Enthusiastic & quirky' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', blurb: 'Warm storyteller (UK)' },
  { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice', blurb: 'Clear educator (UK)' },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', blurb: 'Energetic & friendly' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', blurb: 'Young & reassuring' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', blurb: 'Bright & energetic' },
]
export const DEFAULT_VOICE_ID = VOICES[0].id

// Strip emoji + symbols so the synthesizer doesn't read "🌱" aloud as
// "seedling" mid-sentence. (Shared with the browser-speech fallback.)
export const stripForSpeech = (s) =>
  String(s)
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()

// Cache synthesized clips by voice+text so replays and re-renders don't re-bill
// the API or re-wait on the network. Object URLs live for the page session.
const cache = new Map()

// Returns a playable object-URL for `text` in `voiceId`. Throws if there's no
// key or the request fails, so the caller can fall back to browser speech.
export async function synthesizeVoice(text, voiceId = DEFAULT_VOICE_ID) {
  if (!API_KEY) throw new Error('elevenlabs: no key')
  const clean = stripForSpeech(text)
  if (!clean) throw new Error('elevenlabs: empty text')
  const key = `${voiceId}::${clean}`
  const cached = cache.get(key)
  if (cached) return cached

  const res = await fetch(`${ENDPOINT}/${voiceId}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: clean,
      model_id: MODEL_ID,
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.8,
        style: 0.25,
        use_speaker_boost: true,
      },
    }),
  })
  if (!res.ok) throw new Error(`elevenlabs: ${res.status}`)
  const url = URL.createObjectURL(await res.blob())
  cache.set(key, url)
  return url
}
