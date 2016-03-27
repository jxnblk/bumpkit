
import log from 'loglevel'
import Buffer from './Buffer'

class Sampler {
  constructor (context, { url, pitch, output } = {}) {
    log.info('Sampler', context, { url, pitch, output })
    this.context = context
    this.duration = .5
    this.output = output || this.context.destination
    this.pitch = pitch || 1
    this.loop = false
    this.playing = false

    this.buffer = new Buffer(context)
    this.decode = this.buffer.decode.bind(this)
    this.load = this.buffer.load.bind(this)

    if (url) {
      this.buffer.load(url)
        .then((audio) => {
          log.info(`Buffer.load(${url}) response`, audio)
          this.duration = audio.duration
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
    log.debug('Sampler.play()', { when })
    const { duration } = this
    const source = this.context.createBufferSource()

    source.connect(this.output)
    source.buffer = this.buffer.audio
    source.playbackRate.value = this.pitch
    source.loop = !!this.loop

    source.start(when)
    if (!this.loop) {
      source.stop(when + this.duration)
    }

    // Monophonic
    this.playing && this.playing.stop(when)
    this.playing = source
  }
}

export default Sampler

