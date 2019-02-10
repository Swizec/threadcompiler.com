import { useState, useEffect } from 'react'
import remark from 'remark'
import utf8 from 'remark-utf8'
import codeScreenshot from 'remark-code-screenshot'

export const renderTweet = input =>
  new Promise((resolve, reject) => {
    remark()
      .use(utf8)
      .use(codeScreenshot)
      .process(input, (err, output) => {
        if (err) {
          reject(err)
        } else {
          resolve(output)
        }
      })
  })

export default function useRemark(input) {
  const [rendered, setRendered] = useState('')

  useEffect(() => {
    renderTweet(input)
      .then(output => setRendered(output.contents))
      .catch(err => console.error(err))
  }, [input])

  return rendered
}
