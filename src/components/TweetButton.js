import React, { useState, useContext } from 'react'
import { Button } from 'reakit'
import { post } from 'httpie'

import Auth, { PRIVATE_ENDPOINT } from '../utils/Auth'
import { ThreadContainer } from '../state'

const auth = new Auth()

export default () => {
  const [message, setMessage] = useState('')
  const { input } = useContext(ThreadContainer.Context)
  const { isAuthenticated } = auth

  const callPrivate = async () => {
    const token = auth.getToken()

    const res = await post(PRIVATE_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        user_id: auth.getUser().sub,
        message: input,
      },
    })

    const { data, statusCode } = res

    console.log(statusCode, data.message)
    setMessage(JSON.stringify(data.message))
  }

  return (
    <>
      <p>{message}</p>
      {isAuthenticated() && (
        <Button onClick={callPrivate}>Tweet your Thread</Button>
      )}
    </>
  )
}
