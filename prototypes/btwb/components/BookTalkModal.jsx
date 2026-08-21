import { useState, useEffect, useRef, useCallback } from 'react'
import { Modal } from '@components/Modal/Modal'
import { Icon } from '@components/Icon/Icon'
import { ChatBubble, TypingBubble } from '../../book-talks/components/ChatBubble'
import {
  synthesizeVoice,
  stripForSpeech,
  DEFAULT_VOICE_ID,
  VOICES,
  hasVoiceKey,
} from '../../book-talks/voice'
import { TALK_KINDS, scriptFor, READER, BOOK, EMOJIS } from '../data'

// A book talk, as the reader sees it — any of the three types.
//
// The conversation machinery (text-to-speech with a voice picker, the typed
// composer, voice-to-text, the badge celebration) is ported from the Book Talk
// Badges prototype's BennyChat so both surfaces behave identically; what's
// different here is the script model. Benny follows scriptFor(kind): he opens
// warmly, works the point of the talk in as a real question rather than a quiz
// item, follows up, then closes. Integrity talks never grade correctness.
//
// `session` lets a talk be resumed: the parent holds the transcript, so closing
// mid-conversation and reopening picks up where the reader left off.
export function BookTalkModal({ open, kindId, session, onSession, onClose, onFinish }) {
  const kind = TALK_KINDS[kindId]
  const script = scriptFor(kindId)
  // Only challenge-triggered engagement talks carry a badge today.
  const badge = kind.badge

  const [messages, setMessages] = useState(session?.messages ?? [])
  const [turn, setTurn] = useState(session?.turn ?? 0)
  const [done, setDone] = useState(session?.done ?? false)
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState('')
  const [awarded, setAwarded] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)

  // Voice: Benny reads his lines aloud (ElevenLabs, browser-speech fallback).
  const [voiceOn, setVoiceOn] = useState(true)
  const [voiceId, setVoiceId] = useState(DEFAULT_VOICE_ID)
  const [speakingIdx, setSpeakingIdx] = useState(null)
  const [listening, setListening] = useState(false)

  const scrollRef = useRef(null)
  const timers = useRef([])
  const audioRef = useRef(null) // the <audio> currently playing
  const queueRef = useRef([]) // pending [{ idx, text }] to speak
  const drainRef = useRef(false) // queue is being drained
  const genRef = useRef(0) // bumped on stop to invalidate in-flight playback
  const voiceRef = useRef(voiceId) // latest voice (for queued lines)
  const spokenRef = useRef(-1) // last index auto-read (guards re-reads)
  const recognitionRef = useRef(null) // active SpeechRecognition
  const simRef = useRef(false) // a simulated capture is streaming

  const after = useCallback((ms, fn) => {
    timers.current.push(setTimeout(fn, ms))
  }, [])
  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => {
    voiceRef.current = voiceId
  }, [voiceId])

  // ── Benny's voice ──────────────────────────────────────────────────────────
  // Stop all playback now: pause the clip, empty the queue, bump the generation
  // so in-flight fetches resolve quietly. Used for turn-taking, muting and reset.
  const stopAudio = useCallback(() => {
    genRef.current += 1
    queueRef.current = []
    drainRef.current = false
    if (audioRef.current) {
      try {
        audioRef.current.pause()
      } catch {
        /* ignore */
      }
      audioRef.current = null
    }
    window.speechSynthesis?.cancel()
    setSpeakingIdx(null)
  }, [])

  // Fallback when ElevenLabs is unavailable (no key / offline): the browser's
  // built-in speech. Resolves either way so the queue keeps advancing.
  const speakFallback = useCallback(
    (idx, text) =>
      new Promise((resolve) => {
        const spoken = stripForSpeech(text)
        const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
        if (!synth || !spoken) {
          setSpeakingIdx(idx)
          after(Math.min(6000, 1400 + (spoken.length || 24) * 55), () => {
            setSpeakingIdx((cur) => (cur === idx ? null : cur))
            resolve()
          })
          return
        }
        try {
          const u = new SpeechSynthesisUtterance(spoken)
          u.rate = 1.0
          u.pitch = 1.15
          u.onstart = () => setSpeakingIdx(idx)
          const fin = () => {
            setSpeakingIdx((cur) => (cur === idx ? null : cur))
            resolve()
          }
          u.onend = fin
          u.onerror = fin
          synth.speak(u)
        } catch {
          setSpeakingIdx((cur) => (cur === idx ? null : cur))
          resolve()
        }
      }),
    [after],
  )

  const playOne = useCallback(
    (idx, text) =>
      new Promise((resolve) => {
        const gen = genRef.current
        synthesizeVoice(text, voiceRef.current)
          .then((url) => {
            if (gen !== genRef.current) return resolve()
            const audio = new Audio(url)
            audioRef.current = audio
            const fin = () => {
              if (audioRef.current === audio) audioRef.current = null
              setSpeakingIdx((cur) => (cur === idx ? null : cur))
              resolve()
            }
            audio.onplay = () => {
              if (gen === genRef.current) setSpeakingIdx(idx)
            }
            audio.onended = fin
            audio.onerror = fin
            audio.play().catch(fin) // autoplay blocked → move on
          })
          .catch(() => {
            if (gen !== genRef.current) return resolve()
            speakFallback(idx, text).then(resolve)
          })
      }),
    [speakFallback],
  )

  const drain = useCallback(async () => {
    if (drainRef.current) return
    drainRef.current = true
    while (queueRef.current.length) {
      const item = queueRef.current.shift()
      await playOne(item.idx, item.text)
    }
    drainRef.current = false
  }, [playOne])

  // interrupt=true (a manual replay) cuts current speech; false (auto-read) queues.
  const speak = useCallback(
    (idx, text, opts) => {
      if (opts?.interrupt !== false) stopAudio()
      queueRef.current.push({ idx, text })
      drain()
    },
    [stopAudio, drain],
  )

  // Switch voice mid-chat and re-speak Benny's latest line so the change is audible.
  const pickVoice = useCallback(
    (id) => {
      setVoiceId(id)
      voiceRef.current = id
      if (!voiceOn) return
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === 'benny') {
          speak(i, messages[i].text)
          break
        }
      }
    },
    [voiceOn, messages, speak],
  )

  const bennySays = useCallback(
    (text, { delay = 800, emotion, last = false } = {}) => {
      setTyping(true)
      after(delay, () => {
        setTyping(false)
        setMessages((m) => [...m, { role: 'benny', text, emotion }])
        if (last) after(700, () => setDone(true))
      })
    },
    [after],
  )

  // Reset and start over — used by "Start over" and when the script changes.
  const restart = useCallback(() => {
    clearTimers()
    stopAudio()
    recognitionRef.current?.abort?.()
    recognitionRef.current = null
    simRef.current = false
    spokenRef.current = -1
    setMessages([])
    setTurn(0)
    setDone(false)
    setDraft('')
    setAwarded(false)
    setListening(false)
    bennySays(script[0].benny, { delay: 900, emotion: 'excited' })
  }, [script, stopAudio, bennySays])

  // Open → resume an in-progress talk, or start a fresh one.
  useEffect(() => {
    if (!open) return
    spokenRef.current = messages.length - 1 // don't re-read the resumed transcript
    if (!messages.length) restart()
    return () => {
      clearTimers()
      stopAudio()
      recognitionRef.current?.abort?.()
      recognitionRef.current = null
      simRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Hand the transcript up so it survives a close (that's what makes resume work).
  useEffect(() => {
    onSession?.({ messages, turn, done })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, turn, done])

  // Autoscroll to the newest message.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  // Read each new Benny line aloud when TTS is on, guarded by index so a
  // re-render can't read it twice.
  useEffect(() => {
    if (!voiceOn || !open) return
    const idx = messages.length - 1
    if (idx < 0 || messages[idx].role !== 'benny') return
    if (spokenRef.current === idx) return
    spokenRef.current = idx
    speak(idx, messages[idx].text, { interrupt: false })
  }, [messages, voiceOn, open, speak])

  // The badge pops once Benny's closing line has had a beat to land.
  useEffect(() => {
    if (!done || !badge) return
    const t = setTimeout(() => setAwarded(true), 900)
    return () => clearTimeout(t)
  }, [done, badge])

  function send(text) {
    const value = (text ?? draft).trim()
    if (!value || done || typing) return
    // The reader answered — stop Benny's audio so his next line speaks cleanly.
    stopAudio()
    setDraft('')
    setEmojiOpen(false)
    setMessages((m) => [...m, { role: 'student', text: value }])

    const next = script[turn + 1]
    setTurn(turn + 1)
    if (next) {
      const isLast = !next.replies.length
      bennySays(next.benny, { emotion: isLast ? 'happy' : undefined, last: isLast })
    }
  }

  // ── Voice-to-text ──────────────────────────────────────────────────────────
  // The transcript types straight into the composer. Real recognition when the
  // browser has it, else a simulated stream so the mic still demos.
  function stopListening() {
    simRef.current = false
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        /* ignore */
      }
      recognitionRef.current = null
    }
    setListening(false)
  }
  function simListen() {
    simRef.current = true
    setListening(true)
    const phrase = script[turn]?.replies?.[0] || 'I really enjoyed reading it.'
    const words = phrase.split(' ')
    words.forEach((_, i) =>
      after(280 * (i + 1), () => {
        if (simRef.current) setDraft(words.slice(0, i + 1).join(' '))
      }),
    )
    after(280 * (words.length + 2), () => {
      if (simRef.current) stopListening()
    })
  }
  function startListening() {
    if (typing || done) return
    stopAudio() // don't let Benny's TTS bleed into the mic
    setDraft('')
    const SR =
      typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
    if (!SR) return simListen()
    let rec
    try {
      rec = new SR()
    } catch {
      return simListen()
    }
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.continuous = true
    recognitionRef.current = rec
    setListening(true)
    rec.onresult = (e) => {
      let text = ''
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript
      setDraft(text.trim())
    }
    rec.onerror = () => {
      recognitionRef.current = null
      if (!simRef.current) simListen()
    }
    rec.onend = () => {
      recognitionRef.current = null
      if (!simRef.current) setListening(false)
    }
    try {
      rec.start()
    } catch {
      recognitionRef.current = null
      simListen()
    }
  }

  const current = script[turn]
  const showSuggestions =
    !typing && !done && !listening && messages.length > 0 && messages.at(-1)?.role === 'benny'

  const finish = () => {
    setAwarded(false)
    onFinish?.()
    onClose()
  }

  return (
    <>
      <Modal open={open} onClose={onClose} variant="center" ariaLabel="Book talk with Benny">
        <div className="bw-talk">
          <header className="bw-talk-head" style={{ '--kind': kind.color }}>
            <img src="/bs-prototypes/benny.png" alt="" className="bw-talk-benny" />
            <div className="bw-talk-titles">
              <span className="bw-talk-title">Book Talk with Benny</span>
              <span className="bw-talk-sub">
                {kind.short} · {READER.gradeLabel}
              </span>
            </div>

            <div className="bw-talk-tools">
              {hasVoiceKey() && (
                <select
                  className="bt-chat-voice"
                  value={voiceId}
                  onChange={(e) => pickVoice(e.target.value)}
                  title="Change Benny’s voice"
                  aria-label="Benny’s voice"
                >
                  {VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              )}
              <button
                className={`bt-tts-toggle${voiceOn ? ' is-on' : ''}`}
                onClick={() => {
                  stopAudio()
                  setVoiceOn((v) => !v)
                }}
                aria-pressed={voiceOn}
                title={voiceOn ? 'Benny reads aloud — tap to mute' : 'Tap to hear Benny'}
                aria-label="Toggle read aloud"
              >
                <Icon name={voiceOn ? 'volume' : 'volume-off'} size={15} />
              </button>
              <button className="bw-talk-close" onClick={onClose} aria-label="Close">
                <Icon name="x" size={18} />
              </button>
            </div>
          </header>

          <div className="bw-talk-book">
            <img src={BOOK.cover} alt="" className="bw-talk-cover" />
            <span>
              <strong>{BOOK.title}</strong> · {BOOK.author}
            </span>
          </div>

          <div className="bw-talk-body" ref={scrollRef}>
            {messages.map((m, i) => (
              <ChatBubble
                key={i}
                msg={m}
                onSpeak={m.role === 'benny' ? () => speak(i, m.text) : undefined}
                speaking={speakingIdx === i}
              />
            ))}
            {typing && <TypingBubble />}
          </div>

          <footer className="bt-chat-foot" style={{ '--kind': kind.color }}>
            {done ? (
              <div className="bw-talk-done" style={{ '--kind': kind.color }}>
                <Icon name="circle-check" size={18} />
                <span>Talk complete — sent to your teacher.</span>
                <button className="bw-talk-doneBtn" onClick={restart}>
                  <Icon name="refresh" size={15} /> Start over
                </button>
              </div>
            ) : (
              <>
                {showSuggestions && current?.replies.length > 0 && (
                  <div className="bt-chat-suggestions">
                    {current.replies.map((r) => (
                      <button key={r} className="bt-chip" onClick={() => send(r)}>
                        {r}
                      </button>
                    ))}
                  </div>
                )}

                {emojiOpen && (
                  <div className="bw-talk-emojis" role="group" aria-label="Add an emoji">
                    {EMOJIS.map((e) => (
                      <button
                        key={e}
                        className="bw-talk-emoji"
                        onClick={() => setDraft((d) => `${d}${e}`)}
                        aria-label={`Add ${e}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}

                <form
                  className="bt-chat-composer"
                  onSubmit={(e) => {
                    e.preventDefault()
                    send()
                  }}
                >
                  <input
                    className="bt-chat-input"
                    placeholder={listening ? 'Listening…' : 'Type your answer…'}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    disabled={typing}
                    readOnly={listening}
                  />
                  <button
                    type="button"
                    className={`bt-chat-mic${emojiOpen ? ' is-listening' : ''}`}
                    onClick={() => setEmojiOpen((v) => !v)}
                    title="Add an emoji"
                    aria-label="Add an emoji"
                    aria-pressed={emojiOpen}
                    disabled={typing}
                  >
                    <Icon name="smile" size={17} />
                  </button>
                  <button
                    type="button"
                    className={`bt-chat-mic${listening ? ' is-listening' : ''}`}
                    onClick={() => (listening ? stopListening() : startListening())}
                    title={listening ? 'Stop' : 'Speak your answer'}
                    aria-label={listening ? 'Stop listening' : 'Voice to text'}
                    aria-pressed={listening}
                    disabled={typing}
                  >
                    <Icon name="microphone" size={17} />
                  </button>
                  <button
                    type="submit"
                    className="bt-chat-send"
                    disabled={!draft.trim() || typing}
                    aria-label="Send"
                    style={{ background: kind.color }}
                  >
                    <Icon name="send" size={16} color="#fff" />
                  </button>
                </form>
              </>
            )}
          </footer>
        </div>
      </Modal>

      {/* Celebration — only talks that carry a badge award one. */}
      {badge && (
        <Modal open={awarded} onClose={finish} variant="center" ariaLabel="Badge earned">
          <div className="bt-award-modal">
            <button className="bt-award-modal-close" onClick={finish} aria-label="Close">
              <Icon name="x" size={16} stroke={2.2} />
            </button>
            <div className="bt-award-pop" style={{ background: kind.color }}>
              <Icon name="award" size={36} color="#fff" />
              <span className="bt-award-spark bt-award-spark--1">
                <Icon name="sparkles" size={16} color={kind.color} />
              </span>
              <span className="bt-award-spark bt-award-spark--2">
                <Icon name="star-filled" size={12} color="#F59E0B" />
              </span>
            </div>
            <div className="bt-award-title">Badge earned!</div>
            <div className="bt-award-name">{badge}</div>
            <button
              className="bt-award-modal-btn"
              onClick={finish}
              style={{ background: kind.color }}
            >
              Awesome!
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
