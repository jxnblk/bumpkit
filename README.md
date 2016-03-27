
# Bumpkit

A sampler sequencer library for the Web Audio API

---

- [x] Store
- [x] Bumpkit
- [x] Clock
- [x] Beep
- [x] Gain
- [x] Envelope
- [x] Buffer
- [x] Sampler
- [x] Looper extends Sampler
- [x] Clip

- Tests
  - [ ] Store
  - [ ] SubStore
  - [ ] Bumpkit
  - [ ]

- [ ] Bumpkit convenience methods
- [ ] Looper pause handling

---

Bumpkit (options) extends Store - state machine
  - tick()
  - sync()
  - play()
  - pause()
  - playPause()
  - stop()
  - kill()
  - createClip()
Clock (bumpkit) - coupled with Bumpkit (tempo, step, loop)
  - start()
  - stop()
  - scheduler()
  - nextStep()
  - tick() setState { step, when }
  - sync(listener)
Clip (instrument, pattern)
  - play({ when, step })
  - toggle()
Buffer (context)
Gain (context)
  - connect()
Envelope (context, options) extends Gain
Looper (bumpkit, options)
  - shouldPlay()
Beep (context)
  - play({ when })
Sampler (context, options)
  - play({ when })

---

MIT License
