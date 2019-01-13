import React, { useContext, useEffect, useState } from 'react'
import remark from 'remark'
import utf8 from 'remark-utf8'
import html from 'remark-html'

import { ThreadContainer } from '../state'

const ThreadRender = () => {
  const { input } = useContext(ThreadContainer.Context)
  const [rendered, setRendered] = useState('')

  useEffect(
    () => {
      remark()
        .use(utf8)
        .process(input, (err, output) => {
          if (err) {
            console.error(err)
          } else {
            setRendered(output.contents)
          }
        })
    },
    [input]
  )

  console.log(rendered)

  return <div>{rendered}</div>
}

export default ThreadRender
