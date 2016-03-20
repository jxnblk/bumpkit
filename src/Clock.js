
import assign from 'object-assign'
import Store from './Store'

const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext

class Clock extends Store {
  constructor (state, context = new AudioContext) {
    super(state)
    this.context = context
    this.callbacks = []
    this.scheduleAheadTime = .1
    this.lookahead = 25
    this.nextTime = 0
    this.timer = null
    this.setState(assign({
      tempo: 120,
      step: 0
    }, state))
    this.scheduler = this.scheduler.bind(this)
    this.tick = this.tick.bind(this)
    this.sync = this.sync.bind(this)
    this.unsync = this.unsync.bind(this)
  }

  get stepDuration () {
    // To do: figure out signature and resolution math
    return 60 / this.state.tempo / 4
  }

  get currentTime () {
    if (!this.context.currentTime) {
      // Start the clock
      const dummy = this.context.createBufferSource()
    }
    return this.context.currentTime
  }

  scheduler () {
    const { playing, step, loop } = this.state

    if (!playing) {
      window.clearTimeout(this.timer)
      return false
    }
    this.nextTime = this.currentTime

    while (this.nextTime < this.currentTime + this.scheduleAheadTime) {
      this.tick({ step, when: this.nextTime })
      this.nextTime += this.stepDuration
      this.setState({ step: step + 1 })
      if (loop && step === loop) {
        this.setState({ step: 0 })
      }
      this.timer = setTimeout(scheduler, this.lookahead)
    }
  }

  tick ({ step, when }) {
    this.callbacks.forEach((callback) => {
      callback({ step, when })
    })
  }

  sync (callback) {
    if (typeof callback !== 'function') {
      return false
    }
    this.callbacks.push(callback)
  }

  unsync (callback) {
    const i = this.callbacks.indexOf(callback)
    if (i > -1) {
      this.callbacks.splice(i, 1)
    }
  }
}

export default Clock

