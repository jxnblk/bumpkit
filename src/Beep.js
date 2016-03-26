
// import Clip from './Clip'
import Envelope from './Envelope'

class Beep {
  constructor (context = {}) {
    this.context = context
    this.duration = .0625
    this.frequency = 256
    this.output = this.context.destination
    this.play = this.play.bind(this)
  }

  play ({ when }) {
    const { duration } = this
    const osc = this.context.createOscillator()
    const envelope = new Envelope(this.context, { when, duration })

    envelope.connect(this.output)
    osc.type = 'sine'
    osc.frequency.value = this.frequency
    osc.connect(envelope.node)

    osc.start(when)
    osc.stop(when + this.duration)
  }
}

export default Beep

