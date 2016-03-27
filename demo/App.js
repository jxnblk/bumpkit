
import React from 'react'
import { Flex, Box } from 'reflexbox'
import {
  Container,
  PageHeader,
  Heading,
  Block,
  Button,
  Input,
  Select,
  ButtonOutline,
  Progress,
  Slider,
  Toolbar,
  Space,
  Divider,
  Pre,
} from 'rebass'
import log from 'loglevel'

// log.setLevel('info')

import Bumpkit from '../src'


class App extends React.Component {
  constructor () {
    super()
    this.state = {
      log: 'info',
      playing: null,
      tracks: []
    }
    this.bump = new Bumpkit({ tempo: 160 })
    this.bump.subscribe(this.update.bind(this))

    this.handleBumpChange = this.handleBumpChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.toggleStep = this.toggleStep.bind(this)
  }

  update (state) {
    this.setState(state)
  }

  handleBumpChange (e) {
    const { name, value } = e.target
    this.bump.setState({ [name]: value })
  }

  handleChange (e) {
    const { name, value } = e.target
    this.setState({ [name]: value }, () => {
      log.setLevel(this.state.log || 'silent')
    })
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
    this.bump.setState({
      loop: 64,
      tempo: 96
    })
    // url: '/demo/samples/forever/last-forever-vocal.mp3',
    // url: '/demo/samples/forever/last-forever-vocal-02.mp3',
    // url: '/demo/samples/forever/last-forever-vocal-03.mp3',
    // url: '/demo/samples/forever/last-forever-vocal-fill.mp3',

    const loop1 = new Bumpkit.Looper(this.bump, {
      url: '/demo/samples/forever/last-forever-bass-01.mp3',
      bpm: 96,
      loop: 32
    })
    const loop2 = new Bumpkit.Looper(this.bump, {
      url: '/demo/samples/forever/last-forever-beat-01.mp3',
      bpm: 96,
      loop: 16
    })
    const loop3 = new Bumpkit.Looper(this.bump, {
      url: '/demo/samples/forever/last-forever-vocal.mp3',
      bpm: 96,
      loop: 16
    })

    loop1.active = true
    loop2.active = true
    loop3.active = true
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
          min={64}
          max={128}
          value={tempo}
          onChange={this.handleBumpChange} />
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
        <Pre children={position} />
        <Divider />
        <Select
          name='log'
          label='Log Level'
          onChange={this.handleChange}
          options={[
            { children: 'silent' },
            { children: 'warn' },
            { children: 'info' },
            { children: 'debug' }
          ]} />
        <Pre children={JSON.stringify(this.state, null, 2)} />
      </Container>
    )
  }
}

export default App
