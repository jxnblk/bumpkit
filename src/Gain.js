
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

  connect (node) {
    console.log('Gain connect', this.node, this.node.connect)
    this.node.connect(node)
  }
}

export default Gain

