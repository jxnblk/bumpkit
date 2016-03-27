
import Envelope from './Envelope'
import Gain from './Gain'

class Beep {
  constructor (context = {}) {
    this.context = context
    this.duration = .0625
    this.frequency = 256
    this.volume = .75
    this.output = this.context.destination
    this.play = this.play.bind(this)
  }

  play ({ when }) {
    const { duration } = this
    const osc = this.context.createOscillator()
    const envelope = new Envelope(this.context, { when, duration })
    const gain = new Gain(this.context)

    gain.level = this.volume
    osc.type = 'sine'
    osc.frequency.value = this.frequency
    osc.connect(gain.node)
    gain.connect(envelope.node)
    envelope.connect(this.output)

    osc.start(when)
    osc.stop(when + this.duration)
  }
}

export default Beep

