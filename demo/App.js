
import React from 'react'
import { Flex, Box } from 'reflexbox'
import {
  Container,
  PageHeader,
  Block,
  Button,
  Input,
  ButtonOutline,
  Pre,
} from 'rebass'

import {
  Bumpkit,
  Beep,
  Sampler,
  Buffer,
  Clip
} from '../src'

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      playing: null,
    }
    this.bump = new Bumpkit()
    this.bump.subscribe(this.update.bind(this))
    this.bump.clock.sync(this.sync.bind(this))
    // this.bump.clock.sync(this.setState)

    this.toggleStep = this.toggleStep.bind(this)
  }

  sync (payload) {
    this.setState(payload)
  }

  update (state) {
    console.log('update', state)
    this.setState(state)
  }

  toggleStep (i) {
    return (e) => {
      const { clip } = this.state
      clip.pattern[i] = 1 - clip.pattern[i]
      this.setState({ clip })
    }
  }

  componentDidMount () {
    const kick = 'http://jxnblk.s3.amazonaws.com/stepkit/dusty/kick.mp3'
    const v4 = 'http://jxnblk.s3.amazonaws.com/stepkit/dusty/vocal-4.mp3'

    const sampler = new Sampler(this.bump.context)
    const beep = new Beep(this.bump.context)

    sampler.load(kick)
    sampler.clip.pattern = [
      1, 0, 0, 0, 1, 0, 0, 0,
      1, 0, 0, 0, 1, 0, 0, 0,
    ]
    beep.frequency = 512
    const clip = new Clip([
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 0, 0, 1, 0,
    ])
    clip.connect(beep)
    this.bump.clock.sync(clip.play)
    this.bump.clock.sync(sampler.clip.play)
    this.setState({
      sampler,
      clip
    })
    this.bump.setState({
      loop: 16,
      tempo: 120
    })
  }

  render () {
    const { playing, step, sampler, clip } = this.state

    return (
      <Container>
        <PageHeader
          heading='b' />
        <Button
          onClick={this.bump.playPause}
          children={playing ? 'Pause' : 'Play'} />
        <Button
          onClick={() => sampler.play(0) }
          children='Kick' />
        <Block py={2}>
          <Flex justify='space-between'>
            {clip && clip.pattern.map((s, i) => (
              <Button
                key={i}
                style={{
                  flex: '1 1 auto'
                }}
                rounded={false}
                onClick={this.toggleStep(i)}
                backgroundColor={step === i ? 'red' : (s ? 'blue' : 'gray')}
                children={i} />
            ))}
          </Flex>
          <Flex justify='space-between'>
            {sampler && sampler.clip.pattern.map((s, i) => (
              <Button
                key={i}
                style={{
                  flex: '1 1 auto'
                }}
                rounded={false}
                onClick={this.toggleStep(i)}
                backgroundColor={step === i ? 'red' : (s ? 'blue' : 'gray')}
                children={i} />
            ))}
          </Flex>
        </Block>
        <Pre children={`${Math.floor(step / 4) + 1} : 4`} />
        <Pre children={`${step} : 16 - ${this.bump.clock.stepDuration}`} />
        <Pre children={JSON.stringify({}, null, 2)} />
      </Container>
    )
  }
}

export default App
