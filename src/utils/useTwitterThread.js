import { useState, useContext } from 'react'
import { post } from 'httpie'

import { ThreadContainer } from '../state'
import Auth, { PRIVATE_ENDPOINT } from '../utils/auth'
const auth = new Auth()

class APIError extends Error {
  constructor(message) {
    super(message)
    this.name = 'APIError'
  }
}

const sendTweet = async tweet => {
  const token = auth.getToken()

  try {
    const res = await post(PRIVATE_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        user_id: auth.getUser().sub,
        message: tweet,
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
    let tweet = input.split('---')[0]

    try {
      tweet = await sendTweet(tweet)
      setTweets([...tweets, tweet])
      setSuccess(true)
    } catch (error) {
      if (error.name === 'APIError') {
        setSuccess(false)
        setError(error.message)
      } else {
        throw error
      }
    }
  }

  return { tweets, error, success, sendTweets }
}
