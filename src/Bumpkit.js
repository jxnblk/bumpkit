
import Store from './Store'
import Clock from './Clock'
import Clip from './Clip'

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
    this.clips = []
    this.setState({
      playing: false,
      tempo,
      resolution,
      signature
    })
    this.clock = new Clock(this.state, this.context)
    this.subscribe(this.clock.setState)
    this.clock.sync(this.tick.bind(this))

    this.tick = this.tick.bind(this)
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.playPause = this.playPause.bind(this)
    this.stop = this.stop.bind(this)
    this.kill = this.kill.bind(this)
    this.createClip = this.createClip.bind(this)
  }

  tick ({ step, when }) {
    // console.log('Bumpkit', step, when)
    // console.log(this.clips)
    this.clips.forEach((clip) => {
      clip.play({ step, when })
    })
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

  createClip (pattern = []) {
    const clip = new Clip()
    clip.pattern = pattern
    this.clips.push(clip)
    return clip
  }
}

export default Bumpkit

// ---- ---- ---- ----
// - trigger ()
// - buffers {}
// - Buffers
//   - loadBuffers

