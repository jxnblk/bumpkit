
import React from 'react'
import { Flex, Box } from 'reflexbox'
import {
  Container,
  PageHeader,
  Heading,
  Block,
  Button,
  Input,
  ButtonOutline,
  Progress,
  Divider,
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
      tracks: []
    }
    this.bump = new Bumpkit()
    this.bump.subscribe(this.update.bind(this))

    this.toggleStep = this.toggleStep.bind(this)
  }

  update (state) {
    // console.log('update', state)
    this.setState(state)
  }

  toggleStep (i, j) {
    return (e) => {
      const { tracks } = this.state
      tracks[i].pattern[j] = 1 - tracks[i].pattern[j]
      this.setState({ tracks })
    }
  }

  kill () {
    console.log('K I L L')
    this.bump.kill()
  }

  componentDidMount () {
    const kick = 'http://jxnblk.s3.amazonaws.com/stepkit/dusty/kick.mp3'
    const v4 = 'http://jxnblk.s3.amazonaws.com/stepkit/dusty/vocal-4.mp3'

    const sampler = this.bump.createSampler(kick)
    const beep = this.bump.createBeep()

    sampler.pattern = [
      1, 0, 0, 0, 1, 0, 0, 0,
      1, 0, 0, 0, 1, 0, 0, 0,
    ]
    beep.frequency = 512
    beep.pattern = [
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 0, 0, 1, 0,
    ]
    this.bump.setState({
      loop: 16,
      tempo: 96
    })
  }

  render () {
    const { playing, step, tracks } = this.state

    return (
      <Container>
        <PageHeader
          heading='Bumpkit Demo' />
        <Button
          onClick={this.bump.playPause}
          children={playing ? 'Pause' : 'Play'} />
        <Button
          backgroundColor='red'
          onClick={this.kill.bind(this)}
          children='KILL' />
        <Block py={2}>
          {tracks.map((track, i) => (
            <Flex key={i} justify='space-between'>
              {track && track.pattern.map((s, j) => (
                <Button
                  key={j}
                  style={{
                    flex: '1 1 auto'
                  }}
                  rounded={false}
                  onClick={this.toggleStep(i, j)}
                  backgroundColor={step === j ? 'red' : (s ? 'blue' : 'gray')}
                  children={j} />
              ))}
            </Flex>
          ))}
        </Block>
        <Progress max={1} value={(step + 0) / 15} />
        <Pre children={`${Math.floor(step / 4) + 1}.${step % 4 + 1}`} />
        <Divider />
        <Pre children={JSON.stringify(this.state, null, 2)} />
      </Container>
    )
  }
}

export default App
