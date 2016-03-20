
class Beep {
  constructor (context = {}) {
    this.context = context
    this.duration = .0625
    this.frequency = 256
    this.output = this.context.destination
    this.connect = this.connect.bind(this)
    this.play = this.play.bind(this)
  }

  connect (node) {
    this.output = node
  }

  play (when) {
    const osc = this.context.createOscillator()
    osc.type = 0
    osc.frequency.value = this.frequency
    osc.connect(this.output)
    osc.start(when)
    osc.stop(when + this.duration)
  }
}

export default Beep

