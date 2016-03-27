
import expect from 'expect'
import Bumpkit from '../src/Bumpkit'
import Store from '../src/Store'
import Clock from '../src/Clock'

const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext

describe('Clock', () => {
  let clock
  let index = 0
  let w
  const inc = ({ step, when }) => {
    index = step
    w = when
  }

  const store = new Store()
  store.context = new AudioContext()

  store.setState({
    tempo: 120
  })

  it('should create a clock instance', () => {
    expect(() => {
      clock = new Clock(store)
    }).toNotThrow()
  })

  it('should have default state', () => {
    expect(clock.getState().tempo).toEqual(120)
  })
})

