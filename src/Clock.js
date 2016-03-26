
import assign from 'object-assign'
import Store from './Store'

const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext

class Clock extends Store {
  constructor (state, context = new AudioContext) {
    super(state)
    this.context = context
    this.callbacks = []
    this.lookahead = 25
    this.scheduleAhead = this.lookahead / 1000 * 4 // 0.1
    this.nextTime = 0
    this.timer = null
    this.setState(assign({
      tempo: 120,
      step: 1
    }, state))
    this.scheduler = this.scheduler.bind(this)
    this.start = this.start.bind(this)
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
      clearTimeout(this.timer)
      return false
    }

    while (this.nextTime < this.currentTime + this.scheduleAhead) {
      this.tick({ step, when: this.nextTime })
      this.setState({ step: step + 1 })
      this.nextTime += this.stepDuration
      if (loop && step >= loop) {
        this.setState({ step: 1 })
      }
    }
    this.timer = setTimeout(this.scheduler, this.lookahead)
  }

  start () {
    this.nextTime = this.currentTime
    this.scheduler()
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

