import { useState } from 'react'
import createContainer from 'constate'

export function useThreadInput() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const update = event => setInput(event.target.value)

  return { input, update, output, setOutput }
}

const ThreadContainer = createContainer(useThreadInput)

export { ThreadContainer }
