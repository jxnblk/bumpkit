
import Store from './Store'
import Clock from './Clock'

/** Bumpkit
*/

const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext

class Bumpkit extends Store {
  constructor ({
    tempo = 120,
    resolution = 16,
    signature = 4/4
  } = {}) {
    super()
    this.context = new AudioContext()
    this.timer = null
    this.setState({
      playing: false,
      tempo,
      resolution,
      signature
    })
    this.clock = new Clock(this.state, this.context)
    this.subscribe(this.clock.setState)
    this.clock.sync(this.step)
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.playPause = this.playPause.bind(this)
    this.stop = this.stop.bind(this)
    this.kill = this.kill.bind(this)
  }

  step ({ step, when }) {
    // console.log('Bumpkit', step, when)
  }

  play () {
    this.setState({ playing: true })
    this.clock.scheduler()
  }

  pause () {
    this.setState({ playing: false })
  }

  playPause () {
    const { playing } = this.state
    if (playing) {
      this.pause()
    } else {
      this.play()
    }
  }

  stop () {
    this.setState({ playing: false })
    this.clock.setState({ step: 0 })
  }

  kill () {
    delete this.context
  }
}

export default Bumpkit

// ---- ---- ---- ----
// - trigger ()
// - buffers {}
// - Buffers
//   - loadBuffers

