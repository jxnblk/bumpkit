
import React from 'react'
import {
  Container,
  PageHeader,
  Button,
  ButtonOutline,
  Pre,
} from 'rebass'

import { Bumpkit, Beep, Clip } from '../src'

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      playing: null,
    }
    this.bump = new Bumpkit()
    this.beep = new Beep(this.bump.context)
    this.clip = new Clip([
      1, 0, 0, 0, 1, 0, 0, 0,
      1, 0, 0, 0, 1, 0, 0, 0,
    ])
    this.clip.connect(this.beep)
    this.bump.subscribe(this.update.bind(this))
    this.bump.clock.sync(this.sync.bind(this))
  }

  sync (payload) {
    if (payload.step % 4 === 0) {
      // console.log('sync', payload)
    }
    this.setState(payload)
  }

  update (state) {
    console.log('update', state)
    this.setState(state)
  }

  componentDidMount () {
    this.bump.setState({
      loop: 16,
      tempo: 80
    })
  }

  render () {
    const { playing, step } = this.state
    // console.log('stepDuration', this.bump.clock.stepDuration)

    return (
      <Container>
        <PageHeader
          heading='b' />
        <Button
          onClick={this.bump.playPause}
          children={playing ? 'Pause' : 'Play'} />
        <Pre children={`${Math.floor(step / 4) + 1} : 4`} />
        <Pre children={`${step} : 16 - ${this.bump.clock.stepDuration}`} />
        <Pre children={JSON.stringify(this.state, null, 2)} />
      </Container>
    )
  }
}

export default App
