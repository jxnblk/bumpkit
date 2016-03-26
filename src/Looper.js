
import Sampler from './Sampler'
import Envelope from './Envelope'

const defaultOptions = {
  bpm: 120,
  length: 16,
  start: 0,
  end: 16,
  loop: 16
}

class Looper extends Sampler {
  constructor ({ context, clock, getState }, options = {}) {
    super(context, { url: options.url })
    const {
      bpm,
      length,
      start,
      end,
      loop
    } = Object.assign({}, defaultOptions, options)

    this.clock = clock
    this.getState = getState
    this.active = true

    // Sample properties
    this.bpm = bpm
    this.length = length
    this.start = start
    this.end = end
    this.loop = loop

    this.clock.sync(this.shouldPlay.bind(this))

    // Bind methods
    this.play = this.play.bind(this)
  }

  get tempo () {
    const { tempo } = this.getState()
    return tempo
  }

  get pitch () {
    const { bpm, tempo } = this
    console.log('get pitch', tempo / bpm)
    return tempo / bpm
  }

  set pitch (val) {
    console.log('set pitch', val)
  }

  get duration () {
    const { start, end } = this
    const { stepDuration } = this.clock
    console.log('get duration', (end - start) * stepDuration)

    return (end - start) * stepDuration
  }

  set duration (val) {
    console.log('set duration', val)
  }

  shouldPlay ({ when, step }) {
    const { active, start, end, loop } = this
    const should = start === step % loop

    if (active && should) {
      console.log('shouldPlay', this.pitch)
      this.play({ when })
    }
  }

}

export default Looper

