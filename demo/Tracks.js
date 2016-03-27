
import React from 'react'
import { Flex, Box } from 'reflexbox'
import {
  Block,
  Heading,
  LinkBlock,
  Progress,
  Pre,
  Text
} from 'rebass'
import Icon from 'react-geomicons'
import bk from './bumpkit'

const toggleLooper = (trackIndex, loopIndex) => (e) => {
  const { tracks, playing } = bk.getState()
  const track = tracks[trackIndex]
  const looper = track.loops[loopIndex].looper

  if (!looper.active) {
    track.loops.forEach(l => {
      l.looper.active = false
    })
  }
  looper.active = !looper.active

  bk.setState({ tracks })

  if (looper.active && !playing) {
    bk.play()
  }
}

const Tracks = ({ step, tracks = [] }) => (
  <Flex align='flex-start' gutter={2}>
    {tracks.map(({ name, loops }, i) => (
      <Box col={4} px={2} py={3} key={i}>
        <Heading level={3} mb={2} children={name} />
        {loops.map((loop, j) => {
          const active = loop.looper.active !== false
          return (
            <LinkBlock key={j}
              onClick={toggleLooper(i, j)}>
              <Block
                color={active ? 'white' : 'midgray'}
                backgroundColor={active ? 'blue' : null}
                borderLeft
                m={0}
                p={1}>
                <Heading level={4} children={loop.name} />
                <Text small
                  style={{
                    opacity: active ? 1 : 0
                  }}>
                  [ {step % loop.loop} : {loop.loop}]
                </Text>
              </Block>
              <Progress
                style={{
                  opacity: active ? 1 : 0,
                  height: 4,
                  borderRadius: 0
                }}
                value={step % loop.loop / (loop.loop - 1)} />
            </LinkBlock>
          )
        })}
      </Box>
    ))}
  </Flex>
)

export default Tracks

