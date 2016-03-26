
class Gain {
  constructor (context) {
    this.context = context
    this.node = this.context.createGain()

    // Bind methods
    this.connect = this.connect.bind(this)

    // Init
    this.connect(this.context.destination)
  }

  get gain () {
    return this.node.gain
  }

  get level () {
    return this.node.gain.value
  }

  set level (val) {
    this.node.gain.value = val
  }

  connect (node) {
    this.node.connect(node)
  }
}

export default Gain

