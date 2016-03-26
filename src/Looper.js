
import Sampler from './Sampler'
import Envelope from './Envelope'

const defaultOptions = {
  // bpm: 120,
  length: 16,
  start: 0,
  end: 16,
  loop: 16
}

class Looper extends Sampler {
  constructor ({ subscribe, context, clock, getState }, options = {}) {
    super(context, { url: options.url })
    const {
      bpm,
      length,
      start,
      loop
    } = Object.assign({}, defaultOptions, options)

    this.clock = clock
    this.getState = getState
    this.active = true

    // Sample properties
    this.bpm = bpm
    this.length = length
    this.start = start
    this.loop = true //loop
    this.loopLength = loop

    this.clock.sync(this.shouldPlay.bind(this))

    this._previousTempo = getState().tempo

    subscribe (({ tempo, playing }) => {

      if (this.playing && this._previousTempo !== tempo) {
        console.log('change tempo: ', this._previousTempo, tempo)

        const { currentTime } = this.clock
        const { duration } = this.buffer.audio
        const pitchDiff = tempo / this._previousTempo
        console.log('pitch diff', pitchDiff)

        this.playing.playbackRate.value = this.pitch

        this._previousTempo = tempo
      }

      if (!playing && this.playing) {
        this.playing.stop(0)
        this.playing = false
      }
    })

    // Bind methods
    this.play = this.play.bind(this)
  }

  // Not accurately being calculated
  // get bpm () {
  //   if (!this._bpm) {
  //     // Need to factor in resolution + time signature
  //     console.log(this.duration)
  //     console.log(this.buffer.audio.duration, this.length / this.duration * 60 / 4)
  //     this._bpm = this.length / this.buffer.audio.duration * 60 / 4
  //   }
  //   console.log(this._bpm)
  //   return this._bpm
  // }

  get tempo () {
    const { tempo } = this.getState()
    return tempo
  }

  get pitch () {
    const { bpm, tempo } = this
    return tempo / bpm
  }

  set pitch (val) {
  }

  get duration () {
    return this.buffer.audio.duration
  }

  set duration (val) {
  }

  shouldPlay ({ when, step }) {
    const { active, start, end, loopLength } = this
    const should = start === step % loopLength

    if (active && should) {
      console.log('shouldPlay', step, when)
      this.playing ? this.playing.stop(0) : false
      this.play({ when })
    }
  }

}

export default Looper

