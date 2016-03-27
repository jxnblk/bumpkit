
import log from 'loglevel'
import Gain from './Gain'

class Envelope extends Gain {
  constructor (context, options = {}) {
    super(context)
    log.info('Envelope', context, options)

    this.options = Object.assign({
      when: 0,
      duration: 0,
      fade: 0.005
    }, options)

    // Default edge fade
    const { duration, fade } = this.options
    this.curve = [
      { value: 0, when: 0 },
      { value: 1, when: fade },
      { value: 1, when: duration - fade },
      { value: 0, when: duration }
    ]
  }

  get options () {
    log.debug('Envelope get options')
    return this._options
  }

  set options (options = {}) {
    log.debug('Envelope set options', options)
    const { currentTime } = this.context
    this._options = Object.assign({}, this._options, options)
  }

  get curve () {
    log.debug('Envelope get curve')
    return this._curve
  }

  set curve (points = []) {
    log.debug('Envelope set curve', points)
    const { when } = this.options

    points.forEach((p) => {
      this.gain.linearRampToValueAtTime(p.value, when + p.when)
    })
    this._curve = points
  }
}

export default Envelope

