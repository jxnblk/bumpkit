
import Buffer from './Buffer'
import Envelope from './Envelope'

class Sampler {
  constructor (context, { url, pitch, output } = {}) {
    this.context = context
    this.duration = .5
    this.output = output || this.context.destination
    this.pitch = pitch || 1

    this.buffer = new Buffer(context)
    this.decode = this.buffer.decode.bind(this)
    this.load = this.buffer.load.bind(this)

    if (url) {
      this.buffer.load(url)
        .then((audio) => {
          this.duration = audio.duration
          console.log('Buffer loaded', audio)
        })
    }

    this.play = this.play.bind(this)
  }

  play ({ when }) {
    const { duration } = this
    const source = this.context.createBufferSource()
    const envelope = new Envelope(this.context, { when, duration })

    envelope.connect(this.output)
    source.connect(envelope.node)
    source.buffer = this.buffer.audio
    source.playbackRate.value = this.pitch

    source.start(when)
    source.stop(when + this.duration)
  }
}

export default Sampler

