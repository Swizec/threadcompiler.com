import React, { useState, useContext } from 'react'
import { Button } from 'reakit'
import { post } from 'httpie'
import TweetEmbed from 'react-tweet-embed'

import Auth, { PRIVATE_ENDPOINT } from '../utils/auth'
import { ThreadContainer } from '../state'

const auth = new Auth()

export default () => {
  const { isAuthenticated } = auth
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')
  const [tweet, setTweet] = useState({})
  const { output } = useContext(ThreadContainer.Context)

  const callPrivate = async () => {
    const token = auth.getToken()

    try {
      const res = await post(PRIVATE_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          user_id: auth.getUser().sub,
          message: output,
        },
      })
      const { data, statusCode } = res

      if (statusCode === 200) {
        setSuccess(true)
        setTweet(data.message)
      } else {
        setSuccess(false)
        setError(JSON.stringify(data))
      }
    } catch (err) {
      setSuccess(false)
      setError(JSON.stringify(err))
    }
  }

  return (
    <>
      {success ? (
        <div>
          <p>Great success! Your tweet looks like this 👇</p>
          <TweetEmbed id={tweet.id_str} />
        </div>
      ) : null}
      {error ? <p>Tweeting failed! {error}</p> : null}
      {isAuthenticated() && (
        <Button onClick={callPrivate}>Tweet your Thread</Button>
      )}
    </>
  )
}
