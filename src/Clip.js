
class Clip {
  constructor () {
    this.output = null
    this.pattern = []
    this.active = true
    this.connect = this.connect.bind(this)
    this.play = this.play.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  connect (node) {
    this.output = node
  }

  play ({ when, step }) {
    if (this.active && this.pattern[step]) {
      console.log('Clip play', this.pattern, when, step, this.active)
      this.output.play(when)
    }
  }

  toggle () {
    this.active = !this.active
  }
}

export default Clip
