
import log from 'loglevel'

class Clip {
  constructor (instrument, pattern = []) {
    log.info('Clip', instrument, pattern)
    this.instrument = instrument
    this.pattern = pattern

    this.active = true

    this.play = this.play.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  play ({ step, when }) {
    log.debug('Clip.play()', { step, when })
    const { instrument, active, pattern } = this

    if (instrument && active && pattern[step - 1]) {
      log.debug('Clip.play() should play', step)
      instrument.play({ when })
    }
  }

  toggle () {
    log.info('Clip.toggle()')
    this.active = !this.active
  }
}

export default Clip
