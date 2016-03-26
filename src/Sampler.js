
import Clip from './Clip'
import Buffer from './Buffer'
import Envelope from './Envelope'

class Sampler extends Clip {
  constructor (context, { url } = {}) {
    super()
    this.context = context
    this.duration = .5
    this.output = this.context.destination

    this.buffer = new Buffer(context)
    this.decode = this.buffer.decode.bind(this)
    this.load = this.buffer.load.bind(this)

    if (url) {
      this.buffer.load(url)
    }
  }

  player ({ when }) {
    const { duration } = this
    const source = this.context.createBufferSource()
    const envelope = new Envelope(this.context, { when, duration })

    envelope.connect(this.output)
    source.connect(envelope.node)
    source.buffer = this.buffer.audio

    source.start(when)
    source.stop(when + this.duration)
  }
}

export default Sampler

