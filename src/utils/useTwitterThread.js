import { useState, useContext } from 'react'
import { post } from 'httpie'

import { ThreadContainer } from '../state'
import Auth, { PRIVATE_ENDPOINT } from '../utils/auth'
import { renderTweet } from './useRemark'

const auth = new Auth()

class APIError extends Error {
  constructor(message) {
    super(message)
    this.name = 'APIError'
  }
}

const sendTweet = async (tweet, replyToId) => {
  const token = auth.getToken()

  try {
    const res = await post(PRIVATE_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        user_id: auth.getUser().sub,
        message: tweet,
        in_reply_to_status_id: replyToId,
      },
    })
    const { data, statusCode } = res

    if (statusCode === 200) {
      return data.message
    } else {
      throw new APIError(JSON.stringify(data))
    }
  } catch (err) {
    throw new APIError(err)
  }
}

export default function useTwitterThread() {
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')
  const [tweets, setTweets] = useState([])
  const { input } = useContext(ThreadContainer.Context)

  async function sendTweets() {
    const inputTweets = input.split('---')
    let prevTweet = null

    for (let tweet of inputTweets) {
      try {
        tweet = await renderTweet(tweet)
        tweet = await sendTweet(
          tweet.contents,
          prevTweet ? prevTweet.id_str : ''
        )

        prevTweet = tweet

        setTweets([...tweets, tweet])
        setSuccess(true)
      } catch (error) {
        if (error.name === 'APIError') {
          setError(error.message)
        } else {
          throw error
        }
      }
    }
  }

  return { tweets, error, success, sendTweets }
}
