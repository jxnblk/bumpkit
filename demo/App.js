
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
  Slider,
  Toolbar,
  Space,
  Divider,
  Pre,
} from 'rebass'
import log from 'loglevel'
log.setLevel('info')

import Bumpkit from '../src'


class App extends React.Component {
  constructor () {
    super()
    this.state = {
      playing: null,
      tracks: []
    }
    this.bump = new Bumpkit({ tempo: 160 })
    this.bump.subscribe(this.update.bind(this))

    this.handleChange = this.handleChange.bind(this)
    this.toggleStep = this.toggleStep.bind(this)
  }

  update (state) {
    this.setState(state)
  }

  handleChange (e) {
    const { name, value } = e.target
    this.bump.setState({ [name]: value })
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
    const drums = '/demo/samples/drums-1.mp3'

    this.bump.setState({
      // loop: 64,
      // tempo: 180
    })

    const sampler = this.bump.createClip(Bumpkit.Sampler, { url: drums })
    const beep = this.bump.createClip(Bumpkit.Beep)
    const b2 = this.bump.createClip(Bumpkit.Beep)

    const loop1 = new Bumpkit.Looper(this.bump, {
      url: drums,
      length: 16,
      bpm: 200,
      start: 1,
      end: 16,
      loop: 6,
    })

    const loop2 = new Bumpkit.Looper(this.bump, {
      url: drums,
      length: 64,
      bpm: 160,
      start: 0,
      end: 64,
      loop: 64,
    })
    const loop3 = new Bumpkit.Looper(this.bump, {
      url: '/demo/samples/chords-4.mp3',
      length: 8,
      bpm: 160,
      start: 0,
      end: 16,
      loop: 64,
    })

    sampler.pattern = [
      // 1, 0, 0, 0, 0, 0, 0, 0,
      // 1, 0, 0, 0, 0, 0, 0, 0,
      // 1, 0, 0, 0, 0, 0, 0, 0,
      // 1, 0, 0, 0, 0, 0, 0, 0,
    ]
    sampler.instrument.pitch = 0.875
    sampler.instrument.duration = 0.5

    beep.instrument.frequency = 768
    beep.pattern = [
      0, 0, 0, 0,  0, 0, 0, 0,
      1, 0, 0, 0,  0, 0, 0, 0,
      0, 0, 0, 0,  0, 0, 0, 0,
      1, 0, 0, 0,  0, 0, 0, 0,
      0, 0, 0, 0,  0, 0, 0, 0,
      1, 0, 0, 0,  0, 0, 0, 0,
      0, 0, 0, 0,  0, 0, 0, 0,
      1, 0, 0, 0,  0, 0, 0, 0,
    ]

    b2.instrument.frequency = 256
    b2.pattern = [
      1, 0, 0, 0,  0, 0, 0, 0,
      0, 0, 0, 0,  0, 0, 0, 0,
      1, 0, 0, 0,  0, 0, 0, 0,
      0, 0, 0, 0,  0, 0, 0, 0,
      1, 0, 0, 0,  0, 0, 0, 0,
      0, 0, 0, 0,  0, 0, 0, 0,
      1, 0, 0, 0,  0, 0, 0, 0,
      0, 0, 0, 0,  0, 0, 0, 0,
    ]

    beep.instrument.volume = 1/32
    b2.instrument.volume = 1/32

    beep.active = false
    b2.active = false
    loop1.active = false
    loop2.active = true

  }

  render () {
    const { tempo, playing, step, tracks } = this.state
    const { position } = this.bump

    return (
      <Container>
        <PageHeader
          heading='Bumpkit Demo' />
        <Slider
          fill
          color='blue'
          label={`Tempo ${tempo} bpm`}
          name='tempo'
          min={32}
          max={256}
          value={tempo}
          onChange={this.handleChange} />
        <Toolbar>
          <Button
            onClick={this.bump.playPause}
            children={playing ? 'Pause' : 'Play'} />
          <Button
            onClick={this.bump.stop}
            children='Stop' />
          <Space auto />
          <Button
            backgroundColor='red'
            onClick={this.kill.bind(this)}
            children='KILL' />
        </Toolbar>
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
                  backgroundColor={step === j + 1 ? 'red' : (s ? 'blue' : 'gray')}
                  children={j + 1} />
              ))}
            </Flex>
          ))}
        </Block>
        <Progress max={1} value={(step + 0) / 63} />
        {/*
        <Pre children={`${Math.floor(step / 4) + 1}.${step % 4 + 1}`} />
        */}
        <Pre children={position} />
        <Divider />
        <Pre children={JSON.stringify(this.state, null, 2)} />
      </Container>
    )
  }
}

export default App
