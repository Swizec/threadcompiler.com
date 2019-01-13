import React, { useState, useContext } from 'react'
import { styled, Input } from 'reakit'
import { ThreadContainer } from '../state'

const Textarea = styled(Input)`
  width: 100%;
  min-height: 400px;
  background: #f7f7f7;
  color: #1f1f1f;
  font-family: monospace;
  font-size: 1.4em;
  padding: 0.5em;
`

const ThreadInput = () => {
  const { input, update } = useContext(ThreadContainer.Context)

  return <Textarea as="textarea" value={input} onChange={update} />
}

export default ThreadInput
