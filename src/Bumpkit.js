
import log from 'loglevel'
import Store from './Store'
import Clip from './Clip'

const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext

/** Bumpkit */
class Bumpkit extends Store {
  constructor ({
    tempo = 120,
    resolution = 16,
    loop
  } = {}) {
    super()
    log.info('Bumpkit', { tempo, resolution, loop })

    this.context = new AudioContext()

    // Clock
    this.nextTime = 0
    this.lookahead = 25
    this.followers = []

    this.setState({
      playing: false,
      step: 0,
      tempo,
      loop,
      resolution
    })

    // Bind methods
    // Clock methods
    this.startClock = this.startClock.bind(this)
    this.stopClock = this.stopClock.bind(this)
    this.scheduler = this.scheduler.bind(this)
    this.nextStep = this.nextStep.bind(this)
    this.tick = this.tick.bind(this)

    // Transport methods
    this.sync = this.sync.bind(this)
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.playPause = this.playPause.bind(this)
    this.stop = this.stop.bind(this)
    this.kill = this.kill.bind(this)

    // Convenience methods
    this.createClip = this.createClip.bind(this)

    // Start web audio clock
    let dummy = this.context.createBufferSource()
    dummy = null
  }

  get scheduleAheadTime () {
    // milliseconds to seconds divided by 4 steps per beat
    return this.lookahead / 250
  }

  get stepDuration () {
    const { tempo } = this.getState()
    const dur = 60 / tempo / 4
    // To do: handle different resolutions and time signatures
    return dur
  }

  get currentTime () {
    return this.context.currentTime
  }

  // Human readable position - bar.beat.step
  get position () {
    const { step } = this.getState()
    // To do: handle time signatures/resolutions
    const bar = Math.floor(step / 16) + 1
    const beat = Math.floor(step % 16 / 4) + 1
    const s = step % 4 + 1
    return `${bar}.${beat}.${s}`
  }

  // Clock
  startClock () {
    this.nextTime = this.currentTime
    this.scheduler()
  }

  stopClock () {
    clearTimeout(this.timer)
  }

  scheduler () {
    while (this.nextTime < this.currentTime + this.scheduleAheadTime ) {
      const { step } = this.getState()
      const when = this.nextTime
      this.tick({ step, when })
      this.nextStep()
    }
    this.timer = setTimeout(this.scheduler, this.lookahead)
  }

  nextStep () {
    let { step, loop } = this.getState()
    this.nextTime += this.stepDuration
    step++
    if (loop && step >= loop) {
      step = 0
    }
    this.setState({ step })
  }

  tick ({ step, when }) {
    log.info('Bumpkit.tick()', { step, when })
    this.setState({ step, when })
    this.followers.forEach((follower) => {
      follower({ step, when })
    })
  }

  sync (follower) {
    log.debug('Bumpkit.sync()', follower)
    // Follow tick only
    this.followers.push(follower)
  }

  play () {
    log.debug('Bumpkit.play()')
    this.setState({ playing: true })
    this.startClock()
  }

  pause () {
    log.debug('Bumpkit.pause()')
    this.setState({ playing: false })
    this.stop()
  }

  playPause () {
    log.debug('Bumpkit.playPause()')
    const { playing } = this.getState()
    if (playing) {
      this.pause()
    } else {
      this.play()
    }
  }

  stop () {
    log.debug('Bumpkit.stop()')
    this.stopClock()
    this.setState({ playing: false })
    this.setState({ step: 0 })
  }

  kill () {
    log.debug('Bumpkit.kill()')
    this.stop()
    this.context.close()
    delete this.context
  }

  createClip (Inst, opts = {}) {
    log.debug('Bumpkit.createClip()', Inst, opts)
    const instrument = new Inst(this.context, opts)
    const clip = new Clip(instrument)
    this.sync(clip.play)

    return clip
  }
}

export default Bumpkit

