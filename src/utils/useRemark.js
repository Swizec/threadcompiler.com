import { useState, useEffect } from 'react'
import remark from 'remark'
import utf8 from 'remark-utf8'
import codeScreenshot from 'remark-code-screenshot'

export default function useRemark(input) {
  const [rendered, setRendered] = useState('')

  useEffect(() => {
    remark()
      .use(utf8)
      .use(codeScreenshot)
      .process(input, (err, output) => {
        if (err) {
          console.error(err)
        } else {
          setRendered(output.contents)
        }
      })
  }, [input])

  return rendered
}
