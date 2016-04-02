
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

import bk from './bumpkit'
import Transport from './Transport'
import Tracks from './Tracks'


class App extends React.Component {
  constructor () {
    super()
    this.state = {
      log: 'silent',
      step: 0,
      loop: 32
    }
    this.handleBumpChange = this.handleBumpChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    const state = bk.getState()
    this.setState(state)
    bk.subscribe(this.update.bind(this))
    log.setLevel(this.state.log)
  }

  update (state) {
    this.setState(state)
  }

  handleBumpChange (e) {
    const { name, value } = e.target
    bk.setState({ [name]: value })
  }

  handleChange (e) {
    const { name, value } = e.target
    this.setState({ [name]: value }, () => {
      log.setLevel(this.state.log || 'silent')
    })
  }

  render () {
    const { tempo, playing, step, loop, tracks } = this.state
    const { position } = bk

    return (
      <div>
        <Transport {...this.state} />
        <Container>
          <Tracks {...this.state} />
          <Divider />
          <Box py={3}>
            <Heading children='Debug' />
            <Flex gutter={2}>
              <Box col={6} px={2}>
                <Slider
                  fill
                  label={`Tempo ${tempo} bpm`}
                  name='tempo'
                  min={64}
                  max={128}
                  value={tempo}
                  onChange={this.handleBumpChange} />
              </Box>
              <Box col={6} px={2}>
                <Select
                  name='log'
                  label='Log Level'
                  onChange={this.handleChange}
                  value={this.state.log}
                  options={[
                    { children: 'silent' },
                    { children: 'warn' },
                    { children: 'info' },
                    { children: 'debug' }
                  ]} />
              </Box>
            </Flex>
          </Box>
        </Container>
      </div>
    )
  }
}

export default App
