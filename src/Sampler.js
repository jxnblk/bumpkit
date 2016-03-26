
import Buffer from './Buffer'
import Envelope from './Envelope'

class Sampler {
  constructor (context, { url, pitch, output } = {}) {
    this.context = context
    this.duration = .5
    this.output = output || this.context.destination
    this.pitch = pitch || 1
    this.loop = false

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

  get url () {
    return this.buffer.url
  }

  get playing () {
    return this._playing || false
  }

  set playing (source) {
    this._playing = source
  }

  play ({ when }) {
    const { duration } = this
    const source = this.context.createBufferSource()
    source.envelope = new Envelope(this.context, { when, duration })

    if (this.playing) {
      this.playing.stop(when)
    }

    source.envelope.connect(this.output)
    // source.connect(source.envelope.node)
    source.connect(this.output)
    source.buffer = this.buffer.audio
    source.playbackRate.value = this.pitch
    source.loop = this.loop
    // source.loopEnd = when + (this.buffer.audio.duration * this.pitch)

    source.start(when)
    if (!this.loop) {
      source.stop(when + this.duration)
    }
    this.playing = source
  }
}

export default Sampler

