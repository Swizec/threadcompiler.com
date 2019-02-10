import React from 'react'
import { Button } from 'reakit'
import TweetEmbed from 'react-tweet-embed'

import Auth from '../utils/auth'
import useTwitterThread from '../utils/useTwitterThread'

const auth = new Auth()

export default () => {
  const { isAuthenticated } = auth
  const { tweets, success, error, sendTweets } = useTwitterThread()

  return (
    <>
      {success ? (
        <div>
          <p>Great success! Your tweet looks like this 👇</p>
          {tweets.map(tweet => (
            <TweetEmbed id={tweet.id_str} />
          ))}
        </div>
      ) : null}
      {error ? <p>Tweeting failed! {error}</p> : null}
      {isAuthenticated() && (
        <Button onClick={sendTweets}>Tweet your Thread</Button>
      )}
    </>
  )
}
