
import Clip from './Clip'
import Buffer from './Buffer'


class Sampler extends Buffer {
  constructor (context) {
    super(context)
    this.duration = .5
    this.clip = new Clip()
    this.output = this.context.destination
    this.clip.connect(this)
    this.pattern = this.clip.pattern
    this.toggle = this.clip.toggle
    this.play = this.play.bind(this)
  }

  play (when) {
    console.log('trigger', when, this.duration)
    const source = this.context.createBufferSource()
    source.connect(this.output)
    source.buffer = this.buffer
    source.start(when)
    source.stop(when + this.context.currentTime + this.duration)
  }
}

export default Sampler

