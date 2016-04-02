
import log from 'loglevel'

class Gain {
  constructor (context) {
    log.info('Gain', context)
    this.context = context
    this.node = this.context.createGain()

    // Bind methods
    this.connect = this.connect.bind(this)

    // Init
    this.connect(this.context.destination)
  }

  get gain () {
    log.debug('Gain get gain')
    return this.node.gain
  }

  get level () {
    log.debug('Gain get level')
    return this.node.gain.value
  }

  set level (val) {
    log.debug('Gain set level', val)
    this.node.gain.value = val
  }

  connect (node) {
    log.debug('Gain.connect(node)', node)
    this.node.connect(node)
  }
}

export default Gain

