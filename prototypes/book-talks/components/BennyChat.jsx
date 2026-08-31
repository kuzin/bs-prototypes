import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Modal } from '@components/Modal/Modal'
import { Icon } from '@components/Icon/Icon'
import { ChatBubble, TypingBubble } from './ChatBubble'
import {
  BENNY_OPENER,
  BENNY_CLOSER,
  BENNY_NUDGES,
  BENNY_INTERVENTION,
  BENNY_FAIL,
  INTERVENE_AFTER,
  FAIL_AFTER,
  LOW_EFFORT_SUGGESTIONS,
  isWeakAnswer,
  deriveScript,
  faceFor,
  BENNY_SELF_OPENER,
  BENNY_SELF_ACK,
  BENNY_SELF_CLOSER,
  SELF_TOPICS,
  SURPRISE_TOPIC,
  randomTopicId,
} from '../data'

import { synthesizeVoice, stripForSpeech, DEFAULT_VOICE_ID, VOICES, hasVoiceKey } from '../voice'

import '@components/Primitives/Primitives.css'

// The live conversation. Benny greets, then asks questions derived from the
// teacher's prompt; once the student has given `badge.minExchanges` solid
// answers the chat wraps up and a "Badge earned!" modal pops over it. The chat
// itself is the requirement — there is no reading log here.
//
// Low-effort answers (the dimmed chip, or a curt reply) don't count toward the
// bar. The student never sees them flagged — but Benny notices: after a couple
// he gives an encouraging heads-up, and if the chat really isn't getting there
// he kindly ends it and offers a "Try again". (Flags are recorded for the
// teacher's review elsewhere, not shown here.)
//
// `selfStart` flips this into a reader-initiated talk: nothing assigned it, so
// Benny opens by asking what they want to talk about.
//
// Badges are measured in CONVERSATIONS, not answers — so a finished talk is one
// unit of credit either way. `onComplete()` runs when the talk counts and
// returns `{ badges, note }`: whichever badges that conversation just earned,
// and where the reader stands on the next one. The celebration renders that.
export function BennyChat({ badge, open, onClose, onComplete, selfStart = false }) {
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [good, setGood] = useState(0) // solid answers — advance + count toward the badge
  const [weak, setWeak] = useState(0) // low-effort answers (internal — not shown)
  const [intervened, setIntervened] = useState(false)
  const [failed, setFailed] = useState(false)
  const [done, setDone] = useState(false)
  const [draft, setDraft] = useState('')
  const [awarded, setAwarded] = useState(false)
  const [topicId, setTopicId] = useState(null) // self-started: the topic the reader picked
  const [result, setResult] = useState(null) // { badges, note } — what this talk earned
  // Read-aloud is off until the reader asks for it — no audio starts on its own
  // when the chat opens. Switching it on reads Benny's current line.
  const [voiceOn, setVoiceOn] = useState(false)
  const [voiceId, setVoiceId] = useState(DEFAULT_VOICE_ID) // which ElevenLabs voice
  const [speakingIdx, setSpeakingIdx] = useState(null) // which message is "playing"
  const [listening, setListening] = useState(false) // voice-to-text capture
  const scrollRef = useRef(null)
  const timers = useRef([])
  const recognitionRef = useRef(null) // active SpeechRecognition, if supported
  const simRef = useRef(false) // a simulated capture is streaming
  // Voice playback (ElevenLabs audio): one clip at a time, fed by a queue so
  // Benny's lines play in turn instead of cutting each other off.
  const audioRef = useRef(null) // the <audio> currently playing
  const queueRef = useRef([]) // pending [{ idx, text }] to speak
  const drainRef = useRef(false) // queue is being drained
  const genRef = useRef(0) // bumped on stop to invalidate in-flight playback
  const voiceRef = useRef(voiceId) // latest selected voice (for queued lines)
  const spokenRef = useRef(-1) // last message index auto-read (guards re-reads)

  // How many solid answers make this conversation count — the same bar whether
  // the reader was sent here by a badge or came looking for Benny themselves.
  const need = badge.minExchanges
  const script = useMemo(
    () => deriveScript(selfStart ? topicId : badge.promptId),
    [selfStart, topicId, badge.promptId],
  )

  const after = useCallback((ms, fn) => {
    const t = setTimeout(fn, ms)
    timers.current.push(t)
  }, [])

  // Keep the latest selected voice available to queued/async playback.
  useEffect(() => {
    voiceRef.current = voiceId
  }, [voiceId])

  // ── Benny's voice — ElevenLabs audio, with a browser-speech fallback ───────
  // Stop all playback now: pause the current clip, empty the queue, and bump
  // the generation so any in-flight fetch resolves quietly. Used for turn-taking
  // (the student answers), muting, the mic, and resets.
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

  // Fallback when ElevenLabs is unavailable (no key / offline / out of credits):
  // the browser's built-in speech. Resolves when the line finishes so the queue
  // advances either way.
  const speakFallback = useCallback(
    (idx, text) =>
      new Promise((resolve) => {
        const spoken = stripForSpeech(text)
        const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
        if (!synth || !spoken) {
          // No speech at all — animate the bubble for a beat so it isn't dead-silent.
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
          u.onend = () => {
            setSpeakingIdx((cur) => (cur === idx ? null : cur))
            resolve()
          }
          u.onerror = () => {
            setSpeakingIdx((cur) => (cur === idx ? null : cur))
            resolve()
          }
          synth.speak(u)
        } catch {
          setSpeakingIdx((cur) => (cur === idx ? null : cur))
          resolve()
        }
      }),
    [after],
  )

  // Synthesize + play one line; resolve when it ends. `speakingIdx` drives the
  // bubble equalizer off real playback. A generation mismatch (a stop happened
  // while we were fetching/playing) resolves silently.
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
            audio.play().catch(fin) // autoplay blocked → just move on
          })
          .catch(() => {
            // ElevenLabs failed for this line — use the browser voice instead.
            if (gen !== genRef.current) return resolve()
            speakFallback(idx, text).then(resolve)
          })
      }),
    [speakFallback],
  )

  // Play the queue one line at a time.
  const drain = useCallback(async () => {
    if (drainRef.current) return
    drainRef.current = true
    while (queueRef.current.length) {
      const item = queueRef.current.shift()
      await playOne(item.idx, item.text)
    }
    drainRef.current = false
  }, [playOne])

  // Public API (call sites unchanged): interrupt=true (a manual replay) cuts off
  // current speech and plays now; interrupt=false (auto-read) queues.
  const speak = useCallback(
    (idx, text, opts) => {
      if (opts?.interrupt !== false) stopAudio()
      queueRef.current.push({ idx, text })
      drain()
    },
    [stopAudio, drain],
  )

  // Switch Benny's voice mid-chat. Update the ref synchronously so the preview
  // uses the new voice right away, then (if not muted) re-speak his latest line
  // so you can hear the difference on the spot.
  const pickVoice = useCallback(
    (id) => {
      setVoiceId(id)
      voiceRef.current = id
      if (!voiceOn) return
      let idx = -1
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === 'benny') {
          idx = i
          break
        }
      }
      if (idx >= 0) speak(idx, messages[idx].text)
    },
    [voiceOn, messages, speak],
  )

  const sayBenny = useCallback(
    (text, delay = 900, emotion = 'happy') => {
      setTyping(true)
      after(delay, () => {
        setTyping(false)
        setMessages((m) => [...m, { role: 'benny', text, emotion }])
      })
    },
    [after],
  )

  // Two Benny messages back to back (a greeting then a question, a badge
  // callout then the next question). Typing stays up until the last line lands,
  // so the composer can't open in the gap and let the student answer a message
  // Benny hasn't sent yet.
  const sayBennySeq = useCallback(
    (lines) => {
      setTyping(true)
      let at = 0
      lines.forEach((l, i) => {
        at += l.delay
        after(at, () => {
          if (i === lines.length - 1) setTyping(false)
          setMessages((m) => [...m, { role: 'benny', text: l.text, emotion: l.emotion || 'happy' }])
        })
      })
    },
    [after],
  )

  // Reset and (re)start the conversation — used on open and on "Try again".
  const start = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    stopAudio()
    spokenRef.current = -1
    recognitionRef.current?.abort?.()
    recognitionRef.current = null
    simRef.current = false
    setMessages([])
    setTyping(false)
    setGood(0)
    setWeak(0)
    setIntervened(false)
    setFailed(false)
    setDone(false)
    setDraft('')
    setAwarded(false)
    setSpeakingIdx(null)
    setListening(false)
    setTopicId(null)
    setResult(null)
    // Self-started: Benny has no assigned prompt, so he asks what they'd like
    // to talk about and waits for the reader to steer.
    if (selfStart) {
      sayBenny(BENNY_SELF_OPENER, 500, 'excited')
      return
    }
    sayBennySeq([
      { text: BENNY_OPENER(), delay: 500, emotion: 'excited' },
      { text: script[0].q, delay: 1300 },
    ])
  }, [sayBenny, sayBennySeq, script, stopAudio, selfStart])

  // Close the whole experience — dismiss the award modal and the chat together.
  const finish = useCallback(() => {
    setAwarded(false)
    onClose?.()
  }, [onClose])

  // Kick off / reset the conversation each time the modal opens.
  useEffect(() => {
    if (!open) return
    start()
    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
      stopAudio()
      recognitionRef.current?.abort?.()
      recognitionRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Autoscroll to the newest message.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  // When TTS is on, read each new Benny message aloud as it arrives. Guarded by
  // index so a re-render (or React's dev double-invoke) can't read it twice.
  useEffect(() => {
    if (!voiceOn) return
    const idx = messages.length - 1
    if (idx < 0 || messages[idx].role !== 'benny') return
    if (spokenRef.current === idx) return
    spokenRef.current = idx
    speak(idx, messages[idx].text, { interrupt: false })
  }, [messages, voiceOn, speak])

  // Self-started talks have no assigned prompt — the reader picks the starter
  // (or types their own opening line) and Benny runs that question script.
  function pickTopic(label, id) {
    const topic = id ?? randomTopicId()
    const s = deriveScript(topic)
    const chosen = SELF_TOPICS.find((t) => t.id === topic)?.label || label
    setTopicId(topic)
    setMessages((m) => [...m, { role: 'student', text: label }])
    sayBennySeq([
      { text: BENNY_SELF_ACK(chosen), delay: 900, emotion: 'excited' },
      { text: s[0].q, delay: 1400 },
    ])
  }

  // A self-started talk is the reader's, so they can step out of it early —
  // before Benny has enough for the conversation to count.
  function wrapUp() {
    if (done || typing) return
    stopAudio()
    setDone(true)
    sayBenny(BENNY_SELF_CLOSER, 1000, 'laughing')
    after(2700, () => onClose?.())
  }

  function send(text) {
    const value = (text ?? draft).trim()
    if (!value || done || failed || typing) return
    // The student answered — stop whatever Benny was reading so his next line
    // speaks cleanly (turn-taking) rather than queueing behind stale audio.
    stopAudio()
    setDraft('')
    // The first thing a reader says in a self-started talk is the topic.
    if (selfStart && !topicId) {
      pickTopic(value, null)
      return
    }
    const weakAnswer = isWeakAnswer(value)
    setMessages((m) => [...m, { role: 'student', text: value }])

    if (weakAnswer) {
      // Low-effort answer — doesn't count toward the badge. Benny nudges, gives
      // a heads-up once a couple pile up, then ends the chat if it stays rough.
      const nextWeak = weak + 1
      setWeak(nextWeak)
      if (nextWeak >= FAIL_AFTER) {
        setFailed(true)
        sayBenny(BENNY_FAIL, 1200, 'sad')
      } else if (nextWeak >= INTERVENE_AFTER && !intervened) {
        setIntervened(true)
        sayBenny(BENNY_INTERVENTION, 1200, 'sad')
      } else {
        sayBenny(BENNY_NUDGES[(nextWeak - 1) % BENNY_NUDGES.length], 1000, 'thinking')
      }
      return
    }

    const nextGood = good + 1
    setGood(nextGood)
    const nextQ = () => script[Math.min(nextGood, script.length - 1)].q

    if (nextGood >= need) {
      // The conversation counts → close it out, then pop the celebration once
      // Benny's closing message has had a beat to land. The parent decides what
      // this one talk earned and hands it back.
      setDone(true)
      sayBenny(selfStart ? BENNY_SELF_CLOSER : BENNY_CLOSER, 1100, 'laughing')
      after(2600, () => {
        setResult(onComplete?.() ?? { badges: [] })
        setAwarded(true)
      })
    } else {
      // Ask the next derived question (fall back to the last one if we run out).
      sayBenny(nextQ(), 1100, 'happy')
    }
  }

  // Suggestions for the current question (the one Benny just asked), plus a
  // dimmed low-effort chip so the off-track path is always reachable.
  const activeStep = script[Math.min(good, script.length - 1)]
  const lowChip = LOW_EFFORT_SUGGESTIONS[(good + weak) % LOW_EFFORT_SUGGESTIONS.length]
  const showSuggestions =
    !typing && !done && !failed && !listening && messages.at(-1)?.role === 'benny'
  // Self-started: before a topic is chosen the chips ARE the topic picker.
  const pickingTopic = selfStart && !topicId
  // What the finished conversation earned (empty = it counted, but no badge
  // tipped over yet — the note says where the reader stands instead).
  const prizes = result?.badges ?? []
  const accent = prizes[0]?.color || badge.color

  // The header avatar mirrors Benny's live mood: thinking while he composes,
  // otherwise the expression of his most recent message.
  const lastBenny = messages.length ? [...messages].reverse().find((m) => m.role === 'benny') : null
  const headMood = typing ? 'thinking' : lastBenny?.emotion || 'happy'

  // Voice-to-text — the transcript types straight into the composer input
  // (no separate view); the mic is a toggle. Real speech recognition when the
  // browser has it, else a simulated stream so it still demos.
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
    const phrase = activeStep?.suggestions?.[0] || 'I really enjoyed reading it.'
    const words = phrase.split(' ')
    words.forEach((_, i) =>
      after(300 * (i + 1), () => {
        if (simRef.current) setDraft(words.slice(0, i + 1).join(' '))
      }),
    )
    // Auto-stop once the (simulated) sentence is out.
    after(300 * (words.length + 2), () => {
      if (simRef.current) stopListening()
    })
  }
  function startListening() {
    if (typing || done || failed) return
    // Stop Benny reading aloud so his TTS doesn't bleed into the mic.
    stopAudio()
    setDraft('')
    const SR =
      typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
    if (!SR) {
      simListen()
      return
    }
    let rec
    try {
      rec = new SR()
    } catch {
      simListen()
      return
    }
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.continuous = true
    recognitionRef.current = rec
    setListening(true)
    rec.onresult = (e) => {
      let text = ''
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript
      setDraft(text.trim()) // auto-type into the input
    }
    rec.onerror = () => {
      recognitionRef.current = null
      // No mic / permission denied → simulate so the mic still does something.
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

  return (
    <>
      <Modal open={open} onClose={onClose} variant="center" ariaLabel="Talk to Benny">
        <div className="bt-chat">
          {/* Header */}
          <div className="bt-chat-head">
            <div className="bt-chat-head-benny">
              <img src={faceFor(headMood)} alt="" className="bt-chat-head-avatar" />
              <div className="bt-chat-head-title">
                {selfStart ? 'Talking with Benny' : 'Book Talk with Benny'}
              </div>
            </div>
            <div className="bt-chat-head-right">
              {hasVoiceKey() && (
                <select
                  className="bt-chat-voice"
                  value={voiceId}
                  onChange={(e) => pickVoice(e.target.value)}
                  title="Change Benny's voice"
                  aria-label="Benny's voice"
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
                title={voiceOn ? 'Benny reads answers aloud — tap to mute' : 'Tap to hear Benny'}
                aria-label="Toggle read aloud"
              >
                <Icon name={voiceOn ? 'volume' : 'volume-off'} size={15} />
              </button>
              <button className="bt-chat-close" onClick={onClose} aria-label="Close">
                <Icon name="x" size={16} stroke={2.2} />
              </button>
            </div>
          </div>

          {/* Transcript */}
          <div className="bt-chat-scroll" ref={scrollRef}>
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

          {/* Composer (hidden once the chat is complete — the award modal takes over) */}
          {!done && (
            <div className="bt-chat-foot">
              {showSuggestions && (
                <div className="bt-chat-suggestions">
                  {pickingTopic ? (
                    <>
                      {SELF_TOPICS.map((t) => (
                        <button
                          key={t.id}
                          className="bt-chip"
                          onClick={() => pickTopic(t.label, t.id)}
                        >
                          {t.label}
                        </button>
                      ))}
                      <button
                        className="bt-chip bt-chip--surprise"
                        onClick={() => pickTopic(SURPRISE_TOPIC, null)}
                      >
                        <Icon name="sparkles" size={13} />
                        {SURPRISE_TOPIC}
                      </button>
                    </>
                  ) : (
                    <>
                      {activeStep.suggestions.map((s) => (
                        <button key={s} className="bt-chip" onClick={() => send(s)}>
                          {s}
                        </button>
                      ))}
                      <button className="bt-chip bt-chip--weak" onClick={() => send(lowChip)}>
                        {lowChip}
                      </button>
                    </>
                  )}
                </div>
              )}
              {failed ? (
                <button className="bt-chat-retry-btn" onClick={start} disabled={typing}>
                  <Icon name="refresh" size={16} stroke={2.2} />
                  Try again
                </button>
              ) : (
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
                    style={{ background: badge.color }}
                  >
                    <Icon name="send" size={16} color="#fff" />
                  </button>
                </form>
              )}
              {/* Nobody assigned this talk, so the reader decides when it ends. */}
              {selfStart && !!topicId && !failed && (
                <button className="bt-chat-wrap" onClick={wrapUp} disabled={typing}>
                  That’s all for now
                </button>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Celebration — pops over the finished chat. */}
      <Modal open={awarded} onClose={finish} variant="center" ariaLabel="Badge earned">
        <div className={`bt-award-modal${prizes.length > 1 ? ' is-multi' : ''}`}>
          <button className="bt-award-modal-close" onClick={finish} aria-label="Close">
            <Icon name="x" size={16} stroke={2.2} />
          </button>
          <div className="bt-award-pops">
            {(prizes.length ? prizes : [{ img: faceFor('laughing') }]).map((p, i) => (
              <div
                key={i}
                className="bt-award-pop"
                style={p.img ? undefined : { background: p.color || accent }}
              >
                {p.img ? <img src={p.img} alt="" /> : <Icon name="award" size={36} color="#fff" />}
                {i === 0 && (
                  <>
                    <span className="bt-award-spark bt-award-spark--1">
                      <Icon name="sparkles" size={16} color={accent} />
                    </span>
                    <span className="bt-award-spark bt-award-spark--2">
                      <Icon name="star-filled" size={12} color="#F59E0B" />
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="bt-award-title">
            {prizes.length > 1
              ? `${prizes.length} badges earned!`
              : prizes.length
                ? 'Badge earned!'
                : 'Book Talk complete!'}
          </div>
          {!!prizes.length && (
            <div className="bt-award-name">{prizes.map((p) => p.name).join(' · ')}</div>
          )}
          {!!result?.note && <div className="bt-award-note">{result.note}</div>}
          <button className="bt-award-modal-btn" onClick={finish} style={{ background: accent }}>
            Awesome!
          </button>
        </div>
      </Modal>
    </>
  )
}
