
import Clip from './Clip'
import Buffer from './Buffer'

class Sampler extends Clip {
  constructor (context) {
    super()
    this.context = context
    this.duration = .5
    this.output = this.context.destination

    this.buffer = new Buffer(context)
    this.sample = this.buffer.sample
    this.decode = this.buffer.decode.bind(this)
    this.load = this.buffer.load.bind(this)
  }

  player ({ when }) {
    const source = this.context.createBufferSource()
    source.connect(this.output)
    source.buffer = this.buffer.sample
    source.start(when)
    source.stop(when + this.context.currentTime + this.duration)
  }
}

export default Sampler

