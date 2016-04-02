
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
          const { active, playing, willStop, willStart } = loop.looper
          const sx = {
            block: {
              opacity: willStop ? .5 : willStart ? (Math.floor(step / 2) % 2 ? .25 : .75) : 1,
              transition: 'opacity .2s linear'
            }
          }

          return (
            <LinkBlock key={j}
              mb={(j % 4 === 3) ? 4 : 0}
              onClick={toggleLooper(i, j)}>
              <Block
                style={sx.block}
                color={active ? 'white' : 'midgray'}
                backgroundColor={active ? 'blue' : null}
                borderLeft
                m={0}
                p={1}>
                <Heading level={4} children={loop.name} />
                <Text small
                  style={{
                    opacity: playing ? 1 : 0
                  }}>
                  [ {step % loop.loop} : {loop.loop}]
                </Text>
              </Block>
              <Progress
                style={{
                  opacity: playing ? 1 : 0,
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

