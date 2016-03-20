
class Clip {
  constructor (pattern = []) {
    this.output = null
    this.pattern = pattern
    this.active = true
    this.play = this.play.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  play ({ when, step }) {
    if (this.active && this.pattern[step]) {
      this.player && this.player({ when, step })
    }
  }

  toggle () {
    this.active = !this.active
  }
}

export default Clip
