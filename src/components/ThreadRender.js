import React, { useContext } from 'react'
import styled from 'styled-components'

import useRemark from '../utils/useRemark'
import { ThreadContainer } from '../state'

const TweetStyle = styled.div`
  font-size: 27px;
  line-height: 32px;
  letter-spacing: 0.01em;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: 560px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #14171a;
  margin-bottom: 1.5em;
`

const CharCountStyle = styled.div`
  font-size: 17px;
  text-align: right;
`

const CharCount = ({ value }) => {
  return <CharCountStyle>{280 - value.length}</CharCountStyle>
}

const Tweet = ({ value }) => {
  const rendered = useRemark(value)

  return (
    <TweetStyle>
      {rendered}
      <CharCount value={rendered} />
    </TweetStyle>
  )
}

const ThreadRender = () => {
  const { input } = useContext(ThreadContainer.Context)

  return (
    <>
      {input.split('---').map((tweet, i) => (
        <Tweet value={tweet} key={i} />
      ))}
    </>
  )
}

export default ThreadRender
