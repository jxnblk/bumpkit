
import Sampler from './Sampler'
import Envelope from './Envelope'

class Looper extends Sampler {
  constructor ({
    subscribe,
    context,
    sync,
    getState
  }, {
    bpm = 120,
    start = 0,
    loop = 16,
    url
  } = {}) {
    super(context, { url })

    this.getState = getState
    this.active = true
    this._previousTempo = getState().tempo

    // Sample properties
    this.bpm = bpm
    this.start = start
    this.loop = loop

    sync(this.shouldPlay.bind(this))
    subscribe(this.handleTempoChange.bind(this))

    // Bind methods
    this.play = this.play.bind(this)
  }

  handleTempoChange ({ tempo, playing }) {
    if (this.playing && this._previousTempo !== tempo) {
      this.playing.playbackRate.value = this.pitch
      this._previousTempo = tempo
    }

    if (!playing && this.playing) {
      this.playing.stop(0)
      this.playing = false
    }
  }

  get tempo () {
    const { tempo } = this.getState()
    return tempo
  }

  get pitch () {
    const { bpm, tempo } = this
    return tempo / bpm
  }

  set pitch (val) {
    this._pitch = val
  }

  get duration () {
    return this.buffer.audio.duration
  }

  set duration (val) {
    this._duration = val
  }

  shouldPlay ({ when, step }) {
    const { active, start, loop } = this
    const should = start === step % loop

    if (active && should) {
      this.playing ? this.playing.stop(0) : false
      this.play({ when })
    }
  }

}

export default Looper

