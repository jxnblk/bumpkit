
class Clock {
  constructor (store) {
    this.context = store.context
    this.nextTime = 0
    this.lookahead = 25

    // Bind methods
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.scheduler = this.scheduler.bind(this)
    this.nextStep = this.nextStep.bind(this)
    this.tick = this.tick.bind(this)
    this.sync = this.sync.bind(this)

    // Follow parent Store
    this.setState = store.setState
    this.getState = store.getState

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
    // To do: handle different resolutions and time signatures
    return 60 / tempo / 4
  }

  get currentTime () {
    return this.context.currentTime
  }

  start () {
    this.nextTime = this.currentTime
    this.scheduler()
  }

  stop () {
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
    this.setState({ step, when })
    this.listener({ step, when })

    // Debug check for dupes
    if (this.lastStep === step) {
      console.log('DUPE')
    }
    this.lastStep = step
  }

  sync (listener) {
    if (this.listener) {
      console.log('Already listening to clock', this.listener)
    }
    this.listener = listener
  }
}

export default Clock

