
class Clip {
  constructor (pattern = []) {
    this.output = null
    this.pattern = pattern
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
      this.output.play(when)
    }
  }

  toggle () {
    this.active = !this.active
  }
}

export default Clip
