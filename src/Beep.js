
import Clip from './Clip'

class Beep extends Clip {
  constructor (context = {}) {
    super()
    this.context = context
    this.duration = .0625
    this.frequency = 256
    this.output = this.context.destination
    this.player = this.player.bind(this)
  }


  player ({ when }) {
    const osc = this.context.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = this.frequency
    osc.connect(this.output)
    osc.start(when)
    osc.stop(when + this.duration)
  }
}

export default Beep

