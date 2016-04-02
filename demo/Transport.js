
import React from 'react'
import {
  Heading,
  NavItem,
  Progress,
  Space,
  Text,
  Toolbar
} from 'rebass'
import Icon from 'react-geomicons'
import bk from './bumpkit'

const Transport = ({ playing, tempo, loop, step }) => (
  <div>
    <Toolbar backgroundColor='black'>
      <Space />
      <NavItem
        title={playing ? 'Pause' : 'Play'}
        onClick={bk.playPause}>
        <Icon width={24} height={24} name={playing ? 'pause' : 'play'} />
      </NavItem>
      <Space />
      <Heading
        level={1}
        size={4}
        children='Bumpkit' />
      <Space />
      <Text small
        style={{
          textAlign: 'right',
          minWidth: 64
        }}
        children={bk.position} />
      <Text small
        style={{
          textAlign: 'right',
          minWidth: 64
        }}>
        {tempo} bpm
      </Text>
      <Space auto />
      <NavItem
        title='Stop'
        disabled={!playing}
        color={playing ? 'white' : 'midgray'}
        onClick={bk.stop}>
        <Icon name={playing ? 'speakerVolume' : 'speaker'} />
      </NavItem>
      <NavItem
        small
        color='red'
        title='Kill web audio context'
        onClick={bk.kill}>
        <Icon name='skull' />
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
      value={step / (loop - 1)} />
  </div>
)

export default Transport

