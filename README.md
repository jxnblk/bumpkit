
# Bumpkit

A DAW-inpsired library for the Web Audio API

---

- [x] Bumpkit
- [x] Beep
- [x] Gain
- [x] Envelope
  - defaults to edge fader
  - Envelope.options = { when, duration, fade }
  - Envelope.curve = [ { value: 0, when: 0 } ]
- [x] Buffer
  - .audio (audio buffer)
  - .load(url)
  - .decode(data)
- [ ] Sampler
  - props
    - url
    - duration
- [ ] Clip
- [ ] Track
  - Combines instrument and clip
  - Bumpkit createTrack method

MIT License
