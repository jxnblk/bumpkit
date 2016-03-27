
import React from 'react'
import { Flex, Box } from 'reflexbox'
import {
  Container,
  PageHeader,
  Heading,
  Block,
  Button,
  ButtonCircle,
  NavItem,
  Input,
  Select,
  ButtonOutline,
  Progress,
  Slider,
  Toolbar,
  Text,
  Space,
  Divider,
  Pre,
} from 'rebass'
import Icon from 'react-geomicons'
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
      <div>
        <Toolbar backgroundColor='black'>
          <Heading
            level={1}
            size={4}
            children='Bumpkit' />
          <Space />
          <NavItem
            title={playing ? 'Pause' : 'Play'}
            onClick={this.bump.playPause}>
            <Icon name={playing ? 'pause' : 'play'} />
          </NavItem>
          <Space />
          <Text small
            style={{
              textAlign: 'right',
              minWidth: 64
            }}
            children={position} />
          <Text small
            style={{
              textAlign: 'right',
              minWidth: 64
            }}>
            {tempo} bpm
          </Text>
          <Space />
          <NavItem
            title='Stop'
            disabled={!playing}
            onClick={this.bump.stop}>
            <Icon name={playing ? 'speakerVolume' : 'speaker'} />
          </NavItem>
          <Space auto />
          <NavItem
            small
            color='red'
            onClick={this.kill.bind(this)}>
            <Icon name='no' />
            <Space />
            KILL
          </NavItem>
        </Toolbar>
        <Progress
          style={{
            height: 4,
            margin: 0,
            borderRadius: 0
          }}
          max={1}
          value={(step + 0) / 63} />
        <Container>
          <Slider
            fill
            color='blue'
            label={`Tempo ${tempo} bpm`}
            name='tempo'
            min={64}
            max={128}
            value={tempo}
            onChange={this.handleBumpChange} />
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
      </div>
    )
  }
}

export default App
